# GR – WR-Refresh beim Karten-Debounce erhalten (05.11.2026)

## Implementierung

Repository: `TheDaimos/gewitterradar`, Branch `deploy/dev`.

Im Modul `frontend/modules/weather/precipitation-layer.js` konnte ein von WR erzwungener Aktualisierungsabruf verloren gehen: Die mit `force: true` geplante Aktualisierung etwa nach Android-/iPad-Rückkehr wurde durch ein kurz darauf auftretendes gewöhnliches `moveend`/Viewport-Ereignis ersetzt. Der Debounce-Timer übernahm dabei bislang nur das `force` des letzten Aufrufs.

**Änderung:** `_scheduleWeatherRadarRefresh` merkt sich ein anstehendes `force: true` über weitere Debounce-Ereignisse bis zur tatsächlichen Ausführung. Beim Teardown wird diese Absicht zurückgesetzt. Es wird keine GR-eigene Gültigkeitsdauer ergänzt: WeatherRouter bleibt allein zuständig für `valid_until` und Provider-Autorisierung.

Commits:
- `a66638e78a83612417b32f056f4d68e4fb3d8320` – Force-Absicht im Debounce erhalten.
- `644d17a812d4c1ba721a95ede44b707581f854d8` – State initialisieren und beim Teardown zurücksetzen.

## Test- und Betriebsgrenzen

Kein HA-Realtest auf VM 109 durchgeführt. Keine Versionsnummer umetikettiert. Installation des aktuellen `deploy/dev`-Dateistands auf DEV dient der Prüfung von App-Foreground, Kartenbewegung und WR-Neuvalidierung. Keine privaten GitHub Actions verwenden; CI ausschließlich in Public-Repositories. TEST69 wird nicht erneut ausgeführt.
