# GewitterRadar V4.14 · Monitored Areas – dauerhafte Projektübergabe

**Stand:** 25.11.2026, nach Abschluss der gezielten P02-T0/T1-CI.  
**Zweck:** Kompakter, belastbarer Wiederanlaufpunkt bei Kontext-/Speicherwechsel; kein Ersatz für die vollständige [Statuschronik](MONITORED_AREAS_V412_STATUS.md), den [56-Task-Plan](MONITORED_AREAS_V412_IMPLEMENTIERUNGSPLAN.md) oder den [MA-002-Architekturvertrag](MONITORED_AREAS_V414_MA002_ARCHITEKTUR.md).

## 1. Unveränderliche Schutz- und Arbeitsregeln

- **Repo:** `TheDaimos/gewitterradar`; MA-Anwendungscode **nur** auf `feature/v4.14-monitored-areas`. `deploy/dev` erhält in dieser Entwicklungsphase ausschließlich fortgeschriebene Dokumentation. `main`, V4.13 FINAL, PROD VM101 und WeatherRouter nicht verändern.
- **Geschützte, vom Betreiber zuvor sichtgeprüfte DEV-Referenz:** `v4.14.1-dev` → `18f505ba8933d1036660133fc5c5ca1b627c596a` (GitHub-Tag-Readback in diesem Dokumentationsschritt).
- **Niemals automatisch:** DRA-Bereitstellung, VM109-Installation, neues DEV-/FINAL-Release, P03/MA-016. Auch die erfolgreiche CI ist **keine** produktive oder reale DEV-ON-Abnahme.
- **Regeln:** `AGENTS.md`, `docs/PROJECT_BOOTSTRAP.md`, `docs/MODULE_PROVIDER_ISOLATION_GUARD_2026-11-13.md`. Funktionierende GR-/WR-Referenzmodule (Karte, bisherige Ortssuche, Referenztracker, Eye Hub, Legend Hub, Mond, DWD/OPERA/NASA, Settings Vault) nur additiv und regressionsgeschützt erweitern.
- **Keine Freigabe ohne echten Nachweis.** CI-Ergebnisse stets an exakten SHA, Testumfang und Run koppeln. Fehler untersuchen und korrigieren, nicht bloß protokollieren. Fehlende Runtime-Möglichkeiten als `BLOCKED` kennzeichnen; keine Mockprüfung zu einem HA-Realtest umdeuten.

## 2. Nachweisbare Chronologie

| Abschnitt | Geprüfte Referenz | Beleg / Abgrenzung |
|---|---|---|
| P00-Referenz | `v4.14.1-dev` / `18f505ba` | DEV-Sichtprüfung des Betreibers auf VM109; ältere Referenz, **nicht** P02-Code |
| P01 SQLite-Basis MA-006–011 | `3a556d9a76d2b2a6e919f094d4fbc34a8fae7069` | [36 SQLite-T0/T1-Tests](https://github.com/TheDaimos/gewitterradar/actions/runs/45693983693), SUCCESS |
| P01 T2 Gate | `0401e966b65f8123101695687d3de48d25dc0601` | [T2-CI](https://github.com/TheDaimos/gewitterradar/actions/runs/45694648331), **4 SQLite-Integrationstests und 6 HA-Feature-OFF-Tests PASS**; keine VM109-ON-Abnahme |
| MA-012 | `e0d87a6021165f8b006c2428e31dbd7be1103360` + Tests/Workflow bis `31692a88` | [Standort-CRUD-CI](https://github.com/TheDaimos/gewitterradar/actions/runs/45696077992), SUCCESS |
| MA-013 | Vault-Adapter `79bcb596037bf1f2e11c007daa4d394081870fe3`, Link-Service `c26c622685d157dbeb940200bccc1ad9a4ff3031`, Tests bis `8fceb2ab` | [Mehrprofil-CI](https://github.com/TheDaimos/gewitterradar/actions/runs/45696208016), SUCCESS |
| MA-014 | u. a. `360e92a9659f346b38e752014e031fa57f7b3b0e`, `dcaec29dc42f3efe7ed8f4274aef96165c9e59f9`, `08fb7d0629f42b0d61bbd1632f33072332d3a214` | Schutz- und Löschtests im späteren grünen MA-015-Lauf nachgewiesen; anfängliche Fehler korrigiert |
| MA-015 / P02 T0/T1 | **`86f42dbe6799a67144b5427e8b2ef457561e048d`** | [Gezielte MA-015-/native-HA-CI 45698013811](https://github.com/TheDaimos/gewitterradar/actions/runs/45698013811), **COMPLETED/SUCCESS**: 22 interne Tests (7 MA-015, 4 MA-014, 3 MA-013, 3 MA-012, 5 MA-011) **und 4 native HA-Prüfungen** (1 Vault-Ownership, 1 echter WS-Identitäts-/Spoof-Test, 2 Feature-OFF) |

**GitHub-Readback beim Erstellen dieser Übergabe:** Der MA-015-Hauptlauf ist grün und der Hi-Res-Asset-Lauf auf dem Anwendungscode-SHA ist SUCCESS. Die allgemeine HA-Integrations- und Shared-Frontend-CI für `86f42dbe` war zum Abruf noch `queued`, also ausdrücklich **nicht als PASS behaupten**. Auf dem Feature-Branch folgten ausschließlich Statusdokumentationscommits (`abb0654ff...`); der letzte geprüfte **Anwendungscode-SHA** bleibt `86f42dbe...`.

## 3. Implementierte technische Fähigkeiten (kein Endnutzer-Release)

**P01: SQLite-Fundament**
- Optionaler, Feature-Flag-OFF standardmäßig inaktiver SQLite-Worker mit begrenzter Queue, WAL, `synchronous=FULL`, `foreign_keys=ON`, atomaren Transaktionen, kontrolliertem Lifecycle, Fehlerklassifikation (`storage_full`, `storage_readonly`, `storage_corrupt`, `storage_unavailable`, `busy`, `unsupported_schema`).
- Schema v1: `locations`, `profile_links`, `profile_preferences`, `notification_targets`; v2: `tracker_refs`; v3: `lightning_reports`, `possible_duplicates`, `sessions`, `session_reports`, `source_gaps`, `runtime_checkpoint`.
- Transaktionale Repositories, Revisionen/konkurrierende Updates, Replay-Identitäten, Historien-Constraints; kein automatischer Ersatz beschädigter DBs.

**P02: Standort-/Profil-Backend**
- `monitored_areas/locations.py`: interner UUID4-/WGS84-validierter Standort-Create/Read/Update-Port mit Optimistic Locking.
- `settings_vault.py`: `async_profile_belongs_to(user,profile_id)` liest ausschließlich den privaten Store des authentifizierten HA-Benutzers und lehnt Fremd-/fehlende/Recovery-only-Profile **fail-closed** ab. `monitored_areas/identity.py` verlangt diesen serverseitigen Beleg für Profil-Links.
- `monitored_areas/permissions.py`: eigener Lösch-/Bestätigungsschutz mit kurzlebiger, aktions- und benutzergebundener Nonce, Revision und Zählern, getrennte Historienreset-Vorschau. Ein normaler Link-Remove darf keine gemeinsame Historie löschen. Die Korrektur unterscheidet fachliches `ProtectionDenied` vom OS-`PermissionError`, damit der DB-Worker keine Autorisierungsverweigerung als schreibgeschütztes Dateisystem missdeutet.
- `monitored_areas/api.py`: optionaler, authentifizierter HA-WebSocket-Namespace `gewitterradar/monitored_areas/`; Actor/Admin **nur** aus `connection.user`. Profil- und Standortprüfung in den Mutationen wiederholt; Status meldet nicht implementierte Monitoring-/Push-/Trackerfunktionen als deaktiviert. `locations_list/get/create/update`, `monitoring_update` (nur Konfiguration), `links_list/share/transfer/remove`, `preferences_update`, `links_remove_preview`, `history_reset_preview/commit`.
- Schema **v4** ergänzt die Tabelle `request_receipts`. Mutation und persistentes Receipt bilden **eine** SQLite-Transaktion; identisches Request-/Payload-Replay liefert denselben bestätigten Zustand, widersprüchlicher Replay wird abgewiesen. Test bestätigt u. a. Replay **nach** der endgültigen Löschung.
- `runtime.py` und native `__init__.py` registrieren diese API nur bei explizit aktiviertem, erfolgreich gestartetem MA-Lifecycle und vorhandenem Vault-Prüfport. Nach Unload bleiben HA-global registrierte Kommandos höchstens **inert** und dürfen keine MA-Datenbank öffnen.

**Wichtige Architekturgrenze:** Die interne Repository-Schicht ist kein Rechteträger. Ein dauerhaftes vollständiges Audit-Log, Receipt-Retention/Pruning, alle späteren Tracker-/Blitzortung-Subscriptions, Quellenbindungen, Alarm-Outbox, UI und Backup/Restore sind **nicht** mit diesen Tests als fertig nachgewiesen.

## 4. Prüferkenntnisse, die nicht verloren gehen dürfen

1. **Vault-Eigentümerschaft war die P0-Sicherheitsanforderung.** Ein Browser-provided `profile_id` ist nur ein Selektor, kein Berechtigungsnachweis. Bei unbekanntem, fremdem, inaktivem oder nicht nachweisbar verifiziertem Konto/Profil strikt ablehnen. HA-Admin ist nicht automatisch Besitzer fremder Vault-Profile. Tests: `tests/test_settings_vault.py` (MA-013-Ownership) und `tests/test_ma015_native_ws.py` (echte WS-Benutzeridentität + fremdes Profil).
2. **SQLite-OS- und Fachfehler trennen.** Der erste MA-014-Test scheiterte, weil eine eigene `PermissionError`-Ablehnung fälschlich als SQLite-READONLY gewertet wurde. `ProtectionDenied` behebt das, ohne Sicherheitsassertions abzuschwächen.
3. **Replay darf nach Löschung nicht zu `not_found` werden.** Der erste MA-015-Test scheiterte, weil vor dem Receipt-Readback erneut das inzwischen gelöschte Standortobjekt geprüft wurde. Der Receipt-Lookup muss eine bereits erfolgreich bestätigte, identische Mutation aus demselben User-Scope auch nach Löschung erkennen; geänderter Payload muss Konflikt bleiben.
4. **Versionsmigration benötigt aktualisierte echte Tests.** P01-Schema v3 wurde mit P02 um v4/Receipts erweitert; v1/v2/v3→v4 und Rollback nach Fehlschlag sind Prüfpflicht. Alte Tests mit hart kodierter `user_version=3` müssen für den aktuellen Schema-Stand eingeordnet werden, ohne ihre ursprünglichen Integritätsassertions aufzuweichen.
5. **Native-HA-Testisolierung:** Der erste kombinierte HA-Run hinterließ durch einen ON-Test eine synthetische Datenbank im wiederverwendeten `testing_config`; der danach folgende OFF-Test erkannte sie korrekt und schlug fehl. Der Test bereinigt nur **eigene synthetische Testdateien nach vollständigem Unload** (`86f42dbe`). Diese spezielle Cleanup-Strategie ist **keine Anwendungscode-Löschlogik**. Der Nachfolgelauf [45698013811](https://github.com/TheDaimos/gewitterradar/actions/runs/45698013811) bestand inkl. beider OFF-Varianten.
6. **Keine falsche Gleichsetzung:** 22 interne Tests + 4 native HA-Prüfungen auf Runnern ≠ reale VM109-Mehrbenutzerprüfung; `P02 T0/T1=PASS` ≠ `P02 T2=PASS`, `T3` oder Veröffentlichung.

## 5. Aktueller Arbeitsstatus – nächster zwingender Schritt

- `current_phase=P02`; `implementation_status=MA-012..015 T0/T1 PASS`; `gate_status=MA-GATE-P02 NOT_RUN`.
- `latest_valid_P01_T2_baseline_sha=0401e966b65f8123101695687d3de48d25dc0601`; `latest_P02_T2_baseline_sha=keine`; `latest_T3_baseline_sha=keine`.
- `next_task=MA-GATE-P02`: separater, risikobasierter HA-/SQLite-/Vault-Integrationsgate-Auftrag. **Noch nicht als gestartet oder bestanden ausgeben.** P03/MA-016 erst nach Gate und gesonderter Betreiberfreigabe.
- `known_blockers`: P02-T2-Prüfung der vollständigen Berechtigungsgrenzen, Receipt-/v4-Migration, Admin-Nonce, Historienreset und HA-Runtime; reale MA-ON-Prüfung DEV VM109 nicht ausgeführt; eventuelle vollständige Audit-/Retention-Verträge separat mit MA-002 abgleichen. Allgemeine CI, soweit noch queued, nachlesen statt raten.
- `protected`: V4.13 FINAL, `v4.14.1-dev`, WeatherRouter/Provider, PROD VM101. Keine DRA-/HA-Installation, kein MA-Code in `deploy/dev`.

### Konkrete Fortsetzung für einen neuen Chat / Codex

1. `AGENTS.md`, `docs/MONITORED_AREAS_V412_STATUS.md`, dieses Handoff, MA-002-Architektur und Implementierungsplan lesen.
2. Aktuellen **remote** Feature-HEAD, `deploy/dev`-HEAD, geschützten `v4.14.1-dev`-Tag, FINAL-Tags und relevanten WeatherRouter-HEAD neu prüfen. `86f42dbe` ist der hier **getestete Anwendungsstand**, nicht blind der HEAD für zukünftige Codeänderungen.
3. Existierende grüne Testbelege einmalig übernehmen; für den neuen P02-T2-Scope gezielte neue Integrations-/Sicherheitstests mit echten HA-Testfixtures und temporären SQLite-Dateien schreiben. Keine redundant vollständigen Re-Tests ohne Interface-Änderung.
4. Negative ACL-Szenarien (fremde Profile, fehlender Vault, inaktive User, gefälschte Adminclaims, UUID-Enumeration) ebenso prüfen wie konkurrenzbedingte Revisions-/Receipt-Races, migrationsbedingten Bestandserhalt und datenkonsistente Lösch-/Resetversuche.
5. Fehlgeschlagene Tests **wirklich** korrigieren, betroffene Tests erneut laufen lassen, neue SHA/CI-Run/Digest dokumentieren. Bestehende P01/OFF-Referenzfunktionen und nicht betroffene Module schützen. Kein bypass oder weakened assertion.
6. Gate-Ergebnis **PASS/FAIL/BLOCKED** mit exaktem getesteten Commit und Scope dokumentieren. Status auf Feature fortschreiben, **nur Dokumentation** nach `deploy/dev` synchronisieren. P03/MA-016 nicht selbst starten; keine VM109-Installation oder Veröffentlichung.

**Dokumentationshierarchie:** Diese Datei ist ein point-in-time-Handoff. `MONITORED_AREAS_V412_STATUS.md` führt die fortlaufende Chronik, die Architektur enthält Sollverträge, der Implementierungsplan die Aufgaben- und Gatefolge. Spätere Commits können hier genannte Ausgangsstände überholen; deshalb bei Fortsetzung den Remote-Readback wiederholen.
