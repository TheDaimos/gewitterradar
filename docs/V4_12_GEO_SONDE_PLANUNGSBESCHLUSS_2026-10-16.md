# Gewitterradar V4.12 – Geo-Sonde (verbindlicher Planungsbeschluss)

Stand: **16.10.2026**
Status: **NEXT / VERSIONIERT – für V4.12 fest eingeplant; Implementierung noch nicht freigegeben**
Produkt: **Gewitterradar**
Themenbereich: **Layer-Menü / Kartenwerkzeuge / WeatherRouter-Consumer-API**

## Beschluss und Ziel

Die **Geo-Sonde** wird als fester Funktionsblock von **Gewitterradar V4.12** entwickelt. Sie erlaubt es, einen beliebigen Punkt auf der Karte auszuwählen und dazu punktbezogene Wetter-, Umwelt-, Meeres- und Gefahreninformationen abzurufen, soweit dafür geeignete Datenangebote vorhanden sind.

Die Geo-Sonde wird im **bestehenden Layer-Menü** ein- und ausgeschaltet, nicht als eigene Anwendung oder eigener Wetterdienst entwickelt.

**Fest zugesagter V4.12-Kern:** Aktivierung im Layer-Menü, Koordinatenauswahl per Karte, sichtbarer und verschiebbarer Messpunkt, frei verschiebbare kompakte Informationsanzeige, gezielte Abfrage über WeatherRouter vorhandener für den Punkt geeigneter Fähigkeiten, nachvollziehbare Quellen-/Datenstatusanzeige, Abschalt- und Ressourcenschutz.

Nicht alle denkbaren Fachbereiche werden damit automatisch als Datenangebot für V4.12 zugesagt. Neue Provider, fachliche Erweiterungen oder externe Erkennungsverfahren benötigen jeweils gesonderte Prüfung und Umsetzung.

## 1. Bedienung

- Ein eigener Eintrag **„Geo-Sonde“** im bestehenden **Layer-Menü**; klar erkennbarer Zustand Ein/Aus.
- Aktiviert: Ein Klick auf die Karte beziehungsweise ein Fingertipp setzt die Sonde an eine frei wählbare Koordinate, unabhängig von Städten, gespeicherten Orten oder Blitzortung-Trackern.
- Sichtbarer Marker, beispielsweise ein kleines goldenes Fadenkreuz / Stift / Zeigestock im Gewitterradar-Design.
- Sonde nachträglich verschieben; Kartenbedienung auf Desktop, Android und iPad darf nicht unkontrolliert blockiert werden.
- Nach dem Setzen: eine kompakte, frei verschiebbare Informationskarte mit **Breiten- und Längengrad**, Kopierfunktion und wählbaren Fachbereichen.
- Ausschalten: Sonde und ihre Ansicht schließen; keine Hintergrundabfragen oder versehentliche Tracker-/Standortveränderung.
- Kartenansichten Standard, Groß, Vollbild und eigenes Fenster sowie bestehende Layer, Menüs und Gesten respektieren.
- Für V4.12 zunächst ein aktiver Messpunkt als Mindestumfang. Vergleich mehrerer Sonden, Speicherung und Verfolgung bewegter Ereignisse bleiben **optionale spätere Ausbaustufen**.

## 2. Geografische Grundlage

- Die geografischen Koordinaten werden direkt aus dem geklickten Kartenpunkt (Leaflet bzw. Kartenadapter) ermittelt.
- **Kein Ortsnamensverzeichnis erforderlich.** Die Sonde funktioniert über Ozeanen, Arktis, Wüsten und an beliebigen anderen Kartenpunkten.
- Umgekehrte Ortssuche / nächster Ortsname bei Bedarf als zusätzliche optionale Information; nicht mit der primären Geokoordinate verwechseln.
- Koordinaten auch dann abfragbar halten, wenn WetterRouter momentan keine geeigneten Daten zurückliefert.

## 3. Datenfluss und Zuständigkeiten

1. **Gewitterradar** verwaltet Layer-Menü, Sondenmarker, Kartenausschnitt und Ergebnisdarstellung.
2. **WeatherRouter** erhält explizit Breite, Länge, gewünschte Fähigkeiten und gegebenenfalls Zeitbezug.
3. WeatherRouter prüft Provider-Freigaben, Gebiet/Abdeckung, fachliche Eignung, Zeitbezug und Verfügbarkeit; Datenlieferung über vorhandene beziehungsweise bedarfsgerecht erweiterte **Consumer API**.
4. Gewitterradar zeigt nur belegte Ergebnisse an und unterscheidet **Messung, Satellitenbeobachtung, Schätzung, Modell und Prognose**. Je Ergebnis Quelle, Bezugszeit, Datenalter, Einheit, räumlichen Bezug und Einschränkungen transparent machen.
5. Fehlende oder nicht unterstützte Fachinformationen als **nicht verfügbar** beziehungsweise **nicht angeboten** kennzeichnen; keine geschätzten Messwerte ohne entsprechende Kennzeichnung erfinden.

WeatherRouter bleibt Datenbeschaffer, Prüfer und Verteiler; er wird **keine eigenständige Wetterkarten-Anwendung**. Verbraucherübergreifend nutzbare Punktabfragen dürfen auch anderen Anwendungen wie Aurora Borealis dienen.

## 4. Fachgebiete und Beispiele (Zielkatalog, Verfügbarkeit pro Capability prüfen)

- **Wetter:** Lufttemperatur, gefühlte Temperatur, Windgeschwindigkeit/-richtung, Böen, Niederschlag, Luftfeuchte, Luftdruck.
- **Stürme und Hurrikans:** lokale Bedingungen, Sturm-/Wirbelsturmwarnungen, Wellen und ggf. zeitabhängige Zugbahndaten; Wind am gewählten Punkt ist nicht automatisch der maximale Wind des gesamten Sturms.
- **Arktis / Polarregionen:** Temperatur, Wind, Sicht, Meereisprodukte und Polartag/-nacht, soweit geeignete Dienste existieren.
- **Wüste:** Wind, Temperatur, Luftfeuchtigkeit, Staub-/Sandsturm- und UV-Informationen, soweit geeignete Dienste existieren.
- **Küste / Meer:** Gezeiten, Wasserstände, Strömung, Wellen, Wassertemperatur mit ausdrücklich angegebenem Messpunkt-/Modellbezug; Stationswerte nicht als exakte Messung an der Klickkoordinate ausgeben.
- **Natur und Umwelt:** Luftqualität, Pollen sowie belegte Vorkommens-/Verbreitungsinformationen von Pflanzen und Tieren, besonders giftigen Pflanzen, sofern dafür geeignete und nutzbare Biodiversitätsdaten angeboten werden.
- **Giftige Pflanzen:** Aus einer Klickkoordinate kann das **mögliche oder dokumentierte Vorkommen** einer Art abgeleitet werden, nicht die sichere Identität einer gerade sichtbaren Pflanze. Bilderkennung wäre ein anderer, separat zu planender Funktionsumfang.

## 5. Ressourcen- und Sicherheitsregeln

- Beim Setzen der Sonde **keine unkontrollierte Abfrage aller Provider**.
- Erst angebotene/zulässige Themen ermitteln, dann vom Benutzer gewählte Fähigkeiten gezielt anfragen; soweit sinnvoll mehrere Capability-Abfragen bündeln.
- Begrenzte gleichzeitige Anfragen, Zeitüberschreitungen, kontrollierte Zwischenspeicherung und Abbruch veralteter Anfragen nach Standortverschiebung.
- Keine Änderungen der Blitzortung-Abonnements, des Erfassungsradius oder des Karten-Trackers durch Sondennutzung.
- Vor der Aufnahme neuer Quellen Lizenz, fachliche Aussagekraft, Datenschutz, Attribution, geografische Abdeckung und Aktualisierungsfrequenz prüfen.
- Ergebnisse sind fachliche Informationsprodukte und **keine amtliche Gefahrenfreigabe**.

## 6. V4.12-Abnahme

- Geo-Sonde ist im Layer-Menü zuverlässig aktivierbar/deaktivierbar.
- Kartenklick liefert die richtige Koordinate auf Kontinenten, Ozeanen und in hohen Breiten.
- Marker lässt sich auf Desktop und Touchgeräten nutzen und verschieben.
- Auswahl einer vorhandenen WeatherRouter-Fähigkeit führt zu nachvollziehbarer Punktabfrage.
- Beispielprüfungen: Deutschland, Kuba/Hurrikanregion, Arktis, Sahara, Nordseeküste.
- Ohne Daten oder bei Fehlantwort erscheint ein korrekter Verfügbarkeitsstatus; keine erfundenen Werte.
- Quellen-/Zeit-/Abdeckungsinformationen sind in Anzeige und Diagnose nachvollziehbar.
- Wiederholte Sondenbewegungen verursachen keine unbegrenzten Abfragen oder Speicherwachstum.
- V4.11-Niederschlagsdarstellung einschließlich P7-010, bestehende Tracker, Cluster, Instrumente und Kartenbedienung bleiben funktionsfähig.
- Alle Frontend-Auslieferungen (native HA-Integration und Dashboard) verhalten sich gleich.

## 7. Abgrenzung zur laufenden V4.11

- **V4.11** bleibt für FLK-01, Weather-Engine, P7-010 und V1/V2-Anbindung zuständig.
- **V4.12** enthält verbindlich die Geo-Sonde als neuen Funktionsblock.
- Dieser Beschluss ist **eine feste Versionszuordnung**, keine sofortige Freigabe für Änderungen am V4.11-Produktcode.
- Umfang, Benutzeroberfläche und konkrete neue Provider werden vor der V4.12-Implementierung geprüft; der hier definierte Kern darf nicht ohne erneute Entscheidung unbemerkt gestrichen oder auf eine spätere Version verschoben werden.

**Beschlussgeber:** Produktentscheidung im Gewitterradar-Entwicklungschat vom 16.10.2026.
