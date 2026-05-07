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
