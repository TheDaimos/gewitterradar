# R27 – Drag-Schutz bei Blitzupdates und verfeinerte Vorschau

Stand: 2026-09-29

## Ziel

R27 behebt einen real beobachteten Vollbildfehler und verfeinert die Medaillon-/Pfeil-Vorschau weiter.

## 1. Vollbild-Drag bei Blitzereignissen

### Fehlerbild

Im Vollbild lassen sich Lokations-Pille, Kompass und Trend/Medaillon verschieben. Während eines aktiven Drags konnte ein neu eintreffendes Blitzereignis jedoch einen Layout-/Positionsabgleich auslösen. Dadurch wurde die gerade gezogene Position kurzfristig wieder aus dem gespeicherten Ausgangszustand berechnet und das Instrument sprang sichtbar zurück.

### Korrektur

Die drei Positionsfunktionen brechen jetzt ab, solange für das jeweilige Instrument ein aktiver Drag-Zustand besteht:

- `_mapCompassDragState`
- `_mapMedallionDragState`
- `_mapLocationDragState`

Betroffen sind:

- `_positionMapCompassOverlay()`
- `_positionMapMedallionOverlay()`
- `_positionMapLocationOverlay()`

Damit dürfen asynchrone Karten-/Resize-/Blitz-Synchronisierungen während eines aktiven Drags die Live-Position nicht mehr überschreiben. Erst nach Abschluss des Drags wird die neue normalisierte Position persistiert und darf anschließend wieder als Positionsquelle verwendet werden.

## 2. Vorschau-Umschalter nach unten verschoben

Der Umschalter **Starr / Animation** steht nicht mehr direkt unter **Medaillon / Pfeil**, sondern unterhalb der aktiven Chevron-Navigation.

Ziel:

- Hauptauswahl visuell entlasten,
- Navigation und Zähler zuerst lesen,
- Vorschau-Modus als sekundäre Option darstellen.

Der Umschalter wurde zusätzlich kleiner und zurückhaltender gestaltet.

## 3. Glow deutlich weißer

Der bisherige warm-goldene Effekt war vor dem messing-/goldfarbenen Medaillon kaum erkennbar.

R27 setzt deshalb auf einen deutlich weißeren Lichtaufbau:

- enger Kern nahezu weiß,
- mittlere Zone warmweiß,
- äußerer Bereich nur noch leicht cremefarben,
- deutlich weniger Gold-/Messinganteil,
- größere, weichere Ausdehnung,
- zusätzlicher weißer Drop-Shadow für räumliche Trennung vom dunklen Hintergrund.

Die Assetfarben selbst werden nicht verändert; der Effekt liegt ausschließlich hinter der Vorschau.

## Build

- Build: `V4.10.02-MODULAR-DEV-R27-2026-09-29`
- Runtime-Cache: `41002r13`
- Feature-Cache: `41002r27`
- Modulsatz: `D31A-5E97`
- `core.manifest`: 1.2.33
- `fullscreen.map-display`: 1.0.25

## Technische Abnahme

Finaler technischer Kandidat:

`64b8805a661b7f7e7212fc1017ed1ece58cfe98c`

5/5 zentrale Prüfungen erfolgreich:

- Validate shared Gewitterradar frontend
- Validate Gewitterradar integration
- Diagnostic contract
- Source archive contract
- Hi-Res asset retention

`deploy/dev` wurde exakt auf diesen Kandidaten gesetzt und als `identical` verifiziert.

## Reale Abnahme

Noch offen:

- R27 über DRA installieren.
- Frontend vollständig neu laden.
- während aktiver Blitzereignisse Lokations-Pille verschieben und auf Rücksprünge prüfen.
- dasselbe mit Kompass prüfen.
- dasselbe mit Trend/Medaillon prüfen.
- Starr/Animation unterhalb der Chevron-Navigation prüfen.
- neuen weißeren Glow auf Desktop, iPad und Android/HA Companion bewerten.
