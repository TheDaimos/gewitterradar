# WL-02 – Konkrete öffentliche CI-Fehler und konsistente Modulversion

**Datum:** 19.10.2026 · **Repository:** TheDaimos/gewitterradar · **Zweig:** ausschließlich deploy/dev.

## Ausgangsnachweise der gemeinsamen Koordination
Commit `0b078c94f8fbcae0e722dfd48cc2d774c88628b9`:
- Öffentlicher CI-Lauf **39274061794** (`Validate Gewitterradar integration`): fehlgeschlagen; gemeldete Fehler: `tests/test_v41002_modules.py` erwartet die alte Modulversion und `scripts/verify-deploy-relay-contract.py` meldet abweichende Bytes bei `weather/layer-menu.js`.
- Öffentlicher CI-Lauf **39274061760** (`Validate shared Gewitterradar frontend`): fehlgeschlagen; `scripts/verify-frontend.mjs` enthält den veralteten festen Versionsmarker `1.1.4`.
- Öffentlicher CI-Lauf **39274061819** (`V4.11.99 settings navigation and runtime identity`): von der Koordination als erfolgreich gemeldet.
- WL-02-Node-Vertragstests: laut Koordination **9 bestanden, 0 fehlgeschlagen**.
Die oben genannten Ergebnisse stammen aus dem Benutzerbericht über die gemeinsame Koordination, nicht aus eigenständig eingesehenen Jobprotokollen.

## Tatsächlich vorgenommene Änderungen
Die bestehenden Tests wurden **nicht abgeschaltet oder abgeschwächt**.
- `8c44741c15c442b554efdc5aeea934df9c3be24f`: `custom_components/gewitterradar/frontend/modules/weather/layer-menu.js` bytegleich an den bereits entwickelten kanonischen Frontend-Modulinhalt angeglichen.
- `edfaa022c4e402466c95cc65788e311bb53f9e3f`: Feste Modulversionsprüfung in `scripts/verify-frontend.mjs` auf `1.1.5` aktualisiert.
- `be760e5459133636e1bc04c54ab84d6a62605f93`: `frontend/module-manifest.js` aktualisiert.
- `7fba7dd031904c99dc3ea82b6f0687aee8e82d11`: `frontend/assets/gewitterradar-runtime-manifest.json` aktualisiert.
- `d78780c380f4f3946b7531ca9c2915a4c4b17b77`: entsprechender DRA-Spiegel des Modulmanifests aktualisiert.
- `e5dbcb0185b0781007da62597c34588f42c3eb84`: entsprechender DRA-Spiegel des Laufzeitmanifests aktualisiert.

Die Version **1.1.5** bezeichnet die bereits existierende Moduländerung; hier wurde **keine neue Produkt-/DEV-Version** vergeben. Damit stimmen Modulkennung, Modulerwartungen und DRA-Modulkopie hinsichtlich der konkret bekannten Abweichungen überein.

## Prüf- und Freigabestatus
Eine erneute Abfrage der konkreten GitHub-Actions-Push-Runs über die verfügbare GitHub-Verbindung ist nicht möglich: das angebotene Werkzeug `fetch_commit_workflow_runs` liefert laut Vertrag nur PR-ausgelöste Läufe; der alternative öffentliche API-Webabruf war ebenfalls nicht zugänglich. **Für die hier vorgenommenen Korrekturcommits liegen deshalb noch keine neuen, selbst verifizierten Laufkennungen/Ergebnisse vor.** Die oben genannten alten Run-IDs dürfen nicht als Nachweis für die Korrekturen verwendet werden.

Noch offen sind die vollständigen WL-02-Laufzeit- und Schnittstellenprüfungen, der übergreifende Ressourcenhaushalt, sämtliche durchlaufenden GR-RF-01–04/P7-010-Regressionen, tatsächliche öffentliche CI-PASS-Nachweise und die anschließende konsistente neue Produktversionsfreigabe.

**CODE-PASS: offen · Öffentlicher CI-PASS: offen · HA-REAL-PASS: offen · DRA-Installationsfreigabe: gesperrt.**

C.K. – Eine Idee weiter gedacht.
