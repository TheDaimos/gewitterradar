# GewitterRadar – verbindliche Entwickler-/Agentenregeln

**Vor jeder Änderung:** [Projekt-Bootstrap](docs/PROJECT_BOOTSTRAP.md) und [Modul-/Provider-Regressionsschutz](docs/MODULE_PROVIDER_ISOLATION_GUARD_2026-11-13.md) lesen. Die dortigen Schutzregeln gelten für jede neue und bestehende Funktion einschließlich Wind, Temperatur, Niederschlag, Synoptik, Eye, Menüs, Touch, Diagnose und Frontend-Runtime. Keine Funktion darf durch die Erweiterung einer anderen eingeschränkt werden. Aktuellen `deploy/dev`-HEAD prüfen, neue Versionen vergeben, reale Tests nicht vortäuschen, PROD nicht verändern.


## Aktuell geschütztes WR-/GR-Referenzpaar – Betreiberfreigabe 13.11.2026

**WR 0.10.320 DEV / Loader 323 + GR 4.11.195 DEV / HA 0.25.102**, Runtime `411195r1`, Modulset `E411-195A1`. Die verbindliche Akte ist [`docs/WR_GR_PROTECTED_REFERENCE_PAIR_010320_411195_2026-11-13.md`](docs/WR_GR_PROTECTED_REFERENCE_PAIR_010320_411195_2026-11-13.md). Bei neuen Modulen oder Providern zuerst diese Referenz und die Schutzregeln lesen; niemals die Referenz stillschweigend durch einen neueren ungeprüften HEAD ersetzen.

## Eye-Randpositionierung (technischer DEV-Referenzkandidat)

Bei Änderungen an Eye-Geometrie und Drag die [Randpositionierungsregression für GR 4.11.215](docs/GR_EYE_EDGES_411215_2026-11-15.md) erhalten. Die Betreiberabnahme auf HA DEV VM109 und Android steht bis zur ausdrücklichen Freigabe aus.

## V4.12-Aura (eigenständiger technischer Zwischenstand)

Vor Änderungen am Legend Hub die [technische Aura-Referenz GR 4.12.3](docs/GR_412_AURA_REFERENCE_2026-11-22.md) und ihre Regressionen erhalten: dynamische Ringprojektion, stabile Slot-/Pointer-Identität, reduzierte Bewegung, unmittelbare Hindernisauflösung, Randpositionierung und Vault-Persistenz. Keine neue Betreiberfreigabe ableiten; V4.11.03 FINAL und das bestehende WR-/GR-Referenzpaar bleiben geschützt.

## Verbindlicher GitHub-Zugriffs-Fallback (24.11.2026)

Bei lokalem Git-Zugriffsfehler zuerst die verfügbaren GitHub-Connector-Werkzeuge für Lesezugriffe, Dateiänderungen, Git-Objekte, Commits und Branch-Updates verwenden. Bei einem einzelnen Werkzeugfehler geeignete alternative Connector-Pfade prüfen, bevor der Auftrag als blockiert gilt. Aktuellen Remote-HEAD und Dateiversionen verifizieren; ausschließlich autorisierte DEV-Branches, keine erzwungenen Überschreibungen, keine Umgehung von Schutz-, CI-, Test-, Datenschutz- oder Release-Regeln. Tatsächlich ausgeführte Prüfungen und verbleibende Einschränkungen getrennt dokumentieren. Diese Ergänzung ersetzt keine bestehende Projektregel.
