# Release Notes – V4.07 TEST CANDIDATE

**Datum:** 2026-09-12  
**Status:** Testkandidat / nicht veröffentlicht  
**Native Integration:** 0.19.0

V4.07 beginnt die weltweite Standortarchitektur. Dieser Testkandidat konzentriert sich auf die sicherheitskritische Verbindung zwischen einem frei wählbaren Bezugsort und der Region, für die Blitzortung tatsächlich Daten abonniert.

## Neu

- Gewitterradar stellt in der nativen Integration einen eigenen GPS-`device_tracker` bereit.
- Neuer Service `gewitterradar.set_reference_coordinates` setzt Name, Breitengrad und Längengrad des eigenen Trackers und macht ihn zum aktiven Gewitterradar-Bezugsstandort.
- Gewitterradar erkennt read-only, ob Blitzortung installiert ist und ob ein Blitzortung-Eintrag bereits dem tatsächlichen Gewitterradar-Tracker folgt.
- Neues Dashboard-Package V4.07 mit eigenem Template-Tracker `device_tracker.gewitterradar_dashboard` und Setz-Script.
- Native Integration und Dashboard verwenden bewusst verschiedene physische Tracker-IDs, damit Test-Koexistenz keine absichtliche Entity-ID-Kollision erzeugt.
- Der halbautomatische Einrichtungspfad ist dokumentiert: einmal Blitzortung auf den passenden Gewitterradar-Tracker konfigurieren, danach Koordinatenwechsel über Gewitterradar.
- Entwicklerkontakt zu `homeassistant-blitzortung` ist als Projekt-To-do festgehalten; Ziel ist ein offiziell unterstützter Reconfigure-Wechsel zwischen festen Koordinaten und Standort-Entity.

## Architekturentscheidung

V4.07 behandelt dauerhaft zwei getrennte Zustände:

1. **Bezugsstandort:** Karte, Radien, Entfernungen, Kompass und Bewertung.
2. **Aktiver Blitzdatenbereich:** geografische Region, für die Blitzortung aktuell MQTT-Daten bezieht.

Ein geänderter Tracker ist nicht automatisch der Beweis, dass der Blitzdatenbereich bereits synchronisiert wurde.

## Sicherheit / Kompatibilität

- keine Änderung fremder Blitzortung-ConfigEntries;
- keine `.storage`-Manipulation;
- keine privaten Home-Assistant-Frontend-APIs;
- kein veraltetes `device_tracker.see`;
- V4.06 bleibt eingefrorene Rückfallbasis;
- kein V4.07-Release-Tag und kein Merge nach `main` vor bestätigtem Regressionstest.

## Noch offen

- produktive Verdrahtung der weltweiten Ortssuche im bestehenden Standort-Dropdown;
- Übernahme des bereits getesteten Toolkit-Geocoding-Kerns in einen kontrollierten Gewitterradar-Frontend-/Build-Pfad;
- gespeicherte Orte über Local-To-do-Flexible-Datastore;
- belastbarer UI-Status für vollständig/teilweise/nicht abgedeckte Blitzdatenregion;
- Tests von Blitzortung-Neuabonnierung, Latenz, Neustart/Restore und Recorder-Auswirkungen auf realem Home Assistant;
- Mobile/iPad/Desktop-Regression der finalen Suchoberfläche.
