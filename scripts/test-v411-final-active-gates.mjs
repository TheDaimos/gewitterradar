import assert from 'node:assert/strict';
import {readdirSync,readFileSync} from 'node:fs';
import {spawnSync} from 'node:child_process';

// These are immutable historical tests against exact earlier builds, not tests
// of the current V4.11.243 runtime. Keep the scripts and their original CI
// workflows available for archival revision checks.
const historical=new Map([
  ['test-v41134-mobile-map.mjs',/4\.11\.34/],
  ['test-v41135-mobile-map.mjs',/4\.11\.35/],
  ['test-v41136-mobile-map.mjs',/4\.11\.36/],
  ['test-v41137-mobile-map.mjs',/4\.11\.37/],
  ['test-v41138-mobile-map.mjs',/4\.11\.38/],
  ['test-v41139-mobile-map.mjs',/4\.11\.39/],
  ['test-v41177-restore-soft-raster.mjs',/V4\.11\.75-CSS-Profil/],
  ['test-v411212-wind-menu-footer.mjs',/Performance-Diagnose/]
]);

const files=readdirSync('scripts').filter(name=>/^test-v411.*\.mjs$/.test(name)&&name!=='test-v411-final-active-gates.mjs'&&name!=='test-v411-final-license-help.mjs').sort();
for(const [name,pin] of historical){
  assert(files.includes(name),`Historical regression script disappeared: ${name}`);
  assert.match(readFileSync('scripts/'+name,'utf8'),pin,`Historical fingerprint changed: ${name}`);
}
const active=files.filter(name=>!historical.has(name));
assert(active.length>=23,'Current V4.11 coverage unexpectedly shrunk');
for(const name of active){
  console.log(`RUN: ${name}`);
  const result=spawnSync(process.execPath,['scripts/'+name],{encoding:'utf8',timeout:20000,maxBuffer:6*1024*1024});
  if(result.status!==0){
    process.stderr.write(`FAIL active ${name}\n${result.stderr||result.stdout||result.error?.message||''}\n`);
    process.exitCode=1;
  }
}
if(process.exitCode)process.exit(process.exitCode);
console.log(`PASS: ${active.length} current V4.11 Node regressions; ${historical.size} exact-version historical tests retained and classified`);
