import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
// Curves are an authorized extension. Protect each legacy drawing/data path
// exactly, instead of forbidding every future addition to the entire class.
export function assertClassicWindPreserved(ref='a607639ad2a6373c62e04ce8acfc39f72feb280a'){
 const path='frontend/modules/weather/wind-canvas.js',now=readFileSync(path,'utf8').replace(/\r\n/g,'\n'),old=execFileSync('git',['show',ref+':'+path],{encoding:'utf8'}).replace(/\r\n/g,'\n');
 for(const [start,end] of [['const DEG=','export class WindCanvas'],[' moving(){',' paint(time){'],[' cancelPreparation(){',' paintParticles('],['   const speed=scratch[2],u=','  }ctx.restore();return drawn;'],['  for(const item of copies){','  const cost=']]){
  const section=s=>{const a=s.indexOf(start);assert(a>=0,start);const b=s.indexOf(end,a);assert(b>a,end);return s.slice(a,b);};assert.equal(section(now),section(old),start);
 }
 const target=s=>s.split('\n').find(x=>/^  const (classicTarget|target)=Math.min\(mobile\?900:2200/.test(x))?.replace('classicTarget','target');assert.equal(target(now),target(old),'unchanged density for the classic path');
}
