# Gewitterradar V4.11.12 DEV

Stand: **2026-10-07**  
Zweig: `feature/v4.11-development`

## Schwerpunkt

Entkopplung des WeatherRouter-Darstellungsmenüs vom Niederschlagsrenderer.

## Behoben

Im Realtest konnte das Minimieren oder Aufklappen des schwebenden Darstellungsmenüs einen sichtbaren Neuaufbau des Niederschlagslayers auslösen.

Die Ursache bestand aus zwei Teilen:

- jede Zustandsänderung des Darstellungsmenüs aktualisierte unnötig alle sichtbaren Rasterkacheln
- die optischen Niederschlagsstile überschrieben Leaflets eigenes Kachel-`transform`

Beides ist in V4.11.12 korrigiert.

## Neues Verhalten

Reine UI-Aktionen berühren den Niederschlagslayer nicht mehr:

- Menü minimieren / aufklappen
- Menü verschieben
- Position speichern
- Augenstatus ändern
- Legendenmodus ändern

Nur ein Wechsel zwischen `Präzise`, `Ausgewogen` und `Weich` aktualisiert die optischen Rasterfilter.

## Leaflet-Schutz

Der WR-Darstellungsrenderer setzt auf Rasterkacheln **kein** `transform` und kein `transform-origin` mehr.

Die Stilvarianten verwenden ausschließlich Filtereigenschaften:

- Präzise: kein Filter
- Ausgewogen: leichte Weichzeichnung
- Weich: stärkere Weichzeichnung + minimale Sättigung

Leaflets Positionierung bleibt dadurch vollständig unangetastet.

## Regression

Die Build-/Verifikationsverträge prüfen nun explizit:

- UI-Zustandsänderungen dürfen keinen pauschalen Rasterrefresh auslösen
- Rasterrefresh nur bei geändertem Niederschlagsstil
- `node.style.transform` ist im WR-Rasterstil verboten
- `transformOrigin` ist im WR-Rasterstil verboten

## Stand

- `weather.display-menu` 0.2.2
- `core.manifest` 1.2.83
- Runtime **41112r1**
- Modulsatz **E411-12A1**
- Produkt **V4.11.12 DEV**

**C.K. – Eine Idee weiter gedacht.**
