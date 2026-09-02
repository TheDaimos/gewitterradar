# Gewitterradar V4.04 — HACS package staging

Gewitterradar V4.04 builds on the working V4.03 HACS distribution and simplifies the only remaining manual installation step.

V4.03 established the correct HACS layout by publishing **zero custom GitHub release assets**, which forces current HACS to install the tagged `dist/` tree. V4.04 keeps that mechanism unchanged and adds the Home Assistant helper package directly to that tree as `dist/app_gewitterradar_pkg.yaml`.

## What HACS installs

After installing or redownloading V4.04, the expected local structure is:

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

The package placed there by HACS is byte-identical to the canonical repository file:

```text
home-assistant/app_gewitterradar_pkg.yaml
```

## One manual step is still required

Copy or move:

```text
/config/www/community/gewitterradar/app_gewitterradar_pkg.yaml
```

to:

```text
/config/packages/app_gewitterradar_pkg.yaml
```

Copying is recommended so the HACS-provided staging copy remains available.

This step **cannot be automated by the Gewitterradar HACS Dashboard repository**. HACS installs Dashboard repository content inside `/config/www/community/gewitterradar/`; it does not deploy Home Assistant configuration files into `/config/packages/`. V4.04 therefore delivers the package locally through HACS but deliberately leaves the final configuration-file copy/move to the user.

Ensure `configuration.yaml` contains:

```yaml
homeassistant:
  packages: !include_dir_named packages
```

Then perform a full Home Assistant restart.

Existing `lightning_detection_*` entity IDs and the package logic are unchanged. If helpers were previously shown as unavailable because the package was missing, restore the package and restart Home Assistant before deleting any stale entities.

## HACS/release safeguards

- The V4.04 GitHub release still contains **zero custom release assets**.
- HACS therefore continues to resolve the installation from the tagged `dist/` tree.
- `dist/app_gewitterradar_pkg.yaml` is included in that tree alongside `gewitterradar.js` and `dist/assets/`.
- CI verifies that `dist/app_gewitterradar_pkg.yaml` is byte-identical to `home-assistant/app_gewitterradar_pkg.yaml`.
- CI verifies the four PNG checksums and the approved V4.04 JavaScript source.
- CI rejects custom asset arguments in the V4.04 GitHub release command to prevent a regression to the V4.01/V4.02 HACS download path.

## Upgrade from V4.03

1. Refresh HACS and install/redownload Gewitterradar V4.04.
2. Confirm that `/config/www/community/gewitterradar/` contains `gewitterradar.js`, `app_gewitterradar_pkg.yaml` and `assets/`.
3. Copy or move `app_gewitterradar_pkg.yaml` to `/config/packages/app_gewitterradar_pkg.yaml`.
4. Restart Home Assistant.
5. Reload the browser or Companion App frontend cache if an older card remains visible.

## Preserved behavior

V4.04 changes distribution and documentation only. It does not change:

- lightning processing or Blitzortung.org entity handling;
- helper IDs, defaults or state restoration;
- observation, storm or danger radius behavior;
- clustering, Recent/history handling or map behavior;
- compass logic or optimized PNG image bytes;
- language variants or responsive layouts.

The visible card/build version is updated to V4.04 and asset cache keys advance to `v=404`.
