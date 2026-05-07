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
