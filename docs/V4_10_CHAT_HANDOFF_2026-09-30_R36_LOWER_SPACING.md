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
- Zentrale CI-Ergebnisse für R36 **erst nach der Code-Übertragung ermitteln**. Hier wird keine erfolgreiche Prüfung vorweggenommen.
- `deploy/dev` erst nach den erfolgreich verifizierten zentralen CI-Pfaden auf den genauen technischen R36-Code-Commit setzen. DRA ist verbindlich.
- Bei der Realabnahme zuerst Standard-iPad und iPad Pro: obere R35-Anordnung erhalten; Gradzahl und Zusatzinformationen tiefer, mehr Freiraum unter dem Kompass; Azimut/Distanz nahe der unteren Feldkante ohne Anschnitt.
- Danach Desktop mit gleicher Zielwirkung, anschließend Android ohne Regression und noch offener Hilfe-Abschnitt, anschließend Aura AUS → Designwechsel → Aura AN mit persistentem Design.
- Keine Realabnahme vorweg als bestanden darstellen; keine Änderung an `main`, kein Merge, Release oder Tag ohne ausdrückliche Freigabe.
- Erinnerungsschutz aktiv; wichtige neue Befunde rechtzeitig erneut in Git sichern.
