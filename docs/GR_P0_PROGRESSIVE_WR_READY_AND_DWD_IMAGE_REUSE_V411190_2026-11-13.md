# GewitterRadar P0 – Progressive WR-Ready-Vervollständigung und sichere DWD-Bildwiederverwendung

**13.11.2026 · Quellbranch `deploy/dev`**  
**GR V4.11.190 DEV / HA 0.25.97 / Runtime `411190r1` / Modulset `E411-190A1`**  
**Zugehöriger WR-Quellstand:** [WR 0.10.320 DEV / Loader 323, P0-Gesamtbericht](https://github.com/TheDaimos/weather-router-dev/blob/deploy/dev/docs/WR_GR_P0_PROGRESSIVE_COVERAGE_CACHE_FIRST_DELIVERY_2026-11-13.md).

## Umfang

1. Die bestehende `wrPolicySubscription` in `modules/weather/precipitation-layer.js` erkennt zusätzlich `event.data.dwd_coverage_verified===true` und löst den vorhandenen revisions-/viewportgeschützten `_scheduleWeatherRadarRefresh` aus. Aus dem Event wird **keine** Providerwahl abgeleitet; die nachlaufende vollständige V2-Auflösung erfolgt ausschließlich über WeatherRouter.
2. Bounded Decoded-Image-LRU für DWD in `p7-010/raster-mosaic-tile-loader.js`: höchstens **96** Bilder, **180 s** TTL, Schlüssel aus Quelle + aktuellem von WR freigegebenem UTC-Frame-Zeitstempel + voller HTTPS-Kachel-URL. Der Lookup erfolgt ausschließlich in bereits WR-verifizierten V2-Layern. Innerhalb einer V2-Generation enthalten auch per-Snapshot-Cache und Shared-Inflight-Key die Frame-Identität. **NASA-No-Store bleibt unverändert**, bestehender OPERA-Completed-Cache ebenfalls.
3. Synchronisierung aller drei gelieferten Frontend-Spiegel (`custom_components/gewitterradar/frontend/`, `frontend/`, `dashboard/dist/`) inklusive der kompletten Import-/Cachebusting-Kette `precipitation-layer` → `raster-mosaic-consumer` → `raster-mosaic-grid-layer` → `raster-mosaic-tile-loader`. Frontend-Version, Modulmanifest, `build_info.py` und HA-Manifest synchronisiert; neue DRA-identifizierbare Build-Version.

## Prüfbefunde

- Direkte JS-Parseprüfung der vier betroffenen Module aus GitHub erfolgreich (**4/4**; statische Imports/Exports für isolierten Parser entfernt).
- Die aus dem veröffentlichten Quellcode extrahierte DWD-Cache-Schlüsselfunktion wurde real in einer isolierten JavaScript-Ausführung geprüft (**5/5 PASS**): gültiger DWD/HTTPS/Zeit-Schlüssel, eigene Revision pro UTC-Frame, NASA nicht im LRU, HTTP und ungültige Zeit abgewiesen.
- Die zentralen Moduldateien sind zwischen den drei Frontend-Spiegeln hashidentisch; Versions-/Importkette geprüft.
- Neues `tests/gr-p0-progressive-dwd-cache.test.mjs` zur wiederholbaren Repository-Prüfung committed. **Der vollständige private Node-Testlauf wurde hier nicht ausgeführt.** Keine HA-DEV-Videoprüfung und keine FPS-/TTFV-Messung behauptet.

## Risiko- und Referenzschutz

Die geschützten GR-4.11.187-Menüs, Eye-/Touch-/Wind-/Temperatur-/Renderer-Arbeiten bleiben unangetastet; der neue Build ergänzt ausschließlich die eng abgegrenzte Bereitschafts-Aktualisierung und den Rasterbild-Cache. Keine 900-s-Grenze, keine neue NASA-Speicherung, kein eigener GR-Quellenentscheid, kein PROD. Die Browser-Entsorgung der alten LRU-Einträge und die mobile Speicherauswirkung müssen in einer echten DEV-Nutzung beobachtet werden.

**DEV-Abnahme offen:** Auf VM109 WR 0.10.320 und GR 4.11.190 getrennt über DRA installieren, per Export2Git und Android/Desktop-Realsichtung kaltes DWD, NASA-/OPERA-Teilergebnisse, zurückkehrende Viewports und Cache-Hits nachvollziehen. Die Angabe „vollständig progressiv/performancebehoben“ wäre ohne diese Nachweise unzulässig.

**GitHub-Commits:** [DWD-Ready-Listener](https://github.com/TheDaimos/gewitterradar/commit/d41abd092e3e478142f5b00a926e8e8c60dc8e12), [DWD-LRU](https://github.com/TheDaimos/gewitterradar/commit/45e2907e3b20bceed25686b3920dfd9c0885a1db), [Frame-Key](https://github.com/TheDaimos/gewitterradar/commit/b152a6949f045cdae04dcda4c93253d94bfa1438), [Finale Buildidentität](https://github.com/TheDaimos/gewitterradar/commit/3febc7ef8ad360889acbb974cb681c26303c65ff), [Regressionscheck](https://github.com/TheDaimos/gewitterradar/commit/54ea164fd0e2e91fa7f3420be1a695aae82c9219).
