import test from 'node:test';
import assert from 'node:assert/strict';
import {rasterTilePixelCrops} from '../frontend/modules/weather/p7-010/raster-tile-clip.js';

const bbox=(west,south,east,north)=>({scope:'bbox',verified:true,bbox:{west,south,east,north}});

test('WL-02 region is pixel-clipped rather than full tile',()=>{
  const crops=rasterTilePixelCrops({x:0,y:0,z:0},bbox(5,47,16,56),256);
  assert.ok(crops.length>=1);
  assert.ok(crops.every(r=>r.sw>0&&r.sh>0&&r.sw<256&&r.sh<256));
});
test('WL-02 outside coverage yields transparent image region',()=>{
  assert.deepEqual(rasterTilePixelCrops({x:0,y:0,z:2},bbox(5,47,16,56),256),[]);
});
test('WL-02 global verified coverage draws full tile',()=>{
  assert.deepEqual(rasterTilePixelCrops({x:0,y:0,z:1},{scope:'global',verified:true},256),
    [{sx:0,sy:0,sw:256,sh:256}]);
});
test('WL-02 antimeridian splits pixel regions',()=>{
  const crops=rasterTilePixelCrops({x:0,y:0,z:0},bbox(170,-20,-170,20),256);
  assert.equal(crops.length,2);
  assert.ok(crops.every(r=>r.sw>0&&r.sw<256));
});
test('WL-02 unverified region is never drawn',()=>{
  assert.deepEqual(rasterTilePixelCrops({x:0,y:0,z:0},{scope:'global'},256),[]);
});
