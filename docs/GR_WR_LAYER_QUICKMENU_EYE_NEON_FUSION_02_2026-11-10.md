# GR-EYE-NEON-FUSION-WR-LAYER-QUICKMENU-02

10.11.2026 Â· ausschlieÃŸlich `TheDaimos/gewitterradar@deploy/dev`.
Basis: `ee7965193475926c192941810ba24e5f0fbda7b9` (GR 4.11.175 / HA 0.25.82).
Neue Lieferung: **GR 4.11.176 DEV / HA 0.25.83 / Runtime 411176r1 / E411-176A1**.

## MenÃ¼fehler und Umsetzung

Die bisherige Layerauswahl bettete bei Wind `_weatherWindOpen({container:...})`
ein und leitete bei Temperatur zu `_weatherTemperatureOpen()` weiter. Beide
Wege wurden im vorhandenen schwebenden WR-DarstellungsmenÃ¼ entfernt. Es gibt
weiterhin nur eine MenÃ¼instanz, ihren bestehenden Drag-/Minimize-/Close-Pfad
und dieselbe gespeicherte Position. Der Header zeigt direkt das unverÃ¤nderte
1254er `gr-weather-display-premium-original.png`. Eye-Master bleiben Eye-Master.

`display-quick.js` kapselt kompakte UI-Metadaten und Bedienung, keine Wetterengine.
Die Layerwahl ist ein reiner UI-Zustand (`quickLayer`), aktiviert keinen Dienst
und bleibt innerhalb des MenÃ¼s. Ein separater Sichtbarkeitsschalter benutzt die
vorhandenen zustÃ¤ndigen Aktionen. Die groÃŸen FachmenÃ¼s bleiben separat erhalten.

| Ebene | TatsÃ¤chliche Schnellregler / Zustand |
| --- | --- |
| Niederschlag | Auto/PrÃ¤zise/Ausgewogen/Weich, vorhandene Transparenz und natÃ¼rlicher WR-Reset |
| Wolken | Nur Original/Ausgewogen, neue unabhÃ¤ngige Transparenz und natÃ¼rlicher WR-Reset |
| Wind | Vier bestehende Modi, acht originale `WIND_COLORS`, Transparenz, StrÃ¶mungsdichte |
| Temperatur | Transparenz der FarbflÃ¤che, vorhandene Farbschemata Premium/Kontrast |

Alle Transparenzanzeigen: **0 % deckend, 100 % unsichtbar**. Weder Auswahl noch
Regler Ã¤ndern meteorologische Werte oder schalten nebenbei eine Wetterebene ein.

### Niederschlag und Wolken: keine neue Kalibrierung

Ein allgemeiner GlÃ¤ttungsdefekt wurde **nicht** nachgewiesen. Die historische
Niederschlagslogik ist unverÃ¤ndert: PrÃ¤zise `filter:none`; Ausgewogen verwendet
`weatherDisplayBalancedRasterTuning` (5,6â€“11,5 px, quell-/zoomabhÃ¤ngig); Auto und
Weich behalten ihre eigenen Berechnungen. Am wirklichen `gr-weather-radar`-Pane
wurde die Wirkung mit einem ausdrÃ¼cklich synthetischen, sichtbaren Schachbrett-
Canvas geprÃ¼ft: Z10 bei Native-Zoom7 â†’ Ausgewogen 11,5 px, PrÃ¤zise ohne Filter;
Z7 â†’ Ausgewogen 5,6 px. Die lokalen Screenshots zeigen scharfe bzw. deutlich
weiche Kanten. Dies ist ein Rendernachweis, keine neue Provider-/Radarvalidierung.
Die bestehenden Zoom-/Refresh-Hooks bleiben erhalten.

Die geschÃ¼tzte `CLOUD_BALANCED_BLURS`-Tabelle wurde nicht verÃ¤ndert. Z7 verwendet
weiterhin 6 px; nicht tabellierte Zooms bleiben ohne erfundene Zusatzwerte.
Wolkentransparenz liegt unter `weather-display:v1.opacities.clouds` als optionaler
UI-Override. Der generische Layer merkt den tatsÃ¤chlich gelieferten natÃ¼rlichen
`default_opacity` (bestehender Fallback 0,65). Der Override wird direkt am echten
GridLayer einmalig angewendet, nicht zusÃ¤tzlich am Eltern-Pane multipliziert.
Neue Layerinstanzen berÃ¼cksichtigen ihn bereits bei Erzeugung. Reset entfernt
den Override und verwendet wieder den aktuellen WR-/Payload-Standard.

### Wind und Temperatur: gemeinsame ZustÃ¤nde, geschÃ¼tzter Renderer

Modus/Farbe und allgemeine Dichte verwenden `_weatherWindSet()`. Die Wahl einer
Animation setzt die vorhandenen ausdrÃ¼cklichen Aktivierungskennungen. Schlangen-
Dichte verwendet **nur** `snake.density` und unverÃ¤ndert dessen `.35â€“5 / .05`-
Bereich; allgemeine Animation die vorhandenen low/normal/high-Presets. Bei Fahnen
und statischen Pfeilen wird kein wirkungsloser Dichteschalter angeboten.

Bei aktiver Wind-FarbflÃ¤che steuert Transparenz ausschlieÃŸlich `fieldOpacity`;
Reset verwendet `DEFAULT_WIND.fieldOpacity`. Ohne FarbflÃ¤che steuert ein eigener
reiner UI-Override `opacities.windSymbols` die CSS-Deckkraft der vorhandenen
Wind-/Schlangen-CanvasflÃ¤chen. Er verÃ¤ndert keine der elf geschÃ¼tzten Schlangen-
Einstellungen. Beim Einschalten der FarbflÃ¤che wird dieser Canvas-Override
ausgesetzt, damit die Felddeckkraft nicht doppelt multipliziert wird; der
gespeicherte Symbolwert bleibt fÃ¼r die RÃ¼ckkehr erhalten. Die Karte und das
FachmenÃ¼ verwenden weiterhin dieselben fachlichen Wind-/DichtezustÃ¤nde.

Temperatur nutzt ausschlieÃŸlich `_weatherTemperatureSet({opacity,scheme})`.
`opacity` wirkt laut vorhandenem Renderer nur auf die FarbflÃ¤che, nicht auf
Beschriftungen oder Advektion. Reset stammt aus `DEFAULT_TEMPERATURE.opacity`.

## Status und Neon

Der WR-Sammelstatus zÃ¤hlte bisher Radar zusÃ¤tzlich zu den generischen Ebenen.
Die neue explizite Ownership-Zuordnung schlieÃŸt Radar/Niederschlag, Wind und
Temperatur aus dem Sammelring aus. Nur zusÃ¤tzliche aktive generische Ebenen
(derzeit insbesondere Wolken) zÃ¤hlen dort. Daher erzeugt Niederschlag allein
einen Ring; Niederschlag plus verfÃ¼gbare Wolken erzeugt zwei. VerfÃ¼gbarkeits-
und FehlerzustÃ¤nde werden weiterhin aus bestehenden ZustÃ¤nden Ã¼bernommen,
ohne eigene Altersgrenzen oder Wetterabfragen. Statusfixtures prÃ¼fen diese
Aggregation getrennt von synthetischen Transportantworten.

Die acht gewÃ¼nschten Neonfarben sind exakt implementiert:
`#FF00CC`, `#B000FF`, `#0066FF`, `#00FFF0`, `#39FF14`, `#FFFF00`, `#FF5F00`, `#FF003C`.
Alle acht alten Farben werden nach Palettenindex/Farbfamilie auf die neue Palette
abgebildet. Slot-/Funktionszuordnungen, GrÃ¶ÃŸe und Position bleiben bestehen.
Unbekannte oder ungÃ¼ltige Werte fallen sicher auf die jeweilige Funktionsfarbe
zurÃ¼ck, nicht pauschal alle auf Pink. Laden normalisiert im Speicher; gespeichert
wird weiterhin Ã¼ber den vorhandenen UI-Persistenzpfad.

`glow:static|living` erweitert kompatibel `gewitterradar:eye-bubble:v1`, Standard
**Feststehend**, auch bei Bestandskonfigurationen. Deutsche und englische Texte
sind Ã¼ber den vorhandenen `_t()`-Resolver eingebunden; weitere Sprachen benutzen
den konsistenten englischen Fallback. Keine vorhandene Sprache wurde entfernt.

### Lichtgeometrie und Lebenszyklus

`eye-neon.js` ist eine kleine dekorative SVG-Ebene hinter den unverÃ¤nderten
Originalmastern. Jede aktive Funktion erhÃ¤lt ihre eigene nominale Slotradial-
position, Farbe, Kern, feines helles Highlight, Hauptrand und farbgleichen Bloom.
Statisch werden konzentrische Kreise ohne Animationsschleife dargestellt.

**Lebend** verÃ¤ndert die Geometrie jeder einzelnen Bahn mit zwei unterschiedlich
laufenden, slotabhÃ¤ngigen Winkelwellen (Frequenzen3/5, unterschiedliche Zeit-
und Phasenkoeffizienten). Die begrenzte radiale Auslenkung erlaubt Verflechtung
benachbarter Bahnen. Zwei zusÃ¤tzliche kurze Impulsbahnen wandern entlang derselben
jeweiligen Kurve. Das ist keine Rotation einer statischen Gruppe und kein Dash-
Loop. Alle Funktionsfarben bleiben als getrennte StrÃ¶me sichtbar, auch mit zwei
Funktionen und ohne Temperatur. Es wird keine Ersatz-Mischfarbe berechnet.

IntensitÃ¤t beeinflusst Ausdehnung und PrÃ¤senz; Helligkeit separat die Deckkraft.
Bei 0 verschwindet der Effekt, bei hohen Werten Ã¼berlagern sich gesÃ¤ttigte Halos.
GeÃ¶ffnete Bubble-Auren bleiben deutlich schwÃ¤cher. Der separate neutrale
Eye-Kontrasthintergrund und der bestehende dekorative Vorschau-Halo bleiben erhalten.
**Originaler Kompass-Halo und alle Originalgrafiken unverÃ¤ndert.**

Eine EyeNeon-Instanz verwaltet alle sichtbaren Eye-FlÃ¤chen mit einem Ticket im
bereits bestehenden gemeinsamen `frame-clock.js`. Keine Schleife pro Ring und
keine zusÃ¤tzliche native Frame-Engine. Ein begrenzter gemeinsamer Bloom-Filter
ersetzt teure Einzelfilter. FÃ¼r HiDPI, mehr als drei Bahnen oder hohe beobachtete
FrameabstÃ¤nde werden Filtereffekte und dekorative Aktualisierung reduziert
(66 statt33 ms Mindestintervall). Einstellungen bleiben dabei unverÃ¤ndert;
die Windrenderparameter und deren Scheduler werden nicht verÃ¤ndert. SVG bleibt
vektoriell; im begrenzten Modus entfÃ¤llt die teure hochaufgelÃ¶ste Blur-ZwischenflÃ¤che.

Aura AUS, Gruppierung AUS, keine aktive verfÃ¼gbare Funktion, unsichtbare FlÃ¤chen,
geschlossene/minimierte Vorschau, verstecktes Dokument und Unmount stoppen das
Eye-Ticket. Bei offener nativer Konfiguration lÃ¤uft das Eye auf der verdeckten
Karte nicht zusÃ¤tzlich. Reduced Motion zeigt die statische Ersatzdarstellung,
ohne die gespeicherte Wahl zu Ã¼berschreiben. Observer, Listener und Ticket werden
beim AushÃ¤ngen entfernt. Keine Wetterabfragen pro Frame.

## Vorschau Â· Simulation

Rechte Mini-Bubbles sind echte zugÃ¤ngliche Buttons mit `aria-pressed` und
Tastaturbedienung. Sie Ã¤ndern ausschlieÃŸlich eine lokale Statuskopie; links
erscheinen die entsprechenden Slotringe und Neonbahnen. Die Simulation darf auch
fehlende Daten optisch demonstrieren, bleibt ausdrÃ¼cklich als Simulation markiert.
Produktive Gruppierungs-/Aura-Toggles bleiben maÃŸgeblich. Wetteraktionen und
Abfrageadapter werden von Vorschau-Taps nicht aufgerufen.

â€žLive-Zustand Ã¼bernehmenâ€œ kopiert nur den aktuellen Status in die Vorschau.
Live-Updates Ã¼berschreiben den Entwurf nicht. NeuÃ¶ffnen startet nachvollziehbar
mit dem aktuellen tatsÃ¤chlichen Zustand. Beide Vorschauen verwenden dieselben
Eye-/Neonfunktionen und unverÃ¤nderte Master; Desktop nebeneinander, schmal mobil
untereinander, Szene samt Glow auf ihre FlÃ¤che begrenzt. Nur belegte Slots sind
als Mini-Bubbles sichtbar. Fokus wird nach einem Simulationstap erhalten.

## SchutzprÃ¼fung und betroffene Dateien

Funktionale Ã„nderungen: `display-menu.js`, neuer `display-quick.js`,
`layer-menu.js` (nur natÃ¼rlicher Opacity-Wert, Anwendung bei Layererzeugung und
UI-Synchronisation), `eye-hub-model.js`, `eye-hub-registry.js`, `eye-hub.js`,
`eye-hub-view.js`, `eye-hub-locales.js`, neuer `eye-neon.js`.

ZusÃ¤tzlich: Build-Inventar, Modelltest, neuer fokussierter Browsertest,
gezielte Ã¶ffentliche Workflow-Erweiterung, Bericht und automatisch generierte
Release-/Cache-/Manifest-/Frontendkopien-/PrÃ¼fsummenmetadaten. I18n-Modul und
Raster-Labor erhalten nur Import-/Releasekennungen, keine fachlichen Ã„nderungen.

Bytevergleich gegen175 schÃ¼tzt insbesondere `snake-canvas.js`, `snake-config.js`,
`snake-geometry.js`, `wind-display.js`, `wind-canvas.js`, Wind-/Temperaturdaten,
Temperaturrenderer, `ui/controls.js`, Kompassstyles, Consumer und Raster-/Mosaik-
Transport. Keine Ã„nderung an WR, TEST69, DWD/OPERA/NASA, GÃ¼ltigkeit oder Coverage.
Tags/Referenzen171/173/174/175 und DRA-Projekt-/Kanaldateien bleiben unverÃ¤ndert.

## PrÃ¼fungen und Grenzen

- Syntax, Modellnormalisierung, alle acht Farbmigrationen, Slot-/Aura-Regeln,
  analytisch eigenstÃ¤ndige Neonbahnen, Originalmaster und geschÃ¼tzte Quellen.
- Bestehender Eye-175-Browsertest mit echtem Touch/Hold/Drag zusÃ¤tzlich lokal
  im Android-Viewport; derselbe vollstÃ¤ndige Test bleibt in der Ã¶ffentlichen CI.
- Neuer Test lÃ¤dt den vollstÃ¤ndigen tatsÃ¤chlichen GR-/Leaflet-Modulbaum mit
  ausdrÃ¼cklich synthetischem Provider-I/O, Status- und Raster-Renderfixtures.
  FÃ¼nf Ansichten:1280Ã—900/DPR1,1920Ã—1080/DPR1.5,393Ã—851/DPR3,
  851Ã—393/DPR3,820Ã—1180/DPR2.
- Vier Schnellbereiche, kein Redirect/Embedding, keine implizite Aktivierung,
  echte Setter, acht Windfarben, Dichtesynchronisation, Wolken-Layer-Opacity
  einschlieÃŸlich neuer Instanz, Reset, Niederschlags-Panefilter und sichtbare
  synthetische Rasterkante, Persistenz nach Reload, keine horizontalen ÃœberlÃ¤ufe.
- 1/2/3/4/8 getrennte Neonbahnen, leere Slots Ã¼ber bestehenden Modell-/Eye-Test,
  IntensitÃ¤t/Helligkeit0/25/50/75/100, geometrische VerÃ¤nderung und bewegte Impulse,
  reduzierte Bewegung, Stop bei Aura/Gruppe AUS, Simulation ohne Abfragen oder
  WetterÃ¤nderung, 100/200/300-%-RÃ¤nder und Bubble-Bedienbarkeit.
- Lokale Screenshots wurden tatsÃ¤chlich gesichtet: insbesondere scharfe/weiche
  synthetische Kanten, kompakte Fachauswahl und mehrfarbige Neonformen. Keine
  Diagnosescreenshots oder Realtestexporte im GR-Repository verÃ¶ffentlicht.
- Build-/LieferparitÃ¤t:36 registrierte Module,174 Frontenddateien; PaketidentitÃ¤t
  und SHA256 zusÃ¤tzlich aus dem committed Stand geprÃ¼ft.

Die nachfolgend ergÃ¤nzten kurzen Framezeitmessungen sind lokale Chromium-
Entwicklungsmessungen mit synthetischem Windfeld und **acht maximalen Bahnen**,
keine Zusicherung einer GerÃ¤te-FPS. Gemessen werden tatsÃ¤chliche rAF-AbstÃ¤nde
und JS-Zeit fÃ¼r Pfadgeometrie/DOM, nicht die gesamte GPU-Paintzeit. Die geschÃ¼tzte
Schlangenanimation lÃ¤uft in beiden Vergleichsphasen mit identischen Einstellungen.

**Offen:** physische Android-/iPad-/Companion-/VM109-Sicht- und Performanceabnahme,
echtes WebKit sowie Verhalten auf realen Provider-Rastern im Zielsystem.
Keine Installation auf VM109/VM101 durchgefÃ¼hrt. Bekannte Darstellungskompromisse:
bei HiDPI/vielen Neonbahnen geringere dekorative Updatefrequenz und vereinfachter
Bloom zum Schutz der Winddarstellung; keine Garantie identischer Framezeiten
auf allen GerÃ¤ten. Keine meteorologischen GrundlagenprÃ¼fungen wiederholt.

## Bereitstellung

UnverÃ¤nderter DRA-Kanal: `TheDaimos/gewitterradar@deploy/dev`.
[Neue installierbare DEV-Lieferung](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.11.176-dev).
HA-/Dashboard-ZIP, `deployment.json` und `SHA256SUMS.txt` werden separat unter dem
neuen Tag verÃ¶ffentlicht. VollstÃ¤ndige Commits, PaketprÃ¼fsummen und erfolgreicher
Ã¶ffentlicher CI-Nachweis werden nach tatsÃ¤chlicher Erstellung unten ergÃ¤nzt.

## Lokale Entwicklungsmessung (kurze Vergleichsfenster)

Je Phase ca.900 ms. Browser-Emulation auf demselben Desktop, kein reales Mobilgerät.

| Ansicht | rAF p50 ohne/mit Neon (ms) | rAF p95 ohne/mit Neon (ms) | Neon JS Mittel/Maximum (ms) |
| --- | --- | --- | --- |
| desktop | 16.7 / 16.7 | 16.8 / 16.8 | 0.46 / 1.50 |
| desktop-hidpi | 16.7 / 16.7 | 16.8 / 33.3 | 0.54 / 1.10 |
| android | 16.7 / 16.7 | 16.8 / 16.8 | 0.65 / 1.60 |
| android-landscape | 16.7 / 16.7 | 16.8 / 16.8 | 0.67 / 1.50 |
| ipad | 16.7 / 16.7 | 16.8 / 33.3 | 0.54 / 1.10 |

Median blieb in diesen kurzen Fenstern vergleichbar; HiDPI/iPad zeigen einzelne längere Frames. Daraus wird keine konstante Geräte-FPS oder abgeschlossene reale Performanceabnahme abgeleitet. Die Messung begründet den begrenzten dekorativen Modus.
