# Gewitterradar V4.10 – Chat-Übergabe R33 · Hilfe, Icon & Mobile-Feinschliff

Stand: 2026-09-29 19:17 CEST

## Verbindlicher Projektstand

- Repository: `TheDaimos/gewitterradar`
- Entwicklungszweig: `feature/v4.10.02-modularization`
- technischer R33-Kandidat / DRA-HEAD: `017c46062121d0720563aa79bf828124c994fa2d`
- Übergabe-Commit auf dem Entwicklungszweig: `1c22716f4d9e74951dc8782492742fbe05cd1df8`
- DRA-Zweig: `deploy/dev`
- `deploy/dev` bleibt auf dem vollständig geprüften technischen Kandidaten `017c46062121d0720563aa79bf828124c994fa2d`; der Entwicklungszweig liegt nur durch diese Dokumentationsübergabe einen Commit davor.
- Build: `V4.10.02-MODULAR-DEV-R33-2026-09-29`
- sichtbare Version: `V4.10.02`
- Feature-Cache: `41002r33`
- Runtime-Basis: `41002r13`
- Modulsatz: `D33A-5E9B`
- `main` wurde nicht verändert.
- Es wurde kein öffentlicher V4.10-Release und kein V4.10-Tag erzeugt.

## CI-Status des exakten HEAD

Der exakte **technische R33-Kandidat** `017c46062121d0720563aa79bf828124c994fa2d` ist in allen fünf zentralen Prüfpfaden grün:

- Validate shared Gewitterradar frontend — SUCCESS
- Validate Gewitterradar integration — SUCCESS
- Diagnostic contract — SUCCESS
- Source archive contract — SUCCESS
- Hi-Res asset retention — SUCCESS

Damit ist R33 technisch als DRA-Testkandidat bereit.

---

## Was seit R32 geändert wurde

### 1. Hilfe-Icon für „Kompass, Medaillon & Pfeile“

Für den neuen V4.10-Hilfeabschnitt wurde ein eigenes Icon im bestehenden Premium-Stil aufgenommen.

Kanonischer Hi-Res-/Vektor-Master:

`artwork/help-icons/hires/help-instruments-v410-compass.svg`

Regeln:

- Master bleibt dauerhaft erhalten.
- Master ist im Hi-Res-Retentionsvertrag registriert.
- Dokumentation und Provenienz wurden ergänzt.
- Die Hilfe verwendet **nicht** den Master direkt als Laufzeitgrafik.

Laufzeitdarstellung:

- verlustfreies PNG
- 68 × 68 Pixel
- Darstellung mit 34 × 34 CSS-Pixeln
- damit exakt 2× Retina
- direkt als Data-URI in der Hilfe eingebettet
- Abschnittsschlüssel: `instruments-v410`

Der bisherige einfache Diamant-Platzhalter wird dadurch in der realen Hilfe durch das neue Kompass-Icon ersetzt.

Betroffene Dokumentation:

- `artwork/help-icons/README.md`
- `artwork/help-icons/provenance.json`
- `tests/contracts/hires-asset-retention-v4.07.56.json`

### 2. Reihenfolge im Hilfeabschnitt korrigiert

Der Abschnitt „Kompass, Medaillon & Pfeile“ hat jetzt in **allen 19 Sprachvarianten** dieselbe fachliche Reihenfolge:

1. Kompass auswählen
2. Medaillon auswählen
3. Pfeil auswählen
4. Vollbild-Instrumente
5. Aura-Effekte

Aura-Effekte stehen damit bewusst am Ende, weil sie nur ein Darstellungszusatz sind und nicht Teil der eigentlichen Instrumentauswahl.

Für Deutsch lautet der aktuelle Block sinngemäß:

- Kompass auswählen — Kompass-Popup öffnen; Auswahl bleibt auch bei Aura AUS erhalten.
- Medaillon auswählen — Auswahl aus 28 Medaillon-Designs.
- Pfeil auswählen — 18 Pfeilvarianten unabhängig vom Medaillon.
- Vollbild-Instrumente — Kompass und Medaillon frei verschiebbar und skalierbar.
- Aura-Effekte — steuern nur Leucht-, Halo- und Aura-Darstellungen und beeinflussen die Kompassauswahl nicht.

### 3. Mobile Kompassansicht nach Wegfall des alten Selectors verdichtet

Der alte Kompass-Selector oberhalb des Kompasses ist bereits entfernt. Dadurch blieb auf sehr schmalen Mobilanzeigen unnötiger Leerraum oberhalb des Instruments.

R33 nimmt ausschließlich diesen ungenutzten Kopfraum zurück:

```css
@media (max-width:520px) and (hover:none) and (pointer:coarse) {
  .compass-head:not(:has([data-warning-test]:not([hidden]))) {
    min-height:6px;
    height:6px;
    margin-bottom:0;
  }

  .compass-head:not(:has([data-warning-test]:not([hidden]))) + .compass-wrap {
    padding-top:0;
  }
}
```

Wichtig:

- nur sehr schmale Touch-Geräte bis 520 px
- iPad/Tablet/Desktop bleiben geometrisch unverändert
- Kompass selbst wird nicht skaliert oder neu kalibriert
- vorhandene Instrumentgeometrie bleibt unverändert
- sichtbare Diagnose-Testtaster verhindern absichtlich das Zusammenklappen des Kopfbereichs

### 4. Kompass/Aura aus R32 bleibt unverändert gültig

Bereits in R32 umgesetzt und weiterhin Bestandteil von R33:

- Aura AUS erzwingt **nicht** mehr Kompass A.
- Kompassdesign kann auch mit Aura AUS gewechselt werden.
- Gewähltes Kompassdesign bleibt beim Aura-Umschalten erhalten.
- oberer alter Kompass-Selector entfernt.
- „Selector-Design“ aus den Einstellungen entfernt.
- Kompassauswahl erfolgt über das Kompass-Popup.
- Hilfe und Mouse-over-/Tooltip-Texte wurden auf 19 Sprachvarianten erweitert bzw. abgesichert.

### 5. V4.10-Beitrag / Versionshistorie

Der öffentliche V4.10-Beitrag beschreibt:

- in wenigen Monaten stark gewachsenes Gewitterradar
- Umbau vom Monolithen in **23 klar abgegrenzte Module**
- eigene Identität und Versionierung je Modul
- gezieltere Weiterentwicklung, Prüfung und Diagnose
- zusätzliche sichtbare UI- und Bedienverbesserungen
- erweiterte Kompassauswahl
- 28 Medaillon-Designs
- 18 Pfeilvarianten
- verschiebbare und skalierbare Vollbild-Instrumente
- Verbesserungen auf Desktop, iPad und Android
- überarbeitete Tooltips, Pop-ups und Einstellungen

Bewusst **nicht** im öffentlichen Text:

- keine Formulierung „über Jahre gewachsen“
- keine 504er-Fit-Matrix
- kein DRA-Bezug

Roadmap nach V4.10:

**„Implementierung von Wetterdiensten & Wetterereignissen durch WeatherRouter.“**

---

## DRA / Testbereitstellung

R33 ist bereits über den normalen DEV-Kanal erreichbar:

- DRA-Zweig: `deploy/dev`
- DRA zeigt auf den vollständig geprüften technischen Kandidaten:
  `017c46062121d0720563aa79bf828124c994fa2d`
- Der Entwicklungszweig enthält darüber hinaus nur diese Übergabedokumentation.

Keine weitere Promotion ist für den aktuellen Realtest nötig.

---

## Was jetzt real geprüft werden soll

### Priorität A – Android / sehr schmales Mobilgerät

1. R33 über DRA installieren.
2. Home Assistant bzw. Frontend hart neu laden.
3. Kompassfeld prüfen:
   - Leerraum über dem Kompass ist deutlich reduziert.
   - kompletter Informationsblock wirkt nach oben gezogen.
   - Feld wirkt kompakter.
   - Kompassgröße und interne Geometrie sind unverändert.
   - keine Überlappungen.
4. „Hilfe & Hinweise“ öffnen:
   - neuer Abschnitt zeigt das neue goldene Kompass-Icon statt des Diamanten.
   - Icon wirkt bei 34 × 34 CSS-Pixeln scharf.
   - keine abgeschnittenen Kanten / kein schwarzer oder weißer Hintergrund.
5. Hilfeabschnitt öffnen und Reihenfolge prüfen:
   - Kompass
   - Medaillon
   - Pfeil
   - Vollbild-Instrumente
   - Aura-Effekte

### Priorität B – iPad

Prüfen, dass R33 **keine** ungewollte Geometrieänderung verursacht:

- Kompassfeld unverändert gegenüber R32.
- Abstände und Harmonie der Felder unverändert.
- keine mobile 520-px-Kompaktregel greift.
- Hilfe-Icon korrekt dargestellt.

### Priorität C – Desktop

- Kompassfeld und Geometrie unverändert.
- Hilfe-Icon korrekt.
- Hilfe-Reihenfolge korrekt.
- Tooltips / Mouse-over-Texte weiterhin sprachabhängig.

### Priorität D – Aura-/Kompass-Regressionsprüfung

- Kompassdesign auswählen.
- Aura ausschalten.
- Design bleibt erhalten.
- mit Aura AUS anderes Kompassdesign auswählen.
- Aura einschalten.
- Design bleibt weiterhin erhalten.

---

## Entscheidungsstand V4.10

Der frühere Modularisierungs-Schlachtplan ist **offiziell abgeschlossen** und wird durch R33 nicht wieder geöffnet.

R33 ist ein separater finaler V4.10-Polish-/Abnahmeblock.

V4.10 darf erst nach erfolgreicher Realgeräte-Abnahme final veröffentlicht werden.

Vor einer finalen Veröffentlichung:

1. Android / schmale Ansicht abnehmen.
2. iPad auf unveränderte Geometrie prüfen.
3. Desktop prüfen.
4. neues Hilfe-Icon und Hilfe-Reihenfolge abnehmen.
5. Aura-/Kompass-Regression prüfen.
6. danach finalen Kandidaten festschreiben.
7. erst mit ausdrücklicher Freigabe von Christian:
   - Merge nach `main`
   - V4.10 Release/Tag
   - Golden-Master-Prozess nach `docs/GOLDEN_MASTER_POLICY.md`

---

## Harte Leitplanken

- Keine ungefragte Änderung an `main`.
- Kein Release/Tag ohne ausdrückliche Freigabe.
- Keine Hi-Res-/Mastergrafik löschen.
- Master-Asset-Regel aus `docs/ASSET_RETENTION_POLICY.md` beachten.
- Native Integration und Dashboard müssen synchron bleiben.
- DRA bleibt Pflichtweg für Realtests/Bereitstellung.
- Keine Änderung an iPad-/Desktop-Geometrie für den Mobile-Fix.
- Bei langen Chats frühzeitig eine neue Repo-Übergabe erzeugen, bevor Kontext verloren geht.

---

## Empfohlener nächster Schritt

**R33 auf Android, iPad und Desktop real abnehmen.**

Wenn diese Abnahme grün ist, ist der nächste Arbeitsblock nicht mehr „weitere Modularisierung“, sondern die eigentliche **V4.10-Finalisierung / Release-Vorbereitung**.
