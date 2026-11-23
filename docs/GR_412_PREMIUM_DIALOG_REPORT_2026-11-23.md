# Legend Hub Premium – V4.12.10 DEV

**Frontend 4.12.10 / HA 0.25.171 · Runtime `41210r1` · Modulset `E412-10A1` · 37 Module.** Quellcommit `98fd56b0ca75ec06c95d9e8e14ab63f978015081`, Branch `deploy/dev`. Ausgangs-HEAD `020481e4` enthält gegenüber der geprüften V4.12.9-Quelle `82fbbb2d` ausschließlich weitere Dokumentation; diese bleibt erhalten.

| Punkt | Ergebnis |
| --- | --- |
| Einheitliches X | Original des Hauptdialogs unverändert in allen sechs individuellen Einstellungen wiederverwendet; Schließen-Handler und 44-px-Touchziele erhalten. Keine neuen Knöpfe auf den Wetterlegenden. |
| Titel / Einheit | `Bezeichnung · Einheit`, ohne separate Einheitenlane unter den Messwerten; bei ausgeschaltetem Titel erforderliche Einheit oberhalb der Skala bzw. weiterhin in vollständig qualifizierten Messwerten. Horizontal, vertikal und zusätzliche numerische Legenden geprüft. Wind-/Temperaturmaterial, Skalenwerte, Farben und Markierungen unverändert. |
| NASA-Link | Nur die alte Earthdata-GIBS-Quellenadresse wird bei der sicheren Linkauflösung auf die [offizielle GIBS-Dokumentation](https://nasa-gibs.github.io/gibs-api-docs/) gelenkt. Attribution, Rohmetadaten und WR-Vertrag bleiben unverändert; HTTP(S)-Prüfung, `_blank`, `noopener noreferrer` erhalten. |
| Synoptik-Zeilen | Vorhandene Front-SVGs und Erzeugung exakt erhalten; im Info-Popup einheitliche Flex-Zentrierung, 34-px-Zeilen und dezente SVG-Absenkung. Keine Wetterkarten-/Farb-/Fronttypänderung. |
| Synoptik-Details | Der bisherige Detailpfad enthält nur leere Quellen-/Modelllisten. Leerer Disclosure samt Chevron/Trennlinie entfällt; tatsächlich übergebene Metadaten einschließlich `0` und `false` bleiben zugänglich. Erklärung und Aktualitätsstatus unverändert. |
| Premium-Dialoge | Gemeinsamer Deep-Blue-Glass-/Platinrahmen, Reflexionen, schmalere native Selects mit rein dekorativer Wertefläche, ursprünglicher Silber-Chevron und metallische Material-/Farbchips. Native Textfarbe und Optionsnamen bleiben lesbar; Chips liegen kompatibel außerhalb des betriebssystemeigenen Optionsmenüs. Keine neue Dropdown-Engine, keine neuen Listener/Zustände/Schlüssel. |

Die tatsächliche Dialogbreite bestimmt das Layout: ab 680 px zwei ausgewogene Formularspalten, darunter eine. Die Vorschau bleibt letzter Abschnitt; im breiten Dialog spannt sie über beide Spalten und ist direkt sichtbar, auf dem Smartphone bleibt sie durch normales Scrollen erreichbar. Keine horizontale Formularüberbreite. Lange gewählte Werte können in der dekorativen Anzeige umbrechen; der native Select bleibt das vollständige Eingabe- und Accessibility-Element. Sämtliche Texte verwenden die vorhandenen 19 Sprachkataloge.

## Gezielt geprüft und wiederverwendet

- Statischer Scope-Guard: native Formular-/Slot-/Glas-Handler und Optionsdefinitionen, Drag/Pointer/Popover/Lifecycle, Niederschlagsnormalisierung/Quellenordnung/RY, Vault-Client/-Schema sowie alle unabhängigen Modul-Funktionskörper unverändert nach der bestehenden expliziten Cache-/Versionsnormalisierung. Der numerische Renderer unterscheidet sich ausschließlich in der optionalen dekorativen Einheitenlane; übrige Berechnung exakt gleich. [Maschinenlesbarer Vergleich](evidence/gr-v412-premium/source-proof.json).
- Gezielter tatsächlicher Frontend-Smoke mit synthetischem HA-/WR-Transport: Desktop 1280×900, Tablet 1024×768, Android-Touch 393×851. Alle sechs Dialoge schließen, native Tastaturauswahl, Material-/Farbänderung, Checkbox, Live-Vorschau, 1-/2-Spaltenwechsel anhand echter Fensterbreite, Vorschau erreichbar, fünf numerische Legenden einschließlich Titel-Aus-Fallback, NASA-Ziel im neuen Tab, Synoptik-Zeilen/Details und Reload. [Ergebnisse](evidence/gr-v412-premium/premium-results.json).
- Bestehende Hub-/Quellenmodelle, 19 Sprachen, Aura-/FINAL-Quellschutz, DRA-/Modulidentität, Syntax/JSON/YAML, 210 Kern-Frontenddateien und Spiegel-/Checksummenparität bestanden. Hi-Res-Retention: 60 Identitäten, 61 Pfade und zwölf Metadatendateien unverändert. DRA-Vollbaum/Delta/Rollback/Cache-Vertrag bestanden.
- Die zwölf unveränderlichen V4.12.9-CI-Nachweise werden für die exakt unveränderten Funktionskörper herangezogen. Nur für V4.12.10 ersetzt ein vorangestellter, fehlerschließender Quellvergleich die vollständige Aura/Eye/WOW-Browsermatrix durch diesen UI-Smoke. Modellprüfungen und übrige verpflichtende öffentliche Release-Gates bleiben aktiv. Kein erneuter lokaler vollständiger Chromium-/Android-Durchlauf unveränderter Module.

Ein historischer HA-Test reservierte sämtliche vier Retina-Chevrons ausschließlich für den Kompass-Picker. Entsprechend dem ausdrücklichen Wiederverwendungsauftrag ist ab 4.12.10 ausschließlich der gemeinsame Legend-Hub-Dialog als zweiter Consumer des rechten Silber-Originals zugelassen. Alle Originalbytes, Lossless-WebP-/104×104-/Größenprüfungen, die drei übrigen exklusiven Consumer und der vollständige Kompasscode bleiben geschützt. Der konkrete Test wurde gezielt ausgeführt und bestanden; kein pauschales Entfernen eines Gates. Der zuvor zu frühe Smoke-Check des asynchronen nativen `close`-Events wartet nun auf das tatsächliche Entfernen des Dialogs.

**Alle 8 durch die letzten Änderungen ausgelösten öffentlichen Pflichtketten auf dem exakten Quellcommit bestanden.** [Validate shared Gewitterradar frontend](https://github.com/TheDaimos/gewitterradar/actions/runs/45192108684), [Validate Gewitterradar integration](https://github.com/TheDaimos/gewitterradar/actions/runs/45192108460), [GR Settings Vault DEV acceptance](https://github.com/TheDaimos/gewitterradar/actions/runs/45192108826). Der HA-Runtime-Vertrag mit der gezielten Consumer-Ergänzung ist grün. [Vollständige aktuelle und wiederverwendete CI-Nachweise](evidence/gr-v412-premium/ci-results.json).

## Repräsentative Ansichten

| Ansicht | Desktop | Tablet / Smartphone |
| --- | --- | --- |
| Einstellungen | [Vorher](evidence/gr-v412-premium/desktop-before-settings.png) · [Nachher](evidence/gr-v412-premium/desktop-after-settings.png) | [Tablet](evidence/gr-v412-premium/tablet-after-settings.png) · [Smartphone vorher](evidence/gr-v412-premium/android-before-settings.png) · [Nachher](evidence/gr-v412-premium/android-after-settings.png) |
| Kompakte Einheitenzeile | [Vorher](evidence/gr-v412-premium/desktop-before-precipitation.png) · [Nachher](evidence/gr-v412-premium/desktop-after-precipitation.png) | [Vorher](evidence/gr-v412-premium/android-before-precipitation.png) · [Nachher](evidence/gr-v412-premium/android-after-precipitation.png) |
| Synoptik-Info | [Nachher](evidence/gr-v412-premium/desktop-after-synoptic-info.png) | [Nachher](evidence/gr-v412-premium/android-after-synoptic-info.png) |
| Smartphone-Vorschau | – | [Letzter Abschnitt erreichbar](evidence/gr-v412-premium/android-after-preview.png) |

Vorher unveränderlicher V4.12.9-Git-Baum; nachher der oben genannte Quellcommit. Tablet und Android sind Browseremulationen. Die NASA-Zieladresse wurde separat als offizielle Dokumentation erreichbar verifiziert; der Browser-Smoke prüft die sichere neue Tab-Navigation mit kontrollierter externer Zielantwort.

## DEV-Pakete

[DEV-Prerelease V4.12.10](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.12.10-dev). Beide Pakete bytegleich mit den finalen Linux-CI-Paketen.

| Paket | Dateien | SHA-256 |
| --- | ---: | --- |
| [gewitterradar-0.25.171-dev.zip](https://github.com/TheDaimos/gewitterradar/releases/download/v4.12.10-dev/gewitterradar-0.25.171-dev.zip) | 250 | `6e3097801e84291b12d3efe9e41f3383105baa74fb66fd28d0aee80b84feb097` |
| [gewitterradar-dashboard-4.12.10-dev.zip](https://github.com/TheDaimos/gewitterradar/releases/download/v4.12.10-dev/gewitterradar-dashboard-4.12.10-dev.zip) | 233 | `98da648cfe6aafb4999e508ca9e90548683b0186a5d0505cfabe7903c167975d` |

[Deploymentmanifest](evidence/gr-v412-premium/deployment.json), [Prüfsummen](evidence/gr-v412-premium/SHA256SUMS.txt), [vollständiger Original-Blob-/Linux-Abgleich](evidence/gr-v412-premium/original-blob-verification.json).

Pakete aus originalen Git-Blobs ohne Windows-Zeilenendekonvertierung, CRC und vollständiger Blobvergleich bestanden; 231 gemeinsame Frontenddateien bytegleich. DRA-Quelle und Kanal bleiben `TheDaimos/gewitterradar` / `deploy/dev`.

Keine FINAL-Veröffentlichung. VM101, WR und geschützte FINAL-/Aura-Referenzen unverändert. Installation und physische VM109-/Android-Abnahme übernimmt wie vereinbart der Betreiber; keine neue Betreiberfreigabe behauptet.
