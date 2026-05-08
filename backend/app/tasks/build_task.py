import json
import os
import plistlib
import re
import shutil
import subprocess
import tempfile
from pathlib import Path
from xml.sax.saxutils import escape
from datetime import datetime, timezone
from typing import Optional

from celery import Celery
from celery.exceptions import SoftTimeLimitExceeded
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.build_job import BuildJob
from app.models.build_request import BuildRequest
from app.models.build_sdk_config import BuildSdkConfig
from app.models.build_task import BuildTask
from app.services.file_service import artifact_dir, artifact_path, PLATFORM_FILENAMES
from app.services.icon_service import (
    generate_android_icons,
    generate_ios_icons,
    generate_macos_icon,
    generate_windows_icon,
)
from app.services.build_scheduler import refresh_request_status, run_scheduler_once
from app.services.runtime_schema import ensure_build_task_artifact_columns
from app.services.s3_service import s3_upload_configured, upload_build_artifact
from app.services import sdk_injector

celery_app = Celery("h5packager")
celery_app.config_from_object("celeryconfig")

REPO_ROOT = os.getenv("REPO_ROOT", os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))
FLUTTER_WRAPPER_SRC = os.path.join(REPO_ROOT, "flutter-wrapper")
ELECTRON_WRAPPER_SRC = os.path.join(REPO_ROOT, "electron-wrapper")
BUILDS_DIR = os.getenv("BUILDS_DIR", os.path.join(REPO_ROOT, "builds"))
_session_factory_options = getattr(SessionLocal, "kw", {})
if _session_factory_options.get("bind") is not None:
    ensure_build_task_artifact_columns(_session_factory_options["bind"])


def _get_db() -> Session:
    return SessionLocal()


def _update_job(db: Session, job_id: int, **kwargs):
    db.query(BuildJob).filter(BuildJob.id == job_id).update(kwargs, synchronize_session="fetch")
    db.commit()


def _run(cmd: list, cwd: str, env: dict = None) -> None:
    """Run a subprocess command; raises RuntimeError on non-zero exit."""
    result = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, env=env)
    if result.returncode != 0:
        stdout_tail = (result.stdout or "")[-2000:].strip()
        stderr_tail = (result.stderr or "")[-2000:].strip()
        details = []
        if stdout_tail:
            details.append(f"stdout:\n{stdout_tail}")
        if stderr_tail:
            details.append(f"stderr:\n{stderr_tail}")
        detail_text = "\n\n".join(details) if details else "No subprocess output captured."
        raise RuntimeError(f"Command {cmd[0]} failed:\n{detail_text}")


def _build_android(h5_url: str, flutter_dir: str, keystore_params: Optional[dict] = None) -> str:
    env = {**os.environ}
    if keystore_params:
        env["KEYSTORE_PATH"] = keystore_params["path"]
        env["KEYSTORE_PASSWORD"] = keystore_params.get("password", "changeit")
        env["KEY_ALIAS"] = keystore_params.get("alias", "h5packager")
        env["KEY_PASSWORD"] = keystore_params.get("key_password", "changeit")
    _run(
        ["flutter", "build", "apk", "--release", f"--dart-define=H5_URL={h5_url}"],
        cwd=flutter_dir,
        env=env,
    )
    return os.path.join(flutter_dir, "build/app/outputs/flutter-apk/app-release.apk")


def _build_ios(h5_url: str, flutter_dir: str) -> str:
    _run(
        ["flutter", "build", "ios", "--release", "--no-codesign",
         f"--dart-define=H5_URL={h5_url}"],
        cwd=flutter_dir,
    )
    return os.path.join(flutter_dir, "build/ios/iphoneos/Runner.app")


def _prepare_electron(
    h5_url: str,
    app_name: str,
    icon_path: Optional[str],
    tmp_dir: str,
    platforms: list[str],
    custom_js: Optional[str] = None,
    sdk_configs: Optional[dict] = None,
) -> str:
    """Copy electron-wrapper to tmp_dir, inject settings, run npm install. Returns the working dir."""
    electron_dir = os.path.join(tmp_dir, "electron")
    shutil.copytree(ELECTRON_WRAPPER_SRC, electron_dir, ignore=shutil.ignore_patterns("node_modules"))

    # Inject H5_URL into main.js
    main_js = os.path.join(electron_dir, "main.js")
    with open(main_js, "r", encoding="utf-8") as f:
        content = f.read()
    content = content.replace("__H5_URL__", h5_url)
    with open(main_js, "w", encoding="utf-8") as f:
        f.write(content)

    sdk_injector.apply_electron(electron_dir, custom_js, sdk_configs or {})
    if sdk_configs and "proxy" in sdk_configs:
        # _prepare_electron is invoked per platform; platforms holds exactly one entry.
        target = platforms[0] if platforms else None
        if target in ("macos", "windows"):
            sdk_injector.copy_singbox_for_electron(electron_dir, target_platform=target)

    package_json_path = os.path.join(electron_dir, "package.json")
    with open(package_json_path, "r", encoding="utf-8") as f:
        package_data = json.load(f)

    package_data.setdefault("build", {})
    package_data["build"]["productName"] = app_name
    if icon_path:
        if "macos" in platforms:
            package_data["build"].setdefault("mac", {})
            package_data["build"]["mac"]["icon"] = os.path.relpath(
                generate_macos_icon(icon_path, electron_dir),
                electron_dir,
            )
        if "windows" in platforms:
            package_data["build"].setdefault("win", {})
            package_data["build"]["win"]["icon"] = os.path.relpath(
                generate_windows_icon(icon_path, electron_dir),
                electron_dir,
            )

    with open(package_json_path, "w", encoding="utf-8") as f:
        json.dump(package_data, f, ensure_ascii=False, indent=2)
        f.write("\n")

    _run(["npm", "install"], cwd=electron_dir)
    return electron_dir


def _build_macos(h5_url: str, electron_dir: str) -> str:
    _run(["npm", "run", "build:mac"], cwd=electron_dir)
    dist_dir = os.path.join(electron_dir, "dist")
    # electron-builder produces the DMG directly in dist/
    dmg = next((f for f in os.listdir(dist_dir) if f.endswith(".dmg")), None)
    if not dmg:
        raise RuntimeError("electron-builder produced no .dmg file")
    return os.path.join(dist_dir, dmg)


def _build_windows(h5_url: str, electron_dir: str) -> str:
    _run(["npm", "run", "build:win"], cwd=electron_dir)
    dist_dir = os.path.join(electron_dir, "dist")
    exe = next((f for f in os.listdir(dist_dir) if f.endswith(".exe")), None)
    if not exe:
        raise RuntimeError("electron-builder produced no .exe installer")
    return os.path.join(dist_dir, exe)


def _prepare_flutter_workspace(
    flutter_dir: str,
    platforms: list[str],
    app_name: str,
    icon_path: Optional[str],
    android_package_name: Optional[str],
) -> None:
    if "android" in platforms:
        _configure_android_project(flutter_dir, app_name, android_package_name)
        if icon_path:
            generate_android_icons(icon_path, flutter_dir)

    if "ios" in platforms:
        _configure_ios_project(flutter_dir, app_name)
        if icon_path:
            generate_ios_icons(icon_path, flutter_dir)


def _configure_android_project(
    flutter_dir: str,
    app_name: str,
    android_package_name: Optional[str],
) -> None:
    manifest_path = Path(flutter_dir) / "android/app/src/main/AndroidManifest.xml"
    manifest_text = manifest_path.read_text(encoding="utf-8")
    escaped_app_name = escape(app_name, {'"': "&quot;"})
    manifest_text = re.sub(
        r'android:label="[^"]*"',
        f'android:label="{escaped_app_name}"',
        manifest_text,
        count=1,
    )
    manifest_path.write_text(manifest_text, encoding="utf-8")

    if android_package_name:
        gradle_path = Path(flutter_dir) / "android/app/build.gradle.kts"
        gradle_text = gradle_path.read_text(encoding="utf-8")
        gradle_text = re.sub(
            r'namespace\s*=\s*"[^"]+"',
            f'namespace = "{android_package_name}"',
            gradle_text,
            count=1,
        )
        gradle_text = re.sub(
            r'applicationId\s*=\s*"[^"]+"',
            f'applicationId = "{android_package_name}"',
            gradle_text,
            count=1,
        )
        gradle_path.write_text(gradle_text, encoding="utf-8")
        _rewrite_main_activity_package(flutter_dir, android_package_name)


def _configure_ios_project(flutter_dir: str, app_name: str) -> None:
    info_plist_path = Path(flutter_dir) / "ios/Runner/Info.plist"
    with open(info_plist_path, "rb") as f:
        plist_data = plistlib.load(f)
    plist_data["CFBundleDisplayName"] = app_name
    plist_data["CFBundleName"] = app_name
    with open(info_plist_path, "wb") as f:
        plistlib.dump(plist_data, f, sort_keys=False)


def _rewrite_main_activity_package(flutter_dir: str, android_package_name: str) -> None:
    kotlin_root = Path(flutter_dir) / "android/app/src/main/kotlin"
    current_path = next(kotlin_root.rglob("MainActivity.kt"), None)
    if current_path is None:
        raise RuntimeError("Android MainActivity.kt not found")

    activity_text = current_path.read_text(encoding="utf-8")
    activity_text = re.sub(
        r"^package\s+[^\n]+",
        f"package {android_package_name}",
        activity_text,
        count=1,
        flags=re.MULTILINE,
    )

    target_path = kotlin_root / Path(android_package_name.replace(".", "/")) / "MainActivity.kt"
    target_path.parent.mkdir(parents=True, exist_ok=True)
    target_path.write_text(activity_text, encoding="utf-8")

    if current_path != target_path:
        current_path.unlink()
        _prune_empty_dirs(current_path.parent, kotlin_root)


def _prune_empty_dirs(path: Path, stop_at: Path) -> None:
    current = path
    while current != stop_at and current.is_dir():
        try:
            current.rmdir()
        except OSError:
            break
        current = current.parent


FLUTTER_PLATFORMS = {"android", "ios"}
ELECTRON_PLATFORMS = {"macos", "windows"}

PLATFORM_BUILDERS = {
    "android": _build_android,
    "ios": _build_ios,
    "macos": _build_macos,
    "windows": _build_windows,
}

PLATFORM_PATH_ATTRS = {p: f"{p}_path" for p in PLATFORM_BUILDERS}
PLATFORM_ERROR_ATTRS = {p: f"{p}_error" for p in PLATFORM_BUILDERS}


def _mark_request_inputs_complete_if_finished(db: Session, request: BuildRequest) -> None:
    remaining = (
        db.query(BuildTask)
        .filter(
            BuildTask.request_id == request.id,
            BuildTask.status.notin_(["done", "failed", "cancelled"]),
        )
        .count()
    )
    if remaining:
        return

    cleanup_dirs = set()
    if request.icon_path:
        cleanup_dirs.add(os.path.dirname(request.icon_path))
    if request.keystore_path:
        cleanup_dirs.add(os.path.dirname(request.keystore_path))

    for path in cleanup_dirs:
        shutil.rmtree(path, ignore_errors=True)


def _store_artifact(task_id: str, platform: str, src_path: str) -> tuple[str, str | None, str | None]:
    dest = artifact_path(task_id, platform)
    if os.path.isdir(src_path):
        base = dest.replace(".zip", "")
        shutil.make_archive(base, "zip", src_path)
        dest = base + ".zip" if not dest.endswith(".zip") else dest
    else:
        shutil.copy2(src_path, dest)

    artifact_s3_key = None
    artifact_url = None
    if s3_upload_configured():
        artifact_s3_key, artifact_url = upload_build_artifact(dest, task_id, PLATFORM_FILENAMES[platform])

    return dest, artifact_s3_key, artifact_url


@celery_app.task(name="execute_build_task", bind=True)
def execute_build_task(self, build_task_id: int):
    db = _get_db()
    tmp_dir = tempfile.mkdtemp(prefix=f"build-task-{self.request.id}-")

    try:
        task = db.query(BuildTask).filter(BuildTask.id == build_task_id).one()
        request = db.query(BuildRequest).filter(BuildRequest.id == task.request_id).one()

        task.status = "running"
        task.started_at = datetime.now(timezone.utc)
        db.commit()
        refresh_request_status(db, request.id)

        platform = task.platform
        need_flutter = platform in FLUTTER_PLATFORMS
        need_electron = platform in ELECTRON_PLATFORMS

        flutter_tmp = None
        electron_tmp = None

        sdk_row = (
            db.query(BuildSdkConfig)
            .filter(BuildSdkConfig.request_id == request.id)
            .first()
        )
        custom_js = sdk_row.custom_js if sdk_row else None
        try:
            sdk_configs = json.loads(sdk_row.sdk_configs) if sdk_row else {}
        except (TypeError, json.JSONDecodeError):
            sdk_configs = {}

        if need_flutter:
            flutter_tmp = os.path.join(tmp_dir, "flutter")

            def ignore_flutter_artifacts(_src, names):
                return [n for n in names if n in {
                    ".dart_tool", "build", ".flutter-plugins", ".flutter-plugins-dependencies"
                }]

            shutil.copytree(FLUTTER_WRAPPER_SRC, flutter_tmp, ignore=ignore_flutter_artifacts)
            _prepare_flutter_workspace(
                flutter_tmp,
                [platform],
                request.app_name,
                request.icon_path,
                request.android_package_name,
            )
            sdk_injector.apply_flutter(flutter_tmp, custom_js, sdk_configs)
            if sdk_configs and "proxy" in sdk_configs:
                sdk_injector.copy_singbox_for_flutter(flutter_tmp)
            _run(["flutter", "pub", "get"], cwd=flutter_tmp)

        if need_electron:
            electron_tmp = _prepare_electron(
                request.h5_url,
                request.app_name,
                request.icon_path,
                tmp_dir,
                [platform],
                custom_js=custom_js,
                sdk_configs=sdk_configs,
            )

        os.makedirs(artifact_dir(request.request_id), exist_ok=True)

        keystore_params = None
        if request.keystore_path:
            keystore_params = {
                "path": request.keystore_path,
                "password": request.keystore_password or "changeit",
                "alias": request.key_alias or "h5packager",
                "key_password": request.key_password or "changeit",
            }

        builder = PLATFORM_BUILDERS[platform]
        if platform == "android":
            src_path = builder(request.h5_url, flutter_tmp, keystore_params)
        elif platform == "ios":
            src_path = builder(request.h5_url, flutter_tmp)
        else:
            src_path = builder(request.h5_url, electron_tmp)

        task.status = "uploading"
        db.commit()
        refresh_request_status(db, request.id)

        dest, artifact_s3_key, artifact_url = _store_artifact(request.request_id, platform, src_path)

        task.status = "done"
        task.artifact_path = dest
        task.artifact_s3_key = artifact_s3_key
        task.artifact_url = artifact_url
        task.failure_code = None
        task.failure_message = None
        task.finished_at = datetime.now(timezone.utc)
        db.commit()
        refresh_request_status(db, request.id)

    except SoftTimeLimitExceeded:
        task = db.query(BuildTask).filter(BuildTask.id == build_task_id).one()
        request = db.query(BuildRequest).filter(BuildRequest.id == task.request_id).one()
        task.status = "failed"
        task.failure_code = "timeout"
        task.failure_message = "Build timed out (30 min limit exceeded)"
        task.finished_at = datetime.now(timezone.utc)
        db.commit()
        refresh_request_status(db, request.id)
    except Exception as e:
        task = db.query(BuildTask).filter(BuildTask.id == build_task_id).one()
        request = db.query(BuildRequest).filter(BuildRequest.id == task.request_id).one()
        task.status = "failed"
        task.failure_code = "build_failed"
        task.failure_message = str(e)
        task.finished_at = datetime.now(timezone.utc)
        db.commit()
        refresh_request_status(db, request.id)
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)
        try:
            task = db.query(BuildTask).filter(BuildTask.id == build_task_id).one_or_none()
            if task is not None:
                request = db.query(BuildRequest).filter(BuildRequest.id == task.request_id).one_or_none()
                if request is not None:
                    _mark_request_inputs_complete_if_finished(db, request)
                    run_scheduler_once(db)
        finally:
            db.close()
