# R17 reale Pfeil/Auge-Fit-Matrix – Analyse 2026-09-27

## Eingangsdatei

`gewitterradar_medallion_arrow_fit_db_2026-09-27T16-52-07-292Z.json`

## Vollständigkeit und Provenienz

- Build: `V4.10.02-MODULAR-DEV-R17-2026-09-27`
- Provenienz: `ha-webview-r17-parity`
- Quelle: `runtime-assets`
- 28 Medaillonprofile
- 18 Pfeilprofile
- 504/504 Fit-Datensätze
- keine fehlenden oder zusätzlichen Fit-Schlüssel
- `generatedAt` gesetzt
- 4 % Sicherheitsabstand
- 5° Rotationsschritt
- 2° Augenabtastung
- Alpha-Schwellwert 8

## Reale R17-Statistik

- Augen-Confidence: 0 HIGH / 3 MEDIUM / 25 LOW
- `arrowToEyeRatioCurrent`: min 0.846055 / max 1.219366 / Mittel 1.025437
- `recommendedUniformScale`: min 0.820099 / max 1.181956 / Mittel 0.980788
- `contained360=true`: 196 / 504
- `contained360=false`: 308 / 504
- maximaler Überstand: 17.643 px
- maximaler positiver Freiraum: 21.691 px
- häufigste Worst-Angles: 140° (200), 50° (80), 135° (79), 130° (78)

Restriktivste Kombination:
- `trend_10::arrow_13`
- Scale 0.820099
- Ratio 1.219366
- Überstand 17.643 px
- Worst Angle 140°

Großzügigste Kombination:
- `trend_17::arrow_00`
- Scale 1.181956
- Ratio 0.846055
- Freiraum 15.292 px
- Worst Angle 135°

Pfeile mit systematisch stärkster Verkleinerung:
`arrow_13`, `arrow_15`, `arrow_14`, `arrow_16`, `arrow_12`, `arrow_17`.

## Exakter Vergleich mit CI-R17

Synthetische CI-R17:
- 28 Medaillons / 18 Pfeile / 504 Fits
- Confidence: 26 HIGH / 2 MEDIUM
- contained360: 0 / 504
- Scale min 0.484550 / max 0.992428 / Mittel 0.706579
- Ratio min 1.007629 / max 2.063769 / Mittel 1.438674

Reale R17:
- Confidence: 25 LOW / 3 MEDIUM
- contained360: 196 / 504
- Scale Mittel 0.980788
- Ratio Mittel 1.025437

Die reale Scale liegt gegenüber CI im Mittel um Faktor ca. 1.407 höher. Die reale erkannte Augenellipse ist über die 28 Medaillons im Mittel ca. 46 % breiter (radiusX) und ca. 40 % höher (radiusY) als die CI-Erkennung.

Beispiel `trend_01`:
- real: radiusX 196.458 / radiusY 192.380 / MEDIUM
- CI: radiusX 170.5 / radiusY 168.5 / HIGH

Beispiel `trend_12`:
- real: radiusX 94.557 / radiusY 95.180 / LOW
- CI: radiusX 51.0 / radiusY 49.5 / HIGH

## Root Cause

R17 hatte zwar Seed/Provenienz vereinheitlicht, aber weiterhin **zwei unterschiedliche Augen-Messalgorithmen**:

HA/WebView:
- `radial-color-edge-ellipse-v1`
- pro Winkel globale Kantensuche über einen breiten Bereich
- `eyeSearchMaxRatio=0.45`

CI:
- `first-consistent-eye-ring-ellipse-v2`
- zunächst radialer Median über alle Winkel
- geglättete Peak-Suche
- erster starker konsistenter Ring
- lokale Mittelpunkt-/Radiusoptimierung
- anschließende ±4-px-Ringabtastung
- `eyeSearchMaxRatio=0.36`

Damit war eine echte Real-/CI-Parität unter R17 prinzipiell nicht möglich.

## R18-Korrektur

R18 portiert den CI-v2-Algorithmus 1:1 in die Browserdiagnose:

- gleicher Suchbereich `0.18 .. 0.36`
- gleicher Winkelabstand
- gleiche Medianbildung
- gleiche Peak-/Clusterlogik
- gleiche Mittelpunktoptimierung
- gleiche lokale Ringabtastung
- gleiche RadiusX/RadiusY-Sektormediane
- gleiche Confidence-Schwellen
- gleiche Methode `first-consistent-eye-ring-ellipse-v2`

Build:
`V4.10.02-MODULAR-DEV-R18-2026-09-27`

Modulsatz:
`A84D-29F7`

R18-Kandidat:
`a85f803422543f62ab6c94a02b085526a5abd23a`

CI: 14/14 erfolgreich.

## Abnahme

Die R17-Realdatei bleibt ein gültiger Diagnose- und Root-Cause-Beleg, ist aber **keine freigegebene Produktkalibrierung**.

Nach R18-DRA-Installation muss die vollständige 504er-Matrix erneut erzeugt werden. Erst wenn die reale R18-WebView-Matrix und die CI-R18-Matrix plausibel konvergieren, darf eine automatische Produktanwendung der Fit-Ratios diskutiert oder freigegeben werden.
