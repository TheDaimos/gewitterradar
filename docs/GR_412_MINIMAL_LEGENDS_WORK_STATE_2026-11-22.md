# V4.12.8 – technischer Abschluss

**ERLEDIGT:** alle sieben Nachbesserungen, lokale gezielte Tests, zwölf grüne öffentliche Ketten mit dokumentierter Produktbaum-Identität; geänderte Legendenprüfung auf `eb2673573fb9d593818bbacdf1a1069714f291d4`, tatsächliche Desktop-/Touch-Vergleichsbilder, Original-Blob-/CRC-/Versions-/Paritätsprüfung beider Installationspakete. GR 4.12.8 DEV / HA 0.25.169, Runtime `4128r1`, Modulset `E412-8A1`. Produktentwicklung abgeschlossen; keine neue Referenzfreigabe.

[Finaler Prüfbericht](GR_412_MINIMAL_LEGENDS_REPORT_2026-11-22.md) enthält Quellen, zwölf CI-Links, 28 Vergleichsbilder, Flächenmessungen, Gesten-/Motiv-/Profilnachweise und Paketidentitäten. Der DEV-Tag bleibt auf dem exakt geprüften Quellcommit. Nachfolgender Berichtscommit hat identische Produktbäume.

**Abnahme beim Betreiber:** „die Abnahme mache ich“. Keine tatsächliche VM109- oder Hardwareabnahme durch den Agenten behaupten. VM101, WR und die geschützten FINAL-/Aura-Referenzen unverändert.

**Verbindliche Releasepakete:** `.task412-work/minimal-release-v4128/`, erzeugt aus originalen Git-Blobs und bytegleich mit Linux-CI-Lauf 45070494862; Deploymentmetadaten nennen den finalen Quellcommit. Diese Dateien wurden gegen sämtliche originalen Git-Blobs geprüft. Der lokale Windows-Kandidat unter `.task412-work/minimal-release-v4127/` enthält aufgrund core.autocrlf CRLF-konvertierte Pythondateien und wird NICHT veröffentlicht. Keine früheren Kandidaten oder fremden Arbeitsordner überschreiben/löschen.

Ursprüngliche Bestandsaufnahme und Risiken sind im ersten Produktcommit 19c7bd41 dokumentiert. Der einzige CI-Vertragsnachlauf änderte zwei statische Erwartungen an ausdrücklich entfernte Fenstersteuerungen; alle fachlichen Schutzprüfungen blieben erhalten. Der Kandidat 4.12.7 bestand die zwölf Ketten; erst die anschließende visuelle Endkontrolle fand eine Standardpositions-Überlagerung. Die finale Version 4.12.8 korrigiert enge freie Zwischenräume und berücksichtigt Cluster-Navigation sowie andere Instrumente; ein tatsächlicher Info-Hit-Test schützt die Standardpositionen.
