# GewitterRadar PRO V4.12 – Legend Hub und gemeinsame Legenden

DEV-Abschluss **GR 4.12.6 DEV / HA 0.25.167**, Runtime `4126r1`, Modulset `E412-6A1`, Build `V4.12.6-DEV-2026-11-22`. Branch `deploy/dev`. Exakt geprüfter und für den DEV-Prerelease eingefrorener Quellcommit: `b0d84a0b1ccd3c3223fea8241fdd10761f132bab`. Vollständige öffentliche CI und installierbare Pakete sind unten nachgewiesen.

## Geschützte Ausgangsstände

V4.11.03 FINAL bleibt unverändert: Tag `v4.11.3`, Commit `af70fe2bf85a88fdea402cf46e3bd6a11903189b`. Vor dem Legend Hub wurde die vollständig geprüfte, separat installierbare [Aura-Referenz v4.12.3-dev](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.12.3-dev) gesichert; verbindliche [Referenzakte](GR_412_AURA_REFERENCE_2026-11-22.md). Legend-Hub-Basis: `b184aa475d7dede993bf9ed7e699c9dfffba7248`. WR bleibt unverändert; keine privaten WR-Actions und keine Änderung an PROD VM101.

## Umsetzung

| Bereich | Verhalten |
| --- | --- |
| Hub | Eigenständig verschiebbares Frosted Glass mit zwei wählbaren, unveränderten RGBA-Original-PNGs; Variante 1 als Standard. |
| Slots | 1–12 Plätze, Leerplätze, Zuordnung und Reihenfolge; Desktop-Drag/Drop sowie Select-/Pfeilbedienung für Touch und Tastatur. Wetter-Icons stammen aus der vorhandenen Eye-Registry. |
| Bedienung | Kurzer Tipp schaltet ausschließlich die betreffende Legende. Langer Druck bzw. F2 öffnet Einstellungen. Eigene Dialoge und eigener Hub-Anker. |
| Ausklappen | Dynamisch, links/rechts/oben/unten, horizontal/vertikal. Richtung bleibt während des Öffnens gebunden; bevorzugte Richtung wird in sicheren Kartenraum geklemmt. Sehr kleine Karten erhalten einen begrenzten, scrollbar erreichbaren Slotbereich. |
| Kartenbedienung | Autoschließen nur bei freier Kartenfläche, einschließlich des Vollbild-Kartendialogs. Zoom, Schalter, Fenster und Menüs bleiben ausgenommen. Alternativ bleibt der Hub offen. |
| Unabhängigkeit | Legenden können bei ausgeschaltetem Wetterlayer angezeigt werden. Keine Wetterabfragen, Layer-Schalter oder Providerentscheidungen durch Hub-Schalter. |
| Darstellung | Premium-Fenster und Compact Glass, eigenes X, horizontale/vertikale Anordnung, S/M/L/XL, eigene vorhandene native Positionen. Kategoriale Zusatzfenster besitzen getrennte neue Positionen. Überdeckte Fenster lassen sich durch Fokus oder sichtbare Oberfläche nach vorn holen. |
| Skalen | Clean, Precision und Thermometer Premium; Messing, Platin, Gold, Silber, Schwarz; grobe, mittlere und detaillierte Beschriftung; unabhängige Text-/Strichpositionen. |
| Innenskala | Getrennte Farb-/Strich- und Zahlenzonen, horizontal und vertikal. Zahlen und Striche erhalten eigene Flächen. |
| Text | Automatische lokale Kontrastwahl, optionale automatische Invertierung, Weiß/Schwarz/Eisblau/Mint/Champagner/Gold, unabhängig schaltbarer Schatten und Kontur. Für automatische Kontrastwahl wird mindestens 4,5:1 gegen den tatsächlich gezeichneten Zahlenhintergrund geprüft. |
| Persistenz | Bestehender Settings Vault; Profile, Server-Schema, Reload und Geräte-/Kontentrennung. Neue Darstellungspräferenzen im additiven Schlüssel `gewitterradar:legend-hub:v1`; vorhandene native Legendenpositionen bleiben maßgeblich. |
| Sprache/Zugänglichkeit | 19 Sprachvarianten, beschriftete Schalter, sichtbarer Fokus, Tastatur/F2/Escape, Touch-Alternativen und reduzierte Bewegung. |

Die neue Anzeigepräferenz `inherit/on/off` beschreibt zusätzlich, ob eine Legende unabhängig vom aktiven Wetterlayer erscheinen soll. Bestandsprofile erben unverändert ihre native Anzeige. Bestehende Checkboxen werden über ihre bisherigen Konfigurationen gespeichert und wahrheitsgemäß gespiegelt; vorhandene meteorologische Informationen oder Positionen werden nicht in einer zweiten Wetter-Registry gehalten.

## Fachliche Differenzierung und kompatible Grenzen

Niederschlag übernimmt die verifizierten WR-Paletten einschließlich der ursprünglichen 15 Regenklassen, Schnee-Quantitäten, Einheiten, Quellgruppen, NASA-Originalklassen und Zeitangaben. Fehlende Paletten werden ausdrücklich als fehlend angezeigt. Wind übernimmt die vorhandenen Beaufort-Grenzen und Windfeldfarben; Temperatur die vorhandene temperaturabhängige Palette und C/F/K-Umrechnung. Advektion bleibt bei den tatsächlichen K/h-Klassen und ihrer neutralen Nullzone. Klassenachsen werden nicht als erfundene lineare Messwertachsen dargestellt.

Synoptik besitzt kategoriale H/T-, Isobaren- und Frontsymbole statt einer erfundenen Regenbogenskala. Die Frontgeometrie wird mit der vorhandenen nativen Symbolfunktion erzeugt. Numerische Skalenoptionen sind bei kategorialen Symbolen beziehungsweise reinen Bildlegenden begründet deaktiviert und in allen 19 Varianten erklärt. Darstellung, Orientierung, Größe, Textfarbe/Effekte, Position und Sichtbarkeit bleiben konfigurierbar. Weitere tatsächlich vorhandene WR-Legenden werden über ihre Originalmodelle bzw. Originalbilder angezeigt.

Der Hub weicht vorhandenen Eye-/Kartenbedienelementen aus. Bei einer späteren Eye-Bewegung wird nur die neue Hub-Platzierung neu geprüft; der geschützte Eye-Anker wird nicht geändert. Fenster dürfen auf kleinen Displays überlappen und bleiben über Fokus/Hub-Schalter bedienbar. Physische Android-/WebView-Eigenheiten und tatsächliche HA-DEV-Installation bleiben separat abzunehmen.

## Lokale Nachweise vor öffentlichem CI-Abschluss

| Prüfung | Tatsächliches Ergebnis |
| --- | --- |
| Modell | PASS: 2184 Geometrien, Richtungsbindung, 1–12 Slots, alle Präferenzen, Beschriftungspriorität, lokaler Kontrast und 19 vollständige Sprachsätze. |
| Hub-Browser | PASS: Desktop 1280×900, Touch 393×851 und 851×393; je 112 Layoutfälle, acht Rand-Drags und 72 Skalenfälle, Slot-Änderung, Long-Press, freie Kartenfläche, reduzierte Bewegung und Reload. |
| Feld-Nachlauf | PASS: echte Karten-/Rendererintegration mit synthetischen Wind-/Temperaturfeldern. Legendenänderungen und °F-Umrechnung verändern weder Abfragezahl noch Kelvinwerte; Temperaturverweigerung löscht das Windfeld nicht. |
| Authentifizierter Vault | PASS: Hub-/Skalenwerte werden im synthetischen HA-Profil gespeichert und nach Reload wiederhergestellt; kein paralleler Browser-Schlüssel. Bestehende Mehrgeräte-/Konten-, Migration-, Konflikt-/Wiederholungs- und Offlinefälle ebenfalls bestanden. |
| Tatsächliches Python-Schema | PASS: vollständiger Roundtrip und Ablehnung ungültiger Symbole, Slots, Größen und Positionen. Kein HA-Runtime-Test vorgetäuscht. |
| Quellschutz | PASS: gesamte geschützte Aura-Implementierung entspricht nach Entfernen generierter Versionen exakt `b184aa47`; gesamte Wettermodule entsprechen außerhalb präziser UI-Adapter exakt FINAL. Regen-/Schnee-Paletten, WR-Metadaten, Quellgruppierung und Modellnormalisierung unverändert. |
| Bestehende Verträge | PASS: 27 unveränderte Wetter-/Skalen-Vertragsfälle; die beiden betroffenen Ganzdateivergleiche wurden um eine exakt reversible UI-Allowlist und separaten vollständigen Wissenschaftsvergleich ergänzt und bestanden danach. |
| Build/Metadaten | PASS: kanonischer Build, 37 registrierte Module, 207 Kern-Frontenddateien, identische Spiegel/Checksummen und konsistente Versionen. |
| Paketvorprüfungen | PASS: HACS-Staging mit 247 bytegleichen Dateien; DRA-Kontrakt mit 108 modularen Dateien. Installierbare finale ZIPs werden erst aus dem eingecheckten Kandidaten erzeugt. |
| Statisch | PASS: Python/JSON/YAML und bestehende Metadatenverträge; 19 tatsächlich ausgeführte reine Python-Vertragsfunktionen. Diagnoseprüfer bestätigt seinen eingefrorenen Vertrag; sein historischer Monolith-Detektor ist kein aktueller modularer Browsernachweis. |

Die lokale Windows-About-Golden-Referenz besitzt bereits im unveränderten Vergleichsstand einen dokumentierten Font-/Layoutunterschied. Dieser Toleranzwert wurde nicht gelockert. Der strenge öffentliche Linux-Golden-Test wird auf dem finalen Kandidaten erneut ausgeführt. Vorhandene gültige Aura-Nachweise wurden nicht neu implementiert oder als neue Hardwareabnahme ausgegeben.

## Assets

Beide 1254×1254-RGBA-Dateien sind byteidentisch in Runtime und dauerhaft geschütztem Masterbereich. [Provenienz](../artwork/legend-hub/provenance.json), [Retentionsvertrag](../tests/contracts/hires-asset-retention-v4.07.56.json).

- Symbol 1: SHA-256 `aafd3864028822f005c177e0001a2646fb8a82594a95a494bb4db79e0f6e8af7`, 2.411.557 Bytes.
- Symbol 2: SHA-256 `29317b30eec77fa85a2e412d1183584f91eefdeb3abb7455237b40ee7465f5ec`, 2.164.559 Bytes.
- Kein vorhandener Master gelöscht oder ersetzt. Das Compact-X verwendet das bestehende Close-Asset mit reinem CSS-Platinfinish; sein Original bleibt erhalten.

## Veröffentlichung und offene Realabnahme

Erster gesicherter Funktionscommit: `6eaf80b2a122af9943448c4eaab65f5a98d24ccb`, auf `deploy/dev` bereitgestellt. Retentionsprüfung nach dem Commit PASS: 60 geschützte Inhaltsidentitäten, 61 vorhandene Artwork-Pfade und zwölf Metadatendateien. Die erste öffentliche Runde bestand HA-/HACS-/Raster-/WR-Autoritäts- und Positionsprüfungen. Drei Prüfketten stoppten an derselben rein textuellen Scope-Allowlist: „Legend Hub“ war als neuer DRA-Zweck noch nicht registriert. Die präzise Testergänzung akzeptiert diese neue Funktionsbezeichnung; Produktbäume, Versionsstände und DRA-Zwecktext bleiben unverändert. Der nachfolgende öffentliche Lauf wird separat dokumentiert.

V4.12.4-Nachlauf `3eea1b6aa538a26d1438c0007d98f65c9262aa66`: öffentlicher Vault-/Neon-/Energie-/Gesture-/Paketlauf [PASS](https://github.com/TheDaimos/gewitterradar/actions/runs/45040663864), [HA-Gate PASS](https://github.com/TheDaimos/gewitterradar/actions/runs/45040555195), [Navigation PASS](https://github.com/TheDaimos/gewitterradar/actions/runs/45040555221). Alle 30 Wetter-/Quellverträge und die Aura-Browsermatrix bestanden. Die neue Legend-Hub-Matrix fand beim anschließenden F2-Aufruf eine verspätete manuelle Fokus-Rückgabe des zuvor geschlossenen Dialogs. **V4.12.5 / HA 0.25.166** entfernt ausschließlich diese zusätzliche Rückgabe und verwendet die native Dialog-Fokusverwaltung. Außerdem übernimmt die neue Advektionsbeschreibung nun dieselbe Intervallübersetzung wie die native Legende; Werte, Klassengrenzen und Farben bleiben unverändert. Kein 4.12.4-Release veröffentlicht oder nachträglich umgeschrieben.

V4.12.5 `525a4e24b01db339db874818bd44f5dec3d7d42a`: sämtliche öffentlichen Gates PASS, einschließlich [breitem Frontend, strengem Linux-Golden und kompletter Aura-/Legend-Hub-Matrix](https://github.com/TheDaimos/gewitterradar/actions/runs/45041392088), [Vault/Paketen/Neon/Energie/Gesten](https://github.com/TheDaimos/gewitterradar/actions/runs/45041392064), [HA](https://github.com/TheDaimos/gewitterradar/actions/runs/45041392050) und [Synoptik/Touch/Help](https://github.com/TheDaimos/gewitterradar/actions/runs/45041392089). Gültige Zwischenbelege bleiben erhalten.

Der abschließende gezielte Randfall-Nachlauf **V4.12.6 / HA 0.25.167** ergänzt den Schutz vollständig einheitlicher Temperaturfelder: tatsächlicher Einzelwert, konstante Originalfarbe und genau eine mittig angeordnete Beschriftung statt einer künstlichen oberen Temperatur. Modelltest und tatsächlicher synthetischer 0-°C-/32-°F-Feldlauf lokal PASS. Abgebrochene Slot-Drags verlieren außerdem ihren zuvor gemerkten Index. Wetterrenderer und wissenschaftliche Paletten bleiben unverändert. Auf diesem Stand erfolgte der finale öffentliche Freeze.

**Finaler Quellstand:** [`b0d84a0b1ccd3c3223fea8241fdd10761f132bab`](https://github.com/TheDaimos/gewitterradar/commit/b0d84a0b1ccd3c3223fea8241fdd10761f132bab). [DEV-Prerelease v4.12.6-dev](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.12.6-dev). Der Tag und die installierbaren ZIPs stammen aus exakt diesem geprüften Commit; spätere Berichtscommits ändern keine Produktdateien.

Öffentlich PASS: [breites Frontend, strenger Linux-About-Golden, komplette Aura-/Legend-Hub-/Rand-/Recovery-/Profil-/Neon-Matrix](https://github.com/TheDaimos/gewitterradar/actions/runs/45042578325), [Vault, Energie-/Pixelvergleiche, Gesten und ZIPs](https://github.com/TheDaimos/gewitterradar/actions/runs/45042578336), [HA-Runtime/Hassfest/HACS](https://github.com/TheDaimos/gewitterradar/actions/runs/45042578272), [Synoptik, Clouds, Touch und Help](https://github.com/TheDaimos/gewitterradar/actions/runs/45042578351), [Navigation](https://github.com/TheDaimos/gewitterradar/actions/runs/45042578286), [Raster-Mosaik](https://github.com/TheDaimos/gewitterradar/actions/runs/45042578369). Alle übrigen öffentlichen Läufe dieses Quellstands ebenfalls PASS; vollständiges Inventar und rohe Browserergebnisse unter [CI-Belege](evidence/gr-v412-legend/ci-results.json).

Drei tatsächliche Browserformate, zusammen 336 Hub-Layouts, 216 Erscheinungsfälle und 24 Rand-Drags. Der Desktop-Feldlauf enthält den echten synthetischen Uniformfeld-Fall mit genau 32 °F, Transport-/Werteisolation und Temperaturverweigerung bei erhaltenem Windfeld. Die authentifizierte Vault-Matrix prüft Reload, Geräte-/Kontentrennung und gespeicherte Hub-/Skalenpräferenzen. Keine Hardwareabnahme daraus ableiten.

| Paket | Dateien | Bytes | SHA-256 |
| --- | ---: | ---: | --- |
| `gewitterradar-0.25.167-dev.zip` | 247 | 43523187 | `053f0603e380148fb55191c0b52cd7c8c1ffd2efeb2175e943e6f39b265fac41` |
| `gewitterradar-dashboard-4.12.6-dev.zip` | 230 | 42927208 | `c58347b7730a7f4eab99cc916d288cfc72ff4fe7e85df711a7ece071ee372356` |

228 gemeinsame Frontenddateien bytegleich; 207 Kern-Frontenddateien und 108 modulare Dateien. ZIP-CRC und jeder archivierte Dateiinhalt gegen den exakten Git-Quellstand geprüft. Beide ursprünglichen PNGs enthalten. [Deploymentmanifest](evidence/gr-v412-legend/deployment.json) und [SHA-256-Inventar](evidence/gr-v412-legend/SHA256SUMS.txt). DRA-Kanal `deploy/dev`, Repository-Contents-Modus, Integrationsziel und Neustartvertrag unverändert; keine DRA-Konfigurationsänderung.

Linux-Browserbilder aus genau diesem CI-Lauf: [Desktop Compact Glass](evidence/gr-v412-legend/desktop-compact.png), [Touch Hochformat](evidence/gr-v412-legend/portrait-compact.png).


**Nicht durchgeführt:** Installation/Betreiberabnahme auf HA DEV VM109 und physischem Android. **Nicht geändert:** PROD VM101, WeatherRouter, FINAL-Tags und geschützte Referenzen.
