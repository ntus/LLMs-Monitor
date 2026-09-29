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

test('issue recovery stays green briefly and then returns to operational',()=>{
 const issue={claude:{state:'issue',summary:'Service disruption',checkedAt:100}};
 const healthy={claude:{state:'ok',summary:'All systems operational',checkedAt:200}};
 const recovered=S.transition(issue,healthy,200);
 assert.equal(recovered.claude.state,'recovered');
 assert(S.view(recovered,'ja').includes('復帰しました'));
 assert(S.view(recovered,'en').includes('recovered'));
 assert.equal(S.transition(recovered,healthy,200+300000).claude.state,'recovered');
 assert.equal(S.transition(recovered,healthy,200+600001).claude.state,'ok');
});

test('a temporary status fetch failure does not erase recovery evidence',()=>{
 const issue={gemini:{state:'issue',summary:'Disruption',checkedAt:100}};
 const unknown=S.transition(issue,{gemini:{state:'unknown',summary:'Unavailable',checkedAt:200}},200);
 assert.equal(S.transition(unknown,{gemini:{state:'ok',summary:'Operational',checkedAt:300}},300).gemini.state,'recovered');
});
