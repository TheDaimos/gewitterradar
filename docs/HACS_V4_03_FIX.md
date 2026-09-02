# HACS packaging note — V4.03

V4.03 is the definitive HACS packaging correction for the V4.01/V4.02 installation failures.

## Observed HACS behavior

For a selected GitHub release, current HACS checks custom release assets before falling back to the tagged repository tree. If the release contains any custom assets, HACS downloads those assets and returns without processing the repository `dist/` hierarchy.

This means that even release assets whose names do not match `gewitterradar.js` can prevent `dist/gewitterradar.js` and `dist/assets/` from being installed.

## Required release rule

The HACS release must contain **zero custom GitHub release assets**.

The tagged repository itself contains:

```text
dist/
├── gewitterradar.js
└── assets/
    ├── gewitterradar-compass-frame-v1.png
    ├── gewitterradar-compass-frame-v2.png
    ├── gewitterradar-trend-arrow.png
    └── gewitterradar-trend-medallion.png
```

With no custom release assets present, HACS falls through to the tagged repository tree, resolves `dist/gewitterradar.js`, and installs the complete `dist/` hierarchy.

GitHub's automatically generated source-code ZIP/TAR archives are not custom release assets and remain available.

## Home Assistant package

`home-assistant/app_gewitterradar_pkg.yaml` remains manual. It must not be attached as a custom release asset to the HACS release, because that would again trigger release-asset-first downloading. Obtain it from the tagged repository or the automatically generated source archive and copy it to `/config/packages/app_gewitterradar_pkg.yaml`.

The V4.03 CI verification explicitly rejects a release workflow that passes custom asset files to `gh release create v4.03`.
