import {
  buildV40731ExternalHelpLocales as buildR1,
  replaceV40729RegistryWithV40731,
  v407Test31HelpI18nDelta,
} from './v4-07-test31-help-i18n-delta.mjs';

export {replaceV40729RegistryWithV40731,v407Test31HelpI18nDelta};

const DIALECTS=['Boarisch','Plattdüütsch','Sächs’sch','Schwäbisch'];
const SECONDARY={
  'Boarisch':[
    [/Beobachtungsradius – äußerer Bereich für frühe Beobachtung\./g,'Beobachtungsradius – da äußere Bereich fürs friahzeitige Beobachtn.'],
    [/Gewitterradius – näherer Bereich mit erhöhter Aufmerksamkeit\./g,'Gewitterradius – da nähere Bereich, wo ma besonders Obacht gebn sollt.'],
    [/Gefahrenradius – unmittelbarer Nahbereich mit besonders hoher Relevanz\./g,'Gefahrenradius – da unmittelbare Nahbereich mit besonders hoher Wichtigkeit.'],
    [/Externe Dienste & Netzwerkzugriff/g,'Externe Dienst & Netzwerkzugriff'],
    [/hebt relevante Gewitteraktivität optisch hervor\./g,'hebt wichtige Gewitteraktivität optisch auße.'],
    [/Kartengruppierung und Warnanimation eingeschaltet lassen\./g,'Kartengruppierung und Warnanimation eigschaltet lassn.'],
    [/Backup wächst ungewöhnlich schnell/g,'Backup wachst ungewöhnlich schnell'],
    [/Sprachauswahl erscheint immer wieder/g,'Sprachauswahl kummt immer wieder'],
    [/Darstellung nach Update unverändert/g,'Darstellung nachm Update unverändert'],
    [/\bdarf\b/g,'derf'],[/\bDarf\b/g,'Derf'],[/\bnur\b/g,'bloß'],[/\bNur\b/g,'Bloß'],[/\bsein\b/g,'sei'],[/\bSein\b/g,'Sei'],
    [/\bhaben\b/g,'ham'],[/\bHaben\b/g,'Ham'],[/\bhat\b/g,'hod'],[/\bHat\b/g,'Hod'],[/\boder\b/g,'oda'],[/\bOder\b/g,'Oda'],
    [/\bals\b/g,'ois'],[/\bAls\b/g,'Ois'],[/\bsollte\b/g,'sollt'],[/\bSollte\b/g,'Sollt'],[/\bsollen\b/g,'solln'],[/\bSollen\b/g,'Solln'],
    [/\bfolgende\b/g,'de folgenden'],[/\bFolgende\b/g,'De folgenden'],[/\bverwendet\b/g,'verwendt'],[/\bVerwendet\b/g,'Verwendt'],
  ],
  'Plattdüütsch':[
    [/Beobachtungsradius – äußerer Bereich für frühe Beobachtung\./g,'Beobachtungsradius – de butenste Rebeet för frühe Beobachten.'],
    [/Gewitterradius – näherer Bereich mit erhöhter Aufmerksamkeit\./g,'Gewitterradius – dat neegere Rebeet, dor muttst du beter oppassen.'],
    [/Gefahrenradius – unmittelbarer Nahbereich mit besonders hoher Relevanz\./g,'Gefahrenradius – dat direkte Nahrebeet mit besünners hoge Bedüden.'],
    [/Externe Dienste & Netzwerkzugriff/g,'Externe Deensten & Nettwarktogang'],
    [/hebt relevante Gewitteraktivität optisch hervor\./g,'heevt wichtige Gewitteraktivität sichtbor rut.'],
    [/Kartengruppierung und Warnanimation eingeschaltet lassen\./g,'Koortengruppierung un Warnanimation an laten.'],
    [/Backup wächst ungewöhnlich schnell/g,'Backup wasst bannig gau'],
    [/Sprachauswahl erscheint immer wieder/g,'Spraakutwahl kümmt jümmers wedder'],
    [/Darstellung nach Update unverändert/g,'Dorstellen na Update nich ännert'],
    [/\bdarf\b/g,'dörv'],[/\bDarf\b/g,'Dörv'],[/\bnur\b/g,'bloots'],[/\bNur\b/g,'Bloots'],[/\bsein\b/g,'wesen'],[/\bSein\b/g,'Wesen'],
    [/\bhaben\b/g,'hebben'],[/\bHaben\b/g,'Hebben'],[/\bhat\b/g,'hett'],[/\bHat\b/g,'Hett'],[/\bals\b/g,'as'],[/\bAls\b/g,'As'],
    [/\bsollte\b/g,'schull'],[/\bSollte\b/g,'Schull'],[/\bsollen\b/g,'schullen'],[/\bSollen\b/g,'Schullen'],[/\bfolgende\b/g,'de nakamen'],[/\bFolgende\b/g,'De nakamen'],
    [/\bverwendet\b/g,'bruukt'],[/\bVerwendet\b/g,'Bruukt'],[/\bverwenden\b/g,'bruken'],[/\bVerwenden\b/g,'Bruken'],
  ],
  'Sächs’sch':[
    [/Beobachtungsradius – äußerer Bereich für frühe Beobachtung\./g,'Beobachdungsradius – dr äußere Bereich fürs frühe Beobachdn.'],
    [/Gewitterradius – näherer Bereich mit erhöhter Aufmerksamkeit\./g,'Gewidderradius – dr nähere Bereich, wo de besser uffbassn sollst.'],
    [/Gefahrenradius – unmittelbarer Nahbereich mit besonders hoher Relevanz\./g,'Gefahrenradius – dr direkte Nahbereich mit besonders hoher Wischdschkeid.'],
    [/Externe Dienste & Netzwerkzugriff/g,'Exderne Dienste & Netzwergzugriff'],
    [/hebt relevante Gewitteraktivität optisch hervor\./g,'hebt wischdsche Gewidderaktivität sichtbar raus.'],
    [/Kartengruppierung und Warnanimation eingeschaltet lassen\./g,'Kartengruppierung un Warnanimation eingeschaltd lassn.'],
    [/Backup wächst ungewöhnlich schnell/g,'Backup wächst ungewöhnlich schnell weider'],
    [/Sprachauswahl erscheint immer wieder/g,'Sprachauswahl gommd immer wieder'],
    [/Darstellung nach Update unverändert/g,'Darstellung nachm Update unveränderd'],
    [/\bdarf\b/g,'derf'],[/\bDarf\b/g,'Derf'],[/\bnur\b/g,'bloß'],[/\bNur\b/g,'Bloß'],[/\bhaben\b/g,'ham'],[/\bHaben\b/g,'Ham'],
    [/\boder\b/g,'odder'],[/\bOder\b/g,'Odder'],[/\bsollte\b/g,'sollt'],[/\bSollte\b/g,'Sollt'],[/\bsollen\b/g,'solln'],[/\bSollen\b/g,'Solln'],
    [/\bfolgende\b/g,'de folgendn'],[/\bFolgende\b/g,'De folgendn'],[/\bverwendet\b/g,'verwendet'],[/\bverwenden\b/g,'verwendn'],[/\bVerwenden\b/g,'Verwendn'],
    [/\bgenau\b/g,'genau'],[/\bbitte\b/g,'bidde'],[/\bBitte\b/g,'Bidde'],
  ],
  'Schwäbisch':[
    [/Beobachtungsradius – äußerer Bereich für frühe Beobachtung\./g,'Beobachtungsradius – dr äußere Bereich fürs frühe Beobachta.'],
    [/Gewitterradius – näherer Bereich mit erhöhter Aufmerksamkeit\./g,'Gewitterradius – dr nähere Bereich, do sollt mr bsunders uffpassa.'],
    [/Gefahrenradius – unmittelbarer Nahbereich mit besonders hoher Relevanz\./g,'Gefahrenradius – dr direkte Nahbereich mit bsunders hoher Bedeutung.'],
    [/Externe Dienste & Netzwerkzugriff/g,'Externe Dienscht & Netzwerkzugriff'],
    [/hebt relevante Gewitteraktivität optisch hervor\./g,'hebt wichtige Gewitteraktivität sichtbar raus.'],
    [/Kartengruppierung und Warnanimation eingeschaltet lassen\./g,'Kartengruppierung ond Warnanimation eigschaltet lassa.'],
    [/Backup wächst ungewöhnlich schnell/g,'Backup wächst arg schnell'],
    [/Sprachauswahl erscheint immer wieder/g,'Sprachauswahl kommt emmer wieder'],
    [/Darstellung nach Update unverändert/g,'Darstellung nachm Update unverändert'],
    [/\bdarf\b/g,'derf'],[/\bDarf\b/g,'Derf'],[/\bnur\b/g,'bloß'],[/\bNur\b/g,'Bloß'],[/\bsein\b/g,'sei'],[/\bSein\b/g,'Sei'],
    [/\bhaben\b/g,'hen'],[/\bHaben\b/g,'Hen'],[/\bhat\b/g,'hot'],[/\bHat\b/g,'Hot'],[/\bsollte\b/g,'sollt'],[/\bSollte\b/g,'Sollt'],
    [/\bsollen\b/g,'sollet'],[/\bSollen\b/g,'Sollet'],[/\bfolgende\b/g,'d folgende'],[/\bFolgende\b/g,'D folgende'],[/\bverwendet\b/g,'benutzt'],[/\bVerwendet\b/g,'Benutzt'],
  ],
};

const DIALECT_SIGNAL={
  'Boarisch':/\b(?:ned|san|de|da|werdn|muaß|kenna|gspeichert|Suach|derf|bloß|sei|ham|hod|oda|ois|Hüf|Hinwais|lafft|kummt|lassn|auße)\b/,
  'Plattdüütsch':/\b(?:nich|warrt|un|för|vun|Oort|Koort|spiekert|dörv|bloots|wesen|hebben|hett|as|bruukt|Kort|verklort|dormit|seker|verstahn|arbeidt|Buten-Deensten|Nettwark-Togrepen|jümmers|wedder)\b/,
  'Sächs’sch':/\b(?:nich|un|dr|Ord|Standord|werdn|keene|derf|bloß|ham|odder|bidde|Gorz|damidd|looft|Hilche|Hinweese|gommd|Wischdsch|lassn|Exderne|Diensde|Netzwerkzugriffe)\b/,
  'Schwäbisch':/\b(?:net|ond|dr|isch|send|gspeichert|Suach|derf|bloß|sei|hen|hot|lauft|Hilf|emmer|lassa|bsunders|uffpassa|Dienscht)\b/,
};

const clone=value=>JSON.parse(JSON.stringify(value));
const rewrite=(name,value)=>{
  if(Array.isArray(value))return value.map(item=>rewrite(name,item));
  if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,item])=>[key,rewrite(name,item)]));
  if(typeof value!=='string')return value;
  let out=value;
  for(const [from,to] of SECONDARY[name])out=out.replace(from,to);
  return out;
};
const flatten=(value,path='',out=[])=>{
  if(typeof value==='string'){out.push([path,value]);return out;}
  if(Array.isArray(value)){value.forEach((item,index)=>flatten(item,`${path}[${index}]`,out));return out;}
  if(value&&typeof value==='object')for(const [key,item] of Object.entries(value))flatten(item,path?`${path}.${key}`:key,out);
  return out;
};
const technical=text=>/(?:https?:\/\/|device_tracker\.|person\.\*|zone\.\*|geo_location\.|sensor\.\*|recorder:|configuration\.yaml|\.org\b|\.com\b|\.pl\b|MQTT\/TCP|HTTPS\/TCP|TCP\/443|TCP\/8883|★|↶|×)/.test(text)||/^(?:Client|Server|Testwerte|API|Integration)\s*·/.test(text);

export function buildV40731ExternalHelpLocales(v40729){
  const result=buildR1(v40729);
  for(const name of DIALECTS)result[name]=rewrite(name,result[name]);

  for(const name of DIALECTS){
    const oldLeaves=new Map(flatten(v40729[name]));
    const unchanged=[];
    for(const [path,text] of flatten(result[name])){
      const old=oldLeaves.get(path);
      if(typeof old!=='string'||old.length<32||technical(old)||!/\p{L}/u.test(old))continue;
      if(text===old&&!DIALECT_SIGNAL[name].test(text))unchanged.push(`${path}: ${text}`);
    }
    if(unchanged.length)throw new Error(`V4.07.31 unchanged Standard-German prose remains in ${name}:\n${unchanged.join('\n')}`);
  }
  return clone(result);
}
