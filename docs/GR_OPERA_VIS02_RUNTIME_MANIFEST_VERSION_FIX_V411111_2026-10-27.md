# Gewitterradar V4.11.111 DEV – Korrektur der Laufzeitmanifest-Abweichung

**Datum:** 27.10.2026  
**Repository:** `TheDaimos/gewitterradar` · ausschließlich `deploy/dev`  
**Version:** V4.11.111 DEV · Build `V4.11.111-DEV-2026-10-27` · Laufzeit `411111r1` · Modulsatz `E411-111A1` · native Integration `0.25.20`.

## Echter Fehlerbefund

Die auf HA DEV VM109 eingesetzte V4.11.110 meldete 34/34 korrekt geladene Module, gleichzeitig aber `installedId=E411-109A1`, `installedRevision=411109r1`, `installedReleaseMismatch=true` und `revisionMismatch=true`. Browser-Zwischenspeicher, Inkognito-Sitzung und HA-Neustart änderten dies nicht.

Direktes Rücklesen aus privatem GitHub bestätigte die Ursache: **Alle drei Auslieferungsdateien `assets/gewitterradar-runtime-manifest.json` enthielten noch V4.11.109**, inklusive `core.manifest=1.2.157` und `weather.consumer-client=1.2.11`, obwohl die laufenden Module bereits 1.2.158 beziehungsweise 1.2.12 meldeten.

`modules/diagnostics/module-view.js` liest genau dieses Manifest per `moduleRuntimeManifestUrl()` und markiert die Abweichung; `modules/core/update-watch.js` verwendet dieselbe Manifestdatei zum Installationsvergleich. Ein Browserproblem war somit nicht die Ursache.

## Tatsächlich implementiert

- Neue konsistente Version V4.11.111 DEV, Build und Laufzeitkennung `411111r1`, Modulsatz `E411-111A1`, native Integrationsversion `0.25.20`.
- Laufzeitmanifest in **allen drei** Verzeichnissen `frontend/`, `custom_components/gewitterradar/frontend/`, `dashboard/dist/` aktualisiert: `productVersion=4.11.111`, `displayVersion=V4.11.111 DEV`, `build=V4.11.111-DEV-2026-10-27`, `runtimeRevision=411111r1`, `moduleSetId=E411-111A1`, `core.manifest=1.2.159`, `weather.consumer-client=1.2.12`.
- `version.js`, `module-manifest.js`, `gewitterradar.js` und `panel.js` in allen drei Auslieferungspfaden auf die neue Version und Importkennung synchronisiert.
- `custom_components/gewitterradar/manifest.json` auf 0.25.20 erhöht.
- Keine Veränderung an WeatherRouter; OPERA-Vorschaucode unverändert.

## Prüfnachweise und Grenzen

Die fünf zentralen Dateien (`version.js`, `module-manifest.js`, `gewitterradar.js`, `panel.js`, `assets/gewitterradar-runtime-manifest.json`) wurden nach den Änderungen aus allen drei Pfaden erneut über den GitHub-Konnektor gelesen. Jeweils **alle drei Blob-SHA waren identisch**. Das belegt die vollständige Spiegelgleichheit dieser Dateien auf `deploy/dev`, nicht jedoch die Installation auf VM109.

**Nicht ausgeführt:** Automatisierte Node-Tests, DRA-Installation, HA DEV VM109-Realabnahme und OPERA-Livevorschau. Die tatsächliche Bereitstellung muss erst nach kontrolliertem Update und Home-Assistant-Neustart verifiziert werden. Die wissenschaftliche OPERA-Rasterzulassung bleibt gesperrt. HA PROD VM101 unverändert. Keine privaten GitHub Actions.

**Ziel beim DEV-Realtest:** 34/34 Module; `installedId=releaseId=E411-111A1`; `installedRevision=localRevision=411111r1`; `installedReleaseMismatch=false`; `revisionMismatch=false`; `stale=false`. Anschließend OPERA-Vorschau gezielt prüfen.

C.K. – Eine Idee weiter gedacht.
