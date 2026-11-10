// Optional presentation layers. The V177 renderer below remains the authority
// for the original geometry, colours, timing, status fading and scheduling.
import {EyeNeon,filamentPointInto} from './eye-neon.js?v=411178r1';
const TAU=Math.PI*2,clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),fract=x=>x-Math.floor(x);
const enabled=c=>c.neonBrilliance>0||c.neonBloom>0||c.neonOrganics>0;
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
function point(out,p,n,angle){const f=fract(angle/TAU)*n,a=Math.floor(f),b=(a+1)%n,u=f-a;out[0]=p[a*2]*(1-u)+p[b*2]*u;out[1]=p[a*2+1]*(1-u)+p[b*2+1]*u;return out;}
function filamentPath(points, samples) {
 const path = new Path2D();
 path.moveTo(points[0], points[1]);
 for (let sample = 1; sample < samples; sample++) {
  path.lineTo(points[2 * sample], points[2 * sample + 1]);
 }
 path.closePath();
 return path;
}

function transferPath(scratch, points, samples, start, span) {
 const path = new Path2D();
 for (let step = 0; step <= 12; step++) {
  point(scratch, points, samples, start + span * step / 12);
  if (step === 0) path.moveTo(...scratch);
  else path.lineTo(...scratch);
 }
 return path;
}

// Compare the actual positions of same-colour auxiliary strands. Keep a
// distinct crossing or departure, even when most of the curve overlaps.
function overlaps(first, second, samples, tolerance) {
 for (let i = 0; i < 12; i++) {
  const index = 2 * Math.floor(i * samples / 12);
  const dx = first[index] - second[index];
  const dy = first[index + 1] - second[index + 1];
  if (dx * dx + dy * dy > tolerance * tolerance) return false;
 }
 return true;
}

function coversViewport(host) {
 const bounds = host.getBoundingClientRect();
 let {left, right, top, bottom} = bounds;
 for (let parent = host; parent; parent = parent.parentElement || parent.getRootNode().host) {
  const style = getComputedStyle(parent);
  if (style.visibility === 'hidden' || style.display === 'none' || style.opacity === '0') return false;
  if (parent === host) continue;
  if (/auto|scroll|hidden|clip/.test(style.overflowX + ' ' + style.overflowY)) {
   const clip = parent.getBoundingClientRect();
   if (/auto|scroll|hidden|clip/.test(style.overflowX)) {
    left = Math.max(left, clip.left);
    right = Math.min(right, clip.right);
   }
   if (/auto|scroll|hidden|clip/.test(style.overflowY)) {
    top = Math.max(top, clip.top);
    bottom = Math.min(bottom, clip.bottom);
   }
   if (right <= left || bottom <= top) return false;
  }
 }
 return true;
}
function glowSprite(color){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'#fff');g.addColorStop(.06,'#fff');g.addColorStop(.16,color);g.addColorStop(.36,color+'bb');g.addColorStop(1,color+'00');x.fillStyle=g;x.fillRect(0,0,64,64);return c;}
function dispose(w){w.canvas.remove();for(const c of [w.canvas,w.mask,w.bloom])c.width=c.height=1;for(const r of w.families.values())r.sprite.width=r.sprite.height=1;w.families.clear();w.bridges.length=0;}
export class EyeNeonWow extends EyeNeon{
 sync(items){
  // At zero, super.sync/draw run unchanged. No additional buffers or scheduler.
  super.sync(items);
  for(const s of this.surfaces){
   if(!enabled(s.config)){if(s.wow){dispose(s.wow);delete s.wow;this.draw(s,s.referenceTime??performance.now()/1000,0);}continue;}
   const signature=JSON.stringify([s.config.neonBrilliance,s.config.neonBloom,s.config.neonOrganics]);
   if (signature !== s.wow?.signature) {
    this.draw(s, s.referenceTime ?? performance.now() / 1000, 0);
    if (s.wow) s.wow.signature = signature;
   }
  }
 }
 release(s){if(s.wow)dispose(s.wow);super.release(s);}
 visible(surface) {
  return super.visible(surface) && (!enabled(surface.config) || coversViewport(surface.host));
 }

 draw(surface, time, dt, forceStatic = false) {
  super.draw(surface, time, dt, forceStatic);
  const config = surface.config;
  if (!enabled(config)) return;
  const moving = config.glow === 'living' && !this.motion.matches && !forceStatic;
  if (moving && (document.hidden || this.blurred || !this.visible(surface))) return;
  surface.referenceTime = time;
  const start = performance.now();
  const brilliance = clamp(config.neonBrilliance / 100);
  const bloom = clamp(config.neonBloom / 100);
  const organics = clamp(config.neonOrganics / 100);
  const light = Math.pow(config.brightness / 100, .72);
  const state = surface.wow || (surface.wow = this.createLayer(surface.host, time));
  this.updateBudget(state, time, dt, moving);

  const extent = surface.extent + (9 + config.size * .30) * bloom;
  const pixels = Math.min(640, Math.ceil(extent * 2 * surface.ratio));
  const ratio = pixels / (extent * 2);
  const maskPixels = bloom ? Math.min(192, pixels) : 1;
  const maskRatio = maskPixels / (extent * 2);
  if (state.canvas.width !== pixels) state.canvas.width = state.canvas.height = pixels;
  if (state.extent !== extent) {
   state.extent = extent;
   state.canvas.style.width = state.canvas.style.height = extent * 2 + 'px';
   state.lastBloom = -Infinity;
  }
  if (state.mask.width !== maskPixels) {
   state.mask.width = state.mask.height = maskPixels;
   state.bloom.width = state.bloom.height = maskPixels;
   state.lastBloom = -Infinity;
  }

  const phases = this.profileWow ? {} : null;
  const prepareTime = phases && performance.now();
  const active = state.active;
  active.length = 0;
  let haloChanged = state.config !== config || state.moving !== moving || state.ringCount !== surface.rings.size;
  for (const ring of surface.rings.values()) {
   let family = state.families.get(ring.id);
   if (!family || family.color !== ring.color) {
    if (family) family.sprite.width = family.sprite.height = 1;
    family = {color: ring.color, sprite: glowSprite(ring.color), strands: Array.from({length: 6}, () => ({
     points: new Float32Array(160), coverage: 0
    }))};
    state.families.set(ring.id, family);
    haloChanged = true;
   }
   if (family.target !== ring.target) haloChanged = true;
   family.target = ring.target;
   if (ring.target && ring.visibility > .01) active.push(ring);
  }
  state.config = config;
  state.moving = moving;
  state.ringCount = surface.rings.size;
  const refreshHalo = bloom && (haloChanged || time < state.lastBloom || (moving &&
   time - state.lastBloom >= [.15, .22, .30][state.level]));
  const mask = refreshHalo ? state.ink : null;
  this.clearLayer(state.ctx, pixels, ratio);
  if (mask) this.clearLayer(mask, maskPixels, maskRatio);
  if (phases) phases.prepare = performance.now() - prepareTime;

  const drawingStart = phases && performance.now();
  state.filaments = state.beads = state.transfers = 0;
  const sampleCount = surface.stats.samples;
  const baseCount = Math.min(9, Math.floor(surface.stats.filaments / Math.max(1, surface.rings.size)));
  const projectedRadius = config.size / 2 * Math.min(1, surface.host.offsetWidth / config.size || 1);
  const auxiliarySamples = projectedRadius >= 44 ? [80, 64, 48][state.level] : [56, 48, 40][state.level];
  const auxiliaryCount = moving ? organics * 6 * state.detail : 0;
  for (const ring of surface.rings.values()) {
   const family = state.families.get(ring.id);
   const alpha = light * ring.visibility;
   if (!moving) {
    const path = new Path2D();
    path.arc(0, 0, ring.radius, 0, TAU);
    this.paintPath(state.ctx, mask, path, ring.color, alpha, brilliance, bloom, 0, false);
    continue;
   }
   if (brilliance || mask) {
    for (let index = 0; index < baseCount; index++) {
     const points = ring.strands[index].points;
     const path = filamentPath(points, sampleCount);
     this.paintPath(state.ctx, mask, path, ring.color, alpha, brilliance, bloom, 0, true);
     if (brilliance && index % 2 === 0) {
      this.paintPearls(state, family, points, sampleCount, ring.index, index, time, alpha * brilliance,
       brilliance, organics, Math.min(3, 1.5 + state.detail));
     }
    }
   }

   // Generate lower-frequency detail directly at its useful sample resolution.
   // Fractional opacity keeps a strand continuous as the budget changes.
   const strands = family.strands;
   for (let index = 0; index < Math.ceil(auxiliaryCount); index++) {
    const strand = strands[index], seed = index + 10;
    strand.coverage = clamp(auxiliaryCount - index);
    for (let sample = 0; sample < auxiliarySamples; sample++) {
     filamentPointInto(strand.points, sample * 2, ring.radius - (seed - 2) * 1.05,
      ring.index, seed, sample / auxiliarySamples * TAU, time, config.intensity);
    }
   }
   for (let index = 0; index < Math.ceil(auxiliaryCount); index++) {
    const strand = strands[index];
    let coverage = strand.coverage;
    if (!coverage) continue;
    for (let other = index + 1; other < Math.ceil(auxiliaryCount); other++) {
     const neighbor = strands[other];
     if (neighbor.coverage && overlaps(strand.points, neighbor.points, auxiliarySamples, 1.25)) {
      coverage += neighbor.coverage;
      neighbor.coverage = 0;
     }
    }
    // A merged path retains the source-over light contribution of its strands.
    const organicAlpha = 1 - Math.pow(1 - organics * .7, coverage);
    const path = filamentPath(strand.points, auxiliarySamples);
    this.paintPath(state.ctx, mask, path, ring.color, alpha, brilliance, bloom, organicAlpha, true,
     Math.min(1, coverage));
    this.paintPearls(state, family, strand.points, auxiliarySamples, ring.index, baseCount + index,
     time, alpha * Math.max(brilliance, organics) * Math.min(1, coverage), brilliance, organics,
     Math.min(5, (2 + 3 * organics) * state.detail));
    state.filaments++;
   }
  }
  if (phases) phases.filamentsAndPearls = performance.now() - drawingStart;

  const contactStart = phases && performance.now();
  const limit = Math.max(1, Math.ceil(organics * [6, 5, 4][state.level]));
  if (moving && organics && active.length > 1 && time >= state.nextContact && state.bridges.length < limit) {
   this.contact(surface, state, active, sampleCount, time, organics);
   state.nextContact = time + .26 + (1 - organics) * .60;
  }
  if (phases) phases.contacts = performance.now() - contactStart;
  if (moving && organics) this.paintBridges(state, mask, sampleCount, time, dt, light, organics, brilliance, phases);
  else state.bridges.length = 0;

  const bloomStart = phases && performance.now();
  if (mask) this.refreshBloom(state, maskPixels, maskRatio, bloom, moving, time);
  if (bloom) {
   const ctx = state.ctx;
   ctx.save();
   ctx.setTransform(1, 0, 0, 1, 0, 0);
   ctx.globalCompositeOperation = 'destination-over';
   ctx.globalAlpha = 1;
   ctx.drawImage(state.bloom, 0, 0, pixels, pixels);
   ctx.restore();
  }
  if (phases) phases.bloom = performance.now() - bloomStart;
  for (const [id, family] of state.families) {
   if (!surface.rings.has(id) && !state.bridges.some(bridge => bridge.source.id === id || bridge.target.id === id)) {
    family.sprite.width = family.sprite.height = 1;
    state.families.delete(id);
   }
  }
  const cpu = performance.now() - start;
  state.cost = state.cost * .8 + cpu * .2;
  this.wowCpu = (this.wowCpu || 0) + cpu;
  state.cpuFrames++;
  state.cpuTotal += cpu;
  state.cpuMax = Math.max(state.cpuMax, cpu);
  Object.assign(state.stats, {
   cpuMs: cpu, cpuMeanMs: state.cpuTotal / state.cpuFrames, cpuMaxMs: state.cpuMax,
   filaments: state.filaments, beads: state.beads, bridges: state.bridges.length,
   transfers: state.transfers, quality: state.level, bloomUpdates: state.bloomUpdates,
   canvasBytes: (pixels * pixels + 2 * maskPixels * maskPixels) * 4,
   spriteBytes: state.families.size * 64 * 64 * 4,
   geometryBytes: state.families.size * 6 * 160 * 4, frameTime: time, phases
  });
 }

 createLayer(host, time) {
  const canvas = document.createElement('canvas');
  const mask = document.createElement('canvas');
  const bloom = document.createElement('canvas');
  canvas.className = 'eye-neon-wow';
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:absolute;left:50%;top:50%;transform:translate3d(-50%,-50%,0);pointer-events:none;z-index:1';
  host.append(canvas);
  return {
   canvas, mask, bloom, ctx: canvas.getContext('2d'), ink: mask.getContext('2d'), halo: bloom.getContext('2d'),
   lastBloom: -Infinity, bloomUpdates: 0, families: new Map(), active: [], bridges: [], nextContact: 0,
   serial: 0, level: 0, detail: 1, cost: 0, changed: time, goodSince: null,
   cpuFrames: 0, cpuTotal: 0, cpuMax: 0, a: new Float64Array(2), z: new Float64Array(2), stats: {}
  };
 }

 updateBudget(state, time, dt, moving) {
  if (!moving) return;
  const busy = state.cost > 2.8 || this.gap > 29;
  if (busy && time - state.changed > .75 && state.level < 2) {
   state.level++;
   state.changed = time;
   state.goodSince = null;
  }
  if (state.cost < 1.7 && this.gap < 22) {
   state.goodSince ??= time;
   if (time - state.goodSince > 5 && time - state.changed > 5 && state.level) {
    state.level--;
    state.changed = time;
    state.goodSince = null;
   }
  } else state.goodSince = null;
  state.detail += ([1, .78, .55][state.level] - state.detail) * (-Math.expm1(-Math.max(dt, 0) / .65));
 }

 clearLayer(context, pixels, ratio) {
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(0, 0, pixels, pixels);
  context.setTransform(ratio, 0, 0, ratio, pixels / 2, pixels / 2);
  context.lineJoin = context.lineCap = 'round';
 }

 paintPath(ctx, mask, path, color, alpha, brilliance, bloom, organicAlpha, moving, coverage = 1) {
  if (mask) {
   mask.strokeStyle = color;
   mask.globalAlpha = alpha * (moving ? .65 : 1) * coverage;
   mask.lineWidth = 1.4 + 2 * bloom;
   mask.stroke(path);
  }
  if (brilliance) {
   ctx.strokeStyle = color;
   ctx.lineWidth = .65 + brilliance * .6;
   ctx.globalAlpha = alpha * brilliance * (moving ? .70 : .95) * coverage;
   ctx.stroke(path);
   ctx.strokeStyle = '#fffafa';
   ctx.lineWidth = .12 + brilliance * .18;
   ctx.globalAlpha = alpha * brilliance * .9 * coverage;
   ctx.stroke(path);
  }
  if (organicAlpha) {
   ctx.strokeStyle = color;
   ctx.lineWidth = .45;
   ctx.globalAlpha = alpha * organicAlpha;
   ctx.stroke(path);
  }
 }

 paintPearls(state, family, points, samples, ringIndex, strandIndex, time, alpha, brilliance, organics, count) {
  for (let pearl = 0; pearl < Math.ceil(count); pearl++) {
   const phase = (pearl / (3 + organics * 5) + strandIndex * .381 + ringIndex * .173 +
    time * (strandIndex % 2 ? -.043 : .035)) * TAU;
   point(state.a, points, samples, phase);
   const size = (1.5 + brilliance * 2.2) * (1 + .28 * Math.sin(time * .4 + pearl * 2.4 + strandIndex));
   state.ctx.globalAlpha = alpha * .95 * clamp(count - pearl);
   state.ctx.drawImage(family.sprite, state.a[0] - size, state.a[1] - size, size * 2, size * 2);
   state.beads++;
  }
 }

 refreshBloom(state, pixels, ratio, bloom, moving, time) {
  const halo = state.halo;
  halo.setTransform(1, 0, 0, 1, 0, 0);
  halo.clearRect(0, 0, pixels, pixels);
  // The sharp colour core is already painted at display resolution. The
  // animated mask only needs the middle and wide scattering radii.
  const layers = moving ? [[18, .95], [6, 1]] : [[18, .9], [8, .95], [2, .55]];
  for (const [blur, alpha] of layers) {
   halo.filter = `blur(${blur * ratio * (.35 + bloom * .9)}px)`;
   halo.globalAlpha = bloom * alpha;
   halo.drawImage(state.mask, 0, 0);
  }
  halo.filter = 'none';
  state.lastBloom = time;
  state.bloomUpdates++;
 }

 paintBridges(state, mask, samples, time, dt, light, organics, brilliance, phases) {
  const ctx = state.ctx;
  let bridgeMs = 0, transferMs = 0;
  for (let index = state.bridges.length - 1; index >= 0; index--) {
   const bridgeStart = phases && performance.now();
   const bridge = state.bridges[index];
   const progress = (time - bridge.start) / bridge.life;
   const live = bridge.source.target && bridge.target.target;
   bridge.fade = clamp(bridge.fade + Math.max(dt, .016) * (live ? 3 : -3));
   if (progress >= 1 || !bridge.fade) {
    state.bridges.splice(index, 1);
    continue;
   }
   const source = point(state.a, bridge.source.strands[bridge.si].points, samples, bridge.sa);
   const targetPoints = bridge.target.strands[bridge.ti].points;
   const target = point(state.z, targetPoints, samples, bridge.ta);
   const dx = target[0] - source[0], dy = target[1] - source[1];
   const distance = Math.hypot(dx, dy);
   const bend = 3 + Math.sin(time * .35 + bridge.seed) * 3;
   const cx = (source[0] + target[0]) / 2 - dy / (distance || 1) * bend;
   const cy = (source[1] + target[1]) / 2 + dx / (distance || 1) * bend;
   const proximity = clamp((35 - distance) / 15);
   const alpha = light * organics * smooth(progress / .13) *
    (1 - smooth((progress - .67) / .33)) * bridge.fade * proximity;
   const color = bridge.source.color;
   const sprite = state.families.get(bridge.source.id).sprite;
   if (alpha > .003) {
    const path = new Path2D();
    path.moveTo(...source);
    path.quadraticCurveTo(cx, cy, ...target);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.05 + brilliance * .75;
    ctx.globalAlpha = alpha;
    ctx.stroke(path);
    if (mask) {
     mask.strokeStyle = color;
     mask.lineWidth = 3;
     mask.globalAlpha = alpha;
     mask.stroke(path);
    }
    if (progress < .58) {
     const u = smooth(progress / .58), v = 1 - u;
     const x = v * v * source[0] + 2 * v * u * cx + u * u * target[0];
     const y = v * v * source[1] + 2 * v * u * cy + u * u * target[1];
     const size = 3 + brilliance * 3;
     ctx.drawImage(sprite, x - size, y - size, size * 2, size * 2);
     state.beads++;
    }
   }
   if (phases) bridgeMs += performance.now() - bridgeStart;
   if (progress <= .43) continue;
   const transferStart = phases && performance.now();
   const u = (progress - .43) / .57;
   const fade = light * organics * bridge.fade * Math.sin(Math.PI * smooth(u));
   if (fade > .003) {
    const angle = bridge.ta + bridge.direction * u * 1.7;
    const span = bridge.direction * .4;
    const path = transferPath(state.a, targetPoints, samples, angle - span, span);
    ctx.strokeStyle = color;
    ctx.lineWidth = 1 + brilliance * .8;
    ctx.globalAlpha = fade;
    ctx.stroke(path);
    point(state.a, targetPoints, samples, angle);
    const size = 3 + brilliance * 2;
    ctx.drawImage(sprite, state.a[0] - size, state.a[1] - size, size * 2, size * 2);
    if (mask) {
     mask.strokeStyle = color;
     mask.lineWidth = 4;
     mask.globalAlpha = fade;
     mask.stroke(path);
    }
    state.transfers++;
   }
   if (phases) transferMs += performance.now() - transferStart;
  }
  if (phases) {
   phases.bridges = bridgeMs;
   phases.transfer = transferMs;
  }
 }

 contact(surface, state, rings, samples, time, organics) {
  const count = rings.length;
  const serial = state.serial++;
  const reach = 8 + 11 * organics;
  for (let offset = 0; offset < count; offset++) {
   const source = rings[(serial + offset) % count];
   const step = serial % 2 ? 1 : count - 1;
   const target = rings[(serial + offset + step) % count];
   if (source.color === target.color) continue;
   let bestScore = -Infinity, sourceIndex, targetIndex, sourceAngle, targetAngle;
   for (let sample = 0; sample < samples; sample += 8) {
    const angle = sample / samples * TAU;
    const occupied = state.bridges.some(bridge => {
     const separation = Math.abs(Math.atan2(Math.sin(angle - bridge.sa), Math.cos(angle - bridge.sa)));
     return separation * source.radius < 15;
    });
    if (occupied) continue;
    for (let si = 0; si < 3; si++) {
     const a = source.strands[si].points;
     for (let ti = 0; ti < 3; ti++) {
      const z = target.strands[ti].points;
      for (let delta = -2; delta <= 2; delta++) {
       const neighbor = (sample + delta + samples) % samples;
       const dx = a[sample * 2] - z[neighbor * 2];
       const dy = a[sample * 2 + 1] - z[neighbor * 2 + 1];
       const distance = dx * dx + dy * dy;
       if (distance > reach * reach) continue;
       // A short visible span leaves room for a distinct travelling impulse.
       const score = -Math.abs(distance - 64) - Math.abs(delta);
       if (score <= bestScore) continue;
       bestScore = score;
       sourceIndex = si;
       targetIndex = ti;
       sourceAngle = angle;
       targetAngle = neighbor / samples * TAU;
      }
     }
    }
   }
   if (sourceIndex !== undefined) {
    state.bridges.push({source, target, si: sourceIndex, ti: targetIndex, sa: sourceAngle, ta: targetAngle,
     start: time, life: 3.8 + fract(serial * .618) * 1.3, seed: serial, direction: serial % 2 ? 1 : -1, fade: .01});
    return;
   }
  }
 }
 tick(time){
  // Keep optional CPU cost out of the base cost EMA. Global frame gaps remain
  // real; the optional workload has its own earlier quality response above.
  if(!this.surfaces.some(s=>s.wow))return super.tick(time);
  const before=this.wowCpu||0;super.tick(time);
  this.cost=Math.max(0,this.cost-((this.wowCpu||0)-before)*.1);
 }
}
