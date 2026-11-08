# GR PREMIUM UI CONSOLIDATION

## Basis und Auslieferung

Ausgangsstand: `TheDaimos/gewitterradar@deploy/dev`, Commit
`ecad2624db0169d2b41a921d0158a4475be364e5`, GR 4.11.158 DEV / HA 0.25.65.
Neue Identität: **GR 4.11.159 DEV / HA 0.25.66 / Runtime 411159r1 / E411-159A1**.
36 registrierte Module bleiben erhalten. Zwei importierte UI-Helfer kommen hinzu;
sie sind keine weiteren Wetterdatenmodule. Kein Zwischenrelease und keine
Änderung eines bereits veröffentlichten Pakets.

WeatherRouter bleibt unverändert bei 0.10.298 / Loader 301. WR bestimmt weiterhin
Quellen, Verfügbarkeit, Modellzeiten und Freigaben. Keine neue GR-Altersgrenze,
keine private Action, keine Änderungen an main, keine Installation auf VM109 und
keine Änderungen an VM101. TEST69 wurde weder verändert noch wiederholt.

## Konkrete Ursachen und Korrekturen

* Wind und Temperatur hatten eigene Renderpfade über einer auf Niederschlags-
  familien zugeschnittenen Legendenhülle. Die Windansicht verwendete deshalb eine
  Niederschlagsfamilie und blendete ihren Skalenumschalter aus. Jetzt verwenden
  beide dieselbe wissenschaftliche Legendenaufbereitung über der vorhandenen
  Overlay-Infrastruktur. Niederschlagsgruppierung und Farbtabellen bleiben erhalten.
* Minimieren war ein flüchtiger DOM-Klassenzustand. Der Zustand wird jetzt in den
  bestehenden Wind-/Temperatur-Legendenoptionen gespeichert. Balken/Klassen,
  Minimierung und Erklärung sind unabhängig. Datenaktualisierung und Wiederöffnen
  setzen diese Zustände nicht zurück.
* Erklärungstexte waren Teil der eingeklappten Visualisierung. Ein eigener
  `details/summary`-Abschnitt mit dem vorhandenen Premium-Chevron trennt jetzt
  Erklärung und Skala. Die Grid-Animation behält den Inhalt beim Schließen bis zum
  Übergangsende im DOM; `aria-expanded` und `inert` folgen dem Zielzustand.
* Legenden konnten Menüeingaben oder minimierte Bedienelemente verdecken. Die
  wissenschaftlichen Overlays und geöffneten Einstellungsmenüs erhalten eine
  definierte Stapelreihenfolge. Geöffnete Einstellungen liegen vor ihren Legenden.
* Die Wind-Kachel besaß keinen Hauptschalter; das Windfahnen-Icon schaltete den
  gesamten Wind. Jetzt sind Hauptschalter, Windfahnen und Zahnrad drei benachbarte
  Schaltflächen mit eigener Aktion. Keine verschachtelten Buttons. Der vorhandene
  delegierte Ereignishandler verhindert die Weitergabe.
* Touch-Browser können den Kompatibilitätsklick nach Long Press in ein gerade
  geöffnetes Menü umleiten. Ein räumlich begrenzter Freigabeklickschutz verhindert
  auch die Default-Aktivierung eines dort liegenden Labels. Er wird nach Freigabe,
  Abbruch oder Fokusverlust entfernt und hat eine begrenzte Rückfallfrist.
* Zusätzlich setzte die bestehende gemeinsame Drag-Funktion die automatische
  Schalterposition auch nach einem Kurztipp neu. Nach einem vorherigen Drag des
  anderen Schalters konnte der Temperaturschalter zwischen `pointerup` und dem
  Kompatibilitätsklick wegwandern. Nur ein beendeter Drag speichert und positioniert
  jetzt neu. Kurztipp und Long Press erhalten das ursprüngliche Klickziel.

## Gemeinsame Premium-Komponenten

`premium-ui.js` verwendet die vorhandenen Originalassets für Schließen und Info,
die metallische Eye-Minimieren-Schaltfläche und das vorhandene
`release-history-future-chevron`. Keine SVG-Nachzeichnungen, Unicode-Icons oder
neuen Bilddateien. Die Eye-Infofunktion bleibt erhalten und verwendet dasselbe
Hi-Res-Informationsasset. Das Minimieren verwendet eine CSS-Glyphe innerhalb der
vorhandenen metallischen Schaltfläche statt austauschbarer Textzeichen.

Der vorhandene metallische Rahmen im Skeleton wird auf Wind, Temperatur und
Kartenansicht erweitert. Goldverlauf, dunkler Hintergrund, Licht und Schatten
werden nicht separat kopiert. Die Panel-Ecken folgen einheitlich der Eye-Referenz.
Schließen und Info besitzen 40-Pixel-Ziele. `prefers-reduced-motion` deaktiviert
die neuen Übergänge, ohne den Inhalt oder die Einstellungen zu verändern.

Wind: Animation und Windgeschwindigkeits-Farbfläche sind unabhängig einklappbar.
Auch die vorhandenen Abschnitte verwenden dasselbe Chevron und dieselbe Animation.
„Gespeicherte Hoch-/Tiefdruckfarben (inaktiv)“ bleibt inhaltlich unverändert.

Temperatur: Farbfläche, Temperaturwerte, Advektion 850 hPa, Kartenschalter/Legenden,
GeoPoint Inspector und Diagnose verwenden dieselbe Komponente. Einheiten und
Farbstützpunkte bleiben vorhanden. Es gibt keine neue meteorologische Datenlogik.

## Skalen

* Wind nutzt die vorhandenen 13 Beaufort-Farbstufen und `BEAUFORT_LIMITS` in m/s.
  Umrechnung und Einheit folgen der bestehenden Einstellung. Der Balken benennt
  gleich breite Beaufort-Stufen, keine lineare m/s-Achse. Klassen sind als lesbare,
  umbrechende Einträge dargestellt. Windfahnenbeispiele bleiben sichtbar.
* Die Temperaturfläche bleibt kontinuierlich. Die Klassenansicht erklärt die
  vorhandenen neun Farbstützbereiche, statt sechs neue äquidistante Pseudoklassen
  einzuführen. Die Karte wird dadurch nicht quantisiert. °C/°F/K und die
  ausschließlich für extreme Hitze verwendete Violettgrenze bleiben erhalten.
* Advektion verwendet exakt die bestehenden Darstellungsgrenzen 0,05 / 0,4 / 2
  für `rate * advectionStrength`. Die beschrifteten Werte werden durch die aktuelle
  Farbdifferenzierung geteilt; Einheit ist weiterhin K/h. Kalte starke Advektion
  hat dieselbe blaue Klasse wie zuvor, keine erfundene zusätzliche −2-Klasse.
  Klassen benennen vollständige Intervalle; der Balken verwendet kompakte
  Orientierungswerte und die explizite Kennzeichnung als Advektions-Farbstufen.
  Numerische Farbergebnisse werden an Grenzwerten und mehreren Stärken mit der
  bisherigen Funktion verglichen.

## Kartenschalter, Wind-Schnellzugriff und Speicherung

Wind und Temperatur verwenden weiterhin dieselbe vorhandene Eye-Drag-Funktion.
Kurzklick schaltet die jeweilige globale Sichtbarkeit; Long Press nach 600 ms
öffnet genau das vorhandene Einstellungsfenster. Bewegung über sechs Pixel beendet
den Long-Press-Timer. Pointer Capture, Abbruch und Fokusverlust werden berücksichtigt.
Die Karte wird beim Verschieben nicht mitbewegt. Unabhängige Positionen bleiben in
den bisherigen geräte-/ansichtsbezogenen Speichern und innerhalb der Kartenränder.

`barbsVisible` ist eine additive Windoption, standardmäßig wahr. Das Icon schaltet
ausschließlich diese Option. Sie wirkt auf den vorhandenen Windfahnenmodus;
Pfeil-/Animationsmodus, Farbfläche, globale Sichtbarkeit und übrige Einstellungen
bleiben erhalten. Die bisher gegenseitig auswählbaren Symbolmodi werden nicht zu
neuen parallelen Wetterebenen umgebaut. Bei ausgeschaltetem Wind aktiviert das
Windfahnen-Icon die Hauptdarstellung nicht.

Die bisherigen Storage-Schlüssel und Schema-Migration bleiben erhalten.
Legendenoptionen ergänzen `minimized` und `explanation`. Ausschließlich UI-bezogene
Menüsektionen und Menü-Minimierung liegen getrennt unter
`gewitterradar:premium-ui:v1:<Bereich>`; Wetteroptionen werden dort nicht dupliziert.

Kartenansicht enthält Standard, Groß, Vollbild und den bestehenden WeatherRouter-
Zugang. Nur die redundanten Wind-/Temperatur-Einträge entfallen. Die Breite beträgt
höchstens 244 Pixel und bleibt viewportbegrenzt. `box-sizing`, schrumpfbare Flex-
Inhalte und Umbruch beheben den rechten Überstand; Inhalte werden nicht als
Layoutkorrektur abgeschnitten.

## Prüfungen und Abnahmegrenzen

Gezielte Automatisierung: `tests/gr-premium-ui.test.mjs` sowie die vorhandenen
Wind-Schnellschalter-, Temperatur- und Legendenprüfungen. Insgesamt 33 Tests,
einschließlich Pointer-Abbruch, 600-ms-Timer, unabhängiger Zustände, exakter
Advektionsfarben, geschützter numerischer Renderer/Datenpfade und Originalassets.
Bei Quellvergleichen werden ausschließlich Import-Cachekennungen und
Plattform-Zeilenenden normalisiert; meteorologischer Code wird weiter exakt geprüft.

`scripts/test-gr-premium-ui-browser.cjs` lädt den vollständigen aktuellen
36-Modul-Baum mit Leaflet. Nur Anbieter-I/O und Felddaten sind synthetisch.
Ansichten: Desktop 1280×850; Android 320×740, 393×851, 851×393; iPad
820×1180 und 1180×820. Echte Touch-Ereignisse werden innerhalb der Browseremulation
für Long Press/Drag verwendet, Maus auf Desktop. Das ist keine physische Geräte-
oder Companion-Abnahme. Screenshots und Ergebnisse sind synthetische CI-Artefakte;
es werden keine HA-Realdiagnosen in dieses Repository geschrieben.

Weitere Prüfungen: Modul-/Versionsidentität, Frontend-/HA-/Dashboard-Parität,
Originalasset-Retention, deterministischer Build einschließlich negativer
Manipulationsprüfungen und installierbare HA-Paketstruktur. Öffentliche CI-Läufe,
abschließende Commit-SHAs und Paketprüfsummen werden im Release-Nachweis ergänzt.

Der erste öffentliche Frontendlauf 42477343029 fand eine Asset-SHA-Abweichung:
Die lokale Windows-Datei des Runtime-Manifests war vor der durch Git festgelegten
LF-Normalisierung gehasht worden. Die Auslieferungstexte sind jetzt auf diese
kanonischen Git-Bytes normalisiert; Asset-Inventar und Frontend-Prüfsummen wurden
daraus neu erzeugt. Keine Änderung der Prüflogik und keine Abschwächung des
Manipulationsschutzes. Die öffentlichen Prüfungen werden auf dem korrigierten
Commit erneut ausgeführt; der erste Lauf ist kein Freigabenachweis.

## Betroffene Quellbereiche

`frontend/modules/weather/{premium-ui,premium-legend,wind-legend,temperature-legend,
wind-display,temperature-display,display-menu,layer-menu,legend-overlay,wind-data,
temperature-data}.js`, `frontend/modules/ui/skeleton.js`, deren versionierte
Importstellen und beide Auslieferungskopien. Dazu Versions-/Runtime-/DRA-Metadaten,
Build-Inventar, Prüfsummen, gezielte Tests, öffentliche CI und diese Dokumentation.
Wettertransport, numerische Felder, Radarmosaik und Animationsscheduler erhalten
keine funktionalen Änderungen.
