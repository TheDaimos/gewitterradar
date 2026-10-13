# V4.11.69 DEV – Datenquellen & Verbindungen: Modulkonzept

**Stand:** 13.10.2026 · **Status:** abgestimmte Anforderung / Entwurf, noch keine technische Umsetzung oder Realabnahme.  
**Leistungsreferenz:** V4.11.68 DEV unverändert. Keine Änderung an Kartenradiusdarstellung, Kartenflug, Clustern, Berührungssteuerung oder Wetteranimation.

## Zielbild

Die bisherige prominente Kopfzeile `BLITZORTUNG.ORG · LIVE` mit permanentem Statuspunkt soll aus dem Gewitterradar-Kopfbereich entfernt werden. Gewitterradar ist eine eigenständige Wetter- und Beobachtungsanwendung; Blitzortung ist eine von mehreren Datenquellen.

Unter **Einstellungen → Diagnose** entsteht ein eigenständiger Bereich **Datenquellen & Verbindungen** mit unabhängigen Untermodulen, zunächst **Blitzortung.org** und einem auf vorhandenen Consumer-V1-Funktionen aufbauenden **WeatherRouter**-Status. Die technische Registrierung der Fachmodule bleibt zusätzlich unter **Module & Versionen** sichtbar. Status-/Fehlerhinweise können in die bestehende Einstellungswarnanzeige einfließen, ohne die Titelzeile wieder auf Blitzortung zu verengen.

## Blitzortung-Untermodul

### 1. Betriebszustand und Herkunft

Die native Gewitterradar-Integration kennt bereits `GewitterradarRuntimeData.blitzortung_status()` in `custom_components/gewitterradar/__init__.py`. Diese Funktion liest fremde Blitzortung-Konfigurationseinträge nur lesend aus, prüft aber bislang lediglich `installed` und `linked` anhand `location_entity`. Sie ist als Grundlage zu erweitern:

- Anzahl konfigurierter Blitzortung-Einträge, je Eintrag HA-Integrationszustand (geladen, nicht geladen, Wiederherstellung usw.) und Eintragsbezeichnung.
- Gewitterradar-Referenztracker und dessen Zuordnung zu einem Blitzortung-Eintrag; bei mehreren Einträgen keine willkürliche Auswahl.
- Zugehörige verfügbare Blitzsensoren und gegebenenfalls tatsächlich vorhandene Blitz-`geo_location`-Entitäten. **Keine neuen Blitze** ist kein Beweis für eine defekte Verbindung.
- Getrennte Statusfelder für `integration`, `linkage`, `entities`, `dataFreshness`; unbekannte Informationen als `unknown` ausgeben statt grün zu behaupten.
- Keine Bearbeitung anderer `ConfigEntry.data`, `ConfigEntry.options` oder interner Home-Assistant-Speicherdateien.

### 2. Einstellungen aus Blitzortung 1.7.3 auslesen und darstellen

Der Quellcode der externen Blitzortung-Integration Version 1.7.3 bestätigt diese Felder:

| Schlüssel / Herkunft | Anzeige | Bemerkung |
|---|---|---|
| `ConfigEntry.options.radius` | **Erfassungsradius** | Einheit aus Home-Assistant-Einheitensystem km/mi |
| `ConfigEntry.options.time_window` | **Zeitfenster** | Minuten |
| `ConfigEntry.options.max_tracked_lightnings` | **Maximale Blitzereignisse** | 0 deaktiviert nur erzeugte `geo_location`-Entitäten, nicht die Sensoren |
| `ConfigEntry.data.config_type` | **Standortmodus** | Entität oder feste Koordinaten |
| `ConfigEntry.data.location_entity` | **Zugeordnete Standortentität** | Nur beim Modus `entity` |
| `ConfigEntry.data.latitude/longitude` | **Fester Standort** | Nur wenn Koordinatenmodus; Datenschutz vor Export berücksichtigen |
| `ConfigEntry.title` | **Konfigurationseintrag** | Für mehrere unabhängig eingerichtete Instanzen |

Die Werte werden im Untermodul **Einstellungen** als **Nur-Lesen**-Felder gezeigt; daneben getrennt die betrieblichen Diagnosewerte. Die Beispielwerte 1000 km, 120 Minuten und 100 Ereignisse stammen lediglich aus einem Nutzerbild vom 13.10.2026; die Oberfläche muss sie **zur Laufzeit** vom jeweiligen Eintrag lesen.

Wenn ein Schlüssel nicht vorhanden ist, darf nur ein in der erkannten Blitzortung-Version definierter Standardwert mit Kennzeichnung „Standardwert“ angezeigt werden. Der tatsächliche gespeicherte Wert hat Vorrang. Externe Versionswechsel können das Schema ändern, unbekannte Felder daher nicht ungeprüft exportieren.

### 3. Verfügbarkeit und Aktualität

- Server liest autorisiert und ausschließlich lesend Konfigurationseinträge von `blitzortung`; der normale Lovelace-Kartenkontext besitzt keinen direkten Zugriff auf fremde `ConfigEntry.options`. Informationen müssen über eine **eigene, autorisierte und datensparsame Backend-Schnittstelle** zur Oberfläche gelangen.
- Status beim Öffnen des Diagnosebereichs aktualisieren und manuell **Aktualisieren** anbieten. Keine dauerhafte hochfrequente Abfrage; bei Bedarf ereignisgestützte Aktualisierung.
- Mehrere Blitzortung-Einträge separat aufführen und Kennzeichnung „mit Gewitterradar gekoppelt“ nur bei bestätigter Referenz.
- Wenn die Backend-Schnittstelle in der Dashboard-Auslieferung nicht vorhanden ist: verständlicher Status „Direkte Integrationsprüfung nicht verfügbar“, keine geratenen Konfigurationsdaten. Bei Bedarf begrenzte, deklarierte Sensorzustandsprüfung getrennt ausweisen.
- Export muss Datum und Herkunft/Erkennungsmethode des Zustands enthalten; keine Zugangsdaten oder versteckte fremde Konfigurationsfelder.

### 4. Export-Vertrag

Der bestehende Moduldiagnose-Export (`application`, `runtimeProbe`, `diagnostics`, `layers`) wird rückwärtskompatibel um `dataSources` ergänzt, einschließlich je Submodul Status, Zuordnung, lesbaren ausgewählten Einstellungen, Quelle der Werte, Prüfzeitpunkt und konkretem Grund bei eingeschränkter Verfügbarkeit.

Die **Modulversion** bleibt von der **Verfügbarkeit der Datenquelle** getrennt; ein ordnungsgemäß geladenes Modul kann auf eine fehlende Integration hinweisen.

## Bereits nachgewiesener Altfehler der roten Leuchte

Aktuell benutzt `core.source-status` die Funktion `_counterEntity()`, deren Standard `sensor.home_lightning_counter` ist; der Nutzer hat dagegen `sensor.gewitterradar_lightning_counter` mit vorhandenem Wert nachgewiesen. Die derzeit rote Anzeige bedeutet zunächst nur „konfigurierte Zählerentität fehlt“, nicht zwingend „Blitzortung-Integration ausgefallen“. Ein Update auf Blitzortung 1.7.3 und Home Assistant 2026.10 änderte daran nichts. Die Recorder-Excludes beeinflussen die Laufzeitverfügbarkeit nicht.

## Abgrenzung / Abnahme

- Keine neuen Wetterdatenanfragen, Tracker-Umschaltungen oder Kartenzeichnungen durch das Hauptmodul.
- Untermodul **Blitzortung → Einstellungen** zeigt Werte aus dem richtigen Konfigurationseintrag, ohne sie zu ändern.
- Integrationsstatus, Linkstatus, Entitätsstatus und Datenfrische werden nicht fälschlich gleichgesetzt.
- Mehrfache Konfigurationen und fehlende Backend-Anbindung sind eindeutig diagnostizierbar.
- Moduldiagnose-JSON beinhaltet `dataSources` ohne Geheimnisse und mit realem Prüfzeitpunkt.
- Roter Headerstatus entfernt, funktionale Warnungen in der Diagnose weiterhin sichtbar.
- V4.11.68-Leistungs- und Kamerafahrtregressionen zwingend unverändert bestehen lassen.
- Erst nach Implementierung, Test und realer HA-Abnahme Versionsfreigabe; **dieses Dokument allein ist keine V4.11.69-Version**.

## Verifizierte externe Quellen

- [Blitzortung v1.7.3 Konfigurationsdialog](https://github.com/mrk-its/homeassistant-blitzortung/blob/v1.7.3/custom_components/blitzortung/config_flow.py)
- [Blitzortung v1.7.3 Schlüssel, Grenzen und Standardwerte](https://github.com/mrk-its/homeassistant-blitzortung/blob/v1.7.3/custom_components/blitzortung/const.py)
- [Blitzortung 1.7.3 Veröffentlichung](https://github.com/mrk-its/homeassistant-blitzortung/releases/tag/v1.7.3)

**C.K. – Eine Idee weiter gedacht.**
