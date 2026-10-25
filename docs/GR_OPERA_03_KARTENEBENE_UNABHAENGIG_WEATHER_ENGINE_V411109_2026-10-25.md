# GR-OPERA-03 – Kartenebene von Weather Engine getrennt

**Datum:** 25.10.2026  
**Repository:** TheDaimos/gewitterradar, ausschließlich deploy/dev  
**Neuer Stand:** Gewitterradar V4.11.109 DEV, Revision 411109r1, Modulsatz E411-109A1  
**Gegenstelle:** WeatherRouter V0.10.204 DEV / Loader 207  
**System:** ausschließlich HA DEV VM 109  
**Freigabe:** Noch keine abgeschlossene HA-DEV-Realabnahme

## Reproduzierte Ursache

Die auf Android beobachtete Zustandsrücksetzung war im ausführbaren Quellcode eindeutig nachvollziehbar: `_weatherEngineDiagnosticClose()` rief `this.__operaDiagnosticPane.close()` auf, setzte das Pane auf `null` und schrieb den Status auf `closed`. Ein Klick auf das Schließen-Symbol zerstörte daher selbst die aktive OPERA-Kartenebene. Beim erneuten Öffnen erschien folgerichtig wieder die Schaltfläche zum Starten.

## Tatsächlich umgesetzte Korrekturen

1. `_weatherEngineDiagnosticClose()` schließt jetzt ausschließlich das Weather-Engine-Fenster. Die OPERA-Kartenebene wird dabei nicht entfernt. Nur eine ausdrückliche Entfernung oder der sicherheitsbedingte Ablauf zerstört die Ebene. Ein vollständiger Seitenneustart aktiviert OPERA weiterhin **nicht automatisch**.
2. Beim erneuten Öffnen übernimmt die Weather Engine den tatsächlich aktiven Kartenstatus, die Anzahl erfolgreich dekodierter PNG-Kacheln und die Fehlerzahl. Die Start-/Entfernen-Schaltfläche berücksichtigt den wirklichen `active`-Zustand des Panes.
3. Der OPERA-Adapter führt getrennte Zähler für angeforderte, erfolgreich als Bild geladene, fehlgeschlagene und eingebundene Kacheln sowie begrenzte HTTP-Statuszähler und letzten Fehler. Ein WebSocket-Erfolg oder eine bloße Kachel-URL wird **nicht** als erfolgreich dargestelltes Raster gezählt.
4. Die Kartenkennzeichnung nennt OPERA ausdrücklich `UNGEPRÜFT`, Datenalter und Kachelstatus. Das Alter wird im 30-Sekunden-Takt fortgeschrieben. Nach Ablauf des 900-Sekunden-Fensters wird die Kartebene kontrolliert entfernt, der Zeitgeber gelöscht, ausstehende Abfragen abgebrochen und alle erzeugten Objekt-URLs widerrufen.
5. Bei einem HTTP-Fehler werden nur gekürzte Fehlermeldungen und numerische Statuscodes protokolliert. Die Kachelprüfung verlangt nach PNG-Signatur zusätzlich exakt 256 mal 256 Pixel. Zugriffstoken und vollständige autorisierte URLs gehören nicht zum Export.
6. Die OPERA-Kartenebene benutzt weiterhin eine eigene Leaflet-Ebene und den expliziten Administrator-Diagnosevertrag `diagnostic:true`; der normale Niederschlagsdienst, Consumer API V1 und die produktive Gefahrenbewertung werden nicht verändert.
7. Die ausgelieferten Spiegel unter `frontend/`, `custom_components/gewitterradar/frontend/` und `dashboard/dist/` wurden synchronisiert. Build, Laufzeitkennung, Versionsdatei, Modulmanifest und der WeatherRouter-Consumer-Modulsatz sind auf V4.11.109 abgestimmt. `weather.consumer-client` ist 1.2.11.
8. Ein gezielter Regressionstest wurde unter `tests/test_gr_opera03_window_lifecycle.py` hinzugefügt.

## Ausgeführte Prüfungen

Die GitHub-Versionen wurden nach der Änderung erneut abgefragt. Vier Gruppen wurden **programmatisch auf vollständige Textgleichheit** geprüft, jeweils über alle drei Auslieferungsorte: `consumer-client.js`, `opera-diagnostic-tile.js`, `version.js` und `gewitterradar-runtime-manifest.json`. **4/4 Vergleichsgruppen erfolgreich.** Der zuvor dokumentierte direkte Aufruf von `__operaDiagnosticPane.close()` in der Weather-Engine-Fensterbereinigung wurde nach der Korrektur gezielt auf Nichtvorhandensein geprüft. Die separate ausdrückliche Kartenentfernung, die 900-Sekunden-Sperre, Bildformatprüfung, Authentifizierung und sichere Ressourcenbereinigung wurden im aktuellen Quelltext anhand ihrer Kontrollstellen geprüft.

**Nicht ausgeführt / offen:** pytest-/Node-Programmausführung in einer vollständigen Repository-Arbeitskopie, tatsächlicher Browser-Test auf Android, HA-DEV-Kachelabruf, reale HTTP-Statusprüfung, reale Abnahme bei normalem Niederschlag AUS / OPERA EIN sowie Export2Git-Korrelation mit WeatherRouter. Die gespiegelten Dateien und die statischen Prüfungen ersetzen diese Realtests nicht. Daher **keine Aussage, dass die OPERA-Darstellung schon tatsächlich erfolgreich auf der Karte sichtbar war.**

## Nächster kontrollierter Abnahmedurchlauf

Nach erfolgreicher Testausführung kann V4.11.109 DEV als Kandidat ausschließlich auf HA DEV VM 109 mit DRA geprüft werden. Danach: frisches OPERA-Original in WR registrieren, Niederschlag ausschalten, OPERA starten, Weather Engine schließen, Karte prüfen, Weather Engine erneut öffnen, Status kontrollieren, Test ausdrücklich entfernen, Ablauf- und Fehlerfälle prüfen, zuletzt beide Export2Git-Diagnosen korrelieren.

**Sperren:** keine HA-PROD-Änderung, keine privaten GitHub Actions, keine automatische ungeprüfte OPERA-Gefahrenbewertung, keine wissenschaftliche Rasterfreigabe.

C.K. – Eine Idee weiter gedacht.
