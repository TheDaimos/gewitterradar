# Gewitterradar V4.07.11 – Premium Help Icons

Stand: 13.09.2026

## Ziel

V4.07.11 ist eine reine visuelle Teststufe für **Hilfe & Hinweise** auf Basis des real akzeptierten TEST10R1. Funktionale Standort-, Such-, Speicher-, Sprach- und Tracker-Logik wird nicht verändert.

## Verbindliche Asset-Regel

Alle neuen Premium-Icons besitzen kanonische, transparente **Hi-Res/Vektor-Originale** im Hauptrepository unter `artwork/help-icons/hires/`. Diese Master bleiben dauerhaft erhalten und dürfen nicht durch Laufzeit-Ableitungen ersetzt werden. Die Test-JavaScript-Dateien betten aus diesen Master-SVGs erzeugte `data:image/svg+xml;base64`-Darstellungen ein, sodass der manuelle Home-Assistant-Test weiterhin nur eine einzelne JS-Datei benötigt.

## Umgestellte Icons

- Kopfbereich `?`
- Schließen `×`
- Voraussetzungen
- Die Radien
- Referenzstandort
- Externe Dienste & Netzwerkfreigaben
- Wichtige Funktionen
- Empfohlene Grundeinstellungen
- Fehlerbehebung
- Recorder

Der bestehende Copy-Button verwendet bereits das gemeinsame Premium-Control-Asset und bleibt unverändert.

## Varianten

- **V4.07.11A**: Premium-Iconfamilie + Firewall/Shield Variante 2.
- **V4.07.11B**: identische Premium-Iconfamilie + Shield mit RJ45-/Netzwerkstecker-Motiv.

Die sichtbare App-Version unterscheidet A/B bewusst, damit auf realen Geräten eindeutig erkennbar ist, welcher Kandidat geladen ist.

## Stabilitätskette

Vor TEST11 erzwingt CI weiterhin byte-identisch:

- TEST8: `1.649.138` Byte / SHA256 `a48188b8ee20dc2256d745540f59c3a2e51a0b7d66758dc76f9677a411a021f9`
- TEST9R2: `1.651.359` Byte / SHA256 `9d7f23d6307f1f232338446aabee19c88a1ddce1a0be1d534acea2b019fcf3b9`
- TEST10: `1.769.200` Byte / SHA256 `a95e7b3346089f45e51c7ceebfc3d813b6bebac8cef56d3fa4cfa8dff37bd076`
- TEST10R1: `1.769.874` Byte / SHA256 `358ce310c14ba609b9d840f39a28ef6499cdbcae24f6672cfc8001ec5acba0aa`

Erst danach werden die TEST11-Icons eingebettet.

## CI-Ergebnis

Workflow `Build V4.07 location search test candidate`, Run **#134**, erfolgreich.

- V4.07.11A: `1.810.094` Byte / SHA256 `c82e31ad767a1e12ab7cc8aa838660afa27f5ca8e14bff2da7c28542112d7bbb`
- V4.07.11B: `1.810.106` Byte / SHA256 `5391768c1284dcdadcc775092f8e2b6902c649b1a17ef51786a7e4fe9d7e672a`

## Realtest offen

- Android
- Desktop
- iPhone/iOS
- iPad/iPad Pro
- optischer Vergleich A gegen B bei realer kleiner Icon-Darstellung
- Kontrolle, dass lange Hilfe-Titel und Akkordeon-Geometrie unverändert bleiben
