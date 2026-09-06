# Gewitterradar — Home Assistant Integration

This repository is the native Home Assistant integration for **Gewitterradar**.

**Current integration version:** `0.17.0`  
**Release status:** release-candidate preparation; not yet declared stable for general installation.

The native integration and the Gewitterradar dashboard card are intentionally distributed as two separate HACS repository types:

- **Integration:** this repository (`TheDaimos/gewitterradar`)
- **Dashboard/Card:** `TheDaimos/gewitterradar-dashboard`

A complete Gewitterradar installation uses both components. The Dashboard repository remains the source of the Lovelace card and frontend assets; this repository installs only the native backend/configuration integration under `custom_components/gewitterradar/`.

## What the native integration provides

- one UI Config Flow and one Config Entry;
- persistent settings through `ConfigEntry.options`;
- typed per-entry runtime state;
- 16 native configuration entities:
  - 4 Select entities;
  - 5 Number entities;
  - 7 Switch entities;
- validated observation/storm/danger radius ordering and bounds;
- dynamic `person.*` / `zone.*` reference-location choices;
- one-time, non-destructive migration from supported legacy `lightning_detection_*` helpers;
- package-free fresh installation;
- unload/re-enable persistence and documented rollback behavior.

The native integration does **not** replace the Blitzortung.org data source used by the Gewitterradar dashboard for live lightning events.

## Installation

### HACS

Once this release candidate is approved for public installation:

1. Add this repository to HACS as a custom **Integration** repository.
2. Install **Gewitterradar Integration**.
3. Restart Home Assistant if requested.
4. Open **Settings → Devices & services → Add integration**.
5. Add **Gewitterradar**.
6. Install the separate Gewitterradar Dashboard/Card repository if the frontend is not already installed.

See [`docs/INSTALLATION.md`](docs/INSTALLATION.md) for the complete procedure.

### Manual installation

Copy:

```text
custom_components/gewitterradar/
```

into:

```text
/config/custom_components/gewitterradar/
```

Restart Home Assistant and add **Gewitterradar** through the UI.

## Existing V4.04 / legacy-helper installations

On first native setup, supported valid legacy helper values may be imported once. Existing native values take precedence and legacy helpers are not deleted or rewritten.

See [`docs/MIGRATION_AND_ROLLBACK.md`](docs/MIGRATION_AND_ROLLBACK.md).

## Known release-candidate limitations

- `device_tracker.*` is not automatically migrated as a reference-location source; this is a documented non-blocking limitation.
- A native Integration installation does not automatically register the separate Lovelace card resource. Install the Dashboard/Card through its own supported HACS Dashboard path.
- Real HACS fresh-install/update/rollback validation and the final Android/iPad frontend spot checks remain release gates until explicitly recorded as passed.

## Validation

The release line is validated independently through:

- Home Assistant runtime tests;
- Hassfest;
- HACS Integration validation;
- deterministic 12-file integration-package staging;
- fresh-install, migration, unload/re-enable and rollback tests.

A green runtime test does not substitute for HACS/Hassfest validation, and static packaging validation does not substitute for a real HACS installation test.

## Licensing and branding

Except for reserved branding materials and third-party material carrying its own license notice, the source code and documentation are licensed under **GNU GPL Version 3 only (`GPL-3.0-only`)**.

Copyright © 2026 **Christian Köhler / TheDaimos**.

See [`LICENSE`](LICENSE), [`COPYRIGHT.md`](COPYRIGHT.md), [`AUTHORS.md`](AUTHORS.md) and [`BRANDING.md`](BRANDING.md).

The Gewitterradar name, logos, icons, artwork and visual identity are not licensed under GPL-3.0-only. Forks and derivative projects must use distinct branding unless separate permission has been granted.
