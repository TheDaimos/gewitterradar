# P7-010 – Gewitterradar: vollständige providerneutrale Intent-Matrix (Bestandsaufnahme)

**Stand:** 14.10.2026 · **Status:** P7-010 ACTIVE, Bestandsaufnahme und Zuordnung vorbereitet; **keine Consumer-Migration freigegeben**.

## Quellen und Geltungsbereich

- Gewitterradar: `TheDaimos/gewitterradar`, `deploy/dev`, Quell-HEAD `2a3e4136e983b4ab701616e0508784b14bb40bcf`, tatsächlich registrierte **33 Module**, Build **V4.11.74 DEV**; Manifest SHA `effbfec3ef5bcbe92c87a1d401b1fb4b1e576576`.
- WeatherRouter: `custom_components/weather_router/consumer_capability_map.json`, SHA `1c38373d382609e5a32aa5386bf4c05ab54369c3`, Consumer API V1 mit 227 öffentlichen IDs.
- Kanonisch: `docs/ROUTING_SCHLACHTPLAN.md`, `docs/THEMEN_UND_ROUTING_STRATEGIE.md`, `docs/CONSUMER_API_V1.md`, `docs/CONSUMER_PROFILES_V1.md`.

Der direkte Gewitterradar-Entwicklungszweig `feature/v4.11-development` steht zum Inventurzeitpunkt noch auf V4.11.68, der produktive DRA-Zweig auf **V4.11.74**. Ein unkontrollierter Merge würde neuere Arbeit überschreiben. Deshalb in diesem Schritt **keine Änderung an Gewitterradar-Quellcode oder DRA**.

## Abdeckung des Gewitterradar-Modulbestands

| Modulgruppe | Module | Rolle |
|---|---:|---|
| Kern | 7 | Lokale Bedien-/Laufzeitlogik |
| Vollbild | 1 | Lokale Bedien-/Laufzeitlogik |
| Oberfläche | 6 | Lokale Bedien-/Laufzeitlogik |
| Instrumente | 5 | Lokale Bedien-/Laufzeitlogik |
| Diagnose | 3 | Lokale Bedien-/Laufzeitlogik |
| Datenquellen & Verbindungen | 2 | Lokale Datenquellen und Diagnose |
| Standort & Radien | 1 | Lokale Bedien-/Laufzeitlogik |
| Karte | 2 | Lokale Bedien-/Laufzeitlogik |
| Weather-Engine | 5 | Consumer-API und Wetterdarstellung |
| Verlauf | 1 | Lokale Bedien-/Laufzeitlogik |
| **Summe** | **33** | Kein Modultyp vergessen |

## Funktionszuordnung

| Gewitterradar-Fachfunktion | Public Capability | Resource | Status |
|---|---|---|---|
| Niederschlag als Kartenebene | `weather.precipitation.layer` | `raster_tile` | `implemented` |
| Amtliche Gewitterwarnungen | `weather.warning.official` | `hazard_feed` | `prepared_only` |
| Amtliche Hagelwarnungen | `weather.warning.official` | `hazard_feed` | `migration_pending` |
| Amtliche Tornado- und Wasserhosenwarnungen | `weather.warning.official` | `hazard_feed` | `migration_pending` |
| Amtliche Fallböen- und Sturmwarnungen | `weather.warning.official` | `hazard_feed` | `migration_pending` |
| Amtliche Starkregenwarnungen | `weather.warning.official` | `hazard_feed` | `migration_pending` |
| Amtliche Superzellenwarnungen | `weather.warning.official` | `hazard_feed` | `migration_pending` |
| Gewitterzellen-Nowcast-Kartenebene | `weather.convection.thunderstorm_cells` | `raster_tile` | `migration_pending` |
| Gewitterwahrscheinlichkeit der nächsten Stunde | `weather.point.thunder_probability` | `value` | `migration_pending` |
| Zusätzliche beobachtete Blitzereignisse | `weather.lightning.observed.events` | `event_feed` | `prepared_only` |
| Beobachtete Blitzdichte (10-Minuten-Raster) | `weather.lightning.observed.density` | `raster_tile` | `prepared_only` |
| Entfernung zum nächsten beobachteten Blitz | `weather.lightning.observed.nearest_distance` | `value` | `expert_only` |
| Richtung zum nächsten beobachteten Blitz | `weather.lightning.observed.nearest_azimuth` | `value` | `expert_only` |
| Weitere Blitzdichte | `weather.lightning.density` | `raster_tile` | `expert_only` |
| Optische Satellitenblitze als Raster | `weather.lightning.satellite.mtg_li.accumulated_flashes` | `raster_tile` | `expert_only` |
| Satellitenblitze als Datei (Ost) | `weather.lightning.satellite.glm_east.lcfa` | `data_file` | `deferred_adapter` |
| Satellitenblitze als Datei (West) | `weather.lightning.satellite.glm_west.lcfa` | `data_file` | `deferred_adapter` |
| Niederschlagswert am Punkt | `weather.point.precipitation` | `value` | `migration_pending` |
| Niederschlagssumme der Stunde | `weather.point.precipitation_1h` | `value` | `migration_pending` |
| Niederschlagswahrscheinlichkeit | `weather.point.precipitation_probability` | `value` | `migration_pending` |
| Kurzfristige Niederschlagsrate | `weather.nowcast.precipitation_rate` | `value` | `expert_only` |
| Wolkenkarte | `weather.satellite.clouds` | `raster_tile` | `migration_pending` |
| Bewölkung am Punkt | `weather.point.cloud_cover` | `value` | `migration_pending` |
| Tiefe Wolken | `weather.point.cloud_cover_low` | `value` | `expert_only` |
| Mittlere Wolken | `weather.point.cloud_cover_mid` | `value` | `expert_only` |
| Hohe Wolken | `weather.point.cloud_cover_high` | `value` | `expert_only` |
| Lufttemperatur am Punkt | `weather.point.temperature` | `value` | `migration_pending` |
| Temperatur-Modellkarte | `weather.model.temperature_2m.layer` | `raster_tile` | `expert_only` |
| Windgeschwindigkeit am Punkt | `weather.point.wind_speed` | `value` | `migration_pending` |
| Windböen am Punkt | `weather.point.wind_gusts` | `value` | `migration_pending` |
| Windrichtung am Punkt | `weather.point.wind_direction` | `value` | `migration_pending` |
| Wind-Modellkarte | `weather.model.wind_10m.layer` | `raster_tile` | `expert_only` |
| Relative Feuchte | `weather.point.relative_humidity` | `value` | `migration_pending` |
| Luftdruck | `weather.point.air_pressure` | `value` | `migration_pending` |
| Sichtweite | `weather.point.visibility` | `value` | `migration_pending` |
| Nebel | `weather.point.fog` | `value` | `migration_pending` |
| Schneefall | `weather.point.snowfall` | `value` | `expert_only` |
| UV-Index | `weather.point.uv_index` | `value` | `expert_only` |
| Wetterzustand als Kurzbeschreibung | `weather.point.weather_summary` | `value` | `migration_pending` |
| Satellitenansicht Echtfarben | `weather.satellite.true_color` | `raster_tile` | `expert_only` |
| Satellitenansicht Infrarot (Ost) | `weather.satellite.infrared.goes_east` | `raster_tile` | `expert_only` |
| Hochwasserwarnungen | `natural_hazards.flood.warning` | `hazard_feed` | `expert_only` |
| Amtliche Sturzflutwarnungen | `weather.warning.official` | `hazard_feed` | `expert_only` |
| Tropische Wirbelstürme | `natural_hazards.tropical_cyclone.events` | `hazard_feed` | `expert_only` |
| Bevölkerungsschutzwarnungen | `civil_protection.warning.official` | `hazard_feed` | `expert_only` |

Jede Zuordnung enthält in der begleitenden JSON-Matrix zusätzlich Kontext, fachliche Begründung und ggf. normalisierte `event_filter.hazard_types`. Eine Capability existiert im Router, aber **die Darstellung wird erst nach explizit geprüfter Migration als implementiert bezeichnet**.

## Unverändert lokale Funktionsbereiche

- **Standorte, Tracker, Erfassungs-/Beobachtungsradius:** Keine WeatherRouter-Quelle für eigene Standort- und Trackerlogik.
- **Lokale Blitzaufnahme, Marker, Treffer und Cluster:** Getrennte eigene Ereignisse; keine stille Überschreibung durch öffentliche Quellen.
- **Kompass, Medaillon, Aura, Kalibrierung:** Optik und Instrumente sind keine WeatherRouter-Intents.
- **Kartenbewegung, Vollbild, Fenster, Zoom:** Clientinteraktion ohne Wettersensoranfrage.
- **Präzise/Ausgewogen/Weich/Auto, Transparenz:** Visualisierung verändert weder Messwert noch Routing.
- **Zeitachse und Kachel-Vorladen:** Nutzt vorhandene Raster-Timeline, kein eigener externer Intent.
- **Historien-/Verlaufskurve:** Historie wird nicht als aktueller latest-Punktwert vom Router erfunden.
- **Project Hub, Sprache, Hilfe, Produktinformationen:** Kein externer Wetterdatenbedarf.
- **Diagnose, Versionsanzeige, Fehlerstatus, Exporte:** Datenquelleninformationen beobachten, nicht selbst zu Providern routen.
- **Module, Aktualisierung, Konfiguration, HA-Einbindung:** Infrastruktur, keine Public WeatherRouter Capability.

## Entwurfs- und Sicherheitsentscheidungen

1. Die aktuelle Gewitterradar-Anbindung nutzt aktiv nur `weather.precipitation.layer` als Kartenraster. Der öffentliche Consumer-Client kennt weitere Konstanten, aber das beweist keine vollständig integrierte Warn- oder Blitzdarstellung.
2. Warnungen (`hazard_feed`) werden als amtliche Ereignisse mit `event_filter.hazard_types` eingeschränkt. Hagel, Tornado, Wasserhose, Fallböen und Superzellen bekommen **keine künstlichen Public-IDs**.
3. Gewitterzellen-Nowcast (`raster_tile`) und 1-h-Gewitterwahrscheinlichkeit (`value`) bleiben strikt getrennt. Gleiches gilt für Blitzereignisse (`event_feed`), Dichte (`raster_tile`) und Satellitendateien (`data_file`).
4. Das optionale Profil `gewitterradar` bleibt **deny-only** und darf nie einen deaktivierten Provider aktivieren oder dessen Priorität bestimmen. Die neu ergänzten Blitzfamilien sind nicht automatisch Bestandteil der aktuellen Vorlage.
5. Für Kartenflächen müssen Resource-Typ, Geometrie/Coverage, Legende, Herkunft, zeitliche Gültigkeit und Renderfähigkeit ausdrücklich passen. Ein vorhandener Capability-Katalogeintrag macht noch keinen sichtbaren Kartenlayer.
6. Kein Provider-Hardcoding, keine Umleitung lokaler Tracker-/Blitzverarbeitung, kein stilles Überschreiben vorhandener Ereignisse, kein automatisches Wechseln von spezialisierten auf physikalisch nicht äquivalente Daten.
7. Ausschließlich WeatherRouter entscheidet über Eignung, Ausschluss und Quelle. Gewitterradar rendert Ergebnisse und schützt seine lokale Kernfunktion auch dann, wenn WR fehlt oder vorübergehend nicht erreichbar ist.

## Nächste Teilabnahme

**Zuerst** die statische Prüfdatei gegen die reale WR-Capability-Map und das 33-Modul-Manifest prüfen; danach die Migration in einem separaten, vom aktuellen Gewitterradar-DRA-Stand ausgehenden Entwicklungszweig planen. Ein manueller HA-Test ist in diesem Inventarschritt **nicht** freigegeben. Bei Freigabe werden Capability-Nummer aus der aktuellen UI, technische ID, Resource, Profil, Kontext und zwei getrennt kopierbare Koordinaten angegeben.

**P7-010 bleibt ACTIVE. P7-020 und P7-030 bleiben OPEN.**
