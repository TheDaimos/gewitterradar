Bootstrap: Daimos

Projekt: Gewitterradar

Repository:
TheDaimos/gewitterradar

Entwicklungszweig:
feature/v4.11-development

DRA-Zweig:
deploy/dev

Wir setzen die Arbeit exakt bei der mobilen Kartendiagnose und dem reproduzierbaren HyperOS/Android-Fehler **„3-Finger-Joe“** fort.

Lies ZUERST vollständig:

1. docs/HANDOFF_GEWITTERRADAR_MAP_DIAGNOSTICS_V4_11_33_2026-10-08.md
2. docs/RELEASE_NOTES_V4_11_33_DEV.md
3. docs/RELEASE_NOTES_V4_11_32_DEV.md
4. docs/RELEASE_NOTES_V4_11_31_DEV.md
5. docs/RELEASE_NOTES_V4_11_30_DEV.md
6. docs/RELEASE_NOTES_V4_11_29_DEV.md

WICHTIG:
Prüfe vor jedem Schreibzugriff den aktuellen HEAD von
- feature/v4.11-development
- deploy/dev

Der bei Übergabe aktuelle, synchronisierte Stand ist:

ad20034b69b6650f351e898d5e40cb4ebb204653

Aktuelle technische Identität:

- V4.11.33 DEV
- Build V4.11.33-DEV-2026-10-08
- Runtime 41133r1
- Modulsatz E411-33A1
- 31 Module
- diagnostics.map 1.0.1
- location.radii-map 1.0.13
- ui.i18n-settings 1.3.6
- weather.display-menu 0.4.9
- Integration 0.25.0

AKTUELLER TESTFOKUS:

Die neue mobile Kartendiagnose ist fertig und enthält Voll/Kompakt/Minimiert, einen 800-Ereignis-Ringpuffer sowie JSON-Kopieren und JSON-Download.

V4.11.32 hatte einen UX-Fehler: Nach Minimieren gab es keinen Wiederherstellen-Knopf.

Das ist in V4.11.33 bereits korrigiert:
- − minimiert
- im minimierten Zustand wird daraus +
- + stellt die letzte Voll-/Kompaktansicht wieder her
- Aufnahme läuft minimiert weiter

V4.11.33 wurde vom Nutzer noch NICHT real getestet.

NÄCHSTER SCHRITT:

Lass den Nutzer V4.11.33 installieren und führe danach exakt diesen Mobile-Test durch:

1. Kartendiagnose öffnen.
2. JSON VORHER exportieren.
3. Diagnose minimieren.
4. Drei-Finger-Wischgeste für HyperOS-Screenshot ausführen.
5. Karte danach testen:
   - Ein-Finger-Pan
   - Zwei-Finger-Pinch
   - kontrollierte Bereiche mit zwei Fingern
   - Auge verschieben
   - Leaflet + / -
   - Geo-Lokalisierung
6. Kartendiagnose mit + wiederherstellen.
7. JSON NACHHER exportieren.
8. Beide JSON-Dateien analysieren.

WICHTIG:
Keine weitere 3-Finger-Joe-Änderung auf Verdacht, bevor die VORHER-/NACHHER-Diagnose ausgewertet wurde.

Besonders analysieren:
- Pointer-/Touch-Sequenz
- visibility / blur / focus
- erster Touch nach Screenshot
- multitouchDirty
- Quarantäne
- TouchZoom enabled / _zooming
- Dragging enabled / _moving
- _animatingZoom
- Hard-Reset
- Handler-Rebuild
- vorhandener oder fehlender dragstart

Schutzregeln:
- niemals Leaflet-Tile-transform überschreiben
- kein transformOrigin für WeatherRouter-Raster
- kein globales touchmove
- WeatherRouter-Routing nicht in Gewitterradar nachbauen
- keine Providerwahl in Gewitterradar
- finale Augenassets nicht verändern
- CI nur als grün bezeichnen, wenn tatsächlich geprüft

Weitere relevante aktuelle Funktion:
Die Auto-Niederschlagsdarstellung wurde bereits so verschoben, dass der frühere Effekt von Zoom 11 ungefähr bei Zoom 9 erreicht wird. Die Kartenlegende zeigt Darstellung + Zoomstufe. Das Augen-Symbol ist frei verschiebbar.

Setze exakt an diesem Stand fort.
