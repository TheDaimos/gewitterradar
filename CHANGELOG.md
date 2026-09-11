# Changelog

## Unreleased — V4.06 / native integration 0.18.0

### Added

- Add the localized premium Help & Notes dialog for all 19 language variants.
- Reuse the approved Settings signature in the Welcome footer and add the compact author/version line `V4.06 · Visual V2 · Gewitterradar · by CK`.
- Add dedicated V4.06 project history, milestone tracking, Recorder locale audit and release-note documentation.

### Improved

- Refine Settings/About premium hierarchy, localized About headers and language-onboarding readability.
- Strengthen the metallic gold frames and controlled shimmer in Settings and Help while preserving the accepted dark premium appearance.
- Harmonize the premium close control across Settings, Help and About using the approved close artwork and keep 44×44 interaction targets.
- Reuse the approved scroll artwork for Recorder YAML copy actions.
- Reuse the Welcome gear geometry/material in the Main view and Help, with device-independent rendering.
- Normalize Help icon alignment across Desktop, Android, iPad and iPad Pro; enlarge the prerequisites/home symbol for clearer balance.
- Keep the two premium Settings entry buttons side by side on mobile portrait where the available width permits it.
- Refine About accordion chevron placement and premium section hierarchy.
- Tune the German mobile-portrait dedication layout without changing other device layouts.
- Enlarge the Welcome radius value badges (`70 KM`, `30 KM`, `5 KM`) by about 25% and vertically center them with their respective rows.
- Move the Settings version label from the header into the lower-left free area.
- Align Welcome footer controls, signature, gear and version information for Desktop, Android and tablet layouts.
- Increase the personal signature presence on Android/mobile while preserving the exact approved signature artwork.

### Fixed

- Fix iPad/iPad Pro WebKit focus artifacts around the About close control and around the reopened About dialog without changing the accepted premium X asset.
- Keep the Welcome footer version line visible and footnote-like on iPad/iPad Pro.
- Fix the Greek About header on mobile portrait by letting the claim flow below the longer Greek subtitle instead of overlapping it; the Greek translation remains unchanged.
- Replace fixed Recorder sensor IDs with multi-device wildcard patterns.

### Delivery and validation

- Version the dashboard helper package as `app_gewitterradar_v4_06_pkg.yaml` and verify its global language marker.
- Build the shared frontend, lazy locale module, assets and package deterministically into both delivery forms.
- Keep dashboard and native-integration frontend payloads byte-identical.
- Extend browser regression coverage across Desktop, iPad, iPad Pro, Android portrait and Android landscape for both delivery forms, including the Greek mobile-portrait header flow.
- Complete the real Android portrait acceptance of the Greek header-flow correction.
- Audit Recorder guidance across all 19 registered language variants: four current wildcard sources, existing-`recorder:` merge guidance, live-state behavior, historical-data behavior, multi-device semantics and localized copy texts.
- Add `scripts/test-recorder-locales.mjs` as a fail-closed CI gate against incomplete Recorder guidance or legacy fixed `sensor.home_lightning_*` Recorder IDs.
- Continue validating Home Assistant runtime behavior, HACS, Hassfest, package contracts and deterministic frontend reconstruction independently.

## Shared V4.05 frontend and premium controls

- Import the frozen V4.05 frontend once into `frontend/`; derive integration and dashboard payloads with exact SHA-256 parity and a fail-closed approved-delta guard.
- Use the supplied transparent close/copy artwork while preserving all dialog and clipboard handlers, 44×44 hit targets, content and layout. Remove only the visible `DEV` label.
- Serve the integration-local payload using supported asynchronous HTTP static registration; resource registration remains manual.
- Add both-delivery browser coverage, frozen-reference comparison and native HTTP route tests.


## 0.17.0 — release-candidate preparation

Initial native Home Assistant integration release line.

### Added

- UI Config Flow with a single Config Entry.
- Persistent settings backed by `ConfigEntry.options`.
- Typed per-entry runtime state.
- 16 native configuration entities: 4 Selects, 5 Numbers and 7 Switches.
- Validation for configuration values and ordered observation/storm/danger radii.
- Dynamic `person.*` and `zone.*` reference-location choices.
- One-time, native-wins, non-destructive migration from supported legacy `lightning_detection_*` helpers.
- Package/helper-free fresh-install path.
- Documented unload/re-enable, deletion and rollback semantics.
- Integration-local Home Assistant brand icons.
- GPL-3.0-only software/documentation licensing with separate reserved branding policy.
- HACS Integration, Hassfest, deterministic package and Home Assistant runtime validation workflows.

### Fixed during public real-install validation

- Reclassified the Config Entry from Home Assistant `helper` to `service`. The 2026 frontend Integrations dashboard intentionally filters helper Config Entries out, which made a correctly loaded Gewitterradar entry appear to have disappeared after installation/restart.
- Replaced the direct `async_write_ha_state()` call in the dynamic reference-location listener with Home Assistant's thread-safe `schedule_update_ha_state()` path. This addresses the real-install `RuntimeError` reported when a location add/remove callback was dispatched outside the event loop.
- Added regression coverage for the user-visible integration classification and the thread-safe dynamic-location callback.
- Recorded the first real HACS installation findings and separated current-integration defects from historical Entity Registry/HACS leftovers.

### Real-install evidence

- Public HACS repository installation completed successfully.
- Config Entry reached `loaded` state.
- All 16 native configuration entities were present.
- Configuration values persisted unchanged across a full Home Assistant restart.
- HACS repository state changed from `pending-restart` to `installed` after the full restart.
- Public HACS repository validation passes all 9 checks.

### Compatibility

- Designed to coexist with the frozen Gewitterradar V4.04 Dashboard/Card migration baseline.
- Dashboard/Card distribution remains separate at `TheDaimos/gewitterradar-dashboard`.
- The Blitzortung.org Home Assistant integration remains the live lightning-event data source used by the Dashboard.

### Known limitation

- Historical `device_tracker.*` reference selections are not automatically migrated.
- Historical unavailable Entity Registry entries and stale HACS update entities are intentionally not deleted automatically by the native integration.

### Release gates still open

- HACS update to the corrected real-install candidate;
- full-restart verification that Gewitterradar remains visible under Devices & services → Integrations;
- trigger/re-check dynamic `person.*` / `zone.*` changes with no thread-safety error;
- real HACS rollback and re-update proof;
- final Android/iPad frontend spot checks, including Android last-compass persistence.
