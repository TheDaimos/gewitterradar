# V4.11.62 DEV – Kamerafahrt bei Standortwechsel wiederhergestellt

**12.10.2026 · Basis:** V4.11.61 DEV, `1439fd58e5d9c27d7f013c382c3b03989aad5bdd`.

Android-Video: Die Standortmenüs funktionieren wieder, doch die Karte springt beim Standortwechsel ohne den zuvor vertrauten Zoom-aus-/Flug-/Zoom-ein-Übergang. Der Grund liegt unabhängig von der jüngsten Dropdown-Reparatur im Standort-/Kartenmodul: `setView(...,{animate:false})`.

Bei einem echten Wechsel des Bezugsstandorts startet jetzt `Leaflet.flyTo` eine sanfte Kamerafahrt. Die ursprünglich eingestellte Zoomstufe wird am Ziel wieder erreicht. Reisezeit je Entfernung: 1,25 s bis 25 km; 1,9 s bis 250 km; 2,5 s bis 1500 km; 3,0 s darüber. Bereits erreichte Koordinaten, alltägliche Home-Assistant-Statusaktualisierungen und manuelles Verschieben lösen keinen erneuten Flug aus. Nutzerseitig aktivierte Bewegungsreduktion sowie fehlende `flyTo`-Unterstützung nutzen eine direkte Fallback-Bewegung.

**Versionsstand:** V4.11.62 DEV · `41162r1` · `E411-62A1` · `location.radii-map` 1.0.20 · `core.manifest` 1.2.123 · Integration 0.25.0. Standortlisten V4.11.60, Menügestaltung V4.11.61, Karten- und Touch-Schutz sowie Wetter- und Cluster-Darstellung sind unverändert.

Alle drei Frontend-Auslieferungen, Prüfsummen, Versions- und DRA-Metadaten synchronisiert. Browserprüfung von Flug, Zielfenster-Zoom, Nichtwiederholung bei Statusaktualisierungen, manueller Kartenposition und gleichen Koordinaten. **Android-Realabnahme bleibt nach CI erforderlich.**
