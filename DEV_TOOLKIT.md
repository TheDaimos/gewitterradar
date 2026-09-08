# Gemeinsames Entwicklungswerkzeug- und Wissens-Repository

Für die weitere Gewitterradar-Entwicklung gilt das zentrale private Repository:

`TheDaimos/home-assistant-dev-toolkit`

## Verbindlicher Einstieg

Vor neuen allgemeinen Entwicklungs-, Diagnose-, Performance-, Kalibrierungs-, Overlay-, Logging-, Lifecycle-, HACS- oder nativen Home-Assistant-Integrationsarbeiten zuerst den aktuellen Toolkit-Stand prüfen.

Für Gewitterradar besonders relevant sind unter anderem:

- `docs/HOME_ASSISTANT_CUSTOM_INTEGRATION_STANDARD.md`
- `docs/INTEGRATION_BUILD_CHECKLIST.md`
- `docs/INTEGRATION_TEST_MIGRATION_STANDARD.md`
- `docs/HACS_INTEGRATION_RELEASE_STANDARD.md`
- `docs/HACS_DASHBOARD_RELEASE_PROMOTION_STANDARD.md`
- `docs/HACS_REPOSITORY_RENAME_COLLISION.md`, wenn Repository-Namen/HACS-Adressen betroffen sind
- `docs/TOOL_CATALOG.md`
- `docs/PROJECT_MEMORY.md`

## Gewitterradar-Produktregel

`TheDaimos/gewitterradar` ist die kanonische Produktquelle.

Integration und Dashboard/Lovelace sind nur zwei Auslieferungsformen desselben Gewitterradar-Produkts. Allgemeine Produktänderungen werden einmal in diesem Repository entwickelt und daraus für beide Auslieferungsformen erzeugt.

Das Dev-Toolkit darf niemals zur Produktions-Laufzeitabhängigkeit werden.

## Geschützte V4.05-Konvergenz

Die erste gemeinsame Frontend-Konvergenz muss den ausdrücklich abgenommenen V4.05-Stand vollständig erhalten. Verbindliche Schutzquelle:

`docs/ABOUT_GEWITTERRADAR_ACCEPTANCE_BASELINE_V4_05.md`

Insbesondere „Über Gewitterradar“, die Widmung/Danksagung, Slogan, Hero-/Widmungs-Assets und das akzeptierte Verhalten dürfen bei der technischen Zusammenführung nicht verloren gehen oder vereinfacht werden.

## Dauerregeln aus dem Toolkit

- **DEV OFF = keine Dev-spezifische Hintergrundarbeit.**
- Verstecken ist nicht Stoppen; Timer, RAF, Observer, Listener, HA-Abos und andere Ressourcen benötigen deterministisches Cleanup.
- Performance-Messungen verwenden Produktionslaufzeit plus minimalen Messharness und stellen danach exakt den vorherigen Dev-Zustand wieder her.
- Allgemein wiederverwendbares Wissen zurück ins Toolkit führen; Gewitterradar-spezifische Implementierungsdetails im Produktrepository belassen.
- Keine direkten `.storage`-Manipulationen oder privaten Home-Assistant-Frontend-APIs als normalisierte Produktlösung.

Dieses Dokument ist ein dauerhafter Bootstrap-Anker für ChatGPT, Codex und Maintainer.