# GR 4.11.243 DEV – technische FINAL-Gate-Prüfung

**Datum:** 19.11.2026 · **Geprüfter unveränderter Quellstand:** `TheDaimos/gewitterradar@deploy/dev`, Commit `a6d78afc3b641e76f044dddba45ff387d0c6389d` · GR `4.11.243 DEV`, HA `0.25.150`, Runtime `411243r1`, Modulset `E411-243A1`.

## Entscheidung

**Feature-Freeze: aktiv. Technisches FINAL-Gate: NO-GO, bis die unten dokumentierten Prüfdefizite abgearbeitet sind.** Kein Wechsel auf `4.11 FINAL`, kein Final-Tag, keine PROD-Installation. Die Betreiber-Sichtabnahme (Module, Mehrsprachigkeit, Icons, Menüs, Wolken-Close, Project Hub) wurde am 19.11.2026 vom Betreiber als bestanden gemeldet; sie ist ausdrücklich von diesen automatisierten Gates zu unterscheiden.

## Bestandene Prüfungen

| Prüfung | Ergebnis |
|---|---|
| `verify-current-frontend.mjs` und `verify-frontend.mjs` | PASS: 37 registrierte Module; 195 Frontend-Dateien; exakte Spiegel-/Checksum-/DRA-Metadatenparität |
| `test-frontend-build.mjs` | PASS: deterministischer Build und Fail-Closed-Delivery-Gates |
| `test-v41140-module-manifest.mjs` | PASS |
| `verify-about-locales.mjs` | PASS: 2 native und 17 externe Sprachpakete, 19 Sprachen |
| `test-about-locales.mjs` | PASS: 19 About-Sprachen und Fallback |
| `test-v411-weather-router.mjs` | PASS: 3 WeatherRouter-Contract-Tests |
| `test-v41108-project-hub.mjs` | PASS: Project-Hub-Vertrag |
| `verify-source-archive-contract.mjs` | PASS |

Die offizielle GitHub-Abfrage für den geprüften HEAD lieferte **keine Commit-Statusmeldungen und keine Workflow-Runs**. Daraus darf weder ein grünes noch ein fehlgeschlagenes CI abgeleitet werden.

## Fehlgeschlagene oder blockierte Prüfungen

| Prüfung | Tatsächlicher Befund / nächster Schritt |
|---|---|
| `test-module-registry.mjs` | FAIL: erwartet veraltete `4.10.02`, tatsächlich `4.11.243`; Testvertrag auf aktuelle Release-Identität überprüfen, ohne Produktcode zu ändern |
| `audit-frontend-i18n.mjs` | FAIL: unveränderter 4.11.223-String-Snapshot kollidiert mit späteren bewusst eingeführten Eye-Hub-/Eye-Control-Bezeichnungen (30 Abweichungspfade einschließlich 19 Titeln); Änderungen anhand der Betreiberterminologie einzeln klassifizieren und Baseline nachvollziehbar aktualisieren |
| `test-v407-full-i18n-candidate.mjs` | BLOCKED: historisches `artifacts/v407/gewitterradar.js` fehlt |
| `test-v407-help-runtime-locales.mjs` | BLOCKED: historisches `artifacts/v407/gewitterradar-v4.07.19.js` fehlt |
| `test-flk01-weather-radar-transition.mjs` | FAIL: Testausführung erwartet `measureV1RasterCoverage`, das im Test-VM-Kontext nicht bereitgestellt wird; Fixture und aktuelle Consumer-API vergleichen |
| `verify-hires-asset-retention.mjs` | FAIL: `artwork/help-icons/hires/gr-storm-premium-original.png` ist im Prüfvertrag noch nicht registriert; Master-Grafik unverändert lassen, Herkunft/Hash überprüfen und Vertrag aktualisieren |
| `pytest -q` | BLOCKED: `pytest` in dieser Ausführungsumgebung nicht installiert |
| `test-clouds-eye-browser.cjs` | BLOCKED in voriger DEV-Prüfung: fehlendes `leaflet/dist/leaflet.js`; realer Android-Test hier nicht nachgeholt |

Die fünf Fehlschläge in der 13er-JavaScript-Stichprobe sind **nicht** als fünf neue Produktregressionen nachgewiesen. Ein Teil ist historisch oder auf Test-Fixtures begrenzt. Dennoch bleibt FINAL gesperrt, bis die offenen Gate-Verträge nachvollziehbar geklärt und erneut ausgeführt wurden. Die 19 Sprachpakete bestehen die separate About-Validierung; das alte unveränderliche String-Snapshot-Audit besteht derzeit nicht.

## Unveränderte Schutzgrenzen und Freigabekriterien

- Geprüft wurde ohne funktionale Änderungen und ohne Änderung an WeatherRouter, DRA, HA DEV VM109 oder PROD VM101. Diese Akte ist ein Dokumentations-Commit und befördert keine Version.
- Protected References und Release-Freeze 4.11.243 bleiben erhalten.
- Vor FINAL: testseitige Altannahmen bereinigen (ohne Schutzgates stillschweigend zu entfernen), Hi-Res-Asset-Vertrag reparieren, vollständige CI/Tests mit Belegen ausführen, Release-Metadaten und signierte bzw. reproduzierbare Pakete überprüfen, anschließende Betreiberfreigabe einholen.
