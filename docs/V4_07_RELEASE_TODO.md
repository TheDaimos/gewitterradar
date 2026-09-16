# Gewitterradar V4.07.56 – Release-To-do

Stand: **16.09.2026 – abgenommener V4.07.56 Produkt-/Diagnosestand**  
Native Integration: **0.19.0**  
Promotion nach `main`: **noch nicht freigegeben / noch nicht ausgeführt**

Diese Datei beschreibt nur noch die tatsächlich verbleibenden Schritte bis zur öffentlichen V4.07.56-Promotion. Historische TEST-Zwischenstufen bleiben in `docs/RELEASE_NOTES_V4_07_TEST.md` und `docs/RELEASE_NOTES_V4_07_31_TEST.md` erhalten und sind keine aktuellen Einzelblocker mehr.

## Abgenommene V4.07.56-Identität

- Haupt-JavaScript: **1.955.141 Bytes**
- Frontend-SHA256: `249485f4bcf68c9b23b821cae9b507030ae09cff5a56f7e28d3d7f3b02eb4a1a`
- Locale-SHA256: `997c4fe9b357935888fdb7bedc43cdd17f105b97241a000324891cea575dd436`
- Dashboard-Paket: `app_gewitterradar_v4_07_pkg.yaml`
- Dashboard-Paket-SHA256: `1b705c5686e6a7be6dfb36717903df551d4f9f93787c39bd12bddf00aefae694`
- Finale Kandidaten-Notizen: `docs/RELEASE_NOTES_V4_07_56.md`

## Erledigte Produkt-/Regressionsblöcke

- [x] Weltweite Orts-/PLZ-Suche und direkte Koordinateneingabe abgenommen.
- [x] Länderfilter/-gruppierung, gespeicherte Orte, Soft-Delete und Wiederherstellen abgenommen.
- [x] Standortübernahme und Kartenfokussierung abgenommen.
- [x] Mehrsprachigkeit mit **15 Sprachen + 4 Dialekten = 19 Varianten** abgenommen.
- [x] „Hilfe & Hinweise“ einschließlich Standort-, Recorder- und Netzwerkhinweisen abgenommen.
- [x] V4.07.54 als gesperrter normaler UI-/Funktionsstand festgelegt.
- [x] V4.07.55 Diagnose-Mastermodus, Konsole, Childtool-Ausblenden und Hard-Stop abgenommen.
- [x] V4.07.56 virtuelle Gewitterzellen 1–5 und EXTREM über die normale Produktpipeline abgenommen.
- [x] Gruppiert/Einzelblitze im Diagnoseszenario abgenommen.
- [x] Medaillon-Zustände LEER / PFEIL / TREND / FREEZE / NORMAL abgenommen.
- [x] Diagnosevertrag und fail-closed CI-Schutz eingerichtet.
- [x] V4.07.56-Golden-/Geometrievertrag eingerichtet; historischer V4.05-Golden-Test bleibt erhalten.
- [x] Vollständige Browserkette für beide Auslieferungsformen erfolgreich durchlaufen.
- [x] HACS-Integration-Validierung erfolgreich.
- [x] Paketvertrag erfolgreich.
- [x] Hassfest erfolgreich.
- [x] Home-Assistant-2026.9.0-Laufzeittest erfolgreich.
- [x] Hi-Res-/Legacy-Aufbewahrungsregel dauerhaft dokumentiert.
- [x] Alle bekannten Hilfe-/Ortssuche-/About-Hi-Res-Master im aktuellen Repositorybestand bestätigt.
- [x] Fail-closed Hi-Res-Retentionsvertrag und CI-Gate eingerichtet.
- [x] Kanonischer Build auf beide Dashboard-Pakete erweitert; V4.07-Paket in das SHA256-Inventar aufgenommen.
- [x] PRE-MERGE-Snapshot des bisherigen `main` gemäß Promotion-Audit bereits erzeugt und außerhalb GitHub gesichert.

## Noch offen – formale Release-/Promotion-Schritte

- [ ] `CHANGELOG.md` auf V4.07.56 als aktuellen Kandidatenstand synchronisieren.
- [ ] `docs/HISTORY.md` auf V4.07.56 ergänzen.
- [ ] `docs/MILESTONES.md` auf V4.07.56 ergänzen und alte 95-%-Kennung entfernen.
- [x] `README.md` auf V4.07.56 synchronisiert.
- [x] `docs/INSTALLATION.md` auf V4.07.56 synchronisiert.
- [x] `docs/RELEASE_NOTES_V4_07_56.md` angelegt.
- [x] `SHA256SUMS_FRONTEND.txt` um das kanonische V4.07-Paket erweitert.
- [ ] Letzten vollständigen Shared-Frontend-/Browserlauf auf dem endgültigen Dokumentations-/Prüfsummen-Commit grün bestätigen.
- [ ] Letzten Integration-/HACS-/Hassfest-/Home-Assistant-Lauf auf demselben endgültigen Commit grün bestätigen.
- [ ] Abgeleitetes Repository `TheDaimos/gewitterradar-dashboard` aus exakt diesem akzeptierten Stand synchronisieren.
- [ ] Finalen Vergleich `main` ↔ V4.07.56-Promotionsstand durchführen und unerwartete Abweichungen ausschließen.
- [ ] Ausdrückliche Benutzerfreigabe für die Promotion nach `main` einholen.
- [ ] Erst danach kontrolliert nach `main` integrieren.
- [ ] Relevante Release-Gates auf dem tatsächlichen neuen `main` erneut vollständig ausführen.
- [ ] Golden Master aus exakt diesem grünen neuen `main` erzeugen und extern sichern.
- [ ] Öffentlichen Tag/GitHub-/HACS-Release nur auf exakt denselben verifizierten Commit setzen.

## Externe Umgebungsprüfungen – weiterhin offen, nicht als erledigt markieren

Diese Punkte verändern nicht den bereits abgenommenen V4.07.56-Frontendstand. Sie betreffen die separat installierte Blitzortung-Integration oder besondere Netzumgebungen.

### Blitzortung / Datenregion

- [ ] Kleine und große Standortbewegungen mit einer real konfigurierten Blitzortung-`Location entity` prüfen.
- [ ] Neuabonnierung und reale Latenz des Blitzdatenregionswechsels dokumentieren.
- [ ] Home-Assistant-Neustart und Restore-Verhalten mit konkret eingerichteter Blitzortung-`Location entity` prüfen.
- [ ] Recorder-/Datenbankauswirkungen bei häufigeren Standortwechseln beobachten.
- [ ] Sichtbare Trennung **Gewitterradar-Bezugsstandort** versus **tatsächlich synchronisierte Blitzdatenregion** weiter bewerten.
- [x] Produktregel festgelegt: Ein bloßer Karten-/Trackerwechsel wird niemals als bestätigte Blitzdatenregions-Synchronisation dargestellt.

### Netzwerk / abgeschottete Umgebungen

- [ ] Externe-Dienste-/Firewall-Hinweise in einem real segmentierten/gefilterten Szenario prüfen, soweit verfügbar.
- [ ] Nach Möglichkeit DNS-Filter, Proxy oder TLS-Inspection als Fehlerbild verproben.
- [x] Client- und Serverpfade in Hilfe/Diagnose getrennt dokumentiert und technisch geschützt.

Diese externen Prüfungen werden nicht stillschweigend als erfolgreich erklärt. Ob sie zwingend vor dem öffentlichen Release abgeschlossen werden müssen oder als dokumentierte Nachprüfung weiterlaufen dürfen, bleibt eine bewusste Releaseentscheidung.

## Kontaktadresse für Gewitterradar

Release-nah, aber kein technischer V4.07.56-Produktblocker:

- [ ] Externe Projektadresse `gewitterradar@gmx.de` bei GMX anlegen.
- [ ] Empfang und Versand vor öffentlicher Anzeige verifizieren.
- [ ] Wiederherstellungs-/Kontosicherheitsdaten ausschließlich außerhalb Git verwalten.
- [ ] Adresse erst nach bestätigter Existenz als sichtbaren Kontakt in Welcome/„Über Gewitterradar“ aufnehmen.
- [ ] Sichtbare Kontaktbezeichnung bei Umsetzung in allen 19 Sprachvarianten übersetzen.

## Upstream Blitzortung – kein V4.07.56-Releaseblocker

- [ ] Entwickler von `mrk-its/homeassistant-blitzortung` kontaktieren.
- [ ] Offiziellen Reconfigure-Wechsel zwischen festen Koordinaten und `Location entity` anfragen/vorschlagen.
- [ ] Wechsel einer bestehenden Standort-Entity über den offiziellen Reconfigure-Flow anfragen.

Die sichere Zwischenlösung bleibt bestehen: keine fremden ConfigEntries verändern, keine `.storage`-Manipulation und keine privaten APIs; einmalige manuelle Blitzortung-Einrichtung auf den Gewitterradar-Tracker, spätere Standortwechsel über diesen Tracker.

## Nach V4.07.56

Neue Produktideen gehören in `docs/ROADMAP.md` bzw. in den V4.08-Plan. Insbesondere Cluster-/Zoom-Algorithmik wird nicht mehr in V4.07.56 verändert.

Bis zur Promotion gilt weiterhin Feature-Freeze: **keine normale Karten-, Ortssuche-, Sprach-, Hilfe-, Radien-, Medaillon- oder Bedienlogik mehr ändern.**
