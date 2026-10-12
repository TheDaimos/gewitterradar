# Gewitterradar V4.11.63 DEV – Kamerafahrt beim gespeicherten Standort

**Datum:** 12.10.2026 · Ausgangspunkt V4.11.62 DEV (`581f5060db50b8d27a88241720d784023ed8e063`).

**Realbefund:** Die automatische Kamerafahrt aus V4.11.62 brachte auf Android keine Verbesserung. Die Standortlisten und die Bedienung der Einstellungen unter Punkt 5 funktionieren dagegen.

**Historische Recherche:** V4.05/V3.99 aktualisierten in `_syncReferenceMap` den Standort unmittelbar; die gewünschte sanfte Kamerafahrt bei gespeicherten Orten wurde im V4.07-Bedienweg durch `v407FocusCandidate` und die bewährte `_focusReferenceStormRadius`-Methode mit `flyToBounds` gestartet. Nach V4.11.62 kam es bei gespeicherten Orten zu **zwei konkurrierenden Kamerabewegungen**: Die HA-State-Aktualisierung startete `flyTo`, danach startete der bestätigte UI-Dienst die ältere `flyToBounds`-Fahrt und ersetzte die laufende Bewegung.

**Änderung:** Die Bedienung markiert einen gesicherten, zeitlich begrenzten Übergabezustand **bevor** sie die HA-Dienstaktion aufruft. Bei einer HA-Referenzaktualisierung während dieser Phase werden Marker und Radien nachgeführt, aber keine zweite Kameraanimation gestartet. Nach der Bestätigung startet die bestehende Radius-Kamerafahrt genau einmal. Veraltete Antworten und Fehler werden abgefangen, direkte Personen-/Zonenauswahl behält `flyTo`. Zusätzliche Diagnoseereignisse: `geo.reference.handoff.prepared`, `geo.reference.handoff.deferred`, `geo.reference.handoff.flight`, `geo.reference.handoff.superseded`.

**Version:** V4.11.63 DEV, `41163r1`, `E411-63A1`; `ui.controls` 1.1.22; `location.radii-map` 1.0.21; `core.manifest` 1.2.124. Andere Module und Karten-/Touchschutz unverändert. Nach GitHub-CI Android-Realtest mit zwei weit entfernten **gespeicherten Orten**.
