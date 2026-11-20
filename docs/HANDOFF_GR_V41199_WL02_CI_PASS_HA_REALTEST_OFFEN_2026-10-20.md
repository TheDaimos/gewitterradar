# VERBINDLICHE ERWEITERTE CHATÜBERGABE – Gewitterradar V4.11.99 / WL-02

**Übergabe erstellt:** 20.10.2026 · **Neuer Chat:** ausschließlicher **Gewitterradar-Entwicklungschat** · **Priorität P1: WL-02 vollständig zu einer real abnehmbaren Wolken- und Windrasterdarstellung führen**.

**Repository:** `TheDaimos/gewitterradar` · **ausschließlich Zweig `deploy/dev`**. Keine weiteren Arbeitszweige, kein paralleles Raster-/Mosaiksystem, keine Produkt-/Versionsfreigabe aufgrund reiner Dokumentation.

**Geprüfte HEAD-Momentaufnahme VOR dieser Übergabe:**
- **GR:** `4ed5b37e666342ccfa70125a25fe7b6d8a509b9f` – reine CI-Statusdokumentation. Letzter hier identifizierter Programm-/Prüfsummenschritt: `ed7e696819bcf92fc5102c6bc34716f9bde8fc93`; zusätzliche Dokumentation `b5eb125fb0216cd7434c37e80041327dd0aabae4`. Alle weiteren Änderungen in GitHub vor Wiederaufnahme erneut abgleichen.
- **WeatherRouter:** `TheDaimos/weather-router-dev@deploy/dev`, `29977b45a2401d090e9d31bee6bdd9ad3c23bd49` – unabhängiger separater Entwicklungsstrang, kein Auftrag an GR, WeatherRouter-Programmdateien zu verändern.
- **GR-Versionskonstanten in `frontend/version.js` tatsächlich geprüft:** `V4.11.99 DEV`, `41199r1`, Modulset `E411-99A1`, HA-Integration `0.25.17`. Modul `weather.layer-menu` **1.1.5**.
- **WR-Version in `const.py` tatsächlich geprüft:** `V0.10.161 DEV`, Loader `0.10-loader-164`. Dies ist **nicht** der Nachweis des tatsächlich installierten HA-Standes.

## 0. Zuerst vollständig lesen – ohne offene Schritte zu überspringen

1. **Diese vollständige Übergabe**, dann aktuelle GR-/WR-`deploy/dev`-HEADs und vorhandene Commits/Dateien/Prüfläufe lesen.
2. `docs/V4_11_WL_02_GENERIC_WR_RASTER_RENDERER_ENTWICKLUNGSAUFTRAG_2026-10-19.md` – **verbindlicher, weiterhin aktiver ursprünglicher WL-02-Auftrag**.
3. `docs/V4_11_WL_02_FORTSETZUNG_ZEICHENSTATUS_UTC_CI_2026-10-19.md` – **jüngster tatsächlich detailliert dokumentierter Programm- und CI-Stand**.
4. `docs/V4_11_WL_02_KOORDINATION_CI_IMPLEMENTIERUNG_PRUEFBERICHT_2026-10-19.md` – zunächst behobene Manifest-/Spiegel-/SHA-/WMS-/Timer-/Legendenfehler.
5. `docs/V4_11_WL_02_CODE_REVIEW_OFFENE_VERTRAEGE_NACHARBEIT_2026-10-19.md` – ursprüngliche Probleminventur, **bereits behobene Punkte ausdrücklich als historisch behandeln**.
6. `docs/V4_11_WL_01_KATALOGWAHRHEIT_VERTRAGSINVENTUR_2026-10-19.md` und `docs/V4_11_WEATHER_ROUTER_NICHT_NIEDERSCHLAG_LAYER_AUDIT_UND_AUFTRAG_2026-10-19.md` – Ursprung der Karten-/Punktdatenunterscheidung.
7. Private, vollständig gelesene WR-Koordinationsantwort: `TheDaimos/weather-router-dev@deploy/dev/docs/p7-010-coordination/KOORDINATION_AN_GR_WL02_CI_PASS_WEITERARBEIT_MD_EINZEILER_2026-10-19.md`.
8. **Verbindliche zukünftige Antwortregel:** `TheDaimos/weather-router-dev@deploy/dev/docs/p7-010-coordination/REGEL_GR_WR_ENTWICKLUNGSANTWORTEN_MD_GITHUB_DIREKTLINK_2026-10-19.md`.
9. Bei der Realabnahme zusätzlich `docs/GR_RF04_ABSCHLUSS_V41199_CODE_CI_HA_STATUS_2026-10-19.md` und die GR-RF-01–04-/P7-010-Niederschlagsregressionen berücksichtigen; der DWD-`coverage_timeout`-Realtest bleibt eigenständig.

**Neuer Chat: Bitte die GitHub-Dateien selbst lesen, nicht nur deren Namen verwenden.**

## 1. Ziel, technische Abgrenzung und geschützter Bestand

**WL-02 allein:** Die im WeatherRouter Consumer V1 aufgeführten, wirklich geeigneten `raster_tile`-Fähigkeiten `weather.satellite.clouds` und `weather.model.wind_10m.layer` als getrennte, schaltbare, georeferenzierte Wolken-/Wind-Kartenebenen im bestehenden Gewitterradar darstellen. GR trifft **keine** Providerwahl, sondern erhält fertig routete Quellen ausschließlich über WR. `weather.point.*` ist **kein** Raster.

**Nicht in WL-02 enthalten:** WL-03 (Punktwerte UV, Temperatur, Wolkenanteil, Windgeschwindigkeit), WL-04 (Ereignisse, Bildfolgen, Planetenkacheln, Naturgefahren), WeatherRouter-OPERA-Providerimplementierung oder ein neues Mehrquellenmosaik. Nicht mit einer anderen Providerarchitektur verknüpfen.

**Bestandsschutz:** Gewitterradar-Niederschlag Consumer V1/V2, P7-010-DWD-/NASA-Mosaik, V1-Fallback, Region-/Coverage-/Ausschlusslogik, Radarplayer, Zoom-/Mobile-/iPad-/Firefox-Darstellung, Dashboard/Fenstermodi, Profile/Opt-in, 900-Sekunden-Regel für aktuelle Radardaten und 43.200 s NASA nur mit ausdrücklichem Opt-in. **Quellzeiten müssen eindeutig UTC-normalisiert werden; `fetched_at` oder Last-Modified ersetzt niemals `valid_at`.** Die providerseitige Zeitnormalisierung bleibt in WR zentral (`time_normalization.py` / Zeitverträge).

**Datenschutz:** Keine echten Benutzerkoordinaten, private Erweiterungen, API-Geheimnisse, originalen HA-Diagnoseexporte oder Export2Git-Daten ins öffentliche GR-Repo. Vertrauliche Originalexporte ausschließlich `TheDaimos/Project-Log-And-Export@main`. Private Koordination in `TheDaimos/weather-router-dev@deploy/dev/docs/p7-010-coordination/`. Kein offener Kartenproxy und keine Tokens in Raster-URLs.

## 2. Bereits umgesetzt und überprüft – NICHT neu implementieren

**A. GR-WL-02-V1-Grundadapter** in `frontend/modules/weather/layer-menu.js`: getrennte Wolken-/Windebenen, bestehender Consumer-V1-Client, `bbox` und `time.mode=latest`, Kartenpaneele, eingeschränkte Zustände, Diagnosephasen und Provider-/UTC-/Attributionsanzeige.

**B. Vertrags- und Lebenszyklusreparaturen:** Reguläres WR-`provenance.spatial_coverage={scope:"bbox",bbox:{west,south,east,north}}` korrekt lesen; `scope:"global"`, Antimeridian und ungültige Geometrien sicher unterscheiden; Generationen/abgebrochene Resolve-Anfragen verwalten, Kartenwechsel, `moveend`/`zoomend`, `visibilitychange`, tatsächliches Entfernen von Layern und Listenern beim vollständigen Kartenabbau. Die bereits vorhandenen Fixes `1cf9ab36`, `d5c9766f`, `8b59ffa8` usw. nicht blind duplizieren.

**C. Manifest-/Spiegel-/Prüfsummenkorrektur:** Module `weather.layer-menu` **1.1.5**, Hauptlader-Import `41199r1`; kanonische `frontend`-, HA-`custom_components/gewitterradar/frontend`- und `dashboard/dist`-Auslieferungskopien sowie `frontend/assets.json`, `SHA256SUMS_FRONTEND.txt` korrigiert. CI-Identitätsprüfung an den **tatsächlich reparierten** Bestand angepasst; nicht die Tests abschalten. Bestätigt über `e9aaadecf3e59145d16d713296b1e2776e1ac735` und CI.

**D. WMS/XYZ statt zweiter URL-Berechnung:** Der generische Layer benutzt `modules/weather/p7-010/raster-tile-url.js` mit `rasterTileUrl` für `{z}/{x}/{y}` und `{bbox-epsg-3857}`, HTTPS-Fail-Closed, kein Secret/ungültiger Platzhalter, beschränkter nativer Zoom und gesicherter Zuschnitt über vorhandene Rasterhilfen. Bildanforderungen derzeit mit separatem `GENERIC_TILE_BUDGET.maxInFlight=8`.

**E. Ruhende Karte und Legende:** Aktive Wolken-/Windebenen lösen bei sichtbarer, unbewegter Karte alle **300 s** neu auf; im Hintergrund keine zyklischen Netzanfragen; Timer beim Deaktivieren/Abbau entfernen. Falls vom Provider geliefert, berührbarer geprüfter HTTPS-Legendenlink `Legende öffnen`. Quellen-/Zeit-/Attributionshinweise vorhanden, fachliche Vollständigkeit noch nicht mit echten Quellen belegt.

**F. Neuester Draw-/UTC-Fix (19.10. abends):**
- **Alter Fehler:** Ein `L.gridLayer`-Canvas, das wegen `rects.length===0` vollständig transparent blieb, galt nach `done(null,canvas)` und `tileload` fälschlich als „gezeichnet“; bei `load` wurde `ready`/„Karte aktiv“ gesetzt, obwohl keine Zeichnung stattgefunden hatte.
- **Bereits korrigiert:** `WeakSet` unterscheidet ausgeschnittene Leercanvases von tatsächlich per `drawImage` beschriebenen; `loaded`, `drawn`, `skipped`, `failed` und `genericRasterCycleStatus` mit getrennten `unavailable`/`failed`/`ready`/`partial`-Folgen. **`drawn` bedeutet `drawImage` ausgeführt, nicht wissenschaftlich gültige oder nichttransparente Nutzpixel!**
- **Alter Fehler:** Doppelt maskiertes \d im Zeitstempel-Suffix wies gültige Offsetzeiten zurück.
- **Bereits korrigiert:** `parseGenericRasterUtc(value)` normalisiert explizite `Z`-, positive und negative `±hh:mm`-Zeitstempel zu UTC-`Z`, lehnt naive/ungültige Zeiten fail-closed ab; derselbe normalisierte `valid_at` geht in Vertrag und Anzeige. WR-Zeit-/Frischeverträge unverändert.
- Drei Auslieferungskopien und tatsächliche SHA-Summen zu den Änderungen synchronisiert. **Letzter identifizierter Programm-/Prüfsummenschritt:** `ed7e696819bcf92fc5102c6bc34716f9bde8fc93`; seitdem nur Dokumentation nach aktuellem GitHub-Verlauf.

**G. Bereits nachgewiesene automatisierte Prüfläufe für den jüngsten Programmbestand:**

| GitHub-Actions-Lauf | Zugeordneter Commit | Status |
|---|---|---|
| [39318858688](https://github.com/TheDaimos/gewitterradar/actions/runs/39318858688) – Einstellungen/Identität | `ed7e696819bcf92fc5102c6bc34716f9bde8fc93` | SUCCESS |
| [39318858618](https://github.com/TheDaimos/gewitterradar/actions/runs/39318858618) – Integration, 4 Teiljobs | derselbe | SUCCESS |
| [39318858714](https://github.com/TheDaimos/gewitterradar/actions/runs/39318858714) – gemeinsames Frontend | derselbe | SUCCESS |
| [39319925583](https://github.com/TheDaimos/gewitterradar/actions/runs/39319925583) – Einstellungen/Identität | `4ed5b37e666342ccfa70125a25fe7b6d8a509b9f` (Dokumentations-HEAD) | SUCCESS |
| [39319925580](https://github.com/TheDaimos/gewitterradar/actions/runs/39319925580) – Integration | derselbe Dokumentations-HEAD | SUCCESS |
| [39319925654](https://github.com/TheDaimos/gewitterradar/actions/runs/39319925654) – gemeinsames Frontend | derselbe Dokumentations-HEAD | SUCCESS |

**Achtung:** Zwischenfix `f9f4ed6c...` hatte einen fehlgeschlagenen Frontendlauf; die darauf folgende Prüfsummenkorrektur und die tatsächlich grünen Läufe auf `ed7e6968...` beseitigen diesen alten Teststand. Nicht ein historisches FAIL als aktuellen HEAD-FAIL darstellen oder einen alten grünen Lauf als HA-Test interpretieren.

**Status:** **CODE-/öffentlicher CI-TEIL-PASS** für bisherige Manifest-/URL-/Draw-/UTC-Änderungen – tatsächliche Browser-/Provider-/HA-REAL-ABNAHME weiterhin OFFEN.

## 3. AKTIVE Restarbeiten – P1 und Reihenfolge

### P1-A – Echten WR-V1-Rastervertrag und tatsächliche Quellenverfügbarkeit abnehmen

Für **beide** Fähigkeiten nacheinander den vorhandenen WebSocket-Consumer benutzen: `weather_router/consumer/discovery`, `.../capabilities`, `.../resolve` mit Profil, aktuellem explizitem `bbox`, `time:{mode:"latest"}`; `ready` nur bei `resource.type=raster_tile`, plausibler HTTPS-Kachelvorlage, nachgewiesener Maschinenabdeckung, `provenance`/Attribution, normierter `freshness`, fachlich passender `resource.semantics` und tatsächlicher Berechtigung. `unavailable`/Coverage/Provider-Sperre sauber und mit bereinigter Diagnose ausgeben. Katalog-`available` und `ready` nicht verwechseln. **Keine erfundene live-raster_tile-Antwort oder Scheinbild.**

Falls HA nicht zugänglich: kontrollierte Testantworten und die bestehenden WR-V1-Schemas exakt prüfen, ehrlichen `HA-REAL-PENDING` dokumentieren; keine Benutzeraktionen vorgaukeln.

### P1-B – Eigentliche Bildpixel, Geografie und Statuswahrheit

- Für reale, mit HA erreichte HTTPS-/XYZ-/WMS-Bildkacheln im Browser die korrekte WebMercator-Kachelkonvention, `{bbox-epsg-3857}`, CORS, nativen Zoom/Übervergrößerung, `bbox`-Randpixel, leere Canvas, transparente und NoData-Teile, Antimeridian, globalen vs. regionalen Umfang und echten Canvas-Zeichenabschluss verifizieren.
- **Nicht nur `drawn>0` als Pixel-/Dateninhalt behaupten.** Tatsächliche sichtbare, nichttransparente Nutzpixel und fachliche Aussage getrennt nachweisen, wo technische Bildinspektion zulässig/realisierbar ist. Quelle, Legende, Modell/Beobachtung, Datenzeit und Aktualität dürfen die Bildwerte nicht verfälschen.
- Fail-closed URL-/Geo-/Provider-/Stale-/Lizenzfälle regressionsprüfen. Der alte `ready`-Fehler darf nicht wieder auftreten.

### P1-C – Kartenlebenszyklus und gemeinsamer Ressourcenhaushalt

- Ein/Aus, Wolken + Wind gleichzeitig, mit/ohne Niederschlagsmosaik, schnelle Zoom-/BBOX-/Fenster-/Vollbildwechsel, Browser Vorder-/Hintergrund, 300-s-Ruheaktualisierung, Reconnect, Session-Neustart und Berechtigungsentzug mit **wirklich beobachteten** Anfragen, Abbrüchen und Wiederaufnahme prüfen.
- Der generische WL-02-Code hat ein eigenes Limit von **8 aktiven Bildern**, GR P7-010/Niederschlagsrenderer einen separaten Planer. Es liegt **KEIN** verifizierter gemeinsamer CPU-/RAM-/Netz-/Kachelanfrage-Budget-PASS vor. Erst Instrumentierung und Prüfung vorhandener Scheduler/Lastlimits; **keine zweite Mosaik-/Routingarchitektur**. Wenn erforderlich, nur kontrollierte Zusammenarbeit in bestehender Karten-/Rendererschicht und vollständige Regressionsbeweise.
- Tests auf PC, Android und iPad anhand realer HA-/Browserlaufzeit; Desktop-/Mobil-Zoom-, Legenden- und Bedienung schützen.

### P1-D – Abschluss und Versionierung erst bei ausreichendem technischem Nachweis

- Vollständige GR-RF-01–04-, V1-/V2-, DWD-/NASA-, UTC-/900-/43200s-, Coverage-/Profil-/Opt-in-, Radarplayer-/Zoom-/Frontend-/DRA-Paketregressionen; öffentliche Push-Workflows auf **dem neuesten konkreten Codecommit** mit Logs prüfen.
- Der echte GR-RF-04-Fall `DWD coverage_timeout` mit regionaler Rückhaltung bleibt **gesondert REAL-PENDING**; synthetische Timeout-Tests sind kein Ersatz.
- **Keine unnötige V4.11.100/DEV-Zwischenversion und keine DRA-Freigabe aufgrund dieser Übergabe.** Wenn WL-02 technisch releasekandidatenfähig ist: **eine** konsistente neue DEV-Version mit Runtime-/Modulset-/HA-Integrations-/Dashboard-Spiegel-/Cache-/Asset-SHA-/GitHub-CI-Identität und dokumentiertem DRA-Installationspaket vorbereiten. Anschließend **echte** HA-Realabnahme beim Benutzer; falls Live-Quelle nicht liefert, begründetes Gate und exakter Testauftrag statt falschem PASS.
- Benutzerrückmeldungen / Diagnose-JSON nur im privaten Archiv speichern; in öffentlichen GR-Dokumenten nur datensparsame, nicht personenbezogene Prüffakten.

## 4. Separater WR-/OPERA-Stand – NUR zur Schnittstellenkoordination, nicht doppelt implementieren

WeatherRouter V0.10.161 DEV / Loader 164, eigener Entwicklerchat auf `TheDaimos/weather-router-dev@deploy/dev`. WR F7 nach F15 hat echte CIRRUS-DBZH-Originaldatei (1 km / nominal 5 min / dBZ) und NIMBUS RATE (2 km / 15 min / mm/h) bereits fachlich untersucht; F9–F15 Sicherheits-/CoG-/Time-/Frame-/HTTP-/Quality-Module sind **teilweise vorhanden, staged/dormant**, aber **noch kein produktiv registrierter OPERA-Provider**.

**WR-Zustandsbericht (20.10.2026):**  
`https://github.com/TheDaimos/weather-router-dev/blob/deploy/dev/docs/p7-010-coordination/STATUS_WR_OPERA_F7_NACH_F15_2026-10-20.md`

**Bereits nachgewiesen:** öffentlicher WR-Hauptlauf `39319084517` Python 3.12/3.13 erfolgreich inklusive tatsächlich ausgeführter Bildtests. **Separater HA-Zielplattform-Blocker:** `39319084530` für CP314/musllinux x86_64 + aarch64 in beiden Jobs rot, da kein passendes Rasterio-1.5.0-Wheel in den geprüften Indizes – kein generelles Urteil über alle HA-Installationen. `requirements: []` im echten WR-Manifest; keine ungeprüften Abhängigkeiten aktivieren. Keine neue WR-Version/DRA/HA-REAL-Freigabe.

**Wichtig für GR:** Die spätere, authentifizierte OPERA-Kachelansicht (F14) benötigt einen **gesonderten GR↔WR-Integrationsvertrag** (Bearer-`fetch` → `Blob` → `blob:`-Bildpfad, Zugriffsentzug, Profilrechte, HTTPS). Sie ist **nicht** schon Teil der allgemeinen `https://`-WL-02-V1-XYZ-/WMS-Anbindung. Niemals ungeprüft eine `blob:`-Berechtigung oder eine tokenisierte HTTP-URL in `safeRasterUrl` aufnehmen. Kein WR-Kachelserver in GR.

## 5. Verbindliches Übergabe- und Kommunikationsformat (BEI JEDER WEITEREN ANTWORT!)

Die private Koordinationsregel  
`https://github.com/TheDaimos/weather-router-dev/blob/deploy/dev/docs/p7-010-coordination/REGEL_GR_WR_ENTWICKLUNGSANTWORTEN_MD_GITHUB_DIREKTLINK_2026-10-19.md`  
ist verbindlich.

**Verfahren:** Nach jeder relevanten Entwicklungsrunde den vollständigen Status/Code-/CI-/HA-/DRA-Befund in eine **echte UTF-8-`.md`** im passenden `TheDaimos/gewitterradar@deploy/dev/docs/` (nur datensparsam öffentlich) oder bei privatem Inhalt in `TheDaimos/weather-router-dev@deploy/dev/docs/p7-010-coordination/` schreiben und **committen**. Danach **dieselbe Datei auf `deploy/dev` von GitHub zurücklesen und Existenz/Inhalt prüfen**. Dem Benutzer anschließend **nur einen kopierbaren Einzeiler mit ausgeschriebener vollständiger `https://github.com/.../blob/deploy/dev/...md`-URL** als eigentliche Übergabe geben; der Zielchat liest das Dokument selbstständig und arbeitet weiter. Keine alleinige Datei-Downloadschaltfläche, kein erfundener Link, kein bloßer Pfad, keine Beispieldatei, keine langen übertragungsbedürftigen Nachrichtentexte. Die Antwortregel ebenfalls in zukünftige Chatübergaben integrieren.

## 6. Auftrag und Startprompt für den NEUEN Chat

> Bootstrap Daimos – Gewitterradar V4.11.99 / WL-02. Arbeite ausschließlich in `TheDaimos/gewitterradar@deploy/dev`. Lies zuerst VOLLSTÄNDIG `docs/HANDOFF_GR_V41199_WL02_CI_PASS_HA_REALTEST_OFFEN_2026-10-20.md` und die dort verbindlich verknüpften Originalaufträge, den jüngsten Draw-/UTC-/CI-Bericht, die private Koordinationsantwort sowie die Einzeiler-GitHub-Link-Regel. Prüfe dann den **aktuellen** HEAD und CI-Zustand neu, erkenne alle schon implementierten WL-02-Korrekturen an und arbeite die offen gebliebenen P1-A bis P1-D selbstständig und mit allen möglichen Regressionen weiter. Keine zweiten Raster-/Providerarchitekturen, keine neuen Entwicklungszweige, kein WR-/OPERA-Produktivcode, keine WL-03/WL-04-Arbeit und keine unnötigen Zwischenversionen. CODE-/CI-/HA-REAL-PASS, DRA-/Installationsfreigabe getrennt und mit echten Nachweisen; kein HA-PASS ohne echte Daten. Jede neue technische Gegenantwort als echte, nach Commit zurückgelesene GitHub-`.md` veröffentlichen und dem Benutzer als einzigen ausgeschriebenen GitHub-URL-Einzeiler übergeben. Keine Routine-Rückfragen oder Zwischenberichte. **C.K. – Eine Idee weiter gedacht.**

**Diese Übergabe ist eine konkrete Ausgangsbasis für die Fortsetzung, nicht die Behauptung, WL-02 sei vollständig abgenommen oder bereits installiert.**

**C.K. – Eine Idee weiter gedacht.**
