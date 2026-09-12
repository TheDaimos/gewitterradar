# Gewitterradar – kanonische Roadmap

Stand: **12.09.2026**

Diese Datei ist die verbindliche Zukunfts-/Backlog-Liste für **Gewitterradar**. Sie wurde aus der früheren Roadmap in `TheDaimos/gewitterradar-dev` in das heutige kanonische Produktrepository überführt und gegen den tatsächlich erreichten V4.06-Stand bereinigt.

Ziel: Ideen und geplante Weiterentwicklungen dürfen nicht nur in Chats oder Notizen existieren, sollen aber auch **nicht automatisch zu einem Umsetzungsauftrag oder einer Versionszusage werden**.

## Statusmodell

- **NEXT / VERSIONIERT** – ausdrücklich für die nächste Versionslinie vorgesehen.
- **PLANNED / UNVERSIONIERT** – fachlich vorgemerkt, aber bewusst noch keiner Version zugeordnet.
- **EXPLORATION** – Idee/Prüfauftrag ohne Umsetzungszusage.
- **DONE / SUPERSEDED** – früherer Roadmap-Punkt ist umgesetzt oder durch die heutige Architektur ersetzt.

Arbeitsregel aus den globalen Defaults:

> **Idee → Backlog. Planung → Analyse/Versionierung. Umsetzung → erst nach ausdrücklicher Freigabe.**

---

## NEXT / VERSIONIERT

### V4.07 · PLANNED – Weltweite Orts-Suche

V4.07 ist aktuell die **einzige fest einer nächsten Version zugeordnete neue Fachfunktion**.

Ziel: Ein Ort soll per Freitext gesucht und anschließend als Gewitterradar-Referenzpunkt verwendet werden können.

#### Kernumfang

- Freitextsuche nach Orten;
- Suchergebnis liefert mindestens Anzeigename, Breitengrad und Längengrad;
- Suchergebnis kann zunächst als temporärer Bezugsstandort verwendet werden;
- Karte, Radien, Entfernungen, Kompass und Bewertung verwenden denselben zentralen Standortdatensatz wie vorhandene Home-Assistant-Personen/-Zonen;
- keine stillschweigende Speicherung des ersten Suchtreffers;
- klare Trennung zwischen Suche, Auswahl/Bestätigung und optionaler späterer Speicherung.

#### Internes Standortmodell

Die frühere Planung bleibt als Zielbild gültig:

```text
person | zone | custom | search
```

Die konkrete Implementierung darf dieses Modell verfeinern, soll aber die Fachlogik von der Karten-Engine und vom Geocoding-Anbieter entkoppeln.

#### Favoriten / eigene Orte

Favoriten bleiben Teil des Standort-Themenkomplexes, müssen aber nicht zwangsläufig vollständig in der ersten V4.07-Ausbaustufe landen. Vorgemerkt sind:

- Suchorte mit `☆ / ★` speichern bzw. entfernen;
- gespeicherte Orte in die bestehende Standortauswahl integrieren;
- Home-Assistant-Personen/Zonen klar von eigenen Orten trennen;
- eigene Favoriten umbenennen und löschen;
- Dubletten vermeiden;
- definierten Fallback verwenden, wenn ein aktuell ausgewählter Favorit gelöscht wird;
- Home-Assistant-Personen und -Zonen niemals aus Gewitterradar heraus löschen.

#### Bezugsstandort und Blitzdatenbereich getrennt behandeln

Die frühere internationale Architekturregel bleibt wichtig:

1. **Bezugsstandort** – bestimmt Karte, Radien, Entfernungen, Kompass und Bewertung.
2. **Aktiver Blitzdatenbereich** – beschreibt, für welches geografische Gebiet die aktuell empfangenen Blitzereignisse tatsächlich gelten.

Ein geografisch unpassender Blitzdatenbereich darf nicht als vermeintlich korrekte Live-Lage dargestellt werden.

#### Bevorzugtes Adapter-Ziel – noch zu verifizieren

Aus der alten Roadmap bleibt `device_tracker.gewitterradar` als bevorzugtes technisches Zielmodell vorgemerkt, **sofern eine aktuelle Machbarkeitsprüfung dies bestätigt**.

Vor einer Umsetzung muss geprüft werden:

- welcher aktuell unterstützte Home-Assistant-Mechanismus einen dynamischen virtuellen GPS-/Standortadapter sauber bereitstellt;
- ob Latitude/Longitude zuverlässig und persistent genug gesetzt werden können;
- ob die tatsächlich verwendete Blitzortung.org-Integration einen `device_tracker` als Standortquelle akzeptiert und Positionsänderungen zuverlässig nachführt;
- Latenz, Umschaltschwellen, Neustart-/Restore-Verhalten und Fehlerfälle;
- Recorder-/Datenbankauswirkungen;
- keine direkten `.storage`-Manipulationen und keine privaten/undokumentierten Home-Assistant-Frontend-APIs.

Falls das Modell technisch nicht sauber tragfähig ist, wird die Standort-/Blitzbereichs-Kopplung über einen unterstützten Backend-/Integrationsweg gelöst. Die Frontend-Karte darf Home-Assistant-Konfiguration nicht fragil manipulieren.

#### Anbieter-/API-Regel

Vor der Umsetzung wird die aktuelle Anbieterwahl bewusst geprüft. Das gemeinsame Dev-Toolkit enthält bereits wiederverwendbares Wissen zu Open-Meteo-Geocoding, aber Anbieterbedingungen, Quoten, Attribution und Eignung müssen für V4.07 aktuell neu verifiziert werden. Provider-spezifische Suchantworten sollen in provider-neutrale Koordinaten/Metadaten überführt werden.

---

## PLANNED / UNVERSIONIERT

### MapLibre als zweite Karten-Engine

Die bestehende MapLibre-Nebenentwicklung bleibt vorgemerkt.

Ziele:

- MapLibre als alternative Karten-Engine innerhalb **derselben** Gewitterradar-App;
- keine zweite getrennte Gewitterradar-Anwendung;
- gemeinsame Daten- und Steuerungsschicht für OSM/Leaflet und MapLibre;
- Blitzdaten, Radien, Standorte, Cluster, Filter und Statuslogik engine-unabhängig halten;
- bestehende stabile OSM-/Leaflet-Logik nicht unnötig umbauen, bevor die Abstraktionsschicht belastbar ist.

### Wetterebenen / Regen- und Radarzellen

Zusätzliche Wetterdaten sollen später als ein-/ausschaltbare transparente Ebenen über der vorhandenen Grundkarte geprüft werden.

Vorgemerkt:

- Regen-/Niederschlagszellen;
- Bewölkung;
- Layer einzeln ein-/ausschaltbar;
- Transparenz/Lesbarkeit so abstimmen, dass Blitze, Radien und Gefahrenbereiche klar bleiben;
- möglichst engine-unabhängige Layer-Architektur;
- spätere zeitabhängige Darstellung/Animation möglich.

#### Quellenkandidaten – noch keine Produktentscheidung

Für spätere Recherche sind vorgemerkt:

- **DWD Open Data** – ernsthafter Kandidat für Radar-/Niederschlagsdaten;
- **DWD KONRAD3D** – interessanter Kandidat für konvektive Zellinformationen und Merkmale wie Hagel, Starkregen und Böen;
- **DWD Mesozyklonen** – möglicher Baustein für Rotations-/Superzelleninformationen;
- **RainViewer** – möglicher Prototyp-/Referenzweg, ausdrücklich noch nicht als produktive Kernquelle festgelegt.

Vor einer technischen Entscheidung sind Datenformat, Aktualisierungsintervall, geografische Abdeckung, Lizenz/Nutzbarkeit, Attribution, Stabilität/Ausfallsicherheit und Home-Assistant-Eignung zu prüfen.

### Unwetter / Tornado / Alarmierung

Bewusst **ohne Versionszuordnung** vorgemerkt:

- Tornado-/Rotationswarnungen bzw. Tornado-Ereignisse als zukünftige Warn- oder Karteninformation;
- allgemeine Unwetterfunktionen über Blitzaktivität hinaus, z. B. Sturm, Hagel, Starkregen und weitere relevante Warnlagen;
- konfigurierbare Alarmierungs-/Benachrichtigungsfunktion für relevante Gefahrenlagen und ausgewählte Bezugsstandorte.

Dafür werden vor jeder Planung gute, belastbare und möglichst offizielle Quellen benötigt. Datenherkunft, Aktualität, Abdeckung, Lizenz, Warnsemantik, Fehlalarm-/Ausfallverhalten und Home-Assistant-Integration müssen fachlich geprüft werden. Ein automatisches „Tornado erkannt“-Versprechen darf nicht aus indirekten Rotationsdaten abgeleitet werden, wenn die Quelle dies fachlich nicht hergibt.

### 120-Minuten-Wiedergabe

Die letzten 120 Minuten der Blitzaktivität bleiben als eigener Wiedergabemodus geplant.

Vorgemerkt:

- LIVE-/Verlaufsmodus;
- Zeitleiste;
- Play/Pause;
- Scrubbing / manuelles Springen;
- verschiedene Wiedergabegeschwindigkeiten;
- klarer Rücksprung auf LIVE;
- zeitabhängige Darstellung von Blitzen und Clustern;
- später mögliche Kombination mit Wetterebenen.

#### Zwingende Datenhaltungsregel

Die Wiedergabe darf **nicht** davon ausgehen, dass Blitzortung.org zu jedem Zeitpunkt alle Ereignisse der letzten 120 Minuten als aktuelle Home-Assistant-Entitäten bereithält.

Deshalb ist ein eigener kontrollierter Ereignispuffer/Zwischenspeicher vorzusehen. Er darf nicht von der normalen Home-Assistant-Recorder-Historie als vollständiger Quelle abhängen, weil die kurzlebigen Blitzentitäten bewusst vom Recorder ausgeschlossen werden.

Vor Umsetzung sind Speichergrenzen, Deduplizierung, TTL/Alterung, Neustart-/Restore-Verhalten und sehr hohe Blitzaktivität ausdrücklich zu definieren und zu testen.

### Cluster-Verfeinerung

Spätere Optimierung der bestehenden Clusterlogik:

- frische/aktive Gefahrentreffer weiterhin einzeln sichtbar halten;
- ältere Treffer innerhalb eines Gefahrenbereichs bei Bedarf gruppieren;
- Lesbarkeit bei hoher Ereignisdichte verbessern;
- Verhalten nach Zoomstufe, Alter und Entfernung sauber definieren.

### Standortverwaltung abrunden

Nach der Grundfunktion der Ortssuche bleiben Komfortpunkte vorgemerkt:

- Favoriten umbenennen/löschen;
- Dubletten erkennen;
- temporäre Suchorte sauber behandeln;
- definiertes Verhalten bei nicht mehr verfügbaren Personen/Zonen/Favoriten.

### Geräte- und Oberflächenoptimierungen

Fortlaufender Querschnittspunkt:

- Desktop, Android, iPhone/iOS, iPad;
- Hoch-/Querformat;
- Touch-Ziele, Abstände, Dropdowns, Textüberläufe, Kartenhöhen und responsive Modulreihenfolge.

Freigegebene Bereiche werden nicht ohne bestätigten Fehler oder notwendige neue Funktion wieder geöffnet.

### Asset-/Signatur-Optimierung

Niedrige Priorität:

- eingebettete Signatur-/Grafikassets bei Bedarf hinsichtlich Dateigröße optimieren;
- keine sichtbare Änderung freigegebener Grafiken;
- nur nach direktem Vergleich und Integritätsprüfung übernehmen.

---

## EXPLORATION – Ideen ohne Umsetzungszusage

### Dokumentation gefährlich naher Blitzeinschläge über Local-To-do

Prüfidee: Den für gespeicherte Orte vorgesehenen **Local-To-do-Flexible-Datastore** später auch als rein lokale, nachvollziehbare Dokumentation besonders naher Blitzeinschläge verwenden.

Möglicher Anwendungsfall:

- Blitzeinschläge automatisch vormerken, wenn sie der `zone.home` bzw. einem ausdrücklich konfigurierten Schutzstandort gefährlich nahe kommen;
- einen solchen Treffer als separates Ereignis mit Zeitstempel, Koordinaten, Entfernung zum Schutzstandort und verfügbarer Quellen-/Ereignisinformation dokumentieren;
- diese Einträge nicht als Live-Telemetrie, sondern als seltene, menschenlesbare Ereignisdokumentation behandeln;
- mögliche spätere Nutzung als zusätzliche persönliche Dokumentationshilfe nach einem vermuteten Blitzschaden, etwa bei der zeitlichen Einordnung gegenüber einer Versicherung.

Vor jeder Planung gesondert bewerten:

- fachliche Aussagekraft und Genauigkeit der Blitzortungsdaten am konkreten Einschlagsort;
- sinnvolle Entfernungsschwelle und Vermeidung unnötiger/mehrfacher Einträge;
- welche Metadaten für eine spätere Nachvollziehbarkeit tatsächlich dauerhaft gespeichert werden sollten;
- Aufbewahrungsdauer, Datenschutz und lokale Datenpflege;
- klare Kennzeichnung, dass Gewitterradar damit **keinen amtlichen, gutachterlichen oder versicherungsrechtlich verbindlichen Nachweis** erzeugt, sondern ausschließlich zusätzliche Ereignisdokumentation;
- ob Local-To-do dafür langfristig die geeignete Persistenzschicht bleibt oder ein eigener Ereignisspeicher sinnvoller wäre.

Diese Idee ist ausdrücklich **noch keiner Version zugeordnet** und muss vor einer Umsetzung separat fachlich und technisch bewertet werden.

### Kompass im Stil einer alten Taschenuhr

- zusätzliche historische/instrumentelle Kompassgestaltung prüfen;
- bestehende Kompasslogik wiederverwenden;
- zunächst Zusatzdesign, kein Ersatz akzeptierter Designs;
- mobile Platz-/Bedienprobleme ausdrücklich prüfen.

### Vollbildmodus für die Karte

- engine-unabhängigen Vollbild-/Maximieren-Modus prüfen;
- OSM/Leaflet und später MapLibre berücksichtigen;
- Radien, Blitze, Cluster und relevante Layer-Schalter im Vollbild nutzbar halten;
- klarer Rücksprung zum normalen Layout;
- Desktop, Android, iOS/iPad Hoch-/Querformat prüfen.

### Earth-/3D-Kartenansicht

- spätere optionale Earth-/3D-Ansicht untersuchen;
- Erfahrungen aus Aurora als Referenz nutzen;
- OSM/Leaflet/MapLibre nicht ersetzen oder destabilisieren;
- API-Zugriff, Kontingente, Kosten, Lizenz, Geräteperformance und mobile Unterstützung vor Planung prüfen.

---

## DONE / SUPERSEDED – aus der alten Roadmap bereinigt

Folgende alte Roadmap-Themen sind keine offenen Zukunftspunkte mehr:

- **Native Home-Assistant-Integration** – mit der V4.06-Linie umgesetzt; Integration und Dashboard sind heute zwei Auslieferungsformen desselben kanonischen Produkts.
- **Informations-/Transparenzdialog als neues Grundfeature** – mit About/„Über Gewitterradar“ und „Hilfe & Hinweise“ weitgehend umgesetzt. Neue Datenquellen, Abdeckungszustände und Attributionen müssen diese vorhandenen Dialoge künftig ergänzen statt einen konkurrierenden dritten Informationsdialog einzuführen.
- **V4.00-HACS-/Repository-Zielarchitektur** – durch die heutige kanonische Ein-Produkt-/Zwei-Auslieferungsformen-Architektur ersetzt.
- **alte feste Recorder-Sensor-IDs** – durch die V4.06-Mehrgeräte-Wildcard-Regel ersetzt. Künftige Dokumentation muss die aktuelle Wildcard-Semantik verwenden.

---

## Dauerhafte technische Leitplanken für Roadmap-Arbeit

- `TheDaimos/gewitterradar` bleibt die kanonische Produktquelle für Integration und Dashboard.
- Neue Produktfunktionen gelten standardmäßig für beide Auslieferungsformen.
- Kritische DOM-/Recent-Pfade nicht ohne Not vollständig neu rendern; vorhandene Regression Guards beachten.
- Neue Karten-/Layer-Funktionen möglichst engine-unabhängig entwerfen.
- Bezugsstandort und aktiver Blitzdatenbereich bei internationaler Erweiterung getrennt modellieren.
- Ein unpassender Datenbereich darf nicht als korrekte Live-Lage ausgegeben werden.
- Datenquellen-/Warnfunktionen benötigen nachvollziehbare Attribution, Abdeckungs- und Ausfallsemantik.
- Vor jeder neuen Version: klarer Scope, echte Feature-Freeze-Grenze, kleine überprüfbare Implementierungsschritte und vorhandene Release-Gates beibehalten.
- Neue Ideen nach einem Freeze gehen in diese Roadmap bzw. in die nächste Versionslinie und öffnen den eingefrorenen Stand nicht automatisch wieder.
