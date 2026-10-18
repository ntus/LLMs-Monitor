const {test}=require('node:test'),a=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),A=require('../extension/additional-services.js');
test('only one preferred Grok tab and the current reader version may replace weekly quota',async()=>{
 const key='llms-additional-services-v1',saved={[key]:{grok:{enabled:true}}},accepted=[],tabs=[{id:1,url:'https://grok.com/dashboard',lastAccessed:10},{id:2,url:'https://grok.com/dashboard',lastAccessed:20,active:true}];
 const chrome={runtime:{id:'self'},permissions:{contains:async()=>true},tabs:{query:async()=>tabs},storage:{local:{get:async k=>({[k]:saved[k]}),set:async v=>Object.assign(saved,v)}}};
 const c=vm.createContext({GlanceAdditional:A,GlanceGrokQuota:require('../extension/grok-quota.js'),GlanceGrokAccept:async q=>accepted.push(q),chrome,Date});vm.runInContext(fs.readFileSync('extension/additional-background.js','utf8'),c);
 const message=n=>({service:'grok',readerVersion:'1.54.0',quota:{plan:'Plus',windows:[{label:'週間',remaining:n,resetAt:null,reset:'Resets Oct 25'}]},rows:[]}),sender=id=>({id:'self',url:'https://grok.com/dashboard',frameId:0,tab:{id}});
 a.equal((await c.GlanceAdditionalBackground.receive(message(84),sender(2))).ok,true);a.equal((await c.GlanceAdditionalBackground.receive(message(100),sender(1))).ok,false);a.equal((await c.GlanceAdditionalBackground.receive({...message(100),readerVersion:'1.53.0'},sender(2))).ok,false);a.deepEqual(accepted.map(q=>q.windows[0].remaining),[84]);
});
test('display settings are separate; main exposes explicit task and floating actions; Grok API is last',()=>{
 a.deepEqual(Object.keys(require('../extension/api-credits.js').PROVIDERS),['chatgpt','claude','gemini','grok']);
 const html=fs.readFileSync('extension/index.html','utf8');a(html.indexOf('id="service-list"')<html.indexOf('<section class="workspace">'));a(html.indexOf('id="pip"')<html.indexOf('id="cards"'));for(const id of ['chatgpt','claude','gemini'])a(html.includes('data-task-service="'+id+'"'));
 a.equal((html.match(/id="pip"/g)||[]).length,1);a.equal((html.match(/id="floating-normal"/g)||[]).length,1);
 const app=fs.readFileSync('extension/app.js','utf8');a(app.includes('pendingSelection={serviceOrder:'));a(app.includes('Object.assign(settings,pendingSelection)'));
});
test('additional reader waits for a stable repeated weekly reading before publishing a changed quota',async()=>{
 let now=10000,result=84,published=[],listener,timers=[];class Clock extends Date{static now(){return now}}
 const c=vm.createContext({Date:Clock,GlanceAdditional:A,GlanceGrokQuota:{collect:()=>({status:'ready',windows:[{label:'週間',remaining:result}]})},document:{body:{}},location:{href:'https://grok.com/dashboard'},chrome:{runtime:{onMessage:{addListener:f=>listener=f},sendMessage:async m=>m.type==='ADDITIONAL_READER_STATUS'?{enabled:true}:published.push(m)}},setTimeout:f=>(timers.push(f),timers.length),clearTimeout(){},setInterval(){},MutationObserver:class{observe(){}}});vm.runInContext(fs.readFileSync('extension/additional-reader.js','utf8'),c);
 const read=()=>new Promise(resolve=>listener({type:'ADDITIONAL_READ'},null,resolve));await read();a.equal(published.length,0);now+=1800;await read();a.equal(published[0].quota.windows[0].remaining,84);result=100;now+=1800;await read();a.equal(published.length,1);result=84;now+=1800;await read();a.equal(published.length,1);now+=1800;await read();a.equal(published.at(-1).quota.windows[0].remaining,84);
});
test('saved additional service selection survives reload and a stale GET cannot undo a new selection',()=>{
 const P=require('../extension/preferences.js'),choice={serviceOrder:['chatgpt','grok','deepseek','claude','gemini'],hiddenServices:['perplexity','genspark']};
 const loaded=P.normalize(JSON.parse(JSON.stringify(choice)));a(P.visible(loaded).includes('grok'));a(P.visible(loaded).includes('deepseek'));
 const app=fs.readFileSync('extension/app.js','utf8'),start=app.indexOf('settings=P.normalize({...settings,...r.settings'),end=app.indexOf('if(pendingUsageDisplay&&',start),fragment=app.slice(start,end);
 const c=vm.createContext({P,settings:loaded,r:{settings:{serviceOrder:['chatgpt','claude','gemini'],hiddenServices:['grok','deepseek']}},pendingSelection:choice,selectionRevision:2,selectionAtStart:1,volumeEditing:false});vm.runInContext(fragment,c);a.deepEqual(Array.from(P.visible(c.settings)),P.visible(choice));a(c.pendingSelection);
 c.r.settings=choice;c.selectionAtStart=2;vm.runInContext(fragment,c);a.equal(c.pendingSelection,null);a.deepEqual(Array.from(P.visible(c.settings)),P.visible(choice));
});
