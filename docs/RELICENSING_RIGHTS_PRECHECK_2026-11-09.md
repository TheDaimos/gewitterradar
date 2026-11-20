# GR – Vorprüfung der Neulizenzierung (09.11.2026)

**Status: NICHT zur verbindlichen Umlizenzierung freigegeben.** Gilt für GewitterRadar V4.10 FINAL und als Ausgangspunkt für GewitterRadar Pro V4.11.

## Festgestellt

- `frozen/v4.10/LICENSE`, `COPYRIGHT.md` und README dokumentieren **GPL-3.0-only** für Software und Dokumentation.
- `COPYRIGHT.md` nennt Christian Köhler als Urheber, weist aber ausdrücklich auf mögliche Drittmaterialien und deren eigene Rechte hin.
- `BRANDING.md` behandelt Namen, Logos, Icons und Artwork getrennt von der GPL; hier steht teilweise noch die alte Form „Christian Köhler / TheDaimos“.
- `custom_components/gewitterradar/manifest.json` enthält keine weiteren Python-Paketanforderungen; daraus folgt aber **kein Nachweis**, dass sämtliche eingebundenen Frontend-Assets/Quellbestandteile alleinige Eigenwerke sind.
- Bereits rechtmäßig unter GPL bereitgestellte Fassungen behalten ihre erteilten Nutzungsrechte. Löschen alter Downloads beendet sie nicht.

## Vor einer neuen bindenden Gemeinschaftslizenz erforderlich

1. Beitrags- und Rechtekette für alle betroffenen Quellcode-/Dokumentations-/Asset-Teile nachvollziehbar prüfen (Autoren, externe Snippets, Bibliotheken, eingebundene Assets).
2. Kompatibilität einer geplanten nichtkommerziellen Lizenz mit Lizenzen der enthaltenen Drittbestandteile prüfen.
3. Umfang der künftigen Neulizenzierung auf eindeutig berechtigte Bestandteile beschränken; GPL-Rechte an alten Fassungen unberührt lassen.
4. Verbindliche Erstnennung **Christian Köhler** in Forks/Weiterentwicklungen sowie gewerbliche Genehmigungspflicht juristisch prüfen.
5. Nach Freigabe Lizenzdateien, README, COPYRIGHT, Branding-Dokumente und Releases konsistent anpassen. Keine rückwirkenden Ansprüche behaupten.

**Ergebnis:** Dokumentierte Absicht und Lizenzentwurf sind vorhanden; vollständiger Rechte-Nachweis und rechtswirksame Neulizenzierung sind mit den bisher verfügbaren Informationen nicht abgeschlossen. `LICENSE` bleibt unverändert.
