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


---

## 7. Agentenpflicht: selbstständig bis zum überprüfbaren FINAL-Ergebnis arbeiten

**Nicht verhandelbar:** Ein Auftrag „finalisieren und veröffentlichen“ bedeutet *durchführen*, nicht einen Plan, eine Fehlerbeschreibung oder die Bitte um den nächsten Auftrag liefern. Jeder korrigierbare Fehler ist nur eine Zwischenstation.

### 7.1 Verbindlicher Arbeitsautomat

1. **DISCOVER:** GitHub-Remote, tatsächliche Berechtigungen, alter/neuer main-SHA, Kandidat, freigegebene Referenzen, Workflows, bereits erfolgreich geprüfte Nachweise und aktuellen Release-Zustand lesen.
2. **ACT:** Die nächste autorisierte, noch nicht erledigte Aktion tatsächlich ausführen. Erfolge anhand der Rückgabe der GitHub-API/Runner belegen, nicht aus Absichten ableiten.
3. **DIAGNOSE bei FAIL:** Fehlgeschlagenen Job und die exakte problematische Kommandozeile lesen. Einordnen: Anwendungsfehler, Regression/Fixture, Asset-/Hash-/Spiegelproblem, Runner-Abhängigkeiten, Git/Release-API, Rechte, Sicherungs-/Betreiberfreigabe.
4. **FIX:** Kleinste zulässige Lösung umsetzen. Keine CI-Gates abschalten; keine Referenz, keinen Tag, keinen Golden Master überschreiben. Tool-Fallbacks prüfen: GitHub-Connector, öffentliche Actions und CLI im berechtigten Runner.
5. **RETEST:** Korrigierte Stufe wirklich erneut testen, einschließlich aller durch die Änderung ungültigen Tests. **Anderer Commit-SHA bedeutet: alle zwingenden SHA-gebundenen CI-Belege neu!**
6. **RESUME:** Sofort wieder zum nächsten noch offenen Schritt des **ursprünglichen** Auftrags gehen. Nicht nach einem Teilfix, erfolgreich gestarteten Run, grünen Build, PR-Merge oder Golden Master aufhören.
7. **VERIFY:** Remote-Tag und Release-Target auf akzeptiertem Commit; offizielles Release ist öffentlich und weder Draft noch Prerelease; Golden-Master-ZIP und Git-Bundle, SHA256, beide installierbaren ZIPs, PRE-MERGE-Offsite-Nachweis und relevante CI sind gültig.
8. **REPORT:** Nur bei vollständig bestandenem VERIFY „FINAL veröffentlicht“. Andernfalls präziser Status BLOCKED mit Log, bereits belegten Stufen und exakter nächster Aktion.

**Wiederholungspflicht:** Bei korrigierbarem Fehler die Schleife DIAGNOSE → FIX → RETEST → RESUME **selbstständig** durchlaufen; keine Bitte um erneute Einzelbeauftragung. Bei wiederholt identischem Fehler die Diagnose ändern, statt blind denselben Lauf zu starten. Nicht absehbar oder nicht erlaubbar: tatsächlichen Blocker nennen; niemals Berechtigungen/Sicherheitsmaßnahmen umgehen. Nicht geprüfte Betreiber-Realtests bleiben ausdrücklich offen.

### 7.2 Entscheidungs- und Wiederaufnahmematrix

| Situation | Verbindlich nächste Aktion | Keinesfalls |
| --- | --- | --- |
| Lokales DNS, gh oder Python-Dependency fehlt | Connector für GitHub-Operationen und öffentliche GitHub-Actions-Runner verwenden; Dependencies gemäß Manifest installieren | Gesamtauftrag wegen eines lokalen Tool-Problems aufgeben |
| Keine direkte Connector-Release-/Dispatch-Funktion | Live-Rechte und bestehende Actions/Push-Request-/PR-Merge-Pfade prüfen | Ohne Prüfung behaupten, Veröffentlichung sei unmöglich |
| Roter Test oder falsche Versions-/Asset-Hashannahme | Logs → minimaler Fix → Build/Spiegel/Verträge → exakte aktuelle CI → weiter | Alte grüne Runs eines anderen SHA zitieren |
| Externe PRE-MERGE-Kopie fehlt oder alter main-SHA wechselte | Vollständige ZIP/Bundle-Sicherung des exakten SHA erzeugen, außerhalb GitHub erneut herunterladen und Hash vergleichen | main mergen |
| Post-Merge-CI noch in progress | Jobstatus weiter prüfen, bei Fehler selbst korrigieren und nachtesten | Als Erfolg ausgeben |
| Alle Prüfungen/Golden Master bestanden, nur Veröffentlichung rot | Unveränderte geprüfte Pakete/Assets und Ziel-SHA prüfen; gezielte Publish-Recovery | Den gesamten Build grundlos neu starten oder Release-Tag ändern |
| Draft angelegt, Remote-Tag fehlt | Draft-ID, Target und Asset-Digests prüfen; exakten Tag explizit erzeugen, Draft veröffentlichen und remote verifizieren | Zweiten Draft erzeugen, Tag auf fremden SHA verschieben |
| Tag vorhanden, Release fehlt | Tag-SHA prüfen; nur aus geprüften Paketen idempotent veröffentlichen | Tag überschreiben |
| Tatsächlich fehlende Freigabe oder Permission | Konkreten BLOCKED-Status mit API-/Freigabenachweis und Wiederaufnahmepunkt melden | Freigabe oder Rechte fingieren |

### 7.3 Reale V4.13-Fallstudie (25.11.2026)

- Gesicherter früherer main: 0bbb47772667c8ff252157ac6a6fab269877a0d6; PRE-MERGE-Run 45496499861; externe verifizierte Kopie in docs/release-control/GR_V413_INDEPENDENT_PREMERGE_BACKUP.md.
- Publikations-PR #44 wurde nach grünen Kandidaten- und Post-Merge-Gates gemergt: endgültiger Release-Commit 509daeb7245f42b23e46f72b4d002c42f0d7f56e.
- Originaler FINAL-Run 45576565922 bestand alle Prüfungen inklusive Golden-Master-ZIP+Git-Bundle, Prüfsummen und zwei Installations-ZIPs. Die GitHub-CLI erzeugte den **Draft mit sieben vorhandenen Assets**, aber ein anschließender Git-Fetch scheiterte: fatal: couldn't find remote ref refs/tags/v4.13 (Exit 128).
- Ursache: Ein mit gh release create --draft angelegter Entwurf erzeugt **nicht zwingend bereits einen sichtbaren Remote-Tag**. Das ist ein Workflow-/Publikationsfehler, kein Fehler des Produktcodes und kein Anlass, alle Pakete grundlos neu zu bauen.
- Recovery: Isolierter Workflow auf release/v413-publish-recovery, Run 45579237291 (success). Er prüfte unveränderten main, alte erfolgreichen Checks, Draft-ID 457838854, Ziel-Commit und **SHA256 aller sieben Original-Assets**; erzeugte/verifizierte Remote-Tag v4.13 auf 509daeb7..., veröffentlichte den existierenden Draft und bestätigte anschließend Tag-SHA, main, Release-Status und Assets. Offiziell: https://github.com/TheDaimos/gewitterradar/releases/tag/v4.13
- **Pflicht für künftige Workflows:** Nach den Gates den exakten Tag explizit erzeugen und remote prüfen, bevor ein Draft angelegt wird. Bei existierendem Draft den ursprünglichen Release anhand ID/Tag/Target und Asset-Hashes **idempotent fortsetzen**, nie einen zweiten Draft anlegen oder geschützte Tags umhängen.
- Die Release-Dokumentation kann erst **nach** dem Release auf main übernommen werden. Das neue main-Dokumentations-SHA ist dann nicht rückwirkend Bestandteil des unveränderlichen V4.13-Golden-Masters. Ein frozen/v4.13-Branch ist nicht allein wegen der allgemeinen Runbook-Regel als vorhanden anzunehmen.

### 7.4 Pflichtprotokoll

Für jede finale Veröffentlichung erfassen: Release-/HA-/Frontend-Version; exakter früherer main-SHA; PRE-MERGE-Run + unabhängiger Offsite-SHA256; finaler main-SHA; erforderliche grüne CI-Run-IDs auf **diesem** SHA; Golden-Master-ZIP/Bundle und Checksummen; HA-/Dashboard-ZIP und Checksummen; Tag-Ziel-SHA; offizielle Release-URL und ID; draft=false, prerelease=false; tatsächliche Assetliste/Digests; gesondert noch offene Realtests; PASS oder BLOCKED mit Beleg.

**Stop-Bedingung:** Nur PASS nach echter Endkontrolle oder ein *nicht selbst behebbarer* nachgewiesener BLOCKED-Grund. Ein normaler korrigierbarer Fehler ist keine Stop-Bedingung.
