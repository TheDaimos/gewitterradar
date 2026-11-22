import assert from 'node:assert/strict';
import {normalizeEyeConfig,eyeAuraRings,eyeBubbleLayout,eyeRingRadius} from '../frontend/modules/weather/eye-hub-model.js';
import {EYE_HUB_TRANSLATIONS} from '../frontend/modules/weather/eye-hub-locales.js';

const ids=Array.from({length:12},(_,i)=>'test-'+i);
for(let count=0;count<=8;count++){
 const slots=Array.from({length:8},(_,i)=>i<count?ids[i]:null);
 const c=normalizeEyeConfig({grouped:true,auraLayout:'dynamic',slots},ids);
 const statuses=Object.fromEntries(ids.map(id=>[id,{active:true,available:true}]));
 assert.deepEqual(eyeAuraRings(c,statuses).map(r=>r.visualIndex),Array.from({length:count},(_,i)=>i));
 const input=JSON.stringify(c);
 if(count){statuses[ids[0]].active=false;assert.equal(eyeAuraRings(c,statuses).length,count-1);assert.equal(c.slots[0].functionId,ids[0]);}
 assert.equal(JSON.stringify(c),input,'projection never changes saved configuration');
}
const slots=[ids[0],null,ids[2],null,ids[4],ids[5],null,ids[7]];
const statuses=Object.fromEntries(ids.map(id=>[id,{active:true,available:true}]));
let c=normalizeEyeConfig({grouped:true,slots,auraLayout:'dynamic',bubbleAura:{[ids[2]]:false},colors:{[ids[7]]:'none'}},ids);
assert.deepEqual(eyeAuraRings(c,statuses).map(r=>[r.index,r.visualIndex]),[[0,0],[4,1],[5,2]]);
c=normalizeEyeConfig({...c,auraLayout:'fixed'},ids);
assert.deepEqual(eyeAuraRings(c,statuses).map(r=>r.visualIndex),[0,4,5]);
assert.equal(normalizeEyeConfig({slots},ids).auraLayout,'fixed','legacy default preserved');
assert.equal(normalizeEyeConfig({...c,auraLayout:'invalid'},ids).auraLayout,'fixed');
assert.deepEqual(normalizeEyeConfig(JSON.parse(JSON.stringify(c)),ids),c);
assert.equal(normalizeEyeConfig({slots:ids},ids).slots.length,12,'future storage capacity');
assert.equal(eyeAuraRings({...c,grouped:false},statuses).length,0);
assert.equal(eyeAuraRings({...c,aura:false},statuses).length,0);
for(const [width,height] of [[393,851],[851,393],[1280,900]])for(const size of [42,126])for(const icon of [25,100,300])for(const count of [1,2,3,4,5,6,7,8,12])for(const [x,y] of [[0,0],[1,0],[0,1],[1,1],[.5,0],[.5,1],[0,.5],[1,.5],[.5,.5]]){
 const half=Math.max(50,icon/2)/2,bounds={left:0,top:0,right:width,bottom:height};
 const obstacles=[{left:width/2-50,right:width/2+50,top:10,bottom:64}];
 const points=eyeBubbleLayout(count,{x:size/2+x*(width-size),y:size/2+y*(height-size)},bounds,obstacles,size,icon,{gap:30,balanced:true});
 for(const [i,p] of points.entries()){
  assert(p.x-half>=9&&p.x+half<=width-9&&p.y-half>=9&&p.y+half<=height-9);
  for(const q of points.slice(i+1))assert(Math.abs(p.x-q.x)>=half*2+9||Math.abs(p.y-q.y)>=half*2+9);
  for(const o of obstacles)assert(p.x+half<=o.left||p.x-half>=o.right||p.y+half<=o.top||p.y-half>=o.bottom);
 }
}
assert(eyeRingRadius(42,1,30,8)>eyeRingRadius(42,1));
assert.equal(Object.keys(EYE_HUB_TRANSLATIONS).length,19);
for(const [language,copy] of Object.entries(EYE_HUB_TRANSLATIONS))for(const key of ['auraLayout','auraLayout_fixed','auraLayout_dynamic'])assert(copy[key],language+' '+key);
console.log('PASS V4.12: compact ring projection, sparse slots, activity/visibility isolation, legacy profiles, 12-slot storage, 1458 geometry combinations and 19 locales');
