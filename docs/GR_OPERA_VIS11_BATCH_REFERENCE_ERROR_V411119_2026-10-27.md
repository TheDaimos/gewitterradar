# GR VIS-11 – OPERA-Kachel-ReferenceError batch is not defined

**27.10.2026 · Gewitterradar V4.11.119 DEV · deploy/dev · HA DEV VM109**

## HA-DEV-Beleg
Export 2026-10-27T12:29:30Z: GR V4.11.118 und WR V0.10.253, Discovery present/compatible/ready; OPERA-Diagnose `status=blocked`, `code=opera_client_error`, `reason=batch is not defined`. Nach WR VIS-07 tritt der frühere Freigabefehler nicht mehr als letztes Fehlerbild auf.

## Ursache und Reparatur
In `modules/weather/p7-010/opera-diagnostic-tile.js` rief der erste Leaflet-`GridLayer.createTile`-Aufruf `batch.requested++` auf. Eine Variable `batch` existiert dort nicht. Zusätzlich referenzierten die Bildlade-/Fehlercallbacks `batch.completed`/`batch.failed`. Die undefinierten Zusatz-Zähler wurden ersatzlos entfernt; die vorhandenen `metrics.requested/loaded/failed/pending/mounted` liefern bereits die OPERA-Ladebilanz. Der geschützte HTTP-PNG-Pfad, Authentisierung und wissenschaftliche Sperren bleiben unverändert.

Die OPERA-Adapter-Importrevision in `consumer-client.js` wurde von altem `411110r1` auf `411119r1` angehoben, damit die reparierte Adapterdatei nicht aus einem älteren Browsercache kommt.

## Versionskonsistenz
Gesamtversion V4.11.119 DEV, Runtime 411119r1, Modulset E411-119A1, native Integration 0.25.28, DRA BUILD_VERSION 4.11.119, core.manifest 1.2.167. Frontend-Spiegel `frontend`, `dashboard/dist` und `custom_components/gewitterradar/frontend` identisch.

## Abnahmegrenze
GitHub-Rücklesen nach Commit vorgesehen; keine selbst ausgeführte HA-DEV-Realabnahme. Nach DRA auf VM109 OPERA erneut als Admin bei frischem OPERA-Frame testen. Erfolg: kein `opera_client_error`; `UNVERIFIED_DEV_PREVIEW` und tatsächliche PNG-Ladebilanz. Weitergehende HTTP-/Framefehler gesondert behandeln. PROD VM101 nicht verändern. Keine wissenschaftliche Freigabe.

C.K. – Eine Idee weiter gedacht.
