# GewitterRadar V4.14.25 DEV – Smartphone-Nachpflege Standortverwaltung

## Betreiberbeobachtung
Drei Android-Screenshots: Standortverwaltung, geografisches Sichtfenster und Standortdetails. Die iPad-/Desktop-Abnahme folgt gesondert.

## Geänderte UI-Texte und Gestaltung
- `Standorte verwalten` → `Standortverwaltung` im Menüzugang und Dialogtitel. Technisches Modul weiterhin Monitored Areas.
- GeoPoint Inspector bleibt interner Funktionsname; Schaltflächen in Detail und Sichtfenster heißen `GeoPoint`.
- Checkbox im mobilen Standortdatensatz auf optische 18×18 Pixel beschränkt (unabhängig von globaler 44px Input-Regel); Touch-Aktionsschaltflächen weiterhin mindestens 44px hoch.
- Standortaktionen auf schmalen Displays in zwei gleich breiten Spalten und mit kompakteren Abständen. Batch-Archivieren/-Wiederherstellen genauso zweispaltig und lesbar, ohne über den Panelrahmen zu ragen.
- `Aufzeichnungsradius` wird mobil mit einer eigenen Beschriftungszeile gezeigt. Das verhindert den unschönen Umbruch im Wort. Daten und Werte bleiben unverändert.
- Mobile CSS ist ausschließlich auf Standortmanager/Standortdetail begrenzt; Premium-Rahmen und das hochwertige Schließen-X bleiben erhalten.

## Tests und Schutz
Neuer T0-Vertrag `tests/test_ma025_mobile_layout.mjs`, bestehende MA-/Frontend-/HA-Regression und verifizierte DRA-Spiegel in eigenem V4.14.25-Build. Keine Backend-, SQLite-, To-do-, Wetterdaten-, Tracker- oder Profiländerungen. Kein öffentlicher DEV-Release. Betreiberabnahme auf DEV VM109 mit Android und später iPad/Desktop weiterhin separat.
