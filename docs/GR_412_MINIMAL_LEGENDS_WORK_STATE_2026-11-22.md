# V4.12 – Nachbesserung Legend Hub / minimale Legenden

## Ausgang und Schutzinventar vor Änderungen

- Branch `deploy/dev`, HEAD `7efc8c067f31a0347c318f48d7e95d4cc5543e12`; funktionale Referenz `b0d84a0b1ccd3c3223fea8241fdd10761f132bab` (4.12.6 / HA 0.25.167). Keine vorbestehenden Änderungen an versionierten Dateien. Vorhandene unversionierte Arbeitsverzeichnisse bleiben erhalten.
- Projekt-Bootstrap, GR- und WR-Isolationsschutz, Betreiber-Referenzpaar und Aura-Referenz gelesen. WR-HEAD `728cf9ff8291fdb2e56b95e62ca1d48af7217039` bleibt unverändert.
- Geschützt: FINAL `v4.11.3`, Aura `v4.12.3-dev` / `b96f1e350eb054972bfffe3e9a631069c4c5d358`, Eye-Geometrie und Drei-Finger-Recovery, Wettercontroller, Providerverträge, Daten/Farben/Intervalle, Render- und Abfragepfade, Vault-Profilgrenzen. Keine VM101-Aktion.
- Vorhandene zwölf grünen Prüfketten gelten für die Ausgangsversion; neue Ergebnisse werden getrennt erfasst. Keine Wiederholung der abgeschlossenen Aura-Entwicklung.

## Rekonstruierter Stand und Restarbeit

- ERLEDIGT (Ausgangsversion): Hub-Slots, Long Press, sechs Legendenarten, gemeinsame Skalenoptionen, native Position-Speicherorte, Vault-Adapter, Hi-Res-Assets und geschützte Referenzen.
- TEILWEISE: Drag ist an den alten Kopf gebunden; die bisherigen großen Fenster enthalten lokale Bedienelemente. Gemeinsame kompakte Instrumenthülle und Integration erforderlich.
- OFFEN: Hintergrundtransparenz mit Profilpersistenz, motivbezogene Icon-Normalisierung, Hub-Dialog mit vorhandenem Platin-X, Entfernung des zusätzlichen Hub-Zahnrads, Minimalstruktur / Körper-Drag / explizites Info-Popup, passende Regressionen und visuelle Vergleiche, Versionierung und DEV-Pakete.

## Änderungsgrenze / Risiken

Nur Präsentationsmodule, ihr bestehender Vault-Schemaeintrag und notwendige Build-/Test-/Versionsmetadaten. Wissenschaftliche Modellnormalisierung und Tabellen im Legend Overlay bleiben identisch. Wind-/Temperatur-/Synoptikcontroller und Eye-Pointerimplementierung werden nicht geändert. Native Positionen werden weiterverwendet, keine parallelen Speicherorte oder Providerabfragen. Neue UI muss Skalenlängen/Orientierung auf Kartenmaße begrenzen, Touch-Ereignisse isolieren und alle Observer beim Teardown lösen. Alte UI-Präferenzen werden erhalten; überholte Minimierung und automatisch offene Erläuterung beeinflussen die neue Instrumenthülle nicht mehr.

## Prüfgrenzen

Lokaler Chromium mit echtem Kartenfrontend und synthetischen HA/WR-Antworten; mobile Ansichten sind Emulation. Noch keine nutzbare VM109-Browsersitzung gefunden; DEV-Adresse/Zugangsweg beim Betreiber angefragt. Reale VM109-/Android-Abnahme wird nur mit tatsächlichem Nachweis berichtet.

## Betreiberentscheidung während der Umsetzung

Der Betreiber übernimmt die reale Abnahme selbst (Antwort: „die Abnahme mache ich“). Entwicklungsumfang sind vollständige Implementierung, automatisierte Prüfungen, visuelle Browsernachweise und installierbare DEV-Pakete. VM109 und physisches Android werden nicht als durch den Agenten abgenommen ausgewiesen.

## Fortsetzungspunkt

Gemeinsame Instrumenthülle, Skalenlayout, sechs Drag-Pfade, Hub-Transparenz, Motivgrößen und Platin-X umgesetzt. Bestehende Legend-Browserkette für drei Formate bestanden. Zusätzlicher gezielter Test deckt alle sechs nativen Position-Speicherorte, Körper-/Info-Drag, explizite Erklärung, Transparenz und echte Flächenreduktion ab; Desktop bestanden. Ein Popup muss innerhalb des modalen Vollbilddialogs liegen und seinen Info-Button als Popover-Quelle behalten; korrigiert und geprüft. Profilwechseltests erweitert. Noch offen: vollständige mobile Zusatzprüfung, abschließende Ketten, Bericht und Release.

## Lokaler Abschnitt abgeschlossen

ERLEDIGT: alle sieben Produktänderungen; Modell-/Schema-/Isolations-/Identitäts-/Syntaxprüfung; deterministischer Build mit negativen Proben; bestehende Legendenmatrix in drei Formaten einschließlich tatsächlicher Beschriftungsgrenzen; neue Körper-/Info-Drags und unabhängige Reload-Positionen für alle sechs Arten in drei Formaten; explizites Info-Popup; Drei-Finger-Recovery und Viewport-Reflow; authentifizierter HA-Profilwechsel einschließlich aller sechs Positionen und Transparenz. Finale Ergänzungen der neuen CI-Matrix messen die tatsächlichen Alpha-Motivgrenzen und üben zusätzlich den Popover-Fallback aus. Noch offen: öffentliche Ketten auf dem eingefrorenen Quellcommit, endgültiger Bild-/Paketbericht und DEV-Veröffentlichung. Keine Wiederholung der Aura-Entwicklung erforderlich.

## Öffentliche CI / Fortsetzung

Produktcommit `19c7bd410f1ebc9e1efe4f5ff4be89fcb8326771`; automatische Build-Synchronisierung `f540e41b8385639d9269600995dccc821b4bd74a` ergänzt ausschließlich das erzeugte Prüfsummeninventar. Der gleichwertige lokale Inventar-Commit wurde ohne Produktverlust auf diesen Bot-Stand abgeglichen. Zwei öffentliche statische Legacy-Assertions verlangten alte Fensterköpfe/Minimieren-/Schließen-Buttons; sie prüfen jetzt die ausdrücklich beauftragte gemeinsame Minimalstruktur, entfernte Steuerelemente und erhaltene Drag-/Speicheranbindung. Alle Wetter-/Provider-/Paletten-Assertions bleiben bestehen. Historische, versionsgebundene Browserprüfungen werden nicht unnötig umgeschrieben. Öffentliche neue Ketten noch abzuwarten.
