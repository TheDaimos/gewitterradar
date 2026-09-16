# Gewitterradar – geschützter Diagnosevertrag ab V4.07.56

## Status

Der Diagnosemodus von Gewitterradar wurde mit V4.07.56 auf realen Geräten abgenommen. Er ist ab diesem Stand eine **dauerhaft geschützte Produktfunktion** und kein vorübergehendes Entwickler-Hilfsmittel.

Änderungen, Vereinfachungen, Entfernungen oder semantische Abschwächungen dieses Funktionsumfangs benötigen eine ausdrückliche Benutzerentscheidung. Refactoring, Cleanup, Dateiverkleinerung, UI-Umbau oder fehlende aktuelle Nutzung sind keine Freigabe.

Der abgenommene Quellstand ist im Contract-Manifest `tests/contracts/diagnostic-contract-v4.07.56.json` festgeschrieben. Vollständige V4.07.56-Quellidentität:

- Datei: `gewitterradar-v4.07.56.js`
- Größe: `1.955.141 Bytes`
- SHA256: `249485f4bcf68c9b23b821cae9b507030ae09cff5a56f7e28d3d7f3b02eb4a1a`

## Verbindliches Inventar

### Master-Diagnosemodus

- Start/Ende über den vorhandenen Diagnose-Schalter.
- Pinker Master-Rahmen zeigt einen aktiven Diagnosemodus eindeutig an.
- Diagnose-Konsole bleibt bei aktivem Diagnosemodus erreichbar und kann minimiert/maximiert werden.
- Die Konsole bleibt verschiebbar; Pointer Events/Pointer Capture und Viewport-Clamping bleiben erhalten.
- Diagnosedarstellung/Childtools können ausgeblendet werden, **ohne** laufende Simulationen oder Zustände zu beenden.
- Ausblenden und Beenden sind zwei verschiedene Zustände und dürfen nicht zusammengelegt werden.
- Das Beenden des Master-Diagnosemodus ist ein Hard-Stop für sämtliche Childtools und Simulationen.

### Virtuelles Gewitter

Pflichtfunktionen:

- AUS
- BEOBACHTUNG
- GEWITTER
- GEFAHR
- GESAMT
- 1–5 deterministische Zellen
- EXTREM zur reproduzierbaren Auslösung der vorhandenen produktiven Extrem-/Violett-Logik
- normale Umschaltung `Gruppiert ↔ Einzelblitze`
- synthetische Treffer durchlaufen die normale Produktpipeline; keine eigene Diagnose-Ersatzdarstellung
- keine Home-Assistant-Fake-Entitäten, keine Änderung an Blitzortung, keine Recorder-Persistenz
- Beenden entfernt alle synthetischen Ereignisse und setzt Zellzahl/EXTREM zurück

Die Simulation darf vorhandene Produktionsschwellen für Cluster/Extremaktivität nicht überschreiben, sondern muss die existierende Produktlogik gezielt anregen.

### Medaillon-Diagnose

Die fünf direkt abgenommenen Presets sind verpflichtend:

- LEER
- PFEIL
- TREND
- FREEZE
- NORMAL

Zusätzlich geschützt:

- Pfeil EIN/AUS
- Animation EIN/AUS
- Freeze EIN/AUS
- statische Winkel 0°, 45°, 90°, 180°, 270°
- Center/Pivot/Rotation-Diagnose
- Medaillon-Messwerte und Diagnosebericht

### Mess-, Geometrie- und Kalibrierwerkzeuge

Geschützt sind insbesondere:

- Kompass- und Medaillon-Kalibrierung
- Outer/Aperture/Eye-bezogene Diagnosepfade
- Center-/Achsen-/Diagonalen-/Baseline-Overlays
- Padding/Margin/Spacing/Safe-/Overflow-/Parent-/Alignment-Prüfungen
- 360°- bzw. Kontur-/Rundheitsmessungen, soweit im abgenommenen Stand vorhanden
- Rundheit/Ovalität, RMS/Max-Abweichung, Confidence/Source-/Runtime-/Rendered-Informationen
- Panel-Geometrietabelle
- Auswahl und JSON-Ausgabe
- Diagnose-Snapshot/Gesamtdiagnose
- Performance-Test

### Sprache

Der Diagnosemodus einschließlich virtuellem Gewitter bleibt im etablierten 19-Sprachen-Umfang verfügbar. Ein fehlender Diagnose-Sprachblock ist ein Regressionfehler.

## Schutz vor unbeabsichtigter Beschädigung

`scripts/verify-diagnostic-contract.mjs` ist ein fail-closed Contract-Test. Er prüft:

1. die unveränderliche V4.07.56-Acceptance-Identität im Contract-Manifest einschließlich Größe und SHA256;
2. das verpflichtende Diagnoseinventar;
3. Hard-Stop-Verhalten und Trennung von Ausblenden/Beenden;
4. virtuelles Gewitter, 1–5 Zellen und EXTREM;
5. Medaillon-Presets und Detailsteuerung;
6. Kalibrier-/Mess-/Exportwerkzeuge;
7. die 19 Diagnose-Sprachvarianten;
8. aktuelle Produktdateien ab V4.07.56, sobald diese die kanonische Frontend-Linie darstellen.

`.github/workflows/diagnostic-contract.yml` führt diese Prüfung bei relevanten Push-/Pull-Request-Änderungen aus.

Ein fehlschlagender Diagnosevertrag blockiert Freeze, Merge und Release.

## Änderungsregel

Eine geplante Änderung am Diagnosemodus muss vor Umsetzung explizit klären, ob sie den geschützten Vertrag verändert. Eine absichtliche Vertragsänderung erfordert:

1. ausdrückliche Benutzerfreigabe;
2. Aktualisierung dieses Dokuments;
3. Aktualisierung des Contract-Tests;
4. erneute Geräte-/Funktionsabnahme der betroffenen Diagnosebereiche;
5. Dokumentation im Changelog/Release-Verlauf.

Ohne diese Schritte gilt der V4.07.56-Vertrag unverändert weiter.
