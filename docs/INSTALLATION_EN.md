# Gewitterradar V4.00 – Installation (EN)

## Requirements

- Running Home Assistant installation.
- Blitzortung.org integration providing the required lightning/counter entities.
- Default counter used by the example: `sensor.home_lightning_counter`.

## 1. Copy JavaScript and assets

- Copy `gewitterradar-card-v4_00.js` to `/config/www/gewitterradar/gewitterradar-card-v4_00.js`.
- Copy the four PNG files from `assets/` to `/config/www/gewitterradar/assets/`.

Expected asset files:

- `gewitterradar-trend-medallion.png`
- `gewitterradar-trend-arrow.png`
- `gewitterradar-compass-frame-v1.png`
- `gewitterradar-compass-frame-v2.png`

## 2. Add the Lovelace resource

Register the card as a JavaScript module:

```text
/local/gewitterradar/gewitterradar-card-v4_00.js?v=4_00
```

After updates, refresh the browser or Companion App cache.

## 3. Install the Home Assistant package

Copy `home-assistant/app_gewitterradar_pkg.yaml` to `/config/packages/app_gewitterradar_pkg.yaml`.

`configuration.yaml` must include packages:

```yaml
homeassistant:
  packages: !include_dir_named packages
```

Existing `lightning_detection_*` helper IDs are intentionally preserved. Restart Home Assistant afterwards.

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

- The card loads and displays `V4.00`.
- The Blitzortung.org source-status LED is plausible.
- Settings open correctly.
- Check observation, storm and danger radii; storm must be at least 5 KM and at least the current danger radius.
- Switch KM/MI.
- Check compass and Recent/history areas.
