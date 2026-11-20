# Übergabe – Gewitterradar V4.11.33 DEV – Kartendiagnose / 3-Finger-Joe

Stand: **2026-10-08**

## Projekt

- Repository: `TheDaimos/gewitterradar`
- Entwicklungszweig: `feature/v4.11-development`
- DRA-Zweig: `deploy/dev`
- Aktueller HEAD Entwicklungszweig: `ad20034b69b6650f351e898d5e40cb4ebb204653`
- Aktueller HEAD `deploy/dev`: `ad20034b69b6650f351e898d5e40cb4ebb204653`
- Produkt: **V4.11.33 DEV**
- Build: **V4.11.33-DEV-2026-10-08**
- Runtime: **41133r1**
- Modulsatz: **E411-33A1**
- Integration: **0.25.0**
- Module: **31**

## Wichtige Schutzregeln

Diese Regeln dürfen bei der Fortsetzung nicht verletzt werden:

- niemals Leaflet-Tile-`transform` überschreiben
- kein `transformOrigin` für WeatherRouter-Raster setzen
- kein globales `touchmove` ergänzen
- den bestehenden Gestenschutz in `location.radii-map` nicht pauschal entfernen
- WeatherRouter-Routing nicht in Gewitterradar nachbauen oder maskieren
- keine Providerwahl in Gewitterradar einbauen
- finale Augenassets unverändert lassen
- CI nur dann als grün bezeichnen, wenn ein tatsächlicher Lauf geprüft wurde

## 1. Auto-Darstellung / Entpixelung

Die gewünschte Auto-Darstellung ist grundsätzlich erreicht:

- im Nahzoom fließende, wolkenartige Niederschlagsflächen
- keine dominant sichtbaren Pixelblöcke
- Farben Grün → Gelb → Orange → Rot gehen weicher ineinander über
- Außenkanten werden stark geglättet
- Hotspots sollen dennoch erkennbar bleiben

Wichtige Feinabstimmung aus dem Realtest:

> Der visuelle Effekt, der vorher bei Zoom 11 erreicht wurde, soll bereits bei Zoom 9 sichtbar sein.

Das wurde in **V4.11.27** durch eine geschlossene Verschiebung der Auto-Kennlinie um zwei Zoomstufen umgesetzt:

`relativeZoom = safeZoom - nativeZoom + 2`

Dadurch bleibt der Übergang davor weich und proportional.

Die untere Kartenlegende zeigt:

`Darstellung: Auto · Zoom X`

Damit kann die Auto-Kennlinie künftig exakt anhand der Zoomstufe weiter abgestimmt werden.

## 2. Verschiebbares Augen-Symbol

Das schwebende Augen-Symbol der WeatherRouter-Darstellung ist frei verschiebbar.

Eigenschaften:

- eigene gespeicherte Kartenposition
- Mobile-Drag
- Begrenzung auf sichtbaren Kartenbereich
- Drag löst nicht versehentlich das Öffnen/Schließen aus
- Positionsreset setzt Panel und Auge zurück

## 3. 3-Finger-Joe – reproduzierbarer Fehler

Der Fehler ist inzwischen zuverlässig reproduzierbar:

**Auslöser:**
HyperOS-/Android-Drei-Finger-Wischgeste für einen Screenshot.

### Historisches Fehlerbild

Nach der Screenshot-Geste funktionierte der Rest der Gewitterradar-Oberfläche normal, aber die Leaflet-Karte war gestört.

Beobachtet wurden nacheinander:

1. Ein Finger auf der Karte löste fälschlich Zoom aus.
2. Leaflet `+` / `-` und Geo-Lokalisierung reagierten nur auf jeden zweiten Touch.
3. Nach V4.11.30 funktionierten diese Kartenbuttons wieder normal und der 1-Finger-Geisterzoom war weg.
4. Danach war aber die eigentliche Kartenfläche via Touch komplett blockiert:
   - kein Ein-Finger-Pan
   - kein Zwei-Finger-Pinch
   - kontrollierte Bereiche mit zwei Fingern nicht bedienbar
   - Buttons innerhalb und außerhalb der Karte funktionierten

### Technische Eingrenzung

Das Problem sitzt sehr wahrscheinlich in der Leaflet-/Touch-Ebene der Kartenfläche und nicht in der gesamten App.

Wichtige Beobachtung:

- Layer-Menü: funktioniert
- Auge: funktioniert
- Klein/Groß/Vollbild: funktioniert
- Medaillon: funktioniert
- Leaflet `+` / `-`: nach V4.11.30 wieder normal
- Geo-Button: nach V4.11.30 wieder normal
- Kartenfläche selbst: zuletzt blockiert

## 4. Bisherige 3-Finger-Recovery-Maßnahmen

### V4.11.25–V4.11.27

- Drei-Finger-/Mehrfinger-Erkennung
- Recovery bei verschluckten Pointer-/Touch-Abschlüssen
- Reset von Leaflet-TouchZoom-/Drag-Zuständen
- Recovery bei `isPrimary`-Anomalien
- Bereinigung von `_animatingZoom`

### V4.11.29

- offene Mehrfinger-Sitzung wird mit `multitouchDirty` markiert
- erste nachweislich korrupte Touch-Sequenz kann quarantänisiert werden
- identische Modul-Doppelregistrierungen werden idempotent behandelt
- `core.registry` und `core.runtime` auf **1.0.2**

### V4.11.30

Leaflet-Gestenhandler werden nach verdächtigen/abgeschlossenen Mehrfinger-Gesten vollständig neu erzeugt:

- `L.Map.TouchZoom`
- `L.Map.Drag`

Die alten Handler werden deaktiviert und in `map._handlers` ersetzt.

Außerdem werden Leaflet-Control-Elemente wie `+`, `-`, Geo-Button etc. vom Karten-Recovery-Capture ausgenommen.

### V4.11.31 – in V4.11.32+ enthalten

Es wurde erkannt, dass `quarantineTouchSequence` dauerhaft `true` bleiben konnte, wenn HyperOS kein `touchend` mehr lieferte.

Daher jetzt:

- Quarantäne zeitlich begrenzt
- `quarantineUntil`
- eigener `quarantineTimer`
- Freigabe zusätzlich bei `pointerup`
- harte Ablaufzeit
- Kartenfläche darf nicht unbegrenzt gesperrt bleiben

**Dieser Fix wurde noch nicht separat real abgenommen.**

## 5. Eigene Kartendiagnose

Mit **V4.11.32** wurde ein eigenes Modul eingeführt:

- Modul: `diagnostics.map`
- V4.11.33: **1.0.1**
- Datei: `modules/diagnostics/map-diagnostics.js`

Menü:

**Kalibrierung & Diagnose → Kartendiagnose**

### Ziel

Vor und nach der HyperOS-Drei-Finger-Screenshot-Geste belastbare Zustände und Ereignisse vergleichen.

### Mobile Darstellung

Drei Modi:

- **Voll**
- **Kompakt**
- **Minimiert**

Die Aufzeichnung läuft auch minimiert weiter.

### Diagnoseinhalte

Unter anderem:

- aktuelle Zoomstufe
- Leaflet `Dragging` an/aus
- Leaflet `TouchZoom` an/aus
- `touchZoom._zooming`
- `map._animatingZoom`
- aktive Pointer
- aktive Touch-IDs
- globale Pointer
- `multitouchDirty`
- Quarantäne + Restzeit
- letzter Recovery-Grund
- letzte Anomalie
- Handlerliste / Handleranzahl
- Kartenmittelpunkt
- Min-/Max-Zoom
- Kartencontainer Touch/CSS-Status
- Fokus / Sichtbarkeit
- Viewport / VisualViewport
- Device Pixel Ratio
- `navigator.maxTouchPoints`
- Browser-/Plattforminformationen

### Ereignislog

Ringpuffer mit bis zu **800 Ereignissen**.

Erfasst werden u. a.:

- Pointer Down / Up / Cancel
- Touch Start / End / Cancel
- globale Pointer-/Touchstarts
- Leaflet Drag Start / End
- Move Start / End
- Zoom Start / Zoom / Zoom End
- Fokus / Blur / Visibility
- Recovery Begin / End
- Hard Reset Begin / End
- Handler-Rebuild
- Quarantäne Arm / Clear
- Systemgesten-Recovery
- manuelle Marker

### Export

- **JSON kopieren**
- **JSON herunterladen**

Empfohlener Test:

1. Kartendiagnose öffnen.
2. JSON **vor** dem Screenshot exportieren.
3. Diagnose minimieren.
4. Drei-Finger-Screenshot-Geste ausführen.
5. Karte unmittelbar testen.
6. Diagnose wiederherstellen.
7. JSON **nach** dem Screenshot exportieren.
8. Beide JSON-Dateien vergleichen.

## 6. V4.11.33 – Minimieren/Wiederherstellen Hotfix

In V4.11.32 konnte die Kartendiagnose minimiert werden, aber danach fehlte der Weg zurück.

Das ist im aktuellen Repo bereits als **V4.11.33 DEV** korrigiert:

- normal/kompakt: `−` minimiert
- minimiert: derselbe Knopf wird zu `+`
- `+` stellt das Fenster wieder her
- letzte Ansicht **Voll** oder **Kompakt** wird gespeichert
- Aufzeichnung läuft während des Minimierens weiter

Release Notes:

`docs/RELEASE_NOTES_V4_11_33_DEV.md`

**Wichtig: V4.11.33 wurde vom Nutzer noch nicht real getestet.**

## 7. Modul-/Versionsdrift behoben

Früherer Fehler:

- `ui.i18n-settings` geladen 1.3.3
- Manifest erwartete 1.3.6
- „Hilfe & Hinweise“ funktionierte nicht

Behoben in V4.11.28:

- `ui.i18n-settings 1.3.6`
- aktueller Cache-Buster
- drei Frontend-Spiegel synchron

Danach gab es doppelte Registrierungen von `core.registry` und `core.runtime`, verursacht durch unterschiedliche `?v=`-Import-URLs.

Behoben in V4.11.29:

- idempotente Registrierung identischer Module
- echte Versions-/Dateikonflikte bleiben sichtbar

## 8. Aktueller nächster Arbeitsschritt

**Keine weitere 3-Finger-Joe-Änderung auf Verdacht vornehmen.**

Zuerst V4.11.33 auf Mobile real testen und die neue Kartendiagnose verwenden.

Benötigt werden zwei Exporte:

- **VORHER**: Karte funktioniert normal, noch kein Screenshot
- **NACHHER**: unmittelbar nach Drei-Finger-Screenshot und anschließendem Versuch, die Karte zu bedienen

Zusätzlich kurz notieren:

- funktioniert Ein-Finger-Pan?
- funktioniert Zwei-Finger-Pinch?
- funktionieren kontrollierte Bereiche mit zwei Fingern?
- funktioniert Auge verschieben?
- funktionieren Leaflet `+` / `-`?
- funktioniert Geo-Lokalisierung?
- zeigt Kartendiagnose `TouchZoom AN`?
- zeigt `_zooming JA`?
- zeigt `Dragging AN`?
- zeigt `multitouchDirty JA`?
- ist Quarantäne aktiv?
- welcher letzte Recovery-Grund wird angezeigt?

Danach die beiden JSON-Dateien **ereignisweise vergleichen**, insbesondere die Sequenz um:

- letzten Mehrfingerkontakt vor Screenshot
- `visibility` / `blur`
- Rückkehr in die App
- ersten Touch nach Screenshot
- ersten Recovery
- Handler-Rebuild
- Quarantäne
- ersten `dragstart` oder fehlenden `dragstart`

## 9. Aktuelle technische Identität

- Produkt: **V4.11.33 DEV**
- Build: **V4.11.33-DEV-2026-10-08**
- Runtime: **41133r1**
- Modulsatz: **E411-33A1**
- `core.manifest`: **1.2.104**
- `core.registry`: **1.0.2**
- `core.runtime`: **1.0.2**
- `diagnostics.map`: **1.0.1**
- `location.radii-map`: **1.0.13**
- `ui.i18n-settings`: **1.3.6**
- `weather.display-menu`: **0.4.9**
- Integration: **0.25.0**
- Module: **31**

## 10. Repo-Disziplin

Vor jedem weiteren Schreibzugriff:

1. aktuellen HEAD von `feature/v4.11-development` prüfen
2. aktuellen HEAD von `deploy/dev` prüfen
3. parallele Änderungen niemals überschreiben
4. DRA nur synchronisieren, wenn ein vollständiger DEV-Kandidat fertig ist
5. `main` und V4.10 FINAL nicht verändern

**C.K. – Eine Idee weiter gedacht.**
