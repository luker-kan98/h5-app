from datetime import datetime, timezone

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class BuildTask(Base):
    __tablename__ = "build_tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    task_id: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
    request_id: Mapped[int] = mapped_column(Integer, ForeignKey("build_requests.id"), nullable=False, index=True)
    platform: Mapped[str] = mapped_column(String, nullable=False, index=True)
    status: Mapped[str] = mapped_column(String, default="submitted", nullable=False, index=True)
    priority: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    queue_name: Mapped[str | None] = mapped_column(String, nullable=True)
    celery_task_id: Mapped[str | None] = mapped_column(String, nullable=True, index=True)
    attempt: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    resource_profile: Mapped[str] = mapped_column(String, nullable=False)
    admission_token: Mapped[str | None] = mapped_column(String, nullable=True)
    wait_started_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    queued_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    started_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    finished_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    artifact_path: Mapped[str | None] = mapped_column(String, nullable=True)
    artifact_s3_key: Mapped[str | None] = mapped_column(String, nullable=True)
    artifact_url: Mapped[str | None] = mapped_column(String, nullable=True)
    log_path: Mapped[str | None] = mapped_column(String, nullable=True)
    failure_code: Mapped[str | None] = mapped_column(String, nullable=True)
    failure_message: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
