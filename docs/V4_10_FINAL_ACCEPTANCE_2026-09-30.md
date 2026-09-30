# V4.10 – reale Abschlussabnahme und Finalisierungsfreigabe

Stand: 2026-09-30.

## Nutzerfreigaben

- Die sechs vereinbarten realen V4.10-Prüfpunkte sind ausdrücklich abgenommen (siehe R40-Übergabe).
- Die zusätzliche R40-Sichtprüfung wurde anschließend vom Nutzer ausdrücklich als abgeschlossen bestätigt. Das betrifft den deutsch-/englischsprachigen Abschnitt der sieben geplanten V4.11-Punkte und den beibehaltenen historischen V4.10-Rückblick einschließlich „28 Medaillon-Designs und 18 Pfeilvarianten“.
- Der Nutzer hat danach ausdrücklich beauftragt: „Bitte alle erforderlichen Aufgaben und Vorgänge übernehmen, alles finalisieren und die V4.10 veröffentlichen.“
- Ein weiterer Realtest ohne technischen neuen Befund ist nicht gefordert.
- Der bestehende DRA-Kanal `deploy/dev` bleibt unverändert. V4.11 beginnt erst nach V4.10 FINAL und verwendet anschließend denselben Kanal.

## Referenzen / Schutzgrenzen

- Abgenommene technische R40-Codebasis: `bcf30fe2dc1b6b56625edf209b2373b956fb7fd4`.
- Dokumentarischer Entwicklungs-HEAD zur Übergabe: `fcd4f86c3bc4f89f5d021d204cf55d7683d29c48`.
- Öffentlicher vorheriger main-Stand vor Finalisierung (erneut unmittelbar vor Promotion prüfen): `17f8e7be5f41d7a4f27bf2343f3c462be8a6e28c`.
- Öffentliche Hauptfenster-Plakette V4.10, nicht V4.10.02.
- Keine neuen V4.11-Funktionen, keine Umbauten an abgenommener Produktfunktion, keine Änderungen an historischen Versionsinhalten.
- `docs/RELEASE_PROCESS.md`, `docs/GOLDEN_MASTER_POLICY.md`, `docs/ASSET_RETENTION_POLICY.md`, `docs/DIAGNOSTIC_PROTECTION_V4_07_56.md` gelten uneingeschränkt.

## Release-Gates

Die Freigabe erlaubt die Ausführung des kanonischen Release-Prozesses, sie ersetzt nicht die technischen Gates. Unbedingt PRE-MERGE-Archiv vor jeder main-Veränderung; danach Prüfungen am exakten neuen main-Commit; erst dann Golden Master, identischer öffentlicher Tag und GitHub-/HACS-Release. Publikationsstatus nur nach tatsächlicher Verifikation auf FINAL setzen.
