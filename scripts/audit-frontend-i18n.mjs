import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {readFileSync,readdirSync} from 'node:fs';
import {runInNewContext} from 'node:vm';
import {loadAboutLocaleRuntime} from './verify-about-locales.mjs';

const baseline='25c3ef494c1d54440b9dd70344875de5ae877105';
const source=ref=>path=>ref
  ?execFileSync('git',['show',ref+':'+path],{encoding:'utf8',maxBuffer:20*1024*1024})
  :readFileSync(path,'utf8');
const entries=(object,prefix='')=>Object.entries(object??{}).flatMap(([key,value])=>{
  const path=prefix?prefix+'.'+key:key;
  return value&&typeof value==='object'?entries(value,path):[[path,value]];
});
function jsValues(text,names,dependencies={}){
  const capture=names.join(',');
  return runInNewContext(text.replace(/^import\s+.*;\s*$/gm,'').replace(/^export\s+/gm,'')
    +'\n;({'+capture+'})',{URL,moduleUrl:'https://gewitterradar.invalid/',...dependencies},{timeout:3000});
}
const settingsTables=(text)=>jsValues(text.slice(
  text.indexOf('const SETTINGS_UI_TRANSLATIONS='),text.indexOf('export const installI18nSettings=')),
['SETTINGS_UI_TRANSLATIONS','V410_UI_TRANSLATIONS','V410_HELP_INSTRUMENTS','V411_HELP_WEATHER_DISPLAY']);
const externalTables=['ABOUT_EXTERNAL_LOCALES','HELP_EXTERNAL_LOCALES','HELP_EXTERNAL_LOCALES_V40731','HELP_EXTERNAL_LOCALES_V40753'];
const currentStart='1127927b98b087135b9340bf3871b20486c23bd1';
function inventory(read, includePresentation=false){
  const model=loadAboutLocaleRuntime(read('frontend/gewitterradar.js'),read('frontend/modules/core/base-context.js'));
  const settings=settingsTables(read('frontend/modules/ui/i18n-settings.js'));
  const helpTopics=read('frontend/modules/ui/help-topics.js');
  const {de,en}=jsValues(helpTopics.slice(helpTopics.indexOf('const de ='),helpTopics.indexOf('const weatherRouterLink')),['de','en']);
  const table=read('frontend/locales/about-locales.js');
  const ext=jsValues(table,externalTables);
  const weatherExport='WEATHER_EXTERNAL_LOCALES';
  if(table.includes('export const '+weatherExport+' ='))ext[weatherExport]=jsValues(table,[weatherExport])[weatherExport];
  const quick=jsValues(read('frontend/modules/weather/display-quick.js'),['QUICK_TRANSLATIONS']);
  const eye=jsValues(read('frontend/modules/weather/eye-hub-locales.js'),['EYE_HUB_TRANSLATIONS'],quick);
  const flow=jsValues(read('frontend/modules/weather/flow-locales.js'),['FLOW_TRANSLATIONS']);
  const temp=jsValues(read('frontend/modules/weather/temperature-units.js'),['TEMPERATURE_UNIT_TRANSLATIONS']);
  const catalogs={embeddedAbout:model.locales,embeddedWeatherHelp:{Deutsch:de,English:en},
    app:Object.fromEntries(Object.entries(model.app).map(([name,value])=>[name,value.strings])),
    ...settings,...ext,...eye,...flow,...temp,
    ...(includePresentation?jsValues(read('frontend/modules/ui/presentation-locales.js'),['PRESENTATION_LOCALES']):{})};
  const native=['strings.json','translations/de.json','translations/en.json'].map(path=>[
    path,Object.fromEntries(entries(JSON.parse(read('custom_components/gewitterradar/'+path))))
  ]);
  return {languages:model.languages,catalogs,native:Object.fromEntries(native)};
}

function files(dir){
  return readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{
    const path=dir+'/'+entry.name;
    if(entry.isDirectory())return entry.name==='assets'?[]:files(path);
    return /\.(?:js|html)$/.test(path)?[path]:[];
  });
}
function literals(ref){
  const read=source(ref);
  const paths=ref?execFileSync('git',['ls-tree','-r','--name-only',ref,'frontend'],{encoding:'utf8'}).trim().split(/\r?\n/):files('frontend');
  const found=[];
  // Deliberately retain candidates in compound HTML, assignments and label tables.
  // Computed messages and duplicated candidates need review at their call site.
  const sink=/(?:textContent|inner(?:HTML|Text)|aria-label|placeholder|\btitle|\blabel|\bstatus|\bcaption|\bdescription)\s*(?:=|:)|\.setAttribute\(\s*['"](?:aria-label|title|placeholder)/i;
  const call=/\b(?:_t|_tp)\(\s*['"]([\w.-]+)['"]/g;
  const referenced=new Set();
  for(const path of paths.filter(p=>/\.(?:js|html)$/.test(p)&&!p.includes('/assets/')&&!p.includes('/locales/'))){
    const text=read(path);
    for(const match of text.matchAll(call))referenced.add(match[1]);
    const lines=text.split(/\r?\n/);
    for(const [index,line] of lines.entries()){
      if(!sink.test(line)&&!/<\w+[^>]*>\s*\p{L}/u.test(line))continue;
      // Do not output embedded images, minified CSS or storage values.
      const clean=line.replace(/data:[^'"\s>]{100,}/g,'[embedded resource]');
      const words=[...clean.matchAll(/(?:[\x27"\x60>])([^\x27"\x60<>]{2,250})(?=[\x27"\x60<])/gu)]
        .map(match=>match[1].trim()).filter(s=>/^\p{L}[\p{L}\p{M}].*\s+\p{L}/u.test(s)&&!/[{};=]/.test(s));
      if(words.length)found.push({path,line:index+1,text:[...new Set(words)]});
    }
  }
  return {candidates:found,referenced:[...referenced].sort()};
}
const current=inventory(source(),true);
const previous=inventory(source(baseline));
const carried=Object.fromEntries(entries(inventory(source(currentStart)).catalogs));
assert.deepEqual(JSON.parse(JSON.stringify(current.languages)),JSON.parse(JSON.stringify(previous.languages)),'Registered languages changed');
const before=Object.fromEntries(entries(previous.catalogs));
const after=Object.fromEntries(entries(current.catalogs));
assert.deepEqual(Object.keys(carried).filter(key=>carried[key]!==after[key]),[],'GR 4.11.223 translation values changed');
const removed=Object.keys(before).filter(key=>!Object.hasOwn(after,key));
assert.deepEqual(removed,[],'Existing locale keys removed');
assert.deepEqual(current.native,previous.native,'Native HA translations changed');
const placeholders=value=>typeof value==='string'?[...value.matchAll(/\{([\w]+)\}/g)].map(([,name])=>name).sort():[];
const changed=Object.keys(before).filter(key=>before[key]!==after[key]);
for(const key of changed)assert.deepEqual(placeholders(after[key]),placeholders(before[key]),key);
for (const {value:name} of current.languages) {
  const eye = current.catalogs.EYE_HUB_TRANSLATIONS[name];
  const reference = current.catalogs.EYE_HUB_TRANSLATIONS.English;
  assert.deepEqual(Object.keys(eye).sort(),Object.keys(reference).sort(),name+' Eye keys');
  for (const [key,value] of Object.entries(eye)) {
    assert(typeof value==='string'&&value.trim(),name+' Eye '+key);
    assert.deepEqual(placeholders(value),placeholders(reference[key]),name+' Eye '+key);
  }
}
const presentation = current.catalogs.PRESENTATION_LOCALES;
const presentationKeys = Object.keys(presentation.English).sort();
assert.deepEqual(Object.keys(presentation).sort(),Array.from(current.languages,entry=>entry.value).sort());
for(const [name,table] of Object.entries(presentation)) {
  assert.deepEqual(Object.keys(table).sort(),presentationKeys,name+' presentation keys');
  for(const [key,value] of Object.entries(table)) {
    assert(typeof value==='string'&&value.trim(),name+' '+key);
    assert.deepEqual(placeholders(value),placeholders(presentation.English[key]),name+' '+key);
  }
  assert.match(table['weather.legend.advectionModel'],/−v · ∇T.*850[- ]hPa/,name+' thermal advection formula');
  assert.match(table['weather.legend.windBarbs'],/5 kn.*10 kn.*50 kn.*2[.,]5.*1[.,]852 km\/[htu]/,name+' wind barb scale');
}
const presentationReferences=new Set();
for(const path of files('frontend').filter(path=>path.endsWith('.js')&&!path.includes('/locales/'))){
  const code=readFileSync(path,'utf8');
  const entry=/\b_t\(\s*['"]((?:vault\.|weather\.(?:app|color|hub|layer|legend|menu|precip|source|status|studio|synoptic|temperature|weatherDisplay|wind)\.)[\w.]+)['"](?=\s*[,\)])/g;
  for(const [,key] of code.matchAll(entry))presentationReferences.add(key);
}
assert.deepEqual([...presentationReferences].filter(key=>!Object.hasOwn(presentation.English,key)),[],'Missing presentation references');
const applicationCatalogs=['app','SETTINGS_UI_TRANSLATIONS','V410_UI_TRANSLATIONS'];
const applicationKeys=(catalogs,name)=>applicationCatalogs.flatMap(key=>Object.keys(catalogs[key][name]??{}));
const uniqueAppKeys=(catalogs,name)=>new Set(applicationKeys(catalogs,name));
const missing=(catalogs,name)=>[...uniqueAppKeys(catalogs,'English')].filter(key=>!uniqueAppKeys(catalogs,name).has(key));
const counts=Object.fromEntries(current.languages.map(({value:name})=>{
  const count=catalogs=>Object.values(catalogs).reduce((n,table)=>n+entries(table[name]).length,0);
  const empty=Object.values(current.catalogs).flatMap(table=>entries(table[name])).filter(([,value])=>typeof value==='string'&&!value.trim()).length;
  const overlap=catalogs=>{
    const keys=applicationKeys(catalogs,name);
    return keys.filter((key,index)=>keys.indexOf(key)===index && keys.lastIndexOf(key)!==index).sort();
  };
  const appFallbackKeys=missing(current.catalogs,name);
  assert.deepEqual(appFallbackKeys,[],name+' application fallback keys');
  const referenceTables = Object.fromEntries(applicationCatalogs.flatMap(key => Object.entries(current.catalogs[key].English ?? {})));
  const languageTables = Object.fromEntries(applicationCatalogs.flatMap(key => Object.entries(current.catalogs[key][name] ?? {})));
  for (const key of missing(previous.catalogs,name)) {
    assert(languageTables[key]?.trim(),name+' application '+key);
    assert.deepEqual(placeholders(languageTables[key]),placeholders(referenceTables[key]),name+' application '+key);
  }
  const eye=Object.keys(current.catalogs.EYE_HUB_TRANSLATIONS[name]??{});
  return [name,{before:count(previous.catalogs),after:count(current.catalogs),empty,
    applicationOverlapBefore:overlap(previous.catalogs),applicationOverlapAfter:overlap(current.catalogs),
    appFallbackKeysBefore:missing(previous.catalogs,name),appFallbackKeys,
    eyeFallbackKeysBefore:Object.keys(previous.catalogs.EYE_HUB_TRANSLATIONS.English).filter(key=>!Object.hasOwn(previous.catalogs.EYE_HUB_TRANSLATIONS[name]??{},key)),
    eyeFallbackKeys:Object.keys(current.catalogs.EYE_HUB_TRANSLATIONS.English).filter(key=>!eye.includes(key))}];
}));
const allLiterals=literals(process.argv.includes('--baseline')?baseline:null);
const body={baseline,currentStart,languages:current.languages,counts,removed,changed,presentationKeys,presentationReferences:[...presentationReferences].sort(),
  native:Object.fromEntries(Object.entries(current.native).map(([name,keys])=>[name,Object.keys(keys).length])),
  added:Object.keys(after).filter(key=>!Object.hasOwn(before,key)),...allLiterals};
if(process.argv.includes('--json'))console.log(JSON.stringify(body,null,2));
else {
  console.table(Object.fromEntries(Object.entries(counts).map(([name,c])=>[name,{before:c.before,after:c.after,empty:c.empty,appFallback:c.appFallbackKeys.length,eyeFallback:c.eyeFallbackKeys.length}])));
  console.log('Locale catalogs: '+removed.length+' removed, '+changed.length+' revised, '+body.added.length+' added. Native HA key sets preserved.');
  console.log(allLiterals.candidates.length+' source lines with UI text candidates; '+allLiterals.referenced.length+' literal translation references.');
}
