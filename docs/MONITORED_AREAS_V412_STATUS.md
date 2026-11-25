# Monitored Areas V4.14 – Entwicklungsstatus

Historischer Dateiname V412 bleibt bewusst erhalten. Verbindliche Zielversion: **V4.14**, nicht V4.12 oder V4.13.

## MA-001 – Technische Ist-Analyse

- Status: **abgeschlossen und vom Betreiber abgenommen (Dokumentationsauftrag, keine DEV-Laufzeitabnahme)**.
- Analysierter Repository-Commit: [03c9f1e2914abf53635d348e1387d9e161b15554](https://github.com/TheDaimos/gewitterradar/commit/03c9f1e2914abf53635d348e1387d9e161b15554), Frontend 4.13.7 DEV / HA 0.25.185, Runtime 4137r1, Modulset E413-7A1.
- Dokumentations-Commit der vollständigen Analyse: [87636c44dbc9f6eec53dbee5416acf11636867b1](https://github.com/TheDaimos/gewitterradar/commit/87636c44dbc9f6eec53dbee5416acf11636867b1).
- Analyse: [MONITORED_AREAS_V414_MA001_IST_ANALYSE.md](MONITORED_AREAS_V414_MA001_IST_ANALYSE.md), 15 Abschnitte.
- Geänderte Dateien: ausschließlich die Analyse und diese Statusdatei, jeweils als eigener Dokumentationscommit.
- Durchgeführte Prüfungen: Remote-HEAD vor Analyse und Schreiben, rekursiver Git-Baum, gezielte Quellcode- und Funktionsprüfung, GitHub-Readback der Analyse mit 15 Abschnitten, Commit-Dateiliste ausschließlich Analyse. Statusdatei wird nach Schreiben separat per GitHub-Readback verifiziert. Eigener Commit-SHA kann nicht selbstreferenziell im selben Commit stehen; der oben angegebene Dokumentationscommit identifiziert die Analyse.
- Keine Anwendungscode-, Build-, Workflow-, WR-, HA-, Release- oder V4.13-Finalisierungsänderung; keine manuell gestarteten Actions oder Laufzeitprüfungen.

### Wesentliche Erkenntnisse und Codeanker

| Befund | Codeanker |
|---|---|
| Native Lifecycle-/API-Integrationspunkte | [__init__.py](https://github.com/TheDaimos/gewitterradar/blob/03c9f1e2914abf53635d348e1387d9e161b15554/custom_components/gewitterradar/__init__.py#L463-L539) async_setup, async_setup_entry, async_unload_entry |
| Modularer Loader und Prototyp-Installation | [gewitterradar.js](https://github.com/TheDaimos/gewitterradar/blob/03c9f1e2914abf53635d348e1387d9e161b15554/frontend/gewitterradar.js), [runtime.js](https://github.com/TheDaimos/gewitterradar/blob/03c9f1e2914abf53635d348e1387d9e161b15554/frontend/modules/core/runtime.js) defineModule |
| Ortssuche und Local-To-do, Soft-Delete | [controls.js](https://github.com/TheDaimos/gewitterradar/blob/03c9f1e2914abf53635d348e1387d9e161b15554/frontend/modules/ui/controls.js#L1066-L1245) v407UseCandidate, v407LoadSavedPlaces, v407SaveCandidate, v407RemoveSavedPlace |
| Beweglicher Referenztracker, kein MA-Tracker | [device_tracker.py](https://github.com/TheDaimos/gewitterradar/blob/03c9f1e2914abf53635d348e1387d9e161b15554/custom_components/gewitterradar/device_tracker.py) GewitterradarReferenceTracker |
| Browsergebundener Einzelblitz-Ingest, keine dauerhafte MA-Historie | [strikes-warnings.js](https://github.com/TheDaimos/gewitterradar/blob/03c9f1e2914abf53635d348e1387d9e161b15554/frontend/modules/map/strikes-warnings.js#L15-L98) _ingestStrikes |
| WR Consumer/Event-Feed-Vertrag, tatsächlicher Provider offen | [consumer-client.js](https://github.com/TheDaimos/gewitterradar/blob/03c9f1e2914abf53635d348e1387d9e161b15554/frontend/modules/weather/consumer-client.js#L1-L159) createWeatherRouterClient, resolveEventWindow |
| HA-Benutzer und Vault-Profil getrennt, private HA Stores | [settings_vault.py](https://github.com/TheDaimos/gewitterradar/blob/03c9f1e2914abf53635d348e1387d9e161b15554/custom_components/gewitterradar/settings_vault.py), [settings-vault.js](https://github.com/TheDaimos/gewitterradar/blob/03c9f1e2914abf53635d348e1387d9e161b15554/frontend/modules/core/settings-vault.js) |
| Premium-UI, Chevron, Drag und Scope-Persistenz als Bausteine | [premium-ui.js](https://github.com/TheDaimos/gewitterradar/blob/03c9f1e2914abf53635d348e1387d9e161b15554/frontend/modules/weather/premium-ui.js) |

### Offene DEV-Nachweise und Einschränkungen

- **Betreiberbeobachtung:** Mehrere manuell konfigurierte Blitzortung-Standorte waren gleichzeitig in HA sichtbar. Unabhängige parallele Ereignisversorgung, Herkunftszuordnung, Coverage, Reconnect und Ressourcen noch gezielt auf VM109 prüfen. Betreiber kann zusätzliche Standorte/Tracker einrichten. Kein MA-001-Blocker.
- WR-Einzelblitz-Capability und echte Provenance/Zeiten/IDs sowie serverseitigen Consumerweg klären; Wetterlayer sind kein Einzelblitznachweis.
- Spätere Tests: browserunabhängige Aufnahme, Neustart/Datenlücken, überlappende Areas, Admin-/ACL-Negativtests, DB-Fehler/Restore, Default-OFF ohne DB/Entities/UI-Eingriff, UI-Touch und Kartenisolation.
- Keine HA-/Browser-/MQTT-Liveprüfung; einzelne große Quellen gezielt ausgewertet, nicht vollständiger Zeilenaudit. Benannte Plattform-/Testdateien teilweise nur als Inventar. Keine Behauptung grüner Tests. Havanna-Bild laut Konzept Library-Referenz; noch kein Designabgleich.

## Historische Übergabe an MA-002 (vor Ausführung)

**Vorbereitet, nicht gestartet.** Architekturvertrag anhand Abschnitt 14 der Analyse: Modulgrenzen, Lifecycle, Backend-Schnittstellen, Identität/ACL, SQLite-Pfad, Provider-/Event-Datenfluss, Feature-Flag standardmäßig AUS, explizite Tracker-/Entity-Opt-ins und geschützte Bestandsfunktionen. Keine Implementierung vor separatem Auftrag. Offene Fähigkeiten durch gezielte spätere DEV-Tests klären, nicht künstlich als Blocker deklarieren.


## MA-002 – Verbindliche Modularchitektur

- Status: **Dokumentationsauftrag abgeschlossen und GitHub-verifiziert; Betreiberabnahme noch offen.**
- Analysierter Repository-HEAD: [2a04b65b780720ad3a7d2e526254616e56940d2f](https://github.com/TheDaimos/gewitterradar/commit/2a04b65b780720ad3a7d2e526254616e56940d2f), Frontend 4.13.7 DEV / HA 0.25.185. MA-001-Codebasis und Abnahme bleiben erhalten.
- Architektur: [MONITORED_AREAS_V414_MA002_ARCHITEKTUR.md](MONITORED_AREAS_V414_MA002_ARCHITEKTUR.md), 16 Abschnitte; [Dokumentationscommit 1e7fbd95224a6195b9a7ed13e5813cf5f4e5ffe4](https://github.com/TheDaimos/gewitterradar/commit/1e7fbd95224a6195b9a7ed13e5813cf5f4e5ffe4).
- Entscheidungen: isoliertes Python-Paket und optionales Frontend-Modul, Feature-Flag default OFF ohne Ressourcen; native entry-bezogene Lifecycle-Fassade; eine SQLite-DB im HA-Konfigurationsbereich, serialisierter Worker, WAL/Transaktionen/Schema-Versionierung; versionierte authentifizierte WebSocket-API, UUID/Revision/Receipts und serverseitige ACL; unabhängige Standorttracker, Quellenadapter, gemeinsame Rohhistorie und persönliche Alarmfenster; WR alleinige Providerautorität; zusätzliche HA-Entitäten nur explizit und default OFF.
- Eigenständig gesetzte technische Parameter und fachlich offene Punkte sind in Abschnitt 14 gekennzeichnet, insbesondere 0-m-Toleranz, gemeinsame Sitzungsgrenze, getrenntes Bus-Opt-in und vorläufiger Admin-Gesamtbackup-Zugriff. Keine Laufzeitfähigkeit vorgetäuscht.
- Offene DEV-Prüfungen: MA-026 parallele Blitzortung-Abos/Zuordnung/Last (Mehrfachkonfiguration beobachtet); MA-029 Distanzsemantik; MA-030 tatsächlicher WR-Ereignisprovider und unterstützter Serverport; MA-031 Quell-Dedupe; MA-033 Sitzungsgrenze; MA-035–038 Zielrechte/Push; MA-046–049 Registry/Recorder/Bus; MA-050/051 Backup/Restore-Rechte und HA-Hook; MA-055 Langzeit/Recovery/UI.
- Nachweis: aktueller HEAD und Version geprüft, Fachkonzept/Plan/MA-001/Schutzverträge zugrunde gelegt; Architektur nach Commit erneut gelesen, 16 Abschnitte vorhanden, Commit-Dateiliste ausschließlich Architektur. Statusupdate separat mit aktuellem Blob-SHA. Keine Anwendungscode-/Build-/Workflow-/Release-/WR-/HA-Änderung, keine manuell gestarteten Actions.
- Testvertrag: task_id=MA-002; implementation_commit=nicht anwendbar; documentation_commit=1e7fbd95224a6195b9a7ed13e5813cf5f4e5ffe4; changed_paths=docs/MONITORED_AREAS_V414_MA002_ARCHITEKTUR.md, docs/MONITORED_AREAS_V412_STATUS.md; affected_contracts=MA-Sollarchitektur, keine Laufzeitänderung; test_level=Dokumentationsprüfung; commands=GitHub HEAD/File/Commit-Readback; results=Architektur verifiziert, Status-Readback nach Schreiben; latest_T2_baseline_sha=keine MA-Baseline; latest_T3_baseline_sha=keine MA-Baseline; invalidated_baselines=keine durch Dokumentation; known_blockers=keine für Architektur/Skelett, V4.14-Codebasis vor Implementierung prüfen; next_task=MA-003.

## Nächster Auftrag: MA-003 – Backend-Skelett

**Vorbereitet, nicht gestartet.** Ausschließlich die in Architekturabschnitt 15 spezifizierte Fassade, config.py, runtime.py, contracts.py und minimale Lifecycle-Anbindung auf autorisierter V4.14-Entwicklungsbasis. Keine DB/Tabellen/Entities/Tracker/Listener/Frontend-Änderung; Flag OFF ohne Seiteneffekte, ON inert; T0/T1 gezielt. V4.13-Finalisierung nicht beeinträchtigen. Kein automatischer Folgetask.
