import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {HELP_EXTERNAL_LOCALES_V40753, ABOUT_EXTERNAL_LOCALES} from '../frontend/locales/about-locales.js';

const base = readFileSync(new URL('../frontend/modules/core/base-context.js', import.meta.url), 'utf8');
const external = readFileSync(new URL('../frontend/locales/about-locales.js', import.meta.url), 'utf8');
assert.match(base, /subtitle:'Funktionen und Einstellungen – einfach erklärt\.'/);
assert.match(base, /subtitle:'Features and settings – simply explained\.'/);
assert.equal(Object.keys(HELP_EXTERNAL_LOCALES_V40753).length, 17);
assert.deepEqual(Object.keys(HELP_EXTERNAL_LOCALES_V40753).sort(), Object.keys(ABOUT_EXTERNAL_LOCALES).sort());
for (const [language, help] of Object.entries(HELP_EXTERNAL_LOCALES_V40753)) {
  assert.equal(typeof help.subtitle, 'string', `${language}: subtitle missing`);
  assert.ok(help.subtitle.length > 15 && help.subtitle.length < 100, `${language}: invalid subtitle length`);
  assert.ok(!/Gewitterradar/i.test(help.subtitle), `${language}: help subtitle must describe functions and settings`);
}
for (const former of ['En kort vejledning, så Gewitterradar fungerer', 'Una guía breve para que Gewitterradar funcione', 'Kort verklort, dormit Gewitterradar', 'Kurz erklärt, damit Gewitterradar zuverlässig']) {
  assert.ok(!base.includes(former) && !external.includes(former), `Stale subtitle: ${former}`);
}
assert.equal((external.match(/"subtitle": "(?:Funktioner og indstillinger|Funciones y ajustes|Fonctionnalités et paramètres|Functies en instellingen|Funkcje i ustawienia|Funcionalidades e definições|Funktioner och inställningar|Funzioni e impostazioni|Funksjoner og innstillinger|Toiminnot ja asetukset|Funkce a nastavení|Λειτουργίες και ρυθμίσεις|Funkciók és beállítások|Funktionen und Einstellungen – oafach|Funkschonen un Instellungen|Funggsionen un Einstellunge|Funktionen ond Eistellunge)/g) || []).length, 51,
  'All three mirrored locale sections must contain all 17 translated subtitles');

console.log('PASS GR 4.11.247: Help & Notes subtitles cover 19 languages and all three locale mirrors.');
