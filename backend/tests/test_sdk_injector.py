import json
import os
from pathlib import Path

from app.services import sdk_injector


def test_apply_flutter_writes_default_when_empty(tmp_path):
    sdk_injector.apply_flutter(tmp_path, None, {})
    out = (tmp_path / "lib/sdk_config.dart").read_text(encoding="utf-8")
    assert 'const String customJs = "";' in out
    assert 'const String sdkConfigsJson = "{}";' in out


def test_apply_flutter_escapes_dart_special_chars(tmp_path):
    snippet = 'console.log("hello"); var x = "$y";\nconsole.log(x);\t'
    sdk_injector.apply_flutter(tmp_path, snippet, {"sentry": {"dsn": "https://x@y/1"}})
    out = (tmp_path / "lib/sdk_config.dart").read_text(encoding="utf-8")
    # No raw double quotes survive inside the string literal — they are escaped.
    # Also no raw $ that would trigger Dart string interpolation.
    assert '\\"' in out
    assert '\\$y' in out
    # SDK config is embedded as a JSON-encoded string literal, so it must include
    # an escaped quote pair around dsn.
    assert '\\"sentry\\"' in out
    assert '\\"dsn\\"' in out


def test_apply_electron_replaces_placeholders(tmp_path):
    main_js = tmp_path / "main.js"
    main_js.write_text(
        "const X = '__H5_URL__';\n"
        "const CUSTOM_JS = '__CUSTOM_JS__';\n"
        "const SDK_CONFIGS = '__SDK_CONFIGS__';\n",
        encoding="utf-8",
    )
    sdk_injector.apply_electron(
        tmp_path,
        "console.log(\"hi\")",
        {"sentry": {"dsn": "https://x@y/1"}},
    )
    out = main_js.read_text(encoding="utf-8")
    # Custom JS is JSON-encoded as a string literal (replacing the surrounding quotes)
    assert "const CUSTOM_JS = \"console.log(\\\"hi\\\")\";" in out
    # SDK config replaces the surrounding quotes with a JSON object literal.
    assert "const SDK_CONFIGS = {\"sentry\": {\"dsn\": \"https://x@y/1\"}};" in out
    # H5_URL placeholder is left for the existing pipeline step to handle.
    assert "'__H5_URL__'" in out


def test_apply_electron_handles_empty_inputs(tmp_path):
    main_js = tmp_path / "main.js"
    main_js.write_text(
        "const CUSTOM_JS = '__CUSTOM_JS__';\n"
        "const SDK_CONFIGS = '__SDK_CONFIGS__';\n",
        encoding="utf-8",
    )
    sdk_injector.apply_electron(tmp_path, None, {})
    out = main_js.read_text(encoding="utf-8")
    assert "const CUSTOM_JS = \"\";" in out
    assert "const SDK_CONFIGS = {};" in out


def test_apply_electron_user_js_with_placeholder_string_is_not_re_replaced(tmp_path):
    """User JS containing the literal placeholder string must not be re-replaced
    in the same pass — single-pass regex replacement guarantees this."""
    main_js = tmp_path / "main.js"
    main_js.write_text(
        "const CUSTOM_JS = '__CUSTOM_JS__';\n"
        "const SDK_CONFIGS = '__SDK_CONFIGS__';\n",
        encoding="utf-8",
    )
    user_js = "const sentinel = '__SDK_CONFIGS__';"
    sdk_injector.apply_electron(tmp_path, user_js, {"sentry": {"dsn": "https://x@y/1"}})
    out = main_js.read_text(encoding="utf-8")
    # The user's literal '__SDK_CONFIGS__' survives intact inside the CUSTOM_JS literal.
    assert "const sentinel = '__SDK_CONFIGS__';" in out
    # And the real SDK_CONFIGS placeholder was still replaced with the JSON object.
    assert '"sentry": {"dsn": "https://x@y/1"}' in out


def test_apply_electron_escapes_unicode_line_terminators(tmp_path):
    main_js = tmp_path / "main.js"
    main_js.write_text(
        "const CUSTOM_JS = '__CUSTOM_JS__';\n"
        "const SDK_CONFIGS = '__SDK_CONFIGS__';\n",
        encoding="utf-8",
    )
    # U+2028 / U+2029 are valid in JSON strings but JS line terminators —
    # would break `const X = "..."` if not escaped.
    user_js = "var a = 1;" + chr(0x2028) + "var b = 2;"
    sdk_injector.apply_electron(
        tmp_path,
        user_js,
        {"sentry": {"dsn": "x" + chr(0x2029) + "y"}},
    )
    out = main_js.read_text(encoding="utf-8")
    assert chr(0x2028) not in out
    assert chr(0x2029) not in out
    assert "\\u2028" in out
    assert "\\u2029" in out
