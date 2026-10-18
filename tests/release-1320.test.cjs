const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const tick=()=>new Promise(r=>setImmediate(r)),read=f=>fs.readFileSync(f,'utf8');
function audio(){let listener,resume,settings={sound:true},starts=0,stops=0;const timers=[],param={setValueAtTime(){},exponentialRampToValueAtTime(){}};
 class AudioContext{state='suspended';currentTime=0;destination={};resume(){return new Promise(r=>resume=r)}createOscillator(){return {frequency:param,connect(){return this},start(){starts++},stop(){stops++},disconnect(){}}}createGain(){return {gain:param,connect(){return this},disconnect(){}}}}
 const chrome={runtime:{id:'audio',onMessage:{addListener:f=>listener=f},sendMessage:async()=>({allowed:settings.sound!==false})}};
 vm.runInNewContext(read('extension/offscreen.js'),{chrome,AudioContext,Date,setTimeout:(fn,ms)=>{const t={fn,ms,cancelled:false};timers.push(t);return t},clearTimeout:t=>{if(t)t.cancelled=true}});
 return {send:(m,reply=()=>{})=>listener(m,{id:'audio'},reply),mute:()=>{settings={sound:false};listener({type:'STOP_NOTIFICATION_SOUND'},{id:'audio'},()=>{})},resume:()=>resume(),timers,starts:()=>starts,stops:()=>stops};
}
test('offscreen OFF cancels pending resume, all repeated beats and threshold second tone',async()=>{
 let x=audio(),ack;x.send({type:'PLAY_CHANGE_SOUND',level:'critical'},r=>ack=r);await tick();x.mute();x.resume();await tick();assert.equal(x.starts(),0);assert.equal(ack.played,false);
 x=audio();x.send({type:'PLAY_CHANGE_SOUND',level:'critical'});await tick();x.resume();await tick();assert.equal(x.starts(),1);const stops=x.stops();x.mute();assert(x.stops()>stops);for(const t of x.timers)if(!t.cancelled)t.fn();assert.equal(x.starts(),1);
 x=audio();x.mute();x.send({type:'PLAY_STATUS_ALERT'},r=>ack=r);await tick();assert.equal(x.starts(),0);assert.equal(ack.played,false);
});
test('local notifier OFF wins over late enable; preview remains OFF and schedules no repeat clock',async()=>{
 const S=require('../extension/sound.js');let release,tones=0,scheduled=0,stops=0;
 class Audio{state='running';currentTime=0;resume(){return new Promise(r=>release=r)}createOscillator(){return {frequency:{},connect(){},start(){tones++},stop(){stops++},disconnect(){}}}createGain(){return {gain:{setValueAtTime(){},linearRampToValueAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}}}}
 const n=S.createNotifier({active:()=>true,AudioContextClass:Audio,schedule:()=>{scheduled++},cancel(){}}),enabled=n.enable();n.disable();release();await enabled;assert.equal(n.isEnabled(),false);assert.equal(scheduled,0);
 const preview=n.test();release();await preview;assert.equal(tones,1);assert.equal(n.isEnabled(),false);assert.equal(scheduled,0);const before=stops;n.disable();assert(stops>before);
});
function notes(session){let seq=0,opened=[];const chrome={runtime:{id:'a'.repeat(32)},storage:{session},windows:{create:async x=>opened.push(x)}};const c=vm.createContext({chrome,URL,Date,crypto:{randomUUID:()=>`opaque-${++seq}`},LLMTaskList:require('../extension/task-list.js')});vm.runInContext(read('extension/task-note-background.js'),c);return {api:c.LLMTaskNoteBackground,opened};}
test('single-use note survives worker restart; receiver service, route and duplicates still rejected',async()=>{
 const values={},session={get:async k=>({[k]:structuredClone(values[k])}),set:async x=>Object.assign(values,structuredClone(x)),remove:async k=>delete values[k]};
 let x=notes(session);const sender={id:'a'.repeat(32),url:'https://claude.ai/chat/demo',frameId:0,tab:{id:12}};assert.equal((await x.api.register({service:'claude',url:sender.url,title:'Synthetic thread'},sender)).status,'opened');const target=x.opened[0].url,u=new URL(target),request={service:'claude',token:u.searchParams.get('note')};assert(!target.includes(sender.url));
 x=notes(session);assert.equal((await x.api.read(request,{frameId:0,url:target+'&service=chatgpt'})).status,'unavailable');
 const results=await Promise.all([x.api.read(request,{frameId:0,url:target}),x.api.read(request,{frameId:0,url:target})]);assert.deepEqual(results.map(r=>r.status),['ready','unavailable']);assert.equal(results[0].task.title,'Synthetic thread');assert.deepEqual(values,{});
});
test('Claude thread title is selected by exact pane ID and header attribute; never reads chat text',()=>{
 const T=require('../extension/task-list.js');const c=vm.createContext({URL,LLMTaskList:T});vm.runInContext(read('extension/task-note-metadata.js'),c);const visible={closest:()=>null,getClientRects:()=>[{}]};
 const head={...visible,getAttribute:()=> 'Synthetic actual thread',get textContent(){throw Error('body read')}},pane={...visible,getAttribute:()=> 'thread:cmsg_demo',querySelectorAll:()=>[head],get textContent(){throw Error('body read')}};
 const doc={title:'Synthetic project - Claude Code',querySelectorAll:()=>[pane],get body(){throw Error('body read')}};
 const url='https://claude.ai/code/project/chan_demo?thread=cmsg_demo';assert.equal(c.LLMTaskNoteMetadata.title(doc,url,'claude'),'Synthetic actual thread');assert.equal(c.LLMTaskNoteMetadata.title(doc,url.replace('cmsg_demo','cmsg_other'),'claude'),'');doc.querySelectorAll=()=>[pane,pane];assert.equal(c.LLMTaskNoteMetadata.title(doc,url,'claude'),'');
});
function background(){const stored={settings:{sound:true,language:'ja'},data:{private:'unchanged'},history:{private:'unchanged'}};let listener;const sent=[],event=()=>({addListener(){}}),chrome={runtime:{id:'a'.repeat(32),getURL:n=>'chrome-extension://'+'a'.repeat(32)+'/'+n,getManifest:()=>({version:'1.32.0'}),sendMessage:async m=>{sent.push(m);return {played:true}},onMessage:event(),onMessageExternal:{addListener:f=>listener=f},onInstalled:event(),onStartup:event()},storage:{local:{get:async keys=>Object.fromEntries((Array.isArray(keys)?keys:[keys]).map(k=>[k,structuredClone(stored[k])])),set:async x=>Object.assign(stored,structuredClone(x))}},alarms:{onAlarm:event()},action:{onClicked:event()},windows:{onRemoved:event()},tabs:{onRemoved:event()},notifications:{onClicked:event()},permissions:{onRemoved:event()},i18n:{getUILanguage:()=> 'ja'}};
 const c=vm.createContext({chrome,URL,Date,setTimeout,clearTimeout,AbortController});c.importScripts=(...f)=>f.forEach(n=>vm.runInContext(read('extension/'+n),c));vm.runInContext(read('extension/background.js'),c);vm.runInContext('queue=new Promise(()=>{})',c);
 return {stored,sent,c,send:(message,url='https://llmsmonitor.ntus.info/',frameId=0)=>new Promise(resolve=>listener(message,{url,frameId},resolve))};
}
test('mute bypasses a stalled quota queue and survives stale full SETTINGS writes; no quota/history writes',async()=>{
 const x=background(),before=JSON.stringify([x.stored.data,x.stored.history]);let timer;
 const r=await Promise.race([x.send({type:'SOUND_CONTROL',sound:false}),new Promise((_,reject)=>timer=setTimeout(()=>reject(Error('mute blocked')),700))]).finally(()=>clearTimeout(timer));assert.equal(r.ok,true);assert.equal(x.stored.settings.sound,false);assert.equal(x.sent[0].type,'STOP_NOTIFICATION_SOUND');
 await x.send({type:'SETTINGS',preserveSound:true,settings:{sound:true,enabled:true,language:'en'}});assert.equal(x.stored.settings.sound,false);assert.equal(JSON.stringify([x.stored.data,x.stored.history]),before);
 for(const [url,frame]of [['https://evil.test/',0],['https://llmsmonitor.ntus.info/tasks?service=claude',0],['https://llmsmonitor.ntus.info/',1]])assert.equal((await x.send({type:'SOUND_CONTROL',sound:true},url,frame)).ok,false);assert.equal(x.stored.settings.sound,false);
});
test('audio setup completing after OFF cannot dispatch a change or incident sound',async()=>{
 const x=background();let release;x.c.chrome.offscreen={hasDocument:()=>new Promise(r=>release=r)};const sound=vm.runInContext('playChangeSound()',x.c);await tick();await x.send({type:'SOUND_CONTROL',sound:false});release(true);assert.equal(await sound,false);assert(!x.sent.some(m=>m.type==='PLAY_CHANGE_SOUND'));await vm.runInContext('playStatusAlert()',x.c);assert(!x.sent.some(m=>m.type==='PLAY_STATUS_ALERT'));
});
test('ChatGPT incident view uses fixed Tibo 𝕏 staff link without changing official source or other providers',()=>{
 const S=require('../extension/provider-status.js'),html=S.view({chatgpt:{state:'issue',summary:'Synthetic'},claude:{state:'ok'}},'ja',true);assert(html.includes('Tibo 𝕏 ↗'));assert(html.includes('https://x.com/thsottiaux'));assert(html.includes('https://status.openai.com/'));const limited=S.view({claude:{state:'issue',summary:'Synthetic'}},'en',true,{issuesOnly:true});assert(!limited.includes('Tibo'));assert(!limited.includes('ChatGPT'));
});
test('expiry alarm removes session handoff after TTL without requiring the main monitor',async()=>{
 let now=1000,alarm,when,values={},opened;const session={get:async k=>({[k]:structuredClone(values[k])}),set:async x=>Object.assign(values,structuredClone(x)),remove:async k=>delete values[k]};
 const chrome={runtime:{id:'a'.repeat(32)},storage:{session},windows:{create:async x=>opened=x},alarms:{create:(name,opt)=>when=opt.when,clear:async()=>{},onAlarm:{addListener:f=>alarm=f}}},c=vm.createContext({chrome,URL,Date:class extends Date{static now(){return now}},crypto:{randomUUID:()=> 'opaque-test'},LLMTaskList:require('../extension/task-list.js')});vm.runInContext(read('extension/task-note-background.js'),c);
 await c.LLMTaskNoteBackground.register({service:'chatgpt',url:'https://chatgpt.com/c/demo',title:'Synthetic'},{id:chrome.runtime.id,url:'https://chatgpt.com/c/demo',frameId:0,tab:{id:1}});assert.equal(when,now+120001);assert(Object.keys(values).length);now=when;alarm({name:'llms-task-note-expiry'});await tick();assert.deepEqual(values,{});
});
test('session handoff storage failure never falls back to disk or opens an unusable editor',async()=>{
 const x=notes({get:async()=>{throw Error('session unavailable')}});assert.equal((await x.api.register({service:'chatgpt',url:'https://chatgpt.com/c/demo',title:'Synthetic'},{id:'a'.repeat(32),url:'https://chatgpt.com/c/demo',frameId:0,tab:{id:1}})).status,'unavailable');assert.equal(x.opened.length,0);
});
test('an old GET reply cannot undo a newer OFF click in the real sync function',async()=>{
 const source=read('extension/app.js'),sync=source.slice(source.indexOf('async function sync(){'),source.indexOf('async function commitSound('));let resolve,disabled=0;
 const c=vm.createContext({performance:{now:()=>1},rpc:()=>new Promise(r=>resolve=r),data:{},providerStatus:{},intelligenceFeed:{},providerAlertKey:'',historyMeta:{},extensionVersion:'',settings:{sound:true},selectionRevision:0,pendingSelection:null,pendingUsageDisplay:null,pendingLanguage:null,pendingSound:null,soundDesired:true,soundRevision:0,volumeEditing:false,theme:'dark',language:'ja',connected:true,GlanceApiCredits:{set(){}},S:{normalize:r=>r||{},incidentKey:()=>''},I:{normalize:r=>r},G:{observe(){}},P:{normalize:r=>r},L:{t:k=>k,setLanguage(){}},notifier:{disable(){disabled++}},applyControls(){},applyTheme(){},paintLanguage(){},paintSound(){},render(){},paintHistoryStatus(){}});vm.runInContext(sync,c);
 const work=c.sync();c.soundRevision++;c.soundDesired=false;c.settings.sound=false;resolve({data:{},settings:{sound:true,language:'ja'},providerStatus:{}});await work;assert.equal(c.soundDesired,false);assert.equal(c.settings.sound,false);assert.equal(disabled,1);assert.equal(c.connected,true);
});
test('old installed extensions still accept explicit sound preference via legacy SETTINGS fallback',async()=>{
 const source=read('extension/app.js'),helper=source.slice(source.indexOf('async function commitSound('),source.indexOf('function paintServiceControls()'));const calls=[],c=vm.createContext({settings:{sound:true,volume:18,language:'ja'},L:{t:k=>k},rpc:async m=>{calls.push(m);if(m.type==='SOUND_CONTROL')throw Error('未対応の操作');return {ok:true}}});vm.runInContext(helper,c);assert.equal((await c.commitSound(false)).ok,true);assert.equal(calls[1].type,'SETTINGS');assert.equal(calls[1].settings.sound,false);assert.equal(calls[1].settings.volume,18);
});
