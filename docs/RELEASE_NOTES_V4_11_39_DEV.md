# Gewitterradar V4.11.39 DEV · Doppeltipp-Ortsfokus
Stand: 2026-10-08

## Anlass
Die Android-Realabnahme von V4.11.38 bestaetigt eine funktionsfaehige Doppeltipp-Erkennung vor/nach Drei-Finger-Systemgeste. Beim Doppeltipp blieb der angetippte Ort aber auf seiner alten Bildschirmposition und rueckte nicht ins Kartenzentrum.

## Korrektur
- Aus unveraenderten, validierten Bildschirmkoordinaten wird mit Leaflet der angetippte geografische Punkt bestimmt.
- Der geografische Punkt wird beim Zoom um eine Stufe zum neuen Kartenmittelpunkt (statt den bisherigen Pixelanker beizubehalten).
- Fehlerhafte Beruehrungskoordinaten verwenden weiter den bestehenden sicheren Zoom um die Kartenmitte.
- Eigener Diagnosetyp 'gesture.doubletap.zoom' protokolliert 'anchor: tap-geographic-centered' und den Zielmittelpunkt.
- Ein-Finger-Verschiebung, Zwei-Finger-Zoom mit Verschiebung und Touch-Only-Ersatzbedienung nach dem Drei-Finger-Screenshot bleiben unveraendert.
- Keine Aenderung an Radien, Koordinaten von Standort-Tracking, Layern oder WeatherRouter.

## Abnahme
1. DRA aus deploy/dev installieren, HA neu starten, Hauptfenster zeigt V4.11.39 DEV.
2. Ort am oberen oder seitlichen Kartenrand doppelt antippen: Ansicht zoomt +1 und der Ort landet mittig.
3. An anderem Ort wiederholen und zwischenzeitlich manuell verschieben.
4. Drei-Finger-Bildschirmfoto ausloesen; Doppeltipp erneut pruefen.
5. Mit zwei Fingern gleichzeitig zoomen und verschieben; bei Bedarf zwei Diagnosen exportieren (vor/nach).
6. Pruefen: Kein Sprung nach Russland/Arktis, GPS-Zentrierung bleibt korrekt.
