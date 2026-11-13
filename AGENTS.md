# GewitterRadar – verbindliche Entwickler-/Agentenregeln

**Vor jeder Änderung:** [Projekt-Bootstrap](docs/PROJECT_BOOTSTRAP.md) und [Modul-/Provider-Regressionsschutz](docs/MODULE_PROVIDER_ISOLATION_GUARD_2026-11-13.md) lesen. Die dortigen Schutzregeln gelten für jede neue und bestehende Funktion einschließlich Wind, Temperatur, Niederschlag, Synoptik, Eye, Menüs, Touch, Diagnose und Frontend-Runtime. Keine Funktion darf durch die Erweiterung einer anderen eingeschränkt werden. Aktuellen `deploy/dev`-HEAD prüfen, neue Versionen vergeben, reale Tests nicht vortäuschen, PROD nicht verändern.


## Aktuell geschütztes WR-/GR-Referenzpaar – Betreiberfreigabe 13.11.2026

**WR 0.10.320 DEV / Loader 323 + GR 4.11.195 DEV / HA 0.25.102**, Runtime `411195r1`, Modulset `E411-195A1`. Die verbindliche Akte ist [`docs/WR_GR_PROTECTED_REFERENCE_PAIR_010320_411195_2026-11-13.md`](docs/WR_GR_PROTECTED_REFERENCE_PAIR_010320_411195_2026-11-13.md). Bei neuen Modulen oder Providern zuerst diese Referenz und die Schutzregeln lesen; niemals die Referenz stillschweigend durch einen neueren ungeprüften HEAD ersetzen.
