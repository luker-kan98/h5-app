import io
import os
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


def test_submit_build_rejects_empty_keystore(client, auth_headers):
    resp = client.post(
        "/build",
        data={"h5_url": "https://example.com", "platforms": "android"},
        files={"keystore_file": ("empty.jks", io.BytesIO(b""), "application/octet-stream")},
        headers=auth_headers,
    )
    assert resp.status_code == 422


def test_submit_build_rejects_oversized_keystore(client, auth_headers):
    resp = client.post(
        "/build",
        data={"h5_url": "https://example.com", "platforms": "android"},
        files={"keystore_file": ("big.jks", io.BytesIO(b"x" * (1_048_576 + 1)), "application/octet-stream")},
        headers=auth_headers,
    )
    assert resp.status_code == 422


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
