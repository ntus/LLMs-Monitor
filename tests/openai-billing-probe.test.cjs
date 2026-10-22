const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const A=require('../extension/api-credits.js');
function setup(){
 let now=1000000,next=0,permitted=true,B,reads=0,owned=false;
 const timers=new Map(),tab={id:77,windowId:5,url:A.PROVIDERS.chatgpt.url,status:'complete',active:false};
 class Clock extends Date{static now(){return now}}
 const saved={apiCredits:{chatgpt:{enabled:true,status:'ready',amount:3,currency:'USD',scope:'a1b2c3d4',capturedAt:1}},data:{keep:1},history:{keep:2}},session={},calls={create:0,reload:0,release:0,inject:0};
 const clone=x=>structuredClone(x);
 const chrome={permissions:{contains:async()=>permitted},storage:{local:{get:async key=>({[key]:clone(saved[key])}),set:async v=>Object.assign(saved,clone(v))},session:{get:async key=>({[key]:clone(session[key])}),set:async v=>Object.assign(session,clone(v)),remove:async key=>delete session[key]}},alarms:{create(){},clear:async()=>{}},tabs:{get:async()=>{if(!owned)throw Error('closed');return clone(tab)},reload:async()=>{calls.reload++},sendMessage:async()=>{
  reads++;const message={service:'chatgpt',readerVersion:'1.61.0',balanceReaderVersion:'1.64.0',...A.parse('API credit balance\n-$1.02','chatgpt'),scope:'a1b2c3d4',loading:reads<10};
  await B.receive(message,{url:tab.url,frameId:0,tab:clone(tab)});return {ready:true,balanceReaderVersion:'1.64.0'};
 }},scripting:{getRegisteredContentScripts:async()=>[{}],executeScript:async()=>{calls.inject++}}};
 const quiet={create:async()=>{calls.create++;owned=true;return clone(tab)},isOwned:async()=>owned&&!tab.active&&tab.url===A.PROVIDERS.chatgpt.url,sameMonitorWindow:async id=>id===5,relinquish:async()=>{owned=false},release:async()=>{if(owned&&!tab.active&&tab.url===A.PROVIDERS.chatgpt.url){calls.release++;owned=false}}};
 const c=vm.createContext({GlanceApiCredits:A,GlanceQuietTabs:quiet,chrome,Date:Clock,setTimeout:(fn,ms)=>{const id=++next;timers.set(id,{fn,at:now+ms});return id},clearTimeout:id=>timers.delete(id)});
 for(const path of ['extension/openai-billing-probe.js','extension/api-credit-background.js'])vm.runInContext(fs.readFileSync(path,'utf8'),c);
 B=c.GlanceApiCreditBackground;
 async function settle(p){let finished=false,error;p.then(()=>finished=true,e=>{finished=true;error=e});for(let i=0;i<1000&&!finished;i++){await new Promise(setImmediate);if(finished)break;const pair=[...timers].sort((a,b)=>a[1].at-b[1].at)[0];if(pair){timers.delete(pair[0]);now=Math.max(now,pair[1].at);pair[1].fn()}}assert(finished,'bounded operation must finish');if(error)throw error;}
 return {B,O:c.GlanceOpenAIBillingProbe,chrome,quiet,tab,saved,session,calls,settle,tick:ms=>now+=ms,reads:()=>reads,deny:()=>permitted=false,close:()=>owned=false};
}
test('OpenAI waits for slow negative balance rendering, coalesces and reuses one inactive tab',async()=>{
 const x=setup(),p=x.O.refresh();assert.equal(x.O.refresh(true),p);await x.settle(p);
 assert(x.reads()>=12);assert.equal(x.calls.create,1);assert.equal(x.saved.apiCredits.chatgpt.amount,-1.02);assert.equal(x.saved.apiCredits.chatgpt.acquisition.stage,'openai-ready');
 const at=x.saved.apiCredits.chatgpt.capturedAt;await x.settle(x.O.refresh());assert.equal(x.saved.apiCredits.chatgpt.capturedAt,at);
 x.tick(60001);await x.settle(x.O.refresh());assert.equal(x.calls.create,1);assert.equal(x.calls.reload,1);
 assert.deepEqual(x.saved.data,{keep:1});assert.deepEqual(x.saved.history,{keep:2});
});
test('automatic billing refresh starts owned OpenAI acquisition without waiting on the quota queue',async()=>{
 const x=setup();await x.B.refresh('chatgpt');await x.settle(x.O.refresh());assert.equal(x.calls.create,1);assert.equal(x.saved.apiCredits.chatgpt.amount,-1.02);
});
test('missing values never become zero or fresh, and unfinished hydration is not reloaded',async()=>{
 const x=setup();x.chrome.tabs.sendMessage=async()=>({ready:true,balanceReaderVersion:'1.64.0'});
 await x.settle(x.O.refresh());assert.equal(x.saved.apiCredits.chatgpt.amount,3);assert.equal(x.saved.apiCredits.chatgpt.capturedAt,1);
 await x.settle(x.O.refresh());assert.equal(x.calls.create,1);assert.equal(x.calls.reload,0);assert.equal(x.saved.apiCredits.chatgpt.acquisition.status,'waiting');
});
test('closed, activated or navigated acquisition pages cannot cause automatic tab proliferation',async()=>{
 for(const change of ['closed','active','redirect']){
  const x=setup();await x.settle(x.O.refresh());x.tick(60001);
  if(change==='closed')x.close();if(change==='active')x.tab.active=true;if(change==='redirect')x.tab.url='https://platform.openai.com/login';
  await x.settle(x.O.refresh());for(let i=0;i<10;i++){x.tick(60001);await x.settle(x.O.refresh())}
  assert.equal(x.calls.create,1,change);assert.equal(x.calls.reload,0,change);assert.equal(x.calls.release,0,change);
 }
});
test('no matching monitor window never creates a billing tab or changes windows',async()=>{
 const x=setup();x.quiet.create=async()=>{throw Error('No monitor browser window')};await x.settle(x.O.refresh());assert.equal(x.calls.create,0);assert.equal(x.saved.apiCredits.chatgpt.capturedAt,1);
});
test('permission removal and disconnect invalidate late reads without changing other providers',async()=>{
 const x=setup();x.deny();await x.settle(x.O.refresh());assert.equal(x.calls.create,0);
 const y=setup(),send=y.chrome.tabs.sendMessage;y.chrome.tabs.sendMessage=async()=>{await send();y.deny();return {ready:true,balanceReaderVersion:'1.64.0'}};await y.settle(y.O.refresh());assert.equal(y.saved.apiCredits.chatgpt.amount,3);assert.equal(y.calls.release,1);
 const z=setup(),sendZ=z.chrome.tabs.sendMessage;z.chrome.tabs.sendMessage=async()=>{await sendZ();await z.B.configure('chatgpt',false);return {ready:true,balanceReaderVersion:'1.64.0'}};await z.settle(z.O.refresh());assert.equal(z.saved.apiCredits.chatgpt.enabled,false);assert.equal(z.saved.apiCredits.chatgpt.amount,undefined);
});
test('obsolete, stale sibling and loading OpenAI snapshots cannot overwrite a fresh owned read',async()=>{
 const x=setup();await x.settle(x.O.refresh());const at=x.saved.apiCredits.chatgpt.capturedAt;
 for(const msg of [{},{balanceReaderVersion:'1.64.0'},{balanceReaderVersion:'1.64.0',loading:true}]){
  const r=await x.B.receive({service:'chatgpt',status:'ready',amount:99,currency:'USD',...msg},{url:A.PROVIDERS.chatgpt.url,frameId:0,tab:{id:88}});assert.equal(r.ok,false);
 }
 assert.equal(x.saved.apiCredits.chatgpt.capturedAt,at);assert.equal(x.saved.apiCredits.chatgpt.amount,-1.02);
});
test('watchdog releases only its own inactive tab after inactivity',async()=>{
 const x=setup();await x.settle(x.O.refresh());await x.O.release();assert.equal(x.calls.release,0);x.tick(180001);await x.O.release();assert.equal(x.calls.release,1);
 const y=setup();await y.settle(y.O.refresh());y.tab.active=true;y.tick(180001);await y.O.release();assert.equal(y.calls.release,0);
});
test('pending navigation survives multiple attempts without opening another tab',async()=>{
 const x=setup(),url=x.tab.url;x.tab.url='about:blank';x.tab.pendingUrl=url;x.tab.status='loading';
 await x.settle(x.O.refresh());await x.settle(x.O.refresh());assert.equal(x.calls.create,1);assert.equal(x.calls.reload,0);assert.equal(x.calls.release,0);
 x.tab.url=url;x.tab.status='complete';await x.settle(x.O.refresh());assert.equal(x.saved.apiCredits.chatgpt.amount,-1.02);
});
test('a hung reader remains the only pending read across later refresh attempts',async()=>{
 const x=setup();let calls=0;x.chrome.tabs.sendMessage=()=>{calls++;return new Promise(()=>{})};
 await x.settle(x.O.refresh());await x.settle(x.O.refresh());assert.equal(calls,1);assert.equal(x.calls.create,1);assert.equal(x.saved.apiCredits.chatgpt.capturedAt,1);
});
test('moving a billing tab to another window abandons it without reload, removal or replacement',async()=>{
 const x=setup();await x.settle(x.O.refresh());x.tab.windowId=9;x.tick(60001);await x.settle(x.O.refresh());assert.equal(x.calls.release,0);assert.equal(x.calls.reload,0);assert.equal(x.calls.create,1);
});
test('an old installed reader is reinjected once and cannot publish an unsigned replacement',async()=>{
 const x=setup(),send=x.chrome.tabs.sendMessage;let upgraded=false;
 x.chrome.scripting.executeScript=async()=>{x.calls.inject++;upgraded=true};
 x.chrome.tabs.sendMessage=async()=>{if(upgraded)return send();const reply=await x.B.receive({service:'chatgpt',status:'ready',amount:99,currency:'USD'},{url:x.tab.url,frameId:0,tab:{id:77}});assert.equal(reply.ok,false);return {ready:true,version:'1.61.0'}};
 await x.settle(x.O.refresh());assert.equal(x.calls.inject,1);assert.equal(x.saved.apiCredits.chatgpt.amount,-1.02);
});
test('a steady balance from a different billing scope replaces the old scope without previous values',async()=>{
 const x=setup();x.chrome.tabs.sendMessage=async()=>{await x.B.receive({service:'chatgpt',balanceReaderVersion:'1.64.0',status:'ready',amount:-4,currency:'USD',scope:'bbbbbbbb'},{url:x.tab.url,frameId:0,tab:{id:77}});return {ready:true,balanceReaderVersion:'1.64.0'}};
 await x.settle(x.O.refresh());assert.equal(x.saved.apiCredits.chatgpt.scope,'bbbbbbbb');assert.equal(x.saved.apiCredits.chatgpt.previous,undefined);assert.equal(x.saved.apiCredits.chatgpt.amount,-4);
});
test('OpenAI acquisition notes distinguish waiting, ready and stopped states in both languages',()=>{
 const L=require('../extension/locale.js');for(const language of ['ja','en']){L.setLanguage(language);for(const [status,stage]of [['waiting','balance-loading'],['ready','ready'],['paused','closed']]){A.set({chatgpt:{enabled:true,status:'ready',amount:-1.02,currency:'USD',capturedAt:Date.now(),acquisition:{status,stage:'openai-'+stage}}});const html=A.view('chatgpt');assert(!html.includes(language==='ja'?'請求画面を開いて更新してください':'Open the billing page to update'));assert.match(html,/-\$1\.02/);assert.match(html,/裏タブ|取得を停止中|background|Reading paused/)}}
});
