import base64
import json
import os
from pathlib import Path

import pytest

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


def _gs_json_bytes() -> bytes:
    return json.dumps({
        "project_info": {"project_id": "dummy"},
        "client": [],
    }).encode("utf-8")


def _plist_xml_bytes() -> bytes:
    return (
        b"<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
        b"<!DOCTYPE plist PUBLIC \"-//Apple//DTD PLIST 1.0//EN\" "
        b"\"http://www.apple.com/DTDs/PropertyList-1.0.dtd\">\n"
        b"<plist version=\"1.0\"><dict>"
        b"<key>API_KEY</key><string>dummy</string>"
        b"</dict></plist>\n"
    )


def test_apply_flutter_writes_firebase_files(tmp_path):
    gs_b64 = base64.b64encode(_gs_json_bytes()).decode("ascii")
    plist_b64 = base64.b64encode(_plist_xml_bytes()).decode("ascii")
    sdk_injector.apply_flutter(
        tmp_path,
        None,
        {
            "firebase": {
                "androidGoogleServicesJson": gs_b64,
                "iosGoogleServiceInfoPlist": plist_b64,
            }
        },
    )

    gs_path = tmp_path / "android/app/google-services.json"
    plist_path = tmp_path / "ios/Runner/GoogleService-Info.plist"
    assert gs_path.read_bytes() == _gs_json_bytes()
    assert plist_path.read_bytes() == _plist_xml_bytes()

    # Base64 blobs MUST be stripped from the embedded sdkConfigsJson so the
    # Dart constant stays compact (and the blobs aren't shipped twice).
    out = (tmp_path / "lib/sdk_config.dart").read_text(encoding="utf-8")
    assert "androidGoogleServicesJson" not in out
    assert "iosGoogleServiceInfoPlist" not in out
    # The firebase namespace itself can remain (now empty) — that's fine.


def test_apply_flutter_firebase_only_android(tmp_path):
    gs_b64 = base64.b64encode(_gs_json_bytes()).decode("ascii")
    sdk_injector.apply_flutter(
        tmp_path,
        None,
        {"firebase": {"androidGoogleServicesJson": gs_b64}},
    )
    assert (tmp_path / "android/app/google-services.json").exists()
    assert not (tmp_path / "ios/Runner/GoogleService-Info.plist").exists()


def test_apply_flutter_firebase_invalid_base64_raises(tmp_path):
    with pytest.raises(sdk_injector.FirebaseInjectionError):
        sdk_injector.apply_flutter(
            tmp_path,
            None,
            {"firebase": {"androidGoogleServicesJson": "***not base64***"}},
        )


def test_apply_flutter_firebase_invalid_json_raises(tmp_path):
    not_json = base64.b64encode(b"this is not json").decode("ascii")
    with pytest.raises(sdk_injector.FirebaseInjectionError):
        sdk_injector.apply_flutter(
            tmp_path,
            None,
            {"firebase": {"androidGoogleServicesJson": not_json}},
        )


def test_apply_flutter_firebase_invalid_plist_raises(tmp_path):
    not_plist = base64.b64encode(b"definitely not a plist").decode("ascii")
    with pytest.raises(sdk_injector.FirebaseInjectionError):
        sdk_injector.apply_flutter(
            tmp_path,
            None,
            {"firebase": {"iosGoogleServiceInfoPlist": not_plist}},
        )


def test_apply_flutter_firebase_binary_plist_accepted(tmp_path):
    bplist = b"bplist00" + b"\x00" * 32  # plausible bplist magic
    b64 = base64.b64encode(bplist).decode("ascii")
    sdk_injector.apply_flutter(
        tmp_path,
        None,
        {"firebase": {"iosGoogleServiceInfoPlist": b64}},
    )
    assert (tmp_path / "ios/Runner/GoogleService-Info.plist").read_bytes() == bplist


_APPVUE_MANIFEST_FIXTURE = (
    "<manifest xmlns:android=\"http://schemas.android.com/apk/res/android\">\n"
    "    <application android:label=\"h5_app\">\n"
    "        <meta-data\n"
    "            android:name=\"com.appvue.sdk.KEY\"\n"
    "            android:value=\"__APPVUE_KEY__\" />\n"
    "        <meta-data\n"
    "            android:name=\"com.appvue.sdk.SECRET\"\n"
    "            android:value=\"__APPVUE_SECRET__\" />\n"
    "    </application>\n"
    "</manifest>\n"
)

_APPVUE_PLIST_FIXTURE = (
    "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
    "<plist version=\"1.0\">\n"
    "<dict>\n"
    "\t<key>CFBundleName</key>\n"
    "\t<string>Runner</string>\n"
    "\t<key>AppVueKey</key>\n"
    "\t<string>__APPVUE_KEY__</string>\n"
    "\t<key>AppVueSecret</key>\n"
    "\t<string>__APPVUE_SECRET__</string>\n"
    "\t<key>CFBundleVersion</key>\n"
    "\t<string>1</string>\n"
    "</dict>\n"
    "</plist>\n"
)


def _seed_appvue_fixtures(tmp_path):
    manifest = tmp_path / "android/app/src/main/AndroidManifest.xml"
    plist = tmp_path / "ios/Runner/Info.plist"
    manifest.parent.mkdir(parents=True, exist_ok=True)
    plist.parent.mkdir(parents=True, exist_ok=True)
    manifest.write_text(_APPVUE_MANIFEST_FIXTURE, encoding="utf-8")
    plist.write_text(_APPVUE_PLIST_FIXTURE, encoding="utf-8")
    return manifest, plist


def test_apply_flutter_appvue_substitutes_key_and_secret(tmp_path):
    manifest, plist = _seed_appvue_fixtures(tmp_path)
    sdk_injector.apply_flutter(
        tmp_path,
        None,
        {"appvue": {"key": "K-abc-123", "secret": "S-xyz-789"}},
    )
    m = manifest.read_text(encoding="utf-8")
    assert "K-abc-123" in m and "S-xyz-789" in m
    assert "__APPVUE_KEY__" not in m and "__APPVUE_SECRET__" not in m

    p = plist.read_text(encoding="utf-8")
    assert "<string>K-abc-123</string>" in p
    assert "<string>S-xyz-789</string>" in p
    assert "__APPVUE_KEY__" not in p and "__APPVUE_SECRET__" not in p


def test_apply_flutter_appvue_disabled_strips_manifest_metadata(tmp_path):
    manifest, _ = _seed_appvue_fixtures(tmp_path)
    sdk_injector.apply_flutter(tmp_path, None, {})
    m = manifest.read_text(encoding="utf-8")
    # Both meta-data blocks should be gone — placeholders must not leak into shipped APKs.
    assert "com.appvue.sdk.KEY" not in m
    assert "com.appvue.sdk.SECRET" not in m
    assert "__APPVUE_KEY__" not in m
    assert "__APPVUE_SECRET__" not in m
    # Other application children remain intact.
    assert "<application" in m and "</application>" in m


def test_apply_flutter_appvue_disabled_strips_plist_entries(tmp_path):
    _, plist = _seed_appvue_fixtures(tmp_path)
    sdk_injector.apply_flutter(tmp_path, None, {})
    p = plist.read_text(encoding="utf-8")
    assert "AppVueKey" not in p
    assert "AppVueSecret" not in p
    assert "__APPVUE_KEY__" not in p
    assert "__APPVUE_SECRET__" not in p
    # Unrelated keys preserved.
    assert "<key>CFBundleName</key>" in p
    assert "<key>CFBundleVersion</key>" in p


def test_apply_flutter_appvue_missing_native_files_is_safe(tmp_path):
    # No manifest / plist on disk — injector must not crash on a non-AppVue,
    # non-Android-shaped tmp dir (matches the simpler test_apply_flutter_* cases above).
    sdk_injector.apply_flutter(
        tmp_path,
        None,
        {"appvue": {"key": "K", "secret": "S"}},
    )
    # No assertion needed — call shouldn't raise.


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


def test_render_la51_snippet_missing_maskid_raises_helpful_error():
    """Defends against callers that bypass sdk_catalog.validate_sdk_configs.
    A bare KeyError would surface deep in the Celery worker traceback; the
    explicit ValueError points back at the contract violation."""
    with pytest.raises(ValueError, match="maskId"):
        sdk_injector._render_la51_snippet({})
    with pytest.raises(ValueError, match="maskId"):
        sdk_injector._render_la51_snippet({"maskId": ""})
    with pytest.raises(ValueError, match="maskId"):
        sdk_injector._render_la51_snippet({"maskId": None})


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


def test_apply_electron_la51_disabled_noop(tmp_path):
    main_js = tmp_path / "main.js"
    main_js.write_text(
        "const CUSTOM_JS = '__CUSTOM_JS__';\n"
        "const SDK_CONFIGS = '__SDK_CONFIGS__';\n",
        encoding="utf-8",
    )
    sdk_injector.apply_electron(tmp_path, "var x = 1;", {})
    out = main_js.read_text(encoding="utf-8")
    assert "51.la" not in out
    assert "LA.init" not in out
    assert "var x = 1;" in out
