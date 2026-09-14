# Gewitterradar – Meilensteine

Status: **V4.06 · 2026/09 – veröffentlichte Release-/Rückfallbasis.**  
Aktive Entwicklung: **V4.07.31 Near-Final-Testkandidat / native Integration 0.19.0 auf Feature-Branch.**  
Interner Reifegrad: **ca. 95 %** – Projektabschätzung, keine Release-Garantie.

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
- exakt geprüfter Commit als V4.06-Freeze festgehalten;
- öffentliche V4.06-Auslieferung aus genau diesem Stand erzeugt.

### M11 – V4.07 weltweite Standortarchitektur
- weltweite Orts-/PLZ-Suche im bestehenden Standortmenü umgesetzt;
- Open-Meteo primär, kontrollierter Nominatim-Rückfall;
- lokales Länder-Auto-Complete und Ländergruppierung umgesetzt;
- eigener nativer Gewitterradar-GPS-Tracker plus separater Dashboard-Tracker;
- `gewitterradar.set_reference_coordinates` und Dashboard-Setzpfad umgesetzt;
- `★` Speichern, `×` Soft-Delete und `↶` Wiederherstellen über Local-To-do umgesetzt und real geprüft;
- `Nutzen` übernimmt den Standort, schließt die Suche und fokussiert die Karte;
- Standortmenü schließt bei Außenklick/-tap;
- Bezugsstandort und Blitzdatenbereich bleiben fachlich getrennt;
- halbautomatischer Blitzortung-`Location entity`-Pfad dokumentiert und real grundsätzlich bestätigt;
- Externe-Dienste-/Netzwerkdiagnose einschließlich fail-closed URL-Inventar ergänzt;
- Release History um DE/EN-Umschalter und den realen V4.07-Umfang erweitert.

### M12 – V4.07.31 Near-Final-Sprach- und Hilfestand
- akzeptierte V4.07.30-Oberfläche unverändert als direkte Ausgangsbasis verwendet;
- Deutsch und Englisch nativ, 17 externe Varianten im Locale-Modul;
- **15 Sprachen + 4 Dialektvarianten = 19 Varianten** vollständig strukturell geprüft;
- Boarisch, Plattdüütsch, Sächs’sch und Schwäbisch von großen Standarddeutsch-Hilfeblöcken bereinigt;
- technisches Vokabular, Domains, Protokolle, Entity-/Service-Namen bewusst unverändert gelassen;
- alte V4.07.29-Komplett-Registry durch V4.07.31 ersetzt statt dupliziert;
- fail-closed Dialekt-/Schema-Regression ergänzt;
- Haupt-JavaScript: **1.779.464 Bytes**, SHA256 `2d13746361d52af29be279f0c273d7fc3ca381a531a82f26efe8c82f3a871b31`;
- Locale-Modul: **401.387 Bytes**, SHA256 `898182f61b59682cd34607219018437999081b67e171e7f8955df454ec3d7ccb`;
- Komplettartefakt `v407-test31-complete`: **2.238.710 Bytes**, ZIP-SHA256 `91f4e615029040c1f01498355071871c693c771c5bf9d82efadc1586cf9d6917`;
- V4.07.31-Kandidatenworkflow, HACS-Integration, Paketvertrag, Hassfest und Home-Assistant-2026.9.0-Laufzeitprüfung erfolgreich;
- aktueller interner Reifegrad ungefähr **95 %**.

## Noch offen bis zum V4.07-Freeze

- finaler V4.07.31-Realgeräte-Sprachaudit mit Deutsch/Englisch, repräsentativen externen Sprachen und allen vier Dialekten;
- abschließende Desktop-/Android-/iPad-/iPad-Pro-Regression der Such-/Standort-/Saved-Places-/Touch-/Scrollpfade; iPhone/iOS ergänzen, sobald verfügbar;
- Blitzortung: kleine/große Standortbewegung, Datenregions-Latenz, Neuabonnierung, Neustart/Restore und Recorder-/Datenbankauswirkungen final prüfen;
- robusten sichtbaren Status für Bezugsstandort versus tatsächlich synchronisierte Blitzdatenregion entscheiden/abschließen;
- Firewall-/DNS-/Proxy-/TLS-Inspection-Hinweise in einem real gefilterten/segmentierten Szenario verproben, soweit verfügbar;
- finalen Shared-Frontend-/Browserlauf auf dem Freeze-Commit vollständig grün bestätigen;
- beide Auslieferungsformen synchronisieren, finale Prüfsummen/Assets/Dokumentation erzeugen, exakt akzeptierten Commit einfrieren/taggen und HACS-/Release-Promotion durchführen.

Neue Produktideen sollen diese Restarbeiten nicht mehr inhaltlich erweitern. Bis zum Freeze gilt funktional weitgehend **Feature-Freeze**; neue Ideen gehen in den Backlog.

## Nach V4.07

### Unversionierter Zukunfts-Backlog

Die vollständige verbindliche Zukunfts-/Ideenliste liegt in:

`docs/ROADMAP.md`

Dort sind unter anderem MapLibre, Wetter-/Radarzellen, Unwetter/Tornado/Alarmierung, 120-Minuten-Wiedergabe, Cluster-Verfeinerung, Standortkomfort, Vollbild/Earth-Ideen und die zugehörigen Quellen-/Architekturhinweise **ohne automatische Versions- oder Umsetzungszusage** festgehalten.

Zusätzlich ist im V4.07-Release-To-do die spätere Idee eines **globalen Gewitter-Lagebilds / Storm Feeds** festgehalten.

Neue Ideen werden dort aufgenommen, ohne V4.07 automatisch zu erweitern.
