# GewitterRadar V4.11 FINAL – Abschlussstatus der selbstständig ausführbaren Arbeiten

**Stand:** 19.11.2026 · **Kandidat:** `TheDaimos/gewitterradar@release/v4.11-final-prep` · **letzter technischer Commit:** `b4b32599dc9317f8a457a1c027c7568c5a4492af`

## Fertig und überprüft

- Die Gemeinschaftslizenz **Modell B** ist für die neue Veröffentlichungs-Branch als `LICENSE` vorbereitet; `COPYRIGHT.md`, `BRANDING.md` und README nennen als ursprünglichen Urheber nur **Christian Köhler**. Der unveränderte historische GPL-3.0-only-Lizenztext bleibt unter `docs/licenses/GPL-3.0-only-historical.txt` erhalten. Frühere GPL-Rechte werden nicht rückwirkend aufgehoben.
- Die bisherige GPL-Erläuterung wird in der **aktuellen Offline-Projekthilfe** durch die Modell-B-Beschreibung in **15 Projektseiten-Sprachen** ersetzt; die volle Lizenz liegt zusätzlich unter `/gewitterradar/help/LICENSE`. Beide Paket-Mirrors werden vom normalen Build synchronisiert.
- Neues maschinelles Release-Gate `scripts/test-v411-final-license-help.mjs` **PASS**: Lizenzidentität, Archivtext, Sprachabdeckung, Help-/Asset-Spiegel.
- Die **31** untersuchten V4.11-Skripttests sind nachvollziehbar getrennt: **23 aktuelle Regressionsprüfungen PASS** über `scripts/test-v411-final-active-gates.mjs`; **8 versionsgebundene historische Tests** (4.11.34–.39, .77, .212) bleiben unverändert erhalten und werden nicht fälschlich als aktuelle Gates ausgegeben.
- Beide neuen Gates sind zusätzlich in der öffentlichen `.github/workflows/validate.yml` eingebunden, nur wenn die jeweiligen Testdateien im Checkout vorhanden sind.
- `node scripts/build-frontend.mjs`, `node scripts/verify-current-frontend.mjs`, `node scripts/test-frontend-build.mjs` **PASS**.
- `python scripts/verify-hacs-integration-package.py` **PASS:** 235 dateigleiche HACS-Installationsdateien im Kandidaten.
- Alle Frontend-Hashes und DRA-Verträge des unveränderten Ausgangsstands **PASS**: 37 registrierte Module, 195 Frontend-Dateien.
- Aus Basis-Commit `a70a4da38b993427067ad741d5b1f06758493c18` wurde ein verifizierter PRE_MERGE-Quellarchiv-Probelauf (ZIP und Git-Bundle) mit Prüfsummen erzeugt. **Das ist ausdrücklich kein FINAL-Golden-Master.**

## Noch kein PUBLIC FINAL: zwingende externe bzw. Release-spezifische Gates

1. **CI-Nachweis:** Die GitHub-Actions-Jobs unter Python 3.14 und Home Assistant 2026.9 müssen für den exakten Kandidaten grün nachgewiesen werden. Lokal wurde die Python-Suite mit dem verfügbaren **HA 2025.1**-Harness nicht gesammelt, weil aktuelle HA-2026-APIs fehlen. Das ist kein Produkttestfehler und kein PASS.
2. **Reale DEV-Installation:** Der abschließende HACS-/DRA-Installations- und Rollback-Test auf **HA DEV VM109** muss von der erreichbaren Testumgebung bestätigt werden. Die frühere Betreiber-Sichtabnahme wird nicht unnötig wiederholt.
3. **FINAL-Metadaten:** Der geschützte Stand bleibt `4.11.243 DEV / HA 0.25.150`. Das endgültige FINAL-Versionsformat, Cache-/Build-Identität, HA-Version, DRA-Provenienz, Release Notes und FINAL-Golden-Master müssen **gemeinsam** erstellt und im CI geprüft werden; vorab gibt es kein tagbares FINAL-Artefakt.
4. **Veröffentlichung:** Erst nach diesen Nachweisen auf die stabile Publikationslinie bringen, HACS-/DRA-Artefakte verifizieren und mit eindeutigem Tag veröffentlichen. Die GitHub-Anbindung in dieser Sitzung konnte zwar Branches/Commits schreiben, aber keinen GitHub Release auslösen oder einen vollständigen Workflow-Abschluss nachweisen.

## Schutz und Entscheidung

**NO-GO für die öffentliche FINAL-Veröffentlichung bis zur Erfüllung der vier verbleibenden Gates.** Der Kandidatenbranch ist fertig vorbereitet und testseitig deutlich bereinigt; der DEV-Referenzstand und **PROD VM101** bleiben unverändert. Es wurden keine funktionalen oder visuellen Wetter-, Eye- oder Provider-Änderungen vorgenommen.
