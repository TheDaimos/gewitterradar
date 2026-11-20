# Gewitterradar V4.11.108 DEV – OPERA-Diagnose der serverseitigen Sperre

**24.10.2026 · deploy/dev · nur HA DEV VM 109 · keine OPERA-Freigabe**

## Ausgangsfehler

Der reale Weather-Engine-Export unter V4.11.107 zeigt WeatherRouter `ready:true` und OPERA `status:blocked` mit der bislang pauschalen Meldung `OPERA diagnostic authorization or contract rejected`. Das bestätigt weder eine HTTP-Kachel-Fehlfunktion noch eine Freigabe. Die Ursache kann vor einer serverseitigen Kachelbereitstellung liegen.

## Tatsächliche Quellcodeänderungen

1. `modules/weather/p7-010/opera-diagnostic-tile.js` unterscheidet jetzt ausdrücklich eine serverseitige OPERA-Ablehnung (`status != diagnostic_unverified`) von einem fehlerhaften positiven Vertrag. Eine Ablehnung bleibt vollständig gesperrt; Status, Sperrgrund und Ebenenzahl werden in einem begrenzten, nicht geheimen Diagnosedatensatz übergeben. Kein Raster wird bei Ablehnung erzeugt.
2. `modules/weather/consumer-client.js` übernimmt `code` und `server_diagnostic` in `opera_diagnostic` für den vorhandenen Weather-Engine-JSON-Export. Der bestehende Administratorcheck und die Trennung von ungeprüften OPERA-Daten bleiben bestehen.
3. Alle drei Frontend-Verzeichnisse `frontend/`, `custom_components/gewitterradar/frontend/` und `dashboard/dist/` wurden geändert. Neue Produktversion **V4.11.108 DEV**, Laufzeit `411108r1`, Modulsatz `E411-108A1`, `weather.consumer-client` **1.2.10**, `core.manifest` **1.2.156**; `build_info.py` und `scripts/build-frontend.mjs` angepasst.

## Tatsächliche Prüfungen

- Dateien auf GitHub geschrieben und nach dem Schreiben aus `deploy/dev` zurückgelesen.
- Direkter byteweiser Vergleich der drei Frontend-Bäume für `version.js`, `gewitterradar.js`, `module-manifest.js`, `consumer-client.js` und `opera-diagnostic-tile.js`: Übereinstimmung bestätigt.
- Abweichende dritte Kopien des Runtime-Manifests entdeckt und im selben Arbeitsgang angeglichen.
- **Nicht ausgeführt:** vollständige Node-/Python-Regressionssuite, Browser-/Companion-App-Tests, echter OPERA-Datentest, DRA-V2-Installationsprüfung, Export2Git-Realabnahme. Keine Erfolgsmeldung hierfür.

## Weiterhin offen / Sicherheit

WeatherRouter verwendet für einen diagnostischen positiven OPERA-Rastervertrag insbesondere `http_route_active`, registrierte Daten, serverseitige Profilzulassung und Adminrechte. Wenn diese nicht erfüllt sind, muss er sicher ablehnen. Die Änderung verbessert die Sichtbarkeit dieser Ablehnung, **sie schaltet die WeatherRouter-Sperren nicht aus**. Erst ein erneuter Diagnoseexport nach Installation auf HA DEV VM 109 kann beweisen, welche serverseitige Sperre greift. Produktive Gefahrenfunktionen und Consumer API V1 bleiben unverändert. Keine Änderungen an HA PROD VM 101 oder privaten GitHub Actions.

**Freigabe:** Quellcode-Diagnosefix vorhanden, **noch kein freigegebener DRA-V2-Testkandidat**, keine wissenschaftliche OPERA-Gesamtfreigabe.

C.K. – Eine Idee weiter gedacht.
