"""Authenticated, revisioned storage for Gewitterradar device profiles."""

import asyncio
from collections import defaultdict
from copy import deepcopy
from datetime import datetime, timezone
import logging
import re
from uuid import uuid4

import voluptuous as vol

from homeassistant.components import websocket_api
from homeassistant.helpers.storage import Store

from .build_info import BUILD_VERSION
from .vault_schema import (
    MAX_EXPORT_BYTES,
    MAX_SETTINGS_BYTES,
    JSON_SETTINGS,
    SCHEMA,
    SETTINGS_KEYS,
    VaultError,
    canonical,
    decode_value,
    digest,
    invalid,
    name,
    read_json,
    salvage_legacy,
    same,
    validate_settings,
)

_LOGGER = logging.getLogger(__name__)
DOMAIN = "gewitterradar"
DATA_KEY = "gewitterradar_settings_vault"
PREFIX = "gewitterradar/settings/"
FORMAT = "gewitterradar.settings-vault"
MAX_PROFILES = 16
MAX_SNAPSHOTS = 4
MAX_RECEIPTS = 48
MAX_DOCUMENT_BYTES = 8 * 1024 * 1024
ID = re.compile(r"[0-9a-f]{32}")
MISSING = object()
OPERATIONS = (
    "get", "create", "migration_preview", "rename", "patch", "copy", "export", "import_preview",
    "import_commit", "snapshots", "restore",
)


def utc_now():
    return datetime.now(timezone.utc).isoformat()


def uid(value):
    if not isinstance(value, str) or ID.fullmatch(value) is None:
        invalid("Invalid identifier")
    return value


def revision(value):
    if type(value) is not int or not 0 <= value < 2**53:
        invalid("Invalid revision")
    return value


def empty_document():
    return {"schema": SCHEMA, "profiles": {}}


def public_profile(profile, *, contents=True):
    result = {key: profile[key] for key in ("id", "name", "revision", "updatedAt")}
    if contents:
        result["settings"] = deepcopy(profile["settings"])
    return result


def checked_document(stored):
    if type(stored) is not dict or set(stored) != {"document", "sha256"}:
        invalid("Invalid settings document")
    data = stored["document"]
    if type(data) is dict and type(data.get("schema")) is int and data["schema"] > SCHEMA:
        raise VaultError("settings_schema", "Unsupported settings schema")
    if (
        not isinstance(data, dict) or data.get("schema") != SCHEMA
        or not isinstance(data.get("profiles"), dict)
        or len(data["profiles"]) > MAX_PROFILES or digest(data) != stored["sha256"]
    ):
        invalid("Invalid settings document")
    for profile_id, profile in data["profiles"].items():
        uid(profile_id)
        if not isinstance(profile, dict) or profile.get("id") != profile_id:
            invalid("Invalid stored profile")
        name(profile.get("name"))
        validate_settings(profile.get("settings"))
        rev = revision(profile.get("revision"))
        if revision(profile.get("barrier")) > rev or not isinstance(profile.get("updatedAt"), str):
            invalid("Invalid stored revision")
        create = profile.get("create")
        if not isinstance(create, dict) or not isinstance(create.get("digest"), str):
            invalid("Invalid creation receipt")
        uid(create.get("id"))
        receipts = profile.get("receipts")
        if not isinstance(receipts, dict) or len(receipts) > MAX_RECEIPTS:
            invalid("Invalid write receipts")
        for request_id, receipt in receipts.items():
            uid(request_id)
            if not isinstance(receipt, dict) or not isinstance(receipt.get("digest"), str):
                invalid("Invalid write receipt")
            if revision(receipt.get("revision")) > rev:
                invalid("Invalid write receipt revision")
        snapshots = profile.get("snapshots")
        if not isinstance(snapshots, list) or len(snapshots) > MAX_SNAPSHOTS:
            invalid("Invalid snapshots")
        for snapshot in snapshots:
            if not isinstance(snapshot, dict) or not isinstance(snapshot.get("createdAt"), str):
                invalid("Invalid snapshot")
            uid(snapshot.get("id"))
            if revision(snapshot.get("revision")) > rev:
                invalid("Invalid snapshot revision")
            validate_settings(snapshot.get("settings"))
            if digest(snapshot["settings"]) != snapshot.get("sha256"):
                invalid("Invalid snapshot checksum")
        originals = profile.get("legacy")
        if not isinstance(originals, dict) or not originals.keys() <= set(SETTINGS_KEYS):
            invalid("Invalid legacy originals")
        if len(canonical(originals)) > MAX_SETTINGS_BYTES:
            invalid("Legacy originals exceed the limit")
        for key, raw in originals.items():
            decode_value(key, raw)
        issues = profile.get("migrationIssues", [])
        if not isinstance(issues, list) or any(key not in SETTINGS_KEYS for key in issues):
            invalid("Invalid migration status")
    return data


def take_snapshot(profile):
    settings = deepcopy(profile["settings"])
    snapshot = {
        "id": uuid4().hex,
        "createdAt": utc_now(),
        "revision": profile["revision"],
        "settings": settings,
        "sha256": digest(settings),
    }
    profile["snapshots"] = [snapshot, *profile["snapshots"]][:MAX_SNAPSHOTS]
    return snapshot["id"]


def field_equal(left, right):
    if left is MISSING or right is MISSING:
        return left is right
    return same(left, right)


def merge_fields(current, before, after):
    """Merge values a client actually changed. Arrays are a single field."""
    if field_equal(before, after) or field_equal(current, after):
        return current
    if field_equal(current, before):
        return after
    if (
        isinstance(current, dict) and isinstance(after, dict)
        and (before is MISSING or isinstance(before, dict))
    ):
        base = {} if before is MISSING else before
        merged = current.copy()
        for field in base.keys() | after.keys():
            value = merge_fields(
                current.get(field, MISSING), base.get(field, MISSING), after.get(field, MISSING)
            )
            if value is MISSING:
                merged.pop(field, None)
            else:
                merged[field] = value
        return merged
    raise VaultError("settings_conflict", "This field changed in another session")


def export_profiles(profiles):
    payload = {
        "format": FORMAT, "schema": SCHEMA, "exportedAt": utc_now(),
        "profiles": [public_profile(profile) for profile in profiles],
    }
    text = canonical({"payload": payload, "sha256": digest(payload)})
    if len(text) > MAX_EXPORT_BYTES:
        raise VaultError("settings_limit", "Export exceeds the size limit; export profiles individually")
    return {"text": text.decode("ascii")}


def check_import(text):
    package = read_json(text, MAX_EXPORT_BYTES)
    if not isinstance(package, dict) or set(package) != {"payload", "sha256"}:
        invalid("Invalid export")
    payload = package["payload"]
    if (
        not isinstance(payload, dict) or payload.get("format") != FORMAT
        or set(payload) != {"format", "schema", "exportedAt", "profiles"}
        or digest(payload) != package["sha256"] or not isinstance(payload["exportedAt"], str)
    ):
        invalid("Invalid export checksum or format")
    if not same(payload["schema"], SCHEMA):
        raise VaultError("settings_schema", "Unsupported settings schema")
    profiles = payload["profiles"]
    if not isinstance(profiles, list) or not 1 <= len(profiles) <= MAX_PROFILES:
        invalid("Invalid number of exported profiles")
    seen = set()
    for profile in profiles:
        if not isinstance(profile, dict) or set(profile) != {"id", "name", "revision", "updatedAt", "settings"}:
            invalid("Invalid exported profile")
        profile_id = uid(profile["id"])
        if profile_id in seen or not isinstance(profile["updatedAt"], str):
            invalid("Invalid exported profile metadata")
        seen.add(profile_id)
        name(profile["name"])
        revision(profile["revision"])
        validate_settings(profile["settings"])
    return package


class SettingsVault:
    """Use private HA stores. Only connection.user.id determines ownership."""

    def __init__(self, store_factory):
        self._store_factory = store_factory
        self._locks = defaultdict(asyncio.Lock)
        self._loaded = {}

    def _store(self, user, recovery=False):
        suffix = ".previous" if recovery else ""
        return self._store_factory(f"gewitterradar.settings.{digest(user)}{suffix}")

    async def _load(self, user):
        if user in self._loaded:
            return self._loaded[user]
        primary_error = None
        try:
            raw = await self._store(user).async_load()
            if raw is not None:
                result = (checked_document(raw), False)
                self._loaded[user] = result
                return result
        except VaultError as error:
            if error.code == "settings_schema":
                raise
            primary_error = error
        except Exception as error:
            if type(error).__name__ == "UnsupportedStorageVersionError":
                raise VaultError("settings_schema", "Unsupported storage version") from error
            primary_error = error

        try:
            recovery = await self._store(user, recovery=True).async_load()
            if recovery is not None:
                return checked_document(recovery), True
        except VaultError as error:
            if error.code == "settings_schema":
                raise
            raise VaultError("settings_storage", "No verified recovery copy") from error
        except Exception as error:
            raise VaultError("settings_storage", "Unable to load the recovery copy") from error
        if primary_error is not None:
            raise VaultError("settings_storage", "Unable to read the settings store") from primary_error
        return empty_document(), False

    async def _write_verified(self, user, data, *, recovery=False):
        if len(canonical(data)) > MAX_DOCUMENT_BYTES:
            raise VaultError("settings_limit", "Account storage limit reached")
        envelope = {"document": data, "sha256": digest(data)}
        try:
            await self._store(user, recovery).async_save(envelope)
            # Store can log I/O errors without raising. Read through a fresh instance.
            checked = await self._store(user, recovery).async_load()
            if checked is None or not same(checked_document(checked), data):
                raise VaultError("settings_storage", "Settings write could not be verified")
        except Exception as error:
            raise VaultError("settings_storage", "Settings write could not be verified") from error

    @staticmethod
    def _find(data, profile_id):
        profile = data["profiles"].get(uid(profile_id))
        if profile is None:
            raise VaultError("settings_not_found", "Profile not found")
        return profile

    @staticmethod
    def _create(data, request_id, request_digest, profile_name, settings, originals=None, issues=None):
        if len(data["profiles"]) >= MAX_PROFILES:
            raise VaultError("settings_limit", "Device profile limit reached")
        profile_id = uuid4().hex
        profile = {
            "id": profile_id, "name": name(profile_name), "revision": 1, "barrier": 1,
            "updatedAt": utc_now(), "settings": validate_settings(settings),
            "legacy": originals or {}, "migrationIssues": issues or [], "snapshots": [], "receipts": {},
            "create": {"id": request_id, "digest": request_digest},
        }
        if originals or issues:
            take_snapshot(profile)
        data["profiles"][profile_id] = profile
        return profile

    @staticmethod
    def _migrate(raw_values):
        if (
            type(raw_values) is not dict or not raw_values.keys() <= set(SETTINGS_KEYS)
            or len(canonical(raw_values)) > MAX_SETTINGS_BYTES
        ):
            invalid("Invalid legacy source")
        settings, originals, issues = {}, {}, []
        for key, raw in raw_values.items():
            try:
                settings[key] = decode_value(key, raw)
                originals[key] = raw
            except VaultError:
                issues.append(key)
                if (valid_fields := salvage_legacy(key, raw)) is not None:
                    settings[key] = valid_fields
        return settings, originals, issues

    @staticmethod
    def _receipt(profile, request_id, request_digest):
        receipt = profile["receipts"].get(request_id)
        if receipt is None:
            return False
        if receipt["digest"] != request_digest:
            invalid("Request ID already used")
        return True

    @staticmethod
    def _update(profile, request_id, request_digest, *, barrier=False):
        profile["revision"] += 1
        profile["updatedAt"] = utc_now()
        if barrier:
            profile["barrier"] = profile["revision"]
        rev = profile["revision"]
        profile["receipts"] = {
            key: val for key, val in profile["receipts"].items() if rev - val["revision"] < MAX_RECEIPTS
        }
        profile["receipts"][request_id] = {"digest": request_digest, "revision": rev}
        return public_profile(profile)

    def _patch(self, profile, request):
        changes = request.get("changes")
        if (
            not isinstance(changes, dict) or not changes or not changes.keys() <= set(SETTINGS_KEYS)
            or len(canonical(changes)) > 2 * MAX_SETTINGS_BYTES
        ):
            invalid("Invalid field changes")
        settings = profile["settings"].copy()
        before, after = {}, {}
        for key, pair in changes.items():
            if not isinstance(pair, dict) or set(pair) != {"before", "after"}:
                invalid()
            if pair["before"] is not None:
                before[key] = decode_value(key, pair["before"])
            if pair["after"] is not None:
                after[key] = decode_value(key, pair["after"])
        for key in changes:
            current = settings.get(key, MISSING)
            value = merge_fields(current, before.get(key, MISSING), after.get(key, MISSING))
            if value is MISSING:
                settings.pop(key, None)
            else:
                settings[key] = value
        try:
            profile["settings"] = validate_settings(settings)
        except VaultError as error:
            raise VaultError("settings_conflict", "Changes cannot safely be combined") from error

    def _action(self, data, op, request):
        request_id = uid(request.get("requestId"))
        request_digest = digest([op, request])
        profiles = data["profiles"]
        # A retried creation always resolves to the same server-generated identity.
        for existing in profiles.values():
            if existing["create"]["id"] == request_id:
                if existing["create"]["digest"] != request_digest:
                    invalid("Request ID already used")
                return {"profile": public_profile(existing)}, False

        if op == "create":
            settings, originals, issues = self._migrate(request.get("legacy", {}))
            if request.get("legacy") and not settings:
                invalid("No usable browser settings found")
            profile = self._create(data, request_id, request_digest, request.get("name"), settings, originals, issues)
            return {"profile": public_profile(profile), "migrationIssues": issues}, True

        if op == "import_commit":
            package = check_import(request.get("text"))
            if package["sha256"] != request.get("sha256"):
                invalid("Import changed after preview")
            source = next(
                (item for item in package["payload"]["profiles"] if item["id"] == uid(request.get("sourceId"))),
                None,
            )
            if source is None:
                invalid("Select a profile from the preview")
            if not request.get("profileId"):
                profile = self._create(data, request_id, request_digest, source["name"], source["settings"])
                return {"profile": public_profile(profile)}, True

        profile = self._find(data, request.get("profileId"))
        if op == "copy" and request.get("targetId") is None:
            keys = self._copy_keys(request, profile["settings"])
            copied = {key: profile["settings"][key] for key in keys if key in profile["settings"]}
            copy = self._create(data, request_id, request_digest, request.get("name"), copied)
            return {"profile": public_profile(copy)}, True

        if op == "copy":
            source_profile = profile
            profile = self._find(data, request["targetId"])
        if self._receipt(profile, request_id, request_digest):
            return {"profile": public_profile(profile)}, False
        expected = revision(request.get("revision"))
        if op == "patch":
            if (
                expected > profile["revision"] or expected < profile["barrier"]
                or profile["revision"] - expected >= MAX_RECEIPTS
            ):
                raise VaultError("settings_conflict", "This profile revision changed")
            take_snapshot(profile)
            self._patch(profile, request)
        elif expected != profile["revision"]:
            raise VaultError("settings_conflict", "This profile revision changed")
        elif op == "rename":
            profile["name"] = name(request.get("name"))
        elif op == "restore":
            snapshot_id = uid(request.get("snapshotId"))
            snapshot = next((item for item in profile["snapshots"] if item["id"] == snapshot_id), None)
            if snapshot is None:
                raise VaultError("settings_not_found", "Snapshot not found")
            take_snapshot(profile)
            profile["settings"] = deepcopy(snapshot["settings"])
        elif op == "copy":
            keys = self._copy_keys(request, source_profile["settings"])
            take_snapshot(profile)
            settings = profile["settings"].copy()
            if "keys" not in request:
                settings.clear()
            for key in keys:
                if key in source_profile["settings"]:
                    settings[key] = deepcopy(source_profile["settings"][key])
                else:
                    settings.pop(key, None)
            profile["settings"] = validate_settings(settings)
        elif op == "import_commit":
            take_snapshot(profile)
            profile["settings"] = deepcopy(source["settings"])
        else:
            invalid("Unknown operation")
        return {"profile": self._update(
            profile, request_id, request_digest, barrier=op in ("restore", "copy", "import_commit")
        )}, True

    @staticmethod
    def _copy_keys(request, settings):
        keys = request.get("keys", list(settings))
        if not isinstance(keys, list) or not all(isinstance(key, str) and key in SETTINGS_KEYS for key in keys):
            invalid("Invalid selection of settings")
        return keys

    async def dispatch(self, user, op, request):
        async with self._locks[user]:
            data, recovery = await self._load(user)
            if op == "get":
                result = {
                    "schema": SCHEMA, "settingsKeys": SETTINGS_KEYS, "recovery": recovery,
                    "jsonSettingsKeys": sorted(JSON_SETTINGS),
                    "profiles": [public_profile(p, contents=False) for p in data["profiles"].values()],
                }
                if request.get("profileId"):
                    profile = self._find(data, request["profileId"])
                    result["profile"] = public_profile(profile)
                    result["migrationIssues"] = profile.get("migrationIssues", [])
                return result
            if op == "migration_preview":
                settings, originals, issues = self._migrate(request.get("legacy", {}))
                return {"keys": list(settings), "originalKeys": list(originals), "issues": issues}
            if op == "export":
                profile_id = request.get("profileId")
                profiles = [self._find(data, profile_id)] if profile_id else data["profiles"].values()
                return export_profiles(profiles)
            if op == "import_preview":
                package = check_import(request.get("text"))
                return {
                    "sha256": package["sha256"],
                    "profiles": [
                        {**{key: value for key, value in profile.items() if key != "settings"},
                         "settingsKeys": list(profile["settings"])}
                        for profile in package["payload"]["profiles"]
                    ],
                }
            if op == "snapshots":
                profile = self._find(data, request.get("profileId"))
                return {
                    "snapshots": [
                        {key: value for key, value in snapshot.items() if key != "settings"}
                        for snapshot in profile["snapshots"]
                    ],
                    "legacyKeys": list(profile["legacy"]),
                }
            if recovery:
                raise VaultError("settings_storage", "Recovery copy is read-only; export it first")
            next_document = deepcopy(data)
            result, changed = self._action(next_document, op, request)
            if changed:
                # Do not acknowledge or replace the in-memory document before the disk readback.
                if data["profiles"]:
                    await self._write_verified(user, data, recovery=True)
                try:
                    await self._write_verified(user, next_document)
                    if not data["profiles"]:
                        await self._write_verified(user, next_document, recovery=True)
                except VaultError:
                    self._loaded.pop(user, None)
                    raise
                self._loaded[user] = (next_document, False)
            return result


def register_settings_vault(hass):
    vault = SettingsVault(lambda key: Store(hass, 1, key, private=True, atomic_writes=True))
    hass.data[DATA_KEY] = vault

    def register(op):
        @websocket_api.websocket_command({
            "type": PREFIX + op,
            vol.Required("schema"): int,
            vol.Required("build"): str,
            vol.Optional("request", default=dict): dict,
        })
        @websocket_api.async_response
        async def command(_hass, connection, message):
            user = connection.user
            if user is None or not user.is_active:
                connection.send_error(message["id"], "unauthorized", "Home Assistant sign-in required")
                return
            try:
                if type(message["schema"]) is not int or message["schema"] != SCHEMA:
                    raise VaultError("settings_schema", "Unsupported settings schema")
                if message["build"] != BUILD_VERSION:
                    raise VaultError("settings_reload", "Reload Gewitterradar after updating")
                # The transaction retains its lock through Store readback if a client disconnects.
                task = _hass.async_create_task(vault.dispatch(user.id, op, message["request"]))
                task.add_done_callback(_consume_exception)
                result = await asyncio.shield(task)
            except VaultError as error:
                connection.send_error(message["id"], error.code, str(error))
                return
            except Exception as error:
                _LOGGER.error("Settings vault operation %s failed (%s)", op, type(error).__name__)
                connection.send_error(message["id"], "settings_storage", "Settings vault unavailable")
                return
            connection.send_result(message["id"], result)

        websocket_api.async_register_command(hass, command)

    for operation in OPERATIONS:
        register(operation)


def _consume_exception(task):
    if not task.cancelled():
        task.exception()
