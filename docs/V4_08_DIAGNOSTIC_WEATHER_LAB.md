# Gewitterradar V4.08 – Diagnose- und Wetter-Labor

## Status

Entwurf und Testgrundlage für V4.08.x. Dieses Dokument erweitert den geschützten V4.07.56-Diagnosevertrag **nicht automatisch**. V4.07.56 bleibt unverändert geschützt. Neue Funktionen werden zunächst in einer Testversion verprobt und erst nach Abnahme in einen neuen verbindlichen Diagnosevertrag übernommen.

## Ziel

Der Diagnosemodus wird von einer Sammlung einzelner Diagnosewerkzeuge zu einem strukturierten, erweiterbaren Wetter-Labor weiterentwickelt. Die produktive Blitz-, Cluster- und Kartenlogik bleibt die einzige fachliche Wahrheit: synthetische Ereignisse dürfen keine eigene Ersatzlogik benutzen.

Das Labor wird so vorbereitet, dass spätere Niederschlagszellen, Wolkenfelder und weitere Wetteranimationen dieselbe Szenario-, Zeit- und Diagnoseinfrastruktur verwenden können. Unfertige Wetterebenen dürfen nicht als scheinbar fertige Produktfunktion erscheinen.

## Bedienkonzept

Die Diagnose-Konsole erhält einklappbare Hauptbereiche. Auf kleinen Displays soll beim Öffnen eines Bereichs optional nur ein Hauptbereich gleichzeitig geöffnet bleiben. Auf Desktop dürfen mehrere Bereiche offen sein. Der Öffnungszustand wird lokal gespeichert.

Dauerhaft sichtbar bleiben Kopfzeile, Masterstatus, Minimieren, Diagnosedarstellung ein/aus und Hard-Stop. Die vorhandene Trennung zwischen „Diagnosedarstellung ausblenden“ und „Diagnosemodus beenden“ bleibt erhalten.

Vorgesehene Hauptbereiche:

1. **Blitze, Cluster & Wetter** – virtuelles Gewitter, Lastprofile, Altersprofile, Radius-Grenzfälle, Cluster-Sprung und spätere Wetterebenen.
2. **Anzeige & Geometrie** – Raster, Overlays, Ausrichtung, Abstände und vorhandene Geometriewerkzeuge.
3. **Medaillon** – vorhandene Medaillon-Zustände und -Diagnose.
4. **Messwerte & Protokoll** – Livewerte, Entscheidungspfad, JSON, Snapshot, Gesamtbericht und Leistungstest.

Kompass- und Medaillon-Kalibrierung bleiben zusätzlich schnell erreichbar.

## Gemeinsames Szenariomodell

Die Diagnose erhält einen gemeinsamen, renderunabhängigen Zustand. Er ist bewusst auf weitere Wetterebenen vorbereitet:

```text
scenario
├─ seed
├─ simulatedTime
├─ timeScale
├─ lightning
│  ├─ cells
│  ├─ density
│  ├─ ageProfile
│  ├─ boundaryCases
│  └─ lifecycle
├─ precipitation   [vorbereitet]
│  ├─ cells
│  ├─ intensityField
│  ├─ lifecycle
│  └─ motion
└─ clouds          [vorbereitet]
   ├─ fields
   ├─ opacity
   ├─ lifecycle
   └─ motion
```

V4.08.02 nutzt davon zunächst den Blitz-/Clusterteil produktiv. Niederschlag und Wolken werden nur strukturell vorbereitet.

## Blitz- und Cluster-Testmatrix

### Zonen

Jeder Test muss einzeln und kombiniert erzeugbar sein:

- Gefahrenradius
- Gewitterradius
- Beobachtungsradius
- außerhalb Beobachtungsradius
- exakt auf Radiusgrenzen
- knapp innerhalb und knapp außerhalb jeder Radiusgrenze

### Last und Dichte

Zusätzlich zu den geschützten 1–5 Zellen werden separate Lastfaktoren vorgesehen. Die bestehende Zellzahl-Semantik bleibt unverändert.

- 1× normal
- 5× hohe Last
- 20× Stresstest
- EXTREM bleibt als eigener fachlicher Test erhalten

Der Stresstest darf Browser und Gerät fordern, muss aber deterministisch und hart beendbar bleiben.

### Alter

- gemischt / produktionsnah
- nur frisch
- nur alt

Spätere Ausbaustufen können frei definierte Zeitverteilungen und eine simulierte Uhr ergänzen.

### Räumliche Sonderfälle

Vorbereitet bzw. schrittweise zu ergänzen:

- kompakter Zellkern
- breite Streuung
- Ring
- Linie / Zugbahn
- Burst
- überlappende Zellen
- Zellen an Radiusgrenzen
- Zelle bewegt sich durch Beobachtung → Gewitter → Gefahr
- Split und Merge
- Einzelblitz zwischen zwei Clustern
- identische bzw. nahezu identische Koordinaten

## Cluster-Auflösung

Die Diagnose soll künftig pro ausgewähltem Cluster bzw. Blitz mindestens anzeigen können:

- Zoomstufe
- Radiuszone
- Alter
- lokale Dichte
- gewählte Cluster-Policy
- Raster-/Zellgröße
- Cluster oder Einzelblitz
- Entscheidungsgrund
- stabile Cluster-ID
- Mitgliederzahl
- Extremstatus

Damit wird die spätere graduelle V4.08-Policy nachvollziehbar statt nur optisch beurteilt.

## Cluster-Sprung als Sitzung

Ein begonnener Cluster-Sprung ist eine eigene Browser-Sitzung.

### Start

Der erste bewusste Cluster-Sprung friert Reihenfolge und Gesamtzahl `N` ein.

### Während der Sitzung

- Renderzyklen ändern weder Index noch `N`.
- neue Blitze ändern weder Index noch `N`.
- Cluster-Split oder -Merge ändern weder Index noch `N`.
- automatische `flyTo`-/`flyToBounds`-Bewegungen ändern weder Index noch `N`.
- eine wiedergefundene stabile Cluster-ID darf nur aktuelle Geometrie/Zähler in den eingefrorenen Eintrag übernehmen.
- ein temporär nicht mehr vorhandener Cluster bleibt bis zum Sitzungsende über den Snapshot navigierbar.

### Sitzungsende

Vorgesehener Standard für die Verprobung: **10 Sekunden Inaktivität nach dem letzten Cluster-Sprung**. Jeder weitere Sprung startet die Frist neu.

Der Diagnosemodus darf zum Testen 5 s / 10 s / 20 s / unbegrenzt anbieten. Der endgültige Produktwert wird erst nach Geräteverprobung festgeschrieben.

Sofortige bewusste Resets bleiben für echte Strukturwechsel erhalten, insbesondere:

- Bezugsstandort geändert
- Radien geändert
- Gruppiert ↔ Einzelblitze
- Cluster-Policy/Profil geändert
- bewusstes Neu-Zentrieren bzw. neuer Such-/Ortsfokus

Manuelles Zoomen oder Verschieben der Karte soll eine aktive Sitzung **nicht sofort** beenden. So kann ein Cluster während der laufenden Sequenz untersucht werden. Läuft die Inaktivitätsfrist ab, endet nur die Browser-Sitzung; die Karte wird dabei nicht bewegt. Der nächste Cluster-Sprung erstellt eine neue aktuelle Live-Liste und beginnt mit `1/N`.

Der Diagnosemodus zeigt dafür mindestens:

- Sitzung aktiv/inaktiv
- aktueller Index `x/N`
- eingefrorenes `N`
- Restzeit
- ausgewählte stabile ID
- Schaltfläche „Sitzung beenden“
- Render-Stresstest während aktiver Sitzung

## Render- und Zustands-Stresstest

Mindestens folgende deterministische Abläufe müssen automatisierbar bzw. reproduzierbar testbar sein:

- 20 Renderläufe zwischen zwei Cluster-Sprüngen
- neue Blitze vor und nach der aktuellen Sortierposition
- Gefahrblitz während aktiver Sitzung
- Split während aktiver Sitzung
- Merge während aktiver Sitzung
- Zoomanimation zwischen jedem Sprung
- Wechsel der sichtbaren Clustergeometrie bei gleichbleibender Browsersequenz
- Ablauf der Inaktivitätsfrist
- manueller Sitzungsabbruch
- Wrap von `N/N` auf `1/N`

## Vorbereitung Niederschlagszellen

Niederschlagszellen sollen später nicht als starre Kreise oder Sprites modelliert werden. Das Zielbild sind organische, weich verlaufende Radarflächen mit klaren Intensitätskernen und natürlichen Übergängen.

Vorgesehenes fachliches Modell:

1. Eine Zelle besteht aus mehreren glatten Kernen statt einem Kreis.
2. Aus den Kernen wird ein kontinuierliches Intensitätsfeld berechnet.
3. Deterministisches, räumlich geglättetes Rauschen verformt die Außenkontur reproduzierbar.
4. Intensitätsschwellen erzeugen mehrere Radarstufen bzw. Konturen.
5. Der äußere Rand erhält einen weichen Alpha-Abfall.
6. Zellbewegung verschiebt das Feld, ohne es bei jedem Bild neu zufällig zu erzeugen.
7. Wachstum, Reife und Zerfall verändern Kerne und Intensität langsam.
8. Split und Merge werden über Zelllebenszyklen modelliert.

Das fachliche Zellmodell bleibt unabhängig von Leaflet oder MapLibre. Die Darstellung kann später beispielsweise über Canvas bzw. eine MapLibre-kompatible GPU-/Rasterebene erfolgen.

## Vorbereitung Wolken

Wolkenfelder verwenden dieselbe Szenario- und Zeitbasis. Vorgesehen sind:

- mehrere überlagerte Felder
- weiche Dichte-/Deckungsgrade
- deterministische Formveränderung
- Zugrichtung und Geschwindigkeit
- Wachstum/Zerfall
- Deckkraft und Schichtpriorität
- gemeinsamer Zeitlauf mit Niederschlag und Blitzaktivität

Auch hier bleibt das Simulationsmodell renderunabhängig.

## Sicherheit und Aufräumen

Der Master-Stop bleibt ein Hard-Stop. Er muss künftig zusätzlich sämtliche Wetter-Labor-Timer, geplante Frames, synthetische Wetterfelder, Blitzereignisse, Browser-Sitzungstimer und Diagnose-Listener beenden bzw. entfernen.

Synthetische Daten dürfen niemals:

- Home-Assistant-Fake-Entitäten erzeugen,
- Blitzortung verändern,
- im Recorder persistiert werden,
- nach Ende des Diagnosemodus sichtbar oder aktiv bleiben.

## V4.08.02 – erster umsetzbarer Schnitt

V4.08.02 soll folgende neue Testfunktionen enthalten:

- einklappbare Diagnose-Hauptbereiche mit mobiler Ein-Bereich-Logik;
- Wetter-Labor-Zustand als gemeinsame Erweiterungsbasis;
- Blitzlast 1× / 5× / 20×;
- Altersprofile gemischt / frisch / alt;
- Radius-Grenzfälle ein/aus;
- Cluster-Sprung-Sitzung mit einstellbarer Inaktivitätsfrist;
- sichtbarer Sitzungsstatus `x/N`, Restzeit und stabile ID;
- manueller Sitzungsabbruch;
- 20×-Render-Stresstest ohne Änderung von Index/N;
- V4.07.56-Diagnosefunktionen bleiben vollständig erhalten.

## Noch nicht Teil von V4.08.02

- echte produktive Regenradardaten
- echte Wolkendaten
- produktive Niederschlags- oder Wolkenanimation
- endgültige optische Radarfarbskala
- endgültiger Produktionswert der Cluster-Sprung-Inaktivitätsfrist
- endgültiger neuer Diagnosevertrag

Diese Punkte werden erst nach der V4.08.02-Verprobung und separater fachlicher Entscheidung festgeschrieben.
