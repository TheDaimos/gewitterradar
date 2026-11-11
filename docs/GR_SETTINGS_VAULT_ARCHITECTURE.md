# Settings Vault · Architektur

GR 4.11.182 DEV / HA 0.25.89 verwendet den Vault mit Schema 1. Dieses Schema ist unabhängig von der GR-Releaseversion. Die geschützte Vergleichsbasis ist GR 4.11.181 / HA 0.25.88, Tag `v4.11.181-dev`.

## Eigentum und Zuordnung

- Die Integration registriert die Befehle einmal pro HA-Instanz. Jeder aktive HA-Benutzer erhält einen privaten Store, dessen Schlüssel aus seiner authentifizierten User-ID abgeleitet wird. Der Handler verwendet ausschließlich `connection.user.id`. HA-Admins greifen über die Vault-API nur auf eigene Profile zu. Es gibt keine Sharing- und Löschoperation.
- Eine Profil-ID entsteht serverseitig als UUID. Ein Anzeigename ist unabhängig von der ID. Kopien erhalten neue IDs. Ein bestehendes Profil kann ausdrücklich einem weiteren Gerät zugeordnet werden. Änderungen an diesem Profil sind danach für beide Zuordnungen relevant.
- Der Browser merkt sich die Profil-ID je HA-Benutzer, HA-Origin, URL-Pfad und Kartenkennung. Das native Panel verwendet `native-panel`. Bei mehreren Karten im selben Lovelace-View setzt jede Instanz eine eigene `settings_vault_id`. Doppelte Live-Instanzen in derselben Seite erhalten ohne eindeutige Kennung keine persistente Zuordnung. Eine Zuordnung gibt keinerlei Zugriffsrechte.
- Bei Verlust des Browserzustands bleiben die Profile auf HA und sind wieder auswählbar. Der Vault benötigt keine Companion-Installations-ID und verwendet keinen Geräte-Fingerprint. Jeder WebView- oder Origin-Wechsel kann eine erneute Zuordnung erfordern.
- Die nativen Config-Entry-Optionen, Lovelace-Kartenkonfiguration, HA-Entitäten und der Local-To-do-Speicher für Orte bleiben an ihrem bisherigen Speicherort. WeatherRouter behält die Entscheidungsgewalt über Provider, Gültigkeit und Freshness.

## Start und Schreibpfad

`settings-vault.js` implementiert einen Adapter je Karteninstanz. Der Bootstrap holt das gewählte Profil und prüft Schema und Modulsatz vor Kartenkonfiguration und Rendererstart. Die registrierten Module verwenden weiterhin dieselben Normalisierer, Defaults und visuellen Werte wie V181. Ein neues Standardprofil speichert eine leere Menge von Überschreibungen. Die laufende GR-Version liefert die Defaults für bisher ungesetzte Felder. Die V181-Browserkeys werden in HA nur gelesen. Der herkömmliche Standalone-Modus ohne authentifiziertes HA-Objekt verwendet den lokalen Speicher.

Bedieneingaben aktualisieren die Ansicht direkt. Der Adapter bündelt Schreibvorgänge für 350 ms und sendet je geändertem Speicherbereich die vorherige und die gewünschte Fassung. Der Server vergleicht die Blätter der beiden Fassungen. Arrays wie Slotlisten und Wind-Studio-Presets sind atomare Felder. Disjunkte Änderungen lassen sich zusammenführen. Überlappende Änderungen liefern einen Konflikt und beide Fassungen bleiben verfügbar. Eine explizite Konfliktauflösung lädt den aktuellen Stand und übernimmt die ausgewählte Fassung. Wiederherstellung, Import über ein Profil und Kopieren in ein Profil setzen eine Revisionsgrenze für ältere Schreibvorgänge.

Bei unterbrochener Verbindung bleiben Änderungen im RAM und in einer begrenzten Warteschlange im Session-Speicher desselben Tabs. Der Client versucht die Bestätigung erneut mit derselben Request-ID. Beim Reload prüft er die ausstehende Queue erneut gegen den Server. Nach vollständigem Verlust von Session- und Browserdaten sind bereits bestätigte Änderungen auf HA vorhanden. Noch nicht bestätigte Änderungen hängen von der lokalen Queue ab. Browser-Tabs mit derselben Profil-ID können bis zur nächsten Hydration verschiedene angezeigte Stände haben. Der Server schützt beide vor stillen Überschreibungen.

## Speicherung, Grenzen und Wiederanlauf

Home Assistant `Store` speichert private, atomar geschriebene Dokumente. Pro Benutzer läuft eine Transaktion zur selben Zeit. Jeder Write erhält einen SHA-256-Prüfwert und wird über einen frischen Store zurückgelesen. Erst danach sendet der Server die Bestätigung. Ein abgebrochener WebSocket kann eine laufende Transaktion weder aufteilen noch deren Wiederholung verdoppeln. Ein zweiter Store mit Suffix `.previous` bewahrt den vorherigen verifizierten Stand. Beim ersten Commit erhält er ebenfalls eine Kopie. Bei fehlerhaftem Hauptdokument steht die geprüfte Sicherung zum Lesen und Export zur Verfügung. Bei unbekanntem höherem Schema liefert der Server einen Schemafehler.

Grenzen je Konto sind 16 Profile, 192 KiB Präferenzen je Profil, vier verifizierte Snapshots je Profil, 48 jüngste Schreibquittungen je Profil, 8 MiB je Kontodokument und 2 MiB je Import/Export. Große Konten können einzeln je Profil exportieren. Der Wind-Studio-Vertrag behält 32 eigene Presets. Lösch- und Fremddatenfelder gehören nicht zum Vertrag. Die Registry validiert numerische Bereiche, Enum-Werte, feste und begrenzte variable Objektschlüssel, Presets und Layoutkoordinaten. JSON mit doppelten Schlüsseln, `__proto__`, `prototype` oder `constructor` wird abgelehnt. Exporte enthalten nur validierte Profilwerte. Native HA-Backups mit HA-Konfiguration enthalten den Integrationsstore.

## WebSocket-Vertrag

Jede Anfrage hat `type` = `gewitterradar/settings/<operation>`, `schema` = 1, `build` = die laufende GR-Produktversion und `request` als Objekt. Der HA-WebSocket liefert Erfolg oder einen Fehler mit Code. Schreibvorgänge erwarten eine 32-stellige hexadezimale `requestId`. Gleichlautende Wiederholungen verwenden dieselbe ID.

| Operation | Anfrage | Ergebnis |
|---|---|---|
| `get` | optional `profileId` | Schema, verfügbare Keys, Profile, Recovery-Status und gewähltes Profil |
| `migration_preview` | `legacy` aus registrierten Browserkeys | verwendbare Bereiche, vollständige Originale und fehlerhafte Bereiche |
| `create` | `name`, optional `legacy` | neues Profil, ggf. Migrationshinweise |
| `patch` | `profileId`, `revision`, `changes` | bestätigtes Profil nach feldweisem Commit |
| `rename` | `profileId`, `revision`, `name` | bestätigtes Profil |
| `copy` | Quelle `profileId`, neuer `name` oder `targetId` mit Ziel-`revision`, optional `keys` | Kopie oder aktualisiertes Ziel |
| `export` | optional `profileId` | serverseitig serialisierter JSON-Text mit Integritätswert |
| `import_preview` | `text` | geprüfte Profile, Bereiche und SHA-256 |
| `import_commit` | `text`, `sha256`, `sourceId`, optional `profileId` und `revision` | neues Profil oder wiederherstellbare Ersetzung |
| `snapshots` | `profileId` | geprüfte Stände mit ID, Zeit, Revision, Hash und Liste gesicherter Legacy-Keys |
| `restore` | `profileId`, `revision`, `snapshotId` | neue Revision mit Inhalt des geprüften Snapshots |

Bei `patch` sind Werte `{before, after}` in der ursprünglichen Browser-Speicherrepräsentation. `null` bezeichnet einen fehlenden Speicherkey. JSON-Felder mit dem Wert `null` bleiben Teil des JSON-Textes. Die übrigen APIs geben das Profil als strukturierte JSON-Daten zurück. Fehlercodes sind `invalid_settings`, `settings_not_found`, `settings_conflict`, `settings_limit`, `settings_schema`, `settings_reload`, `settings_storage` und `unauthorized`. Versions- und Modulkonflikte fordern einen Reload an und sperren den Schreibpfad.

Die [HA WebSocket-Registrierung](https://developers.home-assistant.io/docs/frontend/extending/websocket-api) und [HA Store-Implementierung](https://github.com/home-assistant/core/blob/2026.9.0/homeassistant/helpers/storage.py) definieren die verwendeten Schnittstellen.
