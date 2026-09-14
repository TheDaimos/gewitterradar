const replaceOnce = (source, from, to, label) => {
  if (source.split(from).length !== 2) throw new Error(`V4.07.12 help-network-highlight anchor changed (${label})`);
  return source.replace(from,to);
};

export function v407HelpNetworkHighlightsDelta(source, variant = 'A') {
  if (!['A','B'].includes(variant)) throw new Error(`V4.07.12 unknown variant: ${variant}`);
  let result = source;

  result = replaceOnce(
    result,
    `  const CARD_DISPLAY_VERSION = '4.07.11${variant}';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST11${variant}-2026-09-13';`,
    `  const CARD_DISPLAY_VERSION = '4.07.12${variant}';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST12${variant}-2026-09-14';`,
    'display/build marker'
  );

  result = replaceOnce(
    result,
    `.help-entries dd{margin:2px 0 0;color:#cbd1d7}.help-code-wrap`,
    `.help-entries dd{margin:2px 0 0;color:#cbd1d7}.help-network-highlight{color:#f2cf82;font-weight:700;text-shadow:0 0 6px rgba(218,166,67,.16)}.help-code-wrap`,
    'network highlight css'
  );

  result = replaceOnce(
    result,
    `        const premiumHelpIconImages=HELP_PREMIUM_ICONS.sections;\n        help.sections.forEach((section,index)=>{`,
    String.raw`        const premiumHelpIconImages=HELP_PREMIUM_ICONS.sections;
        const helpNetworkTokenPattern=/device_tracker\.gewitterradar(?:_dashboard)?|gewitterradar\.set_reference_coordinates|a\/b\/c\.tile\.openstreetmap\.org|(?:\*\.)?(?:[a-z0-9-]+\.)+[a-z]{2,24}(?::\d{1,5})?|\b(?:HTTPS|HTTP|MQTT)\/TCP\s+\d{1,5}\b|\b(?:TCP|UDP)[ -]?\d{1,5}\b|\b(?:Open-Meteo(?: Geocoding)?|OpenStreetMap(?: Nominatim|-Kacheln|-Kachelserver|-tiles| tiles)?|Nominatim|Leaflet(?: 1\.9\.4)?|Blitzortung(?: v\d+(?:\.\d+)*)?|GitHub\/HACS|GitHub|HACS|Local(?:-|\s)to-do(?:-Liste|-list)?|Dashboard-Setz-Script|Companion App|DNS|TLS-Inspection|CORS)\b/gi;
        const appendHelpNetworkText=(target,text)=>{
          const source=String(text??'');helpNetworkTokenPattern.lastIndex=0;let cursor=0,match;
          while((match=helpNetworkTokenPattern.exec(source))){
            if(match.index>cursor)target.append(document.createTextNode(source.slice(cursor,match.index)));
            const token=document.createElement('span');token.className='help-network-highlight';token.textContent=match[0];target.append(token);cursor=match.index+match[0].length;
            if(match[0].length===0)helpNetworkTokenPattern.lastIndex++;
          }
          if(cursor<source.length)target.append(document.createTextNode(source.slice(cursor)));
        };
        const setHelpDiagnosticText=(target,text)=>appendHelpNetworkText(target,text);
        help.sections.forEach((section,index)=>{`,
    'network highlight renderer'
  );

  result = replaceOnce(
    result,
    `          for(const text of section.paragraphs||[]){const p=document.createElement('p');p.textContent=text;body.append(p);}`,
    `          for(const text of section.paragraphs||[]){const p=document.createElement('p');setHelpDiagnosticText(p,text);body.append(p);}`,
    'paragraph highlighting'
  );

  result = replaceOnce(
    result,
    `          if(section.items?.length){const ul=document.createElement('ul');for(const text of section.items){const li=document.createElement('li');li.textContent=text;ul.append(li);}body.append(ul);}`,
    `          if(section.items?.length){const ul=document.createElement('ul');for(const text of section.items){const li=document.createElement('li');setHelpDiagnosticText(li,text);ul.append(li);}body.append(ul);}`,
    'list highlighting'
  );

  result = replaceOnce(
    result,
    `          if(section.entries?.length){const dl=document.createElement('dl');dl.className='help-entries';for(const [term,text] of section.entries){const dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=term+':';dd.textContent=text;dl.append(dt,dd);}body.append(dl);}`,
    `          if(section.entries?.length){const dl=document.createElement('dl');dl.className='help-entries';for(const [term,text] of section.entries){const dt=document.createElement('dt'),dd=document.createElement('dd');setHelpDiagnosticText(dt,term);dt.append(document.createTextNode(':'));setHelpDiagnosticText(dd,text);dl.append(dt,dd);}body.append(dl);}`,
    'entry highlighting'
  );

  result = replaceOnce(
    result,
    `          for(const text of section.notes||[]){const p=document.createElement('p');p.className='help-note';p.textContent=text;body.append(p);}`,
    `          for(const text of section.notes||[]){const p=document.createElement('p');p.className='help-note';setHelpDiagnosticText(p,text);body.append(p);}`,
    'note highlighting'
  );

  return result;
}
