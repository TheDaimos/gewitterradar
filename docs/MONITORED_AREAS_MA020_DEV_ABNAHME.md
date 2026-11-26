# MA-020 – kontrollierte DEV-Abnahme VM109

Status: **NOT_RUN / Betreiberfreigabe erforderlich**. Kein Installationsauftrag. Kandidat: a234dc7f199ff7ad8bc04ce86ff081b8d747e376; letzter Anwendungscode b7cbb945e414c87909d1895b7b35e29831511c25. Keine Prüfung auf PROD VM101.

## Voraussetzungen und Stop-Regeln

- Betreiber bestätigt VM109, vollständige Sicherung und Rückfallmöglichkeit, gesonderte Bereitstellung des exakt geprüften Feature-Kandidaten (nicht deploy/dev), anschließend vollständiger HA-Neustart. In diesem Auftrag weder DRA-Paket noch Installation ausgelöst. Der geschützte Tag v4.14.1-dev bleibt unangetastet.
- Isolierte, zurücksetzbare HA-Testinstanz bzw. ausschließlich eine zuvor nachweislich nicht belegte Local-To-do-Liste mit Entity-ID todo.gewitterradar_orte und Name GewitterRadar Orte. **Existiert die Liste oder enthält sie echte Daten: STOP, keine Umbenennung, Leerung oder Übernahme.** Stattdessen separates HA-Testsystem mit gleichem Build verwenden. Keine echten Vault-Profile, Tracker oder gespeicherten Orte ändern.
- Zwei eigens erstellte HA-Testkonten (Admin A, Nicht-Admin B), A mit zwei Test-Vault-Profilen A1/A2, B mit B1. Feature explizit einschalten, nur synthetische Einträge über vorhandene Ortssuche erzeugen. Nur eine Testinstanz je Durchlauf; bei Varianten Snapshot der isolierten Testinstanz wiederherstellen, nicht Produktionsdaten.
- Vor jedem destruktiven Schritt Quell-UIDs, Rohdaten, Zielort/Koordinaten, Anzahl und Benutzerprofil als anonymisierte Nachweise erfassen; bei abweichendem Stand oder unsicherer Identität sofort abbrechen. Keine private Daten/Token in GitHub.

## Matrix – alle Zeilen vorab NOT_RUN

| ID | Handlung auf isoliertem DEV | Erwartung |
|---|---|---|
| D01 | OFF starten, vorhandene Karte, Referenztracker, Eye/Legend/Mond prüfen | Keine MA-Datenbank/aktive MA-API bei frischer OFF-Instanz; Referenznavigation unverändert |
| D02 | ON, synthetische Orte Alpha/Beta, gleicher Name bzw. gleiche Koordinaten, zusätzlich ungültigen Eintrag; Wizard Desktop und Mobile öffnen | Vorschau korrekt, Konflikte explizit, ungültige/übersprungene Einträge verhindern Leerung; kein Erfolg |
| D03 | Ungültigen synthetischen Eintrag kontrolliert korrigieren, vorhandenen SQLite-Ort mit identischen Zielwerten explizit zuordnen, übrige neu importieren | Vollständiger Readback, To-do unverändert, migration_pending |
| D04 | Nicht-Admin B, falsches Profil, falsche/abgelaufene Nonce; Vorschau A1, danach synthetischen Eintrag ändern | Ablehnung ohne weitere Entfernung; keine Fremddaten |
| D05 | Zwei Admin-Browser gleichzeitig bestätigen (nur eigene Testdaten) | Einmalige Eintragsentfernung je UID; kein zweiter Cutover |
| D06 | Kontrollierter Abbruch nach erstem Entfernen vor Bestätigung des Readbacks (nur isoliertes Testsystem mit gezieltem Fault-Injection-Hook; kein erzwungener Crash auf gemeinsam genutzter VM) | Originalbackup und Ziel vorhanden; migration_pending; nach Neustart erneute Preview/Bestätigung, keine doppelte Löschung |
| D07 | Variante D06, Original/SQL-Ziel oder verbleibende Quelle gezielt im isolierten Testfixture verändern; keine direkte Manipulation echter DB | Fail-closed, keine weitere Löschung, kein Erfolg; unverändertes Fixture separat vollständig abschließen |
| D08 | Erfolgreich bestätigte vollständige Leerung | To-do-Liste existiert leer; alle Zielorte geprüft; db_active; SQLite-Ortssuche, keine Dual-Writes |
| D09 | Ort speichern, auswählen/Kartenflug, archivieren, wiederherstellen, Neustart; zweites Profil kontrollieren | Standort bleibt kanonisch erhalten, Archivierung nur eigener Link, keine Änderung Referenztracker durch reine Kamerafunktion |
| D10 | Pop-up beim Start, sechs Schritte, exakter Listenname; Checkbox aktivieren und Verstanden, neu laden und HA-Neustart; manuell Hilfe & Hinweise öffnen, Haken entfernen, neu starten | Vault-Persistenz pro Profil, Startunterdrückung, manueller Zustand, erneute Anzeige, keine Auswirkungen auf andere Pop-ups |
| D11 | Nur nach D08 und nur eindeutig synthetische leere Liste manuell in Local To-do entfernen; erneut starten | Keine automatische Erinnerung; DB-Orte weiterhin verfügbar; keine automatisierte Entitätslöschung |
| D12 | Desktop/Mobile Kartenbedienung, Eye, Legend, Moon, bisherige Navigation und WetterRouter-Consumer-Schutz | Keine Regression; dokumentierte Geräte-/Viewport- und Browser-Version |

D06/D07 erfordern eine kontrollierte Fehler-Injektionsumgebung; vorhandene CI simuliert diese Risiken, ersetzt aber keinen tatsächlichen HA-Diensttest. Ohne sichere Instrumentierung als BLOCKED markieren. Jeder Schritt: Datum, Build/SHA, Umgebung, anonymisierte Belege, PASS/FAIL/BLOCKED, keine privaten Inhalte. Bei FAIL stoppen, Snapshot erhalten, Ursache korrigieren, betroffene CI und Realtests wiederholen. Kein MA-GATE-P03, MA-021/022 oder Release durch diese Abnahme.

