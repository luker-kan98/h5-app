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
        raise RuntimeError(f"Command {cmd[0]} failed:\n{result.stderr[-2000:]}")


def _build_android(h5_url: str, flutter_dir: str, _ele_dir: str, keystore_params: Optional[dict] = None) -> str:
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


def _build_ios(h5_url: str, flutter_dir: str, _ele_dir: str) -> str:
    _run(
        ["flutter", "build", "ios", "--release", "--no-codesign",
         f"--dart-define=H5_URL={h5_url}"],
        cwd=flutter_dir,
    )
    # Scheme name is fixed as "Runner" (Flutter default — do not rename in template)
    return os.path.join(flutter_dir, "build/ios/iphoneos/Runner.app")


def _build_macos(h5_url: str, _flutter_dir: str, ele_dir: str) -> str:
    env = {**os.environ, "H5_URL": h5_url}
    _run(["npm", "run", "build:mac"], cwd=ele_dir, env=env)
    dist = os.path.join(ele_dir, "dist")
    dmg = next((f for f in os.listdir(dist) if f.endswith(".dmg")), None)
    if not dmg:
        raise RuntimeError("macOS build produced no .dmg file")
    return os.path.join(dist, dmg)


def _build_windows(h5_url: str, _flutter_dir: str, ele_dir: str) -> str:
    env = {**os.environ, "H5_URL": h5_url}
    _run(["npm", "run", "build:win"], cwd=ele_dir, env=env)
    dist = os.path.join(ele_dir, "dist")
    exe = next((f for f in os.listdir(dist) if f.endswith(".exe")), None)
    if not exe:
        raise RuntimeError("Windows build produced no .exe file")
    return os.path.join(dist, exe)


PLATFORM_BUILDERS = {
    "android": _build_android,
    "ios": _build_ios,
    "macos": _build_macos,
    "windows": _build_windows,
}

PLATFORM_PATH_ATTRS = {p: f"{p}_path" for p in PLATFORM_BUILDERS}
PLATFORM_ERROR_ATTRS = {p: f"{p}_error" for p in PLATFORM_BUILDERS}


@celery_app.task(name="build_app", bind=True)
def build_app(self, job_id: int, h5_url: str, platforms: list, keystore_params: Optional[dict] = None):
    db = _get_db()
    tmp_dir = tempfile.mkdtemp(prefix=f"build-{self.request.id}-")

    try:
        _update_job(db, job_id, status="running")

        flutter_tmp = os.path.join(tmp_dir, "flutter")
        ele_tmp = os.path.join(tmp_dir, "electron")

        def ignore_flutter_artifacts(src, names):
            return [n for n in names if n in {
                ".dart_tool", "build", ".flutter-plugins", ".flutter-plugins-dependencies"
            }]

        def ignore_node_modules(src, names):
            return ["node_modules"] if "node_modules" in names else []

        shutil.copytree(FLUTTER_WRAPPER_SRC, flutter_tmp, ignore=ignore_flutter_artifacts)
        shutil.copytree(ELECTRON_WRAPPER_SRC, ele_tmp, ignore=ignore_node_modules)

        _run(["flutter", "pub", "get"], cwd=flutter_tmp)
        subprocess.run(["npm", "install"], cwd=ele_tmp, capture_output=True)

        # Output directory for this task's artifacts
        out_dir = artifact_dir(self.request.id)
        os.makedirs(out_dir, exist_ok=True)

        updates: dict = {}
        for platform in platforms:
            try:
                builder = PLATFORM_BUILDERS[platform]
                if platform == "android":
                    src_path = builder(h5_url, flutter_tmp, ele_tmp, keystore_params)
                else:
                    src_path = builder(h5_url, flutter_tmp, ele_tmp)
                dest = artifact_path(self.request.id, platform)
                if os.path.isdir(src_path):
                    # zip directory artifacts (e.g. .app bundles)
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
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)
        # Clean up user-supplied keystore staging directory (outside tmp_dir)
        if keystore_params:
            custom_ks = keystore_params.get("path")
            if custom_ks:
                shutil.rmtree(os.path.dirname(custom_ks), ignore_errors=True)
        db.close()
