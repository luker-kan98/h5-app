from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import datetime, timezone

import app.models  # noqa: F401
from sqlalchemy import DateTime, MetaData, String, Table, Column, create_engine, select
from sqlalchemy.engine import Engine
from sqlalchemy.orm import Session, sessionmaker

from app.database import Base, DATABASE_URL
from app.models.build_job import BuildJob
from app.models.build_request import BuildRequest
from app.models.build_task import BuildTask
from app.services.build_scheduler import refresh_request_status
from app.services.resource_guard import resource_profile_name

MIGRATION_NAME = "2026-04-15_single_host_scheduler"


@dataclass(frozen=True)
class MigrationSummary:
    created_requests: int = 0
    created_tasks: int = 0
    reused_requests: int = 0
    reused_tasks: int = 0
    migration_recorded: bool = False


def create_engine_for_url(database_url: str) -> Engine:
    connect_args = {"check_same_thread": False, "timeout": 30} if database_url.startswith("sqlite") else {}
    return create_engine(database_url, connect_args=connect_args)


def ensure_schema_migrations_table(engine: Engine) -> Table:
    metadata = MetaData()
    schema_migrations = Table(
        "schema_migrations",
        metadata,
        Column("name", String, primary_key=True),
        Column("applied_at", DateTime, nullable=False),
    )
    metadata.create_all(bind=engine)
    return schema_migrations


def ensure_single_host_tables(engine: Engine) -> None:
    Base.metadata.create_all(bind=engine)


def _legacy_request_status(status: str) -> str:
    return {
        "pending": "submitted",
        "running": "running",
        "done": "done",
        "failed": "failed",
    }.get(status, "submitted")


def _legacy_task_payload(job: BuildJob, platform: str) -> dict:
    artifact_path = getattr(job, f"{platform}_path")
    failure_message = getattr(job, f"{platform}_error")

    if artifact_path:
        status = "done"
    elif failure_message:
        status = "failed"
    elif job.status == "running":
        status = "running"
    elif job.status == "pending":
        status = "submitted"
    elif job.status == "failed":
        status = "failed"
        failure_message = failure_message or "Legacy build job failed without platform-specific error"
    elif job.status == "done":
        status = "failed"
        failure_message = failure_message or "Legacy build job completed without platform artifact"
    else:
        status = "submitted"

    return {
        "status": status,
        "artifact_path": artifact_path,
        "failure_message": failure_message,
        "failure_code": "legacy_failed" if status == "failed" and failure_message else None,
        "queued_at": job.created_at if status in {"running", "done", "failed"} else None,
        "started_at": job.created_at if status in {"running", "done", "failed"} else None,
        "finished_at": job.finished_at if status in {"done", "failed", "cancelled"} else None,
        "wait_started_at": job.created_at if status in {"submitted", "waiting_capacity"} else None,
        "attempt": 1 if status in {"running", "done", "failed"} else 0,
    }


def _get_or_create_request(session: Session, job: BuildJob) -> tuple[BuildRequest, bool]:
    request = (
        session.query(BuildRequest)
        .filter(BuildRequest.request_id == job.task_id)
        .one_or_none()
    )
    if request is not None:
        return request, False

    request = BuildRequest(
        request_id=job.task_id,
        h5_url=job.h5_url,
        app_name="H5 App",
        requested_platforms=job.requested_platforms,
        status=_legacy_request_status(job.status),
        created_at=job.created_at,
        finished_at=job.finished_at,
    )
    session.add(request)
    session.flush()
    return request, True


def _get_or_create_task(session: Session, request: BuildRequest, job: BuildJob, platform: str) -> bool:
    legacy_task_id = f"{job.task_id}:{platform}"
    task = (
        session.query(BuildTask)
        .filter(BuildTask.task_id == legacy_task_id)
        .one_or_none()
    )
    if task is not None:
        return False

    payload = _legacy_task_payload(job, platform)
    task = BuildTask(
        task_id=legacy_task_id,
        request_id=request.id,
        platform=platform,
        status=payload["status"],
        priority=request.priority,
        queue_name=f"build.{platform}" if payload["status"] in {"running"} else None,
        attempt=payload["attempt"],
        resource_profile=resource_profile_name(platform),
        wait_started_at=payload["wait_started_at"],
        queued_at=payload["queued_at"],
        started_at=payload["started_at"],
        finished_at=payload["finished_at"],
        artifact_path=payload["artifact_path"],
        failure_code=payload["failure_code"],
        failure_message=payload["failure_message"],
        created_at=job.created_at,
    )
    session.add(task)
    session.flush()
    return True


def backfill_legacy_build_jobs(session: Session) -> MigrationSummary:
    created_requests = 0
    created_tasks = 0
    reused_requests = 0
    reused_tasks = 0

    jobs = session.query(BuildJob).order_by(BuildJob.created_at.asc(), BuildJob.id.asc()).all()
    for job in jobs:
        request, request_created = _get_or_create_request(session, job)
        if request_created:
            created_requests += 1
        else:
            reused_requests += 1

        try:
            platforms = json.loads(job.requested_platforms)
        except json.JSONDecodeError:
            platforms = []

        for platform in platforms:
            if _get_or_create_task(session, request, job, platform):
                created_tasks += 1
            else:
                reused_tasks += 1

        session.flush()
        refresh_request_status(session, request.id)

    return MigrationSummary(
        created_requests=created_requests,
        created_tasks=created_tasks,
        reused_requests=reused_requests,
        reused_tasks=reused_tasks,
        migration_recorded=False,
    )


def record_migration(session: Session, schema_migrations: Table, migration_name: str = MIGRATION_NAME) -> bool:
    existing = session.execute(
        select(schema_migrations.c.name).where(schema_migrations.c.name == migration_name)
    ).first()
    if existing is not None:
        return False

    session.execute(
        schema_migrations.insert().values(
            name=migration_name,
            applied_at=datetime.now(timezone.utc),
        )
    )
    return True


def migrate_single_host_scheduler(engine: Engine | None = None) -> MigrationSummary:
    target_engine = engine or create_engine_for_url(DATABASE_URL)
    schema_migrations = ensure_schema_migrations_table(target_engine)
    ensure_single_host_tables(target_engine)

    SessionFactory = sessionmaker(autocommit=False, autoflush=False, bind=target_engine)
    session = SessionFactory()
    try:
        summary = backfill_legacy_build_jobs(session)
        migration_recorded = record_migration(session, schema_migrations)
        session.commit()
        return MigrationSummary(
            created_requests=summary.created_requests,
            created_tasks=summary.created_tasks,
            reused_requests=summary.reused_requests,
            reused_tasks=summary.reused_tasks,
            migration_recorded=migration_recorded,
        )
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()
