# Changelog

## 2026/09 — V4.07 TEST CANDIDATE / native integration 0.19.0

> **Nicht veröffentlicht.** Dieser Stand lebt ausschließlich auf dem V4.07-Feature-Branch. V4.06 bleibt die eingefrorene Release-/Rückfallbasis.

### Added

- Add a Gewitterradar-owned modern GPS `device_tracker` as the movable reference adapter for worldwide locations.
- Add `gewitterradar.set_reference_coordinates` to atomically move the product-owned tracker and select it as the active Gewitterradar reference.
- Add read-only Blitzortung linkage diagnostics without mutating foreign ConfigEntries or `.storage`.
- Add `app_gewitterradar_v4_07_pkg.yaml` with a separate dashboard Template `device_tracker` and coordinate-set script.
- Document the one-time semi-automatic Blitzortung setup and the permanent distinction between requested reference location and active lightning-data region.
- Record the upstream task to contact the Blitzortung developer about an officially supported coordinate ↔ location-entity reconfigure path.

### Safety / compatibility

- Do not use deprecated `device_tracker.see`.
- Do not rewrite Blitzortung ConfigEntries.
- Keep native and dashboard tracker IDs distinct so both delivery forms can coexist during testing.
- Keep the accepted V4.06 shared frontend unchanged in this backend test candidate; worldwide search UI remains the next bounded frontend integration job.
- Do not claim lightning-data synchronization merely because the Gewitterradar tracker moved; Blitzortung applies its own movement threshold and subscription lifecycle.

### Validation still required before release

- Real Home Assistant install/restart/restore test for integration 0.19.0.
- Real Blitzortung one-time tracker configuration and large/small location-move regression.
- Package validation on a real Dashboard installation.
- Canonical dropdown/search UI wiring, saved-place persistence and cross-device regression.
- HACS/Hassfest/release gates and derived-dashboard synchronization after candidate acceptance.

## 2026/09 — V4.06 / native integration 0.18.0

### Added

- Add the localized premium Help & Notes dialog for **15 languages plus 4 dialect variants (19 variants total)**.
- Reuse the approved Settings signature in the Welcome footer and add the final release stamp `2026/09 · V4.06 · Gewitterradar · by CK`.
- Add `2026/09 · V4.06` to the lower-left Settings area and to the Release History header.
- Complete the visible Release History with V4.06 and the previously missing V4.05, and add `YYYY/MM` to all published history entries.
- Add `V4.07 · PLANNED — Worldwide location search` as the next planned development topic without presenting it as shipped functionality.
- Add dedicated V4.06 project history, milestone tracking, Recorder locale audit, binding release-process documentation and release notes.

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
- Align Welcome footer controls, signature, gear and version information for Desktop, Android and tablet layouts.
- Increase the personal signature presence on Android/mobile while preserving the exact approved signature artwork.
- Derive the visible `YYYY/MM` release stamp from the canonical `GEWITTERRADAR_BUILD` metadata instead of maintaining separate date strings.

### Fixed

- Fix iPad/iPad Pro WebKit focus artifacts around the About close control and around the reopened About dialog without changing the accepted premium X asset.
- Keep the Welcome footer version line visible and footnote-like on iPad/iPad Pro.
- Fix the Greek About header on mobile portrait by letting the claim flow below the longer Greek subtitle instead of overlapping it; the Greek translation remains unchanged.
- Replace fixed Recorder sensor IDs with multi-device wildcard patterns.
- Restore V4.05 to the visible Release History so the public V4.00–V4.06 sequence is complete.

### Delivery and validation

- Version the dashboard helper package as `app_gewitterradar_v4_06_pkg.yaml` and verify its global language marker.
- Build the shared frontend, lazy locale module, assets and package deterministically into both delivery forms.
- Keep dashboard and native-integration frontend payloads byte-identical.
- Extend browser regression coverage across Desktop, iPad, iPad Pro, Android portrait and Android landscape for both delivery forms, including the Greek mobile-portrait header flow.
- Add dedicated browser checks for the final `YYYY/MM` release stamps and Release History chronology.
- Complete the real Android portrait acceptance of the Greek header-flow correction.
- Audit Recorder guidance across all 19 registered language variants: four current wildcard sources, existing-`recorder:` merge guidance, live-state behavior, historical-data behavior, multi-device semantics and localized copy texts.
- Add `scripts/test-recorder-locales.mjs` as a fail-closed CI gate against incomplete Recorder guidance or legacy fixed `sensor.home_lightning_*` Recorder IDs.
- Add a binding per-release chronology checklist in `docs/RELEASE_PROCESS.md` and mirror the rule in `PROJECT_DEFAULTS.md`.
- Validate Home Assistant runtime behavior, HACS, Hassfest, package contracts and deterministic frontend reconstruction independently before the final freeze.

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

### Historical release-candidate gates

The following gates belonged to the earlier 0.17.0 candidate phase and are retained as historical evidence:

- HACS update to the corrected real-install candidate;
- full-restart verification that Gewitterradar remains visible under Devices & services → Integrations;
- trigger/re-check dynamic `person.*` / `zone.*` changes with no thread-safety error;
- real HACS rollback and re-update proof;
- final Android/iPad frontend spot checks, including Android last-compass persistence.
