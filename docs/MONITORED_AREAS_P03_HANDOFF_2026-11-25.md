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
