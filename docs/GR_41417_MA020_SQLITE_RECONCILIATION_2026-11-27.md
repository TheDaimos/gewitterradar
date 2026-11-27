# GewitterRadar V4.14.17 DEV — MA-020: vorhandene SQLite-Orte sicher zuordnen

Stand: 27. November 2026  
Branch: `feature/v4.14-monitored-areas`  
Status: **Entwickelt; vollständig profilgebundene Backend-Abgleichslogik ergänzt; Betreiber-SQLite/To-do-Realtest auf DEV VM109 offen. MA-020 nicht finalisiert.**

## Anlass und Betreiberbefund

Der Betreiber hatte in `Local To-do` bereits 43 gültige Ortsdatensätze (39 aktiv, vier archiviert) und sah gleichzeitig im SQLite-Viewer 43 Datensätze mit derselben Verteilung. Dennoch zeigte der Importassistent bei zahlreichen Orten `Manuell prüfen – vorerst überspringen`. Das ist ein korrektes vorsichtiges Standardverhalten für Kollisionen; **die reine Anzahl beweist weder Datensatzgleichheit noch einen gültigen Finalisierungsnachweis**. Die Finalisierung darf nicht allein aufgrund identischer Zähler freigegeben werden. Bestehende `migration_commit`-Nachweise können fehlen, auch wenn bereits passende Datensätze in SQLite vorliegen.

## Durchgeführte Entwicklung

### MA-020-A: Bestandsabgleich als verifizierbare Vorschau

In `custom_components/gewitterradar/monitored_areas/migration.py`:

- Der reine Lesevorgang ermittelt zusätzlich den **Archivstatus des profilgebundenen SQLite-Links**. Der Status gehört dem Link und wird nicht als globaler Standortstatus interpretiert.
- `exact_matches` enthält nur Standorte mit **identischem Namen, lat/lon mit strengem Vergleich (je <=1e-9) und identischem Archivstatus**. Bloße Koordinaten- oder Namensüberschneidungen sind keine sichere Bestandsübernahme.
- `suggested_existing_id` wird nur gesetzt, wenn es **genau einen Treffer** und weder einen Quell-Duplikatkonflikt noch eine konkurrierende zweite To-do-Zuordnung zu demselben Ziel gibt.
- `safe_existing_suggestions` zählt ausschließlich diese eindeutigen Vorschläge. Diese Felder sind eine **unverbindliche, read-only Empfehlung**, keine Schreibfreigabe.
- Quelle, Benutzer und Vault-Profil werden weiterhin vom authentifizierten Home-Assistant-Backend geprüft; der bestehende `preview_id` verknüpft unverändert Quell- und SQLite-Snapshot. Die Transaktionsprüfung bleibt verbindlich.

### MA-020-B: Geschützte Import-Transaktion

In `custom_components/gewitterradar/monitored_areas/api.py`:

- `use_existing` wird **innerhalb der SQLite-Transaktion** unmittelbar vor dem Zuordnen erneut gegen Name, Koordinaten und aktuellen Archivstatus verifiziert.
- Eine falsche, manipulierte oder nachträglich veränderte Ziel-ID führt zu `migration_existing_mismatch`. Kein Import-Receipt und keine Seiteneffekte bei fehlgeschlagenen Transaktionen.
- Derselbe SQLite-Ort darf nicht von zwei Quell-UIDs als Ziel verwendet werden — auch nicht mit einer Mischung aus `use_existing` und `replace`. Der gesamte Schreibvorgang wird bei `migration_duplicate_existing_target` zurückgerollt.
- Der explizite Operatorweg `create`/`replace` bleibt verfügbar, kann jedoch **nicht** als ungeprüfter `use_existing`-Match ausgegeben werden.
- Die bestehende Idempotenz, Profilberechtigung, Restart-Saga und verifizierte Finalisierung bleiben unangetastet.

### MA-020-C: Explizites Vormerken im Frontend

In `frontend/modules/monitored-areas/migration-wizard.js`:

- Neue read-only Bestandsanalyse zeigt die Zahl der **eindeutig übereinstimmenden Orte**.
- **`Eindeutige Bestandsorte zuordnen`** wird nur bei vorhandenen sicheren Vorschlägen angezeigt. Dieser Button setzt **nur Dropdown-Entscheidungen im Browser**, überträgt keinen Datensatz und ruft weder einen Import noch die Finalisierung auf.
- Alle mehrdeutigen Quellorte, archivierten Dubletten oder abweichenden Archivzustände bleiben manuell zu lösen. Die Dropdown-Einträge zeigen einen kurzen Orts-ID-Anteil zum Unterscheiden mehrerer gleichnamiger SQLite-Orte.
- **`Auswahl importieren` bleibt deaktiviert**, solange ein Quellort auf `Überspringen` steht; der Status nennt die Zahl der noch ungelösten Einträge. Die endgültige Übernahme benötigt weiterhin den eigenen, bewussten Klick auf `Auswahl importieren`.
- Nach erfolgreicher Übernahme bleibt `Local To-do` vollständig bestehen. Die separate Administrator- und Quellen/SQLite-Verifikationsprüfung vor `Jetzt Einträge leeren` wurde weder umgangen noch ausgelöst.
- Die V4.14.16-Sichtgestaltung einschließlich Goldrahmen/Sticky-Header/SQL-Read-only-Tab bleibt erhalten; ein weiterer optischer Feinschliff erfolgt bewusst erst in der späteren Hot-Fix-Runde.

### MA-020-D: Neu hinzugefügte Regressionen

In `scripts/test-ma-020-finalization.py`:

1. Bereits vorhandene SQLite-Orte lassen sich ohne Neuanlage zuordnen und für einen späteren **read-only Finalisierungsvorcheck** verifizieren.
2. Archivstatus-Abweichung führt zu **keiner** Empfehlung und wird auch bei gefälschtem `use_existing` verweigert.
3. Doppelte To-do-UID-Zuordnungen zu ein und demselben SQLite-Ort werden zurückgerollt.
4. Gemischtes Wiederverwenden und Ersetzen desselben Ziels ist ebenfalls unzulässig.
5. Manipulierte Ziel-IDs werden nicht akzeptiert.
6. Drei archivierte Datensätze gleichen Namens und gleicher Koordinaten erhalten **keinen automatischen Vorschlag**, da eine manuelle eindeutige UID-Zuordnung nötig ist.

`tests/test_ma_existing_reconcile.mjs` prüft zusätzlich die Frontend-Verträge auf explizite Zustimmung, Ausschluss von Backend-Aufrufen durch die bloße Vorschlagsaktion, vollständige manuelle Entscheidungen sowie die wichtigsten Backend-Sicherheitsbedingungen.

## Version und Delivery

- **Produkt:** `V4.14.17 DEV` — `V4.14.17-DEV-2026-11-27`.
- **Runtime:** `41417r1`, **Modulset:** `E414-17A1`, **HA-Integration:** `0.25.203`, **DRA-Build:** `4.14.17`.
- Ausschließlich der isolierte Feature-Branch. Keine öffentliche DEV-Veröffentlichung, keine Änderungen an PROD VM101 oder WeatherRouter.
- Build/Regression: `.github/workflows/ma-v41417-dev-build-sync.yml` führt den bestehenden MA-020-Saga-Test einschließlich neuer Fälle, die UI-, SQLite-, Modulregistrierungs- und MA-Regressionstests sowie den regulären Frontend-Build aus und aktualisiert nach Erfolg die beiden Paketspiegel und SHA256-Dateien.
- Verifiziert vor finalem Build-Readback: ECMAScript-UI- und Python-Testquellen wurden direkt im Repository geprüft; der neue JS-Reuse-Vertrag wurde mit den echten Repo-Inhalten isoliert ausgeführt (**21/21 PASS**). Keine Live-Daten wurden verändert.
- Nachtrag: Der CI-Delivery-Commit muss mit GitHub-SHA-Abgleich und den Testresultaten bestätigt werden; eine bloße Versionsnummer gilt nicht als ausreichender Nachweis.

## Betreiberprüfung auf DEV VM109 — vor jeder Finalisierung

1. DEV-Version über DRA installieren und die Anzeige `V4.14.17 DEV` sowie Integration `0.25.203` bestätigen.
2. In `Standorte aus Local To-do übernehmen` **Local To-do** öffnen, den **Bestandsabgleich** lesen; die in der Ansicht gemeldete Zahl sicherer Vorschläge dokumentieren. Eine Zahl 43 darf ausdrücklich **nicht vorausgesetzt** werden, insbesondere wegen der drei gleichnamigen archivierten Afrika-Orte.
3. **Eindeutige Bestandsorte zuordnen** drücken und die Dropdowns prüfen. Dabei werden nur Browser-Entscheidungen vorgemerkt. Die ungeklärten Orte einzeln und bewusst behandeln; für gleichnamige Einträge ggf. Kurz-ID und Archivstatus prüfen.
4. Mit der SQL-Read-only-Ansicht die 39 aktiven und vier archivierten Einträge vergleichen; bei Unstimmigkeiten **nicht importieren**.
5. **Für die erste Betreiberabnahme weder `Auswahl importieren` noch `Finalisierung prüfen` oder `Jetzt Einträge leeren` klicken.** Erst nach dokumentierter Quell-/Ziel-UID-Prüfung gesondert ausdrücklich freigeben. Falls das bereits existierende Import-Receipt ausreicht, wird ein zweiter Commit unnötig.

**Status:** MA-020 bleibt IN_PROGRESS bis bestätigtem VM109-Test, vollständiger Zuordnung aller relevanten Quell-UIDs und bewusster Betreiberfreigabe. Danach MA-021/MA-022 in der zuvor beschlossenen Reihenfolge.
