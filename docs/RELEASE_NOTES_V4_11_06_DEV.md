# Gewitterradar V4.11.06 DEV – Weather Engine Diagnose

Stand: 2026-10-01

## Ziel

V4.11.06 ergänzt unter **Einstellungen → Kalibrierung & Diagnose** einen eigenen
Schalter **Weather Engine**. Die Diagnose trennt bewusst die öffentliche
WeatherRouter-Antwort vom lokal sichtbaren Gewitterradar-Zustand.

Damit lässt sich insbesondere unterscheiden:

- was Gewitterradar tatsächlich an Consumer API V1 sendet;
- was WeatherRouter zurückliefert;
- welcher Provider laut Antwort gewählt wurde;
- welcher ältere Layer in Gewitterradar eventuell noch als Rückfall sichtbar bleibt.

## Oberfläche

Das neue Weather-Engine-Fenster enthält zwei Filter:

1. **Bereich**
   - Alle;
   - Niederschlag / Regen;
   - Gewitter & Blitze;
   - Tornados / Wasserhosen;
   - Wind;
   - Temperatur;
   - Schnee & Eis;
   - Wolken;
   - Luftdruck;
   - UV;
   - Pollen;
   - Wasser & Hochwasser;
   - Erdbeben & Vulkane;
   - Warnungen & Gefahren;
   - Satellit;
   - Sonne, Mond & Weltraum;
   - Biologische Daten;
   - Weitere.

2. **Capability**
   - wird aus den tatsächlich bekannten bzw. bereits angefragten
     WeatherRouter-Capabilities erzeugt.

Die Filter sind reine Diagnosefilter. Sie beeinflussen weder Providerwahl noch Routing.

## Diagnoseinhalt

Aufgezeichnet werden die letzten maximal 80 Consumer-Resolve-Vorgänge:

- Capability;
- räumlicher Kontext;
- Requirements / Event-Filter;
- Start- und Endzeit;
- Dauer;
- normalisierte WeatherRouter-Antwort;
- Status bzw. Unavailable-Code;
- Provider-Provenienz.

Für den aktuellen Niederschlagsradar-Layer werden zusätzlich angezeigt:

- Layer vorhanden;
- letzter erfolgreicher Provider;
- letzter erfolgreicher Resolve-Zeitpunkt;
- letzte Nichtverfügbarkeit;
- ob ein vorheriger Layer als Rückfall sichtbar gehalten wird;
- Timeline-Framezahl;
- aktueller Timeline-Index;
- Wiedergabestatus;
- In-Flight-/Pending-Status;
- letzter Request-Zeitpunkt;
- letzte Viewport-Signatur;
- Anzahl vorgeladener Rastereinträge.

## Export

- **Diagnose kopieren** erzeugt einen kompakten Text plus vollständigen JSON-Inhalt.
- **JSON exportieren** erzeugt `gewitterradar.weather_engine_diagnostic.v1`.
- sensible URL-Querywerte, Authorization-Angaben und Zugangsdaten werden vor Anzeige
  bzw. Export maskiert.

## Architektur

Die Aufzeichnung sitzt zentral im providerneutralen `weather.consumer-client`.
Dadurch ist sie nicht an DWD oder Niederschlagsradar gebunden. Zukünftige
Consumer-Aufrufe für Wind, Temperatur, Warnungen, Tornados, Blitzdaten oder weitere
WeatherRouter-Dienste erscheinen automatisch in demselben Diagnosepfad.

## Identität

- Produkt: **V4.11.06 DEV**
- Runtime: **41106r1**
- Modulsatz: **E411-06A1**
- neues Modul: `weather.engine-diagnostics@1.0.0`
- `weather.consumer-client@1.1.0`
- `core.manifest@1.2.52`
- native Integration bleibt **0.23.4**, da ausschließlich das Frontend erweitert wurde.
