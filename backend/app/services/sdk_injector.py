"""Inject SDK config + custom JS into a copied Flutter / Electron wrapper at build time."""
from __future__ import annotations

import json
import os
import re
import shutil
from pathlib import Path
from typing import Any


SDK_CONFIG_GENERATED_DART = "lib/sdk_config.dart"
ELECTRON_CUSTOM_JS_PLACEHOLDER = "__CUSTOM_JS__"
ELECTRON_SDK_CONFIGS_PLACEHOLDER = "__SDK_CONFIGS__"

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

    The wrapper's main.dart reads from this file; missing values default to safe no-ops.
    """
    flutter_path = Path(flutter_dir)
    target = flutter_path / SDK_CONFIG_GENERATED_DART
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(_render_dart_config(custom_js, sdk_configs), encoding="utf-8")


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
