# V4.11 – Verbindlicher Planungsbeschluss: Hybride Weather-Engine

Stand: 2026-09-30  
Status: **FACHLICH ABGESTIMMT / VERBINDLICHE PLANUNG / ÄNDERBAR DURCH NEUEN NUTZERBESCHLUSS**  
Umsetzung: **Noch nicht freigegeben; keine V4.10-Rückwirkung.**

## Leitidee

**Blitzortung bleibt das Herzstück. WeatherRouter erweitert den meteorologischen Horizont.**

Gewitterradar erhält eine hybride Weather-Engine: vorhandene Blitzortung-Ereignisse werden gemeinsam mit geeigneten, unabhängig ausgewiesenen WeatherRouter-Informationen (Niederschlag/Regenwolken, andere Wetterereignisse, Satellitenbilder und satellitenbasierte Blitzbeobachtung, Tornados/Wasserhosen, amtliche Gefahrenwarnungen usw.) zu einem meteorologischen Lagebild kombiniert. Die Quellen bleiben fachlich nachvollziehbar. WeatherRouter kann auch geeignete alternative Blitzdaten liefern, wenn Blitzortung ausfällt oder für ein Gebiet keine ausreichende Abdeckung verfügbar ist. Die Möglichkeit unabhängiger ergänzender Beobachtungsnetze ist ausdrücklich gewünscht – nicht nur ein Notfallersatz.

## Weather-Engine in den Einstellungen

- Eigenständiger Menüpunkt **Weather-Engine**.
- Zwei **unabhängige** Steuerungen: Blitzortung.org und WeatherRouter; beide können einzeln oder gemeinsam eingeschaltet sein. Kein unnötiger exklusiver A/B-Umschalter.
- Kombinierter Betrieb mit drei gleichzeitig denkbaren fachlichen Aufgaben:
  1. Anreicherung der primären Blitzdarstellung durch Radar, Wolken/Satelliten, Wetterereignisse und Warnungen.
  2. Ergänzende unabhängige Blitzbeobachtungen (z. B. boden- und satellitengestützt), mit deutlicher Kennzeichnung der Beobachtungssemantik.
  3. Kontrollierte alternative Blitzdatenversorgung bei bestätigtem Ausfall/fehlender regionaler Eignung.
- Separate einstellbare Ebenen: Niederschlagsradar, Satellitenbilder/Blitzbeobachtung, Tornado-/Unwetterereignisse, amtliche Warnungen sowie weitere künftig geeignete Capabilities; Verfügbarkeit dynamisch ermitteln.
- Eigener Verbindung-/Quellen-/Aktualitäts-/Abdeckungs-/Diagnosebereich und Verknüpfung zum zentralen Systemstatus und Hilfe.
- Eine WeatherRouter-only-Konfiguration darf nicht automatisch als vollständiger funktionaler Ersatz sämtlicher Blitzortung-Funktionen dargestellt werden.

## Unverzichtbare Daten- und Sicherheitssemantik

- Blitzortung.org bleibt zunächst primäre Quelle für den bestehenden Einzelblitz-/Gefahrenablauf. WeatherRouter kann daneben weitere geeignete Beobachtungen zeigen.
- Keine unkontrollierte Zusammenzählung/Doppelzählung; gemeinsame Ursprungsquellen auch bei verschiedenen Transportwegen erkennen, soweit möglich. Satelliten-Flashes, beobachtete Ereignisse und Blitzdichte sind nicht ohne weiteres äquivalente Einzelblitze.
- Provenienz/Attribution, Zeitstempel, Aktualität, Coverage, Datenklasse und ggf. eingeschränkte Verfügbarkeit sichtbar halten.
- Keine Blitzereignisse ist kein Ausfallnachweis. Für Ersatzversorgung Verbindung/Quellenzustand, Datenalter, regionale Abdeckung, Ressourcen- und fachliche Eignung prüfen; kein blindes Fallback.
- Alternative Versorgung nur für fachlich kompatible Funktionen verwenden, übrige Einschränkungen offen anzeigen. Keine falsche Sicherheit suggerieren.
- Warnereignisse von Messbeobachtungen unterscheiden; leere Ereignislisten sind nicht automatisch Fehler.
- Angestrebt: bei schwächerer Stationsabdeckung weitere geeignete unabhängige Netz-/Satellitenbeobachtungen nutzen; offizielle Quellen weder als automatisch weltweit verfügbar noch als semantisch gleichwertig unterstellen.

## Schnittstellenvertrag / Modulgrenze

Quelle: vom Nutzer bereitgestellte `WeatherRouter_Consumer_API_V1_Regeln_2026-09-29.md`, Vertragsstatus „implementiert, read-only, externe Consumer-Abnahme ausstehend“. Zur technischen Umsetzung Runtime-Code und maschinenlesbare Schemas gegen diesen Beschluss prüfen; bei Widerspruch gilt Runtime → JSON-Schema → Dokument.

- Gewitterradar greift **ausschließlich** auf die authentifizierte read-only HA-WebSocket-Consumer-API V1 zu: `weather_router/consumer/discovery`, `capabilities`, `resolve`. Keine direkten Imports von WeatherRouter-Python, keine Nutzung von internem `hass.data`, keine Provider-Festverdrahtung oder Abhängigkeit von installierter Router-Integration.
- Discovery → gemeinsame Vertragsversion (nicht Produktversion) → ready → dynamische Capabilities → resolve mit explizitem point/bbox/global und `time.mode=latest` → `resource.type` validieren → Payload darstellen → Provenienz/Freshness erhalten; `unavailable` ist ein regulärer Betriebszustand.
- Consumer wählen providerneutrale Capabilities, keine Provider. Optionales deny-only Profil `profile_id=gewitterradar` verwenden, wenn bewusst vorhanden/aktiv; das Profil ist keine Pflicht.
- Interessante dokumentierte Capability-Beispiele: `weather.lightning.observed.events`, `weather.lightning.observed.density`, `weather.lightning.observed.nearest_distance`, `weather.lightning.observed.nearest_azimuth`, `weather.lightning.density`, `weather.lightning.satellite.mtg_li.accumulated_flashes`, `weather.lightning.satellite.glm_east.lcfa`, `weather.lightning.satellite.glm_west.lcfa`, `weather.radar.precipitation`, `weather.warning.official`. Keine fixe Anbieter-/Capability-Zahl; verfügbare Ressourcen, Abdeckung und tatsächliche Adapterfähigkeit dynamisch prüfen.
- Resource-Typen für Anzeige fachgerecht differenzieren (`value`, `raster_tile`, `event_feed`, `hazard_feed`, `image_sequence` usw.). Keine willkürliche `data_file`-Interpretation. Der API-Request-Zeitmodus ist derzeit ausschließlich `latest`; Ressourcen können eine separat beschriebene Timeline anbieten.
- Derzeit ist Aggregation laut bereitgestelltem Vertrag nur auf drei `hazard_feed`-Capabilities begrenzt. Eine Quellzusammenführung für zusätzliche Blitz-Feeds ist daher **zukünftiger Prüf-/Erweiterungsbedarf**, keine heute garantierte API-Funktion. Wenn sinnvoll, Aggregations-/Normalisierungslogik bevorzugt in WeatherRouter, nicht redundant in Gewitterradar.
- WeatherRouter beschafft/routet/normalisiert seine Daten; Gewitterradar verantwortet Darstellung, Quellenintegration, Blitzanalyse, standortbezogene Überwachung und verständlichen Systemstatus. **Gewitterradar wird kein zweiter WeatherRouter.**
- WeatherRouter-Consumer-Vertrag erst nach realem externem Test mit Gewitterradar endgültig abnehmen; zunächst kleiner Ende-zu-Ende-Verbindungstest statt großflächiger Integration.

## Monitored Areas

- Hybride Wetter-/Gefahrenlage je gespeichertem Überwachungsort perspektivisch verfügbar: primäre Blitzereignisse plus geeignete zusätzliche Blitzbeobachtungen, Niederschlag, amtliche Warnungen und weitere Daten.
- Backendseitige, browserunabhängige Überwachung und Protokollierung bleiben Pflicht; eine reine Frontend-Verbindung reicht dafür nicht.
- Vor gemeinsamer Bewertung ausdrücklich Regeln zur räumlichen/zeitlichen Zuordnung, zur Quellenqualität und zur Alert-Semantik definieren. Keine undifferenzierte automatische Gesamtrisikozahl.
- Fallback darf eine Area nicht scheinbar voll geschützt erscheinen lassen, wenn für ihre benötigte Funktion keine geeigneten Ersatzdaten vorliegen.

## Ressourcen und Umsetzungsgates

- Discovery/Katalog gezielt und zwischengespeichert aktualisieren, keine unnötige Resolve-Flut bei Kartenbewegung.
- Nur aktivierte und nach Capability/Profil/Region geeignete Ebenen abfragen; Datenalter, Limitierung, Aktualisierungsintervalle und parallele Areas berücksichtigen.
- Kleine eigenständige Adapter-/Fachmodule, keine neue monolithische Hauptdatei; ein stabiler Einstiegspunkt und Parität beider Auslieferungsformen.
- V4.10 FINAL bleibt eingefroren, DRA-Kanal `deploy/dev` bleibt erhalten. Umsetzung und Iterationsreihenfolge gesondert freigeben; eindeutige V4.11.XX-DEV-Versionierung ist vorgelagertes verbindliches Gate.

## Abgrenzung

Dieser Beschluss hält die abgestimmte Produktvision verbindlich fest, ist aber durch ausdrückliche spätere Entscheidungen änderbar. Er ist **keine** Behauptung, alle genannten Capability-Ressourcen/Netze seien bereits tatsächlich global verfügbar oder dass die genannte Quellenaggregation schon implementiert sei.
