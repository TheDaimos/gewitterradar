# Gewitterradar V4.11.67 DEV – iPad-Zahnrad: nur ein Symbol

**Datum:** 13.10.2026 · Basis: V4.11.66 DEV.

## Befund

Auf dem iPad erscheinen oberhalb der Karte gleichzeitig ein goldfarbenes und ein blaues Zahnrad, obwohl die Klassisch/Modern-Menüumschaltung korrekt funktioniert. Das iPad-spezifische CSS `#card-root.ipad-device .settings-chip-premium .gear-welcome { display:block!important }` besitzt höhere Spezifität als die bisherige Umschaltregel `#settings-open .gear-modern { display:none!important }`. Dadurch können beide SVG-Symbole innerhalb der Hauptschaltfläche sichtbar werden. Die alte zusätzliche Testschaltfläche bleibt ebenfalls ausdrücklich ausgeblendet.

## Korrektur

Die Regeln in `ui.controls` verwenden jetzt `#card-root #settings-open` sowie `.gear-welcome.gear-modern`/`.gear-welcome.gear-classic`. Damit übertreffen sie die bestehende iPad-Regel und schalten in beiden Betriebsarten genau ein SVG sichtbar:

- **Klassisch:** goldfarbenes Zahnrad.
- **Modern:** blaues Zahnrad.
- Die alte `#settings-open-horizontal`-Schaltfläche bleibt verborgen.

Keine Änderung an Menübewegung, Standortlisten, automatischer Kamerafahrt, Zoomstufen 5–18 oder 3-Finger-Gestenschutz.

## Versionierung

**V4.11.67 DEV**, Build `V4.11.67-DEV-2026-10-13`, Laufzeit `41167r1`, Modulsatz `E411-67A1`; `ui.controls` 1.1.26, `core.manifest` 1.2.128. Integration bleibt 0.25.0.

Geräteabnahme: iPad in beiden Darstellungen prüfen; jeweils genau ein Zahnrad anzeigen und beide Einstellungen öffnen können.
