"""Inject SDK config + custom JS into a copied Flutter / Electron wrapper at build time."""
from __future__ import annotations

import base64
import binascii
import copy
import json
import os
import re
import shutil
from pathlib import Path
from typing import Any


SDK_CONFIG_GENERATED_DART = "lib/sdk_config.dart"
ELECTRON_CUSTOM_JS_PLACEHOLDER = "__CUSTOM_JS__"
ELECTRON_SDK_CONFIGS_PLACEHOLDER = "__SDK_CONFIGS__"


class FirebaseInjectionError(ValueError):
    """Raised when a Firebase config file cannot be decoded or is malformed."""

# Match either placeholder, optionally surrounded by ' or " quotes.
_ELECTRON_PLACEHOLDER_RE = re.compile(
    r"""(['"]?)(__CUSTOM_JS__|__SDK_CONFIGS__)\1"""
)


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

    The wrapper's main.dart reads from this file; missing values default to safe no-ops.
    """
    flutter_path = Path(flutter_dir)
    sanitized_configs = _materialize_firebase_files(flutter_path, sdk_configs)
    _apply_appvue_native(flutter_path, sdk_configs.get("appvue"))
    target = flutter_path / SDK_CONFIG_GENERATED_DART
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(
        _render_dart_config(custom_js, sanitized_configs), encoding="utf-8"
    )


# Lines in AndroidManifest.xml that wrap the AppVue meta-data block. The
# placeholders are emitted by the wrapper template; injector either fills them
# in or deletes the surrounding <meta-data> element when AppVue is disabled.
_APPVUE_MANIFEST_KEY_RE = re.compile(
    r'[ \t]*<meta-data\s+android:name="com\.appvue\.sdk\.KEY"\s+'
    r'android:value="__APPVUE_KEY__"\s*/>\s*\n?'
)
_APPVUE_MANIFEST_SECRET_RE = re.compile(
    r'[ \t]*<meta-data\s+android:name="com\.appvue\.sdk\.SECRET"\s+'
    r'android:value="__APPVUE_SECRET__"\s*/>\s*\n?'
)

# Lines in Runner/Info.plist that wrap the AppVue key+value pairs.
_APPVUE_PLIST_KEY_RE = re.compile(
    r'[ \t]*<key>AppVueKey</key>\s*\n[ \t]*<string>__APPVUE_KEY__</string>\s*\n?'
)
_APPVUE_PLIST_SECRET_RE = re.compile(
    r'[ \t]*<key>AppVueSecret</key>\s*\n[ \t]*<string>__APPVUE_SECRET__</string>\s*\n?'
)


def _apply_appvue_native(
    flutter_path: Path,
    appvue_cfg: dict[str, Any] | None,
) -> None:
    """Fill in AppVue placeholders in Manifest + Info.plist, or strip them.

    The wrapper ships with `__APPVUE_KEY__` / `__APPVUE_SECRET__` placeholders
    so a non-AppVue build leaves no recognizable token in shipped binaries.
    When the SDK is enabled we substitute the user's values; otherwise we
    delete the entire <meta-data .../> element (Android) or <key>/<string>
    pair (iOS) so the SDK's runtime lookup returns null and skips init.
    """
    manifest = flutter_path / "android/app/src/main/AndroidManifest.xml"
    plist = flutter_path / "ios/Runner/Info.plist"

    if appvue_cfg:
        key = appvue_cfg.get("key", "")
        secret = appvue_cfg.get("secret", "")
        if manifest.exists():
            text = manifest.read_text(encoding="utf-8")
            text = text.replace("__APPVUE_KEY__", str(key))
            text = text.replace("__APPVUE_SECRET__", str(secret))
            manifest.write_text(text, encoding="utf-8")
        if plist.exists():
            text = plist.read_text(encoding="utf-8")
            text = text.replace("__APPVUE_KEY__", str(key))
            text = text.replace("__APPVUE_SECRET__", str(secret))
            plist.write_text(text, encoding="utf-8")
        return

    # Disabled — strip placeholder entries entirely.
    if manifest.exists():
        text = manifest.read_text(encoding="utf-8")
        text = _APPVUE_MANIFEST_KEY_RE.sub("", text)
        text = _APPVUE_MANIFEST_SECRET_RE.sub("", text)
        manifest.write_text(text, encoding="utf-8")
    if plist.exists():
        text = plist.read_text(encoding="utf-8")
        text = _APPVUE_PLIST_KEY_RE.sub("", text)
        text = _APPVUE_PLIST_SECRET_RE.sub("", text)
        plist.write_text(text, encoding="utf-8")


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


def _materialize_firebase_files(
    flutter_path: Path,
    sdk_configs: dict[str, dict[str, Any]],
) -> dict[str, dict[str, Any]]:
    """Write Firebase google-services config files to the Flutter project.

    Returns a deep copy of sdk_configs with the base64 fields stripped from
    the firebase entry so they don't end up in the generated Dart constant.
    If the firebase entry is absent or has no file payloads, the input is
    returned unchanged (still as a deep copy for safety).
    """
    sanitized = copy.deepcopy(sdk_configs)
    firebase_cfg = sanitized.get("firebase")
    if not isinstance(firebase_cfg, dict):
        return sanitized

    android_b64 = firebase_cfg.get("androidGoogleServicesJson")
    if isinstance(android_b64, str) and android_b64.strip():
        raw = _decode_b64_field("androidGoogleServicesJson", android_b64)
        try:
            json.loads(raw.decode("utf-8"))
        except (UnicodeDecodeError, json.JSONDecodeError) as e:
            raise FirebaseInjectionError(
                f"androidGoogleServicesJson is not valid UTF-8 JSON: {e}"
            ) from e
        dst = flutter_path / "android/app/google-services.json"
        dst.parent.mkdir(parents=True, exist_ok=True)
        dst.write_bytes(raw)
        firebase_cfg.pop("androidGoogleServicesJson", None)

    ios_b64 = firebase_cfg.get("iosGoogleServiceInfoPlist")
    if isinstance(ios_b64, str) and ios_b64.strip():
        raw = _decode_b64_field("iosGoogleServiceInfoPlist", ios_b64)
        # Plist is either XML (starts with <?xml or <!DOCTYPE plist) or binary
        # (bplist00 magic). Reject anything else as obviously malformed.
        head = raw[:8].lstrip()
        if not (head.startswith(b"<?xml") or head.startswith(b"<!DOCT")
                or raw.startswith(b"bplist")):
            raise FirebaseInjectionError(
                "iosGoogleServiceInfoPlist does not look like a plist (xml or bplist)"
            )
        dst = flutter_path / "ios/Runner/GoogleService-Info.plist"
        dst.parent.mkdir(parents=True, exist_ok=True)
        dst.write_bytes(raw)
        firebase_cfg.pop("iosGoogleServiceInfoPlist", None)

    return sanitized


def _decode_b64_field(field_name: str, value: str) -> bytes:
    try:
        return base64.b64decode(value, validate=True)
    except (binascii.Error, ValueError) as e:
        raise FirebaseInjectionError(
            f"{field_name} is not valid base64: {e}"
        ) from e


def apply_electron(
    electron_dir: str | Path,
    custom_js: str | None,
    sdk_configs: dict[str, dict[str, Any]],
) -> None:
    """Replace placeholders in electron-wrapper/main.js with the custom JS + SDK config."""
    electron_path = Path(electron_dir)
    main_js = electron_path / "main.js"
    text = main_js.read_text(encoding="utf-8")

    replacements = {
        ELECTRON_CUSTOM_JS_PLACEHOLDER: _js_safe_literal(json.dumps(custom_js or "")),
        ELECTRON_SDK_CONFIGS_PLACEHOLDER: _js_safe_literal(
            json.dumps(sdk_configs, ensure_ascii=False)
        ),
    }

    # Single-pass replacement: the substituted text is never re-scanned, so
    # user-supplied JS that happens to contain a placeholder string cannot
    # corrupt later passes.
    def _sub(match: re.Match[str]) -> str:
        return replacements[match.group(2)]

    text = _ELECTRON_PLACEHOLDER_RE.sub(_sub, text)
    main_js.write_text(text, encoding="utf-8")


def _render_dart_config(
    custom_js: str | None,
    sdk_configs: dict[str, dict[str, Any]],
) -> str:
    """Produce a Dart source file exposing `customJs`, `sdkConfigsJson`, and `proxyConfigJson`.

    `proxyConfigJson` is the pre-normalized proxy config blob (already an
    object, not raw textarea content) when the proxy SDK is enabled. The
    Dart runtime decodes this directly without re-parsing user input.
    Empty string means the proxy SDK was not enabled.
    """
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


def _dart_string_literal(value: str) -> str:
    """Encode a string as a Dart double-quoted literal with $-escapes."""
    escaped = (
        value
        .replace("\\", "\\\\")
        .replace('"', '\\"')
        .replace("\r", "\\r")
        .replace("\n", "\\n")
        .replace("\t", "\\t")
        .replace("$", "\\$")
    )
    return f'"{escaped}"'


def _js_safe_literal(json_text: str) -> str:
    """Make json.dumps output safe to embed inline in JavaScript source.

    JSON strings allow raw U+2028 / U+2029, but those are JS line terminators
    that would break any `const X = "..."` containing them. Escape them.
    """
    return json_text.replace(chr(0x2028), "\\u2028").replace(chr(0x2029), "\\u2029")


# parents[2] of backend/app/services/sdk_injector.py == backend/, so the
# default vendor tree lives at backend/vendor/singbox/.
DEFAULT_SINGBOX_VENDOR_DIR = Path(__file__).resolve().parents[2] / "vendor" / "singbox"


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
