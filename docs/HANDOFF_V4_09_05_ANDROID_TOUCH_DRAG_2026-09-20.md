# Übergabe – Gewitterradar V4.09.05 Android-Touch-Dragging

> **SUPERSEDED:** Aktive Fortsetzung ist V4.09.06 auf `feature/v4.09.06-movable-location-pill`. Verbindliche Übergabe: `docs/HANDOFF_V4_09_06_MOVABLE_LOCATION_PILL_2026-09-20.md`.

Stand: **20.09.2026 · aktiver DEV/Testkandidat**

## Einstieg

- Repository: `TheDaimos/gewitterradar`
- aktiver Branch: `feature/v4.09.05-android-touch-drag`
- Branch-HEAD immer live prüfen
- öffentliche Rückfallbasis: **V4.08 FINAL / Integration 0.20.0**
- keine Promotion vor realer Geräteabnahme

## Verifizierter Gerätebefund

V4.09.04:
- Desktop: Kompass und Medaillon ein-/ausblendbar und frei verschiebbar.
- Android: Kompass und Medaillon ein-/ausblendbar, aber **nicht verschiebbar**.
- Android: Medaillon soll **15 % kleiner** werden.

## V4.09.05

- gemeinsamer Pointer-Event-Pfad bleibt bestehen;
- zusätzlicher `touchstart/touchmove/touchend/touchcancel`-Fallback;
- Touchlistener `passive:false` + Capture;
- Touch-ID wird über die komplette Geste gehalten;
- normalisierte Positionen werden unverändert gespeichert;
- Android-spezifische Medaillongröße = 85 % von V4.09.04;
- iPad und Desktop werden nicht kleiner skaliert;
- reines Trendmedaillon ohne History bleibt unverändert;
- Layer-Control bleibt knapp über der Leaflet/OpenStreetMap-Attribution.

## Dateien

Kanonische Quelle:
- `frontend/gewitterradar.js`

Bytegleiche Ausleitungen:
- `custom_components/gewitterradar/frontend/gewitterradar.js`
- `dashboard/dist/gewitterradar.js`

Tests:
- `scripts/verify-v409-map-display.mjs`
- `scripts/test-v409-map-display.cjs`

## Nächste reale Prüfung

Android zuerst:
1. Kompass ziehen.
2. Loslassen und erneut ziehen.
3. Position nach Aus-/Einblenden prüfen.
4. Medaillon ziehen.
5. Medaillongröße beurteilen.
6. Position nach Aus-/Einblenden prüfen.

Danach iPad/iPad Pro und Desktop Regression.

Erst nach ausdrücklicher Bestätigung Promotion vorbereiten.
