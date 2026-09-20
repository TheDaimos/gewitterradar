# Übergabe – Gewitterradar V4.09.06

Stand: **20.09.2026 · aktiver DEV/Testkandidat**

- Repository: `TheDaimos/gewitterradar`
- aktiver Branch: `feature/v4.09.06-movable-location-pill`
- Branch-HEAD immer live prüfen
- öffentliche Rückfallbasis: **V4.08 FINAL / Integration 0.20.0**

## V4.09.06

Die Standort-Pille ist im Vollbild frei verschiebbar und speichert ihre normalisierte Position lokal.

Schlüssel:
`gewitterradar:v409:map-location-position`

Das vorhandene Standortmenü wird nicht dupliziert. Im Vollbild wird seine Darstellung automatisch berechnet:

- oben → nach unten;
- unten → nach oben;
- Mitte → mehrspaltig;
- zu geringe Höhe → ebenfalls mehrspaltig;
- geöffnete Liste → Live-Neuberechnung während des Verschiebens;
- 2 Spalten auf schmalen, bis zu 3 auf breiteren Ansichten;
- internes Scrollen nur als Rückfall.

## Kanonische Dateien

- `frontend/gewitterradar.js`
- `custom_components/gewitterradar/frontend/gewitterradar.js`
- `dashboard/dist/gewitterradar.js`

Die drei Frontend-Dateien müssen bytegleich bleiben.

## Tests

- `scripts/verify-v409-map-display.mjs`
- `scripts/test-v409-map-display.cjs`

## Nächste reale Prüfung

Android, iPad/iPad Pro und Desktop:
- Pille verschieben;
- oben/unten/mittig prüfen;
- lange Liste bei begrenzter Höhe prüfen;
- Liste geöffnet lassen und Pille bewegen;
- gespeicherte Position nach erneutem Vollbild prüfen.

Keine Promotion vor ausdrücklicher Geräteabnahme.
