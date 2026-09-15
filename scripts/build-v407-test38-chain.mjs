import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';

const root=process.cwd();
const run=(script,...args)=>{ console.log(`\n>>> node ${script} ${args.join(' ')}`); execFileSync(process.execPath,[script,...args],{cwd:root,stdio:'inherit'}); };
const check=(file)=>{ console.log(`\n>>> node --check ${file}`); execFileSync(process.execPath,['--check',file],{cwd:root,stdio:'inherit'}); };
const sha=(file)=>createHash('sha256').update(readFileSync(resolve(root,file))).digest('hex');
const assertSha=(file,expected)=>{ const actual=sha(file); if(actual!==expected) throw new Error(`${file} SHA drift: ${actual} != ${expected}`); };

run('scripts/build-v407-location-search-candidate.mjs');
for(const n of ['8','9','10','10r1','11','12','13','14']) run(`scripts/finalize-v407-test${n}-candidate.mjs`);
for(const n of ['15','16','17','18','19','20','21','22','23','24','25','26','27','28']){ run(`scripts/finalize-v407-test${n}-candidate.mjs`); run(`scripts/test-v407-test${n}-candidate.mjs`); }
run('scripts/test-v407-full-i18n-candidate.mjs');
run('scripts/test-v407-help-runtime-locales.mjs');
for(const n of ['29','30','31']){ run(`scripts/finalize-v407-test${n}-candidate.mjs`); run(`scripts/test-v407-test${n}-candidate.mjs`); }
for(const n of ['33','34','35','36','37']){ run(`scripts/finalize-v407-test${n}-candidate.mjs`); check(`artifacts/v407/gewitterradar-v4.07.${n}.js`); run(`scripts/test-v407-test${n}-candidate.mjs`); }
assertSha('artifacts/v407/gewitterradar-v4.07.37.js','758246f38e7905fe5e3f91b25ab7767e074bb6e7708017abfe3cd4cd281bc1c2');

run('scripts/finalize-v407-test38-candidate.mjs');
check('artifacts/v407/gewitterradar-v4.07.38.js');
run('scripts/test-v407-test38-candidate.mjs');

const runner='/tmp/run-v40738-module.mjs';
writeFileSync(runner,`import {pathToFileURL} from 'node:url';\nglobalThis.customElements={get(){return undefined},define(){}};\nglobalThis.HTMLElement=class {};\nglobalThis.window=globalThis;\nglobalThis.document={};\nawait import(pathToFileURL(process.argv[2]).href);\nconsole.log('V4.07.38 executable module import PASS');\n`);
execFileSync(process.execPath,[runner,resolve(root,'artifacts/v407/gewitterradar-v4.07.38.js')],{stdio:'inherit'});
console.log('\nV4.07.38 full deterministic chain PASS');
