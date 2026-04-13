from datetime import datetime, timezone
from sqlalchemy import Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from app.database import Base


class BuildJob(Base):
    __tablename__ = "build_jobs"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    task_id: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), nullable=False)
    h5_url: Mapped[str] = mapped_column(String, nullable=False)
    status: Mapped[str] = mapped_column(String, default="pending")  # pending/running/done/failed
    requested_platforms: Mapped[str] = mapped_column(String, nullable=False)  # JSON list
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc)
    )
    finished_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    # Per-platform results
    android_path: Mapped[str | None] = mapped_column(String, nullable=True)
    android_error: Mapped[str | None] = mapped_column(String, nullable=True)
    ios_path: Mapped[str | None] = mapped_column(String, nullable=True)
    ios_error: Mapped[str | None] = mapped_column(String, nullable=True)
    macos_path: Mapped[str | None] = mapped_column(String, nullable=True)
    macos_error: Mapped[str | None] = mapped_column(String, nullable=True)
    windows_path: Mapped[str | None] = mapped_column(String, nullable=True)
    windows_error: Mapped[str | None] = mapped_column(String, nullable=True)
