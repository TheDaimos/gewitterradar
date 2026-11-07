/* Test-only transport around the actual registered card and Leaflet. */
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),cp=require('node:child_process');
const root=path.resolve(__dirname,'..');
function fixture({ref=null,scope='bbox'}={}){
 const files=new Map(),read=name=>{if(ref){if(!files.has(name))files.set(name,cp.execFileSync('git',['show',ref+':'+name],{cwd:root,maxBuffer:30*1024*1024}));return files.get(name);}return fs.readFileSync(path.join(root,name));};
 const source=fs.readFileSync(path.join(__dirname,'test-gr-wind-fix-01-browser.cjs'),'utf8');let html=source.match(/const html=String.raw`([\s\S]*?)`;\r?\nconst server=/)[1];
 const revision=read('frontend/version.js').toString().match(/runtimeRevision:"([^"]+)"/)[1];html=html.replace('module-manifest.js?v=411150r1','module-manifest.js?v='+revision);
 html=html.replace('window.cleanSource=weatherSourceText;',`window.cleanSource=weatherSourceText;
 window.windTransport={scope:${JSON.stringify(scope)},delay:0,mode:'ready',model:'Synthetic field',run:'2026-11-07T06:00:00Z',validAt:'2026-11-07T12:00:00Z',provider:'synthetic',sequence:0};window.windRequests=[];window.windPending=[];
 const makeWindField=(query,options)=>{
  const b=options.scope==='world'?{west:-180,east:180,south:-90,north:90}:query.context.bbox,nx=options.scope==='world'?161:49,ny=options.scope==='world'?91:37;
  const latitudes=Array.from({length:ny},(_,i)=>b.south+i*(b.north-b.south)/(ny-1)),longitudes=Array.from({length:nx},(_,i)=>b.west+i*(b.east-b.west)/(nx-1)),u=[],v=[],valid_mask=[];
  for(const lat of latitudes)for(const lon of longitudes){u.push(9+5*Math.sin(lat*Math.PI/60)+2*Math.cos(lon*Math.PI/180));v.push(3*Math.cos(lon*Math.PI/180)+4*Math.sin(lat*Math.PI/90));valid_mask.push(options.mode==='hole'&&Math.abs(lat-48)<2&&Math.abs(lon-8)<2?0:1);}
  return {schema:'weather_router.consumer.wind_field.v2',contract_version:2,capability:query.capability,status:'ready',frame:{id:'synthetic-'+options.sequence+'-'+JSON.stringify(b),capability:query.capability,unit:'m/s',height_m:10,kind:'model_forecast',model:options.model,model_run:options.run,valid_at:options.validAt,valid_until:new Date(Date.now()+600000).toISOString(),refresh_after_seconds:300,native_resolution_degrees:.25,delivery_diagnostics:{cache:'coverage',cache_hits:2,cache_entries:1,cache_limit:6},provenance:{provider_id:options.provider,attribution:'Synthetic browser test'},coverage:b,grid:{crs:'EPSG:4326',layout:'row_major_south_first',latitudes,longitudes,u,v,valid_mask,cyclic:b.east-b.west>=360}}};
 };`);
 html=html.replace('requests.push(structuredClone(query));',`requests.push(structuredClone(query));
 if(query.type==='weather_router/consumer/resolve_wind_field'){
  const options={...windTransport,sequence:++windTransport.sequence};windRequests.push(structuredClone(query));
  if(options.mode==='defer')await new Promise(resolve=>windPending.push(resolve));if(options.delay)await new Promise(resolve=>setTimeout(resolve,options.delay));
  if(options.mode==='failure')throw new Error('Synthetic delayed wind transport failure');
  if(options.mode==='unavailable'||options.mode==='denied')return {schema:'weather_router.consumer.wind_field.v2',contract_version:2,capability:query.capability,status:'unavailable',unavailable:{code:options.mode==='denied'?'provider_disabled':'source_unavailable'}};
  return makeWindField(query,options);
 }`);
 const leaflet=process.env.LEAFLET_JS||require.resolve('leaflet/dist/leaflet.js'),leafletCss=process.env.LEAFLET_CSS||require.resolve('leaflet/dist/leaflet.css');
 const server=http.createServer((req,res)=>{try{const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname);if(name==='/'){res.setHeader('Content-Type','text/html;charset=utf-8');return res.end(html);}if(name==='/leaflet.js'){res.setHeader('Content-Type','text/javascript');return res.end(fs.readFileSync(leaflet));}if(!name.startsWith('/frontend/')||name.includes('..')){res.writeHead(404);return res.end();}res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript':'application/octet-stream');res.end(read(name.slice(1)));}catch(_){res.writeHead(404);res.end();}});
 return {server,leafletCss,async route(page){await page.route('**/*',route=>{const url=route.request().url();if(url.includes('leaflet.css')&&!url.startsWith('http://127.0.0.1'))return route.fulfill({contentType:'text/css',body:fs.readFileSync(leafletCss)});if(!url.startsWith('http://127.0.0.1'))return route.fulfill({status:204,body:''});return route.continue();});}};
}
module.exports={fixture};
