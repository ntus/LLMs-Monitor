const {test}=require('node:test'),a=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
test('permission setup opens a separate tab while rejecting untrusted routes and frames',async()=>{
 const source=fs.readFileSync('extension/background.js','utf8'),start=source.indexOf("if(message.type==='SETUP_INLINE_OPEN'){"),end=source.indexOf("if(message.type==='SETUP_OPEN')",start),fragment=source.slice(start,end);a(start>0&&end>start);a(!fragment.includes('tabs.update'));
 for(const [url,frame,ok] of [['https://llmsmonitor.ntusnog.chatgpt.site/',0,true],['https://llmsmonitor.ntus.info/index.html',0,true],['https://evil.example/',0,false],['https://llmsmonitor.ntus.info/tasks',0,false],['https://llmsmonitor.ntus.info/',1,false]]){
 const opened=[],c=vm.createContext({URL,message:{type:'SETUP_INLINE_OPEN'},sender:{url,frameId:frame,tab:{id:7}},ALLOWED:new Set(['https://llmsmonitor.ntus.info','https://llmsmonitor.ntusnog.chatgpt.site']),chrome:{runtime:{getURL:p=>'chrome-extension://self/'+p}},createNormalTab:async url=>(opened.push(url),{ok:true})});const r=await vm.runInContext('(async()=>{'+fragment+'})()',c);a.equal(r.ok,ok);a.deepEqual(opened,ok?['chrome-extension://self/setup.html']:[]);
 }
});
test('floating renderer includes selected additional services in saved order and hides deselected ones',()=>{
 const c=vm.createContext({Date,URL});for(const name of ['locale.js','preferences.js','changes.js','api-credits.js','grok-quota.js','additional-services.js','shared.js'])vm.runInContext(fs.readFileSync('extension/'+name,'utf8'),c);c.GlanceLocale.setLanguage('ja');
 const data={status:'ready',capturedAt:Date.now(),plan:'Plus',windows:[{label:'週間',remaining:84,resetAt:null,reset:'Resets Oct 25'}]};c.GlanceAdditional.set({grok:{enabled:true,quota:data},deepseek:{enabled:true,capturedAt:Date.now(),rows:[{label:'Balance',value:'$5.00'}]}});
 const settings=JSON.parse(JSON.stringify({serviceOrder:['deepseek','grok','chatgpt','claude','gemini','perplexity','genspark'],hiddenServices:[]})),html=c.Glance.widget({},settings);a.equal((html.match(/class="widget-row/g)||[]).length,7);a(html.indexOf('DeepSeek')<html.indexOf('Grok'));a(html.includes('84%'));a(html.includes('$5.00'));a(html.includes('現地時間0:00想定'));a(!html.includes('タスク未対応'));
 const hidden=c.Glance.widget({},{...settings,hiddenServices:['grok','deepseek','perplexity','genspark']});a(!hidden.includes('>Grok<'));a(!hidden.includes('>DeepSeek<'));
});
test('both floating windows load scrolling styles and setup distinguishes quota from API opt-ins',()=>{
 for(const f of ['extension/floating.html','extension/app.js','extension/index.html','build.py'])a(fs.readFileSync(f,'utf8').includes('floating-services.css'));
 const css=fs.readFileSync('extension/floating-services.css','utf8');a(css.includes('overflow-y:auto!important'));a(css.includes('min-height:150px'));
 const setup=fs.readFileSync('extension/setup.js','utf8');a(setup.includes('Grok · 週間利用枠'));a(setup.includes('API残高だけを有効にしても週間利用枠は取得しません'));
 a(fs.readFileSync('extension/codex-setup.js','utf8').includes('接続確認が通れば再導入は不要'));
});
test('Grok automatic refresh reuses one owned tab, throttles, pauses and respects permission/activation',async()=>{
 let now=100000,granted=true,enabled=true,tab=null,creates=0,reloads=0,releases=0;const saved={};class Clock extends Date{static now(){return now}}
 const chrome={permissions:{contains:async()=>granted},storage:{local:{get:async()=>({'llms-additional-services-v1':{grok:{enabled}}})},session:{get:async k=>({[k]:structuredClone(saved[k])}),set:async v=>Object.assign(saved,structuredClone(v))}},tabs:{get:async id=>{if(!tab||id!==tab.id)throw Error();return tab},reload:async()=>reloads++}};
 const quiet={sameMonitorWindow:async()=>true,create:async url=>(creates++,tab={id:5,url,active:false}),release:async()=>releases++},c=vm.createContext({chrome,GlanceQuietTabs:quiet,Date:Clock});vm.runInContext(fs.readFileSync('extension/grok-refresh.js','utf8'),c);const R=c.GlanceGrokRefresh;
 await Promise.all([R.refresh(),R.refresh(),R.refresh()]);a.equal(creates,1);await R.refresh();a.equal(reloads,0);now+=60001;await R.refresh();a.equal(reloads,1);now+=60001;tab.active=true;await R.refresh();a.equal(reloads,1);tab.active=false;tab.url='https://grok.com/login';await R.refresh();a.equal(saved['llms-grok-refresh-v1'].paused,true);now+=60001;await R.refresh();a.equal(creates,1);a.equal(reloads,1);
 tab.url='https://grok.com/dashboard';await R.refresh(true);a.equal(reloads,2);await R.report(5,true);now+=60001;granted=false;await R.refresh();a.equal(reloads,2);granted=true;enabled=false;await R.refresh();a.equal(reloads,2);enabled=true;tab=null;await R.refresh();a.equal(saved['llms-grok-refresh-v1'].paused,true);now+=60001;await R.refresh();a.equal(creates,1);await R.refresh(true);a.equal(creates,2);await R.stop();a.equal(releases,1);
});
test('Grok missing values stop automatic page reloads rather than retrying indefinitely',async()=>{
 let now=100000,reloads=0;class Clock extends Date{static now(){return now}}const saved={'llms-grok-refresh-v1':{id:5,createdAt:now,at:now}};const chrome={permissions:{contains:async()=>true},storage:{session:{get:async k=>({[k]:saved[k]}),set:async v=>Object.assign(saved,v)},local:{get:async()=>({'llms-additional-services-v1':{grok:{enabled:true}}})}},tabs:{get:async()=>({id:5,url:'https://grok.com/dashboard',active:false}),reload:async()=>reloads++}};const c=vm.createContext({chrome,Date:Clock,GlanceQuietTabs:{sameMonitorWindow:async()=>true}});vm.runInContext(fs.readFileSync('extension/grok-refresh.js','utf8'),c);now+=181000;await c.GlanceGrokRefresh.refresh();a.equal(reloads,0);a.equal(saved['llms-grok-refresh-v1'].paused,true);await c.GlanceGrokRefresh.refresh(true);a.equal(reloads,1);
});
