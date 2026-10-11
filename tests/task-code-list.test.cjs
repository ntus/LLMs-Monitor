const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const T=require('../extension/task-list.js'),M=require('../web/tasks-model.js');
function collect(labels,kind='code'){
 const a={getClientRects:()=>[{}],getAttribute:k=>k==='href'?`/${kind}/${kind==='code'?'session_':''}test`:null,innerText:'Idle is a task title, not status',querySelectorAll:()=>labels.map(label=>({getAttribute:()=>label}))};
 return T.collect({querySelectorAll:()=>[{getClientRects:()=>[{}],querySelectorAll:()=>[a]}]},'claude');
}
test('only exact Claude Code icon labels qualify; title, merged PR and conflicting icons never infer state',()=>{
 for(const [label,status] of [['入力待ち','waiting'],['Awaiting input','waiting'],['アイドル','idle'],['Idle','idle'],['未読の返答','unknown'],['Unread response','unknown']])assert.equal(collect([label]).snapshot.tasks[0].listedState.status,status);
 for(const labels of [[],['#3 · マージ済み'],['入力待ち','アイドル'],['完了'],['Running']])assert.equal(collect(labels).snapshot.tasks[0].listedState,null);
 assert.equal(collect(['アイドル'],'chat').snapshot.tasks[0].listedState,null);
});
test('closed Code session keeps independent list observation for 90 seconds, then becomes unknown',()=>{
 const now=Date.now(),snapshot=M.normalize(collect(['入力待ち']).snapshot,'claude');
 const result={status:'ready',service:'claude',checkedAt:now,observations:[]};
 const state=M.states(snapshot,result,now);assert.equal(state.tasks[0].status,'waiting');assert.equal(state.tasks[0].stateEvidence,'official-code-list');
 assert.equal(M.expireStates(state,now+16000).tasks[0].status,'waiting');
 assert.equal(M.expireStates(state,now+91000).tasks[0].status,'unknown');
 assert.equal(M.states(state,{status:'unavailable'},now+91000).tasks[0].status,'unknown');
});
test('unread is separate metadata, never completed; list evidence does not apply to normal chat or wrong labels',()=>{
 const snapshot=M.normalize(collect(['未読の返答']).snapshot,'claude');assert.equal(snapshot.tasks[0].status,'unknown');assert.equal(snapshot.tasks[0].listedLabel,'未読の返答');
 const raw=collect(['アイドル']).snapshot;raw.tasks[0].kind='chat';assert.equal(M.normalize(raw,'claude').tasks[0].listedState,undefined);
 raw.tasks[0].kind='code';raw.tasks[0].listedState.status='completed';assert.equal(M.normalize(raw,'claude').tasks[0].listedState,undefined);
 raw.source='local-export';assert.equal(M.normalize(raw,'claude').tasks[0].listedState,undefined);
});
test('explicit open-tab stop conflicting with list idle remains unknown',()=>{
 const now=Date.now(),snapshot=M.normalize(collect(['アイドル']).snapshot,'claude'),task=snapshot.tasks[0];
 const r=M.states(snapshot,{status:'ready',service:'claude',checkedAt:now,observations:[{...task,status:'running',evidence:'stop-control',observedAt:now}]},now);
 assert.equal(r.tasks[0].status,'unknown');assert.equal(r.tasks[0].stateReason,'conflict');
});
test('Claude dual home acquisition merges lists and closes both temporary tabs without navigation',async()=>{
 let id=0;const created=[],removed=[];const chrome={tabs:{create:async x=>{created.push(x);return {id:++id}},sendMessage:async n=>({status:'ready',snapshot:{service:'claude',tasks:n===1?[{id:'chat:x',kind:'chat'}]:[{id:'code:session_y',kind:'code',listedState:{label:'アイドル'}}]}}),remove:async n=>removed.push(n)}};
 const context=vm.createContext({chrome,LLMTaskList:T,setTimeout,clearTimeout});vm.runInContext(fs.readFileSync('extension/task-background.js','utf8'),context);
 const r=await context.LLMTaskBackground.read('claude');assert.equal(r.snapshot.tasks.length,2);assert.equal(created.length,2);assert(created.every(x=>x.active===false));assert(created.some(x=>x.url==='https://claude.ai/code'));assert.deepEqual(removed.sort(),[1,2]);
 assert.equal((await context.LLMTaskBackground.read('claude')).status,'cooldown');
});
