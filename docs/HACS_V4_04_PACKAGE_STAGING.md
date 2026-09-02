# HACS packaging note — V4.04 package staging

V4.04 preserves the V4.03 HACS rule that the GitHub release must contain **zero custom release assets**. This is required because current HACS prioritizes custom release assets before the tagged repository `dist/` tree.

## V4.04 dist layout

The tagged repository now contains:

```text
dist/
├── app_gewitterradar_pkg.yaml
├── gewitterradar.js
└── assets/
    ├── gewitterradar-compass-frame-v1.png
    ├── gewitterradar-compass-frame-v2.png
    ├── gewitterradar-trend-arrow.png
    └── gewitterradar-trend-medallion.png
```

Because the V4.04 GitHub release contains no custom assets, HACS falls through to this `dist/` tree and installs all of it below:

```text
/config/www/community/gewitterradar/
```

The staged `dist/app_gewitterradar_pkg.yaml` is generated from the canonical `home-assistant/app_gewitterradar_pkg.yaml`, and CI verifies that both files are byte-identical.

## Manual boundary

HACS can deliver the package into its Dashboard repository directory, but it cannot complete the Home Assistant package installation for this repository. The user must manually copy or move:

```text
/config/www/community/gewitterradar/app_gewitterradar_pkg.yaml
```

to:

```text
/config/packages/app_gewitterradar_pkg.yaml
```

This manual boundary is intentional. A HACS Dashboard repository is installed under `/config/www/community/<repository>/`; it does not deploy Home Assistant configuration files into `/config/packages/`.

Copying is recommended so the HACS staging copy remains available. After copying or replacing the package, Home Assistant must be restarted.

## Regression protection

V4.04 CI verifies all of the following:

- `dist/gewitterradar.js` matches the approved V4.04 source except for HACS-relative asset URLs;
- all four PNG checksums match;
- `dist/app_gewitterradar_pkg.yaml` exactly matches `home-assistant/app_gewitterradar_pkg.yaml`;
- the package is included in the internal source ZIP;
- the V4.04 `gh release create` command contains no custom asset arguments.

Do not attach `gewitterradar.js`, the package, a project ZIP, checksum files, or other custom assets to the V4.04 HACS GitHub release. Doing so can cause HACS to bypass the tagged `dist/` tree again.
