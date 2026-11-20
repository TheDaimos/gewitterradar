# DRA-Bereitstellung GR V4.11.155 DEV / HA V0.25.62

**Zweig:** TheDaimos/gewitterradar@deploy/dev — 07.11.2026.

## Benutzerauftrag
Vorhandenen hochwertigen Windkartenschalter wieder rahmenlos, ca. 20 % größer (50 statt 42 px) und frei verschiebbar gestalten. Im Winddarstellungsmenü ein persistentes Auswahlfeld für die Sichtbarkeit ergänzen: Vollbild / alle Kartenansichten / nur Standard und Groß / nie. Vorhandene Windanimation, Bildgrafik, Bedienelementfunktion und WR unverändert.

## Implementierung
- Quellcodecommit `0036110b1c4af0f49902246479e7f6c9c19c7c14` (Wind-Darstellungsmodul sowie Konfiguration, drei Frontend-Ziele identisch).
- Wiederverwendung des unveränderten Premium-Originalbildes mit 50×50 px und ohne zusätzlichen Rahmen.
- `quickVisibility` persistent in bestehender Wind-LocalStorage-Konfiguration, Standard `fullscreen` für rückwärtskompatibles Verhalten.
- Geschützter WR V0.10.297 DEV / Loader 300 unverändert; optimierte Windanimation nicht umgebaut.

## DRA-Kennungen
- Gewitterradar V4.11.155 DEV
- Home Assistant Integration V0.25.62 DEV
- Runtime `411155r1`, Modulsatz `E411-155A1`
- `frontend/version.js`, `dashboard/dist/version.js` und `custom_components/gewitterradar/frontend/version.js` mit identischem Versionsstand.
- Passende Modul- und Runtime-Manifeste, Build-Info und DRA-Provenienz.
- Installationsquelle ausschließlich `deploy/dev`; keine private GitHub Action.

## Freigabeprüfung
Der öffentliche Frontend-Paketbau lieferte 284 SHA256-Dateieinträge, als `SHA256SUMS_FRONTEND.txt` eingecheckt: `6578d4edd63306f4395e6588efaba04702fe902a`.

**Zum Dokumentationszeitpunkt:** Öffentliche CI läuft nach dem Checksum-Commit erneut. Eine vollständige finale CI-Freigabe und eine VM109-Realabnahme sind noch nicht bestätigt. Kein automatischer PROD- oder DEV-Eingriff.
