# Gewitterradar V4.06 – Recorder-Sprachaudit

Stand: 2026-09-11

## Umfang

Der Recorder-Bereich wurde für alle **19 registrierten Sprachvarianten** geprüft. Der Audit umfasst den About-/Welcome-Bereich und den Dialog **„Hilfe & Hinweise“**.

Geprüft wurden pro Sprachvariante:

- Recorder-Überschrift und erklärender Text;
- Hinweis auf die Bearbeitung der bestehenden `recorder:`-Sektion statt eines zweiten Top-Level-Blocks;
- Hinweis, dass Recorder-Ausschlüsse die von Gewitterradar verwendeten Live-Zustände **nicht** deaktivieren;
- Hinweis, dass bereits vorhandene historische Daten **nicht automatisch** gelöscht werden;
- Hinweis auf mehrere Blitzortungsgeräte bzw. Beobachtungspunkte durch Wildcard-Muster unabhängig vom Entity-Präfix;
- lokalisierte Kopiertexte und Kopier-Fehlermeldungen;
- vier lokalisierte Zweckbeschreibungen zu den technischen Recorder-Quellen.

## Kanonischer YAML-Block

Der technische YAML-Block bleibt in jeder Sprache identisch und wird nicht übersetzt:

```yaml
recorder:
  exclude:
    entity_globs:
      - "geo_location.lightning_strike*"
      - "sensor.*_lightning_distance"
      - "sensor.*_lightning_azimuth"
      - "sensor.*_lightning_counter"
```

Die früheren festen Sensor-IDs `sensor.home_lightning_distance`, `sensor.home_lightning_azimuth` und `sensor.home_lightning_counter` dürfen im aktuellen Recorder-Pfad nicht mehr vorkommen.

## Ergebnis

Der inhaltliche Audit ergab **keinen notwendigen Übersetzungsumbau**. Die vorhandenen Sprachvarianten transportieren die aktuellen Recorder-Hinweise vollständig. Die vier Dialektvarianten verwenden für die technischen Hilfeinhalte bewusst den geprüften deutschen Fachtext, während ihre sichtbaren Hilfeüberschriften und Dialogbezeichnungen dialektal angepasst bleiben.

Zusätzlich ist der Audit als fail-closed Test `scripts/test-recorder-locales.mjs` in die gemeinsame Frontend-CI aufgenommen. Er prüft unter anderem:

- exakt 19 registrierte Sprachvarianten;
- exakt die vier aktuellen Wildcard-Quellen;
- vollständige About-Recorder-Texte;
- eine Recorder-Hilfesektion mit allen vier Hinweisen pro Sprachvariante;
- unveränderte technische Syntax `configuration.yaml` und `recorder:`;
- Abwesenheit der alten festen `sensor.home_lightning_*`-Recorder-IDs.
