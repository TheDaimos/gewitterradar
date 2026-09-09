# About-Locale-Bundles

`ABOUT_LOCALES` enthält in `frontend/gewitterradar.js` die beiden nativen
About-Bundles Deutsch und English. Sie funktionieren vollständig ohne ein
weiteres Modul. Die übrigen 17 registrierten Sprachen liegen gemeinsam in der
kanonischen Datei `frontend/locales/about-locales.js`. Jedes Bundle enthält
`strings`, `settingLabels`, `settingPurposes` und `sourcePurposes`.

Deutsch definiert die String-Keys. Beide Setting-Gruppen müssen exakt die Keys
von `SETTING_ENTITIES` enthalten. Die Source-Gruppe muss dem deutschen Master
entsprechen; dessen vier IDs werden zusätzlich gegen den unveränderten
Recorder-YAML geprüft. Alle Werte müssen nichtleere Strings sein. Zusätzliche,
fehlende oder ungültige Gruppen/Keys und unregistrierte Locale-Namen führen zu
einem Fehler. Deutsch und English sind verpflichtend.

Build/Verify/Test sind strikt fail-closed: Sie führen `validateAboutLocales()`
explizit in einem isolierten JavaScript-Kontext ohne Card-Instanz oder Home
Assistant aus. Ein unvollständiges Bundle darf weder gebaut noch verifiziert
werden. Bei der produktiven Modulinitialisierung läuft kein Validator-Aufruf.

Die Runtime lädt das externe Modul erst, wenn ein About-Dialog für eine der 17
externen Sprachen benötigt wird. Deutsch, English, Kartenstart und normale
Kartenaktualisierungen lösen keinen Import aus. Ein erfolgreicher Import wird
geteilt und gecacht. Nach einem fehlgeschlagenen Import bleibt das vollständige
native English aktiv; der fehlgeschlagene Promise-Zustand wird verworfen, sodass
ein späterer Versuch möglich ist. Der Query-String von `import.meta.url` wird
unverändert an `locales/about-locales.js` weitergegeben.

`LANGUAGE_DEFINITIONS` bleibt die einzige Sprachregistry. Build und Verifikation
verlangen, dass das externe Modul exakt alle registrierten, nicht nativen
Sprachen enthält. Einzelne fehlende About-Texte werden nicht aus der allgemeinen
App-I18N ergänzt; deren eigener Fallback bleibt unverändert. Der About-Dialog ist
vom allgemeinen statischen Text-Mapper ausgenommen, damit dessen schlüsselbasierte
Bundles auch bei identischen deutschen Einzelwörtern nicht vermischt werden.

Prüfungen: `node scripts/verify-about-locales.mjs` und
`node scripts/test-about-locales.mjs`. Mit einem Chromium-Pfad als Argument
prüft letzterer zusätzlich das echte DOM für alle 19 Registry-Sprachen in
Dashboard und Integration. Die bestehenden Golden- und Browser-Schutztests
bleiben unverändert.
