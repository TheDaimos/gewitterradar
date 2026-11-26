# GewitterRadar V4.14 – Monitored Areas: Standort-Herkunft (SQLite V8)

## Entscheidung

Geografische Koordinaten sind keine Identität. Beliebig viele eigenständige Monitored Areas, Geräte oder Tracker dürfen exakt dieselben Latitude-/Longitude-Werte besitzen. Ein Zusammenführen anhand gleicher Koordinaten ist unzulässig.

## Persistenz

Die bestehende Tabelle `locations` erhält **additiv** die Spalte:

```sql
location_origin TEXT NOT NULL DEFAULT 'unknown'
CHECK (location_origin IN ('gr_manual','device','tracker','external','unknown'))
```

- `gr_manual`: durch GR angelegter Ort einschließlich der ausdrücklich vom Benutzer aus Local To-do importierten Orte.
- `device`, `tracker`, `external`: reservierte, später anzubindende Herkunftsarten. Sie werden **nicht** allein aufgrund der Koordinaten abgeleitet.
- `unknown`: Bestand bei der Migration, falls die Herkunft bislang nicht beweisbar war.

Die UUID `location_id` bleibt einzige technische Primäridentität der Tabelle. Eine HA-Entität oder physische Gerätekennung muss später separat und explizit der passenden Standortidentität zugeordnet werden. Es gibt keine einzigartige Koordinatenkombination.

## Migration & Sicherheit

Schema V7 → V8 wird in einer bestehenden SQLite-Transaktion durch `ALTER TABLE ... ADD COLUMN` migriert. Bestehende Datensätze, Profilzuordnungen, Tracker-Referenzen und Berichte bleiben unverändert. Der Default `unknown` verhindert eine rückwirkend erfundene Herkunft. Neue manuelle GR-Orte und explizit neu importierte Local-To-do-Orte erhalten `gr_manual`. Die Herkunft ist über normale Standortänderungen nicht bearbeitbar. Rückmeldungen der MA-API enthalten die Spalte für `location_get`, `location_create`, `locations_list` und `places_list`.

## Regression und Abnahme

`tests/test_ma_location_origin.py` prüft das frische Schema, Wiederholung des Schemainitialisierers, V7-Upgrade mit zwei identisch positionierten unabhängigen Orten, Einfügen eines weiteren manuellen Standorts und Ablehnung ungültiger Herkunft. Zusätzlich wurden bestehende Schema-Versionsprüfungen angepasst und der MA-020-CI-Workflow um den Test erweitert.

**Einschränkung:** Diese Änderung führt keine neuen realen Geräte-/Tracker-Registrierungen ein und verändert keine existierenden Home-Assistant-Entitäten. Ausführung der CI und reale HA-DEV-Abnahme auf VM109 sind gesondert nachzuweisen. PROD VM101 bleibt unverändert.
