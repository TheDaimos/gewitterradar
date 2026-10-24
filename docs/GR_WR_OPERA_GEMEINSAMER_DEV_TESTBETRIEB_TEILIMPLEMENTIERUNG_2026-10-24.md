# GR/WR-OPERA – Gemeinsamer DEV-Testbetrieb: tatsächliche Teilimplementierung

**Datum:** 2026-10-24  
**Ziel:** HA DEV VM 109, ausschließlich Entwicklungszweig `deploy/dev`  
**Gegenstelle:** WeatherRouter V0.10.200 DEV / Loader 203  
**Freigabe:** **GESPERRT – kein abgenommener HA-DEV-Testkandidat**

## Quellenprüfung
Der Originalbericht `WR_D2_OPERA_GEBUENDELTE_DEV_GEOMETRIE_GR_V010200_2026-10-24.md` wurde vollständig gelesen. Der WeatherRouter enthält bereits die getrennten Verträge `diagnostic_rate_response`, `OperaTileView`, Administratorprüfung und authentifizierte PNG-Kacheln. Keine WeatherRouter-Änderung war auf Grundlage dieser Prüfung erforderlich. Der unabhängige Nord-Süd- und Pixelpositionsnachweis fehlt weiter. Der HTTP-Endpunkt ist laut Quelltext bis zur kontrollierten Freischaltung gesperrt.

## Tatsächlich im Gewitterradar-Quellcode geändert
- In `frontend/modules/weather/consumer-client.js` sowie beiden ausgelieferten Spiegeln `custom_components/gewitterradar/frontend/...` und `dashboard/dist/...` ist ein ausdrücklicher, manuell auslösbarer OPERA-Diagnoseschalter im Fenster **Weather Engine** hinzugefügt.
- Administratorprüfung im Browser; WebSocket-Anfrage über den bestehenden `requestOperaDiagnosticPane` mit ausdrücklich `diagnostic:true`; keine Änderung des normalen automatischen V1/V2-Wetterpfads.
- Getrennte, sichtbare Rückmeldung „OPERA – ungeprüfte Testdarstellung“, explizites Entfernen der temporären Ebene und Statusaufnahme `opera_diagnostic` in den Weather-Engine-Diagnoseexport ohne Zugriffstoken oder Kachel-URL.
- Bestehender OPERA-PNG-Adapter in beide bisher fehlenden Verzeichnisse `custom_components/gewitterradar/frontend/modules/weather/p7-010/` und `dashboard/dist/modules/weather/p7-010/` kopiert. Der Adapter prüft `diagnostic_unverified`, `raster_approved=false`, Quellidentität, Korrelation, HTTP-Inhaltstyp, Statuskopf, PNG-Signatur und Größenlimit, verwendet Bearer-Authentifizierung und Blob-Bildanzeige. Die Ebene benutzt keinen normalen Niederschlags-Cache.
- Leaflet wird über die bestehende Modulabhängigkeit `loadLeafletJs` statt über eine vorausgesetzte globale Variable angefordert.
- Der aktuelle Code verändert keine produktive Gefahrenbewertung. Consumer API V1 bleibt unangetastet.

## Test- und Freigabegrenzen
**GitHub-Quellprüfung:** die drei veränderten `consumer-client.js`-Spiegel wurden aus GitHub zurückgelesen und waren nach der ersten Implementierung bytegleich; der hinzugefügte OPERA-Adapter in der HA-Integrationsstruktur wurde aus GitHub zurückgelesen. Der danach ergänzte Leaflet-Lader ist in allen drei Spiegeln committed, aber noch nicht durch einen realen Browserlauf bestätigt.

**Nicht ausgeführt:** automatisierte Node-Regressionen, Browser-Funktionstests, authentifizierte HTTP-Kachelabfragen auf VM 109, tatsächlicher Seitenneustart, Quellenwechsel, End-to-End-Export2Git und gemeinsame Realabnahme. Dieser Entwicklungsweg hat keinen bestätigten Zugriff auf eine Home-Assistant-Laufzeit oder lokale vollständige Repository-Arbeitskopie zum Ausführen der Testprogramme; daher wird kein Testerfolg behauptet.

## Vor einer kontrollierten Installation zu schließen
1. Auslieferungs-Caches/Versionsmanifest und tatsächlich geladene Moduldateien überprüfen sowie syntaktische und funktionale Regressionen ausführen.
2. Testzugang und explizite Diagnoseregistrierung auf **HA DEV VM 109** prüfen; HTTP-Endpunkt darf nicht ohne geprüfte Berechtigungen freigeschaltet werden.
3. Reale HDF5-Georeferenz, Nord-Süd-Orientierung, geografische Pixelposition, Sonderwerttransparenz, UTC-Zeitstempel, Nachladen sowie Quellenwechsel und Neustart unabhängig vermessen.
4. Berechtigungsfehler, Ablauf, Abbruch und Speicher-/Objekt-URL-Aufräumung im Browser nachvollziehen.
5. Korrelierte Diagnose- und Export2Git-Realtests durchführen.

**Keine Änderungen an HA PROD VM 101. Keine privaten GitHub Actions. Keine wissenschaftliche Gesamtfreigabe.**

C.K. – Eine Idee weiter gedacht.
