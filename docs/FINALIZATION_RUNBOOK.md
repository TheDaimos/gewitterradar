# DAIMOS – GewitterRadar FINALIZATION RUNBOOK

**Verbindlicher Agentenleitfaden.** Gilt ergänzend zu [RELEASE_PROCESS.md](RELEASE_PROCESS.md), [GOLDEN_MASTER_POLICY.md](GOLDEN_MASTER_POLICY.md), [ASSET_RETENTION_POLICY.md](ASSET_RETENTION_POLICY.md), [DIAGNOSTIC_PROTECTION_V4_07_56.md](DIAGNOSTIC_PROTECTION_V4_07_56.md) und `AGENTS.md`. Die Schutzverträge haben Vorrang.

## 1. Wichtigste Erkenntnis: GitHub-Tools ≠ GitHub-Möglichkeiten

**Fehlt dem verbundenen ChatGPT-/Codex-Werkzeug eine direkte Aktion für `create_release`, `workflow_dispatch` oder `merge`, darf daraus NICHT geschlossen werden, dass die Veröffentlichung unmöglich ist.**

Für GewitterRadar V4.12 funktionierte der Release trotz fehlender direkter Release-Aktion über berechtigte, push-getriggerte **GitHub Actions**. Zuerst GitHub-Repository-Rechte tatsächlich prüfen (`admin`, `push`), vorhandene `.github/workflows/` und ausführbare GitHub-Actions-Wege lesen, dann gezielt einen sicheren Workflow mit `on: push`, `contents: write` nur wenn erforderlich und nachweisbaren Gates einsetzen. Im Runner kann die GitHub CLI (`gh`) mit `github.token` den Release veröffentlichen.

Verbindliche Arbeitsweise:
1. Das **aktuell verbundene** Repository, Login, Berechtigungen und verfügbaren GitHub-Tools live prüfen; nicht aus Erinnerung oder einem früheren Chat behaupten.
2. `main`, `deploy/dev`, Kandidatenbranches, Tags, Releases, aktuelle Workflows und letzte erfolgreiche Runs anhand von SHA prüfen.
3. Direkte Aktionslücken gegen vorhandene GitHub-Actions-Workflows abgleichen, **bevor** eine Unmöglichkeit behauptet wird. Das ist kein Freibrief, ungesicherte alternative Zugriffe zu versuchen.
4. Kein Workflow darf ohne Schutz-Gates durch einen Commit auf `main` unkontrolliert publizieren; Workflow mit Branch-/Path-Filter, minimalem Token-Scope, Repository-Guard, SHA-Checks und Fail-Closed-Prüfung absichern.
5. Wenn ein erforderlicher Schritt tatsächlich nicht sicher ausführbar ist, den **konkreten** Blocker erklären. Keine Erfolge vortäuschen.

## 2. Verbindliche Reihenfolge von DEV zu FINAL

### A – Vorprüfung und Feature-Freeze

- Abgenommenen DEV-Stand und Commit exakt auflösen; Benutzerabnahme nicht aus einem grünen CI-Run ableiten.
- Aktuelle Releases, geschützte Referenzen, `AGENTS.md`, `PROJECT_DEFAULTS.md`, Versions-/Monatsformat und Status beider Auslieferungsformen lesen.
- `deploy/dev` mit `main` vergleichen; divergierte Wartungsfixes (z. B. First Steps) dürfen nicht durch alten DEV-Stand überschrieben werden.
- Freeze-Kandidat mit eindeutigem SHA sichern. **Ein Freeze-Kandidat ist kein Golden Master.**

### B – PRE-MERGE-Sicherung vor Änderung von main

- Aktuellen alten `main`-SHA dokumentieren; unmittelbar vor Promotion erneut validieren.
- Vollständigen PRE-MERGE-Quellsnapshot aus **genau diesem Commit** mit `scripts/create-source-archive.sh PRE_MERGE <alter-main-sha> <version> dist/source-archives` oder dem gleichwertigen CI-Workflow erzeugen.
- Quell-ZIP, Git-Bundle, internes Dateiinventar, äußere und innere SHA-256-Dateien prüfen: `sha256sum -c`, `unzip -tq`, `git bundle verify`.
- Archive unabhängig aufbewahren. Zeitlich befristete GitHub-Action-Artefakte sind nicht allein ein dauerhafter Recovery-Plan.
- **Ohne erfolgreich und nachvollziehbar gesicherten PRE-MERGE-Stand kein Update von main.**

### C – FINAL-Kandidat erstellen und prüfen

- Kanonische Metadaten synchronisieren: `frontend/version.js`, Runtime-Manifest, `frontend/assets.json` mit aktuellen Asset-Hashes und -Größen, HA-Manifest, `build_info.py`, DRA-Provenienz, `const.py` und Runtime-/Cache-Revisionen.
- Frontend deterministisch neu bauen (`node scripts/build-frontend.mjs`), dann `node scripts/verify-frontend.mjs`, `python scripts/verify-hacs-integration-package.py`, Diagnose-/Asset-/Quellarchiv-Verträge, Syntax und passende Browser-/HA-Tests.
- Die **beiden Frontend-Auslieferungsbäume müssen bytegleich** zur kanonischen Quelle sein.
- Veraltete, fest auf `r1` oder `A1` geschriebene Testannahmen nur dort auf gültige Release-Identitätsverträge generalisieren, wo die neue Runtime-Revision zulässig ist. Historische Regressionen nicht lockern/entfernen.
- Release-History, README, Changelog, `docs/HISTORY.md`, `docs/MILESTONES.md`, Release Notes, Monat und 19 Sprachvarianten prüfen.

### D – Kontrollierte Promotion und Post-Merge-CI

- Den erwarteten `main`-HEAD direkt vor jeder Aktualisierung erneut lesen; GitHub-Ref **nur als Fast-Forward mit erwartetem SHA** verschieben, niemals `main` force-pushen.
- Kandidat einschließlich benötigter älterer Hotfixes auf `main` übernehmen.
- Alle verpflichtenden CI-Gates **für den exakten neuen main-SHA** erfolgreich nachweisen (Frontend, HA/HACS/Hassfest, Hi-Res, Diagnose, Quellen, relevante Browser-/Funktionsprüfungen).
- Bei Rot **keine Veröffentlichung**. Job-Logs lesen, tatsächliche Ursache beseitigen, neuen SHA und dessen Gates erneut prüfen. Ältere grüne CI-Ergebnisse sind kein Nachweis für einen neuen Commit.

### E – Golden Master und veröffentlichte Pakete

- Erst nach grüner Post-Merge-CI Golden Master **vom exakten neuen main-Commit** erzeugen: `scripts/create-source-archive.sh GOLDEN_MASTER <final-main-sha> <version> dist/source-archives`.
- Vollständiges ZIP, Git-Bundle, Datei-Inventare und SHA-256 prüfen und unabhängig archivieren. Golden Master **ist kein HACS-Paket**.
- Beide stabilen Installationspakete deterministisch aus diesem Commit bauen und gegen kanonische Quellen, Paketinhalt und Checksummen prüfen.
- Über eine vorhandene sichere Veröffentlichungsaktion bzw. GitHub Actions mit `gh release create` veröffentlichen. Nicht bereits existierende unveränderliche Tags überschreiben; bestehende Releases idempotent prüfen.
- Zum Abschluss `main`, `frozen/vX.Y`, `refs/tags/vX.Y` und Release-Ziel-SHA vergleichen: **alle identisch**. Release ist weder Draft noch Prerelease, beide Pakete und die Sicherungen samt Prüfsummen sind vorhanden.
- Keine automatische Installation auf VM101 / PROD. Reale Betreiber- und Gerätetests nicht durch emulierte Tests ersetzen.

## 3. V4.12 FINAL – tatsächlich erfolgreich durchgeführter Referenzfall (23.11.2026)

Dies sind **historische Referenzwerte, keine zukünftigen Standardparameter**:

| Schritt | Nachgewiesenes Ergebnis |
|---|---|
| Betreiberabgenommene DEV-Basis | Frontend 4.12.15 DEV / HA 0.25.176 |
| Alter `main` vor Promotion | `af70fe2bf85a88fdea402cf46e3bd6a11903189b` |
| PRE-MERGE-Workflow | `.github/workflows/premerge-v4.12.yml`, Run `45274845031` erfolgreich |
| FINAL-Vorbereitung | `.github/workflows/prepare-v4.12-final.yml` und `scripts/prepare-v412-final.py`, Run `45275479344` erfolgreich |
| Public FINAL | `.github/workflows/publish-v4.12-final.yml`, Run `45279857677` erfolgreich |
| PRE-MERGE-Recovery ins Release übernommen | `ops/v4.12-preserve-premerge`-Workflow, Run `45281138575` erfolgreich |
| Finaler `main` / `frozen/v4.12` / Tag `v4.12` | `c712a2526faeb55b9cc1926a656268611f56e776` |
| Release | https://github.com/TheDaimos/gewitterradar/releases/tag/v4.12 |
| Finale App-Identität | `V4.12 FINAL` · intern `4.12.15` · HA `0.25.177` · Runtime `41215r2` |
| Öffentliche Assets | HA- und Dashboard-ZIP; Deployment- und SHA-256-Dateien; PRE-MERGE-ZIP + Bundle; Golden-Master-ZIP + Bundle |

Die Veröffentlichung erfolgte **erst nach** erfolgreich nachgewiesener Post-Merge-CI; die endgültige GitHub-Abfrage bestätigte denselben Commit für `main`, `frozen/v4.12`, `v4.12` und Release-Target.

## 4. Fehleranalyse: V4.12-Finalisierung

- **Fehlendes direktes Release-Tool:** `get_repo` bestätigte Admin-/Push-Rechte. Push-getriggerter GitHub-Actions-Workflow führte mit `gh` die tatsächliche Veröffentlichung durch. Tool-Lücke und Kontoberechtigung sind getrennt zu behandeln.
- **Verschiedene DEV-/main-Stände:** Vorhandene V4.11.3-Wartungsfixes wurden auf dem Release-Kandidaten konvergiert. First-Steps-Checkbox-Status blieb erhalten.
- **Manifest-Hash nach Runtime-Wechsel:** `frontend/assets.json` benötigt den Hash und die Bytegröße des geänderten Runtime-Manifests, sonst schlägt der Build fehl.
- **Veraltete CI-Versionsannahmen:** Einige ältere Tests erwarteten ausschließlich `r1` / `A1`; die Checks wurden auf konsistente gültige nicht-null Revisionen erweitert, **ohne** die eigentlichen historischen Funktionsprüfungen zu entfernen.
- **Historischer About-Golden-Test:** Alte Identitätserkennung erkannte `V4.12 FINAL` nicht. Korrektur über kanonische Metadaten, historische Pixel-/Geometrie-Regressionen beibehalten.
- **Publish-Gate rot:** Keine Veröffentlichung bei roten Gates; Testfehler wurden zuerst behoben, danach auf neuem `main`-Commit alle vorgesehenen Post-Merge-Gates erfolgreich abgeschlossen.
- **Recovery-Sicherung dauerhaft verfügbar:** Zusätzlich zum befristeten CI-Artefakt wurden PRE-MERGE-ZIP und Git-Bundle später in den offiziellen Release hochgeladen.

## 5. Agenten-Wiederanlauf nach Chatwechsel

1. Die tatsächlichen Regeln (`AGENTS.md`, dieses Runbook, `docs/RELEASE_PROCESS.md` und `docs/GOLDEN_MASTER_POLICY.md`) lesen.
2. GitHub-Berechtigungen, tatsächliche Branch-HEADs, Tags, Run-Ergebnisse und Release-Assets live ermitteln.
3. Den letzten **belegten** erfolgreichen Schritt feststellen und **nur fehlende Schritte** nacharbeiten; Archive/Tags nicht stillschweigend ersetzen.
4. Bei fehlender direkter Tool-Methode vorhandene CI-/GitHub-Actions-Wege prüfen, bevor der Release als unmöglich bezeichnet wird.
5. Erst nach vollständiger SHA-/Asset-Verifikation `FINAL veröffentlicht` melden.

## 6. Zukunft: generischer Finalize-Workflow

Eine wiederverwendbare `Finalize GewitterRadar`-Pipeline ist sinnvoll, **aber noch nicht als universeller Ein-Klick-Workflow umgesetzt**. Die V4.12-Workflows enthalten bewusst fest kodierte SHAs, Run-IDs, Versionen, Zweige und historische Hotfix-Checks und dürfen **niemals** unverändert für V4.13 kopiert oder gestartet werden. Eine generische neue Pipeline benötigt parametrisierte Kandidaten-/main-SHAs, Version/Tag, Versionierungslogik, Rückfallpfad, Gates, dedizierte Zugriffsrechte und unveränderliche Sicherungen; Einführung erst nach eigener Prüfung.
