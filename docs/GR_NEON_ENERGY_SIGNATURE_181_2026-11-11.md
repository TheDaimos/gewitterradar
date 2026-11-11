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

## Installationspakete

Implementierungscommit `298a6940fe426b41c768a712ad5245678cd7f2a6`.

- `gewitterradar-0.25.88-dev.zip` · SHA256 `a38dceda5214ed01e9440a2a2398d01242f4c60ee612ef9e9dfe8f203ed7516a`
- `gewitterradar-dashboard-4.11.181-dev.zip` · SHA256 `99804f34f01e43c9e915612c1efc2d764dc3613f2db86e2e06565b7c2c0665e4`

Beide ZIPs stammen aus dem committed Git-Baum. Geprüft wurden CRC, Versionsidentität, UTF-8 und die Dateiparität zwischen HA-Frontend und Dashboard. `deployment.json` bezeichnet den Releasecommit.

## Lokale Leistungsmessung

Windows Chromium, Android-Viewport 393 × 851, DPR 3, je 8 s, reguläre Eye-Frame-Clock. Die V180-Basis für Dezent, Normal, Stark und Metalle ist V180 Aus. Die übrigen V180-Profile verwenden dieselben Aura-Abstände, Lichtwerte, dieselbe Vorschaugröße beziehungsweise denselben synthetischen Schlangenwind. Die Messung erfasst den Eye-Zeichenaufruf und die Teilzeit für Energieakzente. Die Kontaktspalte erfasst den Teilaufruf auf Frames mit Stichprobensuche einschließlich eines eventuell gezeichneten Treffers. GPU-Zeit und physische Geräte-FPS sind hier nicht erfasst.

|Stand / Profil|RAF p50/p95 ms|Draw Mittel/p95 ms|WOW Mittel/p95 ms|Energie Mittel/p95 ms|Kontakt p95 ms (n)|Treffer / s|Gleichzeitig|WOW-Pufferbytes|
|---|---:|---:|---:|---:|---:|---:|---:|---:|
|V180 off|17.8/18.4|2.66/3.80|0.90/1.50|0.00/0.00|0.00 (0)|0.00|0|1094148|
|V181 off|17.7/18.5|3.06/5.10|1.06/2.00|0.00/0.00|0.00 (0)|0.00|0|1094148|
|V181 subtle|17.7/18.4|2.87/4.40|0.91/1.50|0.12/0.20|1.60 (1)|0.12|1|1094148|
|V181 normal|17.7/18.5|2.64/4.10|0.83/1.40|0.09/0.20|1.60 (2)|0.25|1|1094148|
|V181 strong|17.8/18.3|3.18/5.70|1.06/2.20|0.15/0.30|2.40 (5)|0.62|1|1094148|
|V181 metals|17.7/18.5|2.91/4.70|0.97/1.50|0.14/0.30|2.30 (4)|0.50|1|1094148|
|V180 max-gap|17.8/53.2|3.16/5.50|1.07/2.00|0.00/0.00|0.00 (0)|0.00|0|1933312|
|V181 max-gap|17.8/35.6|2.90/4.70|0.93/1.70|0.14/0.30|3.40 (5)|0.62|1|1933312|
|V180 max-light|17.8/18.4|2.77/3.80|1.04/1.60|0.00/0.00|0.00 (0)|0.00|0|1327168|
|V181 max-light|17.7/18.5|3.34/5.70|1.28/2.30|0.14/0.30|1.50 (5)|0.62|1|1327168|
|V180 large-preview|17.9/36.2|4.01/5.40|0.88/1.30|0.00/0.00|0.00 (0)|0.00|0|1744528|
|V181 large-preview|17.8/36.1|3.78/5.40|0.90/1.40|0.16/0.30|1.70 (4)|0.50|1|1744528|
|V180 wind|17.8/18.5|2.68/3.50|0.88/1.30|0.00/0.00|0.00 (0)|0.00|0|1094148|
|V181 wind|17.8/18.5|2.76/3.70|0.85/1.40|0.10/0.20|1.50 (5)|0.62|1|1094148|

Der Trefferpfad hat keine zusätzlichen Bildpuffer. Leere Kontaktmessungen zeigen 0 (n=0). Kurze Fenster, echte Kontaktabhängigkeit und adaptive Stufen lassen Streuung erwarten. Unterschiede der Gesamtzeiten belegen keinen allgemeinen Leistungsgewinn oder eine physische Framerate.

## Öffentliche CI

Der [gezielte öffentliche Eye-Prüflauf](https://github.com/TheDaimos/gewitterradar/actions/runs/43005887305) war erfolgreich. Geprüfter Quellstand `22b1a24696c77cd39881d2917fb9d1ee7aaa7fd6`. Die bestehenden Geste-, Schnellmenü- und Neonprüfungen, 180 nichtleere V177-Pixelvergleiche, die V179-Geometrieprüfungen, 54 exakte V180-Frames, die neue Farb-/Kontaktserie und die Verifikation beider Installationspakete bestanden. Die Browser-Viewports umfassen Desktop, Desktop HiDPI, Android Hoch- und Querformat sowie iPad für die bestehenden Eye-Regressionen. Die neuen V181-Interaktionen wurden in Desktop-, Android- und iPad-Viewports geprüft. Dieser Berichtsnachtrag enthält ausschließlich Dokumentation.
