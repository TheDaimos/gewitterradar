# Gewitterradar – zukünftige Funktion „Monitored Areas“

Stand: 15.09.2026

Diese Datei hält eine Funktionsidee für eine spätere Version nach Stabilisierung/Freigabe von V4.07 fest. Sie ist **kein V4.07-Blocker** und wird nicht parallel zur laufenden V4.07-Abnahme implementiert.

## Ziel

Besondere, feste Standorte sollen unabhängig vom aktuell in Gewitterradar ausgewählten Referenzstandort überwacht werden können. Wenn innerhalb eines fachlich festgelegten Nahbereichs ein Blitz registriert wird, soll Gewitterradar den Treffer dem betroffenen Standort zuordnen, optional alarmieren und als nachvollziehbares Ereignis protokollieren.

Arbeitstitel des Bereichs in der Standortauswahl: **Monitored Areas**.

## Grundprinzip: bewusste manuelle Einrichtung

Solange die Blitzortung-Integration keinen offiziell unterstützten Reconfigure-/Mehrstandort-Weg bereitstellt, soll Gewitterradar **keine fremden ConfigEntries oder `.storage`-Daten manipulieren**.

Für eine Monitored Area gilt deshalb zunächst ein bewusst manueller Einrichtungsweg:

1. Der gewünschte Standort wird vom Benutzer in Blitzortung als eigener Standort/Eintrag angelegt, sodass Blitzortung für diesen Bereich tatsächlich Live-Daten empfängt.
2. Alternativ kann – sofern von Blitzortung unterstützt – ein eigener `device_tracker` als Standortquelle verwendet werden.
3. In Home Assistant wird zusätzlich der zugehörige lokale To-do-Speicher für diese Monitored Area angelegt bzw. zugeordnet.
4. Vorschlag für die sichtbare Benennung: **derselbe Name wie der überwachte Standort**, damit Blitzortung-Standort, Gewitterradar-Monitored-Area und Ereignisprotokoll für den Benutzer eindeutig zusammengehören.
5. Erst wenn die erforderliche Blitzdatenquelle und der zugehörige lokale Protokollspeicher vorhanden und eindeutig zugeordnet sind, gilt die Monitored Area als **aktiv überwacht**.

Gewitterradar soll diesen Zustand später prüfen und verständlich anzeigen, z. B. vollständig eingerichtet / Blitzortung fehlt / Protokollspeicher fehlt / Datenquelle derzeit nicht verfügbar.

## Bedienkonzept und Gruppierung

- In der Standortauswahl einen eigenen Hauptbereich bzw. Zweig **Monitored Areas** vorsehen.
- Monitored Areas nicht zwischen normale Personen, Zonen oder Favoriten mischen, sondern optisch als eigene Gruppe führen.
- Alle überwachten Standorte dort namentlich aufführen.
- Vorhandene Orts-/Koordinatenlogik von V4.07 wiederverwenden; keine zweite Geocoding-Pipeline bauen.
- `+` zum Anlegen bzw. Verknüpfen einer weiteren Monitored Area.
- `−` zum Entfernen bzw. Deaktivieren einer Monitored Area; bestehende Ereignisprotokolle sollen dabei nicht automatisch vernichtet werden.
- Mehrere überwachte Standorte müssen unabhängig vom aktuell auf der Karte gewählten Referenzstandort bestehen bleiben.
- Ein Klick/Tap auf eine Monitored Area öffnet bevorzugt ein eigenes Detail-Popup für diesen Standort; eine separate Aktion im Popup darf den Standort zusätzlich auf der Karte fokussieren bzw. als Bezugsstandort verwenden, ohne andere überwachte Standorte zu deaktivieren.

## Symbolik in der Standortliste

Monitored Areas erhalten **kein normales Favoriten-Sternchen**.

Geplante Darstellung:

- hochwertiges **goldenes Schild** als eigenes Monitored-Area-Symbol;
- im Schild ein klar erkennbarer Blitz, vorzugsweise **rot oder blau**; beide Varianten später visuell gegen die bestehende Premium-Oberfläche testen;
- Premium-Metalloptik passend zu Gewitterradar;
- Master-Asset in Hi-Res im kanonischen Repository erhalten, Laufzeitdarstellung daraus ableiten;
- pro Monitored Area optional eine sehr kleine, feine, hochgestellte **goldene Ziffer** hinter/oberhalb des Schildes;
- diese Ziffer soll bevorzugt die Zahl der **seit dem letzten Zähler-Reset neu registrierten Ereignisse** darstellen und nicht die gesamte historische Ereigniszahl;
- die historische Gesamtzahl bleibt separat erhalten und wird im Detail-Popup angezeigt;
- die Ziffer darf den Standortnamen, Touch-Bereich oder das Schild nicht überlagern und muss auch auf Mobilgeräten lesbar bleiben;
- bei großen Zählerständen später eine kompakte Darstellung wie `99+` prüfen.

Die hochgestellte Zahl ist als Informations-/Neuheitszähler gedacht, nicht als Alarmstufe. Ein Reset dieses Zählers darf niemals historische Ereignisdaten verändern.

## Lokaler Ereignisspeicher über To-do

Die bisherige Idee, To-do ausschließlich als Standortbibliothek zu verwenden, wird erweitert: Für Monitored Areas kann eine **eigene lokale Ereignisprotokollierung** über Home Assistant Local To-do sinnvoll sein.

Dabei muss die semantische Trennung erhalten bleiben:

- normale Liste `Gewitterradar Orte` bleibt die Bibliothek gespeicherter Orte;
- Monitored-Area-Ereignisse werden nicht in diese normale Favoritenliste geschrieben;
- für die Monitored-Area-Protokollierung ist ein eigener To-do-Speicher bzw. eine eindeutig zugeordnete Liste vorzusehen;
- sichtbare Benennung möglichst identisch zum Standortnamen oder mit einem eindeutig erkennbaren Gewitterradar-Präfix, falls Home Assistant sonst Namenskonflikte erzeugt;
- die genaue technische Abbildung **eine Liste pro Monitored Area** versus **eine gemeinsame Ereignisliste mit Area-Metadaten** wird vor Implementierung anhand der Home-Assistant-To-do-API, Zählbarkeit, Exportierbarkeit und Mehrstandort-Skalierung entschieden.

### Ereigniseintrag pro Blitz

Jeder relevante, deduplizierte Blitztreffer soll als eigener nummerierter Eintrag gespeichert werden.

Mindestinformationen:

- fortlaufende Ereignisnummer;
- Datum;
- Uhrzeit;
- Name der Monitored Area;
- Entfernung des Blitzes zum Mittelpunkt bzw. definierten Referenzpunkt der Monitored Area;
- Breitengrad des Blitzes;
- Längengrad des Blitzes;
- optional später: verwendeter Überwachungsradius, Quellenkennung, Ereignis-/Blitz-ID, Datenalter und weitere von der Quelle tatsächlich bereitgestellte Metadaten.

Beispielhafte logische Darstellung eines Eintrags:

`#0042 · 14.09.2026 · 23:18:07 · Standort Musterhaus · 1,24 km`

Beschreibung/Metadaten dazu beispielsweise:

- Einschlag: `53.xxxxxx, 9.xxxxxx`
- Entfernung: `1,24 km`
- Monitored Area: `Standort Musterhaus`
- Radius: `<konfigurierter Wert>`
- Quelle: `<verfügbare Quelleninformation>`

Die genaue sichtbare Formatierung wird erst in der UI-/Implementierungsphase festgelegt.

## Zählung und Status

Da Ereignisse strukturiert protokolliert werden, soll Gewitterradar pro Monitored Area mindestens zwei getrennte Zählwerte führen können:

1. **Gesamtzahl** aller dauerhaft gespeicherten, der Area zugeordneten Ereignisse.
2. **Neu-Zähler** seit dem letzten manuellen Reset; dieser Wert ist der bevorzugte Kandidat für die kleine hochgestellte Zahl am Schild.

Der Neu-Zähler darf nicht aus gelöschten oder veränderten To-do-Einträgen improvisiert werden, sondern soll als eigener Area-Zustand bzw. über einen stabilen Reset-Zeitpunkt/Reset-Marker geführt werden. Damit bleibt der historische Datenbestand unverändert und nachvollziehbar.

Zu definieren:

- genaue Persistenz des letzten Reset-Zeitpunkts bzw. der letzten bestätigten Ereignisnummer;
- Verhalten bei Neustart/Restore;
- Verhalten bei archivierten/exportierten/gelöschten Einträgen;
- Zählung muss unabhängig vom `completed`-/`needs_action`-Status von Local To-do fachlich eindeutig bleiben;
- optional später weitere Zeitraumzähler wie letzte 24 Stunden / 7 Tage / 30 Tage.

## Area-Detail-Popup

Ein Klick/Tap auf den Namen bzw. die Zeile einer konkreten Monitored Area soll ein eigenes kompaktes **Detail-Popup** öffnen. Dieses Popup ist die zentrale Bedien- und Informationsansicht für genau diesen überwachten Standort.

Vorgesehene Inhalte:

- Name der Monitored Area;
- goldenes Schild-/Blitzsymbol passend zur Standortliste;
- aktueller Überwachungsstatus, z. B. **aktiv**, **Datenquelle nicht verfügbar**, **Blitzortung nicht zugeordnet** oder **Protokollspeicher fehlt**;
- Koordinaten der Area;
- eingestellter Überwachungsradius;
- zugeordnete Blitzortung-/Tracker-Quelle;
- historische Gesamtzahl protokollierter Ereignisse;
- Anzahl neuer Ereignisse seit dem letzten Zähler-Reset;
- Zeitpunkt des letzten registrierten Ereignisses;
- Entfernung des zuletzt registrierten Blitzes;
- optional später: nächster dokumentierter Blitz innerhalb eines gewählten Zeitraums bzw. bisher geringste registrierte Entfernung.

### Ereignisdarstellung im Popup

Das Popup soll eine kompakte Ansicht der Ereignisse enthalten, ohne die vollständige To-do-Liste nachbauen zu müssen.

Vorgemerkt:

- die letzten Ereignisse chronologisch anzeigen, z. B. die letzten 5 oder 10 Treffer;
- je Zeile mindestens Ereignisnummer, Datum/Uhrzeit und Entfernung;
- optional Koordinaten in einer zweiten Zeile oder aufklappbaren Detailansicht;
- Möglichkeit, von dort zur vollständigen Ereignisansicht bzw. zum Export zu wechseln;
- bei vielen Ereignissen keine endlose Liste im Popup, sondern begrenzte Vorschau plus „Alle anzeigen“/vergleichbare Aktion.

### Reset des hochgestellten Zählers

Das Popup erhält einen **Reset-Button** für den Neu-Zähler.

Verbindliche Semantik:

- Reset setzt ausschließlich den hochgestellten Neu-Zähler dieser Monitored Area auf `0`;
- **kein To-do-Ereignis wird gelöscht, abgeschlossen, umgeschrieben oder archiviert**;
- die historische Gesamtzahl bleibt unverändert;
- CSV-/PDF-Exporte enthalten weiterhin sämtliche im gewählten Zeitraum vorhandenen Ereignisse;
- neue Treffer nach dem Reset beginnen den Neu-Zähler wieder bei `1`;
- Reset soll pro Area getrennt wirken;
- Reset-Zeitpunkt bzw. bestätigte letzte Ereignisnummer muss persistent sein, damit der Zähler nach Home-Assistant-Neustart nicht ungewollt wieder hochspringt.

Für die Bedienung ist eine kurze Bestätigung sinnvoll, die ausdrücklich klarstellt: **„Zähler zurücksetzen – Ereignisse bleiben erhalten.“** Damit darf der Reset optisch nicht wie eine Löschfunktion wirken.

### Weitere Aktionen im Popup

Als spätere Zielausstattung vorgemerkt:

- Standort auf Karte anzeigen/fokussieren;
- CSV-Export;
- PDF-Export;
- Benachrichtigungen für diese Area ein-/ausschalten;
- Area bearbeiten bzw. Konfiguration anzeigen;
- vollständige Ereignisliste öffnen.

Das Popup soll sich gestalterisch in die vorhandene Premium-Oberfläche von Gewitterradar einfügen und auf Desktop, Android, iPhone/iOS, iPad und iPad Pro touch-tauglich bleiben.

## Alarmierung

- Alarm auslösen, wenn ein neues Blitzereignis den festgelegten Radius einer Monitored Area schneidet.
- Ereignisse deduplizieren, damit derselbe Blitz nicht mehrfach protokolliert oder alarmiert wird.
- Alarmtext sollte mindestens enthalten: Standortname, Zeitpunkt, Entfernung und Blitzkoordinaten.
- Später mögliche Kanäle: Home-Assistant-Benachrichtigung, Companion-App und vorhandene Benachrichtigungswege; genaue Auswahl erst in der Implementierungsphase.
- Bei mehreren Treffern in kurzer Zeit sinnvoll bündeln bzw. Eskalations-/Cooldown-Logik prüfen.
- Protokollierung und Benachrichtigung getrennt behandeln: Ein Ereignis darf auch dann dokumentiert werden, wenn Benachrichtigungen für diese Area deaktiviert sind.

## Export

Monitored Areas sollen einen eigenen **Export** erhalten.

Vorgemerkt:

### CSV

- maschinenlesbarer Export der Ereignisse;
- mindestens Ereignisnummer, Datum, Uhrzeit, Standortname, Entfernung, Breitengrad und Längengrad;
- optional Radius, Quellenkennung und weitere technisch belastbare Metadaten;
- definierte UTF-8-/Trennzeichenstrategie für deutsche und internationale Tabellenprogramme.

### PDF

- hochwertiger, menschenlesbarer Ereignisbericht;
- Gewitterradar-Logo im Kopfbereich;
- Name der Monitored Area;
- Koordinaten/Standortdaten der überwachten Area;
- verwendeter Überwachungsradius;
- Erstellungsdatum des Berichts;
- nummerierte Ereignisliste mit Datum, Uhrzeit, Entfernung und Einschlagskoordinaten;
- klare Quellen-/Haftungs-/Hinweiszeile, dass der Bericht eine von Gewitterradar erzeugte Ereignisdokumentation und **kein amtlicher oder gutachterlicher Blitznachweis** ist;
- optional später statistische Zusammenfassung, z. B. Anzahl Ereignisse, nächster dokumentierter Treffer und betrachteter Zeitraum.

Der Export soll die vorhandenen protokollierten Daten verwenden und keinen zusätzlichen Online-Dienst benötigen.

## Radius – noch zu recherchieren

Der endgültige Radius wird **nicht** aus dem Bauch heraus auf 3 km oder 5 km festgelegt.

Vor Implementierung gezielt recherchieren und dokumentieren:

1. Gibt es in Deutschland bei Versicherern, Sachverständigen, VdS, Blitzortungs-/Blitznachweis-Diensten oder einschlägigen Normen einen typischen bzw. anerkannten Entfernungsbereich für die Zuordnung eines Blitzes zu einem Schaden?
2. Sauber unterscheiden zwischen direktem Blitzeinschlag, Einschlag in unmittelbarer Nähe und Überspannung/Ferneinwirkung.
3. Mess-/Ortungsgenauigkeit der verwendeten Blitzdatenquelle berücksichtigen; keine höhere Genauigkeit suggerieren als die Datenquelle hergibt.
4. Versicherungsrelevante Dokumentation darf nicht als rechtsverbindlicher Schadennachweis beworben werden, solange dies nicht fachlich und rechtlich belegt ist.
5. VDE-Gewitterwarnabstände für Personenschutz sind ein anderes Anwendungsziel und dürfen nicht mit einem schadensbezogenen Nahbereich verwechselt werden.

Vorläufige Recherche am 14.09.2026: Für allgemeine Gewitterwarnung/Personenschutz empfiehlt der VDE ein Alarmierungsgebiet von mindestens 10 km; dies ist **kein Versicherungsradius für einen Blitzschaden**. In den bislang geprüften GDV-/VdS-Quellen wurde kein pauschaler 3-km- oder 5-km-Radius gefunden, den Versicherer allgemein als Schadenzuordnung akzeptieren. Daher bleibt die Radiusfrage offen und wird vor Implementierung vertieft.

## Datenarchitektur – wichtiger Punkt

Die aktuelle Blitzortung-Integration arbeitet regionsbezogen. Deshalb darf nicht angenommen werden, dass eine einzige aktuell auf den Kartenstandort abonnierte Blitzortung-Quelle gleichzeitig beliebig weit entfernte Monitored Areas zuverlässig überwacht.

Die bevorzugte Zwischenarchitektur lautet deshalb:

- interessierte Benutzer legen die benötigten überwachten Standorte in Blitzortung zunächst selbst an;
- alternativ werden unterstützte dedizierte Tracker verwendet;
- Gewitterradar erkennt und verknüpft die bereits vorhandenen Datenquellen, anstatt Blitzortung intern umzuprogrammieren;
- pro Area muss eindeutig feststehen, welche Blitzortung-Quelle sie tatsächlich versorgt;
- fehlt diese Quelle oder ist sie nicht aktiv, darf Gewitterradar die Area nicht als vollständig überwacht darstellen.

Vor Implementierung zusätzlich klären:

- nahe Monitored Areas innerhalb derselben Blitzortung-Datenregion;
- mehrere Blitzortung-Einträge/Subscriptions für weit entfernte überwachte Standorte;
- Erkennung, welche Blitzentitäten zu welcher Blitzortung-Instanz/Area gehören;
- Verhalten bei überlappenden Überwachungsradien: ein Blitz kann fachlich mehreren Areas zugeordnet und dort jeweils einmal protokolliert werden;
- alternativ spätere Nutzung einer geeigneten globalen Blitzdatenquelle, falls dies technisch, lizenzrechtlich und datenschutzseitig sinnvoll ist;
- Zusammenspiel mit dem separat geplanten globalen Gewitter-Lagebild, ohne den Referenztracker zyklisch durch Regionen zu verschieben.

## Fehler- und Integritätsregeln

- Kein Ereignis protokollieren, wenn die zugrunde liegende Blitzdatenquelle nicht eindeutig der Monitored Area zugeordnet werden kann.
- Keine stillschweigende Annahme, dass ein auf der Karte sichtbarer Blitz automatisch aus der für diese Area vorgesehenen Subscription stammt.
- Ereignisse über verfügbare Ereignis-ID bzw. ersatzweise einen belastbaren Schlüssel aus Zeit/Koordinaten/Quelle deduplizieren.
- Uhrzeiten intern eindeutig speichern; Anzeige lokalisiert in der Home-Assistant-/Gewitterradar-Zeitzone.
- Exportdaten dürfen nicht nachträglich scheinpräziser dargestellt werden als die ursprüngliche Blitzquelle.
- Änderungen am Standortnamen müssen die historische Zuordnung alter Ereignisse nachvollziehbar lassen; intern deshalb eine stabile Area-ID zusätzlich zum sichtbaren Namen vorsehen.
- Neu-Zähler und historische Gesamtzahl strikt trennen; ein Zähler-Reset darf keine Ereignisdaten verändern.

## Abgrenzung

Diese Funktion ist keine allgemeine Gewitterwarnung und ersetzt keinen amtlichen Warndienst. Sie ist eine standortbezogene Blitz-Näheerkennung und Ereignisdokumentation auf Basis der verfügbaren Blitzdaten.

Ein Gewitterradar-PDF oder CSV darf nicht als „Beweis eines direkten Einschlags“ oder als amtlicher/versicherungsrechtlich verbindlicher Nachweis bezeichnet werden. Der Export dokumentiert, welche Blitzereignisse Gewitterradar anhand der verwendeten Quelle, des konfigurierten Standorts und des definierten Radius registriert hat.

## Noch offene Architekturentscheidungen vor einer späteren Umsetzung

- eine Local-To-do-Liste pro Area oder eine gemeinsame Monitored-Areas-Ereignisliste;
- genaue Verknüpfung zwischen Blitzortung-Instanz, Monitored Area und To-do-Speicher;
- technische Persistenz von historischem Gesamtzähler, Neu-Zähler und Reset-Marker;
- fachlich sinnvoller Überwachungsradius bzw. mehrere Radien/Kategorien;
- roter oder blauer Blitz im goldenen Schild;
- genaue Informationsdichte und Ereignisvorschau des Detail-Popups;
- CSV- und PDF-Schema;
- Aufbewahrung, Archivierung und Löschung alter Ereignisse;
- Verhalten bei Umbenennen oder Entfernen einer Monitored Area;
- Benachrichtigungs-/Cooldown-Regeln;
- spätere offizielle Blitzortung-Upstream-Unterstützung als Ersatz für manuelle Einrichtung.