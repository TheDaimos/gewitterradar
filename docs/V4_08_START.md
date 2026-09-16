# Gewitterradar V4.08 – Arbeitsstart

Stand: **16.09.2026**  
Status: **AKTIVE ENTWICKLUNG / PHASE 1 – INVENTAR**

## Unveränderliche Ausgangsbasis

Der veröffentlichte und abgenommene Stand **V4.07.56** bleibt unangetasteter Release-/Golden-Master-Stand.

Verbindlicher Baseline-Commit:

```text
6418fd57790efdbb267cc2994f00bb995f40acfd
```

Dieser Commit ist zugleich der Stand von `frozen/v4.07.56` und die Produktbasis für V4.08. V4.08-Arbeit darf den veröffentlichten Tag, den Freeze-Anker oder den Golden-Master-Stand nicht rückwirkend verändern.

## Übernommene V4.08-Planung

Der bereits vorhandene Planungszweig bleibt als historische Planungsreferenz erhalten:

```text
planning/v4.08-cluster-zoom-and-cleanup
047e195d8f9a9b82dc8cfc210097e055b5835085
```

Da dieser Planungszweig vor der finalen V4.07.56-Promotion abgezweigt wurde und deshalb nicht die vollständige Releasebasis enthält, wird er **nicht** als direkte Codebasis weiterentwickelt.

Sein fachlicher V4.08-Plan wurde unverändert in die neue Arbeitslinie übernommen:

```text
docs/V4_08_PLAN.md
```

Damit bleibt der bestehende Plan der fachliche Ausgangspunkt, während die technische Ausgangsbasis exakt V4.07.56 bleibt.

## Aktiver V4.08-Arbeitszweig

```text
feature/v4.08-cluster-zoom-and-cleanup
```

Der Zweig wurde direkt vom V4.07.56-Baseline-Commit `6418fd57790efdbb267cc2994f00bb995f40acfd` erzeugt. Der erste V4.08-Commit fügte ausschließlich den bestehenden Plan hinzu; Produktcode, Assets und V4.07.56-Verhalten blieben unverändert.

## Aktuelle Arbeitsphase

V4.08 beginnt gemäß `docs/V4_08_PLAN.md` mit **Phase 1 – Inventar und reine Extraktion**.

Vor jeder sichtbaren Verhaltensänderung werden zunächst vollständig erfasst:

- aktuelle Cluster-/Einzelblitz-Entscheidungspfade;
- Zoomschwellen und Magic Numbers;
- Distanz- und Radiuszonenlogik;
- Fokus-/Selektionszustände und deren Reset-Verhalten;
- Clusteridentität/Deduplizierung;
- Engine-/Leaflet-spezifische Fachlogik;
- bestehende Diagnose-/Simulationspfade, die wiederverwendet werden können;
- relevante Regressionstests und geschützte V4.07.56-Verträge.

Erst nach diesem Inventar darf die Logik strukturell extrahiert werden. Die erste Extraktionsstufe muss das bestehende V4.07.56-Verhalten nachweislich erhalten.

## Schutzregeln für V4.08

- V4.07.56 bleibt unverändert und jederzeit reproduzierbar.
- Kein Rewrite der Kartenlogik ohne konkreten, abgegrenzten Grund.
- Keine Änderung der akzeptierten normalen V4.07.54-UI-/Funktionsbaseline außerhalb des ausdrücklich geplanten V4.08-Arbeitsbereichs.
- Der geschützte V4.07.56-Diagnosemodus bleibt vollständig erhalten.
- Hi-Res-/Legacy-Master bleiben gemäß Retentionsvertrag erhalten.
- Integration und Dashboard bleiben zwei Auslieferungsformen desselben Produkts und müssen aus derselben kanonischen Quelle entstehen.
- Fachliche Clusterentscheidungen sollen langfristig von der Karten-Engine entkoppelt werden; Engine-Wechsel ist jedoch kein Pflichtbestandteil der ersten V4.08-Iteration.

## Nächster sicherer Schritt

Das bestehende V4.07.56-Frontend wird ausschließlich analysiert. Es werden alle Cluster-, Zoom-, Fokus- und Radiusentscheidungen mit Quellstellen und Abhängigkeiten dokumentiert. Noch keine Verhaltensänderung.
