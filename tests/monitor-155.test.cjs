const {test}=require('node:test'),a=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),Q=require('../extension/grok-quota.js');
test('Grok date-only midnight is a labelled display estimate and never changes canonical reset or quota',()=>{
 const anchor=new Date(2026,9,18,12,30).getTime(),w={label:'週間',remaining:84,resetAt:null,reset:'Resets Oct 25'},copy=JSON.stringify(w),d=Q.assumedWindow(w,anchor);a.equal(d.resetAt,new Date(2026,9,25,0,0).getTime());a.equal(d.resetIsEstimate,true);a.equal(JSON.stringify(w),copy);
 const c=vm.createContext({Date,URL});for(const name of ['locale.js','preferences.js','changes.js','shared.js'])vm.runInContext(fs.readFileSync('extension/'+name,'utf8'),c);c.GlanceLocale.setLanguage('ja');a.match(c.Glance.resetTimestamp(d),/10\/25・現地時間0:00想定/);a.match(c.Glance.quotaCountdown(d,anchor),/あと6日11時間30分・想定/);a.match(c.Glance.quotaCountdown(d,d.resetAt+1),/想定日時を経過/);
 a.equal(Q.assumedWindow({...w,reset:'Resets Feb 30'},anchor).resetAt,null);a.equal(new Date(Q.assumedWindow({...w,reset:'Resets Jan 2'},new Date(2026,11,29).getTime()).resetAt).getFullYear(),2027);
 const exact={...w,resetAt:anchor+60000};a.equal(Q.assumedWindow(exact,anchor),exact);a.equal(Q.sanitize({plan:'Plus',windows:[w]}).windows[0].resetAt,null);
});
test('Codex installer requirement is red only for confirmed missing host; ready and unknown states stay distinct',async()=>{
 for(const status of ['ready','helper-required','codex-not-found','native-api-unavailable','unavailable']){
 const ids=['description','step-one','step-two','technical-label','extension-id','download','install-help','step-three','enable','disable','check','guide','limits','result','restart','restart-help','installer-status'],nodes=Object.fromEntries(ids.map(id=>[id,{style:{},textContent:''}]));
 const chrome={runtime:{id:'a'.repeat(32),sendMessage:async m=>m.type==='GET'?{settings:{language:'ja'}}:m.type==='CODEX_CONFIG_READ'?{enabled:true,permission:true,apiAvailable:true}:{status,tasks:[],pinAudit:{resolved:0},runtime:'metadata-only'}},permissions:{request:async()=>false}};
 const c=vm.createContext({chrome,navigator:{language:'ja'},document:{documentElement:{},getElementById:id=>nodes[id]},setTimeout});vm.runInContext(fs.readFileSync('extension/codex-setup.js','utf8'),c);await new Promise(setImmediate);
 a.equal(nodes['installer-status'].style.color==='#ff6776',status==='helper-required');if(status==='ready')a.match(nodes['installer-status'].textContent,/追加導入は不要/);if(status==='helper-required')a.match(nodes['installer-status'].textContent,/導入ZIPが必要/);if(status==='unavailable')a.match(nodes['installer-status'].textContent,/確認できません/);
 }
});
test('supported task entry is beside the badge and unsupported service tasks are not advertised as implemented',()=>{
 const app=fs.readFileSync('extension/app.js','utf8');a.match(app,/G\.status\(s\)[\s\S]{0,80}class="card-task-button"/);a(app.includes('data-task-service="${id}"'));
 for(const file of ['extension/grok-quota.js','extension/additional-services.js'])a(fs.readFileSync(file,'utf8').includes('タスク未対応'));
 a(fs.readFileSync('extension/navigation.js','utf8').includes("link.closest('details')?.removeAttribute('open')"));
});
test('native missing-host failures are classified without conflating general failures or changing permissions',async()=>{
 for(const message of ['Specified native messaging host not found.','Access to the specified native messaging host is forbidden.','Native host has exited.']){
 let disconnect;const id='a'.repeat(32),chrome={runtime:{id,getURL:p=>'chrome-extension://'+id+'/'+p,lastError:{message},connectNative:()=>({onMessage:{addListener(){}},onDisconnect:{addListener:f=>disconnect=f},postMessage(){},disconnect(){}})},permissions:{contains:async()=>true},storage:{local:{get:async()=>({'llms-codex-enabled-v1':true})}}};
 const c=vm.createContext({chrome,URL,Date,setTimeout,clearTimeout});vm.runInContext(fs.readFileSync('extension/tasks-codex-background.js','utf8'),c);const task=c.LLMTaskCodexBackground.handle({type:'CODEX_CHECK'},{id,frameId:0,url:chrome.runtime.getURL('codex-setup.html')},false);await new Promise(setImmediate);disconnect();a.equal((await task).status,message==='Native host has exited.'?'unavailable':'helper-required');
 }
});
