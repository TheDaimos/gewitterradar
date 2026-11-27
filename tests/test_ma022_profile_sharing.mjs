// MA-022: deterministic UI list, target validation, protected API boundaries.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const root=new URL('../',import.meta.url);
const source=readFileSync(new URL('frontend/modules/monitored-areas/profile-sharing.js',root),'utf8');
const manager=readFileSync(new URL('frontend/modules/monitored-areas/location-manager.js',root),'utf8');
const controls=readFileSync(new URL('frontend/modules/ui/controls.js',root),'utf8');
const api=readFileSync(new URL('custom_components/gewitterradar/monitored_areas/api.py',root),'utf8');
const module=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const a={uid:'6ab3f741-d65b-4ee2-83d9-4ad3cd11c0a9',name:'Havanna',revision:4};
const b={uid:'2a1c8b3c-f3b7-4a81-b946-0d9c14bfb414',name:'Hamburg',revision:3};
let visible=module.ma022Choices([a,a,b,{uid:'bad',revision:3}], 'burg',new Set([b.uid]));
assert.equal(visible.length,1);
assert.equal(visible[0].uid,b.uid);
assert.equal(visible[0].selected,true);
assert.equal(module.ma022Choices([a,b],'').length,2);
assert.deepEqual(module.ma022Target(' alice ','0123456789abcdef0123456789abcdef'),
 {user:'alice',profile:'0123456789abcdef0123456789abcdef'});
assert.throws(()=>module.ma022Target('bob','wrong'),/MA_INVALID_TARGET/);
assert.throws(()=>module.ma022Target(' ','0123456789abcdef0123456789abcdef'),/MA_INVALID_TARGET/);
assert.match(source,/mode==="db_active"&&verifyContext\(\)===true/);
assert.match(source,/if\(!globalThis\.confirm\?\.\(action\)\)return/);
assert.match(source,/await shareLocation\(p\.uid,target\.user,target\.profile,p\.revision,makeRequestId\(\),\{transfer\}\)/);
assert.match(source,/for\(const p of chosen\)/,'batch decisions are explicit and sequential');
assert.match(source,/picked\.delete\(p\.uid\)/,'successful entries are not retried automatically');
assert.match(source,/failures\.push/,'partial failures are surfaced');
assert.match(source,/await getPreferences\(place\.uid\)/);
assert.match(source,/await updatePreferences\(link,patch,revision,makeRequestId\(\)\)/);
assert.match(source,/setStatus\(t\.disclaimer/); // Must not claim notifications are already running
assert.match(manager,/openProfiles:?\b|typeof openProfiles/);
assert.match(manager,/profileButton\.disabled=state\.busy\|\|plan\.mode!=='db_active'/);
assert.match(controls,/port\?\.mode!=='db_active'/);
assert.match(controls,/module\.openProfileSharing\(this,/);
assert.match(controls,/verifyContext:\(\)=>sameProfile\(\)&&this\._maSavedMode==='db_active'/);
assert.match(api,/"preferences_get"/);
assert.match(api,/if op=="preferences_get":/);
assert.match(api,/link_id=_actor_link\(c,location_id,actor_user_id,profile\)/);
assert.doesNotMatch(source,/callWS\(|callService\(|localStorage|todo\.|migration_finalize_commit|links_remove|innerHTML/);
console.log('PASS MA-022 role-scoped batch UI, migration gate, explicit share and own preferences');
