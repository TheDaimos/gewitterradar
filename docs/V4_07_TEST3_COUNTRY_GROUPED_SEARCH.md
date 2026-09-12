# Gewitterradar V4.07 TEST3 – Ländergruppierte Ortssuche

Status: Testkandidat, 12.09.2026.

## Ziel

Weltweite Suchergebnisse dürfen durch die automatisch erkannte Heimatland-Präferenz nicht zugeschüttet oder falsch priorisiert werden. Häufige Ortsnamen werden daher nach Ländern gruppiert und direkt filterbar gemacht.

## Verhalten

- Treffer werden nach ISO-Ländercode gruppiert.
- Oberhalb der Treffer erscheint eine horizontal scrollbar nutzbare Länderleiste: `Alle Länder`, danach die tatsächlich vorkommenden Länder mit Flagge und Trefferzahl.
- Ländergruppen sind auf-/zuklappbar; die bestbewertete Gruppe ist zunächst geöffnet.
- Ein Klick auf einen Länderfilter reduziert die Ansicht sprunghaft auf dieses Land; erneuter Klick bzw. `Alle Länder` hebt den Filter auf.
- Pro Ländergruppe werden zunächst wenige Treffer gezeigt. `Weitere N Treffer anzeigen` erweitert nur diese Gruppe.
- Das automatisch aus Home Assistant bzw. Browser erkannte Heimatland bleibt sichtbar markiert, ist aber nur eine weiche Rangpräferenz.
- Eine explizite Eingabe im Feld `Land` bleibt ein harter Filter und dominiert die Rangfolge.
- Der Nominatim-Rückfall darf die weltweite Suchanfrage nicht mehr durch automatisches Anhängen des Heimatlandes verengen.

## Rangfolge

Die Rangbewertung priorisiert:

1. expliziten Länderfilter,
2. exakte PLZ,
3. exakten Ortsnamen,
4. exakten/nahen Beginn der vollständigen Ortsbezeichnung,
5. Bedeutung/Größe des Ortes,
6. erst danach die automatisch erkannte Heimatland-Präferenz.

Regressionsfall `Tokio`: Ohne explizites Land muss ein bedeutender exakter Treffer `Tokio, Japan` einen kleinen gleichnamigen Treffer in Deutschland überholen können. Mit explizitem Land `Deutschland` muss dagegen der deutsche Treffer dominieren.

## Unveränderte Funktionen

- `Nutzen` setzt weiterhin den Referenztracker, schließt das Suchfenster und fokussiert die Karte.
- `★ Speichern` speichert weiterhin in der lokalen Gewitterradar-To-do-Ortsliste.
- Open-Meteo bleibt Primärdienst; Nominatim bleibt Rückfall.
- Länder-Autovervollständigung bleibt vollständig lokal und erzeugt beim Tippen keine Provider-Anfragen.
