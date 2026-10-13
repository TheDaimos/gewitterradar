# Gewitterradar V4.11.66 DEV – Zoomstufen 5 bis 18

**Datum:** 13.10.2026 · Grundlage: V4.11.65 DEV.

## Änderung

In **Einstellungen → 5. Effekte & Animationen → Zoomstufe nach Standortwechsel** können nun die festen Zielzoomstufen **5 bis 18** statt bisher 5 bis 15 gewählt werden. **Automatisch (Radius)** bleibt erhalten; die Vorgabe **Zoomstufe 8** sowie bereits gespeicherte Einstellungen bleiben bestehen.

In `ui.controls` wird das Menü um drei Einträge erweitert (**14 feste Zoomstufen**). In `map.clusters-recent` akzeptiert die Kartenfahrt jetzt auch 16, 17 und 18 und beachtet weiterhin `map.getMaxZoom()`. Die bestehende Android-Kamerafahrt, Standortlisten, andere Kartenfunktionen, die Touch-Bedienung und die 3-Finger-Bildschirmfoto-Wiederherstellung sind ansonsten unverändert.

## Versionsidentität

**V4.11.66 DEV** · Build `V4.11.66-DEV-2026-10-13` · Laufzeit `41166r1` · Modulsatz `E411-66A1` · HA-Integration `0.25.0`. Geändert: `ui.controls` 1.1.25, `map.clusters-recent` 1.0.8, `core.manifest` 1.2.127.

Der bestehende Kamerafahrt-Regressionsvertrag prüft zusätzlich die Zielzoomstufen 16, 17 und 18. Die geräteübergreifende Realabnahme erfolgt separat.
