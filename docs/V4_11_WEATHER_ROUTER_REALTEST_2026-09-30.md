# V4.11.01 DEV – reale WeatherRouter-Consumer-Prüfung (30.09.2026)

Status: **Erster realer lesender Ende-zu-Ende-Test anhand der vom Nutzer gelieferten Home-Assistant-Screenshots bestanden. Keine vollständige fachliche/API-/Karten-/Fallback-Abnahme.**

## Technische Ausgangslage

- Gewitterradar V4.11.01 DEV, Modulsatz `E411-01A3`, 24/24 geladene Module, 0 Modulabweichungen; `weather.consumer-client` V1.0.2 ist geladen.
- Vorangegangener Befund: DRA-Installation war aktuell, die Android-Companion-App zeigte zunächst noch V4.10.02 mit 23/23 Modulen und einem installierten Modulsatz `E411-01A3`. Nach Aktualisierung des Frontend-Ladevorgangs belegte der Nutzer anhand eines Diagnoseexports V4.11.01 / 24/24 und `stale:false`. Eine explizite versionsspezifische Cachekennung aller Module bleibt künftiges Versions-Gate.
- Consumer-Nutzung ist read-only und greift nur über die öffentliche WeatherRouter-Consumer-API V1 auf die Home-Assistant-Verbindung zu.

## Sichtbarer Live-Befund der Weather-Engine

1. Nach `Verbindung prüfen`: `WeatherRouter bereit · Consumer API V1 · 70 verfügbare Wetterfähigkeiten im Katalog.` Die Anzeige ist nach aktuellem Adaptercode auf `domains:['weather']` gefiltert und ist weder die Anzahl aller Public-Capabilities noch ein regionaler Verfügbarkeitsnachweis jeder einzelnen Capability.
2. Nach `Abfragen` für den aktuellen Kartenausschnitt:
   - Niederschlag: Ressource `raster_tile`; Anbieteranzeige `Deutscher Wetterdienst (DWD)`; angezeigtes Alter 248 Sekunden.
   - Zusätzliche Blitzbeobachtungen: Ressource `event_feed`, **0 Ereignisse**; Anbieteranzeige `FMI - Lightning Open Data`. Die leere Liste ist kein Serverausfallnachweis, keine Garantie für Gewitterfreiheit und kein Nachweis globaler Abdeckung.
   - Amtliche Warnungen: Ressource `hazard_feed`, **65 Ereignisse**; angezeigte Quellen `Deutscher Wetterdienst (DWD), NOAA / National Weather Service`. Die bloße Feed-Länge beweist **nicht**, dass 65 Warnungen für den aktuellen Kartenmittelpunkt oder den überwachten Standort relevant sind. Räumliche Überdeckung, Gültigkeitszeit und Filter-/Fallback-Kontext müssen vor einer Kartenwarnung einzeln geprüft werden.

## Nachweisumfang / Grenzen

Die Screenshots bestätigen erfolgreiche Discovery, gefilterte Katalogabfrage und erfolgreiche Resolve-Anfragen für drei Datenklassen mit Ressourcentyp-/Quellenanzeige. Noch NICHT durch den Test bestätigt: korrekte Ausgabegeometrien, Tile-URLs im Leaflet-Renderer, Provider-Attribution/Legende, tatsächliche regionale Abdeckung, Warnpolygonfilterung, Satellitenlayer, deduplizierte/blitzsemantisch vergleichbare Zusatzbeobachtungen, automatische Ersatzversorgung, Persistenz im Backend, Android/iPad-Vollabnahme und DRA-Rollback.

Aktueller Adapter verwendet für die drei Anfragen `bbox`, ansonsten `point`, ansonsten `global` je gemeldeter Spatial-Capability. Bei einer `global`-Fallback-Anfrage darf eine Rückgabe nicht als bereits geographisch gefilterte lokale Warnlage dargestellt werden. Event-Freshness, Provenienz und `routing.degraded` weiterhin sichtbar halten.

## Umsetzung nach Test

- Zuerst fachlich sichere Darstellung: Niederschlag als separat ein-/ausschaltbare transparente Kartenebene mit Quelle, Alter, Attributionspflicht, Legende und Schichtreihenfolge; nur mit validierter Tile-Geometrie und im tatsächlich abgedeckten Gebiet.
- Danach Warnereignisse nach Polygon/Geometrie, Gültigkeitszeit, betroffener Region und Ereignistyp räumlich filtern; die 65 Rohereignisse nicht ungeprüft als lokale Warnungen melden.
- Ergänzende Blitzbeobachtungen getrennt vom Blitzortung-Ereigniszähler darstellen; `0` nicht als Fehler behandeln. Deduplizierung und Quellabhängigkeit gesondert spezifizieren.
- Versions-/Browser-Zwischenspeicherkennungen fortschreiben und automatische Gleichlaufprüfung für Hauptdatei, Modulimporte, Manifest, DRA und Diagnose einführen.
- Kontrollierte Ersatzversorgung, Monitored Areas und gemeinsame Bewertung erst nach separater fachlicher Abnahme.

## Schutzregeln

V4.10 FINAL / `v4.10` bleibt unverändert. DRA verwendet ausschließlich `deploy/dev`; dieser Dokumentationsstand ist keine automatische DEV-Auslieferung und keine API-V1-Finalfreigabe.
