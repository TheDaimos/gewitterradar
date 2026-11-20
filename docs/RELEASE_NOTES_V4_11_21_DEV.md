# Gewitterradar V4.11.21 DEV

Stand: **2026-10-07**

## Auto-Darstellung korrigiert

Der Realtest von V4.11.20 hat gezeigt, dass die erste Auto-Kennlinie in der Fernsicht zu weich war. Kleine Wetterstrukturen gingen beim starken Herauszoomen verloren.

V4.11.21 dreht die Logik deshalb bewusst um:

- **weit herausgezoomt:** strukturbetonter und näher an `Ausgewogen`
- **mittlere Zoomstufen:** gleitender Übergang
- **nah herangezoomt:** zunehmend weich/flächig für angenehmere Visualisierung
- keine harten Umschaltpunkte
- `Präzise` bleibt jederzeit als eigener technischer Modus verfügbar

Die Interpolation erfolgt weiterhin gleichmäßig per `smoothstep`.

Aktuelle Auto-Kennlinie:

- Zoom ca. **4,5 → 11,5**
- Blur ca. **1,35 px → 5,6 px**
- Sättigung ca. **1,07 → 1,18**
- Kontrast ca. **1,13 → 1,32**
- Helligkeit ca. **1,00 → 0,99**

## Aktiver Darstellungsmodus in der Kartenlegende

Die untere Kartenlegende zeigt jetzt zusätzlich dauerhaft:

- `Darstellung: Auto`
- `Darstellung: Präzise`
- `Darstellung: Ausgewogen`
- `Darstellung: Weich`

Der Eintrag synchronisiert sich direkt beim Umschalten. Damit ist der aktive Modus auch auf Screenshots eindeutig erkennbar und spätere Realtest-Vergleiche lassen sich zuverlässiger auswerten.

## Unverändert

- WeatherRouter-Routing
- Providerwahl
- Niederschlagsdaten
- Leaflet-Kachel-`transform`
- `transformOrigin`
- Touch-/Pan-/Pinch-Zoom
- Transparenzmechanik
- finale Augenassets

## Stand

- Produkt **V4.11.21 DEV**
- Build **V4.11.21-DEV-2026-10-07**
- Runtime **41121r1**
- Modulsatz **E411-21A1**
- `core.manifest` **1.2.92**
- `ui.skeleton` **1.1.19**
- `ui.render` **1.0.3**
- `weather.display-menu` **0.4.3**
- Integration **0.25.0**

**C.K. – Eine Idee weiter gedacht.**
