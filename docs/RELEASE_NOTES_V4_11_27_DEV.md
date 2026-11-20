# Gewitterradar V4.11.27 DEV

Stand: **2026-10-08**

## Auto-Darstellung: Effekt exakt zwei Zoomstufen früher

Der Realtest von V4.11.26 hat das Zielbild weiter präzisiert:

> Der Effekt von Zoom 11 soll bereits bei Zoom 9 sichtbar sein, davor entsprechend weich skaliert.

V4.11.27 verschiebt deshalb die bestehende Auto-Kennlinie **geschlossen um zwei Zoomstufen nach vorne**.

Technisch:

- bisher: `relativeZoom = mapZoom - maxNativeZoom`
- neu: `relativeZoom = mapZoom - maxNativeZoom + 2`

Dadurch bleibt der Verlauf unverändert weich, beginnt aber exakt zwei Zoomstufen früher.

Erwartung:

- bisheriger Effekt Zoom 11 ≈ neuer Effekt Zoom 9
- bisheriger Effekt Zoom 10 ≈ neuer Effekt Zoom 8
- davor weiterhin gleitender Übergang ohne harte Stufe

Die maximale Nahzoom-Glättung bleibt unverändert bei **220 px**.

## Augen-Symbol frei verschiebbar

Die schwebende Augen-Schaltfläche der WeatherRouter-Darstellung kann jetzt unabhängig vom großen Darstellungsfenster auf der Karte verschoben werden.

Eigenschaften:

- eigene gespeicherte Kartenposition
- Position bleibt nach Neuladen erhalten, wenn Positionsspeicherung aktiv ist
- Begrenzung auf den sichtbaren Kartenbereich
- Touch-Drag auf Mobilgeräten
- Drag löst nicht versehentlich das Öffnen/Schließen des Menüs aus
- „Position zurücksetzen“ setzt nun sowohl Panel als auch Augen-Symbol zurück

Die Touch-Unterdrückung ist ausschließlich auf die Augen-Schaltfläche begrenzt; die Karten-Touchlogik bleibt unverändert.

## Karten-Gesten: HyperOS-Screenshot-Recovery weiter verstärkt

Der Drei-Finger-Screenshot auf HyperOS bleibt der reproduzierbare Auslöser für den sogenannten „3-Finger-Joe“:

- restliche Oberfläche bleibt bedienbar
- die Leaflet-Karte selbst bleibt danach teilweise eingeschränkt
- HyperOS liefert die Systemgeste offenbar nicht zuverlässig vollständig an die Webansicht

V4.11.27 macht die Wiederherstellung deshalb unabhängig davon, ob Gewitterradar tatsächlich drei Finger sieht.

Neu:

- bereits **jede erkannte Mehrfinger-Sitzung** wird zeitlich markiert
- der erste neue Einzelkontakt auf der Karte nach einer solchen Sitzung normalisiert Leaflet vor der neuen Geste
- wenn ein einzelner neuer Pointer vom Browser fälschlich als `non-primary` gemeldet wird, wird ebenfalls sofort zurückgesetzt
- übrig gebliebene globale Pointer werden erkannt
- Touch-Zoom und Dragging werden neu initialisiert
- zusätzlich wird ein eventuell hängen gebliebener Leaflet-Zoomanimationszustand beendet:
  - `_animatingZoom = false`
  - ausstehende Zoomziele werden verworfen
  - `leaflet-zoom-anim` wird entfernt
- anschließend werden Touch-Zoom und Dragging gemäß Kartenkonfiguration wieder aktiviert

Die Betriebssystem-Screenshot-Geste wird **nicht blockiert**.

## Zoomangabe

Die bereits eingeführte Kartenlegende bleibt aktiv:

`Darstellung: Auto · Zoom 9`

Damit kann die Auto-Kennlinie anhand von Screenshots jetzt exakt pro Zoomstufe abgestimmt werden.

## Schutzregeln unverändert

- kein Überschreiben von Leaflet-Tile-`transform`
- kein `transformOrigin` für WeatherRouter-Raster
- kein globales `touchmove`
- kein WeatherRouter-Routing in Gewitterradar
- keine Providerwahl in Gewitterradar

## Stand

- Produkt **V4.11.27 DEV**
- Build **V4.11.27-DEV-2026-10-08**
- Runtime **41127r1**
- Modulsatz **E411-27A1**
- `core.manifest` **1.2.98**
- `location.radii-map` **1.0.9**
- `weather.display-menu` **0.4.9**
- Integration **0.25.0**

**C.K. – Eine Idee weiter gedacht.**
