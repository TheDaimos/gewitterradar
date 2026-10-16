# Gewitterradar V4.11.87 DEV · P7-010 Consumer V2 / WeatherRouter 0.10.152

**Datum:** 16.10.2026 · **Zweig:** `deploy/dev` · **Status:** gebündelter DEV-Realtestkandidat, **kein** HA-REAL-PASS oder FINAL-Release.

## Version
- Gewitterradar **V4.11.87 DEV**, Laufzeit `41187r1`, Modulsatz `E411-87A1`, native Integration `0.25.5`.
- Erwartete gekoppelte WeatherRouter-Version: **0.10.152 DEV / Loader 155**.
- Ein regulärer DRA-Stand; kein Fork, keine zweite Mehrquellen- oder Provider-Routing-Architektur.

## Änderungen
1. **V2-Hintergrundalter:** Der bestehende Client unterstützt optional `max_background_age_seconds=43200` bei unveränderter regionaler Radarfrische `max_data_age_seconds=900`. Die explizite Freigabe über **Einstellungen → Weather Engine → Ältere globale Satellitenschätzungen zulassen** ist standardmäßig **Aus** und wird im Browser gespeichert. Ohne Zustimmung bleibt das bisherige Verhalten unverändert.
2. **V2-Vertragsvalidierung:** `freshness_class=current|older_background`, `times.age_seconds`, `valid_at`, `retrieved_at`, optionale `observed_at` und `quality_note` rückwärtsverträglich geprüft. Ein älterer Hintergrund ist nur bei bestätigter globaler Coverage, deklarierter Satellitenschätzung und passender expliziter Altersgrenze zulässig. Eine ältere regionale Radarmessung wird dadurch nicht freigegeben.
3. **Ebenenaufbau:** Die aktive P7-010-Kachelverarbeitung verwendet weiterhin ausschließlich WR-geordnete Quellen: globale Grundlage zuerst, räumlich gültige regionale Ebene darüber, maximal vier je Kachel und endliches gemeinsames Kachelbudget. Der ältere V1-Layer bleibt während des Ladens bestehen; fehlerhafte V2-Antworten fallen kontrolliert zurück.
4. **Legende und Diagnose:** V2-Quelle, Bildzeit in UTC, gemeldetes Datenalter, Messmethode, Aktualitätsklasse und Einschränkungen werden kenntlich gemacht. Ältere Satellitenschätzungen werden ausdrücklich **nicht** als aktuelles Radar bezeichnet. Die korrelierte Diagnose enthält `older_background_count` und `freshness_classes`.
5. **Gezielter V2-Test:** Isolierter V2-Aufruf berücksichtigt die im Einstellungsmenü gewählte Freigabe. A/B-Vergleich fragt nun **900 s strikt** und **900 s Radar plus 43200 s explizit freigegebene globale Satellitengrundlage** ab; keine Bildabrufe und keine Kartenveränderung.
6. **Consumer V1 Ereignisfenster:** Auf bestehender Discovery/Resolve-Schnittstelle kann GR `events_intersecting_window` für wirklich angekündigte Event-/Hazard-Capabilities abfragen. Offset-UTC-Zeitfenster, Seiten 1–5, 1–200 Einträge, Feed-Frische, Ereignis-`temporal_status` und `has_more` werden geprüft und als begrenzte Diagnose zusammengefasst. Kein erfundener V2-Ereignis-WebSocket und keine eigenständige Providerwahl.
7. **Versions- und Cacheverwaltung:** Frontend-Quellen, Dashboard-/native Auslieferung, P7-010-Hilfsmodule und SHA256-Prüfsummen werden auf V4.11.87 abgeglichen.

## Technische Abnahme
Automatisierte Tests: Provider-neutrale V1-Vertragsprüfungen, V1-Ereignisfenster, Raster-V2-Validator, NASA/DWD-Mosaik mit regionalem Clipping, Kachelbudget, V2-Diagnosevergleich, UI-/Frontend-Regressionsprüfungen und HA-Integration.

Diese Prüfungen ersetzen keine echten installierten Wetterbilder und keine 280/280 Provider-Rohzeitabnahme.

## Verbindliche HA-Realtestfolge
1. WR 0.10.152 DEV prüfen, dann **GR V4.11.87 DEV mit einem DRA-Update** installieren. Sichtbare Version und Laufzeit kontrollieren.
2. In den GR-Weather-Engine-Einstellungen **Ältere globale Satellitenschätzungen zulassen** aktiv einschalten; nur dann wird `max_background_age_seconds=43200` in der produktiven Anfrage gesendet.
3. WR-API-Monitor V1/V2 aktivieren und **GR „API V2 gezielt prüfen“** auslösen. Status, `correlation_id`, Alters- und Qualitätsklassen vergleichen.
4. Niederschlagskarte einschalten und sichtbare **aktive V2**-Kartenebene verifizieren (nicht nur `partial` vom WebSocket). Kuba–Atlantik–Europa samt DWD-Rand, NASA-Hintergrund und globaler Bildfortsetzung bei Zoomwechsel prüfen.
5. Mehrere Kartenwechsel, Zoom 8–13, Zeitverschiebung, UTC-Äquivalenz, Rückfall V2→V1, offene Quellen-/NoData-Grenzen, begrenzte Bildabrufe und Ressourcen prüfen.
6. Warnungen, aktive Vulkane, historische Erdbeben und Ereignisse als separate **Consumer-V1-Zeitfenster** real prüfen, soweit vom WR-Katalog unterstützt; die allgemeine Ereignis-Oberfläche ist nicht Bestandteil dieses Raster-DEV-Updates.
7. GR-Weather-Engine-JSON und privaten WR-API-Monitor-Export mit übereinstimmenden Korrelationskennungen bereitstellen. Desktop/Android/iPad überprüfen.
8. **FLK-01 separat beobachten; nicht ohne erneute Sichtprüfung als dauerhaft behoben markieren.**

**Keine stillschweigende Qualitätsaufwertung alter Satellitenbilder. Keine FINAL-Freigabe ohne echtes V2-Mosaik.**

**C.K. – Eine Idee weiter gedacht.**
