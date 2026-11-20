# GewitterRadar PRO 4.11 – Funktionsneuheiten und Entwicklungsaufwand

**Redaktioneller Entwurf für Release Notes · Stand 17.11.2026 · DEV-Entwicklung bis 4.11.229 / HA 0.25.136.**  
Keine Behauptung einer FINAL-Freigabe: Die dokumentierten DEV-Versionen enthalten auch Zwischenstände, Fehlerkorrekturen und noch nicht vollständig abgenommene Funktionen. WeatherRouter ist ein separates Projekt und wird dort weiterentwickelt.

## Kurzfassung für die Veröffentlichung

Mit Version 4.11 wurde GewitterRadar von einer Blitz- und Niederschlagskarte zu einer deutlich umfassenderen, individuell konfigurierbaren Wetterplattform ausgebaut. Über die neue WeatherRouter-Anbindung kamen zusätzliche Wetterdaten, eine progressive Mehrquellen-Niederschlagsdarstellung, Wind- und Temperaturvisualisierungen sowie meteorologische Druckgebiete, Isobaren und Fronten hinzu. Parallel wurden Oberfläche, mobile Bedienung, Profile, Diagnose und internationale Sprachunterstützung grundlegend erweitert.

## 1. WeatherRouter & modulare Wetterarchitektur

- **Neue WeatherRouter-Anbindung:** Wetterdaten werden über authentifizierte Home-Assistant-Schnittstellen und definierte Fähigkeiten bereitgestellt. Auswahl, Gültigkeit und Quellenpriorität liegen beim Router.
- **Providerneutrale Wetter-Engine:** Die Darstellung ist nicht mehr an einen einzelnen Datenlieferanten gebunden. Unterschiedliche Provider können unabhängig voneinander eingebunden werden.
- **Consumer V1 und V2:** Neben punkt- und ereignisbezogenen Abfragen unterstützt V2 räumliche Rastermosaike und unterschiedliche Quellauflösungen.
- **Modularer Frontend-Aufbau:** Neue Wetterfunktionen werden als getrennte Module mit eigenen Zuständen, Einstellungen und Diagnosepfaden integriert.
- **Quellen- und Altersinformationen:** Herkunft, Beobachtungszeit, Datenalter und Verfügbarkeit werden nachvollziehbar ausgewiesen.

## 2. Niederschlagsradar & Mehrquellen-Mosaik

- **DWD und OPERA kombiniert:** Regionale DWD-Radardaten und das europäische OPERA-Mosaik werden innerhalb derselben Karte dargestellt.
- **NASA IMERG als optionale Ergänzung:** Ältere globale Satellitenschätzungen lassen sich ausdrücklich als zusätzliche Hintergrundquelle zulassen, ohne sie als aktuelle Radarmessung auszugeben.
- **Räumliche Providerpriorität:** Gültige DWD-Pixel haben in ihrem zulässigen Bereich Vorrang; OPERA bleibt außerhalb davon sichtbar. NoData und trockene Messwerte werden getrennt behandelt.
- **Progressives Nachladen:** Verfügbare Niederschlagskacheln sollen sofort erscheinen, während andere Quellen oder Nachbarkacheln noch laden. Die verbleibende Stabilität ist Teil der DEV-Abnahme.
- **Zeitleiste und Animation:** Vergangene, aktuelle und – sofern angeboten – prognostizierte Niederschlagsbilder können über einen Player durchlaufen werden.
- **Vorladen und Wiederverwenden:** Begrenzte Kachelpuffer und Cache-First-Strategien verringern unnötige Downloads und leere Übergänge.
- **Einheitliche Intensitätsskala:** Eine gemeinsame 15-stufige Farblogik führt von schwachem Niederschlag bis zu extremen Intensitäten; DWD-Originaldarstellungen bleiben dort erhalten, wo sie vorgesehen sind.
- **Darstellungsprofile:** Präzise, Ausgewogen, Weich und Auto erlauben die Wahl zwischen Rastertreue und geglätteten Übergängen.
- **Premium-Niederschlagslegende:** Quellen, Zeitstempel und Intensitäten werden in einer verschiebbaren, minimierbaren Legende angezeigt.

## 3. Wind – vom Messwert zum bewegten Wetterbild

- **Vier Winddarstellungen:** Windfahnen, Richtungspfeile, animierte Strömung und Windfarbflächen stehen zur Auswahl.
- **Schlangenförmige Strömungsanimation:** Bewegte Partikel mit Kopf, Körper und auslaufendem Schwanz visualisieren Windrichtung und -geschwindigkeit.
- **Umfangreiche Feinsteuerung:** Dichte, Geschwindigkeit, Länge, Linienführung, Transparenz und weitere Parameter lassen sich individuell abstimmen.
- **Geschwungene Strömungsverläufe:** Optional dynamische Linien und gekrümmte Bewegungen statt ausschließlich gerader Pfeile.
- **Winddesign- und Animationsstudio:** Einstellungen können in einer Vorschau ausprobiert und als eigene Profile gespeichert oder ausgetauscht werden.
- **Schnellschalter auf der Karte:** Die gesamte Winddarstellung kann ohne erneuten Menüweg ein- und ausgeblendet werden.
- **Leistungsoptimierter Renderer:** Wiederverwendete Partikel- und Bildpuffer reduzieren den Zeichenaufwand, insbesondere auf mobilen Geräten.

## 4. Temperatur & Luftbewegung

- **Temperaturfelder auf der Karte:** Weltweite Temperaturinformationen werden farblich und mit Zahlenwerten visualisiert.
- **Thermische Advektion:** Richtung und Transport wärmerer beziehungsweise kälterer Luftmassen können durch Pfeile und Strömungshinweise erkennbar werden.
- **Einheitenwahl:** Celsius, Fahrenheit und Kelvin stehen zur Verfügung.
- **Eigene Temperatursteuerung:** Temperaturdarstellung, Farben und Deckkraft sind unabhängig von Wind und Niederschlag einstellbar.

## 5. Wolken und synoptische Wetterlage

- **Wolken als eigene Kartenfunktion:** Die Wetterdarstellung wurde um eine gesondert schaltbare Wolkenebene und passende Eye-Bedienung erweitert.
- **Hoch- und Tiefdruckgebiete:** Meteorologische Druckzentren mit H/T-Symbolen und Druckangaben werden eingeblendet.
- **Isobaren:** Linien gleichen Luftdrucks lassen sich mit anpassbarer Farbe, Stärke und Beschriftung darstellen.
- **Wetterfronten:** Warm-, Kalt- und weitere Fronten erhalten eigene geografische Linien und meteorologische Symbole, soweit vom Provider freigegeben.
- **Synoptik-Premium-Menü:** Symbole, Linien, Neon-Effekte, Farbpaletten und getrennte Transparenzen sind individuell steuerbar.
- **Eigener Eye-Slot:** Synoptik ist als zusätzliche Kartenfunktion erreichbar, ohne die bisherigen Schnellzugriffe zu ersetzen.

## 6. Eye Hub & Premium-Bedienung

- **Neuer Eye Hub:** Wetterfunktionen sind über zentrale, frei konfigurierbare Wetter-Icons erreichbar. **Eye Control** verwaltet Slots, Gruppierung und Auren.
- **Bis zu acht sichtbare Funktionsplätze:** Die Belegung ist für weitere Slots vorbereitet und lässt sich auf Mobilgeräten auch ohne präzises Ziehen konfigurieren.
- **Gruppiert oder einzeln:** Funktionssymbole können um das zentrale Eye angeordnet oder unabhängig auf der Karte platziert werden.
- **Neon-Auren und Fusion:** Farbliche Lichtkränze und optionale Verbindungseffekte geben dem Hub seine charakteristische Premium-Optik.
- **Hi-Res-Wettersymbole:** Hochauflösende Icons für Niederschlag, Wind und meteorologische Funktionen sorgen für ein einheitliches Erscheinungsbild.
- **Kurztipp, Long-Press und Drag:** Schnelle Bedienung, Detailmenüs und individuelle Positionierung werden auf Maus- und Touchgeräten unterstützt.
- **Moderne und klassische Menüs:** Horizontale Navigation mit wählbarer Animationsgeschwindigkeit sowie alternative klassische Menüführung.
- **Premium-Branding:** Überarbeitete Übersichtsseite mit dem Logo „GewitterRadar PRO – powered by WeatherRouter“.

## 7. Kartenbedienung, Standort und Mobilgeräte

- **Individuelle Standortwechsel:** Gespeicherte Standorte und animierte Kamerafahrten erleichtern die Navigation zwischen Regionen.
- **Einstellbarer Zielzoom:** Der Zoom nach einem Standortwechsel kann automatisch oder fest gewählt werden.
- **Optimierte Blitzmarker:** Einzelblitze und Cluster werden gezielter aktualisiert, um Flackern und unnötige Neuzeichnungen zu verringern.
- **Leistungsstarke Radiusdarstellung:** Sehr große Beobachtungs- und Gefahrenkreise werden bei hohen Zoomstufen effizienter gezeichnet.
- **Touch- und Screenshot-Recovery:** Mehrere Entwicklungszyklen dienten der Wiederherstellung von Touch-, Eye- und Karteninteraktionen nach Android-Drei-Finger-Screenshots.
- **iPad- und Android-Anpassungen:** Menühöhen, Scrollbereiche, Drag-Grenzen, Zoomverhalten und Touchziele wurden wiederholt auf realen Geräten nachgebessert.

## 8. Profile, Transparenz und Einstellungen

- **Settings Vault:** Benutzer- und Geräteprofile speichern individuelle Oberflächen- und Wettereinstellungen und ermöglichen Sicherungen.
- **Persistente Konfiguration:** Eye-Positionen, Slot-Belegung, Farben, Transparenzen und viele Anzeigeparameter überstehen einen Neustart oder Profilwechsel.
- **Direkte Schnellsteuerung:** Häufig verwendete Wetterfunktionen sind ohne vollständigen Menüwechsel erreichbar.
- **Gemeinsame Designsprache:** Metallrahmen, runde Schließen-Symbole, Farbfelder, Legenden und kompakte Bedienelemente wurden vereinheitlicht.

## 9. Diagnose, Stabilität und Entwicklungsqualität

- **Erweiterte Kartendiagnose:** Zoom, Karteninteraktion, Gestenstatus, Kacheln und Wiederherstellungsereignisse können nachvollzogen werden.
- **Weather-Engine-Diagnose:** Providerwahl, Kacheltransport, Datenalter, Rendering und fehlgeschlagene Quellen werden getrennt beobachtet.
- **Export2Git-Anbindung:** Reale Diagnose- und Testdaten können revisionssicher für die gemeinsame Fehlersuche dokumentiert werden.
- **Sicherere Versionsübergänge:** Runtime-Kennungen, Modulmanifeste, Frontend-Spiegel und DRA-Pakete werden gegeneinander geprüft.
- **Provider-Isolation:** Ausfälle oder Verzögerungen einzelner Datenlieferanten sollen die übrigen freigegebenen Quellen nicht blockieren.
- **Geschützte Referenzstände:** Abgenommene WR-/GR-Paare sichern funktionierende Darstellungen gegen unbemerkte Regressionen.

## 10. Sprachen, Hilfe und Projektinformationen

- **19 Sprachvarianten:** Neben großen europäischen Sprachen gibt es unter anderem Boarisch, Plattdüütsch, Sächs’sch und Schwäbisch.
- **Umfassender Textkatalog:** Wettermenüs, Legenden, Eye-Bedienung, Profile und Hilfethemen wurden auf einen erweiterten Übersetzungsbestand gebracht.
- **Überarbeitete Hilfe und Hinweise:** Wetterfunktionen und Einstellungen werden mit zusätzlichen Erklärungen und illustrierten Symbolen erläutert.
- **Project Hub:** Eine zentrale Projektübersicht verbindet GewitterRadar mit weiteren Entwicklungen und stellt Online-/Offline-Fallbacks bereit.

## Entwicklungsaufwand – die Geschichte hinter 4.11

**Zeitraum:** Vom 30. September bis 17. November 2026 sind **49 Kalendertage (rund sieben Wochen)** dokumentiert. Die Entwicklungsnummerierung reicht von **4.11.01 bis 4.11.229**. Das bedeutet nicht, dass jede Nummer eine eigenständige finale Veröffentlichung oder ein gleich großer Arbeitsschritt war.

**Umfang:** Parallel entstanden und reiften mehrere große Funktionsfamilien: Wetterrouter-Integration, Niederschlag, Wind, Temperatur, Wolken, Synoptik, Eye-Hub, Premium-UI, internationale Texte, Einstellungen und Diagnose. Wiederholte Android-, iPad-, Desktop- und HA-DEV-Rückmeldungen führten zu zahlreichen Korrektur- und Optimierungsrunden.

**Nachweisbare Größenordnungen aus Teilberichten:**

- 19 Sprachvarianten und unter anderem 3.502 zusätzliche Texteinträge in einem Internationalisierungsschritt; der spätere Katalog weist 691 neue Themenwerte je Sprachvariante aus.
- Eine 15-stufige Niederschlagsintensitätsskala.
- Bis zu acht sichtbare Eye-Slots, Architektur auf zwölf vorbereitet.
- Wiederholte umfangreiche Testmatrizen; ein dokumentierter Stand prüfte 203 Node-Tests, davon 182 erfolgreich und 21 bereits in der geschützten Vergleichsversion fehlgeschlagen.
- Für die Windoptimierung wurden in einem kontrollierten Vergleich Zeichenzeiten von **13,46 auf 5,61 ms** (CPU-emulierte Mobilumgebung) und **5,81 auf 1,85 ms** (Desktop) dokumentiert. Das sind Messwerte aus einer Testkonfiguration, keine allgemeingültige Geräteleistung.
- Viele Realtests und Fehlerprotokolle auf der separaten Home-Assistant-Entwicklungsumgebung VM109; die Produktivumgebung VM101 blieb geschützt.

**Keine belastbare Stunden-/Kostenangabe:** Tatsächlich geleistete Personenstunden, Codex-/Claude-Laufzeit, API-Kosten und Anzahl der Einzelsitzungen sind aus diesen Repositories nicht vollständig messbar. Dafür sollte keine Scheingenauigkeit veröffentlicht werden. Die siebenwöchige intensive Entwicklungs- und Testphase und die 229er DEV-Versionsreihe sind die belastbare Größenordnung.

### Optionaler persönlicher Absatz für die Release Notes

> Version 4.11 ist weit mehr geworden als ein klassisches Funktionsupdate. Über viele Wochen hinweg haben wir neue Wetterdaten erschlossen, Renderer entwickelt, Bedienkonzepte entworfen, auf Android und iPad getestet, Fehler aufgespürt und immer wieder nachgebessert. Viele Ideen wurden erst durch das Zusammenspiel aus täglicher Nutzung, technischer Analyse und unzähligen Entwicklungsiterationen wirklich ausgereift. Das Ergebnis ist ein großer Schritt in Richtung einer umfassenden, modularen Wetterplattform – und gleichzeitig die Grundlage für alles, was als Nächstes kommt.

## Redaktionelle Hinweise vor dem FINAL-Release

- Unfertige oder nur experimentell freigegebene Funktionen nicht als wissenschaftlich validierte Warn- oder Prognosedienste darstellen.
- NASA IMERG immer als optionale Satellitenschätzung mit eigener Aktualität kennzeichnen.
- Tatsächlich abgeschlossene Geräteabnahmen vom automatisierten CI-/Chromium-Test unterscheiden.
- Neue Vorhaben für 4.12 (Schnee, Nebel, Glatteis) und 4.13/4.14 (MapLibre/Earth 3D) **nicht** als Funktionen von 4.11 aufführen.
- Die finale Release-Notes-Fassung vor der öffentlichen Veröffentlichung auf den tatsächlich abgenommenen Endstand reduzieren.

## Quellen zur internen Nachvollziehbarkeit

- `docs/RELEASE_NOTES_V4_11_GESAMTCHRONIK_DEV.md` (frühe Gesamtchronik bis 4.11.68)
- `CHANGELOG.md` sowie die Einzeldateien `docs/RELEASE_NOTES_V4_11_*_DEV.md`
- `docs/GR_WR_SYNOPTIC_PREMIUM_DEV_IMPLEMENTATION_411202_010322_2026-11-13.md`
- `docs/GR_PREFINAL_I18N_411223_2026-11-16.md`, `docs/GR_PREFINAL_I18N_411225_2026-11-17.md`
- `docs/GR_DWD_OPERA_PROGRESSIVE_411229_2026-11-17.md`
- `docs/WR_GR_PROTECTED_REFERENCE_PAIR_010320_411195_2026-11-13.md`

**C.K. – Eine Idee weiter gedacht.**
