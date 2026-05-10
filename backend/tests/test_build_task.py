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
