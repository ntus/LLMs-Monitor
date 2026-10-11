const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const T=require('../extension/task-list.js'),M=require('../web/tasks-model.js');
function setup(){let now=1000,opened=[],sequence=0;const values={},session={get:async k=>({[k]:structuredClone(values[k])}),set:async v=>Object.assign(values,structuredClone(v)),remove:async k=>delete values[k]};const chrome={storage:{session},runtime:{id:'a'.repeat(32)},windows:{create:async x=>opened.push(x)}};const c=vm.createContext({chrome,LLMTaskList:T,URL,crypto:{randomUUID:()=>`handle-${++sequence}`},Date:class extends Date{static now(){return now}}});vm.runInContext(fs.readFileSync('extension/task-note-background.js','utf8'),c);return {api:c.LLMTaskNoteBackground,chrome,opened,tick:()=>now+=120001};}
const sender=(url='https://chatgpt.com/c/abc')=>({id:'a'.repeat(32),url,frameId:0,tab:{id:10}});
const receiver=target=>({url:target,frameId:0});
test('click registration hands only title/link to a tall independent editor; save is not automatic, token is single-use',async()=>{
 const x=setup(),message={service:'chatgpt',url:sender().url,title:'Synthetic project',language:'ja'};assert.equal((await x.api.register(message,sender())).status,'opened');const window=x.opened[0],u=new URL(window.url);assert.equal(window.type,'popup');assert.equal(window.width,420);assert.equal(window.height,800);assert.equal(u.origin,'https://llmsmonitor.ntus.info');assert(!window.url.includes('Synthetic'));assert(!window.url.includes('/c/abc'));
 const request={service:'chatgpt',token:u.searchParams.get('note')};assert.equal((await x.api.read(request,{...receiver(window.url),frameId:1})).status,'unavailable');assert.equal((await x.api.read({...request,service:'claude'},receiver(window.url))).status,'unavailable');assert.equal((await x.api.read(request,receiver(window.url.replace('llmsmonitor.ntus.info','evil.test')))).status,'unavailable');
 const r=await x.api.read(request,receiver(window.url));assert.equal(r.status,'ready');assert.equal(r.task.title,message.title);assert.equal((await x.api.read(request,receiver(window.url))).status,'unavailable');assert(!fs.readFileSync('extension/task-note-background.js','utf8').includes('.storage.local'));
});
test('registration requires provider top frame, same extension and exact sender conversation route; expired handoff cannot be read',async()=>{
 const x=setup(),m={service:'chatgpt',url:sender().url,title:'Example'};for(const s of [{...sender(),frameId:2},{...sender(),id:'b'.repeat(32)},sender('https://evil.test/c/abc'),sender('https://chatgpt.com/settings')])assert.equal((await x.api.register(m,s)).status,'unavailable');assert.equal((await x.api.register({...m,url:'https://chatgpt.com/c/other'},sender())).status,'unavailable');assert.equal(x.opened.length,0);
 await x.api.register(m,sender());const u=new URL(x.opened[0].url);x.tick();assert.equal((await x.api.read({service:'chatgpt',token:u.searchParams.get('note')},receiver(u.href))).status,'unavailable');
});
test('Claude project-thread note routes remain distinct from quota task state routes; unknown query and account mismatch rejected',()=>{
 const x=setup(),url='https://claude.ai/code/project/chan_demo?thread=cmsg_demo';assert.equal(x.api.route(url,'claude'),url);assert.equal(M.noteURL(url,'claude'),url);assert.equal(M.safeURL(url,'claude'),'');for(const bad of [url+'&token=x',url+'&thread=cmsg_other',url.replace('cmsg_demo','other'),url+'#private',url.replace('claude.ai','claude.ai.evil.test')]){assert.equal(x.api.route(bad,'claude'),'');assert.equal(M.noteURL(bad,'claude'),'');}
 assert.equal(M.noteURL('https://gemini.google.com/u/1/app/demo','gemini'),'https://gemini.google.com/u/1/app/demo');assert.equal(M.noteURL('https://gemini.google.com/u/1/app/demo','claude'),'');
});
test('registration dispatch bypasses stalled quota queue without widening TASKS_READ or sender validation',()=>{
 const s=fs.readFileSync('extension/background.js','utf8');assert.match(s,/TASK_NOTE_REGISTER'&&!external/);assert.match(s,/TASK_NOTE_READ'&&external&&trusted/);assert.match(s,/\['TASKS_MONITOR','TASKS_READ','TASKS_STATE','TASK_NOTE_REGISTER','TASK_NOTE_READ'\]/);assert.match(s,/sender.frameId!==0/);
 const content=fs.readFileSync('extension/task-note-button.js','utf8');assert(!/\.innerText|\.textContent\s*[^=]|querySelector|\.storage|fetch\(|\.value\b|document\.body/.test(content));assert.match(content,/button.onclick/);assert.match(content,/mode:'closed'/);
});

test('Claude display:contents tile registers the selected thread through handoff and saves sibling threads separately',async()=>{
 const metadata=vm.createContext({URL,LLMTaskList:T});vm.runInContext(fs.readFileSync('extension/task-note-metadata.js','utf8'),metadata);
 const heading=(title,hidden=false)=>({closest:()=>hidden?{}:null,getClientRects:()=>[{}],getAttribute:()=>title,get textContent(){throw Error('conversation text must not be read')}});
 const tile=(id,title,hidden=false)=>({closest:()=>hidden?{}:null,getClientRects:()=>[],getAttribute:()=>id,querySelectorAll:()=>[heading(title)],get textContent(){throw Error('pane text must not be read')}});
 const first=tile('thread:cmsg_one','Synthetic first thread'),second=tile('thread:cmsg_two','Synthetic second thread'),project=tile('coordinator','Synthetic project');
 const doc={title:'Synthetic project - Claude Code',querySelectorAll:()=>[project,first,second],get body(){throw Error('body must not be read')}};
 const memory=new Map(),notesContext=vm.createContext({LLMTaskModel:M,TextEncoder,Date});vm.runInContext(fs.readFileSync('web/tasks-notes.js','utf8'),notesContext);const store=notesContext.LLMTaskNotes.create({getItem:k=>memory.get(k),setItem:(k,v)=>memory.set(k,v)}),x=setup();
 for(const [thread,title]of [['one','Synthetic first thread'],['two','Synthetic second thread']]){
  const url=`https://claude.ai/code/project/chan_demo?thread=cmsg_${thread}`,observed=metadata.LLMTaskNoteMetadata.title(doc,url,'claude');assert.equal(observed,title);
  assert.equal((await x.api.register({service:'claude',url,title:observed},sender(url))).status,'opened');const target=x.opened.at(-1).url;
  const result=await x.api.read({service:'claude',token:new URL(target).searchParams.get('note')},receiver(target));assert.equal(result.status,'ready');assert.equal(result.task.url,url);assert.equal(result.task.title,title);
  store.save({...result.task,workspace:'default',current:'Synthetic next step'});
 }
 assert.equal(store.all().length,2);for(const n of store.all()){assert.equal(M.noteURL(n.url,'claude'),n.url);assert(n.url.includes('?thread='));assert.notEqual(n.title,'Synthetic project')}
 const url='https://claude.ai/code/project/chan_demo?thread=cmsg_one';
 doc.querySelectorAll=()=>[tile('thread:cmsg_one','Hidden thread',true)];assert.equal(metadata.LLMTaskNoteMetadata.title(doc,url,'claude'),'');
 doc.querySelectorAll=()=>[first,first];assert.equal(metadata.LLMTaskNoteMetadata.title(doc,url,'claude'),'');
 doc.querySelectorAll=()=>[Object.assign(Object.create(first),{querySelectorAll:()=>[heading('Hidden heading',true)]})];assert.equal(metadata.LLMTaskNoteMetadata.title(doc,url,'claude'),'');
});
