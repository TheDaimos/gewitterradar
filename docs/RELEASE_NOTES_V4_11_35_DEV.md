# Gewitterradar V4.11.35 DEV

Stand: **2026-10-08**

## Android/HyperOS – Phantomkontakte und zu häufige Kartenaktualisierung

Auswertung zweier realer V4.11.34-Exporte: Normalzustand (304 Ereignisse, 5 vollständige Leaflet-Kartenverschiebungen, 2 erfolgreiche Geo-Bewegungen); Störungszustand (2.536 Ereignisse, davon nur 800 im Ringpuffer; 9 Quarantänen, 17 Rücksetzungen im gespeicherten Ausschnitt, keine erfolgreich abgeschlossene Leaflet-Ziehbewegung). Die Geo-Taste arbeitet wieder, aber die alten Touch-/Pointer-Abgleichregeln aktivierten erneut die 650-ms-Sperre. Die Notbedienung verursachte zudem sehr viele Kartenbewegungen pro Sekunde.

**Änderungen:**
- Ein WebView-Widerspruch allein löst keine Touch-Quarantäne bzw. Leaflet-Neuinitialisierung mehr aus. Solange Leaflet nicht aktiv an einer hängen gebliebenen Bewegung arbeitet, wird nur diagnostiziert.
- Die Ersatzsteuerung wird erst bei eindeutig nicht primärem Erstkontakt mit überzähligem TouchList-Eintrag aktiv. Echte Zweifingerbewegungen bleiben im normalen Leaflet-Weg.
- Fehlen nach dem Systemwisch die PointerEvents vollständig, erfasst die Kartenfläche nur im bereits beobachteten Fehlerzustand die tatsächlich eintreffenden `changedTouches` als lokale Ersatzbedienung.
- Bewegungs- und Zoomkorrekturen erfolgen höchstens einmal pro `requestAnimationFrame`, nicht bei jedem Zeigerereignis doppelt.
- Das Kartendiagnose-JSON enthält nun `ghostPointerObserved` und den Modus sowie die Kontaktdatenanzahl der laufenden Ersatzbedienung.
- Geo-Knopf- und Zielprotokollierung bleiben aus V4.11.34 erhalten.

Keine globale Touchmove-Sperre. Keine Änderung an Leaflet-Kachel-Transformationen, WeatherRouter, Project Hub oder V4.10 FINAL.

## Pflicht-Realabnahme

1. V4.11.35 DEV über DRA installieren und Home Assistant gemäß DRA-Anzeige neu starten.
2. Nach dem Laden die Kartendiagnose öffnen, Ereignisse leeren, Einfinger-Verschieben, Zweifinger-Zoom und Geo-Knopf prüfen; JSON herunterladen.
3. Diagnose minimieren; Drei-Finger-Bildschirmfoto-Geste auslösen.
4. Danach Einfinger-Verschieben, Zweifinger-Zoom und Geo-Knopf erneut prüfen; JSON herunterladen.
5. `gesture.browser-touch-observation`, `gesture.browser-touch-fallback-start/move/end`, `gesture.quarantine.*`, `gesture.hard-reset.*`, `leaflet.dragstart/dragend`, `geo.focus.*` vergleichen. Auch auf fühlbares Ruckeln achten.

**Kennungen:** V4.11.35 DEV · 41135r1 · E411-35A1 · 31 Module · core.manifest 1.2.106 · location.radii-map 1.0.15 · diagnostics.map 1.0.3 · Integration 0.25.0.

**C.K. – Eine Idee weiter gedacht.**
