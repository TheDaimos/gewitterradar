# Gewitterradar V4.02 — HACS packaging hotfix

Gewitterradar V4.02 fixes an installation defect in the V4.01 HACS distribution. V4.01 published `gewitterradar.js` as a standalone GitHub release asset. HACS correctly preferred that matching release asset, but consequently treated the card as a single-file installation and did not copy the required `dist/assets/` directory.

V4.02 removes that ambiguity. The GitHub release no longer contains a standalone asset named `gewitterradar.js`; HACS therefore resolves the stable card entry point from `dist/gewitterradar.js` in the tagged repository and installs the complete `dist/` tree.

## Fixed

- HACS now installs `gewitterradar.js` together with all four required PNG files.
- The expected HACS layout is:

```text
/config/www/community/gewitterradar/
├── gewitterradar.js
└── assets/
    ├── gewitterradar-compass-frame-v1.png
    ├── gewitterradar-compass-frame-v2.png
    ├── gewitterradar-trend-arrow.png
    └── gewitterradar-trend-medallion.png
```

- The card's HACS asset references continue to be resolved relative to `import.meta.url`.
- Asset cache keys advance from `v=401` to `v=402` so clients do not retain stale V4.01 asset URLs.
- The V4.02 release workflow explicitly avoids publishing a standalone `gewitterradar.js` release asset, preventing recurrence of the single-file HACS path.

## Home Assistant package

The required helper package remains:

```text
home-assistant/app_gewitterradar_pkg.yaml
```

HACS installs Dashboard resources only and cannot copy this file to `/config/packages/`. Copy it manually to:

```text
/config/packages/app_gewitterradar_pkg.yaml
```

and ensure `configuration.yaml` contains:

```yaml
homeassistant:
  packages: !include_dir_named packages
```

Then restart Home Assistant. Existing `lightning_detection_*` entity IDs remain unchanged. The package logic itself is unchanged from V4.01.

For convenience, V4.02 publishes `app_gewitterradar_pkg.yaml` as a separate release asset in addition to including it in the full release ZIP.

## Upgrade from the affected V4.01 HACS installation

1. Refresh HACS and install/redownload Gewitterradar V4.02.
2. Confirm that `/config/www/community/gewitterradar/assets/` contains all four PNG files shown above.
3. Confirm the Lovelace resource points to `/hacsfiles/gewitterradar/gewitterradar.js` (HACS normally manages this automatically).
4. Copy/restore `app_gewitterradar_pkg.yaml` under `/config/packages/` if the `lightning_detection_*` helpers are unavailable.
5. Restart Home Assistant after restoring the package.
6. Reload the browser or Companion App frontend cache if an older card remains visible.

## Preserved V4.01 behavior

V4.02 is intentionally narrow. It does not change:

- lightning processing or Blitzortung.org entity handling;
- observation, storm or danger radius behavior;
- helper IDs, defaults or state restoration;
- clustering, Recent/history handling or map behavior;
- compass logic or the four optimized PNG image bytes;
- language variants or responsive layouts.

The visible card/build version is updated to V4.02 and a V4.02 entry is added to the built-in release history.
