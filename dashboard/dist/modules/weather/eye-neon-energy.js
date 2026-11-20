// Short decorative discharges on existing filament geometry. The Eye frame
// clock owns updates. No extra canvas, sprite cache or scheduled callback.
const PROFILES = Object.freeze({
 subtle: {cooldown: 6, variation: 6, life: .11, radius: .72, strength: .78},
 normal: {cooldown: 2, variation: 4, life: .145, radius: .9, strength: .91},
 strong: {cooldown: 1, variation: 2, life: .18, radius: 1, strength: 1}
});
const TAU = 2 * Math.PI;
const CONTACT_DISTANCE = 2.35;
const clamp = (n, max = 1) => Math.max(0, Math.min(n, max));
const phase = n => n - Math.floor(n);

// A segment intersection has distance zero. Otherwise, the closest points
// are an endpoint and its projection onto the other segment.
export function filamentContact(out, a, ai, b, bi, samples) {
 const aj = (ai + 1) % samples * 2, bj = (bi + 1) % samples * 2;
 const ax = a[ai * 2], ay = a[ai * 2 + 1], bx = b[bi * 2], by = b[bi * 2 + 1];
 const ux = a[aj] - ax, uy = a[aj + 1] - ay, vx = b[bj] - bx, vy = b[bj + 1] - by;
 const cross = ux * vy - uy * vx;
 if (Math.abs(cross) > 1e-8) {
  const dx = bx - ax, dy = by - ay;
  const u = (dx * vy - dy * vx) / cross, v = (dx * uy - dy * ux) / cross;
  if (u >= 0 && u <= 1 && v >= 0 && v <= 1) {
   out.x = ax + ux * u;
   out.y = ay + uy * u;
   out.distance = 0;
   return;
  }
 }
 out.distance = Infinity;
 project(out, ax, ay, bx, by, vx, vy);
 project(out, a[aj], a[aj + 1], bx, by, vx, vy);
 project(out, bx, by, ax, ay, ux, uy);
 project(out, b[bj], b[bj + 1], ax, ay, ux, uy);
}

function project(out, x, y, ax, ay, dx, dy) {
 const u = clamp(((x - ax) * dx + (y - ay) * dy) / (dx * dx + dy * dy || 1));
 const bx = ax + dx * u, by = ay + dy * u;
 const distance = (x - bx) ** 2 + (y - by) ** 2;
 if (distance < out.distance) {
  out.distance = distance;
  out.x = (x + bx) / 2;
  out.y = (y + by) / 2;
 }
}

function consider(state, source, target, si, ti, ai, bi, samples) {
 const a = source.strands[si].points, b = target.strands[ti].points;
 const candidate = state.candidate;
 filamentContact(candidate, a, ai, b, bi, samples);
 const {x, y, distance} = candidate;
 if (!Number.isFinite(distance) || distance > CONTACT_DISTANCE ** 2 ||
  (x - state.flash.x) ** 2 + (y - state.flash.y) ** 2 < 64) return;
 const score = distance + (source.color === target.color ? 3 : 0);
 if (score >= state.best.score) return;
 const aj = (ai + 1) % samples * 2;
 Object.assign(state.best, {x, y, score, source, target, distance,
  angle: Math.atan2(a[aj + 1] - a[ai * 2 + 1], a[aj] - a[ai * 2])});
}

function findContact(surface, state, samples, level) {
 const active = state.active;
 const best = state.best;
 best.score = Infinity;
 best.source = best.target = null;
 // Test current geometry at existing bridge endpoints first. The bridge
 // reach is much wider than the discharge threshold.
 for (const bridge of surface.wow?.bridges || []) {
  if (!active.includes(bridge.source) || !active.includes(bridge.target)) continue;
  const ai = Math.floor(bridge.sa * samples / TAU) % samples;
  const bi = Math.floor(bridge.ta * samples / TAU) % samples;
  consider(state, bridge.source, bridge.target, bridge.si, bridge.ti, ai, bi, samples);
 }
 if (best.score <= 1) return;
 // Sample neighbouring rings at rotating angular positions. This also
 // supports equal colours and runs when the separate Organics control is off.
 const stride = Math.ceil(samples / (level ? 10 : 16));
 const offset = state.scan++ % stride;
 const pairs = active.length === 2 ? 1 : active.length;
 for (let pair = 0; pair < pairs; pair++) {
  const source = active[pair], target = active[(pair + 1) % active.length];
  for (let ai = offset; ai < samples; ai += stride) {
   for (let si = 0; si < 2; si++) for (let ti = 0; ti < 2; ti++) {
    for (let delta = -1; delta <= 1; delta++) {
     const bi = (ai + delta + samples) % samples;
     consider(state, source, target, si, ti, ai, bi, samples);
    }
   }
  }
 }
}

function visibleContact(surface, x, y, radius) {
 const extent = surface.extent;
 if (Math.abs(x) + radius >= extent || Math.abs(y) + radius >= extent) return false;
 const box = surface.canvas.getBoundingClientRect();
 const left = box.left + box.width * (.5 + x / (2 * extent));
 const top = box.top + box.height * (.5 + y / (2 * extent));
 if (left < 0 || left >= innerWidth || top < 0 || top >= innerHeight) return false;
 for (let parent = surface.host.parentElement; parent; parent = parent.parentElement || parent.getRootNode().host) {
  const style = getComputedStyle(parent);
  if (!/auto|scroll|hidden|clip/.test(style.overflowX + ' ' + style.overflowY)) continue;
  const clip = parent.getBoundingClientRect();
  if (/auto|scroll|hidden|clip/.test(style.overflowX) && (left < clip.left || left >= clip.right)) return false;
  if (/auto|scroll|hidden|clip/.test(style.overflowY) && (top < clip.top || top >= clip.bottom)) return false;
 }
 return true;
}

function drawFlash(ctx, flash, time) {
 const {x, y, radius, start, life, strength, source, target, angle, bend} = flash;
 const progress = (time - start) / life;
 const fade = strength * (1 - progress) ** 2;
 const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
 glow.addColorStop(0, '#FFFFFF');
 glow.addColorStop(.19, '#F8FCFF');
 glow.addColorStop(.35, source.color);
 glow.addColorStop(.61, target.color + 'A0');
 glow.addColorStop(1, target.color + '00');
 ctx.save();
 ctx.globalCompositeOperation = 'lighter';
 ctx.globalAlpha = fade;
 ctx.fillStyle = glow;
 ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
 const dx = Math.cos(angle) * radius, dy = Math.sin(angle) * radius;
 ctx.beginPath();
 ctx.moveTo(x - dx * .76, y - dy * .76);
 ctx.lineTo(x - dx * .19 + dy * bend, y - dy * .19 - dx * bend);
 ctx.lineTo(x, y);
 ctx.lineTo(x + dx * .71, y + dy * .71);
 ctx.strokeStyle = '#F6FAFF';
 ctx.lineWidth = .48;
 ctx.globalAlpha = fade * (1 - progress);
 ctx.stroke();
 ctx.restore();
}

export function paintEnergyAccents(surface, time, level) {
 const profile = PROFILES[surface.config.energyAccents];
 if (!profile || surface.rings.size < 2) {
  delete surface.energy;
  return;
 }
 const state = surface.energy || (surface.energy = {mode: surface.config.energyAccents,
  active: [], candidate: {}, best: {}, flash: {x: Infinity, y: Infinity, start: -Infinity},
  next: time + profile.cooldown, scan: 0, events: 0, searches: 0});
 if (state.mode !== surface.config.energyAccents) {
  state.mode = surface.config.energyAccents;
  state.next = time + profile.cooldown;
 }
 const flash = state.flash;
 if (time >= flash.start && time < flash.start + flash.life && flash.source?.target && flash.target?.target) {
  drawFlash(surface.ctx, flash, time);
  return;
 }
 flash.source = flash.target = null;
 if (time < state.next) return;
 state.next = time + (level ? .55 : .3);
 state.active.length = 0;
 for (const ring of surface.rings.values()) if (ring.target && ring.visibility > .25) state.active.push(ring);
 if (state.active.length < 2) return;
 state.searches++;
 findContact(surface, state, surface.stats.samples, level);
 const best = state.best;
 const radius = Math.max(3, Math.min(6.2, surface.config.size * .055 + 1.9)) * profile.radius;
 if (!best.source || !visibleContact(surface, best.x, best.y, radius)) return;
 const seed = phase((state.events + 1) * .618 + best.angle * .271 + best.source.index * .173);
 Object.assign(flash, best, {radius, start: time, life: profile.life * (.9 + seed * .2),
  strength: profile.strength * Math.pow(surface.config.brightness / 100, .72), bend: (seed - .5) * .45});
 state.events++;
 state.next = time + (profile.cooldown + profile.variation * seed) * (best.source.color === best.target.color ? 1.4 : 1);
 drawFlash(surface.ctx, flash, time);
}
