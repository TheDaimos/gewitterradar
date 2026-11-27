// P04: Settings → Weather Engine → Blitzortung.org. Read-only diagnostics.
// No HA ConfigEntry mutation, tracker creation or automatic subscription.
const words={
 de:{title:'Tracker & Blitzortung',info:'Prüfen und zuordnen – Vorschau ohne Speicherung',place:'GewitterRadar-Standort',
  name:'Trackername',check:'Trackername prüfen',copy:'Entity-ID kopieren',source:'Blitzortung-Location prüfen',
  noPlaces:'Keine aktiven SQLite-Standorte verfügbar',noSources:'Keine Blitzortung-Location gefunden',
  blocked:'Zugriff nur für HA-Administratoren mit aktivem SQLite-Profil',
  available:'Name verfügbar (Tracker nicht angelegt)',unavailable:'Gewählter Name nicht verfügbar',
  error:'Prüfung fehlgeschlagen',close:'Schließen',trackers:'Tracker',counters:'Zähler',
  distances:'Entfernung',others:'Weitere Sensoren',readOnly:'Nur Vorschau; keine Zuordnung gespeichert'},
 en:{title:'Trackers & Blitzortung',info:'Review setup – read-only preview',place:'GewitterRadar location',
  name:'Tracker name',check:'Check tracker name',copy:'Copy entity ID',source:'Inspect Blitzortung location',
  noPlaces:'No active SQLite locations available',noSources:'No Blitzortung locations found',
  blocked:'Home Assistant administrator and active SQLite profile required',
  available:'Name available (no tracker created)',unavailable:'Selected name unavailable',
  error:'Check failed',close:'Close',trackers:'Trackers',counters:'Counters',
  distances:'Distance',others:'Other sensors',readOnly:'Read-only preview; no binding saved'}
};
const node=(tag,value='')=>{const el=document.createElement(tag);el.textContent=String(value);return el;};
const button=(name,action)=>{const el=node('button',name);el.type='button';el.addEventListener('click',action);return el;};
export function openTrackerSettings(owner,{locations=[],checkName,inventory,verifyContext}={}){
  if(!owner?.shadow||!Array.isArray(locations)||typeof verifyContext!=='function')return null;
  owner.shadow.getElementById('gr-ma-tracker-settings')?.remove();
  const t=/Deutsch|Boarisch|Platt|Sächs|Schwäb/i.test(owner._languageValue?.()||'Deutsch')?words.de:words.en;
  const root=node('div');root.id='gr-ma-tracker-settings';
  const style=node('style');
  style.textContent=`#gr-ma-tracker-settings{position:fixed;inset:0;z-index:2147483640;background:#030a10dc;display:grid;place-items:center;padding:12px;box-sizing:border-box}
#gr-ma-tracker-settings .panel{width:min(670px,100%);max-height:calc(100dvh - 24px);overflow:hidden;display:flex;flex-direction:column;border:2px solid #bf9b55;border-radius:20px;background:linear-gradient(180deg,#233544,#08131d);color:#e8e2d2;padding:17px;box-sizing:border-box;box-shadow:0 20px 70px #000b;font:14px system-ui}
#gr-ma-tracker-settings header{display:flex;align-items:center;justify-content:space-between;gap:10px;border-bottom:1px solid #b694594f;flex:none}
#gr-ma-tracker-settings header strong{font:23px Georgia,serif;color:#f4dca8}
#gr-ma-tracker-settings .body{overflow-y:auto;min-height:0;display:grid;gap:12px;padding:12px 0;overscroll-behavior:contain}
#gr-ma-tracker-settings label{display:grid;gap:5px;color:#f4dca8}
#gr-ma-tracker-settings input,#gr-ma-tracker-settings select,#gr-ma-tracker-settings button{min-height:44px;background:#102b3b;border:1px solid #ac8d55;border-radius:9px;padding:9px;color:#f0e2c6;max-width:100%;box-sizing:border-box;font:inherit}
#gr-ma-tracker-settings button:disabled{opacity:.45}
#gr-ma-tracker-settings .actions{display:flex;flex-wrap:wrap;gap:8px}
#gr-ma-tracker-settings p{line-height:1.45;overflow-wrap:anywhere}
#gr-ma-tracker-settings .result{border:1px solid #887449;border-radius:9px;padding:8px;white-space:pre-wrap}
`;
  const panel=node('section');panel.className='panel';panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label',t.title);
  const header=node('header'),title=node('strong',t.title);
  const close=()=>root.remove();const exit=button(t.close,close);header.append(title,exit);
  const body=node('div');body.className='body';
  const info=node('p',t.info),placeLabel=node('label',t.place),placePicker=node('select');
  const valid=locations.filter(p=>typeof p?.uid==='string'&&!p.archived);
  for(const p of valid){const option=node('option',p.name||p.summary||p.uid);option.value=p.uid;placePicker.append(option);}
  placeLabel.append(placePicker);
  const nameLabel=node('label',t.name),name=node('input');name.type='text';name.maxLength=120;
  nameLabel.append(name);
  const actions=node('div');actions.className='actions';
  const message=node('p',t.readOnly);message.setAttribute('role','status');
  const sourceResult=node('div');sourceResult.className='result';
  const nameButton=button(t.check,async()=>{
    if(!verifyContext()||!placePicker.value)return;
    const id=placePicker.value,snapshot=name.value;nameButton.disabled=true;copyButton.disabled=true;
    try{
      const answer=await checkName(id,snapshot);
      if(!root.isConnected||!verifyContext()||id!==placePicker.value||snapshot!==name.value)return;
      if(answer.available===true){copyButton.dataset.entityId=answer.entity_id;copyButton.disabled=false;
        message.textContent=t.available+': '+answer.entity_id;}
      else message.textContent=t.unavailable;
    }catch{message.textContent=t.error;}
    finally{if(root.isConnected)nameButton.disabled=false;}
  });
  const copyButton=button(t.copy,async()=>{
    if(!copyButton.dataset.entityId||!verifyContext())return;
    try{await navigator.clipboard.writeText(copyButton.dataset.entityId);}
    catch{message.textContent=t.error;}
  });copyButton.disabled=true;
  const sourceButton=button(t.source,async()=>{
    if(!verifyContext()||!placePicker.value)return;
    sourceButton.disabled=true;sourceResult.replaceChildren();
    const id=placePicker.value;
    try{
      const rows=await inventory(id);
      if(!root.isConnected||!verifyContext()||id!==placePicker.value)return;
      if(!rows.length){sourceResult.append(node('p',t.noSources));return;}
      const select=node('select');select.setAttribute('aria-label',t.source);
      for(const row of rows){const option=node('option',row.title);option.value=row.entry_id;select.append(option);}
      const details=node('div');
      const render=()=>{
        const selected=rows.find(x=>x.entry_id===select.value);
        details.replaceChildren();
        if(!selected)return;
        for(const [key,label] of [['trackers',t.trackers],['counters',t.counters],
          ['distances',t.distances],['other_sensors',t.others]]){
          details.append(node('p',label+': '+(selected[key].join(', ')||'—')));
        }
        details.append(node('p',t.readOnly));
      };
      select.addEventListener('change',render);sourceResult.append(select,details);render();
    }catch{sourceResult.append(node('p',t.error));}
    finally{if(root.isConnected)sourceButton.disabled=false;}
  });
  const reset=()=>{
    const place=valid.find(x=>x.uid===placePicker.value);
    name.value=String(place?.name||'');copyButton.disabled=true;delete copyButton.dataset.entityId;
    sourceResult.replaceChildren();message.textContent=t.readOnly;
  };
  name.addEventListener('input',()=>{copyButton.disabled=true;delete copyButton.dataset.entityId;message.textContent=t.readOnly;});
  placePicker.addEventListener('change',reset);
  const usable=valid.length&&verifyContext()&&typeof checkName==='function'&&typeof inventory==='function';
  nameButton.disabled=!usable;sourceButton.disabled=!usable;placePicker.disabled=!usable;
  if(!usable)message.textContent=valid.length?t.blocked:t.noPlaces;
  reset();if(!usable)message.textContent=valid.length?t.blocked:t.noPlaces;
  actions.append(nameButton,copyButton,sourceButton);
  body.append(info,placeLabel,nameLabel,actions,message,sourceResult);
  panel.append(header,body);root.append(style,panel);
  root.addEventListener('click',e=>{if(e.target===root)close();});
  root.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();close();}});
  const fullscreen=owner.shadow.getElementById('map-fullscreen-dialog');
  (fullscreen?.open?fullscreen:owner.shadow).append(root);
  return root;
}
