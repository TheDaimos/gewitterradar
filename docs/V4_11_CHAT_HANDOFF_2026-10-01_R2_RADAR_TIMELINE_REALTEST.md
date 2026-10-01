# Gewitterradar V4.11 – Chat-Übergabe R2 · Radar-Zeitplayer / Realtest

Stand: **01.10.2026, 09:10 CEST**

## Bootstrap

**Projekt:** Gewitterradar – V4.11  
**Repository:** `TheDaimos/gewitterradar`  
**Entwicklungszweig:** `feature/v4.11-development`  
**Draft-PR:** #28  
**DRA-Kanal:** ausschließlich bestehendes `deploy/dev`

V4.10 FINAL und `main` bleiben eingefroren und dürfen durch die V4.11-Entwicklung nicht verändert werden.

---

## Verbindlicher technischer Stand

### Geprüfter Quellstand

`49641d145d716bb7eef270ad67e25d3426458204`

Commit:

`Clean V4.11.05 player sync scaffolding`

Auf exakt diesem Quellstand sind die finalen normalen Push- und PR-Prüfungen erfolgreich abgeschlossen.

### DRA-Veröffentlichung

`deploy/dev`:

`3c7da51e17dcfd32f7a799cd902e2a4374057e8b`

Commit:

`deploy(v4.11.05): publish radar timeline DEV candidate`

DRA-Parität zum geprüften Quellstand ist bestätigt. Gegenüber `49641d145...` ist ausschließlich

`custom_components/gewitterradar/dra-deployment-provenance.json`

verändert.

Die exakte Veröffentlichungsquelle steht dort als:

`publicationSourceCommit: 49641d145d716bb7eef270ad67e25d3426458204`

Hinweis: `baselineFeatureHead` besitzt weiterhin die bisherige Baseline-Semantik und ist **nicht** der Veröffentlichungs-HEAD. Für die DRA-Parität ist `publicationSourceCommit` maßgeblich.

---

## Kanonische V4.11.05-Identität

- Produkt: `4.11.05`
- Anzeige: `V4.11.05 DEV`
- Build: `V4.11.05-DEV-2026-10-01`
- Runtime: `41105r1`
- Modulsatz: `E411-05A1`
- Native Integration: `0.23.4`
- Laufzeitmodule: **26**
- `core.manifest@1.2.51`
- `weather.precipitation-layer@1.2.0`

---

## Wichtige reale Ergebnisse vor V4.11.05

### Automatischer Frontend-Updatewächter

Der Wechsel **V4.11.02 → V4.11.03** wurde real erfolgreich bestätigt:

1. alter Frontendstand lief noch;
2. DRA installierte die neue Runtime;
3. Gewitterradar erkannte die neue Frontend-Runtime selbst;
4. Hinweis zur Frontend-Neuladung erschien kurz;
5. nach ca. 1,8 s erfolgte die kontrollierte Vollneuladung;
6. neue Version war aktiv.

Kein erneutes Registrieren der Home-Assistant-Ressource, kein HA-Neustart, kein manueller Companion-App-Neustart.

UX-Nachtrag: Der Hinweis ist mit 1,8 s sehr kurz sichtbar. Für einen späteren Stand kann die Anzeige auf etwa 3–4 s verlängert und verständlicher formuliert werden. Das ist **kein Blocker für V4.11.05**.

### V4.11.04 – Radar-/Puffer-Realtest bestanden

Beim Android-Realtest wurde bestätigt:

- **„Niederschlagsradar · Kartenebene“** sichtbar und aktivierbar;
- **„Radar-Vorladebereich“** sichtbar;
- Profil **Normal · +30 % je Seite** aktiv;
- Live-Pufferstatus sichtbar;
- im Realtest rund **5,3 MB** Bildspeicher und vorbereitete Zusatzkacheln;
- WeatherRouter wählte für Deutschland/Mitteleuropa **DWD**;
- Niederschlagsradar sichtbar und geographisch korrekt auf der Karte;
- OSM-/DWD-Attribution sichtbar;
- Blitzortung, Radien, Standort, Cluster, Kompass und Medaillon parallel funktionsfähig.

Damit ist der V4.11.02/V4.11.03-Mount-Fehler real geschlossen.

---

## V4.11.05 – neuer Radar-Zeitplayer

### Grundprinzip

Gewitterradar bleibt providerneutral und fordert weiterhin nur

`weather.radar.precipitation`

als `raster_tile` über WeatherRouter Consumer V1 an.

Der Player wird **nur** aktiviert, wenn der geroutete Raster-Payload eine Timeline mit mindestens zwei gültigen Frames liefert.

Es gibt **keine DWD-Sonderlogik** in Gewitterradar.

WeatherRouter liefert für DWD aktuell bis zu ca. **72 Analyse-/Vorhersageframes**. Gewitterradar nimmt diese Zahl nicht fest an, sondern verwendet ausschließlich die tatsächlich gelieferte Consumer-V1-Timeline.

### Player-Funktionen

Direkt auf der Karte:

- vorheriger Radarzeitpunkt;
- **Wiedergabe / Pause**;
- nächster Radarzeitpunkt;
- **Jetzt**;
- Zeitregler über alle Frames;
- Kennzeichnung **Vergangenheit / Jetzt / Vorhersage**;
- lokale Uhrzeit;
- Position innerhalb der Folge, z. B. `23/72`.

Die Radarlegende wird passend zum gewählten Frame aktualisiert.

### Timeline-Modell

`weatherRadarTimelineModel()`:

- liest `payload.timeline.frames`;
- validiert `time` und `tile_url`;
- sortiert chronologisch;
- erkennt den aktuellen Frame bevorzugt über `payload.tile_url`;
- fällt ansonsten auf den zur Referenzzeit passendsten Zeitpunkt zurück;
- klassifiziert Frames relativ zum aktuellen Index als:
  - `past`
  - `current`
  - `forecast`

Einzelbild-Provider bleiben ohne Player vollständig nutzbar.

---

## Doppelpufferung beim Framewechsel

Ein neuer Radarframe ersetzt die sichtbare Ebene nicht sofort.

Ablauf:

1. Ziel-Frame als zweite Leaflet-Rasterebene anlegen;
2. praktisch unsichtbare Deckkraft während des Ladens;
3. auf `load` des sichtbaren Kartenausschnitts warten;
4. maximal **6 Sekunden**;
5. neuen Frame sichtbar schalten;
6. zwei `requestAnimationFrame`-Zyklen warten;
7. alten Radarframe entfernen.

Wenn der neue Frame nicht sicher geladen wird:

- alter sichtbarer Radarframe bleibt erhalten;
- kein leerer/weißer Zwischenzustand soll entstehen;
- Wiedergabe stoppt kontrolliert.

Die Frame-Vorbereitung besitzt eine eigene Promise-/Token-Absicherung gegen doppelte oder veraltete Staging-Vorgänge.

Wiedergabeintervall aktuell: **950 ms**.

---

## Verhältnis Zeitplayer ↔ räumlicher Puffer

Der räumliche Puffer aus V4.11.03/04 bleibt erhalten:

- Aus
- Klein · +15 % je Seite
- Normal · +30 % je Seite
- Groß · +50 % je Seite
- Benutzerdefiniert · 0–100 %

Während laufender Zeitwiedergabe gilt:

**Zeitlicher nächster Frame hat Vorrang vor dem großflächigen räumlichen Zusatzpuffer.**

Ziel: Android/iPad sollen nicht gleichzeitig viele Zeitframes und einen großen zusätzlichen Kartenrand laden.

Nach:

- Pause,
- manueller Framewahl,
- Vor/Zurück,
- Sprung auf **Jetzt**

wird der konfigurierte räumliche Puffer für den gewählten Zeitstand wieder aufgebaut.

---

## Player-Geometrie

Der Player sitzt innerhalb der Karte.

Sein unterer Abstand wird dynamisch aus der **real gerenderten Höhe von `#map-legend`** berechnet:

`bottom = legendHeight + 10 px`

Damit bleibt er in Standardansicht, Vollbild, Hoch- und Querformat oberhalb der Kartenlegende.

Der Browser-Geräteprofiltest setzt den Player testweise real in die Karte ein und prüft für beide Auslieferungen:

- Desktop;
- iPad;
- iPad Pro;
- Android Hochformat;
- Android Querformat;

jeweils:

- Player vorhanden;
- linke Kartengrenze eingehalten;
- rechte Kartengrenze eingehalten;
- Player oberhalb der Legende;
- Wiedergabe-Schaltfläche vorhanden;
- Jetzt-Schaltfläche vorhanden;
- Zeitregler korrekt aufgebaut.

Diese Prüfungen sind grün.

---

## Weather-Engine-Einstellungen

Zusätzlich vorhanden:

**Radar-Zeitverlauf**

Der Status informiert:

- Radar aus → Zeitverlauf wird mit Radar aktiviert;
- Timeline vorhanden → reale Anzahl der Radarzeitpunkte sowie Vergangenheit/Jetzt/Vorhersage;
- keine Timeline → aktuelle Quelle liefert keine mehrteilige Radarzeitreihe.

---

## CI-Status V4.11.05

Finaler normaler Quellstand:

`49641d145d716bb7eef270ad67e25d3426458204`

Erfolgreich:

- Validate shared Gewitterradar frontend · Push
- Validate shared Gewitterradar frontend · PR
- Validate Gewitterradar integration · Push
- Validate Gewitterradar integration · PR
- Diagnostic contract · PR
- Hi-Res asset retention · Push/PR

Innerhalb Shared Frontend unter anderem grün:

- WeatherRouter Consumer V1 contract;
- kanonische V4.11.05-Identität;
- **V4.11.05 precipitation radar timeline player contract**;
- kanonischer Frontendvertrag;
- deterministischer Build;
- JavaScript-Syntax;
- About/Help-Sprachvertrag;
- Recorder-Sprachaudit;
- geschützter Diagnosevertrag;
- Fit-Matrix;
- Sprach-Onboarding;
- Settings-/Hilfe-Geräteprofile;
- Player-Geometrie auf Desktop/iPad/Android;
- Instrumentdiagnose;
- geschützte About-Geometrie;
- beide vollständigen Browser-Auslieferungen.

Native Integration ebenfalls grün:

- hassfest;
- Home-Assistant-Runtime;
- HACS;
- Paketvertrag.

---

## WeatherRouter-Bezug

WeatherRouter muss für V4.11.05 **nicht umgebaut** werden.

Repository:

`TheDaimos/weather-router-dev`

Branch:

`feature/global-hazard-feeds`

Consumer V1 liefert die Timeline bereits im Raster-Payload. Gewitterradar nutzt ausschließlich diesen öffentlichen Vertrag.

Relevante WeatherRouter-Bestandteile:

- `custom_components/weather_router/consumer_api.py`
- `custom_components/weather_router/providers/dwd.py`
- `contracts/consumer_v1/resources/raster_tile.schema.json`

Keine direkte Providerkopplung im Gewitterradar ergänzen.

---

## Aktueller nächster Schritt – NICHT erneut implementieren

**V4.11.05 ist bereits über DRA veröffentlicht.**

DRA:

`3c7da51e17dcfd32f7a799cd902e2a4374057e8b`

Der Benutzer möchte diese Version jetzt real auf Android ausprobieren.

Im neuen Chat deshalb **zuerst Realtest-Ergebnisse aufnehmen** und nicht erneut am Player bauen.

### Realtest-Checkliste

1. Prüfen, ob V4.11.04 die V4.11.05 über den Updatewächter selbst erkennt und neu lädt.
2. Sichtbare Version: **V4.11.05 DEV**.
3. Einstellungen → Weather-Engine.
4. **Radar-Zeitverlauf** muss vorhanden sein.
5. Reale Framezahl notieren.
6. Zeitplayer muss auf der Karte erscheinen.
7. **Jetzt** testen.
8. Vorheriger/nächster Frame testen.
9. Zeitregler in Vergangenheit und Vorhersage bewegen.
10. Wiedergabe/Pause testen.
11. Beobachten, ob zwischen Frames ein weißes/leeres Kartenbild entsteht.
12. Zeittyp/Uhrzeit in Player und Radarlegende prüfen.
13. Nach Pause/manueller Auswahl prüfen, ob der räumliche Puffer wieder arbeitet.
14. Standardansicht und Vollbild prüfen.
15. Verschieben/Zoomen während oder nach Playback prüfen.
16. Android-Speicher-/Ruckelverhalten beobachten.
17. Blitzortung, Radien, Standort, Cluster, Kompass und Medaillon müssen parallel unverändert funktionieren.

### Wenn der Player nicht erscheint

Zuerst prüfen:

- Radar ist wirklich eingeschaltet;
- Weather-Engine → Radar-Zeitverlauf zeigt eine Framezahl > 1;
- aktuelle Consumer-V1-Antwort enthält `payload.timeline.frames`;
- der geroutete Provider liefert tatsächlich mehrere gültige `time` + `tile_url`-Einträge.

Nicht sofort DWD fest verdrahten oder WeatherRouter umbauen.

### Wenn Framewechsel flackern oder hängen

Prüfen:

- `_weatherRadarStageTimelineFrame()`;
- `timelineStagePromise`;
- `timelineStageToken`;
- 6-s-Staging-Timeout;
- Leaflet-`load` des Staging-Layers;
- Wechsel der Deckkraft;
- zwei `requestAnimationFrame`-Zyklen vor Entfernen der alten Ebene;
- zeitliche Priorisierung gegenüber dem räumlichen Puffer.

---

## Noch offene V4.11-Themen nach dem Zeitplayer

Nach erfolgreicher V4.11.05-Abnahme weiterhin gemäß `docs/V4_11_TODO.md`:

- Datenquellen/Attribution/Aktualität auch in Diagnose und Hilfe ausbauen;
- zentraler Systemstatus am Einstellungs-Zahnrad;
- Blitzortung-/Tracker-Diagnose verbessern;
- Hilfe & Fehlerbehebung neu strukturieren;
- Local-To-do-Prüfung;
- Monitored Areas / überwachte Orte;
- Standort-Protokollierung;
- weitere WeatherRouter-/Gefahrenfunktionen.

Keine dieser Aufgaben automatisch vorziehen, solange der V4.11.05-Realtest noch nicht abgeschlossen ist.

---

## Schutzregeln

- V4.10 FINAL nicht verändern.
- `main` nicht verändern.
- PR #28 bleibt **Draft**.
- DRA ausschließlich über bestehenden `deploy/dev`-Kanal.
- Keine neue Ressourcenregistrierung empfehlen, solange der Updatewächter funktioniert.
- Keine Provider-Hardcodierung in Gewitterradar.
- Blitzortung bleibt unabhängig vom WeatherRouter-Radar.
- Reale Testergebnisse zuerst dokumentieren, dann über Folgeänderungen entscheiden.
- Bei langem Chat frühzeitig vor knappem Kontext warnen.

---

## Verbindliche Begleitdokumente

- `docs/RELEASE_NOTES_V4_11_05_DEV.md`
- `docs/V4_11_TODO.md`
- `docs/V4_11_WEATHER_ENGINE_PLANUNGSBESCHLUSS_2026-09-30.md`
- diese Übergabe:
  `docs/V4_11_CHAT_HANDOFF_2026-10-01_R2_RADAR_TIMELINE_REALTEST.md`

