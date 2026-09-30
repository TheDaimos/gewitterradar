# Gewitterradar V4.11.04 DEV

Stand: 30.09.2026

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

## Reale Abnahme

1. V4.11.04 über den bestehenden DRA-Kanal `deploy/dev` installieren.
2. Den bereits in V4.11.03 funktionierenden Updatewächter beobachten: V4.11.03 soll V4.11.04 selbst erkennen und kontrolliert neu laden.
3. Prüfen, dass sichtbar `V4.11.04 DEV` läuft.
4. Einstellungen → Weather-Engine öffnen.
5. Prüfen, dass **„Niederschlagsradar · Kartenebene“** und **„Radar-Vorladebereich“** sichtbar sind.
6. Niederschlagsradar einschalten.
7. Quelle, Datenalter, Abdeckung und Kartenebene prüfen.
8. Pufferprofile Aus / Normal / Groß bei identischem Kartenausschnitt vergleichen.
9. Standardansicht und Vollbild auf Verschieben, Zoomen und Nachladen prüfen.
10. Blitzortung, Radien, Cluster, letzter Treffer, Kompass und Medaillon müssen unabhängig weiter funktionieren.

V4.10 FINAL und `main` bleiben unverändert.
