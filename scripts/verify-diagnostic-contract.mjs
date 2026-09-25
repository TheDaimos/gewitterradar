import { readFile, access, readdir } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';

const root = process.cwd();
const protectedSince = [4, 7, 56];
const expectedAcceptedSourceSha = '249485f4bcf68c9b23b821cae9b507030ae09cff5a56f7e28d3d7f3b02eb4a1a';
const expectedAcceptedSourceSize = 1955141;
const manifestPath = resolve(root, 'tests/contracts/diagnostic-contract-v4.07.56.json');

const errors = [];
const fail = (msg) => errors.push(msg);
const requireText = (source, text, label = text) => { if (!source.includes(text)) fail(`missing ${label}`); };
const requireAll = (source, values, group) => values.forEach((v) => requireText(source, v, `${group}: ${v}`));

function parseVersion(source) {
  const match = source.match(/CARD_VERSION\s*=\s*['\"](\d+)\.(\d+)\.(\d+)['\"]/)
    || source.match(/CARD_DISPLAY_VERSION\s*=\s*['\"](?:V)?(\d+)\.(\d+)\.(\d+)['\"]/);
  return match ? match.slice(1, 4).map(Number) : null;
}
function atLeast(version, floor) {
  if (!version) return false;
  for (let i = 0; i < 3; i += 1) {
    if (version[i] > floor[i]) return true;
    if (version[i] < floor[i]) return false;
  }
  return true;
}

function section(source, startMarker, endMarker, label) {
  const start = source.indexOf(startMarker);
  const end = start >= 0 ? source.indexOf(endMarker, start + startMarker.length) : -1;
  if (start < 0 || end < 0) {
    fail(`missing protected section ${label}`);
    return '';
  }
  return source.slice(start, end);
}


async function readModularSource(entryPath, source) {
  const version = parseVersion(source);
  if (!version || !atLeast(version, [4, 10, 2])) return source;
  const moduleRoot = resolve(dirname(entryPath), 'modules');
  const chunks = [source];
  async function walk(dir) {
    let entries = [];
    try { entries = await readdir(dir, { withFileTypes: true }); } catch { return; }
    entries.sort((a, b) => a.name.localeCompare(b.name));
    for (const entry of entries) {
      const path = resolve(dir, entry.name);
      if (entry.isDirectory()) await walk(path);
      else if (entry.isFile() && entry.name.endsWith('.js')) chunks.push(await readFile(path, 'utf8'));
    }
  }
  await walk(moduleRoot);
  return chunks.join('\n');
}

function verifyContract(source, label, languages) {
  const before = errors.length;
  requireAll(source, [
    'settings-diagnostics-toggle', 'diagnostic-console', 'diagnostic-console-drag',
    'diagnostic-minimize', 'diagnostic-visuals', 'diagnostic-exit', 'diagnostic-exit-top',
    'diagnostic-master-active', 'diagnostic-childtools-hidden'
  ], 'master lifecycle');

  requireAll(source, [
    'data-diagnostic-storm="off"', 'data-diagnostic-storm="observation"',
    'data-diagnostic-storm="storm"', 'data-diagnostic-storm="danger"',
    'data-diagnostic-storm="all"', 'diagnostic-storm-cells-minus',
    'diagnostic-storm-cells-plus', 'diagnostic-storm-extreme',
    '_setDiagnosticVirtualStormCellCount', '_setDiagnosticVirtualStormExtreme',
    '_buildDiagnosticVirtualStorm', '_clusterExtremeThreshold(zoom)',
    'Math.max(1,Math.min(5', "_setDiagnosticVirtualStorm('off',{sync:false,render:false})"
  ], 'virtual thunderstorm');

  requireAll(source, [
    'data-medallion-preset="empty">LEER',
    'data-medallion-preset="static">PFEIL',
    'data-medallion-preset="animation">TREND',
    'data-medallion-preset="freeze">FREEZE',
    'data-medallion-preset="normal">NORMAL',
    'data-medallion-arrow="on"', 'data-medallion-arrow="off"',
    'data-medallion-animation="on"', 'data-medallion-animation="off"',
    'data-medallion-freeze="on"', 'data-medallion-freeze="off"',
    'data-medallion-angle="0"', 'data-medallion-angle="45"',
    'data-medallion-angle="90"', 'data-medallion-angle="180"',
    'data-medallion-angle="270"'
  ], 'medallion states');

  requireAll(source, [
    'diagnostic-compass-calibration', 'diagnostic-medallion-calibration',
    'diagnostic-copy-json', 'diagnostic-download', 'diagnostic-snapshot',
    'diagnostic-performance', 'diagnostic-panel-table',
    'axes:true', 'diagonals:true', 'baselines:true', 'padding:true',
    'margin:true', 'spacing:true', 'safe:true', 'overflow:true',
    'parent:true', 'alignment:true', 'centers:true', 'boxes:true', 'ids:true'
  ], 'measurement and export tools');

  requireAll(source, [
    'this._diagnostics.enabled=false', 'this._diagnostics.visualsVisible=true',
    "this._setDiagnosticVirtualStorm('off',{sync:false,render:false})",
    'this._diagnostics.virtualStorm.cellCount=1',
    'this._diagnostics.virtualStorm.extreme=false',
    'this._setCompassCalibrationEnabled(false)',
    'this._setMedallionCalibrationEnabled(false)',
    'this._closeCompassCalibrationQuick(false)',
    'this._closeMedallionCalibration(false)'
  ], 'master hard-stop');

  requireAll(source, [
    'handle.setPointerCapture?.(event.pointerId)',
    "handle?.addEventListener('pointermove'",
    'window.visualViewport', '_clampDiagnosticConsole()',
    "localStorage.setItem('gewitterradar-diagnostic-position'"
  ], 'console mobility');

  requireAll(source, [
    'diagnostic-visuals-hidden', 'diagnostic-childtools-hidden',
    "querySelectorAll('#diagnostic-exit,#diagnostic-exit-top')"
  ], 'hide/stop separation');

  const bindBlock = section(source, '\n    _bindDiagnosticControls() {', '\n    _startDiagnostics() {', 'diagnostic control binding');
  requireAll(bindBlock, [
    "querySelectorAll('[data-diagnostic-storm]')",
    'diagnostic-storm-cells-minus', 'diagnostic-storm-cells-plus', 'diagnostic-storm-extreme',
    "getElementById('diagnostic-visuals')",
    "querySelectorAll('#diagnostic-exit,#diagnostic-exit-top')",
    "getElementById('diagnostic-minimize')",
    "addEventListener('pointerdown'", "addEventListener('pointermove'", 'setPointerCapture'
  ], 'diagnostic control binding');

  const stopBlock = section(source, '\n    _stopDiagnostics() {', '\n    _clampDiagnosticConsole() {', 'master hard-stop');
  requireAll(stopBlock, [
    'this._diagnostics.enabled=false', 'this._diagnostics.visualsVisible=true',
    "this._setDiagnosticVirtualStorm('off',{sync:false,render:false})",
    'this._diagnostics.virtualStorm.cellCount=1', 'this._diagnostics.virtualStorm.extreme=false',
    'this._setCompassCalibrationEnabled(false)', 'this._setMedallionCalibrationEnabled(false)',
    'this._closeCompassCalibrationQuick(false)', 'this._closeMedallionCalibration(false)'
  ], 'master hard-stop section');

  const virtualBuildBlock = section(source, '\n    _buildDiagnosticVirtualStorm(', '\n    _setDiagnosticVirtualStorm(', 'virtual thunderstorm generator');
  requireAll(virtualBuildBlock, [
    "scenario==='all'?['observation','storm','danger']:[scenario]",
    'Math.max(1,Math.min(5', '_clusterExtremeThreshold(zoom)',
    'extremeThreshold', 'danger:', 'storm:', 'observation:'
  ], 'virtual thunderstorm generator');

  const syncBlock = section(source, '\n    _syncDiagnosticUi() {', '\n    _scheduleDiagnosticMeasure()', 'diagnostic UI synchronization');
  requireAll(syncBlock, [
    'diagnostic-master-active', 'diagnostic-visuals-hidden', 'diagnostic-childtools-hidden',
    'diagnostic-console', 'diagnostic-minimize', 'diagnostic-virtual-storm-state'
  ], 'diagnostic UI synchronization');

  const stormStart = source.indexOf('const DIAGNOSTIC_VIRTUAL_STORM_UI =');
  const stormEnd = source.indexOf('const DIAGNOSTIC_MODE_LABEL =', stormStart);
  if (stormStart < 0 || stormEnd < 0) fail('diagnostic virtual-storm translation table missing');
  else {
    const table = source.slice(stormStart, stormEnd);
    languages.forEach((lang) => requireText(table, `'${lang}'`, `virtual storm translation: ${lang}`));
  }

  if (errors.length === before) console.log(`Diagnostic contract OK: ${label}`);
  else console.error(`Diagnostic contract violations in: ${label}`);
}

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
if (manifest?.acceptedSource?.sha256 !== expectedAcceptedSourceSha) fail('accepted V4.07.56 source SHA in contract manifest changed');
if (manifest?.acceptedSource?.sizeBytes !== expectedAcceptedSourceSize) fail('accepted V4.07.56 source size in contract manifest changed');
if (manifest?.protectedSince !== '4.07.56') fail('protectedSince in contract manifest changed');
if (!Array.isArray(manifest.requiredLanguages) || manifest.requiredLanguages.length !== 19) fail('diagnostic language contract must contain exactly 19 variants');

const candidates = [
  process.env.DIAGNOSTIC_SOURCE,
  'frontend/gewitterradar.js',
  'custom_components/gewitterradar/frontend/gewitterradar.js',
  'dashboard/dist/gewitterradar.js'
].filter(Boolean);
let checkedCurrent = 0;
for (const rel of [...new Set(candidates)]) {
  const path = resolve(root, rel);
  try { await access(path); } catch { continue; }
  const source = await readFile(path, 'utf8');
  const version = parseVersion(source);
  if (process.env.DIAGNOSTIC_SOURCE || atLeast(version, protectedSince)) {
    const contractSource = await readModularSource(path, source);
    verifyContract(contractSource, `${rel}${version ? ` @ ${version.join('.')}` : ''}`, manifest.requiredLanguages);
    checkedCurrent += 1;
  }
}

if (!checkedCurrent) console.log('No canonical frontend >= V4.07.56 present yet; frozen contract manifest validated.');
if (errors.length) {
  for (const error of errors) console.error(`DIAGNOSTIC CONTRACT FAILED: ${error}`);
  process.exit(1);
}
console.log('Protected diagnostic contract: PASS');
