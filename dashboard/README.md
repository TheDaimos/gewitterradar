# Gewitterradar V4.10 FINAL – Dashboard-Auslieferung

Originalentwicklung und ursprünglicher Urheber: **Christian Köhler**.

Diese Auslieferung stammt bytegleich aus dem freigegebenen V4.10-Golden-Master des kanonischen Projekts. Lizenzedition 2026-11-09: [Gemeinschaftslizenz Modell B](https://github.com/TheDaimos/gewitterradar/blob/v4.10-model-b-20261109/LICENSE.md).

Die vollständige Laufzeit liegt in `dist/`: `gewitterradar.js`, alle Assets, Locales und Module gemeinsam installieren. Die Dashboard-Variante verwendet weiterhin `app_gewitterradar_v4_07_pkg.yaml`; diese Paketbezeichnung ist keine Produktversionsnummer. Nur dieses Package aktivieren, V4.06 nicht parallel laden. Native Installationen benötigen kein Legacy-Package.

Veröffentlichung: [V4.10 FINAL](https://github.com/TheDaimos/gewitterradar-dashboard/releases/tag/v4.10-model-b-20261109). Vollständige [Installationsanleitung](https://github.com/TheDaimos/gewitterradar/blob/main/docs/INSTALLATION.md), einschließlich manueller nativer Installation und HACS-Custom-Repositories. Keine offizielle HACS-Katalog-Lizenzfreigabe und kein Nachweis einer realen Neuinstallation.

Manuell: den gesamten Inhalt von `dist/` nach `/config/www/gewitterradar/` kopieren, `app_gewitterradar_v4_07_pkg.yaml` zusätzlich nach `/config/packages/` kopieren und Packages gemäß Anleitung aktivieren. Ressource `/local/gewitterradar/gewitterradar.js` als JavaScript-Modul eintragen; nur eine Gewitterradar-Ressource aktiv halten. Vollständigen erforderlichen Quellcode liefert das kanonische Release-Quellarchiv kostenlos mit.
