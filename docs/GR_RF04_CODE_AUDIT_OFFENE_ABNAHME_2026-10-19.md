# GR-RF-04 – vorläufige Codeprüfung (19.10.2026)

Repository: `TheDaimos/gewitterradar`, Zweig `deploy/dev`. Ausgangs-HEAD vor diesem Dokument: `1c79ec5746232937b5dc34490084b896853f6c5a`.
Status: **CODE REVIEW PARTIAL; weder CODE-PASS noch CI-PASS noch HA-REAL-PASS für GR-RF-04**.

## Tatsächlich geprüfte Stellen

- `frontend/modules/weather/p7-010/raster-compositor.js`: `rasterMosaicRenderOrder` zeichnet ältere Satellitenschätzungen vor anderen ausgewählten Quellen; `drawVerifiedRasterMosaicTile` ruft das Canvas-`drawImage` für die bestätigten Quellbereiche auf, ohne eine Pixelanalyse zu behaupten.
- `frontend/modules/weather/p7-010/raster-mosaic-tile-loader.js`: `render_order` der Kacheln wird aus `drawn.drawn` nach der tatsächlichen Zeichnung abgeleitet.
- `frontend/modules/weather/p7-010/raster-mosaic-grid-layer.js`: Kacheldiagnosen werden nach Lade-/Zeichenversuch weitergereicht; `image_pixels_verified: false`.
- `frontend/modules/weather/precipitation-layer.js`: `observedOrders` wird nur für Kacheln mit nichtleerem `render_order` erweitert. Im Ereignis `v2_layer_swapped` ergibt sich `render_order_verified` nur bei `observedOrders.length>0`; `v2_draw_audit` enthält keinen solchen Wahrheitswert. Eine Ereignismeldung mit gleichzeitig `observed_draw_orders: []` und `render_order_verified: true` ist aus dieser konkreten Ereignisbildung nicht ableitbar. Deshalb Diagnoseverarbeitung, Exportzusammenfassung, Ereignistyp und Korrelation vor Eingriff prüfen.
- `decideV2RegionalRetention` und `_weatherRadarRetainRegionalMosaic` implementieren bereits eine begrenzte Zurückhaltung; `scripts/test-p7-010-rf-02.mjs` enthält produktionsnahe Prüfungen zu Frist, Wiederholung und Ablauf. Die vollständigen sieben GR-RF04-Fehlerfolgen sind damit noch **nicht** nachgewiesen.

## Offene Prüfung und Abnahme

1. Korrelierte Rohereignisse `v2_draw_audit` und `v2_layer_swapped` gegen Exportaggregation vergleichen; Ereignisdatum, Typ und Korrelation beibehalten.
2. Quelle/Komposition/Draw-Order anhand der jeweiligen Tile-Diagnosen vergleichen; `drawImage` beweist keine meteorologischen Niederschlagspixel.
3. Produktionenahen RF02-Ablauf einschließlich mehrfach `coverage_timeout`, Zeitgeber, `outside_coverage`, Einwilligungswiderruf, Quellenalter und Wiederherstellung getrennt testen, ohne WR oder echte Provider zu stören.
4. Vor Freigabe alle 20 GR-RF04-Fälle und bestehenden RF01–03-/Zoom-/Frontend-/Integrationsregressionen ausführen; Frontend-Spiegel, DRA-Herkunft, Prüfsummen und Versionskennungen nur bei tatsächlicher Änderung vollständig synchronisieren.
5. Realtestnachweise ausschließlich im privaten `TheDaimos/Project-Log-And-Export` sichern.

Es gab bislang **keine** Quellcodekorrektur, keine Versionserhöhung und keinen neuen CI- oder HA-Nachweis. Erfolgreiche frühere Realtests und deren Bestandsschutz bleiben unangetastet.
