# GewitterRadar V4.14.20 DEV — GeoPoint Inspector aus MA-021 öffnen

Datum: 27. November 2026  
Branch: `feature/v4.14-monitored-areas`
Status: Quell-Implementierung, DEV-CI und Tests; VM109-Realtest gesondert offen.

## Ziel

In den Standortdetails (Havanna / MA-021) ein hochwertiger Button **„GeoPoint Inspector öffnen“**, der den bereits existierenden WeatherRouter-basierten GeoPoint Inspector **direkt für die Koordinaten des gewählten Orts** öffnet. Keine künstliche zweite Wetteranzeige, keine Änderung an Referenztracker oder Kartenkamera.

## Tatsächlich vorhandene Schnittstelle

Der ursprüngliche Inspector befindet sich in `frontend/modules/weather/temperature-display.js`: `_weatherTemperatureInspect(latlng)`, `GeoPointAdapters`, `_weatherTemperaturePointRender()` und das originale Popup `weather-temperature-point`. Bestehende Provider: Temperaturfeld in 2 m und optional verfügbare 850-hPa-Wind-/Advektionswerte (einzelne Felder können `unavailable` liefern). **Luftdruck, Luftfeuchtigkeit, Taupunkt, Nebel, Frost und Glatteis sind noch keine tatsächlich bestehenden Inspector-Provider**. Sie werden hier weder vorgetäuscht noch in diese DEV-Iteration eingebaut. Erweiterung mit WeatherRouter/Atmospheric Moisture in einem gesonderten Modul möglich, V4.14 oder V4.15 nach Datenlage.

## Integration

1. `frontend/modules/weather/temperature-display.js`: neue Methode `_weatherTemperatureOpenGeoPointAt({latitude,longitude})`. Sie prüft WGS84-Koordinaten und vorhandene Map/Shadow, stellt die bestehenden Inspector-Adapter bereit, verwendet **denselben** Inspector-Aufruf wie der bisherige Kartentap und bestätigt nur dann `opened:true`, wenn das Originalpopup tatsächlich erscheint. Es wird **kein** `flyTo`, `setView`, `selectReference` oder Temperatur-Layer-Toggle ausgelöst.
2. `frontend/modules/ui/controls.js`: übergibt `openGeoPoint` als separate Callback-Funktion an die vorhandene Standortverwaltung und prüft das aktive Benutzer-/Vault-Profil **vor und nach** der asynchronen Anfrage. Keine Datenmutation oder Tracker-Umschaltung.
3. `frontend/modules/monitored-areas/location-manager.js`: neuer Premium-Button `GeoPoint Inspector öffnen` im vorhandenen Details-Aktionsbereich neben Koordinatenkopie und Kartenfokus. Der Button wird während der Anfrage gesperrt. **Erst nach positiver Inspector-Bestätigung** schließt sich das MA-Overlay, damit das bereits bestehende Popup auf der Karte sichtbar wird. Bei Fehler bleibt das Standortfenster stehen und zeigt eine ehrliche Fehlermeldung. DE/EN-Fallbacks.
4. Bestehende 43 Local-To-do-/SQLite-Orte und MA-020-Finalisierung sind vollständig unberührt. Keine neuen Provider, keine DB-Schemaveränderung. Das Inspector-Popup wird bewusst **nicht** als zweiter MA-Dialog dupliziert.

## Regressionstests

- `tests/test_ma021_geopoint_launch.mjs`: 22 Source-Assertions für den echten Inspector-Entry-Point, korrektes Koordinatenmapping, Schutz vor Kamera-/Tracker-Änderung, vorhandenen Provider, Modal-Schließreihenfolge und Fehlerrückmeldung.
- Aus direkt aus GitHub gelesenen Quellcodes ausgeführter isolierter Check: **22/22 PASS**.
- ECMAScript-Syntaxchecks der drei geänderten Module: **3/3 PASS**.
- Automatische öffentliche GR-Feature-Branch-CI `.github/workflows/ma-v41420-dev-build-sync.yml` führt zusätzlich MA-020-/MA-021-Regressionen, Frontend-Build und Installationsspiegel-/SHA-Sync aus; der bisherige V4.14.19-Buildtrigger ist historisch/manuell gestellt. Kein öffentlicher DEV-Release.

## Version und DEV-Abnahme

- Frontend `V4.14.20 DEV`, Runtime `41420r1`, ModuleSet `E414-20A1`, HA-Integration `0.25.206`, DRA-`BUILD_VERSION = "4.14.20"`.
- Nach DRA-Installation auf DEV VM109: Standortverwaltung öffnen → Havanna → **Details** → Akkordeon aufklappen → **GeoPoint Inspector öffnen**. Erwartung: Standortfenster schließt erst nach Erfolg, der bestehende Inspector zeigt exakt die Havanna-Koordinaten. Bei nicht verfügbaren Wetterschichten zeigt er einen echten Unavailable-Status; keine erfundenen Messwerte.
- Vorher/Nachher vergleichen: Kartenmittelpunkt und ausgewählter Referenztracker dürfen sich nicht ändern. Außerdem Offline-/fehlende Karte und erneutes Öffnen prüfen. Desktop, iPad Hoch/Quer, Android und Original-Havanna-Gestaltungsreferenz in der späteren gebündelten Abnahme.
- MA-021 bleibt bis zum Realtest **IMPLEMENTED**, MA-020 bleibt separat **IN_PROGRESS**. Keine automatische To-do-Leerung.
