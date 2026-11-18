# GewitterRadar – Versionsverlauf: Ergänzung nach V4.10 und Roadmap

**Stand: 18.11.2026 · redaktionelle Vorlage, keine Runtime-Änderung.**  
**Quelltext geprüft:** `frontend/modules/ui/skeleton.js`, bestehender Abschnitt `release-history-future` und historische `release-history-entry`-Karten. Bestehende Einträge V4.10 und älter sowie alle bereits aufgeführten Zukunftspunkte bleiben erhalten. Die angezeigte Version ist dynamisch; keine hartcodierte 4.11.233 erzeugen. Deutscher und englischer Verlauf sind konsistent zu halten.

## A – Zusätzliche Roadmap-Stichpunkte (bestehende Liste erweitern, nicht ersetzen)

- **Schnee, Nebel und Winterwetter:** Erweiterte Wetterdarstellungen für Schneefall, Nebelbänke sowie Glätte und gefrierenden Niederschlag – ergänzt um kompakte orbitale Untermenüs.
- **Aura und Geo-Sonde:** Dynamisch angeordnete Aura-Ringe sowie eine frei platzierbare Karten-Sonde für Koordinaten, lokale Wetterinformationen, Gezeiten (Ebbe und Flut), Ortszeit und Mondphase, sofern passende Daten verfügbar sind.
- **UV, Luftqualität und Pollen:** Zusätzliche, einzeln zuschaltbare Umweltinformationen über geeignete Wetter- und Umweltdatenquellen.
- **Schwere Unwetter:** Erweiterte Visualisierung von Tornados, Superzellen, Hagel und weiteren Gefahrensituationen auf Grundlage fachlich belastbarer Daten.
- **ISS am Himmel:** Aktuelle ISS-Position und Flugbahn sowie standortbezogene Zeitfenster für mögliche Sichtbarkeit am ausgewählten Beobachtungsort.
- **MapLibre:** Einführung einer zusätzlichen Kartenengine innerhalb der bestehenden App; Wetterlayer und Bedienkonzept bleiben möglichst engine-unabhängig.
- **Blitzprotokollierung und Alarmierung:** Überwachte Orte, Gefahrenradius, nachvollziehbare Ereignisprotokolle und konfigurierbare Benachrichtigungen.

**Statushinweis:** Diese Punkte sind vorgemerkte Entwicklungsziele, keine Zusage zu Version, Termin oder Datenverfügbarkeit. Die Geo-Sonde und dynamische Aura sind für 4.12 geplant; MapLibre ist als Ziel für 4.13 notiert. Die ISS-Anzeige ist ein neuer Vorschlag und bedarf noch gesonderter fachlicher und technischer Prüfung.

## B – Neue historische Karte V4.11 · 2026/11

### GewitterRadar PRO – Aus dem Gewitterradar wird eine Wetterplattform

Version 4.11 stellt einen der größten Entwicklungsschritte von GewitterRadar dar. Aus der Anwendung zur Visualisierung von Blitzen und Gewitteraktivität wurde eine modular erweiterbare Wetterplattform. Die bisherige Gewitterfunktion bleibt das Herzstück der Basisversion; zusätzliche Ebenen verwandeln die App gemeinsam mit WeatherRouter in **GewitterRadar PRO**.

**WeatherRouter – intelligente Wetterdaten aus einer Hand:** Die Erweiterung entstand aus dem Bedarf, unterschiedliche Wetterdienste nicht einzeln in der Oberfläche anbinden zu müssen, sondern über einen zentralen, eigenständig arbeitenden Router zusammenzuführen. WeatherRouter bündelt Datenquellen, prüft Verfügbarkeit, räumliche Abdeckung und Aktualität und stellt geeignete Wetterinformationen über definierte Schnittstellen bereit. GewitterRadar kann diese Informationen nutzen, ohne die Auswahl und Gültigkeitsprüfung der Quellen selbst übernehmen zu müssen.

**Neue Wetterebenen und Analysen:** In der Karte kamen Niederschlagsinformationen unter anderem von DWD und OPERA, eine optionale NASA-Satellitenergänzung, unterschiedliche Windvisualisierungen einschließlich animierter Strömungen, Temperaturfelder, Wolken, Hoch- und Tiefdruckgebiete, Isobaren und meteorologische Wetterfronten hinzu. Die Wetterebenen sind individuell steuerbar; verfügbare Daten sollen unabhängig und schrittweise eingeblendet werden.

**Eye – eine zentrale Steuerung für viele Funktionen:** Der Eye-Bubble-Hub führt Wetterebenen in frei belegbaren Hi-Res-Symbolen zusammen. Individuelle Auren, Neon-Effekte, eigene Premiummenüs, Long-Press-Bedienung und die neue separat schaltbare Gewitterdarstellung erweitern die Kartensteuerung. Die Basisversion zeigt Gewitter weiterhin dauerhaft an.

**Personalisierung und Geräteprofile:** Mit Settings Vault, Benutzer- und Geräteprofilen sowie gespeicherten Eye-Positionen, Slot-Belegungen, Farben und Darstellungsoptionen kann die Wetterkarte individuell eingerichtet und nach einem Neustart wiederhergestellt werden. Gleichzeitig wurden Android-, iPad- und Desktopbedienung, Diagnosen, Hilfen und alle 19 Sprachvarianten weiterentwickelt.

**Entwicklungsleistung:** Hinter V4.11 liegen rund sieben Wochen intensive Entwicklungs-, Test- und Korrekturarbeit mit zahlreichen DEV-Iterationen, wiederholten Realtests, Quellanalysen und Leistungsoptimierungen. Die enge Entwicklung von GewitterRadar und WeatherRouter schuf sowohl neue Funktionen als auch die technische Grundlage für weitere Wetter- und Umweltmodule.

**Abgrenzung:** Dies ist ein redaktioneller Rückblick auf die 4.11-DEV-Entwicklung und keine vorweggenommene FINAL-Abnahme. Vor einer Veröffentlichung gegen den tatsächlich freigegebenen FINAL-Stand prüfen.

## C – Einbauhinweise

1. `release-history-future` in `frontend/modules/ui/skeleton.js` **nur um weitere `<li>`-Punkte ergänzen**; die sieben bisherigen `<li>` erhalten.
2. Neue `release-history-entry` **zwischen** Future-`</details>` und bestehender V4.10-Karte einsetzen. Keine vorhandene Karte überschreiben, chronologische Reihenfolge beibehalten.
3. Vorhandene Versionsverlauf-CSS-Klassen, Modal-Geometrie, DE/EN-Umschalter, Scroll- und Schließen-Icon unverändert lassen.
4. Englische Übersetzungen entsprechend ergänzen; nicht nur deutsche Texte anzeigen.
5. Frontend-Spiegel, Modul-/Runtime-Manifeste und DRA-Versionierung nur über den kanonischen Build ausführen. Keine isolierte Änderung einer einzigen ausgelieferten Kopie.
6. Minimaler UI-Smoke-Test für DE/EN, Auf-/Zuklappen, Scrollen und Erhalt aller Versionseinträge reicht.
7. Bestehende 4.11-Feature-Freeze-Regeln bleiben bestehen: ausschließlich redaktionelle/Release-Notes-Änderung, keine neuen Wetterfunktionen.

**Quellen:** [4.11-Feature-Freeze-Liste](GR_V411_RELEASE_NOTES_FEATURE_FREEZE_411232_2026-11-18.md) · [Zukunfts-Backlog](GR_FUTURE_FEATURES_CONSOLIDATED_AFTER_411_FREEZE_2026-11-18.md) · [dynamische Aura](GR_412_DYNAMIC_AURA_COMPACTION_BACKLOG_2026-11-18.md).
