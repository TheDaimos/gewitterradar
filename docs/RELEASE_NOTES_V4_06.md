# Gewitterradar V4.06 · 2026/09 – Release Notes

> Status: **Finaler Release-Stand.** Reale Geräte-Sichtprüfung, Recorder-Sprachaudit, Release-History-Abgleich und Abschlussvalidierung gehören zum V4.06-Freeze.

## Überblick

V4.06 führt Dashboard-Karte und native Home-Assistant-Integration auf einen gemeinsamen Frontend- und Produktstand zusammen. Beide Auslieferungsformen werden deterministisch aus derselben Quelle erzeugt und gemeinsam geprüft.

Der Schwerpunkt dieser Version liegt auf Internationalisierung, Hilfe und Dokumentation, Recorder-Mehrgerätefähigkeit, Release-Chronologie sowie einer umfangreichen realen Geräte-Feinabstimmung der Premium-Oberfläche.

## Neu

- **15 Sprachen + 4 Dialektvarianten = 19 About-/Hilfe-Sprachvarianten** mit streng validiertem Sprachschema.
- Neuer Premium-Dialog **„Hilfe & Hinweise“** mit Erklärungen zu Voraussetzungen, Radien, Referenzstandort, wichtigen Funktionen, Grundeinstellungen, Fehlerdiagnose und Recorder.
- Verzögert geladenes gemeinsames Locale-Modul für die zusätzlichen Sprachen.
- Persönliche, bereits vorhandene Signatur aus den Einstellungen zusätzlich im Welcome-Footer.
- Finale Welcome-Kennung: `2026/09 · V4.06 · Gewitterradar · by CK`.
- Einstellungen unten links und Release-History-Kopf: `2026/09 · V4.06`.
- Release History mit lückenloser V4.00–V4.06-Linie, nachgetragenem V4.05-Eintrag und Monatsangaben.
- `V4.07 · PLANNED` mit **Weltweiter Orts-Suche** als nächstem vorgesehenen Entwicklungsthema.
- Eigene Projektgeschichte, Meilensteinübersicht, Recorder-Sprachaudit, verbindlicher Release-Ablauf und V4.06-Release-Notes.

## Recorder und Datenquellen

Die Recorder-Empfehlung verwendet geräteunabhängige Wildcards:

```yaml
recorder:
  exclude:
    entity_globs:
      - "geo_location.lightning_strike*"
      - "sensor.*_lightning_distance"
      - "sensor.*_lightning_azimuth"
      - "sensor.*_lightning_counter"
```

Damit lassen sich mehrere Blitzortungsgeräte bzw. Beobachtungspunkte ohne festes Sensorpräfix abdecken. Die Ausschlüsse betreffen die Recorder-Historie und deaktivieren nicht die Live-Zustände von Gewitterradar. Bereits vorhandene historische Daten werden durch diese Konfigurationsänderung nicht automatisch gelöscht.

Der finale Recorder-Sprachaudit wurde für alle 19 registrierten Sprachvarianten abgeschlossen. Ein eigener fail-closed CI-Test verhindert die Rückkehr der früheren festen `sensor.home_lightning_*`-Recorder-IDs.

## Premium-Oberfläche

- metallisch schillernde, kräftigere Rahmen in **Einstellungen** und **Hilfe & Hinweise**;
- harmonisiertes Premium-X in den Dialogen;
- freigegebene Schriftrolle als Kopier-Schaltfläche für Recorder-YAML;
- Welcome-Zahnrad in die Hauptansicht und den Hilfedialog übernommen;
- Hilfesymbole geräteübergreifend ausgerichtet und das Haus-Symbol bei **„Voraussetzungen“** vergrößert;
- Chevrons und Abschnittshierarchie optisch verfeinert;
- Premium-Einstiegsschaltflächen im Einstellungsdialog auch auf geeigneten mobilen Hochformatbreiten nebeneinander;
- Versionsanzeige im Einstellungsdialog in den unteren linken Freiraum verschoben.

## Welcome-/About-Feinabstimmung

- persönliche Widmung im deutschen mobilen Hochformat gezielt auf einen besseren Textfluss abgestimmt;
- persönliche Signatur im Welcome-Footer auf Desktop/Tablet an den Schaltflächen ausgerichtet und auf Android stärker hervorgehoben;
- Footer-Anordnung aus Signatur, Schaltflächen, Zahnrad und Versionsinformation gerätespezifisch verfeinert;
- Radius-Wertefelder `70 KM`, `30 KM`, `5 KM` um ungefähr 25 % vergrößert und vertikal zentriert;
- iPad-/iPad-Pro-Fokusartefakte am Premium-X und am erneut geöffneten About-Dialog behoben;
- griechischer mobiler Hochformat-Sonderfall korrigiert: Der Spruch fließt unter dem längeren Untertitel und überdeckt ihn nicht mehr; die griechische Übersetzung selbst blieb unverändert;
- korrigierter griechischer Hochformat-Stand real auf Android geprüft und abgenommen.

## Release History und Zeitachse

Die sichtbare Release History verwendet ab V4.06 verbindlich:

- aktueller Stand: `YYYY/MM · Vx.xx`;
- veröffentlichte historische Einträge: `Vx.xx · YYYY/MM`;
- Planung: `Vx.xx · PLANNED`.

Die Projektzeitachse beginnt `2026/08`; die sichtbaren V3.x-Meilensteine sind diesem Entwicklungsmonat zugeordnet. Die stabile V4-Reihe V4.00 bis V4.06 gehört zu `2026/09`. V4.05 ist wieder als eigener öffentlicher Meilenstein enthalten. Die Pflege dieses Formats ist in `docs/RELEASE_PROCESS.md` verbindlich festgeschrieben.

## Technische Änderungen und Qualitätssicherung

- gemeinsame kanonische Frontend-Quelle;
- deterministische Erzeugung der Dashboard- und Integrationsauslieferung;
- bytegenaue Parität der gemeinsamen Frontend-Dateien und Assets;
- versioniertes Dashboard-Helferpaket `app_gewitterradar_v4_06_pkg.yaml`;
- lazy geladenes About-/Hilfe-Locale-Modul;
- fail-closed Delta-Prüfungen für geschützte Quellanker;
- dedizierter Recorder-Sprachaudit;
- Regressionstests für beide Auslieferungsformen;
- Browserprofile Desktop, iPad, iPad Pro, Android Hochformat und Android Querformat;
- Home-Assistant-Laufzeittests, Hassfest, HACS-Validierung und Paketverträge.

## Kompatibilität

- Die Blitzortung.org-Integration bleibt die Quelle der Live-Blitzereignisse.
- Bestehende unterstützte `lightning_detection_*`-Helfer bleiben als Kompatibilitäts-/Migrationspfad berücksichtigt.
- Historische fremde oder nicht mehr verfügbare Entity-Registry-Einträge werden nicht automatisch gelöscht.
- Native Integration und Dashboard-Auslieferung dürfen nicht gleichzeitig dieselbe Custom Card doppelt registrieren; in Home Assistant soll nur die tatsächlich verwendete Gewitterradar-Modulressource aktiv sein.

## Freeze

V4.06 wird ausschließlich aus dem vollständig geprüften finalen Commit veröffentlicht. Nach dem Freeze werden Tag, eingefrorener Rückfallpunkt und Release-Artefakte nicht mehr umgeschrieben. Neue Funktionen – insbesondere die geplante weltweite Orts-Suche – beginnen erst auf der nächsten Versionslinie.
