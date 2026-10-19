# WL-02 – Implementierungszwischenstand und offene Freigaben

**Stand:** 19.10.2026, Zweig `deploy/dev`  
**Status:** **CODE-PASS offen, CI-PASS offen, HA-REAL-PASS offen. Keine Installationsfreigabe.**

## Tatsächliche Änderung
- `frontend/modules/weather/layer-menu.js` enthält jetzt einen ersten isolierten generischen V1-Rasterpfad für `weather.satellite.clouds` und `weather.model.wind_10m.layer`.
- Die bestehende `weather.precipitation.layer`-Umschaltung bleibt separat; die Niederschlagsdatei selbst wurde nicht verändert.
- Neu: zwei eigene Leaflet-Panes, generische `resolve`-Anfragen mit `bbox` und `latest`, ein- und ausschaltbare Zustände, Status für erfolgreiche bzw. fehlgeschlagene Kachelladungen, schlichte Vertragsprüfungen und Diagnoseereignisse.
- Diese Änderungen sind **noch keine vollständig abgesicherte Umsetzung**. Der Quellcode wurde in diesem Schritt nicht mit den vollständigen existierenden Testskripten und einer Browserlaufzeit abgeglichen.

## Offene Fehler- und Schutzprüfungen vor Freigabe
1. Sicherstellen, dass `deps.loadLeafletJs` tatsächlich vom Modul-Lader an `weather.layer-menu` geliefert wird; andernfalls korrekten bestehenden Leaflet-Ladeweg anbinden.
2. Native WR-Kachelkonvention, Coverage-Metadaten und Zeitfelder anhand realer Runtime-Verträge prüfen. Der vorläufige Adapter lässt bewusst nur HTTPS-XYZ-Vorlagen, explizite numerische Bounding-Boxen und ISO-Zeit mit Zone zu. Abweichende legitime WR-Produkte bleiben bislang gesperrt.
3. Abdeckung präzise zuschneiden: Leaflet-`bounds` allein gewährleistet keine pixelgenaue Maskierung von Randkacheln.
4. Kartenwechsel-/Zoom-/Hintergrund-/Sichtbarkeits-/Neuverbindungsereignisse anbinden und veraltete Kachel-Requests aktiv abbrechen; Schaltvorgang und Auflösungsantwort sind bisher per Generation getrennt, nicht aber alle Bildanforderungen.
5. Ein zentrales Kachelbudget/Parallelitätslimit und eindeutigen Zeitpunkt für die Kachelabschlussprüfung ergänzen; Legenden, Attributions- und UTC-Aktualitätsanzeige noch vervollständigen.
6. Vollständige kontrollierte V1-Vertragstests, Menü- und Browserprüfungen sowie die GR-RF-01–04-/P7-010-Regressionen tatsächlich ausführen.
7. CI auf finalem Commit grün prüfen und erst danach Version, Laufzeitkennung und DRA-Spiegel konsistent erhöhen.

## CI-Prüfung
Für Commit `6f857467c0d225ac08d6e02fd6eca7897f7809a0` ergab die GitHub-Abfrage der zugehörigen PR-Workflow-Läufe keine Treffer; auch kombinierte Commit-Statusmeldungen fehlten. Dies beweist **keinen bestandenen CI-Lauf**. Ohne geprüfte Regressionen erfolgt keine Versionsfreigabe.

**Verbindlicher Bestandsschutz:** Kein Eingriff in `precipitation-layer.js`, Consumer V1/V2, P7-010, WR-Produktivcode, WL-03 oder WL-04. Neue Funktionen dürfen bis zur Fehlerbehebung und Tests nicht als produktionsreif bezeichnet werden.

C.K. – Eine Idee weiter gedacht.
