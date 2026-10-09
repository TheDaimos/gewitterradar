# Gewitterradar V4.11.53 DEV – stabile Clusterblasen

Datum: 2026-10-10

## Fehlerbild und Analyse

In blitzreichen Regionen flackerten alle sichtbaren Clusterblasen gleichzeitig und sehr häufig. Bei jedem allgemeinen Home-Assistant-Kartenrender löschte `_renderMapMarkers()` die komplette Leaflet-`_markerLayer` und erzeugte sämtliche `L.divIcon`-Cluster-Marker erneut. Da die Cluster selbst keine Blinkanimation besitzen, entstand der beobachtete globale Sichtbarkeitswechsel durch das Entfernen und Wiederanlegen ihrer DOM-Elemente.

## Korrektur

- Stabile Cluster-IDs aus `_stabilizeRenderedClusterIdentities()` dienen jetzt als Schlüssel für eine eigene Leaflet-Cluster-Ebene.
- Die bestehenden Marker und ihre DOM-Knoten werden bei gleichem Cluster **wiederverwendet**. Änderungen an Anzahl, Typ, Farbe und Blasengröße aktualisieren vorhandene DOM-Eigenschaften.
- Subpixelverschiebungen unter 0,75 Kartenpixel werden ignoriert. Größere tatsächliche Schwerpunktänderungen aktualisieren nur die Position des betroffenen Markers.
- Neue Cluster erhalten neue Marker; verschwundene Cluster werden einzeln entfernt.
- Ein Wechsel in die Einzelblitzansicht räumt die Cluster-Ebene auf. Eine neue Karte setzt die veraltete Ebenenbindung zurück.
- Die individuelle Blitzebene und deren etablierte Darstellung bleiben unverändert; ebenso Geometrie, Touch-Gesten, Kartenbedienung, WeatherRouter und DRA.

## Prüfungen

Synthetischer Regressionstest `scripts/test-v41153-cluster-markers.mjs`: 30 identische Aktualisierungen ohne Neuerzeugung, gezielte Anzahl-/Größenänderung im vorhandenen DOM, einzelne Entfernung, Neuaufnahme, Kartenwechsel. Weitere Prüfungen: Frontend-Auslieferung, Modulversionen, Prüfsummen, Home-Assistant-Integration und geschützter historischer Geometrievergleich.

Diese statischen und synthetischen Prüfungen ersetzen keine Realabnahme. Besonders auf Android und bei tatsächlicher hoher Blitzrate sind Clusteransicht und Einzelblitzansicht nacheinander zu testen. Keine echten Diagnoseexporte im öffentlichen Quellrepository speichern. Für HA-Exporte ausschließlich das private `TheDaimos/Project-Log-And-Export` verwenden.

## Identität

- V4.11.53 DEV / `41153r1` / `E411-53A1`
- `map.clusters-recent` 1.0.5
- `core.manifest` 1.2.114
- Native Integration unverändert 0.25.0
