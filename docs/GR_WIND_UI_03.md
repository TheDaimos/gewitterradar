# GR-WIND-UI-03 · WR-Windpunkte und konfigurierbare Winddarstellung

## Auslieferung und geschützte Referenz

Implementiert am 06.11.2026 ausschließlich in `TheDaimos/gewitterradar@deploy/dev`.

| Bestandteil | Stand |
|---|---|
| Gewitterradar | **4.11.149 DEV** |
| HA-Integration | **0.25.56 DEV** |
| Runtime / Modulset | `411149r1` / `E411-149A1` · 35 registrierte Module |
| Implementierungscommit | `0f8ddf394c1f551c7117415f8f8a6aab0935db8b` |
| GR-Funktionsreferenz | `d975a94be5d63eb09242a54920d8c3417205b41f` · 4.11.148 / 0.25.55 |
| WR-Funktionsreferenz | `0857a9920bbfeed3d512c4f7896c175a66518598` · 0.10.295 / Loader 298 |
| Geschützte WR-Legendenreferenz | `docs/p7-010-coordination/WR_GR_LEGEND_REFERENCE_2026-11-06.md`, Blob `c929f8dd1d1ab3f936beb5b71a694574a8a3c1b8` |

Der endgültige Auslieferungscommit einschließlich dieses Berichts steht im Release-Asset `deployment.json` und im unveränderlichen Tag `v4.11.149-dev`. Der Bericht wird vor Veröffentlichung auf `deploy/dev` committed und danach über GitHub erneut gelesen. Die öffentliche CI des Auslieferungscommits sperrt die Veröffentlichung bis zum erfolgreichen Abschluss.

**Datenbedingt blockiert bleiben ein zusammenhängendes räumliches Strömungsfeld, eine numerisch gefärbte Windgeschwindigkeitsfläche und Hoch-/Tiefdruckfarben.** Dies ist keine Implementierung dieser fehlenden Datenfähigkeiten: Der vorhandene WR-Vertrag liefert keine dafür erforderlichen numerischen Windraster bzw. Druckklassifikationen. Alle drei Darstellungsmodi verwenden tatsächlich über WR gelieferte Punktvektoren; die Animation bleibt ausdrücklich ein lokales Punktsymbol.

Zielsystem der anschließenden manuellen Realabnahme ist HA DEV VM109. Keine automatische Installation, kein Zugriff auf PROD VM101. Keine WR-Änderung, keine private GitHub Action, keine Wiederholung von TEST69.

## Gelesener Ausgangszustand

Vollständig gelesen wurden der ursprüngliche Auftrag `docs/ENTWICKLUNGSAUFTRAG_GR_DARSTELLUNG_RASTER_DECKKRAFT_WINDFAHNEN_2026-10-21.md`, insbesondere Abschnitt 5, sowie `docs/GR_WL_CLOUD_01_RASTER_LAB_WOLKEN_WIND_ADAPTER_BROWSER_CI_2026-10-21.md` und die geschützte WR-Legendenreferenz. Letztere wurde über GitHub gelesen und vor der Bereitstellung gegen den oben genannten Blob geprüft.

Der bisherige Windadapter ist ein Consumer-V1-Adapter für bereits gerenderte Windkacheln. Er enthielt keine numerische Vektorsteuerung, keine Fiedergeometrie und keinen Partikelscheduler. Er bleibt erhalten. Die bisherigen Windkacheln und Einstellungen werden nicht migriert oder umgedeutet. Neue Windsymbole sind nach dem Update zunächst aus; Standardmodus ist die klassische Windfahne. Animation startet ausschließlich nach ausdrücklicher Auswahl.

## Tatsächlich vorhandener WR-Vertrag

Gezielt gelesen: `consumer_capability_map.json`, `wind_semantics.py`, der Value-/Freshness-Pfad in `consumer_api.py` sowie vorhandene Provider-Definitionen im unveränderten WR295-Quellstand.

| Capability | Ressource / tatsächliche Daten | Verwendung |
|---|---|---|
| `weather.point.wind_speed` | Einzelwert, kanonisch **m/s**, `wind_speed` | Geschwindigkeit am angefragten Punkt |
| `weather.point.wind_direction` | Einzelwert, **°**, `wind_from_direction` | Meteorologische Herkunftsrichtung |
| `weather.point.wind_gusts` | Einzelwert, m/s | Vorhanden; nicht als mittlere Windgeschwindigkeit verwendet |
| `weather.point.wind_summary` | Textwert | Kein numerisches Vektorfeld |
| `weather.model.wind_10m.layer` | `raster_tile`, bereits gerendertes Modellbild | Bestehender separater Rasteradapter bleibt erhalten |

Der gemeinsame Punktvertrag beschreibt 10-m-Vorhersagewind; z. B. nutzt Open-Meteo `wind_speed_10m` und `wind_direction_10m`. Kandidaten bestehen unter anderem für Open-Meteo, MET Norway, NOAA NWS, FMI und SMHI. **Die Auswahl trifft weiterhin ausschließlich WR.** GR greift weder direkt auf Provider zu noch setzt es eine eigene Providerreihenfolge. Spezialisierte Richtungswerte wie eine Richtung beim Geschwindigkeitsmaximum werden nicht als mittlere Windrichtung verwendet.

Der öffentliche Value-Vertrag liefert Quelle, Semantik, Einheit und tatsächliche Zeitangaben wie `valid_at`/`data_time`. Er garantiert keine für GR nutzbare numerische Modellgitterauflösung, keine zusammenhängende numerische räumliche Windabdeckung, keine U-/V-Gitter und keine NoData-Gittermaske. Die DWD-Layerbezeichnung `Icon_reg025_fd_sl_UV10M` bezeichnet im vorhandenen Vertrag ein WMS-Bild; sie stellt GR **keine numerischen U-/V-Komponenten** bereit. Native räumliche und zeitliche Auflösungen sind providerabhängig und werden hier nicht erfunden. Die Legende zeigt die tatsächlich gelieferten Zeitpunkte jedes Punktes.

Für einen nicht windstillen Vektor müssen beide Antworten `ready` sein und zusammenpassen: identischer Provider, identischer normalisierter Zeitpunkt, identische Beobachtungsart, richtige Größen und kanonische Einheiten, endliche Werte, keine explizite NoData-/Ungültigkeitsmarkierung, keine explizite WR-Stale-Markierung. Negative Geschwindigkeit und ungültige Richtung werden zurückgewiesen. Nullgeschwindigkeit erlaubt ein Windstillesymbol auch ohne Richtungswert. Fehlende oder widersprüchliche Daten erzeugen keine Ersatzvektoren.

GR setzt weder ein eigenes maximales meteorologisches Datenalter noch einen eigenen Prognosehorizont. `time: latest`, Providerwahl und Zeit-/Verfügbarkeitsprüfung bleiben beim vorhandenen WR-Consumer. Ein 5-Minuten-Einmaltimer dient ausschließlich zur erneuten Auflösung einer unveränderten sichtbaren Ansicht; er ist keine selbst definierte Datengültigkeit und keine Animationsabfrage.

## Tatsächlich ausgewertete Videovorlage

Angekommen ist `1-Screenrecorder-2026-11-06-22-03-10-510.mp4`, nicht die im Auftrag ursprünglich angekündigte Datei `77006.mp4`. Zwei Uploads sind bytegleich: SHA256 `e0a2be608e3404903856b26704f79f4538a142f688bea6ca05c9c18b999052a0`.

Metadaten: **15,835964 s**, **1200 × 2608 Pixel**, **12.047.690 Bytes**. Chrome decodierte 34 Einzelbilder: über die gesamte Aufnahme ungefähr jede Sekunde sowie zusätzliche aufeinanderfolgende Bilder von 2,0 bis 3,9 s im Abstand von 0,1 s. Die Auswertung erfolgte anhand dieser zeitlich zugeordneten Einzelbilder und Kontaktbögen, nicht als behauptete vollständige Echtzeit-Videoanalyse.

Beobachtet wurden zahlreiche dünne, helle, kurze Strömungsstriche mit weichen Kanten, wechselnder Helligkeit und ohne dominante Pfeilspitzen. Die Hintergründe zeigen violett-blaue, türkise, grüne und kräftigere Windbereiche. Striche folgen sichtbar unterschiedlichen lokalen Richtungen. Die Aufnahme enthält deutliche Kartenverschiebungen und Ansichtswechsel; daraus lässt sich keine belastbare absolute Partikelgeschwindigkeit oder Originalbildrate bestimmen. Auch exakte Original-Alpha-/RGB-Werte und Beaufort-Grenzen werden aus diesen komprimierten Bildern nicht abgeleitet.

Übernommen ist ausschließlich das visuelle Prinzip kurzer, ruhiger, weich ein- und ausblendender Segmente. Code, Geometrie, Zufallsverteilung und Lebenszyklus sind eigenständig implementiert. Die fehlende numerische WR-Flächenfähigkeit verhindert die fachlich korrekte Übertragung der flächendeckenden Windfinder-Darstellung. Es werden keine proprietären Assets, Videos oder Referenzframes ausgeliefert oder committed.

## Darstellungen und Kartenverhalten

### Klassische Windfahnen

Schaft zur Herkunft des Windes; Halbfieder **5 kn**, Vollfieder **10 kn**, gefülltes Dreieck **50 kn**, additive Kombinationen. Die Geschwindigkeit wird für das Symbol auf die nächsten 5 kn gerundet, bei genau halbem Abstand aufwärts. Unter 2,5 kn wird ein offener Windstillekreis angezeigt. Das gerundete Symbol bedeutet nicht zwingend exakt null; der tatsächliche numerische Wert bleibt separat sichtbar. Die Legende erklärt diesen Unterschied und zeigt Beispiele für 0, 5, 10, 50 und 65 kn. Grundlage: [NOAA/NWS Windbarb Information](https://www.weather.gov/hfo/windbarbinfo).

### Statische Pfeile

Pfeile zeigen **in Strömungsrichtung**, um 180° gegenüber der meteorologischen Herkunft gedreht. Für Richtung θ gilt `u = −s·sin(θ)`, `v = −s·cos(θ)`. Die Ausrichtung im Canvas verwendet eine projizierte geodätische Hilfsrichtung; das vorhandene Leaflet projiziert beide geografischen Positionen. Ein Richtungswechsel von 90° in einer rotierten Projektionsfixture wird gezielt geprüft. Die bestehende GR-Karte ist nordorientiert; ein neuer Kartenrotationsmodus wird nicht eingeführt. Exakte Werte, Quelle und Zeit stehen in der Windlegende und der Werteliste.

### Animierte lokale Strömungssegmente

Maximal neun explizit durch WR aufgelöste Abfragepunkte im aktuellen Viewport. Um jeden gültigen Punkt bewegt sich ein kleines, als Symbol zu verstehendes Segmentbündel; **keine räumliche Interpolation zwischen Punkten, keine geografische Advektion in unversorgte Bereiche und kein scheinbar geschlossenes Modellgitter**.

Die Segmente sind etwa 5–10 CSS-Pixel lang, 1,4 Pixel breit, mit runden Enden, kontrastierender Kontur und sinusförmigem Ein-/Ausblenden. Ihre symbolische Bewegung bleibt innerhalb eines ungefähr 40 × 35 Pixel großen lokalen Glyphenbereichs. Windstärke beeinflusst eine begrenzte nichtlineare Bewegungsrate; die Animation ist ausdrücklich nicht physikalisch maßstabsgetreu. Bei exakt null m/s fließt kein Segment.

Tempo: Langsam / Normal / Schnell. Dichte: Gering / Normal / Hoch, zunächst 6 / 12 / 20 Segmente je bewegtem Punktsymbol, mit adaptiver Reduktion anhand gemessener Zeichenkosten. Deterministische Streuung und fortgeschriebene Phasen erhalten Kontinuität beim Neuzeichnen; Tempoänderungen setzen nicht sämtliche Partikel zurück. Eine Kontur erhält die gewählte Grundfarbe auch auf hellen Karten.

Das Canvas liegt direkt im vorhandenen Kartencontainer, mit eigenem Präsentationszustand und ohne Rasterfilter. Geografische Projektion erfolgt bei Kartenbewegung, Zoom, Größe und Rotation erneut; ein Kartenereignis verändert nicht die Animationszeit. World-Wrap verwendet kanonische Abfragekoordinaten und projizierte Weltkopien vorhandener Ergebnisse. Ein Wechsel auf eine identische Weltkopie benötigt keine zusätzlichen Punktauflösungen. Die Darstellung begrenzt Weltkopien relativ zur aktuellen Ansicht und funktioniert auch nach vielen vollständigen Längenumläufen.

## Lebenszyklus, Abrufe und Grenzen

Ein `requestAnimationFrame`-Scheduler pro aktiver Windebene, Delta-Zeit mit begrenztem Schritt, keine bewegten DOM-Marker. Er stoppt bei Pause, verstecktem Dokument, deaktivierter Ebene, Kartenentfernung und Komponentenabbau. Ereignislistener, Timer, Canvas und Phasen werden freigegeben. `prefers-reduced-motion` ergibt eine statische Darstellung, solange keine ausdrückliche Entscheidung zur Animation vorliegt. Eine spätere ausdrückliche Auswahl wird respektiert.

Es gibt keine WR-Abfrage pro Animationsbild. Auflösung nutzt ausschließlich die bestehende `_weatherRouterResolve`-Infrastruktur mit deren Diagnosespur: höchstens zwei Punktpaare gleichzeitig, also vier bestehende WS-Auflösungen. Ein neuer Viewport verwirft überholte Ergebnisse und stoppt die weitere Ausgabe veralteter Anfragen. Bereits laufende HA-WebSocket-Aufrufe können über den vorhandenen Vertrag nicht physisch abgebrochen werden; deren Antworten werden nach einem Generationswechsel nicht übernommen. Es wird kein weiterer Transportmanager eingeführt.

Eine Viewportänderung wird 250 ms zusammengefasst. Identische Weltkopien verwenden vorhandene Punktwerte. Die periodische Neuauflösung erfolgt nur für aktivierte, sichtbare Windsymbole. Daten sind auf neun Punkte, Phasen auf die aktuellen Punktschlüssel und Canvas-Speicher auf maximal etwa sechs Millionen Pixel bei höchstens DPR 2 begrenzt. Bestehende WR-Diagnoseringspeicher behalten ihre vorhandenen Grenzen.

## Farbflächen, Einheiten und Druckfarben

**Flächige Windgeschwindigkeitsfarben sind datenbedingt blockiert.** Die Oberfläche erläutert den fehlenden numerischen Rastervertrag mit Abdeckung und NoData-Maske; der Ein-Schalter ist deaktiviert. Die eigenständige Deckkraftpräferenz 0–100 % wird gespeichert, beeinflusst aber ohne Feld keine Zeichenebene. Es wird kein Bildraster nach Farben dekodiert, kein Punktwert flächig ausgedehnt und keine falsche Farbflächenlegende angezeigt. Vorhandene gerenderte Windraster bleiben separat und unverändert bedienbar.

Werteinheiten sind km/h, kn und Beaufort. **1 kn = 1,852 km/h**. Nur Darstellung und Beschriftung werden umgerechnet; gespeicherte Windwerte bleiben m/s. Beaufort verwendet die definierten 10-m-Untergrenzen in m/s:

`0 · 0,3 · 1,6 · 3,4 · 5,5 · 8,0 · 10,8 · 13,9 · 17,2 · 20,8 · 24,5 · 28,5 · 32,7`

Ein Intervall reicht von seiner Untergrenze bis ausschließlich zur nächsten, Bft 12 ab 32,7 m/s. Die vollständige Tabelle ist in der Windlegende verfügbar. Quellen: [JODC Beaufort wind force code](https://www.jodc.go.jp/jodcweb/JDOSS/pdf/feti_Windforce_code.pdf), [Met Office Beaufort scale](https://weather.metoffice.gov.uk/guides/coast-and-sea/beaufort-scale).

Die zentrale Symbolpalette in `wind-data.js`:

| Farbe | HEX |
|---|---|
| Schwarz | `#111318` |
| Weiß | `#ffffff` |
| Gold | `#f4c65d` |
| Türkis | `#24e4db` |
| Violett | `#a86bff` |
| Magenta | `#ff43c6` |
| Blau | `#258cff` |
| Grün | `#38ec83` |

Die acht benannten, zugänglichen Farbfelder gelten für alle drei Modi. Hoch-/Tiefdruckpräferenzen können dauerhaft gespeichert werden, bleiben aber ohne autoritative WR-Druckklassifikation unwirksam. Ein gewählter Druckfarbmodus fällt sichtbar erklärt auf die einheitliche Symbolfarbe zurück. GR berechnet selbst keine Druckgebiete aus Windrichtung oder Windstärke.

## Bedienung und Speicherung

Im vorhandenen WR-Kartenebenenmenü öffnet „Winddarstellung“ die Einstellungen. Die Navigation schließt das Ebenenmenü. Das wiederverwendete Premium-Info-Asset öffnet die separate Windlegende und schließt das Einstellfenster, damit die Legende auch auf schmalen Geräten sichtbar ist.

Die Windlegende verwendet die vorhandene Premium-Overlay-Implementierung: Rahmen, Schatten, Chevron, Drag per Maus/Pointer/Touch und Viewportbegrenzung. Eine isolierte Instanz mit eigenen IDs benutzt kompatible optionale Speicherhooks; die unveränderten Standardpfade der Niederschlagslegende bleiben erhalten. Windposition und Einklappzustand schreiben **keine** Niederschlagsposition oder Regen-/Schneepräferenz.

Speicherung unter `gewitterradar:wind-ui:v1`, Schema 1: Aktivierung, Darstellungsart, Symbolfarbe, Farbmodus, Hoch-/Tiefdruckfarben, Tempo, Dichte, Pause, ausdrückliche Animationsentscheidung, Farbflächenpräferenz, eigene Deckkraft, Einheit, Windlegendenposition und Legendenzustand. Vorhandene Speicherkeys werden nicht verändert. Defekte gespeicherte Werte fallen auf sichere Standardwerte zurück.

## Gezielte Prüfungen

Keine allgemeine Wetterdatenkampagne. Keine wissenschaftliche Neuvalidierung. Ausschließlich:

- `node --test tests/gr-wind-ui-03.test.mjs tests/gr-legend-ui-01.test.mjs`: **14 erfolgreich**; Richtungen, Projektion/Rotation, Fiederkombinationen, Windstille, Beaufort-Grenzen, Einheiten, Qualitäts-/Zeit-/Quellenkohärenz, Speicherung, Weltkopien, Scheduler/Pause/Visibility/Reduced Motion, überholte Antworten und geschützte Niederschlagskomponenten.
- `node scripts/test-gr-wind-ui-03-browser.cjs`: **sechs Ansichten erfolgreich** mit tatsächlichem Leaflet und synthetischen WR-WebSocket-Antworten: Desktop 1280×900, Android 375×812 / 812×375, iPad 768×1024 / 1024×768, zusätzlich 320×740. Der vollständige GR-Modulbaum wird geladen und mit 35 korrekten Modulidentitäten ohne Duplikate geprüft.
- Im Browser: tatsächlich veränderte Canvas-Pixel bei laufender Animation, unveränderte Pixel bei Pause, keine wetterbezogenen Zusatzabfragen pro Bild, acht Farben, gespeicherte Einstellungen, Datenfehler, World-Wrap, Zoom, Lebenszyklus, separate Legendenpositionen, Chevron und keine horizontalen Überläufe. Bewegungsreduzierung und ausdrückliche Auswahl werden geprüft. Programmgesteuerte Visibility-/Scheduler-Prüfung ersetzt keinen physischen Hintergrundtest jeder Companion App.
- `node scripts/verify-frontend.mjs`: exakte Auslieferungsparität, Assets, Modulvertrag und Prüfsummen erfolgreich.
- `node scripts/test-v411-identity.mjs`: Frontend-, Runtime-, Integrations- und DRA-Identität erfolgreich.
- `python scripts/verify-hacs-integration-package.py`: **160 bytegleiche Integrationsdateien** erfolgreich bereitgestellt und geprüft.
- `git diff --check`: erfolgreich.

Die lokalen Browsermessungen im abschließenden synthetischen Prüflauf ergeben bei 120 bewegten Segmenten / neun Punkten geglättete Canvas-Zeichenkosten von ungefähr **0,46–0,59 ms**. Dies sind lokale Headless-Chrome-Messwerte, keine zugesicherte Bildrate und keine Messung auf einem echten Android-Gerät oder iPad. Eine physische VM109-/Companion-Abnahme steht aus.

Öffentliche CI: `.github/workflows/gr-wind-ui-03.yml`, aufgerufen über den bereits registrierten Workflow `shared-frontend.yml@deploy/dev`. Für Version 4.11.149 wird ausschließlich der gezielte Wind-/Legenden-/Paketjob ausgeführt; die allgemeine historische Frontendkampagne wird übersprungen. Der erste Lauf bestand alle 14 Tests und den Paketabgleich, scheiterte aber beim Installieren des Browsers: `ubuntu-latest` lieferte inzwischen Ubuntu 26.04, das die festgelegte Playwright-Version 1.56.1 nicht unterstützt. Der Browserjob ist deshalb ausdrücklich auf Ubuntu 24.04 festgelegt. Der genaue erfolgreiche Run ist beim Release dokumentiert. Private WR-Actions werden weder aktiviert noch ausgelöst.

## Tatsächlich betroffene Dateien

Neue Quellen: `frontend/modules/weather/wind-data.js`, `wind-canvas.js`, `wind-display.js`, `wind-legend.js`; das vorhandene `artwork/location-search/runtime/gewitterradar-help-info-premium-v1.webp` wird als unverändertes Laufzeitasset übernommen.

Gezielte Hooks: `frontend/modules/weather/layer-menu.js` (Einstellungsnavigation), `frontend/modules/core/card-lifecycle.js` und `frontend/modules/location/radii-map.js` (Start/Abbau bzw. Kartenstart), `frontend/modules/weather/legend-overlay.js` (isolierte optionale Speicherhooks). In `precipitation-layer.js` ändert sich ausschließlich die Cache-Revision des Legendenimports; meteorologischer Code bleibt unverändert.

Auslieferungsidentitäten: `frontend/gewitterradar.js`, `version.js`, `module-manifest.js`, `panel.js`, `assets.json`, `assets/gewitterradar-runtime-manifest.json`; `custom_components/gewitterradar/{build_info.py,const.py,manifest.json,dra-deployment-provenance.json}`; alle erzeugten entsprechenden Dateien unter `custom_components/gewitterradar/frontend/` und `dashboard/dist/`; `SHA256SUMS_FRONTEND.txt`.

Build-/Prüfpfade: `scripts/build-frontend.mjs`, `scripts/verify-frontend.mjs`, `scripts/test-gr-wind-ui-03-browser.cjs`, `tests/gr-wind-ui-03.test.mjs`, `.github/workflows/{shared-frontend.yml,gr-wind-ui-03.yml}` und dieser Bericht. Die vollständige Liste wird im Release als `changed-files.txt` ausgeliefert.

**Geschützt und im Vergleich zu GR148 unverändert:** Consumer-Client, WR-Zeit-/Providerentscheidungen, Radartransport, Raster-Compositor, Mosaikplan und -masken, NASA-Raumplanung und -Parallelität, OPERA-Farben und -Georeferenzierung, NoData-Ergänzung, Seamless Tile Handover, World-Wrap-Transport sowie die gemeinsame DWD-/OPERA-Legendenaufbereitung. Kein WR-Quelldatei- oder Referenzdokument wurde verändert.

## Installation und verbleibende Realabnahme

[DEV-Release 4.11.149](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.11.149-dev): `gewitterradar-0.25.56-dev.zip` für die Integration und `gewitterradar-dashboard-4.11.149-dev.zip` für die bestehende Dashboard-Auslieferung. `SHA256SUMS.txt` und `deployment.json` enthalten tatsächliche Paketprüfsummen, Versionen und exakten Auslieferungscommit. Veröffentlichung erfolgt nach erfolgreicher öffentlicher CI; die bestehenden Release-Tags bleiben unangetastet.

Nach manueller Installation auf VM109 sind die tatsächliche Datenversorgung des gewählten WR-Profils, Touch-Bedienung und die lokale Strömungswirkung auf Desktop/Android/iPad real zu beurteilen. Numerische räumliche Windfelder samt Abdeckung/NoData und autoritative Druckklassifikationen benötigen bei gewünschter späterer Vollflächenfunktion einen gesondert freizugebenden WR-Vertrag. Dieser Auftrag erweitert WeatherRouter ausdrücklich nicht.
