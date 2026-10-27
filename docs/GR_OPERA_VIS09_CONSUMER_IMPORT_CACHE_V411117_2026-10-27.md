# Gewitterradar VIS-09 – veralteten WeatherRouter-Consumer-Importcache beheben (V4.11.117 DEV)

**27.10.2026 · deploy/dev · HA DEV VM 109**

## Realbefund
Gewitterradar V4.11.116 ist auf DEV geladen (34/34). HA-Diagnose-JSON vom 27.10.2026 11:11:38Z: nur `weather.consumer-client` meldet Ist `1.2.12` bei Soll `1.2.14`, keine doppelten Modul-IDs. Releasestand `E411-116A1` und Runtime `411116r1` stimmen zwischen Manifest und Lokalstand überein; allein der Modul-Fingerprint weicht ab.

## Verifizierte Ursache und Korrektur
Der Einstiegspunkt `frontend/gewitterradar.js` lud `./modules/weather/consumer-client.js` explizit mit dem veralteten festen Cache-Buster `411108r1`; das verhindert eine zuverlässige Aktualisierung im Browser, selbst wenn der Dateistand bereits Modulmetadaten `1.2.14` enthält. Die explizite alte Revision wird entfernt, sodass `gewitterradarImport` den aktuellen zentralen Runtime-Cache-Buster benutzt. Die Modulregistrierung bleibt `1.2.14`, das Soll bleibt `1.2.14`. Keine Consumer-API- oder OPERA-Semantikänderung.

Neue Programmkonsistenz: V4.11.117 DEV / 411117r1 / E411-117A1 / native 0.25.26 / BUILD_VERSION 4.11.117 / core.manifest 1.2.165. Alle fünf betroffenen Frontenddateien werden dreifach bytegleich ausgeliefert. Wissenschaftliche OPERA-Sperren unverändert.

## Prüfstatus
GitHub-Dateien sollen nach Commit zurückgelesen werden. Eine echte erneute DRA-Installation oder HA-DEV-Realabnahme wurde **nicht** von ChatGPT durchgeführt. Zielprüfung: DRA installierter Stand 4.11.117, Moduldiagnose 34/34, `weather.consumer-client` 1.2.14/1.2.14, 0 Abweichungen, Fingerprints gleich. Bei fortbestehender Abweichung HTTP-Cache und Modul-URL erfassen. HA PROD VM101 bleibt unangetastet.

C.K. – Eine Idee weiter gedacht.
