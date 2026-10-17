# Daimos – Gewitterradar V4.11.91 / WeatherRouter P7-010
## Verbindliche Chatübergabe: WR-Testfreigabe, echter NASA-V2-Befund, offene gemeinsame Realabnahme
**Stand:** 17.10.2026, nach dem korrelierten HA-Export um 14:04 UTC und der WR-Freigabe.  
**Projektzuständigkeit:** ausschließlich **Gewitterradar**. WeatherRouter separat über seine private Koordination ansprechen.  
**GR:** `TheDaimos/gewitterradar@deploy/dev`, **V4.11.91 DEV**, HA-Integration **0.25.9**, Runtime **`41191r1`**, Modulsatz **`E411-91A1`**. Letzter bestätigter ausführbarer Code `3ec648aa5bfb63f0cd25ea1d4f3b567c8c75b187`; zum Abgleich geprüfter nachfolgender, ausschließlich dokumentarischer Zweig-HEAD `219a3daf05bd557dc9228d927e719dedb521f396`.  
**WR:** `TheDaimos/weather-router-dev@deploy/dev`, **V0.10.155 DEV**, Loader **158**; zuletzt geprüfter privater Dokumentations-HEAD `fc313df6bb08322a80fc629f041bc39c6dad4b61`. Die Manifestversion `0.10.0` ist nicht die WR-DEV-Buildversion.  
**Abnahmezustand:** NASA-Welt-BBOX-Vertrag **CODE/CI PASS und HA-V2-Laufzeitpfad bestätigt**. Gleichzeitiges NASA+DWD-Mosaik, echte Bildpixel, Wechsel der Satelliteneinwilligung, V1-Rückfall und Zoom-Gesamtmatrix **OFFEN**. **Kein P7-010-Gesamt-PASS.**

> Diese Übergabe ergänzt die vollständige Architektur-/Verlaufsübergabe `docs/HANDOFF_GR_V41191_P7_010_2026-10-17.md`, ersetzt sie nicht. Zum Arbeitsbeginn beide tatsächlichen `deploy/dev`-HEADs neu prüfen. Die dokumentierte WR-Freigabe wurde vor/ohne erfolgreiche Gesamtabnahme formuliert und ist **keine** Freigabe, neue Fehlerbelege zu ignorieren.

## 1. Pflichtlektüre, Reihenfolge

1. **GR-Grundübergabe:** `docs/HANDOFF_GR_V41191_P7_010_2026-10-17.md`, einschließlich Architektur, Spiegel-Dateien, Abnahmen und historischer DWD-Randkontaktfehler.
2. **WR → GR, neue formale Testfreigabe:** privates WR `docs/p7-010-coordination/WR_TO_GR_2026-10-17_FREIGABE_GEMEINSAME_REALABNAHME_GR41191_WR010155.md`. Sie sagt: „keine bekannte WR-seitige Codesperre“, vorhandene `deploy/dev`-Architektur verwenden, keine Codeänderung ohne neuen Befund, koordinierte HA-Realprüfung; WR-P0-Audit der 252 noch nicht individuell geprüften Provider-Zeitpfade bleibt separat.
3. **GR → WR, neue echte Diagnose-Rückmeldung:** privates WR `docs/p7-010-coordination/GR_TO_WR_2026-10-17_V41191_REALTEST_NASA_V2_PASS_DWD_0_3S.md`. Enthält die genaue Server-/Client-Korrelation und WR-Prüffragen. **Private Exportrohwerte nicht ins öffentliche GR-Repository kopieren.**
4. **GR, öffentlicher datensparsamer Diagnosebericht:** `docs/P7_010_V41191_HA_REALDIAG_NASA_PASS_DWD_OFFEN_2026-10-17.md`.
5. **Implementierung/Tests:** `frontend/modules/weather/precipitation-layer.js`, `frontend/modules/weather/consumer-client.js`, `src/p7-010/raster-mosaic-grid-layer.js`, `src/p7-010/raster-mosaic-tile-loader.js`, `src/p7-010/raster-mosaic-contract.js`, sämtliche `scripts/test-p7-010-*.mjs`, Spiegel und Runtime-Manifeste.

## 2. Neue WR-Freigabe – technisch korrekt einordnen

WR hat V0.10.155 / Loader 158 für den gemeinsamen HA-Test mit GR V4.11.91 **freigegeben**. Explizit bestätigt: Welt-BBOX des NASA-IMERG-Produkts bleibt `coverage_scope:bbox`, gilt nur bei `coverage_verified:true` als qualifizierte ältere Satellitenschätzung und bleibt an ausdrückliches 12-h-Budget gebunden. Lokale aktuelle Radarquelle behält 900-s-Budget. Die GR-Welt-BBOX-Validatoränderung ist implementiert. Vier ursprüngliche GR-Prüfabläufe am ausführbaren Commit `3ec648aa...` waren erfolgreich; WR nennt ebenfalls drei grüne öffentliche Prüfabläufe der überprüften Quellen. Diese Belege sind **Codeprüfungen**, kein Ersatz für sichtbare Kartenabbildung.

Zusätzlich wurden am GR-Dokumentations-HEAD `219a3daf...` am 17.10.2026 die drei erneut ausgelösten GitHub-Prüfabläufe **alle SUCCESS**:
- Gemeinsames Frontend: **39039842244**
- HA-Integration: **39039842219**
- Einstellungen und Runtime-Identität: **39039842227**

## 3. Neuer realer GR-/WR-Laufzeitbeleg vom 17.10.2026

Ein HA-Browser-/WR-Exportpaar mit GR V4.11.91 und WR V0.10.155 / Loader 158 wurde ausgewertet. GR-Exportzeit **14:04:33 UTC**, WR-Diagnoseexport **14:04:55 UTC**. Private Originaldateien liegen außerhalb dieses öffentlichen Dokuments; Ablage, genaue Korrelation und Analyse stehen in der privaten WR-Koordinationsantwort.

- GR-Discovery und WR-Consumer-Vertrag: `ready:true`. Die API V2 wurde wirklich abgefragt, kein bloßer UI-Test.
- **Alle 23** korrelierten WR-V2-Antworten: `partial`, jeweils **genau eine NASA IMERG** ältere Satellitengrundlage, **kein DWD**. Die 23 Anfragen enthielten `max_data_age_seconds:900` und das ausdrückliche `max_background_age_seconds:43200`.
- NASA-Welt-BBOX: `coverage_scope:bbox`, `coverage_verified:true`, `freshness_class:older_background`, `quality_note:older_satellite_background`; UTC-`valid_at` plausibel, Alter bei Antwort ungefähr **5,5 Stunden**. **Nicht** als aktuelles Radar deklarieren.
- **Zwei echte V2-Kartenaktivierungen** wurden nach Vertragsprüfung, `raster_ready` und Sichtfeldabdeckung bestätigt, einmal bei **Zoom 3**, einmal bei **Zoom 6**. In beiden Fällen meldete die Geometrie **6/6 gezeichnete sichtbare Kacheln** und keine ungedeckten Kacheln. Das bestätigt die Aktivierung des NASA-V2-Rasterpfads, aber ausdrücklich **keine Prüfung nichttransparenter Niederschlagspixel**.
- Die **fehlende regionale DWD-Zulieferung** ist der wichtigste noch offene WR-Untersuchungspunkt. In allen 23 V2-Serverantworten fehlt DWD; eine generische Einschränkung nennt nicht nutzbare regionale Coverage-Anfragen, ohne konkrete Providerursache in der verkürzten Zusammenfassung.
- Die WR-Antwortzeit aller 23 Anfragen betrug ungefähr **3,03–3,05 Sekunden**. Ein regionales Abfragezeitlimit ist ein sinnvoller **Prüfansatz, keine nachgewiesene Fehlerursache**. Das private WR-Koordinationsdokument fragt gezielt nach Kandidatenwahl, parallelen Coverage-Prüfungen, DWD-Zeitgültigkeit, Ablehnungen und Timeouts.

**Wichtige Abgrenzung:** Formale WR-Freigabe und 23 echte, NASA-only-V2-Ergebnisse sind vereinbar. Aus „kein bekannter WR-Codeblocker“ folgt nicht „NASA+DWD erfolgreich getestet“. Keine vorsorgliche zweite Routingarchitektur in GR bauen.

## 4. Zwei reale Nutzer-Markierungen und GR-seitiger Diagnosebefund

Der neue GR-Darstellungsmonitor enthält zwei durch den Nutzer markierte Bildprobleme bei Zoom 3 und Zoom 6. Beim zweiten lag die Markierung ungefähr **0,2 Sekunden vor** der erneuten technischen V2-Ebenenaktivierung. In beiden Fällen war ein optischer Bildfehler vom Nutzer beobachtet; der Monitor konnte keine nichttransparenten Bildpixel beweisen (`image_pixels_verified:false`). Keine Behauptung, die Bildfehler seien beseitigt.

Bei schneller Kartenbewegung wurden außerdem **45`request_budget_exhausted`-Kachelablehnungen** und **neun `stale_after_response`-Ereignisse** in den zuletzt betrachteten V2-Ereignissen festgestellt. GR nutzte im Test ein Intervall von **2 s** statt der üblichen **15 s**. Langes Schwenken und immer neue V2-Anfragen können aktive Bilder schwächen; diese GR-Darstellungsereignisse dürfen nicht als WR-Providerfehler ausgegeben werden.

**Zusätzlicher GR-Quellcodebefund, noch nicht behoben:** `_setWeatherRadarOlderSatelliteBackground(false)` in `frontend/modules/weather/precipitation-layer.js` stößt zwar eine neue Abfrage an, kann die **bereits sichtbare ältere Satellitenebene vorerst stehen lassen**. Ebenso muss eine in-flight gestartete Antwort aus der zuvor erteilten 12-h-Einwilligung beim Widerruf ungültig werden. Opt-in AUS darf kein früher autorisiertes Bild länger als zulässig sichtbar lassen. Dies ist eine präzise Codeprüfung, **noch kein nachgewiesener Opt-in-AUS-HA-Test**.

**Zweiter zu untersuchender GR-Quellcodebefund:** Das endliche Raster-Kachelanfragebudget ist an den Snapshot gebunden und wird bei langer Navigation erschöpft; ein Leaflet-Canvas kann anschließend als „geladen“ gemeldet werden, obwohl keine Bildquelle gezeichnet wurde. Keine unbeschränkten Kachelanfragen erlauben, keine leere Kachel als belegten Wetterpixel-Nachweis behandeln. Mit gezielten Regressionen und Nutzerbeobachtungen verifizieren.

## 5. Verbindliche nächste Test- und Entwicklungsreihenfolge

1. **Aktuelle Repository-Stände und installierte Runtime verifizieren.** Es gibt seit dem Original-Codecommit nur Dokumentationsänderungen; keine unnötige DRA-Zwischenversion bauen. Vor HA-Tests prüfen, dass wirklich GR 4.11.91, Integration 0.25.9 und WR 0.10.155 / Loader 158 laufen.
2. **NASA-V2 unter stabiler Karte reproduzieren:** bewusst Satelliten-Einwilligung EIN, übliches **15-s-Intervall**, nach Antwort und Kachelladen werten; `validated` → `viewport_coverage` → `staged_tiles_actual_coverage` → `raster_ready` → `active` und optisch sichtbare Pixel unterscheiden.
3. **Fehlende DWD-Quelle WR-seitig aufklären**, privates Koordinationsdokument zugrunde legen. Gefordert ist unter echtem deutschem DWD-Abdeckungsbereich **NASA `older_background` plus DWD `current`**, räumlich und zeitlich korrekt zusammen. DWD nicht im GR künstlich hinzuerfinden. Sollte eine präzise WR-Ursache erkannt sein, minimal im WR-Projekt beheben und mit Regression belegen.
4. **GR-Einwilligungswiderruf und Kachel-Budgetlebensdauer** mit strengen Regressionen und anschließender realer Prüfung bearbeiten; Opt-in AUS auch bei laufender V2-Anfrage und bereits angebundener älterer Ebene testen. Veraltete Satellitengrundlage nach Widerruf nicht durch Darstellungs-/Löschschutz legitimieren. Falls Codeänderung nötig: **ein** gebündeltes GR-Release mit Version, Importabfragen, allen drei Frontend-Spiegeln, SHA256, Runtime-/Asset-Manifest, HA-Integration, DRA-Provenienz, Regressionsprüfungen und grüner CI. Keine fragmentierten Installationsstände.
5. **Abnahmematrix anschließend vollständig:** Opt-in AUS und EIN, neue Antwort im 900-s-Radarfenster gegenüber NASA bis 12 h, DWD am Rand (inkl. minimalem Kartenkontakt), Kuba/Atlantik/Europa, Zoom **3–5 und 12–17**, Schwenken und erneutes Zentrieren, unvollständige/geografisch falsche/zeitlich ungültige Quellen, `unavailable`, V2→V1-Rückfall, Löschschutz und reale Bildpixel. Fehlender Bildbereich darf nicht stillschweigend als „0 mm/h“ bezeichnet werden.
6. **Korrelation und Real-PASS:** pro gezielter Sitzung je ein neuer GR-Weather-Engine- und WR-API-Monitor-Export, passende Korrelations-IDs; erst anschließend den entsprechenden Prüffall als bestanden bewerten. Bis dahin `P7-010 REAL-PASS` **nicht** setzen.

## 6. Dauerregeln für den Folgechat

- Nutzer arbeitet **allein**, keine Teamansprache. Möglichst eigenständig ausführen, Routine-Rückfragen und Zwischenberichte vermeiden.
- Nur vorhandene GR- und WR-Architektur weiterführen; keine parallelen Zweige oder doppelte Implementierung. GR-Entwicklung ausschließlich im GR-Repository, WR-Änderungen über die WR-Koordination.
- WR ist Datenbeschaffung, Zeit-/Quellenharmonisierung und Routenentscheidung; GR ist Konsument und Renderer. Bis zu zwölf Quellen im Gesamtmosaik, maximal vier passende Beiträge je Kachel; kein pauschales Quellen- oder Zeitlimit-Lockern.
- Sämtliche Provider-Zeitpunkte gehören in die verbindliche einheitliche UTC-Vertragsschicht. WR-P0-Audit der 252 ungeprüften Pfade ist **separat** und durch die NASA-Korrektur **nicht abgeschlossen**.
- Kein öffentlicher Export privater WR-Logs, privater Erweiterungen, Benutzerstandorte, Anmeldedaten, Tokens oder vollständiger HA-Diagnose-Rohdaten. Im öffentlichen GR-Repository nur technische, datensparsame Zusammenfassung. Exakte Diagnosen nur im privaten WR-Koordinationsbereich.
- Keine Behauptung von Pixel-Sichtbarkeit aus `coverage_verified`, `active`, `layer_mounted` oder sechs gezeichneten Geometrie-Kacheln. Kein Behaupten eines NASA+DWD-Gesamt-PASS ohne realen DWD-V2-Beitrag.

## 7. Sofort einsetzbarer Bootstrap-Prompt für den nächsten GR-Chat

```text
Bootstrap Daimos – Gewitterradar P7-010 / gemeinsame Realabnahme 17.10.2026

Projekt: TheDaimos/gewitterradar, ausschließlicher Zweig deploy/dev.
Lies zuerst die verbindlichen Übergaben:
1. docs/HANDOFF_GR_V41191_P7_010_NASA_V2_REALTEST_WR_FREIGABE_2026-10-17.md
2. docs/HANDOFF_GR_V41191_P7_010_2026-10-17.md
3. docs/P7_010_V41191_HA_REALDIAG_NASA_PASS_DWD_OFFEN_2026-10-17.md

Lies die private WeatherRouter-Gegenantwort auf TheDaimos/weather-router-dev@deploy/dev:
docs/p7-010-coordination/WR_TO_GR_2026-10-17_FREIGABE_GEMEINSAME_REALABNAHME_GR41191_WR010155.md

und die neue GR→WR-Realdiagnose:
docs/p7-010-coordination/GR_TO_WR_2026-10-17_V41191_REALTEST_NASA_V2_PASS_DWD_0_3S.md

Prüfe die aktuellen GitHub-HEADs und den echten Code. NASA-Welt-BBOX ist in GR V4.11.91 / WR V0.10.155 bereits CODE/CI und im V2-HA-Laufzeitpfad bestätigt. Nicht neu implementieren. Vollständige NASA+DWD-V2-Realabnahme ist noch OFFEN (23 V2-Antworten nur NASA). Der GR-Darstellungsmonitor meldete Bildprobleme, Raster-Kachelbudgeterschöpfung und schnelle Ansichtswechsel; GR-seitig sind Opt-in-Widerruf bei aktivem älterem Bild und Budgetlebensdauer konkret zu prüfen.

Arbeite den vorhandenen Plan möglichst vollständig selbständig weiter, ohne neue Architektur, Forks oder parallele Zweige. WR-seitige Fragen über private Koordination klären, GR-seitige Codefixes gebündelt und mit vollständigem Spiegel-/Versions-/DRA- und Regressionsteststand vorbereiten. Keine Home-Assistant-PASS-Behauptung ohne entsprechende reale Nutzerexports. Private Rohdiagnosedaten niemals in das öffentliche GR-Repository übertragen.
```

**Freigabestatus bei Erstellung:** Gemeinsamer Test formal freigegeben; echte NASA-V2-Grundlage aktiv, DWD noch nicht belegt, Raster-/Opt-in-Regression und Gesamtrealabnahme offen.

*C.K. – Eine Idee weiter gedacht.*
