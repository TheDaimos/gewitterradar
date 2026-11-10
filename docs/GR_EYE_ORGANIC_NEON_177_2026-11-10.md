# Organische Eye-Neon-Aura und gezielte UI-Reparaturen – 177

10.11.2026 · `TheDaimos/gewitterradar@deploy/dev`.
Basis: `7ece8f0b9a6a5896fa372f264ad34fde9a781abf` (geschützte Runtime176 plus Referenzdokument).
Geschütztes Release176: `58cad1d2920f6d7035d95878f3df3e438b0eec67`.
Neue Lieferung: **GR 4.11.177 DEV / HA 0.25.84 / 411177r2 / E411-177A2**.
Diese Veröffentlichung erklärt177 ausdrücklich **nicht** zur neuen geschützten Referenz.

## Vorher/Nachher und visuelle Grundlage

Die beigefügte Abbildung mit den zwei Modi wurde als tatsächliche Stilreferenz
verwendet: oben ruhige kräftige Neonringe; unten eine viel feinere, punkt- und
faserreiche zusammenhängende Lichtstruktur. Sie ist kein Runtime-Asset. Die
genannten Videos77688/77689 waren in diesem Auftrag nicht als lesbare lokale
Dateien zugänglich; ihre im Auftrag dokumentierten Betreiberbefunde wurden
berücksichtigt. Keine eigene Analyse dieser Benutzer-Videos wird behauptet.

176 erzeugte je Farbe eine sinusförmig verformte SVG-Kreislinie und zwei
Impulsabschnitte. Die pauschale DPR>1,25-Regel nahm gerade HiDPI-Geräten den
Blur-Bloom und reduzierte dessen Opazität auf0,18. Mehrere Alpha-Faktoren
schwächten mittlere Einstellungen zusätzlich. Das erklärt den real gemeldeten
matten Halo, löst aber nicht allein die gesamte visuelle Differenz.

177 verwendet für **beide** Modi eine kleine Canvas-Komponente mit identischer
Farb-/Haloarchitektur auf Karte und in der primären geschlossenen Vorschau.
Original-Eye und Funktionsgrafiken liegen weiterhin separat darüber und bleiben
bytegleich. Kein Video, Referenzbild oder vorgezeichnetes Aura-Overlay wird geladen.

### Feststehend

Slotfeste konzentrische Farbringe mit gesättigtem Farbkörper, feinem hellem Kern,
festen lokalen Glanzabschnitten und weichem farbgleichem Halo. Die Haloebenen
werden in begrenzte Offscreen-Canvaspuffer vorberechnet. Keine Animationsschleife
in diesem Modus. Lokale Laufzeitbilder und ein unveränderter Pixel-Snapshot über
mehrere Zeitpunkte belegen den statischen, weiterhin leuchtenden Zustand.

### Lebend

Jede aktive Funktion besitzt eine Familie stabil identifizierter Filamente.
Ein deterministisches, räumlich kohärentes Noise-Feld deformiert Radien und
tangentiale Lagen. Gemeinsame langsame Familienanteile sorgen für Zusammenhang,
unabhängige Seeds/Phasen für örtliches Verflechten. Es werden keine neuen
Zufallspositionen pro Frame erzeugt. Die Auslenkungen übergreifen Nachbarradien;
die nominalen dünnen Statusanker bleiben separat lesbar.

Geschlossene Pfade verwenden kubische, weich verbundene Kurven. Dazu kommen
kürzere Faserabschnitte, Lichtperlen unterschiedlicher Größe/Helligkeit und kurze
nachlaufende Impulsspuren. Perlen verfolgen die tatsächlich erzeugten jeweiligen
Filamentverläufe, in unterschiedlichen Richtungen und zeitlich stetig. Farben
bleiben getrennte Strukturen; es gibt keine zentrale Ersatz-Mischfarbe und keine
Rotation der Gesamtgrafik. Verflechtung funktioniert bereits mit zwei Farben
ohne Temperatur. Rendergeometrie und Pixelbilder verändern sich tatsächlich;
Kreuzungspositionen zwischen verschiedenen Farben wurden zusätzlich geometrisch
an den für Canvas verwendeten Stützpunkten nachgewiesen.

Repräsentativer DPR3-Vorschaulauf bei vier Farben, 100/100 und großem Eye:
36 gezeichnete Filamente, 792 fadenassoziierte Perlen, 549×549 interne Canvaspixel.
Auf der kleinen Karte reduziert die Größenanpassung insbesondere die Perlenfülle,
durch eine zusätzliche größenabhängige Faden-/Perlenbegrenzung. Es sind keine garantierten festen Zahlen:
Größe, Intensität und gemessene Last bestimmen den Detailumfang.

Bei Statusänderungen bleiben bestehende Farb-/Filamentobjekte, Phasen und
Bildknoten bestehen. Neue/entfernte Farben werden im lebendigen Modus über eine
kurze rein visuelle Sichtbarkeitstransition integriert. Globale Aura-/Gruppierung-
AUS schalten dagegen unmittelbar alles ab. Keine Wetterfunktion wird dafür geändert.

### Helligkeit, Intensität und Lastbudget

Helligkeit ist der gemeinsame, nachvollziehbare Leuchtkraftfaktor; Intensität
steuert Faden-/Perlenfülle, Kern-/Halobreite und Ausdehnung. Kein pauschales
intensity×brightness×mehrere-Elternopazitäten-Abdunkeln. Die günstigen vorberechneten
farbigen Halos bleiben **auf jeder Qualitätsstufe** erhalten, auch bei DPR2/3.

DPR wird nur für die interne Pixelauflösung benutzt (maximal2-fache interne
Auflösung, höchstens640×640 pro Hauptfläche, maximal384×384 je Farbhalopuffer).
Es entscheidet nicht darüber, ob das Gerät leuchten darf. Die Vierfarben-DPR3-
Kartenmessung verwendete316×316 und zusammen ca.1,60MB Farbpuffer.

Adaptive Detailstufen reagieren auf gemessene CPU-/Frameabstände. Nachhaltige
Last wird erst mit Zeitfenster und mindestens3s Wechselabstand reduziert;
anhaltende Erholung erlaubt nach mindestens5s eine Wiederanhebung. Details werden
zeitlich geglättet, zusätzliche Filamente sanft eingeblendet. Reduziert werden
Mikrodetails und Updatefrequenz (33/42/55ms Mindestabstand), **nie der Grundhalo**.
Alle Filament-IDs und Wetter-/Windparameter bleiben erhalten. Typische Geometrie-
puffer sind fest begrenzte TypedArrays, keine ständig anwachsenden Historien.

Weiterhin genau ein Eye-Ticket im vorhandenen `frame-clock.js`, keine zweite
native Wetter-/Wind-Frameengine. Static, Reduced Motion, Hidden, Blur/Pagehide,
unsichtbare Flächen, Aura AUS, Gruppierung AUS und Unmount stoppen das Ticket.
Reduced Motion zeichnet einen hellen statischen Ersatz. Beobachter, Listener,
Canvaspuffer und Ticket werden beim Aushängen freigegeben. Keine Wetteranfrage
aus dem Glow oder der Simulation.

## Tatsächlich belegte UI-Ursachen und Reparaturen

### Dropdown und Observer-Rückkopplung

`_weatherQuickSync()` schrieb unabhängig von Benutzerfokus den gespeicherten
Layer erneut nach `select.value`. Ein reproduzierbarer Test setzt einen noch
nicht bestätigten Wert bei fokussiertem Select und synchronisiert wiederholt:
im alten Pfad wurde er zurückgeschrieben; im neuen bleibt er bis zur bestätigten
Änderung unberührt. Gespeichert wird weiterhin ausschließlich über den bestehenden
`change`-Pfad. Die vier kompakten Bereiche und expliziten Aktivierungsschalter
bleiben erhalten, kein Fachmenü-Redirect/Embedding.

Zusätzlich schrieb QuickSync auch unveränderte Texte, `hidden` und `aria-pressed`
erneut. Der vorhandene MutationObserver konnte dadurch neue Eye-Syncs auslösen,
die wieder QuickSync aufriefen. Diese reale Rückkopplung wurde durch differenzielle
DOM-Zugriffe beseitigt. Der Test prüft nach Beruhigung ausdrücklich die Zahl
weiterer Syncs, nicht nur die Existenz der Optionen.

Native Auswahl wurde per Maus-/Touchöffnung und Tastaturcommit für alle vier
Ebenen geprüft; anschließend wiederholte Status-Syncs und Persistenz. Auf mobilen
Viewports ist dies emulierte Chromium-Bedienung mit Tastaturbestätigung, **kein
physischer Android-/iPad-OS-Auswahldialog**.

### UTF-8

Die vorige Lieferung enthielt tatsächlich beschädigte Rohtextliterale. Das war
ein Fehler im Bearbeitungs-/Kodierungspfad: mehrfache UTF-8/Windows-1252-
Fehlinterpretation, nicht ein Browser-Schriftproblem. Die Rohquellen sind
bereinigt; alle neuen Bearbeitungsschritte lesen/schreiben explizit UTF-8.
Es gibt **keine** Laufzeit-Replacement-Kaskade. Assertions prüfen die begrenzten
deutschen/englischen Menüquellen, angezeigte Texte und tatsächlichen Release-ZIPs
auf Artefakte sowie auf Präzise/Strömungsdichte/Weiß/Türkis/Schlangenförmige.
Bestehende andere Sprachen werden nicht gelöscht; neue Icongrößentexte nutzen
den vorhandenen Deutsch-/Englisch-Resolver mit konsistentem englischem Fallback.

### Icon-Flappen

Die Rückkopplung oben war auch ohne Aura/Gruppierung relevant. Außerdem ersetzte
`_eyeHubSync` das gesamte Eye-Innere bei reinen Statusdetails via `innerHTML`.
Heute bleiben dekodierte Masterbilder stabil; Statusringe, Warnsymbol, Attribute
und Styles werden gezielt aktualisiert. Ein Quellbildwechsel erfolgt nur für die
tatsächlich andere offen/geschlossen-Grafik. Vorschau-Szenen und ihre Buttons
bleiben ebenfalls bestehen. Farbwechsel erneuern keine Slot-Bildzeilen mehr.

Alle fünf Kartenbildknoten bleiben in Tests bei80 aufeinanderfolgenden Status-
Updates je Gruppierungs-/Aura-Kombination identisch. Der Viewer bekommt keine
per-Frame-Funktions-DOM-Neuaufbauten. Damit sind konkrete verursachende Codepfade
beseitigt; dies ersetzt keine Behauptung, jedes Detail des nicht zugänglichen
Benutzervideos real reproduziert zu haben.

## Unabhängige Icongröße25–300%

Neues Eye-Control `Icongröße`, Standard100, eigener kompatibler `iconSize`-Wert
im vorhandenen Schema1/UI-Speicher. Eye-Größe und gespeicherte Positionen bleiben
unangetastet. Der bestehende Eye-Größenbereich/42px=100%-Bezug wird nicht ersetzt.

Motivnormierung aus unveränderten Originaldateien: Alpha>=32, gemessene Motiv-
breiten Wind/Temperatur256 von272px, Niederschlag977 von1254px, WR-Layer1145 von1254px.
47 CSS-Motivpixel bilden100%; CSS-Bildboxen ergeben sich exakt aus Quelle/Motiv.
Der Wert liegt nahe der bisherigen sichtbaren Größe und korrigiert die ungleichen
transparenten Ränder. Dies ist keine rasterisierte oder ausgeschnittene Ersatzgrafik.

Die vier Funktionsicons skalieren in Bubbles und als Einzelicons gleich. Touch-
ziele bleiben mindestens50×50 CSS px; bei300% werden sie150×150. Darstellung und
gespeicherte normierte Position werden mit tatsächlicher Zielgröße umgerechnet,
am Kartenrand begrenzt und bei großen Einzelicons kollisionsarm platziert.
Präsentationspositionen werden nach Kartengröße und Kartenursprung stabil zwischengespeichert, nicht in Benutzer-
Positionsschlüssel zurückgeschrieben. Tatsächliches Drag speichert wie bisher.

Passen acht große Bubbles plus großes Eye nicht gleichzeitig in den Viewport,
bleiben alle Slots erhalten; eine vorübergehend eingeblendete Premium-Seitennavigation
macht alle Bubbles erreichbar. Der Slider bleibt bei300%, keine unsichtbare
Begrenzung und kein dauerhafter Backdrop. Der Test sammelt die erreichbaren IDs
über alle Seiten. Die rechte Vorschau skaliert ihre Szene so, dass ihre belegten
Funktionen im Konfigurator übersichtlich bleiben.

## Gezielte Prüfungen und Schutz

- Modell: Bestandswerte/Palette/Slots, Größen/Touchziele, Motivnormierung,
  deterministische stetige Filamente, Hysterese samt Erholung und UTF-8.
- Bestehender Eye-175-Test: native600-ms-Holds, Tap/Drag, Positionen, beide
  Hauptmenüstile, Originalmaster, Header-/Slot-X, Größen und Kartenränder.
- Bestehender176-Schnellmenütest: alle vier Bereiche, echte Paneprofile,
  Wolkenopacity/Reset/Neuinstanz, Einstellungen, Simulation/Recovery/Reduced Motion.
  Seine SVG-spezifischen Bewegungsaussagen wurden wegen des bewussten Canvas-
  Technologiewechsels durch tatsächliche Canvas-Pixel-/Filament-/Farbprüfungen
  ersetzt, nicht entfernt oder zu bloßen Erreichbarkeitsprüfungen abgeschwächt.
- Neuer177-Test: native Auswahl/Commit-Race, Observer-/Bildknotenstabilität,
  alle Größen25/100/200/300, große Bubble-Seiten, echte Filamentkreuzungen und
  veränderte Kreuzungspositionen, mehrere Pixelzeitpunkte, kräftiger Halo bei
  LOD0/1/2 und DPR1/1,5/2/3, statische Pixelgleichheit, Helligkeitswirkung,
  Reduced Motion und Reload. Zwei Farben ohne Temperatur werden explizit geprüft.
- Fünf Ansichten: Desktop1280×900/DPR1,1920×1080/DPR1,5,
  Android393×851/DPR3,851×393/DPR3 und iPad820×1180/DPR2.
- Im177-Test eigener relativer Lauf gegen **tatsächliche176-Quelldateien** mit
  derselben synthetischen Windquelle und denselben aktiven Schlangeneinstellungen.
- Source-Guards schützen bytegleich insbesondere Schlangenrenderer/-parameter,
  Wind-/Temperaturrenderer und Datenadapter, Niederschlagsrenderer/Consumer,
  Kompass-Halo und `ui/controls.js`. Wolkenkalibrierung, DWD/OPERA/NASA,
  WR-Gültigkeit/Cache/Kachelhandover bleiben unverändert. Kein TEST69.

Die tatsächlichen Laufzeitbilder wurden gegen die beigefügte Stilreferenz
gesichtet, auch mehrere Zeitpunkte. „Lebend“ zeigt nun Fäden, Perlen, kurze
Spuren und örtliches Verflechten statt weniger wabernder Vollkreise; „Feststehend“
bleibt ruhig und kräftig leuchtend. Ein eigener lokaler2,3s-WebM-Clip zeigt die
rohe animierte Corona-Canvasfläche (ohne darüberliegendes separates Eye-Masterbild).
Er ist ein Entwicklungsnachweis, keine Benutzeraufnahme oder Wettervorhersage.
`scripts/preview-organic-eye.cjs` erzeugt diese Vorschau reproduzierbar.

Lokale Arbeitsartefakte: `C:/Git/Work/Temp/gr-eye-organic-177/`, darunter
`android-static.png`, `android-living.png`, `android-living-next.png` und
`android-corona-only.webm`. Keine Benutzerreferenzmedien/Diagnosebilder wurden
in das öffentliche GR-Repository übernommen.

## Dateien und Lieferung

Funktional geändert: `eye-neon.js`, `eye-hub.js`, `eye-hub-model.js`,
`eye-hub-view.js`, `eye-hub-locales.js`, `display-quick.js`, `display-menu.js`
(UI-Resizesynchronisation). Dazu drei zielgerichtete Browser-/Modellprüfungen,
Vorschauskript, ZIP-Prüfung und bestehende fokussierte öffentliche Workflows.
Die üblichen Release-/Modul-/Import-/Runtime-/DRA-Provenienz-/HA-Metadaten,
HA-/Dashboardkopien und SHA256-Dateien werden synchronisiert. Keine neue
registrierte Wetterengine: weiterhin36 registrierte Module und174 Frontenddateien.

DRA bleibt `TheDaimos/gewitterradar@deploy/dev`.
[Installierbares neues DEV-Release](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.11.177-dev).
HA-/Dashboard-ZIPs, `deployment.json`, `SHA256SUMS.txt`; Paket-/Commit-/CI-Nachweise
werden nach Erstellung ergänzt. Alle alten Releases/Referenzen einschließlich176
bleiben erhalten. Nur öffentliche gezielte CI, kein privater WR-Lauf.

**Offen:** echte Android-/iPad-/WebKit-/HA-Companion-/VM109-Abnahme sowie die
subjektive endgültige Betreiberfreigabe der neuen Optik. Die kurzzeitigen lokalen
Chromium-Messungen sind keine garantierten Geräte-FPS oder GPU-Paintmessung.
Insbesondere acht große aktive Farbfamilien sind eine höhere dekorative Last;
LOD reduziert Details/Updatehäufigkeit, hält aber den Halo sichtbar. Keine
automatische Installation auf VM109, niemals eine Änderung an VM101.

## Lokale Abschlussmessung

Je Vergleichsfenster1,2s, identisch aktive synthetische Schlangenwinddarstellung.

| Ansicht | 176 p50/p95 (ms) | 177 p50/p95 (ms) | 177 Eye-JS Mittel/Max (ms) |
| --- | --- | --- | --- |
| desktop / DPR1 | 17.7 / 18.2 | 17.6 / 18.6 | 1.99 / 2.90 |

Die Eye-JS-Spalte umfasst aktive Frames der Prüfsequenz, nicht GPU-Paintzeit. Die vollständige Fünf-Ansichten-Serie wurde lokal geprüft; die CI ergänzt unten einen erneuten vollständigen Lauf auf dem tatsächlich ausgelieferten Quellcommit. Keine Geräte-FPS-Zusage aus kurzen Fenstern.

## Finale Cachekorrektur vor der Erstveröffentlichung

Der Präsentationscache berücksichtigt auch Kartenursprung links/oben, damit ein verschobener Dashboard-Kartenbereich die Icons korrekt mitnimmt. Eine neue Browserassertion verschiebt den tatsächlichen Kartencontainer und prüft die erhaltene relative Iconposition.177 war noch nicht als Release veröffentlicht. Die finale Lieferung verwendet411177r2/E411-177A2, damit kein zwischenzeitlicher r1-Cache weiterverwendet wird. Der überholte öffentliche Lauf wurde abgebrochen; unten zählt nur der neue erfolgreiche Lauf auf dem finalen SHA. Der Buildvalidator prüft nun streng korrespondierende positive rN/AN-Paare statt ausschließlich r1/A1. Das erweitert die Cacheidentität, ohne Versions-/Modulparität zu lockern.
