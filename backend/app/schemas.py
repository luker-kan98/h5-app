from datetime import datetime
from typing import Optional
from pydantic import BaseModel, Field


# Auth
class RegisterRequest(BaseModel):
    username: str = Field(..., min_length=3, max_length=64)
    password: str = Field(..., min_length=8)


class LoginRequest(BaseModel):
    username: str = Field(..., min_length=1)
    password: str = Field(..., min_length=1)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


# Build
class BuildSubmitResponse(BaseModel):
    task_id: str
    request_id: str
    task_ids: list[str]
    queue_state: str
    estimated_wait_seconds: int = 0


class PlatformStatus(BaseModel):
    status: str  # pending/running/done/failed
    download_url: Optional[str] = None
    error: Optional[str] = None


class BuildStatusResponse(BaseModel):
    task_id: str
    request_id: Optional[str] = None
    status: str
    h5_url: str
    created_at: datetime
    queue_state: Optional[str] = None
    estimated_wait_seconds: int = 0
    platforms: dict[str, PlatformStatus]


class HistoryItem(BaseModel):
    task_id: str
    request_id: Optional[str] = None
    status: str
    h5_url: str
    created_at: datetime
    requested_platforms: list[str]
