# Gewitterradar V4.11.04 DEV

Stand: 01.10.2026

## Anlass

Beim realen Android-Test von V4.11.03 war die Weather-Engine sichtbar, aber weder **„Niederschlagsradar · Kartenebene“** noch **„Radar-Vorladebereich“** erschienen. Der geladene Produktstand war eindeutig V4.11.03; ein Cache- oder Updateproblem konnte damit ausgeschlossen werden.

Die Ursache lag im Einstellungsaufbau: Das Radar-Modul war geladen und enthielt den vollständigen Karten- und Pufferpfad, seine Methode `_mountWeatherRadarSettings()` wurde jedoch beim Aufbau des Einstellungsdialogs nie aufgerufen. V4.11.02 und V4.11.03 konnten den Radar deshalb über die Oberfläche nicht aktivieren.

## Korrektur

Der reale Einstellungsaufbau ruft nun in dieser Reihenfolge auf:

```text
_bindControls()
_mountWeatherRouterSettings()
_mountWeatherRadarSettings()
_initMap()
```

Damit werden innerhalb der bestehenden Weather-Engine zusätzlich eingebunden:

- **Niederschlagsradar · Kartenebene** mit Ein/Aus-Schalter;
- aktueller Radarstatus mit Quelle, Alter und Abdeckung;
- **Radar-Vorladebereich**;
- Aus / Klein (+15 % je Seite) / Normal (+30 %, empfohlen) / Groß (+50 %) / Benutzerdefiniert;
- benutzerdefinierter Kartenrand 0–100 %;
- Live-Status des Puffers mit Kachel- und Speichergrenzen.

## Regressionstest

Der bisherige Geräteprofiltest bestätigte nur, dass der Weather-Engine-Abschnitt vorhanden und layoutstabil war. Dadurch konnte ein dynamisch nicht eingehängter Funktionsblock unentdeckt bleiben.

Ab V4.11.04 wird für **beide Auslieferungen** und für alle bestehenden Profile ausdrücklich geprüft:

- Desktop;
- iPad;
- iPad Pro;
- Android Hochformat;
- Android Querformat;

und jeweils:

- Weather-Engine vorhanden;
- dynamischer Radar-Einstellungsblock vorhanden;
- Radar-Schalter vorhanden;
- Pufferprofil vorhanden;
- Pufferstatus vorhanden;
- kein horizontaler Überlauf.

Zusätzlich bleibt der eigenständige Radarvertrag für XYZ/WMS, Web-Mercator-BBOX, Providerneutralität, `maxNativeZoom`, räumliche Pufferplanung und Ressourcengrenzen aktiv.

## Kanonische Identität

- Produkt: `4.11.04`
- Anzeige: `V4.11.04 DEV`
- Build: `V4.11.04-DEV-2026-09-30`
- Runtime: `41104r1`
- Modulsatz: `E411-04A1`
- Native Integration: `0.23.3`
- Laufzeitmodule: `26`
- `core.manifest`: `1.2.50`
- `ui.skeleton`: `1.1.17`
- `weather.precipitation-layer`: `1.1.0`

## Reale Abnahme · bestanden am 01.10.2026

Die reale Android-Abnahme von V4.11.04 ist bestanden.

Bestätigt wurden:

- **„Niederschlagsradar · Kartenebene“** ist im Weather-Engine-Dialog sichtbar und aktivierbar;
- **„Radar-Vorladebereich“** ist sichtbar und arbeitet mit dem Profil **Normal · +30 % je Seite**;
- der Live-Pufferstatus wird angezeigt und meldete im Realtest vorbereitete Zusatzkacheln sowie einen realen Speicherverbrauch von rund **5,3 MB**;
- WeatherRouter wählte für den aktuellen Deutschland-/Mitteleuropa-Ausschnitt **DWD** als Quelle;
- die Niederschlagsdarstellung wird sichtbar, geographisch korrekt und zusammenhängend auf der Gewitterradar-Karte gerendert;
- Attribution für OpenStreetMap und DWD wird angezeigt;
- Blitzortung, Radien, Standort, Clusteranzeige, Kompass und Medaillon bleiben parallel sichtbar und funktionsfähig;
- die neue Radar-Ebene beeinträchtigt die bestehende Blitzüberwachung nicht.

Damit ist der Mount-Fehler aus V4.11.02/V4.11.03 real behoben und der erste produktive WeatherRouter-Rasterlayer im Gewitterradar praktisch bestätigt.

V4.10 FINAL und `main` bleiben unverändert.
