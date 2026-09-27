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
