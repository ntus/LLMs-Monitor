const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const S=require('../extension/state.js');
const root=path.resolve(__dirname,'..');
function harness(){
 const stored={data:{},history:{},settings:{sound:false},apiCredits:{chatgpt:{enabled:true}},historyVersion:0};
 let internal,external;
 const event=()=>({addListener(){}}),local={get:async keys=>Object.fromEntries((Array.isArray(keys)?keys:[keys]).map(k=>[k,structuredClone(stored[k])])),set:async x=>Object.assign(stored,structuredClone(x))};
 const chrome={storage:{local},runtime:{getURL:x=>'chrome-extension://'+'a'.repeat(32)+'/'+x,getManifest:()=>({version:'1.25.0'}),onMessage:{addListener:f=>internal=f},onMessageExternal:{addListener:f=>external=f},onInstalled:event(),onStartup:event()},alarms:{onAlarm:event()},action:{onClicked:event()},windows:{onRemoved:event()},tabs:{onRemoved:event()},notifications:{onClicked:event()},i18n:{getUILanguage:()=> 'en'},permissions:{contains:async()=>true,onRemoved:event()},scripting:{getRegisteredContentScripts:async()=>[{}],executeScript:async()=>{}}};
 const send=(f,url,msg)=>new Promise(resolve=>f(msg,{url,frameId:0,tab:{id:1}},resolve));
 chrome.tabs.query=async()=>[{id:1,url:'https://platform.openai.com/settings/organization/billing/overview'}];
 chrome.tabs.sendMessage=async(_,msg)=>{assert.equal(msg.type,'API_CREDIT_READ');const reply=await send(internal,'https://platform.openai.com/settings/organization/billing/overview',{type:'API_CREDIT_SNAPSHOT',service:'chatgpt',status:'ready',amount:8.77,currency:'USD'});assert.equal(reply.ok,true);return {ready:true}};
 const context=vm.createContext({chrome,URL,setTimeout,clearTimeout,AbortController,console,fetch:()=>{},performance,structuredClone});
 context.importScripts=(...files)=>files.forEach(file=>vm.runInContext(fs.readFileSync(path.join(root,'extension',file),'utf8'),context,{filename:file}));
 vm.runInContext(fs.readFileSync(path.join(root,'extension/background.js'),'utf8'),context);
 for(const [id,name]of [['chatgpt','fetchChatGPT'],['claude','fetchClaude'],['gemini','fetchGemini']])context.GlanceFetchers[name]=async()=>({status:'ready',windows:[{label:id==='chatgpt'?'Work / Codex · 5時間':'現在のセッション',remaining:id==='claude'?93:78,resetAt:Date.now()+3600000}],extras:[],plan:'Pro'});
 return {context,stored,sendFrom:(url,msg,frameId)=>new Promise(resolve=>external(msg,{url,frameId,tab:{id:1}},resolve)),send:msg=>send(external,'https://llmsmonitor.ntus.info/',msg)};
}
async function within(p,ms=1000){let timer;return Promise.race([p,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('deadlock')),ms)})]).finally(()=>clearTimeout(timer))}
test('credit reader reply nested inside REFRESH cannot deadlock the global command queue',async()=>{
 const b=harness();assert.equal((await within(b.send({type:'REFRESH'}))).ok,true);
 assert.equal(b.stored.data.chatgpt.windows[0].remaining,78);assert.equal(b.stored.data.claude.windows[0].remaining,93);
 assert.equal((await within(b.send({type:'REFRESH'}))).ok,true);assert.equal(b.stored.apiCredits.chatgpt.status,'ready');
});
test('GET masks expired cached quotas without modifying history, storage or the real zero baseline',async()=>{
 const b=harness(),past=Date.now()-60000;b.stored.data={chatgpt:{capturedAt:past-1000,status:'loading',refreshing:true,refreshStartedAt:past,windows:[{label:'Work / Codex · 5時間',remaining:0,resetAt:past}]},claude:{capturedAt:past,status:'ready',windows:[{label:'現在のセッション',remaining:82,resetAt:past}]}};
 const before=structuredClone(b.stored);const result=await b.send({type:'GET'});
 for(const id of ['chatgpt','claude']){assert.equal(result.data[id].windows[0].remaining,null);assert.equal(result.data[id].windows[0].expired,true);assert.equal(result.data[id].status,'error')}
 assert.deepEqual(b.stored,before);
});
test('projection distinguishes expired, unknown, failed and verified active-zero states',()=>{
 const now=10000,base={status:'ready',capturedAt:9000,windows:[{label:'現在のセッション',remaining:0,resetAt:11000}]};
 assert.equal(S.view(base,now).windows[0].remaining,0);
 assert.equal(S.view({...base,windows:[{...base.windows[0],resetAt:9000}]},now).windows[0].remaining,null);
 assert.deepEqual(S.view({},now).windows,[]);
 assert.equal(S.view({...base,status:'error'},now).windows[0].remaining,0);
 assert.equal(S.view({...base,refreshing:true,refreshStartedAt:1},60000).refreshing,false);
});
test('metadata-only ChatGPT DOM update keeps API quota acquisition time',()=>{
 const old=S.accept({}, {status:'ready',source:'api',windows:[{label:'Work / Codex · 5時間',remaining:78}],extras:[]},1000,'chatgpt');
 const next=S.accept(old,{status:'ready',source:'dom',windows:[],extras:[{label:'利用上限のリセット',value:'利用可能 1'}],plan:'Plus'},2000,'chatgpt');
 assert.equal(next.capturedAt,1000);assert.equal(next.metadataAt,2000);assert.equal(next.windows[0].remaining,78);
});
test('task RPC rejects unrelated origins, routes, child frames and mismatched service before reading metadata',async()=>{
 const b=harness();let reads=0;b.context.LLMTaskBackground.read=async()=>{reads++;return {status:'ready'}};
 for(const [url,frameId,service]of [['https://evil.test/tasks.html?service=claude',0,'claude'],['https://llmsmonitor.ntus.info/',0,'claude'],['https://llmsmonitor.ntus.info/tasks.html?service=claude',1,'claude'],['https://llmsmonitor.ntus.info/tasks.html?service=claude',0,'chatgpt']])assert.equal((await b.sendFrom(url,{type:'TASKS_READ',service},frameId)).status,'unavailable');
 assert.equal(reads,0);assert.equal((await b.sendFrom('https://llmsmonitor.ntus.info/tasks.html?service=claude',{type:'TASKS_READ',service:'claude'},0)).status,'ready');assert.equal(reads,1);
});
function audioHarness(resume){let listen,started=0;const timers=[];const param={setValueAtTime(){},exponentialRampToValueAtTime(){}};
 class AudioContext{state='suspended';currentTime=0;destination={};resume=resume;createOscillator(){return {frequency:param,connect(){return this},start(){started++},stop(){}}}createGain(){return {gain:param,connect(){return this}}}}
 const c=vm.createContext({chrome:{runtime:{onMessage:{addListener:f=>listen=f}}},AudioContext,Date,Number,setTimeout:(fn,ms)=>{timers.push({fn,ms});return timers.length},clearTimeout(){}});vm.runInContext(fs.readFileSync(path.join(root,'extension/offscreen.js'),'utf8'),c);
 return {send:(m,reply)=>listen(m,{},reply),timers,started:()=>started};
}
test('audio acknowledges only after the first tone and schedules two remaining one-second beats',async()=>{
 const a=audioHarness(async()=>{});let ack=null;a.send({type:'PLAY_CHANGE_SOUND',volume:18},r=>{ack=r;assert.equal(a.started(),1)});await new Promise(resolve=>setImmediate(resolve));assert.equal(ack.played,true);assert.deepEqual(a.timers.filter(t=>[1000,2000].includes(t.ms)).map(t=>t.ms),[1000,2000]);
});
test('a suspended audio resume that completes after its deadline cannot play late',async()=>{
 let resume;const a=audioHarness(()=>new Promise(r=>resume=r));let ack=null;a.send({type:'PLAY_CHANGE_SOUND'},r=>ack=r);a.timers.find(t=>t.ms===1100).fn();assert.equal(ack.played,false);resume();await new Promise(resolve=>setImmediate(resolve));assert.equal(a.started(),0);
});
function sharedHarness(){const c=vm.createContext({console,URL,Date});for(const n of ['locale.js','preferences.js','provider-status.js','intelligence.js','changes.js','shared.js'])vm.runInContext(fs.readFileSync(path.join(root,'extension',n),'utf8'),c);return c}
test('shared Web and floating rendering masks expired old-extension values without changing history',()=>{
 const c=sharedHarness(),data={chatgpt:{status:'ready',capturedAt:Date.now()-60000,plan:'Plus',windows:[{label:'Work / Codex · 5時間',remaining:0,resetAt:Date.now()-1000}],history:{x:[{remaining:0,capturedAt:1000}]}},claude:{status:'ready',windows:[{label:'現在のセッション',remaining:82,resetAt:Date.now()-1000}]}};
 const before=structuredClone(data),view=c.Glance.viewData(data);assert.equal(view.chatgpt.windows[0].remaining,null);assert.equal(view.claude.windows[0].remaining,null);assert.deepEqual(data,before);
 const html=c.Glance.widget(data,{});assert(!html.includes('まもなくリセット'));assert(!html.includes('>82%</'));assert(html.includes('再取得待ち'));
});
test('opening provider incident details never expands the unrelated intelligence panel',()=>{
 const c=sharedHarness(),html=c.Glance.widget({}, {}, {claude:{state:'issue',summary:'Errors'}},true,{status:'unconfigured'},false);assert(/class="provider-status[^>]*\bopen/.test(html));assert(!/class="intelligence-feed[^>]*\bopen/.test(html));
});

test('loading/failure never manufactures a fresh Claude 100%, but a verified inactive response can show 100%',()=>{
 const old={status:'ready',capturedAt:1000,windows:[{label:'現在のセッション',remaining:82,resetAt:1500}]},loading=S.loading(old,2000),failed=S.accept(loading,{status:'unavailable'},3000,'claude');assert.equal(loading.windows[0].remaining,null);assert.equal(failed.windows[0].remaining,null);assert.equal(S.view(failed,3000).status,'error');assert.equal(failed.capturedAt,1000);
 const inactive=S.accept(failed,{status:'ready',windows:[{label:'現在のセッション',remaining:100,reset:'最初のメッセージから開始します',resetAt:null}]},4000,'claude');assert.equal(inactive.windows[0].remaining,100);assert.equal(inactive.windows[0].expired,undefined);
});
