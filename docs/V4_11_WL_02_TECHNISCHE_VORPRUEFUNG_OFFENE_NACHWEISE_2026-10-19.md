# WL-02 – Technische Vorprüfung und Nachweisschranken (19.10.2026)

**Status: BEGONNEN, NICHT ABGENOMMEN. Kein CODE-PASS, kein CI-PASS, kein HA-REAL-PASS. Keine neue DEV-Version.**

Auftragsgrundlagen vollständig gelesen: `V4_11_WL_01_KATALOGWAHRHEIT_VERTRAGSINVENTUR_2026-10-19.md` und `V4_11_WL_02_GENERIC_WR_RASTER_RENDERER_ENTWICKLUNGSAUFTRAG_2026-10-19.md`.

Verifizierte Repositorybefunde:
- `frontend/modules/weather/layer-menu.js`: `rendererId` akzeptiert ausschließlich `weather.precipitation.layer`; `_weatherLayerMenuToggle` ist ebenfalls darauf begrenzt; `_weatherLayerMenuProbe` liest die katalogisierten Fähigkeiten. Der übrige Menüzustand zeigt `verfügbar / Renderer folgt`.
- `frontend/modules/weather/consumer-client.js`: Consumer V1 kann beliebige öffentliche Fähigkeiten mit authentifiziertem HA-WebSocket und explizitem geografischem Kontext auflösen; `parseWeatherResolution` prüft für alle Raster `tile_url`, `tile_size`, `max_zoom`. Es garantiert jedoch durch die allgemeinen Prüfungen allein weder tatsächliche HTTPS-Kachelantwort noch vollständige Coverage- oder Zeitsemantik.
- `frontend/modules/weather/precipitation-layer.js`: Niederschlag setzt eigene Pane-, GridLayer-, Kachel-, Zuschnitt-, Lade-/Fehler- und Diagnoselogik um. Sie ist eng mit P7-010, Darstellung und Hintergrundfreigaben gekoppelt. **Diese Logik nicht durch das Einfügen eines neuen Capabilities-Zweigs verändern.**
- WR `custom_components/weather_router/consumer_capability_map.json`: `weather.satellite.clouds` und `weather.model.wind_10m.layer` sind als `raster_tile` deklariert; die Map ist `draft`, keine Echtantwort.
- Der vorhandene Wolkenintent garantiert kein numerisches Wolkenmaß und erlaubt eine fehlende Legende. Wind braucht fachliche Produktauszeichnung.

Prüfpflicht vor einer aktivierten Lieferung:
1. Tatsächliches V1-Resolve-Schema und Native-Grid/Tile-URL-Projektion mit repräsentativen zulässigen Antworten prüfen.
2. Unabhängige Ebene über bestehende Karteninstanz, separaten Pane, Zoom- und Coverage-Beschränkungen implementieren; kein P7-010-Rasterumbau.
3. Erfolgreiche Bildkacheln anhand des Ladeabschlusses zählen; `ready` allein nicht als gezeichnet markieren.
4. Menü mit eindeutigen Zuständen, Fehler-, Zeit-, Legenden- und Attributionsinformation verbinden.
5. Bestehende GR-Test- und CI-Verfahren tatsächlich ausführen und grün belegen, vor Versionserhöhung und Installationsfreigabe.

**Grenze dieser Prüfung:** Es wurde keine Home-Assistant-Live-Verbindung und keine ausführbare GR-Testumgebung benutzt. Ein bloßer GitHub-Dateiaufruf oder Testentwurf wird daher nicht als automatisierter Testnachweis ausgegeben. Produktive Aktivierung und Versionserhöhung sind weiterhin gesperrt, bis Implementierung und regressionsfeste Tests nachgewiesen sind. Keine WL-03-/WL-04-Änderungen.
