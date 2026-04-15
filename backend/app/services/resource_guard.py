import os
from dataclasses import dataclass

from sqlalchemy.orm import Session

from app.models.build_task import BuildTask
from app.services.host_monitor import HostMetrics

GIB = 1024 ** 3

MAX_INFLIGHT_TASKS = int(os.getenv("MAX_INFLIGHT_TASKS", "50"))
CPU_DISPATCH_HIGH_WATERMARK = float(os.getenv("CPU_DISPATCH_HIGH_WATERMARK", "75"))
MEMORY_DISPATCH_HIGH_WATERMARK = float(os.getenv("MEMORY_DISPATCH_HIGH_WATERMARK", "80"))
SWAP_HIGH_WATERMARK_BYTES = int(float(os.getenv("SWAP_HIGH_WATERMARK_GIB", "2")) * GIB)
MIN_DISK_FREE_BYTES = int(float(os.getenv("MIN_DISK_FREE_GIB", "80")) * GIB)
MAX_ACTIVE_CPU_SLOTS = float(os.getenv("MAX_ACTIVE_CPU_SLOTS", "7.0"))
MAX_ACTIVE_MEMORY_BYTES = int(float(os.getenv("MAX_ACTIVE_MEMORY_GIB", "16")) * GIB)

PLATFORM_RESOURCE_PROFILES = {
    "android": {"cpu_slots": 1.0, "memory_bytes": 2 * GIB, "disk_bytes": 6 * GIB},
    "ios": {"cpu_slots": 2.0, "memory_bytes": 4 * GIB, "disk_bytes": 8 * GIB},
    "macos": {"cpu_slots": 1.5, "memory_bytes": 3 * GIB, "disk_bytes": 6 * GIB},
    "windows": {"cpu_slots": 1.5, "memory_bytes": 3 * GIB, "disk_bytes": 6 * GIB},
}

PLATFORM_ACTIVE_LIMITS = {
    "android": int(os.getenv("MAX_ANDROID_ACTIVE", "4")),
    "ios": int(os.getenv("MAX_IOS_ACTIVE", "3")),
    "macos": int(os.getenv("MAX_MACOS_ACTIVE", "2")),
    "windows": int(os.getenv("MAX_WINDOWS_ACTIVE", "1")),
}


@dataclass(frozen=True)
class AdmissionDecision:
    allowed: bool
    reason: str = "allowed"


def resource_profile_name(platform: str) -> str:
    if platform not in PLATFORM_RESOURCE_PROFILES:
        raise ValueError(f"Unsupported platform: {platform}")
    return platform


def _active_tasks(db: Session) -> list[BuildTask]:
    return (
        db.query(BuildTask)
        .filter(BuildTask.status.in_(["queued", "running", "uploading"]))
        .all()
    )


def _inflight_count(db: Session) -> int:
    return (
        db.query(BuildTask)
        .filter(BuildTask.status.in_(["waiting_capacity", "queued", "running", "uploading"]))
        .count()
    )


def can_enter_waiting_capacity(db: Session) -> AdmissionDecision:
    if _inflight_count(db) >= MAX_INFLIGHT_TASKS:
        return AdmissionDecision(False, "max_inflight_reached")
    return AdmissionDecision(True)


def can_dispatch_task(db: Session, task: BuildTask, metrics: HostMetrics) -> AdmissionDecision:
    if metrics.cpu_percent >= CPU_DISPATCH_HIGH_WATERMARK:
        return AdmissionDecision(False, "cpu_high")

    memory_total = metrics.memory_used_bytes + metrics.memory_available_bytes
    if memory_total > 0:
        memory_used_percent = (metrics.memory_used_bytes / memory_total) * 100
        if memory_used_percent >= MEMORY_DISPATCH_HIGH_WATERMARK:
            return AdmissionDecision(False, "memory_high")

    if metrics.swap_used_bytes >= SWAP_HIGH_WATERMARK_BYTES:
        return AdmissionDecision(False, "swap_high")

    if metrics.disk_free_bytes < MIN_DISK_FREE_BYTES:
        return AdmissionDecision(False, "disk_low")

    profile = PLATFORM_RESOURCE_PROFILES[task.resource_profile]
    if metrics.disk_free_bytes < MIN_DISK_FREE_BYTES + profile["disk_bytes"]:
        return AdmissionDecision(False, "disk_reserved_low")

    active_tasks = _active_tasks(db)
    same_platform = [active for active in active_tasks if active.platform == task.platform]
    platform_limit = PLATFORM_ACTIVE_LIMITS.get(task.platform, 1)
    if len(same_platform) >= platform_limit:
        return AdmissionDecision(False, "platform_limit_reached")

    active_cpu = sum(
        PLATFORM_RESOURCE_PROFILES[active.resource_profile]["cpu_slots"]
        for active in active_tasks
    )
    if active_cpu + profile["cpu_slots"] > MAX_ACTIVE_CPU_SLOTS:
        return AdmissionDecision(False, "cpu_slots_exhausted")

    active_memory = sum(
        PLATFORM_RESOURCE_PROFILES[active.resource_profile]["memory_bytes"]
        for active in active_tasks
    )
    if active_memory + profile["memory_bytes"] > MAX_ACTIVE_MEMORY_BYTES:
        return AdmissionDecision(False, "memory_slots_exhausted")

    return AdmissionDecision(True)
