# Gewitterradar V4.10 – R34 iPad-Querformat: Kompassblock höher

Stand: 2026-09-30

## Ausgangspunkt

Bei der realen iPad-Abnahme von R33 war der rechte Kompassblock unter „Letzte Treffer“ zu tief. Christian wünscht die beiden Umschalter „Letzter Treffer“ und „Kompass“ sowie das Instrument weiter oben. Der Kompass soll horizontal mittig im Feld bleiben.

## Umsetzung

- Ausschließlich für iPad-Geräte im Querformat bei 1101–1366 px Viewportbreite erhält `.compass-panel` unten zusätzlichen Innenabstand (`clamp(34px,6vh,64px)`).
- Die gemeinsame Unterkante der zwei Spalten bleibt erhalten. Der Kompassblock beansprucht mehr Höhe; das darüberliegende Trefferfeld nimmt entsprechend weniger Leerraum auf.
- `.compass-instrument` bleibt mit `margin-inline:auto` horizontal mittig.
- Kompassgröße, innere Geometrie, Grafiken und Kalibrierung wurden nicht verändert. Android und Desktop erhalten keine neue Regel.
- Das Modul `ui.skeleton` steht auf 1.1.11. Build `V4.10.02-MODULAR-DEV-R34-2026-09-30`, Feature-Cache `41002r34`, Modulsatz `D34A-5E9B`, Runtime-Basis `41002r13`.
- Native Integration und Dashboard-Auslieferung sind mit dem gemeinsamen Quellstand und aktualisierten Prüfsummen synchronisiert.

## Technischer Kandidat und Prüfung

Technischer Commit: `a6e4eefec0ba442424cb2d570f8d73093bab0799`

Alle fünf zentralen CI-Prüfpfade für genau diesen Commit: **SUCCESS**:

1. Validate shared Gewitterradar frontend
2. Validate Gewitterradar integration
3. Diagnostic contract
4. Source archive contract
5. Hi-Res asset retention

`deploy/dev` zeigt auf diesen Commit. R33 `017c46062121d0720563aa79bf828124c994fa2d` bleibt als vorheriger geprüfter Rückfallstand erreichbar. `main` blieb unverändert. Kein Release, Tag oder Merge.

## Noch offen: reale iPad-Abnahme über DRA

1. R34 über DRA installieren und Home Assistant auf dem iPad vollständig neu laden.
2. Im Querformat prüfen, ob die Umschalter und der Kompass sichtbar höher stehen.
3. Prüfen, ob das Instrument im Feld horizontal mittig und vollständig sichtbar ist.
4. Prüfen, ob „Letzte Treffer“, Kompassfeld und Verlaufsfeld ohne Überlappung oder abgeschnittene Inhalte bleiben.
5. iPad-Hochformat, Android und Desktop auf unveränderte Geometrie prüfen.
6. Danach die übrige R33-Abnahme (Desktop, sprachabhängige Mouse-over-Texte, Aura-/Kompasswechsel) fortsetzen.

Der frühere Modularisierungs-Schlachtplan bleibt abgeschlossen. V4.10 FINAL erst nach Realgeräte-Abnahme und ausdrücklicher Freigabe durch Christian.
