# Gewitterradar V4.07.49 – Freeze / Handoff

Stand: 2026-09-16
Status: **getesteter Kandidat, noch nicht als Release freigegeben**

## Verbindliche Identität des lokal getesteten Kandidaten

- Datei: `gewitterradar-v4.07.49.js`
- Größe: **1,931,602 Byte**
- SHA-256: **`fa12af85c5d82d46cc853f649c08fae5986d7a2f5e14182aa4b5e52a6fd0fec8`**
- Komplettpaket: `Gewitterradar_V4.07.49_complete.zip`
- ZIP SHA-256: **`4eb17b5b3297f91f06dc9162a35b0b3b94cdb537f04cedf4c2400a8df6f9b36a`**

## Wichtige Herkunft

Der zuletzt vollständig in Git/CI verankerte Vorgänger ist V4.07.40:

- Branch: `feature/v4.07.40-target-readability`
- Commit: `b5dd10428fec279873d2a28b9d8441fae4ef932f`
- JS: 1,820,450 Byte
- SHA-256: `176252737ed5ddaf66c701296cf67c5fb984160b0da6878d527a4ac3caa3de0e`
- Workflow-Run: 34972826127
- vollständiges V40-Artefakt SHA-256: `39670463978c12a45c33140eae917b6d04edc8c6512886ac583ed4123b977f84`

Die Zwischenstände V4.07.41–V4.07.49 wurden im laufenden Abnahmechat als lokale Testartefakte erzeugt. Sie waren zum Zeitpunkt dieses Handoffs noch nicht vollständig als reguläre Commit-/CI-Kette in Git synchronisiert. **Deshalb darf kein älterer Branchname als Beweis für V4.07.48 oder V4.07.49 gewertet werden.**

## V4.07.49 gegenüber V4.07.48

1. Korrektur der mobilen Breitenberechnung der Weltweiten Ortssuche, damit der rechte metallische Außenrahmen auf Android nicht am Bildschirmrand angeschnitten wirkt.
2. Wiederherstellung direkter Medaillon-Diagnoseschalter für:
   - `LEER`
   - `PFEIL`
   - `TREND`
   - `FREEZE`
   - `NORMAL`
3. Die vorhandene Medaillon-Kalibrierungs-/Messlogik soll nicht ersetzt werden.

## Noch nicht abgenommen

V4.07.49 ist **noch kein finaler Release-Stand**. Vor jeder Release-Promotion muss der Benutzer insbesondere prüfen:

1. Android-Rahmen der Weltweiten Ortssuche;
2. vollständigen Diagnosemodus;
3. Medaillon-Zustände `LEER / PFEIL / TREND / FREEZE / NORMAL`;
4. sämtliche übrigen Diagnosewerkzeuge;
5. Geräte-/Regressionstests.

## Schutzregel Diagnosemodus

Nach ausdrücklicher Bestätigung des Benutzers, dass der Diagnosemodus vollständig ist, muss sein kompletter Funktionsumfang als geschützter Projektbestandteil behandelt werden:

- vollständige Inventarisierung und Dokumentation;
- Regressionstests gegen fehlende Diagnoseelemente;
- CI-Vollständigkeitsprüfung;
- Schutzkommentare bzw. klar abgegrenzte Quelle/Modulstruktur;
- keine stillschweigende Entfernung einzelner Diagnosefunktionen;
- Medaillon-Diagnose und alle übrigen Diagnosewerkzeuge einschließen.

## Weltweite Ortssuche – akzeptierter visueller/funktionaler Umfang

- großer Premium-Globus;
- Premium-Lupe;
- Premium-Zielscheibe/Dart;
- Premium-Glühbirne;
- Premium-Info-Medaillon;
- Premium-X;
- metallischer Außenrahmen analog den bestehenden Gewitterradar-Menüs;
- Ort/PLZ sowie direkte Lat/Lon-Eingabe;
- `Übernehmen` und `★ Speichern`;
- Google-Maps-Hinweis: Koordinaten am Desktop per Rechtsklick/Kontextmenü kopieren;
- MapTiler Coordinates: `https://www.maptiler.com/tools/coordinates/`;
- Koordinatenbeispiel Lat/Lon: `53.837691, 9.956105`;
- Hilfe soll diese Informationen auch unter `Hilfe & Hinweise → Standort & gespeicherte Orte` enthalten.

## Artwork-Regel

Für die Premium-Grafiken der Ortssuche gilt:

- Hi-Res-Master im kanonischen Master-Repo sind die **einzige echte Wahrheit**;
- Runtime-Dateien sind nur abgeleitete Exporte;
- Änderungen immer zuerst am Hi-Res-Master durchführen und danach neu exportieren.

Zum Zeitpunkt dieses Handoffs ist ausdrücklich noch zu verifizieren, dass alle sechs neuen Premium-Hi-Res-PNG-Master tatsächlich im Repository unter `artwork/location-search/hires/` angekommen sind. Nicht behaupten, dies sei bereits vollständig erledigt, solange die Dateien nicht in Git sichtbar sind.

## Release-Reihenfolge

Erst nach technischer Abnahme:

1. 19 Sprachvarianten vollständig synchronisieren;
2. Release Notes;
3. `CHANGELOG.md`;
4. `docs/HISTORY.md`;
5. übrige relevante Dokumentation;
6. Prüfsummen und Paket-/Versionskonsistenz;
7. Dev-Toolkit um direkte Lat/Lon-Eingabe, Google Maps, MapTiler und die Standortarchitektur ergänzen;
8. finale Release-Gates und erst danach Freigabe/Merge.

`main` bleibt bis zur ausdrücklichen Freigabe unangetastet.

## V4.08

Die Cluster-/Zoom-/Altlastenplanung ist getrennt auf `planning/v4.08-cluster-zoom-and-cleanup` in `docs/V4_08_PLAN.md` gesichert. Sie darf den V4.07-Freeze nicht wieder öffnen.
