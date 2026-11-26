# GewitterRadar – Installation

GewitterRadar wird als native Home-Assistant-Integration installiert. Aktueller stabiler Release: [V4.13 FINAL](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.13). Die optionale Dashboard-Karte ist Bestandteil der Integration.

---

## 1. Voraussetzungen

Benötigt werden:

- eine laufende Home-Assistant-Installation;
- die Home-Assistant-Integration **Blitzortung.org** als Quelle der Live-Blitzdaten;
- für die HACS-Installation eine funktionierende HACS-Installation;

Gewitterradar ersetzt Blitzortung.org nicht. Blitzortung liefert die `geo_location.lightning_strike*`-Entitäten sowie die zugehörigen Blitzsensoren.

---

# Native GewitterRadar-Integration

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

GewitterRadar kann über die Seitenleiste geöffnet werden. Eine eigene Dashboard-View ist optional.

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

## 5. Recorder-Schutz – dringend empfohlen

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

## 6. JavaScript-Ressourcen prüfen

Es darf genau **eine** Gewitterradar-Ressource aktiv sein:

Native Integration:

```text
/gewitterradar/gewitterradar.js
```

Veraltete oder parallele Einträge entfernen bzw. deaktivieren. Insbesondere historische Ressourcen wie

```text
/hacsfiles/gewitterradar/gewitterradar.js
```

oder Testpfade dürfen nicht zusätzlich geladen werden.

Nach einer Änderung an der Ressource den Browser vollständig neu laden. Bei hartnäckigem Frontend-Cache kann ein Hard-Reload des Browsers erforderlich sein.

---

## 7. Prüfung nach der Installation

Nach Abschluss der Installation prüfen:

- GewitterRadar zeigt die installierte FINAL-Version;
- nur eine Gewitterradar-JavaScript-Ressource ist aktiv;
- Karte und Radien werden dargestellt;
- Live-Blitze bzw. vorhandene 120-Minuten-Historie erscheinen;
- Kompass und Trend-Medaillon funktionieren;
- weltweite Ortssuche und direkte Koordinateneingabe funktionieren;
- der Gewitterradar-Tracker ändert bei einem Standortwechsel seine Koordinaten;
- Blitzortung.org verwendet den Tracker `device_tracker.gewitterradar` als Location Entity;
- Hilfe-/Hinweisbereich und Recorder-Hinweis sind verfügbar;

Bei der nativen Variante zusätzlich prüfen:

- **Einstellungen → Geräte & Dienste → Integrationen → Gewitterradar** bleibt nach Neustart sichtbar;
- die nativen Einstellungen und Werte bleiben erhalten.

---

## 8. Bestehende Installationen / Migration

Beim ersten nativen Setup können unterstützte gültige `lightning_detection_*`-Legacy-Helfer einmalig übernommen werden. Bereits vorhandene native Werte haben Vorrang. Legacy-Helfer werden nicht gelöscht oder umgeschrieben.

Veraltete JavaScript-Ressourcen und nicht mehr benötigte Helfer erst nach Prüfung deaktivieren.

Die native Integration entfernt keine fremden oder historischen Registry-Objekte automatisch.

Details: [`MIGRATION_AND_ROLLBACK.md`](MIGRATION_AND_ROLLBACK.md)

---

## 9. Manuelle Installation der nativen Integration

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

## 10. Weiterführende Dokumentation

- [`RECORDER.md`](RECORDER.md) – Schutz der Home-Assistant-Datenbank
- [`MIGRATION_AND_ROLLBACK.md`](MIGRATION_AND_ROLLBACK.md) – Migration und Rückfall
- [`REAL_INSTALL_FINDINGS_2026-09-06.md`](REAL_INSTALL_FINDINGS_2026-09-06.md) – Erkenntnisse aus Real-Install-Tests
- [`RELEASE_NOTES_V4_10.md`](RELEASE_NOTES_V4_10.md) – V4.10 FINAL-Dokumentations-/Installations-Patch
- [`RELEASE_NOTES_V4_07_56.md`](RELEASE_NOTES_V4_07_56.md) – geschützte V4.07.56-Laufzeitbasis
- [`GOLDEN_MASTER_POLICY.md`](GOLDEN_MASTER_POLICY.md) – Release-/Golden-Master-Prozess
