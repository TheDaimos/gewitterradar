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

**Historischer Status vor V4.13-Veröffentlichung: VORBEREITET / nicht gestartet. Durch den nachfolgenden Abschluss MA-003 abgelöst.**

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


## MA-003 – Isoliertes Backend-Grundgerüst | Abschluss 25.11.2026

**Status: ACCEPTED_USER für den vereinbarten T0/T1-Umfang; fachliche Abnahme durch unabhängige Prüfung bestätigt. Keine DEV-Installation oder Betreiber-Laufzeitabnahme. MA-001 und MA-002 bleiben fachlich abgenommen; Vorbehalte A/B/C unverändert.**

### Freigabe und isolierte V4.14-Basis

- V4.13 FINAL: [offizielles Release](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.13), veröffentlicht 25.11.2026 08:46:53 UTC, weder Draft noch Prerelease. Release-Target und Tag v4.13 zeigen identisch auf [509daeb7245f42b23e46f72b4d002c42f0d7f56e](https://github.com/TheDaimos/gewitterradar/commit/509daeb7245f42b23e46f72b4d002c42f0d7f56e). Installationspakete und Golden-Master-Artefakte vorhanden (Asset-Liste geprüft; keine erneute Paket-/Hash-Abnahme).
- Aktueller main vor Arbeit: [37f1aca54cd505fd91a2b1b0014cd7c6c280b26f](https://github.com/TheDaimos/gewitterradar/commit/37f1aca54cd505fd91a2b1b0014cd7c6c280b26f), sieben Commits nach Tag, ausschließlich fünf Workflow-/Dokumentationspfade gegenüber Tag verändert. deploy/dev vor Arbeit: [7d3a1d3f26cf7da26dbcde7f551bfd292ed5cf3c](https://github.com/TheDaimos/gewitterradar/commit/7d3a1d3f26cf7da26dbcde7f551bfd292ed5cf3c), gegenüber main divergiert und trägt noch V4.13-DEV-Identität. Kein Reset, Merge oder Code-Push auf deploy/dev/main. WR deploy/dev gelesen: 850c3542a8b3b181edc5837205bbeb374ed72eab; Schutzvertrag gelesen, kein WR-Schreibzugriff.
- Autorisierter isolierter V4.14-Arbeitsbranch: [feature/v4.14-monitored-areas](https://github.com/TheDaimos/gewitterradar/tree/feature/v4.14-monitored-areas), vom geprüften aktuellen main-SHA 37f1aca54cd505fd91a2b1b0014cd7c6c280b26f erstellt und initialer Ref per GitHub verifiziert. Entscheidung: auf veröffentlichtem Code einschließlich neuerer main-Wartungsregeln aufsetzen, nicht divergente alte V4.13-DEV-Basis blind übernehmen. Die drei MA-Dokumente von deploy/dev unverändert in die Feature-Basis übernommen. Aktive FINAL-Release-Publish-Workflows sind auf main bzw. spezielle Release-Branches begrenzt; allgemeine bestehende Push-CI kann automatisch laufen. Keine manuell gestartete CI, keine Workflow-Änderung, keine Release-Anforderung.
- Arbeitsidentität V4.14 / MA-003, **reiner Quellcode-Feature-Branch, nicht installationsfähig freigegeben**. Geerbte V4.13-Frontend-/Manifest-/DRA-Metadaten bewusst nicht geändert, da der Auftrag Frontend-Build und Auslieferung ausschließt. Vor einer späteren DRA-/Installationsfreigabe neue vollständige DEV-Identität mit konsistenten Spiegeln erzeugen; keine V4.13-Paketidentität für eine neue Installation verwenden. Keine Promotion nach deploy/dev ohne gesonderte Freigabe.

### Implementierung

- [Implementierungscommit d6a04d09](https://github.com/TheDaimos/gewitterradar/commit/d6a04d09a93805f8ae311d6d46ecfb1988932630), [Testhärtung und geprüfter Code-SHA 5f21f1ba9dd510a02557b0120505f5d624d96bed](https://github.com/TheDaimos/gewitterradar/commit/5f21f1ba9dd510a02557b0120505f5d624d96bed).
- Paket custom_components/gewitterradar/monitored_areas/: config.py (fehlender Key/False/ungültiger Wert -> OFF; nur bool True aktiviert), contracts.py (LifecycleStatus), runtime.py (inert, keine Ressourcen; non-suspending, idempotente Zustandswechsel), __init__.py (async_setup_monitored_areas und async_unload_monitored_areas, Fehlerisolation und Cleanup). Kein persistierter Default, kein Optionsmigrationspfad, keine HA-API-Registrierung.
- Minimaler bestehender Integrationshook in custom_components/gewitterradar/__init__.py: optionales Runtime-Feld None; MA-Start nach erfolgreichen Standardplattformen/Sidebar; MA-Stop nur bei erfolgreichem Plattform-Unload; bei abgelehntem Unload Runtime behalten. Fehler im MA-Start/Stop werden geloggt und nicht als Fehler der bestehenden Integration propagiert. Kein Zugriff auf fremde ConfigEntries, Referenztracker oder Wetterprovider.
- Keine Datenbank/Dateien, Tabellen, Tasks, Listener, Tracker, Entitäten, API-Kommandos, UI oder neue fachliche Funktionen auch bei ON. ON ready bezeichnet ausschließlich gestartetes Skelett.
- Quellvergleich main -> geprüfter Code-SHA: exakt fünf Python-Anwendungspfade (vier neue Paketdateien plus Integration), scripts/test-ma-003.py, drei übernommene Dokumente; keine übrigen Pfade. Kein Build/Loader/Frontend/Workflow/HA/WR geändert. Betroffen allein native Entry-Lifecycle-Anbindung; deshalb keine Wetter-/Karten-/UI-Regressionsmatrix in MA-003.

### Tatsächlich ausgeführte T0/T1-Nachweise

Lokale Python 3.13.5-Umgebung, ohne HA/voluptuous/pytest-HA-Plugin. Git-Checkout via Netzwerk scheiterte an DNS; daher GitHub-Connector-Readback, lokale exakte Textkopien und Git-Blob-Hashabgleich. Alle sechs vollständigen Python-Dateien byteidentisch zu den geprüften GitHub-Blobs:

| Datei | Git-Blob-SHA |
|---|---|
| monitored_areas/__init__.py | 94b7c2571e89e5cf900596b152a58ad645a3a58b |
| monitored_areas/config.py | e2bcff0b470b827210dff97b7faf48e1c03fdebe |
| monitored_areas/contracts.py | 24dbb5c3ffd828a34a19b9260a38c5404f940704 |
| monitored_areas/runtime.py | df92a69d53b9fb10452335f62284ca705f9628c6 |
| gewitterradar/__init__.py | 9cc75b7f43bcac9e7feedd80a827fcd9e2a60941 |
| scripts/test-ma-003.py | a3a3b35af38bbbed7ae4e52aac696f094f6b6706 |

```sh
python -m py_compile custom_components/gewitterradar/monitored_areas/*.py custom_components/gewitterradar/__init__.py scripts/test-ma-003.py
python scripts/test-ma-003.py
```

T0: vollständige Syntaxprüfung aller sechs Dateien erfolgreich; tatsächlicher Import des neuen MA-Pakets im isolierten Parent-Modul erfolgreich. T1 (letzter Lauf, 0.028 s): vier Tests erfolgreich, keine Fehler.
- test_off: fehlender/False/1/"true"-Flag, keine Runtime-Konstruktion, keine Datei-/SQLite-/Task-Aufrufe, keine HA-Ressourcen, keine Optionsmutation, keine verschluckten Fehler.
- test_on_inert_restart: explizites True, ready/stopped, wiederholter Start/Stop/Restart, keine neuen Tasks/Datei-/SQLite-/HA-Zugriffe.
- test_failure_isolated: Konstruktor-/Start-/Stop-Fehler, Cleanup und Fehlerlogging.
- test_native_hook_contract: tatsächliche Setup-/Unload-Funktionen aus vollständigem, blob-verifiziertem Integrationsquelltext per AST mit schmalen HA-Fakes ausgeführt, Standardplattform-Forward bleibt erfolgreich, OFF/ON, abgelehnter Unload behält Runtime, erfolgreicher Unload räumt Feld, MA-Startfehler verhindert GR-Setup nicht.

Dies sind lokale Unit-/Contract-Tests, kein vollständiger Import der HA-Integration mit echten HA-Abhängigkeiten und kein HA-/Browser-Realtest. Keine DEV-/PROD-Installation, kein Release, kein Frontend-Build, keine T2/T3-Regression gestartet. Automatische allgemeine Push-CI ist unabhängig davon möglich und wird nicht als MA-T0/T1-Nachweis behauptet.

### Statusvertrag

task_id=MA-003; implementation_commit=d6a04d09a93805f8ae311d6d46ecfb1988932630; tested_commit=5f21f1ba9dd510a02557b0120505f5d624d96bed; changed_paths=vier MA-Paketdateien, Integration, Testskript, drei übernommene MA-Dokumente und Statusupdate; affected_contracts=Flag/Lifecycle/Entry-Integration; test_level=T0/T1; commands=oben; results=Syntax/Import PASS, 4/4 Tests PASS, exakte Blob-Identität; latest_T2_baseline_sha=keine MA-Baseline; latest_T3_baseline_sha=keine MA-Baseline; invalidated_baselines=keine MA-Baseline vorhanden; known_blockers=keine für MA-003-T0/T1, DEV-Realtest und neue Auslieferungsidentität erst später; next_task=MA-004.

## Nächster Auftrag: MA-004 – Unsichtbares Frontend-Skelett

Historischer Vorbereitungsstand, durch nachfolgenden MA-004-Abschluss abgelöst. MA-003 fachlich abgenommen für T0/T1, nicht VERIFIED_DEV. MA-005 bleibt das spätere P00-Realtest-Gate. Die bestehende Statusdatei auf deploy/dev wird als kanonischer Übergabepunkt dokumentarisch synchronisiert; Code verbleibt ausschließlich im Feature-Branch.


## MA-004 – Unsichtbares Frontend-Skelett | Abschluss 25.11.2026

**Status: ACCEPTED_USER – MA-004 fachlich unabhängig abgenommen; T0/T1 und Build-/Inventar-/Integritätsprüfungen erfolgreich. Keine HA-DEV-Laufzeitabnahme.**

MA-001 bis MA-003 fachlich abgenommen. Die drei MA-002-Vorbehalte bleiben unverändert. Keine erneute Grundsatzanalyse. Ausschließlich der autorisierte Branch feature/v4.14-monitored-areas enthält MA-Code. Vorheriger Feature-HEAD: 2e1cea524c540b9e9c2a3625b1d23713b564eeb9. V4.13 FINAL geschützt: main 37f1aca54cd505fd91a2b1b0014cd7c6c280b26f, v4.13 509daeb7245f42b23e46f72b4d002c42f0d7f56e; WR deploy/dev 850c3542a8b3b181edc5837205bbeb374ed72eab; alle drei Refs vor/nach Implementierung unverändert.

### Implementierung und Identität

- [Implementierung](https://github.com/TheDaimos/gewitterradar/commit/16f638d0926fb434fb89eb822a8802b3babfe01f): isolierter Einstieg monitored-areas/index.js, per Card WeakMap Runtime, nur explizites bool True, inert; idempotenter Start/Teardown; dynamischer Import über vorhandenen gewitterradarImport mit separater Fehlergrenze; laufender Import wird bei Disconnect/OFF logisch invalidiert. Minimalhooks in setConfig/connectedCallback/disconnectedCallback. Kein MA-DOM/CSS, keine API, Timer, Listener, Storage oder Standortfunktionen. Expliziter Card-Konfigurationswert dient nur dem Skelett-Test, keine Backend-Autorisierung; produktive Capability-Erkennung später. Kein zweiter Loader oder Registry.
- [Distribution](https://github.com/TheDaimos/gewitterradar/commit/7e565565ec386a7efef9ef0bdb5f945ed32afb4f): V4.14.1 DEV / HA 0.25.187 / Runtime 4141r1 / E414-1A1; canonical source, native und dashboard/dist synchron; SHA256 aus tatsächlichen UTF-8-Dateibytes abgeleitet. Installationsfreigabe bleibt ausstehend.
- [Testskript](https://github.com/TheDaimos/gewitterradar/commit/777ba55a836ac83b9356a4a125358264b5de6e1d): scripts/test-ma-004.mjs, fünf gezielte Tests.
- [Korrigierter und tatsächlich getesteter Commit 3d3b88aaf47c12b2b72eeef4f2cd2c629f3822c6](https://github.com/TheDaimos/gewitterradar/commit/3d3b88aaf47c12b2b72eeef4f2cd2c629f3822c6): historischer Source-Test erwartete exakt 37 Gesamteinträge (erster automatischer [CI-Lauf](https://github.com/TheDaimos/gewitterradar/actions/runs/45586733353), Fehler scripts/test-v41169-data-sources.mjs:16). Ursache behoben: weiterhin exakt 37 Pflichtmodule, für 4.14 genau der versionierte optionale MA-Eintrag, andere Releases unverändert 37. Keine Entfernung von Schutzprüfungen. Neuer schmaler öffentlicher CI-Workflow ma-004-targeted.yml nur für Feature-Branch und relevante Pfade.
- Manifest und Runtime-Inventar enthalten 38 deklarierte Module, davon 37 Pflichtmodule und genau monitored-areas.lifecycle 0.1.0 optional. OFF wird nicht importiert, fehlende Pflichtmodule bleiben Fehler, geladene optionale Versionsabweichung bleibt Fehler. Kein globales Abschalten der Registry-Prüfung. Build validiert exakte Moduldateimenge inklusive bestehender Support-Module (114/114); bestehende Asset-/Spiegel-/Hash-/DRA-Prüfungen bleiben erhalten.
- Karten-, Wetter-, Eye-, Mond-, Legend-Hub-Fachcode unverändert. Geteilte Dateien nur Lifecycle-Hook, Registry-/Manifest-Integration, Versions-/Cache-/Distributionsverträge. Kein MA-005-Code.

### Ausgeführte Prüfungen – tatsächlicher Remote-Nachweis

Lokaler Git-Checkout weiterhin nicht möglich (Could not resolve host: github.com). Erfolgreicher alternativer Weg: [öffentlicher gezielter Actions-Run 45592223571](https://github.com/TheDaimos/gewitterradar/actions/runs/45592223571), [Job 139129075800](https://github.com/TheDaimos/gewitterradar/actions/runs/45592223571/job/139129075800), status completed, conclusion success, head_sha exakt 3d3b88aaf47c12b2b72eeef4f2cd2c629f3822c6. Runner checkout dieses Commits, Node v22.23.5. Logs vom 25.11.2026 10:09:37–10:09:41 UTC.

| Prüfung / tatsächlicher Befehl | Ergebnis |
|---|---|
| node --check auf neun betroffenen Frontend-JS-Dateien und fünf MJS-Skripten gemäß Workflow | PASS |
| node scripts/test-ma-004.mjs | 5 Tests, 5 PASS, 0 FAIL, 27.125969 ms |
| node scripts/test-module-registry.mjs | PASS: module registry self-registration and Soll/Ist diagnostics |
| node scripts/test-v41169-data-sources.mjs | PASS: sources, locations, read-only backend, admin control, dual frontend and radius isolation |
| node scripts/verify-frontend.mjs | PASS: V4.14.1 DEV, E414-1A1, 38 Module, canonical DRA metadata, 235 Frontend-Dateien, exact delivery/checksum parity |
| node scripts/test-frontend-build.mjs | PASS: Built modular Gewitterradar frontend; deterministic rebuild and fail-closed source/asset/delivery/inventory probes |
| node scripts/verify-current-frontend.mjs (nach Rebuild) | PASS: 38 Module, 235 Frontend-Dateien, native und dashboard delivery/checksum parity |
| sha256sum -c SHA256SUMS_FRONTEND.txt --quiet | PASS |
| git diff --exit-code (nach Rebuild) | PASS: keine Abweichung zum ausgecheckten Commit |

Fünf MA-004-Tests einzeln grün: Default OFF/ungültige Flags; inert ON, Lazy Import, Restart und Teardown; verspäteter Import nach Disconnect/OFF; Fehlerisolation Import/Initialisierung/Teardown; optionales Inventar, Versionen, Spiegel und SHA256. Tatsächliche GitHub-Job-Logs gelesen, keine reine Annahme aufgrund eines gestarteten Workflows.

Zusätzlicher GitHub-Tree-Abgleich des Implementierungsstands: 114/114 erwartete modulare Dateien, keine fehlenden/zusätzlichen Dateien, beide Modulspiegel Git-Blob-identisch. Laufzeit-Registrierung von 38 deklarierbaren Modulen bedeutet nicht 38 aktive Module bei OFF. MA-004-Test prüft die isolierten Hooks mit injiziertem Importer und realem Modulimport, nicht vollständigen Browser/HA-Boot. Kein DEV-/PROD-Deployment, keine Veröffentlichung, kein vollständiger Release-Regressionsauftrag. Bestehende automatisch ausgelöste allgemeine CI bleibt unverändert; ihre vollständige Ausführung ist kein behaupteter MA-T0/T1-Nachweis. Hi-Res-Asset-Retention auf Test-SHA separat grün (45592223425); weitere automatische CI zum Zeitpunkt der Prüfung noch laufend.

### Geänderte Dateien (exakter GitHub-Compare, 42 Pfade)

- `.github/workflows/ma-004-targeted.yml` (added)
- `SHA256SUMS_FRONTEND.txt` (modified)
- `custom_components/gewitterradar/build_info.py` (modified)
- `custom_components/gewitterradar/const.py` (modified)
- `custom_components/gewitterradar/dra-deployment-provenance.json` (modified)
- `custom_components/gewitterradar/frontend/assets/gewitterradar-runtime-manifest.json` (modified)
- `custom_components/gewitterradar/frontend/gewitterradar.js` (modified)
- `custom_components/gewitterradar/frontend/module-manifest.js` (modified)
- `custom_components/gewitterradar/frontend/modules/core/card-lifecycle.js` (modified)
- `custom_components/gewitterradar/frontend/modules/core/registry.js` (modified)
- `custom_components/gewitterradar/frontend/modules/core/runtime.js` (modified)
- `custom_components/gewitterradar/frontend/modules/monitored-areas/index.js` (added)
- `custom_components/gewitterradar/frontend/modules/ui/settings-vault-view.js` (modified)
- `custom_components/gewitterradar/frontend/panel.js` (modified)
- `custom_components/gewitterradar/frontend/version.js` (modified)
- `custom_components/gewitterradar/manifest.json` (modified)
- `dashboard/dist/assets/gewitterradar-runtime-manifest.json` (modified)
- `dashboard/dist/gewitterradar.js` (modified)
- `dashboard/dist/module-manifest.js` (modified)
- `dashboard/dist/modules/core/card-lifecycle.js` (modified)
- `dashboard/dist/modules/core/registry.js` (modified)
- `dashboard/dist/modules/core/runtime.js` (modified)
- `dashboard/dist/modules/monitored-areas/index.js` (added)
- `dashboard/dist/modules/ui/settings-vault-view.js` (modified)
- `dashboard/dist/panel.js` (modified)
- `dashboard/dist/version.js` (modified)
- `frontend/assets.json` (modified)
- `frontend/assets/gewitterradar-runtime-manifest.json` (modified)
- `frontend/gewitterradar.js` (modified)
- `frontend/module-manifest.js` (modified)
- `frontend/modules/core/card-lifecycle.js` (modified)
- `frontend/modules/core/registry.js` (modified)
- `frontend/modules/core/runtime.js` (modified)
- `frontend/modules/monitored-areas/index.js` (added)
- `frontend/modules/ui/settings-vault-view.js` (modified)
- `frontend/panel.js` (modified)
- `frontend/version.js` (modified)
- `scripts/build-frontend.mjs` (modified)
- `scripts/test-ma-004.mjs` (added)
- `scripts/test-v41169-data-sources.mjs` (modified)
- `scripts/verify-current-frontend.mjs` (modified)
- `scripts/verify-frontend.mjs` (modified)

### Statusvertrag

task_id=MA-004; implementation_commit=16f638d0926fb434fb89eb822a8802b3babfe01f; distribution_commit=7e565565ec386a7efef9ef0bdb5f945ed32afb4f; test_commit=777ba55a836ac83b9356a4a125358264b5de6e1d; tested_commit=3d3b88aaf47c12b2b72eeef4f2cd2c629f3822c6; changed_paths=obige Compare-Liste plus Statusdokumentation; affected_contracts=optionaler Frontend-Lifecycle, Modulregister/Manifest, Build/Inventar, Spiegel/Hash/DRA; test_level=T0/T1 plus betroffene Build-/Integritätsverträge; commands=obige Tabelle; results=5/5 PASS, Syntax PASS, Build/Determinismus/Manipulationsproben/Spiegel/SHA PASS; latest_T2_baseline_sha=keine MA-Baseline; latest_T3_baseline_sha=keine MA-Baseline; invalidated_baselines=keine MA-Baseline; known_blockers=keine für den vereinbarten MA-004-Umfang, reale HA-/Dashboard-Abnahme erst mit separater Freigabe; next_task=MA-005.

## Historische Übergabe an MA-005 – vor abschließendem CI-Nachweis

Historischer Zwischenstand: MA-005 war beauftragt und implementiert; Feature-OFF-Vertragstests bestanden, Shared-Frontend-Nachweis damals offen. Durch den unten dokumentierten T2-Abschluss abgelöst. P00-Laufzeitfreigabe weiterhin offen. Keine automatische Installation/Promotion. Kanonischer Übergabepunkt bleibt die Statusdatei auf deploy/dev; dorthin ausschließlich Dokumentation, kein MA-Anwendungscode.

## MA-005 – Historischer Zwischenstand vor letzter Shared-Frontend-Korrektur (25.11.2026)

**Historischer Prüfstand, nicht aktueller Status:** Feature-OFF erfolgreich; Shared-Frontend damals noch offen. Nachfolgender T2-Abschluss maßgeblich.

- Arbeitsbranch: `feature/v4.14-monitored-areas`; keine Promotion von MA-Code nach `deploy/dev` oder `main`.
- Testimplementierung: [6d8597a3](https://github.com/TheDaimos/gewitterradar/commit/6d8597a3d55008a7ab389cc026be3838d747a272) – native HA-Testumgebung, Chromium mit tatsächlichem GewitterRadar-Frontend und eigener öffentlicher P00-CI.
- Korrektur der ersten CI-Befunde: [2ce7039d](https://github.com/TheDaimos/gewitterradar/commit/2ce7039dafa066d75af225a52e10a6c91f8df6f5) – paketierter Entity-Referenzimport, fehlender Standort-Helper im Chromium-Test explizit geprüft und V4.14-Versionsassertions ergänzt. Keine Abschwächung des Entity-Vertrags.
- Letzte Shared-Frontend-Testkorrektur: [9ec7f8ba](https://github.com/TheDaimos/gewitterradar/commit/9ec7f8ba216971694ed0b4181c453408d43a0f8d) – bestehende Diagnoseprüfung auf exakt 37 Pflichtmodulidentitäten bei deaktiviertem optionalem MA-Modul ausgerichtet; ausschließlich `scripts/test-v40756-settings-help.cjs` geändert.

### Nachweise (GitHub-Actions-Status am 25.11.2026)

| Prüfung | Lauf | Verifizierter Befund |
|---|---|---|
| MA-005 T2 Feature-OFF | [CI](https://github.com/TheDaimos/gewitterradar/actions/runs/45618483155) | SUCCESS – native HA 6/6, Chromium PASS |
| HA-Integration | [CI](https://github.com/TheDaimos/gewitterradar/actions/runs/45618483147) | SUCCESS |
| MA-004-Verträge | [CI](https://github.com/TheDaimos/gewitterradar/actions/runs/45618482979) | SUCCESS |
| Hi-Res-Asset-Schutz | [CI](https://github.com/TheDaimos/gewitterradar/actions/runs/45619118608) | SUCCESS auf 9ec7f8ba |
| Erneute HA-Integration | [CI](https://github.com/TheDaimos/gewitterradar/actions/runs/45619118645) | SUCCESS auf 9ec7f8ba |
| Erneute MA-004-Schutzverträge | [CI](https://github.com/TheDaimos/gewitterradar/actions/runs/45619118830) | SUCCESS auf 9ec7f8ba |
| Shared Frontend – erneuter Lauf | [CI](https://github.com/TheDaimos/gewitterradar/actions/runs/45619118557) | FAIL – historischer Lauf: About-Identitätsprüfung kannte V4.14 noch nicht (verify-about-golden-v408.cjs:310). |

Der erfolgreiche MA-005-P00-Lauf bezieht sich auf den tatsächlich getesteten SHA `2ce7039dafa066d75af225a52e10a6c91f8df6f5`. Native HA-Vertragstests **6/6 PASS**, Chromium-Feature-OFF **PASS**; bestehender Standort-Button bei fehlendem Helper korrekt deaktiviert, Karten-/Eye-/Legend-Hub-Boot und WR-Erkennung nachgewiesen, kein MA-Import/DOM/WS/Storage bei OFF. Die spätere Korrektur `9ec7f8ba` ändert nur einen bestehenden Shared-Frontend-Diagnosetest; der anschließende Shared-Frontend-Lauf scheiterte noch an der historischen About-Versionsprüfung; nachfolgend korrigiert.

### Historische Abschlussbedingungen (Punkte 1–2 inzwischen erledigt)

1. [Shared-Frontend-Revalidierung 45619118557](https://github.com/TheDaimos/gewitterradar/actions/runs/45619118557) abschließend auf SUCCESS prüfen oder reale Fehler gezielt beheben und betroffene Prüfungen wiederholen.
2. Finalen getesteten Code-/Test-SHA, CI-Logs, Umfang sowie die erste gültige P00-T2-Baseline dokumentieren und unabhängig gegen GitHub verifizieren.
3. Realen HA-DEV-Feature-OFF-Smoke auf VM109 erst nach gesonderter Installationsfreigabe durchführen. GitHub-Runner-HA- und Chromium-Tests sind **kein** VM109-Realtest. PROD VM101 unangetastet.
4. P00 erst nach vollständig erforderlicher Abnahme freigeben; MA-006/P01 bleibt gesperrt.

MA-001 bis MA-004 bleiben für ihre jeweils geprüften Umfänge abgenommen; V4.13 FINAL und WeatherRouter werden nicht geändert.

**Historischer Statusvertrag (durch aktuellen Vertrag unten ersetzt):** task_id=MA-005; implementation_commit=6d8597a3d55008a7ab389cc026be3838d747a272; test_fix_commit=2ce7039dafa066d75af225a52e10a6c91f8df6f5; shared_test_fix_commit=9ec7f8ba216971694ed0b4181c453408d43a0f8d; latest_successful_p00_t2_sha=2ce7039dafa066d75af225a52e10a6c91f8df6f5; latest_T2_baseline_sha=damals vorläufig 2ce7039d (P00-Teilnachweis); latest_T3_baseline_sha=keine; affected_contracts=HA-native Feature-OFF, Browser Feature-OFF, bestehende Modulidentitäten; known_blockers=damals Shared-Frontend-Abschluss und VM109-Laufzeitnachweis ausstehend; next_task=MA-005 Abschluss/P00-Gate, nicht MA-006.


## MA-005 – T2-Abschluss / verbindlicher aktueller Stand (25.11.2026)

**MA-005 – T2-Vertragsprüfungen erfolgreich abgeschlossen; HA-DEV-Laufzeitabnahme ausstehend.**

MA-001 bis MA-004 sind abgenommen. MA-005 ist für den CI-Vertragsumfang abgeschlossen, nicht VERIFIED_DEV/ACCEPTED_USER für die reale Laufzeit. P00 bleibt bis zur separaten VM109-Abnahme und Freigabe gesperrt. MA-006/P01 nicht begonnen. Keine Installation, Veröffentlichung oder Promotion.

### Exakte Nachweise und Baseline

- Implementierung: [6d8597a3d55008a7ab389cc026be3838d747a272](https://github.com/TheDaimos/gewitterradar/commit/6d8597a3d55008a7ab389cc026be3838d747a272).
- Korrektur: [2ce7039dafa066d75af225a52e10a6c91f8df6f5](https://github.com/TheDaimos/gewitterradar/commit/2ce7039dafa066d75af225a52e10a6c91f8df6f5), paketierter Entity-Import, fehlender Standort-Helper als deaktivierter Schutzvertrag, Weather-Engine-Versionsprüfung V4.14.
- [9ec7f8ba216971694ed0b4181c453408d43a0f8d](https://github.com/TheDaimos/gewitterradar/commit/9ec7f8ba216971694ed0b4181c453408d43a0f8d): exakt 37 Pflichtmodulidentitäten im Diagnose-UI bei OFF.
- [773281094963298f3410f4fa9a040e4a6d866ee1](https://github.com/TheDaimos/gewitterradar/commit/773281094963298f3410f4fa9a040e4a6d866ee1) und [18f505ba8933d1036660133fc5c5ca1b627c596a](https://github.com/TheDaimos/gewitterradar/commit/18f505ba8933d1036660133fc5c5ca1b627c596a): About-Golden-Identitätsprüfung für V4.14 erweitert und Regex-Endanker korrigiert; historische Identitäts-, Pixel- und Geometrieassertions erhalten.
- GitHub-Compare 2ce7039d..18f505ba: exakt drei geänderte Pfade: diese Statusdatei, scripts/test-v40756-settings-help.cjs und scripts/verify-about-golden-v408.cjs. Keine Änderung der P00-Testskripte, ihrer Fixture oder der Anwendungsdateien; ursprünglicher P00-Nachweis weiter gültig.

| Tatsächlich ausgeführter Befehl / Vertrag | SHA | Ergebnis / CI |
|---|---|---|
| python -m pytest -q tests/test_ma005_off.py tests/test_migration_fresh_install.py | 2ce7039dafa066d75af225a52e10a6c91f8df6f5 | 6 passed in 0.62s, [Job 139220008908](https://github.com/TheDaimos/gewitterradar/actions/runs/45618483155/job/139220008908) |
| node scripts/test-ma-005-browser.cjs | derselbe SHA | PASS, [Job 139220008199](https://github.com/TheDaimos/gewitterradar/actions/runs/45618483155/job/139220008199) |
| python -m pytest -q tests; python -m compileall -q custom_components tests | 18f505ba8933d1036660133fc5c5ca1b627c596a | 83 passed in 2.87s, Syntax PASS; [HA-Runtime-Job](https://github.com/TheDaimos/gewitterradar/actions/runs/45620920718/job/139228502406); Hassfest/HACS/Paket-/DRA-Verträge ebenfalls SUCCESS |
| node scripts/test-ma-004.mjs; node scripts/test-module-registry.mjs; node scripts/test-v41169-data-sources.mjs; node scripts/verify-frontend.mjs; node scripts/test-frontend-build.mjs; node scripts/verify-current-frontend.mjs; sha256sum -c SHA256SUMS_FRONTEND.txt --quiet; git diff --exit-code | 18f505ba8933d1036660133fc5c5ca1b627c596a | [SUCCESS](https://github.com/TheDaimos/gewitterradar/actions/runs/45620920902), alle Schritte einschließlich Syntax, deterministischer Build und Integritätsproben grün |
| node scripts/verify-hires-asset-retention.mjs | 18f505ba8933d1036660133fc5c5ca1b627c596a | [SUCCESS](https://github.com/TheDaimos/gewitterradar/actions/runs/45620920703) |
| node scripts/test-v40756-settings-help.cjs "$(node -p "require('playwright').chromium.executablePath()")"; node scripts/verify-about-golden-v408.cjs "$(node -p "require('playwright').chromium.executablePath()")" | 18f505ba8933d1036660133fc5c5ca1b627c596a | [SUCCESS, Shared-Frontend-Job](https://github.com/TheDaimos/gewitterradar/actions/runs/45620921237/job/139228686408), einschließlich historischer Golden-Geometrie, Settings/Help, Sprachprofile, Browser-Suiten beider Distributionen und weiterer aktivierter Schutzprüfungen |
| WeatherRouter map control position and touch regression | 18f505ba8933d1036660133fc5c5ca1b627c596a | [SUCCESS](https://github.com/TheDaimos/gewitterradar/actions/runs/45620921237/job/139228503160) |

Shared-Frontend-Run 45620921237: completed/success, letztes Update 2026-11-25 13:17:11 UTC. Release-scope und alle tatsächlich ausgeführten Jobs erfolgreich; versionsspezifisch nicht ausgewählte Jobs wurden übersprungen, nicht als getestet gewertet. Keine T3-Gesamtregression behauptet. HA-Integration auf demselben SHA: Python 3.14.10, HA 2026.9.0 final, pytest-homeassistant-custom-component 0.13.362. P00: öffentlicher Ubuntu-Runner mit gleicher HA-Paketversion, Chromium headless/Playwright 1.62.1, Leaflet 1.9.4, Node 22, synthetischer HA/WR-Transport, tatsächlicher Card-/Leaflet-Code. Kein realer Provider- oder VM109-Test. Die P00-Joblogs bestätigen OFF/default, keine zusätzliche MA-Entity/Service-/Dateierzeugung im HA-Testumfang, kein MA-Import/DOM/WS/localStorage im Browser-Testumfang, tatsächlichen Kartenboot, 37 Pflichtmodule, Eye und Legend Hub, WR-Discovery und deaktivierten Standortschalter ohne Helper. Konfigurierte Ortssuche und echte Provider bleiben DEV-Smoke. Keine weitergehende Behauptung über globale Hintergrundtasks oder Dateien auf VM109.

### Baseline-Vertrag

- baseline_sha=18f505ba8933d1036660133fc5c5ca1b627c596a
- evidence_p00_sha=2ce7039dafa066d75af225a52e10a6c91f8df6f5
- result=PASS (T2 CI-Vertragsumfang); environment=öffentliche GitHub-Actions-Runner; timestamp=2026-11-25T13:17:11Z
- run_urls=https://github.com/TheDaimos/gewitterradar/actions/runs/45618483155, https://github.com/TheDaimos/gewitterradar/actions/runs/45620920718, https://github.com/TheDaimos/gewitterradar/actions/runs/45620920902, https://github.com/TheDaimos/gewitterradar/actions/runs/45620920703, https://github.com/TheDaimos/gewitterradar/actions/runs/45620921237
- test_suite_digest (Git-Blob-SHA1-Identitätsvektor, kein erfundener aggregierter SHA256): tests/test_ma005_off.py=77e2bda468ede394f4f2ca7610a7a6e6221d4bc3; scripts/test-ma-005-browser.cjs=4f60a09b35bd0429dc3c159ca3ee4fbd5e662394; .github/workflows/ma-005-p00.yml=f4c3d51a67fe16e9b26e505d222c8a14128d8053; scripts/test-v41106-weather-engine-diagnostics.mjs=32c4e88864f1edb915ed9842b3be10af2d8125d5; scripts/test-v40756-settings-help.cjs=fd69a6b9777ac0dc4d9954bc4fc2edbbfd73c534; scripts/verify-about-golden-v408.cjs=717bdab3d76f485c5d2b632086c728b10b3b6a55; .github/workflows/shared-frontend.yml=52383ebe6fb02e1d364535d08eb3f7b2bd6e69c0; .github/workflows/validate.yml=72c861c1de0e72a4cf48af3ad5a132016f9e02e5; .github/workflows/ma-004-targeted.yml=acf1b39c754cb8462fdeda3e036805194fde637d; scripts/verify-hires-asset-retention.mjs=bb164f1da3fd6aacb4fe251872efe32840916c75. Vollständige transitiv verwendete Suite über baseline_sha fixiert.
- scope=MA-003/004 Lifecycle, default OFF, native Bestandsschutz, Browser-Smoke, Modulidentität, Distribution, Build, Asset-/DRA-/historische Shared-Frontend-Verträge; keine reale DEV-Abnahme.
- invalidated_baselines=vorläufiger P00-Teilstatus ersetzt; keine T3-Baseline; erneute Prüfung nur bei Änderungen betroffener Schnittstellen/Testverträge.
- changed_paths seit MA-004: tests/test_ma005_off.py, scripts/test-ma-005-browser.cjs, .github/workflows/ma-005-p00.yml, scripts/test-v41106-weather-engine-diagnostics.mjs, scripts/test-v40756-settings-help.cjs, scripts/verify-about-golden-v408.cjs, diese Statusdatei.
- current_task=MA-005; test_level=T2_CI_PASS; latest_T2_baseline_sha=18f505ba8933d1036660133fc5c5ca1b627c596a; latest_T3_baseline_sha=keine; DEV_user_accepted=false; known_blockers=separate Installationsgenehmigung und reale Laufzeitabnahme VM109; next_task=MA-005/P00 DEV-Smoke nach Freigabe, MA-006 gesperrt.

## P00 – ausführbarer DEV-Abnahmeplan (nur Vorbereitung, keine Installation freigegeben)

**Zielsystem ausschließlich Proxmox VM109 / HA DEV.** Keine Verbindung zu VM101, keine Änderung an WR, keine Freigabe durch dieses Dokument. Durchführung erst nach gesonderter Betreiberfreigabe. Prüfer trägt zu jedem Schritt UTC-Zeit, PASS/FAIL/BLOCKED, Istwerte und Nachweis ein. Nicht vorhandene Diagnosedaten nicht durch Vermutungen ersetzen.

| ID | Vorgehen und PASS-Kriterium | Nachweis |
|---|---|---|
| DEV-00 | Vor jeder Aktion VM-ID 109 in Proxmox und HA-Systemidentität verifizieren. HA Core/OS/Supervisor und GR/WR-Versionen, aktuelle Karte/Profil, installierte HACS-Quellen notieren. Ist-HA-Version gegen kompatible Manifestanforderungen und CI-HA 2026.9.0 abgleichen; Abweichung ausdrücklich dokumentieren, kein ungefragtes HA-Upgrade. | 00-system.txt |
| DEV-01 | Vollständiges HA-Backup mit Konfiguration und Integration erstellen; zusätzlich konsistenten VM109-Snapshot bzw. vollständiges Proxmox-Backup gemäß vorhandener Backup-Policy erstellen. Backup-ID, Datum, Speicherort, Erfolg, GR-Vorversion und deren Paket-SHA256 festhalten, Wiederherstellbarkeit prüfen. Ohne gültigen Rückfallpunkt STOP. | 01-backup.txt |
| DEV-02 | Vor Installation Bestandsmessung: HA-Entitäten, GR-Dienste, Referenztracker-ID/Koordinaten, Local-To-do-Liste und gespeicherte Orte, Eye-/Legend-/Mond-/Kartenprofil, WR-Version/Provider-Konfiguration und verfügbare Layer, HA-Logs und vorhandene MA-Dateien/Tasks erfassen. Keine bestehenden Dateien löschen. | 02-before/ |
| DEV-03 | Nach separater Freigabe ausschließlich exakt 18f505ba8933d1036660133fc5c5ca1b627c596a als DEV-Kandidat über genehmigten isolierten Installationsweg installieren. Kein Public-Release, kein deploy/dev-Merge. Vorab Paket aus exaktem SHA bauen/identifizieren, SHA256 des Pakets verifizieren und dokumentieren; falls kein geeignetes isoliertes Paket verfügbar STOP. Erwartung GR V4.14.1 DEV / HA 0.25.187, 4141r1, E414-1A1; vollständiger HA-Neustart, Moduldiagnose 37 Pflichtmodule OK, optionales MA-Modul nicht geladen. | 03-identity.txt, module-diagnostics.json |
| DEV-04 | Ohne Feature-Aktivierung GR-Config-Entry-Optionen über autorisierte lesende Diagnose prüfen (monitored_areas_enabled fehlt oder exakt false); Card-Konfiguration ebenso. Kein neuer Schalter, kein persistenter ON-Wert. Keine manuelle Bearbeitung der HA .storage. | 04-off.json (redigiert) |
| DEV-05 | HA-Entitätsregister und Dienste nach Boot mit 02 vergleichen; erwartete bestehende GR-Entitäten einschließlich Referenztracker unverändert, keine MA-Tracker/Entities/Services. HA-WS/API-Diagnose und Browser-Netzwerk auf MA-Aufrufe prüfen. | 05-entities-services.diff, network.json |
| DEV-06 | Terminal auf HA DEV: lesend `find /config -iname '*monitored*area*' -print`; zusätzlich erwarteten Pfad `/config/gewitterradar/monitored_areas/monitored_areas.sqlite3` und WAL/SHM/Journal prüfen. Vergleich vor/nach: keine neuen MA-Dateien, DB, Verzeichnisse oder Persistenz. Keine bestehende fremde Datei löschen. | 06-files-before-after.txt |
| DEV-07 | HA-Logs, verfügbare Task-/Listener-/Profiler-Diagnose auf MA prüfen; Browser DevTools Network/Performance (mindestens 60 s nach Bereitschaft) auf MA-Module, Timer/Polling und MA-Netzverkehr prüfen. Keine MA-Aktivität, Fehler oder Ressourcenregistrierung; wenn HA keine ausreichend aufgelöste Task-/Timer-Diagnose bereitstellt, Nachweis BLOCKED, nicht PASS. Keine dauerhafte Instrumentierung im Produktivcode. | 07-runtime-logs.txt, browser-performance.json |
| DEV-08 | Standard- und Vollbildkarte, Hilfe, Einstellungen, Eye Hub und Legend Hub in Desktop und Mobile öffnen. Keine MA-UI, kein MA-Dialog, keine MA-CSS-/JS-Requests, keine MA-Storage-Keys; bestehende Navigation und Moduldiagnose unverändert. Browser-Konsole ohne MA-bezogene Fehler. | 08-ui/ screenshots, console.txt |
| DEV-09 | Bei vorhandener Local-To-do-Liste und aktiviertem Standortschalter echte Ortssuche öffnen, vorhandenen Ort auswählen, Referenztracker-Bewegung und Kartenfokus prüfen, ursprünglichen Standort wiederherstellen. Gespeicherte Liste und Tracker-ID unverändert. Wenn Voraussetzungen fehlen, dokumentieren und erst nach Betreiberfreigabe Testfixture herstellen; nicht einfach PASS. | 09-location-before-after.json, screenshots |
| DEV-10 | Eye Hub öffnen/schließen, Gruppierung/Slots prüfen; Legend Hub öffnen und vorhandene Legende ein-/ausblenden; Mondlegende öffnen, Position und Skala prüfen; Karte zoomen/verschieben. Ursprüngliche Einstellungen wiederherstellen. Kein Verlust von Slots, Profilen oder unabhängiger Wetterdarstellung. | 10-existing-ui/ |
| DEV-11 | WR-Integration unverändert lassen, Discovery/Provider-Diagnose vor/nach vergleichen. Vorher funktionierende DWD/OPERA/NASA, Wind, Temperatur, Synoptik und Mond soweit tatsächlich verfügbar stichprobenartig prüfen. Natürliche Wetter-/Freshness-Änderungen getrennt dokumentieren; kein Provider deaktiviert, keine WR-Konfigurationsänderung und kein zusätzlicher MA-Verbraucher. Nicht verfügbare Provider nicht als erfolgreich darstellen. | 11-wr-before-after.json, screenshots |
| DEV-12 | GR-Integration über HA UI neu laden, anschließend Karte neu laden und Browser vollständig schließen/neustarten; nach jedem Schritt DEV-04–08 kurz wiederholen. Bestehender Tracker, Orte, Eye/Legend/Mond/Karte und WR-Erkennung weiterhin funktionsfähig, keine MA-Ressourcen. Bei fehlender Reload-Option dokumentiert vollständigen HA-Neustart nur nach Freigabe verwenden. | 12-restart/ |
| DEV-13 | Alle Prüfungen abzeichnen, Export2Git-Nachweis und Rückfallentscheidung dokumentieren. PASS nur wenn alle verbindlichen Nachweise vollständig sind und keine Regression vorliegt. FAIL bei MA-Ressourcen, UI, unerwarteter Persistenz, Fehlern, Bestandsregression oder falscher Identität: sofort Test beenden, Beweise sichern, genehmigten Rückfall auf Backup/Snapshot durchführen, Vorversion und Bestand erneut prüfen. BLOCKED bei fehlenden Voraussetzungen oder nicht beobachtbarer Invariante; keine P00-Freigabe. | 13-result.md |

### Nachweispfade und Abnahmeformular

Export2Git ausschließlich über den vorhandenen privaten Diagnoseweg TheDaimos/Project-Log-And-Export@main. Vorgeschlagener neuer Ablagepfad (noch nicht angelegt, erst bei Ausführung): `GR/V4.14/MA-005/P00-DEV/<UTC-Zeitstempel>/` mit obigen relativen Dateinamen. Keine Tokens, privaten Standortkoordinaten, Zugangsdaten oder unveränderten vollständigen HA-Storage-Dumps veröffentlichen; sensible Felder redigieren, Vergleiche lokal dokumentieren. Ergebnisdatei:

```text
task=MA-005
vm=109
test_candidate_sha=18f505ba8933d1036660133fc5c5ca1b627c596a
package_sha256=
ha_core= ; ha_os= ; supervisor=
gr_before= ; gr_after= ; wr_before= ; wr_after=
backup_id= ; rollback_ref=
DEV-00= ; DEV-01= ; DEV-02= ; DEV-03= ; DEV-04= ; DEV-05=
DEV-06= ; DEV-07= ; DEV-08= ; DEV-09= ; DEV-10= ; DEV-11=
DEV-12= ; DEV-13=
evidence_path=
result=PASS|FAIL|BLOCKED
rollback_required=
operator_acceptance=
P00_release=separate approval required
```

Status heute: sämtliche DEV-Schritte NOT_RUN. Keine Installation, keine Verbindung zu VM101 oder VM109 in diesem Dokumentationsauftrag. MA-006 erst nach dokumentiertem DEV-Nachweis und separater P00-Freigabe.

Geschützte Refs vor Dokumentation: main 37f1aca54cd505fd91a2b1b0014cd7c6c280b26f; v4.13 509daeb7245f42b23e46f72b4d002c42f0d7f56e; WR deploy/dev 850c3542a8b3b181edc5837205bbeb374ed72eab. Ausschließlich diese Markdown-Datei wird auf beide GR-Branches geschrieben, kein Code-Merge.


## MA-005/P00 – Betreiberfreigabe und MA-006 – geprüfter Zwischenabschluss (25.11.2026)

**Aktualisierung gegenüber dem oben erhaltenen historischen P00-Plan:** Der Betreiber hat GewitterRadar **V4.14.1 DEV** (Tag `v4.14.1-dev`, Quellcommit `18f505ba8933d1036660133fc5c5ca1b627c596a`) auf **HA DEV VM109** erfolgreich über das reguläre DRA-V2-Sammelupdate installiert und die sichtbaren Bestandsfunktionen nach der Installation als funktionsfähig beurteilt („sieht super aus“, „scheint alles zu funktionieren“). Der Betreiber hat anschließend ausdrücklich den Beginn von MA-006 freigegeben. Das ist eine **Betreiber-Sichtabnahme** für den P00-Übergang, **kein** nachträglich erfundener vollständiger maschineller DEV-00–DEV-13-Evidenzsatz. Die ursprünglichen Prüfschritte und dortigen NOT_RUN-Einträge bleiben als historische Dokumentation erhalten, soweit ihre Einzelnachweise nicht erbracht wurden. PROD VM101 und WeatherRouter unverändert.

### MA-006 – SQLite-Lifecycle, T0/T1 nach GitHub-Readback bestätigt

- `task_id=MA-006`; `current_task=MA-006 verification/documentation`; `next_task=MA-007 (erst nach eigenständiger Freigabe)`.
- Implementierungscommit: [`c1d9cac6a3276d95273d0d414d8df348caf2d355`](https://github.com/TheDaimos/gewitterradar/commit/c1d9cac6a3276d95273d0d414d8df348caf2d355) auf `feature/v4.14-monitored-areas`.
- `changed_paths`: `.github/workflows/ma-006.yml`, `custom_components/gewitterradar/monitored_areas/__init__.py`, `custom_components/gewitterradar/monitored_areas/runtime.py`, `custom_components/gewitterradar/monitored_areas/storage/__init__.py`, `custom_components/gewitterradar/monitored_areas/storage/database.py`, `scripts/test-ma-006.py`.
- `affected_contracts`: nur optionaler SQLite-Worker/Lifecycle, Feature-Flag-ON/OFF, Ressourcenbesitz/Shutdown; keine fachlichen Tabellen, kein Frontend, keine WR-Änderung.
- `test_level=T0/T1`: gezielter [MA-006-Lifecycle-CI-Lauf 45644414924](https://github.com/TheDaimos/gewitterradar/actions/runs/45644414924) **SUCCESS, sechs bestandene Tests** auf exakt diesem Commit. Der [HA-Integrationslauf 45644414707](https://github.com/TheDaimos/gewitterradar/actions/runs/45644414707), der [MA-004-Lauf 45644414762](https://github.com/TheDaimos/gewitterradar/actions/runs/45644414762) sowie der [Hi-Res-Asset-Lauf 45644414682](https://github.com/TheDaimos/gewitterradar/actions/runs/45644414682) sind ebenfalls **SUCCESS**. Die [Shared-Frontend-CI 45644414716](https://github.com/TheDaimos/gewitterradar/actions/runs/45644414716) war bei diesem Readback noch **IN_PROGRESS**; kein Erfolg behauptet.
- `latest_T2_baseline_sha=18f505ba8933d1036660133fc5c5ca1b627c596a` (P00 Feature-OFF CI-Baseline; nicht als MA-006-T2-Test ausgegeben). `latest_T3_baseline_sha=keine`. `invalidated_baselines`: MA-006 verändert den optionalen ON-Datenbank-Lifecycle; dessen neue Funktion ist nur durch den aktuellen T0/T1-Nachweis gedeckt. Vorherige P00-Feature-OFF-Basis wird für unveränderte Referenzfunktionen weitergeführt, aber durch die neue MA-006-Funktion nicht vollständig revalidiert.
- `known_blockers`: keine für den erfolgreichen gezielten T0/T1-Lauf; eigenständige umfassende T2-P01-/T3-/VM109-Abnahmen des neuen Datenbankpfads nicht durchgeführt. MA-006 nicht auf VM109 bereitgestellt, kein neues GR-Release. `DEV_user_accepted` für V4.14.1/P00 = ja (sichtbare Betreiberabnahme); für MA-006 = nein (keine Installation).
- Kein MA-007-Code und kein Merge von MA-Anwendungscode nach `deploy/dev` oder `main`.


## MA-007 – Versioniertes SQLite-Standort-/Profilschema, T0/T1 verifiziert (25.11.2026)

**Status: gezielter MA-007-T0/T1-Vertrag SUCCESS; keine DEV-Runtime-Abnahme / keine Installation.** Die historischen P00-/MA-006-Einträge oberhalb bleiben erhalten. GewitterRadar `v4.14.1-dev` mit Quellcommit `18f505ba8933d1036660133fc5c5ca1b627c596a` bleibt die geschützte, vom Betreiber auf VM109 geprüfte Referenz.

- `task_id=MA-007`; `implementation_commit=c69041a4cb7b72693f3d9e346175f7555a37680b`; `current_task=MA-007 verified/documented`; `next_task=MA-008` (erst nach gesondertem Auftrag).
- `changed_paths`: `.github/workflows/ma-007.yml`, `custom_components/gewitterradar/monitored_areas/storage/database.py`, `custom_components/gewitterradar/monitored_areas/storage/schema.py`, `scripts/test-ma-006.py`, `scripts/test-ma-007.py`. Umsetzung ausschließlich auf `feature/v4.14-monitored-areas`; `deploy/dev` erhält allein diese Statusdokumentation.
- `affected_contracts`: MA-006-Worker-basierter SQLite-Start, atomarer v1-Schemalifecycle mit `PRAGMA user_version=1`, exakte Schemaidentität und Fremdschlüssel-/Integritätskontrolle; ausschließlich Tabellen `locations`, `profile_links`, `profile_preferences`, `notification_targets`, zugehöriger Index, STRICT-/CHECK-/FK-/UNIQUE-Verträge; keine CRUD-Schnittstellen, Tracker, Alarme, Provider, UI oder Entity-Registrierung.
- `test_level=T0/T1`. Exakt auf Implementierungs-SHA verifizierter [MA-007-CI-Run 45686934248](https://github.com/TheDaimos/gewitterradar/actions/runs/45686934248): **completed/success**. Tatsächlich ausgeführte Workflow-Befehle: `git rev-parse HEAD`, `python -m compileall -q custom_components/gewitterradar/monitored_areas`, `python scripts/test-ma-007.py` (**6 Tests, OK**), `python scripts/test-ma-006.py` (**7 Tests, OK**). Der gleiche SHA hat [MA-004 45686934083](https://github.com/TheDaimos/gewitterradar/actions/runs/45686934083) und [Hi-Res-Schutz 45686934036](https://github.com/TheDaimos/gewitterradar/actions/runs/45686934036) mit **SUCCESS** bestanden.
- Zusätzlicher GitHub-Readback: [MA-006-separat 45686934045](https://github.com/TheDaimos/gewitterradar/actions/runs/45686934045) und [HA-Integration 45686934058](https://github.com/TheDaimos/gewitterradar/actions/runs/45686934058) sind ebenfalls **completed/success** auf exakt diesem Implementierungs-SHA. [Shared-Frontend 45686934263](https://github.com/TheDaimos/gewitterradar/actions/runs/45686934263) war beim letzten Readback noch **IN_PROGRESS**; kein Erfolg behauptet.
- `latest_T2_baseline_sha=18f505ba8933d1036660133fc5c5ca1b627c596a` (P00-Bestandsschutzreferenz, nicht als neuer MA-007-T2-Test ausgegeben). `latest_T3_baseline_sha=keine`. `invalidated_baselines`: neuer ON-Schemapfad nicht von der früheren P00-OFF-Baseline abgedeckt; MA-006-Lifecycle durch sieben Tests im MA-007-Lauf erneut geprüft, vollständiger P01-T2-Gate erst nach MA-011.
- `known_blockers`: kein Blocker für MA-007-T0/T1, aber keine reale SQLite-ON-Abnahme auf VM109, keine T2-/T3-Freigabe, kein neuer GR-Release. `DEV_user_accepted=false` für MA-007; Betreiberfreigabe betrifft ausschließlich die ältere `v4.14.1-dev`-Referenz.
- `next_task=MA-008`: getrenntes SQLite-Schema für Tracker/Alarmregeln nach eigenständiger Freigabe. Kein MA-008-Code in diesem Auftrag. WeatherRouter, GR FINAL und PROD VM101 unverändert.


## MA-008 – Tracker-Referenzschema / atomare v1→v2-Migration, T0/T1 bestätigt (25.11.2026)

**Status: MA-008 für gezielten T0/T1-Umfang SUCCESS; keine VM109-Installation, keine T2-/T3-Gesamtabnahme.** GewitterRadar `v4.14.1-dev` bleibt unveränderte geschützte Betreiberreferenz auf `18f505ba8933d1036660133fc5c5ca1b627c596a` (GitHub-Tag-Readback).

- `task_id=MA-008`; `implementation_commit=820996b43f66d0a099b3a783595023b20bfe8a7e`; `current_task=MA-008 verified/documented`; `next_task=MA-009` nur nach gesondertem Auftrag.
- `changed_paths`: `.github/workflows/ma-008.yml`, `custom_components/gewitterradar/monitored_areas/storage/schema.py`, `scripts/test-ma-006.py`, `scripts/test-ma-007.py`, `scripts/test-ma-008.py`. Keine Änderungen an bestehenden Wetterprovider-/Frontend-Modulen, keine WR-/PROD-Änderung.
- `affected_contracts`: additive `tracker_refs`-Tabelle, FK auf `locations` mit RESTRICT, stabile `unique_id`, optional eindeutige `actual_entity_id`, `pending/confirmed/error`-Zustände, atomare Migration `PRAGMA user_version=1` nach `2`, Datenbestand erhalten, unbekannte Versionen abweisen. Vorhandene Record-/Alarmradius- und Profileinstellungen bleiben maßgeblich in den v1-Tabellen. `source_bindings` bewusst zurückgestellt.
- `test_level=T0/T1`; [MA-008 GitHub-Actions-Lauf 45687711181](https://github.com/TheDaimos/gewitterradar/actions/runs/45687711181) auf exakt dem Implementierungs-SHA **completed/success**. Tatsächlich ausgeführte Befehle: `python -m compileall -q custom_components/gewitterradar/monitored_areas` PASS; `python scripts/test-ma-008.py`: **5 Tests OK**; `python scripts/test-ma-007.py`: **6 Tests OK**; `python scripts/test-ma-006.py`: **7 Tests OK**. Insgesamt 18 SQLite-Vertragstests bestanden.
- Zusätzlich auf demselben Implementierungs-SHA **completed/success**: [MA-006 45687710971](https://github.com/TheDaimos/gewitterradar/actions/runs/45687710971), [MA-007 45687710829](https://github.com/TheDaimos/gewitterradar/actions/runs/45687710829), [HA-Integration 45687710881](https://github.com/TheDaimos/gewitterradar/actions/runs/45687710881), [MA-004 45687711660](https://github.com/TheDaimos/gewitterradar/actions/runs/45687711660), [Hi-Res-Asset-Schutz 45687710943](https://github.com/TheDaimos/gewitterradar/actions/runs/45687710943). [Shared Frontend 45687710920](https://github.com/TheDaimos/gewitterradar/actions/runs/45687710920) war beim Readback **IN_PROGRESS**, daher kein Erfolg behauptet.
- `latest_T2_baseline_sha=18f505ba8933d1036660133fc5c5ca1b627c596a` (bestehende P00-OFF-/Bestandsschutzbaseline, keine neue MA-008-T2-Abnahme); `latest_T3_baseline_sha=keine`; `invalidated_baselines`: neu eingeführter ON-Migrationspfad v1→v2 ist nur durch T0/T1 auf dem aktuellen Commit gedeckt und vor MA-008 nicht Bestandteil der P00-Baseline; P01-Phasengate erst nach MA-011.
- `known_blockers`: keiner für gezielten T0/T1-Abschluss; keine reale MA-008-ON-Datenbankmigration auf HA DEV VM109, keine T2-/T3-Freigabe, keine automatische Bereitstellung. `DEV_user_accepted=false` für MA-008. PROD VM101 unangetastet.
- `next_task=MA-009`: ausschließlich Schema für Blitzreports, Sitzungen und Quellausfallintervalle, ohne Dateningestion/Tracker-/Alarm-Laufzeit. MA-009 noch nicht begonnen.


## MA-009 – SQLite-Ereignisse, Sitzungen und Quellenlücken (25.11.2026)

**Status: IMPLEMENTED / T0-T1 VERIFIED auf GitHub; keine VM109-Installation, keine T2-/T3- oder PROD-Freigabe.** Die ältere v4.14.1-dev-Betreiberreferenz (Tag `18f505ba8933d1036660133fc5c5ca1b627c596a`) wurde per GitHub-Readback unverändert bestätigt. Historische Vorbereitungsstände oben bleiben als solche erhalten.

- `task_id=MA-009`; `implementation_commit=4645c2b82453fb3056d89afb64de3421278a3d92`; `tested_commit=512139eebe89e2e78eebc4f39fc4c282c9d1af0a`; `current_task=MA-009 VERIFIED_T0_T1`; `next_task=MA-010` (erst nach eigenständiger Freigabe).
- `changed_paths`: `custom_components/gewitterradar/monitored_areas/storage/schema.py`, `scripts/test-ma-009.py`, `scripts/test-ma-008.py`, `scripts/test-ma-007.py`, `scripts/test-ma-006.py`, `.github/workflows/ma-009.yml`. Änderungen ausschließlich im `feature/v4.14-monitored-areas`, keine GR-/WR-Produktionsänderung.
- `affected_contracts`: atomare v0/v1/v2→v3-Migration mit persistiertem `PRAGMA user_version=3`, exakter Schemaidentität/FK- und Integritätsprüfung; sechs additive Tabellen `lightning_reports`, `possible_duplicates`, `sessions`, `session_reports`, `source_gaps`, `runtime_checkpoint`. Historische Standortkoordinaten/-Revisionen, getrennte source_event_id/replay_key, nullable observed_at, Quellzeitqualität, dokumentierte Quellenlücken, standortidentische Bericht-Sitzungsbezüge und restriktive FKs. Indexe für observed/received, Sitzungen, Lücken und belastbare Replay-Keys. STRICT/JSON-/Zeit-/Koordinaten-Constraints. Keine Live-Ingestion, Alarmfenster, Outbox oder Source-Bindings.
- `test_level=T0/T1`. Nach unabhängiger GitHub-Prüfung [MA-009 CI 45691948150](https://github.com/TheDaimos/gewitterradar/actions/runs/45691948150) auf **exakt `512139eebe89e2e78eebc4f39fc4c282c9d1af0a` COMPLETED/SUCCESS**: `python -m compileall -q custom_components/gewitterradar/monitored_areas` PASS, `python scripts/test-ma-009.py` **8 OK**, `python scripts/test-ma-008.py` **5 OK**, `python scripts/test-ma-007.py` **6 OK**, `python scripts/test-ma-006.py` **7 OK**, insgesamt **26 Tests OK**. Prüfumfang: idempotente v0/v1/v2-Migration, Datenbestand, Rollback/future version, Replay/Koordinaten/JSON, Kandidaten-Dubletten, standortgebundene Sessions, offene Gaps, Checkpoints sowie 006–008-Regressionsverträge.
- Vorherige CI-Fehler betrafen ausschließlich auf Schema-Version 2 fest verdrahtete Erwartungen in älteren Tests bzw. eine versehentlich geänderte Tracker-Anzahl-Assertion; mit den Commits `773b5188`, `ebe04f48`, `2d7a8e3f` korrigiert, ohne Sicherheitsassertions oder Schema-Checks zu entfernen. Die final getestete Version ist die einzige gültige MA-009-Testbaseline.
- Auf demselben geprüften Commit [Hi-Res Asset-Schutz 45691948002](https://github.com/TheDaimos/gewitterradar/actions/runs/45691948002) SUCCESS. [HA-Integration 45691948097](https://github.com/TheDaimos/gewitterradar/actions/runs/45691948097) war bei der Dokumentation **IN_PROGRESS**, [Shared Frontend 45691948141](https://github.com/TheDaimos/gewitterradar/actions/runs/45691948141) **QUEUED**, daher hier kein Erfolg behauptet.
- `latest_T2_baseline_sha=18f505ba8933d1036660133fc5c5ca1b627c596a` (P00 Feature-OFF-/Bestandsschutzreferenz, keine neue MA-009-T2-Freigabe); `latest_T3_baseline_sha=keine`; `invalidated_baselines`: neue MA-009-ON-Schema-/Migrationsverträge sind nicht durch die ältere P00-OFF-Baseline gedeckt. Der P01-T2-Gesamtnachweis bleibt planmäßig nach MA-011 ausstehend.
- `known_blockers`: keine für gezielte MA-009-T0/T1-Abnahme; keine reale SQLite-ON-Migration auf DEV VM109, keine T2-/T3-Regressionsfreigabe, keine finale Veröffentlichung. `DEV_user_accepted=false` für MA-009. PROD VM101, V4.13 FINAL, V4.14.1-Tag und WeatherRouter unangetastet.
- `next_task=MA-010`: transaktionale Repositories/CRUD, Revisionsschutz und getestete Migration/Restore-Schnittstellen, ausschließlich nach gesondertem Auftrag. MA-010 nicht begonnen.


## MA-010 – Transaktionale SQLite-Repositories / T0-T1 abgeschlossen (25.11.2026)

**Status: MA-010 VERIFIED_T0_T1 auf exakt dem Implementierungscommit; keine DEV-Installation und keine T2-/T3-Freigabe.** Geschützter Tag `v4.14.1-dev` zeigt laut unabhängigem GitHub-Readback weiterhin auf `18f505ba8933d1036660133fc5c5ca1b627c596a`. Die bisherigen historischen Einträge bleiben erhalten.

- `task_id=MA-010`; `implementation_commit=e2b50820be698b657c4865317a666d661ab9ac7b`; `current_task=MA-010 VERIFIED_T0_T1`; `next_task=MA-011` (nur nach eigenständigem Auftrag).
- `changed_paths`: `.github/workflows/ma-010.yml`, `custom_components/gewitterradar/monitored_areas/storage/repositories.py`, `scripts/test-ma-010.py`. Der MA-006-Worker und das Version-3-Schema blieben unverändert; keine Änderungen an GR/WR-Bestandsfunktionen.
- `affected_contracts`: isolierte interne Transaktions-Repositories; atomare Standort-/Profil-/Preferences-/Benachrichtigungsziel-Operationen, Trackerreferenzen, Ereignisse/Replay, Sessions/Quellenlücken und Runtime-Checkpoint, parametrisierte SQL-Werte, definierte Revision-/Konfliktfehler. Die Preferences-Revision schützt auch konkurrierende Zieländerungen; keine HA-ACL/API, Live-Subscription oder neue Entitäten.
- `test_level=T0/T1`. Unabhängig geprüfter [MA-010 GitHub-Actions-Lauf 45692645968](https://github.com/TheDaimos/gewitterradar/actions/runs/45692645968) auf **exakt `e2b50820be698b657c4865317a666d661ab9ac7b` completed/success**: `python -m compileall -q custom_components/gewitterradar/monitored_areas` PASS; `python scripts/test-ma-010.py` **5 OK**, `python scripts/test-ma-009.py` **8 OK**, `python scripts/test-ma-008.py` **5 OK**, `python scripts/test-ma-007.py` **6 OK**, `python scripts/test-ma-006.py` **7 OK**; insgesamt **31 bestandene SQLite-Vertragstests**.
- Auf demselben SHA zusätzlich **completed/success**: [MA-006 45692645447](https://github.com/TheDaimos/gewitterradar/actions/runs/45692645447), [MA-007 45692644938](https://github.com/TheDaimos/gewitterradar/actions/runs/45692644938), [MA-008 45692645066](https://github.com/TheDaimos/gewitterradar/actions/runs/45692645066), [MA-009 45692645639](https://github.com/TheDaimos/gewitterradar/actions/runs/45692645639), [HA-Integration 45692645591](https://github.com/TheDaimos/gewitterradar/actions/runs/45692645591), [MA-004 45692644984](https://github.com/TheDaimos/gewitterradar/actions/runs/45692644984) und [Hi-Res-Asset-Schutz 45692644915](https://github.com/TheDaimos/gewitterradar/actions/runs/45692644915). [Shared Frontend 45692644988](https://github.com/TheDaimos/gewitterradar/actions/runs/45692644988) war bei der Prüfung noch IN_PROGRESS und wird nicht als PASS gewertet.
- `latest_T2_baseline_sha=18f505ba8933d1036660133fc5c5ca1b627c596a` (P00 Feature-OFF-Bestandsschutz, keine MA-010-T2-Baseline); `latest_T3_baseline_sha=keine`; `invalidated_baselines`: neu eingeführter ON-Repository-Schreibpfad ist von der bisherigen P00-OFF-Baseline nicht gedeckt. P01-T2-Gate planmäßig erst nach MA-011 separat.
- `known_blockers`: kein Blocker für den T0/T1-Vertragsabschluss; I/O-Versagensklassifikation (FULL/READONLY/CORRUPT) erst MA-011; keine HA DEV VM109-Abnahme des neuen Speicherpfads, keine neue DEV-/FINAL-Installation; `DEV_user_accepted=false` für MA-010. V4.13 FINAL, V4.14.1 DEV, WeatherRouter und PROD VM101 geschützt.
- `next_task=MA-011`: isolierte Storage-Schreibfehlerklassifikation und fail-closed Behandlung, ohne UI/Provider/Alarmierung; MA-011 noch nicht begonnen.


## MA-011 – SQLite-Schreibfehlerbehandlung / P01 implementierungsseitig fertig (25.11.2026)

**Status: MA-011 VERIFIED_T0_T1. P01-Implementierung MA-006 bis MA-011 abgeschlossen, aber P01-PHASENGATE NICHT FREIGEGEBEN.** Geschützter Tag `v4.14.1-dev` weiterhin unverändert auf `18f505ba8933d1036660133fc5c5ca1b627c596a` (GitHub-Readback). Keine Installation auf VM109; PROD VM101, V4.13 FINAL und WeatherRouter unangetastet.

- `task_id=MA-011`; `implementation_commit=3a556d9a76d2b2a6e919f094d4fbc34a8fae7069`; `current_task=MA-011 VERIFIED_T0_T1`; `next_task=MA-GATE-P01` (separater T2-Auftrag, nicht bereits gestartet).
- `changed_paths`: `.github/workflows/ma-011.yml`, `custom_components/gewitterradar/monitored_areas/storage/database.py`, `custom_components/gewitterradar/monitored_areas/storage/errors.py`, `custom_components/gewitterradar/monitored_areas/storage/repositories.py`, `custom_components/gewitterradar/monitored_areas/storage/schema.py`, `scripts/test-ma-011.py`.
- `affected_contracts`: stabile Fehlerklassifikation `storage_full`, `storage_readonly`, `storage_corrupt`, `storage_unavailable`, `busy`, `unsupported_schema`; interner Storage-Status; Workerfehler, ausstehende Futures und kontrollierter Wiederanlauf; Schema v3 unverändert; keine weiteren HA-Entitäten, Frontend-/Provider-/Alarmfunktionen.
- `test_level=T0/T1`. [MA-011 GitHub Actions 45693983693](https://github.com/TheDaimos/gewitterradar/actions/runs/45693983693) auf **exakt `3a556d9a76d2b2a6e919f094d4fbc34a8fae7069` completed/success**. Tatsächlich ausgeführt: `python -m compileall -q custom_components/gewitterradar/monitored_areas` PASS; `python scripts/test-ma-011.py` **5 OK**; `python scripts/test-ma-010.py` **5 OK**; `python scripts/test-ma-009.py` **8 OK**; `python scripts/test-ma-008.py` **5 OK**; `python scripts/test-ma-007.py` **6 OK**; `python scripts/test-ma-006.py` **7 OK**; insgesamt **36 SQLite-Tests OK**. GitHub-Joblog geprüft, nicht nur aus Workflow-Definition abgeleitet.
- Weitere Läufe auf exakt diesem Commit **completed/success**: [MA-010 45693983962](https://github.com/TheDaimos/gewitterradar/actions/runs/45693983962), [MA-009 45693983496](https://github.com/TheDaimos/gewitterradar/actions/runs/45693983496), [MA-008 45693983313](https://github.com/TheDaimos/gewitterradar/actions/runs/45693983313), [MA-007 45693983921](https://github.com/TheDaimos/gewitterradar/actions/runs/45693983921), [MA-004 45693983675](https://github.com/TheDaimos/gewitterradar/actions/runs/45693983675), [Hi-Res 45693983461](https://github.com/TheDaimos/gewitterradar/actions/runs/45693983461). Bei diesem Readback [MA-006-separat 45693983958](https://github.com/TheDaimos/gewitterradar/actions/runs/45693983958), [HA-Integration 45693983390](https://github.com/TheDaimos/gewitterradar/actions/runs/45693983390) und [Shared Frontend 45693983971](https://github.com/TheDaimos/gewitterradar/actions/runs/45693983971) noch IN_PROGRESS; keinen Erfolg behaupten. MA-006-Suite wurde unabhängig davon im erfolgreichen MA-011-Lauf verifiziert.
- `latest_T2_baseline_sha=18f505ba8933d1036660133fc5c5ca1b627c596a` (historische P00 Feature-OFF-/Bestandsschutzreferenz, keine P01-T2-Freigabe); `latest_T3_baseline_sha=keine`. `invalidated_baselines`: MA-006 bis MA-011 führen neue ON-Persistenz-, Migrations-, Repositories- und Storage-Fehlerpfade ein, die durch eine alte OFF-Baseline nicht gedeckt sind; MA-GATE-P01 muss diese begrenzt zusammenhängend prüfen.
- `known_blockers`: kein Blocker für MA-011 T0/T1; risikobasiertes eigenständiges T2-Gate MA-GATE-P01 noch nicht ausgeführt; reale MA-ON-Tests auf HA DEV VM109 nicht erfolgt, keine T3-/Release-Abnahme. `DEV_user_accepted=false` für MA-011. Weder DRA-Bereitstellung noch FINAL-Veröffentlichung erfolgte.
- `next_task=MA-GATE-P01`: einmalige risikobasierte, deduplizierte P01-Phasenregression auf verifiziertem aktuellen Code; PASS/FAIL/BLOCKED mit konkreten Nachweisen dokumentieren; P02/MA-012 erst nach separater Betreiberfreigabe.


## MA-GATE-P01 – risikobasierte T2-Phasenprüfung (25.11.2026)

**Ergebnis: `gate_result=PASS` für die ausdrücklich getesteten Repository-/CI-Verträge; noch keine reale HA-DEV-ON-Abnahme und keine T3-/Release-Freigabe.** Die oben dokumentierte historische BLOCKED-Lage wurde durch die erfolgreich ausgeführte CI abgelöst. P01 darf nach gesonderter Betreiberentscheidung für die weitere P02-Entwicklung freigegeben werden, nicht für Produktion.

- `task_id=MA-GATE-P01`; `gate_baseline_sha=fdb5296884330c2b4185c264f36311052c9dd068` (geprüfter Eingangspunkt); `gate_implementation_commit=0401e966b65f8123101695687d3de48d25dc0601`; `tested_commit=0401e966b65f8123101695687d3de48d25dc0601`; `current_task=MA-GATE-P01 T2_CI_PASS`; `test_level=T2`; `next_task=P02/MA-012..015 nach Betreiberfreigabe`.
- `changed_paths`: `.github/workflows/ma-gate-p01.yml`, `scripts/test-ma-gate-p01.py`. Kein MA-Anwendungscode geändert, geschützter `v4.14.1-dev`-Tag weiter auf `18f505ba8933d1036660133fc5c5ca1b627c596a`.
- `test_suite_digest=SHA256 scripts/test-ma-gate-p01.py: 1a3c9e48fdff821146cb4c5e4f3d2620d11f749e23d0483b840b22d4b2e08303` (GitHub CI-Joblog; kein erfundener digest für die transitiven HA-Pakete). Vollständiger Testsuitenstand durch `tested_commit` und Workflow fixiert.
- `affected_contracts`: MA-006..011 gemeinsam: Feature-ON Lifecycle/Restart, Schemaversion-3-Integrität/Worker-PRAGMAs, Repositories/Transaktionen/Replay/Standortbeziehungen, Fehlerrollback/Recovery, echte SQLite-Dateien; native HA-Feature-OFF-Regression. Keine echte Provideranbindung, keine DEV-Runtime-ON-Inbetriebnahme.
- `commands`: Storage-Job `git rev-parse HEAD`, `sha256sum scripts/test-ma-gate-p01.py`, `python scripts/test-ma-gate-p01.py` **4 Tests OK**; nativer OFF-Job `python -m pip install pytest-homeassistant-custom-component==0.13.362`, `python -m pip install --no-deps --force-reinstall homeassistant==2026.9.0`, `python -m pytest -q tests/test_ma005_off.py tests/test_migration_fresh_install.py` **6 passed**. Beide Jobs auf exakt demselben SHA `completed/success`; [GitHub CI 45694648331](https://github.com/TheDaimos/gewitterradar/actions/runs/45694648331), [Storage job 139488745192](https://github.com/TheDaimos/gewitterradar/actions/runs/45694648331/job/139488745192), [native OFF job 139488745586](https://github.com/TheDaimos/gewitterradar/actions/runs/45694648331/job/139488745586).
- `results`: **PASS – T2-Storage 4/4, native HA-Feature-OFF 6/6**. Auf demselben SHA außerdem [HA-Integration 45694648108](https://github.com/TheDaimos/gewitterradar/actions/runs/45694648108), [MA-004 45694648137](https://github.com/TheDaimos/gewitterradar/actions/runs/45694648137) und [Hi-Res 45694648090](https://github.com/TheDaimos/gewitterradar/actions/runs/45694648090) `completed/success`. [Shared Frontend 45694648085](https://github.com/TheDaimos/gewitterradar/actions/runs/45694648085) beim letzten Readback noch `IN_PROGRESS`, kein PASS behauptet.
- `latest_T2_baseline_sha=0401e966b65f8123101695687d3de48d25dc0601` für den geprüften **P01-T2-CI-Vertragsumfang** (ersetzt die bisher alleinige P00-Baseline nicht für P00-Bestandsschutz); `latest_T3_baseline_sha=keine`; `invalidated_baselines`: keine Anwendungscodeänderung gegenüber dem geprüften MA-011-Implementierungsstand; neues P01-Gate deckt den integrierten Storage-T2-Scope ab. Nachfolgende P02-Änderungen invalidieren jeweils nur die betroffenen Verträge.
- `known_blockers`: keine für T2-CI-Gate im dokumentierten Umfang; reale HA-DEV-ON-Abnahme VM109, vollständige T3-Abnahme und endgültige Releaseprüfung ausstehend. `DEV_user_accepted=false` für P01-Laufzeitfunktion; geschützter v4.14.1-dev-Betreiber-Sichtsmoke bleibt separat gültig. PROD VM101 und WR unverändert. `gate_result=PASS` bedeutet keine automatische DEV-/PROD-Freigabe.


## P02 – MA-012 bis MA-015: Implementierung / gezielte CI-Readbacks (25.11.2026)

**Status: Code für MA-012 bis MA-015 implementiert; das vollständige P02-T0/T1-Gate ist erst nach Abschluss der nativen HA-WebSocket-CI abschließend zu bewerten. Keine VM109-Installation, keine DRA-Bereitstellung, keine P02-T2-/T3-Freigabe.** Der vorherige Eintrag `MA-GATE-P01 PASS` bleibt die letzte gültige T2-Baseline. P02-Einführung eines zusätzlichen idempotenten Request-Receipt-Schemas erforderte eine atomare v3→v4-Migration. Keine Änderungen an `v4.14.1-dev` oder FINAL.

### MA-012 – Standort-CRUD
- `task_id=MA-012`, Implementierung: [`e0d87a6021165f8b006c2428e31dbd7be1103360`](https://github.com/TheDaimos/gewitterradar/commit/e0d87a6021165f8b006c2428e31dbd7be1103360). Zusätzliche Test-/Workflow-Commits `28a0b0b1`, `31692a88`.
- `changed_paths`: `custom_components/gewitterradar/monitored_areas/locations.py`, `scripts/test-ma-012.py`, `.github/workflows/ma-012.yml`.
- `affected_contracts`: stabiler Standort UUID4, WGS84 endliche Koordinaten, Name und Revision; interner Service ohne öffentliche API; keine neue Ortssuche oder Entity.
- `test_level=T0/T1`, [CI 45696077992](https://github.com/TheDaimos/gewitterradar/actions/runs/45696077992) **completed/success**; Standorttests mit realem SQLite-Worker inklusive Eingabevalidierung, Stale-Revision und unverändertem Bestand.

### MA-013 – Profilverknüpfungen und serverseitiger Vault-Nachweis
- `task_id=MA-013`, zentrale Implementierungscommits [`79bcb596`](https://github.com/TheDaimos/gewitterradar/commit/79bcb596037bf1f2e11c007daa4d394081870fe3) (Vault-Prüfport) und [`c26c6226`](https://github.com/TheDaimos/gewitterradar/commit/c26c622685d157dbeb940200bccc1ad9a4ff3031) (Links), Tests/CI `1766a111`/`8fceb2ab`.
- `changed_paths`: `custom_components/gewitterradar/settings_vault.py`, `custom_components/gewitterradar/monitored_areas/identity.py`, `scripts/test-ma-013.py`, `.github/workflows/ma-013.yml`, nativer Eigentümerschaftstest in `tests/test_settings_vault.py`.
- `affected_contracts`: Ownership-Abfrage über echten privaten, vom HA-User-ID abgeleiteten Vault-Store. `async_profile_belongs_to(user,profile)` ist rein lesend und bei fehlendem, fremdem oder Recovery-only-Profil fail-closed; keine Authentifizierung anhand Browserzustand. Viele Profile können denselben Ort referenzieren. Die tatsächliche authentifizierte WS-Anbindung folgt in MA-015.
- `test_level=T0/T1`, [CI 45696208016](https://github.com/TheDaimos/gewitterradar/actions/runs/45696208016) **completed/success** für Link-Scope; isolierter nativer Vault-Berechtigungstest wurde außerdem in [CI 45697135148](https://github.com/TheDaimos/gewitterradar/actions/runs/45697135148) als **1 passed** ausgeführt (dieser komplette Run war wegen anderer Testisolationsfrage nicht grün; kein Gesamt-SUCCESS behauptet).

### MA-014 – Schutz, Adminbestätigung, getrennter Historienreset
- `task_id=MA-014`; Schlüsselcommits [`360e92a9`](https://github.com/TheDaimos/gewitterradar/commit/360e92a9659f346b38e752014e031fa57f7b3b0e), `8dce8406`, `213057ab`, [`dcaec29d`](https://github.com/TheDaimos/gewitterradar/commit/dcaec29dc42f3efe7ed8f4274aef96165c9e59f9) sowie API-Historienreset [`08fb7d06`](https://github.com/TheDaimos/gewitterradar/commit/08fb7d0629f42b0d61bbd1632f33072332d3a214).
- `changed_paths`: `monitored_areas/permissions.py`, `scripts/test-ma-014.py`, `.github/workflows/ma-014.yml`; History-Reset-API/Tests in MA-015-Dateien.
- `affected_contracts`: atomare verknüpfungsspezifische Entfernung, Schutz der letzten Verknüpfung, HA-Adminstatus über Backend-Caller, zeitlich begrenzter aktionsgebundener Nonce, Revision/Counts; Koordinaten bei Historie geschützt; separater transaktionaler Reset von Historien-/Gap-Daten ohne stilles Löschen von Ort, Links oder Tracker. `PermissionError` aus OS-/SQLite-Pfaden und fachliche Autorisierungsablehnung werden getrennt klassifiziert.
- `test_level=T0/T1`: Vier MA-014-Tests sind im erfolgreichen API-Job von [CI 45698013811](https://github.com/TheDaimos/gewitterradar/actions/runs/45698013811) ausgeführt worden; Gesamt-Runtime/HA-Nachweis siehe MA-015.

### MA-015 – authentifizierte WebSocket-API und atomare Receipts
- `task_id=MA-015`; Kerncommits [`1bd1c9e3`](https://github.com/TheDaimos/gewitterradar/commit/1bd1c9e3562937c740ce591587d664f02084535a) (Schema v4), [`469bd708`](https://github.com/TheDaimos/gewitterradar/commit/469bd708fd42fd61b0a435272fdf74d3ccd26a13) (WS/API), `bc552179` und `ef181d7c` (optional ON-Lifecycle/Registrierung), danach gezielte Sicherheits-/Testkorrekturen bis `86f42dbe6799a67144b5427e8b2ef457561e048d`.
- `changed_paths`: `monitored_areas/api.py`, `monitored_areas/storage/schema.py`, `monitored_areas/runtime.py`, `custom_components/gewitterradar/__init__.py`, `tests/test_ma015_native_ws.py`, `scripts/test-ma-015.py`, `.github/workflows/ma-015.yml` sowie Migrationserwartungen in älteren Testskripten und Vault-Ownership-Test.
- `affected_contracts`: echte `connection.user.id` / `connection.user.is_admin`, aktive HA-User- und serverseitige Vault-Profilprüfung, profilgefilterte Standort- und Link-Operationen, sichere Mutationen, atomare technische Request-Receipts `request_receipts` (`PRAGMA user_version=4`), Idempotenz/Replay-/Revisionskonflikte, adminbestätigter letzter Link und getrennte Historienlöschung. Keine Tracker-/Provider-/Push-Side-Effects. Bei OFF vor erstmaligem ON keine MA-WS-Registrierung; nach ON/Unload registrierte Befehle strikt inert.
- `test_level=T0/T1`: API-/Storage-Job auf [CI 45698013811](https://github.com/TheDaimos/gewitterradar/actions/runs/45698013811) **completed/success** mit 7 MA-015-, 4 MA-014-, 3 MA-013-, 3 MA-012- und 5 MA-011-Tests. **Der native HA-WebSocket-/Vault-Job war beim Dokumentationsentwurf noch IN_PROGRESS** und wird nicht vorzeitig als PASS gezählt. Ein früherer nativer CI-Lauf fand eine Testisolationskollision (synthetische DB des ON-Tests vor separater OFF-Prüfung), die im Testcode mit `86f42dbe` korrigiert wurde; CI-Readback des korrigierten Stands ausstehend.

`latest_T2_baseline_sha=0401e966b65f8123101695687d3de48d25dc0601` (P01-Verträge, nicht als P02-T2 ausgegeben); `latest_T3_baseline_sha=keine`. `invalidated_baselines`: neue P02-ON-ACL-/WS-/Receipt-/v3→v4-Migrationspfade benötigen eigenes P02-T2-Gate und spätere echte HA-DEV-ON-Abnahme. `known_blockers`: native MA-015-CI vor finaler P02-T0/T1-Freigabe bestätigen; umfassender Audit-Log/Retentionvertrag und umfassende HA-Backup-/Restore-Automatik sind nicht durch die v4-Receipts ersetzt und bleiben gesondert abzugrenzen. `next_task=MA-GATE-P02` **erst nach erfolgreichem T0/T1- und Betreiberabschluss**. Kein P03-/MA-016-Start. Keine DRA-/DEV-Installation; V4.13 FINAL, V4.14.1 DEV, WR und PROD VM101 unverändert.
