# GR-R04-OPERA-01 – Vertragsprüfung und sichere Integrationsvorbereitung

**Datum:** 22.10.2026 · **Repository:** `TheDaimos/gewitterradar` · **Zweig:** `deploy/dev` · **Ausgangsfassung:** V4.11.106 DEV · **Priorität:** P1

## Ergebnis und Entscheidungsgrenze

**R04 ist technisch untersucht, aber nicht als fertige OPERA-Bedienung implementiert.** Ein entscheidender, verbindlicher V2-Vertrag für die gezielte OPERA-Auswahl und Rasterfreigabe fehlt im tatsächlich gelesenen GR-Code. Eine funktionale OPERA-Karte wäre deshalb derzeit unbelegt; gemäß Auftrag werden **keine Daten ungeprüft als OPERA ausgegeben**. Keine installierbare Änderung, keine neue DEV-Version, **kein CI-PASS für R04**, **kein HA-REAL-PASS**, **keine DRA-V2-Installation**.

## 1. Bestandsanalyse der tatsächlichen Quellen

Gelesen auf `deploy/dev`:
- `docs/GR_R03_01_WIEDERAUFNAHME_QUALITAETSPRUEFUNG_DRA_V2_TESTKANDIDAT_2026-10-22.md`
- `frontend/modules/weather/precipitation-layer.js`
- `frontend/modules/weather/p7-010/raster-mosaic-consumer.js`
- `frontend/modules/weather/p7-010/raster-mosaic-contract.js`
- `frontend/modules/weather/p7-010/raster-mosaic-grid-layer.js`
- `frontend/modules/weather/p7-010/raster-mosaic-coverage.js`
- `frontend/modules/weather/p7-010/raster-mosaic-tile-loader.js`
- `frontend/modules/weather/display-menu.js`
- `frontend/modules/weather/layer-menu.js`

**Befund:** Der vorhandene V2-Verbraucher baut `weather_router/consumer/resolve_mosaic` mit `contract_version:2`, `capability:"weather.precipitation.layer"`, begrenztem `bbox` mit `focus`, Zeit-/Altersbudget, `limits`, optionalem `profile_id`, `consumer_id` und `correlation_id`. Der Code sagt ausdrücklich: *The V2 request never accepts any client-chosen provider list.* Derzeit gibt es **keinen nachgewiesenen expliziten Providerwunsch** und **keinen gesicherten OPERA-Rastervertrag**. `profile_id` darf nicht als erfundener OPERA-Selektor missbraucht werden.

Die vorhandene V2-Antwortprüfung verlangt unter anderem eindeutig identifizierbare `source_id`, `resource_type:"raster_tile"` und den bestehenden Zeit- und Semantikvertrag. Das Mosaik wird ohne eigenen Provider-Rangalgorithmus gerendert; Coverage ist geometrisch und **kein Nachweis gültiger nichttransparenter Niederschlagspixel**. Die bestehende UI im `display-menu.js` bietet Wetterebenenwahl *Niederschlag/Wolken*, vier Niederschlagsstile und Transparenz, Legende und aktive Ebenen. `layer-menu.js` besitzt den automatischen Niederschlags-Renderer und einen generischen Katalog, aber keine eigenständige freigegebene OPERA-Kachelroute.

**Konsequenz:** Eine OPERA-Option, die allein die bestehende automatische Mosaikantwort auf OPERA filtert, wäre keine saubere OPERA-Anforderung: Sie könnte OPERA weder gezielt anfordern noch garantieren, und sie könnte eine gültige alte Niederschlagslage beschädigen. Ein bloßer OPERA-Schalter ohne belegbaren Backendstatus wäre irreführend. Daher keine solche Scheinimplementierung.

## 2. Verbindliche Schnittstellenabstimmung WR-F7-L22

WeatherRouter muss verbindlich definieren oder bestätigen:

1. **Auswahlsyntax:** vertraglich dokumentiertes V2-Feld für eine explizite Rasterquelle *OPERA*, dessen konkrete Provider-/Produkt-ID und eindeutige Antwortzuordnung. Ohne Freigabe sendet GR keinen solchen Parameter.
2. **Providerstatus:** wie GR sicher `deaktiviert`, `aktiv_gesperrt`, `bereit_ohne_daten`, `raster_freigegeben`, `vorübergehend_nicht_verfügbar` und den konkret menschenlesbaren **Sperrgrund** abfragt. GR aktiviert und konfiguriert keinen Provider.
3. **Kachelberechtigung:** echte Freigabe ausschließlich für geprüftes OPERA-Produkt, UTC-Zeit, wissenschaftlich geprüfte Messsemantik, regionale Abdeckung, native Auflösung, Koordinaten, NoData-/Maske, Zugriff auf freigegebene Tile-Endpunkte, Sicherheit und Laufzeit.
4. **Diagnosefelder:** Provider-ID/-name, Produkt, Quellenkennung, `valid_at` (UTC), `age_seconds`, `freshness_class`, Pixel-/NoData-Gültigkeit (nur falls nachgewiesen), `source_id`, `correlation_id`, Geometrie/Zoom, Qualitätsstatus und Sperrgrund.
5. **Statusvertrag bei Verzögerung:** Wenn F7-L22 vorerst nur Verwaltung/Downloads/Diagnosen bietet, muss WR dies ausdrücklich von *raster_freigegeben* trennen. `partial` und ein antwortender Dienst beweisen keine OPERA-Tiles.
6. **Deaktivierung und laufende Aufrufe:** bestehendes Abbruch-/Generationsverfahren mit wirksamer Entwertung, keine Provideraktivierung durch GR, keine automatische Umetikettierung von DWD/NASA zu OPERA.

**Bereits ausreichend:** Basis-V2-Mosaik, Zeitbudget, Begrenzungen, Antwort-`layers`-`source_id`, Geometrie, validierte Tile-Vorbereitung, vorhandene Darstellung/Legende/Diagnoseereignisse. **Noch nicht belegt:** explizites Quellenrouting und statusbezogene OPERA-Freigabe einschließlich Sperrgrund und wissenschaftlicher Tile-Freigabenachweis.

## 3. Geplante konkrete Implementierung nach Vertragsfreigabe

Eine zusätzliche, bewusst gewählte Position `OPERA – Europäisches Niederschlagsradar` innerhalb der existierenden Wetterebenen-/Darstellungsverwaltung: Standard **aus**, Auto-Niederschlag bleibt unangetastet. Bei WR-deaktiviert zeigen: **„OPERA in WeatherRouter deaktiviert“**, keine Anfragen. Bei aktiv aber gesperrt exakten Sperrgrund zeigen, keine Tiles; bei aktiv ohne frische Daten entsprechenden belegten Zustand zeigen. Erst bei unabhängig bestätigter Freigabe den bestehenden V2-Mosaikverbraucher mit dem dann dokumentierten Selektor benutzen, nur OPERA-identifizierte gültige Antwort akzeptieren. Existierende vier Darstellungsstile, Transparenz, Legende und Positionsspeicherung weiterverwenden. Zeit- und Generationenprüfung einschließlich **R03 8-Sekunden-/3-Versuche- und 36-Sekunden-Watchdogvertrag** unangetastet.

Die OPERA-Anforderung darf **nicht** die normale Niederschlagsauffrischung blockieren. UI-Umschalten und Abbruch müssen Generation, pending-Kacheln und Token korrekt sperren. Fehlende/ungültige Tiles und NoData müssen als solche diagnostiziert werden; optisch scheinbar erfolgreiche, aber transparente Bilder sind **kein** wissenschaftlicher Qualitätsnachweis.

## 4. Verbindliche Tests vor Versionsanhebung

Automatisierte Testmatrix: Provider deaktiviert; aktiv, Tiles gesperrt; bereit ohne Daten; explizit freigegebene V2-OPERA-Antwort; ungültige/fehlende Tiles; NoData/Transparenz; Auto↔OPERA; Kartenbewegung und Quellenwechsel; Abbruch bei Deaktivierung; R03-Kaltstart unverändert; drei gleichwertige Frontend-Spiegel und SHA-256-Verzeichnisse; Desktop-/Android-Bedienbarkeit. Synthetische Tiles **nur** als ausdrücklich synthetische Testfixtures. Vollständiger CI-Nachweis einschließlich festem `head_sha` vor DRA-Freigabe.

## 5. Installations- und Sicherheitsstatus

**Kein installierbarer R04-Testkandidat erzeugt.** Die V4.11.106-Entwicklung bleibt unverändert. Vier durch den Betreiber beobachtete normale Seitenneustarts unter zehn Sekunden sind positive R03-DEV-Beobachtungen, jedoch kein OPERA-Realtest. Auf VM 109 nur nach separater Betreiberentscheidung, mit konkretem Codecommit, vollständiger DRA-V2-Dateivorschau, Versionsvergleich, rückspielbarer Sicherung und Neustartplan installieren. **HA PROD VM 101, WeatherRouter-Code und dessen Providerstatus sowie native Rasterio/GDAL/PROJ-Bibliotheken wurden nicht verändert.** GR V1/V2, UTC-Vorgaben, OPERA-Sperre, R03-Hotfix und existierender Auto-Renderer bleiben geschützt.

## 6. Übergabe an WR-F7-L22

**Bitte den dokumentierten V2-OPERA-Quellenauswahlvertrag, den Providerstatus einschließlich Sperrgrund sowie ein klar prüfbares Raster-Freigabefeld mit erlaubtem Tile-Endpunkt und den erforderlichen Metadaten in einer verbindlichen Gegenantwort auf `weather-router-dev@deploy/dev` bereitstellen.** Ohne diesen Vertrag kann GR sicher nur eine gesperrte OPERA-Statusdarstellung erstellen, nicht jedoch eine korrekt benannte echte OPERA-Karte.

**Nachweisgrenze:** Diese Arbeitsrunde hat ausdrücklich **keinen implementierten OPERA-Schalter, keine OPERA-Produktdarstellung, keine neuen Testläufe und keine neue GR-Version** erzeugt. Die nächste Stufe ist die sichere, produktive UI-Implementierung nach geklärtem Vertrag und anschließende statische/CI-Prüfung.

**C.K. – Eine Idee weiter gedacht.**
