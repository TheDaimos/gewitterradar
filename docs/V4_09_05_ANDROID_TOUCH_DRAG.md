# Gewitterradar V4.09.05 – Android-Touch-Dragging

> **SUPERSEDED durch V4.09.06.** Die Touch-Korrekturen bleiben Bestandteil des V4.09.06-Teststands.

Stand: **20.09.2026 · DEV/Testkandidat**

## Reale Ausgangslage

V4.09.04 wurde auf Desktop erfolgreich geprüft: Kompass und Medaillon lassen sich dort ein-/ausblenden und frei verschieben.

Auf Android funktionieren beide Ein-/Aus-Schalter, die Overlays lassen sich per Finger jedoch nicht verschieben. Zusätzlich soll das Medaillon auf Android gegenüber V4.09.04 um **15 % kleiner** dargestellt werden.

## Technische Korrektur

V4.09.05 behält Pointer Events für Maus, Stift und Browser mit funktionierendem Pointer Capture. Zusätzlich erhalten Kompass und Medaillon einen expliziten Touch-Event-Pfad:

- `touchstart`
- `touchmove`
- `touchend`
- `touchcancel`

Die Listener laufen mit `passive:false` und Capture auf der jeweiligen Overlay-Fläche. Dadurch kann die Finger-Geste aktiv mit `preventDefault()` von Leaflet-/Browser-Panning getrennt werden. Die Touch-Geste bleibt über ihre Touch-ID bis zum Ende an dasselbe Overlay gebunden.

Die gespeicherten normalisierten Positionen bleiben unverändert:

- `gewitterradar:v409:map-compass-position`
- `gewitterradar:v409:map-medallion-position`

## Android-Medaillongröße

Android wird über den User-Agent erkannt. Nur dort erhält das Medaillon die Klasse `android-device`.

Mobile V4.09.04:
`clamp(92px,28vmin,150px)`

Android V4.09.05 = exakt 85 %:
`clamp(78.2px,23.8vmin,127.5px)`

Auch für größere Android-Ansichten ist die Basisskalierung auf 85 % gesetzt. Desktop und iPad/iPad Pro bleiben unverändert.

## Unverändert

- V4.08 FINAL;
- Kompassgröße;
- reines Trendmedaillon ohne History;
- getrennte Sichtbarkeit;
- Layer-Schaltfläche knapp über Leaflet/OpenStreetMap;
- Standortanzeige oben rechts;
- Warnsystem-Test-Fail-Closed;
- Standard/Groß/Vollbild;
- separates Kartenfenster;
- Cluster/Radien/Aura;
- Hi-Res-/Masterassets.

## Reale Abnahme

1. Android Vollbild öffnen.
2. Kompass einblenden und per Finger über längere Strecke verschieben.
3. Loslassen, erneut greifen und erneut verschieben.
4. Kompass aus-/einblenden und gespeicherte Position kontrollieren.
5. Medaillon einblenden und prüfen, dass es sichtbar ca. 15 % kleiner als V4.09.04 ist.
6. Medaillon per Finger verschieben, aus-/einblenden und Position kontrollieren.
7. iPad/iPad Pro dieselben Touch-Drag-Schritte ausführen.
8. Desktop Maus-Dragging regressionsprüfen.
9. Layer-Control, Standortmenü und separates Kartenfenster prüfen.

Keine Promotion vor ausdrücklicher Geräteabnahme.
