# GR PREMIUM UI FIX 02

## Basis und Version

Tatsächlich abgerufener `deploy/dev`-HEAD:
`7185af7779549e163c00f5012311732260da4ba0`, GR 4.11.159 DEV / HA 0.25.66.

Neue DEV-Identität: **GR 4.11.160 / HA 0.25.67 / Runtime 411160r1 /
E411-160A1**. Die 36 registrierten Module bleiben erhalten. Vorhandene Releases,
Storage-Schlüssel und Benutzerwerte werden nicht überschrieben.

WeatherRouter 0.10.298 / Loader 301 bleibt unverändert. Keine privaten GitHub
Actions, keine Änderungen an main oder VM101, keine automatische Installation auf
VM109, keine Wiederholung von TEST69 oder meteorologischen Grundlagenprüfungen.

## Vier Korrekturen

### 1 und 2: Ausrichtung von Chevron und Titel

Die bisherige gemeinsame Summary-Regel hatte lediglich zwei Pixel horizontalen
Innenabstand. Die Einstellungen verwenden jetzt symmetrisches
`clamp(14px,3vw,18px)`-Padding und zwölf Pixel Mindestabstand zwischen Titel und
Chevron. Der Titel ist ein schrumpfbares, umbrechendes Flex-Element; das vorhandene
14-Pixel-Chevron bleibt eine feste Spalte. Keine absoluten Positionskorrekturen.

Der gleiche Aufbau gilt für Wind, Temperatur und verschachtelte Farbstützpunkte.
Die Originalgeometrie, Filter und 420-ms-Animation bleiben erhalten. Geschlossene
Unterbereiche erhalten einen expliziten eigenen Rotationszustand: Der bisherige
globale Selektor für offene Vorfahren konnte auch ein geschlossenes Kind drehen.
Die Browserprüfung misst tatsächliche Abstände und Rotationsmatrizen, einschließlich
geschlossener Kinder in geöffneten Elternbereichen.

### 3: Tatsächliche Eye-Komponenten verwenden

Der Vergleich berechneter Styles am Ausgangsstand zeigte bereits identische
äußere Gradient-, Border- und Schattenwerte. Unvollständig war die Übernahme der
Header und inneren Bereiche; zusätzlich standen die alten Wind-Rahmenregeln noch
als konkurrierende Dekoration im Quelltext.

* Alte einfache Wind-Rahmen-/Hintergrund-/Schattenregeln sowie die zusätzliche
  Temperatur-Hintergrundfarbe sind entfernt. Der Außenrahmen stammt ausschließlich
  aus dem bestehenden `gr-premium-metal-surface`-Block im Skeleton.
* Beide Header nutzen die tatsächliche `weather-display-panel-head`-Klasse.
  Hintergrund, Padding, Lichtakzent und Höhenverhalten stammen aus dem Eye-Menü.
  Lediglich das Layout der vorhandenen Icon-/Titel-/Aktionsgruppen berücksichtigt
  den zusätzlichen Schließen-Button. Der Inhalt liegt in einem getrennten Body;
  der Header reicht dadurch bis an den inneren Außenrahmen.
* Einstellungsbereiche verwenden `weather-display-card` und dieselbe vorhandene
  metallische Oberfläche mit schwächerem Schatten und dem vorhandenen 11-Pixel-
  Kartenradius. Der äußere Rahmen bleibt dominant. Keine neue Goldpalette und
  keine zweite Sammlung von Gradient-Definitionen.
* Die bisherige pauschale transparente Button-Regel nimmt metallische
  Minimieren-Buttons aus. Ihre vorhandene Eye-Metalleinfassung wird nicht mehr
  entfernt. Hi-Res-Info-, Wind-, Temperatur- und Schließen-Assets bleiben erhalten.
  Das Temperaturmenü übernimmt dasselbe vorhandene Schließen-Asset wie Wind;
  die Browserprüfung verlangt ein tatsächlich erfolgreich dekodiertes Bild.
* Die ursprüngliche Eye-Styling-Methode bleibt exakt geschützt. Berechnete äußere
  Styles werden im Browser Eigenschaft für Eigenschaft zwischen Eye, Wind und
  Temperatur verglichen, ebenso Header-Hintergrund und Header-Padding.

Eingebettete Windeinstellungen innerhalb des Eye-Menüs bleiben eingebettet. Sie
erzeugen keinen zusätzlichen äußeren schwebenden Rahmen und behalten ihre Werte.

### 4: Long Press und Ereignis-Lebenszyklus

Die bisherige Logik setzte bei `pointerdown` bereits die Drag-Klasse. Eine
Touch-Bewegung über sechs CSS-Pixel beendete den Timer. Native Kontextmenüs und
iOS-Touch-Callouts wurden auf den beiden Kartenschaltern nicht unterdrückt. Der
Kurzklick hing weiterhin vom nachfolgenden Browser-Kompatibilitätsklick ab.

Die gemeinsame vorhandene `_weatherDisplayBindEyeDrag`-Funktion verarbeitet jetzt
Wind und Temperatur über denselben Ablauf; keine zweite Gesture-Engine:

1. Primärer Druck startet die Phase `pressing` und den 600-ms-Timer.
2. Kleine Fingerbewegungen bleiben ein Druck. Bewegungsschwelle: Touch zwölf,
   Stift acht, Maus sechs CSS-Pixel. Erst darüber beginnt `dragging`, und der Timer
   wird beendet.
3. Nach 600 ms öffnet `longpress` genau einmal die vorhandene Menüfunktion. Die
   Wetterebene wird dabei nicht aktiviert. Spätere Bewegung derselben Berührung
   wird nicht als neuer Drag gespeichert.
4. Ein kurzer `pointerup` aktiviert die jeweilige Wetterebene genau einmal über
   den bestehenden Callback. Kompatibilitätsklicks aktivieren keine zweite Aktion;
   die Tastatur-/Accessibility-Aktivierung bleibt verfügbar.
5. Kontextmenü, Touch-Callout und Textauswahl werden ausschließlich für diese
   beiden Mehrfachschalter unterdrückt. Touch-Handler unterdrücken nur native
   Gesten; sie lösen keine zweite Aktion aus. Die Karte bleibt außerhalb der
   Icons normal bedienbar.
6. Pointer-Abbruch, Capture-Verlust und Lifecycle-Abbruch entfernen Press-Timer
   und Pointer-Zustand. Nach langem Druck schützt die bestehende räumlich begrenzte
   Freigabeklick-Sperre auch vor einem auf das neu geöffnete Menü umgeleiteten
   Klick. Sie wird bei Freigabe, Abbruch, Fokusverlust beziehungsweise nach einer
   begrenzten Rückfallfrist entfernt.

Nur tatsächliches Drag speichert eine neue Position. Die bestehenden
geräte-/ansichtsbezogenen Positionen, Kartenbegrenzungen und Speicherformate bleiben
erhalten. Andere Karteninstrumente erhalten keine neuen Ereignisrouten.

Die bisherigen physischen Android-/iPad-Aufnahmen wurden in diesem Auftrag nicht
neu aufgezeichnet. Die korrigierten Implementierungslücken sind im vollständigen
Browserbaum gezielt reproduziert und geprüft; das ersetzt keine Companion-Abnahme.

## Schutz und Prüfungen

* Fünf neue gezielte Tests: exakte 600-ms-Grenze und Touch-Jitter, einzelner
  Aktivierungsweg einschließlich Keyboard/Kompatibilitätsklick, Kontextmenü/Drag,
  Abbruch/Capture/Lifecycle sowie unveränderte Eye-Dekoration und Wetterdatenwege.
* Zusammen mit den vorhandenen relevanten Tests: **38 Funktions-/Schutztests**.
  Die neun bestehenden HA-Menü-/Manifestprüfungen werden ebenfalls gezielt geprüft;
  ihr Versionsvergleich ist auf Skeleton 1.1.27 aktualisiert.
* Acht vollständige Browseransichten mit Leaflet und allen 36 registrierten
  Modulen: Desktop 1280×850; Android 320×740, 393×851, 851×393; iPad 820×1180,
  1180×820; iPad Pro 1024×1366, 1366×1024. Gemessene Rahmen-/Header-Stile,
  Chevron-Abstände, lange Titel, native Kontextmenü-Anforderung während Druck,
  Touch-Jitter, 600-ms-Öffnen, unveränderte Wetterebene, Kurzklick, Drag und Reload.
* Zusätzlich sechs bestehende vollständige Browseransichten für Legenden,
  Einstellungen, Minimierung, Kartenansicht, Schnellzugriffe und Persistenz.
* Browser-Touch-Eingaben sind emuliert, die Kontextmenü-Anforderung ist gezielt
  ausgelöst. Keine physische Android-/iPad-/iPad-Pro-/HA-Realabnahme behauptet.
* Wettertransport, numerische Wind-/Temperaturwerte, Palette, Advektion,
  Raster-/Mosaiklogik und Frame-Scheduler bleiben exakt erhalten. Nur notwendige
  Import-Cachekennungen werden bei Quellschutzvergleichen normalisiert.
* Versionsidentität, Originalasset-Retention, deterministischer Build,
  HA-/Dashboard-Parität und installierbare Paketstruktur werden geprüft.

Synthetische Browserbilder sind CI-Artefakte. Keine HA-Realtest- oder Diagnoseexporte
werden in dieses Repository geschrieben. Solche Exporte gehören weiterhin
ausschließlich nach `TheDaimos/Project-Log-And-Export@main`.

## Betroffene Bereiche

`frontend/modules/weather/premium-ui.js`, `display-menu.js`, `wind-display.js`,
`temperature-display.js`, `frontend/modules/ui/skeleton.js`, ihre erforderlichen
Import-Cacheketten, Versions-/Runtime-/DRA-Metadaten und die beiden
Auslieferungskopien. Dazu gezielte Tests, öffentliche CI und diese Dokumentation.
Die Wetterdatenprovider und WeatherRouter selbst werden nicht verändert.

## Release-Nachweis

Abschließende vollständige Commit-SHAs, öffentliche CI-Läufe und Paketprüfsummen
werden nach Abschluss der Prüfungen ergänzt. Installation und visuelle Realabnahme
auf den Zielgeräten bleiben Aufgabe des Betreibers.


## Abschließender Release-Nachweis

Implementierungscommit: `b95d73672a6fe9ffeda38501af1ca234237d2188`.

* [Öffentliche frontend-CI](https://github.com/TheDaimos/gewitterradar/actions/runs/42484931044): **success**.
* [Öffentliche ha-CI](https://github.com/TheDaimos/gewitterradar/actions/runs/42484933335): **success**.

Installierbares [DEV-Release](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.11.160-dev).

* `gewitterradar-0.25.67-dev.zip` · SHA256 `670e07c815ff5a0b3225ca9454d245c6fe6bf978c6d95e0a4f39ded9b58fd992` · 184 Dateien.
* `gewitterradar-dashboard-4.11.160-dev.zip` · SHA256 `0f8737fab42ce2e8153379800cd24faa49f0b55ba414ed4276890394b8402960` · 170 Dateien.

168 gemeinsame Frontend-Dateien sind zwischen HA und Dashboard bytegleich. ZIP-CRC, Python-Syntax und Paket-/Versionsidentität sind geprüft. Die Pakete werden aus dem Git-Archiv erzeugt; diese Berichtsergänzung verändert ihren Inhalt nicht.

38 gezielte Funktions-/Schutztests und 14 vollständige Desktop-/Touch-Browseransichten erfolgreich. Öffentliche HA-/HACS-/hassfest-/DRA-Prüfungen erfolgreich. Keine physische Android-/iPad-/HA-Abnahme durchgeführt. Installation und visuelle Realabnahme bleiben beim Betreiber.
