// MA-020 pre-cutover SQLite inspection is read-only and profile-scoped.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const path=new URL('../frontend/modules/monitored-areas/migration-wizard.js',import.meta.url);
const source=readFileSync(path,'utf8');
const {summarizeSqlitePreview}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const place=(id,archived=false)=>({location_id:id,name:archived?'Hamburg Alt':'Hamburg',
  latitude:53.55,longitude:10.01,archived,revision:1,location_origin:'gr_manual'});
const rows=[place('a'),place('b',true),place('c')],copy=structuredClone(rows);
const group=summarizeSqlitePreview(rows);
assert.equal(group.total,3);
assert.equal(group.active.length,2);
assert.equal(group.archived.length,1);
assert.deepEqual(rows,copy,'read-only grouping must not mutate supplied data');
for(const input of [null,{},[place('a'),place('a')],[{...place('a'),latitude:NaN}],
  [{...place('a'),archived:'false'}],[{...place('a'),name:{}}]])
  assert.throws(()=>summarizeSqlitePreview(input),/MA_SQLITE_PREVIEW_INVALID/);
assert.match(source,/data-sql-preview/);
assert.match(source,/SQLite-Daten ansehen \(nur lesen\)/);
assert.match(source,/call\("places_list",\{limit:100,include_archived:true/);
assert.match(source,/\["migration_pending","db_active"\]/);
assert.match(source,/if\(cursor\)throw new Error/);
assert.match(source,/sqlPreviewBox\.hidden=true;sqlPreviewBox\.replaceChildren/);
const inspection=source.slice(source.indexOf('const openSqlPreview=async()=>'),source.indexOf('const prepareFinalize=async()=>'));
assert.ok(inspection.startsWith('const openSqlPreview'));
assert.doesNotMatch(inspection,/migration_commit|migration_finalize_commit|location_update|todo\.remove_item|request_id/);
assert.match(inspection,/textContent=item\.name/,'do not inject untrusted place names as HTML');
console.log('PASS MA-020 SQLite preview: archived grouping, invalid rows, read-only paging, safe DOM');

const controls=readFileSync(new URL('../frontend/modules/ui/controls.js',import.meta.url),'utf8');
assert.match(controls,/import \{migrationRequestUUID\} from/);
assert.doesNotMatch(controls,/crypto\.randomUUID\(\)/,'SQLite writes must work on HTTP/Android HA');
assert.equal((controls.match(/migrationRequestUUID\(\)/g)||[]).length,5);
assert.match(source,/proof\?\.source_and_sqlite_verified!==true/);
assert.match(source,/proof\.active_count\+proof\.archived_count!==proof\.item_count/);
assert.match(source,/proof\?\.explicit_confirmation_required!==true/);
