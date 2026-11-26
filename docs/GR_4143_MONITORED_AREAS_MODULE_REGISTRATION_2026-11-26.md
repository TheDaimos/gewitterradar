# GewitterRadar V4.14.3 DEV – Monitored Areas Modulregistrierung

**Datum:** 26.11.2026  
**Branch:** `feature/v4.14-monitored-areas`  
**Basis:** Betreiberdiagnose V4.14.2 DEV, HA-Integration 0.25.188, Laufzeit `4142r1`, 37/37 Module ohne Abweichung.  
**Status:** Quellcode-Fortschritt; HA-DEV-Abnahme auf VM109 ausstehend. Keine FINAL-Freigabe.

## Technische Feststellung

Das MA-Frontend-Modul `frontend/modules/monitored-areas/index.js` existierte bereits (MA-020) einschließlich `initializeMonitoredAreas`, Migration-Wizard und Cleanup-Reminder. Das Modul stand als **optional** in `module-manifest.js` und im Runtime-Inventar. Die Karte importierte es bislang **erst bei** `card._config?.monitored_areas_enabled === true`. Deshalb meldete die V4.14.2-Diagnose 37/37 Module, obwohl die erwartete Liste den optionalen MA-Eintrag enthielt. Dies war kein Nachweis für eine fehlende Implementierung.

Das Backend existiert getrennt in `custom_components/gewitterradar/monitored_areas` mit optionaler Konfiguration und SQLite-Runtime. Der HA-Integrationsschalter `monitored_areas_enabled` bleibt ausdrücklich opt-in. Vorhandene Backend-WS-Aktionen und Vault-Identitätsprüfung werden durch dieses Paket **nicht** umgangen.

## Tatsächliche Implementierung

1. `frontend/gewitterradar.js` und installierter Spiegel `custom_components/gewitterradar/frontend/gewitterradar.js`: MA-Index wird beim Modulbootstrap importiert und registriert. Die Karten-Runtime startet **weiterhin nur** bei `card._config?.monitored_areas_enabled === true`; ohne dieses Flag erfolgen weder MA-UI-Runtime-Start noch MA-WS-Requests durch diese Funktion.
2. Das vorhandene Modul mit ID `monitored-areas.lifecycle` und Version `0.2.0` bleibt unverändert; kein zweites Modul und keine parallele Standortdatenbank.
3. V4.14.3 DEV / HA 0.25.189 / `4143r1` / Modulset `E414-3A1`; beide Frontend-Spiegel, Release- und Runtime-Manifeste synchronisiert.
4. Standardbibliotheks-Regression `tests/test_ma_frontend_module_registration.py` hinzugefügt. Separate öffentliche Push-CI `.github/workflows/ma-frontend-registration.yml` hinzugefügt, ohne andere Gates abzuschalten.

## Erwartete Betreiber-Diagnose nach Installation

- Bei deaktivierter MA-Runtime weiterhin keine MA-Datenbankaktionen aus der Karte, aber **38/38** registrierte Module (einschließlich `monitored-areas.lifecycle`).
- Keine doppelten IDs, keine Soll-/Ist-Abweichungen.
- Diese Modulregistrierung bedeutet **nicht**, dass Standortverwaltung, Havanna-Detailfenster oder MA-021/MA-022 abgeschlossen wären.

## Prüfungen und offene Arbeiten

Über GitHub wurden nach den Änderungen die beiden Frontend-Spiegel, Versions-/Runtime-Manifeste, Modulidentität, erwartete Modulanzahl und Opt-in-Gate aus tatsächlichen Remote-Dateien abgeglichen. Der Abgleich ergab keine Abweichungen. Das ist **kein Ersatz** für ausgeführte Python-/JS-Tests und keine HA-Realabnahme; CI separat auf exaktem Commit prüfen.

**Als Nächstes:** echte CI-Ergebnisse prüfen, auf VM109 über DRA V2 installieren, JSON-Moduldiagnose exportieren und den 38/38-Stand bestätigen. Erst danach den nächsten Ausbau der Standortübersicht, MA-021 (Havanna) und MA-022 (Profile/Freigaben) mit den vorhandenen Backend-Verträgen fortsetzen.

**Schutz:** Kein PROD-Eingriff; keine Änderungen an Eye, Legend Hub, Mond, WR, Niederschlag, Wind oder Synoptik. Keine ungefragte Aktivierung der MA-Backend-Runtime oder Local-To-do-Migration.

**Commitfolge:** `a6d47a71` / `80cb3187` (Bootstraps), `f705e6b7` bis `dd2a2d9d` (Versions-/Manifestspiegel), `90692ebf` (Regression), `0eb673a3` (isolierte CI).
