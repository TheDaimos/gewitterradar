# Gewitterradar V4.11.48 DEV – Sanft auslaufender Höhenwechsel

Datum: 2026-10-09

## Realrückmeldung
Die Höhenanpassung in V4.11.47 funktioniert bereits, soll jedoch weicher auslaufen: schneller Beginn, deutlich langsamer werdender Mittelteil und besonders sanftes Ende.

## Umsetzung
Gezielte Änderung der Höhenanimation im experimentellen blauen Einstellungsmenü. Die Kurve nutzt jetzt `cubic-bezier(.12,.88,.18,1)` und eine längere Dauer zwischen 560 und 900 Millisekunden je nach eingestellter Seitenwechselgeschwindigkeit. Schneller Beginn und ausgeprägte Abbremsung; die vorherige horizontale Animation sowie die Schnell/Mittel/Langsam-Auswahl bleiben unverändert. `prefers-reduced-motion` beendet die Höhenänderung weiterhin unmittelbar ohne Bewegung.

V4.11.48 DEV · Runtime `41148r1` · Modulsatz `E411-48A1` · `ui.controls` 1.1.11 · Integration 0.25.0. Die vier geänderten Frontend-Dateien sind in Quelle, Dashboard und HA-Integration anhand Git-Blobs identisch.

## Realtest ausstehend
Besonders lange → kurze und kurze → lange Unterseiten sowie Zurück bei allen drei Geschwindigkeitsstufen prüfen. Kein Eingriff in goldenes Zahnrad, Hilfe, Android-Gesten oder WeatherRouter.

**C.K. – Eine Idee weiter gedacht.**
