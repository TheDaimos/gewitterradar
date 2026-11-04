# GR TEST70-63 – Öffentliche Regression nach RF03/WR-Abdeckungsbereinigung

Datum: 2026-11-04. Öffentlicher Entwicklungszweig `TheDaimos/gewitterradar@deploy/dev`.

## Ausgangslage: präzise öffentliche CI-Fehler
Run 41885112705: P7-010 ist nach erfolgreichem RF01 und RF02 an `scripts/test-p7-010-rf-03.mjs` gescheitert. Ist-Wert `request_budget_exhausted`, veralteter Soll-Wert `image_request_failed`.
Run 41885112629: Runtime scheiterte an `scripts/test-p7-010-viewport-coverage-revocation.mjs`. Der Test erwartete eine lokale GR-Satellitenfreigabe, statt die WR-Autorisierung und WR-Ablaufzeit zu beachten.

## Umgesetzte Anpassungen
- Commit `76ed2fd10d1fe3ee463f15dfd65dbc67c1cf6e7e`: RF03 erwartet korrekt die terminale Budgeterschöpfung. Keine Änderung an produktiver Retry-Logik.
- Commit `a673dec9be77731f8c4aea8e7caa62b9c5423470`: V2-DWD-/NASA-Testquellen erhalten `times.valid_until`; die lokale Satellitenpräferenz entzieht einer bereits von WR autorisierten Quelle nicht mehr ihre Darstellungsberechtigung. Die geografische DWD-Abdeckung bleibt separat durch GR zu prüfen.
- Kein eigenständiger 900-Sekunden-Grenzwert für GR.

## Neue öffentliche GitHub Actions
Für Code-Commit `a673dec9...` wurden gestartet: P7-010 41888685822, Settings/Runtime 41888685973, Shared Frontend 41888685989, Integration 41888685944. **Bei Erstellung noch in progress**; Erfolg nicht vorweggenommen.

## Freigabegates
Nachweis vollständiger öffentlicher CI auf Code-HEAD, WR-Python-Gesamtregression, Release-/Asset-/DRA-Parität und echte HA-DEV-VM109-Tests weiterhin erforderlich. Keine Installationsfreigabe.

**Keine privaten GitHub Actions – ausschließlich öffentliche Actions im Public-Repository.** TEST69 bleibt abgeschlossen und wird nicht wiederholt. PROD VM101 bleibt unverändert. Diagnose-/Realtest-Exporte ausschließlich `TheDaimos/Project-Log-And-Export@main`.
