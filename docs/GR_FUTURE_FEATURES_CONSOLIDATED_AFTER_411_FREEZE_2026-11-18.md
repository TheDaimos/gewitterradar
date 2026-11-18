# GewitterRadar – konsolidierte Zukunftsthemen nach dem 4.11-Feature-Freeze

**Stand 18.11.2026 · redaktionell aktualisiert · Status: Backlog-Übersicht, keine Implementierungsfreigabe.** Die Einordnung ersetzt nicht die verlinkten Detailbeschlüsse. Bereits in 4.11 gelieferte Funktionen werden nicht erneut als Zukunftsfeature verkauft. Vor Start von 4.12 den aktuellen Ist-Stand gegen die historischen To-do-Häkchen abgleichen. In öffentlichen Texten heißen das Bedienkonzept **Eye Hub**, dessen Einstellungsmenü **Eye Control** und die Funktionssymbole **Wetter-Icons**.

## A · Für GR 4.12 vorgemerkt / versioniert

### 0. Dynamische Aura-Anordnung – eine der ersten 4.12-Arbeiten
In Eye Control ein optionaler Modus, der nur die Auren aktiver, tatsächlich eingeblendeter Wetter-Icons ohne leere Zwischenräume anordnet. Die Reihenfolge folgt unverändert den belegten Slots im Eye Hub. Ein deaktiviertes Wetter-Icon oder eine einzeln abgeschaltete Aura erzeugt keinen freien Ring; beim erneuten Aktivieren rücken die Ringe automatisch auf. Die bisherige feste Anordnung bleibt als wählbarer Standard für bestehende Profile erhalten. Keine Veränderung der Slotbelegung, des Wetterzustands oder der Alarmlogik.
**Quelle:** [4.12-Aura-Beschluss](GR_412_DYNAMIC_AURA_COMPACTION_BACKLOG_2026-11-18.md), Betreiberentscheidung vom 18.11.2026.

### 1. Geo-Sonde – verbindlich eingeplant
Kartenpunkt antippen und fachliche Wetter-, Umwelt-, Naturgefahren- oder Küsteninformationen aus tatsächlich verfügbaren WR-Quellen abrufen; Koordinaten, Herkunft, Zeitpunkt und Einschränkungen anzeigen. Kompakte verschiebbare Infokarte, Aktivierung im Layer-Menü. Mehrfachsonden, Speicherung und Folgemodus erst mögliche spätere Ausbaustufen.  
**Quelle:** [Geo-Sonden-Beschluss](V4_12_GEO_SONDE_PLANUNGSBESCHLUSS_2026-10-16.md).

### 2. Winterwetter und Niederschlagsarten
- **Schnee:** Optionale animierte Flocken/Symbole, Größe und Dichte verstellbar.
- **Nebel/Nebelbänke:** Eigenständige Flächen aus fachlich geeigneten Sichtweiten-/Warn-/Prognosedaten.
- **Glatteis, gefrierender Regen, überfrierende Nässe:** Sauber getrennte Zustände und Warnlagen.
- **DWD HymecNG:** Originalprodukt und Klassen zunächst prüfen, dann additiven WR-Decoder und belastbaren V2-Vertrag für Niederschlagsarten entwickeln; erst danach GR-Animationen. Nicht RV/RY-Intensität mit Niederschlagsart verwechseln.  
**Quelle:** [Winterwetter- und HymecNG-Backlog](GR_412_WINTERWEATHER_AND_ORBITAL_SUBICONS_BACKLOG_2026-11-13.md).

### 3. Orbitale Mini-Untermenüs und Doppeltipp-Kalibrierung
Kleine kreisförmige „Monde“ um ein Haupt-Wetter-Icon, beispielsweise Schnee/Nebel/Glätte. Double-Tap öffnet den Orbit; Single-Tap bleibt Layer-Toggle, Long-Press bleibt Premium-Menü, Drag bleibt Verschieben. Individuelle Doppeltipp-Geschwindigkeit mit Test-/Kalibrierungsdialog und dauerhafter Profilpersistenz. Kollisionen mit Karten-Doppelzoom und Touchgesten vor Umsetzung prüfen.
**Quellen:** [Winterwetter-/Orbital-Konzept](GR_412_WINTERWEATHER_AND_ORBITAL_SUBICONS_BACKLOG_2026-11-13.md), [4.12-To-do](V4_12_TODO.md).

### 4. Zentraler Systemstatus
Statussymbol am Einstellungszahnrad: Orange für Hinweis, Rot für echten Fehler, Badge-Zahl; gruppierte Ursachen, betroffene Funktionen und konkrete Lösungsschritte in „Systemstatus & Hinweise“.  
**Quelle:** [4.12-To-do](V4_12_TODO.md).

### 5. Blitzortung-/Tracker-Diagnose und Fehlerhilfe
Tracker-Kopplung, Erfassungsradius, Datenleere und zugehörige Sensorauswahl zuverlässig unterscheiden; dynamische Diagnosen und klare Schritt-für-Schritt-Hilfe statt pauschaler Fehlermeldungen.  
**Quelle:** [4.12-To-do](V4_12_TODO.md).

### 6. Gespeicherte und überwachte Orte (Monitored Areas)
Separate Schutzorte statt des beweglichen Karten-Trackers; opt-in-Überwachung, eigener Status, Kopplung und Gefahrenradius. Blitzereignisse je Ort dedupliziert und kontrolliert in Local-To-do protokollieren, Löschschutz bei aktiver Protokollierung, Export als CSV/PDF; Überwachung muss unabhängig vom geöffneten Frontend funktionieren. Datenarchitektur, mehrere Blitzortung-Einträge und zulässige Alarme zuerst fachlich abklären.  
**Quellen:** [4.12-To-do](V4_12_TODO.md), [Fachkonzept](FUTURE_MONITORED_AREAS.md).

### 7. Local-To-do, Hilfe, Fehler-/Lösungsmeldungen
Fehlende To-do-Liste bei „Standorte & Speichern“ erkennen; Ursachen und Handlungsempfehlungen zentral melden. Hilfe neu nach Problemgruppen strukturieren und konkrete Einrichtungs-/Abhilfeschritte anbieten.  
**Quelle:** [4.12-To-do](V4_12_TODO.md).

## B · Weitere Versionsplanung aus unserer Projektentscheidung

### 8. MapLibre – Ziel GR 4.13
Alternative 2D-Kartenengine **innerhalb derselben Anwendung** mit gemeinsamem Daten-/Layer-/Interaktionsvertrag und kontrolliertem Engine-Umschalter. Nicht als zweite völlig neue GewitterRadar-App. **Hinweis:** Die ältere Repository-Roadmap bezeichnet MapLibre noch als unversioniert; die neuere Betreiberentscheidung ordnet es 4.13 zu.  
**Quelle:** [Roadmap](ROADMAP.md), spätere Betreiberentscheidung vom 15.11.2026.

### 9. Earth 3D – GR 4.13 oder 4.14, noch nicht entschieden
Prüfung einer optionalen 3D-Earth-Engine und Integration der Wetterebenen. Lizenz, Kartentechnik, mobile Leistung und gemeinsame Modularchitektur vor Umsetzung analysieren. Die Versionszuordnung ist ausdrücklich offen.  
**Quelle:** [Roadmap – Earth/3D](ROADMAP.md), Betreiberentscheidung vom 15.11.2026.

## C · Weitere dokumentierte Ideen ohne verbindliche Versionszusage

### 10. Globaler Storm Feed
Liste besonders aktiver Gewitter nach Welt/Kontinent/Land, mit nachvollziehbarer Aktivitätsbewertung und direktem Kartensprung; benötigt geeignete globale Quelle und darf die normale Blitzortung nicht blockieren.  
**Quelle:** [Roadmap](ROADMAP.md).

### 11. Erweiterte Unwetter- und Tornado-Information
Sturm, Hagel, Starkregen, Rotation/Superzellen und mögliche Warnungen erst nach amtlicher, lizenzierter und fachlich belastbarer Quellenprüfung. Keine scheinpräzise Tornadoerkennung aus indirekten Messungen.  
**Quelle:** [Roadmap](ROADMAP.md).

### 12. 120-Minuten-Blitzverlauf als eigenständiger Modus
LIVE-/Verlaufsschalter, Zeitleiste, Pause, Scrubbing und Geschwindigkeiten auf belastbarem Ereignispuffer – **vor Umsetzung Ist-Stand prüfen**, weil Radar-Zeitplayer und einzelne Verlaufsfunktionen bereits in 4.11 existieren.  
**Quelle:** [Roadmap](ROADMAP.md).

### 13. Cluster-, Standort- und Gerätekomfort
Weitere Cluster-Verfeinerung, vollständige Standortverwaltung, mobile UI-Optimierung und Asset-/Signatur-Optimierung nur nach Prüfung des schon erreichten 4.11-Standes.  
**Quelle:** [Roadmap](ROADMAP.md).

### 14. Lokale Dokumentation gefährlich naher Blitze
Mögliche lokale Ereignisdokumentation mit To-do und späterem Nachweis-Export; fachliche und rechtliche Abgrenzung beachten. Teilweise mit Monitored Areas überlappend.  
**Quelle:** [Roadmap](ROADMAP.md).

### 15. Kompass im klassischen Taschenuhrstil
Optische Premium-Idee für eine alternative Kompassgestaltung.  
**Quelle:** [Roadmap](ROADMAP.md).

### 16. Zusätzliche Wetter- und Umweltdatenquellen
Langfristiger Quellenausbau etwa für Luftqualität, Pollen, UV, Wind/Sturm, Schneewerte, nationale Radarprodukte und amtliche Warnungen. Providerverträge und Rechte beim WeatherRouter, Darstellung bei GR. Die historische „4.11“-Markierung in älteren Roadmap-Kapiteln ist **kein Auftrag**, diese Themen trotz Feature-Freeze rückwirkend noch in 4.11 einzubauen.  
**Quelle:** [Roadmap](ROADMAP.md) und WeatherRouter-Quellenkatalog.

### 17. HACS-Distribution und Updateanzeige
Offener beziehungsweise erneut zu prüfender historischer Roadmap-Eintrag: Standardkatalog, Update-Latenz und fehlendes HACS-Icon. Der alte Versionstitel „4.09“ ist nicht als neue 4.12-Zusage zu verstehen.  
**Quelle:** [Roadmap](ROADMAP.md).

## Priorisierungsvorschlag nach Abschluss von 4.11

1. **Vor 4.12:** Reale 4.11-FINAL-Abnahme, bestehende Provider-/Modulschutzregeln und offene CI-Abweichungen erledigen.
2. **4.12 zuerst:** Dynamische Aura-Anordnung in Eye Control, danach Geo-Sonde sowie Systemstatus/Tracker-Hilfe – jeweils mit begrenztem, isoliertem Umfang.
3. **4.12 danach:** Winterwetter-Quellennachweis/HymecNG, Monitored Areas und Orbitalmenüs getrennt planen; nicht alles gleichzeitig erzwingen.
4. **4.13:** MapLibre mit gemeinsamer Engine-Abstraktion.
5. **4.13/4.14 offen:** Earth 3D erst nach Architektur- und Lizenzanalyse.

**Hinweis:** Dieser Überblick ist ein konsolidierter Backlog, keine Aussage, dass alle Quellen heute implementiert, verfügbar oder rechtlich freigegeben sind. Die Details in den verlinkten Projektakten bleiben maßgeblich.
