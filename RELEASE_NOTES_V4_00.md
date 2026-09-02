# Gewitterradar V4.00 — Release Notes

Gewitterradar V4.00 is the first stable major release of the Home Assistant lightning and thunderstorm dashboard.

## Highlights

- Live lightning visualization with Blitzortung.org data supplied through Home Assistant.
- Three coupled assessment zones for observation, storm and danger.
- Stable cluster browsing and individual-strike focus during live updates and map zooming.
- Recent activity, KPI/status panels, filters and a 120-minute activity history.
- Three compass designs with last/nearest strike modes and optional device orientation.
- 19 selectable language variants.
- Metric and imperial distance display with automatic near-range formatting.
- Direct radius editing from the values shown on the map.
- Responsive layouts refined for phones, tablets, iPad, iPad Pro and desktop.
- Public release history available from the version badge.
- Live source-status indicator for the configured lightning counter entity.

## Home Assistant Recorder recommendation

```yaml
recorder:
  exclude:
    entity_globs:
      - "geo_location.lightning_strike*"
      - "sensor.home_lightning_distance"
      - "sensor.home_lightning_azimuth"
      - "sensor.home_lightning_counter"
```

If a `recorder:` section already exists, integrate these entries into the existing section. Do not create a second top-level `recorder:` key.

The actual number of lightning entities depends on the Blitzortung.org integration settings, especially detection radius, time window and the configured maximum number of lightning events.
