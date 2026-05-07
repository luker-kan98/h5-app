import json
import os
from pathlib import Path

import pytest

from app.services import sdk_injector


def _proxy_payload():
    return {
        "ossUrls": ["https://a/b"],
        "updateIntervalHours": 1.5,
        "dnsTxtDomains": ["fallback.example.com"],
        "builtinProxies": [
            {"name": "hk", "type": "ss", "server": "h", "port": 1,
             "cipher": "aes-256-gcm", "password": "pw", "udp": False}
        ],
        "disableDirect": True,
    }


def test_apply_flutter_emits_proxy_config(tmp_path):
    sdk_injector.apply_flutter(tmp_path, None, {"proxy": _proxy_payload()})
    out = (tmp_path / "lib/sdk_config.dart").read_text(encoding="utf-8")
    assert "const String proxyConfigJson =" in out
    # The constant should round-trip back to our payload.
    line = next(l for l in out.splitlines() if "proxyConfigJson" in l)
    literal = line.split("=", 1)[1].strip().rstrip(";").strip().strip('"')
    # Un-escape the Dart string literal to get the JSON.
    literal = literal.replace('\\"', '"').replace("\\\\", "\\")
    parsed = json.loads(literal)
    assert parsed["ossUrls"] == ["https://a/b"]
    assert parsed["builtinProxies"][0]["server"] == "h"
    assert parsed["disableDirect"] is True


def test_apply_flutter_emits_empty_proxy_when_disabled(tmp_path):
    sdk_injector.apply_flutter(tmp_path, None, {"sentry": {"dsn": "x"}})
    out = (tmp_path / "lib/sdk_config.dart").read_text(encoding="utf-8")
    assert 'const String proxyConfigJson = "";' in out


def _make_vendor_tree(root: Path) -> Path:
    base = root / "singbox"
    for sub in ("android/arm64-v8a", "android/armeabi-v7a", "android/x86_64", "darwin", "windows"):
        (base / sub).mkdir(parents=True, exist_ok=True)
    (base / "android/arm64-v8a/sing-box").write_bytes(b"FAKE-arm64")
    (base / "android/armeabi-v7a/sing-box").write_bytes(b"FAKE-arm32")
    (base / "android/x86_64/sing-box").write_bytes(b"FAKE-x64")
    (base / "darwin/sing-box").write_bytes(b"FAKE-mac")
    (base / "windows/sing-box.exe").write_bytes(b"FAKE-win")
    return base


def test_copy_singbox_for_flutter_when_proxy_enabled(tmp_path):
    vendor = _make_vendor_tree(tmp_path / "vendor")
    flutter_dir = tmp_path / "flutter"
    sdk_injector.copy_singbox_for_flutter(flutter_dir, vendor_dir=vendor)
    arm64 = flutter_dir / "android/app/src/main/jniLibs/arm64-v8a/libsingbox.so"
    assert arm64.exists()
    assert arm64.read_bytes() == b"FAKE-arm64"
    assert (flutter_dir / "android/app/src/main/jniLibs/armeabi-v7a/libsingbox.so").exists()
    assert (flutter_dir / "android/app/src/main/jniLibs/x86_64/libsingbox.so").exists()


def test_copy_singbox_for_electron_macos(tmp_path):
    vendor = _make_vendor_tree(tmp_path / "vendor")
    electron_dir = tmp_path / "electron"
    electron_dir.mkdir()
    sdk_injector.copy_singbox_for_electron(electron_dir, target_platform="macos", vendor_dir=vendor)
    bin_path = electron_dir / "resources/singbox/sing-box"
    assert bin_path.exists()
    assert bin_path.read_bytes() == b"FAKE-mac"


def test_copy_singbox_for_electron_windows(tmp_path):
    vendor = _make_vendor_tree(tmp_path / "vendor")
    electron_dir = tmp_path / "electron"
    electron_dir.mkdir()
    sdk_injector.copy_singbox_for_electron(electron_dir, target_platform="windows", vendor_dir=vendor)
    bin_path = electron_dir / "resources/singbox/sing-box.exe"
    assert bin_path.exists()
    assert bin_path.read_bytes() == b"FAKE-win"


def test_copy_singbox_for_electron_unsupported_platform_raises(tmp_path):
    vendor = _make_vendor_tree(tmp_path / "vendor")
    electron_dir = tmp_path / "electron"
    electron_dir.mkdir()
    with pytest.raises(ValueError):
        sdk_injector.copy_singbox_for_electron(electron_dir, target_platform="linux", vendor_dir=vendor)


def test_copy_singbox_for_flutter_missing_binary_raises(tmp_path):
    # vendor exists but is empty
    vendor = tmp_path / "vendor" / "singbox"
    vendor.mkdir(parents=True)
    flutter_dir = tmp_path / "flutter"
    with pytest.raises(FileNotFoundError):
        sdk_injector.copy_singbox_for_flutter(flutter_dir, vendor_dir=vendor)
