# ERWEITERTE CHATÜBERGABE – GR Settings Vault / updatefeste Einstellungen

**Stand:** 11.11.2026  
**Art:** Architektur- und Arbeitsübergabe für einen neuen Chat; noch **kein** Implementierungsauftrag und **kein** fertiggestellter Settings Vault.  
**Projekt:** GewitterRadar Pro – powered by WeatherRouter  
**GR-Repository:** https://github.com/TheDaimos/gewitterradar  
**Aktiver Entwicklungs-/DRA-Branch:** ausschließlich **deploy/dev**  
**HA DEV:** Proxmox VM 109; **HA PROD:** Proxmox VM 101 – strikt getrennt.  
**Priorität:** **P0 – dauerhafte Updatefestigkeit aller benutzerspezifischen GR-Einstellungen**, vor neuen größeren Fachfunktionen.

> **Direkter Startauftrag für den neuen Chat:** Wir entwickeln die Architektur für einen „GR Settings Vault“ auf Basis der geschützten Referenz V4.11.181. Ziel ist, sämtliche benutzerspezifischen GewitterRadar-Darstellungs-, Funktions-, Profil- und Layout-Einstellungen über zukünftige GR-/HA-Updates hinweg verlustfrei zu bewahren. Bitte diese gesamte Übergabe lesen; zunächst Architektur, Inventar, Migrations- und Abnahmekonzept vollständig ausarbeiten, danach einen separaten, implementierbaren Codex-Masterprompt erstellen. Nicht ohne Freigabe die Referenz verändern, keine vorhandenen Einstellungen löschen und nicht vorschnell einen Speicherverlust behaupten.

---

## 1. Verbindliche aktuelle Referenz und Veröffentlichungsstatus

Der Betreiber hat **GR 4.11.181 DEV / HA 0.25.88** am 11.11.2026 nach eigener praktischer Nutzung ausdrücklich freigegeben:

**„Mega gut, funktioniert hervorragend, neue Referenzversion!“**

Daher ist **V4.11.181 die aktuelle GESCHÜTZTE REFERENZ**. Nicht V180 oder V179 als aktuelle Referenz behandeln. Diese bleiben wichtige historische Vergleichsstände.

| Kennung | Stand |
|---|---|
| GR | **4.11.181 DEV** |
| HA-Integration | **0.25.88** |
| Runtime | **411181r1** |
| Modulsatz | **E411-181A1** |
| Referenz-Release-Commit | **4587b76ca254fdc62cf179560fca9f61c1214133** |
| Letzter reiner Referenzdokumentations-Commit bei Übergabe | **5c75fc317201e69b777367b27ca5e2668a79a9eb** |
| Release | https://github.com/TheDaimos/gewitterradar/releases/tag/v4.11.181-dev |
| Geschütztes Referenzdokument | https://github.com/TheDaimos/gewitterradar/blob/deploy/dev/docs/GR_DEV_REFERENCE_4_11_181_2026-11-11.md |
| V181-Implementierungsbericht | https://github.com/TheDaimos/gewitterradar/blob/deploy/dev/docs/GR_NEON_ENERGY_SIGNATURE_181_2026-11-11.md |
| Öffentliche V181-CI | https://github.com/TheDaimos/gewitterradar/actions/runs/43005887305 |
| Bestehender Installationskanal | **TheDaimos/gewitterradar@deploy/dev** |

Die V181-Neon-Erweiterung ergänzt **Electric Gold**, **Silver / Chrome** sowie **Energieakzente Aus/Dezent/Normal/Stark**. Energieakzente sind standardmäßig aus und entstehen als sehr kurze zweifarbige Lichtimpulse bei tatsächlichen Filamentkontakten. Laut V181-Bericht waren **54 V180-Frames pixelidentisch** bei ausgeschalteten Neuerungen, die **180 V177-Pixelvergleiche** bestanden, die öffentliche CI war erfolgreich. Die emulierte Android-Zusatzzeit betrug im Bericht **0,09–0,16 ms je Eye-Zeichenaufruf**. Diese automatisierten Werte sind keine separat gemessene physische Android-FPS.

**Referenzschutz:** Optik, hochwertige Original-Icons, Eye-Mastergrafiken, lebende Neonfilamente, Energiebrücken, Lichtperlen und Farbtransfer, Ringabstände, Glow-/Bloom-Vorschau, Gold/Chrome, Energieakzente, adaptive Performance, Schlangen-Windanimation samt allen Parametern, Temperatur-/Niederschlagsdarstellung, Premium-Menüs, Legenden sowie WR-/GR-Verantwortungsgrenze dürfen durch eine reine Speicherreform nicht verändert werden.

---

## 2. Betreiberproblem: beobachtet, aber Ursache noch nicht bewiesen

Der Betreiber berichtet **wiederkehrende vollständige Rücksetzungen vieler Einstellungen nach GR-/HA-Updates**. Betroffen beziehungsweise zu schützen sind nach seiner Beschreibung:

- Eye/Aura/Neon-Studio: Farben, Lichtstärke, Glow, Bloom, Filamente, Ringabstände, Energieakzente, Slotbelegung und Position.
- Wind: Darstellung, Schlangenanimation, sämtliche Parameter, Farbflächen, Symbolfarben, Geschwindigkeit/Dichte, Kartensteuerung, Wind-Studio und Benutzerprofile.
- Temperatur: Farbfläche, Farben/Skalen, Beschriftungen, Advektion, Deckkraft, Legenden und Anzeigeparameter.
- Niederschlag/Wolken: Darstellung, Transparenz/Opacity, Layerwahl, Legenden und Controls.
- WR-Darstellungsmenü: Layer-spezifische Einstellungen, Erscheinungsbild und Fensterpositionen.
- Karten-/Kompass-/Medallion-/Premium-Menüs: Größen, Anordnung, Design, Anzeige und Bedienpräferenzen.
- Weitere persistente GR-Benutzereinstellungen, auch ältere, versteckte oder derzeit inaktive Funktionen.

**Befund vs. Hypothese:**
1. **Nachgewiesen im Quellcode:** Die GR-Oberfläche verteilt Einstellungen über mehrere, teils alte Browser-\`localStorage\`-Schlüssel und HA-Konfigurationseinträge. Diverse Lese-/Schreibfehler werden still abgefangen.
2. **Plausibel, aber nicht bewiesen:** Browser-/WebView-Origin-Wechsel, anderer Browser/Profil, Storage-Bereinigung, Schlüssel-/Schemawechsel, Initialisierungsreihenfolge oder überschreibende Defaults können „Resets“ verursachen.
3. **Nicht behaupten:** Ein normales HA-Update lösche grundsätzlich \`localStorage\`; ein konkreter Release habe erwiesenermaßen Daten gelöscht; jeder gemeldete Reset habe dieselbe Ursache.

Ein gewöhnliches Integrationsupdate sollte Browser-\`localStorage\` nicht schon durch das Aktualisieren der JavaScript-Dateien löschen. Browser-Speicher ist jedoch geräte-, browser- und originabhängig, nicht HA-zentral und nicht zuverlässig synchronisiert.

**Geschäftsziel:** Nach beliebigen regulären neuen GR-Versionen muss das zuvor gültige Benutzer-Setup inhaltlich identisch wiederhergestellt werden. Auf Android, Desktop und iPad muss klar sein, welche Einstellungen gemeinsam und welche gerätespezifisch sind.

---

## 3. Bereits überprüfte Speicherstellen im aktuellen Quellcode

Die folgenden konkreten Stellen wurden auf \`deploy/dev\` bei V181 geprüft. **Dies ist ein fundierter Anfangsbestand, nicht die Behauptung eines abschließenden Vollinventars.** Der Auftrag muss vor Architekturentscheidung die übrigen Module, Version-/Helper-Schlüssel, Lovelace-Konfigurationen und die Backend-Speicherpfade systematisch vervollständigen.

| Bereich | Aktueller Schlüssel / Mechanismus | Quellcode |
|---|---|---|
| Eye / Aura / Neon / Slotfarben | \`gewitterradar:eye-bubble:v1\` | \`frontend/modules/weather/eye-hub-model.js\`, \`eye-hub.js\` |
| Winddarstellung, Snake usw. | \`gewitterradar:wind-ui:v1\` | \`frontend/modules/weather/wind-data.js\`, \`wind-display.js\` |
| Wind-Studio & eigene Presets | \`gewitterradar:wind-studio:v1\` | \`frontend/modules/weather/wind-studio-data.js\` |
| Temperaturdarstellung | \`gewitterradar:temperature-ui:v1\` | \`frontend/modules/weather/temperature-data.js\`, \`temperature-display.js\` |
| WR-Darstellungsmenü, Layer, Sichtbarkeiten, Position | \`gewitterradar:weather-display:v1\` | \`frontend/modules/weather/display-menu.js\` |
| Premium-Menüzustände / Panelpositionen | \`gewitterradar:premium-ui:v1:<scope>\` | \`frontend/modules/weather/premium-ui.js\` |
| Niederschlagslegende – UI | \`gewitterradar:weather-legend-ui:v1\` | \`frontend/modules/weather/legend-overlay.js\` |
| Niederschlagslegende – Position | \`gewitterradar:weather-legend-position:v1\` | \`frontend/modules/weather/legend-overlay.js\` |
| Kompass-/Medallionskala im Vollbild | \`gewitterradar:v41002:fullscreen-compass-scale\`, \`gewitterradar:v41002:fullscreen-medallion-scale\` | \`frontend/modules/fullscreen/map-display.js\` |
| Trendpfeil-Design | \`gewitterradar:v41002:trend-arrow-design\` | \`frontend/modules/fullscreen/map-display.js\` |
| Medallion-Design | \`gewitterradar:v41002:medallion-design\` | \`frontend/modules/fullscreen/map-display.js\` |
| Medallion-Auswahlvorschau | \`gewitterradar:v41002:medallion-picker-preview-mode\` | \`frontend/modules/fullscreen/map-display.js\` |
| Medallion-Picker Modus / Diagnose-Akkordeon | \`sessionStorage\` mit \`gewitterradar:v41002:...\` | \`frontend/modules/fullscreen/map-display.js\` |
| Kartenzentrierung/Cluster-Timeout | \`gewitterradar:v40804:cluster-jump-timeout\`, \`...finite-timeout\` u. ältere Keys | \`frontend/modules/core/card-lifecycle.js\`, \`frontend/modules/map/clusters-recent.js\` |
| Clusterauflösung | \`gewitterradar:v40822:cluster-resolution-profile\` | \`frontend/modules/ui/controls.js\`, \`frontend/modules/core/card-lifecycle.js\` |
| Referenz-Ankunftszoom | \`gr-reference-arrival-zoom\` und weitere Zoom-/Menüeinstellungen | \`frontend/modules/map/clusters-recent.js\`, \`frontend/modules/ui/controls.js\` |
| Kompassdesign | Konstante \`COMPASS_DESIGN_STORAGE_KEY\` | \`frontend/modules/instruments/compass-selector.js\` |
| Kartenpositionen / Sichtbarkeit / Startmodus | Verschiedene \`MAP_*_STORAGE_KEY\`-Konstanten und ältere \`gewitterradar:v4...\`-Keys | \`frontend/modules/core/card-lifecycle.js\`, \`frontend/modules/fullscreen/map-display.js\` |
| Menüdesign, Animationsgeschwindigkeit, Referenzzoom | lokale Schlüssel über \`menuStyleKey\`, \`speedKey\`, \`referenceZoomKey\` | \`frontend/modules/ui/controls.js\` |
| Native GR-Integrationsoptionen | **Home-Assistant Config Entry \`options\`** | \`custom_components/gewitterradar/__init__.py\`, \`const.py\`, \`config_flow.py\` |
| Unterstützte ältere HA-Helfer | **einmalige, nichtdestruktive Migration** in Config-Entry-Optionen | \`docs/MIGRATION_AND_ROLLBACK.md\`, \`tests/test_migration_fresh_install.py\` |

**Wichtige konkrete Erkenntnisse:**

- \`eye-hub.js\` lädt aus \`localStorage.getItem(EYE_HUB_KEY)\`; ein Lesefehler wird abgefangen und normalisierte Defaults werden verwendet. Die Speicherfunktion fängt Schreibfehler ohne Nutzerhinweis ab.
- Wind und Temperatur verhalten sich analog: \`readWindConfig\` / \`readTemperatureConfig\` normalisieren bei Fehlern Defaults; die Save-Methoden schlucken Fehler.
- \`display-menu.js\` lädt bei Fehlern \`null\` und normalisiert; \`_weatherDisplayPersist()\` schluckt Speicherfehler.
- \`premium-ui.js\` verwendet für beliebige Scopes \`readPremiumUi\`/\`savePremiumUi\`, ebenfalls mit stillen Fehler-Fallbacks.
- \`wind-studio-data.js\` ist bereits strenger: Presets werden validiert, Schreibfehler können ausdrücklich scheitern und gespeicherte Profile werden bei Lesefehler als nicht lesbar markiert. **Nicht ohne Schutz den Speicher neu initialisieren und später leer überschreiben.**
- Mehrere ältere Schlüssel enthalten **historische V4.xx-Segmente**, obwohl sie aktuelle Nutzerdaten enthalten. Diese dürfen bei der Migration nicht als wertlos verworfen werden.
- Der Code kennt bereits einzelne alte Schlüssel-Fallbacks, beispielsweise bei Cluster-Timeouts und Cluster-Auflösung. Solche Migrationspfade müssen vollständig inventarisiert und erhalten bleiben.
- \`sessionStorage\` dient teilweise nur kurzlebigen Picker-/Diagnosezuständen; nicht alles muss unbesehen in den zentralen Vault.
- Viele Browser-Einstellungen existieren neben **nativen HA-Config-Entry-Optionen**. Diese beiden Modelle sind verschieden und dürfen nicht gegenseitig überschrieben werden.

**Pflichtinventur im neuen Chat:** Für *jeden* persistenten Wert Schlüssel, Speicherort, Datentyp, Default, Validierung, Lese-/Schreibstelle, Updateverhalten, mögliche Legacy-Schlüssel, Zielscope, Eigentümer, Reset-Bedienung und Exportierbarkeit tabellieren. Dazu \`frontend/\`, \`dashboard/dist/\`, \`custom_components/gewitterradar/\`, die Python-/JS-Tests, Map-/Kompassmodule sowie vorhandene HA-Entitäten prüfen. \`dashboard/dist\` und das HA-Frontend sind Lieferkopien; keine divergierenden unabhängigen Speicherimplementierungen bauen.

---

## 4. Bereits vorhandene Home-Assistant-Migration nicht ersetzen

Die native HA-Integration hat schon einen eigenen, bestätigten, **nichtdestruktiven** Migrationsvertrag, dokumentiert unter:

https://github.com/TheDaimos/gewitterradar/blob/deploy/dev/docs/MIGRATION_AND_ROLLBACK.md

Dieser Vertrag beinhaltet unterstützte alte Helfer als nur lesbare Quellen, einen Importmarker, die Schonung fremder HA-Entitäten/Registries sowie Fortbestand der HA Config Entry \`options\` nach Deaktivieren/Aktivieren derselben Integration.

**Der neue GR Settings Vault ist eine zusätzliche Persistenzebene für die heute verstreuten Frontend-/Darstellungs-/Profil-Einstellungen.** Nicht den alten HA-Helfer-Migrationsvertrag durch einen pauschalen Config-Entry-Reset gefährden.

Nicht ohne triftigen Grund jede häufig geänderte UI-Schiebereglerposition direkt als HA-Config-Entry-\`options\` schreiben: Diese Daten sollen unabhängig vom klassischen HA Options Flow und dessen Reload-Verhalten verwaltet werden.

**Empfohlene Zieltechnik (zu validieren):** Ein GR-eigener, schema-versionierter Speicher über die native Home Assistant \`Store\`-API in der HA-Instanz, angebunden über dedizierte authentifizierte WebSocket-Operationen. Die bestehenden HA Config Entries bleiben die kanonische Quelle ihrer eigenen Integrationsoptionen; sie werden nicht dupliziert oder von Frontend-Defaults überschrieben.

---

## 5. Architekturziel: GR Settings Vault

### 5.1 Grundprinzip

Ein **zentraler GR Settings Vault auf dem HA-Server** wird kanonische Quelle für dauerhafte GR-Benutzerkonfigurationen. Die Browser besitzen einen lokalen, gecachten Arbeitsstand als Performancehilfe, aber nicht die einzige gültige Kopie.

Konzeptioneller Datenweg:

**GR-Benutzereingabe → validierter Frontend-State → gebündelter, bestätigter WS-Schreibvorgang → HA Settings Vault → HA-Neustart-/Upgrade-fester Speicher.**

Beim Start:

**HA Settings Vault lesen → Schema prüfen / ggf. migrieren → gültige Einstellungen hydratisieren → erst danach die jeweiligen GR-Darstellungszustände initialisieren.**

Keine kurzzeitig gerenderten Defaults, die nachträglich gespeichert werden, bevor die zentralen Werte geladen sind.

### 5.2 Zentrale technische Bausteine (Vorschlag, noch nicht implementiert)

1. **Backend:** eigener Storage-Manager innerhalb \`custom_components/gewitterradar\`, unter Verwendung der von der tatsächlich installierten HA-Version unterstützten Storage-API. Getrennt von WR und bestehenden GR Config Entries.
2. **API:** klar benannte, authentifizierte GR-WebSocket-Befehle, beispielsweise \`gewitterradar/settings/get\`, \`.../patch\`, \`.../export\` und \`.../restore\` – **vorgeschlagene Namen, keine bereits vorhandenen Endpunkte**.
3. **Frontend:** ein einheitlicher \`SettingsVaultClient\` / \`SettingsRepository\`; Module greifen nicht mehr unmittelbar und unabhängig auf beliebige Browser-Schlüssel zu.
4. **Registry:** vollständiges Schema aller persistierten GR-Bereiche mit Version, Defaults, Validierung, Scope, historischen Keys und migrationsfähiger Transformation.
5. **Synchronisation:** Revision/ETag oder äquivalente konkurrierende Versionsprüfung; atomare Änderungen je Bereich statt eines unkontrollierten Gesamtzustands.
6. **Sicherungen:** vorherige gültige Snapshots, Export/Import, Reparatur/Diagnose.
7. **Benutzeroberfläche:** Premium-tauglicher Bereich „Einstellungen sichern & wiederherstellen“ plus Speicherstatus und Importvorschau; kein ungefragtes globales Reset.

### 5.3 Schema und Versionierung

Wichtige Unterscheidung:

- **GR-Releaseversion** (z. B. 4.11.181): Programmcode.
- **Vault-Schema-Version** (z. B. 1): unabhängig von der Programmversion, mit expliziter Migration.
- **Versions-/Revision-ID pro Speicherbereich:** Synchronisations- und Konfliktschutz.
- **Geräte-/Layoutprofil-ID:** getrennte Oberfläche/Positionen.

Beispiel für ein **rein konzeptionelles** Vault-Dokument (kein endgültiges Schema):

    {
      "vaultSchema": 1,
      "revision": 42,
      "global": {
        "eye": {},
        "wind": {},
        "windStudio": {},
        "temperature": {},
        "weatherDisplay": {},
        "legends": {}
      },
      "layouts": {
        "desktop-main": {},
        "android-main": {},
        "ipad-main": {}
      },
      "metadata": {
        "lastValidatedSchema": 1,
        "lastSuccessfulWrite": "ISO-8601"
      }
    }

Dieses Beispiel ist **kein** Auftrag, alle Konfigurationsobjekte ungeprüft mit \`{}\` zu initialisieren. Es beschreibt nur die gewünschte Trennung.

**Wichtig:** Schema muss unbekannte gültige künftige Felder möglichst erhalten und gezielt nur bekannte Felder migrieren. Keine pauschale Destruktion durch \`normalize*\`, wenn ein Modul beim Update noch nicht alle neuen Eigenschaften kennt.

---

## 6. Drei getrennte Einstellungskategorien

### A. Gemeinsam / installationsweit

Als bevorzugtes gemeinsames Profil (vor finaler Entscheidung anhand Nutzerwunsch klären):

- Neon- und Wind-Animationsdesign, Farben, Benutzerprofile und Presets.
- Temperatur-Farbpaletten, Skalen, Beschriftungs-/Advektionsparameter.
- Layer-Darstellungsarten und effektive Opacity je Wetterebene.
- Weitere persönliche GR-Darstellungs-/Designpräferenzen.

Die Änderung auf Android soll anschließend auf Desktop/iPad verfügbar sein, sofern ausdrücklich derselbe gemeinsame Konfigurationsscope genutzt wird.

### B. Gerätespezifische Layouts

Separate Layoutprofile für Desktop, Android und iPad; nach Bedarf feinere Unterteilung nach Vollbild-/Nichtvollbild-Modus und Dashboard-/Karteninstanz:

- positionierbare Premium-Fenster und Kartenschalter
- Menüpositionen/-größen
- Eye-/Kompass-/Medallion-Positionen, soweit layoutabhängig
- Anordnung und minimierte/offene Zustände, sofern dauerhaft gewünscht
- viewport-/touchabhängige Platzierung

**Nicht pauschal nach Gerätetyp allein mappen:** Mehrere Browser/Desktopfenster, HA-Panels, andere Dashboards oder gleiche Geräte mit unterschiedlichen Karteninstanzen sind möglich. Für Layoutprofile eine stabile, verständliche Zuordnung vorsehen und Kollisionen vermeiden. Optional Benutzerfunktion „Layout dieses Geräts speichern/wechseln“.

### C. Flüchtig / nicht dauerhaft

Nicht jeden runtimeabhängigen Wert persistieren:

- Wetter-/Wind-/Temperatur-Kacheln und Rohdaten
- Providerfreigaben, Deadlines, WR-Freshness, API-Antworten
- Live-Metriken, Timer, Rendercache, laufende Animationen
- kurzfristige Popup-Dialoge, Diagnose-Akkordeons und ähnliche Sessionzustände ohne dauerhaften Nutzerwert
- Secrets, Auth-Tokens oder sensible fremde Appdaten

**GR entscheidet weiterhin keine meteorologische Gültigkeit; ausschließlich WR.**

---

## 7. Nichtdestruktive Erstmigration: wichtigster Teil

Der neue Vault darf nicht mit leeren/defaultkonfigurierten Werten veröffentlicht werden, die vorhandene, mühsam abgestimmte Benutzerprofile überschreiben.

### 7.1 Vorbereitender Schutz

Vor jeglicher Migration:

1. Sämtliche unterstützten alten Speicherorte inventarisieren.
2. Vorhandene Browserwerte **nur lesend** einsammeln.
3. Werte strikt validieren, aber die Rohquelle bis nach erfolgreichem Commit beibehalten.
4. Eine vollständige importierbare Originalkopie beziehungsweise ein geeignetes Recovery-Snapshot erzeugen.
5. Erst nach serverseitiger Bestätigung und Prüfsummen-/Revisionsprüfung den neuen Vault als erfolgreich initialisiert markieren.
6. **Alte \`localStorage\`-Schlüssel keinesfalls automatisch löschen.**

Ein nicht lesbarer Wert ist **nicht dasselbe wie ein leerer oder bewusst auf Default gesetzter Wert**.

### 7.2 Erster Browser / weitere Geräte

**Gefahrenfall:** Beim ersten Start verbindet sich ein leerer Browser, während die wertvolle V181-Konfiguration nur auf Android gespeichert liegt.

Daher kein „erster Client gewinnt, auch wenn leer“ und kein automatisches Leerschreiben des Vault.

Empfehlung:

- Solange noch keine bestätigte gültige Bestandskonfiguration im Vault liegt, **keinen vollständigen Default-Snapshot als kanonische Nutzerkonfiguration deklarieren**.
- Gibt es auf dem aktuellen Gerät gültige Altwerte, deren Übernahme kontrolliert anbieten beziehungsweise anhand sicherer Regeln durchführen und bestätigen.
- Hat bereits ein anderes Gerät den Vault initialisiert, darf die Altkonfiguration eines später eintreffenden Geräts nicht ungefragt den neueren Serverstand überschreiben.
- Bei abweichenden gültigen Gerätekonfigurationen: **Vergleich, Auswahl/Übernahme je Bereich und Sicherung beider Fassungen** statt blindem „last writer wins“.
- Wo bisher ein Bereich nur im lokalen Browser existiert, darf beim Umstieg kein anderer, leerer Bereich dessen Status löschen.
- Vorhandene Werte nicht ohne explizite Nutzeraktion vom gemeinsamen auf das Geräteprofil verschieben.

### 7.3 Altfelder, Semantik und Nachfolger

Schema-Migrationen müssen die **effektive sichtbare Darstellung** bewahren.

Beispiele:
- Die **V180-Transparenz-Bedienung** heißt weiterhin „Transparenz“, aber **0 % = unsichtbar, 100 % = vollständig sichtbar**. Interne gespeicherte Opacity wird **nicht** doppelt invertiert.
- Die V180-Regler **Eye–Aura-Abstand 0–30 px** und **Aura-Ringabstand 0–8 px** bleiben unabhängig und bei 0/0 in der alten Referenzgeometrie.
- Die V181-Farben **Electric Gold** und **Silver/Chrome** müssen akzeptiert werden; bisherige acht Farben bleiben identisch.
- Die V181-Energieakzente bleiben \`off/subtle/normal/strong\`; fehlende ältere Werte ergeben \`off\`, ohne andere Eigenschaften zurückzusetzen.
- Wind-Studio-Benutzerprofile und eigene benannte Presets dürfen beim Import nicht verschwinden oder doppelt angelegt werden.
- HA Config Entries mit bereits migrierten nativen Helferwerten werden nicht durch alte Browser-Defaults überschrieben.

### 7.4 Legacy-Schlüssel nie blind entfernen

Historische Schlüsselnamen mit \`v408..\`/\`v410..\` müssen als mögliche Nutzerdaten behandelt werden, nicht als temporäre Release-Caches.

Felder/Schlüssel erst dann explizit deprecaten, wenn ihre Migration getestet, eine valide Wiederherstellung vorhanden und eine bewusste Datenbereinigung separat freigegeben ist.

---

## 8. Dauerhaftigkeit, Integrität und Konkurrenzschutz

### 8.1 Schreibpfad

- Eine Änderung im UI wird sofort sichtbar, aber **„dauerhaft gespeichert“ erst nach positiver Bestätigung vom Backend** anzeigen.
- Häufige Slider-Eingaben bündeln/debouncen. Die HA-Storage-Schreibfrequenz begrenzen; bei komplexen Preset-Operationen saubere atomare Transaktionen verwenden.
- Bei WebSocket-Unterbrechung Änderungen als **pending/dirty** markieren, nicht stillschweigend als gespeichert.
- Fehlgeschlagene, verspätete oder mehrfach wiederholte Schreibvorgänge idempotent behandeln.
- Bei HA-Neustart oder Frontend-Reload zuerst letzte gültige persistierte Daten lesen.
- Server-Revisionen prüfen: zwei Geräte dürfen nicht unbemerkt denselben Abschnitt gegenseitig überschreiben.
- Bei parallelen Änderungen geeignete Bereichs-/Feldkonflikte erkennen; kein unkontrolliertes Überschreiben des gesamten Vault.

### 8.2 Lesepfad

- „Nicht vorhanden“, „vorübergehend nicht erreichbar“, „ungültig“, „inkompatibel“ und „absichtlich zurückgesetzt“ als getrennte Zustände behandeln.
- Fehler niemals durch einen stillen Default-Write heilen.
- Bei ungültigem Dokument den letzten verifizierten Snapshot anbieten; Original für Diagnose erhalten.
- Unbekannte zukünftige Schema-Versionen nicht durch Downgrade-/Altclients „normalisieren“ und überschreiben.
- Originale Primär- und Sekundärdaten bei Migrationsfehlern unverändert lassen.

### 8.3 Backup und Export/Import

- Automatisch vor Schema-Migrationen und riskanten Importen eine wiederherstellbare Snapshot-Version speichern.
- Einen kleinen definierten Verlauf der letzten gültigen Stände vorsehen (Aufbewahrung/Limits festlegen).
- Vollständiger **JSON-Export** der gewünschten GR-Konfiguration einschließlich Profile und Layouts, Schema-/Release-Metadaten und optionaler Prüfsumme.
- **JSON-Import** mit Validierung, Vorschau, Konfliktansicht, explizitem Commit und Rückrollmöglichkeit.
- Auf keinen Fall Secrets/HA-Auth-/WR-Tokens mitsichern.
- Größe, Tiefe und Anzahl eigener Presets begrenzen; manipulierte JSON-Strukturen und Prototyp-Pollution verhindern.
- Export/Import darf Browser-Download ermöglichen, muss jedoch kein externes Internet benötigen.
- Entscheiden, ob HA-Backups zusätzlich den Vault erfassen und wie die Wiederherstellung nach HA-Migration funktioniert.

---

## 9. Rechte und Sicherheitsgrenzen

Die neue HA-WebSocket-Schnittstelle ist eine dauerhafte Schreiboberfläche.

Bitte deshalb vor Implementierung explizit festlegen und testen:

- HA-Authentifizierung erforderlich.
- Leserechte, globale Schreibrechte, Änderung gerätespezifischer Profile und vollständiger Restore unterscheiden.
- Globale Import-/Resetaktionen gegebenenfalls nur für HA-Admins erlauben.
- Kein ungeprüftes Vertrauen in den vom Browser mitgesendeten Geräte-/Benutzerbezeichner.
- Keine Mutation von WeatherRouter-Konfigurationen, anderen Integrationen, HA-Registries oder fremden Config Entries.
- Nicht GR-eigene Werte nicht in den GR Vault aufnehmen.
- Keine Secrets über Diagnoseexport oder Debug-Logs veröffentlichen.
- Dedizierte Fehlercodes und nachvollziehbare Ablehnung unzulässiger Operationen.

**Noch planerisch offen:** ein installationsweit geteiltes Konfigurationsprofil, pro HA-Nutzer getrennte Profile oder eine Kombination. Dabei das vom Betreiber gewünschte gemeinsame Design über seine Geräte erhalten. Diese Entscheidung vor Schema-Festlegung treffen.

---

## 10. UX: Premium Settings Vault statt technischer Blackbox

Die Bedienung soll in das bestehende Premium-Gestaltungssystem integriert werden, aber **nicht** gleichzeitig einen großen Umbau sämtlicher Premium-Menüs auslösen.

Vorgeschlagene Funktionen:

- Status: **Gespeichert / Speichert… / Nur lokal / Verbindung unterbrochen / Konflikt / Migration erforderlich**.
- Anzeige von Speicherversion, letzter bestätigter Speicherung, Scope und Anzahl gefundener Legacy-Bereiche.
- „Einstellungen exportieren“.
- „Einstellungen importieren“ mit Vergleich.
- „Vorherigen gültigen Stand wiederherstellen“.
- „Layout dieses Geräts verwalten“.
- „Vorhandene Browsereinstellungen übernehmen“ nur mit sicherer Konfliktregel.
- Diagnose ohne sensible Werte, inklusive Fehlerhistorie und Einzelfeldstatus.
- Verschiedene Reset-Buttons eindeutig voneinander abgrenzen: „diese Darstellung“, „dieses Gerätelayout“, „gesamtes gemeinsames GR-Profil“; letzteres niemals als unabsichtliche Nebenwirkung.

**Ziel:** Im Alltag automatische und unauffällige Speicherung; sichtbare Intervention nur bei Konflikten, Fehlern oder bewusstem Import.

---

## 11. Teststrategie – verbindliche Abnahmekriterien für eine Speicherreform

### 11.1 Migrationsmatrix

Mit alten Bestandsdaten aus V177, V179, V180, V181 und vorhandenen Legacy-Schlüsseln prüfen:

1. V181 mit individuell veränderten Wind-, Temperatur-, Eye-, Niederschlags- und Layoutwerten starten.
2. Bestandsdaten lesen und Sicherung anlegen.
3. In neuen Vault migrieren.
4. GR-/HA-Version aktualisieren.
5. Frontend neu laden.
6. HA neu starten.
7. Alle effektiven Werte und sichtbaren Einstellungen mit Ausgangszustand vergleichen.
8. Mehrere weitere Updates simulieren, ohne erneut zu migrieren.
9. Rückschritt/Downgrade testen: alter Client darf neues Vault-Schema nicht zerstören.
10. Abbruch während der Migration / Disk-I/O-Fehler simulieren: letzte gültige Daten wiederherstellbar.

### 11.2 Geräte und Herkunft

- Desktop-Browser mit gültigem alten Storage.
- Android HA App/WebView mit gültigem alten Storage.
- iPad mit gültigem alten Storage.
- Leerer neuer Browser als erstes verbundendes Gerät.
- Zweiter alter Browser mit abweichenden Werten.
- Wechsel der HA-Adresse/Origin (mit und ohne erreichbare alte Browserdaten).
- Gleicher HA-Benutzer, andere Gerätekonfigurationen.
- Ggf. zwei Lovelace-Karten bzw. HA-Seiten mit derselben GR-Integration.
- Fehlende Netzwerkverbindung sowie Reconnect.
- Mehrere gleichzeitig geöffnete Tabs und parallele Änderungen.

### 11.3 Konkrete Regressionen

- **Alle zehn V181-Neonfarben**, Slotfarben, Aura-Regler, Gold/Chrome, Energieakzente, Bloom und Animationsparameter.
- **Wind-Snake**: sämtliche Einstellungen und benannten Wind-Studio-Profile, schnelle Slideränderungen, Reload, Presetwahl.
- Temperaturfarben, Grenzwerte, Advektionsoptionen, Temperaturlegende.
- Niederschlag/Wolken mit tatsächlicher **Opacity** und unverändertem sichtbaren Kartenbild.
- Premium-Fensterpositionen getrennt nach Geräten/Layout.
- Eye-/Bubble-Gesten, Menüanimation, Premium-Icons, Statusanzeige.
- Keine Änderung an Wetterdaten, WR-Verträgen, DWD/OPERA oder Radar-Handover.
- Bestehende V181- und historische V177-/V180-Referenzprüfungen weiterhin bestanden.

### 11.4 Pflichtprüfungen vor DEV-Freigabe

- Vollinventar der Speicherschlüssel und seiner Zielmigration.
- Frontend-Unit-/Browser-Tests mit simuliertem und echtem HA-Backend.
- Python-Tests für HA-Store, Auth, Schema, Fehlerpfade, Migration, Restart, Import/Export und parallele Writes.
- Echte **Update-Regression** mit vorbereiteten individualisierten Einstellungen; reiner Neustart einer frischen Installation genügt nicht.
- Öffentliche GitHub CI nur im öffentlichen Repository.
- Version und Paketparität von Dashboard und HA-Frontend.
- ZIP-Inhalte und SHA256.
- Installierbares neues DEV-Release.
- **Reale DEV-Sichtung auf VM109** und auf den betroffenen Endgeräten, sofern zugänglich; ohne reale Prüfung nur „offen“, niemals „bestanden“ melden.
- PROD VM101 nicht automatisch aktualisieren.

**Erfolgskriterium:** Nach Update von einer individualisierten V181 zu der neuen Vault-Version sind alle unterstützten Benutzerkonfigurationen nach Reload und HA-Neustart unverändert bzw. validiert migriert. Datenverlust, unbegründetes Defaulting oder unbestätigte Schreibvorgänge sind nicht akzeptabel.

---

## 12. Umsetzung in getrennten Phasen

**Phase 0 – Architektur- und Ist-Aufnahme (neuer Chat):**
- sämtliche persistente Einstellungen samt Legacy-Schlüsseln erfassen;
- genaue Ursachen-/Risikohypothesen getrennt dokumentieren;
- gewünschtes Scope-Modell festlegen;
- Speicher-/Migrationsvertrag und Testspezifikation entwerfen;
- **noch keinen Code ändern**, solange die Architektur beraten wird.

**Phase 1 – Basisschutz:**
- Versionstransparente Backups/Diagnose;
- Read-/Write-Fehler sichtbar machen;
- verhindern, dass fehlerhafte Reads als legitime Defaults zurückgeschrieben werden;
- bestehende V181-Settings schützen.

**Phase 2 – HA-Backend Settings Vault:**
- HA Store + sauber versioniertes Schema;
- Auth/WebSocket-API;
- validierte atomare Update-Operationen, Revisionen, snapshots;
- Python-Regressionen.

**Phase 3 – Frontend-Adapter und Migration:**
- zunächst zentrale gefährdete Bereiche Eye, Wind/Wind-Studio, Temperatur, Weather Display;
- anschließend Premium-Menüs, Legenden, Karten-/Kompass-/Medallion-/Legacywerte;
- Original-\`localStorage\`-Keys zunächst nur lesen/beibehalten;
- vorhandene Defaults und gemischte Gerätebestände konfliktfrei übernehmen.

**Phase 4 – Nutzerfunktionen:**
- Export/Import, Wiederherstellung, Status, Diagnosen und Geräte-/Layoutprofile;
- sorgfältig auf bestehende Premium-UI abstimmen.

**Phase 5 – Nachweis und Veröffentlichung:**
- CI, Regressionen, interaktive Testmatrix;
- neue, bisher unbenutzte GR-/HA-Versionen;
- installierbare DEV-Pakete über DRA;
- Nutzerabnahme vor einer neuen geschützten Referenz.

**Versionierungsregel:** Jede Codeänderung bekommt neue Versionsnummern. Als nächstes liegt **V4.11.182 / HA 0.25.89** nahe, aber die tatsächliche Freiheit muss vor Implementierung erneut geprüft werden. V181 darf niemals überschrieben werden. Größere Architekturänderungen können mehrere getrennte DEV-Releases rechtfertigen; keine halbfertige Migration als „vollständig updatefest“ verkaufen.

---

## 13. Abgrenzung / offene Architekturentscheidungen für die Planung

Im neuen Chat sollen diese Entscheidungen ausdrücklich begründet werden:

1. **Kanonischer Umfang:** Welche GR-Settings gehören global, benutzerspezifisch, gerätespezifisch oder bleiben nur im Browser?
2. **Profilidentität:** Wie kann ein Nutzer Desktop/Android/iPad zuverlässig auseinanderhalten, ohne beim Browserwechsel bestehende Layouts zu verlieren?
3. **Erstmigration:** Was geschieht, wenn der erste Browser leer ist, der zweite alte, wertvolle V181-Werte enthält?
4. **Konfliktregeln:** Welche Änderungen können feldweise gemerged werden, wann muss ein Konfliktdialog erscheinen?
5. **Offline-Fall:** Werden Änderungen lokal gepuffert und wie wird sicher synchronisiert, ohne älteren Stand zurückzuschreiben?
6. **Datensicherungen:** Snapshots/Rotation, Größe, Wiederherstellung und HA-Backup-Kompatibilität.
7. **Sicherheitsmodell:** HA-Rollen, mehrere HA-Nutzer, erlaubte global/geteilte Schreibvorgänge.
8. **Ladevorgang:** Wie wird UI-Hydration vor Default-Writes sichergestellt, ohne den Kartenstart unnötig zu verzögern?
9. **Legacy-/Downgrade-Schutz:** Wie bleibt das Verhalten bei Cache-/Versionsmischung und möglichem Rollback sicher?
10. **Grenze der Zusage:** HA-Server-Persistenz schützt nicht automatisch bei Löschung der HA-Installation ohne Backup. Entsprechende Sicherungsstrategie gehört zum Gesamtkonzept.

Bitte aus diesen Entscheidungen einen **technisch ausführbaren und risikoarmen Entwicklungsauftrag** machen, nicht nur eine Wunschliste.

---

## 14. Weitere Roadmap nach Settings Vault

Der Betreiber will nach Abschluss des laufenden Neon-Meilensteins und der Updatefestigkeit:

### Hoch-/Tiefdruckdarstellung

Im GR-Menü sind bereits inaktive, gespeicherte Hoch-/Tiefdruckfarben sichtbar: **Hochdruck Gold**, **Tiefdruck Violett**. Als nächste Fachfunktion sind hochwertige H-/T-Symbole, gegebenenfalls Isobaren und Druckzentren zu planen. **Daten fachlich korrekt aus geeigneten Feldern ableiten**, nicht aus optischer Interpretation der Windanimation. Diese Funktion soll von Beginn an den neuen Settings Vault nutzen.

### Premium-Menü-Feinschliff

Einheitliche hochwertige Fenster, Hi-res-Icons, Kompaktheit, Chevron-/Minimieren-Verhalten und bereits geschützte Animationen. Keine ungeplante Menü-Gesamtüberarbeitung während der Speicherarchitektur.

### GR V4.11 FINAL

Gesamte technische Regression, Daten-/UI-Abnahme auf DEV, Releasebereinigung und finale Betreiberfreigabe. Die stabile **V4.10 FINAL** ist eine getrennte Produktlinie und darf nicht versehentlich verändert werden.

---

## 15. Weitere bindende Projektregeln

- **GR ist Darstellung/Consumer; WR entscheidet Provider, Freigaben und Freshness.** Keine neue GR-eigene 900-s-Sperre.
- WeatherRouter Private-Repo und öffentliche CI strikt getrennt. Öffentliches Testmaterial nur im öffentlichen GR-Repo; keine unnötigen privaten CI-Actions.
- Diagnose-/Export2Git-Aufträge für Wetterdaten nutzen den bekannten Exportkanal **TheDaimos/Project-Log-And-Export@main**; keine erneute OPERA-Wissenschaftsprüfung.
- **DRA-Quelle:** \`TheDaimos/gewitterradar@deploy/dev\`. Nicht versehentlich Haupt-/Produktionsbranch ändern.
- **DEV HA VM109** und **PROD HA VM101** getrennt. Keine automatische Produktionseinführung.
- Keine vorgetäuschten Realtests und keine behaupteten Geräte-FPS aus bloßer Emulation.
- Jede Quellcodeänderung muss eine **neue** GR-/HA-Versionskennung und konsistente Lieferartefakte bekommen.
- Keine bereits freigegebene visuelle Referenz beschädigen. V181 explizit geschützt.
- Betreiber bevorzugt vollständige, selbstständige Umsetzungen und zielgerichtete Tests statt endloser wiederholter Analyseschleifen. Hier ist allerdings **zunächst ausdrücklich Planung** beauftragt.
- Technische Ergebnisse und Entwicklungsaufträge möglichst als Markdown im öffentlichen GR-Repo \`deploy/dev\`, mit kurzem Link in der Antwort.

---

## 16. Erwartetes Ergebnis des nächsten Chats

**Jetzt ausdrücklich Planungsphase, noch kein Entwicklungsauftrag an Codex.**

Als nächstes bitte liefern:

1. Ein belegtes, vervollständigtes **Persistenzinventar** mit Schlüsseln/Variablen, Modulen, Scopes und Migrationsrisiken.
2. Eine **begründete Zielarchitektur** (HA Store, WebSocket, Client und Backend-Vertrag), ohne WR- oder bestehende native HA-Konfiguration ungewollt zu ändern.
3. Einen **konkreten Algorithmus für mehrstufige, verlustfreie Erstmigration**, insbesondere bei mehreren Geräten und bereits vorhandenen divergierenden Konfigurationen.
4. Eine **Sicherungs-/Wiederherstellungsstrategie** und Regeln gegen stilles Defaulting.
5. Eine **End-to-End-Testmatrix** mit echten Update- und Neustarttests, Migration, Konflikten und Rollback.
6. Eine sinnvolle **Reihenfolge der Implementierung** und eine realistische Risikobewertung.
7. Danach, wenn die Planung steht, einen **vollständigen Codex-Masterprompt** zur Implementierung und Veröffentlichung eines neuen DEV-Releases.

**Entscheidungsmaßstab:** Ein GewitterRadar-Update darf die aufwendig abgestimmten persönlichen Darstellungen, Einstellungen, Presets und Fensterkonfigurationen nicht mehr ohne begründeten, nachvollziehbaren und reparierbaren Zustand ersetzen. Die bestehende V181 wird dabei in Optik, Bedienung, Leistung und Wetterdatenvertrag unverändert geschützt.

---

*Diese Datei dokumentiert nur die Chatübergabe und Architekturplanung. Kein Settings-Vault-Code wurde dadurch implementiert oder veröffentlicht.*
