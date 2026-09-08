# Geschützte Acceptance-Baseline — „Über Gewitterradar“ V4.05

Status: **verbindlich / abgenommen / darf bei der Zusammenführung nicht verloren gehen**

Diese Datei schützt den am 2026-09-07/08 ausdrücklich abgenommenen V4.05-Stand des „Über Gewitterradar“-Dialogs gegen Verlust, Vereinfachung oder unbeabsichtigte Abweichung bei der Zusammenführung der beiden Gewitterradar-Auslieferungsformen.

## 1. Begriff und Schutzumfang

Der geschützte Funktionsbereich heißt **„Über Gewitterradar“-Dialog / About-Dialog**. Die persönliche Danksagung darin ist der **Widmungs-/Danksagungsbereich**. Ein „Footer“ wäre nur ein möglicher unterer Abschlussbereich und bezeichnet nicht den vollständigen geschützten Funktionsumfang.

Geschützt ist der vollständige akzeptierte About-/Onboarding-Stand einschließlich:

- Erststart-/Onboarding-Verhalten und manueller Wiederaufruf;
- Header, Unterzeile, Slogan und Begrüßungszitat;
- persönliche Widmung „Für Alkje“;
- Herz-/Handschrift-/Metall-/Glow-Gestaltung;
- Hero- und Widmungshintergründe;
- Radienbereich;
- Blitzortung.org-Danksagung;
- Recorder-Hinweis inkl. kopierbarem YAML;
- Entitäten-/Funktionsübersicht;
- Fokus-, Escape-, Touch-, Scroll- und Mehrkarten-Verhalten;
- alle zugehörigen Assets und Regression Guards.

## 2. Harte Migrationsregel

Der V4.05-About-Stand ist bei der Konvergenz in `TheDaimos/gewitterradar` **vollständig zu übernehmen**.

Er darf nicht:

- ausgelassen werden;
- durch eine vereinfachte Standard-„About“-Ansicht ersetzt werden;
- auf eine rein technische Integrationsbeschreibung reduziert werden;
- neu gestaltet werden, solange kein neuer konkreter Fehler oder eine ausdrückliche Designänderung vorliegt;
- nur in `TheDaimos/gewitterradar-dashboard` verbleiben;
- in Integration und Dashboard mit voneinander abweichenden Inhalten oder Assets ausgeliefert werden.

Ein Build oder Release, bei dem der geschützte About-Stand in einer der beiden Auslieferungsformen fehlt oder abweicht, ist **nicht releasefähig**.

## 3. Kanonische Provenienz

Akzeptierter funktionaler Entwicklungsstand:

- Repository: `TheDaimos/gewitterradar-integration-dev`
- Branch: `feature/about-gewitterradar-visual-v2`
- Commit: `18b64cdd9e6745200ef381a77118f5900b5bd8f1`
- Commit-Nachricht: `Integrate About slogan and refine dedication scenery`

Vollständige Übergabe:

- `docs/HANDOFF_2026-09-08_V4_05.md`
- Übergabe-Commit: `bc949754f57f59b66b667a765d3556afe15e2d4a`

Öffentliche, veröffentlichte Referenz:

- Repository: `TheDaimos/gewitterradar-dashboard`
- Release-Commit: `44a3a615f76a7d865c2d6c8690728656c18577b9`
- Tag: `v4.05`
- Release: `Gewitterradar V4.05`

Der öffentliche `v4.05`-Tag bleibt unverändert und dient als eingefrorene Referenz für die Konvergenz.

## 4. Verbindliche Texte

### Header-Unterzeile

```text
Für Wetterbegeisterte, die Blitzaktivität klar und verständlich verfolgen möchten.
```

### Header-Slogan

```text
Gewitter beobachten, Entwicklungen entdecken.
```

Der Slogan wirkt bildintegriert und besitzt **keine** eigene Glaskachel bzw. kein separates Panel.

### Begrüßungszitat

```text
Gewitter machen sichtbar, wie kraftvoll Atmosphäre sein kann.
```

### Widmung

Titel:

```text
Für Alkje
```

Text:

```text
Danke, dass du mir die Zeit lässt, meinen Interessen und meiner Begeisterung für Technik, Wetter und all den Ideen dazwischen nachzugehen – und mich Projekten wie Gewitterradar mit so viel Freude und Ausdauer zu widmen.
```

Diese Fassung ersetzt alle älteren Varianten.

## 5. Verbindliche inhaltliche Hierarchie

Die persönliche Widmung ist bewusst der erste und wichtigste Inhaltsblock.

Reihenfolge:

1. Für Alkje
2. Gewitterradar / Wetterbegeisterung
3. Radien
4. Blitzortung.org
5. Recorder
6. technische Entitäten/Funktionen

Technische Inhalte dürfen die emotionale und visuelle Gewichtung des Dialogs nicht dominieren.

## 6. Verbindlicher visueller Stil

Gesamtwirkung:

- Premium-Dark-Night;
- Gold/Messing/Metall statt flaches Gelb;
- warme Gewitter-/Abendstimmung;
- reflektierende Goldrahmen mit Materialtiefe;
- kräftig, aber nicht grob;
- keine generischen flachen Standard-Icons als Ersatz für akzeptierte Premium-Elemente.

### Header / Hero

- offizielles App-Logo links deutlich präsent;
- Schließen-X optisch leicht; Touch-Ziel darf unsichtbar größer sein;
- Hero-Bild niemals verzerren;
- Kirche/Dorf und Blitz gemeinsam erkennbar;
- Seitenverhältnis durch Cropping/Positionierung statt Stretching;
- Slogan ohne Hintergrundpanel;
- im akzeptierten Wide-Layout liegt der Slogan in einem dunkleren Bildbereich.

### Widmung

- großes Herz links: warmes metallisches Gold, mehrere Glanz-/Glow-Ebenen, organische Wirkung;
- `Für Alkje`: plastische/metallische Premium-Schriftwirkung;
- Handschrift rechts: fein, persönlich, organisch;
- kleines Herz rechts: leicht unregelmäßig und handschriftlich passend.

## 7. Geschützte Widmungs-Assets

Akzeptierte Master-/Runtime-Fassung:

- `artwork/about-v2/dedication-master-v4.png` — 1774 × 887;
- `dist-dev/assets/gewitterradar-about-dedication-v4.webp` — 114180 Bytes;
- öffentliche V4.05-Fassung: `dist/assets/gewitterradar-about-dedication-v4.webp` — 114180 Bytes.

Zielwirkung:

- strukturierter dunkler Nadelwald links;
- dunkle Seite nicht als leere schwarze Fläche;
- kleiner klar erkennbarer warmer Lichtpunkt im Wald;
- beleuchteter Unterwuchs / Tiefenstaffelung;
- mehrere Bergsilhouetten rechts;
- warmer zurückhaltender Sonnenuntergang;
- cineastisch, hochwertig, emotional, nicht kitschig;
- dunkler Mittelbereich für Textlesbarkeit;
- kein Text, Herz oder Icon ins Hintergrundbild eingebrannt.

**Nicht neu generieren**, solange keine ausdrückliche neue Designfreigabe vorliegt.

Weitere akzeptierte Runtime-Assets, insbesondere Hero-, Brand-, Compass- und Selector-Assets, sind aus dem eingefrorenen Dashboard-Release `v4.05` zu übernehmen bzw. gegen diesen Stand zu verifizieren.

## 8. Radien-Semantik

Zwingende Reihenfolge:

- innen: **Rot** = Gefahrenradius;
- mittig: **Blau** = Gewitterradius;
- außen: **Gold** = Beobachtungsradius.

Werte stammen aus der aktuellen Konfiguration und dürfen nicht als feste Beispielwerte in die Produktlogik eingebrannt werden.

## 9. Blitzortung.org

Der Dialog dankt Blitzortung.org und den freiwilligen Stationsbetreibern.

Fachlich sauber formulieren: Gewitterradar baut auf Daten bzw. dem Netzwerk von Blitzortung.org auf. Keine Behauptung eigener Messinfrastruktur.

## 10. Recorder — kanonischer Inhalt

```yaml
recorder:
  exclude:
    entity_globs:
      - "geo_location.lightning_strike*"
    entities:
      - sensor.home_lightning_distance
      - sensor.home_lightning_azimuth
      - sensor.home_lightning_counter
```

Regeln:

- gehört in `configuration.yaml`;
- vorhandenen Top-Level-Block `recorder:` erweitern;
- niemals einen zweiten Top-Level-`recorder:`-Block erzeugen;
- Ausnahme deaktiviert die Live-Zustände der Entitäten nicht;
- sichtbare Zeilennummern gehören nicht in den kopierten YAML-Inhalt.

## 11. Funktionsvertrag

- versionierter Erststart über `gewitterradar-about-onboarding-version`;
- manueller Wiederaufruf über **Einstellungen → Über Gewitterradar**;
- keine mehrfachen gleichzeitig geöffneten Dialoge bei mehreren Karteninstanzen;
- Fokusführung, Escape, Schließen, Touch/Klick und Scrollen bleiben erhalten;
- About darf keinen vollständigen Card-/Recent-DOM-Neuaufbau verursachen;
- der einklappbare Bereich „Verwendete Entitäten und Funktionen“ bleibt Bestandteil;
- alle 16 nativen Konfigurationsentitäten werden abgebildet;
- Legacy-Kompatibilität, Blitzquellen und dynamische `person.*`-/`zone.*`-Referenzorte bleiben transparent erklärt.

## 12. Bereits bestandene Acceptance

Der finale Visual-V2-Stand wurde über acht Chrome-Profile geprüft:

- Referenz;
- Desktop;
- iPad Sidebar geschlossen;
- iPad Sidebar geöffnet;
- iPad Portrait;
- iPad Pro;
- Android Portrait;
- Android Landscape.

Zusätzlich bestanden u. a. Onboarding-Szenarien, Frontend-Regressionssuite, Syntax-/Build-Prüfungen, Assetprüfung, Recorder-YAML, Fokus/Escape, Persistenz, Clipboard + Fallback, dynamische Radien, Einheiten/Sprachen und Schutzprüfungen eingefrorener Bereiche.

Die noch ausstehende reale HACS-/Geräteabnahme ändert nichts an der bereits erteilten visuellen Designfreigabe.

## 13. Pflicht für Integration + Dashboard

Nach der Zusammenführung müssen beide Auslieferungsformen denselben gemeinsamen About-/Frontend-Stand verwenden.

Release-Prüfungen sollen mindestens sicherstellen:

- About-Funktion vorhanden;
- verbindliche Texte vorhanden;
- Widmungs-/Hero-Assets vorhanden und unverändert bzw. bewusst versioniert;
- gleiche Frontend-/About-Version in beiden Auslieferungen;
- gleiche Prüfsummen der gemeinsam ausgelieferten About-Assets;
- keine versehentliche Fallback-/Placeholder-Fassung;
- keine Regression des Erststart-/Wiederaufruf-Verhaltens.

Diese Datei ist die projektspezifische Schutzquelle. Änderungen an dieser Acceptance-Baseline benötigen eine ausdrückliche Benutzerentscheidung.