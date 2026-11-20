# Gewitterradar V4.11.15 DEV

Stand: **2026-10-07**  
Zweig: `feature/v4.11-development`

## Schwerpunkt

Korrektur der schwebenden WeatherRouter-Darstellungssteuerung nach HA-Realtest von V4.11.14.

## Darstellungs- und Legenden-Schaltflächen

Im Realtest wurden die rechten Schaltflächen im schwebenden Darstellungsmenü abgeschnitten.

V4.11.15 ordnet die Schaltflächen innerhalb des Kartenmenüs deshalb in einem festen dreispaltigen Raster an:

- Präzise / Ausgewogen / Weich beginnen weiter links und nutzen die verfügbare Kartenbreite vollständig
- Auto / Ein / Aus verwenden dieselbe sichere Anordnung
- alle drei Schaltflächen bleiben innerhalb des Kartenrahmens
- Beschriftungen und Innenabstände sind leicht kompakter
- Einstellungen außerhalb des schwebenden Kartenmenüs bleiben unverändert

## Regression

Unverändert bleiben:

- Leaflet-Kachel-`transform`
- `transformOrigin`
- Touch-/Pointer- und Drag-Logik
- WeatherRouter-Routing
- Providerwahl
- Transparenzlogik
- Rasterdarstellung
- finale Augenassets

## Stand

- Produkt **V4.11.15 DEV**
- Build **V4.11.15-DEV-2026-10-07**
- Runtime **41115r1**
- Modulsatz **E411-15A1**
- `core.manifest` **1.2.86**
- `weather.display-menu` **0.3.2**
- Integration **0.25.0**

**C.K. – Eine Idee weiter gedacht.**
