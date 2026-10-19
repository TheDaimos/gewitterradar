# V4.11-WL-02 – Prüfung des öffentlichen GitHub-Actions-Laufs und technische Übergabe

**Datum:** 19.10.2026  
**Repository:** `TheDaimos/gewitterradar` (**öffentlich** laut GitHub-Repositorymetadaten), Entwicklungszweig ausschließlich `deploy/dev`.  
**Stand:** letzter vorliegender Dokumentationscommit `b606ba5902ddfb5522934cbfe7999996996149bf`; WL-02 produktiver Code u. a. `baca8930b92ff5106a29f6048baa6d7ebd183ba6`; Workflow-Anpassung `405ea95781f3fe8d2adeb845c76a649492c0ba0b`.

## 1. Tatsächlich geprüfter öffentlicher CI-Zugang

Der bereits vorhandene öffentliche Prüfablauf ist `.github/workflows/validate.yml` mit dem Namen **Validate Gewitterradar integration**, Trigger `push`, `pull_request`, `workflow_dispatch`. Die vorhandenen Schritte `hacs-integration`, `hassfest`, `package-contract` und `home-assistant-runtime` wurden durch die vorherige WL-02-Änderung nicht ersetzt. Im `package-contract`-Auftrag stehen die zwei bestehenden Node-Tests:
`node --test tests/wl02-coverage-contract.test.mjs tests/wl02-raster-geometry.test.mjs`.

**Explizite Run-Abfrage:** GitHub-Verbindung `fetch_commit_workflow_runs(repo_full_name='TheDaimos/gewitterradar', commit_sha='b606ba5902ddfb5522934cbfe7999996996149bf')` -> `workflow_runs: []`; `get_commit_combined_status` -> `statuses: []`. **Die erste Methode beschränkt sich vertraglich auf Pull-Request-getriggerte Läufe und kann daher Push-Läufe nicht auflisten.** Die Ergebnisse belegen **weder** einen fehlgeschlagenen **noch** einen erfolgreichen Push-Lauf.

Versuch einer unabhängigen öffentlichen Abfrage unter `https://api.github.com/repos/TheDaimos/gewitterradar/actions/workflows/validate.yml/runs?branch=deploy%2Fdev&per_page=5` über Web und die lokale HTTP-Anbindung: Webabruf nicht zugänglich, lokal DNS-Fehler `Failed to resolve 'api.github.com'`. Der Aufruf der öffentlichen GitHub-Actions-Weboberfläche war ebenfalls nicht abrufbar. **Keine Workflow-Run-ID, kein Workflow-Status, kein Job-Protokoll oder bestätigter CI-PASS liegen vor.** Es wurde **kein privater GitHub-Actions-Lauf** gestartet; ein bestehender Workflow wurde nicht erneut verändert.

## 2. Wirklich ausgeführte Tests

**In diesem Bearbeitungsschritt wurde kein vollständiger Repository-Test ausgeführt.** Ein vollständiger Checkout/Download des Repositorys über das Container-Netz scheitert an der GitHub-DNS-Auflösung. Der GitHub-Connector erlaubt Einzeldateien, liefert aber keinen als lokales Dateisystem eingebundenen Repository-Checkout. Beide WL-02-Node-Testdateien sind per GitHub-API eingesehen worden, ihre bloße Existenz ist kein Test-PASS.

GR-RF-01 bis RF-04, P7-010, NASA-/DWD-/V1-/V2-/Niederschlagsregressionen wurden ebenfalls **nicht ausgeführt**. Kein Testlauf wird erfunden oder als bestanden ausgegeben.

## 3. Konkrete verbleibende WL-02-Funktionsmängel

1. **Gemeinsame Budgets:** `GENERIC_TILE_BUDGET` begrenzt Wolken- und Wind-Bildanfragen zusammen auf acht, **nicht** den vorhandenen P7-010-Niederschlags-Scheduler. Warteschlange, Bildspeicher, Lastfairness und Gesamtdrosselung sind unvollständig.
2. **Browser-Sicherheit und Formate:** Die Canvas-Bildladung setzt `crossOrigin='anonymous'` voraus. CORS-Freigaben der echten ausgewählten WR-V1-Provider, WMS-/XYZ-Vorlagen und tatsächlich darstellbare bzw. fehlschlagende Bilder sind noch nicht verifiziert.
3. **Abdeckung/NoData:** Wiederverwendung von `rasterTilePixelCrops` im generischen Adapter; geometrische Korrektheit, transparentes NoData, Antimeridian sowie globale Coverage sind noch nicht gegen echte Browserbilder und WR-Responses abgenommen.
4. **Status und Fachinformation:** Exakte Bildvollständigkeit, Datenalter-/Aktualitätsklassen, quellenspezifische Lizenz und verlinkte echte Legenden sind noch nicht vollständig nachgewiesen.
5. **Lebenszyklus:** Bewegung/Zoom/Sichtbarkeit und Abbruch sind teilweise implementiert; Kartenersetzung, Wiederverbindung und vollständige Aufräum-/Zeitgrenzen erfordern weitere Laufzeittests.
6. **Konsistente Auslieferung:** Die geänderten Dateien im Frontend sind noch nicht in allen installierbaren Spiegeln/Manifesten/Versionsständen mit vollständigen Prüfsummen nachgewiesen. Keine installierbare neue DEV-Version.

## 4. Freigabeentscheidung

| Kriterium | Ergebnis |
| --- | --- |
| WL-02 CODE-PASS | **OFFEN** |
| Ausgeführte WL-02-Node-Tests | **KEIN NACHWEIS** |
| GR-RF-01–04/P7-010/Niederschlag-Regressions-PASS | **KEIN NACHWEIS** |
| Öffentlicher CI-PASS, `validate.yml`, `deploy/dev` | **NICHT VERIFIZIERBAR** |
| GitHub-Actions-Run-ID und erfolgreicher Run-Status | **NICHT VERFÜGBAR** |
| HA-REAL-PASS | **OFFEN** |
| Neue DEV-Version/DRA-Installation | **NICHT FREIGEGEBEN** |

Die technische Entwicklung bleibt offen. Keine neuen Entwicklungszweige, keine Änderung an WeatherRouter, WL-03/WL-04 oder am bestehenden Niederschlagsrenderer. Die bereits akzeptierte öffentliche Workflow-Erweiterung bleibt unverändert. Eine Versionserhöhung ohne belegten CODE- und öffentlichen CI-PASS ist ausdrücklich untersagt.

**C.K. – Eine Idee weiter gedacht.**
