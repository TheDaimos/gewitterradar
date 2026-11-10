# GR Eye-Bubble-Hub V4.11.174 – Realtestbefund und verbindliche Korrekturentscheidung

**Datum:** 10.11.2026  
**Projekt:** Gewitterradar / Eye-Bubble-Hub  
**Ausgangsstand:** GR **4.11.174 DEV**, HA **0.25.81**, Runtime `411174r1`, Modulset `E411-174A1`  
**Repository:** `TheDaimos/gewitterradar@deploy/dev`  
**Status:** **Offene Korrekturanforderung, noch NICHT implementiert oder real abgenommen**. Diese Datei ändert keine Runtime, Installationsdatei oder Referenz.

## 1. Gemeldeter Realbefund

- Auf dem Karten-Screenshot der V4.11.174 ist das Eye-Symbol nicht sichtbar, während Premium-Wind, -Temperatur, -Niederschlag und WR-Layer als Einzelicons erscheinen.
- Der Premium-Konfigurator kann über die allgemeinen Gewitterradar-Einstellungen geöffnet werden und zeigt die Live-Vorschauen sowie `Bubble-Gruppierung` links in AUS-Stellung. Der Nutzer meldet, die gewünschte Eye-/Bubble-Funktion über die reale Oberfläche nicht aktivieren oder ausprobieren zu können.
- Sichtbarer Designmangel: Oben rechts im Eye-Konfigurator wird das eckige/alte X verwendet. Für die einzelnen Slot-Zeilen ist genau dieses alte X **erwünscht und soll erhalten bleiben**.

**Quellbefund:** In `frontend/modules/weather/eye-hub.js` setzt `_eyeHubSync()` explizit `eye.hidden=!c.grouped`. In `eye-hub-view.js` verwendet der Konfiguratorheader `premiumAction('close', ...)`; Slot-Leeren nutzt `PREMIUM_CLOSE` aus `premium-ui.js`. Die Screenshotlage beweist noch nicht, ob der Gruppierungs-Toggle beim Versuch fehlerhaft speichert oder ob die bisherigen Sichtbarkeitsregeln und fehlende Eye-Entdeckbarkeit ursächlich sind; daher den tatsächlichen Toggle-Ereignis-/Persistenz-/Renderpfad gezielt realistisch reproduzieren.

## 2. Neue verbindliche Produktentscheidung: Eye auf der Karte immer sichtbar

1. **Eye als Kartenschalter immer sichtbar**, auch wenn die Bubble-Gruppierung AUS ist. Die Gruppierungsoption bestimmt ausschließlich die Organisation der Funktionsicons, nicht die Sichtbarkeit des Eye-Hubs.
2. **Gruppierung EIN:** Eye bleibt sichtbar; Kurz-Tap öffnet/schließt die konfigurierten Bubble-Icons. Keine parallelen Einzelicon-Duplikate. 600-ms-Long-Press öffnet den Eye-Konfigurator.
3. **Gruppierung AUS:** Eye bleibt sichtbar **neben** den bisherigen eigenständigen Premium-Funktionsicons, die weiterhin ihre Positionen, Sichtbarkeitsregeln und bestehenden Tap-/Long-Press-Aktionen behalten. Kurz-Tap auf das Eye soll den Eye-Konfigurator als auffindbaren Einstieg öffnen (kein leeres Bubble-Menü); 600-ms-Long-Press öffnet ebenfalls den Konfigurator. Der bereits vorhandene `Einstellungen → Kartendarstellung → Eye-Bubble-Menü`-Zugang bleibt bestehen. Kein zweiter Darstellungsdialog.
4. Eye allein schaltet **keine Wetterfunktion** ein oder aus. Die ursprüngliche WR-Layer/Darstellungs-Emblem-Schaltfläche bleibt separat und öffnet unverändert ihr bestehendes Darstellungsmenü.
5. Die **Eye-Position `eyePosition`** und sämtliche eigenständigen Karteniconpositionen bleiben unverändert gespeichert. Keine Positionsmigration, keine automatische Zurücksetzung. Die Option `Position merken` bleibt maßgeblich.
6. Bei bestehender Standardkonfiguration darf `Bubble-Gruppierung` weiterhin **AUS** sein. Nur die neue ständige Eye-Sichtbarkeit ändert sich.
7. **Aura-Regeln bleiben unverändert:** Gruppierung AUS → keine Eye-Statusringe und keine Auren auf Einzelicons, selbst wenn Aura EIN gespeichert ist. Gruppierung EIN und Aura EIN → aktive Ring-/Bubble-Auren wie spezifiziert. Globales Aura AUS unterdrückt sämtliche funktionalen Aura-Effekte. Kontrastschattierung separat.
8. Vorhandene Eye-Hi-Res-Originalmaster offen/geschlossen aus V4.11.174 bewahren, kein Ersatz oder Hochskalieren kleiner Bilder; rahmenloses Aussehen und vorhandene Größen-/Touchziel-Einstellungen erhalten.

## 3. Premium-Schließen-Icon korrigieren

- **Eye-Konfigurator, Header rechts oben:** Das derzeitige eckige/alte X **ersetzen** durch das bereits andernorts verwendete **runde, hochwertige Gold-X**, das in den allgemeinen Gewitterradar-Einstellungen sowie Wind-/Temperatur-Einstellungsmenüs Verwendung findet.
- Das reale gemeinsame freigegebene Masterasset bzw. vorhandene Premium-Schließen-Element **im Repository lokalisieren und unverändert wiederverwenden**; nicht generativ nachzeichnen, nicht neue Iconfamilie einführen.
- **Slotzeilen:** Bisheriges eckiges/kleines X zum Leeren eines Slots **ausdrücklich beibehalten**. Es hat eine andere Funktion und ist als Slot-Reset-Symbol akzeptiert.
- Gewohnte Fokus-, Touch-/Pointer-, Tastatur- und Close-Logik erhalten. Bei Bedarf CSS auf einheitliche Größe/Alignment der Headerbedienelemente anpassen, nicht ihre Semantik verändern.

## 4. Zielgerichtete Prüfung vor Freigabe

- Standardzustand AUS: Eye **sichtbar**, Einzelicons **sichtbar**, **keine** Bubble-Aura, keine Statusringe; Eye-Kurztap und Long-Press erreichen Konfigurator.
- Toggle AUS → EIN und EIN → AUS innerhalb desselben geöffneten Konfigurators: tatsächlicher Zustand wechselt **sofort**, bleibt nach Schließen und Reload gespeichert, UI und Karte stimmen überein.
- Zustand EIN: Eye-Kurztap öffnet/schließt Bubbles. Keine Doppelicons. Einzelpositionen unverändert. Schließen via Escape/Außenaktion, Touch/Longpress, Drag, Tastatur, Android/iPad/Chromium-Viewports prüfen.
- Sowohl klassisches als auch modernes GR-Einstellungsmenü müssen den Konfigurator erreichen.
- Header zeigt **rundes** Gold-X; alle Slotzeilen behalten **altes eckiges** X; Klicks lösen ausschließlich ihre vorgesehene Aktion aus.
- Falls `eye.hidden` und `display:block` CSS kollidieren, eine **konsistente** Sichtbarkeitssemantik schaffen statt durch immer weitere Override-Regeln Fehler zu verdecken.
- Keine Veränderung an WeatherRouter, Wetterquellen, Freshness, Raster, Lightning, Windanimation oder TEST69. Kein privates CI. Nur öffentliche gezielte CI auf `deploy/dev`. Keine automatische VM109-/VM101-Installation.
- Wenn Code geändert wird: **neue eindeutige GR-/HA-DEV-Version** und vollständige Synchronisierung aller Runtime-, Manifest-, Modul-, Frontendkopien-, SHA256-, DRA-/Release-Metadaten. V4.11.171 und V4.11.173 als geschützte Referenzen unangetastet lassen; V4.11.174-Release nicht überschreiben.

## 5. Status

Diese Festlegungen wurden nach Sichtung der ersten V4.11.174-Desktop-Screenshots getroffen. Der aktuelle Screenshot zeigt die AUS-Stellung und die falsche Header-X-Grafik. **Es gibt noch keinen Nachweis einer implementierten Korrektur und keine echte Android-/iPad-/VM109-Abnahme.**


## 6. Zweite Sichtkorrektur vom 10.11.2026 – Regleranordnung, 300 % und hochwertigerer Glow

**Neuer Nutzer-Screenshot:** Der Konfigurator zeigt bereits „Bubble-Gruppierung EIN“, Eye-Größe `72 px`, Aura-Intensität `72 %`, Aura-Helligkeit `59 %` und Kontrastschattierung `100 %`. Die zweite Sichtung ist damit ein separater Zustand nach dem ersten Screenshot. Nicht pauschal behaupten, dass der Toggle grundsätzlich nicht arbeitet. **Das Auge auf der realen Hauptkarte bleibt dennoch gesondert zu verifizieren.**

### 6.1 Feste Regleranordnung auf breiten Ansichten

Unterhalb der beiden globalen Schalter „Bubble-Gruppierung“ und „Aura-Ringe anzeigen“:

| Linke Spalte – Eye-Darstellung | Rechte Spalte – Aura |
|---|---|
| **Eye-Größe** (in Prozent) | **Aura-Intensität** |
| **Kontrastschattierung hinter Eye** | **Aura-Helligkeit** |

Die beiden Aura-Schieberegler müssen **direkt untereinander rechts** stehen. Links die Eye-Größe, **darunter** die Kontrastschattierung. Android/schmale Layouts bleiben einspaltig in sinnvoller Reihenfolge und vollständig bedienbar. Die übrige Menüstruktur/Slotliste bleibt erhalten.

### 6.2 Eye-Größe als relative Prozentangabe – bis 300 %

- UI-Anzeige, Regler, Tastatur- und Screenreader-Beschriftung **in Prozent statt Pixel**.
- Empfohlenes klar definiertes Bezugsmaß: bisheriger Standard **42 CSS-Pixel = 100 %**, somit **300 % = 126 CSS-Pixel Bildgröße**; bestehende 50x50-Touchziel-Mindestfläche bewahren.
- Ausgangswert für bestehende Nutzer **visuell äquivalent zum aktuell gespeicherten Pixelwert** migrieren/umrechnen, nicht stillschweigend auf 100 % zurücksetzen. Beispiel `72 px` → ungefähr **171,4 %**. Zielgenaue Darstellung und Rundungsregeln definieren. Nach Reload müssen Größe und prozentualer Regler übereinstimmen.
- Unterschranke passend zu vorhandener Mindestgröße wählen (keine Verschlechterung der Touchbedienung). Ob Speicherung intern als Prozentwert oder versioniert migrierter Wert erfolgt, ist Implementierungsdetail; **die Datenkompatibilität ist zwingend**.
- Das Bild muss **immer direkt aus den vorhandenen 1254x1254-Originalmasterassets** gerendert werden; niemals aus einer vorher rasterverkleinerten 36-/42-/72-px-Zwischendatei hochskalieren.
- Ringradien bleiben **fest an Slotindex** gebunden, werden geometrisch an die Eye-Größe angepasst; die Aura-Farbe bleibt an Funktions-ID gebunden.
- 300-%-Grenzfälle: Außenring, Glow und Eye-Schattierung sowie Bubble-Fächerung dürfen am Kartenrand, besonders in Android Hoch- und Querformat, nicht abgeschnitten werden. Eye-/Bubbles-Positionierung an die tatsächliche Gesamtausdehnung anpassen; erforderlichenfalls den Hub nach innen ausrichten/platzieren, **ohne gespeicherte Benutzerpositionen dauerhaft zu überschreiben**.
- Originalseitenverhältnis, sauberes Alpha, UI-Fokus und Pointer-Hitbox unverändert erhalten.

### 6.3 Eye-Glow/Halo optisch verfeinern (ohne neue Grafik!)

- Der Screenshot zeigt einen großflächig verwaschenen Hintergrundhalo bei sehr hoher Kontrastschattierung und eng beieinanderliegende, relativ harte Neonringe. **Gestalterischer Wunsch:** edler, differenzierter, feiner und optisch tiefer – mit sanften radialen Glow-Verläufen statt grober harter Lichtkanten oder eines flachen grauen Flecks.
- **Aura-Intensität** und **Aura-Helligkeit** bleiben zwei unterschiedliche globale Werte; geschlossene Eye-Statusringe und feine geöffnete Bubble-Glow-Effekte reagieren nachvollziehbar darauf. Feinere Bubble-Aura bleibt stets wesentlich zurückhaltender als die Eye-Ringe.
- Kontrastschattierung ist weiterhin ein **separater neutraler Hintergrund-Kontrastregler**, unabhängig vom globalen Aura-Schalter und unabhängig vom dekorativen Vorschau-Halo. Auch bei 100 % soll das Eye erkennbar und hochwertig bleiben; keine riesige undurchsichtige dunkle Scheibe.
- **Die bereits freigegebene originale Kompass-Halo-Gestaltung nicht global verändern.** Gegebenenfalls einen *nur für den Eye-Konfigurator* angepassten Effekt verwenden; gleiche Designfamilie, keine Regression am Kompass. Beide Eye-Vorschauen erhalten denselben dekorativen Hintergrundhalo.
- Keine dauernden animierten Pulseffekte erforderlich. `prefers-reduced-motion` unverändert beachten. CSS-/Rendering-Effekte müssen bei Android/HiDPI performant bleiben.

### 6.4 Zusätzliche konkrete Nachweise

1. Responsive Reglerpositionen Desktop vs. Android (links 2 Eye-Regler, rechts 2 Aura-Regler bzw. schmale Einspaltenansicht).
2. Prozentwerte inkl. 100 %, 171 % (Bestandsmigration aus 72 px), 200 %, 300 %; Persistenz, Reload und Tastatur.
3. Eye offen/geschlossen auf Karte und in Vorschau aus den Masterassets, auch bei 300 % ohne unscharfe Zwischenbildskalierung.
4. Randfälle für 1/4/8 Slotringe, Eye-Größe 300 %, Karten-Viewport Desktop/Android Hoch- und Querformat; keine abgeschnittenen Statusringe oder unbedienbaren Bubbles.
5. Aura EIN/AUS und Gruppierung EIN/AUS gemäß bestehender Wahrheitstabelle; Bubble-Glow dezent, Schattierung separat, Kompass-Halo unverändert.
6. Vorhandene Referenzen und V4.11.174-Pakete nicht überschreiben; erst bei implementierter Codeänderung neue eindeutige Version.

### 6.5 Ressourcenstrategie

Der Nutzer meldet noch **35 % des Fünfstunden-Volumens**. Das ist die dem Nutzer angezeigte verbleibende Nutzung, **kein verifizierter technischer Token-/Zeitbedarf**. Daher diese Ergänzung **gebündelt** mit den bereits dokumentierten Eye-Immer-Sichtbar- und Header-Schließen-Icon-Korrekturen als **einen gezielten Folgeauftrag** abarbeiten; keine vollständige Neubearbeitung des großen Eye-Bubble-Hubs, keine unnötigen Volltests und keine neue Grundlagen- oder Meteoanalyse. Gezielte CI und neue eindeutige DEV-Version nach tatsächlicher Änderung beibehalten.
