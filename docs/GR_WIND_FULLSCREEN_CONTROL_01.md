# GR-WIND-FULLSCREEN-CONTROL-01 – Kompakter Premium-Windschalter

## Ausgangspunkt
- Geschützte, vom Nutzer bestätigte Referenz: GR **4.11.152 DEV** / HA **0.25.59 DEV**, WR **0.10.297 DEV** / Loader **300**.
- Zuletzt veröffentlichtes GR-DEV-Release: **4.11.153 DEV** / HA **0.25.60 DEV**.
- Auftrag vom 07.11.2026: Wind-Schnellschalter wie bestehende Instrument-Buttons behandeln, nur in Vollbild, gleiche kompakte Form und Premiumrahmen, Winddarstellung unverändert.

## Implementierung
- `frontend/modules/weather/wind-display.js`: Windschalter 42×42 px mit dunklem Hintergrund und goldenem abgerundetem Rahmen; Originalgrafik in 32×32 px; weiterhin per vorhandener Drag-Logik verschiebbar.
- `_weatherWindSyncToggle` steuert die Sichtbarkeit ausschließlich bei `_mapDisplayMode==='fullscreen'` oder `_mapWindowMode`. Inaktive Standard-/Großansichten blenden das Element aus.
- `frontend/modules/fullscreen/map-display.js`: Die vorhandene zentrale `_syncMapDisplayUi` aktualisiert auch die Windschalter-Sichtbarkeit bei Moduswechseln.
- Kartenpositionierungsgrenzen und Kollisionsabstände an die kompakte 42×42-Fläche angepasst.
- Identische Änderungen in `frontend`, `custom_components/gewitterradar/frontend` und `dashboard/dist` übernommen.
- Die Premium-Originalbilddateien, globale Windsteuerung, gespeicherten Windeinstellungen sowie die Windanimation und WR bleiben unverändert.

**Implementierungscommit:** `5e802b4b38a5793b80c3ea3f89f05131d95a2af3`.

## Freigabestatus
Quellcode implementiert und GitHub-Dateien zurückgelesen: drei Kopien jedes betroffenen Moduls sind bytegleich (gleicher Git-Blob-SHA).

**Noch keine Installationsfreigabe:** Es wurden keine neue Versionsnummer, Paketfreigabe, öffentliche CI oder echte Android-/iPad-/VM109-Realabnahme nachgewiesen. Die vorherige installierbare Version 4.11.153 bleibt ein separater Release-Stand. Kein PROD-Eingriff, keine privaten Actions.
