# GewitterRadar – verbindlicher Entwicklungs-Bootstrap

> **AKTUELLE OFFIZIELLE GESCHÜTZTE REFERENZ (Betreiberfreigabe 13.11.2026):** [WR 0.10.320 DEV / Loader 323 + GR 4.11.195 DEV / HA 0.25.102](WR_GR_PROTECTED_REFERENCE_PAIR_010320_411195_2026-11-13.md). Vor jeder Weiterentwicklung dieses Referenzpaar lesen, exakte Versions- und Commit-Identitäten beachten, geschützte Funktionen nicht regressieren. Ein neuerer Branch-HEAD ist nicht automatisch eine neue Freigabe.


**Pflicht vor jeder substantiellen Änderung, auch nach Chatwechsel.** Nicht allein auf ChatGPT-Memory oder ältere Chatübergaben vertrauen.

1. Aktuellen HEAD von `deploy/dev` des **eigenen und des Partner-Repositories** prüfen; installierte Version und reale Freigabe getrennt behandeln.
2. **Zuerst** [Modul-/Provider-Regressionsschutz](MODULE_PROVIDER_ISOLATION_GUARD_2026-11-13.md) lesen; die Schutzregeln gelten zugleich für WeatherRouter **und** GewitterRadar.
3. Partnerregel lesen: [WeatherRouter](https://github.com/TheDaimos/weather-router-dev/blob/deploy/dev/docs/MODULE_PROVIDER_ISOLATION_GUARD_2026-11-13.md).
4. Bestehende Verträge, geschützte Referenzen und aktuelle offene Abnahmeberichte lesen; sie ersetzen keine Quellcodeprüfung.
5. Vor Änderungen dokumentieren, welche **anderen** Module/Provider unbeabsichtigt betroffen sein könnten. Änderungen additiv und rückwärtskompatibel gestalten; zugehörige Regressionen ausführen.
6. Neue Version und DRA-Metadaten korrekt erzeugen. Keinen neuen „Referenzstand“ ohne reale Betreiber-Abnahme ausrufen. PROD VM101 nie ungefragt ändern.
7. Technische Prüfungen und tatsächliche HA-DEV-Realabnahme unterscheiden. Keine behauptete Testausführung ohne Beleg.
8. Bei fehlender Zugänglichkeit/Unsicherheit das offen benennen; niemals stillschweigend Schutzregeln weglassen.

**Wichtig:** Keine Weiterentwicklung von Hoch/Tief, Fronten, Isobaren oder beliebigen neuen Modulen darf die bereits funktionierenden Niederschlags-, Wind-, Temperatur- und UI-Module einschränken. Gleiches gilt umgekehrt. Diese Regel wird erst mit echten ausführbaren Regression-Gates technisch erzwungen – dieser Einstieg allein ist kein Gate.

**Original-Export2Git:** privates `TheDaimos/Project-Log-And-Export@main`.

## Release-/DNS-Fallback für neue Entwicklungschats (Pflicht)

Vor jeder Version-FINALisierung **[FINAL_RELEASE_AUTOMATION.md](FINAL_RELEASE_AUTOMATION.md)** lesen. `main` führt die remote GitHub-Actions-Workflows `gr-release-premerge.yml` und `gr-release-final.yml`; sie benötigen kein lokales DNS im Chat. GitHub-Connector für SHA-Checks, Branches, Commits und PR/Merge nutzen; bei fehlendem Workflow-Dispatch die dokumentierten PRE-MERGE- und Publish-Request-PRs verwenden. Exakte CI, PRE-MERGE-Offsite-Sicherung, geschützte Referenzen und Golden Master bleiben zwingend. Nichts als FINAL melden, bevor ein tatsächliches offizielles Release belegt ist.

## V4.13 FINAL – gesicherte Analyse statt erneuter Ursachen-Ratesuche

Bei jeder V4.13-FINAL-Aufgabe zuerst [diese verbindliche Fehler- und Übergabeakte](GR_413_FINAL_BLOCKERS_AND_AGENT_RUNBOOK_2026-11-24.md) lesen. Vorhandenen PRE-MERGE-CI-Run und Betreiberabnahme wiederverwenden, unverifizierte externe Sicherung nicht bestätigen, veraltete versionsspezifische Release-/Build-Gates nach Repo-Befund **selbstständig additiv aktualisieren**. Ein lokaler ClientError ist kein Beleg für einen Quellcodefehler und keine automatische Abbruchbegründung. Produktcode, Protected-Pairs und PROD unverändert lassen, sofern nicht ausdrücklich erforderlich und freigegeben.
