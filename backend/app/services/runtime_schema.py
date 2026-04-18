from __future__ import annotations

from sqlalchemy import inspect, text
from sqlalchemy.engine import Engine


def ensure_build_task_artifact_columns(engine: Engine) -> None:
    inspector = inspect(engine)
    if "build_tasks" not in inspector.get_table_names():
        return

    existing_columns = {column["name"] for column in inspector.get_columns("build_tasks")}
    statements: list[str] = []
    if "artifact_s3_key" not in existing_columns:
        statements.append("ALTER TABLE build_tasks ADD COLUMN artifact_s3_key VARCHAR")
    if "artifact_url" not in existing_columns:
        statements.append("ALTER TABLE build_tasks ADD COLUMN artifact_url VARCHAR")

    if not statements:
        return

    with engine.begin() as connection:
        for statement in statements:
            connection.execute(text(statement))
