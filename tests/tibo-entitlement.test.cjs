const {test}=require('node:test'),assert=require('node:assert/strict');
require('../extension/locale.js');require('../extension/preferences.js');require('../extension/provider-status.js');require('../extension/intelligence.js');require('../extension/changes.js');require('../extension/shared.js');
const R=require('../extension/tibo-reader.js');
test('reset availability and count share one official link; Tibo profile stays below entitlement',()=>{
 GlanceLocale.setLanguage('ja');const html=Glance.extras({chatgpt:{status:'ready',extras:[{label:'利用上限のリセット',value:'利用可能 1'}]}},'chatgpt');assert.match(html,/>\[利用可能\] ×1<\/a>/);assert.match(html,/class="entitlement-tibo"/);assert.match(html,/href="https:\/\/x.com\/thsottiaux"/);assert(!html.includes('⚠︎ Tibo'));assert.equal(Glance.extras({claude:{}},'claude').includes('entitlement-tibo'),false);
});
test('future reset announcement links the dated warning to the exact post; expiry restores plain profile',()=>{
 const now=Date.now(),alert=R.classify({id:'123',account:'thsottiaux',text:'Global reset landing by EOD PST time.',createdAt:new Date(now).toISOString()},now);alert.resetAt=now+3600000;const data={chatgpt:{status:'ready',extras:[]}},feed={status:'ready',checkedAt:now,alerts:[alert]},html=Glance.extras(data,'chatgpt',false,feed);assert.match(html,/⚠︎ Tibo 𝕏 Reset\?/);assert.match(html,/href="https:\/\/x.com\/thsottiaux\/status\/123"/);assert(html.includes('title='));alert.resetAt=now-1;const expired=Glance.extras(data,'chatgpt',false,feed);assert(!expired.includes('⚠︎ Tibo'));assert.match(expired,/href="https:\/\/x.com\/thsottiaux"/);
});
