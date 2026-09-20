# Gewitterradar V4.09.06 – Frei bewegliche Standort-Pille

Stand: **20.09.2026 · DEV/Testkandidat**

## Ziel

Die bereits im Vollbild vorhandene Standort-Pille wird frei verschiebbar. Das bestehende Standortmenü bleibt funktional unverändert, reagiert im Vollbild jedoch dynamisch auf die Position der Pille und den tatsächlich verfügbaren Platz.

## Verhalten

- Desktop, Android und iPad/iPad Pro: Pille frei verschiebbar.
- Position lokal gespeichert unter `gewitterradar:v409:map-location-position`.
- obere Zone: Menü bevorzugt nach unten;
- untere Zone: Menü bevorzugt nach oben;
- mittlere Zone: Mehrspaltigkeit;
- reicht der Raum in der bevorzugten Richtung nicht aus, wird auch außerhalb der Mitte auf Mehrspaltigkeit gewechselt;
- schmale Ansichten: maximal 2 Spalten;
- breite Ansichten: bis zu 3 Spalten;
- geöffnete Liste wird während des Verschiebens per requestAnimationFrame live neu positioniert;
- internes Scrollen bleibt nur als Rückfall, wenn der Inhalt trotz Spalten nicht vollständig in den verfügbaren Raum passt.

## Bestehende Standortlogik

Nicht dupliziert oder ersetzt werden:
- Standort-Helper;
- Personen/Zonen;
- gespeicherte Orte;
- Ortssuche;
- Wiederherstellen/Löschen;
- Auswahl des Bezugsstandorts.

V4.09.06 verändert nur Vollbildposition und Darstellung des bestehenden Menüs.

## Akzeptierter Endstand

Die frei bewegliche Standort-Pille im Vollbild wird in ihrem aktuellen Stand beibehalten. Die automatische Mehrspaltigkeit der Standortliste ist als bekannte Einschränkung akzeptiert und soll ohne neuen ausdrücklichen Auftrag nicht weiter verändert werden.

## Abnahme

1. Pille auf Desktop mit Maus verschieben.
2. Android per Finger verschieben.
3. iPad/iPad Pro per Finger verschieben.
4. Pille oben platzieren → Menü nach unten.
5. Pille unten platzieren → Menü nach oben.
6. Pille mittig platzieren → Mehrspaltigkeit.
7. Pille ca. 30 % oberhalb des unteren Randes platzieren und eine lange Liste öffnen → bei zu geringer Höhe Mehrspaltigkeit.
8. Liste geöffnet lassen und Pille verschieben → Richtung/Spaltenzahl müssen live wechseln.
9. Position nach Vollbild verlassen/erneut öffnen prüfen.
