# Gewitterradar V4.00 – Installation (DE)

## Voraussetzungen

- Laufende Home-Assistant-Installation.
- Blitzortung.org-Integration mit den benötigten Blitz-/Zählerentitäten.
- Standard-Zähler der Beispielkonfiguration: `sensor.home_lightning_counter`.

## 1. JavaScript und Assets kopieren

- `gewitterradar-card-v4_00.js` nach `/config/www/gewitterradar/gewitterradar-card-v4_00.js` kopieren.
- Die vier PNG-Dateien aus `assets/` nach `/config/www/gewitterradar/assets/` kopieren.

Erwartete Asset-Dateien:

- `gewitterradar-trend-medallion.png`
- `gewitterradar-trend-arrow.png`
- `gewitterradar-compass-frame-v1.png`
- `gewitterradar-compass-frame-v2.png`

## 2. Lovelace-Ressource eintragen

Als JavaScript-Modul:

```text
/local/gewitterradar/gewitterradar-card-v4_00.js?v=4_00
```

Bei einem Update anschließend den Browser-/Companion-App-Cache neu laden.

## 3. Home-Assistant-Package installieren

`home-assistant/app_gewitterradar_pkg.yaml` nach `/config/packages/app_gewitterradar_pkg.yaml` kopieren.

In `configuration.yaml` muss die Package-Einbindung vorhanden sein:

```yaml
homeassistant:
  packages: !include_dir_named packages
```

Die bestehenden Helper-IDs `lightning_detection_*` werden bewusst beibehalten. Danach Home Assistant neu starten.

## 4. Gewitterradar-View anlegen

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
        radius_entity: input_number.lightning_detection_observation_radius
        compass_mode_entity: input_boolean.lightning_detection_compass_nearest_strike
```

## 5. Recorder-Schutz empfohlen

Kurzlebige Blitzentitäten und die häufig aktualisierten Blitzsensoren sollten nicht dauerhaft in der Recorder-Datenbank gespeichert werden:

```yaml
recorder:
  exclude:
    entity_globs:
      - "geo_location.lightning_strike*"
      - "sensor.home_lightning_distance"
      - "sensor.home_lightning_azimuth"
      - "sensor.home_lightning_counter"
```

Wenn bereits ein `recorder:`-Block existiert, die Einträge dort ergänzen und keinen zweiten Hauptschlüssel anlegen.

Die tatsächlich verarbeitete Anzahl von Blitzereignissen hängt von den Einstellungen der Blitzortung.org-Integration ab, insbesondere vom Erfassungsradius, dem Zeitfenster und der maximalen Anzahl gleichzeitig bereitgestellter Blitze. Größere Werte können bei hoher Gewitteraktivität die System- und Datenbanklast erhöhen.

Der Recorder-Ausschluss verhindert die dauerhafte Aufzeichnung dieser Entitäten, ohne ihre Live-Verfügbarkeit für Gewitterradar abzuschalten.

## 6. Ersttest

- Karte lädt und zeigt `V4.00`.
- Blitzortung.org-Status-LED ist plausibel.
- Einstellungen öffnen.
- Beobachtungs-, Gewitter- und Gefahrenradius prüfen; Gewitter mindestens 5 KM bzw. mindestens aktueller Gefahrenradius.
- KM/MI umschalten.
- Kompass und Recent-/Verlaufsbereich prüfen.
