# GR 4.11.154 DEV / HA 0.25.61 – DRA-Bereitstellung der kompakten Windschaltfläche

**Datum:** 07.11.2026  
**Zweig:** `TheDaimos/gewitterradar@deploy/dev`  
**WeatherRouter:** 0.10.297 DEV / Loader 300, unverändert.

## Ausgangslage
Das veröffentlichte GR-Release 4.11.153 DEV / HA 0.25.60 enthielt den Premium-Windschalter. Der Nutzer wünschte dessen Anzeige nur im Vollbild sowie optische Vereinheitlichung mit den vorhandenen Karten-Buttons.

## Änderungen
- Windschalter ausschließlich in der regulären Vollbildansicht oder im separaten Vollbild-Kartenfenster sichtbar.
- Kompakte 42×42-px-Schaltfläche mit goldfarbenem Rahmen, dunklem Hintergrund und dem unveränderten Original-Icon (32×32 px).
- Bestehende Drag-Positionierung erhalten und an neue Ausmaße angepasst.
- Vollbildmodus-Synchronisierung integriert. Windanzeige, Einstellungen, Animation, Farbflächen, Puffer und WeatherRouter-Vertrag unverändert.
- Gleichlautende Quellmodule in `frontend/`, `custom_components/gewitterradar/frontend/` und `dashboard/dist/`.
- Neue DRA-Versionskennung GR **4.11.154 DEV**, HA **0.25.61**, Runtime `411154r1`, Modulsatz `E411-154A1` in Version, Integration, Build-Info, Provenienz und Runtime-/Modulmanifest.
- CI-Testannahmen an bereits vorhandene 35 registrierte Module angepasst.

## Commitfolge
- `5e802b4b38a5793b80c3ea3f89f05131d95a2af3` – UI-Anpassung.
- `4015a613a0f178b747c41a7b5ff66a8e60e9a08c` – DRA-Identität.
- `c322a1966033d0fb5a75e759ffc4f4a6fe206298` – Runtime- und Modulmanifest.
- `0576a6608a438e686836bfa4f3c31a1b436da9e3` – Windmodul-Revision.
- `87a34da659a79bee55886720670b4076639711b5` – Vollbildmodul-Revision.
- `819f0311928bd6f24253db7675b0dd1c5f658a67` – aktualisierte Modulzahl-Prüfverträge.

## Verifikation und Grenzen
Die Branchdateien wurden nach den Änderungen zurückgelesen, Versionskennung und Pfadparität geprüft. Öffentliche CI läuft zum Zeitpunkt der Dokumenterstellung erneut.

**Keine Behauptung einer bereits bestandenen neuen CI oder einer physischen Installation.** DRA sollte diesen neuen `deploy/dev`-Stand nach Aktualisierung seiner Quelle erkennen. Erst nach erfolgreicher CI, Paketprüfung und VM109-Realtest ist die finale Installationsabnahme bestätigt.

PROD VM101 unberührt. Keine privaten Actions.
