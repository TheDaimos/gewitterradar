# GR-EYE-BUBBLE-HUB-01

10.11.2026 · **GR 4.11.174 DEV / HA 0.25.81** · Runtime **411174r1** ·
zentraler Modulsatz **E411-174A1**.

Basis: tatsächlicher aktueller `deploy/dev`-HEAD
`5cbf9ea07b536138661e1c8b83153fd99dc157d0` mit zusätzlicher geschützter Referenz
4.11.173. Geschützte Referenzen 4.11.171/173 und frühere Tags/Releases bleiben
unverändert. Dieses Release wird nicht automatisch zur geschützten Referenz erklärt.

## Bedienung und Bestandsschutz

**Bestandsinstallationen starten mit Gruppierung AUS.** Wind, Temperatur,
Niederschlag und das zusätzliche Layer-Stack-Regler-Original bleiben als
Einzelicons unter ihren vorhandenen Sichtbarkeits- und Positionsregeln erhalten.
Das Eye wird in diesem Modus nicht als weiterer Kartenschalter aufgezwungen.
Der neue Konfigurator ist dauerhaft unter **Einstellungen → Kartendarstellung →
Eye-Bubble-Menü** erreichbar, sowohl klassisch als auch modern.

Bei Gruppierung EIN öffnet/schließt Eye-Kurzklick ausschließlich die Bubbles.
600-ms-Long-Press, F2 oder die Kontextmenütaste öffnen den Konfigurator.
Das Eye zeigt den geöffneten/geschlossenen Hubstatus, keine Wetteraktivierung.
Außenaktion, Escape, Seitenwechsel/Blur und Unmount schließen den Hub zuverlässig.

Die vier echten Funktionen sind registriert: Wind, Temperatur, Niederschlag,
WeatherRouter-Layer/Darstellung. Ihre vorhandenen Tap-/Long-Press-Funktionen
werden aufgerufen. Das WR-Layer-Emblem öffnet weiterhin genau dieselbe vorhandene
Darstellungsmenüinstanz. Keine Kopie dieses Menüs und kein zweiter Wetterzustand.
Gruppiert gibt es keine gleichzeitigen eigenständigen Duplikate. Nicht zugewiesene
Funktionen werden nicht ausgeschaltet; ihre Fachmenüs bleiben erhalten.

## Originalgrafiken und Gestaltung

Beide **1254 × 1254** Originalmaster stammen unverändert aus
`artwork/help-icons/hires/`:

| Zustand | Quelle → Runtime-Kopie | SHA256 |
| --- | --- | --- |
| Offen | `help-display-eye-open-master-1254.png` → `frontend/assets/gr-eye-open-master-1254.png` | `e6e5ea0ed5de3fd674088c99e6edf5dc68a5381ba56c1e16521b499380e74098` |
| Geschlossen | `help-display-eye-closed-master-1254.png` → `frontend/assets/gr-eye-closed-master-1254.png` | `db78b467fb2dc91bb469390b68bb98968e615d6f721f98a743394ab4dd50d49f` |

Keine Neuzeichnung, Nachbearbeitung oder Vergrößerung eines kleinen Runtimebilds.
Masterdateien werden auch für beide Vorschauen und den Konfiguratorheader verwendet.
Der zusätzliche Karten-Kachelrahmen entfällt vollständig. Eye-Bildgröße **36–72 px**,
Standard **42 px**; Touchziel mindestens **50 × 50 px**. Gemessen an den horizontalen
Goldgrenzen wächst das Motiv gegenüber dem historischen 34-px-Bild um ca. **23 %**
(offen ca. 30 → 37 px, geschlossen ca. 29,5 → 36,5 px), entsprechend dem Ziel ca. 20 %.

Wind-/Temperatur-/Niederschlags-/WR-Layer-Originale bleiben bytegleich.
Das Layer-Regler-PNG hat weiterhin SHA256
`c0c18f4f283e350fb9612ed620af426f2ac9f8d270e8a36016c29b1fc48cecf2`.

Die tatsächlichen Kompass-Dialogoberflächen und der originale Vorschau-Halo wurden
unverändert in `compass-preview-style.js` extrahiert und werden von Kompass und
Eye-Konfigurator gemeinsam verwendet. Der Modelltest vergleicht beide CSS-Blöcke
mit dem geschützten Ausgangsstand. Dieser dekorative Vorschau-Halo bleibt von der
funktionalen Status-Aura und dem separat regelbaren runden Eye-Kontrasthintergrund getrennt.

## Architektur und Einstellungen

- `eye-hub-model.js`: defensives Schema v1, Slotoperationen, Farbregeln,
  Aura-Wahrheitstabelle, slotfeste Ringradien, kompakte Bubble-Geometrie.
- `eye-hub-registry.js`: erweiterbare Funktionsregistry mit echten vorhandenen
  Aktionen, Originalassets, Aktivität/Verfügbarkeit und Statusbeschriftung.
- `eye-hub-view.js`: gemeinsamer Eye-/Bubble-Renderer für Karte und Live-Vorschau;
  Premium-Konfigurator, visuelle Auswahl, Farben, Schutz-Pop-ups und Pointer-Drop.
- `eye-hub.js`: Anschluss an bestehende Oberfläche, Positionsregeln, Lifecycle und
  ereignisgesteuerte Statusaktualisierung. Keine neue Polling-/Wetterabfrageschleife.
- `eye-hub-locales.js`: neue Texte über den bestehenden `_t()`-Resolver.

Einstellbar: Gruppierung, gemeinsamer Aura-Schalter, Eye-Größe, Slotzahl,
Slotzuordnung, acht Neonfarben **pro Funktions-ID**, globale Intensität und
Helligkeit sowie unabhängige Kontrastschattierung. Standardwiederherstellung
verwendet einen eigenen Premium-Schutzdialog, keine nativen alert/confirm-Fenster.
Minimieren/Maximieren nutzt vorhandene Premium-Bedienelemente; Close ist das
vorhandene Gold-X. Die Vorschauen stehen auf Desktop nebeneinander, bei schmalen
Ansichten geschlossen oben/offen darunter. Beide verwenden denselben Halo.

UI: **1–8 Slots**, Datenmodell/Layout bis **12** vorbereitet. Anfangsbelegung
Wind/Temperatur/Niederschlag/WR-Layer. Plus hängt genau einen leeren Slot an;
Minus entfernt nur den letzten leeren Slot. Ein belegter letzter Slot wird mit
Premium-Hinweis geschützt. Leeren entfernt allein die Zuordnung. Freie Zwischen-
slots bleiben bestehen, erscheinen jedoch nicht als Bubble oder geometrische Lücke.
Farben folgen der Funktion, Ringradien ausschließlich dem Slotindex.

Visuelle Hi-Res-Palette und leere Fassungen unterstützen Pointer-/Touch-Drop
einschließlich Abbruch/Scroll sowie gleichwertige Tap-/Tastaturauswahl. Bereits
verwendete Funktionen bleiben in der Palette markiert; eine Verschiebung auf einen
leeren Zielslot erfolgt atomar, niemals dupliziert. Belegte Ziele werden nicht
stillschweigend überschrieben. Slotbelegungen schalten keine Wetterfunktion um.

## Status und Aura

Ein Statusring bzw. eine feine Bubble-Aura erfordert **Gruppierung EIN + Aura EIN
+ belegte, tatsächlich aktive und verfügbare Funktion**. Bei Gruppierung AUS
bleiben Einzelicons ohne Bubble-Aura, unabhängig vom gespeicherten Aura-Schalter.
Farben und Reglerwerte bleiben bei ausgeschalteter Aura erhalten.

Wind nutzt seinen vorhandenen effektiven Sichtbarkeits-/Komponentenstatus und
bekannte Fehler/akzeptierte Felder oder Punkte. Temperatur berücksichtigt die
tatsächlich gewählten Komponenten. Niederschlag liest vorhandenen Radar- und
Katalogzustand. WR-Layer gilt als aktiv, wenn mindestens eine seiner tatsächlich
verwalteten Radar-/generischen WR-Rasterebenen eingeschaltet ist; verfügbare
Teilabdeckung bleibt nutzbar. Es werden weder Fehlkacheln zu einem kompletten
Ausfall umgedeutet noch eigene meteorologische Gültigkeitsgrenzen berechnet.
Bekannter Ausfall: grau plus Warnbadge und zugänglicher Statustext, keine Aktiv-Aura.

Statusänderungen kommen über bestehende UI-Ereignisse/MutationObserver sowie einen
einzeiligen Synchronisationshook im vorhandenen Layer-Menü-Renderer. Keine Daten-
oder Transportlogik dieses Moduls geändert. Bubble-Knoten und Listener bleiben bei
reinen Statusänderungen erhalten, damit ein laufender Long-Press nicht abbricht.

Ein in der Prüfung gefundener Desktop-Gestenfehler wurde gezielt im gemeinsamen
Release-Klickschutz behoben: Der Listener für das ursprüngliche Loslassen wird
nur während dieses Drucks angehängt und nach dessen Ende entfernt. Ein neuer,
unmittelbarer Klick auf das Fachmenü-X wird nicht mehr als alter Release-Klick blockiert.

## Speicherung und Positionierung

Neue reine UI-Konfiguration: **`gewitterradar:eye-bubble:v1`**. Kein ungefragtes
Speichern/Zurücksetzen beim ersten Laden. Fehlende/ungültige Werte erhalten
defensive Defaults; unbekannte oder doppelte Funktionen werden leere Slots,
Farben/Wertebereiche validiert. Konfigurator-Minimierung separat über den
vorhandenen Premium-UI-Speicher, Scope `eye-hub`.

Eye bleibt unter **`gewitterradar:weather-display:v1.eyePosition`**, Emblem unter
**`displayControlPosition`**, übrige Icons unter ihren bisherigen individuellen
Schlüsseln. Die vorhandene Option **Position merken** bleibt maßgeblich.
Gruppierungswechsel und Slotänderungen überschreiben keine Einzelpositionen.
Eye-Ringe werden innerhalb der Karte geklemmt; Bubbles verwenden die belegte
Anzahl, verfügbare Randrichtung und vorhandene Kontrollflächen. Öffnen/Schließen
verschiebt weder Karte noch gespeicherten Eye-Punkt.

## Prüfung und Grenzen

Lokale Tests am vollständigen realen GR-/Leaflet-Modulbaum mit **synthetischem
Provider-I/O**, keine Wetter-/Geräte-Realabnahme:

| Ansicht | Viewport / DPR | Ergebnis |
| --- | --- | --- |
| Desktop | 1280 × 900 / 1 | bestanden |
| Desktop HiDPI | 1920 × 1080 / 1,5 | bestanden |
| Android Hochformat | 393 × 851 / 3 | bestanden |
| Android Querformat | 851 × 393 / 3 | bestanden |
| iPad | 820 × 1180 / 2 | bestanden |

Geprüft: Erststart AUS/Einzelicons, beide Menüstile/Zugänge, Masterdimension,
zwei-/einspaltige Vorschau, Slot Plus/Minus/Leeren/Schutz, Touch-Tap und Pointer-
Zuweisung, Farbwechsel, feste Ringlücken, keine leeren Bubbles, Aura AUS,
Fehlerbadge, Hauptfunktionen über vorhandene Aktionen, Wind-Bubble-Long-Press
ohne Folgeklick, echte einzige WR-Menüinstanz, Positionserhalt, Reload,
Resize/Orientierung, Escape, reduzierte Bewegung und Schattenregler 0.
Die Screenshots von Vorschau, 0/1/4/8 Ringen und 1/4/8 Bubbles wurden lokal
erzeugt; ausgewählte Desktop-/Android-Ansichten zusätzlich visuell betrachtet.
Es wurden keine Browser-/Realdiagnoseexporte in dieses Repository aufgenommen.

**Wichtig zur Achtfach-Vorschau:** Produktion bietet vier echte Hauptfunktionen,
also maximal vier unterschiedliche gleichzeitig belegte Funktionen. Acht Slots
sind regulär nutzbar. Acht gleichzeitige aktive Ringe/Bubbles werden ausschließlich
mit vier zusätzlich registrierten, ausdrücklich synthetischen Testfunktionen im
Browsernachweis geprüft. Keine Phantomfunktionen im produktiven Registry-Stand.

`scripts/test-eye-hub-model.mjs`: Zustandsgrenzen/12er-Struktur, defensive
Normalisierung, Duplikate/atomare Verschiebung, Farben/Slotradien, Aura-
Wahrheitstabelle, Statusreader, Originalmaster-/Kompass-CSS-Identität und
bytegleicher Schutz von `controls.js`. Zusätzlich die vier historischen
Navigationsmodi auf Desktop einschließlich tatsächlicher WAAPI-Transformationen,
History/Abbruch/Persistenz geprüft. Keine neue Animationsengine.
JavaScript-Syntax, `git diff --check`, 36 registrierte Module, aktuelle
Releaseidentität und bytegleiche Frontend-/Checksum-Auslieferung bestanden.

Gezielte öffentliche CI: vorhandener Workflow `gr-menu-architecture.yml`,
isolierter Modus `eye_bubble_only=true` (alter umfassender Job bleibt übersprungen).
Der konkrete Run-Nachweis wird unten ergänzt. Keine privaten Actions.

**Offene Sichtabnahme:** WebKit, physische Android-/iPad-/Companion-Geräte und
VM109 wurden nicht geprüft. Keine automatische Installation; VM101 unverändert.
**Sprachen:** Deutsch und Englisch vollständig über `_t()` integriert. Weitere
Sprachen verwenden für die neuen Eye-Texte vorläufig den dokumentierten,
zusammenhängenden englischen Fallback; deren zusätzliche Übersetzungen stehen aus.
Keine Bild-Diff-/Framerate-Messung oder physische Gerätequalität behauptet.

## Geänderte Dateien und DEV-Lieferung

Sechs neue Hilfsmodule (fünf `eye-hub*` plus `compass-preview-style.js`), zwei
bytegleiche Masterkopien, `display-menu.js`, UI-Hook in `layer-menu.js`,
gemeinsame Kompass-Styles in `map-display.js`, Resolver-Erweiterung in
`i18n-settings.js`, Build-Supportinventar, zwei gezielte Tests und isolierter
öffentlicher Workflowmodus. Kanonische Versions-/Modul-/Runtime-/DRA-Provenienz-
und HA-Metadaten sowie erzeugte Dashboard-/HA-Frontendkopien und Prüfsummen aktualisiert.

Unverändert: moderne Navigationslogik/`SETTINGS_MENU_TREE`, WeatherRouter,
WR-Verträge, Wind-/Temperatur-/Radar-Renderer, Partikelparameter, OPERA/DWD/NASA,
Blitze, Weltwiederholung, Kachelhandover sowie DRA-Projekt-/Kanaldateien und `main`.

DRA weiterhin **TheDaimos/gewitterradar@deploy/dev**.

- [DEV-Release](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.11.174-dev)
- [HA-Integration 0.25.81](https://github.com/TheDaimos/gewitterradar/releases/download/v4.11.174-dev/gewitterradar-0.25.81-dev.zip)
- [Dashboard 4.11.174](https://github.com/TheDaimos/gewitterradar/releases/download/v4.11.174-dev/gewitterradar-dashboard-4.11.174-dev.zip)
- [SHA256SUMS](https://github.com/TheDaimos/gewitterradar/releases/download/v4.11.174-dev/SHA256SUMS.txt)
- [Deploymentidentität mit vollständigem Releasecommit](https://github.com/TheDaimos/gewitterradar/releases/download/v4.11.174-dev/deployment.json)

## Paketnachweis

Implementierungscommit: `922f5f9ff8517591bc4dfd8812efca4112f885c1`.

- `gewitterradar-0.25.81-dev.zip`: SHA256 `a0bc354cc477c324ec174194769623324b8ccddc82abe17c526cb0a0415733cb`
- `gewitterradar-dashboard-4.11.174-dev.zip`: SHA256 `d63c0e9f0a72135949d94d15ac3e98d44c75fdca9cf86415ebfbc4f45d095e16`

The final documentation commit is the release target, recorded in deployment.json. ZIP payloads remain identical to the implementation commit.
