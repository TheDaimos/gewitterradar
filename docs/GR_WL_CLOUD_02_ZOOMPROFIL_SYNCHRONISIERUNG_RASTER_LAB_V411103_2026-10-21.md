# GR-WL-CLOUD-02 – Zoomprofile stabilisieren und Raster-Labor-Profilverwaltung ergänzen

**Projekt:** Gewitterradar  
**Repository/Zweig:** `TheDaimos/gewitterradar@deploy/dev`  
**Datum:** 21.10.2026  
**Ausgangsversion:** V4.11.102 DEV  
**Neuer unterscheidbarer Entwicklungsstand:** **V4.11.103 DEV**  
**Build:** `V4.11.103-DEV-2026-10-21`  
**Laufzeitrevision:** `411103r1`  
**Modulsatz:** `E411-103A1`  
**Native HA-Integration:** weiterhin `0.25.18`  
**Freigabe:** nur vorbereiteter, kontrolliert zu installierender HA-DEV-Sichttestkandidat; keine automatische DRA-Installation, keine HA-Realabnahme.

## 1. Betreiberbefund – tatsächliche Reproduktion

Der Betreiber zeigte, dass die Wolkendarstellung nach Kartenzoomänderungen die vorherigen Laborversuche weiterhin korrekt visualisiert, während **alle Laborregler** auch beim Zurückzoomen auf die bereits bearbeiteten Zoomstufen auf die Ausgangswerte zurückspringen. Die beigefügten Originalansichten zeigen ausdrücklich Zoom 10 und Zoom 11 mit `0 px` Glättung und `100 %` Flächenverschmelzung, trotz ursprünglicher gespeicherter Versuche.

Der tatsächliche JSON-Export `gewitterradar.raster-lab.v1` aus V4.11.102 belegt:

| Layer | Zoom | gemeldeter Native-Zoom | Glättung | Flächenverschmelzung |
| --- | ---: | ---: | ---: | ---: |
| Wolken (`clouds`) | 10 | 9 | 41 px | 22 % |
| Wolken (`clouds`) | 11 | 9 | 42 px | 30 % |

Kontrast, Farbsättigung, Helligkeit und Deckkraft wurden jeweils auf neutralen Werten belassen. Der Export wurde im Edge/Chromium-Browser mit einem Geräte-Skalierungsfaktor von 0,9375 erzeugt. Diese Daten waren **manuell vom Betreiber erfasste Diagnosedaten**; sie dürfen nicht mit erfolgreichen HA-Realtests des neuen Codes verwechselt werden.

## 2. Tatsächliche technische Ursache

Der programmatisch kontrollierte Originalcode in `frontend/modules/diagnostics/raster-lab.js` verwendete bisher als Schlüssel für einen Versuch:

```javascript
selected + ":" + zoom + ":" + (nativeZoom ?? "none")
```

Für einen im aktiven Cloud-Canvas gespeicherten Versuch ergab dies beispielsweise `clouds:10:9`. Beim Kartenzoomen ruft der bereits existierende generische Renderer in `weather/layer-menu.js` seinen Lifecycle mit neuem Kachel-/Layeraufbau auf. Während dieses vorübergehenden Übergangs ist `state.layer` zeitweise `null` und damit der native Zoom **unbekannt**. Der Laborschlüssel sprang dann vorübergehend auf `clouds:10:none`, obwohl der Benutzer weiterhin **Zoom 10** bearbeitet und das vorhandene gespeicherte Profil `clouds:10:9` noch existiert. Die Regler lesen für diesen anderen Schlüssel die neutralen Referenzwerte. Der vorübergehend fehlende Renderer darf aber fachlich **nicht** über die Identität der Benutzereinstellung entscheiden.

Damit ist die Ursache keine pauschal falsche Wolkenglättung und kein Verlust sämtlicher Werte, sondern ein **instabiler Schlüssel zwischen temporärem Rendererzustand und Zoomprofil-/Reglersynchronisierung**.

## 3. Gezielte Programmkorrektur

Das vorhandene Modul `diagnostics.raster-lab` wurde von **0.1.2 auf 0.1.3** aktualisiert. Ein Laborprofil wird nun pro **Wetterebene und tatsächlichem Kartenzoom** identifiziert:

```javascript
selected + ":" + zoom
```

Der native Quellzoom bleibt ausdrücklich für **Diagnose und Export** bestehen, entscheidet aber **nicht mehr** darüber, ob ein eingestelltes Benutzerprofil gefunden wird. Bei vollständigem Wolkenlayer-Neuaufbau oder vorübergehend fehlendem `maxNativeZoom` bleiben die Schieberdaten damit dem richtigen Kartenzoom zugeordnet.

### Zusätzliche Zoomprofil-Auswahl

Direkt unter der bekannten Anzeige von Kartenzoom, nativer Quellzoomstufe und Browser wurde ein neues Feld **„Zoomprofil anzeigen · Bearbeitung nur beim aktuellen Kartenzoom“** ergänzt. Es listet die gespeicherten Versuche für den gewählten Layer und den gerade aktuellen Kartenzoom, nach Zoomstufen aufsteigend.

Die Einträge kennzeichnen jeweils **„Gespeichert“** oder **„Noch kein Profil“** und markieren den tatsächlichen **„Karte“**-Zoom. Ein anderer Zoom lässt sich ausschließlich zur **Ansicht / zum Vergleich** auswählen, ohne versehentlich dessen Versuch zu verändern: Die Regler sind dann deaktiviert, und die Statuszeile zeigt **„Profilvergleich (nur Anzeige)“**.

Bei echtem Kartenzoomwechsel wird der reine Vergleichsmodus verlassen und die Regler werden aus dem für den nun aktuellen Kartenzoom gespeicherten Versuch erneut befüllt. Beim Wechsel des Layers wird die reine Vergleichsauswahl ebenfalls zurückgesetzt. Die vorhandene Vorschau bleibt an den **wirklichen Kartenzoom** gebunden und wird nicht durch das bloße Lesen eines anderen gespeicherten Profils überschrieben.

### Bestandsschutz

Keine pauschale Änderung der vier historisch abgestimmten Niederschlagsmodi; keine Änderung des existierenden Wolken-Renderers, keine neue Renderarchitektur, keine Provider-/WeatherRouter-Änderung, keine Änderung an UTC oder den Consumer-API-V1-/V2-Verträgen. Niederschlag, Wolken und Wind sind durch die bereits bestehenden `selected`-Profilanteile getrennt. Das Raster-Labor ist weiterhin **temporär** und speichert keine neue Produkteinstellung; die Versuche leben in der geöffneten Laborsitzung und sind via bestehendem JSON-Export dokumentierbar.

## 4. Testbestand und Regression

Der bereits vorhandene Test `scripts/test-v41181-raster-lab.mjs` wurde vom veralteten Verhalten „Native-Zoomwechsel erzeugt anderen Profilschlüssel“ auf das gewünschte **stabile Profil trotz wechselndem Native-Zoom** umgestellt.

Der bestehende echte Chromium-Test `scripts/test-gr-wl-cloud-01-browser.cjs` wurde um einen gezielt reproduzierten Fall erweitert: Bei einer eingerichteten aktiven Wolkenkachel wird ein individueller Zoomversuch gespeichert, der Renderer auf den Zustand „lädt, nativer Zoom unbekannt“ umgeschaltet und das Profil erneut gelesen. Glättung und Flächenverschmelzung müssen dabei erhalten bleiben und nach Rückkehr des Layers weiterhin stimmen. Daneben laufen die bestehenden Browserpixelvergleiche, die eigenständige Wolken-Vorschau-/Restore-Prüfung sowie die früheren GR-WEICH-04/05-Gates unverändert.

Wichtig: Die im Test synthetisch erzeugten Browserbilder und der kontrollierte Kartenhalter belegen reproduzierbare Produkt-Methoden- und Pixelwirkungen, nicht die vollständige asynchrone WeatherRouter-/Home-Assistant-Ende-zu-Ende-Realintegration. Ein gesonderter **manueller HA-DEV-Sichttest** mit Wolkenkarten und echten Providerdaten bleibt erforderlich.

## 5. Versions- und Auslieferungsverträge

Die Änderungen wurden auf allen drei Auslieferungswegen konsistent übernommen:

- `frontend/`
- `dashboard/dist/`
- `custom_components/gewitterradar/frontend/`

Zentrale `version.js`, `gewitterradar.js`, `panel.js`, Modul- und Laufzeitmanifeste, nativer Panel-Cache, DRA-Provenienz und die Versions-/Buildprüfungen wurden auf **4.11.103 / 411103r1 / E411-103A1** synchronisiert, ohne die unabhängige Integrationsversion `0.25.18` zu erhöhen.

`frontend/assets.json` erhielt den neu berechneten echten SHA-256-Wert des Laufzeitmanifests `d6e0ed51a35a99cf5465ac8ef01bda087310131d70b9d6470333bd542f47165d`; das kanonisch sortierte `SHA256SUMS_FRONTEND.txt` wurde für die geänderten beiden installierbaren Frontend-Spiegel neu berechnet. Die Hashfunktion wurde eigens anhand des bekannten SHA-256-Prüfwerts der Zeichenfolge `abc` validiert; Fehler in einer anfänglich inkorrekten Prüfsummenberechnung wurden vor der Freigabe korrigiert, anstatt Integritätskontrollen abzuschalten.

Zwischen den ersten Prüfläufen fielen zusätzlich alte hartkodierte Versionsregulärausdrücke in `test-v411-identity.mjs` und `test-v41106-weather-engine-diagnostics.mjs` auf. Auch diese wurden **auf die echte neue Version** korrigiert, ohne fachliche Schutzbedingungen zu schwächen.

## 6. Kontrollierte spätere DRA-DEV-Installation – keine automatische Freigabe

**Ziel:** Home Assistant **DEV VM 109**. **PROD VM 101** ist ausgeschlossen.

Der bevorzugte Weg bleibt **DRA V1**, ausschließlich als Einzelprojekt **Gewitterradar**, Repository `TheDaimos/gewitterradar`, Ref **`deploy/dev`**, mit einer vorher geprüften Sicherung der tatsächlich installierten Ausgangsversion. Der im DRA-Manifest hinterlegte Lebenszyklus verlangt nach der Installationsphase einen **Home-Assistant-Neustart**; dieser darf nur vom Betreiber kontrolliert auf DEV durchgeführt werden. Vor einem tatsächlichen DRA-Schreibvorgang müssen die Zielcommitkennung, das Quellrepository, der Branch, die aktuelle Ausgangsversion und der Rückfallpunkt geprüft werden. Ein späterer Berichtsschreibcommit darf nicht mit dem separat geprüften **Programmcommit** verwechselt werden.

**Manuelle Android-/Desktop-Prüfung:** V4.11.103 und `411103r1` nach Neustart kontrollieren; Wolken aktivieren; im Labor je Zoom 10 (41 px / 22 %) und Zoom 11 (42 px / 30 %) neue Versuche anlegen; auf Zoom 9, 10, 11 und 12 wechseln; unmittelbar **während „Raster lädt“** und danach Reglerpositionen vergleichen; gespeicherte Zoomprofile über das neue Dropdown anzeigen und Nicht-Karten-Zoomprofile auf Unveränderbarkeit prüfen; Vorschau aus/an, Layer aus/an, Quell-/Regionwechsel und erneute Kacheln abwarten; Niederschlag getrennt kontrollieren. Auffälligkeiten mit Screenshots und privatem Diagnosenexport sichern.

**Keine DRA-Installation durchgeführt; kein HA-REAL-PASS; keine PROD-Freigabe.**

**C.K. – Eine Idee weiter gedacht.**

## 7. Tatsächlich geprüfter Programmstand, GitHub-Actions und Freigabegrenze

**Exakter Programmcommit** (einschließlich letzter Testkorrektur, Quellcode und SHA-256-Prüfsummen): **`e4aaca4851a9876234e9a88a6f09749f0c043cb8`**. Die nachfolgenden reinen Dokumentationscommits verändern diesen installierbaren Programmstand nicht.

Die GitHub-Actions-Nachweise sind diesem unveränderlichen Commit zugeordnet:

| Prüfbereich | GitHub-Actions-Lauf | Direkt beobachteter Zustand |
| --- | --- | --- |
| V4.11.103 Einstellungen/Laufzeitidentität | [39615456806](https://github.com/TheDaimos/gewitterradar/actions/runs/39615456806) | **completed / success** |
| Home-Assistant-Integration, HACS, hassfest und Paketvertrag | [39615456904](https://github.com/TheDaimos/gewitterradar/actions/runs/39615456904) | **completed / success**, sämtliche vier Jobs erfolgreich |
| Gemeinsames Frontend mit Browser- und geschützten Regressionstests | [39615456699](https://github.com/TheDaimos/gewitterradar/actions/runs/39615456699) | Der zugehörige Job zeigte bei der letzten direkten Abfrage **sämtliche Arbeitsschritte erfolgreich abgeschlossen**, einschließlich der bestehenden GR-WEICH- und GR-WL-CLOUD-Browserpixeltests sowie beider Auslieferungsprüfungen; die GitHub-Laufübersicht meldete dabei noch **`in_progress` / `conclusion=null`**. Bis GitHub den vollständigen Workflow selbst auf `completed / success` gesetzt hat, ist dieser Lauf **nicht** als abschließend grüner Workflow zu bezeichnen. |

Die Browserprüfung verwendet synthetische Wolkenbilder mit unabhängigem Niederschlags-Pane; echte Wetterrouter- und HA-DEV-Realtests erfolgen erst durch den Betreiber. Die V4.11.103-DEV-Version wurde im privaten Zweig bereitgestellt, aber **nicht auf Home Assistant installiert**.

### Konkrete Auslieferungsanweisung nach grünem Frontend-Abschluss

In DRA V1 auf HA DEV VM 109 ausschließlich **Gewitterradar** auswählen, Repository **`TheDaimos/gewitterradar`**, Ref **`deploy/dev`** und – soweit unterstützt – den unveränderlichen getesteten Programmcommit **`e4aaca4851a9876234e9a88a6f09749f0c043cb8`** vorgeben. Vor jeder Installation Sicherung und tatsächlichen bisherigen Installationsstand verifizieren, die endgültige Ref/SHA-Vorschau prüfen und **ausdrücklich selbst** die Installation freigeben. Das DRA-Manifest sieht nach der Installation einen Home-Assistant-Neustart vor. Keine automatische Installation und kein Eingriff in HA PROD VM 101. Wird die eingegebene Ref/Commit-Kombination in DRA nicht garantiert, Installation **abbrechen** und zunächst die tatsächlich ausgewählte SHA abgleichen.

**Noch offen:** Sichttest auf Android/Desktop, erneuter Wolkenkachelaufbau bei Zoom 10 und 11, Bedienelemente während „Raster lädt“, Profilvergleich-Interaktion in der echten HA-Oberfläche, vollständiger asynchroner V1/V2-Datenpfad und abschließende HA-Realabnahme.
