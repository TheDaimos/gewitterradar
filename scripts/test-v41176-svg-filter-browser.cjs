// Browser-only synthetic test. No user photo, locations or live weather data.
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const sharp=require('sharp');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:process.argv[2]});
 try{
  const page=await browser.newPage({viewport:{width:660,height:280},deviceScaleFactor:1});
  await page.setContent('<!doctype html><html><body style="margin:0;background:rgb(16,16,16)"><div id="host"></div></body></html>');
  await page.evaluate(()=>{
    const root=document.getElementById('host').attachShadow({mode:'open'});
    root.innerHTML=[
      '<style>.rect{position:absolute;top:60px;width:160px;height:160px;background:rgb(0,240,40)}',
      '.single{left:40px;filter:blur(16px)}',
      '.mixed{left:340px;filter:url(#gr-synthetic-filter)}</style>',
      '<svg width="0" height="0" aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden">',
      '<defs><filter id="gr-synthetic-filter" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB">',
      '<feGaussianBlur in="SourceGraphic" stdDeviation="16" result="detail"/>',
      '<feGaussianBlur in="SourceGraphic" stdDeviation="24" result="broad"/>',
      '<feComposite in="detail" in2="broad" operator="arithmetic" k1="0" k2=".68" k3=".32" k4="0"/>',
      '</filter></defs></svg>',
      '<div class="rect single"></div><div class="rect mixed"></div>'
    ].join('');
  });
  const screenshot=await page.screenshot();
  const {data,info}=await sharp(screenshot).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const pixel=(x,y)=>[...data.subarray((y*info.width+x)*info.channels,(y*info.width+x)*info.channels+3)];
  const baseCenter=pixel(120,140),mixCenter=pixel(420,140);
  const baseEdge=pixel(33,140),mixEdge=pixel(333,140);
  assert.ok(baseCenter[1]>180,'Baseline CSS filter nicht gerendert');
  assert.ok(mixCenter[1]>140,'SVG-Mehrskalenglaettung im Shadow DOM wird nicht gerendert');
  assert.ok(mixEdge[1]>30&&mixEdge[1]<mixCenter[1],'Mehrskalenfilter muss am Rechteckrand weich uebergehen');
  assert.ok(baseEdge[1]>30,'Einzelreferenz zum Vergleich nicht gerendert');
  console.log('PASS: Shadow-DOM SVG-Mehrskalenfilter erzeugt darstellbaren Farbverlauf.',{baseCenter,mixCenter,mixEdge});
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
