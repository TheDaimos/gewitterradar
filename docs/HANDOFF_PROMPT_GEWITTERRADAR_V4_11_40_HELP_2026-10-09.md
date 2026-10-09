Bootstrap: Daimos

Projekt: Gewitterradar V4.11 DEV
Repository: TheDaimos/gewitterradar
Entwicklungszweig: feature/v4.11-development
DRA-Auslieferungszweig: deploy/dev

Wir setzen die Arbeit exakt NACH der erfolgreich abgenommenen Android-Gestenreparatur und der konsistenten Moduldiagnose V4.11.40 DEV fort.

Lies ZUERST direkt aus den GitHub-Repositories:

0. TheDaimos/project-defaults/START_HERE.md (aktuelle globale Projektregeln)
1. TheDaimos/gewitterradar/PROJECT_DEFAULTS.md
2. docs/HANDOFF_GEWITTERRADAR_V4_11_40_HELP_2026-10-09.md
3. docs/RELEASE_NOTES_V4_11_40_DEV.md
4. docs/RELEASE_NOTES_V4_11_39_DEV.md
5. docs/RELEASE_NOTES_V4_11_38_DEV.md
6. docs/RELEASE_NOTES_V4_11_37_DEV.md
7. docs/RELEASE_NOTES_V4_11_36_DEV.md
8. docs/RELEASE_NOTES_V4_11_35_DEV.md
9. docs/RELEASE_NOTES_V4_11_28_DEV.md
10. docs/ABOUT_GEWITTERRADAR_ACCEPTANCE_BASELINE_V4_05.md

Lies außerdem im privaten Repository TheDaimos/home-assistant-dev-toolkit:

docs/ANDROID_WEBVIEW_THREE_FINGER_SCREENSHOT_GESTURE_RECOVERY_2026-10-08.md

WICHTIG: Die Android-Gestensteuerung („3-Finger-Joe“) ist REAL ABGENOMMEN.
Ein-Finger-Kartenverschiebung, Zwei-Finger-Zoom zusammen/auseinander, gleichzeitiges Zoomen und Verschieben sowie Doppeltipp mit geografischer Ortszentrierung funktionieren auch nach der Android-Drei-Finger-Bildschirmfoto-Geste.
Diese Korrektur nicht erneut umbauen, nicht abschwächen und keine globalen touchmove-Sperren einführen.

Technischer Stand V4.11.40 DEV:
- Version: 4.11.40 / V4.11.40 DEV
- Build: V4.11.40-DEV-2026-10-08
- Runtime: 41140r1
- Modulsatz: E411-40A1
- Integration: 0.25.0
- 31/31 Module, Versionssatz konsistent: auf realem HA bestätigt
- Letzter reiner Produkt-Code-Checkpoint vor der Übergabe: df118237de73c121ab356b21b702d233c7e245b9
- Achtung: Der Dokumentations-Handoff hat einen späteren Git-Commit; aktuelle HEADs ausdrücklich erneut prüfen.

NÄCHSTER KONKRETER AUFTRAG:
„Hilfe und Hinweise“ funktioniert trotz grüner Moduldiagnose nicht mehr. Dieser Fehler ist bislang NICHT analysiert oder behoben. Untersuche ihn zuerst mit tatsächlichem Quellcode und falls nötig einer gezielten Rückfrage / Diagnose.

Prüfe besonders:
- frontend/modules/ui/controls.js: Bindung von #settings-help an this._openHelp()
- frontend/modules/ui/skeleton.js: Schalter und Dialogeinbettung
- frontend/modules/ui/i18n-settings.js: _syncHelpMenu, _openHelp, _syncHelp, _closeHelp und Locale-Resolver
- frontend/gewitterradar.js: Modulinstallation und Importkennungen
- docs/RELEASE_NOTES_V4_11_28_DEV.md: damaliger, aber NICHT automatisch identischer Hilfe-Fehler
- geschützte About-/Hilfe- und Mehrsprachigkeits-Verträge

Zuerst Ursache feststellen, dann minimalen Fix umsetzen. Nicht ohne Beleg behaupten, dass es erneut am Modulmanifest liegt. Der Benutzer hat die „Hilfe und Hinweise“-Reparatur ausdrücklich auf den Folgetag verschoben.

WICHTIGE CI-EINSCHRÄNKUNG:
Gezielter V4.11.40 Karten-/Modulregistertest, Diagnosevertrag und Hi-Res-Schutztest waren SUCCESS. Ältere allgemeine Shared-Frontend- und Integrations-Workflows waren weiterhin FAILURE, u. a. durch veraltete Versionserwartungen in Tests/Buildverträgen. Die Import-Cache-Kohärenz separat prüfen, keine Tests blind aufweichen. Details/Run-Links stehen in der Übergabe.

REPOSITORY-DISZIPLIN:
- ZUERST aktuelle HEADs von feature/v4.11-development und deploy/dev lesen.
- main und V4.10 FINAL nicht verändern.
- niemals parallele Änderungen überschreiben.
- gemeinsame Frontend-Dateien in frontend/, dashboard/dist/ und custom_components/gewitterradar/frontend/ spiegelgleich halten.
- bei Runtime-Änderungen Version/Build/Runtime/Modulsatz/DRA synchron erhöhen.
- DRA für Installation und Realtests nutzen.
- keine Änderungen an WeatherRouter-Routing, Leaflet-Tile-Transforms, Android-Gestensteuerung oder Hi-Res-Mastern ohne begründeten separaten Auftrag.
- vollständig berichtete Tests und nötige HA-Realabnahme.

Setze selbstständig mit der Bestandsaufnahme und Diagnose von „Hilfe und Hinweise“ fort; nutze deine GitHub-Verbindung für Codeänderungen, statt mich zum manuellen Patchen aufzufordern.

C.K. – Eine Idee weiter gedacht.
