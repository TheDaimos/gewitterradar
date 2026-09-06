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
7. Install the separate Gewitterradar Dashboard/Card repository if the Lovelace frontend is not already installed.

The native integration does not automatically register the separate Dashboard resource and does not modify Home Assistant `.storage` files.

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

See [`MIGRATION_AND_ROLLBACK.md`](MIGRATION_AND_ROLLBACK.md).

## Dashboard/Card requirement

The Integration repository provides backend/configuration entities only. For the full Gewitterradar visual application, install the Dashboard/Card separately from:

```text
https://github.com/TheDaimos/gewitterradar-dashboard
```

The Dashboard continues to use the Home Assistant Blitzortung.org integration as the live lightning-event data source.

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
