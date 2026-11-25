"""MA-006: bounded, single-thread-owned SQLite connection; no schema."""
from __future__ import annotations

import asyncio
from concurrent.futures import Future
from pathlib import Path
from queue import Full, Queue
import sqlite3
from threading import Thread
from typing import Callable, TypeVar

T = TypeVar("T")


class DatabaseUnavailable(RuntimeError):
    """The database is not accepting operations."""


class DatabaseOverloaded(DatabaseUnavailable):
    """The bounded pending operation queue is full."""


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
                raise sqlite3.DatabaseError("database integrity check failed")
            return conn
        except BaseException:
            conn.close()
            raise

    def _worker(self, queue: Queue, ready: Future, closed: Future) -> None:
        conn = None
        try:
            conn = self._open()
            ready.set_result(None)
            while True:
                item = queue.get()
                if item is None:
                    break
                op, result = item
                if not result.set_running_or_notify_cancel():
                    continue
                try:
                    value = op(conn)
                    if isinstance(value, (sqlite3.Connection, sqlite3.Cursor)):
                        raise TypeError("SQLite handles must not escape the worker")
                    if conn.in_transaction:
                        conn.rollback()
                        raise RuntimeError("operation left an open transaction")
                    result.set_result(value)
                except BaseException as exc:
                    if conn.in_transaction:
                        conn.rollback()
                    result.set_exception(exc)
        except BaseException as exc:
            if not ready.done():
                ready.set_exception(exc)
            else:
                closed.set_exception(exc)
        finally:
            try:
                if conn is not None:
                    conn.close()
            except BaseException as exc:
                if not closed.done():
                    closed.set_exception(exc)
            finally:
                if not closed.done():
                    closed.set_result(None)

    async def _finish(self) -> None:
        thread, queue, closed = self._thread, self._queue, self._closed
        self._accepting = False
        if thread is None:
            return
        # One reserved control slot: never wait for a full work queue on HA.
        if not closed.done():
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
            ready, closed = Future(), Future()
            queue = Queue(maxsize=self._capacity + 1)
            thread = Thread(target=self._worker, args=(queue, ready, closed),
                            name="gewitterradar-ma-sqlite", daemon=False)
            thread.start()
            self._thread, self._queue, self._closed = thread, queue, closed
            try:
                await asyncio.shield(asyncio.wrap_future(ready))
            except BaseException:
                await self._finish()
                raise
            self._accepting = True

    async def async_execute(self, operation: Callable[[sqlite3.Connection], T]) -> T:
        """Run a short internal operation; return materialized data, never handles."""
        if not self._accepting or self._closed.done():
            raise DatabaseUnavailable("database is not running")
        if self._queue.qsize() >= self._capacity:
            raise DatabaseOverloaded("database queue full")
        result = Future()
        try:
            self._queue.put_nowait((operation, result))
        except Full as exc:
            raise DatabaseOverloaded("database queue full") from exc
        # Cancellation before execution cancels the queued operation; once running,
        # SQLite finishes on its owner thread. Caller cancellation is not a receipt.
        return await asyncio.wrap_future(result)

    async def async_stop(self) -> None:
        async with self._lock:
            if self._thread is None:
                return
            self._accepting = False
            cleanup = asyncio.create_task(self._finish())
            try:
                await asyncio.shield(cleanup)
            except asyncio.CancelledError:
                await cleanup
                raise
