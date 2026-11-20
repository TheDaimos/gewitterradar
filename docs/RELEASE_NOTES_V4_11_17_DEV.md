# Gewitterradar V4.11.17 DEV

Stand: **2026-10-07**  
Zweig: `feature/v4.11-development`

## Schwerpunkt

WeatherRouter-Darstellung und Reaktionsgeschwindigkeit der Wetterinformationen.

## Profil „Weich“

Der HA-Realtest zeigte, dass das bisherige Profil die Rasterstruktur zwar stark reduzierte, Niederschlagsgebiete aber zu deutlich verwasch.

V4.11.17 stellt „Weich“ deshalb neu ein:

- deutlich geringere reine Weichzeichnung
- stärkere Farbsättigung nach der Glättung
- deutlich stärkere Kontrast-Rückgewinnung
- rote/orange Ereigniskerne bleiben klarer erkennbar
- Außenbereiche laufen weiterhin weich aus
- `Präzise` bleibt unverändert
- `Ausgewogen` bleibt unverändert
- keine Leaflet-Kacheltransformation wird überschrieben

Ziel ist ausdrücklich keine pixelgenaue Darstellung. Dafür bleibt `Präzise` vorhanden. `Weich` soll eine flächigere, ruhigere meteorologische Darstellung liefern.

## Aktualisierungsintervall – Wetterinformationen

Das bisher fest auf 15 Sekunden gesetzte Mindestintervall nach einem Wechsel des Kartenausschnitts ist jetzt in Gewitterradar einstellbar:

- **2–60 Sekunden**
- Standard **15 Sekunden**
- Schrittweite **1 Sekunde**
- lokal im Browser gespeichert
- kleinere Werte reagieren schneller, erzeugen aber mehr WeatherRouter-Anfragen
- der kurze Bewegungsfilter von ca. 900 ms bleibt unabhängig erhalten
- ausdrücklich manuell ausgelöste Aktualisierungen bleiben vom Intervall ausgenommen

Die Funktion ist zusätzlich unter **Hilfe & Hinweise** erklärt.

## Stand

- Produkt **V4.11.17 DEV**
- Build **V4.11.17-DEV-2026-10-07**
- Runtime **41117r1**
- Modulsatz **E411-17A1**
- `core.manifest` **1.2.88**
- `ui.i18n-settings` **1.3.4**
- `weather.precipitation-layer` **1.3.5**
- `weather.display-menu` **0.3.3**
- Integration **0.25.0**

**C.K. – Eine Idee weiter gedacht.**
