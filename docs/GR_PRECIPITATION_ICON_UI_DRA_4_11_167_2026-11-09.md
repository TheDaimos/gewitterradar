# GR-PRECIPITATION-ICON-UI – Abschluss und DRA-Freigabe (DEV)

**Stand:** 09.11.2026; **Branch:** `TheDaimos/gewitterradar@deploy/dev`

## Versionierung

- Gewitterradar **4.11.167 DEV**
- HA-Integration **0.25.74 DEV**
- Runtime-Revision **411167r1**
- Modulset **E411-167A1**
- DRA-Kanal: `deploy-relay-channel.json` verweist auf `deploy/dev`; `deploy-relay.json` enthält Integration-Deployment nach `custom_components/gewitterradar`.
- WeatherRouter unverändert; keine PROD-Freigabe.

## Umgesetzte Oberfläche

- Regen-Hi-Res-Icon: aktiver Sonder-Glow entfernt; optische Größe Desktop 64 px innerhalb 50-px-Hitbox, Touch 58 px; originales PNG unverändert.
- Niederschlags-Icon bleibt verschiebbar, Status-Synchronisierung und Long-Press-Einstellungen bleiben bestehen.
- Altes X aus dem Niederschlags-Kartenschalter-Unterabschnitt entfernt.
- Im Eye-Menü-Kopf ganz rechts Premium-Schließen-Button mit dem vorhandenen `PREMIUM_CLOSE`-Asset eingefügt; Schließen verwendet den vorhandenen UI-Zustand.
- Zusätzlicher Rahmen am vorhandenen Info-Button im Eye-Kopf entfernt; `PREMIUM_INFO` bleibt erhalten.

## Kontrollierte Dateien

Alle folgenden drei Zielbestände besitzen jeweils identische Blob-SHA untereinander:

- `frontend/` (Master-Frontend)
- `dashboard/dist/` (Dashboard-DRA-Kopie)
- `custom_components/gewitterradar/frontend/` (HA-Integrations-DRA-Kopie)

Verifiziert wurden `version.js`, `assets/gewitterradar-runtime-manifest.json`, `modules/weather/display-menu.js` sowie `modules/weather/precipitation-control.js`.

**Ursache des vorherigen Runtime-Stale-Fehlers:** In V4.11.166 meldeten die drei ausgelieferten `gewitterradar-runtime-manifest.json` noch V4.11.165 / E411-165A1. Jetzt stehen alle drei auf V4.11.167 / E411-167A1 / 411167r1.

## Abnahmegrenze

Quell- und DRA-Dateikonsistenz auf GitHub geprüft. **Keine Liveinstallation auf HA DEV VM109 und keine reale Desktop-/Android-/iPad-Sichtabnahme durchgeführt.** Nach DRA-Installation im Moduldiagnoseexport prüfen: `installedId = E411-167A1`, `installedRevision = 411167r1`, `stale = false`. Bei weiterhin alter Kennung tatsächlichen Installationspfad und Browsercache untersuchen; keine Versionsschutzprüfung deaktivieren.

Keine privaten GitHub Actions, TEST69 unberührt, WR/OPERA/NASA-Backend nicht verändert.
