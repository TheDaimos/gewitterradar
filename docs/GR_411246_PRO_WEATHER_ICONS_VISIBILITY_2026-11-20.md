# GR 4.11.246 DEV – PRO-Wetter-Icons folgen dem Eye-Status

**Datum:** 20.11.2026 · **Bereitstellung:** `deploy/dev` (DRA) · **HA:** `0.25.153` · **Runtime:** `411246r1`

## Betreiberbefund

In 4.11.245 wurde der zentrale Eye Hub ohne WeatherRouter korrekt ausgeblendet. Im ungruppierten Eye-Modus blieben jedoch die einzelnen Wetter-Icons (Wind, Temperatur, Niederschlag, Synoptik, Wolken, Wetterdarstellung und Gewitterzelle) sichtbar, obwohl die PRO-Services fehlten.

## Korrektur

Alle sieben dem Eye Hub zugeordneten PRO-Wetter-Icons folgen nun genau demselben Status wie das zentrale Eye. Solange die authentifizierte WeatherRouter-Consumer-Discovery **nicht** eindeutig `ready` bestätigt, werden diese Karten-Icons per CSS ausgeblendet – sowohl vor dem ersten Erkennungsergebnis als auch nach Verbindungsverlust.

Die bestehende Belegung, Positionen, Größen, Profile und die einzelnen `hidden`-/Sichtbarkeitszustände werden **nicht** überschrieben. Sobald WeatherRouter wieder betriebsbereit ist, erscheinen die zuvor konfigurierten Symbole und das Eye im vorherigen Layout. Die Blitzkarte, Standortsuche, Radien und anderen Basisfunktionen bleiben unabhängig benutzbar.

## Technische Prüfungen

- Neuer Register-/Sichtbarkeitstest für **alle sieben** PRO-Icons: **PASS**
- Eye-PRO-Verfügbarkeitstest aus 4.11.245: **PASS**
- Provider-Isolation: **3/3 PASS**
- Frontend-/DRA-Vertrag: **37 Module, 195 Frontend-Dateien, PASS**
- HACS-Installationspaket: **234 byte-identische Dateien, PASS**
- Modulmanifest, Touch- und Gestenvertrag: **PASS**
- Deterministischer Build und Schutzprüfungen: **PASS**
- `git diff --check`: **PASS**

**Offener Realtest auf HA DEV VM109:** WeatherRouter entfernt → Eye **und alle zugehörigen Wetter-Icons** weg; WeatherRouter aktiviert und bereit → ursprüngliche Eye-Konfiguration inklusive Wetter-Icons wieder sichtbar. Auch auf Notebook/iPad/Android gegenprüfen.

PROD VM101, FINAL-Tag und Lizenz bleiben unverändert. Keine neue Betreiber-Referenz ohne ausdrückliche Abnahme.
