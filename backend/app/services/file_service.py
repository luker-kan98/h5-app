import json
import os
from app.models.build_job import BuildJob

BUILDS_DIR = os.getenv("BUILDS_DIR", "./builds")

PLATFORM_FILENAMES = {
    "android": "android.apk",
    "ios": "ios-unsigned.app.zip",
    "macos": "macos.zip",
    "windows": "windows-setup.exe",
}


def artifact_dir(task_id: str) -> str:
    return os.path.join(BUILDS_DIR, task_id)


def artifact_path(task_id: str, platform: str) -> str:
    return os.path.join(artifact_dir(task_id), PLATFORM_FILENAMES[platform])


def download_url(task_id: str, platform: str) -> str:
    return f"/files/{task_id}/{PLATFORM_FILENAMES[platform]}"


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
        "status": job.status,
        "h5_url": job.h5_url,
        "created_at": job.created_at,
        "platforms": platforms,
    }
