# Release Notes – V4.07 TEST CANDIDATE

**Datum:** 2026-09-12  
**Status:** Testkandidat / nicht veröffentlicht  
**Native Integration:** 0.19.0

V4.07 erweitert Gewitterradar um eine weltweite Standortarchitektur mit eigenem Referenztracker, weltweiter Ortssuche, gespeicherten Orten und dokumentierter Kopplung an die separat installierte Blitzortung-Integration.

## Neu

- Gewitterradar stellt in der nativen Integration einen eigenen GPS-`device_tracker` bereit.
- Neuer Service `gewitterradar.set_reference_coordinates` setzt Name, Breitengrad und Längengrad des eigenen Trackers und macht ihn zum aktiven Gewitterradar-Bezugsstandort.
- Neues Dashboard-Package V4.07 mit eigenem Template-Tracker `device_tracker.gewitterradar_dashboard` und Setz-Script.
- Native Integration und Dashboard verwenden bewusst verschiedene physische Tracker-IDs, damit Test-Koexistenz keine absichtliche Entity-ID-Kollision erzeugt.
- Weltweite Ortssuche im bestehenden Standortmenü: Personen → Zonen → Ort suchen → Gespeicherte Orte.
- Open-Meteo als primärer Geocoding-Dienst und OpenStreetMap Nominatim als begrenzter Rückfall.
- 249 ISO-3166-1-alpha-2-Ländercodes für lokale Länder-Autovervollständigung ohne Provider-Aufruf beim Tippen.
- Explizite Länderauswahl als harter Filter; automatisch ermitteltes Heimatland nur als weiche Präferenz.
- TEST3: Suchtreffer werden nach Ländern gruppiert, über eine Länderleiste direkt filterbar und pro Land auf-/zuklappbar dargestellt.
- Regressionsfall `Tokio`: ein bedeutender exakter globaler Treffer kann einen kleinen gleichnamigen Treffer im Heimatland überholen.
- `Nutzen` setzt den neuen Bezugsstandort, schließt die Suche automatisch und bewegt die Karte direkt dorthin.
- `★ Speichern` legt Orte mit Name und Koordinaten in der lokalen To-do-Ortsbibliothek `Gewitterradar Orte` ab.
- Gespeicherte Orte erscheinen wieder im Standortmenü und können ohne erneutes Geocoding verwendet werden.
- Der halbautomatische Einrichtungspfad ist dokumentiert: einmal Blitzortung auf den passenden Gewitterradar-Tracker als `Location entity` konfigurieren, danach Koordinatenwechsel über Gewitterradar.
- Realtest bestätigt: Gewitterradar-Tracker → Blitzortung-Standortquelle → neue Blitzdatenregion funktioniert mit weit entfernten Testorten.
- TEST4: eigener Bereich **Externe Dienste & Netzwerkfreigaben** unter Hilfe & Hinweise für Firewall-, VLAN-, Proxy-, DNS-Filter- und TLS-Inspection-Umgebungen.
- TEST4: clientseitige und serverseitige Netzwerkpfade werden getrennt dokumentiert.
- TEST4: tatsächliche Laufzeitziele inventarisiert: Open-Meteo, Nominatim, unpkg/Leaflet, a/b/c OpenStreetMap-Kachelhosts sowie serverseitig der Blitzortung-MQTT-Broker `blitzortung.ha.sed.pl:1883` für Blitzortung v1.7.1.
- TEST4: automatischer Vertrag für feste externe URL-Literale; neue Ziele müssen bewusst dokumentiert werden, bevor der Test wieder grün wird.

## Architekturentscheidung

V4.07 behandelt dauerhaft zwei getrennte Zustände:

1. **Bezugsstandort:** Karte, Radien, Entfernungen, Kompass und Bewertung.
2. **Aktiver Blitzdatenbereich:** geografische Region, für die Blitzortung aktuell MQTT-Daten bezieht.

Ein geänderter Tracker ist nicht automatisch der Beweis, dass der Blitzdatenbereich bereits synchronisiert wurde.

## Blitzortung-Kopplung

Für die Dashboard-/Package-Erprobung wird `device_tracker.gewitterradar_dashboard` verwendet. Für die native Integration ist `device_tracker.gewitterradar` vorgesehen.

Ein alter Blitzortung-Eintrag, der mit festen Koordinaten erstellt wurde, kann in Blitzortung v1.7.1 über „Neu konfigurieren“ nicht auf eine Standort-Entität umgestellt werden. Stattdessen wird ein neuer Eintrag mit Konfigurationstyp `Location entity` angelegt und auf den Gewitterradar-Tracker gesetzt.

Die Blitzortung-Integration wechselt ihre Datenregion erst nach ausreichender Bewegung des verfolgten Trackers; die Mindestbewegung entspricht 25 % des eingestellten Erfassungsradius.

## Netzwerk / Sicherheit

### Clientseitig aus Browser bzw. Companion-App

- `geocoding-api.open-meteo.com` – HTTPS/TCP 443
- `nominatim.openstreetmap.org` – HTTPS/TCP 443
- `unpkg.com` – HTTPS/TCP 443
- `a.tile.openstreetmap.org` – HTTPS/TCP 443
- `b.tile.openstreetmap.org` – HTTPS/TCP 443
- `c.tile.openstreetmap.org` – HTTPS/TCP 443

### Serverseitig vom Home-Assistant-System

- `blitzortung.ha.sed.pl` – MQTT/TCP 1883, verwendet durch die separate Blitzortung-Integration v1.7.1

Lokale Tracker-, Service- und To-do-Funktionen benötigen keine zusätzliche Internetfreigabe.

GitHub/HACS werden als Installations-/Updatepfad behandelt, nicht als normale Karten-Laufzeitabhängigkeit.

## Sicherheit / Kompatibilität

- keine Änderung fremder Blitzortung-ConfigEntries;
- keine `.storage`-Manipulation;
- keine privaten Home-Assistant-Frontend-APIs;
- kein veraltetes `device_tracker.see`;
- V4.06 bleibt eingefrorene Rückfallbasis;
- neue externe feste URL-Ziele lassen den TEST4-Vertrag fehlschlagen, bis Inventar und Dokumentation bewusst aktualisiert werden;
- kein V4.07-Release-Tag und kein Merge nach `main` vor bestätigtem Regressionstest.

## Noch offen vor einer finalen V4.07-Freigabe

- Entfernen/Rückgängig für gespeicherte Orte als kontrollierte Soft-Delete-Funktion;
- vollständige Übersetzung aller neuen V4.07-Such-, Speicher- und Netzwerktexte in die gesamte Sprachmatrix;
- reale Firewall-/DNS-Filter-/TLS-Inspection-Verprobung der TEST4-Hinweise;
- belastbarer UI-Status für vollständig/teilweise/nicht abgedeckte Blitzdatenregion;
- Tests von Blitzortung-Neuabonnierung, Latenz, Neustart/Restore und Recorder-Auswirkungen auf realem Home Assistant;
- Mobile/iPad/Desktop-Regression der finalen Suchoberfläche.
