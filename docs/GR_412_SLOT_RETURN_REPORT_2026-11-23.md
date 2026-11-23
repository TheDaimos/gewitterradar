# P1 Legend Hub – verschwindende Wetter-Icons · V4.12.14 DEV

**Frontend 4.12.14 DEV / HA 0.25.175 · Runtime `41214r1` · Modulset `E412-14A1` · 37 Module.** Quellcommit `7c3892bbdac79098a21e2819b98bc976112a3a46`, Branch `deploy/dev`. Ausgangs-HEAD `c8905ee4` enthält dieselben sechs Produkt-/Testbäume wie die geprüfte V4.12.13-Quelle `2557a739`. Der Betreiber hat die bisherigen Korrekturen visuell abgenommen; daraus wird keine FINAL-Veröffentlichung abgeleitet.

## Bestätigte Ursache und gezielte Korrektur

Auf dem unveränderlichen V4.12.13-Git-Baum mit echter Mausbewegung reproduziert: Der Windbutton bleibt im DOM und besitzt dieselbe Slotzuordnung, erhält aber `left`/`top` als Inline-Kartenkoordinaten. Im lokalen Nachweis 483,594 / 421,75 px; sichtbare Schnittfläche mit dem Hub danach null. Das Bild ist geladen, der Knoten weder entfernt noch ersetzt. Der gemeinsame bewegliche Control-Binder wurde für relativ im Grid angeordnete Slots ohne eigenes Layout verwendet. Sein Standardpfad setzt die Koordinaten direkt auf den Button; der bisher leere Save-Callback und die ausschließlich auf Hauptsymbol/Popout wirkende Neupositionierung entfernen den Versatz nicht.

Bei unveränderter Slotsignatur bleibt der beschädigte Knoten bestehen. Eine Änderung der Reihenfolge erzeugt neue Buttons und beseitigt damit den transienten Inlinezustand. Diese Wiederherstellung wurde ebenfalls tatsächlich nachgewiesen. Kein Verlust gespeicherter Slots, kein Wetter-/Icon-Assetfehler.

Geändert ist ausschließlich der lokale Adapter der ausgeklappten Hub-Slotbuttons: festes Layout mit Null-Bewegungsraum über die bestehende Binder-Schnittstelle. Ziehen erzeugt keine Kartenkoordinaten mehr am Grid-Slot; End- und Abbruchpfad entfernen defensiv nur `left`, `top`, `bottom`. Der erforderliche Nullanker ist rein lokaler transienter Binderzustand, keine neue Eye-/Vault-Konfiguration. Icons bleiben während und nach ungültigem Ziehen in ihren Fassungen; kein DOM-Neuaufbau zur Reparatur notwendig. Tap, Long Press und gültige Slotverwaltung behalten ihre bisherigen Pfade.

## Nachweise

- Tatsächliches Frontend mit synthetischem authentifiziertem HA-/WR-/Vault-Transport: Desktop 1280×900, Tablet 1024×768 und Android-Hochformat 393×851. Alle sechs Icons außerhalb loslassen; echte Maus-/CDP-Touch-Bewegungen, Pointer-/Touch-Abbruch, tatsächlicher Capture-Verlust, Touch-Fallback ohne Pointer, acht schnelle Wiederholungen, horizontale/vertikale/dynamische Ausrichtung und Auto-Close an/aus bestanden. Gleiche sichtbare DOM-Knoten, geladene Bilder, kein Inlineversatz, keine hängen gebliebene Geste, unveränderte Slotreihenfolge und Eye-/Kartenkonfiguration.
- Schließen/Öffnen ohne Slot-Neubau, regulärer Tap und Long Press, gültiges natives HTML-Drag-&-Drop im Desktop-Sloteditor bzw. Touch-Sortierpfeile, Reload und zwei tatsächliche Vault-Client-Profile auf Desktop/Android bestanden. [Lokaler Abschlusslauf](evidence/gr-v412-slot-return/slot-return-results.json), [öffentlicher Nachweis einschließlich historischer Reproduktion](evidence/gr-v412-slot-return/public-slot-return-results.json).
- [Strenger Quellvergleich](evidence/gr-v412-slot-return/source-proof.json): gesamtes Hub-Modul nach Rücktausch genau dieses einen Adapters identisch. Gemeinsamer Pointer-/Touch-Binder, Eye/Aura samt Styles, Legendeneinzelpositionierung, Premium/Compact Glass, Metallrahmen, Deckkraft, Farbverläufe, Sloteditor, Modelle, Vault und Wetter-/Providerpfade unverändert. Ausschließlich reguläre Release-/Importmetadaten werden normalisiert. Keine globalen Drag-/CSS-Änderungen, keine neuen Assets, Schlüssel oder Migrationen.
- Syntax, 37 registrierte Module, 210 Kern-Frontenddateien, Identität/Spiegel/Checksummen, Hi-Res-Retention und DRA-Vollbaum/Delta/Rollback/Cache-Vertrag bestanden. Ein finaler Build, keine neuen lokalen Abhängigkeiten. Die neue Fixture liest den tatsächlichen Python-Vault-Schlüsselvertrag und quittiert den normalen About-Erststart; frühere lokale Fixture-Überlagerungen beziehungsweise die historische V181-Schlüsselliste erforderten keine Produktkorrektur.

**Alle zwölf auf dem Quellcommit ausgelösten öffentlichen Pflichtketten grün.** [Frontend einschließlich fokussiertem Hub-Test](https://github.com/TheDaimos/gewitterradar/actions/runs/45254228963), [HA](https://github.com/TheDaimos/gewitterradar/actions/runs/45254228953), [Vault/Pakete](https://github.com/TheDaimos/gewitterradar/actions/runs/45254228889), [vollständige CI-Nachweise](evidence/gr-v412-slot-return/ci-results.json). Die zwölf V4.12.13-Nachweise schützen unveränderte Funktionskörper; keine erneute vollständige lokale Wetter-/Glas-/Aura-Browserkampagne. Der neue P1-Interaktionspfad wurde funktional neu geprüft.

Vergleichsbilder: [V4.12.13 mit leerer Windfassung](evidence/gr-v412-slot-return/before-lost-slot.png), [Desktop nach wiederholtem Ziehen](evidence/gr-v412-slot-return/desktop-after-repeated-drags.png), [Android-Hochformat](evidence/gr-v412-slot-return/android-after-repeated-drags.png). Visuell kontrolliert; Tablet/Android sind Browseremulationen. Neue physische Installation/Abnahme bleibt beim Betreiber.

## Installierbares DEV-Release

[V4.12.14 DEV](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.12.14-dev).

| Paket | Dateien | SHA-256 |
| --- | ---: | --- |
| [gewitterradar-0.25.175-dev.zip](https://github.com/TheDaimos/gewitterradar/releases/download/v4.12.14-dev/gewitterradar-0.25.175-dev.zip) | 250 | `35dfee319293a8b7684770c11ec977862ebc4b87c63cd8b2f2938696a0d96908` |
| [gewitterradar-dashboard-4.12.14-dev.zip](https://github.com/TheDaimos/gewitterradar/releases/download/v4.12.14-dev/gewitterradar-dashboard-4.12.14-dev.zip) | 233 | `5221a6034aa47b0efcd991df7b4879bf52d96415c8a0ec84d596c318db3d362a` |

Alle ZIP-Nutzdateien gegen ursprüngliche Git-Blobs ohne Windows-Zeilenendekonvertierung, CRC und SHA-256 geprüft; beide Pakete bytegleich mit Linux-CI. 231 gemeinsame Frontenddateien identisch. [Deploymentmanifest](evidence/gr-v412-slot-return/deployment.json), [Prüfsummen](evidence/gr-v412-slot-return/SHA256SUMS.txt), [Original-Blob-/CI-Abgleich](evidence/gr-v412-slot-return/original-blob-verification.json). DRA weiterhin `TheDaimos/gewitterradar` / `deploy/dev`.

Kein FINAL. VM101, WeatherRouter und geschützte FINAL-/Aura-/V4.12.13-Referenzen bleiben unverändert.
