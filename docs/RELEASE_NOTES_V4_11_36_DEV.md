# Gewitterradar V4.11.36 DEV

Stand: 08.10.2026

## Korrektur Android-Zweifinger-Zoom und Doppeltipp

Aus der realen Kartendiagnose V4.11.35 und dem Android-Test: Nach einer Drei-Finger-Bildschirmfoto-Geste funktioniert die Ein-Finger-Kartenverschiebung wieder und der GPS-Knopf führt die Kartenbewegung aus. **Zwei-Finger-Auseinanderziehen oder -Zusammenschieben lösten bislang diagonale Kartenverschiebungen statt Zoom aus.**

- Zwei-Finger-Gesten berechnen Zoom anhand der relativen Abstandsänderung beider tatsächlicher Berührungen.
- Symmetrische Abstandsänderungen lösen keine Kartenverschiebung aus. Nur eine echte Schwerpunktverlagerung führt zum Verschieben.
- Während der fehlerbedingten Ersatzbedienung wird Leaflets ganzzahliges Zoomraster vorübergehend aufgehoben, damit kleine Zoomschritte nicht verworfen werden. Beim Beenden wird die ursprüngliche Einstellung wiederhergestellt.
- Smartphone: Zwei schnelle, räumlich nahe Fingertipps auf die Kartenfläche (Doppeltipp) vergrößern um die nächste Zoomstufe am angetippten Ort.
- Desktop: Doppelklick verwendet die vorhandene Leaflet-Funktion `doubleClickZoom`; der nach Mobile-Doppeltipp entstehende native Doppelklick wird abgefangen, damit nicht zweimal vergrößert wird.
- Bedienelemente (GPS und andere Kartenschaltflächen) lösen keinen Doppeltipp-Zoom aus.
- Testvertrag prüft beide Richtungen der Fingerabstandsänderung, symmetrischen Null-Schwerpunkt, reine Kartenverschiebung, Versionsidentität und gleichlautende drei Oberflächen.

**Android-Realtest ausstehend:** Vor und nach Drei-Finger-Bildschirmfoto einzeln verschieben, zwei Finger auseinander und zusammen bewegen, Doppeltipp auf die Karte, GPS-Knopf; jeweils JSON exportieren.

**Identität:** V4.11.36 DEV · Runtime 41136r1 · E411-36A1 · 31 Module · core.manifest 1.2.107 · location.radii-map 1.0.16 · Integration 0.25.0.

V4.10 FINAL bleibt unverändert.

**C.K. – Eine Idee weiter gedacht.**
