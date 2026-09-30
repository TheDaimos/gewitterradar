# Gewitterradar V4.10 · 2026/09

Status: **FINAL**  
Öffentliche Produktversion: **V4.10**  
Akzeptierter technischer Ausgangsbuild: **V4.10.02 R40**  
Native Integration: **0.22.0**  
Build: **V4.10-RELEASE-2026-09-30**

## Vom Monolithen zum modularen Gewitterradar

Gewitterradar besitzt nun eine klar strukturierte Architektur aus **23 eigenständigen Modulen** mit überprüfbaren Modulidentitäten. Native Home-Assistant-Integration und Dashboard-Auslieferung stammen deterministisch aus derselben kanonischen Quelle. Die Diagnose zeigt den tatsächlich geladenen Modulstand und kann Abweichungen nachvollziehbar melden.

## Kompass, Medaillon und Bedienung

- Kompass und Medaillon besitzen eigenständige Auswahl und Bedienung.
- **28 Medaillon-Designs und 18 Pfeilvarianten**.
- Unabhängige und dauerhafte Medaillon-/Pfeilauswahl.
- Kompassdesign bleibt erhalten, wenn Aura-Effekte aus- und wieder eingeschaltet werden.
- Verschiebbare und skalierbare Vollbild-Instrumente; Größenwahl für Vollbild und eigenes Kartenfenster.
- Einheitliche abgenommene Kompass-Reihenfolge auf Desktop, Android und iPad.

## Hilfe, Mehrsprachigkeit und Versionsverlauf

- Hilfeabschnitt „Kompass, Medaillon & Pfeile“ mit vier Einträgen.
- Aktualisierte Mouse-over-, Zoom- und Fenstertexte für **19 Sprach- und Dialektvarianten**.
- Sieben ausdrücklich als geplant gekennzeichnete V4.11-Entwicklungen in deutscher und englischer Release History.
- Die historischen V4.10-Mengenangaben bleiben Teil des abgeschlossenen Release-Rückblicks.

## Freigabe und Schutz

Alle sechs vereinbarten Realtestpunkte sowie die abschließende R40-Release-History-Sichtprüfung wurden ausdrücklich abgenommen. Die öffentliche Normalisierung darf keine zuvor akzeptierte R40-Produktfunktion ändern. Die geschützte About-Baseline, Diagnosefunktionen, Hi-Res-Master und PRE-MERGE-/Golden-Master-Verträge bleiben verbindlich.

## Veröffentlichungsidentität

Der endgültige main-Commit sowie die erzeugten Prüfsummen sind über das Post-Merge-Prüfergebnis und Golden-Master-Manifest zu belegen. Der abgenommene technische Ausgangspunkt lautet `bcf30fe2dc1b6b56625edf209b2373b956fb7fd4`.
