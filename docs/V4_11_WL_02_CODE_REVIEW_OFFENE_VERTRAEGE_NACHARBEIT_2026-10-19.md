# V4.11-WL-02 – Gezielte technische Codeprüfung des Zwischenstands

**Datum:** 19.10.2026 · **Projekt:** `TheDaimos/gewitterradar` · **Branch:** `deploy/dev`.  
**Geprüfter Stand:** Commit `fc5e9dcae46c72aa71ac60842e5f90d3d00141e5` einschließlich `a3b4f4bca8bd`, `6f857467c0d2`. **Nur statische Prüfung – kein CODE-/CI-/HA-REAL-PASS.**

## 1. Kritischer Vertragsfehler – Coverage-Format GR ↔ WR

GR: `frontend/modules/weather/layer-menu.js`:
```js
const bbox=Array.isArray(spatial?.bbox)?spatial.bbox:Array.isArray(spatial)?spatial:null;
```
und anschließende Destrukturierung als `[west,south,east,north]`.

WR: `custom_components/weather_router/spatial_coverage.py::normalize_coverage()` / `normalize_bbox()` gibt für räumlich verifizierte Quellen dagegen:
```json
{"scope":"bbox","bbox":{"west":5,"south":47,"east":16,"north":56}}
```
zurück. In `consumer_api.py::_provenance()` wird `normalize_coverage(result.get("machine_coverage"))` als `provenance.spatial_coverage` weitergereicht.

**Konsequenz:** Eine reguläre, gültige `bbox`-Coverage wird im GR-Adapter aktuell abgelehnt (`coverage=null` → `Rastervertrag unvollständig`), selbst wenn V1 `ready` ist. **Vertragstreuen Objektzugang implementieren und die bisherigen alternativen Formen ausschließlich bei nachgewiesenem Bedarf behandeln**. `scope=global` nicht in eine frei erfundene BBOX umwandeln. Antimeridian (`west>east`) gemäß WR-Semantik behandeln, nicht pauschal als ungültig verwerfen; Leaflet-Grenzen ggf. segmentieren.

**Pflichtnachweis:** kontrollierte Tests mit echter WR-Vertragsform `bbox` als Objekt, `scope=global`, ungültigen/fehlenden Daten, dateline-wrapping und normalen Randfällen; keine Orts-/Datenspekulation.

## 2. Weitere nachgewiesene Implementierungslücken

- `_weatherGenericRefresh()` wird im geprüften Rastermodul nur unmittelbar beim Einschalten aufgerufen. Kein verifizierter `moveend`-/`zoomend`-/Kartenersetzungs-/Sichtbarkeits-/Reconnect-Lebenszyklus; vorhandene `L.tileLayer`-Kachelbewegung ersetzt **nicht** notwendige erneute V1-Resolve-/Coverage-/Zeitprüfung.
- `_teardownMapDisplayMenuExtension()` leert Menüzustand, ruft aber **weder** `_weatherGenericDetach()` **noch** Generation-Abbruch auf den beiden generischen Ebenen auf. Veraltete und gemountete Wetterlayer bei vollständigem Kartenabbau müssen bereinigt werden; kein versehentliches Abschalten beim bloßen Schließen des Popup-Menüs.
- Bereits die **erste** `tileload`-Benachrichtigung setzt `status="ready"` / `Karte aktiv`. Das ist ein partieller Kachelerfolg, **kein** vollständiger Raster-Fertigstellungsbeweis. `loading`-/`tileload`-/`tileerror`-/`load`-Zyklen und geografische Bildvollständigkeit/Abbrüche getrennt erfassen.
- `L.tileLayer` mit `bounds` allein garantiert keinen pixelgenauen Randzuschnitt. Native Projektion/Kachelkonvention, Kartenrand/Zoom, Bildtransparenz/NoData und verfügbare WR-V1-Tile-Muster müssen anhand echten Runtime-Vertrags geprüft werden. Vorhandene Niederschlagsraster-/Coverage-Gates nicht beeinträchtigen.
- `safeRasterUrl` lässt nur HTTPS-XYZ-`{z}/{x}/{y}`-Vorlagen zu; legitime WR-WMS/BBOX-Schemata (falls reale V1-Payloads sie liefern) brauchen eine **ausdrückliche** Vertragsentscheidung. Kein unsicherer URL-Fallback, keine freie URL-Injektion.
- `freshness.data_time` / `valid_at` wird aktuell primär auf syntaktischen ISO-Zeitstempel geprüft, nicht auf fachliche Gültigkeit/Datenalter gemäß WR-Vertrag. Aktualität, unterschiedliche Beobachtung/Modellvorhersage, Quellen-/Lizenz-/Legendentext und Diagnose fehlen teilweise.
- `layer-menu.js` enthält den neuen Code mit unverändertem `MODULE_META.version:"1.1.4"`; `frontend/gewitterradar.js` importiert es noch mit `?v=41109r1`. **Vor Freigabe vollständige Versionierungs-/Cache-Buster-/Manifest- und drei Laufzeitkopien** prüfen; nicht den jetzigen nur im Frontend geänderten Stand als installierbar ausgeben.
- Keine Belege für zugehörige kontrollierte Regressionen, GitHub-CI, echten Browser und HA; bisherige Dokumentation behauptet sie zu Recht nicht.

## 3. Konkreter nächster Auftrag im GR-Entwicklungsstrang

1. **Sofort** den Coverage-Objektvertrag reparieren und getrennt verifizieren; bei unklaren realen Payloadfeldern über private GR→WR-Koordination gezielt klären. Keine WR-Produktivänderung.
2. Danach Ladeweg (`deps.loadLeafletJs`), native Tile-URL-/Projektion-/Zoom-/Coverage-Formen und tatsächliches Kachelladen mit kontrollierten Antworten und Browser-Laufzeit nachweisen.
3. Eindeutigen Karten- und Layer-Lebenszyklus, saubere Abbrüche, Kachel-/Netzbudget, Abdeckungsgrenzen, Statuswahrheit und tatsächliche Attribution/UTC-/Legendenausgabe vervollständigen.
4. Umfassende GR-RF-01 bis GR-RF-04/P7-010-/V1/V2-/DWD-/NASA-/Mobil-/Frontend-Regressionsprüfungen **tatsächlich ausführen** und GitHub-Status verifizieren.
5. Erst anschließend versioniertes **einziges zusammenhängendes DEV-Update** in allen Mirrors/Manifesten/Runtime-Revisions, DRA-fähig, vorlegen; HA-REAL-PASS erst nach echter Installation und korrelierter WR-/GR-Diagnose.
6. Keine zweite Architektur, kein neuer Branch, kein WP-03/WL-04, keine unnötige Zwischenversion. Die laufende **OPERA-S02-A-Quellenarbeit bleibt WR-Aufgabe** und darf nicht mit GR-WL-02 vermischt werden.

**C.K. – Eine Idee weiter gedacht.**
