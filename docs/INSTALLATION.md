# Installation

## HACS-Installation

Dieses Repository enthält beide Auslieferungsformen des aktuell abgenommenen Gewitterradar-Produktkandidaten **V4.07.56**: native Integration `0.19.0` und die abgeleitete Dashboard-/Card-Auslieferung.

Bis zur kontrollierten Promotion nach `main` und zum öffentlichen Release bleibt V4.06 die öffentliche Rückfallbasis. V4.07.56 wird ausschließlich aus dem exakt geprüften Finalisierungsstand veröffentlicht.

### Native Integration

1. In HACS `https://github.com/TheDaimos/gewitterradar` als benutzerdefiniertes Repository vom Typ **Integration** hinzufügen.
2. **Gewitterradar Integration** installieren.
3. Home Assistant neu starten, wenn HACS/Home Assistant dies verlangt.
4. **Einstellungen → Geräte & Dienste** öffnen.
5. **Integration hinzufügen** wählen und nach **Gewitterradar** suchen.
6. Den einzelnen Gewitterradar-Config-Entry anlegen.
7. `/gewitterradar/gewitterradar.js` als JavaScript-Modul unter **Einstellungen → Dashboards → Ressourcen** eintragen und anschließend eine Karte vom Typ `custom:gewitterradar-card` anlegen.

Die native Integration registriert die separate Dashboard-Ressource nicht automatisch und verändert keine Home-Assistant-`.storage`-Dateien.

### Erwartetes Ergebnis nach vollständigem Neustart

Nach dem Anlegen des Config Entry und einem vollständigen Home-Assistant-Neustart gilt:

- der Config Entry ist `loaded`;
- **Gewitterradar bleibt unter Einstellungen → Geräte & Dienste → Integrationen sichtbar**;
- die nativen Konfigurationsentitäten und ihre gespeicherten Werte bleiben vorhanden;
- HACS zeigt das Integration-Repository als installiert und nicht mehr als `pending-restart`.

Das Manifest klassifiziert Gewitterradar bewusst als Home-Assistant-Integration vom Typ `service`. Nicht auf `helper` zurückstellen: Home Assistant trennt Helper-Config-Entries in der Oberfläche von normalen Integrationen, wodurch ein technisch korrekt geladener Eintrag scheinbar verschwinden kann.

## Manuelle Installation der nativen Integration

Den vollständigen Ordner

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
├── manifest.json
├── number.py
├── select.py
├── strings.json
├── switch.py
├── frontend/
│   ├── gewitterradar.js
│   ├── assets/ (16 aktive Runtime-Grafiken + 1 bewusst erhaltenes Legacy-Asset)
│   └── locales/about-locales.js
├── brand/
│   ├── icon.png
│   └── icon@2x.png
└── translations/
    ├── de.json
    └── en.json
```

Home Assistant neu starten und **Gewitterradar** über **Einstellungen → Geräte & Dienste** hinzufügen.

## Fresh-Install-Verhalten

Eine frische native Installation benötigt das historische Gewitterradar-YAML-Helferpaket nicht. Native Standardwerte und Einstellungen liegen im Config Entry.

Der V4.07-Stand ergänzt den Gewitterradar-eigenen dynamischen Referenztracker für weltweite Standortwechsel. Gewitterradar verändert dabei keine fremden Blitzortung-ConfigEntries und keine privaten Home-Assistant-Speicherstrukturen.

## Bestehende Installationen

Sind beim ersten nativen Setup unterstützte `lightning_detection_*`-Legacy-Helfer vorhanden, können gültige Werte einmalig für noch nicht gesetzte native Einstellungen übernommen werden. Bereits vorhandene native Werte haben Vorrang. Legacy-Helfer werden nicht gelöscht oder umgeschrieben.

Die native Integration löscht ebenfalls keine fremden oder historischen Registry-Objekte. Eine nicht verfügbare Automation oder HACS-Update-Entität ist allein kein Beweis, dass der aktuelle Config Entry sie erzeugt hat. Vor einer Entfernung immer Quelle, Config Entry und Repository-ID prüfen.

Siehe [`MIGRATION_AND_ROLLBACK.md`](MIGRATION_AND_ROLLBACK.md).

## Manuelle Dashboard-/Card-Auslieferung

Den vollständigen lokalen Ordner `dashboard/dist/` nach

```text
/config/www/community/gewitterradar-dashboard/
```

kopieren. Er enthält insbesondere:

- `gewitterradar.js`;
- `assets/`;
- `locales/about-locales.js`;
- `app_gewitterradar_v4_07_pkg.yaml`;
- zusätzlich das erhaltene historische `app_gewitterradar_v4_06_pkg.yaml` als Rückfall-/Migrationsreferenz.

Das externe Locale-Modul wird für die 17 verzögert geladenen Sprachvarianten benötigt; ohne dieses Modul fallen diese kontrolliert auf Englisch zurück.

### V4.07-Paket aktivieren

Für eine aktive V4.07-Dashboard-Installation das Paket als

```text
/config/packages/app_gewitterradar_v4_07_pkg.yaml
```

verwenden.

**V4.06 und V4.07 niemals gleichzeitig als aktive Packages laden.** Beide definieren absichtlich dieselben `lightning_detection_*`-Helfer. Beim Upgrade muss das V4.06-Paket ersetzt bzw. deaktiviert werden.

Das kanonische V4.07-Paket besitzt aktuell die SHA256-Prüfsumme:

```text
1b705c5686e6a7be6dfb36717903df551d4f9f93787c39bd12bddf00aefae694
```

Ein vollständiger Home-Assistant-Neustart ist nach Änderungen am Package, an nativem Python-Code oder am Manifest erforderlich.

## JavaScript-Ressource

Genau **ein** Gewitterradar-Modul laden:

- native Integration: `/gewitterradar/gewitterradar.js`, oder
- Dashboard/HACS: `/hacsfiles/gewitterradar-dashboard/gewitterradar.js`.

Veraltete parallele Ressourcenregistrierungen vor dem Wechsel prüfen und entfernen/deaktivieren. Insbesondere historische Pfade wie `/hacsfiles/gewitterradar/gewitterradar.js?...` dürfen nicht parallel aktiv bleiben.

Kanonische V4.07.56-Frontendidentität:

```text
Größe:  1.955.141 Bytes
SHA256: 249485f4bcf68c9b23b821cae9b507030ae09cff5a56f7e28d3d7f3b02eb4a1a
```

## Weltweiter Bezugsstandort und Blitzortung

V4.07.56 kann den Gewitterradar-Bezugsstandort weltweit verschieben. Die separat installierte Blitzortung.org-Integration bleibt jedoch Eigentümerin ihrer eigenen Datenregion und Abonnementlogik.

Der sichere Kopplungsweg lautet:

1. den passenden Gewitterradar-Tracker einmalig als Blitzortung-`Location entity` konfigurieren;
2. spätere Gewitterradar-Standortwechsel nur über den Gewitterradar-Tracker ausführen;
3. nicht behaupten, dass ein Karten-/Trackerwechsel bereits die Blitzortung-Datenregion synchronisiert hat;
4. reale Neuabonnierung und Latenz werden von Blitzortung selbst bestimmt.

Gewitterradar schreibt keine fremden ConfigEntries um und manipuliert keine `.storage`-Dateien.

## Real-Install-Regressionsprüfungen

Nach Installation oder Update eines Kandidaten mindestens prüfen:

1. vollständigen Home-Assistant-Neustart durchführen;
2. verifizieren, dass Gewitterradar unter **Geräte & Dienste → Integrationen** sichtbar bleibt;
3. native Konfigurationsentitäten und Werte prüfen;
4. dynamische Referenzorte/Tracker ändern und auf Thread-Sicherheitsfehler achten;
5. weltweite Ortssuche und Koordinateneingabe prüfen;
6. gespeicherte Orte einschließlich Speichern, Soft-Delete und Wiederherstellen prüfen;
7. vorhandene Dashboard-/Card-Auslieferung prüfen;
8. erst danach Rollback-/Re-Update-Szenarien durchführen.

Siehe [`REAL_INSTALL_FINDINGS_2026-09-06.md`](REAL_INSTALL_FINDINGS_2026-09-06.md).

## Release-Gates für V4.07.56

Vor einer öffentlichen Freigabe müssen gegen den exakt vorgesehenen Commit erfolgreich sein:

- deterministischer Frontend-Neubau und bytegenaue Parität beider Auslieferungsformen;
- V4.07-Dashboard-Paketparität und gemeinsames SHA256-Inventar;
- JavaScript-Syntaxprüfung;
- HACS Integration Validation;
- Hassfest;
- Home-Assistant-Laufzeittests;
- Locale-/Help-/Recorder-Sprachaudits für 19 Varianten;
- Browserprofile für Desktop, Tablet und Mobilgeräte;
- V4.07.56-Golden-/Geometrievertrag;
- Diagnosevertrag;
- Hi-Res-/Legacy-Retentionsvertrag;
- PRE-MERGE-/Golden-Master-Prozess gemäß `docs/GOLDEN_MASTER_POLICY.md`.

Die detaillierten Abschlussnotizen stehen in [`RELEASE_NOTES_V4_07_56.md`](RELEASE_NOTES_V4_07_56.md).
