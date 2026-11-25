"""MA-006: bounded, single-thread-owned SQLite connection; no schema."""
from __future__ import annotations

import asyncio
from concurrent.futures import Future
from pathlib import Path
from queue import Empty, Full, Queue
import sqlite3
from threading import Lock, Thread
from typing import Callable, TypeVar

from .schema import initialize_schema, UnsupportedSchema
from .errors import (DatabaseUnavailable, DatabaseOverloaded, StorageError,
                     StorageIntegrityError, StorageState, StorageStatus, classify, fault_status)

T = TypeVar("T")


class Database:
    """One event-loop-owned controller and one SQLite-owning worker thread."""

    def __init__(self, path: str | Path, *, config_root: str | Path, queue_size: int = 64):
        if queue_size < 1:
            raise ValueError("queue_size must be positive")
        self._path = Path(path)
        self._root = Path(config_root)
        self._capacity = queue_size
        self._lock = asyncio.Lock()
        self._thread: Thread | None = None
        self._queue: Queue | None = None
        self._closed: Future | None = None
        self._accepting = False
        self._gate = Lock()
        self._status = StorageStatus(StorageState.NOT_STARTED)

    @property
    def status(self) -> StorageStatus:
        with self._gate:
            return self._status

    def _fault(self, code, operation, reusable=False):
        with self._gate:
            self._status = fault_status(code, operation, reusable)
            if not reusable:
                self._accepting = False

    @property
    def running(self) -> bool:
        return self._accepting

    def _open(self) -> sqlite3.Connection:
        root = self._root.resolve(strict=True)
        expected = root / "gewitterradar" / "monitored_areas" / "monitored_areas.sqlite3"
        if self._path.absolute() != expected or self._path.resolve() != expected:
            raise ValueError("invalid Monitored Areas database path")
        for path in (expected.parent.parent, expected.parent, expected,
                     Path(str(expected) + "-wal"), Path(str(expected) + "-shm"),
                     Path(str(expected) + "-journal")):
            if path.is_symlink():
                raise ValueError("symlink in Monitored Areas database path")
        expected.parent.mkdir(parents=True, exist_ok=True)
        conn = sqlite3.connect(expected, timeout=5, isolation_level=None)
        try:
            conn.execute("PRAGMA busy_timeout=5000")
            conn.execute("PRAGMA foreign_keys=ON")
            if conn.execute("PRAGMA journal_mode=WAL").fetchone()[0].lower() != "wal":
                raise sqlite3.DatabaseError("WAL unavailable")
            conn.execute("PRAGMA synchronous=FULL")
            if tuple(conn.execute("PRAGMA quick_check").fetchall()) != (("ok",),):
                raise StorageIntegrityError("database integrity check failed")
            initialize_schema(conn)
            return conn
        except BaseException:
            conn.close()
            raise

    def _worker(self, queue: Queue, ready: Future, closed: Future) -> None:
        conn = None
        failure = None
        try:
            conn = self._open()
            with self._gate:
                self._status = StorageStatus(StorageState.READY, reusable=True)
            ready.set_result(None)
            while True:
                item = queue.get()
                if item is None:
                    break
                op, result, operation = item
                if not result.set_running_or_notify_cancel():
                    continue
                try:
                    value = op(conn)
                    if isinstance(value, (sqlite3.Connection, sqlite3.Cursor)):
                        raise TypeError("SQLite handles must not escape the worker")
                    if conn.in_transaction:
                        conn.rollback()
                        raise RuntimeError("operation left an open transaction")
                    with self._gate:
                        self._status = StorageStatus(StorageState.READY, reusable=True)
                    result.set_result(value)
                except BaseException as exc:
                    code = classify(exc)
                    try:
                        if conn.in_transaction:
                            conn.rollback()
                    except BaseException:
                        code = "storage_unavailable"
                        self._fault(code, "rollback")
                        result.set_exception(StorageError(code,"rollback"))
                        failure = StorageError(code,"rollback")
                        break
                    if code is not None:
                        # BUSY/FULL/READONLY may be retried explicitly by callers.
                        # Other I/O errors close the connection; never silently reopen.
                        reusable = code in ("busy","storage_full","storage_readonly")
                        self._fault(code,operation,reusable)
                        result.set_exception(StorageError(code,operation))
                        if not reusable:
                            failure = StorageError(code,operation)
                            break
                    else:
                        result.set_exception(exc)
        except BaseException as exc:
            code = classify(exc) or "storage_unavailable"
            self._fault(code,"open" if not ready.done() else "worker")
            if not ready.done():
                # Preserve existing typed path/permission/schema errors for callers.
                if isinstance(exc,(ValueError,PermissionError,UnsupportedSchema)):
                    ready.set_exception(exc)
                else:
                    ready.set_exception(StorageError(code,"open"))
            else:
                failure = StorageError(code,"worker")
        finally:
            # Disable admission and drain under the same lock used by submit.
            with self._gate:
                self._accepting = False
                while True:
                    try:
                        item = queue.get_nowait()
                    except Empty:
                        break
                    if item is not None:
                        _, pending, _ = item
                        if pending.set_running_or_notify_cancel():
                            pending.set_exception(DatabaseUnavailable("worker"))
            try:
                if conn is not None:
                    conn.close()
            except BaseException as exc:
                code = classify(exc) or "storage_unavailable"
                self._fault(code,"close")
                failure = StorageError(code,"close")
            if failure is not None:
                closed.set_exception(failure)
            else:
                closed.set_result(None)

    async def _finish(self) -> None:
        thread, queue, closed = self._thread, self._queue, self._closed
        if thread is None:
            return
        with self._gate:
            self._accepting = False
            if not closed.done() and thread.is_alive():
                queue.put_nowait(None)
        try:
            await asyncio.shield(asyncio.wrap_future(closed))
        finally:
            await asyncio.to_thread(thread.join)
            self._thread = self._queue = self._closed = None

    async def async_start(self) -> None:
        async with self._lock:
            if self._accepting:
                return
            # Fatal worker exits must be joined before an explicit new start.
            if self._thread is not None:
                try:
                    await self._finish()
                except StorageError:
                    pass
            ready, closed = Future(), Future()
            queue = Queue(maxsize=self._capacity + 1)
            thread = Thread(target=self._worker, args=(queue, ready, closed),
                            name="gewitterradar-ma-sqlite", daemon=False)
            self._thread, self._queue, self._closed = thread, queue, closed
            try:
                thread.start()
            except BaseException:
                self._thread = self._queue = self._closed = None
                self._fault("storage_unavailable","start")
                raise
            try:
                await asyncio.shield(asyncio.wrap_future(ready))
            except BaseException:
                cleanup = asyncio.create_task(self._finish())
                try:
                    await asyncio.shield(cleanup)
                except StorageError:
                    pass
                raise
            with self._gate:
                self._accepting = not closed.done()

    async def async_execute(self, operation: Callable[[sqlite3.Connection], T], *,
                            kind: str = "execute") -> T:
        """Execute trusted short operations; no automatic retries."""
        if kind not in ("execute","read","write"):
            raise ValueError("invalid operation kind")
        with self._gate:
            if not self._accepting or self._closed.done():
                raise DatabaseUnavailable(kind)
            if self._queue.qsize() >= self._capacity:
                self._status = fault_status("busy","queue",True)
                raise DatabaseOverloaded()
            result = Future()
            self._queue.put_nowait((operation,result,kind))
        return await asyncio.wrap_future(result)

    async def async_stop(self) -> None:
        async with self._lock:
            if self._thread is None:
                return
            cleanup = asyncio.create_task(self._finish())
            try:
                await asyncio.shield(cleanup)
            except asyncio.CancelledError:
                await cleanup
                raise
            with self._gate:
                if self._status.state is StorageState.READY:
                    self._status = StorageStatus(StorageState.STOPPED)
                elif self._status.reusable:
                    self._status = StorageStatus(StorageState.STOPPED,self._status.code,
                        self._status.operation,self._status.timestamp_us,False,self._status.manual_intervention)
