"""MA-013: shared location links with verified HA-user/Vault-profile ownership.

Only the authenticated backend passes user IDs. No frontend ID or browser profile
selection is an authorization credential.
"""
from uuid import UUID, uuid4

from .storage.repositories import Repositories


class ProfileNotVerified(PermissionError):
    pass


def _id(value):
    try:
        parsed = UUID(value, version=4)
    except (ValueError, AttributeError, TypeError) as exc:
        raise ValueError("invalid_id") from exc
    if str(parsed) != value or parsed.version != 4:
        raise ValueError("invalid_id")
    return value


class Links:
    def __init__(self, repositories: Repositories, vault):
        self._repo = repositories
        self._vault = vault

    async def require_profile(self, user_id, profile_id):
        """Fail closed on absent/unverified Vault access."""
        if not isinstance(user_id, str) or not user_id:
            raise ProfileNotVerified("profile_not_found")
        checker = getattr(self._vault, "async_profile_belongs_to", None)
        if checker is None or not callable(checker):
            raise ProfileNotVerified("profile_not_found")
        try:
            result = await checker(user_id, profile_id)
        except Exception as exc:
            raise ProfileNotVerified("profile_not_found") from exc
        if result is not True:
            raise ProfileNotVerified("profile_not_found")
        return True

    async def create(self, *, location_id, target_user_id, target_profile_id,
                     link_id=None, preferences=None):
        """Caller must separately prove permission to share location."""
        await self.require_profile(target_user_id, target_profile_id)
        data = dict(link_id=_id(link_id) if link_id else str(uuid4()),
                    location_id=_id(location_id),
                    ha_user_id=target_user_id, vault_profile_id=target_profile_id)
        if preferences is not None:
            preferences = {**preferences, "link_id": data["link_id"]}
        return await self._repo.create_link(data, preferences=preferences)

    async def get_verified_link(self, link_id, *, actor_user_id, actor_profile_id):
        await self.require_profile(actor_user_id, actor_profile_id)
        link = await self._repo.get_link(_id(link_id))
        if link is None or link["ha_user_id"] != actor_user_id or link["vault_profile_id"] != actor_profile_id:
            raise ProfileNotVerified("not_found")
        return link
