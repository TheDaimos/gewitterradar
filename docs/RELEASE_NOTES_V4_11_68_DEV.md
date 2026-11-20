# Gewitterradar V4.11.68 DEV – Schutz der Kartenradien bei hohen Zoomstufen

**Datum:** 13.10.2026 · Grundlage: V4.11.67 DEV.

## Realer Befund
Beim Wechsel zu Washington mit Zoomstufe 17 wird Gewitterradar auf dem iPad mehrfach extrem langsam, verliert die Darstellung und die Companion-App zeigt anschließend eine getrennte Verbindung. Auf dem Desktop wird insbesondere Vollbild träge, die Kompassanimation läuft zeitweise in Zeitlupe. Android erreicht Zoom 17/18 und erholt sich, übernimmt jedoch gelegentlich die neu eingestellte Zielzoomstufe beim ersten Wechsel noch nicht. Auf dem iPad dauerte das Öffnen eines Einstellungsunterpunkts ca. 16,5 Sekunden.

Das beweist noch keinen HA-Serverneustart, WebKit-Prozessabbruch oder Speichermangel; die Fotos und die Schilderungen allein reichen dafür nicht.

## Nachweisbarer technischer Risikopfad
Die geodätisch korrekten Beobachtungs- und Gefahrenradien (z. B. 1.000/600/30 km) werden in der Darstellung bislang als pixelgenaue Kreise projiziert. Bei hohen Karten-Zoomstufen werden daraus geometrische Radien mit über einer Million Pixeln. Leaflet-Canvas und die SVG-Radius-Aura können diese Geometrien auf UI- und Grafikprozessorseite aufwendig verarbeiten. Der SVG-Zeichenweg reagiert zusätzlich auf Zoom-/Verschiebeereignisse, auch unabhängig vom allgemeinen Neuaufbau der Karte.

## Korrektur
- **Normale Kartenkreise:** Bei stark übergroßen Pixelprojektionen wird kein millionenpixelgroßer Kreis mehr an die Zeichenschnittstelle übergeben. Ein maximaler Darstellungsradius von 2.048 bis 8.192 Pixeln (abhängig von der Fenstergröße) wird als Schutzschwelle verwendet; darüber wird der Kreisrand nur grafisch ausgelassen. Bei kleineren Zoomstufen wird er wieder gezeichnet.
- **SVG-Aura:** Der unabhängige Zeichenweg hat dieselbe Schutzschwelle. Wenn das komplette Bild innerhalb des Gefahrenradius liegt, bleibt der feine rote Innenschleier als kleines, auf das Fenster begrenztes SVG-Rechteck erhalten. Wiederholte Neuzeichnungen entfernen vorherige Rechtecke.
- Keine Änderung an Kilometerradien, Entfernungs-/Gefahrenberechnungen, Standort-Kamerafahrt, gespeicherten Orten, Zoom-Auswahl 5–18, klassischer/moderner Menüführung oder 3-Finger-Gestenschutz.
- Das **Android-Erstflugproblem** wird zunächst getrennt diagnostiziert; eine zusätzliche automatische Kamerafahrt könnte bestehende Bewegungsabläufe erneut beschädigen und wird deshalb nicht voreilig eingebaut.

## Versionsidentität
**V4.11.68 DEV**, Build `V4.11.68-DEV-2026-10-13`, Runtime `41168r1`, Modulsatz `E411-68A1`, Integration `0.25.0`. Geändert: `core.base-context` 1.0.8, `location.radii-map` 1.0.23, `core.manifest` 1.2.129.

Gezielte Regression: `node scripts/test-v41168-radius-render-guard.mjs` plus bestehende vollständige Prüfungen. **Die Geräte-Realabnahme steht aus.** Bis dahin keine erneuten Absturztests auf iPad mit Zoom 17/18.
