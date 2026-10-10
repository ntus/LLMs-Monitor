const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const T=require('../extension/task-list.js'),M=require('../web/tasks-model.js');
const now=1791597600000;
function statusAPI(){const c=vm.createContext({LLMTaskList:T,URL});vm.runInContext(fs.readFileSync('extension/task-status.js','utf8'),c);return c.LLMTaskStatus}
const S=statusAPI();
function control(label,test='',disabled=false,shown=true){return {disabled,hidden:false,getClientRects:()=>shown?[{}]:[],getAttribute:k=>k==='aria-label'?label:k==='data-testid'?test:null}}
function doc(buttons,options={}){
 const scope={getClientRects:()=>[{}],getAttribute:()=>null,querySelectorAll:q=>{assert.equal(q,'button');return buttons}};
 const composer={hidden:false,getClientRects:()=>[{}],getAttribute:k=>k==='aria-disabled'&&options.disabled?'true':null,closest:q=>{assert.equal(q,'form,fieldset');return scope}};
 for(const object of [scope,composer,...buttons])for(const field of ['innerText','textContent','value'])Object.defineProperty(object,field,{get(){throw Error('Private contents read')}});
 return {visibilityState:'hidden',querySelectorAll:q=>{assert.equal(q,'[contenteditable="true"][role="textbox"]');return options.missing?[]:[composer]}};
}
test('all provider normal-chat controls distinguish generating, response idle and unavailable without reading private content',()=>{
 const urls={chatgpt:'https://chatgpt.com/c/a',claude:'https://claude.ai/chat/a',gemini:'https://gemini.google.com/u/0/app/a'};
 for(const [service,url]of Object.entries(urls)){
  assert.equal(S.observe(doc([control('Stop generating')]),service,url,now).status,'running');
  assert.equal(S.observe(doc([control('送信','',true)]),service,url,now).status,'idle');assert.equal(S.observe(doc([control('Stop response','',true),control('送信')]),service,url,now).status,'unknown');
  assert.equal(S.observe(doc([control('音声入力 (⌘⇧D)')]),service,url,now).status,'idle');
  assert.equal(S.observe(doc([control('Stop response','',false,false)]),service,url,now).status,'unknown');
  assert.equal(S.observe(doc([control('フィードバックを送信')]),service,url,now).status,'unknown');
  assert.equal(S.observe(doc([], {missing:true}),service,url,now).status,'unknown');
  assert.equal(S.observe(doc([control('送信')],{disabled:true}),service,url,now).status,'unknown');
 }
 assert.equal(S.observe(doc([control('送信')]),'claude','https://claude.ai/settings/usage',now).status,'unavailable');
});
test('Code and Cowork never infer task completion or idle from a usable composer',()=>{
 for(const route of ['code/session_a','cowork/a']){const url='https://claude.ai/'+route;assert.equal(S.observe(doc([control('送信','code-prompt-send')]),'claude',url,now).status,'unknown');assert.equal(S.observe(doc([control('Stop','code-prompt-stop')]),'claude',url,now).status,'running')}
});
function snapshot(service='claude',kind='chat',url='https://claude.ai/chat/a') {return M.normalize({schemaVersion:1,service,source:'official-sidebar',capturedAt:new Date(now).toISOString(),tasks:[{id:T.link(url,service).id,title:'Task',kind,status:'unknown',url}]},service)}
function observation(s,status='running',evidence='stop-control',at=now){const t=s.tasks[0];return {id:t.id,kind:t.kind,url:t.url,status,evidence,observedAt:at}}
function result(s,observations){return {status:'ready',service:s.service,checkedAt:now,observations}}
test('state observations expire and do not masquerade as task updates; closed and failed acquisition are distinct',()=>{
 const s=snapshot(),live=M.states(s,result(s,[observation(s)]),now);assert.equal(live.tasks[0].status,'running');assert.equal(live.tasks[0].updatedAt,null);assert.equal(s.tasks[0].status,'unknown');
 assert.equal(M.expireStates(live,now+15001).tasks[0].stateReason,'stale');
 assert.equal(M.states(s,result(s,[]),now).tasks[0].stateReason,'not-open');
 assert.equal(M.states(live,{status:'unavailable'},now).tasks[0].stateReason,'unavailable');
 assert.equal(M.states(s,result(s,[observation(s,'running','stop-control',now-15001)]),now).tasks[0].status,'unknown');
 assert.equal(M.states(s,result(s,[observation(s,'running','stop-control',now+1001)]),now).tasks[0].status,'unknown');
 assert.equal(M.states(s,result(s,[observation(s,'completed','composer-ready')]),now).tasks[0].status,'unknown');
});
test('different routes, Gemini accounts and conflicting duplicate tabs cannot contaminate task states',()=>{
 const s=snapshot(),a=observation(s);assert.equal(M.states(s,result(s,[{...a,url:'https://claude.ai/chat/other'}]),now).tasks[0].status,'unknown');
 assert.equal(M.states(s,result(s,[a,{...a,status:'idle',evidence:'composer-ready'}]),now).tasks[0].stateReason,'conflict');
 const g=snapshot('gemini','chat','https://gemini.google.com/u/0/app/a'),b=observation(g);assert.equal(M.states(g,result(g,[{...b,url:'https://gemini.google.com/u/1/app/a'}]),now).tasks[0].status,'unknown');
 const code=snapshot('claude','code','https://claude.ai/code/session_a');assert.equal(M.states(code,result(code,[observation(code,'idle','composer-ready')]),now).tasks[0].status,'unknown');
 const demo=M.demo('claude',now);assert.equal(M.states(demo,result(s,[a]),now),demo);
});
function background(chrome,extras={}){const c=vm.createContext({chrome,LLMTaskList:T,LLMTaskStatus:S,URL,setTimeout,clearTimeout,...extras});vm.runInContext(fs.readFileSync('extension/task-state-background.js','utf8'),c);return c.LLMTaskStateBackground}
test('state acquisition reads only existing valid tabs; coalesces and throttles without touching quotas or windows',async()=>{
 let reads=0;const s=snapshot();const b=background({tabs:{query:async q=>{assert.equal(q.url,'https://claude.ai/*');return [{id:7,url:s.tasks[0].url},{id:8,url:'https://claude.ai/settings/usage'}]},sendMessage:async(id,m)=>{reads++;assert.equal(id,7);assert.equal(m.type,'TASK_STATE_READ');return {...observation(s),observedAt:Date.now()}}}});
 const a=b.read('claude');assert.equal(a,b.read('claude'));const r=await a;assert.equal(r.status,'ready');assert.equal(r.observations[0].status,'running');assert.equal(reads,1);assert.equal((await b.read('claude')).checkedAt,r.checkedAt);assert.equal(reads,1);assert.equal((await b.read('bad')).status,'unavailable');
});
test('route changes, stale responses and tab read failures never become successful running observations',async()=>{
 const b=background({tabs:{query:async()=>[1,2,3].map(id=>({id,url:'https://claude.ai/chat/a'})),sendMessage:async id=>{if(id===3)throw Error('no reader');return {id:'chat:a',kind:'chat',url:id===1?'https://claude.ai/chat/b':'https://claude.ai/chat/a',status:'running',evidence:'stop-control',observedAt:id===2?Date.now()-16000:Date.now()}}}});
 assert.equal((await b.read('claude')).observations.length,0);
});
test('a stalled provider response is bounded and cannot block state or list queues indefinitely',async()=>{
 const b=background({tabs:{query:async()=>[{id:1,url:'https://chatgpt.com/c/a'}],sendMessage:()=>new Promise(()=>{})}});const start=Date.now(),r=await b.read('chatgpt');assert.equal(r.status,'ready');assert.equal(r.observations.length,0);assert(Date.now()-start<1800);
 const hanging=background({tabs:{query:()=>new Promise(()=>{})}},{setTimeout:(f,ms)=>setTimeout(f,Math.min(ms,20))});assert.equal((await hanging.read('chatgpt')).status,'unavailable');
});
test('private state modules never read conversation contents, store lists, navigate tabs or invoke quota/audio paths',()=>{
 for(const path of ['extension/task-status.js','extension/task-state-background.js']){const code=fs.readFileSync(path,'utf8');assert(!/innerText|textContent|\.value\b|document\.body|\.storage|\.tabs\.(create|update|remove|reload)|GlanceState|GlanceFetchers|GlanceHistory|notifications|AudioContext/.test(code),path)}
});
test('state reader is self-extension, exact service and top-frame only',()=>{
 let listener,replies=0,observations=0;const context=vm.createContext({LLMTaskList:T,LLMTaskStatus:{observe:()=>{observations++;return {status:'unknown'}}},location:{hostname:'claude.ai',href:'https://claude.ai/chat/a'},document:{},chrome:{runtime:{id:'own',onMessage:{addListener:f=>listener=f}}}});context.top=context.self={};vm.runInContext(fs.readFileSync('extension/task-reader.js','utf8'),context);
 for(const [id,service]of [['foreign','claude'],['own','chatgpt']])listener({type:'TASK_STATE_READ',service},{id},()=>replies++);context.top={};listener({type:'TASK_STATE_READ',service:'claude'},{id:'own'},()=>replies++);assert.equal(replies,0);
 context.top=context.self;listener({type:'TASK_STATE_READ',service:'claude'},{id:'own'},()=>replies++);assert.equal(observations,1);assert.equal(replies,1);
});

test('list and state bridge requests are independent and old-extension support is explicit',async()=>{
 const callbacks=new Map(),c=vm.createContext({location:{origin:'https://llmsmonitor.ntus.info'},localStorage:{getItem:k=>{assert.equal(k,'glance-extension-id');return 'a'.repeat(32)}},chrome:{runtime:{sendMessage:(id,msg,reply)=>callbacks.set(msg.type,reply)}},setTimeout,clearTimeout});vm.runInContext(fs.readFileSync('web/tasks-bridge.js','utf8'),c);
 const list=c.LLMTaskBridge.read('claude'),state=c.LLMTaskBridge.states('claude');assert.equal(callbacks.size,2);callbacks.get('TASKS_STATE')({error:'未対応の操作'});assert.equal((await state).status,'unsupported');callbacks.get('TASKS_READ')({status:'ready'});assert.equal((await list).status,'ready');
});
test('state tab scanning caps inventory and simultaneous readers',async()=>{
 let reads=0,active=0,peak=0;const b=background({tabs:{query:async()=>Array.from({length:90},(_,id)=>({id,url:'https://claude.ai/chat/a'})),sendMessage:async()=>{reads++;active++;peak=Math.max(peak,active);await new Promise(resolve=>setImmediate(resolve));active--;return {id:'chat:a',kind:'chat',url:'https://claude.ai/chat/a',status:'idle',evidence:'composer-ready',observedAt:Date.now()}}}});const result=await b.read('claude');assert.equal(reads,40);assert.equal(result.observations.length,40);assert(peak<=4);
});
