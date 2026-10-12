# Gewitterradar V4.11.58 DEV – Ende der Android-Menüanimation
**Datum:** 2026-10-12

## Beobachtung und Ursache
Auf Android verbleibt nach V4.11.57 genau ein sichtbares Flackern am Ende jedes horizontalen Menüwechsels. Die Abschlussfunktion entfernte bisher vollständig synchron beide animierten Menükopien, WAAPI-Schichten und den Sichtbarkeitsschutz der echten Menüs. Das ist eine plausible Quelle für den einzelnen Bildsprung.

## Eng begrenzte Korrektur
Nach dem Abschluss der horizontalen Bewegung wird zunächst das echte Zielmenü hinter der noch deckenden Menükopie sichtbar. Nach zwei Browser-Zeichenzyklen blendet die Kopie in 110 ms aus. Erst dann werden Kopie und temporäre Darstellungsebenen entfernt. Ein Sicherheitszeitgeber schützt gegen hängenbleibende Übergänge bei inaktiven Browserfenstern und beim Schließen.

Geschwindigkeiten der eigentlichen Bewegung: Schnell 220 ms, Mittel 440 ms, Langsam 760 ms. Die stabilisierte Originalsignatur, Größenbewegung auf Compositor-Ebene und Übernahme der Geschwindigkeitsanzeige bleiben erhalten. Nur `ui.controls` 1.1.18 verändert das Laufzeitverhalten, `core.manifest` 1.2.119, `41158r1`, `E411-58A1`. `ui.skeleton` 1.1.22, `map.clusters-recent` 1.0.6, WeatherRouter, Kartenmarker und Touch-Gesten unverändert.

Die Browserprüfungen verlangen jetzt die verzögerte Übernahme der echten Menüseiten. **GitHub-Erfolg ist keine Android-Realabnahme.**
