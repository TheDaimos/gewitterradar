# Gewitterradar – Projektstatistik

Stand: 2026-09-27

Diese Statistik rekonstruiert die Entwicklungsleistung des Gewitterradar-Projekts von den frühen V3.x-Ständen vor Git bis zum aktuellen V4.10.02/R19-Stand.

## Kurzfassung

- **Rekonstruierte Gesamtzahl benannter Entwicklungsiterationen:** ca. **210**
- **Plausibler Korridor:** ca. **200–220**
- **Direkt belegbare Mindestzahl benannter Stände/Iterationsmarker:** **135**
- **Git-Commits auf der aktuellen V4.10.02-Feature-Linie seit 2026-09-06:** **1.672**
- **Zeitraum dieser Git-Linie:** 2026-09-06 bis 2026-09-27
- **Mittlere Commit-Dichte auf dieser Linie:** ca. **78 Commits/Tag**

Die Zahl 210 ist bewusst als rekonstruierter Arbeitswert und nicht als mathematisch exakte historische Zahl gekennzeichnet.

## Zählmethode

Als Entwicklungsiteration zählt ein eigenständig benannter Produkt-/Build-/Teststand, beispielsweise:

- reguläre Versionsstände wie `V3.988` oder `V4.09.28`;
- PRE-FINAL-/RC-/TEST-Stände, sofern sie als eigener Entwicklungsstand nachweisbar sind;
- V4.10.02-R-Stände wie `R10`, `R18` oder `R19`;
- verworfene Stände, wenn sie tatsächlich erzeugt bzw. getestet wurden.

Nicht als eigene Produktiteration gezählt werden:

- reine Dokumentationscommits;
- jeder einzelne Git-Commit;
- Branches, deren Versionsname allein keinen erzeugten Build beweist;
- nur geplante, aber nicht nachweislich erzeugte Versionen;
- Modulversionen, Integrationsversionsnummern und Assetrevisionen als separate Produktiteration.

Dadurch ist die Statistik konservativer als eine reine Commit- oder Branchzählung.

## Direkt belegbare Mindestzahl

Die derzeitige Mindestzahl von **135** setzt sich aus explizit belegten, eindeutig benannten Entwicklungsständen zusammen.

### Frühe V3.x-Phase / Vor-Git und Übergang: 55

Belegt sind unter anderem:

- V3.94, V3.95, V3.96, V3.97;
- die vollständige Iterationskette V3.971 bis V3.9799;
- V3.98;
- V3.981, V3.982;
- V3.984 bis V3.993 mit den belegten Einzelständen;
- V3.9937, V3.9938, V3.9939;
- V3.99318 bis V3.99324;
- V3.99400, V3.99401, V3.99404, V3.99405, V3.99407, V3.99408, V3.99409;
- V3.995;
- V3.99710 und V3.99715.

Nicht belegte Nummernlücken werden ausdrücklich **nicht** automatisch mitgezählt.

### V4.00 bis V4.06: 7

- V4.00
- V4.01
- V4.02
- V4.03
- V4.04
- V4.05
- V4.06

### V4.07: mindestens 36 explizite Versionsmarker

Die aktuelle Git-Historie enthält mindestens 36 unterschiedliche explizite V4.07-Versionsmarker, darunter V4.07 selbst sowie zahlreiche Stände von V4.07.10 bis V4.07.57.

Zusätzliche TEST-/R-Stände sind historisch vorhanden. Sie werden in der Mindestzahl nur dann zusätzlich angesetzt, wenn sicher ist, dass sie nicht lediglich einen bereits gezählten Versionsstand anders bezeichnen.

### V4.08: mindestens 13 explizite Versionsmarker

Direkt in der Git-Historie nachweisbar sind V4.08 sowie V4.08.01 bis V4.08.11 und V4.08.40.

Der veröffentlichte V4.08-Stand wurde aus V4.08.40 RC finalisiert.

### V4.09: mindestens 6 explizite Versionsmarker

Direkt nachweisbar sind mindestens:

- V4.09
- V4.09.01
- V4.09.24
- V4.09.25
- V4.09.27
- V4.09.28

Die Entwicklung erreichte nachweislich V4.09.28; deshalb liegt die tatsächliche Zahl der V4.09-Iterationen deutlich über der sechs Marker umfassenden konservativen Mindestzählung.

### V4.10: mindestens 18 Entwicklungsstände

Für die aktuelle V4.10-Linie sind V4.10.01/V4.10.02 sowie die nachweisbaren R-Stände R4 bis R19 berücksichtigt.

Auch verworfene Iterationen wie R11 zählen als Entwicklungsaufwand, werden jedoch klar von freigegebenen DRA-Kandidaten getrennt.

## Warum die rekonstruierte Gesamtzahl höher ist

Die Mindestzahl von 135 zählt ausschließlich ausdrücklich belegte Marker und lässt absichtlich Lücken offen.

Die tatsächliche Entwicklungsfolge enthält zusätzlich:

- V4.07 TEST-Stände bis mindestens TEST31/TEST32;
- Revisionsstände wie TEST9R1/TEST9R2;
- nicht in jedem Committext ausgeschriebene V4.07-Unterversionen;
- V4.08-Entwicklung bis zum internen Build V4.08.40;
- V4.09-Entwicklung bis V4.09.28;
- frühere Arbeitsstände, deren Dateien/Chats einen Testlauf belegen, ohne dass heute noch jeder einzelne Versionsmarker in Git sichtbar ist;
- vor Git entstandene Zwischenstände, die nur über frühere Chats/Artefaktnamen rekonstruierbar sind.

Daraus ergibt sich derzeit ein realistischer Korridor von **ca. 200 bis 220** tatsächlich benannten bzw. eigenständig behandelten Entwicklungsiterationen.

Als kompakter Arbeitswert wird deshalb **ca. 210 Iterationen** verwendet.

## Git-Aktivität

Auf der aktuellen Feature-Linie `feature/v4.10.02-modularization` sind zum Stand 2026-09-27 **1.672 Commits** erreichbar.

Ältester Commit dieser heute erreichbaren Linie:

- 2026-09-06
- `5b543ce730835788c2475874b4487e2d875c6a53`
- `Initialize native Gewitterradar integration repository`

Aktueller dokumentierter Stand bei Erstellung dieser Statistik:

- 2026-09-27
- Feature-Linie V4.10.02 / R19

Der Zeitraum umfasst rund 21,38 Tage. Daraus ergibt sich eine mittlere Aktivität von ungefähr **78 Commits pro Tag** auf dieser Linie.

Diese Commitzahl ist **keine Versionszahl**. Sie zeigt den technischen Änderungsumfang innerhalb der Git-Phase.

## Projektphasen

1. **V3.9x / Vor-Git**  
   Schnelle Funktions-, Sprach-, UI- und Karteniterationen; eingefrorene Referenzstände und PRE-FINAL-Kette.

2. **V3.993xx–V3.997xx / Übergang zu Git**  
   Stabilisierung, Clean-Install, Signatur, Paket-/Fallback-Stände und erste reproduzierbare Stable-Zweige.

3. **V4.00–V4.06 / Produkt- und Releasebasis**  
   Umbenennung zu Gewitterradar, HACS-/Paketierungsphase, Premium-/Sprach-/Integrationskonsolidierung.

4. **V4.07 / Standort, Suche und Diagnose**  
   Weltweite Standortarchitektur, Geocoding, gespeicherte Orte, große TEST-Serie und geschützter Diagnose-/Golden-Master-Vertrag.

5. **V4.08 / Cluster-Navigation**  
   Cluster-Auflösung, Sitzungsnavigation, Infinity-Bedienung, Release bis intern V4.08.40.

6. **V4.09 / Kartenansichten und Vollbild**  
   Standard/Groß/Vollbild, separates Kartenfenster, verschiebbare Instrumente, Layersteuerung und UI-Abschluss bis V4.09.28.

7. **V4.10 / Modularisierung und Instrumentkalibrierung**  
   Modulverbund, DRA-Abnahme, Diagnosepicker, Medaillon-/Pfeilkatalog, R-Serie und ab R16–R19 die vollständige Geometrie-/Fit-/Kalibrierdiagnostik.

## Unsicherheit und zukünftige Verfeinerung

Eine vollständig exakte Gesamtzahl ist für die Vor-Git-Zeit nicht mehr beweisbar, wenn ein Zwischenstand weder gespeichert noch benannt noch in einem Chat erwähnt wurde.

Deshalb gelten dauerhaft zwei Zahlen:

- **harte Mindestzahl:** nur direkt nachweisbare Stände;
- **rekonstruierte Gesamtzahl:** bestmögliche historische Rekonstruktion mit transparentem Unsicherheitskorridor.

Diese Datei soll bei weiteren historischen Funden aktualisiert werden. Die Versionshistorie in `docs/HISTORY.md`, Release Notes, Changelog, frühere Chatübergaben und erhaltene Artefakte dienen als Quellen.
