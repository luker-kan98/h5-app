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


def test_parse_ss_uri_rejects_extra_path():
    import base64
    payload = base64.b64encode(b"aes-256-gcm:pw").decode().rstrip("=")
    with pytest.raises(ProxyNodeError):
        parse_ss_uri(f"ss://{payload}@example.com:8388/extra")


def test_parse_ss_uri_rejects_empty_userinfo():
    with pytest.raises(ProxyNodeError):
        parse_ss_uri("ss://@example.com:8388")


def test_parse_ss_uri_rejects_missing_port():
    import base64
    payload = base64.b64encode(b"aes-256-gcm:pw").decode().rstrip("=")
    with pytest.raises(ProxyNodeError):
        parse_ss_uri(f"ss://{payload}@example.com")


def test_decode_b64_lenient_handles_standard_alphabet_with_plus():
    """Test the standard-base64 path is correctly used when '+' or '/' present."""
    import base64
    from app.services.proxy_node_parser import _decode_b64_lenient
    # Force a payload that, when standard-base64-encoded, contains '+' or '/'
    # by picking bytes that map to those characters.
    raw = b"\xff\xff\xfe"  # standard b64 = "//"+"++" pattern variant; use bytes that yield '+' specifically:
    encoded = base64.b64encode(b"\xfb").decode()  # "+w==" — starts with '+'
    decoded = _decode_b64_lenient(encoded)
    assert decoded == b"\xfb"


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
