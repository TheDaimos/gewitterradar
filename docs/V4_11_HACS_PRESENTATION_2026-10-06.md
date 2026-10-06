# V4.11 – HACS-Präsentation

Stand: **2026-10-06**

## Ziel

Beim Öffnen des Gewitterradar-Repositories in HACS soll nicht zuerst eine rein technische Installationsansicht erscheinen. HACS soll die Repository-README ausdrücklich rendern und damit einen hochwertigen Produkteinstieg zeigen.

## Umsetzung

- `hacs.json` setzt `render_readme: true`.
- Die README beginnt mit dem bestehenden Gewitterradar-Hero und Branding.
- Die vollständige HTML-Projektseite bleibt die zentrale ausführliche Präsentation.
- Die HACS-README zeigt eine kompakte Vorschau mit Karten-, Weltkarten-, Kompass- und Verlaufsgrafik.
- Kernfunktionen und native Seitenleistenintegration werden vor den technischen Installationsdetails erklärt.
- Bestehende ausführliche Installations-, Migrations- und Diagnoseinformationen der README bleiben erhalten.

## Wartungsprinzip

Die vollständige Gestaltung wird nicht als zweite HTML-Version in HACS dupliziert. HACS verwendet eine Markdown-taugliche Kurzfassung mit bestehenden Projektassets und verlinkt prominent auf:

`https://thedaimos.github.io/gewitterradar/`

Damit bleibt die HTML-Projektseite die zentrale visuelle Referenz und die HACS-Darstellung wartungsarm.
