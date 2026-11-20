# WR-GR-VIEWPORT-01 / WR-PALETTE-ALIGN-01 / WR-NASA-PERFORMANCE-01

2026-11-06 · WR **0.10.293 DEV / Loader 296** · GR **4.11.146 DEV / HA 0.25.53**.
Kanonische Entwicklung ausschließlich `TheDaimos/weather-router-dev@deploy/dev`
(privat) und `TheDaimos/gewitterradar@deploy/dev` (öffentlich). Private Actions
bleiben deaktiviert. Technische Diagnose-/Realtestexporte ausschließlich im
privaten `TheDaimos/Project-Log-And-Export@main`, niemals im Quellrepository.
Die hier abgelegten Testbilder verwenden ausschließlich synthetische Raster.
Geschützte Referenz-Tags WR289 / GR141 / HA0.25.48 bleiben unverändert.
Keine TEST69-Ausführung oder wissenschaftliche Neuberechnung. Keine VM101-Aktion.

## Behobene Codepfade

`precipitation-layer.js`: Die bisherige Wartezeit wurde auch für geografisch
neue Ausschnitte und fehlende Ebenen angewendet. Ein geänderter Viewport umgeht
jetzt die reguläre Aktualisierungssperre. moveend/zoomend/resize verwenden dieselben
vorhandenen Hooks und einen gemeinsamen 250-ms-Debounce. Unveränderte Ereignisse
erzeugen keine neue Planung. Der Schlüssel enthält Zoom, Kartengröße und genauer
aufgelöste geografische Grenzen. Auch Rückkehr zum zuvor betrachteten Gebiet plant neu.

Überholte lokale Generationen werden abgebrochen; ihr Token kann den aktuellen
Request nicht freigeben, überschreiben oder als Voraussetzung blockieren.
Der bestehende V2-Consumer begrenzt physisch noch laufende WS-Anfragen auf zwei
belegte Transportplätze und behält nur den neuesten wartenden Auftrag. HA-WS
bietet keine per-Request-Netzwerkstornierung: alte echte Sendungen behalten ihren
Platz bis Antwort/Transportdeadline. Die bestehende WR-Serverdeadline bleibt
maßgeblich. Neue Kartenereignisse erzeugen keinen unbeschränkten Request-Sturm.

Erfolgreiche Bilder einer verworfenen Staging-Generation werden begrenzt für
den Ersatz übernommen, ausschließlich bei identischer Source-ID, exakter URL
und WR-Framezeit. Laufende/fehlgeschlagene Bilder erteilen keine Freigabe.
Die vorhandenen OPERA-Wiederholungen je Koordinate bleiben erhalten. Eine alte
Antwort darf auch den globalen NASA-Modus nicht auf einen veralteten Wert setzen.

`nasa_mosaic.py`: Bei kleinen Kartenzooms konnte eine einzige grobe NASA-Kachel
die europäische Radarhülle schneiden und vollständig ausgeschlossen werden.
Der WR-Planer vergleicht jetzt sichere ganze Quellkacheln über die tatsächlich
verfügbaren Matrixstufen bis z6. Er berücksichtigt freie Fläche im aktuellen
Viewport, Quellauflösung und maximal 48 Quellkacheln einschließlich Vorladerand.
Quellzoom darf für eine sichere Ganzkachelzuweisung oberhalb des Kartenzooms
liegen. Große Ausschnitte reduzieren weiterhin die Quellauflösung innerhalb
des Budgets. Quell- und Anzeigezoom sind getrennte Größen; keine z6-Untergrenze.

`nasa-spatial.js`, `raster-mosaic-grid-layer.js`, `raster-compositor.js`: Ein
Anzeigekachel-Canvas kann mehrere höher aufgelöste, freigegebene NASA-Quellkacheln
darstellen. Diese landen exakt in ihren dyadischen Zielrechtecken. Überzoom
schneidet weiterhin den passenden Vorfahren aus. Radar und NASA können bei
niedrigem Zoom denselben Canvas benutzen, bleiben darin räumlich disjunkt.
NASA darf dessen noch fehlende Radarbereiche nicht als fertig melden. Ein
Widerruf leert nur die NASA-Rechtecke und erhält die Radardarstellung.

Die räumliche Politik bleibt `exclusive_tiles_v1`: ganze Quellkacheln außerhalb
aller verifizierten höherwertigen Radarhüllen, einschließlich trockener und
temporär nicht abrufbarer Radarbereiche. Unbekannte Coverage sperrt NASA.
Keine Interpretation transparenter Pixel als fehlende Beobachtung. Die bekannten
geraden Grenzen dieser ersten Ausbaustufe bleiben; keine neue Pixelmaske.
Geografisch oder zeitlich ungültige alte Ebenen werden weiterhin entfernt.

## Metadaten und laufende Generation

WR startet weiterhin einen separaten, begrenzten NASA-Metadatenjob. Bei
erfolgreichem Abschluss meldet der vorhandene Routing-Ereignisvertrag
`nasa_metadata_ready`. GR plant für den dann aktuellen Ausschnitt neu; das Ereignis
trägt keine eigenen Freigaben oder Rasterdaten. Ein voriger Ausschnitt ist kein
Grund, weiterhin gültige produktbezogene Metadaten zu verwerfen. Erfolgreiche
Staging-Bilder bleiben beim Ersatz wiederverwendbar. Der begrenzte 2-s-Pending-
Fallback besitzt einen eigenen Timer und wird nicht mehr vom bestehenden 8-s-
Cold-Retry überschrieben. Der V1-Fehlerfallback bleibt bei aktiver räumlicher
WR-NASA-Politik gesperrt. WR-Zeitpolitik und absolute valid_until bleiben unverändert.

## NASA-Parallelität und adaptive Begrenzung

Im WR-Lab unter Niederschlagsmosaik: **Maximale parallele NASA-Downloads**,
Ganzzahl **2–32**, Standard **6**. Bestehende Admin-WebSocket-Einstellung und
Config-Entry-Option `nasa_max_parallel_downloads`; kein zweiter GR-Regler.
Provider-/Consumer-Deny bleibt maßgeblich. Die NASA-Ergänzung selbst bleibt
standardmäßig ausgeschaltet. Neue Werte werden ohne HA-Neustart gespeichert.

WR übergibt `transport_policy.max_parallel_downloads` mit monotoner
`settings_revision` innerhalb der bestehenden V2-Antwort. Der bestehende
Routing-Ereignisvertrag kann eine Maximalwertänderung sofort auf aktive GR-Leases
anwenden, ohne gezeichnete Bilder zu löschen. Alte Generationen dürfen eine
neuere WR-Konfiguration nicht zurücksetzen. Bereits laufende Übertragungen
werden durch eine bloße Maximalwertänderung nicht unnötig verworfen.

Der vorhandene globale Live-Lease-Manager priorisiert aktuell sichtbare Kacheln
vor dem 130-%-Vorladerand. Identische Source/Frame/URL-Anfragen werden geteilt;
letzter Besitzer gibt unbenötigte Requests und Bilder frei. Kein zweiter Downloader.
Der NASA-Bildpfad verwendet nun einen CORS-fetch mit `credentials: omit` und
`cache: no-store`, damit HTTP-Status und zugängliche Retry-After-Header ausgewertet
werden können. Tokens werden nicht an GIBS gesendet. Blob-URLs werden widerrufen.

429/503 und wiederholte Timeouts halbieren das aktive Maximum, mindestens auf
einen Transport. Retry-After als Sekundenwert oder HTTP-Datum wird berücksichtigt.
Nach erfolgreicher Abkühlung steigt das Maximum schrittweise nach Erfolgsgruppen
wieder an. 32 ist nur eine Obergrenze. Erfolgreiche Nachbarn werden nicht neu
geladen; derselbe fehlgeschlagene Quellabruf hat höchstens drei Versuche.
Je Versuch weiterhin 8 s Transportdeadline. Radar behält seine eigenen Slots.

Unabhängige Grenzen: 48 Quellkacheln/Plan, 2–32 konfiguriertes Transportmaximum,
128 aktive dekodierte 256×256-Bilder (32 MiB geschätztes RGBA) über alle Leases.
Hinzu kommen Browser-/GPU-Kopien und viewportgebundene Canvas-Flächen. Der
PNG-Transport begrenzt einen laufenden komprimierten Body auf 1 MiB; bis zu 32
laufende Bodys/Blob-Übergänge beanspruchen zusätzlichen temporären Speicher.
Die RGBA-Schätzung ist ausdrücklich keine Gesamtprozess-Speichergrenze.
Keine Rasterdateien, IndexedDB, persistente Rasterdatenbank oder NASA-Ringpuffer.
OPERA-HDF5-Ringpuffer unverändert.

Die bestehende GR-Diagnose exportiert live unter `local.precipitation_radar.nasa_transport`:
konfiguriertes und effektives Maximum, laufende Transporte, Warteschlange,
Erfolge, Fehlversuche, tatsächliche Wiederholungen, adaptive Begrenzung und
Abkühlungsfrist. WR-Diagnose zeigt das zentrale konfigurierte Maximum. Die
tatsächlichen Browsertransporte werden in GR beobachtet, nicht in WR erfunden.

## Exakte Farbangleichung und ehrliche Legenden

Die vorhandene zentrale WR-Palette verwendet nun exakt alle 15 RGB-Farben der
DWD-Referenztabelle. Geändert: Spurenfarbe `#33ffff`, 45–75 `#e5004c`, ≥150
**`#0000fe` (0,0,254)**. Übrige RGB-Werte waren bereits identisch. Das gilt für
`rate_rgba`, den tatsächlichen numerischen Renderer `colorize_rate` und die daraus
erzeugten Legenden. Keine Umfärbung fertiger PNGs. Grenzen bleiben exakt
0,.2,.4,1,2,3,5,7.5,10,15,30,45,75,100,150 mm/h. NoData/Undetect, NaN,
negative und Nullwerte bleiben unverändert behandelt und niederschlagsfrei transparent.

Quelle: [DWD GetStyles, WMS 1.1.1](https://maps.dwd.de/geoserver/dwd/wms?service=WMS&version=1.1.1&request=GetStyles&layers=dwd:Niederschlagsradar).
Der reale Stil ist `ColorMap type="intervals"` und enthält native gerundete
5-Minuten-Quantities sowie angezeigte mm/h-Klassenlabels. Diese sind keine
Begründung für eine behauptete vollständig identische numerische Zuordnung.
Zusätzlich bleibt OPERA wegen der vorgeschriebenen bestehenden Grenzen bei
**>0**, während DWD seine erste sichtbare Klasse mit **0.1** deklariert.

Deshalb werden die real weiterhin unterschiedlichen vollständigen Skalen nicht
irreführend zu einem Balken verschmolzen. Die vorhandene Gruppenfunktion vereinigt
nachweislich identische Einträge einschließlich aller Grenzen, Farben, Einheiten
und Messgrößen; Positiv-/Negativfälle sind geprüft. Die tatsächlichen DWD-/OPERA-
Metadaten bleiben getrennt. Das geforderte blaue OPERA-Extrem ist unabhängig davon
vollständig umgesetzt. NASA-Regen-/SWE-Schneefarben bleiben eigenständig.
Premium-Rahmen, Chevron, Position, Klassen/Balken und Darstellungsmodi bleiben erhalten.

## Gezielte Nachweise und Installation

- 60 WR-NASA-/V2-Fälle, darunter alle Zooms, Matrixgrenzen, reservierte trockene
  Hüllen, 2–32-Validierung, Admin-Option und reale numerische RGBA-Ausgabe.
- 44 bestehende WR-Zulassungs-/HTTP-/Versionsfälle plus 16 Unterfälle;
  ausschließlich Vertrags-/Integritätsprüfungen, kein TEST69-Lauf.
- 33 gezielte GR-Fälle einschließlich tatsächlicher Staging-Methode, ausstehender
  Antworten, letzter wartender Viewportgeneration, Teilrechtecken, Retry-After,
  sichtbarer Priorität, 6/32 aktiven Slots und getrennten Speichergrenzen.
- Lokales Chromium mit echtem Leaflet 1.9.4 und dem tatsächlichen WR-V2-Service
  auf synthetischen Quellen: alle unterstützten Kartenzooms 0–18, Karibik →
  Hamburg → Karibik und Europa ↔ Atlantik ohne Reload. 25 Planungen für die
  Sequenz einschließlich Initialisierung, keine verworfene Stage. Die Regionswechsel
  lagen im lokalen synthetischen Test unter einer Sekunde. Keine Laufzeitgarantie
  für externe reale Provider daraus abgeleitet.
- Bestehende gezielte öffentliche OPERA-/V2-, Viewport- und Installationsprüfungen.
  Keine neue allgemeine Gesamtregressionskampagne. Private Actions deaktiviert.
- Pakete als DEV-Prereleases mit SHA256SUMS und exakter Commit-/Versionszuordnung
  auf deploy/dev. Beide Projekte aktualisieren; dann zentrale NASA-Option und
  gewünschtes Maximum im WR-Lab einstellen.

Die eigentliche Realabnahme der neuen Versionen erfolgt anschließend auf VM109.
