# Gewitterradar V4.09.06 – frei verschiebbare Standort-Pille

Stand: **20.09.2026 · DEV/Testkandidat**

## Ziel

Die Standort-Pille ist im Vollbild auf Desktop, Android und iPad/iPad Pro frei verschiebbar. Ihre Position wird lokal normalisiert gespeichert.

## Menülogik

Das Standortmenü folgt der Pille und bewertet bei jedem Öffnen sowie während des Verschiebens den tatsächlich verfügbaren Platz:

- oben: bevorzugt nach unten öffnen;
- unten: bevorzugt nach oben öffnen;
- Mitte: bevorzugt mehrspaltig;
- passt die vollständige einspaltige Liste in der bevorzugten Richtung nicht, werden automatisch zusätzliche Spalten aktiviert;
- Android maximal 2 Spalten;
- iPad/Desktop bei ausreichender Breite bis zu 3 Spalten;
- passt auch die Mehrspaltigkeit nicht vollständig, scrollt ausschließlich die Standortliste intern.

Damit gilt ausdrücklich auch der gewünschte Fall: Befindet sich die Pille ungefähr 30 % oberhalb des unteren Kartenrandes und reicht der Platz nach oben für die vollständige einspaltige Liste nicht aus, wird auf Mehrspaltigkeit gewechselt.

## Live-Neuanordnung

Bleibt das Menü geöffnet und die Pille wird verschoben, werden Richtung, Spaltenzahl, Breite, Höhe und Position des Menüs laufend neu berechnet. Ein Drag schließt die Liste nicht.

## Dragging

Die Pille verwendet einen eigenen Maus-/Pointer-/Touch-Pfad mit Bewegungsschwelle. Ein einfacher Tap öffnet weiterhin die Standortliste; ein echter Drag unterdrückt den unmittelbar folgenden Klick, damit das Menü nicht versehentlich umgeschaltet wird.

Lokaler Positionsschlüssel:

`gewitterradar:v409:map-location-position`

## Nicht verändert

- Standortquelle und gespeicherte Orte;
- Standort-Suchdialog;
- Kompass-/Medaillon-Grundfunktion;
- V4.09.05 Android-Touch-Fallback;
- Layer-Control;
- V4.08 FINAL;
- Cluster/Radien/Aura;
- Hi-Res-/Masterassets.

## Abnahme

1. Desktop: Pille verschieben; oben/unten/Mitte prüfen.
2. Android: Finger-Drag der Pille; Menü offen lassen und Pille bewegen.
3. iPad/iPad Pro: dieselben Touch-Schritte.
4. Bei langer Liste prüfen, dass ca. 30 % oberhalb des unteren Randes automatisch Mehrspaltigkeit entsteht, wenn einspaltig nicht genug Raum vorhanden ist.
5. Position nach Vollbild verlassen/erneut öffnen prüfen.
6. Standortauswahl, Suche und gespeicherte Orte regressionsprüfen.
