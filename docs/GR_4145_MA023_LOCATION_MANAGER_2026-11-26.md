# GewitterRadar V4.14.5 DEV – MA-023 Standortverwaltung (sichtbares Frontend)

**Branch:** `feature/v4.14-monitored-areas`  
**Datum:** 26.11.2026  
**Geschützte unmittelbare Rückfallreferenz:** V4.14.4 DEV / HA 0.25.190 / Runtime 4144r1 / 38 von 38 registrierten Modulen, Betreiberabnahme.  
**Ziel:** Sichtbare Weiterentwicklung ohne Ablösung der bisherigen Standortsuche oder ungeprüfte Local-To-do-Migration.

## Tatsächliche Änderungen

1. Neuer eigenständiger Frontend-Dialog `modules/monitored-areas/location-manager.js`, in `frontend/` und im ausgelieferten Spiegel `custom_components/gewitterradar/frontend/`.
2. Im **bestehenden** Standort-Dropdown ergänzte Aktion **„Standorte verwalten · V4.14“**. Die bisherige Suche nach weltweiten Orten, Koordinaten, Personen/Zonen und der bisherige gespeicherte-Orte-Workflow bleiben erhalten.
3. Der Dialog bietet Namen/Koordinaten, Textfilter, aktive und archivierte Orte, Detailansicht, Aktualisierung und **reine Kamerapositionierung auf der Karte**. Letztere ruft den Referenz-/Blitzortungstracker **nicht** auf.
4. Bestehende `location-port.js`-Adapter und `controls.js`-Backendanbindung werden wiederverwendet: Im **serverbestätigten** `db_active`-Modus lassen sich Orte umbenennen sowie profilbezogen archivieren und wiederherstellen (Revision/UUID/HA-Benutzer und Vault-Profil werden backendseitig geprüft). Archivierung ist reversibel. In `legacy` bleibt Local To-do maßgeblich; die bereits vorhandenen Archivierungsaktionen werden beibehalten, Umbenennen wird dort nicht angeboten.
5. Die Frontendverwaltung aktiviert weder das optionale Backend noch eine Migration. `monitored_areas_enabled` bleibt ausdrücklich Opt-in. Eine nicht abgeschlossene Migration löst keinen Wechsel zur SQLite-Quelle aus. Fehlende Backendantworten oder Profil-/Benutzerwechsel führen zum Abbruch statt zu einem nicht zuordenbaren Schreibzugriff.
6. Das neue Fenster funktioniert auch aus der Karten-Vollbildansicht; Inhalte werden über `textContent` statt ungeprüftem HTML erzeugt, Fehlermeldungen bleiben allgemein.
7. DEV-Marker konsistent: **GR 4.14.5 / HA 0.25.191 / Runtime 4145r1 / Modulset E414-5A1 / DRA BUILD_VERSION 4.14.5**. Erwartete Modulanzahl weiterhin **38**, da der Dialog zum schon registrierten optionalen MA-Modul gehört.

## Grenzen dieser Stufe

Die neue Detailansicht zeigt **nur Basisdaten** (Name, Koordinaten, ggf. Revision). Das vollständige **Havanna-Detailfenster (MA-021)** mit Monitoring-/Historienansichten und das profilübergreifende Berechtigungsmenü **MA-022** sind damit **nicht** umgesetzt. Kein automatischer Migrationsstart, keine neue Monitoring-Engine, kein neuer Wetter-Provider. Bei nicht aktivierter MA-Runtime sehen Nutzer die bisherige Local-To-do-Liste und einen expliziten Status, nicht eine vorgetäuschte SQLite-Aktivierung.

## Verifikation und Abnahme

- `tests/test_ma_location_manager.mjs`: tatsächliche Ausführung des reinen Standort-Modells für `legacy`, `migration_pending`, `db_active`, Dubletten/Koordinaten, plus statische Schnittstellenprüfungen.
- `tests/test_ma_frontend_module_registration.py`: Frontend-Spiegel, Einbindung im Dropdown, Opt-in-Schutz und synchronisierte DRA-/Frontend-/HA-Version.
- Öffentliche CI `.github/workflows/ma-frontend-registration.yml` führt beide Tests und Node-Syntaxchecks aus. Die **Ergebnisse müssen pro endgültigem HEAD-Commit geprüft** werden; ein Push oder früherer grüner Lauf ersetzt das nicht.
- DRA: auf DEV VM109 in `TheDaimos/gewitterradar` den Branch `feature/v4.14-monitored-areas` laden; V4.14.5 / 0.25.191 anhand der Vorschau prüfen. Kein PROD-Eingriff.
- Betreiber: Standort-Dropdown öffnen, **Standorte verwalten · V4.14**, bestehende Orte filtern und Details prüfen, Kameraaktion ohne Trackerwechsel prüfen. Wenn MA nicht aktiv: Local-To-do-Daten unangetastet; keine SQLite-Bearbeitung. Bei explizit aktiviertem und fertig migriertem MA-Profil: Umbenennen/Archivieren/Wiederherstellen und Profilwechsel-Schutz testen.
- Regression: 38/38; Eye Hub, Legend Hub, Mond, WR OPERA/DWD/NASA, Blitzortung und bestehende Standortsuche unverändert.

Keine FINAL-Freigabe und keine VM109-Realabnahme ohne Betreiberbestätigung.
