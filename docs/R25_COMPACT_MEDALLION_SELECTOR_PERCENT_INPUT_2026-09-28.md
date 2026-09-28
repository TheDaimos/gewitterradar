# R25 – kompakte Medaillon-/Pfeilauswahl und robuste Vollbild-Größeneingabe

Stand: 2026-09-28

## Anlass

Die reale R22/R24-Prüfung zeigte zwei Bedienprobleme im Medaillon-Pop-up:

1. Die getrennten, gleichzeitig sichtbaren Navigationszeilen für Medaillon und Pfeil waren insbesondere auf Mobilgeräten zu dominant.
2. Die direkte Prozent-Eingabe wurde während des Tippens durch die laufende UI-Synchronisierung wieder überschrieben. Dadurch ließ sich ein vorhandener Wert wie `100` praktisch nicht vollständig löschen, um z. B. `300` einzutragen.

R25 behebt beide Punkte, ohne die produktive 504er-Kalibrierung oder die geschützte Diagnosegeometrie zu verändern.

## Kompakte Auswahl

Das Medaillon-Pop-up besitzt jetzt einen Umschalter:

- **Medaillon**
- **Pfeil**

Es ist nur noch die Navigation der aktiven Auswahl sichtbar.

Normale Hauptanzeige:

- `Medaillon · 17 / 28`
- `Arrow · 3 / 18`

Die technischen IDs werden im normalen Produktmodus nicht zusätzlich eingeblendet.

Bei aktiver Diagnose erscheint unter der Auswahl eine technische Zusatzzeile:

- `Medaillon: trend_17 · 17 / 28`
- `Pfeil: arrow_02 · 3 / 18`

Damit bleibt die Produktansicht kompakt, während die Diagnose weiterhin eindeutig auf die stabilen internen IDs verweist.

Der zuletzt verwendete Auswahlmodus wird sitzungsbezogen unter

`gewitterradar:v41002:medallion-picker-selection-mode`

gespeichert.

## Vollbild-Größe

Die Schnellwahl bleibt erhalten:

- 50 %
- 75 %
- 100 %
- 125 %
- 150 %

Zusätzlich bleiben zwei Wege für freie Werte von 15–300 % erhalten:

- Schieberegler für schnelle, direkte Anpassung,
- Texteingabe mit Zifferntastatur für exakte Werte.

### Eingabeschutz

Das Eingabefeld ist bewusst kein natives `type=number` mehr, sondern ein numerisches Textfeld mit maximal drei Stellen.

Während der Bearbeitung wird `data-fullscreen-scale-editing=1` gesetzt. Solange dieser Zustand aktiv ist, darf die laufende Picker-/Bild-Synchronisierung den Inhalt des Feldes nicht zurückschreiben.

Übernahme erfolgt erst bei:

- Enter,
- Verlassen des Feldes.

Erst dann wird auf den zulässigen Bereich 15–300 % begrenzt und der Wert persistent gespeichert.

Escape verwirft den unbestätigten Eingabestand und stellt den aktuell gespeicherten Wert wieder her.

Der Schieberegler arbeitet weiterhin live und bleibt mit Schnellwahltasten, Ausgabewert und Eingabefeld synchron.

## Produktive Kalibrierung

R25 verändert die in R21 eingeführte produktive 504er-Kalibrierung nicht.

Die Medaillon-Auswahl verwendet weiterhin dieselben bestätigten Werte für:

- Pfeilgröße,
- Mittelpunkt X,
- Mittelpunkt Y,

wie die normale Tendenzdarstellung.

Die Diagnose-/Messgeometrie bleibt unabhängig davon geschützt.

## Build-Identität

- Build: `V4.10.02-MODULAR-DEV-R25-2026-09-28`
- Runtime-Cache: `41002r13`
- Feature-Cache: `41002r25`
- Modulsatz: `D31A-5E95`
- `core.manifest`: 1.2.31
- `fullscreen.map-display`: 1.0.23

## Technische Abnahme

Finaler technischer Kandidat:

`860100d2e95ce706404b7fe8c93ad807e4a905e8`

Alle fünf zentralen Prüfungen sind erfolgreich:

- Validate shared Gewitterradar frontend
- Validate Gewitterradar integration
- Diagnostic contract
- Source archive contract
- Hi-Res asset retention

`deploy/dev` wurde exakt auf diesen Kandidaten gesetzt und mit `ahead 0 / behind 0 / identical` verifiziert.

## Reale Abnahme

Noch offen:

- R25 per DRA installieren.
- Frontend vollständig neu laden.
- Medaillon/Pfeil-Umschalter prüfen.
- nur eine Chevron-Navigation gleichzeitig sichtbar.
- Normalmodus zeigt ausschließlich die kompakte Hauptzeile.
- Diagnosemodus zeigt zusätzlich die technische ID-Zeile.
- direkten Wert `100` vollständig löschen und `300` eintippen.
- prüfen, dass während des Tippens kein Rücksetzen erfolgt.
- Enter und Fokusverlust übernehmen den Wert.
- Schieberegler 15–300 % prüfen.
- getrennte Speicherung für Kompass und Medaillon prüfen.
- Desktop, iPad und Android/HA Companion prüfen.
