# WR-GR-MOSAIC-COMPLETENESS-01 / WR-OPERA-COVERAGE-MASK-01 / WR-GR-WORLD-WRAP-01

2026-11-06 · **WR 0.10.294 DEV / Loader 297 · GR 4.11.147 DEV / HA 0.25.54 DEV**.

## Entwicklung und Bereitstellungsgrenze

Kanonisch ausschließlich `TheDaimos/weather-router-dev@deploy/dev` (privat) und
`TheDaimos/gewitterradar@deploy/dev` (öffentlich). Private Actions bleiben
deaktiviert. Die drei bestehenden gezielten GR-Releaseprüfungen laufen nur im
öffentlichen GR-Repository. Keine private Quelle oder OPERA-Originaldatei wird
in öffentliche CI kopiert. Diagnose-/Realtestexporte ausschließlich im privaten
`TheDaimos/Project-Log-And-Export@main`. Lokale synthetische Browserbilder unter
`artwork/acceptance/mosaic-completeness01` sind Funktionsprüfungen, keine Realabnahme.
Historische Tags WR289 / GR141 bleiben erhalten. VM101 wurde nicht angesprochen.

## Konkrete Änderungen

Der bisherige Planer optimierte die freie Fläche einzelner vollständiger NASA-
Quellkacheln. OPERA reservierte dabei seine gesamte rechteckige Rasterhülle.
Der neue additive V2-Ausführungsvertrag `context.raster_contract: 2` plant den
gesamten 130-%-Ausschnitt. NASA wählt die feinste native Quellstufe bis z6, deren
vollständiges Gitter in 48 Kacheln passt. Anschließend werden nur vollständig
geschützte Kacheln entfernt. Gemischte Kacheln bleiben mit verpflichtender Maske
zugelassen. Keine geografische Teilmengenauswahl und keine Budgeterhöhung.
Auch ein bereits von der regulären WR-Politik ausgewähltes NASA-Bild erhält
die Radar-Zeichenausschlüsse. Dies aktiviert weder die optionale NASA-Ergänzung
noch erweitert es deren Zeit-/Einwilligungsregeln.

Auch reguläre Quellen erhalten `raster_plan: source_tiles_v1` mit ausdrücklichen
WR-Koordinaten. OPERA verwendet bei kleinen Kartenzooms geeignete höher aufgelöste
Quellen, soweit das separate reguläre Anfragebudget ausreicht. Bei Überschreitung
wird der vollständige Ausschnitt auf einer gröberen Stufe neu geplant. GR führt
Vorfahren- und Nachfahrenpläne aus; es bestimmt keine eigene meteorologische
Quellauflösung. Ein ausdrücklich unvollständiger regulärer Plan ersetzt keine
aktive Generation. Kartenzoom 0–18 bleibt unterstützt.

`opera_observation_coverage.py` verwendet ausschließlich den bestehenden
kalibrierten ODIM-Fensterleser: positive gültige RATE-Werte = beobachtet/nass;
tatsächliche Null = beobachtet/trocken; ODIM-Undetect = gültig unterhalb der
Nachweisgrenze; NoData = unbeobachtet; negative/nicht endliche ungültige Werte =
unklar und geschützt. Keine PNG-, Farb- oder Transparenzinterpretation.
Semantische Referenz: EUMETNET ODIM H5 2.4, NoData/Undetect-Definitionen.

Die Maske verwendet dieselbe bestehende LAEA-/north_first-Koordinatenfunktion
wie der Renderer. Seine bisherige Koordinatenrechnung wurde exakt in eine
gemeinsame Funktion extrahiert. Große Quellfenster werden ausschließlich beim
I/O in begrenzte Zeilenstreifen zerlegt; Kalibrierung, Samplepositionen, Palette
und Orientierung bleiben gleich. Die fünf ursprünglichen TEST69-Blob-Hashes
bleiben unverändert. Eine eng begrenzte, exakt reversible Integrationsnormalisierung
prüft die bereits anerkannten wissenschaftlichen Quellanteile weiterhin; jede
Abweichung an der extrahierten Rechnung verletzt diese Integritätsprüfung.
TEST69 wurde weder verändert noch ausgeführt und es gibt keine neue Freigabe.

Originalbeobachtungen werden konservativ in kompakten 4×4-Quellblöcken und
128×128-Bitmaskenkacheln zusammengefasst. Ein zusätzlicher Quellblock schützt
gemischte Ränder; jede beobachtete oder unklare Zelle bleibt reserviert.
Die Maskenmatrix wird auf höchstens 256 sparse Kacheln begrenzt. Die Auflösung
kann deshalb konservative Randstreifen sperren; sie behauptet keine meter- oder
pixelgenaue Radarreichweite. Die Rasterhülle folgt den bestehenden projizierten
Gitterkanten, statt nur die vier Ecklatituden zu verbinden.

Masken-SHA, Beobachtungszeit und WR-valid_until gehören zur selben registrierten
Rastergeneration. Die bestehende vertrauenswürdige Registrierung übernimmt die
Maske atomar vor dem Freischalten. Bei Maskenfehler bleibt die vorherige zulässige
Generation erhalten. Explizit abgelaufene OPERA-Registrierungen entfernen auch
ihre alte Reservierung. Keine GR-Altersgrenze. Kein Vorschau-Freigabepfad.

DWD-WMS liefert im vorhandenen Vertrag eine autoritative geografische Hülle,
keine numerische Beobachtungsmaske. Diese Hülle bleibt konservativ geschützt.
WR übergibt sie zusätzlich als OPERA-Zeichenausschluss, sodass auch trockenes
DWD Vorrang hat. Reihenfolge bleibt DWD vor OPERA vor NASA.

`radar-mask.js` validiert begrenzte Masken, Generationen und Quellpläne. Im
bestehenden Canvas-Compositor werden geschützte NASA-Bildbereiche tatsächlich
transparent ausgeschnitten, bevor das Bild in die reguläre Kachel gelangt.
Das Widerrufen einer NASA-Freigabe erhält die geschützten Radarpixel desselben
Canvas. Ein beschädigter oder zeitlich nicht passender V2-Maskenvertrag darf
keinen unbeschränkten V1-Rückfall auslösen.

Leaflet verwendet ausdrücklich World-Wrap. Reguläre gleichzeitige Bildanforderungen
werden nach kanonischer Quell-URL zusammengeführt; jede sichtbare Kopie besitzt
eine eigene Abbruchreferenz. NASA verwendet weiterhin seinen vorhandenen
gemeinsamen Lease-Manager. Alle Kopien erhalten dieselbe WR-Maske. Erfolgreiche
Bilder bleiben wiederverwendbar. Fehlgeschlagene temporäre NASA-Koordinaten
werden innerhalb der WR-Gültigkeit gezielt mit begrenztem Backoff wiederholt,
ohne erfolgreiche Koordinaten neu zu laden. 401/403/404 beenden den Abruf.
Beim Ersatz eines weiterhin gültigen montierten NASA-Mosaiks wartet die neue
Generation zusätzlich auf die autorisierten sichtbaren NASA-Fragmente. So
verschwinden dessen erfolgreiche Bildbereiche nicht nach nur einem neuen
Teilbild. Ein Kaltstart mit Radar wartet weiterhin nicht auf NASA.

NASA-Option 2–32 / Standard 6, adaptive Überlastungssteuerung, Retry-After,
128 gleichzeitig gehaltene NASA-Bilder, Ringpuffer, Einstellungen, Georeferenzierung,
Farbpalette, Premium-Legende und Darstellungsmodi bleiben erhalten. Kein NASA-
Ringpuffer und keine neue Download-, Diagnose- oder Renderingengine.

## Diagnose und gezielte Nachweise

Der bestehende Export enthält nun den autorisierten Plan, Quellzoomstufen,
Maskenmanifest/Generation/WR-Gültigkeit, angeforderte/reservierte/freigegebene
Maskenfläche, geplante/geladene/fehlende Quellen, tatsächliche Canvas-Übernahmen,
Maskenanwendung, Cache-/Transportwiederverwendung sowie sichtbare Weltkopien mit
kanonischen Koordinaten. Planvollständigkeit, Bildvollständigkeit und tatsächliche
meteorologische Beobachtungsabdeckung sind getrennte Aussagen. Ein geladenes
NASA-Bild beweist weiterhin keine durchgehende IMERG-Beobachtung an jedem Pixel.

Vorhandene WR-Exporte des beauftragten Zeitraums wurden aus dem privaten Exportziel
gelesen. Die dort dokumentierten `exclusive_tiles_v1`-Pläne begründen keine
pixelgenaue OPERA-Abdeckung. Die benannten separaten GR-JSON-Dateien waren zum
erneuten Abruf weder am angegebenen lokalen Pfad noch als GR-Dateien im Repository
verfügbar; deren im Auftrag beschriebene Befunde werden nicht als selbst erneut
ausgelesene GR-Nachweise ausgegeben.

Gezielt lokal bestanden: 61 WR-NASA/V2-Vertragsfälle einschließlich des tatsächlichen WebSocket-Handlerpfads; 50 WR-Fälle plus
16 vorhandene Subtests einschließlich sechs neuer direkt benötigter Prüfungen;
38 GR-Fälle einschließlich fünf neuer Masken-/World-Wrap-/Transportprüfungen.
Eine vorhandene OPERA-Originaldatei belegt die Kategorien und die Zuordnung
beobachteter Zellen in die neue Maske; 2000 bestehende Beobachtungspunkte bleiben
geschützt. Das ist eine Maskenübertragungsprüfung, keine wissenschaftliche
Orientierungs- oder TEST69-Neuprüfung. Originaldaten werden nicht veröffentlicht.

Echter Leaflet-/Canvas-Browserlauf mit synthetischen Rasterdaten: Zoom 0–18,
Regionswechsel, Europa 3→4→3, fünf sichtbare Weltkopien, zusammengeführte Abrufe,
keine verworfene hängende Generation. Geschützte und freigegebene Pixel wurden
am tatsächlichen Canvas gelesen. Alle NASA-Quellen des letzten Plans wurden
geladen; keine wartenden oder aktiven Abrufe. Die gezielten öffentlichen
Releaseprüfungen werden vor Veröffentlichung der Pakete ausgewertet.

## Installation und verbleibende Grenzen

Beide DEV-Releases zusammen auf VM109 installieren, HA neu starten und den
GR-Frontendstand vollständig neu laden. WR294 bedient ältere Consumer ohne
Spatial-Capability weiter mit dem bisherigen konservativen Vertrag; GR147
fordert den neuen Vertrag an. Diese Pakete bilden die geprüfte Kombination.
ZIPs, SHA256SUMS und deployment.json nennen exakte deploy/dev-Quellcommits.
Keine bestehenden Releases werden überschrieben.

Die endgültige visuelle Realabnahme auf VM109 steht aus. Besonders prüfen:
große Erstansicht ohne manuelles Nachzoomen, Europa 3→4→3, Atlantik innerhalb
der OPERA-Hülle, trockene Radarbereiche, horizontale Weltkopien und selektives
Nachladen bei Teilfehlern. Konservative Maskenränder und die konservative DWD-
Hülle sind fachliche Grenzen; unterschiedliche Zoomauflösung bleibt legitim.
