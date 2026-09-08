# Über Gewitterradar — freigegebene Änderungen nach V4.05

Status: **ergänzende Designfreigaben zur geschützten V4.05-Baseline**

Diese Datei ergänzt `docs/ABOUT_GEWITTERRADAR_ACCEPTANCE_BASELINE_V4_05.md` um ausdrücklich nach der V4.05-Abnahme freigegebene, eng begrenzte Änderungen. Alles, was hier nicht ausdrücklich genannt ist, bleibt durch die V4.05-Baseline geschützt.

## 1. Verifizierte historische Ausgangsbasis

Der letzte akzeptierte Codex-Stand vom 2026-09-07 ist vollständig in Git erhalten:

- Repository: `TheDaimos/gewitterradar-integration-dev`
- Branch: `feature/about-gewitterradar-visual-v2`
- Commit: `18b64cdd9e6745200ef381a77118f5900b5bd8f1`
- Commit: `Integrate About slogan and refine dedication scenery`
- Bericht: `docs/ABOUT_VISUAL_V2_REFINEMENT_5.md`
- Provenienz: `artwork/about-v2/dedication-v4-provenance.md`

Dieser Stand änderte gezielt nur den Header-Slogan und den Widmungshintergrund. Bestehende Vordergrundelemente, Recorder-Inhalt, Radien, Footer und Interaktionen blieben erhalten. Alle acht Browserprofile, fünf Onboarding-Szenarien, Persistenz, Fokus/Escape, Clipboard/Fallback, Overflow-/Clipping-Prüfungen, Syntax, deterministischer DEV-Build, Asset-Prüfung und Frontend-Regressionssuite bestanden.

## 2. Real-HACS-Befunde am 2026-09-08

Der veröffentlichte Dashboard-Stand V4.05 wurde real in Home Assistant geladen. Der vollständige About-/Visual-V2-Stand erschien korrekt, nachdem ein alter pre-rename Lovelace-Ressourcenpfad deaktiviert wurde.

Zusätzliche reale Befunde:

- sichtbare Kennzeichnung `V4.05 DEV · Visual V2` ist für einen Stable-Stand unsauber; `DEV` im nächsten gemeinsamen Stand entfernen;
- Recorder-Kopierfunktion funktioniert real, aber das sichtbare Copy-Icon fehlt;
- der bestehende Close-Button funktioniert, ist aber visuell noch zu flach/generisch.

Der eingefrorene Tag `v4.05` bleibt unverändert.

## 3. Freigegebener Premium-Close-Button

Freigegebener Assetname bei Übergabe an Codex: `closing.png`.

Ziel:

- nur die sichtbare Close-Darstellung austauschen bzw. veredeln;
- bestehende 44×44-px Touch-/Hit-Fläche erhalten;
- Close-Handler, Escape, Fokusführung, aria-label, Tastatur und Touch unverändert lassen;
- Premium-Gold/Messing, dunkler metallischer Kern, starke Materialtiefe, mehrschichtiger Rahmen, warmer Reflex, hochwertiger Hover-/Pressed-Zustand;
- X muss sofort als Schließen-Symbol erkennbar bleiben;
- kein Layout-Shift und keine Änderung an Header-Bild, Titel, Unterzeile oder Slogan.

## 4. Freigegebenes Premium-Copy-Symbol

Freigegebener Assetname bei Übergabe an Codex: `copy.png`.

Gestaltungsrichtung:

- zwei überlagerte goldene/messingfarbene Schriftrollen bzw. Dokumente;
- deutlicher Duplikat-/Kopiercharakter, damit die Funktion trotz historischer Schriftrollenästhetik sofort verständlich bleibt;
- hohe Materialtiefe, mehrschichtige Metallwirkung, warme Reflexe, hochwertige Details;
- als kompakter UI-Button im Recorder-YAML-Bereich skalieren, nicht als große Illustration;
- hochwertiger Hover-/Pressed-Zustand;
- kein Overflow auf Desktop, iPad oder Android.

Funktionsschutz:

- bestehende Clipboard-Logik unverändert;
- vorhandener Fallback unverändert;
- Erfolg-/Fehlerrückmeldung unverändert;
- kanonischer Recorder-YAML-Inhalt unverändert;
- Zeilennummern niemals mitkopieren;
- Accessibility/aria-label erhalten.

## 5. Gemeinsame Auslieferungsregel

Diese Änderungen gehören ausschließlich in den gemeinsamen Gewitterradar-Quellstand `TheDaimos/gewitterradar` und müssen anschließend identisch in beide Auslieferungsformen einfließen:

1. native Home-Assistant-Integration;
2. Dashboard-/Lovelace-Auslieferung.

Keine neue Dashboard-Sonderlösung und keine getrennte Frontend-Entwicklung.

## 6. Weiterhin geschützte Inhalte

Unverändert bleiben insbesondere:

- `Für Alkje` samt exaktem Text;
- Widmungsbild, Herz und Handschrift;
- Hero-Bild, Logo, Header-Unterzeile, Slogantext und Begrüßungszitat;
- Radien-Semantik und dynamische Werte;
- Blitzortung.org-Danksagung;
- Recorder-YAML-Inhalt;
- Entitäten-/Funktionsübersicht;
- Onboarding-/Persistenz-/Wiederaufruflogik;
- Fokus/Escape/Scroll/Multi-Card-Verhalten;
- Recent-, Compass-, Medallion- und iPad/WebKit-Regressionsschutz.

## 7. Release-Gate

Ein nachfolgender gemeinsamer Gewitterradar-Stand ist nur releasefähig, wenn:

- beide Premium-Assets korrekt integriert sind;
- Close- und Copy-Funktion unverändert funktionieren;
- `DEV` aus der sichtbaren Stable-Kennzeichnung entfernt ist;
- beide Auslieferungsformen denselben Frontendstand und dieselben Runtime-Assets verwenden;
- bestehende Frontend-, Integration-, Responsive- und Asset-Prüfungen grün bleiben;
- der geschützte V4.05-About-Inhalt außerhalb dieser ausdrücklich freigegebenen Änderungen unverändert bleibt.
