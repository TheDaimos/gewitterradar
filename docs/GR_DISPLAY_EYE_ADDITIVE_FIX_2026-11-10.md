# Eye wiederhergestellt, Premium-Emblem zusätzlich

10.11.2026 · GR **4.11.173 DEV** · HA **0.25.80** · Runtime **411173r1** ·
zentraler Modulsatz **E411-173A1**.

Basis: aktueller `deploy/dev`-HEAD
`15b5b9434ee968001ae7d9cc0cb05e0d84ad9a2e` (GR 4.11.172).
Der vorausgegangene Auftrag wurde falsch als Austausch des Augen-Kartenschalters
interpretiert. Dieses Release stellt den historischen Schalter wieder her und
fügt das Original-Emblem als zusätzlichen, unabhängigen Kartenschalter hinzu.

## Wiederhergestelltes Auge

Aus der geschützten V4.11.171, Commit
`e481277342630c77f835666bedff6758811aaa9a`, übernommen:

- Beide originalen Hi-Res-Augenassets: offen mit Iris und geschlossen.
- Originalrahmen, Hintergrund und Größen einschließlich der historischen
  Desktop-/Mobilregel (44 bzw. 46 CSS-Pixel).
- Historische Klick-/Schaltfunktion zum Öffnen und Schließen des vorhandenen
  Darstellungsmenüs sowie die dazugehörige Zustandsanzeige.
- Historische Verfügbarkeitsbehandlung: Bei nicht verfügbarer WR-Fähigkeit bleibt
  die Augenanzeige entsprechend dem bisherigen Verhalten geschlossen.
- Bestehende freie Positionierung und gespeicherter Schlüssel `eyePosition`.

Assets und Eye-CSS wurden zusätzlich direkt gegen den Quellstand 4.11.171
auf Identität geprüft. Die geschützte Referenz selbst bleibt unverändert.

## Zusätzlicher Emblem-Kartenschalter

Eigener DOM-Schalter `weather-display-control` neben dem historischen
`weather-display-eye-control`:

- Original-PNG aus 4.11.172 bytegleich weiterverwendet; SHA256
  `c0c18f4f283e350fb9612ed620af426f2ac9f8d270e8a36016c29b1fc48cecf2`.
- Weiterhin 50 × 50 CSS-Pixel Bedienfläche, passend zu Wind, Temperatur und Regen.
  Bildgröße 49,5 Pixel, sichtbarer Goldring ca. 44,88 Pixel breit. Dieselbe Größe
  auf Desktop, HiDPI und Touch; keine neue Bildbearbeitung.
- Klick/Tap und 600-ms-Long-Press öffnen/maximieren dieselbe bestehende
  Darstellungsmenüinstanz. Ein erneuter Emblem-Klick schließt sie nicht.
- Gemeinsame bewährte Pointer-/Drag-/Long-Press-Steuerung wiederverwendet;
  eigener Gestenzustand verhindert Konflikte mit dem Auge.
- Eigene normalisierte Position `displayControlPosition` innerhalb des bestehenden
  Speichers `gewitterradar:weather-display:v1`. Keine Migration oder Rücksetzung
  vorhandener Einstellungen. Speicherung folgt der vorhandenen Option
  **Position merken**.
- Ohne gespeicherte Emblem-Position erfolgt die Erstplatzierung oberhalb des Auges,
  bei fehlendem Platz seitlich, innerhalb der Kartengrenzen.
- Resize, Abbruch, ausgeblendete Seite und Entfernen der Oberfläche bereinigen
  auch die zusätzliche Geste. Der historische Augen-Positionszustand und der
  manuell gespeicherte Emblem-Positionszustand bleiben getrennt.

Die beiden Zugänge synchronisieren sich über den einzigen vorhandenen Menüstatus.
Keine zweite Menüinstanz, kein zweiter Wetterdaten- oder Darstellungszustand.

## Gezielte Prüfungen

`scripts/test-gr-display-icon-browser.cjs` lädt den vollständigen tatsächlichen
GR-/Leaflet-Modulbaum; Provider-I/O und Verfügbarkeitsmeldungen sind synthetisch.

- Desktop 1280 × 900 / DPR 1 und 1920 × 1080 / DPR 1,5.
- Android-Touch-Viewports 393 × 851 und 851 × 393 / DPR 3.
- iPad-Touch-Viewport 820 × 1180 / DPR 2.
- Beide Schalter gleichzeitig vorhanden; historische Augenbilder bei Öffnen und
  Schließen; gleiche einzige Menüinstanz über alle Zugänge.
- Emblem-Größe und sichtbarer Goldring gegenüber Wind/Temperatur/Regen gemessen.
- Native Maus-/Touch-Pointer für Klick, Long Press, Drag und Abbruch;
  kein nachfolgendes Schließen oder gleichzeitiges Kartenverschieben.
- Unabhängige Positionen, Erhalt des bisherigen Eye-Schlüssels beim ersten Laden,
  Emblem-Position nach Reload, Begrenzung nach Resize/Orientierungswechsel.
- Tastaturaktivierung auf Desktop; Wetterkonfiguration bei Menübedienung unverändert.
- JavaScript-Syntax, `git diff --check`, Versions-/Modulregistrierung und
  `scripts/verify-frontend.mjs`: vollständige Auslieferungs-/Prüfsummenparität.

Keine umfassende CI-Serie gestartet. Chromium-Viewportemulation ist keine
physische Android-/iPad-/Companion-Abnahme; WebKit ist nicht geprüft.
Keine automatische Installation auf VM109 und keine Änderung an PROD VM101.

## Dateien und Bereitstellung

Verhaltensänderung ausschließlich in `frontend/modules/weather/display-menu.js`;
gezielter Test angepasst. Release-/Cachekennungen, HA-Metadaten, Runtime-Manifest,
DRA-Provenienz, Frontendkopien und Prüfsummen über den bestehenden Build synchronisiert.
Die PNG und alle anderen Wetterrenderer/-datenpfade bleiben unverändert.
Keine Änderung an WR, Wind/Temperatur/Niederschlag, DRA-Projekt-/Kanaldateien,
historischen Referenzen oder veröffentlichten Tags/Releases.

DRA weiterhin **TheDaimos/gewitterradar@deploy/dev**.

- [Installierbares DEV-Release](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.11.173-dev)
- [HA-Paket 0.25.80](https://github.com/TheDaimos/gewitterradar/releases/download/v4.11.173-dev/gewitterradar-0.25.80-dev.zip)
- [Dashboard-Paket](https://github.com/TheDaimos/gewitterradar/releases/download/v4.11.173-dev/gewitterradar-dashboard-4.11.173-dev.zip)
- [Prüfsummen](https://github.com/TheDaimos/gewitterradar/releases/download/v4.11.173-dev/SHA256SUMS.txt)
- [Deployment-Nachweis mit vollständigem Releasecommit](https://github.com/TheDaimos/gewitterradar/releases/download/v4.11.173-dev/deployment.json)

Betreiberinstallation und physische Sichtabnahme bleiben offen.

## Paketnachweis

Implementierungscommit: `b4a452e34f0561e2dbcfcd6da1f2a209f4fc76a9`.

- `gewitterradar-0.25.80-dev.zip`: SHA256 `984ff68a7c6bab5edf8837ae87584a2d70784b6cf37381ed1733cf861f4b57c3`
- `gewitterradar-dashboard-4.11.173-dev.zip`: SHA256 `cb26109cd625e9acf5cf167ca07fdfd28145621c38a9ae48f7689e08bc174659`

The final documentation commit is the release target, recorded in deployment.json. ZIP payloads remain identical to the implementation commit.
