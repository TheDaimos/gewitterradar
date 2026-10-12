# Gewitterradar V4.11.59 DEV – Menüdarstellung Klassisch / Modern

**12. Oktober 2026 · Basis:** V4.11.58 DEV (`f487653f47959eb88ecd96bb4a92fafe6040f867`).

## Umsetzung
Einstellung **Menüdarstellung** mit **Klassisch** (aufklappbare Baumstruktur, goldenes Zahnrad) und **Modern** (horizontale Animation, blaues Zahnrad). Die ursprünglich zwei sichtbaren Zahnräder werden zu **einer sichtbaren Schaltfläche** zusammengeführt. Das zusätzliche blaue Zahnrad bleibt unsichtbar als interner Kompatibilitäts-Einstieg.

Die Auswahl steht in der klassischen Menüansicht am Anfang und in der modernen Kategorienübersicht direkt nach der Geschwindigkeitseinstellung. Beim Wechsel wird *dieselbe Auswahlzeile* versetzt, alle bestehenden Steuerfelder und Home-Assistant-Bindungen bleiben erhalten. Die Auswahl wird als `localStorage`-Wert `gr-settings-menu-style` (`classic`/`modern`) persistent gespeichert; ohne vorhandenen Wert bleibt Klassisch die Ausgangswahl. Das gewählte Symbol wird beim Laden sofort passend gefärbt und das einzelne Zahnrad öffnet direkt die gewählte Menüart. Kein Neustart erforderlich.

## Regressionsschutz
Die animierte Navigation aus V4.11.58 (drei Geschwindigkeiten, Größenänderung, Signatur und 110-ms-Überblendung am Ende) bleibt unverändert. Geändertes Laufzeitmodul: ausschließlich `ui.controls` auf 1.1.19, `core.manifest` auf 1.2.120. Release **V4.11.59 DEV**, `41159r1`, `E411-59A1`; Integration 0.25.0 unverändert. Drei Frontend-Auslieferungen, Prüfsummen, Identität und DRA-Metadaten synchronisiert.

Zusätzliche Browserregression für beide Menüstile, einmaliges Zahnrad, goldene/blaue Auswahl, Speicherung und erneutes Öffnen. WeatherRouter, Karten-/Blitzmarker, Kartengesten und `ui.skeleton` bleiben unangetastet. Grüne CI ist noch keine Android-Realabnahme.
