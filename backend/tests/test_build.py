import io
import os
from unittest.mock import patch

from PIL import Image


def _png_bytes(size=(1024, 1024), color=(255, 0, 0, 255), format="PNG") -> io.BytesIO:
    mode = "RGBA" if format == "PNG" else "RGB"
    image = Image.new(mode, size, color[:3] if mode == "RGB" else color)
    buffer = io.BytesIO()
    image.save(buffer, format=format)
    buffer.seek(0)
    return buffer


def _build_form_data(**overrides):
    data = {
        "h5_url": "https://example.com",
        "platforms": "android",
        "app_name": "Example App",
        "android_package_name": "com.example.app",
    }
    data.update(overrides)
    return data


def _build_files(icon_stream=None, icon_name="icon.png", icon_content_type="image/png", **extra_files):
    files = {
        "icon_file": (icon_name, icon_stream or _png_bytes(), icon_content_type),
    }
    files.update(extra_files)
    return files


def test_submit_build_requires_auth(client):
    resp = client.post(
        "/build",
        data=_build_form_data(),
        files=_build_files(),
    )
    assert resp.status_code in (401, 403)


def test_submit_build_success_creates_request_and_task(client, auth_headers, tmp_path, db):
    from app.models.build_request import BuildRequest
    from app.models.build_task import BuildTask

    with patch("app.api.build.BUILDS_DIR", str(tmp_path)), \
         patch("app.api.build.run_scheduler_once", return_value={"promoted": 0, "dispatched": 0}), \
         patch("app.api.build.refresh_request_status", return_value="submitted"), \
         patch("app.api.build.estimate_request_wait_seconds", return_value=180):
        resp = client.post(
            "/build",
            data=_build_form_data(),
            files=_build_files(),
            headers=auth_headers,
        )

    assert resp.status_code == 200
    body = resp.json()
    assert body["task_id"] == body["request_id"]
    assert body["queue_state"] == "submitted"
    assert body["estimated_wait_seconds"] == 180
    assert len(body["task_ids"]) == 1

    request = db.query(BuildRequest).filter(BuildRequest.request_id == body["request_id"]).one()
    task = db.query(BuildTask).filter(BuildTask.request_id == request.id).one()
    assert request.h5_url == "https://example.com"
    assert request.app_name == "Example App"
    assert request.android_package_name == "com.example.app"
    assert os.path.isabs(request.icon_path)
    assert task.task_id == body["task_ids"][0]
    assert task.platform == "android"
    assert task.status == "submitted"
    assert task.resource_profile == "android"


def test_submit_build_multiple_platforms(client, auth_headers, tmp_path, db):
    from app.models.build_request import BuildRequest
    from app.models.build_task import BuildTask

    with patch("app.api.build.BUILDS_DIR", str(tmp_path)), \
         patch("app.api.build.run_scheduler_once", return_value={"promoted": 2, "dispatched": 0}), \
         patch("app.api.build.refresh_request_status", return_value="waiting_capacity"), \
         patch("app.api.build.estimate_request_wait_seconds", return_value=300):
        resp = client.post(
            "/build",
            data={
                "h5_url": "https://example.com",
                "platforms": ["android", "ios"],
                "app_name": "Example App",
                "android_package_name": "com.example.app",
            },
            files=_build_files(),
            headers=auth_headers,
        )

    assert resp.status_code == 200
    body = resp.json()
    assert len(body["task_ids"]) == 2

    request = db.query(BuildRequest).filter(BuildRequest.request_id == body["request_id"]).one()
    tasks = db.query(BuildTask).filter(BuildTask.request_id == request.id).all()
    assert {task.platform for task in tasks} == {"android", "ios"}


def test_submit_build_with_keystore(client, auth_headers, tmp_path, db):
    from app.models.build_request import BuildRequest

    fake_jks = io.BytesIO(b"fake-keystore-data")

    with patch("app.api.build.BUILDS_DIR", str(tmp_path)), \
         patch("app.api.build.run_scheduler_once", return_value={"promoted": 0, "dispatched": 0}), \
         patch("app.api.build.refresh_request_status", return_value="submitted"), \
         patch("app.api.build.estimate_request_wait_seconds", return_value=0):
        resp = client.post(
            "/build",
            data={
                **_build_form_data(),
                "keystore_password": "secret",
                "key_alias": "myalias",
                "key_password": "keypass",
            },
            files=_build_files(
                keystore_file=("my.jks", fake_jks, "application/octet-stream"),
            ),
            headers=auth_headers,
        )

    assert resp.status_code == 200
    request = db.query(BuildRequest).filter(BuildRequest.request_id == resp.json()["request_id"]).one()
    assert os.path.isabs(request.keystore_path)
    assert request.keystore_password == "secret"
    assert request.key_alias == "myalias"
    assert request.key_password == "keypass"


def test_submit_build_rejects_empty_keystore(client, auth_headers, tmp_path):
    with patch("app.api.build.BUILDS_DIR", str(tmp_path)):
        resp = client.post(
            "/build",
            data=_build_form_data(),
            files=_build_files(
                keystore_file=("empty.jks", io.BytesIO(b""), "application/octet-stream"),
            ),
            headers=auth_headers,
        )
    assert resp.status_code == 422


def test_submit_build_rejects_oversized_keystore(client, auth_headers, tmp_path):
    with patch("app.api.build.BUILDS_DIR", str(tmp_path)):
        resp = client.post(
            "/build",
            data=_build_form_data(),
            files=_build_files(
                keystore_file=("big.jks", io.BytesIO(b"x" * (1_048_576 + 1)), "application/octet-stream"),
            ),
            headers=auth_headers,
        )
    assert resp.status_code == 422


def test_submit_build_rejects_non_png_icon(client, auth_headers, tmp_path):
    with patch("app.api.build.BUILDS_DIR", str(tmp_path)):
        resp = client.post(
            "/build",
            data=_build_form_data(),
            files=_build_files(
                icon_stream=_png_bytes(format="JPEG"),
                icon_name="icon.jpg",
                icon_content_type="image/jpeg",
            ),
            headers=auth_headers,
        )
    assert resp.status_code == 422
    assert resp.json()["detail"] == "Icon must be a PNG image"


def test_submit_build_rejects_non_square_icon(client, auth_headers, tmp_path):
    with patch("app.api.build.BUILDS_DIR", str(tmp_path)):
        resp = client.post(
            "/build",
            data=_build_form_data(),
            files=_build_files(icon_stream=_png_bytes(size=(1024, 768))),
            headers=auth_headers,
        )
    assert resp.status_code == 422
    assert resp.json()["detail"] == "Icon must be a square image"


def test_submit_build_rejects_small_icon(client, auth_headers, tmp_path):
    with patch("app.api.build.BUILDS_DIR", str(tmp_path)):
        resp = client.post(
            "/build",
            data=_build_form_data(),
            files=_build_files(icon_stream=_png_bytes(size=(512, 512))),
            headers=auth_headers,
        )
    assert resp.status_code == 422
    assert resp.json()["detail"] == "Icon must be at least 1024x1024 pixels"


def test_submit_build_rejects_missing_android_package(client, auth_headers, tmp_path):
    with patch("app.api.build.BUILDS_DIR", str(tmp_path)):
        resp = client.post(
            "/build",
            data=_build_form_data(android_package_name=""),
            files=_build_files(),
            headers=auth_headers,
        )
    assert resp.status_code == 422
    assert resp.json()["detail"] == "Android package name is required when android is selected"


def test_submit_build_rejects_invalid_android_package(client, auth_headers, tmp_path):
    with patch("app.api.build.BUILDS_DIR", str(tmp_path)):
        resp = client.post(
            "/build",
            data=_build_form_data(android_package_name="com.Example.app"),
            files=_build_files(),
            headers=auth_headers,
        )
    assert resp.status_code == 422
    assert resp.json()["detail"] == "Invalid Android package name"


def test_submit_build_rejects_localhost(client, auth_headers, tmp_path):
    with patch("app.api.build.BUILDS_DIR", str(tmp_path)):
        resp = client.post(
            "/build",
            data=_build_form_data(h5_url="http://localhost/app"),
            files=_build_files(),
            headers=auth_headers,
        )
    assert resp.status_code == 422


def test_submit_build_rejects_invalid_platform(client, auth_headers, tmp_path):
    with patch("app.api.build.BUILDS_DIR", str(tmp_path)):
        resp = client.post(
            "/build",
            data=_build_form_data(platforms="dos"),
            files=_build_files(),
            headers=auth_headers,
        )
    assert resp.status_code == 422
