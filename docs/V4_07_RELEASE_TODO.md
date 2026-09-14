# Gewitterradar V4.07 – Release-To-do

Stand: **14.09.2026 – V4.07.31 Near-Final-Testkandidat**  
Interner Reifegrad: **ca. 95 %** – Projektabschätzung, keine Release-Garantie.

Diese Datei sammelt die release-nahen Aufgaben, die vor einer öffentlichen Freigabe von V4.07 bewusst geprüft und abgeschlossen werden sollen. Historische TEST-Zwischenstufen bleiben als Nachweis dokumentiert, gelten aber nicht mehr automatisch als eigenständige aktuelle Blocker.

## Aktueller V4.07.31-Freigabeblock

### 1. Sprache / Hilfe / reale Geräte

- [ ] V4.07.31 auf realem Home Assistant mit Deutsch und Englisch vollständig prüfen.
- [ ] Repräsentative externe Sprachen mit langen Beschriftungen/Sonderzeichen stichprobenartig prüfen.
- [ ] **Boarisch, Plattdüütsch, Sächs’sch und Schwäbisch** real durchschalten und „Hilfe & Hinweise“ vollständig durchscrollen.
- [ ] Prüfen, dass keine großen Standarddeutsch-Hilfeblöcke mehr in den vier Dialektfassungen erscheinen.
- [ ] Aktionsdarstellung für `Nutzen`, `★`, `×`, `↶`, Netzwerk-/Entity-Hervorhebungen und Radien-Hilfe real prüfen.
- [ ] Desktop, Android, iPad und iPad Pro final regressionsprüfen; iPhone/iOS ergänzen, sobald verfügbar.

### 2. Ortssuche / gespeicherte Orte / Bedienung

- [ ] Ländergruppierte Ortssuche und Ranking nochmals auf den final vorgesehenen Geräteklassen prüfen.
- [ ] `Nutzen` → Suche schließt → Karte fokussiert den neuen Standort nochmals im V4.07.31-Gesamtstand bestätigen.
- [ ] `★ Speichern` → `×` Soft-Delete → `↶` Wiederherstellen im V4.07.31-Gesamtstand regressionsprüfen.
- [ ] Erneutes Speichern eines weich entfernten Ortes nochmals auf Duplikatfreiheit prüfen.
- [ ] Außenklick/-tap, Touch-Ziele, Dropdowns, Scrollgrenzen und Hoch-/Querformat final prüfen.

### 3. Blitzortung / Datenregion

- [ ] Kleine und große Standortbewegungen mit der finalen Kopplung prüfen.
- [ ] Neuabonnierung und reale Latenz des Blitzdatenregionswechsels dokumentieren.
- [ ] Home-Assistant-Neustart und Restore-Verhalten mit konfigurierter Blitzortung-`Location entity` prüfen.
- [ ] Recorder-/Datenbankauswirkungen bei Standortwechseln beobachten.
- [ ] Belastbaren sichtbaren Status für **Bezugsstandort** versus **tatsächlich synchronisierte Blitzdatenregion** entscheiden/abschließen.
- [ ] Sicherstellen, dass ein bloßer Karten-/Trackerwechsel niemals als bestätigte Blitzdatenregions-Synchronisation dargestellt wird.

### 4. Netzwerk / abgeschottete Umgebungen

- [ ] Externe-Dienste-/Firewall-Hinweise in mindestens einem real segmentierten/gefilterten Szenario prüfen, soweit verfügbar.
- [ ] Nach Möglichkeit DNS-Filter, Proxy oder TLS-Inspection als Fehlerbild gegen die dokumentierten Hinweise verproben.
- [ ] Prüfen, dass Client- und Serverpfade in der Diagnose weiterhin korrekt getrennt beschrieben werden.

### 5. Finaler Freeze / Veröffentlichung

- [ ] Finalen Shared-Frontend-/Browserlauf auf dem vorgesehenen Freeze-Commit vollständig grün bestätigen.
- [ ] Native Integration und Dashboard aus exakt demselben akzeptierten Frontendstand erzeugen/synchronisieren.
- [ ] Abgeleitetes Repository `TheDaimos/gewitterradar-dashboard` auf den final akzeptierten Stand synchronisieren.
- [ ] Sichtbare Release History auf den endgültigen V4.07-Release-Stand bringen.
- [ ] `README.md`, `CHANGELOG.md`, `docs/HISTORY.md`, `docs/MILESTONES.md` und finale Release Notes auf den endgültigen Freeze-Commit synchronisieren.
- [ ] Finale Asset-/Package-/SHA256-Inventare erzeugen und prüfen.
- [ ] Exakt akzeptierten Commit als unveränderlichen V4.07-Releasepunkt einfrieren/taggen.
- [ ] HACS-/GitHub-Release-Promotion ausschließlich aus diesem akzeptierten Stand durchführen.
- [ ] V4.06 unverändert als Rückfallbasis behalten.

## Aktuelle V4.07.31-Buildidentität

- Haupt-JavaScript: **1.779.464 Bytes**
- SHA256: `2d13746361d52af29be279f0c273d7fc3ca381a531a82f26efe8c82f3a871b31`
- Locale-Modul: **401.387 Bytes**
- Locale-SHA256: `898182f61b59682cd34607219018437999081b67e171e7f8955df454ec3d7ccb`
- Actions-Artefakt: `v407-test31-complete`
- Artifact-ID: `10366237921`
- Artifact-Größe: **2.238.710 Bytes**
- Artifact-ZIP SHA256: `91f4e615029040c1f01498355071871c693c771c5bf9d82efadc1586cf9d6917`
- Near-Final-Release-Notes: `docs/RELEASE_NOTES_V4_07_31_TEST.md`

## Bereits technisch/real bestätigte V4.07-Kernpunkte

- [x] Korrigiertes V4.07-Dashboard-Package basiert wieder auf dem vollständigen V4.06-Paket; die sechs V4.06-Migrationspfade bleiben erhalten.
- [x] V4.07-Ortssuche-, Speicher-, Hilfe- und Netzwerktexte technisch in die vollständige Sprachmatrix übertragen.
- [x] Gewitterradar-eigener nativer dynamischer GPS-Tracker umgesetzt.
- [x] Separater Dashboard-Tracker für Testkoexistenz umgesetzt.
- [x] `Nutzen` → Dialog schließen → Karte automatisch fokussieren real geprüft.
- [x] `★ Speichern` und gespeicherte Orte über Local-To-do real geprüft.
- [x] `×` Soft-Delete → „Entfernte Orte“ → `↶` Wiederherstellen real geprüft.
- [x] Erneutes Speichern eines weich entfernten Ortes reaktiviert den vorhandenen Eintrag ohne Duplikat.
- [x] Standortwahl-Menü schließt bei Klick/Tap außerhalb, interne Interaktionen bleiben funktionsfähig.
- [x] Release History besitzt vollständige DE-/EN-Fassungen mit Umschalter und aktualisiertem V4.07-Eintrag.
- [x] Externe-Dienste-/Netzwerkinventar und fail-closed URL-Vertrag umgesetzt.
- [x] Premium-Hilfe-Symbole, Netzwerk-/Dienst-Hervorhebung, Radius-Hilfe und adaptive Help-/Settings-Scrolllogik umgesetzt.
- [x] V4.07.30: blauer `Nutzen`/`Use`-Aktionsstil und zurückgenommene `Location entity`-Hervorhebung; akzeptierte Radien unverändert.
- [x] V4.07.31: Deutsch/Englisch nativ + 17 externe Hilfevarianten; vier Dialekte ohne große Standarddeutsch-Rückfallblöcke.
- [x] V4.07.31-spezifischer deterministischer Komplettworkflow erfolgreich.
- [x] HACS-Integration-Validierung erfolgreich.
- [x] Paketvertrag erfolgreich.
- [x] Hassfest erfolgreich.
- [x] Home-Assistant-2026.9.0-Laufzeittests erfolgreich.

## Historische TEST-Zwischenstufen

Die früheren TEST10-/TEST11-/TEST12-Einzelpunkte sind durch den konsolidierten V4.07.31-Gesamtstand **überholt**. Ihre technische Entwicklung bleibt in `docs/RELEASE_NOTES_V4_07_TEST.md` nachvollziehbar. Für die Freigabe werden sie nicht mehr einzeln gegen alte Zwischenartefakte abgenommen, sondern als Bestandteil des finalen V4.07.31-Regressionsblocks geprüft.

Wichtige historische Stabilitätsanker bleiben erhalten:

- real akzeptierter TEST8: **1.649.138 Bytes**, SHA256 `a48188b8ee20dc2256d745540f59c3a2e51a0b7d66758dc76f9677a411a021f9`;
- real akzeptierter TEST9R2: **1.651.359 Bytes**, SHA256 `9d7f23d6307f1f232338446aabee19c88a1ddce1a0be1d534acea2b019fcf3b9`;
- TEST10: **1.769.200 Bytes**, SHA256 `a95e7b3346089f45e51c7ceebfc3d813b6bebac8cef56d3fa4cfa8dff37bd076`;
- TEST29: externalisierte 17-Sprachen-Hilfe;
- TEST30: `Nutzen`/`Use`-Aktionsdarstellung + zurückgenommene `Location entity`-Hervorhebung;
- TEST31: vollständiger Hilfe-i18n-Regressionsschluss einschließlich der vier Dialekte.

## Kontaktadresse für Gewitterradar

Dieser Punkt ist release-nah, aber kein technischer Funktionsblocker.

- [ ] Externe Projektadresse `gewitterradar@gmx.de` bei GMX anlegen.
- [ ] Vor Veröffentlichung prüfen, dass Empfang und Versand zuverlässig funktionieren.
- [ ] Wiederherstellungs- und Kontosicherheitsdaten ausschließlich außerhalb des Repositorys verwalten; keine Zugangsdaten, Kennwörter oder Wiederherstellungscodes in Git, Quellcode oder Dokumentation ablegen.
- [ ] Nach erfolgreicher Einrichtung die Adresse als dezente Kontakt-Fußnote im Welcome-Bereich ergänzen.
- [ ] Dieselbe Kontakt-Fußnote unten in „Über Gewitterradar“ ergänzen.
- [ ] Die sichtbare Bezeichnung wie „Kontakt“ / „Contact“ in allen 19 registrierten Sprachvarianten übersetzen; die E-Mail-Adresse selbst bleibt unverändert.
- [ ] Wenn technisch sinnvoll, die Adresse als `mailto:`-Link ausführen, ohne das bestehende Premium-Layout oder die mobile Footer-Geometrie zu stören.
- [ ] Desktop, Android, iPhone/iOS, iPad und iPad Pro auf Zeilenumbruch, Touch-Ziel und Footer-Abstände prüfen.
- [ ] Erst nach verifizierter Existenz der Mailbox in einen öffentlichen Release übernehmen; bis dahin darf die Adresse nicht als funktionierender Supportkontakt dargestellt werden.

## Upstream Blitzortung – kein V4.07-Releaseblocker

- [ ] Entwickler von `mrk-its/homeassistant-blitzortung` kontaktieren.
- [ ] Offiziellen Reconfigure-Wechsel zwischen festen Koordinaten und einer `Location entity` anfragen/vorschlagen.
- [ ] Wechsel einer bestehenden Standort-Entity über den offiziellen Reconfigure-Flow anfragen.

Die sichere V4.07-Zwischenlösung bleibt bestehen: keine fremden ConfigEntries verändern, keine `.storage`-Manipulation, keine privaten APIs; einmalige manuelle Blitzortung-Einrichtung auf den Gewitterradar-Tracker, danach Standortwechsel über den Tracker.

## Spätere Feature-Idee: Globales Gewitter-Lagebild / Storm Feed

Dieser Punkt ist ausdrücklich **kein Blocker für V4.07** und soll erst nach Stabilisierung/Freigabe der aktuellen Standortarchitektur umgesetzt werden.

- [ ] RSS-/Feed-artige Ansicht der aktuell stärksten Gewitter weltweit entwerfen.
- [ ] Umschaltbare Ebenen bzw. Filter vorsehen: **Weltweit → Kontinent → Land**; optional Region/Bundesland, sofern die Datenquelle das zuverlässig hergibt.
- [ ] Für jeden Eintrag mindestens Ort/Region/Land, Kontinent, aktuelle Aktivität, verwendetes Zeitfenster und Aktualisierungszeit anzeigen.
- [ ] Geeignete Ranglogik untersuchen: z. B. Blitzanzahl in 10/30/60 Minuten, Blitzdichte, räumliche Ausdehnung, Aktivitätstrend und Aktualität. Keine scheinpräzise „Stärke“ anzeigen, bevor eine fachlich sinnvolle Metrik definiert ist.
- [ ] Klick/Tap auf einen Feed-Eintrag soll dessen Gewitterzentrum auf der Karte fokussieren.
- [ ] Für das Gewitterzentrum den nächstgelegenen geeigneten Ort bestimmen und diesen über die bestehende V4.07-Standortpipeline automatisch als Gewitterradar-Referenztracker setzen.
- [ ] Derselbe Wechsel soll die vorhandene Kette weiterverwenden: Referenztracker setzen → Karte bewegen → Blitzortung folgt seiner konfigurierten `Location entity` und wechselt nach eigener Schwellenlogik die Datenregion.
- [ ] Im Feed bzw. während des Wechsels sichtbar unterscheiden zwischen **Feed-Lagebild** und **bereits synchronisierter Blitzortung-Livedatenregion**.
- [ ] Datenquelle für das globale Ranking separat recherchieren und lizenz-/nutzungsrechtlich prüfen. Die aktuelle regionsbezogene Blitzortung-Subscription kann allein keine belastbare Weltrangliste liefern.
- [ ] Keine Lösung bauen, die zur Ermittlung der Weltrangliste zyklisch den Gewitterradar-Tracker durch viele Regionen verschiebt oder Blitzortung weltweit „abscannt“.
- [ ] Falls ein zusätzlicher externer Dienst/API nötig wird: Domain, Port, Zweck, Datenübertragung, Ausfallverhalten, Rate-Limits und Datenschutz unter **Hilfe & Hinweise → Externe Dienste & Netzwerkfreigaben** aufnehmen.
- [ ] Caching/Fallback prüfen, damit ein kurzzeitig nicht erreichbarer globaler Feed weder die normale Karte noch gespeicherte Orte beeinträchtigt.
- [ ] Mobile Darstellung als kompakte Karten-/Feed-Liste planen; lange Ortsnamen, Flaggen, Trendanzeige und Touch-Ziele auf Android/iPhone/iPad/Desktop testen.

## Arbeitsregel bis zum Freeze

**Idee → Backlog. Planung → Analyse/Versionierung. Umsetzung → erst nach ausdrücklicher Freigabe.**

Bis zum V4.07-Freeze sollen neue Produktideen nicht mehr in den Near-Final-Kandidaten hineinwachsen. Erst nach Abschluss der verbleibenden Freigabegates werden die nächsten Roadmap-Punkte priorisiert.
