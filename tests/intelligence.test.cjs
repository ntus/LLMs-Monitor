const {test}=require('node:test');
const assert=require('node:assert/strict');
const I=require('../extension/intelligence.js');

const alert=(overrides={})=>({id:'2106013611231440980',provider:'bridgebench',kind:'nerf',severity:'warning',account:'@bridgemindai',title:'Model power dropped',summary:'Power is now 88%.',url:'https://x.com/bridgemindai/status/2106013611231440980',publishedAt:100,...overrides});

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
 const current={status:'ready',checkedAt:20,alerts:[alert(),alert({id:'new',url:'https://www.bridgebench.ai/nerf-bench',kind:'reset'})]};
 assert.deepEqual(I.newAlerts(previous,current).map(row=>row.id),['new']);
 assert.equal(I.newAlerts(current,current).length,0);
});

test('Nerf warning remains explicitly identified as external intelligence',()=>{
 const html=I.view({status:'ready',checkedAt:1,alerts:[alert()]},'en',true);
 assert(html.includes('Nerf warning'));assert(html.includes('external intelligence'));assert(html.includes('Source'));
});
