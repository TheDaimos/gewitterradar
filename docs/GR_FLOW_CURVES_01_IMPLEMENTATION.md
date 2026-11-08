# GR-FLOW-CURVES-01 · Gemeinsame organische Strömungsgeometrie

Datum: 08.11.2026. Neue DEV-Linie **GR 4.11.157 / HA 0.25.64 / Runtime 411157r1 / Modulsatz E411-157A1**, weiterhin 36 registrierte Module. Entwicklung und DRA-Auslieferung ausschließlich `TheDaimos/gewitterradar@deploy/dev`.

**WeatherRouter bleibt unverändert bei 0.10.298 / Loader 301**, Commit `1b777a1b9593a5fd5b1f71ba6332ecb2883a39d5`. Es fehlt kein Datenvertrag. Weder neuer Endpunkt noch neue Wetterdatenlogik oder WR-Version sind erforderlich.

## Verbindlicher Ausgangspunkt und Schutz

Geschützte Benutzerreferenz: GR 4.11.156 / HA 0.25.63, Commit `a607639ad2a6373c62e04ce8acfc39f72feb280a`. Der beim Einstieg tatsächlich abgeglichene GR-HEAD `70422b2b04e0865b19449ada5235c0a130dcfa63` ergänzt ausschließlich `GR_WR_TEMPERATURE_WORLD_USER_REFERENCE_2026-11-08.md`. Diese Referenz wurde über GitHub vollständig gelesen; ihr Blob `09508ec129ed9c3c653f2c141d933e7ca904f8ae` bleibt unverändert. Kein Rücksetzen auf ältere Commits, keine neue Funktionsreferenz ohne Benutzerbestätigung.

Keine Änderung an Providerwahl, Consumer-Transport, WR-Freigaben, Temperatur-/Windfeldvertrag, Interpolation numerischer Werte, Advektionsberechnung, Kelvinwerten, Temperaturumrechnung, Wind-/Temperatur-/Advektionspaletten, Radar-/OPERA-/NASA-Mosaik, Source-Zoom, Cache, gemeinsamen RAF-Clock oder GeoPoint-Datenmodell. Keine Wiederholung von TEST69. PROD VM101 und HA DEV VM109 werden nicht automatisch verändert.

## Ausgewertete Referenzvideos

Alle fünf bereitgestellten Dateien waren unter den angegebenen lokalen Downloadpfaden vorhanden. Sie wurden mit dem Browserdecoder erschlossen. **Auswertung anhand extrahierter Einzelbilder und zeitlicher Folgen, keine Behauptung einer kontinuierlichen Videowiedergabe.** Über die gesamte Dauer verteilte Frames sowie jeweils eine etwa 1,5-sekündige Folge mit 50-ms-Abständen wurden extrahiert; die Übersicht und zeitliche Bildfolgen aller fünf Aufnahmen wurden visuell betrachtet.

| Video | Dauer | Auflösung | Ausgewählte Frames |
|---|---:|---|---:|
| 77189.mp4 | 41,94 s | 1200×2608 | 91 |
| 77190.mp4 | 33,16 s | 1200×2608 | 91 |
| 77191.mp4 | 12,31 s | 1200×2608 | 53 |
| 77193.mp4 | 7,52 s | 1200×2608 | 46 |
| 77194.mp4 | 19,64 s | 1200×2608 | 68 |

Insgesamt 349 Frames. Die Videos, Originalframes und Übersichtsbilder werden nicht ins Repository oder in Installationspakete übernommen. Kein proprietärer Code und keine Windfinder-Grafiken wurden übernommen.

Beobachtungen: sehr schlanke helle Striche, leicht akzentuierte Köpfe ohne große Dreiecke, deutlich kürzere Elemente in schwächerer Strömung, längere sanfte Bögen an Strömungsgrenzen und um den sichtbaren Wirbel in 77190. Die Folgen zeigen Fortbewegung und Formänderung; zum Teil wird gleichzeitig die Karte bewegt oder gezoomt. Deshalb wurden weder exakte physikalische Windgeschwindigkeiten noch eine belastbare pixelgenaue Partikelgeschwindigkeit aus den Videos abgeleitet. Die Quellpalette der Videos bleibt eine Windgeschwindigkeitsskala und wird nicht als Temperatur-/Advektionspalette übernommen. Die interne Windfinder-Technik ist unbekannt.

## Vorhandene Renderer und gezielte Erweiterung

Wind verwendet `WindCanvas` mit bestehender Partikelverwaltung, Pool, vorgefertigter Mercator-Projektion, bilinearer U/V-Abfrage, maskengeprüften Bewegungsschritten, begrenzter Dichte und gepufferten Farbflächen. Klassische Windfahnen und statische Pfeile bleiben in `drawWindGlyph`. Isolierte Windpunkte erhalten weiterhin ausschließlich ihre bestehende lokale Darstellung; aus ihnen wird keine räumliche Kurve erfunden.

Temperatur verwendet `TemperatureCanvas` mit getrennten Ebenen für Fläche, Werte und Advektionspfeile. Seine numerische Grundlage ist weiterhin die WR-freigegebene gemeinsame 850-hPa-Ebene. Beide Renderer teilen bereits einen nativen RAF-Broker. Diese Infrastruktur wird beibehalten.

Neu sind die nicht separat registrierten Hilfsmodule **`flow-geometry.js`** und **`flow-locales.js`**. Die geometrische Implementierung ist für Wind und thermische Advektion identisch. Es gibt keine zweite Downloadengine, kein neues Polling und keinen zweiten dauerhaften Scheduler.

## Numerisches Kurvenverfahren

Das aktuelle U/V-Feld wird über den bestehenden `sampleWindFieldInto`-Sampler gelesen. Die numerischen Feldwerte werden nicht verändert. Für die geometrische Bewegung wird die normierte lokale Richtung in die vorbereitete, rotationsfähige Mercator-Basis abgebildet. Das ist eine visuelle Geschwindigkeit in CSS-Pixeln und keine Behauptung maßstabsgetreuer Luftbewegung.

Ein Midpoint-/RK2-Schritt ermittelt die Richtung zunächst am Anfang, dann am halben Weg. Ein regulärer Teilschritt beträgt höchstens 2,5 CSS-Pixel. Bei stärkerer Richtungsänderung zwischen Anfang und Mittelpunkt wird der Schritt bis zu viermal halbiert; die Winkelprüfung verwendet ein Skalarprodukt unter 0,99 und wird nur für Schritte über 0,12 Pixel weiter unterteilt. Ein gezielter Subpixel-Wirbeltest schützt vor einer nach außen wachsenden Integrationsspirale.

Jedes Element besitzt einen begrenzten Ringpuffer aus **24 geografischen Wegpunkten**. Nach etwa 2,5 Pixeln zurückgelegtem Weg kommt ein Stützpunkt hinzu. Kopfposition und lokaler Vektor werden weiter je Frame aktualisiert. Dadurch biegt zuerst der Kopf ab, während der Körper den zuvor zurückgelegten Weg zeigt und nachzieht. Keine Sinuswelle, Zufallskrümmung oder einmalig gebogene, anschließend dauerhaft starr rotierte Grafik.

Ein neu aktiviertes oder pausiertes Element erhält höchstens drei kurze, gültige rückwärts integrierte Startpunkte. Diese initiale Stromlinie wird bei laufender Bewegung durch echte zurückliegende Trajektorien ersetzt. Nullwind erzeugt keine Strömung.

Der sichtbare jüngste Abschnitt wird auf die gewünschte Länge gekürzt. Seine aufsummierte absolute Richtungsänderung bleibt unter **2,4 Radiant**. Enge Wirbel verkürzen damit den sichtbaren Körper, statt vollständige Schleifen oder Selbstüberschneidungen zu erzwingen. Neue Modell-/Zeitgenerationen verwerfen den alten Kurvenkörper; die bestehende geografische Kopfposition wird nicht pauschal neu verteilt.

## Zeichnung, Richtung und Masken

Quadratische Bézierabschnitte verbinden die Stützpunkte über Mittelpunkte. Sie vermeiden starke Spline-Überschwinger. Der Endkontrollpunkt ist auf die aktuelle lokale Windtangente ausgerichtet. „Geschwungene Pfeile“ ergänzen dort einen kleinen offenen Pfeilkopf. „Geschwungene Linien“ behalten den schlanken Charakter: schwächerer Körper, dezent heller/breiter gezeichnetes kurzes Kopfsegment, runde Kappen und kein großes Dreieck. Bestehende Benutzerfarben und Kontrastkonturen bleiben maßgeblich.

Bewegungsschritte, Kurvenabschnitte und der Kopfkontrollpunkt respektieren gültige Vektorzellen. Bei NoData oder fehlender Abdeckung wird abgebrochen bzw. ausgeblendet. Es wird kein ungültiger Bereich gefüllt oder überbrückt. Bei vollständig gültigen Gittern wird dieselbe Rechteckabdeckung in vorbereiteten Mercator-Grenzen geprüft; bei Masken bleibt die vorhandene konservative Zellprüfung aktiv. Die schnelle Variante wird nur für tatsächlich lückenlose, bereits validierte Gitter verwendet.

Wegpunkte bleiben geografisch gespeichert. Beim Kartenverschieben/-zoomen werden sie mit der bestehenden Projektion dargestellt. Längengrade werden für Weltkopien am Kopf ausgerichtet, während dieselben kanonischen Felder wiederverwendet werden. Hohe Breiten und Kartenrotation sind durch die konforme Projektionsbasis berücksichtigt. Es entstehen keine zusätzlichen Abfragen pro Weltkopie.

## Gemeinsame Längen- und Geschwindigkeitssteuerung

Für beide Visualisierungen gilt bei positiver Windgeschwindigkeit `s` in m/s:

* Grundlänge: `7 + 33 × (1 − exp(−s / 14))` CSS-Pixel.
* Gespeicherter Längenfaktor: 50–150 %, Gesamtobergrenze 64 CSS-Pixel.
* Visuelle Geschwindigkeit: `70 × (1 − exp(−s / 17))` CSS-Pixel/s, multipliziert mit dem vorhandenen Tempo Langsam/Normal/Schnell (`0,55 / 1 / 1,7`).
* Frame-Delta bleibt auf maximal 50 ms begrenzt. Pause und Rückkehr aus einer unsichtbaren Seite setzen den Bewegungs-Zeitbezug sauber neu an.

Die Temperaturdarstellung berücksichtigt zusätzlich ihren bestehenden Pfeilgrößenregler, ebenfalls begrenzt auf 64 Pixel. Bewegung und Länge hängen ausschließlich vom zugrunde liegenden Wind ab. Advektionsstärke und Temperatur-Anzeigeeinheit werden nicht als Bewegungsgeschwindigkeit verwendet.

## Thermische Advektion und Farben

Die Linien bewegen sich entlang des freigegebenen 850-hPa-U/V-Windfelds. Ihre Farbe bleibt die bisherige Zuordnung aus K/h-Advektion: Blau/Türkis kalt, neutral dezent, Orange/Rot warm und der vorhandene starke Warmton. Die numerische Advektionsberechnung findet unverändert in WR statt. Ein blauer Abschnitt muss deshalb nicht nach Süden, ein roter nicht nach Norden zeigen.

Celsius, Fahrenheit und Kelvin bleiben reine Anzeigeoptionen. Sie beeinflussen weder Trajektorie, Geschwindigkeit, Masken noch thermische Farbe. Die eigenständigen Temperatur- und Advektionslegenden werden um die passenden kurzen Bedienhinweise ergänzt; Paletten, Zeitangaben, Drag-Mechanismen und gespeicherte Positionen bleiben erhalten.

## Menü, Persistenz und Sprachen

Im vorhandenen Windmenü ergänzt **„Strömungsform“** den Animationsbereich: Klassisch, Geschwungene Pfeile, Geschwungene Linien. Windfahnen, statische Pfeile und bisherige Animation behalten ihre vorhandenen Moduswerte. Kurven sind für das numerische animierte Windfeld vorgesehen; ohne räumliche Felddaten bleibt die bestehende Punktdarstellung erhalten und ein Hinweis erläutert die Grenze.

Im vorhandenen Temperaturmenü befindet sich **„Advektionsform“** unter den Advektionsoptionen: Bisherige Pfeile, Geschwungene Pfeile, Geschwungene Linien. Beide Menüs bieten den relativen Linienlängenregler. Geschwindigkeit, Dichte, Pause, Farben, thermische Filter, Deckkräfte, Einheiten, Kartenschalter und Sichtbarkeit bleiben unabhängig bedienbar.

`flowForm` und `flowLength` ergänzen die bestehenden Storage-Schemata, ohne deren Schlüssel zu ersetzen. Fehlende oder unbekannte Formwerte werden zu **classic** normalisiert. Vorhandene Installationen aktivieren keine neue Darstellung ungefragt. Wind- und Temperaturauswahl werden unabhängig gespeichert und nach Reload wiederhergestellt. Ein Form-/Längenwechsel bei vorhandenem Feld benötigt keine Wetterdatenabfrage.

`flow-locales.js` ergänzt zwölf Schlüssel je Sprache im bestehenden I18N-Vertrag, **alle 19 registrierten Sprachen** einschließlich der vorhandenen Dialektvarianten. Auswahltexte, Strömungs-/Advektionsform, Linienlänge, Bewegungsrichtung, Hilfe und Punktdaten-Einschränkung verwenden `_t`; es entsteht keine zusätzliche Sprachwahl. Sprachwechsel aktualisieren auch die bereits erzeugten Menüs und Legenden.

## Performance und begrenzter Speicher

Die klassische Partikeldichte und deren bisherige Qualitätssteuerung bleiben erhalten. Neue Kurven verwenden eine getrennte interne Qualitätsgröße, die ausschließlich ihre geometrische Dichte steuert. Gespeicherte Einstellungen werden dadurch nicht geändert. Die Kurvendichte beginnt konservativ, sinkt bei gemittelter Zeichenzeit über 6 ms schrittweise und steigt erst unter 3 ms langsam wieder an. Hysterese und kleine Schritte vermeiden einen laufenden Wechsel zwischen hoher und niedriger Qualität. Der klassische Qualitätswert wird dadurch nicht abgesenkt.

Für Kurven gelten zusätzliche Grenzen von höchstens 450 Elementen im mobilen und 1.100 im größeren Wind-Viewport, innerhalb des bestehenden Partikelpools. Der Längen-/Dichteunterschied gegenüber kurzen klassischen Segmenten ist absichtlich sichtbar: längere Kurven benötigen weniger gleichzeitige Elemente. Unter starker künstlicher CPU-Drosselung kann die wirksame Anzahl deutlich kleiner als bei klassischen kurzen Strichen sein; der Benutzer-Dichtewert bleibt gespeichert.

Pro Partikel sind höchstens 384 Byte numerische Historie vorgesehen; aktive und wiederverwendete Partikel bleiben durch den vorhandenen Pool begrenzt. Die Kurvengeometrie verwendet wiederverwendete Scratch-Puffer und zeichnet höchstens 25 vorbereitete Punkte, normalerweise auf neun mobile bzw. bis zu 13 Zeichenpunkte reduziert. Bei maskierten Feldern wird zur Sicherheit nicht über unbekannte Zwischenbereiche dezimiert. Keine Objektallokation für jeden Stützpunkt und kein unbeschränkt wachsender Trail.

Die bestehende Darstellungsdiagnose enthält Kurvenzahl, Zeichenpunkte, Integrationsschritte, Qualitätsfaktor und ein konservatives Historienbudget. Wetterdatenabrufe oder UI-Neuaufbau sind dafür nicht pro Frame nötig.

Die ersten unbeschränkten Prototypen überschritten das gewünschte Kurvenbudget deutlich (Android-CPU×6 etwa 17–20 ms für Windkurven). Diese Variante wird nicht ausgeliefert. Schnelle Gitterabdeckungsprüfung, begrenzte Zeichenpunkte und die getrennte adaptive Dichte reduzieren den Aufwand. Abschließende Messwerte und Paket-/CI-Identitäten folgen im Release-Nachweis.

## Gezielte Prüfungen und Grenzen

Zwölf neue technische Tests behandeln konstante und rotierende Felder, dynamische Historie, Tangenten, enge/subpixelgroße Wirbel, begrenzte Länge/Geschwindigkeit, Delta-Zeit/Pause, ungültige Werte, NoData, Weltkopien, Rotation, Speicherbegrenzung, persistente Defaults, alle 19 Sprachverträge und unveränderte meteorologische Verträge. Dazu kommen die bisherigen 49 gezielten Wind-/Temperatur-/Legendenprüfungen.

Die früheren Ganzdatei-Sperren auf `wind-canvas.js` wurden für die ausdrücklich beauftragte Erweiterung präzisiert: Klassische Glyphengeometrie, Punktdarstellung, klassische Bewegung, ursprüngliche klassische Dichte, Scheduler-Methoden und Farbflächen-/Cachemethoden werden abschnittsweise bytegleich mit der akzeptierten Referenz verglichen. Numerischer Windfeldsampler, Temperaturvertrag, Kelvin-/Einheitenhilfe, Consumer-Transport, Niederschlagsrenderer und Referenzdateien bleiben weiterhin vollständig unverändert geprüft. Kein stilles Entfernen des Regressionsschutzes.

Der vollständige registrierte GR-Modulbaum wird in Desktop, Android Hoch-/Querformat und iPad Hoch-/Querformat geladen. Geprüft werden echte vorhandene Menüs, neue/klassische Formen, Bewegung/Pause, gemeinsame RAF-Anforderung, Umschalten ohne zusätzliche Wetterabfrage, Wind-/Temperatur-Unabhängigkeit, Temperatureinheit, alle neuen Sprachtexte, World-Wrap, Persistenz, verdeckte Seiten und Ressourcenfreigabe. Synthetische WR-Felder ersetzen ausschließlich die externen I/O-Antworten.

Browseremulation und CDP-CPU-Drosselung sind **keine** physische Android-/iPad-/iPad-Pro-Abnahme. Kein Anspruch auf pixelgenaue Windfinder-Kopie, keine unbekannte proprietäre Technik nachgebaut. Bei grobem oder fast konstantem autorisiertem Feld entstehen entsprechend geringere Krümmungen; zusätzliche Verwirbelungen werden nicht erfunden.

## Betroffene Dateien und Auslieferung

Neue Frontend-Helfer: `flow-geometry.js`, `flow-locales.js`. Gezielte Erweiterung von `wind-canvas.js`, `temperature-canvas.js`, Wind-/Temperaturkonfiguration, den bestehenden Displaymenüs und Legenden sowie Sprachwechsel-Hook. Geänderte Modulversionen: Winddarstellung 0.4.4, Temperaturdarstellung 0.1.1, I18N 1.3.11, Manifest 1.2.177. Kein zusätzlicher registrierter Hauptbaustein.

Boot-/Importkennungen, Runtime-/DRA-/HA-Metadaten, Source-, HA- und Dashboard-Kopien und Prüfsummen werden gemeinsam auf den neuen DEV-Stand synchronisiert. Original-Premiumgrafiken bleiben unverändert. Neue gezielte Geometrie-/Browser-/Benchmarktests und öffentlicher CI-Scope; synthetische Ergebnisse dürfen keine echten HA-Exporte enthalten. Echte Diagnose-/Realtestexporte gehören weiterhin ausschließlich nach `TheDaimos/Project-Log-And-Export@main`.

Keine Änderungen und keine Actions im privaten WR-Repository. Öffentliche CI ausschließlich im GR-Repository; der öffentliche WR-Prüfstand benötigt ohne WR-Codeänderung keinen neuen Lauf. Die Referenz bleibt der dokumentierte Benutzerstand 156/298, nicht automatisch diese neue Version.

**Release-Nachweise werden nach erfolgreicher öffentlicher CI und Paketprüfung ergänzt. Bis dahin keine Fertigmeldung.** Keine automatische Installation; die visuelle Realabnahme auf VM109 bleibt beim Betreiber.
