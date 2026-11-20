# GR-WEICH-01 – Historische Niederschlagsweichzeichnung: geprüfte Teilreparatur, CI und noch offene Bildabnahme

**Datum:** 21.10.2026  
**Repository/Zweig:** `TheDaimos/gewitterradar@deploy/dev`  
**Historischer Vergleich:** V4.11.81 (`46754f6689b0b01f1a45287e21572ae04b90f3bd`), bevorzugter zusätzlicher Bildkandidat V4.11.82  
**Ausgangsversion:** V4.11.100 DEV  
**Gesamtstatus:** **TEILREPARATUR, kein GR-WEICH-01-Gesamt-PASS und keine Installationsfreigabe**

## 1. Ausgangslage und verpflichtende Vorarbeiten

Die vollständige Übergabe `docs/HANDOFF_GR_V411100_NIEDERSCHLAG_WEICHZEICHNER_REGRESSION_2026-10-21.md`, die gezielte Regressionsanalyse `docs/GR_WEICHZEICHNER_GEZIELTE_REGRESSIONSANALYSE_V41181_BIS_V411100_2026-10-21.md` und die Ursachenprüfung `docs/GR_NIEDERSCHLAG_WEICHZEICHNER_V411100_URSACHENPRUEFUNG_2026-10-21.md` wurden über GitHub gelesen und mit dem aktiven Quelltext abgeglichen. Beim Einstieg lag `deploy/dev` auf `cdd04340560274538fbc3f2d9112e0deca75e71f`.

Der Benutzer hat die funktionierende historische Wirkung unmittelbar nach Integration des Raster-Labors beobachtet. Die Anzeige **V4.11.82 DEV** im heutigen Raster-Labor war jedoch nachweislich fest codiert und ist **kein sicherer Versionsnachweis** der gegenwärtig ausgeführten Anwendung. Daher kann weder V4.11.82 als selbstständig im Browser nachgetestet noch ein eindeutig erster fehlerhafter Versionscommit behauptet werden.

## 2. Historischer Vergleich – belastbarer Umfang und Grenzen

| Baustein | Git-Referenz V4.11.81 | Ausgangsstand V4.11.100 | Bewertung |
| --- | --- | --- | --- |
| `frontend/modules/weather/display-menu.js` | Blob `f32b467fb69bd338d87d3878add266b5bf3a5a89` | Gleicher Blob | Die Rechenformeln selbst blieben bis zur Untersuchung unverändert; geänderte Quellmetadaten/Lebenszyklen können alte latente Fehler auslösen. |
| `frontend/modules/weather/precipitation-layer.js` | Blob `1166de0b1e0378b3b897312f52a825bf522d0e8e` | Blob `8e4ea1795a247c3282966ad656360876f1265d99` | Umfangreiche nachträgliche V1-/V2-/Mosaikänderungen; weiterhin zentraler Kandidat für geänderte effektive Quellmetadaten. |
| `frontend/modules/diagnostics/raster-lab.js` | Blob `cc18dc593da297a00049498d35f7164db546c078` | Blob `f4c86125ee9d5a8fe51f62a802af459b9727a7cf` | Spätere Änderungen der temporären Vorschau sowie zuvor statisch eingebrannte V4.11.82-Version. |

Dies ist eine geprüfte Matrix anhand der Quellen und ihrer tatsächlichen Blobkennungen, **kein historischer Pixelvergleich**. Die genaue erste Bildregression zwischen dem bestätigten guten Nutzerzustand und V4.11.100 bleibt offen.

## 3. Numerisch reproduzierter Profilwiderspruch

Die vorhandene Auto-Funktion nutzt `relativeZoom=zoom-nativeZoom+2`. `Weich` verwendet bei Zoom 8 die Auto-Referenz für Zoom 6; `Ausgewogen` verwendet mindestens 5,6 px. Das Ergebnis der Quellformeln bei Kartenzoom 8:

| Gemeldeter `maxNativeZoom` | Auto, px | Ausgewogen, px | Weich, px |
| ---: | ---: | ---: | ---: |
| 5 | 220,00 | 11,50 | 92,00 |
| 6 | 188,00 | 11,20 | 44,00 |
| 7 | 92,00 | 7,92 | 18,44 |
| 8 | 44,00 | 5,60 | 4,83 |
| 9 | 18,44 | 5,60 | 2,02 |
| 10 | 4,83 | 5,60 | 1,05 |
| 11 | 2,02 | 5,60 | 1,05 |
| 12 | 1,05 | 5,60 | 1,05 |

Insbesondere bei `nativeZoom=10` ist **Weich rechnerisch schwächer als Ausgewogen**. Das ist konsistent mit der beanstandeten Reihenfolge. Es beweist aber **nicht**, welchen `maxNativeZoom` und welche real sichtbare Rasterauflösung die vier Nutzerbilder tatsächlich hatten. `precipitation-layer.js` setzt bei V1 `layer.options.maxNativeZoom` aus `payload.max_zoom`; dieser Wert kann von meteorologischer Quellenauflösung abweichen. Die V2-Mosaikstufen sind separat zu korrelieren. Aus Sicherheits- und Regressionserhaltungsgründen wurden **keine Unschärfewerte pauschal angehoben und keine V1-/V2-Verträge geändert**.

## 4. Nachgewiesene und behobene Teilfehler

### A. Zoomaktualisierung aller Darstellungsmodi

In der bis V4.11.100 vorhandenen Funktion `_weatherDisplayEnsureZoomSync()` wurde beim Kartenereignis `zoomend` nach der Legendenaktualisierung **für jeden Modus außer Auto** vorzeitig zurückgekehrt. Aber auch `Weich` und `Ausgewogen` enthalten native-/kartenzoomabhängige Berechnungen. Ohne sonstige unabhängige Aktualisierung konnte der sichtbare Pane-Filter somit veralten. Die Sperre wurde gezielt entfernt, sodass die vorhandene `_weatherDisplayRefreshRenderedLayers()` auch für diese Modi ausgeführt wird. Es wurden keine zusätzlichen Zeitgeber, Kartenebenen oder Kachelrenderer eingebaut.

**Grenze:** Andere Render-/V2-Pfade konnten bereits unabhängig aktualisieren. Die behobene Ablaufbedingung beweist daher allein noch nicht die gesamte historische Bildregression.

### B. Raster-Labor-Laufzeitversion

Das Raster-Labor führte die Werte `4.11.82`, `41182r1` und den Dateinamen `gewitterradar_raster-lab_4.11.82.json` statisch; auch die Kopfzeile wies V4.11.82 DEV aus. Die Oberfläche, JSON-Metadaten und der Exportdateiname beziehen ihre Identität jetzt aus dem **bereits bestehenden** `APPLICATION_RELEASE` in `frontend/version.js`. Es wurde keine zweite unabhängige Versionsquelle eingerichtet.

### C. Gleichheit der installierbaren Frontend-Spiegel

Beide geänderten Frontendmodule wurden konsistent an alle drei bestehenden Auslieferungsorte übergeben:
- `frontend/modules/{weather/display-menu.js,diagnostics/raster-lab.js}`
- `dashboard/dist/modules/{weather/display-menu.js,diagnostics/raster-lab.js}`
- `custom_components/gewitterradar/frontend/modules/{weather/display-menu.js,diagnostics/raster-lab.js}`

Die generierte Bestandsdatei `SHA256SUMS_FRONTEND.txt` wurde nach einem realen fehlgeschlagenen gemeinsamen Frontend-Push-Lauf anhand des von der offiziellen Build-Prüfung ausgegebenen vollständigen SHA-256-Bestands aktualisiert, ohne den Prüfer zu umgehen.

## 5. Echte Git-Commits dieser Arbeit

| Commit | Inhalt |
| --- | --- |
| `2a62533b35d9d576e4fbbf39dce91ec8d630dee4` | Zoom-Stilaktualisierung und zentrale Raster-Labor-Version, drei Frontend-Spiegel; erster Regressionstest |
| `2cc1ff244e6bce13ebf12cd9563809dcce6212ac` | Neuen Test gegen spätere Versionsanhebungen entkoppelt und unzulässige Festschreibung des verbleibenden Fehlers entfernt |
| `34c20ed870ac64112afb9776a79ef5a9b0d7e284` | Frontend-Prüfsummenbestand mit echtem Build-Ergebnis synchronisiert |
| `e2806da22d9e8a678573078c019630c28365cfcf` | Den neuen GR-WEICH-01-Test in die öffentliche GitHub-Actions-Push-Prüfung eingebunden |

## 6. Neue Prüfung und reale GitHub Actions

Neuer dauerhafter Test: `scripts/test-gr-weich-01-regression.mjs`; er sichert die Zoom-Neuanwendung im Darstellungsmodul, die Bindung des Raster-Labors an die zentrale Versionsidentität und die numerischen Grenzen für Zoom 6–13 und `nativeZoom` 5–12. Er **ersetzt keinen Browser-Pixeltest**. Die vorhandenen geschützten historischen Prüfungen und der WL-02-Vertrag wurden nicht entfernt.

**Fehlgeschlagener tatsächlicher Zwischenlauf:** `39573689683` (gemeinsames Frontend), Fehler `Checksum inventory stale` in `scripts/verify-frontend.mjs`, nicht ein behaupteter Glättungs-Bildfehler. Daraufhin wurde der Bestand korrekt neu geschrieben.

**Echte Push-Läufe am letzten Programm-/Workflowcommit `e2806da22d9e8a678573078c019630c28365cfcf` (Abfragestand bei Berichterstellung):**
- [GitHub Actions 39573984635 – V4.11.100 settings navigation and runtime identity](https://github.com/TheDaimos/gewitterradar/actions/runs/39573984635): **SUCCESS**.
- [GitHub Actions 39573984655 – Validate Gewitterradar integration](https://github.com/TheDaimos/gewitterradar/actions/runs/39573984655): **SUCCESS**. HACS-Integration, Hassfest, Paketvertrag (einschließlich neu eingebundenem GR-WEICH-01-Test) und Home-Assistant-Testlauf erfolgreich.
- [GitHub Actions 39573984683 – Validate shared Gewitterradar frontend](https://github.com/TheDaimos/gewitterradar/actions/runs/39573984683): **SUCCESS**; der zuvor ausstehende gemeinsame Frontend-Lauf ist inzwischen erfolgreich abgeschlossen. Dies betrifft die vorhandenen Frontend-Schutzverträge, **nicht** einen historischen Weichzeichnungs-Pixelvergleich.

**CI-PASS für den geprüften Teiländerungsstand:** Alle drei konkreten Push-Gates sind erfolgreich. Dieser CI-PASS gilt nicht als visuelle Abnahme oder vollständiger GR-WEICH-01-Abschluss.

## 7. Noch zwingend ausstehende Arbeiten – P1 bleibt offen

1. Auf dem realen V1- und V2-Datenpfad für identische Quelle/Bildzeit/Zoom/Region die effektive native Bildauflösung und den zugelieferten `payload.max_zoom` beziehungsweise V2-Kachelmetadaten protokollieren. Den ersten tatsächlich schlechten Bildstand historisch gegen V4.11.81/82 isolieren.
2. V4.11.82 anhand eines tatsächlich ausgeführten historischen Builds statt der früher fest codierten Labor-Kopfzeile mit heutigen synthetischen Kacheln vergleichen. **Die ursprünglich abgestimmte optische Wirkung aller vier Modi ist noch nicht belegt wiederhergestellt.**
3. Für `maxNativeZoom` 8–12 die Differenz zwischen zulässiger URL-Zoomobergrenze und wirksamer Rasterauflösung fachlich aufklären. Erst mit diesem Nachweis den kleinsten semantisch korrekten Fix für die Profilstärken durchführen.
4. Filterwirkung an tatsächlich sichtbaren Browserpixeln messen, insbesondere nach Kartenzoom/-bewegung, V1-/V2-Aufbau/Tausch, geografischem Quellenwechsel und Raster-Labor-Referenz/Versuch/Schließen. Frühere bloße CSS-`url(...)`-Akzeptanz reicht nicht.
5. Bei jeder **weiteren** Programmänderung einen neuen erfolgreichen Push-Lauf am finalen Codecommit nachweisen; alle Auslieferungsspiegel, Manifest-/Prüfsummen- und DRA-Verträge erhalten.
6. Bei später ausdrücklich freigegebener DRA-DEV-Installation erst korrelierte HA-/WeatherRouter-/Browser-Realtests durchführen. **Kein HA-REAL-PASS, kein PROD-PASS.**

## 8. Freigabematrix

| Status | Bewertung |
| --- | --- |
| Historische Git-/Ursachenprüfung | **Teilweise nachgewiesen**; erster fehlerhafter Bildcommit offen |
| Zwei konkrete technische Teilkorrekturen | **Committed** |
| Neuer Schutztest innerhalb CI-Paketvertrag | **PASS** |
| CI-Gates des Teiländerungsstandes | **PASS**: alle drei Push-Workflows erfolgreich |
| Historische optische Gleichwertigkeit | **NICHT nachgewiesen** |
| Vollständiger GR-WEICH-01-Codeabschluss | **NEIN** |
| DRA-DEV-READY / Installationsfreigabe | **NEIN** |
| HA-DEV-/PROD-Installation oder Realabnahme | **NICHT durchgeführt** |

**Entwicklungsentscheidung:** Trotz erfolgreicher Teilreparatur ausdrücklich nicht zum getrennt zurückgestellten Wolken-/Deckkraft-/Windfahnenauftrag wechseln. Die vier historischen Niederschlagsmodi bleiben P1, bis ein echter historischer Pixelvergleich die Wiederherstellung belegt.

**C.K. – Eine Idee weiter gedacht.**
