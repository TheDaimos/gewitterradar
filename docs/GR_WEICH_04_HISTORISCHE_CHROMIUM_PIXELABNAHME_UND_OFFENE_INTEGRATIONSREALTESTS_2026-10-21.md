# GR-WEICH-04 – Echte historische Chromium-Pixelprüfung der vier Niederschlagsmodi

**Datum:** 21.10.2026  
**Repository/Zweig:** `TheDaimos/gewitterradar@deploy/dev`  
**Programmversion:** V4.11.100 DEV (kein Versionssprung)  
**Status:** **Isolierte historische Browser-Pixelprüfung für synthetische Raster erfolgreich; vollständige V1/V2-/Raster-Labor-Browserintegration und HA-Realabnahme bleiben offen.**

## 1. Verbindliche Einstiegskontrolle

Der vollständige Vorbericht `docs/GR_WEICH_03_BROWSER_BILDABNAHME_DOM_REGRESSION_STATUS_2026-10-21.md` wurde direkt aus `deploy/dev` gelesen und seine GR-WEICH-01-/02-Vorbedingungen übernommen. Der zuvor offene echte GitHub-Actions-Lauf [39578833992](https://github.com/TheDaimos/gewitterradar/actions/runs/39578833992) wurde erneut über die GitHub-Schnittstelle geprüft: **completed/success**. Der Eintrittscommit für GR-WEICH-04 war `5f5d88ad8c4e2247187aa1b923a3125a15185f17`.

Historischer Referenzcommit: `46754f6689b0b01f1a45287e21572ae04b90f3bd` (V4.11.81, historisches Raster-Labor-Umfeld). Die damaligen echten Funktionen stammen aus `frontend/modules/weather/display-menu.js` an genau diesem Commit, **nicht** aus der ehemals statischen Raster-Labor-Versionsangabe. Die späteren GR-WEICH-01/02/03-Korrekturen bleiben unverändert. Eine zusätzliche eigenständig gestartete vollständige V4.11.82-Anwendung wird nicht behauptet.

## 2. Tatsächlich instand gesetzte Browser-Prüfumgebung

Bereits im Repository bestand mit `.github/workflows/shared-frontend.yml` eine echte Playwright-/Chromium-/Sharp-Prüfkette samt ursprünglichem `scripts/test-v41176-svg-filter-browser.cjs`. Diese vorhandene Umgebung wurde für GR-WEICH-04 genutzt statt einen zweiten Produkt-Renderer zu entwickeln.

Im isolierten Workflow wird der historische Commit mit `git fetch --no-tags --depth=1 origin 46754f6689b0b01f1a45287e21572ae04b90f3bd` geholt. Das neue Prüfprogramm `scripts/test-gr-weich-04-browser-history.cjs` verwendet `git show <historischer Commit>:frontend/modules/weather/display-menu.js` und lädt die drei tatsächlich historischen Profilfunktionen in eine isolierte Node-VM. Der aktuelle `display-menu.js` wird lokal vom zu prüfenden Commit gelesen. Exportdeklarationen werden **nur im Prüfhaken** zum Ausführen in der VM entfernt; die mathematischen Funktionen selbst werden nicht aus einer erfundenen oder nachprogrammierten Referenz übernommen.

Die aus historischen und aktuellen Quellfunktionen errechneten CSS-Filter werden mit einer **identischen synthetischen RGBA-Quelle** in einem echten headless Chromium via Playwright gerendert. Sharp liest anschließend numerische RGB-Bildpunkte aus tatsächlichen Browser-Screenshots.

**Ein realer anfänglicher Testfehler wurde behoben:** Der erste Browserprüflauf scheiterte an `SyntaxError: Unexpected token 'export'`, weil echte `export const`-Module im VM-Fragment JavaScript-Modulsyntax statt Skriptsyntax enthielten. Die gezielte Korrektur entfernt ausschließlich die Export-Schlüsselwörter beim Testladen. Der nachfolgende Actions-Lauf bestätigt für den historischen Pixeltest **success**.

Ein früher in GR-WEICH-03 nicht funktionierender lokaler Chromium-Aufruf konnte außerdem hier lokal technisch eingegrenzt werden: Chromium 144.0.7559.96 ließ sich mit Playwright und `page.set_content` tatsächlich starten und einen Screenshot erstellen, während ein direkter `file://`-Aufruf mit `net::ERR_BLOCKED_BY_ADMINISTRATOR` abgewiesen wurde. Der GitHub-Actions-Pixelvergleich verwendet ebenfalls `page.setContent`, ohne Datei-URL. Die reproduzierbare historische Vergleichsausführung erfolgt über das Repository-Prüfgate.

## 3. Echte Screenshot- und Pixelbelege

**Erfolgreiches GitHub-Actions-Gate:** [Validate shared Gewitterradar frontend – 39580187819](https://github.com/TheDaimos/gewitterradar/actions/runs/39580187819), Schritt `GR-WEICH-04 actual historical Chromium pixel comparison` **success**, Schritt `Fetch exact historical V4.11.81 commit` **success**, Schritt `Preserve GR-WEICH-04 pixel evidence` **success**.

**Authentisches Actions-Artefakt:** [gr-weich-04-browser-pixels, Artefakt 12335114191](https://github.com/TheDaimos/gewitterradar/actions/runs/39580187819/artifacts/12335114191). Es enthält die erzeugte `synthetic-source.png`, je Modus und Kartenzoom echte Browser-Screenshots für historische Referenzzoomstufe 7, aktuelle Referenzzoomstufe 7 und historische URL-Zoomstufe 18, `css-vs-svg-z9.png` und `pixels.json` mit tatsächlich aus den PNGs gelesenen numerischen Pixelmessungen. Keine Nutzerbilder, privaten Orte oder Live-Wetterdaten werden verwendet.

**Abnahmematrix des erfolgreich ausgeführten Prüfschritts:**

| Gesichtspunkt | Ausführung | Ergebnis |
| --- | --- | --- |
| Synthetische RGBA-Kachel mit transparentem/NoData-Innenbereich | Echte PNG-Quelle, Browser gerendert | PASS |
| Historischer Code | Tatsächliche Funktionen aus Git-Commit V4.11.81 | PASS (isolierte Funktionen) |
| Aktueller Code | Funktionen aus aktuellem `deploy/dev` | PASS (isolierte Funktionen) |
| Alle vier Modi | `auto`, `precise`, `balanced`, `soft` | PASS (Screenshot-Erstellung) |
| Kartenzoom | Zoom 8, 9 und 10 | PASS |
| Vergleich identischer visueller Referenz z7 | Historisch und aktuell: tatsächliche RGB-Stichproben an Kern, Außenzone und Kante | PASS: identische gemessene Stichproben |
| Historische URL-Obergrenze 18 | Je Modus separat als Regressionseingang gerendert | PASS (Nachweisbilder vorhanden; kein behaupteter historischer Bild-Ist-Zustand des Nutzers) |
| Chromium CSS-Weichzeichnung | Screenshot und Pixel-Stichproben | PASS |
| SVG-Mehrskalen-gegen-CSS-Zweig | Gemeinsames Chromium-Vergleichsbild bei Zoom 9 mit echten Pixelstichproben | PASS: beide sichtbar, aber **keine vollständige Pixelgleichheit behauptet** |
| Vollständiges historisches Produktfrontend | Nicht als vollständige Anwendung geladen, sondern echte historische Funktionen im isolierten Browser-Prüfhaken | OFFEN |
| Vollständige V1-/V2-Mosaikwechsel im echten Browser | Nicht Bestandteil des isolierten Bildharness | OFFEN |
| Raster-Labor vollständige Browserinteraktion | Vorheriger Node-/DOM-Laufzeittest und bestehende UI-CI, keine neue vollständige Browser-/Pixelkette | OFFEN |

**Messdefinition:** Für jede historische/aktuelle Variante wurden im tatsächlichen gerenderten 640×420-Bild die Rotkanalwerte eines Niederschlagskerns, eines Bereichs außerhalb der Kante und eines Kantenstichpunkts erfasst. Der Test verlangt einen erkennbaren Kern außerhalb des Hintergrundes und für historisch/aktuell bei derselben z7-Referenz identische Werte an den drei Messpunkten. Die konkreten einzelnen Zahlen sowie die CSS-Filter-Zeichenketten je Modus stehen in der automatisch ausgegebenen `pixels.json` des oben verlinkten echten Browserartefakts; einzelne Messwerte werden ohne erneuten Download nicht erfunden.

Wichtig: Diese Prüftiefe ist **eine echte isolierte Browser-Bildabnahme** der drei historischen/aktuellen Profilfunktionen, aber **kein** historischer vollständiger HA- oder Karten-Ende-zu-Ende-Abnahmetest. Ein identischer z7-Pixelbefund ist nachvollziehbar, weil die ursprünglichen Profilfunktionen unverändert geblieben und die GR-WEICH-02-Interpretation des Auflösungsparameters gezielt entkoppelt wurde. Es ist kein pauschaler Beweis sämtlicher Nutzerbeobachtungen auf allen Quellen und Geräten.

## 4. Tatsächliche Commits und Dateien

| Commit | Inhalt |
| --- | --- |
| `ed1e5b03316ca65dbbf98668c6ba709327bf6650` | `scripts/test-gr-weich-04-browser-history.cjs`: echte historische und aktuelle Profilfunktionen, synthetisches PNG, Chromium-Pixelmessung, Screenshotbeweise |
| `df92fb55e1edbfacfb2d75626b98e44fb458e9d3` | `.github/workflows/shared-frontend.yml`: historischen Commit holen, Browservergleich ausführen, Bild- und JSON-Artefakte hochladen |
| `b15b55a382d88f5ba1a5aa3524293d73ffd83729` | Test-Versuch zur Behandlung historischer ES-Exportdeklarationen |
| `da37c7ab0ad273382ccd8e6201cb18a48e736fd0` | Funktionsfähige Korrektur der Export-Schlüsselwortverarbeitung im historischen Node-VM-Prüfhaken |

**Kein Produktionscode verändert:** `frontend/`, `dashboard/dist/` und `custom_components/gewitterradar/frontend/` bleiben bytegleich zum bestätigten GR-WEICH-03-Stand. Deshalb waren weder neue Frontend-Spiegel noch eine Änderung an `SHA256SUMS_FRONTEND.txt` fachlich nötig. Versionskennung V4.11.100 blieb bestehen. GR-WEICH-01/02/03-Tests wurden nicht abgeschwächt.

## 5. Echte CI-Läufe und Zwischenbefunde

Erster GR-WEICH-04-Browserlauf am Workflowcommit `df92fb55e1edbfacfb2d75626b98e44fb458e9d3`: [39580001510](https://github.com/TheDaimos/gewitterradar/actions/runs/39580001510), Frontend **failure** durch historisches `export`-Token im VM-Prüfhaken. Im Jobprotokoll erschien außerdem ein CDN-DNS-Fehler bei einem Playwright-Browserdownload (`ENOTFOUND playwright.download.prss.microsoft.com`), während die bestehenden Browserkomponenten nachfolgende Testschritte dennoch ausführten. Daher war **nicht** der Browser grundsätzlich nicht verfügbar, sondern der neue Prüfskript-Parser fehlerhaft.

Nach Korrekturen lief der echte historische Browser-Pixeltest erfolgreich im CI-Lauf [39580187819](https://github.com/TheDaimos/gewitterradar/actions/runs/39580187819); sein Bildartefakt wurde bestätigt (ID `12335114191`, 488658 Bytes, nicht abgelaufen). Die abgeschlossenen **Gesamtstatus** der drei Push-Workflows des endgültigen Testcommits `da37c7ab0ad273382ccd8e6201cb18a48e736fd0` werden im Schlussabschnitt nach erneutem GitHub-Abruf ergänzt.

## 6. Noch offene Abnahmen und unveränderte Sperren

1. **Vollständige historische Anwendung V4.11.81/82** aus Git in eigener Browserseite mit echten Modulabhängigkeiten ausführen und auf identischem Raster vergleichen. Der hier erfolgreiche echte Pixeltest der originalen historischen Profilfunktionen deckt gerade nicht automatisch vollständige Karten- und CSS-Pane-Lebenszyklen ab.
2. Echte Browser-Tests mit V1-Layer, V2-Mehrquellenmosaik und deren geladenen/abgebrochenen/verspäteten Kacheln, Kartenzoom/-bewegung, Regionen/Quellenwechsel und sichtbarem Pane ergänzen.
3. Raster-Labor Referenz/Versuch/Flächenverschmelzung/Schließen plus Filterrestauration und V1-/V2-Umschalten an sichtbaren Pixeln prüfen; bisherigen GR-WEICH-03-DOM-Vertrag beibehalten.
4. SVG-Mehrskalen- und CSS-Einzelfilter an weiteren Bildpunkten und unterschiedlichen Browserfamilien untersuchen, insbesondere Unterschiede in Skalierung, Alpha und NoData. Ein sichtbares SVG-Ergebnis beweist keine Gleichheit sämtlicher Filterfamilien.
5. **Nur bei belegtem Fehler** gezielte minimale Produktreparatur durchführen. Danach alle Frontend-Spiegel, Prüfsummen und CI-Push-Gates erneut verifizieren.

**Sperren:** Keine DRA-Installation, keine HA-DEV-/HA-PROD-Änderung, kein HA-REAL-PASS, kein PROD-PASS. Weder WeatherRouter noch V1-/V2-/UTC-/Authentifizierungs- und Sicherheitsverträge oder andere Wettereigenschaften wurden verändert.

**C.K. – Eine Idee weiter gedacht.**

## 7. Abschließende GitHub-Prüfung des finalen Testcommits

Die drei echten Push-Workflows von `da37c7ab0ad273382ccd8e6201cb18a48e736fd0` wurden nach Fertigstellung erneut über GitHub ausgelesen: **39580187744 completed/success** (Versions- und Einstellungsvertrag), **39580187721 completed/success** (Gewitterradar-Integration einschließlich vorhandener GR-WEICH-01/02/03-Verträge) und **39580187819 completed/success** (gemeinsames Frontend einschließlich des jetzt tatsächlich durchgeführten historischen Chromium-Pixeltests und des hochgeladenen PNG/JSON-Bildartefakts). Alle drei Ergebnisse sind damit **CI-PASS für den isolierten Teststand**. Kein HA-REAL-PASS und keine Freigabe der weiterhin offenen vollständigen Karten-/Raster-Labor-Ende-zu-Ende-Prüfung.
