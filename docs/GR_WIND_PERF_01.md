# WR/GR-WIND-PERF-01 · bestehende Windanimation optimiert

Stand 2026-11-07. **GR 4.11.152 DEV / HA 0.25.59**, Runtime **411152r1**,
Modulsatz **E411-152A1**. Dazu **WR 0.10.297 DEV / Loader 300** für die gezielte
serverseitige Cacheverbesserung. Der bestehende Windfeldvertrag bleibt mit WR296
kompatibel. Ausschließlich `deploy/dev`, manuelle VM109-Abnahme, keine Installation
durch diesen Auftrag. Kein Zugriff auf PROD VM101.

## Geschützte Ausgangsbasis und unveränderter Umfang

GR-Referenz: `c58359187ba9f07a753edbf4a00fdea97e57e114`, WR-Berichtsstand:
`fec0cbad9a78f7beb54f807957ff79289824bb8f`. Vor Beginn wurde der zusätzliche reine
WR-Referenzdokumentationscommit `40e5b898f10a29514a739380a29c0e89bf7f041d`
geprüft und per Fast-forward übernommen. Keine dazwischenliegenden Änderungen
überschrieben. Geschützte Datei:
`weather-router-dev/docs/p7-010-coordination/WR_GR_WIND_REFERENCE_2026-11-07.md`,
Blob `21df0d4cfc5e56e27efc38c75d6197df2542fc19`. Sie wird nicht geändert.
Ältere Mosaik-/Legendenreferenzen und Release-Tags bleiben ebenfalls unverändert.

Die Berichte `GR_WIND_ANIM_01.md`, `GR_WIND_UI_03.md`, `GR_WIND_FIX_01.md` und
WRs `WR_WIND_FIELD_01.md` wurden berücksichtigt. Der bestehende `WindCanvas`,
seine Symbole, Palette, Dichtewahl, Animationstempi, Fade-/Segmentgestaltung,
Deckkraft, eigenständige Farbfläche, Windlegende und gespeicherten Einstellungen
werden weiterverwendet. Keine neue Render-/Downloadengine, kein WebGL-Umbau,
kein Worker und kein neues Wetterdatenrouting.

## Die vier neuen Aufnahmen zeigen Gewitterradar

Diese Dateien sind **GR-Realbeobachtungen**, keine neuen Windfinder-Vorgaben.
Die vier früheren Windfinder-Aufnahmen bleiben ausschließlich die optische Referenz.
Alle neuen Clips wurden vollständig durch den Browserdecoder gelesen und über
ihre Laufzeit alle 0,5 s sowie in zusammenhängenden 0,05-s-Sequenzen ausgewertet.
547 Frames insgesamt. Kein Video oder extrahierter Originalframe im Repository.

| Datei | Nutzerzuordnung | Dauer | Auflösung | aufgezeichnete mittlere Bildrate | extrahierte Bilder |
|---|---|---:|---|---:|---:|
| 77055.mp4 | Android/Mobilfunk | 124,133833 s | 1200 × 2608 | 24,3043/s | 268 |
| 77056.mp4 | Android/Mobilfunk | 41,377914 s | 1200 × 2608 | 24,3199/s | 102 |
| 77092.mp4 | Android/WLAN | 42,910431 s | 1200 × 2608 | 24,3218/s | 105 |
| 77093.mp4 | Android/WLAN | 26,470703 s | 1200 × 2608 | 24,3098/s | 72 |

Die Bildraten stammen aus den MP4-Zeit-/Sampletabellen und sind ausdrücklich
**keine gemessenen Canvas-FPS**. SHA256 in Tabellenreihenfolge:

```text
6f8c3deeee70f79b68899897f53770c2b1a5bbcd51ee14ed9ebbce570610adf0
3285be1475bb906d2a05aa39e8fee1fdd06b2beed7222dc3cb0281920799fd03
1087a1e25e04c42fc46ea6b032bccb17d3f8f95795e794f4fa3d7d6c3eba1b8d
e3bf4e5d7536e206b5ab12f3b406ee4e3dd09f1faed077ae0f90bcf592b975cd
```

Beobachtungen: 77055 zeigt unter anderem um 49,55 s ein begrenztes Farbrechteck
und um 105,55 s einen verbleibenden schmalen Bereich. In 77056 sind um 16,55,
22,55 und 29,05 s unvollständige Ausschnitte zu sehen. 77092 zeigt entsprechende
Grenzen auch bei ausgeschalteter Farbfläche an den Strömungssegmenten. 77093
zeigt zwischen etwa 2,65 und 10,55 s verschobene, rechteckig begrenzte Farb-/
Vektorfelder; später wieder flächige Darstellung. Kamerabewegung und Zoom sind
dabei deutlich. Verbindungs-/Wiederverbinden-Hinweise in den Mobilfunkclips sind
kein Nachweis, dass jede Verzögerung allein durch den Transport verursacht wird.
Die abschließende schwarze Ansicht in 77055 wird nicht als Windrendererbefund
ausgegeben. Bessere iPad-/Desktopwirkung bleibt qualitativer Nutzerbefund.

## Nachgewiesene Engpässe

Der Ausgangscode führte je Partikel mehrere Leaflet-Projektionen und
Rückprojektionen, kurzlebige Lookup-Arrays/-Closures, Grad-/Winkel-Rückumrechnungen
und zusätzliche vollständige Windwertabfragen entlang des Advektionsschritts aus.
Canvas-State wurde für jedes Segment gesichert und wiederhergestellt.
Die Farbfläche war nur für 100 % des alten Bildschirmfensters vorbereitet.
Neue Felder ersetzten das einzige aktive Feld; Fehlabrufe konnten es leeren.
Der Browser hielt keine geografischen Nachbarfelder als LRU vor. Der WR-Cache
erkannte nur identische kanonische Zuschnitte, nicht bereits vollständig enthaltene
Anfragen. Diese Codebefunde wurden durch die gezielten Browser-/Cachetests geprüft.
Sie beweisen keine ausschließliche Ursache aller realen Android-Verzögerungen.

## Kontrollierter Vorher-/Nachher-Vergleich

`scripts/benchmark-wind-perf-01.cjs` lädt die vollständige registrierte GR-Karte
mit Leaflet. Vorher: unveränderte Dateien aus dem geschützten GR-Commit; nachher:
neue Auslieferung. Gleiche numerische synthetische Gitterwerte, **14.651 Knoten**,
gleiche Ansicht, Zoom 4, hohe Benutzerdichte, weiß, Normaltempo, Farbfläche 65 %,
12-s-Messfenster nach Vorbereitung/Aufwärmen. Deterministischer Zufallsstart.
Nur für diesen Vergleich wird die adaptive Dichte auf Faktor 1 fixiert, damit
eine Entlastung niemals durch weniger Partikel vorgetäuscht wird. Die produktive
Dichtewahl und ihre bisherigen Obergrenzen bleiben bestehen.

| Messgröße | Android-Ansicht vorher | nachher | Desktop vorher | nachher |
|---|---:|---:|---:|---:|
| CSS-Viewport | 393 × 851 | gleich | 1280 × 850 | gleich |
| CDP-CPU-Faktor | 6 | gleich | 1 | gleich |
| verwaltete Segmente min/max | 514 / 514 | 514 / 514 | 1747 / 1747 | 1747 / 1747 |
| tatsächliche Animationsbilder | 667 | 716 | 713 | 719 |
| aus RAF-Zeitstempeln gemessene FPS | 54,25 | 58,24 | 59,03 | 59,45 |
| Zeichenzeit im Mittel | 13,46 ms | 5,61 ms | 5,81 ms | 1,85 ms |
| P95 Zeichenzeit | 17,50 ms | 8,20 ms | 7,70 ms | 2,60 ms |
| maximale Zeichenzeit | 40,80 ms | 20,80 ms | 15,40 ms | 6,10 ms |
| JavaScript-Zeit im Messfenster | 9,13 s | 4,26 s | 4,15 s | 1,34 s |
| zusätzliche Wetteranfragen im Fenster | 0 | 0 | 0 | 0 |
| Leaflet-Projektionen pro Bild* | ca. 1033 | 0 | ca. 3494 | 0 |
| Leaflet-Rückprojektionen pro Bild* | ca. 1096 | 0 | ca. 3525 | 0 |
| Canvas-save pro Bild* | ca. 511 | 2 | ca. 1739 | 2 |
| Farbvorbereitung CPU | 380,7 ms | 65,4 ms | 111,3 ms | 27,8 ms |
| Farbvorbereitung verstrichene Zeit | 380,7 ms | 216,6 ms | 111,3 ms | 38,9 ms |

*Operationen in einem separaten kurzen Zählfenster nach der Zeitmessung; dessen
Instrumentierung geht nicht in die Zeichenzeitmessung ein. Beide Segmentstriche
und ihre Transparenz bleiben erhalten; keine Zeichenvereinfachung durch Weglassen.
Die neue Farbfläche umfasst dabei den 130-%-Puffer. Ihre verstrichene Zeit enthält
bewusst Pausen zwischen kurzen CPU-Arbeitsschritten zugunsten der laufenden Animation.

Ergebnis dieses lokalen Laufs: etwa **58 % / 68 % weniger mittlere Zeichenzeit**.
Das ist eine **Browser-/CPU-Emulation auf dem Entwicklungsrechner**, keine echte
Android-, WLAN-, Mobilfunk- oder Companion-Abnahme. Kleine FPS-Unterschiede am
Desktop nahe der Anzeigegrenze sind keine garantierte Verbesserung. Keine
zugesicherte Bildrate auf Nutzersystemen. GPU-Verbrauch und GC wurden nicht
isoliert gemessen. JS-Heap-Snapshots sind GC-abhängig; daraus wird kein pauschaler
Speichergewinn behauptet. Die neuen Puffer benötigen bewusst begrenzten RAM.

## L1 · vorhandenen Animationspuffer effizienter verwenden

Geografische Bildschirmtransformation einmal bei Viewportänderung vorbereiten.
Im normalen Mercator-Animatonsbild erfolgen keine Leaflet-Koordinatenaufrufe mehr.
Eine inverse Mercatorberechnung je bewegtem Partikel ersetzt mehrere Bibliotheks-
und Objektumwege. Die ungerundete Bewegung vermeidet zusätzlich Pixelrasterknicke.
Rotation und Weltkopien werden durch die vorbereitete affine Kartenbasis erhalten.
Für nicht unterstützte CRS bleibt der bestehende Leaflet-Pfad erhalten.

Wiederverwendbare Float64-Scratchbereiche, vorbereitete Zellmasken und skalare
bilineare U/V-Lookups ersetzen kurzlebige Lookup-Arrays und Closures. Die numerischen
Operationen bleiben komponentenweise innerhalb derselben vier gültigen Gitterecken.
Der kurze Schritt prüft konservativ alle berührten Maskenzellen, statt mehrfach
unnötig vollständige Windwerte zu berechnen. Zyklische Nähte werden gesondert geprüft.
Keine Bewegung durch NoData. Vollständig außerhalb der Abdeckung wird die Schleife
angehalten; fehlgeschlagene Seeds werden nicht ohne Pause pro Bild neu versucht.

Die vorhandene Partikelverwaltung bleibt als Pool kompakter numerischer Zustände
erhalten. Vorhandene Objekte werden beim Wiederansetzen wiederverwendet. Kein
unbegründeter vollständiger TypedArray-/Engine-Umbau. Quelle/UV-Arrays werden nicht
verändert. Canvas-save/restore nur noch um die vorhandene Segmentzeichnung als
Ganzes; beide Kontur-/Kernstriche, Länge, Breite, Farbe, Helligkeit und Lebenszeit
bleiben erhalten. Kein pauschales Senken der sichtbaren Dichte.

## L2 · begrenzter geografischer Browserpuffer

Bestehenden Windzustand um eine RAM-LRU mit höchstens sechs Feldern erweitert.
Budget 8 MiB bei schmaler beziehungsweise speicherärmerer Ansicht, sonst 16 MiB;
LRU- und Bytegrenze gelten gleichzeitig. Kein LocalStorage für Wetterdaten.
Schlüssel berücksichtigen Provider, Modell, Run, Gültigkeitszeit, Höhe, Einheit,
CRS, Auflösung sowie die vom WR bestimmte Original-/Geometrie-ID und Abdeckung.
Bei neu autorisiertem Provider-/Modellzeit-Snapshot werden inkompatible Einträge
aus der Wiederverwendung entfernt. Veraltete Antwortgenerationen dürfen keinen
früheren Provider aus dem Cache wieder aktivieren.

Anforderung: **130 % Bildschirmbreite × 130 % Bildschirmhöhe**, also ca. 169 %
Fläche; nur die sichtbaren 100 % werden animiert. Bei vollständiger Abdeckung
und geeigneter Darstellungsauflösung kein neuer WS-Auftrag. Verschobene Weltkopien
verwenden denselben kanonischen Eintrag. Native Auflösung wird nicht künstlich
verfeinert. Bei deutlichem Hineinzoomen in ausgedünnte Felder wird eine passend
zugeschnittene WR-Antwort angefragt; dies ist ein Darstellungsdetailkriterium,
keine neue meteorologische Alters-/Gültigkeitsregel.

Der bestehende Vertrag liefert einen kohärenten rechteckigen Gesamtschnitt und
keine Patch-/Streifenrevision. Deshalb wird außerhalb der Cacheabdeckung der
erforderliche neue lokale 130-%-Schnitt angefragt; keine selbst erfundene
Streifen-Zusammensetzung aus verschiedenen Runs, keine globalen Vorratsdownloads.
Bei großen Sprüngen oder tatsächlich fehlender Abdeckung können bis zum Eintreffen
neuer Daten weiterhin freie Flächen sichtbar sein. Sie werden nicht künstlich gefüllt.

Nur WR-`valid_until` autorisiert die Nutzung. Cachetreffer verlängern dieses Datum
nicht. Die WR-Refreshvorgabe bleibt auch nach Kartenbewegungen terminiert. Ein
abgelaufenes Feld wird entfernt; ausdrückliche Router-/Domain-/Provider-/Profilsperren
leeren die lokalen Feldfreigaben. Netzwerkfehler allein widerrufen noch gültige Daten
nicht. Erneuter Transportversuch mit 30-s-Backoff im bestehenden Refresh-Timer,
keine zusätzliche Polling-Schleife. Profilwechsel verwirft frühere Profilpuffer.

## Übergabe, Richtungen und Farbflächen

Kandidat empfangen → prüfen/Lookups vorbereiten → neue Farbfläche in kurzen
Arbeitsschritten vorbereiten → numerisches Feld und passende Farbfläche gemeinsam
aktivieren. Das bisherige Feld bleibt währenddessen nur innerhalb seiner
WR-Freigabe sichtbar. Kein vollständiger Partikelreset bei Cachetreffern oder
Fehlabrufen. Kein gleichzeitiges Vermischen unterschiedlicher Modellzeiten.

Richtungen werden als Einheitsvektoren geglättet, zeitabhängig mit etwa 120 ms
Reaktionskonstante; der Übergang über 0/360° nimmt den kurzen Weg. Nahezu entgegengesetzte
Vektoren werden ohne Nullvektor-Singularität gedreht. Das betrifft ausschließlich
die visuelle Bewegung. Bei geändertem Provider/Modelllauf/Gültigkeitszeitpunkt wird
die Richtung neu übernommen, keine meteorologische Zeitinterpolation. Die Maske
des aktiven Feldes bleibt auch für die geglättete Bewegung verbindlich.

Die Palette und Beaufort-Grenzen bleiben identisch. RGB-Werte sind einmal vorbereitet,
direktes Schreiben in wiederverwendete ImageData-Puffer ersetzt Farbarray-/Hex-
Allokationen je Pixel. Zwei begrenzte Canvas-/ImageData-Puffer werden wiederverwendet.
Vorbereitung zeilenweise mit ca. 4-ms-Arbeitsbudget, keine zweite RAF-Schleife.
Vorbereitete 130-%-Flächen werden bei passender Ansicht geografisch transformiert;
kein Neubau für kleine Bewegungen innerhalb des Bereichs. Deckkraft verändert
ausschließlich den Farbflächenanteil. Kein Einfluss auf Niederschlagsraster.

## Diagnose und Premium-Icons

Optionaler gespeicherter Schalter „Performance-Diagnose“ im vorhandenen Windmenü.
Normalbetrieb ohne FPS-/Perzentil-Sortierung. Bei Aktivierung: RAF-FPS, Render-Ø,
P95/Maximum, sichtbare/verwaltete Partikel, Feldknoten, Lookups, Browser-LRU-Zähler,
Budget/Bytes, Abruf-/Aufbereitungsdauer, Farbvorbereitung CPU/Gesamtzeit, letzte
Feldübernahme und aktive/vorbereitete Generation. WR-Cachewerte, soweit verfügbar,
liegen im bestehenden Winddiagnoseobjekt. Pausen/unsichtbare Seite werden nicht
als aktive Animationsintervalle ausgegeben. Keine Erkennung/Behauptung von WLAN
oder Mobilfunk allein aus einer Dauer. Bestehende Diagnose-/Exporthooks, keine
neue Exportfunktion; reale Exporte weiterhin ausschließlich Project-Log-And-Export@main.

Schließen verwendet exakt das vorhandene `ABOUT_CLOSE_IMAGE` aus dem allgemeinen
Konfigurationsmenü. Info und Schließen jeweils 34 px sichtbares Icon / 44 px Touchfläche,
rahmenlos und ohne Button-Hintergrund, mit zugänglichen Namen und Tastaturfokus.
Die bisherige übergeordnete Schließen-Bedienung des eingebetteten Premium-Menüs
bleibt erhalten. Keine neue Grafik, keine Änderung anderer Overlaypositionen.
Geöffnete Wind-Unterbereiche und Scrollposition bleiben bei Zustandsupdates erhalten.

## Gezielte Prüfungen, Dateien und Auslieferung

- **36 GR-Prüfungen**, darunter LRU/Fristen, keine Provider-Rückaktivierung,
  130 %, geometrische Abdeckung, zyklische NoData-Naht, Rotation, Richtung 0/360°,
  optionale FPS, Pause, Entsorgung sowie geschützte Niederschlags-/Legendenquellteile.
- Drei gezielte vollständige Browserprüfungen mit tatsächlicher Karte/35 Modulen,
  jeweils Desktop, Android hoch/quer, iPad hoch/quer. Keine Ersatzkarte und keine
  isolierte Unit-Prüfung als Menüabnahme. Cachetreffer ohne Anfrage, Zoom/Weltkopien,
  verzögerter Abruf, Fehler, Sperre, Freigabeablauf, Modellwechsel, Farbfläche allein,
  bestehende Rasterzustände, Touch, Tastatur, Persistenz und Premium-Icons erfolgreich.
- Frontend-/Runtime-/DRA-Identität und 162 bytegleiche Integrationsdateien geprüft.
- **15 lokale WR-Prüfungen**: fünf Cache-, acht bestehende Feld-/Policy-/Transport-
  und zwei Versionsprüfungen. Öffentliche GR-CI verwendet ausschließlich öffentlichen
  Testcode und synthetische Felder, keine kopierten privaten WR-Quellen.

Betroffen: `frontend/modules/weather/{wind-canvas.js,wind-data.js,wind-display.js,
wind-field.js}`; `wind-legend.js` nur Importrevisionen. Produkt-/Modul-/Runtime-
Kennungen in `frontend/{gewitterradar.js,module-manifest.js,version.js,panel.js,
assets.json,assets/gewitterradar-runtime-manifest.json}` und
`custom_components/gewitterradar/{manifest.json,build_info.py,const.py,dra-deployment-provenance.json}`.
`scripts/build-frontend.mjs`, neue Performance-Tests/Fixture/Benchmark und
`.github/workflows/{shared-frontend.yml,gr-wind-perf-01.yml}`, README/Changelog,
dieser Bericht; generierte identische Frontends in HA-Integration und Dashboard,
`SHA256SUMS_FRONTEND.txt`. Vollständige Pfadliste im Release `changed-files.txt`.

Nicht geändert: Niederschlags-Consumer, DWD/OPERA/NASA, Masken, Providerpriorisierung,
deren Zeitpolitik, Palette, Mosaik/Seamless Tile Handover und die gemeinsame Radarlegende.
Keine TEST69-Wiederholung oder allgemeine Niederschlagskampagne.

Pakete unter [GR 4.11.152 DEV](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.11.152-dev):
`gewitterradar-0.25.59-dev.zip`, `gewitterradar-dashboard-4.11.152-dev.zip`,
`SHA256SUMS.txt`, `deployment.json`, `changed-files.txt`. WR-Gegenstück:
[0.10.297 DEV](https://github.com/TheDaimos/weather-router-dev/releases/tag/v0.10.297-dev).
Bereitstellung über die bestehenden DRA-Kanäle `deploy/dev`. Private Actions bleiben
deaktiviert. Öffentliche CI wird gezielt per Dispatch gestartet; Commits verwenden
`skip ci`, damit keine historischen allgemeinen Workflows mitgestartet werden.
CI-/Commitabschluss wird nach dem Lauf ergänzt; Berichte anschließend über GitHub
erneut lesen und per Blob vergleichen. Physische VM109-/Android-/iPad-Abnahme offen.
