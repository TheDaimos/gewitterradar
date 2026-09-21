# Gewitterradar V4.10.02 – Modularchitektur

Status: M01 abgeschlossen · verbindliche Arbeitsbasis der V4.10-Modularisierung

## Ausgangslage

Die V4.10.01-Frontendquelle `frontend/gewitterradar.js` umfasst 2.249.312 Bytes und 24.896 Zeilen. Die Klasse `GewitterradarCard` enthält 299 erkannte Methoden-/Accessor-Blöcke. Die native Integration stellt bereits den gesamten Ordner `custom_components/gewitterradar/frontend/` statisch unter `/gewitterradar` bereit. Deshalb müssen Unter-Module nicht einzeln als Home-Assistant-Ressource registriert werden.

## Verbindliches Prinzip

- `gewitterradar.js` bleibt der einzige dauerhaft registrierte Einstiegspunkt.
- Unter-Module sind echte ES-Module unter `frontend/modules/`.
- Jedes Modul besitzt eigene Metadaten und eigene SemVer-Modulversion.
- Jedes geladene Modul registriert sich selbst im Laufzeitregister.
- Der Build kopiert den vollständigen Modulbaum byte-identisch in Integration und Dashboard-Auslieferung.
- DRA installiert den vollständigen Frontendbaum als konsistenten Stand.
- Ein manueller Austausch einzelner JS-Dateien ist nur Notfallweg.

## M01-Inventar

| Funktionsblock | Ausgangszeilen | Methoden | Zeichen ca. | Zielmodul |
|---|---:|---:|---:|---|
| Bootstrap/Lifecycle/Kartenanzeige/Scrollschutz | 5.979–8.120 | 56 | 114.554 | core/card-lifecycle + fullscreen/map-display + ui/scroll-guard |
| UI-Grundgerüst | 8.121–15.628 | 1 | 414.402 | ui/skeleton |
| Kompass-Skala | 15.629–15.938 | 1 | 13.440 | instruments/compass-scale |
| Bedienbindungen | 15.939–18.225 | 1 | 176.385 | ui/controls |
| Sprache/Einstellungen/About-Helfer | 18.226–19.122 | 59 | 118.492 | ui/i18n-settings |
| Diagnose/Kalibrierung | 19.123–20.553 | 112 | 191.002 | diagnostics/cockpit |
| Standort/Radien/Kartenstart | 20.554–21.166 | 23 | 26.709 | location/radii-map |
| Blitzaufnahme/Warnung/Geräteorientierung | 21.167–21.834 | 16 | 25.597 | map/strikes-warnings |
| Cluster/Recent | 21.835–22.936 | 23 | 47.559 | map/clusters-recent |
| Hauptrendering | 22.937–23.711 | 1 | 42.331 | ui/render |
| Kompassbewegung/-rendering | 23.712–24.052 | 3 | 16.950 | instruments/compass |
| Verlauf/Trend | 24.053–24.883 | 2 | 35.799 | history/chart |

## Zielbaum

```text
frontend/
├── gewitterradar.js
├── module-manifest.js
├── modules/
│   ├── core/
│   │   ├── registry.js
│   │   ├── runtime.js
│   │   └── card-lifecycle.js
│   ├── fullscreen/
│   │   └── map-display.js
│   ├── ui/
│   │   ├── scroll-guard.js
│   │   ├── skeleton.js
│   │   ├── controls.js
│   │   ├── i18n-settings.js
│   │   └── render.js
│   ├── instruments/
│   │   ├── compass-scale.js
│   │   └── compass.js
│   ├── diagnostics/
│   │   └── cockpit.js
│   ├── location/
│   │   └── radii-map.js
│   ├── map/
│   │   ├── strikes-warnings.js
│   │   └── clusters-recent.js
│   └── history/
│       └── chart.js
└── locales/
    └── about-locales.js
```

## Abhängigkeitsstrategie

Die bestehenden Methoden verwenden zahlreiche heute im IIFE lexikalisch gebundene Konstanten und Helfer. Um die Migration verhaltensneutral zu halten, erzeugt `core/runtime.js` die bestehende Laufzeitbasis. Funktionsmodule erhalten nur die von ihnen benötigten Runtime-Bindings und installieren ihre Methoden auf `GewitterradarCard.prototype`.

Damit bleiben:
- `this`-Semantik,
- Aufrufe zwischen Klassenmethoden,
- Home-Assistant-Zugriffe,
- Leaflet-Zugriffe,
- lokale Speicherpfade,
- bestehende UI-/Diagnoseverträge

unverändert.

## Versionsmodell

Beispiel:

```text
Gewitterradar V4.10.02
core.runtime              1.0.0
ui.skeleton               1.0.0
ui.controls               1.0.0
diagnostics.cockpit       1.0.0
map.clusters-recent       1.0.0
instruments.compass       1.0.0
history.chart             1.0.0
```

Modulversionen werden nur erhöht, wenn sich das jeweilige Modul fachlich ändert. Die Produktversion kann sich unabhängig davon erhöhen.

## DRA-Gate

V4.10.02 ist nur abnahmefähig, wenn:
1. `deploy-relay.json` den Gewitterradar-Integrationsbaum deklarativ ausliefert,
2. DRA den modularen Baum vollständig installiert,
3. ein Snapshot vor Installation entsteht,
4. ein vorheriger Stand wiederherstellbar ist,
5. der installierte Sollstand mit dem im Browser gemeldeten Iststand vergleichbar ist,
6. keine manuelle Einzeldatei-Registrierung erforderlich ist.
