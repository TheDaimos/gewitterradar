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
- R38-Code-Commit und GitHub-CI-Ergebnisse nach Erstellung gesondert nachtragen. Keine Prüfung oder Bereitstellung vorzeitig als erfolgreich bezeichnen.
- Prüfungen: Shared Frontend einschließlich beide Auslieferungs-Browserläufe; Integration; Diagnostic contract; Source archive contract; Hi-Res asset retention.
- R38-Browser-Rückfalltest: +/− Mouse-over `title` und `aria-label` beim Wechsel Deutsch → Englisch → Französisch und zurück. Sprach- und Hilfevertrag fordert vier Einträge je Sprache und verhindert harte Design-/Pfeilmengen.
- Erst nach CI-Erfolg `deploy/dev` ohne Force auf genau den technischen R38-Code-Commit bewegen und Referenz erneut prüfen. Reine Dokumentations-Commits bleiben ausschließlich auf dem Entwicklungszweig.
- Realabnahme offen: Hilfe-R38-Inhalt und Reihenfolge; Zoom-Mouse-over in mehreren Sprachen bei Erststart und Sprachwechsel sowie in separatem Kartenfenster; goldenes Hilfe-Icon, übrige Desktop-Mouse-over-Texte; Aura-/Kompass-Regression (Design wählen, Aura AUS, Design erhalten, anderes Design bei Aura AUS wählen, Aura AN, neues Design erhalten).
- Kein V4.10 FINAL ohne vollständige Realtests und ausdrückliche Freigabe.

## Erinnerungsschutz
- Frühzeitig bei knappem Chatkontext warnen, nicht mit erfundenem Prozentwert; neue relevante Befunde dauerhaft im Repo sichern.
