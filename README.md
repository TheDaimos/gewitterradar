# Gewitterradar

**Gewitterradar** ist ein gemeinsames Home-Assistant-Projekt mit zwei Auslieferungsformen:

- native Home-Assistant-Integration;
- Dashboard-/Lovelace-Karte.

Für Entwicklung und Produktpflege gibt es fachlich nur **ein Gewitterradar**. Dieses Repository ist die kanonische Produkt- und Entwicklungsquelle.

**Current native integration version:** `0.18.0`
**Current shared product candidate:** `V4.06`

Die gemeinsame Frontend-/Produktkonvergenz läuft derzeit. Bis die vereinheitlichte Auslieferung vollständig veröffentlicht ist, wird die Dashboard-Karte zusätzlich über `TheDaimos/gewitterradar-dashboard` ausgeliefert. Dieser Dashboard-Zweig ist eine abgeleitete Auslieferungsform und keine unabhängige Entwicklungsquelle mehr.


## Gemeinsamer V4.06-Kandidat

Die gemeinsame Quelle liegt in `frontend/`. `node scripts/build-frontend.mjs` erzeugt identische Frontend-Payloads für Integration und Dashboard; `node scripts/verify-frontend.mjs` prüft die exakte Parität. V4.06 enthält den lokalisierten Hilfe-Dialog, 19 About-/Hilfe-Sprachvarianten und die gemeinsame Recorder-Wildcard-Regel. Die native Variante stellt `/gewitterradar/gewitterradar.js` bereit.

Für einen manuellen Dashboard-Test muss der komplette Inhalt von `dashboard/dist/` nach `/config/www/community/gewitterradar-dashboard/` kopiert werden, einschließlich `assets/`, `locales/about-locales.js` und `app_gewitterradar_v4_06_pkg.yaml`. Die alte unversionierte Package-Datei muss ersetzt werden. Siehe [Installation](docs/INSTALLATION.md).

## Was die native Integration bereitstellt

- einen UI Config Flow und einen Config Entry;
- persistente Einstellungen über `ConfigEntry.options`;
- typisierten Laufzeitzustand pro Config Entry;
- 16 native Konfigurationsentitäten:
  - 4 Select-Entitäten;
  - 5 Number-Entitäten;
  - 7 Switch-Entitäten;
- validierte Reihenfolge und Grenzen für Beobachtungs-, Gewitter- und Gefahrenradius;
- dynamische `person.*`-/`zone.*`-Referenzorte;
- einmalige, nicht-destruktive Migration unterstützter Legacy-Helfer `lightning_detection_*`;
- package-fähige bzw. package-freie Migrationspfade;
- dokumentiertes Unload-/Re-Enable-/Rollback-Verhalten.

Die native Integration ersetzt nicht die Blitzortung.org-Datenquelle für Live-Blitzereignisse.

## Zwei Auslieferungsformen, ein gemeinsamer Produktstand

Verbindliche Projektregel:

- Änderungen an Gewitterradar gelten standardmäßig für **Integration und Dashboard**;
- gemeinsamer Frontend-Code wird nur einmal entwickelt;
- Dashboard- und Integrationsauslieferung werden daraus deterministisch erzeugt;
- Abweichungen bei gemeinsamem Frontend, Assets, About-Dialog oder Prüfsummen gelten als Release-Fehler.

Besonders geschützt ist der abgenommene V4.05-Stand von **„Über Gewitterradar“** einschließlich Widmung „Für Alkje“, Slogan, Hero-/Widmungs-Assets, Recorder-Hinweis, Radien-Semantik und Onboarding-Verhalten. Siehe:

`docs/ABOUT_GEWITTERRADAR_ACCEPTANCE_BASELINE_V4_05.md`

## Installation

### 1. Native Gewitterradar-Integration

1. Dieses Repository in HACS als benutzerdefiniertes **Integration**-Repository hinzufügen.
2. **Gewitterradar Integration** installieren.
3. Home Assistant neu starten, wenn HACS dies verlangt.
4. **Einstellungen → Geräte & Dienste → Integration hinzufügen** öffnen.
5. **Gewitterradar** hinzufügen.

Nach einem vollständigen Home-Assistant-Neustart muss die Integration weiterhin unter **Einstellungen → Geräte & Dienste → Integrationen** sichtbar bleiben.

### 2. Dashboard-/Lovelace-Auslieferung

Bis die gemeinsame Auslieferung vollständig konvergiert und veröffentlicht ist, zusätzlich das Dashboard-Repository installieren:

`TheDaimos/gewitterradar-dashboard`

HACS installiert dessen Modul aktuell unter:

```text
/hacsfiles/gewitterradar-dashboard/gewitterradar.js
```

### 3. Nach dem HACS-Download: Gewitterradar-View anlegen

**Wichtig:** Der Download der Dashboard-Karte erzeugt keine Home-Assistant-View automatisch.

Prüfe unter **Einstellungen → Dashboards → Ressourcen**, dass folgende Modulressource vorhanden ist:

```text
/hacsfiles/gewitterradar-dashboard/gewitterradar.js
```

Lege anschließend eine Dashboard-View an. Ein vollständiger V4.06-Beispielstand lautet:

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

Die drei Beispiel-Entity-IDs stammen aus der bisherigen Package-/Legacy-Linie. Die laufende Konvergenz hat ausdrücklich das Ziel, Frontend und native Konfiguration aus demselben Gewitterradar-Stand bereitzustellen und die Neunutzer-Einrichtung weiter zu vereinfachen.

## Bestehende V4.04-/Legacy-Installationen

Beim ersten nativen Setup können unterstützte gültige Legacy-Helferwerte einmalig importiert werden. Bestehende native Werte haben Vorrang; Legacy-Helfer werden nicht gelöscht oder überschrieben.

Die native Integration löscht bewusst keine fremden oder historischen Home-Assistant-Entity-Registry-Einträge automatisch. Alte nicht verfügbare Automations- oder HACS-Update-Entitäten aus früheren Packages bzw. Repository-Namen müssen erst als wirklich veraltet verifiziert werden.

Siehe [`docs/MIGRATION_AND_ROLLBACK.md`](docs/MIGRATION_AND_ROLLBACK.md).

## Aktuelle Konvergenz- und Release-Gates

Vor dem nächsten gemeinsamen Gewitterradar-Release müssen mindestens nachgewiesen sein:

- vollständige Übernahme des veröffentlichten Dashboard-V4.05-Frontendstands;
- geschützter „Über Gewitterradar“-Dialog in beiden Auslieferungsformen;
- gleiche gemeinsame Frontend-/About-Assets und Prüfsummen;
- grüne native Integrationstests;
- grüne Dashboard-/HACS-Tests;
- reale Home-Assistant-/HACS-Abnahme;
- iPad-/Android-Spotchecks;
- dokumentierter Installationspfad einschließlich Dashboard-View-Einrichtung.

Aktiver Tracker:

- Issue #3 — `Converge V4.05 frontend into unified Gewitterradar product`

## Validation

Die Release-Linie wird unabhängig geprüft durch:

- Home-Assistant-Laufzeittests;
- Hassfest;
- HACS-Integrationsvalidierung;
- deterministisches Integration-Package-Staging;
- Fresh-Install-, Migration-, Unload-/Re-Enable- und Rollback-Tests;
- Dashboard-/Frontend-Build- und Asset-Prüfungen;
- reale HACS-/Geräteabnahme.

Ein grüner Laufzeittest ersetzt keine HACS-/Hassfest-Prüfung; eine statische Packaging-Prüfung ersetzt keinen realen HACS-Installationstest.

Siehe [`docs/REAL_INSTALL_FINDINGS_2026-09-06.md`](docs/REAL_INSTALL_FINDINGS_2026-09-06.md) für die ersten Real-Install-Erkenntnisse.

## Licensing and branding

Except for reserved branding materials and third-party material carrying its own license notice, the source code and documentation are licensed under **GNU GPL Version 3 only (`GPL-3.0-only`)**.

Copyright © 2026 **Christian Köhler / TheDaimos**.

See [`LICENSE`](LICENSE), [`COPYRIGHT.md`](COPYRIGHT.md), [`AUTHORS.md`](AUTHORS.md) and [`BRANDING.md`](BRANDING.md).

The Gewitterradar name, logos, icons, artwork and visual identity are not licensed under GPL-3.0-only. Forks and derivative projects must use distinct branding unless separate permission has been granted.
