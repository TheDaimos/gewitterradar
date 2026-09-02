# Gewitterradar V4.01 — Release Notes

Gewitterradar V4.01 is a focused maintenance release based on the frozen V4.00 codebase. It conservatively reduces the dimensions and payload of the four external PNG interface assets without changing application behavior, helper IDs, layouts or lightning-processing logic.

## Asset optimization

| Asset | V4.00 dimensions | V4.01 dimensions | V4.00 bytes | V4.01 bytes | Reduction |
| --- | ---: | ---: | ---: | ---: | ---: |
| Trend medallion | 1254 × 1254 | 512 × 512 | 2,592,711 | 448,794 | 82.69% |
| Trend arrow | 1254 × 1254 | 256 × 256 | 1,266,532 | 60,981 | 95.19% |
| Compass frame V1 | 1254 × 1254 | 1152 × 1152 | 1,294,563 | 1,065,811 | 17.67% |
| Compass frame V2 | 1254 × 1254 | 1152 × 1152 | 812,447 | 745,965 | 8.18% |
| **Total** |  |  | **5,966,253** | **2,321,551** | **61.09%** |

All four files remain 8-bit RGBA PNGs with transparency. The new dimensions retain approximately 3.71× source-pixel reserve for the trend assets at their maximum CSS display size and 2.68× reserve for the compass frames.

## Preserved V4.00 capabilities

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

## Upgrade note

Replace the JavaScript file and all four PNG assets together. V4.01 uses refreshed internal asset cache keys; the Lovelace resource URL should also use `?v=4_01`.

## Installation options

- **HACS Dashboard:** Add `https://github.com/TheDaimos/gewitterradar` as a custom Dashboard repository. HACS installs the JavaScript card and its visual assets through the stable `gewitterradar.js` entry point.
- **Manual:** Follow the German or English installation guide included in the repository.

The Home Assistant package containing the required `lightning_detection_*` helpers is not installed by HACS and must be copied to `/config/packages/` separately.

The HACS distribution is generated reproducibly from the approved V4.01 source. Automated checks verify that only the four asset URLs differ, that all PNG checksums match and that the HACS manifest points to `gewitterradar.js`.

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
