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


def _find_signing_identity() -> Optional[str]:
    """Auto-detect a Developer ID Application identity from the local Keychain."""
    result = subprocess.run(
        ["security", "find-identity", "-v", "-p", "codesigning"],
        capture_output=True, text=True,
    )
    if result.returncode != 0:
        return None
    for line in result.stdout.splitlines():
        # Prefer "Developer ID Application" for distribution outside App Store
        if "Developer ID Application" in line:
            # Line format: 1) HASH "Developer ID Application: Name (TeamID)"
            start = line.find('"')
            end = line.rfind('"')
            if start != -1 and end > start:
                return line[start + 1:end]
    # Fallback: use "Apple Development" for local/dev signing
    for line in result.stdout.splitlines():
        if "Apple Development" in line:
            start = line.find('"')
            end = line.rfind('"')
            if start != -1 and end > start:
                return line[start + 1:end]
    return None


def _codesign_app(app_path: str, signing_identity: str) -> None:
    """Recursively codesign a .app bundle with the given identity."""
    _run(
        ["codesign", "--deep", "--force", "--options", "runtime",
         "--sign", signing_identity, app_path],
        cwd=os.path.dirname(app_path),
    )
    _run(
        ["codesign", "--verify", "--deep", "--strict", app_path],
        cwd=os.path.dirname(app_path),
    )


def _create_dmg(app_path: str, output_dmg: str, app_name: str) -> str:
    """Create a DMG from a .app bundle using hdiutil."""
    staging = app_path + "-dmg-staging"
    os.makedirs(staging, exist_ok=True)
    dest_app = os.path.join(staging, os.path.basename(app_path))
    if os.path.exists(dest_app):
        shutil.rmtree(dest_app)
    shutil.copytree(app_path, dest_app)
    apps_link = os.path.join(staging, "Applications")
    if not os.path.exists(apps_link):
        os.symlink("/Applications", apps_link)
    _run(
        ["hdiutil", "create", "-volname", app_name, "-srcfolder", staging,
         "-ov", "-format", "UDZO", output_dmg],
        cwd=os.path.dirname(output_dmg),
    )
    shutil.rmtree(staging, ignore_errors=True)
    return output_dmg


def _build_macos(h5_url: str, flutter_dir: str) -> str:
    _run(
        ["flutter", "build", "macos", "--release",
         f"--dart-define=H5_URL={h5_url}"],
        cwd=flutter_dir,
    )
    app_dir = os.path.join(flutter_dir, "build", "macos", "Build", "Products", "Release")
    app_bundle = next((f for f in os.listdir(app_dir) if f.endswith(".app")), None)
    if not app_bundle:
        raise RuntimeError("macOS build produced no .app bundle")
    app_path = os.path.join(app_dir, app_bundle)

    # Auto-detect and codesign with local Keychain identity
    identity = _find_signing_identity()
    if identity:
        _codesign_app(app_path, identity)

    # Package as DMG
    app_name = app_bundle.replace(".app", "")
    dmg_path = os.path.join(app_dir, f"{app_name}.dmg")
    _create_dmg(app_path, dmg_path, app_name)
    return dmg_path


def _create_nsis_script(release_dir: str, exe_name: str, output_installer: str, app_name: str) -> str:
    """Generate an NSIS script and return its path."""
    nsis_script = os.path.join(release_dir, "installer.nsi")
    script_content = f"""!include "MUI2.nsh"

Name "{app_name}"
OutFile "{output_installer}"
InstallDir "$PROGRAMFILES\\{app_name}"
RequestExecutionLevel admin

!insertmacro MUI_PAGE_DIRECTORY
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_LANGUAGE "English"

Section "Install"
  SetOutPath "$INSTDIR"
  File /r "{release_dir}\\*.*"
  CreateShortcut "$DESKTOP\\{app_name}.lnk" "$INSTDIR\\{exe_name}"
  CreateShortcut "$SMPROGRAMS\\{app_name}.lnk" "$INSTDIR\\{exe_name}"
  WriteUninstaller "$INSTDIR\\uninstall.exe"
SectionEnd

Section "Uninstall"
  RMDir /r "$INSTDIR"
  Delete "$DESKTOP\\{app_name}.lnk"
  Delete "$SMPROGRAMS\\{app_name}.lnk"
SectionEnd
"""
    with open(nsis_script, "w", encoding="utf-8") as f:
        f.write(script_content)
    return nsis_script


def _build_windows(h5_url: str, flutter_dir: str) -> str:
    _run(
        ["flutter", "build", "windows", "--release",
         f"--dart-define=H5_URL={h5_url}"],
        cwd=flutter_dir,
    )
    release_dir = os.path.join(flutter_dir, "build", "windows", "x64", "runner", "Release")
    if not os.path.isdir(release_dir):
        raise RuntimeError("Windows build produced no Release directory")

    # Find the main exe
    exe_name = next((f for f in os.listdir(release_dir) if f.endswith(".exe")), None)
    if not exe_name:
        raise RuntimeError("Windows build produced no .exe file")

    app_name = exe_name.replace(".exe", "")
    output_installer = os.path.join(flutter_dir, "build", "windows", f"{app_name}-setup.exe")
    nsis_script = _create_nsis_script(release_dir, exe_name, output_installer, app_name)
    _run(["makensis", nsis_script], cwd=release_dir)

    if not os.path.isfile(output_installer):
        raise RuntimeError("NSIS failed to produce installer exe")
    return output_installer


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

        flutter_tmp = os.path.join(tmp_dir, "flutter")

        def ignore_flutter_artifacts(src, names):
            return [n for n in names if n in {
                ".dart_tool", "build", ".flutter-plugins", ".flutter-plugins-dependencies"
            }]

        shutil.copytree(FLUTTER_WRAPPER_SRC, flutter_tmp, ignore=ignore_flutter_artifacts)
        _run(["flutter", "pub", "get"], cwd=flutter_tmp)

        # Output directory for this task's artifacts
        out_dir = artifact_dir(self.request.id)
        os.makedirs(out_dir, exist_ok=True)

        updates: dict = {}
        for platform in platforms:
            try:
                builder = PLATFORM_BUILDERS[platform]
                if platform == "android":
                    src_path = builder(h5_url, flutter_tmp, keystore_params)
                else:
                    src_path = builder(h5_url, flutter_tmp)
                dest = artifact_path(self.request.id, platform)
                if os.path.isdir(src_path):
                    # zip directory artifacts (e.g. .app bundles, windows release dir)
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
