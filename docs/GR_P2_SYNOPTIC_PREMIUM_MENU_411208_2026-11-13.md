# Synoptik-Premiummenü und Farbauswahl

**13.11.2026 · GR 4.11.208 DEV · HA 0.25.115 · Runtime `411208r1` · Modulset `E411-208A1`**

Ausgangsstand war `2d4e11659e6a0aa59e25b51554b7bf74189aa255` auf `deploy/dev`. Laut Betreiber waren H/T und Isobaren in GR 4.11.207 auf Android sichtbar. Die Änderung betrifft die Menüoberfläche. [Implementierungs- und Paketcommit `eb35bdc9`](https://github.com/TheDaimos/gewitterradar/commit/eb35bdc9c2acd1aaa39da74da04d3bc81f8d344d)

## Ursache und Änderung

- Das Synoptik-Panel trug `gr-premium-metal-surface`. Die Metallregeln der App galten jedoch nur für bestimmte vorhandene Panel-Klassen. Der Header übernahm gleichzeitig das Grid des zentralen Darstellungsmenüs. Dort gehört der erste schmale Track dem Icon, in der Synoptik landete darin die Überschrift.
- `frontend/modules/weather/synoptic-display.js` verwendet das vorhandene Metallfarbschema als deckende Fläche mit Goldrahmen und innerer Kontur. Der Header ordnet das Originalicon, den Titel und die zwei vorhandenen Premium-Aktionen in drei Spalten an. Auf schmalen Viewports nutzt das Panel die verfügbare Breite. Die Abschnittskarten, Chevron-Animationen und Premium-Header-Gesten bleiben an die bestehenden Helfer gebunden. Der Inhalt scrollt unter dem Header.
- Die drei H/T- und Isobarenfarben und die fünf Frontfarben öffnen einen gemeinsamen Dialog mit den vorhandenen Eye-Swatch-Komponenten. Die 21 eindeutigen Classic-/Aura-Farben haben Farbnamen und originalgetreue Farbfelder. Ein bereits gespeicherter benutzerdefinierter Hexwert erscheint als zusätzliche markierte Auswahl. Der Dialog schließt über Farbauswahl, Premium-Schließen, Escape oder einen Tap außerhalb. Er verwendet die native Dialog-Abbruchbehandlung, über die unterstützte Android-Browser auch die Zurück-Geste zustellen können.
- Farbauswahl und Deckkraft schreiben in die vorhandenen Settings-Vault-Felder. Die neue Farbe ist unmittelbar am geladenen Leaflet-Layer wirksam. WR-V2-Datenpfad, Renderfunktionen, Icon-Assets, fünfter Eye-Slot und gespeicherte Eye-Farben bleiben im Quellvergleich erhalten. Shared-Premium-, Wind-, Temperatur- und Niederschlagsmodule wurden für die Menüänderung nicht editiert.

## Prüfnachweise

- `scripts/test-synoptic-browser.cjs` prüfte 360, 393 und 412 CSS-Pixel in Chromium mit Touch. Gemessen wurden deckendes `rgb(16, 24, 32)`, Opazität 1, Metallrahmen, höchstens zwei Titelzeilen, 44-px-Aktionen ohne Überlappung und Touch-Scroll mit feststehendem Header. Der Test prüfte sämtliche Swatch-RGB-Werte, benutzerdefinierte Farben, Abbruch und Fokus, Touch-Auswahl, sofortige H/T- und Isobarenfarbe und unveränderte WR-Anfragezahl. Der bestehende Lauf deckt Leaflet-Kaltstart, unabhängige V2-Antworten, Ausfall/Ablauf, Transparenz, Short-Tap, Long-Press und Drag sowie Slot 5 ab. [Synoptik-CI](https://github.com/TheDaimos/gewitterradar/actions/runs/43480352621)
- `scripts/test-settings-vault-browser.cjs` bestätigte lokal und in CI die Wiederherstellung des fünften Eye-Slots, der gespeicherten Classic-/Aura- und benutzerdefinierten Farben sowie der Deckkraft nach Reload und in einem zweiten Browserkontext. Die Vault-CI bestand auch die geschützten Eye-/Leaflet-Gesten und Paketprüfungen. Ergänzend liefen 15 gezielte Node-Prüfungen, vier Python-Schema-/Merge-Fälle sowie deterministischer Build, Modulidentität und DRA-Vertrag. [Vault-CI](https://github.com/TheDaimos/gewitterradar/actions/runs/43480352603)
- Der Paketbau bestätigte 37 registrierte Module, drei synchronisierte Frontends und 194 gemeinsame Frontend-Dateien in beiden ZIPs. ZIP-CRC und das HACS-Staging mit 212 Dateien bestanden lokal. Die allgemeinen CI-Läufe meldeten Fehler bei GR-WEICH-05 und beim HACS-Validierungsschritt, wie beim vorherigen DEV-Stand. [Spiegel-CI](https://github.com/TheDaimos/gewitterradar/actions/runs/43480352676) · [Allgemeines Frontend](https://github.com/TheDaimos/gewitterradar/actions/runs/43480352629) · [HA-Integration](https://github.com/TheDaimos/gewitterradar/actions/runs/43480352408)

| DEV-Paket | SHA-256 |
| --- | --- |
| `gewitterradar-0.25.115-dev.zip` | `553ed4b7d5f8310d5b80e9dcffb01893bf728c9a5dc4679107c4aa5f94fda54f` |
| `gewitterradar-dashboard-4.11.208-dev.zip` | `41d8aab3da55ab84040e932e036be992193567b61551d570178487eaee4c3a2d` |

**Reale Abnahme auf HA DEV VM109 und Android steht aus.** Dort sind Metalloptik und Touch-Scroll, Android-Zurück, Farbauswahl über beide Icon-Wege und die Darstellung mit realen WR-Daten zu prüfen. WR 0.10.322 und PROD VM101 bleiben unverändert.
