# GR DEV – UI-Finalisierung und lokales PRO-Branding

Ausgangsstand ist `deploy/dev` bei `253dafabf44e5412fe59d8270b12ef113acfbce0` (GR 4.11.210, HA 0.25.117). Der lesend geprüfte WeatherRouter-DEV-Stand ist `a3d1d4dd8c30f6673efd395c6c085a6662dd6d23`. Die Betreiberreferenz GR 4.11.195 / WR 0.10.320 bleibt gültig.

Der Änderungsumfang betrifft Synoptik-Farbauswahl, Wetter-Deckkraftregler, den Wertebereich der Wind-Schlangen-Deckkraft und die Wortmarke der Übersicht. Gemeinsame Berührungspunkte sind der Card-Lebenszyklus, die Wetterdarstellung und die Validierung der Windprofile im Settings Vault. Provider, Kartenquellen, Slot-Zuordnungen, Menünavigation, Drag-and-drop, Standortwahl und die Wetter-Datenverarbeitung sind keine Änderungsziele. Der serverseitige WeatherRouter-Discovery-Vertrag ist lesend und frei von Provider-Netzwerkzugriffen.

Der Minimieren-Button wurde bereits in GR 4.11.210 angeglichen. Die acht Synoptik-Farbfelder teilen denselben Dialog. Im Auftrag sind die Dateien 78481 und 78482 vorhanden. Die ergänzenden Aufnahmen 78453 bis 78462 stehen für den direkten Vergleich nicht zur Verfügung.

## Auslieferung

GR **4.11.211 DEV**, HA **0.25.118**, Runtime **411211r1**, Modulset **E411-211A1**. Der DEV-Branch liefert die kanonische Quelle `frontend/`, die Byte-Spiegel `custom_components/gewitterradar/frontend/` und `dashboard/dist/`, die HA-Version und die DRA-Provenienz in einem Installationsstand. Der Versionsbadge bezieht seinen Inhalt aus derselben Release-Identität.

## Deckkraft und gespeicherte Werte

| Einstellung | Bestehende Speicherung und Wirkung |
| --- | --- |
| Niederschlag, Wolken, Wind-Symbole | `weather-display:v1.opacities` hält Alpha 0–1. Der Regler zeigt Alpha × 100. Ein leerer Override nutzt weiter den vorhandenen Standard. |
| Windfarbfläche und Temperaturfarbfläche | `fieldOpacity` bzw. `opacity` speichern Prozentwerte. Der Renderer verwendet den Wert als Deckkraft. |
| Temperaturpfeile und Wind-Schlangen | `arrowOpacity` bzw. `snake.opacity` sind Prozentwerte. Die bestehende animierte Ein-/Ausblendung multipliziert die Deckkraft. Der erlaubte Schlangenbereich umfasst jetzt 0–100 %, auch im Studio, im Import und im Vault. |
| Synoptik, H/T, Isobaren und Fronten | Alpha 0–1 mit Multiplikation von Gesamt- und Teildeckkraft. Das Einstellungsmenü zeigt jetzt 0–100 % genau wie die Regler im Darstellungsmenü. |
| Legenden | Die Sichtbarkeit wird über die bestehenden Schalter und Modi gesteuert. Für die Wetterlegenden existiert kein eigener Deckkraftregler. |

Die historischen gespeicherten Werte sind Deckkraft. Das Release benötigt keine Inversion oder Umkodierung und schreibt beim Lesen keinen Migrationsstand. Gültige Profile und Presets behalten ihre Alpha-Werte bei erneutem Laden oder Gerätewechsel.

## Lokale PRO-Erkennung

Die Übersicht sendet `weather_router/consumer/discovery` über die bereits authentifizierte WebSocket-Verbindung des Home Assistant, in dem diese GR-Instanz läuft. Der geprüfte WR-Handler ermittelt aus dem lokalen WR-Konfigurationseintrag und dessen `runtime_data` die Betriebsbereitschaft und validiert den Consumer-Vertrag. Die positive Antwort muss Schema `weather_router.consumer.discovery.v1`, Vertrag `weather_router.consumer` mit Version 1 sowie `router.ready === true`, `router.enabled === true` und `router.status === "ready"` enthalten. Die Übersicht prüft keine URLs oder Provider-Ergebnisse. Der Pfad setzt keine WR-Codeänderung oder zusätzliche Schnittstelle voraus.

Beim Laden und bei einem Verbindungswechsel erscheint die normale Wortmarke, bis der Status positiv und das Logo dekodiert ist. Eine erfolgreiche Prüfung gilt für dieselbe Verbindung bis zur nächsten negativen Antwort, zum Verbindungsabbruch oder bis zum Timeout einer Folgeprüfung. Folgeprüfungen beginnen 60 Sekunden nach Abschluss und haben 8 Sekunden Frist. Pro Verbindung läuft höchstens eine ausstehende Prüfung. Verspätete Antworten können eine bereits abgelaufene Prüfung nicht freischalten. Der Code speichert keinen PRO-Status im Browser.

## Grafik und Umfang

- [Original 78482](../artwork/gewitterradar-pro/78482-original.jpg) mit den unveränderten Bytes aus dem Anhang. Die dortige Dateiendung `.png` verdeckte eine JPEG-Kodierung mit 1280 × 427 Pixeln. SHA-256 `c11cab74d48d5b0c4da2ddb26a631e0fc90048f669cc6cf3ec8000836e6355bf`.
- [Produktive Wortmarke](../frontend/assets/gewitterradar-pro-wordmark-v1.png) als verlustfreier RGBA-Ausschnitt mit 1190 × 348 Pixeln. Das Bild bleibt eine einzige Bildebene. Schriftkonturen, Silber-/Goldreflexe und gedrehter Stempel stammen aus dem Original. Die Maske schätzt aus umgebenden dunklen Pixeln den lokalen Hintergrund. Sie trennt den blauen, neutralen und goldenen Vordergrund nach Farbkontrast, hält dunkle Details innerhalb farbiger Konturen und rechnet die Hintergrundfarbe aus teiltransparenten Kanten heraus. Der Ausschnitt enthält die Originalkoordinaten x=60–1249 und y=22–369. Das Produktionsasset hat SHA-256 `a714d572d0ad00aa81240bcc22f7043f54d2897aec59860181be17909c83713e`. Die Alpha-Kante ist aus dem flach gelieferten JPEG geschätzt.
- Die fachlichen Änderungen liegen in `frontend/modules/weather/{synoptic-display,display-menu,display-quick,precipitation-layer,snake-config,wind-studio}.js`, in `frontend/modules/ui/{skeleton,scroll-guard}.js`, `frontend/modules/core/card-lifecycle.js` und `custom_components/gewitterradar/vault_schema.py`. Weitere Frontend-Änderungen synchronisieren Cache-Referenzen, Modulidentitäten und Paketspiegel. Die Offline-Windvorschau bezieht die aktuelle Reglerdefinition.

## Ausgeführte Prüfung

- Chromium mit dem produktiven Card- und Leaflet-Code sowie synthetischem HA-/WR-Transport. [Synoptik-Test](../scripts/test-synoptic-browser.cjs) prüft alle acht Farbfelder mit Maus und emuliertem Touch, Originalasset, runden 44-Pixel-Touchbereich, Minimieren/Maximieren, Drag, Scrollen und Profilwerte nach Reload. Synoptik-Regler und Niederschlags-, Wolken-, Wind- und Temperatur-Schnellregler wurden auf 0/25/50/75/100 % gesetzt. Der Test prüft gerenderte Synoptik-Deckkraft beziehungsweise die zugehörigen effektiven Werte für die Schnellregler.
- Der [PRO-Browsertest](../scripts/test-gr-pro-branding-browser.cjs) nutzt eine simulierte HA-Anmeldung mit Settings-Vault-Profil. Er deckt passenden lokalen Status, fehlenden oder unbekannten Vertrag, Laden, deaktivierten Router, Fehler, Timeout und verspätete Antwort, Verbindungsabbruch, Reconnect, Reload mit vorhandenem Bild und Bildfehler ab. Desktop 1177 px und emuliertes Hochformat 320/360/393/412 px wurden mit eingeblendeter Standortwahl und Versionsbadge geprüft. Das PNG wurde auf dunkler und heller Fläche und in beiden Header-Aufnahmen visuell mit 78482 verglichen.
- 47 Node-Tests zu Synoptik, Wind-Studio, Vault und Niederschlag (einschließlich OPERA-/NASA-/DWD-Pfaden), fünf Python-Tests zum Vault-Schema sowie das Eye-Modell bestanden. Ein zusätzlicher historischer Komplettvergleich in `tests/gr-wind-ui-03.test.mjs` weicht bereits beim Consumer-Quellstand des Ausgangscommits von seiner alten Referenz ab. Dieser Branch-Diff ändert `consumer-client.js` nicht.
- Deterministischer Frontend-Neubau, Integritäts-Manipulationsproben, 37 Modulidentitäten, 182 Frontend-Dateien, beide Spiegel und der Deploy-Relay-Vertrag wurden geprüft. Dazu gehört die Korrektur des beim Ausgangsstand in der öffentlichen CI gemeldeten inkonsistenten `displayVersion`-Felds.

Offen sind die Installation und reale Betreiberabnahme auf HA DEV VM109, der Test mit einem physischen Android-Gerät und der direkte Bildvergleich der fehlenden Referenzen 78453–78462.
