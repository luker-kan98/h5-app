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


def drop_user_id_columns(engine: Engine) -> None:
    """Remove the legacy ``users`` table and the ``user_id`` columns that referenced it.

    SQLite cannot drop a column whose FK clause still references another table,
    so we rewrite the affected tables in place: copy rows into a fresh table
    that omits ``user_id`` and the FK, then swap names. PostgreSQL just uses
    ``DROP COLUMN ... CASCADE``.
    """
    inspector = inspect(engine)
    table_names = set(inspector.get_table_names())
    dialect = engine.dialect.name

    targets = [
        table
        for table in ("build_requests", "build_jobs")
        if table in table_names
        and "user_id" in {column["name"] for column in inspector.get_columns(table)}
    ]
    has_users_table = "users" in table_names
    if not targets and not has_users_table:
        return

    if dialect == "sqlite":
        raw_connection = engine.raw_connection()
        try:
            cursor = raw_connection.cursor()
            cursor.execute("PRAGMA foreign_keys=OFF")
            try:
                for table in targets:
                    _sqlite_rebuild_without_user_id(cursor, table)
                if has_users_table:
                    cursor.execute("DROP TABLE IF EXISTS users")
                raw_connection.commit()
            finally:
                cursor.execute("PRAGMA foreign_keys=ON")
                cursor.close()
        finally:
            raw_connection.close()
        return

    with engine.begin() as connection:
        for table in targets:
            connection.execute(text(f"ALTER TABLE {table} DROP COLUMN user_id CASCADE"))
        if has_users_table:
            connection.execute(text("DROP TABLE users CASCADE"))


def _sqlite_rebuild_without_user_id(cursor, table: str) -> None:
    """Rebuild a SQLite table, dropping the ``user_id`` column and any FK to ``users``."""
    cursor.execute(f"PRAGMA table_info({table})")
    columns = cursor.fetchall()  # cid, name, type, notnull, dflt_value, pk
    kept = [row for row in columns if row[1] != "user_id"]
    if len(kept) == len(columns):
        return

    column_defs = []
    for row in kept:
        _cid, name, ctype, notnull, default, pk = row
        parts = [f'"{name}"', ctype or ""]
        if pk:
            parts.append("PRIMARY KEY")
        if notnull:
            parts.append("NOT NULL")
        if default is not None:
            parts.append(f"DEFAULT {default}")
        column_defs.append(" ".join(p for p in parts if p))
    column_names = ", ".join(f'"{row[1]}"' for row in kept)

    tmp = f"{table}__rebuild_no_user_id"
    cursor.execute(f"DROP TABLE IF EXISTS {tmp}")
    cursor.execute(f"CREATE TABLE {tmp} ({', '.join(column_defs)})")
    cursor.execute(f"INSERT INTO {tmp} ({column_names}) SELECT {column_names} FROM {table}")
    cursor.execute(f"DROP TABLE {table}")
    cursor.execute(f"ALTER TABLE {tmp} RENAME TO {table}")


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
