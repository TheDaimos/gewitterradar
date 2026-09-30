# Gewitterradar V4.10 – R39 Modulstatus / Cachekennung · Chat-Übergabe

Stand: 2026-09-30

## Ausgangslage
- Bei neuem Chat zuerst Daimos-Bootstrap `TheDaimos/project-defaults/START_HERE.md`, anschließend diese vollständige Übergabe und die Vorgängerdatei `docs/V4_10_CHAT_HANDOFF_2026-09-30_R38_HELP_ZOOM_LOCALES.md` lesen.
- Repository `TheDaimos/gewitterradar`; Entwicklungszweig `feature/v4.10.02-modularization`. R38-Technikstand in DRA/`deploy/dev`: `4a51acbba65af7eff7186b1d3608366840a22e1f`; Entwicklungszweig vor R39: `c62ff50c459aeae1490efe71e28df4c72807f2c0` (R38-Dokumentation).
- Neuer Realbefund: Screenshot „Module & Versionen“ zeigt 23/23 geladen, 1 Abweichung und „Modulsatz-ID 717A-ADEA → D38A-5E9B“.
- Codeanalyse: `717A-ADEA` entspricht **exakt** dem Versions-Fingerabdruck mit nur `location.radii-map` in `1.0.2` statt erwarteter `1.0.3`; erwarteter R38-Fingerabdruck aus 23 Sollmodulen ist `A4D6-144F`. Da `location.radii-map` bislang noch per dauerhaftem Basis-Cache `41002r13` statt Feature-Cache geladen wurde, konnte die alte Version im Browser verbleiben.
- Unabhängiger Diagnosefehler: `_refreshModuleRuntimeProbe` verglich den berechneten Fingerabdruck geladener Module mit der **manuell vergebenen Release-Modulsatz-ID** im installierten Laufzeitmanifest. Unterschiedliche Kennungsarten; auch bei 23/23 korrekten Modulen entsteht damit ein falscher Hinweis auf veraltete Laufzeit.
- R37-Kompasslayout auf Geräten bereits abgenommen, R38 neue vier Hilfeeinträge und +/− Übersetzungen technisch grün; die R38-Realabnahme ist noch offen. Die screenshotbasierte R38-Abweichung wird nicht als vollständiger Geräteausfall interpretiert.

## R39 – technische Korrektur
- Build `V4.10.02-MODULAR-DEV-R39-2026-09-30`, Feature-Cache `41002r39`, Basis bleibt `41002r13`, Modulsatz-ID `D39A-5E9B`. Sichtbare Version V4.10.02.
- `core.manifest` 1.2.45, `diagnostics.module-view` 1.3.5, `location.radii-map` bleibt 1.0.3, `ui.i18n-settings` bleibt 1.3.3.
- `frontend/gewitterradar.js` importiert **beide** bearbeiteten Module (`diagnostics/module-view.js` und `location/radii-map.js`) ausdrücklich mit `GEWITTERRADAR_FEATURE_CACHE`. Unveränderte Basismodule behalten ihre Basiskennung.
- Diagnose vergleicht nun `loadedId` nur mit `expectedId` (Fingerabdruck ↔ Fingerabdruck), `installedId` nur mit `APPLICATION_META.moduleSetId` (Release-ID ↔ Release-ID) und Laufzeitrevision mit Laufzeitrevision. Bei konsistentem System zeigt die Zusammenfassung die Release-ID `D39A-5E9B`; bei abweichender Modulversion werden geladener und erwarteter Fingerabdruck eingeblendet. Ein bereits als Versionskonflikt ausgegebenes Modul wird nicht zusätzlich als zweiter allgemeiner Laufzeitkonflikt gezählt.
- Zusätzliche Vertragsprüfungen: beide Feature-Cache-Imports, getrennter Kennungsvergleich, aktualisierte Modulversionen. Browserlayouttest kontrolliert konsistente Release-Anzeige und die Darstellung einer künstlich abweichenden Fingerabdruck-Kombination.
- Beide Lieferformen (Home-Assistant-Integration und Dashboard) sind mit Quellfassung, Manifesten, SHA256-Vertrag und Assets abzugleichen; keine Änderungen an Design, Kompassgröße, geometrischen Assets, Hilfeinhalten oder Zoom-Übersetzungen.

## Abnahme und Freigaberegel
- R39 Code-Commit, fünf zentrale CI-Pfade und DRA-Referenz erst nach erfolgreichem Lauf verbindlich nachtragen.
- Fünf zentrale Pfade: Validate shared Gewitterradar frontend (einschließlich Browserprüfungen beider Lieferformen), Validate Gewitterradar integration, Diagnostic contract, Source archive contract, Hi-Res asset retention.
- Erst nach grünen Prüfungen `deploy/dev` ohne Force auf **genau** technischen R39-Code-Commit verschieben und Referenz abfragen. Spätere Dokumentations-Commits nicht an `deploy/dev` hängen. `main` unverändert lassen; kein Merge, Tag, Release ohne ausdrückliche Freigabe.
- Realtest: R39 via DRA installieren, Home-Assistant-Frontend auf allen betroffenen Geräten **vollständig neu laden**, „Module & Versionen“ öffnen. Erwartet: **23/23, Modulsatz konsistent, Modulsatz-ID D39A-5E9B, 0 Abweichungen**. Falls abweichend, Diagnose über Abweichungsknopf als JSON exportieren und im Chat bereitstellen. Neue Versionskennung allein ersetzt keine reale Bestätigung.
- Danach R38-Hilfetexte (vier Einträge), goldenes Hilfe-Icon, Zoom-Mouse-over +/− bei Erststart und nach Sprachwechsel einschließlich separatem Kartenfenster sowie Aura-/Kompass-Regression prüfen (Design wählen → Aura AUS → Design bleibt → bei Aura AUS anderes Design → Aura AN → neues Design bleibt).
- Erinnerungsschutz aktiv: frühzeitig vor knappem Chatkontext warnen und wichtige Ergebnisse im Repository dokumentieren.
