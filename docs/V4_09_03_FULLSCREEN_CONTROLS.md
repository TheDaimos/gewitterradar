# Gewitterradar V4.09.03 — Vollbild-Bedienelemente

Stand: **20.09.2026**  
Status: **DEV/Testkandidat – nicht veröffentlicht**  
Branch: `feature/v4.09.03-fullscreen-controls`  
Öffentliche Rückfallbasis: **V4.08 FINAL**

## Anlass

Die reale Prüfung des V4.09.02-Vollbilds zeigte weitere konkrete Bedienpunkte:

1. Die Warnsystem-Testschaltflächen konnten im Vollbild sichtbar bleiben, obwohl die Warnsystem-Simulation nicht aktiviert war.
2. Die normale Standortanzeige samt Auswahlmenü fehlte als direkte Vollbildbedienung.
3. Die Layer-Schaltfläche muss unabhängig von allen Instrumenten und Karten-Overlays immer im Vordergrund bleiben.
4. Der Vollbild-Kompass soll deutlich präsenter sein.
5. Kompass und Medaillon sollen im Vollbild unabhängig ein-/ausblendbar und frei positionierbar sein.

## Umsetzung

### Warnsystem-Testschaltflächen

Die frühere Sichtbarkeit hing über `#card-root.tests-hidden` an der DOM-Position. Da die Kartenkarte für Vollbild in den Dialog verschoben wird, konnte diese Kaskade umgangen werden.

V4.09.03 arbeitet deshalb fail-closed:

- `simulationOn` ist nur bei explizitem Helper-Zustand `on` wahr;
- alle `[data-warning-test]`-Elemente erhalten zusätzlich ihren eigenen `hidden`-Zustand;
- `[data-warning-test][hidden] { display:none!important; }` schützt die Regel unabhängig vom DOM-Elternknoten.

### Standort oben rechts

Die bestehende Standortsteuerung wird nicht dupliziert, sondern im Vollbild in `#map-location-overlay` eingesetzt. Das bestehende `#location-dropdown` wird während des Vollbilds ebenfalls in den Dialog gehoben. Beim Verlassen des Vollbilds werden beide an ihre ursprünglichen Eltern zurückgesetzt.

Damit bleiben dieselbe Standortquelle, dieselben gespeicherten Orte, dieselbe Suche und dieselben Events aktiv.

### Layer-Schaltfläche immer ganz oben

`#map-display-control` besitzt innerhalb der Karte dauerhaft `z-index:2147483647`. Das gilt unabhängig davon, ob das Kontextmenü geöffnet ist.

Darunter liegen:

- Instrument-Schalter: `2147483646`;
- Standort-Dropdown: `2147483645`;
- Standortanzeige: `2147483644`;
- Kompass-/Medaillon-Overlays deutlich darunter.

Damit bleibt die Layer-Bedienung stets erreichbar.

### Kompass +30 %

Die V4.09.02-Größe wird exakt mit Faktor **1,30** skaliert:

- Desktop/Tablet: `clamp(145px,24vmin,300px)` → `clamp(188.5px,31.2vmin,390px)`;
- Mobile: `clamp(132px,36vmin,230px)` → `clamp(171.6px,46.8vmin,299px)`.

Der aktuell ausgewählte Kompass bleibt derselbe produktive `#compass-instrument`; er wird nur in das Vollbild-Overlay verschoben. Dragging und normalisierte Positionsspeicherung bleiben erhalten.

### Kleine Instrument-Schalter oben links

`#map-instrument-controls` erscheint nur im Vollbild und enthält zwei kleine Taster:

- `#map-compass-toggle` — Kompass;
- `#map-medallion-toggle` — Medaillon.

Beide Schalter arbeiten unabhängig voneinander und persistieren nur lokal im Browserprofil.

Lokale Schlüssel:

- `gewitterradar:v409:map-compass-visible`;
- `gewitterradar:v409:map-medallion-visible`.

### Frei verschiebbares Live-Medaillon

Das Vollbild-Medaillon nutzt dieselben geschützten Medaillon-/Pfeil-Assets wie die normale Tendenzanzeige. Es besitzt ein eigenes Overlay `#map-medallion-overlay` und spiegelt die produktiven Zustände:

- `none`;
- `up`;
- `down`;
- `stable`.

Es ist per Pointer Events auf Maus und Touch frei verschiebbar. Seine normalisierte Position wird in

`gewitterradar:v409:map-medallion-position`

gespeichert.

Die normale Tendenzlogik selbst wird nicht verändert.

## Unverändert

- V4.08 FINAL und native Integration 0.20.0 als öffentliche Rückfallbasis;
- Leaflet-Instanz;
- Radien, Aura und Clusterlogik;
- Standort-/Suchlogik selbst;
- Kompassauswahl und Gerätekompasslogik;
- Medaillon-Trendberechnung;
- About-/Help-Goldenverträge;
- Diagnosevertrag;
- Hi-Res-/Master-Retention;
- Helper-IDs `lightning_detection_*`.

## Automatisierte Schutzpunkte

`scripts/verify-v409-map-display.mjs` schützt statisch:

- V4.09.03-Identität;
- drei Auslieferungsdateien bytegleich;
- exakte +30-%-Kompasswerte;
- Layer-z-order;
- Standort-Vollbildpfad;
- Instrument-Schalter;
- Medaillon-Overlay;
- lokale Sichtbarkeits-/Positionsschlüssel;
- fail-closed Testschaltflächen.

`scripts/test-v409-map-display.cjs` prüft über Desktop, iPad und Android sowie Dashboard/Integration:

- Standard → Groß → Vollbild → zurück;
- Kompass-Dragging und Speicherung;
- Medaillon-Dragging und Speicherung;
- Kompass-/Medaillon-Schalter;
- produktiven Medaillon-Zustand;
- Standortanzeige und Dropdown im Vollbild;
- Warnsystem-Testschaltflächen fail-closed;
- Layer-Schaltfläche oberhalb der Instrumente;
- Startdarstellung und separates Fenster.

## Reale Geräteabnahme vor Promotion

1. Desktop: Vollbild öffnen; Standort oben rechts und zwei kleine Instrument-Schalter oben links prüfen.
2. Kompass ein/aus; danach wieder einblenden und verschieben.
3. Medaillon ein/aus; danach wieder einblenden und verschieben.
4. Layer-Schaltfläche trotz überlappendem Kompass/Medaillon anklicken; sie muss immer bedienbar bleiben.
5. Standortmenü im Vollbild öffnen, Ort wechseln und schließen.
6. Diagnose/Warnsystem-Simulation AUS: keine Testschaltflächen im Vollbild.
7. Warnsystem-Simulation EIN: vorgesehene Testschaltflächen sichtbar und funktionsfähig.
8. Android und iPad: Pointer/Touch-Dragging und Schalter wiederholen.
9. Separates Kartenfenster erneut prüfen.
10. Standard/Groß/Vollbild zurückschalten; ursprüngliche normale Ansicht muss vollständig wiederhergestellt sein.

Bis zur ausdrücklichen Abnahme: **kein Merge nach `main`, kein Tag, kein Release, kein Freeze, kein Golden Master.**
