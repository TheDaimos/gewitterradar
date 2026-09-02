# Changelog

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
