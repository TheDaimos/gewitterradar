# Gewitterradar V4.11.24 DEV

Stand: **2026-10-07**

## Auto-Nahzoom: sichtbare Rasterblöcke gezielt beseitigt

Der Mobile-Realtest von V4.11.23 zeigte, dass die Glättung zwar zunahm, bei starkem Nahzoom aber weiterhin große rechteckige Quellzellen und eckige Außenränder sichtbar blieben.

V4.11.24 ändert deshalb die Auto-Kennlinie erneut grundlegend:

- die Glättung wächst jetzt proportional zur tatsächlichen Übervergrößerung der Wetterdaten
- starke Übervergrößerung führt nicht mehr nur zu etwas zusätzlicher Unschärfe, sondern zu einer sehr viel stärkeren flächigen Verschmelzung
- die komplette Radar-Pane wird geglättet, nicht einzelne Kacheln separat
- Grün, Gelb, Orange und Rot sollen im Nahzoom weich ineinander übergehen
- Außenränder der Niederschlagsflächen sollen sichtbar auslaufen statt blockig abzubrechen
- zusätzlicher Kontrast wird im Nahzoom bewusst zurückgenommen, damit geglättete Farbstufen nicht erneut hart voneinander getrennt wirken

## Neue Auto-Kennlinie

- Referenz weiterhin `layer.options.maxNativeZoom`
- Übervergrößerung weiterhin `2^(zoom - maxNativeZoom)`
- Glättung wächst nun ungefähr proportional mit `overscale * 4.6`
- Maximalwert **150 px**
- Sättigung **1,05 → 1,16**
- Kontrast **1,08 → 0,98**
- Helligkeit **1,00 → 0,995**

Damit bleibt die Fernsicht strukturbetont, während starker Nahzoom konsequent in eine fließende, wolkenartige Komfortdarstellung übergeht.

## Abnahmekriterium

Im Auto-Modus darf bei starkem Nahzoom keine deutlich rechteckige Niederschlagszelle und kein sichtbar blockiger Außenrand mehr dominieren. Die Fläche soll optisch kontinuierlich wirken.

## Unverändert

- WeatherRouter-Routing
- Providerwahl
- Wetterdaten
- Leaflet-`transform`
- `transformOrigin`
- Touch-/Pan-/Pinch-Zoom
- feste Modi `Präzise`, `Ausgewogen`, `Weich`
- Kartenlegende `Darstellung: …`
- finale Augenassets

## Stand

- Produkt **V4.11.24 DEV**
- Build **V4.11.24-DEV-2026-10-07**
- Runtime **41124r1**
- Modulsatz **E411-24A1**
- `core.manifest` **1.2.95**
- `ui.i18n-settings` **1.3.6**
- `weather.display-menu` **0.4.6**
- Integration **0.25.0**

**C.K. – Eine Idee weiter gedacht.**
