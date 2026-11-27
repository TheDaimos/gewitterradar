# GewitterRadar V4.14.11 DEV – MA-020 geschützte Finalisierung und SQLite-Cutover

## Reale DEV-Abnahme (VM109, 27.11.2026)

Betreiber bestätigt in V4.14.10: SQLite **43 Orte**, davon **39 aktiv und 4 archiviert**, inklusive drei getrennt erhaltener gleichnamiger „afrika“-Archive. Die serverseitige Finalisierungsprüfung bestätigte 43 aus Local To-do übernommene Datensätze. Die ursprüngliche Local-To-do-Liste ist absichtlich noch vorhanden; **kein Cutover erfolgt**.

## Implementierte Ergänzungen

1. **Explizite, serverseitig verifizierte Archiv-/Aktivzählung**: Die bestehende Methode `Finalizer.preview` prüft bereits HA-Quelle, SQLite-Ziel, Importquittungen, Profileigentum und Administratorberechtigung. Sie gibt jetzt zusätzlich `active_count`, `archived_count`, `source_and_sqlite_verified`, `legacy_list_preserved_until_commit`, `requires_admin`, `explicit_confirmation_required` zurück.
2. **Fail-closed-Bestätigung**: Die UI zeigt die verifizierten Anzahlen und verweigert die Freigabe zur Leerung, falls die neuen Prüffelder fehlen, die Anzahl inkonsistent ist oder eine Administrator-/Bestätigungsbedingung nicht nachgewiesen wurde. Eine gültige Wiederaufnahme bei null verbleibenden Quelldatensätzen bleibt möglich.
3. **Android-/HTTP-Sicherheitskorrektur im SQLite-Regelbetrieb**: Fünf Stellen für `location_create`, `location_update`, `location_archive` und `location_restore` verwenden den bereits getesteten kryptografischen UUID-v4-Fallback statt `crypto.randomUUID()`, das in nicht sicheren Browserkontexten fehlen kann. Keine schwachen Zufallszahlen.
4. Bestehende Schutzlogik unverändert: Journal und Backups VOR HA-To-do-Entfernung, je Eintrag HA-Rücklesen, Revisionen/Archive geprüft, kein Automatik-Cutover, Vault-/Admin-Freigabe, kurze Approval-TTL, keine Löschung der To-do-Liste selbst.
5. Tests ergänzen Vorschau-Erhalt des gesamten Quellbestands sowie archivierte Zähler und UUID-Kompatibilität. Regressionstest prüft vollständigen Cutover, Wiederaufnahme, Dubletten, Änderungs- und Berechtigungsfehler.

## Geprüfter DEV-Auslieferungspfad

- Version **V4.14.11 DEV**, HA **0.25.197**, Runtime **41411r1**, Modulset **E414-11A1**.
- `.github/workflows/ma-v41411-dev-build-sync.yml` regeneriert beide Frontend-Spiegel und Prüfsummen.
- `.github/workflows/ma-v9-consolidated-regression.yml` prüft SQLite, API, Frontend, Source-Mirror und erstellt nur bei Erfolg ein SHA-verifiziertes DEV-Installationspaket.
- Keine Änderungen an PROD VM101, WR, OPERA, NASA, DWD, Blitzortung, Legenden oder Final-Releases.

## Nächste Betreiberabnahme – **nicht** automatisch ausführen

1. Auf VM109 V4.14.11 installieren, HA 0.25.197 und Modulrevision prüfen. Browser neu laden.
2. Über **Standorte verwalten → SQLite-Übernahme prüfen → SQLite-Daten ansehen** nochmals **43 / 39 / 4** bestätigen. **Nicht erneut importieren.**
3. **Finalisierung prüfen**: Erwartet **43 Einträge / 39 aktiv / 4 archiviert**, eindeutige Adminpflicht und fortbestehende Local-To-do-Liste.
4. Die Löschfreigabe und den Button **„Jetzt Einträge leeren“** nur nach **eigenständiger, ausdrücklicher Betreiberentscheidung** ausführen. Bis dahin bleibt MA-020 absichtlich `migration_pending`.
5. Falls Betreiber später bewusst freigibt, kontrollierter echter HA-Test: `db_active` aus serverseitigem Status, 43 SQLite-Orte, 39 aktiv/4 archiviert, Teilstringsuche, Umbenennen, Archivieren, Wiederherstellen. To-do-Liste als Entität soll erhalten bleiben; entfernte Einzelposten sind nur über das SQLite-Backup/Finalisierungsjournal nachvollziehbar.
6. Bei jeder Abweichung **keine weitere manuelle Leerung**. Log und Screenshot sichern; die autorisierte Saga ist wiederaufnahmesicher.

**Wichtig:** Das Prüfen und Bauen der Software ist keine Betreiberfreigabe zur Entfernung seiner 43 Local-To-do-Einträge. Es wurde keine reale Datenlöschung ausgelöst.
