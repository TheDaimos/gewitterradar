"""MA-011: stable storage fault codes and redacted internal diagnostics."""
from dataclasses import dataclass
from enum import StrEnum
import errno
import sqlite3
import time


class StorageState(StrEnum):
    NOT_STARTED = "not_started"
    READY = "ready"
    TEMPORARY = "temporarily_unavailable"
    DEGRADED = "degraded"
    STOPPED = "stopped"


@dataclass(frozen=True, slots=True)
class StorageStatus:
    state: StorageState
    code: str | None = None
    operation: str | None = None
    timestamp_us: int | None = None
    reusable: bool = False
    manual_intervention: bool = False


class StorageError(sqlite3.DatabaseError):
    """No SQL text or private parameter values in error messages."""
    def __init__(self, code: str, operation: str):
        self.code = code
        self.operation = operation
        super().__init__(code + ": " + operation)


class StorageIntegrityError(sqlite3.DatabaseError):
    """Explicitly confirmed integrity failure."""


class DatabaseUnavailable(StorageError, RuntimeError):
    def __init__(self, operation="execute"):
        super().__init__("storage_unavailable", operation)


class DatabaseOverloaded(DatabaseUnavailable):
    def __init__(self):
        StorageError.__init__(self, "busy", "queue")


def classify(exc):
    # Preserve the public exception types of the existing schema and queue contracts.
    from .schema import UnsupportedSchema
    if isinstance(exc, StorageError):
        return exc.code
    if isinstance(exc, UnsupportedSchema):
        return "unsupported_schema"
    if isinstance(exc, StorageIntegrityError):
        return "storage_corrupt"
    if isinstance(exc, sqlite3.IntegrityError):
        return None
    if isinstance(exc, PermissionError):
        return "storage_readonly"
    if isinstance(exc, OSError):
        if exc.errno in (errno.ENOSPC, getattr(errno,"EDQUOT",-1)):
            return "storage_full"
        if exc.errno == errno.EROFS:
            return "storage_readonly"
        return "storage_unavailable"
    if isinstance(exc, sqlite3.Error):
        primary = getattr(exc, "sqlite_errorcode", 0) & 255
        if primary == sqlite3.SQLITE_CONSTRAINT:
            return None
        return {
            sqlite3.SQLITE_FULL:"storage_full",
            sqlite3.SQLITE_READONLY:"storage_readonly",
            sqlite3.SQLITE_PERM:"storage_readonly",
            sqlite3.SQLITE_AUTH:"storage_readonly",
            sqlite3.SQLITE_CORRUPT:"storage_corrupt",
            sqlite3.SQLITE_NOTADB:"storage_corrupt",
            sqlite3.SQLITE_BUSY:"busy",
            sqlite3.SQLITE_LOCKED:"busy",
        }.get(primary,"storage_unavailable")
    return None


def fault_status(code, operation, reusable=False):
    manual = code in ("storage_corrupt","unsupported_schema","storage_readonly","storage_full")
    return StorageStatus(
        StorageState.DEGRADED if code in ("storage_corrupt","unsupported_schema") else StorageState.TEMPORARY,
        code,operation,time.time_ns()//1000,reusable,manual)
