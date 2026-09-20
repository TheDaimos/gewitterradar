# Gewitterradar V4.09.05 – Test Release Notes

Status: **DEV/Testkandidat · nicht veröffentlicht**  
Datum: **20.09.2026**  
Öffentliche Rückfallbasis: **V4.08 FINAL / native Integration 0.20.0**

## Geändert

- Echter nativer Touch-Fallback für Kompass und Medaillon im Vollbild.
- Android/HA-WebView kann die Drag-Geste nicht mehr allein durch fehlendes oder verlorenes Pointer Capture blockieren.
- Pointer Events für Desktop/Maus/Stift bleiben erhalten.
- Touchpfad gilt ebenfalls für iPad/iPad Pro als zusätzliche Absicherung.
- Vollbild-Medaillon wird **nur auf Android exakt 15 % kleiner** dargestellt.
- Separate Fensterkennung: `40905`.

## Bereits bestätigter Stand

V4.09.04 wurde auf Desktop real geprüft:
- Kompass ein-/ausblenden: OK
- Medaillon ein-/ausblenden: OK
- Kompass frei verschieben: OK
- Medaillon frei verschieben: OK

Der offene Fehler liegt in der realen Android-Touch-Bedienung.

## Freigabe

Nicht veröffentlicht. Reale Android-Abnahme ist zwingend; anschließend iPad/iPad Pro und Desktop regressionsprüfen.
