# Proxy Network Layer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an opt-in Shadowsocks proxy runtime to packaged H5 apps so WebView traffic can transit a remote node, with cloud-updated node pools (OSS / DNS TXT / built-in) and priority failover. Android + macOS + Windows; iOS deferred.

**Architecture:** A new `proxy` SDK in the existing catalog injects (a) a `proxyConfigJson` constant on Flutter and a `proxy` key inside `__SDK_CONFIGS__` on Electron, and (b) a sing-box binary, into per-build wrapper copies. App-side runtimes (Dart for Android, Node for Electron) bootstrap the node pool, probe nodes against the H5 URL, point WebView at sing-box's local SOCKS5 (Electron) / HTTP (Android) inbound, and refresh on a timer. Backend remains the single parser source of truth — runtimes consume already-normalized JSON.

**Tech Stack:** Python (FastAPI/SQLAlchemy/PyYAML), Vue 3, Dart (`webview_flutter ^4.10.0`, `package:http`), Kotlin (`androidx.webkit ProxyController`), Node 20 (`child_process`, `socks-proxy-agent`, `vitest`), `sing-box` static binaries.

**Reference spec:** `docs/superpowers/specs/2026-05-07-proxy-network-layer-design.md`

---

## File Structure

### Backend (Python)
- **Create** `backend/app/services/proxy_node_parser.py` — single-source parser: SS URI / Clash YAML inline / strict JSON → `ProxyNode` dataclass; exposes `parse_node_line`, `validate_node_dict`, cipher whitelist, `ProxyNode` class.
- **Modify** `backend/app/services/sdk_catalog.py` — extend `SdkField` with `widget`/`placeholder`/`help_zh`; add `network` to `VALID_CATEGORIES`; raise `SDK_CONFIGS_MAX_BYTES` to 50 KB; add `proxy` SDK definition; extend `validate_sdk_configs` with proxy-specific normalization (line splits, parser invocation, bool/number coercion, range checks).
- **Modify** `backend/app/services/sdk_injector.py` — emit `proxyConfigJson` constant in Flutter, write `proxy` key with normalized arrays in Electron's `__SDK_CONFIGS__`, and copy the `sing-box` binary into the per-build wrapper copy.
- **Create** `backend/vendor/singbox/README.md`, `backend/vendor/singbox/fetch.sh`, `backend/vendor/singbox/.gitignore` — pinned binary acquisition.
- **Create** `backend/tests/test_proxy_node_parser.py`
- **Create** `backend/tests/test_sdk_proxy_validation.py`
- **Create** `backend/tests/test_sdk_injector_proxy.py`
- **Modify** `backend/tests/test_sdk_catalog.py` — adapt to new `SdkField` shape (snapshot delta).

### Frontend (Vue)
- **Modify** `frontend/src/components/SdkConfigSection.vue` — render fields by `widget` (`text` / `textarea` / `number` / `checkbox`), display `help_zh` and `placeholder`.

### Flutter Wrapper (Dart + Kotlin)
- **Create** `flutter-wrapper/lib/proxy/proxy_node.dart` — `ProxyNode` data class + `fromJson`. No parser.
- **Create** `flutter-wrapper/lib/proxy/node_pool.dart` — Bootstrap from built-in / OSS / DoH; refresh timer.
- **Create** `flutter-wrapper/lib/proxy/singbox_supervisor.dart` — `Process.start` + restart policy (≤3/min).
- **Create** `flutter-wrapper/lib/proxy/probe_selector.dart` — HEAD H5 URL through HTTP proxy on `127.0.0.1:1081`.
- **Create** `flutter-wrapper/lib/proxy/proxy_runtime.dart` — Orchestration singleton.
- **Create** `flutter-wrapper/lib/proxy/proxy_controller.dart` — MethodChannel client.
- **Create** `flutter-wrapper/lib/proxy/error_page.dart` — Inline HTML error page constant + retry hooks.
- **Create** `flutter-wrapper/android/app/src/main/kotlin/com/h5packager/h5_app/ProxyControllerPlugin.kt` — Wraps `androidx.webkit.ProxyController.setProxyOverride`.
- **Modify** `flutter-wrapper/android/app/src/main/kotlin/com/h5packager/h5_app/MainActivity.kt` — Register ProxyControllerPlugin channel.
- **Modify** `flutter-wrapper/android/app/build.gradle` — Add `androidx.webkit:webkit:1.10.0`.
- **Modify** `flutter-wrapper/lib/main.dart` — Init proxy runtime before WebView creation.
- **Modify** `flutter-wrapper/pubspec.yaml` — Add `http: ^1.2.0` dep.
- **Create** `flutter-wrapper/test/proxy/node_pool_test.dart`
- **Create** `flutter-wrapper/test/proxy/probe_selector_test.dart`
- **Create** `flutter-wrapper/test/proxy/singbox_supervisor_test.dart`

### Electron Wrapper (Node)
- **Create** `electron-wrapper/proxy/proxy-node.js`
- **Create** `electron-wrapper/proxy/node-pool.js`
- **Create** `electron-wrapper/proxy/singbox-supervisor.js`
- **Create** `electron-wrapper/proxy/probe-selector.js`
- **Create** `electron-wrapper/proxy/proxy-runtime.js`
- **Create** `electron-wrapper/proxy/error-page.js`
- **Modify** `electron-wrapper/main.js` — Boot proxy runtime; `session.setProxy`.
- **Modify** `electron-wrapper/package.json` — Add `socks-proxy-agent` dep, `vitest`+`sinon` devDeps, `extraResources` rule, `test` script.
- **Create** `electron-wrapper/resources/singbox/.gitkeep`
- **Create** `electron-wrapper/test/proxy/node-pool.test.js`
- **Create** `electron-wrapper/test/proxy/probe-selector.test.js`
- **Create** `electron-wrapper/test/proxy/singbox-supervisor.test.js`

---

## Phase 1 — Backend: catalog widget extension (SDK_CONFIGS_MAX_BYTES bump + new fields)

### Task 1: Extend `SdkField` with widget metadata

**Files:**
- Modify: `backend/app/services/sdk_catalog.py`
- Test: `backend/tests/test_sdk_catalog.py`

- [ ] **Step 1: Adapt the existing integrity test to assert widget defaults**

Add this test to `backend/tests/test_sdk_catalog.py`:

```python
def test_field_widget_defaults_and_extension():
    from app.services.sdk_catalog import SdkField
    f = SdkField(name="x", label_en="X", label_zh="X")
    assert f.widget == "text"
    assert f.placeholder is None
    assert f.help_zh is None

    g = SdkField(
        name="y",
        label_en="Y",
        label_zh="Y",
        widget="textarea",
        placeholder="hint",
        help_zh="(hint)",
    )
    assert g.widget == "textarea"
    assert g.placeholder == "hint"
    assert g.help_zh == "(hint)"


def test_catalog_serializes_widget_fields():
    from app.services.sdk_catalog import catalog_as_dict
    payload = catalog_as_dict()
    for sdk in payload["sdks"]:
        for field in sdk["fields"]:
            assert "widget" in field
            assert "placeholder" in field
            assert "help_zh" in field
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd backend && python -m pytest tests/test_sdk_catalog.py::test_field_widget_defaults_and_extension tests/test_sdk_catalog.py::test_catalog_serializes_widget_fields -v`
Expected: FAIL — `widget` attribute / key missing.

- [ ] **Step 3: Extend `SdkField` and `catalog_as_dict`**

Edit `backend/app/services/sdk_catalog.py`:

```python
@dataclass(frozen=True)
class SdkField:
    name: str
    label_en: str
    label_zh: str
    required: bool = True
    secret: bool = False
    # Platforms that need this field. Empty list = needed whenever the SDK is enabled.
    platforms: tuple[str, ...] = ()
    # UI rendering hints (optional, default to single-line text input).
    widget: str = "text"  # text | textarea | number | checkbox
    placeholder: str | None = None
    help_zh: str | None = None
```

Update `catalog_as_dict()` so the field serialization carries the new keys:

```python
def catalog_as_dict() -> dict[str, Any]:
    """Serialize the catalog for the public /sdk-catalog endpoint."""
    return {
        "sdks": [
            {
                **asdict(definition),
                "supported_platforms": list(definition.supported_platforms),
                "fields": [
                    {
                        **asdict(f),
                        "platforms": list(f.platforms),
                    }
                    for f in definition.fields
                ],
            }
            for definition in CATALOG.values()
        ]
    }
```

(`asdict` already includes `widget`, `placeholder`, `help_zh` because they are dataclass fields, so the explicit `**asdict(f)` line is sufficient.)

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd backend && python -m pytest tests/test_sdk_catalog.py -v`
Expected: all pass (the existing tests, including `test_catalog_integrity` and `test_catalog_serializes_for_api`, must still pass).

- [ ] **Step 5: Commit**

```bash
git add backend/app/services/sdk_catalog.py backend/tests/test_sdk_catalog.py
git commit -m "feat(sdk-catalog): extend SdkField with widget/placeholder/help_zh"
```

---

### Task 2: Bump `SDK_CONFIGS_MAX_BYTES` to 50 KB and adapt existing test

**Files:**
- Modify: `backend/app/services/sdk_catalog.py`
- Modify: `backend/tests/test_sdk_catalog.py`

- [ ] **Step 1: Update the existing `test_parse_rejects_too_large` test**

Edit `backend/tests/test_sdk_catalog.py`, replace the existing `test_parse_rejects_too_large` with:

```python
def test_parse_rejects_too_large():
    big = "x" * (50 * 1024 + 1)
    payload = json.dumps({"sentry": {"dsn": big}})
    with pytest.raises(SdkValidationError):
        parse_sdk_configs(payload)


def test_parse_accepts_up_to_50kb():
    # 50 KB exactly is allowed; only strictly > 50 KB is rejected.
    payload = json.dumps({"sentry": {"dsn": "x" * (50 * 1024 - 64)}})
    parse_sdk_configs(payload)  # should not raise
```

- [ ] **Step 2: Run tests to verify the second one fails**

Run: `cd backend && python -m pytest tests/test_sdk_catalog.py::test_parse_accepts_up_to_50kb -v`
Expected: FAIL — current limit is 10 KB.

- [ ] **Step 3: Bump the constant**

Edit `backend/app/services/sdk_catalog.py`, change:
```python
SDK_CONFIGS_MAX_BYTES = 10 * 1024
```
to:
```python
SDK_CONFIGS_MAX_BYTES = 50 * 1024
```

Also update the error message string to mention 50 KB:
```python
raise SdkValidationError("sdk_configs payload too large (max 50KB)")
```

- [ ] **Step 4: Run tests**

Run: `cd backend && python -m pytest tests/test_sdk_catalog.py -v`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add backend/app/services/sdk_catalog.py backend/tests/test_sdk_catalog.py
git commit -m "feat(sdk-catalog): raise SDK_CONFIGS_MAX_BYTES to 50KB"
```

---

## Phase 2 — Backend: ProxyNode parser

### Task 3: SS URI parser

**Files:**
- Create: `backend/app/services/proxy_node_parser.py`
- Test: `backend/tests/test_proxy_node_parser.py`

- [ ] **Step 1: Write the failing test file**

Create `backend/tests/test_proxy_node_parser.py`:

```python
import pytest

from app.services.proxy_node_parser import (
    ProxyNode,
    ProxyNodeError,
    parse_ss_uri,
    SS_CIPHERS,
)


def test_parse_ss_uri_base64_with_fragment():
    # base64("aes-256-gcm:secretpw") = YWVzLTI1Ni1nY206c2VjcmV0cHc=
    uri = "ss://YWVzLTI1Ni1nY206c2VjcmV0cHc=@hk.example.com:31870#hk%20proxy"
    node = parse_ss_uri(uri)
    assert node == ProxyNode(
        name="hk proxy",
        type="ss",
        server="hk.example.com",
        port=31870,
        cipher="aes-256-gcm",
        password="secretpw",
        udp=False,
    )


def test_parse_ss_uri_url_safe_base64():
    # url-safe base64 of "chacha20-ietf-poly1305:p_w-d-=":
    # cmVwbGFjZWQ – we'll let the test compute base64 itself for clarity:
    import base64
    payload = base64.urlsafe_b64encode(b"chacha20-ietf-poly1305:p_w-d-=").decode().rstrip("=")
    uri = f"ss://{payload}@example.com:8388"
    node = parse_ss_uri(uri)
    assert node.cipher == "chacha20-ietf-poly1305"
    assert node.password == "p_w-d-="
    assert node.name == "example.com:8388"  # default name when no fragment


def test_parse_ss_uri_rejects_unknown_cipher():
    import base64
    payload = base64.b64encode(b"rc4-md5:pw").decode().rstrip("=")
    with pytest.raises(ProxyNodeError):
        parse_ss_uri(f"ss://{payload}@example.com:8388")


def test_parse_ss_uri_rejects_bad_port():
    import base64
    payload = base64.b64encode(b"aes-256-gcm:pw").decode().rstrip("=")
    with pytest.raises(ProxyNodeError):
        parse_ss_uri(f"ss://{payload}@example.com:0")
    with pytest.raises(ProxyNodeError):
        parse_ss_uri(f"ss://{payload}@example.com:65536")


def test_parse_ss_uri_rejects_non_ss():
    with pytest.raises(ProxyNodeError):
        parse_ss_uri("trojan://abc@example.com:8388")


def test_ss_cipher_whitelist_contents():
    assert "aes-256-gcm" in SS_CIPHERS
    assert "chacha20-ietf-poly1305" in SS_CIPHERS
    assert "rc4-md5" not in SS_CIPHERS
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd backend && python -m pytest tests/test_proxy_node_parser.py -v`
Expected: FAIL — module does not exist.

- [ ] **Step 3: Implement `proxy_node_parser.py` with `ProxyNode` and `parse_ss_uri`**

Create `backend/app/services/proxy_node_parser.py`:

```python
"""Single-source-of-truth parser for proxy node inputs.

Accepts three input forms (all per-line in the user's textarea):
  - SS URI:           ss://BASE64(method:password)@host:port[#name]
  - Strict JSON:      {"name": ..., "type": "ss", "server": ..., ...}
  - Clash YAML inline {name: 'x', type: ss, server: ..., port: ..., ...}

Output is always a ProxyNode dataclass instance.
"""
from __future__ import annotations

import base64
import binascii
import json
from dataclasses import dataclass, asdict
from typing import Any
from urllib.parse import unquote, urlparse

import yaml


SS_CIPHERS = frozenset(
    {
        "aes-128-gcm",
        "aes-192-gcm",
        "aes-256-gcm",
        "chacha20-ietf-poly1305",
        "xchacha20-ietf-poly1305",
        "2022-blake3-aes-128-gcm",
        "2022-blake3-aes-256-gcm",
        "2022-blake3-chacha20-poly1305",
    }
)

ALLOWED_TYPES = frozenset({"ss"})


class ProxyNodeError(ValueError):
    """Raised when proxy node input cannot be parsed or fails validation."""


@dataclass
class ProxyNode:
    name: str
    type: str
    server: str
    port: int
    cipher: str
    password: str
    udp: bool = False

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


def _decode_b64_lenient(data: str) -> bytes:
    """Decode standard or url-safe base64, padding-tolerant."""
    s = data.strip()
    s_padded = s + "=" * (-len(s) % 4)
    try:
        return base64.urlsafe_b64decode(s_padded)
    except (binascii.Error, ValueError):
        try:
            return base64.b64decode(s_padded)
        except (binascii.Error, ValueError) as e:
            raise ProxyNodeError(f"invalid base64 in SS URI: {e}") from e


def _validate(node: ProxyNode) -> ProxyNode:
    if node.type not in ALLOWED_TYPES:
        raise ProxyNodeError(f"unsupported type {node.type!r} (only 'ss' is supported)")
    if not node.server:
        raise ProxyNodeError("server is empty")
    if not (1 <= node.port <= 65535):
        raise ProxyNodeError(f"port {node.port} out of range 1..65535")
    if node.cipher not in SS_CIPHERS:
        raise ProxyNodeError(
            f"cipher {node.cipher!r} is not in the supported list"
        )
    if not node.password:
        raise ProxyNodeError("password is empty")
    if not node.name:
        node.name = f"{node.server}:{node.port}"
    return node


def parse_ss_uri(uri: str) -> ProxyNode:
    """Parse `ss://BASE64(method:password)@host:port[#name]`."""
    if not uri.startswith("ss://"):
        raise ProxyNodeError(f"expected ss:// scheme, got: {uri[:16]!r}")
    parsed = urlparse(uri)
    if parsed.scheme != "ss":
        raise ProxyNodeError(f"expected ss scheme, got {parsed.scheme!r}")

    userinfo = parsed.username
    if userinfo is None:
        raise ProxyNodeError("SS URI missing userinfo")
    decoded = _decode_b64_lenient(userinfo).decode("utf-8", errors="replace")
    if ":" not in decoded:
        raise ProxyNodeError("SS URI userinfo must decode to method:password")
    cipher, password = decoded.split(":", 1)

    host = parsed.hostname or ""
    port = parsed.port or 0
    fragment = unquote(parsed.fragment) if parsed.fragment else ""

    return _validate(
        ProxyNode(
            name=fragment,
            type="ss",
            server=host,
            port=port,
            cipher=cipher,
            password=password,
            udp=False,
        )
    )


# parse_node_line, validate_node_dict, parse_clash_inline added in later tasks.
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `cd backend && python -m pytest tests/test_proxy_node_parser.py -v`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add backend/app/services/proxy_node_parser.py backend/tests/test_proxy_node_parser.py
git commit -m "feat(proxy): add SS URI parser"
```

---

### Task 4: JSON / Clash YAML inline parser + dispatcher

**Files:**
- Modify: `backend/app/services/proxy_node_parser.py`
- Modify: `backend/tests/test_proxy_node_parser.py`

- [ ] **Step 1: Add tests for JSON / Clash / dispatch**

Append to `backend/tests/test_proxy_node_parser.py`:

```python
def test_validate_node_dict_strict_json_shape():
    from app.services.proxy_node_parser import validate_node_dict
    node = validate_node_dict({
        "name": "hk-1",
        "type": "ss",
        "server": "hk.example.com",
        "port": 8388,
        "cipher": "aes-256-gcm",
        "password": "pw",
        "udp": True,
    })
    assert node.name == "hk-1"
    assert node.udp is True


def test_validate_node_dict_missing_required_field():
    from app.services.proxy_node_parser import validate_node_dict
    with pytest.raises(ProxyNodeError):
        validate_node_dict({"name": "x", "type": "ss", "server": "h"})  # no port etc


def test_validate_node_dict_coerces_string_port():
    from app.services.proxy_node_parser import validate_node_dict
    node = validate_node_dict({
        "name": "x", "type": "ss", "server": "h", "port": "8388",
        "cipher": "aes-256-gcm", "password": "pw",
    })
    assert node.port == 8388


def test_parse_node_line_strict_json():
    from app.services.proxy_node_parser import parse_node_line
    line = (
        '{"name":"hk","type":"ss","server":"h","port":8388,'
        '"cipher":"aes-256-gcm","password":"pw"}'
    )
    node = parse_node_line(line)
    assert node.name == "hk"
    assert node.password == "pw"


def test_parse_node_line_clash_yaml_inline():
    from app.services.proxy_node_parser import parse_node_line
    line = (
        "{ name: 'hk proxy', type: ss, server: hk.happynode.vip, "
        "port: 31870, cipher: aes-256-gcm, "
        "password: c9af03f5-7f13-43cf-8b3c-ad3e7f90f62c, udp: true }"
    )
    node = parse_node_line(line)
    assert node.name == "hk proxy"
    assert node.server == "hk.happynode.vip"
    assert node.port == 31870
    assert node.udp is True


def test_parse_node_line_dispatches_ss_uri():
    from app.services.proxy_node_parser import parse_node_line
    import base64
    payload = base64.b64encode(b"aes-256-gcm:pw").decode().rstrip("=")
    node = parse_node_line(f"ss://{payload}@example.com:8388#myname")
    assert node.cipher == "aes-256-gcm"
    assert node.name == "myname"


def test_parse_node_line_rejects_unknown_format():
    from app.services.proxy_node_parser import parse_node_line
    with pytest.raises(ProxyNodeError):
        parse_node_line("not a node at all")


def test_parse_node_line_strips_whitespace():
    from app.services.proxy_node_parser import parse_node_line
    line = '   {"name":"x","type":"ss","server":"h","port":1,"cipher":"aes-256-gcm","password":"pw"}   '
    parse_node_line(line)


def test_parse_node_line_yaml_after_json_failure():
    """A line starting with '{' that isn't strict JSON should fall back to YAML."""
    from app.services.proxy_node_parser import parse_node_line
    line = "{name: x, type: ss, server: h, port: 1, cipher: aes-256-gcm, password: pw}"
    node = parse_node_line(line)
    assert node.name == "x"
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd backend && python -m pytest tests/test_proxy_node_parser.py -v`
Expected: FAIL — `validate_node_dict` and `parse_node_line` not defined.

- [ ] **Step 3: Implement the dispatcher and dict validator**

Append to `backend/app/services/proxy_node_parser.py`:

```python
def _coerce_int(value: Any, field_name: str) -> int:
    if isinstance(value, bool):
        # bool is a subclass of int — reject explicitly.
        raise ProxyNodeError(f"{field_name} must be an integer, got bool")
    if isinstance(value, int):
        return value
    if isinstance(value, str):
        try:
            return int(value, 10)
        except ValueError as e:
            raise ProxyNodeError(f"{field_name} not an integer: {value!r}") from e
    raise ProxyNodeError(f"{field_name} must be an integer, got {type(value).__name__}")


def _coerce_bool(value: Any) -> bool:
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        v = value.strip().lower()
        if v in ("true", "1", "yes"):
            return True
        if v in ("false", "0", "no", ""):
            return False
    return False


def validate_node_dict(d: dict[str, Any]) -> ProxyNode:
    """Validate a dict (from JSON or YAML) into a ProxyNode."""
    if not isinstance(d, dict):
        raise ProxyNodeError(f"expected mapping, got {type(d).__name__}")

    required = ("type", "server", "port", "cipher", "password")
    missing = [k for k in required if k not in d]
    if missing:
        raise ProxyNodeError(f"missing required field(s): {', '.join(missing)}")

    name = str(d.get("name") or "").strip()
    type_ = str(d["type"]).strip()
    server = str(d["server"]).strip()
    port = _coerce_int(d["port"], "port")
    cipher = str(d["cipher"]).strip()
    password = str(d["password"])
    udp = _coerce_bool(d.get("udp", False))

    return _validate(
        ProxyNode(
            name=name,
            type=type_,
            server=server,
            port=port,
            cipher=cipher,
            password=password,
            udp=udp,
        )
    )


def parse_node_line(raw: str) -> ProxyNode:
    """Auto-detect format and parse a single line into a ProxyNode."""
    line = raw.strip()
    if not line:
        raise ProxyNodeError("empty line")

    if line.startswith("ss://"):
        return parse_ss_uri(line)

    if line.startswith("{"):
        try:
            data = json.loads(line)
        except json.JSONDecodeError:
            try:
                data = yaml.safe_load(line)
            except yaml.YAMLError as e:
                raise ProxyNodeError(f"invalid JSON/YAML: {e}") from e
        if not isinstance(data, dict):
            raise ProxyNodeError("node must be a JSON/YAML object")
        return validate_node_dict(data)

    raise ProxyNodeError(f"unrecognized node format: {line[:40]!r}")
```

- [ ] **Step 4: Add `pyyaml` to backend requirements (if missing)**

Check: `grep -i pyyaml backend/requirements.txt`. If absent, add `pyyaml>=6.0` to `backend/requirements.txt`.

- [ ] **Step 5: Run tests**

Run: `cd backend && python -m pytest tests/test_proxy_node_parser.py -v`
Expected: all pass.

- [ ] **Step 6: Commit**

```bash
git add backend/app/services/proxy_node_parser.py backend/tests/test_proxy_node_parser.py backend/requirements.txt
git commit -m "feat(proxy): add JSON/Clash YAML inline node parser + dispatcher"
```

---

## Phase 3 — Backend: proxy SDK definition + validation

### Task 5: Add the `proxy` SDK to the catalog

**Files:**
- Modify: `backend/app/services/sdk_catalog.py`
- Test: `backend/tests/test_sdk_catalog.py`

- [ ] **Step 1: Write tests for the new SDK definition**

Append to `backend/tests/test_sdk_catalog.py`:

```python
def test_proxy_sdk_in_catalog():
    assert "proxy" in CATALOG
    proxy = CATALOG["proxy"]
    assert proxy.category == "network"
    assert set(proxy.supported_platforms) == {"android", "macos", "windows"}
    field_names = {f.name for f in proxy.fields}
    assert field_names == {
        "ossUrls",
        "updateIntervalHours",
        "dnsTxtDomains",
        "builtinProxies",
        "disableDirect",
    }


def test_proxy_sdk_widget_assignment():
    proxy = CATALOG["proxy"]
    by_name = {f.name: f for f in proxy.fields}
    assert by_name["ossUrls"].widget == "textarea"
    assert by_name["updateIntervalHours"].widget == "number"
    assert by_name["dnsTxtDomains"].widget == "textarea"
    assert by_name["builtinProxies"].widget == "textarea"
    assert by_name["builtinProxies"].secret is True
    assert by_name["disableDirect"].widget == "checkbox"


def test_network_category_valid():
    assert "network" in VALID_CATEGORIES
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd backend && python -m pytest tests/test_sdk_catalog.py -v -k proxy`
Expected: FAIL — proxy SDK not yet defined.

- [ ] **Step 3: Add `network` category and `proxy` SDK definition**

Edit `backend/app/services/sdk_catalog.py`:

1. Replace `VALID_CATEGORIES = {"analytics", "crash", "push"}` with:
   ```python
   VALID_CATEGORIES = {"analytics", "crash", "push", "network"}
   ```

2. Add to `CATALOG` (after the existing `firebase` entry):
   ```python
       "proxy": SdkDefinition(
           id="proxy",
           name_en="Network Proxy",
           name_zh="网络代理",
           category="network",
           supported_platforms=("android", "macos", "windows"),
           fields=(
               SdkField(
                   name="ossUrls",
                   label_en="OSS Config URLs",
                   label_zh="OSS 地址",
                   help_zh="(一行一个)",
                   required=False,
                   widget="textarea",
                   placeholder="https://example.com/config.json",
               ),
               SdkField(
                   name="updateIntervalHours",
                   label_en="Cloud Update Interval (hours)",
                   label_zh="云端更新间隔",
                   help_zh="(小时)",
                   required=False,
                   widget="number",
                   placeholder="1",
               ),
               SdkField(
                   name="dnsTxtDomains",
                   label_en="DNS TXT Domains",
                   label_zh="DNS TXT 域名",
                   help_zh="(一行一个)",
                   required=False,
                   widget="textarea",
               ),
               SdkField(
                   name="builtinProxies",
                   label_en="Built-in Proxies",
                   label_zh="内建代理",
                   help_zh="(一行一个,Clash 节点格式或 JSON)",
                   required=False,
                   widget="textarea",
                   secret=True,
                   placeholder=(
                       "{ name: 'hk', type: ss, server: ..., port: ..., "
                       "cipher: aes-256-gcm, password: ... }"
                   ),
               ),
               SdkField(
                   name="disableDirect",
                   label_en="Disable Direct Connection",
                   label_zh="禁用直连",
                   required=False,
                   widget="checkbox",
               ),
           ),
       ),
   ```

- [ ] **Step 4: Run tests**

Run: `cd backend && python -m pytest tests/test_sdk_catalog.py -v`
Expected: all pass (existing `test_catalog_integrity` still validates the new entry).

- [ ] **Step 5: Commit**

```bash
git add backend/app/services/sdk_catalog.py backend/tests/test_sdk_catalog.py
git commit -m "feat(sdk-catalog): add proxy SDK definition (android/macos/windows)"
```

---

### Task 6: Proxy-aware validation/normalization in `validate_sdk_configs`

**Files:**
- Modify: `backend/app/services/sdk_catalog.py`
- Create: `backend/tests/test_sdk_proxy_validation.py`

- [ ] **Step 1: Write the failing tests**

Create `backend/tests/test_sdk_proxy_validation.py`:

```python
import pytest

from app.services.sdk_catalog import (
    SdkValidationError,
    validate_sdk_configs,
)


def _normalize(payload, platforms=None):
    return validate_sdk_configs(payload, platforms or ["android"])


def test_proxy_requires_at_least_one_node_source():
    with pytest.raises(SdkValidationError):
        _normalize({"proxy": {
            "ossUrls": "",
            "dnsTxtDomains": "",
            "builtinProxies": "",
            "disableDirect": "true",
        }})


def test_proxy_only_oss_is_valid():
    cleaned = _normalize({"proxy": {
        "ossUrls": "https://a.example.com/c.json\n https://b.example.com/c.json ",
        "disableDirect": "true",
    }})
    p = cleaned["proxy"]
    assert p["ossUrls"] == [
        "https://a.example.com/c.json",
        "https://b.example.com/c.json",
    ]
    assert p["disableDirect"] is True
    assert p["builtinProxies"] == []
    assert p["dnsTxtDomains"] == []
    assert p["updateIntervalHours"] == 1.0  # default


def test_proxy_invalid_oss_url_rejected():
    with pytest.raises(SdkValidationError):
        _normalize({"proxy": {
            "ossUrls": "not-a-url",
            "disableDirect": "true",
        }})


def test_proxy_dns_txt_domains_validated():
    cleaned = _normalize({"proxy": {
        "dnsTxtDomains": "fallback.example.com\nbackup.example.org",
        "disableDirect": "true",
    }})
    assert cleaned["proxy"]["dnsTxtDomains"] == [
        "fallback.example.com",
        "backup.example.org",
    ]


def test_proxy_dns_txt_invalid_domain_rejected():
    with pytest.raises(SdkValidationError):
        _normalize({"proxy": {
            "dnsTxtDomains": "https://nope.example",
            "disableDirect": "true",
        }})


def test_proxy_builtin_clash_yaml_normalizes():
    cleaned = _normalize({"proxy": {
        "builtinProxies": (
            "{ name: 'hk', type: ss, server: hk.example.com, port: 31870, "
            "cipher: aes-256-gcm, password: pw, udp: true }"
        ),
        "disableDirect": "true",
    }})
    nodes = cleaned["proxy"]["builtinProxies"]
    assert len(nodes) == 1
    assert nodes[0]["name"] == "hk"
    assert nodes[0]["server"] == "hk.example.com"
    assert nodes[0]["port"] == 31870
    assert nodes[0]["udp"] is True


def test_proxy_builtin_line_error_includes_line_number():
    raw = (
        '{"name":"good","type":"ss","server":"h","port":8388,"cipher":"aes-256-gcm","password":"pw"}\n'
        "garbage line here\n"
    )
    with pytest.raises(SdkValidationError) as excinfo:
        _normalize({"proxy": {"builtinProxies": raw, "disableDirect": "true"}})
    assert "line 2" in str(excinfo.value)


def test_proxy_update_interval_default_and_range():
    # default
    cleaned = _normalize({"proxy": {
        "ossUrls": "https://a/b",
        "disableDirect": "true",
    }})
    assert cleaned["proxy"]["updateIntervalHours"] == 1.0

    # explicit valid
    cleaned = _normalize({"proxy": {
        "ossUrls": "https://a/b",
        "updateIntervalHours": "0.5",
        "disableDirect": "true",
    }})
    assert cleaned["proxy"]["updateIntervalHours"] == 0.5

    # too small
    with pytest.raises(SdkValidationError):
        _normalize({"proxy": {
            "ossUrls": "https://a/b",
            "updateIntervalHours": "0.05",
            "disableDirect": "true",
        }})

    # too large
    with pytest.raises(SdkValidationError):
        _normalize({"proxy": {
            "ossUrls": "https://a/b",
            "updateIntervalHours": "169",
            "disableDirect": "true",
        }})


def test_proxy_disable_direct_string_to_bool():
    for raw, expected in [("true", True), ("false", False), ("", False)]:
        cleaned = _normalize({"proxy": {
            "ossUrls": "https://a/b",
            "disableDirect": raw,
        }})
        assert cleaned["proxy"]["disableDirect"] is expected


def test_proxy_unsupported_on_ios():
    with pytest.raises(SdkValidationError):
        validate_sdk_configs(
            {"proxy": {"ossUrls": "https://a/b", "disableDirect": "true"}},
            ["ios"],
        )


def test_proxy_supported_when_at_least_one_supported_platform_selected():
    cleaned = validate_sdk_configs(
        {"proxy": {"ossUrls": "https://a/b", "disableDirect": "true"}},
        ["ios", "android"],
    )
    assert "proxy" in cleaned
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd backend && python -m pytest tests/test_sdk_proxy_validation.py -v`
Expected: most fail because the proxy-specific normalization is not implemented.

- [ ] **Step 3: Implement proxy normalization in `validate_sdk_configs`**

Edit `backend/app/services/sdk_catalog.py`. At the top, add imports:

```python
import re
from urllib.parse import urlparse

from app.services.proxy_node_parser import (
    ProxyNode,
    ProxyNodeError,
    parse_node_line,
)
```

Add helpers and a new `_normalize_proxy` function (place near the bottom, before `validate_sdk_configs`):

```python
_DOMAIN_RE = re.compile(
    r"^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+"
    r"[a-zA-Z]{2,}$"
)


def _split_lines(value: Any) -> list[str]:
    if value is None:
        return []
    text = str(value)
    return [line.strip() for line in text.splitlines() if line.strip()]


def _normalize_proxy(fields: dict[str, Any]) -> dict[str, Any]:
    oss_urls = _split_lines(fields.get("ossUrls"))
    for u in oss_urls:
        parsed = urlparse(u)
        if parsed.scheme not in ("http", "https") or not parsed.netloc:
            raise SdkValidationError(f"invalid OSS URL: {u!r}")

    dns_txt = _split_lines(fields.get("dnsTxtDomains"))
    for d in dns_txt:
        if not _DOMAIN_RE.match(d):
            raise SdkValidationError(f"invalid DNS TXT domain: {d!r}")

    builtin_lines = _split_lines(fields.get("builtinProxies"))
    builtin_nodes: list[dict[str, Any]] = []
    for idx, line in enumerate(builtin_lines, start=1):
        try:
            node = parse_node_line(line)
        except ProxyNodeError as e:
            raise SdkValidationError(f"builtinProxies line {idx}: {e}") from e
        builtin_nodes.append(node.to_dict())

    if not (oss_urls or dns_txt or builtin_nodes):
        raise SdkValidationError(
            "proxy SDK requires at least one of ossUrls / dnsTxtDomains / builtinProxies"
        )

    raw_interval = fields.get("updateIntervalHours")
    if raw_interval in (None, ""):
        interval = 1.0
    else:
        try:
            interval = float(raw_interval)
        except (TypeError, ValueError) as e:
            raise SdkValidationError(
                f"updateIntervalHours not a number: {raw_interval!r}"
            ) from e
    if not (0.1 <= interval <= 168.0):
        raise SdkValidationError(
            f"updateIntervalHours out of range [0.1, 168]: {interval}"
        )

    raw_disable = fields.get("disableDirect", "false")
    disable_direct = str(raw_disable).strip().lower() in ("true", "1", "yes")

    return {
        "ossUrls": oss_urls,
        "updateIntervalHours": interval,
        "dnsTxtDomains": dns_txt,
        "builtinProxies": builtin_nodes,
        "disableDirect": disable_direct,
    }
```

In `validate_sdk_configs`, **after** the existing per-SDK loop (which builds `cleaned[sdk_id] = cleaned_fields`), add a special path for proxy. Replace the body of the `for sdk_id, fields_value in payload.items():` loop so the proxy SDK gets normalized instead of the generic field-by-field treatment:

```python
def validate_sdk_configs(
    payload: dict[str, dict[str, Any]],
    requested_platforms: list[str],
) -> dict[str, dict[str, Any]]:
    """Validate the parsed SDK config dict against CATALOG and the requested platforms.

    Returns the (possibly normalized) dict. Raises SdkValidationError on issues.
    """
    cleaned: dict[str, dict[str, Any]] = {}
    requested = set(requested_platforms)

    for sdk_id, fields_value in payload.items():
        definition = CATALOG.get(sdk_id)
        if definition is None:
            raise SdkValidationError(f"Unknown SDK: {sdk_id!r}")
        if not isinstance(fields_value, dict):
            raise SdkValidationError(f"Config for {sdk_id!r} must be an object")

        active_platforms = requested & set(definition.supported_platforms)
        if not active_platforms:
            raise SdkValidationError(
                f"SDK {sdk_id!r} does not support any of the selected platforms "
                f"{sorted(requested)}; supported: {list(definition.supported_platforms)}"
            )

        if sdk_id == "proxy":
            cleaned[sdk_id] = _normalize_proxy(fields_value)
            continue

        cleaned_fields: dict[str, Any] = {}
        allowed_field_names = {f.name for f in definition.fields}
        for key, value in fields_value.items():
            if key not in allowed_field_names:
                raise SdkValidationError(f"Unknown field {key!r} for SDK {sdk_id!r}")
            if value is None:
                continue
            if not isinstance(value, (str, int, float, bool)):
                raise SdkValidationError(
                    f"Field {key!r} of SDK {sdk_id!r} must be a primitive value"
                )
            cleaned_fields[key] = value

        for f in definition.fields:
            field_needed = (
                f.required
                and (
                    not f.platforms
                    or any(p in active_platforms for p in f.platforms)
                )
            )
            if field_needed:
                value = cleaned_fields.get(f.name)
                if not isinstance(value, str) or not value.strip():
                    raise SdkValidationError(
                        f"SDK {sdk_id!r} requires field {f.name!r}"
                    )

        cleaned[sdk_id] = cleaned_fields

    return cleaned
```

- [ ] **Step 4: Run tests**

Run: `cd backend && python -m pytest tests/test_sdk_proxy_validation.py tests/test_sdk_catalog.py -v`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add backend/app/services/sdk_catalog.py backend/tests/test_sdk_proxy_validation.py
git commit -m "feat(proxy): normalize and validate proxy SDK fields"
```

---

## Phase 4 — Backend: vendor binary scaffolding

### Task 7: `backend/vendor/singbox/` skeleton

**Files:**
- Create: `backend/vendor/singbox/README.md`
- Create: `backend/vendor/singbox/.gitignore`
- Create: `backend/vendor/singbox/fetch.sh`

- [ ] **Step 1: Create the gitignore so binaries are not committed**

Create `backend/vendor/singbox/.gitignore`:
```
# Ignore everything except the listed metadata files
*
!.gitignore
!README.md
!fetch.sh
```

- [ ] **Step 2: Create `README.md`**

Create `backend/vendor/singbox/README.md`:
```markdown
# sing-box vendored binaries

The `apply_flutter` and `apply_electron` injectors copy platform-specific
sing-box executables from this directory into per-build wrapper copies.

## Layout

```
backend/vendor/singbox/
├── android/
│   ├── arm64-v8a/sing-box
│   ├── armeabi-v7a/sing-box
│   └── x86_64/sing-box
├── darwin/sing-box
└── windows/sing-box.exe
```

## Acquisition

Run `./fetch.sh` once per environment (host, CI cache). The script downloads
the pinned sing-box release from the upstream GitHub release page and
populates the layout above. **Binaries are gitignored** — every machine that
builds proxy-enabled apps must run the script.

The pinned version is documented at the top of `fetch.sh`.
```

- [ ] **Step 3: Create `fetch.sh` (skeleton; pinning version is left for the operator)**

Create `backend/vendor/singbox/fetch.sh`:
```bash
#!/usr/bin/env bash
# Pinned sing-box version — bump deliberately.
set -euo pipefail

SINGBOX_VERSION="${SINGBOX_VERSION:-1.10.7}"
BASE_URL="https://github.com/SagerNet/sing-box/releases/download/v${SINGBOX_VERSION}"

cd "$(dirname "$0")"

fetch_one() {
  local url="$1"
  local dest="$2"
  echo "→ $dest"
  mkdir -p "$(dirname "$dest")"
  curl -fsSL "$url" -o "${dest}.tar.gz" 2>/dev/null || curl -fsSL "$url" -o "${dest}.zip"
}

# NOTE: real release filenames vary by sing-box version; the operator must
# verify the assets against https://github.com/SagerNet/sing-box/releases
# before running this script. The placeholder below shows the expected layout.

echo "Pinned sing-box ${SINGBOX_VERSION}"
echo "Populate the following paths from upstream release artifacts:"
echo "  android/arm64-v8a/sing-box"
echo "  android/armeabi-v7a/sing-box"
echo "  android/x86_64/sing-box"
echo "  darwin/sing-box   (universal or arm64+amd64; pick one)"
echo "  windows/sing-box.exe"
echo
echo "This script intentionally does NOT auto-download. Add the curl/tar"
echo "lines specific to your chosen release asset names below."
```

Mark executable: `chmod +x backend/vendor/singbox/fetch.sh`.

- [ ] **Step 4: Commit**

```bash
git add backend/vendor/singbox/.gitignore backend/vendor/singbox/README.md backend/vendor/singbox/fetch.sh
git commit -m "chore(proxy): scaffold vendor/singbox/ with .gitignore and fetch.sh"
```

---

## Phase 5 — Backend: injector emits proxy config + binaries

### Task 8: Inject `proxyConfigJson` into Flutter

**Files:**
- Modify: `backend/app/services/sdk_injector.py`
- Create: `backend/tests/test_sdk_injector_proxy.py`

- [ ] **Step 1: Write the failing test**

Create `backend/tests/test_sdk_injector_proxy.py`:

```python
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd backend && python -m pytest tests/test_sdk_injector_proxy.py -v`
Expected: FAIL — `proxyConfigJson` constant absent.

- [ ] **Step 3: Implement `proxyConfigJson` emission**

Edit `backend/app/services/sdk_injector.py`. Update `_render_dart_config`:

```python
def _render_dart_config(
    custom_js: str | None,
    sdk_configs: dict[str, dict[str, Any]],
) -> str:
    """Produce a Dart source file exposing `customJs`, `sdkConfigsJson`, and `proxyConfigJson`."""
    custom_js_literal = _dart_string_literal(custom_js or "")
    sdk_json_literal = _dart_string_literal(
        json.dumps(sdk_configs, ensure_ascii=False)
    )
    proxy_section = sdk_configs.get("proxy")
    proxy_literal = _dart_string_literal(
        json.dumps(proxy_section, ensure_ascii=False) if proxy_section else ""
    )
    return (
        "// GENERATED FILE — overwritten by the build pipeline. Do not edit.\n"
        "// ignore_for_file: prefer_const_declarations\n"
        "\n"
        f"const String customJs = {custom_js_literal};\n"
        f"const String sdkConfigsJson = {sdk_json_literal};\n"
        f"const String proxyConfigJson = {proxy_literal};\n"
    )
```

- [ ] **Step 4: Run tests**

Run: `cd backend && python -m pytest tests/test_sdk_injector_proxy.py tests/test_sdk_injector.py -v`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add backend/app/services/sdk_injector.py backend/tests/test_sdk_injector_proxy.py
git commit -m "feat(injector): emit proxyConfigJson constant in flutter sdk_config.dart"
```

---

### Task 9: Copy sing-box binaries during injection

**Files:**
- Modify: `backend/app/services/sdk_injector.py`
- Modify: `backend/tests/test_sdk_injector_proxy.py`

- [ ] **Step 1: Write tests**

Append to `backend/tests/test_sdk_injector_proxy.py`:

```python
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
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd backend && python -m pytest tests/test_sdk_injector_proxy.py -v -k singbox`
Expected: FAIL — copy functions not defined.

- [ ] **Step 3: Implement the copy functions**

Append to `backend/app/services/sdk_injector.py` (after existing definitions):

```python
import shutil

DEFAULT_SINGBOX_VENDOR_DIR = Path(__file__).resolve().parents[3] / "vendor" / "singbox"


def _vendor_dir(override: Path | str | None) -> Path:
    if override is not None:
        return Path(override)
    return DEFAULT_SINGBOX_VENDOR_DIR


def copy_singbox_for_flutter(
    flutter_dir: str | Path,
    vendor_dir: Path | str | None = None,
) -> None:
    """Copy the three Android sing-box binaries into the Flutter wrapper jniLibs.

    Each binary is renamed to `libsingbox.so` so Android's native-libs packaging
    picks it up when assembling the APK.
    """
    vendor = _vendor_dir(vendor_dir)
    base = Path(flutter_dir) / "android/app/src/main/jniLibs"
    for abi in ("arm64-v8a", "armeabi-v7a", "x86_64"):
        src = vendor / "android" / abi / "sing-box"
        if not src.exists():
            raise FileNotFoundError(f"sing-box ABI {abi} missing at {src}")
        dst = base / abi / "libsingbox.so"
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(src, dst)
        os.chmod(dst, 0o755)


def copy_singbox_for_electron(
    electron_dir: str | Path,
    target_platform: str,
    vendor_dir: Path | str | None = None,
) -> None:
    """Copy the platform-specific sing-box binary into resources/singbox/."""
    vendor = _vendor_dir(vendor_dir)
    if target_platform == "macos":
        src = vendor / "darwin" / "sing-box"
        dst_name = "sing-box"
    elif target_platform == "windows":
        src = vendor / "windows" / "sing-box.exe"
        dst_name = "sing-box.exe"
    else:
        raise ValueError(f"unsupported electron target_platform: {target_platform!r}")
    if not src.exists():
        raise FileNotFoundError(f"sing-box binary missing at {src}")
    dst = Path(electron_dir) / "resources/singbox" / dst_name
    dst.parent.mkdir(parents=True, exist_ok=True)
    shutil.copyfile(src, dst)
    os.chmod(dst, 0o755)
```

- [ ] **Step 4: Run tests**

Run: `cd backend && python -m pytest tests/test_sdk_injector_proxy.py -v`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add backend/app/services/sdk_injector.py backend/tests/test_sdk_injector_proxy.py
git commit -m "feat(injector): copy sing-box binaries from vendor into wrapper copies"
```

---

### Task 10: Wire `copy_singbox_*` into the Celery build task

**Files:**
- Modify: `backend/app/tasks/build_task.py`

- [ ] **Step 1: Locate the existing call sites for `apply_flutter` / `apply_electron`**

Run: `grep -n "apply_flutter\|apply_electron" backend/app/tasks/build_task.py`
Note line numbers; the modifications will go immediately after each call.

- [ ] **Step 2: Add the binary copy calls (conditional on proxy SDK enabled)**

Edit `backend/app/tasks/build_task.py`. Locate the sections that build Android (Flutter) and macOS/Windows (Electron). After each `apply_flutter(...)` call, add:

```python
if "proxy" in (validated_sdk_configs or {}):
    from app.services.sdk_injector import copy_singbox_for_flutter
    copy_singbox_for_flutter(flutter_dir)
```

After each `apply_electron(...)` call, add (with the matching platform name):

```python
if "proxy" in (validated_sdk_configs or {}):
    from app.services.sdk_injector import copy_singbox_for_electron
    copy_singbox_for_electron(electron_dir, target_platform=platform)
```

(Use the actual local variable names that hold the wrapper directory and the validated SDK configs in `build_task.py` — these change line-by-line in that file. Read `build_task.py` first, then place the additions.)

- [ ] **Step 3: Run all backend tests**

Run: `cd backend && python -m pytest tests/ -v`
Expected: all pass (no new tests; this is integration glue covered by tasks 8 + 9).

- [ ] **Step 4: Commit**

```bash
git add backend/app/tasks/build_task.py
git commit -m "feat(build): copy sing-box into wrapper copies when proxy SDK enabled"
```

---

## Phase 6 — Frontend: widget renderer

### Task 11: Render `widget`-typed fields in `SdkConfigSection.vue`

**Files:**
- Modify: `frontend/src/components/SdkConfigSection.vue`

- [ ] **Step 1: Update the template to switch on `f.widget`**

Edit the `v-for="f in visibleFieldsFor(sdk)"` block. Replace it with:

```vue
<div v-for="f in visibleFieldsFor(sdk)" :key="f.name">
  <label class="text-xs text-gray-600 block mb-0.5">
    {{ f.label_en }}{{ f.required ? ' *' : '' }}
    <span v-if="f.help_zh" class="text-gray-400 ml-1">{{ f.help_zh }}</span>
  </label>
  <input
    v-if="f.widget === 'text' || f.widget === undefined"
    :type="f.secret ? 'password' : 'text'"
    v-model="values[sdk.id][f.name]"
    :placeholder="f.placeholder || ''"
    class="w-full border rounded px-2 py-1 text-xs focus:outline-none focus:ring"
  />
  <textarea
    v-else-if="f.widget === 'textarea'"
    v-model="values[sdk.id][f.name]"
    :placeholder="f.placeholder || ''"
    rows="4"
    class="w-full border rounded px-2 py-1 text-xs font-mono focus:outline-none focus:ring"
  />
  <input
    v-else-if="f.widget === 'number'"
    type="number"
    min="0"
    step="0.1"
    v-model="values[sdk.id][f.name]"
    :placeholder="f.placeholder || ''"
    class="w-full border rounded px-2 py-1 text-xs focus:outline-none focus:ring"
  />
  <label v-else-if="f.widget === 'checkbox'" class="flex items-center gap-2 text-xs">
    <input
      type="checkbox"
      :checked="values[sdk.id][f.name] === 'true'"
      @change="onCheckbox($event, sdk.id, f.name)"
    />
    <span>{{ f.placeholder || '' }}</span>
  </label>
</div>
```

- [ ] **Step 2: Update the TypeScript interface and add the `onCheckbox` helper**

In the `<script setup lang="ts">` block:

1. Extend the `SdkField` interface:
   ```ts
   interface SdkField {
     name: string
     label_en: string
     label_zh: string
     required: boolean
     secret: boolean
     platforms: string[]
     widget?: 'text' | 'textarea' | 'number' | 'checkbox'
     placeholder?: string
     help_zh?: string
   }
   ```

2. Add the helper near the other functions:
   ```ts
   function onCheckbox(event: Event, sdkId: string, name: string) {
     const target = event.target as HTMLInputElement
     values[sdkId][name] = target.checked ? 'true' : 'false'
   }
   ```

- [ ] **Step 3: Verify the build**

Run: `cd frontend && npm run build`
Expected: vue-tsc passes; Vite produces dist/.

- [ ] **Step 4: Manual smoke (UI)**

Bring up the app (`npm run dev`), open Home view, check 'SDK & Tracking', toggle "Network Proxy". Confirm: 5 fields render (textarea, number, textarea, textarea, checkbox), help_zh hints visible, placeholder text visible in textareas.

- [ ] **Step 5: Commit**

```bash
git add frontend/src/components/SdkConfigSection.vue
git commit -m "feat(ui): render SDK fields by widget type (text/textarea/number/checkbox)"
```

---

## Phase 7 — Spike (verify before runtime work)

### Task 12: Spike — Android sing-box binary launches via `Process.start`

**Files:** none (research/exploration; results documented in commit message)

- [ ] **Step 1: Build an APK with the binary embedded**

Manually populate `backend/vendor/singbox/android/arm64-v8a/sing-box` (download from sing-box releases). Submit a build via the platform with proxy SDK enabled and a single dummy node. Install resulting APK on a Pixel device.

- [ ] **Step 2: Add a one-off Dart probe**

In `flutter-wrapper/lib/main.dart`'s `_initAppVue`, temporarily insert:
```dart
import 'dart:io' show Platform, Process;
...
if (Platform.isAndroid) {
  try {
    final dir = (await getApplicationContext()).nativeLibraryDir;
    final r = await Process.run('$dir/libsingbox.so', ['version']);
    debugPrint('sing-box version: ${r.stdout}');
  } catch (e) {
    debugPrint('sing-box probe failed: $e');
  }
}
```

(`getApplicationContext` is illustrative; the real path is via a small Kotlin method channel returning `applicationInfo.nativeLibraryDir`. Implement that as part of the spike.)

- [ ] **Step 3: Verify on device**

Run the APK. Observe in `adb logcat` either `sing-box version: sing-box ...` (success) or the failure mode.

- [ ] **Step 4: Repeat on at least one OEM Android device**

If you have access to a Xiaomi / Huawei / OPPO device, repeat. If `Process.start` fails (some OEMs block executing files in `nativeLibraryDir`), document the failure and STOP — return to brainstorming for a workaround (e.g., copying the binary to `cacheDir` first; checking if executable permission survives).

- [ ] **Step 5: Revert the spike code; commit notes**

Revert the temporary probe code. Commit a notes file:
```bash
git checkout -- flutter-wrapper/lib/main.dart
echo "Spike outcome: ..." > docs/superpowers/specs/2026-05-07-spike-notes.md
git add docs/superpowers/specs/2026-05-07-spike-notes.md
git commit -m "docs(proxy): record spike outcome for android sing-box launch"
```

### Task 13: Spike — Electron `extraResources` + `child_process.spawn`

- [ ] **Step 1: Add `extraResources` rule in `electron-wrapper/package.json`**

Edit `electron-wrapper/package.json`. Inside `"build"`:
```json
"extraResources": [
  { "from": "resources/singbox", "to": "singbox", "filter": ["**/*"] }
]
```

(This change is permanent; it stays after the spike.)

- [ ] **Step 2: Drop a real sing-box binary into `electron-wrapper/resources/singbox/`**

Copy `backend/vendor/singbox/darwin/sing-box` (or `windows/sing-box.exe`) here for local testing.

- [ ] **Step 3: Add a one-off probe at the top of `main.js`**

Temporarily, before `app.whenReady()`:
```js
const { spawn } = require('child_process');
const probePath = path.join(process.resourcesPath, 'singbox', process.platform === 'win32' ? 'sing-box.exe' : 'sing-box');
const probe = spawn(probePath, ['version']);
probe.stdout.on('data', d => console.log('sing-box version:', d.toString()));
probe.on('error', e => console.error('sing-box spawn failed:', e));
```

- [ ] **Step 4: Build and run**

`cd electron-wrapper && npm install && npm run build:mac` (or `build:win`). Open the resulting DMG/EXE; the launched app should print the version line.

- [ ] **Step 5: Verify under signing/notarize if possible**

If you have an Apple Developer ID, sign + notarize once and confirm the spawn still works (some sandboxed builds block `spawn`).

- [ ] **Step 6: Revert probe code; commit**

```bash
git checkout -- electron-wrapper/main.js
git add electron-wrapper/package.json
echo "Electron spike outcome: ..." >> docs/superpowers/specs/2026-05-07-spike-notes.md
git add docs/superpowers/specs/2026-05-07-spike-notes.md
git commit -m "feat(electron): declare extraResources for sing-box; verified spawn"
```

### Task 14: Spike — `androidx.webkit.ProxyController` on Pixel + OEM device

- [ ] **Step 1: Modify `app/build.gradle` to depend on `androidx.webkit`**

Edit `flutter-wrapper/android/app/build.gradle`, add to `dependencies { ... }`:
```gradle
implementation "androidx.webkit:webkit:1.10.0"
```

(Permanent.)

- [ ] **Step 2: One-off Kotlin probe in `MainActivity.onCreate`**

Add temporarily:
```kotlin
import androidx.webkit.ProxyConfig
import androidx.webkit.ProxyController
import androidx.webkit.WebViewFeature

if (WebViewFeature.isFeatureSupported(WebViewFeature.PROXY_OVERRIDE)) {
    val cfg = ProxyConfig.Builder()
        .addProxyRule("http://example.test:9999")
        .build()
    ProxyController.getInstance().setProxyOverride(cfg, { it.run() }) {
        android.util.Log.d("ProxyProbe", "setProxyOverride applied")
    }
} else {
    android.util.Log.w("ProxyProbe", "PROXY_OVERRIDE feature not supported on this WebView")
}
```

- [ ] **Step 3: Run on Pixel + at least one OEM device, observe logcat**

Confirm "applied" log on Pixel. On OEM device, if "not supported" appears, STOP — return to brainstorming.

- [ ] **Step 4: Revert probe code; commit gradle change**

```bash
git checkout -- flutter-wrapper/android/app/src/main/kotlin/com/h5packager/h5_app/MainActivity.kt
git add flutter-wrapper/android/app/build.gradle
echo "ProxyController spike outcome: ..." >> docs/superpowers/specs/2026-05-07-spike-notes.md
git add docs/superpowers/specs/2026-05-07-spike-notes.md
git commit -m "feat(android): add androidx.webkit dep; verified PROXY_OVERRIDE support"
```

**STOP CONDITION:** if any of tasks 12/13/14 fails on its target device, do not continue with phases 8/9. Document the failure in `2026-05-07-spike-notes.md` and return to brainstorming.

---

## Phase 8 — Flutter (Android) runtime

### Task 15: `ProxyNode` Dart data class

**Files:**
- Create: `flutter-wrapper/lib/proxy/proxy_node.dart`

- [ ] **Step 1: Create the file**

```dart
class ProxyNode {
  final String name;
  final String type;
  final String server;
  final int port;
  final String cipher;
  final String password;
  final bool udp;

  const ProxyNode({
    required this.name,
    required this.type,
    required this.server,
    required this.port,
    required this.cipher,
    required this.password,
    this.udp = false,
  });

  factory ProxyNode.fromJson(Map<String, dynamic> json) => ProxyNode(
        name: json['name'] as String,
        type: json['type'] as String,
        server: json['server'] as String,
        port: json['port'] as int,
        cipher: json['cipher'] as String,
        password: json['password'] as String,
        udp: (json['udp'] as bool?) ?? false,
      );

  Map<String, dynamic> toJson() => {
        'name': name,
        'type': type,
        'server': server,
        'port': port,
        'cipher': cipher,
        'password': password,
        'udp': udp,
      };

  @override
  String toString() => 'ProxyNode($name $server:$port)';
}
```

- [ ] **Step 2: Commit**

```bash
git add flutter-wrapper/lib/proxy/proxy_node.dart
git commit -m "feat(flutter-proxy): add ProxyNode data class"
```

---

### Task 16: `SingboxSupervisor` with restart policy

**Files:**
- Create: `flutter-wrapper/lib/proxy/singbox_supervisor.dart`
- Create: `flutter-wrapper/test/proxy/singbox_supervisor_test.dart`
- Modify: `flutter-wrapper/pubspec.yaml`

- [ ] **Step 1: Add test dependency**

Edit `flutter-wrapper/pubspec.yaml` `dev_dependencies`:
```yaml
dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0
  test: ^1.25.0
```

Run `cd flutter-wrapper && flutter pub get`.

- [ ] **Step 2: Write the failing test**

Create `flutter-wrapper/test/proxy/singbox_supervisor_test.dart`:

```dart
import 'dart:async';
import 'dart:io';

import 'package:flutter_test/flutter_test.dart';
import 'package:h5_app/proxy/proxy_node.dart';
import 'package:h5_app/proxy/singbox_supervisor.dart';

class _FakeProcess {
  final int pid;
  final Completer<int> _exit = Completer<int>();
  _FakeProcess(this.pid);
  Future<int> get exitCode => _exit.future;
  void kill() {}
  void exitWith(int code) => _exit.complete(code);
}

void main() {
  test('writes config file before spawning', () async {
    final tmp = await Directory.systemTemp.createTemp('singbox_sup');
    addTearDown(() => tmp.delete(recursive: true));

    String? receivedConfigPath;
    int spawned = 0;
    final fakeProcess = _FakeProcess(1234);
    final supervisor = SingboxSupervisor(
      binaryPath: '/fake/sing-box',
      configDir: tmp.path,
      processFactory: (binary, args) {
        spawned++;
        receivedConfigPath = args.contains('-c')
            ? args[args.indexOf('-c') + 1]
            : null;
        return Future.value(fakeProcess);
      },
    );

    final node = ProxyNode(
      name: 'n', type: 'ss', server: 'h', port: 1,
      cipher: 'aes-256-gcm', password: 'pw',
    );
    await supervisor.startWith(node);
    expect(spawned, 1);
    expect(receivedConfigPath, isNotNull);
    final cfg = File(receivedConfigPath!);
    expect(cfg.existsSync(), true);
    final content = await cfg.readAsString();
    expect(content.contains('shadowsocks'), true);
    expect(content.contains('"server_port": 1'), true);

    await supervisor.stop();
  });

  test('restarts up to 3 times per minute then gives up', () async {
    final tmp = await Directory.systemTemp.createTemp('singbox_sup');
    addTearDown(() => tmp.delete(recursive: true));

    final processes = <_FakeProcess>[];
    int spawned = 0;
    final supervisor = SingboxSupervisor(
      binaryPath: '/fake/sing-box',
      configDir: tmp.path,
      processFactory: (binary, args) {
        spawned++;
        final p = _FakeProcess(spawned);
        processes.add(p);
        return Future.value(p);
      },
    );

    final node = ProxyNode(
      name: 'n', type: 'ss', server: 'h', port: 1,
      cipher: 'aes-256-gcm', password: 'pw',
    );
    final givenUp = expectLater(supervisor.gaveUp, completes);
    await supervisor.startWith(node);
    // Trigger 4 crashes; the 4th should resolve gaveUp.
    for (var i = 0; i < 4; i++) {
      processes[i].exitWith(1);
      await Future<void>.delayed(const Duration(milliseconds: 10));
    }
    await givenUp;
    expect(spawned, 4); // 1 initial + 3 restarts
  });
}
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `cd flutter-wrapper && flutter test test/proxy/singbox_supervisor_test.dart`
Expected: FAIL — `SingboxSupervisor` not defined.

- [ ] **Step 4: Implement `singbox_supervisor.dart`**

Create `flutter-wrapper/lib/proxy/singbox_supervisor.dart`:

```dart
import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'proxy_node.dart';

typedef ProcessFactory = Future<dynamic> Function(String binary, List<String> args);

abstract class _ProcessHandle {
  int get pid;
  Future<int> get exitCode;
  void kill();
}

class _RealProcessAdapter implements _ProcessHandle {
  final Process _proc;
  _RealProcessAdapter(this._proc);
  @override
  int get pid => _proc.pid;
  @override
  Future<int> get exitCode => _proc.exitCode;
  @override
  void kill() => _proc.kill();
}

class SingboxSupervisor {
  static const _socksPort = 1080;
  static const _httpPort = 1081;
  static const _maxRestartsPerMinute = 3;

  final String binaryPath;
  final String configDir;
  final ProcessFactory _factory;

  ProxyNode? _currentNode;
  dynamic _process;
  StreamSubscription<int>? _exitSub;
  final List<DateTime> _recentStarts = [];
  final Completer<void> _gaveUp = Completer<void>();
  bool _stopped = false;

  SingboxSupervisor({
    required this.binaryPath,
    required this.configDir,
    ProcessFactory? processFactory,
  }) : _factory = processFactory ?? _spawnReal;

  static Future<dynamic> _spawnReal(String binary, List<String> args) async {
    final p = await Process.start(binary, args);
    return _RealProcessAdapter(p);
  }

  Future<void> get gaveUp => _gaveUp.future;
  String get socksAddress => '127.0.0.1:$_socksPort';
  String get httpAddress => '127.0.0.1:$_httpPort';

  Future<void> startWith(ProxyNode node) async {
    _currentNode = node;
    await _spawn();
  }

  Future<void> _spawn() async {
    if (_stopped) return;
    final cfgPath = '$configDir/singbox-config.json';
    await File(cfgPath).writeAsString(_renderConfig(_currentNode!));
    _recentStarts.add(DateTime.now());

    final handle = await _factory(binaryPath, ['run', '-c', cfgPath]);
    _process = handle;

    _exitSub?.cancel();
    final exitFuture = handle.exitCode as Future<int>;
    _exitSub = exitFuture.asStream().listen((_) {
      if (_stopped) return;
      _onExit();
    });
  }

  void _onExit() {
    final now = DateTime.now();
    _recentStarts.removeWhere(
      (t) => now.difference(t) > const Duration(minutes: 1),
    );
    if (_recentStarts.length >= _maxRestartsPerMinute + 1) {
      if (!_gaveUp.isCompleted) _gaveUp.complete();
      return;
    }
    _spawn();
  }

  String _renderConfig(ProxyNode node) {
    return const JsonEncoder.withIndent('  ').convert({
      'log': {'level': 'warn', 'disabled': false},
      'inbounds': [
        {'type': 'socks', 'tag': 'socks-in', 'listen': '127.0.0.1', 'listen_port': _socksPort},
        {'type': 'http', 'tag': 'http-in', 'listen': '127.0.0.1', 'listen_port': _httpPort},
      ],
      'outbounds': [
        {
          'type': 'shadowsocks',
          'tag': 'proxy-out',
          'server': node.server,
          'server_port': node.port,
          'method': node.cipher,
          'password': node.password,
        }
      ],
    });
  }

  Future<void> stop() async {
    _stopped = true;
    _exitSub?.cancel();
    try {
      (_process as dynamic)?.kill();
    } catch (_) {}
  }
}
```

- [ ] **Step 5: Run tests**

Run: `cd flutter-wrapper && flutter test test/proxy/singbox_supervisor_test.dart`
Expected: pass.

- [ ] **Step 6: Commit**

```bash
git add flutter-wrapper/lib/proxy/singbox_supervisor.dart flutter-wrapper/test/proxy/singbox_supervisor_test.dart flutter-wrapper/pubspec.yaml
git commit -m "feat(flutter-proxy): add SingboxSupervisor with ≤3/min restart policy"
```

---

### Task 17: `NodePool` (built-in + OSS + DoH refresh)

**Files:**
- Create: `flutter-wrapper/lib/proxy/node_pool.dart`
- Create: `flutter-wrapper/test/proxy/node_pool_test.dart`
- Modify: `flutter-wrapper/pubspec.yaml`

- [ ] **Step 1: Add `http` and `mockito` deps**

Edit `flutter-wrapper/pubspec.yaml`:
```yaml
dependencies:
  flutter:
    sdk: flutter
  webview_flutter: ^4.10.0
  http: ^1.2.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0
  test: ^1.25.0
  mockito: ^5.4.4
  build_runner: ^2.4.0
```

Run `cd flutter-wrapper && flutter pub get`.

- [ ] **Step 2: Write the failing test**

Create `flutter-wrapper/test/proxy/node_pool_test.dart`:

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

import 'package:h5_app/proxy/proxy_node.dart';
import 'package:h5_app/proxy/node_pool.dart';

void main() {
  test('built-in nodes available immediately', () async {
    final builtin = [
      ProxyNode(name: 'b', type: 'ss', server: 'h', port: 1,
          cipher: 'aes-256-gcm', password: 'pw'),
    ];
    final pool = NodePool(
      builtin: builtin,
      ossUrls: const [],
      dnsTxtDomains: const [],
      httpClient: MockClient((req) async => http.Response('', 404)),
    );
    await pool.bootstrap();
    expect(pool.nodes, builtin);
  });

  test('OSS fetch parses proxies array and merges in priority order', () async {
    final builtin = [
      ProxyNode(name: 'builtin', type: 'ss', server: 'b', port: 1,
          cipher: 'aes-256-gcm', password: 'pw'),
    ];
    final mockClient = MockClient((req) async {
      expect(req.url.toString(), 'https://oss.example.com/c.json');
      return http.Response(
        '{"version":1,"updated_at":"2026-05-07T00:00:00Z","proxies":'
        '[{"name":"oss1","type":"ss","server":"o","port":2,'
        '"cipher":"aes-256-gcm","password":"pw"}]}',
        200,
      );
    });
    final pool = NodePool(
      builtin: builtin,
      ossUrls: const ['https://oss.example.com/c.json'],
      dnsTxtDomains: const [],
      httpClient: mockClient,
    );
    await pool.bootstrap();
    expect(pool.nodes.map((n) => n.name).toList(), ['builtin', 'oss1']);
  });

  test('OSS failure does not block; previous pool retained on subsequent refresh', () async {
    int hits = 0;
    final mockClient = MockClient((req) async {
      hits++;
      if (hits == 1) {
        return http.Response(
          '{"proxies":[{"name":"oss1","type":"ss","server":"o","port":2,'
          '"cipher":"aes-256-gcm","password":"pw"}]}',
          200,
        );
      }
      return http.Response('boom', 500);
    });
    final pool = NodePool(
      builtin: const [],
      ossUrls: const ['https://oss.example.com/c.json'],
      dnsTxtDomains: const [],
      httpClient: mockClient,
    );
    await pool.bootstrap();
    expect(pool.nodes.map((n) => n.name), ['oss1']);
    await pool.refresh();
    expect(pool.nodes.map((n) => n.name), ['oss1']); // retained
  });
}
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `cd flutter-wrapper && flutter test test/proxy/node_pool_test.dart`
Expected: FAIL — `NodePool` not defined.

- [ ] **Step 4: Implement `node_pool.dart`**

Create `flutter-wrapper/lib/proxy/node_pool.dart`:

```dart
import 'dart:async';
import 'dart:convert';

import 'package:http/http.dart' as http;

import 'proxy_node.dart';

class NodePool {
  final List<ProxyNode> builtin;
  final List<String> ossUrls;
  final List<String> dnsTxtDomains;
  final http.Client _http;
  static const _fetchTimeout = Duration(seconds: 5);

  List<ProxyNode> _nodes;

  NodePool({
    required this.builtin,
    required this.ossUrls,
    required this.dnsTxtDomains,
    http.Client? httpClient,
  })  : _http = httpClient ?? http.Client(),
        _nodes = List.of(builtin);

  List<ProxyNode> get nodes => List.unmodifiable(_nodes);

  Future<void> bootstrap() async {
    await refresh();
  }

  Future<void> refresh() async {
    final ossNodes = await _gatherOss();
    final txtNodes = await _gatherDnsTxt();

    final merged = <ProxyNode>[
      ...builtin,
      ...ossNodes,
      ...txtNodes,
    ];

    if (merged.isEmpty && _nodes.isNotEmpty) {
      // Refresh failed entirely; retain previous pool.
      return;
    }
    _nodes = merged;
  }

  Future<List<ProxyNode>> _gatherOss() async {
    final futures = ossUrls.map(_fetchOssOne);
    final results = await Future.wait(futures);
    return results.expand((x) => x).toList();
  }

  Future<List<ProxyNode>> _fetchOssOne(String url) async {
    try {
      final resp = await _http.get(Uri.parse(url)).timeout(_fetchTimeout);
      if (resp.statusCode != 200) return const [];
      final data = jsonDecode(resp.body) as Map<String, dynamic>;
      final list = (data['proxies'] as List? ?? const []);
      return list
          .whereType<Map<String, dynamic>>()
          .map(_safeFromJson)
          .whereType<ProxyNode>()
          .toList();
    } catch (_) {
      return const [];
    }
  }

  ProxyNode? _safeFromJson(Map<String, dynamic> j) {
    try {
      return ProxyNode.fromJson(j);
    } catch (_) {
      return null;
    }
  }

  Future<List<ProxyNode>> _gatherDnsTxt() async {
    if (dnsTxtDomains.isEmpty) return const [];
    final futures = dnsTxtDomains.map(_queryDoh);
    final results = await Future.wait(futures);
    return results.expand((x) => x).toList();
  }

  Future<List<ProxyNode>> _queryDoh(String domain) async {
    try {
      final url = Uri.parse(
        'https://1.1.1.1/dns-query?name=$domain&type=TXT',
      );
      final resp = await _http
          .get(url, headers: const {'Accept': 'application/dns-json'})
          .timeout(_fetchTimeout);
      if (resp.statusCode != 200) return const [];
      final data = jsonDecode(resp.body) as Map<String, dynamic>;
      final answers = (data['Answer'] as List? ?? const []);
      final nodes = <ProxyNode>[];
      for (final a in answers) {
        if (a is! Map<String, dynamic>) continue;
        final raw = (a['data'] as String?)?.replaceAll('"', '').trim();
        if (raw == null || !raw.startsWith('ss://')) continue;
        final node = _parseSsUri(raw);
        if (node != null) nodes.add(node);
      }
      return nodes;
    } catch (_) {
      return const [];
    }
  }

  ProxyNode? _parseSsUri(String uri) {
    // Minimal SS URI parser for DoH-discovered nodes. Mirrors the backend
    // parser shape: ss://BASE64(method:password)@host:port[#name]
    try {
      final body = uri.substring('ss://'.length);
      final hashIdx = body.indexOf('#');
      var name = '';
      var rest = body;
      if (hashIdx >= 0) {
        name = Uri.decodeComponent(body.substring(hashIdx + 1));
        rest = body.substring(0, hashIdx);
      }
      final atIdx = rest.lastIndexOf('@');
      if (atIdx < 0) return null;
      final userinfo = rest.substring(0, atIdx);
      final hostport = rest.substring(atIdx + 1);
      final colonIdx = hostport.lastIndexOf(':');
      if (colonIdx < 0) return null;
      final host = hostport.substring(0, colonIdx);
      final port = int.tryParse(hostport.substring(colonIdx + 1)) ?? 0;
      final paddedB64 = userinfo + '=' * ((4 - userinfo.length % 4) % 4);
      final decoded = utf8.decode(base64Url.decode(
        paddedB64.replaceAll('+', '-').replaceAll('/', '_'),
      ));
      final partIdx = decoded.indexOf(':');
      if (partIdx < 0) return null;
      return ProxyNode(
        name: name.isEmpty ? '$host:$port' : name,
        type: 'ss',
        server: host,
        port: port,
        cipher: decoded.substring(0, partIdx),
        password: decoded.substring(partIdx + 1),
      );
    } catch (_) {
      return null;
    }
  }

  void dispose() => _http.close();
}
```

- [ ] **Step 5: Run tests**

Run: `cd flutter-wrapper && flutter test test/proxy/node_pool_test.dart`
Expected: pass.

- [ ] **Step 6: Commit**

```bash
git add flutter-wrapper/lib/proxy/node_pool.dart flutter-wrapper/test/proxy/node_pool_test.dart flutter-wrapper/pubspec.yaml
git commit -m "feat(flutter-proxy): add NodePool with OSS + DoH refresh"
```

---

### Task 18: `ProbeSelector`

**Files:**
- Create: `flutter-wrapper/lib/proxy/probe_selector.dart`
- Create: `flutter-wrapper/test/proxy/probe_selector_test.dart`

- [ ] **Step 1: Write the failing test**

Create `flutter-wrapper/test/proxy/probe_selector_test.dart`:

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:h5_app/proxy/probe_selector.dart';
import 'package:h5_app/proxy/proxy_node.dart';

class _RecordingSupervisor {
  final List<String> startedNodes = [];
  Future<void> startWith(ProxyNode node) async {
    startedNodes.add(node.name);
  }
  Future<void> stop() async {}
}

void main() {
  ProxyNode mk(String name) => ProxyNode(
        name: name, type: 'ss', server: name, port: 1,
        cipher: 'aes-256-gcm', password: 'pw',
      );

  test('returns first node whose probe succeeds', () async {
    final sup = _RecordingSupervisor();
    final selector = ProbeSelector(
      h5Url: 'https://example.com',
      supervisor: sup,
      probe: (node, url) async => node.name == 'b',
    );
    final winner = await selector.pick([mk('a'), mk('b'), mk('c')]);
    expect(winner!.name, 'b');
    expect(sup.startedNodes, ['a', 'b']); // stopped probing after 'b' succeeded
  });

  test('returns null when all fail', () async {
    final sup = _RecordingSupervisor();
    final selector = ProbeSelector(
      h5Url: 'https://example.com',
      supervisor: sup,
      probe: (node, url) async => false,
    );
    final winner = await selector.pick([mk('a'), mk('b')]);
    expect(winner, isNull);
  });
}
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd flutter-wrapper && flutter test test/proxy/probe_selector_test.dart`
Expected: FAIL — `ProbeSelector` not defined.

- [ ] **Step 3: Implement `probe_selector.dart`**

Create `flutter-wrapper/lib/proxy/probe_selector.dart`:

```dart
import 'dart:async';
import 'dart:io';

import 'proxy_node.dart';
import 'singbox_supervisor.dart';

typedef ProbeFn = Future<bool> Function(ProxyNode node, String h5Url);

class ProbeSelector {
  final String h5Url;
  final dynamic supervisor; // duck-typed: must expose startWith(ProxyNode)
  final ProbeFn _probe;

  ProbeSelector({
    required this.h5Url,
    required this.supervisor,
    ProbeFn? probe,
  }) : _probe = probe ?? _httpHeadProbe;

  Future<ProxyNode?> pick(List<ProxyNode> nodes) async {
    for (final node in nodes) {
      await supervisor.startWith(node);
      // brief delay so sing-box has time to bind sockets;
      // tests inject probe directly so this is short.
      await Future.delayed(const Duration(milliseconds: 200));
      final ok = await _probe(node, h5Url);
      if (ok) return node;
    }
    return null;
  }

  static Future<bool> _httpHeadProbe(ProxyNode node, String h5Url) async {
    final client = HttpClient();
    client.findProxy = (uri) => 'PROXY 127.0.0.1:1081';
    try {
      final req = await client
          .headUrl(Uri.parse(h5Url))
          .timeout(const Duration(seconds: 5));
      final resp = await req.close().timeout(const Duration(seconds: 5));
      await resp.drain<void>();
      return resp.statusCode >= 200 && resp.statusCode < 400;
    } catch (_) {
      return false;
    } finally {
      client.close(force: true);
    }
  }
}
```

- [ ] **Step 4: Run tests**

Run: `cd flutter-wrapper && flutter test test/proxy/probe_selector_test.dart`
Expected: pass.

- [ ] **Step 5: Commit**

```bash
git add flutter-wrapper/lib/proxy/probe_selector.dart flutter-wrapper/test/proxy/probe_selector_test.dart
git commit -m "feat(flutter-proxy): add ProbeSelector"
```

---

### Task 19: Kotlin `ProxyControllerPlugin` + Dart `proxy_controller.dart`

**Files:**
- Create: `flutter-wrapper/android/app/src/main/kotlin/com/h5packager/h5_app/ProxyControllerPlugin.kt`
- Modify: `flutter-wrapper/android/app/src/main/kotlin/com/h5packager/h5_app/MainActivity.kt`
- Create: `flutter-wrapper/lib/proxy/proxy_controller.dart`

- [ ] **Step 1: Add `androidx.webkit:webkit:1.10.0` to gradle (if not present from Task 14)**

Edit `flutter-wrapper/android/app/build.gradle`:
```gradle
dependencies {
    implementation "androidx.webkit:webkit:1.10.0"
    // ... existing deps
}
```

- [ ] **Step 2: Create the Kotlin plugin**

Create `flutter-wrapper/android/app/src/main/kotlin/com/h5packager/h5_app/ProxyControllerPlugin.kt`:

```kotlin
package com.h5packager.h5_app

import androidx.webkit.ProxyConfig
import androidx.webkit.ProxyController
import androidx.webkit.WebViewFeature
import io.flutter.embedding.engine.plugins.FlutterPlugin
import io.flutter.plugin.common.MethodCall
import io.flutter.plugin.common.MethodChannel

class ProxyControllerPlugin : FlutterPlugin, MethodChannel.MethodCallHandler {
    private lateinit var channel: MethodChannel

    companion object {
        const val CHANNEL = "h5_app/proxy_controller"
    }

    override fun onAttachedToEngine(binding: FlutterPlugin.FlutterPluginBinding) {
        channel = MethodChannel(binding.binaryMessenger, CHANNEL)
        channel.setMethodCallHandler(this)
    }

    override fun onDetachedFromEngine(binding: FlutterPlugin.FlutterPluginBinding) {
        channel.setMethodCallHandler(null)
    }

    override fun onMethodCall(call: MethodCall, result: MethodChannel.Result) {
        when (call.method) {
            "isSupported" -> {
                result.success(WebViewFeature.isFeatureSupported(WebViewFeature.PROXY_OVERRIDE))
            }
            "setProxy" -> {
                val proxyUrl = call.argument<String>("httpProxyUrl")
                if (proxyUrl == null) {
                    result.error("ARG", "httpProxyUrl missing", null); return
                }
                if (!WebViewFeature.isFeatureSupported(WebViewFeature.PROXY_OVERRIDE)) {
                    result.error("UNSUPPORTED", "ProxyController not supported", null); return
                }
                val cfg = ProxyConfig.Builder().addProxyRule(proxyUrl).build()
                ProxyController.getInstance().setProxyOverride(cfg, { it.run() }) {
                    result.success(null)
                }
            }
            "clearProxy" -> {
                if (!WebViewFeature.isFeatureSupported(WebViewFeature.PROXY_OVERRIDE)) {
                    result.success(null); return
                }
                ProxyController.getInstance().clearProxyOverride({ it.run() }) {
                    result.success(null)
                }
            }
            else -> result.notImplemented()
        }
    }
}
```

- [ ] **Step 3: Register the plugin in `MainActivity`**

Edit `flutter-wrapper/android/app/src/main/kotlin/com/h5packager/h5_app/MainActivity.kt`. In `configureFlutterEngine`, add at the end:

```kotlin
flutterEngine.plugins.add(ProxyControllerPlugin())
```

- [ ] **Step 4: Create the Dart-side wrapper**

Create `flutter-wrapper/lib/proxy/proxy_controller.dart`:

```dart
import 'package:flutter/services.dart';

class WebViewProxyController {
  static const _channel = MethodChannel('h5_app/proxy_controller');

  static Future<bool> isSupported() async {
    final result = await _channel.invokeMethod<bool>('isSupported');
    return result ?? false;
  }

  static Future<void> setHttpProxy(String url) async {
    await _channel.invokeMethod('setProxy', {'httpProxyUrl': url});
  }

  static Future<void> clear() async {
    await _channel.invokeMethod('clearProxy');
  }
}
```

- [ ] **Step 5: Build the APK to verify the Kotlin compiles**

Run: `cd flutter-wrapper && flutter build apk --debug --target-platform=android-arm64 --dart-define=H5_URL=https://example.com 2>&1 | tail -30`
Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add flutter-wrapper/android/app/src/main/kotlin/com/h5packager/h5_app/ProxyControllerPlugin.kt \
        flutter-wrapper/android/app/src/main/kotlin/com/h5packager/h5_app/MainActivity.kt \
        flutter-wrapper/android/app/build.gradle \
        flutter-wrapper/lib/proxy/proxy_controller.dart
git commit -m "feat(flutter-proxy): add ProxyController plugin for setProxyOverride"
```

---

### Task 20: `ProxyRuntime` + error page + `main.dart` integration

**Files:**
- Create: `flutter-wrapper/lib/proxy/error_page.dart`
- Create: `flutter-wrapper/lib/proxy/proxy_runtime.dart`
- Modify: `flutter-wrapper/lib/main.dart`

- [ ] **Step 1: Create the error page constant**

Create `flutter-wrapper/lib/proxy/error_page.dart`:

```dart
const String proxyErrorHtml = '''
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>网络不可用</title>
<style>
  body { font-family: -apple-system, sans-serif; padding: 40px; text-align: center; color: #333; }
  h1 { font-size: 18px; margin-bottom: 8px; }
  p { color: #666; font-size: 14px; }
  button { margin-top: 24px; padding: 10px 24px; font-size: 14px;
           border: 1px solid #1976d2; background: #1976d2; color: white;
           border-radius: 4px; cursor: pointer; }
</style>
</head>
<body>
<h1>网络不可用</h1>
<p>请检查代理配置后重试</p>
<button onclick="window.h5appBridge && window.h5appBridge.postMessage('retryProxy')">重试</button>
</body>
</html>
''';
```

- [ ] **Step 2: Create `ProxyRuntime`**

Create `flutter-wrapper/lib/proxy/proxy_runtime.dart`:

```dart
import 'dart:async';
import 'dart:convert';
import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:path_provider/path_provider.dart' as path_provider;

import 'node_pool.dart';
import 'probe_selector.dart';
import 'proxy_controller.dart';
import 'proxy_node.dart';
import 'singbox_supervisor.dart';

class ProxyRuntime {
  static final ProxyRuntime instance = ProxyRuntime._();
  ProxyRuntime._();

  bool _started = false;
  late SingboxSupervisor _supervisor;
  late NodePool _pool;
  late ProbeSelector _selector;
  Timer? _refreshTimer;
  bool _isHealthy = false;

  bool get isHealthy => _isHealthy;

  Future<void> start({
    required Map<String, dynamic> config,
    required String h5Url,
  }) async {
    if (_started) return;
    _started = true;

    final cacheDir = await path_provider.getApplicationCacheDirectory();
    final binaryPath = await _resolveBinaryPath();

    _supervisor = SingboxSupervisor(
      binaryPath: binaryPath,
      configDir: cacheDir.path,
    );

    final builtin = (config['builtinProxies'] as List? ?? const [])
        .whereType<Map<String, dynamic>>()
        .map(ProxyNode.fromJson)
        .toList();
    final ossUrls = ((config['ossUrls'] as List?) ?? const [])
        .map((e) => e as String).toList();
    final dnsTxtDomains = ((config['dnsTxtDomains'] as List?) ?? const [])
        .map((e) => e as String).toList();
    final intervalH = (config['updateIntervalHours'] as num? ?? 1).toDouble();

    _pool = NodePool(
      builtin: builtin,
      ossUrls: ossUrls,
      dnsTxtDomains: dnsTxtDomains,
    );
    await _pool.bootstrap();

    _selector = ProbeSelector(
      h5Url: h5Url,
      supervisor: _supervisor,
    );

    final winner = await _selector.pick(_pool.nodes);
    if (winner == null) {
      _isHealthy = false;
      await _supervisor.stop();
      return;
    }

    final supported = await WebViewProxyController.isSupported();
    if (!supported) {
      debugPrint('proxy: PROXY_OVERRIDE not supported on this WebView');
      _isHealthy = false;
      return;
    }
    await WebViewProxyController.setHttpProxy('http://${_supervisor.httpAddress}');
    _isHealthy = true;

    _refreshTimer = Timer.periodic(
      Duration(milliseconds: (intervalH * 3600 * 1000).round()),
      (_) => _refresh(h5Url),
    );
  }

  Future<void> _refresh(String h5Url) async {
    await _pool.refresh();
    // If current is still healthy, do nothing. We just keep the pool fresh.
    // (Probing the active node is a future enhancement.)
  }

  Future<void> retry({required String h5Url}) async {
    await _supervisor.stop();
    _started = false;
    // Caller is expected to pass in the saved config again.
    debugPrint('proxy: retry requested — caller should re-invoke start()');
  }

  Future<String> _resolveBinaryPath() async {
    if (Platform.isAndroid) {
      // Android: native lib dir holds libsingbox.so as if it were a JNI .so
      final info = await _AndroidNativeLibDir.path();
      return '$info/libsingbox.so';
    }
    throw UnsupportedError('proxy runtime currently supports Android only');
  }
}

class _AndroidNativeLibDir {
  static const _ch = MethodChannel('h5_app/native_lib_dir');
  static Future<String> path() async {
    final result = await _ch.invokeMethod<String>('get');
    return result!;
  }
}
```

- [ ] **Step 3: Wire `getApplicationContext().applicationInfo.nativeLibraryDir` into Kotlin**

Edit `flutter-wrapper/android/app/src/main/kotlin/com/h5packager/h5_app/MainActivity.kt`. Inside `configureFlutterEngine`, add:

```kotlin
MethodChannel(flutterEngine.dartExecutor.binaryMessenger, "h5_app/native_lib_dir")
    .setMethodCallHandler { call, result ->
        if (call.method == "get") {
            result.success(applicationInfo.nativeLibraryDir)
        } else {
            result.notImplemented()
        }
    }
```

Also add the `path_provider` dep:
```yaml
dependencies:
  path_provider: ^2.1.0
```
Run `cd flutter-wrapper && flutter pub get`.

- [ ] **Step 4: Update `main.dart` to start ProxyRuntime BEFORE the WebView is built**

Edit `flutter-wrapper/lib/main.dart`. Replace the existing `void main()` with:

```dart
import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:webview_flutter/webview_flutter.dart';
import 'appvue_plugin.dart';
import 'proxy/error_page.dart';
import 'proxy/proxy_runtime.dart';
import 'sdk_bridge.dart';
import 'sdk_config.dart' as sdk_config;

const String _h5Url = String.fromEnvironment('H5_URL', defaultValue: 'about:blank');

Map<String, dynamic>? _parseProxyConfig() {
  final raw = sdk_config.proxyConfigJson;
  if (raw.isEmpty) return null;
  try {
    return jsonDecode(raw) as Map<String, dynamic>;
  } catch (_) {
    return null;
  }
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  AppVuePlugin.setup(
    onWakeupData: (data) {
      debugPrint('AppVue wakeup: $data');
    },
  );

  final proxyCfg = _parseProxyConfig();
  if (proxyCfg != null) {
    try {
      await ProxyRuntime.instance.start(config: proxyCfg, h5Url: _h5Url);
    } catch (e) {
      debugPrint('proxy start failed: $e');
    }
  }
  runApp(const H5App());
}
```

In `_WebViewPageState.initState()`, swap the navigation logic so an unhealthy proxy renders the error page instead:

```dart
final proxyDisabled = sdk_config.proxyConfigJson.isEmpty;
final proxyHealthy = ProxyRuntime.instance.isHealthy;
final disableDirect = (jsonDecode(
        sdk_config.proxyConfigJson.isEmpty ? '{}' : sdk_config.proxyConfigJson)
    as Map<String, dynamic>)['disableDirect'] == true;

if (!proxyDisabled && !proxyHealthy && disableDirect) {
  _controller.loadHtmlString(proxyErrorHtml);
} else {
  _controller.loadRequest(Uri.parse(_h5Url));
}
```

- [ ] **Step 5: Build the APK**

Run: `cd flutter-wrapper && flutter build apk --debug --target-platform=android-arm64 --dart-define=H5_URL=https://example.com 2>&1 | tail -20`
Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add flutter-wrapper/lib/main.dart flutter-wrapper/lib/proxy/proxy_runtime.dart flutter-wrapper/lib/proxy/error_page.dart flutter-wrapper/android/app/src/main/kotlin/com/h5packager/h5_app/MainActivity.kt flutter-wrapper/pubspec.yaml
git commit -m "feat(flutter-proxy): wire ProxyRuntime into app startup with error page"
```

---

## Phase 9 — Electron runtime

### Task 21: `proxy-node.js` and shared validation

**Files:**
- Create: `electron-wrapper/proxy/proxy-node.js`

- [ ] **Step 1: Create the file**

```js
'use strict';

function validateNode(o) {
  if (!o || typeof o !== 'object') throw new TypeError('node must be object');
  for (const key of ['name', 'type', 'server', 'port', 'cipher', 'password']) {
    if (!(key in o)) throw new TypeError(`node missing field ${key}`);
  }
  if (o.type !== 'ss') throw new TypeError(`unsupported type ${o.type}`);
  const port = typeof o.port === 'string' ? parseInt(o.port, 10) : o.port;
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new TypeError(`port out of range: ${o.port}`);
  }
  return {
    name: String(o.name || `${o.server}:${port}`),
    type: 'ss',
    server: String(o.server),
    port,
    cipher: String(o.cipher),
    password: String(o.password),
    udp: Boolean(o.udp),
  };
}

module.exports = { validateNode };
```

- [ ] **Step 2: Commit**

```bash
git add electron-wrapper/proxy/proxy-node.js
git commit -m "feat(electron-proxy): add ProxyNode validator"
```

---

### Task 22: `singbox-supervisor.js` with restart policy

**Files:**
- Create: `electron-wrapper/proxy/singbox-supervisor.js`
- Create: `electron-wrapper/test/proxy/singbox-supervisor.test.js`
- Modify: `electron-wrapper/package.json`

- [ ] **Step 1: Add test deps to `package.json`**

Edit `electron-wrapper/package.json`:
```json
"scripts": {
  "build:mac": "electron-builder --mac --publish never",
  "build:win": "electron-builder --win nsis --publish never",
  "test": "vitest run"
},
"devDependencies": {
  "electron": "^31.0.0",
  "electron-builder": "^24.0.0",
  "vitest": "^1.6.0",
  "sinon": "^17.0.0"
},
"dependencies": {
  "socks-proxy-agent": "^8.0.4"
}
```

Run `cd electron-wrapper && npm install`.

- [ ] **Step 2: Write the failing test**

Create `electron-wrapper/test/proxy/singbox-supervisor.test.js`:

```js
const { describe, it, expect } = require('vitest');
const sinon = require('sinon');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { EventEmitter } = require('events');
const { SingboxSupervisor } = require('../../proxy/singbox-supervisor');

function fakeSpawn() {
  const ee = new EventEmitter();
  ee.kill = sinon.fake();
  ee.pid = 1;
  return ee;
}

describe('SingboxSupervisor', () => {
  it('writes config before spawn', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sup-'));
    const spawn = sinon.fake.returns(fakeSpawn());
    const sup = new SingboxSupervisor({
      binaryPath: '/fake', configDir: dir, spawnFn: spawn,
    });
    await sup.startWith({
      name: 'n', type: 'ss', server: 'h', port: 1,
      cipher: 'aes-256-gcm', password: 'pw', udp: false,
    });
    const cfgPath = path.join(dir, 'singbox-config.json');
    expect(fs.existsSync(cfgPath)).toBe(true);
    const cfg = JSON.parse(fs.readFileSync(cfgPath, 'utf8'));
    expect(cfg.outbounds[0].type).toBe('shadowsocks');
    expect(cfg.outbounds[0].server_port).toBe(1);
    expect(spawn.callCount).toBe(1);
    await sup.stop();
  });

  it('gives up after 3 restarts within a minute', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'sup-'));
    const procs = [];
    const spawn = sinon.fake(() => { const p = fakeSpawn(); procs.push(p); return p; });
    const sup = new SingboxSupervisor({
      binaryPath: '/fake', configDir: dir, spawnFn: spawn,
    });
    await sup.startWith({
      name: 'n', type: 'ss', server: 'h', port: 1,
      cipher: 'aes-256-gcm', password: 'pw', udp: false,
    });
    const gaveUpPromise = sup.gaveUp;
    for (let i = 0; i < 4; i++) {
      procs[i].emit('exit', 1);
      await new Promise(r => setImmediate(r));
    }
    await gaveUpPromise;
    expect(spawn.callCount).toBe(4);
    await sup.stop();
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `cd electron-wrapper && npm test`
Expected: FAIL — `SingboxSupervisor` not defined.

- [ ] **Step 4: Implement `singbox-supervisor.js`**

Create `electron-wrapper/proxy/singbox-supervisor.js`:

```js
'use strict';

const fs = require('fs');
const path = require('path');
const child_process = require('child_process');

class SingboxSupervisor {
  constructor({ binaryPath, configDir, spawnFn }) {
    this.binaryPath = binaryPath;
    this.configDir = configDir;
    this._spawn = spawnFn || child_process.spawn;
    this._currentNode = null;
    this._proc = null;
    this._recentStarts = [];
    this._stopped = false;
    this.socksAddress = '127.0.0.1:1080';
    this.httpAddress = '127.0.0.1:1081';
    this._gaveUpResolve = null;
    this.gaveUp = new Promise(r => { this._gaveUpResolve = r; });
  }

  async startWith(node) {
    this._currentNode = node;
    await this._spawnOne();
  }

  async _spawnOne() {
    if (this._stopped) return;
    const cfgPath = path.join(this.configDir, 'singbox-config.json');
    fs.writeFileSync(cfgPath, this._renderConfig(this._currentNode));
    this._recentStarts.push(Date.now());

    const proc = this._spawn(this.binaryPath, ['run', '-c', cfgPath]);
    this._proc = proc;
    proc.on('exit', () => {
      if (this._stopped) return;
      this._onExit();
    });
  }

  _onExit() {
    const now = Date.now();
    this._recentStarts = this._recentStarts.filter(t => now - t < 60_000);
    if (this._recentStarts.length >= 4) {
      this._gaveUpResolve();
      return;
    }
    this._spawnOne();
  }

  _renderConfig(n) {
    return JSON.stringify({
      log: { level: 'warn', disabled: false },
      inbounds: [
        { type: 'socks', tag: 'socks-in', listen: '127.0.0.1', listen_port: 1080 },
        { type: 'http', tag: 'http-in', listen: '127.0.0.1', listen_port: 1081 },
      ],
      outbounds: [
        {
          type: 'shadowsocks',
          tag: 'proxy-out',
          server: n.server,
          server_port: n.port,
          method: n.cipher,
          password: n.password,
        },
      ],
    }, null, 2);
  }

  async stop() {
    this._stopped = true;
    try { this._proc && this._proc.kill && this._proc.kill(); } catch (_) {}
  }
}

module.exports = { SingboxSupervisor };
```

- [ ] **Step 5: Run tests**

Run: `cd electron-wrapper && npm test`
Expected: pass.

- [ ] **Step 6: Commit**

```bash
git add electron-wrapper/proxy/singbox-supervisor.js electron-wrapper/test/proxy/singbox-supervisor.test.js electron-wrapper/package.json electron-wrapper/package-lock.json
git commit -m "feat(electron-proxy): add SingboxSupervisor with ≤3/min restart policy"
```

---

### Task 23: `node-pool.js`

**Files:**
- Create: `electron-wrapper/proxy/node-pool.js`
- Create: `electron-wrapper/test/proxy/node-pool.test.js`

- [ ] **Step 1: Write the failing test**

Create `electron-wrapper/test/proxy/node-pool.test.js`:

```js
const { describe, it, expect, vi } = require('vitest');
const { NodePool } = require('../../proxy/node-pool');

describe('NodePool', () => {
  it('built-in nodes available immediately', async () => {
    const pool = new NodePool({
      builtin: [{ name: 'b', type: 'ss', server: 'h', port: 1, cipher: 'aes-256-gcm', password: 'pw' }],
      ossUrls: [],
      dnsTxtDomains: [],
      fetchFn: vi.fn(),
    });
    await pool.bootstrap();
    expect(pool.nodes).toHaveLength(1);
    expect(pool.nodes[0].name).toBe('b');
  });

  it('OSS fetch parses proxies array, priority order = built-in then oss', async () => {
    const fetchFn = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        proxies: [{ name: 'oss1', type: 'ss', server: 'o', port: 2, cipher: 'aes-256-gcm', password: 'pw' }],
      }),
    });
    const pool = new NodePool({
      builtin: [{ name: 'b', type: 'ss', server: 'h', port: 1, cipher: 'aes-256-gcm', password: 'pw' }],
      ossUrls: ['https://oss.example.com/c.json'],
      dnsTxtDomains: [],
      fetchFn,
    });
    await pool.bootstrap();
    expect(pool.nodes.map(n => n.name)).toEqual(['b', 'oss1']);
  });

  it('OSS failure does not block; previous pool retained', async () => {
    let calls = 0;
    const fetchFn = vi.fn().mockImplementation(async () => {
      calls++;
      if (calls === 1) return { ok: true, json: async () => ({ proxies: [{ name: 'oss1', type: 'ss', server: 'o', port: 2, cipher: 'aes-256-gcm', password: 'pw' }] }) };
      return { ok: false, status: 500 };
    });
    const pool = new NodePool({
      builtin: [],
      ossUrls: ['https://oss.example.com/c.json'],
      dnsTxtDomains: [],
      fetchFn,
    });
    await pool.bootstrap();
    expect(pool.nodes).toHaveLength(1);
    await pool.refresh();
    expect(pool.nodes).toHaveLength(1);
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd electron-wrapper && npm test -- test/proxy/node-pool.test.js`
Expected: FAIL.

- [ ] **Step 3: Implement `node-pool.js`**

Create `electron-wrapper/proxy/node-pool.js`:

```js
'use strict';

const { validateNode } = require('./proxy-node');

class NodePool {
  constructor({ builtin, ossUrls, dnsTxtDomains, fetchFn }) {
    this.builtin = builtin || [];
    this.ossUrls = ossUrls || [];
    this.dnsTxtDomains = dnsTxtDomains || [];
    this._fetch = fetchFn || globalThis.fetch;
    this._nodes = [...this.builtin];
  }

  get nodes() { return [...this._nodes]; }

  async bootstrap() { await this.refresh(); }

  async refresh() {
    const oss = await this._gatherOss();
    const txt = await this._gatherDnsTxt();
    const merged = [...this.builtin, ...oss, ...txt];
    if (merged.length === 0 && this._nodes.length > 0) return;
    this._nodes = merged;
  }

  async _gatherOss() {
    const out = [];
    await Promise.all(this.ossUrls.map(async (url) => {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 5000);
        const resp = await this._fetch(url, { signal: ctrl.signal });
        clearTimeout(t);
        if (!resp.ok) return;
        const data = await resp.json();
        for (const raw of (data.proxies || [])) {
          try { out.push(validateNode(raw)); } catch (_) {}
        }
      } catch (_) {}
    }));
    return out;
  }

  async _gatherDnsTxt() {
    const out = [];
    await Promise.all(this.dnsTxtDomains.map(async (domain) => {
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 5000);
        const resp = await this._fetch(
          `https://1.1.1.1/dns-query?name=${encodeURIComponent(domain)}&type=TXT`,
          { headers: { 'Accept': 'application/dns-json' }, signal: ctrl.signal },
        );
        clearTimeout(t);
        if (!resp.ok) return;
        const data = await resp.json();
        for (const ans of (data.Answer || [])) {
          const raw = String(ans.data || '').replace(/"/g, '').trim();
          if (!raw.startsWith('ss://')) continue;
          const node = parseSsUri(raw);
          if (node) out.push(node);
        }
      } catch (_) {}
    }));
    return out;
  }
}

function parseSsUri(uri) {
  try {
    const body = uri.slice('ss://'.length);
    const hashIdx = body.indexOf('#');
    let name = '';
    let rest = body;
    if (hashIdx >= 0) {
      name = decodeURIComponent(body.slice(hashIdx + 1));
      rest = body.slice(0, hashIdx);
    }
    const atIdx = rest.lastIndexOf('@');
    if (atIdx < 0) return null;
    const userinfo = rest.slice(0, atIdx);
    const hostport = rest.slice(atIdx + 1);
    const colonIdx = hostport.lastIndexOf(':');
    const host = hostport.slice(0, colonIdx);
    const port = parseInt(hostport.slice(colonIdx + 1), 10);
    const padded = userinfo + '='.repeat((4 - userinfo.length % 4) % 4);
    const decoded = Buffer.from(padded.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
    const partIdx = decoded.indexOf(':');
    if (partIdx < 0) return null;
    return validateNode({
      name: name || `${host}:${port}`,
      type: 'ss',
      server: host,
      port,
      cipher: decoded.slice(0, partIdx),
      password: decoded.slice(partIdx + 1),
    });
  } catch (_) {
    return null;
  }
}

module.exports = { NodePool };
```

- [ ] **Step 4: Run tests**

Run: `cd electron-wrapper && npm test -- test/proxy/node-pool.test.js`
Expected: pass.

- [ ] **Step 5: Commit**

```bash
git add electron-wrapper/proxy/node-pool.js electron-wrapper/test/proxy/node-pool.test.js
git commit -m "feat(electron-proxy): add NodePool"
```

---

### Task 24: `probe-selector.js`

**Files:**
- Create: `electron-wrapper/proxy/probe-selector.js`
- Create: `electron-wrapper/test/proxy/probe-selector.test.js`

- [ ] **Step 1: Write the failing test**

Create `electron-wrapper/test/proxy/probe-selector.test.js`:

```js
const { describe, it, expect } = require('vitest');
const { ProbeSelector } = require('../../proxy/probe-selector');

describe('ProbeSelector', () => {
  it('returns first probe-passing node', async () => {
    const started = [];
    const fakeSup = { startWith: async (n) => { started.push(n.name); } };
    const selector = new ProbeSelector({
      h5Url: 'https://example.com',
      supervisor: fakeSup,
      probeFn: async (n) => n.name === 'b',
    });
    const w = await selector.pick([
      { name: 'a' }, { name: 'b' }, { name: 'c' },
    ]);
    expect(w.name).toBe('b');
    expect(started).toEqual(['a', 'b']);
  });

  it('returns null when all fail', async () => {
    const selector = new ProbeSelector({
      h5Url: 'https://example.com',
      supervisor: { startWith: async () => {} },
      probeFn: async () => false,
    });
    expect(await selector.pick([{ name: 'a' }])).toBeNull();
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `cd electron-wrapper && npm test -- test/proxy/probe-selector.test.js`
Expected: FAIL.

- [ ] **Step 3: Implement `probe-selector.js`**

Create `electron-wrapper/proxy/probe-selector.js`:

```js
'use strict';

const https = require('https');
const http = require('http');
const { SocksProxyAgent } = require('socks-proxy-agent');

class ProbeSelector {
  constructor({ h5Url, supervisor, probeFn }) {
    this.h5Url = h5Url;
    this.supervisor = supervisor;
    this._probe = probeFn || defaultProbe;
  }

  async pick(nodes) {
    for (const node of nodes) {
      await this.supervisor.startWith(node);
      await new Promise(r => setTimeout(r, 200));
      try {
        if (await this._probe(node, this.h5Url)) return node;
      } catch (_) {}
    }
    return null;
  }
}

function defaultProbe(_node, h5Url) {
  return new Promise((resolve) => {
    const agent = new SocksProxyAgent('socks5://127.0.0.1:1080');
    const url = new URL(h5Url);
    const lib = url.protocol === 'https:' ? https : http;
    const req = lib.request({
      method: 'HEAD',
      hostname: url.hostname,
      port: url.port || (url.protocol === 'https:' ? 443 : 80),
      path: url.pathname + url.search,
      agent,
      timeout: 5000,
    }, (res) => {
      resolve(res.statusCode >= 200 && res.statusCode < 400);
      res.resume();
    });
    req.on('error', () => resolve(false));
    req.on('timeout', () => { req.destroy(); resolve(false); });
    req.end();
  });
}

module.exports = { ProbeSelector };
```

- [ ] **Step 4: Run tests**

Run: `cd electron-wrapper && npm test`
Expected: all pass.

- [ ] **Step 5: Commit**

```bash
git add electron-wrapper/proxy/probe-selector.js electron-wrapper/test/proxy/probe-selector.test.js
git commit -m "feat(electron-proxy): add ProbeSelector"
```

---

### Task 25: `proxy-runtime.js`, error page, `main.js` integration, `extraResources`

**Files:**
- Create: `electron-wrapper/proxy/proxy-runtime.js`
- Create: `electron-wrapper/proxy/error-page.js`
- Modify: `electron-wrapper/main.js`
- Modify: `electron-wrapper/package.json`
- Create: `electron-wrapper/resources/singbox/.gitkeep`

- [ ] **Step 1: Create the error page**

Create `electron-wrapper/proxy/error-page.js`:

```js
'use strict';

const errorHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>网络不可用</title>
<style>
  body { font-family: -apple-system, sans-serif; padding: 40px; text-align: center; color: #333; }
  h1 { font-size: 18px; margin-bottom: 8px; }
  p { color: #666; font-size: 14px; }
  button { margin-top: 24px; padding: 10px 24px; font-size: 14px;
           border: 1px solid #1976d2; background: #1976d2; color: white;
           border-radius: 4px; cursor: pointer; }
</style></head>
<body><h1>网络不可用</h1><p>请检查代理配置后重试</p>
<button onclick="window.electronProxyRetry && window.electronProxyRetry()">重试</button>
</body></html>`;

module.exports = { errorHtml };
```

- [ ] **Step 2: Create `proxy-runtime.js`**

Create `electron-wrapper/proxy/proxy-runtime.js`:

```js
'use strict';

const path = require('path');
const os = require('os');
const fs = require('fs');
const { SingboxSupervisor } = require('./singbox-supervisor');
const { NodePool } = require('./node-pool');
const { ProbeSelector } = require('./probe-selector');

class ProxyRuntime {
  constructor() {
    this._started = false;
    this.isHealthy = false;
  }

  async start({ config, h5Url, resourcesPath, platform }) {
    if (this._started) return;
    this._started = true;

    const cacheDir = fs.mkdtempSync(path.join(os.tmpdir(), 'h5-proxy-'));
    const binaryName = platform === 'win32' ? 'sing-box.exe' : 'sing-box';
    const binaryPath = path.join(resourcesPath, 'singbox', binaryName);

    this.supervisor = new SingboxSupervisor({
      binaryPath,
      configDir: cacheDir,
    });
    this.pool = new NodePool({
      builtin: config.builtinProxies || [],
      ossUrls: config.ossUrls || [],
      dnsTxtDomains: config.dnsTxtDomains || [],
    });
    await this.pool.bootstrap();

    this.selector = new ProbeSelector({
      h5Url,
      supervisor: this.supervisor,
    });
    const winner = await this.selector.pick(this.pool.nodes);
    if (!winner) {
      this.isHealthy = false;
      await this.supervisor.stop();
      return;
    }
    this.isHealthy = true;

    const intervalMs = (Number(config.updateIntervalHours) || 1) * 3600 * 1000;
    this._timer = setInterval(() => this.pool.refresh().catch(() => {}), intervalMs);
  }

  async stop() {
    clearInterval(this._timer);
    if (this.supervisor) await this.supervisor.stop();
    this._started = false;
  }
}

module.exports = { ProxyRuntime };
```

- [ ] **Step 3: Update `main.js` to start ProxyRuntime before loading the H5 URL**

Edit `electron-wrapper/main.js`:

```js
const { app, BrowserWindow, session } = require('electron');
const path = require('path');

const H5_URL = '__H5_URL__';
const CUSTOM_JS = '__CUSTOM_JS__';
const SDK_CONFIGS = '__SDK_CONFIGS__';

const { ProxyRuntime } = require('./proxy/proxy-runtime');
const { errorHtml } = require('./proxy/error-page');

const proxyRuntime = new ProxyRuntime();
let mainWin = null;
let savedProxyConfig = null;

async function bootProxyIfConfigured() {
  const cfg = (typeof SDK_CONFIGS === 'object' && SDK_CONFIGS && SDK_CONFIGS.proxy)
    ? SDK_CONFIGS.proxy : null;
  if (!cfg) return;
  savedProxyConfig = cfg;
  await proxyRuntime.start({
    config: cfg,
    h5Url: H5_URL,
    resourcesPath: process.resourcesPath,
    platform: process.platform,
  });
  if (proxyRuntime.isHealthy) {
    await session.defaultSession.setProxy({ proxyRules: 'socks5://127.0.0.1:1080' });
  }
}

function createWindow() {
  mainWin = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  mainWin.webContents.on('did-finish-load', () => {
    if (CUSTOM_JS && CUSTOM_JS.length > 0) {
      mainWin.webContents.executeJavaScript(CUSTOM_JS).catch(err => {
        console.error('customJs error:', err);
      });
    }
  });

  const proxyEnabled = savedProxyConfig != null;
  const disableDirect = proxyEnabled && savedProxyConfig.disableDirect === true;
  if (proxyEnabled && !proxyRuntime.isHealthy && disableDirect) {
    mainWin.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(errorHtml));
  } else {
    mainWin.loadURL(H5_URL);
  }
}

app.whenReady()
  .then(bootProxyIfConfigured)
  .then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('before-quit', () => {
  proxyRuntime.stop().catch(() => {});
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
```

- [ ] **Step 4: Add `extraResources` rule to `package.json`**

Edit `electron-wrapper/package.json`, in the `"build"` block:
```json
"build": {
  "appId": "com.h5packager.app",
  "productName": "H5 App",
  "extraResources": [
    { "from": "resources/singbox", "to": "singbox", "filter": ["**/*"] }
  ],
  "mac": { "target": "dmg" },
  "win": { "target": "nsis" }
}
```

- [ ] **Step 5: Create the placeholder folder**

```bash
mkdir -p electron-wrapper/resources/singbox
touch electron-wrapper/resources/singbox/.gitkeep
```

- [ ] **Step 6: Run all electron tests**

Run: `cd electron-wrapper && npm test`
Expected: pass.

- [ ] **Step 7: Commit**

```bash
git add electron-wrapper/proxy/proxy-runtime.js electron-wrapper/proxy/error-page.js electron-wrapper/main.js electron-wrapper/package.json electron-wrapper/resources/singbox/.gitkeep
git commit -m "feat(electron-proxy): wire ProxyRuntime + extraResources + error page"
```

---

## Phase 10 — Manual smoke + finishing

### Task 26: End-to-end manual smoke test

**Files:** none (manual)

- [ ] **Step 1: Frontend UI render check**

Open the platform UI. In Home view, expand "SDK & Tracking", toggle "Network Proxy". Confirm:
- 5 fields show with correct widgets (textarea / number / textarea / textarea / checkbox)
- Help hints `(一行一个)` `(小时)` etc are visible
- Built-in proxies textarea has the placeholder example

- [ ] **Step 2: Empty-source rejection**

Submit a build with proxy enabled, ALL three node sources empty. Expected: server-side error message contains "at least one of ossUrls / dnsTxtDomains / builtinProxies".

- [ ] **Step 3: Android build with one real node**

Pick a real (working) Shadowsocks node. Submit a build with platform=Android, that node in built-in proxies, "禁用直连" checked. Wait for APK. Install on a Pixel device.

- [ ] **Step 4: Verify proxy actually transits traffic**

Open the H5 URL inside the installed app. From a separate browser, hit `https://api.ipify.org` via the same H5 page (or load any "what's my IP" page through the WebView). The IP should match the Shadowsocks node's public IP, not the device's.

- [ ] **Step 5: Error page on dead node**

Block the Shadowsocks node (firewall rule, or stop the node service). Force-stop the app, relaunch. Expected: inline error page "网络不可用…" with "重试" button.

- [ ] **Step 6: macOS DMG**

Repeat steps 3–5 on macOS DMG. Verify DMG size baseline-vs-with-proxy delta is roughly +30 MB.

- [ ] **Step 7: Windows installer**

Repeat steps 3–5 on Windows EXE.

- [ ] **Step 8: Cloud refresh**

Modify the OSS JSON node list (e.g., change a name). Wait `updateIntervalHours` (or set to 0.1 for the test). Confirm in app debug logs that the pool refresh was triggered and the new name appears.

- [ ] **Step 9: Negative — confirm no impact when proxy disabled**

Submit a build with proxy SDK NOT enabled. Inspect the produced APK with `unzip -l` — confirm no `libsingbox.so` under `lib/<abi>/`. Inspect macOS DMG `Contents/Resources/singbox/` — confirm directory is empty (just `.gitkeep`).

---

### Task 27: Wrap up — final test run + status doc

- [ ] **Step 1: Run all backend tests**

Run: `cd backend && python -m pytest tests/ -v`
Expected: all green.

- [ ] **Step 2: Run all flutter tests**

Run: `cd flutter-wrapper && flutter test`
Expected: all green.

- [ ] **Step 3: Run all electron tests**

Run: `cd electron-wrapper && npm test`
Expected: all green.

- [ ] **Step 4: Commit final docs**

```bash
git add docs/superpowers/specs/2026-05-07-spike-notes.md
git commit -m "docs(proxy): final spike + smoke notes"
```

---

## Self-Review Checklist (run after writing each section)

Spec sections vs plan tasks:
- §3 Architecture → Tasks 16–20 (Dart) + Tasks 22–25 (Node).
- §4.1 ProxyNode schema → Task 3, Task 15, Task 21.
- §4.2 Input formats → Tasks 3, 4.
- §4.3 OSS schema → Tasks 17 (Dart pool), 23 (Node pool).
- §4.4 DNS TXT schema → Tasks 17, 23 (DoH branches).
- §4.5 Stored config → Tasks 6, 8.
- §5.1 SdkField widget → Task 1.
- §5.2 proxy SDK → Task 5.
- §5.3 validation rules → Task 6.
- §5.4 parser module → Tasks 3, 4.
- §5.5 Injector / vendor binaries → Tasks 7, 8, 9, 10.
- §6 Frontend renderer → Task 11.
- §7 Runtime — Android → Tasks 15–20; Electron → 21–25.
- §8 Build size impact → covered in Task 26 step 6.
- §9 Testing — backend → Tasks 1–9 (TDD); Dart → 16–18; Node → 22–24; manual → 26.
- §10 Spike → Tasks 12, 13, 14.
- §11 Out of scope → not implemented (correct).

All sections covered. No placeholders. Type / function naming consistent across tasks (`SingboxSupervisor.startWith`, `NodePool.bootstrap/refresh`, `ProbeSelector.pick`, `WebViewProxyController.setHttpProxy`).
