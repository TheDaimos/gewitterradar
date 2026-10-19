import test from 'node:test';
import assert from 'node:assert/strict';
import {parseGenericRasterCoverage} from '../frontend/modules/weather/layer-menu.js';

test('WL-02 accepts WR native bbox-object coverage',()=>{
  assert.deepEqual(parseGenericRasterCoverage({spatial_coverage:{scope:'bbox',bbox:{west:5,south:47,east:16,north:56}}}),
    {scope:'bbox',west:5,south:47,east:16,north:56,antimeridian:false});
});
test('WL-02 retains global scope without inventing extent',()=>{
  assert.deepEqual(parseGenericRasterCoverage({spatial_coverage:{scope:'global'}}),{scope:'global'});
});
test('WL-02 identifies antimeridian crossing',()=>{
  assert.deepEqual(parseGenericRasterCoverage({spatial_coverage:{scope:'bbox',bbox:{west:170,south:-20,east:-170,north:20}}}),
    {scope:'bbox',west:170,south:-20,east:-170,north:20,antimeridian:true});
});
test('WL-02 rejects missing, unsupported and malformed coverage',()=>{
  for(const coverage of [null,{}, {scope:'bbox',bbox:[5,47,16,56]}, {scope:'bbox',bbox:{west:5,south:47,east:5,north:56}}, {scope:'bbox',bbox:{west:5,south:58,east:16,north:56}}, {scope:'bbox',bbox:{west:NaN,south:47,east:16,north:56}}, {scope:'unknown'}]){
    assert.equal(parseGenericRasterCoverage({spatial_coverage:coverage}),null);
  }
});
