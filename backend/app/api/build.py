import json
import os
import re
import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, UploadFile
from fastapi.responses import FileResponse, RedirectResponse
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.i18n import t
from app.models.build_job import BuildJob
from app.models.build_request import BuildRequest
from app.models.build_sdk_config import BuildSdkConfig
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
from app.services.sdk_catalog import (
    SdkValidationError,
    parse_sdk_configs,
    validate_custom_js,
    validate_sdk_configs,
)
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
    custom_js: Optional[str] = Form(None),
    sdk_configs: Optional[str] = Form(None),
    language: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        app_name = normalize_app_name(app_name, language)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    try:
        validate_h5_url(h5_url, language)
    except UrlValidationError as e:
        raise HTTPException(status_code=422, detail=str(e))

    existing = db.query(BuildRequest).filter(
        BuildRequest.h5_url == h5_url,
        BuildRequest.status.notin_(["failed"]),
    ).first()
    if existing:
        raise HTTPException(status_code=409, detail=t("duplicate_url", language))

    existing_name = db.query(BuildRequest).filter(
        BuildRequest.app_name == app_name,
        BuildRequest.status.notin_(["failed"]),
    ).first()
    if existing_name:
        raise HTTPException(status_code=409, detail=t("duplicate_app_name", language))

    invalid = set(platforms) - VALID_PLATFORMS
    if invalid or not platforms:
        raise HTTPException(status_code=422, detail=t("invalid_platforms", language, invalid=invalid))

    if "android" in platforms:
        if not android_package_name:
            raise HTTPException(status_code=422, detail=t("android_package_required", language))
        android_package_name = android_package_name.strip()
        if not ANDROID_PACKAGE_RE.fullmatch(android_package_name):
            raise HTTPException(status_code=422, detail=t("invalid_android_package", language))
    elif android_package_name:
        android_package_name = android_package_name.strip()
        if android_package_name and not ANDROID_PACKAGE_RE.fullmatch(android_package_name):
            raise HTTPException(status_code=422, detail=t("invalid_android_package", language))

    if android_package_name:
        existing_pkg = db.query(BuildRequest).filter(
            BuildRequest.android_package_name == android_package_name,
            BuildRequest.status.notin_(["failed"]),
        ).first()
        if existing_pkg:
            raise HTTPException(status_code=409, detail=t("duplicate_package", language))

    icon_contents = await icon_file.read()
    try:
        validate_icon_upload(icon_contents, icon_file.content_type, language)
    except IconValidationError as e:
        raise HTTPException(status_code=422, detail=str(e))

    try:
        validated_custom_js = validate_custom_js(custom_js)
        parsed_sdk_configs = parse_sdk_configs(sdk_configs)
        validated_sdk_configs = validate_sdk_configs(parsed_sdk_configs, list(platforms))
    except SdkValidationError as e:
        raise HTTPException(status_code=422, detail=str(e))

    keystore_contents = None
    if keystore_file is not None:
        keystore_contents = await keystore_file.read()
        if len(keystore_contents) == 0:
            raise HTTPException(status_code=422, detail=t("keystore_empty", language))
        if len(keystore_contents) > 1_048_576:
            raise HTTPException(status_code=422, detail=t("keystore_too_large", language))

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

    if validated_custom_js or validated_sdk_configs:
        sdk_row = BuildSdkConfig(
            request_id=build_request.id,
            custom_js=validated_custom_js,
            sdk_configs=json.dumps(validated_sdk_configs, ensure_ascii=False),
        )
        db.add(sdk_row)

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
        # Roll back so the session is usable for the follow-up queries below.
        db.rollback()

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


@router.post("/rebuild/{request_id}", response_model=BuildSubmitResponse)
def rebuild(
    request_id: str,
    language: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    original = db.query(BuildRequest).filter(
        BuildRequest.request_id == request_id,
        BuildRequest.user_id == current_user.id,
    ).first()
    if not original:
        raise HTTPException(status_code=404, detail=t("build_request_not_found", language))
    if original.status != "failed":
        raise HTTPException(status_code=400, detail=t("only_failed_rebuild", language))
    if original.icon_path and not os.path.isfile(original.icon_path):
        raise HTTPException(status_code=422, detail=t("icon_missing_resubmit", language))

    platforms = json.loads(original.requested_platforms)
    new_request = BuildRequest(
        request_id=str(uuid.uuid4()),
        user_id=current_user.id,
        h5_url=original.h5_url,
        app_name=original.app_name,
        status="submitted",
        requested_platforms=original.requested_platforms,
        android_package_name=original.android_package_name,
        icon_path=original.icon_path,
        keystore_path=original.keystore_path,
        keystore_password=original.keystore_password,
        key_alias=original.key_alias,
        key_password=original.key_password,
    )
    db.add(new_request)
    db.commit()
    db.refresh(new_request)

    original_sdk = (
        db.query(BuildSdkConfig)
        .filter(BuildSdkConfig.request_id == original.id)
        .first()
    )
    if original_sdk is not None:
        db.add(
            BuildSdkConfig(
                request_id=new_request.id,
                custom_js=original_sdk.custom_js,
                sdk_configs=original_sdk.sdk_configs,
            )
        )

    tasks = [
        BuildTask(
            task_id=str(uuid.uuid4()),
            request_id=new_request.id,
            platform=platform,
            status="submitted",
            priority=new_request.priority,
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
        db.rollback()

    db.refresh(new_request)
    refresh_request_status(db, new_request.id)
    estimate = estimate_request_wait_seconds(db, new_request.id)

    return BuildSubmitResponse(
        task_id=new_request.request_id,
        request_id=new_request.request_id,
        task_ids=[task.task_id for task in tasks],
        queue_state=new_request.status,
        estimated_wait_seconds=estimate,
    )


@router.get("/build/{task_id}", response_model=BuildStatusResponse)
def get_build_status(
    task_id: str,
    language: Optional[str] = Query(None),
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
        raise HTTPException(status_code=404, detail=t("build_job_not_found", language))
    return build_job_to_status_response(job)


@router.get("/files/{task_id}/{filename}")
def download_file(
    task_id: str,
    filename: str,
    language: Optional[str] = Query(None),
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
            raise HTTPException(status_code=404, detail=t("file_not_found", language))
        task = db.query(BuildTask).filter(
            BuildTask.request_id == build_request.id,
            BuildTask.platform == platform,
        ).first()
        if task is None or not task.artifact_path:
            raise HTTPException(status_code=404, detail=t("file_not_found", language))
        if task.artifact_url:
            return RedirectResponse(task.artifact_url)
        file_path = task.artifact_path
    else:
        job = db.query(BuildJob).filter(
            BuildJob.task_id == task_id,
            BuildJob.user_id == current_user.id,
        ).first()
        if not job:
            raise HTTPException(status_code=404, detail=t("build_job_not_found", language))
        file_path = os.path.join(BUILDS_DIR, task_id, filename)

    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail=t("file_not_found", language))
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
