/* Same full-card/Leaflet workload before and after optimization. No real device claims. */
const {chromium}=require(process.env.PLAYWRIGHT_MODULE||'playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),os=require('node:os'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..'),out=process.env.WIND_PERF_OUTPUT||path.join(os.tmpdir(),'wind-perf01-benchmark');fs.mkdirSync(out,{recursive:true});
const ref=process.env.WIND_PERF_REF,cache=new Map(),read=name=>{
 if(ref){if(!cache.has(name))cache.set(name,cp.execFileSync('git',['show',ref+':'+name],{cwd:root,maxBuffer:30*1024*1024}));return cache.get(name);}
 return fs.readFileSync(path.join(root,name));
};
const baseline=fs.readFileSync(path.join(__dirname,'test-gr-wind-fix-01-browser.cjs'),'utf8');
let html=baseline.match(/const html=String.raw`([\s\S]*?)`;\r?\nconst server=/)[1];
html=html.replace('requests.push(structuredClone(query));',`requests.push(structuredClone(query));
 if(query.type==='weather_router/consumer/resolve_wind_field'){
  const latitudes=Array.from({length:91},(_,i)=>-90+i*2),longitudes=Array.from({length:161},(_,i)=>-180+i*2.25),u=[],v=[],valid_mask=[];
  for(const lat of latitudes)for(const lon of longitudes){u.push(9+5*Math.sin(lat*Math.PI/60)+2*Math.cos(lon*Math.PI/180));v.push(3*Math.cos(lon*Math.PI/180)+4*Math.sin(lat*Math.PI/90));valid_mask.push(1);}
  return {schema:'weather_router.consumer.wind_field.v2',contract_version:2,capability:query.capability,status:'ready',frame:{id:'benchmark-fixed-numeric-field',capability:query.capability,unit:'m/s',height_m:10,kind:'model_forecast',model:'Synthetic benchmark only',model_run:'2026-11-07T00:00:00Z',valid_at:'2026-11-07T06:00:00Z',valid_until:new Date(Date.now()+600000).toISOString(),refresh_after_seconds:300,native_resolution_degrees:.25,provenance:{provider_id:'synthetic',attribution:'Synthetic benchmark'},coverage:{west:-180,east:180,south:-90,north:90},grid:{crs:'EPSG:4326',layout:'row_major_south_first',latitudes,longitudes,u,v,valid_mask,cyclic:true}}};
 }`);
const leaflet=process.env.LEAFLET_JS||require.resolve('leaflet/dist/leaflet.js'),leafletCss=process.env.LEAFLET_CSS||require.resolve('leaflet/dist/leaflet.css');
const server=http.createServer((req,res)=>{try{
 const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 if(name==='/'){res.setHeader('Content-Type','text/html;charset=utf-8');return res.end(html);}
 if(name==='/leaflet.js'){res.setHeader('Content-Type','text/javascript');return res.end(fs.readFileSync(leaflet));}
 if(!name.startsWith('/frontend/')||name.includes('..')){res.writeHead(404);return res.end();}
 res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript':'application/octet-stream');res.end(read(name.slice(1)));
 }catch(_){res.writeHead(404);res.end();}});
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
 try{const results=[];
 for(const [name,width,height,throttle] of [['android-cpu6',393,851,6],['desktop',1280,850,1]]){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1,hasTouch:name.startsWith('android'),isMobile:name.startsWith('android')}),page=await context.newPage();
  await page.addInitScript(()=>{let state=19619;Math.random=()=>{state=(Math.imul(state,1664525)+1013904223)>>>0;return state/4294967296;};});
  await page.route('**/*',route=>{const url=route.request().url();if(url.includes('leaflet.css')&&!url.startsWith('http://127.0.0.1'))return route.fulfill({contentType:'text/css',body:fs.readFileSync(leafletCss)});if(!url.startsWith('http://127.0.0.1'))return route.fulfill({status:204,body:''});return route.continue();});
  await page.goto('http://127.0.0.1:'+server.address().port);await page.waitForFunction(()=>window.ready&&card._map);
  const cdp=await context.newCDPSession(page);await cdp.send('Performance.enable');await cdp.send('Emulation.setCPUThrottlingRate',{rate:throttle});
  await page.evaluate(()=>{card._setMapDisplayMode('fullscreen',{persist:false});card._map.setView([48,8],4,{animate:false});card._weatherWindSet({enabled:true,mode:'animated',animationExplicit:true,density:'high',tempo:'normal',color:'white',colorField:true,fieldOpacity:65});const p=card._weatherWindState().painter,original=p.paintField;p.paintField=function(size){const start=performance.now(),before=this.fieldRenders;original.call(this,size);if(this.fieldRenders>before)this.benchmarkInitialColorMs=performance.now()-start;};});
  await page.waitForFunction(()=>card._weatherWindState().field&&card._weatherWindState().painter?.draws>15);await page.waitForTimeout(1000);
  await page.evaluate(()=>{
   const p=card._weatherWindState().painter;Object.defineProperty(p,'quality',{get:()=>1,set:()=>{}});
   const original=p.paint;p.paint=function(t){const start=performance.now();original.call(this,t);if(window.collect){samples.push(performance.now()-start);timestamps.push(t);particles.push(this.particles.length);}};
   window.samples=[];window.timestamps=[];window.particles=[];window.collect=true;
  });
  await cdp.send('HeapProfiler.collectGarbage');const requestStart=await page.evaluate(()=>requests.length),before=await cdp.send('Performance.getMetrics');await page.waitForTimeout(Number(process.env.WIND_PERF_DURATION_MS)||12000);const after=await cdp.send('Performance.getMetrics');
  const measured=await page.evaluate(()=>{window.collect=false;const sorted=[...samples].sort((a,b)=>a-b),p=card._weatherWindState().painter;return {frames:samples.length,fps:(timestamps.length-1)*1000/(timestamps.at(-1)-timestamps[0]),meanMs:samples.reduce((a,b)=>a+b,0)/samples.length,p50Ms:sorted[Math.floor(sorted.length*.5)],p95Ms:sorted[Math.floor(sorted.length*.95)],maxMs:sorted.at(-1),minParticles:Math.min(...particles),maxParticles:Math.max(...particles),fieldNodes:card._weatherWindState().field.grid.u.length,requests:requests.length,fieldRenders:p.fieldRenders,colorPreparationCpuMs:p.colorCpuMs||p.benchmarkInitialColorMs,colorPreparationWallMs:p.colorWallMs||p.benchmarkInitialColorMs};});measured.requestsDuringMeasurement=measured.requests-requestStart;
  const metric=(m,n)=>m.metrics.find(x=>x.name===n)?.value;
  measured.scriptSeconds=metric(after,'ScriptDuration')-metric(before,'ScriptDuration');measured.taskSeconds=metric(after,'TaskDuration')-metric(before,'TaskDuration');measured.heapBefore=metric(before,'JSHeapUsedSize');measured.heapAfter=metric(after,'JSHeapUsedSize');
  const counters=await page.evaluate(async()=>{
   const p=card._weatherWindState().painter,m=card._map,counts={project:0,unproject:0,stroke:0,save:0,frames:0},original=[];
   for(const [object,key,target] of [[m,'latLngToContainerPoint','project'],[m,'containerPointToLatLng','unproject'],[p.ctx,'stroke','stroke'],[p.ctx,'save','save']]){const fn=object[key];object[key]=function(...args){counts[target]++;return fn.apply(this,args);};original.push(()=>object[key]=fn);}
   const before=p.draws;await new Promise(r=>setTimeout(r,1200));counts.frames=p.draws-before;original.forEach(f=>f());return counts;
  });
  results.push({name,width,height,cpuThrottle:throttle,reference:ref||'working_tree',fixedDensityControl:true,physicalDeviceMeasurement:false,...measured,operationsPerFrame:Object.fromEntries(Object.entries(counters).filter(([k])=>k!=='frames').map(([k,v])=>[k,v/counters.frames]))});
  console.log(JSON.stringify(results.at(-1)));await context.close();
 }
 fs.writeFileSync(path.join(out,(ref?'before':'after')+'.json'),JSON.stringify(results,null,2));
 }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
