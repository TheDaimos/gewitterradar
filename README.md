<div align="center">

<img src="custom_components/gewitterradar/frontend/assets/gewitterradar-brand-icon.png" width="170" alt="Gewitterradar Logo">

# Gewitterradar

### Live-Blitz- und Gewitterdarstellung für Home Assistant

**Native Home-Assistant-Integration · Dashboard-Karte · weltweite Referenzorte · 120-Minuten-Verlauf**

![Home Assistant](https://img.shields.io/badge/Home%20Assistant-Integration-41BDF5?logo=home-assistant&logoColor=white)
![HACS](https://img.shields.io/badge/HACS-Custom%20Integration-41BDF5)
![Version](https://img.shields.io/badge/Gewitterradar-V4.07.56-c9a45b)
![Integration](https://img.shields.io/badge/Integration-0.19.0-c9a45b)
![License](https://img.shields.io/badge/Code-GPL--3.0--only-lightgrey)

</div>

---

> [!IMPORTANT]
> **Für neue Installationen ist die native Gewitterradar-Integration der empfohlene Weg.**  
> Diese README führt deshalb zuerst vollständig durch die native Installation. Die ältere bzw. alternative Dashboard-/Package-Variante findest du weiter unten in einem eigenen Abschnitt.

<table>
<tr>
<td width="50%" valign="top">

### ⚡ Native Integration

**Empfohlen für neue Installationen**

- Installation über HACS als **Integration**
- Einstellungen direkt als Home-Assistant-Entitäten
- kein YAML-Helferpaket notwendig
- eigener Gewitterradar-Referenztracker
- Dashboard-Karte aus derselben Installation

</td>
<td width="50%" valign="top">

### 🗺️ Datenquelle

Gewitterradar visualisiert Live-Blitze aus der Home-Assistant-Integration **Blitzortung.org**.

Gewitterradar ersetzt Blitzortung.org **nicht**. Die Blitzortung-Integration muss deshalb vorhanden und funktionsfähig sein.

</td>
</tr>
</table>

## Schnellnavigation

**[Installation](#installation--native-integration)** · **[Dashboard einrichten](#dashboard-einrichten)** · **[Ressource registrieren](#4-dashboard-ressource-registrieren)** · **[Blitzortung koppeln](#bezugsstandort-und-blitzortung)** · **[Recorder schützen](#recorder-schutz-empfohlen)** · **[Fehlersuche](#fehlersuche)** · **[Alternative Dashboard-Variante](#alternative-dashboard--package-variante)**

---

# Installation – Native Integration

## Voraussetzungen

Vor der Installation sollten vorhanden sein:

- Home Assistant
- HACS
- die Home-Assistant-Integration **Blitzortung.org** als Live-Datenquelle

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

Anschließend **Gewitterradar Integration** installieren.

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
> Dieser Schritt ist aktuell noch **manuell erforderlich**. Ohne diese Ressource kann Home Assistant die Gewitterradar-Karte nicht laden.

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
> Bei der **nativen Integration** nicht gleichzeitig `/hacsfiles/gewitterradar-dashboard/gewitterradar.js` registrieren. Es darf nur **eine** Gewitterradar-JavaScript-Ressource aktiv sein.

---

# Dashboard einrichten

Die Installation der Integration erzeugt aktuell **keine Dashboard-Ansicht automatisch**. Die Ansicht wird einmalig von Hand angelegt.

## Vollständiger Inhalt der Gewitterradar-View

Wenn du den **Rohkonfigurationseditor des Dashboards** verwendest, kannst du diese View direkt übernehmen:

```yaml
title: Gewitterradar
path: gewitterradar
icon: mdi:weather-lightning
type: panel
cards:
  - type: custom:gewitterradar-card
```

> [!TIP]
> Das ist die empfohlene native Grundkonfiguration. Weitere `lightning_detection_*`-Helfer müssen bei einer frischen nativen Installation **nicht** eingetragen werden.

### Wenn dein Dashboard im Rohkonfigurationseditor bereits mit `views:` beginnt

Dann wird dieselbe Ansicht so eingefügt:

```yaml
views:
  - title: Gewitterradar
    path: gewitterradar
    icon: mdi:weather-lightning
    type: panel
    cards:
      - type: custom:gewitterradar-card
```

## Alternative über die Home-Assistant-Oberfläche

1. Das gewünschte Dashboard öffnen.
2. **Dashboard bearbeiten** wählen.
3. Eine neue Ansicht anlegen.
4. Titel: **Gewitterradar**
5. Pfad: **gewitterradar**
6. Ansichtstyp: **Panel / eine Karte**
7. Optionales Symbol: `mdi:weather-lightning`
8. In der neuen Ansicht eine **Manuelle Karte** hinzufügen.
9. Folgenden Inhalt einfügen:

```yaml
type: custom:gewitterradar-card
```

### Falls dein Blitzortung-Zähler anders heißt

Standardmäßig verwendet die Karte:

```text
sensor.home_lightning_counter
```

Falls deine Blitzortung-Entität einen anderen Namen besitzt, kannst du sie explizit angeben:

```yaml
type: custom:gewitterradar-card
counter_entity: sensor.DEIN_LIGHTNING_COUNTER
```

<details>
<summary><strong>Native Entity-IDs explizit eintragen</strong></summary>

<br>

Normalerweise ist das bei einer frischen nativen Installation nicht erforderlich. Falls du die nativen Standard-Entity-IDs bewusst fest in der Karte hinterlegen möchtest, lautet der Block:

```yaml
type: custom:gewitterradar-card
counter_entity: sensor.home_lightning_counter
radius_entity: number.gewitterradar_observation_radius
compass_mode_entity: switch.gewitterradar_compass_nearest_strike
```

Home Assistant kann Entity-IDs bei Namenskonflikten automatisch mit einem Suffix versehen. In diesem Fall die tatsächlichen Entity-IDs deines Systems verwenden.

</details>

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
<td><strong>Native Einstellungen</strong></td>
<td>Sprache, Einheit, Kompass, Radien, Aura und weitere Gewitterradar-Optionen</td>
</tr>
</table>

Die Standardradien einer frischen nativen Installation sind derzeit:

- Beobachtung: **200 km**
- Gewitter: **80 km**
- Gefahr: **10 km**

---

# Bezugsstandort und Blitzortung

Gewitterradar besitzt ab V4.07 einen eigenen verschiebbaren Referenztracker.

In einer normalen Installation lautet die vorgeschlagene Entity-ID:

```text
device_tracker.gewitterradar
```

Home Assistant kann bei einer bereits belegten Entity-ID einen abweichenden Namen vergeben.

## Für einen festen Heimatstandort

Wenn Blitzortung.org bereits korrekt auf deinen gewünschten festen Standort eingestellt ist, musst du zunächst nichts ändern.

## Für weltweite bzw. wechselnde Standorte

Wenn Gewitterradar den Referenzort dynamisch verschieben soll:

1. In der **Blitzortung.org-Integration** den Gewitterradar-Tracker einmalig als **Location entity** auswählen.
2. Danach Standorte direkt in Gewitterradar auswählen oder Koordinaten übernehmen.
3. Gewitterradar aktualisiert seinen Referenztracker.
4. Blitzortung.org bleibt für die Datenregion, das Neuabonnement und die Aktualisierungslatenz verantwortlich.

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

Die Live-Zustände bleiben für Gewitterradar verfügbar. Bereits gespeicherte historische Daten werden durch diese Änderung nicht automatisch entfernt.

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

Danach Browser bzw. Home-Assistant-App vollständig neu laden. Bei Bedarf einen Hard-Reload bzw. Cache-Neuladen durchführen.

</details>

<details>
<summary><strong>Die Karte erscheint, aber es werden keine Live-Blitze angezeigt</strong></summary>

<br>

Prüfe zuerst die Blitzortung.org-Integration. Gewitterradar benötigt deren Live-Entitäten, insbesondere:

```text
geo_location.lightning_strike*
```

sowie den zugehörigen Lightning-Counter.

Wenn dein Counter nicht `sensor.home_lightning_counter` heißt, trage ihn in der Karte explizit über `counter_entity` ein.

</details>

<details>
<summary><strong>Nach einem Update sehe ich weiterhin eine alte Version</strong></summary>

<br>

Prüfe, dass nur **eine** Gewitterradar-JavaScript-Ressource aktiv ist. Alte Test- oder Dashboard-Ressourcen dürfen nicht parallel geladen werden.

Danach Browsercache neu laden.

</details>

<details>
<summary><strong>Die Integration ist nach einem Neustart nicht mehr sichtbar</strong></summary>

<br>

Unter **Einstellungen → Geräte & Dienste → Integrationen** nach Gewitterradar suchen und anschließend die Home-Assistant-Protokolle auf Fehler der Domain `gewitterradar` prüfen.

Die native Integration ist als normale Home-Assistant-Service-Integration ausgelegt und muss nach einem vollständigen Neustart sichtbar bleiben.

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
- einmalige Legacy-Migration vorhandener `lightning_detection_*`-Werte

</td>
</tr>
</table>

---

# Alternative Dashboard-/Package-Variante

<details>
<summary><strong>Alternative HACS-Dashboard-Auslieferung anzeigen</strong></summary>

<br>

Neben der nativen Integration existiert eine separate Dashboard-/Package-Auslieferung. Sie wird vor allem für bestehende Installationen und definierte Migrations-/Rückfallszenarien weiter gepflegt.

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

Danach weiterhin die Frontend-Ressource

```text
/gewitterradar/gewitterradar.js
```

als JavaScript-Modul registrieren und die Dashboard-Ansicht wie oben beschrieben erstellen.

</details>

---

# Dokumentation

<table>
<tr>
<td><strong>Installation</strong></td>
<td><a href="docs/INSTALLATION.md">docs/INSTALLATION.md</a></td>
</tr>
<tr>
<td><strong>Recorder</strong></td>
<td><a href="docs/RECORDER.md">docs/RECORDER.md</a></td>
</tr>
<tr>
<td><strong>Migration / Rollback</strong></td>
<td><a href="docs/MIGRATION_AND_ROLLBACK.md">docs/MIGRATION_AND_ROLLBACK.md</a></td>
</tr>
<tr>
<td><strong>Release Notes</strong></td>
<td><a href="docs/RELEASE_NOTES_V4_07_56.md">docs/RELEASE_NOTES_V4_07_56.md</a></td>
</tr>
<tr>
<td><strong>Real-Install-Erkenntnisse</strong></td>
<td><a href="docs/REAL_INSTALL_FINDINGS_2026-09-06.md">docs/REAL_INSTALL_FINDINGS_2026-09-06.md</a></td>
</tr>
</table>

---

<details>
<summary><strong>Entwicklungs-, Prüf- und Release-Informationen</strong></summary>

<br>

Aktueller abgenommener Produktkandidat: **2026/09 · V4.07.56**  
Native Integration: **0.19.0**  
Öffentliche Rückfallbasis bis zur kontrollierten Promotion: **2026/09 · V4.06**

Die gemeinsame Frontendquelle liegt in `frontend/`. `node scripts/build-frontend.mjs` erzeugt identische Frontend-Payloads für Integration und Dashboard; `node scripts/verify-frontend.mjs` prüft deren Parität.

Kanonische V4.07.56-Frontendidentität:

```text
Größe:  1.955.141 Bytes
SHA256: 249485f4bcf68c9b23b821cae9b507030ae09cff5a56f7e28d3d7f3b02eb4a1a
```

Verbindliche Schutz-/Prozessdokumente:

- `docs/ABOUT_GEWITTERRADAR_ACCEPTANCE_BASELINE_V4_05.md`
- `docs/DIAGNOSTIC_PROTECTION_V4_07_56.md`
- `docs/ASSET_RETENTION_POLICY.md`
- `docs/GOLDEN_MASTER_POLICY.md`
- `docs/RELEASE_PROCESS.md`

Zu den Release-Prüfungen gehören unter anderem Home-Assistant-Laufzeittests, Hassfest, HACS-Validierung, deterministische Builds, Fresh-Install-/Migration-/Rollback-Prüfungen, Browserregressionen sowie Golden-/Geometrie- und Diagnoseverträge.

</details>

---

# Lizenz und Branding

Der Quellcode und die Dokumentation stehen – mit Ausnahme reservierter Branding-Materialien und separat lizenzierter Drittinhalte – unter **GNU GPL Version 3 only (`GPL-3.0-only`)**.

Copyright © 2026 **Christian Köhler / TheDaimos**.

Siehe [`LICENSE`](LICENSE), [`COPYRIGHT.md`](COPYRIGHT.md), [`AUTHORS.md`](AUTHORS.md) und [`BRANDING.md`](BRANDING.md).

Der Name **Gewitterradar**, Logos, Icons, Grafiken und die visuelle Identität sind nicht Bestandteil der GPL-3.0-only-Freigabe. Forks und abgeleitete Projekte müssen ein eigenes Branding verwenden, sofern keine separate Erlaubnis vorliegt.