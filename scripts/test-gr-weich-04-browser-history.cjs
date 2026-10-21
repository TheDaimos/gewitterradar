// GR-WEICH-04: Real Chromium pixels, historical Git source versus current code.
// Synthetic only; no user imagery, geographic positions or provider data.
const assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process');
const {readFileSync,writeFileSync,mkdirSync}=require('node:fs');
const vm=require('node:vm');
const {chromium}=require('playwright');
const sharp=require('sharp');
const history='46754f6689b0b01f1a45287e21572ae04b90f3bd';
const path='frontend/modules/weather/display-menu.js';
const out='artwork/acceptance/gr-weich-04';
const extract=source=>{
 const start=source.indexOf('const safeObject='),end=source.indexOf('const bool=',start);
 assert.ok(start>=0&&end>start,'Cannot extract genuine raster functions');
 return vm.runInNewContext(source.slice(start,end)+';({weatherDisplayAutoRasterTuning,weatherDisplayBalancedRasterTuning,weatherDisplaySoftRasterTuning})');
};
const historicalSource=execFileSync('git',['show',history+':'+path],{encoding:'utf8',maxBuffer:4e6});
const currentSource=readFileSync(path,'utf8');
const historic=extract(historicalSource),current=extract(currentSource);
const tuning=(f,mode,zoom,native)=>mode==='precise'?{blur:0,saturate:1,contrast:1,brightness:1}
 :mode==='auto'?f.weatherDisplayAutoRasterTuning(zoom,native)
 :mode==='balanced'?f.weatherDisplayBalancedRasterTuning(zoom,native)
 :f.weatherDisplaySoftRasterTuning(zoom,native);
const css=t=>{
 const b=Number(t.blur).toFixed(2);
 return 'blur('+b+'px) saturate('+t.saturate.toFixed(3)+') contrast('+t.contrast.toFixed(3)+') brightness('+t.brightness.toFixed(3)+')';
};
(async()=>{
 mkdirSync(out,{recursive:true});
 const w=256,h=256,raw=Buffer.alloc(w*h*4);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const p=(y*w+x)*4;
  const inside=x>=52&&x<196&&y>=50&&y<203;
  const hole=x>=115&&x<141&&y>=90&&y<122;
  raw[p]=inside?233:0;raw[p+1]=inside?80:0;raw[p+2]=inside?33:0;raw[p+3]=inside&&!hole?230:0;
 }
 const png=await sharp(raw,{raw:{width:w,height:h,channels:4}}).png().toBuffer();
 writeFileSync(out+'/synthetic-source.png',png);
 const browser=await chromium.launch({headless:true,executablePath:process.argv[2]});
 const results=[];
 try{
  const page=await browser.newPage({viewport:{width:640,height:420},deviceScaleFactor:1});
  for(const zoom of [8,9,10]){
   for(const mode of ['auto','precise','balanced','soft']){
    for(const [variant,f,native] of [['historical-z7',historic,7],['current-z7',current,7],['historical-url18',historic,18]]){
     const t=tuning(f,mode,zoom,native);
     await page.setContent('<!doctype html><html><body style="margin:0;background:rgb(12,16,23)"><div id="pane" style="position:absolute;left:150px;top:80px;width:256px;height:256px;filter:'+css(t)+'"><img width="256" height="256" style="display:block" src="data:image/png;base64,'+png.toString('base64')+'"></div></body></html>');
     await page.locator('img').evaluate(img=>img.decode());
     const screenshot=await page.screenshot();
     const filename=mode+'-z'+zoom+'-'+variant+'.png';
     writeFileSync(out+'/'+filename,screenshot);
     const {data,info}=await sharp(screenshot).removeAlpha().raw().toBuffer({resolveWithObject:true});
     const channel=(x,y,c)=>data[(y*info.width+x)*info.channels+c];
     const center=channel(220,180,0),outside=channel(130,180,0),edge=channel(202,180,0);
     assert.ok(center>outside,'Expected source core visible in '+filename);
     results.push({mode,zoom,variant,blur:Number(t.blur.toFixed(3)),filter:css(t),core:center,outside,edge,filename});
    }
    const pair=results.filter(r=>r.mode===mode&&r.zoom===zoom);
    assert.equal(pair[0].core,pair[1].core,'Current and historic z7 core pixel mismatch');
    assert.equal(pair[0].outside,pair[1].outside,'Current and historic z7 outside pixel mismatch');
    assert.equal(pair[0].edge,pair[1].edge,'Current and historic z7 edge pixel mismatch');
   }
  }
  // Browser pixels: SVG multiscale and CSS fallback, source is synthetic.
  const t=current.weatherDisplaySoftRasterTuning(9,7);
  assert.ok(t.multiscale,'Expected z9 multiscale reference');
  await page.setContent('<!doctype html><html><body style="margin:0;background:#101017"><svg width="0" height="0"><defs><filter id="mix" x="-25%" y="-25%" width="150%" height="150%" color-interpolation-filters="sRGB"><feGaussianBlur in="SourceGraphic" stdDeviation="'+t.multiscale.detailBlur.toFixed(2)+'" result="detail"/><feGaussianBlur in="SourceGraphic" stdDeviation="'+t.multiscale.broadBlur.toFixed(2)+'" result="broad"/><feComposite in="detail" in2="broad" operator="arithmetic" k1="0" k2="'+(1-t.multiscale.broadWeight).toFixed(3)+'" k3="'+t.multiscale.broadWeight.toFixed(3)+'" k4="0"/></filter></defs></svg><img id="css" style="position:absolute;top:80px;left:80px;filter:'+css(t)+'" src="data:image/png;base64,'+png.toString('base64')+'"><img id="svg" style="position:absolute;top:80px;left:360px;filter:url(#mix)" src="data:image/png;base64,'+png.toString('base64')+'"></body></html>');
  await page.locator('#svg').evaluate(img=>img.decode());
  const shot=await page.screenshot();writeFileSync(out+'/css-vs-svg-z9.png',shot);
  const {data,info}=await sharp(shot).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const red=(x,y)=>data[(y*info.width+x)*info.channels];
  const cssCenter=red(200,160),svgCenter=red(480,160),cssOutside=red(72,180),svgOutside=red(352,180);
  assert.ok(cssCenter>cssOutside&&svgCenter>svgOutside,'SVG/CSS real browser colors not rendered');
  results.push({mode:'soft-css-vs-svg',zoom:9,cssCenter,svgCenter,cssOutside,svgOutside,filename:'css-vs-svg-z9.png'});
  const summary={browser:browser.version(),historicCommit:history,sourceShaCommand:'git show',currentHead:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),tests:results};
  writeFileSync(out+'/pixels.json',JSON.stringify(summary,null,2)+'\n');
  console.log('PASS GR-WEICH-04: real Chromium screenshots, historical Git raster functions, 4 modes, zoom 8/9/10, CSS/SVG pixel sampling', {browser:summary.browser,cases:results.length,cssCenter,svgCenter});
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
