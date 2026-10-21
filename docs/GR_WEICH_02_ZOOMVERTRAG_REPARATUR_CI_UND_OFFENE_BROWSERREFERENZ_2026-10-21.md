# GR-WEICH-02 – Reparatur des visuellen Zoomvertrags und verbleibende historische Bildprüfung

**Datum:** 21.10.2026  
**Repository:** `TheDaimos/gewitterradar`  
**Entwicklungszweig:** `deploy/dev`, keine weiteren Entwicklungszweige  
**Ausgangsversion:** V4.11.100 DEV  
**Status:** **Technischer Zoomvertrags-Fix committed; vollständige historische visuelle Abnahme noch offen. Keine HA-/DRA-Installationsfreigabe.**

## A. Verifizierte Ausgangslage

Der vollständige [GR-WEICH-01-Bericht](GR_WEICH_01_HISTORISCHE_WEICHZEICHNUNG_TEILREPARATUR_CI_UND_OFFENE_BILDABNAHME_2026-10-21.md), die [gezielte Git-Regressionsanalyse](GR_WEICHZEICHNER_GEZIELTE_REGRESSIONSANALYSE_V41181_BIS_V411100_2026-10-21.md) und die [vorherige Ursachenprüfung](GR_NIEDERSCHLAG_WEICHZEICHNER_V411100_URSACHENPRUEFUNG_2026-10-21.md) wurden übernommen. `deploy/dev` stand zu Beginn auf `19a769610d372e45f03bac0b1542b324247f9b39`.

**Historische Referenz:** `46754f6689b0b01f1a45287e21572ae04b90f3bd` (V4.11.81, Raster-Labor-Integration). Die unmittelbar angrenzende V4.11.82 ist eine vom Benutzer bestätigte visuelle Orientierung, aber die einstige statische Labor-Kopfzeile ist ausdrücklich **kein** gültiger Nachweis eines tatsächlich ausgeführten historischen Builds. V4.11.81 und V4.11.100 hatten denselben `display-menu.js`-Blob `f32b467fb69bd338d87d3878add266b5bf3a5a89`. Änderungen des V1-/V2-Rasterpfads veränderten die Eingabe-/Laufzeitumgebung dieses Moduls.

Die GR-WEICH-01-Verbesserungen (Zoom-Neuanwendung aller Modi, zentrale Labor-Versionsanzeige, drei Spiegel und Regressionstest) bleiben bestehen.

## B. Tatsächliche Ursache: URL-Zoomobergrenze statt Bildauflösung

**Codebefund:** `frontend/modules/weather/precipitation-layer.js` setzt für V1 `maxNativeZoom` aus `payload.max_zoom`. `frontend/modules/weather/p7-010/raster-mosaic-grid-layer.js` setzt `maxNativeZoom:18`, ausdrücklich damit der V2-Grid-Layer Kacheln bis Stufe 18 abrufen bzw. erzeugen kann. Dessen Kommentare erklären, dass Quellen darunter niedriger aufgelöste Ursprungskacheln verwenden und zuschneiden. Damit beschreibt `maxNativeZoom` beim V2-Mosaik **keine garantierte meteorologische Rasterauflösung**.

Bisher übergab `_weatherDisplayRasterTuning` diesen Leaflet-Zoomgrenzwert direkt an die Auto-/Weich-Formeln. Bei Kartenzoom 8 und `maxNativeZoom>=10` liefert die vorhandene, seit V4.11.81 unveränderte Rechnung Glättung nahe 1 px. Folglich wirkt `Weich` schwächer als `Ausgewogen`. Dieses Verhalten ist ohne irgendeinen Browserfehler aus dem Code reproduzierbar. **Der in konkreten Nutzerscreenshots verwendete Provider und dessen reale Pixelauflösung sind nicht rückwirkend belegt**; deshalb ist keine vollständige bildhistorische Ursachenzuschreibung möglich.

| Kartenzoom 8 / Referenz | Auto | Ausgewogen | Weich |
| --- | ---: | ---: | ---: |
| Früher mit gemeldeter Zoomobergrenze 10 | 4,83 px | 5,60 px | 1,05 px |
| Visuelle Referenzzoomstufe 7, unabhängig von URL-Obergrenze 10 oder 18 | 92,00 px | 7,92 px | 18,44 px |

Dies sind **berechnete Filterwerte**, keine gemessenen Browserpixel. Es wurde weder die Auto-/Weich-Formel umgeschrieben noch die Modi vertauscht.

## C. Durchgeführte Korrektur

Im bestehenden Modul `frontend/modules/weather/display-menu.js` wird eine eigenständige *visuelle* Zoomreferenz für die Glättungsberechnung verwendet. `layer.options.maxNativeZoom` bestimmt weiterhin die tatsächliche Kachelabruf- und Leaflet-Übervergrößerungsgrenze, **nicht mehr** die Stärke der Niederschlagsweichzeichnung. Sofern ein Renderer einmal eine gesichert gemessene Quellauflösung als `__grRadarVisualNativeZoom` bereitstellt, wird sie innerhalb 0–18 berücksichtigt. Ohne eine solche explizite Messung bleibt die bereits in der historischen Darstellungslogik vorhandene Zoomreferenz **7**, statt stillschweigend den V2-URL-Deckel 18 oder einen Provider-URL-Wert als physische Pixelauflösung auszugeben.

**Wichtige Begrenzung:** Die Referenz 7 bewahrt die ursprüngliche z7-Profilabstimmung bei unbekannter Pixelauflösung; sie ist kein behaupteter physikalischer Messwert, kein neues WeatherRouter-Feld und keine Änderung am WR-Consumer-Vertrag. Auch wird die künftige Quelle `__grRadarVisualNativeZoom` gegenwärtig nicht automatisch berechnet: echte source-spezifische Messung und Kalibrierung bleiben für eine vollständige optische Gleichwertigkeitsabnahme offen.

Die Änderung wurde bytegleich in `frontend/`, `dashboard/dist/` und `custom_components/gewitterradar/frontend/` gespiegelt. Der vollständige SHA-256-Bestand der beiden installierbaren Frontend-Spiegel wurde anhand des real ausgegebenen GitHub-Actions-Buildbestands aktualisiert; das vorübergehend fehlgeschlagene Prüfsummen-Gate wurde **nicht** deaktiviert.

## D. Dauerhafte Regression

**Neue Datei:** `scripts/test-gr-weich-02-visual-resolution.mjs`. Der Test prüft in Node die unveränderte V2-Kachelobergrenze 18, die Trennung von URL-Zoom und Darstellungsreferenz, Profilwerte für URL-Obergrenzen 8/9/10/11/12/18 und die historische z7-Reihenfolge bei Zoom 8. Der neue Test wurde in den vorhandenen Push-Workflow `.github/workflows/validate.yml` aufgenommen. Der GR-WEICH-01-Test bleibt aktiv.

**Grenze der Testtiefe:** Dies sind fachliche Formel- und Quellvertragsprüfungen. Ein Browser-Pixelvergleich, eine tatsächlich mit alten und neuen Builds durchgeführte visuelle Messung, reale V1/V2-Wechsel unter asynchronen Kachellasten und eine vollständig simulierte Raster-Labor-Ereignismatrix sind **noch nicht ausgeführt**. Diese dürfen nicht durch erfolgreiche synthetische Formelergebnisse ersetzt werden.

## E. Tatsächlich erfolgte Commits

| Commit | Änderung |
| --- | --- |
| `a928fb8181dfd65c12cce5415998b4616f73d057` | Glättungsreferenz von Leaflet-URL-Obergrenze entkoppelt; alle drei Frontend-Spiegel; neuer GR-WEICH-02-Regressionstest |
| `c82bd21082c78a1381107a37b23863bd40d11578` | GR-WEICH-02-Test in GitHub-Actions-Push-Gate aufgenommen |
| `9f674947a5f6bac88ff4bc4c43aba02e5dd39a67` | 248 kanonische SHA-256-Bestandszeilen für beide Frontend-Auslieferungen nach realem CI-Build erneuert |

## F. Öffentliche CI-Gates

Erster Frontend-Zwischenlauf `39576078687` hat erwartungsgemäß die veraltete Dateiprüfsummenliste mit **`Checksum inventory stale`** beanstandet. Die Prüfung war korrekt und führte zur SHA-256-Aktualisierung. Die Push-Gates des abschließenden Code-/Prüfsummencommits `9f674947a5f6bac88ff4bc4c43aba02e5dd39a67` lauten:

- [V4.11.100 settings navigation and runtime identity – 39576163331](https://github.com/TheDaimos/gewitterradar/actions/runs/39576163331)
- [Validate Gewitterradar integration – 39576163210](https://github.com/TheDaimos/gewitterradar/actions/runs/39576163210)
- [Validate shared Gewitterradar frontend – 39576163407](https://github.com/TheDaimos/gewitterradar/actions/runs/39576163407)

**CI-Schlussstatus siehe ergänzte Prüfnotiz am Ende des Berichts.** Ein erfolgreicher CI-Lauf ist ausdrücklich keine historische Browser-Realabnahme.

## G. Offene Prüfungen und Sperren

1. V4.11.81 und V4.11.82 als tatsächliche historische Builds mit denselben synthetischen Kachelbilddateien wie V4.11.100 in echter Browserumgebung starten; CSS-Filter und gerenderte Pixel, Browser/Skalierung/Zoom/Quelle/Gültigkeitszeit identisch vergleichen. Erste optisch schlechte Git-Version eingrenzen.
2. V1 und V2 bei gleichartigem Raster, zeitverzögerten Kacheln und bei Quellen-/Regionwechseln messen. Dokumentieren, wann und in welchem sichtbaren Pane nach `zoomend`, `moveend` und fertigem V2-Swap die endgültigen Filter wirken.
3. SVG-Mehrskalenweichzeichner bei Chromium **an Pixeln** gegen CSS-Fallback prüfen. `filter:url(...)` allein ist kein Bildbeweis.
4. Raster-Labor in echtem DOM/Browser einschließlich Referenz/Versuch, Flächenverschmelzung, Schließen, erneuter Kartenbewegung und V1-/V2-Tausch prüfen. Die in GR-WEICH-01 eingeführte zentrale Versionskennzeichnung bleibt erhalten.
5. Die z7-Unbekannt-Auflösung nicht mit einer tatsächlich nachgewiesenen Quellauflösung verwechseln. Bei später verfügbaren belastbaren Pixel-/Quellenmetadaten kann die gemessene visuelle Zoomstufe pro Layer gezielt eingetragen werden. Keine Änderungen an WeatherRouter ohne eigenen nachgewiesenen Vertrag.
6. Nach eventuellen weiteren Programmänderungen sämtliche CI-Gates erneut am endgültigen Codecommit prüfen.

**Nicht verändert:** WeatherRouter, API V1/V2, DWD-/NASA-Routing, UTC-/Sicherheitsverträge, Deckkraft, Wolken, Windfahnen, zeitliche Kachelanforderungen. Keine zweite Architektur, kein zusätzlicher globaler Timer, kein absichtlicher Versionssprung.

**Freigabe:** Korrektur der falschen Zoommetadaten-Interpretation programmiert; historisch gewünschte Bildwirkung als reale Browserpixel **noch nicht bewiesen**, daher kein GR-WEICH-02-VISUAL-PASS, kein DRA-DEV-READY, keine HA-DEV-/HA-PROD-Installation, kein HA-REAL-PASS.

**C.K. – Eine Idee weiter gedacht.**
