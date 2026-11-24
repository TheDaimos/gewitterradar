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

## Dauerhaftes FINAL-Release ohne lokales DNS / gh

**Pflicht vor jeder FINAL-Promotion:** [FINAL_RELEASE_AUTOMATION.md](docs/FINAL_RELEASE_AUTOMATION.md), [GOLDEN_MASTER_POLICY.md](docs/GOLDEN_MASTER_POLICY.md) und [PROJECT_BOOTSTRAP.md](docs/PROJECT_BOOTSTRAP.md) lesen. Die öffentlichen GitHub-Actions-Workflows `gr-release-premerge.yml` und `gr-release-final.yml` übernehmen PRE-MERGE-Sicherung, remote CI, Golden Master und offizielle Veröffentlichung. Bei lokalem DNS-/Git-/CLI-Ausfall zuerst den GitHub-Connector für Branch, Dateien und PR nutzen und per GitHub-Actions-Runner ausführen, nicht wiederholt lokal scheitern. Connector ohne Workflow-Dispatch: gesonderte PRE-MERGE-/FINAL-Request-Branches und kontrollierter PR-Merge gemäß Anleitung. Die Workflows benötigen erfolgreiche echte CI, externe PRE-MERGE-Sicherung und Betreiberfreigabe. **Ein DEV-HEAD, PR oder Backup allein ist niemals eine FINAL-Freigabe.** Bereits bestehende Referenzen, WeatherRouter und PROD unverändert.

## Aktueller FINAL-Blocker V4.13 – Pflichtlektüre nach Chatwechsel (24.11.2026)

Vor einer Fortsetzung von V4.13 FINAL **[GR_413_FINAL_BLOCKERS_AND_AGENT_RUNBOOK_2026-11-24.md](docs/GR_413_FINAL_BLOCKERS_AND_AGENT_RUNBOOK_2026-11-24.md)** vollständig lesen. Die Akte enthält den erfolgreich geprüften PRE-MERGE-Run, fehlende externe Sicherung, den Unterschied zwischen interner `4.13.7` und öffentlicher `V4.13 FINAL`-Identität sowie die nicht zueinander passenden historischen FINAL-Guards und Release-Workflow-Eingaben. **Versionsgebundene Build-/CI-/Release-Regeln selbstständig und minimal auf die aktuelle Version erweitern, ohne bestehende Prüfschärfe oder historische Schutzverträge zu entfernen.** Bei lokalem Container-/DNS-Ausfall Remote-GitHub-Actions nutzen; keine erfundenen Abnahmen/Sicherungen. Die Akte ist Diagnose, nicht Veröffentlichungsfreigabe.
