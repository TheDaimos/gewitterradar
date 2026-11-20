# GR-OPERA-P0 – V4.11.107 DEV: Auslieferung und kontrollierte Testgrenzen

**Datum:** 24.10.2026  
**Repository/Zweig:** `TheDaimos/gewitterradar@deploy/dev`  
**Ausgangsstand:** V4.11.106 / `472f2d8f98014337f175970553e7d3926e3960f3`  
**Neuer Stand:** **V4.11.107 DEV**, `411107r1`, Modulsatz **E411-107A1**, `weather.consumer-client` **1.2.9**, `core.manifest` **1.2.155**.  
**Gegenstelle:** WeatherRouter V0.10.202 DEV / Loader 205 (Benutzervorgabe; nicht in HA DEV verifiziert).

## Ursache / tatsächliche Implementierung
Der bereits implementierte OPERA-Diagnosehelfer war in den drei Frontend-Kopien vorhanden, aber die Laufzeitidentität blieb auf V4.11.106. Deshalb bot die DRA-V2-Vorschau keinen eindeutig unterscheidbaren Installationskandidaten. Die Schaltfläche war zwar als HTML in der Weather-Engine-Diagnose definiert und ihre Ereignisverknüpfung im Quellcode vorhanden, jedoch war die Auslieferung mit nicht aktualisiertem Versions- und Modulmanifest nicht eindeutig nachvollziehbar.

Durchgeführte Quellcodeänderungen:
- `modules/weather/consumer-client.js` in allen drei Frontend-Verzeichnissen: ausdrückliche Beschriftung **„OPERA-Testdarstellung starten“**, während laufender Anforderung deaktivierter Startknopf, Schließen/Entfernen, Statusprotokoll und Bereinigung beim Schließen des Diagnosefensters; Leaflet aus bestehender `loadLeafletJs`-Modulabhängigkeit; getrennte manuelle Diagnose.
- Dynamischer Import des vorhandenen `p7-010/opera-diagnostic-tile.js` mit neuer Versionskennung.
- V4.11.107 in allen drei `version.js`, `gewitterradar.js`, `module-manifest.js` und `assets/gewitterradar-runtime-manifest.json` sowie `custom_components/gewitterradar/build_info.py`.
- `scripts/build-frontend.mjs`: die bereits ausgelieferte OPERA-Hilfsdatei wurde in das explizite Inventar der Zusatzmodule aufgenommen; Versionskontrollen auf den neuen Stand aktualisiert.
- Neuer Node-Test `tests/test_gr_opera_p0_delivery.mjs` zur Kontrolle von Schaltflächenverknüpfung, Adapter, Spiegelgleichheit, Versions- und Modulsatz.
- Keine WeatherRouter-Datei verändert; normale V1-/V2-Niederschlags- und Gefahrenanbindung unverändert.

## Tatsächlich ausgeführte Prüfungen
1. Der bisherige Entwicklungsbericht wurde vollständig aus dem GitHub-Zweig gelesen.
2. JS-Syntaxcheck von `consumer-client.js` in einer JavaScript-Ausführungsumgebung mittels `new Function` nach Entfernung der statischen ES-Modulimporte und Ersetzung von `import.meta`: **PASS**. Das ist kein vollständiger Modul-/Browserintegrationstest.
3. Entsprechende JS-Syntaxchecks für `opera-diagnostic-tile.js` und `module-manifest.js`: **PASS**.
4. Live-Rücklesung aus GitHub und byteweiser Vergleich der drei Auslieferungsstände für `version.js`, `module-manifest.js`, `gewitterradar.js`, Runtime-Manifest, `consumer-client.js` und `opera-diagnostic-tile.js`: **PASS**.
5. Statische Prüfung der OPERA-Schaltflächenkennung/-Beschriftung und der Modul-/Runtime-Versionen: **PASS**.

**Nicht ausgeführt:** Python-Regressionssuite, vollständige Node-Testsuite einschließlich des neu eingecheckten Tests, Browser- und HA-DEV-Realtests, DRA-V2-Dateivergleich/Installation, End-to-End-Export2Git und Prüfung authentifizierter echter HDF5-/PNG-Daten. Der zugängliche Container konnte das private GitHub-Repository nicht klonen (Netzwerk-DNS nicht erreichbar). GitHub-Schreib- und Lesezugriffe erfolgten ausschließlich über die vorhandene GitHub-Anbindung. Daher werden diese Tests ausdrücklich nicht als bestanden gemeldet.

## Wissenschaftliche und Betriebsgrenzen
Der vorhandene OPERA-Adapter stellt `diagnostic:true` ausdrücklich; akzeptiert ausschließlich `diagnostic_unverified` bei `raster_approved=false`; fordert PNG-Dateien mit Bearer-Authentifizierung an; nutzt Blob-URLs und verwirft sie beim Schließen. Es gibt **keine** wissenschaftliche Freigabe, keinen Normal-Layer-Cache und keine Freigabe für Gefahrenbewertung. Georeferenz, Nord-Süd-Orientierung, NoData-Transparenz, Frische, Quellenwechsel, Neustart und Vollständigkeit der Kachelbelegung sind auf HA DEV VM 109 weiterhin praktisch zu kontrollieren.

## Freigabeentscheidung
**QUELLCODE-TESTKANDIDAT GESPEICHERT; DRA-V2-INSTALLATION NOCH NICHT FREIGEGEBEN.** Zuerst müssen die vollständigen relevanten JavaScript-/Python-Regressionen in einer echten Arbeitskopie erfolgreich ausgeführt und die Laufzeit-/Auslieferungsprüfung nachgewiesen werden. Erst anschließend kontrollierte Installation auf HA DEV VM 109; niemals HA PROD VM 101. Ohne Realabnahme keine erfolgreiche OPERA-Anzeige behaupten.

C.K. – Eine Idee weiter gedacht.
