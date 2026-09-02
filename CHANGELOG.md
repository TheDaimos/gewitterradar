# Changelog

## V4.03 — HACS release-asset priority fix

Gewitterradar V4.03 completes the HACS packaging correction after the V4.02 field test showed that current HACS prioritizes any custom assets attached to the selected GitHub release before the repository `dist/` tree.

### Changes

- V4.03 publishes **zero custom GitHub release assets**.
- HACS therefore falls through to `dist/gewitterradar.js` and installs the complete `dist/` tree including `dist/assets/`.
- The expected HACS installation contains `gewitterradar.js` plus all four PNG files below `assets/`.
- The Home Assistant package remains manual and is available from `home-assistant/app_gewitterradar_pkg.yaml` in the tagged repository or GitHub's automatically generated source archive.
- Added a regression check that requires the V4.03 `gh release create` command to contain no custom asset arguments.
- Updated card/build version to V4.03 and asset cache keys to `v=403`.
- No helper IDs, defaults, layouts, lightning-processing logic, compass behavior or PNG bytes changed.

## V4.02 — HACS packaging hotfix

V4.02 removed the standalone `gewitterradar.js` release asset that had caused the V4.01 single-file installation path. The field test revealed a second HACS rule: the remaining custom release assets (`app_gewitterradar_pkg.yaml`, release ZIP and checksum) were still preferred over `dist/`, so HACS copied those files into `/config/www/community/gewitterradar/` and did not install the card or `assets/`. V4.03 supersedes this incomplete packaging correction.

### Changes

- Removed the standalone `gewitterradar.js` GitHub release asset.
- Added V4.02 installation/recovery documentation and verification checks.
- Preserved application logic, helper IDs and image bytes.

## V4.01 — Asset optimization

Gewitterradar V4.01 keeps the V4.00 feature set unchanged and reduces the external PNG asset payload.

### Changes

- Trend medallion reduced from 1254 × 1254 to 512 × 512 pixels.
- Trend arrow reduced from 1254 × 1254 to 256 × 256 pixels.
- Both compass frames conservatively reduced from 1254 × 1254 to 1152 × 1152 pixels.
- PNGs remain RGBA with full transparency and lossless PNG encoding.
- Combined asset size reduced from 5,966,253 to 2,321,551 bytes (61.09%).
- Asset cache keys updated so Home Assistant clients load the V4.01 files immediately.
- No functional, helper, layout or data-processing behavior changed.
- HACS Dashboard compatibility added through `hacs.json` and the stable `dist/gewitterradar.js` entry point.
- The HACS entry point resolves its visual assets relative to `/hacsfiles/`; the approved manual V4.01 card remains byte-identical.
- Added reproducible HACS build, integrity verification and automatic repository validation.

## V4.00 — First stable release

Gewitterradar V4.00 consolidates the mature V3.x development cycle into the first stable major release.

### Highlights

- Live lightning visualization through Home Assistant / Blitzortung.org.
- Three coupled assessment zones for observation, storm and danger.
- Stable cluster browsing and individual-strike focus during live updates and map zooming.
- Recent activity, KPI/status panels, filters and a 120-minute activity history.
- Three compass designs with last/nearest strike modes and optional device orientation.
- 19 selectable language variants.
- Metric and imperial distance display with automatic near-range formatting.
- Direct radius editing from the map.
- Responsive layouts for phones, tablets, iPad, iPad Pro and desktop.
- Public release history accessible from the version badge.
- Live source-status indicator for the configured lightning counter entity.

### Earlier public milestones

- **V3.997** — Interface and usability refinement.
- **V3.996** — Release hardening.
- **V3.994** — Stability, navigation and internationalization.
- **V3.993** — Pre-release feature consolidation.
- **V3.98** — Core interface evolution.
