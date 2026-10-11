const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const T=require('../extension/task-list.js'),M=require('../web/tasks-model.js');
function setup(){let now=1000,opened=[],sequence=0;const chrome={runtime:{id:'a'.repeat(32)},windows:{create:async x=>opened.push(x)}};const c=vm.createContext({chrome,LLMTaskList:T,URL,crypto:{randomUUID:()=>`handle-${++sequence}`},Date:class extends Date{static now(){return now}}});vm.runInContext(fs.readFileSync('extension/task-note-background.js','utf8'),c);return {api:c.LLMTaskNoteBackground,chrome,opened,tick:()=>now+=120001};}
const sender=(url='https://chatgpt.com/c/abc')=>({id:'a'.repeat(32),url,frameId:0,tab:{id:10}});
const receiver=target=>({url:target,frameId:0});
test('click registration hands only title/link to a tall independent editor; save is not automatic, token is single-use',async()=>{
 const x=setup(),message={service:'chatgpt',url:sender().url,title:'Synthetic project',language:'ja'};assert.equal((await x.api.register(message,sender())).status,'opened');const window=x.opened[0],u=new URL(window.url);assert.equal(window.type,'popup');assert.equal(window.width,420);assert.equal(window.height,800);assert.equal(u.origin,'https://llmsmonitor.ntus.info');assert(!window.url.includes('Synthetic'));assert(!window.url.includes('/c/abc'));
 const request={service:'chatgpt',token:u.searchParams.get('note')};assert.equal(x.api.read(request,{...receiver(window.url),frameId:1}).status,'unavailable');assert.equal(x.api.read({...request,service:'claude'},receiver(window.url)).status,'unavailable');assert.equal(x.api.read(request,receiver(window.url.replace('llmsmonitor.ntus.info','evil.test'))).status,'unavailable');
 const r=x.api.read(request,receiver(window.url));assert.equal(r.status,'ready');assert.equal(r.task.title,message.title);assert.equal(x.api.read(request,receiver(window.url)).status,'unavailable');assert(!fs.readFileSync('extension/task-note-background.js','utf8').includes('.storage'));
});
test('registration requires provider top frame, same extension and exact sender conversation route; expired handoff cannot be read',async()=>{
 const x=setup(),m={service:'chatgpt',url:sender().url,title:'Example'};for(const s of [{...sender(),frameId:2},{...sender(),id:'b'.repeat(32)},sender('https://evil.test/c/abc'),sender('https://chatgpt.com/settings')])assert.equal((await x.api.register(m,s)).status,'unavailable');assert.equal((await x.api.register({...m,url:'https://chatgpt.com/c/other'},sender())).status,'unavailable');assert.equal(x.opened.length,0);
 await x.api.register(m,sender());const u=new URL(x.opened[0].url);x.tick();assert.equal(x.api.read({service:'chatgpt',token:u.searchParams.get('note')},receiver(u.href)).status,'unavailable');
});
test('Claude project-thread note routes remain distinct from quota task state routes; unknown query and account mismatch rejected',()=>{
 const x=setup(),url='https://claude.ai/code/project/chan_demo?thread=cmsg_demo';assert.equal(x.api.route(url,'claude'),url);assert.equal(M.noteURL(url,'claude'),url);assert.equal(M.safeURL(url,'claude'),'');for(const bad of [url+'&token=x',url+'&thread=cmsg_other',url.replace('cmsg_demo','other'),url+'#private',url.replace('claude.ai','claude.ai.evil.test')]){assert.equal(x.api.route(bad,'claude'),'');assert.equal(M.noteURL(bad,'claude'),'');}
 assert.equal(M.noteURL('https://gemini.google.com/u/1/app/demo','gemini'),'https://gemini.google.com/u/1/app/demo');assert.equal(M.noteURL('https://gemini.google.com/u/1/app/demo','claude'),'');
});
test('registration dispatch bypasses stalled quota queue without widening TASKS_READ or sender validation',()=>{
 const s=fs.readFileSync('extension/background.js','utf8');assert.match(s,/TASK_NOTE_REGISTER'&&!external/);assert.match(s,/TASK_NOTE_READ'&&external&&trusted/);assert.match(s,/\['TASKS_READ','TASKS_STATE','TASK_NOTE_REGISTER','TASK_NOTE_READ'\]/);assert.match(s,/sender.frameId!==0/);
 const content=fs.readFileSync('extension/task-note-button.js','utf8');assert(!/\.innerText|\.textContent\s*[^=]|querySelector|\.storage|fetch\(|\.value\b|document\.body/.test(content));assert.match(content,/button.onclick/);assert.match(content,/mode:'closed'/);
});
