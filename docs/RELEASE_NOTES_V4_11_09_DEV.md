# Gewitterradar V4.11.09 DEV

Stand: **2026-10-06**  
Zweig: `feature/v4.11-development`

## Schwerpunkt

Erste umgesetzte Stufe der in `docs/WR-Vison.md` festgelegten WeatherRouter-Visualisierung.

## Neu

- eigenes Modul `weather.display-menu` 0.1.2
- persistenter gemeinsamer Darstellungszustand für Einstellungen, Kartenmenü und Schnellzugriff
- Unterscheidung WeatherRouter „nicht installiert“ und Discovery/Verbindung derzeit nicht erreichbar
- Einstellungen mit Offline-Teaser und Status
- eigenes Augen-Bedienelement auf der Karte
- temporäre, eindeutig markierte Inline-SVG-Augenplatzhalter bis die freigegebenen Entwurf-Nr.-4-PNGs im Repository liegen
- schwebendes Darstellungsmenü
- minimierter und aufgeklappter Zustand
- Pointer-Drag ausschließlich über die Griffzone
- Drag-Lebenszyklus räumt jetzt auch bei verlorenem Pointer-Capture, App-Fokusverlust, `pagehide` und Sichtbarkeitswechsel zuverlässig auf
- inkompatibler WeatherRouter-Consumer-Vertrag wird getrennt von „derzeit nicht bereit/offline“ dargestellt
- normierte Positionsspeicherung mit Begrenzung auf den sichtbaren Kartenbereich
- Schnellzugriff über WeatherRouter-Hub → Darstellung
- erster echter Darstellungsrenderer: Niederschlag
  - Präzise
  - Ausgewogen
  - Weich
- Darstellungsstile verändern ausschließlich die gerenderten Rasterbilder; WeatherRouter-Daten, Rasterauflösung, Routing und Warnstatus bleiben unverändert

## Schutzpunkte

- keine zweite WeatherRouter-Erkennung
- keine Providerwahl in Gewitterradar
- keine globalen `touchmove`-Listener
- bestehende Android-/Leaflet-Gesten-Selbstheilung bleibt unangetastet
- keine Änderungen an `main`
- `deploy/dev` wird erst nach vollständiger Source-/Build-Parität und Prüfungen synchronisiert

## Noch offen

- finale Augen-PNGs einspielen und SHA-256 gegen `docs/WR-Vison.md` prüfen
- Desktop-/Android-/iPad-Realabnahme
- optische Abnahme der drei Niederschlagsstile
- weitere Darstellungsfamilien erst danach

**C.K. – Eine Idee weiter gedacht.**
