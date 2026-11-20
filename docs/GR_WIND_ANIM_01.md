# WR-GR-WIND-ANIM-01 · numerisches Windfeld und Strömungsdarstellung

Stand: 2026-11-07. Gewitterradar **4.11.151 DEV**, HA **0.25.58**, Runtime
**411151r1**, Modulsatz **E411-151A1**. Numerisches Feld ab WeatherRouter
**0.10.296 DEV / Loader 299**. Entwicklungsziel: manuelle Abnahme auf VM109.
Keine automatische Installation und keine Änderungen an VM101.

## Ausgangspunkt und Schutz

GR-Ausgangspunkt: `f1cba31b0a08c935fa51d16baedc2d910ad2d1fe` (4.11.150).
WR-Ausgangspunkt: `e77cbf757848c733b321dacef08ee03a15bedf04` (Code 0.10.295,
einschließlich der inzwischen gespeicherten Referenzdokumentation).
Die historische Kombination WR295 / GR148 und ihre Tags bleiben unverändert.
Die geschützte WR-Datei `WR_GR_LEGEND_REFERENCE_2026-11-06.md` wird nicht geändert.

Die Anforderungen aus `GR_WIND_UI_03.md`, `GR_WIND_FIX_01.md`, dem ursprünglichen
Darstellungsauftrag vom 21.10. und dem Wind-Rasteradapterbericht bleiben erhalten.
Rasterbilder liefern keine numerischen Windwerte. Zuvor vorhandene maximal neun
Punktpaare bleiben ein ausdrücklich lokaler Rückfallpfad.

## Tatsächlich ausgewertete vier Videos

Alle vier MP4 wurden lokal über den Browserdecoder gelesen. 249 Bilder wurden
über die vollständigen Laufzeiten in 0,25-s-Abständen sowie in zusammenhängenden
0,05-s-Sequenzen zwischen 2 und 3 Sekunden extrahiert und verglichen.
Das ist eine programmgestützte Frame-/Sequenzanalyse, keine Auswertung nur eines
Standbilds. Die mittleren Bildraten stammen aus den MP4-Zeit-/Sampletabellen,
nicht aus einer behaupteten Wiedergabe- oder GR-Bildrate.

| Dateiname, jeweils Screenrecorder-2026-11-06- | Dauer | Auflösung | Video-Samples | mittlere Bildrate | extrahierte Bilder |
|---|---:|---|---:|---:|---:|
| 22-02-25-901.mp4 | 9,009297 s | 1200 × 2608 | 215 | 24,3020/s | 53 |
| 22-02-39-714.mp4 | 8,312699 s | 1200 × 2608 | 199 | 24,2890/s | 51 |
| 22-02-51-751.mp4 | 11,656372 s | 1200 × 2608 | 281 | 24,3206/s | 64 |
| 22-03-10-510.mp4 | 15,835964 s | 1200 × 2608 | 383 | 24,3051/s | 81 |

SHA256 der vier Eingaben in dieser Reihenfolge:

```text
782524800871bfbc43d7c8f05c984b657aa855f6fa2e1d9fca4c5db8b52587aa
27251ecdbdc00ed80f15b7011296212ee6f95bf3fd9bc49cc793f636de803d33
44f6ba44e23e661bf7959dab3683363d2c8e00fbafce1aa4085b6e57319c7125
e0a2be608e3404903856b26704f79f4538a142f688bea6ca05c9c18b999052a0
```

Video 1 zeigt stärkere atlantische Strömungen mit längeren hellen Segmenten auf
grün-goldenen Flächen, außerdem Schwenk und Zoom. Video 2 zeigt schwächere
violett-blaue und türkise Bereiche mit kürzeren, dezenteren Segmenten. Video 3
zeigt Mittel-/Osteuropa mit kleineren Segmenten und deutlich bewegten Karten-
und Stationsmarkierungen. Video 4 zeigt großräumige, gekrümmte Strömungen über
Europa/Nordatlantik und Wechsel zwischen allen genannten Farbgruppen.

Übergreifend: schlanke, geglättete, unterschiedlich helle Segmente ohne große
Pfeilspitzen; kontinuierliche Bewegung entlang der lokalen Richtung; allmähliches
Ein-/Ausblenden; zur sichtbaren Fläche passende Dichte. Die sichtbare obere
Beaufort-Skala ist eine visuelle Referenz, keine Quelle neuer Messschwellen.

Küsten, Stationskreise und Beschriftungen wurden zwischen benachbarten Bildern
als Kamerareferenz herangezogen. Zusätzlich wurde der tiefpassgefilterte
Hintergrund mittels FFT-Translationskorrelation verglichen. Video 2 bei
2,000/2,050 s hat praktisch stationären Hintergrund (ermittelte Translation 0/0,
Grauwert-RMSE etwa 0,30), während sich die hellen Segmente verändern. Bei 1, 3
und 4 reicht eine Translation wegen Zoom/Verformung nicht zur Trennung aller
Bewegungen. Deren Bildschirmverschiebung wird deshalb nicht als Windgeschwindigkeit
ausgegeben. Exakte Original-Deckkraft, Partikellebensdauer, CSS-Pixeldichte oder
Luftgeschwindigkeit lassen sich aus diesen Aufnahmen nicht zuverlässig messen.

## Tatsächlicher Datenweg

WR erweitert den vorhandenen NOAA-Adapter um eine optionale, globale GFS-Fähigkeit.
Die regionalen NWS-Punktdienste bleiben getrennt. Es wird ein echtes numerisches
0,25°-Ausgabegitter über den Unidata-NCSS-Subsetdienst gelesen, keine Karte durch
Punktabfragen nachgebildet und kein Wind aus PNG-Farben geschätzt.

Die API ist additiv und über die vorhandene authentifizierte HA-WebSocket-
Verbindung erreichbar:

```json
{"type":"weather_router/consumer/resolve_wind_field","contract_version":2,
 "capability":"weather.wind.field_10m","context":{"bbox":{
 "west":-20,"east":30,"south":35,"north":65}},"time":{"mode":"latest"}}
```

Optional: `profile_id`, `consumer_id`. Antwortschema
`weather_router.consumer.wind_field.v2`, Status `ready` oder `unavailable`.
Ein freigegebenes Frame enthält genau einen Modelllauf/Gültigkeitszeitpunkt,
10-m-Höhe, m/s, WGS84-Achsen, südlichste Zeile zuerst, U nach Osten, V nach Norden,
Maske, räumliche Abdeckung, Quelle, `valid_until` und WR-Refreshvorgabe.
Maximal 16.000 Knoten. Die vollständige WR-Vertrags-/Quellprüfung steht in
`weather-router-dev/docs/p7-010-coordination/WR_WIND_FIELD_01.md`.

WR entscheidet über Quelle, Aktivierung, Profile, Abdeckung und Zeitfreigabe.
GR prüft Struktur und WR-Freigabeende, fügt keine Modellaltersgrenze hinzu.
Einheitenwechsel verändern keine gespeicherten U-/V-Werte.
Ein deaktivierter NOAA-Provider wird nicht durch GR oder ein Profil aktiviert.
Für das Feld muss der bestehende NOAA-Provider im WR-Lab freigegeben sein;
Provider-/Profil-Sperren werden als WR-Nichtverfügbarkeit angezeigt.

NOAA-GFS-Informationen: [Modell und Ausgabeintervalle](https://www.emc.ncep.noaa.gov/emc/pages/numerical_forecast_systems/gfs.php).
[NWS-Nutzungsbedingungen](https://www.weather.gov/disclaimer) und
[Unidata-Datennutzung](https://assets.unidata.ucar.edu/data/data_usage.html):
NOAA-Daten bleiben als solche gekennzeichnet; UCAR dient als Forschungs-/DEV-
Bereitstellung ohne operative Verfügbarkeitszusage. Keine Windfinder-Assets oder
Quellcodes übernommen. Keine Eingabevideos oder extrahierten Referenzbilder im Git.

## Renderer und visuelle Abstimmung

Der bestehende `WindCanvas` behält genau einen RAF-Scheduler. Die neue Feldvariante
verwendet gültige numerische Zellen. Bilineare Interpolation erfolgt komponentenweise
und nur bei vier gültigen Ecken derselben Zelle. Keine Extrapolation über Löcher
oder zwischen isolierten Punktwerten. Windstille erzeugt keine Strömung.

| Eigenschaft | Eigenständige Umsetzung nach Vergleich aller Videos |
|---|---|
| Segmentform | kurze Linien mit runden Enden, ohne Pfeilspitze |
| Länge/Breite | 5–17 CSS-px, abhängig von Windstärke; 1,25 CSS-px Kern |
| Helligkeit | Sinusblende über die Lebenszeit, individuelle Helligkeit 0,65–0,95 |
| Lebenszeit | 3–5 s, versetzte Startalter, sanftes Neuerscheinen |
| Tempo | `min(75, 3 + 10*sqrt(m/s))` px/s; Faktoren 0,55 / 1 / 1,7 |
| Dichte | ungefähr ein Segment je 1800 / 1000 / 600 CSS-px²; Leistungsanpassung |
| Begrenzung | maximal 900 bei schmaler/schwächerer Ansicht, sonst 2200 |
| Richtung | tatsächlicher lokaler U-/V-Vektor; Herkunftsgrad korrekt umgekehrt |
| Kamerabewegung | geografische Positionen behalten; dünne Bereiche schrittweise ergänzen |
| Weltumbruch | kanonisches Feld wiederverwenden, Darstellung in Weltkopien |

Ein beim Bildvergleich aufgefallener Fehler wurde korrigiert: Leaflet rundet
kleine 100-m-Projektionsabstände bei Übersichtszoom auf denselben Pixel.
Ein ungerundeter Vektor und eine 32-px-Kartenbasis erhalten die tatsächliche
Richtung einschließlich Rotation. Diese Basis wird für Partikel pro Bild geteilt.

Die Geschwindigkeit ist eine begrenzte visuelle Skalierung, keine maßstäbliche
Luftsimulation. Kameraänderungen verändern die visuelle Geschwindigkeit nicht.
Delta-Zeit ist auf 50 ms begrenzt. NoData wird auch entlang des kurzen
Advektionsschritts geprüft. Bei Feldwechsel bleiben gültige Partikel erhalten.
Pause, unsichtbare Seite, reduzierte Bewegung, Deaktivierung und Entfernen lösen
keinen zweiten Scheduler aus. Beim Entfernen werden Canvas, Listener und Felder
freigegeben. Kein Wetterabruf pro Animationsbild.

Die Farbfläche ist mit jedem Symbolmodus und auch ohne Symbole nutzbar. Ihr
eigener 0–100-%-Regler verändert ausschließlich ihren Canvas-Zeichenanteil.
Die vorgerenderte Fläche wird bei Feld-/Viewportwechsel erneuert und während
Gesten geografisch transformiert; keine Neuberechnung je Animationsframe.
Maximal etwa 70.000 Farbsamples, Canvas-DPR höchstens 2 und 6 Mio. Bildpunkte.

Die Palette ist explizit an Beaufort-Untergrenzen gekoppelt, keine zweite
Niederschlagspalette. Grenzen in m/s:

```text
0, 0.3, 1.6, 3.4, 5.5, 8, 10.8, 13.9, 17.2, 20.8, 24.5, 28.5, 32.7
```

Farben Bft 0–12:

```text
#7750b3 #6751cc #465bce #2987d1 #20a9bd #32b49c #6fba71
#b8be55 #d9b84f #e89a43 #ea7444 #df494b #bb2a58
```

Zwischen den Untergrenzen wird stetig interpoliert. Ruhiger Wind bleibt als
gültige Farbklasse erhalten; NoData bleibt transparent. Die Premium-Legende
kennzeichnet die Beaufort-Abstände und zeigt die gewählte Einheit, vollständige
Klassen, Quelle, Modelllauf und tatsächlichen Gültigkeitszeitpunkt.
Die acht vorhandenen Symbolfarben sind unverändert und davon unabhängig.
Eine belastbare Hoch-/Tiefdruckklassifikation fehlt weiterhin: einheitliche
Symbolfarbe und sichtbarer Hinweis statt erfundener Druckanalyse.

## Gezielte Prüfungen und Vergleich

- 24 GR-Vertrags-/Regressionsprüfungen: neue Feldvalidierung, U/V-Interpolation,
  NoData, periodische Naht, Farbgrenzen, Rotation, Scheduler, alte Windfunktionen,
  Menüs und unveränderte Niederschlags-/Legendenfunktionen.
- Vollständiger registrierter GR-Modulbaum mit allen 35 Modulen und echtem Leaflet,
  fünf Ansichten: Desktop 1280×850, Android 393×851 / 851×393, iPad 820×1180 /
  1180×820. Touch-Taps, drei Modi, acht Farben, Persistenz, Pause, sichtbare
  Bewegung, Farbfläche allein, transparente NoData-Pixel, Weltkopie ohne neuen
  Datenabruf, Quellen und Legenden. Zusätzlich bestehende Windraster-Reparaturprüfung.
- Der neue Browserlauf verwendet synthetische zusammenhängende Felder als klar
  gekennzeichnete Fixtures. Zusätzlich lokal: Offline-Replay eines wirklich durch
  WR dekodierten GFS-Weltfelds, 10.295 gültige Knoten, Modelllauf 07.11.00 UTC /
  Gültigkeit 06 UTC, 86.020 Byte Originalsubset. Browseruhr für dieses Replay
  innerhalb seiner ursprünglichen WR-Freigabe; keine behauptete Live-Abnahme.
- Vergleichskontaktbogen mit allen vier Referenzen, aufeinanderfolgende GR-Bilder
  und eigenes Replay-GIF lokal erstellt und visuell geprüft. Helle, runde Segmente,
  kontinuierliche gekrümmte Bahnen, Dichte, Fades und Palette abgeglichen. Unterschiede:
  anderes Modell/Zeitfenster, gröber ausgedünntes Weltgitter, GR-Karte/Bedienelemente
  und konfigurierbare Deckkraft. Kein Anspruch auf identische Wetterstrukturen oder
  gemessene Windfinder-Originalparameter.
- Gemessene Canvas-Kosten werden diagnostisch ausgegeben. Ein beispielhafter
  Desktop-Snapshot lag bei etwa 4,7 ms gewichteten Zeichenkosten; das belegt keine
  garantierte Bildrate und keinen Companion-Benchmark.
- Version, Frontend-Parität, Paketstaging und SHA256 geprüft. Öffentliche CI wird
  ausschließlich im öffentlichen `TheDaimos/gewitterradar` ausgeführt; private
  WR-Tests lokal. Keine private Quellkopie in öffentliche CI übernommen.

## Tatsächlich betroffene Dateien

- `frontend/modules/weather/wind-field.js`: neues additives Vertrags-/Samplingmodul.
- `frontend/modules/weather/wind-canvas.js`: bestehender Renderer ergänzt.
- `frontend/modules/weather/wind-display.js`: Feldabruf, Status und vorhandene Bedienung.
- `frontend/modules/weather/wind-legend.js`: bestehende Premium-Legende ergänzt.
- `frontend/gewitterradar.js`, `frontend/module-manifest.js`, `frontend/version.js`,
  `frontend/panel.js`, `frontend/assets/gewitterradar-runtime-manifest.json`,
  `frontend/assets.json`: Modulladung, Kennungen, Bestand und Hashes.
- `custom_components/gewitterradar/{manifest.json,build_info.py,const.py,dra-deployment-provenance.json}`.
- `scripts/build-frontend.mjs`, `tests/gr-wind-anim-01.test.mjs`,
  `scripts/test-gr-wind-anim-01-browser.cjs`, `.github/workflows/gr-wind-anim-01.yml`,
  `.github/workflows/shared-frontend.yml`, `SHA256SUMS_FRONTEND.txt`.
- Bytegleiche generierte Auslieferung nach `custom_components/gewitterradar/frontend/`
  und `dashboard/dist/`, einschließlich des neuen Hilfsmoduls; README/Changelog und
  dieser Bericht. Vollständige Pfadliste als Release-Datei `changed-files.txt`.

Nicht verändert: Consumer-V1-/Niederschlags-V2-Client, Compositor, Masken,
NASA-Planung/Parallelität, OPERA, Kachelwechsel, Radar-Transport, World-Wrap-
Datenregeln, DWD-/OPERA-/NASA-Farben und gemeinsame Regen-/separate Schneele­gende.
Gezielte Tests vergleichen die geschützten Quellteile mit der Referenz.

## Bereitstellung und Grenzen

Installation über den bestehenden DRA-Kanal `TheDaimos/gewitterradar@deploy/dev`;
WR entsprechend `TheDaimos/weather-router-dev@deploy/dev`. Neue GR-Dateien sind in
Integration und Dashboard enthalten. Alte Releases bleiben unverändert.

Pakete: `gewitterradar-0.25.58-dev.zip` und
`gewitterradar-dashboard-4.11.151-dev.zip` unter
[GR 4.11.151 DEV](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.11.151-dev).
WR-Paket: [WR 0.10.296 DEV](https://github.com/TheDaimos/weather-router-dev/releases/tag/v0.10.296-dev).
`SHA256SUMS.txt` und `deployment.json` enthalten überprüfbare Paketidentität und
Auslieferungscommit. Diese Berichte werden nach dem Push über GitHub erneut gelesen.

Implementierungscommit GR: `9bcfde7920c5bb59b8fa9b4cc62488f277672b78`.
Implementierungscommit WR: `166535f7b55e0fe44f0ae16600acded5a8fc4d14`.
[Gezielte öffentliche CI 42356476589](https://github.com/TheDaimos/gewitterradar/actions/runs/42356476589)
ist erfolgreich: Release-Scope und `wind-anim01 / wind-field` grün, allgemeiner
Frontendlauf und frühere UI-Testlinien übersprungen. Sie prüft exakt den genannten
GR-Codecommit. Anschließende Berichtscommits ändern keinen geprüften Laufzeitcode.
Der endgültige Auslieferungscommit steht in der Release-Identität `deployment.json`.

Der erste öffentliche Push löste daneben bestehende Altworkflows aus.
42356476543 / 42356476529 erwarten noch 34 statt der bereits zuvor vorhandenen
35 Module. Der allgemeine Integrationslauf 42356476444 meldet diese alte Annahme
und eine feste Produktversion 4.11.148; sein Abbruchversuch traf ihn bereits
abgeschlossen. Diese historischen Assertionfehler wurden gelesen und nicht als
grün ausgegeben oder durch Änderung geschützter Referenzen kaschiert. Sie sind
kein Gate dieser begrenzten Wind-DEV-Linie. Der aktuelle gezielte Lauf prüft die
korrekten 35 Module sowie die synchronisierte Version 4.11.151 / HA0.25.58.
Keine erneute allgemeine Kampagne gestartet; spätere Berichtscommits nutzen
`skip ci`. Private Actions waren und bleiben deaktiviert.

Physische Android-, iPad- und HA-VM109-Abnahme steht aus. Kein TEST69, keine
wissenschaftliche Neuberechnung, keine Änderungen an `main` oder VM101.
