# Gewitterradar P7-010 — V4.11.83 DEV, gebündelter DRA-Realtest

Stand: 15.10.2026. **Keine LIVE-REAL-PASS-Freigabe.** Grundlage ist die freigegebene V4.11.82 (`deploy/dev`); keine Übernahme in den produktiven Zweig ohne Abnahme.

## Getrennte GitHub-Stände

- Gewitterradar: `TheDaimos/gewitterradar`, Testzweig `feature/p7-010-v41182-forward-port-2026-10-15`, Kandidat V4.11.83 DEV / Runtime `41183r1` / Modulsatz `E411-83A1`.
- WeatherRouter: `TheDaimos/weather-router-dev`, Testzweig `feature/p7-010-global-contact-gate-2026-10-15`.
- Öffentliche datensparsame synthetische Prüfungen: `TheDaimos/weather-router-dev-pub`, Zweig `feature/p7-010-global-contact-ci-2026-10-15`. Private WeatherRouter-Actions besitzen keine verlässlichen Runner.
- `deploy/dev` beider Projekte bleibt bis zur externen Abnahme unverändert.

## Implementiert / absichtlich geschützt

1. Bereits vorhandene WeatherRouter-V2-Schnittstelle `weather_router/consumer/resolve_mosaic` auf dem isolierten Testzweig; V1 bleibt aktiv und unabhängig.
2. Eine gemeinsame asynchrone Provider-Kontaktbegrenzung (maximal 3), auch zwischen zwei parallelen V2-Verbrauchern; getrennte Metadaten- und Rasteranfragen können das Limit nicht verdoppeln.
3. Höchstens 12 Quellen im Gesamtmosaik; maximal 4 räumlich relevante Quellen auf einer Kachel; höchstens 48 Rasterabrufe je Snapshot, höchstens 4 gleichzeitig im Browser. Exakte Limits sind Sicherheitsgrenzen, kein Anreiz zu 12 Überlagerungen pro Kachel.
4. V2-Frontendhilfen aus `src/p7-010` als acht ausdrücklich ausgelieferte, **nicht registrierte** Dateien unter `frontend/p7-010`; 34 bestehende registrierte Module bleiben erhalten.
5. Wettermodul hat den standardmäßig **ausgeschalteten** Schalter „Mehrquellenmosaik V2 · P7-010 (Versuch)“. Nur bei expliziter Aktivierung: WebSocket-Anfrage, paralleles Vorbereiten, erst nach einer tatsächlich gezeichneten Rasterkachel Übergang von V1 zu V2. Bei ungültigem V2, Zeitüberschreitung, leerem Bild oder zwischenzeitlicher Kartenbewegung kein Abbau einer funktionierenden V1-Ebene.
6. Weltansicht mit >=360° Kartenbreite wird als `west=-180, east=180` übertragen. Datumsgrenzenübertritt und Kartenmittelpunkt werden ausdrücklich berücksichtigt.
7. Raster-Labor ermittelt nutzbare Ebenen aus der tatsächlichen aktiven Karte statt aus alten Leaflet-Panes und hält die Layerauswahl ohne ständiges Neuerzeugen der Auswahlfelder stabil.
8. Unterschiedliche Messmethoden und Zeitpunkte bleiben in der V2-Quellenherkunft getrennt bezeichnet. Verifizierte Bounding-Boxes belegen **keine** lückenlose Pixelabdeckung: auch ein globaler Rasterplan kann nur `partial` sein.
9. Legenden- und Kartenanzeige „Weich“, die Blitzortung und alle vorherigen 34 Module werden nicht ersetzt. Bestehender V1-Zeitspieler steht bei aktiver V2-Mosaikdarstellung nicht als künstliche V2-Zeitreihe zur Verfügung.

## Synthetische Abnahme

- WR öffentliche CI: `38803501141` erfolgreich; verifiziert auch die gemeinsame Begrenzung bei zwei Verbrauchern. Keine privaten Anbieterzugriffe.
- Gewitterradar isolierte CI: P7-010-Tests für Vertrag, 12-Quellen-Grenze, geographische Masken, WMS/XYZ, Kachelbudget, Weltansicht, wirkliche V1/V2-Umschaltung und Raster-Labor. Aktuellen Zweigkopf und alle CI-Prüfungen vor Installation erneut prüfen.
- Kein synthetischer Test ersetzt echte Provider-Bilder, echte Home-Assistant-WebSockets oder Geräteprüfungen.

## Gebündelte DRA-Verprobung (einmalige Installation pro Projekt)

1. Prüfen, dass für beide Testzweige alle statischen Prüfungen grün sind und dass das DRA tatsächlich **diesen jeweiligen Zweig** installiert; Standard `deploy/dev` enthält P7-010 nicht. Auf keinen Fall private Testdaten oder Erweiterungen ins öffentliche Prüf-Repository kopieren.
2. Test-HA sichern. WeatherRouter-Testzweig via DRA bereitstellen, nötigen Home-Assistant-Neustart ausführen, Discovery/Verfügbarkeit von Consumer V1 und V2 über lokale Diagnose prüfen.
3. Gewitterradar-Kandidat V4.11.83 vom isolierten Zweig via DRA installieren; Version, Runtime und Modulsatz prüfen; höchstens einen weiteren nötigen HA-Neustart für das gebündelte Update durchführen.
4. Zunächst **V2 aus**: V1-Niederschlag, Legende, Timeline, Blitzortung, Darstellung „Weich“, Menüs und Raster-Labor gegen V4.11.82 vergleichen.
5. V2 einschalten: Nord-/Mittelamerika inklusive Kuba, Deutschland nur am Kartenrand, Weltansicht 360°/720°, Antimeridian, Zoom 8/9/10 und Wechsel der Schwerpunktkoordinate. Unterschiedliche räumliche Quellen dürfen nicht gesamte Karte gegenseitig verdrängen; fehlende Pixeldeckung ist als Lücke zu behandeln, nicht als „trocken“.
6. Echte Bildnachweise und Anzeigen für Desktop, Android und iPad durchführen. Darstellung „Weich“ bei Zoom 10 besonders auf gerade Kachelkanten prüfen; keine CPU-/RAM-Explosion, keine flackernden Cluster, keine neuen Touch-Störungen.
7. Rückfallprüfung: V2 vorübergehend abschalten oder Verbindung testen. Bei Fehlern V1 funktionsfähig, Quellenabdeckung und Legenden transparent. Gleichzeitige Verbraucher und verschobene/abgebrochene Ansichten beobachten.
8. Nur nach erfolgreicher Realabnahme P7-010 als `LIVE-REAL-PASS` kennzeichnen und Freigabe des Übergangs nach `deploy/dev` gesondert entscheiden.

## Noch nicht extern bestätigt

Live-Providerkontakte und echte Bilder; DRA-Installation und Recovery; semantische Überlagerungsqualität unterschiedlicher Datenarten; tatsächlich lückenlose Weltpixel; reale Leistung bei vielen Quellen; gerätespezifische Touch- und Rendering-Stabilität. Bis dahin **ACTIVE / REAL-PENDING**, keine Aussage „fertig“.
