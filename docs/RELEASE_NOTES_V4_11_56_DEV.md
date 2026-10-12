# Gewitterradar V4.11.56 DEV – Android-Menüanimation und Signatur

**Datum:** 2026-10-12  
**Ausgangsbasis:** V4.11.55 DEV, Software-Commit `d6980c240c915b9ee6066fc08c5c5eaf9c732fc0`.

## Neuer, belegter Android-Fehler
- Die Nutzer-Realabnahme V4.11.55 meldete starkes Ruckeln während horizontaler Menüwechsel und ein ausschließlich **während der Animation** flackerndes Logo; im Stillstand bleibt die Signatur stabil. Referenz: `72570.mp4`.
- Der während des Rückwechsels sichtbare Geschwindigkeitswert fiel von **Langsam** auf **Schnell**, obwohl im echten Steuerfeld Langsam gesetzt blieb: `cloneNode(true)` übernahm bei `select` nicht zuverlässig die Laufzeitauswahl.
- Die vorhandene Animation bewegte zwei große, komplexe Menükopien gleichzeitig mit dem höhenanimierten Dialog und ließ die unsichtbaren Originalbäume weiter Layout- und Zeichenarbeit ausführen. Dies ist eine konkrete, isolierbare Leistungsbelastung, kein Beleg für einen vollständigen HA-Neuaufbau.

## Minimal begrenzte Korrektur
- Kopien übernehmen Laufzeitwerte vorhandener Auswahllisten, insbesondere die tatsächlich gewählte Navigationsgeschwindigkeit – in beiden Richtungen.
- Während des Übergangs sind die weiterhin existierenden originalen Menübäume über `content-visibility:hidden` von unnötiger Zeichenarbeit ausgenommen; nach Abschluss erfolgt vollständige Rückkehr zur Bedienbarkeit.
- Die unveränderte Originalsignatur erhält eine eigene GPU-Ebene. Der beinahe deckende Dialogkopf verzichtet ausschließlich während der Bewegung auf eine unnötige Hintergrundunschärfe. Die animierten Kopien erhalten Layout-/Zeichenisolation.
- Die bewährten Dauern Schnell **220 ms**, Mittel **440 ms**, Langsam **760 ms**, synchronisierte Höhenänderung, Signatur-/Versionsankopplung und Schließen-Schutz bleiben erhalten.

## Versions- und Modulkontrolle
- **V4.11.56 DEV** / `41156r1` / `E411-56A1`, native Integration unverändert `0.25.0`.
- `ui.controls` **1.1.16** und `core.manifest` **1.2.117**. `ui.skeleton` bleibt **1.1.22**; `map.clusters-recent` bleibt **1.0.6**.
- Drei Frontend-Lieferformen, Versions-/DRA-Identität, Laufzeitmanifest und Prüfsummen synchron.
- Bereits vorhandene echte Browsertests um zwei konkrete Android-Regressionsprüfungen (Kopiewert und ausgeblendeter Originalbaum) ergänzt; bestehende Cluster-, Einzelblitz-, Gesten- und Frontend-Schutzprüfungen bleiben verpflichtend.

## Freigabegrenze
**Der GitHub-Code ist keine Android-Realabnahme.** Erst vollständig grüne CI und kontrollierte Übernahme auf `deploy/dev`, danach DRA V1 und Android-Rückmeldung. Keine Änderungen an WeatherRouter, Gewitter-Cluster-/Einzelblitzlogik, Android-Gesten oder Kartendarstellung.

## Schutznachtrag – Reihenfolge der Höhenmessung
Die natürliche Zielhöhe wird *vor* der kurzzeitigen Aktivierung von `content-visibility:hidden` für die ursprünglichen Steuerbäume gemessen. Das verhindert, dass die gemessene Zielhöhe wegen ausgeblendeter Originalinhalte zu klein wird. Die bestehende Browserprüfung kontrolliert jetzt auch die Übereinstimmung zwischen fixierter Endhöhe und natürlicher Dialoghöhe für beide Richtungen und alle drei Geschwindigkeiten.
