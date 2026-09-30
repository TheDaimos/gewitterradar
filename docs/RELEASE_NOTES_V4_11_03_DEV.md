# Gewitterradar V4.11.03 DEV

Stand: 30.09.2026

## Ziel

V4.11.03 erweitert den in V4.11.02 eingeführten providerneutralen Niederschlagsradar um einen begrenzten räumlichen Vorladepuffer. Beim Verschieben und Zoomen sollen angrenzende Radarkacheln nach Möglichkeit bereits verfügbar sein, ohne große Kartenansichten unkontrolliert in Arbeitsspeicher und Netzwerkverkehr wachsen zu lassen.

## Kanonische Identität

- Produkt: `4.11.03`
- Anzeige: `V4.11.03 DEV`
- Build: `V4.11.03-DEV-2026-09-30`
- Runtime: `41103r1`
- Modulsatz: `E411-03A1`
- Laufzeitmodule: `26`
- Native Integration: `0.23.2`
- `weather.precipitation-layer`: `1.1.0`

## Pufferprofile

| Profil | Kartenrand je Seite | theoretischer Flächenfaktor | maximale Zusatzkacheln | geschätzte Speichergrenze |
|---|---:|---:|---:|---:|
| Aus | 0 % | 1,00× | 0 | 0 MiB |
| Klein | 15 % | 1,69× | 24 | ca. 8 MiB |
| Normal | 30 % | 2,56× | 48 | ca. 16 MiB |
| Groß | 50 % | 4,00× | 96 | ca. 32 MiB |
| Benutzerdefiniert | 0–100 % | bis 9,00× theoretisch | bis 128 | ca. 40 MiB |

Der Prozentwert wird auf jede Seite des sichtbaren Kartenausschnitts angewendet. Die theoretische Flächenerweiterung ist deshalb größer als der reine Prozentwert. Die tatsächliche Vorladung wird immer zusätzlich durch Kachel- und Speichergrenzen begrenzt.

## Ressourcenschutz

- Speicherabschätzung auf Basis der dekodierten Bildfläche: `Kachelbreite × Kachelhöhe × 4 Byte`.
- Größere Providerkacheln reduzieren automatisch die maximal zulässige Kachelanzahl.
- Maximal vier Vorladeanforderungen gleichzeitig.
- Keine aggressive Vorladung, solange das Dokument nicht sichtbar ist.
- Sichtbare Kacheln werden nicht doppelt als Zusatzkacheln geplant.
- Zusatzkacheln werden nach Nähe zum aktuellen sichtbaren Bereich priorisiert.
- Horizontale Weltumwicklung wird berücksichtigt; unzulässige vertikale Kachelbereiche werden verworfen.
- Nicht mehr benötigte fertige Puffereinträge werden begrenzt verdrängt.
- Eine noch laufende Vorladung darf den normalen Kartenbedarf nicht blockieren; im Zweifel lädt die sichtbare Kachel regulär.

## Bedienung

Unter Weather Engine → Niederschlagsradar erscheint **Radar-Vorladebereich** mit:

- `Aus · nur sichtbar`
- `Klein · +15 % je Seite`
- `Normal · +30 % je Seite · empfohlen`
- `Groß · +50 % je Seite`
- `Benutzerdefiniert` mit 0–100 % in 5-%-Schritten

Eine Live-Statuszeile zeigt Profil, Prozentwert, theoretischen Flächenfaktor, Kachel-/Speichergrenze sowie aktuelle vorbereitete bzw. noch ladende Zusatzkacheln.

## Bewusst noch nicht enthalten

- keine zeitliche Vorladung mehrerer Radarframes;
- keine dauerhafte standortbezogene Hintergrundpufferung für Monitored Areas;
- kein unbegrenzter Browser-/Datenträgercache;
- keine Änderung an der providerneutralen WeatherRouter-Auswahl;
- keine Änderung am unabhängigen Blitzortung-Datenpfad.

## Besondere Abnahme

V4.11.03 ist zugleich der erste geeignete reale Test des in V4.11.02 eingeführten Laufzeit-Updatewächters. Ein bereits tatsächlich geladenes V4.11.02 soll das neu installierte V4.11.03-Laufzeitmanifest ohne erneute Home-Assistant-Ressourcenregistrierung erkennen und kontrolliert neu laden.

Für den Radar-Puffer sollten mindestens `Aus`, `Normal` und `Groß` bei identischem Kartenausschnitt verglichen werden. Besonders relevant sind Vollbild, zügiges Verschieben, Zoomen sowie Android-/iPad-Speicherverhalten.
