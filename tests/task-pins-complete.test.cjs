const {test}=require('node:test'),assert=require('node:assert/strict'),T=require('../extension/task-list.js'),M=require('../web/tasks-model.js');
function doc(rows){const area={getClientRects:()=>[{}],querySelector:()=>({}),querySelectorAll:s=>s==='a[href]'?rows:[]};return {querySelectorAll:()=>[area]};}
function row(href,title,pinned=true){return {innerText:title,getClientRects:()=>[{}],getAttribute:k=>k==='href'?href:null,closest:s=>s==='[data-pinned-list]'&&pinned?{}:null};}
test('Claude complete visible pinned list includes artifact task boards with only verified org routing and reports rejected rows',()=>{
 const artifact='/artifact/demo?org=12345678-1234-1234-1234-123456789abc',rows=Array.from({length:14},(_,i)=>row('/code/project/chan_'+i,'Project '+i));rows.push(row(artifact,'Task board'));let s=T.collect(doc(rows),'claude').snapshot;assert.equal(s.pins.length,15);assert.equal(s.pinAudit.observed,15);assert.equal(s.pinAudit.rejected,0);assert.equal(M.normalize(s,'claude').pins.length,15);
 rows.push(row('/artifact/bad?token=private','Unsupported'));s=T.collect(doc(rows),'claude').snapshot;assert.equal(s.pinAudit.observed,16);assert.equal(s.pinAudit.rejected,1);assert.equal(s.pins.length,15);assert.equal(M.pinURL('https://claude.ai/artifact/bad?token=private','claude'),'');
});
test('500 task ceiling must never stop later pinned metadata; capped pins are explicitly incomplete',()=>{
 const rows=Array.from({length:501},(_,i)=>row('/chat/thread_'+i,'Thread '+i,false));rows.push(row('/code/project/chan_end','Pinned at end'));const s=T.collect(doc(rows),'claude').snapshot;assert.equal(s.tasks.length,500);assert.equal(s.pins.length,1);assert.equal(s.pins[0].title,'Pinned at end');
 const p=T.collect(doc(Array.from({length:501},(_,i)=>row('/code/project/chan_'+i,'Pin '+i))),'claude').snapshot;assert.equal(p.pins.length,500);assert.equal(p.pinAudit.limited,true);assert.equal(p.pinAudit.observed,501);
});
test('Gemini unavailable pin evidence never reports complete or zero account pins',()=>{
 const a={innerText:'Chat',getClientRects:()=>[{}],getAttribute:k=>k==='href'?'/app/demo':null,closest:()=>null},s=T.collect(doc([a]),'gemini').snapshot;assert.equal(s.pinAudit.sectionSeen,false);assert.equal(s.pinCoverage,'partial');assert.equal(M.normalize(s,'gemini').pinAudit.sectionSeen,false);
});

test('every task state has an explicit leading mark, unknown never appears running; pins retain their independent icon',()=>{
 for(const [status,icon] of Object.entries({running:'🟢',waiting:'🟠',idle:'🔵',completed:'✅',failed:'🔴',unknown:'⚪'}))assert.equal(M.stateIcon({status}),icon);assert.equal(M.stateIcon(null),'⚪');assert.equal(M.stateIcon({status:'invented'}),'⚪');
 const code=require('node:fs').readFileSync('web/tasks-page.js','utf8');assert.match(code,/M.stateIcon\(task\)\+' '\+\(task.pinned/);
});
