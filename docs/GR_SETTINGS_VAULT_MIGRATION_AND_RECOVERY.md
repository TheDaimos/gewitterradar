# Settings Vault · Migration und Wiederherstellung

## Umstieg von V181

1. HA DEV über den DRA-Kanal `TheDaimos/gewitterradar@deploy/dev` auf GR 4.11.185 DEV / HA 0.25.92 aktualisieren und Home Assistant neu starten.
2. Gewitterradar auf dem Gerät öffnen, auf dem die bisherigen Werte noch sichtbar sind. Unter **Bisherige Browsereinstellungen → Übernahme prüfen** zeigt die Vorschau lesbare Bereiche und Einträge mit Fehlern.
3. Bei Bedarf **Lokale Originaldaten exportieren** verwenden. Der lokale Export enthält die Rohwerte der registrierten V181-Keys. Die alten Einstellungen waren an den Browser-Origin gebunden. Übernimm nur den Bestand, der diesem HA-Konto zugeordnet werden soll.
4. **Browsereinstellungen übernehmen** wählen, den Gerätenamen eingeben und **Profil erstellen** bestätigen. Der Server legt ein eigenes Profil an, bewahrt vollständige validierte Originale, erstellt einen Snapshot und bestätigt erst nach dem Store-Readback. Der Browser bindet das Profil nach einer weiteren Abfrage seiner ID und Revision. Ein wiederholter Versuch mit derselben Request-ID erhält dasselbe Profil.
5. Die Übernahme bei weiteren Geräten mit eigenen alten Werten wiederholen. Geräte ohne Altbestand können mit Standardeinstellungen starten. Die vorhandenen Profile bleiben auswählbar.

Bei teilweise ungültigen JSON-Objekten bleiben validierbare Felder und Presets erhalten. Beschädigte Rohdaten und unbekannte Felder bleiben im bisherigen lokalen Speicher und im lokalen Recovery-Export. Der Server speichert die validierten Originale sowie die Liste der Bereiche, die nur teilweise oder gar nicht übernommen werden konnten. Bei einem vollständig unlesbaren Bestand bleibt die Übernahme gesperrt. Ein unbekanntes Vault-Schema sperrt den Schreibpfad.

V177–V181 verwenden dieselben Hauptkeys. Die bisherigen Normalisierer bleiben wirksam, etwa für alte Eye-Farbaliases, das bei fehlendem Feld deaktivierte `energyAccents`, Wind-Schema 1 und beide Cluster-Fallbacks. Opacity ist weiterhin ein Anteil von 0 bis 1. Die Anzeige „Transparenz“ verwendet 0 % für unsichtbar und 100 % für sichtbar. Eye–Aura-Abstand und Aura-Ringabstand bleiben zwei separate Werte.

Seit V183 werden auch ältere als Text gespeicherte Karten-Sichtbarkeiten wie `false` und der Zeitstempel einer geänderten Medaillon-Augenreferenz übernommen. Wenn V182 solche Werte in einem Migrationshinweis gemeldet hat, kann der weiterhin vorhandene Browserbestand über **Erweitert → Browsereinstellungen erneut als Profil übernehmen** in ein neues Profil kopiert werden. Das vorhandene Profil bleibt auswählbar.

## Wieder zuordnen, sichern, zurücksetzen

- Unter **Vorhandenes Profil verwenden** ein Profil wählen. **Als eigenes Profil kopieren** erzeugt einen unabhängigen Stand und fragt nach einem Namen. Wenn der Browser seine Zuordnung verloren hat, **Dieses Profil zuordnen** wählen. Damit wird dieselbe Profil-ID wiederverwendet. **Mit Standardeinstellungen starten** fragt ebenfalls erst nach der Auswahl nach einem Profilnamen.
- Meldet die Startansicht einen Verbindungsfehler, **Erneut verbinden** wählen. **Karte mit lokalen Einstellungen öffnen** zeigt die alten Browserwerte schreibgeschützt an. Über **Userprofile & Sicherungen → Mit dem Profildienst verbinden** lässt sich die reguläre Einrichtung erneut starten.
- **Userprofile & Sicherungen → Sichern & Wiederherstellen** exportiert eigene Profile als JSON. Die Importvorschau überprüft die Datei und zeigt die betroffenen Einstellungsbereiche. Der Import kann ein eigenes Profil erzeugen oder einen aktuellen Stand mit Snapshot ersetzen.
- **Gültige Sicherungsstände anzeigen** zeigt die letzten bestätigten Revisionen. Die Wiederherstellung sichert den gegenwärtigen Stand und lädt das wiederhergestellte Profil neu.
- Bei beschädigtem Hauptspeicher zeigt GR einen geprüften vorherigen Stand schreibgeschützt an. Diesen Stand exportieren, bevor ein HA-Backup wiederhergestellt wird. Home Assistant verwaltet defekte Store-Dateien und bewahrt bei JSON-Korruption eine Kopie für die Diagnose. Keine manuellen Änderungen in `.storage` vornehmen.
- Ein Rollback auf das unveränderte V181-Release liest weiterhin die alten lokalen Einstellungen. Die nach dem Upgrade vorgenommenen Vault-Änderungen liegen auf HA und werden bei Rückkehr auf eine kompatible Vault-Version wieder verfügbar. Bei Verlust der gesamten HA-Installation sind ein HA-Backup mit Konfigurationsdaten oder die JSON-Exporte erforderlich.

## Betreiberabnahme auf Android

**OFFEN** · Installation und Betreiberprüfung auf DEV VM109 mit der echten Android Companion App.

1. V185 auf VM109 installieren. GewitterRadar auf einem noch ungebundenen Android-Client öffnen. In der Profilwahl einige Sekunden warten und prüfen, dass die Oberfläche ruhig und bedienbar bleibt.
2. **Mit Standardeinstellungen starten** antippen. Unter **Neues Geräteprofil** muss „Dieses Gerät“ sichtbar sein, während die Tastatur geschlossen bleibt. Das Namensfeld antippen, die vollständige Markierung prüfen und einen individuellen Namen tippen. Die Eingabe soll die Vorlage ersetzen. Den Cursor versetzen, einen Tippfehler korrigieren und den Namensschritt über **Zurück** erneut öffnen. Der Entwurf soll erhalten bleiben.
3. **Profilnamen löschen** antippen. Das Feld soll leer und direkt wieder beschreibbar sein. Einen gültigen Namen eingeben und erst dann **Profil erstellen** antippen. Die Karte muss öffnen. Die App schließen und erneut öffnen. Das zugeordnete Profil muss automatisch starten.
4. Auf dem Client mit V181-Originalen die Schritte unter **Umstieg von V181** ausführen. Wurde dort in Schritt 3 ein Standardprofil angelegt, sind die Originale weiterhin im Browser vorhanden. In diesem Fall **Userprofile & Sicherungen → Erweitert → Browsereinstellungen erneut als Profil übernehmen** nutzen. Gruppierte Eye-Icons, Snake-Wind, Temperatur-Farbfläche und Beschriftung, Niederschlagstransparenz sowie die Windfensterposition mit den V181-Einstellungen vergleichen. Unter **Userprofile & Sicherungen** auf **Gespeichert** warten.
5. In derselben App **Einstellungen → Companion App → Problemlösungen → Frontend-Cache löschen** ausführen und GR erneut öffnen. Erscheint die Profilwahl, dasselbe individuelle Profil auswählen und **Dieses Profil zuordnen** antippen. Flackerfreiheit, Touchbedienung, Kartenstart und die Darstellungswerte prüfen.
6. HA DEV neu starten und erneut vergleichen. Bei einem zweiten Gerät dasselbe Konto verwenden, ein eigenes Profil anlegen und dessen Einstellungen ändern. Das individuelle Android-Profil erneut öffnen und die Darstellungswerte abgleichen.
