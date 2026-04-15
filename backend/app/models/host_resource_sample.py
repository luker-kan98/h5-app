from datetime import datetime, timezone

from sqlalchemy import DateTime, Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class HostResourceSample(Base):
    __tablename__ = "host_resource_samples"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    host_name: Mapped[str] = mapped_column(String, nullable=False, index=True)
    sampled_at: Mapped[datetime] = mapped_column(
        DateTime, default=lambda: datetime.now(timezone.utc), nullable=False, index=True
    )
    cpu_percent: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    load_1m: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    memory_used_bytes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    memory_available_bytes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    swap_used_bytes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    disk_free_bytes: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    active_task_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    waiting_task_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
