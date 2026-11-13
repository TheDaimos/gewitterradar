# Codex P2 – Synoptik-Menü auf das bestehende Premium-Metal-Design bringen

**Ausführung: gezielter visueller UI-Fix, kein erneuter Synoptik-Backend-Umbau.** Verbleibendes Codex-Wochenkontingent ca. **4 %**. **Keine Bilder, Screenshots, Anhänge oder Bildreferenzen nötig**. Sämtliche nötigen Referenzen befinden sich als bestehender Code im Repository.

## Ausgangslage

- Aktueller `TheDaimos/gewitterradar@deploy/dev`, installierter real auf Android geprüfter **GR 4.11.207 DEV / HA 0.25.114**; WR **0.10.322 DEV** unverändert.
- **Erfolg real auf Android bestätigt:** H/T-Zentren und weiße Isobaren werden in Europa korrekt sichtbar; Synoptik-Long-Press öffnet das Menü; 5. Eye-Slot bleibt gespeichert. **Diese funktionierende Darstellung, Datenbeschaffung, Aktivierung, Touch-/Drag-Gesten und Persistenz schützen.**
- Visuelles Problem: Synoptik-Einstellungsmenü ist **größtenteils transparent**, unlesbar vor der Karte. Die Überschrift `Synoptik · H/T, Isobaren & Fronten` läuft in einer **extrem schmalen vertikalen Spalte** links, während Minimize/Close räumlich verstreut sind. Überschriften, Checkboxen, Slider, Schaltflächen liegen direkt über Isobaren und Regenradar; es fehlt die bestehende hochwertige Metallrahmen-/Hintergrund-/Header-Optik.
- Die Farb-Dropdowns zeigen ausschließlich **rohe Hex-Codes** (z. B. `#B000FF`, `#FFC442`, `#D8E6F3`) in einem **Android-nativen grauen Vollbild-Select**. Gewünscht ist eine **echte visuelle Farbauswahl** (farbige Muster, ggf. semantische Namen) statt reiner Hexwerte, **inklusive aller bestehenden Classic- und Aura/Neonfarben**. Nicht nur CSS für ein natives `<option>` verwenden: Android rendert native Select-Optionen systemgesteuert.

## Präzise technische Stellen

- Primär: `frontend/modules/weather/synoptic-display.js`:
  - `_weatherSynopticEnsureUi()` um Zeilen 88–97; Inline-CSS `.weather-synoptic-panel`.
  - `_weatherSynopticRenderMenu()` um Zeile 110: erzeugt heute nacktes `<header class="weather-display-panel-head">`, einfache `<label>`, `<select>` mit Hex-Optionen; `enhancePremiumSections` wird aufgerufen.
  - `_weatherSynopticSyncMenu()` und Eingabe-Handler, Settings-Vault-Anbindung und `SYNOPTIC_PALETTE`.
- **Gestaltungsreferenzen im vorhandenen Code**: `frontend/modules/weather/display-menu.js` (aufgeräumter echter `.weather-display-panel.gr-premium-metal-surface`, Header, Karten, Premium-Controls); `frontend/modules/weather/eye-hub-view.js` (goldmetallische Ränder, lesbarer Hintergrund und Premium-Schließen); `frontend/modules/weather/premium-ui.js`; bestehende hochwertige Wind-/Temperaturmenüs. Gewünschtes Design **identisch in Qualitätsniveau und UI-Verhalten**, keine eigenständige Stilwelt.
- Auch mobilen `#map-card`-/Shadow-DOM-Kontext und `position:absolute`, `z-index`, Clip/Overflow prüfen. **Explizit und zuverlässig deckender dunkler Panel-Hintergrund**, metallischer mehrschichtiger Rahmen, harmonischer Goldakzent, solide Trennung von Karte und UI (unabhängig von sonstigen CSS-Imports, z. B. Premium-Surface).
- Bewährte Premium-Icons/Assets für Close und Minimize **aus dem Repo verwenden**; keine generischen ASCII-X oder CSS-Platzhalter. Exakte Bild-Assets nicht ändern.

## Abnahmekriterien

1. **Mobil lesbares Panel**: auf Android schmaler Breite (ca. 360–412 CSS px) volle nutzbare Breite mit Randabstand, begrenzte Höhe, nur Inhalt scrollt, anfangs sinnvoll platziert; Überschrift maximal 1–2 Zeilen, keine Ein-Buchstaben-Wortumbrüche, Header-Buttons rechts ordentlich ausgerichtet, keine Überschneidungen.
2. **Verbindliche Premium-Optik**: dunkler **nicht transparenter** Hintergrund (Karte/Isobaren/Text darunter dürfen nicht durchscheinen), hochwertiger metallischer Doppelrahmen mit dezenten Gold-/Chromreflexen, Premium-Header/Schließen/Minimieren, saubere Unterabschnitt-Karten, Chevron, konsistente hochwertige Checkboxen, Slider und Buttons; mobile Touchflächen ausreichend groß. Styles korrekt im Shadow DOM.
3. **Visuelle Farbauswahl** statt Android-Select-Dialog mit Hex-Strings:
   - Alle Optionen erhalten klar sichtbares **Farbmuster/SWATCH** mit originalgetreuem Wert; nutzerfreundliche Farbnamen als sekundäre Beschriftung (z. B. Gold, Violett, Eisblau) statt Hex-Dominanz. Hexwert darf als sekundäres Info-Detail existieren, nicht als einzige Darstellung.
   - Verwende einen **eigenen zugänglichen Premium-Farbpicker** innerhalb des Synoptik-Menüs (Button mit aktuell gewähltem Farbmuster; bei Tap öffnet sich klarer Touch-Popup/Palette/Grid) nach vorhandener App-Designsprache; keine nativen `<select><option>` als sichtbare Primärinteraktion.
   - Auswahl wirkt sofort auf Karten-Rendering; öffnet und schließt zuverlässig auf Android; ausgewählte Farbe sichtbar markiert, Screenreader-Label, Escape/Outside-Tap und Android-Back falls üblich; Optionen werden nicht hinter das Menü gerendert oder vom Overflow abgeschnitten. **Keine Neuanfrage an WR bei reiner Farbänderung.**
   - `highColor`, `lowColor`, `isobarColor` und **alle vorhandenen** `frontColors` abdecken. Vorhandene Palette, benutzerdefinierte Werte und Persistenz erhalten; unbekannte gespeicherte Farben nicht stillschweigend überschreiben.
4. **Funktionalität unangetastet**: Long-Press öffnet Menü im fünften Eye-Slot und Einzelicon; Short-Tap toggelt; Drag verschiebt. Änderungen an Slider/Deckkraft/Colors werden gespeichert, beim Reload/anderen Kontext wiederhergestellt, und auf bereits vorhandenen Leaflet-Layern angewandt. Datenabruf, V2-Vertrag und NOAA Fronten bleiben unverändert.
5. **Gezielter Test**: Browser mit Android-nahem Viewport verifiziert tatsächliches computed `background-color`, Opazität, Panel-Bounding-Rects und visuelle Swatches, sowie Touch-Farbauswahl und sofortige Rendering-/Settings-Aktualisierung. CI nur gezielt Synoptik-/UI-/Settings-Vault plus Sync der Auslieferung; keine gesamte historische Testserie.
6. **Versionspflicht**: neue eindeutige GR-/HA-Version (**nicht** 4.11.207/0.25.114 erneut verwenden), alle Module/Spiegel (HACS, Frontend, Dashboard, DRA) korrekt synchronisieren, SHA-256-Release-Dateien, `deploy/dev` veröffentlichen, **PROD VM101 und WR unverändert**.
7. Bericht `docs/` mit konkreten Ursachen, Dateipfaden, Version/Commit, Testnachweisen und ausdrücklichem Hinweis auf notwendige **reale Android-Abnahme**.

## Arbeitsweise

**Direkt implementieren, keine Zwischenberichte, keine Rückfragen.** Enger, ressourcensparender Fix. Die Synoptikdarstellung selbst und der geschützte Schlangen-Windrenderer sowie alle bisherigen Premium-Menüs bleiben unverändert.
