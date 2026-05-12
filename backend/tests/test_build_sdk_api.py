import io
import json
from unittest.mock import patch

from PIL import Image


def _png_bytes(size=(1024, 1024)) -> io.BytesIO:
    image = Image.new("RGBA", size, (255, 0, 0, 255))
    buffer = io.BytesIO()
    image.save(buffer, format="PNG")
    buffer.seek(0)
    return buffer


def _form(**overrides):
    data = {
        "h5_url": "https://example.com",
        "platforms": "android",
        "app_name": "Example App",
        "android_package_name": "com.example.app",
    }
    data.update(overrides)
    return data


def _files():
    return {"icon_file": ("icon.png", _png_bytes(), "image/png")}


def test_sdk_catalog_endpoint(client):
    resp = client.get("/sdk-catalog")
    assert resp.status_code == 200
    body = resp.json()
    assert "sdks" in body
    ids = {s["id"] for s in body["sdks"]}
    assert {"sentry", "umeng", "firebase", "appvue", "la51"} <= ids
    assert "jpush" not in ids
    # 51LA exposes a single required maskId field + two optional checkboxes.
    la51 = next(s for s in body["sdks"] if s["id"] == "la51")
    assert la51["category"] == "analytics"
    assert set(la51["supported_platforms"]) == {"android", "ios", "macos", "windows"}
    field_names = {f["name"] for f in la51["fields"]}
    assert field_names == {"maskId", "autoTrack", "hashMode"}


def _patches():
    return (
        patch("app.api.build.run_scheduler_once", return_value={"promoted": 0, "dispatched": 0}),
        patch("app.api.build.refresh_request_status", return_value="submitted"),
        patch("app.api.build.estimate_request_wait_seconds", return_value=0),
    )


def test_build_with_sdk_config_persists_row(client, auth_headers, db, tmp_path):
    from app.models.build_request import BuildRequest
    from app.models.build_sdk_config import BuildSdkConfig

    sdk_payload = json.dumps({"sentry": {"dsn": "https://abc@sentry.io/1"}})
    p1, p2, p3 = _patches()
    with patch("app.api.build.BUILDS_DIR", str(tmp_path)), p1, p2, p3:
        resp = client.post(
            "/build",
            data=_form(custom_js="console.log('boot')", sdk_configs=sdk_payload),
            files=_files(),
            headers=auth_headers,
        )

    assert resp.status_code == 200, resp.text
    request_id = resp.json()["request_id"]
    request = db.query(BuildRequest).filter(BuildRequest.request_id == request_id).one()
    sdk_row = db.query(BuildSdkConfig).filter(BuildSdkConfig.request_id == request.id).one()
    assert sdk_row.custom_js == "console.log('boot')"
    assert json.loads(sdk_row.sdk_configs) == {"sentry": {"dsn": "https://abc@sentry.io/1"}}


def test_build_without_sdk_config_creates_no_sdk_row(client, auth_headers, db, tmp_path):
    from app.models.build_request import BuildRequest
    from app.models.build_sdk_config import BuildSdkConfig

    p1, p2, p3 = _patches()
    with patch("app.api.build.BUILDS_DIR", str(tmp_path)), p1, p2, p3:
        resp = client.post("/build", data=_form(), files=_files(), headers=auth_headers)
    assert resp.status_code == 200
    request_id = resp.json()["request_id"]
    request = db.query(BuildRequest).filter(BuildRequest.request_id == request_id).one()
    assert db.query(BuildSdkConfig).filter(BuildSdkConfig.request_id == request.id).count() == 0


def test_build_rejects_invalid_sdk_json(client, auth_headers, tmp_path):
    p1, p2, p3 = _patches()
    with patch("app.api.build.BUILDS_DIR", str(tmp_path)), p1, p2, p3:
        resp = client.post(
            "/build",
            data=_form(sdk_configs="{not valid"),
            files=_files(),
            headers=auth_headers,
        )
    assert resp.status_code == 422


def test_build_rejects_unknown_sdk(client, auth_headers, tmp_path):
    p1, p2, p3 = _patches()
    with patch("app.api.build.BUILDS_DIR", str(tmp_path)), p1, p2, p3:
        resp = client.post(
            "/build",
            data=_form(sdk_configs=json.dumps({"frobnitz": {}})),
            files=_files(),
            headers=auth_headers,
        )
    assert resp.status_code == 422


def test_build_rejects_missing_required_field(client, auth_headers, tmp_path):
    p1, p2, p3 = _patches()
    with patch("app.api.build.BUILDS_DIR", str(tmp_path)), p1, p2, p3:
        resp = client.post(
            "/build",
            data=_form(sdk_configs=json.dumps({"sentry": {}})),
            files=_files(),
            headers=auth_headers,
        )
    assert resp.status_code == 422


def test_build_rejects_sdk_unsupported_on_selected_platforms(client, auth_headers, tmp_path):
    # Umeng supports android+ios only, but build is for macos.
    p1, p2, p3 = _patches()
    with patch("app.api.build.BUILDS_DIR", str(tmp_path)), p1, p2, p3:
        resp = client.post(
            "/build",
            data={
                "h5_url": "https://example.com",
                "platforms": "macos",
                "app_name": "Mac Only",
                "sdk_configs": json.dumps({"umeng": {"androidAppKey": "x"}}),
            },
            files=_files(),
            headers=auth_headers,
        )
    assert resp.status_code == 422


def test_rebuild_copies_sdk_config(client, auth_headers, db, tmp_path):
    from app.models.build_request import BuildRequest
    from app.models.build_sdk_config import BuildSdkConfig

    sdk_payload = json.dumps({"sentry": {"dsn": "https://x@y/1"}})
    p1, p2, p3 = _patches()
    with patch("app.api.build.BUILDS_DIR", str(tmp_path)), p1, p2, p3:
        resp = client.post(
            "/build",
            data=_form(custom_js="x()", sdk_configs=sdk_payload),
            files=_files(),
            headers=auth_headers,
        )
        assert resp.status_code == 200
        original_id = resp.json()["request_id"]
        # Mark original as failed so /rebuild accepts it.
        original = db.query(BuildRequest).filter(BuildRequest.request_id == original_id).one()
        original.status = "failed"
        db.commit()
        rebuild_resp = client.post(f"/rebuild/{original_id}", headers=auth_headers)
        assert rebuild_resp.status_code == 200, rebuild_resp.text

    new_id = rebuild_resp.json()["request_id"]
    new_request = db.query(BuildRequest).filter(BuildRequest.request_id == new_id).one()
    new_sdk = db.query(BuildSdkConfig).filter(BuildSdkConfig.request_id == new_request.id).one()
    assert new_sdk.custom_js == "x()"
    assert json.loads(new_sdk.sdk_configs) == {"sentry": {"dsn": "https://x@y/1"}}


# 51LA maskId validation tests
import pytest

from app.services.sdk_catalog import (
    SdkValidationError,
    validate_sdk_configs,
)


def test_validate_la51_maskid_required():
    with pytest.raises(SdkValidationError, match="maskId"):
        validate_sdk_configs({"la51": {}}, ["android"])


def test_validate_la51_maskid_rejects_special_chars():
    with pytest.raises(SdkValidationError, match="maskId"):
        validate_sdk_configs(
            {"la51": {"maskId": "abc';alert(1)"}}, ["android"]
        )


def test_validate_la51_maskid_rejects_too_long():
    with pytest.raises(SdkValidationError, match="maskId"):
        validate_sdk_configs(
            {"la51": {"maskId": "a" * 33}}, ["android"]
        )


def test_validate_la51_maskid_accepts_real_sample():
    cleaned = validate_sdk_configs(
        {"la51": {"maskId": "KrDopMys2nnwBDrx"}},
        ["android"],
    )
    assert cleaned["la51"]["maskId"] == "KrDopMys2nnwBDrx"


def test_validate_la51_maskid_accepts_booleans():
    cleaned = validate_sdk_configs(
        {"la51": {"maskId": "KrDopMys2nnwBDrx", "autoTrack": True, "hashMode": False}},
        ["android", "ios"],
    )
    assert cleaned["la51"]["autoTrack"] is True
    assert cleaned["la51"]["hashMode"] is False
