# First public HACS real-install findings — 2026-09-06

Status: **release-candidate validation evidence**

This document records the first real Home Assistant installation check against the public `TheDaimos/gewitterradar` HACS Integration repository. It distinguishes verified native-integration behavior from test-instance leftovers which are not created or owned by the current native integration.

## Installation baseline

The tested public repository state was commit:

```text
9386579e2cf8619c644943062e61a9f3bec1fafa
```

The repository was installed through HACS as category **Integration**, followed by creation of a Gewitterradar Config Entry through Home Assistant's UI.

Two observations were made:

1. an initial check after only a quick restart/reload cycle;
2. a second complete check after a full Home Assistant restart.

## What passed

The real installation proved all of the following:

- HACS downloaded and installed the native integration;
- the Gewitterradar Config Entry existed and reached `loaded` state;
- exactly 16 native configuration entities were available:
  - 4 Selects;
  - 5 Numbers;
  - 7 Switches;
- stored values survived the full Home Assistant restart unchanged;
- the HACS state settled from `pending-restart` to `installed` after the full restart;
- no YAML helper package was required for the native entities;
- the separate Dashboard/Card repository remained an independent installation concern as designed.

This means the Config Entry did **not** actually disappear from Home Assistant's backend. The user-visible disappearance from the Integrations dashboard was a classification/UI-filtering defect.

## Defect 1 — Config Entry hidden from the Integrations dashboard

### Symptom

After installation and a full restart, the Config Entry was still `loaded` and all 16 entities still existed, but **Gewitterradar was no longer visible in Settings → Devices & services → Integrations**.

### Root cause

The public manifest incorrectly declared:

```json
"integration_type": "helper"
```

Home Assistant's Integrations dashboard subscribes to Config Entries of the user-facing integration types `device`, `hub`, `service` and `hardware`. `helper` Config Entries belong to the separate Helpers UI and are filtered out of the normal Integrations dashboard.

Gewitterradar is not a helper entity factory. It represents one user-facing application/service Config Entry which owns configuration entities. The correct classification for the current architecture is therefore:

```json
"integration_type": "service"
```

### Fix

The release-candidate hotfix changes `integration_type` from `helper` to `service` and adds a static regression assertion so this cannot silently regress again.

### Required real re-check

After updating to the corrected commit and fully restarting Home Assistant:

- the existing Config Entry must remain `loaded`;
- Gewitterradar must be visible under **Devices & services → Integrations**;
- the existing 16 entity IDs and values must remain unchanged.

## Defect 2 — thread-safety violation in dynamic location handling

### Symptom

The Home Assistant log reported a runtime thread-safety error at `custom_components/gewitterradar/select.py` when the dynamic reference-location choices changed:

```text
custom integration 'gewitterradar' calls async_write_ha_state from a thread
other than the event loop
```

The failing path was the location add/remove listener used by `select.gewitterradar_reference_location`.

### Root cause

The listener called `async_write_ha_state()` directly. That API is event-loop-only. A synchronous Home Assistant callback may be dispatched outside the event loop, so the direct async writer is not safe for this callback boundary.

### Fix

The listener now uses:

```python
self.schedule_update_ha_state()
```

Home Assistant's Entity API implements that scheduling path with a thread-safe event-loop handoff when necessary. A regression test also fails if the location-change callback stops using the scheduler and directly calls the event-loop-only writer again.

### Required real re-check

After updating:

1. cause a new supported location entity (`person.*` or `zone.*`) to appear or disappear, or otherwise exercise dynamic reference-location discovery;
2. verify the Select options refresh;
3. verify there is no new Gewitterradar thread-safety error in the Home Assistant log.

## Findings which are not current native-integration defects

### Unavailable initialize automations

The test instance contained unavailable automation entities with Gewitterradar-style names. The current native repository has no automation platform and does not create these automation entities. They are therefore historical Registry/configuration leftovers, not output of the current native Config Entry.

Do not add code to the Integration which blindly deletes them. Cleanup must be performed only after their backing automation configuration has been confirmed absent.

### Unavailable `update.gewitterradar_update`

A second unavailable HACS update entity pointed at an older repository identity. This is consistent with the Dashboard repository rename/split history and is not the update entity of the current native Integration repository.

Again, this is an instance/HACS Registry cleanup task. The native integration must not delete unrelated HACS devices/entities automatically.

## Initial download 404s

The first installation log also contained transient zipball 404 errors before the public repository state settled. The later install completed and the Config Entry loaded successfully. No recurrence occurred after the full restart.

This remains installation-history evidence, not a currently reproduced runtime failure. A clean update/rollback/re-update cycle must still be tested before stable release.

## Release-gate status after this analysis

### Passed

- public HACS repository validation: 9/9;
- HACS installation reached installed state;
- Config Entry creation and setup;
- 16/16 native configuration entities;
- persistence across full restart;
- package contract;
- Hassfest;
- Home Assistant runtime test suite on the public release line.

### Corrected in code, requires real-instance confirmation

- visibility under Devices & services → Integrations after full restart;
- thread-safe dynamic reference-location updates.

### Still open

- HACS update from commit `9386579...` to the corrected commit;
- real rollback and re-update;
- final Android/iPad frontend checks, including Android compass persistence;
- cleanup of verified stale Registry/HACS objects on the test instance.

No stable tag/release should be created until the corrected candidate has passed the real-instance checks above.
