# Gewitterradar – Meilensteine

Status: **2026/09 · V4.07.56 – abgenommener Produkt-/Diagnosekandidat.**  
Native Integration: **0.19.0.**  
Öffentliche Rückfallbasis bis zur kontrollierten Promotion: **V4.06.**  
`main` bleibt bis zur ausdrücklichen Benutzerfreigabe unverändert.

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

### M8 – finaler Recorder-Sprachaudit V4.06
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
- direkte Koordinateneingabe umgesetzt;
- lokales Länder-Auto-Complete und Ländergruppierung umgesetzt;
- eigener nativer Gewitterradar-GPS-Tracker plus separater Dashboard-Tracker;
- `gewitterradar.set_reference_coordinates` und Dashboard-Setzpfad umgesetzt;
- `★` Speichern, `×` Soft-Delete und `↶` Wiederherstellen über Local-To-do umgesetzt und real geprüft;
- Standortübernahme schließt die Suche und fokussiert die Karte;
- Standortmenü schließt bei Außenklick/-tap;
- Bezugsstandort und Blitzdatenbereich bleiben fachlich getrennt;
- halbautomatischer Blitzortung-`Location entity`-Pfad dokumentiert;
- Externe-Dienste-/Netzwerkdiagnose einschließlich fail-closed URL-Inventar ergänzt;
- Release History um DE/EN-Umschalter und den realen V4.07-Umfang erweitert.

### M12 – V4.07.31 historischer Near-Final-Sprach- und Hilfestand
- Deutsch und Englisch nativ, 17 externe Varianten im Locale-Modul;
- **15 Sprachen + 4 Dialektvarianten = 19 Varianten** vollständig strukturell geprüft;
- Boarisch, Plattdüütsch, Sächs’sch und Schwäbisch von großen Standarddeutsch-Hilfeblöcken bereinigt;
- technisches Vokabular, Domains, Protokolle, Entity-/Service-Namen bewusst unverändert gelassen;
- fail-closed Dialekt-/Schema-Regression ergänzt;
- damalige Kandidatenidentität und TEST-Historie dauerhaft in den V4.07-Test-Release-Notes dokumentiert.

V4.07.31 bleibt ein historischer Konsolidierungspunkt und ist nicht mehr der aktuelle Kandidat.

### M13 – V4.07.54 normaler UI-/Funktionsstand abgenommen
- weltweite Ortssuche, Koordinateneingabe und gespeicherte Orte abgenommen;
- Mehrsprachigkeit mit 19 Varianten abgenommen;
- „Hilfe & Hinweise“ einschließlich Standort-/Recorder-/Netzwerkstruktur abgenommen;
- akzeptierte Android-Kartenlegende und Radiusdarstellung festgelegt;
- Einstellungen-/About-/Medaillon-/Kompass-Normalbetrieb abgenommen;
- verbindlicher Funktions-Freeze festgelegt: keine erneuten Änderungen an normaler Karte, Ortssuche, Sprachen, Hilfe, Radien oder Bedienung innerhalb der V4.07.56-Finalisierung.

### M14 – V4.07.55 Diagnose-Mastermodus
- globaler Diagnosemodus mit pinkem Aktiv-Rahmen;
- verschiebbare, minimier-/maximierbare Diagnosekonsole;
- Childtools können ausgeblendet werden, ohne die Simulation zu stoppen;
- Master-Hard-Stop beendet sämtliche Childtools und synthetischen Zustände;
- virtuelle Szenarien AUS / BEOBACHTUNG / GEWITTER / GEFAHR / GESAMT;
- synthetische Blitze laufen durch die normale Produktpipeline.

### M15 – V4.07.56 Mehrzellen-/EXTREM-Diagnose und Medaillon-Abnahme
- deterministische virtuelle Gewitter mit **1–5 Zellen**;
- EXTREM-Test über die bestehende produktive Cluster-/Extremlogik, ohne Grenzwerte oder Farben künstlich zu erzwingen;
- Gruppiert-/Einzelblitz-Darstellung über die normale Produktpipeline;
- Medaillon-Zustände **LEER / PFEIL / TREND / FREEZE / NORMAL** abgenommen;
- Kalibrier-, Geometrie-, Mess-, JSON-/Snapshot- und Performance-Diagnose geschützt;
- 19 Diagnose-Sprachvarianten geschützt.

### M16 – Diagnosevertrag dauerhaft geschützt
- `docs/DIAGNOSTIC_PROTECTION_V4_07_56.md` angelegt;
- maschinenlesbarer Diagnosevertrag eingeführt;
- `scripts/verify-diagnostic-contract.mjs` als fail-closed Prüfer;
- eigener GitHub-Actions-Workflow als Release-Gate;
- absichtliche Abschwächung nur nach ausdrücklicher Benutzerfreigabe und erneuter Abnahme.

### M17 – eigener V4.07.56-Golden-/Browservertrag
- historische V4.05-Golden-Referenz unverändert erhalten;
- eigener V4.07.56-Golden-Vertrag für sieben feste Profile eingeführt;
- exakte akzeptierte Frontendidentität geschützt;
- Geometrietoleranz maximal **0,02 px**;
- pixelbezogene Gleichheit von Dashboard und Integration innerhalb desselben CI-Laufs;
- sichtbares X und 44×44-Touchbereich getrennt und korrekt geprüft;
- Desktop- und Touch-Fokus-/Tastaturpfade an die reale Browsersemantik angepasst;
- vollständiger Shared-Frontend-/Browserlauf erfolgreich durchlaufen.

### M18 – permanente Hi-Res-/Legacy-Aufbewahrung
- globale und projektspezifische Regel festgeschrieben: nicht mehr aktive Hi-Res-Master werden nicht automatisch gelöscht;
- Git-Historie allein zählt nicht als ausreichendes Archiv;
- alle bekannten Hilfe-, Ortssuche- und About-Master im aktuellen Repository bestätigt;
- **32 eindeutige Master-/Legacy-Inhaltsidentitäten** in einem maschinenlesbaren Retentionsvertrag geschützt;
- content-basierter Schutz erlaubt kontrollierte Verschiebung nach `legacy/`, aber kein stilles Verschwinden;
- neue Master müssen fail-closed in den Vertrag aufgenommen werden;
- eigener CI-Workflow läuft auf jedem relevanten Commit.

### M19 – V4.07.56 kanonischer Produktstand und Paket-/SHA-Vertrag
- akzeptiertes Frontend direkt als kanonische Quelle synchronisiert;
- Frontendgröße **1.955.141 Bytes**;
- Frontend-SHA256 `249485f4bcf68c9b23b821cae9b507030ae09cff5a56f7e28d3d7f3b02eb4a1a`;
- Locale-SHA256 `997c4fe9b357935888fdb7bedc43cdd17f105b97241a000324891cea575dd436`;
- native Integration auf **0.19.0**;
- V4.07-Dashboard-Paket deterministisch in die kanonische Build-/Prüfsummenkette aufgenommen;
- V4.07-Paket-SHA256 `1b705c5686e6a7be6dfb36717903df551d4f9f93787c39bd12bddf00aefae694`;
- historisches V4.06-Paket bleibt erhalten und wird weiterhin geprüft;
- Release Notes, README, Installation, History und Release-To-do auf V4.07.56 synchronisiert.

## Noch offen bis zur kontrollierten V4.07.56-Promotion

- `CHANGELOG.md` auf den endgültigen V4.07.56-Kandidatenstand bringen;
- letzten vollständigen Shared-Frontend-/Browserlauf auf dem endgültigen Dokumentations-/Prüfsummen-Commit grün bestätigen;
- letzten Integration-/HACS-/Hassfest-/Home-Assistant-Lauf auf demselben Commit grün bestätigen;
- abgeleitetes Repository `TheDaimos/gewitterradar-dashboard` aus exakt dem akzeptierten Stand synchronisieren;
- finalen Vergleich des bisherigen `main` mit dem Promotionsstand durchführen;
- ausdrückliche Benutzerfreigabe für die Promotion nach `main` einholen;
- erst danach kontrolliert nach `main` integrieren;
- relevante Release-Gates auf dem tatsächlichen neuen `main` erneut vollständig ausführen;
- Golden Master aus exakt diesem grünen neuen `main` erzeugen und extern sichern;
- öffentlichen Tag/GitHub-/HACS-Release auf exakt denselben verifizierten Commit setzen.

Der PRE-MERGE-Snapshot des bisherigen `main` wurde bereits gemäß Promotion-Audit erzeugt und außerhalb GitHub gesichert.

## Getrennte externe Prüfungen

Diese Punkte verändern den abgenommenen V4.07.56-Produktstand nicht und werden nicht fälschlich als abgeschlossen dargestellt:

- reales Verhalten der separat installierten Blitzortung-Integration bei kleinen/großen Standortbewegungen;
- Neuabonnierungs-/Datenregions-Latenz von Blitzortung;
- Neustart-/Restore-Verhalten mit einer konkret eingerichteten Blitzortung-`Location entity`;
- Recorder-/Datenbankauswirkungen häufiger Standortwechsel;
- reale DNS-Filter-/Proxy-/TLS-Inspection-/Segmentierungsfälle, soweit eine entsprechende Umgebung verfügbar ist.

Ob diese externen Prüfungen vor dem öffentlichen Release zwingend abgeschlossen werden müssen oder als dokumentierte Nachprüfung weiterlaufen dürfen, bleibt eine bewusste Releaseentscheidung.

## Nach V4.07.56

Die vollständige Zukunfts-/Ideenliste liegt in `docs/ROADMAP.md`. Algorithmische Änderungen an Cluster-/Zoom-Logik gehören ausdrücklich in den V4.08-Arbeitsblock und nicht mehr in V4.07.56.

Bis zur Promotion gilt **Feature-Freeze**: neue Produktideen gehen in den Backlog und verändern den abgenommenen V4.07.56-Stand nicht mehr.
