# Gewitterradar V4.07.57 · 2026/09 – Release Notes

## Zweck dieser Version

V4.07.57 macht die öffentliche Installation von Gewitterradar deutlich leichter auffindbar und verständlicher. Der Schwerpunkt liegt auf der Dokumentation für neue Nutzer – allen voran auf der **nativen Home-Assistant-Integration**.

Die Laufzeitlogik bleibt bewusst auf dem vollständig geschützten und geprüften V4.07.56-Stand. V4.07.57 verändert im Frontend ausschließlich Versions- und Build-Metadaten.

## Neue Installationsdokumentation

Die Haupt-README wurde vollständig neu gegliedert:

- visueller Kopfbereich mit Gewitterradar-Logo und Versionskennungen;
- native Integration als erster und empfohlener Installationsweg;
- HACS-Installation Schritt für Schritt;
- klar hervorgehobene Registrierung von `/gewitterradar/gewitterradar.js` als JavaScript-Modul;
- vollständiger, direkt kopierbarer Gewitterradar-View;
- getrennte Beispiele für View, gesamten `views:`-Block und Manuelle Karte;
- verständliche Prüfung nach der Installation;
- Referenztracker und Blitzortung-`Location entity` erklärt;
- Recorder-Schutz und Fehlersuche direkt in der Einstiegsdokumentation;
- technische Entwickler-/Release-Details nachgeordnet statt vor der Installation.

Empfohlener nativer View:

```yaml
title: Gewitterradar
path: gewitterradar
icon: mdi:weather-lightning
type: panel
cards:
  - type: vertical-stack
    cards:
      - type: custom:gewitterradar-card
        counter_entity: sensor.home_lightning_counter
        radius_entity: number.gewitterradar_observation_radius
        compass_mode_entity: switch.gewitterradar_compass_nearest_strike
```

## Dashboard-/Package-Variante

Das abgeleitete Repository `TheDaimos/gewitterradar-dashboard` erhält denselben visuellen und verständlichen Aufbau, angepasst an seine eigene Installation:

- HACS-Typ **Dashboard**;
- Ressourcenpfad `/hacsfiles/gewitterradar-dashboard/gewitterradar.js`;
- manueller V4.07-Package-Schritt nach `/config/packages/`;
- vollständiger Dashboard-View mit den `lightning_detection_*`-Helfern;
- eigener Referenztracker `device_tracker.gewitterradar_dashboard`;
- Recorder-Schutz und Fehlersuche.

## Technische Release-Identität

- Gewitterradar: **V4.07.57**
- Native Integration: **0.19.1**
- Build: `V4.07-RELEASE57-2026-09-16`
- Frontend-Größe: **1.955.144 Bytes**
- Frontend-SHA256: `ac921b5fc40f2d7f36733bb7262fdb1595790674695ad0eb83ccde8bc7146571`
- geschützte V4.07.56-Basis: **1.955.141 Bytes**
- V4.07.56-Basis-SHA256: `249485f4bcf68c9b23b821cae9b507030ae09cff5a56f7e28d3d7f3b02eb4a1a`
- Dashboard-Paket-SHA256: `1b705c5686e6a7be6dfb36717903df551d4f9f93787c39bd12bddf00aefae694`

Der V4.07.57-Buildvertrag normalisiert ausschließlich die Versions- und Build-Metadatenanker zurück auf V4.07.56. Danach müssen Größe und SHA256 exakt der geschützten V4.07.56-Quelle entsprechen. Damit ist maschinell abgesichert, dass dieser Patch keine unbeabsichtigte Änderung der Produktlogik enthält.

## Datenquelle und Kompatibilität

Blitzortung.org bleibt unverändert die Quelle der Live-Blitzdaten. Das V4.07-Dashboard-Package bleibt bytegleich. V4.06 und V4.07-Package dürfen weiterhin nicht parallel aktiv sein, da beide dieselben `lightning_detection_*`-Helfer definieren.
