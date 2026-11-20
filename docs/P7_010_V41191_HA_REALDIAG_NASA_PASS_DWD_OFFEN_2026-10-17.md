# Gewitterradar V4.11.91 – P7-010 Realdiagnose und nächste Abnahme
**17.10.2026 · öffentlicher technischer Status ohne private HA- oder WR-Exportrohwerte**

## Bestätigter Fortschritt
Ein neuer Home-Assistant-Diagnosedurchlauf mit **Gewitterradar V4.11.91** und **WeatherRouter V0.10.155 / Loader 158** bestätigt, dass der bestehende V2-Validator die von WR verifizierte weltumspannende NASA-IMERG-Produkt-BBOX als **ausdrücklich freigegebene ältere Satellitenschätzung** akzeptiert und die Canvas-Mosaikebene aktivieren kann.

Die ältere Grundlage bleibt `coverage_scope:bbox`, `coverage_verified:true`, `freshness_class:older_background`, `quality_note:older_satellite_background`, `observation_kind:estimate`. Aktuelle Radarzeit bleibt auf **900 Sekunden** begrenzt; älterer Satellitenhintergrund erfordert ausdrückliches `max_background_age_seconds:43200`. Das V2-Vertragsergebnis kann `partial` sein, obwohl die Bildgeometrie des angefragten Ausschnitts vollständig ist. Der technische Nachweis betrifft Kartenanbindung und Zeichenflächen, nicht nichttransparente Wetterpixel.

**Noch nicht real abgenommen:** gleichzeitige NASA-V2-Grundlage und frischer regionaler DWD-Layer, DWD-Randkontakt, optisch korrekte Bildpixel, Zoom 12–17 auf allen Geräten sowie der Opt-in-AUS-Widerruf.

## Diagnostisch festgestellte Probleme
- In der jüngsten Sitzung wurde eine NASA-V2-Grundlage aktiviert, während frische regionale DWD-Überlagerung weiterhin fehlte. Die **WR-seitige Ursachenprüfung** erfolgt ausschließlich im privaten WR-Koordinationsbereich; kein GR-eigenes Providerrouting nachbauen.
- Bei häufigem Schwenken/Zoomen wurden vom GR-Renderer `request_budget_exhausted` und `stale_after_response` protokolliert. Der aktuelle Nutzerwert des Aktualisierungsintervalls lag deutlich unter dem standardmäßigen 15-s-Wert. Diese Ereignisse sind nicht mit Provider-Ausfall oder gemessener Pixeltransparenz gleichzusetzen.
- Der neue sitzungsbezogene Darstellungsmonitor bewahrt Nutzermarkierungen mit den benachbarten Ereignissen und meldet Kartenanbindung, Zoom, Kachelzahlen, Layerwechsel sowie `image_pixels_verified:false`. Geladene Canvas-Kacheln sind kein Beleg für tatsächlich sichtbare Niederschlagspixel.
- **Quellcodebefund für einen späteren gebündelten Fix:** `frontend/modules/weather/precipitation-layer.js::_setWeatherRadarOlderSatelliteBackground` startet beim Ausschalten der 12-h-Einwilligung eine neue Abfrage, behält aber eine bereits gezeichnete ältere Satellitengrundlage bis zur erfolgreichen weiteren Schichtverarbeitung zunächst bei. Zusätzlich müssen bereits laufende Antworten der alten Einwilligung verworfen werden. Vor dem HA-Test für Opt-in AUS müssen die Einwilligungs- und Zeitvorgaben strikt durchgesetzt und regressionsgeprüft sein.
- `src/p7-010/raster-mosaic-grid-layer.js` und `src/p7-010/raster-mosaic-tile-loader.js` vergeben das endliche Bildanfragebudget **einmal je V2-Snapshot**. Langes Schwenken kann das Budget dieser weiterhin aktiven Ebene erschöpfen, während neu angefragte Snapshots bei erneuter Kartenbewegung verworfen werden. Der Renderer darf keine unbeschränkten Anfragen erzeugen; Leerkacheln müssen als solche erkennbar bleiben.

## Verbindliche Arbeitsreihenfolge
1. Vorhandenen NASA-Welt-BBOX-Hotfix nicht erneut implementieren. Den fehlenden regionalen DWD-Beitrag anhand privater, korrelierter WR-Serverbelege untersuchen und nur im zuständigen WR-Projekt korrigieren.
2. Stabilen Kartenvergleich bei normalem 15-s-Aktualisierungsintervall wiederholen; erst nach Ablauf der WR-Antwort- und Bildkachelzeit werten. Schnelle Kartenwechsel als getrennten Leistungs-/Darstellungstest betrachten.
3. Nach WR-Korrektur NASA+DWD als gemeinsames V2-Mosaik abnehmen; danach DWD-Rand, V1-Fallback, Zeitbudget, Opt-in AUS und Zoom 12–17 testen.
4. GR-seitigen Widerrufs-/Budgetlebensdauerbefund mit Regressionen bearbeiten; alle Frontend-Spiegel, Versionierungen, Laufzeitprüfsummen, DRA-Provenienz und erforderlichen Prüfungen **in einem** gebündelten Release synchronisieren.
5. Kein `P7-010 REAL-PASS` allein wegen `active`, `partial`, BBOX-Vollabdeckung oder bestandener CI behaupten. Private Exportdaten bleiben in der privaten Projektkoordination.

**Status:** GR→WR-NASA-V2-Vertrag im HA-Laufzeitpfad bestätigt. Vollständige gemeinsame P7-010-Realabnahme OFFEN.

*C.K. – Eine Idee weiter gedacht.*
