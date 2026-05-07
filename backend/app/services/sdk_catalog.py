"""SDK catalog: definitions for the third-party SDKs the packager can inject."""
from __future__ import annotations

import json
from dataclasses import asdict, dataclass, field
from typing import Any


VALID_PLATFORMS = {"android", "ios", "macos", "windows"}
VALID_CATEGORIES = {"analytics", "crash", "push"}


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


@dataclass(frozen=True)
class SdkDefinition:
    id: str
    name_en: str
    name_zh: str
    category: str
    supported_platforms: tuple[str, ...]
    fields: tuple[SdkField, ...] = field(default_factory=tuple)


CATALOG: dict[str, SdkDefinition] = {
    "sentry": SdkDefinition(
        id="sentry",
        name_en="Sentry",
        name_zh="Sentry 错误监控",
        category="crash",
        supported_platforms=("android", "ios", "macos", "windows"),
        fields=(
            SdkField(name="dsn", label_en="DSN", label_zh="DSN", secret=True),
        ),
    ),
    "umeng": SdkDefinition(
        id="umeng",
        name_en="Umeng Analytics",
        name_zh="友盟统计",
        category="analytics",
        supported_platforms=("android", "ios"),
        fields=(
            SdkField(
                name="androidAppKey",
                label_en="Android App Key",
                label_zh="Android AppKey",
                secret=True,
                platforms=("android",),
            ),
            SdkField(
                name="iosAppKey",
                label_en="iOS App Key",
                label_zh="iOS AppKey",
                secret=True,
                platforms=("ios",),
            ),
            SdkField(
                name="channel",
                label_en="Channel",
                label_zh="渠道",
                required=False,
            ),
        ),
    ),
    "jpush": SdkDefinition(
        id="jpush",
        name_en="JPush (Aurora Push)",
        name_zh="极光推送",
        category="push",
        supported_platforms=("android", "ios"),
        fields=(
            SdkField(
                name="androidAppKey",
                label_en="Android App Key",
                label_zh="Android AppKey",
                secret=True,
                platforms=("android",),
            ),
            SdkField(
                name="iosAppKey",
                label_en="iOS App Key",
                label_zh="iOS AppKey",
                secret=True,
                platforms=("ios",),
            ),
        ),
    ),
    "firebase": SdkDefinition(
        id="firebase",
        name_en="Firebase Analytics + Crashlytics",
        name_zh="Firebase 统计与崩溃",
        category="analytics",
        supported_platforms=("android", "ios"),
        fields=(
            SdkField(
                name="androidGoogleServicesJson",
                label_en="google-services.json (base64)",
                label_zh="google-services.json (base64)",
                secret=True,
                platforms=("android",),
            ),
            SdkField(
                name="iosGoogleServiceInfoPlist",
                label_en="GoogleService-Info.plist (base64)",
                label_zh="GoogleService-Info.plist (base64)",
                secret=True,
                platforms=("ios",),
            ),
        ),
    ),
}


SDK_CONFIGS_MAX_BYTES = 10 * 1024
CUSTOM_JS_MAX_BYTES = 50 * 1024


class SdkValidationError(ValueError):
    """Raised when an SDK config payload fails validation."""


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


def parse_sdk_configs(raw: str | None) -> dict[str, dict[str, Any]]:
    """Parse the JSON blob from the form. Empty / None returns empty dict."""
    if raw is None or raw.strip() == "":
        return {}
    if len(raw.encode("utf-8")) > SDK_CONFIGS_MAX_BYTES:
        raise SdkValidationError("sdk_configs payload too large (max 10KB)")
    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        raise SdkValidationError(f"sdk_configs is not valid JSON: {e}") from e
    if not isinstance(data, dict):
        raise SdkValidationError("sdk_configs must be a JSON object")
    return data


def validate_custom_js(raw: str | None) -> str | None:
    if raw is None:
        return None
    if len(raw.encode("utf-8")) > CUSTOM_JS_MAX_BYTES:
        raise SdkValidationError("custom_js too large (max 50KB)")
    return raw


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
