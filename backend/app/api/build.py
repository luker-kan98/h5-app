import json
import os
import re
import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.models.build_job import BuildJob
from app.models.build_request import BuildRequest
from app.models.build_task import BuildTask
from app.models.user import User
from app.schemas import BuildSubmitResponse, BuildStatusResponse, HistoryItem
from app.services.icon_service import IconValidationError, normalize_app_name, validate_icon_upload
from app.services.file_service import PLATFORM_FILENAMES, build_job_to_status_response, build_request_to_status_response
from app.services.build_scheduler import (
    estimate_request_wait_seconds,
    refresh_request_status,
    run_scheduler_once,
)
from app.services.resource_guard import resource_profile_name
from app.services.url_validator import validate_h5_url, UrlValidationError

VALID_PLATFORMS = {"android", "ios", "macos", "windows"}
BUILDS_DIR = os.getenv("BUILDS_DIR", "./builds")
ANDROID_PACKAGE_RE = re.compile(r"^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$")

router = APIRouter()


@router.post("/build", response_model=BuildSubmitResponse)
async def submit_build(
    h5_url: str = Form(...),
    platforms: List[str] = Form(...),
    app_name: str = Form(...),
    icon_file: UploadFile = File(...),
    android_package_name: Optional[str] = Form(None),
    keystore_file: Optional[UploadFile] = File(None),
    keystore_password: Optional[str] = Form(None),
    key_alias: Optional[str] = Form(None),
    key_password: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        app_name = normalize_app_name(app_name)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    # Validate URL
    try:
        validate_h5_url(h5_url)
    except UrlValidationError as e:
        raise HTTPException(status_code=422, detail=str(e))

    # Validate platforms
    invalid = set(platforms) - VALID_PLATFORMS
    if invalid or not platforms:
        raise HTTPException(status_code=422, detail=f"Invalid platforms: {invalid}")

    if "android" in platforms:
        if not android_package_name:
            raise HTTPException(status_code=422, detail="Android package name is required when android is selected")
        android_package_name = android_package_name.strip()
        if not ANDROID_PACKAGE_RE.fullmatch(android_package_name):
            raise HTTPException(status_code=422, detail="Invalid Android package name")
    elif android_package_name:
        android_package_name = android_package_name.strip()
        if android_package_name and not ANDROID_PACKAGE_RE.fullmatch(android_package_name):
            raise HTTPException(status_code=422, detail="Invalid Android package name")

    icon_contents = await icon_file.read()
    try:
        validate_icon_upload(icon_contents, icon_file.content_type)
    except IconValidationError as e:
        raise HTTPException(status_code=422, detail=str(e))

    # Handle optional keystore upload
    keystore_contents = None
    if keystore_file is not None:
        keystore_contents = await keystore_file.read()
        if len(keystore_contents) == 0:
            raise HTTPException(status_code=422, detail="Keystore file is empty")
        if len(keystore_contents) > 1_048_576:
            raise HTTPException(status_code=422, detail="Keystore file too large (max 1 MB)")

    request_uuid = str(uuid.uuid4())
    build_request = BuildRequest(
        request_id=request_uuid,
        user_id=current_user.id,
        h5_url=h5_url,
        app_name=app_name,
        status="submitted",
        requested_platforms=json.dumps(platforms),
        android_package_name=android_package_name,
    )
    db.add(build_request)
    db.commit()
    db.refresh(build_request)

    icon_dir = os.path.join(BUILDS_DIR, f"icon-{build_request.id}")
    os.makedirs(icon_dir, exist_ok=True)
    icon_path = os.path.abspath(os.path.join(icon_dir, "app-icon.png"))
    with open(icon_path, "wb") as f:
        f.write(icon_contents)
    build_request.icon_path = icon_path

    if keystore_file is not None:
        ks_dir = os.path.join(BUILDS_DIR, f"ks-{build_request.id}")
        os.makedirs(ks_dir, exist_ok=True)
        ks_path = os.path.abspath(os.path.join(ks_dir, "custom.jks"))
        with open(ks_path, "wb") as f:
            f.write(keystore_contents)
        build_request.keystore_path = ks_path
        build_request.keystore_password = keystore_password or "changeit"
        build_request.key_alias = key_alias or "h5packager"
        build_request.key_password = key_password or "changeit"

    tasks = [
        BuildTask(
            task_id=str(uuid.uuid4()),
            request_id=build_request.id,
            platform=platform,
            status="submitted",
            priority=build_request.priority,
            resource_profile=resource_profile_name(platform),
        )
        for platform in platforms
    ]
    db.add_all(tasks)
    db.commit()
    for task in tasks:
        db.refresh(task)

    try:
        run_scheduler_once(db)
    except Exception:
        # Submission must stay durable even if the scheduler is temporarily unavailable.
        pass

    db.refresh(build_request)
    refresh_request_status(db, build_request.id)
    estimate = estimate_request_wait_seconds(db, build_request.id)

    return BuildSubmitResponse(
        task_id=build_request.request_id,
        request_id=build_request.request_id,
        task_ids=[task.task_id for task in tasks],
        queue_state=build_request.status,
        estimated_wait_seconds=estimate,
    )


@router.get("/build/{task_id}", response_model=BuildStatusResponse)
def get_build_status(
    task_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    build_request = db.query(BuildRequest).filter(
        BuildRequest.request_id == task_id,
        BuildRequest.user_id == current_user.id,
    ).first()
    if build_request:
        refresh_request_status(db, build_request.id)
        db.refresh(build_request)
        tasks = (
            db.query(BuildTask)
            .filter(BuildTask.request_id == build_request.id)
            .order_by(BuildTask.created_at.asc(), BuildTask.id.asc())
            .all()
        )
        return build_request_to_status_response(
            build_request,
            tasks,
            estimate_request_wait_seconds(db, build_request.id),
        )

    job = db.query(BuildJob).filter(
        BuildJob.task_id == task_id,
        BuildJob.user_id == current_user.id,
    ).first()
    if not job:
        raise HTTPException(status_code=404, detail="Build job not found")
    return build_job_to_status_response(job)


@router.get("/files/{task_id}/{filename}")
def download_file(
    task_id: str,
    filename: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Authenticated file download — verifies task belongs to requesting user."""
    build_request = db.query(BuildRequest).filter(
        BuildRequest.request_id == task_id,
        BuildRequest.user_id == current_user.id,
    ).first()
    if build_request:
        platform = next((name for name, value in PLATFORM_FILENAMES.items() if value == filename), None)
        if platform is None:
            raise HTTPException(status_code=404, detail="File not found")
        task = db.query(BuildTask).filter(
            BuildTask.request_id == build_request.id,
            BuildTask.platform == platform,
        ).first()
        if task is None or not task.artifact_path:
            raise HTTPException(status_code=404, detail="File not found")
        file_path = task.artifact_path
    else:
        job = db.query(BuildJob).filter(
            BuildJob.task_id == task_id,
            BuildJob.user_id == current_user.id,
        ).first()
        if not job:
            raise HTTPException(status_code=404, detail="Build job not found")
        file_path = os.path.join(BUILDS_DIR, task_id, filename)

    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, filename=filename)


@router.get("/builds/history", response_model=list[HistoryItem])
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    requests = (
        db.query(BuildRequest)
        .filter(BuildRequest.user_id == current_user.id)
        .order_by(BuildRequest.created_at.desc())
        .limit(50)
        .all()
    )
    if requests:
        return [
            HistoryItem(
                task_id=request.request_id,
                request_id=request.request_id,
                status=request.status,
                h5_url=request.h5_url,
                created_at=request.created_at,
                requested_platforms=json.loads(request.requested_platforms),
            )
            for request in requests
        ]

    jobs = (
        db.query(BuildJob)
        .filter(BuildJob.user_id == current_user.id)
        .order_by(BuildJob.created_at.desc())
        .limit(50)
        .all()
    )
    return [
        HistoryItem(
            task_id=j.task_id,
            request_id=j.task_id,
            status=j.status,
            h5_url=j.h5_url,
            created_at=j.created_at,
            requested_platforms=json.loads(j.requested_platforms),
        )
        for j in jobs
    ]
