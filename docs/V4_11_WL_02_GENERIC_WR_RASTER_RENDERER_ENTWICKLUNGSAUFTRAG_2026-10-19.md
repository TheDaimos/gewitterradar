# V4.11-WL-02 – Allgemeine WeatherRouter-Rasterdarstellung für Wolken und Wind

**Verbindlicher Entwicklungsauftrag · 19.10.2026**  
**Projekt:** Gewitterradar, ausschließlich `TheDaimos/gewitterradar@deploy/dev`  
**Basis:** V4.11.99 DEV, WL-01-Dokumentationscommit `ca0f7ea69e5ad433aee1c4a5210edfb32088f464` (kein zusätzlicher produktiver Code).  
**WeatherRouter-Gegenstelle:** V0.10.161 DEV, `TheDaimos/weather-router-dev@deploy/dev`. **WR-Code nicht ändern.**  
**Status:** **WL-02 FREIGEGEBEN**, unter den nachstehenden fachlichen Gültigkeits- und Abnahmeschranken. **WL-03 und WL-04 NICHT FREIGEGEBEN.**

## 0. Verbindliche Lesereihenfolge

1. `docs/V4_11_WL_01_KATALOGWAHRHEIT_VERTRAGSINVENTUR_2026-10-19.md` vollständig.
2. `docs/V4_11_WEATHER_ROUTER_NICHT_NIEDERSCHLAG_LAYER_AUDIT_UND_AUFTRAG_2026-10-19.md`.
3. `frontend/modules/weather/layer-menu.js`, `consumer-client.js`, `display-menu.js`, `precipitation-layer.js` und bestehende Raster-/Kachel-/Zeit-/Hintergrundmodule und Regressionen vollständig im nötigen Umfang.
4. WR V1-Vertrag `TheDaimos/weather-router-dev/docs/CONSUMER_API_V1.md`, relevante JSON-Schemas und aktuelles `consumer_capability_map.json`. Der Quellcode-/Runtime-Vertrag hat Vorrang vor der als `draft` gekennzeichneten Zuordnung.
5. Aktuelle GR-/WR-Commits und vorhandene Test-/CI-Nachweise prüfen; nicht von veralteten Zwischenständen ausgehen.

## 1. Ziel und fachliche Grenze

In Gewitterradar sollen neben Niederschlag erstmals **eigenständig schaltbare, tatsächlich gezeichnete** WeatherRouter-V1-`raster_tile`-Wetterebenen verfügbar sein. Erste Ziele:

- **Wolken-/Satellitenraster:** `weather.satellite.clouds`, über WeatherRouter providerneutral (z. B. DWD/EUMETView, falls real geeignet).
- **Wind 10 m:** `weather.model.wind_10m.layer`, mit tatsächlich korrekter Wind-/Modellsemantik (z. B. ICON, falls real geeignet).
- Weitere geeignete Satellitenprodukte (z. B. True Color oder Infrarot) **nur dann als optionale Erweiterung innerhalb WL-02**, wenn der bestehende V1-Vertrag, die echte Quellenprüfung und die zusätzlichen Darstellungsarten dies sicher zulassen; keine schleichende Erweiterung auf alle Katalogprodukte.

**WL-03 (UV, Wolkenanteil, Windgeschwindigkeit, Temperatur als Punktwerte) bleibt getrennt.** Ein `value` ist kein Kartenraster, und aus einer punktuellen Prognose darf keine flächige Datenebene erzeugt werden. **WL-04** (Gefahren, Ereignisse, Bildfolgen, Planetenkacheln) bleibt ebenfalls getrennt.

Keine neue Raster- oder Provider-Routingarchitektur. Keine Provider-Namensfälle in der GR-Auswahl. Bestehender V1/V2-Niederschlag ist unveränderlich geschützter Funktionsbestand.

## 2. Phase A – WR-V1-Contract und Dateneignung beweisen

Vor produktiver Aktivierung für jede Pilot-Capability mindestens folgendes nachweisen:

- Authentifiziertes `discovery`, `capabilities`, dann `resolve` per vorhandenem `createWeatherRouterClient` (WebSocket `weather_router/consumer/resolve`, Vertrag 1), mit explizitem geografischen Kontext `bbox` und `time:{mode:"latest"}`. Korrelation und Verbraucherkennung für Diagnose setzen, ohne personenbezogene Rohkoordinaten öffentlich zu speichern.
- Rohantwort fachlich unterscheiden: `status:ready` + `resource.type:raster_tile` + tatsächlich zulässiger `resource.payload`, oder `status:unavailable` mit `unavailable.code`. Katalog-`available` ist kein Live-Datennachweis.
- Für Raster u. a. `tile_url`, `tile_size`, `min_zoom/max_zoom`, Projektion/Tile-Schema, `provenance.spatial_coverage` bzw. andere tatsächlich belegte maschinenlesbare Coverage, `provenance.attribution`, `freshness.data_time/fetched_at/age_seconds/stale`, `resource.semantics`, etwaige Legende/Zeitleiste und deren **optionalen** Charakter prüfen. Gewitterradar darf optional fehlende Pflichtbeweise **nicht** frei erfinden.
- Gültigen tatsächlichen Bildabruf anhand repräsentativer Kacheln, Cross-Origin-Eigenschaften, Bildauflösung, Transparenz, geografische Bildpassung, Zuordnung der physikalischen Größe und Nutzungs-/Attributionsbedingungen prüfen, soweit im Entwicklungs-/Testkontext möglich.
- Bei fehlender HA-Live-Verbindung: reale Antworten **nicht** behaupten; produktiven Adapter anhand vorhandener Schemata und kontrollierter Testantworten absichern, hinter strengen Vertrags-/Verfügbarkeitsprüfungen implementieren und erst im folgenden Benutzer-HA-Test als **HA-REAL-PASS** werten. Bei einem konkret fehlenden oder unklaren WR-Vertragsfeld eine präzise, private GR→WR-Rückfrage erstellen und betroffene Ebene nicht als fertig ausgeben. Kein künstlicher WR-Providerfehler und kein erfundenes Bild.

**Grundregel:** Runtime-Vertragssicherheit und gegenwärtige Lieferfähigkeit sind verschiedene Nachweise. Ein erfolgreiches synthetisches Kachelbild beweist keine echte WR-Abdeckung.

## 3. Phase B – Allgemeiner V1-Rasteradapter im bestehenden Gewitterradar

Implementiere eine **isolierte, wiederverwendbare** WetterRaster-Anbindung, die bereits validierte, von WeatherRouter serverseitig ausgewählte V1-`raster_tile`-Ressourcen in Leaflet/Kartendarstellung überführt.

- Provider- und produktneutral: WR liefert die Auswahl. GR zeichnet ausschließlich freigegebene und geprüfte Ressourcen. Keine Providerreihung nach ID, Region oder unerlaubte lokale Kopie des WeatherRouter-Routings.
- Getrennte Kartenebenen und Zustände je Capability, darunter `aus`, `lädt`, `bereit`, `keine Daten`, `teilweise`, `fehlgeschlagen`. **Katalogisiert** ist kein `bereit`; Schalter `Ein` ist kein Kachelnachweis.
- Sichtbarer Ein-/Ausschalter für Wolken und Wind sowie Anzeige von Quelle, fachlicher Produktbezeichnung, UTC-Datenzeit/-alter, Beobachtung/Modell/Prognose, Attribution, Legende falls vorhanden und gültig, Deckungsgrenzen und begründetem Fehlerstatus.
- Pro Ebene kontrollierter Lebenszyklus: Karte wechseln, Zoom/Overzoom nur nach nachgewiesenen Rasterparametern, Abdeckung verlassen, Einwilligung/Berechtigung ändern, Browser in Hintergrund/Vordergrund, nach WebSocket-Ausfall wiederherstellen, gleichzeitige Ladevorgänge begrenzen, veraltete Antworten beim neueren Kartenausschnitt sicher verworfen.
- Kein Aufzeichnen alter globaler Bilder über nicht belegte Regionen; keine Ausdehnung einer regionalen Kachel durch falsche Georeferenzierung; keine Darstellung alter Modell-/Satellitenbilder als aktuelle Radarmessung.
- Ressourcenschonung: ausdrücklich begrenzte Bild-/Kachelanfragen, gemeinsame oder kontrolliert getrennte Budgets mit Niederschlag, Abbruch veralteter Requests, klar geregelte Aufbewahrung/Entfernung, keine endlosen Poll-Schleifen, sichere URL-Verarbeitung und keine Geheimnisse im Diagnoseexport.
- Wolken, Wind und Niederschlag müssen getrennt schaltbar sein; mehrere aktivierte Ebenen dürfen nicht versehentlich doppelt geladen oder bei Fehlern gegenseitig gelöscht werden. Visuelle Stapelung, Deckkraft und Benutzerbedienung nachvollziehbar; mobile Nutzbarkeit (Android/iPad), Firefox und bekannte Vollbild-/Fensteransichten schützen.
- Nicht alle Satellitenbilder besitzen eine numerische Legende; fehlende Legende daher **nicht automatisch** als Vertragsfehler behandeln. True Color, Infrarot, Staub, Feuertemperatur, Wolkenkomposit und Wind fachlich unterschiedlich ausweisen.

## 4. Phase C – Menüwahrheit und Diagnose

- In `weather.layer-menu` die bisher auf Niederschlag begrenzte `rendererId`-/`_weatherLayerMenuToggle`-Bindung für die **tatsächlich implementierten** V1-WetterRaster-Capabilities ergänzen. Andere Einträge dürfen weiterhin ehrlich `Renderer folgt` zeigen, aber nicht als schaltbare, bereits zeichnungsfähige Kartenebene erscheinen.
- Keine zweite Menüstruktur; bestehende Wetterbereiche und Bedienoptik erhalten. Auf kleinen Bildschirmen insbesondere Titel, Schalter, Rollbarkeit und Rücknavigation prüfen.
- In den bestehenden Wetter-Engine-Diagnosen je Renderercapability relevante Phasen protokollieren: Anfrage/Korrelation, V1-`ready`/`unavailable`, Quelle, fachliche Zeit/UTC, Gültigkeitsklasse, Coverage, verworfene/geladene/gezeichnete Kacheln, Gründe für Fehler/Abbruch/Wechsel; nur begrenzte und bereinigte Daten.
- Anzeige klar zwischen `im Katalog`, `Renderer implementiert`, `V1-Antwort ready`, `Bildkachel geladen`, `Ebene gezeichnet`, `Ebene eingeschaltet` und `aktueller visueller Zustand` unterscheiden. Keine erfundenen Bildpixelbeweise.

## 5. Tests und auslieferbare Version

Mindestens folgende Regressionen im produktiven Aufrufpfad, soweit automatisierbar:

1. V1-Resolve: gültiges Wolkenraster, gültiges Windraster, Ablehnung ungeeigneter Response-Typen und Vertragsfelder, `unavailable`/Coverage-/Berechtigungs-/Zeitfehler.
2. Tile-URLs, Projektion, räumlich begrenzte Coverage, Zoom/Overzoom, CORS-/Ladefehler, Transparenz, Kachelbudget und echter Kachelabschluss statt bloßer Antwortverfügbarkeit.
3. Ein-/Aus-Schalter, mehrere gleichzeitige Ebenen, Layerwechsel, harte Abbrüche, schnelle Kartenwechsel, überholte Korrelationskennungen, Hintergrund-/Vordergrundwechsel, Wiederverbindung, Teilfehler.
4. Zeit-/Semantikbeweis für Satellitenbeobachtung und ICON-Modellwind, richtige Legenden-/Attributionspolitik.
5. Vollständiger V4.11.99-Bestandsschutz: P7-010 NASA/DWD V2, V1-Fallback, GR-RF-01 bis RF-04, 900-/43.200-s-UTC-Regel, geografischer Löschschutz, Radarplayer, Zoom, Android-/iPad-/Firefox-Darstellung, CI/DRA-Paketkontrolle.

**Auslieferung erst nach bestandenem Quellcode- und CI-Nachweis** in einer einzigen klar versionierten neuen DEV-Version, ausschließlich `deploy/dev`, mit vollständigen Frontend-/Backend-/DRA-Spiegeln, Prüfsummen, Laufzeitkennung und Änderungshinweisen. Keine unzuverlässigen Mini-Versionen. Private WR-Koordination nach `TheDaimos/weather-router-dev@deploy/dev/docs/p7-010-coordination/`; private Rohdiagnosen nur nach `TheDaimos/Project-Log-And-Export`.

**HA-Realabnahme nach Installation:** pro aktivierter Wetterart mindestens eine korrelierte echte V1-`ready`-Antwort, tatsächlich erfolgreich geladene/gezeichnete Rasterkachel und korrekter fachlicher/zeitlicher/Deckungsstatus. Kein `HA-REAL-PASS` aus GitHub-CI oder simulierten Rasterkacheln. Falls kein realer WR-Provider verfügbar ist, explizit `blockiert` bzw. `Realtest offen` melden.

## 6. Abschlussantwort

Erst nach kompletter Bearbeitung:

- Geprüfte Ausgangscommits, konkret veränderte Module, neues Release/Commit.
- Nachgewiesene tatsächliche WR-V1-Verträge oder klar benannte offene Live-Beweise.
- Unterstützte Raster-Capabilities; ausdrücklich abgelehnte/nicht unterstützte Produkte.
- Resultate für alle automatisierten Regressionen und CI mit Links.
- Transparenter DRA-Installationsstand und zielgerichteter HA-Testplan (Wolken, Wind, Niederschlag-Regressionsschutz).
- `CODE-PASS`, `CI-PASS` und `HA-REAL-PASS` getrennt; Nichtbeobachtetes als offen.
- WL-03 (numerische Punktwerte) und WL-04 (weitere Darstellungen) bleiben außer Auftrag.

**Führe die technische Prüfung und anschließende geeignete Implementierung vollständig selbstständig aus. Keine Routine-Zwischenberichte, kein neuer Zweig, keine unnötigen Rückfragen. Falls Pflichtvoraussetzungen fehlen, dokumentiere präzise die echte Blockade statt Daten oder Erfolgsmeldungen zu erfinden.**

**C.K. – Eine Idee weiter gedacht.**
