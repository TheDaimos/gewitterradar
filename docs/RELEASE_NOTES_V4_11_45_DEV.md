# Gewitterradar V4.11.45 DEV – Experimentelle horizontale Einstellungsnavigation

Datum: 2026-10-09

## Nutzerauftrag
Das bestehende goldene Zahnrad und dessen Akkordeon-Einstellungen unverändert erhalten. Ein **zweites blaues Zahnrad** in der Hauptansicht soll testweise dieselben Einstellungen im identischen Dialogdesign mit horizontaler Haupt-/Unterseiten-Navigation öffnen. Hilfe & Hinweise wird vorerst nicht umgestellt.

## Umsetzung
- Eigenständiger Zugang `settings-open-horizontal` neben `settings-open`, gleiche Zahnradsymbolik in Blau.
- Wiederverwendung **derselben bestehenden Einstellungs-DOM-Elemente und Ereignisbindungen**; keine duplizierten Regler, Home-Assistant-Entitäten, IDs oder Speichermechanismen.
- Hauptseite mit automatisch aus den vorhandenen Einstellungsabschnitten ermittelten Oberpunkten. Beim Öffnen eines Punktes wird dessen bestehender Inhalt sichtbar und mit 250-ms-Einblendung von rechts versehen; Zurückblendung gegenläufig nach links.
- Goldener Zugang entfernt den experimentellen Navigationsmodus wieder und zeigt weiterhin das bisherige Akkordeon.
- Bestehende Hilfe-/About-Schaltflächen bleiben im Wurzelmenü; Hilfefenster selbst unverändert.
- Kein Eingriff in Android-Gesten, WeatherRouter-Routing, Hi-Res-Master oder V4.10 FINAL.

## Stand
V4.11.45 DEV, `41145r1`, `E411-45A1`; `ui.controls` 1.1.8; `ui.skeleton` 1.1.20; Integration 0.25.0.
Alle fünf geänderten Dateien sind in `frontend/`, `dashboard/dist/` und `custom_components/gewitterradar/frontend/` nach Git-Blob identisch.

## Offene Abnahme
Noch **kein** Home-Assistant-Realtest. Über DRA installieren, Frontend neu laden, beide Zahnräder getrennt testen. Insbesondere alle Hauptkategorien, bestehende Bedienelemente, Sprachwechsel, Zurück, Schließen, kleine/mobile Anzeige und goldenen Rückfallweg kontrollieren. Animationsfeinschliff und mögliche verschachtelte Unterseiten nach Realfeedback.

**C.K. – Eine Idee weiter gedacht.**
