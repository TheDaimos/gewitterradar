"""Runtime and transaction coverage for the Settings Vault."""

import asyncio
from copy import deepcopy
import json
from pathlib import Path
from uuid import uuid4

import pytest

from homeassistant.helpers.storage import Store
from homeassistant.setup import async_setup_component

from custom_components.gewitterradar.build_info import BUILD_VERSION
from custom_components.gewitterradar.settings_vault import SettingsVault, register_settings_vault
from custom_components.gewitterradar.vault_schema import VaultError, digest

LEGACY = json.loads(Path(__file__).with_name("settings-vault-v181.json").read_text(encoding="utf-8"))
EYE = "gewitterradar:eye-bubble:v1"
WIND = "gewitterradar:wind-ui:v1"
TEMP = "gewitterradar:temperature-ui:v1"
DISPLAY = "gewitterradar:weather-display:v1"
STUDIO = "gewitterradar:wind-studio:v1"


class FakeDisk:
    """Model atomic stores, including Store's logged-but-unraised write failure."""

    def __init__(self):
        self.files = {}
        self.fail_primary = False

    def __call__(self, key):
        disk = self

        class TestStore:
            async def async_load(self):
                return deepcopy(disk.files.get(key))

            async def async_save(self, value):
                await asyncio.sleep(0)
                if disk.fail_primary and not key.endswith(".previous"):
                    return
                disk.files[key] = deepcopy(value)

        return TestStore()


def request(**fields):
    return {"requestId": uuid4().hex, **fields}


async def create(vault, user="user-1", **fields):
    return (await vault.dispatch(user, "create", request(name="Android", **fields)))["profile"]


def patch(profile, key, value):
    settings = profile["settings"]
    before = json.dumps(settings[key]) if key in settings else None
    return request(profileId=profile["id"], revision=profile["revision"],
                   changes={key: {"before": before, "after": json.dumps(value)}})


async def test_real_store_restart_and_independent_profiles(hass):
    make_store = lambda key: Store(hass, 1, key, private=True, atomic_writes=True)
    vault = SettingsVault(make_store)
    desktop = await create(vault)  # Empty first client.
    android = await create(vault, legacy=LEGACY)
    ipad = await create(vault, legacy={**LEGACY, WIND: '{"visible":true,"mode":"arrows"}'})
    assert desktop["settings"] == {}
    assert len({p["id"] for p in (desktop, android, ipad)}) == 3

    restarted = SettingsVault(make_store)
    result = await restarted.dispatch("user-1", "get", {"profileId": android["id"]})
    assert result["profile"] == android
    assert result["profile"]["settings"][EYE]["grouped"] is True
    assert result["profile"]["settings"][WIND]["mode"] == "snake"
    assert result["profile"]["settings"][TEMP]["labels"] is False
    assert result["profile"]["settings"][DISPLAY]["opacities"] == {
        "precipitation": .27, "clouds": .62, "windSymbols": 0,
    }
    assert result["profile"]["settings"][STUDIO]["users"][0]["name"] == "Böenfront"
    for key in ("gewitterradar:v409:map-compass-visible", "gewitterradar:v409:map-medallion-visible",
                "gewitterradar:v41002:map-cluster-jump-visible"):
        assert result["profile"]["settings"][key] == "false"
    assert result["migrationIssues"] == []
    assert (await restarted.dispatch("user-1", "get", {"profileId": ipad["id"]}))["profile"] == ipad


async def test_parallel_patches_replay_and_conflicts():
    vault = SettingsVault(FakeDisk())
    base = await create(vault, legacy=LEGACY)
    eye, display = base["settings"][EYE], base["settings"][DISPLAY]
    change_eye = patch(base, EYE, {**eye, "eyeAuraGap": 28})
    change_rain = patch(base, DISPLAY, {**display, "opacities": {**display["opacities"], "precipitation": .41}})
    change_cloud = patch(base, DISPLAY, {**display, "opacities": {**display["opacities"], "clouds": .1}})
    await asyncio.gather(*(vault.dispatch("user-1", "patch", cmd) for cmd in (change_eye, change_rain, change_cloud)))
    replay = (await vault.dispatch("user-1", "patch", change_rain))["profile"]
    assert replay["revision"] == base["revision"] + 3
    assert replay["settings"][EYE]["eyeAuraGap"] == 28
    assert replay["settings"][DISPLAY]["opacities"] == {"precipitation": .41, "clouds": .1, "windSymbols": 0}
    with pytest.raises(VaultError, match="field changed"):
        await vault.dispatch("user-1", "patch", patch(base, EYE, {**eye, "eyeAuraGap": 8}))


async def test_failed_write_does_not_confirm_and_retry_is_idempotent():
    disk = FakeDisk()
    vault = SettingsVault(disk)
    creation = request(name="Android", legacy=LEGACY)
    disk.fail_primary = True
    with pytest.raises(VaultError, match="could not be verified"):
        await vault.dispatch("user-1", "create", creation)
    disk.fail_primary = False
    result = await vault.dispatch("user-1", "create", creation)
    assert (await vault.dispatch("user-1", "create", creation))["profile"] == result["profile"]
    assert len((await vault.dispatch("user-1", "get", {}))["profiles"]) == 1
    change = patch(result["profile"], EYE, {"grouped": False})
    disk.fail_primary = True
    with pytest.raises(VaultError, match="could not be verified"):
        await vault.dispatch("user-1", "patch", change)
    assert (await SettingsVault(disk).dispatch("user-1", "get", {"profileId": result["profile"]["id"]}))["profile"] == result["profile"]


async def test_corruption_recovery_and_future_schema_are_read_only():
    disk = FakeDisk()
    vault = SettingsVault(disk)
    profile = await create(vault, legacy=LEGACY)
    key = next(key for key in disk.files if not key.endswith(".previous"))
    disk.files[key]["sha256"] = "damaged"
    restarted = SettingsVault(disk)
    assert (await restarted.dispatch("user-1", "get", {"profileId": profile["id"]}))["recovery"]
    assert "text" in await restarted.dispatch("user-1", "export", {})
    with pytest.raises(VaultError, match="read-only"):
        await restarted.dispatch("user-1", "patch", patch(profile, EYE, {"grouped": False}))
    document = {"schema": 2, "profiles": {}}
    disk.files[key] = {"document": document, "sha256": digest(document)}
    with pytest.raises(VaultError, match="Unsupported settings schema"):
        await SettingsVault(disk).dispatch("user-1", "get", {})


async def test_export_import_copy_snapshot_and_restore():
    vault = SettingsVault(FakeDisk())
    android = await create(vault, legacy=LEGACY)
    destination = await create(vault, legacy={WIND: '{"visible":true,"mode":"barbs"}'})
    export = await vault.dispatch("user-1", "export", {"profileId": android["id"]})
    preview = await vault.dispatch("user-1", "import_preview", export)
    assert STUDIO in preview["profiles"][0]["settingsKeys"]
    with pytest.raises(VaultError, match="checksum"):
        await vault.dispatch("user-1", "import_preview", {"text": export["text"].replace("Android", "changed")})
    copied = await vault.dispatch("user-1", "copy", request(
        profileId=android["id"], targetId=destination["id"], revision=destination["revision"], keys=[EYE]
    ))
    assert copied["profile"]["settings"][EYE] == android["settings"][EYE]
    assert copied["profile"]["settings"][WIND]["mode"] == "barbs"
    imported = await vault.dispatch("user-1", "import_commit", request(
        **export, sha256=preview["sha256"], sourceId=android["id"], profileId=destination["id"],
        revision=copied["profile"]["revision"],
    ))
    assert imported["profile"]["settings"] == android["settings"]
    history = await vault.dispatch("user-1", "snapshots", {"profileId": destination["id"]})
    restored = await vault.dispatch("user-1", "restore", request(
        profileId=destination["id"], revision=imported["profile"]["revision"],
        snapshotId=history["snapshots"][0]["id"],
    ))
    assert restored["profile"]["settings"] == copied["profile"]["settings"]
    with pytest.raises(VaultError, match="revision changed"):
        await vault.dispatch("user-1", "patch", patch(copied["profile"], EYE, {"grouped": False}))


async def test_legacy_partial_future_data_and_invalid_fields():
    vault = SettingsVault(FakeDisk())
    profile = await create(vault, legacy={
        EYE: '{"grouped":true,"energyAccents":"invalid","colors":{"wind":"#FFC442","temperature":17}}',
        WIND: '{"schema":5,"mode":"snake"}',
        TEMP: '{"schema":1,"labels":false,"futureField":17}',
        DISPLAY: '{"opacities":{"precipitation":0.23}}',
    })
    assert profile["settings"][EYE] == {"grouped": True, "colors": {"wind": "#FFC442"}}
    assert profile["settings"][TEMP] == {"schema": 1, "labels": False}
    assert WIND not in profile["settings"]
    with pytest.raises(VaultError, match="Invalid settings payload"):
        await vault.dispatch("user-1", "patch", patch(profile, EYE, {"__proto__": {}}))
    with pytest.raises(VaultError, match="Unsupported value"):
        await vault.dispatch("user-1", "patch", patch(profile, EYE, {"unknown": "value"}))
    with pytest.raises(VaultError, match="Profile not found"):
        await vault.dispatch("user-2", "get", {"profileId": profile["id"], "userId": "user-1"})


async def test_legacy_preset_names_and_review_metadata_are_lossless():
    vault = SettingsVault(FakeDisk())
    studio = json.loads(LEGACY[STUDIO])
    template = studio["users"][0]
    studio["users"] = [{**template, "id": "user:first", "name": "Maße"},
                       {**template, "id": "user:second", "name": "Masse"}]
    studio["selected"] = "user:first"
    key = "gewitterradar:v41002:medallion-arrow-visual-calibration-v2"
    calibration = {
        "schema": "gewitterradar.medallion-arrow-visual-calibration.v2", "version": 2,
        "build": "V4.11.181-DEV-2026-11-11", "updatedAt": None,
        "entries": {"eye::arrow": {"reviewed": False, "eyeReferenceChangedAt": "2026-11-11T10:30:00.000Z"}},
    }
    profile = await create(vault, legacy={STUDIO: json.dumps(studio), key: json.dumps(calibration)})
    assert profile["settings"][STUDIO] == studio
    assert profile["settings"][key] == calibration


async def test_websocket_ownership_and_build(hass, hass_ws_client, hass_access_token, hass_read_only_access_token):
    assert await async_setup_component(hass, "websocket_api", {})
    register_settings_vault(hass)
    admin = await hass_ws_client(hass, hass_access_token)
    reader = await hass_ws_client(hass, hass_read_only_access_token)

    async def send(client, operation, payload, *, build=BUILD_VERSION):
        await client.send_json_auto_id({
            "type": "gewitterradar/settings/" + operation, "schema": 1, "build": build, "request": payload,
        })
        return await client.receive_json()

    created = await send(reader, "create", request(name="Eigene Einstellungen", legacy={EYE: '{"grouped":true}'}))
    assert created["success"]
    profile_id = created["result"]["profile"]["id"]
    assert (await send(admin, "get", {}))["result"]["profiles"] == []
    assert (await send(admin, "get", {"profileId": profile_id}))["error"]["code"] == "settings_not_found"
    assert (await send(reader, "get", {"profileId": profile_id}, build="4.11.181"))["error"]["code"] == "settings_reload"


async def test_p1_fifth_synoptic_slot_survives_vault_restart_and_stale_four_slot_update():
    """A stale four-function UI may change another field, never erase slot five."""
    disk = FakeDisk()
    vault = SettingsVault(disk)
    created = await create(vault, legacy=LEGACY)
    # V181 predates slot assignment. Persist the four original Eye functions
    # first, just as the upgraded frontend does, without resetting its legacy colors.
    initial = deepcopy(created["settings"][EYE])
    initial["slots"] = [{"id": f"slot-{i+1}", "functionId": function}
                        for i, function in enumerate(("wind", "temperature",
                                                       "precipitation", "weather-display"))]
    before = (await vault.dispatch("user-1", "patch", patch(created, EYE, initial)))["profile"]
    original = deepcopy(before["settings"][EYE])
    assigned = deepcopy(original)
    assigned["slots"] = [*assigned["slots"], {"id": "slot-5", "functionId": "synoptic"}]
    assigned["colors"] = {**assigned.get("colors", {}), "synoptic": "#FFC442"}
    saved = (await vault.dispatch("user-1", "patch", patch(before, EYE, assigned)))["profile"]
    assert saved["settings"][EYE]["slots"][-1]["functionId"] == "synoptic"
    assert saved["settings"][EYE]["colors"]["synoptic"] == "#FFC442"
    # Independent synoptic settings are now a registered/validated Vault key.
    synoptic = {"visible": False, "centers": True, "isobars": True,
                "highColor": "#FFC442", "lowColor": "#B000FF", "quickPositions": {}}
    saved = (await vault.dispatch("user-1", "patch", patch(saved, "gewitterradar:synoptic-ui:v1", synoptic)))["profile"]
    restarted = SettingsVault(disk)
    hydrated = (await restarted.dispatch("user-1", "get", {"profileId": saved["id"]}))["profile"]
    assert hydrated["settings"][EYE]["slots"][-1]["functionId"] == "synoptic"
    assert hydrated["settings"]["gewitterradar:synoptic-ui:v1"] == synoptic
    # A stale client still has four slots; its unrelated grouping change must
    # retain the server's fifth slot, colors and synoptic configuration.
    stale = deepcopy(original)
    stale["grouped"] = not original["grouped"]
    concurrent = (await restarted.dispatch("user-1", "patch", patch(before, EYE, stale)))["profile"]
    assert concurrent["settings"][EYE]["slots"][-1]["functionId"] == "synoptic"
    assert concurrent["settings"][EYE]["colors"]["synoptic"] == "#FFC442"
    assert concurrent["settings"]["gewitterradar:synoptic-ui:v1"] == synoptic
    again = SettingsVault(disk)
    final = (await again.dispatch("user-1", "get", {"profileId": saved["id"]}))["profile"]
    assert len(final["settings"][EYE]["slots"]) == len(original["slots"]) + 1
    assert final["settings"][EYE]["slots"][-1]["functionId"] == "synoptic"
