# Daimos Project Hub – Gewitterradar V4.11.08 / V0.2 RC1

Baseline: `freeze/v4.11-pre-project-hub-2026-10-02` @ `d5113b164046e478fe018cb12cea91eb85697a3f`.

## Stand
- Gewitterradar: V4.11.08 DEV
- Runtime: 41108r1
- Modulsatz: E411-08A3
- native Integration: 0.23.7
- `ui.project-hub`: 1.1.1
- Project Hub Runtime: 0.2.0-rc1
- zentrale Quelle: `TheDaimos/daimos-project-hub@5330ff545ea54c5335b59058376abbfc41e68167`

## Host-Popup
Das Popup verwendet die oberste reservierte Ebene `2147483647`; Settings liegt bei `2147483645`, die Moduldiagnose bei `2147483646`. Dadurch bleibt Project Hub beim Signatur-Klick aus geöffneten Einstellungen sichtbar im Vordergrund. Die Panelhöhe wird aus `visualViewport` bzw. `innerHeight` berechnet, bis maximal 1080 px, und bei Viewport-/Rotationsänderungen nachgeführt.

Der Signatur-Tipp öffnet sofort ein lokales modales Project-Hub-Popup. Die Health-Prüfung findet danach asynchron statt und setzt nur den Status auf online/offline. Dadurch hängt der Einstieg auf iPad/WebKit nicht von einem nachträglichen `window.open()` ab.

Das Popup enthält ausschließlich die lokale Runtime in einem lokalen iframe. Remote-HTML und Remote-JavaScript werden nicht in Gewitterradar eingebettet.

## Projektaktionen
Jede Karte besitzt `GitHub` und `Projektseite` als vertikale Aktionen. Gewitterradar verwendet `https://thedaimos.github.io/gewitterradar/`; noch nicht veröffentlichte Projektseiten bleiben als `Projektseite · folgt` sichtbar und deaktiviert.

## Runtime-Dateien
- `frontend/project-hub/project-hub-config.json`
- `frontend/project-hub/asset-manifest.json`
- `frontend/project-hub/offline/index.html`
- `frontend/project-hub/offline/assets/ck-logo.webp`
- `frontend/project-hub/offline/assets/project-icons.webp`

Dashboard und native Integration werden deterministisch aus demselben kanonischen Bestand gebaut. DRA transportiert weiterhin das komplette native Integrationsverzeichnis.
