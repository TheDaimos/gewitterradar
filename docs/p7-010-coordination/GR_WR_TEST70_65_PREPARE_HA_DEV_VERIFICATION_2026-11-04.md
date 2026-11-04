# TEST70-65 – GR/WR für HA-DEV-Verprobung vorbereiten

**Datum:** 04.11.2026. **Ziel:** technisch belastbare Freigabegates, keine behauptete Realabnahme.

## Ausgangsdiagnose
- Der Nutzer hat bereits eine funktionierende OPERA-Vorschau beobachtet. Dies ist ein früherer Sichtbefund, kein erfolgreicher Test des neuesten Builds.
- Öffentliche GR-CI `41888957572`: nach RF03/RF04 scheiterte `scripts/test-p7-010-satellite-revocation.mjs` an der alten Erwartung einer lokalen GR-Consent-Revocation. Der tatsächliche WR-Architekturvertrag verhindert selbstständige GR-Entzüge.
- Öffentliche GR-CI `41888957872`: `Backend and DRA identity` prüfte hart `4.11.106` und `E411-106A1`, während die aktuellen Version-/Build-/DRA-/Runtime-Dateien `4.11.135` und `E411-135A1` konsistent verwenden.
- Keine Änderung der wissenschaftlich nachgewiesenen OPERA-Orientierung oder neue TEST69-Prüfung.

## Umgesetzte Code-/Testkorrekturen
1. `8392f75b3902bad6839df921a73a59ce9c6c1860`: `scripts/test-p7-010-satellite-revocation.mjs` prüft, dass eine Satellitenpräferenzänderung einen neuen WR-Abruf auslöst, veraltete in-flight Kandidaten abbricht, **aber keine bestehende WR-autorisierte Ebene entfernt**.
2. `d72341ac193ab568d25420d9bac9cfaf2be37419`: `.github/workflows/v41150-settings-navigation.yml` prüft Versionsidentität dynamisch gegen `frontend/version.js`, `build_info.py`, DRA-Provenance und Runtime-Manifest statt historische Versionsstrings festzunageln.
3. Öffentliche P7-010-CI zum ersten Codecommit: `41889969879`. Öffentliche Settings-CI zum zweiten Codecommit: `41889994859`. Bei Dokumentation waren beide noch nicht abschließend bestätigt.

## Abnahmecheckliste für HA DEV VM 109 (nicht PROD 101)
- **Gate A – public CI:** P7-010, Shared Frontend, Settings/Runtime und HA-Integration müssen auf gleichem geprüften Code-HEAD erfolgreich sein.
- **Gate B – WR-Linux:** WSL2: `git switch deploy/dev && git pull --ff-only`, Python-Tests des V2-Vertrags einschließlich `tests/test_f7_l24_opera_v2_source_request.py` und die vollständige vorhandene OPERA-Regression ausführen. Echte Testberichte gesondert exportieren. Keine privaten Actions.
- **Gate C – Metadaten/Packaging:** GR-Frontend, die zwei Deployment-Spiegel, Module, DRA-Build, Version, Checksummen und Manifest vergleichen. Keine Release-Nummer ohne vollständige Artefakt-Parität erhöhen.
- **Gate D – WR DEV real:** ausschließlich VM 109 installieren; aktivierte OPERA-RATE-Providerwahl, userseitige WR-Gültigkeit (auch >900 s), messzeitbasierte `valid_until`, Admin/Diagnose, zugelassene Kacheln, 401/403 und Fehlercodes prüfen. Keine automatische Übertragung in PROD.
- **Gate E – GR DEV real:** Desktop, Android, iPad; erst WR-verifizierte Frames darstellen, einen neuen Frame komplett vorbereiten und erst dann tauschen; nach fehlgeschlagener Einzelkachel ausschließlich diese erneut beziehen; vorhandene Kacheln nicht verwerfen; Zoom 3/4 und regionale Coverage, Vordergrund-Rückkehr, Sichtbarkeit, Diagnose und Settings prüfen.
- **Gate F – Export2Git:** nummerierte JSON/LOG/Messdaten-Berichte ausschließlich `TheDaimos/Project-Log-And-Export@main`; vor und nach Test genaue SHA/Version erfassen.

## Rollback und Sicherheit
Bei Fehlschlag Entwicklungsstand vor der Installation sichern, nur VM109 zurücksetzen; ältere bestätigte Live-Installationen nicht überschreiben. Kein PROD-Schreibzugriff. **Alle GitHub Actions ausschließlich in öffentlichen Repositories – private Actions verboten.** Wissenschaftlicher TEST69-Nachweis abgeschlossen; nicht wiederholen.

**Freigabe:** erst nach Gates A–F; CI/Realtest nicht aus diesem Dokument ableiten.
