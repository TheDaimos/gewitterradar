# GewitterRadar V4.14 – P03 Fortsetzungsanker / MA-020–022

**Stand:** 25.11.2026. **Kein P03-Phasengate und keine neue DEV-Installation.** Diese Datei ergänzt die [kanonische Statuschronik](MONITORED_AREAS_V412_STATUS.md) und die [P02-Übergabe](MONITORED_AREAS_P02_HANDOFF_2026-11-25.md).

## Ausführungsstand (tatsächlich implementiert, nicht nur vorbereitet)

Der übernommene Feature-HEAD zu Beginn dieser Arbeiten war `eb99a54bb4a69a690b24c5bc2db4e3aaedb26d56`. Anders als die vorherigen EC-Eingangskontrollen haben die darauffolgenden GitHub-Connector-Operationen **wirkliche Code-/Testcommits** erzeugt.

| Task | Implementierte Teile | CI-Beweis | Grenze |
|---|---|---|---|
| MA-016 | P02-authentifiziertes `places_list` mit Query und stabiler Pagination; isolierter JS LocationPort samt dreier identischer Spiegel | [45703000900](https://github.com/TheDaimos/gewitterradar/actions/runs/45703000900) 19 Python PASS; [45703207382](https://github.com/TheDaimos/gewitterradar/actions/runs/45703207382) 5 JS + 19 Python PASS | Bestehender Controls-Dialog weiterhin Legacy; kein DB-Cutover vor MA-020 |
| MA-017 | LocationPort: WGS84-Koordinaten kopieren/einfügen; DB-Create/Name-Update über P02-WS mit Request-ID/Revision | [45703660975](https://github.com/TheDaimos/gewitterradar/actions/runs/45703660975) SUCCESS | UI-Aufrufe nur für autorisierten späteren DB-Modus; keine ungeprüfte Aktivierung |
| MA-018 | `migration_preview`: HA-To-do-Service als read-only Quelle, GEWITTERRADAR_PLACE_V1-Parser, Source-/DB-Prüfsummen, Invalid-/Konfliktvorschau | [45703822329](https://github.com/TheDaimos/gewitterradar/actions/runs/45703822329) 23 Python PASS | Nie mutierend; echte UI-Preview-Anbindung fehlt |
| MA-019 | `migration_commit`: Entscheidungen `create/use_existing/replace/skip`, frische Quell-/DB-Prüfung, transaktionale Links/Orte/Preferences + Receipt, legacy bleibt intakt | [45704344709](https://github.com/TheDaimos/gewitterradar/actions/runs/45704344709) SUCCESS (27 Python) | Noch kein persistenter per-item Migration-Receipt; eine HA/SQLite-übergreifende ACID-Transaktion ist unmöglich |

Alle Funktionen sind bislang **Feature-Branch-Implementierungen** und nicht durch reale HA DEV VM109-On-/Mehrbenutzerabnahme oder visuelle Abnahme freigegeben.

## Unveränderliche Sicherheitsbasis

- P02-T2-Code `9c09745ed76b1baaf38e1c2e31b50f61e1dc792c` mit reproduzierten und behobenen P0-Sicherheitsfehlern bei Receipt-/ACL-Replays und Same-Count-Nonces.
- Native HA-Actor nur aus `connection.user`; Vault-Profilzugehörigkeit serverseitig nachweisen; HA-Admin nicht automatisch Eigentümer fremder Vault-Profile.
- Legacy Local-To-do bleibt **maßgeblich**, solange `migration_pending`. Keine automatischen Dual-Writes, kein stilles Zurückfallen bei SQL-Fehlern, kein Entfernen alter Listen.
- V4.14.1 DEV-Referenztag `18f505ba8933d1036660133fc5c5ca1b627c596a` unverändert; V4.13 FINAL, WeatherRouter/Provider, PROD VM101, Karte/Referenztracker/Eye-/Legend-/Moon-Hub geschützt.
- Entwicklungscode ausschließlich `feature/v4.14-monitored-areas`; nur die Dokumentation ist auf `deploy/dev` zu spiegeln.

## Risiken und zwingende Fortsetzung

**Nächste Aufgabe: MA-020** (die bisher nicht implementierte Finalisierung), danach MA-021 und MA-022 mit eigenem T0/T1-Commit/CI je Task. Nicht MA-GATE-P03 oder MA-023 beginnen.

**P0 beim Finalisieren:** Local To-do und SQLite haben **keine gemeinsame Transaktion**. Vor einer realen Löschung die tatsächlich unterstützten HA-Dienste und Admin-Berechtigung prüfen, den **aktuellen Quellbestand erneut hashen**, Import-Readback vergleichen und eine explizite zeitgebundene, Actor-/Vault-/Bestands-Nonce verlangen. Externe Teillöschungen brauchen einen nach Neustart rekonstruierbaren Saga-/Receipt-Zustand. Die bisherige HA-To-do-Liste darf beim geringsten nicht eindeutig lösbaren Zustand **nicht gelöscht** werden. Keine Aussage `db_active`, bevor ein kompletter, sicher verifizierter Finalisierungsschritt persistiert ist. Eine ganze To-do-Listenentität zu entfernen ist nicht dasselbe wie ihre Einträge zu entfernen; keine nicht nachgewiesenen HA-APIs erfinden.

**MA-021/022:** vorhandene verbindliche Havanna-Designreferenz und bestehende v407-Controls weiterverwenden; keinen zweiten Suchdialog, keine anderen Top-Level-Layouts. Frontend-Builder und Spiegel/Inventare synchronisieren. Profile/Freigaben nur mit aktueller serverseitiger P02-ACL und tatsächlichem ACK anbieten; Revisionskonflikte sichtbar darstellen, niemals als Erfolg markieren.

**Integrationslücke offen:** Die bisher isolierten JS-Ports sind noch nicht in den alten Controls-Dialog eingeschaltet. Dies muss vor einer Behauptung fertiggestellter UI-Integration explizit umgesetzt und getestet werden.

## Wiederaufnahme

1. `AGENTS.md`, `MONITORED_AREAS_V412_STATUS.md`, `MONITORED_AREAS_V412_IMPLEMENTIERUNGSPLAN.md`, MA-002-Architektur und diese Datei lesen.
2. GitHub-Remote-HEAD und geschützte Referenzen **neu** prüfen; für erfolgreiche CI nur die exakt belegten SHA-/Workflow-Paare verwenden.
3. MA-020 echte Implementierung mit P0-Safety-Tests beginnen; externe Löschmöglichkeit belegbar prüfen. Falls keine sichere unterstützte Lösung existiert, `MA-020=BLOCKED` dokumentieren, ohne den Altbestand zu löschen.
4. MA-021/022 nur entsprechend Abhängigkeiten und Freigaberegeln implementieren. Nach jedem Task tatsächlichen Commit und T0/T1-CI verifizieren, Statuschronik fortschreiben und **nur Dokumentation** nach `deploy/dev` synchronisieren.
5. Nach allen sieben Arbeitspaketen eigenes `MA-GATE-P03` T2 durchführen; VM109-Installation, DRA oder FINAL nie eigenständig auslösen.

**Aktueller Projektzustand:** P03 **IN_PROGRESS**, MA-016–019 technische Ports mit grünen gezielten CI-Läufen, notwendiges UI-Handoff und MA-020–022 **OFFEN**, `MA-GATE-P03=NOT_RUN`, `T3=keine`.


## Betreiberentscheidung: MA-020 ohne automatisches Entfernen der Local-To-do-Liste

Am 25.11.2026 entschied der Betreiber, dass die verbleibende **leere** Local-To-do-Liste von HA-Benutzern manuell gelöscht wird. Daraus folgt kein Auftrag, HA-ConfigEntries/Listenentitäten programmatisch zu entfernen. MA-020 soll nach **vollständigem** verifizierten Import und gesonderter bestätigter Leerung ausschließlich betroffene Einträge über das unterstützte `todo.remove_item` löschen; anschließend Quellliste vollständig nachlesen, die persistente Migration finalisieren und erst dann im bestehenden GR-Dialog ein Erfolgs-Popup anzeigen („Standorte übernommen. Die Local-To-do-Liste ist jetzt leer und kann bei Bedarf unter Home Assistant manuell entfernt werden.“).

Bei ungültigen, übersprungenen oder fremden Einträgen darf weder pauschal geleert noch eine vollständige Übernahme behauptet werden. Fail-closed, Admin-/Vault-ACL, aktuelle Digests, dauerhafte Saga und Readback-/Neustart-Reconciliation bleiben verbindlich; keine `db_active`-Umschaltung nach nur teilweise erfolgreichem Versuch. Damit entfällt **nur** der Sicherheitsblocker, dass die HA-Listenentität selbst automatisch entfernt werden müsse. `next_task=MA-020`, bislang noch keine Implementierung oder CI zu diesem neuen Ablauf nachgewiesen.


### MA-020 – Verbindlicher Text für das einmalige Erfolgs-Pop-up (25.11.2026)

**Titel:** Standortübernahme erfolgreich

**Text:** Alle gespeicherten Standorte wurden erfolgreich in GewitterRadar übernommen. Die bisherige To-do-Liste wurde vollständig geleert und wird nicht mehr benötigt.

**So entfernst du die alte Liste:**

1. Öffne in Home Assistant **Einstellungen**.
2. Wähle **Geräte & Dienste → Integrationen**.
3. Öffne die Integration **Local To-do**.
4. Suche den Eintrag **„GewitterRadar Orte“**.
5. Öffne das Drei-Punkte-Menü (**⋮**) dieses Eintrags und wähle **Löschen**.
6. Bestätige das Entfernen.

**Info-Hinweis:** Die neue Standortverwaltung in GewitterRadar bleibt davon unberührt. Entferne ausschließlich die alte Liste „GewitterRadar Orte“, nicht andere To-do-Listen.

**Schaltfläche:** Verstanden

Diese Nachricht nur nach vollständigem nachgewiesenem Import, erfolgreich bestätigter Eintragsleerung, erneutem Quell-/DB-Readback und persistierter Finalisierung anzeigen. Keinen Erfolgstext bei Teilmigration, offenem Recovery, verbliebenen Einträgen oder Fehlern anzeigen. Weder automatische Listenentfernung noch MA-GATE-P03 oder Release durch diese Textfestlegung autorisiert.


### MA-020 – Wiederholter Hinweis auf die verbliebene Local-To-do-Liste (Betreiberentscheidung 25.11.2026)

Nach **nachweislich vollständig erfolgreich abgeschlossener Migration**, Eintragsleerung, SQL-Readback und persistierter `db_active`-Finalisierung wird das oben definierte Erfolgs-/Aufräum-Pop-up bei **jedem Start von GewitterRadar** erneut angezeigt, **solange die bisherige Local-To-do-Liste „GewitterRadar Orte“ über die unterstützte HA-Schnittstelle tatsächlich vorhanden ist**. Das Fenster erhält die Checkbox **„Nicht mehr anzeigen“** (Standard: nicht abgehakt) sowie die Schaltfläche **„Verstanden“**. Wird die Checkbox aktiviert und das Fenster bestätigt, ist die wiederholte automatische Anzeige dauerhaft unterdrückt (persistiert in dem jeweils autorisierten Settings-Vault-/Benutzerprofil, nicht nur im flüchtigen JS-Zustand). Beim manuellen späteren Öffnen des Hinweises muss der gespeicherte Checkbox-Zustand sichtbar und änderbar sein; Entfernen des Hakens aktiviert die Anzeige beim nächsten Start wieder. Schließen ohne aktivierte Checkbox unterdrückt ausschließlich die aktuelle Anzeige, nicht spätere Starts.

Wurde die alte Liste tatsächlich entfernt, ist kein automatisches Aufräum-Pop-up mehr erforderlich. Ist die HA-Quellabfrage nicht zuverlässig möglich (unavailable, Berechtigungsfehler, mehrdeutige Quellidentität), darf ein Fehlschlag **nicht als entfernte Liste interpretiert** werden; kein irreführender Erfolg und keine erneute destructive Aktion. Das Popup ist **rein informativ**: es löscht keine Liste, löscht keine weiteren Einträge und schaltet die Datenquelle nicht um. Die wiederholte Anzeige ist strikt an den bereits verifizierten Finalisierungszustand gebunden, nicht an eine bloße sichtbare To-do-Entität vor Migration. Kein ungeprüftes Wiederholen des Imports.

`next_task=MA-020`; diese Ergänzung ist ausschließlich Dokumentation, keine Code-/CI-Abnahme, keine Installation und kein MA-GATE-P03.


## MA-020 Implementierungsübergabe – nach dokumentiertem EC-Stillstand (25.11.2026)

Der ursprünglich offene MA-020-Auftrag wurde inzwischen **in echtem Code** weitergeführt; die frühere reine Eingangskontrolle gilt nicht mehr als aktueller Implementierungsstand. Backend-Saga und optionaler UI-Workflow liegen auf dem Feature-Branch, **MA-020 bleibt jedoch IN_PROGRESS**.

- Backend: `monitored_areas/finalization.py` plus `api.py`/`runtime.py`. Admin-/Vault-bestätigte Preview/Commit-WebSockets, explizite separate Löschbestätigung, persistierte UID-Zustände `pending/requested/absence_verified`, HA-`todo.remove_item` mit frischem HA-Readback, Restart-Wiederaufnahme; serverseitige `db_active`-Projektion nur nach verified Saga. Exakte Local-To-do-Entity-ID, keine Löschung der Listenentität.
- Storage: Schema V5-Journal + transaktionales V6-Originalquellen-Backup `migration_source_backups`; vollständige Quellmetadaten/Bestätigungs-Nonce gegen Änderungen absichern. Migration von früheren Schemas und Integrität prüfen.
- UI: `modules/monitored-areas/migration-wizard.js` (explizite Vorschau/Import/Finalisieren), `index.js` (Hilfe und Hinweise, Start-Erinnerung und Vault-Checkbox), `controls.js` (SQLite-Read/Save-Cutover über MA-016/017 LocationPort); synchronisierte drei Frontend-Bäume, Modulmanifest auf optional 0.2.0. Der Cleanup-Text entspricht den Betreiberentscheidungen. Soft-Delete/Restore im SQLite-Modus noch deaktiviert, um keinesfalls leere/gelöschte Altlisten anzuschreiben.
- Frühere echte grüne gezielte CI: [45713717791](https://github.com/TheDaimos/gewitterradar/actions/runs/45713717791) `completed/success` auf `9e3c084a` (3 Schema, 7 Saga, 4 Import, JS und 5 LocationPort). Die **neueren V6- und Wizard-Commits müssen auf ihrem finalen SHA erneut nachgewiesen** werden; zuletzt [45714308135](https://github.com/TheDaimos/gewitterradar/actions/runs/45714308135) queued.
- Sicher noch offen: echte UI-Interaktion und VM109, Behebung verbliebener DB-Soft-Delete/Restore-Parität und Konflikt-/completed-Quellflüsse, finale CI auf aktuellem SHA, Dokumentation des endgültigen Auditresultats. Erst dann `MA-020=IMPLEMENTED` bzw. `VERIFIED_DEV` prüfen; aktuell `next_task=MA-020`.

Keine MA-021/022-Vorziehung, kein MA-GATE-P03, keine DEV-/PROD-Installation und keine Veröffentlichung.


## MA-020 – Fortsetzung 25.11.2026: Sicherheits-/Frontend-CI nachweislich grün

- `task_id=MA-020`, `state=IN_PROGRESS`, `next_task=MA-020` (keine vorzeitige Nutzerabnahme). Gegenüber dem vorherigen Übergabestand wurden **echte Codeänderungen und Tests** committed, keine bloße Analyse: Vollständige V6-Backup-/Saga-Verifikation, UI-Wizard, SQLite-Ortelesepfad, Vault-Erinnerungs-Pop-up, Help-Aufruf, Modul-/Frontend-Inventare samt SHA256, Trennung von Altlisten- und neuem DB-Modus. Die bereits oben aufgeführten Fachgrenzen gelten weiterhin.
- `tested_commit=c139534229a3391c61b29a1f7a1f0fce10ec8d71`. Zielgerichtete MA-020-CI [45715353934](https://github.com/TheDaimos/gewitterradar/actions/runs/45715353934): **COMPLETED/SUCCESS** mit 4 Schema-Upgrade-/Journaltests, 8 Finalisierungs- und Restart-/ACL-/Änderungstests, 4 MA-019-Importregressionen, JS-Pop-up-/Wizard-/Spiegel-Kontrakttest und 5 MA-016-LocationPort-Fällen. `commands=python -m compileall -q custom_components/gewitterradar/monitored_areas; python scripts/test-ma-020.py; python scripts/test-ma-020-finalization.py; python scripts/test-ma-019.py; node --check frontend/modules/monitored-areas/index.js; node --check frontend/modules/ui/controls.js; node scripts/test-ma-020-ui.mjs; node scripts/test-ma-016.mjs`.
- Zusätzlicher Frontend-Schutz `MA-004`: [CI 45715259634](https://github.com/TheDaimos/gewitterradar/actions/runs/45715259634) **COMPLETED/SUCCESS** auf `7ad51d9b`; dieser SHA liegt vor dem danach vorgenommenen, CI-only Workflow-Änderungscommit `c1395342`. Innerhalb des MA-004-Laufs wurden inert/default-OFF, Import-/Teardown-Isolation, Soll-Ist-Module, Spiegel-/SHA256-Buildvertrag und bestehende Data-Sources-Checks grün geprüft. Die früheren Fehlversuche wurden durch Freeze-/Timer-Schutz, erneuerte optionale Modulversion, V4.14-Buildinventar und exakte SHA256-Reihenfolge repariert, nicht durch Abschalten der Schutzprüfungen.
- `known_blockers`: Allgemeine Shared-Frontend-/HA-Integrations-CI für `c1395342` beim Abschluss dieses Eintrags noch **QUEUED**, also nicht als PASS zitieren; keine realen HA-/Browser-/VM109-/Mehrbenutzerprüfungen. Legacy-Soft-Delete-/Restore-Funktionsparität ist im SQLite-Modus aktuell ausdrücklich deaktiviert und noch abzustimmen/umzusetzen. Der Wizard lässt nicht vollständig auflösbare Altbestände bewusst unangetastet, keine automatische Entfernung der Listenentität. Solange diese Grenzen offen sind, kein `MA-020=VERIFIED_DEV`, kein `MA-021`, keine Phasenfreigabe.
- `latest_T2_baseline_sha=9c09745ed76b1baaf38e1c2e31b50f61e1dc792c` (P02); `latest_T3_baseline_sha=keine`; `MA-GATE-P03=NOT_RUN`. **Keine alten Local-To-do-Daten auf einer echten Home-Assistant-Instanz gelöscht**, keine Installation/Veröffentlichung; PROD VM101 und Schutzreferenzen unberührt.


## MA-020 – Fortsetzung und verifizierte Sicherheitskorrekturen (26.11.2026)

**Status:** `MA-020=IN_PROGRESS`, `next_task=MA-020`. Ausgangspunkt war der unveränderte Branch-HEAD `6a2d9f42cdf65e3b85ceeeb23b55a4792792cb97`, nachfolgend wurden echte Implementierungs-/Testcommits auf `feature/v4.14-monitored-areas` angelegt. `last_tested_implementation_sha=5f159fcfbd2cfba96c43a3a10b115b8340e3071d`.

**Sicherheitskorrektur (Code):** `finalization.py` verifiziert bei jedem Resume und vor jedem weiteren externen Löschaufruf **auch bereits aus HA entfernte Einträge** gegen das persistierte, vollständige `migration_source_backups`-Original (Digest, erfolgreiches Parsen, Status und UID), sowie gegen den tatsächlich vorhandenen, gegen Actor/Vault-Profil autorisierten SQLite-Standort (Name/Koordinaten). Manipuliertes Original, fehlende Zuordnung oder veränderte Zielwerte blockieren die Fortsetzung mit `migration_pending`; kein weiteres `todo.remove_item` und kein falsches `db_active`. Neue Restart-/Tamper-Tests belegen die Sperre.

**SQLite-Orte entfernen/wiederherstellen (Code):** Additives Schema **V7** mit `archived_profile_links` (nur pro Profil-Link, FK geschützt; alle Locations, Tracker, Shares, History und Fremdprofile bleiben erhalten); autorisierte, request-idempotente Backend-Kommandos `location_archive` und `location_restore` ausschließlich bei verifiziertem `db_active`. `places_list(include_archived=true)` gibt archivierte Orte explizit zurück; bestehende Ortssuche und Schaltflächen lesen, archivieren, stellen wieder her und reaktivieren erkannte Duplikate jetzt über den SQLite-LocationPort, ohne Local-To-do zu beschreiben. Die bei explizitem Link-Transfer/-Entfernen nötige Bereinigung des zugehörigen Archivmarkers ist implementiert. Native Profil-/Receipt-/FK-/Restart-Tests ergänzt; bestehende V4-V6-Schema-Upgrade-Erwartungen auf V7 fortgeschrieben, ohne Safety-Assays zu entfernen.

**Echte Browserprüfung in CI:** `scripts/test-ma-020-reminder-browser.cjs` verwendet Playwright/Chromium mit simuliertem HA-/Vault-Backend, ausdrücklich keine echte HA-Instanz. Testet erste Startanzeige, sechs Löschanleitungsschritte, Checkbox-Speicherung im Settings-Vault, simulierten Anwendungs-Neustart mit unterdrückter Anzeige, manuelles Wiederöffnen mit persistiertem Haken, erneutes Aktivieren der Erinnerung, Schließen ohne Haken und Ausbleiben nach Entfernen der List-Entity. Browser-Job in `.github/workflows/ma-020.yml` aufgenommen.

**Verifizierte GitHub-Actions-Belege:**
- [MA-020 T0/T1 + Chromium 45770559704](https://github.com/TheDaimos/gewitterradar/actions/runs/45770559704) `completed/success` auf **exaktem** `5f159fcfbd2cfba96c43a3a10b115b8340e3071d` (neue negative Saga-Tests, V7-Schema, Archive/Restore, UI/Port, echte Chromium-Interaktion mit Mock-Backend).
- [MA-004 Schutztest 45770559697](https://github.com/TheDaimos/gewitterradar/actions/runs/45770559697) `completed/success` ebenfalls auf `5f159fcf...`.
- [MA-GATE-P02 bestehende Regression 45770404110](https://github.com/TheDaimos/gewitterradar/actions/runs/45770404110) und [MA-015/Vault 45770404111](https://github.com/TheDaimos/gewitterradar/actions/runs/45770404111) jeweils `completed/success` auf dem früheren Implementierungsstand `4802307f...`; dies sind **keine** neuen P03-Gate-Freigaben.
- Allgemeine [HA-Integration 45770559691](https://github.com/TheDaimos/gewitterradar/actions/runs/45770559691) und [Shared-Frontend 45770559714](https://github.com/TheDaimos/gewitterradar/actions/runs/45770559714) auf dem letzten Test-SHA bei dieser Abfrage `queued`. Frühere allgemeine CI-Success-Läufe auf `6a2d9f42...` sind durch den Betreiber dokumentiert, aber **nicht** gleichbedeutend mit dem Test neuer Codeänderungen.

**Weiterhin offen für MA-020-Abnahme:** Keine echte HA-Local-To-do-Service-Interaktion/Browserintegration auf DEV VM109, keine Multi-Client-/Profilabnahme auf realem HA; synthetische Chromium- und CI-HA-Tests ersetzen diesen echten Integrationsnachweis nicht. Der auf die bekannte Local-To-do-Entity-ID begrenzte, fail-closed Migrations-Wizard kann nicht alle veränderten/ungültigen Altbestände automatisch auflösen. `next_task=MA-020`, kein `MA-GATE-P03`, MA-021/022 nicht begonnen, keine Installation/Publikation und keine Löschung echter Altdaten. Das P02-T2-Baseline-Protokoll bleibt unabhängig und geschützt.


## MA-020 – CI-Endreadback und DEV-Abnahmeplan (26.11.2026)

- task_id=MA-020; state=IN_PROGRESS; next_task=MA-020; geprüfter Remote-HEAD vor Dokumentation `a234dc7f199ff7ad8bc04ce86ff081b8d747e376`. Vergleich mit `b7cbb945e414c87909d1895b7b35e29831511c25`: ausschließlich Statusdokumentation und zwei Schema-V7-Erwartungen in scripts/test-ma-gate-p01.py geändert, Anwendungscode und MA-020-Suite identisch.
- P01-Regression: [45771981185](https://github.com/TheDaimos/gewitterradar/actions/runs/45771981185) FAIL wegen veralteter Schema-Erwartung 4 statt 7. Korrektur `a234dc7f199ff7ad8bc04ce86ff081b8d747e376`: [45772577094](https://github.com/TheDaimos/gewitterradar/actions/runs/45772577094) COMPLETED/SUCCESS, 4 Storage-Integrationstests und 6 native OFF-Tests. Kein neues P03-Gate.
- Auf b7cbb945: [MA-020 45771981128](https://github.com/TheDaimos/gewitterradar/actions/runs/45771981128) SUCCESS, 5 Schema + 15 Saga/Archive/Recovery + 4 Importtests (24 Python), JS-Port-/UI-Verträge und Chromium mit simuliertem HA/Vault. Negativtests für geänderte Backup-Daten, geänderte Ziele nach Restart, geänderte Quelle nach Resume-Approval, parallele Bestätigungen, fehlende Adminberechtigung und profilisoliertes Archiv bestanden. [MA-006 45771981237](https://github.com/TheDaimos/gewitterradar/actions/runs/45771981237), [MA-015 45771981268](https://github.com/TheDaimos/gewitterradar/actions/runs/45771981268) (22 Python + 4 native HA), [P02 45771981226](https://github.com/TheDaimos/gewitterradar/actions/runs/45771981226) (15 Python + 4 native HA), [Shared-Frontend 45771981288](https://github.com/TheDaimos/gewitterradar/actions/runs/45771981288), [HA 45771981087](https://github.com/TheDaimos/gewitterradar/actions/runs/45771981087) alle COMPLETED/SUCCESS. Keine Summierung über überlappende Tests.
- Auf a234dc7f: [HA 45772577222](https://github.com/TheDaimos/gewitterradar/actions/runs/45772577222) SUCCESS, 85 native Runtime-Tests; [MA-004 45772577101](https://github.com/TheDaimos/gewitterradar/actions/runs/45772577101) und [Hi-Res 45772577136](https://github.com/TheDaimos/gewitterradar/actions/runs/45772577136) SUCCESS; [Shared-Frontend 45772577157](https://github.com/TheDaimos/gewitterradar/actions/runs/45772577157) in_progress/noch kein Endergebnis. Unveränderter Frontend-Anwendungscode mit erfolgreichem b7cbb945-Lauf.
- commands (CI): python -m compileall -q custom_components/gewitterradar/monitored_areas; python scripts/test-ma-020.py; python scripts/test-ma-020-finalization.py; python scripts/test-ma-019.py; node --check frontend/modules/monitored-areas/index.js; node --check frontend/modules/ui/controls.js; node scripts/test-ma-020-ui.mjs; node scripts/test-ma-016.mjs; node scripts/test-ma-020-reminder-browser.cjs; python scripts/test-ma-gate-p01.py; native pytest und P02/MA-015 gemäß ihren Workflows. Vorhandene tatsächliche CI-Logs gelesen; keine neue lokale Testausführung behauptet.
- Sicherheitsgrenze: HA-To-do und SQLite sind keine gemeinsame ACID-Transaktion. Backup und Readback sichern den getesteten Wiederanlauf; kein absoluter Datenverlust-Ausschluss für beliebige externe Änderungen/Storage-Ausfälle. Echte HA-Dienst-/Mehrbenutzer- und Browserintegration einschließlich tatsächlicher Vault-Persistenz noch nicht abgenommen. Der vorliegende Test-Nachweis nutzt für die Saga und Chromium synthetische Daten/Ports.
- [Reproduzierbarer DEV-Abnahmeplan](MONITORED_AREAS_MA020_DEV_ABNAHME.md): isolierte Testdaten, Stop-Regeln, D01–D12. Kein zugänglicher VM109-Terminal/HA-Live-Connector in dieser Sitzung nachgewiesen; keine Installation autorisiert. Separate Betreiberbereitstellung des geprüften Feature-Kandidaten und isolierte Quelle erforderlich. Keine echte Datenänderung oder automatische Leerung. MA-020 bleibt IN_PROGRESS, MA-GATE-P03 NOT_RUN, MA-021/022 nicht begonnen, kein Release.
- Referenzschutz per GitHub-Readback: v4.14.1-dev 18f505ba8933d1036660133fc5c5ca1b627c596a, v4.13 509daeb7245f42b23e46f72b4d002c42f0d7f56e, main 2b69f7da5a0ad6992bb756296a030ad902b3b2da, WR deploy/dev 850c3542a8b3b181edc5837205bbeb374ed72eab. Nur Dokumentation synchronisieren.
