# Gewitterradar V4.11.65 DEV – Zielzoom nach Standortwechsel

**Datum:** 13.10.2026 · Basis **V4.11.64 DEV** (Android-Kamerafahrt vom Anwender erfolgreich realabgenommen).

## Änderung

Unter **5. Effekte & Animationen** befindet sich ein neues Auswahlmenü **Zoomstufe nach Standortwechsel**, optisch identisch zu Menüdarstellung und Menügeschwindigkeit. Wahlmöglichkeiten: **Automatisch (Radius)** oder **Zoomstufe 5 bis 15**. Standard ist **Zoomstufe 8** statt der zuvor häufig erreichten Zoomstufe 5. Die Wahl wird nur in diesem Browserprofil lokal gespeichert.

Die automatische Kartenfahrt bei der Auswahl gespeicherter Orte nutzt bei einer festen Stufe Leaflets `flyTo` mit geografischem Ziel und gewähltem Endzoom. Die Einstellung **Automatisch (Radius)** behält den vorhandenen `flyToBounds`-Weg zur vollständigen Gewitterradius-Einpassung bei. Bei hoher fester Zoomstufe kann der Gewitterradius außerhalb des sichtbaren Ausschnitts liegen; Marker- und Radiendaten bleiben korrekt. Die Einstellung betrifft ausschließlich die automatische Standortzentrierung, nicht die manuelle Kartenbedienung, die Clusteransicht oder Wetterebenen.

Der in V4.11.64 reparierte Gestenschutz bleibt unverändert. Keine Änderungen an Standortlisten, klassischen/modernen Einstellungsübergängen, Touch-Ersatzbedienung oder WeatherRouter.

## Versionsidentität und Realtest

- **V4.11.65 DEV**, Build `V4.11.65-DEV-2026-10-13`, Runtime `41165r1`, Modulsatz `E411-65A1`, HA-Integration `0.25.0`.
- Module: `ui.controls` **1.1.24**, `map.clusters-recent` **1.0.7**, `core.manifest` **1.2.126**.
- Android-Realtest: Auswahl Zoomstufe 8 → entfernter gespeicherter Ort → genau eine durchgehende Kamerafahrt mit Zielzoom 8; danach Automatisch → erneut Ortswechsel → bisherige radiusabhängige Zielzoomstufe; manuelles Zoomen unverändert.

**Android-Realabnahme für die neue Einstellung steht aus.**
