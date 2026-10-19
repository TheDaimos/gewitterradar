# GR-RF-04 – Technische Gegenantwort: Quellenpriorität, Diagnose und regionaler Ausfallschutz

**Datum:** 19.10.2026  
**Repository:** `TheDaimos/gewitterradar` · einziger Entwicklungszweig `deploy/dev`  
**Auslieferung:** **V4.11.99 DEV** · Build `V4.11.99-DEV-2026-10-19` · Runtime `41199r1` · Modulsatz `E411-99A1` · HA-Integration `0.25.17`  
**WeatherRouter-Gegenstelle:** V0.10.161 DEV laut gemeinsamer Realabnahme (nicht durch dieses CI live installiert oder geprüft).  
**Status:** CODE-Korrekturen integriert; P7-010/RF01–RF04 isolierte Tests erfolgreich; automatische vollständige Frontend-/HA-Prüfung und echte HA-Timeout-Realabnahme getrennt bewerten. **Kein HA-REAL-PASS.**

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
- Gemeinsamer Frontend-/Browserworkflow: finalen SUCCESS-Status für die **letzte** Quellstandauslieferung unabhängig verifizieren; vor dessen Nachweis **kein vollständiger CI-PASS**.

Zwischenzeitlich rote Läufe dienten zur Fehlerentdeckung (RF02-Verletzung) bzw. zur Anpassung alter V4.11.98-Versionsprüfungen. Diese sind keine gültige Endabnahme für V4.11.99.

## Versionierung und Auslieferung

- Integrationsmanifest `0.25.17`, `build_info.py` `4.11.99`, `const.py` mit Runtime-Cache `41199r1`.
- Frontend-/Seitenleisten-/Dashboard-Spiegel synchronisiert; `SHA256SUMS_FRONTEND.txt`, `frontend/assets.json`, Runtime-Manifest, Modulmanifest und DRA-Provenienz aktualisiert.
- Produktiv geändert: `frontend/modules/weather/consumer-client.js` (Diagnose) und `frontend/modules/weather/precipitation-layer.js` (Prioritätsprüfung des regionalen Bestandsschutzes). Keine andere Mosaik-/Providerarchitektur.
- Installation ausschließlich aus `TheDaimos/gewitterradar@deploy/dev` via Deploy Relay Agent, **Commit mit `deploy/dev` unmittelbar vor Installation prüfen**. Im DRA nach Installation Versions-/Runtime-/Modulsatz-/SHA-Identität auslesen; Browser-Cache vollständig aktualisieren.

## Noch ausdrücklich offen für HA-REAL-PASS

Eine **kontrollierte echte HA-/Firefox-Prüfung** der aktualisierten Diagnose mit gleichzeitiger DWD/NASA-Lieferung, einschließlich gleicher Korrelationskennung für `v2_draw_audit` und `v2_layer_swapped` sowie `observed_draw_orders`/Verifikationswert. Zusätzlich das Verhalten bei einer **tatsächlich** aufgetretenen DWD-`coverage_timeout`-Situation mit bestehendem, fachlich zulässigem Regionalradar messen; keine produktive Providerstörung zu Testzwecken. Die echten UTC-Originalalter, 45-s-Frist, Schutzende, Wiederherstellung und sichtbaren Kartenpixel getrennt anhand neuer synchroner GR-/WR-Exporte bestätigen. Die bereits früher gemeinsam akzeptierten Zoom-/Geografie-/Firefox-Realtests nur bei neuer Regression oder unpassendem Versionsstand erneut durchführen.

Private vollständige Exporte ausschließlich nach `TheDaimos/Project-Log-And-Export`. WR-Koordination: `TheDaimos/weather-router-dev@deploy/dev/docs/p7-010-coordination/GR_TO_WR_2026-10-19_GR_RF04_V41199_DIAGNOSE_UND_REGIONALSCHUTZ.md`. Keine sensitiven Diagnose-Rohdaten im öffentlichen Repository.

**C.K. – Eine Idee weiter gedacht.**
