# TEST70-64 – Öffentliche CI: RF04-Regionalhold an WR-Vertrag angepasst

Datum 2026-11-04 · Repository `TheDaimos/gewitterradar` · Branch `deploy/dev`

## Befund aus Public CI
`41888685822` (Code `a673dec9be77731f8c4aea8e7caa62b9c5423470`) war FAILURE. Aus den öffentlichen Joblogs: RF03 PASS, RF04 `scripts/test-p7-010-rf-04-regional-hold.mjs` FAILURE (`1 initial timeout retained`, actual false, expected true). RF04 setzte entgegen dem verbindlichen Vertrag lokal 45s-Haltefrist, 900s-Datenalter, GR-seitige Consent-Sperre und eine nicht mehr vorhandene Timeout-Sonderfreigabe voraus.

## Umsetzung
Commit `0ea38979d3cda7c0ffef38088d25bc33d5307e37`: RF04-Regression durch aktuelle `times.valid_until`-Zuständigkeit von WR ersetzt. Abgedeckt: vollständig geladener Alt-Layer, reduzierte Ersatzabdeckung, unverlängerte Ablaufzeit, Gültigkeit oberhalb 900 Sekunden, ausdrückliches Ende nach WR-Ablauf, unvollständige Tiles, nicht gemountete Karten, vollständige Ersatzabdeckung, fehlender WR-Gültigkeitswert. Keine Änderungen der produktiven GR-Age-Policies. Keine Wiederholung von TEST69.

## CI und verbleibende Nachweise
Der neue Commit löst die öffentlichen GR-Workflows erneut aus. Erfolg darf ausschließlich nach tatsächlichem Ergebnis der jeweiligen GitHub Actions behauptet werden. WR-Python-Gesamtregression, Release-/Asset-Parität und HA DEV VM109 Realtests stehen weiter aus; daher keine Installationsfreigabe.

**Private GitHub Actions verboten – ausschließlich Public Repo für CI.** Exporte ausschließlich `TheDaimos/Project-Log-And-Export@main`; PROD VM101 nicht verändern.
