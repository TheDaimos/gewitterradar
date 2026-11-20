# Gewitterradar V4.11.52 DEV – Settings footer alignment

2026-10-09

## Anlass

Vier zeitlich geordnete Android-Aufnahmen dokumentierten den Übergang zur Seite `4. Kartendarstellung`, einschließlich verschobenem Inhalt und einer abrupten Endkorrektur. Die Folgeaufnahmen zeigten außerdem unterschiedliche Positionen der Versionsangabe im horizontalen und klassischen Einstellungsmenü.

## Ursache und Umsetzung

Die horizontale Navigation setzt `.settings-body` auf `position:relative` für den animierten Seitenwechsel. Die absolute `.settings-footer-version` lag bislang *innerhalb* dieses Körpers und verwendete deshalb während der horizontalen Darstellung eine andere Bezugskante als im klassischen Menü.

Die Versionsanzeige wurde als direktes Kind von `.settings-dialog` positioniert, sodass `bottom` und `left` in beiden Modi denselben Rahmen referenzieren. Die Originalsignatur bleibt unverändert. Der angezeigte Monat wird aus der tatsächlich geladenen Buildkennung (z. B. `V4.11.52-DEV-2026-10-09`) abgeleitet, statt aus einem historischen konstanten Buildmonat. Dieselbe Regel gilt für die Versionsverlaufsanzeige.

Die zuvor korrigierte Endposition der Animation und die aktuelle Android-Touchsteuerung bleiben unangetastet.

## Versionen

- Gewitterradar V4.11.52 DEV
- Laufzeit `41152r1`
- Modulsatz `E411-52A1`
- `ui.skeleton` 1.1.21
- `core.manifest` 1.2.113
- Native Integration weiterhin 0.25.0

## Abnahme

CI: Menü-/Identitätsvertrag, JavaScript-Syntax, Artefaktabgleich, Versionskennungen und Asset-SHA prüfen. Die gesonderten allgemeinen CI-Workflows dürfen nicht einfach ignoriert werden. DRA-Update erst nach freigegebenem Stand. Home-Assistant-Realtest für 'Langsam', 'Mittel' und 'Schnell' sowie beide Menüformen bleibt erforderlich.
