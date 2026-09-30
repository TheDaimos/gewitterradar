# Gewitterradar V4.10 – R36 unterer Kompassbereich · technische Übergabe

Stand: 2026-09-30

## Ausgangspunkt
- R35-Übergabe: `docs/V4_10_CHAT_HANDOFF_2026-09-30_R35_COMPASS_CONTROLS.md`.
- Technischer R35-Kandidat: `b4399fbc0445e1e1676c245b438dc2880690ec48`; R35-Übergabe-HEAD: `2438960ecea5ea47c944303f94b1152a37ba3c6e`.
- Fotos von Standard-iPad und iPad Pro: die oberen Schalter sind richtig positioniert, aber zu viel Leerraum unter Azimut-/Distanzkarten; Gradzahl, Himmelsrichtung, Beschriftung und Legende sind unterhalb des Instruments zu dicht. Desktop ebenfalls betroffen.
- R35 ist nur teilweise real abgenommen. Keine V4.10-FINAL-Freigabe.

## R36 – gezielte Änderung
- Entwicklungszweig: `feature/v4.10.02-modularization`.
- Build: `V4.10.02-MODULAR-DEV-R36-2026-09-30`.
- Feature-Cache: `41002r36`; Runtime-Basis: `41002r13`; Modulsatz: `D36A-5E9B`.
- `ui.skeleton`: 1.1.13; `core.manifest`: 1.2.42.
- iPad im zweispaltigen Querformat: vorherige untere Reserve `40px + clamp(34px,6vh,64px)` wird zu `16px`; Readout-Abstand `-4px` → `20px`; Kartenabstand `11px` → `11px + clamp(34px,6vh,64px)`. Intrinsische Gesamthöhe bleibt dadurch rechnerisch gleich.
- Desktop in der R35-Querformatregel ab 960px: unterer Reserveabstand `54px` → `16px`; Readout `-4px` → `20px`; Kartenabstand `11px` → `25px`. Intrinsische Gesamthöhe rechnerisch gleich.
- Die oberen beiden Schalter, die horizontale Instrumentmitte, Assets, Instrumentgröße und interne Kalibrierung sind unverändert. Die schmale Android-Regel bis 520px bleibt unverändert.
- Quellfassung, native Auslieferung, Dashboard-Auslieferung, Modul- und Laufzeitmanifest, Cache, Vertragsdatei, Prüfsummen sowie die vorhandene Layout-Testumgebung wurden abgeglichen.

## Prüfung und Bereitstellung
- Fünf zentrale CI-Prüfpfade am R36-Code-Commit `c80509d52f18e1d8b508caea08acef0404c7d2e6`: SUCCESS. Nachweise: Shared Frontend Run 36684673296 (zusätzlich 36684680159 SUCCESS), Integration Run 36684679988, Diagnostic contract Run 36684680173, Source archive contract Run 36684680007, Hi-Res asset retention Run 36684680176.
- `deploy/dev` wurde nach bestätigtem CI-Erfolg ohne Force auf exakt `c80509d52f18e1d8b508caea08acef0404c7d2e6` gesetzt und anschließend per GitHub-Zweigabfrage verifiziert. DRA ist verbindlich; eine reale Installation/Abnahme wird hier nicht vorweggenommen.
- Durch die Aktualisierung von `deploy/dev` können weitere CI-Durchläufe desselben unveränderten Code-Commits anlaufen; diese sind gesondert zu beobachten.
- Bei der Realabnahme zuerst Standard-iPad und iPad Pro: obere R35-Anordnung erhalten; Gradzahl und Zusatzinformationen tiefer, mehr Freiraum unter dem Kompass; Azimut/Distanz nahe der unteren Feldkante ohne Anschnitt.
- Danach Desktop mit gleicher Zielwirkung, anschließend Android ohne Regression und noch offener Hilfe-Abschnitt, anschließend Aura AUS → Designwechsel → Aura AN mit persistentem Design.
- Keine Realabnahme vorweg als bestanden darstellen; keine Änderung an `main`, kein Merge, Release oder Tag ohne ausdrückliche Freigabe.
## Teilabnahme – Desktop R36 (2026-09-30)
- Christian hat einen aktuellen Desktop-Screenshot der R36-Kompassansicht zur Verfügung gestellt und bestätigt: „Passt und sitzt.“
- Sichtgeprüft und vom Nutzer akzeptiert: obere Bedienknöpfe oberhalb des Instruments; zentriertes, nicht beschnittenes Instrument; deutlich besserer Abstand zu Gradzahl/Himmelsrichtung und Zusatzinfos; Azimut-/Distanzkarten weit unten mit sauberer Restkante und ohne sichtbare Überlappung. **Desktop-Kompasslayout R36: abgenommen.**
- Nicht automatisch damit abgenommen: Desktop-Hilfe-Icon, Hilfeabschnitt und sprachabhängige Mouse-over-Texte; Standard-iPad/iPad-Pro mit R36, Android sowie Aura-/Kompass-Regression. Kein Gesamt-FINAL.
## Teilabnahme – Standard-iPad R36 (2026-09-30)
- Christian hat ein aktuelles Foto der Standard-iPad-Querformatansicht nach DRA-R36 gezeigt und ausdrücklich bestätigt: „iPad passt auch“.
- Sichtgeprüft und akzeptiert: R35-Schalter oberhalb des Instruments; zentriertes, vollständig sichtbares Instrument; Gradzahl/Himmelsrichtung und Legende mit mehr vertikalem Abstand zum Kompass; Azimut-/Distanzkarten weiter unten, nahe der Feldunterkante; keine sichtbare Überlappung oder Beschneidung. **Standard-iPad Kompasslayout R36: abgenommen.**
- Layout-Teilabnahme, keine technische pixelgenaue Instrumentkalibrierung aus Foto abgeleitet.
- Bereits dokumentiert: Desktop-Kompasslayout R36 abgenommen. **Noch offen:** iPad Pro mit R36, Hilfe-Icon/Hilfeabschnitt, sprachabhängige Desktop-Mouse-over-Texte, Android/schmales Mobilgerät sowie Aura-/Designwechsel. Kein V4.10 FINAL.
- Nächster Realtest: iPad Pro mit R36, danach restliche offene Prüfpunkte.

- Erinnerungsschutz aktiv; wichtige neue Befunde rechtzeitig erneut in Git sichern.
