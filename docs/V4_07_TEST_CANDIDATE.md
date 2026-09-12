# Gewitterradar V4.07 – Testkandidat

Stand: 2026-09-12

V4.07 ist in diesem Branch ein **technischer Testkandidat**, kein veröffentlichtes Release und kein Ersatz für den eingefrorenen V4.06-Releasezustand.

## Bereits integriert

- native Integration auf Version `0.19.0`;
- Gewitterradar-eigener moderner GPS-`device_tracker`;
- Service `gewitterradar.set_reference_coordinates` für temporäre/gefundene Koordinaten;
- automatische Auswahl des eigenen Trackers als Gewitterradar-Bezugsstandort beim Setzen neuer Koordinaten;
- read-only Erkennung, ob Blitzortung vorhanden ist und bereits dem Gewitterradar-Tracker folgt;
- separates Dashboard-Package `app_gewitterradar_v4_07_pkg.yaml` mit eigenem Template-Tracker und Setz-Script;
- dokumentierter halbautomatischer Blitzortung-Einrichtungsweg;
- bestehende V4.06-Frontend-Basis bleibt unangetastet.

## Bewusst noch nicht produktiv verdrahtet

Die zuvor erarbeitete UX für die weltweite Suche – Standort-Dropdown in der Reihenfolge Personen → Zonen → Ort suchen → gespeicherte Orte, Länder-Auto-Vervollständigung, Trefferliste, Nutzen/Speichern und Soft-Delete – ist noch **nicht fragil in die 1,6-MB-Frontend-Datei gepatcht**.

Dafür existiert ein isolierter UX-Prototyp. Der nächste bounded Frontend-Schritt muss einen stabilen Erweiterungspunkt im kanonischen gemeinsamen Frontend verwenden oder einen kontrollierten Build-/Delta-Schritt schaffen. Ein ungesicherter String-Patch in die erzeugte/minifizierte Datei ist ausdrücklich nicht akzeptiert.

## Erwarteter Testablauf

### Native Integration

1. V4.07-Testoverlay über eine bestehende V4.06-native Integration legen.
2. Home Assistant neu starten.
3. Prüfen, dass ein Gewitterradar-Tracker angelegt wurde (normalerweise `device_tracker.gewitterradar`).
4. `gewitterradar.set_reference_coordinates` mit einem deutlich entfernten Testort aufrufen.
5. Prüfen, dass Latitude/Longitude und `reference_name` aktualisiert werden und der Gewitterradar-Referenz-Select den eigenen Tracker verwendet.
6. Blitzortung einmalig auf diese tatsächliche Tracker-Entity konfigurieren.
7. Nach einem weiteren deutlichen Standortwechsel prüfen, dass Blitzortung seine Region gemäß eigener Bewegungsschwelle nachführt.

### Dashboard-Package

1. V4.06-Package deaktivieren/ersetzen; V4.06 und V4.07 nicht parallel laden.
2. `app_gewitterradar_v4_07_pkg.yaml` nach `/config/packages/` legen.
3. Home Assistant neu starten.
4. `device_tracker.gewitterradar_dashboard` prüfen.
5. `script.gewitterradar_set_reference_coordinates_dashboard` mit Testkoordinaten ausführen.
6. Blitzortung einmalig auf den Dashboard-Tracker konfigurieren.

## Sicherheits- und Architekturregeln

- Kein Schreiben in `.storage`.
- Keine Mutation eines fremden Blitzortung-ConfigEntry.
- Kein `device_tracker.see`.
- Keine Behauptung „Blitzdaten synchronisiert“, solange die tatsächlich aktive Blitzdatenregion nicht zuverlässig bestätigt wurde.
- Native Integration und Dashboard-Form verwenden absichtlich getrennte Tracker-IDs.
- Gespeicherte Orte werden später über den dokumentierten Local-To-do-Flexible-Datastore angebunden; der aktuelle Tracker ist kein Favoritenspeicher.

## Abbruch / Rückfall

V4.06 bleibt eingefrorene Referenz. Der Testkandidat wird auf einem Feature-Branch entwickelt. Bei Problemen ist auf V4.06 zurückzugehen; kein V4.07-Tag und kein Merge nach `main` erfolgt vor bestätigtem Regressionstest.
