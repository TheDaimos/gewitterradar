/* Synthetic authenticated transport; the entire actual card/module tree/Leaflet is used. */
const {fixture}=require('./wind-perf-browser-fixture.cjs');
function temperatureFixture(){return fixture({extendHtml:html=>html.replace('window.cleanSource=weatherSourceText;',`window.cleanSource=weatherSourceText;
 window.temperatureRequests=[];window.temperatureTransport={mode:'ready',sequence:0,delay:0};window.temperaturePending=[];
 window.temperatureReply=query=>{
 const o=temperatureTransport,b=query.context.bbox,nx=65,ny=49,world=b.east-b.west>=360;
 const longitudes=Array.from({length:nx},(_,i)=>b.west+i*(b.east-b.west)/(nx-1)),latitudes=Array.from({length:ny},(_,i)=>b.south+i*(b.north-b.south)/(ny-1)),values=[],u=[],v=[],rate=[],valid_mask=[];
 for(const lat of latitudes)for(let col=0;col<nx;col++){const lon=world&&col===nx-1?longitudes[0]:longitudes[col];values.push(273.15+12+22*Math.cos(lat*Math.PI/180)+4*Math.sin(lon*Math.PI/180));u.push(10);v.push(3);rate.push(.6*Math.sin(lon*Math.PI/40));valid_mask.push(o.mode==='hole'&&Math.abs(lat-48)<2&&Math.abs(lon-8)<2?0:1);}
 const base={crs:'EPSG:4326',layout:'row_major_south_first',longitudes,latitudes,cyclic:world,valid_mask},until=new Date(Date.now()+600000).toISOString(),time='2026-11-07T18:00:00Z',run='2026-11-07T12:00:00Z';
 return {schema:'weather_router.consumer.temperature_field.v2',contract_version:2,capability:query.capability,status:'ready',frame:{id:'temperature-'+(++o.sequence),capability:query.capability,unit:'K',height_m:2,kind:'model_forecast',model:'Synthetic GFS',model_run:run,valid_at:time,valid_until:until,refresh_after_seconds:300,native_resolution_degrees:.25,provenance:{provider_id:'synthetic',attribution:'Synthetic temperature browser fixture'},coverage:b,temperature_range_kelvin:{min:Math.min(...values),max:Math.max(...values)},grid:{...base,values},advection:query.include_advection&&o.mode!=='no_advection'?{status:'ready',capability:'weather.temperature.advection_850hpa',level:{type:'isobaric',value:850,unit:'hPa'},unit:'K/h',model_run:run,valid_at:time,valid_until:until,grid:{...base,u,v,rate}}:{status:'unavailable',unavailable:{code:query.include_advection?'temperature_incoherent_levels':'not_requested'}}}};
 };`).replace('requests.push(structuredClone(query));',`requests.push(structuredClone(query));
 if(query.type==='weather_router/consumer/resolve_temperature_field'){
  temperatureRequests.push(structuredClone(query));const mode=temperatureTransport.mode;
  if(mode==='defer')await new Promise(resolve=>temperaturePending.push(resolve));
  if(temperatureTransport.delay)await new Promise(resolve=>setTimeout(resolve,temperatureTransport.delay));
  if(mode==='failure')throw Error('temperature_synthetic_transport');
  if(mode==='denied')return {status:'unavailable',unavailable:{code:'provider_disabled'}};
  return temperatureReply(query);
 }`)});}
module.exports={temperatureFixture};
