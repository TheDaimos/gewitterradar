# GR → gemeinsame Koordination: WL-02 fortgesetzt – Zeichenstatus, UTC-Zeitvertrag und Regressionen

**19.10.2026 · `TheDaimos/gewitterradar@deploy/dev`**  
**Zweck:** Verbindliche Entwicklungsantwort auf die vollständig gelesene private Koordinationsgegenantwort `TheDaimos/weather-router-dev@deploy/dev/docs/p7-010-coordination/KOORDINATION_AN_GR_WL02_CI_PASS_WEITERARBEIT_MD_EINZEILER_2026-10-19.md`.  
**Vorgeschriebene Übergabe:** Auch diese vollständige Antwort liegt als echte Markdown-Datei im GR-Repository und ist dem Benutzer ausschließlich mit einem **verifizierten, ausgeschriebenen GitHub-Direktlink als Einzeiler** weiterzureichen. Die Regel `REGEL_GR_WR_ENTWICKLUNGSANTWORTEN_MD_GITHUB_DIREKTLINK_2026-10-19.md` ist gelesen und bleibt auch für künftige Antworten verbindlich.

## 1. Geprüfter Ausgangsstand und unangetastete Verträge

**Ausgangs-HEAD GR:** `7ec9bc70c182452c748dce869988d4432357f221` (reiner Dokumentationsstand; letzter zuvor geprüfter Quellcode `6cef4a11804d01d8ee411f9020cc2c70b85c8a62`). **Verifikation:** aktuelle `deploy/dev`-Dateien sowie die Koordination und bestehenden GR-Aufträge wurden direkt aus GitHub gelesen.  
**Produktstand bleibt:** Gewitterradar **V4.11.99 DEV**, Runtime `41199r1`, Modulmenü `weather.layer-menu` **1.1.5** – **keine** neue installierbare DEV-Version, keine DRA-Freigabe.  
**Gegenstelle:** `TheDaimos/weather-router-dev@deploy/dev` (separater Entwicklungsstrang, keine Änderungen durch diesen Auftrag).

**Bereits als erledigt anerkannt und nicht erneut programmiert:** WL-02-V1-Basis, `spatial_coverage` als Objekt/Global/Antimeridian, Graceful Teardown/Generationen, Leaflet-Ladefehler, XYZ-/EPSG:3857-WMS-Helfer, 300-Sekunden-Vordergrundaktualisierung, Link zur externen HTTPS-Legende, Manifest-/HA-/Dashboard-Dateiidentität und SHA-256-Reparatur. Früheres CODE-/CI-PASS auf `6cef4a11` (Läufe `39315494673`, `39315494642`, `39315494702`) bleibt bestehen, **ist jedoch keine Abnahme der nachfolgenden Korrektur**.

## 2. Neue konkrete Fehler und implementierte Korrekturen

### A. „Karte aktiv“ trotz vollständig ausgeschnittener, transparenter Kacheln

**Nachgewiesener Codefehler vor Korrektur:** Im `L.gridLayer`-Pfad von `frontend/modules/weather/layer-menu.js` wird beim Tile-Crop `rects.length===0` absichtlich ein leeres transparentes Canvas via `done(null,canvas)` abgeschlossen. `tileload` zählte diese Kachel bisher als `loaded`. Das Leaflet-`load`-Ereignis meldete bei `loaded>0,failed=0` irreführend `ready` / „Karte aktiv“, auch wenn **keine einzige Canvas-Zeichenoperation** stattgefunden hatte.

**Korrektur:** Für jeden Ladezyklus werden die nach `ctx.drawImage` abgeschlossenen Canvas-Elemente über ein lokales `WeakSet` von vollständig ausgeschnittenen/transparent zurückgegebenen Canvas-Kacheln unterschieden. Der Abschluss zählt getrennt `loaded`, `drawn`, `skipped`, `failed`; ein vollständiger Zyklus ohne `drawn` wird **nicht mehr** `ready`. Wenn `failed>0` und `drawn=0`, ist der Status `failed`, nicht `partial`. Ein partieller Status benötigt mindestens eine tatsächlich ausgeführte Zeichnung und einen Fehler. Die reine Zustandszuordnung ist zusätzlich als `genericRasterCycleStatus` unit-testbar.

**Ehrliche Abnahmegrenze:** `drawn` bedeutet **erfolgreich durchgeführter `drawImage`-Aufruf**, **nicht** wissenschaftlich gültige oder nichttransparente Datenpixel. Auch eine inhaltsleere Quellbildkachel kann als Canvas-Zeichenoperation abgeschlossen werden. Der echte Pixelinhalt und NoData-/Quellenqualität bleiben Teil der HA-Realabnahme; keine falsche Pixelverifikationsbehauptung.

### B. Explizite Zeitversätze wurden trotz gültiger UTC-Bedeutung abgewiesen

**Nachgewiesener Fehler:** Im ursprünglichen UTC-Suffix-RegExp des generischen Rasteradapters war `\d` doppelt maskiert. Gültige Zeitstempel mit explizitem numerischen Offset (z. B. `2026-10-19T15:40:00+02:00`) fielen deshalb durch die Vertragserkennung, obwohl sie dieselbe UTC-Zeit wie `2026-10-19T13:40:00Z` bedeuten.

**Korrektur:** `parseGenericRasterUtc(value)` nimmt ausschließlich explizit zeitzonenbehaftete, mit `Date.parse` gültige Zeitstempel an und liefert ein ISO-`Z`-Format zurück. Positive und negative numerische Offsets werden normalisiert. Naive Zeitstempel, ungültige Offsets, unlesbare Strings und leere Werte werden **fail-closed** abgelehnt. Der reale Rasterpfad nutzt denselben normalisierten `valid_at` sowohl beim Vertragstest als auch für die Anzeige. Die Quelle selbst wird nicht umgeschrieben und `fetched_at`/S3-`Last-Modified` niemals zu `valid_at` umgedeutet.

**Abnahmegrenze:** Zentraler WR-Providerzeitvertrag und fachliche Frischegrenzen bleiben ausschließlich bei WR; GR respektiert weiterhin die explizite WR-`freshness.stale`-Sperre. Daraus folgt **keine** Lockerung der 900-s-Radar-Grenze oder der gesonderten 43.200-s-NASA-Opt-in-Regel.

### C. Regressionen, Spiegelsynchronisierung und echte Prüfsummen

- `scripts/test-v411-weather-router.mjs`: Neue assertions für `drawn=0,failed=0` → `unavailable`, `drawn=0,failed>0` → `failed`, `drawn>0,failed=0` → `ready`, `drawn>0,failed>0` → `partial`; belegte `WeakSet`-/Crop-/Ereignisintegration; `Z`, `+02:00` und `-04:00` werden nach UTC normiert; naive, syntaktisch unzulässige und uninterpretierbare Zeitangaben werden zurückgewiesen.
- Dasselbe `modules/weather/layer-menu.js` nach jeder Änderung in **alle drei** Auslieferungsvarianten geschrieben (`frontend`, `custom_components/gewitterradar/frontend`, `dashboard/dist`); direkte GitHub-Baumprüfung bestätigte bytegleiche Blobs der vier relevanten Auslieferungsdateien einschließlich Manifest und Hauptlader.
- Die zwei betroffenen Einträge in `SHA256SUMS_FRONTEND.txt` wurden anhand der **tatsächlichen neuen Quellbytes** neu berechnet; keine hartkodierten Soll-Summen.

**Korrekturcommits (Auszug, in zeitlicher Folge):**
- `40bf02c5f9bfb6ab39349772194279f628de3c0f` / `974bf0e9f001aa9554ae6e5a288019b6aa8ed9c9` / `a6db5523a398c9d19d72d88ccc6892ab9bdf3002` – erster Draw-Status-Fix in drei Spiegeln.
- `c848ff44553dd40930e739b3e57ffe04ce99dd79` – Zustands- und Integrationsregressionen.
- `d7434ddf6fd23fbbce55129f6822f5072872d4fc` – explizite numerische Zeitzonen-Regex-Reparatur; später durch gemeinsame UTC-Normalisierung abgelöst.
- `ea587a3e7a2fcfeb3283b0188f09bebc4091f224` / `e18e9873e44f7ab1f40e4151b759dd8fd04c1804` / `7e5753d6d3cf64148e3eb2fea705ece728fadc0f` – einheitliche UTC-Normalisierung im selben produktiven Modul in drei Spiegeln.
- `f9f4ed6c402d28a1cbdeb7889835dd6453ae5fa7` – positive/negative Offset-/Naivzeit-Regressionsprüfungen.
- **Zuletzt geänderter Programm-/Prüfsummen-HEAD**: `ed7e696819bcf92fc5102c6bc34716f9bde8fc93`.

## 3. Öffentliche CI – konkrete zugehörige Läufe

**Getesteter Programm-HEAD:** `ed7e696819bcf92fc5102c6bc34716f9bde8fc93`. Kein älterer grüner Lauf wird als neue Abnahme dargestellt.

| Workflow | GitHub-Lauf | Stand bei Erstellung, bis zur erneuten tatsächlichen GitHub-Rücklese nachziehen |
|---|---|---|
| V4.11.99 settings navigation and runtime identity | [39318858688](https://github.com/TheDaimos/gewitterradar/actions/runs/39318858688) | **SUCCESS** |
| Validate Gewitterradar integration | [39318858618](https://github.com/TheDaimos/gewitterradar/actions/runs/39318858618) | **SUCCESS**, alle vier Jobs (package-contract, hacs-integration, hassfest, home-assistant-runtime) erfolgreich |
| Validate shared Gewitterradar frontend | [39318858714](https://github.com/TheDaimos/gewitterradar/actions/runs/39318858714) | **IN PROGRESS zum ursprünglichen Berichtsentwurf**; finalen Status per GitHub abrufen und oben nur anhand tatsächlicher Nachweise aktualisieren |

Das ursprüngliche Manifest-/Spiegelproblem ist in der früheren **3/3-SUCCESS**-Prüfung vollständig behoben. Für diesen neuen Quellcode ist **vollständiger CI-PASS erst bei tatsächlich abgeschlossenem drittem Job** zu bestätigen.

## 4. Was noch offen ist / exakter weiterer Entwicklungsauftrag

1. **WL-02 HA-REAL-PASS ausstehend:** Im echten Home Assistant zwei korrelierte WR-Consumer-V1-Antworten für `weather.satellite.clouds` und `weather.model.wind_10m.layer` erheben, mit tatsächlichem `status=ready`, `resource.type=raster_tile` sowie gesicherten Canvas-/Netzbilddaten. Wenn eine Capability real nicht liefert: fachlich als `unavailable` oder `blocked` dokumentieren, **nicht** durch erfundene `tile_url`/Mockbilddaten „reparieren“.
2. **Bildinhalt und räumlicher Zuschnitt:** Native XYZ-/WMS-Projektion, CORS, überdeckte und leer ausgeschnittene Kacheln, temporär fehlende Daten, Pixeltransparenz/NoData und echte Quelle/UTC/Qualität/Lizenz/Legende im Browser und auf Android/iPad/PC real prüfen. Der neue `drawn`-Zähler beweist keine gültigen realen Datenpixel.
3. **Laufzeit/Lebenszyklus:** Ein-/Aus-Schalten beider Ebenen, gleichzeitige Ebenen, Neustart, Schnellwechsel, Sichtbarkeit, Kartenbewegung/Zoom, neuer Frame, Verbindungsunterbrechung, Abbrüche, zeitliche Veralterung und Rasterüberlagerung mit bestehendem Niederschlag tatsächlich abnehmen.
4. **Globale Ressourcenobergrenze:** Bisher **nur** getrennte Obergrenze von 8 gleichzeitig aktiven WL-02-Bildanforderungen; **kein** gemessener gemeinsamer CPU-/RAM-/Netzbudget-PASS zusammen mit dem P7-010-Niederschlagsplaner. Vor DRA-Freigabe Realmessungen und ggf. bereits vorhandene Scheduler-Koordination entwerfen, ohne eine zweite Mosaik-/Providerarchitektur.
5. **Regressionsschutz:** GR-RF-01 bis RF-04, V1/V2-DWD-/NASA-/UTC-/Coverage-/Profil-/Opt-in-Schutz; insbesondere echter GR-RF-04-`coverage_timeout`-Verlaufsfall separat offen. OPERA-F14/Bearer-`fetch`→`Blob`→lokale `blob:`-URL liegt **ausschließlich im separaten WR/GR-Integrationsgate**, nicht stillschweigend in WL-02.
6. **Produktversionsschritt/DRA:** Keine neue Anwendungsversion allein wegen erfolgreicher automatisierter Tests. Bei vollständigem CODE-/CI-Kandidaten später ein **einziges konsistentes DEV-Update** samt Manifest, Modulversionen, HA-/Dashboard-Spiegeln, Laufzeitkennung, Prüfsummen, DRA-Nachweisen und Benutzer-HA-Testvorlage erstellen. HA-REAL-PASS nur mit echter Installation und Korrelation bestätigen.

## 5. Wahrheitsgemäße Freigabeentscheidung

| Freigabe | Ergebnis |
|---|---|
| Konkreter CODE-PASS für dokumentierte Draw-Status-/UTC-Korrektur | **JA – Quellcode in drei Auslieferungsbäumen implementiert, zusätzliche direkte Regressionen vorhanden; Browser-CI-Prüfung siehe Abschnitt 3** |
| Vollständiger öffentlicher CI-PASS für aktuellsten Code | **Nur wenn auch der dritte Workflow wirklich SUCCESS ist; vor Abschluss OFFEN** |
| Vollständiger WL-02-HA-REAL-PASS | **NEIN** |
| DRA-/Installationsfreigabe | **NEIN** |
| WeatherRouter-Provider-/OPERA-Codeänderungen | **KEINE** |
| WL-03 / WL-04 | **WEITERHIN NICHT FREIGEGEBEN** |

Der Auftrag bleibt für echte Browser-/WR-/HA-Realabnahme und gemeinsamen Ressourcenschutz **aktiv**. Kein künstlicher Abschluss, keine private Diagnose im öffentlichen GR-Repository. Private Export2Git-Rohdaten gehören ausschließlich in `TheDaimos/Project-Log-And-Export@main`.

**C.K. – Eine Idee weiter gedacht.**
