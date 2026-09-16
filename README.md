# Gewitterradar

**Gewitterradar** ist ein gemeinsames Home-Assistant-Projekt mit zwei Auslieferungsformen:

- native Home-Assistant-Integration;
- Dashboard-/Lovelace-Karte.

Für Entwicklung und Produktpflege gibt es fachlich nur **ein Gewitterradar**. Dieses Repository ist die kanonische Produkt- und Entwicklungsquelle.

**Aktueller abgenommener Produktkandidat:** `2026/09 · V4.07.56`  
**Native Integration:** `0.19.0`  
**Öffentliche Rückfallbasis bis zur kontrollierten Promotion:** `2026/09 · V4.06`

V4.07.56 ist der vom Benutzer abgenommene gemeinsame Produkt-/Diagnosestand. `main` bleibt bis zur ausdrücklichen Freigabe unverändert; erst nach vollständig grünen Abschlussprüfungen, kontrollierter Promotion und erneuter Prüfung des tatsächlichen neuen `main` wird daraus der öffentliche Release-/Golden-Master-Stand.

## Gemeinsamer V4.07.56-Abschlussstand

Die gemeinsame Quelle liegt in `frontend/`. `node scripts/build-frontend.mjs` erzeugt identische Frontend-Payloads für Integration und Dashboard; `node scripts/verify-frontend.mjs` prüft die exakte Parität.

V4.07.56 enthält insbesondere:

- weltweite Orts-/PLZ-Suche und direkte Koordinateneingabe;
- gespeicherte Orte;
- dynamischen Gewitterradar-Bezugsstandort;
- vollständigen lokalisierten Hilfe-/Hinweisbereich;
- **15 Sprachen plus 4 Dialektvarianten = 19 Sprachvarianten**;
- den abgenommenen V4.07.54-Normalbetrieb;
- den dauerhaft geschützten Diagnosemodus aus V4.07.55/V4.07.56 mit virtuellem Gewitter, 1–5 Zellen, EXTREM, Medaillon-, Kalibrier-, Geometrie- und Performance-Werkzeugen.

Kanonische Frontendidentität:

```text
Größe:  1.955.141 Bytes
SHA256: 249485f4bcf68c9b23b821cae9b507030ae09cff5a56f7e28d3d7f3b02eb4a1a
```

Die native Variante stellt `/gewitterradar/gewitterradar.js` bereit.

Für einen manuellen Dashboard-Test muss der komplette Inhalt von `dashboard/dist/` nach `/config/www/community/gewitterradar-dashboard/` kopiert werden, einschließlich `assets/`, `locales/about-locales.js` und `app_gewitterradar_v4_07_pkg.yaml`. Das V4.07-Paket ersetzt bei aktiver V4.07-Dashboard-Nutzung das V4.06-Paket; beide dürfen nicht parallel geladen werden, weil sie dieselben `lightning_detection_*`-Helfer besitzen. Siehe [Installation](docs/INSTALLATION.md).

Das verbindliche Versions-/Monatsformat und die Pflichtschritte für Releases stehen in [`docs/RELEASE_PROCESS.md`](docs/RELEASE_PROCESS.md). Der aktuelle Stand wird als `YYYY/MM · Vx.xx`, historische Release-History-Einträge als `Vx.xx · YYYY/MM` angezeigt.

## Was die native Integration bereitstellt

- einen UI Config Flow und einen Config Entry;
- persistente Einstellungen über `ConfigEntry.options`;
- typisierten Laufzeitzustand pro Config Entry;
- native Konfigurationsentitäten für Sprache, Einheit, Kompass, Referenzort, Radien, Aura und weitere Produktoptionen;
- validierte Reihenfolge und Grenzen für Beobachtungs-, Gewitter- und Gefahrenradius;
- dynamische `person.*`-/`zone.*`-Referenzorte sowie den Gewitterradar-eigenen Referenztracker;
- einmalige, nicht-destruktive Migration unterstützter Legacy-Helfer `lightning_detection_*`;
- package-fähige bzw. package-freie Migrationspfade;
- dokumentiertes Unload-/Re-Enable-/Rollback-Verhalten.

Die native Integration ersetzt nicht die Blitzortung.org-Datenquelle für Live-Blitzereignisse. Ein Gewitterradar-Trackerwechsel bedeutet nicht automatisch, dass Blitzortung seine Datenregion bereits neu abonniert hat.

## Zwei Auslieferungsformen, ein gemeinsamer Produktstand

Verbindliche Projektregel:

- Änderungen an Gewitterradar gelten standardmäßig für **Integration und Dashboard**;
- gemeinsamer Frontend-Code wird nur einmal entwickelt;
- Dashboard- und Integrationsauslieferung werden daraus deterministisch erzeugt;
- Abweichungen bei gemeinsamem Frontend, Assets, About-Dialog oder Prüfsummen gelten als Release-Fehler.

Besonders geschützt sind:

- der abgenommene V4.05-Stand von **„Über Gewitterradar“** einschließlich Widmung „Für Alkje“, Slogan, Hero-/Widmungs-Assets, Recorder-Hinweis, Radien-Semantik und Onboarding-Verhalten;
- der abgenommene normale UI-/Funktionsstand von V4.07.54;
- der Diagnosevertrag ab V4.07.56;
- sämtliche Hi-Res-/Mastergrafiken einschließlich nicht mehr aktiver Legacy-Varianten.

Verbindliche Schutzdokumente:

- `docs/ABOUT_GEWITTERRADAR_ACCEPTANCE_BASELINE_V4_05.md`
- `docs/DIAGNOSTIC_PROTECTION_V4_07_56.md`
- `docs/ASSET_RETENTION_POLICY.md`
- `docs/GOLDEN_MASTER_POLICY.md`

## Installation

### 1. Native Gewitterradar-Integration

1. Dieses Repository in HACS als benutzerdefiniertes **Integration**-Repository hinzufügen.
2. **Gewitterradar Integration** installieren.
3. Home Assistant neu starten, wenn HACS dies verlangt.
4. **Einstellungen → Geräte & Dienste → Integration hinzufügen** öffnen.
5. **Gewitterradar** hinzufügen.

Nach einem vollständigen Home-Assistant-Neustart muss die Integration weiterhin unter **Einstellungen → Geräte & Dienste → Integrationen** sichtbar bleiben.

### 2. Dashboard-/Lovelace-Auslieferung

Für die Dashboard-/Lovelace-Auslieferung das abgeleitete Dashboard-Repository installieren:

`TheDaimos/gewitterradar-dashboard`

HACS installiert dessen Modul unter:

```text
/hacsfiles/gewitterradar-dashboard/gewitterradar.js
```

### 3. Nach dem HACS-Download: Gewitterradar-View anlegen

**Wichtig:** Der Download der Dashboard-Karte erzeugt keine Home-Assistant-View automatisch.

Prüfe unter **Einstellungen → Dashboards → Ressourcen**, dass folgende Modulressource vorhanden ist:

```text
/hacsfiles/gewitterradar-dashboard/gewitterradar.js
```

Lege anschließend eine Dashboard-View an. Ein Beispielstand lautet:

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

Der eigentliche Kartentyp ist:

```yaml
type: custom:gewitterradar-card
```

Die Beispiel-Entity-IDs stammen aus der Package-/Legacy-Linie. Unterstützte Legacy-Helfer bleiben als Migrations-/Kompatibilitätspfad erhalten.

## Bestehende Installationen

Beim ersten nativen Setup können unterstützte gültige Legacy-Helferwerte einmalig importiert werden. Bestehende native Werte haben Vorrang; Legacy-Helfer werden nicht gelöscht oder überschrieben.

Die native Integration löscht bewusst keine fremden oder historischen Home-Assistant-Entity-Registry-Einträge automatisch. Alte nicht verfügbare Automations- oder HACS-Update-Entitäten aus früheren Packages bzw. Repository-Namen müssen erst als wirklich veraltet verifiziert werden.

Siehe [`docs/MIGRATION_AND_ROLLBACK.md`](docs/MIGRATION_AND_ROLLBACK.md).

## V4.07.56-Finalisierung

Zum Abschlussstand gehören:

- exakt akzeptierte V4.07.56-Frontendquelle in allen kanonischen Auslieferungspfaden;
- bytegleiche gemeinsame Frontend-/Locale-/Asset-Payloads;
- V4.07-Dashboard-Paket als deterministisch gebauter und gehashter Bestandteil;
- 19-Sprachen-/Help-/Recorder-Verträge;
- eigener V4.07.56-Golden-/Geometrievertrag;
- geschützter Diagnosevertrag;
- automatischer Hi-Res-/Legacy-Retentionsvertrag;
- Home-Assistant-2026.9.0-Laufzeittest, HACS und Hassfest;
- PRE-MERGE-/Golden-Master-Prozess ohne Veränderung von `main` vor ausdrücklicher Freigabe.

Die detaillierten Abschlussnotizen stehen in [`docs/RELEASE_NOTES_V4_07_56.md`](docs/RELEASE_NOTES_V4_07_56.md).

## Validierung

Die Release-Linie wird unabhängig geprüft durch:

- Home-Assistant-Laufzeittests;
- Hassfest;
- HACS-Integrationsvalidierung;
- deterministisches Integration-/Dashboard-Staging;
- Fresh-Install-, Migration-, Unload-/Re-Enable- und Rollback-Tests;
- Dashboard-/Frontend-Build- und Asset-Prüfungen;
- Locale-/Recorder-Sprachaudits;
- Browserregressionen beider Auslieferungsformen;
- V4.07.56-Golden-/Geometrievertrag;
- Diagnose-Contract-Test;
- Hi-Res-Master-Retentionsvertrag.

Ein grüner Laufzeittest ersetzt keine HACS-/Hassfest-Prüfung; eine statische Packaging-Prüfung ersetzt keinen realen HACS-Installationstest.

Siehe [`docs/REAL_INSTALL_FINDINGS_2026-09-06.md`](docs/REAL_INSTALL_FINDINGS_2026-09-06.md) für die ersten Real-Install-Erkenntnisse.

## Licensing and branding

Except for reserved branding materials and third-party material carrying its own license notice, the source code and documentation are licensed under **GNU GPL Version 3 only (`GPL-3.0-only`)**.

Copyright © 2026 **Christian Köhler / TheDaimos**.

See [`LICENSE`](LICENSE), [`COPYRIGHT.md`](COPYRIGHT.md), [`AUTHORS.md`](AUTHORS.md) and [`BRANDING.md`](BRANDING.md).

The Gewitterradar name, logos, icons, artwork and visual identity are not licensed under GPL-3.0-only. Forks and derivative projects must use distinct branding unless separate permission has been granted.
