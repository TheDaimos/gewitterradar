# GR-WL-CLOUD-01 – Raster-Labor für aktive Wolken- und Wind-Rasterebenen

**Datum:** 21.10.2026  
**Repository/Zweig:** `TheDaimos/gewitterradar@deploy/dev`  
**Eingangsstand:** V4.11.101 DEV, HEAD `91f4656dca05dc37f876e6fae2100d5b0d988f5f`  
**Entwicklungsstand:** **V4.11.102 DEV**, zentraler Build `V4.11.102-DEV-2026-10-21`, Runtime `411102r1`, Modulsatz `E411-102A1`, native Integration **unverändert** `0.25.18`.  
**Stand:** Gezielte Änderung in vorhandener Raster-Labor-Adapterarchitektur; authentische isolierte Chromium-Pixeltests erfolgreich; vollständige GitHub-Actions-Gesamtläufe siehe Schlussprotokoll.

## 1. Betreiberbefund und nachgewiesene Ursache

Der Betreiber hat bestätigt, dass das Raster-Labor für **eingeschalteten Niederschlag bereits funktioniert** und für ausgeschalteten Niederschlag erwartungsgemäß keine aktive Ebene bietet. Dieser produktive Pfad wurde nicht fachlich neu abgestimmt oder umgebaut.

Die Ursache für „Wolken · noch nicht verfügbar“ bei tatsächlich sichtbarer Wolkenkarte war im aktuellen Git-Code eindeutig: `frontend/modules/diagnostics/raster-lab.js` enthielt **Wolken lediglich als statischen Dropdown-Katalogeintrag**, während `_rasterLabAdapters()` nur den tatsächlichen Adapter für `precipitation` erzeugte. `_rasterLabRefreshOptions()` deaktivierte daher `clouds` mangels registriertem Adapter grundsätzlich, unabhängig davon, ob die produktive Wolkenebene bereits erfolgreich gezeichnet war.

Der tatsächlich aktive generische Rasterrenderer ist kein Niederschlagslayer. Er liegt im vorhandenen `frontend/modules/weather/layer-menu.js` unter `GENERIC_RASTERS`:

| Fachliche Ebene | Echte Consumer-Capability | Tatsächlicher Leaflet-Pane |
| --- | --- | --- |
| Wolken | `weather.satellite.clouds` | `gr-wr-clouds` |
| Wind 10 m | `weather.model.wind_10m.layer` | `gr-wr-wind` |
| Niederschlag (bestehend) | bestehender Niederschlag-Renderer | `gr-weather-radar` |

Die Wolken- und Windrenderer basieren auf `L.gridLayer` mit gezeichneten Canvas-Kacheln. Diese echten Rasterkacheln im jeweiligen Pane können mit den bereits bestehenden Raster-Labor-CSS-Filtern bearbeitet werden. **Nicht rasterbasierte Messwerte, Symbole, Windfahnen, Ereignisse und Vektorinformationen wurden nicht als Adapter fingiert.** WeatherRouter selbst wurde nicht verändert.

## 2. Implementierte Lösung – keine neue Rendererarchitektur

Die realen produktiven Module `weather.layer-menu` und `diagnostics.raster-lab` bleiben die einzigen zuständigen Module.

### Generische Rasteradapter

`weather.layer-menu` besitzt nun `_weatherGenericLabAdapter(id)`. Es registriert über den **bereits existierenden** öffentlichen Modulvertrag `_rasterLabRegisterAdapter()` ausschließlich die beiden fachlich vorhandenen generischen Rasterfähigkeiten. Der Adapter liefert:

- `getPane` für genau das laufende, aktivierte Layerobjekt und den korrekten Karten-Pane, **nur** bei `ready` oder `partial`.
- `getAvailability` als dynamischen Zustand `off`, `loading`, `no-data` oder `active`; nicht angebundene Katalogeinträge bleiben `unconnected`.
- `getNativeZoom` ausschließlich aus dem tatsächlich aktiven generischen Layerobjekt für die **Diagnose**, ohne die Niederschlags-Zoomformeln zu ändern.
- `getTuning` mit neutraler Raster-Ausgangsbasis (0 px Zusatzunschärfe, Kontrast/Sättigung/Helligkeit 1). Die vom Benutzer gewählten Laboreinstellungen sind **nur temporär**.
- `beforePreview` mit einer pro tatsächlichem Pane gehaltenen ursprünglichen CSS-Filter-/Deckkraftreferenz in `WeakMap`.
- `restore`, das **nur diesen Pane** auf den zuvor beobachteten Filter-/Deckkraftwert zurücksetzt und das temporäre Vorschaumerkmal entfernt.

Die Registrierung geschieht bei Aktivierung des echten generischen Rasters und ergänzend vor Öffnen des Labors, damit ausgeschaltete Wolken korrekt als **„ausgeschaltet“** von wirklich noch nicht angebundenen Katalogeinträgen unterscheidbar sind.

Die produktive Aktivierung, das Zeichnen, die Coverage-Prüfung, Provider-Zeiten, Kachelabrufe und Quellenauswahl verbleiben unangetastet in `layer-menu.js`.

### Dynamische Verfügbarkeit und Vorschau

Die vorhandene Dropdown-Aktualisierung prüft den Zustand des jeweiligen Adapters und aktualisiert sich bei den bereits existierenden Layer-/Kachelstatusereignissen, selbst wenn das Wetterlayer-Menü gerade geschlossen ist. Die Bedeutung wird unterschieden:

| Status | Anzeige/Verfügbarkeit |
| --- | --- |
| `off` | „ausgeschaltet“; kein bearbeitbares aktives Raster |
| `loading` | „lädt“; bis zum erfolgreichen Kachelstatus keine falsche Freigabe |
| `no-data` | „ohne Daten“; kein nutzbares gezeichnetes Raster |
| `active` | echter Renderer/Paney verfügbar, optionale Raster-Labor-Vorschau |
| `unconnected` | Kataloginhalt ohne tatsächliche Rasteradapteranbindung |

Nach erfolgreichem generischen Layer-Ladeabschluss wird eine zuvor eingeschaltete **zu dieser Ebene gehörende** Laborvorschau über `_rasterLabReapplyPreview()` erneut angebracht; beim Abhängen, Ausschalten oder Neuanfordern wird der zuvor gespeicherte Pane-Zustand gezielt zurückgestellt.

Die vorhandenen Regler **Glättung, Flächenverschmelzung, Kontrast, Farbsättigung, Helligkeit und Deckkraft** bleiben die einzige Bedienoberfläche. Keine zweite Mosaikdarstellung und keine weiteren Wetterabfragen wurden geschaffen.

## 3. Unabhängigkeit von Niederschlag und Wolken

Das Labor speichert Testwerte weiterhin getrennt nach Ebene, Kartenzoom und diagnostiziertem Native-Zoom im bestehenden `_rasterLabKey`. `clouds` und `precipitation` verwenden unterschiedliche reale DOM-Panes. Die temporäre CSS-Vorschau sowie Rücksetzung des generischen Rasters wirken ausschließlich auf dessen eigenen Pane. Der bereits freigegebene Niederschlag-Adapter bleibt bei seiner bisherigen `_weatherDisplayRefreshRenderedLayers()`-Rücksetzung.

Ein Cloud-Preview-Blur von 26 px und eine experimentelle Deckkraft von 0,62 wurden in einem **echten Chromium-Browserbild** testweise gesetzt. Der Niederschlags-Rotkanalstichpunkt muss dabei exakt unverändert bleiben, der Wolken-Kantenstichpunkt muss sich ändern und nach Schließen des Labors wieder exakt den Ausgangswert liefern. Diese Bedingungen wurden nicht nur anhand von CSS-Eigenschaften, sondern durch numerisches Auslesen der tatsächlich von Chromium erzeugten Screenshots mit Sharp geprüft.

Wind ist als **tatsächlich vorhandener generischer Rasterrenderer** anschließbar, bleibt aber bei ausgeschalteter oder nicht gezeichneter Windebene erwartungsgemäß nicht bearbeitbar. Windfahnen werden damit nicht gleichgesetzt.

## 4. Browser-Nachweise, Testverfahren und Grenzen

**Neuer dauerhafter Browser-Test:** `scripts/test-gr-wl-cloud-01-browser.cjs`, integriert in `.github/workflows/shared-frontend.yml`. Er verwendet die originalen aktuellen `installWeatherDisplayMenu`, `installRasterLab` und `installWeatherLayerMenu`-Modulmethoden auf einer isolierten, echten Chromium-DOM-Testkarte mit sichtbaren getrennten Niederschlags-, Wolken- und Wind-Panes.

Die Quelle ist ein vollständig **synthetisches** 210×210-RGBA-Raster mit Alpha-Übergang und transparenten NoData-Bereichen. Weder reale Providerdaten noch Nutzerkoordinaten oder private Home-Assistant-Daten werden verwendet. Der Test prüft:

1. echten installierten Wolkenadapter und richtigen Pane; vorhandenen Niederschlagsadapter unverändert; Wind ausgeschaltet;
2. **wirklich geöffneten** Raster-Labor-Dialog im Browser, in dem Wolken auswählbar und nicht aktive Windebenen deaktiviert sind;
3. Auswählen der Wolkenebene über das native Dialog-`change`-Ereignis;
4. Anbringung einer temporären Wolkenvorschau mit echten vom Browser gerenderten geänderten Kantenpixeln;
5. tatsächliche Unveränderlichkeit des Niederschlags-Pixelstichpunkts;
6. vollständige Browser-Pixelwiederherstellung nach `_rasterLabClose()`;
7. `active`, `off`, `no-data`-Zustände ohne vorgetäuschte Verfügbarkeit.

Die Funktionalität ist auf eine **isolierte echte Browserdarstellung mit den echten produktiven Adapter-/Labormethoden** bezogen; der Test startet nicht die gesamte Home-Assistant-Anwendung und ruft keine realen WeatherRouter-Livedaten ab. Die früheren GR-WEICH-04/05-Browserpixeltests für Niederschlag und die geschützten V1/V2-Vertragsprüfungen bleiben erhalten. Eine echte HA-DEV-Ende-zu-Ende-Wolkenprüfung steht aus.

**GitHub-Actions-Bildartefakt:** [GR-WL-CLOUD-01 – echte Chromium-Bildbelege](https://github.com/TheDaimos/gewitterradar/actions/runs/39605368602); innerhalb des Laufs wird das Artefakt `gr-wl-cloud-01-browser-evidence` mit `cloud-preview.png`, `cloud-restored.png` und `pixel-results.json` hochgeladen. Die genaue Artefaktkennung und die endgültigen CI-Ergebnisse werden im Schlussprotokoll bestätigt.

## 5. Quelländerungen, Version, Prüfsummen

Der folgende Ausgangsstand wurde **nicht** als bereits installierte HA-Realabnahme ausgegeben. Für die neuen Module wurde nach der Implementierung ein eigener unterscheidbarer DEV-Laufzeitstand erzeugt.

| Bereich | Version |
| --- | --- |
| Anwendung | **V4.11.102 DEV** |
| Build | `V4.11.102-DEV-2026-10-21` |
| Runtime | `411102r1` |
| Modulsatz | `E411-102A1` |
| Raster-Labor | Modul `diagnostics.raster-lab` **0.1.2** |
| WeatherRouter-Layerhub | Modul `weather.layer-menu` **1.1.7** |
| Native Integration | **0.25.18**, unverändert |

Die beiden funktionsrelevanten JS-Module wurden in **allen drei Frontend-Auslieferungsbäumen** konsistent gespiegelt: `frontend/`, `dashboard/dist/`, `custom_components/gewitterradar/frontend/`. Auch zentrale Version, Laufzeit-/Modulmanifest, Raster-Labor-Importrevision, nativer Panel-Cache, DRA-Provenienz und bisherige Versions-/Build- und Sicherheitstests wurden gemeinsam synchronisiert.

`frontend/assets.json` enthält die aktualisierte SHA256-Digest des aktuellen Runtime-Manifests; `SHA256SUMS_FRONTEND.txt` wurde für die tatsächlichen geänderten installierbaren Dateien nachgerechnet und kanonisch sortiert. Frühere Versions- und Sicherheitschecks wurden **nicht** deaktiviert. Die native Integrationsversion wurde nicht ohne Backendänderung künstlich angehoben.

Wichtige Commits des Entwicklungsverlaufs: `ccf0bd1c48a073e65a965838f8619b2cfa8cdd08` (Adapter), `7b38ea18098990fe8a7088a036bd1bd275fe5876` (dynamische Verfügbarkeit), `511c316deb2c76018ef22a393be586852975827b` (Browser-Pixeltest), `426f3bfe20a24745389a5c3b5ca659dac53246cf` (CI-Artefakte), `81f20d8e2524a375d3dcfdcc656f659086095775` (Wolkenstatus vor Dialogöffnung und Preview nach Kachelladen), `c27a6beae9f2935d1add0baeaf003d47b3d4cf79` (Dialog-Browserregression), `66e068aba917b1e4a2b24ba454365d1354a5bdd2`, `f8a8a4b6011c6576219e72b39f564265e4d4d658`, `7598c463bc6a63aea9b6784ac19c88bf8000979a` (kontrollierte Anhebung und Verträge), `455df366b29bf7b0109fcc3469bca26b9b7cb71f` (Vorschaumarker bei Abschaltung), zuletzt `1b9100c6880af405e1a5a5578fab78f40979d8cd` (SHA256-Bestand).

## 6. Ausstehende echte Realabnahme und Schutzsperren

- **Nicht ausgeführt:** DRA-Installation, Home-Assistant-Neustart, Änderungen an **HA DEV VM 109** oder **HA PROD VM 101**. Für V4.11.102 liegt noch kein Betreiber-Sichttest vor; **kein HA-REAL-PASS** und keine PROD-Freigabe.
- Auf DEV tatsächlich zu prüfen: Wolken ein/aus bei „Karte aktiv“, Region-/Zoom-/Zeitsprung, Wolken-Hotspots und transparente NoData-Grenzen, Labor-Dialog mit echten Providerdaten, Browserneuladung und Wiederherstellung nach Layer-Neuerstellung.
- Wind-Labor erst als aktive Rasterebene abnehmen, wenn ein tatsächlich gezeichneter Wind-Rasterlayer vorliegt; Vektor-/Windfahnenverhalten ist ausdrücklich nicht Gegenstand der Raster-Labor-Implementierung.
- Die früher noch offenen vollständig produktiven asynchronen V1/V2-/Mosaik-Browser-Gesamtabnahmen sind **weiterhin offen**. Die vorhandenen isolierten Browserbilder sind kein Ersatz.
- Keine WeatherRouter-Änderung, keine Veränderung von UTC, keine neue Rendererarchitektur, keine Schwächung von Sicherheits-/Authentifizierungs-, DRA- oder Verbraucher-Schnittstellenverträgen. **Keine automatische Installation.**

**C.K. – Eine Idee weiter gedacht.**

## 7. Abschließende echte GitHub-Actions-Abnahme – V4.11.102 DEV

**Endgültiger unveränderlicher Programmcommit (einschließlich aller Prüfsummen):** `1b9100c6880af405e1a5a5578fab78f40979d8cd`. Die nachfolgende Dokumentationsarbeit verändert nicht den geprüften Programmstand.

Alle drei zentralen GitHub-Actions-Läufe dieses **exakten Commits** wurden nach vollständigem Abschluss direkt über GitHub zurückgelesen und stehen ausdrücklich auf **`completed / success`**:

| GitHub-Prüfung | Run-ID und Nachweis | Tatsächliches Ergebnis |
| --- | --- | --- |
| V4.11.102 Einstellungen, Version und Laufzeitidentität | [39605368650](https://github.com/TheDaimos/gewitterradar/actions/runs/39605368650) | **SUCCESS** |
| Gewitterradar-Integration | [39605368669](https://github.com/TheDaimos/gewitterradar/actions/runs/39605368669) | **SUCCESS**, alle vier Jobs (`package-contract`, `hassfest`, `hacs-integration`, `home-assistant-runtime`) |
| Gemeinsames Frontend, identische Spiegel und SHA256, ursprüngliche GR-WEICH-Prüfungen sowie GR-WL-CLOUD-01 | [39605368602](https://github.com/TheDaimos/gewitterradar/actions/runs/39605368602) | **SUCCESS**, einschließlich realem Chromium-Pixeltest, Labor-Dialog und Artefakt-Upload |

**Echter Beleg aus dem Browser-Jobsprotokoll (Chromium 151.0.7922.34):** Der Prüfschritt `GR-WL-CLOUD-01 active generic raster and Raster-Labor browser pixels` endete mit **SUCCESS** und protokollierte die folgenden aus tatsächlich gerenderten PNGs gemessenen Rotkanalwerte:

| Messposition (synthetische Daten) | Vor Vorschau | Wolken-Vorschau | Nach Wiederherstellung |
| --- | ---: | ---: | ---: |
| Niederschlagsfläche | 208 | **208** | 208 |
| Wolkenfläche (Kern) | 208 | **72** | 208 |
| Wolkenfläche (Rand) | 17 | **53** | 17 |
| Windfläche (nicht ausgewählt) | 208 | **208** | 208 |

Die Vorschau verändert somit tatsächlich Wolkenpixel, **nicht** Niederschlags- oder Windpixel. Nach dem Schließen sind die geprüften Originalpixel exakt wiederhergestellt. Der Browserdialog meldete den Wolkenadapter `active`, Wind `off`, und bestätigte erfolgreich den Wechsel der Verfügbarkeit auf `off` bzw. `no-data`.

**Originale GitHub-Actions-Bilddateien und JSON-Messung:** [GR-WL-CLOUD-01 Browserartefakt 12348058096](https://github.com/TheDaimos/gewitterradar/actions/runs/39605368602/artifacts/12348058096) (`gr-wl-cloud-01-browser-evidence`, 25.319 Bytes, nicht abgelaufen). Daneben blieben die unabhängigen Originaltests [GR-WEICH-04-Pixelreferenz 12347933418](https://github.com/TheDaimos/gewitterradar/actions/runs/39605368602/artifacts/12347933418) und [GR-WEICH-05-Browsermodule 12348033082](https://github.com/TheDaimos/gewitterradar/actions/runs/39605368602/artifacts/12348033082) erhalten.

**Fachliche Freigabegrenze:** **CI-PASS für den vorliegenden DEV-Programmstand und die isolierte tatsächliche Chromium-Bildprüfung**. Die Browserprüfung ersetzt keine komplette asynchrone WeatherRouter-/Home-Assistant-Realintegration. Die Wolken-Labor-Prüfung mit tatsächlich auf VM 109 installierter V4.11.102, realen Providerdaten und Benutzerhandlung ist **noch nicht ausgeführt**. Die Installationssperre bleibt unverändert: **keine selbstständige DRA-Installation, keine Änderung an HA DEV/PROD und ausdrücklich kein HA-REAL-PASS.**
