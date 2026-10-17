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

test('unconfigured and failed polls never establish the initial notification baseline',()=>{
 const r={status:'ready',checkedAt:20,alerts:[alert()]};
 assert.equal(I.newAlerts({status:'unconfigured',checkedAt:10,alerts:[]},r).length,0);
 assert.equal(I.newAlerts({status:'unavailable',checkedAt:10,alerts:[]},r).length,0);
 assert.equal(I.newAlerts(r,{status:'unavailable',checkedAt:30,alerts:[alert({id:'late'})]}).length,0);
 assert.equal(I.newAlerts({...r,status:'unavailable',lastReadyAt:20},{...r,checkedAt:40,alerts:[alert(),alert({id:'new'})]}).length,1);
});

test('public source links reject credentials, ports, host lookalikes and unrelated X pages',()=>{
 for(const u of ['https://x.com@evil.test/OpenAI/status/1','https://user:secret@x.com/OpenAI/status/1','https://x.com:8443/OpenAI/status/1','https://x.com.evil.test/OpenAI/status/1','https://x.com/home','https://x.com/OpenAI/status/1?secret=test','https://x.com/OpenAI/status/1#token'])assert.equal(I.safeUrl(u),'');
});
test('real background polling notifies only a new Tibo post after a successful baseline',async()=>{
 const fs=require('node:fs'),vm=require('node:vm'),e=()=>({addListener(){}}),stored={settings:{sound:true,volume:18},intelligenceFeed:{status:'unconfigured',checkedAt:10,alerts:[]}},notifications=[],tones=[];
 const chrome={runtime:{id:'a'.repeat(32),getURL:n=>'chrome-extension://'+'a'.repeat(32)+'/'+n,onMessage:e(),onMessageExternal:e(),onInstalled:e(),onStartup:e()},action:{onClicked:e()},alarms:{onAlarm:e()},tabs:{onRemoved:e()},windows:{onRemoved:e()},permissions:{onRemoved:e()},notifications:{onClicked:e(),create:async(id,row)=>notifications.push({id,row})},storage:{local:{get:async()=>structuredClone(stored),set:async v=>Object.assign(stored,structuredClone(v))}}};
 const c=vm.createContext({chrome,URL,Date,setTimeout,clearTimeout,AbortController});c.importScripts=(...files)=>files.forEach(f=>vm.runInContext(fs.readFileSync('extension/'+f,'utf8'),c));vm.runInContext(fs.readFileSync('extension/background.js','utf8'),c);
 c.fakeFeed={status:'ready',checkedAt:20,alerts:[alert({account:'@thsottiaux · OpenAI staff'})]};c.tone=async v=>tones.push(v);vm.runInContext('statusJson=async()=>fakeFeed;playStatusAlert=tone',c);
 await vm.runInContext('refreshIntelligence()',c);assert.equal(notifications.length,0);
 c.fakeFeed={status:'ready',checkedAt:30,alerts:[...c.fakeFeed.alerts,alert({id:'later',account:'@thsottiaux · OpenAI staff',summary:'Codex limits reset'})]};await vm.runInContext('refreshIntelligence()',c);assert.equal(notifications.length,1);assert.match(notifications[0].row.message,/thsottiaux/);assert.deepEqual(tones,[18]);await vm.runInContext('refreshIntelligence()',c);assert.equal(notifications.length,1);
 vm.runInContext("statusJson=async()=>{throw Error('Simulated failure')}",c);await vm.runInContext('refreshIntelligence()',c);assert.equal(stored.intelligenceFeed.status,'unavailable');assert.equal(stored.intelligenceFeed.alerts.length,2);assert.equal(notifications.length,1);assert.equal(Object.hasOwn(stored,'data'),false);assert.equal(Object.hasOwn(stored,'history'),false);
});
test('an observed public author with no matching prior announcement still notifies on a later first matching post',()=>{const prior={status:'ready',readerState:'ready',lastReadyAt:10,observedAuthors:['thsottiaux'],alerts:[]},current={status:'ready',readerState:'ready',alerts:[alert({account:'@thsottiaux · OpenAI staff',url:'https://x.com/thsottiaux/status/123',id:'123'})]};assert.equal(I.newAlerts(prior,current).length,1)});
