# GewitterRadar 4.12.8 DEV – Legend Hub und minimale Wetterlegenden

Ausgang: **4.12.6 DEV / HA 0.25.167**, geprüfter Produktcommit `b0d84a0b1ccd3c3223fea8241fdd10761f132bab`; Arbeitsbeginn auf `deploy/dev` bei `7efc8c067f31a0347c318f48d7e95d4cc5543e12`. Neue Lieferung: **4.12.8 DEV / HA 0.25.169**, Runtime `4128r1`, Modulset `E412-8A1`. Ausschließlich DEV, keine FINAL- oder Betreiberreferenzfreigabe.

## Umsetzung

1. **Glastransparenz:** Regler 0–100, Standard 65, sofortige Hintergrundänderung im ausgefahrenen Hub. 0 ergibt Alpha 1, 65 Alpha 0,35, das transparente Extrem wird bei Alpha 0,18 begrenzt. Blur 12 px, milchiger Verlauf, dezente Reflexion und Silberkante bleiben erhalten; keine Gesamt-Opacity, volle Deckkraft für Symbole und Texte. Speicherung im vorhandenen profilgebundenen Hub-Schlüssel; Backend validiert den neuen Zahlenwert.
2. **Motivgrößen:** 48-px-Slots, 6-px-Abstände, zentrierte sichtbare Motive mit 40 px Durchmesser. Skalierung verwendet die bereits vorhandenen Eye-Motivmaße einschließlich transparentem Außenrand. Keine Beschneidung oder Veränderung der Hi-Res-Originale; das Hauptsymbol bleibt eigenständig.
3. **Platin-X:** Nur der Hub-Einstellungsdialog verwendet die vorhandene Hi-Res-Schließengrafik mit der bereits eingesetzten Platin-Oberflächenbehandlung. 44-px-Touchfläche. Keine neue Grafik.
4. **Hub ohne Zahnrad:** Tatsächlich entfernter zusätzlicher Button und Layoutplatz. Slots, konfigurierte Leerslots und Reihenfolge bleiben unverändert. Hauptsymbol: Tippen öffnet/schließt, Long Press öffnet Hub-Einstellungen. Wettersymbol: Tippen schaltet die Legende, Long Press öffnet ihre Einstellungen. Tastaturalternativen bleiben an den Hub-Symbolen.
5. **Freies Verschieben:** Gemeinsame Instrumenthülle für Niederschlag, Wind, Temperatur, Advektion, Synoptik und sonstige WR-Legenden. Körper und dünner Rand sind Ziehfläche. Auch eine Drag-Geste auf dem Info-i verschiebt, ohne eine Erklärung auszulösen. Bestehende Pointer-Capture-/Cancel-/Drei-Finger-Recovery wird wiederverwendet; kein Eingriff in Eye-Pointercode. Karten-/Viewportbegrenzung einschließlich Skalierung und Safe Areas, Größenanpassung und Rücksicht auf Kartenbedienelemente einschließlich ihrer späteren Positionsänderungen. Schmale freie Zwischenräume werden genutzt; andere sichtbare Legenden werden berücksichtigt. Sechs native Position-Speicherorte bleiben erhalten.
6. **Keine lokalen Zahnräder:** Einstellungen ausschließlich am entsprechenden Hub-Symbol. Keine lokalen F2-/Kontextmenü-/Long-Press-Konfigurationshandler an den Instrumenten.
7. **Echte Minimalstruktur:** Neuer DOM besteht aus Instrumentkörper und genau einem Info-Button. Alte Kopf-, Aktions-, Minimieren-/Maximieren-/Schließen- und View-Picker-Container werden nicht mehr erzeugt. Gemeinsame Skalen berechnen ihre Größe aus Balken, Beschriftungs- und Strichspuren; keine festen 122-/210-px-Leerflächen. Alle Größen, Orientierungen, Stile, Materialien, Schriftfarben, Invertierung und geteilten Innenskalen bleiben nutzbar. Die bisherige Klassen-/Balkenwahl für den ausführlichen Fachinhalt liegt jetzt ebenfalls im individuellen Hub-Konfigurationsdialog.

Das Info-i öffnet ausschließlich nach Betätigung ein separates, schmales Popup. Es liegt auch im Vollbild innerhalb des nativen modalen Kartenbereichs, unterstützt Escape und Schließen durch Klick außerhalb und behält den Info-Button als Popover-Quelle. Alte gespeicherte Minimierungs-/Erklärungswerte werden nicht gelöscht; die neue Instrumentansicht übernimmt daraus keine versteckte Legende und keine automatisch offene Erklärung.

## Fachliche und technische Isolation

Niederschlagstabellen, WR-Metadaten, DWD-/OPERA-Gruppierung, Quellen-/Zeitunterschiede und Modellnormalisierung sind unverändert. Farbklassen und Grenzwerte bleiben original; nähere Quellen-, Klassen- und Zeiterklärungen stehen im Info-Popup. Wind behält Beaufort-/Geschwindigkeitseinheiten und vollständige Windfiederbeispiele im Info-Popup. Temperatur und Advektion beziehen Skalen weiterhin aus den nativen Konfigurationen und tatsächlichen Datenbereichen; ein konstantes Feld erzeugt genau einen tatsächlichen Wert. Synoptik verwendet weiterhin dieselben Frontsymbolpfade sowie H/T und Isobaren. Bildlegenden behalten das Quellenbild.

Unverändert geschützt: FINAL `v4.11.3` (V4.11.03 FINAL), Aura `v4.12.3-dev`, offizielle WR-/GR-Betreiberreferenz, vollständige Eye-/Aura-Körper und Wetterberechnung außerhalb der bereits freigegebenen Präsentationsadapter. WeatherRouter, Provider, Wetterabfragen, Wind-/Temperaturrenderer, Rasterpfade und VM101 wurden nicht geändert. Die neue Hilfsdatei ist kein zusätzlich registriertes Laufzeitmodul. DRA-Kanal, Installationsvertrag und Repository-Contents-Verfahren bleiben unverändert.

## Prüfungen und visuelle Vergleiche

Prüfungen verwenden das tatsächliche Kartenfrontend und Leaflet in Chromium; HA-/WR-Antworten sind synthetisch. Desktop 1280×900, Touch-Hochformat 393×851, Touch-Querformat 851×393, jeweils DPR 2. Die mobilen Ansichten sind Emulation. **Der Betreiber übernimmt die reale Abnahme auf VM109 und physischem Android selbst.** Es wird keine Hardware- oder installierte VM109-Abnahme behauptet.

- Modellprüfung: 2184 Hub-Geometrien, alle Optionen, Beschriftungspriorität, Kontrast, 19 Sprachen und unveränderte Original-PNGs.
- Bestehende Legend-Browserkette: 336 Hub-Layouts, 216 tatsächliche Skalenanordnungen, 24 Hub-Rand-Drags; unabhängige Wetter-Layer, Long Press, Slotbearbeitung, freie Kartenfläche, Eye-Koexistenz, Kategorien, reduzierte Bewegung und Reload. Fachlicher Desktop-Negativfall isoliert verweigerte Temperatur gegenüber Wind; konstantes Feld bleibt genau 32 °F.
- Neue Minimal-Browserkette: Hintergrundwerte 0/65/100, volle Icon-Deckkraft und Blur; richtige Schließengrafik; kein zusätzlicher Gear-Slot; Motivdurchmesser einschließlich tatsächlicher Alpha-Pixelgrenzen; tatsächlicher DOM ohne alte Fensterstruktur; Körper- und Info-Drag für alle sechs Arten; keine Kartenbewegung; explizites Info-Popup; unabhängige Positionen mit Reload, Drei-Finger-Recovery und Viewportwechsel.
- Authentifizierter Vault-Test: neuer Transparenzwert und alle sechs Positionen über vorhandene Server-Profilfelder; keine parallele lokale Ablage; Reload und Wechsel in ein anderes Profil und zurück.
- Isolationsvergleich: exakte geschützte Aura-/Eye-Körper und vollständige Wetterlogik außerhalb ausdrücklich erlaubter Präsentationsadapter. Deterministischer Frontend-Build einschließlich negativer Source-/Asset-/Inventar-Proben; Runtime-/DRA-Identität und Python-/JSON-/YAML-Prüfung.

Vorherbilder stammen direkt aus dem unveränderlichen Git-Baum `b0d84a0b…`, mit gleichem synthetischem Transport und gleicher Ansicht. Nachherbilder zeigen die neue Instrumentstruktur. Belegt werden Hub, Niederschlag, Wind, Temperatur, horizontales/vertikales Compact Glass sowie mehrere gleichzeitige Legenden jeweils auf Desktop und im Touch-Hochformat. Messwerte und finale CI-Belege stehen unten. Die Querformatmatrix prüft zusätzlich den Browserpfad ohne native Popover-API.

## Lieferabschluss

**Geprüfter Quellcommit:** [`eb2673573fb9d593818bbacdf1a1069714f291d4`](https://github.com/TheDaimos/gewitterradar/commit/eb2673573fb9d593818bbacdf1a1069714f291d4). [Installierbarer DEV-Prerelease v4.12.8-dev](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.12.8-dev). DEV-Tag und Pakete stammen aus diesem exakten Commit. Ein nachfolgender Berichtscommit verändert die Produktbäume nicht.

**Zwölf öffentliche Prüfketten für den identischen Produktstand PASS.** Nach der reinen Test-Timingkorrektur wurden die geänderte Legendenmatrix und die automatisch gestarteten Ketten erneut ausgeführt. Unverändert gültige grüne Läufe von `e6f93652…` wurden ressourcenschonend übernommen: Frontend, Integration, Dashboard, Workflows und bestehende Tests besitzen identische Git-Bäume; ausschließlich die Wartebedingung im neuen Minimal-Browsertest und der Arbeitsbericht unterscheiden sich. Jeder Lauf ist mit seiner tatsächlichen Quell-SHA und dem Baumvergleich dokumentiert. [Vollständiges CI-Inventar und Aura-/Hub-Ergebnisse](evidence/gr-v412-minimal/ci-results.json), [neue Minimal-/Drag-/Motivmatrix](evidence/gr-v412-minimal/minimal-results.json). Darin: tatsächliche Alpha-Pixelgrenzen der Originalgrafiken, alle sechs Körper-/Info-Drags je Format, unveränderte Leaflet-Karte, Profilpositionen nach Reload, Drei-Finger-Recovery und Größenwechsel. Der authentifizierte Vault-Lauf prüft außerdem Wechsel zwischen zwei HA-Profilen und zurück. Der letzte Linux-Lauf enthält ebenfalls den strengen About-Golden-Vergleich; die bekannten Windows-Schriftmetrikunterschiede wurden nicht durch Toleranzänderungen verdeckt.

- [Frontend / Aura / Legenden / strenger Golden](https://github.com/TheDaimos/gewitterradar/actions/runs/45072262970)
- [Vault / Profile / Pixel / Pakete](https://github.com/TheDaimos/gewitterradar/actions/runs/45070494862)
- [HA-Runtime / Hassfest / HACS](https://github.com/TheDaimos/gewitterradar/actions/runs/45072262847)
- [Synoptik / Clouds / Touch / Help](https://github.com/TheDaimos/gewitterradar/actions/runs/45070494812)

### Tatsächlich gemessene Flächenreduktion

| Ansicht / Legende | Vorher (CSS px) | Nachher (CSS px) | Weniger Fläche |
| --- | ---: | ---: | ---: |
| desktop / Niederschlag | 304.0 × 264.8 | 339.0 × 58.0 | 75.6 % |
| desktop / Wind | 304.0 × 853.0 | 339.0 × 56.0 | 92.7 % |
| desktop / Temperatur | 304.0 × 347.0 | 339.0 × 56.0 | 82.0 % |
| portrait / Niederschlag | 304.0 × 264.8 | 339.0 × 58.0 | 75.6 % |
| portrait / Wind | 304.0 × 768.0 | 339.0 × 56.0 | 91.9 % |
| portrait / Temperatur | 304.0 × 347.0 | 339.0 × 56.0 | 82.0 % |

Die vollständigen Windfiederbeispiele stehen im expliziten Info-Popup; der Instrumentkörper enthält ausschließlich die kompakte Geschwindigkeitsskala. Die Bildlegenden und kategorischen Synoptiksymbole verwenden dieselbe Instrumenthülle.

### Vorher-/Nachher-Bilder aus dem geprüften Linux-Lauf

Synthetische HA-/WR-Umgebung, tatsächliches Frontend; mobile Browseremulation mit DPR 2. Vorher unveränderlicher Git-Baum `b0d84a0b…`, nachher exakt der oben genannte Quellcommit.

| Vergleich | Desktop | Touch-Hochformat |
| --- | --- | --- |
| Legend Hub | [Vorher](evidence/gr-v412-minimal/desktop-before-hub.png) · [Nachher](evidence/gr-v412-minimal/desktop-after-hub.png) | [Vorher](evidence/gr-v412-minimal/portrait-before-hub.png) · [Nachher](evidence/gr-v412-minimal/portrait-after-hub.png) |
| Niederschlag | [Vorher](evidence/gr-v412-minimal/desktop-before-precipitation.png) · [Nachher](evidence/gr-v412-minimal/desktop-after-precipitation.png) | [Vorher](evidence/gr-v412-minimal/portrait-before-precipitation.png) · [Nachher](evidence/gr-v412-minimal/portrait-after-precipitation.png) |
| Wind | [Vorher](evidence/gr-v412-minimal/desktop-before-wind.png) · [Nachher](evidence/gr-v412-minimal/desktop-after-wind.png) | [Vorher](evidence/gr-v412-minimal/portrait-before-wind.png) · [Nachher](evidence/gr-v412-minimal/portrait-after-wind.png) |
| Temperatur | [Vorher](evidence/gr-v412-minimal/desktop-before-temperature.png) · [Nachher](evidence/gr-v412-minimal/desktop-after-temperature.png) | [Vorher](evidence/gr-v412-minimal/portrait-before-temperature.png) · [Nachher](evidence/gr-v412-minimal/portrait-after-temperature.png) |
| Compact horizontal | [Vorher](evidence/gr-v412-minimal/desktop-before-horizontal.png) · [Nachher](evidence/gr-v412-minimal/desktop-after-horizontal.png) | [Vorher](evidence/gr-v412-minimal/portrait-before-horizontal.png) · [Nachher](evidence/gr-v412-minimal/portrait-after-horizontal.png) |
| Compact vertikal | [Vorher](evidence/gr-v412-minimal/desktop-before-vertical.png) · [Nachher](evidence/gr-v412-minimal/desktop-after-vertical.png) | [Vorher](evidence/gr-v412-minimal/portrait-before-vertical.png) · [Nachher](evidence/gr-v412-minimal/portrait-after-vertical.png) |
| Mehrere Legenden | [Vorher](evidence/gr-v412-minimal/desktop-before-multiple.png) · [Nachher](evidence/gr-v412-minimal/desktop-after-multiple.png) | [Vorher](evidence/gr-v412-minimal/portrait-before-multiple.png) · [Nachher](evidence/gr-v412-minimal/portrait-after-multiple.png) |

### Installation und Paketintegrität

Die ZIPs wurden aus den originalen Git-Blobs des finalen Commits erzeugt und sind bytegleich mit den erfolgreich geprüften Linux-CI-Paketen aus Lauf 45070494862. Die Deploymentmetadaten nennen den finalen Testquellcommit. Jeder der 248 Integrations- und 231 Dashboard-Dateiinhalte wurde zusätzlich gegen die originalen Git-Blobs des Quellcommits geprüft; ZIP-CRC ist fehlerfrei. 229 gemeinsame Frontenddateien sind bytegleich, die Kernprüfung umfasst 208 Frontenddateien und 37 registrierte Module. Hi-Res-Retention: 60 geschützte Inhalte, 61 Pfade und zwölf Metadatendateien vollständig erhalten.

| Paket | Dateien | Bytes | SHA-256 |
| --- | ---: | ---: | --- |
| `gewitterradar-0.25.169-dev.zip` | 248 | 43522637 | `c6c11a7d81dd27f1f49d6160c8767e453121c0f2be10132cec1f3cbe8f45a5fd` |
| `gewitterradar-dashboard-4.12.8-dev.zip` | 231 | 42926734 | `85432646f6b78dcad59e6758be2a2c1d4e89a93f3fa8f1919198cd79392adea9` |

[Deploymentmanifest](evidence/gr-v412-minimal/deployment.json), [SHA-256-Inventar](evidence/gr-v412-minimal/SHA256SUMS.txt), [Prüfung der originalen Git-Blobs](evidence/gr-v412-minimal/original-blob-verification.json). Das Integrationspaket enthält **HA 0.25.169** einschließlich des erweiterten Vault-Schemas; für die neue Transparenzpersistenz Integration und Frontend zusammen aktualisieren. Das Dashboard-ZIP liegt zusätzlich bei. Vorhandene DRA-Quelle `TheDaimos/gewitterradar`, `deploy/dev`, Integrationsziel und Neustartvertrag bleiben unverändert.

**Reale Abnahme:** Der Betreiber übernimmt Installation und Prüfung auf HA DEV VM109 / physischem Android selbst, wie während der Umsetzung ausdrücklich festgelegt. Durch den Agenten wurden keine VM-Installationen vorgenommen. VM101, WeatherRouter, FINAL- und Aura-Referenztags bleiben unverändert.
