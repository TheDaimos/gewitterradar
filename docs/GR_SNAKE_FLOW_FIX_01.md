# GR Snake Flow Fix 01 · 4.11.162 DEV

## Grundlage und Auslieferung

Tatsächlicher HEAD von `deploy/dev` zu Beginn:
`91fba29af0b3e765b898c1d4c4355adcfa810d98`, GR 4.11.161 DEV / HA 0.25.68.
Neue Version: **GR 4.11.162 DEV / HA 0.25.69**, Runtime `411162r1`,
Modulsatz `E411-162A1`, Windmodul 0.4.8, Core-Manifest 1.2.181.

Es wird ausschließlich der vorhandene Schlangenrenderer verbessert. Die vier
vorhandenen Moduskennungen und die gespeicherte Auswahl bleiben erhalten; es gibt
keinen zusätzlichen Renderer oder Kartenschalter. WeatherRouter 0.10.298 / Loader
301, Commit `1b777a1b9593a5fd5b1f71ba6332ecb2883a39d5`, bleibt unverändert.

## Nachgewiesene Ursachen

* Allgemeine Länge, Geschwindigkeit und Dichte waren ausschließlich für
  `mode === 'animated'` freigeschaltet. Snake benutzte seine eigenen Parameter,
  die an diesen Bedienelementen nicht erreichbar waren.
* Detailregler behandelten nur `change`. Der anschließende vollständige Aufbau
  des Panels konnte das aktive Steuerelement austauschen; Live-Eingaben wurden
  nicht verarbeitet.
* Die bisherige Planung verwendete Fläche / 7000, Dichte höchstens 2 und maximal
  180/420 Partikel. Die Leistungsautomatik sank bis 35 % ab und erholte sich erst
  unter 3 ms Zeichenzeit. Eine dauerhaft niedrige Darstellung war dadurch möglich.
* Breite `(1−t)^taper` und Alpha `(1−t)^0,8` nahmen bereits unmittelbar hinter dem
  Kopf ab. Der optisch nutzbare Körper war erheblich kürzer als die Bogenlänge.
* Jeder neue Seed wurde unabhängig von seiner benötigten Länge bis zur
  Maximallänge vorwärtsgerechnet. Das verursachte besonders bei schwachem Wind
  unnötigen Startaufwand und stärkere Verschiebungen der Verteilung.
* Beim Herauszoomen blieben viele zuvor sichtbare Partikel im kleinen alten
  Kartenausschnitt gebündelt. Die damalige Dichtesteuerung füllte vor allem die
  Differenz zur Zielanzahl auf, ohne Überbesetzungen räumlich auszugleichen.

## Regler und Speicherung

Im allgemeinen Bereich Animation erscheinen bei Snake drei bedienbare
Schnellregler: **Partikellänge · Maximum**, **Geschwindigkeit** und **Dichte**.
Sie bearbeiten direkt `snake.maxLength`, `snake.speed` und `snake.density`.
Die Detailregler verwenden dieselben Schlüssel. Es existieren weder eine zweite
Konfiguration noch Näherungszuordnungen zu den alten Langsam/Normal/Schnell-Werten.
Eine Änderung wird sofort in beiden Ansichten angezeigt und im bestehenden
Wind-Storage gespeichert. Die früheren Werte `flowLength`, `tempo` und `density`
der bisherigen Animation bleiben unverändert.

Snake-Regler reagieren auf native `input`-Ereignisse und zusätzlich auf `change`.
Während einer Live-Eingabe werden Werte, Ausgaben und Painter aktualisiert; der
Slider und sein Panel bleiben im DOM. Damit kann ein Touch-/Mauszug fortgesetzt
werden. Die vorhandenen Premium-Chevrons, minimierbaren Panels und Pointer-Regeln
bleiben erhalten. Es entstehen keine Wetterabfragen oder Karteninitialisierungen.

Strömungsform bleibt bei Snake ausdrücklich deaktiviert; der Erklärungstext
verweist auf dessen eigene Geometrie. Pause bleibt der vorhandene gemeinsame
Animationszustand. Im bisherigen Modus bleibt die allgemeine Oberfläche erhalten.

## Körper und Schwanz

Der kleine runde Kopf bleibt erhalten. Zwischen ungefähr 10 % und dem
Schwanzbeginn behält der Körper 96–100 % seiner Breite und seine volle konfigurierte
Deckkraft. Der gesamte Körper wird als zusammenhängendes Polygon gefüllt; die
früheren vielen einzelnen Körperbänder entfallen.

Der neue Parameter **Schwanzbeginn** hat Standard **67 %** und Einstellbereich
**50–80 %** der tatsächlichen Bogenlänge. Erst danach nehmen Breite und Alpha mit
einem stetigen Smoothstep-Profil ab. Die Spitze endet geometrisch und transparent
bei null. Der vorhandene Verjüngungsparameter beeinflusst diesen hinteren Abschnitt.
Die Randtangenten stammen aus der Trajektorie; es entstehen weder Pfeilspitzen noch
dekorative Wellen. Auch kurze Partikel besitzen alle drei Formbereiche.

Die bestehende stetige Windgeschwindigkeits-/Längenfunktion und die zeitbasierte
Glättung bleiben erhalten. Eine lokale Geschwindigkeitsänderung ersetzt das
Partikel nicht. RK2 verwendet weiterhin die numerischen WR-Vektoren. Der Seed-Vorlauf
folgt nun nur der tatsächlich benötigten Ziellänge, innerhalb derselben maximal
100 Schritte. Schwacher Wind benötigt dadurch deutlich weniger Seed-Schritte.

## Dichte, Zoom und Partikelaufkommen

Der gespeicherte Dichtefaktor bleibt unabhängig von anderen Modi; vorhandene Werte
werden beibehalten. Sein Bereich ist jetzt **0,35–5** statt 0,35–2.
Die Zielplanung verwendet Fläche / 3500 und einen visuellen Zoomfaktor von **1,65
bei Zoom 3 und darunter**, abnehmend bis 1 bei Zoom 6 und darüber. Ein begrenzter
Längenfaktor 0,8–1,2 berücksichtigt die gewünschte Maximallänge. World-Wrap zählt
nur die einmalige Weltfläche; zusätzliche Weltkopien lösen keine Datenabfragen aus.

Die maximale Anzahl beträgt **900** für kleine Ansichten bzw. wenig gemeldeten
Gerätespeicher, sonst **1800**. Der Pool bleibt global auf 1800 begrenzt. Die
Historien bleiben bei 128 Punkten je Partikel: höchstens **3,52 MiB** reine
Historienwerte. Canvas-Backing bleibt auf vier Millionen Pixel und DPR 2 begrenzt.

Ein wiederverwendetes Belegungsraster bevorzugt schwach besetzte Bildschirmzellen
innerhalb der gültigen Feldabdeckung. Die Auffüllrate berücksichtigt Defizit und
Lebensdauer, statt dauerhaft nur ein bis zwei neue Partikel pro Frame zuzulassen.
Die Erzeugung hat ein begrenztes Zeitbudget und höchstens 32 erfolgreiche Versuche
pro Zeichenframe. Geburten und Lebensenden bleiben gestaffelt und weich.

Überbesetzte Zellen werden visuell ausgedünnt: laufende Partikel blenden weich aus,
neue Seeds füllen weniger belegte Bereiche. Bei einer pausierten Ansicht erfolgt
die statische Neubelegung ohne künstliche Bewegung. Diese Verteilung verändert
ausschließlich den sichtbaren Partikelbesatz, niemals Windvektoren. Sie verhindert
insbesondere die übermäßige Konzentration alter Partikel nach dem Herauszoomen.

## Temporäre Leistungssteuerung und Diagnose

Die Zeichenfrequenz wird zuerst reduziert: Intervalle von ungefähr 33, 50 oder
67 ms abhängig vom eigenen gemessenen Aufwand. Diese Werte sind Scheduler-Ziele,
keine zugesicherten Gerätebildraten. Die bestehende gemeinsame Frame-Infrastruktur
bleibt unverändert; keine zweite native Animationsschleife wird eingeführt.

Erst bei längerem eigenen Zeichenaufwand über 45 ms sinkt der temporäre Dichtefaktor
schrittweise, höchstens bis 60 %. Bei geringerem Aufwand erholt er sich; auch im
Hysteresebereich finden periodische Erholungsversuche statt. Benutzerwerte werden
dabei niemals überschrieben. Der Modus kann bei hoher gewählter Dichte weiterhin
sichtbar Rechenleistung benötigen.

Der Snake-Bereich zeigt Anzahl, gewünschtes Ziel, Zoomfaktor, eventuelle
Speicherbegrenzung, temporäre Dichtebegrenzung und Zeichenintervall an. Derselbe
Zustand steht in der bestehenden Winddiagnose. Pause und unsichtbare Seiten
beenden die Bewegung; eine begrenzte statische Auffüllung nach einer Einstellung
oder Kartenänderung endet nach Erreichen des Ziels. Ein fehlendes/abgelaufenes
WR-Feld erzeugt keine Ersatzströmungen.

## Vorschau

Die vorhandenen drei synthetischen Szenarien bleiben erhalten: schwacher Wind,
räumlich zu-/abnehmender Wind und Rotation. Sie verwenden denselben Renderer und
die neue Körperform. Eine direkte Dichteauswahl Gering/Normal/Hoch/Maximum ist mit
dem numerischen Detailregler synchronisiert. Alle elf Parameter besitzen lesbare
Beschriftungen und Wertausgaben.

`node scripts/build-snake-preview.mjs <Ausgabepfad.html>` erstellt die eigenständig
lauffähige Datei `gewitterradar-snake-preview-4.11.162.html`. Keine externen
Wetteranfragen; synthetische Felder bleiben ausdrücklich als Entwicklungsmaterial
gekennzeichnet und außerhalb des produktiven GR-Datenwegs.

## Prüfungen, Dateien und offene Realabnahme

49 gezielte Funktions-/Schutztests umfassen die vorhandenen Verträge sowie neue
Prüfungen für späte Verjüngung, durchgehende Körperdeckkraft, Zoomplanung, erweiterten
Dichtebereich, bounded Seed-Vorlauf und Erholung nach Überlast. Vergleiche sichern
alte Windrenderer, numerische Adapter, Farben, Temperatur-, Niederschlags- und
Frame-Scheduler-Logik gegen die bestehenden Referenzen ab; Import-Cachekennungen
sind dabei ausgenommen.

Fünf vollständige GR-Modulbaum-Ansichten prüfen native Maus-/Touch-Regler,
beidseitige Synchronisierung ohne DOM-Austausch, sichtbare Dichteänderung, Zoom 3,
Persistenz, Pause, World-Wrap und Rückwechsel zum bisherigen Painter. Die drei
Offline-Szenarien prüfen zusätzliche Dichte-Schnellzugriffe und null externe
HTTP-Anfragen. Die öffentliche CI ergänzt die vorhandenen 14 relevanten
Premium-Menü-/Legendenansichten und die HA-/DRA-Paketprüfungen.

Geändert werden die vorhandenen `snake-config.js`, `snake-geometry.js`,
`snake-canvas.js`, `wind-display.js`, deren generierte HA-/Dashboard-Kopien,
Version-/Runtime-/DRA-Metadaten, Cachekennungen, die vorhandene Vorschau,
Snake-Prüfskripte sowie README/Changelog und die öffentliche Frontend-CI.
Die vollständige Dateiliste und SHA256-Werte werden im DEV-Release bereitgestellt.

Eine tatsächliche Android-/iPad-/HA-Abnahme wird nicht behauptet. Die Installation
und visuelle Realabnahme bleiben beim Betreiber. Keine automatische Installation,
keine privaten Actions, keine Änderungen an WR, `main` oder PROD VM101,
keine Wiederholung von TEST69. Endgültige Commit-/CI-/Paketnachweise folgen unten.


Die erste öffentliche Frontend-CI meldete beim Pausenvergleich einen zeitlichen
Testkonflikt: Die zuvor simulierte Wiederherstellung der Seitensichtbarkeit löst
bereits einen vorhandenen WR-Hintergrundabruf aus. Dessen zulässige Frame-Übernahme
war vor dem Bildvergleich noch nicht abgewartet. Die Prüfung wartet jetzt auf
Timer-, Batch- und Übernahmeabschluss und verwendet zusätzlich einen absichtlich
verzögerten Testtransport. Die ausgelieferten Renderer- und Paketdateien bleiben
bei dieser Prüfkorrektur bytegleich; die finale CI wird am neuen Prüfcommit ausgeführt.


## Abschließender Release-Nachweis

Implementierungscommit: `b4f19a33ce6bfa377847680d6d809501624fbbc5`.

* [Öffentliche frontend-CI](https://github.com/TheDaimos/gewitterradar/actions/runs/42512616485): **success**.
* [Öffentliche ha-CI](https://github.com/TheDaimos/gewitterradar/actions/runs/42512618552): **success**.

Installierbares [DEV-Release](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.11.162-dev).

* `gewitterradar-0.25.69-dev.zip` · SHA256 `fc47c4a8b5aa53ae0c550114c7ac8a0d44504f375b352bfce30d43e7bd1b734d` · 187 Dateien.
* `gewitterradar-dashboard-4.11.162-dev.zip` · SHA256 `6190fb3c1f9e9e821e56de94451d602748b39d8672545408c75f2d04975367be` · 173 Dateien.
* `gewitterradar-snake-preview-4.11.162.html` · SHA256 `77262e480bf32183cf82ed2f1483bc4dc97aa73495efbc3efff8fe0aa3971e1e` · 1 Dateien.

171 gemeinsame Frontend-Dateien sind zwischen HA und Dashboard bytegleich. ZIP-CRC, Python-Syntax und Paket-/Versionsidentität sind geprüft. Die Pakete werden aus dem Git-Archiv erzeugt; diese Berichtsergänzung verändert ihren Inhalt nicht.

49 gezielte Funktions-/Schutztests und 19 vollstaendige Desktop-/Touch-Browseransichten sowie drei Offline-Vorschauszenarien erfolgreich. Öffentliche HA-/HACS-/hassfest-/DRA-Prüfungen erfolgreich. Keine physische Android-/iPad-/HA-Abnahme durchgeführt. Installation und visuelle Realabnahme bleiben beim Betreiber.
