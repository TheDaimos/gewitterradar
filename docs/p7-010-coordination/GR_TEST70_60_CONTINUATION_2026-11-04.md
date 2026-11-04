# GR TEST70-60 – Fortsetzung GR/WR-Abschluss

Datum: 04.11.2026 · `TheDaimos/gewitterradar@deploy/dev`

## Korrekturen
Ausgangs-HEAD `0dc351b3d93a195b2f4a33a852392d9f74cd0a75`. Der öffentliche Lauf `41870957433` (HA-Integrations-Validierung) war SUCCESS, die Läufe `41870957021` (Shared Frontend) und `41870957298` (Settings) waren FAILURE.

- `scripts/verify-about-golden-v408.cjs`: aktuelle V4.11-Identitätsfelder aus `frontend/version.js` und Runtime-Manifest abgleichen; die anschließende historische About-Pixel-/Geometrieprüfung bleibt aktiviert.
- `scripts/test-p7-010-rf-02.mjs`: obsolete lokale Hold-/Altersregeln durch konkrete Prüfungen des `times.valid_until`-Vertrags, geografische Retention und WR-Expiry ersetzen. Keine festen 45-/900-Sekunden-Sperren.
- Commitfolge `34d938e559c1c4d8e97805a3aa19e306b262a6db`, `477a2bc9dac703c5d183d122ccd5b66049b9413b`, `a8e69eefbae4171c64ea69ec568005c0996a5a7f`.
- Gemeinsamer WR-Gegenstellen-Fix `66b6ca2bfe6a1a1224a328f055447bad9b5c0ea8` auf `TheDaimos/weather-router-dev@deploy/dev`.

## Nachweise
Der öffentliche GR-Integrationslauf `41873918008` für `a8e69eef...` war bei der letzten Live-Abfrage **SUCCESS**. Die anderen für denselben Commit gestarteten Läufe `41873918171` (Shared Frontend), `41873918005` (P7-010), `41873918160` (Settings) waren zum Zeitpunkt dieser Berichtserstellung noch **in progress**. Keine implizite Erfolgserklärung.

## Freigabesperre
GR 4.11.136 noch kein auf VM109 realgetesteter Release; WR 0.10.285 ebenso nicht. Noch erforderlich: relevante CI auf demselben Commit, WR WSL2/Python-Gesamtregression, Version-/Asset-/DRA-Parität, danach echter HA-DEV-VM109-Test mit Desktop, Android und iPad, OPERA/DWD-Mosaik, Retry/Abbruch/401/403, Framewechsel und Seamless Handover. Keine Installationsfreigabe ohne diese Gates.

**Keine privaten GitHub Actions; nur öffentliche GitHub Actions im Public-Repository.** Exporte ausschließlich `TheDaimos/Project-Log-And-Export@main`. PROD VM101 bleibt unangetastet. TEST69 ist abgeschlossen.

## TEST70-61 – CI-Nachkorrektur
Der Public-Frontend-Lauf `41873918171` deckte einen SyntaxError (`Invalid regular expression flags`) im neuen About-Identitäts-Test auf. Dieser Defekt wurde mit `227368c17074b0dfcc30260c0e862fafb5093c27` korrigiert. Die neue öffentliche Prüfserie `41874806297` (Shared Frontend), `41874806399` (Settings) und `41874806309` (HA-Integration) lief bei der letzten Abfrage noch; die Resultate sind daher nicht als bestanden behauptet. Die davor erfolgreich nachgewiesene HA-Integration des Commits `25bd743c...`: `41874341179` SUCCESS. Die isolierte P7-010-Abnahme für `a8e69eef...` wurde abgebrochen und ist **kein PASS**.

Offene Gates unverändert: CI-Gesamterfolg auf identischem Code-Commit, WR-Python-Regressionssuite, Release-/Asset-/DRA-Parität, HA-DEV VM109 Live-Tests; **keine Installationsfreigabe**.
