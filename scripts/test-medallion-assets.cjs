const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const deliveries = ['frontend/assets','dashboard/dist/assets','custom_components/gewitterradar/frontend/assets'];
function vp8lSize(buf) {
  assert.equal(buf.toString('ascii',0,4),'RIFF');
  assert.equal(buf.toString('ascii',8,12),'WEBP');
  assert.equal(buf.toString('ascii',12,16),'VP8L');
  assert.equal(buf[20],0x2f);
  const b1=buf[21], b2=buf[22], b3=buf[23], b4=buf[24];
  return [1+(b1|((b2&0x3f)<<8)),1+((b2>>6)|(b3<<2)|((b4&0x0f)<<10))];
}
for (let i=2;i<=28;i++) {
  const id=String(i).padStart(2,'0');
  let reference=null;
  for (const dir of deliveries) {
    const data=fs.readFileSync(path.join(root,dir,'gewitterradar-trend-medallion-'+id+'.webp'));
    assert.deepEqual(vp8lSize(data),[264,264],'trend_'+id+' must be exact 2x lossless runtime size');
    if (reference) assert.ok(data.equals(reference),'trend_'+id+' differs between delivery trees');
    else reference=data;
  }
}

for (let i=1;i<=17;i++) {
  const id=String(i).padStart(2,'0');
  let reference=null;
  for (const dir of deliveries) {
    const data=fs.readFileSync(path.join(root,dir,'gewitterradar-trend-arrow-'+id+'.webp'));
    assert.deepEqual(vp8lSize(data),[264,264],'arrow_'+id+' must be exact 2x lossless runtime size');
    if (reference) assert.ok(data.equals(reference),'arrow_'+id+' differs between delivery trees');
    else reference=data;
  }
}
const baseSource=fs.readFileSync(path.join(root,'frontend/modules/core/base-context.js'),'utf8');
const extensionSource=fs.readFileSync(path.join(root,'frontend/modules/instruments/medallion-designs.js'),'utf8');
for (let i=1;i<=18;i++) assert.ok(baseSource.includes("id:'trend_"+String(i).padStart(2,'0')+"'"));
assert.ok(baseSource.includes("gewitterradar-trend-medallion.png?v=409"),'trend_01 asset reference changed');
assert.ok(extensionSource.includes('for(let number=19;number<=28;number++)'),'R14 medallion range contract missing');
assert.ok(extensionSource.includes('const id="trend_"+suffix;'),'R14 stable medallion id construction missing');
assert.ok(extensionSource.includes('for(let number=1;number<=17;number++)'),'R15 arrow range contract missing');
assert.ok(extensionSource.includes('id="arrow_"+suffix'),'R15 stable arrow id construction missing');
assert.ok(extensionSource.includes('context.TREND_ARROW_DESIGNS=Object.freeze'),'R15 arrow catalog export missing');
assert.ok(extensionSource.includes('gewitterradar.medallion-arrow-geometry.v2'),'R19 geometry database schema missing');
assert.ok(extensionSource.includes('storageKey:"gewitterradar:v41002:medallion-arrow-fit-db-v2"'),'R19 geometry database storage key missing');
assert.ok(extensionSource.includes('rotationStepDeg:5'),'R19 360-degree rotation sampling contract missing');
assert.ok(extensionSource.includes('centerFitMode:"eye-center-plus-render-origin-v1"'),'R19 center-aware fit contract missing');
assert.ok(extensionSource.includes('transformOriginXPercent:50'),'R19 arrow transform-origin X contract missing');
assert.ok(extensionSource.includes('transformOriginYPercent:50'),'R19 arrow transform-origin Y contract missing');
for (let i=19;i<=28;i++) {
  const id=String(i).padStart(2,'0');
  assert.ok(extensionSource.includes('trend_'+id+":new URL('../../assets/gewitterradar-trend-medallion-"+id+".webp?v=41002r14'"),'trend_'+id+' asset mapping missing');
}
console.log('Medallion asset contract: PASS');
