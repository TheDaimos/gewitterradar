import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';

const original=await readFile('frontend/modules/map/clusters-recent.js','utf8');
assert.match(original, /_syncClusterBubbleMarkers\(stableClusters,L\)/);
assert.doesNotMatch(original, /this\._markerLayer\.clearLayers\(\)/);
assert.doesNotMatch(original, /L\.marker\(\[cluster\.lat,cluster\.lon\],\{ icon,interactive:false \}\)\.addTo\(this\._markerLayer\)/);
const adapted=original.replace(/^import[^\n]*\n/, 'const defineModule=(meta,factory)=>(CardClass,deps)=>{Object.defineProperties(CardClass.prototype,Object.getOwnPropertyDescriptors(factory(deps)));};\n');
const mod=await import('data:text/javascript;base64,'+Buffer.from(adapted).toString('base64'));
class Card{}
mod.installClustersRecent(Card,{});

let created=0, removed=0, cleared=0, detached=0;
const L={
  layerGroup(){const layers=new Set();return {
    addTo(map){this._map=map;return this;},
    addLayer(marker){layers.add(marker);return this;},
    removeLayer(marker){assert.ok(layers.delete(marker));removed+=1;return this;},
    clearLayers(){cleared+=1;layers.clear();},
    remove(){detached+=1;layers.clear();},
    get size(){return layers.size;}
  };},
  divIcon(options){return options;},
  marker(point,{icon}){created+=1;
    let pos={lat:point[0],lng:point[1]};
    const bubble={className:'cluster-bubble',textContent:'',style:{setProperty(name,value){this[name]=value;}}};
    const element={style:{},querySelector(selector){return selector==='.cluster-bubble'?bubble:null;}};
    return {icon,addTo(group){group.addLayer(this);return this;},getLatLng(){return pos;},
      setLatLng(next){pos={lat:next[0],lng:next[1]};this.moved=(this.moved||0)+1;},
      setIcon(next){this.icon=next;this.replaced=(this.replaced||0)+1;},
      getElement(){return element;},bubble,element};
  }
};
const mkMap=()=>({getZoom:()=>7,project(point){const x=Array.isArray(point)?point[1]:point.lng;const y=Array.isArray(point)?point[0]:point.lat;return{x:x*1000,y:y*1000};}});
const app=new Card();app._map=mkMap();app._markerLayer=L.layerGroup().addTo(app._map);
const clusters=[
{id:'cluster-1',lat:50,lon:10,count:7,size:35,color:'#e5aa34',active:true,extreme:false},
{id:'cluster-2',lat:51,lon:11,count:12,size:40,color:'#ee34bc',active:false,extreme:true},
];
app._syncClusterBubbleMarkers(clusters,L);
assert.equal(created,2);assert.equal(app._clusterBubbleLayer.size,2);
const first=app._clusterBubbleMarkers.get('cluster-1').marker;
const second=app._clusterBubbleMarkers.get('cluster-2').marker;
for(let i=0;i<30;i++)app._syncClusterBubbleMarkers(clusters,L);
assert.equal(created,2,'Unchanged clusters must never be recreated');
assert.equal(removed,0,'Unchanged clusters must never be removed');
assert.equal(cleared,0,'Cluster layer must never be cleared during normal refresh');
assert.equal(first.replaced||0,0);
app._syncClusterBubbleMarkers([{...clusters[0],count:8,size:36},clusters[1]],L);
assert.equal(created,2);
assert.strictEqual(app._clusterBubbleMarkers.get('cluster-1').marker,first);
assert.equal(first.bubble.textContent,'8');
assert.equal(first.element.style.width,'36px');
assert.equal(first.replaced||0,0,'Count and size must update in place');
app._syncClusterBubbleMarkers([clusters[1]],L);
assert.equal(removed,1);assert.strictEqual(app._clusterBubbleMarkers.get('cluster-2').marker,second);
assert.equal(app._clusterBubbleLayer.size,1);
app._syncClusterBubbleMarkers([clusters[1],{...clusters[0],id:'cluster-3'}],L);
assert.equal(created,3);assert.equal(app._clusterBubbleLayer.size,2);
app._map=mkMap();app._syncClusterBubbleMarkers([clusters[1]],L);
assert.equal(detached,1,'Replacing the map must detach previous bubble layer');
assert.equal(app._clusterBubbleLayer.size,1);
assert.equal(created,4);
console.log('PASS: stable cluster bubbles survive repeated HA refresh, in-place changes, removals and map recreation.');
