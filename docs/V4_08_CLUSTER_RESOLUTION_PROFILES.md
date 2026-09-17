# Gewitterradar V4.08 – Cluster-Auflösungsprofile

Stand: 17.09.2026  
Status: TEST

## Ziel

Die Cluster-Auflösung wird nicht mehr als Ein/Aus-Funktion behandelt. Stattdessen wählt der Benutzer ein Profil dafür, **wann Cluster beim Hineinzoomen in Einzelblitze aufgelöst werden**.

Die Oberfläche verwendet:

> **Cluster-Auflösung**  
> *Wann Cluster in Einzelblitze aufgelöst werden*

## Profile

### Früh

Cluster lösen früher auf. Aktuelle V4.08-Testschwellen:

- Gefahr: immer Einzelblitze;
- Gewitterzone: Einzelblitze ab Zoom 9;
- Beobachtungszone: Einzelblitze ab Zoom 11;
- außerhalb Beobachtung: Einzelblitze ab Zoom 11;
- maximaler Cluster-Fokuszoom: 8.

### Ausgewogen

Entspricht der bisher erfolgreich getesteten zonenabhängigen V4.08-Abstimmung:

- Gefahr: immer Einzelblitze;
- Gewitterzone: Einzelblitze ab Zoom 10;
- Beobachtungszone: Einzelblitze ab Zoom 12;
- außerhalb Beobachtung: Einzelblitze ab Zoom 12;
- maximaler Cluster-Fokuszoom: 9.

### Spät

Cluster bleiben beim Hineinzoomen länger zusammen:

- Gefahr: immer Einzelblitze;
- Gewitterzone: Einzelblitze ab Zoom 11;
- Beobachtungszone: Einzelblitze ab Zoom 13;
- außerhalb Beobachtung: Einzelblitze ab Zoom 13;
- maximaler Cluster-Fokuszoom: 10.

### Klassisch · V4.07.56

Dies ist der unveränderte geschützte Rückfallpfad:

```text
Einzelblitz, wenn:
  Gefahr
  ODER innerhalb Beobachtungsradius UND Zoom >= 8
  ODER außerhalb Beobachtungsradius UND Zoom >= 12
```

Der Gewitterradius besitzt in diesem klassischen Verhalten keine eigene Auflösungsschwelle. Der historische Cluster-Fokus bleibt auf maximal Zoom 9 begrenzt.

## Persistenz und Migration

Die Auswahl wird browserlokal unter

`gewitterradar:v40822:cluster-resolution-profile`

gespeichert.

Migration der vorherigen V4.08-Testeinstellung:

- `zoned` → `balanced` / **Ausgewogen**;
- klassischer bzw. nicht aktivierter Zustand → `classic` / **Klassisch · V4.07.56**.

## Auswirkungen eines Profilwechsels

Ein Wechsel ist eine strukturelle Darstellungsänderung. Deshalb wird eine laufende Cluster-Navigation bewusst beendet und die Clusterliste mit dem neuen Profil neu aufgebaut. Dies verhindert, dass ein eingefrorener Browser-Snapshot mit einer inzwischen anderen Auflösungsrichtlinie vermischt wird.

## Cluster-Navigation · Sitzungszeit

Die frühere Bezeichnung **„Cluster-Sprung · Sitzungszeit“** wird zu **„Cluster-Navigation · Sitzungszeit“**. Die Funktion bleibt unverändert: 5–3600 Sekunden oder unbegrenzt (`∞`), einschließlich des direkten Umschaltens Countdown ↔ `∞` in der Statusanzeige.

## Abgrenzung zu „Automatisch“

Ein adaptives Profil **Automatisch** ist in V4.08.22 ausdrücklich noch nicht implementiert. Eine spätere Automatik darf erst so benannt werden, wenn sie tatsächlich zusätzliche Faktoren wie Zone, Dichte, Alter/Freshness und Zoom dynamisch berücksichtigt. Die drei V4.08-Profile Früh/Ausgewogen/Spät sind bewusst deterministische Varianten derselben zonenabhängigen Richtlinie.

## Schutzrahmen

- `Klassisch · V4.07.56` muss das geschützte Verhalten exakt reproduzieren.
- V4.07.56 und `frozen/v4.07.56` bleiben unverändert.
- Cluster-Browser-Snapshot, stabile IDs, `x/N` und die abgenommene Countdown/∞-Navigation bleiben regressionsgeschützt.
