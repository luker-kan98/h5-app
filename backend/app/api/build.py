import json
import os
import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.models.build_job import BuildJob
from app.models.user import User
from app.schemas import BuildSubmitResponse, BuildStatusResponse, HistoryItem
from app.services.url_validator import validate_h5_url, UrlValidationError
from app.services.file_service import build_job_to_status_response, artifact_dir, PLATFORM_FILENAMES
from app.tasks.build_task import build_app

VALID_PLATFORMS = {"android", "ios", "macos", "windows"}
BUILDS_DIR = os.getenv("BUILDS_DIR", "./builds")

router = APIRouter()


@router.post("/build", response_model=BuildSubmitResponse)
async def submit_build(
    h5_url: str = Form(...),
    platforms: List[str] = Form(...),
    keystore_file: Optional[UploadFile] = File(None),
    keystore_password: Optional[str] = Form(None),
    key_alias: Optional[str] = Form(None),
    key_password: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Validate URL
    try:
        validate_h5_url(h5_url)
    except UrlValidationError as e:
        raise HTTPException(status_code=422, detail=str(e))

    # Validate platforms
    invalid = set(platforms) - VALID_PLATFORMS
    if invalid or not platforms:
        raise HTTPException(status_code=422, detail=f"Invalid platforms: {invalid}")

    # Create DB record
    job = BuildJob(
        task_id=str(uuid.uuid4()),
        user_id=current_user.id,
        h5_url=h5_url,
        status="pending",
        requested_platforms=json.dumps(platforms),
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    # Handle optional keystore upload
    keystore_params = None
    if keystore_file is not None:
        ks_dir = os.path.join(BUILDS_DIR, f"ks-{job.id}")
        os.makedirs(ks_dir, exist_ok=True)
        ks_path = os.path.abspath(os.path.join(ks_dir, "custom.jks"))
        contents = await keystore_file.read()
        if len(contents) == 0:
            raise HTTPException(status_code=422, detail="Keystore file is empty")
        if len(contents) > 1_048_576:
            raise HTTPException(status_code=422, detail="Keystore file too large (max 1 MB)")
        with open(ks_path, "wb") as f:
            f.write(contents)
        keystore_params = {
            "path": ks_path,
            "password": keystore_password or "changeit",
            "alias": key_alias or "h5packager",
            "key_password": key_password or "changeit",
        }

    # Enqueue Celery task and update task_id to Celery's actual id
    celery_task = build_app.delay(job.id, h5_url, platforms, keystore_params)
    job.task_id = celery_task.id
    db.commit()

    return BuildSubmitResponse(task_id=job.task_id)


@router.get("/build/{task_id}", response_model=BuildStatusResponse)
def get_build_status(
    task_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
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
            status=j.status,
            h5_url=j.h5_url,
            created_at=j.created_at,
            requested_platforms=json.loads(j.requested_platforms),
        )
        for j in jobs
    ]
