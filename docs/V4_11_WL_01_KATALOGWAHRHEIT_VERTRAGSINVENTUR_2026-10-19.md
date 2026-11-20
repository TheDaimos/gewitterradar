# WL-01 – Katalogwahrheit und Consumer-V1-Vertragsinventur

**Datum:** 2026-10-19  
**Repository:** TheDaimos/gewitterradar, ausschließlich `deploy/dev`  
**Gegenstelle:** TheDaimos/weather-router-dev, `deploy/dev` (nur gelesen)  
**Status:** Statische Bestands- und Vertragsprüfung durchgeführt; **kein HA-Echtabruf / kein HA-REAL-PASS**. WL-02 nicht begonnen. Keine produktiven Änderungen.

## 1. Quellennachweis und maßgebliche Einschränkung
- GR: `docs/V4_11_WEATHER_ROUTER_NICHT_NIEDERSCHLAG_LAYER_AUDIT_UND_AUFTRAG_2026-10-19.md`, `frontend/modules/weather/layer-menu.js`, `frontend/modules/weather/consumer-client.js`, `frontend/modules/weather/display-menu.js`.
- WR: `docs/CONSUMER_API_V1.md`, `custom_components/weather_router/consumer_capability_map.json` auf `deploy/dev`.
- Die WR-Capability-Map bezeichnet sich selbst `draft`: Mapping und Ressourcentyp sind statische Vertragshinweise, **kein Nachweis eines erfolgreichen Live-Resolve**. Runtime-Code und JSON-Schema haben gemäß WR-Dokumentation Vorrang vor Dokumentation.
- Eine HA-Verbindung mit aktuellen Consumer-V1-Antworten war im Prüfkontext nicht verfügbar. Deshalb **keine** Behauptungen zu tatsächlich momentan erfolgreichen Tile-URLs, Abdeckung, Lizenzfreigaben, Zoomstufen, gültigen Zeitpunkten oder realen Anbieterantworten. Diese Prüfungen sind ausdrücklich offen.

## 2. Bestandsbefund in Gewitterradar
- `layer-menu.js` definiert `rendererId()` ausschließlich für `weather.precipitation.layer`. In `_weatherLayerMenuCapabilitiesMarkup()` lautet die Anzeige aller übrigen Ebenen pauschal `verfügbar / Renderer folgt`; `_weatherLayerMenuToggle()` verweigert andere IDs. Somit ist dies **kein Ausfallnachweis des WeatherRouters**.
- `isWeatherLayerCapability()` filtert bereits nach `enabled===true`, `available===true`, räumlichem Kontext `bbox/global` sowie Ressourcentypen `raster_tile/hazard_feed/event_feed/planetary_tile` bzw. passender `image_sequence`. Punktwerte (`value`, Kontext `point`) fallen aus dem Kartenkatalog heraus; ihre fehlende Anzeige ist getrennt zu behandeln.
- `display-menu.js` speichert Stil-/Transparenzwerte derzeit nur unter `precipitation`; die vorhandene optische Aufbereitung ist kein generischer Datenrenderer.
- `consumer-client.js` kann beliebige syntaktisch zulässige Capability-IDs über `createWeatherRouterClient().resolve(capability,context)` abfragen; Transport ist authentifiziertes HA-WebSocket `weather_router/consumer/resolve`, Vertragsversion 1. Rückgaben `ready` oder `unavailable`; der Client validiert allgemein `value`, `raster_tile`, `image_sequence`, Ereignis-/Gefahrenströme. Für Niederschlag existieren strengere Sonderregeln, die **nicht** auf beliebige Raster übernommen werden dürfen.
- Nicht-niederschlagsbezogene Ressourcen werden bislang nicht als unabhängige Kartenebenen geführt, geschaltet, gezeichnet und im aktuellen Menü als `Karte aktiv` bestätigt.

## 3. Statisch verifiziertes V1-Fachinventar

| Öffentliche Capability | Kandidaten in WR-Capability-Map (keine Verfügbarkeitsgarantie) | Vertragsressource | GR-Lücke |
| --- | --- | --- | --- |
| `weather.satellite.clouds` | DWD, EUMETView | `raster_tile`, providerneutraler Satelliten-Wolkenintent | generischer Wolkenraster-Adapter, Status/Legende/Attribution |
| `weather.model.wind_10m.layer` | DWD ICON Wind 10 m | `raster_tile` | Raster-Ebene mit Windsemantik und dokumentierten Einheiten |
| `weather.model.temperature_2m.layer` | DWD ICON 2 m | `raster_tile` | separates Temperaturraster nach fachlicher Prüfung |
| `weather.satellite.true_color` | NASA GIBS | `raster_tile` | bildspezifischer Adapter; nicht gleichbedeutend mit Wolkenbedeckung |
| `weather.satellite.geocolor.goes_east` | NASA GIBS | `raster_tile` | Satellitenprodukt/Zeitattribution/Coverage |
| `weather.satellite.infrared.himawari_9` | NASA GIBS | `raster_tile` | IR-Semantik nicht als True Color deklarieren |
| `weather.point.uv_index` | Open-Meteo | `value`, Vorhersage, dimensionslose Einheit `1` | Punktwert-Anzeige, **kein** flächiger UV-Layer |
| `weather.point.cloud_cover` | Open-Meteo, MET Norway, FMI, SMHI | `value`, vorhergesagte Gesamtbewölkung `%` | Punktwert-Anzeige, **kein** Wolkenraster |
| `weather.point.wind_speed` | Open-Meteo, MET Norway, NOAA NWS, FMI, SMHI | `value`, Vorhersage, `m/s` | Punktwert-Anzeige |
| `weather.point.temperature` | Open-Meteo, MET Norway, NOAA NWS, FMI, SMHI, JMA | `value` | Punktwert-Anzeige |

Weitere im WR-Mapping verzeichnete Satellitenprodukte sind unter anderem GOES Ost/West Clean IR, sichtbares Rot, Luftmassen, Staub und Feuertemperatur sowie Himawari Luftmassen/sichtbares Rot. IMERG-Niederschlagsrate gehört fachlich zum separaten Niederschlagsstrang und ist **kein** generischer Wolken-Layer. Die Map enthält weitere Punktfähigkeiten (Wolkenhöhen, Windrichtung/-böen, UV-Varianten). Die obige Übersicht zeigt die priorisierten repräsentativen Vertragsklassen, nicht eine geprüfte weltweite Laufzeitabdeckung.

**Wichtig:** `weather.satellite.clouds` beschreibt nach WR-Map explizit `visual_layer`, `raster_tile`, `render_interchangeable:true`, `numeric_interchangeable:false`, erforderliche Coverage und Attribution, aber **candidate-spezifische, nullable Legende** und uneinheitlichen Satelliten-/Zeit-/Darstellungsstil. `weather.point.uv_index` und `weather.point.cloud_cover` sind `numeric_point` und kein Raster. UV ist eine bewölkungsbeeinflusste aktuelle/zeitnahe Vorhersage und weder Clear-Sky-Index noch Tagesmaximum.

## 4. V1-Anfrage- und Antwortnachweis – offen für Live-Abnahme
Für **jede** priorisierte Capability: vor Test `discovery` und `capabilities` aufrufen, dann `resolve` mit explizitem `bbox` bei Raster oder `point` bei Einzelwert und `time:{mode:'latest'}`. Für alle Prüfungen eine eigene Korrelationskennung protokollieren.

Zu dokumentierende Rohfelder je Anfrage: `capability`, `context`, `requirements`, `time`, `status`, `unavailable.code`, `resource.type`, vollständige `resource.payload`-Struktur (URLs nur im **privaten** Diagnosearchiv, bei Zugriffsmerkmalen bereinigen), `resource.semantics`, `provenance`, `freshness`, `routing`, `intent_contract`, Providerquellen, `valid_at` in UTC, tatsächliche Coverage, Kachelgröße, Zoomobergrenze, Legende und Attribution.

Für Raster zusätzlich: reale HTTP-/Bild-Ladeergebnisse an repräsentativen Kacheln, Georeferenzierung/Projektion, Tile-URL-Variablen, Cross-Origin-Verhalten, Nutzungsrechte und Bildursprung prüfen. Für Punktwerte: `payload.values`, Einheit, Zeitbezug, Koordinate, Beobachtung/Vorhersage. Für Bildfolgen: `frames`, `georeferenced`, Frame-Zeiten und räumliche Einpassung. Für `hazard_feed/event_feed`: Ereignisgeometrie, UTC-Fenster, Status, Quellen und Pagination. **Fehlende Felder nicht stillschweigend auffüllen.**

Statusbegriffe für künftige Anzeige getrennt führen: (1) im Katalog, (2) Renderer ausstehend, (3) konkreter Resolve `ready`, (4) derzeit `unavailable`, (5) tatsächlicher Bildabruf/Zeichnung vollständig oder teilweise erfolgreich, (6) Benutzer hat die Ebene aktiviert. `available` allein impliziert weder (3) noch (5).

## 5. Bestandsschutz und Sicherheit
Unverändert lassen: `weather.precipitation.layer` samt V1/V2, P7-010-Mosaik und Zeitachse; optische Darstellung inkl. Zoom-/Transparenzkorrekturen; Canvas-Reihenfolge und bestehender Layer-Lebenszyklus; Consumer-V1-/V2-Zeitvertrag (UTC); DWD/NASA-Coverage-/Freshness-/Opt-in-Regeln; Wetterrouter-Optionalität ohne Beeinträchtigung von Gewitterradar; HA-Zustand, DRA, alle bestehenden Schutz-/Diagnosemechanismen. Kein neuer API-Weg, keine feste Providerwahl, kein Rückbau von V1 oder Änderung am Niederschlagsrenderer.

## 6. Konkreter Umsetzungsvorschlag WL-02 – **nur zur Freigabe, nicht implementiert**
1. Zuerst vier Live-Vertragsproben mit echten V1-Rohantworten: Wolkenraster, Wind-10-m-Raster, UV-Punktwert, Bewölkungs-Punktwert. Zusätzlich repräsentativ True Color/IR; Ergebnis je Quelle mit `ready`/`unavailable`, Zeit, Coverage, Attribution und Bildladeprobe belegen. Falls unklar: gezielte schriftliche Vertragsfrage an WR; keine erfundene Antwort.
2. Nur für erfolgreich verifizierte **nicht-niederschlagsbezogene** `raster_tile`-Antworten einen isolierten Adapter in vorhandener Karten-/Layer-Architektur vorsehen, initial `weather.satellite.clouds` und `weather.model.wind_10m.layer`. Provider neutral und opt-in, getrennte Layerzustände, Bildbudget, Abbruch/Wechsel/Teilausfall, Kachelgrenzen und Benutzerschalter.
3. Menüstatus technisch an Katalog, Rendererfähigkeit, tatsächlichen Resolve, Kacheln und Anwenderaktivierung koppeln. UTC-Aktualität/Quellen/Legende/Attribution und unterschiedliche Satelliten-Semantik verständlich zeigen.
4. Punktwerte wie UV und Gesamtbewölkung ausdrücklich **erst WL-03** in eigener Punktanzeige; Ereignis-/Bildfolgen nur nach eigener Vertragsanpassung (WL-04).
5. Vor Freigabe getrennte Regressionstests für Niederschlag V1/V2, P7-010, Projektion, Bildlade-Abbruch, Zoom, Zeit, Coverage, Android/iPad/Firefox sowie korrelierte GR-/WR-Exporte; nur reale HA-Läufe dürfen `HA-REAL-PASS` erhalten.

## 7. WL-01-Abnahmegrenze
**Erledigt:** Statische GR-Ursachenanalyse, V1-Transport/Clientprüfung, Typzuordnung priorisierter Fähigkeiten anhand WR-Mapping, Katalogwahrheit, Bestandsschutz und WL-02-Spezifikation.  
**Offen:** Live-Resolve samt vollständiger Payload, aktuelle Providerantworten, Bildladebeweis, Lizenzprüfung und reale HA-Abnahme. Diese Aspekte dürfen nicht als verifiziert bezeichnet werden. **WL-02 ist nicht freigegeben und nicht implementiert.**

C.K. – Eine Idee weiter gedacht.
