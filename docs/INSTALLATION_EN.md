# Gewitterradar V4.04 – Installation (EN)

## Requirements

- Running Home Assistant installation.
- Blitzortung.org integration providing the required lightning/counter entities.
- Default counter used by the example: `sensor.home_lightning_counter`.

## HACS update channel

For normal installation and future updates, use the default **newest / Latest** version offered by HACS. This is currently V4.04. Select a fixed older version only for an intentional rollback or a specific compatibility requirement. HACS regularly refreshes repository metadata and can offer newer stable Gewitterradar releases as updates.

## Option A: Install through HACS

1. Add `TheDaimos/gewitterradar` to HACS as a custom **Dashboard** repository.
2. Install the default **Latest / newest version**, or use **Redownload** when upgrading. Latest currently resolves to V4.04.
3. HACS installs `gewitterradar.js`, the complete `assets/` directory and `app_gewitterradar_pkg.yaml` under `/config/www/community/gewitterradar/`.
4. Manually copy or move `app_gewitterradar_pkg.yaml` to `/config/packages/app_gewitterradar_pkg.yaml`.
5. Perform a full Home Assistant restart.

After the HACS installation, the directory must contain at least:

```text
/config/www/community/gewitterradar/
├── app_gewitterradar_pkg.yaml
├── gewitterradar.js
└── assets/
    ├── gewitterradar-compass-frame-v1.png
    ├── gewitterradar-compass-frame-v2.png
    ├── gewitterradar-trend-arrow.png
    └── gewitterradar-trend-medallion.png
```

Home Assistant exposes the dashboard files through `/hacsfiles/gewitterradar/`. If Lovelace resources are managed in YAML, use:

```text
/hacsfiles/gewitterradar/gewitterradar.js
```

### Why is the package copy/move still manual?

This final step cannot be automated by this HACS repository. Gewitterradar is installed as a **Dashboard repository**. HACS installs the repository inside its own directory:

```text
/config/www/community/gewitterradar/
```

It does not deploy Home Assistant configuration files into:

```text
/config/packages/
```

V4.04 therefore solves the practical part: HACS already downloads the required package locally. The user no longer needs to find or download a separate file from GitHub and only has to copy or move:

```text
/config/www/community/gewitterradar/app_gewitterradar_pkg.yaml
```

to:

```text
/config/packages/app_gewitterradar_pkg.yaml
```

**Copying is recommended**, so the HACS-provided staging copy remains available in the Gewitterradar directory.

The maintained canonical package is `home-assistant/app_gewitterradar_pkg.yaml`. The HACS build creates `dist/app_gewitterradar_pkg.yaml`; CI verifies that both files are byte-identical.

`configuration.yaml` must include packages:

```yaml
homeassistant:
  packages: !include_dir_named packages
```

If that block already exists, do not add a second top-level `homeassistant:` key.

Existing `lightning_detection_*` helper IDs are intentionally preserved. Package logic itself is unchanged from V4.03. Restart Home Assistant after copying/replacing the package.

If stale helpers are already shown as unavailable because the package was previously missing, do not delete them prematurely. Restore the package and restart Home Assistant; with the same entity IDs, the YAML helpers are provided again under their existing IDs.

### Upgrade note for V4.01/V4.02/V4.03

V4.01 could be treated as a single-file installation because of a standalone `gewitterradar.js` release asset. V4.02 removed that file but still published package/ZIP/checksum assets, which current HACS also prioritized before the `dist/` tree. V4.03 fixed this by publishing no custom release assets, allowing HACS to install the card and graphics correctly from `dist/`.

V4.04 preserves that working zero-custom-release-asset mechanism and only adds `dist/app_gewitterradar_pkg.yaml`. The helper package therefore arrives with the HACS installation without reactivating the broken release-asset path.

## Option B: Manual installation

### 1. Copy JavaScript and assets

- Copy `gewitterradar-card-v4_04.js` to `/config/www/gewitterradar/gewitterradar-card-v4_04.js`.
- Copy the four PNG files from `dist/assets/` to `/config/www/gewitterradar/assets/`.

Expected asset files:

- `gewitterradar-trend-medallion.png`
- `gewitterradar-trend-arrow.png`
- `gewitterradar-compass-frame-v1.png`
- `gewitterradar-compass-frame-v2.png`

### 2. Add the Lovelace resource

Register the card as a JavaScript module:

```text
/local/gewitterradar/gewitterradar-card-v4_04.js?v=4_04
```

After updates, refresh the browser or Companion App cache.

## 3. Install the Home Assistant package

For a manual installation, copy `home-assistant/app_gewitterradar_pkg.yaml` to `/config/packages/app_gewitterradar_pkg.yaml`. The byte-identical `dist/app_gewitterradar_pkg.yaml` can be used as an alternative source.

Then perform a full Home Assistant restart.

## 4. Add the Gewitterradar view

```yaml
title: Gewitterradar
path: gewitterradar
icon: mdi:weather-lightning
type: panel
cards:
  - type: vertical-stack
    cards:
      - type: custom:gewitterradar-card
        counter_entity: sensor.home_lightning_counter
        radius_entity: input_number.lightning_detection_observation_radius
        compass_mode_entity: input_boolean.lightning_detection_compass_nearest_strike
```

## 5. Recorder protection recommended

Short-lived lightning entities and the frequently updated lightning sensors should normally be excluded from long-term Recorder storage:

```yaml
recorder:
  exclude:
    entity_globs:
      - "geo_location.lightning_strike*"
      - "sensor.home_lightning_distance"
      - "sensor.home_lightning_azimuth"
      - "sensor.home_lightning_counter"
```

If a `recorder:` block already exists, merge these entries into it instead of creating a second top-level key.

The actual number of lightning events processed by Home Assistant depends on the Blitzortung.org integration settings, especially the configured detection radius, time window and maximum number of simultaneously provided lightning events. Larger values can increase system and database load during high lightning activity.

The Recorder exclusion prevents long-term storage of these entities without disabling their live availability for Gewitterradar.

## 6. First smoke test

- The card loads and displays `V4.04`.
- `/config/www/community/gewitterradar/` contains `gewitterradar.js`, `app_gewitterradar_pkg.yaml` and the `assets/` directory.
- All four PNG files are present under `assets/`.
- `/config/packages/app_gewitterradar_pkg.yaml` exists and Home Assistant was restarted afterwards.
- The `lightning_detection_*` helpers are available.
- The Blitzortung.org source-status LED is plausible.
- Settings open correctly.
- Check observation, storm and danger radii; storm must be at least 5 KM and at least the current danger radius.
- Switch KM/MI.
- Check compass and Recent/history areas.
