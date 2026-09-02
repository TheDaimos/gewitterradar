# Gewitterradar V4.03 – Installation (DE)

## Voraussetzungen

- Laufende Home-Assistant-Installation.
- Blitzortung.org-Integration mit den benötigten Blitz-/Zählerentitäten.
- Standard-Zähler der Beispielkonfiguration: `sensor.home_lightning_counter`.

## Variante A: Installation über HACS

1. In HACS `TheDaimos/gewitterradar` als benutzerdefiniertes Repository vom Typ **Dashboard** hinzufügen.
2. Gewitterradar V4.03 installieren bzw. bei einem Update **neu herunterladen**.
3. HACS installiert den stabilen Einstiegspunkt `gewitterradar.js` und den vollständigen Ordner `assets/` nach `/config/www/community/gewitterradar/`. Über Home Assistant ist dies unter `/hacsfiles/gewitterradar/` erreichbar.
4. Das Home-Assistant-Package zusätzlich manuell installieren. Ein HACS-Dashboard-Repository kann keine Datei nach `/config/packages/` kopieren.

Nach der Installation muss die Verzeichnisstruktur mindestens so aussehen:

```text
/config/www/community/gewitterradar/
├── gewitterradar.js
└── assets/
    ├── gewitterradar-compass-frame-v1.png
    ├── gewitterradar-compass-frame-v2.png
    ├── gewitterradar-trend-arrow.png
    └── gewitterradar-trend-medallion.png
```

Wenn die Lovelace-Ressourcen in YAML verwaltet werden, lautet die Moduladresse:

```text
/hacsfiles/gewitterradar/gewitterradar.js
```

### Hinweis für Upgrades von V4.01/V4.02

V4.01 konnte wegen eines einzelnen `gewitterradar.js`-Release-Assets als Ein-Datei-Installation enden. V4.02 entfernte dieses Asset, veröffentlichte aber weiterhin Package, ZIP und Prüfsumme als eigene Release-Assets. Aktuelles HACS priorisiert auch diese Dateien vor dem `dist/`-Baum; dadurch konnten genau diese drei Dateien unter `/config/www/community/gewitterradar/` landen, während Karte und Grafiken fehlten.

V4.03 veröffentlicht deshalb **keine eigenen GitHub-Release-Assets**. Dadurch greift HACS auf den markierten Repository-Stand zurück und installiert `dist/gewitterradar.js` zusammen mit `dist/assets/`.

## Variante B: Manuelle Installation

### 1. JavaScript und Assets kopieren

- `gewitterradar-card-v4_03.js` nach `/config/www/gewitterradar/gewitterradar-card-v4_03.js` kopieren.
- Die vier PNG-Dateien aus `dist/assets/` nach `/config/www/gewitterradar/assets/` kopieren.

Erwartete Asset-Dateien:

- `gewitterradar-trend-medallion.png`
- `gewitterradar-trend-arrow.png`
- `gewitterradar-compass-frame-v1.png`
- `gewitterradar-compass-frame-v2.png`

### 2. Lovelace-Ressource eintragen

Als JavaScript-Modul:

```text
/local/gewitterradar/gewitterradar-card-v4_03.js?v=4_03
```

Bei einem Update anschließend den Browser-/Companion-App-Cache neu laden.

## 3. Home-Assistant-Package installieren

`home-assistant/app_gewitterradar_pkg.yaml` nach `/config/packages/app_gewitterradar_pkg.yaml` kopieren.

Da V4.03 bewusst keine eigenen Release-Assets besitzt, wird das Package direkt aus dem markierten Repository-Stand oder aus dem automatisch von GitHub bereitgestellten Source-Code-Archiv entnommen.

In `configuration.yaml` muss die Package-Einbindung vorhanden sein:

```yaml
homeassistant:
  packages: !include_dir_named packages
```

Die bestehenden Helper-IDs `lightning_detection_*` werden bewusst beibehalten. Die Package-Logik ist gegenüber V4.01/V4.02 unverändert. Danach Home Assistant neu starten.

Wenn nach einer fehlenden Package-Datei bereits alte Helper als „Nicht verfügbar“ angezeigt werden, die Package-Datei wiederherstellen und Home Assistant vollständig neu starten. Bei identischen Entity-IDs werden die YAML-Helfer wieder unter ihren bisherigen IDs bereitgestellt.

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

- Karte lädt und zeigt `V4.03`.
- Unter `/config/www/community/gewitterradar/assets/` sind bei HACS-Installation alle vier PNG-Dateien vorhanden.
- Blitzortung.org-Status-LED ist plausibel.
- Einstellungen öffnen.
- Beobachtungs-, Gewitter- und Gefahrenradius prüfen; Gewitter mindestens 5 KM bzw. mindestens aktueller Gefahrenradius.
- KM/MI umschalten.
- Kompass und Recent-/Verlaufsbereich prüfen.
