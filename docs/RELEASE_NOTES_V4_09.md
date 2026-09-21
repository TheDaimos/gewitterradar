# Gewitterradar V4.09 · 2026/09

Status: **FINAL**  
Öffentliche Produktversion: **V4.09**  
Akzeptierter interner Ausgangsbuild: **V4.09.28**  
Native Integration: **0.21.0**

## Neu in V4.09

### Kartenansichten

Gewitterradar kann die Karte jetzt direkt zwischen drei Darstellungen umschalten:

- **Standard** – normale Kartenhöhe innerhalb der Gewitterradar-Karte.
- **Groß** – mehr Kartenfläche innerhalb des Dashboards, ohne Vollbild.
- **Vollbild** – vollständige Kartenansicht mit den verfügbaren Vollbild-Instrumenten und Bedienelementen.

Die bevorzugte **Standardansicht** wird lokal auf dem jeweiligen Gerät bzw. Browserprofil gespeichert. Smartphone, Tablet und Desktop können dadurch unterschiedliche Startansichten verwenden.

Der kompakte 3D-Kartenansichtsschalter verwendet die freigegebene Gold-/Blau-/Rot-Darstellung und öffnet ein responsives Auswahlmenü. Titel und Ansichtsoptionen sind in allen 19 Produktsprachen übersetzt.

In den Einstellungen stehen **Cluster-Auflösung** und **Cluster-Navigation** jetzt am Anfang von **Kartendarstellung**. Der Abschnitt **Radien** enthält nur noch die Radiussteuerung und besitzt einen eigenen viewportbasiert begrenzten Touch-Scrollbereich mit zusätzlichem unteren Scrollraum. Dadurch bleibt auch der Gefahrenradius auf kurzen Browser- und WebView-Flächen vollständig erreichbar.

### Eigenes Kartenfenster

Über die Einstellungen kann die Gewitteransicht mit der aktuell gewählten Karte und dem aktuell gewählten Kompass in einem separaten Fenster geöffnet werden. Die normale Dashboard-Ansicht bleibt davon getrennt.

Die zugehörige Schaltfläche und die Standardansicht-Auswahl wurden an den Gewitterradar-Premiumstil angepasst.

### Standortsuche und Koordinateneingabe

- Die Eingabefelder für **Bezeichnung**, **Breitengrad** und **Längengrad** besitzen jetzt einheitliche `×`-Schaltflächen zum direkten Leeren.
- Die vorhandene Ortssuche und die Übernahme von Koordinaten bleiben unverändert; die neuen Löschschaltflächen ergänzen ausschließlich die Bedienung der Eingabefelder.

### Vollbild-Instrumente

- Kompass und Medaillon können im Vollbild unabhängig ein- und ausgeblendet werden.
- Beide Instrumente sind per Maus und Touch frei verschiebbar.
- Die akzeptierten Instrumentgrößen bleiben erhalten.
- Die Standort-Pille ist ebenfalls frei beweglich und speichert ihre Position lokal.
- Das Standortmenü passt Öffnungsrichtung, Spaltenzahl und Scrollverhalten an die verfügbare Bildschirmfläche an.
- Layer-Schalter, Radiusdialoge und weltweite Ortssuche bleiben im Vollbild in der vorgesehenen Vordergrundreihenfolge bedienbar.
- Warnanimationen bleiben auch im nativen Vollbild sichtbar: Gewitter = weißer Blitz, Gefahr = weißer Blitz plus roter Schleier.

### Hilfe & Hinweise und Mehrsprachigkeit

**Hilfe & Hinweise** wurde um die Kartendarstellung, Standardansicht, Vollbildbedienung, den 3D-Kartenansichtsschalter und das separate Kartenfenster erweitert.

Der komplette Hilfebereich ist auf **15 Sprachen plus 4 deutsche Dialektvarianten = 19 Varianten** synchronisiert. Deutsch und Englisch bleiben im Haupt-JavaScript eingebettet; die übrigen 17 Varianten werden weiterhin aus `locales/about-locales.js` geladen.

### Versionsverlauf

Die öffentliche Release History enthält ausschließlich veröffentlichte Versionen. Interne V4.09.xx-DEV-/TEST-Stände werden nicht als eigene Releases dargestellt.

Die dauerhafte Sektion **„Zukünftige Entwicklungen · Geplant“ / “Future Developments · Planned”** bleibt oberhalb der veröffentlichten Historie erhalten.

## Nächste geplante Entwicklung

- Unterschiedliche Medaillions bereitstellen.
- Verbesserungen der Kompass- und Medaillion-Auswahl.
- Implementierung von Wetterdiensten via WeatherRouter.

## Release-Identität

- Frontend: **2.238.838 Bytes**
- Frontend SHA256: `e349c01f55d22ea69d9c066df00b53c7910ec57e8234a8a423f8d680e6e30e7d`
- Externes Locale-Modul: **741.069 Bytes**
- Locale SHA256: `dc6506291dd4cfe75e3b9c829fb42f21062511fb574d335af438e6c42711802e`
- Runtime-Kompassschalter SHA256: `bd6ce5bbd20a9db8af174f14ff284461c41e0ee620443f5e42b9c298e9072a0a`
- Build: `V4.09-RELEASE-2026-09-21`
- Native Integration: **0.21.0**

## Provenienz und Schutz

V4.09 FINAL basiert funktional auf dem ausdrücklich akzeptierten internen Stand **V4.09.28**. Die öffentliche Normalisierung verändert gegenüber diesem Stand ausschließlich die öffentlichen Versions-/Build-Metadaten.

Die bestehenden Schutzverträge bleiben erhalten, insbesondere:

- V4.07.56-Diagnosevertrag;
- Hi-Res-/Legacy-Retentionsvertrag;
- deterministische Parität zwischen nativer Integration und Dashboard-Auslieferung;
- PRE-MERGE-/Golden-Master-Vertrag;
- HACS-/Hassfest-/Home-Assistant-Prüfungen.

Der PRE-MERGE-Snapshot wurde vor der Promotion aus dem bisherigen `main`-Commit `56b87a3b2db7b4e546f5eabbd067d2547a8f999c` erzeugt.
