# Gewitterradar V4.11.10 DEV

Stand: **2026-10-06**  
Zweig: `feature/v4.11-development`

## Schwerpunkt

WeatherRouter-Darstellungslegenden als eigenständige, erweiterbare Kartenfunktion.

## Neu

- neues Modul `weather.legend-overlay` 0.1.0
- generisches Legendenmodell für mehrere WeatherRouter-Datenfamilien
- persistenter Legendenmodus im gemeinsamen Darstellungszustand:
  - Auto
  - Ein
  - Aus
- Legendensteuerung in Einstellungen und schwebendem Darstellungsmenü
- direkte Ausblend-Schaltfläche am Legendenoverlay
- dunkles responsives Kartenoverlay mit Goldrahmen und dezenter Aura
- Position automatisch oberhalb der bestehenden Gewitterradar-Kartenlegende
- automatische Anpassung an Karten-/Viewport-Größe
- `ResizeObserver` + Fenster-/Visual-Viewport-Anpassung, ohne globale Touch-Gesten
- Niederschlagsrenderer auf das generische Legendenmodell umgestellt
- vorhandene WeatherRouter-`payload.legend` wird verwendet
- `resource.semantics.unit` wird bei vorhandener Einheit angezeigt
- strukturierte `legend.entries` / `legend.stops` werden unterstützt
- Zeitachse berücksichtigt die sichtbare WR-Legendenhöhe
- vorhandene Blitz-/Radius-Legende bleibt unverändert

## Sicherheits- und Architekturregeln

- keine frei erfundenen Wetter-Skalen
- keine Providerwahl im Gewitterradar
- Legende ausblenden verändert keinen Wetterlayer
- keine Änderung an Messwerten, Rasterauflösung, Routing oder Warnstatus
- keine globalen `touchmove`-Listener
- keine zusätzliche Drag-Geste für die Legende
- Android-/Leaflet-Gestenwache bleibt unangetastet

## Modulstände

- `core.manifest` 1.2.81
- `core.card-lifecycle` 1.0.6
- `weather.consumer-client` 1.2.1
- `weather.precipitation-layer` 1.3.3
- `weather.layer-menu` 1.1.4
- `weather.display-menu` 0.2.0
- `weather.legend-overlay` 0.1.0

Runtime: **41110r1**  
Modulsatz: **E411-10A1**

## Noch offen

- finale Entwurf-Nr.-4-Augen-PNGs einspielen und dokumentierte SHA-256-Werte prüfen
- Realabnahme Android / iPad / Desktop
- optische Abnahme der drei Niederschlagsstile
- optische Abnahme des neuen Legendenoverlays mit echten WeatherRouter-Legenden

**C.K. – Eine Idee weiter gedacht.**
