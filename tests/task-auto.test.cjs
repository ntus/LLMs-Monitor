const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const T=require('../extension/task-list.js'),M=require('../web/tasks-model.js');
function doc(service,links){const nodes=links.map(([href,title])=>({getClientRects:()=>[{}],getAttribute:k=>k==='href'?href:null,innerText:title}));return {querySelectorAll:s=>s===T.SIDEBARS[service]?[{getClientRects:()=>[{}],querySelectorAll:s=>s==='a[href]'?nodes:[]}]:[]}}
test('production sidebar adapters read only conversation links and discard chat bodies, drafts and credentials',()=>{
 const inputs={chatgpt:[['/c/abc','Chat title'],['/g/g-p-123/c/def','Project chat'],['/settings/usage','Usage'],['https://evil.test/c/x','Bad']],claude:[['/chat/abc','Chat title'],['/code/session_abc','Code task'],['/cowork/cse_abc','Cowork task'],['/code/project/chan_abc','Project']],gemini:[['/app/abc','Chat title'],['/u/0/app/def','Other route'],['/usage','Usage']]};
 for(const service of M.SERVICES){const result=T.collect(doc(service,inputs[service]),service,1791554400000),s=M.normalize(result.snapshot,service);assert.equal(s.source,'official-sidebar');assert.equal(s.tasks.length,service==='claude'?3:2);assert(s.tasks.every(t=>t.status==='unknown'));assert(s.tasks.every(t=>!t.summary));assert(!JSON.stringify(s).includes('password'));assert(s.tasks.every(t=>t.url))}
 assert.equal(T.collect(doc('claude',[]),'claude').status,'unavailable');assert.equal(T.collect({querySelectorAll:()=>[]},'claude').status,'unavailable');
});
test('sidebar links reject credentials, unknown hosts, query strings and non-task code routes',()=>{
 for(const href of ['https://u:p@chatgpt.com/c/x','https://chatgpt.com.evil.test/c/x','http://chatgpt.com/c/x','/c/x?token=s','/c/x#secret','/settings'])assert.equal(T.link(href,'chatgpt'),null);
 assert.equal(T.link('/code/unknown','claude'),null);assert.equal(T.link('/code/project/chan_x','claude'),null);
});
test('automatic task requests are coalesced, throttled and close only their own temporary tab',async()=>{
 let created=0,removed=[],reads=0,messages=[];const chrome={tabs:{query:async()=>[{id:10,url:'https://chatgpt.com/c/existing'}],create:async options=>{assert.equal(options.active,false);assert.equal(options.url,T.HOMES.chatgpt);created++;return {id:20}},sendMessage:async(id,message)=>{messages.push(message.type);reads++;if(message.type==='TASK_PIN_ADVANCE')return {status:'scanned',more:false};return {status:'ready',snapshot:{service:'chatgpt',tasks:[]}}},remove:async id=>removed.push(id)}};
 const c=vm.createContext({chrome,LLMTaskList:T,URL,setTimeout,clearTimeout});vm.runInContext(fs.readFileSync('extension/task-background.js','utf8'),c);
 const a=c.LLMTaskBackground.read('chatgpt'),b=c.LLMTaskBackground.read('chatgpt');assert.equal(a,b);assert.equal((await a).status,'ready');assert.equal(created,1);assert.equal(reads,7);assert.deepEqual(messages,['TASK_LIST_READ','TASK_LIST_PREPARE','TASK_LIST_READ','TASK_PIN_ADVANCE','TASK_LIST_READ','TASK_PIN_ADVANCE','TASK_LIST_READ']);assert.equal((await a).snapshot.pinAudit.scanFinished,true);assert.deepEqual(removed,[20]);assert.equal((await c.LLMTaskBackground.read('chatgpt')).status,'cooldown');assert.equal((await c.LLMTaskBackground.read('bad')).status,'unavailable');
});
test('task adapter has no storage, quota, notification or body-reading dependency',()=>{
 for(const path of ['extension/task-list.js','extension/task-reader.js','extension/task-background.js']){const code=fs.readFileSync(path,'utf8');assert(!/\.storage|GlanceState|GlanceFetchers|GlanceHistory|notifications|AudioContext|document\.body|querySelector[^\n]*(?:input|textarea)/.test(code),path)}
 const bridge=fs.readFileSync('web/tasks-bridge.js','utf8');assert(bridge.includes("getItem('glance-extension-id')"));assert(!/setItem|fetch\(|AudioContext|type:'GET'|type:'REFRESH'|type:'SETTINGS'/.test(bridge));
});
test('virtualized pins accumulate across scans and truncation evidence survives background aggregation',async()=>{
 let page=0,removed=[];const snapshot=()=>({service:'chatgpt',tasks:[],pins:[{url:'https://chatgpt.com/c/p'+page,title:'Pin '+page,kind:'chat'}],pinAudit:{observed:501,limited:true,sectionSeen:true}});
 const chrome={tabs:{create:async()=>({id:21}),remove:async id=>removed.push(id),sendMessage:async(id,m)=>{if(m.type==='TASK_PIN_ADVANCE'){if(page<2){page++;return {status:'scanned',more:true}}return {status:'scanned',more:false}}return {status:'ready',snapshot:snapshot()}}}};
 const c=vm.createContext({chrome,LLMTaskList:T,URL,setTimeout,clearTimeout});vm.runInContext(fs.readFileSync('extension/task-background.js','utf8'),c);const r=await c.LLMTaskBackground.read('chatgpt');assert.equal(r.snapshot.pins.length,3);assert.equal(r.snapshot.pinAudit.limited,true);assert.equal(r.snapshot.pinAudit.observed,501);assert.equal(r.snapshot.pinAudit.scanFinished,true);assert.deepEqual(removed,[21]);
});
