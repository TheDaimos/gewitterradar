# Gewitterradar V4.11.07 DEV – providerneutrales Niederschlags-Routing

Stand: 2026-10-02

## Ziel

V4.11.07 migriert die produktive Niederschlags-Kartenebene bewusst vom spezialisierten
WeatherRouter-Vertrag `weather.radar.precipitation` auf den gemeinsamen fachlichen
Routing-Intent `weather.precipitation.layer`.

Gewitterradar entscheidet damit nicht mehr selbst, welcher Provider oder welches
Messverfahren für den sichtbaren Kartenausschnitt zu verwenden ist. WeatherRouter
übernimmt Auswahl, Coverage-Prüfung und Fallback; Gewitterradar rendert die gelieferte
Rasterressource und zeigt Provenienz, Aktualität, Legende und Diagnose.

## Routing-Vertrag

Produktive Capability:

```text
weather.precipitation.layer
```

Requirements:

```text
resource_types = ["raster_tile"]
```

Nicht in Gewitterradar verdrahtet:

- DWD-vs.-NASA-Auswahl;
- regionale Providermatrix;
- Providerpriorität;
- eigene Satelliten-/Radar-Fallbackentscheidung.

Der bisherige spezialisierte WeatherRouter-Pfad bleibt auf WeatherRouter-Seite
kompatibel, wird von der produktiven Gewitterradar-Niederschlagsebene aber nicht mehr
angefordert.

## Darstellung

Die sichtbare Funktion wird bewusst allgemeiner als **Niederschlag** bezeichnet.
Je nach Region kann WeatherRouter eine fachlich geeignete Radar-, Satelliten- oder
andere zugelassene Rasterquelle liefern.

Zeitplayer, räumlicher Vorladepuffer, Doppelpufferung, Legende und Attribution bleiben
erhalten. Candidate-spezifische Messgröße und Einheit werden nicht künstlich
vereinheitlicht.

## Weather Engine Diagnose

Die vorhandene Weather-Engine-Diagnose bleibt der Abnahmepfad. Für die produktive
Niederschlagsebene muss dort nach erfolgreicher Auflösung sichtbar sein:

```text
weather.precipitation.layer
```

Die Diagnose zeigt weiterhin Consumer-Request/Response, räumlichen Kontext,
WeatherRouter-Provenienz, lokalen Layerzustand, Timeline und secret-safe Export.

## Verbindliche Realabnahme für WeatherRouter P0-090

Nach Installation über den bestehenden DRA-Kanal `deploy/dev`:

1. Deutschland/Mitteleuropa prüfen;
2. Kuba/Karibik prüfen;
3. offenes Atlantik-/Ozeangebiet prüfen;
4. Weather-Engine-Diagnose exportieren.

Erwartung:

- Deutschland: geeignete hochrangige Quelle mit realer Coverage;
- Karibik/Ozean: keine DWD-Nutzung außerhalb Coverage;
- providerneutraler Fallback auf eine zulässige Quelle;
- Diagnose enthält `weather.precipitation.layer`;
- keine Providerlogik in Gewitterradar.

P0-090 ist erst nach dieser realen Abnahme abgeschlossen.

## Identität

- Produkt: **V4.11.07 DEV**
- Runtime: **41107r1**
- Modulsatz: **E411-07A1**
- `weather.consumer-client@1.2.0`
- `weather.precipitation-layer@1.3.0`
- `core.manifest@1.2.53`
- native Integration: **0.23.4**
- DRA-Kanal: **deploy/dev**
