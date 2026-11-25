# GewitterRadar – dauerhaftes FINAL-Release-Verfahren ohne lokales Git/DNS

**Verbindlich für alle künftigen ChatGPT-/Codex-Entwicklungschats.** Öffentliche CI ausschließlich in `TheDaimos/gewitterradar`. WeatherRouter-DEV und VM101 niemals für einen GR-Release ändern.

## Einstieg / Entscheidungsregel

1. `AGENTS.md`, `docs/PROJECT_BOOTSTRAP.md`, `docs/GOLDEN_MASTER_POLICY.md` und dieses Dokument lesen.
2. Den tatsächlichen `deploy/dev`-HEAD, `main`-HEAD, die abgenommene Kandidatenversion, CI-Stände und das geschützte Referenzpaar remote prüfen. **DEV-HEAD ist keine FINAL-Freigabe.**
3. **Fehlendes lokales DNS oder `gh` ist kein Grund zum Abbruch.** Zuerst GitHub-Connector für Lesen/Commits/Branches/PR/Merge verwenden. Für GitHub Actions (Shell, Backups, Build, Checks, Tag/Release/Assets) die öffentlichen Remote-Runner verwenden. Falls ein Connector die Workflows nicht dispatchen kann, den unten dokumentierten Push-Antrag verwenden.
4. Kein Release, bevor tatsächliche Betreiberfreigabe, alle notwendigen Tests und unveränderliche Sicherungen bestätigt wurden. Nie grüne Tests, Artefakte, Freigaben oder SHA-Werte erfinden.

## Zwei bereits vorhandene öffentliche Workflows

- [PRE-MERGE-Sicherung](../.github/workflows/gr-release-premerge.yml): erstellt `PRE_MERGE` ZIP + Git-Bundle aus dem **exakten aktuellen alten main**, mit Prüfsummen, Manifest und 90-Tage-Actions-Artefakt. **Keine Promotion auf main.**
- [FINAL-Veröffentlichung](../.github/workflows/gr-release-final.yml): läuft **ausschließlich auf main**; verifiziert alte Sicherung, externen Backup-Nachweis, exakte Identität, Frontend/HA/HACS-Prüfungen, drei öffentliche CI-Gates, erzeugt Golden Master und installierbare Integration-/Dashboard-ZIPs, taggt **den geprüften neuen main-Commit** und erstellt das offizielle GitHub Release, zunächst als Entwurf.

**Beide Workflows sind wiederverwendbar.** Ihre Einführung verändert nicht automatisch die momentan installierte Version und löst keinen FINAL-Release aus.

## Ausführung ohne lokale Shell – nur Connector + GitHub-Runner

### A. Kandidat vorbereiten

- Von geprüftem `deploy/dev`-Commit einen separaten FINAL-Release-Branch ableiten.
- FINAL-Version und native HA-Integrationsversion in **allen drei Spiegeln, Manifest, DRA-Provenienz, Runtime-Cache, Inventar und Prüfsummen** konsistent setzen; DE/EN-Release Notes als `docs/RELEASE_NOTES_V<major>_<minor>.md` anlegen.
- Nur nötige Identitätsänderungen und Release Notes; Schutz-/Regressionstests auf Kandidat. **Keinen DEV-Build ungeändert als FINAL taggen.**

### B. PRE-MERGE auf GitHub sichern

- Exakten aktuellen alten `main`-SHA festhalten.
- Mit GitHub-Connector aus diesem `main`-Stand einen neuen Branch `release/premerge/<version>-<nonce>` anlegen. Auf ihm **nur** `docs/release-control/premerge-request.json` hinzufügen/aktualisieren:

```json
{"version":"4.13","expected_main_sha":"<EXAKTER_ALTER_MAIN_SHA_40_HEX>"}
```

- Der Push startet `GR release PRE-MERGE backup` automatisch auf einem GitHub-Runner. Alternativ Workflow in GitHub Actions über **Run workflow** mit denselben Inputs starten.
- Erfolgreiche Run-ID und Archivprüfsummen abrufen; das **PRE-MERGE-ZIP und Git-Bundle zusätzlich unabhängig von GitHub** sicher verwahren und überprüfen. Ein 90-Tage-Actions-Artefakt ist **keine dauerhafte Offsite-Sicherung**.
- Wenn `main` sich zwischen Identitätsprüfung und Sicherung verändert, schlägt der Lauf zu Recht fehl. Neue Sicherung vom neuen alten `main` erstellen.

### C. Geschützte Promotion

- Erst nach nachgewiesener PRE-MERGE-Sicherung FINAL-Kandidaten-PR gegen `main` erstellen; Freigaben/CI und alle Referenzen prüfen.
- PR regulär ohne Force-Push nach `main` übernehmen; neuen tatsächlichen `main`-SHA erfassen.
- Exakte öffentliche CI für **diesen** Commit prüfen. Die neue FINAL-Workflow-Pipeline wartet auf die drei Pflichtgates. Weitere versionsspezifische Tests bleiben zusätzlich Pflicht.
- Produktversion in `main` muss **exakt** der FINAL-Version entsprechen, die beschriebenen Archive müssen daraus erzeugt werden können.

### D. Veröffentlichung auslösen

Bei GitHub Actions auf `main` den Workflow `GR FINAL publish (exact main)` per **Run workflow** mit `version`, `integration_version`, `old_main_sha`, `premerge_run_id` und `backup_verified=true` starten.

**Connector ohne Workflow-Dispatch:** Einen separaten, von aktuellem `main` abgeleiteten `release/publish-request/<version>`-Branch erstellen, darauf `docs/release-control/publish-request.json` anlegen und **nur diese Kontrolländerung** via PR nach `main` mergen:

```json
{
  "version":"4.13",
  "integration_version":"0.25.185",
  "old_main_sha":"<EXAKTER_ALTER_MAIN_SHA_40_HEX>",
  "premerge_run_id":"<ERFOLGREICHE_RUN_ID>",
  "independent_backup_verified":true
}
```

Ein Merge dieser Datei auf `main` löst die FINAL-Action über das `push`-Ereignis aus. **Achtung:** Ein per Standard-`GITHUB_TOKEN` erzeugter Commit löst in GitHub normalerweise keine weiteren `push`-Workflows aus; für den Trigger daher einen autorisierten regulären PR-Merge verwenden und prüfen, dass der Runner tatsächlich startet. Fehlt der Start, die GitHub-Actions-Oberfläche für `workflow_dispatch` verwenden. Der Antrag ist kein Freigabenachweis, sondern wird vom Workflow strikt geprüft.

**Keine Freigabe durch reines Ändern eines Antrags:** Der Workflow verlangt `main`-Abstammung vom gesicherten alten Commit, exakte installierbare FINAL-Metadaten, erfolgreiche originale PRE-MERGE-Run-ID, explizite unabhängige Backup-Bestätigung sowie echte grüne CI des Veröffentlichungscommits. Bei jedem fehlenden Beleg: FAIL CLOSED.

### E. Abschluss

- `v<major>.<minor>` darf vorher nicht existieren; Tag niemals verschieben.
- Golden-Master-ZIP + Bundle vom exakt geprüften Post-Merge-`main`; SHA256 und ZIP-/Bundle-Integrität prüfen.
- Offizielles GitHub Release, Quell- und Installationsarchive, tatsächliche Hashes, Tag-SHA und GitHub-CI vergleichen. Veröffentlichung erst nach bestandener Identitätskontrolle aus dem Draft heraus.
- `https://github.com/TheDaimos/gewitterradar/releases/tag/v<major>.<minor>` und SHA-Nachweise melden. HACS über **benutzerdefiniertes Repository**; keine unbelegte Aussage zur offiziellen HACS-Katalogzulassung.
- WeatherRouter und PROD VM101 bleiben unverändert. Erfolg ausschließlich bei wirklich vorhandenem, geprüftem GitHub Release melden.

## Fehlerbehandlung für neue Chats

- `getaddrinfo` / DNS-Fehler lokal: **nicht** lokale Git-/CLI-Kommandos wiederholen; GitHub-Connector + Actions verwenden.
- Fehlende GitHub-Releases-API im Connector: **nicht** sofort abbrechen, sondern den vorhandenen Actions-Workflow und den Push-/PR-Auslöser verwenden.
- Fehlender Workflow-Run: Run-Trigger/SHA und GitHub-Event-Ursprung prüfen; nicht behaupten, dass CI gelaufen sei.
- Premerge-Artefakt fehlt, SHA nicht exakt, externe Sicherung fehlt, CI rot: **kein Merge bzw. keine FINAL-Publikation**.
- Workflow-Dateien selbst immer durch PR gegen `main` bereitstellen; nicht voraussetzen, dass ein nur auf `deploy/dev` liegender Workflow über die GitHub-Actions-Oberfläche dispatchbar ist.
- Falls Aktionen im konkreten GitHub-Plan/Repo deaktiviert sind, ist dies ein realer externer Blocker, **kein lokales DNS-/Auth-Problem**.

## Dauerhaft geschütztes Vorgehen

`deploy/dev` -> DEV-Abnahme -> separater Release-Candidate -> PRE-MERGE altes `main` -> regulärer Merge -> Post-Merge-CI -> Golden Master -> Tag/Release -> HACS-Installationsnachweis.

Kein Auto-Merge bei bloßem Dateiupload; kein Tag bei roter CI; keine private WR-CI; keine Rechte- oder Datenschutzumgehung. Die Original-Export2Git-Sicherung erfolgt im privaten `TheDaimos/Project-Log-And-Export@main`; diese Infrastruktur ersetzt sie nicht.


## Pflicht zur eigenständigen Fehlerbehebung und Wiederaufnahme

Siehe [FINALIZATION_RUNBOOK, Abschnitt 7](FINALIZATION_RUNBOOK.md): DIAGNOSE → FIX → RETEST → RESUME bis zum tatsächlich verifizierten öffentlichen Release. Weder Fehlerbericht noch korrigierte Teilphase, gestarteter Workflow oder vorhandener Draft erfüllen den Auftrag. Bei neuen SHAs sind die daran gebundenen Tests neu auszuführen. Fallback bei lokalem DNS-/CLI-Problem: Connector + öffentliche GitHub Actions. Sicherheits- und Freigabeschranken bleiben strikt.

**V4.13 konkret:** Der ursprüngliche finale Run 45576565922 hatte CI, Golden Master, beide ZIPs und alle sieben Release-Assets korrekt erzeugt, brach aber beim Abruf von refs/tags/v4.13 ab. Grund war die fehlende Tag-Ref beim zuerst angelegten Draft. Run 45579237291 verifizierte Originaldaten und Hashes, erzeugte den exakten Tag, veröffentlichte den bestehenden Draft (ID 457838854) und bestätigte das offizielle Release. **Immer Tag explizit auf das verifizierte main-SHA setzen und vor Draft-Erstellung prüfen; existierende Entwürfe bei Fehlern idempotent anhand ID/Target/Hashes wiederaufnehmen.** Kein doppeltes Release, kein Tag-Retarget, kein unnötiger Neubuild. Der historische JSON-Beispielwert 0.25.185 oben ist nicht der tatsächliche V4.13-FINAL-Wert; dieser war 0.25.186.
