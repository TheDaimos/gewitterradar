# Gewitterradar V4.10.02 – Chat-Übergabe Modularisierung

**Fortgeschriebener Stand:** 2026-09-25  
**Projekt:** Gewitterradar  
**Repository:** `TheDaimos/gewitterradar`  
**Arbeitszweig:** `feature/v4.10.02-modularization`  
**Draft-PR:** #24 – `V4.10.02: modular frontend architecture`  
**DRA-Kanal:** `deploy/dev`

> Diese Datei ist ausschließlich die kompakte Chat-Übergabe.  
> Der verbindliche Detailstand, Haken, Testnachweise und Schleifen liegen nur in  
> `docs/V4_10_MODULARISIERUNG_SCHLACHTPLAN.md`.  
> Keine zweite Übergabe-/Statusdatei anlegen.

---

## 1. Startanweisung für den neuen Chat

Nicht aus altem Chatgedächtnis weiterarbeiten.

Zwingende Reihenfolge:

1. Repository `TheDaimos/gewitterradar` und PR #24 aktuell verifizieren.
2. `PROJECT_DEFAULTS.md` lesen.
3. `docs/V4_10_MODULARISIERUNG_SCHLACHTPLAN.md` **vollständig** lesen.
4. Danach diese bestehende Übergabe lesen.
5. Feature-Head, `deploy/dev` und CI neu prüfen.
6. Exakt am Abschnitt **NÄCHSTER SCHRITT** des Schlachtplans fortfahren.
7. Keine neue parallele Übergabe oder Statusdatei erstellen; diese Datei bei Bedarf fortschreiben.

Wenn der Benutzer sagt:

> „Schau in den Schlachtplan und führe ihn weiter fort.“

ist genau die genannte Schlachtplan-Datei gemeint.

---

## 2. Was bereits abgeschlossen ist

Die V4.10.02-Modularisierung besitzt weiterhin **22 erwartete Module**. M12/DRA ist vollständig real bestanden, einschließlich kompletter Modulbaum, Einzelmodul-Delta, Soll/Ist, Cache-/Mischstand, fehlendes/veraltetes Modul, realer Rollback auf V4.09 und Rückkehr auf V4.10.02.

M13 ist weit fortgeschritten. Bereits dauerhaft umgesetzt bzw. geprüft sind unter anderem:

- Scroll-/Akkordeonkorrekturen der Einstellungen,
- vollständige 19-Sprachen-Verträge,
- Module-&-Versionen-Ansicht,
- Radiuskaskade,
- rahmenloses Premium-Schließen-X,
- Vollbild-Cluster-Jump mit Infinity-Umschalter,
- Kompass-Picker mit **silbernen Retina-Chivron** und silberner Zähleranzeige,
- Medaillon-Picker analog zum Kompass mit **goldenen/Messing-Retina-Chivron**,
- Cache-/Runtime-Revision und Modulsatz-ID,
- Diagnose-/Golden-/Hi-Res-/Source-Archive-/Integrationsverträge.

Keine öffentliche V4.10-Freigabe, kein Merge nach `main` und kein Release ohne ausdrückliche Benutzerfreigabe.

---

## 3. Aktueller Produktkandidat R5

Der automatisiert vollständig geprüfte Produktkandidat ist:

`fe6fa77ab2d541ab04afc8f6a5ac3493275ce242`

Laufzeitidentität:

- Build: `V4.10.02-MODULAR-DEV-R5-2026-09-25`
- Runtime-Revision: `41002r5`
- Modulsatz-ID: `EA13-2B8B`
- `core.manifest 1.2.10`
- `core.base-context 1.0.3`
- `diagnostics.cockpit 1.1.1`
- `fullscreen.map-display 1.0.11`

Exakte CI dieses Produktkandidaten:

- Diagnostic contract #867 → **success**
- Source archive contract #468 → **success**
- Hi-Res asset retention #1349 → **success**
- Validate Gewitterradar integration #2130 → **success**
- Validate shared Gewitterradar frontend #2111 → **success**

Damit: **5/5 grün**.

`deploy/dev` wurde anschließend auf exakt diesen Commit gesetzt und der Vergleich als **identisch** verifiziert.

Wichtig: Nachfolgende reine Dokumentationscommits auf dem Featurezweig können dessen Head verändern. Für die reale DRA-Abnahme ist der oben genannte grüne Produktkandidat auf `deploy/dev` maßgeblich. Beim Start trotzdem alle Heads frisch prüfen.

---

## 4. Neue Kompass-/Medaillon-Auswahl

### Kompass

Die Kompassauswahl verwendet jetzt ausschließlich:

- silberne Retina-Chivron links/rechts,
- metallisch-silberne Zähleranzeige, z. B. `3 / 6`,
- rundes Premium-Schließen-X ohne rechteckigen Außenrahmen.

Die goldenen/Messing-Chivron wurden **nicht gelöscht** und bleiben im Repository.

### Medaillon

Das Medaillon besitzt jetzt die analoge Picker-Funktion:

- Klick/Tipp öffnet eigenes Popup,
- goldene/Messing-Chivron links/rechts,
- goldene Positionsanzeige,
- Designauswahl wird gespeichert,
- Vollbild-Tipp ist vom Drag getrennt.

Aktuell existiert erst ein reales Medaillon-Design `trend_01`; deshalb zeigt die Auswahl momentan `1 / 1`. Die Mechanik ist bereits mehrvariantenfähig.

---

## 5. Diagnose-Erweiterung für die Picker

Vor dem Hinzufügen weiterer Medaillons wurde die Diagnose vollständig auf die Instrument-Picker erweitert.

Bei aktivem globalen Diagnosemodus und sichtbarer Diagnosedarstellung besitzen **Kompass- und Medaillon-Picker ihre eigenen Messhilfen direkt innerhalb des nativen `<dialog>`-Top-Layers**. Dadurch verschwinden die Messwerkzeuge beim Öffnen der Popups nicht hinter dem Dialog.

Gemessen werden:

### Kompass-Picker
- Instrumentzentrum,
- Pivot,
- horizontale/vertikale Achsen und Diagonalen,
- Instrument-Bounding-Box,
- Links-/Rechts-Chivron und Zähler,
- Navigationssymmetrie,
- vertikale Streuung,
- Abstand Instrument → Navigation,
- Overflow.

### Medaillon-Picker
- Medaillonzentrum,
- designspezifische Apertur,
- Soll-/Ist-Pfeilzentrum,
- Pfeilgröße,
- Achsen/Diagonalen/Bounding-Box,
- goldene Links-/Rechts-Chivron und Zähler,
- Navigationssymmetrie,
- Abstand Stage → Navigation,
- Overflow.

Die Picker-Messwerte werden zusätzlich im Diagnose-Snapshot unter `pickers.compass` bzw. `pickers.medallion` geführt.

---

## 6. Designfähige Medaillon-Diagnose

Die Diagnose ist nicht mehr fest auf `MEDALLION_DESIGNS[0]` verdrahtet.

Jedes Medaillon kann in `MEDALLION_DESIGNS` ein eigenes `diagnosticProfile` tragen, unter anderem für:

- Quellgröße,
- Aperturzentrum/-radius,
- Motivzentrum/-radius,
- Radialabstände,
- Skalierung,
- Mittelpunktkorrektur,
- Pfeilzentrum,
- Pfeilgröße,
- Kompositionsregeln.

`trend_01` übernimmt unverändert den bereits abgenommenen Referenzstand und dient als erstes Profil für die kommenden Medaillons.

Damit muss beim Ergänzen weiterer Medaillons nicht erneut eine separate Diagnosearchitektur gebaut werden; jedes neue Design bekommt nur sein eigenes Profil.

---

## 7. Letzter realer Fehlerfund und R5-Korrektur

Der Benutzer hat beim realen Test zwei konkrete Probleme gefunden:

1. Die Medaillon-Diagnosezustände **LEER / PFEIL / TREND / FREEZE** sprangen immer wieder auf **NORMAL** zurück.
2. Beim Öffnen des Kompass-/Medaillon-Popups war die große Diagnosekonsole nicht mehr verfügbar; direkter Export im Popup fehlte.

Ursache des Zustandsresets:

- normale Renderläufe rufen `_syncMedallionCalibrationUi()` auf,
- wenn die Medaillon-Kalibrierung nicht aktiv war, lief `_teardownMedallionCalibration()`,
- dort wurde zuvor bedingungslos `_setMedallionDiagnosticMode('normal')` ausgeführt.

R5 korrigiert dies:

- NORMAL wird beim Teardown nur noch außerhalb eines aktiven globalen Diagnosemodus erzwungen,
- während einer Diagnose-Sitzung bleibt der gewählte Zustand erhalten,
- der Medaillon-Picker spiegelt den Zustand direkt.

---

## 8. Lokale Diagnosewerkzeuge und Export im Popup

Beide Picker besitzen jetzt innerhalb des Dialogs eine eigene kompakte Werkzeugleiste.

### Kompass-Picker
- Diagnose-Messwerte bleiben sichtbar,
- **KOPIEREN**
- **JSON**
- **CSV**

### Medaillon-Picker
Zusätzlich zu KOPIEREN/JSON/CSV:

- LEER
- PFEIL
- TREND
- FREEZE
- NORMAL
- PFEIL EIN/AUS
- ANIMATION EIN/AUS
- FREEZE EIN/AUS
- 0° / 45° / 90° / 180° / 270°

Der Export verwendet das Schema:

`gewitterradar.picker-diagnostic.v1`

Enthalten sind unter anderem:

- Produkt-/Buildidentität,
- Viewport und Device-Pixel-Ratio,
- Picker und Design,
- globaler Diagnosezustand,
- Medaillon-Testzustand,
- vollständige Picker-Messwerte,
- vorhandener Kalibrierbericht.

Formate:

- Zwischenablage → formatiertes JSON,
- JSON-Datei → vollständiger strukturierter Datensatz,
- CSV-Datei → UTF-8 mit BOM, Semikolon-Trennung und flacher Feld/Wert-Darstellung.

Bei niedrigen Querformat-Viewports kann der Picker intern scrollen, damit Messwerte und Werkzeuge erreichbar bleiben.

---

## 9. Automatische Regression

Der Browservertrag wurde erweitert.

`scripts/test-picker-diagnostics.cjs` prüft unter anderem Dashboard und native Integration auf Desktop und iPad:

- lokale Diagnoseebene sichtbar,
- Werkzeugleiste sichtbar,
- exakt KOPIEREN/JSON/CSV,
- globales Ein-/Ausblenden der Diagnosedarstellung,
- Medaillon-Preset wird über den **realen dynamischen Popup-Button** gesetzt,
- anschließende Kalibrier-Synchronisierung darf den Zustand nicht auf NORMAL zurücksetzen,
- Picker muss den Diagnosezustand spiegeln,
- JSON-/CSV-Payloads werden validiert,
- Picker-Werte erscheinen im Diagnose-Snapshot.

Zusätzlich schützen statische Python-/Frontend-Verträge:

- designfähige Medaillon-Profile,
- fehlende Festkopplung an `MEDALLION_DESIGNS[0]`,
- lokale Picker-Diagnosehooks,
- lokale Exportmethoden,
- Versions-/Runtime-/Checksum-Verträge.

---

## 10. Jetzt noch offen – reale R5-Abnahme

**Das ist der nächste Schritt. Nicht erneut implementieren, bevor der aktuelle DRA-Stand real geprüft wurde.**

Über DRA `deploy/dev` installieren und danach:

1. Diagnose starten.
2. Medaillon **PFEIL** wählen und mehrere normale Render-/Kalibrierzyklen abwarten → darf nicht auf NORMAL springen.
3. Gleiches mit **TREND** und **FREEZE**.
4. Medaillon-Picker öffnen:
   - lokale Diagnosewerkzeuge sichtbar,
   - Zustand wird korrekt gespiegelt,
   - Detailsteuerungen funktionieren,
   - KOPIEREN/JSON/CSV funktionieren.
5. Kompass-Picker öffnen:
   - lokale Diagnosewerkzeuge/Messwerte sichtbar,
   - KOPIEREN/JSON/CSV funktionieren.
6. Diagnosedarstellung global aus/ein → Picker-Diagnose synchron aus/ein.
7. Desktop, iPad und Android/HA Companion prüfen.

Erst **danach** mit den zusätzlichen Medaillon-Designs weitermachen.

---

## 11. Repository-/Dokumentationsregeln

Keine Dubletten erzeugen:

- **Schlachtplan:** alleinige Detailquelle für M01–M13, reale Tests, CI und Schleifen.
- **Diese Datei:** nur aktueller Chat-Einstieg und Fortsetzungsanweisung.
- **CHANGELOG:** dauerhafte Produktänderungen.
- **HISTORY:** dauerhafte Projekt-/Produktgeschichte.

Für diese Diagnose-Picker-Änderung ist **kein DRA-Repository-Code geändert worden**. DRA ist nur der Installations-/Abnahmekanal; deshalb wurde bewusst kein redundanter DRA-Changelog-/Handoff-Eintrag erzeugt.

Die relevanten Gewitterradar-Dokumente wurden fortgeschrieben, ohne eine neue parallele Datei anzulegen:

- `docs/V4_10_MODULARISIERUNG_SCHLACHTPLAN.md`
- `docs/V4_10_CHAT_HANDOFF_2026-09-22.md`
- `CHANGELOG.md`
- `docs/HISTORY.md`

---

## 12. Starttext für den neuen Chat

```text
Bootstrap Daimos.

Wir setzen Gewitterradar V4.10.02 auf dem bestehenden Arbeitszweig
feature/v4.10.02-modularization fort.

Repository:
TheDaimos/gewitterradar

Bitte zuerst den aktuellen Repository-/PR-/CI-Stand verifizieren und danach zwingend lesen:
1. PROJECT_DEFAULTS.md
2. docs/V4_10_MODULARISIERUNG_SCHLACHTPLAN.md vollständig
3. docs/V4_10_CHAT_HANDOFF_2026-09-22.md

Keine neue parallele Übergabe- oder Statusdatei anlegen.
Der Schlachtplan ist die verbindliche Detailquelle.

Wichtiger Produktkandidat:
fe6fa77ab2d541ab04afc8f6a5ac3493275ce242
Runtime 41002r5
Modulsatz EA13-2B8B
core.manifest 1.2.10
core.base-context 1.0.3
diagnostics.cockpit 1.1.1
fullscreen.map-display 1.0.11

Dieser Produktkandidat ist 5/5 CI-grün:
Shared Frontend #2111
Integration #2130
Diagnostic #867
Source Archive #468
Hi-Res #1349

deploy/dev wurde exakt auf diesen grünen Produktkandidaten gesetzt.

Der letzte reale Benutzerfund betraf die Diagnose:
- Medaillon-Zustände LEER/PFEIL/TREND/FREEZE sprangen auf NORMAL zurück.
- Beim Öffnen der Kompass-/Medaillon-Popups war die außerhalb des Dialog-Top-Layers
  liegende Diagnosekonsole nicht verfügbar.
- Direkte Picker-Exporte fehlten.

R5 enthält die Korrektur:
- Diagnosezustand bleibt während aktiver Diagnose stabil.
- Beide Picker besitzen lokale Diagnosewerkzeuge direkt im Popup.
- Kompass: KOPIEREN / JSON / CSV.
- Medaillon zusätzlich: LEER/PFEIL/TREND/FREEZE/NORMAL,
  Pfeil/Animation/Freeze ein/aus, Winkel 0/45/90/180/270,
  plus KOPIEREN / JSON / CSV.
- Medaillon-Diagnose ist designfähig über MEDALLION_DESIGNS.diagnosticProfile.
- trend_01 behält die bereits abgenommenen Referenzwerte.

NÄCHSTER SCHRITT:
Nicht weiter implementieren, sondern zuerst die reale DRA-Abnahme von deploy/dev durchführen:
1. PFEIL/TREND/FREEZE dürfen nicht mehr auf NORMAL zurückspringen.
2. Medaillon-Picker: lokale Diagnosewerkzeuge + Zustandsspiegelung + Export prüfen.
3. Kompass-Picker: lokale Diagnosewerkzeuge + Export prüfen.
4. Diagnosedarstellung global aus/ein prüfen.
5. Desktop, iPad und Android/HA Companion prüfen.

Erst danach mit den weiteren Medaillon-Designs fortfahren.

Keine Veröffentlichung, kein Merge nach main und kein Release ohne ausdrückliche Benutzerfreigabe.
```
