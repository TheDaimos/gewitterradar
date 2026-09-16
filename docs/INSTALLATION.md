# Gewitterradar V4.07.56 – Installation

Diese Anleitung beschreibt die beiden Auslieferungsformen von **Gewitterradar**:

1. **Native Home-Assistant-Integration** aus `TheDaimos/gewitterradar`.
2. **Dashboard-/Lovelace-Auslieferung** aus `TheDaimos/gewitterradar-dashboard`.

Beide gehören fachlich zu demselben Gewitterradar-Produktstand. Für eine produktive Installation sollte genau **eine** Auslieferungsform aktiv verwendet werden. Insbesondere dürfen nicht gleichzeitig mehrere Gewitterradar-JavaScript-Ressourcen oder mehrere aktive V4.06-/V4.07-Packages geladen werden.

Aktueller abgenommener Produktkandidat: **V4.07.56**  
Native Integration: **0.19.0**

---

## 1. Voraussetzungen

Benötigt werden:

- eine laufende Home-Assistant-Installation;
- die Home-Assistant-Integration **Blitzortung.org** als Quelle der Live-Blitzdaten;
- für die HACS-Installation eine funktionierende HACS-Installation;
- Schreibzugriff auf die Home-Assistant-Konfiguration, falls die Dashboard-/Package-Variante verwendet wird.

Gewitterradar ersetzt Blitzortung.org nicht. Blitzortung liefert die `geo_location.lightning_strike*`-Entitäten sowie die zugehörigen Blitzsensoren.

---

# Variante A – Native Gewitterradar-Integration

## 2. Installation über HACS

1. In HACS `https://github.com/TheDaimos/gewitterradar` als benutzerdefiniertes Repository vom Typ **Integration** hinzufügen.
2. **Gewitterradar Integration** installieren.
3. Home Assistant vollständig neu starten, wenn HACS/Home Assistant dies verlangt.
4. **Einstellungen → Geräte & Dienste → Integration hinzufügen** öffnen.
5. Nach **Gewitterradar** suchen.
6. Den Gewitterradar-Config-Entry anlegen.
7. Unter **Einstellungen → Dashboards → Ressourcen** folgende Ressource als **JavaScript-Modul** eintragen:

```text
/gewitterradar/gewitterradar.js
```

Die native Integration registriert die Dashboard-Ressource bewusst nicht automatisch und verändert keine privaten Home-Assistant-`.storage`-Dateien.

### Erwartetes Ergebnis

Nach einem vollständigen Neustart gilt:

- Gewitterradar bleibt unter **Einstellungen → Geräte & Dienste → Integrationen** sichtbar;
- der Config Entry ist geladen;
- die nativen Gewitterradar-Konfigurationsentitäten sind vorhanden;
- gespeicherte Werte bleiben erhalten;
- HACS zeigt das Repository als installiert und nicht mehr als `pending-restart`.

Eine frische native Installation benötigt **kein** historisches YAML-Helferpaket.

---

## 3. Gewitterradar-View anlegen

Der Download bzw. die Installation erzeugt keine Home-Assistant-Dashboard-View automatisch.

### Über die Home-Assistant-Oberfläche

1. Das gewünschte Dashboard öffnen.
2. **Dashboard bearbeiten** wählen.
3. Eine neue Ansicht mit dem Titel **Gewitterradar** anlegen.
4. Als Ansichtstyp **Panel / eine Karte** verwenden.
5. Optional das Symbol `mdi:weather-lightning` setzen.
6. In der neuen Ansicht eine **Manuelle Karte** hinzufügen.
7. Als Kartenkonfiguration eintragen:

```yaml
type: custom:gewitterradar-card
```

Das ist die vollständige Minimal-Konfiguration. Die Karte erkennt die nativen Gewitterradar-Einstellungen selbst.

### Vollständiges YAML-Beispiel für eine Dashboard-View

```yaml
views:
  - title: Gewitterradar
    path: gewitterradar
    icon: mdi:weather-lightning
    type: panel
    cards:
      - type: custom:gewitterradar-card
```

Falls der Blitzortung-Zähler auf dem System nicht `sensor.home_lightning_counter` heißt, kann er optional explizit angegeben werden:

```yaml
type: custom:gewitterradar-card
counter_entity: sensor.DEIN_LIGHTNING_COUNTER
```

---

## 4. Weltweiter Bezugsstandort bei der nativen Integration

V4.07 stellt einen eigenen dynamischen Referenztracker bereit. Der vorgeschlagene Entity-ID lautet in einer Standardinstallation:

```text
device_tracker.gewitterradar
```

Für weltweite Standortwechsel muss Blitzortung.org einmalig so konfiguriert werden, dass dieser Tracker als **Location entity** verwendet wird.

Danach gilt:

1. Standort in Gewitterradar suchen oder Koordinaten übernehmen.
2. Gewitterradar verschiebt seinen eigenen Referenztracker.
3. Blitzortung.org erkennt die Positionsänderung über die konfigurierte Location Entity.
4. Neuabonnement, Aktualisierung und Latenz der Blitzdaten bleiben vollständig Aufgabe der Blitzortung.org-Integration.

Gewitterradar verändert keine fremden Config Entries und schreibt nicht direkt in `.storage`.

---

# Variante B – Dashboard-/Lovelace-Auslieferung

## 5. Installation über HACS

Für diese Variante wird das abgeleitete Dashboard-Repository verwendet:

```text
https://github.com/TheDaimos/gewitterradar-dashboard
```

1. Das Repository in HACS als benutzerdefiniertes Repository vom Typ **Dashboard** hinzufügen.
2. **Gewitterradar** installieren bzw. aktualisieren.
3. Unter **Einstellungen → Dashboards → Ressourcen** prüfen, dass folgende Ressource als JavaScript-Modul geladen wird:

```text
/hacsfiles/gewitterradar-dashboard/gewitterradar.js
```

4. Das V4.07-Package aus dem HACS-Ordner manuell kopieren:

```text
/config/www/community/gewitterradar-dashboard/app_gewitterradar_v4_07_pkg.yaml
```

nach:

```text
/config/packages/app_gewitterradar_v4_07_pkg.yaml
```

5. Home Assistant vollständig neu starten.
6. Anschließend die Gewitterradar-View wie in Abschnitt **3** anlegen.

### Warum der Package-Schritt manuell ist

HACS-Dashboard-Repositories können Konfigurationsdateien nicht direkt nach `/config/packages/` installieren. Der Kopierschritt ist deshalb technisch notwendig und bewusst nicht automatisiert.

### Packages aktivieren

Falls Home-Assistant-Packages noch nicht eingebunden sind, in `configuration.yaml` ergänzen:

```yaml
homeassistant:
  packages: !include_dir_named packages
```

Existiert bereits ein `homeassistant:`-Block, den Eintrag dort ergänzen. **Keinen zweiten `homeassistant:`-Hauptschlüssel anlegen.**

### V4.06 und V4.07 nicht parallel laden

Für V4.07 wird verwendet:

```text
app_gewitterradar_v4_07_pkg.yaml
```

Das historische V4.06-Paket bleibt nur als Rückfall-/Migrationsreferenz erhalten.

**V4.06 und V4.07 niemals gleichzeitig als aktive Packages laden.** Beide definieren absichtlich dieselben `lightning_detection_*`-Helfer.

Kanonische V4.07-Paket-Prüfsumme:

```text
SHA256: 1b705c5686e6a7be6dfb36717903df551d4f9f93787c39bd12bddf00aefae694
```

---

## 6. Weltweiter Bezugsstandort bei der Dashboard-Variante

Das V4.07-Dashboard-Package stellt einen eigenen Template-Tracker bereit:

```text
device_tracker.gewitterradar_dashboard
```

Diesen Tracker einmalig in der Blitzortung.org-Integration als **Location entity** auswählen.

Spätere Ortswechsel erfolgen in Gewitterradar. Das Package aktualisiert den Gewitterradar-Tracker; Blitzortung.org bleibt Eigentümer seiner Datenregion und Abonnementlogik.

---

# Für beide Varianten

## 7. Recorder-Schutz – dringend empfohlen

Gewitterradar verarbeitet kurzlebige Blitzentitäten. Bei hoher Blitzaktivität können sehr viele Zustandsänderungen entstehen. Diese Daten sollten nicht dauerhaft in die Home-Assistant-Datenbank geschrieben werden.

In `configuration.yaml`:

```yaml
recorder:
  exclude:
    entity_globs:
      - "geo_location.lightning_strike*"
      - "sensor.*_lightning_distance"
      - "sensor.*_lightning_azimuth"
      - "sensor.*_lightning_counter"
```

Falls bereits ein `recorder:`-Block existiert, die Einträge dort integrieren. **Keinen zweiten `recorder:`-Hauptschlüssel anlegen.**

Die Ausschlüsse betreffen nur die zukünftige Recorder-/History-Speicherung. Die Live-Zustände bleiben für Gewitterradar verfügbar. Bereits vorhandene historische Daten werden dadurch nicht automatisch gelöscht.

Details: [`RECORDER.md`](RECORDER.md)

---

## 8. JavaScript-Ressourcen prüfen

Es darf genau **eine** Gewitterradar-Ressource aktiv sein:

Native Integration:

```text
/gewitterradar/gewitterradar.js
```

Dashboard/HACS:

```text
/hacsfiles/gewitterradar-dashboard/gewitterradar.js
```

Veraltete oder parallele Einträge entfernen bzw. deaktivieren. Insbesondere historische Ressourcen wie

```text
/hacsfiles/gewitterradar/gewitterradar.js
```

oder Testpfade dürfen nicht zusätzlich geladen werden.

Kanonische V4.07.56-Frontendidentität:

```text
Größe:  1.955.141 Bytes
SHA256: 249485f4bcf68c9b23b821cae9b507030ae09cff5a56f7e28d3d7f3b02eb4a1a
```

Nach einer Änderung an der Ressource den Browser vollständig neu laden. Bei hartnäckigem Frontend-Cache kann ein Hard-Reload des Browsers erforderlich sein.

---

## 9. Prüfung nach der Installation

Nach Abschluss der Installation prüfen:

- Gewitterradar zeigt **V4.07.56**;
- nur eine Gewitterradar-JavaScript-Ressource ist aktiv;
- Karte und Radien werden dargestellt;
- Live-Blitze bzw. vorhandene 120-Minuten-Historie erscheinen;
- Kompass und Trend-Medaillon funktionieren;
- weltweite Ortssuche und direkte Koordinateneingabe funktionieren;
- der Gewitterradar-Tracker ändert bei einem Standortwechsel seine Koordinaten;
- Blitzortung.org verwendet den zur gewählten Auslieferungsform passenden Tracker als Location Entity;
- Hilfe-/Hinweisbereich und Recorder-Hinweis sind verfügbar;
- bei Dashboard-/Package-Nutzung liegt ausschließlich das V4.07-Package aktiv unter `/config/packages/`.

Bei der nativen Variante zusätzlich prüfen:

- **Einstellungen → Geräte & Dienste → Integrationen → Gewitterradar** bleibt nach Neustart sichtbar;
- die nativen Einstellungen und Werte bleiben erhalten.

---

## 10. Bestehende Installationen / Migration

Beim ersten nativen Setup können unterstützte gültige `lightning_detection_*`-Legacy-Helfer einmalig übernommen werden. Bereits vorhandene native Werte haben Vorrang. Legacy-Helfer werden nicht gelöscht oder umgeschrieben.

Bei älteren Dashboard-Installationen prüfen:

- veraltetes Repository `TheDaimos/gewitterradar` nicht zusätzlich als Dashboard laden;
- stattdessen `TheDaimos/gewitterradar-dashboard` verwenden;
- alte JavaScript-Ressourcen entfernen;
- V4.06-Package deaktivieren/ersetzen, bevor V4.07 aktiviert wird.

Die native Integration entfernt keine fremden oder historischen Registry-Objekte automatisch.

Details: [`MIGRATION_AND_ROLLBACK.md`](MIGRATION_AND_ROLLBACK.md)

---

## 11. Manuelle Installation der nativen Integration

Ohne HACS den vollständigen Ordner

```text
custom_components/gewitterradar/
```

nach

```text
/config/custom_components/gewitterradar/
```

kopieren.

Der Zielordner muss mindestens enthalten:

```text
/config/custom_components/gewitterradar/
├── __init__.py
├── config_flow.py
├── const.py
├── device_tracker.py
├── manifest.json
├── number.py
├── select.py
├── strings.json
├── switch.py
├── frontend/
│   ├── gewitterradar.js
│   ├── assets/
│   └── locales/about-locales.js
├── brand/
│   ├── icon.png
│   └── icon@2x.png
└── translations/
    ├── de.json
    └── en.json
```

Danach Home Assistant vollständig neu starten, Gewitterradar über **Einstellungen → Geräte & Dienste** hinzufügen und anschließend die JavaScript-Ressource `/gewitterradar/gewitterradar.js` registrieren.

---

## 12. Weiterführende Dokumentation

- [`RECORDER.md`](RECORDER.md) – Schutz der Home-Assistant-Datenbank
- [`MIGRATION_AND_ROLLBACK.md`](MIGRATION_AND_ROLLBACK.md) – Migration und Rückfall
- [`REAL_INSTALL_FINDINGS_2026-09-06.md`](REAL_INSTALL_FINDINGS_2026-09-06.md) – Erkenntnisse aus Real-Install-Tests
- [`RELEASE_NOTES_V4_07_56.md`](RELEASE_NOTES_V4_07_56.md) – V4.07.56-Abschlussstand
- [`GOLDEN_MASTER_POLICY.md`](GOLDEN_MASTER_POLICY.md) – Release-/Golden-Master-Prozess
