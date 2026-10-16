const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const A=require('../extension/additional-services.js'),P=require('../extension/preferences.js');
test('additional providers default off, preserve legacy order and enforce at most three visible services',()=>{
 assert.deepEqual(P.visible({}),['chatgpt','claude','gemini']);
 assert.deepEqual(P.visible({serviceOrder:['grok','genspark','deepseek','perplexity','chatgpt'],hiddenServices:[]}),['grok','genspark','deepseek']);
 assert.deepEqual(P.visible({serviceOrder:['gemini','grok'],hiddenServices:['chatgpt','claude']}),['gemini','grok']);
});
test('additional adapters accept only explicit labelled values on exact account routes and never infer percentages',()=>{
 for(const [id,p] of Object.entries(A.PROVIDERS)){assert.equal(A.route(p.url),id);for(const url of [p.url+'?token=secret',p.url+'#chat',p.url.replace('https://','http://'),p.url.replace('https://','https://name@'),p.origin+'/chat/private'])assert.equal(A.route(url),null);assert.deepEqual(A.extract(p.labels[0]+'\n100 credits',id),[{label:p.labels[0],value:'100 credits'}]);assert.deepEqual(A.extract(p.labels[0]+'\n100%\nSpending\n$10',id),[]);assert.deepEqual(A.extract(p.labels[0]+'\n10\n'+p.labels[0]+'\n20',id),[]);assert.deepEqual(A.sanitize([{label:'Budget',value:'$100'}],id),[])}
 assert.deepEqual(A.extract('Total balance\nCNY 110.00','deepseek'),[{label:'Total balance',value:'CNY 110.00'}]);
 A.set({grok:{enabled:true,capturedAt:Date.now(),rows:[{label:'Remaining credits',value:'10 credits'}]}});assert.match(A.view('grok'),/10 credits/);assert(!A.view('grok').includes('100%'));assert(!A.view('grok').includes('<script>'));
});
function harness(){const saved={},registered=[],scripts=[],tabs=[];let permitted=true;const chrome={runtime:{id:'self'},storage:{local:{get:async k=>({[k]:structuredClone(saved[k])}),set:async v=>Object.assign(saved,structuredClone(v))}},permissions:{contains:async()=>permitted},scripting:{getRegisteredContentScripts:async()=>[],registerContentScripts:async r=>registered.push(r),unregisterContentScripts:async()=>{},executeScript:async r=>scripts.push(r)},tabs:{query:async()=>tabs,sendMessage:async()=>({ready:true})}};const c=vm.createContext({GlanceAdditional:A,chrome,Date});vm.runInContext(fs.readFileSync('extension/additional-background.js','utf8'),c);return {B:c.GlanceAdditionalBackground,saved,registered,scripts,tabs,deny:()=>permitted=false}}
test('additional snapshots require explicit opt-in, exact route, own ID, top frame and granted host',async()=>{
 const x=harness(),m={service:'grok',rows:[{label:'Remaining credits',value:'10 credits'}]},s={id:'self',url:A.PROVIDERS.grok.url,frameId:0,tab:{id:1}};
 assert.equal((await x.B.receive(m,s)).ok,false);await x.B.configure('grok',true);assert.equal(x.registered.length,1);
 for(const sender of [{...s,frameId:1},{...s,id:'foreign'},{...s,url:'https://grok.com/chat/a'}])assert.equal((await x.B.receive(m,sender)).ok,false);
 assert.equal((await x.B.receive(m,s)).ok,true);assert.equal(x.saved[x.B.KEY].grok.rows[0].value,'10 credits');x.deny();assert.equal((await x.B.receive(m,s)).ok,false);await x.B.refresh();assert.equal(x.saved[x.B.KEY].grok.enabled,false);
 assert(!fs.readFileSync('extension/additional-background.js','utf8').includes('tabs.create'));assert(!fs.readFileSync('extension/additional-reader.js','utf8').includes('fetch('));
});
test('task popup countdown rounds up, carries minutes and suppresses expired deadlines',()=>{
 const M=require('../web/tasks-monitor.js'),now=Date.now();assert.equal(M.countdown(now+61000,now,'ja'),'（あと2分）');assert.equal(M.countdown(now+3599000,now,'ja'),'（あと1時間）');assert.equal(M.countdown(now-1,now,'ja'),'');assert.match(M.countdown(now+60000,now,'en'),/1m left/);
});
test('unified setup keeps unique IDs, first-operation permission grants and exact top-level native route',()=>{
 const html=fs.readFileSync('extension/setup.html','utf8'),ids=[...html.matchAll(/id="([^"]+)"/g)].map(m=>m[1]);assert.equal(new Set(ids).size,ids.length);for(const id of ['api-api-providers','codex-download','tibo-enable','setup-services','additional-providers'])assert(ids.includes(id));const source=fs.readFileSync('extension/setup.js','utf8');assert.match(source,/if\(!on&&!await chrome.permissions.request/);assert(!html.includes('iframe'));const native=fs.readFileSync('extension/tasks-codex-background.js','utf8');assert(native.includes("chrome.runtime.getURL('setup.html')"));assert(native.includes('sender.frameId!==0'));
});

test('revoked or disabled readers do not inspect page text or publish snapshots',async()=>{
 let readText=0,published=0,read,interval;const document={body:{get innerText(){readText++;return 'Remaining credits\n10'}}},chrome={runtime:{onMessage:{addListener:fn=>read=fn},sendMessage:async m=>{if(m.type==='ADDITIONAL_SNAPSHOT')published++;return {enabled:false}}}},c=vm.createContext({GlanceAdditional:A,chrome,document,location:{href:A.PROVIDERS.grok.url},Date,setTimeout:()=>1,clearTimeout(){},setInterval:fn=>interval=fn,MutationObserver:class{observe(){}}});vm.runInContext(fs.readFileSync('extension/additional-reader.js','utf8'),c);await interval();assert.equal(readText,0);assert.equal(published,0);await new Promise(resolve=>read({type:'ADDITIONAL_READ'},null,resolve));assert.equal(readText,0);
});
test('additional render rejects stale/future values and displays zero only when explicitly obtained',()=>{
 const row={enabled:true,capturedAt:Date.now(),rows:[{label:'Remaining credits',value:'0 credits'}]};A.set({grok:row});assert.match(A.view('grok'),/0 credits/);A.set({grok:{...row,capturedAt:Date.now()-126000}});assert(!A.view('grok').includes('0 credits'));A.set({grok:{...row,capturedAt:Date.now()+60000}});assert(!A.view('grok').includes('0 credits'));A.set({grok:{...row,enabled:false}});assert(!A.view('grok').includes('0 credits'));
});
test('new setup message routes reject foreign IDs, child frames, fragments and external callers',async()=>{
 const event=()=>({addListener(){}}),saved={settings:{sound:true},data:{KEEP:true},history:{KEEP:[1]}};let listener;
 const chrome={runtime:{id:'a'.repeat(32),getURL:p=>'chrome-extension://'+'a'.repeat(32)+'/'+p,getManifest:()=>({version:'1.45.0'}),onMessage:{addListener:fn=>listener=fn},onMessageExternal:event(),onInstalled:event(),onStartup:event()},action:{onClicked:event()},alarms:{onAlarm:event()},tabs:{onRemoved:event()},windows:{onRemoved:event()},notifications:{onClicked:event()},permissions:{contains:async()=>true,onRemoved:event()},i18n:{getUILanguage:()=> 'ja'},storage:{local:{get:async k=>Object.fromEntries((Array.isArray(k)?k:[k]).map(x=>[x,structuredClone(saved[x])])),set:async v=>Object.assign(saved,structuredClone(v))}}};const c=vm.createContext({chrome,URL,Date,setTimeout,clearTimeout,AbortController});c.importScripts=(...files)=>files.forEach(f=>vm.runInContext(fs.readFileSync('extension/'+f,'utf8'),c));vm.runInContext(fs.readFileSync('extension/background.js','utf8'),c);
 const own={id:chrome.runtime.id,url:chrome.runtime.getURL('setup.html'),frameId:0},before=structuredClone(saved);
 for(const sender of [{...own,id:'foreign'},{...own,frameId:1},{...own,url:own.url+'#codex'},{...own,url:'https://llmsmonitor.ntus.info/'}])for(const type of ['ADDITIONAL_CONFIGURE','API_CREDITS_CONFIGURE']){await assert.rejects(()=>vm.runInContext('handle',c)({type,service:'grok',enabled:false},sender,false));assert.deepEqual(saved,before)}
 await assert.rejects(()=>vm.runInContext('handle',c)({type:'ADDITIONAL_CONFIGURE',service:'grok',enabled:false},own,true));
 const configured=await vm.runInContext('handle',c)({type:'ADDITIONAL_CONFIGURE',service:'grok',enabled:false},own,false);assert.equal(configured.ok,true);assert.deepEqual(saved.data,before.data);assert.deepEqual(saved.history,before.history);
 // Reader authorization is independent of a blocked global acquisition queue.
 vm.runInContext('queue=new Promise(()=>{})',c);const status=await new Promise(resolve=>listener({type:'ADDITIONAL_READER_STATUS',service:'grok'},{id:own.id,url:A.PROVIDERS.grok.url,frameId:0,tab:{id:4}},resolve));assert.equal(status.enabled,false);
});
test('Codex setup follows saved English preference on a Japanese browser',async()=>{
 const elements=Object.fromEntries(['description','step-one','step-two','technical-label','extension-id','download','install-help','step-three','enable','disable','check','guide','limits','result','restart','restart-help'].map(id=>[id,{textContent:'',hidden:true}]));const chrome={runtime:{id:'a'.repeat(32),sendMessage:async m=>m.type==='GET'?{settings:{language:'en'}}:{enabled:false,permission:false}},permissions:{}};const c=vm.createContext({chrome,navigator:{language:'ja'},document:{documentElement:{},getElementById:id=>elements[id]}});vm.runInContext(fs.readFileSync('extension/codex-setup.js','utf8'),c);await new Promise(setImmediate);assert.equal(elements.download.textContent,'Save installer ZIP for this extension');assert.equal(elements.check.textContent,'Check connection');
});
