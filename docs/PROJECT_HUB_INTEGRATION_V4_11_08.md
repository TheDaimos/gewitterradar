# Daimos Project Hub – Gewitterradar V4.11.08

Baseline: `freeze/v4.11-pre-project-hub-2026-10-02` @ `d5113b164046e478fe018cb12cea91eb85697a3f`.

## Architektur
`ui.project-hub@1.0.0` liegt in `frontend/modules/ui/project-hub.js` und übernimmt ausschließlich Signatur-Einstieg, lokale Konfiguration, passive Health-Probe, Online-/Offline-Auflösung und separates Öffnen. Signaturgrafik und Skeleton-Markup bleiben unverändert; das Modul aktiviert `.settings-signature-wrap` erst nach dem bestehenden Skeleton-Aufbau. About und `ui.controls` enthalten keine Project-Hub-Logik.

## Runtime
- Konfiguration: `frontend/project-hub/project-hub-config.json`
- Offline: `frontend/project-hub/offline/index.html`
- Online: `https://thedaimos.github.io/gewitterradar/`
- Probe: `https://thedaimos.github.io/gewitterradar/health.svg`
- Zeitgrenze: 2500 ms
- Öffnung: extern mit `noopener,noreferrer`

Die Probe lädt ausschließlich ein Bild. Remote-HTML, Remote-JavaScript und Remote-SVG werden nicht in den Gewitterradar-Kontext injiziert. Die Offline-Datei stammt aus `TheDaimos/daimos-project-hub` / `feature/first-gewitterradar-preview`, Blob `bbae7a159b3e9d45d2ee72bd4cf1d299f69e9858`.

## Auslieferung
`scripts/build-frontend.mjs` synchronisiert nach `custom_components/gewitterradar/frontend` und `dashboard/dist`. DRA ersetzt bereits das vollständige `custom_components/gewitterradar`-Verzeichnis; keine parallele Dateiliste ist nötig. Manifest und Registry nehmen `ui.project-hub` in Soll/Ist, Versionsstatus und Diagnoseexport auf; die Modulansicht besitzt bereits einen Rückfall auf Manifest-Metadaten für neue IDs.
