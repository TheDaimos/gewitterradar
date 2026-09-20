# Übergabe – Gewitterradar V4.09.03 Vollbild-Bedienelemente

Stand: **20.09.2026 · aktiver DEV/Testkandidat**

## Sofortiger Einstieg

1. Bootstrap **Daimos — Gewitterradar** vollständig laden.
2. Kanonisches Repository: `TheDaimos/gewitterradar`.
3. Aktiver Arbeitsbranch: `feature/v4.09.03-fullscreen-controls`.
4. Branch-HEAD **immer live prüfen**, nicht aus diesem Dokument raten.
5. Öffentliche Rückfallbasis bleibt **V4.08 FINAL / native Integration 0.20.0**.
6. Keine Promotion vor realer Geräteabnahme.

## Warum V4.09.03 existiert

V4.09.02 hatte die neue Layer-Schaltfläche, gerätespezifische Startdarstellung und den gehärteten Kartenfensterpfad bereits umgesetzt. Die nächste reale Vollbildprüfung zeigte zusätzliche Anforderungen:

- Warnsystem-Testschaltflächen durften ohne aktivierte Simulation nicht sichtbar sein;
- Standortanzeige samt Menü soll im Vollbild oben rechts verfügbar sein;
- Layer-Schaltfläche muss immer über allen Karten-Overlays liegen;
- Vollbild-Kompass soll +30 % größer sein;
- Kompass und Medaillon sollen oben links über kleine Taster separat ein-/ausblendbar sein;
- das Medaillon soll wie der Kompass frei verschiebbar sein.

## Aktueller V4.09.03-Umfang

### Vollbild

- Standortanzeige + bestehendes Standortmenü automatisch oben rechts;
- zwei kleine Instrument-Schalter oben links: Kompass und Medaillon;
- aktuell ausgewählter Kompass als frei verschiebbares Overlay;
- Kompass exakt **30 % größer** als V4.09.02;
- Live-Tendenzmedaillon als frei verschiebbares Overlay;
- Layer-Schaltfläche dauerhaft oberste Karten-Bedienebene;
- Warnsystem-Testschaltflächen fail-closed.

### Lokale Speicherung

- `gewitterradar:v409:startup-map-display`;
- `gewitterradar:v409:last-map-display-mode`;
- `gewitterradar:v409:map-display-mode` (Kompatibilität);
- `gewitterradar:v409:map-compass-position`;
- `gewitterradar:v409:map-compass-visible`;
- `gewitterradar:v409:map-medallion-position`;
- `gewitterradar:v409:map-medallion-visible`.

Alles nur im jeweiligen Browserprofil; keine zusätzlichen HA-Helfer.

## Wichtige Implementierungsdetails

- Kanonische Quelle: `frontend/gewitterradar.js`.
- Ausleitungen:
  - `custom_components/gewitterradar/frontend/gewitterradar.js`;
  - `dashboard/dist/gewitterradar.js`.
- Die drei Dateien müssen bytegleich bleiben.
- `#map-display-control` besitzt innerhalb der Karte dauerhaft den höchsten z-index.
- Standortsteuerung wird im Vollbild tatsächlich verschoben und anschließend restauriert; keine zweite Standortlogik.
- Kompass bleibt dasselbe `#compass-instrument`.
- Medaillon ist ein Vollbild-Overlay aus den geschützten produktiven Medaillon-/Pfeil-Assets und spiegelt die normale Trendklasse.
- Warnsystem-Simulation gilt nur bei explizitem Helper-Zustand `on` als aktiv.

## Testdateien

- `scripts/verify-v409-map-display.mjs`;
- `scripts/test-v409-map-display.cjs`;
- bestehende Shared-Frontend-, Integration-, About-, Diagnose- und Hi-Res-Gates.

Der V4.09-Browsertest deckt Dashboard und Integration für Desktop, iPad und Android ab.

## Release-/History-Dokumentation

Aktualisiert bzw. neu:

- `CHANGELOG.md`;
- `docs/HISTORY.md`;
- `docs/ROADMAP.md`;
- `docs/MILESTONES.md`;
- `docs/V4_09_03_FULLSCREEN_CONTROLS.md`;
- `docs/RELEASE_NOTES_V4_09_03_TEST.md`;
- sichtbare bilinguale Release History im Frontend;
- dieses Handoff.

V4.09.02-Dokumente sind als historischer/superseded Stand markiert und dürfen nicht als aktiver Fortsetzungspunkt verwendet werden.

## Nicht nebenbei verändern

- V4.08 FINAL;
- Clusteralgorithmen/-profile;
- Radien/Aura;
- Ortssuche/gespeicherte Orte;
- About/Widmung;
- Hilfe;
- Diagnosevertrag;
- Hi-Res-/Masterbestand;
- Helper-IDs;
- Kompass- oder Medaillon-Grunddesigns.

## Reale Abnahme – nächster Schritt

1. Desktop Vollbild.
2. Layer-Control anklicken, auch wenn Kompass/Medaillon darüber positioniert wurden.
3. Standort oben rechts öffnen und bedienen.
4. Kompass ein/aus und Dragging.
5. Medaillon ein/aus und Dragging.
6. Kompassgröße visuell beurteilen.
7. Simulation AUS → keine Testschaltflächen.
8. Simulation EIN → Testschaltflächen vorhanden.
9. Android wiederholen.
10. iPad/iPad Pro wiederholen.
11. separates Kartenfenster prüfen.
12. Rückkehr auf Standard/Groß und normale Hauptansicht kontrollieren.

Erst nach ausdrücklicher realer Abnahme: Promotion/PR-Finalisierung, PRE-MERGE-Snapshot, Merge, vollständige Post-Merge-Gates, Golden Master, Tag/Release gemäß kanonischem Releaseprozess.
