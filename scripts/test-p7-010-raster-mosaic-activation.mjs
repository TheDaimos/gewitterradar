import assert from "node:assert/strict";
import {promotePreparedRasterMosaic} from "../src/p7-010/raster-mosaic-activation.js";
function make(){
 const callbacks=new Map(),layer={
   removed:false,
   on(name,fn){callbacks.set(name,fn);return this;},
   off(name){callbacks.delete(name);return this;},
   remove(){this.removed=true;return this;},
   fire(name){callbacks.get(name)?.();}
 };
 const map={added:[],addLayer(l){this.added.push(l);}};
 return {map,layer};
}
const good=make();let painted=false,live=true;
const ready=promotePreparedRasterMosaic({
 ...good,hasPainted:()=>painted,isCurrent:()=>live,timeoutMs:500
});
assert.equal(good.map.added.length,1);
good.layer.fire("tileload");
painted=true;good.layer.fire("tileload");
assert.equal(await ready,true);
assert.equal(good.layer.removed,false);

const empty=make();const notReady=promotePreparedRasterMosaic({
 ...empty,hasPainted:()=>false,timeoutMs:500
});
empty.layer.fire("load");
assert.equal(await notReady,false);
assert.equal(empty.layer.removed,true);

const stale=make();const staleRun=promotePreparedRasterMosaic({
 ...stale,hasPainted:()=>true,isCurrent:()=>false,timeoutMs:500
});
stale.layer.fire("tileload");
assert.equal(await staleRun,false);
assert.equal(stale.layer.removed,true);

const broken=make();broken.map.addLayer=()=>{throw Error("map disposed");};
assert.equal(await promotePreparedRasterMosaic({
 ...broken,hasPainted:()=>true,timeoutMs:500
}),false);

const hanging=make();
assert.equal(await promotePreparedRasterMosaic({
 ...hanging,hasPainted:()=>false,timeoutMs:120
}),false);
assert.equal(hanging.layer.removed,true);
assert.throws(()=>promotePreparedRasterMosaic({
 ...good,hasPainted:()=>true,timeoutMs:100000
}));
console.log("P7-010 bounded, painted-tile-only V2 promotion and V1 retention PASS");
