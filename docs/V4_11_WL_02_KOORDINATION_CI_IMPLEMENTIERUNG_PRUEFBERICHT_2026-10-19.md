# Gewitterradar WL-02 – Koordinationsauftrag übernommen, CI-Synchronisierung und Raster-Nacharbeiten

**19.10.2026 · `TheDaimos/gewitterradar@deploy/dev` · Keine neue Produktversion und keine DRA-Installationsfreigabe**

## 1. Verbindlicher Eingang / Ausgangsbasis

Vollständig gelesen und umgesetzt, soweit ohne laufende Home-Assistant-Instanz nachweisbar:

`TheDaimos/weather-router-dev@deploy/dev/docs/p7-010-coordination/KOORDINATION_AN_GR_WL02_CI_KORREKTUR_MANIFEST_SPIEGEL_2026-10-19.md`

**Ausgangscommit:** `4302f4e6f54502c7f0a7fa1afa59bc0932ba27af` (WL-02 auf vorhandener GR V4.11.99 DEV).  
Bereits vorhandene und geschützte Korrekturen: `1cf9ab36` WR-Objekt-`spatial_coverage`, `d5c9766f` Layer-Abbau/Generation, `8b59ffa8` UTC-/XYZ-RegExp/Kartenwechsel, `7a728a05` HA-Spiegel. Alle wurden übernommen statt blind erneut programmiert.

**Nachgewiesene ursprüngliche CI-Ausfälle:** Push-Workflows `39280845315`, `39280845413`, `39280845501`: `dashboard/dist/module-manifest.js` und das Dashboard-Laufzeitmanifest liefen auf Modulversion **1.1.4** statt kanonisch **1.1.5**; `frontend/assets.json` und `SHA256SUMS_FRONTEND.txt` enthielten ältere SHA-256-Werte; `scripts/test-v411-identity.mjs` erwartete die alte Modulversion und Cache-Revision. Das vollständige originale Prüfprotokoll liegt in der privaten WR-Koordination.

## 2. Tatsächlich veröffentlichte CI- und Auslieferungskorrektur

**Projektänderungen nur auf `TheDaimos/gewitterradar@deploy/dev`:**

- `frontend/gewitterradar.js` und beide Auslieferungskopien: importierter WL-02-Modulpfad von der alten `41109r1` auf bereits bestehende `41199r1` korrigiert, **keine** neue Produktversionsbehauptung.
- Dashboard `module-manifest.js`, `assets/gewitterradar-runtime-manifest.json` und `modules/weather/layer-menu.js` exakt auf kanonische Inhalte gespiegelt (1.1.5); HA-Auslieferung unverändert bytegleich zum kanonischen Modul.
- `frontend/assets.json`: echter SHA-256-Wert des aktuellen Runtime-Assetmanifests neu **aus den Originalbytes** berechnet: `a48369e89e8a2422e38ec0ceab5313d6379e3afcf9eeb91c1b29f7e4370322f8`, statt der alten unveränderten Prüfsumme.
- `SHA256SUMS_FRONTEND.txt` mit tatsächlichen SHA-256-Werten der jetzt identischen Auslieferungsbytes synchronisiert, später bei jeder weiteren WL-02-Dateiänderung erneut berechnet. Kein Test übersprungen oder abgeschaltet.
- `scripts/test-v411-identity.mjs`: bestehende reale kanonische Modulversion 1.1.5 und neue Importrevision 41199r1 als Soll-Identität eingetragen **erst nachdem** alle drei Versionsspiegel und die Asset-Inventur fachlich geprüft und wiederhergestellt waren.

**Initialer Spiegel-Fix, Abschlusscommit:** `83016213f4b121731979a4c4119f2a7f3950f984`.  
**Identitätstest-Fix:** `e9aaadecf3e59145d16d713296b1e2776e1ac735`.  
**Bestätigte öffentliche Push-Workflows zu `e9aaade...`:** 
- [39313880312](https://github.com/TheDaimos/gewitterradar/actions/runs/39313880312) **SUCCESS** – Einstellungen/Laufzeit.
- [39313880431](https://github.com/TheDaimos/gewitterradar/actions/runs/39313880431) **SUCCESS** – gemeinsames Frontend.
- [39313880443](https://github.com/TheDaimos/gewitterradar/actions/runs/39313880443) **SUCCESS** – Integration.

**Diese drei Resultate belegen die ursprünglich angeforderten CI-Fehlerkorrekturen auf einem konkreten Git-Quellstand; sie sind nicht automatisch die Abnahme aller späteren WL-02-Änderungen.**

## 3. Fortgesetzte WL-02-Entwicklung – echte fachliche Korrekturen

1. **Kanonischer XYZ- und EPSG:3857-WMS-URL-Helfer:** Der vorläufige WL-02-Pfad verweigerte valide WR-`{bbox-epsg-3857}`-Kachelvorlagen. Er verwendet jetzt den **bereits vorhandenen** P7-010-Helfer `rasterTileUrl` aus `modules/weather/p7-010/raster-tile-url.js` mit validierter HTTPS-Vorlage, sicherem Zoom-/XYZ-Format, ohne eigenen zweiten URL-Projektor. Unbekannte Platzhalter werden weiterhin abgewiesen; URL-Benutzerinformationen, Fragment und bekannte Secret-Queryfelder bleiben gesperrt. Für den vorhandenen Helper `z<=18` wird der native Zoom im generischen Blatt entsprechend begrenzt; höhere Leaflet-Zoomstufen sind nur Übervergrößerung.
2. **Karten-Ruhephase:** Bereits aktivierte Wolken-/Windebenen werden auch bei **unbewegter, sichtbarer Karte** höchstens alle **300 Sekunden** neu aufgelöst; im Hintergrund kein periodischer Netzabruf. Sichtbarwerden, Kartenbewegung und Kartenersetzung arbeiten weiter über die vorhandenen Generationen. Das neue Zeitintervall wird beim vollständigen Layerabbau entfernt. Damit bleiben vorherige Bilder nicht ohne weiteres Refresh-Ereignis für beliebig lange Zeit stehen.
3. **Attribution und Legendenbedienung:** Vorhandene externe Legendendaten erscheinen nicht länger nur als „Legende vorhanden“, sondern als berührbarer **`Legende öffnen`**-Link mit `target="_blank"` und `rel="noopener noreferrer"`. Die URL ist HTTPS, ohne Benutzerinfo, Fragmente und bekannte geheime Queryfelder. Quelle, UTC-`valid_at`, Datenalter und Attributionsangabe werden weiterhin im Capability-Eintrag angezeigt. Eine externe Legende ist kein Beweis für fachlich vollständige Provider-Metadaten.
4. **Vertragstests erweitert:** `scripts/test-v411-weather-router.mjs` prüft jetzt den kanonischen WR-Objekt-`bbox`-Vertrag, `global`, Antimeridian, ungültige Raumdaten, echte ID-Zuordnung für Wolken- und Windraster, beide zulässigen XYZ-/WMS-Formen, unbekannte Platzhalter, begrenztes Zoomschema, Lebenszyklus der Ruhephasenaktualisierung sowie den sicheren Legendenlink. Vorhandene Tests wurden nicht verwässert.

**Wichtige Folgecommits:**
- `97fb2683114cd3948a4a94914ddb6d4af55e0072`: echte WR-Verträge und Abdeckungstests.
- `05469ae303535e5334ca520a261c60ce4c0bc9b2` + `4e64653a8d2a0e7db5699b6dfde0a636772aeaa0`: kanonischer WMS-/XYZ-Quellcode in allen Spiegeln + tatsächliche Checksummen (zugehöriger erster Codecommit `82e7e3893d301a2e2b88a353c2a125a2eaf9d2c0`).
- `bf2a703e6ad09714dd8c0e7430b5957eaf2ab0a6`: WMS-/XYZ-Regressionstests.
- `88aee8252fbb20997aa642392e270a3133c9b375` + `28456407ec82ad4efcad86775a08fd63bbdbf6d8`: Timer-/Legendenänderung in drei Auslieferungsbäumen + Checksummen (kanonisch `16c5c3a97eb5ae7961f41e138fd8474a1d0a7c8e`).
- `6cef4a11804d01d8ee411f9020cc2c70b85c8a62`: zusätzliche Tests für timerbedingte Aktualisierung und sicheren Legendenlink.

## 4. Nachkontrolle der drei Frontend-Spiegel

Direkte aktuelle GitHub-Baumprüfung nach WL-02-Nacharbeiten, unabhängig von der CI:
- `frontend/module-manifest.js`, HA und Dashboard: **gleicher Blob** `3d4c64b469964047b59881bd4c24ce7b459d4eed`.
- `assets/gewitterradar-runtime-manifest.json`, HA und Dashboard: **gleicher Blob** `b8947b458e8ed32d66ada209199f998a77a5ae5c`.
- `gewitterradar.js`, HA und Dashboard: **gleicher Blob** `ecad267b80b1df2b4853fb382d26e10ae0514fa6`.
- WL-02-`modules/weather/layer-menu.js`, HA und Dashboard: **gleicher Blob** `198520221a713aabeb1e41aac7791216aa007992`.

Die nachfolgenden Nachträge dieses Berichts müssen die **exakt zugehörigen** GitHub-Actions-Pushlauftests zum jüngsten Quellcodecommit ausweisen; ältere grüne Läufe sind keine neue DRA-Freigabe.

## 5. Noch nicht nachgewiesene Realabnahmeschritte

- Tatsächlicher WR-V1-Provider-`ready`-Rasterantwortvertrag für `weather.satellite.clouds` und `weather.model.wind_10m.layer` in einer installierten Home-Assistant-Laufzeit, inklusive echter CORS-tauglicher HTTPS-Kachel und gegebenenfalls gültiger WMS-BBOX-Expansion.
- Echte Browserbildkachel-Laufzeiten, reale temporäre NoData-Lücken, genau georeferenzierte Randtransparenz, vollständige Kachelabschluss-Zählung und Farblegende/Qualität je realem Provider. Statische `rasterTilePixelCrops`-Verwendung beweist nicht, dass ein konkreter Provider seine NoData-Pixel semantisch richtig darstellt.
- Gemeinsamer Last-/Speicher-/Netzressourcenhaushalt mit dem vorhandenen, gesonderten P7-010-Niederschlagsplaner; die zwei generischen WL-02-Ebenen besitzen derzeit ein isoliertes Limit von maximal acht aktiven Bildanforderungen. **Keinen global gemeinsam nachgewiesenen Ressourcenbudget-PASS behaupten.**
- Korrelierte GR-/WR-Diagnosen, Android/iPad/PC, Karten-/Verbindungswechsel und **volle HA-REAL-PASS** noch nicht durch Benutzerinstallation nachgewiesen.
- Frühere separate GR-RF-04-Realzeitprüfung für DWD-`coverage_timeout`-Rückhaltung ist weiterhin offen und nicht durch diese WL-02-Korrekturen erledigt.
- **V4.11.99 DEV** bleibt installierte Grundlage; **keine** neue Produkt-/Modulsatz-/HA-Integration-/DRA-Version allein durch Teiltests.

## 6. Öffentliche CI-Abnahme auf dem letzten WL-02-Quellcodecommit

**Fest geprüfter Quellcodecommit:** `6cef4a11804d01d8ee411f9020cc2c70b85c8a62`.

| GitHub-Actions-Workflow | Run-ID | Job-ID(s) | Ergebnis |
|---|---|---|---|
| V4.11.99 settings navigation and runtime identity | [39315494673](https://github.com/TheDaimos/gewitterradar/actions/runs/39315494673) | `settings-navigation` **118275778393** | **SUCCESS** |
| Validate Gewitterradar integration | [39315494642](https://github.com/TheDaimos/gewitterradar/actions/runs/39315494642) | `package-contract` **118275778187**, `hacs-integration` **118275778477**, `hassfest` **118275778684**, `home-assistant-runtime` **118275778799** | **ALLE VIER SUCCESS** |
| Validate shared Gewitterradar frontend | [39315494702](https://github.com/TheDaimos/gewitterradar/actions/runs/39315494702) | `shared-frontend` **118275778626** | **SUCCESS** |

**Direkt aus dem vollständigen erfolgreichen shared-frontend-Jobprotokoll:**

- `node scripts/test-v411-weather-router.mjs`: `PASS: WeatherRouter Consumer V1, missing/offline distinction, hierarchical Layer Hub, WR display-menu and generic legend overlay.` – einschließlich der neu ergänzten Wolken-/Wind-Vertrags-, WMS-/XYZ-, Gebiet-, Timer- und Legendenregressionen.
- `node scripts/test-v411-identity.mjs`: `PASS: V4.11.99 DEV identity synchronized across frontend, runtime and DRA provenance on the existing deploy/dev channel.`
- Aus `scripts/verify-frontend.mjs`: `PASS: active version contract, exact delivery parity, assets and packages verified.`
- Beide Auslieferungs-Browserprüfungen und die vollständigen weiteren Workflow-Schritte abgeschlossen; kein Job mit `failure`.

**Diese CI-Prüfung weist die nachgewiesene Beseitigung der ursprünglichen Modulversions-/Spiegel-/SHA-Fehler sowie die neuen programmgesteuerten WL-02-Tests nach.** Sie ist ausdrücklich kein Ersatz für tatsächlich erfolgte Netzwerk-/HA-/Android-/iPad-Bildtests und keine DRA-Installationsfreigabe. Die Dokumentation wurde danach ergänzt; keine neue Produktversion oder Änderung der zu diesem CI-Lauf gehörenden Programmdateien.

## 7. Abnahmeentscheidung nach erfolgreichem CI-Lauf

| Prüffeld | Einordnung |
|---|---|
| Historische, präzise identifizierte CI-Ursachen | **KORRIGIERT** und in den drei genannten Pushläufen `e9aaade...` erfolgreich geprüft |
| Frontend-/HA-/Dashboard-Spiegel und Assetinventur | **STAND BESTANDSGEPRÜFT** am aktuellen Code; nachträgliche gezielte WMS-/Timerregressionen brauchen neuen CI-Nachweis |
| CODE-PASS für ursprüngliche CI-Korrektur und konkrete WMS-/Timer-/Legendenänderungen | **JA – anhand vollständiger öffentlicher CI und kanonischer Dateiabgleiche**; umfassende WL-02-Ende-zu-Ende-Freigabe weiterhin **OFFEN**, da echte Providerbilder und Lastabnahme fehlen |
| CI-PASS neuester WL-02-Nacharbeiten | **JA – drei zugehörige öffentliche Push-Workflows SUCCESS (oben exakt zugeordnet)**; das ist ein Code-/CI-Teilnachweis, kein vollständiger WL-02-HA-Bildnachweis |
| HA-REAL-PASS | **OFFEN** |
| DRA-/Installationsfreigabe | **NEIN** |

**Die Fehlerbehebungen bleiben ausschließlich im GR-Repository.** Keine WR-Provider-, OPERA-, DWD-/NASA-, V1-/V2-, WL-03-/WL-04-Änderungen; UTC-Vertragsgrenzen und Opt-in bleiben unberührt.

**C.K. – Eine Idee weiter gedacht.**
