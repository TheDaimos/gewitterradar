import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {readAboutLocaleModel} from './verify-about-locales.mjs';

const root = fileURLToPath(new URL('..', import.meta.url));
const source = await readFile(resolve(root, 'frontend/gewitterradar.js'), 'utf8');
const externalSource = await readFile(resolve(root, 'frontend/locales/about-locales.js'), 'utf8');
const model = readAboutLocaleModel(source, externalSource);

model.installExternal(model.externalAboutLocales, model.externalHelpLocales);

const languages = model.languages.map(entry => entry.value);
assert.equal(languages.length, 19, 'Recorder release audit must cover all 19 registered language variants');

const recorderSources = [
  'geo_location.lightning_strike*',
  'sensor.*_lightning_distance',
  'sensor.*_lightning_azimuth',
  'sensor.*_lightning_counter'
];
const expectedYaml = `recorder:\n  exclude:\n    entity_globs:\n      - "geo_location.lightning_strike*"\n      - "sensor.*_lightning_distance"\n      - "sensor.*_lightning_azimuth"\n      - "sensor.*_lightning_counter"`;
assert.equal(model.recorderYaml, expectedYaml, 'Recorder YAML must use exactly the four current wildcard sources');

const forbiddenLegacy = [
  'sensor.home_lightning_distance',
  'sensor.home_lightning_azimuth',
  'sensor.home_lightning_counter'
];
for (const legacy of forbiddenLegacy) {
  assert.equal(model.recorderYaml.includes(legacy), false, `Legacy fixed Recorder source remains in YAML: ${legacy}`);
  assert.equal(externalSource.includes(legacy), false, `Legacy fixed Recorder source remains in locale module: ${legacy}`);
}

const requiredAboutStrings = [
  'recorder', 'recorderText', 'recorderBenefit',
  'copy', 'copied', 'copyFailed', 'merge', 'live'
];

for (const language of languages) {
  const locale = model.resolve(language);
  assert.ok(locale, `${language}: locale must resolve`);

  for (const key of requiredAboutStrings) {
    assert.equal(typeof locale.strings[key], 'string', `${language}: about.${key} must be text`);
    assert.ok(locale.strings[key].trim(), `${language}: about.${key} must not be empty`);
  }
  assert.ok(locale.strings.recorderText.includes('configuration.yaml'), `${language}: Recorder guidance must name configuration.yaml`);
  assert.ok(locale.strings.merge.includes('recorder:'), `${language}: merge guidance must preserve recorder: syntax`);

  assert.deepEqual(Object.keys(locale.sourcePurposes), recorderSources, `${language}: source-purpose keys must match current Recorder wildcards`);
  for (const sourceKey of recorderSources) {
    assert.equal(typeof locale.sourcePurposes[sourceKey], 'string', `${language}: missing source purpose for ${sourceKey}`);
    assert.ok(locale.sourcePurposes[sourceKey].trim(), `${language}: empty source purpose for ${sourceKey}`);
  }

  const recorderSections = locale.help.sections.filter(section => section.key === 'recorder');
  assert.equal(recorderSections.length, 1, `${language}: Help must contain exactly one Recorder section`);
  const recorder = recorderSections[0];
  assert.equal(recorder.recorder, true, `${language}: Help Recorder section must render the canonical YAML block`);
  assert.equal(recorder.paragraphs.length, 1, `${language}: Help Recorder section must contain its explanation`);
  assert.ok(recorder.paragraphs[0].trim(), `${language}: Help Recorder explanation must not be empty`);
  assert.equal(recorder.notes.length, 4, `${language}: Help Recorder section must contain all four safety/operation notes`);
  for (const [index, note] of recorder.notes.entries()) {
    assert.equal(typeof note, 'string', `${language}: Recorder note ${index + 1} must be text`);
    assert.ok(note.trim(), `${language}: Recorder note ${index + 1} must not be empty`);
  }
  assert.ok(recorder.notes[0].includes('recorder:'), `${language}: first Recorder note must preserve recorder: syntax`);

  console.log(`PASS recorder locale: ${language}`);
}

console.log(`PASS: Recorder release audit covers ${languages.length} registered variants, the canonical four-source wildcard YAML, About copy/merge/live guidance, Help Recorder notes, and rejects legacy fixed sensor IDs.`);
