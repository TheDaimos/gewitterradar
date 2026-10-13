# Gewitterradar V4.11 – zusammengeführte Entwicklungs- und Verbesserungsnotizen

**Stand:** 13.10.2026 · **Status:** fortlaufende DEV-Dokumentation, keine FINAL-Freigabe.  
**Gültige technische Basis:** V4.11.68 DEV · Build `V4.11.68-DEV-2026-10-13` · Runtime `41168r1` · Modulsatz `E411-68A1` · Integration `0.25.0`.  
**Basis:** vorhandenes `CHANGELOG.md`, versionsbezogene DEV-Release-Notes, Übergabe `docs/HANDOVER_V4_11_68_2026-10-13.md` sowie die am 13.10.2026 mitgeteilten Gerätebeobachtungen. Einzelne Zwischenversionen sind in dieser Zusammenfassung als Themenblöcke und nicht als lückenlose Commit-für-Commit-Aufstellung dokumentiert.

## 1. Beginn V4.11 und WeatherRouter-Architektur (V4.11.01–.05)

- V4.11.01: Entwicklung auf eingefrorener V4.10 FINAL aufgebaut; sichtbare, synchronisierte DEV-/Build-/DRA-/Modul-/Laufzeit-Kennungen.
- Providerneutraler WeatherRouter-Consumer-V1-Adapter über authentifizierten Home-Assistant-WebSocket: Discovery, Capability-Abfrage, Resolve, Ressourcenvalidierung und kontrollierte Nichtverfügbarkeit. Neues Diagnose- und Einstellungsfeld **Weather-Engine** mit expliziten Wetterabfragen sowie Quellen- und Aktualitätsanzeige.
- V4.11.02: Niederschlagsradar als eigenständige Kartenebene über `weather.radar.precipitation` / `raster_tile`; WeatherRouter bleibt für Quellenauswahl und Abdeckung verantwortlich. Kachelvarianten XYZ und WMS/BBOX, Quellenangaben, Datenalter, Deckkraft, Legende und abgedeckter Bereich.
- Laufzeit-Updatewächter zur kontrollierten Übernahme neuer DRA-Versionen, ohne die registrierte HA-Ressource zu wechseln.
- V4.11.03: Räumlicher Radarkachel-Vorladepuffer mit Profilen Aus, Klein, Normal, Groß und Benutzerdefiniert; begrenzte Kachelzahlen, Bildspeicher und Parallelabfragen zum Schutz mobiler Geräte.
- V4.11.04: zuvor fehlende Einbindung der Wetterradar-Einstellungen korrigiert; Radar-Schalter und Vorladebereich im realen Android-Test sichtbar und erfolgreich geprüft.
- V4.11.05: Radar-Zeitplayer mit Vergangenheit, Jetzt und Vorhersage, Zeitleiste, Wiedergabe/Pause und Einzelbild-Fallback. Doppelpufferung vermeidet leere Bilder bei Wechseln; während der Wiedergabe erhält der nächste Zeitstand Vorrang vor dem räumlichen Vorladen.
- Der Blitzortung-Datenpfad bleibt unabhängig; keine DWD-spezifische Quellenauswahl im Gewitterradar.

## 2. Project Hub und Projektpräsentation (V4.11.08 und Nachläufe)

- Zentraler Daimos Project Hub als eigenes Modul `ui.project-hub` an die Signatur angebunden.
- Online-/Offline-Erkennung mittels passiver HTTPS-Bildprobe; lokale Rückfallansicht. Externe Projektseiten werden nicht als fremdes JavaScript in Gewitterradar geladen.
- Popup im Vordergrund vor Einstellungen und Diagnose, anpassungsfähige Höhe und mobiles Layout; Projektkarten mit GitHub- und Projektseiten-Aktionen.
- Eigener eingefrorener Rückfallpunkt vor der Integration: `freeze/v4.11-pre-project-hub-2026-10-02`.
- Die spätere Überarbeitung des zentralen Project Hub ist ein eigenständiger Entwicklungsstrang; diese Chronik stellt sie nicht als abgeschlossenen Gewitterradar-Release dar.

## 3. Wetterdarstellung, Legende und Bedienung (u. a. V4.11.14, .17, .25)

- Verschiebbares Darstellungsmenü mit Augensymbol, Profilen **Präzise**, **Ausgewogen**, **Weich** und **Auto**, transparenzbezogener Bedienung und Kartenlegende.
- V4.11.14: schmalere zweistufige, responsive Wetterlegende mit größerer Quellengrafik; Transparenzregler 0–100 % zusätzlich direkt auf der Karte, sofortige Änderung ohne neue Wetteranfrage; **WR** setzt die vom WeatherRouter gelieferte Ausgangsdeckkraft.
- V4.11.17: Profil **Weich** nach Realtest weniger verwaschen, mit stärkerer Sättigung/Kontrast-Rückgewinnung und besser erkennbaren orange-roten Niederschlagskernen.
- Einstellbares **Aktualisierungsintervall – Wetterinformationen** (2–60 Sekunden, Vorgabe 15), getrennt vom kurzen Bewegungsfilter; Änderungen lokal im Browser gespeichert.
- V4.11.25: Auto-Entpixelung bei Übervergrößerung beginnt früher und nimmt zoomabhängig zu. Ziel: weichere Flächenübergänge statt harter Rasterzellen bei hohen Zoomstufen; `Präzise` bleibt die unveränderte Alternative.
- Geschützte Leaflet-Kacheltransformationen bleiben unangetastet; die Darstellung ersetzt weder die WeatherRouter-Routinglogik noch dessen Quellenauswahl.

## 4. Android-Gesten, Einstellungen und Kartenmarker (V4.11.25–.60)

- V4.11.25: bei Android/HyperOS die 3-Finger-Bildschirmfoto-Geste als Auslöser festhängender Kartenberührungen eingegrenzt. Gezielte Wiederherstellung des Leaflet-Gestenzustands ohne globalen Touch-Eingriff und ohne System-Bildschirmfoto zu blockieren.
- Moderne horizontale Einstellungsführung mit einstellbarer Animationsgeschwindigkeit und klassischer Baumstruktur als Alternative; Höhen-, Seiten- und Innenabstandsberechnungen schrittweise verbessert.
- V4.11.51 und .55: sichtbare Sprünge am Ende der Höhen-/Seitenanimation eingegrenzt; Signatur und Versionskennung stabil am Dialograhmen; Schutz gegen verspätete Animationsabschlüsse. Zwischenzeitlich parallel entwickelte Einzelblitz- und Menüänderungen wurden in V4.11.55 zusammengeführt.
- V4.11.53: nummerierte Cluster-Marker über stabile IDs und wiederverwendete Leaflet-DOM-Knoten gegen schnelles Flackern abgesichert; geänderte Cluster selektiv aktualisiert.
- V4.11.54: auch rote Einzelblitzmarker im Gefahrenradius bleiben über unveränderte Blitz-IDs bestehen, statt bei jedem Neuaufbau komplett entfernt zu werden.
- V4.11.40: Modulmanifest-Version direkt an das erwartete Register gekoppelt; zuvor beobachtete Versionsabweichung in der Moduldiagnose korrigiert.
- V4.11.60: gespeicherte Android-Standorte erhalten einen eigenen verlässlichen Wisch-/Scrollbereich; Kartengesten und Listenaktualisierungen sollen die Position nicht zurücksetzen.

## 5. Standortwechsel, Kamerafahrt und Zoomauswahl (V4.11.63–.67)

- V4.11.63: konkurrierende Kamerafahrten von HA-Standortaktualisierung und bestätigter Standortauswahl über einen geregelten Übergabezustand entkoppelt.
- V4.11.64: nach Geräte- und Browserdiagnose verhindert, dass ein harmloser Fenster-Fokusverlust die laufende Kamerafahrt durch `map.stop()` abbricht. Doppelte Flugaufträge derselben `flightId` werden unterdrückt; der eigentliche Schutz bei festhängender 3-Finger-Geste bleibt bestehen. Die wiederhergestellte Kamerafahrt wurde vom Anwender real bestätigt.
- V4.11.65: **Zoomstufe nach Standortwechsel** unter **5. Effekte & Animationen**; automatische Radiuseinpassung oder fester Endzoom, Standard 8; lokale Speicherung je Browserprofil. iPad-Bedienung der neuen Zoomwahl wurde positiv bestätigt.
- V4.11.66: feste Zielzoomstufen von 5–15 auf 5–18 erweitert.
- V4.11.67: CSS-Konflikt der zwei iPad-Zahnradsymbole korrigiert: Klassisch gold, Modern blau. Gesonderte Geräteabnahme dieser Symbolkorrektur war in der Übergabe noch offen.

## 6. Entscheidender Grafik- und Leistungsschutz (V4.11.68)

**Ausgangslage:** Auf dem iPad wurden nach Standortwechsel bei Zoom 17 massive Verzögerungen, unvollständige Darstellung und Companion-App-Verbindungsprobleme mehrfach beobachtet. Einstellungsbereiche brauchten teils **16,5 Sekunden**. Desktop-Vollbild und Kompass liefen erheblich langsamer; Android zeigte zeitweilige Trägheit.

**Technischer Befund:** Reale Kilometer-Beobachtungs- und Gefahrenradien führten bei hohem Kartenzoom zu überdimensionierten projizierten Canvas-/SVG-Kreisgeometrien mit teils über einer Million Pixel Radius. Der SVG-Aura-Weg wurde bei Kartenbewegung und Zoom erneut gezeichnet.

**Korrektur:** Anzeigegeometrien werden durch eine fenstergrößenabhängige Schutzschwelle von 2.048 bis 8.192 Pixeln begrenzt. Extreme außerhalb des Bildes liegende Kreisränder werden nicht gezeichnet; ein vollständig sichtbarer Gefahren-Innenschleier wird bildschirmgroß dargestellt. Geografische Radiusgrößen, Warn-/Gefahrenberechnung, Kamerafahrt, Wetterdaten und Gestenschutz bleiben fachlich unverändert.

**Geräte-Rückmeldung nach DRA-Installation am 13.10.2026:** Anwender meldet außergewöhnlich flüssiges Verhalten ohne Ruckler oder wahrnehmbare Leistungseinbußen, auch mit **Zoomstufe 18**. Das zuvor ruckelnde moderne Menü läuft flüssig; die Dauerstabilität im bisher absolvierten Realtest wird ausdrücklich bestätigt. Dies ist ein starkes Wirksamkeitsindiz der Zeichenschutzkorrektur, aber keine instrumentierte Prozessorauslastungs- oder Ursachenmessung.

**Akku und Temperatur:** Bereits vor dieser Korrektur hatte der Anwender schnellen iPad-Akkuverbrauch und Erwärmung beobachtet. Der nun entfernte Grafik-Engpass bietet eine technisch plausible Erklärung; eine tatsächliche Reduktion von Leistungsaufnahme, Temperatur und Energieverbrauch ist **noch nicht quantitativ gemessen**.

## 7. Bekannte, bewusst zurückgestellte Restbeobachtung

**Android-Erstzoom nach Companion-App-Start:** Wird nach App-Start die Zielzoomstufe geändert, kann ausschließlich **der erste** anschließende Standortwechsel noch die vorherige Zoomstufe (beispielsweise 7 statt 12) verwenden. Der zweite Wechsel erreicht die neue Einstellung; alle späteren Änderungen auf 8, 10 usw. werden sofort korrekt angewendet. Vom Anwender mehrfach reproduziert. Niedrige Priorität; keine riskante Änderung der in V4.11.64 stabilisierten Kamerafahrt ohne Ursachennachweis.

## 8. WeatherRouter: bewusst offener Entwicklungsblock

Die bereits vorhandene Consumer-V1-Anbindung, Niederschlagskarte, Zeitplayer, Darstellungsprofile und Legende sind **Gewitterradar-Entwicklungsleistungen**. Die vollständige Integration weiterer WeatherRouter-Dienste und Wetterereignisse ist dagegen noch **nicht abgeschlossen**. WeatherRouter wird parallel weiterentwickelt; seine öffentliche GitHub-Actions-Prüfinfrastruktur musste umgezogen und wiederhergestellt werden. Am 13.10.2026 sind Actions laut Anwender wieder nutzbar. Eine fertige WeatherRouter-Gesamtfreigabe darf daraus nicht abgeleitet werden.

## 9. Dokumentations- und Freigaberegeln

- Diese Chronik dient der Nachdokumentation der gesamten V4.11-Entwicklung. Bestehende Einzelversionsnotizen und technische Änderungsverläufe bleiben erhalten und sind für genaue Modulstände maßgeblich.
- Vor einer späteren FINAL-Veröffentlichung die Zwischenstände und nachträglichen Realabnahmen redaktionell zu einem nutzerverständlichen Release-Text verdichten.
- **V4.11.68 ist eine DEV-Version**, kein V4.11 FINAL. `main`, `v4.10` und `deploy/dev` werden durch diese reine Dokumentation nicht verändert.
- Private Diagnoserohdaten und Tokens gehören nicht in das öffentliche Repository.

**C.K. – Eine Idee weiter gedacht.**
