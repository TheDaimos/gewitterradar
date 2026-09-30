# Gewitterradar V4.10 – R35 Kompass-Bedienung · Chat-Übergabe

Stand: 2026-09-30

## Verbindlicher Stand

- Repository: `TheDaimos/gewitterradar`
- Entwicklungszweig: `feature/v4.10.02-modularization`
- technischer R35-Kandidat / DRA-Zweig `deploy/dev`: `b4399fbc0445e1e1676c245b438dc2880690ec48`
- Build: `V4.10.02-MODULAR-DEV-R35-2026-09-30`
- Feature-Cache: `41002r35`
- Runtime-Basis: `41002r13`
- Modulsatz: `D35A-5E9B`
- `ui.skeleton`: 1.1.12
- Sichtbare Version: V4.10.02
- `main` unverändert; kein Merge, Release oder Tag.

Der frühere V4.10-Modularisierungs-Schlachtplan ist abgeschlossen. R35 gehört zum separaten V4.10-Abnahmeblock.

## Anlass und Korrektur

R34 hob auf dem iPad das gesamte Kompassfeld an, beließ aber den leeren Kopfbereich. Außerdem standen „Letzter Treffer“ und „Kompass“ unter dem Instrument. Christian meldete dieselbe Anordnung auf Desktop.

R35 ordnet die beiden Schalter im iPad-/Desktop-Querformat oberhalb des Instruments an, zieht den ungenutzten Kopfbereich zusammen und erhält die horizontale Instrumentmitte. Der Abstand zwischen Schaltern und sichtbarem Kompassrand wurde nach einem Browserbefund vergrößert, sodass keine Überlappung entsteht. Die schmale Android-Ansicht bis 520 px bleibt von dieser neuen Querformatregel unberührt. Kompassgröße, interne Geometrie, Assets und Kalibrierung wurden nicht verändert.

## Technische Abnahme

Für den exakten technischen Commit `b4399fbc0445e1e1676c245b438dc2880690ec48` sind alle fünf zentralen Prüfpfade **SUCCESS**:

1. Validate shared Gewitterradar frontend
2. Validate Gewitterradar integration
3. Diagnostic contract
4. Source archive contract
5. Hi-Res asset retention

Die Browserprüfung für beide Auslieferungsformen deckt die neue Position oberhalb des sichtbaren Kompassrandes und die Vermeidung von Überlappungen ab. Quellcode, native Integration, Dashboard, Laufzeitmanifest und Prüfsummen sind synchron. `deploy/dev` wurde nach den grünen Prüfungen auf genau diesen Commit gesetzt und gegengeprüft.

## Nächste reale Abnahme über DRA

1. R35 über DRA installieren und das Home-Assistant-Frontend vollständig neu laden.
2. iPad im Querformat: Schalter oberhalb des Kompasses, leeren Kopfbereich reduziert, Kompass horizontal mittig, kein Anschnitt/Überlappen.
3. Desktop: dieselbe Schalterreihenfolge und saubere Abstände, sprachabhängige Mouse-over-Texte.
4. Android: R33-Hilfe-Icon und Reihenfolge weiter korrekt; schmale Kompassansicht unverändert.
5. Aura-/Kompass-Regression: Design wählen, Aura AUS, Design erhalten, anderes Design bei Aura AUS wählen, Aura AN, Design erhalten.
6. Erst nach erfolgreicher Realgeräte-Abnahme V4.10 FINAL vorbereiten. Merge, Release und Tag erfordern Christians ausdrückliche Freigabe.

R34 `a6e4eefec0ba442424cb2d570f8d73093bab0799` und R33 `017c46062121d0720563aa79bf828124c994fa2d` bleiben als frühere geprüfte Stände erreichbar.

## Erinnerungsschutz

Frühzeitig warnen, falls dieser Chat zu lang wird; wichtige neue Befunde vor Kontextverlust erneut in Git festhalten.
