import os
import shutil
import socket
from dataclasses import dataclass

try:
    import psutil
except ImportError:  # pragma: no cover - exercised only when dependency is unavailable.
    psutil = None

from sqlalchemy.orm import Session

from app.models.build_task import BuildTask
from app.models.host_resource_sample import HostResourceSample


DEFAULT_MONITOR_PATH = os.getenv("HOST_MONITOR_PATH", os.getenv("BUILDS_DIR", "./builds"))


@dataclass(frozen=True)
class HostMetrics:
    host_name: str
    cpu_percent: float
    load_1m: float
    memory_used_bytes: int
    memory_available_bytes: int
    swap_used_bytes: int
    disk_free_bytes: int
    active_task_count: int
    waiting_task_count: int


def collect_host_metrics(db: Session, monitor_path: str = DEFAULT_MONITOR_PATH) -> HostMetrics:
    os.makedirs(monitor_path, exist_ok=True)

    if psutil is not None:
        cpu_percent = float(psutil.cpu_percent(interval=None))
        memory = psutil.virtual_memory()
        swap = psutil.swap_memory()
        memory_used_bytes = int(memory.used)
        memory_available_bytes = int(memory.available)
        swap_used_bytes = int(swap.used)
    else:
        cpu_percent = 0.0
        memory_used_bytes = 0
        memory_available_bytes = 0
        swap_used_bytes = 0

    try:
        load_1m = float(os.getloadavg()[0])
    except (AttributeError, OSError):
        load_1m = 0.0

    disk = shutil.disk_usage(monitor_path)
    active_count = (
        db.query(BuildTask)
        .filter(BuildTask.status.in_(["queued", "running", "uploading"]))
        .count()
    )
    waiting_count = (
        db.query(BuildTask)
        .filter(BuildTask.status.in_(["submitted", "waiting_capacity"]))
        .count()
    )

    return HostMetrics(
        host_name=socket.gethostname(),
        cpu_percent=cpu_percent,
        load_1m=load_1m,
        memory_used_bytes=memory_used_bytes,
        memory_available_bytes=memory_available_bytes,
        swap_used_bytes=swap_used_bytes,
        disk_free_bytes=int(disk.free),
        active_task_count=active_count,
        waiting_task_count=waiting_count,
    )


def persist_host_metrics(db: Session, metrics: HostMetrics) -> HostResourceSample:
    sample = HostResourceSample(
        host_name=metrics.host_name,
        cpu_percent=metrics.cpu_percent,
        load_1m=metrics.load_1m,
        memory_used_bytes=metrics.memory_used_bytes,
        memory_available_bytes=metrics.memory_available_bytes,
        swap_used_bytes=metrics.swap_used_bytes,
        disk_free_bytes=metrics.disk_free_bytes,
        active_task_count=metrics.active_task_count,
        waiting_task_count=metrics.waiting_task_count,
    )
    db.add(sample)
    db.commit()
    db.refresh(sample)
    return sample

