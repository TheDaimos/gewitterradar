# Changelog

## V4.11.08 DEV · Project Hub V0.2 RC1 Nachlauf · 2026-10-02

- `ui.project-hub` auf **1.1.0**: Signatur öffnet die lokale Project-Hub-Runtime unmittelbar als internes Host-Popup; kein verzögertes `window.open()` mehr.
- Health-Probe aktualisiert nur den Online-/Offline-Status; Remote-HTML/JS wird weiterhin nicht in Gewitterradar eingebettet.
- Zentralen Project-Hub-Stand **V0.2 RC1** übernommen: schlanke Runtime-HTML, lokale Retina-WebP-Assets, Desktop-Kopf weiter rechts, mobile Zentrierung.
- Projektkarten besitzen zwei vertikale Aktionen: **GitHub** und **Projektseite**. Gewitterradar verweist auf seine Pages-Projektseite; übrige Projektseiten zeigen deaktiviert `Projektseite · folgt`.
- Modulsatz **E411-08A2**, native Integration **0.23.6**. Produktversion und Runtime-Basis bleiben V4.11.08 / 41108r1.

## V4.11.08 DEV · 2026/10 (Entwicklung, kein öffentlicher Release)

- Daimos Project Hub als eigenständiges Laufzeitmodul `ui.project-hub@1.0.0`; die bestehende Signatur bleibt Darstellung und Einstiegspunkt.
- Passive HTTPS-Bildprobe auf `health.svg`; kein Remote-HTML/JavaScript im Gewitterradar-Kontext.
- Online wird die Pages-Root separat mit `noopener,noreferrer` geöffnet; offline/ungültig/Timeout nutzt die autarke lokale Miniansicht.
- Dashboard und native Integration erhalten denselben Modul-, Konfigurations- und Offlinebestand; DRA transportiert ihn über den bestehenden `replace_directory`-Vertrag.
- Rückfallpunkt: `freeze/v4.11-pre-project-hub-2026-10-02` auf `d5113b164046e478fe018cb12cea91eb85697a3f`.
- Identität: `4.11.08`, `V4.11.08 DEV`, `V4.11.08-DEV-2026-10-02`, Runtime `41108r1`, Modulsatz `E411-08A1`, native Integration `0.23.5`.
- `core.manifest` 1.2.54; **27 Laufzeitmodule**. About, Karte, Weather-Engine und Signaturgrafik bleiben unverändert.

## V4.11.05 DEV · 2026/10 (Entwicklung, kein öffentlicher Release)

- Erster providerneutraler **Radar-Zeitverlauf** direkt auf der Gewitterradar-Karte: Vergangenheit, aktueller Zeitpunkt und Vorhersage werden aus der vom WeatherRouter gelieferten Raster-Timeline abgeleitet.
- Bedienung mit Zurück/Vor, **Jetzt**, Wiedergabe/Pause und Zeitregler. Der Player erscheint nur, wenn die geroutete Quelle tatsächlich mehrere Radarzeitpunkte liefert; Einzelbild-Quellen bleiben vollständig nutzbar.
- Keine DWD-Sonderlogik im Gewitterradar: Anzahl und Zeitpunkte stammen vollständig aus Consumer V1. DWD kann aktuell bis zu 72 Analyse-/Vorhersageframes liefern, der Player nimmt jedoch keine feste Framezahl an.
- Framewechsel mit **Doppelpufferung**: der nächste Rasterzeitpunkt wird unsichtbar vorbereitet und erst nach erfolgreichem Laden eingeblendet, um leere/helle Zwischenbilder zu vermeiden.
- Während laufender Wiedergabe erhält die zeitliche Vorladung Vorrang vor dem großen räumlichen Zusatzpuffer; nach Pause oder manueller Auswahl wird der konfigurierte räumliche Puffer für den gewählten Zeitpunkt wieder aufgebaut.
- Kartenlegende zeigt abhängig vom gewählten Frame **Vergangenheit / Jetzt / Vorhersage** sowie die zugehörige Uhrzeit.
- Zeitplayer richtet seinen Abstand dynamisch nach der realen Höhe der Kartenlegende aus und wird in den Browserprofilen auf Desktop, iPad und Android auf Kartenbegrenzung und Überlappungsfreiheit geprüft.
- Weather-Engine zeigt zusätzlich den Status **Radar-Zeitverlauf** und die tatsächlich verfügbare Anzahl von Radarzeitpunkten.
- Kanonische DEV-Identität: Produkt `4.11.05`, Anzeige `V4.11.05 DEV`, Build `V4.11.05-DEV-2026-10-01`, Runtime `41105r1`, Modulsatz `E411-05A1`, native Integration `0.23.4`.
- `weather.precipitation-layer` auf `1.2.0`, `core.manifest` auf `1.2.51`; Gesamtzahl bleibt bei 26 Laufzeitmodulen.
- V4.11.04 bleibt die real abgenommene Radar-/Pufferbasis; V4.11.05 benötigt noch die reale Android-/DRA-Abnahme des Zeitverlaufs.

## V4.11.04 DEV · 2026/09 (Entwicklung, kein öffentlicher Release)

- Behebt einen real entdeckten V4.11.02/V4.11.03-Fehler: Das Modul `weather.precipitation-layer` war geladen und vollständig implementiert, aber sein Einstellungsblock wurde beim Aufbau des Dialogs nicht eingehängt.
- `ui.skeleton` ruft nun nach `_mountWeatherRouterSettings()` zusätzlich `_mountWeatherRadarSettings()` auf. Dadurch erscheinen in der Weather-Engine tatsächlich **„Niederschlagsradar · Kartenebene“** und **„Radar-Vorladebereich“**.
- Regressionstest verschärft: Beide Auslieferungen werden auf Desktop, iPad, iPad Pro, Android Hochformat und Android Querformat explizit auf Radar-Schalter, Pufferprofil und Pufferstatus geprüft.
- Kanonische DEV-Identität: Produkt `4.11.04`, Anzeige `V4.11.04 DEV`, Build `V4.11.04-DEV-2026-09-30`, Runtime `41104r1`, Modulsatz `E411-04A1`, native Integration `0.23.3`.
- `ui.skeleton` auf `1.1.17`, `core.manifest` auf `1.2.50`; Gesamtzahl bleibt bei 26 Laufzeitmodulen.
- Der bereits in V4.11.03 erfolgreich real geprüfte automatische Updatewächter bleibt unverändert und soll beim Wechsel V4.11.03 → V4.11.04 erneut im Realbetrieb bestätigt werden.
- Reale Android-Abnahme am 01.10.2026 bestanden: Radar-Schalter und Vorladepuffer sichtbar, DWD-Radardaten auf der Karte dargestellt, Attribution vorhanden und paralleler Blitzortung-/Instrumentenbetrieb ohne erkennbare Regression.

## V4.11.03 DEV · 2026/09 (Entwicklung, kein öffentlicher Release)

- Niederschlagsradar um einen **konfigurierbaren räumlichen Vorladepuffer** erweitert, damit beim Verschieben und Zoomen der Karte bereits angrenzende Radarkacheln bereitstehen können.
- Verständliche Pufferprofile: **Aus**, **Klein (+15 % je Seite)**, **Normal (+30 % je Seite, empfohlen)**, **Groß (+50 % je Seite)** und **Benutzerdefiniert (0–100 % je Seite)**.
- Der Prozentwert bezieht sich bewusst auf jede Seite des aktuell sichtbaren Kartenausschnitts. `Normal` entspricht damit theoretisch bis zu 2,56× sichtbarer Fläche; die tatsächliche Vorladung wird zusätzlich begrenzt.
- Harte Ressourcengrenzen verhindern unkontrolliertes Vorladen großer Ansichten: Klein max. 24 Zusatzkacheln / ca. 8 MiB, Normal 48 / ca. 16 MiB, Groß 96 / ca. 32 MiB, Benutzerdefiniert max. 128 Kacheln und ca. 40 MiB geschätzter dekodierter Bildspeicher.
- Die Speichergrenze berücksichtigt die reale Kachelgröße; bei 512px-Kacheln reduziert sich deshalb automatisch die zulässige Kachelanzahl.
- Maximal vier Vorladeanforderungen gleichzeitig; bei unsichtbarer Anwendung wird nicht aggressiv vorgeladen.
- Bereits fertig vorgeladene Kacheln werden beim späteren echten Kartenbedarf wiederverwendet; alte, nicht mehr relevante Einträge werden begrenzt verdrängt.
- Einstellungen zeigen Profil, Prozentwert, theoretischen Flächenfaktor, Kachel-/Speichergrenze sowie aktuelle Anzahl vorbereiteter und ladender Zusatzkacheln.
- Kanonische DEV-Identität: Produkt `4.11.03`, Anzeige `V4.11.03 DEV`, Build `V4.11.03-DEV-2026-09-30`, Runtime `41103r1`, Modulsatz `E411-03A1`, native Integration `0.23.2`.
- `weather.precipitation-layer` auf `1.1.0`, `core.manifest` auf `1.2.49`; Gesamtzahl bleibt bei 26 Laufzeitmodulen.
- Zeitliche Radar-Pufferung mehrerer Vergangenheit-/Vorhersageframes ist bewusst noch nicht Bestandteil dieses Schritts; V4.11.03 puffert räumlich den aktuellen Radarzeitstand.
- V4.10 FINAL und `main` bleiben unverändert; Entwicklungs-PR #28 bleibt Entwurf.

## V4.11.02 DEV · 2026/09 (Entwicklung, kein öffentlicher Release)

- Erster produktiver, providerneutraler **Niederschlagsradar als Kartenebene** über WeatherRouter Consumer V1 (`weather.radar.precipitation`, Ressourcentyp `raster_tile`).
- WeatherRouter entscheidet Quelle und Abdeckung; Gewitterradar enthält keine DWD-spezifische Routinglogik. XYZ- und WMS/BBOX-Kacheln werden unterstützt.
- Kartenebene mit eigenem Leaflet-Bereich, konservativer Kachelpufferung, nativer Zoomgrenze mit sauberem Hochskalieren, schaltbarer Darstellung sowie Quelle, Datenalter, Abdeckung, Attribution und optionaler Provider-Legende.
- Radar-Abfragen ressourcenschonend begrenzt: globaler Neuabruf, Ansichtswechsel und identische Ansichten besitzen getrennte Mindestintervalle; Kartenbewegungen werden entprellt.
- Neue Module `weather.precipitation-layer@1.0.0` und `core.update-watch@1.0.0`; insgesamt **26 Laufzeitmodule** mit vollständiger Modulansicht in allen 19 Sprach-/Dialektvarianten.
- Versions- und Cache-Vertrag vereinheitlicht: Produkt `4.11.02`, Anzeige `V4.11.02 DEV`, Build `V4.11.02-DEV-2026-09-30`, Runtime `41102r1`, Modulsatz `E411-02A1`, native Integration `0.23.1`.
- Neuer Laufzeit-Updatewächter prüft das installierte Laufzeitmanifest ohne Browsercache und kann nach einem DRA-Update einmalig kontrolliert neu laden; die stabile Home-Assistant-Ressource bleibt unverändert registriert.
- Der historische Browservertrag unterscheidet jetzt kanonische DEV-Laufzeiten von stabilen Veröffentlichungen, ohne den Schutz `stabile Version darf kein DEV tragen` aufzuweichen.
- WeatherRouter Consumer V1 wurde ergänzend korrigiert, damit bereits vorhandene sichere Raster-Legenden nicht mehr beim Normalisieren verworfen werden.
- Blitzortung bleibt als unabhängiger Datenpfad unverändert; die hybride Weather-Engine wird durch den neuen Radar-Layer nicht ersetzt.
- Entwicklungs-PR #28 bleibt Entwurf; `main` und die eingefrorene V4.10 FINAL bleiben unverändert.

## V4.11.01 DEV · 2026/09 (Entwicklung, kein öffentlicher Release)

- Start auf der eingefrorenen Veröffentlichung `v4.10` / `3111e9d27a62adf97d37cccb8066cc9a0803c128` im Zweig `feature/v4.11-development`; V4.10 FINAL bleibt unverändert.
- Eindeutige sichtbare DEV-Kennung aus dem Anwendungsmanifest; Hauptfenster, Build, DRA-`BUILD_VERSION`, Modul- und Laufzeitmanifest werden konsistent geprüft. Native Integration als Entwicklungsfassung 0.23.0.
- Eigenständiger, optionaler WeatherRouter-Consumer-V1-Adapter über den authentifizierten Home-Assistant-WebSocket-Kanal: Discovery, Capability-Abfrage, Resolve, Ressourcentyp-Validierung und kontrollierte fachliche Nichtverfügbarkeit.
- Neuer Einstellungsabschnitt „Weather-Engine“ mit Verbindungstest und expliziten, nur auf Anforderung ausgeführten Abfragen von Niederschlag, zusätzlichen Blitzbeobachtungen und amtlichen Warnungen, inklusive Quelle und Aktualität.
- Transparentes WeatherRouter-V004-Emblem aus dem WeatherRouter-Grafikarchiv als 256px-PNG in beiden Auslieferungen; separate geschützte 512px-Rendition. Originalmaster im WeatherRouter-Repository unverändert.
- Nun 24 Laufzeitmodule; Modulansicht für alle 19 Sprach-/Dialektvarianten um das WeatherRouter-Modul ergänzt.
- Keine automatische Blitzquellen-Umschaltung, keine neue Niederschlags-Kartenebene und keine Monitored-Area-Backendaktivierung durch diesen ersten DEV-Kandidaten. Realer externer WeatherRouter-Consumer-Test und DRA-Abnahme stehen noch aus.
- Entwicklungs-PR #28 bleibt Entwurf; weder `main` noch `v4.10` werden durch diesen Eintrag verändert.


## V4.10 FINAL · 2026/09 (2026-09-30)

- Öffentliche Produktversion V4.10 aus dem vollständig real abgenommenen technischen R40-Stand.
- Sichtbare Hauptfenster-Plakette V4.10; Release-Build V4.10-RELEASE-2026-09-30; native Integration 0.22.0.
- 23 Module; historische V4.10-Mengenangaben 28 Medaillon-Designs und 18 Pfeilvarianten unverändert.
- Sieben ausdrücklich geplante V4.11-Vorhaben im deutsch-/englischsprachigen Versionsverlauf.
- Reine Release-Normalisierung ohne funktionale Erweiterung der akzeptierten R40-Produktfunktionen.
- PRE-MERGE-, Post-Merge-, Diagnose-, Hi-Res- und Golden-Master-Gates bleiben verbindlich.


## V4.10.02 DEV – R33 · Mobile-Kompass & Hilfe-Feinschliff (2026-09-29)

- sehr schmale Touch-Anzeigen bis **520 px** nutzen nach Entfernung des alten Kompass-Selectors den frei gewordenen Kopfraum; Kompassfeld und nachfolgende Inhalte rücken geschlossen nach oben.
- iPad, Tablet und Desktop bleiben von dieser Geometrieänderung ausdrücklich unberührt; sichtbare Diagnose-Testtaster verhindern zusätzlich das mobile Zusammenklappen.
- im Hilfeabschnitt **„Kompass, Medaillon & Pfeile“** wurden die **Aura-Effekte ans Ende** verschoben, damit Auswahl und Bedienung der Instrumente zuerst zusammenhängend erklärt werden.
- neues Premium-Icon für den Instrument-Hilfeabschnitt ergänzt: eigener transparenter **2048×2048 Hi-Res/Vektor-Master** unter `artwork/help-icons/hires/`.
- für die tatsächliche Hilfeanzeige wird eine **68×68-PNG-Ableitung als 2× Retina für 34×34 CSS-Pixel** direkt eingebettet.
- der neue Hi-Res-Master ist in den verbindlichen Asset-Retentionsvertrag aufgenommen und damit dauerhaft geschützt.
- technischer Stand: **V4.10.02-MODULAR-DEV-R33-2026-09-29**, Runtime **41002r13**, Feature-Cache **41002r33**, Modulsatz **D33A-5E9B**.
- kein Merge nach `main` und keine öffentliche Veröffentlichung durch diese Änderung ausgelöst.

## V4.10.02 DEV – R32 · V4.10-Abschlussblock (2026-09-29)

- **Kompasswahl und Aura-Effekte entkoppelt:** Das gewählte Kompassdesign bleibt jetzt auch bei ausgeschalteten Aura-Effekten erhalten und kann weiterhin über das Kompass-Popup gewechselt werden.
- den alten Kompass-Selector oberhalb des Instruments entfernt; die Kompassauswahl erfolgt ausschließlich über das Instrument-Popup.
- den nicht mehr benötigten Punkt **Selector-Design** aus den Einstellungen entfernt.
- Kompass-Popup bleibt unabhängig vom Aura-Zustand vollständig bedienbar.
- **V4.10-Hilfe auf 19 Sprachvarianten erweitert:** eigener Abschnitt für Kompass-, Medaillon- und Pfeilauswahl, Aura-Trennung sowie verschiebbare und skalierbare Vollbild-Instrumente.
- **Mouse-over-/Tooltip-Audit:** alle benutzerseitigen festen Mouse-over-Texte der Hauptoberfläche auf die gewählte Sprache umgestellt beziehungsweise durch dynamisch übersetzte Texte abgesichert.
- sichtbare Bedienelemente der Kompass-/Medaillon-Auswahl wie Vollbild-Größe, Auswahl, Medaillon, Pfeil und Vorschau ebenfalls mehrsprachig gemacht.
- automatischen V4.10-Mehrsprachen-Vertrag erweitert: alle 19 Sprachvarianten müssen die neuen Picker-, Tooltip- und Hilfetexte vollständig enthalten.
- Versionshinweise zu V4.10 überarbeitet: **„Vom Monolithen zur modularen Architektur“**, Aufteilung in **23 Module** mit eigener Identität und Versionierung sowie zusätzlicher Abschnitt zu den sichtbaren UI- und Bedienverbesserungen.
- überzogene beziehungsweise interne Formulierungen wie „über Jahre gewachsen“, die 504er-Fit-Matrix und DRA aus dem öffentlichen V4.10-Beitrag entfernt.
- Roadmap bleibt nach V4.10 auf **„Implementierung von Wetterdiensten & Wetterereignissen durch WeatherRouter.“** fokussiert.
- technischer Stand: **V4.10.02-MODULAR-DEV-R32-2026-09-29**, Runtime **41002r14**, Feature-Cache **41002r32**, Modulsatz **D32A-5E9B**.
- kein Merge nach `main` und keine Veröffentlichung durch diesen Abschlussblock ausgelöst.

## V4.10.02 DEV – Roadmap-Bereinigung & V4.10-Beitrag (2026-09-29)

- Zukunfts-Roadmap in der Release-History auf einen einzigen nächsten Hauptblock reduziert: **Implementierung von Wetterdiensten & Wetterereignissen durch WeatherRouter**.
- unterschiedliche Medaillons sowie die verbesserte Kompass-/Medaillon-Auswahl sind ausdrücklich Bestandteil von V4.10 und keine zukünftigen Roadmap-Punkte mehr.
- neuer V4.10-Beitrag **„Vom Monolithen zum modularen Gewitterradar“** beschreibt Umfang und Bedeutung der Modularisierung einschließlich Modularchitektur, Instrumentenausbau, 28 Medaillons, 18 Pfeilvarianten, 504er-Fit-Matrix, Diagnose-/Regression-Schutz und DRA-Bereitstellung.
- englische Release-History parallel aktualisiert.
- `ui.skeleton` auf **1.1.8** angehoben und Frontend-Vertrag entsprechend nachgezogen.
- kein Merge nach `main`, keine Veröffentlichung und kein Release durch diese Änderung ausgelöst.

## V4.10.02 DEV – Modularisierungs-Schlachtplan offiziell abgeschlossen (2026-09-29)

- Nutzer hat den Gewitterradar-V4.10.02-Modularisierungs-Schlachtplan ausdrücklich als **offiziell abgeschlossen** erklärt.
- R31 bleibt der vollständig geprüfte technische DEV-Kandidat mit 5/5 zentralen CI-Prüfungen.
- iPad-Focus-/Tap-Ring-Fix real bestanden.
- ältere, durch spätere Schleifen überholte offene Zwischen-Checkboxen gelten nicht mehr als aktive Restarbeiten.
- neue Arbeiten beginnen als neuer separater Arbeitsblock.
- kein Merge nach `main`, keine Veröffentlichung und kein Release durch diesen Abschluss ausgelöst.

## V4.10.02 DEV R31 – iPad Trend-Fokusrahmen + Shared-Frontend-Vertrag (2026-09-29)

- iPad/WebKit-Fokus-/Tap-Artefakt an der Trendanzeige bereits in R31 produktiv korrigiert; keine erneute Ursachenanalyse oder Änderung der abgenommenen Medaillon-/Pfeil-Logik.
- `ui.skeleton` auf **1.1.7** mit explizitem Unterdrücken des blauen Tap-/Focus-Rings für `#trend-box` / `#trend-icon` und relevante Focus-Zustände.
- Touch-Pfad in `fullscreen.map-display` entfernt den Trendfokus vor dem Öffnen des Medaillon-/Pfeil-Pickers und stellt ihn beim Schließen auf groben Touch-Geräten nicht künstlich wieder her.
- Build `V4.10.02-MODULAR-DEV-R31-2026-09-29`, Feature-Cache `41002r31`, Runtime-Cache `41002r13`, Modulsatz `D31A-5E9B`.
- Modulstände: `core.manifest 1.2.37`, `fullscreen.map-display 1.0.29`, `ui.skeleton 1.1.7`, `diagnostics.cockpit 1.5.1`.
- veralteten Shared-Frontend-Testvertrag von `ui.skeleton 1.1.6` auf **1.1.7** aktualisiert.
- finaler technischer Kandidat `e2040a4afffa04da87d8cc4421becac7576217a7`: **5/5 zentrale CI-Prüfungen grün**.
- `deploy/dev` exakt auf diesen Kandidaten gesetzt und per Compare als **identical** verifiziert (0 voraus / 0 zurück).
- reale DRA-/iPad-Abnahme bestanden: Nach Tippen auf die Trendanzeige sowie Öffnen/Schließen des Medaillon-/Pfeil-Pickers tritt der blaue Focus-/Tap-Rahmen nicht wieder auf; Desktop-/Android-Regressionsgegenprobe bleibt offen.
- kein Merge nach `main` und keine Veröffentlichung erfolgt.

## V4.10.02 DEV R27 – Drag-Schutz bei Blitzupdates + weißerer Vorschau-Glow (2026-09-29)

- Vollbild-Drag für Lokations-Pille, Kompass und Trend/Medaillon gegen asynchrone Positions-Synchronisierung während aktiver Blitzereignisse geschützt.
- `_positionMapCompassOverlay()`, `_positionMapMedallionOverlay()` und `_positionMapLocationOverlay()` verändern die Position nicht mehr, solange der jeweilige Drag-Zustand aktiv ist.
- dadurch dürfen Blitz-/Resize-/Renderzyklen das gerade gezogene Instrument nicht mehr auf seine gespeicherte Ausgangsposition zurücksetzen.
- Vorschau-Umschalter **Starr / Animation** unter die aktive Chevron-Navigation verschoben und optisch zurückgenommen.
- Vorschau-Halo deutlich in Richtung Weiß verschoben: nahezu weißer Kern, warmweiße Zwischenzone, nur noch minimal warmer Außenanteil.
- zusätzlicher weißer Lichtsaum verbessert die Trennung des gold-/messingfarbenen Medaillons vom dunklen Hintergrund.
- Build `V4.10.02-MODULAR-DEV-R27-2026-09-29`, Feature-Cache `41002r27`, Runtime-Cache `41002r13`, Modulsatz `D31A-5E97`.
- Modulstände: `core.manifest 1.2.33`, `fullscreen.map-display 1.0.25`.
- technischer Kandidat `64b8805a661b7f7e7212fc1017ed1ece58cfe98c`: 5/5 zentrale CI-Prüfungen grün.
- `deploy/dev` exakt auf diesen Kandidaten gesetzt und als `identical` verifiziert.
- reale DRA-/HA-Abnahme unter echten Blitzereignissen bleibt offen.

## V4.10.02 DEV R26 – Vorschau unabhängig vom Live-Trend + kompakter Picker (2026-09-29)

- Medaillon-/Pfeil-Zähler im Auswahl-Pop-up auf reine `xx / xx`-Anzeige verkürzt; einzeilig und mit kompakterer Mittelspalte.
- neuer Vorschau-Umschalter **Starr / Animation**; Standard ist **Starr**.
- Pfeil im Auswahl-Pop-up ist außerhalb des Diagnosemodus immer sichtbar, auch wenn aktuell kein Gewittertrend vorhanden ist.
- Vorschau verwendet weiterhin die produktive 504er-Paar-Kalibrierung für Pfeilgröße und X/Y-Mittelpunkt.
- Animation nutzt die vorhandene Diagnose-Sweep-Bewegung, ohne den Live-Zustand der Karte zu verändern.
- Vorschau optisch mit dezentem warmweiß-goldenem Halo und zusätzlicher Tiefenwirkung veredelt.
- doppelte Prozentanzeige bei der Vollbild-Größe entfernt; Schnellwahl, 15–300-%-Regler und direkte Eingabe bleiben bestehen.
- Build `V4.10.02-MODULAR-DEV-R26-2026-09-29`, Feature-Cache `41002r26`, Runtime-Cache `41002r13`, Modulsatz `D31A-5E96`.
- Modulstände: `core.manifest 1.2.32`, `fullscreen.map-display 1.0.24`.
- technischer Kandidat `efabc9cbff47b29e0f173e557ad9d1338bc51a5d`: 5/5 zentrale CI-Prüfungen grün und exakt nach `deploy/dev` promotet.
- reale DRA-/HA-Sichtprüfung bleibt offen.

## V4.10.02 DEV R25 – kompakte Auswahl + robuste 15–300-%-Eingabe (2026-09-28)

- Medaillon-Pop-up auf einen kompakten Umschalter **Medaillon / Pfeil** umgestellt; nur die aktive Chevron-Navigation wird angezeigt.
- normale Hauptanzeige bewusst reduziert auf **Medaillon · x / 28** bzw. **Arrow · x / 18**.
- technische IDs erscheinen nur noch bei aktiver Diagnose als Zusatzzeile, z. B. **Medaillon: trend_17 · 17 / 28** bzw. **Pfeil: arrow_02 · 3 / 18**.
- zuletzt aktiver Auswahlmodus wird sitzungsbezogen gespeichert.
- freie Vollbild-Größeneingabe gegen laufende UI-Synchronisierung geschützt: das Feld darf während der Bearbeitung nicht mehr überschrieben werden.
- Prozentfeld als dreistelliges numerisches Textfeld umgesetzt, damit ein Wert wie `100` vollständig gelöscht und anschließend z. B. `300` eingegeben werden kann.
- Übernahme der Direkteingabe erst bei Enter oder Fokusverlust; Escape verwirft die noch nicht bestätigte Eingabe.
- Schieberegler 15–300 % bleibt für Live-Anpassung erhalten; Schnellwahltasten 50/75/100/125/150 % bleiben ebenfalls erhalten.
- produktive 504er-Medaillon-/Pfeilkalibrierung und geschützte Diagnosegeometrie bleiben unverändert getrennt.
- Build `V4.10.02-MODULAR-DEV-R25-2026-09-28`, Feature-Cache `41002r25`, Runtime-Cache `41002r13`, Modulsatz `D31A-5E95`.
- Modulstände: `core.manifest 1.2.31`, `fullscreen.map-display 1.0.23`.
- finaler technischer R25-Kandidat `860100d2e95ce706404b7fe8c93ad807e4a905e8`: **5/5 zentrale CI-Prüfungen grün**.
- `deploy/dev` exakt auf den R25-Kandidaten gesetzt und mit **ahead 0 / behind 0 / identical** verifiziert.
- reale DRA-/HA-Abnahme der neuen kompakten Auswahl und der Direkteingabe bleibt offen.

## V4.10.02 DEV R21 – produktive Medaillonkalibrierung + Vollbild-Instrumentskalierung (2026-09-28)

- finale reale Kalibrierung vollständig übernommen: 28/28 Augenreferenzen und 504/504 Medaillon-/Pfeil-Kombinationen.
- 504 bestätigte Paarwerte als stabile Produktdatenmodule integriert; bestehende `trend_XX`-/`arrow_XX`-IDs bleiben unverändert.
- Produktdarstellung verwendet nun paarweise Pfeilgröße sowie X/Y-Mittelpunkt aus dem final abgenommenen Datensatz.
- Diagnosegeometrie bleibt ausdrücklich entkoppelt und verwendet weiterhin die geschützte Referenzlage; produktive Kalibrierung beeinflusst Mess-/Diagnoseverträge nicht.
- Kompass- und Medaillon-Pop-up jeweils um **Vollbild-Größe** erweitert: 50 / 75 / 100 / 125 / 150 % sowie freie Eingabe 15–300 %.
- Kompass- und Medaillon-Skalierung werden getrennt persistent gespeichert und auf die responsive Vollbild-/Fenster-Ausgangsgröße angewendet.
- Build `V4.10.02-MODULAR-DEV-R21-2026-09-28`, Feature-Cache `41002r21`, Runtime-Cache `41002r13`, Modulsatz `D31A-5E91`.
- Modulstände: `core.manifest 1.2.27`, `fullscreen.map-display 1.0.20`, `ui.skeleton 1.1.4`.
- Finaler technischer R21-Kandidat `71d0ba949afa3ff6a2b31d91d8f88e9140379353`: 5/5 zentrale CI-Prüfungen grün.
- Reale DRA-/HA-Abnahme der produktiven Kalibrierung und der neuen 15–300-%-Vollbildskalierung bleibt als nächster Schritt offen.

## V4.10.02 DEV R16 – Pfeil/Auge-Geometriedatenbank (2026-09-27)

- Diagnose um eine persistente Geometriedatenbank für Medaillonaugen, Pfeilgeometrien und Kombinationen erweitert.
- **FIT-MATRIX** vermisst 28 Medaillons × 18 Pfeile = 504 Kombinationen.
- Je Kombination werden Pfeil/Auge-Ratio, empfohlene Skalierung, 360°-Containment, Freiraum/Überstand und ungünstigster Winkel ermittelt.
- **FIT-JSON** exportiert die vollständige Datenbank; Picker-Export verwendet `gewitterradar.picker-diagnostic.v2`.
- Augenmessung erfolgt aus dem echten Laufzeitasset; Pfeilgeometrie aus der sichtbaren Alpha-Kontur.
- Zwischenablagepfad für HA-WebViews robuster gemacht und Export-/Lognamen auf aktive Medaillon-/Pfeil-IDs umgestellt.
- Vollständige Matrix und automatische Anwendung der Messdaten bleiben bis zur realen DRA-Abnahme getrennt.
- Build `V4.10.02-MODULAR-DEV-R16-2026-09-27`, Modulsatz `F48F-1C26`; `core.manifest 1.2.21`, `fullscreen.map-display 1.0.16`, `instruments.medallion-designs 1.2.0`, `diagnostics.cockpit 1.2.0`.
- Finaler R16-Kandidat `ba3083c7d3ace5a986aeabe9327f1f5128122a59`: 5/5 Hauptprüfungen grün und exakt nach `deploy/dev` promoviert.

## V4.10.02 DEV R15 – Trendpfeilauswahl (2026-09-27)

- Medaillon-Pop-up um eine zweite, persistent gespeicherte Pfeilauswahl erweitert.
- Geschützter Standard `arrow_00` plus 17 eindeutig nummerierte Kandidaten `arrow_01`–`arrow_17`.
- Kandidaten als verlustfreie 264×264-WebP-Laufzeitgrafiken in Frontend, Dashboard und nativer Integration.
- Medaillon- und Pfeilnavigation verwenden die silbernen Hi-Res-Chevrons.
- Assetinventar, Laufzeitmanifest, Modulvertrag, Prüfsummen und Medaillon-/Pfeiltests erweitert.
- Hi-Res-Originale werden erst nach der finalen Auswahl in das Master-Repository übernommen.

## 2026/09 — V4.10.02 DEV
### R14 – Medaillon-Katalog auf 28 Varianten erweitert
- Zehn weitere Medaillons als `trend_19` bis `trend_28` ergänzt; bestehende IDs bleiben dauerhaft unverändert.
- Picker zählt dynamisch über den Katalog und zeigt die eindeutige ID, z. B. `trend_24 · 24 / 28`.
- Laufzeitgrafiken: 264 × 264 px, Alphakanal erhalten, verlustfreies WebP/VP8L, kein Beschnitt und keine Seitenverhältnisverzerrung.
- Die neuen Hi-Res-Quellen sind 1254 × 1254 px; Runtime-Derivate ersetzen die geschützten Masterquellen nicht.
- R14 erweitert die bestehende Modularisierung um `instruments.medallion-designs 1.0.0`; der bereits abgenommene Kern-Cache bleibt bewusst auf Runtime `41002r13`.
- Build `V4.10.02-MODULAR-DEV-R14-2026-09-26`, Runtime-Cache `41002r13`, finaler Modulsatz `477A-87C8`.
- Die spätere per-Medaillon-Geometrie für Schauglas und Trendpfeil wird aus Diagnoseexporten statt aus Screenshots abgeleitet.
- Die Modularisierung umfasst nun 23 Module; `instruments.medallion-designs 1.0.0` ist in der Modulansicht in allen 19 unterstützten Sprachen vollständig hinterlegt.
- Finaler R14-Kandidat `012fdfc62127b6db47cc1d87000217e5f286f7b0`: 5/5 Hauptprüfungen grün und exakt nach `deploy/dev` promoviert.

## 2026/09 — V4.10.02 DEV
### R13 – Medaillon-Katalog auf 18 Varianten erweitert
- Acht weitere Medaillons als `trend_11` bis `trend_18` ergänzt; `trend_01` bis `trend_10` bleiben unverändert erhalten.
- Picker zeigt die eindeutige ID direkt an, z. B. `trend_14 · 14 / 18`, damit spätere Auswahl/Aussortierung zweifelsfrei möglich ist.
- Laufzeitgrafiken: 264 × 264 px, freigestellt, verlustfreies WebP/VP8L, mindestens 2× Retina für die 132-px-Instrumentdarstellung.
- Kein Beschnitt und keine Seitenverhältnisverzerrung. `trend_18` wird wegen der nichtquadratischen 1284×1225-Quelle proportional auf 264×252 skaliert und transparent auf 264×264 zentriert.
- Runtime `41002r13`, Build `V4.10.02-MODULAR-DEV-R13-2026-09-26`, Modulsatz `C91E-5A27`.
- Eindeutige Zuordnung dauerhaft in `docs/MEDALLION_CATALOG.md` dokumentiert.
- Hi-Res-Originale bleiben verbindliche Masterquellen und werden später separat im Master-Repository abgelegt.


## 2026/09 — V4.10.02 DEV
### R12 – neun zusätzliche Trend-Medaillons
- Bestehendes `trend_01` unverändert beibehalten.
- Neue Varianten `trend_02` bis `trend_10` ergänzt.
- Freigestellte Laufzeitgrafiken als 264 × 264 px große 2x-Retina-Ableitungen integriert; verlustfreies WebP/VP8L, kein Beschnitt, keine Seitenverhältnisänderung.
- Assets byte-identisch in kanonischem Frontend, Dashboard und nativer Integration.
- Runtime `41002r12`, Build `V4.10.02-MODULAR-DEV-R12-2026-09-26`, Modulsatz `7A2C-91D4`.
- Hi-Res-Originale bleiben verbindliche Masterquellen und werden später separat im Master-Repository abgelegt.


## 2026/09 — V4.10.02 DEV
### R11 – experimenteller Vollbild-Dragversuch verworfen
- Nach der R10-Abnahme wurde ein kurzzeitig gemeldeter Drag-Aussetzer der Diagnosekonsole im Karten-Vollbild untersucht.
- Die reale R10-Nachprüfung bestätigte den Drag als funktionsfähig; R10 blieb der freigegebene DRA-Stand.
- Ein vorsorglicher R11-Zwischenstand wurde nie nach `deploy/dev` promoviert und zeigte im Shared-Frontend-Test selbst eine Desktop-Regression des bestehenden Vollbild-Dragvertrags.
- R11 wurde deshalb vollständig verworfen; Feature-Laufzeit, Tests, Manifeste, Ausleitungen und Prüfsummen wurden auf den real abgenommenen R10-Stand zurückgeführt. Dokumentations-/Abnahmefortschritte bleiben erhalten.
- Kanonische Referenz bleibt R10: Runtime `41002r10`, Modulsatz `CEA6-1ECF`, Kandidat `4f22f4be5841e47993226928405cc65cdd70e201`.

### R10 – interne Modul-Cachekennung vereinheitlicht
- Der in R9 neu eingeführte Abweichungsdialog wurde real über DRA/HA abgenommen; Darstellung und kontextbezogene Exporte funktionieren wie vorgesehen.
- Der R9-Export zeigte gemischte interne ES-Modul-URLs mit aktuellen und alten Cachekennungen (`r9`, `r1`, teilweise `r2`). Dadurch wurden `core.registry` und `core.runtime` mehrfach instanziiert.
- R10 setzt alle statischen internen Modulimporte einheitlich auf `41002r10`.
- Neuer Regressionstest verhindert künftig jede interne Cachekennung, die vom Loader-Cache abweicht.
- Finaler Kandidat `4f22f4be5841e47993226928405cc65cdd70e201` ist 5/5 CI-grün und nach `deploy/dev` promoviert.
- Reale Abnahme bestätigt: **22/22 Module geladen**, **Versionssatz konsistent**, **Modulsatz-ID `CEA6-1ECF`**, keine Abweichungen.

### Abschlussaudit R8 – Modulidentität und Schlachtplan
- Der vollständige Modularisierungs-Audit hat zwei interne Identitätsreste gefunden, die die bisherigen Funktions-/Browserprüfungen nicht sichtbar gemacht hatten.
- `core.manifest` führt seinen Sollstand und seine Selbstregistrierung nun identisch; die Selbstregistrierung war noch auf 1.2.10 stehen geblieben, während Soll-/Runtime-Manifest bereits 1.2.12 erwarteten.
- `core.base-context` trägt nun dieselbe aktuelle Buildkennung wie Loader und Runtime-Manifest; dort war intern noch die R5-Kennung vorhanden.
- Auditstand: Runtime `41002r8`, Modulsatz `3541-2967`, Build `V4.10.02-MODULAR-DEV-R8-2026-09-25`, `core.manifest 1.2.13`, `core.base-context 1.0.4`.
- Ein neuer Vertrag vergleicht alle 22 erwarteten Modulversionen mit den jeweiligen Selbstregistrierungen und bezieht das selbstregistrierende Manifest ausdrücklich ein.
- Der verbindliche Modularisierungs-Schlachtplan wurde gegen spätere reale DRA-/HA-/Browserabnahmen auditiert; alte Scheinoffenpunkte wurden geschlossen, ohne unbelegte Punkte künstlich abzuhaken.
- Radius-Kaskade und Kompass-Schließen-X wurden im Abschlussaudit aufgrund der ausdrücklichen realen Benutzerbestätigung als erledigt geschlossen.
- R8-Kandidat `8ee2b6fbc30213ead936e622cc886afd995dcff6` ist 5/5 CI-grün (Shared Frontend #2304, Integration #2323, Diagnostic #1007, Source Archive #548, Hi-Res #1539) und wurde exakt nach `deploy/dev` promoviert.
- Als reale Abschlussgates verbleiben nur noch die DRA-Installation von R8 mit 22/22-konsistenter Laufzeit sowie die Cluster-Jump-/Infinity-Abnahme auf Desktop, iPad und Android/HA Companion.

### Diagnose R7 – sofortiger Teardown im geöffneten Picker
- Behebt einen real auf Android/HA Companion gefundenen Randfall: Beim Beenden der globalen Diagnose in einem noch geöffneten Kompass-/Medaillon-Picker blieb das lokale Diagnose-Raster sichtbar, bis der Picker geschlossen wurde.
- Ursache war ein zuvor gesetztes `display:block !important` an den lokalen Diagnose-SVGs; `hidden=true` allein konnte diese Inline-Regel nicht übersteuern.
- Beim Diagnose-Ende werden nun `display`, `visibility`, `opacity` und `z-index` der lokalen Diagnoseebenen zurückgesetzt und die SVG-Inhalte sofort geleert.
- Der Picker bleibt geöffnet; bei erneutem Start der Diagnose werden Raster und Messhilfen regulär neu aufgebaut.
- Browserregression prüft den Diagnose-Ausstieg im geöffneten Medaillon-Picker inklusive sofortigem `display:none`, leerem SVG-Markup und anschließendem erfolgreichen Neustart der Diagnose.
- Runtime-Revision: `41002r7`; Modulstände: `diagnostics.cockpit 1.1.3`, `fullscreen.map-display 1.0.12`, `core.manifest 1.2.12`; Modulsatz `E2DF-E846`.
- R7 wurde anschließend über `deploy/dev` real in Home Assistant abgenommen. Das Beenden der Diagnose bei geöffnetem Picker entfernt Raster/Messhilfen sofort, ohne den Dialog zu schließen; die zuvor bestätigten R6-Funktionen (sichtbare TREND-Animation, absolute Winkel und sichtbare KP-/MP-Diagnose) bleiben intakt.

### Diagnose R6 – sichtbare Top-Layer-Messung, Winkelkonvention und Vollbild
- Reale R5-Abnahme zeigte drei zusätzliche Diagnosefehler: der Medaillon-Animationszustand war intern aktiv, ohne den sichtbaren Pfeil zu bewegen; die statischen Winkel bezogen sich fälschlich auf die bereits um 45° gedrehte Pfeilgrafik statt auf eine absolute Himmelsrichtung; lokale Raster/Messlinien waren trotz aktivem Diagnosezustand real nicht sichtbar.
- Die Diagnosewinkel verwenden nun verbindlich **0° = Nord, 90° = Ost, 180° = Süd, 270° = West, im Uhrzeigersinn**. Der Hi-Res-Pfeil besitzt dafür einen expliziten Asset-Nullpunktversatz von **−45°**; der Export dokumentiert Winkelkonvention und Assetversatz.
- Die TREND-Animation besitzt wieder einen tatsächlich animierbaren `transform`: die statische `!important`-Transformation gilt nicht mehr für ANIMATION/FREEZE. Der Diagnosesweep läuft absolut von Nord über Ost nach Süd und zurück.
- Picker-SVGs werden im nativen Dialog-Top-Layer mit expliziter Sichtbarkeit und oberster lokaler Stapelreihenfolge gerendert. Raster, Achsen, Diagonalen, Begrenzungen und Mittelpunktmarken folgen den globalen Diagnoseeinstellungen.
- Kompass- und Medaillon-Picker erhalten eindeutige lokale Rasterkennungen `KP-A1…KP-J10` bzw. `MP-A1…MP-J10`.
- Der Vollbildmodus erhält ein eigenes Diagnose-Raster `FS-A1…FS-J10`. Diagnose-Overlay und große Diagnosekonsole werden beim Eintritt in Vollbild in dessen nativen `<dialog>`-Top-Layer verschoben.
- Öffnet sich aus dem Vollbild heraus ein Kompass- oder Medaillon-Picker, folgt die große Diagnosekonsole dem obersten Picker-Dialog und kehrt beim Schließen wieder in den Vollbild-Dialog zurück.
- Der Browservertrag prüft jetzt tatsächliches SVG-Markup, lokale Rasterkennungen, die reale Änderung des berechneten Pfeil-Transforms während der Animation, die absolute Winkelkompensation sowie den Top-Layer-Hostwechsel in Vollbild und Picker.
- Runtime-Revision: `41002r6`; Modulstände: `diagnostics.cockpit 1.1.2`, `fullscreen.map-display 1.0.12`, `core.manifest 1.2.11`; Modulsatz `37F8-9357`.
### Diagnose – Kompass-/Medaillon-Picker und designfähige Medaillon-Profile
- Die globale Diagnose wird jetzt direkt **innerhalb** des geöffneten Kompass- und Medaillon-Pop-ups gespiegelt, damit die Messhilfen auch im nativen Dialog-Top-Layer sichtbar bleiben.
- Beide Picker erhalten lokale Achsen, Diagonalen, Bounding-Boxen, Mittelpunktmarken, Navigationsmessung und einen kompakten Live-Messwertblock.
- Die Kompassauswahl misst Instrumentzentrum, Pivot, Links-/Rechts-Symmetrie der silbernen Chivron, vertikale Ausrichtung, Abstand Instrument → Navigation und Überlauf.
- Die Medaillon-Auswahl misst Medaillonzentrum, profilspezifische Apertur, Soll-/Ist-Pfeilzentrum, Pfeilgröße, Links-/Rechts-Symmetrie der goldenen Chivron, vertikale Ausrichtung und Abstand Stage → Navigation.
- Picker-Diagnose folgt dem globalen Schalter **Diagnosedarstellung anzeigen/ausblenden** und bleibt bei ausgeschalteter Diagnose vollständig unsichtbar.
- Diagnose-Snapshots enthalten jetzt zusätzlich die aktuell geöffneten Picker-Messwerte.
- `MEDALLION_DESIGNS` trägt ab jetzt pro Medaillon ein eigenes `diagnosticProfile`; die Medaillon-Kalibrierung verwendet nicht mehr fest `MEDALLION_DESIGNS[0]`, sondern immer das aktuell ausgewählte Design.
- Das bestehende `trend_01`-Profil übernimmt unverändert die bereits abgenommenen Mittelpunkt-, Apertur-, Pfeil- und Skalierungswerte und dient als Vorlage für kommende Medaillons.
- Browser-Regression prüft Dashboard und native Integration auf Desktop und iPad mit sichtbarer/ausblendbarer Picker-Diagnose sowie Snapshot-Übernahme.
- Reale Nachprüfung: Medaillon-Diagnosezustände bleiben jetzt auch bei normalen Render-/Kalibrier-Synchronisierungen erhalten; **NORMAL** wird erst wiederhergestellt, wenn der Diagnosemodus tatsächlich beendet ist.
- Der Medaillon-Picker spiegelt LEER/PFEIL/TREND/FREEZE/NORMAL einschließlich Winkelsteuerung direkt im geöffneten Top-Layer-Dialog; damit können Zustände geprüft werden, ohne das Popup schließen zu müssen.
- Kompass- und Medaillon-Picker besitzen bei aktiver Diagnose eine kompakte lokale Werkzeugleiste im Popup. Beide bieten **KOPIEREN**, **JSON** und **CSV**; das Medaillon zusätzlich die vollständigen Diagnosezustands-, Pfeil-, Animations-, Freeze- und Winkelsteuerungen.
- CSV-Export ist semikolongetrennt und UTF-8/BOM-tauglich; Zwischenablage und JSON enthalten denselben strukturierten Picker-Messdatensatz einschließlich Build, Viewport, Design, Diagnosezustand, Messwerten und vorhandenem Kalibrierbericht.
- Kurze/Querformat-Viewports können die erweiterten Picker bei Bedarf intern scrollen, ohne die normale Popup-Geometrie zu verändern.
- Runtime-Revision: `41002r5`; Modulstände: `core.base-context 1.0.3`, `diagnostics.cockpit 1.1.1`, `fullscreen.map-display 1.0.11`, `core.manifest 1.2.10`; Modulsatz `EA13-2B8B`.
### Kompassauswahl – freigestellte Retina-Chevrons
- Die Kompassauswahl verwendet ausschließlich die freigestellten **Silber-Chivron**; die Messing-/Gold-Variante bleibt im Repository und wird von der analogen Medaillon-Auswahl verwendet.
- Die Laufzeitdarstellung ist als picker-lokale, verlustfreie WebP-Datenmodule (VP8L) gekapselt: 104×104 Pixel bei 52×52 CSS-Pixeln, also exakt 2× Retina; Dateigrößen ca. 8,6–11,1 KB.
- Die zuvor verwendeten nicht sauber freigestellten Runtime-SVGs wurden aus den drei Auslieferungsbäumen entfernt.
- Der Austausch ist technisch auf `fullscreen.map-display` und seine vier Picker-Datenmodule begrenzt; Chevron-Grafiken in Menüs, Akkordeons, Diagnose und sonstiger Oberfläche bleiben unverändert.
- Der damalige Retina-Zwischenstand war `41002r2`; der aktuelle Diagnose-/Picker-Stand ist oben separat dokumentiert.


### Frontend-Cache-Sicherheit & Modulsatz-ID

- Entkopple den internen ES-Modul-Cache von der sichtbaren Produktversion: Runtime-Revision `41002r1` erzwingt einen vollständigen, einheitlichen Modul-Neuladevorgang innerhalb V4.10.02.
- Ergänze eine kompakte **Modulsatz-ID**; aktueller Sollstand: `FAC5-4376`.
- Prüfe den geladenen Modulsatz gegen `assets/gewitterradar-runtime-manifest.json` mit ungecachtem Abruf. Ein bereits offenes Browser-/App-Fenster kann dadurch künftig einen auf Platte neueren Stand als **Frontend-Neuladung erforderlich** erkennen.
- Übersetze Modulsatz-ID, Installationsstatus und Neuladehinweis in alle 19 unterstützten Sprachvarianten.
- Halte die Chevron-Runtime-Derivate klein und verlustfrei; die vollständigen Hi-Res-Master bleiben außerhalb des ausgelieferten Frontends.


### Chevron-Materialvergleich im Kompass-Pop-up

- Keep the full Hi-Res Chevron family as non-delivered artwork source pending transfer to the dedicated master repository; it is not a Gewitterradar runtime dependency.
- Show two simultaneously active compass-navigation rows for direct visual acceptance: brass on top, aged silver directly below.
- Keep both material rows functionally identical for previous/next compass selection; only the material presentation differs.
- Deliver only reduced, lossless 256×256 runtime SVGs for brass/silver left/right, byte-identically across native integration and Dashboard; the four-direction Hi-Res masters stay outside the delivered package.


### Modularisierung · Abschlusskorrekturen

- Fix the radius cascade when lowering **Gewitterradius** below the persisted **Gefahrenradius**: the real Home Assistant danger state is now reduced first instead of trusting the already-previewed slider value, preventing `danger_radius <= storm_radius <= observation_radius` validation failures on Desktop, iPad and Android.
- Apply the same persisted-state safeguard to direct storm-radius writes from keypad/step controls so all Gewitterradar radius entry paths preserve the intended inner-radius cascade.
- Remove the unintended square focus/appearance frame around the premium compass-picker close control on iPad/Android while retaining a non-rectangular image glow as keyboard focus feedback.
- Add a dedicated **fullscreen Cluster-Jump pill** that mirrors the existing cluster-navigation state, can be freely moved by mouse/touch, starts directly left of the 3D layer selector, persists its position/visibility per browser and is toggled from the existing top-left instrument strip with the Hi-Res infinity symbol.
- Stabilize **Module & Versionen** so individual module rows can be opened, closed and reopened repeatedly without an immediate re-render closing them again.
- Preserve open module-detail rows across diagnostic list refreshes and isolate inner module toggles from the outer Settings accordion.
- Reduce the Module Details dialog from 780 px to **660 px** maximum width and from 860 px to **760 px** maximum desktop/tablet height while retaining viewport-aware mobile sizing.
- Reduce unnecessary bottom space in **Kalibrierung & Diagnose** after the single-scroll-owner Settings refactor.
- Complete the **Kartendarstellung** Settings translations across all **19 language variants**, including Default view, Last used, the per-device storage note and separate-map-window texts.
- Refresh the map-display UI immediately when the application language changes so no stale English labels remain visible.
- Complete a full dynamic **title / aria-label / mouse-over audit** across all **19 language variants** for cluster resolution, cluster-navigation session controls, map start view, separate map window, release-history badge, compass picker, fullscreen compass/medallion movement and the device compass.
- Remove the remaining hard-coded German cluster hover texts such as `Cluster-Auflösung · …`, `Zur Sitzungszeit wechseln` and `Auf unbegrenzt wechseln`; source-contract tests now reject these regressions explicitly.
- Stop rebuilding the Module Details list during ordinary render/translation synchronization when neither language nor diagnostic data changed; a stable content signature keeps the actual `<details>` nodes alive so clicks cannot be overwritten by a background refresh.
- Stress-test module rows with repeated click cycles while `_syncModuleView()` and translation synchronization run between clicks.
- Refine Portuguese cluster-resolution **Tarde → Tardia**.
- Extend browser regression coverage to reject English fallback text in non-English map-display and tooltip settings and to exercise repeated module-detail open/close/open behavior.
- Keep canonical frontend, native integration delivery and Dashboard delivery byte-identical; refresh module manifest, deterministic contract and frontend SHA256 inventory.
- Localize **all 22 Module Details entries end-to-end** across all 19 language variants: module display names and complete function lists now follow the active language while technical module IDs and file paths intentionally remain unchanged.
- Fix the Module Details status header so application version, loaded-module count and consistency state are separated explicitly and keep their spacing after the overlay is reparented outside the Settings section.
- Fix the **Standardansicht** custom dropdown lifecycle: closing Settings via backdrop, close control or accordion transition now always closes the detached startup-view dropdown and resets `aria-expanded`, preventing an orphaned menu from remaining above the map.
- Add browser regression coverage for both **Settings backdrop close** and **accordion switch** while the Standardansicht dropdown is open.

### Modulversionen

- `core.base-context` → **1.0.3**
- `core.card-lifecycle` → **1.0.1**
- `ui.skeleton` → **1.1.2**
- `ui.i18n-settings` → **1.2.2**
- `diagnostics.module-view` → **1.3.1**
- `diagnostics.cockpit` → **1.1.1**
- `fullscreen.map-display` → **1.0.11**
- `map.clusters-recent` → **1.0.2**
- `ui.render` → **1.0.1**
- `ui.controls` → **1.1.3**
- `core.manifest` → **1.2.10**
- `location.radii-map` → **1.0.1**
- `core.manifest` → **1.2.9**

## 2026/09 — V4.10.01 DEV

### Kompassauswahl

- Start the V4.10 development line at **V4.10.01** on top of the published V4.09 baseline.
- Open a dedicated premium compass picker by tapping/clicking the compass itself.
- Reuse the **Hi-Res premium close control** from “Über Gewitterradar” instead of a plain text ×.
- Reuse the established dark metallic **gold premium frame** and add polished gold left/right chevrons below the compass.
- Reparent the live compass instrument into the modal while it is open, so the preview always uses the real active compass geometry, frame and needle instead of a separate approximation.
- Switch cyclically through all existing compass designs and apply/persist the selection immediately without an additional Apply button.
- Preserve fullscreen mouse/touch dragging and distinguish a tap from a drag with a 6 px movement threshold; only a genuine tap opens the picker.
- Keep the first iteration intentionally free of new visible translation strings; existing compass previous/next translations are reused for accessibility labels.
- Keep all three frontend delivery paths byte-identical.


## 2026/09 — V4.09 FINAL / native integration 0.21.0

### Kartenansichten & separates Kartenfenster

- Add the direct map views **Standard**, **Groß** and **Vollbild** with a device-/browser-profile-specific **Standardansicht**.
- Add the compact 3D map-view selector with responsive placement and a fully localized 19-variant popup.
- Add the separate storm-map window using the currently selected map state and compass while keeping the normal Dashboard view independent.
- Replace the native device-specific map-view picker in Settings with the established Gewitterradar custom dropdown style.
- Refine the Settings action for the separate map window into a clearly recognizable premium button.
- Move **Cluster-Auflösung** and **Cluster-Navigation** to the top of **Kartendarstellung** while keeping their existing runtime bindings unchanged.
- Use a dedicated viewport-aware **Radien** scroll surface with touch/momentum scrolling and additional bottom space so the final danger-radius control remains fully reachable on short browser and WebView viewports.

### Vollbild-Instrumente & Standortbedienung

- Add independently showable/hideable **Kompass** and **Medaillon** instruments in fullscreen.
- Keep Compass and Medallion freely movable by mouse and touch without changing their accepted instrument sizes.
- Add the freely movable fullscreen location pill with locally stored position and an adaptive location menu.
- Open the location menu downward near the top, upward near the bottom and use responsive multi-column/scroll behavior where useful.
- Preserve the accepted top-layer behavior of map controls, radius dialogs and worldwide place search in fullscreen.
- Keep storm and danger warning animations visible inside the native fullscreen dialog instead of rendering behind the browser top layer.

### Standortsuche & Koordinateneingabe

- Add consistent `×` clear controls to the designation/name, latitude and longitude input fields without changing the existing location-search or coordinate-adoption behavior.
- Scope the protected Medallion calibration image/arrow lookup to the production `trend-icon` so the new fullscreen Medallion cannot be mistaken for the diagnostic target.

### Hilfe, Sprachen & Versionsverlauf

- Expand **Hilfe & Hinweise** with map display, Standard view, fullscreen controls, 3D selector and the separate map window.
- Synchronize the complete Help & Notes structure across **15 languages plus 4 German dialect variants = 19 variants**.
- Localize the compact map-view popup itself across all 19 variants and center its heading.
- Restore and protect the permanent **Zukünftige Entwicklungen · Geplant / Future Developments · Planned** section above the public Release History.
- Keep internal V4.09.xx DEV/TEST iterations out of the public Release History; the public history contains only released versions plus the future-planning section.

### Nächste geplante Entwicklung

- Unterschiedliche Medaillions bereitstellen.
- Verbesserungen der Kompass- und Medaillion-Auswahl.
- Implementierung von Wetterdiensten via WeatherRouter.

## 2026/09 — V4.08 FINAL / native integration 0.20.0

### Cluster-Auflösung & Cluster-Navigation

- Add the cluster-resolution profiles **Früh**, **Ausgewogen**, **Spät** and **Klassisch · V4.07.56** while preserving the protected classic fallback behavior.
- Rename the session control to **Cluster-Navigation · Sitzungszeit** and keep the accepted 5–3600 second plus unlimited navigation modes.
- Preserve the reliable pointer-down mode switch for countdown/unlimited operation without triggering an additional cluster navigation step.
- Keep the cluster browser session stable while navigating and reset it only for structural changes such as a profile switch.
- Document the V4.08 cluster behavior consistently in Help, Release History and the dedicated V4.08 project documentation.

### Repository- & Web-Dokumentation

- Refresh the repository landing page for HACS with HACS-safe absolute branding paths so the Gewitterradar logo renders reliably in the HACS detail view.
- Add the existing Gewitterradar hero artwork to the repository landing page without modifying protected master assets.
- Redesign the separate HTML installation/overview guide around installation first, a compact feature gallery, integrated image enlargement and 15 regular documentation languages.
- Prepare the documentation screenshots as lossless WebP assets to reduce repository/web payload while leaving the protected Hi-Res/master asset set untouched.
- Keep the detailed repository/web presentation changes documented in `docs/RELEASE_NOTES_V4_08_TEST.md` and `docs/HISTORY.md`.

## 2026/09 — V4.07.56 FINAL CANDIDATE / native integration 0.19.0

> **Noch nicht öffentlich veröffentlicht.** V4.07.56 ist der vom Benutzer abgenommene gemeinsame Produkt-/Diagnosestand. Die kontrollierte Promotion nach `main`, der post-merge Golden Master sowie der öffentliche Tag/HACS-/GitHub-Release stehen noch aus. V4.06 bleibt bis dahin die öffentliche Rückfallbasis.

### Added

- Add a Gewitterradar-owned modern GPS `device_tracker` as the movable reference adapter for worldwide locations.
- Add `gewitterradar.set_reference_coordinates` to atomically move the product-owned tracker and select it as the active Gewitterradar reference.
- Add read-only Blitzortung linkage diagnostics without mutating foreign ConfigEntries or `.storage`.
- Add `app_gewitterradar_v4_07_pkg.yaml` with a separate Dashboard Template `device_tracker` and coordinate-set script.
- Add worldwide place/postcode search with Open-Meteo as primary geocoder and a controlled OpenStreetMap Nominatim fallback.
- Add direct latitude/longitude input to the worldwide location workflow.
- Add local country autocomplete, explicit country filtering, country-grouped result presentation and global ranking safeguards.
- Add saved places through the local `Gewitterradar Orte` Local-To-do datastore, including `★` save, reversible `×` soft-delete and `↶` restore without duplicate creation.
- Add automatic map focus after location adoption and outside-click/tap closing for the location selector.
- Add a bilingual DE/EN Release History switch and update the V4.07 history entry from the former planning placeholder to the implemented scope.
- Add the Help section **Externe Dienste & Netzwerkfreigaben** with a fail-closed inventory for current runtime network targets.
- Add premium Help iconography, deterministic embedded SVG assets, network/service highlighting, radius-specific Help presentation and viewport/zoom-safe Help/Settings scrolling.
- Add the protected diagnostic master mode with pink active frame, movable/minimizable console, independent child-tool hiding and master hard-stop.
- Add deterministic virtual-storm scenarios `AUS`, `BEOBACHTUNG`, `GEWITTER`, `GEFAHR` and `GESAMT` through the normal production pipeline.
- Add deterministic **1–5 virtual storm cells** and the **EXTREM** diagnostic path without changing product thresholds or forcing the resulting cluster color.
- Add diagnostic grouped/individual strike rendering through the normal production renderer.
- Add protected Medallion diagnostic states **LEER / PFEIL / TREND / FREEZE / NORMAL** together with calibration, geometry, overlay, JSON/snapshot and performance tools.
- Add a dedicated V4.07.56 Golden/geometry contract for seven fixed browser profiles.
- Add a permanent fail-closed Hi-Res/master retention contract protecting current and legacy artwork content.

### Accepted normal product baseline

- V4.07.54 is the accepted normal UI/function baseline for the V4.07.56 finalization.
- Keep the accepted map, worldwide location search, languages, Help, radii, Settings, Compass, Medallion and normal interaction behavior unchanged while finalizing diagnostics and release protection.
- Preserve the complete product language scope of **15 languages + 4 German dialect variants = 19 variants**.
- Keep Deutsch and English native in the main JavaScript and load the remaining 17 variants from the external locale module.
- Preserve the accepted Android map/radius legend behavior and responsive Desktop/Tablet/Mobile presentation.

### Diagnostic protection

- Protect the accepted V4.07.56 diagnostic behavior with `tests/contracts/diagnostic-contract-v4.07.56.json` and `scripts/verify-diagnostic-contract.mjs`.
- Run the diagnostic contract through a dedicated GitHub Actions gate.
- Treat silent removal, semantic weakening or cleanup-driven loss of an accepted diagnostic capability as a release blocker.
- Require explicit user approval plus contract/documentation update and affected-function reacceptance for intentional diagnostic changes.

### Golden/browser protection

- Keep the historical V4.05 golden test intact as historical evidence.
- Add a dedicated V4.07.56 Golden contract using the exact accepted frontend identity.
- Freeze geometry across seven fixed profiles with a maximum tolerance of **0.02 px**.
- Compare Dashboard and Integration rendering pixel-wise within the same CI run instead of using unstable cross-run full-screen hashes as a release blocker.
- Distinguish the visible close symbol from its larger 44×44 touch target when checking visual overlap.
- Preserve the 44×44 touch target while validating the current accepted visible X geometry.
- Keep stricter automatic focus behavior on Desktop and explicitly focus the visible close control before keyboard activation in touch emulation.

### Hi-Res/master retention

- Permanently retain unused, superseded and legacy Hi-Res/master artwork in the current canonical repository state; Git history alone is not considered a sufficient archive.
- Protect **32 unique master/legacy content identities** across Help, worldwide location search and About controls.
- Allow a protected master to move into an approved `legacy/`/archive location only when the exact protected content remains present.
- Do not count runtime/package-derived copies as master retention.
- Fail closed when a protected master disappears or when new unique content appears in a protected Hi-Res/legacy area without being registered in the retention contract.
- Keep the original large About close/copy masters, earlier target variants and the retained V4.06 premium close artwork.

### Build, package and checksum alignment

- Canonical accepted frontend: **1,955,141 bytes**, SHA256 `249485f4bcf68c9b23b821cae9b507030ae09cff5a56f7e28d3d7f3b02eb4a1a`.
- External About/Help locale module SHA256: `997c4fe9b357935888fdb7bedc43cdd17f105b97241a000324891cea575dd436`.
- Canonical V4.07 Dashboard package SHA256: `1b705c5686e6a7be6dfb36717903df551d4f9f93787c39bd12bddf00aefae694`.
- Keep the historical V4.06 Dashboard package as retained fallback/migration material while also building and verifying the V4.07 package deterministically.
- Include both Dashboard packages in the canonical checksum inventory.
- Keep Integration and Dashboard frontend/locale/assets byte-identical.

### Validation and safeguards

- Deterministic frontend reconstruction and exact delivery parity are required.
- JavaScript syntax, About/Help locale, Recorder locale, diagnostic contract and Hi-Res retention checks are release gates.
- V4.07.56 Settings/Help browser profiles and the dedicated Golden contract are release gates.
- Both Dashboard and Integration complete browser suites have been exercised against the accepted V4.07.56 baseline.
- HACS integration validation, package contract, Hassfest and Home Assistant 2026.9.0 runtime tests are part of the final gate set.
- Do not use deprecated `device_tracker.see`.
- Do not rewrite Blitzortung ConfigEntries.
- Do not manipulate `.storage` or private/undocumented Home Assistant frontend APIs.
- Keep native and Dashboard tracker IDs distinct.
- Do not claim lightning-data-region synchronization merely because the Gewitterradar tracker or map moved; Blitzortung controls its own movement threshold and subscription lifecycle.
- Keep V4.06 immutable as the public fallback until V4.07.56 is promoted, revalidated on `main` and released.

### Promotion state

- The exact accepted V4.07.56 frontend is synchronized into the canonical product repository.
- The PRE-MERGE snapshot of the existing `main` has been created and retained outside GitHub according to the promotion audit.
- A Golden Master must only be generated from the fully tested **post-merge `main`** commit, never from this candidate branch or from the PRE-MERGE snapshot.
- `main` remains unchanged until explicit user approval.
- After promotion, all relevant release gates must run again on the actual new `main` commit before tagging or publishing.

### External environment checks kept separate

The following items concern the separately installed Blitzortung integration or special network environments and are not falsely reported as already completed product acceptance:

- real small/large reference-location movement and Blitzortung data-region resubscription behavior;
- real resubscription latency and restart/restore behavior with a configured Blitzortung `Location entity`;
- Recorder/database effects of repeated location changes;
- real DNS-filter, proxy, TLS-inspection or segmented-network verification where such an environment is available.

Whether these environment checks are mandatory before the public release or remain documented follow-up work is a separate release decision.

### Historical V4.07.31 consolidation point

V4.07.31 remains preserved as an important historical Near-Final point, but it is no longer the current candidate.

- Main JavaScript: **1,779,464 bytes**, SHA256 `2d13746361d52af29be279f0c273d7fc3ca381a531a82f26efe8c82f3a871b31`.
- External locale module: **401,387 bytes**, SHA256 `898182f61b59682cd34607219018437999081b67e171e7f8955df454ec3d7ccb`.
- GitHub Actions complete artifact `v407-test31-complete`: **2,238,710 bytes**, artifact ZIP SHA256 `91f4e615029040c1f01498355071871c693c771c5bf9d82efadc1586cf9d6917`.
- V4.07.31 completed the four dialect Help variants and the 19-variant Help schema regression.
- Detailed historical notes remain in `docs/RELEASE_NOTES_V4_07_31_TEST.md` and `docs/RELEASE_NOTES_V4_07_TEST.md`.

Detailed V4.07.56 final-candidate notes are recorded in `docs/RELEASE_NOTES_V4_07_56.md`.

## 2026/09 — V4.06 / native integration 0.18.0

### Added

- Add the localized premium Help & Notes dialog for **15 languages plus 4 dialect variants (19 variants total)**.
- Reuse the approved Settings signature in the Welcome footer and add the final release stamp `2026/09 · V4.06 · Gewitterradar · by CK`.
- Add `2026/09 · V4.06` to the lower-left Settings area and to the Release History header.
- Complete the visible Release History with V4.06 and the previously missing V4.05, and add `YYYY/MM` to all published history entries.
- Add `V4.07 · PLANNED — Worldwide location search` as the next planned development topic without presenting it as shipped functionality.
- Add dedicated V4.06 project history, milestone tracking, Recorder locale audit, binding release-process documentation and release notes.

### Improved

- Refine Settings/About premium hierarchy, localized About headers and language-onboarding readability.
- Strengthen the metallic gold frames and controlled shimmer in Settings and Help while preserving the accepted dark premium appearance.
- Harmonize the premium close control across Settings, Help and About using the approved close artwork and keep 44×44 interaction targets.
- Reuse the approved scroll artwork for Recorder YAML copy actions.
- Reuse the Welcome gear geometry/material in the Main view and Help, with device-independent rendering.
- Normalize Help icon alignment across Desktop, Android, iPad and iPad Pro; enlarge the prerequisites/home symbol for clearer balance.
- Keep the two premium Settings entry buttons side by side on mobile portrait where the available width permits it.
- Refine About accordion chevron placement and premium section hierarchy.
- Tune the German mobile-portrait dedication layout without changing other device layouts.
- Enlarge the Welcome radius value badges (`70 KM`, `30 KM`, `5 KM`) by about 25% and vertically center them with their respective rows.
- Align Welcome footer controls, signature, gear and version information for Desktop, Android and tablet layouts.
- Increase the personal signature presence on Android/mobile while preserving the exact approved signature artwork.
- Derive the visible `YYYY/MM` release stamp from the canonical `GEWITTERRADAR_BUILD` metadata instead of maintaining separate date strings.

### Fixed

- Fix iPad/iPad Pro WebKit focus artifacts around the About close control and around the reopened About dialog without changing the approved premium X asset.
- Keep the Welcome footer version line visible and footnote-like on iPad/iPad Pro.
- Fix the Greek About header on mobile portrait by letting the claim flow below the longer Greek subtitle instead of overlapping it; the Greek translation remains unchanged.
- Replace fixed Recorder sensor IDs with multi-device wildcard patterns.
- Restore V4.05 to the visible Release History so the public V4.00–V4.06 sequence is complete.

### Delivery and validation

- Version the dashboard helper package as `app_gewitterradar_v4_06_pkg.yaml` and verify its global language marker.
- Build the shared frontend, lazy locale module, assets and package deterministically into both delivery forms.
- Keep dashboard and native-integration frontend payloads byte-identical.
- Extend browser regression coverage across Desktop, iPad, iPad Pro, Android portrait and Android landscape for both delivery forms, including the Greek mobile-portrait header flow.
- Add dedicated browser checks for the final `YYYY/MM` release stamps and Release History chronology.
- Complete the real Android portrait acceptance of the Greek header-flow correction.
- Audit Recorder guidance across all 19 registered language variants: four current wildcard sources, existing-`recorder:` merge guidance, live-state behavior, historical-data behavior, multi-device semantics and localized copy texts.
- Add `scripts/test-recorder-locales.mjs` as a fail-closed CI gate against incomplete Recorder guidance or legacy fixed `sensor.home_lightning_*` Recorder IDs.
- Add a binding per-release chronology checklist in `docs/RELEASE_PROCESS.md` and mirror the rule in `PROJECT_DEFAULTS.md`.
- Validate Home Assistant runtime behavior, HACS, Hassfest, package contracts and deterministic frontend reconstruction independently before the final freeze.

## Shared V4.05 frontend and premium controls

- Import the frozen V4.05 frontend once into `frontend/`; derive integration and dashboard payloads with exact SHA-256 parity and a fail-closed approved-delta guard.
- Use the supplied transparent close/copy artwork while preserving all dialog and clipboard handlers, 44×44 hit targets, content and layout. Remove only the visible `DEV` label.
- Serve the integration-local payload using supported asynchronous HTTP static registration; resource registration remains manual.
- Add both-delivery browser coverage, frozen-reference comparison and native HTTP route tests.

## 0.17.0 — release-candidate preparation

Initial native Home Assistant integration release line.

### Added

- UI Config Flow with a single Config Entry.
- Persistent settings backed by `ConfigEntry.options`.
- Typed per-entry runtime state.
- 16 native configuration entities: 4 Selects, 5 Numbers and 7 Switches.
- Validation for configuration values and ordered observation/storm/danger radii.
- Dynamic `person.*` and `zone.*` reference-location choices.
- One-time, native-wins, non-destructive migration from supported legacy `lightning_detection_*` helpers.
- Package/helper-free fresh-install path.
- Documented unload/re-enable, deletion and rollback semantics.
- Integration-local Home Assistant brand icons.
- GPL-3.0-only software/documentation licensing with separate reserved branding policy.
- HACS Integration, Hassfest, deterministic package and Home Assistant runtime validation workflows.

### Fixed during public real-install validation

- Reclassified the Config Entry from Home Assistant `helper` to `service`. The 2026 frontend Integrations dashboard intentionally filters helper Config Entries out, which made a correctly loaded Gewitterradar entry appear to have disappeared after installation/restart.
- Replaced the direct `async_write_ha_state()` call in the dynamic reference-location listener with Home Assistant's thread-safe `schedule_update_ha_state()` path. This addresses the real-install `RuntimeError` reported when a location add/remove callback was dispatched outside the event loop.
- Added regression coverage for the user-visible integration classification and the thread-safe dynamic-location callback.
- Recorded the first real HACS installation findings and separated current-integration defects from historical Entity Registry/HACS leftovers.

### Real-install evidence

- Public HACS repository installation completed successfully.
- Config Entry reached `loaded` state.
- All 16 native configuration entities were present.
- Configuration values persisted unchanged across a full Home Assistant restart.
- HACS repository state changed from `pending-restart` to `installed` after the full restart.
- Public HACS repository validation passes all 9 checks.

### Compatibility

- Designed to coexist with the frozen Gewitterradar V4.04 Dashboard/Card migration baseline.
- Dashboard/Card distribution remains separate at `TheDaimos/gewitterradar-dashboard`.
- The Blitzortung.org Home Assistant integration remains the live lightning-event data source used by the Dashboard.

### Known limitation

- Historical `device_tracker.*` reference selections are not automatically migrated.
- Historical unavailable Entity Registry entries and stale HACS update entities are intentionally not deleted automatically by the native integration.

### Historical release-candidate gates

The following gates belonged to the earlier 0.17.0 candidate phase and are retained as historical evidence:

- HACS update to the corrected real-install candidate;
- full-restart verification that Gewitterradar remains visible under Devices & services → Integrations;
- trigger/re-check dynamic `person.*` / `zone.*` changes with no thread-safety error;
- real HACS rollback and re-update proof;
- final Android/iPad frontend spot checks, including Android last-compass persistence.


### V4.10.02 DEV R16P1 – DRA/CI parity acceptance
- Added `custom_components/gewitterradar/dra-deployment-provenance.json` as a DRA-managed provenance record for the R16 real fit-matrix acceptance path.
- Records the 28 × 18 = 504 expected fit matrix and `ci-offline-r16-parity` provenance without changing runtime fit behavior or automatically applying calibration data.


### V4.10.02 DEV R17 – Fit-Matrix Real/CI-Parität
- Erste reale 504er-FIT-JSON vollständig ausgewertet; 28 Medaillons, 18 Pfeile und 504 Fit-Schlüssel vorhanden.
- Reale R16-Matrix wegen R12-Provenance, 25/28 LOW-Confidence-Augenprofilen und massiver CI-Abweichung ausdrücklich nicht als Produktkalibrierung freigegeben.
- Browser- und CI-Augenmessung auf denselben neutralen Runtime-Asset-Seed `runtime-asset-center-parity-v1` vereinheitlicht.
- Seed-Radius als `87/264` der Runtime-Assetbreite festgelegt und im Export nachvollziehbar gemacht.
- HA/WebView-Provenance `ha-webview-r17-parity` ergänzt.
- Loader übergibt Build-/Versionsidentität explizit an den Modulkontext.
- FIT-MATRIX blockiert bei Loader-/Manifest-Mischstand statt eine falsch zuordenbare Matrix zu erzeugen.
- Keine automatische Anwendung von Fit-Ratios auf die Produktdarstellung.


### V4.10.02 DEV R18 – identischer Real-/CI-Augenalgorithmus
- Reale R17-FIT-JSON vollständig ausgewertet: 28 Medaillons, 18 Pfeile, 504/504 Fits.
- R17-Provenienz ist korrekt, Real-/CI-Parität aber weiterhin klar verfehlt.
- Root Cause auf unterschiedliche Augenalgorithmen eingegrenzt: HA/WebView `radial-color-edge-ellipse-v1` vs. CI `first-consistent-eye-ring-ellipse-v2`.
- CI-v2-Algorithmus 1:1 in die HA/WebView-Diagnose portiert.
- Suchbereich auf identische 18–36 % vereinheitlicht.
- Diagnosemodul auf 1.3.0, Medaillon-Designmodul auf 1.2.2 und Manifest auf 1.2.23 angehoben.
- Build `V4.10.02-MODULAR-DEV-R18-2026-09-27`, Modulsatz `A84D-29F7`.
- 14/14 CI-Prüfungen erfolgreich.
- Keine automatische Anwendung von Fit-Ratios auf die Produktdarstellung.


### V4.10.02 DEV R18 – Real-/CI-Fit-Parität bestanden
- Neue reale R18-Matrix vollständig ausgewertet: 28 Medaillons, 18 Pfeile, 504/504 Fits.
- 28/28 Augenprofile geometrisch exakt identisch zum CI-R18-Artefakt.
- Pfeilprofile identisch bis auf IEEE-754-Rundung im Bereich ~1e-14 px.
- Alle produktrelevanten 504 Fit-Metriken stimmen bis auf Maschinenrundung überein.
- Confidence real und CI: 26 HIGH / 2 MEDIUM.
- Scale real und CI: 0.4845504–0.9924283, Mittel 0.7065788.
- 504/504 Kombinationen überschreiten bei der bisherigen einheitlichen Pfeilgröße den 4-%-Sicherheitsbereich.
- Abweichende `worstAngleDeg`-Tie-Winkel bei 122 Kombinationen als numerisch gleichwertig und nicht produktrelevant klassifiziert.
- R18 Real-/CI-Parität technisch freigegeben.
- Produktive paarweise Pfeilskalierung bleibt separat und weiterhin deaktiviert.


### V4.10.02 DEV R18 – Real-/CI-Parität abgenommen
- Reale R18-FIT-Matrix vollständig mit dem CI-R18-Artefakt verglichen.
- 28/28 Medaillonprofile numerisch identisch.
- 504/504 Fits fachlich identisch; maximale Scale-Abweichung 3.33e-16.
- R18 Real-/CI-Parität bestanden.
- Worst-Angle-Abweichungen bei Gleichständen als numerisch unkritisch klassifiziert.
- Automatische Produktanwendung der Fit-Skalierung bleibt weiterhin gesperrt und benötigt eine getrennte Kalibrierungsfreigabe.


### V4.10.02 DEV R19 – Augenreferenz + visuelle Pfeilkalibrierung
- R18 Real-/CI-Parität als technische Grundlage beibehalten.
- Fit-Geometrie auf Schema `gewitterradar.medallion-arrow-geometry.v2` erweitert.
- Pfeil-Platzierung und tatsächlichen CSS-Rotationsursprung (`50% 50%`) getrennt.
- Fit-Matrix berechnet jetzt zusätzlich zentrierte Ratio und empfohlenes Pfeilzentrum X/Y.
- Pro Medaillon einen eigenen, manuell abnehmbaren Referenzkreis eingeführt: Mittelpunkt X/Y + Radius/Durchmesser.
- Gelben Referenzkreis im Picker direkt verschiebbar gemacht; Radius zusätzlich per Griff oder Regler einstellbar.
- Automatisch erkannte Augenellipse bleibt als Vergleichsdiagnose sichtbar.
- Nur abgenommene Referenzkreise ersetzen die automatische Ellipse in der 504er-Matrix.
- Änderung einer Augenreferenz invalidiert die 18 abhängigen Paar-Fits und hebt deren Sichtabnahme auf.
- AUGE-JSON für alle 28 Referenzkreise ergänzt.
- Paarweise Kalibrierung für Größe und Mittelpunkt X/Y mit AUTO/BASIS/ABNEHMEN/RESET/NÄCHSTER OFFEN beibehalten.
- KAL-JSON enthält zusätzlich die Medaillon-Augenreferenzen.
- Keine automatische Übernahme der Kalibrierung in die produktive Pfeildarstellung.

### V4.10.02 DEV R19 – Augen-Referenzkreis und manuelle Pfeilkalibrierung dokumentiert
- Automatische Augenellipse und fachlich abnehmbaren Referenzkreis als getrennte Diagnoseebenen dokumentiert.
- Direkte Kreisverschiebung, Radiusgriff und X/Y/Radius-Regler beschrieben.
- 4-%-Sicherheitsbereich als verbindliche Fit-Grenze nach Auswahl der aktiven Augenreferenz dokumentiert.
- Pfeil-Platzierung und tatsächlichen CSS-Rotationsursprung getrennt beschrieben.
- Automatisch empfohlenes und manuell korrigierbares Pfeilzentrum X/Y dokumentiert.
- Manuelle Pfeilgröße, AUTO/BASIS/ABNEHMEN/RESET/NÄCHSTER-OFFEN und persistente Paarwerte dokumentiert.
- Fit-Invalidierung nach Änderung einer abgenommenen Augenreferenz dokumentiert.
- AUGE-JSON, FIT-JSON und KAL-JSON/KAL-CSV samt Provenienz-/Abnahmeanforderungen dokumentiert.
- Querverweise in Geometriedatenbank, Katalog, Modularchitektur und README ergänzt.
- Projektneutrale Erkenntnisse parallel in `TheDaimos/home-assistant-dev-toolkit` übernommen.


### V4.10.02 DEV R20 – Medaillon-Diagnose kompakter
- Medaillon-Diagnose in vier einklappbare Akkordeonbereiche gegliedert.
- Bereiche: Darstellung/Testzustand, Augen-Referenzkreis, Pfeilgröße/Mittelpunkt sowie Fit-Matrix/Export.
- Beim ersten Öffnen sind alle Bereiche eingeklappt; maximal ein Bereich bleibt gleichzeitig geöffnet.
- Der zuletzt geöffnete Bereich wird für die laufende Browsersitzung gespeichert.
- Mess-, Fit- und Kalibrierungslogik aus R19 bleibt unverändert; keine automatische Produkt-Skalierung.
- Build `V4.10.02-MODULAR-DEV-R20-2026-09-28`, Modul-Set `D31A-5E90`.
- Finaler Kandidat `372ae36d27b5ac503fd9ab37c7542d4284575ac9` vollständig geprüft und über `deploy/dev` bereitgestellt.
