# Installation

## HACS installation

This repository is the native **Integration** component of Gewitterradar. The Lovelace Dashboard/Card is distributed separately from `TheDaimos/gewitterradar-dashboard`.

When this release candidate is approved for public installation:

1. In HACS, add `https://github.com/TheDaimos/gewitterradar` as a custom repository of type **Integration**.
2. Install **Gewitterradar Integration**.
3. Restart Home Assistant if HACS/Home Assistant requests it.
4. Open **Settings → Devices & services**.
5. Select **Add integration** and search for **Gewitterradar**.
6. Create the single Gewitterradar Config Entry.
7. For this unreleased shared-frontend candidate, add `/gewitterradar/gewitterradar.js` as a JavaScript module under **Settings → Dashboards → Resources**, then create a card of type `custom:gewitterradar-card`. The integration now includes the frontend.

The native integration does not automatically register the separate Dashboard resource and does not modify Home Assistant `.storage` files.

### Expected result after a full restart

After the Config Entry has been created and Home Assistant has completed a full restart:

- the Config Entry must be `loaded`;
- **Gewitterradar must be visible under Settings → Devices & services → Integrations**;
- the 16 native configuration entities must still exist with their persisted values;
- HACS should show the Integration repository as installed rather than pending restart.

The manifest intentionally classifies Gewitterradar as a Home Assistant `service` integration. Do not change it back to `helper`: Home Assistant's Integrations dashboard filters Helper Config Entries into the separate Helpers UI, which can make an otherwise healthy Config Entry appear to have disappeared.

## Manual installation

Copy the complete directory:

```text
custom_components/gewitterradar/
```

to:

```text
/config/custom_components/gewitterradar/
```

The resulting target must contain at least:

```text
/config/custom_components/gewitterradar/
├── __init__.py
├── config_flow.py
├── const.py
├── manifest.json
├── number.py
├── select.py
├── strings.json
├── switch.py
├── frontend/
│   ├── gewitterradar.js
│   └── assets/ (all 17 runtime images)
├── brand/
│   ├── icon.png
│   └── icon@2x.png
└── translations/
    ├── de.json
    └── en.json
```

Restart Home Assistant and add **Gewitterradar** through **Settings → Devices & services**.

## Fresh installation behavior

A fresh native installation does not require the historical Gewitterradar YAML helper package. Native defaults and settings live in the Config Entry. The integration exposes 16 native configuration entities.

## Existing installations

If supported legacy `lightning_detection_*` helpers are present on first setup, valid values for missing native settings may be imported once. Existing native values always take precedence. Legacy helpers are not deleted or rewritten.

The native integration also does not delete unrelated historical Registry objects. In particular, an unavailable automation entity or HACS update entity is not proof that the current Config Entry created it. Verify the source/config-entry/repository ID before removing such leftovers.

See [`MIGRATION_AND_ROLLBACK.md`](MIGRATION_AND_ROLLBACK.md).

## Dashboard/Card requirement

The unreleased shared-frontend candidate includes the same card and assets as the derived Dashboard package. After the integration has been set up, its resource is `/gewitterradar/gewitterradar.js` (JavaScript module). Resource registration remains explicit; no `.storage` manipulation is performed.

For the published frozen V4.05 channel, the separate Dashboard delivery remains available at `https://github.com/TheDaimos/gewitterradar-dashboard`. Load exactly one Gewitterradar module: either the integration URL or `/hacsfiles/gewitterradar-dashboard/gewitterradar.js`. Verify and remove/disable obsolete resource registrations before switching; in particular the historical `/hacsfiles/gewitterradar/gewitterradar.js?...` path can collide. Do not change entity settings or delete the legacy package as part of a resource switch.

The candidate still requires Linux runtime CI and real HACS/device acceptance; it is not a published release.

The Dashboard continues to use the Home Assistant Blitzortung.org integration as the live lightning-event data source.

## Real-install regression checks

After installing an updated release candidate which contains the first real-install fixes:

1. perform a full Home Assistant restart;
2. verify Gewitterradar remains listed under **Devices & services → Integrations**;
3. verify all 16 configuration entities and their values;
4. add/remove or otherwise cause discovery of a `person.*` or `zone.*` entity, or change the reference-location environment;
5. verify the reference-location select refreshes its options without a thread-safety warning mentioning `async_write_ha_state`;
6. verify the existing Dashboard/Card continues to operate;
7. only then continue with HACS rollback and re-update validation.

See [`REAL_INSTALL_FINDINGS_2026-09-06.md`](REAL_INSTALL_FINDINGS_2026-09-06.md).

## Release-candidate verification

Before this release is declared stable, the following must be recorded as successful against the public repository:

- HACS Integration validation;
- Hassfest;
- Home Assistant runtime tests;
- deterministic package verification;
- real HACS fresh installation;
- HACS update from the supported previous state;
- rollback and re-update;
- final Android/iPad frontend spot checks.
