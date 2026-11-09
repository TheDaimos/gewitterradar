# Gewitterradar V4.10 FINAL – Modell-B-Veröffentlichung und öffentliche Bereinigung

Stand: 09.11.2026. Autorisiert durch Christian Köhler. Technische Veröffentlichung und Bereinigung alter stabiler Angebote sind umgesetzt. Die Forderung nach ausschließlich V4.10 sichtbaren öffentlichen Ständen bleibt **TEILWEISE**: benötigte V4.11-/DRA- und Rollback-Referenzen bleiben gemäß Schutzvorgabe aktiv. HACS-Katalogaufnahme bleibt lizenzbedingt eingeschränkt.

## Status

| Bereich | Ergebnis | Nachweis / Grenze |
| --- | --- | --- |
| Modell-B-Release | ERLEDIGT | Beide Auslieferungen; einzige aktuelle stabile offizielle Version V4.10 FINAL |
| Historische stabile Releases | ERLEDIGT | 6 Integration + 7 Dashboard entfernt; ihre Release-Assets waren jeweils leer |
| Alte stabile Tags | ERLEDIGT | 6 Integration + 7 Dashboard entfernt; keine historischen Tags verschoben |
| Historische Branches | TEILWEISE | 71 + 16 entfernt; 28 + 1 verbleiben, einschließlich benötigter DEV-/Rollback-Quellen |
| Private Archive | ERLEDIGT | Sichtbarkeit, Referenzen, Assets, heruntergeladene Bundles, Wiederherstellung und fsck verifiziert |
| V4.11 / DRA | ERLEDIGT | Öffentlicher Branch, Quellkonfiguration und DEV-Releases unverändert; kein Umzug |
| HACS | TEILWEISE | NOASSERTION; keine OSI-Lizenz, keine offizielle Katalog-Lizenzfreigabe |
| Installationswege | ERLEDIGT | Anonyme ZIP-Downloads, vollständige Archive, SHA256 und Golden-Master-Vergleich; manuelle Anleitung vorhanden. Keine reale Neuinstallation als nachgewiesen ausgegeben |

## Tatsächlich veröffentlichte Edition

- [Offizielles V4.10-FINAL-Release](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.10-model-b-20261109)
- [Dashboard-Auslieferung](https://github.com/TheDaimos/gewitterradar-dashboard/releases/tag/v4.10-model-b-20261109)
- [Tatsächlich ausgelieferte LICENSE.md](https://github.com/TheDaimos/gewitterradar/blob/v4.10-model-b-20261109/LICENSE.md)
- [Release-Commit 8a7e3a31a810b1b7a817a26a126e9254d4b9c75b](https://github.com/TheDaimos/gewitterradar/commit/8a7e3a31a810b1b7a817a26a126e9254d4b9c75b)
- [Dashboard-Commit d0724411c963fe3074b2c1ba3260de6c73e6717f](https://github.com/TheDaimos/gewitterradar-dashboard/commit/d0724411c963fe3074b2c1ba3260de6c73e6717f)
- [main-Implementierung 8a7746c106899fe7aa0f19796eaf4204d28a8ed5](https://github.com/TheDaimos/gewitterradar/commit/8a7746c106899fe7aa0f19796eaf4204d28a8ed5)
- [Maschinenlesbare Vorher-/Nachher-Inventare und Prüfbelege](https://github.com/TheDaimos/Project-Log-And-Export/tree/d9aa1ea2a4cedc77695114790ae9df9556eef255/gewitterradar/2026-11-09/v4.10-model-b-20261109/20261109T141125Z/)

Die sichtbare Produktversion bleibt V4.10 FINAL, die native Manifestversion 0.22.0. Der datierte Tag unterscheidet die Lizenzedition. Die maßgebliche [WeatherRouter-Lizenzvorlage](https://github.com/TheDaimos/weather-router-dev-pub/blob/main/LICENSE.md), Blob `a0a3a51b6033219614f44ccdad0ae983d6f7d87a`, wurde ausschließlich beim Projektnamen angepasst. LICENSE und LICENSE.md sind identisch. Keine SPDX-Tarnkennung und keine Abschaltung der HACS-Lizenzprüfung.

Die erste kurzzeitig veröffentlichte Edition `v4.10-model-b` enthielt zusätzliche Lizenzbeilagen im Integrationsordner. Die öffentliche CI meldete dadurch einen verletzten unveränderten Paket-Dateivertrag. Diese Edition, ihre vollständigen Release Notes, Assets und Git-Referenzen wurden zusätzlich privat gesichert und verifiziert, danach entfernt. Ihr Tag wurde nicht verschoben. Die datierte Edition legt Lizenz-/Autoren-/Branding-Beilagen auf Repository- und ZIP-Wurzelebene ab; der vollständige Integrations-Laufzeitordner bleibt exakt original. Tests, Paketvertrag und Anwendung wurden dafür nicht verändert.

## Golden Master, Lizenzmetadaten und Prüfsummen

Originalcommit: `3111e9d27a62adf97d37cccb8066cc9a0803c128`; Originaltree: `6cc90fa79bc9374cf9b761d7d2aecfca5f02be92`. Original-Artefakt `11096939593`, SHA256 `7f1f308722c1f6fb9ccfac0405d5e65392ca55463eea6f8c6a56c095a2b5b772`. Alle 823 ursprünglichen Git-Dateien wurden gegen den eingebetteten Golden-Master-Quell-ZIP bytegenau verifiziert. Für Vergleiche wurden rohe Git-Blobs verwendet; dadurch entstehen keine Windows-CRLF-Konvertierungsartefakte.

Der neue Snapshot lässt 815 Originaldateien unverändert. Änderungen betreffen ausschließlich folgende Lizenz-/Autoren-/Veröffentlichungsdokumente: `AUTHORS.md`, `BRANDING.md`, `COPYRIGHT.md`, `LICENSE`, `LICENSE.md`, `README.md`, `dashboard/README.md`, `docs/INSTALLATION.md`, `docs/gewitterradar-overview.html`. Der gesamte native Laufzeitordner mit **112 Dateien**, sämtliche 96 gemeinsamen Frontenddateien und der vollständige Dashboard-Laufzeitbaum mit 98 Dateien entsprechen dem Golden Master. Python-/Wetter-/Radar-/Wind-/Temperaturcode, Module, UI, Assets, Hi-Res-Master und Originalwidmung „Für Alkje“ wurden nicht verändert.

Frontend-SHA256 aller kanonischen Auslieferungsformen: `62f692b07e1bda236b956d9254215da0762396e67606297cfa52e6c26b20704e`.

| Paket | SHA256 |
| --- | --- |
| `gewitterradar-0.22.0-model-b.zip` | `09f25cd3544b1aaea40e710ec14be463176ab7c4f8f4f3cb7ecd665c39cb1f6a` |
| `gewitterradar-dashboard-v4.10-model-b.zip` | `7cf0bae34466b99c671f4889be3fbc9fdc86aa8a7f371ea10951f4d33ebfef92` |
| `gewitterradar-v4.10-model-b-source.zip` | `a97655bdf240865c7e1a46f0ea883a79b33a94d029a332d2ecab6fc0a5a07bd3` |

Die beiden Installations-ZIPs wurden vollständig anonym heruntergeladen. Für die datierte Edition wurden genau diese vorhandenen Downloads wiederverwendet und durch SHA256 eindeutig zugeordnet; das Dashboard-Archiv entspricht auch dem im Dashboard-Repository veröffentlichten Asset-Digest. ZIP-CRC/Vollständigkeit, identische Modell-B-Lizenztexte, exakte Dateimengen und jeder Laufzeit-Dateiinhalt wurden geprüft. Der Quell-ZIP wurde vor Upload vollständig auf Archivintegrität geprüft; GitHub bestätigt seinen oben angegebenen Asset-Digest.

Der ursprüngliche V4.10-Release-Notes-Text bleibt wortgetreu als Präfix der neuen GitHub-Releasebeschreibung erhalten; SHA256 des Originaltexts `0f1022d0dace13237992cf27e16c9a57ba1ac541fc3c239dbe50c0e610219fd1`. Hinzugefügt wurden nur transparente Lizenz-/Veröffentlichungsnotizen. Die ursprüngliche Datei `docs/RELEASE_NOTES_V4_10.md` und sämtliche Entwicklungskapitel bleiben unverändert.

## Inventar und konkrete Entfernung

| Repository | Releases vorher → nachher | Tags vorher → nachher | Branches vorher → nachher |
| --- | --- | --- | --- |
| [gewitterradar](https://github.com/TheDaimos/gewitterradar) | 30 → 26 | 30 → 26 | 99 → 28 |
| [gewitterradar-dashboard](https://github.com/TheDaimos/gewitterradar-dashboard) | 7 → 1 | 7 → 1 | 17 → 1 |

### gewitterradar

Entfernte stabile Releases und gleichnamige Tags: [v4.10](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.10), [v4.09](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.09), [v4.08](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.08), [v4.07.57](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.07.57), [v4.07.56](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.07.56), [v4.06](https://github.com/TheDaimos/gewitterradar/releases/tag/v4.06). Die ursprünglichen Releases hatten keine angehängten Assets; die automatisch erzeugten tagbezogenen Quellarchive werden nach Taglöschung nicht mehr regulär angeboten. Sämtliche vorhandenen 114 GR-DEV-Release-Assets bleiben unverändert.

Entfernte historische Branches:

| Branch | Gesicherter Originalcommit |
| --- | --- |
| `archive/v4.07-test6-before-settings-regression-fix` | `fe8b45a1175fed4ad10878675988ed3f1e4cca13` |
| `build/v4.09.01-download-2026-09-20` | `2c7fd321e3849ca826ee4df16f070e3ff8a1db28` |
| `build/v4.09.02-download-2026-09-20` | `3c506a396068e9b2bab20a8d601b354842d92282` |
| `build/v4.09.02-test-package-2026-09-20` | `84871560b11f2b1fd2ff4a5d05b30ca1d3ab28b1` |
| `build/v4.09.03-download-2026-09-20` | `aebad22e50a743ed78674c85725e365c247b6965` |
| `build/v4.09.27-current-download-2026-09-21` | `49477108d5641b5f3a8956b711683e14d92f9437` |
| `build/v4.09.27-download-2026-09-21` | `eb24a789dc9600f2351896fd1fcec5a9be188a6f` |
| `build/v4.09.27-zip` | `d4e15d2e3a3ae4f34c4f73612d7cb960c44a97ae` |
| `diagnostic/v4.07-settings-regression` | `efb34459deccebeab41da1338d8eccf895c066d4` |
| `docs/finalize-installation-v4.07.56` | `429e1134b540b9cf3e9b32db5c2c7e97c4af88e1` |
| `docs/integration-first-readme` | `b8387a9882e10a301fd29ad4fa92f095dc3dfd1e` |
| `docs/native-integration-installation` | `5c764b4e1bf7a0abe83033d0cb24e737c9797735` |
| `docs/v4.09.01-handoff-followup-2026-09-20` | `0f8582c455e47fb31d9d3efe700988697e97ddd7` |
| `docs/v4.09.01-map-display-handoff-2026-09-20` | `fdb020a796a687310eb70c74ad648eb164372105` |
| `feature/v4.07-location-search-ui` | `0542a3d7870de32a0a67f234c948fc30fb4afb06` |
| `feature/v4.07-location-search-ui-next` | `4e08a15e47245e5a4bd6d3f579a83cee33f54e3e` |
| `feature/v4.07-location-search-ui-next-copy` | `a07003d7e17c8bfc8bb9e78b60fc41352ae1e4c5` |
| `feature/v4.07-location-search-ui-next-copy2` | `66852041a4d2c17fa881ceb8654faff79ac9f894` |
| `feature/v4.07-location-search-ui-next-copy3` | `66852041a4d2c17fa881ceb8654faff79ac9f894` |
| `feature/v4.07-location-search-ui-next-temp` | `66852041a4d2c17fa881ceb8654faff79ac9f894` |
| `feature/v4.07.31-help-i18n-complete` | `4c792a82499b7377b785540adb0b09dc0c757315` |
| `feature/v4.07.32-review-polish` | `3226e2e9366393de84a7aa0815ffd3aeca78b8bf` |
| `feature/v4.07.33-review-polish-fix` | `3e63d38e48279fb9699df1f61921cbcb5274d1a7` |
| `feature/v4.07.34-review-polish-r2` | `af0d9e4ea4aeee106b2f31dac5bc1ccdeb985331` |
| `feature/v4.07.35-ipad-inline-favorites-polish` | `8badf61a48ff124a53c5ae1fe57ac7c34b3e423b` |
| `feature/v4.07.36-coordinate-input` | `1524cf71448e9772a8ed951fb7787b33cfb17587` |
| `feature/v4.07.37-coordinate-save-premium` | `d4520fda61f13cd34e0ce6150cd2ae6942995b84` |
| `feature/v4.07.38-location-wording-target-polish` | `32036d79937539cd341a11e4f9a3cc97122f0dac` |
| `feature/v4.07.39-coordinate-saved-target` | `2b017f8d66f4ac0253726cbb5b6a4f2e780d86cc` |
| `feature/v4.07.40-target-readability` | `b5dd10428fec279873d2a28b9d8441fae4ef932f` |
| `feature/v4.07.45-premium-assets-embedded-fix` | `b5dd10428fec279873d2a28b9d8441fae4ef932f` |
| `feature/v4.08-cluster-zoom-and-cleanup` | `5e0a790173fef6ee48a4ff6a2446c91ae1290233` |
| `feature/v4.08-map-view-modes` | `9c2760498bd284a0818392ee9012f5a7dfa9b4b2` |
| `feature/v4.09-coordinate-clear-dropdown-polish` | `9b22ac51780cac822321fa58f3c64d4286d96a37` |
| `feature/v4.09-map-display-modes` | `d6b2b68bb36f9e0e9f1a9b20d0526c81b47cc308` |
| `feature/v4.09-map-view-modes` | `8fde20c5661dcfaa553eead3d76964e56ff1269e` |
| `feature/v4.09-map-viewport-modes` | `a9d76e43c8d7d2def69045f860f105cde16a27a4` |
| `feature/v4.09.02-map-display-fixes` | `8f76544c66fd0efe3a3b30dce95846c2eefd68e5` |
| `feature/v4.09.03-fullscreen-controls` | `f857e48153c0c2749486fb79defb3009593d34c5` |
| `feature/v4.09.04-overlay-drag-fixes` | `bac8868493e4d735ac78d98edc53a0675aaef67c` |
| `feature/v4.09.05-android-touch-drag` | `1b1d3367c50126ae2069ab64fe7c8d0f96dfb862` |
| `feature/v4.09.06-floating-location-pill` | `8a3af2bf899d06f420cc69a0564ddba8f07575c0` |
| `feature/v4.09.06-movable-location-pill` | `8eae178952f9ff139bbc1180162731ec420a888a` |
| `feature/v4.09.07-ipad-location-columns` | `8c789da9763f0a264670ec68838acf59d741577d` |
| `feature/v4.09.27-radii-scroll-fix` | `eb24a789dc9600f2351896fd1fcec5a9be188a6f` |
| `feature/v4.09.28-coordinate-name-clear` | `31d21fdbe291f4f17104057b6217c1f735547eb4` |
| `feature/v4.10-finalization` | `900cb2051d26b2de38a10ac97030a81708315a40` |
| `feature/v4.10.01-compass-picker` | `b85d61a4aa294fca83b4078c0b8a35321746f945` |
| `feature/v4.10.02-modularization` | `d621a8157ff3ea03c204638183ad3d9a2d31a645` |
| `finalize/v4.07.56-main-promotion` | `df3d3ee6b38c0a4951e6020ff9b843eff6a970bd` |
| `fix/v4.09.02-map-window-main-control` | `43246b0cc9cc61c02f6325e6247145fdb03148ac` |
| `freeze/v4.07.48-final-candidate` | `b5dd10428fec279873d2a28b9d8441fae4ef932f` |
| `freeze/v4.07.49-final-candidate` | `66dd024f420d94b92a8e569585e657c71120906c` |
| `frozen/v4.06` | `5ab55c8ad81b0860e0fff64f324cfa06d256ed17` |
| `frozen/v4.07.56` | `6418fd57790efdbb267cc2994f00bb995f40acfd` |
| `frozen/v4.07.57` | `3f3f3c1a574db529d3ac623681fdec4298b26605` |
| `frozen/v4.08` | `27da94e5043a365dbe8ea5c5e2224327165750fa` |
| `frozen/v4.09` | `a6a5b68ebc289f04217bc5abb55c46422dce4e4c` |
| `frozen/v4.10` | `f72495ff24045b7810f22edc2cc4f6745734332d` |
| `ops/v4.08-premerge-snapshot` | `20f7b70e944542adbdbfc8883b3c83fe348c7c97` |
| `planning/v4.08-cluster-zoom-and-cleanup` | `047e195d8f9a9b82dc8cfc210097e055b5835085` |
| `release/v4.07.57` | `455ca555c6daa4be9a4bbd14493c467e04b324fe` |
| `release/v4.08` | `27da94e5043a365dbe8ea5c5e2224327165750fa` |
| `release/v4.09` | `1c211f5a94fd646711b3e365746db36aefde79f1` |
| `release/v4.10-archive-gate-fix` | `65aa6a7ab96faaf0b50e291d5c25ce8d0844c811` |
| `test/dra-v4.10.02-cache-mixed-state` | `274d9304823be7a1ec8620ec6f157493813d0e47` |
| `test/dra-v4.10.02-missing-module` | `0bfaaf3bfda0873b0e578895fa154857d3b47927` |
| `test/dra-v4.10.02-single-module` | `26b935870e5e871ece26fb724d9ef67a019668e7` |
| `tmp/compass-picker-retina-assets-20260924` | `6a1c049dea2615eda5d48a1ddb6388cf317680fc` |
| `tmp/r13-medallion-upload` | `c8c49b14b6e08f973c08fa4e3dda6e04f33e2a2e` |
| `tmp/v40902-artifact-base` | `4d071b3cd21a2ba33a33ee6036f23430c8df6099` |

Verbliebene Branches: [chore/dra-metadata](https://github.com/TheDaimos/gewitterradar/tree/chore/dra-metadata), [deploy/dev](https://github.com/TheDaimos/gewitterradar/tree/deploy/dev), [deploy/v4.09](https://github.com/TheDaimos/gewitterradar/tree/deploy/v4.09), [feature/opera-ref-2026-11-04-router-owned](https://github.com/TheDaimos/gewitterradar/tree/feature/opera-ref-2026-11-04-router-owned), [feature/p7-010-consumer-adapter-2026-10-14](https://github.com/TheDaimos/gewitterradar/tree/feature/p7-010-consumer-adapter-2026-10-14), [feature/p7-010-integration-v41178-2026-10-14](https://github.com/TheDaimos/gewitterradar/tree/feature/p7-010-integration-v41178-2026-10-14), [feature/p7-010-intent-matrix-2026-10-14](https://github.com/TheDaimos/gewitterradar/tree/feature/p7-010-intent-matrix-2026-10-14), [feature/p7-010-spatial-tile-budget-2026-10-15](https://github.com/TheDaimos/gewitterradar/tree/feature/p7-010-spatial-tile-budget-2026-10-15), [feature/p7-010-v41182-forward-port-2026-10-15](https://github.com/TheDaimos/gewitterradar/tree/feature/p7-010-v41182-forward-port-2026-10-15), [feature/p7-010-v41182-forward-port-2026-10-16](https://github.com/TheDaimos/gewitterradar/tree/feature/p7-010-v41182-forward-port-2026-10-16), [feature/p7-010-world-bbox-2026-10-14](https://github.com/TheDaimos/gewitterradar/tree/feature/p7-010-world-bbox-2026-10-14), [feature/test70-wr-authoritative-2026-11-03](https://github.com/TheDaimos/gewitterradar/tree/feature/test70-wr-authoritative-2026-11-03), [feature/v4.11-development](https://github.com/TheDaimos/gewitterradar/tree/feature/v4.11-development), [feature/v4.11.69-data-sources](https://github.com/TheDaimos/gewitterradar/tree/feature/v4.11.69-data-sources), [feature/v4.11.70-export-hotfix](https://github.com/TheDaimos/gewitterradar/tree/feature/v4.11.70-export-hotfix), [feature/v4.11.71-dynamic-sources-layout](https://github.com/TheDaimos/gewitterradar/tree/feature/v4.11.71-dynamic-sources-layout), [feature/v4.11.72-data-sources-spacing](https://github.com/TheDaimos/gewitterradar/tree/feature/v4.11.72-data-sources-spacing), [feature/v4.11.73-weather-style-profiles](https://github.com/TheDaimos/gewitterradar/tree/feature/v4.11.73-weather-style-profiles), [feature/v4.11.74-soft-zoom-smoothing](https://github.com/TheDaimos/gewitterradar/tree/feature/v4.11.74-soft-zoom-smoothing), [feature/v41178-soft-zoom11-13-2026-10-15](https://github.com/TheDaimos/gewitterradar/tree/feature/v41178-soft-zoom11-13-2026-10-15), [feature/v41180-cloud-melt-zoom11-13-2026-10-15](https://github.com/TheDaimos/gewitterradar/tree/feature/v41180-cloud-melt-zoom11-13-2026-10-15), [feature/v41181-raster-lab-2026-10-15](https://github.com/TheDaimos/gewitterradar/tree/feature/v41181-raster-lab-2026-10-15), [feature/v41184-weather-engine-overview-2026-10-16](https://github.com/TheDaimos/gewitterradar/tree/feature/v41184-weather-engine-overview-2026-10-16), [fix/v4.11.54-stable-danger-strikes](https://github.com/TheDaimos/gewitterradar/tree/fix/v4.11.54-stable-danger-strikes), [fix/v41182-raster-lab-button-2026-10-15](https://github.com/TheDaimos/gewitterradar/tree/fix/v41182-raster-lab-button-2026-10-15), [freeze/v4.11-pre-project-hub-2026-10-02](https://github.com/TheDaimos/gewitterradar/tree/freeze/v4.11-pre-project-hub-2026-10-02), [main](https://github.com/TheDaimos/gewitterradar/tree/main), [release/v41180-dev-verified-2026-10-15](https://github.com/TheDaimos/gewitterradar/tree/release/v41180-dev-verified-2026-10-15).

### gewitterradar-dashboard

Entfernte stabile Releases und gleichnamige Tags: [v4.09](https://github.com/TheDaimos/gewitterradar-dashboard/releases/tag/v4.09), [v4.08](https://github.com/TheDaimos/gewitterradar-dashboard/releases/tag/v4.08), [v4.07.57](https://github.com/TheDaimos/gewitterradar-dashboard/releases/tag/v4.07.57), [v4.06](https://github.com/TheDaimos/gewitterradar-dashboard/releases/tag/v4.06), [v4.05](https://github.com/TheDaimos/gewitterradar-dashboard/releases/tag/v4.05), [v4.04](https://github.com/TheDaimos/gewitterradar-dashboard/releases/tag/v4.04), [v4.03](https://github.com/TheDaimos/gewitterradar-dashboard/releases/tag/v4.03). Die ursprünglichen Releases hatten keine angehängten Assets; die automatisch erzeugten tagbezogenen Quellarchive werden nach Taglöschung nicht mehr regulär angeboten. Sämtliche vorhandenen 114 GR-DEV-Release-Assets bleiben unverändert.

Entfernte historische Branches:

| Branch | Gesicherter Originalcommit |
| --- | --- |
| `docs/dashboard-first-readme` | `14acf69fab768969ad30fb96c3a74dfd948e38c7` |
| `docs/finalize-installation-v4.07.56` | `b959100d6f4788360b3b8db3bf85335fc06aa135` |
| `finalize/v4.07.56-derived` | `41b61332ff0bd15e7640b0fe1361fc5dac8ad912` |
| `frozen/v4.04` | `8ada0e06aef47627d31224b9e46d58de459fb24b` |
| `frozen/v4.05` | `44a3a615f76a7d865c2d6c8690728656c18577b9` |
| `frozen/v4.06` | `c103e6cb1cee855fb9cecb636952c426adcca75f` |
| `frozen/v4.07.56` | `41b61332ff0bd15e7640b0fe1361fc5dac8ad912` |
| `frozen/v4.07.57` | `771cb4d8595a5146b2565ea33cb4bfc93d5e903d` |
| `frozen/v4.08` | `cba234a37f20971c2f64b393202dbb70007dc19d` |
| `frozen/v4.09` | `c26e3e155dd0c858d650ad13ff9e562c9b100602` |
| `release/v4.07.57` | `54d00d1742a0f8ebc6e6e45258ed76d0f9ae92a9` |
| `release/v4.08` | `cba234a37f20971c2f64b393202dbb70007dc19d` |
| `release/v4.09` | `6f373306e05946d0048ebd5e1ef1a9a3f07165bb` |
| `release/v4.10` | `efa5e6382318d62052ce1ae34724fd89ceb5fa77` |
| `release-prep/v4.07` | `221b4f40357c30ff4ed35bcb33cf86553182b41e` |
| `test/v4.07-location-search-ui` | `11d0178806082436803eea73479195edd8dd7aa1` |

Verbliebene Branches: [main](https://github.com/TheDaimos/gewitterradar-dashboard/tree/main).

Zusätzlich wurden sechs überholte direkte Dashboard-Downloads `gewitterradar-card-v4_03.js/.txt`, `v4_04.js/.txt` und `v4_05.js/.txt` aus dem aktuellen Dashboard-Baum entfernt; ihre Inhalte bleiben privat gesichert. Der Dashboard-Baum liefert jetzt den vorgesehenen V4.10-Frontendstand aus der kanonischen Quelle. Historische Release-Notes-Dateien bleiben als Dokumentation erhalten.

Die alten sechs GR-Releasepfade und ihre tagbezogenen Quell-ZIP-Pfade wurden anonym geprüft: jeweils HTTP 404. Für das Dashboard ist die Entfernung über erfolgreiche GitHub-DELETE-Antworten und das abschließende Remote-Inventar nachgewiesen. Die neuen Pakete sind vollständig anonym erreichbar. Es werden keine nicht ausgeführten Zugriffstests behauptet.

## Private Wiederherstellbarkeit und öffentliche Grenzen

Vor der ersten Löschung wurden die beiden vorhandenen privaten Archive erneut per GitHub abgefragt: privat, Actions deaktiviert. Alle 169 GR-Referenzen (99 Branches, 30 Tags, 40 PR-Refs) und 34 Dashboard-Referenzen (17 Branches, 7 Tags, 10 PR-Refs) wurden exakt verglichen und unter zusätzlichen unveränderlichen Snapshot-Referenzen gesichert. 30 + 7 Release-Metadaten mit vollständigen Release Notes sowie 114 Original-Assets sind gesichert; lokale Asset-SHA256-Werte stimmen mit den privaten Upload-Digests überein. Zusätzliche maschinenlesbare Inventare liegen im privaten Sicherungsbereich. Private Namen/Zugangsdetails werden hier nicht veröffentlicht.

Neu hochgeladene vollständige Bundles wurden aus den privaten Releases heruntergeladen, über SHA256 geprüft, in separate Bare-Repositories wiederhergestellt und mit `git fsck --full` kontrolliert. Alle ursprünglichen Referenzen wurden anschließend im Restore erneut aufgelöst.

| Archiv | Vollbundle SHA256 |
| --- | --- |
| gewitterradar | `da85c6a3e8e73b6c2953ac128ed9f65f2639c19b8144a1bdbcf44717de5dd9c5` |
| gewitterradar-dashboard | `3cb684f859d40884cb85ed4f7fee9ea9913844c94482ef06babe74c37b3544b5` |

Die Bereinigung entfernt das normale historische Release-/Tag-/Branch-Angebot. Sie ist kein vollständiges Löschen aller historischen Git-Objekte: Der ursprüngliche Commit bleibt bereits als Vorfahr der neuen Edition erreichbar. PR-Referenzen, bekannte SHAs, GitHub-Caches und bestehende öffentliche Actions-Artefakte können weitere Zugriffspfade behalten. Actions-Artefakte wurden nicht gelöscht. Frühere rechtmäßig gewährte GPL-Rechte bestehen fort. Eine totale technische Löschung oder rückwirkende Umlizenzierung wird ausdrücklich nicht behauptet. Siehe [GitHub zu verbleibenden historischen Zugriffspfaden](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/removing-sensitive-data-from-a-repository).

## V4.11, DRA und Installationswege

`deploy/dev` wurde durch parallele Entwicklung fortgeschrieben und steht bei der abschließenden Leseprüfung auf `4fd12ea9134897ef8ba7b73b910455a6e8f64aa9`; die vorhandene Produktidentität ist 4.11.168 / Runtime 411168r1 / Modulset E411-168A1. Auch `deploy/v4.09` bleibt unverändert auf `421426be1b98fd96bf1642a7601d2ceee02e11d9`. Dieser Rollback-Branch wird von der bestehenden öffentlichen validate.yml ausdrücklich abgefragt. 24 öffentliche V4.11-DEV-Prereleases und ihre Tags/Assets bleiben erhalten. Aktive V4.11-, OPERA- und laufende Entwicklungsbranches wurden geschützt. Ein bestätigter funktionsfähiger Ersatzweg für DRA liegt nicht vor; daher keine private Umstellung und keine heimliche Deaktivierung.

Die abschließende DRA-Prüfung war ausschließlich lesend: exakte Branch-SHAs gegen die gesicherte Bestandsaufnahme und anonyme Erreichbarkeit von deploy-relay.json, deploy-relay-channel.json, manifest.json und dra-deployment-provenance.json (HTTP 200/206). Bestehende Konfiguration, Quellen, Loader-Vertrag und lokale laufende V4.11-Arbeitskopie wurden nicht beschrieben. Ein zuvor zusätzlich gestarteter DEV-Verifier meldete einen bereits im unveränderten DEV-Snapshot vorhandenen Kennungswiderspruch (Prüfskript erwartet 4.11.167, build_info.py enthält 4.11.165). Dieser Befund wurde nicht durch den Lizenzauftrag behoben oder als erfolgreiche neue DEV-Laufzeitprüfung ausgegeben.

[Manuelle Installation und HACS-Custom-Repositories](https://github.com/TheDaimos/gewitterradar/blob/main/docs/INSTALLATION.md) bleiben dokumentiert. Eine physische HA-/HACS-Neuinstallation wird nicht behauptet. Nach der abschließenden Einschränkung des Prüfungsumfangs wurden keine neuen Installations-, HA-Laufzeit-, Regressions- oder wissenschaftlichen Tests ausgelöst. Bereits laufende öffentliche CI und vorhandene Testergebnisse wurden ausschließlich gelesen.

## HACS, CI und vorhandener Hilfeseitenbefund

[HACS verlangt eine erkennbare OSI-anerkannte Lizenz](https://www.hacs.xyz/docs/publish/include/#check-license); NOASSERTION und nichtkommerzielle Lizenzen erfüllen diese Katalogprüfung nicht. Diese Einschränkung folgt aus Modell B. [Benutzerdefinierte Repositories](https://www.hacs.xyz/docs/faq/custom_repositories/) sind ein gesonderter Weg; erfolgreiche Archiv-/Dateiprüfung ist keine offizielle Kataloganerkennung oder reale HACS-Neuinstallation.

Vor der abschließenden Umfangseingrenzung erfolgreich vorhanden: Paketstaging, exakter REQUIRED-Dateivertrag, DRA-Vertrag am V4.10-Kandidaten, vollständige Frontend-/Asset-/Paketparität der Release-Edition und Hi-Res-Retention (41 geschützte Inhaltsidentitäten). Die öffentliche CI wurde nach Veröffentlichung automatisch ausgelöst; die folgenden Ergebnisse wurden nur abgefragt:

| Commit / Workflow | Ergebnis | Einzeljobs |
| --- | --- |
| [8a7e3a31a810 · Validate Gewitterradar integration](https://github.com/TheDaimos/gewitterradar/actions/runs/42638453932) | failure | hacs-integration: failure, package-contract: success, hassfest: success, home-assistant-runtime: success |
| [8a7e3a31a810 · Validate shared Gewitterradar frontend](https://github.com/TheDaimos/gewitterradar/actions/runs/42638454040) | success | shared-frontend: success |
| [8a7746c10689 · Hi-Res asset retention](https://github.com/TheDaimos/gewitterradar/actions/runs/42638446424) | success | verify-hires-asset-retention: success |
| [8a7746c10689 · Validate shared Gewitterradar frontend](https://github.com/TheDaimos/gewitterradar/actions/runs/42638446418) | failure | shared-frontend: failure |
| [8a7746c10689 · Validate Gewitterradar integration](https://github.com/TheDaimos/gewitterradar/actions/runs/42638446458) | failure | hacs-integration: failure, package-contract: success, hassfest: success, home-assistant-runtime: success |

Der Gesamtstatus wird nicht als grün ausgegeben. HACS meldet NOASSERTION. Der bekannte Frontend-Hilfeseiten-Abgleich auf main bleibt separat bestehen: die ausgelieferten help/index.html-Dateien und Anwendung bleiben unverändert; nur die rechtlichen Dokumentationstexte in docs/gewitterradar-overview.html wurden angepasst. Es erfolgte kein nebenläufiger Austausch der geschützten Hilfeseiten. Die ursprüngliche V4.10-Release-Edition besitzt diese später hinzugefügten Help-Bäume nicht und besteht ihren eigenen Frontendvertrag.

Der [frühere Bericht](GR_V4_10_FINAL_LICENSE_AND_HISTORY_CLEANUP_2026-11-09.md) wurde nicht überschrieben. Seine damaligen Feststellungen gelten als historische Bestandsaufnahme. Diagnose-/Prüfexporte dieses Auftrags wurden ausschließlich unter dem oben verlinkten Project-Log-And-Export@main abgelegt; private Sicherungsinventare bleiben privat. Keine privaten Actions wurden gestartet.


Parallelfortschritt: `7213b7aeffba5c6bc6fd2afb6bd74f84c88632b6` → `4fd12ea9134897ef8ba7b73b910455a6e8f64aa9`, 3 Nachfolgecommits; GitHub-Compare meldet `ahead`. Dieser Auftrag hat deploy/dev nicht beschrieben. deploy-relay.json und deploy-relay-channel.json sind gegenüber der Ausgangsaufnahme **byteidentisch**; der bestehende öffentliche DRA-Quellweg bleibt erreichbar. Die privaten Vollbundle-Nachweise beziehen sich auf die exakte Bestandsaufnahme vor der Bereinigung; die parallel später entstandenen DEV-Commits wurden nicht als Bestandteil dieser älteren Bundles ausgegeben.

Der Abschlusscommit ändert ausschließlich diesen Bericht. `[skip ci]` respektiert die ausdrücklich begrenzte Abschlussprüfung und löst dafür keine weiteren Installations-/Laufzeittests aus. Die bestehenden Validierungen wurden weder geändert noch abgeschaltet; ihre oben dokumentierten Ergebnisse bleiben maßgeblich.
