# Gewitterradar – Meilensteine

Status: **V4.06 · 2026/09 – Release-Freeze / native Integration 0.18.0.**

## Erreicht

### M1 – V4.05 als geschützte Referenz eingefroren
- veröffentlichte visuelle Ausgangsbasis gesichert;
- About-/Widmungsdarstellung als geschützte Referenz dokumentiert;
- Premium-X und Kopier-Schriftrolle als freigegebene Originale übernommen.

### M2 – Gemeinsame Frontend-Quelle
- eine kanonische Frontend-Quelle für Integration und Dashboard;
- deterministische Erzeugung beider Auslieferungsformen;
- bytegenaue Paritäts- und Asset-Prüfungen;
- fail-closed Delta- und Regressionstests gegen Quellabweichungen.

### M3 – V4.06 Sprach- und Hilfeschicht
- **15 Sprachen + 4 Dialektvarianten = 19 Sprachvarianten**;
- verzögert geladenes gemeinsames Locale-Modul;
- vollständiger Dialog **„Hilfe & Hinweise“**;
- kontrollierter englischer Rückfall bei ungültigen Sprachpaketen;
- sprachabhängige Einstellungs-, Entitäts- und Hilfeinhalte.

### M4 – Recorder und Mehrgerätefähigkeit
- Recorder-Hinweise in About und Hilfe vereinheitlicht;
- feste Sensor-IDs durch Wildcard-Muster ersetzt;
- Unterstützung mehrerer Blitzortungsgeräte bzw. Beobachtungspunkte unabhängig vom Entity-Präfix dokumentiert.

### M5 – Premium-Oberfläche V4.06
- metallisch schillernde Rahmen für Einstellungen und Hilfe;
- harmonisierte Premium-Schließen-Schaltflächen;
- Schriftrolle für YAML-Kopieraktionen;
- Welcome-Zahnrad in Hauptansicht und Hilfe übernommen;
- Help-Icons geräteübergreifend ausgerichtet;
- Chevron- und Abschnittshierarchie verfeinert;
- mobile About-/Widmungsdarstellung gezielt angepasst;
- persönliche Signatur in den Welcome-Footer übernommen;
- Radius-Wertefelder vergrößert und vertikal zentriert.

### M6 – iPad-/Android-Feinabnahme
- iPad/iPad-Pro-Schließen-X ohne unerwünschten Fokusrahmen;
- kein blauer WebKit-Fokusrahmen mehr um den erneut geöffneten About-Dialog;
- gerätespezifische Footer-Positionierung für Android sowie iPad/iPad Pro;
- Android-Signatur mit stärkerer Präsenz;
- Desktop-, Android-, iPad- und iPad-Pro-Darstellung der akzeptierten Komponenten angeglichen.

### M7 – Griechisch im mobilen Hochformat
- längerer griechischer Untertitel überdeckt den Spruch nicht mehr;
- griechische Übersetzung blieb unverändert;
- Browser-Regression ergänzt;
- reale Android-Hochformat-Sichtprüfung erfolgreich abgeschlossen.

### M8 – finaler Recorder-Sprachaudit
- alle 19 registrierten Sprachvarianten geprüft;
- exakt vier aktuelle Wildcard-Quellen bestätigt;
- keine alten festen `sensor.home_lightning_*`-Recorder-IDs im aktuellen Pfad;
- eigener fail-closed CI-Test `scripts/test-recorder-locales.mjs` ergänzt.

### M9 – Release-Chronologie und Datumsformat
- aktueller Stand in Welcome, Einstellungen und Release History als `YYYY/MM · Vx.xx`;
- historische Release-History-Einträge als `Vx.xx · YYYY/MM`;
- V4.05 in die sichtbare Release History zurückgeführt;
- V4.00–V4.06 `2026/09`, sichtbare V3.x-Entwicklungsmeilensteine `2026/08`;
- Release-Regel dauerhaft in `docs/RELEASE_PROCESS.md` und `PROJECT_DEFAULTS.md` festgeschrieben.

### M10 – V4.06 Release-Freeze
- finale Dokumentation abgeglichen;
- finaler Frontend-/Browser-/Home-Assistant-/HACS-/Hassfest-/Paketlauf auf dem Release-Stand;
- exakt geprüfter Commit als V4.06-Freeze festhalten;
- öffentliche V4.06-Auslieferung aus genau diesem Stand erzeugen.

## Nach V4.06

### V4.07 · PLANNED – Weltweite Orts-Suche

Für den nächsten Entwicklungszyklus ist eine **weltweite Orts-Suche** vorgemerkt, über die ein ausgewählter Ort als Gewitterradar-Referenzpunkt verwendet werden kann. Umfang, Datenquelle, Bedienung und technische Umsetzung werden erst in der V4.07-Design- und Validierungsphase festgelegt.

Weitere größere Architekturänderungen bleiben ebenfalls getrennt vom eingefrorenen V4.06-Stand.
