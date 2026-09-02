# Gewitterradar V4.04 – Installation (DE)

## Voraussetzungen

- Laufende Home-Assistant-Installation.
- Blitzortung.org-Integration mit den benötigten Blitz-/Zählerentitäten.
- Standard-Zähler der Beispielkonfiguration: `sensor.home_lightning_counter`.

## HACS-Updatekanal

Für die normale Installation und spätere Aktualisierungen soll in HACS die standardmäßig angebotene **neueste / Latest-Version** verwendet werden. Aktuell ist dies V4.04. Eine feste ältere Version sollte nur bewusst für einen Rückschritt oder eine besondere Kompatibilitätsanforderung gewählt werden. HACS prüft die Repository-Metadaten regelmäßig und kann neue stabile Gewitterradar-Releases dadurch als Update anbieten.

## Variante A: Installation über HACS

1. In HACS `TheDaimos/gewitterradar` als benutzerdefiniertes Repository vom Typ **Dashboard** hinzufügen.
2. Gewitterradar mit der standardmäßig angebotenen **Latest / neuesten Version** installieren bzw. bei einem Update **neu herunterladen**. Aktuell entspricht Latest der V4.04.
3. HACS installiert `gewitterradar.js`, den vollständigen Ordner `assets/` und zusätzlich `app_gewitterradar_pkg.yaml` nach `/config/www/community/gewitterradar/`.
4. `app_gewitterradar_pkg.yaml` anschließend manuell nach `/config/packages/app_gewitterradar_pkg.yaml` kopieren oder verschieben.
5. Home Assistant vollständig neu starten.

Nach der HACS-Installation muss die Verzeichnisstruktur mindestens so aussehen:

```text
/config/www/community/gewitterradar/
├── app_gewitterradar_pkg.yaml
├── gewitterradar.js
└── assets/
    ├── gewitterradar-compass-frame-v1.png
    ├── gewitterradar-compass-frame-v2.png
    ├── gewitterradar-trend-arrow.png
    └── gewitterradar-trend-medallion.png
```

Home Assistant stellt die Dashboard-Dateien über `/hacsfiles/gewitterradar/` bereit. Wenn Lovelace-Ressourcen in YAML verwaltet werden, lautet die Moduladresse:

```text
/hacsfiles/gewitterradar/gewitterradar.js
```

### Warum muss das Package trotzdem manuell verschoben oder kopiert werden?

Dieser eine Schritt kann nicht durch dieses HACS-Repository automatisiert werden. Gewitterradar ist in HACS als **Dashboard-Repository** eingebunden. HACS installiert dessen Dateien in den eigenen Bereich

```text
/config/www/community/gewitterradar/
```

und übernimmt nicht die Installation von Home-Assistant-Konfigurationsdateien nach

```text
/config/packages/
```

V4.04 löst deshalb den praktischen Teil des Problems: Das benötigte Package wird von HACS bereits lokal mitgeliefert. Der Benutzer muss keine zusätzliche Datei mehr von GitHub suchen oder herunterladen, sondern nur die vorhandene Datei

```text
/config/www/community/gewitterradar/app_gewitterradar_pkg.yaml
```

nach

```text
/config/packages/app_gewitterradar_pkg.yaml
```

kopieren oder verschieben. **Kopieren wird empfohlen**, damit die von HACS bereitgestellte Ausgangsdatei im Gewitterradar-Verzeichnis erhalten bleibt.

Die gepflegte Originaldatei im Repository ist `home-assistant/app_gewitterradar_pkg.yaml`. Beim Erstellen der HACS-Verteilung wird daraus `dist/app_gewitterradar_pkg.yaml`; die CI prüft, dass beide Dateien byte-identisch sind.

In `configuration.yaml` muss die Package-Einbindung vorhanden sein:

```yaml
homeassistant:
  packages: !include_dir_named packages
```

Wenn dieser Block bereits existiert, keinen zweiten `homeassistant:`-Hauptschlüssel anlegen.

Die bestehenden Helper-IDs `lightning_detection_*` werden bewusst beibehalten. Die Package-Logik selbst ist gegenüber V4.03 unverändert. Nach dem Kopieren/Ersetzen des Packages Home Assistant vollständig neu starten.

Wenn nach einer zuvor fehlenden Package-Datei alte Helper bereits als „Nicht verfügbar“ angezeigt werden, diese Entitäten nicht vorschnell löschen. Package wiederherstellen und Home Assistant neu starten; bei identischen Entity-IDs werden die YAML-Helfer wieder unter ihren bisherigen IDs bereitgestellt.

### Hinweis für Upgrades von V4.01/V4.02/V4.03

V4.01 konnte wegen eines einzelnen `gewitterradar.js`-Release-Assets als Ein-Datei-Installation enden. V4.02 entfernte dieses Asset, veröffentlichte aber weiterhin Package, ZIP und Prüfsumme als eigene Release-Assets. Aktuelles HACS priorisierte diese Dateien vor dem `dist/`-Baum. V4.03 beseitigte dies durch einen GitHub-Release ohne eigene Release-Assets und installierte Karte plus Grafiken korrekt.

V4.04 behält exakt diesen funktionierenden Mechanismus bei und ergänzt lediglich `dist/app_gewitterradar_pkg.yaml`. Dadurch kommt nun auch das manuell zu installierende Package mit der HACS-Installation lokal an, ohne erneut den Release-Asset-Pfad auszulösen.

## Variante B: Manuelle Installation

### 1. JavaScript und Assets kopieren

- `gewitterradar-card-v4_04.js` nach `/config/www/gewitterradar/gewitterradar-card-v4_04.js` kopieren.
- Die vier PNG-Dateien aus `dist/assets/` nach `/config/www/gewitterradar/assets/` kopieren.

Erwartete Asset-Dateien:

- `gewitterradar-trend-medallion.png`
- `gewitterradar-trend-arrow.png`
- `gewitterradar-compass-frame-v1.png`
- `gewitterradar-compass-frame-v2.png`

### 2. Lovelace-Ressource eintragen

Als JavaScript-Modul:

```text
/local/gewitterradar/gewitterradar-card-v4_04.js?v=4_04
```

Bei einem Update anschließend den Browser-/Companion-App-Cache neu laden.

## 3. Home-Assistant-Package installieren

Bei manueller Installation `home-assistant/app_gewitterradar_pkg.yaml` nach `/config/packages/app_gewitterradar_pkg.yaml` kopieren. Alternativ ist dieselbe Datei als `dist/app_gewitterradar_pkg.yaml` enthalten.

Danach Home Assistant vollständig neu starten.

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

- Karte lädt und zeigt `V4.04`.
- `/config/www/community/gewitterradar/` enthält `gewitterradar.js`, `app_gewitterradar_pkg.yaml` und den Ordner `assets/`.
- Unter `assets/` sind alle vier PNG-Dateien vorhanden.
- `/config/packages/app_gewitterradar_pkg.yaml` ist vorhanden und Home Assistant wurde danach neu gestartet.
- Die `lightning_detection_*`-Helfer sind verfügbar.
- Blitzortung.org-Status-LED ist plausibel.
- Einstellungen öffnen.
- Beobachtungs-, Gewitter- und Gefahrenradius prüfen; Gewitter mindestens 5 KM bzw. mindestens aktueller Gefahrenradius.
- KM/MI umschalten.
- Kompass und Recent-/Verlaufsbereich prüfen.
