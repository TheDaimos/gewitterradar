import { defineModule } from '../core/runtime.js?v=41106r1';

export const MODULE_META=Object.freeze({
  id:'weather.engine-diagnostics',
  version:'1.0.0',
  group:'Weather-Engine',
  function:'Weather Engine Diagnose',
  subfunctions:[
    'Bereichsfilter',
    'Capability-Filter',
    'Consumer Request/Response',
    'Provider & Coverage',
    'lokaler Layerzustand',
    'Fallback/Retain',
    'Timeline',
    'Rohdaten',
    'Textkopie',
    'JSON-Export'
  ],
  file:'modules/weather/engine-diagnostics.js'
});

const SENSITIVE_QUERY=/([?&](?:api[_-]?key|apikey|access[_-]?token|token|key|appid|password|secret)=)[^&#\s]+/gi;
const AUTH=/(authorization\s*[:=]\s*(?:bearer\s+)?)[^\s,;]+/gi;
const USERINFO=/(https?:\/\/[^:/@\s]+:)[^@/\s]+@/gi;
const redactString=value=>String(value).replace(SENSITIVE_QUERY,'$1<redacted>').replace(AUTH,'$1<redacted>').replace(USERINFO,'$1<redacted>@');
const sanitize=value=>{
  if(typeof value==='string')return redactString(value);
  if(value==null||typeof value==='number'||typeof value==='boolean')return value;
  if(Array.isArray(value))return value.map(sanitize);
  if(typeof value==='object'){
    const out={};
    for(const [key,item] of Object.entries(value)){
      if(/^(authorization|cookie|password|secret|token|api[_-]?key|access[_-]?token)$/i.test(key))out[key]='<redacted>';
      else out[key]=sanitize(item);
    }
    return out;
  }
  return redactString(value);
};
const pretty=value=>JSON.stringify(sanitize(value),null,2);
const fmtDate=value=>{
  if(!value)return '—';
  const date=new Date(value);
  return Number.isNaN(date.getTime())?String(value):date.toLocaleString('de-DE');
};
const capGroup=id=>{
  const value=String(id||'').toLowerCase();
  if(/tornado|waterspout/.test(value))return 'Tornados / Wasserhosen';
  if(/lightning|thunder|storm|hail|downburst|supercell/.test(value))return 'Gewitter & Blitze';
  if(/precip|rain|radar/.test(value))return 'Niederschlag / Regen';
  if(/snow|ice|freez/.test(value))return 'Schnee & Eis';
  if(/wind|gust/.test(value))return 'Wind';
  if(/temp/.test(value))return 'Temperatur';
  if(/cloud/.test(value))return 'Wolken';
  if(/pressure/.test(value))return 'Luftdruck';
  if(/uv/.test(value))return 'UV';
  if(/pollen/.test(value))return 'Pollen';
  if(/flood|hydro|river|tsunami/.test(value))return 'Wasser & Hochwasser';
  if(/earthquake|seismic|volcan/.test(value))return 'Erdbeben & Vulkane';
  if(/warning|hazard|alert/.test(value))return 'Warnungen & Gefahren';
  if(/satellite|meteosat|goes|gibs/.test(value))return 'Satellit';
  if(/sun|moon|aurora|space/.test(value))return 'Sonne, Mond & Weltraum';
  if(/biological|wildlife|species|animal|plant/.test(value))return 'Biologische Daten';
  return 'Weitere';
};
const statusLabel=answer=>{
  if(!answer)return 'Keine Antwort';
  if(answer.status==='ready')return 'ready';
  return answer.unavailable?.code||answer.status||'unbekannt';
};

export const installWeatherEngineDiagnostics=defineModule(MODULE_META,()=>({
  _weatherEngineDiagnosticPayload(){
    const store=this.__weatherEngineTraceStore||{items:[]};
    const radar=typeof this._weatherRadarState==='function'?this._weatherRadarState():null;
    const currentLayer=radar?{
      enabled:Boolean(radar.enabled),
      layer_present:Boolean(radar.layer),
      current_provider:radar.lastReady?.answer?.provenance?.provider_name||null,
      current_capability:radar.lastReady?.answer?.capability||'weather.radar.precipitation',
      last_ready_at:radar.lastReady?.at?new Date(radar.lastReady.at).toISOString():null,
      last_unavailable:radar.lastUnavailable||null,
      retained_previous_layer:Boolean(radar.layer&&radar.lastUnavailable),
      timeline_frames:radar.timelineModel?.frames?.length||0,
      timeline_index:Number.isInteger(radar.timelineIndex)?radar.timelineIndex:null,
      timeline_playing:Boolean(radar.timelinePlaying),
      in_flight:Boolean(radar.inFlight),
      pending:Boolean(radar.pending),
      last_request_at:radar.lastRequestAt?new Date(radar.lastRequestAt).toISOString():null,
      last_viewport:radar.lastViewport||null,
      preload_entries:radar.preloadCache?.size||0
    }:null;
    return sanitize({
      schema:'gewitterradar.weather_engine_diagnostic.v1',
      generated_at:new Date().toISOString(),
      application:globalThis.__GEWITTERRADAR_BOOT_DIAGNOSTICS||null,
      discovery:store.lastDiscovery||null,
      capability_catalog:store.lastCatalog||null,
      traces:[...(store.items||[])],
      local:{precipitation_radar:currentLayer}
    });
  },

  _weatherEngineDiagnosticFiltered(){
    const payload=this._weatherEngineDiagnosticPayload();
    const area=this.shadow?.getElementById('weather-engine-diagnostic-area')?.value||'Alle';
    const capability=this.shadow?.getElementById('weather-engine-diagnostic-capability')?.value||'Alle';
    const traces=(payload.traces||[]).filter(item=>{
      if(capability!=='Alle'&&item.capability!==capability)return false;
      if(area!=='Alle'&&capGroup(item.capability)!==area)return false;
      return true;
    });
    return {...payload,filter:{area,capability},traces};
  },

  _weatherEngineDiagnosticEnsureUi(){
    const root=this.shadow;
    if(!root)return;
    const section=root.getElementById('settings-diagnostic-section');
    const content=section?.querySelector('.settings-section-content');
    if(content&&!root.getElementById('settings-weather-engine-diagnostics-toggle')){
      const marker=[...content.children].find(node=>node.textContent?.trim()==='Testfunktionen');
      const row=document.createElement('div');
      row.className='settings-row';
      row.dataset.weatherEngineDiagnostics='true';
      row.innerHTML='<div class="settings-row-label"><div>Weather Engine</div><div style="font-size:.76rem;opacity:.68;margin-top:3px">WeatherRouter-Anfragen, Antworten, Routing, Coverage, Timeline und lokalen Rückfallzustand untersuchen.</div></div><button class="settings-switch" id="settings-weather-engine-diagnostics-toggle" type="button" role="switch" aria-checked="false" aria-label="Weather Engine Diagnose öffnen"></button>';
      if(marker)content.insertBefore(row,marker);else content.append(row);
      row.querySelector('button')?.addEventListener('click',()=>this._weatherEngineDiagnosticOpen());
    }
    if(root.getElementById('weather-engine-diagnostic-backdrop'))return;

    const backdrop=document.createElement('div');
    backdrop.id='weather-engine-diagnostic-backdrop';
    backdrop.setAttribute('aria-hidden','true');
    backdrop.innerHTML=`
      <style>
        #weather-engine-diagnostic-backdrop{position:fixed;inset:0;z-index:2147483645;display:none;align-items:center;justify-content:center;padding:14px;background:rgba(2,6,12,.78);backdrop-filter:blur(8px)}
        #weather-engine-diagnostic-backdrop.open{display:flex}
        .we-diagnostic-dialog{width:min(980px,100%);max-height:calc(100dvh - 24px);display:flex;flex-direction:column;overflow:hidden;border:1px solid rgba(246,195,68,.32);border-radius:20px;background:linear-gradient(180deg,#141b26,#080d14);box-shadow:0 28px 90px rgba(0,0,0,.72);color:var(--b-text)}
        .we-diagnostic-head{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px 14px;border-bottom:1px solid rgba(255,255,255,.08)}
        .we-diagnostic-title{font-weight:860;font-size:17px}.we-diagnostic-sub{font-size:11px;opacity:.64;margin-top:2px}
        .we-diagnostic-close{width:38px;height:38px;border:0;border-radius:9px;background:rgba(255,255,255,.05);color:#fff;font-size:22px;cursor:pointer}
        .we-diagnostic-body{overflow:auto;padding:12px;display:grid;gap:10px}
        .we-diagnostic-filter{display:grid;grid-template-columns:1fr 1fr auto;gap:8px;align-items:end}
        .we-diagnostic-filter label{display:grid;gap:4px;font-size:10px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;opacity:.8}
        .we-diagnostic-filter select,.we-diagnostic-filter button{min-height:38px;border:1px solid rgba(255,255,255,.12);border-radius:9px;background:#101722;color:#e8eef7;padding:7px 9px}
        .we-diagnostic-summary{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
        .we-card{min-width:0;padding:9px 10px;border:1px solid rgba(255,255,255,.08);border-radius:12px;background:rgba(255,255,255,.025)}
        .we-card b{display:block;font-size:10px;color:#f6c344;text-transform:uppercase;letter-spacing:.08em;margin-bottom:5px}.we-card span{font-size:12px;overflow-wrap:anywhere}
        .we-diagnostic-table{width:100%;border-collapse:collapse;font-size:11px}.we-diagnostic-table th,.we-diagnostic-table td{text-align:left;vertical-align:top;padding:6px;border-bottom:1px solid rgba(255,255,255,.07);overflow-wrap:anywhere}.we-diagnostic-table th{color:#f6c344}
        .we-diagnostic-actions{display:flex;gap:7px;flex-wrap:wrap}.we-diagnostic-actions button{min-height:36px;border:1px solid rgba(246,195,68,.24);border-radius:9px;background:rgba(246,195,68,.07);color:#f2dfa5;padding:7px 10px;cursor:pointer}
        .we-diagnostic-raw{margin:0;max-height:300px;overflow:auto;padding:10px;border-radius:10px;background:#05080d;border:1px solid rgba(255,255,255,.07);font-size:10px;white-space:pre-wrap;overflow-wrap:anywhere}
        .we-diagnostic-note{font-size:10px;opacity:.65}
        @media(max-width:720px){.we-diagnostic-filter{grid-template-columns:1fr}.we-diagnostic-summary{grid-template-columns:1fr}.we-diagnostic-table{font-size:10px}}
      </style>
      <section class="we-diagnostic-dialog" role="dialog" aria-modal="true" aria-labelledby="weather-engine-diagnostic-title">
        <div class="we-diagnostic-head">
          <div><div class="we-diagnostic-title" id="weather-engine-diagnostic-title">Weather Engine</div><div class="we-diagnostic-sub">Consumer Request → WeatherRouter → Antwort → lokaler Gewitterradar-Zustand</div></div>
          <button class="we-diagnostic-close" id="weather-engine-diagnostic-close" type="button" aria-label="Weather Engine schließen">×</button>
        </div>
        <div class="we-diagnostic-body">
          <div class="we-diagnostic-filter">
            <label>Bereich<select id="weather-engine-diagnostic-area"><option>Alle</option></select></label>
            <label>Capability<select id="weather-engine-diagnostic-capability"><option>Alle</option></select></label>
            <button id="weather-engine-diagnostic-refresh" type="button">Aktualisieren</button>
          </div>
          <div class="we-diagnostic-summary">
            <div class="we-card"><b>WeatherRouter</b><span id="weather-engine-diagnostic-router">—</span></div>
            <div class="we-card"><b>Letzte WR-Antwort</b><span id="weather-engine-diagnostic-response">—</span></div>
            <div class="we-card"><b>Sichtbarer Layer</b><span id="weather-engine-diagnostic-layer">—</span></div>
          </div>
          <div style="overflow:auto"><table class="we-diagnostic-table"><thead><tr><th>Zeit</th><th>Bereich</th><th>Capability</th><th>Kontext</th><th>WR-Antwort</th><th>Provider</th><th>Dauer</th></tr></thead><tbody id="weather-engine-diagnostic-rows"></tbody></table></div>
          <div class="we-diagnostic-actions"><button id="weather-engine-diagnostic-resolve" type="button">Radar neu auflösen</button><button id="weather-engine-diagnostic-copy" type="button">Diagnose kopieren</button><button id="weather-engine-diagnostic-json" type="button">JSON exportieren</button></div>
          <div class="we-diagnostic-note">Die Filter beeinflussen nur die Diagnoseansicht. Providerwahl und WeatherRouter-Routing werden nicht verändert.</div>
          <details><summary>Rohdaten</summary><pre class="we-diagnostic-raw" id="weather-engine-diagnostic-raw"></pre></details>
        </div>
      </section>`;
    root.append(backdrop);

    const close=()=>this._weatherEngineDiagnosticClose();
    backdrop.addEventListener('click',event=>{if(event.target===backdrop)close();});
    root.getElementById('weather-engine-diagnostic-close')?.addEventListener('click',close);
    root.getElementById('weather-engine-diagnostic-refresh')?.addEventListener('click',()=>this._weatherEngineDiagnosticRefresh({catalog:true}));
    root.getElementById('weather-engine-diagnostic-area')?.addEventListener('change',()=>this._weatherEngineDiagnosticRender());
    root.getElementById('weather-engine-diagnostic-capability')?.addEventListener('change',()=>this._weatherEngineDiagnosticRender());
    root.getElementById('weather-engine-diagnostic-resolve')?.addEventListener('click',async()=>{if(typeof this._refreshWeatherRadar==='function')await this._refreshWeatherRadar({reason:'weather-engine-diagnostic',force:true});this._weatherEngineDiagnosticRender();});
    root.getElementById('weather-engine-diagnostic-copy')?.addEventListener('click',async()=>{
      const data=this._weatherEngineDiagnosticFiltered();
      const last=data.traces?.at(-1);
      const radar=data.local?.precipitation_radar;
      const text=[
        'Gewitterradar · Weather Engine Diagnose',
        'Erzeugt: '+fmtDate(data.generated_at),
        'Filter: '+data.filter.area+' / '+data.filter.capability,
        'Letzte Antwort: '+(last?statusLabel(last.answer):'—'),
        'Capability: '+(last?.capability||'—'),
        'Kontext: '+pretty(last?.context||null),
        'Provider: '+(last?.answer?.provenance?.provider_name||'—'),
        'Sichtbarer Layer: '+(radar?.layer_present?(radar.current_provider||'vorhanden'):'keiner'),
        'Rückfall gehalten: '+(radar?.retained_previous_layer?'ja':'nein'),
        '',
        pretty(data)
      ].join('\n');
      try{await navigator.clipboard.writeText(text);}catch(_error){}
    });
    root.getElementById('weather-engine-diagnostic-json')?.addEventListener('click',()=>{
      const data=this._weatherEngineDiagnosticFiltered();
      const blob=new Blob([pretty(data)],{type:'application/json'});
      const url=URL.createObjectURL(blob),a=document.createElement('a');
      a.href=url;a.download='gewitterradar-weather-engine-'+new Date().toISOString().replace(/[:.]/g,'-')+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    });
  },

  async _weatherEngineDiagnosticRefresh({catalog=false}={}){
    if(catalog&&typeof this._weatherRouterCapabilities==='function'){
      try{await this._weatherRouterCapabilities({refresh:true,filter:{}});}catch(_error){}
    }
    this._weatherEngineDiagnosticRender();
  },

  _weatherEngineDiagnosticRender(){
    this._weatherEngineDiagnosticEnsureUi();
    const root=this.shadow;if(!root)return;
    const store=this.__weatherEngineTraceStore||{items:[]};
    const capabilities=new Set((store.items||[]).map(item=>item.capability).filter(Boolean));
    for(const item of store.lastCatalog?.capabilities||[])if(item?.id)capabilities.add(item.id);
    const groups=[...new Set([...capabilities].map(capGroup))].sort((a,b)=>a.localeCompare(b,'de'));
    const area=root.getElementById('weather-engine-diagnostic-area');
    const capability=root.getElementById('weather-engine-diagnostic-capability');
    if(area){
      const selected=area.value||'Alle';area.replaceChildren(new Option('Alle','Alle'),...groups.map(x=>new Option(x,x)));area.value=[...area.options].some(o=>o.value===selected)?selected:'Alle';
    }
    if(capability){
      const selected=capability.value||'Alle';const areaValue=area?.value||'Alle';
      const caps=[...capabilities].filter(id=>areaValue==='Alle'||capGroup(id)===areaValue).sort();
      capability.replaceChildren(new Option('Alle','Alle'),...caps.map(id=>new Option(id,id)));capability.value=[...capability.options].some(o=>o.value===selected)?selected:'Alle';
    }
    const data=this._weatherEngineDiagnosticFiltered();
    const traces=data.traces||[];
    const last=traces.at(-1)||null;
    const discovery=data.discovery;
    const radar=data.local?.precipitation_radar;

    const router=root.getElementById('weather-engine-diagnostic-router');
    if(router)router.textContent=!discovery?'Noch nicht geprüft':discovery.ready?'bereit · Consumer API V1':discovery.present?'vorhanden, nicht bereit':'nicht erreichbar';
    const response=root.getElementById('weather-engine-diagnostic-response');
    if(response)response.textContent=last?statusLabel(last.answer)+' · '+last.capability:'Noch keine passende Anfrage aufgezeichnet';
    const layer=root.getElementById('weather-engine-diagnostic-layer');
    if(layer)layer.textContent=!radar?'—':radar.layer_present?(radar.current_provider||'Layer vorhanden')+(radar.retained_previous_layer?' · Rückfall/letzten Stand gehalten':' · aktuell'):'kein WeatherRouter-Raster sichtbar';

    const rows=root.getElementById('weather-engine-diagnostic-rows');
    if(rows){
      rows.replaceChildren();
      for(const item of traces.slice(-30).reverse()){
        const tr=document.createElement('tr');
        const provider=item.answer?.provenance?.provider_name||((item.answer?.provenance?.sources||[]).map(x=>x.provider_name).filter(Boolean).join(', ')||'—');
        tr.innerHTML='<td>'+fmtDate(item.completed_at||item.started_at)+'</td><td>'+capGroup(item.capability)+'</td><td>'+String(item.capability||'—')+'</td><td>'+String(item.context?.type||'—')+'</td><td>'+statusLabel(item.answer)+'</td><td>'+String(provider)+'</td><td>'+String(item.duration_ms??'—')+' ms</td>';
        rows.append(tr);
      }
    }
    const raw=root.getElementById('weather-engine-diagnostic-raw');if(raw)raw.textContent=pretty(data);
  },

  _weatherEngineDiagnosticOpen(){
    this._weatherEngineDiagnosticEnsureUi();
    const root=this.shadow,backdrop=root?.getElementById('weather-engine-diagnostic-backdrop'),toggle=root?.getElementById('settings-weather-engine-diagnostics-toggle');
    if(backdrop){backdrop.classList.add('open');backdrop.setAttribute('aria-hidden','false');}
    toggle?.setAttribute('aria-checked','true');
    this._weatherEngineDiagnosticRefresh({catalog:true});
  },

  _weatherEngineDiagnosticClose(){
    const root=this.shadow,backdrop=root?.getElementById('weather-engine-diagnostic-backdrop'),toggle=root?.getElementById('settings-weather-engine-diagnostics-toggle');
    if(backdrop){backdrop.classList.remove('open');backdrop.setAttribute('aria-hidden','true');}
    toggle?.setAttribute('aria-checked','false');
  },

  _mountWeatherEngineDiagnostics(){this._weatherEngineDiagnosticEnsureUi();}
}));
