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
