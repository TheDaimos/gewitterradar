# Übergabe – Gewitterradar V4.09.06 frei verschiebbare Standort-Pille

Stand: **20.09.2026 · aktiver DEV/Testkandidat**

## Einstieg

- Repository: `TheDaimos/gewitterradar`
- aktiver Branch: `feature/v4.09.06-floating-location-pill`
- Branch-HEAD immer live prüfen
- öffentliche Rückfallbasis: **V4.08 FINAL / Integration 0.20.0**
- keine Promotion vor realer Geräteabnahme

## V4.09.06

Standort-Pille:
- im Vollbild frei verschiebbar auf Desktop, Android und iPad/iPad Pro;
- Position: `gewitterradar:v409:map-location-position`;
- Tap bleibt Standortmenü;
- Drag unterdrückt den Folge-Klick.

Standortmenü:
- oben → bevorzugt nach unten;
- unten → bevorzugt nach oben;
- Mitte → mehrspaltig;
- Platzmangel in bevorzugter Richtung → automatisch mehr Spalten;
- Android max. 2, breitere Ansichten max. 3 Spalten;
- Restüberlauf → interner Listen-Scroll;
- während geöffnetem Menü und Drag der Pille Live-Neuberechnung.

## Kanonische Frontend-Dateien

- `frontend/gewitterradar.js`
- `custom_components/gewitterradar/frontend/gewitterradar.js`
- `dashboard/dist/gewitterradar.js`

Alle drei müssen bytegleich bleiben.

## Testpfade

- `scripts/verify-v409-map-display.mjs`
- `scripts/test-v409-map-display.cjs`

## Nächste reale Abnahme

Android zuerst:
1. Standort-Pille per Finger verschieben.
2. Standortmenü öffnen und Pille bei geöffneter Liste verschieben.
3. Oben: Öffnung nach unten.
4. Unten: Öffnung nach oben.
5. Position etwa 30 % oberhalb des unteren Randes mit langer Liste: bei Platzmangel Mehrspaltigkeit.
6. Mitte: Mehrspaltigkeit.
7. Standort auswählen; kein unbeabsichtigtes Öffnen/Schließen nach Drag.

Danach iPad/iPad Pro und Desktop.
