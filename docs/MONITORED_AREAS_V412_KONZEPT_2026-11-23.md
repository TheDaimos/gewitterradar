# GewitterRadar V4.12 — Monitored Areas
## Verbindliches Fachkonzept und Entscheidungssammlung

**Stand:** 23.11.2026 · **Status:** beschlossenes Konzept, nicht implementiert oder freigegeben zum Release  
**Repository / Zielbranch:** `TheDaimos/gewitterradar` / `deploy/dev`  
**Schutz:** GewitterRadar 4.11 FINAL, WeatherRouter 1.0.2 FINAL, bestehende Ortssuche, Kartenflug, Eye Hub und parallel laufende Legendenentwicklung bleiben unverändert. Implementierung erst separat freigeben, auf HA DEV VM109 real testen; PROD VM101 schützen.

### Verbindliche Referenzen
- Ursprüngliches vollständiges Fenster **„Standortdetails – Havanna“**, Grafik `V4_11_Monitored_Area_UI_Referenz_Havanna.png` vom 29.09.2026, ChatGPT Library `/Gewitterradar/V4.11/V4_11_Monitored_Area_UI_Referenz_Havanna.png`. Dies ist eine möglichst **1:1** umzusetzende Designreferenz, nicht bloße Inspiration. Das Bild selbst ist bislang als Library-Datei verifiziert, **nicht** als Datei dieses Repositories.
- Bisherige Planungsbasis `docs/V4_12_TODO.md`, Abschnitt 6; ältere Standort-/Blitzortung-Verträge `docs/V4_07_LOCATION_COUPLING_DECISIONS.md`, `docs/V4_07_BLITZORTUNG_TRACKER_SETUP.md`.
- Dieses Dokument schreibt die ergänzenden und teils geänderten Nutzerentscheidungen aus der Planung vom 23.11.2026 zusammen. Bei Abweichung zu alten offenen To-dos gilt die neuere ausdrückliche Entscheidung.

## 1. Ziel und Abgrenzung
- Gespeicherte Orte werden optional zu **Monitored Areas**: dauerhaft überwachte geografische Standorte für Blitzereignisse, Protokollierung, nachträgliche Schadensanalyse und Push-Nachrichten.
- Keine Behauptung einer Wetterprognose, amtlicher Blitznachweise oder meteorologischer **Entwarnung**. Fehlende Meldungen bedeuten nicht nachgewiesene Gewitterfreiheit.
- Jeder Blitz als Einzelmessung im jeweiligen betroffenen Standortprotokoll. Zusätzlich gruppierte **Ereignissitzungen** und Zeitraum-Auswertungen, niemals als Ersatz für die Rohdaten.
- Backend-seitiger Dauerbetrieb unabhängig vom geöffneten Dashboard, Browser oder der Companion-App; Wiederaufnahme nach HA-Neustart.

## 2. Eigene GewitterRadar-Datenbank, Benutzer und Freigaben
- Eine durch GewitterRadar automatisch initialisierte **eigene SQLite-Datenbank** innerhalb der nativen Home-Assistant-Integration, nicht HA-Recorder und nicht Local To-do als Primärspeicher.
- Speicherung aller Orte/Favoriten, Standortkoordinaten und -profilen, Tracker-Referenzen, Blitzdaten, Sitzungen, Quellenstatus/Datenlücken, Alarmregeln, Zuordnungen, Exportmetadaten und optionalem Änderungsprotokoll.
- Pro Standort **ein** kanonischer Datensatz mit stabiler interner Standort-ID; beliebig viele logische Zuordnungen zu HA-Benutzern/GewitterRadar-Profilen; **keine künstliche Obergrenze** der Standortanzahl. HA-Benutzer und GR-Geräteprofil sind technisch getrennte Identitäten, Berechtigungen serverseitig prüfen.
- **Gemeinsam je Standort**: Ortsname, Koordinaten, Tracker/Blitzortung-Zuordnung, Protokollradius und gemeinsame Blitzhistorie. Berechtigte verknüpfte Benutzer können gemeinsame Standortdaten editieren; Änderungen gelten für alle.
- **Individuell je Benutzerprofil**: Push-Geräte, Alarmmeldungen an/aus, kritisch an/aus, Nachrichtenmodus, Intervall der Abschlussmeldung und persönliche Anzeigeeinstellungen. Gemeinsame Blitzerfassung wird nicht pro Benutzer mehrfach gespeichert.
- Standortübersicht: Checkbox-Mehrfachauswahl zum Freigeben, Übertragen, Import/Export; zusätzliche Benutzerverknüpfungen ohne Datensatzkopie. Bei Übertragung kann bisherige Zuordnung entfernt werden.
- **Letzte Profilverknüpfung entfernen:** Darf zur endgültigen Löschung des Standortdatensatzes einschließlich Historie führen, auch wenn Blitzhistorie existiert, **nur nach expliziter Checkbox und bestätigtem Löschdialog**, mit Hinweis auf irreversible Auswirkungen und angebotenem Vorabexport. Endgültiges Löschen historischer Blitzprotokolle bleibt HA-Admins vorbehalten; deshalb Backend-Autorisierung prüfen. Kein stilles Löschen. Normale Löschsperre bei laufender Protokollierung; letzte endgültige Löschung ist ein gesondert bestätigter, autorisierter Vorgang. Keine Löschung fremder HA-Tracker oder Blitzortung-ConfigEntries.
- Standort-Infofenster über hochwertiges Hi-Res-**i**: zuletzt geändert, Profil/Benutzer, Änderung, alte/neue Werte. Schlankes Audit-Protokoll statt umfangreicher Vollversionierung.

## 3. Tracker, Standortposition und Bedienberechtigungen
- Jeder überwachte Ort kann einen eigenen dauerhaften `device_tracker.gewitterradar_monitored_<slug>` erhalten. `device_tracker.gewitterradar` bleibt der unabhängige bewegliche Karten-Referenztracker.
- Im Detailfenster: editierbarer Tracker-Anzeigename, daraus abgeleitete stabile Entity-ID-Vorschau, Namens-Kopierfunktion und Button **„Tracker erstellen“**. Nach bestätigter Erstellung zeigt Button/Status **„Tracker erstellt“** in Grün. Name/Entity/Koordinaten und Kopplungsstatus prüfen.
- Bei fehlender Admin-Berechtigung bleibt die übrige Standortkonfiguration entsprechend den jeweiligen Rechten zugänglich; **„Tracker erstellen“** ist ausgegraut mit dezentem Hinweis „HA-Administratorrechte erforderlich“. Trackername/Entity-ID bleibt kopierbar, z. B. für separate Admin-Sitzung. Die Backend-Aktion muss Berechtigung unabhängig von UI erzwingen.
- **Namenskonflikt:** Falls bereits eine gleichnamige Tracker-Entity existiert, direkt bei den Trackereinstellungen warnen: **„Der gewählte Trackername kann nicht verwendet werden, da bereits ein gleichnamiger Tracker existiert.“** Keine automatische Überschreibung/Übernahme; Nutzer wählt anderen Namen. Im Warntext **keine** zusätzliche Unterscheidung nach verwaltender Integration erforderlich.
- Standort- und Tracker-Anzeigenamen editierbar; stabile interne Standort-ID nicht von Anzeigenamen abhängig. Änderungen einer bereits gekoppelten Entity-ID erfordern sichere Kopplungsprüfung.
- Standortkoordinaten editierbar **nur solange keine Blitzereignisse** für diesen Standort gespeichert sind. Bei Historie zuerst explizit zurücksetzen (vorher Export anbieten), dann Position editierbar. Bei jedem historischen Blitz auch die **damaligen Standortkoordinaten** speichern, zusätzlich Blitzkoordinaten, Entfernung und Ereigniszeit.
- Standort- und Blitzkoordinaten einzeln kopieren (Latitude/Longitude), beide zusammen `latitude, longitude`, sowie per Copy & Paste in freigegebene Felder einfügen; hinreichende Dezimalgenauigkeit.
- **Pausieren** pro Ort unabhängig von Ortsspeicherung/Tracker; kompakter Status-Schalter mit z. B. EIN / PAUSIERT ist akzeptiert; Daten und Konfiguration bleiben erhalten. Pausierte Überwachung darf nicht als meteorologisch blitzfrei dargestellt werden.

## 4. Überwachung, Radien, Datenquellen
- Überwachungsart pro Standort auswählbar: **Blitzeinschläge**, **Gewitter im Radius xx km** (zunächst durch qualifizierte Blitzaktivität darstellbar) oder **beides**; eine echte Gewitterzellen-/Annäherungsanalyse würde zusätzliche WR-Daten und eigene Validierung benötigen. Keine unbewiesene Vorhersage.
- Protokollierungsradius **Default 10 km**, einstellbar **0–50 km**. Alarmradius wahlweise an Protokollierungsradius gekoppelt oder separat im selben Bereich 0–50 km einstellbar. Einzelne Protokoll-/Alarmfunktionen ausschließlich über ihre Schalter deaktivierbar.
- **0 km = 0 Meter Entfernung, NICHT AUS**; direkt an der Standortposition registrierte Treffer müssen erfasst werden. **Offener Implementierungsdetailpunkt:** Bei mathematisch exakt 0 m erfasst nur exakte Koordinatengleichheit; Positionierungs-/Messunsicherheit und mögliche Toleranz explizit dokumentieren und vor Implementierung fachlich entscheiden, nicht unbemerkt eine große Toleranz verwenden. Für Abstände <1 km Anzeige in Metern.
- Pro Standort optionaler Kartenschalter für Anzeige von Protokoll- und Alarmradius; unterschiedliche, benutzerwählbare Farben, die sich auch klar von den bestehenden GR-Standardradien absetzen; gleiche Farbe für beide neuen Radien verhindern; zusätzlich unterschiedliche Linienstile (durchgezogen/gestrichelt) empfohlen. Live-Vorschau beim Einstellen.
- Standardmäßige Blitzmarker/Kartenlayer reichen; keine spezielle Extra-Hervorhebung jedes Blitzes innerhalb der Radien.
- Tracker und tatsächlich aktiver Blitzdatenbereich müssen fachlich getrennt und synchronisierbar sein. Pro unabhängig beobachtetem Ort eigene Blitzortung-Kopplung/ggf. Konfigurationseintrag; mehrere weit entfernte Areas parallel, nie wechselnden Einzeltracker als Ersatz.
- **Technischer Realtest offen:** Ermöglicht die installierte Blitzortung-Integration mehrere gleichzeitige unabhängige Konfigurationseinträge/Subscriptions mit Trackern stabil, mit tragbarem MQTT-/CPU-/Speicheraufwand?
- WeatherRouter trifft die Providerentscheidung; GR verwendet nur die in WR aktivierten und **für die konkrete Ereignisart geeigneten** Datenquellen. Ein Wetterprovider ist nicht automatisch Blitz-Einzelereignisquelle; keine eigenmächtige Provideraktivierung durch GR.
- Überlappende Areas: derselbe Blitz wird **je betroffenem Standort regulär einmal** aufgenommen und in dessen eigenem CSV/PDF exportierbar. Keine standortübergreifende Duplikatwarnung.

## 5. Einzelblitze, mögliche Quell-Doppelzählungen und Historie
- Jeden empfangenen Blitz je Standort einzeln mit Zeitstempel, Ereignis-/Quell-ID (falls vorhanden), Quelle, Blitzkoordinaten, damals geltenden Standortkoordinaten, Entfernung und Gefahrenradius dokumentieren; originäre Meldungen nicht unkontrolliert löschen.
- **Mögliche Doppelzählung nur innerhalb derselben Area**, wenn z. B. Blitzortung.org und ein geeigneter WR-Provider denselben physikalischen Blitz separat melden. Keine Markierung bloß weil Haus und Garage denselben Blitz beide korrekt erfasst haben.
- **Keine starren zeitlichen oder räumlichen Grenzwerte als Nutzerbeschluss.** Vorzugsweise gemeinsame eindeutige Ereignis-ID; sonst fachlich begründeter Vergleich tatsächlicher verfügbarer Zeit-/Positionsdaten. Ohne belastbare Entsprechung keine pauschale Kennzeichnung. Potenzielle Paare verknüpfen und als **„Mögliche Doppelzählung“** markieren; Originalmeldungen behalten. Kein stilles Abziehen zweifelhafter Einträge aus der Zahl registrierter Meldungen.
- Im Export Hinweis-Spalte(n) zur möglichen Doppelzählung frei auswählbar. Abschlussbericht etwa „27 registrierte Blitzmeldungen · 1 mögliche Doppelzählung“ statt ungesicherter korrigierter Zählung.
- Separate **Ereignissitzung**: Erster qualifizierter Blitz eröffnet Sitzung, jeder weitere registrierte Blitz innerhalb relevanten Radius aktualisiert Anzahl, kürzeste Entfernung und Zeitpunkt. Einzelereignisse bleiben vollständig. Zeitraumauswertungen pro Sitzung, Tag, Woche, Monat, frei wählbarer Zeitraum und gesamte Historie; interaktive Charts, Entfernungs-Zeitachse, anklickbarer Balken/Zeitraum, Klick auf historischen Blitz springt zu dessen Koordinaten auf Karte.
- Aufbewahrung **unbegrenzt bis ausdrücklichem Reset/Löschen**; keine automatische Bereinigung. Speicherkapazität überwachen und vor großen Exporten Ressourcen prüfen.
- Protokoll-Reset nur betroffene Area, ausdrückliche Bestätigung mit Zahl der Datensätze; Reset entfernt weder Standort, Tracker, Verknüpfungen, Überwachungsstatus noch Protokollierungsschalter. Danach neue Erfassung. Löschen der letzten Verknüpfung hat separaten strengen Ablauf.
- Eigene DB als belastbarer Primärspeicher, kein Local-To-do-Ausfall als Grund für Datenverlust.

## 6. Alarmierung und Push
- **Pro Benutzerprofil und Standort konfigurierbar**: Push an/aus; dynamische Auswahl **eines oder mehrerer** tatsächlich verfügbarer HA-Benachrichtigungsgeräte; kritische Benachrichtigungen optional, abhängig von Mobilgerät/Companion-App-Rechten; Schaltflächen und Fehlerstatus ehrlich darstellen. Keine vorgegebenen Ruhezeiten.
- Wählbarer Nachrichtenmodus: **erste Blitzmeldung + optionale Abschlusszusammenfassung** (empfohlen); **jede Meldung**; oder **nur protokollieren**. Protokollierung getrennt von Alarmradius/Benachrichtigung.
- Abschluss nach **15–60 Minuten** ohne *neu registrierten* Blitz innerhalb des definierten Radius, in 5-Minuten-Schritten, **Default 15 Minuten**, je Profil/Ort einstellbar. Jeder neue Treffer beginnt das Intervall neu. Die Abschlussmeldung enthält registrierte Anzahl, kürzeste Entfernung, ersten/letzten Zeitpunkt, Radius, ggf. Quellen-/Duplikathinweis.
- **Keine meteorologische Entwarnung**, nur zeitlich begrenzter Abschluss der erfassten Blitzaktivität.
- Während bestätigter Datenunterbrechung/HA-Ausfall kein unberechtigtes „kein Blitz“ oder regulärer Abschluss. Ausfall und Wiederverfügbarkeit mit Zeitstempeln protokollieren und auf Wunsch als Status-Push melden: `Blitzortung.org – Status: ausgefallen` / `... wieder verfügbar`. Ohne Blitzmeldungen bei technisch verfügbarer Quelle **keine** Spekulation über Gewitterfreiheit.
- Laufende Sitzungen und Alarm-/Intervallzustände müssen HA-Neustart/Stromausfall überstehen. Nach Restore erfasste Lücke ausdrücklich benennen, neuen vollständig beobachteten Zeitraum abwarten und keine unbestätigte „Gutmeldung“ abgeben. Möglicher Blitzschlag/Stromausfall ist ein zentraler Anwendungsfall.
- **Bei Datenbankfehler trotzdem Push-Alarme versenden**, soweit der Event-Empfang/Pushdienst funktioniert, mit Warnhinweis, dass die Speicherung nicht gelungen ist. Test-Button für Probe-Push. Kein Deep-Link zu Blitzhistorie erforderlich.

## 7. Hintergrunddaten, HA-Entitäten und Recorder
- Pro Area eigener Schalter **„HA-Entitäten bereitstellen“**, **DEFAULT AUS** auch für neue/importierte Orte. Extra Entitäten werden nur nach ausdrücklichem Einschalten angelegt/aktiviert; bei Ausschalten **deaktiviert, nicht aus HA Entity-Registry gelöscht**. Der separat verwaltete Standort-Tracker bleibt davon unberührt; Monitoring/DB laufen unabhängig vom Entitätenschalter.
- Technische Entity-IDs englisch, nach gezieltem Präfix und Funktion geordnet, damit Wildcards funktionieren. Beispiele:
  - `sensor.gr_counter_lightning_ferienhaus`
  - `sensor.gr_location_latitude_ferienhaus`
  - `sensor.gr_location_longitude_ferienhaus`
  - `sensor.gr_lightning_last_ferienhaus`
  - `sensor.gr_lightning_distance_ferienhaus`
  - `binary_sensor.gr_lightning_active_ferienhaus`
  - `sensor.gr_monitor_status_ferienhaus`
  - `device_tracker.gewitterradar_monitored_ferienhaus` (separat)
- Tracker liefert zusätzlich native Attribute `latitude` und `longitude`. `unique_id` und interne IDs müssen stabil sein, auch bei Umbenennung.
- Nur kleine Status-/Counter-/Koordinatenwerte, **keine** wachsenden Ereignislisten/ständig wechselnden Blitzkoordinaten als HA-Attribute. Optionale Binary-Sensoren und Statusentitäten für Automationen, z. B. Licht/Rollläden, inklusive eindeutigem **Pausiert**-Status. Bei pausierter Area keine falsche Gewitterfreiheit behaupten.
- HA-Event-Bus mit schmalen ereignisbezogenen Payloads und kontrollierter Eventrate für Automationen. Event-Bus ersetzt keine Datenbank; Recorder-Wirkung von Zustands- und Eventtypen testen.
- **Recorder-Ausschluss ist freiwillig**; Live-HA-Automationen funktionieren auch bei vom Recorder ausgeschlossenen Entitäten. Kopierbarer YAML-Block über Premium-Hi-Res-i direkt neben Entitäten-Schalter und zusätzlich unter Hilfe & Hinweise:
```yaml
recorder:
  exclude:
    entity_globs:
      - sensor.gr_*
      - binary_sensor.gr_*
```
- Auf bestehende `recorder:`-Konfiguration aufmerksam machen: **ergänzen statt überschreiben**. GR darf `configuration.yaml` nicht eigenmächtig ändern. Diese Wildcards können auch andere zufällig `gr_`-benannte Entitäten treffen; vor Veröffentlichung prüfen und dokumentieren. HA Recorder-Ausschlüsse und Echtzeit-Automationen real testen.

## 8. Oberfläche / Premium-Design
- Havanna-Referenz möglichst 1:1 als Basis, zusätzliche einklappbare Bereiche für Alarme, Datenbank, Historie, Benutzer und Freigaben; Premium-Hi-Res Icons, einheitliches rundes Hi-Res-Close, 19 Sprachvarianten.
- Linke Standortübersicht bleibt erkennbare Ortssuche, plus Statusindikatoren (Ein/Pausiert/Fehler/Aktivität), Checkbox-Massenaktionen, Anzahl freigegebener Profile, Filter/Suche **auch anhand von Namens-Teilstrings**; geschützte/überwachte Orte nicht direkt in der Liste löschen.
- Detailfenster **frei verschiebbar**, keine manuelle Größenänderung; automatisch an verfügbare Höhe/Breite und Bildschirmorientierung anpassen. Nur **eine** gespeicherte Fensterposition pro Benutzerprofil für die *Detailfenster-Identität*, nicht separat pro Ort; offscreen-Position bei Layoutwechsel automatisch korrigieren.
- Chevron-Bereiche beim **ersten Öffnen geschlossen**; Zustand danach je Profil merken. Auf kleinen Displays **Akkordeon** (jeweils nur ein Bereich geöffnet).
- Einstellungen nach Änderungen **direkt speichern**, Erfolg erst nach Backend-Bestätigung signalisieren, bei Fehler gut sichtbar melden.
- Direkter Kartensprung aus Details mit besonders hochwertigem **goldenen metallischen Hi-Res-Fadenkreuz**, Tiefe/Detailgrad passend zur Premium-Iconfamilie.
- Radius-Kreise pro Standort per Darstellungs-Schalter ein-/ausblendbar, benutzerwählbare verschiedene Farben und möglichst unterschiedliche Linienarten; andere Palette als bestehende GR-Standardradien. Keine zusätzliche Sondermarkierung normaler Blitze.
- Historische Blitze anklickbar und auf Karte fokussierbar; wahlweise im Detailfenster **oder eigenem separatem Fenster** über bestehende Fensterfunktion. Grafische Zeit-/Entfernungsanalysen interaktiv.
- Info-Kopieren: Trackername/Entity-ID, Standort-Lat/Lon einzeln/gemeinsam, historische Blitzkoordinaten, Recorder-YAML.
- Im Detailfenster Abschnitt Tracker einschließlich Status, Blitzortung-Kopplung/Radius, Ereigniscounter, letzte Meldung, Datenstatus, DB-Status und Quelle. Bei Tracker-Namenskonflikt nur eindeutige Warnung, dass Name bereits vergeben und nicht nutzbar ist.

## 9. Import/Export und Migration
- CSV und PDF für Einzelblitze/Zeitraumberichte; **frei wählbare Exportspalten**, Reihenfolge und speicherbare Exportprofile; Standard-/Voll-/Benutzerdefiniert-Modus. Wahl des Zeitraums, einzelner Standort oder ausgewählte Orte; PDF mit optionaler Auswertungsübersicht, CSV mit einer Zeile pro Einzelblitz. Datenlücken als zusätzliche Informationen/Abschnitt exportierbar.
- **Mehrfach-Export und -Import als ZIP**. Innerhalb ZIP **JSON für strukturierte Standort-/Profilkonfiguration** und Metadaten, **CSV für Blitz-Rohdaten**, optional PDF für Menschen. Paket mit Manifest/Schema-Version. Import wahlweise **Blanko (ohne Ereignisse)** oder **mit Daten**; externe HA-Tracker-/Notify-Ziele auf Zielsystem prüfen, nicht blind als betriebsbereit darstellen.
- Import-Duplikate **anhand geografischer Koordinaten**, nicht Namen erkennen. Format-/Rundungsdifferenzen nur sehr eng tolerieren; keine automatische Zusammenführung nahe beieinander liegender, aber verschiedener Objekte wie Haus/Garage. Warnung mit Optionen **vorhandenen Datensatz verwenden / ausdrücklich ersetzen / überspringen**; keine stillen Überschreibungen der Historie. Stabile IDs beim Import/Merge beachten.
- **Einmaliger abbrechbarer Migrationsassistent** bei Upgrade: Local-To-do-Liste „Gewitterradar Orte“ erkennen, Orte einlesen, Namens-/Koordinaten- und Duplikatprüfung, vollständigen Import validieren und bestätigen. **Nach erfolgreich übernommener Migration alte To-do-Liste löschen**, aber nur mit sichtbarer finaler Bestätigung; bei Abbruch/Fehler nichts löschen. Während Rollout sichere transaktionale Migration/Rückfall prüfen.
- Standort-/Profilfreigaben, Transfer und ZIP-Import/Export nur für berechtigte Benutzer; gefährliche Schritte bestätigen.

## 10. Backup, Ausfall und Wiederherstellung
- Eigene Datenbank in HA-Backups einbeziehen, **Standard EIN, auswählbar** soweit HA-Backup-Modell dies ermöglicht. SQLite-konsistente Snapshots (z. B. Backup-API), keine naive Live-Dateikopie. Zusätzliche manuelle DB-Backup-/Restore-Funktion.
- DB beschädigt: deutliches erklärendes Pop-up mit Optionen **Backup wiederherstellen** oder **DB ausdrücklich zurücksetzen**, niemals automatisch zurücksetzen; möglichst vorher beschädigtes Original sichern. Rechteprüfung serverseitig.
- Speichermangel: frühzeitig warnen, große Exporte/Backups auf verfügbaren Platz prüfen, bei Schreibfehlern Protokollierung kontrolliert als nicht verfügbar markieren und keine Daten als gespeichert ausgeben. **Nicht** pauschal HA oder ganze GewitterRadar-DB deaktivieren. Soweit funktionsfähig Alarme weiterhin mit Datenbankwarnung.
- Blitzortung-/Provider-Ausfälle und Wiederverfügbarkeit mit Zeitstempeln als **Systemereignisse**, separate von Blitzereignissen, in Historie und Auswertung aufnehmen; z. B. Ausfall 12:03 – verfügbar 16:33 als Erfassungslücke. Keine fehlenden Ereignisse schätzen und keine falsche Entwarnung.
- Dauerhafte Speicherung der laufenden Ereignissitzung/letztem Blitz sowie Start/Ende der Erfassungslücken; nach HA-Neustart bewusst weiterführen, nur nach vollständig beobachtetem quiet-window abschließen.
- Manuelle Gesamt-DB-Sicherung durch HA-Benutzer gewünscht; **Restore einer gemeinsamen Datenbank ist systemweit destruktiv**, daher tatsächliche HA-Rechte inklusive erforderlicher Adminprüfung und ausdrückliche Bestätigung vor Implementierung abklären. Endgültige Einzelprotokoll-Löschung nur HA-Admin.

## 11. Verbindliche Abnahmekriterien und offene technische Validierung
1. Parallele mehrere Blitzortung-Subscriptions mit weit entfernten Trackern auf DEV real nachweisen, Kopplung, Radius, Last, Fehler und Wiederaufnahme messen.
2. Dauerbetrieb bei geschlossenem Dashboard, Browser-/Appwechsel, HA-Neustart und Stromausfallsimulation nachweisen; Ereignislücken korrekt statt falscher Gewitterfreiheit ausweisen.
3. SQLite-Persistenz, Schema-Upgrades, Backups, Restore, Integrität, Transaktionen, Platzmangel, DB-Fehler und Datenverlustschutz testen. Last-/Langzeittest ohne willkürliche Ortsgrenze.
4. Echtzeit-Automationen und HA-Event-Bus mit ausgeschlossenen Recorder-Entitäten testen; kein unkontrolliertes Recorder-/Eventvolumen. Entitäten default OFF und Deaktivierung mit stabilen unique_ids.
5. Berechtigungen bei Tracker-Erstellen, bereits vergebenen Namen, Datenfreigabe, DB-Backup/Restore, Profilzuordnung und endgültiger Löschung serverseitig prüfen.
6. Import/Export samt JSON-Schema, CSV/PDF/ZIP, konfigurierbarer Spaltenwahl, Rundungs-/Duplikatkonflikten, Einzelblitzvollständigkeit, Doppelzählungshinweisen, Migrationsabbruch und endgültiger To-do-Löschung testen.
7. UI-Referenz Havanna, Desktop/Android/iPad, kleine Displays/Akkordeon, freie Fensterposition, Karten-Fadenkreuz, Koordinaten-Kopieren und 19 Sprachen prüfen.
8. Fachlich noch festzulegen: exakte Behandlung von **0-km/0-m-Ortungsungenauigkeit**, datenabhängiger Mehrquellen-Duplikatvergleich (ausdrücklich **keine pauschalen harten Zeit-/Raumgrenzen**), Berechtigungsmodell für vollständigen DB-Restore. Alle anderen Produktentscheidungen gelten als fachlich beschlossen.

## Kurzregel
**Eine zentrale DB, ein Standortdatensatz, mehrere Profilverknüpfungen, individuelle Push-Einstellungen, pro Standort eigener Tracker, vollständige Blitz-Rohdaten, optionaler HA-Entitätenexport (default OFF), keine Recorder-Pflicht, kontrollierte Löschung und transparente Datenlücken.**
