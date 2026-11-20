# Gewitterradar V4.11.89 DEV – P7-010: sicherer regionaler V2-/V1-Ebenenwechsel

**Stand:** 17.10.2026 · **Auslieferung:** `TheDaimos/gewitterradar@deploy/dev` · **Runtime:** `41189r1` · **Modulsatz:** `E411-89A1` · **HA-Integration:** `0.25.7`

## Ausgangsbefund (WR → GR, 17.10.2026)

WR 0.10.153 / Loader 156 zeichnete im HA-API-Monitor 14 echte V2-Anfragen auf: acht `partial` mit ausschließlich einer regionalen DWD-Ebene; sechs `unavailable` mit anschließendem V1-Rückfall. Ein regionales V2-`partial` kann nach bisherigem GR-Code die ganze V1-Karte ersetzen, obwohl die DWD-Abdeckung nur einen kleinen Teil des Sichtfelds umfasst. Das ist **kein** erfolgreicher geografisch vollständiger V2-Mosaiknachweis.

Verbindliche WR-Gegenantwort: `TheDaimos/weather-router-dev/docs/p7-010-coordination/WR_TO_GR_2026-10-17_ANTWORT_AUF_GR_V41188_UEBERNAHME_UND_REALTESTSTAND.md`, WR-Commit `4614b7d1c62b`.

## Implementierte Änderungen im bestehenden GR-Renderer

- Geografischer Vorabnachweis: Berechne die **Vereinigung der WR-verifizierten Bounding-Box-Abdeckungen** über das vollständige sichtbare Kartenrechteck. Berücksichtige Überdeckung, Karten-Antimeridian, die minimale zulässige Zoomstufe und tatsächliche Ebenentransparenz. Ist das gesamte Sichtfeld geometrisch nicht abgedeckt, wird die alte V1-Ebene **nicht entfernt**.
- V2-Raster-Kachelprüfung: Der Canvas-Zeichner ermittelt die **Vereinigung tatsächlich erfolgreich gezeichneter Zielrechtecke pro Kachel**. Nur vollständige geometrische Kacheln gelten als erfolgreich, nicht beliebige Zeichenvorgänge oder erfolglos geladene, transparente Canvas-Kacheln.
- Vor dem Ebenentausch müssen alle erwarteten sichtbaren Kacheln vorliegen und geometrisch vollständig gezeichnet sein; ein Leaflet-`load`-Ereignis sowie zwei zufällige Kacheln reichen nicht. Regionale BBOX-Hüllen werden **nicht als pixelgenau geprüfte Niederschlagsdaten** bezeichnet: über NoData-Transparenz kann der Client ohne verifizierbare Provider-Maske weiterhin nicht sicher entscheiden.
- Fachlich voll abgedeckte regionale Sichtfelder dürfen auf V2 wechseln; globale DWD-Randtreffer ohne globale V2-Grundlage dürfen die V1-Karte nicht verdrängen. Es gibt **kein eigenes GR-Quellenranking** und keine zweite Mosaikarchitektur.
- Diagnosephasen und Gründe: `viewport_coverage`, `v2_partial_no_full_viewport`, `staged_tiles_actual_coverage`, `v2_swap_prevented_uncovered_tiles` sowie `v1_fallback_started`; Korrelation und V1-Rückfall erhalten.
- Bestehendes ausdrückliches Nutzer-Opt-in für `time.max_background_age_seconds=43200` bleibt standardmäßig ausgeschaltet. Aktuelle Radarfrische bleibt `max_data_age_seconds=900`.
- Neues isoliertes Regressionstestmodul prüft DWD-Rand, zusammenhängende Teilgebiete, überlappende/gewrapte Abdeckung und unvollständige gegenüber vollständigen Canvas-Bildausschnitten.

## Grenzen / noch offene Realabnahme

**CODE-PASS oder GitHub-CI-PASS sind kein HA-REAL-PASS.** Das Verhalten unter dem realen Cuba–Atlantik–Europa-Kartenausschnitt, Zoom 10/11/12/13/15/17 sowie Desktop, Android und iPad bleibt zu prüfen. Die 0.10.153-HA-Spuren belegen noch **keine** neu installierte zentrale WR-UTC-P0-Normalisierung. Keine Installation einer veralteten WR 0.10.152.

Gemeinsame Realtests: mit und ohne Opt-in; korrelierte V1-/V2-API-Monitor-Einträge; regionale DWD-Ecke; NASA-IMERG als ausdrücklich gekennzeichnete Grundlage nur bei verifiziertem Opt-in; Bildkachelfehler; Grenzen für Laufzeit/Kacheln; FLK-01 separat.

**C.K. – Eine Idee weiter gedacht.**
