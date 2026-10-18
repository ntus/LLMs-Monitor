const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const Q=require('../extension/grok-quota.js'),A=require('../extension/api-credits.js');
test('Grok observed dashboard separates weekly usage, plan and available credits without inventing a reset time',()=>{
 const q=Q.extract([{label:'Weekly included usage',text:'Current plan\nPlus\n11% used\nWeekly included usage · Resets Oct 25'}],'Plus');
 assert.equal(q.status,'ready');assert.equal(q.windows[0].remaining,89);assert.equal(q.windows[0].reset,'Resets Oct 25');assert.equal(q.windows[0].resetAt,null);assert.equal(q.plan,'Plus');
 assert.deepEqual(A.parse('Credits available\n$5.00','grok'),{status:'ready',amount:5,currency:'USD'});
 assert.deepEqual(A.parse('Credits available $5.00','grok'),{status:'ready',amount:5,currency:'USD'});
 for(const text of ['$0.00 of $20','Auto top-up\n$5 when below $2','0% of limit used\n$0.00','Credits available\nAuto top-up\n$5'])assert.equal(A.parse(text,'grok').status,'unavailable');
 assert.equal(A.provider('https://grok.com/dashboard/api-keys'),null);
});
test('Grok non-heading weekly label is collected from the smallest bounded card',()=>{
 const heading={textContent:'Plus'},body={};const card={innerText:'Current plan\nPlus\n11% used\nWeekly included usage · Resets Oct 25',parentElement:body,querySelector:()=>null,querySelectorAll:s=>s==='h2,h3'?[heading]:[]};
 const label={textContent:'Weekly included usage · Resets Oct 25',innerText:'Weekly included usage · Resets Oct 25',children:[],getClientRects:()=>[1],querySelector:()=>null,querySelectorAll:()=>[],parentElement:card};
 const plan={textContent:'Current plan',children:[],getClientRects:()=>[1],parentElement:card};
 const q=Q.collect({body,querySelectorAll:()=>[plan,label]});assert.equal(q.windows[0].remaining,89);assert.equal(q.plan,'Plus');
});
test('Gemini task acquisition never creates tabs and rejects ambiguous or non-home existing tabs',async()=>{
 for(const tabs of [[],[{id:1,url:'https://gemini.google.com/app/private'}],[{id:1,url:'https://gemini.google.com/app'},{id:2,url:'https://gemini.google.com/u/1/app'}],[{id:3,url:'https://gemini.google.com/app'}]]){
  let created=0,read=0;const chrome={tabs:{query:async()=>tabs,create:async()=>{created++;throw Error('forbidden')},sendMessage:async()=>{read++;return {status:'ready',snapshot:{service:'gemini',tasks:[]}}}}};const c=vm.createContext({chrome,LLMTaskList:{HOSTS:{gemini:'gemini.google.com'}},setTimeout,clearTimeout});vm.runInContext(fs.readFileSync('extension/task-background.js','utf8'),c);const r=await c.LLMTaskBackground.read('gemini');assert.equal(created,0);assert.equal(read,tabs.length===1&&tabs[0].id===3?1:0);assert.equal(r.status,read?'ready':'unavailable');
 }
});
test('Grok quota and API disconnect retain the other enabled reader permission; main fits cards before overflow',()=>{
 assert(fs.readFileSync('extension/api-setup.js','utf8').includes('additionalServices?.grok?.enabled'));
 assert(fs.readFileSync('extension/setup.js','utf8').includes('apiCredits?.grok?.enabled'));
 const css=fs.readFileSync('extension/style-v1530.css','utf8');assert(css.includes('max-width:none!important;width:100%'));assert(css.includes('min-width:340px'));assert(css.includes('justify-content:flex-start!important'));
 assert(fs.readFileSync('extension/monitor-design.js','utf8').includes('--fit-card-width'));
});
test('actual layout aligner fits four cards at 1700px and preserves overflow widths for ten',()=>{
 const source=fs.readFileSync('extension/monitor-design.js','utf8').split('/* Equalize corresponding sections')[1];
 for(const [width,count] of [[1700,4],[1280,3],[1280,4],[1700,10]]){
  const props={},children=Array.from({length:count},()=>({classList:{contains:()=>true},children:Array.from({length:8},()=>({getBoundingClientRect:()=>({height:10})}))}));
  const host={children,style:{setProperty:(k,v)=>props[k]=v,removeProperty:k=>delete props[k]},querySelectorAll:()=>children},scroller={clientWidth:width,addEventListener(){}};
  const c=vm.createContext({document:{querySelector:s=>s==='#cards'?host:scroller},getComputedStyle:()=>({marginTop:'0',marginBottom:'0'}),requestAnimationFrame:f=>f(),MutationObserver:class{observe(){}},ResizeObserver:class{observe(){}}});
  vm.runInContext(source.slice(source.indexOf('(()=>')),c);const w=parseFloat(props['--fit-card-width']);assert(w>=340);assert.equal(Math.round(w*count+16*(count-1)),Math.max(width,340*count+16*(count-1)));assert.equal(props['--aligned-card-rows'],'10px 10px 10px 10px 10px 10px 10px 10px');
 }
 const P=require('../extension/additional-services.js');assert.equal(P.route('https://grok.com/dashboard?expected_account_hash=458611de3ee2b5a5f2022b05'),'grok');assert.equal(P.route('https://grok.com/dashboard?other=secret'),null);
});
