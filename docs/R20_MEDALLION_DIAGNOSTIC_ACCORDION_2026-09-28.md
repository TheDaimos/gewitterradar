# R20 – Kompakte Medaillon-Diagnose-Akkordeons

Stand: 2026-09-28

## Ziel

Die in R19 hinzugekommenen Diagnose- und Kalibrierungswerkzeuge im Medaillon-Picker sollen nicht dauerhaft als lange vertikale Liste sichtbar sein. Das Medaillon selbst bleibt dadurch stärker im visuellen Fokus.

## Umsetzung

Die Medaillon-Diagnose ist in vier einklappbare Bereiche gegliedert:

1. **Darstellung & Testzustand**
   - LEER / PFEIL / TREND / FREEZE / NORMAL
   - Pfeil ein/aus
   - Animation ein/aus
   - Freeze ein/aus
   - feste Diagnosewinkel

2. **Auge · Referenzkreis pro Medaillon**
   - Mittelpunkt X/Y
   - Radius
   - AUTO / AUGE ABNEHMEN / RESET / NÄCHSTES AUGE
   - AUGE-JSON
   - bestehender Augenstatus

3. **Pfeil · Größe & Mittelpunkt kalibrieren**
   - Größe
   - Mittelpunkt X/Y
   - AUTO / BASIS / ABNEHMEN / RESET / NÄCHSTER OFFEN
   - KAL-JSON / KAL-CSV
   - bestehender Kalibrierungsstatus

4. **Fit-Matrix & Export**
   - KOPIEREN / JSON / CSV
   - FIT-MATRIX / FIT-JSON
   - bestehender Fit-Datenbankstatus

## Bedienlogik

- Beim ersten Öffnen sind alle Bereiche eingeklappt.
- Es kann höchstens ein Bereich gleichzeitig geöffnet sein.
- Der zuletzt geöffnete Bereich wird für die laufende Browsersitzung unter
  `gewitterradar:v41002:medallion-diagnostic-accordion` gespeichert.
- Das Einklappen verändert keinerlei Diagnose-, Mess- oder Kalibrierungsdaten.
- Die vorhandenen Datenattribute und Aktionsbindungen bleiben bestehen.

## Versionsstand

- Build: `V4.10.02-MODULAR-DEV-R20-2026-09-28`
- Modul-Set: `D31A-5E90`
- Feature-Cache: `41002r20`
- Runtime-Cache: `41002r13`
- `core.manifest`: 1.2.26
- `fullscreen.map-display`: 1.0.19

## Prüfung und Bereitstellung

Finaler geprüfter Kandidat:
`372ae36d27b5ac503fd9ab37c7542d4284575ac9`

Alle ausgelösten Prüfläufe des finalen Kandidaten sind erfolgreich abgeschlossen, einschließlich:
- JavaScript-Syntax
- deterministischer Frontend-Build
- Diagnosevertrag
- Paketvertrag
- HACS-/hassfest-Prüfungen
- Home-Assistant-Laufzeitprüfung
- Hi-Res-Aufbewahrung
- Quellarchivvertrag
- gemeinsame Frontend-Browser-Suiten

`deploy/dev` wurde exakt auf diesen Kandidaten gesetzt.

## Schutzregeln

- R19-Mess- und Kalibrierungslogik unverändert.
- R18 Real-/CI-Paritätsabnahme bleibt gültige Messgrundlage.
- Keine automatische Anwendung von Fit-Skalierungen auf die Produktdarstellung.
- `arrow_00` und bestehende freigegebene Geometrie bleiben geschützt.

## Offene Abnahme

Die technische Bereitstellung ist abgeschlossen. Die visuelle/bedienseitige Abnahme in Home Assistant über DRA bleibt bis zum Gerätetest offen.
