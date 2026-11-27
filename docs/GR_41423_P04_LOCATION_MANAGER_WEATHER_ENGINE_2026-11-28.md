# GewitterRadar V4.14.23 DEV – Tracker-Einrichtung in Wetter-Engine, Standortverwaltung ausgebaut

28.11.2026 · Branch `feature/v4.14-monitored-areas`. **Keine FINAL-Freigabe.**

Der bisherige MA-023-/MA-025-Trackercheck ist aus dem Standortdetailfenster entfernt. Das Settings-Menü **Wetter-Engine → Blitzortung.org** enthält nun einen eigenen Dialog mit Standortauswahl, Tracker-Kollisionsprüfung und Blitzortung-Integrations-/Sensorinventur. HA-Admin, aktuelles Vault-Profil und verifiziertes `db_active` sind zwingende Voraussetzungen. Der Dialog ist ausschließlich eine schreibgeschützte Vorschau: weder Tracker-Erstellung noch gespeicherte Blitzortung-Zuordnung.

Die Standortverwaltung besitzt Sortierung A–Z, Z–A und nach Änderung, Checkbox-Mehrfachauswahl sowie getrennte Sammelaktionen für Archivierung und Wiederherstellung. Mengenbestätigung, autorisierte revisionsgebundene Einzelaufrufe und Abbruch beim ersten fehlenden ACK schützen den Bestand. Nach Aktionen erfolgt ein neuer Server-Readback und die lokale Auswahl wird verworfen. Bestehende Local-To-do-Migration, Referenztracker und SQLite-Daten wurden nicht verändert.

Technische Tests: neue Node-Verträge für Menüposition, Auswahl, Sortierung und fail-stop; bestehende MA-023/025-Verträge angepasst. CI und finaler DEV-Build erforderlich. Offen bleiben MA-024 (Tracker-Erstellung), MA-025 (persistente Zuordnung), MA-026/027 und echte Betreiberabnahmen auf VM109. PROD und WeatherRouter nicht verändern.
