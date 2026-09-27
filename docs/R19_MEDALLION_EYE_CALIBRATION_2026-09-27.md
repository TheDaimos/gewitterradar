# R19 – manuelle Medaillon-Augenreferenz und Pfeilkalibrierung

Stand: 2026-09-27  
Build: `V4.10.02-MODULAR-DEV-R19-2026-09-27`

## Ausgangslage

R18 hat bewiesen, dass HA/WebView und CI denselben automatischen Augenalgorithmus deterministisch ausführen. Die Real-/CI-Parität ist damit technisch bestanden.

Die anschließende Sichtprüfung zeigte jedoch einen anderen Punkt: Eine pixeltechnisch konsistente Kante muss nicht zwingend dem **gestalterisch gewünschten nutzbaren Auge** eines Medaillons entsprechen. Der relevante Innenraum kann je Medaillon unterschiedlich interpretiert werden.

R19 trennt deshalb drei Ebenen:

1. automatische Pixelmessung als Diagnose/Vorschlag,
2. manuell abgenommener Referenzkreis je Medaillon als fachliche Zielgeometrie,
3. optionaler paarweiser Pfeil-Override als letzte visuelle Ausnahmeebene.

## Medaillon-Augenreferenz

Für jedes der 28 Medaillons kann genau ein Referenzkreis definiert werden:

- Mittelpunkt X in Prozent,
- Mittelpunkt Y in Prozent,
- Radius in Prozent der kleinsten Assetdimension,
- daraus abgeleiteter Durchmesser,
- Abnahmestatus.

Speicher:
`gewitterradar:v41002:medallion-eye-calibration-v1`

Schema:
`gewitterradar.medallion-eye-calibration.v1`

Die gelbe Referenzkreis-Grafik ist direkt verschiebbar. Der Radius kann am rechten Griff gezogen oder über den Regler eingestellt werden. X/Y/Radius stehen zusätzlich als numerische Regler bereit.

## Automatik bleibt sichtbar

Die automatische R18/R19-Augenmessung wird nicht entfernt. In der Diagnose bleibt die automatisch erkannte Ellipse sichtbar und wird als Vergleichswert exportiert.

Damit ist direkt erkennbar, ob:
- die automatische Kante korrekt ist,
- der gewünschte Referenzkreis bewusst kleiner/größer ist,
- das gewünschte Zentrum von der automatischen Erkennung abweicht.

Der manuelle Kreis wird **erst nach AUGE ABNEHMEN** als Fit-Referenz verwendet.

## Fit-Hierarchie

Beim Lauf von FIT-MATRIX gilt je Medaillon:

- abgenommener manueller Referenzkreis vorhanden → `manual-reviewed-circle-v1`
- andernfalls → automatische Ellipse `first-consistent-eye-ring-ellipse-v2`

Der 4-%-Sicherheitsabstand wird anschließend auf die aktive Referenz angewendet.

Wird eine abgenommene Augenreferenz verändert, verworfen oder auf AUTO zurückgestellt:
- werden die 18 davon abhängigen Fit-Datensätze dieses Medaillons als veraltet entfernt,
- bestehende paarweise Sichtabnahmen werden nicht gelöscht, aber wieder auf „nicht abgenommen“ gesetzt,
- FIT-MATRIX muss erneut ausgeführt werden.

## Pfeilgeometrie und Mittelpunkt

R19 trennt außerdem zwei zuvor vermischte Begriffe:

- **Platzierung des Pfeils**: bisherige CSS-Lage ca. 50.012238 % / 50.452396 %
- **Rotationsursprung**: tatsächliches CSS `transform-origin: 50% 50%`

Die Alpha-Kontur jedes der 18 Pfeile wird weiterhin automatisch gemessen. Die 360°-Fitberechnung dreht die Kontur um den tatsächlichen 50/50-Rotationsursprung.

Für jede Kombination wird aus der aktiven Augenreferenz automatisch berechnet:
- empfohlenes Pfeilzentrum X/Y,
- empfohlene uniforme Skalierung,
- aktuelle und zentrierte Ratio,
- 360°-Containment,
- Überstand/Freiraum,
- kritischer Winkel.

## Paarweise Sichtkalibrierung

Die bereits in R19 ergänzte Paar-Kalibrierung bleibt bewusst erhalten:

- Größe,
- Mittelpunkt X,
- Mittelpunkt Y,
- AUTO,
- BASIS,
- ABNEHMEN,
- RESET,
- NÄCHSTER OFFEN.

Damit kann ein einzelnes Paar nach der geometrischen Berechnung bei Bedarf visuell nachkorrigiert werden.

Die Paarwerte werden separat unter
`gewitterradar:v41002:medallion-arrow-visual-calibration-v2`
gespeichert.

## Exporte

### AUGE-JSON

Exportiert alle 28 Medaillonreferenzen inklusive:
- automatischer Vorschläge,
- manueller Werte,
- effektivem Kreis,
- Radius/Durchmesser,
- Abnahmestatus.

Schema:
`gewitterradar.medallion-eye-calibration-export.v1`

### FIT-JSON

Exportiert die komplette Geometriedatenbank und 504er-Fit-Matrix. Bei abgenommenen Augenreferenzen enthält das Medaillonprofil zusätzlich:
- `referenceSource = manual-reviewed-circle-v1`
- `manualReference`
- `autoMeasurement`

Damit bleibt die automatische Messung trotz manueller Referenz nachvollziehbar.

### KAL-JSON / KAL-CSV

Exportiert die 504 Paar-Kalibrierungen. KAL-JSON enthält zusätzlich den vollständigen Augenreferenz-Export.

## Empfohlener Realablauf

1. R19 per DRA installieren und Frontend vollständig neu laden.
2. FIT-MATRIX einmal auf AUTO ausführen, damit alle automatischen Ellipsen verfügbar sind.
3. Pro Medaillon den gelben Referenzkreis visuell auf das gewünschte Auge setzen und **AUGE ABNEHMEN** drücken.
4. Mit **NÄCHSTES AUGE** bis 28/28 fortfahren.
5. AUGE-JSON als Zwischen-/Sicherungsstand exportieren.
6. FIT-MATRIX erneut ausführen. Jetzt werden die 28 abgenommenen Kreise zur Referenz für alle 504 Fits.
7. FIT-JSON exportieren.
8. Nur falls erforderlich einzelne Pfeilpaare über Größe/X/Y korrigieren und abnehmen.
9. KAL-JSON exportieren.

## Freigaberegel

R19 verändert die produktive Pfeildarstellung außerhalb der Diagnose **nicht automatisch**.

Die abgenommenen Augenreferenzen und Paarwerte sind zunächst lokale Kalibrierungsdaten. Erst nach Sichtabnahme und Auswertung werden die gewünschten Referenzen als reproduzierbare Projektkalibrierung ins Repository übernommen und anschließend in einer eigenen Produktstufe aktiviert.

## Diagnoseoberfläche und Messhilfen

R19 macht die verwendete Geometrie im Medaillon-Picker sichtbar, damit automatische Messung und gestalterische Referenz nicht verwechselt werden.

Sichtbare Ebenen:

- **automatische Augenellipse**: Ergebnis der Pixelmessung `first-consistent-eye-ring-ellipse-v2`;
- **gelber Augen-Referenzkreis**: fachlich gewünschter nutzbarer Innenraum; Mittelpunkt und Radius sind direkt manipulierbar;
- **4-%-Sicherheitsbereich**: aus der aktiven Augenreferenz abgeleitete innere Fit-Grenze;
- **Pfeilreichweite**: maximale sichtbare Entfernung der Alpha-Kontur vom tatsächlichen Rotationsursprung;
- **Basis-Mittelpunkt**: bisherige CSS-Platzierung;
- **AUTO-Mittelpunkt**: geometrisch empfohlenes Zentrum;
- **kalibrierter Mittelpunkt**: aktuell manuell wirksamer X/Y-Wert.

Der gelbe Kreis ist absichtlich **keine automatische Messung**. Er ist ein einmalig visuell abnehmbares fachliches Ziel: Der sichtbare Pfeil soll bei voller 360°-Rotation den daraus abgeleiteten Sicherheitsbereich nicht überschreiten.

### Direkte Bedienung

Für das Auge:

- Kreis direkt verschieben → Mittelpunkt X/Y;
- rechten Kreisgriff ziehen → Radius;
- alternativ X/Y/Radius über Regler setzen;
- `AUTO` → automatische Augenmessung als Ausgangspunkt;
- `AUGE ABNEHMEN` → Referenz verbindlich für dieses Medaillon;
- `RESET` → lokale manuelle Referenz verwerfen;
- `NÄCHSTES AUGE` → nächste noch nicht abgenommene Medaillon-ID;
- `AUGE-JSON` → alle 28 Augenreferenzen exportieren.

Für ein Medaillon/Pfeil-Paar:

- Größe per Regler;
- Pfeilmittelpunkt X/Y per Regler;
- `AUTO` → berechnete Größe und berechnetes Zentrum;
- `BASIS` → bisherige Produktwerte;
- `ABNEHMEN` → Paar visuell bestätigen;
- `RESET` → Paar-Override verwerfen;
- `NÄCHSTER OFFEN` → nächstes noch nicht abgenommenes Paar;
- `KAL-JSON` / `KAL-CSV` → vollständige Paarmatrix mit Auto-/manuellen/effektiven Werten.

## Abhängigkeits- und Invalidierungsregel

Die Augenreferenz ist die übergeordnete Geometrie. Wird ein bereits abgenommenes Auge verändert, sind die 18 davon abhängigen Pfeil-Fits nicht mehr gültig.

Deshalb invalidiert R19 für dieses Medaillon automatisch:

1. die 18 Fit-Datensätze,
2. deren Paar-Abnahmestatus,
3. den Zeitstempel der vollständigen Fit-Matrix.

Die manuell eingegebenen Paarwerte werden dabei nicht still gelöscht. Sie bleiben als Diagnosehistorie erhalten, gelten aber erst nach erneuter `FIT-MATRIX` und erneuter Sichtprüfung wieder als abgenommen.

## Dokumentationsbeziehungen

- Geometriedatenmodell: `docs/MEDALLION_ARROW_GEOMETRY_DB.md`
- dauerhafte Medaillon-/Pfeil-IDs: `docs/MEDALLION_CATALOG.md`
- Modulzuständigkeiten: `docs/V4_10_MODULE_ARCHITECTURE.md`
- Arbeits-/Abnahmeschleife: `docs/V4_10_MODULARISIERUNG_SCHLACHTPLAN.md`
- allgemeines, projektneutrales Verfahren: `TheDaimos/home-assistant-dev-toolkit/docs/ROTATING_OVERLAY_APERTURE_FIT_DIAGNOSTICS.md`
