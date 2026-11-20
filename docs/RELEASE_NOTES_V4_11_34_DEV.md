# Gewitterradar V4.11.34 DEV

Stand: 2026-10-08

## Android/HyperOS: Reparatur für „3-Finger-Joe“

Die mobile Diagnose aus V4.11.33 zeigt im Fehlerfall zwei verbleibende Android-WebView-Touchkontakte: nach dem Aufsetzen eines Fingers werden drei Kontakte, nach dem Loslassen weiterhin zwei gemeldet. Die alte Wiederherstellung löste viele vollständige Neuinitialisierungen aus.

- Globale Pointer- und Touch-Eingaben werden mit `composedPath()` auf Kartenkontakte eingeschränkt. Schaltflächen und andere Home-Assistant-Elemente sind von der Systemgestenerkennung ausgenommen.
- Ein Widerspruch zwischen gemeldeten WebView-Touches und tatsächlich erkannten Kartenzeigern löst keine neue Rücksetzschleife aus.
- Echte Drei-Finger-Gesten führen nur noch zu einer verzögerten, zusammengefassten Wiederherstellung, statt sofort + 220 ms + 700 ms.
- Nicht primäre Zeiger lösen nach einem Systemwisch keinen bedingungslosen Neuaufbau aus.
- Bei bestätigten WebView-Phantomkontakten werden Einzel-Finger-Verschieben und Zwei-Finger-Zoom zusätzlich aus den tatsächlichen Zeigerpositionen auf der Kartenfläche verarbeitet.
- Geo-Knopf und Kartenziel protokollieren `geo.button.click`, `geo.focus.request`, `geo.focus.method`, `geo.focus.moveend` beziehungsweise `geo.focus.skipped`.

## Mobile Pflicht-Realabnahme

1. V4.11.34 DEV via DRA installieren; Home Assistant gemäß Anzeige neu starten.
2. Kartendiagnose öffnen, normales Verschieben mit einem und Zoomen mit zwei Fingern sowie Geo-Knopf prüfen; JSON vor dem Bildschirmfoto herunterladen.
3. Diagnose minimieren, HyperOS-Drei-Finger-Bildschirmfoto erstellen.
4. Karte mit einem und zwei Fingern bedienen, Geo-Knopf betätigen; Diagnose wiederherstellen und zweites JSON herunterladen.
5. Ereignisse `gesture.browser-touch-*`, `gesture.system-reset.*`, `leaflet.drag*` und `geo.focus.*` auswerten.

Keine Änderungen an Leaflet-Kachel-Transformations-CSS, globalen Touchmove-Sperren, WeatherRouter und V4.10 FINAL. **Android-Realabnahme steht noch aus.**

**Build:** V4.11.34-DEV-2026-10-08 · Runtime 41134r1 · E411-34A1 · 31 Module · core.manifest 1.2.105 · location.radii-map 1.0.14 · ui.controls 1.1.7 · diagnostics.map 1.0.2 · map.clusters-recent 1.0.4 · Integration 0.25.0.

**C.K. – Eine Idee weiter gedacht.**
