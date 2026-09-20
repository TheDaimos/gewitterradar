# Gewitterradar V4.09.02 — Kartenansichten Gerätefix

Stand: 2026-09-20

Basis: V4.09.01 Testkandidat auf V4.08 FINAL.

## Anlass

Erste reale Geräteprüfung von V4.09.01:

- Das separate Kartenfenster zeigte die Home-Assistant-Oberfläche, aber nicht zuverlässig die Karte.
- Die direkte Kartensteuerung Standard · Groß · Vollbild war im Main-Bereich zu unauffällig und wurde real nicht gefunden.

## Korrektur

- Die zwischenzeitliche breite Kartenleiste entfällt vollständig.
- Rechts unten **in der Karte** sitzt genau eine kompakte Kartenansichts-Schaltfläche.
- Das Symbol besteht aus drei gestapelten Ebenen in der verbindlichen Radius-Farblogik: unten klein/rot (Gefahr), Mitte mittel/blau (Gewitter), oben groß/gold (Beobachtung).
- Beim Tippen/Klicken öffnet sich direkt an der Schaltfläche ein kompaktes Kontextmenü nach oben/links mit **Standard · Groß · Vollbild**.
- **Eigenes Kartenfenster** bleibt gemäß Variante A ausschließlich in den Einstellungen.
- Zusätzlich gibt es in den Einstellungen die gerätespezifische **Startdarstellung** mit **Standard · Groß · Vollbild · Zuletzt verwendet**.
- Die Startdarstellung wird nur lokal im Browserprofil des jeweiligen Geräts gespeichert und verändert keine Home-Assistant-Helfer.
- Separates Fenster setzt den Gewitterradar-Host bildschirmfüllend über die HA-Oberfläche.
- Vollbild-Dialog erhält einen fixed/inset-Fallback für Browser, in denen showModal im Shadow-DOM nicht zuverlässig die Top-Layer-Darstellung liefert.
- Popup-URL trägt zusätzlich `gewitterradar_window_version=40902`.

## Unverändert

V4.08-Basis, Leaflet-Instanz, Kompassauswahl, Kompass-Pointer/Touch, Radien, Cluster, Diagnose und About-Goldenvertrag bleiben unangetastet.

## Reale Nachprüfung

1. Main: Layer-Schaltfläche rechts unten innerhalb der Karte sichtbar.
2. Layer-Symbol visuell: klein rot / mittel blau / groß gold.
3. Kontextmenü öffnet nach oben/links und bietet Standard → Groß → Vollbild.
4. Auswahl schließt das Kontextmenü; Tippen außerhalb ebenfalls.
5. Einstellungen → Startdarstellung auf jedem Gerät separat prüfen.
6. „Zuletzt verwendet“ auf mindestens zwei Geräten/Browserprofilen getrennt prüfen.
7. Einstellungen → In eigenem Fenster öffnen: Karte füllt das Fenster; normale HA-Oberfläche darf nicht sichtbar im Vordergrund bleiben.
8. Kompass im Vollbild/Fenster sichtbar und verschiebbar.
9. Desktop, iPad und Android erneut prüfen.
