# Gewitterradar V4.11.54 DEV – roter Gefahrenbereich ohne Einzelblitz-Flackern

**2026-10-10 · Vorbereitet im Prüfzweig · Home-Assistant-Realabnahme noch offen.**

## Nachweis und Ursache

Das Android-Realvideo `72143.mp4` zeigt bei Pellaro/Italien auf Zoom 7, dass die rot gestrichelte Gefahrenradiuslinie stehen bleibt, aber die dicht beieinanderliegenden **roten Einzelsymbole** innerhalb von 30 km abwechselnd erscheinen und verschwinden. Die nummerierten Cluster und die übrigen Radien bleiben nach V4.11.53 stabil.

Ursache im vorherigen Code: Der gruppierte Kartenmodus stellt Blitze im Gefahrenradius unabhängig vom Vergrößerungsgrad als einzelne Leaflet-Markierungen dar. `_renderMapMarkers()` entfernte bisher mit `this._markerLayer.clearLayers()` sämtliche Einzelmarker bei jeder Aktualisierung. V4.11.53 stabilisierte zwar die nummerierten Cluster, nicht jedoch diese zweite Ebene.

## Eng begrenzte Korrektur

- Einzelne Blitzmarkierungen erhalten eine beständige Identität über ihre vorhandene `strike.id` aus Home Assistant.
- Vorhandene DOM-Knoten bleiben bei unveränderten Treffern bestehen; Positions- und Statusänderungen werden direkt am einzelnen Marker aktualisiert.
- Nur tatsächlich verschwundene oder nicht mehr einzeln dargestellte Blitze werden entfernt.
- Im Modus `Einzelblitze` bleibt die bisherige Darstellung über die Leinwandebene erhalten; beim Wechsel werden nicht länger benötigte Einzelmarker gezielt entfernt.
- V4.11.53-Clusterstabilisierung bleibt unverändert bestehen.

**Unverändert:** Radien und ihre SVG-Aura, Wetter-/Niederschlagsdaten, Gestensteuerung, Vollbildmechanik, Profile und Fachlogik.

## Prüfungen und Freigabe

- Neuer Javascript-Wiederholungstest `scripts/test-v41154-individual-markers.mjs`: 60 unveränderte HA-Aktualisierungen, Statuswechsel, Standortänderung, selektives Entfernen und Kartenwechsel.
- Bisheriger V4.11.53-Cluster-Test bleibt verpflichtend.
- Drei Kopien des Frontends synchronisiert; Build `V4.11.54 DEV`, Revision `41154r1`, Modulsatz `E411-54A1`, `map.clusters-recent` 1.0.6.
- Erst nach erfolgreicher GitHub-Prüfung nach `deploy/dev` vorsehen und dort über DRA V1 real testen.

**Keine Behauptung einer bereits erfolgten HA-Abnahme:** Sichtprüfung bei unveränderter Kartenposition und aktiven Gefahren-Blitzen in kleiner Karte und Vollbild muss noch durchgeführt werden.
