# Changelog

> **Distribution status:** V4.00, V4.01 and V4.02 are no longer published as installable HACS releases. V4.00 was a valid first stable/manual baseline but its GitHub release used a ZIP asset layout that is not safe for the current HACS Dashboard download path. V4.01 and V4.02 were withdrawn after real HACS installation tests showed incomplete deployments. Their public GitHub releases/tags were removed; the V4.01/V4.02 versioned card source and release-note files were also removed from `main`. The historical entries remain here only for traceability. V4.03 is the first working HACS distribution; V4.04 is the current recommended release.

## V4.04 — HACS package staging

Gewitterradar V4.04 keeps the successful V4.03 HACS distribution path and improves the only remaining manual installation step.

### Changes

- Added a byte-identical copy of `home-assistant/app_gewitterradar_pkg.yaml` as `dist/app_gewitterradar_pkg.yaml`.
- HACS now downloads the helper package together with `gewitterradar.js` and the four PNG assets into `/config/www/community/gewitterradar/`.
- Users only need to copy or move the already local `app_gewitterradar_pkg.yaml` to `/config/packages/app_gewitterradar_pkg.yaml` and restart Home Assistant.
- The manual copy/move is intentionally required: a HACS Dashboard repository is installed inside `/config/www/community/<repository>/` and cannot deploy Home Assistant configuration files into `/config/packages/`.
- The canonical maintained package remains `home-assistant/app_gewitterradar_pkg.yaml`; CI verifies that the staged `dist/` copy is byte-identical.
- V4.04 continues to publish zero custom GitHub release assets so HACS cannot bypass the complete `dist/` tree.
- Added documentation, release notes and integrity checks for the staged package workflow.
- Updated card/build version to V4.04 and asset cache keys to `v=404`.
- No helper IDs/defaults, package logic, layouts, lightning-processing logic, compass behavior or PNG bytes changed.

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

## V4.02 — WITHDRAWN / defective HACS distribution

V4.02 removed the standalone `gewitterradar.js` release asset that had caused the V4.01 single-file installation path. The field test revealed a second HACS rule: the remaining custom release assets (`app_gewitterradar_pkg.yaml`, release ZIP and checksum) were still preferred over `dist/`, so HACS copied those files into `/config/www/community/gewitterradar/` and did not install the card or `assets/`.

This release was withdrawn. Its GitHub release/tag and versioned source/release-note files were removed so it cannot be selected as an installable HACS version.

### Historical changes

- Removed the standalone `gewitterradar.js` GitHub release asset.
- Added V4.02 installation/recovery documentation and verification checks.
- Preserved application logic, helper IDs and image bytes.

## V4.01 — WITHDRAWN / defective HACS distribution

Gewitterradar V4.01 introduced the optimized external PNG assets, but its HACS release packaging published `gewitterradar.js` as a standalone release asset. HACS consequently installed only that file and omitted the required graphics directory; the helper package was also not part of the installed HACS tree.

This release was withdrawn. Its GitHub release/tag and versioned source/release-note files were removed so it cannot be selected as an installable HACS version. The optimized PNG work itself was retained in later working releases.

### Historical changes

- Trend medallion reduced from 1254 × 1254 to 512 × 512 pixels.
- Trend arrow reduced from 1254 × 1254 to 256 × 256 pixels.
- Both compass frames conservatively reduced from 1254 × 1254 to 1152 × 1152 pixels.
- PNGs remain RGBA with full transparency and lossless PNG encoding.
- Combined asset size reduced from 5,966,253 to 2,321,551 bytes (61.09%).
- Asset cache keys updated for the optimized files.
- No functional, helper, layout or data-processing behavior changed.

## V4.00 — First stable release / historical manual baseline

Gewitterradar V4.00 consolidates the mature V3.x development cycle into the first stable major release. The application baseline itself remains part of project history, but its original GitHub release/tag was retired because the attached ZIP release asset is not compatible with the current HACS Dashboard distribution strategy and could otherwise be offered as a misleading installable version.

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
