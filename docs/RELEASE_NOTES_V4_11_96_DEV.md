# Gewitterradar V4.11.96 DEV – GR-RF-01 regionale Niederschlagsdarstellung

**18.10.2026 · deploy/dev · HA-Integration 0.25.14 · Laufzeit 41196r1 · Modulsatz E411-96A1**

## Gesicherte GR-Ursachen

Die bisherige V2-Darstellung forderte geografische Vollabdeckung des gesamten Sichtfeldes, obwohl die validierte DWD-Regional-BBOX eine kleinere, fachlich gültige Bildfläche liefern kann. Der V1-Stagingpfad setzte gleichzeitig ausnahmslos `failed===0` voraus: Ein einzelner Fehler bei 14/15 oder 19/20 erfolgreich geladenen Kacheln verhinderte den Ebenenwechsel. Der genaue HTTP-/WMS-Fehler dieser konkreten Kachel ist aus den benannten, nicht im gemeinsamen Archiv aufgefundenen GR-Diagnosen nicht zuverlässig ableitbar.

## Änderung im bestehenden P7-010-Pfad

- V2 prüft die erwartete Bildfläche geografisch auf Ebene einzelner Kacheln. Außerhalb einer verifizierten Quelle bleiben Kacheln erwartungsgemäß transparent. Fehlende oder nicht vollständig gezeichnete Kacheln innerhalb der BBOX bleiben ausdrücklich Fehler. Eine belegte regionale Teilfläche darf trotzdem gezeichnet werden, sofern mindestens eine sichtbare Kachel tatsächlich gezeichnet und die restliche Kachelprüfung kontrolliert ist.
- V1 nutzt die verifizierte BBOX zum Zuschneiden bereits vorgesehener Bildkacheln und fordert geografisch unbelegte Kacheln nicht mehr als WMS-Bilder an. Ein kleiner Anteil echter Bildladefehler wird nur bei nachgewiesen überwiegend geladenen Kacheln toleriert; die Fehler bleiben im Diagnosemonitor einzeln sichtbar. Nicht geladene Bildausschnitte werden nicht als Null-Niederschlag ausgegeben.
- Bestehende breite gültige Grundversorgung darf weiterhin nicht durch eine wesentlich schmalere oder fehlende Teilfläche ersetzt werden. Der Geografieschutz (Deutschland ↔ Kuba), die Satelliteneinwilligung, der 900-Sekunden-Radarvertrag und der UTC-Vertrag bleiben bestehen. WeatherRouter wählt weiterhin alle Provider und die Quellenreihenfolge.
- Der Darstellungsstatus unterscheidet aktivierte Teilabdeckung, erhaltene breite Ebene und einzelne Kachelladefehler. Eine unvollständige aktive Ebene erhält nur eine begrenzte Aktualisierungsfrist; die reguläre Ruhezeit für vollständig dargestellte Bilder wird nicht verkürzt.

## Regression und technische Grenze

Neuer automatisierter Prüfsatz `scripts/test-p7-010-rf-01.mjs`: Regionalquelle bei Zoom 5 und 7, höhere Zoomstufen, vollständig transparente Außenkacheln, tatsächlicher Fehler innerhalb der Coverage, V1-Fehlertoleranz 14/15 und 19/20, Ablehnung bei null gezeichneten Bildern, Kuba/Deutschland, Altersgrenzen und Frontend-Spiegel. Zusätzlich gelten alle bisherigen P7-010- und HA-/Frontend-Prüfungen.

**Noch keine neue gemeinsame HA-Realabnahme.** Ein erfolgreich gezeichneter Canvas beweist weder nichttransparente Niederschlagspixel noch eine bestimmte Niederschlagsmenge. Die Fehlerklasse `image_load_failed_unclassified` identifiziert einen fehlgeschlagenen Bildladevorgang, nicht automatisch dessen HTTP- oder Netzwerkursache.

## DRA-/HA-Test

Über DRA aus `deploy/dev` installieren, HA vollständig neu starten und Version/Laufzeit auf der geöffneten Oberfläche prüfen. Für den gezielten Realtest Satellitenfreigabe AUS, Karte über Hamburg bei Zoom 5 und 7, danach Zoom 7 → 5 ohne Neuladen; gültige DWD-Flächen innerhalb ihrer BBOX müssen gezeichnet werden und außerhalb transparent bleiben. Danach Deutschland → Kuba → Deutschland sowie Opt-in EIN/AUS, Zoom 10–17, Android-Vordergrund und wiederholte Aktualisierungen prüfen. Bei Störung Bildverlust markieren und GR-/WR-Exporte mit denselben UTC-Zeitpunkten und `correlation_id` vergleichen.

**C.K. – Eine Idee weiter gedacht.**
