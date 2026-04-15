import logging
import os
import time

from app.database import SessionLocal
from app.services.build_scheduler import run_scheduler_once


logger = logging.getLogger(__name__)

SCHEDULER_INTERVAL_SECONDS = float(os.getenv("SCHEDULER_INTERVAL_SECONDS", "2"))


def run_scheduler_cycle() -> dict[str, int]:
    db = SessionLocal()
    try:
        return run_scheduler_once(db)
    finally:
        db.close()


def run_scheduler_forever(interval_seconds: float = SCHEDULER_INTERVAL_SECONDS) -> None:
    logging.basicConfig(
        level=os.getenv("SCHEDULER_LOG_LEVEL", "INFO"),
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )
    logger.info("scheduler_daemon_started interval_seconds=%s", interval_seconds)

    while True:
        try:
            result = run_scheduler_cycle()
            logger.info(
                "scheduler_cycle promoted=%s dispatched=%s",
                result.get("promoted", 0),
                result.get("dispatched", 0),
            )
        except Exception:
            logger.exception("scheduler_cycle_failed")
        time.sleep(interval_seconds)
