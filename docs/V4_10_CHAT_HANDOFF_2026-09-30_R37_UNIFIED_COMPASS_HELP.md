# Gewitterradar V4.10 – R37 einheitliche Kompassanordnung und dauerhafte Hilfe

Stand: 2026-09-30

## Ausgangspunkt und Nutzerentscheidung
- Vorherige Übergabe: `docs/V4_10_CHAT_HANDOFF_2026-09-30_R36_LOWER_SPACING.md`.
- Verbindliche technische Ausgangsbasis (R36): `c80509d52f18e1d8b508caea08acef0404c7d2e6`; Entwicklungszweig vor R37: `413746e766fb8d642d0851ac8aa62224821e5fda` (jüngere Commits nur Abnahmedokumentation).
- R36-Kompasslayout für Desktop, Standard-iPad und iPad Pro wurde zuvor einzeln abgenommen.
- Aktueller Android-Screenshot (R36) zeigt die vom Nutzer jetzt für **alle Ansichten** gewünschte Ordnung: Kompass oben, darunter nebeneinander „Letzter Treffer“ und „Kompass“, anschließend mit Abstand Gradzahl, Himmelsrichtung, Legende sowie Azimut- und Distanzkarten.
- Die frühere R35-Vorgabe mit Schaltern *oberhalb* des Instruments wird damit ausdrücklich **ersetzt**. Die neuen R37-Layouts erfordern neue Realabnahme, auch wenn R36 zuvor abgenommen war.

## R37 – technischer Umfang
- Entwicklungszweig: `feature/v4.10.02-modularization`.
- Build: `V4.10.02-MODULAR-DEV-R37-2026-09-30`.
- Feature-Cache: `41002r37`; Runtime-Basis bleibt `41002r13`; Modulsatz: `D37A-5E9B`.
- Versionen: `core.manifest` 1.2.43; `ui.skeleton` 1.1.14; `ui.i18n-settings` 1.3.2.
- `ui.skeleton`: Die nur für breite Querformatansichten eingeführte R35-Regel `order:-1` mit Schaltern über dem Kompass ist entfernt. Die natürliche DOM- und Grundstilreihenfolge gilt damit auf Android, Tablet/iPad und Desktop einheitlich. R36-Abstände für Readout, Legende, Azimut-/Distanzkarten und die untere Panelkante bleiben bestehen. Kompassgröße, SVG/PNG, interne Kalibrierung, Pfeile und Kompasszentrum werden nicht verändert.
- `ui.i18n-settings`: In `V410_HELP_INSTRUMENTS` sind die Medaillon- und Pfeilbeschreibungen in allen **19 Sprachvarianten** ohne fixe Design- oder Pfeilanzahl formuliert. Die fünf Hilfeeinträge und ihre Reihenfolge bleiben erhalten. Historische Aussagen im allgemeinen Versionsverlauf werden nicht nachträglich umgeschrieben.
- Die Frontend-Vertragsprüfung verbietet künftig Ziffern in den beiden betreffenden Hilfebeschreibungen. Die Browserlayout-Prüfung verlangt die Schalter unterhalb des Instruments für Desktop, zwei iPad-Profile und Android; Überlappung und Gerätebreite bleiben kontrolliert.
- Quell- und beide Auslieferungsfassungen, Versions-/Modulmanifest, Laufzeitmanifest, Datei- und SHA256-Verträge sind synchron.

## Freigaberegeln und Realabnahme
- Nach dem technischen R37-Commit fünf zentrale CI-Prüfpfade prüfen: Shared Frontend (inkl. beide Browserauslieferungen), Integration, Diagnostic contract, Source archive contract, Hi-Res asset retention.
- Erst nach nachgewiesenem Erfolg den verbindlichen DRA-Zweig `deploy/dev` ohne Force auf **genau den technischen Code-Commit** setzen, Referenz erneut abfragen. Spätere reine Übergabe-Commits gehören nicht auf den DRA-Zweig.
- DRA-Realtest: Standard-iPad, iPad Pro, Desktop und Android. Je Gerät: zentriertes Instrument zuerst, Schalter nebeneinander darunter, Abstand zur Gradzahl/Legende, untere Azimut-/Distanzkarten nahe der Panelunterkante ohne Anschnitt, keine Geometrieänderung.
- Auf Desktop gesondert Hilfe-Icon, Reihenfolge und sprachabhängige Mouse-over-Texte; Hilfe auf Deutsch und einer zweiten Sprache mit mengenfreien Medaillon-/Pfeiltexten prüfen.
- Aura-/Kompass-Regression weiter offen: Design wählen → Aura AUS (Design bleibt) → bei Aura AUS anderes Design → Aura AN (neues Design bleibt).
- Keine offene Realabnahme als bestanden behandeln. `main` nicht verändern. Kein Merge, Tag, Release und keine V4.10-FINAL-Vorbereitung vor abgeschlossener Realabnahme und ausdrücklicher Freigabe von Christian.

## Erinnerungsschutz
- Frühwarnung rechtzeitig vor knappem Chatkontext, nicht mit erfundener Prozentzahl; neue dauerhafte Befunde nach Prüfung in Git sichern.
