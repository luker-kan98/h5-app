import os
import shutil
import subprocess
import tempfile
from datetime import datetime, timezone
from typing import Optional

from celery import Celery
from celery.exceptions import SoftTimeLimitExceeded
from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.build_job import BuildJob
from app.services.file_service import artifact_dir, artifact_path, PLATFORM_FILENAMES

celery_app = Celery("h5packager")
celery_app.config_from_object("celeryconfig")

REPO_ROOT = os.getenv("REPO_ROOT", os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../")))
FLUTTER_WRAPPER_SRC = os.path.join(REPO_ROOT, "flutter-wrapper")
ELECTRON_WRAPPER_SRC = os.path.join(REPO_ROOT, "electron-wrapper")
BUILDS_DIR = os.getenv("BUILDS_DIR", os.path.join(REPO_ROOT, "builds"))


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


def _prepare_electron(h5_url: str, tmp_dir: str) -> str:
    """Copy electron-wrapper to tmp_dir, inject H5_URL, run npm install. Returns the working dir."""
    electron_dir = os.path.join(tmp_dir, "electron")
    shutil.copytree(ELECTRON_WRAPPER_SRC, electron_dir, ignore=shutil.ignore_patterns("node_modules"))
    # Inject H5_URL into main.js
    main_js = os.path.join(electron_dir, "main.js")
    with open(main_js, "r", encoding="utf-8") as f:
        content = f.read()
    content = content.replace("__H5_URL__", h5_url)
    with open(main_js, "w", encoding="utf-8") as f:
        f.write(content)
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


@celery_app.task(name="build_app", bind=True)
def build_app(self, job_id: int, h5_url: str, platforms: list,
              keystore_params: Optional[dict] = None):
    db = _get_db()
    tmp_dir = tempfile.mkdtemp(prefix=f"build-{self.request.id}-")

    try:
        _update_job(db, job_id, status="running")

        need_flutter = bool(set(platforms) & FLUTTER_PLATFORMS)
        need_electron = bool(set(platforms) & ELECTRON_PLATFORMS)

        flutter_tmp = None
        electron_tmp = None

        # Prepare Flutter workspace (Android / iOS)
        if need_flutter:
            flutter_tmp = os.path.join(tmp_dir, "flutter")

            def ignore_flutter_artifacts(src, names):
                return [n for n in names if n in {
                    ".dart_tool", "build", ".flutter-plugins", ".flutter-plugins-dependencies"
                }]

            shutil.copytree(FLUTTER_WRAPPER_SRC, flutter_tmp, ignore=ignore_flutter_artifacts)
            _run(["flutter", "pub", "get"], cwd=flutter_tmp)

        # Prepare Electron workspace (macOS / Windows)
        if need_electron:
            electron_tmp = _prepare_electron(h5_url, tmp_dir)

        # Output directory for this task's artifacts
        out_dir = artifact_dir(self.request.id)
        os.makedirs(out_dir, exist_ok=True)

        updates: dict = {}
        for platform in platforms:
            try:
                builder = PLATFORM_BUILDERS[platform]
                if platform == "android":
                    src_path = builder(h5_url, flutter_tmp, keystore_params)
                elif platform == "ios":
                    src_path = builder(h5_url, flutter_tmp)
                else:
                    src_path = builder(h5_url, electron_tmp)
                dest = artifact_path(self.request.id, platform)
                if os.path.isdir(src_path):
                    base = dest.replace(".zip", "")
                    shutil.make_archive(base, "zip", src_path)
                    dest = base + ".zip" if not dest.endswith(".zip") else dest
                else:
                    shutil.copy2(src_path, dest)
                updates[PLATFORM_PATH_ATTRS[platform]] = dest
            except Exception as e:
                updates[PLATFORM_ERROR_ATTRS[platform]] = str(e)

        all_failed = all(PLATFORM_ERROR_ATTRS[p] in updates for p in platforms)
        final_status = "failed" if all_failed else "done"
        _update_job(
            db,
            job_id,
            status=final_status,
            finished_at=datetime.now(timezone.utc),
            **updates,
        )

    except SoftTimeLimitExceeded:
        _update_job(
            db,
            job_id,
            status="failed",
            android_error="Build timed out (30 min limit exceeded)",
            finished_at=datetime.now(timezone.utc),
        )
    except Exception as e:
        failure_message = str(e)
        updates = {
            PLATFORM_ERROR_ATTRS[platform]: failure_message
            for platform in platforms
            if platform in PLATFORM_ERROR_ATTRS
        }
        _update_job(
            db,
            job_id,
            status="failed",
            finished_at=datetime.now(timezone.utc),
            **updates,
        )
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)
        # Clean up user-supplied keystore staging directory (outside tmp_dir)
        if keystore_params:
            custom_ks = keystore_params.get("path")
            if custom_ks:
                shutil.rmtree(os.path.dirname(custom_ks), ignore_errors=True)
        db.close()
