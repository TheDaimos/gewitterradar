const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

const sourcePath = path.join(__dirname, 'test-about-browser.cjs');
const source = fs.readFileSync(sourcePath, 'utf8');

// V4.07.56 intentionally keeps a 44x44 touch target around the premium close
// artwork. At the narrow reference width that transparent hit area overlaps the
// slogan by 6px, while the visible 27x27 close artwork does not overlap it.
// Preserve the historical browser suite and adapt only this obsolete V4.05/V4.06
// assumption for the accepted V4.07.56 UI.
const from = "const claimClear=!headerTextBoxes.some(box=>intersects(claimBox,box))&&!intersects(claimBox,d.querySelector('.about-close').getBoundingClientRect());";
const to = "const closeVisual=d.querySelector('.about-close span')||d.querySelector('.about-close img');const claimClear=!headerTextBoxes.some(box=>intersects(claimBox,box))&&!intersects(claimBox,closeVisual.getBoundingClientRect());";

assert.equal(
  source.split(from).length,
  2,
  'Historical About browser overlap anchor changed; review before updating the V4.07.56 wrapper.',
);

const transformed = source.replace(from, to);
const generatedPath = path.join(__dirname, `.test-about-browser-v40756-${process.pid}.cjs`);
fs.writeFileSync(generatedPath, transformed);

try {
  const child = spawnSync(process.execPath, [generatedPath, ...process.argv.slice(2)], {
    stdio: 'inherit',
    env: process.env,
  });
  if (child.error) throw child.error;
  process.exitCode = child.status ?? 1;
} finally {
  fs.rmSync(generatedPath, { force: true });
}
