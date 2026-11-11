// Expected source changes for the owner-specific persistence adapter. Callers
// still compare the full source, including weather logic, against a protected ref.
const IMPORT = "import {settingsStorage} from '../core/settings-vault.js?v=411182r1';\n";
export function withVaultStorage(reference, path) {
  const file = path.split('/').at(-1);
  if (!['precipitation-layer.js', 'wind-display.js', 'temperature-display.js', 'controls.js'].includes(file)) {
    return reference;
  }
  let expected = IMPORT + reference.replaceAll('localStorage.', 'settingsStorage(this).');
  if (file === 'wind-display.js') expected = expected.replace('readWindConfig()', 'readWindConfig(settingsStorage(this))');
  if (file === 'temperature-display.js') expected = expected.replace('readTemperatureConfig()', 'readTemperatureConfig(settingsStorage(this))');
  if (file === 'controls.js') {
    expected = expected.replace("  {id:'settings-diagnostic-section'", "  {id:'gr-vault-section',number:'',title:'Userprofile & Sicherungen'},\n  {id:'settings-diagnostic-section'");
    expected = expected.replace("entry.number+(entry.number.includes('.')?' ':'. ')+headingFor(entry)",
      "entry.number ? entry.number+(entry.number.includes('.')?' ':'. ')+headingFor(entry) : headingFor(entry)");
  }
  return expected;
}

export function normaliseGeneratedModule(source) {
  return source.replaceAll('\r\n', '\n').replace(/\?v=[^'"\s]+/g, '')
    .replace(/(export const MODULE_META\s*=\s*Object\.freeze\(\{\s*"?id"?:\s*['"][^'"]+['"],\s*"?version"?:\s*)(['"])[\d.]+\2/, '$1$2generated$2');
}
