# R21 – Produktive Medaillonkalibrierung und Vollbild-Instrumentskalierung

Stand: 2026-09-28

## Ausgangslage

Die reale R19/R20-Kalibrierung ist vollständig abgeschlossen:

- 28/28 Augenreferenzen abgenommen.
- 504/504 Medaillon-/Pfeil-Kombinationen abgenommen.
- 0 offene Paarabnahmen.
- 172 Kombinationen besitzen manuelle Korrekturen; 332 verwenden den bestätigten automatischen Wert.

Die Kalibrierung wurde bislang absichtlich nur diagnostisch geführt. R21 übernimmt den final abgenommenen Datensatz explizit in die Produktdarstellung.

## Produktive Kalibrierung

Die 504 bestätigten Paarwerte sind als vier statische Datenmodule hinterlegt:

- `medallion-arrow-calibration-1.js`
- `medallion-arrow-calibration-2.js`
- `medallion-arrow-calibration-3.js`
- `medallion-arrow-calibration-4.js`

Jeder Schlüssel folgt unverändert dem stabilen Schema `trend_XX::arrow_XX` und enthält:

1. produktiven Pfeil-Skalierungsfaktor,
2. Mittelpunkt X in Prozent,
3. Mittelpunkt Y in Prozent.

Die produktive Darstellung setzt daraus `--trend-arrow-scale`, `--trend-arrow-center-x` und `--trend-arrow-center-y`.

Die geschützte Diagnose-/Messgeometrie bleibt davon getrennt. Im aktiven Diagnosemodus werden weiterhin die festen Referenzwerte X 50.012238 %, Y 50.452396 % und die unveränderte Basisbreite 59.667391 % verwendet. Dadurch bleibt die Diagnose reproduzierbar, während die normale Produktansicht die reale 504er-Abnahme nutzt.

## Vollbild-Größe für Kompass und Medaillon

Sowohl der Kompass-Picker als auch der Medaillon-Picker besitzen nun einen eigenen Bereich **Vollbild-Größe**.

Vorgaben:

- 50 %
- 75 %
- 100 %
- 125 %
- 150 %
- freie Eingabe von 15 bis 300 %

Kompass und Medaillon werden getrennt gespeichert:

- `gewitterradar:v41002:fullscreen-compass-scale`
- `gewitterradar:v41002:fullscreen-medallion-scale`

Die Skalierung verändert die tatsächliche Instrumentgröße im Karten-Vollbild bzw. separaten Kartenfenster. Sie baut auf der jeweils responsiv ermittelten Ausgangsgröße auf und bleibt damit zwischen Desktop, iPad und Android konsistent.

## Build-Identität

- Build: `V4.10.02-MODULAR-DEV-R21-2026-09-28`
- Runtime-Cache: `41002r13`
- Feature-Cache: `41002r21`
- Modulsatz: `D31A-5E91`
- `core.manifest`: 1.2.27
- `fullscreen.map-display`: 1.0.20
- `ui.skeleton`: 1.1.4

## CI

Finaler technischer Kandidat:

`71d0ba949afa3ff6a2b31d91d8f88e9140379353`

Alle fünf zentralen Prüfungen sind erfolgreich:

- Validate shared Gewitterradar frontend
- Validate Gewitterradar integration
- Diagnostic contract
- Source archive contract
- Hi-Res asset retention

Der bestehende Browservertrag wurde für die produktive Kalibrierung erweitert: Im Produktmodus wird gegen den aktiven Kalibrierungssatz geprüft; im Diagnosemodus bleibt die geschützte Referenzgeometrie verbindlich.

## Reale Abnahme

Noch offen und deshalb nicht als real abgenommen markieren:

- R21 über DRA installieren.
- Frontend vollständig neu laden.
- repräsentative Medaillon-/Pfeil-Kombinationen in Normalansicht prüfen.
- Kompass-Vollbild-Größe 50/75/100/125/150 % und freie Werte 15–300 % prüfen.
- Medaillon-Vollbild-Größe 50/75/100/125/150 % und freie Werte 15–300 % prüfen.
- Speicherung nach Frontend-Neuladen prüfen.
- Desktop, iPad und Android/HA Companion prüfen.
