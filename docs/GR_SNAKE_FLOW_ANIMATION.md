# GR Snake Flow Animation · 4.11.161 DEV

## Ausgangsstand und Umfang

Entwicklung ausschließlich auf `TheDaimos/gewitterradar@deploy/dev`, ausgehend von
`782c035129ce9e14ca0153fe4a26bff157ffacc0` (GR 4.11.160 / HA 0.25.67).
Neue Auslieferung: **GR 4.11.161 DEV / HA 0.25.68**, Runtime `411161r1`,
Modulsatz `E411-161A1`, Windmodul 0.4.7, Core-Manifest 1.2.180.

Die zusätzliche Darstellungsart **Schlangenförmige Animation** ist unter
Winddarstellung → Darstellungsart erreichbar. Vorhandene Windfahnen, Pfeile,
klassische und geschwungene Strömungen bleiben erhalten. Eine gespeicherte Auswahl
wird weder migriert noch automatisch auf Snake umgestellt. Es gibt keinen neuen
Kartenschalter und keine Änderungen an Wetterdatenbeschaffung oder WR-Verträgen.

WeatherRouter bleibt bei 0.10.298 / Loader 301, Commit
`1b777a1b9593a5fd5b1f71ba6332ecb2883a39d5`. Die geschützte Temperatur-/Windreferenz
`docs/GR_WR_TEMPERATURE_WORLD_USER_REFERENCE_2026-11-08.md` bleibt unverändert.

## Eigenständiger Renderer

`snake-canvas.js` besitzt einen eigenen Canvas, Partikelpool und Lebenszyklus.
`snake-geometry.js` übernimmt ausschließlich die neue Bewegung und Silhouette.
`snake-config.js` definiert die zehn unabhängigen Darstellungsparameter.
Die bisherigen Wind- und Temperaturrenderer sowie `flow-geometry.js` sind abgesehen
von erforderlichen Import-Cachekennungen unverändert; gezielte Quellvergleiche
sichern dies gegen den Ausgangscommit ab.

Die vorhandene `frame-clock.js` koordiniert weiterhin eine gemeinsame native
requestAnimationFrame-Schleife. Snake registriert dort nur seinen eigenen Callback.
Die vorhandene Windfarbfläche wird vom bisherigen Painter weiterverwendet; dessen
Symbole sind ausschließlich während der Snake-Auswahl deaktiviert. Beim Zurückschalten
wird dieselbe ursprüngliche Painter-Instanz mit ihren erhaltenen Optionen verwendet.

### Numerische Bewegung und Identität

Bewegung basiert ausschließlich auf dem bestehenden numerischen WR-U/V-Feld in m/s.
Der vorhandene Feldsampler, geografische Projektionen und NoData-Prüfungen werden
wiederverwendet. Es gibt keine neuen Wetterabfragen pro Frame und keinen Ersatz eines
fehlenden Felds durch interpolierte Punktmessungen. Fehlt das numerische Feld, bleibt
die Bedienung erreichbar und die fehlende Fähigkeit wird ausdrücklich angezeigt.

Ein Mittelpunktverfahren (RK2) wertet Richtung und Geschwindigkeit entlang jedes
Teilschritts aus. Ein Teilschritt ist auf etwa 1,25 Bildschirmpixel begrenzt; die
integrierte Frame-Zeit ist maximal 50 ms. Die visuelle Geschwindigkeit ist stetig
begrenzt: `96 × (1 − exp(−v/18)) × speed` px/s. Dies ist eine visuelle Skalierung,
keine maßstabsgetreue Lagrange-Luftpaketprognose. Es werden keine Wellen, künstlichen
Zentrumsbewegungen oder zusätzlichen meteorologischen Vektoren erzeugt.

Jedes Partikel behält eine ID und einen Ring von höchstens 128 geografischen
Positionen. Der Körper wird nach tatsächlicher projizierter **Wegstrecke** aus diesem
Verlauf rekonstruiert. Ein gebogenes Partikel wird somit nicht auf seine Kopf-Schwanz-
Distanz verkürzt. Bei Kartenbewegung wird derselbe geografische Verlauf neu projiziert.
World-Wrap erzeugt ausschließlich Darstellungskopien, keine zusätzlichen Datenabrufe.

Die Ziellänge wird bei jedem Integrationsschritt aus der aktuellen lokalen
Geschwindigkeit berechnet:

`Lziel = Lmin + (Lmax − Lmin) × (1 − exp(−v × lengthScale / 20))`

Für positive Geschwindigkeiten ist diese Funktion stetig, monoton und begrenzt.
Die tatsächliche Länge folgt mit `Lneu = Lziel + (Lalt − Lziel) × exp(−dt/response)`.
Die Zeitkonstante ist in Sekunden definiert und damit unabhängig von der Bildrate.
Das gleiche Partikel verlängert und verkürzt sich beim Durchlaufen eines Gradienten;
eine Geschwindigkeitsänderung löst keinen Respawn aus.

### Vollständige Silhouette

Eine geschlossene, geometrisch unterschiedlich breite Polygonbahn bildet Körper und
Schwanz. Der kleine abgerundete elliptische Kopf geht in den Körper über und enthält
keine Pfeilspitze. Die Breite verjüngt sich kontinuierlich bis null; lokale
Alpha-Verläufe laufen ebenfalls bis null aus. Die Breite wird zusätzlich relativ zur
Länge begrenzt, damit auch kurze Partikel ihre Kopf-Körper-Schwanz-Struktur behalten.
Es werden keine gewöhnlichen gleichdicken Canvas-Strokes verwendet.

Für eine vollständige erste Silhouette wird ein neuer Seed vor dem Einblenden
höchstens 100 Schritte entlang des tatsächlichen Felds numerisch vorwärtsgeführt.
Dieser begrenzte visuelle Vorlauf zeichnet ausschließlich geprüfte Feldbereiche nach.
Der sichtbare Start erfolgt weich über 0,75 s; das Lebensende über etwa 0,9 s bei
gestaffelten Lebensdauern von 10–20 s. Partikel werden bei normaler Bewegung nicht
periodisch gemeinsam zurückgesetzt. Ein neuer autoritativer Feld-Snapshot verwirft
alte Trajektorien, damit keine unterschiedlichen Datenzeiten verbunden werden.

### Grenzen und Ressourcen

NoData, nichtendliche Werte, Nullwind und nicht freigegebene Bereiche erhalten keine
erfundenen Strömungen. Teilpfade und die gesamte Silhouettenbreite werden konservativ
gegen Feldabdeckung und Masken geprüft. Ein Pfad vor einer ungültigen Grenze läuft
aus; ungültige Bereiche werden nicht überbrückt. WR-Freigabeablauf wird unverändert
übernommen, ohne eine zusätzliche GR-Datenaltersgrenze.

Der Pool ist auf maximal 420 Partikel begrenzt, bei kleiner Ansicht bzw. geringem
gemeldetem Gerätespeicher auf 180. Historien benötigen höchstens 840 KiB insgesamt
(420 × 128 × 16 Byte); zusätzliche Scratch-Puffer haben feste Größen. Die geometrische
Rekonstruktion verwendet höchstens 40 Knoten. Canvas-Backing ist auf vier Millionen
Pixel und DPR 2 begrenzt. Ein gemessener eigener Zeichenaufwand reduziert ausschließlich
die Snake-Dichte; die lokale Windstärke erhöht nicht die Partikelzahl.

Pause hält die vorhandenen Formen statisch und beendet den Frame-Callback. Eine
ausgeblendete Browserseite stoppt die Animation; Fortsetzen beginnt ohne Zeitsprung.
`prefers-reduced-motion` wird berücksichtigt. Die explizite Snake-Auswahl besitzt
einen eigenen Zustimmungswert `snakeAnimationExplicit`, damit die entsprechende
Präferenz der alten Animation nicht verändert wird. Entfernen/Deaktivieren löst
Callbacks, Ereignisbindungen und Canvas-Ressourcen.

## Einstellungen und Speicherung

Der neue einklappbare Premium-Bereich nutzt die vorhandenen Chevron-, Panel- und
Slider-Komponenten. Alle Werte liegen verschachtelt unter `snake` im bestehenden
Wind-Storage. Bisherige Geschwindigkeit, Dichte und Linienlänge anderer Modi bleiben
unberührt. Pause und Symbolfarbe bleiben die vorhandenen gemeinsamen Windoptionen.
Alle acht bestehenden Symbolfarben sind verfügbar; die Farbfläche bleibt unabhängig.

| Parameter | Standard | Zulässiger Bereich |
|---|---:|---:|
| Mindestlänge | 10 px | 8–24 px |
| Maximallänge | 76 px | 30–120 px |
| Längenskalierung | 1 | 0,25–3 |
| Kopfgröße | 1,5 | 1–2 |
| Körperbreite | 2,1 px | 1–5 px |
| Schwanzverjüngung | 1,3 | 0,6–2,5 |
| Deckkraft | 85 % | 10–100 % |
| Partikeldichte | 1 | 0,35–2 |
| Animationsgeschwindigkeit | 1 | 0,25–2,5 |
| Längenanpassung | 0,65 s | 0,15–3 s |

## Überprüfbare Vorschau und Referenzen

`docs/previews/snake-flow.html` verwendet denselben produktiven Renderer mit ausdrücklich
als synthetisch gekennzeichneten Entwicklungsfeldern. Drei Szenarien sind wählbar:
schwacher Wind, zunehmender/abnehmender Wind und ein rotierendes Feld mit
unterschiedlicher Winkelgeschwindigkeit. Ein mitlaufender ID-/Geschwindigkeits-/
Längenwert macht die Entwicklung desselben Partikels nachvollziehbar.

`node scripts/build-snake-preview.mjs <Ausgabepfad.html>` erstellt eine eigenständige
Offline-HTML-Datei ohne externen Server oder Wetterzugriff. Sie wird zusätzlich zu
den Installationspaketen als `gewitterradar-snake-preview-4.11.161.html` ausgeliefert.
Die synthetischen Felder befinden sich ausschließlich in der Vorschau bzw. den
Browser-Fixtures, niemals im produktiven Winddatenpfad.

Die fünf zuvor bereitgestellten MP4-Dateien 77189/77190/77191/77193/77194 waren lokal
weiter verfügbar. Zur visuellen Orientierung wurde die bereits vorhandene Folge
repräsentativer Einzelbilder aus 77190 erneut betrachtet. In diesem Auftrag wurde
keine neue vollständige Video- oder Bewegungsanalyse durchgeführt. Die Gestaltung
verwendet die Spezifikation und eine eigenständige Geometrie; keine fremden Assets,
Programmteile oder Videos werden übernommen oder veröffentlicht.

## Betroffene Dateien und Auslieferung

Neue Rendererdateien: `frontend/modules/weather/snake-{config,geometry,canvas}.js`.
Integration: `wind-data.js`, `wind-display.js`, `wind-legend.js`.
Neue Prüfungen: `tests/gr-snake-flow.test.mjs`, `scripts/test-gr-snake-flow-browser.cjs`,
`scripts/test-snake-preview.cjs`. Vorschau: `docs/previews/snake-flow.html` und
`scripts/build-snake-preview.mjs`; der bestehende Browser-Fixture akzeptiert nun einen
optionalen, rückwärtskompatiblen Testfeld-Dekorator.

Auslieferungs-/Versionsänderungen betreffen `frontend/version.js`, `module-manifest.js`,
Runtime-Manifest, Importkennungen, `frontend/assets.json`, Builder-Inventar,
`custom_components/gewitterradar/{manifest.json,build_info.py,dra-deployment-provenance.json}`,
die erzeugten HA-/Dashboard-Frontendkopien und `SHA256SUMS_FRONTEND.txt`.
README/Changelog und die vorhandene öffentliche Frontend-CI sind aktualisiert.
Die vollständige geänderte Dateiliste wird im DEV-Release bereitgestellt.

## Gezielte Prüfungen und Grenzen der Abnahme

Lokal erfolgreich: 46 Funktions-/Schutztests einschließlich acht Snake-Tests,
53 geschützte Assetidentitäten, exakte Frontendparität, Releaseidentität,
deterministischer Rebuild einschließlich negativer Integritätsproben sowie
HA-Staging mit 187 bytegleichen Dateien. Snake-Tests prüfen insbesondere monotone
Längenfunktion, bildratenunabhängige Glättung, Verlängern und Verkürzen derselben ID,
RK2-Rotation ohne Zentrumsdrift, Bogenlänge, tatsächliche verjüngte Füllgeometrie und NoData.

Fünf vollständige GR-Modulbaum-Ansichten (Desktop, Android hoch/quer, iPad, iPad Pro)
prüfen Moduswahl, zehn Einstellungen, Persistenz, sichtbare Bewegung, Identität,
Pause, Speichergrenzen, World-Wrap, fehlendes Feld und Rückkehr zum alten Painter.
Die eigenständige Offline-Vorschau wird in allen drei Szenarien mit sichtbaren
Partikeln, Pause und null externen HTTP-Anfragen geprüft.

Eine lokale Stichprobe nach fünf Sekunden Anlaufzeit ergab folgende Zeichenzeiten
(gleitendes Fenster von höchstens 120 Frames, Chrome-CPU-Emulation, keine Geräte-FPS):

| Ansicht | CPU-Drosselung | Partikel | Mittel | P95 |
|---|---:|---:|---:|---:|
| Desktop | 1× | 150 | 3,09 ms | 3,90 ms |
| Android hoch | 6× | 15 | 4,52 ms | 7,10 ms |
| Android quer | 2× | 44 | 2,58 ms | 3,50 ms |
| iPad hoch | 2× | 66 | 3,98 ms | 5,20 ms |
| iPad Pro quer | 2× | 68 | 5,38 ms | 7,80 ms |

Dies sind variable synthetische Browsermessungen, keine garantierten Bildraten.
Besonders unter Last kann die adaptive Dichte sichtbar geringer sein. Startkosten
werden durch begrenzten progressiven Partikelaufbau verteilt. Die Vorschau bestätigt
das Renderverhalten; ein tatsächlicher Wirbelsturm wird nur angezeigt, wenn das
gelieferte WR-Feld ihn räumlich auflöst.

Öffentliche CI-Nachweise, vollständige Commit-IDs und endgültige Paketprüfsummen
werden nach erfolgreichem Lauf unten ergänzt. Physische Android-/iPad-/HA-Abnahme
und Installation bleiben ausdrücklich offen. Keine automatische Installation,
keine Änderungen an WR, `main` oder PROD VM101, keine privaten Actions und keine
Wiederholung von TEST69.
