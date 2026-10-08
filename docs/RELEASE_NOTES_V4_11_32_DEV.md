# Gewitterradar V4.11.32 DEV

Stand: **2026-10-08**

## Neue mobile Kartendiagnose

Für die reproduzierbare HyperOS-/Android-Drei-Finger-Screenshot-Störung wurde eine eigene Kartendiagnose als separates Diagnosemodul ergänzt.

Neuer Menüpunkt:

**Kalibrierung & Diagnose → Kartendiagnose**

Die Diagnose ist ausdrücklich für Mobile ausgelegt und kann während eines Realtests geöffnet bleiben.

### Fensterzustände

Die Kartendiagnose unterstützt drei Darstellungen:

- **Voll** – Live-Zustände, Detailwerte, Ereignislog und Export
- **Kompakt** – reduzierte Live-Werte bei deutlich kleinerer Fläche
- **Minimiert** – schmale Statusleiste, damit die Karte möglichst frei bedient werden kann

Die Ereignisaufzeichnung läuft auch im minimierten Zustand weiter.

### Live-Zustände

Unter anderem werden angezeigt bzw. exportiert:

- aktuelle Karten-Zoomstufe
- Leaflet `Dragging` aktiv/inaktiv
- Leaflet `TouchZoom` aktiv/inaktiv
- `touchZoom._zooming`
- `map._animatingZoom`
- aktive Pointer
- aktive Touch-IDs
- globale Pointer
- `multitouchDirty`
- aktive Touch-Quarantäne inklusive Restzeit
- letzter Recovery-Grund
- letzte erkannte Anomalie
- aktuelle Leaflet-Handlerliste und Handleranzahl
- Kartenmittelpunkt, Min-/Max-Zoom
- CSS-/Touch-Zustand des Kartencontainers
- Sichtbarkeit/Fokus
- Viewport und VisualViewport
- Device Pixel Ratio
- `navigator.maxTouchPoints`
- Browser-/Plattforminformationen

### Ereignisprotokoll

Die Diagnose führt einen Ringpuffer mit bis zu **800 Ereignissen**.

Erfasst werden insbesondere:

- Pointer Down / Up / Cancel
- Touch Start / End / Cancel
- globale Pointer- und Touchstarts
- Leaflet Drag Start / End
- Move Start / End
- Zoom Start / Zoom / Zoom End
- Lebenszyklus: Focus / Blur / Visibility
- Gesten-Recovery Start / Ende
- Hard-Reset Start / Ende
- Neuaufbau der Leaflet-Gestenhandler
- Quarantäne Start / Ende
- geplante Systemgesten-Recoveries
- manuelle Markierungen

Jeder Eintrag enthält, soweit verfügbar:

- Zeitstempel
- Sequenznummer
- Pointer-ID
- Pointer-Typ
- `isPrimary`
- Touchanzahl
- Ziel-Element
- aktuelle Karten-/Leaflet-Zustände
- aktuelle Recovery-Zustände

## Export

Die Kartendiagnose unterstützt:

- **JSON kopieren**
- **JSON herunterladen**

Der Export enthält sowohl einen vollständigen Snapshot des aktuellen Karten-/Leaflet-/Recovery-Zustands als auch den Ereignisringpuffer.

Damit ist folgender Vergleich möglich:

1. Kartendiagnose öffnen
2. Export **vor** dem Drei-Finger-Screenshot erzeugen
3. Diagnose minimieren
4. HyperOS-Drei-Finger-Screenshot ausführen
5. Karte anschließend testen
6. Diagnose wieder öffnen
7. Export **nach** dem Screenshot erzeugen

Die beiden JSON-Dateien können anschließend direkt gegeneinander ausgewertet werden.

## V4.11.31-Hotfix enthalten

V4.11.32 enthält zusätzlich den noch nicht separat ausgerollten V4.11.31-Fix für eine dauerhaft hängenbleibende Touch-Quarantäne.

Die Quarantäne:

- ist jetzt zeitlich begrenzt
- hat einen eigenen Ablauf-Timer
- wird zusätzlich bei `pointerup` freigegeben
- kann die Kartenfläche nicht mehr unbegrenzt blockieren
- bereinigt anschließend Pointer-/Touch-Zustände und rehydriert die Leaflet-Gestenhandler

## Instrumentierung des Karten-Gesten-Recovery

`location.radii-map` wurde für die neue Diagnose instrumentiert.

Protokolliert werden jetzt unter anderem:

- Beginn und Ende eines Hard-Resets
- Beginn und Ende eines Recoveries
- Neuinstanziierung von `L.Map.TouchZoom`
- Neuinstanziierung von `L.Map.Drag`
- Aktivierung/Deaktivierung der Touch-Quarantäne
- rohe Touch-/Pointer-Ereignisse
- Fokus-/Sichtbarkeitswechsel

Die Diagnose ist beobachtend ausgelegt und ergänzt weiterhin **kein globales `touchmove`**.

## Neue Modulstände

- `diagnostics.map` **1.0.0**
- `ui.controls` **1.1.6**
- `location.radii-map` **1.0.13**
- `core.manifest` **1.2.103**

## Stand

- Produkt **V4.11.32 DEV**
- Build **V4.11.32-DEV-2026-10-08**
- Runtime **41132r1**
- Modulsatz **E411-32A1**
- Module **31**
- Integration **0.25.0**

**C.K. – Eine Idee weiter gedacht.**
