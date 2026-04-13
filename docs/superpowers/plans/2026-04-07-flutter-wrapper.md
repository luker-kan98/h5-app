# Flutter Wrapper Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace `capacitor-wrapper/` with a Flutter WebView wrapper so Android/iOS builds use `flutter build` instead of Capacitor + Node.js + CocoaPods.

**Architecture:** A minimal Flutter project (`flutter-wrapper/`) contains a single `main.dart` that loads an H5 URL injected at compile time via `--dart-define=H5_URL=...`. Android signing is configured in `android/app/build.gradle` via environment variables. The backend `build_task.py` and `api/build.py` are updated to drive the new template and support optional user-supplied keystores passed as task parameters.

**Tech Stack:** Flutter SDK, `webview_flutter` package, Groovy Gradle DSL, FastAPI (`File`/`Form` multipart), Celery, Python 3.

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Create | `flutter-wrapper/pubspec.yaml` | Flutter project manifest + webview_flutter dep |
| Create | `flutter-wrapper/pubspec.lock` | Pinned dependency versions (committed) |
| Create | `flutter-wrapper/lib/main.dart` | WebView entry point, reads `H5_URL` dart-define |
| Create | `flutter-wrapper/android/app/build.gradle` | Android signing via env vars |
| Create | `flutter-wrapper/android/app/default.jks` | Platform default keystore (generated) |
| Create | `flutter-wrapper/android/app/src/main/AndroidManifest.xml` | Internet permission |
| Create | `flutter-wrapper/android/build.gradle` | Top-level Android build file |
| Create | `flutter-wrapper/android/settings.gradle` | Android project settings |
| Create | `flutter-wrapper/android/gradle.properties` | Android Gradle properties |
| Create | `flutter-wrapper/android/gradle/wrapper/gradle-wrapper.properties` | Gradle version |
| Modify | `backend/app/tasks/build_task.py` | Replace Capacitor logic with Flutter build logic |
| Modify | `backend/app/api/build.py` | Support multipart form + keystore upload |
| Modify | `backend/app/schemas.py` | Remove `BuildRequest` (replaced by Form params) |
| Modify | `backend/tests/test_build_task.py` | Update tests for new Flutter builders |
| Modify | `backend/tests/test_build.py` | Update tests for multipart `/build` endpoint |

---

## Task 1: Create Flutter wrapper project

**Files:**
- Create: `flutter-wrapper/` (full Flutter project scaffold via `flutter create`)

- [ ] **Step 1: Scaffold the Flutter project**

```bash
cd /Users/hhy/project/h5-app
flutter create --org com.h5packager --project-name h5_app flutter-wrapper
```

Expected: Flutter creates `flutter-wrapper/` with `lib/main.dart`, `android/`, `ios/`, `pubspec.yaml`, etc.

- [ ] **Step 2: Add webview_flutter dependency**

Edit `flutter-wrapper/pubspec.yaml` — in the `dependencies:` section add:

```yaml
  webview_flutter: ^4.10.0
```

- [ ] **Step 3: Rewrite main.dart**

Replace the entire content of `flutter-wrapper/lib/main.dart` with:

```dart
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

const String _h5Url = String.fromEnvironment('H5_URL', defaultValue: 'about:blank');

void main() {
  runApp(const H5App());
}

class H5App extends StatelessWidget {
  const H5App({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      debugShowCheckedModeBanner: false,
      home: WebViewPage(),
    );
  }
}

class WebViewPage extends StatefulWidget {
  const WebViewPage({super.key});

  @override
  State<WebViewPage> createState() => _WebViewPageState();
}

class _WebViewPageState extends State<WebViewPage> {
  late final WebViewController _controller;

  @override
  void initState() {
    super.initState();
    _controller = WebViewController()
      ..setJavaScriptMode(JavaScriptMode.unrestricted)
      ..loadRequest(Uri.parse(_h5Url));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: WebViewWidget(controller: _controller),
    );
  }
}
```

- [ ] **Step 4: Add internet permission to Android manifest**

Edit `flutter-wrapper/android/app/src/main/AndroidManifest.xml`. Inside the `<manifest>` tag, before `<application`, ensure this line exists:

```xml
<uses-permission android:name="android.permission.INTERNET"/>
```

- [ ] **Step 5: Configure Android signing in build.gradle**

Edit `flutter-wrapper/android/app/build.gradle`. Find the `android { ... }` block and add the `signingConfigs` block and wire it to `release` buildType:

```groovy
android {
    // ... existing content ...

    signingConfigs {
        release {
            storeFile file(System.getenv("KEYSTORE_PATH") ?: "${projectDir}/default.jks")
            storePassword System.getenv("KEYSTORE_PASSWORD") ?: "changeit"
            keyAlias System.getenv("KEY_ALIAS") ?: "h5packager"
            keyPassword System.getenv("KEY_PASSWORD") ?: "changeit"
        }
    }

    buildTypes {
        release {
            signingConfig signingConfigs.release
            // keep any existing minifyEnabled / shrinkResources lines
        }
    }
}
```

- [ ] **Step 6: Generate the default keystore**

```bash
cd /Users/hhy/project/h5-app/flutter-wrapper/android/app
keytool -genkeypair \
  -keystore default.jks \
  -alias h5packager \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -storepass changeit \
  -keypass changeit \
  -dname "CN=H5Packager, OU=Dev, O=H5Packager, L=Unknown, S=Unknown, C=US"
```

Expected: `default.jks` created in `flutter-wrapper/android/app/`.

- [ ] **Step 7: Install Flutter dependencies and generate pubspec.lock**

```bash
cd /Users/hhy/project/h5-app/flutter-wrapper
flutter pub get
```

Expected: `pubspec.lock` generated/updated. No errors.

- [ ] **Step 8: Run flutter analyze to verify main.dart compiles cleanly**

```bash
cd /Users/hhy/project/h5-app/flutter-wrapper
flutter analyze
```

Expected: `No issues found!` (or only info-level hints). Fix any errors before proceeding.

- [ ] **Step 9: Commit**

```bash
cd /Users/hhy/project/h5-app
git add flutter-wrapper/
git commit -m "feat: add flutter-wrapper template with WebView and Android signing"
```

---

## Task 2: Update build_task.py — replace Capacitor with Flutter

**Files:**
- Modify: `backend/app/tasks/build_task.py`
- Modify: `backend/tests/test_build_task.py`

- [ ] **Step 1: Write failing tests for new builder functions**

Replace the content of `backend/tests/test_build_task.py` with:

```python
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
        _build_android("https://example.com", "/tmp/flutter", None)

    mock_run.assert_called_once()
    cmd = mock_run.call_args[0][0]
    assert cmd[0] == "flutter"
    assert "build" in cmd
    assert "apk" in cmd
    assert any("H5_URL=https://example.com" in arg for arg in cmd)


def test_build_android_returns_expected_apk_path():
    from app.tasks.build_task import _build_android

    with patch("app.tasks.build_task._run"):
        result = _build_android("https://example.com", "/tmp/flutter", None)

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
        _build_android("https://example.com", "/tmp/flutter", None, keystore_params)

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
        _build_android("https://example.com", "/tmp/flutter", None)

    call_kwargs = mock_run.call_args[1]
    # env should still be passed (copy of os.environ), but no KEYSTORE_PATH override
    assert "env" in call_kwargs
    assert "KEYSTORE_PATH" not in call_kwargs["env"] or \
           call_kwargs["env"].get("KEYSTORE_PATH") == os.environ.get("KEYSTORE_PATH")


# ---------------------------------------------------------------------------
# _build_ios
# ---------------------------------------------------------------------------

def test_build_ios_calls_flutter_build_ios():
    from app.tasks.build_task import _build_ios

    with patch("app.tasks.build_task._run") as mock_run:
        _build_ios("https://example.com", "/tmp/flutter", None)

    cmd = mock_run.call_args[0][0]
    assert cmd[0] == "flutter"
    assert "ios" in cmd
    assert "--no-codesign" in cmd
    assert any("H5_URL=https://example.com" in arg for arg in cmd)


def test_build_ios_returns_runner_app_path():
    from app.tasks.build_task import _build_ios

    with patch("app.tasks.build_task._run"):
        result = _build_ios("https://example.com", "/tmp/flutter", None)

    assert result == "/tmp/flutter/build/ios/iphoneos/Runner.app"


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


def test_build_app_cleans_up_custom_keystore(db):
    """Custom keystore file is deleted in the finally block."""
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

    # Create a real temp file to simulate the uploaded keystore
    with tempfile.NamedTemporaryFile(suffix=".jks", delete=False) as f:
        custom_ks_path = f.name

    engine = db.get_bind()
    SessionFactory = sessionmaker(bind=engine)

    keystore_params = {
        "path": custom_ks_path,
        "password": "secret",
        "alias": "myalias",
        "key_password": "keypass",
    }

    with patch("app.tasks.build_task._get_db", side_effect=lambda: SessionFactory()), \
         patch("app.tasks.build_task.PLATFORM_BUILDERS", {
             "android": MagicMock(side_effect=RuntimeError("skip"))
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
        build_app.run(job.id, "https://example.com", ["android"], keystore_params)

    assert not os.path.exists(custom_ks_path), "Custom keystore should be deleted after build"
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd /Users/hhy/project/h5-app/backend
python -m pytest tests/test_build_task.py -v 2>&1 | head -60
```

Expected: Most tests FAIL because `_build_android`/`_build_ios` still use Capacitor logic.

- [ ] **Step 3: Rewrite build_task.py**

Replace the entire content of `backend/app/tasks/build_task.py` with:

```python
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

REPO_ROOT = os.getenv("REPO_ROOT", os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../../")))
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
        subprocess.run(["npm", "install"], cwd=ele_tmp, capture_output=True, check=True)

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
        # Clean up user-supplied keystore (stored outside tmp_dir, so rmtree won't catch it)
        if keystore_params:
            custom_ks = keystore_params.get("path")
            if custom_ks and os.path.exists(custom_ks):
                os.remove(custom_ks)
        db.close()
```

- [ ] **Step 4: Run tests and confirm they pass**

```bash
cd /Users/hhy/project/h5-app/backend
python -m pytest tests/test_build_task.py -v
```

Expected: All tests PASS.

- [ ] **Step 5: Commit**

```bash
cd /Users/hhy/project/h5-app
git add backend/app/tasks/build_task.py backend/tests/test_build_task.py
git commit -m "feat: replace capacitor build logic with flutter build in build_task.py"
```

---

## Task 3: Update API router to support multipart + keystore upload

**Files:**
- Modify: `backend/app/api/build.py`
- Modify: `backend/app/schemas.py`
- Modify: `backend/tests/test_build.py`

- [ ] **Step 1: Write failing tests for the new multipart endpoint**

Replace the content of `backend/tests/test_build.py` with:

```python
import io
import os
import tempfile
from unittest.mock import patch, MagicMock


def test_submit_build_requires_auth(client):
    resp = client.post("/build", data={"h5_url": "https://example.com", "platforms": "android"})
    assert resp.status_code in (401, 403)


def test_submit_build_success_no_keystore(client, auth_headers):
    """POST /build with form data and no keystore file."""
    mock_task = MagicMock()
    mock_task.id = "fake-task-id-123"
    with patch("app.api.build.build_app.delay", return_value=mock_task):
        resp = client.post(
            "/build",
            data={"h5_url": "https://example.com", "platforms": "android"},
            headers=auth_headers,
        )
    assert resp.status_code == 200
    assert resp.json()["task_id"] == "fake-task-id-123"


def test_submit_build_multiple_platforms(client, auth_headers):
    mock_task = MagicMock()
    mock_task.id = "fake-task-multi"
    with patch("app.api.build.build_app.delay", return_value=mock_task):
        resp = client.post(
            "/build",
            data={"h5_url": "https://example.com", "platforms": ["android", "ios"]},
            headers=auth_headers,
        )
    assert resp.status_code == 200


def test_submit_build_with_keystore(client, auth_headers):
    """POST /build with a keystore file: keystore_params passed to delay() with absolute path."""
    mock_task = MagicMock()
    mock_task.id = "fake-task-ks"
    captured = {}

    def capture_delay(job_id, h5_url, platforms, keystore_params=None):
        captured["keystore_params"] = keystore_params
        return mock_task

    fake_jks = io.BytesIO(b"fake-keystore-data")

    with patch("app.api.build.build_app.delay", side_effect=capture_delay), \
         patch("app.api.build.os.makedirs"), \
         patch("builtins.open", create=True) as mock_open:
        mock_open.return_value.__enter__ = lambda s: s
        mock_open.return_value.__exit__ = MagicMock(return_value=False)
        mock_open.return_value.write = MagicMock()

        resp = client.post(
            "/build",
            data={
                "h5_url": "https://example.com",
                "platforms": "android",
                "keystore_password": "secret",
                "key_alias": "myalias",
                "key_password": "keypass",
            },
            files={"keystore_file": ("my.jks", fake_jks, "application/octet-stream")},
            headers=auth_headers,
        )

    assert resp.status_code == 200
    assert captured.get("keystore_params") is not None
    ks = captured["keystore_params"]
    assert ks["password"] == "secret"
    assert ks["alias"] == "myalias"
    assert ks["key_password"] == "keypass"
    # path must be absolute
    assert os.path.isabs(ks["path"])


def test_submit_build_no_keystore_passes_none(client, auth_headers):
    """When no keystore file is uploaded, keystore_params=None is passed to the task."""
    mock_task = MagicMock()
    mock_task.id = "fake-task-noks"
    captured = {}

    def capture_delay(job_id, h5_url, platforms, keystore_params=None):
        captured["keystore_params"] = keystore_params
        return mock_task

    with patch("app.api.build.build_app.delay", side_effect=capture_delay):
        resp = client.post(
            "/build",
            data={"h5_url": "https://example.com", "platforms": "android"},
            headers=auth_headers,
        )

    assert resp.status_code == 200
    assert captured["keystore_params"] is None


def test_submit_build_rejects_localhost(client, auth_headers):
    resp = client.post(
        "/build",
        data={"h5_url": "http://localhost/app", "platforms": "android"},
        headers=auth_headers,
    )
    assert resp.status_code == 422


def test_submit_build_rejects_invalid_platform(client, auth_headers):
    resp = client.post(
        "/build",
        data={"h5_url": "https://example.com", "platforms": "dos"},
        headers=auth_headers,
    )
    assert resp.status_code == 422


def test_get_build_status_not_found(client, auth_headers):
    resp = client.get("/build/nonexistent-id", headers=auth_headers)
    assert resp.status_code == 404


def test_history_empty(client, auth_headers):
    resp = client.get("/builds/history", headers=auth_headers)
    assert resp.status_code == 200
    assert resp.json() == []
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd /Users/hhy/project/h5-app/backend
python -m pytest tests/test_build.py -v 2>&1 | head -40
```

Expected: Several tests FAIL because `/build` still expects JSON body.

- [ ] **Step 3: Remove BuildRequest from schemas.py**

Edit `backend/app/schemas.py` — delete the `BuildRequest` class:

```python
# DELETE these 3 lines:
class BuildRequest(BaseModel):
    h5_url: str
    platforms: list[str]  # ["android", "ios", "macos", "windows"]
```

- [ ] **Step 4: Rewrite backend/app/api/build.py**

Replace the entire content of `backend/app/api/build.py` with:

```python
import json
import os
import uuid
from typing import List, Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.dependencies import get_db, get_current_user
from app.models.build_job import BuildJob
from app.models.user import User
from app.schemas import BuildSubmitResponse, BuildStatusResponse, HistoryItem
from app.services.url_validator import validate_h5_url, UrlValidationError
from app.services.file_service import build_job_to_status_response, artifact_dir, PLATFORM_FILENAMES
from app.tasks.build_task import build_app

VALID_PLATFORMS = {"android", "ios", "macos", "windows"}
BUILDS_DIR = os.getenv("BUILDS_DIR", "./builds")

router = APIRouter()


@router.post("/build", response_model=BuildSubmitResponse)
async def submit_build(
    h5_url: str = Form(...),
    platforms: List[str] = Form(...),
    keystore_file: Optional[UploadFile] = File(None),
    keystore_password: Optional[str] = Form(None),
    key_alias: Optional[str] = Form(None),
    key_password: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Validate URL
    try:
        validate_h5_url(h5_url)
    except UrlValidationError as e:
        raise HTTPException(status_code=422, detail=str(e))

    # Validate platforms
    invalid = set(platforms) - VALID_PLATFORMS
    if invalid or not platforms:
        raise HTTPException(status_code=422, detail=f"Invalid platforms: {invalid}")

    # Create DB record
    job = BuildJob(
        task_id=str(uuid.uuid4()),
        user_id=current_user.id,
        h5_url=h5_url,
        status="pending",
        requested_platforms=json.dumps(platforms),
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    # Handle optional keystore upload
    keystore_params = None
    if keystore_file is not None:
        ks_dir = os.path.join(BUILDS_DIR, f"ks-{job.id}")
        os.makedirs(ks_dir, exist_ok=True)
        ks_path = os.path.abspath(os.path.join(ks_dir, "custom.jks"))
        contents = await keystore_file.read()
        with open(ks_path, "wb") as f:
            f.write(contents)
        keystore_params = {
            "path": ks_path,
            "password": keystore_password or "changeit",
            "alias": key_alias or "h5packager",
            "key_password": key_password or "changeit",
        }

    # Enqueue Celery task and update task_id to Celery's actual id
    celery_task = build_app.delay(job.id, h5_url, platforms, keystore_params)
    job.task_id = celery_task.id
    db.commit()

    return BuildSubmitResponse(task_id=job.task_id)


@router.get("/build/{task_id}", response_model=BuildStatusResponse)
def get_build_status(
    task_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    job = db.query(BuildJob).filter(
        BuildJob.task_id == task_id,
        BuildJob.user_id == current_user.id,
    ).first()
    if not job:
        raise HTTPException(status_code=404, detail="Build job not found")
    return build_job_to_status_response(job)


@router.get("/files/{task_id}/{filename}")
def download_file(
    task_id: str,
    filename: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Authenticated file download — verifies task belongs to requesting user."""
    job = db.query(BuildJob).filter(
        BuildJob.task_id == task_id,
        BuildJob.user_id == current_user.id,
    ).first()
    if not job:
        raise HTTPException(status_code=404, detail="Build job not found")

    file_path = os.path.join(BUILDS_DIR, task_id, filename)
    if not os.path.isfile(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path, filename=filename)


@router.get("/builds/history", response_model=list[HistoryItem])
def get_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    jobs = (
        db.query(BuildJob)
        .filter(BuildJob.user_id == current_user.id)
        .order_by(BuildJob.created_at.desc())
        .limit(50)
        .all()
    )
    return [
        HistoryItem(
            task_id=j.task_id,
            status=j.status,
            h5_url=j.h5_url,
            created_at=j.created_at,
            requested_platforms=json.loads(j.requested_platforms),
        )
        for j in jobs
    ]
```

Note: The keystore directory is named `ks-<job.id>` (separate from the artifact dir `<celery-task-id>/`) to avoid path collisions. The task's `finally` block deletes `custom.jks` by absolute path; the `ks-<job.id>/` directory itself remains but is empty and harmless.

- [ ] **Step 5: Run tests and confirm they pass**

```bash
cd /Users/hhy/project/h5-app/backend
python -m pytest tests/test_build.py -v
```

Expected: All tests PASS.

- [ ] **Step 6: Run the full test suite**

```bash
cd /Users/hhy/project/h5-app/backend
python -m pytest tests/ -v
```

Expected: All tests PASS with no regressions.

- [ ] **Step 7: Commit**

```bash
cd /Users/hhy/project/h5-app
git add backend/app/api/build.py backend/app/schemas.py backend/tests/test_build.py
git commit -m "feat: update /build endpoint to multipart form with optional keystore upload"
```

---

## Task 4: Delete capacitor-wrapper

**Files:**
- Delete: `capacitor-wrapper/` directory

- [ ] **Step 1: Remove capacitor-wrapper directory**

```bash
cd /Users/hhy/project/h5-app
rm -rf capacitor-wrapper/
```

- [ ] **Step 2: Verify no remaining references to capacitor in backend**

```bash
grep -r "capacitor" /Users/hhy/project/h5-app/backend/ --include="*.py"
```

Expected: No output (zero matches).

- [ ] **Step 3: Run full test suite one more time**

```bash
cd /Users/hhy/project/h5-app/backend
python -m pytest tests/ -v
```

Expected: All tests PASS.

- [ ] **Step 4: Commit**

```bash
cd /Users/hhy/project/h5-app
git add -A
git commit -m "chore: remove capacitor-wrapper, replaced by flutter-wrapper"
```
