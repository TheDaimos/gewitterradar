# GR VIS-10: Doppelregistrierung von weather.consumer-client beheben

**27.10.2026 · deploy/dev · V4.11.118 DEV · ausschließlich HA DEV VM109**

## Echter HA-Befund
Diagnoseexport von 2026-10-27T11:30:38Z: 34/34 Module geladen, aber weather.consumer-client doppelt registriert, zuerst 1.2.14, danach 1.2.12. Runtime- und installierte Release-IDs stimmen. Ursache anhand GitHub-Quellcode: gewitterradar.js lädt consumer-client.js über aktuellen dynamischen Runtime-Import; layer-menu.js und display-menu.js importierten dieselbe Datei jedoch statisch mit altem Query-Parameter ?v=41109r1. Das erzeugt unterschiedliche Browser-Modulinstanzen, jeweils mit eigener Modulregistrierung.

## Gezielte Reparatur
Beide statischen Imports auf denselben Query-Parameter `?v=411118r1` gesetzt, den auch der dynamische Hauptimport über APPLICATION_RELEASE.runtimeRevision verwendet. Damit teilen sich alle drei Importpfade exakt dieselbe Modul-URL. Registrierte Modulversionen layer-menu 1.1.8 und display-menu 0.4.20, Sollstände im Manifest angehoben. Produkt V4.11.118 DEV, Cache 411118r1, Modulsatz E411-118A1, Native 0.25.27, BUILD_VERSION 4.11.118, core.manifest 1.2.166; Spiegel in frontend/, dashboard/dist/ und custom_components/gewitterradar/frontend/ identisch.

## Abnahmegrenze
Kein HA-Zugriff durch den Entwicklungsassistenten, keine neue HA-Realabnahme und keine breiten Regressionstests. Nach DRA-Vorschau/install auf VM109 soll die Moduldiagnose 34/34 ohne Doppelregistrierungen und mit 0 Abweichungen anzeigen. Wissenschaftliche OPERA-Sperren unberührt, PROD VM101 unangetastet.

C.K. – Eine Idee weiter gedacht.
