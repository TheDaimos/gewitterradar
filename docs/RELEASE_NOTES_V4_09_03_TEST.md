# Gewitterradar V4.09.03 DEV/TEST – Release Notes

Stand: **20.09.2026**  
Status: **DEV/Testkandidat – nicht veröffentlicht**  
Öffentliche Rückfallbasis: **V4.08 FINAL**  
Aktiver Branch: `feature/v4.09.03-fullscreen-controls`

## Kurzfassung

V4.09.03 vervollständigt den V4.09-Kartenansichtsblock nach der nächsten realen Vollbildprüfung. Der Schwerpunkt liegt ausschließlich auf der Bedienbarkeit der Vollbildkarte: sichere Testschaltflächen-Sichtbarkeit, Standortbedienung, Layer-Vordergrund sowie frei verschiebbare und separat ein-/ausblendbare Instrumente.

## Änderungen gegenüber V4.09.02

### Behoben

- Warnsystem-Testschaltflächen bleiben bei nicht aktivierter Warnsystem-Simulation auch im Vollbild **sicher verborgen**.
- Die Sichtbarkeitslogik ist nicht mehr davon abhängig, ob sich die Kartenkarte noch unter `#card-root` oder bereits im Vollbilddialog befindet.
- Die bestehende Standortanzeige samt bestehendem Standortmenü wird im Vollbild automatisch oben rechts eingesetzt.
- Die Layer-Schaltfläche bleibt dauerhaft oberhalb aller Karten-Instrumente und Overlays.

### Vollbild-Kompass

- exakt **30 % größer** als in V4.09.02;
- weiterhin derselbe aktuell ausgewählte produktive Kompass;
- weiterhin frei per Maus/Touch/Pointer verschiebbar;
- Position weiterhin normalisiert lokal gespeichert;
- zusätzlich eigener kleiner Ein/Aus-Schalter oben links.

### Vollbild-Medaillon

Neu hinzugekommen:

- Live-Tendenzmedaillon auf der Vollbildkarte;
- produktive Zustände `none / up / down / stable`;
- frei per Maus/Touch/Pointer verschiebbar;
- normalisierte Position lokal gespeichert;
- unabhängiger kleiner Ein/Aus-Schalter oben links.

### Lokale Browserpräferenzen

Zusätzlich zu den bestehenden V4.09-Schlüsseln:

- `gewitterradar:v409:map-compass-visible`;
- `gewitterradar:v409:map-medallion-visible`;
- `gewitterradar:v409:map-medallion-position`.

Keine dieser Darstellungspräferenzen erzeugt oder verändert Home-Assistant-Helfer.

## Bereits aus V4.09.02 übernommen

- kompakte rot/blau/goldene Layer-Schaltfläche rechts unten in der Karte;
- Kontextmenü Standard / Groß / Vollbild;
- gerätespezifische Startdarstellung Standard / Groß / Vollbild / Zuletzt verwendet;
- separates Kartenfenster ausschließlich in den Einstellungen;
- gehärtete Fenster-/Vollbilddarstellung;
- dieselbe Leaflet-Instanz über Größenwechsel;
- gemeinsame bytegleiche Auslieferung für Integration und Dashboard.

## Nicht verändert

V4.08 FINAL, Clusterprofile, Radien, Aura, Ortssuche, gespeicherte Orte, About, Hilfe, Diagnose, Hi-Res-Master und native Integrationsschnittstellen bleiben außerhalb dieses Arbeitsblocks.

## Release History in der App

Die sichtbare DE/EN-Release-History enthält einen neuen Eintrag:

**V4.09.03 · DEV · 2026/09**

Er dokumentiert:

- fail-closed Warnsystem-Testschaltflächen;
- Standort oben rechts im Vollbild;
- Layer-Control dauerhaft im Vordergrund;
- Kompass +30 %;
- kleine Kompass-/Medaillon-Schalter oben links;
- frei verschiebbares Live-Tendenzmedaillon.

## Testvertrag

Der V4.09-Vertrag prüft statisch und im Browser:

- Frontend-Parität beider Auslieferungsformen;
- genaue V4.09.03-Identität;
- exakte Kompass-Skalierung +30 %;
- Layer-z-order;
- Standort-Vollbildpfad;
- Kompass-/Medaillon-Sichtbarkeit und Positionsspeicherung;
- beide Drag-Pfade;
- fail-closed Testwerkzeuge;
- Desktop/iPad/Android;
- Standard/Groß/Vollbild und separates Fenster.

Die bestehenden About-/Diagnose-/Hi-Res-Schutzverträge bleiben aktiv.

## Offene reale Abnahme

Vor Promotion müssen insbesondere auf Desktop, Android und iPad real bestätigt werden:

- Layer-Schaltfläche bleibt immer anklickbar;
- Standortmenü funktioniert im Vollbild;
- Kompass +30 % wirkt passend;
- Kompass ein/aus + verschieben;
- Medaillon ein/aus + verschieben;
- Medaillon zeigt die aktuelle Tendenz korrekt;
- Testschaltflächen nur bei aktivierter Warnsystem-Simulation;
- separates Kartenfenster bleibt korrekt;
- Rückkehr aus Vollbild restauriert normale Ansicht.

## Release-Sperre

Bis zur ausdrücklichen realen Abnahme:

**Kein Merge nach `main`, kein öffentlicher V4.09-Tag, kein Release, kein Freeze-Branch und kein Golden Master.**
