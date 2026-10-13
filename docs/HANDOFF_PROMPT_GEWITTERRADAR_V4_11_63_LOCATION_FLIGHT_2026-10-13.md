Bootstrap: Daimos

Projekt: Gewitterradar
Repository: TheDaimos/gewitterradar
Entwicklungszweig: feature/v4.11-development
DRA-Bereitstellung: deploy/dev

Bitte setze die Arbeit anhand der verbindlichen ausführlichen Übergabe fort:

docs/HANDOFF_GEWITTERRADAR_V4_11_63_LOCATION_FLIGHT_2026-10-13.md

Lies außerdem:
- docs/RELEASE_NOTES_V4_11_63_DEV.md
- frontend/modules/ui/controls.js
- frontend/modules/location/radii-map.js
- frontend/modules/map/clusters-recent.js
- frontend/modules/diagnostics/map-diagnostics.js

WICHTIG: Auf Android sind die Standort-Dropdowns (inklusive Scrollen und gelöschter Orte) sowie die Einordnung der Menüdarstellung und Menügeschwindigkeit unter Punkt 5 inzwischen vom Nutzer positiv bestätigt. Diese Funktionen auf keinen Fall erneut grundlos verändern.

OFFEN: Die frühere Standort-Kamerafahrt (Herauszoomen → Flug zum neuen Ort → Heranzoomen) fehlte. V4.11.62 erhielt flyTo, hat aber laut explizitem Android-Realtest des Nutzers **nicht** funktioniert: „Hat nicht funktioniert, keine Änderung“; Video 72689.mp4. V4.11.63 DEV enthält bereits den neueren Fix für konkurrierende HA- und UI-Kamerafahrten mit Handoff; 4/4 Bereitstellungsprüfungen grün, aber noch KEINE Android-Realabnahme.

Beim Übergabezeitpunkt war V4.11.63 DEV auf beiden Zweigen mit Software-Commit:
1c67d06ba5caec27d7bb61997c32ce9ab82bf0ef
Runtime 41163r1, Modulsatz E411-63A1.
Der reine Dokumentations-Commit kann feature/v4.11-development inzwischen vor deploy/dev setzen; er ist keine neue Softwareversion.

Dein nächster Schritt: ZUERST live die Branch-Heads und V4.11.63 prüfen, dann die bestehende V4.11.63-Korrektur fachlich bewerten und eine gezielte Android-Realabnahme des gespeicherten Standortwechsels durchführen lassen, sofern sie noch nicht stattgefunden hat. NICHT denselben V4.11.62-flyTo-Fix wiederholen. Falls die Animation weiterhin fehlt, zuerst neues Video / Kartendiagnose mit geo.reference.handoff.* und geo.focus.* analysieren und die zwei konkurrierenden Kamerawege exakt eingrenzen. Keine blinden Versionen und keine ausufernden Testserien.

Unterscheide bei jeder Aussage sauber: GitHub erfolgreich ≠ beim Nutzer installiert ≠ auf Android abgenommen. Die intakten Standortmenüs, Punkt-5-Einstellungen, Touch-Gesten, Cluster, Blitze und WeatherRouter schützen. Bitte auf Deutsch, konkret und eigenständig weiterarbeiten.
