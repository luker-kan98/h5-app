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


def ensure_host_sample_bigint_columns(engine: Engine) -> None:
    if engine.dialect.name != "postgresql":
        return
    inspector = inspect(engine)
    if "host_resource_samples" not in inspector.get_table_names():
        return

    byte_columns = (
        "memory_used_bytes",
        "memory_available_bytes",
        "swap_used_bytes",
        "disk_free_bytes",
    )
    with engine.begin() as connection:
        rows = connection.execute(
            text(
                "SELECT column_name, data_type FROM information_schema.columns "
                "WHERE table_name = 'host_resource_samples'"
            )
        ).fetchall()
        current = {name: data_type for name, data_type in rows}
        for column in byte_columns:
            if current.get(column) == "integer":
                connection.execute(
                    text(f"ALTER TABLE host_resource_samples ALTER COLUMN {column} TYPE BIGINT")
                )
