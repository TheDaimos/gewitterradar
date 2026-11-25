"""MA-014: explicit guarded destructive actions; no frontend or HA registry writes.

Only an authenticated API may pass actor IDs and a trusted HA-admin result.
"""
import asyncio
from dataclasses import dataclass
import secrets
import time

from .storage.repositories import Repositories, ConstraintViolation, RevisionConflict, MissingRecord


class ProtectionDenied(RuntimeError):
    pass


class ConfirmationRequired(ProtectionDenied):
    pass


@dataclass(frozen=True)
class DeletionPreview:
    nonce: str
    location_id: str
    revision: int
    links: int
    reports: int
    expires_at: float


class Protection:
    def __init__(self, repositories: Repositories, *, lifetime_s=120):
        self._repo = repositories
        self._ttl = lifetime_s
        self._lock = asyncio.Lock()
        self._pending = {}

    async def preview_final_delete(self, *, actor_user_id, is_admin, location_id):
        if not actor_user_id or is_admin is not True:
            raise ProtectionDenied("forbidden")
        def snapshot(c):
            loc=c.execute("SELECT revision FROM locations WHERE location_id=?",(location_id,)).fetchone()
            if loc is None:
                raise MissingRecord("not_found")
            links=c.execute("SELECT count(*) FROM profile_links WHERE location_id=?",(location_id,)).fetchone()[0]
            reports=c.execute("SELECT count(*) FROM lightning_reports WHERE location_id=?",(location_id,)).fetchone()[0]
            return (loc[0],links,reports)
        revision,links,reports=await self._repo._db.async_execute(snapshot,kind="read")
        nonce=secrets.token_urlsafe(32)
        expires=time.monotonic()+self._ttl
        async with self._lock:
            self._pending={k:v for k,v in self._pending.items() if v[5]>time.monotonic()}
            self._pending[nonce]=(actor_user_id,location_id,revision,links,reports,expires)
        return DeletionPreview(nonce,location_id,revision,links,reports,expires)

    async def remove_link(self, *, link_id, location_id, actor_user_id, actor_profile_id, is_admin=False,
                          confirmation_nonce=None, explicit_final=False, expected_revision):
        if not actor_user_id or not actor_profile_id:
            raise ProtectionDenied("unauthorized")
        proof=None
        if explicit_final:
            if is_admin is not True or not confirmation_nonce:
                raise ConfirmationRequired("last_link_confirmation_required")
            async with self._lock:
                proof=self._pending.pop(confirmation_nonce,None)
            if proof is None or proof[0]!=actor_user_id or proof[1]!=location_id or proof[5]<=time.monotonic():
                raise ConfirmationRequired("confirmation_expired")
        def op(c):
            loc=c.execute("SELECT revision FROM locations WHERE location_id=?",(location_id,)).fetchone()
            if loc is None:
                raise MissingRecord("not_found")
            if loc[0]!=expected_revision:
                raise RevisionConflict("revision_conflict")
            link=c.execute("SELECT 1 FROM profile_links WHERE link_id=? AND location_id=? AND ha_user_id=? AND vault_profile_id=?",
                           (link_id,location_id,actor_user_id,actor_profile_id)).fetchone()
            if link is None:
                raise MissingRecord("not_found")
            total=c.execute("SELECT count(*) FROM profile_links WHERE location_id=?",(location_id,)).fetchone()[0]
            reports=c.execute("SELECT count(*) FROM lightning_reports WHERE location_id=?",(location_id,)).fetchone()[0]
            if total==1:
                if proof is None:
                    raise ConfirmationRequired("last_link_confirmation_required")
                if proof[2:5]!=(loc[0],total,reports):
                    raise ConfirmationRequired("confirmation_stale")
                if reports:
                    # Reset is a separately confirmed flow; never silently delete history.
                    raise ConstraintViolation("history_exists")
                if c.execute("SELECT 1 FROM tracker_refs WHERE location_id=?",(location_id,)).fetchone():
                    raise ConstraintViolation("tracker_present")
            c.execute("DELETE FROM notification_targets WHERE link_id=?",(link_id,))
            c.execute("DELETE FROM profile_preferences WHERE link_id=?",(link_id,))
            c.execute("DELETE FROM profile_links WHERE link_id=?",(link_id,))
            if total==1:
                c.execute("DELETE FROM locations WHERE location_id=?",(location_id,))
                return {"removed":True,"deleted_location":True}
            c.execute("UPDATE locations SET revision=revision+1 WHERE location_id=?",(location_id,))
            return {"removed":True,"deleted_location":False}
        return await self._repo._write(op)
