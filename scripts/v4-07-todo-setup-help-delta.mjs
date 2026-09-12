const replaceOnce = (text, from, to) => {
  if (text.split(from).length !== 2) throw new Error(`V4.07 todo-setup-help anchor changed: ${from.slice(0, 140)}`);
  return text.replace(from, to);
};

export function v407TodoSetupHelpDelta(source) {
  let text = source;

  text = replaceOnce(text,
    "const GEWITTERRADAR_BUILD = 'V4.07-TEST4-2026-09-12';",
    "const GEWITTERRADAR_BUILD = 'V4.07-TEST5-2026-09-13';");

  text = replaceOnce(text,
    "savedSetup:'Zum Speichern einmalig eine lokale To-do-Liste „Gewitterradar Orte“ in Home Assistant anlegen.'",
    "savedSetup:'Zum Speichern fehlt die lokale Liste „Gewitterradar Orte“. Home Assistant: Einstellungen → Geräte & Dienste → Integration hinzufügen → „Local to-do“ suchen/auswählen → Liste exakt „Gewitterradar Orte“ nennen.'");

  text = replaceOnce(text,
    "savedSetup:'Create a local Home Assistant to-do list named “Gewitterradar Orte” once to enable saving.'",
    "savedSetup:'The local “Gewitterradar Orte” list is missing. Home Assistant: Settings → Devices & services → Add integration → search/select “Local to-do” → name the list exactly “Gewitterradar Orte”.'");

  text = replaceOnce(text,
    "Für „★ Speichern“ einmalig unter Einstellungen → Geräte & Dienste → Integration hinzufügen eine lokale To-do-Liste mit dem Namen „Gewitterradar Orte“ anlegen. Gespeicherte Treffer erscheinen danach im Standortmenü unter „Gespeicherte Orte“ und können von dort wieder direkt verwendet werden.",
    "Speicherliste einrichten: Einstellungen → Geräte & Dienste → Integration hinzufügen → nach „Local to-do“ suchen und diese Integration auswählen. Als Listenname exakt „Gewitterradar Orte“ vergeben und die Einrichtung abschließen. Danach kann „★ Speichern“ gefundene Orte dauerhaft lokal ablegen; sie erscheinen im Standortmenü unter „Gespeicherte Orte“ und können von dort ohne erneute Ortssuche direkt verwendet werden.");

  text = replaceOnce(text,
    "To enable ★ Save, create a Local to-do list named 'Gewitterradar Orte' once under Settings → Devices & services → Add integration. Saved results then appear under Saved places and can be used again directly.",
    "To set up saving: Settings → Devices & services → Add integration → search for and select 'Local to-do'. Name the list exactly 'Gewitterradar Orte' and finish setup. ★ Save can then store found places locally; they appear under Saved places and can be reused without another geocoding request.");

  return text;
}
