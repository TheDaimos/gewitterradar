# Medaillon-/Pfeil-Geometriedatenbank

Stand: V4.10.02 DEV R16

## Zweck

Die Datenbank trennt drei Ebenen sauber voneinander:

1. **Medaillon-Geometrie** je `trend_XX`: Mittelpunkt und Form des sichtbaren Auges/Schauglases.
2. **Pfeil-Geometrie** je `arrow_XX`: sichtbare Alpha-Kontur, Drehpunkt und maximale Ausdehnung.
3. **Fit-Datensatz** je Kombination `trend_XX::arrow_XX`: Verhältnis Pfeil/Auge und daraus abgeleitete sichere Skalierung.

Damit kann Gewitterradar Pfeile unabhängig von der absoluten Instrumentgröße korrekt in unterschiedlich großen Medaillonaugen darstellen.

## Persistenz

Schema: `gewitterradar.medallion-arrow-geometry.v1`

Browser-Speicher:
`gewitterradar:v41002:medallion-arrow-fit-db`

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

Die R16-Grundeinstellung prüft den kompletten Drehbereich in 5°-Schritten und reserviert 4 % Sicherheitsabstand zum erkannten Augenrand. Diese Parameter sind Bestandteil der Datenbankkonfiguration und damit im Export nachvollziehbar.

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
