# GewitterRadar 4.12 – Vorgemerkte Winterwetter- und Orbital-Subicon-Ideen

**Status: verbindlich als Ideen-Backlog vorgemerkt, keine Implementierung in GR 4.11.** Stand 13.11.2026.

## Winterwetter

1. **Schneefall:** Animierte Schneeflocken und/oder statische Schneeflocken-Symbole. Benutzerregler mindestens für Größe und Anzahl/Dichte, optional Geschwindigkeit, Transparenz und dynamische Windabdrift. Animation niemals als vermeintliche punktgenaue Messung ausgeben.
2. **Nebel / Nebelbänke:** Eigenständige, bei Bedarf weich gezeichnete geografische Nebelfelder. DWD-Daten für Sichtweite, Nebelprognosen und amtliche Nebelwarnungen prüfen; tatsächliche Ortsauflösung respektieren.
3. **Glatteis / gefrierender Regen / überfrierende Nässe:** Eigene Warn- und Zustandsvisualisierung, fachlich korrekt getrennte Phänomene inklusive Reifglätte. DWD-Daten/amtliche Warnungen vor der Umsetzung prüfen und Messung, Vorhersage und Warngebiet sauber unterscheiden.

## Icons und Bedienung: „Monde“ = kreisförmige Orbit-Untermenüs

Der Betreiber hat die Bedeutung ausdrücklich präzisiert: **kleine kreisförmige Untermenü-Icons, die wie Monde um ein Haupticon angeordnet sind.** Es geht **nicht** um astronomische Mondphasen oder Nachtbeleuchtung.

- Bestehende WR-Haupticons bleiben erkennbar; ein Haupticon kann mehrere kreisförmige, visuell passende Satelliten-/Mond-Subicons im Orbit einblenden.
- Ideen für Funktionen: beispielsweise Schnee, Nebel und Glätte als Unterfunktionen eines Haupticons „Winterwetter“; weitere WR-Funktionsgruppen später möglich.
- **Interaktion (Vorschlag des Betreibers, 13.11.2026): Doppeltippen / Double-Press auf das Haupticon** zum Ein-/Ausklappen der kreisförmigen Orbital-Subicons, da **Short-Tap** bereits Ein/Aus und **Long-Press** bereits das Premiummenü auslöst. Bestehende Short-Tap-, Long-Press- und Drag-Semantik darf sich nicht verändern. Vor Umsetzung Double-Tap-Erkennung gegen bestehende Karten-Doppelzoom-Geste und Event-Bubbling prüfen; die Erkennung darf nicht versehentlich die Karte zoomen, und die erste Berührung darf nicht ungewollt den Hauptschalter toggeln. Konsequenz: Ggf. kleiner Double-Tap-Zeitpuffer für Short-Tap, daher Android-Gefühl und Latenz real testen, keine Verschlechterung erzwingen.
- Radius, Anzahl, Platzierung, Touch-Ziele, Kollisionserkennung an Displayrändern, Drag vs. Tap und Android-Gesten müssen vor Implementierung definiert werden.
- Hochwertige Metall-/Gold-/Aura-Optik passend zum bestehenden Premium-/Eye-Design, ohne vorhandene Eye-Slots, Icon-Layouts oder Gesten zu beschädigen.
- Noch offen: genaue Anordnung, Konfigurierbarkeit, Maximalkapazität und Animation; keine implizite Designentscheidung.

## Technische Abgrenzung und Vorgehen

- GewitterRadar **4.11 sauber abschließen** und funktionierende Synoptik und Windanimation schützen. **Keine** Realisierung dieser Features in 4.11.
- In **4.12** erst DWD- und mögliche andere offizielle Quellen bezüglich Datenzugriff, Providerabdeckung, Zeit/Gültigkeit, Lizenz und räumlicher Genauigkeit prüfen. Danach WR-Datenvertrag, anschließend GR-Kartenlayer, Steuerung und grafische Animation spezifizieren.
- WeatherRouter entscheidet weiterhin über Provider, Daten und Gültigkeit; GewitterRadar rendert und bedient.
- PROD VM101 unangetastet; dieser Backlog-Eintrag ändert keine Laufzeit.

**Dies ist eine Vormerkung, kein Codex-Auftrag und keine Freigabe zur Implementierung.**
