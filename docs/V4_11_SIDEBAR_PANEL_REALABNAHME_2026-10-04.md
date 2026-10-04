# Gewitterradar V4.11 – HA-Realabnahme natives Seitenleistenpanel

Stand: **2026-10-04**  
Projekt: **Gewitterradar**  
Repository: `TheDaimos/gewitterradar`

## Verbindlich real getesteter Runtime-Checkpoint

`b9c1efe08a4bd12d3d434f5e4e4e555312904b67`

Native Integration: **0.25.0**

Zum Zeitpunkt der Realabnahme waren:

- `feature/v4.11-development`
- `deploy/dev`

auf diesem Runtime-Checkpoint identisch.

## Ergebnis der HA-Realabnahme

Die native Gewitterradar-Seitenleistenfunktion wurde in einer realen Home-Assistant-Installation vollständig erfolgreich getestet.

Abgenommen:

- **Einstellungen → Geräte & Dienste → Gewitterradar → Konfigurieren** ist verfügbar.
- Die Option **„In Seitenleiste anzeigen“** ist dort direkt bedienbar.
- Aktivieren fügt **Gewitterradar** zuverlässig zur Home-Assistant-Seitenleiste hinzu.
- Der Klick auf den Seitenleisteneintrag öffnet direkt den normalen Gewitterradar-Screen.
- Es ist **keine zusätzliche Lovelace-/Dashboard-View** erforderlich.
- Der aktivierte Zustand bleibt nach einem vollständigen Home-Assistant-Neustart erhalten.
- Deaktivieren entfernt den Seitenleisteneintrag zuverlässig.
- Auch der deaktivierte Zustand bleibt nach einem vollständigen Home-Assistant-Neustart erhalten.
- Aktivieren und Deaktivieren wurden beide real verprobt.
- Die zuvor vorhandene Sidebar-Konfigurationsentität ist nicht mehr der Bedienweg; die Funktion läuft über den nativen Options Flow.

## Technischer Stand

Die Umsetzung verwendet `ConfigEntry.options["show_sidebar_panel"]` als kanonischen Speicher und einen nativen `OptionsFlowWithReload`.

Die boolesche Optionsvalidierung ist von der Liste tatsächlich erzeugter Switch-Entitäten getrennt. Dadurch bleibt `show_sidebar_panel` streng validiert, ohne noch als öffentliche Switch-Entity erzeugt zu werden.

Der alte Registry-Eintrag der 0.24.0-Sidebar-Switch-Entity wird beim Laden bereinigt.

Das bestehende `frontend/panel.js` bleibt ein dünner Host für die normale `gewitterradar-card`; es wurde keine zweite Kartenoberfläche eingeführt.

## Automatisierte Abnahme vor dem Realtest

Feature-Branch:

- Validate Gewitterradar integration – Run **37220478080** – SUCCESS
- Validate shared Gewitterradar frontend – Run **37220478055** – SUCCESS
- Hi-Res asset retention – Run **37220478140** – SUCCESS

DRA-Zweig:

- Validate Gewitterradar integration – Run **37220830133** – SUCCESS
- Validate shared Gewitterradar frontend – Run **37220830177** – SUCCESS

## Abschluss

**Die native Gewitterradar-Seitenleistenfunktion für V4.11 / Integration 0.25.0 ist damit automatisiert und real vollständig abgenommen.**

Der geprüfte Runtime-Code bleibt eindeutig über den SHA
`b9c1efe08a4bd12d3d434f5e4e4e555312904b67`
referenziert.
