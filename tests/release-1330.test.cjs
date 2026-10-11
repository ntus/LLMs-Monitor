const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const read=p=>fs.readFileSync(p,'utf8'),tick=()=>new Promise(r=>setImmediate(r));

// Reproduce Chrome's offscreen boundary: runtime exists, all other APIs do not.
// Route the player's nested query through the actual worker message listener.
function pair(){
 const id='a'.repeat(32),base=`chrome-extension://${id}/`,stored={settings:{sound:true,volume:18},data:{untouched:true},history:{untouched:true}},queries=[],tones=[],timers=[];
 let workerListener,externalListener,playerListener,storageChanged,resume,queryMode='normal';
 const event=()=>({addListener(){}}),getURL=n=>base+n;
 function dispatch(listener,m,sender){return new Promise(resolve=>{if(listener(m,sender,resolve)===false)resolve(undefined)})}
 const workerChrome={runtime:{id,getURL,getManifest:()=>({version:'1.33.0'}),onMessage:{addListener:f=>workerListener=f},onMessageExternal:{addListener:f=>externalListener=f},onInstalled:event(),onStartup:event(),sendMessage:async m=>{if(!playerListener)return undefined;return dispatch(playerListener,m,{id,url:base+'background.js'})}},
  storage:{local:{get:async keys=>Object.fromEntries((Array.isArray(keys)?keys:[keys]).map(k=>[k,structuredClone(stored[k])])),set:async x=>{const changes={};for(const[k,v]of Object.entries(x))changes[k]={newValue:structuredClone(v)};Object.assign(stored,structuredClone(x));storageChanged?.(changes,'local')}},onChanged:{addListener:f=>storageChanged=f}},
  offscreen:{hasDocument:async()=>true},alarms:{onAlarm:event()},action:{onClicked:event()},windows:{onRemoved:event()},tabs:{onRemoved:event()},notifications:{onClicked:event()},permissions:{onRemoved:event()},i18n:{getUILanguage:()=> 'ja'}};
 const worker=vm.createContext({chrome:workerChrome,URL,Date,setTimeout,clearTimeout,AbortController});worker.importScripts=(...files)=>files.forEach(n=>vm.runInContext(read('extension/'+n),worker));vm.runInContext(read('extension/background.js'),worker);vm.runInContext('queue=new Promise(()=>{})',worker);
 const runtime={id,getURL,onMessage:{addListener:f=>playerListener=f},sendMessage:async m=>{queries.push(m.type);if(queryMode==='reject')throw Error('worker unavailable');if(queryMode==='missing')return undefined;if(queryMode==='hang')return new Promise(()=>{});return dispatch(workerListener,m,{id,url:base+'offscreen.html'})}};
 const chrome=new Proxy({runtime},{get:(target,k)=>{if(k!=='runtime')throw Error(`Unavailable offscreen API: ${String(k)}`);return target[k]}});
 const param={setValueAtTime(){},exponentialRampToValueAtTime(){}};
 class AudioContext{state='suspended';currentTime=0;destination={};resume(){return new Promise(r=>resume=r)}createOscillator(){const tone={frequency:0,stopped:false};return {frequency:{setValueAtTime:v=>tone.frequency=v},connect(){return this},start(){tones.push(tone)},stop(){tone.stopped=true},disconnect(){}}}createGain(){return {gain:param,connect(){return this},disconnect(){}}}}
 const player=vm.createContext({chrome,AudioContext,Date,setTimeout:(fn,ms)=>{const t={fn,ms,cancelled:false};timers.push(t);return t},clearTimeout:t=>{if(t)t.cancelled=true}});vm.runInContext(read('extension/offscreen.js'),player);
 return {id,base,stored,queries,tones,timers,worker,player,queryMode:v=>queryMode=v,resume:()=>resume(),
  play:(type='PLAY_CHANGE_SOUND',level='normal',extra={})=>dispatch(playerListener,{type,level,volume:18,...extra},{id,url:base+'background.js'}),
  sound:v=>dispatch(workerListener,{type:'SOUND_CONTROL',sound:v},{id,url:base+'index.html',frameId:0}),
  settings:v=>workerChrome.storage.local.set({settings:v}),
  ask:(sender={id,url:base+'offscreen.html'},external=false)=>dispatch(external?externalListener:workerListener,{type:'AUDIO_SOUND_STATE'},sender)};
}
test('runtime-only offscreen starts, nested mute query bypasses stalled quota queue, three tones preserved',async()=>{
 const p=pair(),before=JSON.stringify([p.stored.data,p.stored.history]),work=p.play();await tick();p.resume();const ack=await work;assert.equal(ack.played,true);assert.equal(p.tones[0].frequency,880);assert.deepEqual(p.queries,['AUDIO_SOUND_STATE','AUDIO_SOUND_STATE']);
 for(const ms of [1000,2000])p.timers.find(t=>t.ms===ms&&!t.cancelled).fn();assert.equal(p.tones.length,3);assert.equal(JSON.stringify([p.stored.data,p.stored.history]),before);
});
test('worker OFF during resume cancels playback; OFF after first tone cancels every threshold and repeat timer',async()=>{
 let p=pair(),work=p.play('PLAY_CHANGE_SOUND','critical');await tick();assert.equal((await p.sound(false)).ok,true);p.resume();assert.equal((await work).played,false);assert.equal(p.tones.length,0);
 for(const level of ['low','critical']){p=pair();work=p.play('PLAY_CHANGE_SOUND',level);await tick();p.resume();assert.equal((await work).played,true);assert.equal(p.tones.length,1);assert.equal((await p.sound(false)).ok,true);assert(p.timers.filter(t=>[210,230,1000,2000].includes(t.ms)).every(t=>t.cancelled));for(const t of p.timers)if(!t.cancelled)t.fn();assert.equal(p.tones.length,1)}
});
test('worker storage event cancels active status beats without offscreen storage API',async()=>{
 const p=pair(),work=p.play('PLAY_STATUS_ALERT');await tick();p.resume();assert.equal((await work).played,true);assert.equal(p.tones[0].frequency,990);await p.settings({sound:false,volume:18});assert.equal(p.timers.find(t=>t.ms===320).cancelled,true);assert.equal(p.tones.length,1);
});
test('audio state RPC returns only mute boolean, rejects other senders/routes/frames/external sites',async()=>{
 const p=pair();assert.deepEqual(JSON.parse(JSON.stringify(await p.ask())),{allowed:true});await p.sound(false);assert.equal((await p.ask()).allowed,false);
 for(const sender of [{id:'other',url:p.base+'offscreen.html'},{id:p.id,url:p.base+'index.html'},{id:p.id,url:p.base+'offscreen.html?x=1'},{id:p.id,url:p.base+'offscreen.html',frameId:1},{id:p.id,url:'https://claude.ai/'}])assert.equal((await p.ask(sender)).allowed,false);
 assert.equal((await p.ask({url:'https://llmsmonitor.ntus.info/',frameId:0},true)).allowed,false);
});
test('missing/rejected worker acknowledgement fails closed; stalled acknowledgement is bounded and late resume stays silent',async()=>{
 for(const mode of ['reject','missing']){const p=pair();p.queryMode(mode);assert.equal((await p.play()).played,false);assert.equal(p.tones.length,0)}
 const p=pair();p.queryMode('hang');const work=p.play();await tick();p.timers.find(t=>t.ms===1100).fn();assert.equal((await work).played,false);assert.equal(p.tones.length,0);
});
test('mute default prevents even AudioContext resume; expired request cannot sound',async()=>{
 const p=pair();await p.sound(false);assert.equal((await p.play()).played,false);assert.equal(p.tones.length,0);
 await p.sound(true);const work=p.play('PLAY_CHANGE_SOUND','normal',{expiresAt:Date.now()-1});await tick();p.resume();assert.equal((await work).played,false);assert.equal(p.tones.length,0);
});
