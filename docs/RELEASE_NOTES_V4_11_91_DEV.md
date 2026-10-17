# Gewitterradar V4.11.91 DEV – P7-010: NASA-Welt-BBOX und 12-Stunden-Satellitenfreigabe

**Datum:** 17.10.2026 · **Zweig:** `deploy/dev` · **HA-/DRA-Integration:** `0.25.9` · **Laufzeitkennung:** `41191r1` · **Modulsatz:** `E411-91A1`

## Anlass und technische Gegenantwort

WeatherRouter V0.10.155 DEV / Loader 158 korrigiert die Verifikation einer produktspezifischen NASA-IMERG-Welt-BBOX. Die verbindliche WR→GR-Übergabe liegt in `TheDaimos/weather-router-dev@deploy/dev`:

`docs/p7-010-coordination/WR_TO_GR_2026-10-17_NASA_WELT_BBOX_12H_HOTFIX_UND_GR_VALIDATOR.md`

Der bisherige GR-Validator lehnte trotz expliziter Freigabe `max_background_age_seconds=43200` ältere Satellitenschätzungen ab, sobald die unveränderte, maschinengeprüfte Quelle `coverage_scope="bbox"` anstelle von `"global"` meldete. Für NASA IMERG sind die produktbezogenen Grenzen `west=-180,east=180,south=-90,north=90` dokumentiert.

## Behebung

- `validateRasterMosaicV2` lässt für die bereits bestehende ältere-Satelliten-Ausnahme entweder `coverage_scope="global"` oder eine **von WR verifizierte exakte Welt-BBOX** zu. Dabei bleibt die gelieferten `coverage_scope="bbox"`-Kennzeichnung **unverändert**.
- Die Ausnahme verlangt weiterhin `coverage_verified=true`, `freshness_class="older_background"`, `quality_note="older_satellite_background"`, `observation_kind="estimate"`, zulässige Satellitenmessmethode, gültige Zeitangaben und die **ausdrücklich aktivierte** Altersgrenze bis zwölf Stunden.
- Regionale, fast-globale, nicht geprüfte und unvollständig angegebene BBOXen sind keine Berechtigung. Eine mehr als zwölf Stunden alte Satellitenschätzung und alte DWD-Radardaten bleiben unzulässig. Der Standardgrenzwert von 900 Sekunden für aktuelle Quellen bleibt unverändert.
- Alle vier Vertragsquellen sind synchronisiert: `src/p7-010/raster-mosaic-contract.js`, `frontend/modules/weather/p7-010/raster-mosaic-contract.js`, `dashboard/dist/modules/weather/p7-010/raster-mosaic-contract.js` und `custom_components/gewitterradar/frontend/modules/weather/p7-010/raster-mosaic-contract.js`.
- Alle Browser-Importe, die den V2-Vertrag verwenden, erhalten `?v=41191r1`, damit der bisherige Validator nicht aus einem Browser-Zwischenspeicher weiterverwendet wird.
- Der Wetter-/Darstellungsmonitor zählt eine nachweislich weltumspannende BBOX korrekt unter den gezeichneten Grundversorgungs-Kacheln. Das ändert keine Pixel- oder NoData-Verifikation und klassifiziert keine BBOX als globale Provider-Coverage um.
- **V1-Löschschutz und Weather-Engine-Darstellungsmonitor aus V4.11.90 bleiben erhalten.** Keine zweite Mehrquellenarchitektur, keine implizite Satellitenfreigabe.

## Regressionen

`scripts/test-p7-010-raster-mosaic-contract.mjs`: zulässige ältere Satellitenschätzung mit verifizierter Welt-BBOX und ausdrücklichem Opt-in; identischer Fall ohne Opt-in abgelehnt; nicht verifizierte, regionale, fast-globale BBOXen abgelehnt; 13 h alte Quelle abgelehnt; falsche Satellitensemantik oder Qualitätskennzeichnung abgelehnt; älteres DWD-Radar abgelehnt; ursprünglicher `scope=global`-Fall weiter zulässig.

`scripts/test-p7-010-raster-mosaic-consumer.mjs`: vollständiger WebSocket→V2-Validator→Leaflet-Kachelvorbereitungsweg mit NASA-Welt-BBOX und frischem DWD-Regionalradar; zwei tatsächlich berücksichtigte Kachelquellen. Ohne Einwilligung, bei unbestätigter oder regionaler BBOX wird kontrolliert auf V1 zurückgefallen.

Bestehende P7-010-Abdeckungstests prüfen weiter Datums-/UTC-Grenzen, geografische Mosaikflächen und Zoom 12 bis 17. Die Frontend-Prüfung kontrolliert ausgelieferte Spiegeldateien, Browseroberfläche und Prüfsummen.

## Voraussetzungen zur HA-Realabnahme

1. WeatherRouter **V0.10.155 DEV / Loader 158 oder neuer mit entsprechendem Welt-BBOX-Hotfix** im Home Assistant installieren.
2. Gewitterradar über DRA aus `TheDaimos/gewitterradar@deploy/dev` auf **V4.11.91 DEV** aktualisieren.
3. Für bewusst ältere Satellitenschätzungen die bestehende Opt-in-Einstellung **Ein – bis 12 Stunden** aktivieren.
4. Atlantik/Europa/Deutschland, DWD nur am Rand, Zoom 3–5 sowie Zoom 12–17 prüfen. V2 soll die NASA-IMERG-Welt-BBOX (Klasse `older_background`) und DWD nur regional verwenden können. Keine Behauptung zu vollständig nichttransparenten Bildpixeln.
5. In Weather-Engine-Diagnose und WR-API-Monitor übereinstimmende `correlation_id`, `validated`, `viewport_coverage`, `staged_tiles_actual_coverage`, `raster_ready`, `active`, `freshness_class`, `times.age_seconds` und `coverage_scope="bbox"` prüfen.
6. Bei Auffälligkeiten den **Bildverlustmarker** aus V4.11.90 verwenden und vollständige Diagnoseexporte auf Git sichern.

**Der Code- und CI-Nachweis ersetzt keine HA-Realabnahme.** Diese erfolgt erst nach der Installation.

C.K. – Eine Idee weiter gedacht.
