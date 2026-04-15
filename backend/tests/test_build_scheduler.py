from unittest.mock import MagicMock, patch


def _seed_request(db, platform="android"):
    from app.models.build_request import BuildRequest
    from app.models.build_task import BuildTask
    from app.models.user import User

    user = User(username=f"user-{platform}", password="x")
    db.add(user)
    db.commit()

    request = BuildRequest(
        request_id=f"request-{platform}",
        user_id=user.id,
        h5_url="https://example.com",
        app_name="Example App",
        requested_platforms=f'["{platform}"]',
        status="submitted",
    )
    db.add(request)
    db.commit()
    db.refresh(request)

    task = BuildTask(
        task_id=f"task-{platform}",
        request_id=request.id,
        platform=platform,
        status="submitted",
        priority=0,
        resource_profile=platform,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return request, task


def test_scheduler_dispatches_waiting_task_when_resources_are_healthy(db):
    from app.services.build_scheduler import run_scheduler_once
    from app.services.host_monitor import HostMetrics
    from app.models.build_task import BuildTask

    _, task = _seed_request(db, "android")

    metrics = HostMetrics(
        host_name="test-host",
        cpu_percent=10.0,
        load_1m=1.0,
        memory_used_bytes=2 * 1024 ** 3,
        memory_available_bytes=18 * 1024 ** 3,
        swap_used_bytes=0,
        disk_free_bytes=200 * 1024 ** 3,
        active_task_count=0,
        waiting_task_count=1,
    )

    fake_result = MagicMock(id="celery-task-id")
    with patch("app.services.build_scheduler.collect_host_metrics", return_value=metrics), \
         patch("app.services.build_scheduler.persist_host_metrics"), \
         patch("app.tasks.build_task.execute_build_task.apply_async", return_value=fake_result):
        result = run_scheduler_once(db)

    db.refresh(task)
    assert result == {"promoted": 1, "dispatched": 1}
    assert task.status == "queued"
    assert task.queue_name == "build.android"
    assert task.celery_task_id == "celery-task-id"

    queued = db.query(BuildTask).filter(BuildTask.id == task.id).one()
    assert queued.status == "queued"


def test_scheduler_leaves_task_waiting_when_memory_is_high(db):
    from app.services.build_scheduler import run_scheduler_once
    from app.services.host_monitor import HostMetrics

    _, task = _seed_request(db, "android")

    metrics = HostMetrics(
        host_name="test-host",
        cpu_percent=10.0,
        load_1m=1.0,
        memory_used_bytes=18 * 1024 ** 3,
        memory_available_bytes=2 * 1024 ** 3,
        swap_used_bytes=0,
        disk_free_bytes=200 * 1024 ** 3,
        active_task_count=0,
        waiting_task_count=1,
    )

    with patch("app.services.build_scheduler.collect_host_metrics", return_value=metrics), \
         patch("app.services.build_scheduler.persist_host_metrics"), \
         patch("app.tasks.build_task.execute_build_task.apply_async") as mock_apply_async:
        result = run_scheduler_once(db)

    db.refresh(task)
    assert result == {"promoted": 1, "dispatched": 0}
    assert task.status == "waiting_capacity"
    mock_apply_async.assert_not_called()
