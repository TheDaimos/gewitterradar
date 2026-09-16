# Gewitterradar V4.08 – Analyse der Cluster-Auflösung

Stand: **16.09.2026**  
Status: **PHASE 1 – IST-ANALYSE, KEINE PRODUKTLOGIK GEÄNDERT**  
Arbeitszweig: `feature/v4.08-cluster-zoom-and-cleanup`

## 1. Referenz und Schutzrahmen

Die Analyse basiert auf dem unveränderten V4.07.56-Produktstand. Golden-Master-/Freeze-Anker:

```text
6418fd57790efdbb267cc2994f00bb995f40acfd
```

Die kanonische Frontenddatei ist `frontend/gewitterradar.js`. Integration und Dashboard verwenden denselben erzeugten Frontend-Inhalt. Diese Analyse verändert weder V4.07.56 noch die Produktlogik auf dem V4.08-Arbeitszweig.

## 2. Zentrale Erkenntnis

Die aktuelle Cluster-Auflösung ist kein Leaflet-MarkerCluster-Standardverhalten. Gewitterradar bildet die Cluster in `_renderMapMarkers()` selbst über Weltpixel-Zellen.

Die sichtbare Auflösung wird in zwei Stufen entschieden:

1. Ein Blitz wird entweder sofort zum Einzelblitz oder zum Clusterkandidaten.
2. Nur Clusterkandidaten gelangen anschließend in das Weltpixel-Raster und können sich beim Zoomen graduell in kleinere Cluster aufteilen.

Der beobachtete harte Übergang entsteht bereits in Stufe 1. Dadurch kommt die vorhandene graduelle Rasterlogik innerhalb des Beobachtungsradius ab Zoom 8 nicht mehr zum Einsatz.

## 3. Aktuelle Hauptentscheidung im Modus „Gruppiert“

Sinngemäß gilt derzeit:

```text
inDanger      = distance <= dangerRadius
inObservation = distance <= observationRadius

Einzelblitz, wenn:
  inDanger
  ODER (inObservation UND zoom >= 8)
  ODER (außerhalb Observation UND zoom >= 12)

sonst:
  Clusterkandidat
```

### Konsequenz nach Zoomstufe

| Zoom | Gefahrenradius | Rest innerhalb Beobachtungsradius | Außerhalb Beobachtungsradius |
|---|---|---|---|
| <= 7 | Einzelblitz | Clusterkandidat | Clusterkandidat |
| 8–9 | Einzelblitz | **Einzelblitz** | Clusterkandidat |
| 10–11 | Einzelblitz | **Einzelblitz** | Clusterkandidat; Einzelzellen werden zu Einzelblitzen |
| >= 12 | Einzelblitz | Einzelblitz | Einzelblitz |

Damit existiert innerhalb des Beobachtungsradius eine harte Kante zwischen Zoom 7 und Zoom 8.

## 4. Der Gewitterradius fehlt in der Auflösungsentscheidung

`_renderMapMarkers()` verwendet für die Clusterentscheidung aktuell Beobachtungsradius, Gefahrenradius, Zoom und Kartenmodus. Der Gewitterradius wird dort nicht berücksichtigt.

Für das Referenzbeispiel **70 / 30 / 5 km** bedeutet das:

- 0–5 km: Gefahr → immer Einzelblitze;
- 5–30 km: Gewitterzone → technisch nur „innerhalb Beobachtung“;
- 30–70 km: Beobachtungszone → ebenfalls „innerhalb Beobachtung“;
- ab Zoom 8 werden deshalb 5–30 km und 30–70 km gemeinsam vollständig zu Einzelblitzen.

Die fachlich unterschiedlichen Zonen Gewitter und Beobachtung sind für die Clusterauflösung derzeit nicht unterscheidbar.

## 5. Vorhandene graduelle Rasterlogik

Clusterkandidaten werden mit `map.project(..., zoom)` in Weltpixel projiziert. Aus X/Y und einer zoomabhängigen Zellgröße entsteht ein stabiles Raster.

Aktuelle Zellgrößen außerhalb des Beobachtungsradius:

```text
Zoom <= 5 : 135 px
Zoom 6    : 115 px
Zoom 7    :  96 px
Zoom 8    :  78 px
Zoom 9    :  62 px
Zoom 10   :  48 px
Zoom >=11 :  36 px
```

Innerhalb des Beobachtungsradius wird die Zellgröße auf `max(26 px, 68 %)` reduziert.

Diese Logik ist grundsätzlich geeignet, einen graduellen Übergang `großer Cluster -> kleinere Cluster -> Einzelblitze` zu erzeugen. Sie wird jedoch für Blitze innerhalb des Beobachtungsradius ab Zoom 8 durch die vorgelagerte Einzelblitzentscheidung umgangen.

## 6. Zweite Inkonsistenz: Cluster-Fokus gegen Cluster-Auflösung

`_focusCluster()` behandelt Cluster ausdrücklich als Übersichtsebene und begrenzt den Cluster-Fokus auf maximal Zoom 9.

Gleichzeitig existieren innerhalb des Beobachtungsradius nach der aktuellen Hauptentscheidung bereits ab Zoom 8 keine Clusterkandidaten mehr.

Damit kann ein Cluster aus einer Übersicht heraus auf Zoom 8 oder 9 fokussiert werden, obwohl genau dort seine eigenen Mitglieder bereits als Einzelblitze gerendert werden. Das erzeugt einen semantischen Widerspruch zwischen Browser/Fokus und Renderer.

V4.08 muss Fokus-Zielzoom und Auflösungsrichtlinie aus derselben Policy ableiten.

## 7. Cluster-Identitäten und Renderzyklen

Gewitterradar stabilisiert Clusteridentitäten bereits explizit. Frühere Cluster-Snapshots bleiben bis zu 15 Sekunden erhalten. Beim Matching werden unter anderem verwendet:

- gemeinsame Mitglieds-IDs;
- Jaccard-Überlappung;
- Größenverhältnis;
- Pixelabstand der Clusterzentren;
- die zoomabhängige Rastergröße;
- ein kleiner Bonus für den aktuell ausgewählten Cluster.

Das ist ein wichtiger Regressionsschutz und darf bei V4.08 nicht leichtfertig entfernt werden.

## 8. Cluster-Jump / Header-Browser – kritischer Zustandsautomat

Die Cluster-Jump-Funktion besitzt bereits Schutz gegen schnelle Neuclusterung:

1. Beim ersten Cluster-Klick wird die aktuell sichtbare Clusterreihenfolge als `_statusClusterBrowseSnapshot` eingefroren.
2. `_statusClusterBrowseActive` hält diesen Durchlauf aktiv.
3. Nachfolgende Renderzyklen dürfen die laufende Reihenfolge und Gesamtzahl nicht ersetzen.
4. Live-Cluster mit derselben stabilen ID dürfen lediglich Geometrie/Zähler des Snapshots aktualisieren.
5. Der nächste Klick inkrementiert `_statusFocusIndex`; erst nach dem letzten Element springt er wieder auf 0.

Für den gruppierten Modus enthält `_statusFocusSignature` bewusst **nicht** die aktuelle Clusterliste und **nicht** den Wetterstatus. Neue Blitze allein sollen den Browser daher nicht auf Cluster 1 zurücksetzen.

Aktuelle strukturelle Signaturbestandteile sind:

```text
Bezugsstandort-Option
Latitude
Longitude
Beobachtungsradius
Gewitterradius
Gefahrenradius
'grouped'
```

Auffällig: Der Kommentar nennt zusätzlich Zoom als Resetgrund, die tatsächliche Signatur enthält Zoom derzeit jedoch nicht. Kommentar und Implementierung sind hier nicht deckungsgleich und müssen in V4.08 bewusst entschieden und bereinigt werden.

### Warum dieses Thema für V4.08 zwingend geschützt werden muss

Die neue V4.08-Auflösungslogik wird Cluster häufiger graduell teilen, zusammenführen oder neu zuordnen. Ohne klare Trennung zwischen

```text
Live-Renderliste
```

und

```text
laufender Browser-Sequenz
```

kann genau das vom realen Betrieb bekannte Fehlerbild wieder auftreten:

```text
1/N -> Render/Neuclustering -> Index verloren -> wieder 1/N
```

Die Browser-Sequenz darf daher während eines begonnenen Durchlaufs niemals direkt von jedem Renderzyklus abhängen.

## 9. Harte V4.08-Regressionsregeln für Cluster-Jump

Folgende Regeln sind ab jetzt Teil des V4.08-Schutzrahmens:

1. **Erster Klick friert die Sequenz ein.**
2. **Neue Blitze dürfen einen begonnenen Durchlauf nicht auf 1 zurücksetzen.**
3. **Reclustering während `flyTo`/`flyToBounds` darf den Index nicht verändern.**
4. **Zoomänderungen müssen eine explizit definierte Semantik besitzen; kein zufälliger Reset durch Renderreihenfolge.**
5. **Cluster-Split/Merge darf den laufenden Durchlauf nicht zerstören.** Wenn eine alte stabile ID weiter zuordenbar ist, werden nur Live-Geometrie und Zähler aktualisiert.
6. **Wenn eine alte ID vorübergehend nicht live existiert, bleibt der Snapshot navigierbar.**
7. **Nur echte strukturelle Benutzeränderungen dürfen einen bewussten Neustart auslösen**, z. B. Standortwechsel, Radiusänderung oder Kartenmoduswechsel; Zoom muss separat fachlich entschieden werden.
8. **Renderfrequenz darf fachliches Browserverhalten nicht bestimmen.** Ob 1 oder 20 Renderzyklen zwischen zwei Klicks stattfinden, muss für die Reihenfolge irrelevant sein.
9. **Der Zähler `x/N` bleibt während eines begonnenen Durchlaufs stabil.** `N` wird nicht durch Live-Neuclustering verändert.
10. **Nach N beginnt erst der nächste bewusste Benutzerklick wieder bei 1.**

## 10. Bereits vorhandene Beruhigung der Renderzyklen

Normale neue Clusterereignisse werden bereits kurz gesammelt: Cluster-Updates besitzen einen Debounce von 160 ms. Gefahrentreffer umgehen diese Zusatzlatenz bewusst und werden sofort dargestellt.

Dieser Debounce ist nur eine Darstellungsberuhigung. Er darf nicht als Korrektheitsmechanismus für den Cluster-Browser dienen. Die Jump-Funktion muss auch bei sehr hoher Ereignisrate logisch stabil bleiben.

## 11. Kleinster sicherer V4.08-Eingriffspunkt

Die erste Implementierungsstufe sollte nicht die komplette Karte neu schreiben. Der sichere Weg ist:

1. Radiuszone zentral bestimmen: `danger / storm / observation / outside`.
2. Die heutige Entscheidung `individual vs clusterCandidate` in eine reine Policy-Funktion extrahieren.
3. Die heutige `_clusterPixelSize()` ebenfalls über diese Policy parametrisieren.
4. V4.07-Verhalten zunächst per Regressionstest exakt nachbilden.
5. Erst danach die neue V4.08-Policy aktivieren.
6. Cluster-Browser-Snapshot und stabile Cluster-IDs als eigenständigen, regressionsgeschützten Zustandsautomaten erhalten.
7. Fokus-Zielzoom aus derselben Policy ableiten, damit ein fokussierter Cluster am Zielzoom tatsächlich noch Cluster sein kann.

## 12. Pflicht-Testmatrix vor jeder sichtbaren Änderung

Mindestens automatisiert oder deterministisch reproduzierbar:

- 70/30/5 km bei Zoom 5–13;
- Blitze in allen vier Zonen;
- ein Cluster, mehrere Cluster, viele Cluster;
- hohe Live-Ereignisrate während Cluster-Jump;
- 1/N -> 2/N -> ... trotz wiederholter Renderzyklen;
- Render zwischen jedem einzelnen Browser-Klick;
- Zoomanimation zwischen jedem Browser-Klick;
- Split eines Clusters während aktivem Browser;
- Merge zweier Cluster während aktivem Browser;
- neue Cluster vor/nach der aktuellen Sortierposition;
- Gefahrentreffer während aktivem Browser;
- Standort-/Radius-/Moduswechsel als bewusste Resetfälle;
- Einzelblitz-Fokus -> herauszoomen -> normale Clusterbildung;
- Cluster-Fokus -> Zielzoom, an dem Cluster laut Policy weiterhin existiert.

## 13. Phase-1-Fazit

Die Ursache des 70/30/5-Problems ist jetzt konkret lokalisiert:

> Nicht die Rasterbildung löst die Cluster zu früh auf, sondern die vorgelagerte Regel `inObservation && zoom >= 8`.

Zusätzlich ist der Gewitterradius in der aktuellen Clusterauflösung vollständig unsichtbar, und der Cluster-Fokus kann auf einen Zoom zielen, an dem dieselbe Clusterlogik den Cluster bereits aufgelöst hat.

Der Cluster-Jump besitzt bereits sinnvolle Schutzmechanismen gegen Live-Neuclustering. V4.08 muss diese Mechanismen ausdrücklich erhalten, testen und von der neuen Renderpolicy entkoppeln, damit schnelle Renderzyklen niemals wieder einen begonnenen Cluster-Durchlauf auf 1 zurücksetzen.
