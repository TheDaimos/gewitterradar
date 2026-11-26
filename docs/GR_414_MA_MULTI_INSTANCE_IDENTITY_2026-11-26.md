# GewitterRadar V4.14 – Mehrinstanz-Identitäten (SQLite V9)

## Geltungsbereich

Identitätsvorsorge für (1) mehrere miteinander verbundene, eigenständige Home-Assistant-Installationen und (2) spätere HA-Hochverfügbarkeits-Cluster. Der vorliegende Stand implementiert **nur lokale Datenmodellierung und interne Repositories**, keine Clusterverwaltung, HA-Fernverbindung, Autorisierung externer Instanzen, Synchronisation oder Multi-Writer-Datenbank. Local To-do, PROD, WR und die bisherigen Referenzmodule bleiben unangetastet.

## Persistenz / kardinalitäten

- `locations.location_id` ist weiterhin eine unabhängige UUID der lokalen überwachten Area; gleiche Koordinaten implizieren keine Identität.
- `locations.location_origin` bleibt die ausdrückliche Herkunft des lokalen Datensatzes.
- `source_instances.instance_id` ist ein später zu provisionierender, dauerhaft stabiler UUID-Identifikator einer **logischen** HA-Installation. Eine VM-ID, hostname, entity_id, IP-Adresse oder bloße Koordinate ist dafür nicht geeignet.
- `source_nodes.node_id` bezeichnet einen ausdrücklich registrierten HA-Knoten, der zu einer logischen HA-Instanz gehört. Beim Failover kann derselbe logische Dienst bestehen bleiben, ohne einen neuen überwachten Standort zu erzeugen.
- `source_instances.cluster_id` (nullable UUID) bezeichnet eine optionale **logische HA-Gruppe**, keine automatische HA-Clustererkennung und keine aktive gemeinsame Speichersteuerung.
- `location_source_refs` besitzt eigene UUID `reference_id`, Fremdschlüssel auf eine Location und eine HA-Instanz sowie `entity_id`, nullable `physical_device_id`, Revision. Das ergibt eine n:m-Verknüpfung von überwachten Orten und Quellreferenzen mit gesonderter Herkunftsinstanz.
- `UNIQUE(location_id,instance_id,entity_id)` verhindert nur exakt doppelte **Verknüpfungen**. Weder `entity_id` noch `physical_device_id` noch Koordinaten sind global eindeutig oder bilden eine automatische Merge-Regel.
- `physical_device_id` ist ausschließlich eine **explizit validierte/zugeordnete** Quellidentität. Keine automatische Ableitung aus HA-Device-Namen, entity_id oder Koordinaten.

## Migration V8 → V9

Transaktionale additive Erstellung von `source_instances`, `source_nodes`, `location_source_refs` und drei nicht-eindeutigen Lookup-Indizes nach vollständiger Prüfung des bisherigen V8-Schemas. Es werden **keine alten Daten** umklassifiziert, keine Zuordnungen erfunden und keine Tracker umgeschrieben. Existierende v0–v8-Migrationen laufen anschließend bis V9. Fremdschlüssel- und `quick_check`-Prüfung bleiben verpflichtend; nicht-kanonische bzw. unbekannte Schemata werden ohne Reset abgewiesen.

## Ausdrücklich noch zu entwerfen, bevor irgendeine Multi-HA-Anbindung aktiviert wird

- Vertrauensmodell und gegenseitige Authentisierung, Berechtigung pro HA-Instanz und Benutzerprofil; sichere Installation/Backup-Klonerkennung und Instanzrotation.
- Replikation mit Quellereignisidentität, Event-Idempotenz, Konfliktregeln, eventuellem Owner-/Leader-Fencing, Epochen/Tokens und offline Wiederaufnahme.
- Separate Regelung zur Vermeidung doppelter Gewitter-Alarme; physische Geräte können bewusst mehrfach überwacht werden.
- **Kein** gleichzeitiges Mounten/Beschreiben derselben SQLite-Datei durch mehrere HA-Hosts; dazu ist ein eigenständiges Clusterbackend erforderlich.
- Reale HA DEV VM109-Abnahme, DRA-DEV-Auslieferung und nachvollziehbare CI-Gates vor Aktivierung.

## Regression

`tests/test_ma_instance_identity.py` deckt die V8→V9-Migration, eine frische V9-Datenbank, gleiche Koordinaten und gleich benannte HA-Entitäten in zwei verschiedenen Instanzen, registrierte HA-Knoten, eindeutige Bindungen und FK-Schutz ab. `tests/test_ma_location_origin.py` deckt V7→V9 einschließlich Herkunftserhalt ab. `.github/workflows/ma-020.yml` führt beide gezielten Tests aus.
