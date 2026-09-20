# Gewitterradar V4.09.04 – Test Release Notes

> **Historischer Testzwischenstand / superseded durch V4.09.05.** Die reale Android-Prüfung führte zu `docs/RELEASE_NOTES_V4_09_05_TEST.md`.

Status: **DEV/Testkandidat · nicht veröffentlicht**  
Datum: **20.09.2026**  
Öffentliche Rückfallbasis: **V4.08 FINAL / native Integration 0.20.0**

## Zweck

V4.09.04 ist eine gezielte Korrekturrunde auf Basis von V4.09.03. Sie reagiert auf die reale Android-Prüfung der neuen Vollbild-Instrumente und enthält keine Promotion von V4.08.

## Korrigiert

- Vollbild-Kompass für reale Touch-Bedienung gehärtet: der äußere Overlay-Container ist auf Desktop, Android und iPad/iPad Pro die aktive Drag-Fläche.
- Verschachtelte Kompass-Inhalte können Touch-/Pointer-Ereignisse im Vollbild nicht mehr abfangen.
- Vollbild-Medaillon auf dieselbe systemübergreifende Drag-Architektur umgestellt.
- Kartenmedaillon vollständig von der History-/Tendenz-Layoutklasse getrennt.
- Über die Medaillon-Schaltfläche erscheint ausschließlich das **reine Trendmedaillon mit Pfeil**, ohne History, Verlauf, Beschriftung oder Tendenztext.
- Trendzustände `none / up / stable / down` bleiben erhalten.
- Layer-Schaltfläche weiter nach unten verschoben und dynamisch knapp oberhalb der Leaflet/OpenStreetMap-Attribution positioniert.
- Separate Fensterkennung auf `40904` angehoben.

## Unverändert

- Standard / Groß / Vollbild;
- gerätespezifische Startdarstellung;
- separates Kartenfenster;
- Standortanzeige und Standortmenü im Vollbild;
- Warnsystem-Test-Fail-Closed;
- Kompassgröße aus V4.09.03;
- lokale Sichtbarkeits-/Positionsspeicherung;
- V4.08 FINAL und alle geschützten V4.07.56/V4.08-Verträge.

## Automatisierte Tests

Der bestehende V4.09-Testpfad wurde erweitert um:

- reine Medaillonstruktur ohne `.trend`;
- Pointer-Empfang der Overlay-Container;
- Pointer-Sperre der inneren Grafik-/Instrumentknoten;
- Position des Layer-Controls oberhalb der Leaflet-Attribution;
- kompakten Abstand zwischen Layer-Control und Attribution;
- Desktop/iPad/Android in beiden Auslieferungsformen.

## Freigabestatus

**Nicht freigegeben.** Automatisierte Prüfungen ersetzen die reale Geräteabnahme nicht. V4.09.04 darf erst nach bestätigtem Dragging auf Desktop, Android und iPad/iPad Pro sowie Sichtprüfung des reinen Medaillons und der Layer-Position weiterpromotet werden.
