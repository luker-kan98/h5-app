import hashlib
import os
import shutil
import subprocess
import sys
import tempfile
import time
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


def _shared_cache_dir(name: str) -> str:
    home = os.path.expanduser("~")
    if sys.platform == "darwin":
        return os.path.join(home, "Library", "Caches", name)
    return os.path.join(home, ".cache", name)


def _electron_env(ele_dir: str, h5_url: Optional[str] = None) -> dict:
    npm_cache_root = os.path.join(ele_dir, ".cache")
    os.makedirs(npm_cache_root, exist_ok=True)

    electron_cache = os.environ.get("ELECTRON_CACHE", _shared_cache_dir("electron"))
    electron_builder_cache = os.environ.get("ELECTRON_BUILDER_CACHE", _shared_cache_dir("electron-builder"))
    os.makedirs(electron_cache, exist_ok=True)
    os.makedirs(electron_builder_cache, exist_ok=True)

    env = {
        **os.environ,
        "npm_config_cache": os.path.join(npm_cache_root, "npm"),
        "ELECTRON_CACHE": electron_cache,
        "ELECTRON_BUILDER_CACHE": electron_builder_cache,
    }
    if h5_url:
        env["H5_URL"] = h5_url
    return env


def _electron_cache_key() -> str:
    digest = hashlib.sha256()
    for filename in ("package.json", "package-lock.json"):
        with open(os.path.join(ELECTRON_WRAPPER_SRC, filename), "rb") as f:
            digest.update(f.read())
    return digest.hexdigest()[:16]


def _electron_cache_dir() -> str:
    return os.path.join(REPO_ROOT, ".build-cache", "electron", _electron_cache_key())


def _electron_cache_ready(cache_dir: str) -> bool:
    return os.path.isfile(os.path.join(cache_dir, ".deps-ready")) and os.path.isdir(
        os.path.join(cache_dir, "node_modules")
    )


def _ignore_electron_artifacts(_src: str, names: list[str]) -> list[str]:
    ignored = {"node_modules", "dist", ".cache"}
    return [name for name in names if name in ignored]


def _acquire_dir_lock(lock_dir: str, timeout_seconds: int = 300) -> None:
    deadline = time.time() + timeout_seconds
    while True:
        try:
            os.mkdir(lock_dir)
            return
        except FileExistsError:
            if time.time() >= deadline:
                raise RuntimeError(f"Timed out waiting for build lock: {lock_dir}")
            time.sleep(0.2)


def _ensure_electron_dependencies() -> str:
    cache_dir = _electron_cache_dir()
    if _electron_cache_ready(cache_dir):
        return cache_dir

    os.makedirs(os.path.dirname(cache_dir), exist_ok=True)
    lock_dir = f"{cache_dir}.lock"
    _acquire_dir_lock(lock_dir)

    try:
        if _electron_cache_ready(cache_dir):
            return cache_dir

        staging_dir = f"{cache_dir}.tmp-{os.getpid()}"
        shutil.rmtree(staging_dir, ignore_errors=True)
        shutil.copytree(ELECTRON_WRAPPER_SRC, staging_dir, ignore=_ignore_electron_artifacts)
        _run(["npm", "install"], cwd=staging_dir, env=_electron_env(staging_dir))
        with open(os.path.join(staging_dir, ".deps-ready"), "w", encoding="utf-8") as f:
            f.write(_electron_cache_key())

        shutil.rmtree(cache_dir, ignore_errors=True)
        os.replace(staging_dir, cache_dir)
        return cache_dir
    finally:
        shutil.rmtree(lock_dir, ignore_errors=True)


def _prepare_electron_workspace(ele_tmp: str) -> str:
    cache_dir = _ensure_electron_dependencies()
    shutil.copytree(ELECTRON_WRAPPER_SRC, ele_tmp, ignore=_ignore_electron_artifacts)

    cached_node_modules = os.path.join(cache_dir, "node_modules")
    workspace_node_modules = os.path.join(ele_tmp, "node_modules")
    try:
        os.symlink(cached_node_modules, workspace_node_modules, target_is_directory=True)
    except OSError:
        shutil.copytree(cached_node_modules, workspace_node_modules, symlinks=True)

    return ele_tmp


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
    env = _electron_env(ele_dir, h5_url)
    _run(["npm", "run", "build:mac"], cwd=ele_dir, env=env)
    app_dir = os.path.join(ele_dir, "dist", "mac")
    app_bundle = next((f for f in os.listdir(app_dir) if f.endswith(".app")), None)
    if not app_bundle:
        raise RuntimeError("macOS build produced no .app bundle")
    return os.path.join(app_dir, app_bundle)


def _build_windows(h5_url: str, _flutter_dir: str, ele_dir: str) -> str:
    env = _electron_env(ele_dir, h5_url)
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
        mobile_platforms = {"android", "ios"}
        desktop_platforms = {"macos", "windows"}
        needs_flutter = any(platform in mobile_platforms for platform in platforms)
        needs_electron = any(platform in desktop_platforms for platform in platforms)

        def ignore_flutter_artifacts(src, names):
            return [n for n in names if n in {
                ".dart_tool", "build", ".flutter-plugins", ".flutter-plugins-dependencies"
            }]

        if needs_flutter:
            shutil.copytree(FLUTTER_WRAPPER_SRC, flutter_tmp, ignore=ignore_flutter_artifacts)
            _run(["flutter", "pub", "get"], cwd=flutter_tmp)

        if needs_electron:
            _prepare_electron_workspace(ele_tmp)

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
