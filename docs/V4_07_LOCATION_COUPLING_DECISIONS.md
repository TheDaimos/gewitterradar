# V4.07 – Standort-/Blitzdaten-Kopplung: akzeptierte Entscheidungen

Stand: 12.09.2026

## Akzeptierte Zielarchitektur

- Gewitterradar trennt fachlich **Bezugsstandort** und **aktiven Blitzdatenbereich**.
- Ein neuer Suchort darf nicht als korrekte Live-Lage dargestellt werden, solange die Blitzdatenregion geografisch nicht dazu passt.
- Bevorzugtes technisches Ziel ist ein dynamischer Gewitterradar-Standortadapter, konzeptionell `device_tracker.gewitterradar`.
- Die Blitzortung-Integration soll diesen Standortadapter als Standortquelle verwenden und Positionsänderungen nachführen.

## Abdeckungsprüfung vor Standortwechsel

Gewitterradar kennt nach einer Ortssuche die Koordinaten des Zielorts. Vor der Nutzung wird geprüft, ob der benötigte Gewitterradar-Auswertungsbereich innerhalb der aktuell aktiven Blitzortung-Abdeckung liegt.

Konzeptionell:

`Entfernung Blitzdaten-Zentrum → Zielort + benötigter Gewitterradar-Radius <= Blitzortung-Radius`

Daraus können mindestens drei Zustände entstehen:

1. vollständig abgedeckt – Zielort direkt nutzbar, keine Blitzdaten-Umschaltung nötig;
2. teilweise abgedeckt – Hinweis und Empfehlung zur Umschaltung;
3. außerhalb – klare Warnung und angebotene Umschaltung des Blitzdatenbereichs.

## Zwischenlösung bis Upstream-Reconfigure verbessert ist

- Gewitterradar stellt den dynamischen Standortadapter automatisch bereit.
- Gewitterradar erkennt, ob Blitzortung vorhanden und bereits korrekt auf diesen Adapter konfiguriert ist.
- Falls nicht, erhält der Nutzer einen klaren einmaligen Einrichtungsdialog / Hinweis.
- Dieser Schritt bleibt bewusst nutzerbestätigt und verwendet nur unterstützte Home-Assistant-/Blitzortung-Wege.
- Gewitterradar manipuliert keine fremden ConfigEntries direkt und greift nicht auf `.storage` oder private APIs zu.
- Nach der einmaligen Einrichtung erfolgen weitere geografische Standortwechsel automatisch über den Gewitterradar-Tracker.

## Upstream-To-do

Siehe `docs/V4_07_TODO_BLITZORTUNG_UPSTREAM.md`: Entwickler von `mrk-its/homeassistant-blitzortung` kontaktieren und einen offiziellen Reconfigure-Wechsel zwischen festen Koordinaten und Standort-Entity anregen.
