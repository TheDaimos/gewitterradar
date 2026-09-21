# Gewitterradar V4.09.27 TEST – Radien-Scrollkorrektur

Status: **TEST · Geräteabnahme offen**  
Basis: `release/v4.09` @ `3d1b7f08494ea1dbb0fea804cdce9e9f5e17eb2a`  
Arbeitszweig: `feature/v4.09.27-radii-scroll-fix`

## Anlass

Die reale Prüfung nach V4.09.26 zeigt: Im Einstellungsmenü kann der geöffnete Abschnitt **Radien** weiterhin vor seinem Ende stoppen. Der Gefahrenradius ist dadurch je nach Browser-/WebView-Viewport nicht vollständig erreichbar.

Damit ist V4.09.26 für die finale Promotion nicht mehr als abgenommen zu behandeln.

## Änderung in V4.09.27

- **Radien** besitzt wieder einen eigenen vertikalen Scroll-Viewport.
- Die Maximalhöhe wird aus dem tatsächlichen Viewport abgeleitet statt aus einer starren Resthöhenannahme.
- Touch-/Momentum-Scrolling ist explizit aktiv.
- Zusätzlicher unterer Innen- und Scrollraum sorgt dafür, dass der letzte Radius vollständig über die untere Kante gezogen werden kann.
- Für niedrige Touch-Querformate existiert eine eigene Höhenbegrenzung.
- **Cluster-Auflösung** und **Cluster-Navigation · Sitzungszeit** bleiben als erste beiden Punkte in **Kartendarstellung**.
- Clusterlogik, Radiuswerte und Home-Assistant-Helper werden nicht verändert.

## Geräteabnahme

Vor Promotion nach V4.09 FINAL prüfen:

1. Desktop: Einstellungen → Radien öffnen; Gefahrenradius vollständig sichtbar/erreichbar.
2. Android Hoch-/Querformat: vertikal innerhalb Radien bis unter den Gefahrenradius scrollen.
3. iPad/iPad Pro Hoch-/Querformat: identischer Endanschlag; kein Abbruch vor dem letzten Eintrag.
4. Horizontaler Radius-Slider-Drag bleibt funktionsfähig; vertikale Geste außerhalb des Sliders scrollt den Abschnitt.
5. Kartendarstellung: Reihenfolge bleibt Cluster-Auflösung → Cluster-Navigation → Standardansicht → eigenes Kartenfenster.
6. Keine Änderung an Cluster-Profilen, Cluster-Sitzungszeit oder Radius-Helfern.

Erst nach realer Abnahme darf V4.09.27 als neuer interner Ausgangsstand für die öffentliche V4.09-Normalisierung verwendet werden.

## Kandidaten-Identität

- Frontend: **2.236.084 Bytes**
- SHA256: `8e8adf8851344ba031a79c0444f1cd47dd99b55a0e115e353900129685693bed`
- Gemeinsamer Git-Blob für alle drei Frontend-Kopien: `69b2d9300f4d5e2f5baf6ebe332b00fd3fc0265b`
- Parserprüfung des vollständigen Frontend-Quelltexts: **PASS** (ES-Modul-spezifisches `import.meta` bei der isolierten Parserprobe neutralisiert; übriger Quelltext vollständig kompiliert)
- Strukturprüfung: **PASS** – Cluster-Auflösung und Cluster-Navigation stehen vor Standardansicht und separatem Kartenfenster; beide Cluster-Steuerelemente fehlen im Radien-Abschnitt.
- Schutzgates auf Commit `fd475e0d9cdd061576fd9ab47affb09a53772212`: **Hi-Res PASS**, **Diagnosevertrag PASS**, **Home-Assistant-Integration PASS**. Der allgemeine Shared-Frontend-Workflow ist für diesen DEV-Zweig nicht aussagekräftig, weil sein öffentlicher Kanon vor der Syntaxstufe greift.
