import os
import tempfile
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


# ---------------------------------------------------------------------------
# _build_macos
# ---------------------------------------------------------------------------

def test_build_macos_produces_dmg():
    from app.tasks.build_task import _build_macos

    with patch("app.tasks.build_task._run") as mock_run, \
         patch("app.tasks.build_task.os.listdir", return_value=["h5_app.app"]), \
         patch("app.tasks.build_task._find_signing_identity", return_value=None), \
         patch("app.tasks.build_task._create_dmg", return_value="/tmp/flutter/build/macos/Build/Products/Release/h5_app.dmg") as mock_dmg:
        result = _build_macos("https://example.com", "/tmp/flutter")

    cmd = mock_run.call_args_list[0][0][0]
    assert cmd[0] == "flutter"
    assert "macos" in cmd
    assert any("H5_URL=https://example.com" in arg for arg in cmd)
    mock_dmg.assert_called_once()
    assert result.endswith(".dmg")


def test_build_macos_codesigns_with_local_identity():
    from app.tasks.build_task import _build_macos

    with patch("app.tasks.build_task._run") as mock_run, \
         patch("app.tasks.build_task.os.listdir", return_value=["h5_app.app"]), \
         patch("app.tasks.build_task._find_signing_identity", return_value="Developer ID Application: Test (XXXXXXXXXX)"), \
         patch("app.tasks.build_task._create_dmg", return_value="/tmp/flutter/build/macos/Build/Products/Release/h5_app.dmg"):
        _build_macos("https://example.com", "/tmp/flutter")

    # flutter build + codesign + codesign --verify = 3 _run calls
    assert mock_run.call_count == 3
    codesign_cmd = mock_run.call_args_list[1][0][0]
    assert codesign_cmd[0] == "codesign"
    assert "Developer ID Application: Test (XXXXXXXXXX)" in codesign_cmd


def test_build_macos_skips_codesign_when_no_identity():
    from app.tasks.build_task import _build_macos

    with patch("app.tasks.build_task._run") as mock_run, \
         patch("app.tasks.build_task.os.listdir", return_value=["h5_app.app"]), \
         patch("app.tasks.build_task._find_signing_identity", return_value=None), \
         patch("app.tasks.build_task._create_dmg", return_value="/tmp/flutter/build/macos/Build/Products/Release/h5_app.dmg"):
        _build_macos("https://example.com", "/tmp/flutter")

    assert mock_run.call_count == 1


# ---------------------------------------------------------------------------
# _build_windows
# ---------------------------------------------------------------------------

def test_build_windows_produces_installer_exe():
    from app.tasks.build_task import _build_windows

    with patch("app.tasks.build_task._run") as mock_run, \
         patch("app.tasks.build_task.os.listdir", return_value=["h5_app.exe", "flutter_windows.dll"]), \
         patch("app.tasks.build_task.os.path.isdir", return_value=True), \
         patch("app.tasks.build_task.os.path.isfile", return_value=True), \
         patch("builtins.open", MagicMock()):
        result = _build_windows("https://example.com", "/tmp/flutter")

    # First call is flutter build, second is makensis
    assert mock_run.call_count == 2
    flutter_cmd = mock_run.call_args_list[0][0][0]
    assert flutter_cmd[0] == "flutter"
    assert "windows" in flutter_cmd
    nsis_cmd = mock_run.call_args_list[1][0][0]
    assert nsis_cmd[0] == "makensis"
    assert result.endswith("-setup.exe")


# ---------------------------------------------------------------------------
# build_app task — status and cleanup
# ---------------------------------------------------------------------------

def test_build_app_updates_status_to_running(db):
    """Task marks job as running before building."""
    import json
    from app.models.build_job import BuildJob
    from app.models.user import User

    user = User(username="worker", password="x")
    db.add(user)
    db.commit()
    job = BuildJob(
        task_id="test-task-flutter-1",
        user_id=user.id,
        h5_url="https://example.com",
        status="pending",
        requested_platforms=json.dumps(["android"]),
    )
    db.add(job)
    db.commit()
    job_id = job.id

    engine = db.get_bind()
    SessionFactory = sessionmaker(bind=engine)

    with patch("app.tasks.build_task._get_db", side_effect=lambda: SessionFactory()), \
         patch("app.tasks.build_task.PLATFORM_BUILDERS", {
             "android": MagicMock(side_effect=RuntimeError("build skipped in test"))
         }), \
         patch("app.tasks.build_task.shutil.copytree"), \
         patch("app.tasks.build_task._run"), \
         patch("app.tasks.build_task.subprocess.run"), \
         patch("app.tasks.build_task.os.makedirs"), \
         patch("app.tasks.build_task.shutil.rmtree"), \
         patch("app.tasks.build_task.artifact_dir", return_value="/tmp/fake-out"), \
         patch("app.tasks.build_task.artifact_path", return_value="/tmp/fake-out/android.apk"), \
         patch("app.tasks.build_task.tempfile.mkdtemp", return_value="/tmp/fake-build-dir"):
        from app.tasks.build_task import build_app
        build_app.run(job_id, "https://example.com", ["android"])

    check_session = SessionFactory()
    try:
        refreshed = check_session.query(BuildJob).filter(BuildJob.id == job_id).one()
        status = refreshed.status
    finally:
        check_session.close()

    assert status in ("running", "failed", "done")
    assert status != "pending"


def test_build_app_cleans_up_tmp_on_failure():
    """Temp dir is removed even when builder throws."""
    cleaned = []

    def tracking_rmtree(path, **kwargs):
        cleaned.append(path)

    mock_db = MagicMock()
    with patch("app.tasks.build_task._get_db", return_value=mock_db), \
         patch("app.tasks.build_task.shutil.copytree"), \
         patch("app.tasks.build_task._run"), \
         patch("app.tasks.build_task.subprocess.run"), \
         patch("app.tasks.build_task.os.makedirs"), \
         patch("app.tasks.build_task.shutil.rmtree", side_effect=tracking_rmtree), \
         patch("app.tasks.build_task.PLATFORM_BUILDERS", {
             "android": MagicMock(side_effect=Exception("explode"))
         }), \
         patch("app.tasks.build_task.artifact_dir", return_value="/tmp/fake-out"), \
         patch("app.tasks.build_task.artifact_path", return_value="/tmp/fake-out/android.apk"), \
         patch("app.tasks.build_task.tempfile.mkdtemp", return_value="/tmp/fake-build-dir"):
        from app.tasks.build_task import build_app
        build_app.run(1, "https://example.com", ["android"])

    assert len(cleaned) >= 1


def test_build_app_cleans_up_custom_keystore_dir(db):
    """Custom keystore staging directory is removed in the finally block."""
    import json
    from app.models.build_job import BuildJob
    from app.models.user import User

    user = User(username="ks-worker", password="x")
    db.add(user)
    db.commit()
    job = BuildJob(
        task_id="test-task-ks",
        user_id=user.id,
        h5_url="https://example.com",
        status="pending",
        requested_platforms=json.dumps(["android"]),
    )
    db.add(job)
    db.commit()

    # Create a real temp directory with a file to simulate the uploaded keystore staging dir
    ks_staging_dir = tempfile.mkdtemp(prefix="ks-test-")
    custom_ks_path = os.path.join(ks_staging_dir, "custom.jks")
    with open(custom_ks_path, "wb") as f:
        f.write(b"fake-keystore")

    engine = db.get_bind()
    SessionFactory = sessionmaker(bind=engine)

    keystore_params = {
        "path": custom_ks_path,
        "password": "secret",
        "alias": "myalias",
        "key_password": "keypass",
    }

    # Do NOT patch shutil.rmtree — we want the real cleanup to run on the staging dir
    rmtree_calls = []
    original_rmtree = __import__("shutil").rmtree

    def selective_rmtree(path, **kwargs):
        rmtree_calls.append(path)
        if path != "/tmp/fake-build-dir":
            original_rmtree(path, **kwargs)

    with patch("app.tasks.build_task._get_db", side_effect=lambda: SessionFactory()), \
         patch("app.tasks.build_task.PLATFORM_BUILDERS", {
             "android": MagicMock(side_effect=RuntimeError("skip"))
         }), \
         patch("app.tasks.build_task.shutil.copytree"), \
         patch("app.tasks.build_task._run"), \
         patch("app.tasks.build_task.subprocess.run"), \
         patch("app.tasks.build_task.os.makedirs"), \
         patch("app.tasks.build_task.shutil.rmtree", side_effect=selective_rmtree), \
         patch("app.tasks.build_task.artifact_dir", return_value="/tmp/fake-out"), \
         patch("app.tasks.build_task.artifact_path", return_value="/tmp/fake-out/android.apk"), \
         patch("app.tasks.build_task.tempfile.mkdtemp", return_value="/tmp/fake-build-dir"):
        from app.tasks.build_task import build_app
        build_app.run(job.id, "https://example.com", ["android"], keystore_params)

    assert not os.path.exists(ks_staging_dir), "Keystore staging directory should be removed after build"
