# Gewitterradar V4.11.88 DEV – P7-010: Zoom 12+ und WeatherRouter V2

**Datum:** 17.10.2026 · **Zweig:** `deploy/dev` · **Status:** gebündelter DEV-Realtestkandidat, keine FINAL-/HA-REAL-PASS-Freigabe.

## Identität
- Produkt `V4.11.88 DEV`
- Laufzeit `41188r1`, Modulsatz `E411-88A1`
- Native Home-Assistant-Integration `0.25.6`
- WeatherRouter-Gegenstelle aus technischer Übergabe: `V0.10.152 DEV / Loader 155`.

## Anlass und behobene Codeursachen
Im Anwender-Realtest verschwand die Niederschlagsdarstellung bei **Zoom 12**, während sie bis **Zoom 11** sichtbar blieb. Ob die aktuell aktive Ebene V1 oder V2 war, ist durch diesen Befund allein noch nicht neu nachgewiesen.

**V1:** Eine nicht endliche Leaflet-Kartenobergrenze (`map.getMaxZoom() === Infinity`) konnte fälschlich dazu führen, dass die Anzeigeobergrenze mit `payload.max_zoom` (z. B. 11) gleichgesetzt wurde. Die V1-Ebene darf über die native Quellzoomstufe hinaus angezeigt werden; `maxNativeZoom` bleibt als echte Quellgrenze erhalten. V1-Zoomkorrektur mit mindestens Zoom 20 als Anzeigeobergrenze, ohne reale zusätzliche Rasterauflösung zu behaupten.

**V2:** Die bisherige Mosaik-Kachellogik übersprang jedes Raster bei `tile.z > layer.render.max_zoom` vollständig. Neu: jede Quelle verwendet bei Überzoom die native **Vorfahrenkachel**; deren korrekter geografischer Unterausschnitt wird in die Zielkachel projiziert. Dadurch bleibt die globale NASA-GIBS-Grundlage beispielsweise bei Zoom 12+ sichtbar, ohne dass hochauflösendere DWD-Kacheln auf Zoom 11 heruntergesetzt werden. Regionale WR-Abdeckungsgrenzen bleiben für jeden Ausschnitt separat wirksam. Höchstens vier örtlich geeignete Quellen pro Kachel und die gemeinsame endliche Bildanfragebegrenzung bleiben erhalten.

**Wichtig:** Überzoom vergrößert nur die vorhandene Bildinformation. Es ist keine höhere native Wetterdatenauflösung und keine Glättungs-/Rekonstruktionsgarantie.

## Vorhandene WR-V2-Vertragsintegration (aus V4.11.87 erhalten)
- Consumer V2: `max_data_age_seconds=900` für aktuelle Niederschlagsradardaten, optional `max_background_age_seconds=43200` für explizit zugelassene ältere globale Satellitenschätzungen.
- Mosaikantwort: `freshness_class`, `times.age_seconds`, `times.valid_at`, Messmethode und Qualitätskennzeichnung; im Diagnosewerkzeug abgegrenzt sichtbar.
- Consumer V1: capability-gesteuerte, begrenzte `events_intersecting_window`-Abfrage mit UTC-Zeitfenster, Ereignisstatus, Feed-Aktualität und Seitenparametern. Kein neuer V2-Ereignis-WebSocket.
- V2→V1-Rückfall und `correlation_id` bleiben bestehen; kein paralleles Quellenranking in Gewitterradar.

## Isolierte Regressionen
- Globaler NASA-ähnlicher Rasterprovider mit nativem `max_zoom=11` wird auf Zoom 12 über z11-Vorfahrenkachel angezeigt, unter Nutzung des korrekten Teilbildes.
- Gleichzeitig regionale DWD-ähnliche Quelle mit höherem `max_zoom` nutzt unveränderte native Zoom-12-Kachel.
- Außerhalb regionaler Abdeckung wird nur die geeignete globale Grundlage gezeichnet.
- GridLayer besitzt erweiterte Karten-Anzeigezoomstufe und begrenzt die maximal erzeugte Web-Mercator-Rasterauflösung; Ressourcenbudget/Abbruch bleiben erhalten.
- Statischer V1-Regressionsnachweis für nicht endliches `map.getMaxZoom()` und native/display-Zoomtrennung.
- GitHub-CI und reale Geräteabnahme getrennt verifizieren.

## Verbindliche HA-Realtestreihe
1. Über DRA die gebündelte Gewitterradar V4.11.88 DEV installieren; WR V0.10.152 DEV/Loader155 installiert und betriebsbereit.
2. Weather Engine: korrelierte V2-Anfrage mit optionaler Satellitengrundlage prüfen. V2-`active` darf erst nach tatsächlich geladenen Bildkacheln gelten.
3. Gleicher Kartenausschnitt jeweils bei Zoom 10, 11, 12, 13, 15 und 17: Niederschlag darf beim Übergang 11→12 nicht einfach verschwinden; ältere Quellauflösung fachlich kenntlich machen.
4. Kuba–Atlantik–Europa/DWD-Rand: globale Basis außerhalb der bestätigten regionalen DWD-Deckung erhalten; DWD nur innerhalb der Abdeckung und so scharf wie native Daten.
5. Schnell bewegen, zoomen, Layer ein/aus; V1-Fallback und V2-Kachel-Abbruch überprüfen.
6. Desktop, Android, iPad und Ressourcen-/Kachelbudgets; WR-API-Monitor und GR-JSON-Export mit identischer `correlation_id` abgleichen.
7. FLK-01 separat geräteübergreifend abnehmen; positive Einzelbeobachtungen sind noch kein Abschluss.

**Kein HA-REAL-PASS allein aus GitHub-Actions.**

**C.K. – Eine Idee weiter gedacht.**
