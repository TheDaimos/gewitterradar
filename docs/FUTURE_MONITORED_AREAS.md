# Gewitterradar – zukünftige Funktion „Monitored Areas“

Stand: 14.09.2026

Diese Datei hält eine neue Funktionsidee für eine spätere Version nach Stabilisierung/Freigabe von V4.07 fest. Sie ist **kein V4.07-Blocker** und wird nicht parallel zur laufenden V4.07-Abnahme implementiert.

## Ziel

Besondere, feste Standorte sollen unabhängig vom aktuell in Gewitterradar ausgewählten Referenzstandort überwacht werden können. Wenn innerhalb eines fachlich festgelegten Nahbereichs ein Blitz registriert wird, soll Gewitterradar eine eindeutige Alarmierung für den betroffenen Standort auslösen.

Arbeitstitel des Bereichs in der Standortauswahl: **Monitored Areas**.

## Bedienkonzept

- In der Standortauswahl einen eigenen Abschnitt **Monitored Areas** vorsehen.
- Vorhandene Orts-/Koordinatenlogik von V4.07 wiederverwenden; keine zweite Geocoding-Pipeline bauen.
- `+` zum Hinzufügen eines weiteren überwachten Standorts.
- `−` zum Entfernen bzw. Deaktivieren eines überwachten Standorts.
- Speicherung möglichst analog zu „Gespeicherte Orte“ über eine eigene lokale To-do-Liste; To-do dient ausschließlich als persistente Standortbibliothek, nicht als Blitz-Ereignisquelle.
- Pro Standort mindestens Name, Koordinaten, Überwachungsstatus und fachlich festgelegter Radius speichern.
- Mehrere überwachte Standorte müssen unabhängig vom aktuell auf der Karte gewählten Referenzstandort bestehen bleiben.

## Alarmierung

- Alarm auslösen, wenn ein neues Blitzereignis den festgelegten Radius eines überwachten Standorts schneidet.
- Ereignisse deduplizieren, damit derselbe Blitz nicht mehrfach alarmiert wird.
- Alarmtext sollte mindestens enthalten: Standortname, Zeitpunkt, Entfernung, Blitzkoordinaten sowie verwendeter Überwachungsradius.
- Später mögliche Kanäle: Home-Assistant-Benachrichtigung, Companion-App und vorhandene Benachrichtigungswege; genaue Auswahl erst in der Implementierungsphase.
- Bei mehreren Treffern in kurzer Zeit sinnvoll bündeln bzw. Eskalations-/Cooldown-Logik prüfen.

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

Vor Implementierung klären:

- nahe Monitored Areas innerhalb derselben Blitzortung-Datenregion;
- mehrere Blitzortung-Einträge/Subscriptions für weit entfernte überwachte Standorte;
- alternativ spätere Nutzung einer geeigneten globalen Blitzdatenquelle, falls dies technisch, lizenzrechtlich und datenschutzseitig sinnvoll ist;
- Zusammenspiel mit dem separat geplanten globalen Gewitter-Lagebild, ohne den Referenztracker zyklisch durch Regionen zu verschieben.

## Darstellung

- Eigener Abschnitt **Monitored Areas** in der Standortauswahl.
- Geplantes Symbol: **hochwertiges goldenes Schild mit rotem Blitz**.
- Symbol muss der bestehenden Premium-Metalloptik von Gewitterradar entsprechen und als Hi-Res-/Master-Asset im kanonischen Repository erhalten werden; Laufzeitdarstellung davon ableiten.
- Pro überwachten Standort später Statusdarstellung prüfen, z. B. ruhig / Aktivität in Nähe / Alarm.

## Abgrenzung

Diese Funktion ist keine allgemeine Gewitterwarnung und ersetzt keinen amtlichen Warndienst. Sie ist eine standortbezogene Blitz-Näheerkennung auf Basis der verfügbaren Blitzdaten. Aussagen wie „Versicherungsnachweis“ oder „bestätigter Einschlag am Gebäude“ dürfen nur verwendet werden, wenn Datenqualität, Toleranzen und fachliche/rechtliche Grundlage dies tatsächlich tragen.
