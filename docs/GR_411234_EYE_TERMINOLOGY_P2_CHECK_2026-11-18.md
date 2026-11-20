# GR 4.11.234 DEV – P2 Eye-Terminologie

**Basis:** `deploy/dev` HEAD `c7246f4cc25d9d3d7be7a3f4f91e3009dee57191`  
**Version:** GR 4.11.234 / HA 0.25.141, Runtime `411234r1`, Modulset `E411-234A1`  
**Umfang:** Nur redaktionelle Bezeichnungen; Feature-Freeze bleibt bestehen.

## Änderungen

- Eye Hub = gesamtes Bedienkonzept; Eye Control = vorhandenes Einstellungsmenü.
- Eye-Control-Titel im zentralen 19-sprachigen Katalog vereinheitlicht. Die Produktbezeichnung wird in allen Sprachvarianten unverändert verwendet.
- DE/EN-Hilfetitel und zugehöriger Hilfetext aktualisiert; regionale DE-Hilfetexte angepasst.
- Aktuelle öffentliche 4.11-Release-Entwürfe und Roadmap-Beschreibung redaktionell korrigiert.
- Historische Release Notes, interne `bubble`-Identifier, Persistenzschlüssel, API-Verträge und Laufzeitlogik unverändert.

## Prüfung

| Prüfung | Ergebnis |
|---|---|
| 19 Eye-Kataloge, je 119 Schlüssel, Platzhaltervergleich | PASS |
| Eye Control in DE/EN und sämtlichen Sprachvarianten | PASS |
| Frontend-Build, 37 Module, 195 Dateien, Spiegel-/Checksum-Parität und DRA-Metadaten | PASS |
| Vollständiger historischer i18n-Differenzaudit | NICHT AUSGEFÜHRT: dessen historische Git-Anker sind im initialen Shallow-Checkout nicht vollständig vorhanden |
| HA DEV VM109 / Android / DRA-Realabnahme | OFFEN; nicht behauptet |

**Nicht berührte Funktionsfamilien:** Niederschlag DWD/OPERA/NASA, Wind, Temperatur, Synoptik, Provider-Caching, Eye-Touch/Drag, Slot-Persistenz und Neon/Aura-Renderer. Keine neue Funktionalität; bestehende Funktionstests deshalb nicht erneut als Realtests ausgeführt.

**Schutz:** Das offiziell geschützte Referenzpaar WR 0.10.320 / GR 4.11.195 bleibt unverändert. WeatherRouter-HEAD konnte wegen fehlender privater Git-Authentifizierung nicht gelesen werden; am WeatherRouter-Repository wurde nichts geändert.
