# Gewitterradar V4.11.29 DEV

Stand: **2026-10-08**

## Diagnose: doppelte Kernmodul-Registrierungen behoben

Der Realtest von V4.11.28 zeigte zwei Diagnoseabweichungen:

- `core.registry`: doppelte Registrierung
- `core.runtime`: mehrfache Registrierung

Die Diagnose zeigte dabei unter anderem unterschiedliche Modul-URLs wie:

- `registry.js?v=41108r1`
- `registry.js?v=41128r1`

Der Browser behandelt dieselbe ES-Moduldatei mit unterschiedlichen Query-Strings als unterschiedliche Modulinstanzen. Dadurch konnten identische Kernmodule mehrfach ausgeführt und registriert werden.

V4.11.29 macht die Registrierung deshalb idempotent:

- gleiche Modul-ID
- gleiche Modulversion
- gleiche Moduldatei

werden als **dieselbe Registrierung** behandelt und nicht mehr als Abweichung gezählt.

Echte Konflikte bleiben weiterhin sichtbar, zum Beispiel:

- gleiche Modul-ID, aber andere Version
- gleiche Modul-ID, aber andere Datei

Zusätzlich:

- `core.registry` → **1.0.2**
- `core.runtime` → **1.0.2**
- `core.runtime` verwendet für das Register jetzt einheitlich `41129r1`
- Bootstrap lädt `core.registry` ebenfalls mit `41129r1`

## 3-Finger-Joe: offene Mehrfinger-Geste bleibt markiert

Die bisherigen Zeitfenster waren zu optimistisch. HyperOS kann die Drei-Finger-Screenshot-Geste so übernehmen, dass Gewitterradar zwar den Beginn einer Mehrfinger-Geste sieht, aber keinen sauberen Abschluss mehr erhält.

Neu ist deshalb ein dauerhafter Zustand:

- sobald mindestens zwei Touch-/Pointer-Kontakte erkannt wurden, wird die Sitzung als **offene Mehrfinger-Geste** markiert
- die Markierung wird erst durch einen sauber beobachteten Abschluss oder einen gezielten Recovery-Schritt aufgehoben
- sie läuft nicht mehr nach wenigen Sekunden automatisch aus

Damit kann auch nach einer längeren Screenshot-Animation der nächste Kontakt noch erkennen, dass Leaflet möglicherweise in einem alten Gestenzustand hängt.

## Erste korrupte Touch-Sequenz wird von Leaflet ferngehalten

Der entscheidende zusätzliche Schutz:

Wenn nach einer nicht sauber beendeten Mehrfinger-Geste ein einzelner realer Finger vom Browser weiterhin als zwei Touches geliefert wird, wird diese erste fehlerhafte Touch-Sequenz auf der Kartenfläche **nicht an Leaflet weitergegeben**.

Ablauf:

1. Mehrfinger-Geste wird als offen erkannt.
2. Neuer Kontakt löst einen Leaflet-Gestenreset aus.
3. Meldet der Browser unmittelbar danach weiterhin mehrere Touches, wird genau diese Sequenz quarantänisiert.
4. `touchstart` und `touchmove` erreichen Leaflet nicht.
5. Beim Loslassen wird erneut vollständig bereinigt.
6. Der nächste normale Kartenkontakt startet auf sauberem Gestenzustand.

Die Quarantäne greift nur nach einer erkannten unvollständigen Mehrfinger-Sitzung. Normale Zwei-Finger-Bedienung bleibt erhalten.

## Weiterhin unverändert

- kein globaler `touchmove`
- keine Änderung an Leaflet-Tile-`transform`
- kein `transformOrigin` für WeatherRouter-Raster
- Auto-Zoomkennlinie aus V4.11.27/V4.11.28
- verschiebbares Augen-Symbol
- `ui.i18n-settings 1.3.6`
- WeatherRouter-Routing und Providerwahl

## Stand

- Produkt **V4.11.29 DEV**
- Build **V4.11.29-DEV-2026-10-08**
- Runtime **41129r1**
- Modulsatz **E411-29A1**
- `core.manifest` **1.2.100**
- `core.registry` **1.0.2**
- `core.runtime` **1.0.2**
- `location.radii-map` **1.0.10**
- Integration **0.25.0**

**C.K. – Eine Idee weiter gedacht.**
