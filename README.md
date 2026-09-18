<div align="center">

<img src="https://raw.githubusercontent.com/TheDaimos/gewitterradar/main/frontend/assets/gewitterradar-brand-icon.png" width="180" alt="Gewitterradar Logo">

# Gewitterradar

### Live-Blitz- und Gewitterdarstellung für Home Assistant

<img src="https://raw.githubusercontent.com/TheDaimos/gewitterradar/main/frontend/assets/gewitterradar-about-hero-v2.webp" width="920" alt="Gewitterradar · Gewitterlandschaft">

**Native Home-Assistant-Integration · Dashboard-Karte · weltweite Referenzorte · 120-Minuten-Verlauf**

![Home Assistant](https://img.shields.io/badge/Home%20Assistant-Integration-41BDF5?logo=home-assistant&logoColor=white)
![HACS](https://img.shields.io/badge/HACS-Custom%20Integration-41BDF5)
![Version](https://img.shields.io/badge/Gewitterradar-V4.07.57-c9a45b)
![Integration](https://img.shields.io/badge/Integration-0.19.1-c9a45b)
![License](https://img.shields.io/badge/Code-GPL--3.0--only-lightgrey)

</div>

---

> [!IMPORTANT]
> **Für neue Installationen ist die native Gewitterradar-Integration der empfohlene Weg.**  
> Diese README führt zuerst vollständig durch genau diesen Installationsweg. Die separate Dashboard-/Package-Variante findest du weiter unten.

<table>
<tr>
<td width="50%" valign="top">

### ⚡ Native Integration

**Empfohlen für neue Installationen**

- Installation über HACS als **Integration**
- eigene Home-Assistant-Entitäten für Einstellungen
- kein YAML-Helferpaket notwendig
- eigener Gewitterradar-Referenztracker
- Dashboard-Karte aus derselben Installation

</td>
<td width="50%" valign="top">

### 🗺️ Datenquelle

Gewitterradar visualisiert Live-Blitze aus der Home-Assistant-Integration **Blitzortung.org**.

Gewitterradar ersetzt Blitzortung.org **nicht**. Die Blitzortung-Integration muss vorhanden und funktionsfähig sein.

</td>
</tr>
</table>

## Schnellnavigation

**[Installation](#installation--native-integration)** · **[Ressource](#4-dashboard-ressource-registrieren)** · **[View einrichten](#5-gewitterradar-view-einrichten)** · **[Blitzortung koppeln](#bezugsstandort-und-blitzortung)** · **[Recorder schützen](#recorder-schutz-empfohlen)** · **[Fehlersuche](#fehlersuche)**

---

# Installation – Native Integration

## Voraussetzungen

- Home Assistant
- HACS
- Home-Assistant-Integration **Blitzortung.org** als Live-Datenquelle

> [!NOTE]
> Eine frische native Gewitterradar-Installation benötigt **kein** `lightning_detection_*`-YAML-Package.

---

## 1. Repository in HACS hinzufügen

Öffne in Home Assistant:

**HACS → Benutzerdefinierte Repositories**

und füge dieses Repository hinzu:

```text
https://github.com/TheDaimos/gewitterradar
```

Als Typ auswählen:

```text
Integration
```

Danach **Gewitterradar Integration** installieren.

---

## 2. Home Assistant neu starten

Nach der HACS-Installation Home Assistant vollständig neu starten, wenn HACS bzw. Home Assistant dazu auffordert.

---

## 3. Gewitterradar als Integration hinzufügen

Nach dem Neustart:

**Einstellungen → Geräte & Dienste → Integration hinzufügen**

Nach

```text
Gewitterradar
```

suchen und die Integration hinzufügen.

Nach erfolgreicher Einrichtung muss **Gewitterradar** dauerhaft unter

**Einstellungen → Geräte & Dienste → Integrationen**

sichtbar bleiben.

---

## 4. Dashboard-Ressource registrieren

> [!WARNING]
> Dieser Schritt ist aktuell noch **manuell erforderlich**. Ohne die Ressource kann Home Assistant die Gewitterradar-Karte nicht laden.

Öffne:

**Einstellungen → Dashboards → Ressourcen**

und füge folgende Ressource hinzu:

```text
/gewitterradar/gewitterradar.js
```

Typ:

```text
JavaScript-Modul
```

<table>
<tr>
<td><strong>URL</strong></td>
<td><code>/gewitterradar/gewitterradar.js</code></td>
</tr>
<tr>
<td><strong>Typ</strong></td>
<td><code>JavaScript-Modul</code></td>
</tr>
</table>

> [!IMPORTANT]
> Bei der nativen Integration nicht zusätzlich `/hacsfiles/gewitterradar-dashboard/gewitterradar.js` laden. Es darf nur **eine** Gewitterradar-JavaScript-Ressource aktiv sein.

---

## 5. Gewitterradar-View einrichten

Die native Integration erzeugt aktuell **keine Dashboard-View automatisch**.

### Vollständiger, empfohlener View-Inhalt

Diesen Block kannst du für die Gewitterradar-View übernehmen:

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

> [!TIP]
> Dieser Block ist für die **native Integration** gedacht. Die Radius- und Kompass-Entitäten sind die nativen `number.gewitterradar_*`- bzw. `switch.gewitterradar_*`-Entitäten und nicht die alten `input_number.lightning_detection_*`-/`input_boolean.lightning_detection_*`-Helfer.

### Wenn dein Dashboard mit `views:` beginnt

Im Rohkonfigurationseditor des gesamten Dashboards sieht derselbe Abschnitt so aus:

```yaml
views:
  - title: Gewitterradar
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

### Über die Home-Assistant-Oberfläche

1. Gewünschtes Dashboard öffnen.
2. **Dashboard bearbeiten** wählen.
3. Neue Ansicht anlegen.
4. Titel: **Gewitterradar**
5. Pfad: **gewitterradar**
6. Symbol: `mdi:weather-lightning`
7. Ansichtstyp: **Panel / eine Karte**
8. Eine **Manuelle Karte** hinzufügen.
9. Für die Karte diesen Inhalt verwenden:

```yaml
type: vertical-stack
cards:
  - type: custom:gewitterradar-card
    counter_entity: sensor.home_lightning_counter
    radius_entity: number.gewitterradar_observation_radius
    compass_mode_entity: switch.gewitterradar_compass_nearest_strike
```

### Falls dein Blitzortung-Zähler anders heißt

Der Beispielblock verwendet:

```text
sensor.home_lightning_counter
```

Falls deine Blitzortung-Integration einen anderen Zähler besitzt, ersetze ausschließlich diese Entity-ID durch die tatsächliche Entity deines Systems.

Home Assistant kann auch native Gewitterradar-Entity-IDs bei Namenskonflikten mit einem Suffix versehen. In diesem Fall ebenfalls die tatsächlich erzeugte Entity-ID verwenden.

---

# Was nach der Installation vorhanden sein sollte

<table>
<tr>
<td width="35%"><strong>Integration</strong></td>
<td>Gewitterradar unter <em>Einstellungen → Geräte & Dienste → Integrationen</em></td>
</tr>
<tr>
<td><strong>Frontend-Ressource</strong></td>
<td><code>/gewitterradar/gewitterradar.js</code></td>
</tr>
<tr>
<td><strong>Kartentyp</strong></td>
<td><code>custom:gewitterradar-card</code></td>
</tr>
<tr>
<td><strong>Referenztracker</strong></td>
<td>normalerweise <code>device_tracker.gewitterradar</code></td>
</tr>
<tr>
<td><strong>Beobachtungsradius</strong></td>
<td><code>number.gewitterradar_observation_radius</code></td>
</tr>
<tr>
<td><strong>Kompassmodus</strong></td>
<td><code>switch.gewitterradar_compass_nearest_strike</code></td>
</tr>
</table>

Standardradien einer frischen nativen Installation:

- Beobachtung: **200 km**
- Gewitter: **80 km**
- Gefahr: **10 km**

---

# Bezugsstandort und Blitzortung

Gewitterradar besitzt ab V4.07 einen eigenen verschiebbaren Referenztracker.

In einer Standardinstallation lautet die vorgeschlagene Entity-ID:

```text
device_tracker.gewitterradar
```

Home Assistant kann bei einer bereits belegten Entity-ID einen abweichenden Namen vergeben.

## Fester Heimatstandort

Wenn Blitzortung.org bereits korrekt auf deinen gewünschten festen Standort eingestellt ist, musst du zunächst nichts ändern.

## Weltweite bzw. wechselnde Standorte

Wenn Gewitterradar den Referenzort dynamisch verschieben soll:

1. In der **Blitzortung.org-Integration** den Gewitterradar-Tracker einmalig als **Location entity** auswählen.
2. Danach Standorte direkt in Gewitterradar auswählen oder Koordinaten übernehmen.
3. Gewitterradar aktualisiert seinen Referenztracker.
4. Blitzortung.org bleibt für Datenregion, Neuabonnement und Aktualisierungslatenz verantwortlich.

> [!NOTE]
> Gewitterradar verändert keine fremden Config Entries und schreibt nicht direkt in Home-Assistant-`.storage`.

---

# Recorder-Schutz empfohlen

Blitzortung kann sehr viele kurzlebige Entitäten und Zustandsänderungen erzeugen. Um unnötiges Datenbank- und Backup-Wachstum zu vermeiden, wird empfohlen, diese Live-Daten vom Home-Assistant-Recorder auszunehmen.

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

> [!CAUTION]
> Falls bereits ein `recorder:`-Block vorhanden ist, die Einträge dort ergänzen. **Keinen zweiten `recorder:`-Hauptschlüssel anlegen.**

Die Live-Zustände bleiben für Gewitterradar verfügbar. Bereits gespeicherte historische Daten werden dadurch nicht automatisch entfernt.

Mehr dazu: **[`docs/RECORDER.md`](docs/RECORDER.md)**

---

# Fehlersuche

<details>
<summary><strong>„Custom element doesn't exist: gewitterradar-card“</strong></summary>

<br>

Prüfe unter **Einstellungen → Dashboards → Ressourcen**, ob exakt diese Ressource vorhanden ist:

```text
/gewitterradar/gewitterradar.js
```

Typ: **JavaScript-Modul**.

Danach Browser bzw. Home-Assistant-App vollständig neu laden.

</details>

<details>
<summary><strong>Die Karte erscheint, aber es werden keine Live-Blitze angezeigt</strong></summary>

<br>

Prüfe zuerst die Blitzortung.org-Integration. Gewitterradar benötigt deren Live-Entitäten, insbesondere:

```text
geo_location.lightning_strike*
```

und den Lightning-Counter.

Wenn dein Counter nicht `sensor.home_lightning_counter` heißt, ersetze `counter_entity` in der View durch die tatsächliche Entity-ID.

</details>

<details>
<summary><strong>Nach einem Update sehe ich weiterhin eine alte Version</strong></summary>

<br>

Prüfe, dass nur **eine** Gewitterradar-JavaScript-Ressource aktiv ist. Alte Test- oder Dashboard-Ressourcen dürfen nicht parallel geladen werden.

Danach Browsercache neu laden.

</details>

<details>
<summary><strong>Die Integration ist nach einem Neustart nicht sichtbar</strong></summary>

<br>

Unter **Einstellungen → Geräte & Dienste → Integrationen** nach Gewitterradar suchen und die Home-Assistant-Protokolle auf Fehler der Domain `gewitterradar` prüfen.

</details>

---

# Funktionen

<table>
<tr>
<td width="50%" valign="top">

### 🌩️ Gewitterdarstellung

- Live-Blitzpositionen
- Beobachtungs-, Gewitter- und Gefahrenradius
- Einzelblitze und dynamische Gruppierung
- 120-Minuten-Historie
- Aktivitäts- und Gefahrenanzeige

</td>
<td width="50%" valign="top">

### 🧭 Navigation und Analyse

- mehrere Kompassdesigns
- nächster bzw. letzter Blitz
- Trend-Medaillon
- weltweite Orts-/PLZ-Suche
- direkte Koordinateneingabe
- gespeicherte Orte

</td>
</tr>
<tr>
<td valign="top">

### 🌍 Oberfläche

- Desktop, Tablet und Mobilgeräte
- 15 Sprachen
- 4 deutsche Dialektvarianten
- integrierte Hilfe und Hinweise

</td>
<td valign="top">

### ⚙️ Native Integration

- persistente Home-Assistant-Einstellungen
- eigene Number-/Select-/Switch-Entitäten
- eigener Referenztracker
- einmalige Legacy-Migration unterstützter `lightning_detection_*`-Werte

</td>
</tr>
</table>

---

# Alternative Dashboard-/Package-Variante

<details>
<summary><strong>Alternative HACS-Dashboard-Auslieferung anzeigen</strong></summary>

<br>

Neben der nativen Integration existiert eine separate Dashboard-/Package-Auslieferung. Sie wird vor allem für bestehende Installationen sowie definierte Migrations- und Rückfallszenarien weiter gepflegt.

Repository:

```text
https://github.com/TheDaimos/gewitterradar-dashboard
```

HACS-Typ:

```text
Dashboard
```

JavaScript-Ressource:

```text
/hacsfiles/gewitterradar-dashboard/gewitterradar.js
```

Diese Variante benötigt zusätzlich das V4.07-YAML-Package unter `/config/packages/`.

**Für eine neue Installation wird die native Integration oben empfohlen.**

Vollständige Anleitung: **[`docs/INSTALLATION.md`](docs/INSTALLATION.md)**

</details>

---

# Bestehende Installationen und Migration

<details>
<summary><strong>Hinweise für ältere Gewitterradar-/Package-Installationen</strong></summary>

<br>

Beim ersten nativen Setup können unterstützte gültige `lightning_detection_*`-Legacy-Werte einmalig übernommen werden. Bereits vorhandene native Werte haben Vorrang.

Legacy-Helfer werden nicht automatisch gelöscht oder überschrieben.

Bei älteren Dashboard-Installationen besonders prüfen:

- keine parallelen alten Gewitterradar-JavaScript-Ressourcen;
- V4.06- und V4.07-Package nicht gleichzeitig aktiv;
- altes Dashboard-Repository `TheDaimos/gewitterradar` nicht zusätzlich laden;
- für die separate Dashboard-Auslieferung `TheDaimos/gewitterradar-dashboard` verwenden.

Weitere Informationen: **[`docs/MIGRATION_AND_ROLLBACK.md`](docs/MIGRATION_AND_ROLLBACK.md)**

</details>

---

# Manuelle Installation ohne HACS

<details>
<summary><strong>Manuelle Installation der nativen Integration anzeigen</strong></summary>

<br>

Den vollständigen Ordner

```text
custom_components/gewitterradar/
```

nach

```text
/config/custom_components/gewitterradar/
```

kopieren.

Home Assistant vollständig neu starten und anschließend **Gewitterradar** über

**Einstellungen → Geräte & Dienste → Integration hinzufügen**

anlegen.

Danach die Frontend-Ressource

```text
/gewitterradar/gewitterradar.js
```

als JavaScript-Modul registrieren und die View wie oben beschrieben anlegen.

</details>

---

# Dokumentation

<table>
<tr><td><strong>Installation</strong></td><td><a href="docs/INSTALLATION.md">docs/INSTALLATION.md</a></td></tr>
<tr><td><strong>Recorder</strong></td><td><a href="docs/RECORDER.md">docs/RECORDER.md</a></td></tr>
<tr><td><strong>Migration / Rollback</strong></td><td><a href="docs/MIGRATION_AND_ROLLBACK.md">docs/MIGRATION_AND_ROLLBACK.md</a></td></tr>
<tr><td><strong>Release Notes</strong></td><td><a href="docs/RELEASE_NOTES_V4_07_57.md">docs/RELEASE_NOTES_V4_07_57.md</a></td></tr>
<tr><td><strong>Real-Install-Erkenntnisse</strong></td><td><a href="docs/REAL_INSTALL_FINDINGS_2026-09-06.md">docs/REAL_INSTALL_FINDINGS_2026-09-06.md</a></td></tr>
</table>

---

<details>
<summary><strong>Entwicklungs-, Prüf- und Release-Informationen</strong></summary>

<br>

Aktueller öffentlicher Produktstand: **2026/09 · V4.07.57**  
Native Integration: **0.19.1**  
Geschützte Laufzeitbasis: **2026/09 · V4.07.56**

Die gemeinsame Frontendquelle liegt in `frontend/`. `node scripts/build-frontend.mjs` erzeugt identische Frontend-Payloads für Integration und Dashboard; `node scripts/verify-frontend.mjs` prüft deren Parität.

Kanonische V4.07.57-Frontendidentität:

```text
Größe:  1.955.144 Bytes
SHA256: ac921b5fc40f2d7f36733bb7262fdb1595790674695ad0eb83ccde8bc7146571

Laufzeitschutz: Nach Rücknormalisierung der Versions-/Build-Metadatenanker ist der Frontendinhalt exakt identisch mit der geschützten V4.07.56-Basis (`249485f4bcf68c9b23b821cae9b507030ae09cff5a56f7e28d3d7f3b02eb4a1a`).
```

Verbindliche Schutz-/Prozessdokumente:

- `docs/ABOUT_GEWITTERRADAR_ACCEPTANCE_BASELINE_V4_05.md`
- `docs/DIAGNOSTIC_PROTECTION_V4_07_56.md`
- `docs/ASSET_RETENTION_POLICY.md`
- `docs/GOLDEN_MASTER_POLICY.md`
- `docs/RELEASE_PROCESS.md`

</details>

---

# Lizenz und Branding

Der Quellcode und die Dokumentation stehen – mit Ausnahme reservierter Branding-Materialien und separat lizenzierter Drittinhalte – unter **GNU GPL Version 3 only (`GPL-3.0-only`)**.

Copyright © 2026 **Christian Köhler / TheDaimos**.

Siehe [`LICENSE`](LICENSE), [`COPYRIGHT.md`](COPYRIGHT.md), [`AUTHORS.md`](AUTHORS.md) und [`BRANDING.md`](BRANDING.md).

Der Name **Gewitterradar**, Logos, Icons, Grafiken und die visuelle Identität sind nicht Bestandteil der GPL-3.0-only-Freigabe. Forks und abgeleitete Projekte müssen ein eigenes Branding verwenden, sofern keine separate Erlaubnis vorliegt.
