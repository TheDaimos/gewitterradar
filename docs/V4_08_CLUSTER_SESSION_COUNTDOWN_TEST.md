# Gewitterradar V4.08.04 – Cluster-Sprung-Sitzung

## Status

Testgrundlage für V4.08.04. V4.07.56 bleibt unverändert geschützt. V4.08.04 baut auf V4.08.03 auf und verändert die Cluster-Auflösungsgrenzen nicht.

## Ziel

Die eingefrorene Cluster-Sprung-Sitzung soll für den Nutzer unmittelbar sichtbar und zeitlich steuerbar sein, ohne die Karte mit zusätzlichem Erklärungstext zu überladen.

## Produktanzeige

Nach dem ersten Klick auf die Cluster-Pille wird die aktuelle Cluster-Reihenfolge wie bisher eingefroren. Während die Sitzung aktiv ist, zeigt die Cluster-Pille kompakt:

```text
Cluster 1/N   10s
```

Bei jedem weiteren Cluster-Sprung wird die eingestellte Inaktivitätszeit neu gestartet und der Countdown zählt sekundenweise herunter. Bei unbegrenzter Sitzung wird zunächst nur das normale Unicode-Unendlichkeitszeichen verwendet:

```text
Cluster 1/N   ∞
```

Ein eigenes Hi-Res-/Premium-Symbol für die liegende Acht ist ausdrücklich noch nicht Bestandteil von V4.08.04.

## Einstellung

Unter den Cluster-/Radien-Einstellungen kann die Sitzungszeit frei eingestellt werden:

- Minimum: 5 Sekunden
- Maximum: 3600 Sekunden
- Schrittweite: 1 Sekunde
- zusätzlich: unbegrenzt (`∞`)

Der zuletzt verwendete endliche Wert bleibt erhalten. Wird `∞` wieder ausgeschaltet, wird dieser Wert erneut verwendet.

Die Testversion speichert die Einstellung lokal im Browser. Eine spätere Produktentscheidung über browserlokale oder Home-Assistant-weite Persistenz bleibt davon unberührt.

## Sitzungslogik

- Erster Cluster-Sprung friert Reihenfolge und N ein.
- Jeder weitere Sprung setzt den Countdown auf den konfigurierten Wert zurück.
- Normale Renderzyklen, neue Blitze sowie die bekannten Split-/Merge-Stresstests verändern Index und eingefrorenes N nicht.
- Läuft die Zeit ab, endet nur die Browser-Sitzung. Beim nächsten Cluster-Sprung wird eine neue Live-Liste bei 1/N erzeugt.
- Bei `∞` wird kein Ablauf-Timer gestartet.
- Bewusste strukturelle Änderungen dürfen die Sitzung weiterhin zurücksetzen.

## Technische Vorgabe

Der sichtbare Countdown darf keinen kompletten Karten-Render erzwingen. Aktualisiert wird nur die kleine Statusanzeige der Cluster-Pille; die Kartenlogik bleibt davon getrennt.
