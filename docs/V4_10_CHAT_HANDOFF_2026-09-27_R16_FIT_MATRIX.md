# Gewitterradar V4.10.02 – Chatübergabe R16 / Pfeil-Auge-Fit-Matrix

Stand: 2026-09-27

## 1. Repository / Branch / DRA

Kanonisches Repository:

`TheDaimos/gewitterradar`

Arbeitszweig:

`feature/v4.10.02-modularization`

Aktueller Feature-Head:

`87a7e46be7371cdf0bdc9cdc20e5e7a5aee34505`

Commit:

`test: include fit source assets in diagnostic artifact`

DRA-Verteilzweig:

`deploy/dev`

Aktueller DRA-Stand:

`ba3083c7d3ace5a986aeabe9327f1f5128122a59`

Commit:

`fix: close R16 module manifest asset path`

Der DRA-Stand ist der vollständig geprüfte R16-Produktkandidat. Der Feature-Zweig liegt aktuell drei reine Test-/Workflow-/Dokumentationsschritte vor DRA:

1. `802728fbdbd1df268bc55e3dedb7f795af84468e` – `docs: record completed R16 DRA promotion`
2. `36f231b8da22827963666b3765beb0c88b486701` – `test: generate full medallion arrow fit matrix evidence`
3. `87a7e46be7371cdf0bdc9cdc20e5e7a5aee34505` – `test: include fit source assets in diagnostic artifact`

Diese drei Schritte ändern nicht die ausgelieferte R16-Laufzeitlogik. Sie ergänzen Dokumentation, CI-Matrixgenerierung und Diagnoseartefakte.

Der aktuelle Feature-Head ist mit den fünf Hauptprüfungen grün:

- Validate shared Gewitterradar frontend → success
- Validate Gewitterradar integration → success
- Diagnostic contract → success
- Source archive contract → success
- Hi-Res asset retention → success

Kein Merge nach `main` und kein Release ohne ausdrückliche Freigabe.

---

## 2. R16 Produktstand

Build:

`V4.10.02-MODULAR-DEV-R16-2026-09-27`

Modulsatz:

`F48F-1C26`

Stabiler Kern-Laufzeitcache:

`41002r13`

R16 Feature-Cache:

`41002r16`

Relevante Modulstände:

- `core.manifest 1.2.21`
- `fullscreen.map-display 1.0.16`
- `instruments.medallion-designs 1.2.0`
- `diagnostics.cockpit 1.2.0`

R16 erweitert die Medaillon-Diagnose um eine echte Pfeil/Auge-Geometriedatenbank.

Schema:

`gewitterradar.medallion-arrow-geometry.v1`

Browser-Speicher:

`gewitterradar:v41002:medallion-arrow-fit-db`

Picker-Diagnoseexport:

`gewitterradar.picker-diagnostic.v2`

---

## 3. Ziel der neuen Geometriedatenbank

Die Kalibrierung wird in drei Datenebenen getrennt.

### Medaillonprofil je `trend_XX`

Gespeichert werden u. a.:

- Laufzeitasset-Breite/-Höhe
- gemessener Augen-/Aperturmittelpunkt
- `radiusX`
- `radiusY`
- horizontale/vertikale/diagonale Durchmesser
- Fit-/Residualwert
- Erkennungsqualität / Confidence
- Messverfahren

Die Diagnose soll nicht davon ausgehen, dass alle Medaillonaugen trotz identischer Canvasgröße gleich groß sind.

### Pfeilprofil je `arrow_XX`

Gespeichert werden u. a.:

- Laufzeitasset-Breite/-Höhe
- echter Drehpunkt
- sichtbare Alpha-Grenzen
- sichtbare Pixelanzahl
- maximale sichtbare Entfernung vom Drehpunkt
- Messverfahren

Maßgeblich ist die sichtbare Alpha-Geometrie, nicht die transparente Bildfläche.

### Fit-Datensatz je `trend_XX::arrow_XX`

Gespeichert werden u. a.:

- aktuelle Pfeil/Auge-Ratio
- `recommendedUniformScale`
- `eyeToArrowScaleRatio`
- `contained360`
- `minClearancePx`
- `maxOverflowPx`
- `worstAngleDeg`
- Winkelschrittweite
- Sicherheitsreserve

Die Ratio ist dimensionslos und soll später auch bei variabler Medaillongröße im Vollbild weiterverwendet werden können.

---

## 4. R16 Diagnosewerkzeuge

Im Medaillon-Picker gibt es zusätzlich:

### FIT-MATRIX

Erzeugt die vollständige Matrix:

- 28 Medaillons `trend_01` bis `trend_28`
- 18 Pfeile `arrow_00` bis `arrow_17`
- insgesamt 504 Kombinationen

R16-Grundeinstellung:

- Rotationsprüfung über den vollen 360°-Bereich
- 5° Winkelschritte
- 4 % Sicherheitsabstand zum erkannten Augenrand
- Alpha-Schwelle 8

Die Matrixberechnung läuft in kleinen Blöcken und gibt zwischen mehreren Fits an den Browser zurück, damit iPad/Android während der Messung weiter rendern können.

### FIT-JSON

Exportiert die komplette persistente Geometriedatenbank in einer Datei.

Ein vollständiger realer Export muss mindestens enthalten:

- `generatedAt != null`
- 28 Medaillonprofile
- 18 Pfeilprofile
- `fitCount = 504`
- `expectedFitCount = 504`
- 504 echte Pairwise-Fit-Datensätze

### Picker JSON / CSV / Kopieren

Der Picker-Export wurde auf v2 erweitert und enthält zusätzlich:

- aktive `designId`
- aktive `arrowDesignId`
- Datenbankschema
- tatsächliche und erwartete Fit-Anzahl
- aktuellen Fit-Schlüssel
- aktuellen Fit-Datensatz, falls bereits vorhanden

Der Zwischenablagepfad wurde für HA-WebViews robuster gestaltet:

- synchroner Legacy-/Selection-Copy-Pfad zuerst
- moderne Clipboard-API als Rückfall
- Fokus wird nach dem temporären Textfeld wiederhergestellt

Die reale WebView-/iPad-Abnahme des Kopieren-Fehlers bleibt erforderlich.

---

## 5. Auswertung der vom Nutzer gelieferten neuen Analysedaten

Nutzerdatei:

`medaillion+picker.zip`

Inhalt:

- 28 JSON-Dateien
- vollständig `trend_01` bis `trend_28`
- Picker-Diagnoseschema v2
- in allen Dateien aktive Pfeil-ID `arrow_00`

Wichtiger Befund:

Diese 28 Dateien sind **keine vollständige FIT-MATRIX**.

In den gelieferten Dateien ist die Fit-Datenbank noch leer:

- `fitCount = 0`
- `expectedFitCount = 504`
- `currentFit = null`
- `geometryDatabase.generatedAt = null`
- `measurement.eyeArrowFit.status = PENDING`

Damit beweisen die Dateien:

- Picker-v2 läuft
- alle 28 Medaillon-IDs sind exportierbar
- die aktive Pfeil-ID wird korrekt mitgeführt
- das neue Datenbankschema ist im Export vorhanden

Sie enthalten aber **noch keine realen Pfeil/Auge-Ratio- oder Skalierungsdaten**.

### Wichtigste Regel

`expectedFitCount = 504` bedeutet nur, dass die Anwendung die Sollgröße der Matrix kennt.

Es ist **kein Nachweis**, dass 504 Kombinationen vermessen wurden.

Ein real vollständiger Datensatz benötigt tatsächlich 504 gespeicherte Fit-Datensätze und einen gesetzten Generierungszeitpunkt.

### Was vom Nutzer noch benötigt wird

Es werden **keine 504 Einzeldateien, keine 504 Screenshots und keine zusätzlichen CSVs** benötigt.

Benötigt wird genau:

1. R16 über DRA verwenden.
2. Medaillon-Picker / Diagnose öffnen.
3. `FIT-MATRIX` starten.
4. Bis zum vollständigen Abschluss warten.
5. `FIT-JSON` drücken.
6. Die eine erzeugte vollständige Fit-JSON-Datei im Chat hochladen.

Diese eine Datei soll anschließend vollständig analysiert werden.

---

## 6. Was bei der realen FIT-JSON-Auswertung geprüft werden muss

Nach Upload des vollständigen FIT-JSON:

### Vollständigkeit

- Schema korrekt?
- `generatedAt` gesetzt?
- 28 Medaillonprofile?
- 18 Pfeilprofile?
- 504 Fits?
- keine doppelten oder fehlenden Schlüssel?
- exakt `trend_01::arrow_00` bis alle vorgesehenen Kombinationen?

### Medaillonaugen

Für jedes `trend_XX` prüfen:

- `radiusX`
- `radiusY`
- vier Durchmesser
- Mittelpunkt
- Confidence
- Residual / Fit-Qualität

Ausreißer und LOW/MEDIUM-Confidence separat kennzeichnen.

### Pfeile

Für jedes `arrow_XX` prüfen:

- Alpha-Bounds
- Drehpunkt
- maximale Ausdehnung
- offensichtliche Asset-/Alpha-Ausreißer

### 504 Fits

Auswerten:

- Min/Max/Mittelwert `arrowToEyeRatioCurrent`
- Min/Max/Mittelwert `recommendedUniformScale`
- Anzahl `contained360 = true/false`
- größte Überstände
- kleinste Sicherheitsabstände
- häufigste / kritischste `worstAngleDeg`
- restriktivste Kombinationen
- großzügigste Kombinationen
- Pfeile, die in vielen Medaillons herunter skaliert werden müssen
- Medaillons mit systematisch kleinen/großen Augen

### Plausibilisierung

Besonders real prüfen:

- kleinstes erkanntes Auge
- größtes erkanntes Auge
- breitester / längster Pfeil
- schmaler Pfeil
- mindestens eine Kombination mit niedriger empfohlener Skalierung
- mindestens eine Kombination mit hoher Reserve

Die Diagnose darf Messdaten erzeugen, aber die Produktdarstellung soll die Fit-Ratios **noch nicht automatisch anwenden**, bevor die reale Matrix geprüft und freigegeben wurde.

---

## 7. Synthetische CI-Fit-Matrix auf dem Feature-Zweig

Nach dem DRA-Produktkandidaten wurde im Feature-Zweig zusätzlich eine Offline-/CI-Paritätsmessung eingeführt:

`scripts/generate-medallion-arrow-fit-matrix.cjs`

Sie verarbeitet die tatsächlichen Runtime-Assets unter `frontend/assets` und erzeugt:

- 28 Medaillonprofile
- 18 Pfeilprofile
- 504 Fit-Datensätze
- vollständige Datenbank JSON
- Summary JSON
- Matrix CSV

Ausgabe:

`artwork/acceptance/medallion-arrow-fit/`

Dateien:

- `gewitterradar-medallion-arrow-fit-db.json`
- `gewitterradar-medallion-arrow-fit-summary.json`
- `gewitterradar-medallion-arrow-fit-matrix.csv`

Die Shared-Frontend-CI erzeugt diese Daten und lädt sie im Artefakt `shared-frontend-browser-evidence` zusammen mit den zugrunde liegenden Medaillon- und Pfeilassets hoch.

Provenance der CI-Matrix:

`mode: ci-offline-r16-parity`

Wichtig:

Die CI-Matrix ist ein **synthetischer/offline Paritätsnachweis aus den echten Runtime-Assets**.

Sie ersetzt nicht die reale FIT-MATRIX im Home-Assistant-/WebView-Kontext.

Nächster sinnvoller Vergleich:

**reale FIT-JSON aus HA vs. CI-Fit-Datenbank**.

Abweichungen zwischen beiden Messwegen müssen erklärt werden, bevor die Daten zur Laufzeitskalierung verwendet werden.

---

## 8. Dev-Tools-Repository – neue Diagnosewerkzeuge dokumentiert

Repository:

`TheDaimos/home-assistant-dev-toolkit`

Branch:

`main`

Aktueller dokumentierter Stand:

`6e3334fe86701c019bc3b34cdda2b4754ad3a813`

Primäre neue Dokumentation:

`docs/ROTATING_OVERLAY_APERTURE_FIT_DIAGNOSTICS.md`

Die Diagnose wurde dort bewusst projektneutral dokumentiert:

- Apertur-/Augenmessung
- sichtbare Alpha-Geometrie rotierender Overlays
- Drehpunkt
- vollständiger Rotationsbereich
- dimensionale unabhängige Ratio
- empfohlene Skalierung
- Freiraum/Überstand
- ungünstigster Winkel
- Target × Overlay Matrix
- Browser-freundliche Batch-/Yield-Verarbeitung
- Persistenz/Export
- Vollständigkeitsregel tatsächliche Fits vs. erwartete Fits
- Trennung Diagnoseerzeugung vs. Produktanwendung
- WebView-Zwischenablage
- Hard-off-/Lifecycle-Regeln
- synthetische und reale Abnahmekriterien

Zusätzlich wurden die Toolkit-Routing-/Referenzdokumente aktualisiert, u. a.:

- `AGENTS.md`
- `START_HERE.md`
- `README.md`
- `docs/TOOL_CATALOG.md`
- `docs/PROJECT_MEMORY.md`
- `docs/TOP_LAYER_INSTRUMENT_DIAGNOSTICS.md`
- `docs/ACCEPTANCE_CHECKLIST.md`
- `src/README.md`
- `tests/README.md`
- `docs/ARCHITECTURE.md`
- `CHANGELOG.md`

Projekt-spezifische Gewitterradar-IDs, Assetnamen, Storage Keys und Exportnamen bleiben weiterhin im Gewitterradar-Repo und werden nicht in Shared Core kopiert.

---

## 9. Relevante Gewitterradar-Dokumente

Vor Fortsetzung lesen:

1. `PROJECT_DEFAULTS.md`
2. `docs/V4_10_MODULARISIERUNG_SCHLACHTPLAN.md`
3. `docs/V4_10_CHAT_HANDOFF_2026-09-22.md`
4. `docs/V4_10_CHAT_HANDOFF_2026-09-26_R13_MEDALLIONS.md`
5. diese Datei
6. `docs/MEDALLION_CATALOG.md`
7. `docs/MEDALLION_ARROW_GEOMETRY_DB.md`

Für Shared Diagnostics zusätzlich:

`TheDaimos/home-assistant-dev-toolkit/docs/ROTATING_OVERLAY_APERTURE_FIT_DIAGNOSTICS.md`

---

## 10. Harte Regeln / Schutz

- Bestehende `trend_XX`-IDs nie umnummerieren.
- Bestehende `arrow_XX`-IDs nie umnummerieren.
- `arrow_00` bleibt der geschützte bisherige Standardpfeil.
- Hi-Res-Originale bleiben geschützte Masterquellen.
- Laufzeitderivate ersetzen keine Masterquellen.
- Die neuen Pfeil-Hi-Res-Originale erst nach finaler Auswahl ins Master-Repository übernehmen.
- DRA ist Pflicht für reale V4.10-Abnahmen.
- Implementieren → prüfen → CI → korrigieren → Schlachtplan aktualisieren → DRA.
- Reale Checkboxen erst nach realem Nutzerbericht abhaken.
- Diagnose-Fit-Daten nicht automatisch auf die Produktdarstellung anwenden, bevor reale Matrix und Sichtprüfung freigegeben sind.
- Kein Merge nach `main`, kein Release ohne ausdrückliche Freigabe.

---

## 11. Nächste Schritte im neuen Chat

1. Bootstrap Daimos laden und Branchzustand erneut verifizieren.
2. Prüfen, ob Feature-Head und DRA seit dieser Übergabe verändert wurden.
3. Die vom Nutzer bereits gelieferten 28 Picker-v2-JSONs **nicht** als vollständige Fit-Datenbank behandeln.
4. Nutzer soll einen **FIT-MATRIX-Lauf** durchführen und danach **FIT-JSON** hochladen.
5. Vollständige reale FIT-JSON nach Abschnitt 6 analysieren.
6. Reale Ergebnisse gegen die CI-Paritätsmatrix unter `artwork/acceptance/medallion-arrow-fit/` vergleichen.
7. Erst danach entscheiden, welche Ratio-/Scale-Werte als freigegebene Produktmetadaten übernommen werden.
8. Kopieren-Funktion real im HA-WebView/iPad prüfen und nur bei tatsächlichem Zwischenablageinhalt als bestanden markieren.
9. Schlachtplan nach jeder abgeschlossenen Schleife aktualisieren.
10. Keine Veröffentlichung/Merge ohne ausdrückliche Nutzerfreigabe.
