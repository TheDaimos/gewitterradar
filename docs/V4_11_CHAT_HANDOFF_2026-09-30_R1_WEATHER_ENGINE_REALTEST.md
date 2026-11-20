# Gewitterradar V4.11 – Chat-Übergabe R1: Weather-Engine-Realtest und V4.11.02

Stand: **2026-09-30**  
Status: **Verbindliche Arbeitsübergabe / V4.11.01 DEV real teilabgenommen / nächste Implementierung V4.11.02 DEV**  
Bootstrap: **Daimos** – zuerst die aktuelle `TheDaimos/project-defaults/START_HERE.md`, anschließend `PROJECT_DEFAULTS.md` und die unten genannten Pflichtquellen tatsächlich lesen; nicht allein aus Chat-Erinnerung fortfahren.

## 1. Repository- und Schutzstand (bei Übergabe verifiziert)

- Repository: `TheDaimos/gewitterradar`.
- V4.10 FINAL: Tag `v4.10`, `main` = `3111e9d27a62adf97d37cccb8066cc9a0803c128`; beide beim Schreiben dieser Übergabe identisch. **Nicht rückwirkend bearbeiten, mergen oder neu veröffentlichen.**
- V4.11-Entwicklung: `feature/v4.11-development`; unmittelbarer HEAD vor dieser Dokumentationsübergabe: `dde50fc814e71dd9bcd454b15eddaa4b2598389a`. Nach dieser Übergabe den **neuen HEAD tatsächlich aus Git lesen**, nicht die vorherige SHA als letzten Stand annehmen.
- Draft-PR: **#28**, offen, noch nicht zusammengeführt, nach `main`; keine Freigabe zum Merge.
- V4.11.01 DEV / real installierter Modulsatz: `E411-01A3`, 24/24 Module, 0 Abweichungen, `weather.consumer-client` 1.0.2, sichtbare Kennung `V4.11.01 DEV`, Build `V4.11.01-DEV-2026-09-30`, `BUILD_VERSION = "4.11.01"`, Integrationsmanifest 0.23.0. Der letzte vom Nutzer gelieferte JSON-Diagnoseexport zeigte `stale:false`, `fingerprintMismatch:false`, `installedReleaseMismatch:false`, `revisionMismatch:false`. Das bestätigt einen konsistenten Browserstand, nicht bereits alle neuen Wetterfunktionen.
- DRA: **bestehender Kanal `deploy/dev`**, kein neuer Kanal. Bei Übergabe zeigt er auf `cbe4858b46099c4f59c2aa10ae442b10cc17b666` (eigener DRA-Provenienzcommit auf getesteter V4.11.01-Quellbasis `428ff27ef522c0a78e68203c60710a14e35c8210`). Dokumentationscommits auf dem Entwicklungszweig sind **nicht automatisch** über DRA installiert. Eine neue Funktionsiteration erst nach erfolgreichen Tests mit eindeutiger Folgeversionsnummer über denselben Kanal bereitstellen.
- Der zuletzt ausgelesene Draft-PR-HEAD vor diesem Handoff hatte für Shared Frontend, Integration, Hi-Res-Retention und Diagnosevertrag grüne GitHub-Prüfungen. Jeder neue technische Stand muss erneut geprüft werden.

## 2. Kanonische Lese- und Schutzquellen

1. `TheDaimos/project-defaults/START_HERE.md`; `PROJECT_DEFAULTS.md`; `docs/V4_11_TODO.md`.
2. `docs/V4_11_WEATHER_ENGINE_PLANUNGSBESCHLUSS_2026-09-30.md` – verbindliche, bei ausdrücklichem neuem Beschluss änderbare Produktvision.
3. `docs/V4_11_WEATHER_ROUTER_REALTEST_2026-09-30.md` und `docs/RELEASE_NOTES_V4_11_01_DEV.md`.
4. `docs/V4_11_START_2026-09-30.md` (historische Startplanung, in ihren damaligen Statusaussagen durch diese aktuelle Übergabe überholt).
5. V4.10-Abschluss: `docs/RELEASE_NOTES_V4_10.md`, `docs/RELEASE_PROCESS.md`, `docs/GOLDEN_MASTER_POLICY.md`, `docs/ASSET_RETENTION_POLICY.md`, `docs/ABOUT_GEWITTERRADAR_ACCEPTANCE_BASELINE_V4_05.md`, `docs/DIAGNOSTIC_PROTECTION_V4_07_56.md`, verknüpfte Schutzverträge/Tests. Der V4.10-Modularisierungsschlachtplan ist abgeschlossen und keine pauschal offene V4.11-Aufgabenliste.
6. WeatherRouter Consumer API V1 (vom Nutzer bereitgestellte Markdown-Vertragsfassung vom 29.09.2026), zur Umsetzung gegen reale WeatherRouter-Runtime/JSON-Schemas prüfen. WeatherRouter-Repository: `TheDaimos/weather-router-dev`. Keine Providerverdrahtung in Gewitterradar.

## 3. Fachlich abgestimmte Zielarchitektur

**„Blitzortung bleibt das Herzstück. WeatherRouter erweitert den meteorologischen Horizont.“**

Eine hybride **Weather-Engine** im Einstellungsmenü: Blitzortung und WeatherRouter sind unabhängig aktivierbar und gemeinsam nutzbar, kein exklusiver Entweder-oder-Modus. Blitzortung bleibt vorerst Primärquelle bisheriger Einzelblitz-/Gefahrenfunktionen; WeatherRouter reichert mit Niederschlagsradar, Satelliten/Wolken, geeigneten weiteren Blitzbeobachtungen, Tornado-/Unwetterereignissen und amtlichen Warnungen an. Perspektivisch kontrollierte Ersatzversorgung bei belegtem Quellenausfall oder regional ungeeigneter Abdeckung, aber **kein** blindes Umschalten bei einfach ausbleibenden Blitzereignissen.

Messereignisse, Satelliten-Flashes, aggregierte Dichte und amtliche Warnungen bleiben fachlich unterscheidbar. Ursprungsquelle, Zeit, Aktualität, Abdeckung und Einschränkungen zeigen; Doppeleinträge/Doppelzählung vermeiden. Keine ungeprüfte gemeinsame Risikozahl für Monitored Areas. WeatherRouter beschafft/wählt/normalisiert über seine öffentliche, authentifizierte, nur lesende HA-WebSocket-API; Gewitterradar stellt dar, analysiert und überwacht. **Gewitterradar wird kein zweiter WeatherRouter.**

## 4. V4.11.01 – implementierter und real geprüfter Umfang

Bereits im installierten Stand:
- `frontend/modules/weather/consumer-client.js` als eigenes registriertes Modul; `discovery`, `capabilities`, `resolve` über `this._hass.callWS`; Rückgabezustände und Ressourcentypen prüfen; optionale WR-Installation; Blitzortung-Produktpipeline unverändert.
- Einstellungsbereich **Weather-Engine**, WR-Verbindungstest und ausdrücklich ausgelöste separate Abfragen für den aktuellen Kartenausschnitt. Keine automatisch eingespielten produktiven Layer, keine automatische Quellenumschaltung.
- Transparentes WeatherRouter-V004-Logo: PNG-Runtimeableitung 256 px und geschützte 512-px-Rendition. Originalmaster verbleibt bei WeatherRouter; Schutz-/Asset-Retentionsvertrag beachten.
- Versionsanzeige aus Anwendungsmetadaten im Hauptfenster, Moduldiagnose, Runtime-Manifest und DRA-Buildkennung; weiterer Ausbau des Cache-/Versionsmanagements ist erforderlich.

Nutzer-Realtest vom 30.09.2026:
- `WeatherRouter bereit · Consumer API V1 · 70 verfügbare Wetterfähigkeiten im Katalog.` Die **70** gelten nur für den gefilterten Wetterkatalog (`domains:['weather']`), nicht für alle weltweit oder je Region garantierten Fähigkeiten.
- `weather.radar.precipitation`: `raster_tile`, DWD, angezeigtes Alter 248 s.
- `weather.lightning.observed.events`: `event_feed`, FMI – Lightning Open Data, 0 Ereignisse (kein Fehlerbeleg; auch keine Entwarnung).
- `weather.warning.official`: `hazard_feed`, 65 Rohereignisse, Quellen DWD und NOAA/NWS. **Nicht als 65 lokale Warnungen interpretieren!** Räumliche Überdeckung, gültige Zeiten, Polygon-/Geometrieprüfung und ggf. globaler Anfragekontext sind vor Anzeige als lokale Gefahr zwingend.

Damit ist die erste lesende Consumer-Anbindung im realen HA-System bestätigt; Kartenlayer, Satellitenlayer, Fallback, Deduplizierung, Backend-Überwachung und vollständige Geräte-/Rollback-Abnahme sind **noch nicht** bestätigt.

## 5. Companion-App: bestätigter Realbefund und verbindliche Verbesserung

Bei korrekt per DRA installierter V4.11.01 zeigte die Android-Companion-App anfangs noch V4.10.02, 23/23 Module, alter Modulsatz `D40A-5E9B`; der Diagnose-Probe sah bereits `installedId:E411-01A3`, `stale:true`. Desktop zeigte die neue Weather-Engine. **Nach längerem vollständigen Schließen und erneutem Öffnen der Companion-App wurde V4.11.01/24/24/`stale:false` geladen. Es war ausdrücklich KEINE erneute Home-Assistant-Ressourcenregistrierung erforderlich.** Diese abschließende Nutzerbeobachtung ersetzt die frühere Arbeitshypothese, eine manuelle Neuregistrierung sei zwingend nötig.

Verbindliches V4.11.02-Ziel: **einmalige, dauerhaft stabile Registrierung; anschließend verlässliche Aktualisierung nach jeder DRA-Iteration ohne manuelles Umregistrieren.** Dazu:
1. Gegenwärtige Ressource `/gewitterradar/gewitterradar.js` und dessen Home-Assistant-Registrierung analysieren; keine Duplikatressourcen und keine heimlichen Änderungen privater `.storage`-Dateien.
2. EINE kanonische Versionsquelle für Hauptdatei, dynamische und statische Untermodulimporte, Manifest, Laufzeitprobe, Build-/DRA-Provenienz und sichtbare UI; jeweils fortgeschriebene Kennung einschließlich Cache-Busting. **Aktueller technischer Rest:** `GEWITTERRADAR_MODULE_CACHE = '41002r13'` und Basis-/Importpfade können alte Browsermodule weiterverwenden, obwohl `GEWITTERRADAR_FEATURE_CACHE = '41101r1'` ist. Importgraph, statische Abhängigkeiten und WebView prüfen, nicht blind durch globales Suchen/Ersetzen.
3. Bereits existierenden Vergleich *installierter Sollstand* vs. *geladener Iststand* nutzen: eine verständliche, nicht aufdringliche „Neue Fassung installiert – Aktualisieren“-Anzeige mit kontrollierter vollständiger Neuladung prüfen; keine erfolglose Teil-Nachladung oder doppelte `customElements.define`-Registrierung. Ein offenes WebView kann nicht allein durch DRA-Dateikopie zwangsweise neuen JavaScript-Code ausführen; die sichere Auslösung/Aktualisierung ist gesondert zu konzipieren und real zu testen.
4. Automatisches **Ändern der HA-Ressourcenregistrierung durch DRA** ist ein *gewünschter Komfort*, **noch keine zugesicherte oder implementierte Funktion**. Vor jeder Umsetzung öffentlich unterstützte HA-Mechanismen, Berechtigungen und DRA-Verantwortung prüfen. Stabile Einmalregistrierung plus Versionsprobe kann ausreichend sein; keine direkte Manipulation interner HA-Registrierungsdateien.
5. Nach einer neuen Entwicklungsversion muss die Versionsnummer tatsächlich steigen (nächste **V4.11.02 DEV**), auch in Hauptfenster und Diagnose; Modulset-ID/prüfbarer Build/Cache/DRA konsistent. CI-Gates und Companion-/Desktop-Realprüfung dafür vorsehen.

## 6. Empfohlener nächster Arbeitsblock (V4.11.02 DEV)

**A. Zuerst Versions-/Ladepfad-Härtung:** Architektur der Ressourcenregistrierung, Browser-/WebView-Cache-Invalidierung, durchgängige dynamische Modulkennung und installierter/geladener Versionsprobe verifizieren. Korrektur mit Tests und revisionsspezifischer Buildkennzeichnung umsetzen. Behutsam mit bisherigen geschützten Modulen umgehen.

**B. Dann erste produktive WeatherRouter-Kartenebene:** DWD-Niederschlags-`raster_tile` nur nach Abgleich mit API-Runtime-/Schema und echten Geometrie-/Kachelmetadaten als separat schaltbare transparente Leaflet-Ebene: Quelle/Attribution, Zeit/Alter, Legende, Abdeckung, Layer-Zuordnung, Aktualisierungsintervall, begrenzte Anfragen und saubere Deaktivierung. Keine unkontrollierte Dauerabfrage beim Verschieben/Zoomen. Ausfall der optionalen Engine darf Blitzortung nicht beeinträchtigen.

**C. Warnungen erst mit räumlich/zeitlich korrektem Ereignismodell:** `hazard_feed`-Rohereignisse nicht ungefiltert auf Orte übertragen; Geometrie und Gültigkeit, Ereignistypen sowie Quellenkennzeichnung prüfen. Weitere Blitzereignisse später getrennt visualisieren; deduplizieren, ohne FMI- und Blitzortung-Ereignisse blind gleichzusetzen. Satelliten-/Tornado-/andere Wetterdaten und Fallback sukzessive integrieren.

**D. Langfristig** zentrale Status-/Hilfefunktion, echte weiterführende Modularisierungsprüfung, Tracker-/Blitzortung-Kopplungsdiagnose und Monitored Areas gemäß `docs/V4_11_TODO.md`. Monitored Areas brauchen browserunabhängiges Backend, getrennte Tracker je Standort, Schutz aktiv protokollierter Orte, CSV/PDF/Reset, Ressourcenbudget und fachlich gekennzeichnete Datenquellen.

## 7. Prüf- und Veröffentlichungsregeln

- Jede Codeänderung nur auf `feature/v4.11-development`. Master-/Golden-/About-/Diagnose-/Übersetzungs-/Hi-Res-Verträge bleiben wirksam. Keine freie Zerlegung des großen `core.base-context.js` ohne Audit und begrenzte Prüfungen.
- Tests für beide deterministischen Auslieferungsformen (native Integration und Dashboard), Modulanzahl/-set, Versionskennung, Hi-Res, Diagnose und Browserprofile; zusätzlich gezielte Consumer-Mocks und reale HA-/WR-Abnahme. Bestehende grüne CI ersetzt keinen neuen Prüflauf.
- Erst getesteten **konsistenten Gesamtbaum** über den bisherigen Kanal `deploy/dev` bereitstellen, DRA-Vorschau/Snapshot/Rollback beachten. DRA-Manifest ersetzt `custom_components/gewitterradar` als Verzeichnis; keine manuelle Einzelmodulinstallation. Benutzer testet Installations- und Laufzeitstatus.
- **V4.10 FINAL, `v4.10` und `main` nicht verändern.** Draft-PR #28 ohne explizite Freigabe weder zusammenführen noch schließen.
- Nach abgeschlossenem Teilblock Dokumentation und Fortschritt im Repository aktualisieren, weitere Iteration eindeutig nummerieren.
