# Gewitterradar V4.11 – Übergabe Seitenleisten-Panel / Integrationsoption

Stand: **2026-10-04**  
Projekt: **Gewitterradar**  
Repository: `TheDaimos/gewitterradar`  
Entwicklungszweig: `feature/v4.11-development`  
DRA-Zweig: `deploy/dev`

## 1. Verbindlicher technischer Checkpoint vor dieser Übergabedokumentation

Runtime-/Code-Checkpoint:

`4896babdd7feda28523a29dadc2ce9f48a6e7276`

Zu diesem Stand waren synchron:

- `feature/v4.11-development`
- `deploy/dev`

Automatisierte Prüfungen am Checkpoint:

- Validate shared Gewitterradar frontend – Run **37211918406** – **SUCCESS**
- Validate Gewitterradar integration – Run **37211918517** – **SUCCESS**
- Hi-Res asset retention – Run **37211918461** – **SUCCESS**

Produktstand:

- Gewitterradar **V4.11.08 DEV**
- native Integration **0.24.0**
- Project Hub / WeatherRouter / Kartenansichten nicht Teil dieses offenen Fehlers

## 2. Bereits erfolgreich umgesetzt

### GitHub Page

Die Gewitterradar-Projektseite ist auf **15 Sprachen** umgestellt und besitzt ein sichtbares Sprach-Auswahlmenü.

Sprachen:

- Deutsch
- English
- Dansk
- Español
- Français
- Nederlands
- Polski
- Português
- Svenska
- Italiano
- Norsk bokmål
- Suomi
- Čeština
- Ελληνικά
- Magyar

Die Seite dokumentiert außerdem bereits die geplante Seitenleisten-Funktion.

Dieser Teil ist **nicht offen** und soll beim Sidebar-Fix nicht erneut umgebaut werden.

### Native Seitenleisten-Grundlage

Die native Integration wurde auf **0.24.0** angehoben.

Vorhanden sind derzeit:

- Option `show_sidebar_panel` in `ConfigEntry.options`
- Entität `switch.gewitterradar_show_sidebar_panel`
- Panel-Host unter `gewitterradar-panel`
- `frontend/panel.js`
- direkte Einbettung der normalen `gewitterradar-card`, also keine separate Lovelace-View als Voraussetzung
- persistente Panel-Registrierung beim Laden der Integration, falls die Option aktiv ist
- Entfernung des Panels beim Deaktivieren / Entladen

Wichtige Dateien:

- `custom_components/gewitterradar/__init__.py`
- `custom_components/gewitterradar/const.py`
- `custom_components/gewitterradar/switch.py`
- `custom_components/gewitterradar/config_flow.py`
- `custom_components/gewitterradar/strings.json`
- `custom_components/gewitterradar/translations/de.json`
- `custom_components/gewitterradar/translations/en.json`
- `custom_components/gewitterradar/manifest.json`
- `frontend/panel.js`
- `scripts/build-frontend.mjs`
- `scripts/verify-frontend.mjs`
- `tests/test_settings.py`

## 3. Ergebnis des ersten HA-Realtests

Der Benutzer hat die Integration **0.24.0** real in Home Assistant getestet.

Positiv:

- Gewitterradar wird korrekt als benutzerdefinierte Integration angezeigt.
- Die Integration zeigt **19 Entitäten**.
- Die neue Entität **„In Seitenleiste anzeigen“** ist vorhanden.

Fehler:

- Die Entität lässt sich im Realbetrieb **nicht aktivieren**.
- Home Assistant zeigt für sie einen nicht nutzbaren / nicht schaltbaren Zustand (im Realtest als `—` dargestellt).
- Damit erscheint Gewitterradar noch nicht über diesen Weg in der Seitenleiste.

Wichtig: Die automatisierten Tests waren grün. Der Fehler ist daher ausdrücklich als **HA-Realtest-Abweichung** zu behandeln und nicht durch bloßes Wiederholen der bisherigen Unit-Tests als erledigt anzusehen.

## 4. Neue verbindliche UX-Entscheidung

Der Benutzer möchte die Seitenleisten-Funktion **nicht als versteckte Konfigurationsentität** bedienen.

Gewünschter Ort:

**Home Assistant → Einstellungen → Geräte & Dienste → Gewitterradar → Konfigurieren**

Dort soll die Funktion direkt als Integrationsoption angeboten werden:

**„In Seitenleiste anzeigen“**

Das ist der verbindliche Zielweg.

Home Assistant sieht für veränderbare ConfigEntry-Optionen ausdrücklich einen **Options Flow** vor. Offizielle Referenz:

https://developers.home-assistant.io/docs/core/integration/options_flow/

Für die Umsetzung ist daher ein nativer `OptionsFlow` bzw. `OptionsFlowWithReload` in `config_flow.py` der bevorzugte Weg.

## 5. Zielarchitektur für die Fortsetzung

### A. Bedienung

- `config_flow.py` um einen nativen Options Flow erweitern.
- In der Integrationskonfiguration einen booleschen Schalter **„In Seitenleiste anzeigen“** anbieten.
- Der Wert bleibt in `ConfigEntry.options[CONF_SHOW_SIDEBAR_PANEL]`.
- Änderung muss Panel-Registrierung bzw. Panel-Entfernung zuverlässig auslösen.
- Zustand muss Neustart / Reload überleben.

### B. Keine versteckte Entität als primäre Bedienung

Der derzeitige `switch.gewitterradar_show_sidebar_panel` entspricht nicht dem gewünschten Bedienmodell.

Im neuen Chat verbindlich prüfen und sauber entscheiden:

1. Sidebar-Schalter vollständig aus der öffentlichen Entity-Plattform entfernen, **oder**
2. falls für Abwärtskompatibilität technisch nötig, nicht als primäre Benutzersteuerung verwenden und sauber migrieren/ausblenden.

Bevorzugtes Ziel ist **keine zusätzliche öffentliche Sidebar-Konfigurationsentität**, sondern ausschließlich die Integrationsoption.

Achtung: `SWITCH_KEYS` wird derzeit auch für die boolesche Optionsvalidierung verwendet. Beim Entfernen von `CONF_SHOW_SIDEBAR_PANEL` aus der Switch-Entity-Erzeugung darf deshalb die Validierung nicht versehentlich verloren gehen. Falls nötig, Entitäts-Switches und boolesche ConfigEntry-Optionen in getrennte Konstantenmengen aufteilen.

### C. Panel selbst

Der gewünschte Funktionsumfang bleibt:

- Aktivieren → Gewitterradar erscheint in der Home-Assistant-Seitenleiste.
- Klick auf Gewitterradar → **sofort der normale Gewitterradar-Screen**.
- Keine zusätzliche Lovelace-/Dashboard-View erforderlich.
- Bestehende manuell angelegte View bleibt weiterhin optional möglich.
- Deaktivieren → Seitenleisteneintrag verschwindet.
- Neustart / Reload → Zustand wird korrekt wiederhergestellt.

`frontend/panel.js` soll weiterhin nur ein dünner Host für dieselbe `gewitterradar-card` sein. Keine zweite Gewitterradar-Oberfläche bauen.

## 6. Fehleranalyse – noch offen

Nicht vorschnell annehmen, dass nur die UI-Position das Problem ist.

Beim Realtest war der Switch nicht aktivierbar. Deshalb zuerst prüfen:

- Zustand der Config Entry nach Installation / Neustart
- Zustand der Switch-Entity und warum Home Assistant sie als nicht schaltbar darstellt
- Home-Assistant-Log beim Versuch zu schalten
- Panel-Registrierung und Entfernung in `__init__.py`
- Zeitpunkt der Options-Aktualisierung
- Reload-/Update-Listener-Verhalten
- ob ein `OptionsFlowWithReload` die robusteste Lösung ist oder ein gezielter Update Listener genügt

Die aktuelle Panel-Registrierung am Checkpoint verwendet Home Assistants Frontend-Panelmechanismus direkt. Diese Funktion nicht unnötig neu erfinden; erst den tatsächlichen Realfehler isolieren.

## 7. Verbindliche Schutzregeln

Beim Fix **nicht verändern**:

- Project Hub
- Project-Hub-Runtime
- WeatherRouter Layer Hub
- Wetter-Timeline
- Kartenmodus Standard / Groß / Vollbild
- Kompass-/Medaillon-Geometrie
- Android-/iPad-Abnahmen
- About
- Diagnose
- 15-sprachige GitHub-Page außer falls die neue Options-Bedienung textlich angepasst werden muss
- bestehende optionale manuelle Lovelace-View

Keine neue zweite Kartenimplementierung und kein iframe-basierter Ersatz für die normale Gewitterradar-Karte.

## 8. Reale Abnahme nach dem Fix

Nach Bereitstellung über DRA mindestens testen:

1. Home Assistant vollständig neu starten.
2. **Einstellungen → Geräte & Dienste → Gewitterradar** öffnen.
3. **Konfigurieren** öffnen.
4. Option **„In Seitenleiste anzeigen“** einschalten.
5. Seitenleisteneintrag erscheint.
6. Eintrag anklicken.
7. Normaler Gewitterradar-Screen erscheint direkt.
8. Standard/Groß/Vollbild, Project Hub und WeatherRouter-Menü kurz gegenprüfen.
9. HA neu starten.
10. Seitenleisteneintrag bleibt erhalten.
11. Integrationsoption ausschalten.
12. Seitenleisteneintrag verschwindet.
13. Erneut neu starten und prüfen, dass er weg bleibt.
14. Sicherstellen, dass keine separate View benötigt wird.
15. Prüfen, dass keine überflüssige Sidebar-Konfigurationsentität mehr als primärer Bedienweg verbleibt.

## 9. Arbeitsweise im neuen Chat

1. Repo und diese Übergabe vollständig lesen.
2. Aktuelle Branch-Heads prüfen.
3. Bestehende 0.24.0-Implementierung lesen, nicht neu beginnen.
4. Realfehler des nicht schaltbaren Schalters nachvollziehen.
5. Options Flow als primäre Integrationsbedienung umsetzen.
6. Panel-Registrierung/Entfernung robust an Optionsänderungen koppeln.
7. Tests für Options Flow, Reload, Persistenz und Panelregistrierung ergänzen.
8. Native Frontend-/Dashboard-Parität nicht beschädigen.
9. Integration-Version sauber erhöhen.
10. `feature/v4.11-development` und `deploy/dev` synchronisieren.
11. DRA-Testkandidat bereitstellen.
12. Erst dann Benutzer für den nächsten HA-Realtest hinzuholen.

## 10. Kurzfassung

**Die Seitenleisten-Grundlage ist in Integration 0.24.0 vorhanden und CI-grün, aber der erste HA-Realtest ist fehlgeschlagen: „In Seitenleiste anzeigen“ ist als Entity vorhanden, lässt sich jedoch nicht aktivieren. Zusätzlich ist die UX-Entscheidung geändert: Die Funktion soll direkt über „Gewitterradar → Konfigurieren“ als native ConfigEntry-Option erreichbar sein, nicht in der Entitätenliste versteckt. Nächster Schritt: Realfehler analysieren, Options Flow implementieren, Sidebar-Entity als Bedienweg entfernen/sauber migrieren, DRA-Kandidat bauen und erneut real testen.**
