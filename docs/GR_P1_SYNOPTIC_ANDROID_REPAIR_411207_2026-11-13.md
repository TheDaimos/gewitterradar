# Synoptik auf der Karte und im Android-Touchmenü

**13.11.2026 · GR 4.11.207 DEV · HA 0.25.114 · Runtime `411207r1` · Modulset `E411-207A1`**

GR-Ausgangsstand `b7dde401dfa51e8ada78b36890427c63504c7920` auf `deploy/dev`. Implementierungs- und Paketcommit [`d52929bf43b9dec112b528595841ed1186c150bb`](https://github.com/TheDaimos/gewitterradar/commit/d52929bf43b9dec112b528595841ed1186c150bb). Gegenprüfung mit WR 0.10.322, Loader 325, DEV-Commit `a3d1d4dd8c30f6673efd395c6c085a6662dd6d23`. Das geschützte WR-/GR-Referenzpaar bleibt bei 0.10.320 / 4.11.195.

## Nachgewiesene Ursachen und Reparatur

- **Kartenstart.** `card-lifecycle.js` rief Synoptik vor der asynchronen Leaflet-Erzeugung auf. `_resumeWeatherSynoptic` kehrte ohne Karte zurück. Der spätere Kartenstart in `location/radii-map.js` setzte die Synoptik nicht fort. Die Karte übergibt jetzt nach ihrer Initialisierung das geladene Leaflet. Wiederanbindung prüft die Kartenidentität und räumt Handler, Timer und überholte Antworten auf.
- **WR-V2 und Vektoren.** Der aktuelle WR-Handler erwartet `resolve_synoptic`, Vertrag 2, `context:{bbox}`, `time:{mode:'latest'}` und optional `profile_id`. Der bestätigte WR-Vertrag erlaubt ungerollte Isobaren-Längengrade bis ±540°. Die frühere GR-Prüfung verwarf Werte außerhalb ±180°. GR verwendet jetzt einen kanonischen Request-BBOX und projiziert sichtbare Punkte und Linien in die aktive Leaflet-Weltkopie. H/T, Isobaren und Fronten werden unabhängig verarbeitet. Eine ausstehende Frontenantwort verzögert weder die Anzeige noch Folgeanfragen der anderen Teilfunktionen. Leere, abgelaufene und außerhalb des Kartenausschnitts liegende Geometrien liefern keine sichtbaren Layer. WR-`valid_until` bestimmt das Ablaufdatum.
- **Long-Press.** Der vorhandene Gestenhandler erreichte `_weatherSynopticOpen`. Beim Erzeugen des Menüinhalts fehlte der Import von `premiumAction`. Das eigene Synoptik-Panel nutzt jetzt die gemeinsamen Premium-Aktionen, Chevron-Abschnitte und Header-Drag. Touch-Drag am Panel-Header ist ausdrücklich für dieses Panel aktiviert. Die vorhandene Eye-Gestenbindung protokolliert die letzte Entscheidung für Synoptik, ohne Slot-Zuordnung oder Farbe zu schreiben.
- **Transparenz.** Die drei vorhandenen Regler standen nur im Einstellungsblock. Sie sind jetzt im zentralen Darstellungsmenü auf der Karte erreichbar und teilen die persistierten Werte des Synoptik-Panels. Das Produkt aus Gesamt- und Teildeckkraft wird jeweils einmal auf Marker, Linien und Isobarenbeschriftung angewandt. Farb- und Deckkraftänderungen verwenden bereits geladene Daten. Frontlinien- und Neonregler bleiben im Synoptik-Panel. Die vorbereitete Symboldeckkraft bleibt im Schema. WR 0.10.322 autorisiert keine Frontsymbolseite.
- **Diagnose.** Der vorhandene Export aus `diagnostics/map-diagnostics.js` enthält einen kompakten `synoptic`-Block. Er zeigt Modul-, Karten-, Leaflet-, Menü- und Gestenstatus sowie je Capability Anfragefortschritt, Ergebnis, WR-Code, Provider, Modellzeit, Gültigkeit, ganzgradig gerundeten BBOX und Feature-/Layeranzahlen. Angehängte Layer und effektive Sichtbarkeit sind getrennt. Rohantworten, URLs, Tokens und hochpräzise Standortkoordinaten fehlen im neuen Block. Ein Transportfehler bleibt sichtbar, auch wenn ein zuvor gültiger Layer weiter angezeigt wird.

## Betroffene Dateien und Schutz

Die Verhaltensänderungen liegen in `weather/synoptic-display.js`, `weather/display-menu.js`, `weather/eye-hub.js`, `weather/eye-hub-registry.js`, `weather/premium-ui.js`, `location/radii-map.js` und `diagnostics/map-diagnostics.js`. `vault_schema.py` registriert die Synoptik-Premium-Einstellungen für Position, Minimierung und Abschnitte. Der Eye-Slot-Validator und das Eye-Modell behalten ihre vorhandene Struktur.

Das Master-PNG und die Runtime-Kopien entsprechen dem vorhandenen Original. WR, Wind- und Temperaturmodule, Niederschlagsrenderer, DWD-/OPERA-/NASA-Kachelpfade und Runtime-Versionsschutz bleiben im Quellvergleich erhalten. Der Modulbestand umfasst 37 Module. Frontend-, HA-, Sidebar- und DRA-Kennungen sind synchronisiert.

## Ausgeführte Prüfungen

- `scripts/test-synoptic-browser.cjs` mit registrierter GR-Karte, Leaflet, Chromium-Toucheingabe und synthetischer WR-V2-Verbindung. Kaltstart, V2-Anfrage, H/T-Marker, Isobarenlinien und -beschriftung, wartendes und anschließend nicht verfügbares WPC, weiterer Kartenausschnitt, leere Geometrie, fehlender Schnitt, Transportfehler, Datumsgrenze, Ablauf und Wiederanbindung. Short-Tap, Long-Press und Einzelicon-Drag sowie Long-Press und Short-Tap im fünften Eye-Slot. Premium-Chevron, Minimieren, Schließen und Header-Drag. Beide Transparenzmenüs, 0–100 %, Neuladen und kein WR-Aufruf bei Stiländerung.
- `scripts/test-settings-vault-browser.cjs` mit Slot 5, den vier ursprünglichen Slots, Farbe, Aura, Neustart und Wiederherstellung in einem zweiten Browserkontext. Zusätzlich vier Python-Schema-/Merge-Fälle für Vault sowie sieben Node-Vault-Transaktionstests.
- Gezielt ausgeführt wurden außerdem die Synoptik-Vertrags-/Spiegeltests, OPERA-Autorität und NASA-Revocation, Eye-Modell, Premium-Pointer, Karten-Gesten-Recovery mit aktiven Wetterlayern, Positionsstabilität der vier bestehenden Icons, Radien-Guard, Modulidentität und deterministischer Frontend-Build.
- DRA-Vertrag, kanonischer Build, 194 identische Frontend-Dateien in den DEV-ZIPs, ZIP-CRC, HACS-Installationsinventar mit 212 Dateien und SHA-256 geprüft. [Öffentliche Spiegelprüfung](https://github.com/TheDaimos/gewitterradar/actions/runs/43474830254) · [Settings-Vault-CI](https://github.com/TheDaimos/gewitterradar/actions/runs/43474830578)

Der erste öffentliche Synoptik-Lauf bestand die Vertrags- und Vault-Schema-Prüfungen. Sein Browser-Setup scheiterte an der Kombination Playwright 1.56.1 und Ubuntu 26.04. Mit Ubuntu 24.04 bestand anschließend auch der Chromium-Touchlauf. Die Settings-Vault-CI einschließlich ihrer Paketprüfung war erfolgreich. Die allgemeinen Workflows melden weiterhin Fehler bei GR-WEICH-05 und der HACS-Integrationsvalidierung. Beide allgemeinen Workflows meldeten bereits am Ausgangscommit Fehler. [Synoptik-CI](https://github.com/TheDaimos/gewitterradar/actions/runs/43475176437) · [Settings-Vault-CI](https://github.com/TheDaimos/gewitterradar/actions/runs/43474830578) · [Allgemeines Frontend](https://github.com/TheDaimos/gewitterradar/actions/runs/43475172761) · [HA-Integration](https://github.com/TheDaimos/gewitterradar/actions/runs/43475179685)

## DEV-Pakete und reale Abnahme

| Paket | SHA-256 |
| --- | --- |
| `gewitterradar-0.25.114-dev.zip` | `cdab5bf953f839227d1614cfd53009af61fa43021f3e140494d5a064c7bf88fe` |
| `gewitterradar-dashboard-4.11.207-dev.zip` | `ee0f53f1fc067307191fed344310bfd7a13813cbb4d9c118761736bb0b74a9cf` |

Die Installation und reale Geräteabnahme auf **HA DEV VM109** stehen aus. Dort nach DRA-Installation und HA-Neustart die Moduldiagnose für 37/37 Module und `411207r1` prüfen. Auf Android die gespeicherte fünfte Eye-Funktion, beide Long-Press-Wege und die drei Transparenzregler prüfen. Im Kartendiagnose-Export für den tatsächlichen Kartenausschnitt H/T und Isobaren getrennt anhand der Provider-, Feature- und Layerfelder beurteilen. Die Sichtbarkeit von WPC-Fronten hängt von der tatsächlichen Abdeckung und Freigabe ab. PROD VM101 bleibt unverändert.
