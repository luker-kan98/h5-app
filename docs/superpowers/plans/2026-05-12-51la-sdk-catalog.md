# 51LA SDK Catalog Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add 51LA (我要啦统计 v6) as a built-in catalog option that users can select at build time; it ships a pre-init JS snippet that loads from `https://sdk.51.la/js-sdk-pro.min.js` and runs `LA.init({...})` inside the WebView, with no native code changes.

**Architecture:** 51LA is a JS-only SDK. The packager adds a new catalog entry (`la51`) with one required field `maskId` and two optional checkboxes (`autoTrack`, `hashMode`). At build time, `apply_flutter` and `apply_electron` render a JS bootstrap snippet (DOM-injects `<script>` then calls `LA.init`) and **prepend** it to the user-supplied `custom_js`. The merged string flows through the existing `customJs` constant (Flutter) / `__CUSTOM_JS__` placeholder (Electron); WebView/Electron templates remain unchanged. The `la51` sub-object is stripped from `sdkConfigsJson` after materialization to keep the embedded constant small (mirrors firebase's blob-strip pattern).

**Tech Stack:**
- Backend: Python 3.11, FastAPI, pytest, regex-based validation
- Modified files: `backend/app/services/sdk_catalog.py`, `backend/app/services/sdk_injector.py`
- Modified tests: `backend/tests/test_sdk_injector.py`, `backend/tests/test_build_sdk_api.py`

---

## File Structure

| File | Action | Responsibility |
|---|---|---|
| `backend/app/services/sdk_catalog.py` | Modify | Add `la51` entry to `CATALOG`; add `_validate_la51` helper called from `validate_sdk_configs` |
| `backend/app/services/sdk_injector.py` | Modify | Add `_render_la51_snippet`; prepend snippet to `custom_js` in `apply_flutter` and `apply_electron`; strip `la51` from `sdkConfigsJson` |
| `backend/tests/test_sdk_injector.py` | Modify | Add 6 tests (3 Flutter + 2 Electron + 1 disabled noop) |
| `backend/tests/test_build_sdk_api.py` | Modify | Extend catalog endpoint test to include `la51` |

---

### Task 1: Catalog entry for `la51`

**Files:**
- Modify: `backend/app/services/sdk_catalog.py`
- Test: `backend/tests/test_build_sdk_api.py`

- [ ] **Step 1: Write the failing test**

In `backend/tests/test_build_sdk_api.py`, find the existing `test_sdk_catalog_endpoint` function (around line 30). Replace its body to also assert `la51` presence:

```python
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
```

- [ ] **Step 2: Run test to verify it fails**

```bash
cd backend && python -m pytest tests/test_build_sdk_api.py::test_sdk_catalog_endpoint -v
```

Expected: FAIL — `la51` not in `ids` (KeyError on the `next(...)` call).

- [ ] **Step 3: Add the `la51` catalog entry**

In `backend/app/services/sdk_catalog.py`, locate the `CATALOG` dict (starts around line 46). Insert this entry between `firebase` and `proxy` (so analytics SDKs stay grouped):

```python
    "la51": SdkDefinition(
        id="la51",
        name_en="51LA Analytics",
        name_zh="51LA 网站统计",
        category="analytics",
        supported_platforms=("android", "ios", "macos", "windows"),
        fields=(
            SdkField(
                name="maskId",
                label_en="MaskId",
                label_zh="应用 MaskId",
                help_zh="(从 v6.51.la 应用管理页复制)",
            ),
            SdkField(
                name="autoTrack",
                label_en="Auto Event Tracking",
                label_zh="启用事件分析",
                required=False,
                widget="checkbox",
            ),
            SdkField(
                name="hashMode",
                label_en="SPA Hash Routing",
                label_zh="单页应用 Hash 路由统计",
                required=False,
                widget="checkbox",
            ),
        ),
    ),
```

- [ ] **Step 4: Run test to verify it passes**

```bash
cd backend && python -m pytest tests/test_build_sdk_api.py::test_sdk_catalog_endpoint -v
```

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add backend/app/services/sdk_catalog.py backend/tests/test_build_sdk_api.py
git commit -m "$(cat <<'EOF'
feat(sdk-catalog): add 51LA as a built-in catalog entry

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 2: MaskId validation

**Files:**
- Modify: `backend/app/services/sdk_catalog.py:350-409` (extend `validate_sdk_configs`)
- Test: `backend/tests/test_build_sdk_api.py`

Validation rules (per spec):
- `maskId` required, non-empty.
- Must match `^[A-Za-z0-9]{1,32}$` (51LA MaskIds are base62; this rules out quotes/backslashes/newlines that would corrupt the rendered JS literal).

- [ ] **Step 1: Write the failing tests**

Append to `backend/tests/test_build_sdk_api.py` (at end of file):

```python
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
```

Also make sure `import pytest` exists at the top of the file (it should, since the file uses fixtures — check first; only add if missing).

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd backend && python -m pytest tests/test_build_sdk_api.py -k la51 -v
```

Expected: FAIL — `validate_sdk_configs` currently has no maskId-specific check; the "rejects_special_chars" / "rejects_too_long" tests will pass through (no error raised) so they fail on `pytest.raises`. The "required" test should already pass (generic required-field check); leave it as belt-and-suspenders.

- [ ] **Step 3: Add maskId regex validator**

In `backend/app/services/sdk_catalog.py`, add a module-level regex (after `_DOMAIN_RE` around line 246):

```python
_LA51_MASKID_RE = re.compile(r"^[A-Za-z0-9]{1,32}$")
```

Then in `validate_sdk_configs` (around line 376, the existing `if sdk_id == "proxy":` branch), add a parallel branch **before** the proxy branch:

```python
        if sdk_id == "la51":
            mask_id = fields_value.get("maskId")
            if not isinstance(mask_id, str) or not _LA51_MASKID_RE.match(mask_id):
                raise SdkValidationError(
                    "51LA maskId must be 1–32 alphanumeric chars (got "
                    f"{mask_id!r})"
                )
            # Fall through to generic field processing below for autoTrack /
            # hashMode (booleans pass the (str, int, float, bool) check).
```

Note: do **not** `continue` here — we want the generic loop below to copy the boolean fields into `cleaned_fields` and verify there are no unknown keys.

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd backend && python -m pytest tests/test_build_sdk_api.py -k la51 -v
```

Expected: PASS (all 5 new tests).

- [ ] **Step 5: Commit**

```bash
git add backend/app/services/sdk_catalog.py backend/tests/test_build_sdk_api.py
git commit -m "$(cat <<'EOF'
feat(sdk-catalog): validate 51LA maskId is 1-32 alphanumeric chars

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 3: `_render_la51_snippet` injector helper

**Files:**
- Modify: `backend/app/services/sdk_injector.py`
- Test: `backend/tests/test_sdk_injector.py`

- [ ] **Step 1: Write the failing test**

Append to `backend/tests/test_sdk_injector.py`:

```python
def test_render_la51_snippet_basic():
    snippet = sdk_injector._render_la51_snippet(
        {"maskId": "KrDopMys2nnwBDrx"}
    )
    # Loads the official CDN script + initializes with id+ck set to MaskId.
    assert "sdk.51.la/js-sdk-pro.min.js" in snippet
    assert "id:'KrDopMys2nnwBDrx'" in snippet
    assert "ck:'KrDopMys2nnwBDrx'" in snippet
    # Defaults: autoTrack/hashMode false when not given.
    assert "autoTrack:false" in snippet
    assert "hashMode:false" in snippet
    # DOM injection (not document.write) because runJavaScript runs post-load.
    assert "createElement('script')" in snippet
    assert "document.write" not in snippet


def test_render_la51_snippet_with_options():
    snippet = sdk_injector._render_la51_snippet({
        "maskId": "Abc123",
        "autoTrack": True,
        "hashMode": True,
    })
    assert "autoTrack:true" in snippet
    assert "hashMode:true" in snippet


def test_render_la51_snippet_truthy_strings_normalize_to_bool():
    """validate_sdk_configs allows boolean-ish primitives through; the
    renderer must coerce them to actual JS true/false literals."""
    snippet = sdk_injector._render_la51_snippet({
        "maskId": "Abc123",
        "autoTrack": "true",
        "hashMode": 1,
    })
    assert "autoTrack:true" in snippet
    assert "hashMode:true" in snippet
    snippet2 = sdk_injector._render_la51_snippet({
        "maskId": "Abc123",
        "autoTrack": "false",
        "hashMode": 0,
    })
    assert "autoTrack:false" in snippet2
    assert "hashMode:false" in snippet2
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd backend && python -m pytest tests/test_sdk_injector.py -k la51_snippet -v
```

Expected: FAIL — `_render_la51_snippet` does not exist yet (AttributeError).

- [ ] **Step 3: Implement `_render_la51_snippet`**

In `backend/app/services/sdk_injector.py`, add this helper after `_apply_appvue_native` (before `_materialize_firebase_files`, around line 119):

```python
def _to_js_bool(value: Any) -> str:
    """Coerce a Python primitive into a JS boolean literal.

    Mirrors the lenient parsing used by `_normalize_proxy.disableDirect`:
    accepts True/False, 1/0, and the case-insensitive strings
    "true"/"1"/"yes" / "false"/"0"/"no"/"". Anything else is treated as
    falsy. Returns the literal string "true" or "false" — safe to embed
    directly in rendered JS source.
    """
    if isinstance(value, bool):
        return "true" if value else "false"
    if isinstance(value, (int, float)):
        return "true" if value else "false"
    if isinstance(value, str):
        return "true" if value.strip().lower() in ("true", "1", "yes") else "false"
    return "false"


def _render_la51_snippet(cfg: dict[str, Any]) -> str:
    """Produce the 51LA boot JS that loads the CDN script + runs LA.init.

    The caller (apply_flutter / apply_electron) prepends this to user-supplied
    custom_js. MaskId is assumed already validated against ^[A-Za-z0-9]{1,32}$
    by sdk_catalog.validate_sdk_configs, so we can safely embed it in single
    quotes without further escaping.
    """
    mask_id = cfg["maskId"]
    auto_track = _to_js_bool(cfg.get("autoTrack"))
    hash_mode = _to_js_bool(cfg.get("hashMode"))
    return (
        "(function(){"
        "var s=document.createElement('script');"
        "s.charset='UTF-8';"
        "s.id='LA_COLLECT';"
        "s.src='https://sdk.51.la/js-sdk-pro.min.js';"
        "s.onload=function(){"
        f"if(window.LA)LA.init({{id:'{mask_id}',ck:'{mask_id}',"
        f"autoTrack:{auto_track},hashMode:{hash_mode}}});"
        "};"
        "document.head.appendChild(s);"
        "})();"
    )
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd backend && python -m pytest tests/test_sdk_injector.py -k la51_snippet -v
```

Expected: PASS (all 3 tests).

- [ ] **Step 5: Commit**

```bash
git add backend/app/services/sdk_injector.py backend/tests/test_sdk_injector.py
git commit -m "$(cat <<'EOF'
feat(sdk-injector): add _render_la51_snippet for 51LA JS bootstrap

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 4: Wire 51LA into `apply_flutter`

**Files:**
- Modify: `backend/app/services/sdk_injector.py:29-54` (`apply_flutter` body)
- Test: `backend/tests/test_sdk_injector.py`

- [ ] **Step 1: Write the failing tests**

Append to `backend/tests/test_sdk_injector.py`:

```python
def test_apply_flutter_la51_injects_snippet(tmp_path):
    sdk_injector.apply_flutter(
        tmp_path,
        None,
        {"la51": {"maskId": "KrDopMys2nnwBDrx"}},
    )
    out = (tmp_path / "lib/sdk_config.dart").read_text(encoding="utf-8")
    # customJs constant now carries the 51LA bootstrap, with all special chars
    # Dart-escaped (single quotes are fine — Dart double-quoted strings allow
    # raw single quotes).
    assert "sdk.51.la/js-sdk-pro.min.js" in out
    assert "id:'KrDopMys2nnwBDrx'" in out
    # la51 sub-object is stripped from sdkConfigsJson to keep the constant small.
    assert '\\"la51\\"' not in out
    assert "KrDopMys2nnwBDrx" not in out.split('const String sdkConfigsJson')[1].split(';')[0]


def test_apply_flutter_la51_prepends_before_user_customjs(tmp_path):
    user_js = "window.MY_FLAG = 1;"
    sdk_injector.apply_flutter(
        tmp_path,
        user_js,
        {"la51": {"maskId": "Abc123"}},
    )
    out = (tmp_path / "lib/sdk_config.dart").read_text(encoding="utf-8")
    # 51LA snippet must run before user customJs (so LA is initialized first).
    la_pos = out.find("sdk.51.la")
    user_pos = out.find("MY_FLAG")
    assert la_pos != -1 and user_pos != -1
    assert la_pos < user_pos


def test_apply_flutter_la51_disabled_noop(tmp_path):
    sdk_injector.apply_flutter(tmp_path, "var x = 1;", {})
    out = (tmp_path / "lib/sdk_config.dart").read_text(encoding="utf-8")
    assert "51.la" not in out
    assert "LA.init" not in out
    # User JS still flows through unchanged.
    assert "var x = 1;" in out
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd backend && python -m pytest tests/test_sdk_injector.py -k "la51 and apply_flutter" -v
```

Expected: FAIL — `apply_flutter` doesn't render the 51LA snippet yet; `la51` sub-object is still embedded in `sdkConfigsJson`.

- [ ] **Step 3: Modify `apply_flutter` to prepend the snippet and strip `la51`**

In `backend/app/services/sdk_injector.py`, replace the body of `apply_flutter` (lines 29-54) with:

```python
def apply_flutter(
    flutter_dir: str | Path,
    custom_js: str | None,
    sdk_configs: dict[str, dict[str, Any]],
) -> None:
    """Generate lib/sdk_config.dart with the custom JS + SDK config payload.

    Also materializes Firebase config files (google-services.json /
    GoogleService-Info.plist) into the Flutter project tree when present;
    those base64 blobs are stripped from the in-Dart sdkConfigsJson copy so
    the generated constant stays small.

    Also templates AppVue key/secret into AndroidManifest.xml and iOS
    Info.plist (or removes the placeholder entries entirely when AppVue is
    not enabled).

    If 51LA is enabled, prepends its JS bootstrap snippet to custom_js and
    strips the la51 sub-object from sdkConfigsJson (already materialized
    into the JS, no need to ship it twice).

    The wrapper's main.dart reads from this file; missing values default to safe no-ops.
    """
    flutter_path = Path(flutter_dir)
    sanitized_configs = _materialize_firebase_files(flutter_path, sdk_configs)
    _apply_appvue_native(flutter_path, sdk_configs.get("appvue"))
    merged_custom_js = _materialize_la51_into_custom_js(custom_js, sanitized_configs)
    target = flutter_path / SDK_CONFIG_GENERATED_DART
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(
        _render_dart_config(merged_custom_js, sanitized_configs), encoding="utf-8"
    )
```

Then add the helper near `_render_la51_snippet` (right after it):

```python
def _materialize_la51_into_custom_js(
    custom_js: str | None,
    sanitized_configs: dict[str, dict[str, Any]],
) -> str | None:
    """If 51LA is in sanitized_configs, render its boot snippet, prepend to
    custom_js, and remove the la51 sub-object from sanitized_configs in
    place. Returns the merged custom_js (or original if 51LA absent).

    Caller owns sanitized_configs (typically a deepcopy from
    _materialize_firebase_files) — we mutate it in place to avoid yet
    another deepcopy.
    """
    la51_cfg = sanitized_configs.get("la51")
    if not isinstance(la51_cfg, dict):
        return custom_js
    snippet = _render_la51_snippet(la51_cfg)
    sanitized_configs.pop("la51", None)
    if custom_js is None or custom_js == "":
        return snippet
    return snippet + "\n" + custom_js
```

Note: `_materialize_firebase_files` already returns a `copy.deepcopy(sdk_configs)`, so mutating `sanitized_configs` in `_materialize_la51_into_custom_js` is safe — it doesn't affect the caller's input.

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd backend && python -m pytest tests/test_sdk_injector.py -k "la51 and apply_flutter" -v
```

Expected: PASS (all 3 tests).

- [ ] **Step 5: Run all sdk_injector tests to ensure no regression**

```bash
cd backend && python -m pytest tests/test_sdk_injector.py -v
```

Expected: PASS (all existing tests still pass).

- [ ] **Step 6: Commit**

```bash
git add backend/app/services/sdk_injector.py backend/tests/test_sdk_injector.py
git commit -m "$(cat <<'EOF'
feat(sdk-injector): wire 51LA snippet into apply_flutter, strip from sdkConfigsJson

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 5: Wire 51LA into `apply_electron`

**Files:**
- Modify: `backend/app/services/sdk_injector.py:179-203` (`apply_electron` body)
- Test: `backend/tests/test_sdk_injector.py`

- [ ] **Step 1: Write the failing tests**

Append to `backend/tests/test_sdk_injector.py`:

```python
def test_apply_electron_la51_injects_snippet(tmp_path):
    main_js = tmp_path / "main.js"
    main_js.write_text(
        "const CUSTOM_JS = '__CUSTOM_JS__';\n"
        "const SDK_CONFIGS = '__SDK_CONFIGS__';\n",
        encoding="utf-8",
    )
    sdk_injector.apply_electron(
        tmp_path,
        None,
        {"la51": {"maskId": "Abc123", "autoTrack": True}},
    )
    out = main_js.read_text(encoding="utf-8")
    # 51LA bootstrap is embedded in the CUSTOM_JS string literal (JSON-encoded,
    # so single quotes are unescaped but the source is one big string).
    assert "sdk.51.la/js-sdk-pro.min.js" in out
    assert "id:'Abc123'" in out
    assert "autoTrack:true" in out
    # la51 sub-object stripped from SDK_CONFIGS.
    assert '"la51"' not in out


def test_apply_electron_la51_prepends_before_user_customjs(tmp_path):
    main_js = tmp_path / "main.js"
    main_js.write_text(
        "const CUSTOM_JS = '__CUSTOM_JS__';\n"
        "const SDK_CONFIGS = '__SDK_CONFIGS__';\n",
        encoding="utf-8",
    )
    sdk_injector.apply_electron(
        tmp_path,
        "window.MY_FLAG = 1;",
        {"la51": {"maskId": "Abc123"}},
    )
    out = main_js.read_text(encoding="utf-8")
    la_pos = out.find("sdk.51.la")
    user_pos = out.find("MY_FLAG")
    assert la_pos != -1 and user_pos != -1
    assert la_pos < user_pos
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
cd backend && python -m pytest tests/test_sdk_injector.py -k "la51 and apply_electron" -v
```

Expected: FAIL — `apply_electron` doesn't merge in the 51LA snippet.

- [ ] **Step 3: Modify `apply_electron`**

In `backend/app/services/sdk_injector.py`, replace the body of `apply_electron` (lines 179-203):

```python
def apply_electron(
    electron_dir: str | Path,
    custom_js: str | None,
    sdk_configs: dict[str, dict[str, Any]],
) -> None:
    """Replace placeholders in electron-wrapper/main.js with the custom JS + SDK config.

    If 51LA is enabled, prepends its JS bootstrap to custom_js and strips the
    la51 sub-object from the __SDK_CONFIGS__ payload.
    """
    electron_path = Path(electron_dir)
    main_js = electron_path / "main.js"
    text = main_js.read_text(encoding="utf-8")

    # Defensive deepcopy so callers aren't surprised by in-place mutation.
    sanitized_configs = copy.deepcopy(sdk_configs)
    merged_custom_js = _materialize_la51_into_custom_js(custom_js, sanitized_configs)

    replacements = {
        ELECTRON_CUSTOM_JS_PLACEHOLDER: _js_safe_literal(
            json.dumps(merged_custom_js or "")
        ),
        ELECTRON_SDK_CONFIGS_PLACEHOLDER: _js_safe_literal(
            json.dumps(sanitized_configs, ensure_ascii=False)
        ),
    }

    # Single-pass replacement: the substituted text is never re-scanned, so
    # user-supplied JS that happens to contain a placeholder string cannot
    # corrupt later passes.
    def _sub(match: re.Match[str]) -> str:
        return replacements[match.group(2)]

    text = _ELECTRON_PLACEHOLDER_RE.sub(_sub, text)
    main_js.write_text(text, encoding="utf-8")
```

- [ ] **Step 4: Run tests to verify they pass**

```bash
cd backend && python -m pytest tests/test_sdk_injector.py -k "la51 and apply_electron" -v
```

Expected: PASS (both tests).

- [ ] **Step 5: Run full sdk_injector + api suite**

```bash
cd backend && python -m pytest tests/test_sdk_injector.py tests/test_build_sdk_api.py -v
```

Expected: PASS — all existing tests + 11 new ones.

- [ ] **Step 6: Commit**

```bash
git add backend/app/services/sdk_injector.py backend/tests/test_sdk_injector.py
git commit -m "$(cat <<'EOF'
feat(sdk-injector): wire 51LA snippet into apply_electron, strip from __SDK_CONFIGS__

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

---

### Task 6: Full backend test suite verification

**Files:** none

- [ ] **Step 1: Run the entire backend test suite**

```bash
cd backend && python -m pytest tests/ -v
```

Expected: PASS — no regressions in any test (auth, build pipeline, proxy validation, etc.). The new 51LA tests should be in the output.

- [ ] **Step 2: If any failure, fix and re-run**

Most likely failure modes:
- Existing `test_validate_*` tests broken by the new `if sdk_id == "la51"` branch — should be impossible since the branch only triggers when `sdk_id == "la51"`.
- The `test_sdk_catalog_endpoint` change to assert `field_names == {"maskId", "autoTrack", "hashMode"}` could fail if field ordering matters elsewhere — should be a set comparison so it doesn't.

- [ ] **Step 3: No commit if no changes**

If everything passed without code changes, skip the commit and move on.

---

## Self-Review Notes

**Spec coverage check:**
- Catalog entry (id/category/4 platforms/3 fields) → Task 1 ✓
- MaskId regex `^[A-Za-z0-9]{1,32}$` → Task 2 ✓
- `_render_la51_snippet` with DOM injection + LA.init → Task 3 ✓
- Boolean normalization for autoTrack/hashMode → Task 3 (`_to_js_bool`) ✓
- Prepend to customJs (Flutter) + strip from sdkConfigsJson → Task 4 ✓
- Prepend to customJs (Electron) + strip from __SDK_CONFIGS__ → Task 5 ✓
- All 10 tests from spec section "测试" → covered across Tasks 1–5 (with extras for boolean normalization edge cases)

**No-placeholder check:** Every code step contains the actual code; every test step contains the actual test; every command is concrete.

**Type consistency:** `_render_la51_snippet`, `_to_js_bool`, `_materialize_la51_into_custom_js`, `_LA51_MASKID_RE` are defined once each and referenced with consistent names across all tasks.

**Scope check:** Single subsystem (backend catalog/injector). No native code changes. Ready for one implementation pass.
