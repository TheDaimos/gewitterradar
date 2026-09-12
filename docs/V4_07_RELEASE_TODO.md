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

- [ ] Neue V4.07-Hilfe- und Firewall-/Netzwerktexte in die vollständige Sprachmatrix übertragen.
- [ ] Ländergruppierte Ortssuche und Ranking auf realen Geräten weiter prüfen.
- [x] `Nutzen` → Dialog schließen → Karte automatisch fokussieren real geprüft.
- [x] `★ Speichern` und „Gespeicherte Orte“ mit der lokalen To-do-Liste real geprüft.
- [ ] TEST6: `×` Soft-Delete → „Entfernte Orte“ → `↶` Wiederherstellen auf realem Home Assistant prüfen.
- [ ] Prüfen, dass erneutes `★ Speichern` eines weich entfernten Ortes den vorhandenen Eintrag wiederherstellt und kein Duplikat erzeugt.
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
