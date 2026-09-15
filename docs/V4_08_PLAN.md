# Gewitterradar V4.08 – Planung, Ideen und Umsetzungsrahmen

Stand: **15.09.2026**  
Status: **VERSIONIERT / PLANUNG**  
Branch: `planning/v4.08-cluster-zoom-and-cleanup`

Diese Datei hält die V4.08-Planung dauerhaft im kanonischen Repository fest. Sie ist bewusst detaillierter als ein gewöhnlicher Roadmap-Eintrag, damit die fachlichen Gründe, die beobachteten Probleme, die geplante Architektur, die Teststrategie und die spätere Umsetzungsreihenfolge auch dann erhalten bleiben, wenn Chat-Kontext verloren geht.

**Wichtig:** Diese Datei ist noch kein automatischer Umsetzungsauftrag. V4.07 bleibt bis zur ausdrücklichen Freigabe eingefroren. V4.08 wird erst nach Freigabe implementiert.

---

## 1. Leitmotiv für V4.08

V4.08 soll nicht nur neue Funktionen hinzufügen, sondern gezielt **Altlasten bereinigen, bestehende Kartenlogik verständlicher machen und das Verhalten von Clusterung und Zoom planbarer machen**.

Die aktuelle Clusterlogik funktioniert grundsätzlich, ist aber in Teilen zu stark an die Leaflet-Zoomstufe gekoppelt. Dadurch kann die Darstellung fachlich unpassend wirken, wenn der Benutzer wegen eines kleinen Gefahrenradius stark hineinzoomen muss.

V4.08 soll deshalb mindestens diese Themen bündeln:

- Cluster-/Einzelblitz-Darstellung verfeinern;
- Zoom-Logik entkoppeln und bereinigen;
- Fokus-/Selektionszustände auf Regressionen prüfen;
- vorhandene technische Altlasten in diesem Bereich aufräumen;
- reproduzierbare Diagnose-/Simulationsmöglichkeiten schaffen, damit Gewitterverhalten auch ohne reales Gewitter getestet werden kann;
- bestehende stabile Darstellung und Bedienlogik möglichst wenig unnötig öffnen.

Ein späteres Kombinieren mit einem weiteren Feature ist ausdrücklich möglich, aber noch **nicht entschieden**.

---

## 2. Reale Beobachtung, die die Planung ausgelöst hat

Referenzsituation aus dem realen Betrieb:

- Beobachtungsradius: **70 km**
- Gewitterradius: **30 km**
- Gefahrenradius: **5 km**
- Modus: **Gruppiert**

Beobachtung:

1. Um den kleinen 5-km-Gefahrenradius sinnvoll zu betrachten, wird zwangsläufig relativ weit hineingezoomt.
2. Bei diesem Zoom löst die aktuelle Logik auch Blitze im deutlich größeren Gewitterradius bereits in Einzelblitze auf.
3. Beim stärkeren Herauszoomen erscheinen die Cluster wieder.
4. Damit ist die sichtbare Gruppierung derzeit zu stark an die reine Karten-Zoomstufe gekoppelt und nicht ausreichend an die fachliche Zone bzw. den Benutzerwunsch.
5. Zusätzlich ist zu prüfen, ob ein zuvor fokussierter Einzelblitz die Rückkehr in die normale Gruppierung in einzelnen Fällen verzögern oder blockieren kann. Ein Fokus darf keinen dauerhaften Einzelblitzmodus erzeugen.

Fachliches Problem:

> Ein kleiner Gefahrenradius darf nicht indirekt erzwingen, dass ein Benutzer im restlichen Gewitterradius auf eine übersichtliche Clusteransicht verzichten muss.

---

## 3. Zielbild der Cluster-Darstellung

Die Kartenansicht soll künftig stärker nach fachlicher Relevanz und Benutzerabsicht entscheiden, **nicht nur nach Zoomstufe**.

### Grundregel

- **Gefahrenradius:** hohe Detailgenauigkeit, Einzelblitze bleiben grundsätzlich bevorzugt sichtbar.
- **Gewitterradius:** Gruppierung soll bei aktivem Gruppenmodus auch bei stärkerem Hineinzoomen länger erhalten bleiben können.
- **Beobachtungsradius:** Cluster dürfen noch stärker auf Übersicht optimiert werden.
- **Außerhalb des Beobachtungsradius:** vorhandene kompakte Clusterlogik bleibt grundsätzlich sinnvoll.

### Gewünschter Übergang

Nicht mehr primär:

```text
Cluster → feste Zoomgrenze → plötzlich viele Einzelblitze
```

Sondern bevorzugt:

```text
großer Cluster
  → mehrere kleinere Cluster
    → sehr kleine lokale Cluster
      → erst zuletzt Einzelblitze
```

Cluster sollen sich also beim Hineinzoomen **graduell verfeinern**, bevor sie vollständig zerfallen.

---

## 4. Geplante Benutzeroption: Cluster-Darstellung

Der bestehende Hauptschalter **„Gruppiert | Einzelblitze“** soll zunächst erhalten bleiben.

Zusätzlich ist bei aktivierter Gruppierung eine dreistufige Darstellungsoption vorgesehen.

Arbeitstitel:

- **Detailreich** – Cluster lösen sich vergleichsweise früh in kleinere Gruppen bzw. Einzelblitze auf.
- **Ausgewogen** – mittlere, alltagstaugliche Abstimmung.
- **Clusterbetont** oder **Kompakt** – Cluster bleiben auch bei stärkerem Hineinzoomen möglichst lange erhalten.

Die endgültige Benennung wird erst vor Umsetzung festgelegt und anschließend in alle Sprachvarianten übertragen.

### Warum kein freier Regler als erster Schritt

Ein stufenloser Regler wäre zwar flexibel, hätte aber Nachteile:

- schwerer verständlich;
- schlechter reproduzierbar;
- wesentlich größere Testmatrix;
- Gefahr vieler kaum sinnvoll unterscheidbarer Zwischenwerte;
- schwieriger Support bei Benutzerberichten.

Für V4.08 wird deshalb zunächst ein **deterministisches 3-Profil-Modell** bevorzugt.

---

## 5. Keine reine „Zoom 7 / 8 / 9“-Lösung

Die neue Funktion darf nicht lediglich drei starre Zoomschwellen anbieten.

Der heutige Schwellenwert kann als Ausgangspunkt dienen, aber das Ziel ist eine eigenständige **Darstellungsentscheidung**.

Die spätere Entscheidung sollte mindestens folgende Eingaben berücksichtigen:

- aktuelle Zoomstufe;
- Entfernung des Blitzes vom Bezugsstandort;
- Radiuszone: Gefahr / Gewitter / Beobachtung / außerhalb;
- Ereignisalter bzw. Frische;
- lokale Blitzdichte;
- gewählter Modus `Gruppiert` oder `Einzelblitze`;
- gewähltes Clusterprofil;
- Fokus-/Selektionszustand;
- gegebenenfalls vorhandene stabile Clusteridentität.

Ausgabe der Logik:

- Einzelblitz oder Cluster;
- Cluster-Zellgröße bzw. räumliche Auflösung;
- gegebenenfalls zulässige Übergangs-/Split-Stufe.

---

## 6. Architekturziel: Darstellungsrichtlinie vom Karten-Zoom entkoppeln

Die bestehende Logik soll schrittweise in eine zentrale, nachvollziehbare Richtlinie überführt werden.

Zielbild:

```text
Ereignisdaten
  + Bezugsstandort / Radiuszone
  + Zoom
  + Alter / Dichte
  + Benutzerprofil
  + Fokuszustand
        ↓
Cluster-/Darstellungsrichtlinie
        ↓
Einzelblitz / Cluster / Zellgröße
        ↓
Karten-Renderer
```

Die Entscheidung soll möglichst **engine-unabhängig** werden, damit Leaflet/OSM und eine spätere MapLibre-Engine dieselbe Fachlogik verwenden können.

Die Karten-Engine soll die Entscheidung darstellen, nicht die Fachregel selbst definieren.

---

## 7. Gefahrenradius bleibt besonders behandelt

Der Gefahrenradius ist fachlich der sensibelste Bereich.

Grundsätzlich gilt für V4.08:

- frische relevante Treffer im Gefahrenradius bleiben als Einzelblitze sichtbar;
- eine Clusteroption darf die Gefahrendarstellung nicht unverständlich verdichten;
- ältere oder sehr dichte Ereignisse können später nur dann gruppiert werden, wenn Lesbarkeit und Gefahrenverständnis erhalten bleiben;
- eine solche Verfeinerung wäre separat zu testen und ist **nicht automatisch Teil der ersten V4.08-Umsetzung**.

Die neue Clusteroption soll vor allem verhindern, dass das Hineinzoomen auf den kleinen Gefahrenradius **außerhalb dieses Radius** zu einer unnötigen Einzelblitzflut führt.

---

## 8. Fokus-/Selektionszustand überprüfen

Ein möglicher Altlasten-/Regressionspunkt muss ausdrücklich geprüft werden:

- Klick auf einen Einzelblitz oder Cluster;
- Fokus / Popup / Anvisieren;
- danach Herauszoomen;
- Wechsel zwischen `Gruppiert` und `Einzelblitze`;
- Datenrefresh während eines Fokuszustands.

Akzeptanzregel:

> Ein zuvor fokussierter Blitz darf die normale Cluster-Neuberechnung nach Zoom-, Modus- oder Datenänderung nicht dauerhaft blockieren.

Bei `Gruppiert` muss die Darstellung nach relevanten Zustandsänderungen immer wieder sauber aus der aktuellen Fachlogik berechnet werden.

---

## 9. Altlastenbereinigung im Cluster-/Zoom-Bereich

V4.08 soll ausdrücklich auch eine Aufräumrunde enthalten.

Zu prüfen und gegebenenfalls zu bereinigen:

- verstreute oder doppelte Zoomschwellen;
- historische „Magic Numbers“ ohne Dokumentation;
- mehrfach implementierte Distanz-/Radiusprüfungen;
- redundante Bedingungen für Einzelblitze und Cluster;
- Fokuszustände, die nicht sauber zurückgesetzt werden;
- Engine-spezifische Fachlogik in Leaflet-Pfaden;
- tote oder überholte Clusterzweige;
- nicht mehr benötigte Kompatibilitätsreste;
- Kommentarbestand: wichtige Regression-/Kompatibilitätshinweise behalten, veraltete oder irreführende Kommentare bereinigen.

Wichtig: Aufräumen bedeutet **keinen pauschalen Rewrite**. Bewährte Clusteridentitäten, Deduplizierung und stabile Darstellungslogik werden nur dort verändert, wo ein konkreter Grund besteht.

---

## 10. Testbarkeit ohne reales Gewitter

Ein zentraler V4.08-Punkt ist eine reproduzierbare Testmöglichkeit.

Da reale Gewitter nicht jederzeit verfügbar sind, darf die Feinabstimmung der Clusterlogik nicht ausschließlich von Live-Wetter abhängen.

### Geplantes Diagnose-/Simulationswerkzeug

Vorgesehen ist ein deterministischer Testmodus bzw. Test-Harness, der synthetische Blitzereignisse erzeugen oder definierte Ereignis-Fixures abspielen kann.

Der Testpfad muss klar von echten Blitzdaten getrennt sein und darf niemals unbemerkt in den Produktivbetrieb einfließen.

Mindestszenarien:

1. **70 / 30 / 5 km** – reale Referenz aus der aktuellen Beobachtung.
2. Kleiner Gefahrenradius + dichter Gewitterradius.
3. Einzelner isolierter Blitz.
4. Mehrere räumlich eng liegende frische Blitze.
5. Mischung aus frischen und älteren Ereignissen.
6. Hohe Ereignisdichte / Extremaktivität.
7. Cluster an Radiusgrenzen.
8. Blitz innerhalb Gefahrenradius + große Cluster außerhalb.
9. Einzelblitz fokussieren → herauszoomen → Cluster muss wieder erscheinen.
10. Cluster fokussieren → hineinzoomen → definierte Split-Logik.
11. Moduswechsel `Gruppiert ↔ Einzelblitze` bei gleicher Zoomstufe.
12. Profilwechsel `Detailreich ↔ Ausgewogen ↔ Clusterbetont` ohne Kartenreset.
13. Datenrefresh bei unveränderter Zoomstufe.
14. Mobile und Desktop mit identischer fachlicher Entscheidung.

### Verbindung zum geschützten Diagnosemodus

Der bereits vorhandene bzw. wiederhergestellte Diagnosemodus kann später als Bedienoberfläche für diese Tests dienen.

Dabei gilt die bereits festgelegte Projektregel:

> Sobald der Diagnosemodus vollständig geprüft und abgenommen ist, wird sein vollständiger Funktionsumfang im Repository dokumentiert, mit Regressionstests geschützt und darf nicht wieder stillschweigend verloren gehen.

Die Cluster-Simulation soll diese Schutzlogik nutzen, aber nicht mit Produktionsdaten vermischt werden.

---

## 11. Möglichkeit einer späteren Kombination mit anderen Features

V4.08 kann mit einem weiteren passenden Feature kombiniert werden. Entscheidung offen.

Besonders naheliegende Kandidaten:

### 120-Minuten-Wiedergabe

Synergie:

- ohnehin zeitabhängige Blitzereignisse;
- Cluster müssen auch für historische Zeitpunkte deterministisch gebildet werden;
- ein Ereignispuffer könnte gleichzeitig gute reproduzierbare Testdaten liefern.

Risiko:

- deutlich größerer Scope;
- Cluster-Umbau und Playback sollten nicht so eng gekoppelt werden, dass eines ohne das andere nicht mehr testbar ist.

### MapLibre

Synergie:

- Gelegenheit, die Cluster-Fachlogik vor einer zweiten Engine sauber aus Leaflet zu lösen.

Risiko:

- Engine-Migration und Cluster-Verhalten gleichzeitig zu ändern erhöht die Regressionstiefe stark.

### Vollbild-/Zoom-Funktion

Synergie:

- neue Zoom-/Ansichtslogik könnte zusammen mit Vollbild getestet werden.

Risiko:

- UI-Feature und Fachlogik sollten getrennt bleiben.

Entscheidungsregel:

> Kombination nur dann, wenn sie die Architektur vereinfacht oder die Testbarkeit verbessert. Keine künstliche Bündelung nur wegen einer Versionsnummer.

---

## 12. Vorgesehene Umsetzungsphasen

### Phase 0 – V4.07 als Referenz einfrieren

- final akzeptierten V4.07-Stand eindeutig identifizieren;
- aktuelle Cluster-/Zoomlogik dokumentieren;
- reale Beobachtung 70/30/5 als Referenzfall sichern;
- bestehende Cluster-/Fokus-Regressionsregeln erfassen.

### Phase 1 – Inventar und reine Extraktion

Ziel: Struktur verbessern, **noch ohne sichtbare Verhaltensänderung**.

- alle aktuellen Cluster-/Zoomentscheidungen lokalisieren;
- Schwellen und Magic Numbers dokumentieren;
- Entscheidungslogik möglichst in eine zentrale Funktion/Schicht überführen;
- Regressionstest beweist zunächst V4.07-Verhaltensgleichheit.

### Phase 2 – Deterministischer Cluster-Test-Harness

- synthetische Ereignis-Fixtures;
- Radius-/Zoom-Testmatrix;
- Fokus-/Reset-Szenarien;
- reproduzierbare Screenshots bzw. strukturierte Ergebnisdaten;
- fail-closed Regressionstests.

### Phase 3 – Neues Richtlinienmodell

- Radiuszone stärker gewichten;
- Cluster-Zellgröße graduell mit Zoom verfeinern;
- harte Sprünge reduzieren;
- Gefahrenradius-Sonderregel schützen;
- Fokuszustand von der grundlegenden Gruppierungsentscheidung trennen.

### Phase 4 – Benutzerprofile

- `Detailreich`;
- `Ausgewogen`;
- `Clusterbetont/Kompakt`;
- Persistenz in beiden Auslieferungsformen;
- UI nur bei sinnvoller Stelle ergänzen;
- alle 19 Sprachvarianten;
- Hilfe-/Hinweistext ergänzen.

### Phase 5 – Reale Feldtests

Wenn reales Gewitter verfügbar ist:

- 5-km-Gefahrenradius bei aktivem Gruppenmodus;
- mehrere Zoomstufen;
- echte dichte Aktivität;
- Fokus-/Popup-Abläufe;
- Android, Desktop, iPad/iPad Pro und nach Möglichkeit iPhone/iOS;
- Unterschiede zwischen synthetischer Erwartung und realem Eindruck dokumentieren.

### Phase 6 – Feintuning und Release-Gates

- Profilgrenzen justieren;
- keine unerwünschten Einzelblitzfluten;
- keine zu groben Cluster in kritischen Bereichen;
- Performance prüfen;
- Frontend-Parität Integration/Dashboard;
- CI, Browserregression, HACS-/HA-Gates;
- Dokumentation, History und Release Notes aktualisieren.

---

## 13. Akzeptanzkriterien

V4.08 Cluster-/Zoom-Teil gilt erst als abnahmefähig, wenn mindestens folgende Punkte erfüllt sind:

- kleiner Gefahrenradius zwingt den restlichen Gewitterradius nicht mehr unnötig früh in Einzelblitze;
- `Gruppiert` bleibt fachlich wirksam, auch wenn stark hineingezoomt wird;
- Cluster werden beim Zoomen nachvollziehbar feiner statt abrupt zu zerfallen;
- Gefahrenradius bleibt verständlich und detailreich;
- `Einzelblitze` zeigt weiterhin bewusst die detaillierte Darstellung;
- Fokus eines Einzelblitzes blockiert spätere Clusterbildung nicht;
- Profile erzeugen sichtbar unterschiedliche, aber reproduzierbare Ergebnisse;
- gleiche Eingangsdaten führen engine-unabhängig zur gleichen Gruppierungsentscheidung;
- synthetische Testfälle decken die wichtigsten realen Situationen ab;
- Desktop und mobile Geräte zeigen dieselbe Fachlogik;
- keine Verschlechterung bei Performance oder stabilen Clusteridentitäten;
- alle neuen Bedienelemente und Hilfetexte sind vollständig lokalisiert.

---

## 14. Nicht-Ziele der ersten V4.08-Clusteriteration

Nicht automatisch enthalten:

- kompletter Rewrite des Kartenmoduls;
- freie stufenlose Clusterparameter für Benutzer;
- Änderung der Radiusdefinitionen;
- Änderung der Blitzdatenquelle;
- MapLibre-Pflicht;
- Playback-Pflicht;
- neue Wetterdatenquellen;
- Änderung der Gefahrenbewertung nur wegen der Darstellung.

Diese Punkte können separat geplant oder später kombiniert werden.

---

## 15. Schutz vor erneutem Wissensverlust

Diese Planung ist absichtlich ausführlich.

Für die spätere Umsetzung gilt:

- wichtige fachliche Entscheidungen nicht nur im Chat halten;
- Schwellen, Profile und Radiusregeln im Repository dokumentieren;
- akzeptierte Clusterregeln durch Regressionstests schützen;
- Diagnose-/Simulationsfunktionen vollständig inventarisieren;
- keine stillschweigende Entfernung vorhandener Diagnosemöglichkeiten;
- nach Abnahme V4.08-History und Release Notes vollständig aktualisieren.

---

## 16. Kurzfassung für spätere Wiederaufnahme

Wenn V4.08 begonnen wird, lautet der Kernauftrag:

> Die bestehende Clusterlogik nicht neu erfinden, sondern fachlich sauber von der reinen Leaflet-Zoomstufe entkoppeln. Ein kleiner Gefahrenradius darf nicht den gesamten Gewitterradius vorschnell in Einzelblitze auflösen. Cluster sollen sich beim Hineinzoomen graduell verfeinern. Der bestehende Schalter `Gruppiert | Einzelblitze` bleibt; für `Gruppiert` sind drei reproduzierbare Profile vorgesehen. Gleichzeitig werden Cluster-/Zoom-Altlasten bereinigt und ein deterministischer Diagnose-/Simulationspfad geschaffen, damit das Verhalten auch ohne reales Gewitter vollständig geprüft werden kann.
