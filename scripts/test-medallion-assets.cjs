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
const source=fs.readFileSync(path.join(root,'frontend/modules/core/base-context.js'),'utf8')+'\n'+fs.readFileSync(path.join(root,'frontend/modules/instruments/medallion-designs.js'),'utf8');
for (let i=1;i<=28;i++) assert.ok(source.includes("id:'trend_"+String(i).padStart(2,'0')+"'"));
assert.ok(source.includes("gewitterradar-trend-medallion.png?v=409"),'trend_01 asset reference changed');
assert.ok(source.includes("id:'trend_28'"),'trend_28 descriptor missing');
console.log('Medallion asset contract: PASS');
