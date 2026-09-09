import {readFile,writeFile,unlink} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {resolve} from 'node:path';
import {root,build} from './build-frontend.mjs';
const verify=()=>execFileSync(process.execPath,['scripts/verify-frontend.mjs'],{cwd:root,stdio:'pipe'});
verify();
const before=await readFile(resolve(root,'SHA256SUMS_FRONTEND.txt'));
await build();
if(!(await readFile(resolve(root,'SHA256SUMS_FRONTEND.txt'))).equals(before))throw Error('Non-deterministic rebuild');
for(const relative of ['custom_components/gewitterradar/frontend/assets/gewitterradar-about-copy-scroll.webp','dashboard/dist/gewitterradar.js','frontend/gewitterradar.js','dashboard/dist/locales/about-locales.js','frontend/locales/about-locales.js']){
 const file=resolve(root,relative),original=await readFile(file);
 try{await writeFile(file,Buffer.concat([original,Buffer.from('\ninvalid-parity-probe')]));let failed=false;try{verify();}catch{failed=true;}if(!failed)throw Error('Verifier accepted tampering: '+relative);}finally{await writeFile(file,original);}
}
const extra=resolve(root,'dashboard/dist/unexpected-test-file.txt');
try{await writeFile(extra,'probe');let failed=false;try{verify();}catch{failed=true;}if(!failed)throw Error('Verifier accepted extra payload');}finally{await unlink(extra);}
verify();console.log('PASS: deterministic rebuild and fail-closed source/asset/delivery/inventory probes.');
