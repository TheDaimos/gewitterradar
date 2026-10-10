import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const original=await readFile('frontend/modules/map/clusters-recent.js','utf8');
assert.doesNotMatch(original,/this\._markerLayer\.clearLayers\(\)/);
assert.match(original,/_syncIndividualStrikeMarkers\(individual,L,now,dangerRadius\)/);
assert.match(original,/_syncIndividualStrikeMarkers\(\[\],L,now,dangerRadius\)/);
const adapted=original.replace(/^import[^\n]*\n/,'const defineModule=(meta,factory)=>(CardClass,deps)=>{Object.defineProperties(CardClass.prototype,Object.getOwnPropertyDescriptors(factory(deps)));};\n');
const mod=await import('data:text/javascript;base64,'+Buffer.from(adapted).toString('base64'));
class Card {}
mod.installClustersRecent(Card,{C:{danger:'#f34',gold:'#e9b',blue:'#39f'},ACTIVE_MINUTES:10});
let created=0,removed=0,cleared=0,replaced=0;
const L={
  divIcon(x){return x;},
  layerGroup(){const set=new Set();return {
    addTo(){return this;},
    addLayer(x){set.add(x);return this;},
    removeLayer(x){assert.ok(set.delete(x));removed++;return this;},
    clearLayers(){cleared++;set.clear();return this;},
    get size(){return set.size;}
  };},
  marker(coords,{icon}){
    created++;
    const spark={className:'strike-spark danger',textContent:'✦',style:{setProperty(n,v){this[n]=v;}}};
    const element={querySelector(n){return n==='.strike-spark'?spark:null;}};
    return {icon,position:coords,addTo(g){g.addLayer(this);return this;},
      setLatLng(v){this.position=v;},
      setIcon(v){replaced++;this.icon=v;},
      getElement(){return element;},spark};
  }
};
const app=new Card();app._map={};app._markerLayer=L.layerGroup().addTo(app._map);
const now=Date.now();
const strikes=[
  {id:'geo_location.lightning_strike_001',lat:38.1,lon:15.3,firstSeen:now-2000,distance:10},
  {id:'geo_location.lightning_strike_002',lat:38.2,lon:15.4,firstSeen:now-2000,distance:15}
];
app._syncIndividualStrikeMarkers(strikes,L,now,30);
assert.equal(created,2);assert.equal(app._markerLayer.size,2);
const first=app._individualMarkerRecords.get(strikes[0].id).marker;
for(let i=0;i<60;i++)app._syncIndividualStrikeMarkers(strikes,L,now+i*100,30);
assert.equal(created,2,'60 HA refreshes must preserve individual marker DOM nodes');
assert.equal(removed,0);assert.equal(cleared,0);assert.equal(replaced,0);
assert.strictEqual(app._individualMarkerRecords.get(strikes[0].id).marker,first);
app._syncIndividualStrikeMarkers([{...strikes[0],lat:38.15,distance:35},strikes[1]],L,now,30);
assert.equal(first.position[0],38.15);
assert.equal(first.spark.className,'strike-spark');
assert.equal(first.spark.textContent,'+');
assert.equal(first.spark.style['--strike-color'],'#e9b');
assert.equal(replaced,0,'Status changes must update icon contents without replacing marker');
app._syncIndividualStrikeMarkers([{...strikes[0],lat:38.15,distance:35},strikes[1]],L,now+12*60_000,30);
assert.equal(first.spark.style['--strike-color'],'#39f');
assert.equal(created,2);
app._syncIndividualStrikeMarkers([strikes[0]],L,now,30);
assert.equal(removed,1);assert.equal(app._markerLayer.size,1);
app._syncIndividualStrikeMarkers([],L,now,30);
assert.equal(removed,2);assert.equal(app._markerLayer.size,0);
app._syncIndividualStrikeMarkers(strikes,L,now,30);
assert.equal(created,4);
app._map={};app._markerLayer=L.layerGroup().addTo(app._map);
app._syncIndividualStrikeMarkers([strikes[0]],L,now,30);
assert.equal(created,5);assert.equal(app._markerLayer.size,1);
assert.equal(cleared,0,'No bulk clear during refresh, mode switch, or new map');
console.log('PASS: stable individual danger lightning markers across 60 updates; updates, removals, and map changes are selective.');
