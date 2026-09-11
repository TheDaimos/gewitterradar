# Gewitterradar — gemeinsame Produkt- und Auslieferungsarchitektur

Status: verbindliche Zielarchitektur für die weitere Entwicklung

## 1. Grundsatz

Gewitterradar ist **ein Produkt**.

Die native Home-Assistant-Integration und das Dashboard-/Lovelace-Paket sind ausschließlich zwei Auslieferungsformen desselben Produktstands.

`TheDaimos/gewitterradar` ist die kanonische Entwicklungs- und Produktquelle.

## 2. Zielbild

```text
                    TheDaimos/gewitterradar
                 kanonischer gemeinsamer Quellstand
                              |
                  +-----------+-----------+
                  |                       |
                  v                       v
      native Home-Assistant-       Dashboard-/Lovelace-
          Integration                 Auslieferung
                  |                       |
                  |                       v
                  |          TheDaimos/gewitterradar-dashboard
                  |          abgeleiteter Release-/HACS-Baum
                  |
                  +---- gemeinsame Frontend-/Asset-Basis ----+
```

Gemeinsamer Frontend-Code wird **einmal** entwickelt. Eine normale Produktänderung darf nicht unabhängig in beiden Auslieferungsformen implementiert werden.

## 3. Kanonische Quellbereiche

Die endgültige Verzeichnisstruktur kann während der Konvergenz noch technisch angepasst werden. Inhaltlich gelten jedoch folgende Eigentumsregeln:

- native HA-Integrationslogik: `TheDaimos/gewitterradar`;
- gemeinsamer Gewitterradar-Frontend-/Kartenquellcode: `TheDaimos/gewitterradar`;
- gemeinsame Assets: `TheDaimos/gewitterradar`;
- gemeinsame Texte/Übersetzungen/Branding: `TheDaimos/gewitterradar`;
- Build-/Synchronisationslogik für beide Auslieferungsformen: `TheDaimos/gewitterradar`;
- `TheDaimos/gewitterradar-dashboard`: nur erzeugtes/abgeleitetes Dashboard-Release plus releasebezogene Dokumentation.

Historische Quellstände in `gewitterradar-dev` oder `gewitterradar-integration-dev` bleiben Referenzen und werden bei Bedarf gezielt in die kanonische Quelle überführt.

## 4. Standardregel für jede zukünftige Aufgabe

Wenn der Benutzer sagt:

> „Ändere Gewitterradar …“

bedeutet das standardmäßig:

1. Änderung im kanonischen Gewitterradar-Quellstand entwickeln;
2. prüfen, welche gemeinsamen und welche auslieferungsspezifischen Adapter betroffen sind;
3. beide Auslieferungsformen aus demselben akzeptierten Quellstand erzeugen;
4. Parität prüfen;
5. erst danach veröffentlichen.

Nur wenn der Benutzer ausdrücklich sagt, dass eine Änderung ausschließlich Integration oder ausschließlich Dashboard betrifft, darf die Wirkung begrenzt werden.

## 5. Gemeinsame vs. auslieferungsspezifische Logik

### Gemeinsame Produktlogik

Muss aus derselben Quelle stammen, soweit technisch sinnvoll:

- Lovelace-Karte und Darstellung;
- „Über Gewitterradar“-Dialog / Onboarding;
- Slogan, Danksagung/Widmung, Texte;
- Hero-/Widmungs-/Kompass-/Selector-Assets;
- Recent-Liste;
- Radienanzeige;
- Aura;
- Kompass;
- Touch-/iPad-/Android-Verhalten;
- Übersetzungen;
- visuelle Regression Guards;
- spätere gemeinsame Features wie Playback.

### Native Integrationsadapter

Dürfen Home-Assistant-spezifisch sein, z. B.:

- Config Flow;
- Config Entry;
- native Konfigurationsentitäten;
- statische Pfadregistrierung;
- Dienste;
- Migration aus Legacy-Helfern;
- HA-Lifecycle;
- Runtime Data.

### Dashboard-Auslieferungsadapter

Dürfen dashboard-/HACS-spezifisch sein, z. B.:

- `hacs.json` der Dashboard-Auslieferung;
- `dist/gewitterradar.js`;
- Dashboard-spezifische Release-Metadaten;
- Veröffentlichung nach `TheDaimos/gewitterradar-dashboard`.

Adapter dürfen jedoch den gemeinsamen Produktinhalt nicht eigenständig weiterentwickeln.

## 6. Geschützte V4.05-Konvergenzbasis

Die erste verpflichtende Konvergenz ist der bereits abgenommene V4.05-Frontendstand aus `TheDaimos/gewitterradar-dashboard` in die gemeinsame Produktquelle.

Besonders geschützt ist:

`docs/ABOUT_GEWITTERRADAR_ACCEPTANCE_BASELINE_V4_05.md`

Diese Baseline muss vollständig in beide Auslieferungsformen gelangen. Sie darf während der technischen Migration nicht „vereinfacht“ werden.

## 7. Build-Pipeline — Sollverhalten

Langfristiges Ziel:

```text
shared source
   |
   +--> validate shared source
   |
   +--> build frontend once
   |        |
   |        +--> integration frontend payload
   |        +--> dashboard dist payload
   |
   +--> compare common payloads
   |
   +--> integration tests
   +--> dashboard/HACS tests
   +--> package checksums
   +--> release gates
```

Wo identische Dateien in beiden Formen ausgeliefert werden, sollen sie idealerweise byte-identisch aus demselben Build-Artefakt stammen.

## 8. Fail-closed-Paritätsprüfungen

Ein normaler Release soll fehlschlagen, wenn mindestens eine der folgenden Bedingungen zutrifft:

- gemeinsame Frontend-Versionen unterscheiden sich;
- gemeinsame Build-Kennung unterscheidet sich;
- gemeinsame JavaScript-Ausgabe unterscheidet sich unerwartet;
- gemeinsame Assets fehlen in einer Auslieferungsform;
- gemeinsame Asset-Prüfsummen unterscheiden sich unerwartet;
- der geschützte „Über Gewitterradar“-Dialog fehlt;
- verbindliche About-Texte fehlen;
- Widmungs-/Hero-Assets fehlen oder wurden durch Placeholder ersetzt;
- Dashboard-Ausleitung ist nicht reproduzierbar aus dem kanonischen Commit;
- native Integration enthält einen älteren gemeinsamen Frontendstand als das Dashboard oder umgekehrt.

## 9. Versionsmodell

Produktversion und Auslieferungsmetadaten sollen getrennt, aber nachvollziehbar sein.

Beispiel:

```text
Gewitterradar Produktstand: V4.06
Shared frontend build: V4.06-<date/build>
Native integration package: V4.06
Dashboard package: V4.06
Canonical source commit: <sha>
```

Wenn technische Gründe unterschiedliche Paketversionsschemata erzwingen, muss trotzdem dokumentiert sein, welcher gemeinsame Produkt-/Frontendstand enthalten ist.

## 10. Release-Provenienz

Jeder normale Release soll nachvollziehbar machen:

- kanonischer Source-Commit;
- gemeinsamer Frontend-Build;
- Integration-Paket;
- Dashboard-Paket;
- Prüfsummen;
- ausgeführte Paritätsprüfungen;
- Regression-/Acceptance-Ergebnisse.

Das Dashboard-Repository darf nicht zur ursprünglichen Source-of-Truth eines neuen normalen Produktfeatures werden.

## 11. Notfallregel

Ein auslieferungsspezifischer Hotfix darf nur bei ausdrücklichem Bedarf erfolgen.

Dann gilt zwingend:

1. Hotfix dokumentieren;
2. Abweichung markieren;
3. vor dem nächsten normalen Release in die kanonische Quelle zurückführen;
4. Parität erneut herstellen;
5. Regressionstests wiederholen.

## 12. Historische Repositories

- `TheDaimos/gewitterradar-dev`: historische Produktentwicklung / Regressionsevidenz;
- `TheDaimos/gewitterradar-integration-dev`: historische native Integrationsentwicklung / Migration / Handoffs / Tests;
- `TheDaimos/gewitterradar-maplibre-dev`: experimenteller Engine-Zweig.

Diese Repositories werden nicht gelöscht. Sie sind jedoch nicht mehr die Standardziele für normale neue Gewitterradar-Features.

## 13. Aktuelle nächste Umsetzungsschritte

1. V4.05-Frontendquellstand und alle benötigten Assets vollständig aus der eingefrorenen Referenz inventarisieren.
2. Gemeinsamen Frontendquellbereich in `TheDaimos/gewitterradar` etablieren.
3. V4.05-About-/Onboarding-Stand exakt übernehmen.
4. Integrationsseitige statische Bereitstellung über unterstützte Home-Assistant-APIs implementieren.
5. Dashboard-Build aus derselben Quelle erzeugen.
6. Paritäts-/Prüfsummenprüfungen implementieren.
7. bestehende Integrations-, HACS-, Browser- und Realgeräteprüfungen ausführen.
8. erst danach die zusammengeführte Produktlinie veröffentlichen.

Die bereits veröffentlichten Tags/Releases bleiben unverändert und dienen als Rückfall-/Vergleichsreferenz.

## 14. Umgesetzter Kandidat vom 2026-09-08

Gemeinsame Quelle: `frontend/gewitterradar.js`, `frontend/assets/` und `frontend/assets.json`. Der deterministische Build kopiert 18 gemeinsame Dateien nach `custom_components/gewitterradar/frontend/` und `dashboard/dist/`; nur die Dashboard-Variante enthält zusätzlich das unveränderte Legacy-Package aus `home-assistant/`. `dashboard/hacs.json` und `dashboard/README.md` beschreiben die abgeleitete Dashboard-Staging-Struktur. Eine Veröffentlichung wird nicht automatisiert.

`verify-frontend.mjs` prüft Quelle gegen eingefrorene V4.05 plus exakt freigegebene Delta-Transformation, alle 17 Assets, exakte Dateiinventare, beide Payloads und `SHA256SUMS_FRONTEND.txt`. Negative Manipulationstests müssen Abweichungen ablehnen. Künftige freigegebene Produktänderungen müssen diesen bewusst engen Delta-Vertrag explizit weiterführen; ihn nicht stillschweigend umgehen.

Native Bereitstellung: `async_setup` registriert `/gewitterradar` einmal pro Komponenten-Lifecycle über `async_register_static_paths` und `StaticPathConfig`; der Manifest-Eintrag `http` deklariert die Abhängigkeit. Das ist die [dokumentierte Home-Assistant-API](https://developers.home-assistant.io/blog/2024/06/18/async_register_static_paths/). Alle Runtime-Dateien liegen gemäß [HACS-Integration-Struktur](https://www.hacs.xyz/docs/publish/integration/) im Integrationsverzeichnis. Lovelace-Ressourcen werden manuell registriert; Settings, Migration und Entry-Lifecycle bleiben erhalten.

Der nächste sichere Schritt bleibt Linux-Runtime-/HACS-/Hassfest-CI und reale Abnahme. Details und Evidenz: [Prüfbericht](PREMIUM_CONTROLS_2026-09-08.md).
