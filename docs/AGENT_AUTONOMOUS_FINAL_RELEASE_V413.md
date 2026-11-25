# DAIMOS – Autonomer FINAL-Release: Ausführungsregeln und V4.13-Erfahrungsakte

Stand: 2026-11-25. Dieses Dokument ergänzt `AGENTS.md`, `docs/FINALIZATION_RUNBOOK.md`, `docs/FINAL_RELEASE_AUTOMATION.md`, `docs/RELEASE_PROCESS.md` und `docs/GOLDEN_MASTER_POLICY.md`; es ersetzt weder Betreiberfreigaben noch Schutzregeln.

## Verbindlicher Auftrag für Entwicklungsagenten

**Eine FINAL-Beauftragung ist ein Ende-zu-Ende-Ausführungsauftrag, kein Analyse- oder Statusbericht.** Ein Agent muss die nachweislich autorisierten und technisch möglichen Schritte selbstständig in einer laufenden Sitzung bis zu einem überprüfbaren Endzustand abarbeiten. Keine Rückfrage nach jedem Prüffehler. Ein Fehler bedeutet: Log lesen → Ursache feststellen → kleinste sichere Korrektur → committen → alle durch die Korrektur ungültig gewordenen Tests auf dem **neuen exakten SHA** erneut ausführen → Release-Ablauf fortsetzen. Keine bloße Ankündigung „anschließend erneut testen“.

**Definition von fertig:** FINAL-Tag auf verifiziertem `main`-SHA, offizielles nicht als Draft markiertes Release mit geprüften Installationsartefakten, passendem Golden Master samt Checksummen, erfolgreiche erforderliche CI auf genau dem Release-SHA, und Beleglinks zu Commit/Run/Tag/Assets. Nur ein green build, Merge, PR oder vorbereitetes Paket ist nicht fertig.

## Strikter Zustandsautomat (fail-closed)

1. Freigegebenen Kandidaten und Release-Scope, Schutzreferenzen, Versionen, `main`- und DEV-HEAD aufnehmen; kein fremdes parallel laufendes Feature hineinziehen.
2. Vor Änderung von `main`: PRE-MERGE-Sicherung des **exakten alten main-SHA** mit Source-ZIP, vollständigem Git-Bundle, SHA256; externes Off-GitHub-Exemplar materialisieren und **zurücklesen und erneut hashvergleichen**. Eindeutigen Nachweis dokumentieren.
3. FINAL-Identität, Build, HACS-/Frontend-Paket, Spiegelparität, Quellarchive, Hi-Res und Diagnose mit echten ausführbaren Tests prüfen. Browser-/Geräteprüfungen nur als bestanden deklarieren, wenn wirklich ausgeführt und belegbar.
4. Kandidat in `main` kontrolliert mergen, HEAD erfassen, alle erforderlichen Post-Merge-CI-Gates auf exakt diesem SHA prüfen. Nur mit auswertbaren Ergebnissen fortsetzen.
5. Über den existierenden `gr-release-final.yml`-Workflow auf dem exakten `main` veröffentlichen; dieser wiederholt Identitäts-, Sicherungs-, CI-, Golden-Master-, Quell- und Paketprüfungen und publiziert erst danach `vX.YY`.
6. Offizielles Release, Tag-Ziel-SHA, Anzahl und Prüfsummen der Assets und `main`-Identität erneut per API prüfen. Ergebnis als PASS oder BLOCKED mit präzisem Grund, letzter erfolgreicher Stufe und reproduzierbarem Wiederanlaufpunkt dokumentieren.

## Schnittstellen-Fallback – nicht beim ersten Fehler aufgeben

- Kein lokales DNS, fehlendes `gh` oder fehlende lokale Python-Abhängigkeit ist **nicht automatisch** ein Code- oder Release-Blocker. GitHub-Connector zum Lesen/Schreiben/PR-Merge nutzen; für Builds und Release GitHub Actions auf Runnern mit korrekten Abhängigkeiten.
- Fehlt im Connector die Aktion `workflow_dispatch`, vorhandene kontrollierte `publish-request.json`-PR verwenden. Nur wenn der dokumentierte Trigger und seine Gates tatsächlich geprüft sind, mergen.
- Lässt sich ein Runner-/CI-Fehler minimal beheben, Änderung auf dafür geeignetem Branch vornehmen und auf dem **neuen Commit** vollständig nachtesten. Nie auf veraltete grüne Ergebnisse verweisen.
- **Keine Endlosschleife:** Bei identischem Fehler ohne neue diagnostische Erkenntnis gezielt Logs, Runner-Umgebung, Permissions, Inputs und Artifacts prüfen; keine Blind-Reruns. Bei fehlender Berechtigung oder ausdrücklicher Freigabe nicht umgehen, sondern exakt benennen.

## Schutz und Parallelität

- `deploy/dev` und Features (z. B. MA-003) während FINAL nicht ungefragt verändern. `main`, Release-SHA und Golden Master dürfen nach Freigabe nicht stillschweigend neu geschrieben werden.
- Private WeatherRouter-Actions nicht aktivieren; PROD/VM101 und freigegebene Referenzen unverändert lassen.
- Bei aktivem `gr-final-publish`-Lauf keine anderen Commits auf `main` erzeugen. Der Release-Workflow prüft ausdrücklich, dass `origin/main` == `GITHUB_SHA`.
- Nicht-geprüfte UI-/Browserergebnisse niemals als reale Abnahme ausgeben.

## Erfahrungsakte V4.13 (25.11.2026)

- Unabhängiger PRE-MERGE-Stand: `0bbb47772667c8ff252157ac6a6fab269877a0d6`, Actions-Run `45496499861`. Externe ChatGPT-Library-Kopie laut `GR_V413_INDEPENDENT_PREMERGE_BACKUP.md` mit erneuter SHA256-Prüfung bestätigt; ZIP `c28e8c71251bffb2264a6f223746a9809b8d2694b2570f7a0ad50436bb2c8642`.
- V4.13 FINAL-Kandidat via PR #43 gemergt: `a37d4b2ad22a0c2541d25edd97dc53b4cfa3264d`. Post-Merge-Checks für Frontend, HA-Integration, Hi-Res, Diagnose und Pages bestanden.
- Der Publikations-PR #44 enthielt ausschließlich `docs/release-control/publish-request.json` mit version `4.13`, HA `0.25.186`, altem SHA, PRE-MERGE-Run und `independent_backup_verified: true`. Alle überprüften PR-CI-Gates erfolgreich.
- PR #44 wurde am 25.11.2026 mit erwartetem Head `94cc165e9d1c5856a787f57006b7fd54707435c6` gemergt, neuer `main`-Commit `509daeb7245f42b23e46f72b4d002c42f0d7f56e`.
- GitHub Actions `GR FINAL publish (exact main)`, Run `45576565922`, wurde automatisch gestartet. **Zum Zeitpunkt dieser Aktenanlage war der Lauf noch aktiv; daraus folgt keine Behauptung über einen erfolgreichen Tag oder Release.** Nach Abschluss Status und Asset-Nachweis gesondert ergänzen.
- Beobachteter operativer Fehler früherer Chats: vorhandene Regeln und Berechtigungen wurden zwar beschrieben, aber durch Statusberichte statt konkreter GitHub-Aktionen nicht in ein FINAL-Release umgesetzt. Gegenmaßnahme: Runbook als ausgeführten Zustandsautomaten behandeln, jeden Blocker selbst beheben und nicht nach Korrektur beim Zwischenstand abbrechen.

## Abschlussprotokoll – Pflichtfelder

Release-Version; HA-/Frontend-/Runtime-Identität; finaler `main`-SHA; PRE-MERGE-SHA und Offsite-Hash; PR/Merge-Link; Kandidaten- und Post-Merge-CI-Run-IDs; FINAL-Workflow-ID/Ergebnis; Golden-Master-Asset/Hashes; HACS- und Dashboard-Paketnamen/Hashes; Tag-SHA; offizieller Release-Link; noch offene reale Betreiber- oder DEV-Abnahmen. Alle Felder belegen; unbekannte Angaben ausdrücklich als offen markieren.

**Wiederanlaufregel:** Wenn Lauf abbricht, Ursachen und genaue fehlgeschlagene Stufe nachweisen, minimal reparieren, die dadurch ungültigen Prüfungen wiederholen und ohne erneuten generischen Auftrag bis zum Endzustand weiterarbeiten. Sicherungen, die weiterhin zum exakt gleichen alten SHA gehören und verifiziert sind, nicht unnötig neu herstellen.
