# GewitterRadar V4.14.15 DEV — Standortverwaltung: getrennte Ansichten

Datum: 27.11.2026 · Branch: `feature/v4.14-monitored-areas`
Status: **Implementiert / DEV-Build synchronisiert / Betreiber-Sichttest offen**.

## Abgenommene Entwurfsrichtung

Die ursprünglich langen Local-To-do- und SQLite-Abschnitte werden im MA-020-Migrationsdialog über zwei klar beschriftete, gegenseitig ausschließende Ansichten bedient:

- **Local To-do** mit vorhandenen Importentscheidungen; weiterhin maßgeblich in `migration_pending`.
- **SQL-Daten (lesend)** mit unveränderter profilgebundener WebSocket-Seitenabfrage und schreibgeschützter Darstellung.
- Ein gemeinsamer Textfilter und eine dynamische Leiste `Alle` / ausschließlich existierende Anfangsbuchstaben gelten jeweils nur für die sichtbare Datenquelle. Filter und Ansichtswechsel verändern weder Importentscheidungen noch SQLite oder Local To-do.
- Umschalten blendet die jeweils andere Liste aus, statt beide übereinander anzuzeigen. Der Header mit Umschaltern, Suchfeld und Buchstaben bleibt außerhalb der Scrollliste; der Footer bleibt fixiert.
- Die Refresh-Schaltfläche wird passend zur ausgewählten Quelle beschriftet. Import- und Finalisierungsaktionen werden nur in der To-do-Ansicht angezeigt und behalten ihre bisherigen serverseitigen Sicherheitsprüfungen, die explizite Administratorbestätigung sowie das unveränderte To-do-Leerungsprotokoll.

Die separate Standortverwaltung zeigt **Gespeicherte Orte** und **Archivierte Orte** jeweils als eigene auf-/zuklappbare Sektion mit Zähler. Die aufgelaufene Aufklappauswahl wird über reine UI-Neuzeichnungen bewahrt. Der Ortssuche-Dropdown-Eintrag **Standorte verwalten · V4.14** steht unmittelbar nach **Ort suchen …** und vor den gespeicherten Orten.

## Codeumfang und Schutz

Verändert: `frontend/modules/monitored-areas/migration-wizard.js`, `frontend/modules/monitored-areas/location-manager.js`, `frontend/modules/ui/controls.js`, zwei UI-Vertragstests, versionsbezogene Metadaten und die separate Build-Pipeline. Die bestehende Migration-/Finalisierungssaga und sämtliche DB-Schemas blieben unverändert. Kein ungefragtes Kopieren, Löschen oder automatisches Finalisieren.

Produktversion **4.14.15 DEV**, Runtime `41415r1`, Modulset `E414-15A1`, HA-Integration `0.25.201`, DRA-`BUILD_VERSION = "4.14.15"`. Die ältere Version 4.14.14 ist nicht überschrieben; public FINAL und VM101 unverändert. Der Auto-Build läuft auf dem isolierten Feature-Branch, nicht über einen öffentlichen DEV-Release.

## Durchgeführte Nachweise

- JavaScript-Syntax aller vier betroffenen Quellmodule separat geprüft: **PASS (4/4)**, mit normalisierter ES-Modul-Importsyntax für die isolierte Parserprobe.
- Neue UI-Verträge `tests/test_ma_tabbed_views.mjs`: Dropdownplatzierung, getrennte Ansichten, dynamischer Buchstabenfilter, Importentscheidungen, Accordion und read-only-Grenze. Isoliert mit tatsächlichen GitHub-Quellen und Mock-Dateizugriff ausgeführt: **PASS (22 Assertions)**.
- Existierenden `tests/test_ma_sqlite_preview.mjs` an neuen Tab-Text und das gemeinsame SQL-Filtermodell angepasst; im GitHub-Actions-Build enthalten.
- Öffentliche CI-Buildpipeline `.github/workflows/ma-v41415-dev-build-sync.yml` erstellt den kanonischen Frontend-Build, führt MA-Frontend-/Migration-/SQLite-/Regressionsprüfungen aus und committed nur Delivery-Artefakte nach bestandenem Lauf. Die erfolgreich committen Spiegel belegen diesen Buildpfad; eine individuelle Workflow-Run-ID konnte nicht ausgelesen werden.
- Nach CI-Push GitHub-Dateireadback: **10/10** geprüfte Quellen (Version, Loader, Panel, Runtime-Manifest, Modulmanifest, MA-Index/Wizard/Manager, Controls und Vault) sind jeweils byte-identisch in `frontend`, `custom_components/gewitterradar/frontend` und `dashboard/dist`. `SHA256SUMS_FRONTEND.txt` wurde im Delivery-Commit regeneriert.
- Keine aktive Home-Assistant-/Android-/Browser-Sichtabnahme und **keine DRA-Updateerkennung auf VM109** in dieser Sitzung bestätigt.

## Betreiberprüfung auf DEV VM109

Nach tatsächlicher Installation über DRA: Ortssuche öffnen, Standortverwaltung direkt unter `Ort suchen …` wählen, beide Gruppen auf- und zuklappen; im Migrationsassistenten To-do/SQL umschalten, Buchstaben und Suchfeld testen, einen Eintrag in To-do auswählen, zwischen den Ansichten wechseln und seine Auswahl erneut überprüfen. Dabei **weder „Auswahl importieren“ noch „Jetzt Einträge leeren“ betätigen**. Die 43 vorhandenen Einträge bleiben unangetastet.

**MA-020 bleibt bis zur gesonderten, sicheren Betreiberabnahme in Arbeit.**
