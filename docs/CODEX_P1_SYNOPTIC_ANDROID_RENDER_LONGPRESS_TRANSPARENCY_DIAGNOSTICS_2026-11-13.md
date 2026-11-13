# Codex-P1 – Synoptik auf Android tatsächlich darstellen und bedienen

**Ausführung statt Bestandsaufnahme.** **Keine Anhänge, Screenshots, Bilddateien oder Bildreferenzen erforderlich.** Vorhandenes Icon unverändert aus dem Repository verwenden. **Budget:** nur ca. 10 % Codex-Wochenkontingent; eng begrenzte, funktionsorientierte Reparatur; kein Full-Repo-Refactoring.

## Ausgangspunkt und Schutz

- Basis ist der **aktuelle** `TheDaimos/gewitterradar@deploy/dev`-HEAD (zum Zeitpunkt der Auftragserstellung `b04944edcc99838d54d88e84aed4f14c30981c81`), GR **4.11.206 DEV / HA 0.25.113**. Zuerst aktuellen tatsächlichen HEAD prüfen.
- WeatherRouter `TheDaimos/weather-router-dev@deploy/dev`: **0.10.322 DEV / Loader 325**. **WR zunächst nicht verändern**, solange keine konkret nachgewiesene API-Ursache vorliegt.
- **PROD HA VM101 unangetastet**, nur installierbare **HA DEV VM109**. Geschützte Referenz WR 0.10.320 / GR 4.11.195 erhalten.
- **Bereits repariert und auf realem Android bestätigt:** Synoptik als **fünfte Eye-Funktion** gespeichert und aktivierbar. Diese persistierte Slot-Zuordnung, eigene Farbe, Settings Vault, bestehende vier Funktionen, Aura, ungruppierte Icon-Positionen, Gesten, Wind-/Temperatur-/Niederschlagsmodule niemals resetten oder regressieren.
- Quellrichtlinien `AGENTS.md`, `docs/PROJECT_BOOTSTRAP.md`, `docs/MODULE_PROVIDER_ISOLATION_GUARD_2026-11-13.md` respektieren.

## Reale Android-Fehler nach Installation von GR 4.11.206 + WR 0.10.322

1. Synoptik kann per Icon eingeschaltet werden, **aber keinerlei H/T-/Isobaren-Geometrie erscheint auf der Karte**.
2. **Long-Press** auf das Synoptik-Icon öffnet **kein eigenes Synoptik-Premiummenü** (sowohl einzeln frei platziert als auch als fünfte Eye-Funktion prüfen); Short-Tap und Drag dürfen nicht vertauscht werden.
3. Im **vorhandenen zentralen Transparenz-/Darstellungsmenü** fehlen bzw. funktionieren die Synoptik-Steuerungen nicht; hier müssen die vorhandenen Einträge für Gesamt-Synoptik, H/T, Isobaren tatsächlich erreichbar, sichtbar und bedienbar sein. Für Fronten-Grenze, Frontensymbole, Neon existieren bereits vorbereitete Opazitätsdomänen – diese erhalten, kein verfrühter Umbau.

### Beleg aus aktuellem V2-Diagnoseexport

GR-Wetterengine-JSON vom **2026-11-13T16:52:57.789Z**: GR **4.11.206**, WR Discovery **bereit/kompatibel**, WR **0.10.322**. Der Export enthält **null Erwähnungen von `synoptic`**; die vorhandenen Consumer-Exchanges sind Discovery/andere Wetterfunktionen. **Das ist noch kein Beweis, dass GR nie eine Synoptik-WS-Anfrage gesendet hat**, weil das Exportformat den neuen Pfad möglicherweise nicht protokolliert. Diagnostik für die Ursache schaffen, keine voreilige WR-Schuldzuweisung.

Vorherige reale WR-Tests: Capability `weather.synoptic.pressure_centers` liefert ECCC-H/T-GeoJSON, `weather.synoptic.isobars` NOAA-GFS-GeoJSON; `weather.synoptic.fronts` NOAA WPC nur regional und ohne verifizierte Symbolseite. GR darf keine erfundenen Frontzeichen zeichnen.

## Sehr konkrete Untersuchungsstellen (keine übergreifende Analysephase)

- `frontend/modules/weather/synoptic-display.js`: `_resumeWeatherSynoptic`, `_weatherSynopticQueue`, `_weatherSynopticFetch`, `parseSynopticFrame`, `_weatherSynopticRender`, `_weatherSynopticEnsureToggle`, `_weatherSynopticOpen`, `_weatherSynopticEnsureUi`.
- `frontend/modules/core/card-lifecycle.js` und `frontend/gewitterradar.js`: Installations-/Resume-Reihenfolge und tatsächliche Leaflet-Initialisierung (`s.map`, `s.L`, Map-Events, Shadow DOM, Suspends/Detaches).
- `frontend/modules/weather/eye-hub.js`, `eye-hub-registry.js`, `eye-hub-model.js`, `eye-hub-view.js`: sowohl fünftes gruppiertes Eye-Bubble-Icon als auch einzelner `weather-synoptic-toggle`; Event-Handler von `_weatherDisplayBindEyeDrag` dürfen Long-Press nicht schlucken oder als Drag/Klick fehlinterpretieren.
- `frontend/modules/weather/display-menu.js`: Synoptikregler in bestehender Transparenzoberfläche wirklich erzeugen, Events anbinden, Werte synchronisieren und auf Synoptiklayer anwenden.
- `frontend/modules/diagnostics/map-diagnostics.js`: **bestehenden** Kartendiagnose-JSON-Export um kleinen, redaktierten `synoptic`-Block erweitern, **kein neues Tool bauen**.

## Umsetzungspflichten

### A – Datenpfad und Kartendarstellung

Direkt und rückverfolgbar verifizieren: `Map attached → Synoptic resume → Leaflet loaded → visible → WS request dispatched → WS response status → parse/validation → geographic intersection → layer construction → layer attached/rendered`.

- Jede Teilfunktion (centers, isobars, fronts) unabhängig behandeln; ein nicht verfügbarer WPC-Provider darf ECCC/NOAA-GFS nicht blockieren.
- Prüfe die WS-Requestform `weather_router/consumer/resolve_synoptic` mit `contract_version:2`, realem Karten-`bbox`, `time:{mode:'latest'}`, optionalem Profil; verifiziere die Antwortform gegen **aktuellen WR-V2-Vertrag**, nicht gegen Annahmen.
- Status `off/not-loaded/loading/ready/unavailable/error` differenzieren. Leere Geometrie, fehlende Providerabdeckung und abgelaufene Gültigkeit nicht als erfolgreicher Render behaupten.
- Beseitige ausschließlich belegte Fehler in Lifecycle, API, Dateninterpretation, Layer-Anbindung oder Sichtbarkeit. Keine feste GR-900s-Freshness-Grenze; WR bleibt Gültigkeitsautorität.
- Falls der Fehler vom aktuell sichtbaren deutschen Kartenausschnitt oder regionaler NOAA-WPC-Abdeckung abhängt, das ausdrücklich diagnostizieren und ECCC-H/T sowie NOAA-GFS-Isobaren getrennt nachweisen.
- UI-/Farbänderungen ausschließlich lokale bereits geladene Geometrien neu stylen, keine zusätzlichen WS-Calls.

### B – Long-Press und Premium-Menü

Die Synoptik muss ihr eigenes existierendes `weather-synoptic-panel` mittels **Long-Press** öffnen – sowohl gruppiert im Eye als auch ungruppiert. **Short-Tap** schaltet nur Sichtbarkeit; Drag bleibt Drag. Bewährte Premium-/Pointer-Behandlung wiederverwenden. Kein zusätzliches unsichtbares Overlay darf die Geste abfangen. Schließen, Verschieben, Minimieren, Chevron und Android-Scrollbarkeit erhalten; keine neue parallele Gestenlogik erfinden.

### C – Zentrale Transparenz

Mit dem bestehenden zentralen Darstellungs-/Transparenzmenü zusammenhängend und tatsächlich sichtbar integrieren:
- Synoptik gesamt, H/T, Isobaren (persistiert und auf Renderer wirksam).
- `0 %` unsichtbar, `100 %` vollständig sichtbar; keine doppelte Anwendung von Opazität.
- Gespeicherte Werte zwischen eigenem Synoptik-Menü und zentralem Transparenzmenü synchron halten.
- Vorbereitete `frontLineOpacity`, `frontSymbolOpacity`, `neonOpacity` erhalten und dort anzeigen, wo vorhandene funktionsfähige Komponenten dies erlauben; keinen von echten Daten unabhängigen Fronten-Erfolg vortäuschen.

### D – Bestehende Kartendiagnose erweitern

Kompakter `synoptic`-Snapshot **im vorhandenen Diagnoseexport**:
- GR-/WR-Version, Modul geladen, Map/Leaflet angebunden, Overlay sichtbar, Menü geöffnet, letzte Short-/Long-Press-/Drag-Entscheidung (ohne personenbezogene Daten).
- Pro Capability `requested/started/completed`, `ready/unavailable/error`, WR-Fehlercode, Provider, `model_run/valid_at/valid_until`, angeforderte BBOX (ggf. gerundet), Featureanzahl und Layeranzahl; falls nie gestartet, Grund.
- Drei getrennte effektiv wirksame Opazitäten und Registrierung im zentralen Menü.
- **Keine Tokens, vollständige private URLs, Koordinaten des Nutzerstandorts in hoher Präzision oder GeoJSON-Massendaten** in den Export schreiben. Vorhandenen JSON-Export weiter nutzbar lassen.
- Erzeuge nur wenige, leicht verständliche Statusfelder; bestehende Export2Git-Infrastruktur verwenden, nicht neu bauen.

## Tests, Versionspaket, Abschluss

1. **Gezielte** automatisierte Regressionen für WS-V2-Request/Antwort, Lifecycle/Attach/Resume, passende GeoJSON-Darstellung, Long-Press im fünften Eye-Slot + einzeln, Short-Tap/Drag-Trennung, zentrale Transparenzsteuerung, Settings-Vault-Persistenz. Besonders keine Regression des bereits behobenen 5.-Slot-Problems.
2. Bestehende gezielte Synoptik-CI, Settings-Vault-CI und Paket-/Spiegel-Konsistenz laufen lassen. **Keine vollständige Archivprüfung, keine 237er WR-Testreihe**. Noch vorhandene unabhängige Gesamt-CI-Fehler knapp dokumentieren, nicht als Synoptik-Erfolg verbuchen.
3. Jede Quelländerung **neu und eindeutig versionieren**, inklusive HA-/Frontend-/DRA-Metadaten und Spiegel `frontend`, `custom_components/gewitterradar/frontend`, `dashboard/dist`. Nur `deploy/dev`; PROD unverändert.
4. **Kein Bedarf an Bildanhängen**. Master-Original ausschließlich aus `artwork/help-icons/hires/gr-synoptic-high-low-isobars-premium-original.png` verwenden.
5. Abschließend Markdown-Bericht unter `docs/` auf `deploy/dev`: tatsächliche Ursachen, konkrete Fixes und Dateien, neue Version, Commits, CI-Links, **welcher Test tatsächlich ausgeführt wurde**, welcher VM109-/Android-Realschritt noch aussteht. Keine „fertig“-Behauptung ohne echte Laufzeitbestätigung.

**Arbeite die Reparatur eigenständig fertig und veröffentliche den installierbaren DEV-Fix. Keine Zwischenstopps zur Freigabe, keine neue großflächige Analyse.**
