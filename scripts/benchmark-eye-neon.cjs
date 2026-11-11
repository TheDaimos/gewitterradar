const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { flowFixture } = require('./flow-curves-browser-fixture.cjs');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const assert = require('node:assert/strict');

const output = path.join(os.tmpdir(), process.env.GR_NEON_REFERENCE ? 'gr-eye-180' : 'gr-eye-179');
fs.mkdirSync(output, { recursive: true });
const views = [
  ['desktop', 1280, 900, 1], ['hidpi', 1920, 1080, 1.5],
  ['android', 393, 851, 3], ['landscape', 851, 393, 3], ['ipad', 820, 1180, 2]
];
const profiles = [
  ['zero', 0, 0, 4], ['moderate', 45, 40, 4], ['high', 80, 80, 4],
  ['light-max', 100, 0, 4], ['max', 100, 100, 4], ['two', 100, 100, 2]
];
const reference = process.env.GR_NEON_REFERENCE || '5a3f0a6b64978194991e8a94dacd6aa86195bc3a';
const referenceLabel = process.env.GR_NEON_REFERENCE ? '179' : '178';
const candidateLabel = process.env.GR_NEON_REFERENCE ? '180' : '179';

async function measure({ name, strength, extent, colors, preview }) {
  const { EyeNeonWow } = await import('/frontend/modules/weather/eye-neon-wow.js');
  const cfg = card._eyeHubState().config;
  const config = {...cfg, grouped:true, aura:true, glow:'living', size:preview?126:42*1.278,
    iconSize:128, backdrop:85, brightness:100, intensity:100,
    neonBrilliance:strength, neonBloom:strength, neonOrganics:strength, backdropExtent:extent};
  const statuses = Object.fromEntries(config.slots.slice(0, colors).map(s => [s.functionId, {active:true,available:true}]));
  const host = document.createElement('div');
  host.style.cssText = 'position:fixed;left:50%;top:50%;width:54px;height:54px;z-index:99999';
  if (preview) { host.className = 'eye-preview-scene'; host.style.width = host.style.height = '126px'; host.style.transform = 'scale(1.25)'; }
  document.body.append(host);
  const renderer = new EyeNeonWow();
  renderer.schedule = () => {};
  renderer.profileWow = true;
  renderer.sync([{host,config,statuses}]);
  const surface = renderer.surfaces[0];
  for (const ring of surface.rings.values()) ring.visibility = 1;
  let contacts = 0, contactMs = 0, maskStrokes = 0, filterPasses = 0;
  const originalContact = renderer.contact.bind(renderer);
  renderer.contact = (...args) => {const start = performance.now(); originalContact(...args); contacts++; contactMs += performance.now()-start;};
  if (surface.wow) {
    const originalStroke = surface.wow.ink.stroke.bind(surface.wow.ink);
    surface.wow.ink.stroke = (...args) => {maskStrokes++; originalStroke(...args);};
    const originalImage = surface.wow.halo.drawImage.bind(surface.wow.halo);
    surface.wow.halo.drawImage = (...args) => {filterPasses++; originalImage(...args);};
  }
  const times = [], gaps = [];
  let last, frames = 0, transfers = 0, addon = 0, phases = {};
  await new Promise(resolve => {
    function frame(t) {
      if (last !== undefined && frames >= 24) gaps.push(t-last);
      last=t;
      const start = performance.now(), before = renderer.wowCpu || 0;
      renderer.draw(surface, 10 + frames/30, 1/30);
      if (frames >= 24) {
        times.push(performance.now()-start);
        addon += (renderer.wowCpu || 0)-before;
        transfers = Math.max(transfers, surface.wow?.stats.transfers || 0);
        for (const [key,value] of Object.entries(surface.wow?.stats.phases || {})) phases[key]=(phases[key]||0)+value;
      }
      if (++frames < 108) requestAnimationFrame(frame); else resolve();
    }
    requestAnimationFrame(frame);
  });
  const stats = surface.wow?.stats || null;
  const screenshot = document.createElement('canvas');
  screenshot.width = screenshot.height = 460;
  const ctx = screenshot.getContext('2d');
  ctx.fillStyle='#0a131a';ctx.fillRect(0,0,460,460);
  for (const canvas of host.querySelectorAll('canvas')) {
    const width=parseFloat(canvas.style.width);
    ctx.drawImage(canvas,230-width/2,230-width/2,width,width);
  }
  const image = screenshot.toDataURL().split(',')[1];
  host.hidden=true;
  const hidden = !renderer.visible(surface);
  renderer.destroy();
  host.remove();
  times.sort((a,b)=>a-b);gaps.sort((a,b)=>a-b);
  const percentile=(a,p)=>a[Math.floor(a.length*p)];
  return {name,addonMs:addon/times.length, p50:percentile(gaps,.5),p95:percentile(gaps,.95),
    jsP95:percentile(times,.95),jsMax:times.at(-1),contactMs,contacts,maskStrokes,filterPasses,
    transfers,stats,phases,hidden,image};
}

async function livePreview(page, offsets) {
  await page.evaluate(offsets => {
    const hub = card._eyeHubState();
    for (const [id, entry] of hub.registry.entries) {
      hub.registry.entries.set(id, {...entry, status: () => ({active:true,available:true})});
    }
    card._eyeHubPatch({grouped:true,aura:true,glow:'living',size:42*1.278,iconSize:128,
      backdrop:85,intensity:100,brightness:100,neonBrilliance:100,neonBloom:100,
      neonOrganics:100,backdropExtent:100,...offsets});
    card._eyeHubOpen();
  },offsets);
  const preview = page.locator('#eye-hub-config [data-preview=closed]');
  await preview.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => card._eyeHubState().neon.surfaces.some(s => s.wow?.stats.transfers));
  return page.evaluate(() => new Promise(resolve => {
    const renderer = card._eyeHubState().neon;
    const state = renderer.surfaces[0].wow;
    const frames = state.cpuFrames, cpu = state.cpuTotal;
    const gaps = [];
    let start, last;
    function sample(time) {
      if (last !== undefined) gaps.push(time-last);
      last = time;
      start ??= time;
      if (time-start < 3600) {
        requestAnimationFrame(sample);
        return;
      }
      gaps.sort((a,b)=>a-b);
      resolve({p50:gaps[Math.floor(gaps.length*.5)],p95:gaps[Math.floor(gaps.length*.95)],
        drawFrames:state.cpuFrames-frames,addonMs:(state.cpuTotal-cpu)/(state.cpuFrames-frames),
        stats:state.stats});
    }
    requestAnimationFrame(sample);
  }));
}

(async()=>{
  const useReference=process.argv.includes('--baseline');
  const live=process.argv.includes('--live-preview');
  const maxGaps=process.argv.includes('--max-gaps');
  const fixture=flowFixture({ref:useReference?reference:null});
  await new Promise(resolve=>fixture.server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({headless:true,...(process.env.CHROME_PATH?{executablePath:process.env.CHROME_PATH}:{})});
  const results=[];
  try {
    for (const [view,width,height,dpr] of views) {
      if(process.env.GR_MENU_VIEW && process.env.GR_MENU_VIEW!==view)continue;
      const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:dpr,hasTouch:dpr>=2,isMobile:dpr>=2});
      await fixture.route(page);
      await page.goto('http://127.0.0.1:'+fixture.server.address().port);
      await page.waitForFunction(()=>window.ready&&card._map);
      await page.evaluate(()=>{card._setMapDisplayMode('fullscreen',{persist:false});card._weatherWindSet({visible:true,enabled:true,mode:'snake',snakeAnimationExplicit:true});});
      await page.waitForFunction(()=>card._weatherWindState().snakePainter);
      if (live) {
        const row = await livePreview(page,maxGaps?{eyeAuraGap:30,auraRingGap:8}:{});
        await page.locator('#eye-hub-config [data-preview=closed]').screenshot({
          path:path.join(output,(useReference?referenceLabel:candidateLabel)+'-'+view+(maxGaps?'-max-gaps':'')+'-live-preview.png')
        });
        results.push({view,...row});
        console.log(JSON.stringify({view,...row}));
        await page.close();
        continue;
      }
      for(const [name,strength,extent,colors] of [...profiles,['preview',100,100,4]]) {
        const {image,...row}=await page.evaluate(measure,{name,strength,extent,colors,preview:name==='preview'});
        assert(row.hidden);
        if(name==='max'||name==='two'||name==='preview') {
          fs.writeFileSync(path.join(output,(useReference?referenceLabel:candidateLabel)+'-'+view+'-'+name+'.png'),Buffer.from(image,'base64'));
          assert(row.transfers>0,'Transfer under full load');
        }
        results.push({view,...row});
        console.log(JSON.stringify({view,...row}));
      }
      await page.close();
    }
    fs.writeFileSync(path.join(output,(maxGaps?'max-gaps-':'')+(live?'live-':'')+(useReference?'baseline.json':'optimized.json')),JSON.stringify(results,null,2));
  } finally {await browser.close();fixture.server.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
