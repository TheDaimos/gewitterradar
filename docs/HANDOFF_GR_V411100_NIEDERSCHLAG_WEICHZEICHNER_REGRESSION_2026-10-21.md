# Chatübergabe – Gewitterradar V4.11.100: Niederschlagsweichzeichner wiederherstellen

**Bootstrap Daimos · 21.10.2026**  
**Repository:** `TheDaimos/gewitterradar` · **einziger Entwicklungszweig:** `deploy/dev`  
**Auftrag:** Ursächliche, reproduzierbar geprüfte Wiederherstellung der vier bestehenden Niederschlagsdarstellungsmodi **Auto, Präzise, Ausgewogen, Weich**. **Keine neuen Wetterlayer-, Deckkraft- oder Windfahnenfunktionen vor dem Abschluss dieses Fehlers.**  
**Status bei Übergabe:** V4.11.100 DEV-TEST aus vorheriger WL-02-Arbeit, öffentliche Frontend-/Integrations-/Versionsprüfungen für den damaligen Code erfolgreich; **keine neu entwickelte oder abgenommene Reparatur des Weichzeichners**. Keine HA-Installation/Realabnahme durch diesen Chat.

## A. Startanweisung für den nächsten Chat (vollständig ausführbarer Auftrag)

> **Bootstrap Daimos – GR Niederschlagsweichzeichner P1.** Arbeite im Repository `TheDaimos/gewitterradar` **ausschließlich auf `deploy/dev`**. Lies zuerst **vollständig** diese Übergabe, die unten verlinkte gezielte Regressionsanalyse und den vorherigen Ursachenbericht. Prüfe den tatsächlichen aktuellen Branch-HEAD. Der Benutzer bestätigt: Die Glättung funktionierte **unmittelbar nach Einführung des Raster-Labors in V4.11.81** wie gewünscht, tritt aber in V4.11.100 **auf Android und Desktop** fehlerhaft auf: **Auto** und **Weich** sind bei Zoom 8 zu pixelig, teils ist **Ausgewogen** sichtbar weicher als **Weich**. Der genaue letzte gute Zwischenstand (V4.11.99 oder früher) ist unbekannt. **Nicht erneut Chromium/iPad als unbewiesene Hauptursache vermuten.** Vergleiche gezielt den V4.11.81-Referenzcommit mit der aktuellen V1-/V2-Niederschlagsverarbeitung einschließlich echter Zoom-/NativeZoom-Werte, CSS-Pane-Filter, Raster-Labor-Vorschau und Layer-Lebenszyklus. Reproduziere den Fehler durch neue Regressionstests und – falls zugänglich – reale Browser-/Rasterpixeltests, führe dann einen **minimalen, nachweislich ursächlichen Codefix** mit Tests durch. Verändere nicht beiläufig Wolken, individuelle Deckkraft, Windfahnen oder bestehende Wetterquellenarchitektur. Prüfe sämtliche Projekt-/Spiegel-/Modulsatz-/HA-/DRA-Versionierungsverträge und die **realen GitHub-Actions-Push-Gates** am endgültigen Programmcommit. Keine HA-DEV-Installation ohne ausdrückliche Nutzerfreigabe, keine HA-REAL-PASS-Behauptung ohne tatsächliche korrelierte Realtests. Speichere den abschließenden vollständigen technischen Bericht **als echte .md-Datei auf `deploy/dev`**, committe ihn, lies ihn über GitHub erneut und antworte dem Nutzer danach **ausschließlich mit einem einzigen kopierbaren Satz mit vollständig ausgeschriebenem echten GitHub-Direktlink**. Bei Blockaden wahrheitsgemäßen Zwischen-/Blockerbericht in derselben Form erstellen, statt einen erfundenen PASS auszugeben.

## B. Verbindlich zuerst lesen

1. **Gezielte, bereits durchgeführte V4.11.81–V4.11.100-Differenzanalyse:** `docs/GR_WEICHZEICHNER_GEZIELTE_REGRESSIONSANALYSE_V41181_BIS_V411100_2026-10-21.md`. Vollständiger URL: https://github.com/TheDaimos/gewitterradar/blob/deploy/dev/docs/GR_WEICHZEICHNER_GEZIELTE_REGRESSIONSANALYSE_V41181_BIS_V411100_2026-10-21.md
2. **Ursachenbericht samt korrigierendem Nachtrag nach Nutzerbeobachtung:** `docs/GR_NIEDERSCHLAG_WEICHZEICHNER_V411100_URSACHENPRUEFUNG_2026-10-21.md`. URL: https://github.com/TheDaimos/gewitterradar/blob/deploy/dev/docs/GR_NIEDERSCHLAG_WEICHZEICHNER_V411100_URSACHENPRUEFUNG_2026-10-21.md
3. **Vorerst ausdrücklich zurückgestellter Erweiterungsauftrag:** `docs/ENTWICKLUNGSAUFTRAG_GR_DARSTELLUNG_RASTER_DECKKRAFT_WINDFAHNEN_2026-10-21.md`. URL: https://github.com/TheDaimos/gewitterradar/blob/deploy/dev/docs/ENTWICKLUNGSAUFTRAG_GR_DARSTELLUNG_RASTER_DECKKRAFT_WINDFAHNEN_2026-10-21.md
4. **Letzter formal grüner WL-02-CI-/DRA-Vorbereitungsbericht (anderer Aufgabenbereich!):** `docs/GR_WL02_V411100_GOLDEN_CI_PASS_DRA_DEV_TESTVORBEREITUNG_2026-10-20.md`. URL: https://github.com/TheDaimos/gewitterradar/blob/deploy/dev/docs/GR_WL02_V411100_GOLDEN_CI_PASS_DRA_DEV_TESTVORBEREITUNG_2026-10-20.md
5. Erforderliche historische Programme und Schutztests: `frontend/modules/weather/display-menu.js`, `frontend/modules/weather/precipitation-layer.js`, `frontend/modules/diagnostics/raster-lab.js`, `frontend/modules/weather/p7-010/`; `scripts/test-v41175-soft-raster.mjs`, `scripts/test-v41176-soft-raster.mjs`, `scripts/test-v41177-restore-soft-raster.mjs`, `scripts/test-v41178-platform-soft-raster.mjs`, `scripts/test-v41180-soft-cloud-zoom11-13.mjs`, `scripts/test-soft-zoom11-13-2026-10-15.mjs`, `scripts/test-v41181-raster-lab.mjs`; CI-Workflows und Manifest/Spiegel-/SHA-Kontrakte.

## C. Tatsächlich gesicherte GitHub-Befunde

Die Untersuchung hat die echten Quelltexte beim historischen Commit `46754f6689b0b01f1a45287e21572ae04b90f3bd` (**V4.11.81**, Raster-Labor) und bei `deploy/dev` gelesen und Git-Blobs verglichen:

| Datei | V4.11.81 Git-Blob | Git-Blob am untersuchten aktuellen Stand | Aussage |
| --- | --- | --- | --- |
| `frontend/modules/weather/display-menu.js` | `f32b467fb69bd338d87d3878add266b5bf3a5a89` | **identisch:** `f32b467fb69bd338d87d3878add266b5bf3a5a89` | **Seit V4.11.81 nicht verändert**: Die Regression wird nicht unmittelbar durch einen neu geschriebenen Formeltext in diesem Modul erklärt. |
| `frontend/modules/diagnostics/raster-lab.js` | `cc18dc593da297a00049498d35f7164db546c078` | `f4c86125ee9d5a8fe51f62a802af459b9727a7cf` | Diagnosevorschau wurde später angepasst; Seiteneffekte im Live-Pane prüfen. |
| `frontend/modules/weather/precipitation-layer.js` | `1166de0b1e0378b3b897312f52a825bf522d0e8e` | `8e4ea1795a247c3282966ad656360876f1265d99` | Rasterrenderer nach V4.11.81 stark verändert (V1/V2, Kachel-/Quellenwechsel, Overzoom, geografische Abdeckung). |

**Wichtige Versionsfolge:** V4.11.75–80 entwickelten die Profil-/Zoomglättung; **V4.11.81** Raster-Labor eingeführt, **V4.11.82** Dialog/Vorschau verbessert; **V4.11.88–94** P7-010-Mosaik, Kacheloverzoom, geografische Freigabe und NASA/DWD-Wechsel; **V4.11.95** Android-Wiederaufnahme; **V4.11.96–99** Beibehaltung und Diagnose des V2-Niederschlags; **V4.11.100** WL-02-DEV-Testkandidat mit weiteren Wetterebenen und Versionsverträgen. Diese Chronologie ist eine Entwicklungsübersicht, **keine Bestätigung**, dass jede Version bereits visuell geprüft wurde.

**Codekonkrete starke Spur 1: NativeZoom/Kacheldaten.**
`display-menu.js`: `_weatherDisplayRasterTuning` liest die native Stufe aus `this._weatherRadarState?.().layer?.options?.maxNativeZoom`; `weatherDisplayAutoRasterTuning` benutzt `relativeZoom = zoom - nativeZoom + 2`. Mit höherem NativeZoom kann die für Zoom 8 berechnete Glättung gegen ca. **1.05 px** sinken. `weatherDisplaySoftRasterTuning` übernimmt bei Zoom 8 **Auto für Zoom 6** als Referenz, ohne dort einen garantierten hohen Unschärferadius: die Funktion kann ebenfalls sehr wenig glätten. `weatherDisplayBalancedRasterTuning` verwendet einen separaten Basisradius von **5.6 px**. Das erklärt **rechnerisch** die von den Screenshots gezeigte Reihenfolge „Ausgewogen weicher als Weich“, wenn die betreffende native Zoomstufe tatsächlich vorlag. Aber: **Der aktive NativeZoom aus diesen konkreten Nutzerscreenshots wurde noch nicht verifiziert.**

**Codekonkrete Spur 2: Pane-/Layerzustand.**
V1 erzeugt eine Leaflet-GridLayer mit `maxNativeZoom` aus `payload.max_zoom` und ruft den Darstellungsfilter beim Aufbau auf. V2 verwendet ebenfalls `gr-weather-radar`, hat aber Vorbereitungs-/Tausch-/Beibehaltungsphasen; der Filter wird u. a. nach aktivem Tausch aktualisiert. Prüfe, ob CSS-`filter` beim sichtbaren aktiven Pane und `zoomend` zuverlässig erneut angewendet wird, auch während V2-Staging oder nach regionalem Quellenwechsel. Modusanzeige im Menü ist **nicht** automatisch Beleg eines wirksamen Filters.

**Codekonkrete Spur 3: Raster-Labor-Vorschau.**
Im ursprünglichen V4.11.81-Labor war der Preview-Blur direkt `v.blur`; aktuell wird `effectiveBlur = info.base.blur+(v.blur-info.base.blur)*clamp(v.blend??100,0,100)/100` eingesetzt. Die Vorschau verändert direkt die Filterstilregel des existierenden Kartenpanes. Rückfallmechanismus für Pane-`opacity` und rekursive Refreshes wurde ebenfalls angepasst. Teste Öffnen, Benutzeränderung, Zoom, Wechsel von Referenz zu Versuch, Schließen und Layer-Tausch isoliert. **Achtung:** Der aktuelle Raster-Labor-Export schreibt noch statisch `version:"4.11.82",runtimeRevision:"41182r1"` in den JSON-Datensatz. Diese Werte zeigen **nicht zuverlässig** die echte installierte Programmversion. Dies ist eine **echte zusätzliche Diagnose-Metadatenabweichung**, aber der kausale Zusammenhang zur Weichzeichner-Regression ist nicht belegt.

**SVG-/Browserhypothese nachrangig:** V4.11.77 stellte einen CSS-Filter wieder her, weil ein formal unterstützter SVG-Filter auf iPad sichtbar nichts tat; V4.11.78 begrenzte das Mehrskalenverfahren auf Chromium. Nutzer kann den gegenwärtigen Fehler jedoch **auf Android und Desktop** reproduzieren und bestätigt, dass es dort zuvor funktionierte. Keine unbewiesene Zuschreibung an Chromium; reine Syntax-`filter:url(...)` ist **kein sichtbarer Pixelnachweis**.

## D. Bildbefunde / Reproduktionsanforderungen

Vom Benutzer wurden **vier visuelle Vergleiche derselben Niederschlagssituation in Italien bei Zoom 8** gezeigt (Auto, Präzise, Ausgewogen und Weich). Präzise zeigt erwartete Pixelblöcke; Ausgewogen zeigt deutliche fließende Übergänge; Auto und Weich sehen viel zu pixelig aus. Die endgültige Ursache ist aus vier Bildern allein nicht beweisbar. Ein anderes Bild zeigte die **Raster-Labor-Kopfzeile „Raster-Labor · Live-Darstellung“**; der Benutzer bestätigt das frühere korrekte Glättungsverhalten unmittelbar nach dessen Einführung.

Bilder gehören zum Chatverlauf, **nicht** als öffentliche Standort-/Benutzerdaten ins Repository kopieren; neue Tests müssen synthetische, lizenzfreie Rasterdaten verwenden. Reale Browserbeweise bei Testfreigabe getrennt vom öffentlichen Repo archivieren.

## E. Präzise nächste Arbeitsschritte ohne Wiederholungen

1. **HEAD und Abhängigkeiten lesen.** Keine alten historischen Commits blind deployen. Referenz `46754f…` nur zum Vergleichen, aktuelles `deploy/dev` als Entwicklungsbasis. Der letzte Berichtcommit ist `2e49e3a9e30f91c3707052a19199332995ba0bb2`; spätere Commits möglich.
2. **Ein reproduzierbarer numerischer Profiltest**: bei Zoom 6–13 und NativeZoom 5–12 für alle vier Modi tatsächliche Blur-, Farb-/Kontrastwerte ausgeben und prüfen, ob bei Zoom 8 Auto/Weich schwächer als Ausgewogen werden. NativeZoom als Daten-/Quellenvertrag gesondert kontrollieren. Bereits vorhandene Grenzwert-/Leistungstests schützen!
3. **Historischen Regressionseintritt eingrenzen**: native Zoommetadaten, tatsächlichen V1-/V2-Pfad, Raster-Pane-Erzeugung und Browserbild für V4.11.81, 4.11.88, 4.11.99 und 4.11.100 vergleichen; erst eine nachgewiesen gute und schlechte Stufe gegenüberstellen. Alle Quellref-/Bildzeit-/UTC- und Mapzoom-Bedingungen angleichen.
4. **Filter tatsächlich beobachten**: `gr-weather-radar` `filter`, `data-weather-display-style`, ggf. `data-weather-display-auto-blur`, `data-raster-lab-preview`, `layer.options.maxNativeZoom`, `layer.__grRadarNativeMaxZoom`, Kachelbild und sichtbarer Rendermodus nach Layererzeugung, V1-/V2-Tausch und Zoom prüfen. Bei SVG den echten sichtbaren Bildwechsel verifizieren.
5. **Raster-Labor als Diagnosewerkzeug nutzen**, nicht neu bauen; ggf. den nachgewiesenen statischen Exportversionsfehler separat korrigieren, **ohne** ungeprüft die Hauptregression hierauf zu schieben.
6. **Minimalfix** für die identifizierte Ursache; keine pauschalen maximalen Blurwerte, kein pauschales Entfernen der V1-/V2-Verträge, kein pauschaler Wechsel zu SVG oder CSS auf Verdacht. Historischen gewünsch­ten „Auto stärker geglättet als Weich“ bei betroffener Zoomstufe und gut sichtbares „Weich stärker als Ausgewogen“ fachlich an der Bildwirkung absichern.
7. **Tests und Veröffentlichung**: echte Node-/Browser-Regressionen, bestehende Golden- und P7-010-/WL-02-Tests, Code- und Spiegelparität im `frontend`, `dashboard/dist`, `custom_components/gewitterradar/frontend` und erforderliche SHA-/Manifest-/Integration-/DRA-Metadaten; nach jeder finalen Programmänderung GitHub-Actions-Push-Gates samt tatsächlichen Run-/Jobkennungen kontrollieren.
8. **Freigaben strikt trennen**: `CODE-PASS` nur für geprüfte Tests; `CI-PASS` nur für echte erfolgreiche Actions-Läufe **am relevanten Codecommit**; `DRA-DEV-READY` nur bei konsistentem Installationsartefakt; **kein installierter/realer HA-PASS**, bevor der Benutzer ausdrücklich DRA-Installation freigibt und echte korrelierte WR-/GR-/Browser-Realtests stattfinden.
9. **Ausgabe**: Bericht zuerst als komplette echte Markdown-Datei im Repository speichern, anschließend GitHub-Rücklesen/Verifikation, dem Nutzer nur **einen** vollständig ausgeschriebenen GitHub-Direktlink in einem einzigen kopierbaren Satz ausgeben. Keine Routine-Zwischenfragen; bei nicht überwindbarem Blocker präziser Bericht statt falscher Fertigmeldung.

## F. WL-02 und andere Entwicklungsaufträge bleiben bewusst eingefroren

Die vorherigen WL-02-Tests und die Vorbereitung der V4.11.100 DEV-Testversion dürfen **nicht** erneut umgesetzt werden. Ihr damaliger geprüfter Programmcommit laut Vorbericht: `72a65d309f91d8e257d312165bd9f312f53d5a19`; dazu waren erfolgreiche GitHub-Actions-Prüfungen dokumentiert (Identität `39389344224`, Integration `39389344307`, gemeinsame Oberfläche `39389344260`). Diese damaligen Gates geben **keine Freigabe für einen neuen Glättungsfix**. Kein produktiver WR/GR-Realtest wurde damit nachgewiesen.

Der gesonderte, bereits gespeicherte Auftrag umfasst erst **nach** Reparatur: globale Rasterglättung Auto/Präzise/Ausgewogen/Weich/Individuell für Niederschlag und tatsächliche Wolkenlayer; **unabhängige Deckkraft mit genau Gemeinsam/Individuell** (`0%=unsichtbar;100%=voll deckend`); einzelne Werte je Rasterlayer; Windfahnen separat ohne Weichzeichnung, wahlweise Fieder/Pfeile, acht Farben einschließlich Schwarz als sichtbare Farbbalken, fachlich belegte Hoch-/Tief-Farbzuordnung und bestehendes HiRes-Infoicon mit korrekter Windfieder-Legende. **Nichts davon darf die ursprüngliche Weichzeichnerreparatur verzögern oder verfälschen.**

## G. Sicherheits- und Qualitätsregeln

- Keine neue parallele Render-/Mosaikarchitektur; vorhandenen WeatherRouter Consumer API V1/V2 beibehalten.
- Keine fingierten Wetterpixel oder Provider-`ready` aus bloßem Katalog-`available` ableiten.
- UTC-Vertrag, eindeutige Quellen-/Kachel-/Zoomprovenienz, geographische Freigabe, NoData/Alpha, Leistung, 20s-Verträge und Android/Firefox-Verhalten respektieren.
- Private Standortdaten, Diagnoseexporte oder sensible HA-Informationen nicht im öffentlichen `gewitterradar` ablegen. Wenn gesonderte Exporte erforderlich sind, den bereits festgelegten privaten zentralen Exportort `TheDaimos/Project-Log-And-Export` berücksichtigen; auf unzulässige Ablagen hinweisen.
- Keine Installation auf Home Assistant DEV oder PROD ohne ausdrückliches Benutzer-Ja. Keine HA-Realabnahme ohne **tatsächliche** Realtests.
- Keine Behauptung einer Reparatur, solange nur Vermutungen, statische Quellanalysen oder simulierte Zahlenwerte vorliegen.

## H. Gewünschtes Ergebnis

**Hauptziel:** Auto / Präzise / Ausgewogen / Weich sind bei gleichen realen Rasterdaten wieder wie ursprünglich beabsichtigt unterscheidbar und reproduzierbar funktionsfähig; Zoomwechsel, V1-/V2-Mosaikwechsel, Quellenmetadaten und Raster-Labor-Vorschau beschädigen diese Zustände nicht. Abschlussbericht mit klaren Versions-/Commitständen, nachgewiesenem Root Cause, Codeänderungen, Testresultaten, echten CI-IDs sowie ausdrücklich offener oder erfolgter HA-Freigabe.

**C.K. – Eine Idee weiter gedacht.**
