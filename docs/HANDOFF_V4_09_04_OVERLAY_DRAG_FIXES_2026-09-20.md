# Übergabe – Gewitterradar V4.09.04 Overlay-Dragging

Stand: **20.09.2026 · aktiver DEV/Testkandidat**

## Sofortiger Einstieg

1. Bootstrap **Daimos — Gewitterradar** laden.
2. Kanonisches Repository: `TheDaimos/gewitterradar`.
3. Aktiver Arbeitsbranch: `feature/v4.09.04-overlay-drag-fixes`.
4. Branch-HEAD **immer live prüfen**; nicht aus einem alten Chat oder Dokument ableiten.
5. Öffentliche Rückfallbasis bleibt **V4.08 FINAL / native Integration 0.20.0**.
6. Keine Promotion vor erneuter realer Geräteabnahme.

## Warum V4.09.04 existiert

Die reale Android-Prüfung von V4.09.03 zeigte:

- Kompass-Schalter funktionierte, der Kompass selbst ließ sich per Finger jedoch nicht zuverlässig verschieben;
- das Medaillon sollte ausschließlich als reine Trendanzeige eingeblendet werden, war aber durch die gemeinsame `.trend`-Layoutklasse mit den History-/Tendenzregeln gekoppelt;
- die Layer-Schaltfläche sollte deutlich tiefer und knapp oberhalb der Leaflet/OpenStreetMap-Attribution sitzen;
- Kompass und Medaillon müssen ausdrücklich **auf allen Zielsystemen** frei verschiebbar sein, einschließlich iPad/iPad Pro.

## V4.09.04-Umfang

### Kompass

- frei verschiebbar auf Desktop, Android und iPad/iPad Pro;
- ein gemeinsamer Pointer-Event-Pfad;
- äußerer Kartenoverlay-Container ist die aktive Drag-Hitfläche;
- eingebettete Kompassknoten nehmen im Overlay keine Pointer-Hits an;
- bestehende lokale Position und Sichtbarkeit bleiben erhalten.

### Medaillon

- ausschließlich das Medaillon als reine Trendanzeige;
- keine History-/Verlaufseinheit;
- keine Beschriftung oder Trendtexte im Kartenoverlay;
- Basisgrafik + Pfeil;
- Zustände `none / up / stable / down`;
- frei verschiebbar auf Desktop, Android und iPad/iPad Pro;
- eigene lokale Position und Sichtbarkeit.

### Layer-Schaltfläche

- bleibt unten rechts;
- sitzt weiter unten, mit kleinem Sicherheitsabstand knapp oberhalb von Leaflet/OpenStreetMap;
- unterer Abstand wird aus der realen Leaflet-Attributionshöhe berechnet;
- bleibt dauerhaft oberste Karten-Bedienebene.

## Lokale Schlüssel

- `gewitterradar:v409:startup-map-display`;
- `gewitterradar:v409:last-map-display-mode`;
- `gewitterradar:v409:map-display-mode`;
- `gewitterradar:v409:map-compass-position`;
- `gewitterradar:v409:map-compass-visible`;
- `gewitterradar:v409:map-medallion-position`;
- `gewitterradar:v409:map-medallion-visible`.

Keine zusätzlichen Home-Assistant-Helfer.

## Kanonische Frontend-Dateien

Quelle:

- `frontend/gewitterradar.js`.

Bytegleiche Ausleitungen:

- `custom_components/gewitterradar/frontend/gewitterradar.js`;
- `dashboard/dist/gewitterradar.js`.

## Tests

Relevant:

- `scripts/verify-v409-map-display.mjs`;
- `scripts/test-v409-map-display.cjs`;
- Shared-Frontend-/Integration-/About-/Diagnose-/Hi-Res-Gates.

Die V4.09-Browsermatrix umfasst Desktop, iPad und Android jeweils für Dashboard und native Integration.

## Dokumentation

Aktiver V4.09.04-Satz:

- `CHANGELOG.md`;
- `docs/HISTORY.md`;
- `docs/ROADMAP.md`;
- `docs/MILESTONES.md`;
- `docs/V4_09_04_OVERLAY_DRAG_FIXES.md`;
- `docs/RELEASE_NOTES_V4_09_04_TEST.md`;
- dieses Handoff;
- bilinguale Release History im Frontend.

V4.09.03 bleibt als historischer/superseded Zwischenstand erhalten.

## Nicht nebenbei verändern

- V4.08 FINAL;
- Clusteralgorithmen/-profile;
- Radien/Aura;
- Ortssuche/gespeicherte Orte;
- About/Widmung;
- Hilfe;
- Diagnosevertrag;
- Hi-Res-/Masterbestand;
- Helper-IDs;
- Kompass-/Medaillon-Grunddesigns.

## Reale Abnahme – nächster Schritt

1. Android Vollbild öffnen.
2. Kompass per Finger an mehreren Stellen greifen, verschieben, loslassen und erneut verschieben.
3. Kompass aus-/einblenden und gespeicherte Position kontrollieren.
4. Medaillon einblenden: sichtbar sein darf ausschließlich das reine Medaillon.
5. Medaillon per Finger verschieben, aus-/einblenden und Position kontrollieren.
6. Layer-Schaltfläche auf Abstand zur Leaflet/OpenStreetMap-Attribution prüfen.
7. Standort oben rechts und Layer-Menü bedienen.
8. iPad/iPad Pro mit denselben Drag-Prüfungen wiederholen.
9. Desktop mit Maus wiederholen.
10. separates Kartenfenster sowie Rückkehr zu Standard/Groß prüfen.
11. Simulation AUS: keine Testschaltflächen; Simulation EIN: Testschaltflächen vorhanden.

Erst nach ausdrücklicher realer Abnahme: Promotion/PR-Finalisierung, PRE-MERGE-Snapshot, Merge, vollständige Post-Merge-Gates, Golden Master, Tag/Release gemäß kanonischem Releaseprozess.
