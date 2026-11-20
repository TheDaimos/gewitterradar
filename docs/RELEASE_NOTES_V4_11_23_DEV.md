# Gewitterradar V4.11.23 DEV

Stand: **2026-10-07**

## Auto-Nahzoom: echte Entpixelung statt nur stärkerer Unschärfe

Der Realtest von V4.11.22 zeigte, dass die Auto-Darstellung zwar bei jeder Zoomstufe neu berechnet wurde, die sichtbaren Rasterzellen im starken Nahzoom aber weiterhin zu groß und eckig blieben.

V4.11.23 richtet die Glättung deshalb nicht mehr nur an einer festen Zoomkennlinie aus, sondern an der tatsächlichen Übervergrößerung der Wetterdaten gegenüber ihrer nativen Rasterauflösung (`maxNativeZoom`).

Damit gilt:

- nahe an der nativen Auflösung bleibt Auto strukturbetont
- mit jeder Übervergrößerungsstufe wächst die Glättung deutlich
- große Quellpixel werden im Nahzoom zu einer zusammenhängenden Fläche verschmolzen
- Außenkanten und Farbstufen gehen zunehmend weich ineinander über
- Grün, Gelb, Orange und Rot sollen wie ein kontinuierlicher Farbverlauf wirken
- starke Kerne bleiben über moderaten Kontrast und Sättigung klar erkennbar

Die Pane wird als Ganzes gefiltert. Dadurch entstehen keine absichtlich getrennt geglätteten Einzelkacheln.

## Technische Kennlinie

Auto verwendet jetzt:

- native Referenz: `layer.options.maxNativeZoom`
- Übervergrößerung: `2^(zoom - maxNativeZoom)`
- Glättung: etwa **1,2 px** an der nativen Auflösung bis maximal **28 px** im starken Nahzoom
- Sättigung: **1,06 → 1,24**
- Kontrast: **1,10 → 1,26**
- Helligkeit: **1,00 → 0,985**

Die Übergänge werden gleitend berechnet.

## Diagnose

Für die Raster-Pane werden intern zusätzlich hinterlegt:

- aktuelle Auto-Zoomstufe
- Übervergrößerungsfaktor
- aktuell verwendete Glättungsstärke

Damit lassen sich spätere Realtests präziser auswerten, ohne zusätzliche sichtbare Diagnoseelemente einzubauen.

## Hilfe

Die Beschreibung des Auto-Modus wurde in Deutsch und Englisch an das tatsächliche Ziel angepasst:

- Fernsicht: kleine Wetterstrukturen erhalten
- Nahsicht: Rasterzellen zunehmend zu einer fließenden, wolkenartigen Fläche verschmelzen
- `Präzise` bleibt als technischer Modus separat wählbar

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

- Produkt **V4.11.23 DEV**
- Build **V4.11.23-DEV-2026-10-07**
- Runtime **41123r1**
- Modulsatz **E411-23A1**
- `core.manifest` **1.2.94**
- `ui.i18n-settings` **1.3.6**
- `weather.display-menu` **0.4.5**
- Integration **0.25.0**

**C.K. – Eine Idee weiter gedacht.**
