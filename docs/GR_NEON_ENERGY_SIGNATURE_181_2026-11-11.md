# GR 4.11.181 DEV · Neon Energy Signature

## Geschützte Basis

GR 4.11.180 DEV / HA 0.25.87, Runtime `411180r1`, Modulsatz `E411-180A1`, Release `33500b7c1720d6b5bd623037bad5aa5e24dd8851`. Der Betreiber hat diesen Stand als aktuelle Referenz freigegeben. Das Referenzdokument wurde vor den Codeänderungen in `ae88335f4824a81670d36155efed00f78c419f17` auf `deploy/dev` veröffentlicht. [V180-Schutzreferenz](GR_DEV_REFERENCE_4_11_180_2026-11-11.md)

Der ursprüngliche Eye-Renderer, Frame-Clock, Wetterdatenpfade, Kartengesten, verschiebbare Fachfenster und die Transparenzbedienung behalten ihre bisherige Logik. Änderungen außerhalb der Eye-Module dienen der Cache-Kennung, Versionierung, Prüfung und Auslieferung.

## Electric Gold und Silver / Chrome

| Farbe | Hexwert | Kern | Reflex | Streufarbe |
|---|---|---|---|---|
| Electric Gold | `#FFC442` | `#FFF3CB` | `#FFE3A0` | `#E7911F` |
| Silver / Chrome | `#D8E6F3` | `#F8FCFF` | `#FFFFFF` | `#819FBE` |

Die beiden Farbfelder folgen auf die acht bisherigen Farben. Die bisherigen Hexwerte, Reihenfolge, Legacy-Aliase und Standardfarben bleiben gültig. Für Gold und Chrome erhält der vorhandene Ring-Cache sparsame metallische Reflexbänder und einen farbigen Streusaum. Die Brillanzschicht nutzt für diese beiden Farben den passenden getönten Kern. Die Auswahlscheiben zeigen einen warmen bzw. kühlen Glanzstreifen. Alle Farben verwenden dieselben Filamente, Bloom-Masken, Energiebrücken und Transfers.

Die Farbauswahl markiert den aktiven Wert und fokussiert ihn beim Öffnen. Nach der Auswahl kehrt der Fokus zum Farbschalter zurück. Die neue Einstellung **Energieakzente** verwendet ein natives Select im Premium-Stil mit DE- und EN-Texten.

## Kontakt und Darstellung

- `eye-neon-energy.js` erhält die bereits gezeichneten Filamentstützpunkte. Zuerst prüft es vorhandene Brückenendpunkte auf aktuellen Kontakt. Die breitere Brückenreichweite allein löst keinen Treffer aus. Eine begrenzte Ersatzsuche tastet bei Bedarf zwei Basisfilamente benachbarter sichtbarer Ringidentitäten mit wechselndem Winkelversatz ab. Sie funktioniert auch bei Organik 0 oder gleichen Farben.
- Zwei lokale Liniensegmente werden auf Schnitt und kleinsten Abstand geprüft. Der Impuls sitzt am Schnittpunkt oder am Mittelpunkt des kürzesten Abstands bei höchstens 2,35 CSS-Pixeln. Ein Treffer braucht zwei aktive und hinreichend eingeblendete Ringe, einen sichtbaren Kontakt sowie Platz im Canvas. Ein Abstandsschutz von 8 px vermeidet aufeinanderfolgende Treffer am selben Ort.
- Der Treffer wird auf dem vorhandenen Basis-Canvas als schmaler weißer Kern mit zweifarbigem Saum und kurzem Reflexstrich gezeichnet. Sein Radius hängt von der Eye-Größe ab und bleibt unter 6,2 CSS-Pixeln. Die kurze Abklingkurve und die Variation des Reflexstrichs verwenden einen reproduzierbaren Seed. Der Treffer verändert weder die gespeicherten Ringfarben noch einen laufenden Farbtransfer. Der Aura-Bloom wird für den Treffer nicht neu berechnet.
- Ein wiederverwendbarer Impuls je Eye begrenzt das Budget auch bei niedriger Qualität. Die seltene Suche läuft nur nach Ablauf der jeweiligen Pause. Bei fehlendem Kontakt folgen weitere Stichproben nach 300 bzw. 550 ms, abhängig von der Qualitätsstufe. Bestehende Puffergrößen und Scheduler werden weiterverwendet. Es gibt keinen zusätzlichen Canvas, Sprite-Cache oder Timer.

| Modus | Pause nach gültigem Treffer | Effekt |
|---|---|---|
| Aus | keine Kontaktsuche | Standard, keine Treffer |
| Dezent | 6–12 s | etwa 110 ms, kleinerer Lichtsaum |
| Normal | 2–6 s | etwa 145 ms |
| Stark | 1–3 s | etwa 180 ms, kräftigerer Lichtsaum |

Bei gleichen Farben kann die Pause länger sein. Die Dauer variiert um ±10 %. Die Pausen sind Mindestabstände bis zur nächsten Suche. Die tatsächlichen Ereignisse hängen von den sichtbaren Filamentkontakten ab. Große Ringabstände können Treffer selten machen oder ganz verhindern.

Energieakzente laufen ausschließlich bei sichtbarer, lebender Aura. Feststehend, Reduced Motion, verborgene oder minimierte Vorschauen und weniger als zwei aktive Ringe unterbinden neue Treffer. Der Effekt hat keinen Bezug zu Blitzortung oder Wetterwarnungen.

## Speicherung und Rücksetzen

`gewitterradar:eye-bubble:v1` erhält additiv `energyAccents`. Fehlende und unbekannte Werte werden als `off` gelesen. Die Farbeinstellungen verwenden das vorhandene Hexfeld. `V4.11.177-Optik wiederherstellen` setzt weiterhin genau die vier bisherigen Lichtregler zurück. Die globale Eye-Standardwiederherstellung setzt auch Energieakzente auf Aus.

## Gezielte Prüfung und Sichtbefund

Der Browservergleich lädt beide vollständigen Modulbäume. Je Desktop-, Android- und iPad-Viewport werden 18 nichtleere deterministische V180-Frames bei Aus verglichen, mit drei Eye-Größen, drei Bloom-/Abstandskombinationen und beiden Glow-Modi. Verglichen werden Basis- und Zusatz-Canvas, Bloom-Puffer, Brückenidentitäten und Transferzustand. Die bestehende V177-Nullmodusserie bleibt Bestandteil der CI.

Die drei Viewports prüfen die Bedienung der zehn Farbfelder und vier Modi, Speicherung nach Reload, den V177-Restore sowie Gold/Chrome zusammen mit Blau und Pink im statischen und lebenden Glow. Der Test wartet auf einen realen Kontakt der gerenderten Filamente und einen bestehenden Farbtransfer. Zusätzlich erzeugt der Test kontrollierte Filamentkreuzungen und prüft den genauen Treffpunkt, das Abklingen auf Alpha 0, Aus, Abstand, Einringfall, gleichfarbige Ringe, Canvas-Grenze, statische Darstellung, Reduced Motion und versteckten Host. Bei kontrolliert bewegten Kreuzungen entstanden in 44 s 4/10/20 Treffer in Dezent/Normal/Stark. Jede Serie hielt ihre Mindestpausen ein.

V181-Sichtprüfungen und Messungen beziehen sich auf Browser-Viewports und synthetische WR-Fixtures. Android-, iPad- und HA-Geräteabnahme für V181 stehen aus.

In den lokalen Android-Vorschaubildern sind warmes Gold und kühles Chrome neben Blau und Pink klar unterscheidbar. Im feststehenden Glow sind beide Ringe geschlossen. Im lebenden Glow bleiben ihre Filamente auch dort erkennbar, wo Blau und Chrome überlagern. Die Aufnahme beim natürlichen Kontakt zeigt einen punktuellen weißen Kern im äußeren Filamentbereich. Die Bilder erzeugt `scripts/test-eye-energy-browser.cjs` im temporären Ordner `gr-eye-181`.

## Lieferidentität

GR **4.11.181 DEV** / HA **0.25.88**, Runtime `411181r1`, Modulsatz `E411-181A1`. Der DRA-Kanal bleibt `TheDaimos/gewitterradar@deploy/dev`. Die Bereitstellung führt keine Installation auf VM109 oder VM101 aus.
