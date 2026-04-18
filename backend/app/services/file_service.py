import json
import os
from app.models.build_job import BuildJob
from app.models.build_request import BuildRequest
from app.models.build_task import BuildTask

BUILDS_DIR = os.getenv("BUILDS_DIR", "./builds")

PLATFORM_FILENAMES = {
    "android": "android.apk",
    "ios": "ios-unsigned.app.zip",
    "macos": "macos.dmg",
    "windows": "windows-setup.exe",
}


def artifact_dir(task_id: str) -> str:
    return os.path.join(BUILDS_DIR, task_id)


def artifact_path(task_id: str, platform: str) -> str:
    return os.path.join(artifact_dir(task_id), PLATFORM_FILENAMES[platform])


def download_url(task_id: str, platform: str) -> str:
    return f"/files/{task_id}/{PLATFORM_FILENAMES[platform]}"


def task_download_url(task_id: str, platform: str, artifact_url: str | None) -> str:
    return artifact_url or download_url(task_id, platform)


def build_job_to_status_response(job: BuildJob) -> dict:
    """Convert BuildJob ORM object to the BuildStatusResponse dict format."""
    requested = json.loads(job.requested_platforms)
    platforms = {}
    for p in ["android", "ios", "macos", "windows"]:
        if p not in requested:
            continue
        path_val = getattr(job, f"{p}_path")
        err_val = getattr(job, f"{p}_error")

        if path_val:
            platforms[p] = {"status": "done", "download_url": download_url(job.task_id, p)}
        elif err_val:
            platforms[p] = {"status": "failed", "error": err_val}
        elif job.status == "running":
            platforms[p] = {"status": "running"}
        else:
            platforms[p] = {"status": "pending"}

    return {
        "task_id": job.task_id,
        "request_id": job.task_id,
        "status": job.status,
        "h5_url": job.h5_url,
        "created_at": job.created_at,
        "queue_state": job.status,
        "estimated_wait_seconds": 0,
        "platforms": platforms,
    }


def build_request_to_status_response(
    request: BuildRequest,
    tasks: list[BuildTask],
    estimated_wait_seconds: int = 0,
) -> dict:
    platforms = {
        task.platform: {
            "status": "done",
            "download_url": task_download_url(request.request_id, task.platform, task.artifact_url),
        }
        if task.artifact_path
        else {"status": "failed", "error": task.failure_message}
        if task.failure_message
        else {"status": "running"}
        if task.status in {"running", "uploading"}
        else {"status": "pending"}
        for task in tasks
    }

    queue_state = request.status
    if request.status in {"submitted", "waiting_capacity", "queued"}:
        queue_state = request.status
    elif any(task.status in {"running", "uploading"} for task in tasks):
        queue_state = "running"
    elif any(task.status == "waiting_capacity" for task in tasks):
        queue_state = "waiting_capacity"
    elif any(task.status == "queued" for task in tasks):
        queue_state = "queued"
    elif all(task.status == "done" for task in tasks):
        queue_state = "done"
    elif tasks and all(task.status in {"done", "failed", "cancelled"} for task in tasks):
        queue_state = "failed" if all(task.status == "failed" for task in tasks) else "done"

    return {
        "task_id": request.request_id,
        "request_id": request.request_id,
        "status": request.status,
        "h5_url": request.h5_url,
        "created_at": request.created_at,
        "queue_state": queue_state,
        "estimated_wait_seconds": estimated_wait_seconds,
        "platforms": platforms,
    }
