# Gewitterradar V4.11.64 DEV – Kamerafahrt und Gesten-Wiederherstellung

**Datum:** 13.10.2026 · Ausgangspunkt V4.11.63 DEV (`1c67d06ba5caec27d7bb61997c32ce9ab82bf0ef`).

## Diagnosebefund

- Firefox unter Windows und Home Assistant unter Android 17 zeigen denselben Fehler: Eine laufende `flyToBounds`-Kamerafahrt wird unmittelbar nach `lifecycle.blur` von der erzwungenen Gesten-Wiederherstellung mittels `map.stop()` abgebrochen.
- In der erfolgreichen Android-Kontrollfahrt nach Paris fand `lifecycle.blur` **vor** dem Kameraauftrag statt; die Kamerafahrt lief danach 1.245 ms bis ans Ziel.
- Weitere Android-Ereignisse belegen zwei Kameraaufträge mit derselben `flightId`.
- Private Diagnose-Rohdateien werden nicht in das öffentliche Projekt übernommen.

## Gezielte Korrektur

1. `location.radii-map`: Saubere Fokus- und Sichtbarkeitswechsel ohne tatsächliche aktive Kartenberührung oder erkannte Gestenstörung setzen Leaflet nicht mehr zwangsweise zurück. `map.stop()` wird im Wiederherstellungspfad nur bei aktiver Kartengeste oder festhängendem Pinch/Drag aufgerufen. Ereignis `gesture.lifecycle.clean-skip` erläutert den erlaubten Durchlauf.
2. `ui.controls`: Handoff-Fahrt mit derselben `flightId` wird nicht erneut gestartet. `geo.reference.handoff.duplicate-suppressed` dokumentiert den Schutz; Mehrfachklicks auf einen gespeicherten Ort werden während der HA-Dienstaktion ignoriert.
3. Standortmenüs, klassische und moderne Menüdarstellung, Touch-Ersatzbedienung nach 3-Finger-Bildschirmfoto, Cluster und Wetterdienste bleiben unangetastet.

## Versionierung und Abnahme

**V4.11.64 DEV**, Build `V4.11.64-DEV-2026-10-13`, Runtime `41164r1`, Modulsatz `E411-64A1`, HA-Integration `0.25.0`. Module: `location.radii-map` 1.0.22, `ui.controls` 1.1.23, `core.manifest` 1.2.125.

Automatisierte Regression: `node scripts/test-v41164-camera-flight.mjs` plus bestehende CI-Prüfungen. **Android-Realabnahme steht noch aus** (gespeicherter Ort weit entfernt, genau eine vollständige Zoom-out/Flug/Zoom-in-Kamerafahrt; danach Kartengesten und 3-Finger-Bildschirmfoto).
