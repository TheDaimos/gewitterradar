# Winddesign- & Animationsstudio · GR 4.11.163 DEV

## Basis, Schutzstand und Versionen

Arbeitsbeginn auf `ac73cb59abeac399c9fc24dcb78194ecef0c3e0b`, GR 4.11.162 DEV /
HA 0.25.69. Während der Entwicklung kam ausschließlich der Dokumentationscommit
`efadf2cc7e0fd708ac20cf391637e2ccf8f0e7e5` hinzu; dessen vollständiger Diff wurde
geprüft und per Fast-Forward übernommen. Er ist die Veröffentlichungsbasis.

Der Betreiber hat im laufenden Auftrag **GR 4.11.162 / HA 0.25.69** als auf Android
begutachtete Referenzversion bestätigt. Der zugehörige veröffentlichte Release-Commit
ist `ac73cb59abeac399c9fc24dcb78194ecef0c3e0b`; ein gesonderter Geräte-/Paketfingerabdruck
wurde nicht ausgelesen. Die verbindliche Dokumentation
`docs/GR_SNAKE_FLOW_PROTECTED_REFERENCE_2026-11-08.md` wurde vollständig gelesen und
bleibt unverändert, Blob `7b561396d5c529b09d1e12b8c3aa8e6b935d8d0c`.

Neue Version: **GR 4.11.163 DEV / HA 0.25.70**, Runtime `411163r1`, Modulsatz
`E411-163A1`, Windmodul 0.4.9, Core-Manifest 1.2.182. WeatherRouter 0.10.298 /
Loader 301, Commit `1b777a1b9593a5fd5b1f71ba6332ecb2883a39d5`, bleibt unverändert.

## Ausschließlich additive Integration

Der neue, zunächst geschlossene Bereich **Winddarstellung → Experteneinstellungen**
enthält das Winddesign- & Animationsstudio. Er verwendet die bestehenden metallischen
Panel-/Kartenklassen, Premium-Chevrons, Informations- und Schließen-Assets. Die
Klappzustände werden durch die vorhandene Premium-UI gespeichert. Das Studio wird
erst beim Öffnen erzeugt; ein geschlossenes, noch nie geöffnetes Studio besitzt
weder Modellinstanz noch Vorschau-Canvas oder Frame-Callback.

Die bisherigen elf Detailregler, drei Schnellregler, Pause, Wertebereiche, Defaults,
Synchronisation und aktive Windkonfiguration bleiben erhalten. Die betreffenden
Templatezeilen und Bindungen werden gegen die Referenz verglichen. Der bisherige
Wind-Konfigurationsadapter bleibt bytegleich; es gibt keine Migration des vorhandenen
Wind-Storage. Kein Abstands-/Verteilungsparameter wurde ergänzt.

`snake-canvas.js`, `snake-geometry.js`, `snake-config.js` und die vorhandenen Wind- und
Temperaturrenderer, Vektorsampler, Farbdefinitionen und Frame-Infrastruktur bleiben
bytegleich zur Referenz. Ihre bestehenden Cachekennungen werden weiterverwendet.
Neue Cachekennungen betreffen die tatsächlich geänderten Studio-/Windmenü- und
Auslieferungsmodule. Die aktive Animation erhält keine veränderte Geometrie,
Verteilung, Zoom- oder Glättungslogik.

## Gemeinsame Vorschau

Die bestehende Offline-Vorschau wurde gezielt aufgeteilt: `snake-preview.js` enthält
ihre drei Szenariogeneratoren, die kleine Projektionsschnittstelle und den
Lebenszyklus. Sowohl die Offline-Seite als auch das integrierte Studio verwenden
**SnakePreview → denselben unveränderten SnakeCanvas/ dieselbe SnakeGeometry**.
Es existiert keine zweite Rendering-Engine.

Die Szenarien schwacher Wind, zu-/abnehmender Wind und Rotation stammen aus dem
bisherigen Konfigurator. Sie werden ausdrücklich als **Synthetische
Entwicklungsvorschau – keine Wettervorhersage** gekennzeichnet. Die synthetischen
Felder gelangen ausschließlich in den lokalen Vorschau-Canvas, niemals in den
WR-Feldzustand der Karte, deren Cache oder deren Providerentscheidung.

Die Vorschau besitzt Start, Stopp, Pause/Fortsetzen und Neustart. Regler ändern ihre
Parameter ohne Neuinitialisierung; ein Neustart ist eine ausdrücklich gewählte
Aktion. Schließen des Expertenbereichs, Einklappen der Vorschau, Minimieren oder
Schließen des Windmenüs sowie Entfernen des Widgets stoppen die unsichtbare Arbeit.
Resize-/MutationObserver dienen ausschließlich dem Lebenszyklus; es gibt keine
Polling-Schleife oder Wetterabfrage für die Vorschau. Der bestehende gemeinsame
Frame-Scheduler wird wiederverwendet, `prefers-reduced-motion` wird respektiert.

Der integrierte Canvas ist auf Menübreite und 220 px Höhe begrenzt. Historien,
Partikelbudget, DPR-/Canvasgrenzen und temporäre Laststeuerung stammen unverändert
aus dem geschützten Renderer. Es werden keine neuen Partikelaufkommens- oder
Abstandsregler vorgetäuscht: Das vorhandene Aufkommen wird aus Dichte, Lebensdauer
und Defizit geregelt.

## Entwurf und aktives Kartendesign

Beim ersten Öffnen wird der Entwurf aus den tatsächlich vorhandenen aktiven
Schlangenwerten kopiert. Später wird ein gespeicherter Studioentwurf wiederhergestellt.
Die Studioregler bearbeiten diesen ausdrücklich gekennzeichneten Entwurf. Sie nutzen
dieselben elf Schlüssel, Labels und Grenzen aus `SNAKE_LIMITS`; es gibt keine zweite
Definition der Rendererparameter und keine konkurrierenden aktiven Regler.

Die ursprünglichen Schnell-/Detailregler bleiben die direkte Bedienung des aktiven
Kartendesigns. Ändert der Benutzer dort Werte, wird der Unterschied zum Entwurf
angezeigt. **Auf Karte anwenden** übernimmt ausschließlich die elf validierten
Parameter über den bestehenden Setter. Darstellungsart, Sichtbarkeit, Pause,
Symbolfarbe, Windfarbfläche und andere Wetterebenen werden dabei nicht umgeschaltet.
**Änderungen verwerfen** kopiert die aktuellen Kartenparameter zurück in den Entwurf.

Öffnen, Vorschau, Profilwechsel, Speichern, Importprüfung und Schließen schreiben
keine aktive Windkonfiguration. Importierte Werte werden zunächst in einer
Prüfansicht mit Profilname und sämtlichen Werten dargestellt. Erst **Als Entwurf
übernehmen** ersetzt den Studioentwurf, weiterhin ohne Kartenänderung.

## Profile und lokale Speicherung

Der neue Schlüssel `gewitterradar:wind-studio:v1` speichert Schema 1, höchstens 32
Benutzerprofile, Entwurf, Entwurfsname und Profilauswahl. Der bestehende Windschlüssel
bleibt unverändert. Die Speicherung ist lokal pro Browser/WebView und Ursprung;
sie ist keine zentrale HA-/Cloud-Synchronisierung. Ein HA-Neustart löscht diesen
Browser-Speicher nicht; das Löschen von Browser-/WebView-Daten kann ihn entfernen.
JSON und CSV ermöglichen den Austausch zwischen Geräten und Installationen.

Funktionen: Neues Profil aus dem Entwurf, Speichern, Laden, Umbenennen, Duplizieren,
Löschen mit ausdrücklicher Bestätigung und Zurücksetzen. **Profil zurücksetzen**
lädt dessen gespeicherten Stand in den Entwurf; das Profil wird erst mit Speichern
geändert. **Werkseinstellungen laden** lädt die bestehenden Rendererdefaults
ausschließlich in den Entwurf. Die drei mitgelieferten Profile Werkseinstellung,
Dezent und Rotation sind schreibgeschützt und können dupliziert werden.

Benutzerprofile besitzen interne, neu erzeugte IDs. Importierte Dateien enthalten
keine solchen IDs und können weder bestehende noch mitgelieferte Profile
überschreiben. Namenskonflikte werden gemeldet. Speicherfehler werden angezeigt;
fehlgeschlagene Schreiboperationen verändern das Modell nicht teilweise.

## Verbindliches Austauschformat 1

JSON und CSV verwenden die **tatsächlichen vorhandenen Parameternamen und Einheiten**.
Die abweichenden Aliasnamen und die Deckkraft 0–1 aus dem ursprünglichen
Beispielvorschlag bilden keinen veröffentlichten Vertrag und werden nicht still
umgedeutet. `opacity` bedeutet hier immer Prozent.

| Schlüssel | Bedeutung / Einheit | Bereich | bestehender Default |
|---|---|---:|---:|
| minLength | CSS-Pixel | 8–24 | 10 |
| maxLength | CSS-Pixel | 30–120 | 76 |
| lengthScale | visueller Faktor | 0.25–3 | 1 |
| headSize | Kopffaktor | 1–2 | 1.5 |
| bodyWidth | CSS-Pixel | 1–5 | 2.1 |
| taper | Schwanzverjüngung; im Beispiel tailTaper | 0.6–2.5 | 1.3 |
| tailStart | Anteil der Bogenlänge | 0.5–0.8 | 0.67 |
| opacity | Prozent; keine 0–1-Angabe | 10–100 | 85 |
| density | Dichtefaktor | 0.35–5 | 1 |
| speed | visuelles Tempo; im Beispiel animationSpeed | 0.25–2.5 | 1 |
| response | Sekunden; im Beispiel lengthResponseSeconds | 0.15–3 | 0.65 |

Der beobachtete Referenzwert density 1.95 ist eine Benutzerkonfiguration, kein neuer
Default. Er wird wie jede gültige gespeicherte Konfiguration erhalten.

### JSON

```json
{
  "format": "gr-wind-animation-preset",
  "schemaVersion": 1,
  "name": "Mein Winddesign",
  "renderer": "snake-flow",
  "parameters": {
    "minLength": 10, "maxLength": 76, "lengthScale": 1,
    "headSize": 1.5, "bodyWidth": 2.1, "taper": 1.3,
    "tailStart": 0.67, "opacity": 85, "density": 1,
    "speed": 1, "response": 0.65
  }
}
```

Ein JSON-Dateiimport verlangt diese Metadaten und alle elf Parameter. Unbekannte
Felder, Renderer oder Schemaversionen werden abgewiesen.

### CSV

Export: UTF-8 mit BOM, CRLF, Komma als Feldtrenner, Dezimalpunkt. Alle Datenfelder
werden korrekt gequotet; enthaltene Anführungszeichen werden verdoppelt.
Tabellenprogramme können die Datei als UTF-8/Komma-CSV importieren.

```csv
parameter,value
format,gr-wind-animation-preset
schemaVersion,1
name,Mein Winddesign
renderer,snake-flow
minLength,10
maxLength,76
lengthScale,1
headSize,1.5
bodyWidth,2.1
taper,1.3
tailStart,0.67
opacity,85
density,1
speed,1
response,0.65
```

Ein CSV-Dateiimport verlangt alle elf Parameter. Alternativ sind reine
Parameterdateien ohne die vier Metadatenzeilen zulässig; sie gehören ausdrücklich
zum dokumentierten snake-flow-Schema 1. Sind Metadaten vorhanden, müssen alle vier
vollständig und gültig sein. Doppelte Schlüssel, unbekannte Parameter, fehlende
Werte, falsche Spalten und ungültige Zahlen erzeugen verständliche Fehler.

**CSV einfügen** unterstützt Teilkonfigurationen. Zum Beispiel ändern
`parameter,value` und `density,2` nur die Dichte des Entwurfs. Nicht genannte
Parameter und der bestehende Entwurfsname bleiben erhalten. Vollständige
Exportdateien können unverändert wieder importiert werden.

## Import-/Exportsicherheit

Maximal 64 KiB pro Datei oder Text, strikt bekannte Struktur, endliche numerische
Werte innerhalb der gemeinsamen Renderergrenzen, keine automatische Korrektur
ungültiger Importwerte. Profilnamen haben 1–64 Zeichen; Steuer-/Bidi-Zeichen,
HTML-Klammern und führende Tabellenformelzeichen werden abgewiesen. Namen und
Fehlertexte werden ausschließlich als Text angezeigt. Import führt weder Code
aus noch erzeugt er Netzwerkzugriffe. Exporte enthalten nur Name und optische
Parameter, keine WR-Daten, Koordinaten, Zugangsdaten oder internen Profil-IDs.

Downloads verwenden lokale Blob-URLs mit Freigabe nach Benutzung. Zusätzlich wird
der vollständige Exporttext zum manuellen Kopieren bereitgestellt, falls ein
Companion-WebView den nativen Download nicht übernimmt.

## Dateien und gezielte Verifikation

Neue Hilfsmodule: `snake-preview.js`, `wind-studio-data.js`, `wind-studio.js`.
Integration ausschließlich im bestehenden `wind-display.js`; Offline-Seite
`docs/previews/snake-flow.html` verwendet ebenfalls das gemeinsame Vorschaumodul.
Hinzu kommen `tests/gr-wind-studio.test.mjs` und
`scripts/test-gr-wind-studio-browser.cjs`. Version-/Runtime-/HA-/DRA-Metadaten,
Builder-Inventar, Frontend-Spiegelkopien, Prüfsummen, README/Changelog und öffentliche
CI werden synchronisiert. Keine Änderung an der geschützten Referenzdokumentation.

Gezielte Prüfungen: JSON-/CSV-Roundtrip inklusive Unicode/Quotes, Teilimport,
Grenz-/Format-/Duplikatfehler, geschützte Werkseinstellungen, vollständige
Profilverwaltung, Speicherfehler, gemeinsame Vorschau und bytegleiche Schutzdateien.
Die vollständige GR-Modulkette wird auf Desktop, kleinem Android, Android quer,
iPad hoch/quer und iPad Pro geprüft. Dazu gehören native Maus-/Touch-Slider,
Renderinstanz-Erhalt, Entwurf/Karte-Trennung, Profil- und Dateioperationen,
Wiederherstellung nach Reload sowie Stopp bei verborgenem/minimiertem Studio.

Bei identischem Windfeld und unveränderten Kartenparametern werden die Pixel des
pausierten produktiven Snake-Canvas vor/nach Öffnen, Entwurfsbearbeitung,
Profilaktionen und Schließen verglichen. Ebenso bleibt der bestehende Wind-Storage
bytegleich, bis ausdrücklich Auf Karte anwenden gewählt wird. Die bisherigen
Schnell- und Detailregler werden zusätzlich mit geöffnetem Studio geprüft.

Physische Android-/iPad-/HA-Abnahme dieser neuen Version bleibt beim Betreiber.
Keine automatische Installation, keine privaten Actions, keine Änderungen an WR,
`main` oder PROD VM101 und keine Wiederholung von TEST69. Endgültige Commit-,
öffentliche CI- und Paketnachweise werden nach erfolgreichem Abschluss ergänzt.
