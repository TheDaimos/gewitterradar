# GR-WIND-QUICKTOGGLE-01 · Originalgrafiken und gemeinsamer Windschalter

Stand 2026-11-07. **GR 4.11.153 DEV / HA 0.25.60**, Runtime `411153r1`,
Modulsatz `E411-153A1`, weiterhin 35 registrierte Module.
**WeatherRouter 0.10.297 DEV / Loader 300 bleibt unverändert.**
Nur `TheDaimos/gewitterradar@deploy/dev`; kein `main`, keine automatische
Installation auf DEV VM109 und kein Zugriff auf PROD VM101.

## Ausgangsbasis und geschützte Referenz

Die vom Nutzer auf echtem Android als deutlich flüssiger bestätigte Winddarstellung
GR152/HA59 bleibt geschützt. Ausgangsrelease `787497648a405bc27495d98ffdedd9206668fd4c`.
Vor der Implementierung wurden die beiden danach bereitgestellten Premium-UI-Commits
`c2eec17c3f89580eb550347b3a25d3b60b9901d9` und
`4ce8e1e7679599918c702136605760342c863721` geprüft und per Fast-Forward übernommen.
Die kompakte Windkachel mit separaten Einstellungen-/Aktivierungsaktionen bleibt
erhalten; ihre vorläufigen SVGs werden durch die freigegebenen Originalmotive ersetzt.
Die SVG-Master bleiben dauerhaft vorhanden und im Retentionsvertrag registriert.

## Drei freigegebene Originalgrafiken

Keine Neugenerierung, Nachzeichnung, Beschneidung, Farb- oder Proportionsänderung.
Alle PNG-Master sind **byteidentische Kopien** der drei übergebenen Dateien:

| Rolle | Original | Master unter `artwork/help-icons/hires/` | Native Größe |
|---|---|---|---|
| Karte, global Ein/Aus | `04_Animierte_Pfeile_Premium_Transparent.png` | `gr-wind-animation-toggle-original-master.png` | 1254×1254 RGBA |
| Wind-Einstellungen | `02_Einstellungen_Premium_Transparent.png` | `gr-wind-settings-original-master.png` | 1024×1024 RGBA |
| Windkachel, Ein/Aus | `01_Windfahne_Premium_Transparent.png` | `gr-wind-barb-original-master.png` | 1024×1024 RGBA |

Die im ersten Auftrag `77131.png` genannte Rolle entspricht dem tatsächlich
übergebenen Original `04_Animierte_Pfeile_Premium_Transparent.png`. Der Nachtrag
legt ausdrücklich diese drei fertigen Grafiken fest.

Original-SHA256 in obiger Reihenfolge:

```
4d664316ba1ef49d60330cbcff23de84e4ca03ee558deb891401ca10da0f0a26
e6ff489587c5ce3770e036997824b417868c523bdf1ee526ad9c55754d5a76d9
46030087a5490b60d56655f0faf0ac3fd6b548242877f08ffcc3c25a80ac1bbc
```

Maschinenlesbare Herkunft, Dimensionen, SHA256 und Ableitungen:
`artwork/help-icons/gr-wind-originals-ASSET_MANIFEST.json`. Alle drei Originale und
die zwei bereits vorhandenen SVG-Master sind im Hi-Res-Retentionsvertrag geschützt.

Laufzeitbilder: verlustfreie WebP-Ableitungen mit 136/272 px, LANCZOS-Verkleinerung,
Alpha und Seitenverhältnis erhalten. Pfade `frontend/assets/gr-wind-*-premium-*.webp`,
registriert mit SHA256 in `frontend/assets.json`. Karte verwendet Animation v1,
Kachel die Originalfamilie Barb/Settings v2. Die beiden alten SVG-Laufzeitdateien
bleiben inaktiv (`referenced:false`); keine UI-URL verweist mehr auf sie.
Goldringe, Kompassdetails und Reflexionen bleiben im Originalmotiv enthalten.
Master werden nicht durch kleine Ableitungen ersetzt. Das zusätzliche Releaseasset
`gewitterradar-wind-originals-4.11.153.zip` enthält die drei vollständigen PNG-Master
und ihren Herkunftsvertrag; die Installationspakete nutzen die performanten WebPs.

## Kartenposition und gemeinsame Verschiebelogik

Der direkte Windschalter ist 48×48 CSS-Pixel groß, transparent und ohne zusätzlichen
Buttonrahmen. Beide Kachelsymbole sind 34×34 px in mindestens 44×44-px-Touchzielen.
Die Windkachel belegt eine Zeile, damit Text und beide Touchflächen auch schmal passen.

Standardposition oben links innerhalb der Karte, zehn Pixel Rand. Die Platzierung
prüft sichtbare vorhandene Knöpfe, Leaflet-Bedienung, Standort, Warnungen und Legenden
und sucht eine freie Position im linken oberen Kartenbereich. Ein zusätzlicher
Abschlussaufruf im vorhandenen Karten-Resizeablauf verhindert, dass nachträglich
positionierte Instrumentknöpfe den Schalter überdecken. Keine Änderung ihrer Positionen.

Der bestehende `_weatherDisplayBindEyeDrag` wird über optionale Zustands-/Speicher-
Callbacks wiederverwendet. Kein zweites Drag-System. Pointer-Capture, vier Pixel
Bewegungsschwelle, Kartenbegrenzung, Abbruch bei Pointercancel/Blur/Pagehide und
450-ms-Klickunterdrückung nach Ziehen. Ein Tap schaltet, Ziehen speichert nur die
Position. Tastatur: native Buttonaktivierung mit Leertaste/Enter und sichtbarer Fokus.

Normierte Positionen unter `quickPositions`, getrennt nach Eingabe-/Geräteklasse,
Kartenformat und Darstellungsmodus. Rückkehr ins gleiche Format stellt die Position
wieder her; andere Formate erhalten eigene Positionen innerhalb ihrer Kartengrenzen.
Andere gespeicherte UI-Positionen werden nicht verändert.

## Ein globaler Sichtbarkeitszustand, unveränderte Präferenzen

Der bestehende Storage-Schlüssel `gewitterradar:wind-ui:v1` bleibt erhalten,
Payload-Schema steigt auf **2**. Neues `visible` ist der globale Sichtbarkeitsschalter.
`enabled` bleibt die gewünschte Symbolaktivierung, `colorField` die gewünschte
Farbflächenaktivierung. `paused` bleibt unabhängig. Ein/Aus verändert ausschließlich
`visible`; Modus, Farbe, Druckfarbmodus, Tempo, Dichte, Einheit, Deckkraft, Farbfläche
und Pause bleiben gespeichert.

Für den bestehenden Canvas wird eine flüchtige, sichtbarkeitsabhängige Konfiguration
abgeleitet: bei AUS beide Features effektiv aus, ohne die gespeicherten Flags zu
ändern. Bei EIN gelten unverändert die gewählten Featureflags. Pausierte Strömung
bleibt pausiert, eine gewählte Farbfläche erscheint trotzdem. Symbolfreie Farbflächen
bleiben möglich. Sind bewusst beide Features abgewählt, wird dies verständlich als
`Keine Windsymbole oder Farbfläche ausgewählt` angezeigt.

Migration von Schema 1: Ein bisher aktives Symbol-/Farbflächenpaar bleibt aktiv;
reine Farbflächen bleiben symbolfrei. Ein bislang vollständig gestoppter Zustand
bleibt global AUS und bekommt für den ersten neuen Schnellstart vorbereitete
Symbole im bisherigen Modus. Alle anderen Präferenzen bleiben erhalten.
Neue Installationen starten global AUS mit vorbereiteten klassischen Windfahnen.

Kartenicon, Windfahne der WR-Schnellkachel und neuer Ein/Aus-Schalter im bestehenden
Wind-Einstellungsmenü verwenden genau denselben Zustand. Das Zahnrad öffnet denselben
vorhandenen Einstellungsbereich wie Eye-Menü und weitere Wind-Einstellungszugänge.
Kein zweites Fenster, keine zweite Speicherverwaltung oder Windinstanz. Die vorhandene
separate WR-Rasterressource `Wind (Raster)` und deren Transportvertrag bleiben
eigenständig; die neue Windkachel-Aktivierungsaktion steuert die konfigurierte
numerische Winddarstellung samt ihrer Farbfläche.

Das Kartenicon bleibt immer erreichbar, auch ohne WR-Daten. `aria-pressed` kennzeichnet
den Benutzerwunsch, nicht eine behauptete Datenverfügbarkeit. AUS zeigt dasselbe Motiv
dezent abgedunkelt, EIN das unveränderte Motiv mit dezentem Leuchtakzent. Keine neue
Buttonanimation. Tooltip, `aria-label` und vorhandene Statusanzeige bleiben aussagekräftig.

## Puffer, Pause und Lebenszyklus

Global AUS stoppt den vorhandenen Scheduler, laufende Farbvorbereitung und erneute
Abrufplanung. Canvas wird geleert und verborgen; Painter, Partikelpool, vorbereitete
Farbfläche, gültiges Feld und begrenzter L2-Puffer bleiben erhalten. Kartenbewegung
verursacht während AUS keine Animations-/Zeichenarbeit oder neuen Windabrufe.
Keine zweite Animationsschleife. Beim Aktivieren wird derselbe Painter weiterverwendet,
ein passender gültiger 130-%-Cachetreffer benötigt keinen erneuten WR-Abruf.

Ein bereits laufender authentifizierter Abruf darf noch in den vorhandenen Cache
zurückkehren. Veraltete Anzeige-Generationen werden weiterhin verworfen. Beim schnellen
AUS/EIN während eines solchen Abrufs erfolgt danach eine erneute Cacheprüfung statt
eines doppelten identischen Abrufs. Timeout, Fehler-/Wiederholungslogik und WR-Freigaben
bleiben verbindlich. Keine Verlängerung von `valid_until` oder Aktualisierungsberatung.
Bei fehlenden Winddaten bleibt der Wunsch EIN erhalten; vorhandene Status-/Fehlerlogik
zeigt die Lage an. Keine erfundenen Felder. Seitenunsichtbarkeit, Kartenwechsel und
Teardown verwenden die vorhandenen Lebenszyklen.

`wind-canvas.js` und `wind-field.js` unterscheiden sich gegenüber GR152 ausschließlich
durch Import-Cachekennungen. Partikelbewegung/-dichte, U/V-/Richtungsinterpolation,
Geschwindigkeiten, Palette, Farbflächenberechnung und L2 bleiben bytegleich erhalten.
Keine Änderung an DWD/OPERA/NASA, Mosaik, Masken, V2-Rastertransport, Zeitpolitik,
Niederschlagslegenden oder Seamless Tile Handover. Keine TEST69-Wiederholung.

## Gezielte Prüfung und betroffene Dateien

- **41 Unit-/Vertragsprüfungen bestanden:** fünf neue Fälle für Migration, Präferenzen,
  Positionsspeicherung, Original-/Runtimeidentität und geschützten Renderer; dazu die
  36 bestehenden Wind-/Legenden-/Rastervertragsprüfungen.
- **Fünf vollständige Browseransichten bestanden:** Desktop, Android Hoch/Quer,
  iPad Hoch/Quer, jeweils mit dem tatsächlichen 35-Modul-GR-Baum und synthetischer WR-I/O.
  Neue Originalbilder werden dekodiert; alle drei Modi, Symbolfarben/Tempo/Dichte,
  Farbflächen-/Deckkraft-/Pausenerhalt, Menü-Synchronisierung, Cachewiederverwendung,
  Touch-/Mausdrag ohne Umschaltung, Tastatur, Reload und Formatwechsel geprüft.
  Zusätzlich laufender Abruf mit AUS/EIN und abgelaufene/unverfügbare Daten.
- Sichtbare Renderarbeit und Abrufe bleiben während AUS gestoppt. Der gleiche Painter
  und vorbereitete Bildpuffer werden bei EIN wiederverwendet. Keine neue FPS-Zusage.
- Frontend-/Runtime-/DRA-Identität, Assets und Lieferkopien geprüft;
  **170 bytegleiche Integrationsdateien im Staging**, davon **154 Frontenddateien**
  im HA-/Dashboard-Paketvergleich. Hi-Res-Retentionsprüfung nach Commit und in CI.

Quelle geändert: `wind-display.js`, `wind-data.js`, `wind-legend.js`,
`layer-menu.js`, optionaler Drag-Adapter in `display-menu.js`, ein Positionsabschluss-
Callback in `fullscreen/map-display.js`. Importkennungen in Wind-Helpern,
`gewitterradar.js`, `version.js`, `panel.js`, `module-manifest.js`, Runtime-/Assetmanifest.
Versionsmetadaten unter `custom_components/gewitterradar/`, DRA-Provenienz,
HA-Frontend und `dashboard/dist` synchronisiert. Neue Master/WebPs/Assetprovenienz,
Retentionsvertrag und Artwork-README. Build-/Identitätsprüfer aktualisiert;
gezielte Testdateien und öffentliche Workflow-Scope-Erweiterung. Vollständige
Pfadliste liegt im Releaseasset `changed-files.txt`.

## Bereitstellung und Abnahmegrenze

[GR 4.11.153 DEV](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.11.153-dev):
`gewitterradar-0.25.60-dev.zip`, `gewitterradar-dashboard-4.11.153-dev.zip`,
`gewitterradar-wind-originals-4.11.153.zip`, `SHA256SUMS.txt`, `deployment.json`,
`changed-files.txt`. Bestehender DRA-Kanal `deploy/dev`; WR297/Loader300 unverändert.
Paketidentität und Original-/Runtime-SHA256 werden vor Veröffentlichung abgeglichen.

Commits mit `skip ci`, anschließend ausschließlich gezielte öffentliche CI im
verifizierten öffentlichen GR-Repository. Keine privaten Actions. Reale Diagnose-
und Realtestexporte gehören ausschließlich nach `TheDaimos/Project-Log-And-Export@main`.
Die dokumentierten Prüfungen sind Browseremulation mit synthetischen Wetterdaten;
die physische Android-/iPad-/VM109-Realabnahme erfolgt erst durch den Nutzer nach
manueller Installation. CI-/Commitnachweis wird nach dem Lauf ergänzt; dieser
Bericht wird anschließend von GitHub zurückgelesen und per Blob abgeglichen.


## Verifizierter öffentlicher Entwicklungsabschluss

Implementierungscommit: `10950f765ba1ccde9487108f1cc07c1c1d613e2e`.
Erste Laufzeitimplementierung: `a84ea2784820d41d68b3c3d938746f67a36e2655`.
Der folgende reine Testcommit korrigiert die Eingabemodalität: Im ersten öffentlichen
[Lauf 42389584301](https://github.com/TheDaimos/gewitterradar/actions/runs/42389584301) wurde nach
Mausziehen nur programmatisch fokussiert, wodurch Chromium unter Linux noch keinen
Tastatur-Fokusrahmen verlangte. Der Test verwendet jetzt zuerst einen echten
Tab-Tastendruck und prüft weiterhin `:focus-visible`, Fokusrahmen und Space/Enter.
Keine Laufzeitänderung und keine abgeschwächte Prüfung der Tastaturbedienbarkeit.

Öffentliche CI [Run 42389929329](https://github.com/TheDaimos/gewitterradar/actions/runs/42389929329)
**erfolgreich**, exakt auf diesem Codecommit. `release-scope` und
`wind-quick01 / wind-quick-toggle` erfolgreich; allgemeine und historische
Testkampagnen übersprungen. Alle 41 Unit-/Vertragstests, Hi-Res-Retention,
Versions-/Asset-/Lieferidentität, vollständige Karte in fünf Viewports mit Touch/
Tastatur und HACS-Installationsstaging bestanden. Keine privaten Actions.

Dieser nachfolgende Commit ergänzt ausschließlich diesen Bericht. Der CI-geprüfte
Laufzeitcode bleibt unverändert. Auslieferungscommit und tatsächliche SHA256 stehen
im Release in `deployment.json` und `SHA256SUMS.txt`; `changed-files.txt` benennt
die tatsächlich geänderten Dateien. Vor Veröffentlichung wird dieser Bericht über
GitHub erneut gelesen und der Blob gegen den lokalen Commit geprüft. Die drei
Original-PNGs sind zusätzlich im Originalarchiv des Releases nachprüfbar enthalten.
Physische Android-/iPad-/VM109-Abnahme bleibt offen; keine automatische Installation.
