# Gewitterradar V4.11.47 DEV – Sanfter Höhenübergang

Datum: 2026-10-09

## Realrückmeldung
Der gleichzeitige horizontale Seitenwechsel von V4.11.46 ist positiv bewertet. Bei deutlich kürzeren Untermenüs schrumpfte jedoch der bestehende Einstellungsdialog schlagartig erst nach Ende des Seitenwechsels.

## Änderung
Der Dialog behält beim Austausch der zwei Darstellungsseiten zunächst seine Ausgangshöhe und animiert anschließend auf die natürliche Zielhöhe der tatsächlich angezeigten Unterseite. Damit entfällt die abrupte Höhenänderung. Die drei Geschwindigkeitsstufen (Schnell/Mittel/Langsam) bleiben erhalten; die Höhenanimation dauert höchstens 480 ms. Bei reduzierter Bewegung erfolgt die Anpassung ohne Animation. Das goldene Einstellungsmenü und die Android-Kartenbedienung bleiben unverändert.

## Version und Prüfung
V4.11.47 DEV · Runtime `41147r1` · Modulset `E411-47A1` · `ui.controls` 1.1.10 · Integration 0.25.0.
Quell-, Dashboard- und Integrations-Frontend für die vier geänderten Dateien Git-blob-identisch. Realtest auf Home Assistant noch offen (lange/kurze Abschnitte, Zurück, verschiedene Geschwindigkeiten und mobile Viewports). Kein CI-Ergebnis behauptet.

**C.K. – Eine Idee weiter gedacht.**
