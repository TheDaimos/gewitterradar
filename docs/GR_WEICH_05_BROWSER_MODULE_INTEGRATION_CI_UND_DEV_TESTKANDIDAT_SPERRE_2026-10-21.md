# GR-WEICH-05 – Chromium-Modulintegration mit echten Bildpixeln und DEV-Kandidat-Sperre

**Datum:** 21.10.2026  
**Repository/Zweig:** `TheDaimos/gewitterradar@deploy/dev`  
**Version:** V4.11.100 DEV, unverändert  
**Eingangs-HEAD:** `761010c7e8683b32a996e27d84e8350c7e319cf1`  
**Status:** Echte isolierte Browserpixelprüfung mit originalen produktiven Darstellungs-/Raster-Labor-Methoden durchgeführt. **Kein vollständiger V1-/V2-Produktintegrationstest, keine DRA-/HA-Installationsfreigabe.**

## 1. Übernahme des Vorgängers und CI-Ausgangsprüfung

Der vollständige Bericht `docs/GR_WEICH_04_HISTORISCHE_CHROMIUM_PIXELABNAHME_UND_OFFENE_INTEGRATIONSREALTESTS_2026-10-21.md` wurde über GitHub gelesen. Die GR-WEICH-01-/02-/03-/04-Standards wurden übernommen. Die echten Actions-Push-Läufe des vorherigen Programmstands wurden erneut abgefragt:

- `39580187744` – Einstellungen und Versionsidentität: **completed/success**
- `39580187721` – Gewitterradar-Integration: **completed/success**
- `39580187819` – gemeinsames Frontend mit historischen Pixelbildern: **completed/success**

Die originalen historischen Profile V4.11.81 sind im GR-WEICH-04-Gate bereits tatsächlich gegen den aktuellen Referenzstand in Chromium ausgeführt und verglichen worden. Die bisherigen Formeln wurden nicht angefasst.

## 2. Neu implementierte echte Browser-Modulprüfung

Neue dauerhafte Datei `scripts/test-gr-weich-05-browser-integration.cjs`; aufgenommen in den existierenden Playwright-/Chromium-/Sharp-Workflow `.github/workflows/shared-frontend.yml`. Das Testskript lädt die **Originalquelltexte** der aktuell eingesetzten `frontend/modules/weather/display-menu.js` und `frontend/modules/diagnostics/raster-lab.js`, kapselt deren ES-Moduldeklarationen ausschließlich im isolierten Browser-Prüfhaken, registriert sie mittels ihrer originalen `installWeatherDisplayMenu`-/`installRasterLab`-Methoden und führt die echten Pane-Filter-/Previewmethoden im Chromium-DOM aus.

Die Testseite enthält ein echtes sichtbares Niederschlags-Pane und eine kontrollierte synthetische RGBA-Kachel mit transparentem NoData-Ausschnitt. Browser-Screenshots werden als PNG gespeichert; Sharp misst RGB-Werte von Kern, Rand, Außenbereich und NoData. Das Testprogramm speichert zusätzlich zu jedem Bild die tatsächlich berechneten und vom Browser wirksam gemeldeten CSS-Filter, Unschärfewerte und Vorschau-/Deckkraft-Zustände in `pixel-results.json`.

**Prüfdimensionen:** alle vier Modi; Browser-Gerätefaktor 1 und 2; Kartenzoom 8 und 9; simulierter Wechsel der URL-Zoomgrenze 18 → 10 → 18 (V2-artig → V1-artig → V2-artig); Pixelvergleich vor/nach Wechsel; `zoomend` über die tatsächliche Display-Modulregistrierung; Raster-Labor-Vorschau mit abweichender Unschärfe/Deckkraft und Rücksetzung. Der Erfolg des echten Browser-Jobs zeigt, dass der gewählte Modus im sichtbaren Pane bleibt und dass die verglichenen Pixelproben beim Wechsel der URL-Zoomobergrenze in dieser isolierten Karte unverändert bleiben. Damit wurde der seit GR-WEICH-02 bestehende Unterschied zwischen URL-Obergrenze und Bildauflösung **auch im echten Browser** statt nur als Formel geprüft.

**Präzise Testgrenze:** Der Browser-Test verwendet einen kleinen **testseitigen Leaflet-ähnlichen Kartenereignishalter** und schaltet dessen aktive `layer.options.maxNativeZoom` um. Er lädt weder das gesamte Home-Assistant-Frontend noch `precipitation-layer.js` oder den produktiven asynchronen `raster-mosaic-grid-layer.js`-Kachelstapel als ausführendes End-to-End-System. Daher ist der getestete Wechsel **kein fachlich vollständiger V1→V2- oder V2→V1-Layer-Swap**, und Verzögerungen/Abbrüche, kartografische BBOX/Quellen-/Regionwechsel und echte konkurrierende V2-Responses sind durch dieses Gate **nicht** abgenommen. Ebenso wurde das Raster-Labor-Vorschau-/Rücksetzverfahren im echten DOM mit ursprünglichen Methoden geprüft, **nicht** sein vollständiger Schaltflächen-/Dialogablauf mit Referenz- und Versuch-Auswahl.

## 3. Reale Belege und Fehlersuche

Realer GitHub-Actions-Gate-Nachweis: [gemeinsames Frontend, Lauf 39582002828](https://github.com/TheDaimos/gewitterradar/actions/runs/39582002828), Einzelschritt `GR-WEICH-05 actual display-module and Raster-Labor Chromium pixels`: **success**, anschließender Schritt zum Hochladen der Pixelbilder: **success**.

Authentisches Bildartefakt: [gr-weich-05-browser-integration-pixels, ID 12337346136](https://github.com/TheDaimos/gewitterradar/actions/runs/39582002828/artifacts/12337346136) (1.108.787 Bytes). Darin liegen PNGs der einzelnen Modi, Zoom-/Layerreferenzen und Laborvor-/nachzustände sowie `pixel-results.json`. Dies ist ein nachweislich wirklich ausgeführter Chromium-Lauf; die genauen individuellen RGB-Zahlen sind über die Datei im Artefakt nachlesbar und werden ohne separates Auslesen nicht erfunden.

Die vorangegangenen echten Versuchsläufe haben ausschließlich Fehler im Browser-Prüfhaken sichtbar gemacht: zunächst eine nicht aufgelöste Modulregistrierung (`installDisplay is not defined`), anschließend eine unzugängliche globale Funktion (`window.installDisplay is not a function`). Ursache waren ES-Moduldeklarationen (einschließlich benanntem `export { ... }`) und die Test-Injektion in den Browser-Skriptkontext. Sie wurden **nur im Testadapter** korrigiert, nicht durch Änderungen an Produktmodulen. Playwright konnte den bereits etablierten Chromium-Browser schließlich vollständig ausführen.

## 4. Tatsächliche Commits

| Commit | Inhalt |
| --- | --- |
| `855aecc04faf89ef2e5cf4cd38389af58df96cb3` | Browser-Prüfprogramm mit originalen Modulen, synthetischem Niederschlagsraster, Screenshots und echten Pixelvergleichen |
| `1bbce37bb5d7da81e79e5b0f1c88e05b2c393a0d` | GR-WEICH-05-Schritt und eigenes GitHub-Actions-Pixelartefakt im bestehenden Frontend-Workflow |
| `5ebbe16f9b68ea1e4b571e6666f42ed664cc5d6b` | Browsermodul-Registrierung gezielt korrigiert |
| `084f558a7bb72e61b81596e858bdb16ef65d24eb` | Isolierter lexikalischer Skriptkontext pro Originalmodul im Browser |
| `29257e400a3dead1a00f3429c78362e3dc5017b2` | Benannte ES-Modul-Exports im ausschließlich testseitigen Adapter unterstützt; erfolgreicher Test-/CI-Codecommit |

**Keine Änderung am Produktionscode.** Weder `frontend/` noch `dashboard/dist/` oder `custom_components/gewitterradar/frontend/` wurde verändert; die bestehenden Spiegel und `SHA256SUMS_FRONTEND.txt` bleiben daher konsistent zum GR-WEICH-04-Stand. Keine neue Wetter- oder Rasterarchitektur, kein neuer Produkt-Timer, keine Versionsänderung.

## 5. CI-Matrix und noch offene Browserabnahme

Die neuen Prüfungen wurden in den vorhandenen gemeinsamen Frontendworkflow eingebunden. Der Einzel-Browserpixeltest und Upload waren am Commit `29257e400a3dead1a00f3429c78362e3dc5017b2` erfolgreich. Die Ergebnisse aller drei vollständigen Pushläufe werden gesondert im Schlussabschnitt auf dem finalen Dokumentationsstand angegeben.

| Prüffeld | Status |
| --- | --- |
| GR-WEICH-04 historisches Originalprofil in Chromium | PASS, bereits zuvor im Projekt durchgeführt |
| GR-WEICH-05 Original-Displaymodul auf sichtbarem Browser-Pane | **PASS, isolierter Browserhaken** |
| GR-WEICH-05 vier Modi, Zoom, URL-Zoomgrenzen, Pixelstichproben | **PASS, isolierter Browserhaken** |
| GR-WEICH-05 originaler Labor-Pane-Preview-/Restorecode | **PASS, isolierter Browserhaken** |
| Echte Produkt-V1-/V2-Kachelstapel in Chromium | **OFFEN** |
| Konkurrierende/stornierte V2-Antworten und Quellen-/Regionwechsel | **OFFEN** |
| Raster-Labor kompletter Dialog und Benutzereingaben in Chromium | **OFFEN** |
| Browserfamilien außerhalb Chromium | **OFFEN** |
| HA-DEV-/HA-PROD-/DRA-Installation | **NICHT durchgeführt** |

## 6. DEV-Testkandidat – noch keine Freigabe

Der Kandidat bleibt **gesperrt**, da die vom Auftrag ausdrücklich vorausgesetzte **vollständige Browserintegration** (produktiver V1-/V2-Renderpfad mit asynchronem Wechsel plus kompletter Raster-Labor-Dialog) noch nicht erfolgreich abgenommen ist. Der technische Stand V4.11.100 DEV darf nicht als fertig freigegebener GR-WEICH-05-Testkandidat bezeichnet werden.

Nach vollständiger Abnahme sind zwingend festzuhalten: unveränderliche Commit-SHA des dann geprüften Codes, vollständige Push-Run-IDs, Abgleich von `SHA256SUMS_FRONTEND.txt`, DRA-Rückfall-Snapshot und installierter Ausgangsversion, praktische Android-/Desktop-Prüfmatrix (alle vier Modi bei Zoom 8–13, V1↔V2, Quellen- und Regionwechsel, Raster-Labor-Vorschau und Restore), GR-/WR-Diagnosekorrelation mit UTC und Abbruch bei fehlenden Kacheln, falschem Quellenrouting, unerwarteten Filtern, Render-Lücken oder Aktualisierungsverlust.

**Unverrückbare Sperren:** Keine DRA-Installation, keine HA-DEV-/HA-PROD-Änderung (VM 109 / VM 101), kein HA-REAL-PASS, keine Änderung an WeatherRouter, UTC-/V1-/V2-/Sicherheitsverträgen, keine Wolken-/Windfahnen-/Deckkraftumbauten. Betreiberzustimmung bleibt Voraussetzung jeder späteren Installation.

**C.K. – Eine Idee weiter gedacht.**

## 7. Verifizierter CI-Zwischenstand

Am Programm-/Prüfcommit `29257e400a3dead1a00f3429c78362e3dc5017b2` wurden `39582002786` (Einstellungen/V4.11.100) und `39582002651` (Integration) jeweils als **completed/success** zurückgelesen. Im Frontend-Lauf `39582002828` wurden sowohl der neue GR-WEICH-05-Browserpixeltest als auch die Sicherung des zugehörigen Pixelartefakts mit **success** ausgeführt. Der Gesamt-Workflow war bei der letzten Prüfung noch mit den vorhandenen späteren Browserprüfungen beschäftigt; bis zu dessen erfolgreichem Abschluss wird **kein Gesamt-CI-PASS** behauptet.

## 8. Abschließende CI-Rückprüfung

Der zuvor als laufend dokumentierte gemeinsame Frontend-Workflow `39582002828` wurde über die echten Jobdaten zuletzt als **completed/success** verifiziert (keine fehlgeschlagenen Schritte). Gemeinsam mit `39582002786` (Einstellungen/Identität, success) und `39582002651` (Integration, success) ergibt sich damit **CI-PASS für den real ausgeführten isolierten GR-WEICH-05-Browsermodultest am Commit `29257e400a3dead1a00f3429c78362e3dc5017b2`**. Ungeprüfte produktive asynchrone V1-/V2-Ende-zu-Ende-Abläufe und der vollständige Labor-Dialog bleiben ausdrücklich offen; deswegen ist die Vorbereitung beziehungsweise Freigabe eines DRA-/HA-DEV-Testkandidaten weiterhin **gesperrt**.
