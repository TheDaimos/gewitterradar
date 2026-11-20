# GR OPERA VIS-07 – DRA BUILD_VERSION korrigiert · V4.11.115 DEV

**27.10.2026 · deploy/dev · ausschließlich HA DEV VM 109**

## Realbefund
DRA wählte den richtigen GR-Quellcommit 5cdde44b7f0b, zeigte aber `Git-Quelle 4.11.109` und `Lokal 4.11.109`, erkannt über `BUILD_VERSION`, sowie 153 unveränderte Dateien. Der Quellstand bestätigte in `custom_components/gewitterradar/build_info.py` die alte `BUILD_VERSION = "4.11.109"`. Die Divergenz war ein Fehler der vorigen Versionsanhebung. Der Null-Diff trotz neuer Commit-Version ist separat zu prüfen.

## Reparatur
- V4.11.115 DEV / 411115r1 / E411-115A1 / native Integration 0.25.24 / core.manifest 1.2.163.
- `build_info.py`: `BUILD_VERSION = "4.11.115"`.
- `const.py`: Sidebar-Modul-URL 411115r1.
- `dra-deployment-provenance.json`: Versionsfelder aktualisiert, historische Baseline-/Paritätsangaben unverändert.
- Frontend-`version.js`, `module-manifest.js`, `gewitterradar.js`, `panel.js` und Runtime-Manifest in allen drei Auslieferungsspiegeln identisch synchronisiert.

## Grenzen und gezielter Realtest
Keine HA-DEV-Installation, keine dynamische Regression oder HA-Realabnahme. Wissenschaftliche OPERA-Sperren unverändert. PROD VM101 unangetastet. DRA-Vorschau auf VM109 mit neuer `deploy/dev`-Quelle berechnen: Git-Quelle muss 4.11.115 sein, neue/geänderte Dateien gegenüber installiertem Stand >0; andernfalls DRA-Quellbaum-/Snapshot-Vergleich separat untersuchen. Erst bei plausibler Vorschau DEV-Installation freigeben.

C.K. – Eine Idee weiter gedacht.
