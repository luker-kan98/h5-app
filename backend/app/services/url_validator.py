import ipaddress
import urllib.parse
from typing import Optional

from app.i18n import t


class UrlValidationError(ValueError):
    pass


_PRIVATE_NETWORKS = [
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.168.0.0/16"),
    ipaddress.ip_network("127.0.0.0/8"),
    ipaddress.ip_network("::1/128"),
    ipaddress.ip_network("fc00::/7"),
]


def validate_h5_url(url: str, language: Optional[str] = None) -> None:
    """Validate that url is a safe, public HTTP(S) URL. Raises UrlValidationError on failure."""
    if not url:
        raise UrlValidationError(t("url_empty", language))

    parsed = urllib.parse.urlparse(url)

    if parsed.scheme not in ("http", "https"):
        raise UrlValidationError(t("url_invalid_scheme", language, scheme=parsed.scheme))

    hostname = parsed.hostname
    if not hostname:
        raise UrlValidationError(t("url_invalid_hostname", language))

    if hostname.lower() in ("localhost", "localhost.localdomain"):
        raise UrlValidationError(t("url_internal_address", language))

    try:
        addr = ipaddress.ip_address(hostname)
    except ValueError:
        addr = None  # hostname is a domain name, not an IP — allowed

    if addr is not None:
        if addr.is_private or addr.is_loopback or addr.is_link_local:
            raise UrlValidationError(t("url_internal_address", language))
        for network in _PRIVATE_NETWORKS:
            if addr in network:
                raise UrlValidationError(t("url_internal_address", language))
