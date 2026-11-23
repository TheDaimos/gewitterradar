// Fail closed before reusing functional evidence for a release-history text edit.
import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
import {execFileSync} from 'node:child_process';
import {normaliseGeneratedModule as norm} from '../tests/with-settings-vault.mjs';
const baseline='761bf3d290bf63dd6d4be60eebf3fe450438e916',tested='7c3892bbdac79098a21e2819b98bc976112a3a46';
const git=(...a)=>execFileSync('git',a,{encoding:'utf8',maxBuffer:30*1024*1024});
const old=p=>git('show',baseline+':'+p).replaceAll('\r\n','\n'),now=p=>readFileSync(p,'utf8').replaceAll('\r\n','\n');
const prose=s=>{
  const re=/(<div class="release-history-version">V4\.12 DEV · 2026\/11<\/div>[\s\S]*?<div class="release-history-collapsible-content">)[\s\S]*?(<\/div>\s*<\/details>)/g;
  assert.equal([...s.matchAll(re)].length,2,'exactly the DE/EN V4.12 entries');
  return s.replace(re,'$1RELEASE_PROSE$2')
    .replace('Help, diagnostics and all 19 language variants have been expanded.','Help and diagnostics have been expanded.')
    .replace('sowie erweiterte Hilfen, Diagnosen und alle 19 Sprachvarianten.','sowie erweiterte Hilfen und Diagnosen.');
};
const changed=git('diff','--name-only',baseline,'--','frontend/modules').trim().split('\n').filter(Boolean);
for(const p of changed)assert.equal(norm(p.endsWith('/skeleton.js')?prose(now(p)):now(p)),norm(p.endsWith('/skeleton.js')?prose(old(p)):old(p)),p+' no functional/style edits');
for(const p of ['custom_components/gewitterradar/vault_schema.py','frontend/locales/about-locales.js'])assert.equal(now(p),old(p),p+' unchanged');
assert.deepEqual(git('diff','--name-only',baseline,'--','frontend/assets','artwork').trim().split('\n').filter(p=>p&&p!=='frontend/assets/gewitterradar-runtime-manifest.json'),[],'original graphics unchanged');
const ci=JSON.parse(old('docs/evidence/gr-v412-slot-return/ci-results.json'));
assert.equal(ci.sourceCommit,tested);assert.equal(ci.workflowRuns.length,12);assert(ci.workflowRuns.every(r=>r.conclusion==='success'&&r.testedCommit===tested));
for(const tree of ['frontend','custom_components/gewitterradar','dashboard/dist','scripts','tests','.github'])assert.equal(git('rev-parse',baseline+':'+tree).trim(),git('rev-parse',tested+':'+tree).trim(),'baseline exact tested tree');
const proof={baselineDocumentation:baseline,baselineSource:tested,scope:'DE/EN V4.12 release-history prose and two V4.11 language-count mentions only; all module code/styles unchanged after release metadata normalization',checkedModules:changed,reusedBaselineRuns:ci.workflowRuns,physicalDeviceAcceptance:'operator'};
if(process.env.GR_HISTORY_PROOF){mkdirSync(dirname(process.env.GR_HISTORY_PROOF),{recursive:true});writeFileSync(process.env.GR_HISTORY_PROOF,JSON.stringify(proof,null,2)+'\n');}
console.log('PASS release-history prose scope; unchanged functional/style bodies and 12 pinned baseline receipts');
