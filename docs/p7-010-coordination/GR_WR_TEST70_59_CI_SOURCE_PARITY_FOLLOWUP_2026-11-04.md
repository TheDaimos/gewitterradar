# GR/WR TEST70-59 – CI-Reparatur, V2-Quellparität und Freigabestatus

**Datum:** 2026-11-04
**GR-Repository:** `TheDaimos/gewitterradar@deploy/dev`
**Nachgewiesener Code-HEAD vor diesem Bericht:** `347b235f034bb220f53dc3eba803d023e0e1ab1e`
**WR-Referenz-HEAD (unverändert):** `49947b38651a892e98b8e41f7b9d82b7f5928caf`
**Status:** CODE-FORTSCHRITT / CI NOCH NICHT FINAL ABGENOMMEN / KEINE INSTALLATIONSFREIGABE

## Ziel und unveränderte Vereinbarungen
WR ist alleinige Autorität für Provider, Frameauswahl, Gültigkeit, `valid_until`, explizite Verbote und Autorisierung. GR setzt **keine** eigenen Alters- oder Quellenlimits durch. Die technischen Debounce- und Retry-Backoff-Werte sind keine Datenaltergrenzen. Neue Ebenen dürfen erst nach vollständiger Kachelbereitschaft wechseln; selektiver Retry behält erfolgreich empfangene Kacheln. Keine Wiederholung von TEST69.

## Konkrete Arbeiten in diesem Durchlauf
1. Live-HEADs auf beiden `deploy/dev`-Branches rückgelesen; TEST70-58-Berichte und CI-Jobs bis zu Fehlerzeilen geprüft.
2. Veraltete `900`-Sekunden-Annahmen aus `scripts/test-v41106-weather-engine-diagnostics.mjs`, `scripts/test-p7-010-v2-age-comparison.mjs` und `scripts/test-p7-010-opera-functional.mjs` entfernt; die boolesche WR-Satellitenpräferenz und die WR-Hoheit werden geprüft.
3. OPERA-Lifecycle-Tests an aktuellen Pane-Lifecycle und selektive Koordinaten-Retries angepasst.
4. `scripts/test-v41193-runtime-reload.mjs` Regex-Escaping korrigiert; `scripts/verify-frontend.mjs` von historischen festen Versionsmarkern auf tatsächliche zusammenhängende Releasefelder umgestellt sowie Layer-/Display-Marker aktualisiert.
5. **Kanonische `src/p7-010`-Quellen mit Auslieferung synchronisiert:** `raster-mosaic-contract.js`, `raster-mosaic-consumer.js`, `raster-mosaic-grid-layer.js`, `raster-mosaic-tile-loader.js`, `raster-tile-url.js`, `opera-diagnostic-tile.js`. Drei Auslieferungskopien waren in den geprüften Fällen bereits untereinander identisch; zuvor waren mehrere `src`-Dateien älter.
6. V2-Mosaik-, GridLayer-, Consumer- und RF01-Fixtures auf obligatorisches von WR geliefertes `times.valid_until` korrigiert; die alten GR-eigenen Altersverbote aus Tests entfernt.
7. Tile-Loader-Tests an das beobachtete Resultat `request_budget_exhausted` nach **begrenzten** selektiven Retries angepasst, ohne Retrys und Transportbudgets zu deaktivieren.
8. `SHA256SUMS_FRONTEND.txt` aus der **tatsächlich ausgeführten öffentlichen** GitHub-Build-Ausgabe rekonstruiert: exakt 250 Prüfsummenzeilen aus `Validate shared Gewitterradar frontend`, Run `41870012838`; keine geschätzten Hashes.

## Reproduzierbare Belege
- Ursprünglich fehlgeschlagene Gesamtprüfungen: `41862950983` (Shared), `41862951151` (HA Integration).
- Erfolgreicher bereits bestehender WR-Autoritäts-Vertrag: `41861627865` (TEST70-58).
- Spätere erfolgreiche HA-Integrationsprüfung auf Zwischenstand: `41870499316` (kein Gesamt-Release-Beweis).
- Spätere P7-010-Prüfungen gelangten sukzessive bis Mosaik-Consumer/Validator/GridLayer/RF01/Tile-Loader; die Fehler im älteren Test-Set wurden anhand der exakten Joblogs korrigiert.
- **Neuster Code-HEAD vor Dokumenterstellung:** `347b235f034bb220f53dc3eba803d023e0e1ab1e`.
- Zu diesem HEAD waren beim letzten Live-Abruf die vier Runs **`41870756096` (P7-010), `41870755981` (Settings), `41870756025` (HA-Integration), `41870755996` (Shared Frontend)** noch `in_progress`. Kein Erfolg wird vor Abschluss behauptet.

## Noch erforderliche Gates
- **P0:** Die vier öffentlichen Gesamtprüfungen für **denselben HEAD** vollständig grün bestätigen, jede verbleibende Fehlstelle anhand der aktuellen Logs beheben; danach aktuellen HEAD und Checksummen nochmals lesen.
- **P0:** WR-Python-Gesamtregression auf erlaubtem WSL2-/DEV-Prüfstand nachweisen. **Keine privaten GitHub Actions ausführen. Ausschließlich öffentliche GitHub Actions im Public-Repository.**
- **P0:** GR 4.11.136 erst nach konsistentem Releasebuild und Manifest-/Runtime-/Asset-/DRA-Abgleich als installierbar markieren. Hier wurde keine neue Version als real installiert nachgewiesen.
- **P0:** HA DEV VM 109 mit tatsächlicher WR/GR-Installation, Desktop, Android, iPad, Europa-/Deutschlandmosaik, HTTP503/401/403, neuen Zyklen, Framewechsel, Selective Retry, nahtlosem Handover und Export2Git untersuchen.
- **P0:** Diagnose- und Realtestexporte ausschließlich nach `TheDaimos/Project-Log-And-Export@main`. **HA PROD VM 101 unangetastet.** Kein operativer Wetterwarn-Release.
- Die oben aufgeführten Schritte sind **keine** Wiederholung abgeschlossener wissenschaftlicher TEST69-Arbeiten.

**Freigabeurteil:** Keine Installations- oder Produktivfreigabe. GitHub CI und Quellcode-Prüfung ersetzen keinen HA-DEV-Realtest.
