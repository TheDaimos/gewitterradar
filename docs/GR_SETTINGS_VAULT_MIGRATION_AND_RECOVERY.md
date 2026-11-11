# Settings Vault · Migration und Wiederherstellung

## Umstieg von V181

1. HA DEV über den DRA-Kanal `TheDaimos/gewitterradar@deploy/dev` auf GR 4.11.182 DEV / HA 0.25.89 aktualisieren und Home Assistant neu starten.
2. Gewitterradar auf dem Gerät öffnen, auf dem die bisherigen Werte noch sichtbar sind. Unter **Bisherige Browsereinstellungen → Übernahme prüfen** zeigt die Vorschau lesbare Bereiche und Einträge mit Fehlern.
3. Bei Bedarf **Lokale Originaldaten exportieren** verwenden. Der lokale Export enthält die Rohwerte der registrierten V181-Keys. Die alten Einstellungen waren an den Browser-Origin gebunden. Übernimm nur den Bestand, der diesem HA-Konto zugeordnet werden soll.
4. Einen Gerätenamen wählen und **Browsereinstellungen übernehmen**. Der Server legt ein eigenes Profil an, bewahrt vollständige validierte Originale, erstellt einen Snapshot und bestätigt erst nach dem Store-Readback. Der Browser bindet das Profil nach einer weiteren Abfrage seiner ID und Revision. Ein wiederholter Versuch mit derselben Request-ID erhält dasselbe Profil.
5. Die Übernahme bei weiteren Geräten mit eigenen alten Werten wiederholen. Geräte ohne Altbestand können mit Standardeinstellungen starten. Die vorhandenen Profile bleiben auswählbar.

Bei teilweise ungültigen JSON-Objekten bleiben validierbare Felder und Presets erhalten. Beschädigte Rohdaten und unbekannte Felder bleiben im bisherigen lokalen Speicher und im lokalen Recovery-Export. Der Server speichert die validierten Originale sowie die Liste der Bereiche, die nur teilweise oder gar nicht übernommen werden konnten. Bei einem vollständig unlesbaren Bestand bleibt die Übernahme gesperrt. Ein unbekanntes Vault-Schema sperrt den Schreibpfad.

V177–V181 verwenden dieselben Hauptkeys. Die bisherigen Normalisierer bleiben wirksam, etwa für alte Eye-Farbaliases, das bei fehlendem Feld deaktivierte `energyAccents`, Wind-Schema 1 und beide Cluster-Fallbacks. Opacity ist weiterhin ein Anteil von 0 bis 1. Die Anzeige „Transparenz“ verwendet 0 % für unsichtbar und 100 % für sichtbar. Eye–Aura-Abstand und Aura-Ringabstand bleiben zwei separate Werte.

## Wieder zuordnen, sichern, zurücksetzen

- Unter **Vorhandenes Profil verwenden** ein Profil wählen. **Als eigenes Profil kopieren** erzeugt einen unabhängigen Stand. Wenn der Browser lediglich seine Zuordnung verloren hat, **Bestehende Zuordnung wiederherstellen → Dieses Profil zuordnen** wählen. Damit wird exakt dieselbe Profil-ID wiederverwendet.
- **Userprofile & Sicherungen → Sichern & Wiederherstellen** exportiert eigene Profile als JSON. Die Importvorschau überprüft die Datei und zeigt die betroffenen Einstellungsbereiche. Der Import kann ein eigenes Profil erzeugen oder einen aktuellen Stand mit Snapshot ersetzen.
- **Gültige Sicherungsstände anzeigen** zeigt die letzten bestätigten Revisionen. Die Wiederherstellung sichert den gegenwärtigen Stand und lädt das wiederhergestellte Profil neu.
- Bei beschädigtem Hauptspeicher zeigt GR einen geprüften vorherigen Stand schreibgeschützt an. Diesen Stand exportieren, bevor ein HA-Backup wiederhergestellt wird. Home Assistant verwaltet defekte Store-Dateien und bewahrt bei JSON-Korruption eine Kopie für die Diagnose. Keine manuellen Änderungen in `.storage` vornehmen.
- Ein Rollback auf das unveränderte V181-Release liest weiterhin die alten lokalen Einstellungen. Die nach dem Upgrade vorgenommenen Vault-Änderungen liegen auf HA und werden bei Rückkehr auf eine kompatible Vault-Version wieder verfügbar. Bei Verlust der gesamten HA-Installation sind ein HA-Backup mit Konfigurationsdaten oder die JSON-Exporte erforderlich.

## Betreiberabnahme auf Android

1. Auf VM109 ein individuelles Profil mit gruppierten Eye-Icons, animiertem Snake-Wind, Temperatur-Farbfläche ohne Zahlen, Regen-Opacity 27 % und verschobenem Windfenster öffnen. Unter **Userprofile & Sicherungen** den Status **Gespeichert** abwarten.
2. In der Android Companion App **Einstellungen → Companion App → Problemlösungen → Frontend-Cache löschen** ausführen und GR erneut öffnen. Keine neue GR-Version installieren.
3. Erscheint die Profilwahl, dasselbe Profil explizit zuordnen. Die fünf wirksamen Darstellungswerte vergleichen und den Status prüfen.
4. HA DEV neu starten und erneut vergleichen. Bei einem zweiten Gerät dasselbe Konto verwenden, ein eigenes Profil anlegen und sicherstellen, dass dessen Änderungen den Android-Stand nicht verändern.
