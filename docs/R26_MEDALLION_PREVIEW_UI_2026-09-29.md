# R26 – Vorschau-Modus, kompakte Auswahl und veredelte Medaillon-Darstellung

Stand: 2026-09-29

## Ziel

Die Medaillon-/Pfeil-Auswahl soll auch ohne aktuellen Gewittertrend vollständig einstellbar bleiben und dabei kompakter sowie hochwertiger wirken.

## Änderungen

### Kompakte Zähler

Da der Umschalter **Medaillon / Pfeil** den Kontext bereits vorgibt, zeigen die Navigationszeilen nur noch den Index:

- `6 / 28`
- `1 / 18`

Die Zähler sind einzeilig und besitzen eine schmalere Mittelspalte. Dadurch entfällt der bisherige Zeilenumbruch.

### Vorschau unabhängig vom Live-Trend

Das Auswahl-Pop-up besitzt nun einen eigenen Vorschau-Modus:

- **Starr**
- **Animation**

Standard ist **Starr**.

Außerhalb des Diagnosemodus ist der Pfeil im Auswahl-Pop-up immer sichtbar, auch wenn aktuell kein Gewittertrend vorliegt. Die Vorschau verwendet weiterhin die produktive paarweise Kalibrierung für Größe und X/Y-Mittelpunkt.

Der Modus wird unter
`gewitterradar:v41002:medallion-picker-preview-mode`
lokal gespeichert.

Die Animation verwendet die vorhandene Diagnose-Sweep-Bewegung, verändert aber nicht den Live-Zustand der Karte.

### Optische Veredelung

Hinter der Medaillon-/Pfeil-Vorschau liegt nun ein dezenter warmweiß-goldener Halo. Der Effekt ist bewusst weich gehalten:

- warmweißes Zentrum,
- leichter Goldanteil,
- dezente Tiefenwirkung,
- keine harte zusätzliche Innenrahmung.

Die bestehende Produktkalibrierung wird dadurch nicht verändert.

### Vollbild-Größe

Die doppelte Prozentanzeige rechts neben der eigenen Eingabe wurde entfernt.

Weiterhin vorhanden sind:

- 50 / 75 / 100 / 125 / 150 % Schnellwahl,
- Schieberegler 15–300 %,
- direkte Eingabe 15–300 %.

## Build

- Build: `V4.10.02-MODULAR-DEV-R26-2026-09-29`
- Runtime-Cache: `41002r13`
- Feature-Cache: `41002r26`
- Modulsatz: `D31A-5E96`
- `core.manifest`: 1.2.32
- `fullscreen.map-display`: 1.0.24

## Technische Abnahme

Technischer Kandidat:

`efabc9cbff47b29e0f173e557ad9d1338bc51a5d`

5/5 zentrale Prüfungen erfolgreich:

- Validate shared Gewitterradar frontend
- Validate Gewitterradar integration
- Diagnostic contract
- Source archive contract
- Hi-Res asset retention

`deploy/dev` wurde exakt auf diesen Kandidaten gesetzt und anschließend als `identical` verifiziert.

## Reale Abnahme

Offen:

- R26 über DRA installieren.
- Frontend vollständig neu laden.
- Zähler auf `xx / xx` ohne Zeilenumbruch prüfen.
- Vorschau **Starr** ohne aktiven Gewittertrend prüfen.
- Vorschau **Animation** prüfen.
- produktive Pfeilgröße und X/Y-Lage in der Vorschau gegen die normale Tendenzanzeige vergleichen.
- Halo auf Desktop, iPad und Android/HA Companion prüfen.
- Vollbild-Größensteuerung ohne doppelte Prozentanzeige prüfen.
