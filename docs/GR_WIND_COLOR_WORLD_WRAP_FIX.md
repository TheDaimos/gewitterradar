# GR Wind Color Field World-Wrap Fix

Stand: 09.11.2026 · GR **4.11.164 DEV** · HA **0.25.71** · Runtime `411164r1` · Modulsatz `E411-164A1`.

## Ausgangsstand und Ursache

Arbeitsgrundlage ist `TheDaimos/gewitterradar@deploy/dev`, Commit `4f6ebb910342d51708dac25d3f31e85c30e09595`, GR 4.11.163 / HA 0.25.70. Die seit der Studio-Veröffentlichung hinzugekommenen Lizenz-Vorprüfungsdokumente bleiben unverändert. Der bestätigte Android-Referenzstand GR 4.11.162 / HA 0.25.69 und seine Schutzdokumentation wurden vollständig berücksichtigt.

`WindCanvas.paintField()` zeichnete das vorhandene Farbflächenbild bisher nur mit einem einzigen, zur Kartenmitte passenden 360°-Versatz. Außerdem normalisierte die Abdeckungsprüfung jede Viewport-Ecke einzeln. Bei mehreren Weltkopien konnten dadurch die Ecken scheinbar in einen kleinen alten Bildausschnitt passen, obwohl große Teile des sichtbaren Bereichs nicht abgedeckt waren. Ein während einer Größen-/Zoomänderung fertiggestelltes älteres Farbbild konnte die aktuelle Ansicht vorzeitig als fertig markieren.

## Begrenzte Korrektur

Die funktionale Änderung liegt ausschließlich im Farbflächenblock von `frontend/modules/weather/wind-canvas.js` (`imageCoversView`, `prepareField`, `paintField` und lokale Farbflächen-Projektionshilfen).

* Die Farbfläche verwendet die tatsächliche lokale Leaflet-Web-Mercator-Projektion. Die gemeinsame Projektion für Windpartikel bleibt unverändert. Dadurch bleibt der horizontale 360°-Abstand auch bei weit herausgezoomten, über die Polränder reichenden Viewports korrekt.
* Die Abdeckungsprüfung betrachtet ein zusammenhängendes geografisches Viewport-Intervall. Ein kleiner regionaler Ausschnitt gilt nicht länger fälschlich als Abdeckung mehrerer Welten.
* Umfasst der gepufferte Ausschnitt eine ganze Welt, wird genau ein 360°-Farbbild aus den vorhandenen numerischen Windwerten vorbereitet. Ein wiederverwendetes natives Canvas-`repeat-x`-Muster zeichnet dieses Bild über den sichtbaren Bereich. Das vermeidet separate Texturen, doppelte Deckkraft und Zeichenlücken an den Weltgrenzen. Die Anzahl sichtbarer Weltkopien hat keine feste Zwei-Kopien-Grenze.
* Kleinere regionale Bilder werden mit demselben Bildobjekt ausschließlich auf den tatsächlich schneidenden Weltkopien gezeichnet. Unsichtbare Kopien erzeugen keine zusätzlichen Zeichenvorgänge.
* Nach einer asynchronen Bildvorbereitung wird die Abdeckung der inzwischen aktuellen Ansicht erneut geprüft. Ein älteres Bild bleibt während der Vorbereitung nutzbar; fehlende Abdeckung löst die vorhandene weitere Vorbereitung aus.
* Bestehende numerische Windabtastung, Geschwindigkeitsfarben, NoData-Transparenz, Deckkraft, zeitliche WR-Freigabe, asynchrone Zeitscheiben und Bildpuffer werden weiterverwendet. Die Rasterauflösung bleibt begrenzt. HiDPI betrifft wie bisher den Zielcanvas und erzeugt keine Winddaten je Weltkopie.

`wind-display.js` erhält ausschließlich die neue Importkennung für den Farbflächenrenderer und seine Modulversion. Die Versions-/Runtime-/DRA-Dateien und die generierten HA-/Dashboard-Kopien werden synchronisiert. Es gibt keine Änderung am WeatherRouter, WR-Vertrag oder Wetterdatenabruf.

## Bestandsschutz

Der gezielte Quellvergleich gegen den vollständigen Ausgangscommit prüft unveränderte Exporte, Konstruktor, Update-/Lifecycle-/Frame-Logik und sämtliche Partikel-Zeichenmethoden außerhalb des Farbflächenblocks. Bytegleicher Quellinhalt wird außerdem für Schlangenrenderer, Geometrie, alle elf Konfigurationsparameter mit Grenzen/Defaults, Winddatenadapter/-sampler, bisherige Strömungsgeometrie, Studio, Vorschau, Temperaturrenderer/-daten/-steuerung, Consumer-Client, Frame-Scheduler und Premium-UI geprüft. `wind-display.js` ist nach Herausrechnen der beiden Versions-/Importänderungen identisch.

Die geschützte Referenzdokumentation bleibt unverändert (Git-Blob `7b561396d5c529b09d1e12b8c3aa8e6b935d8d0c`). Bestehende Einstellungen, Profile, räumliche Partikelverteilung und gespeicherte Positionen werden weder migriert noch geändert. Keine Abstandssteuerung, neue Wettergültigkeitsgrenze oder zweite Rendering-Engine.

## Gezielte Prüfungen

`node --test tests/gr-wind-color-wrap.test.mjs`: **8/8 bestanden**. Geprüft werden Weltperiodik, korrekte Abdeckungsprüfung, unveränderte Ablauf-/Zoomregeln, verspäteter Bildabschluss, einmalige Textur-/Musteraufbereitung, sichtbare regionale Kopien, transparente NoData und der begrenzte Quellvergleich.

`node scripts/test-gr-wind-color-wrap-browser.cjs`: **6/6 vollständige GR-Browseransichten**, jeweils die acht relevanten Szenarien, lokal mit Chrome erfolgreich:

| Ansicht | Viewport | DPR | Weltzentren bei abschließender Zoom-0-Ansicht |
|---|---|---|---|
| Desktop | 1280 × 800 | 1 | 5 |
| Android Hochformat | 393 × 851 | 2 | 1 plus angeschnittene Kopien |
| Android Querformat | 851 × 393 | 2 | 3 |
| iPad Hochformat | 820 × 1180 | 2 | 3 |
| iPad Querformat | 1180 × 820 | 2 | 5 |
| Breiter Desktop | 1920 × 900 | 1 | 7 |

Alle Ansichten laden den tatsächlichen registrierten GR-Modulbaum und Leaflet. Nur HA-/WR-Transport und Wetterwerte sind synthetische Testdaten. Szenarien: regionaler hoher Zoom, genau zwei Welten, mehrere Welten, Verschieben über wiederholte ±180°-Grenzen, gebrochener Zoom mit Teildeckkraft, Zoom heraus/hinein/zurück, Größen-/Orientierungswechsel einschließlich HiDPI sowie Farbfläche aus/ein bei gleichzeitig weiterlaufender Schlangenanimation.

Pixelprüfungen belegen gefüllte Weltübergänge, gleiche Farben an gleichen geografischen Positionen und keine doppelte Deckkraft an den Nähten. Horizontale Weltwechsel behalten dasselbe vorbereitete Bild und denselben Aufbereitungszähler. Im gesamten jeweiligen Testszenario bleiben **ein WR-Feldabruf, ein numerischer Cacheeintrag und 150.323 Byte Windfelddaten** erhalten. Die Auflösung des synthetischen globalen Feldes ist im Test korrekt als 2,25° deklariert; unveränderte reale WR-Auflösungs-/Aktualisierungsentscheidungen dürfen weiterhin reguläre neue Abrufe auslösen. Kein Abruf entsteht durch eine zusätzliche Weltkopie.

Die Screenshots für breiten Desktop und mobiles Querformat wurden zusätzlich visuell kontrolliert. Lokale Ergebnisse liegen außerhalb des Quellarchivs; die öffentliche CI veröffentlicht ihre synthetischen Screenshots und Ergebnisse als Workflow-Artefakt. Es wurden keine Realtest-/Diagnoseexporte in dieses Repository geschrieben.

Frontend-Parität, Paketidentität, ursprüngliche Hi-Res-Assets, JavaScript-Syntax, deterministischer Frontend-Build und HA-Installationsstaging werden gezielt geprüft. Die öffentliche CI ist auf diesen Änderungsumfang begrenzt. Keine TEST69-Wiederholung, OPERA-Neuvalidierung oder fachfremde Wetterkampagne.

## Betroffene Dateien und Bereitstellung

Funktionaler Code: `frontend/modules/weather/wind-canvas.js`; Cache-/Modulkennung: `frontend/modules/weather/wind-display.js`. Versionsdateien: `frontend/version.js`, `gewitterradar.js`, `module-manifest.js`, `panel.js`, `modules/diagnostics/raster-lab.js`, Runtime-Manifest und dessen Asset-Inventar; HA `manifest.json`, `build_info.py`, DRA-Provenienz; Frontend-Buildskript und Prüfsummen. Die entsprechenden Dateien unter `custom_components/gewitterradar/frontend/` und `dashboard/dist/` werden vom bestehenden Builder erzeugt. Hinzu kommen gezielter Unit-/Browsertest, öffentlicher Workflow einschließlich Versionsrouting, README/Changelog und dieser Bericht. Das Release enthält eine vollständige Änderungsdateiliste.

Geplantes installierbares [DEV-Release 4.11.164](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.11.164-dev) mit HA- und Dashboard-Paket. Implementierungscommit, öffentliche CI und SHA256-Prüfsummen werden nach erfolgreicher Bereitstellung unten ergänzt.

WeatherRouter **0.10.298 / Loader 301** bleibt im Quellcode unverändert (Codebasis `1b777a1b9593a5fd5b1f71ba6332ecb2883a39d5`). Der unabhängig hinzugekommene WR-Commit `f473d93bb52e3c2bb5051a455151f2ea4851de41` ergänzt ausschließlich `COPYRIGHT.md`; dies wurde vor Bereitstellung über GitHub verglichen. Dieser Auftrag schreibt keine WR-Datei. Ausschließlich `deploy/dev`; keine privaten Actions, keine Installation auf VM109 und keine Änderung an VM101. Physische Android-/iPad-/HA-Abnahme dieser neuen Version wurde nicht durchgeführt und bleibt beim Betreiber.
