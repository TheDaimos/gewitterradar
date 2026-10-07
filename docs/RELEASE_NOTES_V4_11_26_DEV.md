# Gewitterradar V4.11.26 DEV

Stand: **2026-10-07**

## Auto-Darstellung: gleicher Wolkeneffekt mehrere Zoomstufen früher

Der Realtest von V4.11.25 bestätigte, dass die gewünschte fließende, wolkenartige Darstellung im starken Nahzoom erreicht wird. V4.11.26 verschiebt genau diesen Effekt mehrere Zoomstufen nach vorne.

Neue Auto-Kennlinie:

- Entpixelung beginnt deutlich früher: `smoothstep(-1.80, 1.60, relativeZoom)`
- erste Glättung bereits unterhalb der nativen Rastergrenze
- stärkere Zunahme unmittelbar nach Beginn des Overzooms
- Glättungsziel wächst mit `8 + (overscale - 1) * 12`
- Maximalwert bleibt bei **220 px**
- Farbübergänge bleiben weich; der Kontrast wird im Nahbereich weiterhin reduziert

Ziel: Der in V4.11.25 erst sehr spät sichtbare Wolken-/Regenbogencharakter soll nun bereits mehrere Zoomstufen früher beginnen und sich anschließend weiter verstärken.

## Zoomstufe dauerhaft in der Kartenlegende

Die untere Kartenlegende zeigt jetzt zusätzlich die aktuelle Zoomstufe:

`Darstellung: Auto · Zoom 5`

Das gilt auch für die festen Darstellungsmodi. Damit können Realtests künftig exakt einer Zoomstufe zugeordnet werden.

Für Auto enthält der Legenden-Eintrag zusätzlich einen technischen Tooltip mit:

- aktueller Zoomstufe
- nativer Raster-Zoomgrenze
- Overzoom-Faktor
- aktueller Glättungsstärke

## Android / HyperOS: Drei-Finger-Screenshot-Geste weiter gehärtet

V4.11.25 konnte den Fehler weiterhin nicht vollständig verhindern. Der neue Stand berücksichtigt, dass die HyperOS-Systemgeste außerhalb der Kartenfläche beginnen kann und die Karte daher den dritten Finger nicht zwingend selbst sieht.

V4.11.26 ergänzt deshalb:

- globale, nur beobachtende Erkennung von Touch-/Pointer-Starts
- ab drei aktiven Touchkontakten wird ein gezielter Gesten-Reset vorgemerkt
- die Screenshot-Geste wird nicht blockiert
- kein globales `touchmove`
- mehrstufige Bereinigung direkt nach Erkennung sowie nach kurzer Settling-Phase
- vor dem ersten neuen Kartenfinger nach der Systemgeste erfolgt nochmals ein sauberer Reset
- noch offene verzögerte Reset-Timer werden dabei gelöscht, damit sie nicht in eine neue Bediengeste hineinlaufen

## Schutzregeln unverändert

- kein Überschreiben von Leaflet-Tile-`transform`
- kein `transformOrigin` für WR-Raster
- kein globales `touchmove`
- kein WeatherRouter-Routing in Gewitterradar
- keine Providerwahl in Gewitterradar

## Stand

- Produkt **V4.11.26 DEV**
- Build **V4.11.26-DEV-2026-10-07**
- Runtime **41126r1**
- Modulsatz **E411-26A1**
- `core.manifest` **1.2.97**
- `location.radii-map` **1.0.8**
- `weather.display-menu` **0.4.8**
- Integration **0.25.0**

**C.K. – Eine Idee weiter gedacht.**
