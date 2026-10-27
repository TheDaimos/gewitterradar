# Gewitterradar VIS-08: Consumer-Modulversion korrigiert (V4.11.116 DEV)

**27.10.2026 · deploy/dev · ausschließlich HA DEV VM109**

## Tatsächlicher HA-DEV-Befund
Nach Installation V4.11.115 zeigte die Gewitterradar-Diagnose **34/34 Module geladen**, aber **1 Abweichung**: `weather.consumer-client` Ist **1.2.12** / Soll **1.2.14**.

## Durch Quellcode belegte Ursache
In `frontend/module-manifest.js` stand Soll 1.2.14; in `frontend/modules/weather/consumer-client.js` registrierte sich `MODULE_META` noch als 1.2.12. Das ist eine Versions-Metadatenabweichung, keine durch den Screenshot nachgewiesene Funktionsstörung.

## Gezielte Korrektur
- `weather.consumer-client` Modulkennung auf **1.2.14** korrigiert; Soll bleibt 1.2.14. Keine Änderung der Consumer-Routinglogik.
- Gesamtstand **V4.11.116 DEV**, Runtime **411116r1**, Modulsatz **E411-116A1**, native Integration **0.25.25**, `BUILD_VERSION=4.11.116`, `core.manifest=1.2.164`.
- Alle betroffenen Frontend-/Moduldateien identisch in `frontend/`, `dashboard/dist/` und `custom_components/gewitterradar/frontend/` übernommen; Sidebar-Cache und Provenienz aktualisiert.

## Grenzen
GitHub-Rückleseprüfung ist kein HA-Realtest. DRA-Vorschau und anschließende HA DEV VM109 Diagnose müssen **34/34 geladen und 0 Abweichungen** zeigen. Wissenschaftliche OPERA-Sperren unverändert; HA PROD VM101 unangetastet.

C.K. – Eine Idee weiter gedacht.
