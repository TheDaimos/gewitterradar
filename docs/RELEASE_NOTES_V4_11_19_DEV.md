# Gewitterradar V4.11.19 DEV

Stand: **2026-10-07**  
Zweig: `feature/v4.11-development`

## Schwerpunkt

Zoomabhängige Komfortdarstellung für WeatherRouter-Wetterebenen und kompaktere Bedienung.

## Neuer Darstellungsmodus „Auto“

V4.11.19 ergänzt neben den festen Profilen einen neuen Modus **Auto**.

Auto ist ausdrücklich für Komfort und Visualisierung gedacht:

- weit herausgezoomt: stärkere flächige Glättung
- mittlere Zoomstufen: schrittweise klarere Strukturen
- nah herangezoomt: mehr Kontur und geringere Weichzeichnung
- keine harten Umschaltpunkte
- gleichmäßige Interpolation per `smoothstep`
- Auto geht bewusst **nicht** bis zur technischen Pixelansicht `Präzise`

`Präzise` bleibt jederzeit manuell wählbar.

Startwerte der Auto-Kennlinie:

- Interpolationsbereich ungefähr Zoom **4,5 bis 11,5**
- Blur etwa **6,2 px → 1,55 px**
- Sättigung etwa **1,18 → 1,08**
- Kontrast etwa **1,31 → 1,15**
- Helligkeit etwa **0,99 → 1,00**

Diese Werte sind Realtest-Kandidaten und können nach optischer Abnahme weiter feinjustiert werden.

## Darstellungsmodi als Dropdown

Die bisherigen nebeneinanderliegenden Darstellungs-Schaltflächen wurden durch ein kompaktes Dropdown ersetzt:

- Auto
- Präzise
- Ausgewogen
- Weich

Das Dropdown wird sowohl in den Weather-Engine-Einstellungen als auch im schwebenden Kartenmenü verwendet.

Vorteile:

- kein Platzproblem bei kleinen Kartenbreiten
- keine abgeschnittenen Schaltflächen
- keine künstlich verkleinerte Schrift
- einheitliche Auswahl an beiden Stellen
- mehr Platz für Transparenz und Legende

## Ausgewogen

Der feste Modus `Ausgewogen` wurde gegenüber dem bisherigen reinen Unschärfeeindruck zurückgenommen:

- weniger Blur
- etwas mehr Kontrast
- etwas mehr Sättigung

Die endgültige optische Abnahme erfolgt weiterhin im HA-Realtest.

## Hilfe & Hinweise

Unter **Hilfe & Hinweise** ist die Bedeutung der vier Darstellungsmodi dokumentiert. Auto wird als zoomabhängiger Komfortmodus erklärt.

## Unverändert

- WeatherRouter-Routing
- Providerwahl
- Niederschlagsdaten
- Leaflet-Kachel-`transform`
- `transformOrigin`
- Touch-/Pan-/Pinch-Zoom-Logik
- Transparenzmechanik
- finale Augenassets

## Stand

- Produkt **V4.11.19 DEV**
- Build **V4.11.19-DEV-2026-10-07**
- Runtime **41119r1**
- Modulsatz **E411-19A1**
- `core.manifest` **1.2.90**
- `ui.i18n-settings` **1.3.5**
- `weather.precipitation-layer` **1.3.5**
- `weather.display-menu` **0.4.1**
- Integration **0.25.0**

**C.K. – Eine Idee weiter gedacht.**
