import pytest
from app.services.url_validator import validate_h5_url, UrlValidationError


def test_valid_https_url():
    validate_h5_url("https://example.com")  # should not raise


def test_valid_http_url():
    validate_h5_url("http://example.com/path?q=1")  # should not raise


def test_rejects_non_http_scheme():
    with pytest.raises(UrlValidationError, match="scheme"):
        validate_h5_url("ftp://example.com")


def test_rejects_file_scheme():
    with pytest.raises(UrlValidationError):
        validate_h5_url("file:///etc/passwd")


def test_rejects_localhost():
    with pytest.raises(UrlValidationError, match="internal"):
        validate_h5_url("http://localhost/app")


def test_rejects_127_0_0_1():
    with pytest.raises(UrlValidationError, match="internal"):
        validate_h5_url("http://127.0.0.1:8080/")


def test_rejects_private_192():
    with pytest.raises(UrlValidationError, match="internal"):
        validate_h5_url("http://192.168.1.1/")


def test_rejects_private_10():
    with pytest.raises(UrlValidationError, match="internal"):
        validate_h5_url("http://10.0.0.1/")


def test_rejects_private_172():
    with pytest.raises(UrlValidationError, match="internal"):
        validate_h5_url("http://172.16.0.1/")


def test_rejects_empty_string():
    with pytest.raises(UrlValidationError):
        validate_h5_url("")
