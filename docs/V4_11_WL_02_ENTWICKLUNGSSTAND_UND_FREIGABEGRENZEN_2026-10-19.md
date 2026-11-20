# V4.11 WL-02 – Fortgesetzte Entwicklung, technische Nachweise und Freigabegrenzen

**Repository:** `TheDaimos/gewitterradar` – ausschließlich `deploy/dev`  
**Datum:** 2026-10-19  
**Status:** Entwicklungsstand mit offenen Pflichtarbeiten – **KEIN CODE-PASS, KEIN CI-PASS, KEIN HA-REAL-PASS und KEINE DRA-Installationsfreigabe.**

## 1. Übernommene Korrekturen
- `1cf9ab36`: WR-`provenance.spatial_coverage` mit `scope:bbox` und Objekt-`bbox`, globalem Scope und Antimeridian-Erkennung. Antimeridian-Raster weiterhin fail-closed, nicht frei gerendert.
- `d5c9766f`: generische Ebenen und ausstehende Resolve-Generationen beim vollständigen Menü-/Kartenabbau bereinigen.
- `fee8c0c10f81`: kontrollierte Vertrags-Testfälle `tests/wl02-coverage-contract.test.mjs`; Testdatei im Repository, Ausführung bislang **nicht** belegt.

## 2. Tatsächliche neue Codeänderungen
- `bfd9ab4a`: Aktivierte generische Wolken-/Windebenen aktualisieren die WR-V1-Auflösung bei `moveend`, `zoomend` und Rückkehr in den Vordergrund; laufende alte Antworten werden per Generation verworfen und alte Ebenen entfernt. Ein Timer von 900 ms bündelt Kartenbewegungen.
- `f13ca465`: Separater Karten-Hook-Verweis; Layer-Abbau löscht nicht die Map-Verbindung der Ereignisbehandlung. Listener werden beim Abschalten und beim vollständigen Abbau abgemeldet.
- `8b02cc1c`: UTC-Zeit, Attribution und Vorhandensein einer Legende werden ergänzend im bestehenden Menü ausgewiesen.
- Der Kachelstatus wird nicht länger durch das **erste** `tileload` als vollständig `ready` bezeichnet; `load` beendet den Kachelzyklus, `tileerror` kennzeichnet Teilfehler.

## 3. Gesicherte Vertragsbeobachtungen
- GR verwendet den vorhandenen `createWeatherRouterClient().resolve()`, Consumer V1, mit explizitem `bbox` und `time:{mode:'latest'}`.
- `weather.satellite.clouds` und `weather.model.wind_10m.layer` sind im WR-Katalog als `raster_tile` geführt. Diese Kataloginformation beweist **keine** aktuelle reale Kachellieferung.
- Der Leaflet-Zugriff folgt dem von `weather.precipitation-layer` verwendeten Muster `deps.loadLeafletJs`. Seine Laufzeitinjektion sowie der konkrete UI-Browserpfad benötigen jedoch weiterhin einen vollständigen ausführbaren Integrationstest.

## 4. Vor Freigabe weiterhin zwingend zu erledigen
1. **Abdeckung:** Pixelgenaues Zuschneiden für regional begrenzte Raster und dateline-wrapping; `bounds` allein reicht nicht. Kachelschemata/Projektionsvertrag, WMS versus XYZ sowie NoData-Interpretation anhand tatsächlicher WR-Runtime-Deskriptoren abnehmen. In der gegenwärtigen Implementierung sind Antimeridian-Raster gesperrt.
2. **Budgets:** Gemeinsame begrenzte Kachel-/HTTP-Parallelität, Speicher- und Zeitgrenzen, harter Abbruch bereits gestarteter Tile-HTTP-Anfragen, geordnetes Wiederverbinden und begrenzte Wiederholungen fehlen noch.
3. **Darstellungswahrheit:** Pro sichtbarem Bildfeld korrekte Vollständigkeit und geografische Bedeckung beweisen; `load` allein ist noch kein Beweis sichtbarer Geopixel. Zeitklassifizierung, `freshness.stale`, Quellen-/Lizenzmetadaten und anklickbare echte Legenden vollständig verdrahten.
4. **Lifecycle:** Kartenersetzung, Verbindungswiederkehr und Modulerneuerung im Browser belegen; aktuelle Hooks decken Karte bewegen/zoomen und Sichtbarkeit ab, aber nicht alle Fälle. Kartenweite Fehlerzustände und bestehende Niederschlagskachelbudgets berücksichtigen.
5. **Tests:** Tatsächliche Ausführung und PASS-Belege der neuen Coverage-Tests, V1-/V2- und der GR-RF-01–04-/P7-010-/DWD-/NASA-/Mobile-/Karten-Regressionssuite sowie CI-Arbeitsabläufe am finalen Commit.
6. **Versionierung:** Erst nach (1)–(5) eine einzige konsistente DEV-Version mit allen Frontend-/Backend-Spiegeln, Manifests, Cache-Bustern, Laufzeitkennung und DRA-Nachweis erstellen.

## 5. Abnahme- und Versionsstatus

| Bereich | Ergebnis |
| --- | --- |
| Isolierter GR-V1-Wolken-/Windpfad | Code vorhanden, unvollständig geprüft |
| Coverage-Objektvertrag | Codekorrektur vorhanden; Testausführung offen |
| Grundlegende Move-/Zoom-/Sichtbarkeitsbehandlung | Im Code vorhanden; Browserintegration offen |
| Pixelgenaue Ränder, Antimeridian, NoData | **Offen** |
| Netz-/Kachel-/Speichergrenzen | **Offen** |
| Vollständige Quellen-/UTC-/Lizenz-/Legendenanzeige | **Offen** |
| GR-RF-01–04 / P7-010 Gesamttests | **Nicht nachgewiesen** |
| CI-PASS | **Nicht nachgewiesen** |
| HA-REAL-PASS | **Nicht durchgeführt** |
| Freigabefähige DEV-Version | **Nein** |

**Keine neue DEV-Version und keine DRA-Installation zulässig.** `V4.11.99 DEV` bleibt der im Entwicklungsauftrag genannte Ausgangsstand; laufende `deploy/dev`-Änderungen sind nicht als erfolgreich abgenommene Version zu behandeln. WL-03/WL-04 sowie WR-Provider-Code und die Niederschlagsdatei wurden bei diesen Änderungen nicht verändert.

## 6. Vorgeschriebener HA-Realtest nach technischer Freigabe
Erst nach vollständigem CODE-/CI-PASS: GR und WR aktualisieren, je Wolken und Wind eine echte V1-`ready`-Antwort mit Korrelationskennung erzeugen, native Bildkacheln tatsächlich zeichnen und deren Coverage, Daten-UTC, Alter, Attribution sowie Legende prüfen. Anschließend Wolken, Wind und Niederschlag einzeln/zusammen schalten; Kartenwechsel Deutschland → außerhalb Coverage → zurück, Zoom, Hintergrundwechsel, Verbindungsunterbrechung und Neustart prüfen. WR-/GR-Rohdiagnosen nur privat in `TheDaimos/Project-Log-And-Export` ablegen. Ohne korrelierte Echtantwort bleibt `HA-REAL-PASS` offen.

C.K. – Eine Idee weiter gedacht.
