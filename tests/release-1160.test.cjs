const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=path=>fs.readFileSync(path,'utf8');
require('../extension/locale.js');
require('../extension/preferences.js');
require('../extension/provider-status.js');
require('../extension/intelligence.js');
require('../extension/changes.js');
require('../extension/shared.js');

test('reset entitlement displays the exact official wording below availability',()=>{
 const officialText='完全リセット（週間＋5 時間） 有効期限：10月30日';
 const html=Glance.extras({chatgpt:{status:'ready',extras:[{label:'利用上限のリセット',value:'利用可能 1',officialText,expiresAt:Date.now()+20*86400000}]}},'chatgpt');
 assert.match(html,/<div class="entitlement-line">[\s\S]*?<\/div><div class="entitlement-official"/);
 assert(html.includes(officialText));
 assert(!html.includes('期限未取得'));
});

test('5% and 1% changed session values select distinct warning levels',()=>{
 const tracker=GlanceChanges.createTracker();
 tracker.observe('claude','window:現在のセッション','6%',1000);
 tracker.observe('claude','window:現在のセッション','5%',2000);
 assert.equal(tracker.alertLevel(),'low');
 tracker.observe('claude','window:現在のセッション','1%',3000);
 assert.equal(tracker.alertLevel(),'critical');
 tracker.observe('claude','window:現在のセッション','10%',4000);
 assert.equal(tracker.alertLevel(),'normal');
 const offscreen=read('extension/offscreen.js'),sound=read('extension/sound.js');
 for(const level of ['low','critical']){assert(offscreen.includes(`message.level==='${level}'`));assert(sound.includes(`level==='${level}'`));}
});
