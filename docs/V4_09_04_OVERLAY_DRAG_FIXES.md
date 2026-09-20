# Gewitterradar V4.09.04 – Overlay-Dragging und reines Trendmedaillon

Stand: **20.09.2026 · DEV/Testkandidat**

## Ausgangslage

V4.09.03 ergänzte die Vollbild-Schalter für Kompass und Medaillon, den größeren Kompass, die Standortbedienung oben rechts sowie den dauerhaft obenliegenden Layer-Schalter. Die reale Android-Prüfung zeigte danach drei konkrete Punkte:

1. Der Kompass ließ sich real per Finger nicht zuverlässig verschieben, obwohl die synthetische Pointer-Prüfung das Overlay direkt ansprach.
2. Das Kartenmedaillon trug zusätzlich die generische Klasse `.trend`. Dadurch erbte es Layoutregeln der History-/Tendenzeinheit, obwohl im Vollbild ausschließlich das Medaillon als reine Trendanzeige gewünscht ist.
3. Die Layer-Schaltfläche saß zu hoch und soll knapp oberhalb der Leaflet/OpenStreetMap-Attribution liegen.

## Umsetzung

### Kompass

Der äußere `#map-compass-overlay` ist die einzige aktive Drag-Hitfläche im Vollbild. Er verarbeitet Pointer Events für Maus, Touch und Stift. Die eingebettete Kompassgeometrie und ihre Unterelemente verwenden im Kartenoverlay `pointer-events:none`, sodass reale Touch-Hit-Tests nicht auf einem verschachtelten SVG-/Instrumentknoten hängen bleiben.

Der vorhandene normalisierte Positionsspeicher bleibt unverändert:

`gewitterradar:v409:map-compass-position`

Die Sichtbarkeit bleibt getrennt:

`gewitterradar:v409:map-compass-visible`

### Reines Medaillon

`#map-medallion-overlay` besitzt **nicht mehr** die generische History-/Tendenzklasse `.trend`. Das Overlay enthält ausschließlich:

- die Medaillon-Basisgrafik;
- den Trendpfeil.

Keine Beschriftung, kein Tendenztext, kein History-Panel und kein Verlaufsdiagramm werden in das Kartenoverlay übernommen.

Die vier produktiven Zustände werden direkt auf dem Overlay gespiegelt:

- `none`;
- `up`;
- `stable`;
- `down`.

Auch beim Medaillon empfängt nur der äußere Overlay-Container den Drag. Die Grafik selbst kann Pointer-Ereignisse nicht abfangen.

Position und Sichtbarkeit bleiben getrennt lokal gespeichert:

- `gewitterradar:v409:map-medallion-position`;
- `gewitterradar:v409:map-medallion-visible`.

### Systemübergreifende Bedienung

Die verbindliche Zielplattform ist nicht nur Android. Kompass und Medaillon müssen auf **Desktop, Android und iPad/iPad Pro** frei verschiebbar sein. Beide verwenden denselben Pointer-Event-Pfad mit `pointerdown`, `pointermove`, `pointerup` und `pointercancel`.

### Layer-Schaltfläche

Die untere Position des Layer-Controls wird nicht mehr über einen pauschalen festen Abstand bestimmt. Stattdessen wird die aktuelle Höhe von `.leaflet-control-attribution` gemessen. Das Control sitzt mit einem kleinen Sicherheitsabstand direkt darüber und verdeckt die Attribution nicht.

Der z-index bleibt absichtlich die höchste Karten-Bedienebene.

## Nicht verändert

V4.09.04 verändert nicht:

- V4.08 FINAL;
- Clusteralgorithmen oder Clusterprofile;
- Radien/Aura;
- Ortssuche oder gespeicherte Orte;
- About/Widmung;
- Hilfe;
- Diagnosevertrag;
- Hi-Res-/Masterbestand;
- Helper-IDs;
- Kompass-/Medaillon-Grunddesigns.

## Automatisierte Schutzpunkte

Der V4.09-Vertrag prüft zusätzlich:

- Versions-/Buildkennung V4.09.04;
- bytegleiche Frontend-Ausleitungen;
- kein `.trend` auf dem Kartenmedaillon;
- Pointer-Hitfläche auf den äußeren Overlays;
- keine Pointer-Hitfläche auf Kompass-/Medaillon-Inhalten;
- dynamische Leaflet-Attributionspositionierung;
- Browsermatrix Desktop / iPad / Android für Dashboard und Integration;
- Erhalt der geschützten V4.08-Assets und Locale-Payload.

## Reale Abnahme

Vor jeder Promotion sind mindestens zu prüfen:

1. Android: Kompass per Finger frei verschieben, loslassen, erneut greifen; gespeicherte Position nach erneutem Vollbild prüfen.
2. Android: Medaillon einblenden; ausschließlich das reine Medaillon darf erscheinen; frei verschieben und Position prüfen.
3. iPad/iPad Pro: dieselben Drag-Prüfungen mit Touch.
4. Desktop: beide Instrumente mit Maus verschieben.
5. Layer-Schaltfläche: knapp oberhalb der Leaflet/OpenStreetMap-Attribution, keine Überdeckung.
6. Standortmenü oben rechts, Warnsystem-Test-Fail-Closed und Layer-Menü weiterhin prüfen.
7. Standard/Groß/Vollbild und separates Kartenfenster regressionsprüfen.

Erst nach ausdrücklicher realer Geräteabnahme darf die Promotion vorbereitet werden.
