# Chat-Übergabe – Gewitterradar V4.10.02 / R20 – Medaillon-Diagnose-Akkordeon

Stand: 2026-09-28  
Repository: `TheDaimos/gewitterradar`  
Arbeitszweig: `feature/v4.10.02-modularization`  
DRA-Zweig: `deploy/dev`  
Nicht nach `main` zusammenführen und keine Veröffentlichung ohne ausdrückliche Freigabe.

## Verbindliche Arbeitsweise

- Zuerst `PROJECT_DEFAULTS.md` lesen.
- Danach diesen Handoff und den Schlachtplan vollständig lesen:
  - `docs/V4_10_MODULARISIERUNG_SCHLACHTPLAN.md`
  - `docs/MEDALLION_ARROW_GEOMETRY_DB.md`
  - `docs/R18_REAL_FIT_MATRIX_ACCEPTANCE_2026-09-27.md`
- Schlachtplan-Schleife beibehalten: implementieren → prüfen → CI → korrigieren → Schlachtplan aktualisieren → DRA.
- DRA ist Pflicht für die reale Abnahme in Home Assistant.
- Realgeräte-Abnahmen nie selbst abhaken; nur nach Rückmeldung des Nutzers.
- `arrow_00` bleibt geschützter Standard.
- `trend_XX` und `arrow_XX` niemals umnummerieren.
- Keine Fit-/Kalibrierwerte automatisch auf die Produktdarstellung anwenden, bevor dies ausdrücklich freigegeben wurde.
- Hi-Res-Master niemals automatisch löschen.
- Der Nutzer arbeitet allein; keine Team-Formulierungen.
- Sprache: Deutsch, möglichst kein Denglisch.

## Aktueller technischer Stand

Aktiver Build:

`V4.10.02-MODULAR-DEV-R20-2026-09-28`

Kennungen:

- Produktversion: `4.10.02`
- Runtime-Revision: `41002r13`
- Feature-Cache: `41002r20`
- Modul-Set: `D31A-5E90`
- `core.manifest`: `1.2.26`
- `fullscreen.map-display`: `1.0.19`
- `diagnostics.cockpit`: `1.5.0`

Code-HEAD vor Erstellung dieser Übergabe:

`bcb4a54ced05beb2020cbec6d4a28aa3aa1d8650`

DRA-`deploy/dev` zeigt auf den geprüften R20-Kandidaten:

`372ae36d27b5ac503fd9ab37c7542d4284575ac9`

Für diesen DRA-Kandidaten sind die fünf zentralen GitHub-Actions-Workflows erfolgreich:

- Source archive contract
- Diagnostic contract
- Hi-Res asset retention
- Validate Gewitterradar integration
- Validate shared Gewitterradar frontend

Die Dokumentations-Commits auf dem Feature-Zweig nach einem DRA-Kandidaten sind kein Grund, `deploy/dev` auf einen reinen Dokumentationsstand zu verschieben.

## R18 – Messparität abgeschlossen

Die R18-Real-/CI-Parität wurde vollständig bestanden und ist dokumentiert in:

`docs/R18_REAL_FIT_MATRIX_ACCEPTANCE_2026-09-27.md`

Wesentliche Abnahme:

- 28/28 Medaillonprofile numerisch identisch.
- 18/18 Pfeilprofile geometrisch identisch; nur Gleitkomma-Rundung im letzten Bit bei wenigen `maxRadius`-Werten.
- 504/504 Fits fachlich identisch.
- maximale Scale-Abweichung ca. `3.33e-16`.
- maximale Ratio-Abweichung ca. `4.44e-16`.
- maximale Overflow-Abweichung ca. `3.91e-14`.
- `worstAngleDeg`-Unterschiede bei Gleichständen sind kein Geometriefehler.
- automatische Produktanwendung der Fit-Skalierung bleibt gesperrt.

## R19 – Center-aware Geometrie/Kalibrierung

R19 führte die center-aware Fit-/Kalibrierungslogik weiter. Die Datenbank ist inzwischen Schema v2:

`gewitterradar.medallion-arrow-geometry.v2`

Wichtige Speicherschlüssel:

- Fit-Datenbank: `gewitterradar:v41002:medallion-arrow-fit-db-v2`
- visuelle Pfeilkalibrierung: `gewitterradar:v41002:medallion-arrow-visual-calibration-v2`
- Augenreferenzen: `gewitterradar:v41002:medallion-eye-calibration-v1`

Der zuletzt vom Nutzer gelieferte Diagnoseexport war:

`gewitterradar_medallion_picker_trend_05_arrow_03_2026-09-28T05-44-31-743Z.json`

Darin:

- Build: `V4.10.02-MODULAR-DEV-R19-2026-09-27`
- Medaillon: `trend_05`
- Pfeil: `arrow_03`
- statischer Winkel: 45°
- manuelle Augenreferenz:
  - X 50.15 %
  - Y 47.05 %
  - Radius 22.05 %
  - Durchmesser 44.10 %
- manuelle Pfeilskalierung: 57.5 %
- effektive Pfeilbreite: 34.308749825 %
- Pfeilzentrum weiter auf Basiswert:
  - X 50.012238 %
  - Y 50.452396 %
- Fit `trend_05::arrow_03` war in diesem Export `PENDING`.
- Geometriedatenbank im Browser: 0/504, weil die R19-Matrix dort noch nicht neu gemessen worden war.

Diese Werte sind Diagnose-/Kalibrierungsdaten und **keine automatisch freigegebene Produktkalibrierung**.

## Aktuelle Nutzeranforderung – Diagnosefenster kompakter

Der Nutzer zeigte das Medaillon-Diagnosefenster mit sehr langer vertikaler Liste und bat darum, die neuen Diagnoseeinstellungen minimierbar zu machen, damit das Medaillon optisch besser im Fokus bleibt.

Gewünschte Bedienung:

- Diagnosegruppen als einklappbare Akkordeons.
- Medaillon selbst dauerhaft gut sichtbar.
- Standardmäßig kompakt.
- Nur ein Diagnosebereich gleichzeitig geöffnet.
- Letzter geöffneter Bereich innerhalb der Sitzung merken.
- Auf-/Zuklappen darf keinerlei Mess-, Kalibrier- oder Fitdaten verändern.
- Optisch passend zum bestehenden Gewitterradar-Akkordeon/Chevron-Konzept.

## R20 – bereits umgesetzt

R20 setzt diese Anforderung als reine Oberfläche um; Geometrie und Kalibrierlogik bleiben unverändert.

Im Medaillon-Picker existieren jetzt vier `<details>`-Gruppen:

1. `display` – Darstellungs-/Diagnosesteuerung
2. `eye` – **Auge · Referenzkreis pro Medaillon**
3. `arrow` – **Pfeil · Größe & Mittelpunkt kalibrieren**
4. `fit` – **Fit-Matrix & Export**

Technische Umsetzung in:

`frontend/modules/fullscreen/map-display.js`

sowie synchronisiert unter:

`custom_components/gewitterradar/frontend/modules/fullscreen/map-display.js`

Kennzeichen:

`data-medallion-diagnostic-group="<gruppe>"`

Sitzungsspeicher:

`gewitterradar:v41002:medallion-diagnostic-accordion`

Verhalten:

- beim Öffnen des Pickers sind alle Gruppen geschlossen, sofern in derselben Sitzung keine Gruppe gemerkt wurde;
- beim Öffnen einer Gruppe werden alle anderen geschlossen;
- der zuletzt geöffnete Gruppenname wird in `sessionStorage` gespeichert;
- wird die aktive Gruppe geschlossen, wird der Sitzungseintrag entfernt;
- die Mess-/Kalibrieraktionen und deren `data-*`-Selektoren bleiben unverändert;
- das Medaillon bleibt außerhalb der Akkordeon-Körper und damit permanent sichtbar.

DRA-Provenienz kennzeichnet R20 ausdrücklich als:

`R20 compact medallion diagnostic accordions; medallion remains visually in focus`

mit:

- `productBehaviorUnchanged: true`
- `fitDataAutoApply: false`
- `visualCalibrationAutoAppliesToProduction: false`
- `manualEyeReferencesAutoApply: false`

## Nächste reale Abnahme

Der nächste Chat soll **nicht erneut implementieren**, sondern zuerst den aktuellen R20-DRA-Stand verproben lassen.

Vorgehen:

1. In DRA prüfen, dass `deploy/dev` R20 anbietet.
2. R20 installieren.
3. Home-Assistant-Frontend vollständig neu laden.
4. Medaillon-Picker öffnen.
5. Prüfen:
   - Medaillon bleibt sofort sichtbar und im Fokus.
   - Diagnosebereiche sind kompakt.
   - `Darstellung`, `Auge`, `Pfeil`, `Fit-Matrix & Export` lassen sich einzeln auf-/zuklappen.
   - Öffnet eine Gruppe, schließt die vorherige.
   - Schließen/Öffnen beeinflusst keine Reglerwerte.
   - Wechsel zwischen Medaillons/Pfeilen funktioniert unverändert.
   - Auge-Kreis ziehen und Radiusgriff funktionieren unverändert.
   - Pfeil-Größe/X/Y-Regler funktionieren unverändert.
   - JSON/CSV/FIT-MATRIX/FIT-JSON bleiben erreichbar.
   - kein unerwünschter Scroll-/Overflow-Effekt auf Desktop/iPad/Android.
6. Erst nach Nutzerfeedback eventuelle UI-Korrekturen durchführen.
7. Reale Abnahmepunkte im Schlachtplan erst nach Nutzerbestätigung abhaken.

## Wichtig für die weitere Kalibrierung

Die Akkordeonänderung ist nur eine Bedienungsverbesserung. Nicht mit der eigentlichen Produktkalibrierung vermischen.

Die Reihenfolge bleibt:

1. Augenreferenzen pro Medaillon prüfen/abnehmen.
2. Danach vollständige 28 × 18 = 504 Fit-Matrix neu berechnen.
3. Ergebnis exportieren und analysieren.
4. Optional paarweise visuelle Korrekturen prüfen.
5. Erst nach ausdrücklicher Freigabe entscheiden, welche Werte in die sichtbare Produktdarstellung übernommen werden.

Keine automatische Skalierung oder Mittelpunktverschiebung in Produktion aktivieren.

## Relevante Dateien

- `PROJECT_DEFAULTS.md`
- `docs/V4_10_MODULARISIERUNG_SCHLACHTPLAN.md`
- `docs/MEDALLION_CATALOG.md`
- `docs/MEDALLION_ARROW_GEOMETRY_DB.md`
- `docs/R18_REAL_FIT_MATRIX_ACCEPTANCE_2026-09-27.md`
- `frontend/gewitterradar.js`
- `frontend/module-manifest.js`
- `frontend/modules/fullscreen/map-display.js`
- `frontend/modules/diagnostics/cockpit.js`
- `frontend/modules/instruments/medallion-designs.js`
- `custom_components/gewitterradar/dra-deployment-provenance.json`

## Übergabe-Kurzfassung

R18 Messparität ist abgeschlossen. R19 brachte center-aware Fit/Kalibrierung. Der Nutzer wollte anschließend die lange Medaillon-Diagnoseliste minimierbar haben. R20 hat diese Oberfläche bereits in vier einklappbare, gegenseitig ausschließende Diagnosegruppen zerlegt und ist über DRA `deploy/dev` bereitgestellt. Nächster Schritt ist die reale R20-Oberflächenabnahme in Home Assistant; **nicht** erneut implementieren und **keine** Produktkalibrierung automatisch aktivieren.
