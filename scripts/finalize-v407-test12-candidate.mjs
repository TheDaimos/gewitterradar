import {readFile,writeFile} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {v407HelpNetworkHighlightsDelta} from './v4-07-help-network-highlights-delta.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const outDir=resolve(root,'artifacts/v407');
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const readBytes=name=>readFile(resolve(outDir,name));
const writeBytes=(name,bytes)=>writeFile(resolve(outDir,name),bytes);

const [a11Bytes,b11Bytes]=await Promise.all([
  readBytes('gewitterradar-v4.07.11A.js'),
  readBytes('gewitterradar-v4.07.11B.js'),
]);
const expected={
  A:{bytes:1810094,sha:'c82e31ad767a1e12ab7cc8aa838660afa27f5ca8e14bff2da7c28542112d7bbb'},
  B:{bytes:1810106,sha:'5391768c1284dcdadcc775092f8e2b6902c649b1a17ef51786a7e4fe9d7e672a'},
};
for (const [variant,bytes] of [['A',a11Bytes],['B',b11Bytes]]) {
  const digest=hash(bytes), rule=expected[variant];
  if (bytes.length!==rule.bytes || digest!==rule.sha) {
    throw new Error(`TEST12 requires exact TEST11${variant} input; got ${bytes.length} bytes / ${digest}`);
  }
}

const a=v407HelpNetworkHighlightsDelta(a11Bytes.toString('utf8'),'A').replace(/\r\n?/g,'\n');
const b=v407HelpNetworkHighlightsDelta(b11Bytes.toString('utf8'),'B').replace(/\r\n?/g,'\n');
const aBytes=Buffer.from(a,'utf8'),bBytes=Buffer.from(b,'utf8');
const aDigest=hash(aBytes),bDigest=hash(bBytes);

await Promise.all([
  writeBytes('gewitterradar.js',aBytes),
  writeBytes('gewitterradar-v4.07-test.js',aBytes),
  writeBytes('gewitterradar-v4.07.12A.js',aBytes),
  writeBytes('gewitterradar-v4.07.12B.js',bBytes),
]);
await writeFile(resolve(outDir,'SHA256SUMS.txt'),
  `${aDigest}  gewitterradar.js\n${aDigest}  gewitterradar-v4.07-test.js\n${aDigest}  gewitterradar-v4.07.12A.js\n${bDigest}  gewitterradar-v4.07.12B.js\n`
);
console.log(`Finalized V4.07.12A golden Help network diagnostics: ${aBytes.length} bytes, sha256 ${aDigest}`);
console.log(`Finalized V4.07.12B golden Help network diagnostics: ${bBytes.length} bytes, sha256 ${bDigest}`);
