# Gewitterradar V4.11.91 – P7-010 HA-Diagnose nach WR 0.10.155
**17.10.2026 · reale Geräte-/Serverdaten; kein vollständiger gemeinsamer P7-010-REAL-PASS**

## Basis und Herkunft
- GR-Weather-Engine-Export des Nutzers: `generated_at=2026-10-17T14:04:33.004Z`; GR V4.11.91, Build `V4.11.91-DEV-2026-10-17`.
- Der vom Nutzer parallel per Export2Git angelegte **WR 0.10.155 / Loader 158**-Diagnoseexport ist nicht Teil dieses öffentlichen Repositories. Er wurde korrelationsbezogen ausgewertet und WR-intern separat dokumentiert. Keine privaten Rohwerte, Kennungen von Benutzerkonten oder Provider-Zugangsdaten in GR speichern.
- API-Discovery `ready:true`, Niederschlagskarte eingeschaltet, aktive API V2. Der Nutzer hatte 12-h-Satelliten-Opt-in aktiviert. Installationsidentität WR aus tatsächlichem Export bestätigt; Manifest `0.10.0` ist nur die allgemeine Integrationsmanifestversion.

## Echte NASA-V2-Vertragsprüfung – bestanden
Der WR-Monitor liefert 23/23 V2-Anfragen `partial` mit genau einem qualifizierten älteren NASA-IMERG-Layer, `nasa_gibs/satellite_precipitation_imerg_30min`. Ein älteres Bild mit UTC-`valid_at=2026-10-17T08:30:00Z` und etwa 5 h 32–5 h 34 Datenalter wird nur mit ausdrücklich übermitteltem `max_background_age_seconds=43200` zusammen mit `max_data_age_seconds=900` angenommen. `coverage_scope=bbox`, `coverage_verified:true`, `older_background`, `older_satellite_background`, `observation_kind=estimate`, `satellite_precipitation_estimate` fachlich korrekt. Kein pauschales 12-h-Fenster für Radarquellen.

In der GR-Kartenlaufzeit tatsächlich `validated → viewport_coverage → staged_tiles_actual_coverage → raster_ready → active`:
- `gr-p7-mvcgvpi0-81`: **14:03:33.862Z**, Zoom **3**, sechs sichtbare/komplett gezeichnete Kacheln, keine geometrische Lücke, V2-Ebene aktiv.
- `gr-p7-mvcgwko3-128`: **14:04:14.488Z**, Zoom **6**, sechs sichtbare/komplett gezeichnete Kacheln, keine geometrische Lücke, V2-Ebene aktiv.
- Letzter Zustand: `api_version:2`, `mosaic_status:partial`, eine NASA-Quelle, `layer_present:true`, `layer_mounted:true`, `zoom:6`, `visible_tiles:6`, `uncovered_tiles:0`.

**Grenze:** `image_pixels_verified:false` in den Screenshots-freien Diagnosen; geometrisch vollständig gezeichnete Canvas-Kacheln belegen keine nichttransparenten Regenpixel. Dies ist ein echter NASA-V2-Vertrags-/Renderaktivierungsbeleg, **kein** NASA+DWD-/Pixel-REAL-PASS.

## Noch fehlende DWD-V2-Ebene
Alle 23 WR-V2-Antworten enthalten **0 DWD-Layer**. Auch bei der finalen GR-Deutschlandansicht (Zoom 6, BBOX west 4.72, süd 49.80, ost 12.99, nord 53.93) bleibt NASA allein; WR meldet allgemein `Einige regionale Coverage-Anfragen waren nicht nutzbar.` Keine verdeckte DWD-Bereichsausdehnung durch GR. Die WR-Analyse läuft in der privaten Koordination, da allein WeatherRouter Quelle, Coverage und Routing beurteilen darf.

## Zwei vom Nutzer markierte sichtbare Störungen
- **14:03:40.939Z**: Zoom 3; `gr-p7-mvcgvpi0-81`. Direkt vorher um 14:03:33: V2 erfolgreich und gezeichnet. Die Markierung meldet `layer_present=true`, eingebundenes Kartenpanel und sichtbare Deckkraft; sie kann tatsächliche Pixel-/NoData-Lücken nicht bestätigen oder widerlegen.
- **14:04:14.286Z**: Zoom 6; `gr-p7-mvcgwko3-128`. Der Marker liegt rund **202 ms vor** dem folgenden `raster_ready`/`active`-Ereignis. Eine Übergangslücke bzw. verzögerte Schichtbereitschaft ist daher als mögliche Erklärung separat zu prüfen.
- Monitor `event_count=219`, Ringpuffer 160, 59 überschrieben; beide Markierungen mit separaten Ereignisfenstern gespeichert. `displayExtended=true`.

## Belastung / GR-spezifische Folgethemen
- Im sichtbaren Ringpuffer **45** Kachelablehnungen `request_budget_exhausted`: 35 auf `gr-p7-mvcguwkz-28`, weitere 10 auf `gr-p7-mvcgvpi0-81`, Zoom 3–6. Diese sind **GR-Renderer-Budget**-Ereignisse, keine WR-Provider-Ablehnungen.
- Im jüngsten V2-Ereignisfenster **neun** `stale_after_response` nach beschleunigter Kartenbewegung; die V2-Antwort benötigt real meist etwa drei Sekunden. Vierzehn `refresh_started` im sichtbaren Monitor, viele `viewport_changed`.
- Nutzerseitig `viewportRefreshIntervalSeconds=2` (in allen aktuellen `refresh_started.interval_s=2`). Der dokumentierte Standardwert ist **15 Sekunden**; der 2-s-Wert ist für diesen Test eine bewusst oder versehentlich verkürzte Einstellung, nicht der Quellcode-Standard.
- Codeprüfung `src/p7-010/raster-mosaic-grid-layer.js` + `raster-mosaic-tile-loader.js`: das endliche Anfragebudget wird **einmal pro V2-Raster-Snapshot** vergeben. Häufiges Schwenken kann auf einem weiterhin aktiven, älteren Snapshot das Budget vollständig verbrauchen, während neue V2-Serverantworten wegen erneut geänderter BBOX bewusst verworfen werden. Bildlöcher sind plausibel; nicht allein aus der Ereignismeldung als Pixelverlust bewiesen.
- Zweiter CODE-Befund: `frontend/modules/weather/precipitation-layer.js::_setWeatherRadarOlderSatelliteBackground` fordert beim Ausschalten des Opt-in zwar sofort neue Daten an, behält aber eine bereits sichtbare ältere V2-Satellitengrundlage zunächst bei. Die `_weatherRadarPreviousValid`-Prüfung schützt diese bei späteren V1-Austauschen, entfernt sie jedoch nicht unmittelbar beim Widerruf. **Vor Opt-in-AUS-Realtest gezielt absichern**, einschließlich bereits laufender V2-Anfragen; Sicherheits-/Einwilligungsregeln nicht aufheben.

## Verbindliche nächsten Abnahmen (ohne Versionssprung)
1. Zunächst WR-Ursache der fehlenden DWD-Regionaldaten anhand desselben deutschen Sichtfeldes im WR-Projekt untersuchen. GR nicht durch eigene Providerpriorisierung ersetzen.
2. Für einen reproduzierbaren stabilen Kartenversuch das Intervall testweise auf **15 s** zurücksetzen, Karte nach einem Schwenk für die vollständige WR- (~3 s) und Kachelvorbereitungszeit ruhen lassen. Kachelbudget- und Layerdiagnose mit Marker korrelieren.
3. Nach DWD-Korrektur NASA-V2-Basis + aktuelles regionales DWD in einem gemeinsamen gezeichneten Mosaik mit demselben `correlation_id` real abnehmen; Randkontakt und Zoom 12–17 nachziehen.
4. Unmittelbares Widerrufen von Opt-in-AUS und Weiteranzeige älterer Quellen als getrennte GR-Vertragsregression korrigieren und testen; dann Code/Spiegel/Prüfsummen/Version/DRA in **einem** gebündelten Release synchronisieren. Nicht still an 4.11.91 patchen.
5. Leere Canvas-Kacheln und Budgetverbrauch bei langen Kartensitzungen gesondert diagnostizieren; Snapshot-Budget nicht einfach unbeschränkt erhöhen. Sichtbarer Regen kann weiterhin nicht allein aus der BBOX bewiesen werden.

**Status:** NASA-V2-Laufzeitpfad bestätigt; NASA+DWD-Mosaik OFFEN, gemeldete Pixel-/Bildstörungen OFFEN, Opt-in-AUS-Widerruf ohne HA-Nachweis und CODE-seitig korrekturbedürftig.

*C.K. – Eine Idee weiter gedacht.*
