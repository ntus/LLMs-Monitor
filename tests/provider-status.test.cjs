const {test}=require('node:test');
const assert=require('node:assert/strict');
const S=require('../extension/provider-status.js');
const fs=require('node:fs'),vm=require('node:vm');

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

test('floating alert details show only incident providers, while the main status view remains complete',()=>{
 const status={chatgpt:{state:'ok'},claude:{state:'issue',summary:'Elevated errors on platform.claude.com'},gemini:{state:'ok'}},before=structuredClone(status);
 for(const language of ['ja','en']){
  const compact=S.view(status,language,true,{issuesOnly:true}),main=S.view(status,language,true);
  assert.equal((compact.match(/class="provider-status-row/g)||[]).length,1);
  assert(compact.includes('<strong>Claude</strong>'));assert(!compact.includes('<strong>ChatGPT</strong>'));assert(!compact.includes('<strong>Gemini</strong>'));
  assert.equal((main.match(/class="provider-status-row/g)||[]).length,3);
  assert(compact.includes('https://status.claude.com/'));assert(compact.includes('Elevated errors on platform.claude.com'));
 }
 const multiple={chatgpt:{state:'issue',summary:'Latency'},claude:{state:'issue',summary:'Errors'},gemini:{state:'recovered'}};
 assert.equal((S.view(multiple,'en',true,{issuesOnly:true}).match(/class="provider-status-row/g)||[]).length,2);
 assert(!S.view(multiple,'en',true,{issuesOnly:true}).includes('<strong>Gemini</strong>'));
 assert.deepEqual(status,before);
});

test('floating healthy, recovered and unavailable details stay accessible after incidents clear',()=>{
 for(const state of ['ok','recovered','unknown']){
  const compact=S.view({claude:{state}},'en',true,{issuesOnly:true});
  assert.equal((compact.match(/class="provider-status-row/g)||[]).length,3);
  assert(compact.includes(state==='ok'?'Operational':state==='recovered'?'has-recovery':'Status unavailable'));
  assert(!compact.includes('has-issue'));
 }
 const mixed={claude:{state:'issue',summary:'Errors'},gemini:{state:'unknown'},chatgpt:{state:'ok'}};
 assert.equal((S.view(mixed,'en',true,{issuesOnly:true}).match(/class="provider-status-row/g)||[]).length,1);
});

test('the actual shared widget selects incident-only details without removing normal usage cards',()=>{
 const context=vm.createContext({console,URL,Date});
 for(const name of ['locale.js','preferences.js','provider-status.js','changes.js','shared.js'])vm.runInContext(fs.readFileSync('extension/'+name,'utf8'),context);
 const status={chatgpt:{state:'ok'},claude:{state:'issue',summary:'Errors'},gemini:{state:'ok'}};
 const html=context.Glance.widget({}, {language:'en'}, status,true);
 assert.equal((html.match(/class="provider-status-row/g)||[]).length,1);
 assert.equal((html.match(/class="widget-row"/g)||[]).length,3);
 assert(html.includes('<strong>Claude</strong>'));assert(!html.includes('<strong>ChatGPT</strong>'));
 assert.equal((context.GlanceProviderStatus.view(status,'en',true).match(/class="provider-status-row/g)||[]).length,3);
});
