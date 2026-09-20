# Gewitterradar V4.09.01 – Kartenansicht

Stand: **2026-09-20**  
Status: **DEV / Testkandidat**  
Basis: **V4.08 FINAL**  
Branch: `feature/v4.09-map-view-modes`

## Freigegebener Umfang

V4.09.01 ergänzt die bestehende Gewitterradar-Karte ausschließlich um die neue Darstellungssteuerung:

- **Standard** – exakt die bisherige Kartengeometrie;
- **Groß** – deutlich höhere Karte innerhalb der normalen Gewitterradar-Ansicht;
- **Vollbild** – viewportfüllende Karte innerhalb der Home-Assistant-Seite;
- **In eigenem Fenster öffnen** – bewusst nur als eigener Punkt in den Einstellungen.

Im Vollbild wird der **aktuell gewählte produktive Kompass** verwendet. Es wird kein zweiter Kompasszustand und kein separates Kompassdesign erzeugt.

## Verschiebbarer Kompass

Der Vollbild-Kompass:

- wird aus dem bestehenden Kompassbereich in das Karten-Overlay umgesetzt und beim Verlassen wieder an seine ursprüngliche DOM-Position zurückgeführt;
- bleibt dadurch an dieselben Daten-, Animations- und Designzustände gekoppelt;
- wird über Pointer Events bedient und unterstützt damit Maus, Touch und iPad;
- kann nur über den eigenen Griff verschoben werden, damit Karten-Panning nicht mit Kompass-Panning kollidiert;
- speichert seine normalisierte X/Y-Position lokal unter `gewitterradar:v409:fullscreen-compass-position`;
- wird bei Größen-/Orientierungsänderungen wieder in den sichtbaren Kartenbereich geklemmt.

## Eigenes Fenster

Der Einstellungsbefehl öffnet die aktuelle Gewitterradar-Ansicht mit dem Parameter
`gewitterradar_window=map` in einem benannten Browserfenster.

Der dort geladene Gewitterradar-Frontendstand wechselt automatisch in den Vollbildmodus.

Falls Browser oder Home-Assistant-Umgebung das neue Fenster blockieren, fällt die Funktion auf den integrierten Vollbildmodus zurück.

## Architektur

Die Funktion liegt ausschließlich in der kanonischen gemeinsamen Quelle:

`frontend/gewitterradar.js`

Die beiden Auslieferungen bleiben bytegleich:

- `custom_components/gewitterradar/frontend/gewitterradar.js`
- `dashboard/dist/gewitterradar.js`

Es wurden keine neuen Home-Assistant-Helfer eingeführt.

## Schutz / Regression

Zusätzlich zu den bestehenden Verträgen gilt:

- `tests/contracts/frontend-candidate-v4.09.01.json`
- `scripts/verify-v409-map-view-modes.mjs`
- `scripts/test-v409-map-view-modes.cjs`

Der Browser-Regressionslauf prüft beide Auslieferungsformen auf Desktop, iPad und Android einschließlich Größenwechsel, Vollbild, Pointer-/Touch-Verschiebung des produktiven Kompasses, Positionsspeicherung, separates Fenster und Popup-Blocker-Rückfall.

Der erste iPad-Lauf zeigte, dass `72dvh` im Querformat minimal kleiner als die vorhandene Standardkarte war. Der Großmodus wurde deshalb auf `clamp(600px, 78dvh, 900px)` korrigiert; der Test verlangt weiterhin, dass „Groß“ tatsächlich größer als „Standard“ ist.

Der Kandidatenvertrag ist weiterhin ausdrücklich an den unveränderten V4.08-Releasevertrag gebunden.

## Abnahme auf realen Geräten

Vor einer öffentlichen V4.09-Veröffentlichung mindestens prüfen:

1. Desktop: Standard → Groß → Vollbild → Standard;
2. iPad Hochformat und Querformat;
3. Android/iPhone Hoch- und Querformat;
4. Kompass im Vollbild per Touch/Maus verschieben;
5. Position nach erneutem Vollbildaufruf;
6. Karten-Panning/Zoom bei eingeblendetem Kompass;
7. Wechsel des Kompassdesigns und Live-Aktualisierung;
8. separates Fenster in normalem Browser;
9. Rückfall auf Vollbild bei blockiertem Popup;
10. Rückkehr aus Vollbild ohne Layout-/Leaflet-Versatz.

V4.09.01 ist bis zur realen Geräteabnahme ein **Testkandidat**, kein öffentlicher Release.
