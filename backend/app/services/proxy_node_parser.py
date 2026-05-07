"""Single-source-of-truth parser for proxy node inputs.

Accepts three input forms (all per-line in the user's textarea):
  - SS URI:           ss://BASE64(method:password)@host:port[#name]
  - Strict JSON:      {"name": ..., "type": "ss", "server": ..., ...}
  - Clash YAML inline {name: 'x', type: ss, server: ..., port: ..., ...}

Output is always a ProxyNode dataclass instance.
"""
from __future__ import annotations

import base64
import binascii
# `json` and `yaml` are imported now and used by parse_node_line / validate_node_dict
# in a follow-up task; left here so the module's import surface is stable.
import json
from dataclasses import dataclass, asdict
from typing import Any
from urllib.parse import unquote, urlparse

import yaml


SS_CIPHERS = frozenset(
    {
        "aes-128-gcm",
        "aes-192-gcm",
        "aes-256-gcm",
        "chacha20-ietf-poly1305",
        "xchacha20-ietf-poly1305",
        "2022-blake3-aes-128-gcm",
        "2022-blake3-aes-256-gcm",
        "2022-blake3-chacha20-poly1305",
    }
)

ALLOWED_TYPES = frozenset({"ss"})


class ProxyNodeError(ValueError):
    """Raised when proxy node input cannot be parsed or fails validation."""


@dataclass
class ProxyNode:
    name: str
    type: str
    server: str
    port: int
    cipher: str
    password: str
    udp: bool = False

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


def _decode_b64_lenient(data: str) -> bytes:
    """Decode base64 userinfo from an SS URI.

    SS URIs nominally use url-safe base64 (no `+` or `/`), but some clients
    emit standard base64. We pick the alphabet by inspecting the input rather
    than blindly retrying — `urlsafe_b64decode` will silently mis-decode
    `+` and `/` if used as the first attempt.
    """
    s = data.strip()
    s_padded = s + "=" * (-len(s) % 4)
    has_std_chars = "+" in s or "/" in s
    decoder = base64.b64decode if has_std_chars else base64.urlsafe_b64decode
    try:
        return decoder(s_padded)
    except (binascii.Error, ValueError) as e:
        raise ProxyNodeError(f"invalid base64 in SS URI: {e}") from e


def _validate(node: ProxyNode) -> ProxyNode:
    """Validate a ProxyNode in place. Mutates `node.name` to a sensible
    default (`"server:port"`) when empty. Returns the same instance.
    """
    if node.type not in ALLOWED_TYPES:
        raise ProxyNodeError(f"unsupported type {node.type!r} (only 'ss' is supported)")
    if not node.server:
        raise ProxyNodeError("server is empty")
    if not (1 <= node.port <= 65535):
        raise ProxyNodeError(f"port {node.port} out of range 1..65535")
    if node.cipher not in SS_CIPHERS:
        raise ProxyNodeError(
            f"cipher {node.cipher!r} is not in the supported list"
        )
    if not node.password:
        raise ProxyNodeError("password is empty")
    if not node.name:
        node.name = f"{node.server}:{node.port}"
    return node


def parse_ss_uri(uri: str) -> ProxyNode:
    """Parse `ss://BASE64(method:password)@host:port[#name]`."""
    if not uri.startswith("ss://"):
        raise ProxyNodeError(f"expected ss:// scheme, got: {uri[:16]!r}")
    parsed = urlparse(uri)
    if parsed.scheme != "ss":
        raise ProxyNodeError(f"expected ss scheme, got {parsed.scheme!r}")

    userinfo = parsed.username
    if userinfo is None:
        raise ProxyNodeError("SS URI missing userinfo")
    decoded = _decode_b64_lenient(userinfo).decode("utf-8", errors="replace")
    if ":" not in decoded:
        raise ProxyNodeError("SS URI userinfo must decode to method:password")
    cipher, password = decoded.split(":", 1)

    host = parsed.hostname or ""
    try:
        port = parsed.port or 0
    except ValueError as e:
        raise ProxyNodeError(f"invalid port in SS URI: {e}") from e
    if parsed.path and parsed.path != "/":
        raise ProxyNodeError(
            f"unexpected path in SS URI: {parsed.path!r}"
        )
    fragment = unquote(parsed.fragment) if parsed.fragment else ""

    return _validate(
        ProxyNode(
            name=fragment,
            type="ss",
            server=host,
            port=port,
            cipher=cipher,
            password=password,
            udp=False,
        )
    )


# parse_node_line, validate_node_dict, parse_clash_inline added in later tasks.
