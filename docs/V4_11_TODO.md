# Gewitterradar V4.11 – To-do-Sammlung

Stand: 29.09.2026

Status: **V4.11 in Entwicklung; V4.11.01 DEV mit erster realer WeatherRouter-Abnahme, weitere Arbeitsblöcke gemäß Übergabe**

Diese Datei bündelt die für V4.11 vorgemerkten Themen und bleibt die thematische To-do-Grundlage. Der erste Teilumfang ist in V4.11.01 DEV implementiert und real geprüft; offene Aufgaben sind weiterhin nicht pauschal freigegeben. Siehe aktuelle Arbeitsübergabe [V4_11_CHAT_HANDOFF_2026-09-30_R1_WEATHER_ENGINE_REALTEST.md](V4_11_CHAT_HANDOFF_2026-09-30_R1_WEATHER_ENGINE_REALTEST.md).

> **Verbindlicher Planungsbeschluss vom 30.09.2026:** Die hybride Weather-Engine (unabhängige Blitzortung-/WeatherRouter-Schalter, parallele Anreicherung, weitere unabhängige Blitzbeobachtungen, kontrollierte Ersatzversorgung, Provenienz, Monitored-Area-Bezug und API-/Modulgrenzen) ist in [V4_11_WEATHER_ENGINE_PLANUNGSBESCHLUSS_2026-09-30.md](V4_11_WEATHER_ENGINE_PLANUNGSBESCHLUSS_2026-09-30.md) festgehalten. Bei diesem Themenbereich ist das Beschlussdokument die maßgebliche Planungsquelle. Änderungen bleiben durch ausdrücklichen neuen Beschluss möglich; noch keine Implementierungsfreigabe.

## Leitmotiv V4.11

V4.11 konzentriert sich auf drei zusammenhängende Bereiche:

1. **WeatherRouter-Anbindung und Wetter-/Gefahreninformationen**
2. **Fehler-, Warn- und Statusmeldungen mit verständlicher Ursachenanzeige**
3. **passende Lösungshinweise sowie bessere Hilfe und Fehlerbehebung**

Zusätzlich wird die bereits vorgemerkte Idee fester Überwachungsstandorte als V4.11-Prüf- und Planungsblock aufgenommen.

---

## 1. WeatherRouter

- [ ] WeatherRouter als vorgesehene Daten- und Provider-Schicht für zusätzliche Wetterdienste und Wetterereignisse in Gewitterradar anbinden.
- [ ] klare Trennung zwischen Blitzortung-Livedaten, WeatherRouter-Daten und Karten-/Darstellungsebene beibehalten.
- [ ] Provider-, Capability-, Abdeckungs- und Ausfallzustände nachvollziehbar darstellen.
- [ ] Datenquellen, Attribution, Aktualität und eingeschränkte Verfügbarkeit in Diagnose und Hilfe sichtbar machen.
- [ ] WeatherRouter-Fehler nicht als allgemeines Gewitterradar-Problem ausgeben, sondern Quelle und betroffene Funktion benennen.

---

## 2. Zentraler Systemstatus am Einstellungs-Zahnrad

- [ ] statusabhängigen Warnindikator am Kopf beim Einstellungs-Zahnrad ergänzen.
- [ ] **kein Symbol**, wenn keine relevanten Probleme vorliegen.
- [ ] **orangefarbenes Warndreieck** für Hinweise, eingeschränkte Funktion oder Konfigurationsprobleme.
- [ ] **rotes Warndreieck** für Fehler oder echten Funktionsausfall.
- [ ] kleine Ziffer/Badge mit der Anzahl aller aktuell relevanten Warnungen und Fehler.
- [ ] Rot hat Vorrang vor Orange, die Ziffer zeigt trotzdem die Gesamtzahl.
- [ ] Tippen/Klicken öffnet ein eigenes Pop-up **„Systemstatus & Hinweise“**.
- [ ] Einträge im Pop-up kategorisch gruppieren, nicht als ungegliederte Liste.
- [ ] jeder Eintrag enthält mindestens: Status, betroffene Funktion, kurze Ursache und konkrete Handlungsempfehlung.
- [ ] Statusänderungen automatisch nachführen; behobene Zustände verschwinden ohne manuellen Neustart, soweit technisch möglich.

### Vorgesehene Kategorien

- [ ] Blitzortung & Tracker
- [ ] Standorte & Speichern
- [ ] WeatherRouter & Datenquellen
- [ ] Module & Integration
- [ ] Darstellung & Bedienung
- [ ] Installation / Update / DRA, soweit ein Produktzustand daraus ableitbar ist

---

## 3. Blitzortung- und Tracker-Diagnose

### Tracker nicht gekoppelt

- [ ] device_tracker.gewitterradar weiterhin als kanonischen beweglichen Gewitterradar-Tracker verwenden.
- [ ] installed, linked, setup_required, matching_entries und tracker_entity_id zentral auswerten.
- [ ] wenn linked: false bzw. setup_required: true, direkt sichtbare Warnung in Gewitterradar anzeigen.
- [ ] Beispieltext:
  - **„Blitzortung folgt dem gewählten Standort nicht. Datenbereich und Kartenstandort können voneinander abweichen.“**
- [ ] Lösungshinweis anbieten:
  - Blitzortung einmalig mit device_tracker.gewitterradar als Standort-Entität einrichten.

### Erfassungsradius zu klein

- [ ] aktuellen Blitzortung-Erfassungsradius aus dem tatsächlich passenden Integrationseintrag ermitteln.
- [ ] auffällig kleinen Radius als Hinweis ausgeben, insbesondere bei weit entfernten Such-/Zielorten.
- [ ] Meldung dynamisch mit realem Wert erzeugen, z. B.:
  - **„Blitzortung ist gekoppelt, der aktuelle Erfassungsradius beträgt jedoch nur 100 km. Entfernte Gewitter können außerhalb des Datenbereichs liegen.“**
- [ ] keinen festen 100-km-Wert verdrahten.
- [ ] Radius-Hinweis klar von einem echten Verbindungsfehler unterscheiden.

### Gekoppelt, aber keine Daten

- [ ] Zustand „Tracker gekoppelt, aber aktuell keine Blitzdaten“ separat erkennen.
- [ ] dabei nicht automatisch einen Fehler behaupten: mögliche Ursachen sind ruhiges Wetter, zu kleiner Radius, Datenquelle/MQTT oder Integrationsproblem.
- [ ] verfügbare Messwerte wie Counter, letzte Aktivität, Radius und Trackerzustand für die Ursachenanzeige zusammenführen.

### Falsch fest verdrahtete Sensor-IDs

- [ ] alte Annahme sensor.home_lightning_counter entfernen bzw. migrieren.
- [ ] passende Blitzortung-Sensoren dynamisch aus dem tatsächlich mit Gewitterradar gekoppelten Blitzortung-Eintrag bestimmen.
- [ ] bei mehreren Blitzortung-Einträgen den zum verwendeten Tracker gehörenden Eintrag eindeutig zuordnen.
- [ ] Statusanzeige darf nicht „Blitzortung nicht verfügbar“ melden, wenn Blitzdaten über einen anders benannten gültigen Sensor vorhanden sind.

---

## 4. Hilfe & Hinweise – Fehlerbehebung neu strukturieren

- [ ] Bereich **„Wenn etwas nicht stimmt“ / „Fehlerbehebung“** ausbauen.
- [ ] dort Kategorien statt einer langen, ungegliederten Liste verwenden.
- [ ] Tracker und Blitzortung ausführlich dokumentieren:
  - Zweck von device_tracker.gewitterradar
  - Unterschied zwischen Karten-/Bezugsstandort und aktivem Blitzdatenbereich
  - Bedeutung von linked, setup_required, matching_entries
  - einmalige Kopplung an Blitzortung
  - Verhalten des Erfassungsradius
  - typische Fehlerbilder und deren Behebung
  - Hinweis, dass ein neu angelegter Blitzortung-Eintrag wieder mit Standardradius starten kann
- [ ] neue Systemstatus-Meldungen mit passenden Hilfeabschnitten verknüpfen.
- [ ] Lösungstexte so formulieren, dass konkrete nächste Schritte erkennbar sind.

---

## 5. Standorte & Speichern – Local-To-do prüfen

- [ ] beim Öffnen bzw. Verwenden von **„Standorte & Speichern“** prüfen, ob die erwartete Local-To-do-Liste existiert und erreichbar ist.
- [ ] fehlende Liste nicht stillschweigend akzeptieren.
- [ ] wenn Speichern dadurch nicht möglich ist, klare Warnung direkt im Bereich anzeigen.
- [ ] denselben Zustand zusätzlich im zentralen Systemstatus ausgeben.
- [ ] Beispiel:
  - **„Die für gespeicherte Standorte benötigte To-do-Liste wurde nicht gefunden. Standorte können derzeit nicht gespeichert werden.“**
- [ ] passende Handlungsempfehlung anzeigen: konfigurierte Local-To-do-Liste prüfen oder neu anlegen.
- [ ] Status nach Wiederherstellung automatisch zurücknehmen.

---

## 6. Überwachte Orte / Monitored Areas

V4.11 nimmt die bereits vorhandene Roadmap-Idee **Monitored Areas** konkret in die Planungs- und Prüfphase auf.

### Bedienidee

- [ ] **Überwachen** direkt in den Ablauf **Ort suchen & speichern** integrieren, ohne jeden gespeicherten Ort automatisch zu überwachen.
- [ ] gespeicherter Ort bleibt zunächst ein normaler Favorit; Überwachung ist eine ausdrücklich aktivierbare Zusatzfunktion.
- [ ] Tippen/Klicken auf einen gespeicherten Ort öffnet ein eigenes Detail-Pop-up für diesen Ort.
- [ ] im Pop-up mindestens anzeigen:
  - Name des gespeicherten Ortes und Koordinaten;
  - Überwachungsstatus aktiv/inaktiv;
  - vorgeschlagener Tracker-Anzeigename;
  - daraus abgeleitete/stabile Tracker-Entity-ID als Vorschau;
  - ob der Tracker bereits existiert;
  - ob der Tracker gültige Koordinaten liefert;
  - ob ein passender Blitzortung-Eintrag existiert und gekoppelt ist;
  - aktueller Blitzortung-Radius und Datenstatus;
  - zugeordnete Local-To-do-Liste bzw. deren Verfügbarkeit.
- [ ] Tracker-Anzeigenamen sinnvoll aus dem Ortsnamen vorschlagen und editierbar machen.
- [ ] rohe Entity-ID nicht unkontrolliert frei eingeben lassen; stabile ID aus dem Namen ableiten, Kollisionen erkennen und die resultierende ID transparent anzeigen.
- [ ] ein gespeicherter Ort kann über das Pop-up zu einem dauerhaft überwachten Standort werden.
- [ ] der normale `device_tracker.gewitterradar` bleibt unabhängig davon der bewegliche Karten-/Suchstandort.
- [ ] überwachte Orte erhalten eigene, dauerhafte Standort-Tracker mit stabilen IDs.
- [ ] Beispielkonzept:
  - `device_tracker.gewitterradar_monitored_havanna`
  - `device_tracker.gewitterradar_monitored_tromso`
- [ ] mehrere überwachte Orte sollen parallel möglich sein.
- [ ] Überwachung eines Ortes wieder deaktivieren/entfernen können, ohne den gespeicherten Ort selbst löschen zu müssen.
- [ ] bei Deaktivierung klar zwischen „Überwachung abschalten“, „Tracker entfernen“ und „gespeicherten Ort löschen“ unterscheiden.

### Blitzortung-Anbindung

- [ ] prüfen und dokumentieren, dass pro unabhängig überwachtem Gebiet ein eigener Blitzortung-Konfigurationseintrag mit eigener Standort-Entität erforderlich ist.
- [ ] keinen einzelnen Tracker zyklisch zwischen Orten verschieben; das wäre keine echte parallele Überwachung.
- [ ] pro überwachten Ort Kopplungsstatus, Radius und Datenstatus anzeigen.
- [ ] Einrichtungsassistent bzw. verständliche Schritt-für-Schritt-Hilfe für die notwendige Blitzortung-Kopplung prüfen.

### Schutzmodell für protokollierte Orte

- [ ] aktive Protokollierung macht den gespeicherten Ort zu einem **geschützten Objekt**.
- [ ] solange **„Blitze im Gefahrenradius protokollieren“** aktiv ist, darf der Ort nicht gelöscht werden.
- [ ] die Protokollierungs-Schaltfläche dient damit gleichzeitig als bewusster Löschschutz.
- [ ] im Detail-Pop-up den Schutzstatus sichtbar anzeigen, z. B. **„Geschützt – Protokollierung aktiv“**.
- [ ] Löschaktion im Detail-Pop-up bei aktiver Protokollierung deaktivieren und den Grund direkt erklären.
- [ ] zum Löschen muss zuerst die Protokollierung deaktiviert werden; erst danach wird die Löschaktion freigegeben.
- [ ] für überwachte/protokollierbare Orte keine direkte Löschfunktion mehr in der Ortsübersicht anbieten.
- [ ] Löschen solcher Orte ausschließlich über ihr Detail-Pop-up zulassen, damit Tracker-, Blitzortung-, To-do- und Protokollstatus vor dem Löschen sichtbar sind.
- [ ] Deaktivieren der Protokollierung löscht keine vorhandenen Protokolleinträge.
- [ ] Löschen des gespeicherten Ortes darf nicht automatisch bestehende To-do-/Ereignisprotokolle entfernen.
- [ ] beim Löschen eines überwachten Ortes klar anzeigen, welche abhängigen Objekte bestehen (Tracker, Blitzortung-Kopplung, Protokollierung, To-do-Ziel) und welche davon bestehen bleiben bzw. separat entfernt werden müssen.
- [ ] keine automatische Löschung fremder Blitzortung-ConfigEntries ohne unterstützte öffentliche Schnittstelle.

### Gefahrenradius & Local-To-do-Protokoll

- [ ] pro Monitored Area optional **„Blitze im Gefahrenradius protokollieren“** aktivieren/deaktivieren.
- [ ] Gefahrenradius je überwachten Ort eindeutig anzeigen; gemeinsame globale Vorgaben nur verwenden, wenn fachlich passend.
- [ ] Ziel-To-do-Liste im Orts-Pop-up anzeigen und ihre Existenz/Funktionsfähigkeit vor Aktivierung prüfen.
- [ ] fehlende oder nicht erreichbare To-do-Liste als klaren Systemstatus-/Ortsfehler melden.
- [ ] Treffer im Gefahrenradius mit mindestens Zeitstempel, Ort/Monitored Area, Blitzkoordinaten und Entfernung dokumentieren.
- [ ] Ereignisse deduplizieren; derselbe Blitz darf innerhalb derselben Monitored Area nicht mehrfach protokolliert werden.
- [ ] bei sich überlappenden Monitored Areas festlegen, ob derselbe Blitz je betroffenem Ort jeweils einmal dokumentiert werden darf.
- [ ] Cooldown/Bündelung vorsehen, damit ein Gewitter nicht hunderte einzelne To-do-Einträge erzeugt.
- [ ] Protokollierung jederzeit deaktivierbar machen, ohne die eigentliche Standortüberwachung zwangsläufig abzuschalten.
- [ ] bestehende To-do-Einträge bei Deaktivierung oder Entfernen der Überwachung nicht automatisch löschen.
- [ ] in Hilfe & Hinweise klarstellen, dass diese Aufzeichnung eine lokale Ereignisdokumentation und kein amtlicher Blitznachweis ist.

### Protokoll-Export & Bereinigung

- [ ] im Detail-Pop-up eines überwachten Ortes einen eigenen Protokollbereich ergänzen.
- [ ] **CSV herunterladen** direkt anbieten.
- [ ] **PDF herunterladen** direkt anbieten.
- [ ] CSV mindestens mit Zeitstempel, Monitored Area, Ortsname, Blitzkoordinaten, Entfernung, Gefahrenradius und verfügbarer Ereignis-/Quelleninformation erzeugen.
- [ ] PDF als menschenlesbaren Bericht mit Orts-/Trackerbezug, Zeitraum, Gefahrenradius, Zusammenfassung und tabellarischer Ereignisliste erzeugen.
- [ ] Export klar auf den aktuell ausgewählten überwachten Ort beziehen; kein unbeabsichtigter Misch-Export mehrerer Areas.
- [ ] optionalen Zeitraumfilter für Export vorbereiten, damit später nicht zwingend immer die gesamte Historie ausgegeben werden muss.
- [ ] **„Protokoll zurücksetzen“** direkt im selben Bereich anbieten.
- [ ] Zurücksetzen löscht ausschließlich die gespeicherten Ereignis-/Protokolleinträge dieses überwachten Ortes.
- [ ] Zurücksetzen darf weder den gespeicherten Ort noch dessen Tracker, Blitzortung-Kopplung, Überwachungsstatus oder Protokollierungs-Schalter entfernen.
- [ ] Zurücksetzen als destruktive Aktion mit eindeutiger Bestätigung absichern.
- [ ] im Bestätigungsdialog die Anzahl der zu löschenden Einträge und den betroffenen Ort anzeigen.
- [ ] bei leerem Protokoll CSV/PDF/Reset sinnvoll deaktivieren bzw. mit klarer Statusmeldung versehen.
- [ ] Exporte dürfen nach Möglichkeit ohne Veränderung des gespeicherten Protokolls erzeugt werden.
- [ ] vorhandene Schutzlogik **„Protokollierung aktiv = geschütztes Objekt“** bleibt unabhängig von Export und Reset bestehen.
- [ ] nach Reset bleibt aktive Protokollierung aktiv und neue Treffer werden wieder normal aufgezeichnet.

### Laufzeitmodell – Überwachung und Protokollierung unabhängig vom Frontend

- [ ] **Überwachung** und **Protokollierung** fachlich strikt trennen:
  - Überwachung erkennt und bewertet Ereignisse für eine Monitored Area.
  - Protokollierung speichert qualifizierte Ereignisse dauerhaft für Nachvollziehbarkeit, Export und spätere Auswertung.
- [ ] die eigentliche Überwachungslogik vollständig backend-seitig in der nativen Home-Assistant-Integration ausführen.
- [ ] das Gewitterradar-Frontend darf nur Anzeige, Konfiguration, Status, Export und Reset übernehmen; ein geschlossenes Dashboard darf die Überwachung nicht stoppen.
- [ ] aktive Monitored Areas müssen weiter überwacht und protokolliert werden, wenn:
  - die Gewitterradar-Karte geschlossen ist;
  - das Dashboard nicht geöffnet ist;
  - der Browser bzw. die Companion-App Gewitterradar nicht anzeigt;
  - das Frontend neu geladen wird.
- [ ] Überwachung/Protokollierung darf nur von tatsächlich notwendigen Backend-Abhängigkeiten abhängen, insbesondere laufendem Home Assistant, verfügbarem Blitzortung-Datenstrom und funktionsfähiger Persistenz.
- [ ] Ereignisverarbeitung im Backend ausführen: Blitz empfangen → betroffene Monitored Areas bestimmen → Gefahrenradius prüfen → deduplizieren/bündeln → optional protokollieren.
- [ ] Status des Hintergrunddienstes selbst diagnostizierbar machen, damit „Frontend geschlossen“ nicht mit „Überwachung inaktiv“ verwechselt wird.
- [ ] Neustart-/Restore-Verhalten definieren: aktive Monitored Areas und Protokollierungszustände müssen nach Home-Assistant-Neustart reproduzierbar wiederhergestellt werden.
- [ ] keine flüchtige Browser-/LocalStorage-Konfiguration als alleinige Quelle für aktive Überwachungsobjekte verwenden.

### Verbindliche UI-Referenz für Monitored Areas

- [ ] die am 29.09.2026 erstellte Standortdetail-Vorlage für **„Standortdetails – Havanna“** als verbindliche V4.11-Designreferenz verwenden und bei der Umsetzung möglichst **1:1** nachbauen.
- [ ] Referenzgrafik dauerhaft archiviert als **`V4_11_Monitored_Area_UI_Referenz_Havanna.png`**.
- [ ] persistente Referenzablage: ChatGPT Library **`/Gewitterradar/V4.11/V4_11_Monitored_Area_UI_Referenz_Havanna.png`**.
- [ ] die Vorlage definiert insbesondere:
  - linke Liste **Standorte & Speichern** ohne direkte Löschaktion für geschützte/überwachte Orte;
  - Detail-Pop-up **Standortdetails – <Ort>**;
  - Bereiche Grunddaten, Tracker, Blitzortung & Kopplung, Gefahrenradius & Protokollierung, letzte Protokolleinträge, Aktionen sowie Systemstatus & Hinweise;
  - Status-Chips **Gespeichert / Überwachung aktiv / Protokollierung aktiv / Geschütztes Objekt**;
  - Trackername und Entity-ID-Vorschau;
  - Blitzortung-Kopplung, Radius, Counter, letzter Treffer und Geo-Location-Status;
  - Gefahrenradius, Ziel-To-do-Liste und lokale Ereignisvorschau;
  - CSV/PDF-Export, Protokoll-Reset sowie getrennte Deaktivierung von Überwachung und Protokollierung;
  - gesperrte Löschfunktion bei aktiver Protokollierung mit verständlicher Begründung;
  - kompakten Systemstatus des Standortobjekts.
- [ ] Abweichungen von dieser Vorlage nur bewusst und begründet vornehmen; die Grafik ist kein unverbindlicher Stimmungsentwurf, sondern die gewünschte Produktvorlage.

### Ressourcen und Grenzen

- [ ] Auswirkungen mehrerer Blitzortung-Einträge auf MQTT-Abonnements, Geo-Location-Entitäten, Speicher und Home-Assistant-Ressourcen messen.
- [ ] große Radien und viele parallele Überwachungsorte nicht kommentarlos zulassen.
- [ ] Warnschwellen bzw. Ressourcenhinweise fachlich begründen.
- [ ] Recorder-Ausschluss für geo_location weiterhin berücksichtigen und in der Hilfe erklären.
- [ ] Deduplizierung und Zuordnung von Blitzereignissen zu mehreren sich überlappenden Überwachungsgebieten entwerfen.
- [ ] spätere Benachrichtigungen pro überwachten Ort mit Cooldown/Bündelung vorsehen.

---

## 7. Fehler- und Lösungsmeldungen – Grundregeln

- [ ] keine Warnung nur aufgrund fehlender Aktivität erzeugen, wenn „kein Ereignis“ ein normaler Zustand sein kann.
- [ ] Fehler, Einschränkung und Information semantisch unterscheiden.
- [ ] Meldungen sollen möglichst die tatsächlich betroffene Quelle/Funktion nennen.
- [ ] bekannte Lösung direkt anbieten, aber keine automatische Reparatur fremder Integrationsdaten ohne unterstützte öffentliche Schnittstelle durchführen.
- [ ] keine direkte Manipulation fremder ConfigEntries oder .storage.
- [ ] Statusdiagnose für native Integration und Dashboard-Auslieferung fachlich sauber trennen, wo deren Tracker verschieden sind.
- [ ] Mehrsprachigkeit für alle neuen Meldungen, Tooltips, Hilfe- und Lösungstexte von Anfang an mitplanen.

---

## 8. Durchgängige und erkennbare Versionsanzeige (neu, verbindlich für V4.11)

Aus R40/V4.10: Die kleine Versionsplakette neben „Gewitterradar“ zeigte über viele DEV-Iterationen unverändert `V4.10.02`, da sie `CARD_DISPLAY_VERSION` verwendet, während nur `GEWITTERRADAR_BUILD`/`Rxx` und die DRA-Quellkennung fortgeschrieben wurden. Diese Mehrdeutigkeit ab V4.11 vermeiden.

- [ ] Jede tatsächlich bereitgestellte V4.11-Entwicklungsversion erhält eine eindeutige, **sichtbar fortgeschriebene** Entwicklungsversionskennung (beispielsweise `V4.11.01 DEV` → `V4.11.02 DEV`); die Versionsplakette im Hauptfenster bleibt nicht auf einer übergeordneten alten Versionsnummer stehen.
- [ ] Hauptfenster-Plakette, „Über“, Einstellungen, Release-History-Kopf, Diagnose, Modulmanifest, Buildkennung und DRA-Bereitstellung müssen aus einer kanonischen Versionsquelle stammen bzw. maschinell dagegen geprüft werden. Keine auseinanderlaufenden manuell gepflegten Werte.
- [ ] Eine neue DRA-Auslieferung muss über die sichtbare Versionskennung **und** bei Bedarf die vollständige Buildkennung eindeutig von der zuvor installierten Ausgabe unterscheidbar sein – auch nach einem Frontend-/Browser-Neuladen.
- [ ] Im Hauptfenster bleibt die Darstellung kompakt; per Klick oder Mouse-over kann die präzise Buildkennung/Commitinformation in den Versionsdetails eingesehen werden.
- [ ] DEV/TEST-Kennungen von öffentlichen Release-Versionen trennen. Ein freigegebener öffentlicher Release trägt die kurze veröffentlichte Versionsnummer (beispielsweise **V4.11**), während DEV-Stände eindeutig als nicht final gekennzeichnet sind.
- [ ] Versionsgleichlauf und Änderung pro neuem Bereitstellungskandidaten in automatisierten Vertragsprüfungen absichern, einschließlich nativer und Dashboard-Auslieferung sowie des DRA-Kanals.

**V4.10-Abschluss:** Die öffentliche Final-Version soll in der Plakette **V4.10** anzeigen, nicht dauerhaft `V4.10.02`. Der bisherige R40-Kandidat bleibt bis zur ausdrücklichen Finalfreigabe ein DEV-Stand; diese V4.11-To-do-Ergänzung löst keinen Release aus.

---

## Abgrenzung zu V4.10

Diese Punkte sind **nicht Bestandteil der V4.10-Finalisierung**. V4.10 bleibt auf seinem abgeschlossenen Modularisierungs-/UI-Stand. Neue funktionale Arbeiten aus dieser Datei beginnen erst in der V4.11-Linie nach ausdrücklicher Freigabe.
