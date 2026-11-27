# GewitterRadar V4.14 P04 – MA-023 Trackername/Collision, vorbereitender Feature-Commit

Stand: 27.11.2026. Nur Branch `feature/v4.14-monitored-areas`. **Keine DRA-Freigabe/Release, kein T2/T3.**

## Inhalt
- Serverseitige reine Leseprüfung für vorgeschlagene `device_tracker`-Entity-IDs über HA-`slugify`, aktuelle Entity Registry, aktuelle HA States und bereits reservierte MA-`tracker_refs`.
- Nur nach validierter HA-Identität, Vault-Profilprüfung, SQLite-`db_active` und dem für diesen Standort autorisierten Profil-Link. Rückgabe bei Kollision nur `name_unavailable`, nie Besitzer oder Fremd-IDs.
- Eigenständige, rückwärtskompatible WebSocket-Operation `tracker_name_check`; sie legt weder Tracker noch Blitzortung-Konfigurationen an.
- Im Standortdetailfenster Vorschlag prüfen und bei bestätigter Verfügbarkeit die Entity-ID kopieren. Änderungen am Eingabefeld verwerfen die alte Prüfbestätigung. Keine automatische Speicherung.
- Python- und Node-Vertragstests mit eigenem Feature-Branch-Workflow.

## Schutzumfang
Die vorhandene Karte, Referenztracker, Legacy Local To-do, Migration, SQLite-Tabellen, Blitzortung-ConfigEntries, WeatherRouter, Sonstige Layer und PROD bleiben unangetastet. Keine SQLite- oder HA-Registry-Mutationen.

## Noch nicht erledigt
MA-024 (Tracker wirklich anlegen), MA-025 (Blitzortung-Standort/Counter/Entfernungszuordnung), MA-026 (Parallelabos), MA-027 (Monitoring). Die UI ist **kein Beleg für einen erzeugten Tracker**. Weiterhin benötigt: vollständiger Frontend-Delivery-Build/Spiegel-Sync, neue Paketversionsidentität und alle relevanten CI-Gates auf neuem SHA sowie Realtests VM109. Keine Installationsaufforderung vor diesen Nachweisen.
