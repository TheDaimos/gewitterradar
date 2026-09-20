# Gewitterradar V4.09.06 – Test Release Notes

Status: **DEV/Testkandidat · nicht veröffentlicht**  
Datum: **20.09.2026**  
Öffentliche Rückfallbasis: **V4.08 FINAL / native Integration 0.20.0**

## Neu

- Standort-Pille im Vollbild frei verschiebbar auf Desktop, Android und iPad/iPad Pro.
- Position lokal gespeichert unter `gewitterradar:v409:map-location-position`.
- Geöffnetes Standortmenü folgt der Pille während des Verschiebens live.
- Obere Positionen öffnen bevorzugt nach unten.
- Untere Positionen öffnen bevorzugt nach oben.
- Mittlere Positionen wechseln automatisch auf Mehrspaltigkeit.
- Reicht die verfügbare Höhe in der bevorzugten Richtung nicht aus, wird auch außerhalb der Mitte automatisch auf Mehrspaltigkeit gewechselt.
- Schmale Ansichten verwenden höchstens 2 Spalten; breite Ansichten bis zu 3.
- Erst wenn der Inhalt trotz möglicher Spalten nicht vollständig passt, wird intern gescrollt.
- Separate Fensterkennung: `40906`.

## Unverändert

- Standort-Helper und vorhandene Standortauswahl;
- Personen/Zonen;
- gespeicherte Orte, Löschen/Wiederherstellen;
- weltweite Ortssuche;
- Kompass/Medaillon-Dragging aus V4.09.05;
- Android-Medaillon -15 %;
- Layer-Control knapp über Leaflet/OpenStreetMap;
- Warnsystem-Test-Fail-Closed;
- V4.08 FINAL.

## Reale Abnahme

1. Desktop: Standort-Pille mit Maus frei verschieben.
2. Android: Standort-Pille per Finger frei verschieben.
3. iPad/iPad Pro: Standort-Pille per Finger frei verschieben.
4. Pille oben: Menü öffnet nach unten.
5. Pille unten: Menü öffnet nach oben.
6. Pille Mitte: Menü mehrspaltig.
7. Pille ca. 30 % oberhalb des unteren Randes mit langer Liste: bei unzureichender Höhe automatisch mehrspaltig.
8. Menü geöffnet lassen und Pille bewegen: Richtung und Spaltenzahl müssen live wechseln.
9. Position nach Verlassen/erneutem Öffnen des Vollbilds kontrollieren.

Keine Promotion vor ausdrücklicher Geräteabnahme.
