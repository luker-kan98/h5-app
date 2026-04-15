from datetime import datetime, timezone
from uuid import uuid4

from sqlalchemy.orm import Session

from app.models.build_request import BuildRequest
from app.models.build_task import BuildTask
from app.services.host_monitor import collect_host_metrics, persist_host_metrics
from app.services.resource_guard import can_dispatch_task, can_enter_waiting_capacity


PLATFORM_QUEUES = {
    "android": "build.android",
    "ios": "build.ios",
    "macos": "build.macos",
    "windows": "build.windows",
}

TERMINAL_STATUSES = {"done", "failed", "cancelled"}


def promote_submitted_tasks(db: Session) -> int:
    promoted = 0
    tasks = (
        db.query(BuildTask)
        .filter(BuildTask.status == "submitted")
        .order_by(BuildTask.priority.desc(), BuildTask.created_at.asc(), BuildTask.id.asc())
        .all()
    )

    for task in tasks:
        decision = can_enter_waiting_capacity(db)
        if not decision.allowed:
            break
        task.status = "waiting_capacity"
        task.wait_started_at = task.wait_started_at or datetime.now(timezone.utc)
        promoted += 1

    if promoted:
        db.commit()
    return promoted


def dispatch_waiting_tasks(db: Session) -> int:
    from app.tasks.build_task import execute_build_task

    metrics = collect_host_metrics(db)
    persist_host_metrics(db, metrics)

    dispatched = 0
    tasks = (
        db.query(BuildTask)
        .filter(BuildTask.status == "waiting_capacity")
        .order_by(BuildTask.priority.desc(), BuildTask.wait_started_at.asc(), BuildTask.id.asc())
        .all()
    )

    for task in tasks:
        decision = can_dispatch_task(db, task, metrics)
        if not decision.allowed:
            continue

        task.status = "queued"
        task.queue_name = PLATFORM_QUEUES[task.platform]
        task.admission_token = str(uuid4())
        task.queued_at = datetime.now(timezone.utc)
        task.attempt += 1
        db.commit()

        celery_task = execute_build_task.apply_async(args=[task.id], queue=task.queue_name)
        task.celery_task_id = celery_task.id
        db.commit()
        dispatched += 1

    return dispatched


def run_scheduler_once(db: Session) -> dict[str, int]:
    promoted = promote_submitted_tasks(db)
    dispatched = dispatch_waiting_tasks(db)
    return {"promoted": promoted, "dispatched": dispatched}


def refresh_request_status(db: Session, request_id: int) -> str:
    request = db.query(BuildRequest).filter(BuildRequest.id == request_id).one()
    tasks = (
        db.query(BuildTask)
        .filter(BuildTask.request_id == request_id)
        .order_by(BuildTask.created_at.asc(), BuildTask.id.asc())
        .all()
    )

    if not tasks:
        request.status = "submitted"
    elif any(task.status in {"running", "uploading"} for task in tasks):
        request.status = "running"
    elif any(task.status == "queued" for task in tasks):
        request.status = "queued"
    elif any(task.status == "waiting_capacity" for task in tasks):
        request.status = "waiting_capacity"
    elif any(task.status == "submitted" for task in tasks):
        request.status = "submitted"
    elif all(task.status == "failed" for task in tasks):
        request.status = "failed"
        request.finished_at = datetime.now(timezone.utc)
    elif all(task.status in TERMINAL_STATUSES for task in tasks):
        request.status = "done"
        request.finished_at = datetime.now(timezone.utc)
    else:
        request.status = "submitted"

    db.commit()
    return request.status


def estimate_request_wait_seconds(db: Session, request_id: int) -> int:
    task = (
        db.query(BuildTask)
        .filter(BuildTask.request_id == request_id)
        .order_by(BuildTask.created_at.asc(), BuildTask.id.asc())
        .first()
    )
    if task is None or task.status in TERMINAL_STATUSES | {"running", "uploading"}:
        return 0

    waiting_count = (
        db.query(BuildTask)
        .filter(BuildTask.status.in_(["submitted", "waiting_capacity", "queued"]))
        .filter(BuildTask.created_at <= task.created_at)
        .count()
    )
    per_platform_parallelism = {
        "android": 4,
        "ios": 3,
        "macos": 2,
        "windows": 1,
    }
    average_duration_seconds = {
        "android": 8 * 60,
        "ios": 12 * 60,
        "macos": 10 * 60,
        "windows": 10 * 60,
    }
    return int(
        max(0, waiting_count - 1)
        * average_duration_seconds.get(task.platform, 10 * 60)
        / max(1, per_platform_parallelism.get(task.platform, 1))
    )
