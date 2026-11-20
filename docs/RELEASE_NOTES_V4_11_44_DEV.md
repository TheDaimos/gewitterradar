# Gewitterradar V4.11.44 DEV – Reparatur „Hilfe & Hinweise“

Datum: 2026-10-09

## Nachgewiesene Ursache
Der HA-Realtest von V4.11.42 lieferte in der sichtbaren Hilfediagnose die konkrete Ausnahme:
`section.entries.entries()[Symbol.iterator]().next().value is not iterable`.
In `_syncHelp()` wurde bislang jedes Element von `section.entries` als Zweierliste `[term,text]` destrukturiert. Die neueren WeatherRouter-Hilfeabschnitte `V411_HELP_WEATHER_DISPLAY` und `V411_HELP_WEATHER_REFRESH` definieren Einträge stattdessen als Objekte `{term,description}`. Das Werfen der Ausnahme vor `showModal()` in V4.11.40/V4.11.41 erklärte den scheinbar wirkungslosen Hilfe-Knopf; ab V4.11.42 war die Fehlermeldung sichtbar.

## Korrektur
Die bestehende Rendering-Schleife behandelt jetzt beide zulässigen Varianten:
- historische Einträge als `[term,text]`;
- neue Einträge als `{term,description}` (mit Fallbacks `title`/`body`).

Die Inhalte, übersetzten Texte und geschützte Darstellung werden nicht ersetzt. Bestehende sichtbare Fehlerdiagnose bleibt erhalten. Keine Änderungen an Android-Kartengesten, WeatherRouter-Routing oder geschützten Assets.

## Identität und Abnahme
- V4.11.44 DEV, Runtime `41144r1`, Modulsatz `E411-44A1`.
- `ui.i18n-settings` 1.3.9, Integration 0.25.0.
- Vier betroffene Dateien in Quell-, Dashboard- und Integrations-Frontend anhand Git-Blobs identisch.
- Realtest noch offen: Hilfe öffnen, alte und neue Abschnitte ausklappen, Sprache wechseln, schließen/erneut öffnen, About prüfen. Bei Problemen den JSON-Export inklusive `layers.helpState` sichern.
- Die separate DRA-/Runtime-Manifestabweichung ist damit nicht als behoben erklärt.

**C.K. – Eine Idee weiter gedacht.**
