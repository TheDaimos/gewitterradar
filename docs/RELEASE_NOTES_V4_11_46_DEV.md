# Gewitterradar V4.11.46 DEV – Sichtbarer horizontaler Seitenwechsel

Datum: 2026-10-09

## Umsetzung
Die blaue experimentelle Einstellungsnavigation erhält eine gleichzeitige horizontale Gleitbewegung von zwei Seiten über die vollständige Dialogbreite (alte Seite nach links, neue von rechts; Zurück gegenläufig). Statt bisheriger 28-Pixel-Einblendung wird die sichtbare Navigation während des Übergangs in zwei kurzlebigen Darstellungskopien animiert, danach bleibt ausschließlich die bestehende echte Einstellungsoberfläche aktiv. Keine doppelten produktiven HA-Bedienelemente oder Bindungen.

Oben in der Hauptübersicht des blauen Zahnrads steht die Geschwindigkeitseinstellung **Schnell** (220 ms), **Mittel** (440 ms, Standard), **Langsam** (760 ms). Die Auswahl bleibt über `localStorage` im jeweiligen Browser gespeichert. `prefers-reduced-motion` respektiert eine reduzierte Bewegungsdarstellung. Der goldene Akkordeon-Zugang bleibt unverändert.

Version V4.11.46 DEV; Runtime `41146r1`; Modulsatz `E411-46A1`; `ui.controls` 1.1.9; Integration 0.25.0. Frontend in Quelle, Dashboard und nativer Integration identisch gespiegelt.

## Offene Abnahme
Installation über DRA und Realtest auf Android/Desktop erforderlich: drei Geschwindigkeiten, Vorwärts-/Rückwärtsbewegung, Bedienbarkeit echter Regler nach Animation, schneller Doppelklick, Reduced-Motion-Modus, Dialog schließen/neu öffnen und bestehendes goldenes Zahnrad. Die Android-Kartensteuerung, der Hilfe-/About-Stand und WeatherRouter wurden nicht verändert.

**C.K. – Eine Idee weiter gedacht.**
