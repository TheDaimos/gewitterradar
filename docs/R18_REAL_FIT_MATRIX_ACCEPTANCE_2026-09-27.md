# R18 reale Pfeil/Auge-Fit-Matrix – Real-/CI-Abnahme 2026-09-27

## Eingangsdatei

`gewitterradar_medallion_arrow_fit_db_2026-09-27T17-31-27-671Z.json`

## Provenienz

- Build: `V4.10.02-MODULAR-DEV-R18-2026-09-27`
- Browser: Firefox 156 unter Windows 10/11 WebView-Kontext
- Real-Provenienz: `ha-webview-r18-first-consistent-eye-ring`
- CI-Provenienz: `ci-offline-r18-first-consistent-eye-ring`
- Quelle real: `runtime-assets`
- Quelle CI: `frontend/assets`
- Methode: `first-consistent-eye-ring-ellipse-v2`
- Suchbereich: 18–36 %
- Sicherheitsabstand: 4 %
- Rotationsschritt: 5°
- Augenabtastung: 2°
- Alpha-Schwellwert: 8

## Vollständigkeit

Real und CI enthalten identisch:
- 28 Medaillonprofile
- 18 Pfeilprofile
- 504 Fit-Schlüssel
- keine fehlenden Schlüssel
- keine zusätzlichen Schlüssel

## Reale R18-Statistik

- Confidence: 26 HIGH / 2 MEDIUM / 0 LOW
- `contained360=true`: 0
- `contained360=false`: 504
- `recommendedUniformScale`: min 0.48455040079401707 / max 0.9924283230546449 / Mittel 0.7065787863337074
- `arrowToEyeRatioCurrent`: min 1.0076294446354068 / max 2.0637688016795206 / Mittel 1.4386739153032084

Restriktivste Kombination:
- `trend_12::arrow_13`
- Scale 0.48455040079401707
- Ratio 2.0637688016795206
- Überstand 50.55029345581082 px
- Worst Angle 140°

Großzügigste Kombination:
- `trend_01::arrow_00`
- Scale 0.9924283230546449
- Ratio 1.0076294446354068
- Überstand 1.2341389642234077 px
- Worst Angle 135°

## Exakter Real-/CI-Vergleich

### Medaillonprofile

**28/28 Profile sind in allen geometrisch relevanten Feldern exakt identisch:**
- sourceWidth/sourceHeight
- centerX/centerY
- radiusX/radiusY
- baseRadius
- vier Durchmesser
- rmsNormalized
- edgeScoreMedian
- radialMad
- confidence
- method

Damit ist die R18-Augenvermessung im Browser und in CI deterministisch gleich.

### Pfeilprofile

Alle 18 Profile sind geometrisch identisch. Bei 6 Pfeilen unterscheidet sich lediglich `maxRadius` um die letzte IEEE-754-Stelle (ca. 2.8e-14 bis 5.7e-14 px). Alpha-Bounds, Pivot, Pixelzahl und Methode sind identisch.

### 504 Fits

Für alle 504 Kombinationen stimmen die produktrelevanten Größen innerhalb reiner Maschinenrundung überein:

- max. Abweichung `arrowToEyeRatioCurrent`: 4.44e-16
- max. Abweichung `recommendedUniformScale`: 3.33e-16
- max. Abweichung `maxOverflowPx`: 3.91e-14 px
- `minClearancePx`: exakt
- `contained360`: exakt
- `rotationStepDeg`: exakt
- `safeInsetRatio`: exakt

Bei 122/504 Datensätzen unterscheidet sich `worstAngleDeg`. Ursache sind numerisch gleichwertige Maxima an mehreren Rotationswinkeln; Browser und Node wählen bei Gleitkomma-Ties teilweise einen anderen der gleichwertigen Winkel. Da Ratio, Scale, Overflow und Containment praktisch exakt gleich sind, ist dies **kein geometrischer oder produktrelevanter Paritätsfehler**.

## Abnahmeentscheidung

**R18 Real-/CI-Parität: BESTANDEN.**

Die harte Voraussetzung für eine spätere produktive Verwendung der Fit-Daten ist damit erfüllt.

Die R18-Matrix beweist zugleich, dass die bisherige einheitliche Pfeilgröße von 59.667391 % für keine der 504 Kombinationen vollständig innerhalb des um 4 % verkleinerten Augenbereichs rotiert. Der erforderliche paarweise Skalierungsfaktor liegt zwischen ca. 48.46 % und 99.24 % der bisherigen Pfeilgröße.

Die Messdaten dürfen nun als technisch belastbare Grundlage für eine gezielte Produktkalibrierung verwendet werden. Eine produktive Anwendung bleibt eine separate Änderung und muss als eigener Schritt implementiert, CI-gesichert und real visuell abgenommen werden.
