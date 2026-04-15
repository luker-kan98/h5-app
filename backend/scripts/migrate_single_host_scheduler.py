#!/usr/bin/env python3
from __future__ import annotations

import argparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.services.schema_migration import create_engine_for_url, migrate_single_host_scheduler  # noqa: E402


def main() -> int:
    parser = argparse.ArgumentParser(
        description="Migrate legacy build_jobs data into single-host BuildRequest/BuildTask tables.",
    )
    parser.add_argument(
        "--database-url",
        dest="database_url",
        default=None,
        help="Optional SQLAlchemy database URL override. Defaults to DATABASE_URL env/app.database.",
    )
    args = parser.parse_args()

    engine = create_engine_for_url(args.database_url) if args.database_url else None
    summary = migrate_single_host_scheduler(engine=engine)

    print(f"created_requests={summary.created_requests}")
    print(f"created_tasks={summary.created_tasks}")
    print(f"reused_requests={summary.reused_requests}")
    print(f"reused_tasks={summary.reused_tasks}")
    print(f"migration_recorded={str(summary.migration_recorded).lower()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
