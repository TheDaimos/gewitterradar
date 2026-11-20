# Wind-Einheit, Minimieren und Eye-Breite

DEV-Lieferung: **GR 4.11.170 / HA 0.25.77**, Runtime **411170r1**, Modulset **E411-170A1**. Basis: `74465b7c2687f5dceca93963cedde5b8c9ff5b10`.

- Geschwindigkeitseinheit samt vorhandenem Dropdown im Windmenü zwischen „Windfahnen anzeigen“ und „Darstellungsart“ verschoben. Werte, Einheitenumrechnung und Speicherung unverändert.
- Frühere flache, abgerundete Minimieren-/Maximieren-Optik wiederhergestellt: einheitlich 40 × 30 px, dunkler Metallverlauf und Goldkontur in Wind, Temperatur und Eye. Bestehendes Minus-/Plus-Zustandsverhalten erhalten.
- Eye-Menü auf 320 px verbreitert, weiterhin an die verfügbare Kartenbreite begrenzt. Die zuvor verbesserten Titelabstände und Legendenoptionen bleiben erhalten.

Gezielt geprüft: JavaScript-Syntax, Release-/Dateiparität, vollständige GR-Oberfläche in Desktop-, Android- und iPad-Touch-Viewports; Reihenfolge, identische Buttonmaße, Minimieren/Maximieren und Eye-Breite. Screenshots visuell geprüft. Keine umfangreiche CI-Serie, keine reale Geräteabnahme und keine automatische HA-Installation.

Keine Änderungen an meteorologischer Logik oder DRA-Projekt/Kanal. Weitere Auslieferungsänderungen sind ausschließlich erforderliche Versions-, Cache- und Manifest-Synchronisierung.

[Installierbare DEV-Pakete und SHA256](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.11.170-dev) über den bestehenden Kanal `TheDaimos/gewitterradar@deploy/dev`.
