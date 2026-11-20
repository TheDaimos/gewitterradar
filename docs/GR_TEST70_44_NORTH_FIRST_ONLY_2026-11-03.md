# TEST70-44 – north_first als einzige OPERA-Orientierung in GR

Datum: 2026-11-03. Quelle: `TheDaimos/gewitterradar@deploy/dev`.

## Hintergrund
Die beiden Entwicklungsvarianten wurden im Realtest verglichen. Laut Nutzer ist Variante B (`south_first`) widerlegt; Variante A (`north_first`) ist als Standard beschlossen. Diese Entscheidung wird im GR-Client technisch festgelegt; keine weitere Hypothesenauswahl.

## Implementierung
- OPERA-Auswahlliste A/B in `frontend/modules/weather/consumer-client.js` entfernt; statische Anzeige `north_first`.
- Event-Listener für Wechsel der Orientierung entfernt.
- OPERA-Request verwendet fest `const orientation='north_first'`.
- Der diagnostische GR-Adapter erlaubt nur noch `north_first`, nicht mehr `south_first`.
- Gleichlaufende Kopien in `custom_components/gewitterradar/frontend` und `dashboard/dist` aktualisiert.
- WR-Datenverfügbarkeit, Veraltungsgrenzen und Bereitstellungsentscheidungen **unverändert** ausschließlich im WR.
- Das automatische Schließen der Vorschau nach Ende eines Zyklus und der automatische Zykluswechsel sind **noch nicht korrigiert**. Diese Lifecycle-Themen benötigen einen separaten WR-Vertrag und GR-Implementierung.

## CI-Nachweis
Öffentliche Action: https://github.com/TheDaimos/gewitterradar/actions/runs/41649893772
Ergebnis: SUCCESS.
Release-Commit: `a7d58b8322ae2397a06203f0ab1b95ca1cb4dd3a`.
GR: V4.11.125 DEV; Integration 0.25.34; Runtime 411125r1.
Keine privaten GitHub Actions. HA PROD VM 101 bleibt unverändert.
