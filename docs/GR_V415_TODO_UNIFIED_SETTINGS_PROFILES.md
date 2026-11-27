# GewitterRadar V4.15 – To-do: Unified Settings & Profiles (SQLite)

**Status:** verbindlich vorgemerkt für V4.15, noch nicht implementiert.
**Datum:** 27. November 2026.
**Priorität:** nach Abschluss und Betreiberabnahme von V4.14 MA-020/021/022 und Hot-Fixes.

## Aufgabe

Ermitteln und kontrolliert einführen, wie GewitterRadar seine Benutzer-, Profil- und Darstellungseinstellungen in einer versionierten, HA-benutzergebundenen SQLite-Struktur zusammenführen kann.

Aktuell gibt es zwei **funktionsfähige, unterschiedliche** Verantwortlichkeiten:
- `custom_components/gewitterradar/settings_vault.py`: bestehender SettingsVault in privaten Home-Assistant-Speichern, mit Profilen, Revisionen, Datenprüfung, Recovery/Snapshots.
- `custom_components/gewitterradar/monitored_areas/storage/schema.py`: optionale SQLite-Monitored-Areas-DB mit `profile_links` und `profile_preferences` pro Standort/Profil, inklusive `display_settings_json`.

Der SettingsVault darf **nicht** einfach ersetzt oder gelöscht werden. Normale GR-Einstellungen müssen auch dann vollständig funktionieren, wenn Monitored Areas nicht aktiviert sind.

## V4.15-Arbeitsliste

- [ ] **USP-001 – Inventur:** Alle SettingsVault-Keys und Defaults dokumentieren, trennen nach global, HA-Instanz/Cluster, authentifiziertem HA-Benutzer, Vault-Profil, Endgerät und Standortlink.
- [ ] **USP-002 – Architekturentscheidung:** Eigenständige, immer verfügbare Settings-SQLite gegenüber konsequent getrennten Bereichen in einer gemeinsamen DB prüfen; das MA-Opt-in darf nicht zur Voraussetzung für GR-Einstellungen werden.
- [ ] **USP-003 – Versionsschema und API:** Benutzer-/Profileinstellungen, Layout/Window-Positionen, Revisionskontrolle, ACL und Conflict Resolution modellieren; keine Browser-SQL-Zugriffe, keine Secrets/Passwörter in der normalen Datenbank.
- [ ] **USP-004 – Einstellungskandidaten:** Eye-Menü, Icon-Gruppierung, Aura, Glow, Winddarstellung, globale Effektstärke, Slots, Device-Presets, Havanna-/GeoPoint-Fensterpositionen und Standorte/Favoriten.
- [ ] **USP-005 – Migrationssicherheit:** SettingsVault bleibt zunächst autoritative Quelle; schreibgeschützte Vorschau und Vergleich, prüfbare idempotente Übernahme, Backups, Rollback; **kein automatisches Löschen oder ungeprüftes Überschreiben**.
- [ ] **USP-006 – Synchronität:** Mehrere Browser/Companion-Geräte, mehrere HA-Instanzen, Profilwechsel, offline und konkurrierende Einstellungen testen, mit getrennten gerätespezifischen Layouts.
- [ ] **USP-007 – Backup und Wiederherstellung:** HA-Backup-Integration, SQLite-Konsistenz, Prüfsummen, Schema-Version, Restore mit expliziter Bestätigung, sichere Fehlermeldungen.
- [ ] **USP-008 – UI/Abnahme:** Bestehenden hochwertigen Vault-Bedienfluss erhalten, Quellen-/Sync-/Fehlerzustände anzeigen; nur additive Migration nach DEV-T2, kein Eingriff in V4.14 FINAL.

## Nicht V4.15-Settings-Migration

Atmospheric Moisture/Luftfeuchte/Taupunkt/Nebel/Frost/Glätte bleibt ein separater Wetter-Provider-Backlog mit freier V4.14/V4.15-Terminentscheidung; keine Koppelung mit dem Settings-Umbau.

**Schutzregel:** PROD VM101, vorhandenes SettingsVault-Datenmodell, WR/GR-Funktionsreferenzen und die in V4.14 gesicherten 43 Standorte bleiben unverändert, bis neue Funktion und Migration ausdrücklich abgenommen sind.
