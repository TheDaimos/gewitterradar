<div align="center">

<img
  src="https://raw.githubusercontent.com/TheDaimos/gewitterradar/main/custom_components/gewitterradar/brand/icon@2x.png"
  width="170"
  alt="Gewitterradar Logo">

# Gewitterradar

### Live-Blitz- und Gewitterdarstellung für Home Assistant

**Native Home-Assistant-Integration · Dashboard-Karte · weltweite Referenzorte · 120-Minuten-Verlauf**

![Home Assistant](https://img.shields.io/badge/Home%20Assistant-Integration-41BDF5?logo=home-assistant&logoColor=white)
![HACS](https://img.shields.io/badge/HACS-Custom%20Integration-41BDF5)
![Version](https://img.shields.io/badge/Gewitterradar-V4.08%20RC-c9a45b)
![Languages](https://img.shields.io/badge/Sprachvarianten-19-c9a45b)
![License](https://img.shields.io/badge/Code-GPL--3.0--only-lightgrey)

**[⚡ Native Integration installieren](#1-native-gewitterradar-integration)** ·
**[🌩️ Funktionen](#was-gewitterradar-bereitstellt)** ·
**[📖 HTML-Handbuch](docs/gewitterradar-overview.html)**

</div>

> [!IMPORTANT]
> **Für neue Installationen ist die native Gewitterradar-Integration der empfohlene Weg.**  
> Sie stellt eigene Home-Assistant-Entitäten für die Einstellungen bereit und benötigt kein YAML-Helferpaket. Die separate Dashboard-/Package-Variante bleibt weiterhin vollständig unterstützt.

<p align="center">
  <img
    src="https://raw.githubusercontent.com/TheDaimos/gewitterradar/main/frontend/assets/gewitterradar-about-hero-v2.webp"
    width="900"
    alt="Gewitterradar – Home Assistant">
</p>

**Vollständige Installation:** [docs/INSTALLATION.md](docs/INSTALLATION.md) ·
**Hilfe & Überblick:** [docs/gewitterradar-overview.html](docs/gewitterradar-overview.html)

---

## Schnellnavigation

[Installation](#installation) · [View einrichten](#view-einrichten) · [Blitzortung koppeln](#blitzortung-koppeln) · [Recorder schützen](#recorder-schützen) · [Bestehende Installationen](#bestehende-installationen) · [Fehlersuche](#fehlersuche) · [Dokumentation](#dokumentation)

---

## Ein Produkt, zwei Auslieferungsformen

Gewitterradar ist fachlich **ein gemeinsames Produkt**. Dieses Repository ist die kanonische Produkt- und Entwicklungsquelle.

| Native Integration | Dashboard-/Lovelace-Variante |
| --- | --- |
| **Empfohlen für neue Installationen** | Für bestehende Dashboard-/Package-Installationen |
| Installation über HACS als **Integration** | Installation über HACS als **Dashboard** |
| eigene Home-Assistant-Entitäten für Einstellungen | Einstellungen über das Gewitterradar-Package |
| kein YAML-Helferpaket notwendig | Package unter `/config/packages/` notwendig |
| eigener Referenztracker `device_tracker.gewitterradar` | eigener Referenztracker `device_tracker.gewitterradar_dashboard` |
| Dashboard-Karte aus derselben Installation | Dashboard-Karte aus dem abgeleiteten Repository |

Gemeinsamer Frontend-Code wird nur einmal entwickelt und deterministisch für beide Auslieferungsformen erzeugt. Abweichungen bei Frontend, Assets, Hilfetexten oder Prüfsummen gelten als Fehler.

---

## Was Gewitterradar bereitstellt

- Live-Blitzdarstellung aus der Home-Assistant-Integration **Blitzortung.org**;
- Beobachtungs-, Gewitter- und Gefahrenradius;
- Cluster-Darstellung und Cluster-Navigation;
- Kompass und Trend-Medaillon;
- 120-Minuten-Aktivitätsverlauf;
- weltweite Orts-/PLZ-Suche und direkte Koordinateneingabe;
- gespeicherte Orte;
- dynamischen Gewitterradar-Bezugsstandort;
- vollständigen Bereich **Hilfe & Hinweise**;
- **15 Sprachen plus 4 deutsche Dialektvarianten = 19 Sprachvarianten**;
- Diagnose-, Kalibrier-, Geometrie- und Testwerkzeuge.

> [!NOTE]
> Gewitterradar ersetzt **Blitzortung.org nicht**. Die Blitzortung-Integration muss vorhanden und funktionsfähig sein. Sie bleibt Eigentümerin ihrer Datenregion und Abonnementlogik.

---

# Installation

## 1. Native Gewitterradar-Integration

1. Dieses Repository in HACS als benutzerdefiniertes Repository vom Typ **Integration** hinzufügen.
2. **Gewitterradar Integration** installieren.
3. Home Assistant vollständig neu starten, wenn HACS dies verlangt.
4. **Einstellungen → Geräte & Dienste → Integration hinzufügen** öffnen.
5. Nach **Gewitterradar** suchen und den Config Entry anlegen.
6. Unter **Einstellungen → Dashboards → Ressourcen** folgende Ressource als **JavaScript-Modul** eintragen:

```text
/gewitterradar/gewitterradar.js
```

Eine frische native Installation benötigt **kein** historisches YAML-Helferpaket.

### Erwartetes Ergebnis

- Gewitterradar bleibt nach einem Neustart unter **Einstellungen → Geräte & Dienste → Integrationen** sichtbar;
- der Config Entry ist geladen;
- die nativen Gewitterradar-Konfigurationsentitäten sind vorhanden;
- gespeicherte Werte bleiben erhalten;
- die Dashboard-Karte kann aus derselben Installation verwendet werden.

---

## 2. Dashboard-/Lovelace-Auslieferung

Für diese Variante wird das abgeleitete Repository verwendet:

```text
TheDaimos/gewitterradar-dashboard
```

1. Repository in HACS als benutzerdefiniertes Repository vom Typ **Dashboard** hinzufügen.
2. Gewitterradar installieren bzw. aktualisieren.
3. Prüfen, dass folgende Ressource als JavaScript-Modul geladen wird:

```text
/hacsfiles/gewitterradar-dashboard/gewitterradar.js
```

4. Das aktuelle Gewitterradar-Package aus dem HACS-Ordner nach `/config/packages/` kopieren.
5. Home Assistant vollständig neu starten.
6. Anschließend die Gewitterradar-View anlegen.

HACS-Dashboard-Repositories können Konfigurationsdateien nicht direkt nach `/config/packages/` schreiben. Der Package-Schritt ist deshalb bewusst manuell.

Falls Packages noch nicht eingebunden sind:

```yaml
homeassistant:
  packages: !include_dir_named packages
```

Existiert bereits ein `homeassistant:`-Block, den Eintrag dort ergänzen. **Keinen zweiten Hauptschlüssel anlegen.**

Historische und aktuelle Gewitterradar-Packages dürfen nicht parallel aktiv sein, wenn sie dieselben `lightning_detection_*`-Helfer definieren.

---

# View einrichten

Weder die native Integration noch der Dashboard-Download erzeugen automatisch eine Home-Assistant-View.

## Minimal-Konfiguration

Neue Panel-Ansicht anlegen und eine **Manuelle Karte** hinzufügen:

```yaml
type: custom:gewitterradar-card
```

## Vollständiges View-Beispiel

```yaml
views:
  - title: Gewitterradar
    path: gewitterradar
    icon: mdi:weather-lightning
    type: panel
    cards:
      - type: custom:gewitterradar-card
```

Falls der Blitzortung-Zähler nicht `sensor.home_lightning_counter` heißt:

```yaml
type: custom:gewitterradar-card
counter_entity: sensor.DEIN_LIGHTNING_COUNTER
```

---

# Blitzortung koppeln

Für weltweite Standortwechsel sollte Blitzortung.org den jeweils passenden Gewitterradar-Tracker als **Location entity** verwenden.

**Native Integration**

```text
device_tracker.gewitterradar
```

**Dashboard-/Package-Variante**

```text
device_tracker.gewitterradar_dashboard
```

Ablauf:

1. Standort in Gewitterradar suchen oder Koordinaten übernehmen.
2. Gewitterradar verschiebt den eigenen Referenztracker.
3. Blitzortung.org erkennt die Positionsänderung über die konfigurierte Location Entity.
4. Neuabonnement, Aktualisierung und Latenz der Blitzdaten bleiben Aufgabe der Blitzortung.org-Integration.

Gewitterradar verändert keine fremden Config Entries und schreibt nicht direkt in private Home-Assistant-`.storage`-Dateien.

---

# Recorder schützen

Bei hoher Blitzaktivität können sehr viele Zustandsänderungen entstehen. Die kurzlebigen Blitzentitäten sollten deshalb nicht dauerhaft im Recorder gespeichert werden.

```yaml
recorder:
  exclude:
    entity_globs:
      - "geo_location.lightning_strike*"
      - "sensor.*_lightning_distance"
      - "sensor.*_lightning_azimuth"
      - "sensor.*_lightning_counter"
```

Falls bereits ein `recorder:`-Block existiert, die Einträge dort ergänzen. **Keinen zweiten `recorder:`-Hauptschlüssel anlegen.**

Die Ausschlüsse betreffen nur die zukünftige Datenbank-/History-Speicherung. Die Live-Zustände bleiben für Gewitterradar verfügbar.

Mehr dazu: [docs/RECORDER.md](docs/RECORDER.md)

---

# JavaScript-Ressourcen prüfen

Es darf genau **eine** Gewitterradar-Ressource aktiv sein:

**Native Integration**

```text
/gewitterradar/gewitterradar.js
```

**Dashboard/HACS**

```text
/hacsfiles/gewitterradar-dashboard/gewitterradar.js
```

Veraltete, parallele oder Test-Ressourcen entfernen bzw. deaktivieren. Nach einer Änderung den Browser vollständig neu laden; bei hartnäckigem Cache gegebenenfalls einen Hard-Reload durchführen.

---

# Bestehende Installationen

Beim ersten nativen Setup können unterstützte gültige `lightning_detection_*`-Legacy-Werte einmalig übernommen werden. Bereits vorhandene native Werte haben Vorrang. Legacy-Helfer werden nicht gelöscht oder überschrieben.

Bei älteren Dashboard-Installationen insbesondere prüfen:

- nicht gleichzeitig alte und neue Gewitterradar-Repositories laden;
- nur eine JavaScript-Ressource aktiv halten;
- alte Packages deaktivieren, bevor das aktuelle Package aktiviert wird;
- historische Registry-Objekte erst löschen, wenn sie sicher nicht mehr verwendet werden.

Details: [docs/MIGRATION_AND_ROLLBACK.md](docs/MIGRATION_AND_ROLLBACK.md)

---

# Manuelle Installation der nativen Integration

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

Danach Home Assistant vollständig neu starten, Gewitterradar über **Einstellungen → Geräte & Dienste** hinzufügen und anschließend die Ressource `/gewitterradar/gewitterradar.js` registrieren.

---

# Prüfung nach der Installation

- nur eine Gewitterradar-JavaScript-Ressource aktiv;
- Karte und Radien werden dargestellt;
- Live-Blitze bzw. vorhandene 120-Minuten-Historie erscheinen;
- Kompass und Trend-Medaillon funktionieren;
- weltweite Ortssuche und direkte Koordinateneingabe funktionieren;
- der Gewitterradar-Tracker ändert bei einem Standortwechsel seine Koordinaten;
- Blitzortung.org verwendet den passenden Tracker als Location Entity;
- Hilfe-/Hinweisbereich und Recorder-Hinweis sind verfügbar;
- bei Dashboard-/Package-Nutzung liegt nur das aktuelle Package aktiv unter `/config/packages/`.

Bei der nativen Variante zusätzlich prüfen, dass die Integration nach einem Neustart geladen bleibt und ihre Einstellungen erhalten bleiben.

---

# Fehlersuche

| Symptom | Prüfen |
| --- | --- |
| Karte erscheint nicht | JavaScript-Ressource, Browser-Cache, genau eine aktive Gewitterradar-Ressource |
| Keine oder zu wenige Blitze | Blitzortung.org-Status, Quellradius, verwendete Entitäten |
| Standort wechselt, Blitzdatenregion nicht | Blitzortung.org muss den Gewitterradar-Tracker als **Location entity** verwenden |
| Backup/Datenbank wächst stark | Recorder-Ausschlüsse für Blitzentitäten prüfen |
| Sprache/Hilfe wirkt veraltet | Browser neu laden und sicherstellen, dass nur die aktuelle `locales/about-locales.js` ausgeliefert wird |
| Doppelte oder widersprüchliche Einstellungen | alte Packages/Ressourcen deaktivieren |

---

# Projektstand, Qualität und Schutz

Die V4.08-Entwicklung baut auf dem geschützten V4.07.56-Stand auf. Für Entwicklung und Produktpflege gibt es nur **ein Gewitterradar**; Integration und Dashboard müssen denselben Produktstand ausliefern.

Besonders geschützt sind:

- der abgenommene V4.05-Stand von **„Über Gewitterradar“** einschließlich Widmung „Für Alkje“, Slogan, Hero-/Widmungs-Assets, Recorder-Hinweis, Radien-Semantik und Onboarding;
- der normale UI-/Funktionsstand ab V4.07.54;
- der Diagnosevertrag ab V4.07.56;
- sämtliche Hi-Res-/Mastergrafiken einschließlich nicht mehr aktiver Legacy-Varianten;
- der Release-/Golden-Master-Prozess.

Verbindliche Dokumente:

- [ABOUT_GEWITTERRADAR_ACCEPTANCE_BASELINE_V4_05.md](docs/ABOUT_GEWITTERRADAR_ACCEPTANCE_BASELINE_V4_05.md)
- [DIAGNOSTIC_PROTECTION_V4_07_56.md](docs/DIAGNOSTIC_PROTECTION_V4_07_56.md)
- [ASSET_RETENTION_POLICY.md](docs/ASSET_RETENTION_POLICY.md)
- [GOLDEN_MASTER_POLICY.md](docs/GOLDEN_MASTER_POLICY.md)
- [RELEASE_PROCESS.md](docs/RELEASE_PROCESS.md)

Die Release-Linie wird unter anderem über Home-Assistant-Laufzeittests, Hassfest, HACS-Validierung, deterministisches Integration-/Dashboard-Staging, Locale-/Recorder-Prüfungen, Browserregressionen, Golden-/Geometrievertrag, Diagnosevertrag und Hi-Res-Retentionsvertrag abgesichert.

Ein grüner Laufzeittest ersetzt keine HACS-/Hassfest-Prüfung; eine statische Packaging-Prüfung ersetzt keinen realen HACS-Installationstest.

---

# Dokumentation

- [HTML-Handbuch](docs/gewitterradar-overview.html)
- [Installation](docs/INSTALLATION.md)
- [Recorder](docs/RECORDER.md)
- [Migration und Rückfall](docs/MIGRATION_AND_ROLLBACK.md)
- [Real-Install-Erkenntnisse](docs/REAL_INSTALL_FINDINGS_2026-09-06.md)
- [Projektgeschichte](docs/HISTORY.md)
- [Release-Ablauf](docs/RELEASE_PROCESS.md)
- [Golden-Master-Richtlinie](docs/GOLDEN_MASTER_POLICY.md)

---

# Lizenz und Branding

Soweit nicht ausdrücklich reservierte Branding-Materialien oder Drittmaterial mit eigener Lizenz betroffen sind, stehen Quellcode und Dokumentation unter **GNU GPL Version 3 only (`GPL-3.0-only`)**.

Copyright © 2026 **Christian Köhler / TheDaimos**.

Siehe [LICENSE](LICENSE), [COPYRIGHT.md](COPYRIGHT.md), [AUTHORS.md](AUTHORS.md) und [BRANDING.md](BRANDING.md).

Der Name **Gewitterradar**, Logos, Icons, Artwork und die visuelle Identität sind nicht Bestandteil der GPL-3.0-only-Freigabe. Forks und abgeleitete Projekte müssen ein eigenes Branding verwenden, sofern keine separate Erlaubnis vorliegt.
