# Gewitterradar WL-02 – technische Restarbeiten und nicht erteilte Freigabe

**Datum:** 19.10.2026 · **Repository/Zweig:** `TheDaimos/gewitterradar@deploy/dev`  
**Verbindlicher Status:** **KEIN CODE-PASS · KEIN CI-PASS · KEIN HA-REAL-PASS · KEINE DRA-FREIGABE.**

## 1. Übernommener, nicht erneut implementierter Bestand
`1cf9ab36` (WR-Coverage-Objektvertrag), `d5c9766f` (Abbau/Generation), `fee8c0c1` (Coverage-Testdatei), `bfd9ab4a` (Bewegung/Sichtbarkeit/Kachelstatus), `f13ca465` (Hook-Lebenszyklus), `8b02cc1c` (UTC/Quellenanzeige) bleiben erhalten.

## 2. Neue tatsächliche Änderungen auf deploy/dev
- `933cffb1`: Der allgemeine Wolken-/Windrasterpfad verwendet nun `rasterTilePixelCrops` aus dem **bestehenden** `p7-010/raster-tile-clip.js` statt eines bloßen Leaflet-`bounds`. Die Abdeckungsrechtecke werden mit Canvas gezeichnet; keine Bildfläche außerhalb der verifizierten Geometrie soll befüllt werden. Ein verifizierter globaler Scope erhält die komplette Kachel. Dateline-Segmente werden durch den schon vorhandenen geografischen Zuschnitt behandelt. Transparentes/fehlendes Bildmaterial wird nicht künstlich eingefärbt.
- `6140983d`: Offene Bildanfragen werden beim Entfernen der Wetterebene explizit abgebrochen; ein zeitliches Limit von zwölf Sekunden und eine Obergrenze von acht gleichzeitig aus dem Adapter gestarteten Bildern wurden eingeführt. Diese Obergrenze gilt bislang **pro Ebene**, nicht als gemeinsamer Niederschlags-/Wind-/Wolken-Gesamtetat; bei Überschreitung wird die Kachel als Fehler gemeldet statt in einer fairen Warteschlange eingeordnet.
- `6d204b25`: Separate Testdatei für regionale Pixelmasken, globale Abdeckung, außerhalb liegende Kacheln, Antimeridian und unbestätigte Coverage. **Im Repository vorhanden, Ausführung nicht nachgewiesen.**
- `2eafcb18`: Altersangabe und Beobachtungsart im Menü, Zurückweisung ausdrücklich als `stale` markierter V1-Antworten. Das ist **noch keine** vollständige fachliche Zeitklassifikation oder Lizenz-/Legendenansicht.

## 3. Tatsächliche Laufzeit-/Prüfnachweise
Der Quellcode wurde aus dem aktuellen privaten GitHub-Zweig über die GitHub-Verbindung gelesen und direkt dort aktualisiert. Es steht in der ausführenden Umgebung **kein ausgechecktes privates Repository** und keine vollständige Anwendungslaufzeit mit authentifiziertem Home Assistant zur Verfügung. Ein direkter Git-Checkout über die Containerverbindung schlug bereits an der fehlenden DNS-Erreichbarkeit von github.com fehl. Deshalb konnte kein `node --test` gegen die im Repository gespeicherten Dateien, kein Browser-/DRA-Integrationstest und keine vollständige GR-RF-/P7-010-Regression ausgeführt werden. Unausgeführte Testdateien sind ausdrücklich **kein PASS**.

GitHub-Abfragen nach PR-Arbeitsabläufen und kombinierten Commitstatus für den früheren Coverage-Testcommit lieferten jeweils leere Ergebnisse; ein CI-PASS ist damit nicht bewiesen. Aktuelle Abschlusstests und finale CI fehlen.

## 4. Konkrete technische Sperren / Fehlerquellen vor installierbarer Version
1. **WR-Laufzeitverträge:** Die statische Capability-Map ist ein Entwurf. XYZ-HTTPS-Vorlagen werden angenommen; abweichende WMS-/BBOX-Formate bleiben sicher gesperrt. Tatsächliche V1-`ready`-Beispiele, Kachelprojektion, CORS-Eignung und reale Satelliten-/Wind-Bildformate benötigen noch Vertrags- und Browsernachweise. Canvas-Beschneidung mit `crossOrigin=anonymous` verlangt tatsächlich geeignete Cross-Origin-Freigaben.
2. **Ressourcenschutz:** Gemeinsamer Bild-/Netz-/Speicherhaushalt mit Niederschlag, faire Anfragewarteschlange, Laufzeitmessung und Bildspeicherüberwachung fehlen. Die aktuelle Obergrenze verhindert nur mehr als acht gleichzeitig initiierte Bilder **pro Ebene**.
3. **Zustandswahrheit:** Das `load`-Ereignis bestätigt einen abgeschlossenen Leaflet-Ladezyklus, jedoch noch nicht vollständig korrelierte tatsächliche sichtbare Pixel/Deckung. Bildfehler, leere/NoData-Kacheln und „teilweise“ müssen mit einer realen Browserzeichnung getestet werden.
4. **Fachanzeige:** Herkunft/UTC/Alter/Beobachtungsart werden teilweise angezeigt; tatsächliche anklickbare Legende, konsistente Lizenzhinweise und alle Aktualitätsklassen fehlen noch.
5. **Lebenszyklus:** Map-Listener reagieren auf Bewegung und Sichtbarkeit; Kartenersetzung, Home-Assistant-Reconnect sowie hartes Stoppen aller HTTP-Anfragen und Wiedervorladung müssen durch produktionsnahe Laufzeittests belegt werden.
6. **Tests/CI:** Neue `tests/wl02-coverage-contract.test.mjs` und `tests/wl02-raster-geometry.test.mjs` müssen tatsächlich laufen. Dazu sind die bestehenden V1/V2-, GR-RF-01–04-, P7-010-/DWD-/NASA-, Karten-, UI-, Mobil- und DRA-Regressionsprüfungen vollständig und grün zu belegen.
7. **Auslieferung:** Keine neue DEV-Version, keine neuen Laufzeitkennungen oder gespiegelten Installationsdateien, solange CODE-/CI-PASS fehlen. Nicht geprüfte `deploy/dev`-Codeänderungen keinesfalls als installierbar ankündigen.

## 5. Empfohlene Reihenfolge bei verfügbarer Ausführungsumgebung
Zuerst `node --test` für WL-02 sowie gesamte Repository-Regressionssuite, danach echte Browserprüfung der direkt integrierten Modulabhängigkeiten und Kachelvorlagen. Danach die in §4 verbliebenen Fach- und Ressourcenlücken schließen, sämtliche Tests erneut durchführen und konkrete GitHub-Actions-Ergebnisse auf dem finalen Commit abnehmen. Erst dann alle drei Laufzeitkopien/Module/Manifest/Prüfsummen in **einer** DEV-Version konsistent ausliefern. Reale HA- und WR-/GR-Diagnosekorrelationen bleiben ausdrücklich die nachfolgende `HA-REAL-PASS`-Phase.

Keine Änderung an WeatherRouter, Niederschlagsrenderer oder WL-03/WL-04. Zukunftsfähige Vor-/Nachladepuffer bleiben konzeptionell möglich, wurden nicht implementiert.

**C.K. – Eine Idee weiter gedacht.**
