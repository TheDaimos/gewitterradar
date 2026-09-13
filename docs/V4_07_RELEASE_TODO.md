# Gewitterradar V4.07 – Release-To-do

Stand: 13.09.2026

Diese Datei sammelt kleine release-nahe Aufgaben, die vor einer Freigabe von V4.07 bewusst geprüft und abgeschlossen werden sollen.

## Kontaktadresse für Gewitterradar

- [ ] Externe Projektadresse `gewitterradar@gmx.de` bei GMX anlegen.
- [ ] Vor Veröffentlichung prüfen, dass Empfang und Versand zuverlässig funktionieren.
- [ ] Wiederherstellungs- und Kontosicherheitsdaten ausschließlich außerhalb des Repositorys verwalten; keine Zugangsdaten, Kennwörter oder Wiederherstellungscodes in Git, Quellcode oder Dokumentation ablegen.
- [ ] Nach erfolgreicher Einrichtung die Adresse als dezente Kontakt-Fußnote im Welcome-Bereich ergänzen.
- [ ] Dieselbe Kontakt-Fußnote unten in „Über Gewitterradar“ ergänzen.
- [ ] Die sichtbare Bezeichnung wie „Kontakt“ / „Contact“ in allen 19 registrierten Sprachvarianten übersetzen; die E-Mail-Adresse selbst bleibt unverändert.
- [ ] Wenn technisch sinnvoll, die Adresse als `mailto:`-Link ausführen, ohne das bestehende Premium-Layout oder die mobile Footer-Geometrie zu stören.
- [ ] Desktop, Android, iPhone/iOS, iPad und iPad Pro auf Zeilenumbruch, Touch-Ziel und Footer-Abstände prüfen.
- [ ] Erst nach verifizierter Existenz der Mailbox in einen öffentlichen Release übernehmen; bis dahin darf die Adresse nicht als funktionierender Supportkontakt dargestellt werden.

## Bereits offene V4.07-Releasepunkte

- [x] Korrigiertes V4.07-Dashboard-Package auf Basis des vollständigen V4.06-Pakets in den kanonischen V4.07-Zweig übernommen, per Paritäts-/YAML-Test abgesichert und mit dem abgeleiteten Repository `TheDaimos/gewitterradar-dashboard` synchronisiert; die sechs wiederhergestellten V4.06-Migrationspfade bleiben erhalten. Die abgeleitete Prüfsummenliste enthält das V4.07-Package ebenfalls.
- [x] Neue V4.07-Ortssuche-, Speicher-, Hilfe- und Firewall-/Netzwerktexte technisch in die vollständige Sprachmatrix übertragen: 15 Sprachen plus 4 deutsche Dialektvarianten. Die Übersetzungsdatei und ihr Prüfvertrag bleiben im Repository erhalten.
- [ ] Vollständige 19-Sprachen-Matrix nach der TEST9-Stabilisierung erneut kontrolliert auf den real akzeptierten Kandidaten aufsetzen und danach auf realen Geräten abnehmen. Sie ist vorübergehend aus dem Laufzeit-Kandidaten herausgenommen, weil sie zwischen dem akzeptierten TEST8 und TEST9 unbemerkt die Byte-Basis verändert hatte.
- [ ] Ländergruppierte Ortssuche und Ranking auf realen Geräten weiter prüfen.
- [x] `Nutzen` → Dialog schließen → Karte automatisch fokussieren real geprüft.
- [x] `★ Speichern` und „Gespeicherte Orte“ mit der lokalen To-do-Liste real geprüft.
- [x] TEST6: `×` Soft-Delete → „Entfernte Orte“ → `↶` Wiederherstellen auf realem Home Assistant geprüft.
- [x] Erneutes `★ Speichern` eines weich entfernten Ortes stellt den vorhandenen Eintrag wieder her und erzeugt kein Duplikat; real geprüft.
- [x] Standortwahl-Menü schließt bei Klick/Tap außerhalb des Menüs; Klicks innerhalb des Menüs sowie auf die beiden Standort-Schaltflächen werden nicht als Außenklick behandelt; real geprüft.
- [x] TEST7: vollständige Release History zusätzlich auf Deutsch bereitstellen und einen DE/EN-Umschalter mit zugänglichem Auswahlstatus integrieren; real geprüft und akzeptiert.
- [x] TEST7: V4.07-Eintrag der Release History vom alten „PLANNED“-Text auf den tatsächlich implementierten Testkandidaten aktualisieren; real geprüft und akzeptiert.
- [x] TEST7: erstes Premium-Netzwerksymbol für **Externe Dienste & Netzwerkfreigaben** technisch integriert; visuell verworfen.
- [x] TEST8: ausgewähltes Symbol Nr. 4 als deterministisches Schild-/Firewall-Symbol mit Mauerstruktur und bidirektionalen Netzwerkpfeilen integriert; keine zusätzliche Bilddatei oder externe Laufzeitabhängigkeit. Der real funktionierende TEST8 ist mit 1.649.138 Byte und SHA256 `a48188b8ee20dc2256d745540f59c3a2e51a0b7d66758dc76f9677a411a021f9` als unveränderliche Stabilitätsbasis festgeschrieben.
- [ ] Symbol für **Externe Dienste & Netzwerkfreigaben** auf kleine Darstellungsgröße vereinfachen. Aus der neuen Shield-Serie wurde **Variante 2** final ausgewählt; die technische Übernahme steht noch aus.
- [x] TEST9 und TEST9R1 als Regression verworfen: Beide wurden zwar syntaktisch/vertraglich grün gebaut, aber auf einer nach TEST8 zusätzlich veränderten, nicht real abgenommenen Laufzeitbasis erzeugt. Damit war die Bezeichnung als Fortsetzung von TEST8 technisch irreführend.
- [x] Build-Pipeline stabilisiert: Vor jeder weiteren TEST9-Erweiterung muss der erzeugte TEST8 byte-identisch zur real akzeptierten Referenz sein (1.649.138 Byte / SHA256 `a48188b8ee20dc2256d745540f59c3a2e51a0b7d66758dc76f9677a411a021f9`). Abweichungen brechen die CI.
- [ ] TEST9R2 auf realem Home Assistant prüfen. R2 wird ausschließlich auf der byte-identischen TEST8-Basis aufgebaut, verändert die bestehende Input-DOM-Struktur nicht und ergänzt nur das kleine `×` am rechten Ende von **Ort / PLZ**. Erwartete R2-Datei: 1.651.359 Byte, SHA256 `9d7f23d6307f1f232338446aabee19c88a1ddce1a0be1d534acea2b019fcf3b9`.
- [ ] Externe Dienste / Firewall-Hinweise in realen segmentierten bzw. gefilterten Netzen verproben.

## Spätere Feature-Idee: Globales Gewitter-Lagebild / Storm Feed

Dieser Punkt ist ausdrücklich **kein Blocker für V4.07** und soll erst nach Stabilisierung der aktuellen Standortarchitektur umgesetzt werden.

- [ ] RSS-/Feed-artige Ansicht der aktuell stärksten Gewitter weltweit entwerfen.
- [ ] Umschaltbare Ebenen bzw. Filter vorsehen: **Weltweit → Kontinent → Land**; optional Region/Bundesland, sofern die Datenquelle das zuverlässig hergibt.
- [ ] Für jeden Eintrag mindestens Ort/Region/Land, Kontinent, aktuelle Aktivität, verwendetes Zeitfenster und Aktualisierungszeit anzeigen.
- [ ] Geeignete Ranglogik untersuchen: z. B. Blitzanzahl in 10/30/60 Minuten, Blitzdichte, räumliche Ausdehnung, Aktivitätstrend und Aktualität. Keine scheinpräzise „Stärke“ anzeigen, bevor eine fachlich sinnvolle Metrik definiert ist.
- [ ] Klick/Tap auf einen Feed-Eintrag soll dessen Gewitterzentrum auf der Karte fokussieren.
- [ ] Für das Gewitterzentrum den nächstgelegenen geeigneten Ort bestimmen und diesen über die bestehende V4.07-Standortpipeline automatisch als Gewitterradar-Referenztracker setzen.
- [ ] Derselbe Wechsel soll die bereits vorhandene Kette weiterverwenden: Referenztracker setzen → Karte bewegen → Blitzortung folgt seiner konfigurierten `Location entity` und wechselt nach eigener Schwellenlogik die Datenregion.
- [ ] Im Feed bzw. während des Wechsels sichtbar unterscheiden zwischen **Feed-Lagebild** und **bereits synchronisierter Blitzortung-Livedatenregion**; ein Kartenfokus allein darf nicht als erfolgreicher Datenregionswechsel dargestellt werden.
- [ ] Datenquelle für das globale Ranking separat recherchieren und lizenz-/nutzungsrechtlich prüfen. Die gegenwärtige Blitzortung-Integration ist regionsbezogen und kann deshalb nicht allein durch ihre aktuelle lokale Subscription verlässlich die stärksten Gewitter der ganzen Welt bestimmen.
- [ ] Keine Lösung bauen, die zur Ermittlung der Weltrangliste zyklisch den Gewitterradar-Tracker durch viele Regionen verschiebt oder Blitzortung weltweit „abscannt“.
- [ ] Falls ein zusätzlicher externer Dienst/API nötig wird: Domain, Port, Zweck, Datenübertragung, Ausfallverhalten, Rate-Limits und Datenschutz unter **Hilfe & Hinweise → Externe Dienste & Netzwerkfreigaben** aufnehmen.
- [ ] Caching/Fallback prüfen, damit ein kurzzeitig nicht erreichbarer globaler Feed weder die normale Karte noch gespeicherte Orte beeinträchtigt.
- [ ] Mobile Darstellung als kompakte Karten-/Feed-Liste planen; lange Ortsnamen, Flaggen, Trendanzeige und Touch-Ziele auf Android/iPhone/iPad/Desktop testen.

Die Kontaktadresse ist ein Präsentations-/Kommunikationspunkt und darf die funktionale V4.07-Abnahme nicht verdecken. Ein späterer Wechsel des Mailanbieters soll nur die sichtbare Kontaktadresse betreffen und keine Produktlogik berühren.
