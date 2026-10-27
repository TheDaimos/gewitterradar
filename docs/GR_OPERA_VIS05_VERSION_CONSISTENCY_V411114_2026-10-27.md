# GR VIS-05 – Verbindlicher konsistenter Versionshub V4.11.114 DEV

**2026-10-27 · deploy/dev · ausschließlich HA DEV VM109**

Nachgewiesene Quellstand-Korrektur der Versionskennungen nach VIS-04. V4.11.113 DEV wird nicht als abgenommen behandelt.

- Produkt: **V4.11.114 DEV**, Build **V4.11.114-DEV-2026-10-27**.
- Runtime/Cache: **411114r1**.
- Modulset: **E411-114A1**; geändertes Modulmanifest: **core.manifest 1.2.162**.
- Native HA-Integration: **0.25.23**.
- Version, Modulmanifest, Gewitterradar-Einstiegspunkt und Runtime-Manifest werden in `frontend/`, `dashboard/dist/` und `custom_components/gewitterradar/frontend/` bytegleich synchronisiert.
- Native `custom_components/gewitterradar/manifest.json` wird ebenfalls aktualisiert.

**Abgrenzung:** ausschließlich Versions-/Auslieferungskonsistenz; keine Änderung der OPERA-Datenverarbeitung und keine Aufhebung wissenschaftlicher Sperren. Automatisierte Tests und HA-DEV-Realabnahme sind **nicht durchgeführt**. DRA-Installation auf VM109, Browserverifikation und OPERA-Navigation sind weiterhin gesondert erforderlich. HA PROD VM101 bleibt unangetastet.

**Versionsregel:** Jede weitere Programmänderung verlangt eine neue Produkt-, Runtime-, Modulset- und native Versionskennung einschließlich aller drei Auslieferungsspiegel. Keine stillen Quellcode-Hotfixes unter derselben Programmversion.

C.K. – Eine Idee weiter gedacht.
