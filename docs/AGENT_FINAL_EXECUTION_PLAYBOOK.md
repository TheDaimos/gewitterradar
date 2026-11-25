# DAIMOS – Agenten-Ausführungsprotokoll für eigenständige FINAL-Entwicklung
**Verbindlich ab 24.11.2026 · Ergänzung zu `AGENTS.md`, `FINAL_RELEASE_AUTOMATION.md` und `GOLDEN_MASTER_POLICY.md`.**

## Oberstes Verhalten: lösen statt den Auftrag zurückgeben

Ist eine Entwicklung, Fehlerbehebung oder FINAL-Veröffentlichung vom Betreiber beauftragt, **muss der Agent die technisch zulässigen Reparaturschritte selbst ausführen**. Eine Meldung wie „Anleitung gelesen, Prüfungen rot, keine Commits, nicht veröffentlicht“ ist **kein angemessenes Arbeitsergebnis**, solange der Fehler mit verfügbaren GitHub-Schreibwerkzeugen und öffentlicher CI behoben werden kann.

Für jeden bekannten, reproduzierten technischen Fehler gilt: **Log lesen → konkreten Code oder Test gezielt korrigieren → committen → exakten neuen SHA prüfen → nächsten Fehler bearbeiten**. Dieses Schema wiederholen und echte Nachweise dokumentieren. Keine wiederholten pauschalen Statusmeldungen anstelle von Änderungen. Keine Prozent-/Zeitversprechen, keine erfundenen Testergebnisse. Dies gilt ohne erneute Rückfrage für rein technische, funktionsneutrale Reparaturen auf dem ausdrücklich beauftragten Kandidatenbranch.

**Schranken bleiben verbindlich:** kein stiller PROD-/WeatherRouter-Eingriff; kein Force-Push; keine Abschaltung echter Regressionen; kein ungeprüfter Merge nach `main`, kein Tag/Release bei roten Gates; keine fingierte Offsite-Sicherung oder externen Freigabe. Eine signifikante neue Produktfunktion oder sicherheitsrelevante Lockerung erfordert gesonderte Freigabe.

## 1. Nach einem Chatwechsel sofort ausführbaren Stand ermitteln

1. GitHub-Connector oder GitHub-API: `main`, `deploy/dev`, Release-Kandidatenbranch, letzte Commits, vorhandene PRs und existierende Tag/Releases **live** lesen. Historische SHA-Angaben sind Referenz, keine automatischen aktuellen HEADs.
2. `AGENTS.md`, `docs/PROJECT_BOOTSTRAP.md`, `docs/FINAL_RELEASE_AUTOMATION.md`, `docs/FINALIZATION_RUNBOOK.md`, `docs/GOLDEN_MASTER_POLICY.md` und versionsbezogene Fehlerakte lesen. Geschützte Referenzen und vorhandene Freigaben trennen.
3. Tatsächlich fehlgeschlagene GitHub-Actions-Jobs **inklusive Logs** abrufen. Nicht nur Workflow-/Schrittnamen kopieren. Stacktrace und Dateizeile ergeben den nächsten Editierauftrag.
4. Eine kleine **Laufmatrix** aufstellen: `Ursache | Datei/Zeile | Kandidaten-SHA | minimaler Fix | zuständiger Test/Job | erledigt ja/nein`. Nur Ergebnisse als erledigt markieren, die für den betroffenen SHA vorliegen.
5. Bei ausgefallenem lokalen Container/Python/Git-DNS direkt GitHub-Connector zum Schreiben und öffentliche GitHub Actions zum Bauen/Testen verwenden. GitHub-Connector, GitHub-Runtime und lokales Terminal sind **unterschiedliche Ausführungswege**.

## 2. Vorherige Versionsannahmen selbstständig erweitern

Sobald ein DEV→FINAL-Wechsel betroffen ist, systematisch nach historischen Versionen und Sonderfällen suchen: `V4.11`, `V4.12`, `4.12.15`, `r1`, `A1`, `FINAL`, `deploy/dev`, alten Array-/Modulzahlen und `assert.deepEqual`.

**Entscheidung je Fund:**
- **Historische, geschützte Referenz:** behalten; ggf. eigenen separaten Test gegen diese Version beibehalten.
- **Aktuelle kanonische Identitätsprüfung:** aus gültigen Metadaten ableiten und um die neue Version **streng** erweitern. Vorhandene Guards nicht einfach löschen.
- **Veralteter Produkt-/Testkatalog:** neue Funktion additiv aufnehmen, bestehende Komponenten und Reihenfolge weiter ausdrücklich prüfen.
- **Generiertes Inventar oder Hash:** aus den tatsächlichen Quelldatei-Bytes neu erzeugen und sämtliche Spiegel/Prüfsummen konsistent nachziehen.
- **Workflow-Trigger:** Branchursprung, `on.push.branches`, `paths`, `main`-SHA und Berechtigungen prüfen; Trigger bei Bedarf auf einem neuen vom aktuellen `main` abgeleiteten Request-Branch auslösen.

**Fehlendes Versionswissen ist eine Arbeitsaufgabe, kein Abbruchgrund.** Neue Negativtests müssen falsche Revisionen, Modulsets und veraltete Spiegel weiterhin ablehnen.

## 3. V4.13 FINAL – konkrete Reparatur-Reihenfolge (Stand 24.11.2026)

**Produktabnahme:** Betreiber hat die bisherige `4.13.7 DEV / HA 0.25.185` persönlich abgenommen. Keine zusätzliche Abnahme identischer Produktfunktionen erfinden oder fordern.

**PRE-MERGE:** öffentlicher Lauf [45496499861](https://github.com/TheDaimos/gewitterradar/actions/runs/45496499861) `success`; alter `main` `0bbb47772667c8ff252157ac6a6fab269877a0d6`, ZIP/Bundle/Hashes als CI-Artefakt vorhanden. **Externe unabhängige Sicherung offen** – vor `main`-Promotion echt durchführen und beweisen oder hier stoppen.

**Kandidatenbranch:** `release/v4.13-final-candidate`. Zu Beginn HEAD erneut lesen. Der ursprüngliche fehlerhafte Prüflauf [45499232264](https://github.com/TheDaimos/gewitterradar/actions/runs/45499232264) ist für SHA `54ebdc2537031611d25a9f88519090bff1f5f8bb`, **nicht** für spätere Korrektur-Commits.

### A – Hash-Metadaten: bereits gezielt bearbeitet, aber neue CI noch zu bewerten
- Fehlerlog Job `138817945258`: `scripts/build-frontend.mjs:155`: `Asset SHA mismatch assets/gewitterradar-runtime-manifest.json`.
- Der Eintrag `frontend/assets.json` zeigte `bc9a4cbd...`, während `SHA256SUMS_FRONTEND.txt` das Runtime-Manifest in drei Auslieferungspfaden mit `159f9b72b6e7365eb04b3f2bf7ed3ef116ae42f8d8163dce526641dac8fb4ca5` dokumentierte. Auf **Kandidatenbranch**, nicht auf `main` oder `deploy/dev`, wurde der veraltete Inventarwert durch den aus den vorhandenen drei Quellen konsistenten Wert ersetzt: Commit [`cd1acff5`](https://github.com/TheDaimos/gewitterradar/commit/cd1acff5eb5761a0afe8e503b7ff4cc1214d93e5). **Dies ist kein bestandener Build-Nachweis.**
- Danach den tatsächlichen Hash der kanonischen Datei auf einem Runner überprüfen: `sha256sum frontend/assets/gewitterradar-runtime-manifest.json`, `node scripts/build-frontend.mjs`, `node scripts/verify-frontend.mjs`, `sha256sum -c SHA256SUMS_FRONTEND.txt`. Falls der Hash weiterhin abweicht: Dateiinhalt, Zeilenenden und Bytes vergleichen; Inventar erneut aus dem realen Hash erzeugen. Hash-Guard niemals entfernen.

### B – Historischer Legend-Hub-Test: noch nicht korrigiert
- Fehlerlog Job `138818071710`: `scripts/test-v412-legend-model.mjs:15`. Historische Erwartung vier Einträge: `wind, precipitation, temperature, synoptic`; V4.13 liefert additiv `moon`.
- Test auf dem Kandidatenbranch so erweitern, dass die **alten vier Slots inklusive Reihenfolge** weiterhin ausdrücklich bestätigt und die fünfte Mond-Kategorie korrekt geprüft wird. Die direkt folgende `assignLegendSlot(c,1,null)`-Assertion und ggf. weitere Vierer-Annahmen prüfen. Die Fähigkeit zur Slot-Zuweisung darf nicht abgeschwächt werden; kein `skip`, kein blanket-delete. Danach `node scripts/test-v412-legend-model.mjs` und den betreffenden vollständigen GitHub-Job neu ausführen.

### C – Generische FINAL-Kennungen: noch nicht implementiert
- `scripts/build-frontend.mjs` erkennt V4.11/V4.12-FINAL über alte Sonderfälle; neue V4.13-FINAL-Identität muss **minimal additiv** erkannt werden.
- Achtung: `V4.13 FINAL` ist öffentlich zweistellig, die **interne** akzeptierte Produktidentität `4.13.7` dreistellig. Siehe V4.12 FINAL (`V4.12 FINAL`, intern `4.12.15`); `.github/workflows/gr-release-final.yml` fordert aktuell fälschlich `version:"4.13"` von `frontend/version.js`. Workflow auf getrennte kanonische öffentliche und interne Felder mit strict series match erweitern, nicht die interne Version blind abschneiden.
- HA-Integration erhält eine gesonderte eindeutig gültige Version; nach V4.12-Vorbild wahrscheinlich `0.25.186`, **vor Änderung nach GitHub-/HACS-Vertrag bestätigen**. Neues `runtimeRevision`/Modulset nur bei konsistentem Metadatenwechsel; `frontend/assets.json` dann neu berechnen.
- `scripts/verify-current-frontend.mjs`, `scripts/verify-frontend.mjs`, alle drei Frontend-Auslieferungsbäume, HA-Manifest, `build_info.py`, DRA-Provenienz, Cache-URL und Release Notes prüfen. Vorbereiten und bauen **auf Kandidatenbranch**, danach öffentliche CI auf dessen neuen SHA.

### D – Tatsächliche Promotion: nur bei vollständiger Absicherung
- Unabhängige, *außerhalb des GitHub-Repositories tatsächlich verwahrte und prüfbar wiederherstellbare* PRE-MERGE-Kopie vorliegen lassen; `independent_backup_verified=true` **niemals als Umgehung setzen**.
- PR gegen `main` inklusive dortiger Wartungsfixes sauber konvergieren; CI nach Merge für **neuen** `main`-SHA grün. Golden Master und Release erst danach. Keine implizite PROD-Installation.
- Bei externem Sicherungsblocker **alle zulässigen Kandidatenkorrekturen und CI dennoch erledigen**, dann den einen tatsächlich offenen Sicherungsschritt präzise benennen; nicht als „keine Korrekturen vorgenommen“ zurückkehren.

## 4. Kurze GitHub-Actions-Auswertungsroutine

Ist ein Lauf rot:
1. `GET /repos/TheDaimos/gewitterradar/actions/runs/<RUN_ID>/jobs` → Job-ID und `steps[].conclusion=failure` ermitteln.
2. Job-Logs holen, nach `Error:`, `AssertionError`, `Traceback`, `mismatch`, Stacktrace und betroffener Datei suchen.
3. Den **ursächlichen** Fehler editieren. Folgeschritte, die denselben Guard erneut ausführen, nicht fälschlich als unabhängige Fehler zählen.
4. Commit auf dem autorisierten Kandidatenbranch; Push triggert bestehende öffentliche CI automatisch; neue Run-ID, exakten `head_sha`, relevante Jobs und Resultate abrufen.
5. Wiederholen, bis alle erforderlichen Checks grün sind. Falls neue Fehler sichtbar werden: keine Statusmeldung ohne wenigstens Ursachenanalyse und – wo zulässig – konkrete Codekorrektur.

## 5. Unzulässige „Abschlüsse“

**Nicht ausreichend:** „Anleitung gelesen“, „Zugriff fehlt“, „lokaler ClientError“, „CI rot“, „keine weiteren Änderungen vorgenommen“, „bitte zu Codex wechseln“ – sofern GitHub-Connector/Actions einen autorisierten Reparaturweg anbieten.

**Zulässige Abschlussformen:**
- Tatsächlich abgeschlossen: Commit, tag-/main-identisches Release, prüfbare Artefakte/Hashes, grüne CI und klare Bestätigung.
- Tatsächlich externer Blocker: **alle zuvor technisch zulässigen Korrekturen umgesetzt und getestet**, genau ein belegter offener Pflichtnachweis plus sicherer nächster Schritt. Keine behauptete externe Ablage oder falsches `backup_verified`.

## 6. Gültigkeit

Diese Akte ersetzt weder den bestehenden Releasevertrag noch die Betreiberabnahme; sie **präzisiert das selbstständige Vorgehen**. Nach Chatwechsel muss sie vor jeder V4.13-FINAL-Fortsetzung gelesen werden. Der hier genannte Kandidatencommit kann sich jederzeit ändern, daher immer Remote-HEAD verifizieren. Das Bearbeiten dieser Akte selbst löst keinen Release aus.

## V4.13-Laufzeitnachtrag – Frontend CI 45501710874 (25.11.2026)

- Original-Workflow [45501710874](https://github.com/TheDaimos/gewitterradar/actions/runs/45501710874) für Candidate SHA `4f436248728f85990e9ebc4e6b7e0bb9c1f9aa19` **abgeschlossen mit failure**, nicht mehr „in progress“. `shared-frontend`-Job vollständig **success**: kanonische Identität, deterministischer Frontend-Build, Asset-/Mirror-/Hash-Vertrag und mehrere Browserprüfungen bestanden. Aura-Desktop/Portrait/Landscape bestanden.
- Der einzige fehlgeschlagene Job war `aura-v412 / aura` beim `scripts/test-v412-legend-browser.cjs:16`: Playwright `locator.isDisabled: Timeout 30000ms exceeded`, Selektor `[data-lh-key=density]`, Szenario `Legend scenario: desktop`. Dies ist **kein Hash-/Manifest-Fehler**.
- Gegenprüfung gegen `frontend/modules/weather/legend-hub-view.js`: `SYNOPTIC_UNUSED_FIELDS` enthält `density`; `openLegendConfig(owner,'synoptic')` lässt dieses Feld **absichtlich vollständig aus dem DOM weg**. Der alte Browsertest erwartete ein vorhandenes, deaktiviertes Feld. Die korrekte aktuelle Schutzinvariante lautet: Synoptik-Dichteauswahl existiert nicht; `orientation` und `foreground` bleiben bedienbar. Keine Produktcode-/UI-Abänderung nötig.
- **Tatsächliche Korrektur am Kandidatenbranch** `release/v4.13-final-candidate`: Commit [`f1263959ae3a54091f54660b97025d6643cec61e`](https://github.com/TheDaimos/gewitterradar/commit/f1263959ae3a54091f54660b97025d6643cec61e). Test ersetzt `isDisabled()` durch strengen `count()===0`-Nachweis des absichtlich entfernten Feldes. Der übrige Test bleibt unverändert; kein Test deaktiviert.
- Für diesen Commit wurden neue öffentliche CI-Läufe ausgelöst: [Frontend 45555755383](https://github.com/TheDaimos/gewitterradar/actions/runs/45555755383) und [HA 45555755180](https://github.com/TheDaimos/gewitterradar/actions/runs/45555755180). **Ihre tatsächlichen Abschlussresultate müssen vor dem nächsten Schritt live geprüft werden.** Ein grüner früherer SHA zählt nicht.
- Die unabhängige außerhalb GitHub verifizierte PRE-MERGE-Sicherung bleibt offen, unabhängig von bestandenem CI. Keine `main`-Promotion und kein `independent_backup_verified=true` allein aufgrund dieses Nachtrags.

## Praxisnachweis V4.13 vom 25.11.2026 – verpflichtend zur Wiederaufnahme

[GR_413_FINAL_EXECUTION_LESSONS_2026-11-25.md](GR_413_FINAL_EXECUTION_LESSONS_2026-11-25.md) beschreibt die **tatsächlich ausgeführten** Remote-GitHub-Korrekturschritte, den verifizierten externen Backup-Transfer in die ChatGPT-Dateibibliothek, die erfolgreiche runnerbasierte FINAL-Vorbereitung, die Versionsvertrag-Korrektur sowie die strenge automatische Wiederholung nach einem CI-Fehler. **Bei einem neuen Chat diese Datei lesen und nach dem letzten gesicherten SHA selbstständig fortfahren**, nicht nur den bisherigen Stand wiederholen. Kein Abbruch ohne weitere technische Handlung, solange eine sichere Korrektur möglich ist.
