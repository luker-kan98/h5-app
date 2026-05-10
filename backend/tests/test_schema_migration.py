import json
from pathlib import Path

from sqlalchemy.orm import sessionmaker


def _seed_legacy_data(engine):
    from app.models.build_job import BuildJob

    BuildJob.__table__.create(bind=engine)

    SessionFactory = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionFactory()
    try:
        job = BuildJob(
            task_id="legacy-request-id",
            h5_url="https://example.com",
            status="done",
            requested_platforms=json.dumps(["android", "ios"]),
            android_path="/tmp/legacy/android.apk",
            ios_error="xcode failed",
        )
        session.add(job)
        session.commit()
    finally:
        session.close()


def test_migrate_single_host_scheduler_creates_tables_and_backfills(tmp_path):
    from app.models.build_request import BuildRequest
    from app.models.build_task import BuildTask
    from app.services.schema_migration import create_engine_for_url, migrate_single_host_scheduler

    db_path = Path(tmp_path) / "migration.db"
    engine = create_engine_for_url(f"sqlite:///{db_path}")
    _seed_legacy_data(engine)

    summary = migrate_single_host_scheduler(engine=engine)

    SessionFactory = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionFactory()
    try:
        request = session.query(BuildRequest).filter(BuildRequest.request_id == "legacy-request-id").one()
        tasks = (
            session.query(BuildTask)
            .filter(BuildTask.request_id == request.id)
            .order_by(BuildTask.platform.asc())
            .all()
        )
    finally:
        session.close()

    assert summary.created_requests == 1
    assert summary.created_tasks == 2
    assert summary.migration_recorded is True

    assert request.h5_url == "https://example.com"
    assert request.status == "done"

    assert [task.platform for task in tasks] == ["android", "ios"]
    android_task = next(task for task in tasks if task.platform == "android")
    ios_task = next(task for task in tasks if task.platform == "ios")

    assert android_task.status == "done"
    assert android_task.artifact_path == "/tmp/legacy/android.apk"
    assert ios_task.status == "failed"
    assert ios_task.failure_message == "xcode failed"


def test_migrate_single_host_scheduler_is_idempotent(tmp_path):
    from app.models.build_request import BuildRequest
    from app.models.build_task import BuildTask
    from app.services.schema_migration import create_engine_for_url, migrate_single_host_scheduler

    db_path = Path(tmp_path) / "migration-idempotent.db"
    engine = create_engine_for_url(f"sqlite:///{db_path}")
    _seed_legacy_data(engine)

    first = migrate_single_host_scheduler(engine=engine)
    second = migrate_single_host_scheduler(engine=engine)

    SessionFactory = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    session = SessionFactory()
    try:
        request_count = session.query(BuildRequest).count()
        task_count = session.query(BuildTask).count()
    finally:
        session.close()

    assert first.created_requests == 1
    assert first.created_tasks == 2
    assert first.migration_recorded is True

    assert second.created_requests == 0
    assert second.created_tasks == 0
    assert second.reused_requests == 1
    assert second.reused_tasks == 2
    assert second.migration_recorded is False

    assert request_count == 1
    assert task_count == 2
