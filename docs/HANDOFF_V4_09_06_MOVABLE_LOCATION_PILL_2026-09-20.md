# Übergabe – Gewitterradar V4.09.06 Standort-Pille

Stand: **20.09.2026 · aktiver DEV/Testkandidat**

## Einstieg

- Repository: `TheDaimos/gewitterradar`
- aktiver Branch: `feature/v4.09.06-movable-location-pill`
- Branch-HEAD immer live prüfen
- öffentliche Rückfallbasis: **V4.08 FINAL / Integration 0.20.0**
- keine Promotion vor realer Geräteabnahme

## Ausgangslage

V4.09.05 härtete Kompass und Medaillon für Touch und verkleinerte das Medaillon auf Android um 15 %.

V4.09.06 erweitert ausschließlich den Vollbild-Standortpfad:

- Standort-Pille frei verschiebbar;
- Position persistent pro Browserprofil;
- bestehendes Standortmenü bleibt inhaltlich unverändert;
- Menü reagiert dynamisch auf Pillenposition und real verfügbaren Raum.

## Verhalten

- obere Zone → bevorzugt nach unten;
- untere Zone → bevorzugt nach oben;
- mittlere Zone → mehrspaltig;
- zu geringe Höhe → automatisch mehrspaltig, auch außerhalb der Mitte;
- schmale Ansichten maximal 2 Spalten;
- breite Ansichten bis zu 3 Spalten;
- wenn selbst das nicht reicht: internes Scrollen;
- geöffnete Liste wird während des Ziehens per requestAnimationFrame live neu positioniert.

## Lokale Speicherung

`gewitterradar:v409:map-location-position`

Bestehende V4.09-Schlüssel für Kompass, Medaillon und Kartenmodus bleiben unverändert.

## Kanonische Dateien

Quelle:
- `frontend/gewitterradar.js`

Bytegleiche Ausleitungen:
- `custom_components/gewitterradar/frontend/gewitterradar.js`
- `dashboard/dist/gewitterradar.js`

Tests:
- `scripts/verify-v409-map-display.mjs`
- `scripts/test-v409-map-display.cjs`

## Abnahme / bekannte Einschränkung

**Realer Nutzerstand: angenommen.** Die frei verschiebbare Standort-Pille und die dynamische Öffnungsrichtung werden als gut/funktional bewertet.

**Verbindlicher visueller Freeze:** Die aktuelle Vollbildgröße von **Kompass und Medaillon** wurde auf Android real angesehen und ausdrücklich als passend bestätigt. Diese Größen nicht mehr verändern, solange kein neuer ausdrücklicher Größenauftrag kommt.

Bekannte und ausdrücklich akzeptierte Einschränkung:
- die vorgesehene automatische Mehrspaltigkeit der Standortliste greift derzeit nicht zuverlässig;
- dieser Punkt wird **nicht weiter nachgebessert** und blockiert V4.09.06 nicht;
- zukünftige Arbeiten sollen diesen Bereich nicht ohne neuen ausdrücklichen Auftrag verändern.

## Aktueller CI-Status

Zum Übergabezeitpunkt:

- `Validate Gewitterradar integration`: **PASS**;
- `Hi-Res asset retention`: **PASS**;
- `Validate shared Gewitterradar frontend`: **FAIL** im bestehenden Diagnose-FREEZE-Lifecycle-Harness. Meldung: `mode=freeze`, `angle=45`, `activeCssAnimations=0`, `activeTimers=0`, `activeRafLoops=0`.

Vor Promotion muss dieser Prüfpfad geklärt werden. Nicht als Beleg für einen sichtbaren Fehler an Kompass, Medaillon oder Standort-Pille interpretieren.

## Nächste reale Prüfung

Besonders wichtig:
- Android und iPad/iPad Pro mit echter Finger-Geste;
- lange Standortliste bei Pille ca. 30 % oberhalb des unteren Randes;
- geöffnete Liste während des Verschiebens beobachten;
- Umschaltung einspaltig ↔ mehrspaltig sowie oben ↔ unten;
- Standortauswahl, gespeicherte Orte und Suche regressionsprüfen.

Erst danach Promotion/PR-Finalisierung.
