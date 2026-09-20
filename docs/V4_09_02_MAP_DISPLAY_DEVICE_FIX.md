# Gewitterradar V4.09.02 — Kartenansichten Gerätefix

Stand: 2026-09-20

Basis: V4.09.01 Testkandidat auf V4.08 FINAL.

## Anlass

Erste reale Geräteprüfung von V4.09.01:

- Das separate Kartenfenster zeigte die Home-Assistant-Oberfläche, aber nicht zuverlässig die Karte.
- Die direkte Kartensteuerung Standard · Groß · Vollbild war im Main-Bereich zu unauffällig und wurde real nicht gefunden.

## Korrektur

- Kartensteuerung wird direkt oberhalb der Karte mit sichtbarer Beschriftung **Kartenansicht** dargestellt.
- Schaltflächen Standard · Groß · Vollbild sind größer und kontrastreicher.
- Separates Fenster setzt den Gewitterradar-Host bildschirmfüllend über die HA-Oberfläche.
- Vollbild-Dialog erhält einen fixed/inset-Fallback für Browser, in denen showModal im Shadow-DOM nicht zuverlässig die Top-Layer-Darstellung liefert.
- Popup-URL trägt zusätzlich `gewitterradar_window_version=40902`.

## Unverändert

V4.08-Basis, Leaflet-Instanz, Kompassauswahl, Kompass-Pointer/Touch, Radien, Cluster, Diagnose und About-Goldenvertrag bleiben unangetastet.

## Reale Nachprüfung

1. Main: Kartenansicht direkt oberhalb der Karte sichtbar.
2. Standard → Groß → Vollbild → zurück.
3. Einstellungen → In eigenem Fenster öffnen: Karte füllt das Fenster; normale HA-Oberfläche darf nicht sichtbar im Vordergrund bleiben.
4. Kompass im Vollbild/Fenster sichtbar und verschiebbar.
5. iPad/Android/Browser erneut prüfen.
