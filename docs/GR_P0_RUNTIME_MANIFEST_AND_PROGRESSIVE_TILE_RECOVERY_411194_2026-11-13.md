# P0-Folgeauftrag – Runtime-Synchronisierung und progressive Radar-Kacheln

**Datum:** 13.11.2026  
**Entwicklungsbasis:** `TheDaimos/gewitterradar@deploy/dev` ab GR 4.11.190 DEV / HA 0.25.97, mit WR 0.10.320 DEV / Loader 323 unverändert als referenzgeschütztem Performance-Stand.  
**Finaler veröffentlichter Quellstand:** **GewitterRadar 4.11.194 DEV / HA 0.25.101** · Runtime `411194r1` · Modulset `E411-194A1` · Niederschlagsmodul `1.3.36`.  
**Scope:** ausschließlich GR-DEV; keine Änderungen an WR, VM101, wissenschaftlichen Freigaben, Referenz-Renderern, Eye-/Wind-/Temperaturfunktionen oder produktiver Installation.

## A. Reproduzierter Runtime-/Installationskonflikt: Ursache gefunden und korrigiert

**Vorgegebener Realbefund:** GR-Frontend 4.11.190, Runtime `411190r1`, 36/36 geladene Module ohne Modulversionsfehler; *installiert* meldete die Diagnose `E411-187A1` und `411187r1` und der Update-Watch warnte `Frontend-Neuladung erforderlich · V4.11.190 DEV → V4.11.187 DEV`, auch im Inkognito-Browser. `fingerprintMismatch:false`, aber `installedReleaseMismatch:true` und `revisionMismatch:true`.

**Exakt im aktuellen Quellcode nachgewiesen:** Alle drei mit GR 4.11.190 ausgelieferten Dateien `assets/gewitterradar-runtime-manifest.json` waren auf den alten Referenzstand **4.11.187 / 411187r1 / E411-187A1** stehen geblieben. Sie enthielten außerdem den alten Modulstand `weather.precipitation-layer@1.3.30`. Im Gegensatz dazu waren `version.js`, Modulmanifest und installierbare HA-Integration bereits fortgeschrieben. Der bestehende `core.update-watch.js` **und** `diagnostics/module-view.js` beziehen ihre `installed`-Angaben unmittelbar aus dieser statisch bereitgestellten Runtime-Manifest-Assetdatei. HA registriert das gesamte Frontend aus `custom_components/gewitterradar/frontend` unter `/gewitterradar` mit deaktiviertem HTTP-Cache. Ein Browser-Reload konnte eine **auf der Quell-/Installationsseite veraltete Assetdatei** deshalb logisch nicht reparieren.

**Abhilfe ohne Abschaltung der Schutzmechanismen:**
- Die reale installierte Manifestdatei **und beide Frontend-Kopien** (`custom_components/gewitterradar/frontend/`, `frontend/`, `dashboard/dist/`) sind nun identisch und enthalten vollständig `4.11.194`, `V4.11.194-DEV-2026-11-13`, `411194r1`, `E411-194A1` sowie exakt alle 36 aktuellen Module einschließlich `weather.precipitation-layer@1.3.36`.
- Release-Identität in `version.js`, Frontend-Einstieg `gewitterradar.js`, `module-manifest.js`, HA-`manifest.json` (**0.25.101**), und `build_info.py` (**4.11.194**, DRA-Installationskennung) synchronisiert.
- Der originale `update-watch`-Vergleich einschließlich Warnung und Reload-Guard blieb **unverändert aktiv**. Es wurde kein Sollwert herabgesetzt und keine Warnung unterdrückt.
- Bestehender DRA-Weg weiterhin `TheDaimos/gewitterradar@deploy/dev`, Payload `custom_components/gewitterradar`, `replace_directory`, Home-Assistant-Neustart nach Installation.

**Quell-Abnahme:** 36/36 installiert erwartete Modul-ID-/Versionspaare exakt mit dem aktualisierten Modulmanifest verglichen; alle acht installations- und rasterrelevanten Dateien sind zwischen den drei Frontend-Spiegeln bitidentisch (Git-Blob-SHAs). **Inkognito-Realabnahme nach erneuter DEV-Installation ist noch offen**; eine aktuell in VM109 vorhandene ältere Assetdatei wird erst mit der tatsächlichen DRA-Installation ersetzt.

## B. Kachelauslieferung – Ursache und gezielte Optimierung

In der existierenden V2-Tile-Pipeline `raster-mosaic-tile-loader.js` bestand eine `Promise.all`-Barriere für alle Providerfragmente einer Kachel; so konnte ein bereits erfolgreiches DWD-Bild mehrere Sekunden hinter einem noch nachladenden OPERA-Bild warten. Die frühere OPERA-Retry-Logik konnte zudem solange wiederholen, bis eine komplette Request-Generation abgebrochen wurde. Die WR-seitige Coveragereparatur aus 0.10.320 hat dagegen schon unabhängig nachgewiesen, dass die schwersten sechs-/neunsekündigen V2-Preflight-Blockaden beseitigt wurden. Sie wurde **nicht** modifiziert.

**Implementiert:**
1. **Inkrementelle, sofortige Bildverarbeitung pro Tile:** `drawRasterMosaicTileFromUrls` empfängt optional `onProgress`; jedes erfolgreich geladene/aus dem Cache verfügbare, durch den letzten WR-V2-Vertrag zugelassene Fragment löst eine Präsentation aus. Die bereits gesammelten Bilder werden bei jedem Fortschritt strikt in bestehender WR-/Renderer-Reihenfolge vollständig neu gezeichnet, damit eine später eintreffende Quelle die Priorität früherer Layer **nicht** umkehrt. Der reguläre finale Tile-Status wird weiterhin erst nach dem vollständigen Kontaktabschluss bewertet.
2. **Sichtbare progressive Anzeige bei leerem Viewport:** Der vorhandene `precipitation-layer` macht geprüfte Teilbilder während des Aufbaus sichtbar, **ausschließlich wenn keine gültige vorherige Generation zum Schutz vorliegt**. Bei fehlgeschlagenem Abschluss kann ein tatsächlich gemaltes, WR-autorisiertes Teilbild vorläufig als **`progressive_partial`** erhalten bleiben; nicht fertige/geografisch fehlende Bereiche bleiben ausdrücklich unvollständig und werden über die vorhandene beschränkte Refresh-Pipeline weiter eingeplant. Auf bestehende noch gültige Bildgenerationen wird weiterhin der **geschützte atomare Seamless-Handover** angewandt: keine unvollständige neue Generation darf ein gültiges vollständiges Radar unbemerkt ersetzen.
3. **NASA-Sicherheit:** Der neue Radar-Redraw-Callback wird bei einer `deferredSource` (NASA-Masken-/Komplementpfad) **nicht** verwendet, um die vorhandenen autoritativen Schutzmasken nicht zu überschreiben. Die separate NASA-Tile-Ankunft folgt unverändert dem schon vorhandenen Masken-/Grant-Vertrag und kann ebenfalls die erste sichtbar freigegebene Fläche anzeigen. Keine neuen GR-eigenen Gültigkeits- oder Geografieregeln.
4. **Begrenzter Retry:** Netzwerk-/HTTP-Fehler eines Providerbilds führen höchstens zu **einem gezielten Transportretry** (insgesamt zwei Versuche). HTTP 404/410 und andere nichtwiederholbare HTTP-4xx (außer 429; 401/403 bereits autorisierungsseitig abgelehnt) werden sofort als `image_http_unavailable` beendet; transiente Erschöpfung wird als **`image_retry_exhausted`** statt falsches `request_budget_exhausted` klassifiziert. Bereits geladene Fragmente bleiben nutzbar. Keine Änderung an WR-Kachelbudgets, HTTP-Sicherheitsregeln oder wissenschaftlichen Freigaben.
5. **Frame-/Bildcache geschützt:** Vorherige DWD-Decoded-Image-LRU (96 Einträge, 180 s, Source-ID/Framezeit/vollständige HTTPS-URL), vorhandener OPERA-Cache, per-Snapshot-Key/Inflight-Generationsbindung sowie der NASA-No-Store-Vertrag bleiben unverändert. Änderungen wurden über die gesamte V2-Importkette mit `?v=411194r1` an die tatsächlich geladene GR-Version gebunden.

**Wesentliche Code-Commits:** [Rootcause Runtime-Asset](https://github.com/TheDaimos/gewitterradar/commit/be311dd753368425ab2a5c437b82c3c33eb33ee0) · [Provider-fragment progressive Darstellung](https://github.com/TheDaimos/gewitterradar/commit/cd0ba91b66d5ed9a0ff5c4235040105e809b3499) · [GridLayer-Callback](https://github.com/TheDaimos/gewitterradar/commit/6c0781923dbb13a10a148540216b0fc68e828de4) · [Teilbilddarstellung bei leerem Viewport](https://github.com/TheDaimos/gewitterradar/commit/7732a9a6cc452e6c83ea43c2b814993d1ee8a161) · [HTTP-/Retry-Korrektur](https://github.com/TheDaimos/gewitterradar/commit/a3f54d0a3a6cb7734c20ebe36238ed8561f4f15c) · [konsistente HA/DRA-Endversion](https://github.com/TheDaimos/gewitterradar/commit/e0572d468a9097451adb058bc35c8f022f380243) · [HA/DRA-Quellparität](https://github.com/TheDaimos/gewitterradar/commit/a351ee034585e169bc586cfcf7c9421480861b55).

## C. Gezielte Tests und tatsächlicher Nachweis

`tests/gr-p0-progressive-dwd-cache.test.mjs` und `tests/gr-p0-runtime-manifest-progressive-192.test.mjs` wurden auf den finalen Versionsstand aktualisiert. Die letztere Datei prüft zusätzlich die echte isolierte, aus dem Rastermodul geladene Callback-Rückgabe und das einmalige gezielte HTTP-Retry.

**Direkt im aktuellen Tool-Lauf ausgeführt:**
- Aktuelle Runtime-Manifest-/Modulmanifest-Parität **36/36**; gleiches Release `4.11.194` und Runtime `411194r1` auf Quellseite.
- Drei Frontend-Spiegel für die acht zentralen Assets/Module via Git-Blob-SHA **8/8 identisch**.
- Isolierte JavaScript-Syntaxprüfung der vier betroffenen Module **4/4 PASS**.
- Echte isolierte Ausführung von `drawRasterMosaicTileFromUrls` mit zwei bereits freigegebenen/cached Quellen: progressive Rückgaben zuerst nur DWD, danach DWD+OPERA in definierter Reihenfolge, **0** neue Netzwerkanforderungen.
- Echte isolierte Ausführung des HTTP-Fehlerpfads: **404 führt zu 1 Versuch und `image_http_unavailable`**, **503 zu exakt 2 Versuchen und `image_retry_exhausted`**. Testharness nutzt browseräquivalente `AbortController`- und Timer-Stubs, keine realen HTTP-Aufrufe.
- Python-/Node-Gesamtsuite und HA-DEV-Live-Test wurden aus dieser Arbeitsumgebung **nicht** gestartet. Von diesen Quelltests darf nicht auf bestätigtes Android-/GPU-/Tile-TTFV geschlossen werden.

## D. Realabnahme und Restgrenzen

Auf **HA DEV VM109**, nicht auf VM101, per **bestehendem DRA DEV-Projekt** GR 4.11.194 / HA 0.25.101 mit WR 0.10.320 / Loader 323 installieren. Nach HA-Neustart muss die Inkognito-Moduldiagnose die neu installierten Kennungen `411194r1`/`E411-194A1` ohne `revisionMismatch`, `installedReleaseMismatch` und `stale` anzeigen; weiterhin **36/36 Module**. Ein konkreter Bildschirm-/Exportnachweis hierfür ist noch **offen**, da kein HA-DEV-VM109-Zugriff besteht.

Kachelreihenfolge und Cacheverhalten müssen danach mit der bestehenden privaten Export2Git-/GR-V2-Diagnose bei Hamburg → Azoren → USA → Europa → Polen → Hamburg real gemessen werden (erste freigegebene Teilkachel, pro-Provider- und Gesamtabschluss, Wiederbetreten, Retry-Fehlercodes, alter gültiger Frame erhalten, unbekannte DWD-/OPERA-Regionen fail-closed). WR-interne `resolve_mosaic_snapshot`-Provider-Kontakte bilden weiterhin teilweise eine gemeinsame `asyncio.gather`-Phase; **kein allgemeiner neuer WR-V2-Streaming-WebSocket-Vertrag** wurde eingeführt. Ein lückenloses Ende-zu-Ende-P0-PASS für alle Provider und die gesamte Kachelauslieferung ist deshalb **nicht** behauptbar.

**Veröffentlichungsentscheidung:** Die beiden konkret nachgewiesenen Fehlerpfade wurden im DEV-Code korrigiert und versioniert. **Realabnahme für die sichtbare Karte bleibt bis zur DEV-Installation offen**. Kein PROD-Deployment, keine neue 900-s-Grenze, keine TEST69-Wiederholung.
