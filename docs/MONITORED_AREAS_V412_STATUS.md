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

- Status: **Abgeschlossen, GitHub-verifiziert und fachlich abgenommen (25.11.2026); drei dokumentierte Vorbehalte für spätere Arbeitspakete.**
- Analysierter Repository-HEAD: [2a04b65b780720ad3a7d2e526254616e56940d2f](https://github.com/TheDaimos/gewitterradar/commit/2a04b65b780720ad3a7d2e526254616e56940d2f), Frontend 4.13.7 DEV / HA 0.25.185. MA-001-Codebasis und Abnahme bleiben erhalten.
- Architektur: [MONITORED_AREAS_V414_MA002_ARCHITEKTUR.md](MONITORED_AREAS_V414_MA002_ARCHITEKTUR.md), 16 Abschnitte; [Dokumentationscommit 1e7fbd95224a6195b9a7ed13e5813cf5f4e5ffe4](https://github.com/TheDaimos/gewitterradar/commit/1e7fbd95224a6195b9a7ed13e5813cf5f4e5ffe4).
- Entscheidungen: isoliertes Python-Paket und optionales Frontend-Modul, Feature-Flag default OFF ohne Ressourcen; native entry-bezogene Lifecycle-Fassade; eine SQLite-DB im HA-Konfigurationsbereich, serialisierter Worker, WAL/Transaktionen/Schema-Versionierung; versionierte authentifizierte WebSocket-API, UUID/Revision/Receipts und serverseitige ACL; unabhängige Standorttracker, Quellenadapter, gemeinsame Rohhistorie und persönliche Alarmfenster; WR alleinige Providerautorität; zusätzliche HA-Entitäten nur explizit und default OFF.
- Eigenständig gesetzte technische Parameter und fachlich offene Punkte sind in Abschnitt 14 gekennzeichnet, insbesondere 0-m-Toleranz, gemeinsame Sitzungsgrenze, getrenntes Bus-Opt-in und vorläufiger Admin-Gesamtbackup-Zugriff. Keine Laufzeitfähigkeit vorgetäuscht.
- Offene DEV-Prüfungen: MA-026 parallele Blitzortung-Abos/Zuordnung/Last (Mehrfachkonfiguration beobachtet); MA-029 Distanzsemantik; MA-030 tatsächlicher WR-Ereignisprovider und unterstützter Serverport; MA-031 Quell-Dedupe; MA-033 Sitzungsgrenze; MA-035–038 Zielrechte/Push; MA-046–049 Registry/Recorder/Bus; MA-050/051 Backup/Restore-Rechte und HA-Hook; MA-055 Langzeit/Recovery/UI.
- Nachweis: aktueller HEAD und Version geprüft, Fachkonzept/Plan/MA-001/Schutzverträge zugrunde gelegt; Architektur nach Commit erneut gelesen, 16 Abschnitte vorhanden, Commit-Dateiliste ausschließlich Architektur. Statusupdate separat mit aktuellem Blob-SHA. Keine Anwendungscode-/Build-/Workflow-/Release-/WR-/HA-Änderung, keine manuell gestarteten Actions.
- Testvertrag: task_id=MA-002; implementation_commit=nicht anwendbar; documentation_commit=1e7fbd95224a6195b9a7ed13e5813cf5f4e5ffe4; changed_paths=docs/MONITORED_AREAS_V414_MA002_ARCHITEKTUR.md, docs/MONITORED_AREAS_V412_STATUS.md; affected_contracts=MA-Sollarchitektur, keine Laufzeitänderung; test_level=Dokumentationsprüfung; commands=GitHub HEAD/File/Commit-Readback; results=Architektur verifiziert, Status-Readback nach Schreiben; latest_T2_baseline_sha=keine MA-Baseline; latest_T3_baseline_sha=keine MA-Baseline; invalidated_baselines=keine durch Dokumentation; known_blockers=keine für Architektur/Skelett, V4.14-Codebasis vor Implementierung prüfen; next_task=MA-003.

### Fachliche Abnahme MA-002 – 25.11.2026

Unabhängige Prüfung des vollständigen Architekturvertrags gegen MA-001 und das verbindliche Fachkonzept: **ACCEPTED_USER (Dokumentations-/Architekturabnahme, keine Implementierungs- oder DEV-Laufzeitabnahme)**. MA-001 und MA-002 werden nicht grundlos erneut bearbeitet. Der abgenommene Architekturcommit bleibt unverändert.

Verbindliche Vorbehalte (keiner blockiert MA-003):

- **A – Datenbanksicherungen (MA-050/051):** Das Fachkonzept sieht Sicherungsmöglichkeiten für HA-Benutzer vor. Die vorläufige Beschränkung vollständiger Systemsicherungen auf HA-Administratoren ist eine technische Sicherheitsentscheidung, keine abschließend freigegebene fachliche Einschränkung. Vor Implementierung Rechte und gewünschte Benutzer-Sicherungsmöglichkeiten ausdrücklich klären; systemweiter Restore weiterhin gesondert absichern.
- **B – HA-Event-Bus (MA-048):** Der zusätzliche Event-Bus-Opt-in ist eine vorgeschlagene technische Sicherheitsentscheidung, keine abschließend freigegebene neue Benutzerentscheidung. Vor Umsetzung fachlich prüfen. Optionale HA-Entitäten bleiben unabhängig davon standardmäßig AUS.
- **C – Ereignissitzungen (vor MA-033):** Gemeinsame Ereignissitzungen und persönliche Benachrichtigungsfenster sind im Architekturmodell getrennt; genaue Abgrenzung fachlich prüfen. Persönliche Abschlussintervalle bleiben 15–60 Minuten in 5-Minuten-Schritten, Default 15 Minuten. Keine Reduktion des Fachkonzepts.

## Nächster Auftrag: MA-003 – Backend-Grundgerüst

**Status: VORBEREITET / nicht gestartet (Codebasis-Freigabe ausstehend).**

### Veröffentlichungs- und Basisprüfung am 25.11.2026

| Prüfung | Tatsächlicher GitHub-Befund |
|---|---|
| deploy/dev | [ea44ea6550d76e8b778cccd06af5d583955494d6](https://github.com/TheDaimos/gewitterradar/commit/ea44ea6550d76e8b778cccd06af5d583955494d6); frontend/version.js: 4.13.7 DEV, HA 0.25.185, Runtime 4137r1. |
| main | [a37d4b2ad22a0c2541d25edd97dc53b4cfa3264d](https://github.com/TheDaimos/gewitterradar/commit/a37d4b2ad22a0c2541d25edd97dc53b4cfa3264d); frontend/version.js: V4.13 FINAL, Produktversion 4.13.7, HA 0.25.186, Runtime 4137r2. |
| Öffentlicher Release | GitHub releases/latest meldet v4.12, veröffentlicht 23.11.2026; Release-Abfragen v4.13 und v4.13.0 liefern HTTP 404. Eine veröffentlichte V4.13 FINAL ist damit noch nicht verifiziert. |
| V4.13-Finalisierung | Release-/Publish-Request-Branches vorhanden, darunter release/publish-request/v4.13-20261125 bei 94cc165e9d1c5856a787f57006b7fd54707435c6. Auf main sind Shared Frontend, Integration, Hi-Res Asset Retention, Diagnostic Contract und Pages für a37d4b2 erfolgreich gemeldet. Dies ist kein Ersatz für den Veröffentlichungsnachweis. |
| V4.14 | In den abgefragten Branch-Refs keine eindeutig freigegebene V4.14-Entwicklungsbasis gefunden; deploy/dev trägt noch V4.13-Identität. |
| WR Partner-HEAD | [850c3542a8b3b181edc5837205bbeb374ed72eab](https://github.com/TheDaimos/weather-router-dev/commit/850c3542a8b3b181edc5837205bbeb374ed72eab) auf deploy/dev; ausschließlich gelesen. |

Entscheidung: entsprechend Betreiberauftrag kein Start von MA-003, solange die V4.14-Codebasis nicht sicher freigegeben ist. Ein separater Feature-Branch ist grundsätzlich zulässig, wird aber nicht als impliziter Ersatz für die fehlende Basisfreigabe angelegt. Keine Änderungen am aktiven Releasekandidaten, keine Branch-Erstellung, keine Releases oder Installationen. Kein erneuter Architekturauftrag erforderlich. Bei Wiederaufnahme aktuellen Veröffentlichungsstand und autorisierte V4.14-Basis erneut prüfen.

### Ausführungsumfang nach Basisfreigabe

Ausschließlich custom_components/gewitterradar/monitored_areas/__init__.py, config.py, runtime.py, contracts.py und minimale additive Lifecycle-Anbindung gemäß Architekturabschnitt 15. Globales Feature-Flag standardmäßig AUS, keine Upgrade-Aktivierung; OFF ohne DB/Dateien, Tasks, Listener, Entitäten oder API-Registrierung; ON nur inert testbares Runtime-Skelett; wiederholbarer Start und idempotenter Stop; Fehlerisolation gegenüber GR. Keine Implementierung späterer Tasks.

T0/T1 ausschließlich: Python-Import/Syntax, Default-OFF, keine Ressourcen bei OFF, ON inert, wiederholter Start/Stop, Fehlerisolation. Keine vollständige Regression, kein Frontend-Build, keine DEV-Installation ohne gesonderte Freigabe. Keine Tests als ausgeführt ausgeben: MA-003 noch nicht begonnen. Keine neue MA-T2/T3-Baseline.

Übergabenachweis: nur diese Statusdatei wird für Abnahme/Vorbehalte/Basisprüfung aktualisiert; GitHub-Readback und Commit-Dateiliste nach Schreiben. Nächster Task bleibt MA-003, kein automatischer Start weiterer Tasks.
