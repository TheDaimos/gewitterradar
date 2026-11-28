# GewitterRadar V4.14.26 DEV – Standort-Navigation und GeoPoint-Fenster

Datum 28.11.2026 · Branch `feature/v4.14-monitored-areas`. **DEV, kein FINAL.**

## Betreiberbefund V4.14.25
Android-Screenshots zeigen funktionierende SQLite-Standortverwaltung mit 39 aktiven Orten, Standort-Sichtfenster, Standortdetails, korrekter Kurzbezeichnung `GeoPoint`. Betreiber fordert die bereits im normalen GR-Einstellungsmenü vorhandene **Zurück-Navigation** mit goldenem Chevron, transparentem Interaktionsbereich statt dekorativem sichtbarem Button. Bei `GeoPoint` erscheint trotz Klick kein sichtbares Informationsfenster.

## Umsetzung
- **Zurück**: Im Standortverwaltungs-Hauptdialog führt es zum dahinterliegenden GewitterRadar; im Standort-Sichtfenster und bei der Neuanlage zurück zur Standortverwaltung; im Standortdetail zur Standortverwaltung. Premium-Schließen-X bleibt separat vorhanden.
- Gestaltung analog GR Einstellungen: goldener, nach links gerichteter Chevron und Schriftzug, ganze Zeile als unsichtbarer Button mit Tastaturfokus/44-px-Mindesthöhe. Im Standortdetail steht die Navigation **außerhalb** des scrollbaren Detailbereichs.
- **GeoPoint sichtbares Resultat**: Der vorhandene `weather.temperature-display`-Inspector wird über die unveränderte Methode `_weatherTemperatureOpenGeoPointAt` aufgerufen. Da der originale Ausgabebereich `weather-temperature-point` innerhalb `map-card` liegt und auf Android durch Standortdialoge/Fullscreen überdeckt sein kann, übernimmt `geopoint-window.js` **ausschließlich die tatsächlich gerenderten Strong/P-Felder** in ein sichtbares Premium-Fenster über den Standortebenen. Ursprungs-Panel wird nur als doppelte optische Anzeige versteckt. Auf `Zurück` im GeoPoint-Fenster wird wieder das Standortdetail beziehungsweise Standort-Sichtfenster sichtbar.
- Fehlende Wetterdaten werden vom bestehenden Provider als `unavailable` oder Quell-Fehler gemeldet, **nicht** synthetisch ergänzt. Kein Trackerwechsel, keine automatische Temperaturaktivierung, keine Kartennavigation und keine SQLite-/HA-Konfigurationsmutation.
- Die Zugriffskontrolle für Standortprofildaten und die bestehende WeatherRouter-/Provider-Isolation bleibt unverändert. GeoPoint-Fenster wird nur nach erfolgreichem autorisierten Aufruf angezeigt.

## Technik
Neue Version `4.14.26`, Runtime `41426r1`, ModuleSet `E414-26A1`, HA Integration `0.25.212`. Zusätzlich: Tests `test_ma026_navigation_geopoint.mjs`, aktualisierter MA-021-GeoPoint-Vertrag, neues Modul im Frontend-Inventar, synchronisierte Mirror-/DRA-Versionen. Erforderliche Gates: V4.14.26-DEV-Build, MA-V9, Home Assistant Runtime, Shared Frontend und Hi-Res auf dem tatsächlich gelieferten Build-SHA.

## Noch offen
DRA-Installation ausschließlich auf DEV VM109 nach Snapshot/Branch-/Vorschaukontrolle. Betreiber T2: GeoPoint mit/ohne aktive Wetterprovider, Standortdetails → GeoPoint → Zurück und Sichtfenster → GeoPoint → Zurück auf Android; anschließend iPad/Desktop. Bestehende 43 SQLite-Orte, PROD VM101 und WeatherRouter bleiben unberührt.

## Betreiberkorrektur 28.11.2026 nach Android-T2
- V4.14.26-Screenshots: GeoPoint-Inspector-Chevron funktioniert und bleibt unverändert.
- Im Standort-Sichtfenster war die vorhandene Navigation auf Android nicht sichtbar: Back-Zeile direkt zwischen fixiertem Header und Toolbar mit erzwungenem transparentem Inline-Flex, 44 px Touchfläche und ohne Button-Chrome.
- Im Standortdetail war Zurück als vollbreiter grauer Button sichtbar: eigener flexibler Navigationsstreifen mit linkem Gold-Chevron und Status-Badge rechts daneben. Der Status wurde aus dem Titelkopf in diesen Streifen versetzt; keine Veränderung an Daten/SQLite.
- Änderungen synchronisiert in `frontend/`, `custom_components/gewitterradar/frontend/` und `dashboard/dist/`; Regressionstest `tests/test_ma026_navigation_geopoint.mjs` entsprechend ergänzt.
- Reiner Quellcode-Fix auf dem Feature-Branch; **keine Behauptung über DRA-Bereitstellung oder installierten DEV-Build** ohne gesonderte Build-Verifikation.
