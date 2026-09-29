const {test}=require('node:test');
const assert=require('node:assert/strict');
const S=require('../extension/provider-status.js');

test('official Statuspage summary reports an affected service',()=>{
 const report=S.parseStatuspage('claude',{status:{indicator:'major',description:'Partial outage'},components:[{id:'web',name:'Claude Web',status:'degraded_performance'}],incidents:[{name:'Claude Web latency',status:'investigating',components:[{id:'web'}]}]},123);
 assert.equal(report.state,'issue');assert.equal(report.summary,'Claude Web latency');assert.equal(report.checkedAt,123);
});
test('Gemini dashboard detects only active Gemini incidents',()=>{
 assert.equal(S.parseGemini([{service_name:'Gmail',status_impact:'SERVICE_OUTAGE'},{service_name:'Gemini',end:'2026-01-01',status_impact:'SERVICE_OUTAGE'}]).state,'ok');
 assert.equal(S.parseGemini([{service_name:'Gemini',status_impact:'SERVICE_DISRUPTION',external_desc:'Temporary Gemini issue'}]).state,'issue');
});
test('untrusted incident summaries are escaped in every view',()=>{
 const html=S.view({claude:{state:'issue',summary:'<img src=x onerror=alert(1)>',checkedAt:1}},'en',true);
 assert(!html.includes('<img'));assert(!html.includes('onerror='));assert(html.includes('https://status.claude.com/'));
});
test('an unchanged issue key does not represent a new notification',()=>{
 const first=S.normalize({claude:{state:'issue',summary:'Outage',checkedAt:1}});
 const second=S.normalize({claude:{state:'issue',summary:'Outage',checkedAt:2}});
 assert.equal(S.incidentKey(first),S.incidentKey(second));
});
