# Gewitterradar V4.11.97 DEV – GR-RF-02

**Datum:** 18.10.2026  
**Zweig:** `deploy/dev`  
**HA-Integration:** `0.25.15`  
**Laufzeit:** `41197r1`  
**Modulsatz:** `E411-97A1`  
**Gegenstelle:** WeatherRouter V0.10.158 DEV / Loader 161

## Festgestellter Fehler

Die GR-V4.11.96-Mosaikübernahme berücksichtigte beim V2-Quellenwechsel die Vollständigkeit der neu gezeichneten Ansicht, nicht den Verlust einer **noch zeitlich und geografisch gültigen regionalen Radarmessung**. Im tatsächlich protokollierten Test 18.10.2026, 15:10:01 bis 15:13:03 UTC, war die WR-Ausgabe zunächst [NASA `older_background`, DWD `current`], danach nach drei sechsekündigen DWD-Coverage-Timeouts allein NASA. GR aktivierte daraufhin `v2_layer_swapped`, obwohl der zuvor dargestellte DWD-Rasterteil noch gültig war. In der realen WR-Antwort stehen nur die pauschalen `limitations`, NICHT die einzelnen `coverage_preflight`-Codes; diese stehen im WR-API-Monitor. GR darf aus dem bloßen Wegfall einer Quelle **keinen nachgewiesenen `coverage_timeout` erfinden**.

## Umsetzung, ohne Providerauflösung im GR

**Datei:** `frontend/modules/weather/precipitation-layer.js` und beide Auslieferungsspiegel.

- `v2RenderedSourceValidity` verlangt belegtes, zeitzonenbehaftetes `valid_at`, numerisches ursprüngliches `age_seconds`, ursprüngliche `v2SnapshotAt`, bestätigte geografische Abdeckung sowie gültige Satellitenfreigabe; prüft sowohl `valid_at` als auch das ursprüngliche gemeldete Datenalter. Keine Altersverlängerung durch spätere Requests.
- `decideV2RegionalRetention` erlaubt **nur** vorläufiges Beibehalten der *bereits gezeichneten* Kombination aktueller Radarmessung und älterer Satellitengrundlage bei neuerem NASA-only-Teilresultat mit tatsächlich gemeldetem eingeschränktem regionalem Coverage-Kontakt. Radar muss die passende Niederschlagsgröße/Einheit besitzen, im Sichtfeld weiterhin geografisch passen und bei der ursprünglichen WR-Zeichenreihenfolge **über** NASA liegen. Es werden keine neuen DWD-Daten erzeugt, bewertet oder zusammengesetzt.
- Verbindlicher harter Schutz: höchstens **45 Sekunden** ab dem ersten zurückgehaltenen Antwortverlust und niemals über das tatsächliche **900-Sekunden-Quellalter** oder die individuelle NASA-Satellitenablaufgrenze hinaus. Folgefehler verlängern die Frist nicht. Ein einmaliger Zeitwächter entfernt das alte *gesamte* Canvas-Mosaik bei Ablauf; einzelne Quellen innerhalb einer bereits gezeichneten Kachel können nicht nachträglich ohne neues Rendering unsichtbar gemacht werden. Neuer WR-Resolve folgt kontrolliert.
- Erneute Verbraucher-Anfrage frühestens nach 15 Sekunden (oder länger entsprechend Benutzerintervall), ohne neues paralleles Routing. Sobald neue WR-V2-Quellen vollständig gezeichnet sind, gilt wieder der normale atomare Ersatz mit `v2_layer_swapped`.
- Bei ausdrücklich belegter neuer Ungültigkeit `outside_coverage`, `source_stale`, `outside_time_tolerance`, `consent_revoked` usw., oder Kartenwechsel außerhalb der bisherigen Abdeckung wird der Schutz nicht erteilt. Ein `coverage_timeout` wird nur als bewiesen ausgewiesen, wenn ein künftiger öffentlicher WR-Vertrag diesen Einzelcode tatsächlich mitsendet.
- Bestehende V1-/V2-Verträge, geografische GR-RF-01-Teilabdeckung, Bildfehlermaskierung, Quellenbudget, Zoom 17, UTC und Satellitenfreigabe bleiben bestehen. Der allgemeine V2-Löschschutz entfernt ein fertig zusammengesetztes älteres Bild nun bei Ablauf *einer* sichtbaren Einzelquelle, statt es wegen einer noch gültigen NASA-Grundlage unbegrenzt mit anzuzeigen.

**Diagnose:** `v2_regional_previous_retained`, `v2_regional_hold_expired`, `v2_regional_hold_invalidated`, `v2_layer_swapped` (mit Zeichnungsreihenfolge), `v2_component_expired`. Die Statusanzeige kennzeichnet vorläufig zurückgehaltene Altdaten, begrenzte Restdauer und die Prüfung. Keine zusätzlichen Bedienfelder.

## Prüfungen

`scripts/test-p7-010-rf-02.mjs` deckt die zwölf Fälle GR-RF02-01 bis GR-RF02-12 ab: aktueller DWD+NASA-Fall, generischer Coverage-Hinweis gegenüber tatsächlich geliefertem `coverage_timeout`, individueller Frischeablauf und harte Haltefrist, geografisches `outside_coverage`, Kuba, Widerruf der Freigabe, beschädigte Kacheln, nicht verlängerbare Wiederholung, Status/UTC, reale Canvas-Zeichenreihenfolge, Zoom 5→7→5 und bestehenden V1-Vertrag. Zusätzlich alle bisherigen P7-010-/GR-RF-01- und Frontend-/HA-Prüfungen.

**Grenzen:** Die V2-Antwort in WR 0.10.158 enthält noch keine quellenspezifische Timeout-/Outside-Coverage-Entscheidung. Der allgemeine Warnhinweis signalisiert nur fehlgeschlagene oder unbrauchbare regionale Prüfung. Der neue Schutz ist deshalb vorsichtig, temporär, auf existierende Bilder begrenzt und darf nicht als eindeutige Timeout-Klassifizierung ausgegeben werden. Der sichtbare Wert und die Verdeckungsreihenfolge der echten nichttransparenten Pixel müssen im HA-Browser optisch beziehungsweise mit gesonderter Pixeldiagnose bestätigt werden.

## DRA und HA-Realabnahme

1. GR V4.11.97 DEV aus `TheDaimos/gewitterradar@deploy/dev` über DRA installieren; WR V0.10.158 DEV / Loader 161 als tatsächlich installierte Gegenstelle prüfen. HA vollständig neu starten, Version `0.25.15 / 41197r1` kontrollieren.
2. Hamburg/Deutschland bei aktiviertem 12-Stunden-Satellitenhintergrund: DWD `current` und NASA `older_background` zeitgleich anzeigen und korrelieren (WR-`layers`, GR-`v2_draw_audit`).
3. Bei tatsächlichem vorübergehendem DWD-`coverage_timeout`: GR muss `v2_regional_previous_retained` melden und die noch gültige alte Ebene sichtbar halten. Ursache im **WR-API-Monitor** mit `correlation_id` belegen, nicht allein aus GR ableiten. Auf Wiedereinsetzen des frischen DWD prüfen.
4. Ablaufprüfung: Alte DWD-Zeit >900s oder Haltefrist >45s darf nie unmarkiert weiter erscheinen. NASA-only-Ansicht nur im erlaubten 12-h-Rahmen; bei Aufhebung des Opt-ins vorherige Satellitenbilder sofort entfernen.
5. Deutschland → Kuba → Deutschland, Zoom 5→7→5 und 10–17, einzelne Kachelfehler, Android-Vordergrund/Wiederaufnahme sowie V1-Rückfall bestätigen.
6. Gewitterradar-Weather-Engine und WR-API-Monitor synchron exportieren, ausschließlich in `TheDaimos/Project-Log-And-Export` archivieren. Echtes HA-REAL-PASS nur nach korrelierten Bildern, Quellenzeiten und Diagnosen.

**C.K. – Eine Idee weiter gedacht.**
