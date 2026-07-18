import json
import os
import plistlib
from pathlib import Path
from unittest.mock import MagicMock, patch

import pytest
from sqlalchemy.orm import sessionmaker


# ---------------------------------------------------------------------------
# _run helper
# ---------------------------------------------------------------------------

def test_run_raises_on_nonzero_exit():
    from app.tasks.build_task import _run
    with pytest.raises(RuntimeError, match="failed"):
        _run(["false"], cwd="/tmp")


def test_run_succeeds_on_zero_exit():
    from app.tasks.build_task import _run
    _run(["true"], cwd="/tmp")


# ---------------------------------------------------------------------------
# _build_android
# ---------------------------------------------------------------------------

def test_build_android_calls_flutter_build_apk():
    """_build_android runs flutter build apk with --dart-define=H5_URL."""
    from app.tasks.build_task import _build_android

    with patch("app.tasks.build_task._run") as mock_run:
        _build_android("https://example.com", "/tmp/flutter")

    mock_run.assert_called_once()
    cmd = mock_run.call_args[0][0]
    assert cmd[0] == "flutter"
    assert "build" in cmd
    assert "apk" in cmd
    assert any("H5_URL=https://example.com" in arg for arg in cmd)


def test_build_android_returns_expected_apk_path():
    from app.tasks.build_task import _build_android

    with patch("app.tasks.build_task._run"):
        result = _build_android("https://example.com", "/tmp/flutter")

    assert result == "/tmp/flutter/build/app/outputs/flutter-apk/app-release.apk"


def test_build_android_injects_keystore_params_into_env():
    """keystore_params dict values are injected into the env passed to _run."""
    from app.tasks.build_task import _build_android

    keystore_params = {
        "path": "/abs/path/custom.jks",
        "password": "secret",
        "alias": "myalias",
        "key_password": "keypass",
    }

    with patch("app.tasks.build_task._run") as mock_run:
        _build_android("https://example.com", "/tmp/flutter", keystore_params)

    call_kwargs = mock_run.call_args[1]
    assert "env" in call_kwargs
    env = call_kwargs["env"]
    assert env["KEYSTORE_PATH"] == "/abs/path/custom.jks"
    assert env["KEYSTORE_PASSWORD"] == "secret"
    assert env["KEY_ALIAS"] == "myalias"
    assert env["KEY_PASSWORD"] == "keypass"


def test_build_android_no_keystore_params_uses_os_environ():
    """Without keystore_params, env is derived from os.environ (default.jks picked up by Gradle)."""
    from app.tasks.build_task import _build_android

    with patch("app.tasks.build_task._run") as mock_run:
        _build_android("https://example.com", "/tmp/flutter")

    call_kwargs = mock_run.call_args[1]
    assert "env" in call_kwargs
    assert "KEYSTORE_PATH" not in call_kwargs["env"] or \
           call_kwargs["env"].get("KEYSTORE_PATH") == os.environ.get("KEYSTORE_PATH")


# ---------------------------------------------------------------------------
# _build_ios
# ---------------------------------------------------------------------------

def test_build_ios_calls_flutter_build_ios():
    from app.tasks.build_task import _build_ios

    with patch("app.tasks.build_task._run") as mock_run:
        _build_ios("https://example.com", "/tmp/flutter")

    cmd = mock_run.call_args[0][0]
    assert cmd[0] == "flutter"
    assert "ios" in cmd
    assert "--no-codesign" in cmd
    assert any("H5_URL=https://example.com" in arg for arg in cmd)


def test_build_ios_returns_runner_app_path():
    from app.tasks.build_task import _build_ios

    with patch("app.tasks.build_task._run"):
        result = _build_ios("https://example.com", "/tmp/flutter")

    assert result == "/tmp/flutter/build/ios/iphoneos/Runner.app"


def test_ios_template_declares_buildable_umeng_and_firebase_sources():
    repo_root = Path(__file__).resolve().parents[2]
    ios_dir = repo_root / "flutter-wrapper/ios"

    podfile = (ios_dir / "Podfile").read_text(encoding="utf-8")
    podfile_lock = (ios_dir / "Podfile.lock").read_text(encoding="utf-8")
    app_delegate = (ios_dir / "Runner/AppDelegate.swift").read_text(encoding="utf-8")
    project_file = (ios_dir / "Runner.xcodeproj/project.pbxproj").read_text(encoding="utf-8")

    assert "pod 'UMCommon', '~> 7.6.2'" in podfile
    assert "pod 'UMDevice', '~> 2.2.0'" in podfile
    assert "UMCommon (7.6.2)" in podfile_lock
    assert "UMDevice (2.2.1)" in podfile_lock
    # Analytics uses UMCommon/MobClick only. The unused UMAPM binary is hosted
    # separately and can make otherwise valid builds fail during download.
    assert "pod 'UMAPM'" not in podfile
    assert "UMAPM (" not in podfile_lock
    assert "pod 'UMCCommonLog'" not in podfile
    # UMAPM 1.6.x has no Swift module map and must never be imported directly.
    assert "import UMAPM" not in app_delegate
    # The helper existed on disk but was previously absent from the Runner target.
    assert "FirebaseBridgeHelper.swift in Sources" in project_file


_COCOAPODS_STALE_ERROR = (
    "Command flutter failed:\n"
    "stderr:\n"
    "[!] CocoaPods's specs repository is too out-of-date to satisfy dependencies.\n"
    "To update the CocoaPods specs, run:\n"
    "  pod repo update\n"
)


def test_build_ios_refreshes_stale_cocoapods_repo_and_retries():
    """A stale CocoaPods specs repo triggers `pod repo update`, then a rebuild."""
    from app.tasks.build_task import _build_ios

    calls = []
    flutter_attempts = {"n": 0}

    def fake_run(cmd, cwd=None, env=None):
        calls.append((cmd, cwd))
        if cmd[0] == "flutter":
            flutter_attempts["n"] += 1
            if flutter_attempts["n"] == 1:
                raise RuntimeError(_COCOAPODS_STALE_ERROR)

    with patch("app.tasks.build_task._run", side_effect=fake_run):
        result = _build_ios("https://example.com", "/tmp/flutter")

    assert [cmd[0] for cmd, _ in calls] == ["flutter", "pod", "flutter"]
    assert calls[1] == (["pod", "repo", "update"], "/tmp/flutter/ios")
    assert result == "/tmp/flutter/build/ios/iphoneos/Runner.app"


def test_build_ios_does_not_retry_unrelated_errors():
    from app.tasks.build_task import _build_ios

    with patch(
        "app.tasks.build_task._run",
        side_effect=RuntimeError("Command flutter failed:\nstderr:\nSwift compile error"),
    ) as mock_run:
        with pytest.raises(RuntimeError, match="compile error"):
            _build_ios("https://example.com", "/tmp/flutter")

    # No `pod repo update`, no retry -- only the single failed build attempt.
    assert mock_run.call_count == 1


@pytest.mark.parametrize(
    "message, expected",
    [
        (_COCOAPODS_STALE_ERROR, True),
        ("CocoaPods could not satisfy dependencies; run pod repo update", True),
        ("Command flutter failed: Swift compile error", False),
        ("npm ERR! out-of-date lockfile", False),
    ],
)
def test_is_cocoapods_stale_error(message, expected):
    from app.tasks.build_task import _is_cocoapods_stale_error

    assert _is_cocoapods_stale_error(message) is expected


# ---------------------------------------------------------------------------
# _build_macos (Electron)
# ---------------------------------------------------------------------------

def test_build_macos_calls_electron_builder():
    from app.tasks.build_task import _build_macos

    with patch("app.tasks.build_task._run") as mock_run, \
         patch("app.tasks.build_task.os.listdir", return_value=["H5 App-1.0.0.dmg"]):
        result = _build_macos("https://example.com", "/tmp/electron")

    mock_run.assert_called_once()
    cmd = mock_run.call_args[0][0]
    assert cmd == ["npm", "run", "build:mac"]
    assert mock_run.call_args[1]["cwd"] == "/tmp/electron"
    assert result.endswith(".dmg")


# ---------------------------------------------------------------------------
# _build_windows (Electron)
# ---------------------------------------------------------------------------

def test_build_windows_calls_electron_builder():
    from app.tasks.build_task import _build_windows

    with patch("app.tasks.build_task._run") as mock_run, \
         patch("app.tasks.build_task.os.listdir", return_value=["H5 App Setup 1.0.0.exe"]):
        result = _build_windows("https://example.com", "/tmp/electron")

    mock_run.assert_called_once()
    cmd = mock_run.call_args[0][0]
    assert cmd == ["npm", "run", "build:win"]
    assert mock_run.call_args[1]["cwd"] == "/tmp/electron"
    assert result.endswith(".exe")


# ---------------------------------------------------------------------------
# workspace preparation helpers
# ---------------------------------------------------------------------------

def test_configure_android_project_updates_label_and_package(tmp_path):
    from app.tasks.build_task import _configure_android_project

    flutter_dir = tmp_path / "flutter"
    manifest_path = flutter_dir / "android/app/src/main/AndroidManifest.xml"
    gradle_path = flutter_dir / "android/app/build.gradle.kts"
    old_activity_path = flutter_dir / "android/app/src/main/kotlin/com/h5packager/h5_app/MainActivity.kt"

    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    gradle_path.parent.mkdir(parents=True, exist_ok=True)
    old_activity_path.parent.mkdir(parents=True, exist_ok=True)

    manifest_path.write_text(
        '<application android:label="h5_app" android:icon="@mipmap/ic_launcher"></application>',
        encoding="utf-8",
    )
    gradle_path.write_text(
        'android {\n    namespace = "com.h5packager.h5_app"\n    defaultConfig {\n'
        '        applicationId = "com.h5packager.h5_app"\n    }\n}\n',
        encoding="utf-8",
    )
    old_activity_path.write_text(
        "package com.h5packager.h5_app\n\nclass MainActivity\n",
        encoding="utf-8",
    )

    _configure_android_project(str(flutter_dir), "Example App", "com.example.app")

    assert 'android:label="Example App"' in manifest_path.read_text(encoding="utf-8")
    gradle_text = gradle_path.read_text(encoding="utf-8")
    assert 'namespace = "com.example.app"' in gradle_text
    assert 'applicationId = "com.example.app"' in gradle_text

    new_activity_path = flutter_dir / "android/app/src/main/kotlin/com/example/app/MainActivity.kt"
    assert new_activity_path.exists()
    assert "package com.example.app" in new_activity_path.read_text(encoding="utf-8")
    assert not old_activity_path.exists()


def test_configure_android_project_moves_sidecar_kotlin_sources(tmp_path):
    from app.tasks.build_task import _configure_android_project

    flutter_dir = tmp_path / "flutter"
    kotlin_pkg_dir = (
        flutter_dir / "android/app/src/main/kotlin/com/h5packager/h5_app"
    )
    manifest_path = flutter_dir / "android/app/src/main/AndroidManifest.xml"
    gradle_path = flutter_dir / "android/app/build.gradle.kts"

    manifest_path.parent.mkdir(parents=True, exist_ok=True)
    gradle_path.parent.mkdir(parents=True, exist_ok=True)
    kotlin_pkg_dir.mkdir(parents=True, exist_ok=True)

    manifest_path.write_text(
        '<application android:label="h5_app"></application>', encoding="utf-8"
    )
    gradle_path.write_text(
        'android {\n    namespace = "com.h5packager.h5_app"\n    defaultConfig {\n'
        '        applicationId = "com.h5packager.h5_app"\n    }\n}\n',
        encoding="utf-8",
    )
    (kotlin_pkg_dir / "MainActivity.kt").write_text(
        "package com.h5packager.h5_app\n\n"
        "class MainActivity { fun f() { FirebaseBridgeHelper.init() } }\n",
        encoding="utf-8",
    )
    (kotlin_pkg_dir / "FirebaseBridgeHelper.kt").write_text(
        "package com.h5packager.h5_app\n\nobject FirebaseBridgeHelper\n",
        encoding="utf-8",
    )
    (kotlin_pkg_dir / "ProxyControllerPlugin.kt").write_text(
        "package com.h5packager.h5_app\n\nclass ProxyControllerPlugin\n",
        encoding="utf-8",
    )

    _configure_android_project(str(flutter_dir), "Example App", "com.example.app")

    new_pkg_dir = flutter_dir / "android/app/src/main/kotlin/com/example/app"
    for name in ("MainActivity.kt", "FirebaseBridgeHelper.kt", "ProxyControllerPlugin.kt"):
        moved = new_pkg_dir / name
        assert moved.exists(), f"{name} was not moved to new package dir"
        assert "package com.example.app" in moved.read_text(encoding="utf-8")

    # Old package directory must be fully cleaned up.
    assert not kotlin_pkg_dir.exists()


def test_configure_ios_project_updates_bundle_names(tmp_path):
    from app.tasks.build_task import _configure_ios_project

    flutter_dir = tmp_path / "flutter"
    info_plist_path = flutter_dir / "ios/Runner/Info.plist"
    info_plist_path.parent.mkdir(parents=True, exist_ok=True)

    with open(info_plist_path, "wb") as f:
        plistlib.dump(
            {
                "CFBundleDisplayName": "H5 App",
                "CFBundleName": "h5_app",
            },
            f,
        )

    _configure_ios_project(str(flutter_dir), "Example App")

    with open(info_plist_path, "rb") as f:
        plist_data = plistlib.load(f)
    assert plist_data["CFBundleDisplayName"] == "Example App"
    assert plist_data["CFBundleName"] == "Example App"


def test_prepare_electron_updates_metadata_and_icons(tmp_path):
    from app.tasks.build_task import _prepare_electron

    source_dir = tmp_path / "electron-src"
    source_dir.mkdir()
    (source_dir / "main.js").write_text("const H5_URL = '__H5_URL__';\n", encoding="utf-8")
    (source_dir / "package.json").write_text(
        json.dumps(
            {
                "name": "demo",
                "build": {
                    "productName": "H5 App",
                    "mac": {"target": "dmg"},
                    "win": {"target": "nsis"},
                },
            }
        ),
        encoding="utf-8",
    )

    with patch("app.tasks.build_task.ELECTRON_WRAPPER_SRC", str(source_dir)), \
         patch("app.tasks.build_task._run"), \
         patch(
             "app.tasks.build_task.generate_macos_icon",
             side_effect=lambda _icon, electron_dir: str(Path(electron_dir) / "build-resources/icon.icns"),
         ), \
         patch(
             "app.tasks.build_task.generate_windows_icon",
             side_effect=lambda _icon, electron_dir: str(Path(electron_dir) / "build-resources/icon.ico"),
         ):
        electron_dir = _prepare_electron(
            "https://example.com",
            "Example App",
            "/tmp/icon.png",
            str(tmp_path / "work"),
            ["macos", "windows"],
        )

    assert "__H5_URL__" not in Path(electron_dir, "main.js").read_text(encoding="utf-8")
    package_data = json.loads(Path(electron_dir, "package.json").read_text(encoding="utf-8"))
    assert package_data["build"]["productName"] == "Example App"
    assert package_data["build"]["mac"]["icon"] == "build-resources/icon.icns"
    assert package_data["build"]["win"]["icon"] == "build-resources/icon.ico"


def test_execute_build_task_uploads_artifact_to_s3_and_persists_url(db, tmp_path):
    from app.models.build_request import BuildRequest
    from app.models.build_task import BuildTask

    request = BuildRequest(
        request_id="request-s3-1",
        h5_url="https://example.com",
        app_name="Example App",
        requested_platforms=json.dumps(["android"]),
        status="queued",
        android_package_name="com.example.app",
    )
    db.add(request)
    db.commit()
    db.refresh(request)

    task = BuildTask(
        task_id="task-s3-1",
        request_id=request.id,
        platform="android",
        status="queued",
        resource_profile="android",
    )
    db.add(task)
    db.commit()

    source_artifact = tmp_path / "app-release.apk"
    source_artifact.write_bytes(b"fake-apk")

    output_dir = tmp_path / request.request_id
    output_path = output_dir / "android.apk"
    worker_tmp = tmp_path / "worker-tmp"
    worker_tmp.mkdir()

    engine = db.get_bind()
    SessionFactory = sessionmaker(bind=engine)

    with patch("app.tasks.build_task._get_db", side_effect=lambda: SessionFactory()), \
         patch("app.tasks.build_task.PLATFORM_BUILDERS", {
             "android": MagicMock(return_value=str(source_artifact))
         }), \
         patch("app.tasks.build_task.shutil.copytree"), \
         patch("app.tasks.build_task._prepare_flutter_workspace"), \
         patch("app.tasks.build_task._run"), \
         patch("app.tasks.build_task.tempfile.mkdtemp", return_value=str(worker_tmp)), \
         patch("app.tasks.build_task.s3_upload_configured", return_value=True), \
         patch(
             "app.tasks.build_task.upload_build_artifact",
             return_value=(
                 "uploads/request-s3-1/android.apk",
                 "https://macosbuckets3.s3.ap-east-1.amazonaws.com/uploads/request-s3-1/android.apk",
             ),
         ) as mock_upload, \
         patch("app.tasks.build_task.run_scheduler_once"), \
         patch("app.tasks.build_task.refresh_request_status"), \
         patch("app.tasks.build_task.artifact_dir", return_value=str(output_dir)), \
         patch("app.tasks.build_task.artifact_path", return_value=str(output_path)), \
         patch("app.tasks.build_task.shutil.rmtree"):
        from app.tasks.build_task import execute_build_task
        execute_build_task.run(task.id)

    check_session = SessionFactory()
    try:
        refreshed = check_session.query(BuildTask).filter(BuildTask.id == task.id).one()
    finally:
        check_session.close()

    assert refreshed.status == "done"
    assert refreshed.artifact_path == str(output_path)
    assert refreshed.artifact_s3_key == "uploads/request-s3-1/android.apk"
    assert refreshed.artifact_url == "https://macosbuckets3.s3.ap-east-1.amazonaws.com/uploads/request-s3-1/android.apk"
    mock_upload.assert_called_once_with(str(output_path), "request-s3-1", "android.apk")


def test_execute_build_task_marks_failed_and_preserves_inputs_for_retry(db, tmp_path):
    """Mimics the real build failures (npm/CocoaPods blowing up): the task ends up
    `failed` with a message, and the persisted icon survives so the request can be
    retried via /rebuild without the user re-uploading anything.
    """
    from app.models.build_request import BuildRequest
    from app.models.build_task import BuildTask

    # A persisted build input that MUST outlive a failed build.
    icon_dir = tmp_path / "icon-fail"
    icon_dir.mkdir()
    icon_path = icon_dir / "app-icon.png"
    icon_path.write_bytes(b"png")

    request = BuildRequest(
        request_id="request-fail-1",
        h5_url="https://example.com",
        app_name="Fail App",
        requested_platforms=json.dumps(["android"]),
        status="queued",
        android_package_name="com.example.app",
        icon_path=str(icon_path),
    )
    db.add(request)
    db.commit()
    db.refresh(request)

    task = BuildTask(
        task_id="task-fail-1",
        request_id=request.id,
        platform="android",
        status="queued",
        resource_profile="android",
    )
    db.add(task)
    db.commit()

    worker_tmp = tmp_path / "worker-tmp"
    worker_tmp.mkdir()

    engine = db.get_bind()
    SessionFactory = sessionmaker(bind=engine)

    failing_builder = MagicMock(
        side_effect=RuntimeError("Command npm failed:\nstderr:\nelectron-builder cannot find wine")
    )

    with patch("app.tasks.build_task._get_db", side_effect=lambda: SessionFactory()), \
         patch("app.tasks.build_task.PLATFORM_BUILDERS", {"android": failing_builder}), \
         patch("app.tasks.build_task.shutil.copytree"), \
         patch("app.tasks.build_task._prepare_flutter_workspace"), \
         patch("app.tasks.build_task._run"), \
         patch("app.tasks.build_task.tempfile.mkdtemp", return_value=str(worker_tmp)), \
         patch("app.tasks.build_task.run_scheduler_once"), \
         patch("app.tasks.build_task.refresh_request_status"), \
         patch("app.tasks.build_task.artifact_dir", return_value=str(tmp_path / request.request_id)):
        from app.tasks.build_task import execute_build_task
        execute_build_task.run(task.id)

    check_session = SessionFactory()
    try:
        refreshed = check_session.query(BuildTask).filter(BuildTask.id == task.id).one()
    finally:
        check_session.close()

    assert refreshed.status == "failed"
    assert refreshed.failure_code == "build_failed"
    assert "npm failed" in refreshed.failure_message
    assert refreshed.finished_at is not None
    failing_builder.assert_called_once()
    # The icon input survives the failure -> retry/rebuild stays possible.
    assert icon_path.exists()


def test_execute_build_task_records_failure_even_when_session_transaction_poisoned(db, tmp_path):
    """Regression: a build can fail *after* its DB transaction is already in a
    failed state -- e.g. the Celery soft-time-limit signal interrupts a statement
    mid-flight. The except handler must roll back before recording the failure,
    otherwise the status write dies with PendingRollbackError (seen in the wild as
    "expected to update 1 row(s); N were matched") and the task is never marked
    failed -- which is why some failures showed up in the logs but never in the DB.
    """
    from app.models.build_request import BuildRequest
    from app.models.build_task import BuildTask

    request = BuildRequest(
        request_id="request-poison-1",
        h5_url="https://example.com",
        app_name="Poison App",
        requested_platforms=json.dumps(["android"]),
        status="queued",
        android_package_name="com.example.app",
    )
    db.add(request)
    db.commit()
    db.refresh(request)

    task = BuildTask(
        task_id="task-poison-1",
        request_id=request.id,
        platform="android",
        status="queued",
        resource_profile="android",
    )
    db.add(task)
    db.commit()

    worker_tmp = tmp_path / "worker-tmp"
    worker_tmp.mkdir()

    engine = db.get_bind()
    SessionFactory = sessionmaker(bind=engine)
    task_sessions = []

    def make_session():
        session = SessionFactory()
        task_sessions.append(session)
        return session

    def poison_then_fail(*_args, **_kwargs):
        # Leave the task's own session in a failed-flush state -- the same state
        # production hit when a flush raised mid-build (StaleDataError). A unique
        # constraint violation on flush marks the session "rollback pending" so any
        # further use raises PendingRollbackError until rollback() is called.
        session = task_sessions[0]
        session.add(BuildTask(
            task_id="task-poison-1",  # duplicate of the existing task_id
            request_id=request.id,
            platform="android",
            status="queued",
            resource_profile="android",
        ))
        try:
            session.flush()
        except Exception:
            pass  # session now requires rollback before any further use
        raise RuntimeError("Command flutter failed:\nstderr:\ninterrupted mid-build")

    with patch("app.tasks.build_task._get_db", side_effect=make_session), \
         patch("app.tasks.build_task.PLATFORM_BUILDERS", {"android": poison_then_fail}), \
         patch("app.tasks.build_task.shutil.copytree"), \
         patch("app.tasks.build_task._prepare_flutter_workspace"), \
         patch("app.tasks.build_task._run"), \
         patch("app.tasks.build_task.tempfile.mkdtemp", return_value=str(worker_tmp)), \
         patch("app.tasks.build_task.run_scheduler_once"), \
         patch("app.tasks.build_task.refresh_request_status"), \
         patch("app.tasks.build_task.artifact_dir", return_value=str(tmp_path / request.request_id)):
        from app.tasks.build_task import execute_build_task
        # Must not raise: the failure has to be recorded cleanly, not crash the task.
        execute_build_task.run(task.id)

    check_session = SessionFactory()
    try:
        refreshed = check_session.query(BuildTask).filter(BuildTask.id == task.id).one()
    finally:
        check_session.close()

    assert refreshed.status == "failed"
    assert refreshed.failure_code == "build_failed"
    assert refreshed.finished_at is not None


# ---------------------------------------------------------------------------
# worker fork handling
# ---------------------------------------------------------------------------

def test_worker_process_init_disposes_inherited_pool():
    """Forked workers must drop the connection pool inherited from the parent so
    they don't share Postgres sockets (corruption -> ResourceClosedError)."""
    from app.tasks.build_task import _renew_db_connections_after_fork

    with patch("app.database.engine") as mock_engine:
        _renew_db_connections_after_fork()

    mock_engine.dispose.assert_called_once_with(close=False)


# ---------------------------------------------------------------------------
# input persistence for retry
# ---------------------------------------------------------------------------

def _make_request_with_inputs(db, tmp_path, request_id, platforms):
    from app.models.build_request import BuildRequest

    icon_dir = tmp_path / f"icon-{request_id}"
    icon_dir.mkdir()
    icon_path = icon_dir / "app-icon.png"
    icon_path.write_bytes(b"png")

    request = BuildRequest(
        request_id=request_id,
        h5_url=f"https://{request_id}.example.com",
        app_name=f"App {request_id}",
        requested_platforms=json.dumps(platforms),
        status="submitted",
        icon_path=str(icon_path),
    )
    db.add(request)
    db.commit()
    db.refresh(request)
    return request, icon_path


def _add_tasks(db, request, statuses):
    from app.models.build_task import BuildTask

    for platform, status in statuses.items():
        db.add(BuildTask(
            task_id=f"{request.request_id}-{platform}",
            request_id=request.id,
            platform=platform,
            status=status,
            resource_profile=platform,
        ))
    db.commit()


def test_inputs_preserved_when_a_task_failed(db, tmp_path):
    """A failed build keeps its icon/keystore on disk so it can be retried."""
    from app.tasks.build_task import _cleanup_request_inputs_if_succeeded

    request, icon_path = _make_request_with_inputs(db, tmp_path, "keep", ["android", "ios"])
    _add_tasks(db, request, {"android": "done", "ios": "failed"})

    _cleanup_request_inputs_if_succeeded(db, request)

    assert icon_path.exists()


def test_inputs_preserved_while_still_running(db, tmp_path):
    from app.tasks.build_task import _cleanup_request_inputs_if_succeeded

    request, icon_path = _make_request_with_inputs(db, tmp_path, "running", ["android", "ios"])
    _add_tasks(db, request, {"android": "done", "ios": "running"})

    _cleanup_request_inputs_if_succeeded(db, request)

    assert icon_path.exists()


def test_inputs_removed_when_all_tasks_succeeded(db, tmp_path):
    from app.tasks.build_task import _cleanup_request_inputs_if_succeeded

    request, icon_path = _make_request_with_inputs(db, tmp_path, "ok", ["android", "ios"])
    _add_tasks(db, request, {"android": "done", "ios": "done"})

    _cleanup_request_inputs_if_succeeded(db, request)

    assert not icon_path.exists()
