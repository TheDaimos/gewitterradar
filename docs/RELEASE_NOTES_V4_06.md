# Gewitterradar V4.06 – Release Notes

> Status: Release-Kandidat. Dieses Dokument beschreibt den vorgesehenen V4.06-Stand; die endgültige Veröffentlichung erfolgt erst nach vollständiger Abschlussprüfung.

## Überblick

V4.06 führt Dashboard-Karte und native Home-Assistant-Integration auf einen gemeinsamen Frontend- und Produktstand zusammen. Beide Auslieferungsformen werden deterministisch aus derselben Quelle erzeugt und gemeinsam geprüft.

Der Schwerpunkt dieser Version liegt auf Internationalisierung, Hilfe und Dokumentation, Recorder-Mehrgerätefähigkeit sowie einer umfangreichen realen Geräte-Feinabstimmung der Premium-Oberfläche.

## Neu

- **19 About-/Hilfe-Sprachvarianten** mit streng validiertem Sprachschema.
- Neuer Premium-Dialog **„Hilfe & Hinweise“** mit Erklärungen zu Voraussetzungen, Radien, Referenzstandort, wichtigen Funktionen, Grundeinstellungen, Fehlerdiagnose und Recorder.
- Verzögert geladenes gemeinsames Locale-Modul für die zusätzlichen Sprachen.
- Persönliche, bereits vorhandene Signatur aus den Einstellungen zusätzlich im Welcome-Footer.
- Kompakte Footer-Kennung: `V4.06 · Visual V2 · Gewitterradar · by CK`.
- Eigene Projektgeschichte, Meilensteinübersicht und V4.06-Release-Notes.

## Recorder und Datenquellen

Die Recorder-Empfehlung verwendet jetzt geräteunabhängige Wildcards:

```yaml
recorder:
  exclude:
    entity_globs:
      - "geo_location.lightning_strike*"
      - "sensor.*_lightning_distance"
      - "sensor.*_lightning_azimuth"
      - "sensor.*_lightning_counter"
```

Damit lassen sich mehrere Blitzortungsgeräte bzw. Beobachtungspunkte ohne festes Sensorpräfix abdecken. Die Ausschlüsse betreffen die Recorder-Historie und deaktivieren nicht die Live-Zustände von Gewitterradar.

## Premium-Oberfläche

- metallisch schillernde, kräftigere Rahmen in **Einstellungen** und **Hilfe & Hinweise**;
- harmonisiertes Premium-X in den Dialogen;
- freigegebene Schriftrolle als Kopier-Schaltfläche für Recorder-YAML;
- Welcome-Zahnrad in die Hauptansicht und den Hilfedialog übernommen;
- Hilfesymbole geräteübergreifend ausgerichtet und das Haus-Symbol bei **„Voraussetzungen“** vergrößert;
- Chevrons und Abschnittshierarchie optisch verfeinert;
- Premium-Einstiegsschaltflächen im Einstellungsdialog auch auf geeigneten mobilen Hochformatbreiten nebeneinander;
- Versionsanzeige im Einstellungsdialog aus dem Kopfbereich in den unteren linken Freiraum verschoben.

## Welcome-/About-Feinabstimmung

- persönliche Widmung im deutschen mobilen Hochformat gezielt auf einen besseren Textfluss abgestimmt;
- persönliche Signatur im Welcome-Footer auf Desktop/Tablet an den Schaltflächen ausgerichtet und auf Android stärker hervorgehoben;
- Footer-Anordnung aus Signatur, Schaltflächen, Zahnrad und Versionsinformation gerätespezifisch verfeinert;
- Radius-Wertefelder `70 KM`, `30 KM`, `5 KM` um ungefähr 25 % vergrößert und vertikal zu den zugehörigen Zeilen zentriert;
- iPad-/iPad-Pro-Fokusartefakte am Premium-X und am erneut geöffneten About-Dialog behoben;
- griechischer mobiler Hochformat-Sonderfall korrigiert: Der Spruch fließt nun unter dem längeren Untertitel und überdeckt ihn nicht mehr. Die griechische Übersetzung selbst wurde nicht verkürzt oder verändert.

## Technische Änderungen

- gemeinsame kanonische Frontend-Quelle;
- deterministische Erzeugung der Dashboard- und Integrationsauslieferung;
- bytegenaue Parität der gemeinsamen Frontend-Dateien und Assets;
- versioniertes Dashboard-Helferpaket `app_gewitterradar_v4_06_pkg.yaml`;
- lazy geladenes About-/Hilfe-Locale-Modul;
- fail-closed Delta-Prüfungen für geschützte Quellanker;
- Regressionstests für beide Auslieferungsformen.

## Geräte- und Browserprüfung

Die automatisierte Frontend-Prüfung deckt folgende Profile ab:

- Desktop;
- iPad;
- iPad Pro;
- Android Hochformat;
- Android Querformat.

Zusätzlich wurden die visuellen Feinanpassungen wiederholt auf realen Android- und iPad-Geräten geprüft. Der griechische Hochformat-Fix erhält eine eigene Kollisionsprüfung zwischen Untertitel und Spruch.

## Home-Assistant-Qualitätssicherung

Die V4.06-Linie wird getrennt geprüft durch:

- Home-Assistant-Laufzeittests;
- Hassfest;
- HACS-Integrationsvalidierung;
- deterministisches Paket-Staging;
- Frontend-Neubau und Paritätsprüfungen;
- Locale-/Sprachvalidierung;
- Browserregressionen beider Auslieferungsformen.

## Kompatibilität

- Die Blitzortung.org-Integration bleibt die Quelle der Live-Blitzereignisse.
- Bestehende unterstützte `lightning_detection_*`-Helfer bleiben als Kompatibilitäts-/Migrationspfad berücksichtigt.
- Historische fremde oder nicht mehr verfügbare Entity-Registry-Einträge werden nicht automatisch gelöscht.
- Native Integration und Dashboard-Auslieferung dürfen nicht gleichzeitig dieselbe Custom Card doppelt registrieren; in Home Assistant soll nur die tatsächlich verwendete Gewitterradar-Modulressource aktiv sein.

## Letztes Release-Gate

Vor der endgültigen V4.06-Freigabe erfolgt nach dem letzten Build noch die reale Sichtprüfung des korrigierten griechischen mobilen Hochformats sowie der vollständige abschließende CI-/Paket-/Paritätscheck.
