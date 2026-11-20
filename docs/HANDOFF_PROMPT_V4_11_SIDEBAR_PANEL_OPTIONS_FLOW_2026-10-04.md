Bootstrap: Daimos

Projekt: Gewitterradar

Repository:
TheDaimos/gewitterradar

Entwicklungszweig:
feature/v4.11-development

Wir setzen V4.11 beim nativen Gewitterradar-Seitenleistenpanel fort.

Lies ZUERST vollständig:

1. docs/V4_11_CHAT_HANDOFF_2026-10-04_SIDEBAR_PANEL_OPTIONS_FLOW.md
2. custom_components/gewitterradar/__init__.py
3. custom_components/gewitterradar/const.py
4. custom_components/gewitterradar/config_flow.py
5. custom_components/gewitterradar/switch.py
6. custom_components/gewitterradar/strings.json
7. custom_components/gewitterradar/translations/de.json
8. custom_components/gewitterradar/translations/en.json
9. custom_components/gewitterradar/manifest.json
10. frontend/panel.js
11. tests/test_settings.py
12. tests/test_frontend_delivery.py

Letzter grün geprüfter technischer Code-Checkpoint vor der Übergabedokumentation:

4896babdd7feda28523a29dadc2ce9f48a6e7276

An diesem Checkpoint:
- feature/v4.11-development = deploy/dev
- Gewitterradar V4.11.08 DEV
- native Integration 0.24.0
- Shared Frontend SUCCESS Run 37211918406
- Integration SUCCESS Run 37211918517
- Hi-Res SUCCESS Run 37211918461
- GitHub Page mit 15 Sprachen ist umgesetzt
- native Sidebar-Grundlage ist implementiert
- normale gewitterradar-card wird direkt im Panel-Host verwendet

WICHTIGER HA-REALTEST:

Die neue Entität „In Seitenleiste anzeigen“ ist sichtbar, lässt sich aber real nicht aktivieren und erscheint mit nicht nutzbarem Zustand.

Zusätzlich verbindliche UX-Entscheidung:

Die Seitenleisten-Funktion soll NICHT in den Entitäten versteckt sein.

Gewünschter Bedienweg:

Home Assistant
→ Einstellungen
→ Geräte & Dienste
→ Gewitterradar
→ Konfigurieren
→ „In Seitenleiste anzeigen“

Dafür den nativen Home-Assistant-Options-Flow verwenden.

Offizielle HA-Referenz:
https://developers.home-assistant.io/docs/core/integration/options_flow/

ZIEL:

- ConfigEntry.options bleibt kanonischer Speicher für show_sidebar_panel.
- Options Flow / ggf. OptionsFlowWithReload implementieren.
- Aktivieren registriert Gewitterradar zuverlässig in der Seitenleiste.
- Klick öffnet direkt den normalen Gewitterradar-Screen.
- Keine zusätzliche Dashboard-View erforderlich.
- Deaktivieren entfernt den Seitenleisteneintrag.
- Zustand überlebt Reload und Neustart.
- Die aktuelle Sidebar-Switch-Entity ist nicht mehr der primäre Bedienweg; bevorzugt sauber entfernen/migrieren.
- Falls SWITCH_KEYS gleichzeitig Validierungslogik trägt, Entity-Liste und boolesche Optionsvalidierung sauber trennen.
- Den realen Grund für den bisher nicht aktivierbaren Switch trotzdem nachvollziehen; nicht nur die UI verschieben.

NICHT VERÄNDERN:

- Project Hub
- WeatherRouter Layer Hub
- Wetter-Timeline
- Kartenmodi
- Kompass/Medaillon
- About
- Diagnose
- bestehende Android-/iPad-Abnahmen
- GitHub-Page-Layout
- optionale manuelle Lovelace-View

ARBEITSWEISE:

1. Aktuelle Branch-Heads prüfen.
2. Bestehende 0.24.0-Implementierung vollständig lesen.
3. Realfehler isolieren.
4. Options Flow implementieren.
5. Panelregistrierung und Persistenz robust machen.
6. Tests ergänzen.
7. Integrationsversion erhöhen.
8. feature/v4.11-development und deploy/dev synchronisieren.
9. DRA-Testkandidat bereitstellen.
10. Mich erst für den HA-Realtest wieder hinzuholen.

Nach dem Lesen zuerst den aktuellen HEAD und den daraus abgeleiteten Startpunkt nennen und dann selbstständig loslegen.
