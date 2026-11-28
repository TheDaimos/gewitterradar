/** MA-023 extended overview: read-only schematic geographic view, no map-provider traffic. */
export const VIEWPORT_BOX=Object.freeze({width:1000,height:480});
const NS='http://www.w3.org/2000/svg';
const node=(tag,value='')=>{const el=document.createElement(tag);el.textContent=String(value);return el;};
const button=(text,fn)=>{const el=node('button',text);el.type='button';el.addEventListener('click',fn);return el;};
const svgNode=(tag,attrs={})=>{const el=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,String(v));return el;};
export function projectLocation({latitude,longitude},box=VIEWPORT_BOX){
  if(!Number.isFinite(latitude)||!Number.isFinite(longitude)||latitude<-90||latitude>90||longitude<-180||longitude>180) return null;
  const lat=Math.max(-85.05112878,Math.min(85.05112878,latitude));
  const sin=Math.sin(lat*Math.PI/180);
  const x=(longitude+180)/360*box.width;
  const y=(0.5-Math.log((1+sin)/(1-sin))/(4*Math.PI))*box.height;
  return {x,y};
}
export function locationOverlapGroups(places=[],epsilon=0.00001){
  const valid=places.filter(p=>projectLocation(p)!==null);
  const groups=[];
  for(const item of valid){
    const group=groups.find(g=>Math.abs(g[0].latitude-item.latitude)<=epsilon&&
      Math.abs(g[0].longitude-item.longitude)<=epsilon);
    if(group)group.push(item);else groups.push([item]);
  }
  return groups.filter(g=>g.length>1);
}
export function overviewInventory(places=[],query='',scope='active'){
  const q=String(query).trim().toLocaleLowerCase();
  return places.filter(p=>projectLocation(p)!==null&&
    (scope==='all'||scope==='archived'&&p.archived===true||scope==='active'&&p.archived!==true)&&
    String(p.name||p.summary||'').toLocaleLowerCase().includes(q));
}
export function openLocationOverview(owner,{places=[],onDetails,onMap,onGeoPoint,verifyContext}={}){
  if(!owner?.shadow||typeof verifyContext!=='function')return null;
  owner.shadow.getElementById('gr-ma-location-overview')?.remove();
  const german=/Deutsch|Boarisch|Platt|Sächs|Schwäb/i.test(owner._languageValue?.()||'Deutsch');
  const t=german?{
    title:'Standort-Sichtfenster',subtitle:'Geografische Übersicht · schematische Projektion (keine Straßenkarte)',
    active:'Aktiv',archived:'Archiviert',all:'Alle',filter:'Standort suchen',close:'Schließen',
    map:'Auf Hauptkarte',inspector:'GeoPoint Inspector',details:'Details',locations:'Standorte',
    doubles:'Mehrere Einträge an gleichen Koordinaten',empty:'Keine passenden Standorte',
    unselected:'Standort auswählen',origin:'Herkunft',coords:'Koordinaten',noMap:'Standortkarte nicht verfügbar',
    noGeo:'GeoPoint nicht verfügbar',readOnly:'Nur Übersicht – keine Standort- oder Tracker-Änderung'
  }:{
    title:'Location overview',subtitle:'Geographic overview · schematic projection (not a street map)',
    active:'Active',archived:'Archived',all:'All',filter:'Search locations',close:'Close',
    map:'Show on main map',inspector:'GeoPoint Inspector',details:'Details',locations:'Locations',
    doubles:'Multiple records at the same coordinates',empty:'No matching locations',
    unselected:'Select a location',origin:'Origin',coords:'Coordinates',noMap:'Map unavailable',
    noGeo:'GeoPoint unavailable',readOnly:'Read-only overview – no location or tracker edits'
  };
  const clean=places.filter(p=>p&&typeof p.uid==='string'&&projectLocation(p)!==null);
  const root=node('div');root.id='gr-ma-location-overview';
  const style=node('style');style.textContent=`#gr-ma-location-overview{position:fixed;inset:0;z-index:2147483608;background:#02070be6;display:grid;place-items:center;padding:12px;box-sizing:border-box;backdrop-filter:blur(8px)}
#gr-ma-location-overview .panel{width:min(1060px,100%);height:min(820px,calc(100dvh - 24px));display:flex;flex-direction:column;min-height:0;overflow:hidden;padding:15px;box-sizing:border-box;color:#f2e8d2;font:14px/1.5 system-ui;border:2px solid #cba35c;border-radius:22px;background:linear-gradient(155deg,#253645,#091722 72%);box-shadow:0 28px 80px #000b}
#gr-ma-location-overview header{flex:0 0 auto;display:flex;justify-content:space-between;align-items:center;gap:12px;border-bottom:1px solid #b08a4d80;padding-bottom:10px}
#gr-ma-location-overview header strong{font:clamp(20px,3vw,27px) Georgia,serif;color:#f5dcad}
#gr-ma-location-overview header small{display:block;color:#a8becb}
#gr-ma-location-overview button,#gr-ma-location-overview select,#gr-ma-location-overview input{font:inherit;min-height:42px;border:1px solid #a48a56;border-radius:9px;background:#142b39;color:#f4e3bf;padding:8px;box-sizing:border-box}
#gr-ma-location-overview button{cursor:pointer}#gr-ma-location-overview button:disabled{opacity:.45}
#gr-ma-location-overview button:focus-visible,#gr-ma-location-overview input:focus-visible,#gr-ma-location-overview select:focus-visible{outline:2px solid #ffe4a0;outline-offset:2px}
#gr-ma-location-overview .close-premium{width:44px;min-width:44px;border:0!important;background:transparent!important;padding:0!important;display:grid;place-items:center}#gr-ma-location-overview .close-premium img{width:34px;height:34px;object-fit:contain;pointer-events:none}
#gr-ma-location-overview .toolbar{display:flex;flex-wrap:wrap;gap:8px;padding:12px 0;align-items:center;flex:0 0 auto}
#gr-ma-location-overview .toolbar input{flex:1;min-width:135px}#gr-ma-location-overview .main{display:grid;grid-template-columns:minmax(0,1.8fr) minmax(260px,1fr);gap:12px;flex:1 1 auto;min-height:0}
#gr-ma-location-overview .plot{position:relative;min-height:200px;background:radial-gradient(ellipse at 50% 40%,#1d3b4c,#071721 80%);border:1px solid #9a794d;border-radius:14px;overflow:hidden}
#gr-ma-location-overview svg{width:100%;height:100%;display:block}
#gr-ma-location-overview .plot circle{cursor:pointer;stroke:#0b141f;stroke-width:2}
#gr-ma-location-overview .plot circle[data-selected=true]{stroke:#f9f0c2;stroke-width:4;filter:drop-shadow(0 0 6px #f4c578)}
#gr-ma-location-overview .sidebar{display:flex;flex-direction:column;min-height:0;gap:8px}
#gr-ma-location-overview .results{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;contain:paint;border:1px solid #886d43;border-radius:12px;padding:6px;scrollbar-width:thin}
#gr-ma-location-overview .results button{display:block;width:100%;text-align:left;margin:3px 0;padding:9px}
#gr-ma-location-overview .results button[aria-pressed=true]{border-color:#f5d991;background:#35463f}
#gr-ma-location-overview .details{flex:0 0 auto;border:1px solid #997749;border-radius:12px;padding:12px;background:#122737}
#gr-ma-location-overview .details strong{display:block;color:#ffe4a6;font:19px Georgia,serif}
#gr-ma-location-overview .actions{display:flex;gap:7px;flex-wrap:wrap}
#gr-ma-location-overview .foot{font-size:12px;color:#b9c9d4;flex:0 0 auto;margin:10px 0 0}
@media(max-width:700px){#gr-ma-location-overview .main{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(180px,1fr) minmax(175px,1fr)}#gr-ma-location-overview .sidebar{min-height:0}#gr-ma-location-overview .results{min-height:70px}#gr-ma-location-overview .details{padding:7px}}
`;
  const panel=node('section');panel.className='panel';panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');panel.setAttribute('aria-label',t.title);
  const header=node('header'),heading=node('div'),exit=button('',()=>root.remove());
  exit.setAttribute('aria-label',t.close);exit.className='close-premium';
  const closeIcon=node('img');closeIcon.src=owner.shadow.getElementById('settings-close')?.querySelector('img')?.src||new URL('../../assets/gewitterradar-about-close-premium.webp',import.meta.url).href;
  closeIcon.alt='';closeIcon.draggable=false;exit.append(closeIcon);
  heading.append(node('strong',t.title),node('small',t.subtitle));header.append(heading,exit);
  const toolbar=node('div');toolbar.className='toolbar';
  const filter=node('input');filter.type='search';filter.placeholder=t.filter;filter.setAttribute('aria-label',t.filter);
  const scope=node('select');scope.setAttribute('aria-label',t.locations);
  for(const [key,title] of [['active',t.active],['archived',t.archived],['all',t.all]]){const option=node('option',title);option.value=key;scope.append(option);}
  toolbar.append(filter,scope);
  const main=node('div');main.className='main';
  const plot=node('div');plot.className='plot';const svg=svgNode('svg',{viewBox:'0 0 1000 480',role:'img','aria-label':t.title});
  const grid=svgNode('g',{'aria-hidden':'true'}),markers=svgNode('g');
  for(let lon=-150;lon<=150;lon+=30){const x=(lon+180)/360*1000;grid.append(svgNode('line',{x1:x,y1:0,x2:x,y2:480,stroke:'#71899b','stroke-opacity':0.22}));}
  for(let lat=-60;lat<=60;lat+=30){const y=projectLocation({latitude:lat,longitude:0}).y;grid.append(svgNode('line',{x1:0,y1:y,x2:1000,y2:y,stroke:'#71899b','stroke-opacity':0.22}));}
  svg.append(grid,markers);plot.append(svg);
  const sidebar=node('div');sidebar.className='sidebar';
  const results=node('div');results.className='results';results.setAttribute('role','region');results.setAttribute('aria-label',t.locations);
  const detail=node('div');detail.className='details';sidebar.append(results,detail);main.append(plot,sidebar);
  const footer=node('p',t.readOnly);footer.className='foot';
  panel.append(header,toolbar,main,footer);root.append(style,panel);
  const host=owner.shadow.getElementById('map-fullscreen-dialog');
  (host?.open?host:owner.shadow).append(root);
  let current=clean[0]?.uid||null;
  const render=()=>{
    if(!root.isConnected)return;
    const visible=overviewInventory(clean,filter.value,scope.value);
    if(!visible.some(p=>p.uid===current))current=visible[0]?.uid||null;
    const duplicates=locationOverlapGroups(visible);
    markers.replaceChildren();results.replaceChildren();detail.replaceChildren();
    for(let i=0;i<visible.length;i++){
      const p=visible[i],coord=projectLocation(p),coLocated=duplicates.some(group=>group.includes(p));
      const circle=svgNode('circle',{cx:coord.x,cy:coord.y,r:p.uid===current?9:coLocated?7:5,
        fill:p.archived?'#a7acb4':'#e9b65a','data-selected':String(p.uid===current),'data-location-id':p.uid});
      const tip=svgNode('title');tip.textContent=String(p.name||p.summary||'')+' · '+p.latitude.toFixed(5)+', '+p.longitude.toFixed(5);
      circle.append(tip);markers.append(circle);
      const label=button(String(p.name||p.summary||'')+' · '+(p.archived?t.archived:t.active),()=>{current=p.uid;render();});
      label.setAttribute('aria-pressed',String(p.uid===current));results.append(label);
    }
    const selected=visible.find(p=>p.uid===current);
    if(!selected){detail.append(node('p',t.empty));return;}
    detail.append(node('strong',selected.name||selected.summary||t.unselected),
      node('p',t.coords+': '+selected.latitude.toFixed(6)+', '+selected.longitude.toFixed(6)),
      node('p',(selected.archived?t.archived:t.active)+' · '+t.origin+': '+String(selected.location_origin||selected.provider||'unknown')));
    if(duplicates.some(group=>group.includes(selected)))detail.append(node('p',t.doubles));
    const actions=node('div');actions.className='actions';
    if(typeof onDetails==='function')actions.append(button(t.details,()=>{if(!verifyContext())return;onDetails(selected);root.remove();}));
    if(typeof onMap==='function')actions.append(button(t.map,()=>{if(!verifyContext())return;onMap(selected);root.remove();}));
    if(typeof onGeoPoint==='function')actions.append(button(t.inspector,async()=>{if(!verifyContext())return;try{await onGeoPoint(selected);}catch{footer.textContent=t.noGeo;}}));
    detail.append(actions);
    footer.textContent=visible.length+' '+t.locations+' · '+duplicates.length+' '+t.doubles+' · '+t.readOnly;
  };
  svg.addEventListener('click',event=>{const id=event.target?.getAttribute?.('data-location-id');if(id){current=id;render();}});
  filter.addEventListener('input',render);scope.addEventListener('change',render);
  root.addEventListener('click',e=>{if(e.target===root)root.remove();});
  root.addEventListener('keydown',e=>{if(e.key==='Escape'){e.stopPropagation();root.remove();}});
  render();exit.focus({preventScroll:true});return root;
}
