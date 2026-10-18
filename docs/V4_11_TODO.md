# Gewitterradar V4.11 – primärer Schwerpunkt: europäische Niederschlagsradare

Stand: 18.10.2026 · Beschluss: **Neue funktionale Priorität für den verbleibenden V4.11-Entwicklungszeitraum**

## Versions- und Historiengrenze

Die bereits erreichten V4.11-DEV-Stände, implementierte Funktionen, Regressionstests und Freigabegrenzen bleiben **unverändert historisch gültig**; dieser Planungsbeschluss setzt die bisherige Entwicklung nicht zurück und veröffentlicht keine neue Version.

Die bisherigen **noch offenen** V4.11-To-do-Themen (Systemstatus, Tracker-/Blitzortung-Diagnose, Hilfe/Fehlerbehebung, gespeicherte/überwachte Orte, Local-To-do sowie sonstige Punkte) sind nach [V4_12_TODO.md](V4_12_TODO.md) verschoben. Bereits erledigte V4.11-Aufgaben sind dort nur historische Nachweise; nicht wiederholen. Der verbindlich geplante V4.12-Bereich **Geo-Sonde** bleibt ebenfalls erhalten.

## 0. Harte Voraussetzung – laufende gemeinsame Realabnahme

- [ ] Bestehenden WR-/GR-P7-010-Realtest mit dem installierten Versionspaar **abschließen**, bevor neue europäische Provider installiert oder in das produktive Routing aufgenommen werden.
- [ ] Bekannte Ausfallfehler WR-01c (DWD-Abdeckungsbeschaffung/Timeout) und GR-RF-02 (gültige aktuelle DWD-Daten nicht durch ausschließlich ältere NASA-Daten ersetzen) korrigieren und separat regressionsprüfen.
- [ ] Nachweislich stabiles, reproduzierbares gemeinsames DEV-Referenzpaar einschließlich V1-Rückfallschutz, V2-Mosaik, UTC-Zeitvertrag, Diagnose und Rückfall sichern. **Kein stilles Überspringen dieser Abnahme.**
- [ ] Erweiterungsarbeiten erst danach sequenziell und ohne parallele Entwicklungszweige im jeweiligen `deploy/dev` angehen.

## 1. Primärer neuer V4.11-Arbeitsauftrag: europäische Regenradarversorgung

Die **eigentlichen Provider, Datenadapter, Routing- und Coverage-Entscheidungen gehören in WeatherRouter** (`TheDaimos/weather-router-dev`, `deploy/dev`). Gewitterradar bleibt ausschließlich providerneutraler Consumer von `weather.precipitation.layer` und der bestehenden V2-Mosaik-API; **keine nationalen Provider-Sonderfälle in GR**.

Verbindliche technische Planungs-/Prüfliste: [WeatherRouter – Europa-Niederschlagsradar](https://github.com/TheDaimos/weather-router-dev/blob/deploy/dev/docs/EUROPA_NIEDERSCHLAGSRADAR_TODO_2026-10-18.md).

- [ ] **OPERA / EUMETNET MeteoGate ORD**: europäische Verbundradar-Mosaike als erster Integrationskandidat, einschließlich Datenzugang, Lizenzprüfung, ODIM-HDF5/Produktumsetzung und maschinenlesbarer geografischer Abdeckung.
- [ ] **Nationales Radar** als Ergänzung und zur Schließung von Lücken untersuchen: zunächst Spanien (AEMET), Italien (RADAR-DPC), Österreich (GeoSphere), Schweiz (MeteoSchweiz), Dänemark (DMI); danach systematisch sämtliche übrigen europäischen Länder und nationale Radarangebote erfassen.
- [ ] Je Land tatsächliche Verfügbarkeit, Radarqualität/Auflösung, zeitliches Raster, Messmethode, Zugangsbedingungen, Nutzungsrechte, Attribution, regionale Abdeckung und Aktualität prüfen; **kein Provider allein wegen Ländername oder Existenz als einsatzbereit markieren**.
- [ ] **RainViewer** als **bereits vorhandenen Provider** fachlich und technisch nachbessern; V2-Mosaikzulassung nur nach zuverlässiger Coverage-/Aktualitäts- und Lizenzprüfung. Keine Umgehung der vorhandenen `machine_coverage_required`-Schutzregel.
- [ ] DWD, neue nationale Radare, OPERA, RainViewer und NASA-IMERG für **jeweils geeignete Kacheln** fachlich sauber routen; Radar-Messung, Satellitenschätzung und Modellwerte unterscheidbar halten. NASA bleibt legitime globale Ergänzung statt standardmäßiger Ersatz für verfügbare frische europäische Radardaten.
- [ ] GR-V2-Mosaik an typischen Grenzen und Kombinationen prüfen (Deutschland→Dänemark, Österreich/Schweiz/Italien, Spanien/Portugal, Regionen ohne Verbund-Abdeckung) sowie mit 0/1/mehreren gültigen Quellen, Neustart, Provider-Ausfall, Kachelwechsel, Zoom und Wiederherstellung.
- [ ] Quellen/Attribution/UTC-Zeit und Routingentscheidungen in beiden Diagnosen überprüfbar halten; neue echte Exportdateien **ausschließlich** ins private `TheDaimos/Project-Log-And-Export`.
- [ ] Nationale Quellen erst nach Tests in einer gemeinsamen Regionalabnahme als tatsächlich nutzbar ausweisen. Kritische V1- und V2-Baselines dürfen nicht verschlechtert werden.

## 2. Klare Abgrenzung

**V4.11** = stabile Gewitterradar-/WeatherRouter-Niederschlagsdarstellung **plus Erweiterung um Europas echte Radarmessungen**.  
**V4.12** = bisherige offene V4.11-Nebenthemen **plus** bereits fest zugesagte Geo-Sonde.

**Planung allein ersetzt weder Codeimplementierung noch erfolgreiche HA-Realabnahme.**
