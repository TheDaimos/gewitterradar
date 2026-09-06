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

A real public-HACS fresh/update/rollback installation remains a separate release gate and must be recorded before the release candidate is declared stable.
