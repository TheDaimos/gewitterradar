# Gewitterradar V4.11.99 DEV – WL-02: Fortsetzung P1-A bis P1-D, Rasterbudget, Datumsgrenze, Regressionen

**Stand:** 20.10.2026, Entwicklungsfortsetzung auf ausschließlich `TheDaimos/gewitterradar@deploy/dev`.  
**Ausgangs-HEAD (nach gelesener vollständiger Übergabe):** `c1bb3f5358214e085d9b104af60e77dd0e4dee92`.  
**Neuester fachlicher Quellcode-HEAD dieser Runde:** `169bac89850b6c5fe542d9f90897041bc3ebb199`.  
**Version ausdrücklich unverändert:** `V4.11.99 DEV`, Runtime `41199r1`, Modulset `E411-99A1`, Integration `0.25.17`, Modul `weather.layer-menu` `1.1.5`. **Keine neue DRA-Installation oder Zwischenversion freigegeben.**

## 1. Übernommene Aufträge und Bestandsschutz

Vollständig gelesen: `docs/HANDOFF_GR_V41199_WL02_CI_PASS_HA_REALTEST_OFFEN_2026-10-20.md`, `docs/V4_11_WL_02_GENERIC_WR_RASTER_RENDERER_ENTWICKLUNGSAUFTRAG_2026-10-19.md`, `docs/V4_11_WL_02_FORTSETZUNG_ZEICHENSTATUS_UTC_CI_2026-10-19.md`, `docs/V4_11_WL_02_KOORDINATION_CI_IMPLEMENTIERUNG_PRUEFBERICHT_2026-10-19.md`, `docs/V4_11_WL_02_CODE_REVIEW_OFFENE_VERTRAEGE_NACHARBEIT_2026-10-19.md`, WL-01-Inventur und Nicht-Niederschlags-Audit sowie `docs/GR_RF04_ABSCHLUSS_V41199_CODE_CI_HA_STATUS_2026-10-19.md`. Aus der **privaten** WR-Koordination wurden `KOORDINATION_AN_GR_WL02_CI_PASS_WEITERARBEIT_MD_EINZEILER_2026-10-19.md` und `REGEL_GR_WR_ENTWICKLUNGSANTWORTEN_MD_GITHUB_DIREKTLINK_2026-10-19.md` gelesen. Zusätzlich kontrolliert: WR `docs/CONSUMER_API_V1.md` und `consumer_capability_map.json`.

**Schon vorhandene Lösungen NICHT neu implementiert:** V1-Wolken-/Wind-Grundadapter, WR-Objekt-Coverage, globale/antimeridiane Quellabdeckung, getrennte Schalter, Generationen/Abbrüche, 300-s-Ruheaktualisierung, kanonische XYZ-/WMS-Berechnung, externe HTTPS-Legende, UTC-Offsetnormalisierung, echte `drawImage`-Zählung und die bisherigen Manifest-/Spiegel-/SHA-Reparaturen. Der geschützte Niederschlags-V1/V2-Renderer sowie NASA/DWD/P7-010/GR-RF-01–04 wurden nicht umgebaut. Keine WR-/OPERA-Produktivdateien und keine privaten Erweiterungen geändert.

## 2. Neue nachgewiesene Fehler und Codeänderungen

### P1-C – Acht belegte Bildplätze verursachten vorher künstliche Fehler

**Vorheriger wirklicher Programmfehler:** `frontend/modules/weather/layer-menu.js` beendete jede weitere Bildkachel unmittelbar mit `raster_tile_budget`, sobald `GENERIC_TILE_BUDGET.inFlight >= 8` war. Gerade bei zwei aktivierten Ebenen konnten damit Kacheln allein wegen des laufenden Parallelbetriebs als fehlerhaft markiert werden, ohne überhaupt eine HTTPS-Anfrage begonnen zu haben.

**Korrektur:** Der bestehende WL-02-Adapter benutzt jetzt einen gemeinsamen, begrenzten **FIFO-Warteplaner für Wolken und Wind**: höchstens **8 tatsächlich parallel laufende Bildanforderungen**, maximal **64 zusätzliche wartende Aufgaben**. Freie Plätze geben wartenden Aufgaben die nächste Gelegenheit; das Warten ist kein `tileerror`. Eine bereits wartende Aufgabe wird bei Karten-/Layerwechsel vor dem Netzwerkstart aus der Warteschlange entfernt. Bei echten Überlastungen jenseits der endlichen Warteschlange entsteht weiterhin ein nachweisbarer, begrenzter `tile_queue_full`-Fehler statt unbegrenzten Speicherverbrauchs. Zeitüberschreitung, HTTPS/CORS-Fehler, Abbruch und `drawImage`-Nachweis bleiben getrennt. Zusätzlich wird eine veraltete `loadLeafletJs`-Fortsetzung bei tatsächlich ersetzter Karte verworfen.

**Abnahmegrenze:** Dies ist eine echte interne WL-02-Konkurrenz- und Abbruchverbesserung. Der P7-010-Niederschlagsrenderer verwendet weiterhin seinen **getrennten, geschützten** Ressourcenplaner. Ein gemeinsames WL-02+Niederschlag-CPU-/RAM-/Netzbudget oder ein Last-PASS in echter HA-Laufzeit ist hiermit **nicht** nachgewiesen. Die bestehende Architektur wurde nicht verdoppelt.

### P1-A/P1-B – Leaflet-Datumsgrenze und Weltkopien

**Vorheriger wirklicher Programmfehler:** Die bislang benutzte `bbox`-Erstellung setzte `west=Math.max(-180,getWest())` und `east=Math.min(180,getEast())`; danach wurde `east>west` verlangt. Ein sichtbarer Kartenausschnitt wie 170° bis 190° östliche Länge wurde damit still auf die halbe Fläche verkürzt. 190° bis 210° wurde sogar fälschlich als unzulässig behandelt.

**Korrektur:** `genericRasterViewportBbox` normalisiert über den Antimeridian reichende und bereits um 360° verschobene Leaflet-Längengrade in den **bereits unterstützten WR-V1-Querungs-BBOX-Vertrag**, ohne Teilbereiche abzuschneiden. Eine wirklich weltumspannende Ansicht wird als geographisch begrenzte volle Welt-BBOX angefragt. Ungültige oder leere Ausschnitte bleiben gesperrt, Breitengrade auf ±85° begrenzt. `L.gridLayer` darf die Welt für die Anzeige an der Datumsgrenze geordnet umbrechen (`noWrap:false`); die bestehende kanonische URL-Berechnung und der pixelgenaue, datumsgrenzensichere Zuschnitt bleiben maßgeblich.

**Abnahmegrenze:** Der kontrollierte Zahlen- und Geometrievertrag ist testbar; ob ein **wirklicher** WR-Wolken-/Wind-Anbieter über der Datumsgrenze die CORS-tauglichen tatsächlichen Pixel korrekt liefert, bleibt ein getrennter HA-Browser-Realtest.

## 3. Genaue Commits und berührte Dateien

| Commit | Umfang |
| --- | --- |
| [`7db06c0533506bb34dbd935c4b0f966e04b52f5f`](https://github.com/TheDaimos/gewitterradar/commit/7db06c0533506bb34dbd935c4b0f966e04b52f5f) | Begrenzte WL-02-Warteschlange, Abbrüche, Kartenwechselprüfung, Schedulerregressionen, alle drei JS-Spiegel |
| [`ad1166c6869b98b79957d183c5e5970dffe0a184`](https://github.com/TheDaimos/gewitterradar/commit/ad1166c6869b98b79957d183c5e5970dffe0a184) | Sortierte, korrekte SHA256-Inventur; Zwischen-CI-Fehler `Checksum inventory stale` explizit beseitigt |
| [`f0b839d7cb3e6d8b7ddb667ee8e89a5ce9ca7f50`](https://github.com/TheDaimos/gewitterradar/commit/f0b839d7cb3e6d8b7ddb667ee8e89a5ce9ca7f50) | Geschützter isolierter P7-010-Workflow reagiert zusätzlich auf WL-02-Quellcode und dessen Testskript |
| [`169bac89850b6c5fe542d9f90897041bc3ebb199`](https://github.com/TheDaimos/gewitterradar/commit/169bac89850b6c5fe542d9f90897041bc3ebb199) | Datumsgrenzen-/Weltkopien-Normalisierung, WR-BBOX-Kontext, Geo-Regressionen, alle drei JS-Spiegel und geordnete SHA256 |

Im Vergleich `c1bb3f5...169bac89` sind ausschließlich sieben vorgesehene Dateien betroffen: `frontend/modules/weather/layer-menu.js`, beide gleichnamigen HA-/Dashboard-Spiegel, `scripts/test-v411-weather-router.mjs`, `tests/wl02-coverage-contract.test.mjs`, `SHA256SUMS_FRONTEND.txt`, `.github/workflows/p7-010-raster-isolated.yml`. **Bytegleiche Auslieferung** der drei JS-Kopien am Quellcode-HEAD: Git-Blob `96f2bfe8875c4b0baddfbd98213e2c23a980718e`. Neue tatsächliche SHA256 dieser drei entsprechenden JS-Inhalte: `e1c05f9f28ac26df508676d1f274d7c8c86f45922f202c12b6abedd4e3fdceae` (die beiden ausgelieferten Kopien in der sortierten Inventur). Kein Modul-/Runtime-/Cacheversionswechsel und keine Installationsbehauptung.

## 4. Regressionen und GitHub Actions auf dem jüngsten fachlichen Quellcodecommit

**Exakt geprüfter Programmcommit:** `169bac89850b6c5fe542d9f90897041bc3ebb199`. Unabhängig vom GitHub-HEAD etwaiger nachfolgender Dokumentationscommits.

| GitHub-Lauf | Umfang | Ergebnis bei der Erstprüfung |
| --- | --- | --- |
| [39373136470](https://github.com/TheDaimos/gewitterradar/actions/runs/39373136470) | P7-010 – **18 tatsächlich ausgeführte isolierte Tests**, einschließlich GR-RF01–04, DWD/NASA, UTC-/Altersvertrag, Zoom, Cuba-/Regional-Coverage, Quellpriorität, Satellitenwiderruf, WMS/XYZ und Antimeridian-Zuschnitt | **SUCCESS**, Job `118465230122`, Log-Ende `P7-010 OK: 18 isolierte Tests` |
| [39373136466](https://github.com/TheDaimos/gewitterradar/actions/runs/39373136466) | V4.11.40 Modulbestand und Android-Schutz | **SUCCESS** |
| [39373136689](https://github.com/TheDaimos/gewitterradar/actions/runs/39373136689) | V4.11.99 Einstellungen, Version, Laufzeitidentität | **SUCCESS** |
| [39373136514](https://github.com/TheDaimos/gewitterradar/actions/runs/39373136514) | HA-Paket, HA-Testlauf, HACS, Hassfest und WL-02-Geometrietests | **SUCCESS**, vier Jobs |
| [39373136523](https://github.com/TheDaimos/gewitterradar/actions/runs/39373136523) | Gemeinsames Frontend, WL-02-Scheduler-/Datumsgrenzentests, Ausgabeidentität, Node-Syntax und Browserregressionen | **COMPLETED/SUCCESS**, Job `118465229825`; sämtliche Schritte einschließlich `scripts/test-v411-weather-router.mjs`, Frontend-Identität, Browser- und Auslieferungsprüfungen bestanden |

**Konkrete Korrektur zu einem zwischenzeitlichen roten Lauf:** Der erste neue Frontendlauf [39372535571](https://github.com/TheDaimos/gewitterradar/actions/runs/39372535571) meldete im Prüfschritt `Canonical frontend contract` eine **unsortierte** SHA256-Datei, nicht eine falsche JS-Spiegelidentität. Commit `ad1166c6...` sortierte die neu berechneten SHA-Werte, ohne Prüfungen abzuschalten. Dieser historische Befund ist nicht als aktueller Codefehler zu zählen. **Aktuelle endgültige CI-Prüfung:** Auch der Frontendlauf `39373136523` wurde für exakt `169bac89850b6c5fe542d9f90897041bc3ebb199` als `completed/success` mit Job `118465229825` bestätigt. Damit haben **alle fünf** hier benannten Push-Prüfläufe des jüngsten Programmcommits erfolgreich abgeschlossen; **CI-PASS gilt ausschließlich für diese automatisierten Prüfungen** und nicht als HA-Realtest.

Weitere vorhandene Frontendprüfungen testen das vorhandene Wettermenü, die Darstellung, Android-/Browser-/Panel-Regressionsfälle und unveränderte V1/V2-Integration. Synthetische Geometrie- und Bildladeproben sind **kein** Ersatz für die echte meteorologische Pixelabnahme.

## 5. P1-A bis P1-D: ehrliche offene Abnahmegates

| Thema | Belegt | Offen |
| --- | --- | --- |
| **P1-A WR-Consumer-V1-Vertrag** | Die vorhandene authentifizierte V1-Verbindung, Discovery-/Capabilities-/Resolve-Codepfade und WR-Schemata wurden gelesen; der Rasteradapter akzeptiert ausschließlich geprüfte `ready/raster_tile`-Verträge. | Für **beide** Capabilities `weather.satellite.clouds` und `weather.model.wind_10m.layer` je ein **wirklicher** `ready`-Resolve samt fachlich geeigneter `resource.semantics`, UTC-`data_time`, bestätigter Provenienz, Anbieter-/Rechte-/Abdeckungskette. Katalog-`available` ist kein Lieferbeweis. |
| **P1-B Kacheln, echte Bildpixel** | Kontrollierte XYZ/WMS-Projektion, regionaler Pixelzuschnitt, Welt-/Datumsgrenzenkontrakt, Lade-/Abbruch-/Zeichenoperationsregressionen. | Tatsächliche HTTPS/CORS-/WMS-Kacheln von WR, nachweislich sichtbare Nutzpixel statt nur `drawImage`, NoData/Transparenz, Legende/Farbsemantik, Modell-/Beobachtungsbezeichnung, reale native Zoom- und Lizenzbedingungen. |
| **P1-C Karten-/Ressourcenlebenszyklus** | FIFO 8 aktiv/64 wartend innerhalb der **zwei** WL-02-Ebenen, Abbruch alter Anforderungen, Begrenzung, kontrollierte Scheduler-Regression, Schutz unveränderten P7-010. | Gemeinsame CPU-/RAM-/Netzlast mit simultanem Niederschlagsmosaik; echte Chrome/Firefox/Android/iPad-/Sichtbarkeits-/Reconnect-/Fensterwechsel mit Livebildern und beobachteten Anfragen. |
| **P1-D Abschluss** | Aktuelle automatisierte GR-RF-/P7-/Wetterfrontend-/Paketprüfungen (genaue Links oben); V4.11.99-Identität geschützt. | Öffentliche CI aller fünf genannten Prüfläufe ist abgeschlossen und grün; echte HA-Installation/Realtests sind davon unabhängig weiter offen. Ohne belegte Quellen- und Bildqualität **kein WL-02-HA-REAL-PASS und keine neue DRA-/Versionsfreigabe**. |

**Weiterhin eigenständig offen:** Die spezielle echte DWD-`coverage_timeout`-Sequenz mit schon laufender 45-s-Regionalzurückhaltung aus GR-RF04. Der reguläre Deutschland–Kuba–Deutschland-Realtest und die synthetischen RF04-Sicherheitsregressionen gelten als bisher erledigt; künstliche Ausfälle eines produktiven Wetterdienstes sind hierfür keine zulässige Ersatzabnahme.

## 6. Präziser Folgeauftrag bei verfügbarem Home Assistant

Erst nach einer **nachweislich passenden** installierten GR-/WR-Kombination und ausdrücklicher technischer Installationsfreigabe:

1. Für Wolken und Wind **getrennt**: `weather_router/consumer/discovery` → `.../capabilities` → `.../resolve` mit Profil `gewitterradar`, expliziter Karten-`bbox`, `time:{mode:"latest"}` und korrelierbarer ID. `ready` und `unavailable` mit richtigen Gründen unterscheiden; Anbieterwahl bleibt beim WR. Fehlende tatsächliche Eignung ist ein Blocker und kein angeblicher Rendererfehler.
2. Pro wirklich gültiger `raster_tile`-Antwort mindestens repräsentative HTTPS-XYZ/WMS-Kacheln im echten Browser prüfen: CORS, Quell-`valid_at`/UTC, `freshness`, regionale/randgenaue Geografie und transparente Bildanteile, Quelle/Attribution/Lizenz, Semantik und gegebenenfalls korrekte Legende. `drawImage` allein nicht als Pixel- oder Messwertbeleg gelten lassen.
3. Beide Ebenen getrennt und gemeinsam mit Niederschlag einschalten, schneller Zoom/BBOX-Wechsel, sichtbarer/stiller Kartenbereich, Karten-/Fenster-/Vollbild-/Seitenwechsel, Hintergrund/Vordergrund, Reconnect/Abschalten. Den **wirklichen** Ressourcenverlauf (Warteschlange, parallele HTTP-Bilder, fehlgeschlagene/abgebrochene Anfragen, CPU/RAM) erfassen, einschließlich Antimeridian-/Weltkopien-Anzeige.
4. Desktop, Firefox, Android und iPad sowie die überlieferten Niederschlags-/DWD-/NASA-/V1-/V2-/Zeit-/Geografie-Regressionen mit tatsächlicher HA-/Browserlaufzeit abnehmen. Negative Berechtigungs-/Coveragefälle ohne künstliche produktive Wetterproviderstörung.
5. Rohdiagnosen einschließlich etwaiger Kartenkoordinaten, Bild-URLs, Authentifizierungsdaten oder Export2Git-Protokolle ausschließlich privat nach `TheDaimos/Project-Log-And-Export@main`; im öffentlichen GR nur anonymisierte Prüfergebnisse. Den DWD-Timeout-Fall gesondert bei natürlich auftretendem realem Fehler erfassen.

**Keine Scheinquelle:** In dieser Entwicklungsumgebung bestand kein Zugriff auf die installierte Home-Assistant-Browserinstanz oder deren aktuelle autorisierte Consumer-V1-Liveantworten. Es wurden daher keine Provider-Pixel, privaten Diagnosen, tatsächlichen HA-Installationen oder Geräterealtests erfunden und kein neuer WR-Tile-Endpunkt angelegt.

## 7. Freigabetrennung

- **CODE-Teilstand:** Zwei konkrete Fehlerklassen (WL-02-Kachelkonkurrenz und Datumsgrenzen-Kartenkontext) implementiert, Spiegel und Prüfsummen synchronisiert, Regressionen ergänzt. Die Gesamtaufgabe WL-02 ist **nicht** vollständig endabgenommen.
- **CI-PASS:** Alle fünf automatisierten Push-Workflows zum fachlichen Quellcodecommit `169bac89850b6c5fe542d9f90897041bc3ebb199` einschließlich Frontend-/Browserprüfungen sind nach tatsächlicher Abschlusskontrolle `completed/success`. Die Auslieferungsspiegelsummen wurden geprüft; dies ersetzt keinen HA-Echtnachweis.
- **HA-REAL-PASS:** **OFFEN**, da keine echten Wolken-/Wind-Providerkacheln und keine gekoppelten Benutzer-HA-/Browser-Diagnosen überprüft werden konnten.
- **DRA-/Installationsfreigabe:** **NEIN**, keine neue installierbare Produktversion ausgelöst.
- **WL-03, WL-04, WeatherRouter OPERA:** außerhalb dieses Auftrags, unverändert.

**Verbindliche Kommunikation:** Nachfolgende Entwicklungsantworten weiterhin zuerst vollständig als echte GitHub-Markdown-Datei im passenden Entwicklungszweig speichern, danach rücklesen und dem Benutzer ausschließlich den ausgeschriebenen, tatsächlich existierenden GitHub-URL-Einzeiler übergeben.

**C.K. – Eine Idee weiter gedacht.**
