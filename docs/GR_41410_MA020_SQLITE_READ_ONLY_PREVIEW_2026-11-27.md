# GewitterRadar V4.14.10 DEV – MA-020 SQLite-Kontrollansicht

## Betreiberbeobachtung und Ziel

Am 27.11.2026 bestätigte VM109 im Migrationsassistenten nach dem Import **„SQLite und Quelle verifiziert: 43 Einträge“**, darunter vier archivierte To-do-Standorte. Die abschließende Lösch-Checkbox blieb bewusst deaktiviert. Ziel ist eine **unabhängige, profilgebundene Leseansicht auf SQLite**, noch bevor der Legacy-Speicher geleert bzw. `db_active` gesetzt wird.

## Implementierung

- Im vorhandenen Dialog **„Standorte aus Local To-do übernehmen“** steht nun **„SQLite-Daten ansehen (nur lesen)“**.
- Die bereits bestehende WebSocket-API `gewitterradar/monitored_areas/places_list` wird mit `include_archived:true` und `limit:100` abgefragt und über `next_cursor` iteriert (maximal 2.000 Zeilen, fail closed).
- API verifiziert HA-Benutzer und Vault-Profil für jeden Leseaufruf. Auch bei `migration_pending` darf die SQLite-Kandidatenliste gelesen werden; Local To-do bleibt bis zur gesonderten Bestätigung maßgeblich.
- UI zeigt **Gesamt / aktive / archivierte** Einträge, eingeklappte Gruppen und lokale Teilstring-Suche. Jede Zeile enthält Ortsname, Koordinaten, `location_origin` und Revision. Alle fremden Texte ausschließlich über `textContent`.
- Fehlende oder beschädigte API-Daten, Doppel-IDs, ungültige Koordinaten, fehlerhafte Archive-Flags und inkonsistente Cursor erzeugen eine sichtbare Fehlermeldung. Weder Teilantworten noch stilles Überspringen gelten als erfolgreiche vollständige Vorschau.
- Die Quellen- und SQLite-Anzahlen werden unverbindlich angezeigt und gegebenenfalls verglichen. **Gleiche Anzahl ersetzt keine inhaltliche Finalisierungsprüfung.** Die serverseitige `migration_finalize_preview` bleibt die Autorität.
- Nach Änderungen an Quellvorschau oder erfolgreichem Import wird die bisherige SQLite-Kontrollansicht ausgeblendet und muss erneut geladen werden.

## Sicherheitsgrenzen

- Der neue Knopf setzt **keine** `request_id`, ruft **keine** Mutation auf und verlangt **keine** Freigabe zur To-do-Löschung.
- `migration_finalize_commit`, `migration_commit`, `todo.remove_item`, HA-Referenzstandort, Radar/WR-Provider und die aktive Standortanzeige werden nicht geändert.
- **MA-020 bleibt offen** bis kontrollierter echter Finalisierungstest und expliziter Betreiberfreigabe. Kein automatischer Cutover.

## DEV-Version und Tests

- GewitterRadar **V4.14.10 DEV**, HA-Integration **0.25.196**, Runtime **41410r1**, Modulset **E414-10A1**.
- `tests/test_ma_sqlite_preview.mjs`: gruppieren, Archiv-Status, malformed input, keine Veränderungen, read-only WebSocket und DOM-Kontrakt.
- Automatischer Frontend-/Mirror-Build: `.github/workflows/ma-v41410-dev-build-sync.yml`.
- Konsolidiertes SQLite-/API-/Frontend-Prüfgate und DEV-Paket: `.github/workflows/ma-v9-consolidated-regression.yml`.

## DEV-Realabnahme VM109

1. V4.14.10 DEV installieren, Start und Integration 0.25.196 prüfen.
2. SQLite-Option aktiviert lassen, Local-To-do-Liste nicht verändern.
3. **Standorte verwalten → SQLite-Übernahme prüfen → SQLite-Daten ansehen (nur lesen)**.
4. Erwartet: **43 SQLite-Orte, 39 aktiv, 4 archiviert**, sofern der reale Datenbestand unverändert geblieben ist.
5. Filter `burg` sollte **Hamburg** finden; Gruppen und Koordinaten ansehen.
6. **„Jetzt Einträge leeren“ und die Finalisierungscheckbox unverändert lassen.** Ggf. Fehlermeldung/Screenshot teilen; nicht erneut 43 neue Orte importieren.
