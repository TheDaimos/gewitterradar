const replaceOnce=(source,from,to,label)=>{if(source.split(from).length!==2)throw new Error(`V4.07.31 i18n anchor changed (${label})`);return source.replace(from,to);};
const clone=value=>JSON.parse(JSON.stringify(value));

const DIALECTS=['Boarisch','Plattdüütsch','Sächs’sch','Schwäbisch'];

const RULES={
  'Boarisch':[
    [/\bHilfe\b/g,'Hüf'],[/\bHinweise\b/g,'Hinwais'],[/\bschließen\b/g,'zumacha'],[/\bkopieren\b/gi,'kopiern'],[/\bKopiert\b/g,'Kopiert'],
    [/\bDie\b/g,'De'],[/\bdie\b/g,'de'],[/\bDer\b/g,'Da'],[/\bder\b/g,'da'],[/\bDas\b/g,'Des'],[/\bdas\b/g,'des'],
    [/\bEine\b/g,'A'],[/\beine\b/g,'a'],[/\bEinen\b/g,'An'],[/\beinen\b/g,'an'],[/\bEin\b/g,'A'],[/\bein\b/g,'a'],
    [/\bNicht\b/g,'Ned'],[/\bnicht\b/g,'ned'],[/\bIst\b/g,'Is'],[/\bist\b/g,'is'],[/\bSind\b/g,'San'],[/\bsind\b/g,'san'],
    [/\bWird\b/g,'Wird'],[/\bwird\b/g,'wird'],[/\bWerden\b/g,'Werdn'],[/\bwerden\b/g,'werdn'],[/\bMüssen\b/g,'Müassn'],[/\bmüssen\b/g,'müassn'],[/\bMuss\b/g,'Muaß'],[/\bmuss\b/g,'muaß'],
    [/\bKönnen\b/g,'Kenna'],[/\bkönnen\b/g,'kenna'],[/\bKann\b/g,'Ko'],[/\bkann\b/g,'ko'],[/\bvon\b/g,'vo'],[/\bVon\b/g,'Vo'],
    [/\bWenn\b/g,'Wenn'],[/\bwenn\b/g,'wenn'],[/\bkeine\b/g,'koane'],[/\bkeinen\b/g,'koan'],[/\bkein\b/g,'koa'],[/\bKeine\b/g,'Koane'],
    [/\bgespeichert\b/g,'gspeichert'],[/\bGespeichert\b/g,'Gspeichert'],[/\bSpeichern\b/g,'Speichern'],[/\bspeichern\b/g,'speichern'],
    [/\bOrte\b/g,'Ort'],[/\bOrtssuche\b/g,'Ortssuach'],[/\bSuche\b/g,'Suach'],[/\bsuchen\b/g,'suacha'],[/\bprüfen\b/g,'prüfn'],[/\bPrüfen\b/g,'Prüfn'],
    [/\bBlitze\b/g,'Blitz'],[/\bBlitzen\b/g,'Blitzn'],[/\bBeobachtungsbereich\b/g,'Beobachtungsbereich'],[/\bRichtungen\b/g,'Richtunga'],[/\bEntfernungen\b/g,'Entfernunga'],
    [/\bGeräte\b/g,'Gerät'],[/\bEinstellungen\b/g,'Einstellungen'],[/\baktuell\b/g,'grad'],[/\baktuelle\b/g,'gradige'],[/\bbereits\b/g,'scho'],[/\bschon\b/g,'scho'],
  ],
  'Plattdüütsch':[
    [/\bHilfe\b/g,'Hülp'],[/\bHinweise\b/g,'Henwiesen'],[/\bschließen\b/g,'tomaken'],[/\bkopieren\b/gi,'koperen'],
    [/\bDie\b/g,'De'],[/\bdie\b/g,'de'],[/\bDer\b/g,'De'],[/\bder\b/g,'de'],[/\bDas\b/g,'Dat'],[/\bdas\b/g,'dat'],
    [/\bEine\b/g,'En'],[/\beine\b/g,'en'],[/\bEinen\b/g,'En'],[/\beinen\b/g,'en'],[/\bEin\b/g,'En'],[/\bein\b/g,'en'],
    [/\bUnd\b/g,'Un'],[/\bund\b/g,'un'],[/\bNicht\b/g,'Nich'],[/\bnicht\b/g,'nich'],[/\bIst\b/g,'Is'],[/\bist\b/g,'is'],
    [/\bWird\b/g,'Warrt'],[/\bwird\b/g,'warrt'],[/\bWerden\b/g,'Warrn'],[/\bwerden\b/g,'warrn'],[/\bMüssen\b/g,'Mööten'],[/\bmüssen\b/g,'mööten'],[/\bMuss\b/g,'Mutt'],[/\bmuss\b/g,'mutt'],
    [/\bKönnen\b/g,'Köönen'],[/\bkönnen\b/g,'köönen'],[/\bFür\b/g,'För'],[/\bfür\b/g,'för'],[/\bVon\b/g,'Vun'],[/\bvon\b/g,'vun'],[/\bAus\b/g,'Ut'],[/\baus\b/g,'ut'],
    [/\bAuch\b/g,'Ok'],[/\bauch\b/g,'ok'],[/\bkeine\b/g,'keen'],[/\bkeinen\b/g,'keen'],[/\bkein\b/g,'keen'],[/\bKeine\b/g,'Keen'],
    [/\bgespeichert\b/g,'spiekert'],[/\bGespeichert\b/g,'Spiekert'],[/\bSpeichern\b/g,'Spiekern'],[/\bspeichern\b/g,'spiekern'],[/\bOrt\b/g,'Oort'],[/\bOrte\b/g,'Öörd'],[/\bSuche\b/g,'Söök'],[/\bsuchen\b/g,'söken'],
    [/\bKarte\b/g,'Koort'],[/\bStandort\b/g,'Steed'],[/\bStandorte\b/g,'Steden'],[/\bRichtungen\b/g,'Richtungen'],[/\bEntfernungen\b/g,'Afstänn'],[/\bprüfen\b/g,'pröven'],[/\bPrüfen\b/g,'Pröven'],
    [/\bbereits\b/g,'al'],[/\bschon\b/g,'al'],[/\bmehrere\b/g,'mehr'],[/\bimmer\b/g,'jümmers'],[/\bBlitze\b/g,'Blitzen'],[/\bBlitz\b/g,'Blitz'],
  ],
  'Sächs’sch':[
    [/\bHilfe\b/g,'Hilche'],[/\bHinweise\b/g,'Hinweese'],[/\bschließen\b/g,'zumachn'],[/\bkopieren\b/gi,'kopiern'],
    [/\bDie\b/g,'De'],[/\bdie\b/g,'de'],[/\bDer\b/g,'Dr'],[/\bder\b/g,'dr'],[/\bDas\b/g,'S'],[/\bdas\b/g,'s'],
    [/\bEine\b/g,'Eene'],[/\beine\b/g,'eene'],[/\bEinen\b/g,'Een'],[/\beinen\b/g,'een'],[/\bEin\b/g,'Een'],[/\bein\b/g,'een'],
    [/\bUnd\b/g,'Un'],[/\bund\b/g,'un'],[/\bNicht\b/g,'Nich'],[/\bnicht\b/g,'nich'],[/\bIst\b/g,'Is'],[/\bist\b/g,'is'],[/\bSind\b/g,'Sin'],[/\bsind\b/g,'sin'],
    [/\bWerden\b/g,'Werdn'],[/\bwerden\b/g,'werdn'],[/\bMüssen\b/g,'Müssn'],[/\bmüssen\b/g,'müssn'],[/\bKönnen\b/g,'Könn'],[/\bkönnen\b/g,'könn'],
    [/\bkeine\b/g,'keene'],[/\bkeinen\b/g,'keen'],[/\bkein\b/g,'keen'],[/\bKeine\b/g,'Keene'],[/\bOrt\b/g,'Ord'],[/\bOrte\b/g,'Orde'],[/\bOrtssuche\b/g,'Ordssuche'],[/\bStandort\b/g,'Standord'],
    [/\bgespeichert\b/g,'gespeicherd'],[/\bGespeichert\b/g,'Gespeicherd'],[/\bprüfen\b/g,'prüfn'],[/\bPrüfen\b/g,'Prüfn'],[/\bRichtungen\b/g,'Richtungen'],[/\bEntfernungen\b/g,'Entfernungn'],
    [/\bWichtig\b/g,'Wischdsch'],[/\bwichtig\b/g,'wischdsch'],[/\baktuell\b/g,'grade'],[/\baktuelle\b/g,'grade'],[/\bbereits\b/g,'schon'],[/\bBlitze\b/g,'Blitze'],
  ],
  'Schwäbisch':[
    [/\bHilfe\b/g,'Hilf'],[/\bHinweise\b/g,'Hinweis'],[/\bschließen\b/g,'zumacha'],[/\bkopieren\b/gi,'kopiera'],
    [/\bDie\b/g,'D'],[/\bdie\b/g,'d'],[/\bDer\b/g,'Dr'],[/\bder\b/g,'dr'],[/\bDas\b/g,'S'],[/\bdas\b/g,'s'],
    [/\bEine\b/g,'A'],[/\beine\b/g,'a'],[/\bEinen\b/g,'An'],[/\beinen\b/g,'an'],[/\bEin\b/g,'A'],[/\bein\b/g,'a'],
    [/\bUnd\b/g,'Ond'],[/\bund\b/g,'ond'],[/\bNicht\b/g,'Net'],[/\bnicht\b/g,'net'],[/\bIst\b/g,'Isch'],[/\bist\b/g,'isch'],[/\bSind\b/g,'Send'],[/\bsind\b/g,'send'],
    [/\bWerden\b/g,'Werdet'],[/\bwerden\b/g,'werdet'],[/\bMüssen\b/g,'Müsset'],[/\bmüssen\b/g,'müsset'],[/\bKönnen\b/g,'Könnet'],[/\bkönnen\b/g,'könnet'],
    [/\bkeine\b/g,'koi'],[/\bkeinen\b/g,'koin'],[/\bkein\b/g,'koi'],[/\bKeine\b/g,'Koi'],[/\bgespeichert\b/g,'gspeichert'],[/\bGespeichert\b/g,'Gspeichert'],[/\bSpeichern\b/g,'Speichra'],[/\bspeichern\b/g,'speichra'],
    [/\bSuche\b/g,'Suach'],[/\bsuchen\b/g,'suacha'],[/\bprüfen\b/g,'prüfa'],[/\bPrüfen\b/g,'Prüfa'],[/\bRichtungen\b/g,'Richtunga'],[/\bEntfernungen\b/g,'Entfernunga'],
    [/\baktuell\b/g,'grad'],[/\baktuelle\b/g,'gradige'],[/\bbereits\b/g,'scho'],[/\bschon\b/g,'scho'],[/\bBlitze\b/g,'Blitz'],
  ],
};

const META={
  'Boarisch':{menu:'Hüf & Hinwais',subtitle:'Kurz erklärt, damit s Gewitterradar zuverlässig und nachvollziehbar lafft.',close:'Hüf zumacha',copy:'YAML kopiern',copied:'Kopiert',copyFailed:'Kopiern geht ned – bittschön den Code markiern.'},
  'Plattdüütsch':{menu:'Hülp & Henwiesen',subtitle:'Kort verklort, dormit Gewitterradar seker un good to verstahn arbeidt.',close:'Hülp tomaken',copy:'YAML koperen',copied:'Kopeert',copyFailed:'Koperen geiht nich – markeer den Code.'},
  'Sächs’sch':{menu:'Hilche & Hinweese',subtitle:'Gorz erklärt, damidd Gewitterradar zuverlässig un nachvollziehbar looft.',close:'Hilche zumachn',copy:'YAML kopiern',copied:'Kopierd',copyFailed:'Kopiern gehd nich – bidde den Code markiern.'},
  'Schwäbisch':{menu:'Hilf & Hinweis',subtitle:'Kurz erklärt, dass s Gewitterradar zuverlässig ond nachvollziehbar lauft.',close:'Hilf zumacha',copy:'YAML kopiera',copied:'Kopiert',copyFailed:'Kopiera goht net – bitte dr Code markiera.'},
};

const transform=(name,value)=>{
  if(Array.isArray(value))return value.map(item=>transform(name,item));
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,transform(name,item)]));
  if(typeof value!=='string')return value;
  let out=value;
  for(const [pattern,replacement] of RULES[name])out=out.replace(pattern,replacement);
  return out;
};

const flattenStrings=(value,path='',out=[])=>{
  if(typeof value==='string'){out.push([path,value]);return out;}
  if(Array.isArray(value)){value.forEach((item,index)=>flattenStrings(item,`${path}[${index}]`,out));return out;}
  if(value&&typeof value==='object')for(const [key,item] of Object.entries(value))flattenStrings(item,path?`${path}.${key}`:key,out);
  return out;
};

export function buildV40731ExternalHelpLocales(v40729){
  const result=clone(v40729);
  for(const name of DIALECTS){
    if(!result[name])throw new Error(`V4.07.31 missing dialect source: ${name}`);
    const before=clone(result[name]);
    const after=transform(name,before);
    const meta=META[name];
    Object.assign(after,{menuTitle:meta.menu,title:meta.menu,subtitle:meta.subtitle,close:meta.close,copy:meta.copy,copied:meta.copied,copyFailed:meta.copyFailed});
    result[name]=after;

    const oldLeaves=new Map(flattenStrings(before));
    const newLeaves=flattenStrings(after);
    let changedLong=0, longTotal=0;
    for(const [path,text] of newLeaves){
      const old=oldLeaves.get(path);
      if(typeof old!=='string'||old.length<32||!/\p{L}/u.test(old))continue;
      longTotal++;
      if(text!==old)changedLong++;
    }
    if(longTotal<20||changedLong/longTotal<0.70)throw new Error(`V4.07.31 dialect coverage too low for ${name}: ${changedLong}/${longTotal}`);
  }
  return result;
}

export function v407Test31HelpI18nDelta(source){
  let result=source;
  result=replaceOnce(result,
    "  const CARD_DISPLAY_VERSION = '4.07.30';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST30-2026-09-14';",
    "  const CARD_DISPLAY_VERSION = '4.07.31';\n  const GEWITTERRADAR_BUILD = 'V4.07-TEST31-2026-09-14';",
    'display/build marker');
  result=replaceOnce(result,
    '.then(module => installAboutExternalLocales(module.ABOUT_EXTERNAL_LOCALES,module.HELP_EXTERNAL_LOCALES_V40729))',
    '.then(module => installAboutExternalLocales(module.ABOUT_EXTERNAL_LOCALES,module.HELP_EXTERNAL_LOCALES_V40731))',
    'external Help registry loader');
  return result;
}

export function replaceV40729RegistryWithV40731(moduleText,v40731){
  const marker='export const HELP_EXTERNAL_LOCALES_V40729 = ';
  const markerIndex=moduleText.indexOf(marker);
  if(markerIndex<0||moduleText.indexOf(marker,markerIndex+marker.length)>=0)throw new Error('V4.07.31 expected exactly one TEST29 Help registry export');
  const objectStart=markerIndex+marker.length;
  if(moduleText[objectStart]!=='{')throw new Error('V4.07.31 TEST29 registry object start changed');
  let depth=0,quote='',escaped=false,objectEnd=-1;
  for(let i=objectStart;i<moduleText.length;i++){
    const ch=moduleText[i];
    if(quote){if(escaped){escaped=false;continue;}if(ch==='\\'){escaped=true;continue;}if(ch===quote)quote='';continue;}
    if(ch==='"'||ch==="'"||ch==='`'){quote=ch;continue;}
    if(ch==='{')depth++;else if(ch==='}'&&--depth===0){objectEnd=i+1;break;}
  }
  if(objectEnd<0)throw new Error('V4.07.31 TEST29 registry object end missing');
  let statementEnd=objectEnd;
  while(/\s/.test(moduleText[statementEnd]))statementEnd++;
  if(moduleText[statementEnd]!==';')throw new Error('V4.07.31 TEST29 registry terminator missing');
  statementEnd++;
  const replacement='export const HELP_EXTERNAL_LOCALES_V40731 = '+JSON.stringify(v40731,null,2)+';';
  return moduleText.slice(0,markerIndex)+replacement+moduleText.slice(statementEnd);
}
