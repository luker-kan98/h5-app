from datetime import datetime, timezone

from sqlalchemy import DateTime, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class BuildRequest(Base):
    __tablename__ = "build_requests"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    request_id: Mapped[str] = mapped_column(String, unique=True, nullable=False, index=True)
    h5_url: Mapped[str] = mapped_column(String, nullable=False)
    app_name: Mapped[str] = mapped_column(String, nullable=False, default="H5 App")
    requested_platforms: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String, default="submitted", nullable=False, index=True)
    priority: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    android_package_name: Mapped[str | None] = mapped_column(String, nullable=True)
    icon_path: Mapped[str | None] = mapped_column(String, nullable=True)
    keystore_path: Mapped[str | None] = mapped_column(String, nullable=True)
    keystore_password: Mapped[str | None] = mapped_column(String, nullable=True)
    key_alias: Mapped[str | None] = mapped_column(String, nullable=True)
    key_password: Mapped[str | None] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False
    )
    finished_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

