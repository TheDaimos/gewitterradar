# Gewitterradar V4.03 — HACS release-asset priority fix

Gewitterradar V4.03 completes the HACS packaging correction after the V4.02 field test exposed a second HACS download rule.

V4.02 correctly removed the standalone `gewitterradar.js` release asset, but its release still contained the manual package, ZIP and checksum as custom GitHub release assets. Current HACS prioritizes *all* custom assets of the selected release before the repository `dist/` tree. As a result, HACS copied those three files into `/config/www/community/gewitterradar/` and never reached `dist/gewitterradar.js` or `dist/assets/`.

V4.03 resolves this deterministically: the GitHub release contains **zero custom release assets**. Only GitHub's automatically generated source archives remain. HACS therefore falls through to the tagged repository tree, resolves `dist/gewitterradar.js`, and installs the complete `dist/` hierarchy including all four PNG assets.

## Expected HACS installation

```text
/config/www/community/gewitterradar/
├── gewitterradar.js
└── assets/
    ├── gewitterradar-compass-frame-v1.png
    ├── gewitterradar-compass-frame-v2.png
    ├── gewitterradar-trend-arrow.png
    └── gewitterradar-trend-medallion.png
```

## Home Assistant package

The helper package remains part of the tagged repository at:

```text
home-assistant/app_gewitterradar_pkg.yaml
```

A HACS Dashboard repository cannot install this file into `/config/packages/`. Copy it manually to:

```text
/config/packages/app_gewitterradar_pkg.yaml
```

and ensure `configuration.yaml` contains:

```yaml
homeassistant:
  packages: !include_dir_named packages
```

Then restart Home Assistant. Existing `lightning_detection_*` entity IDs and package logic are unchanged.

Because V4.03 intentionally has no custom release assets, the package is downloaded from the tagged repository or from GitHub's automatically generated source-code archive rather than from a separate release asset.

## Upgrade from V4.01/V4.02

1. Refresh HACS and install/redownload Gewitterradar V4.03.
2. Confirm that `/config/www/community/gewitterradar/` contains `gewitterradar.js` and the `assets/` directory shown above.
3. Restore/copy `app_gewitterradar_pkg.yaml` to `/config/packages/` if the `lightning_detection_*` helpers are unavailable.
4. Restart Home Assistant after restoring the package.
5. Reload the browser or Companion App frontend cache if an older card remains visible.

## Preserved behavior

V4.03 changes packaging only. It does not change lightning processing, helper IDs/defaults, radius logic, clustering, Recent/history behavior, compass behavior, language variants, responsive layouts or the four optimized PNG bytes.

The visible card/build version is updated to V4.03 and asset cache keys advance to `v=403`.
