# Gewitterradar V4.11.14 DEV

Stand: **2026-10-07**  
Zweig: `feature/v4.11-development`

## Schwerpunkt

Kompakte WeatherRouter-Legende, Transparenz direkt im Karten-Darstellungsmenü und stärkeres Weichprofil mit Hotspot-Erhalt.

## Kartenlegende

Die bisher sehr breite Legendenleiste wurde in eine kompakte zweistufige Darstellung umgebaut:

- maximale Desktopbreite ca. 430 px
- Kopfzeile mit Titel, Quelle/Zeit, Einheit und Schließen
- eigentliche WR-Legendenabbildung darunter und deutlich größer
- strukturierte Legendenwerte bleiben unterstützt
- mehrere aktive Legenden bleiben stapelbar
- responsive mobile Breiten

## Transparenz auf der Karte

Der Niederschlags-Transparenzregler befindet sich jetzt zusätzlich direkt im schwebenden Darstellungsmenü.

- 0–100 %
- live wirksam
- synchron mit Einstellungen
- **WR** stellt die vom WeatherRouter gelieferte Standarddeckkraft wieder her
- keine Daten-Neuanfrage
- kein Layer-Neuaufbau

## Weichprofil

**Weich** wurde stärker geglättet und erhält nach der Glättung mehr Sättigung und Kontrast. Dadurch sollen harte Rastergrenzen stärker verschwinden, während rote/orange Starkregen- bzw. Ereigniskerne weiterhin klar identifizierbar bleiben.

## Regression

- Leaflet-Kachel-`transform` bleibt tabu
- Menüzustand bleibt vom Rasterrenderer entkoppelt
- Transparenz bleibt reine Layer-Deckkraft
- finale Augenassets bleiben unverändert
- generische Legendenlogik bleibt datengetrieben

## Stand

- `weather.display-menu` 0.3.1
- `weather.legend-overlay` 0.1.1
- `weather.precipitation-layer` 1.3.4
- `core.manifest` 1.2.85
- Runtime **41114r1**
- Modulsatz **E411-14A1**
- Produkt **V4.11.14 DEV**

**C.K. – Eine Idee weiter gedacht.**
