# Changelog

## V4.09.06 TEST CANDIDATE — frei verschiebbare Standort-Pille

> **Noch nicht veröffentlicht.** V4.09.06 erweitert die Vollbild-Bedienung um eine frei verschiebbare Standort-Pille und ein positions-/platzabhängig adaptives Standortmenü.

### Added / Changed

- Standort-Pille im Vollbild auf Desktop, Android und iPad/iPad Pro frei verschiebbar.
- Normalisierte Position lokal gespeichert unter `gewitterradar:v409:map-location-position`.
- Obere Position: Standortmenü bevorzugt nach unten.
- Untere Position: Standortmenü bevorzugt nach oben.
- Mittlere Position: Standortmenü bevorzugt mehrspaltig.
- Reicht der Platz in der bevorzugten Öffnungsrichtung für eine einspaltige Liste nicht aus, wird automatisch auf 2 bzw. auf breiteren Geräten bis zu 3 Spalten erweitert.
- Android bleibt auf maximal 2 Spalten begrenzt.
- Reicht auch die Mehrspaltigkeit nicht aus, scrollt nur die Standortliste intern.
- Bei geöffneter Standortliste wird die Anordnung **während des Verschiebens der Pille live neu berechnet**.
- Drag-Geste verwendet denselben Pointer-/Touch-Schutz wie die V4.09.05-Instrumente; ein Drag löst anschließend nicht versehentlich den Standort-Klick aus.
- Separate Fensterkennung auf `gewitterradar_window_version=40906` angehoben.


## V4.09.05 TEST CANDIDATE — Android-Touch-Dragging

> **Noch nicht veröffentlicht.** V4.09.04 funktionierte auf Desktop vollständig, auf Android ließen sich Kompass und Medaillon jedoch nur ein-/ausblenden, nicht per Finger verschieben. V4.09.05 ergänzt deshalb einen nativen Touch-Event-Fallback und verkleinert das Vollbild-Medaillon ausschließlich auf Android um 15 %.

### Fixed

- Add a real non-passive `touchstart/touchmove/touchend/touchcancel` fallback for fullscreen Compass and Medallion in addition to Pointer Events.
- Keep Pointer Events as the normal mouse/pen path and as a fallback where touch pointer capture works.
- Prevent Leaflet/browser panning from stealing the instrument gesture by handling the touch sequence on the overlay target with `passive:false` and capture enabled.
- Preserve independent normalized saved positions and visibility for Compass and Medallion.
- Render the fullscreen Medallion **exactly 15 % smaller on Android only**; Desktop and iPad sizing stay unchanged.
- Advance the separate-window marker to `gewitterradar_window_version=40905`.

### Validation

- Browser matrix now supplies realistic Android/iPad user agents and validates the Android-only size class.
- Fix the synthetic PointerEvent regression test to mark generated touch pointers as primary, matching real device behavior.
- Static contract requires the native touch fallback, Android detection and the 15 % mobile size rule.


## V4.09.04 TEST CANDIDATE — Vollbild-Overlay-Dragging und reines Trendmedaillon

> **Noch nicht veröffentlicht.** Reale Android-Prüfung von V4.09.03 zeigte, dass der sichtbare Kompass-Touchbereich nicht zuverlässig als Drag-Fläche wirkte und das Kartenmedaillon durch die gemeinsame `.trend`-Layoutklasse den History-/Trendblock beeinflussen konnte. V4.08 bleibt unveränderte öffentliche Rückfallbasis; Merge, Freeze, Golden Master und öffentlicher Release bleiben bis zur erneuten Geräteabnahme gesperrt.

### Fixed

- Harden fullscreen **Compass dragging on Desktop, Android and iPad/iPad Pro** by making the overlay itself the pointer/touch hit surface and preventing the nested compass DOM from stealing drag input.
- Apply the same cross-device pointer/touch model to the fullscreen **Medallion** while retaining independent normalized local position and visibility persistence.
- Decouple the fullscreen Medallion from the History/Trend layout: the map overlay now contains **only the medallion artwork plus its trend arrow**, with dedicated `none / up / stable / down` state styling and no History label, copy or panel structure.
- Move the red/blue/gold layer-view control further down and calculate its lower inset from the live Leaflet attribution height, leaving a compact safety gap immediately above **Leaflet / OpenStreetMap** without covering attribution.
- Keep the layer-view control at the highest map interaction z-index and preserve the existing fullscreen location control, warning-test fail-closed behavior, Standard/Groß/Vollbild modes and separate-window path.
- Advance the separate-window marker to `gewitterradar_window_version=40904`.

### Validation and documentation

- Extend the static V4.09 contract to reject any return of the History `.trend` class on the map Medallion and to require attribution-aware positioning plus protected pointer hit surfaces.
- Extend the Playwright Desktop/iPad/Android matrix for Dashboard and Integration with pure-Medallion checks, overlay/child pointer-event checks and the small gap above Leaflet attribution.
- Update the bilingual in-product Release History to **V4.09.04 · DEV · 2026/09**.
- Add dedicated V4.09.04 implementation notes, test release notes and a new Git-backed handoff.


## V4.09.03 TEST CANDIDATE — Vollbild-Bedienelemente und Sichtbarkeit

> **Noch nicht veröffentlicht.** Baut ausschließlich auf dem V4.09.02-Kartenansichtsblock auf. V4.08 bleibt unveränderte öffentliche Rückfallbasis; Merge, Freeze, Golden Master und öffentlicher Release bleiben bis zur realen Geräteabnahme gesperrt.

### Fixed

- Hide all warning-test controls **fail-closed** whenever the Warnsystem-Simulation helper is not explicitly `on`; this remains effective after the map card is reparented into the fullscreen dialog.
- Insert the existing reference-location control automatically at the **upper-right** of fullscreen and move its existing dropdown into the fullscreen top layer so the same location workflow remains usable there.
- Keep the compact red/blue/gold **layer-view control permanently above every other map overlay**; its menu therefore remains operable even when Compass, Medallion or other map overlays overlap the same area.
- Enlarge the movable fullscreen compass by **exactly 30 %** from the V4.09.02 dimensions while preserving the selected compass, pointer/touch dragging and normalized local position.
- Add two strongly reduced fullscreen instrument buttons at the **upper-left** for independently showing/hiding Compass and Medallion.
- Add a freely draggable **live trend Medallion** to fullscreen; it mirrors the normal trend states `none / up / down / stable` and stores its normalized position locally.
- Persist fullscreen Compass and Medallion visibility locally per browser profile; no Home-Assistant helper is introduced for these view-only preferences.
- Keep Standard / Groß / Vollbild, per-device startup mode and the separate Settings-only browser window from V4.09.02 unchanged.

### Validation and documentation

- Extend the static V4.09 map-display contract with exact 30-% Compass dimensions, instrument visibility keys, Medallion overlay/drag contract, fullscreen location promotion and permanent layer z-order.
- Extend the Playwright device matrix for Desktop, iPad and Android across Dashboard and Integration with Compass/Medallion toggles, drag persistence, location-in-fullscreen, fail-closed warning tests and layer-control precedence.
- Update Release History in the product itself with bilingual **V4.09.03 · DEV · 2026/09** notes.
- Add dedicated V4.09.03 release notes, implementation note and handoff; mark V4.09.02 documents as superseded for active continuation.

## V4.09.02 TEST CANDIDATE — Kartenansichten Gerätefix

> **Noch nicht veröffentlicht.** Korrigiert ausschließlich die bei der ersten realen V4.09.01-Geräteprüfung gefundenen Kartenansichtsfehler. V4.08 bleibt unveränderte öffentliche Rückfallbasis.

### Fixed

- Replace the temporary wide **Standard · Groß · Vollbild** bar with one compact floating map-view control inside the lower-right map area.
- Use a three-layer icon following the radius colour structure: **small red** danger layer, **medium blue** thunderstorm layer and **large gold** observation layer.
- Open the view selection as a compact context menu above/left of the in-map control and close it after selection or outside interaction.
- Add **Startdarstellung** in Settings with **Standard / Groß / Vollbild / Zuletzt verwendet**; persist this preference only in the local browser profile of the current device.
- Keep **Eigenes Kartenfenster** separate in Settings (Variant A) instead of mixing it into the in-map view menu.
- Make **Standard · Groß · Vollbild** directly reachable from inside the map without adding another permanent card row.
- Harden the separate-window presentation so the Gewitterradar card itself covers the Home-Assistant shell and the fullscreen dialog has a fixed viewport fallback.
- Add a dedicated `gewitterradar_window_version=40902` marker to prevent ambiguity with the first V4.09.01 popup path during device retesting.
- Keep the same Leaflet instance, selected compass reuse, pointer/touch dragging, radii, clustering and protected V4.08 baseline unchanged.
- Replace the obsolete visible Release History planning block (including the abandoned XL wording) with the actual bilingual **V4.09.02 · DEV** test-candidate entry.
- Document the complete V4.09.01 → V4.09.02 real-device findings, current test state, release gates and next-chat handoff in the canonical repository.

## V4.09.01 TEST CANDIDATE — Kartenansichten

> **Noch nicht veröffentlicht.** Dieser Stand ist für die reale Geräteabnahme vorgesehen. V4.08 bleibt die unveränderte öffentliche Rückfallbasis.

### Added

- Add the direct map display modes **Standard**, **Groß** and **Vollbild** while keeping the existing Leaflet map instance alive across mode changes.
- Reuse the currently selected compass as a draggable fullscreen overlay with Pointer Events for mouse and touch operation.
- Persist the Standard/Groß map preference and normalized fullscreen compass position locally.
- Add **In eigenem Fenster öffnen** as a separate Settings action with fullscreen fallback when the browser blocks the popup.
- Keep native Integration and Dashboard frontend payloads byte-identical from the canonical source.

### Validation

- Add a dedicated V4.09 map-display contract and Playwright coverage for Desktop, iPad and Android across both delivery forms.
- Preserve the V4.07.56 protected About geometry contract at the unchanged maximum tolerance of **0.02 px** while allowing the V4.09.01 development identity to execute the same regression suite.
- Keep diagnostic, locale, Settings/Help, Hi-Res/master-retention and native-integration checks active.

## 2026/09 — V4.08 FINAL / native integration 0.20.0

### Cluster-Auflösung & Cluster-Navigation

- Add the cluster-resolution profiles **Früh**, **Ausgewogen**, **Spät** and **Klassisch · V4.07.56** while preserving the protected classic fallback behavior.
- Rename the session control to **Cluster-Navigation · Sitzungszeit** and keep the accepted 5–3600 second plus unlimited navigation modes.
- Preserve the reliable pointer-down mode switch for countdown/unlimited operation without triggering an additional cluster navigation step.
- Keep the cluster browser session stable while navigating and reset it only for structural changes such as a profile switch.
- Document the V4.08 cluster behavior consistently in Help, Release History and the dedicated V4.08 project documentation.

### Repository- & Web-Dokumentation

- Refresh the repository landing page for HACS with HACS-safe absolute branding paths so the Gewitterradar logo renders reliably in the HACS detail view.
- Add the existing Gewitterradar hero artwork to the repository landing page without modifying protected master assets.
- Redesign the separate HTML installation/overview guide around installation first, a compact feature gallery, integrated image enlargement and 15 regular documentation languages.
- Prepare the documentation screenshots as lossless WebP assets to reduce repository/web payload while leaving the protected Hi-Res/master asset set untouched.
- Keep the detailed repository/web presentation changes documented in `docs/RELEASE_NOTES_V4_08_TEST.md` and `docs/HISTORY.md`.

## 2026/09 — V4.07.56 FINAL CANDIDATE / native integration 0.19.0

> **Noch nicht öffentlich veröffentlicht.** V4.07.56 ist der vom Benutzer abgenommene gemeinsame Produkt-/Diagnosestand. Die kontrollierte Promotion nach `main`, der post-merge Golden Master sowie der öffentliche Tag/HACS-/GitHub-Release stehen noch aus. V4.06 bleibt bis dahin die öffentliche Rückfallbasis.

### Added

- Add a Gewitterradar-owned modern GPS `device_tracker` as the movable reference adapter for worldwide locations.
- Add `gewitterradar.set_reference_coordinates` to atomically move the product-owned tracker and select it as the active Gewitterradar reference.
- Add read-only Blitzortung linkage diagnostics without mutating foreign ConfigEntries or `.storage`.
- Add `app_gewitterradar_v4_07_pkg.yaml` with a separate Dashboard Template `device_tracker` and coordinate-set script.
- Add worldwide place/postcode search with Open-Meteo as primary geocoder and a controlled OpenStreetMap Nominatim fallback.
- Add direct latitude/longitude input to the worldwide location workflow.
- Add local country autocomplete, explicit country filtering, country-grouped result presentation and global ranking safeguards.
- Add saved places through the local `Gewitterradar Orte` Local-To-do datastore, including `★` save, reversible `×` soft-delete and `↶` restore without duplicate creation.
- Add automatic map focus after location adoption and outside-click/tap closing for the location selector.
- Add a bilingual DE/EN Release History switch and update the V4.07 history entry from the former planning placeholder to the implemented scope.
- Add the Help section **Externe Dienste & Netzwerkfreigaben** with a fail-closed inventory for current runtime network targets.
- Add premium Help iconography, deterministic embedded SVG assets, network/service highlighting, radius-specific Help presentation and viewport/zoom-safe Help/Settings scrolling.
- Add the protected diagnostic master mode with pink active frame, movable/minimizable console, independent child-tool hiding and master hard-stop.
- Add deterministic virtual-storm scenarios `AUS`, `BEOBACHTUNG`, `GEWITTER`, `GEFAHR` and `GESAMT` through the normal production pipeline.
- Add deterministic **1–5 virtual storm cells** and the **EXTREM** diagnostic path without changing product thresholds or forcing the resulting cluster color.
- Add diagnostic grouped/individual strike rendering through the normal production renderer.
- Add protected Medallion diagnostic states **LEER / PFEIL / TREND / FREEZE / NORMAL** together with calibration, geometry, overlay, JSON/snapshot and performance tools.
- Add a dedicated V4.07.56 Golden/geometry contract for seven fixed browser profiles.
- Add a permanent fail-closed Hi-Res/master retention contract protecting current and legacy artwork content.

### Accepted normal product baseline

- V4.07.54 is the accepted normal UI/function baseline for the V4.07.56 finalization.
- Keep the accepted map, worldwide location search, languages, Help, radii, Settings, Compass, Medallion and normal interaction behavior unchanged while finalizing diagnostics and release protection.
- Preserve the complete product language scope of **15 languages + 4 German dialect variants = 19 variants**.
- Keep Deutsch and English native in the main JavaScript and load the remaining 17 variants from the external locale module.
- Preserve the accepted Android map/radius legend behavior and responsive Desktop/Tablet/Mobile presentation.

### Diagnostic protection

- Protect the accepted V4.07.56 diagnostic behavior with `tests/contracts/diagnostic-contract-v4.07.56.json` and `scripts/verify-diagnostic-contract.mjs`.
- Run the diagnostic contract through a dedicated GitHub Actions gate.
- Treat silent removal, semantic weakening or cleanup-driven loss of an accepted diagnostic capability as a release blocker.
- Require explicit user approval plus contract/documentation update and affected-function reacceptance for intentional diagnostic changes.

### Golden/browser protection

- Keep the historical V4.05 golden test intact as historical evidence.
- Add a dedicated V4.07.56 Golden contract using the exact accepted frontend identity.
- Freeze geometry across seven fixed profiles with a maximum tolerance of **0.02 px**.
- Compare Dashboard and Integration rendering pixel-wise within the same CI run instead of using unstable cross-run full-screen hashes as a release blocker.
- Distinguish the visible close symbol from its larger 44×44 touch target when checking visual overlap.
- Preserve the 44×44 touch target while validating the current accepted visible X geometry.
- Keep stricter automatic focus behavior on Desktop and explicitly focus the visible close control before keyboard activation in touch emulation.

### Hi-Res/master retention

- Permanently retain unused, superseded and legacy Hi-Res/master artwork in the current canonical repository state; Git history alone is not considered a sufficient archive.
- Protect **32 unique master/legacy content identities** across Help, worldwide location search and About controls.
- Allow a protected master to move into an approved `legacy/`/archive location only when the exact protected content remains present.
- Do not count runtime/package-derived copies as master retention.
- Fail closed when a protected master disappears or when new unique content appears in a protected Hi-Res/legacy area without being registered in the retention contract.
- Keep the original large About close/copy masters, earlier target variants and the retained V4.06 premium close artwork.

### Build, package and checksum alignment

- Canonical accepted frontend: **1,955,141 bytes**, SHA256 `249485f4bcf68c9b23b821cae9b507030ae09cff5a56f7e28d3d7f3b02eb4a1a`.
- External About/Help locale module SHA256: `997c4fe9b357935888fdb7bedc43cdd17f105b97241a000324891cea575dd436`.
- Canonical V4.07 Dashboard package SHA256: `1b705c5686e6a7be6dfb36717903df551d4f9f93787c39bd12bddf00aefae694`.
- Keep the historical V4.06 Dashboard package as retained fallback/migration material while also building and verifying the V4.07 package deterministically.
- Include both Dashboard packages in the canonical checksum inventory.
- Keep Integration and Dashboard frontend/locale/assets byte-identical.

### Validation and safeguards

- Deterministic frontend reconstruction and exact delivery parity are required.
- JavaScript syntax, About/Help locale, Recorder locale, diagnostic contract and Hi-Res retention checks are release gates.
- V4.07.56 Settings/Help browser profiles and the dedicated Golden contract are release gates.
- Both Dashboard and Integration complete browser suites have been exercised against the accepted V4.07.56 baseline.
- HACS integration validation, package contract, Hassfest and Home Assistant 2026.9.0 runtime tests are part of the final gate set.
- Do not use deprecated `device_tracker.see`.
- Do not rewrite Blitzortung ConfigEntries.
- Do not manipulate `.storage` or private/undocumented Home Assistant frontend APIs.
- Keep native and Dashboard tracker IDs distinct.
- Do not claim lightning-data-region synchronization merely because the Gewitterradar tracker or map moved; Blitzortung controls its own movement threshold and subscription lifecycle.
- Keep V4.06 immutable as the public fallback until V4.07.56 is promoted, revalidated on `main` and released.

### Promotion state

- The exact accepted V4.07.56 frontend is synchronized into the canonical product repository.
- The PRE-MERGE snapshot of the existing `main` has been created and retained outside GitHub according to the promotion audit.
- A Golden Master must only be generated from the fully tested **post-merge `main`** commit, never from this candidate branch or from the PRE-MERGE snapshot.
- `main` remains unchanged until explicit user approval.
- After promotion, all relevant release gates must run again on the actual new `main` commit before tagging or publishing.

### External environment checks kept separate

The following items concern the separately installed Blitzortung integration or special network environments and are not falsely reported as already completed product acceptance:

- real small/large reference-location movement and Blitzortung data-region resubscription behavior;
- real resubscription latency and restart/restore behavior with a configured Blitzortung `Location entity`;
- Recorder/database effects of repeated location changes;
- real DNS-filter, proxy, TLS-inspection or segmented-network verification where such an environment is available.

Whether these environment checks are mandatory before the public release or remain documented follow-up work is a separate release decision.

### Historical V4.07.31 consolidation point

V4.07.31 remains preserved as an important historical Near-Final point, but it is no longer the current candidate.

- Main JavaScript: **1,779,464 bytes**, SHA256 `2d13746361d52af29be279f0c273d7fc3ca381a531a82f26efe8c82f3a871b31`.
- External locale module: **401,387 bytes**, SHA256 `898182f61b59682cd34607219018437999081b67e171e7f8955df454ec3d7ccb`.
- GitHub Actions complete artifact `v407-test31-complete`: **2,238,710 bytes**, artifact ZIP SHA256 `91f4e615029040c1f01498355071871c693c771c5bf9d82efadc1586cf9d6917`.
- V4.07.31 completed the four dialect Help variants and the 19-variant Help schema regression.
- Detailed historical notes remain in `docs/RELEASE_NOTES_V4_07_31_TEST.md` and `docs/RELEASE_NOTES_V4_07_TEST.md`.

Detailed V4.07.56 final-candidate notes are recorded in `docs/RELEASE_NOTES_V4_07_56.md`.

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

- Fix iPad/iPad Pro WebKit focus artifacts around the About close control and around the reopened About dialog without changing the approved premium X asset.
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
