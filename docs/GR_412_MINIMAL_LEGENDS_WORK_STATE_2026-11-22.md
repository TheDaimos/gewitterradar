# V4.12 – Fortsetzung nach visueller Endkontrolle

ERLEDIGT: alle sieben Funktionen im Kandidaten 4.12.7, zwölf öffentliche Ketten auf 8a35cba4d7c65a4c2bf84c964dc7312433ad95ec, CRC-/Original-Blob-Prüfung der CI-Pakete. Keine Veröffentlichung dieses Kandidaten.

TEILWEISE: Endkontrolle fand Kartenbedienelemente über der Standardposition. Ursache: nur Kandidaten mit fünf Pixeln Abstand und fehlender Cluster-Navigation; enge gültige Lücken wurden übersehen. Ergänzt sind Kandidaten an den tatsächlichen Kanten, Cluster-Button und andere sichtbare Instrumente als Hindernisse. Neuer Browser-Gate prüft den tatsächlichen Hit-Test des Info-i vor jeder Standardaufnahme. Eigene finale Version 4.12.8 / HA 0.25.169 / 4128r1 / E412-8A1, damit kein bereits bereitgestellter Cache-Schlüssel erneut verwendet wird.

OFFEN: gezielter Platzierungsnachweis, öffentliche Ketten auf finalem Quellcommit, endgültige Bild-/Paketbelege und DEV-Veröffentlichung. Vorherige gültige Tests nicht wahllos lokal wiederholen. Paketquelle final ausschließlich öffentlicher Linux-CI-Lauf; Windows-Kandidaten konvertieren Python-EOL durch core.autocrlf und werden nicht veröffentlicht. Originale Git-Blobs für jedes Paket prüfen.

Betreiber übernimmt reale Abnahme selbst („die Abnahme mache ich“). VM101/WR und FINAL-/Aura-Referenzen unverändert. Fremde und frühere Arbeitsordner bleiben erhalten.

Gezielt bestanden: echte Standardpositions-Hit-Tests für Niederschlag, Wind und Temperatur in Desktop/Hoch-/Querformat, einschließlich unverdeckter Messwerte. Die Windfiederbeispiele bleiben vollständig im Info-Popup; der sichtbare Körper ist jetzt durchgehend eine kompakte Skala. Kontrollpositionsänderungen lösen begrenzte, gemeinsam getaktete Neupositionierung aus; Observer werden beim Teardown gelöst. Nächster Schritt: auf alle sechs Arten erweiterte Platzierungsprobe, finale öffentliche Ketten.

Auf e6f93652 bestanden die bestehende Aura-/Legendenmatrix und die fachlichen statischen Gates. Der neue Transparenztest traf im schnellen Linux-Lauf noch die 200-ms-Einblendanimation (momentanes Alpha 0,685 statt der danach erwarteten 1). Er wartet nun auf deren tatsächliches Ende und prüft weiterhin volle Deckkraft bei 0/65/100; keine Toleranzen oder Produktfunktionen geändert. Finaler Testquellcommit und vollständige Ketten noch abzuschließen.
