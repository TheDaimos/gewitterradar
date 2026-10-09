# Gewitterradar V4.11.51 DEV – Android: Endruck im horizontalen Einstellungsmenü

Datum: 2026-10-09

## Beobachtung

Vier zeitlich geordnete Android-Screenshots zeigen das Verschieben des Inhalts beim Wechsel zu „4. Kartendarstellung“. Die beiden letzten ursprünglich übermittelten Aufnahmen wurden vom Tester in ihrer zeitlichen Reihenfolge korrigiert: die finale Aufnahme zeigt Inhalt und Signatur wieder vollständig. Bei jeder Animation erscheint am Ende eine plötzliche Neuausrichtung.

## Ursache und Korrektur

Die Höhenanimation endete auf einer Pixelhöhe, entfernte aber sofort die Inline-Höhenangabe. Das zentrierte Dialogfenster wurde dadurch neu vermessen und sprang in seine endgültige Position. Zusätzlich benutzten die gleitenden Momentaufnahmen eine andere Innenabstandsgeometrie als der reale Menüinhalt. Die dauerhaft vorhandene Signatur und die Versionskennung wurden während des Übergangs ausgeblendet und sprangen am Ende wieder hinein.

- Die Höhe bleibt **nach dem Übergang** auf dem tatsächlich animierten Endwert; auf natürliche Größe wird ausschließlich beim Schließen beziehungsweise neuen Öffnen zurückgesetzt.
- Die gleitenden Ansichten übernehmen die berechneten Innenabstände des echten Einstellungsinhalts.
- Signatur und Versionskennung bleiben während der Animation sichtbar, ohne zusätzliche Kopien einzufügen.
- Seiten- und Höhenanimation bleiben zeitlich synchron, der innere Scrollbereich bleibt währenddessen stabil.
- Verbindliche Produktidentität: V4.11.51 DEV · 41151r1 · E411-51A1; ui.controls 1.1.14; core.manifest 1.2.112; Integration weiterhin 0.25.0.

## Abnahmebedingungen

Statik/CI: identische Frontendkopien, Modulregister, Versionsmanifest, Asset-Prüfsummen und Animation-Abschluss ohne Rücksetzen auf auto. Nach erfolgreicher Gesamt-CI im Home Assistant insbesondere Android Langsam/Mittel/Schnell und Wechsel in beide Richtungen visuell prüfen. Keine Änderung an Karte, Touch-Gesten oder WeatherRouter. Keine DRA-Freigabe allein aufgrund dieser Dokumentation.
