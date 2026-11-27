# GewitterRadar V4.14 P04 – MA-025 Blitzortung-Inventory (read-only)

Datum: 27. November 2026 · Feature-Branch · **nicht freigegeben für Installation**.

## Implementiert
- Auf authentifizierten, SQLite-finalisierten HA-Admin + Vault-Profil + autorisierten Standort begrenztes WS `blitzortung_inventory`.
- Nur integrierte Blitzortung-/Blitzortung.org-ConfigEntries; Titel und Entity-IDs aus offizieller Entity Registry. Keine Entry-Daten, Optionen, Tokens, Koordinaten oder fremden Integrationen.
- Im Standortdetailfenster Button „Blitzortung prüfen“. Nach Backend-ACK dropdown der gefundenen Installationsstandorte und zugeordnete Entitätsnamen (Tracker, mögliche Counter und Entfernung). **Read-only, keine Speicherung, keine Trackererzeugung, keine Blitzortung-Zuordnung.**
- Fehlende Sensoren bleiben als fehlend angezeigt; heuristische Name-Zuordnung ist keine fachliche Bestätigung von Counter- und Entfernungssignalen. Entsprechende Verifikation ist MA-026/T2.
- Python-Funktionstests und JS-Integrationsvertrag mit Feature-Branch-Workflow.

## Noch offen
MA-024 reale dedizierte HA-Tracker-Erstellung und MA-025 dauerhafte Zuordnung inklusive Quellen-/Counter-/Entfernungsprüfung. Ein Blitzortung-ConfigEntry kann zurzeit auch an eine fremde oder nicht in der Blitzortung-Registry vorhandene Standort-Entity gebunden sein; dies wird in dieser Diagnosestufe **nicht** als funktionierende Quelle behauptet. Keine Änderung an HA ConfigEntries oder bestehenden GR-Referenztrackern. Neue Versionsidentität und neuer synchronisierter Build vor DRA, T2 VM109 ausstehend.
