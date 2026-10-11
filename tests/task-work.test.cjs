const {test}=require('node:test'),assert=require('node:assert/strict');
global.LLMTaskModel=require('../web/tasks-model.js');const M=global.LLMTaskModel,N=require('../web/tasks-notes.js'),T=require('../extension/task-list.js');
const note=()=>({service:'chatgpt',workspace:'personal',url:'https://chatgpt.com/c/abc',title:'Work',purpose:'Build',current:'Review',next:'Test',waiting:'Approval',cautions:'Keep quotas',checklist:[{text:'Tests',done:true},{text:'Review',done:false}]});
function storage(){const m=new Map();return {getItem:k=>m.get(k),setItem:(k,v)=>m.set(k,v)}}
test('explicit work notes survive recreation, retain absent threads, isolate workspace/provider and detect concurrent edits',()=>{
 const mem=storage(),a=N.create(mem),b=N.create(mem);const n=a.save(note());assert.equal(n.revision,1);assert.equal(b.all().length,1);assert.equal(b.get('chatgpt','other',n.url),undefined);assert.equal(b.get('claude','personal',n.url),undefined);
 b.save({...n,current:'Changed'},1);assert.throws(()=>a.save({...n,current:'Old edit'},1),/conflict/);assert.equal(a.all()[0].current,'Changed');assert.equal(a.all()[0].checklist[0].done,true);
});
test('handoff export/import validates routes, bounds data and rejects overlap atomically without changing original notes',()=>{
 const a=N.create(storage()),b=N.create(storage());a.save(note());b.import(a.export());assert.equal(b.all()[0].purpose,'Build');const before=b.export();assert.throws(()=>b.import(a.export()));assert.equal(b.export(),before);
 assert.throws(()=>N.validate({...note(),url:'https://evil.test/c/abc'}));assert.throws(()=>N.decode(' '.repeat(N.MAX_BYTES+1)));assert.throws(()=>N.decode(JSON.stringify({schemaVersion:1,notes:[note(),note()]})));
 const en=N.handoff(a.all()[0]),ja=N.handoff(a.all()[0],'ja');assert.match(en,/\[x\] Tests/);assert.match(ja,/再開時の注意/);assert.match(en,/separate from observed execution/);
});
test('failed storage never reports success or touches quota storage',()=>{
 const saved=[],s=N.create({getItem:()=>null,setItem:(k)=>{saved.push(k);throw Error('quota')}});assert.throws(()=>s.save(note()));assert.deepEqual(saved,[N.KEY]);
});
test('project/group labels hide internal IDs without claiming unknown affiliation is none; pins stay first stably',()=>{
 const s=M.normalize({schemaVersion:1,service:'chatgpt',capturedAt:new Date().toISOString(),tasks:[{id:'a',title:'A',projectId:'g-p-123',projectTitle:'g-p-123'},{id:'b',title:'B',projectId:'p',projectTitle:'Accounting',pinned:true},{id:'c',title:'C',groupId:'work',groupTitle:'Work'}]},'chatgpt');const groups=M.groups(s.tasks);assert.equal(M.groupLabel(groups[0],'ja',0),'Accounting');assert(!M.groupLabel(groups[1],'ja',1).includes('g-p-'));assert.match(M.groupLabel({projectId:null},'ja'),/所属未確認/);assert.equal(M.groupLabel(groups[2]),'Work');
});
test('sidebar adapter obtains project labels independently of duplicate pinned/recent order and preserves pins',()=>{
 const projects=[{getAttribute:k=>({'data-app-action-sidebar-project-id':'g-p-123','data-app-action-sidebar-project-label':'Planning'}[k])}];
 const row=(pin)=>({innerText:'Thread',getClientRects:()=>[{}],getAttribute:k=>k==='href'?'/g/g-p-123/c/abc':null,closest:s=>s==='[data-pinned-content-tab-drop-key]'&&pin?{}:null});
 const area={getClientRects:()=>[{}],querySelectorAll:s=>s==='a[href]'?[row(false),row(true)]:s.includes('data-app-action-sidebar-project-label')?projects:[]};const result=T.collect({querySelectorAll:()=>[area]},'chatgpt');assert.equal(result.snapshot.tasks[0].projectTitle,'Planning');assert.equal(result.snapshot.tasks[0].pinned,true);assert.equal(result.snapshot.pins.length,1);assert.equal(result.snapshot.pinCoverage,'partial');
});
test('only fresh provider homes may expand sidebar groups; user conversations are never prepared',()=>{
 const fs=require('node:fs');assert(fs.readFileSync('extension/task-reader.js','utf8').includes('[T.HOMES[service]'));let clicks=0;const doc={querySelectorAll:()=>[{getClientRects:()=>[{}],querySelectorAll:()=>Array.from({length:80},()=>({getClientRects:()=>[{}],click:()=>clicks++}))}]};assert.equal(T.prepare(doc,'claude'),50);assert.equal(clicks,50);
});
