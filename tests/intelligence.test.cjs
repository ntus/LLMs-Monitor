const {test}=require('node:test');
const assert=require('node:assert/strict');
const I=require('../extension/intelligence.js');

const alert=(overrides={})=>({id:'2106013611231440980',provider:'openai',kind:'reset',severity:'warning',account:'@OpenAI',title:'Model power dropped',summary:'Power is now 88%.',url:'https://x.com/OpenAI/status/2106013611231440980',publishedAt:100,...overrides});

test('feed rejects unsafe links and escapes external text',()=>{
 const feed=I.normalize({status:'ready',checkedAt:1,alerts:[alert({url:'javascript:alert(1)'}),alert({id:'safe',title:'<img src=x onerror=alert(1)>'})]});
 assert.equal(feed.alerts.length,1);
 const html=I.view(feed,'ja',true);
 assert(!html.includes('<img'));assert(!html.includes('onerror='));assert(html.includes('https://x.com/'));
});

test('first successful poll establishes a baseline without notifications',()=>{
 assert.deepEqual(I.newAlerts({}, {status:'ready',checkedAt:10,alerts:[alert()]}),[]);
});

test('only unseen post ids are notified after the baseline',()=>{
 const previous={status:'ready',checkedAt:10,alerts:[alert()]};
 const current={status:'ready',checkedAt:20,alerts:[alert(),alert({id:'new',url:'https://x.com/OpenAI/status/new',kind:'usage'})]};
 assert.deepEqual(I.newAlerts(previous,current).map(row=>row.id),['new']);
 assert.equal(I.newAlerts(current,current).length,0);
});

test('Nerf-only legacy alerts are ignored and the board is link-only',()=>{
 assert.equal(I.normalizeAlert(alert({kind:'nerf'})),null);
 assert.equal(I.safeUrl('https://www.bridgebench.ai/nerf-bench'),'');
});
