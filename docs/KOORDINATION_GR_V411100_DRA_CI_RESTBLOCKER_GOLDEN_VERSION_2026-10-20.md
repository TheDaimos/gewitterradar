# GR WL-02 – Koordination: letzter nachgewiesener CI-Blocker vor DRA-DEV-Testinstallation

**Datum:** 20.10.2026  
**Empfänger:** **GR – Gewitterradar-Entwicklungschat**  
**Repository/Zweig:** `TheDaimos/gewitterradar@deploy/dev`, keine zusätzlichen Entwicklungszweige.  
**Ziel:** V4.11.100 DEV, kontrollierter **DEV-TEST-Kandidat**, Home-Assistant-Integration 0.25.18. **Keine eigenmächtige DRA-Installation oder HA-REAL-PASS.**

## 1. Verbindlichen bisherigen GR-Bericht lesen

Lies vollständig die bereits vom GR-Entwicklungschat verfasste und geprüfte Antwort:

[GR_WL02_V411100_DEV_TEST_CI_GATE_DRA_HA_2026-10-20.md](GR_WL02_V411100_DEV_TEST_CI_GATE_DRA_HA_2026-10-20.md).

Die bereits erfolgte Versionsanhebung zum Entwicklungs-Testkandidaten (`42a222544d552e7e83643df7d03c89324e0cd692`) **nicht wiederholen**. Die erste historische Modulset-Fingerabdruckprüfung in `scripts/test-v40756-settings-help.cjs` wurde mit Commit `a95463eb95f4daeaa31b9f1e66586423b5934c53` korrigiert. Diese Prüfung war danach erfolgreich; auch alle übrigen 10 Browserprofile dieses Tests sind in den neuen vollständigen Frontend-Logs **PASS**.

## 2. Neue unabhängige GitHub-Prüfung der drei Runs

Für exakt **`a95463eb95f4daeaa31b9f1e66586423b5934c53`** sind die Läufe **jetzt alle beendet**:

| Prüfablauf | Run-ID | Tatsächlicher Zustand |
|---|---|---|
| V4.11.100 Settings-/Runtime-Identität | [39387873647](https://github.com/TheDaimos/gewitterradar/actions/runs/39387873647) | **SUCCESS**, Einzeljob `118512006466` |
| Validate Gewitterradar Integration | [39387873638](https://github.com/TheDaimos/gewitterradar/actions/runs/39387873638) | **SUCCESS**, Einzeljobs `118512006156`, `118512006370`, `118512006519`, `118512006619` |
| Validate shared Gewitterradar frontend | [39387873805](https://github.com/TheDaimos/gewitterradar/actions/runs/39387873805) | **FAILURE**, Einzeljob `118512007222` |

Das **vollständige** Fehlerprotokoll des Frontend-Jobs wurde unabhängig gelesen. Die vorhergehenden Browser- und Auslieferungsschritte liefen: Sprachpaket-/Onboarding-/Settings- und Medaillon-Prüfungen zeigen PASS. Der tatsächliche Abbruch erfolgt erst in

`node scripts/verify-about-golden-v408.cjs ...`

mit

`AssertionError [ERR_ASSERTION]: Frontend is not covered by V4.09/V4.10 historical or V4.11 DEV identity contracts`

am bestehenden Skript **Zeile 279**. **DRA-Installationsprüfung und vollständiger CI-Gate sind damit noch nicht grün**. Alle alten FAIL-Läufe bleiben dokumentierte FAIL-Läufe, auch wenn die nachfolgende Korrektur grün wird.

## 3. Genau nachgewiesene Ursache im aktuellen Repository

Direkte Rücklesung `scripts/verify-about-golden-v408.cjs` aus `deploy/dev`, Blob `323cfc6d72257faf192fe7644828ade00301d670`:

- `isV411LatestDev` erkennt die `frontend/gewitterradar.js`-Importkennungen **`41191r1` bis `41199r1`** (und prüft `CARD_VERSION=APPLICATION_META.version;`).
- Eine neue `411100r1`-Kennung ist in dieser **historisch expliziten** Menge noch nicht vorgesehen.
- Ohne irgendeine passende Branch-Kennung gelangt der Test an `assert.fail(...)` in Zeile 279, obwohl der echte Modulset-/Runtimestand nicht durch diese Fehlermeldung widerlegt ist.
- Die historische V4.09-/V4.10-/V4.07.56-Golden-Geometrie bleibt unabhängig geschützt und darf **nicht deaktiviert oder übersprungen** werden.

Tatsächlich lesend bestätigte neue Frontend-Identität:

| Datei | Tatsächlicher Inhalt |
|---|---|
| `frontend/gewitterradar.js` | `import { APPLICATION_RELEASE } from "./version.js?v=411100r1";`; `CARD_VERSION=APPLICATION_META.version;` |
| `frontend/version.js` | `version:"4.11.100"`, `displayVersion:"V4.11.100 DEV"`, `build:"V4.11.100-DEV-2026-10-20"`, `runtimeRevision:"411100r1"`, `moduleSetId:"E411-100A1"`, `integrationVersion:"0.25.18"` |
| `frontend/assets/gewitterradar-runtime-manifest.json` | `productVersion:"4.11.100"`, `runtimeRevision:"411100r1"`, `moduleSetId:"E411-100A1"`, **34 Module** |

Der nach Dokumentationsstand zuletzt geprüfte `deploy/dev`-HEAD ist `3338b1069a7282898a00c5fc20d2fb5aa7ed7f41`. **Vor Codeänderungen erneut HEAD prüfen**, da parallel laufende Entwicklungsfenster nicht ausgeschlossen werden dürfen.

## 4. Eng begrenzter GR-Auftrag

**Priorität 1:** Den tatsächlich nachgewiesenen Versionsfall `4.11.100` im historischen `verify-about-golden-v408.cjs` **ohne zusätzliche Architektur und ohne Entschärfung** der Golden-/Pixel-/Hash-/Geometrieprüfungen unterstützen. Bestehende finale V4.09-/V4.10-Verträge und alte V4.11-Gates unangetastet lassen. Die Erweiterung soll mindestens die aktuelle neue Versions-/Build-/Runtime-/Modulsetidentität mit realen Daten **explizit prüfen**, nicht bloß den `assert.fail` entfernen. Ob ein eng begrenzter zusätzlicher Zweig oder ein wartungsfähiger Versionsvalidator die beste Umsetzung ist, anhand des aktuellen Projekts selbst entscheiden.

**Priorität 2:** Den aktualisierten Prüflauf vollständig ausführen, einschließlich des zuvor rot gewordenen Frontend-Workflows. Tatsächliche vollständige neue Run-/Job-IDs und Ergebnisprotokolle dokumentieren, außerdem Integrations-, Identitäts-, Asset-/Prüfsummen- und Auslieferungsspiegel entsprechend dem auf GitHub verbindlichen GR-DRA-Testgate kontrollieren. Ein ehemaliger roter Lauf wird nicht durch bloßes Aktualisieren des Berichts grün.

**Priorität 3:** Erst wenn alle erforderlichen Prüfungen **für den exakt zu installierenden Commit** grün sind, die Eignung als **kontrollierter DRA-HA-DEV-Testkandidat** erneut bewerten und die Installation mit Ref `deploy/dev`, konkreter vollständiger SHA, echter neuer Version, HA-Integration, bestätigtem Rollback und Sicherheitsstatus vorschlagen. **Nicht automatisch installieren**, nicht auf HA PROD ausführen und nicht ohne echte korrelierte WR/GR-Wetterkacheln einen HA-REAL-PASS behaupten. Prüfen, ob die Bezeichnung `DEV-TEST` nur die Rolle des Pakets beschreibt, während `displayVersion` bewusst `V4.11.100 DEV` lautet; diese Kennzeichnung nicht blind ändern.

**Priorität 4:** Nach kontrollierter, vom Benutzer ausdrücklich genehmigter Installation WR-V1-Wolken `weather.satellite.clouds` und Wind `weather.model.wind_10m.layer` auf echtes `ready/raster_tile`, Pixel, UTC/Provenienz, NoData, Grenzen und das gemeinsame Kachelbudget prüfen; `unavailable` ehrlich darstellen. OPERA F7 ist ein **separater** WR-Strang und kein zwingender Blocker für GR-WL-02-DEV-Tests.

## 5. Pflichtkommunikation

Den vollständigen technischen Arbeitsbericht mit den tatsächlichen Ergebnissen als **echte `.md`-Datei im privaten `TheDaimos/gewitterradar@deploy/dev/docs/` committen**, anschließend **aus GitHub erneut lesen und verifizieren**. Dem Benutzer danach **ausschließlich einen einzigen kopierbaren Satz mit der vollständig ausgeschriebenen echten GitHub-Direktadresse** geben. Keine Behauptung einer vollständigen CI-, DRA- oder HA-Freigabe ohne belegte grüne Nachweise.

**C.K. – Eine Idee weiter gedacht.**
