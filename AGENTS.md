# GewitterRadar – verbindliche Entwickler-/Agentenregeln

**Vor jeder Änderung:** [Projekt-Bootstrap](docs/PROJECT_BOOTSTRAP.md) und [Modul-/Provider-Regressionsschutz](docs/MODULE_PROVIDER_ISOLATION_GUARD_2026-11-13.md) lesen. Die dortigen Schutzregeln gelten für jede neue und bestehende Funktion einschließlich Wind, Temperatur, Niederschlag, Synoptik, Eye, Menüs, Touch, Diagnose und Frontend-Runtime. Keine Funktion darf durch die Erweiterung einer anderen eingeschränkt werden. Aktuellen `deploy/dev`-HEAD prüfen, neue Versionen vergeben, reale Tests nicht vortäuschen, PROD nicht verändern.


## Verbindlicher FINAL-Release-Weg für KI-Agenten

Vor jeder Finalisierung **[FINALIZATION_RUNBOOK](docs/FINALIZATION_RUNBOOK.md)** und **[RELEASE_PROCESS](docs/RELEASE_PROCESS.md)** sowie **[GOLDEN_MASTER_POLICY](docs/GOLDEN_MASTER_POLICY.md)** lesen.

**GitHub-Schnittstellenregel:** Fehlt eine direkte Tool-Funktion für Release-Veröffentlichung, Merge oder Workflow-Dispatch, zuerst **tatsächliche Admin-/Push-Rechte**, existierende GitHub-Actions-Workflows und push-getriggerte CI/CD-Ausführungswege prüfen. Eine fehlende einzelne Tool-Aktion bedeutet **nicht**, dass die Veröffentlichung unmöglich ist. Der vollständig abgeschlossene V4.12-FINAL-Release beweist den Weg über GitHub Actions und die GitHub CLI im berechtigten Runner. Nicht vorschnell auf manuelle Umwege verweisen.

Verbindliche Reihenfolge: **abgenommener Kandidat → exakter alter main-SHA → geprüfter PRE-MERGE-Snapshot → Hotfix-Konvergenz und FINAL-Identität → kontrollierter Merge/Fast-Forward nach main → grüne Post-Merge-Gates auf exakt diesem SHA → Golden Master mit ZIP+Git-Bundle+SHA256 → beide verifizierten Installationspakete → offizielles Release → SHA-Abgleich von main, frozen-Branch und Tag**.

Bei roten Gates stoppen, Logs analysieren, minimal korrigieren und **für den neuen Commit** erneut prüfen. Nie frühere grüne Runs für einen anderen SHA als Abschlussbeweis verwenden. Historische V4.12-Workflows mit fest codierten SHAs/Run-IDs **nicht** für spätere Versionen unverändert wiederverwenden. VM101, produktive Installationen und geschützte Referenzen bleiben unangetastet. Im Runbook stehen die präzisen V4.12-Aktionen, Fehler und Wiederanlaufregeln.

## DEV-Auslieferung nach V4.12 FINAL (24.11.2026)

**Ein öffentliches Repository behalten.** GewitterRadar wird auf `TheDaimos/gewitterradar` mit `deploy/dev` für Entwicklung und `main` für stabile FINAL-Releases weiterentwickelt. Kein zusätzliches privates DEV-Repository anlegen; öffentliche GitHub Actions bleiben erhalten.

**Keine öffentlichen DEV-GitHub-Releases mehr erstellen.** Insbesondere keine neuen veröffentlichten `v*-dev`-Prereleases und keine DEV-Version als `latest`. Für DEV-Installation DRA/Branch `deploy/dev` und geeignete CI-Artefakte einsetzen; GitHub-Action-Artefakte sind zeitlich begrenzt und in einem öffentlichen Repository nicht vertraulich. DEV-Code und Git-Tags bleiben in einem öffentlichen Repository grundsätzlich öffentlich. Die öffentlichen GitHub-Releases sind ausschließlich für offizielle FINAL-/Stable-Stände vorgesehen.

**Historische DEV-Tags und geschützte Referenzen nicht löschen oder umschreiben.** Die V4.12-Bereinigung entfernt nur veröffentlichte DEV-Release-Einträge samt zugehöriger Release-Assets, niemals Tags, Branches, Commits, CI-Verträge, Golden Master oder FINAL-Releases. Siehe [FINALIZATION_RUNBOOK](docs/FINALIZATION_RUNBOOK.md).

## Aktuell geschütztes WR-/GR-Referenzpaar – Betreiberfreigabe 13.11.2026

**WR 0.10.320 DEV / Loader 323 + GR 4.11.195 DEV / HA 0.25.102**, Runtime `411195r1`, Modulset `E411-195A1`. Die verbindliche Akte ist [`docs/WR_GR_PROTECTED_REFERENCE_PAIR_010320_411195_2026-11-13.md`](docs/WR_GR_PROTECTED_REFERENCE_PAIR_010320_411195_2026-11-13.md). Bei neuen Modulen oder Providern zuerst diese Referenz und die Schutzregeln lesen; niemals die Referenz stillschweigend durch einen neueren ungeprüften HEAD ersetzen.

## Eye-Randpositionierung (technischer DEV-Referenzkandidat)

Bei Änderungen an Eye-Geometrie und Drag die [Randpositionierungsregression für GR 4.11.215](docs/GR_EYE_EDGES_411215_2026-11-15.md) erhalten. Die Betreiberabnahme auf HA DEV VM109 und Android steht bis zur ausdrücklichen Freigabe aus.

## V4.12-Aura (eigenständiger technischer Zwischenstand)

Vor Änderungen am Legend Hub die [technische Aura-Referenz GR 4.12.3](docs/GR_412_AURA_REFERENCE_2026-11-22.md) und ihre Regressionen erhalten: dynamische Ringprojektion, stabile Slot-/Pointer-Identität, reduzierte Bewegung, unmittelbare Hindernisauflösung, Randpositionierung und Vault-Persistenz. Keine neue Betreiberfreigabe ableiten; V4.11.03 FINAL und das bestehende WR-/GR-Referenzpaar bleiben geschützt.
