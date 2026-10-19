# GR-RF-04 – Technische Gegenantwort: Quellenpriorität, Diagnose und regionaler Ausfallschutz

**Datum:** 19.10.2026  
**Repository:** `TheDaimos/gewitterradar` · einziger Entwicklungszweig `deploy/dev`  
**Auslieferung:** **V4.11.99 DEV** · Build `V4.11.99-DEV-2026-10-19` · Runtime `41199r1` · Modulsatz `E411-99A1` · HA-Integration `0.25.17`  
**WeatherRouter-Gegenstelle:** V0.10.161 DEV laut gemeinsamer Realabnahme (nicht durch dieses CI live installiert oder geprüft).  
**Status:** **CODE-PASS ✅ · CI-PASS ✅ · HA-TEIL-PASS (Diagnose und normaler geografischer Wechsel) ✅ · vollständiger HA-REAL-PASS OFFEN**. CODE- und CI-Freigabe beziehen sich auf den geprüften technischen Stand `1ff491c51f8e29ddcd2edc73cb6f7db4efa3f6e2`; danach ausschließlich Dokumentationsänderungen.

## A – Tatsächlich nachgewiesene Ursache der Zeichenreihendiagnose

Im privaten Originalexport der Realabnahme vom 19.10.2026 wurden für **dieselbe** `v2_layer_swapped`-Korrelationskennung `render_order: []`, `observed_draw_orders: []` und `render_order_verified: true` gespeichert. Nicht durch Vermischung verschiedener Requests verursacht.

`frontend/modules/weather/consumer-client.js`, `_weatherEngineMonitorEvent()`, filterte allgemeine Diagnoselisten mittels `.filter(x => typeof x === "string")`. Diese Verlustfunktion entfernte das Array von Quellenobjekten `render_order` und die verschachtelten Arrays `observed_draw_orders`, ließ den booleschen Wahrheitswert aber stehen. Die tatsächlichen Tile-/Canvas-Ereignisse wurden deshalb beim Aufzeichnen falsch zusammengefasst.

**Korrektur:** Begrenzte, explizit erlaubte Quellenobjekte `render_order` und `source_order` (Quellenkennung, Aktualitätsklasse) sowie bis zu zwölf beobachtete Folgen mit bis zu vier Quellen erhalten. Korrelationskennung beibehalten, keine URLs oder Geheimnisse erlauben. Leere Beobachtung kann keinen positiven Verifikationswert erzeugen. Canvas-Kompositor und WeatherRouter-Quellenpriorität unverändert; neu gemeldete `drawImage`-Reihenfolgen sind Operations-, **keine Niederschlags-Pixel-Nachweise**. Keine speicherintensive Pixelanalyse eingeführt.

## B – Zusätzlich nachgewiesener RF02-Ausfallschutzfehler

Der kontrollierte Test des **produktiven** `decideV2RegionalRetention()`-/`_weatherRadarRetainRegionalMosaic()`-/`_weatherRadarExpireRegionalHold()`-Pfads enthüllte: Wenn die neue WR-Antwort `source_outcomes: [{source_id: DWD, result: outside_coverage}]` enthielt, aber keinen weiteren transienten Hinweis, lieferte der Entscheider zu früh `no_transient_coverage_evidence`. Bei laufender Zurückhaltung wurde die ausdrückliche geografische Ablehnung dann nicht zur sofortigen Invalidierung verwendet. Vor der Korrektur wurde das im automatisierten Test als **FAIL** reproduziert.

**Korrektur:** Explizite fachliche Ungültigkeit der tatsächlich zuvor gewählten Regionalquelle wird **vor** allgemeinen/transienten Quellenausfällen geprüft. `outside_coverage`, `source_stale` und vergleichbare eindeutige Ablehnungen erhalten `explicit_regional_rejection` und invalidieren bereits aktive Zurückhaltung. Die Schutzfrist beginnt bei erster Zurückhaltung, kann durch Folge-Timeouts nicht über 45 s verlängert werden; ursprüngliches UTC-Datenalter, Freigaben und räumliche Gültigkeit bleiben wirksam. Provider, WR-Routing und externe Dienste wurden für Regressionstests **nicht** absichtlich gestört.

## Kontrollierte GR-RF04-Regressionen (20 Auftragspositionen)

| ID | Prüfung | Nachweis / Grenze |
| --- | --- | --- |
| 01 | DWD + NASA gleichzeitig | `test-p7-010-rf-04.mjs`, RF02-/Mosaik-Tests, synthetisch |
| 02 | WR-Fachreihenfolge | `test-p7-010-rf-03.mjs`, `test-p7-010-rf-04.mjs` |
| 03 | Canvas-`drawImage`-Reihenfolge | `test-p7-010-rf-04.mjs`; keine Pixelvalidierung |
| 04 | Aufgezeichnete Beobachtungsfolge | `test-p7-010-rf-04.mjs`, Diagnose-Ringpuffer |
| 05 | Leere Beobachtung nicht verifiziert | `test-p7-010-rf-04.mjs` |
| 06 | NASA unter DWD | `test-p7-010-rf-03.mjs`, `test-p7-010-rf-04.mjs` |
| 07 | Erster `coverage_timeout` | `test-p7-010-rf-04-regional-hold.mjs`, Produktivpfad mit Testantwort |
| 08 | Zweiter/dritter Timeout ohne Fristneustart | `test-p7-010-rf-04-regional-hold.mjs`, RF02-Bestandstest |
| 09 | Ablauf nach höchstens 45 s | `test-p7-010-rf-04-regional-hold.mjs`, Aufruf echter Ablaufmethode |
| 10 | Überschrittenes Originaldatenalter | `test-p7-010-rf-04-regional-hold.mjs`, RF02-Zeitvertrag |
| 11 | `outside_coverage` invalidiert Hold | **Vorher FAIL, nach Produktionskorrektur PASS** in `test-p7-010-rf-04-regional-hold.mjs` |
| 12 | NASA-Freigabe widerrufen | `test-p7-010-rf-04-regional-hold.mjs`, Satelliten-Widerrufstest |
| 13 | DWD-Rückkehr | `test-p7-010-rf-04-regional-hold.mjs` bestätigt keine unzulässige Zurückhaltung; tatsächliche vollständige neue Live-Kachelebene noch HA-relevant |
| 14 | Deutschland→Kuba→Deutschland | `test-p7-010-viewport-coverage-revocation.mjs` und bestehender früherer HA-Realtest |
| 15 | Zoom 5→7→5 | RF01–03/Zoom-Regressionen und vorherige Nutzer-Realabnahme; keine eigene RF04-End-to-End-Wiederholung |
| 16 | Zoom 7→8→7 | RF03-Bestandstest und vorherige Nutzer-Realabnahme; keine neue HA-End-to-End-Wiederholung |
| 17 | Zoom 10–17 | RF01/RF02- und GridLayer-Tests; sichtbare echte Niederschlagspixel nicht aus Tests abgeleitet |
| 18 | Langsame/fehlgeschlagene/hängende Kacheln | RF03- und Tile-Loader-Tests mit synthetischen Bildlatenzen |
| 19 | Firefox-Rückkehr | RF03-Simulations-Test und früherer Realtest; keine neue Browser-Hintergrund-Realprüfung durch GitHub-CI |
| 20 | UTC, API V1/V2, Frische | Bestehende V2-Alters-, geografische, Consumer-Contract- und RF01/02-Regressionen |

Die Zuordnung ist **kein** pauschaler Nachweis, dass jeder Fall in einer neu aufgebauten HA-Umgebung als echter End-to-End-Realtest wiederholt wurde. Die bestehenden erfolgreichen Realtestfälle behalten Bestandsschutz.

## Tatsächliche GitHub-Prüfnachweise

- Isolierter P7-010-Workflow **SUCCESS**, Run **39234511576**, 18 Skripte einschließlich neuer RF04-Diagnose- und RF04-Regional-Hold-Testfälle, RF01/02/03, Satellitenwiderruf, Zeitvertrags- und Kuba-Geografie-Regression.
- Modul-/Android-Schutz-Workflow **SUCCESS**, Run **39234295299**.
- Einstellungen/Laufzeitidentität **SUCCESS**, Run **39234643133** nach Versionsabgleich.
- HA-Integration **SUCCESS**, Run **39234643070**.
- Gemeinsamer Frontend-/Browserworkflow **SUCCESS**, Run **39235365097**, geprüft auf Commit `1ff491c51f8e29ddcd2edc73cb6f7db4efa3f6e2`; einschließlich historischer geschützter About-Geometrie, Browser-Regressionsprüfungen, UI-Animation und **beider Auslieferungsvarianten**.
- HA-Integration **SUCCESS**, Run **39235364938** (gleicher geprüfter Quellcommit).
- Einstellungen/Laufzeitidentität **SUCCESS**, Run **39235364962** (gleicher geprüfter Quellcommit).
- P7-010 18 isolierte Skripte **SUCCESS**, Run **39234511576**, plus Modul-/Android-Gate **SUCCESS**, Run **39234295299**; die nachfolgenden Änderungen an diesem Prüfstand betrafen nur benannte Test-/Auslieferungskontrollen und dokumentierte Sicherheitskorrektur, deren neue Regression durch den ebenfalls grünen P7-010-Lauf ausgeführt wurde.

**Ergebnis: CODE-PASS und CI-PASS für V4.11.99.** Die erneute HA-Diagnoseprüfung nach Installation wurde inzwischen erfolgreich dokumentiert; **offen bleibt der reale DWD-Coverage-Timeout mit regionaler 45-Sekunden-Zurückhaltung**.

Zwischenzeitlich rote Läufe dienten zur Fehlerentdeckung (RF02-Verletzung) bzw. zur Anpassung alter V4.11.98-Versionsprüfungen. Diese sind keine gültige Endabnahme für V4.11.99.

## Versionierung und Auslieferung

- Integrationsmanifest `0.25.17`, `build_info.py` `4.11.99`, `const.py` mit Runtime-Cache `41199r1`.
- Frontend-/Seitenleisten-/Dashboard-Spiegel synchronisiert; `SHA256SUMS_FRONTEND.txt`, `frontend/assets.json`, Runtime-Manifest, Modulmanifest und DRA-Provenienz aktualisiert.
- Produktiv geändert: `frontend/modules/weather/consumer-client.js` (Diagnose) und `frontend/modules/weather/precipitation-layer.js` (Prioritätsprüfung des regionalen Bestandsschutzes). Keine andere Mosaik-/Providerarchitektur.
- Installation ausschließlich aus `TheDaimos/gewitterradar@deploy/dev` via Deploy Relay Agent, **Commit mit `deploy/dev` unmittelbar vor Installation prüfen**. Im DRA nach Installation Versions-/Runtime-/Modulsatz-/SHA-Identität auslesen; Browser-Cache vollständig aktualisieren.


## HA-Realabnahme nach Installation – 19.10.2026: dokumentierte Teilergebnisse

**Installationsstand:** Gewitterradar **V4.11.99 DEV**, WeatherRouter **V0.10.161 DEV**, nach HA-Neustart vom Benutzer bestätigt. Niederschlagsanzeige und die ausdrückliche Freigabe älterer Satellitendaten waren aktiv. Alle Zeitangaben gelten in **UTC**.

**Nachweisbasis:** zwei neue GR-Weather-Engine-Exporte von **11:17:54 UTC** und **11:27:16 UTC** sowie korrelierte WR-API-Monitor-Exporte im zentralen **privaten** Export2Git-Archiv `TheDaimos/Project-Log-And-Export`. Gleiche V2-Korrelationskennungen und ihre WR-/GR-Ereignisse wurden abgeglichen. Sensible Rohdiagnosen, Kartenausschnittkoordinaten und Anfrage-URLs werden **nicht** öffentlich übernommen.

### HA-Test 01 – Quellen- und Zeichenreihendiagnose: BESTANDEN

- **Zoom 7:** vollständige **9/9** Kacheln, NASA-IMERG-Hintergrund und DWD-Radar gemeinsam im V2-Mosaik.
- **Zoom 5:** vollständige **12/12** Kacheln; der GR-Export dokumentiert in `v2_draw_audit` und `v2_layer_swapped` für jeweils dieselbe Korrelationskennung nun tatsächlich gefüllte `render_order` und `observed_draw_orders` mit `render_order_verified: true`.
- Bei **6** beobachteten Kacheln war die Zeichenoperationsfolge **NASA → DWD**, bei weiteren **6** ausschließlich **NASA**. Die fachliche WR-Priorität lautete NASA `composition.draw_order: 0` (älterer Hintergrund) und DWD `composition.draw_order: 1` (aktueller Vordergrund).
- Die frühere widersprüchliche Kombination aus leeren Zeichenfolgen und positiver Verifikation trat bei diesen neuen Live-Ereignissen **nicht** auf.
- `pixels_verified: false` und `image_pixels_verified: false` bleiben zutreffend: ein beobachteter Canvas-Zeichenaufruf ist **kein** Nachweis tatsächlicher meteorologischer Niederschlagspixel.
- Letzter korrelierter WR-Aufruf ca. **11:16:06 UTC**: DWD-Daten ca. **66 s** alt, NASA-Daten ca. **6 h 46 min** alt. Verträge erfüllt (DWD maximal 900 s; NASA maximal 12 h mit Freigabe).

**Abnahme:** korrigierte Diagnoseaufzeichnung im echten HA-Betrieb bestätigt. Keine belegte Fehlfunktion der Canvas-Zeichenreihenfolge.

### HA-Test 02 – Deutschland → Kuba → Deutschland: BESTANDEN (regulärer geografischer Wechsel)

| WR-Antwort → GR-Aktivierung (UTC) | Ort und Zoom | WR-Entscheidung | Tatsächlicher GR-Zustand |
| --- | --- | --- | --- |
| **11:25:18 → 11:25:20** | Kuba, Zoom 5 | NASA gewählt, alle 3 DWD-Kandidaten `outside_coverage` | ausschließlich NASA, **8/8** Kacheln |
| **11:26:04 → 11:26:05** | Kuba, Zoom 6 | NASA gewählt, alle 3 DWD-Kandidaten `outside_coverage` | ausschließlich NASA, **12/12** Kacheln |
| **11:26:19 → kein vollständiger Swap** | Rückweg nach Deutschland | NASA + DWD ausgewählt | laufender GR-Aufbau beim Tab-Hintergrundwechsel kontrolliert als `stale_or_background` verworfen |
| **11:26:39 → 11:26:41** | Deutschland, Zoom 5 | NASA + DWD ausgewählt | V2-Mosaik automatisch wieder aktiv, **12/12** Kacheln |

- WeatherRouter unterscheidet über Kuba ausdrücklich `outside_coverage` von `coverage_timeout`. Gewitterradar hält dort **keine zuvor aktive DWD-Ebene** zurück (`retained_previous_layer: false`).
- Wiederherstellung nach Rückkehr aus dem Browser-Hintergrund ohne manuellen HA-Neustart oder erneute Seitenaktualisierung.
- Auch hier wurde die gefüllte, verifizierte Zeichenoperationsreihenfolge korrekt aufgezeichnet. Über Kuba allein NASA, über Deutschland NASA vor DWD auf räumlich überdeckten Kacheln.
- Beim letzten zusammengehörigen WR-Aufruf um **11:26:39 UTC** war DWD ca. **99 s**, NASA ca. **6 h 57 min** alt; beide Quellen vertragsgemäß.
- `mosaic_status: partial` beschreibt keine fehlende sichtbare Kachel: alle erwarteten Kacheln vollständig, tatsächliche Niederschlagspixel nicht gemessen.

**Abnahme:** geografischer Löschschutz und Wiederaufnahme der DWD-Regionalversorgung nach gewöhnlichem Kartenwechsel im HA-Betrieb bestätigt.

### Status und Abnahmegrenzen

| Prüfbereich | Ergebnis |
| --- | --- |
| Technische Korrekturen und produktionsnahe Regressionen | **CODE-PASS** |
| Github-Prüfläufe auf dem dokumentierten Quellstand | **CI-PASS** |
| HA-Test 01: echte korrigierte Zeichenreihendiagnose | **HA-TEIL-PASS** |
| HA-Test 02: normaler geografischer Ausschluss / Wiederherstellung | **HA-TEIL-PASS** |
| Reale DWD-`coverage_timeout`-Störung mit gültigem, bereits zurückgehaltenem Regionalmosaik | **HA-REAL-TEST OFFEN** |
| Vollständiger GR-RF-04-`HA-REAL-PASS` auch für die spezielle 45-s-Fehlerfolge | **OFFEN** |

**Abgrenzung:** Der bestätigte normale Übergang nach Kuba bei `outside_coverage` ist kein Live-Nachweis der besonderen Sicherheitsfolge, bei der eine **bereits laufende 45-Sekunden-Zurückhaltung** durch nachträglich gemeldetes `outside_coverage` sofort beendet wird. Diese Logik hat produktionsnahe automatisierte Prüfungen bestanden, jedoch **keinen echten DWD-Timeout in HA**.

**Weiteres Vorgehen:** Die beiden real beobachteten Funktionsprüfungen sind abgeschlossen. Eine künstliche produktive Störung von WR oder DWD ist **nicht zulässig**. Ein später natürlich auftretender DWD-Abdeckungs-Timeout darf erst durch korrelierte, UTC-korrekte GR-/WR-Diagnosen einschließlich Haltebeginn, Originalalter, Fristende und Wiederherstellung als zusätzliche HA-Realabnahme gelten. Aus den aktuellen realen Tests folgt **kein unmittelbarer Auftrag für eine neue GR- oder WR-DEV-Version**.

**C.K. – Eine Idee weiter gedacht.**
