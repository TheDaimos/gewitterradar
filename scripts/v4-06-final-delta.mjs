// Final V4.06 changes layered after the frozen V4.05 and previously approved deltas.
// Every mutation uses a unique anchor so source drift fails the deterministic build.
export function v406FinalDelta(source) {
  const once = (from, to) => {
    if (source.split(from).length !== 2) throw Error('V4.06 final anchor changed: ' + from.slice(0, 96));
    source = source.replace(from, to);
  };

  once("  const CARD_VERSION = '4.05';\n  const GEWITTERRADAR_BUILD = 'V4.05-2026-09-07';",
    "  const CARD_VERSION = '4.06';\n  const GEWITTERRADAR_BUILD = 'V4.06-2026-09-10';");

  once("'sensor.home_lightning_distance':'Liefert die Entfernung zum letzten Blitz.','sensor.home_lightning_azimuth':'Liefert die Richtung zum letzten Blitz.','sensor.home_lightning_counter':'Zählt erkannte Blitzereignisse.'",
    "'sensor.*_lightning_distance':'Liefert die Entfernung zum letzten Blitz.','sensor.*_lightning_azimuth':'Liefert die Richtung zum letzten Blitz.','sensor.*_lightning_counter':'Zählt erkannte Blitzereignisse.'");
  once("'sensor.home_lightning_distance':'Provides distance to the latest strike.','sensor.home_lightning_azimuth':'Provides direction to the latest strike.','sensor.home_lightning_counter':'Counts detected lightning events.'",
    "'sensor.*_lightning_distance':'Provides distance to the latest strike.','sensor.*_lightning_azimuth':'Provides direction to the latest strike.','sensor.*_lightning_counter':'Counts detected lightning events.'");

  once(`  const ABOUT_RECORDER_YAML = \`recorder:
  exclude:
    entity_globs:
      - "geo_location.lightning_strike*"
    entities:
      - sensor.home_lightning_distance
      - sensor.home_lightning_azimuth
      - sensor.home_lightning_counter\`;`, `  const ABOUT_RECORDER_YAML = \`recorder:
  exclude:
    entity_globs:
      - "geo_location.lightning_strike*"
      - "sensor.*_lightning_distance"
      - "sensor.*_lightning_azimuth"
      - "sensor.*_lightning_counter"\`;`);

  once('  const LANGUAGE_DEFINITIONS = [', nativeHelp + '  const LANGUAGE_DEFINITIONS = [');

  once('      this._closeLanguageOnboarding(false);\n      this._closeAbout(false, false);',
    '      this._closeLanguageOnboarding(false);\n      this._closeHelp(false);\n      this._closeAbout(false, false);');

  once('              <button class="settings-language-button" id="settings-about" type="button"><span aria-hidden="true">ⓘ</span> <span id="settings-about-label">Über Gewitterradar</span></button>',
    '              <div class="settings-premium-links"><button class="settings-language-button settings-premium-link" id="settings-about" type="button"><span class="settings-premium-icon" aria-hidden="true">ⓘ</span><span id="settings-about-label">Über Gewitterradar</span></button><button class="settings-language-button settings-premium-link" id="settings-help" type="button"><span class="settings-premium-icon" aria-hidden="true">?</span><span id="settings-help-label">Hilfe &amp; Hinweise</span></button></div>');

  once("      this.shadow.getElementById('settings-about')?.addEventListener('click', () => this._openAbout());",
    "      this.shadow.getElementById('settings-about')?.addEventListener('click', () => this._openAbout());\n      this.shadow.getElementById('settings-help')?.addEventListener('click', () => this._openHelp());");

  once("      const openSettings = () => {\n        settingsBackdrop?.classList.add('open');",
    "      const openSettings = () => {\n        this._syncHelpMenu();\n        settingsBackdrop?.classList.add('open');");

  once("      const aboutLabel = this.shadow.getElementById('settings-about-label');\n      if (aboutLabel) aboutLabel.textContent = this._t('about.title');",
    "      const aboutLabel = this.shadow.getElementById('settings-about-label');\n      if (aboutLabel) aboutLabel.textContent = this._t('about.title');\n      if (this.shadow.getElementById('settings-backdrop')?.classList.contains('open')) this._syncHelpMenu();");

  once('    _openAbout() {', helpMethods + '    _openAbout() {');

  once(`    async _copyAboutRecorder() {
      const dialog = this._aboutDialog;
      if (!dialog?.open) return;
      const button = dialog.querySelector('.about-copy');
      let copied = false;
      try {
        await navigator.clipboard.writeText(ABOUT_RECORDER_YAML);
        copied = true;
      } catch (_) {
        // Local HTTP / embedded browsers: keep the fallback inside the modal's
        // focus boundary, remove it immediately and never enable diagnostic tools.
        if (this._aboutDialog !== dialog || !dialog.open) return;
        const area = document.createElement('textarea');
        area.value = ABOUT_RECORDER_YAML;
        area.readOnly = true;
        area.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;opacity:0;';
        dialog.append(area);
        try { area.select(); copied = document.execCommand('copy'); } catch (_) {}
        finally { area.remove(); button.focus({preventScroll:true}); }
      }
      if (this._aboutDialog === dialog && dialog.open) {
        dialog.querySelector('.about-copy-status').textContent = this._t(copied ? 'about.copied' : 'about.copyFailed');
      }
    }`, `    async _copyRecorderYaml(dialog, buttonSelector, statusSelector, strings) {
      if (!dialog?.open) return;
      const button = dialog.querySelector(buttonSelector);
      let copied = false;
      try {
        await navigator.clipboard.writeText(ABOUT_RECORDER_YAML);
        copied = true;
      } catch (_) {
        if (!dialog.open) return;
        const area = document.createElement('textarea');
        area.value = ABOUT_RECORDER_YAML;
        area.readOnly = true;
        area.style.cssText = 'position:fixed;left:0;top:0;width:1px;height:1px;opacity:0;';
        dialog.append(area);
        try { area.select(); copied = document.execCommand('copy'); } catch (_) {}
        finally { area.remove(); button?.focus({preventScroll:true}); }
      }
      if (dialog.open) dialog.querySelector(statusSelector).textContent = strings[copied ? 'copied' : 'copyFailed'];
    }

    _copyAboutRecorder() {
      const locale = resolveAboutLocale(this._languageValue());
      return this._copyRecorderYaml(this._aboutDialog,'.about-copy','.about-copy-status',locale.strings);
    }

    _copyHelpRecorder() {
      const locale = resolveAboutLocale(this._languageValue());
      return this._copyRecorderYaml(this._helpDialog,'.help-copy','.help-copy-status',locale.help);
    }`);

  once('        </style>\n\n        <ha-card id="card-root">', settingsPremiumCss + '        </style>\n\n        <ha-card id="card-root">');
  once('      </style>\n      <dialog class="about-dialog"', aboutFinalCss + '      </style>\n      <dialog class="about-dialog"');
  once('V4.05 · Visual V2<br>Gewitterradar · Home Assistant', 'V4.06 · Visual V2<br>Gewitterradar · Home Assistant');

  return source;
}

const nativeHelp = String.raw`  const HELP_STRINGS = {
    Deutsch: {
      menuTitle:'Hilfe & Hinweise', title:'Hilfe & Hinweise', subtitle:'Kurz erklärt, damit Gewitterradar zuverlässig und nachvollziehbar arbeitet.', close:'Hilfe schließen', copy:'YAML kopieren', copied:'Kopiert', copyFailed:'Kopieren nicht möglich – bitte den Code markieren.',
      sections:[
        {key:'prerequisites',title:'Voraussetzungen',paragraphs:['Gewitterradar verarbeitet die Blitzdaten, die Home Assistant von der verwendeten Blitzortung-Datenquelle erhält. Prüfe dort den richtigen Referenzstandort und stelle den Quellradius mindestens so groß wie den Beobachtungsradius in Gewitterradar ein. Gewitterradar kann keine Blitze anzeigen oder auswerten, die von der Datenquelle bereits herausgefiltert wurden.'],notes:['Wenn mehrere Blitzortung-Geräte oder Beobachtungspunkte vorhanden sind, müssen die verwendeten Entitäten eindeutig zum gewünschten Referenzpunkt passen.']},
        {key:'radii',title:'Die Radien',paragraphs:['Die Radien bauen aufeinander auf: Ein Blitz im Gefahrenradius zählt gleichzeitig zum Gewitter- und Beobachtungsradius. Die Bereiche sind Entfernungsschwellen, keine voneinander getrennten Datenquellen.'],items:['Beobachtungsradius – äußerer Bereich für frühe Beobachtung.','Gewitterradius – näherer Bereich mit erhöhter Aufmerksamkeit.','Gefahrenradius – unmittelbarer Nahbereich mit besonders hoher Relevanz.'],notes:['Der Gefahrenradius ist auf maximal 250 km begrenzt.']},
        {key:'location',title:'Referenzstandort',paragraphs:['Der Referenzstandort bestimmt, von welchem Punkt aus Entfernungen und Richtungen berechnet werden. Gewitterradar erkennt person.*- und zone.*-Entitäten dynamisch. Ändert sich der Standort einer Person, werden Entfernungen auf Basis der aktuellen Home-Assistant-Daten neu bewertet.'],notes:['Ein falscher Referenzstandort führt zu falschen Entfernungen, Radien und Kompassrichtungen.']},
        {key:'functions',title:'Wichtige Funktionen',entries:[['Aura-Effekte','visualisieren Blitzaktivität, verändern aber nicht die Erkennung oder Zählung.'],['Warnanimation','hebt relevante Gewitteraktivität optisch hervor.'],['Kartengruppierung','fasst nahe Blitzmarker zusammen und hält die Karte übersichtlicher.'],['Kompass: nächster Blitz','richtet die Anzeige auf den nächstgelegenen erkannten Blitz.'],['Geräteorientierung','kann auf unterstützten Mobilgeräten die Geräteausrichtung einbeziehen.'],['Gewittersimulation','ist ausschließlich für Test und Diagnose gedacht und sollte im normalen Betrieb ausgeschaltet bleiben.']]},
        {key:'defaults',title:'Empfohlene Grundeinstellungen',paragraphs:['Für einen stabilen Start empfehlen wir:'],items:['Quellradius der Blitzortung-Datenquelle mindestens so groß wie den Gewitterradar-Beobachtungsradius einstellen.','Kartengruppierung eingeschaltet lassen.','Warnanimation eingeschaltet lassen.','Aura-Effekte nach persönlichem Geschmack einstellen; sie beeinflussen die Erkennung nicht.','Gewittersimulation im normalen Betrieb ausgeschaltet lassen.','Geräteorientierung nur aktivieren, wenn sie auf dem verwendeten Mobilgerät benötigt wird.']},
        {key:'troubleshooting',title:'Wenn etwas nicht stimmt',entries:[['Keine oder zu wenige Blitze','Status der Blitzortung-Datenquelle, Quellradius und verwendete Blitz-Entitäten prüfen.'],['Entfernungen oder Richtungen wirken falsch','Referenzstandort und Distanzeinheit prüfen.'],['Sprachauswahl erscheint immer wieder','Prüfen, ob das aktuelle Gewitterradar-Package installiert ist und der Initialisierungshelfer vorhanden ist.'],['Darstellung nach Update unverändert','Browser-/App-Cache vollständig neu laden und sicherstellen, dass die aktuelle JavaScript-Datei verwendet wird.'],['Merkwürdiges Verhalten oder doppelte Karte','In Home Assistant darf nur EINE Gewitterradar-Modulressource aktiv sein. Native Integration und Dashboard-/HACS-Ressource dürfen nicht gleichzeitig dieselbe Custom Card registrieren.']]},
        {key:'recorder',title:'Home-Assistant-Recorder',paragraphs:['Blitzdaten können sehr viele Zustandsänderungen erzeugen. Für einen langfristig schlanken Recorder empfehlen wir, die folgenden Entitäten bzw. Entitätsmuster auszuschließen.'],recorder:true,notes:['Falls bereits ein recorder:-Abschnitt existiert, diese Einträge dort ergänzen. Keinen zweiten Top-Level-recorder:-Block anlegen.','Die Ausschlüsse deaktivieren NICHT die Live-Zustände für Gewitterradar.','Bereits vorhandene historische Daten werden dadurch nicht automatisch gelöscht.','Die Wildcards unterstützen mehrere Blitzortung-Geräte bzw. Beobachtungspunkte unabhängig vom Entity-Präfix.']}
      ]
    },
    English: {
      menuTitle:'Help & Notes', title:'Help & Notes', subtitle:'A concise guide to keep Gewitterradar reliable and easy to understand.', close:'Close help', copy:'Copy YAML', copied:'Copied', copyFailed:'Copy unavailable — please select the code.',
      sections:[
        {key:'prerequisites',title:'Prerequisites',paragraphs:['Gewitterradar processes the lightning data that Home Assistant receives from the configured lightning-detection source. Verify the correct reference location there and set the source radius at least as large as the observation radius in Gewitterradar. Gewitterradar cannot display or evaluate strikes that have already been filtered out by the source.'],notes:['If several lightning-detection devices or observation points are available, make sure the entities used belong to the intended reference point.']},
        {key:'radii',title:'The radii',paragraphs:['The radii are cumulative: a strike inside the danger radius also counts inside the storm radius and the observation radius. The areas are distance thresholds, not separate data sources.'],items:['Observation radius – outer area for early observation.','Storm radius – closer area requiring increased attention.','Danger radius – immediate vicinity with particularly high relevance.'],notes:['The danger radius is limited to a maximum of 250 km.']},
        {key:'location',title:'Reference location',paragraphs:["The reference location determines the point from which distances and directions are calculated. Gewitterradar detects person.* and zone.* entities dynamically. When a person's location changes, distances are recalculated from the current Home Assistant data."],notes:['An incorrect reference location leads to incorrect distances, radius evaluation and compass directions.']},
        {key:'functions',title:'Key functions',entries:[['Aura effects','visualize lightning activity but do not change detection or counting.'],['Warning animation','visually highlights relevant thunderstorm activity.'],['Map grouping','combines nearby strike markers to keep the map clear.'],['Compass: nearest strike','points the display toward the nearest detected strike.'],['Device orientation','can use device orientation on supported mobile devices.'],['Storm simulation','is intended only for testing and diagnostics and should remain disabled during normal operation.']]},
        {key:'defaults',title:'Recommended defaults',paragraphs:['For a stable starting point we recommend:'],items:['Set the lightning source radius at least as large as the Gewitterradar observation radius.','Keep map grouping enabled.','Keep warning animation enabled.','Adjust aura effects to personal preference; they do not affect detection.','Keep storm simulation disabled during normal operation.','Enable device orientation only when it is needed on the mobile device being used.']},
        {key:'troubleshooting',title:'If something is not working',entries:[['No or too few strikes','Check the lightning-detection source status, source radius and the lightning entities being used.'],['Distances or directions look wrong','Check the reference location and distance unit.'],['Language selection keeps returning','Verify that the current Gewitterradar package is installed and that the language initialization helper exists.'],['Display unchanged after an update','Fully reload the browser/app cache and make sure the current JavaScript file is being used.'],['Unexpected behavior or duplicate card','Only ONE Gewitterradar module resource may be active in Home Assistant. The native integration and the Dashboard/HACS resource must not register the same custom card at the same time.']]},
        {key:'recorder',title:'Home Assistant Recorder',paragraphs:['Lightning data can generate a very high number of state changes. For a lean long-term Recorder configuration, we recommend excluding the following entities and entity patterns.'],recorder:true,notes:['If a recorder: section already exists, merge these entries into it. Do not create a second top-level recorder: block.','These exclusions do NOT disable live states used by Gewitterradar.','Existing historical data is not removed automatically.','The wildcard patterns support multiple lightning-detection devices or observation points regardless of their entity prefix.']}
      ]
    }
  };

`;

const helpMethods = String.raw`    _syncHelpMenu(loadExternal = true) {
      if (!this.shadow) return;
      const language = this._languageValue(), locale = resolveAboutLocale(language);
      const label = this.shadow.getElementById('settings-help-label');
      if (label) label.textContent = locale.help.menuTitle;
      if (loadExternal) requestAboutLocale(language, () => {
        if (this._languageValue() !== language) return;
        this._syncHelpMenu(false);
        if (this._helpDialog?.open) this._syncHelp();
      });
    }

    _openHelp() {
      if (this._helpDialog?.open || !this.isConnected || !this.shadow) return;
      const shell = document.createElement('div');
      shell.id = 'help-shell';
      shell.innerHTML = '<style>' +
        '.help-dialog{--help-gold:#dfbc72;--help-bright:#f7dfa1;box-sizing:border-box;width:min(760px,calc(100vw - 16px));max-width:calc(100vw - 16px);height:min(900px,calc(100dvh - 16px));max-height:calc(100dvh - 16px);padding:0;border:1px solid #c9a050;border-radius:13px;color:#d5dae0;background:radial-gradient(ellipse at 15% 0,#31445145,transparent 48%),#091219;box-shadow:0 24px 90px #000c,inset 0 0 0 3px #cda9500c;font:14px/1.48 Segoe UI,Arial,sans-serif;overflow:hidden;color-scheme:dark}' +
        '.help-dialog[open]{display:flex;flex-direction:column}.help-dialog::backdrop{background:#03070be0}.help-dialog *{box-sizing:border-box}.help-head{position:relative;display:grid;grid-template-columns:48px minmax(0,1fr) 44px;align-items:center;gap:14px;padding:16px 12px 14px 18px;border-bottom:1px solid #a9874755;background:linear-gradient(180deg,#162630,#0b151c)}' +
        '.help-emblem{display:grid;place-items:center;width:44px;height:44px;border:1px solid #bc974f88;border-radius:50%;color:#f4d58e;background:radial-gradient(circle at 35% 28%,#f8e3a847,#8d652a42 45%,#09131a 72%);box-shadow:inset 0 1px #fff4,0 0 12px #d69a2130;font:700 23px/1 Georgia,serif}.help-head h2{margin:0;color:#f6e9cc;font-size:25px;line-height:1.15}.help-head p{margin:4px 0 0;color:#bfc7cf;font-size:13px}.help-close{width:44px;height:44px;border:0;background:transparent;color:#efd391;font-size:27px;border-radius:7px}.help-close:focus-visible,.help-copy:focus-visible,.help-dialog summary:focus-visible{outline:2px solid #ffe1a1;outline-offset:-2px}' +
        '.help-content{min-height:0;overflow:auto;padding:10px;overscroll-behavior:contain;touch-action:pan-y;scrollbar-width:thin;scrollbar-color:#9a7f4755 transparent}.help-section{margin:0 0 8px;border:1px solid #8d713d70;border-radius:9px;background:linear-gradient(110deg,#a4843818,#0b171e70 30%,#15202645);box-shadow:inset 0 1px #ffe6ad0b;overflow:hidden}.help-section[open]{border-color:#c69d4f9c;box-shadow:inset 0 1px #fff2,0 0 11px #d69a2116}.help-dialog summary{display:grid;grid-template-columns:34px minmax(0,1fr) 20px;align-items:center;gap:11px;min-height:52px;padding:8px 13px;list-style:none;cursor:pointer;color:var(--help-bright);font-weight:700}.help-dialog summary::-webkit-details-marker{display:none}.help-section-icon{display:grid;place-items:center;width:31px;height:31px;border:1px solid #b68e486e;border-radius:50%;color:#e9c87e;background:linear-gradient(145deg,#8d672936,#071017);box-shadow:inset 0 1px #fff2;font-size:17px}.help-chevron{width:14px;height:14px;border-right:2px solid #dfbd72;border-bottom:2px solid #dfbd72;transform:rotate(45deg);transition:transform .16s ease,filter .16s ease;margin:-6px 3px 0 0;filter:drop-shadow(0 0 2px #d5a74955)}.help-section[open] .help-chevron{transform:rotate(225deg);margin-top:6px;filter:brightness(1.2) drop-shadow(0 0 3px #edc66d75)}' +
        '.help-section-body{padding:0 15px 15px 58px;border-top:1px solid #a9874728}.help-section-body p{margin:12px 0 0}.help-section-body ul{margin:10px 0 0;padding-left:19px}.help-section-body li{margin:6px 0}.help-note{padding:9px 11px;border-left:2px solid #c69d50;background:#050d127a;color:#d9caa9}.help-entries{margin:8px 0 0}.help-entries dt{margin-top:9px;color:#efd18c;font-weight:700}.help-entries dd{margin:2px 0 0;color:#cbd1d7}.help-code-wrap{position:relative;margin-top:12px;border:1px solid #8b723e55;border-radius:7px;background:#061017;overflow:hidden}.help-code-wrap pre{margin:0;padding:12px 62px 12px 13px;white-space:pre-wrap;overflow-wrap:anywhere;color:#cbd5df;font:12px/1.45 Consolas,"Liberation Mono",monospace}.help-copy{position:absolute;right:5px;top:4px;width:44px;height:44px;border:0;background:transparent;color:#efd391;font-size:22px}.help-copy-status{position:absolute;right:9px;bottom:3px;color:#f7dfa1;font-size:10px;background:#061017e8}' +
        '@media(hover:hover) and (pointer:fine){.help-dialog summary:hover{background:#e1b85f0b}.help-close:hover,.help-copy:hover{color:#ffe4a3;filter:drop-shadow(0 0 3px #e0ad4c88)}}@media(max-width:520px){.help-dialog{font-size:13px}.help-head{grid-template-columns:42px minmax(0,1fr) 44px;gap:9px;padding-left:12px}.help-emblem{width:38px;height:38px}.help-head h2{font-size:21px}.help-head p{font-size:12px}.help-content{padding:7px}.help-section-body{padding:0 12px 13px}.help-dialog summary{grid-template-columns:31px minmax(0,1fr) 18px;padding:7px 10px}.help-code-wrap pre{font-size:10.5px;padding-left:9px}}' +
        '</style><dialog class="help-dialog" role="dialog" aria-modal="true" aria-labelledby="help-title"><header class="help-head"><span class="help-emblem" aria-hidden="true">?</span><div><h2 id="help-title"></h2><p class="help-subtitle"></p></div><button class="help-close" type="button" aria-label="Close">×</button></header><div class="help-content"></div></dialog>';
      this._helpReturnFocus = this.shadow.activeElement;
      this.shadow.append(shell);
      const dialog = shell.querySelector('dialog');
      this._helpDialog = dialog;
      dialog.querySelector('.help-close').addEventListener('click',() => this._closeHelp());
      dialog.addEventListener('cancel',event => { event.preventDefault();event.stopPropagation();this._closeHelp(); });
      dialog.addEventListener('keydown',event => {
        if (event.key === 'Escape') { event.preventDefault();event.stopPropagation();this._closeHelp();return; }
        if (event.key !== 'Tab') return;
        const stops=[...dialog.querySelectorAll('button,summary')].filter(node=>node.getClientRects().length),first=stops[0],last=stops[stops.length-1],active=this.shadow.activeElement;
        if(event.shiftKey&&active===first){event.preventDefault();last.focus();}else if(!event.shiftKey&&active===last){event.preventDefault();first.focus();}
        event.stopPropagation();
      });
      this._syncHelp();
      dialog.showModal();
      dialog.querySelector('.help-close').focus({preventScroll:true});
    }

    _syncHelp() {
      const dialog=this._helpDialog;
      if(!dialog)return;
      const language=this._languageValue(),locale=resolveAboutLocale(language),help=locale.help;
      dialog.querySelector('h2').textContent=help.title;
      dialog.querySelector('.help-subtitle').textContent=help.subtitle;
      dialog.querySelector('.help-close').setAttribute('aria-label',help.close);
      if(this._helpLocale!==help){
        const content=dialog.querySelector('.help-content'),openKeys=new Set([...content.querySelectorAll('details[open]')].map(node=>node.dataset.helpSection)),scrollTop=content.scrollTop;
        content.textContent='';
        const icons={prerequisites:'⌂',radii:'◎',location:'⌖',functions:'⚙',defaults:'✓',troubleshooting:'!',recorder:'▤'};
        help.sections.forEach((section,index)=>{
          const details=document.createElement('details');details.className='help-section';details.dataset.helpSection=section.key;details.open=openKeys.has(section.key)||(!this._helpLocale&&index===0);
          const summary=document.createElement('summary'),icon=document.createElement('span'),title=document.createElement('span'),chevron=document.createElement('span');
          icon.className='help-section-icon';icon.setAttribute('aria-hidden','true');icon.textContent=icons[section.key]||'•';title.textContent=section.title;chevron.className='help-chevron';chevron.setAttribute('aria-hidden','true');summary.append(icon,title,chevron);details.append(summary);
          const body=document.createElement('div');body.className='help-section-body';
          for(const text of section.paragraphs||[]){const p=document.createElement('p');p.textContent=text;body.append(p);}
          if(section.items?.length){const ul=document.createElement('ul');for(const text of section.items){const li=document.createElement('li');li.textContent=text;ul.append(li);}body.append(ul);}
          if(section.entries?.length){const dl=document.createElement('dl');dl.className='help-entries';for(const [term,text] of section.entries){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=term+':';dd.textContent=text;dl.append(dt,dd);}body.append(dl);}
          if(section.recorder){const wrap=document.createElement('div');wrap.className='help-code-wrap';const pre=document.createElement('pre'),code=document.createElement('code'),button=document.createElement('button'),status=document.createElement('span');code.textContent=ABOUT_RECORDER_YAML;pre.append(code);button.className='help-copy';button.type='button';button.setAttribute('aria-label',help.copy);button.textContent='⧉';status.className='help-copy-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');wrap.append(pre,button,status);body.append(wrap);button.addEventListener('click',()=>this._copyHelpRecorder());}
          for(const text of section.notes||[]){const p=document.createElement('p');p.className='help-note';p.textContent=text;body.append(p);}
          details.append(body);content.append(details);
        });
        content.scrollTop=scrollTop;this._helpLocale=help;
      }
      requestAboutLocale(language,()=>{if(this._helpDialog===dialog&&this._languageValue()===language)this._syncHelp();});
    }

    _closeHelp(restoreFocus = true) {
      if(!this._helpDialog)return;
      this._helpDialog.close();this._helpDialog.parentElement.remove();this._helpDialog=null;this._helpLocale=null;
      const focus=this._helpReturnFocus||this.shadow?.getElementById('settings-help');this._helpReturnFocus=null;
      if(restoreFocus&&focus?.isConnected)focus.focus({preventScroll:true});
    }

`;

const settingsPremiumCss = String.raw`          /* V4.06 final premium settings shell and hierarchy. */
          .settings-dialog{--premium-gold:#c7a25b;--premium-gold-bright:#f1d58c;--premium-line:rgba(201,160,80,.34);border-color:var(--premium-line);background:radial-gradient(circle at 15% 0%,rgba(230,184,85,.09),transparent 34%),linear-gradient(180deg,rgba(20,28,38,.99),rgba(7,12,18,.995));box-shadow:0 30px 90px rgba(0,0,0,.72),inset 0 0 0 1px rgba(255,235,184,.055),inset 0 1px rgba(255,244,213,.08),0 0 30px rgba(207,159,60,.065)}
          .settings-premium-links{display:grid;grid-template-columns:1fr 1fr;gap:7px}.settings-premium-link{min-height:44px!important;border:1px solid rgba(190,149,69,.22)!important;border-radius:12px!important;background:linear-gradient(110deg,rgba(176,130,49,.08),rgba(12,22,29,.62))!important;box-shadow:inset 0 1px rgba(255,239,198,.055)}
          .settings-premium-icon{display:grid;place-items:center;flex:0 0 24px;width:24px;height:24px;transform:translateY(-1px);font:700 21px/1 "Segoe UI Symbol","Arial Unicode MS",sans-serif;color:#e2b95d;background:linear-gradient(135deg,#926521 6%,#f8e4a5 35%,#c18a2c 60%,#f1cf75 82%,#8d5d1a);-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;filter:drop-shadow(0 1px 0 rgba(49,29,5,.92)) drop-shadow(0 0 2px rgba(232,181,65,.28));transition:filter .16s ease}
          .settings-premium-link:focus-visible{outline:2px solid rgba(255,225,161,.92)!important;outline-offset:1px!important}.settings-premium-link:focus-visible .settings-premium-icon{filter:brightness(1.15) drop-shadow(0 0 3px rgba(244,197,91,.42))}
          .settings-section{border-color:rgba(190,151,76,.22);background:linear-gradient(115deg,rgba(169,126,47,.055),rgba(255,255,255,.018) 30%,rgba(7,13,19,.36));box-shadow:inset 0 1px rgba(255,239,194,.045),0 2px 8px rgba(0,0,0,.18);transition:border-color .16s ease,box-shadow .16s ease,background .16s ease}.settings-section[open]{border-color:rgba(224,180,87,.46);background:linear-gradient(115deg,rgba(177,132,47,.10),rgba(255,255,255,.022) 35%,rgba(7,13,19,.42));box-shadow:inset 0 1px rgba(255,243,207,.08),0 0 13px rgba(208,158,55,.08)}
          .settings-collapsible>.settings-section-head{align-items:center;min-height:44px}.settings-collapsible>.settings-section-head::after{content:'';width:13px;height:13px;border-right:2px solid #d6b66e;border-bottom:2px solid #d6b66e;font-size:0;transform:rotate(45deg);margin:-6px 10px 0 0;filter:drop-shadow(0 0 2px rgba(226,180,74,.32));transition:transform .16s ease,filter .16s ease}.settings-collapsible[open]>.settings-section-head::after{transform:rotate(225deg);margin-top:7px;color:inherit;filter:brightness(1.18) drop-shadow(0 0 3px rgba(240,193,82,.48))}
          #settings-diagnostic-section>.settings-section-content>.settings-row-label{border-left:1px solid rgba(196,153,70,.24);background:linear-gradient(90deg,rgba(190,143,52,.045),transparent 72%)}
          .settings-signature-wrap{background:radial-gradient(ellipse at 82% 52%,rgba(201,151,51,.075),transparent 56%)}.settings-signature{filter:sepia(.16) saturate(1.28) brightness(1.08) contrast(1.035) drop-shadow(0 1px .5px rgba(255,226,158,.16)) drop-shadow(0 3px 5px rgba(0,0,0,.48))}
          @media(hover:hover) and (pointer:fine){.settings-premium-link:hover .settings-premium-icon{filter:brightness(1.14) saturate(1.08) drop-shadow(0 1px 0 rgba(49,29,5,.92)) drop-shadow(0 0 3px rgba(238,188,72,.38))}.settings-collapsible>.settings-section-head:hover::after{filter:brightness(1.2) drop-shadow(0 0 3px rgba(240,193,82,.48))}}
          .settings-premium-link:active .settings-premium-icon{filter:brightness(.9) saturate(1.08)}
          @media(max-width:420px){.settings-premium-links{grid-template-columns:1fr}}
`;

const aboutFinalCss = String.raw`        /* V4.06 localized-header and section-header alignment. */
        @media(min-width:621px){.about-head{display:grid;grid-template-columns:86px minmax(0,1fr) 170px;align-items:center;column-gap:24px}.about-head-copy{align-self:center;padding-top:0;min-width:0;max-width:none}.about-dialog h2{white-space:normal;text-wrap:balance}.about-claim{position:static;align-self:center;justify-self:end;width:140px;margin-right:32px}.about-head>img{align-self:center}@container(min-width:780px){.about-head{grid-template-columns:94px minmax(0,1fr) 185px}.about-claim{right:auto;margin-right:32px}}}
        .about-section-head{min-height:30px;align-items:center;gap:11px}.about-section-head .about-icon{width:30px;height:30px}.about-section-head h3{display:flex;align-items:center;min-height:30px}.about-welcome>.about-icon,.about-network>.about-icon{width:30px;height:30px;margin-top:0}.about-welcome h3,.about-network h3{display:flex;align-items:center;min-height:30px;margin-bottom:2px}.about-recorder .about-section-head{position:static;padding-left:0;height:auto;min-height:30px}.about-recorder .about-section-head .about-icon{position:static;left:auto;top:auto;height:30px}.about-dialog summary{gap:11px}.about-dialog summary:after{width:14px;height:14px;margin:-7px 13px 0 auto;border-width:2px;filter:drop-shadow(0 0 2px #d6aa4f55);transition:transform .16s ease,filter .16s ease}.about-dialog details[open] summary:after{margin-top:7px;filter:brightness(1.18) drop-shadow(0 0 3px #e6b95777)}
`;
