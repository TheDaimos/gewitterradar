# Gewitterradar – kanonische Roadmap

Stand: **20.09.2026**

Diese Datei ist die verbindliche Zukunfts-/Backlog-Liste für **Gewitterradar**. Sie wurde aus der früheren Roadmap in `TheDaimos/gewitterradar-dev` in das heutige kanonische Produktrepository überführt und wird gegen den tatsächlich erreichten Produktstand gepflegt.

Ziel: Ideen und geplante Weiterentwicklungen dürfen nicht nur in Chats oder Notizen existieren, sollen aber auch **nicht automatisch zu einem Umsetzungsauftrag oder einer Versionszusage werden**.

## Statusmodell

- **ACTIVE / VERSIONIERT** – aktuell in Umsetzung bzw. Finalisierung innerhalb einer ausdrücklich festgelegten Versionslinie.
- **NEXT / VERSIONIERT** – ausdrücklich für die nächste Versionslinie vorgesehen.
- **PLANNED / UNVERSIONIERT** – fachlich vorgemerkt, aber bewusst noch keiner Version zugeordnet.
- **EXPLORATION** – Idee/Prüfauftrag ohne Umsetzungszusage.
- **DONE / SUPERSEDED** – früherer Roadmap-Punkt ist umgesetzt oder durch die heutige Architektur ersetzt.

Arbeitsregel aus den globalen Defaults:

> **Idee → Backlog. Planung → Analyse/Versionierung. Umsetzung → erst nach ausdrücklicher Freigabe.**

---

## NEXT / VERSIONIERT

### V4.09.xx – HACS-Distribution und Update-Darstellung

Nach dem V4.08-Freeze beginnen neue Arbeiten ausschließlich auf der **V4.09.xx**-Linie.

Für V4.09.xx ist der Weg in den offiziellen HACS-Standardkatalog ausdrücklich vorgemerkt:

- `TheDaimos/gewitterradar` für die Aufnahme in **hacs/default** vorbereiten und einreichen;
- HACS- und Hassfest-Anforderungen unmittelbar vor der Einreichung erneut gegen den dann aktuellen HACS-Stand prüfen;
- öffentliche Releases, Tags, `hacs.json`, Manifest, README, Branding und Repository-Metadaten auf die Standardrepository-Anforderungen abgleichen;
- Ziel: die bei benutzerdefinierten HACS-Repositories beobachtete verzögerte automatische Update-Erkennung deutlich verkürzen; die konkreten HACS-Aktualisierungsintervalle vor Umsetzung erneut verifizieren und nicht dauerhaft hart voraussetzen;
- das derzeit im HACS-Updateeintrag sichtbare **„icon not available“** separat verfolgen. Die native Home-Assistant-Integration zeigt das mitgelieferte Gewitterradar-Branding bereits korrekt; deshalb darf das funktionierende Integrationsbranding nicht als Workaround umgebaut werden;
- aktuelle HACS-/Home-Assistant-Änderungen zur Brands-/Update-Entity-Darstellung vor einer eigenen Umgehungslösung prüfen;
- nach Aufnahme in den Standardkatalog reale Update-Latenz auf einer Produktionsinstallation messen und dokumentieren.

Dieser Punkt ist ein **V4.09-Arbeitsauftrag**, nicht Bestandteil des eingefrorenen V4.08-Funktionsumfangs.

---

## ACTIVE / VERSIONIERT

### V4.09.05 – Android-Touch-Dragging absichern

Aktiver Teststand: `feature/v4.09.05-android-touch-drag`.

Reale Abnahme von V4.09.04:

- Desktop: Kompass und Medaillon ein-/ausblendbar und frei verschiebbar – **bestätigt**.
- Android: beide ein-/ausblendbar, aber Finger-Dragging funktioniert nicht – **offener Fehler**.
- Android: Medaillon soll gegenüber V4.09.04 **15 % kleiner** dargestellt werden.
- iPad/iPad Pro: bleibt verbindliche Zielplattform für freies Touch-Dragging.

V4.09.05 ergänzt einen echten Touch-Event-Fallback neben dem bestehenden Pointer-Event-Pfad. `touchstart/touchmove/touchend/touchcancel` laufen nicht-passiv auf der jeweiligen Overlay-Fläche, damit Android/HA-WebView die Geste nicht an Leaflet oder das native Vollbild-`dialog` verliert. Pointer Events bleiben für Maus, Stift und kompatible Touch-Browser bestehen.

Das Medaillon erhält eine Android-spezifische Größenklasse. Die Android-Abmessungen betragen exakt 85 % der bisherigen mobilen Werte; Desktop und iPad bleiben unverändert.

Vor Promotion erforderlich:

- reale Android-Prüfung beider Drag-Gesten;
- Sichtprüfung der um 15 % reduzierten Android-Medaillongröße;
- iPad/iPad Pro Touch-Regression;
- Desktop Maus-Regression;
- Layer-Control, Standort, Warnsystem-Test-Fail-Closed und separates Kartenfenster regressionsprüfen.

Verbindlicher Abschlussstand von V4.08:

`docs/HANDOFF_V4_08_RELEASE_CLOSEOUT_2026-09-18.md`

---

## DONE / SUPERSEDED

### V4.07 – weltweite Orts-Suche / dynamischer Bezugsstandort

Der frühere V4.07-Roadmapblock ist abgeschlossen. Die Funktionen wurden über V4.07.56/V4.07.57 veröffentlicht und bilden zusammen mit den dauerhaft geschützten Diagnose-/Hi-Res-Verträgen die Basis für V4.08. Historische Details bleiben in `docs/HISTORY.md`, `docs/MILESTONES.md` und den V4.07-Release-Notes erhalten.

### V4.08 – Cluster-Auflösung und Cluster-Navigation

V4.08 wurde am 18.09.2026 veröffentlicht. Clusterprofile, Cluster-Navigation, HTML-v14/WebP-Dokumentation, Releaseverträge, Golden Master und beide Auslieferungsformen sind abgeschlossen. Neue funktionale Änderungen gehören nicht mehr in V4.08.

---

## PLANNED / UNVERSIONIERT

### MapLibre als zweite Karten-Engine

Die bestehende MapLibre-Nebenentwicklung bleibt vorgemerkt.

Ziele:

- MapLibre als alternative Karten-Engine innerhalb **derselben** Gewitterradar-App;
- keine zweite getrennte Gewitterradar-Anwendung;
- gemeinsame Daten- und Steuerungsschicht für OSM/Leaflet und MapLibre;
- Blitzdaten, Radien, Standorte, Cluster, Filter und Statuslogik engine-unabhängig halten;
- bestehende stabile OSM-/Leaflet-Logik nicht unnötig umbauen, bevor die Abstraktionsschicht belastbar ist;
- später einen kontrollierten Engine-Umschalter OSM/Leaflet ↔ MapLibre ermöglichen.

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

### Monitored Areas – feste Schutz-/Überwachungsstandorte

Separate, feste Standorte sollen unabhängig vom aktuell ausgewählten Gewitterradar-Referenzstandort überwacht werden können. Die ausführliche Fachnotiz liegt in `docs/FUTURE_MONITORED_AREAS.md`.

Vorgemerkt:

- eigener Abschnitt **Monitored Areas** in der Standortauswahl;
- vorhandene V4.07-Orts-/Koordinatenpipeline wiederverwenden;
- `+` zum Hinzufügen sowie `−` zum Entfernen/Deaktivieren;
- persistente lokale Standortbibliothek, möglichst analog zu gespeicherten Orten;
- mehrere überwachte Standorte parallel und unabhängig vom aktuellen Kartenstandort;
- pro Standort Name, Koordinaten, Überwachungsstatus und fachlich begründeter Radius;
- Alarm bei neuen Blitzereignissen innerhalb des festgelegten Nahbereichs;
- Deduplizierung, Cooldown/Bündelung und später Home-Assistant-/Companion-Benachrichtigungen prüfen;
- geplantes Premium-Symbol: hochwertiges goldenes Schild mit rotem Blitz;
- Radius nicht willkürlich auf 3 km oder 5 km festlegen, sondern vor Umsetzung fachlich recherchieren;
- Blitzortungs-/Datenarchitektur für weit voneinander entfernte überwachte Orte klären; eine einzige regionsbezogene Subscription darf nicht als globale Überwachung missverstanden werden;
- keine Behauptung eines amtlichen, gutachterlichen oder versicherungsrechtlich verbindlichen Blitzschadennachweises ohne belastbare Grundlage.

### Globales Gewitter-Lagebild / Storm Feed

Spätere Feed-/Lagebild-Idee für starke Gewitter weltweit.

Vorgemerkt:

- RSS-/Feed-artige Liste aktuell besonders aktiver Gewitter;
- Filter **Weltweit → Kontinent → Land**, optional Region/Bundesland bei belastbarer Datenquelle;
- Ort/Region/Land, Kontinent, Aktivität, Zeitfenster und Aktualisierungszeit pro Eintrag;
- fachlich begründete Ranglogik aus Blitzanzahl/-dichte, räumlicher Ausdehnung, Trend und Aktualität statt scheinpräziser „Stärke“;
- Klick/Tap fokussiert das Gewitterzentrum auf der Karte;
- nächstgelegenen geeigneten Ort bestimmen und über die vorhandene Standortpipeline als Gewitterradar-Referenz verwenden;
- klar zwischen Feed-Lagebild und bereits synchronisierter Blitzortung-Livedatenregion unterscheiden;
- keine Weltrangliste durch zyklisches Verschieben des Gewitterradar-Trackers oder weltweites „Abscannen“ der regionsbezogenen Blitzortung-Subscription erzeugen;
- zusätzliche externe Datenquelle/API nur nach Lizenz-, Nutzungs-, Datenschutz-, Rate-Limit- und Ausfallprüfung;
- Caching/Fallback so entwerfen, dass der normale Karten-/Saved-Places-Betrieb nicht von einem globalen Feed abhängt;
- kompakte mobile Feed-/Kartenansicht für Android/iPhone/iPad/Desktop planen.

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

Nach der V4.07-Grundfunktion bleiben Komfortpunkte vorgemerkt:

- Favoriten/eigene Orte umbenennen;
- zusätzliche Dubletten- und Konfliktfälle sauber behandeln;
- temporäre Suchorte weiter verfeinern;
- definiertes Verhalten bei nicht mehr verfügbaren Personen/Zonen/Favoriten;
- Home-Assistant-Personen und -Zonen niemals aus Gewitterradar heraus löschen.

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

### Earth-/3D-Kartenansicht

- spätere optionale Earth-/3D-Ansicht untersuchen;
- Erfahrungen aus Aurora als Referenz nutzen;
- OSM/Leaflet/MapLibre nicht ersetzen oder destabilisieren;
- API-Zugriff, Kontingente, Kosten, Lizenz, Geräteperformance und mobile Unterstützung vor Planung prüfen.

---

## DONE / SUPERSEDED – aus der alten Roadmap bereinigt

Folgende alte Roadmap-Themen sind keine offenen Zukunftspunkte mehr:

- **Native Home-Assistant-Integration** – mit der V4.06-Linie umgesetzt; Integration und Dashboard sind heute zwei Auslieferungsformen desselben kanonischen Produkts.
- **V4.07-Ortssuche als reine Planungsfunktion** – mit der V4.07.31-Linie weitgehend umgesetzt; verbleibend sind Freigabe-/Regressionsthemen und einzelne Komfort-/Statuspunkte, nicht mehr die Grundimplementierung.
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
