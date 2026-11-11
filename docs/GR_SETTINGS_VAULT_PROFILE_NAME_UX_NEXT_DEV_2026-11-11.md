# Codex-Auftrag – GR Settings Vault: Profilname komfortabel bearbeiten

**Projekt:** GewitterRadar Pro – powered by WeatherRouter  
**Repository/Branch:** `TheDaimos/gewitterradar@deploy/dev` (ausschließlich)  
**Ausgangspunkt:** GR V4.11.184 DEV / HA 0.25.91; Versionsfreiheit vor Änderungen erneut prüfen  
**Geschützte visuelle Referenz:** V4.11.181  
**Priorität:** UX-Nachbesserung, vor erstmaliger Betreiber-Migration

## Beobachtung (echtes Android)
Die neue Premium-Ersteinrichtung ist deutlich besser und bedienbar. Beim Weg „Mit Standardeinstellungen starten“ → „Neues Geräteprofil“ enthält das Namensfeld den Vorbelegungstext **„Dieses Gerät“**. Beim Antippen steht der Cursor mitten im Text; der Nutzer muss ihn mühsam manuell entfernen. Der Nutzer hat die Profilerstellung absichtlich **noch nicht abgeschlossen**, damit die nachfolgende Version erneut mit der Ersteinrichtung und V181-Migration abgenommen werden kann.

## Verbindliche Implementierung

1. In `frontend/modules/ui/settings-vault-setup.js` die Namenseingabe in **allen drei Erstellungswegen** (`defaults`, `copy`, `legacy`) komfortabel machen. Die vorhandene Premium-Optik und Produktkennung unverändert lassen.
2. Beim **ersten bewussten Tap/Fokus** auf das vorbelegte Namensfeld den Vorschlag komplett auswählen (`input.select()` oder `setSelectionRange` nach Fokus). Der nächste Tastendruck ersetzt den Vorschlag. Kein automatischer Fokus/kein ungefragtes Öffnen der Android-Tastatur beim Eintritt in den Schritt `name`; bestehende Fokussierung anderer Schritte und Tastaturnavigation nicht beschädigen. Programmatische Fokus- und erneute Renderereignisse dürfen nicht ständig neu auswählen.
3. Rechts im Feld ein **Touch-taugliches, zugängliches Lösch-X** in der vorhandenen Premium-Iconsprache ergänzen. `type="button"`, `aria-label="Profilnamen löschen"`, sichtbarer Fokus, brauchbare Touch-Zielfläche. X nur zeigen, wenn ein Wert vorhanden ist. Beim Löschen Eingabe leeren, Eingabefokus erhalten bzw. wiederherstellen und direkt neuen Namen eingeben lassen. Falls bereits ein passendes hochwertiges Clear-Control der GR-Standortsuche existiert, dieses Verhalten/Stil wiederverwenden.
4. **Nicht** bei jedem Fokus den bereits individuell geschriebenen Namen markieren; keine wiederholte Selektion bei Cursorbewegungen, Tippfehlerkorrektur, Zurücknavigation oder Tastaturwechsel.
5. Bei leerem/Whitespace-Namen die bisherige verständliche Validierung erhalten; keine Profile auf bloßen Fokus/Klick erzeugen.
6. Die Änderung ebenfalls in `dashboard/dist/modules/ui/settings-vault-setup.js` und `custom_components/gewitterradar/frontend/modules/ui/settings-vault-setup.js` durch den **kanonischen Frontend-Build** ausliefern; keine unabhängig divergierenden Kopien.
7. Gültige Profile, serverseitige Speicherung, bestehende V181-Browser-Originale, Vault-Hydration, Auth/WebSocket, Cache-Wiederzuordnung und geschützte Eye-/Wind-/Temperatur-/Niederschlagsdarstellungen unangetastet lassen.

## Tests und Release

- Browser-/DOM-Test: Ein erster Nutzer-Tap auf `Dieses Gerät` selektiert vollständig; eine Eingabe ersetzt den gesamten Text.
- Lösch-X leert das Feld, bleibt touch- und tastaturbedienbar und blendet sich bei leerem Feld aus.
- Individueller Text bleibt beim weiteren Editieren, Cursorpositionieren und Fokuswechsel unangetastet.
- Kein Autofokus/kein automatisches Android-Keyboard beim Öffnen des Namensschritts.
- Alle drei Namenmodi (`defaults`, `copy`, `legacy`) und Zurücknavigation prüfen.
- Bestehende Vault-Migrations-/Hydrations-/Erstclient-/Profilwahl-/UI-Tests und V177/V180-Vergleiche ausführen; Paketparität und SHA-256 prüfen.
- Neue, zuvor unbenutzte **GR- und HA-Versionsnummern** setzen; V184/V181 nicht überschreiben. Installierbare DEV-Pakete über DRA `deploy/dev` veröffentlichen, öffentliche CI im öffentlichen Repository.
- DEV VM109, echte Android-Companion-Touch- und Cachetests explizit als **OFFEN** belassen, bis der Betreiber sie durchgeführt hat. PROD VM101 nicht ändern.

## Abnahme

Auf einem bisher **nicht** im Vault angelegten Android-Gerät: „Mit Standardeinstellungen starten“ → „Neues Geräteprofil“ zeigt den vorausgefüllten Namen, aber **ohne automatisch geöffnete Tastatur**. Ein Tap markiert die Vorlage, die Eingabe ersetzt sie; das X leert sie. Erst „Profil erstellen“ erzeugt das Profil. Danach erst die vollständige V181-Migration und die echte Cachefestigkeit verproben.

**Abschlussmeldung:** Neue GR-/HA-Version, Commit, DRA-Release-Link, Prüfsummen, bestandene Tests, offene reale Betreiberabnahme – keine Behauptung eines erfolgreichen Android-Realtests ohne Beleg.
