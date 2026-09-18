# Gewitterradar V4.08 TEST – Release Notes

Stand: 17.09.2026  
Status: TEST auf `feature/v4.08-cluster-zoom-and-cleanup`

## Cluster-Auflösung

Der bisherige V4.08-Ein/Aus-Testschalter wird durch eine echte Profilauswahl ersetzt.

**Cluster-Auflösung**  
*Wann Cluster in Einzelblitze aufgelöst werden*

Verfügbare Profile:

- **Früh** – löst Cluster früher in Einzelblitze auf.
- **Ausgewogen** – entspricht der bisher erprobten zonenabhängigen V4.08-Abstimmung.
- **Spät** – hält Cluster beim Hineinzoomen länger zusammen.
- **Klassisch · V4.07.56** – stellt das geschützte historische V4.07.56-Verhalten exakt wieder her.

Die V4.08-Testschwellen sind aktuell:

| Profil | Gewitterzone | Beobachtungszone | außerhalb Beobachtung |
|---|---:|---:|---:|
| Früh | z9 | z11 | z11 |
| Ausgewogen | z10 | z12 | z12 |
| Spät | z11 | z13 | z13 |

Die Gefahrenzone bleibt in diesen drei V4.08-Profilen immer in Einzelblitzdarstellung. `Klassisch · V4.07.56` nutzt dagegen unverändert die geschützte V4.07.56-Regel: Gefahr immer einzeln, innerhalb des Beobachtungsradius ab z8 einzeln, außerhalb ab z12 einzeln. Der Gewitterradius ist im klassischen Verhalten kein eigener Auflösungsfaktor.

Eine automatische/adaptive Auflösung ist **noch nicht** Bestandteil dieser Testversion.

## Cluster-Navigation · Sitzungszeit

Die bisherige Bezeichnung **„Cluster-Sprung · Sitzungszeit“** wird in **„Cluster-Navigation · Sitzungszeit“** geändert.

Die bereits abgenommene Funktion bleibt erhalten:

- frei wählbare endliche Sitzungszeit von 5 bis 3600 Sekunden;
- `∞` für unbegrenzte Navigation;
- direkter Wechsel Countdown ↔ `∞` in der Cluster-Statusanzeige;
- Rückwechsel von `∞` startet den gespeicherten endlichen Wert wieder vollständig;
- Klick auf Countdown/`∞` löst keinen zusätzlichen Cluster-Sprung aus;
- die seit V4.08.21 verwendete Pointer-Down-Behandlung bleibt für zuverlässige Desktop-/Touch-Bedienung erhalten.

## Migration und Rückfall

- Bisheriger V4.08-Zustand `zoned` wird beim ersten Start als **Ausgewogen** übernommen.
- Der bisherige klassische/ausgeschaltete Zustand wird als **Klassisch · V4.07.56** übernommen.
- Ein Profilwechsel beendet bewusst eine laufende Cluster-Navigationssitzung und startet die Darstellung mit der gewählten Auflösungsrichtlinie neu.
- V4.07.56 selbst und der geschützte Freeze werden nicht verändert.

## Repository- & Web-Dokumentation

Installationsanleitung und Gewitterradar-Webauftritt wurden überarbeitet, mehrsprachig vereinheitlicht und mit einer kompakten Funktionsgalerie sowie optimierten WebP-Grafiken ergänzt.

## Dokumentation

Die Profilauswahl und die neue Benennung sind in der sichtbaren Release History, in **Hilfe & Hinweise**, in `docs/HISTORY.md` und in `docs/V4_08_CLUSTER_RESOLUTION_PROFILES.md` dokumentiert.
