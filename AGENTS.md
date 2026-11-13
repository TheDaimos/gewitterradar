# GewitterRadar – verbindliche Entwickler-/Agentenregeln

**Vor jeder Änderung:** [Projekt-Bootstrap](docs/PROJECT_BOOTSTRAP.md) und [Modul-/Provider-Regressionsschutz](docs/MODULE_PROVIDER_ISOLATION_GUARD_2026-11-13.md) lesen. Die dortigen Schutzregeln gelten für jede neue und bestehende Funktion einschließlich Wind, Temperatur, Niederschlag, Synoptik, Eye, Menüs, Touch, Diagnose und Frontend-Runtime. Keine Funktion darf durch die Erweiterung einer anderen eingeschränkt werden. Aktuellen `deploy/dev`-HEAD prüfen, neue Versionen vergeben, reale Tests nicht vortäuschen, PROD nicht verändern.
