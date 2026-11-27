# GewitterRadar V4.14.22 DEV – P04 Trackername und Blitzortung-Inventur

Datum: 27.11.2026 · Branch `feature/v4.14-monitored-areas`. Nicht FINAL.

## Inkremente
- MA-023: autorisierte, SQLite-`db_active`-gebundene Namenprüfung für `device_tracker`, Entity Registry/State/SQLite-Tracker-Refs-Kollisionen. Entity-ID nach positivem ACK im Standortdetail kopierbar, keine Trackererstellung.
- MA-025 read-only: HA-Admin / aktiver Vault / autorisierter SQLite-Standort. Auswahl vorhandener Blitzortung-ConfigEntries mit deren registrierten Tracker-, Counter-, Entfernungs- und weiteren Sensor-Entity-IDs. Keine private ConfigEntry-`data`/Secrets, keine Änderungen an Blitzortung-ConfigEntries.
- Eigenständige Python- und Node-Tests. Neue kanonische DEV-Identität: GR `4.14.22`, Runtime `41422r1`, ModuleSet `E414-22A1`, HA `0.25.208`, DRA `4.14.22`.

## Gates vor Betreiberinstallation
Feature-Branch-Build muss die originalen `frontend/`-Quellen in beide Frontend-Spiegel übersetzen, SHA256 aktualisieren, Import-/MA-020/021/022/023/025-Verträge ausführen und auf dem finalen Commit in CI geprüft werden. Keine automatische Übernahme nach `deploy/dev`, keine PROD-Mutation. DRA kann nach explizitem grünen Gate den Feature-Branch gezielt als Quelle wählen.

## Weiter offen
MA-024 reale sichere Trackererzeugung, MA-025 persistente Blitzortung-Location-/Counter-/Entfernungszuordnung, MA-026 getrennte Abonnements und HA-DEV-T2, MA-027 Überwachungsregeln, P03-Operator-Mehrbenutzertest. Diese Version zeigt ein **Inventar**, noch keine wirksame Blitzortung-Bindung. 43 SQLite-Orte bleiben unverändert.
