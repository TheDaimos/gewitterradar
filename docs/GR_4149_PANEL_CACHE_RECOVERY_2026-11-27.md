# GewitterRadar V4.14.9 DEV – Hilfe bei veralteten Frontend-Dateien

## Ausgangslage (VM109, Betreiber)

Chrome und Android zeigen nach Updates wiederholt ein Panel-Startproblem. In Chrome hilft der normale Hard-Reload (`Strg+Umschalt+R`) nicht; bei aktivierter DevTools-Option `Netzwerk → Cache deaktivieren` startet GewitterRadar. Der beobachtete Zusammenhang spricht für veraltete Browserressourcen oder Modulintegrität, beweist aber noch keinen konkreten Cache-Layer oder Serverfehler.

## Gezielte und sichere Fehleroberfläche

- Das native `frontend/panel.js` zeigt statt eines nicht interaktiven Fehlertextes eine zugängliche Fehleroberfläche mit **„Frontend neu laden“**.
- Die Aktion navigiert die bestehende HA-Seite mit neuem `_gr_recovery`-Parameter. Der HA-Pfad, alle bestehenden Parameter und das Fragment bleiben erhalten. Dies ist ein **best effort**-Cache-Busting der HTML-Navigation, **keine behauptete vollständige Browser-Cache-Löschung**.
- Die Oberfläche zeigt weiterhin die manuelle Chromium-Anleitung `F12 → Netzwerk → Cache deaktivieren` und einen einklappbaren technischen Fehlertext. Browser setzen absichtlich keine API bereit, um den gesamten HTTP-Cache einer Site gezielt aus einer Webseite zu löschen.
- Kein `localStorage.clear()`, kein `sessionStorage.clear()`, kein Löschen von IndexedDB, Service-Workern oder CacheStorage anderer HA-Integrationen. HA-Login, Vault und Benutzerzustand bleiben erhalten.
- Die Sicherungslogik greift nur **wenn das native Panel-Modul bereits geladen hat und die Panel-Laufzeit mit einem Fehler abbricht**. Ein fehlgeschlagener Download von `panel.js` selbst kann darüber nicht abgefangen werden.

## Schutz und Tests

- Additive Änderung nur am Panel-Startfehlerfenster; Radar/WR/SQLite-Migration und bisheriger Update-Watch unverändert.
- `scripts/test-gr-panel-cache-recovery.mjs`: URL-Parameter, Route, Fragment, Fehlertext, sichere Bedienung und Nicht-Löschen von Browserspeicher.
- DEV-Version: **V4.14.9**, HA-Integration **0.25.195**, Runtime **4149r1**, Modulset **E414-9A1**.
- Frontend-Spiegel und Prüfsummen müssen über `.github/workflows/ma-v4149-dev-build-sync.yml` regeneriert werden; `.github/workflows/ma-v9-consolidated-regression.yml` erstellt nach grüner Prüfung einen DEV-Kandidaten vom selben Commit.

## DEV-Realabnahme

1. Installation nur in VM109.
2. Start über Chrome mit normalem Cache und Android testen; ggf. Startfehlerfenster mit **„Frontend neu laden“** verwenden.
3. Verifizieren, dass die Seite nicht endlos neu lädt und sich bei anhaltender Cache-Störung die Chrome-Anleitung zeigt.
4. Normale Ortssuche, SQLite-/Local-To-do-Status, Mond, Wetter, Blitzortung und bisherige Referenzmodule überprüfen.
5. Bei weiterhin wiederholter Cache-Störung DevTools-Netzwerk-/Response-Header sowie die konkret fehlgeschlagene URL mit Statuscode erfassen. Der Button ist eine Hilfe zur Selbstrettung, **kein Ersatz für die Ursachenanalyse**.
