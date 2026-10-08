# Gewitterradar V4.11.38 DEV

Stand: 08.10.2026. Android-Realabnahme steht aus.

## Befund
Nach dem Drei-Finger-Bildschirmfoto liefert die Home-Assistant-Android-WebView teilweise nur noch Touch- statt Pointer-Ereignisse. Dazu werden veraltete Kontakte in TouchList mitgezaehlt. Der Doppeltipp der V4.11.37 hatte ausschliesslich PointerUp-Ereignisse verarbeitet. Zweiter Realexport enthielt ausschliesslich Doppeltippversuche nach der Screenshot-Geste: 0 gesture.doubletap.zoom bei weiterhin vorhandenen touchstart/touchend.

## Korrektur
- Kurze, ortsfeste Ein-Finger-Beruehrungen werden im bestaetigten WebView-Fehlerzustand ueber changedTouches und identifier erkannt.
- Kurze Taps nach TouchFallback fliessen in dieselbe Doppeltipp-Erkennung wie native Pointer-Taps. Abweichende Fingerzahl und Drag-Bewegung schliessen Doppeltipp aus.
- Geografische Zoom-Verankerung am angetippten Ort statt Kartenmitte. Koordinaten werden anhand des Kartencontainers umgerechnet und als eine Leaflet-Kartenansicht uebernommen. Ungueltige Punkte fallen auf die bisherige Kartenmitte zurueck.
- Gezielte Diagnose: gesture.touch-tap.start/end, gesture.tap.observed, gesture.doubletap.zoom inklusive geografischem Punkt, geaenderte Touch-Positionen und Kandidaten-Zustand.
- Bewaehrter Zwei-Finger-Zoom inklusive simultaner Verschiebung aus V4.11.37 bleibt erhalten.

## Abnahme am Android-Gerät
1. Vor Screenshot: Doppeltipp im Randbereich, sichtbaren Zoomanker pruefen.
2. Drei-Finger-Bildschirmfoto ausfuehren.
3. Danach mehrere Doppeltipps auf die Karte: eine Stufe Hineinzoomen am angetippten Ort.
4. Eine Fingerbewegung und Zwei-Finger-Pinch mit gemeinsamer Translation auf Funktionsfaehigkeit testen.
5. Zwei JSON-Diagnosen vor und nach Screenshot erstellen.

Identity V4.11.38 DEV / Runtime 41138r1 / Modulsatz E411-38A1 / 31 Module / Integration 0.25.0. V4.10 FINAL bleibt unveraendert.

C.K. – Eine Idee weiter gedacht.
