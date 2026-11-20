# Gewitterradar V4.11.37 DEV

Stand: 08.10.2026

## Kartengesten / Android 17 – Zoom und Verschieben gleichzeitig

Zwei Kartendiagnosen aus V4.11.36 bestätigen:
- Vor der Screenshot-Geste reguläre Leaflet-Kartenbedienung.
- Nach der Systemgeste weiterhin Phantomkontakte in Android-WebView.
- Die Ersatzsteuerung zoomt nun tatsächlich, kann aber durch den Zoom-Anker in den Bildschirmkoordinaten die Karte diagonal versetzen.
- Ein Doppeltipp zoomt zwar einmal, verschiebt die Karte aber aufgrund des fehlerhaften Bildschirmkoordinaten-Ankers bis in Richtung Russland/Arktis.

### Umsetzung
- Doppeltipp: einmaliges Vergrößern um die Kartenmitte statt ungeprüfter WebView-Bildschirmkoordinaten. Kein Verlust des geografischen Kartenmittelpunkts.
- Zwei-Finger-Bedienung: Zoom aus Abstandsänderung und **gleichzeitige** geografische Verschiebung aus der Bewegung des gemeinsamen Finger-Mittelpunktes. Beide Effekte werden **in einem einzigen setView** kombiniert.
- Reine symmetrische Pinch-Geste: gleiche Kartenmitte, keine diagonal wandernde Ansicht.
- Bei gleichzeitigem Zoom + gemeinsamer Bewegung: geografisch korrekter Versatz in beiden Achsen, ohne gegenseitige Verfälschung.
- Die Kartendiagnose reduziert Leaflet-Ereignisfluten während einer laufenden Ersatzbedienung; Stichproben protokollieren die Anzahl der ausgelassenen identischen Bewegungsvorgänge.
- Normale Ein-Finger-Kartenbedienung, Geo-Schaltfläche und V4.10 FINAL bleiben unberührt.

### Android-Pflichtabnahme
1. V4.11.37 DEV via DRA installieren und HA nach Bedarf neu starten.
2. Vor dem Drei-Finger-Bildschirmfoto Ein-Finger-Verschieben, Zwei-Finger-Zoom+Verschieben, Doppeltipp und Geo prüfen.
3. Nach dem Bildschirmfoto jeweils reinen Zoom, gemeinsame Zwei-Finger-Verschiebung **während des Zooms**, Doppeltipp und Geo testen.
4. Kartendiagnose vor/nach herunterladen. Gezielt auf `gesture.browser-touch-fallback-pinch`, `gesture.doubletap.zoom`, `geo.focus.*` und `leaflet.move*` achten.

**Kennungen:** V4.11.37 DEV · Runtime 41137r1 · Modulsatz E411-37A1 · 31 Module · core.manifest 1.2.108 · location.radii-map 1.0.17 · diagnostics.map 1.0.4.

**C.K. – Eine Idee weiter gedacht.**
