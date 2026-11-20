# Stabile Positionen für ungruppierte WeatherRouter-Icons

**13.11.2026 · GewitterRadar 4.11.195 DEV · HA-Integration 0.25.102**

Runtime `411195r1` · Modulset `E411-195A1` · 36 registrierte Module

- GR-Ausgangsstand: [`e994212c` · 4.11.194 DEV](https://github.com/TheDaimos/gewitterradar/commit/e994212c1becf0f60d9b559e61eb7e8f057bee89)
- Korrektur, Browserregression und Paketquelle: [`cd8b2689`](https://github.com/TheDaimos/gewitterradar/commit/cd8b26895ad40e5154e2a242e0437d4fba45eadd)
- WeatherRouter-DEV-HEAD beim Abgleich: `71b9c9ec4e9cf889220fb52f79869dba91095e87`

## Fehlerursache

In `78109.mp4` ist bei etwa 1,25 s ein abrupter Sprung der linken Kartenicons bei ruhender Karte zu sehen. In `78110.mp4` ist bei etwa 0,5 s ein kürzerer Sprung zu sehen. Die Videos zeigen den sichtbaren Effekt. Die folgenden Positionsmessungen stammen aus dem registrierten GR-Frontend mit Leaflet und emuliertem Android-Hochformat.

Alle vier Einzelicons sind absolut positionierte Kinder von `#map-card`. Sie verwenden denselben Pointer-/Touch-Handler, denselben Bezug zur Karte und das Eye-Layout. Die Bildtransformation zentriert jeweils die Grafik innerhalb des Buttons. Die gemessenen Sprünge entstanden durch Schreibzugriffe auf `left` und `top` des Buttons.

Wind berechnete eine eigene Position mit einer festen 50-px-Geometrie. Temperatur und Niederschlag riefen denselben Wind-Pfad über jeweils eine Fassade auf. Bei gespeicherten Positionen verwendete dieser Pfad den Layoutschlüssel aus Zeigertyp, Größenklasse, Seitenverhältnis der Karte und Kartenmodus. Bei automatischen Positionen berücksichtigte er die aktuellen DOM-Rechtecke der anderen Buttons als Hindernisse. Mount-Aufrufe aus der UI-Synchronisierung, Viewport-Resize und die verzögerten Kartenmodus-Callbacks konnten damit zwischen zwei Eye-Synchronisierungen neue Koordinaten schreiben.

Eye schrieb seinerseits die zwischengespeicherten Koordinaten zurück. Eye rechnete mit der tatsächlich gewählten Icon-Größe und konnte bei abweichender Icon-Größe zusätzlich auf einen freien Rasterplatz ausweichen. Seine gespeicherten Ergebnisse waren an die vorherige Layoutberechnung gebunden. Im engen Layout lagen die beiden Ergebnisse besonders weit auseinander, sobald ein Hindernis den nächstgelegenen Platz belegte.

Das Transparenz-Icon teilte Eye-Layout, Gruppierung und Gestenbindung. Sein zweiter Pfad richtete es an Eye oder an seiner gespeicherten Position aus und maß dabei bereits die tatsächliche Buttongröße. Es nahm am Suchlauf der anderen drei Icons nicht teil. Im reproduzierten Vollbildfall mit gespeicherten Positionen blieb es bei `(70,60 / 600,26)` CSS-Pixeln. In einem anderen Testfall mit automatischer Eye-Verankerung ließ sich bei einem Kartenmoduswechsel auch für das Transparenz-Icon ein Konflikt zwischen der alten verankerten Position und dem Eye-Cache auslösen.

### Messung bei identischer Kartengeometrie

Chromium, Touch-Viewport 393 × 851, Vollbild, Icon-Größe 140 %, gespeicherte Positionen. Koordinaten in CSS-Pixeln relativ zu `#map-card`.

| Icon | Eye | Einzelpfad | Nach erneuter Eye-Synchronisierung |
| --- | --- | --- | --- |
| Wind | 70,60 / 183,61 | 74,60 / 188,61 | 70,60 / 183,61 |
| Temperatur | 146,35 / 322,49 | 155,35 / 331,49 | 146,35 / 322,49 |
| Niederschlag | 242,00 / 320,00 | 236,10 / 474,37 | 242,00 / 320,00 |
| Transparenz | 70,60 / 600,26 | 70,60 / 600,26 | 70,60 / 600,26 |

Über vier Zyklen mit Kartenbewegung, Wetter-UI-, Viewport- und Layer-Menü-Aktualisierung beobachtete der Test im alten Vollbild-Frontend 28, 28, 40 und 0 Style-Mutationen in dieser Reihenfolge. Der neue Pfad hatte bei wiederholten Aktualisierungen und konstanter Geometrie **0 Positions- oder Style-Mutationen für jedes der vier Icons** in Standard, Groß und Vollbild. Die Messung lief ohne aktive Icon-Geste.

## Korrektur

- `weather/eye-hub.js` berechnet Positionen für alle sichtbaren, zugewiesenen Einzelicons in Kartenkoordinaten. Der automatische Suchlauf verwendet feste Hindernisse und die in diesem Durchlauf geplanten Positionen. Damit hängt seine Entscheidung nicht von früheren DOM-Positionen benachbarter Wettericons ab.
- `weather/display-menu.js`, `weather/wind-display.js`, `weather/temperature-display.js`, `weather/precipitation-control.js` und `fullscreen/map-display.js` verwenden denselben Positionspfad. Während einer aktiven Geste gehört die Position dem vorhandenen Drag-Handler. Die normierten Speicherwerte und Schlüssel bleiben kompatibel. Automatisch platzierte Icons können beim ersten Layout eine andere Startposition erhalten.
- Layoutwechsel berücksichtigen Kartengeometrie, Sichtbarkeit, Gruppierung, Icon-Größe und gespeicherte Positionen. Für Transparenz bleibt die Eye-Verankerung erhalten. Unveränderte CSS-Werte werden übersprungen. Die vorhandenen Observer und Resize-Listener werden weiterverwendet.
- `version.js`, `gewitterradar.js`, `panel.js`, Modul- und Runtime-Manifeste, Assetinventar und Frontend-Prüfsummen wurden synchronisiert. HA-Manifest, DRA-Buildkennung, Sidebar-URL und DRA-Provenienz melden denselben Stand. Settings Vault und Raster-Labor importieren die neue Release-Identität. `core.update-watch.js` ist bytegleich zum Ausgangsstand.

## Ausgeführte Prüfungen

| Prüfung | Ergebnis |
| --- | --- |
| `scripts/test-weather-control-position-browser.cjs` | GR-Karte mit Chromium und Leaflet. Standard, Groß, Vollbild, Regionswechsel und Zoom, unveränderte Geometrie bei wiederholten Aktualisierungen, Icon-Größe 140 %, Short-Tap, Long-Press und Drag aller vier Icons, Gruppierung und Entgruppierung, Rotation und Neuladen, stabile Observer-/Listener-Referenzen sowie Kompakt, Minimieren und Schließen der Kartendiagnose im Standardmodus bestanden. |
| `scripts/test-map-gesture-recovery-browser.cjs` | 11 unterbrochene Touchsequenzen, Leaflet-Pointeradapter, Eye-Hit-Testing sowie aktive synthetische Wind-, Temperatur- und Niederschlagslayer bestanden. |
| `scripts/test-settings-vault-browser.cjs` | Lokale Wiederherstellung, V181-Migration, HA-/WS-Wiederanlauf, idempotente Wiederholung und unabhängige Geräteprofile bestanden. |
| Node-Tests für DWD, OPERA, NASA, Wind, Vault und Runtime | 32 Prüfungen im fokussierten Lauf bestanden. Zusätzliche Einzelprüfungen für Temperaturkonvertierung, Zeit-/Coverage-Vertrag, Cache, Original-PNG und Sichtbarkeit bestanden. |
| Kanonischer Frontend-Build und Deploy-Relay-Vertrag | 36 Modulversionen, 179 kanonische Frontend-Dateien, deterministischer Build, Prüfdateien, Hi-Res-Schutz und DRA-Rollback-Vertrag bestanden. |
| Ältere Snapshot- und Niederschlagstests | Fünf fehlgeschlagene ältere Assertions und der Desktop-Timeout im alten Niederschlags-Browsertest wurden auch im unveränderten GR-4.11.194-Checkout reproduziert. Die aktuellen Positionstests prüfen die entsprechenden Icon-Aktionen direkt. |

Die öffentliche CI meldete für den ersten Push die bereits im Ausgangsstand beobachteten Fehler im Raster-Labor-Snapshot und im geschützten Niederschlags-Snapshot des Vault-Workflows. Der Icon-Browsertest läuft als eigener Job, damit sein Ergebnis unabhängig von diesen historischen Prüfungen sichtbar ist. [Frontend-CI](https://github.com/TheDaimos/gewitterradar/actions/runs/43429833799) · [Vault-CI](https://github.com/TheDaimos/gewitterradar/actions/runs/43429833999)

Die Änderung betrifft die Karten-UI und die Auslieferungsidentität. Hi-Res-Icon-Grafiken, Wetterrenderer, WR-Consumer, DWD-/OPERA-/NASA-Kachelpfade, Eye-Bubble-Grafik, Premium-Menüanimation und Kartendiagnose-Implementierung sind im Quellvergleich bytegleich. Im GR-Ausgangsstand existiert kein aktiver Synoptik-Renderer für einen End-to-End-Test. Die WeatherRouter-Provider wurden mit synthetischen Datenpfaden geprüft.

## DEV-Installation und offene Abnahme

Der vorhandene DRA-DEV-Kanal verwendet `TheDaimos/gewitterradar@deploy/dev`, ersetzt `custom_components/gewitterradar` und startet Home Assistant neu. Die ZIP-Pakete stammen aus dem Commit `cd8b2689`. Der Berichtsnachtrag ändert keinen Installationsinhalt. ZIP-Inhalt, Python-Syntax, Manifest, Runtime-Identität, 192 gemeinsame Frontend-Dateien und SHA-256 wurden beim Paketbau geprüft.

| Paket | SHA-256 |
| --- | --- |
| `gewitterradar-0.25.102-dev.zip` | `127fe1cefef763aa95878c57e9dce65b6027e69a66b74eec5cd44f0224c81445` |
| `gewitterradar-dashboard-4.11.195-dev.zip` | `3b59b823414af34553796b9ce5742995db5f599c25b7bc83bcb78296270deac0` |

**Reale Abnahme offen.** In dieser Sitzung gab es keinen Zugriff auf HA DEV VM109 oder ein verbundenes Android-Gerät. Installation, reale Android-/Companion-Prüfung, WebKit/iPad und Inkognito-Abgleich des installierten Runtime-Manifests stehen aus. Nach der DRA-Installation sind `411195r1`, `E411-195A1` und 36/36 Module auf VM109 zu prüfen. Der nächste Gerätetest umfasst die vier getrennten Icons in allen drei Kartenmodi bei ruhender und bewegter Karte. WeatherRouter und PROD VM101 wurden nicht geändert.
