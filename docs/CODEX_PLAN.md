# Codex-Arbeitsplan

Stand: **12.09.2026**

Der frühere V4.05/V4.06-Kandidatenplan vom 08.09.2026 ist abgeschlossen und darf nicht mehr als aktueller Arbeitsauftrag verwendet werden.

## Aktueller Ausgangspunkt

- V4.06 ist veröffentlicht und eingefroren.
- Integration und Dashboard sind zwei Auslieferungsformen desselben kanonischen Gewitterradar-Produkts.
- Neue Produktentwicklung beginnt auf V4.07; V4.06 wird nicht für neue Funktionen wieder geöffnet.
- `docs/ROADMAP.md` ist die kanonische Zukunfts-/Backlog-Liste.
- V4.07 ist die nächste Linie: **Weltweite Orts-Suche**.
- Der Geocoding-Kern existiert im Dev-Toolkit als eigener Draft-Kandidat.
- Der dynamische Gewitterradar-Standortadapter ist als nativer `device_tracker` plus Dashboard-Template-Tracker im V4.07-Testbranch umgesetzt.
- Die Blitzortung-Kopplung ist bis zu einer möglichen Upstream-Erweiterung bewusst halbautomatisch: einmalige Benutzerkonfiguration auf den Gewitterradar-Tracker, danach automatische Koordinatenwechsel.

## Verbindliche Codex-Arbeitsweise

Codex-Aufträge werden bewusst klein und überprüfbar gehalten:

1. genau ein logisches Ziel pro Auftrag;
2. erlaubte Dateien/Bereiche benennen, wenn der Auftrag nicht ohnehin eindeutig lokal ist;
3. geschützte Baselines/Regressionen ausdrücklich nennen, wenn sie betroffen sein könnten;
4. klare Akzeptanzkriterien festlegen;
5. keine ungefragten Refactorings oder Nebenbaustellen;
6. bei wachsendem Umfang stoppen und in einen neuen Auftrag aufteilen;
7. nach jedem logischen Schritt Diff und passende Tests prüfen, bevor der nächste Auftrag folgt.

Ein Roadmap-/Backlog-Eintrag ist **kein Codex-Auftrag**. Ideen werden erst nach ausdrücklicher Freigabe geplant bzw. umgesetzt.

## Nächster Entwicklungsblock

Die grundlegende Machbarkeit für Geocoding und den Home-Assistant-Standortadapter ist ausreichend bestätigt, um den nächsten bounded Block zu starten.

### Nächster Auftrag: V4.07 Standort-Dropdown / Suchdialog anbinden

Ziel:

- den bereits festgelegten Suchfluss in einen **stabilen, kontrollierten gemeinsamen Frontend-Pfad** integrieren;
- Reihenfolge im Standort-Dropdown: Personen → Zonen → `Ort suchen …` → gespeicherte Orte;
- Ort + optionales Land, lokale Länder-Auto-Vervollständigung, explizite Trefferbestätigung;
- `Nutzen` setzt den Gewitterradar-eigenen Tracker über den unterstützten Backend-/Package-Pfad;
- noch keine ungefragte Vollverwaltung gespeicherter Orte und kein MapLibre-/Playback-/Wetter-Scope.

Geschützte Baseline:

- keine fragile String-Manipulation der erzeugten/minifizierten 1,6-MB-Frontend-Datei ohne nachvollziehbaren Build-/Delta-Hook;
- V4.06-Darstellung und bestehende Dialog-/Recent-/Touch-Regressionen bleiben geschützt;
- Integration und Dashboard müssen aus derselben kanonischen Frontend-Änderung erzeugt werden;
- Blitzdaten dürfen nach einem Trackerwechsel nicht automatisch als synchronisiert bezeichnet werden.

### Danach getrennt

Erst nach erfolgreichem Suchdialog-Test folgen als eigene logische Blöcke:

1. Saved Places über Local-To-do-Flexible-Datastore einschließlich Soft-Delete/Rückgängig;
2. Abdeckungs-/Synchronisationshinweise für den aktiven Blitzdatenbereich;
3. reale Home-Assistant-/Blitzortung-/Restart-/Recorder-Regression;
4. finale Mobile/iPad/Desktop-Regression und Release-Gates.
