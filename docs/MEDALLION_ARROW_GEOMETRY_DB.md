# Medaillon-/Pfeil-Geometriedatenbank

Stand: V4.10.02 DEV R19

## Zweck

Die Datenbank trennt drei Ebenen sauber voneinander:

1. **Medaillon-Geometrie** je `trend_XX`: Mittelpunkt und Form des sichtbaren Auges/Schauglases.
2. **Pfeil-Geometrie** je `arrow_XX`: sichtbare Alpha-Kontur, Drehpunkt und maximale Ausdehnung.
3. **Fit-Datensatz** je Kombination `trend_XX::arrow_XX`: Verhältnis Pfeil/Auge und daraus abgeleitete sichere Skalierung.

Damit kann Gewitterradar Pfeile unabhängig von der absoluten Instrumentgröße korrekt in unterschiedlich großen Medaillonaugen darstellen.

## Persistenz

Schema: `gewitterradar.medallion-arrow-geometry.v2`

Browser-Speicher:
`gewitterradar:v41002:medallion-arrow-fit-db-v2`

Die Datenbank wird durch die Diagnosefunktion **FIT-MATRIX** erzeugt und aktualisiert. **FIT-JSON** exportiert den vollständigen Messstand.

## Medaillonprofil

Je `trend_XX` werden mindestens gespeichert:

- Quellbreite/-höhe des Laufzeitassets,
- gemessener Augenmittelpunkt,
- `radiusX` und `radiusY`,
- horizontale, vertikale und diagonale Augendurchmesser,
- normierter Fit-Fehler und Erkennungsqualität,
- Messverfahren.

Die Augenkontur wird radial aus dem tatsächlichen Laufzeitasset bestimmt und als Ellipse angenähert. Die vorhandenen Diagnoseprofile dienen nur als Start-/Suchbereich, nicht als fertige individuelle Größenangabe.

## Pfeilprofil

Je `arrow_XX` werden gespeichert:

- Quellbreite/-höhe,
- Drehpunkt,
- sichtbare Alpha-Begrenzung,
- Anzahl sichtbarer Pixel,
- maximale sichtbare Distanz vom Drehpunkt,
- Messverfahren.

Temporäre Konturpunkte werden nur während der Berechnung verwendet und nicht dauerhaft in die Datenbank geschrieben.

## Fit-Datensatz

Schlüssel: `trend_XX::arrow_XX`

Gespeichert werden mindestens:

- Medaillon-ID und Pfeil-ID,
- Augenmittelpunkt und Augenradien,
- sichere Augenradien nach Sicherheitsabzug,
- Pfeildrehpunkt und Alpha-Grenzen,
- aktuelle Pfeil-/Augen-Ratio,
- `recommendedUniformScale`,
- `eyeToArrowScaleRatio`,
- `contained360`,
- `minClearancePx`,
- `maxOverflowPx`,
- `worstAngleDeg`,
- verwendete Winkelschrittweite und Sicherheitsreserve.

Die aktuelle R19-Grundeinstellung prüft den kompletten Drehbereich in 5°-Schritten und reserviert 4 % Sicherheitsabstand zum erkannten Augenrand. Diese Parameter sind Bestandteil der Datenbankkonfiguration und damit im Export nachvollziehbar.

## Laufzeitprinzip

Die Fit-Matrix misst aktuell alle 28 Medaillons gegen alle 18 Pfeile, also **504 Kombinationen**. Die Berechnung läuft in kleinen Blöcken mit Übergabe an den Browser-Renderzyklus, damit iPad/Android während der Messung bedienbar bleiben.

Die gemessene Ratio ist dimensionslos. Dadurch kann später eine frei einstellbare Medaillongröße im Vollbild ergänzt werden, ohne die Kalibrierung neu in Pixeln zu definieren.

## Diagnoseexport

Der Picker-Export verwendet ab R16 `gewitterradar.picker-diagnostic.v2` und enthält:

- aktive `designId`,
- aktive `arrowDesignId`,
- bestehende Picker-/Kalibrierungswerte,
- Datenbank-Schema,
- Anzahl vorhandener Fit-Datensätze,
- erwartete Anzahl Kombinationen,
- aktuellen Fit-Schlüssel,
- aktuellen Fit-Datensatz, sofern bereits gemessen.

## Abnahme

Automatisiert wird mindestens eine echte Kombination durch Augenmessung, Pfeil-Alpha-Messung und Fit-Berechnung geführt. Die vollständige 504er-Matrix bleibt ein realer DRA-/HA-Test, weil dort die tatsächliche Browser-/WebView-Umgebung maßgeblich ist.

Die endgültige Geometriedatenbank gilt erst nach Sichtprüfung der erkannten Augenradien und der empfohlenen Pfeilskalierungen als freigegeben.


## R17 – Real-/CI-Paritätskorrektur

Die erste reale 504er-Matrix zeigte eine systematische Abweichung zur synthetischen CI-Matrix und eine veraltete R12-Buildprovenance. Sie wird deshalb nicht als freigegebene Kalibrierung verwendet.

Ab R17 verwenden beide Messwege denselben Startzustand:
- `eyeSeedMode = runtime-asset-center-parity-v1`
- Mittelpunkt = Zentrum des tatsächlichen Runtime-Assets
- `eyeSeedRadiusRatio = 87 / 264`

Der Startwert begrenzt nur die Kantensuche; das Messergebnis wird weiterhin aus den tatsächlichen Pixeln ermittelt.

Der HA/WebView-Export trägt zusätzlich die Provenance `ha-webview-r17-parity`. FIT-MATRIX wird blockiert, wenn die geladene Buildidentität nicht mit dem erwarteten Manifest-Build übereinstimmt. Dadurch kann ein Browser-Mischstand nicht mehr unbemerkt als gültige Geometriedatenbank exportiert werden.

Analysebeleg: `docs/R16_REAL_FIT_MATRIX_ANALYSIS_2026-09-27.md`.


## R18 – identischer Real-/CI-Messalgorithmus

Die R17-Abnahme bewies, dass ein gemeinsamer Seed allein keine Messparität garantiert. R17 verwendete im HA/WebView weiterhin `radial-color-edge-ellipse-v1`, während CI bereits `first-consistent-eye-ring-ellipse-v2` verwendete.

Ab R18 gilt deshalb für **beide** Messwege verbindlich:
- `first-consistent-eye-ring-ellipse-v2`
- Suchbereich 18–36 % der kleinsten Assetdimension
- radialer Median über alle Winkel
- geglättete lokale Peak-Suche
- erster starker konsistenter Ring
- lokale Mittelpunktoptimierung ±4 px
- lokale Ringabtastung ±4 px
- RadiusX/RadiusY per Sektormedian
- identische Confidence-Schwellen

Die Produktdarstellung bleibt weiterhin von den Messdaten entkoppelt. Erst eine reale R18-Matrix darf gegen CI-R18 abgenommen werden.

Analysebeleg: `docs/R17_REAL_FIT_MATRIX_ANALYSIS_2026-09-27.md`.


## R18 Real-/CI-Abnahme – bestanden

Die reale R18-Matrix vom 2026-09-27 wurde gegen das CI-R18-Artefakt des exakt nach `deploy/dev` promovierten Kandidaten `a85f803422543f62ab6c94a02b085526a5abd23a` verglichen.

Ergebnis:
- 28/28 Medaillonprofile geometrisch exakt identisch
- 18/18 Pfeilprofile identisch bis auf reine IEEE-754-Rundung im `maxRadius`
- 504/504 Fit-Schlüssel identisch
- Scale/Ratio/Overflow nur mit Maschinenrundung bis maximal ca. 4e-14 abweichend
- Containment in allen 504 Fällen identisch
- 26 HIGH / 2 MEDIUM auf beiden Seiten

`worstAngleDeg` kann bei numerisch gleichwertigen Rotationsmaxima zwischen Browser und Node einen anderen Tie-Winkel enthalten. Dieses Feld ist deshalb **kein alleiniger Paritäts-Gatekeeper**, solange die eigentlichen Fit-Metriken übereinstimmen.

Die technische Messparität ist ab R18 freigegeben. Details: `docs/R18_REAL_FIT_MATRIX_ACCEPTANCE_2026-09-27.md`.

Produktive Pfeilskalierung bleibt ein separater Schritt; die Messdaten verändern die Darstellung weiterhin nicht automatisch.


## R18 – Real-/CI-Paritätsabnahme bestanden

Die reale R18-HA/WebView-Matrix vom 2026-09-27 wurde vollständig gegen das CI-R18-Artefakt des Kandidaten `a85f803422543f62ab6c94a02b085526a5abd23a` verglichen.

Ergebnis:
- 28/28 Medaillonprofile numerisch identisch
- 18/18 Pfeilprofile geometrisch identisch; nur Gleitkomma-Rundung im letzten Bit bei sechs `maxRadius`-Werten
- 504/504 Fits fachlich identisch
- Containment 504/504 identisch
- maximale Scale-Abweichung 3.33e-16
- maximale Ratio-Abweichung 4.44e-16
- maximale Overflow-Abweichung 3.91e-14

Abweichende `worstAngleDeg`-Werte bei Gleichständen gelten nicht als Paritätsfehler, solange Norm/Scale/Overflow/Containment identisch bleiben.

Vollständiger Abnahmebeleg:
`docs/R18_REAL_FIT_MATRIX_ACCEPTANCE_2026-09-27.md`

Wichtig: Die Messparität ist freigegeben; eine automatische Produktanwendung der ermittelten Scale-Werte ist damit **nicht automatisch freigegeben**.


## R19 – manuell abgenommener Referenzkreis je Medaillon

R18 bestätigt die technische Parität der automatischen Pixelerkennung. R19 ergänzt darüber eine fachliche Referenzebene: Der gewünschte nutzbare Innenraum eines Medaillons kann je Design bewusst von der automatisch erkannten Kante abweichen.

Deshalb kann für jedes `trend_XX` ein manueller Kreis aus Mittelpunkt X/Y und Radius abgenommen werden. Nur ein mit **AUGE ABNEHMEN** bestätigter Kreis ersetzt die automatische Ellipse in der Fit-Matrix.

Referenzhierarchie:
1. `manual-reviewed-circle-v1`, wenn für das Medaillon abgenommen,
2. sonst `first-consistent-eye-ring-ellipse-v2`.

Die automatische Ellipse wird auch bei manueller Referenz als `autoMeasurement` mitgeführt und bleibt diagnostisch sichtbar.

R19 trennt außerdem die Pfeilplatzierung vom tatsächlichen Rotationsursprung. Die CSS-Platzierung bleibt eine Laufzeitgröße; die Konturrotation erfolgt geometrisch um `transform-origin: 50% 50%`.

Ein Wechsel der Augenreferenz invalidiert die 18 davon abhängigen Paar-Fits und hebt bestehende Paarabnahmen auf, ohne manuell eingegebene Paarwerte zu löschen.

Vollständige Bedien- und Exportbeschreibung:
`docs/R19_MEDALLION_EYE_CALIBRATION_2026-09-27.md`.

## R19 – Diagnosewerkzeuge, Referenzkreis und paarweise Sichtabnahme

R19 erweitert die Geometriedatenbank auf Schema `gewitterradar.medallion-arrow-geometry.v2`. Der entscheidende Unterschied ist die Trennung von **automatisch gemessener Geometrie**, **fachlich abgenommenem Auge** und **paarweiser Sichtkorrektur**.

### Augenreferenz je Medaillon

Separater Speicher: `gewitterradar:v41002:medallion-eye-calibration-v1`  
Schema: `gewitterradar.medallion-eye-calibration.v1`

Je `trend_XX` werden AUTO- und manuelle Werte für Mittelpunkt X/Y und Radius geführt. Erst ein mit **AUGE ABNEHMEN** bestätigter Kreis erhält `referenceSource = manual-reviewed-circle-v1` und ersetzt die automatische Ellipse als Fit-Grenze.

Die automatische Messung bleibt als `autoMeasurement` erhalten und wird weiterhin exportiert.

### Zentrumssensitive Pfeilberechnung

R19 unterscheidet CSS-Platzierung des Pfeilelements, tatsächliches `transform-origin: 50% 50%`, automatisch empfohlenes Pfeilzentrum und optional manuell korrigiertes Pfeilzentrum.

Der Fit-Datensatz enthält zusätzlich mindestens `recommendedCenter.xPercent/yPercent`, `currentCenterOffsetPx`, `arrowToEyeRatioCentered`, `centeredContained360`, zentrierte Überstand-/Freiraumwerte und den empfohlenen Scale-Faktor des zentrierten Rotationsenvelopes.

### Sichtbare Prüfebenen

Die Diagnose zeichnet automatische Augenellipse, manuellen Referenzkreis, Sicherheitsbereich, Pfeilreichweite sowie Basis-/AUTO-/kalibrierten Mittelpunkt getrennt. Dadurch ist direkt prüfbar, ob eine Abweichung aus der Augenmessung, dem gewählten Zielkreis, der Pfeilgröße oder dem Pfeilzentrum stammt.

### Paarweise Kalibrierung

Separater Speicher: `gewitterradar:v41002:medallion-arrow-visual-calibration-v2`  
Schema: `gewitterradar.medallion-arrow-visual-calibration.v2`

Je `trend_XX::arrow_XX` können Größe sowie Mittelpunkt X/Y manuell korrigiert und abgenommen werden. Diese Werte bleiben von der produktiven Darstellung entkoppelt, bis eine eigene Produktstufe sie explizit übernimmt.

### Invalidierung

Eine Änderung einer abgenommenen Augenreferenz invalidiert alle 18 zugehörigen Fits und hebt deren Paarabnahme auf. Dadurch kann eine alte 504er-Matrix nicht versehentlich als weiterhin gültig erscheinen.

Vollständige Bedienbeschreibung: `docs/R19_MEDALLION_EYE_CALIBRATION_2026-09-27.md`.
