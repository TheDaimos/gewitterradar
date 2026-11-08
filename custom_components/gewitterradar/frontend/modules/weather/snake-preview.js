// Shared by the offline configurator and the integrated Studio. Synthetic only.
import {SnakeCanvas} from './snake-canvas.js?v=411162r1';
import {normalizeSnakeConfig} from './snake-config.js?v=411162r1';
import {windMercatorY,windMercatorLatitude} from './wind-canvas.js?v=411162r1';
import {prepareWindFieldLookup} from './wind-field.js?v=411162r1';
export const SNAKE_SCENARIOS=Object.freeze({weak:'A · Schwacher Wind',gradient:'B · Zunehmender und abnehmender Wind',vortex:'C · Rotierendes Windfeld'});
export function makeSnakePreviewField(kind){
 if(!Object.hasOwn(SNAKE_SCENARIOS,kind))throw Error('Unbekanntes Vorschau-Szenario');
 const x=Array.from({length:97},(_,i)=>-6+i/8),y=Array.from({length:81},(_,i)=>-5+i/8),u=[],v=[],valid_mask=[];
 for(const lat of y)for(const lon of x){const my=windMercatorY(lat);if(kind==='weak'){u.push(1.4);v.push(.1);}else if(kind==='gradient'){u.push(1+38*Math.exp(-lon*lon/1.7));v.push(.6*Math.sin(my));}else{const factor=8*(1+.6*Math.sin(Math.atan2(my,lon)));u.push(-my*factor);v.push(lon*factor);}valid_mask.push(1);}
 const field={id:'studio-'+kind,deadline:Infinity,hasMotion:true,model_run:'synthetic-'+kind,valid_at:'synthetic',unit:'m/s',height_m:10,provenance:{provider_id:'synthetic-preview'},grid:{crs:'EPSG:4326',longitudes:x,latitudes:y,u:Float32Array.from(u),v:Float32Array.from(v),valid_mask:Uint8Array.from(valid_mask),cyclic:false}};
 prepareWindFieldLookup(field);return field;
}
export class SnakePreview{
 constructor(host,{parameters,canvas=null,color='#ffffff',onMetrics=()=>{}}={}){
  Object.assign(this,{host,color,onMetrics});this.parameters=normalizeSnakeConfig(parameters);this.scenario='weak';this.started=true;this.paused=false;this.visible=true;this.explicit=false;this.handlers=new Map();
  this.map={options:{crs:{code:'EPSG:3857'}},getZoom:()=>3,getSize:()=>({x:Math.max(1,host.clientWidth),y:Math.max(1,host.clientHeight)}),containerPointToLatLng:([x,y])=>{const s=this.map.getSize();return {lng:-4+x/s.x*8,lat:windMercatorLatitude(3-y/s.y*6)};},getBounds:()=>({getWest:()=>-4,getEast:()=>4,getSouth:()=>-3,getNorth:()=>3}),on:(names,fn)=>{for(const name of names.split(' ')){if(!this.handlers.has(name))this.handlers.set(name,new Set());this.handlers.get(name).add(fn);}},off:(names,fn)=>{for(const name of names.split(' '))this.handlers.get(name)?.delete(fn);}};
  this.canvas=canvas||document.createElement('canvas');if(!canvas)host.append(this.canvas);this.canvas.style.cssText='position:absolute;inset:0;pointer-events:none';this.canvas.setAttribute('aria-label','Synthetische Winddesign-Vorschau');
  this.field=makeSnakePreviewField(this.scenario);this.renderer=new SnakeCanvas(this.map,this.canvas,{onMetrics});this.resize=new ResizeObserver(()=>{for(const fn of this.handlers.get('resize')||[])fn();if(!this.visible||!this.started)this.renderer.stop();});this.resize.observe(host);this.update();
 }
 update(){this.renderer.update(this.field,{visible:this.visible&&this.started,enabled:true,paused:this.paused,animationExplicit:this.explicit,symbolColor:this.color,snake:this.parameters});if(!this.visible||!this.started)this.renderer.stop();}
 setParameters(parameters){this.parameters=normalizeSnakeConfig(parameters);this.update();}
 setColor(color){this.color=color;this.update();}
 setScenario(kind){this.field=makeSnakePreviewField(kind);this.scenario=kind;this.update();}
 setVisible(visible){this.visible=visible;this.update();}
 start(){this.started=true;this.explicit=true;this.update();}
 stop(){this.started=false;this.update();}
 pause(paused){this.paused=paused;this.update();}
 restart(){this.started=true;this.explicit=true;this.renderer.destroy();this.canvas=document.createElement('canvas');this.canvas.style.cssText='position:absolute;inset:0;pointer-events:none';this.canvas.setAttribute('aria-label','Synthetische Winddesign-Vorschau');this.host.append(this.canvas);this.renderer=new SnakeCanvas(this.map,this.canvas,{onMetrics:this.onMetrics});this.update();}
 destroy(){this.resize.disconnect();this.renderer.destroy();this.handlers.clear();}
}
