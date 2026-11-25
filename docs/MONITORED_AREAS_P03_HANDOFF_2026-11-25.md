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
