from __future__ import annotations

import mimetypes
import os
from urllib.parse import quote


def _config_value(*names: str) -> str | None:
    for name in names:
        value = os.getenv(name)
        if value:
            return value
    return None


def s3_upload_configured() -> bool:
    return all(
        [
            _config_value("S3_BUCKET_NAME"),
            _config_value("S3_REGION", "AWS_DEFAULT_REGION"),
            _config_value("S3_ACCESS_KEY_ID", "AWS_ACCESS_KEY_ID"),
            _config_value("S3_SECRET_ACCESS_KEY", "AWS_SECRET_ACCESS_KEY"),
        ]
    )


def s3_object_key(task_id: str, filename: str) -> str:
    prefix = os.getenv("S3_UPLOAD_PREFIX", "uploads").strip("/")
    filename = filename.lstrip("/")
    return f"{prefix}/{task_id}/{filename}" if prefix else f"{task_id}/{filename}"


def s3_public_url(object_key: str) -> str:
    public_base = os.getenv("S3_PUBLIC_BASE_URL")
    encoded_key = quote(object_key, safe="/")
    if public_base:
        return f"{public_base.rstrip('/')}/{encoded_key}"

    bucket = _config_value("S3_BUCKET_NAME")
    region = _config_value("S3_REGION", "AWS_DEFAULT_REGION")
    if not bucket or not region:
        raise RuntimeError("S3 public URL requires S3_BUCKET_NAME and S3_REGION")
    return f"https://{bucket}.s3.{region}.amazonaws.com/{encoded_key}"


def upload_build_artifact(file_path: str, task_id: str, filename: str) -> tuple[str, str]:
    if not s3_upload_configured():
        raise RuntimeError(
            "S3 upload is not configured. Set S3_BUCKET_NAME, S3_REGION, "
            "S3_ACCESS_KEY_ID, and S3_SECRET_ACCESS_KEY."
        )

    try:
        import boto3
        from botocore.config import Config
    except ImportError as exc:
        raise RuntimeError("boto3 is required for S3 uploads. Install backend dependencies again.") from exc

    bucket = _config_value("S3_BUCKET_NAME")
    region = _config_value("S3_REGION", "AWS_DEFAULT_REGION")
    access_key = _config_value("S3_ACCESS_KEY_ID", "AWS_ACCESS_KEY_ID")
    secret_key = _config_value("S3_SECRET_ACCESS_KEY", "AWS_SECRET_ACCESS_KEY")
    session_token = _config_value("S3_SESSION_TOKEN", "AWS_SESSION_TOKEN")
    endpoint_url = _config_value("S3_ENDPOINT_URL")
    object_key = s3_object_key(task_id, filename)

    client = boto3.client(
        "s3",
        region_name=region,
        aws_access_key_id=access_key,
        aws_secret_access_key=secret_key,
        aws_session_token=session_token,
        endpoint_url=endpoint_url,
        config=Config(signature_version="s3v4"),
    )

    content_type, _ = mimetypes.guess_type(file_path)
    extra_args: dict[str, str] = {}
    if content_type:
        extra_args["ContentType"] = content_type
    object_acl = _config_value("S3_OBJECT_ACL")
    if object_acl:
        extra_args["ACL"] = object_acl

    upload_kwargs = {"ExtraArgs": extra_args} if extra_args else {}
    client.upload_file(file_path, bucket, object_key, **upload_kwargs)
    return object_key, s3_public_url(object_key)
