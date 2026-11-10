# Eye Neon WOW Studio – optionale Erweiterung über V177

10.11.2026 · `TheDaimos/gewitterradar@deploy/dev`.

Basis: `44298fc34cf881657855a99b5a5941edb67ca929` (Dokumentation plus unveränderte Runtime177).
Geschützte Referenz: GR4.11.177 / HA0.25.84 /411177r2 /E411-177A2,
Releasecommit `2a644f206483ca696482a0b8f2396b264e7b040a`.
Das [Referenzdokument](GR_DEV_REFERENCE_4_11_177_2026-11-10.md) bleibt unverändert.
Neue Lieferung: **GR4.11.178 DEV / HA0.25.85 /411178r1 /E411-178A1**.
178 wird dadurch nicht zur geschützten Referenz erklärt.

## Referenzschutz und Nullmodus

`eye-neon.js` behält seinen vollständigen V177-Zeichenweg: Filamentgeometrie,
Phasen, Lichtperlen, Farben, Halo, Static, Statusfading, LOD und Lifecycle.
Lediglich die automatisch erzeugte Import-Cachekennung des erweiterten
Konfigurationsmodells ändert sich. Ein Source-Guard vergleicht den gesamten
ursprünglichen Code nach Entfernung der Import-Querykennungen mit177.

Die additive Klasse `EyeNeonWow` in `eye-neon-wow.js` ruft den originalen
Zeichenweg auf und zeichnet bei Bedarf auf eine separate transparente Fläche
unter dem unveränderten Eye-Master. Es gibt keine neue Wetter-/Windengine und
keinen zweiten Frame-Scheduler. Bei drei Lichtreglern auf0 wird kein
Zusatzcanvas, Halo-/Geometriepuffer oder Brückenzustand angelegt. Nur ein
Nullwert-Branch verbleibt im Wrapper; kein zusätzliches Zeichnen oder Ticket.
Schattierungsumfang wirkt ausschließlich auf den bereits vorhandenen CSS-Hintergrund.

Automatisierter Vergleich mit dem tatsächlich aus Git geladenen V177-Quellbaum:
je Ansicht36 nichtleere, deterministische Pixelvergleiche – Eye42/126px,
Static/Living,1/2/4 Farben, Zeitpunkte10s,10s+1/30s und123,4s.
Identische Renderparameter und Sichtbarkeits-/Detailzustände. Keine leeren
Vergleichsflächen, keine deaktivierte Aura. Ein Restore ändert ausschließlich
die vier neuen Werte; alle alten Konfigurationsfelder werden tief verglichen.

## Konfiguration und Bedienung

Bestehender Storage-Key `gewitterradar:eye-bubble:v1`, defensiv additiv erweitert:

| Feld | Anzeige DE / EN | Bereich / Standard |
|---|---|---|
| `neonBrilliance` | Neon-Brillanz / Neon brilliance |0–100 /0|
| `neonBloom` | Bloom / Halo-Stärke / Bloom / halo strength |0–100 /0|
| `neonOrganics` | Organik / Verflechtung / Organics / interweaving |0–100 /0|
| `backdropExtent` | Schattierungsumfang / Shading extent |0–100 /0|

Fehlende oder nichtendliche Werte fallen auf0 zurück, Zahlen werden begrenzt.
Slider verwenden Schritt1. Keine Migration alter Werte oder Farbspeicherung.
Bestehende Intensität, Helligkeit, Kontrastschattierung, Größen und Slots bleiben
unabhängig. Die zentrale bestehende Normalize/Patch/Persistenzkette wird verwendet.

Der neue Abschnitt **Neon-Studio** nutzt die vorhandene Premium-Details-/Chevron-
Komponente einschließlich Animation, Tastaturbedienung und gespeichertem Klappzustand.
DE/EN-Texte nutzen den bestehenden Sprachresolver. Der Premium-Button
**V4.11.177-Optik wiederherstellen** setzt nur diese vier Felder zurück; globale
Standardwiederherstellung bleibt separat. Beide Vorschauen behalten ihre Simulation
ohne reale Wetteraktivierung. Regleränderungen aktualisieren sofort Karte/Vorschau.

## Lichtarchitektur

### Brillanz

Zusätzliche gesättigte Farbkörper folgen den tatsächlich berechneten ursprünglichen
Filamentpunkten. Darüber liegen sehr schmale weißliche Kerne. Zusätzliche lokal
gebundene Gradient-Sprites verstärken die wandernden Lichtperlen. Keine globale
Aufhellung der Karte und kein Umfärben der Originalgrafik. Die bestehende
Aura-Helligkeit bleibt der gemeinsame Helligkeitsbezug; der neue Regler erhöht
die zusätzliche Leuchtstruktur, nicht die Basisparameter.

### Bloom

Eine niedrig aufgelöste farbige Lichtmaske enthält die tatsächlichen Filamente,
Zusatzperlen, Brücken und Transfersegmente. Drei lokale Blur-Kompositionen
(weite, mittlere und enge Streuung) bilden einen eigenen farbigen Halo-Puffer.
Dieser wird hinter die scharfen Zusatzfäden komponiert. Keine Filter auf Eye-PNG,
Wetterflächen oder einem globalen Elterncontainer.

Die Maske und der Bloomcache sind auf256² begrenzt, die Zusatzfläche auf640².
Teure Bloom-Komposition wird bei Bedarf bzw. nach120/180/240ms erneuert;
Konfigurations-/Farb-/Statusänderungen invalidieren sie direkt. Breiter diffuser
Bloom darf langsamer aktualisieren als Lichtkerne und Perlen. DPR erhöht nur die
begrenzt interne Pixelauflösung; er schaltet keine Farbe oder Halos ab.

### Organik und Zusatzfilamente

Bis zu sechs zusätzliche stabile Filamentidentitäten je Farbe verwenden dieselbe
kohärente Geometriefunktion mit eigenen Seeds. Geschützte Basisarrays werden
nicht verändert. Weitere fadenassoziierte Perlen und Impulsketten folgen diesen
und den ursprünglichen Bahnen. Die Zusatzdichte skaliert kontinuierlich mit dem
Regler und dem optionalen Detailbudget, ohne Winddaten anzufassen.

### Energiebrücken und Farbtransfer

Eine begrenzte Winkelnachbarsuche prüft drei vorhandene Basisfilamente je
beteiligter Farbe, jeden achten Stützpunkt und fünf benachbarte Zielpunkte.
Kein unbeschränktes All-pairs-Verfahren. Bei tatsächlicher Nähe (höchstens
8–19 visuelle Koordinateneinheiten abhängig vom Organikwert) entsteht ein
zeitlich stabiler Kontakt. Gleichfarbige Paare sind ausgeschlossen.

Kontaktzustände behalten Quell-/Zielfilament, Winkel, Seed, Richtung, Start und
Lebensdauer. Höchstens zwölf Brücken pro Fläche, unter Last weniger. Gebogene
quadratische Verbindungen folgen den jeweils aktuellen realen Filamentpunkten;
öffnen sich die Kontakte zu weit, klingt die Verbindung aus. Weiche Hüllkurven
vermeiden harte Blitze. Eine Quellperle läuft über die Brücke. Danach läuft ein
begrenzter Abschnitt in Quellfarbe auf dem unveränderten Zielpfad und klingt
innerhalb der etwa3,8–5,1s Kontaktlebensdauer wieder ab.

Die ursprüngliche Zielfarbe bleibt darunter gezeichnet. Kein Schreiben in
Funktionsfarben, Slots, Storage oder Wetterstatus. Beide Transferrichtungen
werden erzeugt. Zwei Farben Wind/Niederschlag reichen; Temperatur ist keine
Voraussetzung. Bei Layerabschaltung klingen betroffene Kontakte ab. Organik0
entfernt den Zusatzpfad, Static/Reduced Motion erlauben keine dynamische Kopplung.

## Schattierungsumfang

Die bestehende radiale CSS-Schattierung bleibt unverändert. Ihr Durchmesser ist
`size*1.45 + size*0.020*backdropExtent`:0 exakt V177,100 etwa2,38-facher
Referenzdurchmesser. Der alte `backdrop`-Regler bestimmt weiterhin ausschließlich
die Deckkraft; bei0 bleibt die gesamte Schattierung transparent.

Alle Flächen bleiben `pointer-events:none`, unter Eye/Neon und außerhalb der
Touchzielgeometrie. Größere visuelle Ränder werden bei der In-Memory-Positionierung
berücksichtigt, auf den sichtbaren Kartenbereich begrenzt; gespeicherte Positionen
bleiben erhalten. Die Vorschau skaliert die gemeinsame Szene passend zu Glow und
Schattierung. Im lokalen visuellen Abgleich wurde eine zunächst übergroße
Schattenausdehnung reduziert, damit der Eye-Mittelpunkt auch bei100% lesbar bleibt.

## Performance und Lebenszyklus

Die vorhandene Frame-Clock steuert weiterhin genau ein Eye-Ticket. Unsichtbare
Flächen, geschlossenes/minimiertes Menü, Aura AUS, Gruppierung AUS, Blur/Hidden,
Reduced Motion und Entfernen behalten den V177-Lebenszyklus. Die Zusatzpuffer
werden bei Nullstellung/Entfernen freigegeben. Static hat keine Animationsschleife.

Das Zusatzbudget reagiert auf seine eigene gemessene CPU-EMA früher als die
geschützte Basis-LOD: Detailabbau ab anhaltenden3,5ms, frühestens nach0,6s;
Erholung nach mindestens5s guter Last. Reduziert werden zusätzliche Brücken,
Perlen und Filamente sowie Bloom-Cachehäufigkeit. Benutzerwerte bleiben gespeichert.
Die additive CPU-Zeit wird aus der Basis-Kosten-EMA herausgerechnet; echte globale
Frameintervalle bleiben jedoch reale Lastindikatoren. Maximalstellung ist bewusst
teurer als177 und keine kostenlose Geräte-FPS-Garantie.

Diagnose je Fläche: CPU aktuell/Mittel/Maximum, zusätzliche Filamente/Perlen,
Brücken, Transferanzahl, Qualitätsstufe, Canvas-/Sprite-/Geometriebytes und Zeit.
Die Basismetriken bleiben separat verfügbar. Keine Wetteranfrage durch Effekte.

## Gezielte Prüfungen und visueller Befund

`test-eye-wow-model.mjs`: Defaults/Grenzen, Storage-Kompatibilität, unabhängige
Schattierung und vollständiger V177-Source-Guard einschließlich vier Snake-Modulen,
Frame-Clock, Navigation, Schnellmenü und Niederschlagslayer.

`test-eye-wow-browser.cjs`: vollständiger registrierter GR-/Leaflet-Modulbaum;
V177-Pixelreferenz,0/25/50/75/100 je Lichtregler und Schattierungsumfang,
alle acht geforderten Effektkombinationen, tatsächliche Brücken und bewegte
Endpunkte, sichtbare Transferphasen, unveränderte Farbdaten, kontrolliertes
Verschwinden, Static-Pixelgleichheit, Regler über echte Tastaturbedienung,
Premium-Klappen, Restore, Reload, Reduced Motion und Wind-/Vorschaulast.

Zusätzlich unverändert die vorhandenen Eye-Gesten-/Größen-/Schnellmenü- und
organischen177-Regressionen. Keine wissenschaftliche Wettertestkampagne.

Lokale tatsächliche Bildartefakte liegen unter `C:/Git/Work/Temp/gr-eye-wow-178/`:
`desktop-reference.png`, `desktop-max-light.png`, `desktop-maximum.png`, entsprechende
Android-/iPad-Ansichten und `acceptance.json`. Referenz/Maximal-Lichtbilder werden
auf demselben dunklen Grund und zu deterministischen Zeiten erzeugt. Die echten
UI-Bilder zeigen den unveränderten Master mit Vorschau und weicher Bühne.
Der beigefügte Betreiber-Screenshot bleibt Stilreferenz, kein Runtime-Asset.
Keine Benutzeraufnahme wird ins öffentliche Repository übernommen.

Der lokale Sichtvergleich zeigt eine eindeutig höhere Farbkörperdichte, helle
Kerne, punktreiche Zusatzstruktur und weit stärkeren farbigen Bloom. Türkis/Pink
bleiben getrennt erkennbar; der Originalmaster wird nicht gefiltert. Die
Maximalstellung ist bewusst sehr dicht und kräftig. Die endgültige ästhetische
Bewertung auf realen Endgeräten bleibt beim Betreiber.

## Betroffene Dateien und Lieferung

- `eye-neon-wow.js`: optionale additive Lichtschicht.
- `eye-hub-model.js`: vier kompatible Felder, rein visuelle Zusatzgrenzen.
- `eye-hub-view.js`: Studio, bestehende Premium-Klappen, Restore und Schattenmaß.
- `eye-hub.js`: additive Rendererklasse und größere visuelle Positionierungsgrenzen.
- `eye-hub-locales.js`: DE/EN.
- Release-Importkennungen, Version/Modul-/Runtime-/HA-Metadaten und DRA-Provenienz;
  bytegleiche erzeugte HA-/Dashboard-Kopien und SHA256-Liste.
- Buildinventar um ein UI-Hilfsmodul ergänzt; neue gezielte Tests und bestehender
  öffentlicher Eye-CI-Job erweitert. Kein anderer Prüfpfad deaktiviert.

Öffentliche CI, finale SHAs, Paketprüfsummen und Messwerte werden nach dem
Prüflauf in den folgenden Nachweisabschnitten festgehalten. Auslieferung über
den bestehenden Kanal `TheDaimos/gewitterradar@deploy/dev`, unveränderte
Projekt-/Kanaldateien. Keine automatische Installation, keine Änderung an PROD.

**Offen:** physische Android-/iPad-/WebKit-/HA-Companion-/VM109-Abnahme,
Langzeitlast und subjektive Betreiberfreigabe. Emulation und kurze RAF-/CPU-
Messungen sind keine physischen Geräte-FPS oder vollständige GPU-Messungen.

## Tatsächlich durchgeführter lokaler Fünf-Ansichten-Lauf

Windows/Chrome-Emulation, kurze1,6s-RAF-Fenster. Jede Ansicht36 exakte V177-Pixelvergleiche: insgesamt180. Alle neuen Prüfungen bestanden. Werte sind Intervallzeiten in ms, keine garantierten Geräte-FPS. Nullmessung erfolgte nach Maximalbetrieb innerhalb derselben Sitzung; adaptive Basiszustände können noch nachwirken.

|Ansicht|Null p50/p95|Max Karte p50/p95|Max Vorschau p50/p95|Zusatz-JS Karte Mittel/Max|Zusatzcanvas+Masken Bytes|Brücken Karte|
|---|---|---|---|---|---|---|
|desktop|18.0/36.1|18.2/53.9|54.1/106.4|3.30/9.00|1008704|6|
|desktop-hidpi|18.1/53.7|35.0/54.0|53.0/88.9|3.19/8.90|1614224|6|
|android|17.8/18.7|17.7/35.2|18.0/52.5|3.32/7.30|2162688|10|
|android-landscape|17.6/18.2|17.8/35.7|17.9/35.0|3.03/7.00|2162688|6|
|ipad|17.9/18.8|35.8/73.0|17.8/54.0|3.41/6.30|2162688|9|

Diese Maximaltests zeigen reale zusätzliche Last. Die höhere Detailfülle ist optional; Zusatz-LOD wurde in den Ansichten aktiv. Keine Behauptung unveränderter FPS bei100/100/100. Der Nullmodus besitzt weiterhin keine Zusatzpuffer und pixelidentischen V177-Zeichenweg.

## Implementierung und deterministische Installationspakete

Implementierungscommit: `2053211a8f4235e92dc8e3a9650cbfdecfcace53`.

- `gewitterradar-0.25.85-dev.zip`: SHA256 `97c40e619b0586cf88061659a0dcdf465b694af64cc2df16da809baf795af8fd`
- `gewitterradar-dashboard-4.11.178-dev.zip`: SHA256 `74821802fca124a443a873986939bdbb5a9db38fc705fc5b84da22b9691e607e`

HA-/Dashboard-ZIPs aus committed Git-Baum, CRC und jede enthaltene UI-/WOW-Quelle mit kanonischen UTF-8-Dateien verglichen. Deployment-Metadaten nennen den finalen Bericht-/Releasecommit; ZIP-Nutzdaten bleiben über reine Berichtsnachträge identisch.
