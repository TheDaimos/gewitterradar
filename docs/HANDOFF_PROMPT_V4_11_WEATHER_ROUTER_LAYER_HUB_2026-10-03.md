Bootstrap: Daimos

Projekt: Gewitterradar

Repository:
TheDaimos/gewitterradar

Entwicklungszweig:
feature/v4.11-development

Wir setzen Gewitterradar V4.11 am neuen WeatherRouter Layer Hub fort.

Lies ZUERST vollständig:

1. docs/V4_11_CHAT_HANDOFF_2026-10-03_WEATHER_ROUTER_LAYER_HUB.md
2. docs/V4_11_WEATHER_ENGINE_PLANUNGSBESCHLUSS_2026-09-30.md
3. docs/V4_11_CHAT_HANDOFF_2026-09-30_R1_WEATHER_ENGINE_REALTEST.md
4. frontend/modules/fullscreen/map-display.js
5. frontend/modules/weather/consumer-client.js
6. frontend/modules/weather/precipitation-layer.js
7. frontend/module-manifest.js
8. frontend/gewitterradar.js

Technischer Code-Checkpoint vor der Übergabedokumentation:

0982674a7108718153d18c0de82dc571620ea729

An diesem Checkpoint:
- feature/v4.11-development = deploy/dev
- Shared Frontend SUCCESS Run 37122404161
- Gewitterradar Integration SUCCESS Run 37122404142
- Hi-Res SUCCESS Run 37122360728
- Gewitterradar V4.11.08 DEV
- Project Hub V0.2 RC8 bereits integriert
- ui.project-hub 1.1.6
- Project-Hub-Cache-Buster 41108r8
- Project Hub öffnet sowohl über die Signatur als auch über den oberen Gewitterradar-Titel

NEUER AUFTRAG

Den bestehenden Kartenansichts-/Layer-Schalter um einen WeatherRouter-Einstieg erweitern.

Bestehendes Menü:
- Standard
- Groß
- Vollbild

Wenn WeatherRouter über den bestehenden Consumer-V1-Discovery-Vertrag als vorhanden und kompatibel erkannt wird, soll darunter WeatherRouter erscheinen.

Beim Klick soll das bestehende Menü an derselben Stelle in eine WeatherRouter-Unteransicht wechseln/überblenden.

Zielbild:
- rötlich halbtransparente WeatherRouter-Fläche
- subtiler lila/magenta Glow
- Zurück-Navigation
- Status des WeatherRouter
- Hybrid aus Schnellzugriff und Fachkategorien
- Schnellzugriff z. B. Niederschlag, Wolken, Wind, UV – aber nur, wenn diese Capabilities tatsächlich vorhanden sind
- Fachbereiche dynamisch aus WeatherRouter-Katalog/Metadaten, z. B. Wetter, Weltraum, Umwelt & Pollen, Naturgefahren
- Provider nicht im normalen UI auswählen; WeatherRouter Auto-Routing bleibt maßgeblich

ARCHITEKTUR

Keine zweite WeatherRouter-Erkennung bauen.

Bestehenden Consumer verwenden:
frontend/modules/weather/consumer-client.js

Bestehenden Niederschlagsrenderer wiederverwenden:
frontend/modules/weather/precipitation-layer.js

fullscreen.map-display bleibt Eigentümer des bestehenden Kartenansichtsmenüs.
WeatherRouter-Fachlogik nicht dort hineinwachsen lassen.

Bevorzugt ein eigenes neues WeatherRouter-Layer-Menü-Modul mit kleinem Adapter-/Extension-Hook in fullscreen.map-display.

Erst aktuelle Architektur prüfen, dann Modulname und Hook verbindlich festlegen.

WICHTIGE REGELN

- Project Hub nicht verändern.
- About nicht verändern.
- Standard/Groß/Vollbild nicht umbauen, wenn ein kleiner Hook genügt.
- WeatherRouter-Layer dürfen den Kartenmodus nicht ändern.
- Bei fehlendem WeatherRouter bleibt das bestehende Menü exakt wie bisher.
- Bei vorhandenem, aber nicht bereitem WeatherRouter darf Gewitterradar nicht fehlschlagen.
- outside_coverage entfernt nicht das gesamte WeatherRouter-Menü.
- Keine private/optionale Providerlogik hart codieren.
- Nur kartentaugliche Capabilities anbieten.
- Niederschlag nicht neu implementieren.
- Dashboard und native Integration synchron halten.
- Kein unnötiger Versions-/CI-Großlauf für kleine UI-Zwischenstände.
- Für visuelle Iterationen kurzen DRA-Entwicklungsweg verwenden; Konsolidierung erst nach Abnahme.

ARBEITSWEISE

1. Repo und Übergabe vollständig lesen.
2. Bestehendes map-display-Menü exakt prüfen.
3. Bestehende WeatherRouter Discovery/Capabilities prüfen.
4. Architekturvorschlag kurz gegen den aktuellen Code validieren.
5. Dann selbstständig implementieren.
6. Zunächst WeatherRouter-Erkennung + Menüwechsel + Back-Navigation.
7. Danach vorhandenen Niederschlags-Layer als ersten echten Layer anbinden.
8. Danach dynamische Kategorie-/Capability-Struktur ergänzen.
9. Android/iPad/Desktop berücksichtigen.
10. DRA-Testkandidat bereitstellen.
11. Mich erst dann für reale HA-Abnahme hinzuholen, sofern vorher kein echter Architekturblocker entsteht.

Wichtig:
Die Funktion ist laut Übergabe noch nicht implementiert. Nicht annehmen, dass ein früherer Teilstand bereits existiert.

Nach dem Lesen zuerst den aktuellen Repo-HEAD und den daraus abgeleiteten Startpunkt nennen und dann loslegen.
