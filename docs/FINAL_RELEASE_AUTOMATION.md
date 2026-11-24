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

## Fehlerfall V4.13 und Versions-Gates (verbindliche Ergänzung 24.11.2026)

**Konkrete, geprüfte Ursachen und die versionsübergreifende Agenten-Handlungsregel stehen in [GR_413_FINAL_BLOCKERS_AND_AGENT_RUNBOOK_2026-11-24.md](GR_413_FINAL_BLOCKERS_AND_AGENT_RUNBOOK_2026-11-24.md).** Vor jeder V4.13-FINAL-Fortsetzung die Akte vollständig lesen. Der PRE-MERGE-Run `45496499861` ist erfolgreich; die unabhängig aufbewahrte Sicherung ist **noch nicht nachgewiesen**. `scripts/build-frontend.mjs` besitzt ältere FINAL-Sonderregeln, und der generische FINAL-Workflow verwechselt öffentliche `4.13` mit interner `4.13.7`-Versionsidentität. Neue Chats müssen historische Versions-Gates ohne Sicherheitsabschwächung selbstständig weiterentwickeln und die Anpassungen durch echte Remote-CI auf dem richtigen Commit belegen. Bei lokalem DNS-/Container-Fehler zuerst Remote-Runner und GitHub-Connector verwenden, keine Freigabe simulieren.

## Eigenständige Fehlerbehebung statt Abbruch (verbindliche Agentenregel)

Dies ist ein **Ausführungsauftrag**, keine unverbindliche Empfehlung: Ein Entwicklungsagent, dem die Finalisierung oder ein fehlerhafter Build zur Behebung übertragen wurde, soll auf seinem autorisierten Entwicklungs-/Release-Kandidatenbranch selbstständig korrigieren, committen, neu testen und öffentliche CI-Ergebnisse auswerten. **Ein roter Test ist nur ein Zwischenstand.** Erst ein nachgewiesener externer Blocker, eine echte Sicherheits-/Backup-Lücke oder eine Änderung außerhalb des freigegebenen Umfangs rechtfertigt das Anhalten. In diesen Fällen die bereits erledigten Arbeitsschritte und den exakt offenen Nachweis dokumentieren; niemals grüne Ergebnisse oder Sicherungsbestätigungen vortäuschen.

### Verbindliche Korrekturschleife

1. Tatsächlichen GitHub-Workflow-Lauf, betroffenen Commit, Job-ID, fehlgeschlagenen Schritt und vollständigen Stacktrace abfragen. Ähnliche Folgefehler zur **gemeinsamen Ursache** zusammenfassen; keine Vermutung als Diagnose ausgeben.
2. Aktuelle Implementierung, Module, Schutzverträge, die erfolgreiche Vorversion und Branch-Divergenzen vergleichen. Veraltete feste Werte (`V4.11`, `V4.12`, `r1`, `A1`, vier Legend-Hub-Kategorien usw.) in **historische Referenzprüfung** versus **aktuell zu erweiternde Prüfannahme** unterteilen. Historische Tests und geschützte Funktionen dürfen nicht entfallen.
3. Minimalen **funktionsneutralen** Fix selbst vornehmen. Beispiel: Das Runtime-Manifest aus kanonischer Metadatenquelle synchronisieren, `frontend/assets.json`-SHA256 und -Bytezahl aus den wirklichen Bytes regenerieren, danach `scripts/build-frontend.mjs` und `scripts/verify-frontend.mjs` ausführen. Hashchecks **niemals abschalten**. Beispiel: Eine zusätzliche Mondkategorie im Legend Hub ausdrücklich additiv prüfen, dabei Vier-Kategorien-Historie und Slot-Isolation weiter absichern.
4. Falls der Versionswechsel eine neue gültige FINAL-Identität erfordert, **Build-, Test- und GitHub-Actions-Verträge selbstständig** auf strenge kanonische Versionsfelder erweitern. Interne Produktversion (`4.13.7`) und öffentliche FINAL-Reihe (`V4.13`) unterscheiden; HA-/Modulrevision, Build, DRA, Frontend-Spiegel, Asset-Inventare und Release-Anforderungen konsistent validieren. **Keine pauschalen globalen Ersetzungen oder Lockerungen.**
5. Änderung auf einem **gesonderten autorisierten Kandidatenbranch** committen, Build und gezielte Negativ-/Positivtests auf einem funktionierenden GitHub-Runner ausführen, anschließend **neue** verpflichtende CI auf dem genauen neuen SHA prüfen. Bei neuer Fehlermeldung ab Schritt 1 fortsetzen; keine grüne CI eines älteren SHA für eine neue Version wiederverwenden.
6. Für reine Metadaten-/Test-/Build-Vertragskorrekturen innerhalb der bereits erteilten Freigabe selbstständig fortfahren. Wenn eine Korrektur das Benutzerverhalten/Provider-Logik/geschützte Funktionen verändert, sicherheitsrelevante Verträge lockert oder neue externe Berechtigungen benötigt, den konkreten Sachverhalt mit Belegen offenlegen und vor diesem Schritt Freigabe einholen.
7. Vor `main`-Promotion die unabhängige PRE-MERGE-Aufbewahrung und die gültige Betreiberabnahme **tatsächlich** bestätigen, niemals Ersatzbelege erfinden. Nach Merge neue Post-Merge-Gates, Golden Master und GitHub Release streng nach `docs/GOLDEN_MASTER_POLICY.md`; bei roten Gates keine Veröffentlichung.

### Fehlermeldungen, die selbstständig zu beheben sind

- **`Asset SHA mismatch`:** kanonische Datei und verzeichneten Hash/Größe prüfen und das Asset-Inventar korrekt regenerieren; anschließend Frontend-Build, Spiegel-Parität und gesamtes Prüfsummeninventar nachziehen.
- **Historischer `assert.deepEqual`-Fehler durch neues Modul:** Zusatzfunktion additiv in Testvertrag aufnehmen und die ursprüngliche Schutzinvariante weiter testen.
- **`Canonical release identity mismatch`:** neue FINAL-Serie und zugehörige Build-/Revisionskennungen strikt validieren, nicht den Guard entfernen.
- **Workflow startet nicht:** Workflow-Datei auf auslösendem Branch, `on.push.branches`/`paths`, alten `main`-SHA und das Push-Ereignis überprüfen. Ggf. neuen Request-Branch **vom aktuellen** `main` erzeugen.
- **Lokaler `ClientError` / DNS-Fehler:** GitHub-Connector für Dateibearbeitung und GitHub Actions für tatsächliche Tests/Archive einsetzen. Keine bloße Abbruchmeldung wegen lokaler Umgebung.

Die Diagnose zu V4.13 ist in [GR_413_FINAL_BLOCKERS_AND_AGENT_RUNBOOK_2026-11-24.md](GR_413_FINAL_BLOCKERS_AND_AGENT_RUNBOOK_2026-11-24.md) dokumentiert. **Diese Anweisung autorisiert keine Umgehung unverzichtbarer Sicherungs- oder Freigabegates.**
