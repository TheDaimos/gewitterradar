# Gewitterradar V4.11.11 DEV

Stand: **2026-10-07**  
Zweig: `feature/v4.11-development`

## Schwerpunkt

Finale WeatherRouter-Augenassets für die WR-Visualisierung.

## Neu / abgeschlossen

- die temporären SVG-Augen wurden vollständig entfernt
- freigegebene Entwurf-Nr.-4-Augen eingebaut
- offenes Auge = Darstellungsmenü aktiv
- geschlossenes Auge = Darstellungsmenü inaktiv
- 136×136-4×-PNG-Ableitungen direkt und offlinefähig im Modul eingebettet
- Laufzeit-SHA-256:
  - offen: `78ff501e77c7969ec69ec96e9149913692d4d53c4b800cf131090af32f582066`
  - geschlossen: `e92e2920cfe449c72b334989528b176c89c00dd2cbeb0354a60a7d05fcc21047`
- kanonische 1254×1254-Master bleiben geschützt im Artwork-Bereich erhalten
- Build-/Verifikationsverträge prüfen nun explizit die finalen Assetidentitäten und verbieten den alten Platzhaltermarker
- gemeinsamer Runtime-Cache für den V4.11.11-DRA-Test auf `41111r1` angehoben

## Unverändert geschützt

- Android-/Leaflet-Gestenwache
- Pointer-Drag des Darstellungsmenüs
- WeatherRouter Consumer V1
- Niederschlagsdaten und Routing
- generische Darstellungslegende
- Blitz-/Radius-Legende
- `main` / V4.10 FINAL

## Modulstände

- `core.manifest` 1.2.82
- `weather.display-menu` 0.2.1
- `weather.legend-overlay` 0.1.0
- `weather.precipitation-layer` 1.3.3
- `weather.layer-menu` 1.1.4
- `weather.consumer-client` 1.2.1

Runtime: **41111r1**  
Modulsatz: **E411-11A1**

## Noch offen für Realabnahme

- Desktop: Auge offen/geschlossen, Menü, Legende und drei Niederschlagsstile
- Android: zusätzlich Pan/Pinch/Zoom nach Menü- und Augenbedienung
- iPad: Layout, Menüposition und Legendenüberlagerung

**C.K. – Eine Idee weiter gedacht.**
