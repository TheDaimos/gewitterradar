# Gewitterradar V4.11 – Chat-Handover 2026-10-02 – Hero-Hintergrund / HTML-Hilfe

## Zweck

Diese Übergabe setzt die Arbeit am öffentlichen HTML-Handbuch / GitHub-Pages-Hero und an der lokalen HTML-Hilfe fort. Der funktionale V4.11-Stand bleibt unangetastet; hier geht es primär um die visuelle Finalisierung des Hero-Hintergrunds und die saubere Archivierung der dazugehörigen Hi-Res-Master.

## Repository und Branches

- Repository: `TheDaimos/gewitterradar`
- Entwicklungszweig: `feature/v4.11-development`
- Aktueller Übergabe-HEAD: `dfaad2239398cbfbf654bc7d139c4bb5097fd27d`
- Aktueller `main`-Stand für GitHub Pages: `56a612c6ff0ce134cb4fd13471655f4e3e96885f`
- GitHub Pages: `https://thedaimos.github.io/gewitterradar/`
- Direkte Dokumentationsseite: `https://thedaimos.github.io/gewitterradar/gewitterradar-overview.html`

## Wichtige Regeln

- V4.10 FINAL nicht technisch verändern.
- Für V4.11 weiter auf `feature/v4.11-development` arbeiten.
- `main` nur für gezielte öffentliche Dokumentations-/Pages-Anpassungen anfassen.
- DRA nicht verändern, solange es nur um HTML-Hilfe / Artwork geht.
- Hi-Res-Master niemals durch Runtime-/Web-Ableitungen ersetzen oder löschen.
- Retentionsvertrag unter `tests/contracts/hires-asset-retention-v4.07.56.json` beachten.

## HTML-Hilfe / Pages

Kanonische HTML-Datei:

- `docs/gewitterradar-overview.html`

Synchronisierte lokale Auslieferungen:

- `frontend/help/index.html`
- `custom_components/gewitterradar/frontend/help/index.html`
- `dashboard/dist/help/index.html`

Aktuelle Hero-Bildkopie für die Web-/lokale Hilfe:

- `docs/assets/gewitterradar-hero-forest-storm-master-v1.png`
- entsprechende Kopien in `frontend/help/assets/`, `custom_components/gewitterradar/frontend/help/assets/`, `dashboard/dist/help/assets/`

## Geschützte Hi-Res-Master

Die folgenden neuen Hero-Hintergründe liegen unter `artwork/help-icons/hires/` und sind explizit archiviert:

1. `Gewitter über dem alpinen Abendtal.png`
   - Git-Blob: `294b9c1f192a90b756aa9a0a2fc4f37412aff896`
   - 2,310,963 Bytes
2. `Goldenes Tal zwischen Sonne und Sturm.png`
   - Git-Blob: `574a3ebee3ab7239ce8977f73efdcaf5a28ddd03`
   - 2,187,671 Bytes
3. `gewitterradar-hero-forest-storm-master-v1.png`
   - kanonischer Hero-Master
   - Git-Blob: `0c6486a43e8aa20c8a632ad6b856ae0936eca7ff`
   - 2,321,853 Bytes

Dokumentation/Provenienz wurde ergänzt in:

- `artwork/help-icons/README.md`
- `artwork/help-icons/provenance.json`

Der Retentionsprüfer wurde außerdem für UTF-8-Dateinamen robust gemacht (`core.quotepath=false`), weil die beiden deutschen Dateinamen sonst maskiert erschienen.

## Visuelle Entwicklung des Hero-Bereichs

Es gab drei wichtige Vergleichszustände:

### 1. Alte Mischung

- Gewitterbild rechts + Danksagungs-/Wald-/Lagerfeuerbild links als getrennte Ebenen.
- Vorteil: linke Seite war sehr ruhig, fein, klar und atmosphärisch.
- Besonders der Lagerfeuer-/Waldbereich links gefiel deutlich besser: schärfer, mehr Details, weniger HDR.
- Nachteil: technisch keine einzelne Master-Hintergrunddatei.

### 2. HDR-/Einzelbild-Variante

- `gewitterradar-hero-forest-storm-master-v1.png` als einzelnes Panorama.
- Vorteil: deutlich detailreicher, eindrucksvoller, sauber archiviert.
- Nachteil: Blitz zu hart / HDR-artig; Bild konkurriert stärker mit Text und Logo.

### 3. B2

- weiterhin der Einzelbild-Master als Basis,
- zusätzliche CSS-Abdunklung und diffuse Behandlung rund um den Blitz,
- Ziel: weniger HDR, ruhiger.
- Nutzerurteil: rechts angenehmer, links aber zu weit in den Hintergrund gedrückt.

## Aktueller Stand nach letztem Feinschliff

Die aktuelle Fassung versucht:

**alte linke Seite + B2 rechte Seite**

Dazu wird derzeit:

- der kanonische Einzelbild-Master im `.hero:before` verwendet,
- zusätzlich das alte Danksagungsbild `gewitterradar-about-dedication-v4.webp` in `.hero:after` links eingeblendet,
- links mit einer weichen Maske sichtbar gehalten,
- rechts der Blitzbereich weiterhin weich/diffus behandelt.

Der Nutzer hat nach dem letzten Update unmittelbar bemerkt:

> „allerdings.. überlagert?“

Das ist der zentrale offene Punkt für den nächsten Chat.

## Aktuelle technische Ursache der wahrgenommenen Überlagerung

Ja: Die aktuelle Fassung ist tatsächlich wieder eine Zwei-Ebenen-Komposition.

- `.hero:before` = Einzelbild-Master `gewitterradar-hero-forest-storm-master-v1.png`
- `.hero:after` = `gewitterradar-about-dedication-v4.webp` links, maskiert und mit `opacity:.64`

Dadurch kann links ein leicht „doppelt“ bzw. überlagert wirkender Eindruck entstehen, weil beide Bilder eigene Wald-/Lagerfeuer-/Bergdetails enthalten.

## Empfehlung für den nächsten Schritt

Nicht sofort weiter drehen, sondern zuerst anhand des aktuellen Screenshots entscheiden:

### Variante A – aktuelle Überlagerung fein reduzieren
- `.hero:after` Opacity deutlich reduzieren, z. B. von `.64` auf etwa `.35–.45`.
- Maske früher auslaufen lassen.
- Vorteil: alte linke Atmosphäre bleibt, Doppelbild-Effekt wird schwächer.

### Variante B – kein zweites Bild, sondern nur Einzelbild lokal aufwerten
- `.hero:after` wieder entfernen.
- Einzelbild-Master beibehalten.
- Stattdessen links nur CSS-seitig weniger abdunkeln / leichte lokale Aufhellung und Kontrastbewahrung.
- Das wäre technisch sauberer und ohne echte Bildüberlagerung.
- Nutzerpräferenz beachten: Lagerfeuer/Wald soll sichtbar, scharf und detailreich bleiben, aber nicht HDR-artig wirken.

### Variante C – separate, echte finale Masterkomposition
- Bestehenden Screenshot-/Layout-Look als neue einzelne Mastergrafik rendern.
- Danach nur ein Bild verwenden.
- Falls gewählt: als neuen Hi-Res-Master archivieren und in Retentionsvertrag aufnehmen.

## Nutzerpräferenz, bitte verbindlich übernehmen

Der Nutzer bevorzugt:

- linke Lagerfeuer-/Waldzone der alten Fassung,
- sichtbar scharf und detailreich,
- kein starker HDR-Look,
- Blitz rechts diffuser,
- insgesamt hochwertig, atmosphärisch und zurückhaltend,
- Hintergrund soll unterstützen, nicht gegen Logo/Text kämpfen.

Der letzte Screenshot zeigt, dass die linke Seite wieder deutlich besser sichtbar ist, aber vermutlich durch die doppelte Bildlage etwas „überlagert“ erscheint.

## Aktuelle Hero-CSS-Struktur

Die relevante CSS-Stelle liegt direkt in `docs/gewitterradar-overview.html` unter:

- `.hero`
- `.hero:before`
- `.hero:after`
- `.hero-grid`

Vor weiteren Änderungen diese vier Blöcke lesen und gezielt nur dort arbeiten.

## Nächster Arbeitsauftrag

1. Repo/Branch frisch lesen, nicht aus Erinnerung ändern.
2. Aktuellen Hero-CSS-Stand prüfen.
3. Überlagerung links verifizieren.
4. Mit minimalem Eingriff die Doppelbildwirkung reduzieren oder auf eine Einzelbildlösung zurückführen.
5. Pages + lokale Hilfe synchron halten.
6. CI beobachten.
7. Hi-Res-Retention darf nicht brechen.
8. Keine anderen V4.11-Funktionen anfassen.
