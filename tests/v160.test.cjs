const {test}=require('node:test');
const assert=require('node:assert/strict');
require('../extension/locale.js');
const P=require('../extension/preferences.js');
const A=require('../extension/advice.js');
require('../extension/changes.js');
require('../extension/shared.js');

test('旧設定は全表示に移行し、非表示と順序は独立して保持する',()=>{
 assert.deepEqual(P.visible({}),['chatgpt','claude','gemini']);
 const settings=P.normalize({serviceOrder:['gemini','gemini','bad','chatgpt'],hiddenServices:['chatgpt','bad']});
 assert.deepEqual(settings.serviceOrder,['gemini','chatgpt','claude']);
 assert.deepEqual(P.visible(settings),['gemini','claude']);
 assert.deepEqual(P.visible({hiddenServices:P.SERVICES}),[]);
});

test('現在枠・週間枠の警告境界と期限不明を区別する',()=>{
 const now=Date.UTC(2026,8,29),hour=3600000;
 assert.equal(Glance.resetLevel({label:'現在のセッション',resetAt:now+2*hour},now),'');
 assert.equal(Glance.resetLevel({label:'現在のセッション',resetAt:now+119*60000},now),'deadline-near');
 assert.equal(Glance.resetLevel({label:'現在のセッション',resetAt:now+59*60000},now),'deadline-critical');
 assert.equal(Glance.resetLevel({label:'週間',resetAt:now+23*hour},now),'deadline-near');
 assert.equal(Glance.resetLevel({label:'週間',resetAt:now+59*60000},now),'deadline-critical');
 assert.equal(Glance.resetLevel({label:'週間'},now),'');
});

test('同期履歴が十分な時だけ週間に対する現在枠の推定数を返す',()=>{
 const now=Date.UTC(2026,8,29),hour=3600000;
 const service={windows:[{label:'現在のセッション',remaining:60},{label:'週間',remaining:50}],history:{'現在のセッション':[{capturedAt:now-2*hour,remaining:90},{capturedAt:now-hour,remaining:60}],'週間':[{capturedAt:now-2*hour,remaining:65},{capturedAt:now-hour,remaining:50}]}};
 assert.equal(A.sessionEquivalent(service,now).count,1);
 assert.equal(A.sessionEquivalent({...service,history:{}},now),null);
});

test('TipsとNEWSには公式原文へのHTTPSリンクが付く',()=>{
 const items=A.sourcedUpdates(Date.UTC(2026,8,29));
 assert(items.some(item=>item.id.startsWith('tip-')));
 assert(items.some(item=>item.id.startsWith('news-')));
 assert(items.every(item=>/^https:\/\//.test(item.url)&&item.source));
});
