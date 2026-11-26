# GewitterRadar V4.14.7 DEV – MA SQLite V9, Multi-HA-Identität und Regression

## Quellstand und Identität

- Feature-Branch: `feature/v4.14-monitored-areas`
- Produkt: GewitterRadar V4.14.7 DEV
- HA-Integration: 0.25.193
- Runtime: `4147r1`, Modulset: `E414-7A1`
- V9 ist eine additive lokale SQLite-Migration und ersetzt keine funktionierende Referenz.
- Keine automatische DRA-/PROD-Installation oder Freigabe. VM109 ist die einzige vorgesehene reale DEV-Abnahme.

## Änderungen

- Herkunftskennzeichnung `locations.location_origin` (V8).
- Explizite logische HA-Instanzen, optionale Clusterzuordnung, HA-Knoten/Fallback-Knoten und separate Ort-Quellverknüpfungen (V9); gleiche Koordinaten und gleichnamige Entity-IDs in anderen HA-Instanzen bleiben eigenständig.
- Keine automatische Remote-Synchronisierung, Cluster-Wahl, physische Geräte-Zusammenführung oder deduplizierte Alarmierung.
- Behobener Backend-Projektionsfehler für `locations_list`.
- Historische MA-007–MA-011- und P01-Testverträge mit den aktuellen Schemas abgeglichen; produktive Validierungsregeln nicht abgeschwächt.

## Tests und paketierter DEV-Stand

- `.github/workflows/ma-v9-consolidated-regression.yml` führt sämtliche relevanten MA-SQLite-, API-, UI- und Migrationsprüfungen **auf einem einzigen Commit** aus.
- Nach erfolgreichem Gate wird ein **exakt diesem Commit** zugeordnetes Installationsartefakt erzeugt, dessen Frontend-Spiegel, DRA-Vertrag und SHA256-Dateien geprüft werden.
- `.github/workflows/ma-v4147-dev-build-sync.yml` regeneriert und committed Frontend-Spiegel und Inventare; das V4.14.6-Build ist als historischer Workflow von automatischen Push-Triggern entkoppelt.
- Ein grünes CI-Gate ersetzt keinen Home-Assistant-Realtest auf DEV VM109. Keine stillschweigende Migration, kein automatisches Löschen von Local-To-do-Daten und keinerlei Änderung an WeatherRouter oder PROD.

## Nach realem VM109-Update prüfen

1. V4.14.7 / 0.25.193 installiert und Runtime `4147r1` bestätigt.
2. Bestehende Standortverwaltung und Suche einschließlich Teilstringsuche funktioniert unverändert.
3. SQLite optional aktivierbar, vorhandene Local-To-do-Orte bleiben vor expliziter Migration erhalten.
4. Unterschiedliche manuelle Orte mit identischen Koordinaten bestehen unabhängig; MA-Quell- und Clusteridentität ist **noch kein** öffentliches UI-Feature.
5. Moon Legend, OPERA, DWD, NASA, Wind, Temperatur, Eye/Legend Hub, Blitzortung und Alarme zeigen keine Regression.
