# V4.11.54 DEV – Horizontale Einstellungsanimation

Datum: 2026-10-11

## Reproduzierbares Fehlerbild

Android-Videos der Animationen **Mittel** und **Langsam** zeigen, dass die äußere Dialoghöhe und der horizontale Übergang zeitweise auseinanderlaufen. Die hereinbewegte Seite wird teilweise abgeschnitten; am Ende erfolgt ein sichtbares Nachrücken. Das Problem betrifft den horizontalen Einstellungsdialog, nicht die Wetteranimation und nicht die Cluster-Ebene.

## Ursache

Die Navigation nutzt für den Seiteneffekt temporäre DOM-Kopien. Der bisherige Wechsel setzt die Klasse `gr-horizontal-detail` vor Beginn des sichtbaren Übergangs. Die CSS-Regel für diesen Modus blendete daraufhin **auch die alte, noch herausschiebende Kopie der Hauptübersicht** aus, da die Regel nicht auf direkte Kinder des echten Scrollbereichs beschränkt war. Die Signatur war zudem als letztes Kind des sich in der Höhe verändernden `.settings-body` platziert und gehörte dadurch zum instabilen Layout.

## Änderung

1. Beide Animationskopien werden für die gesamte Bewegung unabhängig vom Status `gr-horizontal-detail` sichtbar gehalten (gezielte, streng auf das Übergangsfenster begrenzte CSS-Überschreibungen).
2. Kopien übernehmen die berechneten Innenabstände und `border-box` des realen Scrollbereichs. Der animierte Zielzustand bleibt dabei der tatsächlich vermessene Zustand der echten Bedienfelder.
3. Die Originalsignatur wurde ohne Änderung ihrer Grafik als dauerhaftes Flex-Kind **direkt in den äußeren Einstellungsdialog** versetzt. Die bestehende Versionsanzeige bleibt ebenfalls am Dialograhmen verankert. Dadurch können beide nicht beim Seitenwechsel aus- und später wieder eingeblendet werden.
4. Beim Schließen während einer noch aktiven Animation darf ein verspäteter Abschluss die Dialoghöhe nicht erneut fixieren.
5. Android-Touchsteuerung, Wetterdaten, Cluster-Marker, Moduldiagnose, WeatherRouter und DRA bleiben unverändert.

## Version

- Gewitterradar: **V4.11.54 DEV**
- Laufzeit `41154r1` · Modulsatz `E411-54A1`
- `ui.controls`: 1.1.15 · `ui.skeleton`: 1.1.22 · `core.manifest`: 1.2.115
- Native Integration: 0.25.0 (unverändert)

## Tests und Freigabe

Zusätzlich zu den vorhandenen Vertrags- und Auslieferungsprüfungen:
`scripts/test-v41154-settings-motion.cjs` prüft im tatsächlichen Browser beide ausgelieferten Frontendvarianten auf Android- und Desktopfenstergröße, alle drei Geschwindigkeiten und beide Richtungen. Er kontrolliert während des Übergangs die Sichtbarkeit **beider** Kopien, deren Breite, die persistente Signatur sowie die Endposition von Dialog und Versionsanzeige.

CI-Erfolg ist eine Voraussetzung für die Aktualisierung von `deploy/dev`. Der endgültige Android-Realtest bleibt nach der Bereitstellung erforderlich; insbesondere muss der Nutzer bei **Langsam** das Verhalten auf dem realen Gerät beurteilen.
