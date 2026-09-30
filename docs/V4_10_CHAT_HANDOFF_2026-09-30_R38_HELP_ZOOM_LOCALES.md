# Gewitterradar V4.10 – R38 Hilfe-Fassung und Zoom-Beschriftungen · Chat-Übergabe

Stand: 2026-09-30

## Verbindlicher Ausgangspunkt
- Globalen Daimos-Bootstrap `TheDaimos/project-defaults/START_HERE.md` bei neuer Sitzung zuerst laden.
- Vorgänger: `docs/V4_10_CHAT_HANDOFF_2026-09-30_R37_UNIFIED_COMPASS_HELP.md`.
- Entwicklungszweig vor R38: `feature/v4.10.02-modularization`, HEAD `0f61ca2986420d7aa893ea1a72546f9799246f31` (R37 und nachfolgende Dokumentation).
- Technischer, grüner R37-Kandidat auf `deploy/dev`: `bbe2730c57030b0bb72d0d1f74de3c949fb3e294`.
- R37-Layout nach Nutzeraussage geräteübergreifend abgenommen: Instrument oben, „Letzter Treffer“/„Kompass“ darunter, danach Gradzahl, Legende sowie untere Azimut-/Distanzkarten. Hilfe war mengenfrei, Reihenfolge R37 bestätigt.
- Neuer bestätigter Hilfetextentwurf mit genau vier Einträgen; vorher waren es fünf. Nutzer meldete außerdem fehlende Übersetzung der Leaflet-Kartenzoom-Mouse-over-Texte (+/−).
- `main` nicht anfassen, kein Merge, Release oder Tag ohne explizite Freigabe.

## R38 Änderungsumfang
- Build `V4.10.02-MODULAR-DEV-R38-2026-09-30`; Feature-Cache `41002r38`; Runtime-Basis bleibt `41002r13`; Modulset `D38A-5E9B`.
- Modulversionen: `core.manifest` 1.2.44; `ui.i18n-settings` 1.3.3; `location.radii-map` 1.0.3.
- `V410_HELP_INSTRUMENTS` hat in allen 19 Sprachen/Dialekten vier Einträge: Kompass auswählen; Medaillon & Pfeil auswählen (zusammengelegt); Vollbilddarstellung (Größeneinstellung ausschließlich für Vollbild und separates Kartenfenster); Aura-Effekte (Design bleibt bei deaktivierter Aura erhalten und kann weiterhin gewechselt werden). Keine fixen Medaillon-/Pfeilanzahlen.
- Verbindliche deutsche Fassung:
  1. Kompass auswählen — „Tippe oder klicke auf den Kompass, um zwischen den unterschiedlichen Designvorlagen zu wählen.“
  2. Medaillon & Pfeil auswählen — „Genau wie bei der Kompassauswahl genügt es, auf das Medaillon zu tippen oder zu klicken, um die Designauswahl zu öffnen. Medaillon und Pfeil können unabhängig voneinander ausgewählt und frei miteinander kombiniert werden.“
  3. Vollbilddarstellung — „Die Darstellungsgröße von Kompass und Medaillon lässt sich im jeweiligen Auswahlmenü individuell einstellen. Diese Einstellung gilt ausschließlich für die Vollbilddarstellung und das separate Kartenfenster.“
  4. Aura-Effekte — „Aura-Effekte steuern die zusätzlichen Leucht- und Lichteffekte des Kompasses. Das ausgewählte Kompassdesign bleibt beim Ausschalten der Aura erhalten und kann auch bei deaktivierten Aura-Effekten jederzeit geändert werden.“
- `V410_UI_TRANSLATIONS`: `tooltip.map_zoom_in`/`tooltip.map_zoom_out` in 19 Sprachvarianten.
- Leaflet +/− haben eigene Standardtexte. `_syncMapZoomTooltips` setzt `title`, `aria-label` und Leaflet-Control-Optionen. Synchronisierung bei asynchronem `_initMap` direkt nach `L.map` und bei Sprachwechsel über `_applyStaticTranslations` → `_syncV410Tooltips`.
- Keine Änderungen an Kompassgröße, Assets, Kalibrierung, Geometrie und R37-Layout.
- Quellfassung, native Integration und Dashboard, Manifest und Laufzeitmanifest, versionsgebundene Cachekennung, JSON-Vertrag, Assetindex und SHA256-Liste synchron.

## Technische Prüfungen und weitere Schritte
- **Verbindlicher technischer R38-Code-Commit / DRA-Kandidat:** `4a51acbba65af7eff7186b1d3608366840a22e1f`.
- Prüfverlauf: Ursprünglicher Code-Commit `5e4601f3b8fe05bbf2761398e96b1aec9d9d3f13` scheiterte an zwei versehentlich doppelten Anführungszeichen im Modulmanifest. Commit `07a56967213cff697b856e90ed42f99fe13662ae` korrigierte das Manifest und die daraus folgenden Prüfsummen; dort wurde lediglich die Reihenfolge von zwei SHA256-Einträgen beanstandet. Finaler Commit `4a51acbba65af7eff7186b1d3608366840a22e1f` sortiert den Index identisch zur deterministischen CI-Ausgabe. Die beiden Zwischenstände wurden **nicht** für DRA bereitgestellt.
- **Alle fünf zentralen CI-Prüfpfade SUCCESS am finalen exakten technischen Commit**: Shared Frontend Runs 36693885291 und 36693893606 (beide SUCCESS, einschließlich Browserprüfungen beider Auslieferungsformen und R38-Zoom-Sprachtest); Integration Runs 36693885361 und 36693893582 (SUCCESS); Diagnostic contract Run 36693893639 (SUCCESS); Source archive contract Run 36693893600 (SUCCESS); Hi-Res asset retention Runs 36693885278 und 36693893668 (SUCCESS).
- R38-Browser-Rückfalltest: +/− Mouse-over `title` und `aria-label` beim Wechsel Deutsch → Englisch → Französisch und zurück. Sprach- und Hilfevertrag fordert vier Einträge je Sprache und verhindert harte Design-/Pfeilmengen.
- `deploy/dev` wurde **erst nach bestätigtem CI-Erfolg**, ohne Force, auf exakt `4a51acbba65af7eff7186b1d3608366840a22e1f` gesetzt und per GitHub-Zweigabfrage bestätigt. `main` blieb dabei auf `17f8e7be5f41d7a4f27bf2343f3c462be8a6e28c`. Die erneute DRA-Zweigaktualisierung kann weitere CI-Durchläufe desselben unveränderten Codes auslösen; ursprüngliche Prüfnachweise siehe oben. Reine Dokumentations-Commits bleiben ausschließlich auf dem Entwicklungszweig; der DRA-Stand ist technischer Code-Commit.
- Die technische Prüfung ersetzt keine Realgeräte-Abnahme; Realabnahmen erst nach Nutzerbestätigung als erfolgreich kennzeichnen.
- Realabnahme offen: Hilfe-R38-Inhalt und Reihenfolge; Zoom-Mouse-over in mehreren Sprachen bei Erststart und Sprachwechsel sowie in separatem Kartenfenster; goldenes Hilfe-Icon, übrige Desktop-Mouse-over-Texte; Aura-/Kompass-Regression (Design wählen, Aura AUS, Design erhalten, anderes Design bei Aura AUS wählen, Aura AN, neues Design erhalten).
- Kein V4.10 FINAL ohne vollständige Realtests und ausdrückliche Freigabe.

## Erinnerungsschutz
- Frühzeitig bei knappem Chatkontext warnen, nicht mit erfundenem Prozentwert; neue relevante Befunde dauerhaft im Repo sichern.
