# Gewitterradar V4.11.28 DEV

Stand: **2026-10-08**

## Hotfix: Hilfe & Hinweise / ui.i18n-settings

Der Realtest von V4.11.27 zeigte im Diagnosecockpit:

- geladen: `ui.i18n-settings 1.3.3`
- erwartet: `ui.i18n-settings 1.3.6`
- Status: `abweichend`

Zusätzlich reagierte die Schaltfläche **„Hilfe & Hinweise“** nicht mehr.

Ursache war ein echter Runtime-Drift:

- die Datei `modules/ui/i18n-settings.js` trug noch die Modulversion **1.3.3**
- Manifest und Runtime erwarteten bereits **1.3.6**
- der Bootstrap importierte das Modul weiterhin mit dem alten Cache-Buster **41123r1**

V4.11.28 korrigiert deshalb:

- `ui.i18n-settings` tatsächlich auf **1.3.6**
- Runtime-Import des Moduls auf **41128r1**
- Bootstrap-Import auf **41128r1**
- alle drei Frontend-Spiegel synchronisiert
- DRA-Buildkennung auf **4.11.28**
- Frontend-Prüfsummen aktualisiert

Die vorhandene Bindung von `settings-help` an `_openHelp()` sowie die Help-Dialog-Implementierung selbst sind im Code vorhanden. Der Hotfix erzwingt nun, dass genau der erwartete aktuelle Modulstand geladen wird.

## Unverändert

- Auto-Darstellung / Zoomkennlinie aus V4.11.27
- verschiebbares Augen-Symbol
- Gesten-Recovery / 3-Finger-Joe
- WeatherRouter-Routing
- Leaflet-Tile-`transform`
- `transformOrigin`
- Touch-/Pan-/Pinch-Zoom-Logik

## Stand

- Produkt **V4.11.28 DEV**
- Build **V4.11.28-DEV-2026-10-08**
- Runtime **41128r1**
- Modulsatz **E411-28A1**
- `core.manifest` **1.2.99**
- `ui.i18n-settings` **1.3.6**
- Integration **0.25.0**

**C.K. – Eine Idee weiter gedacht.**
