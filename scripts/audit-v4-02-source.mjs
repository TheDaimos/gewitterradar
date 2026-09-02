import { readFile } from 'node:fs/promises';

const source = await readFile('gewitterradar-card-v4_01.js', 'utf8');
const markers = ['V4.01', 'v4.01', 'v4_01', '?v=401', '4.01'];

for (const marker of markers) {
  const indexes = [];
  let offset = 0;
  while (true) {
    const index = source.indexOf(marker, offset);
    if (index === -1) break;
    indexes.push(index);
    offset = index + marker.length;
  }
  console.log(`MARKER ${JSON.stringify(marker)} COUNT ${indexes.length}`);
  for (const [n, index] of indexes.entries()) {
    const start = Math.max(0, index - 160);
    const end = Math.min(source.length, index + marker.length + 160);
    console.log(`--- ${marker} #${n + 1} @${index} ---`);
    console.log(source.slice(start, end).replace(/\n/g, '\\n'));
  }
}
