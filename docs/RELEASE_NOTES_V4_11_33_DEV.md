# Gewitterradar V4.11.33 DEV

Stand: **2026-10-08**

## Hotfix: minimierte Kartendiagnose wiederherstellbar

Die in V4.11.32 eingeführte mobile Kartendiagnose konnte minimiert werden, bot danach aber keinen Weg zurück in die kompakte oder vollständige Ansicht.

V4.11.33 korrigiert den Minimieren-Knopf zu einem echten Umschalter:

- Normal/Kompakt: **−** minimiert die Kartendiagnose
- Minimiert: **+** stellt die Kartendiagnose wieder her
- die zuletzt verwendete Ansicht **Voll** oder **Kompakt** wird gespeichert
- beim Wiederherstellen wird genau diese Ansicht erneut geöffnet
- die laufende Ereignisaufzeichnung bleibt während des Minimierens vollständig erhalten

Unverändert bleiben:

- mobile Kartendiagnose
- Ereignisringpuffer bis 800 Einträge
- JSON kopieren
- JSON herunterladen
- Touch-/Pointer-/Leaflet-Instrumentierung
- V4.11.31 Quarantäne-Hotfix
- 3-Finger-Joe-Recovery aus V4.11.30/31/32

## Stand

- Produkt **V4.11.33 DEV**
- Build **V4.11.33-DEV-2026-10-08**
- Runtime **41133r1**
- Modulsatz **E411-33A1**
- `core.manifest` **1.2.104**
- `diagnostics.map` **1.0.1**
- Integration **0.25.0**

**C.K. – Eine Idee weiter gedacht.**
