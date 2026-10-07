# Gewitterradar V4.11.13 DEV

Stand: **2026-10-07**  
Zweig: `feature/v4.11-development`

## Schwerpunkt

Deutlich unterscheidbare Niederschlagsdarstellung und generische Transparenzsteuerung für WeatherRouter-Flächenlayer.

## Darstellungsprofile

### Präzise
Unveränderte Rasterdarstellung ohne Glättung.

### Ausgewogen
Moderate flächige Glättung auf der gesamten Niederschlagsebene. Harte Zellgrenzen werden sichtbar reduziert, die Datenstruktur bleibt aber noch erkennbar.

### Weich
Deutlich stärkere flächige Glättung mit weich auslaufenden Außenkanten und fließenderen Farbübergängen. Die Wirkung wird bei Leaflet-Übervergrößerung oberhalb der nativen Raster-Zoomstufe automatisch verstärkt.

Die Filter liegen auf der WeatherRouter-Pane und nicht auf den einzelnen Kachel-Transforms. Leaflets Geometrie bleibt unangetastet.

## Transparenz

Neu in den Einstellungen:

**Niederschlag · Transparenz**

- Bereich 0–100 %
- 0 % = deckend
- 100 % = unsichtbar
- Änderung wirkt live ohne WeatherRouter-Neuanfrage
- Schaltfläche **WR** stellt die vom Provider gelieferte Standarddeckkraft wieder her
- der benutzerdefinierte Wert wird persistent gespeichert

Die Zustandsarchitektur ist familienbezogen und für Wolken, Satellit, Schnee und weitere WeatherRouter-Flächenlayer vorbereitet.

## Schutzregeln

- keine Änderung an Messwerten
- keine Änderung an Rasterauflösung
- kein Eingriff in WeatherRouter-Routing
- keine neuen Anfragen beim Transparenzregeln
- kein `node.style.transform`
- kein `transform-origin` auf Leaflet-Kacheln
- Menü-/Raster-Entkopplung aus V4.11.12 bleibt erhalten

## Stand

- `weather.display-menu` 0.3.0
- `weather.precipitation-layer` 1.3.4
- `core.manifest` 1.2.84
- Runtime **41113r1**
- Modulsatz **E411-13A1**
- Produkt **V4.11.13 DEV**

## Realabnahme

Zu prüfen:

- Präzise / Ausgewogen / Weich müssen auf den ersten Blick unterscheidbar sein
- Weich muss sichtbar flächiger auslaufen
- Transparenz 0 / 25 / 50 / 75 / 100 %
- WR-Standard wiederherstellen
- keine neue Layer-Ladeanimation beim Transparenzregeln
- OpenStreetMap / Meteo / Earth unter dem Niederschlag sichtbar machen
- Android Pan / Pinch-Zoom nach Stil- und Transparenzänderungen

**C.K. – Eine Idee weiter gedacht.**
