# R16 reale Pfeil/Auge-Fit-Matrix – Analyse 2026-09-27

## Eingangsdatei

`gewitterradar_medallion_arrow_fit_db_2026-09-27T13-04-56-531Z.json`

## Vollständigkeit

- Schema: `gewitterradar.medallion-arrow-geometry.v1`
- 28 Medaillonprofile
- 18 Pfeilprofile
- 504 Fit-Datensätze
- keine fehlenden oder zusätzlichen Fit-Schlüssel
- `generatedAt`: gesetzt
- Konfiguration: 4 % Sicherheitsabstand, 5° Rotationsschritt, 2° Augenabtastung, Alpha-Schwellwert 8

## Kritischer Provenance-Befund

Der reale Export meldete als Build:

`V4.10.02-MODULAR-DEV-R12-2026-09-26`

Obwohl FIT-MATRIX erst im späteren R16-Zweig freigegeben wurde. Damit ist der Export als Misch-/Altprovenance-Datensatz zu behandeln und darf nicht automatisch als freigegebene Produktkalibrierung übernommen werden.

## Reale Messstatistik

- Augen-Confidence: 0 HIGH / 3 MEDIUM / 25 LOW
- `arrowToEyeRatioCurrent`: min 0.846055 / max 1.219366 / Mittel 1.025341
- `recommendedUniformScale`: min 0.820099 / max 1.181956 / Mittel 0.980892
- `contained360=true`: 196 / 504
- `contained360=false`: 308 / 504
- maximaler Überstand: 17.643 px
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

Kleinste ermittelte Augenfläche:
- `trend_04` – radiusX 87.312 / radiusY 84.162, LOW

Größte ermittelte Augenfläche:
- `trend_01` – radiusX 202.994 / radiusY 192.913, MEDIUM

Systematisch stärkste Verkleinerung:
`arrow_13`, danach `arrow_15`, `arrow_14`, `arrow_16`, `arrow_12`, `arrow_17`.

## Vergleich mit synthetischer CI-Paritätsmatrix

CI R16:
- 28 Medaillons / 18 Pfeile / 504 Fits
- Confidence: 26 HIGH / 2 MEDIUM
- contained360: 0 / 504
- Scale min 0.484550 / max 0.992428 / Mittel 0.706579
- Ratio min 1.007629 / max 2.063769 / Mittel 1.438674
- restriktivste Kombination: `trend_12::arrow_13`, Scale 0.484550

Die Abweichung ist systematisch und zu groß für Browser-/Subpixelstreuung.

## Root Cause

Browser und CI verwendeten vor R17 nicht dieselbe Augen-Startgeometrie:

- CI: neutraler Mittelpunkt des Runtime-Assets + Radius 87/264 der Assetbreite
- HA/WebView: designspezifische ältere Diagnoseprofile als Mittelpunkt/Radius-Seed

Diese alten Seeds beeinflussten den radialen Kantensuchraum und führten zu einer grundlegend anderen erkannten Augengeometrie.

Zusätzlich war die Build-Provenance im realen Export veraltet.

## R17-Korrektur

- Browser und CI verwenden identisch `runtime-asset-center-parity-v1`.
- Seed-Mittelpunkt: Runtime-Assetzentrum.
- Seed-Radius: `87 / 264` der Assetbreite.
- Seed-Modus und Seed-Ratio werden im Export festgehalten.
- HA-Export erhält Provenance `ha-webview-r17-parity`.
- Hauptloader überschreibt Build-/Versionsidentität explizit im Modulkontext.
- FIT-MATRIX blockiert bei abweichender Loader-/Manifest-Buildidentität.
- Keine automatische Übernahme der R16-Messwerte in die Produktdarstellung.

## Abnahme

Die R16-Realdatei ist ein wertvoller Fehlernachweis, aber **keine freigegebene Kalibrierungsdatenbank**.

Nach R17-DRA-Installation muss die vollständige 504er-Matrix erneut erzeugt und als eine FIT-JSON exportiert werden. Erst wenn reale R17- und CI-R17-Matrix plausibel konvergieren, darf über produktive Skalierungsmetadaten entschieden werden.
