# Gewitterradar V4.11.30 DEV

Stand: **2026-10-08**

## 3-Finger-Joe: Leaflet-Gestenhandler werden nach Mehrfinger-Gesten komplett neu aufgebaut

Der Realtest von V4.11.29 zeigte ein sehr charakteristisches Verhalten nach der HyperOS-Drei-Finger-Screenshot-Geste:

- restliche Gewitterradar-Oberfläche bleibt bedienbar
- Karte selbst bleibt gestört
- ein Finger auf der Karte zoomt weiterhin
- Leaflet-`+`/`-` reagieren nur auf jeden zweiten Touch
- Geo-Lokalisierungsbutton innerhalb des Kartencontainers zeigt dasselbe Verhalten
- Layer-Menü und verschiebbares Auge außerhalb der Leaflet-Bedienebene funktionieren normal

Damit ist der Fehler auf Leaflets eigene Touch-/Gestenebene eingegrenzt.

V4.11.30 setzt deshalb nicht mehr nur interne Flags zurück. Nach abgeschlossenen oder erkannten beschädigten Mehrfinger-Gesten werden die Leaflet-Handler **neu instanziiert**:

- `L.Map.TouchZoom`
- `L.Map.Drag`

Die alten Handler werden deaktiviert, in `map._handlers` ersetzt und gemäß Kartenkonfiguration neu aktiviert.

Damit erhält Leaflet nach einer Systemgesten-Unterbrechung tatsächlich neue Handlerobjekte statt eines nur teilweise bereinigten Altzustands.

## Saubere Mehrfinger-Geste wird ebenfalls rehydriert

Nach jeder vollständig abgeschlossenen Mehrfinger-Geste erfolgt nach dem Ereigniszyklus ein sauberer Rehydrate-Schritt.

Damit werden auch Fälle abgedeckt, in denen HyperOS das Ende noch liefert, Leaflet intern aber dennoch in einem fehlerhaften Zwischenzustand verbleibt.

Wenn der Abschluss verschluckt wurde, greift weiterhin der Recovery beim nächsten echten Kartenkontakt.

## Karten-Schaltflächen aus Recovery-Capture herausgenommen

Die folgenden Bedienelemente liegen geometrisch im Kartencontainer, sind aber **keine Kartenfläche**:

- Leaflet `+`
- Leaflet `-`
- Geo-Lokalisierungsbutton
- weitere Buttons/Links/Formelemente im Kartenbereich

Diese Elemente werden von den Pointer-/Touch-Recovery-Handlern jetzt explizit nicht mehr mitten im Tap zurückgesetzt.

Das adressiert insbesondere das beobachtete Muster:

> erster Touch funktioniert, zweiter nicht, dritter wieder, vierter nicht

Die globale Drei-Finger-Erkennung bleibt davon unabhängig aktiv.

## Schutzregeln unverändert

- kein globales `touchmove`
- kein Überschreiben von Leaflet-Tile-`transform`
- kein `transformOrigin` für WeatherRouter-Raster
- WeatherRouter-Routing unverändert
- Auto-Darstellung unverändert
- verschiebbares Augen-Symbol unverändert
- `ui.i18n-settings 1.3.6`
- idempotentes Modulregister aus V4.11.29 bleibt aktiv

## Stand

- Produkt **V4.11.30 DEV**
- Build **V4.11.30-DEV-2026-10-08**
- Runtime **41130r1**
- Modulsatz **E411-30A1**
- `core.manifest` **1.2.101**
- `core.registry` **1.0.2**
- `core.runtime` **1.0.2**
- `location.radii-map` **1.0.11**
- Integration **0.25.0**

**C.K. – Eine Idee weiter gedacht.**
