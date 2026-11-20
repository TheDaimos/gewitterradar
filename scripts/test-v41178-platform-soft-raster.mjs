// V4.11.78 – Safari/iPadOS gets the established CSS blur;
// verified Chromium keeps the V4.11.76 two-scale SVG renderer.
// No user location, screenshot, or private diagnostic is used.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {weatherDisplayChromiumSoftFilterAllowed, weatherDisplaySoftRasterTuning,
  weatherDisplayAutoRasterTuning, weatherDisplayBalancedRasterTuning} from '../frontend/modules/weather/display-menu.js';
const base="Mozilla/5.0 ";
const chromeWin=base+"(Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126.0.0.0 Safari/537.36";
const chromeAndroid=base+"(Linux; Android 15; Pixel) AppleWebKit/537.36 Chrome/126.0.0.0 Mobile Safari/537.36";
const androidWebView=base+"(Linux; Android 14; wv) AppleWebKit/537.36 Chrome/126.0.0.0 Mobile Safari/537.36";
const edge=base+"(Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/125.0.0.0 Edg/125.0.0.0 Safari/537.36";
const safariMac=base+"(Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/17.6 Safari/605.1.15";
const safariIPad=base+"(iPad; CPU OS 17_5 like Mac OS X) AppleWebKit/605.1.15 Version/17.5 Mobile/15E148 Safari/604.1";
const chromeIOS=base+"(iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 CriOS/125.0.0.0 Mobile/15E148 Safari/604.1";
const iPadDesktop=base+"(Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/17.6 Safari/605.1.15";
const cases=[
  ["Chrome Windows",chromeWin,"Win32",0,true],
  ["Chrome Android",chromeAndroid,"Linux armv8l",5,true],
  ["Android WebView",androidWebView,"Linux armv8l",5,true],
  ["Edge Windows",edge,"Win32",0,true],
  ["iPad Safari",safariIPad,"iPad",5,false],
  ["iPhone Chrome uses WebKit",chromeIOS,"iPhone",5,false],
  ["iPad Desktop MacIntel",iPadDesktop,"MacIntel",5,false],
  ["iPad desktop-identifying Chromium UA",chromeWin,"MacIntel",5,false],
  ["macOS Safari",safariMac,"MacIntel",0,false],
  ["Firefox",base+"(Windows NT 10.0; Win64; x64) Gecko/20100101 Firefox/132.0","Win32",0,false],
  ["Unknown browser",base+"(Linux; Android 15) AppleWebKit/537.36 Mobile Safari/537.36","Linux armv8l",5,false],
  ["Empty","",undefined,undefined,false]
];
for(const [name,userAgent,platform,maxTouchPoints,expected] of cases){
  assert.equal(weatherDisplayChromiumSoftFilterAllowed({userAgent,platform,maxTouchPoints}),expected,name);
}
assert.equal(weatherDisplayChromiumSoftFilterAllowed(),false,'Fail closed if navigator missing');
const source=await readFile(new URL('../frontend/modules/weather/display-menu.js',import.meta.url),'utf8');
const tileSource=await readFile(new URL('../frontend/modules/weather/precipitation-layer.js',import.meta.url),'utf8');
assert.match(source,/const mixFilter=style==="soft"&&weatherDisplayChromiumSoftFilterAllowed\(browser\)/,
 'Browser exclusion must guard the actual SVG-filter call, not only settings');
assert.match(source,/const blur=mixFilter\|\|"blur\("/,
 'WebKit must keep the original single CSS blur');
assert.match(source,/pane\.dataset\.weatherDisplaySoftFilter=style==="soft"/,
 'The chosen filter family needs diagnostic visibility');
assert.match(source,/this\._weatherDisplayReleaseSoftFilter\(pane\)/,
 'Switching away from SVG should free the old filter');
assert.match(source,/if\(mixFilter&&!pane\.style\.filter\.includes\("url\("\)\)/,
 'Chromium syntax fallback should remain available');
assert.match(source,/feGaussianBlur/,'Chromium multiscale pipeline must remain');
assert.match(source,/feComposite/,'Chromium compositing must remain');
assert.doesNotMatch(source,/node\.style\.transform=/,'Leaflet transform preserved');
assert.doesNotMatch(source,/setInterval\(/,'No new refresh timer');
assert.match(tileSource,/keepBuffer:1/);
assert.match(tileSource,/maxNativeZoom:maxZoom/);
for(const nativeZoom of [5,6,7,8,9,10]){
 const base=weatherDisplayAutoRasterTuning(6,nativeZoom);
 assert.deepEqual(weatherDisplaySoftRasterTuning(8,nativeZoom),base,'Zoom 8 unchanged');
 for(const zoom of [9,10]){
  const soft=weatherDisplaySoftRasterTuning(zoom,nativeZoom);
  assert.ok(soft.blur<=Math.max(48,base.blur)+1e-9,'V4.11.75 blur budget protected');
  if(soft.multiscale){
   assert.ok(soft.multiscale.broadWeight<=.32&&soft.multiscale.broadBlur<=64,
    'Chromium multiscale bound protected');
  }
 }
}
assert.equal(weatherDisplaySoftRasterTuning(10,7).blur,48);
assert.equal(weatherDisplaySoftRasterTuning(10,7).multiscale.broadWeight,.32);
assert.equal(weatherDisplayBalancedRasterTuning(9,7).blur,11.2,'Ausgewogen unchanged');
assert.equal(weatherDisplayAutoRasterTuning(10,7).blur,220,'Auto unchanged');
console.log("PASS: V4.11.78 iPad/WebKit CSS fallback, Chromium multiscale, mode and performance guards.");
