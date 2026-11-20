# V4.11-WL-02 – Entwicklungsstand nach öffentlicher CI- und Budgetprüfung

**Datum:** 19.10.2026  
**Repository/Zweig:** `TheDaimos/gewitterradar@deploy/dev`  
**Entscheidung:** **NICHT FREIGEGEBEN – kein CODE-PASS, kein öffentlicher CI-PASS, kein HA-REAL-PASS.**

## Vorhandene Bestandteile unverändert übernommen
Die bereits bestätigten Implementierungen `933cffb1` (Canvas-Pixelzuschnitt), `6140983d` (Tile-Abbruch), `6d204b25` (Geometrietests), `2eafcb18` (Alter/Status) sowie die älteren WL-02-Änderungen wurden nicht erneut eingeführt. Die bestehende Niederschlagsimplementation und WeatherRouter-Provider wurden nicht bearbeitet.

## In diesem Arbeitsabschnitt tatsächlich geändert
- **`baca8930b92ff5106a29f6048baa6d7ebd183ba6`**: Die vormals unabhängigen parallelen Bildbudgets der zwei generischen WL-02-Ebenen werden durch eine *gemeinsame* Obergrenze von acht gleichzeitig aktiven Bildanfragen für **Wolken und Wind zusammen** ersetzt. Das ist **noch kein mit dem Niederschlagsrenderer geteilter Haushaltsplan**. Seine separate P7-010-Schutzlogik bleibt unverändert. Für produktive Freigabe fehlen eine gerechte Warteschlange, gemeinsame globale Obergrenzen, Speicherbegrenzung und entsprechende Regressionstests.
- **`405ea95781f3fe8d2adeb845c76a649492c0ba0b`**: Die bereits existierende öffentliche Pipeline `.github/workflows/validate.yml` des als **öffentlich** ausgewiesenen Repositories `TheDaimos/gewitterradar` wurde um den Aufruf `node --test tests/wl02-coverage-contract.test.mjs tests/wl02-raster-geometry.test.mjs` erweitert. Ein neuer Workflow wurde **nicht** angelegt. Das Repository `TheDaimos/gewitterradar` wurde durch die GitHub-Repositorysuche ausdrücklich als `visibility: public` ausgewiesen. Keine Daten wurden in ein weiteres Repository übertragen. Der private Entwicklungszweig `deploy/dev` bleibt der einzige Entwicklungszweig.

## Test- und CI-Wahrheit
- `tests/wl02-coverage-contract.test.mjs` und `tests/wl02-raster-geometry.test.mjs` sind im GitHub-Repository gespeichert.
- **Kein erfolgreich ausgeführter lokaler Test nachgewiesen.** Direkte Container-Git-Verbindung zur öffentlichen GitHub-Domain lieferte `Could not resolve host: github.com`. Der GitHub-Connector kann Einzeldateien lesen/schreiben, stellt aber in diesem Ausführungskontext keinen automatischen vollständigen lokalen Checkout bereit.
- Das GitHub-Werkzeug `fetch_commit_workflow_runs` ist nach seiner Beschreibung auf PR-ausgelöste Läufe begrenzt. Bei Abfrage von `405ea957...` lieferte es `[]`; die Abfrage kombinierter Commit-Statusmeldungen ebenfalls `[]`. **Das ist kein fehlgeschlagener CI-Lauf, aber auch kein CI-PASS.** Ein nachweisbarer erfolgreicher *öffentlicher* Arbeitsablauf mit Run-ID, vollständigem Testprotokoll und Endstatus liegt **nicht** vor.
- Die vorhandene Pipeline `validate.yml` führt zusätzlich Paket-, HACS-, Hassfest- und Home-Assistant-Prüfungen aus. Keine davon wurde in dieser Bearbeitung als grün bestätigt.
- **Keine Behauptung von GR-RF-01–04-/P7-010-Gesamtregressionen:** Deren automatisierte Ausführung und Vollständigkeit sind weiterhin offen.

## Technische Resthindernisse
1. **Leaflet und WR-Laufzeitvertrag:** Authentifizierte Consumer-V1-Antworten und Browser-/CORS-Nachweis (speziell Canvas-`crossOrigin=anonymous`) fehlen. Nur statische Provider-Capability-Map und GR-Quelltext wurden bisher geprüft. Ungeeignete URLs, nicht nachgewiesene Coverage oder veraltete Antworten müssen weiterhin gesperrt bleiben.
2. **Budgets:** Generische Bilder teilen sich jetzt eine WL-02-Obergrenze; die vorhandenen Niederschlags-/P7-010-Budgets sind **nicht** integriert. Kein belegtes übergreifendes Speicher- und HTTP-Budget.
3. **Darstellung und Fachvertrag:** Unvollständige NoData-/Bildpixel-Beweise, native WMS-/XYZ-Varianten, gesetzliche Lizenzbedingungen, tatsächlich verknüpfte Legenden und verlässliche Aktualitätsklassen. Ein erfolgreicher Kachelabschluss allein ist kein reales Bild- oder Karten-Vollständigkeitszertifikat.
4. **Lebenszyklus:** Kartenersetzung und HA-WebSocket-Reconnect sowie Timeout/Abbruch aller Anfragen müssen im Browser-/HA-Prüfstand nachgewiesen werden.
5. **Tests:** Fehlender lokaler Ausführungspfad sowie fehlende erfolgreiche öffentlich ausgeführte GitHub-Actions-Läufe und umfassende Regressionen. Erst nach diesen Ergebnissen ist eine konsistente neue Version mit Versionskennungen, Spiegeln, Hashes und DRA möglich.

## Zuordnung von privat und öffentlich
**Es wurde kein Quellstand eines privaten Repositories in ein öffentliches Prüf-Repository gespiegelt.** Der hier verwendete Entwicklungsstamm `TheDaimos/gewitterradar` ist laut Repositorymetadaten selbst öffentlich, mit privater bzw. nicht veröffentlichter Gegenstelle für WeatherRouter. Seine öffentliche `.github/workflows/validate.yml` wurde unmittelbar auf `deploy/dev` ergänzt. Ein erfolgreicher Workflowlauf, ein finaler Quellcode-Freeze oder eine geprüfte Build-Prüfsumme sind nicht vorhanden. Deshalb ist eine weitergehende Zuordnung „CI-PASS für exakten Auslieferungsstand“ nicht belegbar.

## Freigabe
**CODE-PASS: OFFEN** — vollständige technische Anforderungen/Regressionstests nicht erfüllt.  
**ÖFFENTLICHER CI-PASS: OFFEN** — kein erfolgreicher, korrelierter Run.  
**HA-REAL-PASS: OFFEN** — keine Installation, keine echten Bildkacheln, keine korrelierten WR-/GR-Diagnosen.  
**DRA:** **KEINE INSTALLATIONSFREIGABE**; Ausgangsversion `V4.11.99 DEV` bleibt die Referenz. Keine weiteren Versions-/Manifest-/Spiegeländerungen in diesem Arbeitsabschnitt.

Keine zusätzlichen Entwicklungszweige, keine WeatherRouter-Änderungen, keine WL-03-/WL-04-Implementierung.

**C.K. – Eine Idee weiter gedacht.**
