# GR 4.11.184 DEV · Stabilisierung des Settings Vault

## Beobachtung und Reproduktion

Auf einem Android-Gerät zeigte V183 nach dem Start wiederholt „Profil wird geladen …“ und sprang zurück zur Profilwahl. Bedienelemente verloren dabei ihre Position und die Karte blieb blockiert. Der neue Browsertest reproduzierte das Fehlerbild mit dem unveränderten V183-Frontend. Nach einer erfolgreichen, ungebundenen Profilabfrage genügten weitere `hass`-Zustände und gleichwertige `setConfig`-Aufrufe. Der Test schlug beim Identitätsvergleich des ersten Bedienelements fehl. Die reproduzierte Ursache liegt im Karten- und Vault-Lebenszyklus.

V183 setzte `_vaultStarting` nach jeder Anfrage zurück. Für ein Gerät ohne Zuordnung blieb `_vaultBooted` während der Profilwahl falsch. Jede nächste HA-Aktualisierung durfte deshalb erneut `init` aufrufen. `init` setzte den Status auf `loading` und `setupView` ersetzte über `form()` die vorhandenen Formularelemente. Deren Sperre für laufende Aktionen gehörte zur jeweils ersetzten DOM-Instanz. Eine HA-Aktualisierung konnte daher die noch laufende Benutzerauswahl von ihren Bedienelementen trennen. Derselbe Pfad war über Lovelace-Konfigurationsupdates und erneutes Verbinden der Karte erreichbar.

## Korrektur

- Der erste authentifizierte Kartenstart erstellt einen Client und eine Setup-Ansicht. Neue HA-Zustände aktualisieren den Transport des Clients. Sie lösen keine weitere Profilabfrage und keinen Neuaufbau der Auswahl aus.
- Der Client bündelt identische Startaufrufe in einer laufenden Anfrage. Eine abgeschlossene Auswahl bleibt bestehen. Ein Verbindungs- oder Speicherfehler führt zu einem bedienbaren Fehlerzustand mit manuellem Wiederholungsversuch. Eine veraltete Zuordnung führt einmalig zurück zur Profilübersicht. Der bestehende Transport-Timeout begrenzt eine einzelne Anfrage.
- Die Profilauswahl, Eingabefelder und Listener bleiben montiert. Der gewählte Schritt und der eingegebene Name bleiben während wiederholter HA-Aktualisierungen und einer fehlgeschlagenen Erstellung erhalten. Ein erneuter Versuch derselben Erstellung verwendet dieselbe Transaktions-ID, auch nach einem verlorenen Antwortpaket.
- Profilkennung, Antwortstruktur und bekannte Einstellungsbereiche werden vor Bindung und Hydration geprüft. Erst das bestätigte Profil erlaubt Karten- und Rendererstart. Eine kurzzeitige HA-Aktualisierung ohne Benutzerobjekt verwirft die bereits bestätigte Identität nicht. Ein bestätigter Kontowechsel sperrt die alte Karteninstanz und lädt das Frontend neu.
- Wenn der Profildienst vorübergehend ausfällt, kann der Benutzer die Karte bewusst mit den alten Browserwerten schreibgeschützt öffnen. Diese Ansicht sendet keine Vault-Schreibvorgänge, erstellt kein Profil und ändert keine Browser-Originale oder Zuordnungen. **Mit dem Profildienst verbinden** im Einstellungsmenü führt durch einen expliziten Neustart zurück zum regulären Start.
- Das Setup verwendet das bestehende GewitterRadar-Icon und die goldfarbene, dunkle Oberfläche des Einstellungsmenüs. Die Startansicht bietet zwei Hauptaktionen. Ein Name wird erst für Standardprofil, Kopie oder Übernahme von Browserwerten abgefragt. Ein vorhandenes Profil kann explizit zugeordnet oder als unabhängige Kopie angelegt werden.

Die Home-Assistant-Persistenz bleibt auf Vault-Schema 1. V183-Profile, Revisionen, Snapshots und lokale V181-Originale bleiben kompatibel. Die Renderer und der WeatherRouter-Vertrag sind an dieser Korrektur nicht beteiligt.

## Testabdeckung

| Fall | Prüfung |
|---|---|
| Android-Symptom und Profilwahl | Vollständige Karte mit wiederholten `hass`- und `setConfig`-Aufrufen sowie simulierten WS-Verbindungsereignissen. Identität der Setup-Elemente, Fokus, Eingabe und Zahl der Anfragen werden geprüft. |
| Verzögerte Antwort und Reattach | Die Browser-Fixture hält die erste Profilantwort zurück und hängt dieselbe Karte erneut ein. Es läuft weiterhin eine Profilabfrage. Renderer und Patch warten auf die Profilbindung. |
| Neuanlage und Fehler | Standardprofil mit frei eingegebenem Namen. Doppelklick während eines verlorenen Rücklaufs. Erneuter Versuch mit identischer Transaktions-ID und genau einem gespeicherten Profil. |
| Wiederverbindung und Recovery | Initialer WS-Ausfall, manueller Retry und lokale Ansicht. Kartenstart mit alten Werten, kein Vault-Patch und kein Überschreiben der Browserdaten. |
| Gespeicherte Profile | Automatisches Laden nach Reload, Wiederzuordnung nach simuliertem Verlust des Clientzustands, separater Zweit- und Drittsatz sowie getrenntes HA-Konto. |
| V181-Darstellung | Vergleich der wirksamen V181-Werte einschließlich Wind-Studio, Eye-Gruppierung, Ringabständen, Temperaturbeschriftung, Regen-Opacity und Layout. Die bestehenden V177-/V180-Pixelprüfungen laufen weiterhin. |

## Betreiberabnahme auf Android · OFFEN

Die Android-Fixture nutzt Chromium mit Touch und Android-Viewport. Das echte Android-Companion-Gerät und HA DEV VM109 stehen für die Betreiberprüfung aus. Schritte stehen in der [Android-Abnahmeanleitung](GR_SETTINGS_VAULT_MIGRATION_AND_RECOVERY.md#betreiberabnahme-auf-android).
