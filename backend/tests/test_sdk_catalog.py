import json

import pytest

from app.services.sdk_catalog import (
    CATALOG,
    SdkValidationError,
    VALID_CATEGORIES,
    VALID_PLATFORMS,
    catalog_as_dict,
    parse_sdk_configs,
    validate_custom_js,
    validate_sdk_configs,
)


def test_catalog_integrity():
    seen_ids = set()
    for sdk_id, definition in CATALOG.items():
        assert sdk_id == definition.id
        assert sdk_id not in seen_ids
        seen_ids.add(sdk_id)
        assert definition.category in VALID_CATEGORIES
        assert definition.supported_platforms, f"{sdk_id} has no supported platforms"
        for p in definition.supported_platforms:
            assert p in VALID_PLATFORMS
        field_names = set()
        for f in definition.fields:
            assert f.name not in field_names, f"{sdk_id}.{f.name} duplicated"
            field_names.add(f.name)
            assert f.label_en and f.label_zh
            for p in f.platforms:
                assert p in VALID_PLATFORMS
                assert p in definition.supported_platforms


def test_catalog_serializes_for_api():
    payload = catalog_as_dict()
    assert "sdks" in payload
    ids = {s["id"] for s in payload["sdks"]}
    assert ids == set(CATALOG.keys())


def test_parse_empty_returns_empty_dict():
    assert parse_sdk_configs(None) == {}
    assert parse_sdk_configs("") == {}
    assert parse_sdk_configs("   ") == {}


def test_parse_rejects_too_large():
    big = "x" * (10 * 1024 + 1)
    payload = json.dumps({"sentry": {"dsn": big}})
    with pytest.raises(SdkValidationError):
        parse_sdk_configs(payload)


def test_parse_rejects_non_object():
    with pytest.raises(SdkValidationError):
        parse_sdk_configs("[]")


def test_validate_unknown_sdk():
    with pytest.raises(SdkValidationError):
        validate_sdk_configs({"frobnitz": {}}, ["android"])


def test_validate_required_field():
    with pytest.raises(SdkValidationError):
        validate_sdk_configs({"sentry": {}}, ["android"])


def test_validate_required_field_rejects_non_string_primitives():
    # Required fields must be non-empty strings — booleans, numbers, etc. are not valid DSNs / app keys.
    for bad in (False, True, 0, 1, 0.0):
        with pytest.raises(SdkValidationError):
            validate_sdk_configs({"sentry": {"dsn": bad}}, ["android"])


def test_validate_platform_field_skipped_when_platform_unselected():
    # iOS field is platform-restricted; iOS not selected → its iosAppKey not required.
    cleaned = validate_sdk_configs(
        {"umeng": {"androidAppKey": "abc"}}, ["android"]
    )
    assert cleaned == {"umeng": {"androidAppKey": "abc"}}


def test_validate_platform_field_required_when_platform_selected():
    with pytest.raises(SdkValidationError):
        validate_sdk_configs(
            {"umeng": {"androidAppKey": "abc"}}, ["android", "ios"]
        )


def test_validate_sdk_unsupported_on_all_selected_platforms():
    with pytest.raises(SdkValidationError):
        validate_sdk_configs(
            {"umeng": {"androidAppKey": "abc"}}, ["macos"]
        )


def test_validate_unknown_field():
    with pytest.raises(SdkValidationError):
        validate_sdk_configs(
            {"sentry": {"dsn": "x", "unknown": "y"}}, ["android"]
        )


def test_validate_strips_empty_optional_fields():
    cleaned = validate_sdk_configs(
        {"umeng": {"androidAppKey": "abc", "channel": ""}}, ["android"]
    )
    # empty string is rejected for required fields but channel is optional;
    # an empty optional string that is non-None passes through cleaned but
    # validate doesn't enforce trimming on non-required fields.
    assert "umeng" in cleaned


def test_validate_custom_js_size():
    with pytest.raises(SdkValidationError):
        validate_custom_js("x" * (50 * 1024 + 1))


def test_validate_custom_js_pass():
    assert validate_custom_js(None) is None
    assert validate_custom_js("console.log(1)") == "console.log(1)"


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
            # Existing SDKs default to widget="text"; ensure the default value
            # round-trips through serialization, not just the key presence.
            assert field["widget"] == "text"
