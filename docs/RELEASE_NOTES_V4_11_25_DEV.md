# Gewitterradar V4.11.25 DEV

Stand: **2026-10-07**

## Auto-Darstellung: Entpixelung beginnt früher

Der Realtest von V4.11.24 bestätigte die richtige Richtung, zeigte aber, dass die Glättung noch zu spät einsetzt.

V4.11.25 verschiebt den Beginn der Auto-Entpixelung nach vorne und steigert sie anschließend stärker:

- erste Rundung der Rasterzellen bereits kurz vor dem eigentlichen Overzoom
- deutlich stärkere Glättung ab den ersten vergrößerten Zoomstufen
- starke Nahvergrößerung löst die ursprünglichen Pixel zunehmend vollständig auf
- Farbübergänge Grün → Gelb → Orange → Rot werden kontinuierlicher
- Außenränder werden früher weich ausgetragen
- maximaler Nahzoom-Blur steigt bis **220 px**

Technisch wird die Glättung jetzt über die relative Zoomlage zur nativen Wetterauflösung gesteuert:

- `relativeZoom = mapZoom - maxNativeZoom`
- Entpixelungsphase beginnt bei etwa **-0,65**
- volle Komfortdarstellung wird ab etwa **+3,2 Zoomstufen** erreicht
- Glättungsziel wächst mit der tatsächlichen Übervergrößerung

## Android/HyperOS: Drei-Finger-Screenshot-Geste

Der lange beobachtete „Geisterfinger“ konnte auf die System-Screenshot-Geste eingegrenzt werden:

- Screenshot wird auf Android/HyperOS mit drei Fingern ausgelöst
- die Webansicht kann dabei Touch-/Pointer-Ereignisse verlieren
- Leaflet kann dadurch intern in einem unvollständig beendeten Pinch-Zustand verbleiben
- anschließend kann sich ein einzelner Finger wie ein verbliebener zweiter Finger verhalten

V4.11.25 ergänzt deshalb einen gezielten Systemgesten-Schutz:

- sobald ein dritter Touchkontakt auf der Kartenfläche erkannt wird, wird die Android-Systemgeste **nicht blockiert**
- nach der laufenden Ereignisverarbeitung wird nur der interne Leaflet-Pinch-/Drag-Zustand neutralisiert
- vorhandene Touch-/Pointer-Caches werden geleert
- Dragging und Touch-Zoom werden gemäß Kartenkonfiguration neu aktiviert
- beim nächsten Fingerkontakt werden zusätzlich veraltete Pointerzustände erkannt und bereinigt

Es wurde **kein globaler `touchmove`-Handler** ergänzt.

## Schutzregeln unverändert

- kein Überschreiben von Leaflet-Tile-`transform`
- kein `transformOrigin` für WR-Raster
- kein globales `touchmove`
- kein WeatherRouter-Routing in Gewitterradar
- keine Providerwahl in Gewitterradar

## Stand

- Produkt **V4.11.25 DEV**
- Build **V4.11.25-DEV-2026-10-07**
- Runtime **41125r1**
- Modulsatz **E411-25A1**
- `core.manifest` **1.2.96**
- `location.radii-map` **1.0.7**
- `weather.display-menu` **0.4.7**
- Integration **0.25.0**

**C.K. – Eine Idee weiter gedacht.**
