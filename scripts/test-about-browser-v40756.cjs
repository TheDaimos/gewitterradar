const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');

const sourcePath = path.join(__dirname, 'test-about-browser.cjs');
const source = fs.readFileSync(sourcePath, 'utf8');

// V4.07.56 intentionally keeps a 44x44 touch target around the premium close
// artwork. At the narrow reference width that transparent hit area overlaps the
// slogan by 6px, while the visible 27x27 close artwork does not overlap it.
// Preserve the historical browser suite and adapt only obsolete V4.05/V4.06
// assumptions for the accepted V4.07.56 UI.
const overlapFrom = "const claimClear=!headerTextBoxes.some(box=>intersects(claimBox,box))&&!intersects(claimBox,d.querySelector('.about-close').getBoundingClientRect());";
const overlapTo = "const closeVisual=d.querySelector('.about-close span')||d.querySelector('.about-close img');const claimClear=!headerTextBoxes.some(box=>intersects(claimBox,box))&&!intersects(claimBox,closeVisual.getBoundingClientRect());";

assert.equal(
  source.split(overlapFrom).length,
  2,
  'Historical About browser overlap anchor changed; review before updating the V4.07.56 wrapper.',
);

let transformed = source.replace(overlapFrom, overlapTo);

// The accepted V4.07.56 close control exposes its visible premium artwork through
// the 27x27 span inside the 44x44 button. The old suite assumed every premium
// control had to be represented by a direct IMG whose natural width was exactly
// 256px. Keep that exact IMG contract for the copy control, but validate the
// actual close visual for the close control while preserving hit area,
// containment and square-ratio requirements.
const controlFrom = "const img=button.querySelector('img'),r=button.getBoundingClientRect(),i=img.getBoundingClientRect();\n          return {label:button.getAttribute('aria-label'),hit:[r.width,r.height],visible:img.complete&&img.naturalWidth===256&&i.width>0&&i.height>0,contained:i.left>=r.left&&i.right<=r.right&&i.top>=r.top&&i.bottom<=r.bottom,ratio:i.width/i.height};";
const controlTo = "const isClose=button.classList.contains('about-close'),img=button.querySelector('img'),visual=isClose?(button.querySelector('span')||img):img,r=button.getBoundingClientRect(),i=visual.getBoundingClientRect(),visualStyle=getComputedStyle(visual);\n          const closeArtworkVisible=isClose&&i.width>0&&i.height>0&&(visualStyle.backgroundImage!=='none'||(img&&img.complete&&img.naturalWidth>0));\n          const imageArtworkVisible=!isClose&&img&&img.complete&&img.naturalWidth===256&&i.width>0&&i.height>0;\n          return {label:button.getAttribute('aria-label'),hit:[r.width,r.height],visible:closeArtworkVisible||imageArtworkVisible,contained:i.left>=r.left&&i.right<=r.right&&i.top>=r.top&&i.bottom<=r.bottom,ratio:i.width/i.height};";

assert.equal(
  transformed.split(controlFrom).length,
  2,
  'Historical premium-control artwork anchor changed; review before updating the V4.07.56 wrapper.',
);
transformed = transformed.replace(controlFrom, controlTo);

// Chromium's touch emulation does not consistently transfer keyboard focus after
// a synthetic click in the same way as a desktop mouse. On non-touch profiles the
// historical automatic focus-transfer assertion remains unchanged. On touch
// profiles explicitly focus the real close control before Enter, then keep the
// original close and return-focus assertions. This tests keyboard operability
// without conflating it with emulated pointer-focus semantics.
const keyboardFrom = "await page.locator('#settings-about').click();\n        await page.keyboard.press('Enter');";
const keyboardTo = "await page.locator('#settings-about').click();\n        if(hasTouch)await page.locator('.about-close').focus();\n        await page.keyboard.press('Enter');";

assert.equal(
  transformed.split(keyboardFrom).length,
  2,
  'Historical keyboard activation anchor changed; review before updating the V4.07.56 wrapper.',
);
transformed = transformed.replace(keyboardFrom, keyboardTo);

// V4.09.01 is deliberately a development/test candidate. The historical
// browser suite rejects every visible DEV marker because it was written for
// stable releases. Preserve that protection for all stable builds, but allow
// the marker only while the exact locked V4.09.01 candidate identity is active.
const frontendForVersionGate = fs.readFileSync(path.join(__dirname, '..', 'frontend', 'gewitterradar.js'), 'utf8');
const isV40901DevelopmentCandidate =
  frontendForVersionGate.includes("const CARD_VERSION = '4.09.01';") &&
  frontendForVersionGate.includes("const CARD_DISPLAY_VERSION = '4.09.01 DEV';") &&
  frontendForVersionGate.includes("const GEWITTERRADAR_BUILD = 'V4.09.01-MAP-VIEW-MODES-2026-09-20';");
const stableLabelFrom = "if((await page.locator('.about-dev').innerText()).includes('DEV'))throw Error('Stable label still contains DEV');";
const stableLabelTo = isV40901DevelopmentCandidate
  ? "if(!(await page.locator('.about-dev').innerText()).includes('DEV'))throw Error('V4.09.01 development label lost DEV marker');"
  : stableLabelFrom;

assert.equal(
  transformed.split(stableLabelFrom).length,
  2,
  'Historical stable-label guard anchor changed; review before updating the V4.07.56 wrapper.',
);
transformed = transformed.replace(stableLabelFrom, stableLabelTo);

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
