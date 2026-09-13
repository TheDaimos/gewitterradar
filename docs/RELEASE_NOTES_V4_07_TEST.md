# Release Notes – V4.07 TEST CANDIDATE

**Datum:** 2026-09-13  
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
- TEST5: fehlende Ortsbibliothek erklärt nun direkt den vollständigen Home-Assistant-Pfad: **Einstellungen → Geräte & Dienste → Integration hinzufügen → „Local to-do“ suchen/auswählen → Liste exakt „Gewitterradar Orte“ nennen**.
- TEST5: derselbe Einrichtungspfad ist dauerhaft unter **Hilfe & Hinweise → Referenzstandort** dokumentiert; die englische Grundfassung wurde parallel ergänzt.
- TEST6: gespeicherte Orte können direkt im Standortmenü mit `×` weich entfernt werden. Dabei wird der zugehörige Local-To-do-Eintrag nicht gelöscht, sondern auf `completed` gesetzt.
- TEST6: weich entfernte Orte erscheinen unter **„Entfernte Orte“** und können mit `↶` wiederhergestellt werden; Name, Koordinaten und Metadaten bleiben erhalten.
- TEST6: Realtest auf Home Assistant bestätigt das weiche Entfernen mit `×` und die anschließende Wiederherstellung mit `↶`.
- TEST6: Realtest bestätigt außerdem den Sonderfall „Ort speichern → weich entfernen → denselben Ort erneut über die Suche speichern“: Der vorhandene `completed`-Eintrag wird auf `needs_action` zurückgesetzt, der Ort erscheint wieder unter „Gespeicherte Orte“ und es entsteht kein Duplikat.
- TEST6: der Kandidatenvertrag verbietet für diese Funktion `todo.remove_item`; Entfernen bleibt ausdrücklich reversibel und verwendet `todo.update_item`.
- V4.07-Oberflächenfeinschliff: Das Standortwahl-Menü wird beim Klick/Tap außerhalb geschlossen; Interaktionen innerhalb des Menüs und auf den beiden Standort-Schaltflächen bleiben davon ausgenommen. Realtest bestätigt das gewünschte Schließverhalten.
- TEST7: Die **Release History** erhält einen kompakten DE/EN-Umschalter im Kopfbereich. Beide Sprachfassungen enthalten die vollständige Versionshistorie; bei Deutsch sowie den vier deutschen Dialektvarianten startet die Ansicht auf DE, bei allen anderen Oberflächensprachen auf EN. Eine manuelle Auswahl bleibt beim erneuten Öffnen erhalten.
- TEST7: Überschrift, Untertitel, Schließen-Beschriftung und aktive Sprachschaltfläche werden mit umgeschaltet und sind über `aria-label`/`aria-pressed` zugänglich. Der Realtest wurde erfolgreich abgeschlossen.
- TEST7: Der V4.07-Eintrag der Release History beschreibt nun den tatsächlich implementierten Testkandidaten statt eines veralteten „PLANNED“-Hinweises.
- TEST7: Das zunächst eingesetzte verbundene-Knoten-Symbol für **Externe Dienste & Netzwerkfreigaben** war technisch korrekt, wurde im Realtest jedoch aus gestalterischen Gründen verworfen.
- TEST8: Das ausgewählte Symbol Nr. 4 ersetzt dieses Symbol technisch durch ein deterministisches Schild-/Firewall-Symbol mit Mauerstruktur und bidirektionalen Netzwerkpfeilen. Es ist direkt als `currentColor`-SVG eingebettet und fügt weder eine neue Bilddatei noch eine externe Laufzeitabhängigkeit hinzu. Für die kleine Darstellung ist als letzter optischer Feinschliff die einfachere Shield-Variante 2 ausgewählt und zur späteren technischen Übernahme vorgemerkt.
- V4.07-Sprachmatrix abgeschlossen: Sämtliche neuen Such-, Speicher- und Standorttexte liegen für **15 Sprachen plus 4 deutsche Dialektvarianten** vor. Der bisherige Deutsch/Englisch-Sonderpfad der V4.07-Ortssuche wurde durch eine vollständige 19-Sprachen-Tabelle ersetzt.
- V4.07-Hilfe-Sprachmatrix abgeschlossen: Die neuen Abschnitte **Referenzstandort** sowie **Externe Dienste & Netzwerkfreigaben** werden auch für die 17 extern geladenen nicht-nativen Sprachvarianten vollständig ergänzt. Ein eigener CI-Vertrag prüft Struktur, Pflichtfelder und die sicherheitsrelevanten Laufzeitdetails aller Sprachfassungen.
- Das korrigierte V4.07-Dashboard-Package basiert wieder auf dem vollständigen V4.06-Paket, behält alle sechs Legacy-Migrationspfade und wird im kanonischen V4.07-Zweig automatisiert gegen die Home-Assistant-Quelle auf Byte-/YAML-Parität geprüft.
- Das korrigierte V4.07-Dashboard-Package wurde zusätzlich nach `TheDaimos/gewitterradar-dashboard` synchronisiert; dessen Prüfsummenbestand enthält nun auch `dist/app_gewitterradar_v4_07_pkg.yaml`.
- TEST9: Im Feld **Ort / PLZ** wurde ein kompaktes `×` zum schnellen Zurücksetzen der Suchtexteingabe ergänzt. Die erste TEST9-Fassung verursachte dabei eine Regression: Durch die zusätzliche Input-Hülle war die bisherige `previousElementSibling`-Zuordnung zum Label nicht mehr gültig; die Dialoginitialisierung brach ab und Felder/Schaltfläche blieben unbeschriftet.
- TEST9R1: Die Regression ist behoben. Das Label wird nun robust über den umgebenden Feldcontainer aufgelöst; ein zusätzlicher CI-Regressionsschutz verbietet die fehleranfällige alte Zuordnung. Der korrigierte Kandidaten-Build läuft erfolgreich durch. Der reale Home-Assistant-Test steht noch aus.

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
- neue externe feste URL-Ziele lassen den TEST4+-Vertrag fehlschlagen, bis Inventar und Dokumentation bewusst aktualisiert werden;
- Soft-Delete für gespeicherte Orte verändert ausschließlich den Status des eigenen Local-To-do-Eintrags und löscht den Eintrag nicht;
- TEST7/TEST8/TEST9R1 fügen keine neue externe Laufzeitabhängigkeit hinzu;
- TEST9R1 enthält einen expliziten Regressionstest für die Label-Auflösung des umhüllten Ort/PLZ-Eingabefelds;
- kein V4.07-Release-Tag und kein Merge nach `main` vor bestätigtem Regressionstest.

## Noch offen vor einer finalen V4.07-Freigabe

- Shield-Variante 2 für **Externe Dienste & Netzwerkfreigaben** technisch übernehmen und final visuell akzeptieren;
- TEST9R1 `×`-Zurücksetzen im Feld **Ort / PLZ** real auf Home Assistant prüfen;
- ländergruppierte Ortssuche und Ranking auf den vorgesehenen realen Geräteklassen weiter regressionsprüfen;
- reale Firewall-/DNS-Filter-/TLS-Inspection-Verprobung der TEST4-Hinweise;
- belastbarer UI-Status für vollständig/teilweise/nicht abgedeckte Blitzdatenregion;
- Tests von Blitzortung-Neuabonnierung, Latenz, Neustart/Restore und Recorder-Auswirkungen auf realem Home Assistant;
- Mobile/iPad/Desktop-Regression der finalen Suchoberfläche.
