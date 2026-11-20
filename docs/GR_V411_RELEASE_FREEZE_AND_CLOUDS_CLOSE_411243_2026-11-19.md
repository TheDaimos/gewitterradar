# GewitterRadar 4.11 – Release-Freeze und gezielte Wolken-Close-Korrektur

**Release-Freeze-Kandidat:** GR **4.11.243 DEV** / HA **0.25.150** / Runtime `411243r1` / Modulset `E411-243A1`.

**Geschützte Ausgangsbasis:** GR **4.11.242 DEV**, Commit [`af11c8d6c952a8384889354f71f20309e34d03e9`](https://github.com/TheDaimos/gewitterradar/commit/af11c8d6c952a8384889354f71f20309e34d03e9). Vorangegangene Referenzstände und das WR-/GR-Schutzpaar bleiben unangetastet.

## Freeze-Entscheidung

- Ab dieser Version keine neuen Funktionen und keine gestalterischen Erweiterungen innerhalb der Reihe 4.11. Ausschließlich konkret nachgewiesene FINAL-Blocker, Sicherheits-/Regressionskorrekturen und Release-Metadaten sind zulässig.
- Der Betreiber meldete am 19.11.2026 alle selbst geprüften Module als in Ordnung. Das ist eine Betreiber-Sichtprüfung, kein Ersatz für die noch ausstehenden HA-Real-/Android- und automatisierten Tests.
- `Eye Control` ist der **verbindliche Eigenname** des Einstellungsfensters; `eye-hub-locales.js` setzt ihn absichtlich in allen 19 Sprachvarianten. Keine Übersetzungskorrektur nötig.
- Die endgültige Kennzeichnung **4.11 FINAL**, ein Final-Tag und eine PROD-Promotion erfolgen erst nach separater Betreiberfreigabe. Der Freeze-Kandidat ist noch kein FINAL-Release.

## P2-Abschlusskorrektur in 4.11.243

Im Wolkenmenü wurde bisher das generische Premium-Close-Bild angezeigt, abweichend vom runden Hi-Res-Close-Symbol des Einstellungsmenüs. Das Wolkenmenü verwendet nun dieselbe bestehende, von der UI gelieferte `ABOUT_CLOSE_IMAGE`-Quelle wie Einstellungen und Wind; nur bei fehlender Runtime-Quelle bleibt die bisherige Premium-Grafik als Fallback. Klickverhalten, Schaltfläche, Fokus, Drag, Sichtbarkeit, Wolkenprovider und Einstellungen bleiben unverändert.

Die Wolken-Browser-Testassertion vergleicht die konkrete Close-Grafik mit der bestehenden Wind-/Settings-Quelle. Keine anderen UI-Grafiken wurden ersetzt.

## Nachweis und offene Punkte

- `node scripts/build-frontend.mjs`: **PASS**.
- `node scripts/test-frontend-build.mjs`: **PASS** (deterministischer Build, Frontend-Spiegel und DRA-Identitäten).
- `CHROME_PATH=/usr/bin/chromium node scripts/test-clouds-eye-browser.cjs`: **nicht ausführbar**, Test-Fixture bricht vor Browserstart ab: `Cannot find module 'leaflet/dist/leaflet.js'`.
- Reale Android-Sichtprüfung des Wolken-Close-Symbols und der Schließen-Funktion auf DEV VM109: **offen**.
- WetterRouter und PROD VM101: **unverändert**.

**Weitere FINAL-Gates:** Modultestmatrix, Sprachkatalog-Gates, CI-Status und DRA-/HA-DEV-Abnahme vollständig verifizieren, bevor die Versionskennung `DEV` entfernt wird. Keine grünen Gates ohne tatsächlichen Nachweis.
