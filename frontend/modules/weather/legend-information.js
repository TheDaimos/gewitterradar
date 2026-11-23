import {weatherSourceText} from './source-text.js?v=411150r1';

const isoPattern=/\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})\b/g;
const unique=values=>[...new Set(values.filter(Boolean))];
function plainInformation(value){
 let text=typeof value==='string'?value:'';
 if(typeof DOMParser!=='function')return weatherSourceText(text);
 for(let pass=0;pass<2;pass++){const doc=new DOMParser().parseFromString(text,'text/html');doc.querySelectorAll('script,style,template,iframe,object,svg,math').forEach(n=>n.remove());const next=doc.body.textContent||'';if(next===text)break;text=next;}
 // Keep scientific comparison signs (<0.2, >0) as text. Only actual residual
 // alphabetic markup is stripped after decoding escaped provider attributions.
 return text.replace(/<\/?[a-z][^>]*>/gi,'').replace(/\s+/g,' ').trim();
}
export function safeSourceLinks(value){
 if(typeof value!=='string'||typeof DOMParser==='undefined')return [];
 let parsed=new DOMParser().parseFromString(value,'text/html');
 // Some contracts contain escaped attribution markup. Parse the decoded text
 // only in an inert document; create live anchors ourselves below.
 if(!parsed.querySelector('a')&&parsed.body.textContent.includes('<'))parsed=new DOMParser().parseFromString(parsed.body.textContent,'text/html');
 parsed.querySelectorAll('script,style,template,iframe,object,svg,math').forEach(n=>n.remove());
 const links=new Map();
 for(const anchor of parsed.querySelectorAll('a[href]')){try{const url=new URL(anchor.getAttribute('href'));if(!['https:','http:'].includes(url.protocol)||url.username||url.password)continue;links.set(url.href,{url:url.href,label:weatherSourceText(anchor.textContent)||url.hostname});}catch(_){}}
 for(const match of weatherSourceText(parsed.body.textContent).matchAll(/https?:\/\/[^\s<>"']+/g)){try{const url=new URL(match[0].replace(/[),.;]+$/,''));if(!url.username&&!url.password&&!links.has(url.href))links.set(url.href,{url:url.href,label:url.hostname});}catch(_){}}
 return [...links.values()];
}
export function localLegendTime(raw,locale){
 if(typeof raw!=='string'||!/(?:Z|[+-]\d\d:\d\d)$/i.test(raw)||!Number.isFinite(Date.parse(raw)))return null;
 const zone=Intl.DateTimeFormat().resolvedOptions().timeZone||'UTC';
 return new Intl.DateTimeFormat(locale||undefined,{year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',timeZone:zone}).format(new Date(raw))+' ('+zone+')';
}
export function readableLegendText(value,t){return plainInformation(value).replace(/older_satellite_background/g,t('weather.legend.olderSatellite')).replace(/zeitlich_abweichend/g,t('legendHub.timeMismatch')).replace(/zeitlich_passend/g,t('legendHub.timeMatching')).replace(/^\s*\*\s*/,'');}
function paragraph(box,value,t){const text=readableLegendText(value,t);if(!text)return;const p=document.createElement('p');p.textContent=text;box.append(p);}
function section(box,title){const node=document.createElement('section'),h=document.createElement('h5');h.textContent=title;node.append(h);box.append(node);return node;}
function appendSources(box,values,t){
 const links=new Map();for(const value of values)for(const link of safeSourceLinks(value))links.set(link.url,link);
 for(const link of links.values()){const p=document.createElement('p'),a=document.createElement('a');a.href=link.url;a.textContent=link.label;a.target='_blank';a.rel='noopener noreferrer';p.append(a);box.append(p);}
 for(const value of unique(values)){const text=readableLegendText(value,t);if(!text||safeSourceLinks(value).length)continue;paragraph(box,text,t);}
}
// Shared, controlled DOM for every legend. Provider markup is never inserted.
// Native scientific visual/explanation nodes are already trusted application DOM.
export function renderLegendInformation(owner,{scales=[],sources=[],visual,explanation,sourceLines=[],technical={},notes=[]}={}){
 const t=owner._t.bind(owner),locale=owner._locale?.(),box=document.createElement('div');box.className='lh-information';
 const science=section(box,t('legendHub.scaleExplanation'));
 if(visual)science.append(visual);if(explanation)science.append(explanation);
 for(const scale of scales){const h=document.createElement('h6');h.textContent=weatherSourceText(scale.title)+(scale.unit?' · '+scale.unit:'');science.append(h);if(scale.visual)science.append(scale.visual);for(const line of unique([scale.meaning,scale.note]))paragraph(science,line,t);}
 for(const note of unique(notes))paragraph(science,note,t);
 const data=section(box,t('legendHub.dataSources')),timeliness=section(box,t('legendHub.timeliness')),seenTimes=new Set(),seenSources=new Set();
 const time=(label,raw)=>{const local=localLegendTime(raw,locale);if(!local)return;const key=label+'|'+new Date(raw).toISOString();if(seenTimes.has(key))return;seenTimes.add(key);paragraph(timeliness,local,t);};
 for(const source of sources){const id=source.source_id||source.id||'';if(seenSources.has(id))continue;seenSources.add(id);
  const h=document.createElement('h6');h.textContent=weatherSourceText(source.title||source.legend?.source_title||source.legend?.title||id);data.append(h);
  appendSources(data,[source.attribution,source.provenance?.attribution,source.provenance?.source_url||''].filter(Boolean),t);
  if(id.startsWith('nasa_gibs/'))paragraph(data,t('weather.legend.estimatedSatellite'),t);else if(id.startsWith('dwd/')||id.startsWith('opera/'))paragraph(data,t('weather.legend.radarPrecip'),t);
  const timeHeading=document.createElement('h6');timeHeading.textContent=h.textContent;timeliness.append(timeHeading);const rawTime=source.times?.valid_at||source.legendTime;if(localLegendTime(rawTime,locale))time(h.textContent,rawTime);else paragraph(timeliness,t('weather.legend.notTimed'),t);
  const codes=JSON.stringify([source.quality,source.quality_note,source.reason_codes,source.freshness_class,source.notes]);
  const status=unique([source.times?.stale===true?t('weather.legend.staleSource'):source.times?.stale===false?t('weather.legend.currentSource'):'',...(codes.match(/older_satellite_background|zeitlich_abweichend|zeitlich_passend/g)||[]),source.presentationStatus?t('legendHub.'+source.presentationStatus):'',source.freshness_class==='older_background'?t('weather.legend.olderBackground'):'',...(Array.isArray(source.quality?.notes)?source.quality.notes:[]),...(Array.isArray(source.quality?.flags)?source.quality.flags:[])]);
  if(Number.isFinite(source.times?.age_seconds))status.push(t('legendHub.reportedAge')+': '+Math.round(source.times.age_seconds/60)+' min');
  paragraph(timeliness,status.join(' · '),t);
 }
 // Older/native scientific callbacks retain their complete source text. Move
 // timestamp-bearing lines into the common time section and localize each ISO.
 const plain=[],nativeTimes=new Map();
 for(const line of unique(sourceLines)){
  if(!(String(line).match(isoPattern)||[]).length){plain.push(line);continue;}
  if(safeSourceLinks(line).length)plain.push(line);
  for(const part of String(line).split('·')){if(safeSourceLinks(part).length)continue;const stamps=part.match(isoPattern)||[];if(!stamps.length){paragraph(timeliness,part,t);continue;}
   const label=part.replace(isoPattern,'').replace(/\bUTC\b/g,'').replace(/[:\s]+$/,'').trim();
   for(const raw of unique(stamps)){const local=localLegendTime(raw,locale);if(!local)continue;const record=nativeTimes.get(local)||new Set();if(label)record.add(label);nativeTimes.set(local,record);}
  }
 }
 for(const [local,labels]of nativeTimes)paragraph(timeliness,[...labels].join(' / ')+' · '+local,t);
 appendSources(data,plain,t);
 if(timeliness.childElementCount===1)paragraph(timeliness,t('weather.legend.notTimed'),t);
 if(data.childElementCount===1)data.remove();
 const details=document.createElement('details'),summary=document.createElement('summary'),pre=document.createElement('pre');summary.textContent=t('legendHub.technicalDetails');pre.textContent=JSON.stringify({sources,sourceLines,...technical},null,2);details.append(summary,pre);box.append(details);return box;
}
export function safeLegendParagraphs(lines){const box=document.createElement('div');box.__legendLines=lines.filter(Boolean);for(const text of box.__legendLines){const p=document.createElement('p');p.textContent=plainInformation(text);for(const link of safeSourceLinks(text)){const a=document.createElement('a');a.href=link.url;a.textContent=link.label;a.target='_blank';a.rel='noopener noreferrer';p.append(document.createTextNode(' · '),a);}box.append(p);}return box;}
