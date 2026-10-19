# Verbindliche Chatübergabe – Gewitterradar V4.11.98 DEV / GR-RF-03 / P7-010

**Datum:** 19.10.2026  
**Projekt:** Gewitterradar  
**Privates Repository:** `TheDaimos/gewitterradar`  
**Einziger Entwicklungszweig:** `deploy/dev`  
**Code-Checkpoint (vor dieser Übergabedokumentation):** `2d60654676ca1b900b7624e4c96f214d9d1a1422`  
**Produkt:** V4.11.98 DEV · Build `V4.11.98-DEV-2026-10-19` · Runtime `41198r1` · Modulsatz `E411-98A1` · HA-Integration `0.25.16`  
**WeatherRouter-Gegenstelle:** WR-RF-03, dokumentierte Vertragsantwort V0.10.160 / Loader 163; tatsächliche aktuelle und installierte Version bei Wiederaufnahme unabhängig verifizieren  
**Priorität:** P1 – gemeinsame P7-010-Realabnahme  
**Status:** Code und CI abgeschlossen; **keine** bestätigte HA-REAL-Abnahme.

## 1. Einstieg in den nächsten Chat

1. **Diese Übergabe vollständig lesen**, nichts überspringen, anschließend `docs/RELEASE_NOTES_V4_11_98_DEV.md`.
2. Den echten aktuellen Git-HEAD von `deploy/dev` prüfen; diese Übergabe erzeugt selbst einen weiteren Dokumentationscommit. Nicht blind den oben genannten Code-Checkpoint als aktuellen HEAD annehmen.
3. GR-RF-01/RF-02 und die zugehörigen Tests sowie bestehende P7-010-Architektur berücksichtigen, nicht nochmals entwickeln.
4. Aktuellen Auftrag des Nutzers mit diesem offenen Stand zusammenführen. Keine parallelen Entwicklungszweige, keine unnötigen Versionssprünge oder Rückfragen; keine nicht bestätigten Testergebnisse behaupten.
5. WR-Gegenantwort (privates WR-Repository `deploy/dev`) vollständig lesen: `docs/p7-010-coordination/WR_TO_GR_2026-10-19_WR_RF03_V2_QUELLENPRIORITAET_VERTRAG_FEHLERGRUENDE.md`.
6. GR→WR-Abstimmungsdokument ist im **privaten WR-Repository** unter `docs/p7-010-coordination/GR_TO_WR_2026-10-19_GR_RF03_V41198_RENDERER_QUELLENPRIORITAET_REALTEST.md` vorhanden.
7. Änderungen an WeatherRouter sind ausgeschlossen; dessen Zustand bei Bedarf separat dokumentieren bzw. über private Koordination weitergeben.

## 2. Ausgangslage und belegte Fehlerbilder

- V2-Mosaik: bei Zoom 7 mit DWD + NASA wiederholt nur ca. 6/12, 7/12, 8/12 bzw. 10/12 gezeichnete Kacheln; `insufficient_painted_tiles`; nach etwa sechs Sekunden V1-Rückfall. Zoom 5/8 zeitweise erfolgreich.
- Reaktivierung nach Firefox-Hintergrundbetrieb: Satellitenbild verschwindet, V2 antwortet teilweise erfolgreich, aber neue Bilder werden nicht stabil aktiv.
- WR-Reihenfolge der Quellen variierte: ältere NASA-Hintergrundschätzung konnte nach aktuellem DWD-Radar kommen, unzulässige visuelle Überdeckung wäre möglich.
- `render_order: []` war in Teilen der Diagnose ohne zuverlässigen Beleg tatsächlicher Canvas-Zeichenfolge.
- **Technische Ursache A im vorherigen GR-Code nachgewiesen:** pauschales Stufenlimit 6000 ms trotz individuellem Raster-Bildlimit bis 8000 ms und begrenzter Zahl paralleler Ladevorgänge. Die **reale Wirkung der Korrektur** im HA-/Firefox-Betrieb ist noch zu prüfen; CI beweist sie nicht.

## 3. Auf `deploy/dev` bereits umgesetzte GR-RF-03-Korrekturen

**Kachelstufe:** starres sechssekündiges Limit durch kontrollierte Fortschrittsbeobachtung ersetzt. Kein Fortschritt innerhalb neun Sekunden bzw. maximale Stufendauer zwanzig Sekunden führt zu einem unterscheidbaren Fehler. `stage_ms`, `settled_tiles`, `max_tile_ms`, `last_tile_error`, Ablehnungsgrund und ältere weiterhin vorhandene Ebene werden diagnostiziert. Der bestehende Rasterlayer wird erst ausgetauscht, wenn die vorhandenen Sicherheitsbedingungen erfüllt sind. Der 20-Sekunden-Client-WebSocket-Vertrag blieb bestehen; in der HA-Realabnahme sowohl WS- als auch anschließende Renderzeiten getrennt messen.

**Firefox-Hintergrund:** `visibilitychange` invalidiert laufende Ersatzstufen, die alte gültige Anzeige bleibt erhalten. Hintergrundaktualisierungen werden zurückgestellt, `focus`/`pageshow` und Rückkehr zusammengeführt; bereits bestehende Zeit-/Coverage-Löschregeln bleiben verbindlich. Nicht als vollständiger Firefox-Realtest akzeptieren.

**Zeichenfolge:** `rasterMosaicRenderOrder` behandelt ältere Satellitenabschätzungen als unterste Darstellungsgruppe und zeichnet aktuelle Messungen darüber. Relative Reihenfolge innerhalb derselben Klasse bleibt von WR bestimmt. Canvas-Zeichenoperationen und effektive Reihenfolge erscheinen in den Diagnosen als `observed_draw_orders` und `render_order`. Die Quellenwahl und Berechtigungen bleiben beim WR; keine numerische Pixel-/Einheitenumrechnung.

**GR-RF-02-Nachtrag:** Optionale WR-V2-`source_outcomes` (`coverage_timeout`, `temporarily_unavailable`, `outside_coverage`, `source_stale` usw.) werden bei der konservativen Entscheidung zur Beibehaltung eines vorhandenen Regionalradars berücksichtigt; eine tatsächliche vorhandene Layer-Zeichnungsreihenfolge hat bei der Prüfung Vorrang vor bloßer alter Arrayfolge. Altes WR-V2-Schema bleibt unterstützt.

**Wichtige geänderte Pfade:**
- `frontend/modules/weather/precipitation-layer.js`
- `frontend/modules/weather/p7-010/{raster-compositor,raster-mosaic-tile-loader,raster-mosaic-grid-layer,raster-mosaic-consumer}.js`
- jeweilige isolierte Module unter `src/p7-010/`
- identische Frontend-Spiegel unter `dashboard/dist/` und `custom_components/gewitterradar/frontend/`
- `frontend/version.js`, `frontend/module-manifest.js`, Runtime-Manifest, `frontend/assets.json`, `SHA256SUMS_FRONTEND.txt`, Integration-`manifest.json`, `build_info.py`, DRA-Provenienz, `custom_components/gewitterradar/const.py`
- angepasste Versionsschutztests und Workflows; neuer `scripts/test-p7-010-rf-03.mjs`

**Entwicklungshistorie:** Der erste GR-RF-03-Hauptcommit `cda5b898d0f02bf80d9b328de628ad5d5e6c53d9` wurde durch abgestimmte Frontend-/Seitenleisten-/Test-/WR-V2-Vertragskorrekturen ergänzt. **Letzter vollständig geprüfter Code-HEAD `2d60654676ca1b900b7624e4c96f214d9d1a1422`.** Frühere zwischendurch rote CI-Läufe betrafen nicht mitgezogene alte Versionsprüfungen und einen Golden-Baseline-Versions-Dispatcher; die historische geschützte Browser-Geometrieprüfung wurde **nicht abgeschaltet**, sondern auf die neue DEV-Kennung erweitert.

## 4. Bestätigter GitHub-CI-Nachweis

Gegen **Codecommit `2d60654676ca1b900b7624e4c96f214d9d1a1422`** am 19.10.2026 waren alle drei neu ausgelösten Workflows erfolgreich abgeschlossen:

- `Validate shared Gewitterradar frontend`: **SUCCESS**, Run **39216150201** – inkl. Frontend-/Browser-/Golden-Baseline-Prüfungen.
- `Validate Gewitterradar integration`: **SUCCESS**, Run **39216150185** – inklusive HACS-/Hassfest-/Paket-/HA-Test-Gates des Workflows.
- `V4.11.98 settings navigation and runtime identity`: **SUCCESS**, Run **39216150190**.

Außerdem für den unmittelbar vorherigen funktional relevanten Codecommit `127105202d27096d7a7bd11dfb051cdae6fbf642` erfolgreich:
- `P7-010 isolierte Raster-Mosaik-Abnahme`, Run **39215726328**.
- `V4.11.40 module consistency and Android map preservation`, Run **39215726392**.
- `V4.11.98 settings navigation and runtime identity`, Run **39215726359**.
- `Validate Gewitterradar integration`, Run **39215726431**.

Beachte: Der isolierte P7-010-Workflow wird nur bei einschlägigen Quell-/Teständerungen gestartet; nicht auf jedem Dokumentations-/Workflow-Commit. Keine Behauptung über neue CI nach dieser Übergabe ohne gesonderte Prüfung.

## 5. Unantastbarer Bestandsschutz

- Consumer API V1 und V2, einheitliche P7-010-Mehrquellenarchitektur – **keine zweite Rasterarchitektur**.
- GR-RF-01 (Teilabdeckung/Kachelausfall) und GR-RF-02 (temporärer regionaler Quellenausfall).
- UTC als einzige harmonisierte Zeitbasis; Provider-Zeiten niemals unkontrolliert auf lokale Zeit reduzieren.
- Frische regionaler Echtzeit-Radardaten maximal 900 s, ältere geeignete NASA-Daten nur bei **ausdrücklicher** 12-h-Freigabe.
- Höchstens 45 s konservative RF-02-Beibehaltung und harte Quellablaufgrenzen. Kein Reset des Originaldatenalters durch neue HTTP-/WS-Antwort.
- Geografischer Löschschutz für Deutschland/Kuba und andere Zielregionen; Zoom bis 17, Anfrage- und Kachelbudgets, V1-Rückfall.
- Gültige vorhandene vollständige Ebene nicht durch unvollständiges neues Mosaik ersetzen; wirklich ungültige Altdaten dennoch entfernen.
- Ursprüngliche DRA-Auslieferung, Modul- und Frontend-Spiegel-Parität, Asset-Schutz, Historie, Project Hub.
- Keine geheimen WR-Extensions, privaten Standorte oder privaten Export-JSONs im öffentlichen Repository. Diagnoseexporte ausschließlich im privaten `TheDaimos/Project-Log-And-Export`; bei abweichendem Ablageziel ausdrücklich warnen.

## 6. Noch NICHT abgenommen – Pflichttests unter HA

1. Tatsächlich installierte GR-Version, Integrationsversion, Runtime, Modulsatz, DRA-Ref/Commit; WR-Version/Loader und aktive V2-Schnittstelle ermitteln.
2. Mit realen korrelierten GR-/WR-Diagnosen DWD+NASA Zoom **5, 7, 8** sowie **5→7→5** und **7→8→7** untersuchen. Zeit bis `active`, tatsächliche gezeichnete/fehlende Kacheln, beobachtete Bildpixel, verfügbare Wetterlage unterscheiden.
3. Einzelne langsame, fehlerhafte und dauerhaft hängende Bildkachel; begrenzter Abbruch, keine Aktualisierungsstürme und keine unerlaubte Zerstörung alter gültiger Darstellung.
4. Firefox-Hintergrundzeit **mindestens zwei Minuten**; laufende V2-Anfrage bei Tabwechsel; Rückkehr ohne Neuladen; mehrere Fokuswechsel ohne parallele Wiederholungsstürme. Gültige alte Daten behalten, abgelaufene Daten aber entfernen.
5. WR-`layers`, `layer_order`, `composition.draw_order`/`routing_score`, `source_outcomes` mit GR-`render_order` und `observed_draw_orders` **synchron** vergleichen. NASA-Untergrund darf aktuelle DWD-Radarwerte nicht überdecken.
6. Deutschland → Kuba → Deutschland, räumliche BBOX/Provider-Abdeckung, DWD auf Kuba vollständig entfernt.
7. Opt-in für ältere NASA-Daten widerrufen; 900-s-Regel, 12-h-NASA-Regel und 45-s-RF02-Frist auch nach Hintergrundbetrieb verifizieren.
8. V1-Rückfall und vollständige V2-Wiederherstellung ohne erzwungenen HA-Neustart.
9. Sichtbar gezeichnete/geladene Bildkachel nicht mit Nachweis meteorologisch nichttransparenter Niederschlagspixel verwechseln.
10. Für jeden akzeptierten Test dokumentierter Realschritt mit UTC, Browser-/Zoom-/Standortkontext (nur im privaten Export), relevanten korrelierten Diagnosen und getrennten Bewertungen **GR**, **WR** und **gesamt**.

**WICHTIG:** **Keine** Echtwetter-, HA-, Firefox- oder End-to-End-Realprüfung wird allein durch erfolgreiche CI- oder synthetische Tests bewiesen. Kein `HA-REAL-PASS`, bevor die oben genannten Fallgruppen durch echte Exporte bestätigt sind.

## 7. Bekannte Folgefragen / Risiken

- Die Fortschrittswächter sind statisch und synthetisch geprüft, aber der reale Zoom-7-Austausch unter langsamen Fremd-WMS-Kacheln braucht Messdaten. WebSocket-Zeitbudget und Kachelzeitbudget nicht blind erhöhen.
- Die neue WR-RF03-Antwort hat optionale Felder; Backward-Kompatibilität mit dem tatsächlich installierten WR und Unterschiede zwischen `unit=null` und `mm/h` fachlich prüfen. Keine stillschweigende Messdatenkonvertierung.
- Ein `drawn`-Zähler oder `render_order`-Protokoll bestätigt Canvas-Operationen, nicht zwingend echte Niederschlagswerte.
- Bei neuer Nutzermeldung zuerst reale Symptome und bestehende Evidenz zuordnen; nicht ohne Beleg WR- oder GR-Ursachen behaupten.
- Eine öffentliche CI oder ein grüner P7-010-Test ersetzt niemals die vereinbarte gemeinsame HA-Realabnahme.

## 8. Nachweise und Dokumentationspfade

- `docs/RELEASE_NOTES_V4_11_98_DEV.md` (GR).
- `scripts/test-p7-010-rf-03.mjs`, `scripts/test-p7-010-rf-02.mjs`, `scripts/test-p7-010-rf-01.mjs` (GR).
- `docs/p7-010-coordination/WR_TO_GR_2026-10-19_WR_RF03_V2_QUELLENPRIORITAET_VERTRAG_FEHLERGRUENDE.md` (privates WR-Repo).
- `docs/p7-010-coordination/GR_TO_WR_2026-10-19_GR_RF03_V41198_RENDERER_QUELLENPRIORITAET_REALTEST.md` (privates WR-Repo).
- `TheDaimos/Project-Log-And-Export` (privates Zentralarchiv für GR/WR-Exporte).

### Verbindliche Schlussregel

Den **neuen** Auftrag im nächsten Chat direkt auf Basis dieser vollständigen Übergabe bearbeiten. Das letzte Stück des P7-010-Realtests **nicht** stillschweigend als erledigt markieren und keinen bisher grünen Code ohne konkrete Ursache neu implementieren.

**C.K. – Eine Idee weiter gedacht.**
