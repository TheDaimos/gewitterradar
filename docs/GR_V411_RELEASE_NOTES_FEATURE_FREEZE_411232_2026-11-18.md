# GewitterRadar PRO 4.11 – aktualisierte Featureliste zum Feature-Freeze

**Stand: 18.11.2026 · letzter geprüfter DRA-Paketstand GR 4.11.232 DEV / HA 0.25.139 · FEATURE-FREEZE.**  
**Status:** Redaktionelle Release-Notes-Arbeitsfassung, keine FINAL-Freigabe und keine Bestätigung der noch offenen echten Installation auf VM109/Android/iPad. Diese Liste ergänzt die [Gesamtfassung bis 4.11.229](GR_V411_RELEASE_NOTES_FEATURES_AND_EFFORT_DRAFT_2026-11-17.md).

## Kurztext für die Release Notes

**GewitterRadar 4.11** macht aus dem bisherigen Gewitterradar eine modular erweiterbare Wetterkarte: Mit dem optionalen **WeatherRouter** wird daraus **GewitterRadar PRO** mit Niederschlagsradar, Wind, Temperatur, Wolken, Hoch-/Tiefdruckgebieten, Isobaren und Wetterfronten. Der Eye-Bubble-Hub, hochwertige Karten- und Menügestaltung, unabhängige Layer, Benutzerprofile, Diagnosen und 19 Sprachvarianten bieten deutlich mehr Kontrolle. Die Basisversion bleibt auf die Gewitterdarstellung fokussiert und weiterhin ohne WeatherRouter nutzbar.

## 1 · WeatherRouter und PRO-Architektur

- **Optionale PRO-Erweiterung:** WeatherRouter schaltet zusätzliche Wetterfunktionen frei; die Basisversion bleibt eigenständig.
- **Providerneutrale Engine:** GR zeigt WR-gelieferte Daten und Herkunft an; WR entscheidet über Quelle, Priorität, Frische und Abdeckung.
- **Consumer V1/V2:** Punkt-, Ereignis- und Raster-/Mosaikdaten über gemeinsame Schnittstellen.
- **Unabhängige Wetterebenen:** Ausfälle oder lange Ladezeiten einzelner Quellen sollen keine anderen Ebenen blockieren; progressive Kacheldarstellung und Cache-First.
- **Neuer PRO-Willkommensdialog (4.11.231):** Nach der normalen Begrüßung erscheint bei bestätigter *Nichtinstallation* von WR eine hochwertige PRO-Vorstellung mit sechs Feature-Kacheln, blauem PRO-Stempel, GitHub-Link und profilgebundenem „Nicht mehr anzeigen“. Bei unklarem WR-Status bleibt sie aus.

## 2 · Niederschlag

- **DWD + OPERA:** Regionale DWD-Radardaten und europaweite OPERA-Darstellung ergänzen einander räumlich.
- **DWD-Abdeckungsmaske:** OPERA-Niederschlag bleibt außerhalb der zulässigen DWD-Pixelmaske sichtbar; die violette geografische Markierung bleibt unverändert.
- **NASA IMERG optional:** Zusätzliche globale Satellitenschätzung, ausdrücklich getrennt von aktuellem Radar.
- **Progressive und isolierte Datenwege:** Verfügbare OPERA-, DWD- und NASA-Daten anzeigen, ohne auf andere Quellen warten zu müssen; stufenweises Nachladen und vorhandene Kacheln erhalten.
- **Zeitverlauf:** Spieler für Vergangenheit, Gegenwart und verfügbare Vorhersagebilder.
- **15-stufige Farblogik:** Gemeinsame Intensitätsskala und Premium-Legende mit Verschieben/Minimieren.
- **Darstellungsprofile:** Präzise, Ausgewogen, Weich und Auto; gezielte Glättung, Zoom- und Kachelpuffersteuerung.

## 3 · Wind

- **Vier Darstellungsformen:** Windfahnen, Pfeile, bewegte Strömung, Windfarbflächen.
- **Schlangen-Renderer:** Lebendige Strömungslinien mit Kopf, Körper und Schwanz, anpassbar in Dichte, Tempo, Länge und weiteren Parametern.
- **Wind-Designstudio:** Erweiterte Parameter und Vorschau für die individuelle Optik.
- **Performance:** Dokumentierte Reduktion der Renderzeit in ausgewählten Desktop-/Mobil-Testkonfigurationen.

## 4 · Temperatur, Wolken und Synoptik

- **Temperaturflächen:** Farbige Temperaturfelder, Werte und Advektionspfeile; Celsius/Fahrenheit/Kelvin.
- **Wolkenlayer:** Eigenständig steuerbare Bewölkungsdarstellung und passende Eye-Bedienung.
- **Hoch-/Tiefdruckgebiete:** Meteorologische Druckzentren und Symbole.
- **Isobaren:** Luftdrucklinien und individuelle Darstellung.
- **Wetterfronten:** Warm-/Kaltfronten und weitere providerseitig verfügbare Frontensymbole.
- **Synoptik-Premiummenü:** Farb-, Sichtbarkeits- und Transparenzoptionen, Premium-Icons und eigener Eye-Zugang.

## 5 · Eye-Bubble-Hub und Gewitter

- **Eye-Bubble-Hub:** Bis zu acht sichtbare, frei belegbare Slots; technisch für zwölf vorbereitet.
- **Gruppiert oder frei:** Wetter-Icons gemeinsam um das Eye oder einzeln positionieren; Touch, Drag, Tap und Long-Press.
- **Hi-Res-Icons & Neon:** Premium-Icon-Familie, Aura-Farben, Statusanzeigen und optionale Fusionseffekte.
- **Neue Gewitter-Bubble (4.11.230, nur PRO):** Gewitterdarstellung einschließlich Blitz-/Clusterkartenobjekten und dazugehörigen Effekten ein-/ausblenden; Datenerfassung, Warnlogik und Historie laufen weiter. Die Basisversion hält Gewitter stets sichtbar.
- **Gewitter-Long-Press-Menü:** Bereits vorhandene Clusterauflösung, Navigation, Sitzungszeit, Warnanimationen und Radien in einem metallischen Premium-Menü mit rundem Hi-Res-X.
- **Individuelle Aura je belegtem Slot (4.11.230–232):** Aktiv/Inaktiv im Aura-Farbmenü, wirksam im Zusammenspiel mit globaler Aura und aktivem Wetterlayer; Profile merken die Wahl. Gewitter startet standardmäßig ohne Aura, bisherige Nutzerwerte bleiben erhalten.
- **Eye Menü (4.11.232):** Vereinheitlichte Bezeichnung statt „Eye-Bubble-Menü“, identisches rundes Schließen-X auch beim Gewitter.
- **Einstellungserhalt:** Gewitter-Toggle verändert weder Cluster-/Einzelblitz-Wahl noch andere frühere Darstellungsparameter.

## 6 · Kartenführung, Geräte und Bedienoberfläche

- **Premium-Oberfläche:** „GewitterRadar PRO – powered by WeatherRouter“, dunkle Metallrahmen, goldene Akzente, einheitliche runde X-Schaltflächen.
- **Kartenansichten & Kamera:** Standortwechsel, Kamerafahrten, Zoomsteuerung und Fullscreen.
- **Mobile Optimierung:** Eye-Positionierung, Slot-Bedienung, Android/iPad-Scroll- und Touchflächen sowie Screenshot-/Pointer-Wiederherstellung.
- **Blitz-/Radius-Renderer:** Effizientere Marker, Cluster und große Gefahren-/Beobachtungskreise.

## 7 · Profile, Diagnose, Sprachumfang

- **Settings Vault:** Benutzer-/Geräteprofile, Sicherungen, Einstellungen und rückwärtskompatible Migrationen.
- **Persistenz:** Eye-Slots, Position, Aura, Layer und weitere Wetterpräferenzen bleiben bei Reload und Profilwechsel erhalten.
- **Weather-Engine- und Kartendiagnose:** Quellen, Kacheln, Runtime, Gesten und Fehler nachvollziehbar.
- **Export2Git:** Diagnose- und Testprotokolle für Entwicklung und Fehlersuche.
- **19 Sprachvarianten:** Umfangreiche Erweiterung der Texte für Menüs, Einstellungen, Hilfen und Premium-Funktionen.
- **Projekt & Hilfe:** Project Hub, kontextspezifische Hilfe und zusätzliche Hi-Res-Symbole.

## Entwicklungsleistung und Feature-Freeze

- **Zeitraum:** 30.09.–18.11.2026 = **50 Kalendertage einschließlich beider Daten**, also gut sieben Wochen dokumentierte Entwicklungsphase.
- **DEV-Versionslinie:** 4.11.01 bis **4.11.232**; eine Versionsnummer bedeutet weder einen vollwertigen Release noch eine bestimmte Zahl an Arbeitsstunden.
- **Besondere Größen:** 19 Sprachen, ein dokumentierter I18n-Schritt mit 3.502 Ergänzungen, 15 Niederschlagsklassen, acht Eye-Slots (zwölf vorbereitet).
- **Gezielte Qualitätssicherung:** Chromium, Android-/iPad-Rückmeldungen, Home-Assistant-DEV, DRA-Paket- und Runtime-Prüfungen über viele Iterationen. Tatsächlich offene Realabnahmen nicht als bestanden ausweisen.
- **Keine seriöse Gesamtstundenangabe:** Arbeits-/KI-/Teststunden und Gesamtkosten sind nicht vollständig erfasst. Der reale Aufwand ist über die Vielzahl von Entwicklungs- und Korrekturrunden belegt; keine fingierte Stundenschätzung.
- **Feature-Freeze:** Mit 4.11.231 dokumentiert, 4.11.232 ist eine Korrekturrunde. Fortan nur Stabilisierung, Fehlerbehebung, Dokumentation, Übersetzung und FINAL-Abnahme.

## Offene Gates vor FINAL

1. Installation und Realtest auf **DEV VM109**, Produktiv-VM101 unangetastet.
2. Physische Android-/iPad-Abnahme von Gewitter-Bubble, Aura, PRO-Dialog sowie bestehenden Wetterlayern.
3. Bereits bekannte Consumer-Snapshot- und weitere CI-Abweichungen bewerten; nicht pauschal als neue Regressionen ausgeben.
4. Nach echter Betreiberabnahme ausdrücklich einen neuen geschützten Referenzstand benennen.

## Nachweise

- [Gesamtchronik bis 4.11.229](GR_V411_RELEASE_NOTES_FEATURES_AND_EFFORT_DRAFT_2026-11-17.md)
- [Gewitter-Bubble 4.11.230](GR_STORM_BUBBLE_411230_2026-11-18.md)
- [PRO-Welcome 4.11.231](GR_PRO_WELCOME_411231_2026-11-18.md)
- [Eye Menü/Aura 4.11.232](GR_EYE_MENU_STORM_CLOSE_411232_2026-11-18.md)
- [DEV-Pakete 4.11.232](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.11.232-dev)

**C.K. – Eine Idee weiter gedacht.**
