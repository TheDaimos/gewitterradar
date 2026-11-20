# V4.11.70 DEV – JSON-Download auf Mobilgeraeten repariert

**Datum:** 13.10.2026 · **Ausgangspunkt:** V4.11.69 DEV (33/33 Module geladen). **Status:** Code-Kandidat, noch keine HA-Realabnahme.

## Ursache

In V4.11.69 fuehrten die Download-Schaltflaechen unmittelbar vor `link.click()` ein `await this._refreshBlitzortungSources?.()` aus. Nach dieser asynchronen Home-Assistant-WebSocket-Abfrage kann die Browser-Benutzeraktivierung bereits abgelaufen sein. Auf Android/iPad kann deshalb der angeforderte JSON-Download blockiert werden. Der Modul-Export gab zudem die temporaere Objekt-URL sofort frei.

## Hotfix

- `diagnostics.module-view@1.3.9`: JSON-Download sofort im urspruenglichen Klickereignis, ohne vorangestellte asynchrone Abfrage; Blob-URL erst nach 60 Sekunden freigeben. Kopieren und der separates Abweichungs-Export bleiben erhalten.
- `diagnostics.data-sources@0.1.1`: Identischer Schutz fuer den Datenquellen-JSON-Download.
- Der jeweilige Export enthaelt den zuletzt bekannten Datenquellen-Snapshot und den Pruefzeitpunkt; fuer aktuelle Werte **Datenquellen & Verbindungen → Aktualisieren** vor dem Export auswaehlen.
- Kein Backend- oder Tracker-Umbau. Keine Aenderung an Kartenradien, Clustern, Kamerafahrt, iPad-Gesten, WeatherRouter oder Blitzortung-Konfiguration.

**Version:** V4.11.70 DEV · Build V4.11.70-DEV-2026-10-13 · Runtime 41170r1 · Modulsatz E411-70A1 · native Integration 0.25.1 · 33 Module.

## Abnahme

- Automatische CI muss Frontend-Paritaet (3 Kopien), SHA256SUMS und Modulregistrierung bestaetigen.
- Realtest auf Android und iPad: Beide JSON-Schaltflaechen laden eine Datei herunter; der kopierte Modul-Export und die Datenquellen-Aktualisierung bleiben funktionsfaehig.
- V4.11.68-Leistungsreferenz bleibt verbindlich.

**C.K. – Eine Idee weiter gedacht.**
