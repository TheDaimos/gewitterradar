# Gewitterradar V4.09.02 DEV/TEST – Release Notes

> **Historischer Stand / superseded:** Die aktive Fortsetzung ist **V4.09.03** auf `feature/v4.09.03-fullscreen-controls`. Aktuelle Details: `docs/RELEASE_NOTES_V4_09_03_TEST.md` und `docs/HANDOFF_V4_09_03_FULLSCREEN_CONTROLS_2026-09-20.md`.

Stand: **20.09.2026**  
Status: **DEV/Testkandidat – nicht veröffentlicht**  
Öffentliche Rückfallbasis: **V4.08 FINAL**  
Aktiver Branch: `feature/v4.09.02-map-display-fixes`

## Ziel

V4.09.02 ist die kontrollierte Fortsetzung des V4.09.01-Kartenansichtsblocks nach der ersten realen Geräteprüfung. Der Funktionsumfang bleibt bewusst eng: Kartendarstellung, separates Kartenfenster, Vollbild-Kompass und lokale Startdarstellung. V4.08 bleibt unangetastet.

## Ausgangspunkt V4.09.01

V4.09.01 ergänzte:

- Kartenansichten **Standard · Groß · Vollbild**;
- dieselbe Leaflet-Instanz über alle Größenwechsel hinweg;
- den aktuell ausgewählten Kompass als Vollbild-Overlay;
- Maus-/Touch-/Pointer-Verschieben des Kompasses;
- normalisierte lokale Speicherung der Kompassposition;
- **„In eigenem Fenster öffnen“** in den Einstellungen;
- Rückfall auf integriertes Vollbild, wenn der Browser das Fenster blockiert.

## Reale Befunde aus V4.09.01

Die erste Installation/Prüfung durch den Benutzer ergab:

1. **Separates Fenster:** Die neue Browseransicht öffnete sich, zeigte jedoch im Wesentlichen die normale Home-Assistant-Oberfläche und nicht zuverlässig die Karte. Ursache war, dass eine zweite HA-Seite mit Query-Parameter geöffnet wurde, der interne Vollbildpfad aber nicht in jedem realen Startfall zuverlässig die Kartenkarte in den Dialog überführte.
2. **Kartenumschaltung:** Die vorhandene Standard/Groß/Vollbild-Leiste war auf Android sichtbar, auf Desktop jedoch so unauffällig, dass sie real zunächst nicht gefunden wurde. Sie saß als eigener Bereich außerhalb der eigentlichen Kartenfläche und entsprach damit nicht der gewünschten direkten Kartenbedienung.

## V4.09.02 – verbindliche UX-Entscheidung

### Karten-Schaltfläche

Die breite Umschaltleiste entfällt. Stattdessen gibt es **eine kompakte Schaltfläche rechts unten innerhalb der Karte**.

Das Symbol besteht aus drei gestapelten Ebenen:

- unten **klein + rot** = Gefahr;
- Mitte **mittel + blau** = Gewitter;
- oben **groß + gold** = Beobachtung.

Die Farbstruktur folgt bewusst den etablierten Gewitterradar-Radien.

### Kontextmenü

Beim Tippen/Klicken öffnet sich an der Schaltfläche ein kompaktes Menü nach oben/links mit:

- **Standard**;
- **Groß**;
- **Vollbild**.

Die Auswahl schließt das Menü wieder; ein Außenklick/-tap schließt es ebenfalls. **„Eigenes Fenster“ ist bewusst nicht Bestandteil dieses Menüs.**

### Startdarstellung pro Gerät

In den Einstellungen wurde **Startdarstellung** ergänzt:

- Standard;
- Groß;
- Vollbild;
- Zuletzt verwendet.

Die Einstellung wird ausschließlich per `localStorage` im jeweiligen Browserprofil gespeichert. Dadurch können Desktop, Android, iPad und weitere Browserprofile unabhängig voneinander starten. Es werden dafür keine Home-Assistant-Helfer angelegt oder verändert.

Technische Schlüssel:

- `gewitterradar:v409:startup-map-display`;
- `gewitterradar:v409:last-map-display-mode`;
- bestehend: `gewitterradar:v409:map-display-mode` als V4.09.01-Kompatibilität;
- bestehend: `gewitterradar:v409:map-compass-position`.

### Eigenes Kartenfenster

Variante A bleibt verbindlich:

- Kartenansichten direkt in der Karte;
- eigenes Browserfenster ausschließlich in **Einstellungen → Kartendarstellung**.

Der Fensterpfad wurde gehärtet:

- Gewitterradar-Host kann die HA-Oberfläche bildschirmfüllend überlagern;
- Vollbilddialog besitzt einen festen Viewport-Rückfallpfad;
- Popup-URL verwendet zusätzlich `gewitterradar_window_version=40902` zur eindeutigen Testtrennung.

## Sichtbare Release History

Die bisherige V4.09-Zukunftsplanung in der App war veraltet und enthielt unter anderem das verworfene **XL**. Im V4.09.02-Branch wurde sie durch einen bilingualen Eintrag **V4.09.02 · DEV · 2026/09** ersetzt. Der Eintrag kennzeichnet den Stand ausdrücklich als nicht veröffentlicht und nennt die noch offene reale Geräteabnahme.

## Nicht verändert

- V4.08 FINAL;
- geschützte V4.07.56-Laufzeit-/Diagnosebasis;
- About-/Widmungsgeometrie;
- Radien und Aura;
- Clusterlogik und Clusterprofile;
- Orts-/Koordinatenlogik;
- Kompassauswahl selbst;
- Diagnosevertrag;
- Hi-Res-/Masterbestand;
- Helper-IDs `lightning_detection_*`.

## Auslieferungsformen

Gewitterradar bleibt **ein Produkt mit zwei Auslieferungsformen**. Die kanonische Datei `frontend/gewitterradar.js` wird bytegleich nach

- `custom_components/gewitterradar/frontend/gewitterradar.js` und
- `dashboard/dist/gewitterradar.js`

geführt.

## Automatisierte Prüfung

Vor dem Dokumentationsabschluss war der technische V4.09.02-Kandidat automatisiert grün für:

- Shared Frontend einschließlich Browserläufen;
- native Gewitterradar-Integration;
- Hi-Res-Asset-Retention;
- geschützten Diagnosevertrag auf dem relevanten Runtime-Stand;
- V4.09-Kartenansichtsvertrag;
- V4.08-/V4.07.56-About-Goldenvertrag mit V4.09.xx-Identitätsfreigabe.

Die automatisierten Tests ersetzen **nicht** die reale Geräteabnahme.

## Noch offen vor Merge/Release

- Layer-Schaltfläche auf Desktop real prüfen;
- Layer-Schaltfläche und Menü auf Android real prüfen;
- iPad/iPad Pro Touch-Verhalten prüfen;
- Standard → Groß → Vollbild → zurück prüfen;
- Startdarstellung je Gerät/Browserprofil prüfen;
- „Zuletzt verwendet“ gerätegetrennt prüfen;
- separates Fenster erneut real prüfen: Karte statt HA-Oberfläche;
- Kompass im Vollbild/separaten Fenster sichtbar und verschiebbar prüfen;
- nach erfolgreicher Abnahme erst Promotion/Freeze/Golden/Release planen.

## Release-Sperre

Bis zur ausdrücklichen realen Abnahme gilt:

**Kein Merge nach `main`, kein öffentlicher V4.09-Tag, kein Release, kein Freeze-Branch und kein Golden Master.**
