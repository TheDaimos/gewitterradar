# Migration and rollback

## Migration model

The native integration uses a one-time, non-destructive migration model.

Principles:

- native Config Entry state is authoritative;
- existing native values always win over legacy values;
- legacy helpers are treated as read-only migration sources;
- only valid supported legacy values are imported;
- missing, `unknown`, `unavailable` or invalid legacy values are ignored safely;
- coupled radius settings are validated together and are not partially imported into an invalid native state;
- a stored migration marker prevents repeated import into the same Config Entry;
- legacy helpers are never deleted or rewritten by the migration.

## Fresh installation

A fresh installation with no historical Gewitterradar package/helpers is supported. The native integration creates and persists its own configuration state through the Config Entry.

## Existing V4.04/helper installation

On first setup of a new native Config Entry, supported valid `lightning_detection_*` helper values can be imported for native settings that do not already have a value.

After migration, native values can be changed independently. The old helpers remain untouched so a controlled transition/rollback remains possible during the migration period.

## Historical Registry leftovers are outside the migration contract

The native migration reads supported legacy helper states. It does **not** own or automatically delete unrelated Home Assistant Entity Registry, Device Registry or HACS repository objects.

During the first public HACS real-install check, two unavailable automation entities and one unavailable HACS update entity were present in the test instance. The current native integration contains no automation platform and does not create those automation entities. The stale update entity was associated with an older/renamed HACS repository identity rather than the current native Integration repository.

Treat such objects as historical installation residue, not as native migration output. Before deleting them:

1. confirm the entity is unavailable and has no active backing configuration;
2. confirm its Config Entry/repository identity is not the current `TheDaimos/gewitterradar` Integration;
3. confirm no Dashboard/Card resource still references the old repository/path;
4. remove only the verified stale Registry/repository object.

The native integration deliberately avoids automatic Registry cleanup because deleting unrelated user objects would violate the non-destructive migration contract.

## Unload / disable / re-enable

Unloading or disabling the same Config Entry does not erase its persisted native options. Re-enabling the same entry restores the native values and the one-time migration does not run again when the current migration marker is present.

## Delete Config Entry

Deleting the Config Entry is different from unloading it:

- Home Assistant removes the deleted entry's native persistent state;
- legacy helpers remain unchanged;
- adding a genuinely new Config Entry later may perform the one-time import again from the still-existing legacy helpers.

Do not rely on native-only values surviving deletion of the Config Entry unless they have been backed up separately.

## Frontend compatibility

The Gewitterradar Dashboard/Card uses native configuration entities first and can fall back to the legacy helper model during the supported transition period. Missing/unavailable/unknown native configuration state therefore does not require destructive helper migration.

The native Config Entry itself is intentionally classified as a Home Assistant `service` integration. This keeps it visible on **Settings → Devices & services → Integrations**. `integration_type: helper` is incorrect for Gewitterradar and would route/filter the entry toward Home Assistant's separate Helpers UI.

## Known non-blocking limitation

Historical `device_tracker.*` reference selections are not automatically migrated by the current native integration. Supported dynamic native reference choices are based on current `person.*` and `zone.*` entities. Existing unsupported legacy values are left unchanged rather than coerced.

## Validation evidence

The migration/rollback model has been covered by Home Assistant runtime tests for:

- complete valid legacy import;
- native-wins precedence;
- missing/unknown/unavailable/invalid legacy input;
- invalid coupled radius groups;
- one-time marker behavior;
- unload/re-enable persistence;
- deletion semantics;
- re-add after deletion;
- package/helper-free fresh installation;
- frontend native/legacy fallback lifecycle.

The first public HACS real-install additionally verified that the Config Entry loads, all 16 native configuration entities are present and their values survive a full Home Assistant restart. That run exposed the manifest-classification and reference-location thread-safety defects now covered by the release-candidate hotfix/regression tests.

A real HACS update to the corrected candidate, rollback and re-update remain separate release gates and must be recorded before the release candidate is declared stable.
