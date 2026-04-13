import ipaddress
import urllib.parse


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


def validate_h5_url(url: str) -> None:
    """Validate that url is a safe, public HTTP(S) URL. Raises UrlValidationError on failure."""
    if not url:
        raise UrlValidationError("URL must not be empty")

    parsed = urllib.parse.urlparse(url)

    if parsed.scheme not in ("http", "https"):
        raise UrlValidationError(f"URL scheme must be http or https, got '{parsed.scheme}'")

    hostname = parsed.hostname
    if not hostname:
        raise UrlValidationError("URL must have a valid hostname")

    if hostname.lower() in ("localhost", "localhost.localdomain"):
        raise UrlValidationError("URL must not point to an internal address")

    try:
        addr = ipaddress.ip_address(hostname)
    except ValueError:
        addr = None  # hostname is a domain name, not an IP — allowed

    if addr is not None:
        if addr.is_private or addr.is_loopback or addr.is_link_local:
            raise UrlValidationError("URL must not point to an internal address")
        for network in _PRIVATE_NETWORKS:
            if addr in network:
                raise UrlValidationError("URL must not point to an internal address")
