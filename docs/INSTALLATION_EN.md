# Gewitterradar V4.02 – Installation (EN)

## Requirements

- Running Home Assistant installation.
- Blitzortung.org integration providing the required lightning/counter entities.
- Default counter used by the example: `sensor.home_lightning_counter`.

## Option A: Install through HACS

1. Add `TheDaimos/gewitterradar` to HACS as a custom **Dashboard** repository.
2. Install Gewitterradar V4.02, or use **Redownload** when upgrading.
3. HACS installs the stable `gewitterradar.js` entry point and the complete `assets/` directory under `/config/www/community/gewitterradar/`. Home Assistant exposes this through `/hacsfiles/gewitterradar/`.
4. Install the Home Assistant package manually. A HACS Dashboard repository cannot copy files into `/config/packages/`.

After installation, the directory must contain at least:

```text
/config/www/community/gewitterradar/
├── gewitterradar.js
└── assets/
    ├── gewitterradar-compass-frame-v1.png
    ├── gewitterradar-compass-frame-v2.png
    ├── gewitterradar-trend-arrow.png
    └── gewitterradar-trend-medallion.png
```

If Lovelace resources are managed in YAML, use this module URL:

```text
/hacsfiles/gewitterradar/gewitterradar.js
```

### Upgrade note for V4.01

V4.01 exposed a standalone `gewitterradar.js` GitHub release asset. HACS could therefore select a single-file installation and omit `assets/`. V4.02 removes that release layout. After redownloading V4.02, the `assets/` directory shown above must be present.

## Option B: Manual installation

### 1. Copy JavaScript and assets

- Copy `gewitterradar-card-v4_02.js` to `/config/www/gewitterradar/gewitterradar-card-v4_02.js`.
- Copy the four PNG files from `dist/assets/` to `/config/www/gewitterradar/assets/`.

Expected asset files:

- `gewitterradar-trend-medallion.png`
- `gewitterradar-trend-arrow.png`
- `gewitterradar-compass-frame-v1.png`
- `gewitterradar-compass-frame-v2.png`

### 2. Add the Lovelace resource

Register the card as a JavaScript module:

```text
/local/gewitterradar/gewitterradar-card-v4_02.js?v=4_02
```

After updates, refresh the browser or Companion App cache.

## 3. Install the Home Assistant package

Copy `home-assistant/app_gewitterradar_pkg.yaml` to `/config/packages/app_gewitterradar_pkg.yaml`.

The same package is also published as a separate V4.02 release asset for convenient download without extracting the complete release ZIP.

`configuration.yaml` must include packages:

```yaml
homeassistant:
  packages: !include_dir_named packages
```

Existing `lightning_detection_*` helper IDs are intentionally preserved. Package logic is unchanged from V4.01. Restart Home Assistant afterwards.

If stale helpers are already shown as unavailable because the package file was missing, restore the package and perform a full Home Assistant restart. With the same entity IDs, the YAML helpers are provided again under their existing IDs.

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

- The card loads and displays `V4.02`.
- A HACS installation contains all four PNG files under `/config/www/community/gewitterradar/assets/`.
- The Blitzortung.org source-status LED is plausible.
- Settings open correctly.
- Check observation, storm and danger radii; storm must be at least 5 KM and at least the current danger radius.
- Switch KM/MI.
- Check compass and Recent/history areas.
