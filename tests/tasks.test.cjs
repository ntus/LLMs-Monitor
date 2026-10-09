const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const M=require('../web/tasks-model.js');
const fixture=(service='chatgpt')=>({schemaVersion:1,service,capturedAt:'2026-10-09T14:00:00Z',source:'local-export',tasks:[
 {id:'parent',title:'Website',status:'idle',kind:'chat',projectId:'p',projectTitle:'Project',updatedAt:'2026-10-09T13:00:00Z'},
 {id:'child',parentId:'parent',title:'Accessibility checks',status:'running',kind:'chat',projectId:'p',projectTitle:'Project'},
 {id:'codex',title:'Work task',status:'unknown',kind:'codex',projectId:'p',projectTitle:'Project'}
]});

test('task snapshots keep ChatGPT chats and Codex separate and never infer completion from idle',()=>{
 const s=M.normalize(fixture(),'chatgpt');assert.equal(s.tasks[0].status,'idle');assert.equal(s.tasks[2].status,'unknown');assert.equal(M.groups(s.tasks).length,2);assert.equal(s.tasks[1].parentId,'parent');
 for(const service of ['claude','gemini']){const input=fixture(service);input.tasks=input.tasks.slice(0,2);assert.equal(M.normalize(input,service).service,service)}
});

test('task filtering includes a matched child’s verified ancestry',()=>{
 const s=M.normalize(fixture(),'chatgpt');assert.deepEqual(M.select(s,'accessibility').map(t=>t.id),['parent','child']);assert.deepEqual(M.select(s,'','running').map(t=>t.id),['parent','child']);assert.equal(M.select(s,'unmatched').length,0);assert.equal(M.select(s,'Project').length,3);
});

test('malformed, mismatched, oversized and cyclic task files are rejected',()=>{
 const run=input=>M.normalize(input,'chatgpt');
 assert.throws(()=>M.parse('{','chatgpt'));assert.throws(()=>run(fixture('claude')));
 for(const mutate of [s=>{s.schemaVersion=2},s=>{s.capturedAt='invalid'},s=>{s.tasks.push(s.tasks[0])},s=>{s.tasks[1].parentId='missing'},s=>{s.tasks[0].parentId='child'},s=>{s.tasks[1].projectId='other'},s=>{s.tasks[1].kind='codex'},s=>{s.tasks=Array(501).fill(s.tasks[0])}]){const s=fixture();mutate(s);assert.throws(()=>run(s))}
 const s=fixture();s.tasks=Array.from({length:13},(_,i)=>({id:String(i),title:'Deep task',parentId:i?String(i-1):null}));assert.throws(()=>run(s));
 assert.throws(()=>M.parse(' '.repeat(M.MAX_BYTES+1),'chatgpt'));assert.throws(()=>M.parse('界'.repeat(M.MAX_BYTES/2),'chatgpt'));
 for(const field of ['parentId','projectId'])for(const value of [123,' parent','x'.repeat(121),'bad\nreference']){const input=fixture();input.tasks[1][field]=value;assert.throws(()=>run(input))}
});

test('task normalization discards credentials and hostile links, bounds text and leaves the input unchanged',()=>{
 const input=fixture();input.token='secret';input.tasks[0].password='secret';input.tasks[0].title='<script>alert(1)</script>';input.tasks[0].summary='A'.repeat(900);input.tasks[0].url='javascript:alert(1)';input.tasks[0].status='invented';
 const before=structuredClone(input),s=M.normalize(input,'chatgpt');assert.equal(s.token,undefined);assert.equal(s.tasks[0].password,undefined);assert.equal(s.tasks[0].url,'');assert.equal(s.tasks[0].status,'unknown');assert.equal(s.tasks[0].summary.length,500);assert.deepEqual(input,before);
 for(const url of ['https://chatgpt.com.evil.test/c/1','http://chatgpt.com/c/1','https://chatgpt.com:8443/c/1','https://u:p@chatgpt.com/c/1','https://chatgpt.com/c/1?token=secret','https://chatgpt.com/c/1#secret','https://claude.ai/chat/1'])assert.equal(M.safeURL(url,'chatgpt'),'');
 assert.equal(M.safeURL('https://chatgpt.com/c/abc-123','chatgpt'),'https://chatgpt.com/c/abc-123');assert.equal(M.safeURL('https://claude.ai/chat/123','claude'),'https://claude.ai/chat/123');assert.equal(M.safeURL('https://gemini.google.com/app/123','gemini'),'https://gemini.google.com/app/123');
});

test('each task demo is explicitly synthetic, with no real account data',()=>{
 for(const service of M.SERVICES){const s=M.demo(service,1791554400000);assert.equal(s.source,'demo');assert.equal(s.service,service);assert.equal(s.tasks.length,3);assert.equal(s.tasks[1].parentId,s.tasks[0].id);assert(s.tasks.every(t=>t.title.startsWith('Example:')))}
});

// Execute the actual launcher against a minimal DOM, including card rerenders.
function launcher(lang='ja',theme='dark'){
 class Element{
  constructor(tag){this.tagName=tag;this.children=[];this.dataset={};this.attrs={};this.parent=null;this.className=''}
  append(...nodes){for(const n of nodes){if(n.parent)n.parent.children=n.parent.children.filter(x=>x!==n);n.parent=this;this.children.push(n)}}
  before(n){const a=this.parent.children,i=a.indexOf(this);n.parent=this.parent;a.splice(i,0,n)}
  setAttribute(k,v){this.attrs[k]=v}
  querySelector(selector){return this.querySelectorAll(selector)[0]||null}
  querySelectorAll(selector){const descendants=this.children.flatMap(n=>[n,...n.querySelectorAll('*')]);return descendants.filter(n=>selector==='*'||selector==='.card'&&n.className==='card'||selector==='.task-details-link'&&n.className==='task-details-link'||selector==='.card-bottom button[data-service]'&&n.tagName==='button'&&n.dataset.service)}
 }
 const root=new Element('html');root.lang=lang;root.dataset.theme=theme;const cards=new Element('section');root.append(cards);
 function makeCard(service){const card=new Element('article');card.className='card';const bottom=new Element('div');bottom.className='card-bottom';const usage=new Element('button');usage.dataset.service=service;usage.textContent='Official usage';bottom.append(usage);card.append(bottom);return {card,usage}}
 for(const service of M.SERVICES)cards.append(makeCard(service).card);
 const events={},observers=[],opened=[];const document={documentElement:root,readyState:'complete',getElementById:id=>id==='cards'?cards:null,createElement:t=>new Element(t),addEventListener:(k,f)=>events[k]=f};
 const context=vm.createContext({document,location:{href:'https://llmsmonitor.ntus.info/'},URL,MutationObserver:class{constructor(fn){this.fn=fn;observers.push(this)}observe(){}},window:{open:(...args)=>{const child={opener:'main'};opened.push({args,child});return child}}});
 vm.runInContext(fs.readFileSync('web/task-launcher.js','utf8'),context);return {root,cards,events,observers,opened,makeCard,context};
}

test('real launcher mounts one provider-specific button per card without replacing the existing usage action',()=>{
 const h=launcher();const links=h.cards.querySelectorAll('.task-details-link');assert.equal(links.length,3);
 for(let i=0;i<3;i++){assert.equal(new URL(links[i].href).searchParams.get('service'),M.SERVICES[i]);assert.equal(links[i].dataset.service,undefined);assert.equal(links[i].target,'_blank');assert.equal(links[i].rel,'noopener noreferrer');assert.equal(links[i].textContent,'タスク詳細')}
 assert.equal(h.cards.querySelectorAll('.card-bottom button[data-service]').length,3);
 h.observers.forEach(o=>o.fn());assert.equal(h.cards.querySelectorAll('.task-details-link').length,3);
 const fresh=h.makeCard('claude');h.cards.children=[];h.cards.append(fresh.card);h.observers[0].fn();assert.equal(h.cards.querySelectorAll('.task-details-link').length,1);assert.equal(fresh.usage.textContent,'Official usage');
});

test('task launcher inherits language/theme, opens a tall independent window and preserves tab fallback',()=>{
 const h=launcher('en','standard'),link=h.cards.querySelector('.task-details-link');assert.equal(link.textContent,'Task details');let prevented=false;
 const event={target:{closest:()=>link},button:0,preventDefault:()=>{prevented=true}};h.events.click(event);
 assert(prevented);assert.equal(h.opened.length,1);assert.equal(h.opened[0].child.opener,null);assert.match(h.opened[0].args[2],/width=420,height=780/);assert.match(h.opened[0].args[2],/resizable=yes/);assert.equal(new URL(h.opened[0].args[0]).searchParams.get('theme'),'standard');
 h.context.window.open=()=>null;prevented=false;h.events.click(event);assert.equal(prevented,false);
 h.events.click({...event,ctrlKey:true});assert.equal(h.opened.length,1);
 h.root.lang='ja';h.root.dataset.theme='dark';h.observers.forEach(o=>o.fn());assert.equal(link.textContent,'タスク詳細');assert.equal(new URL(link.href).searchParams.get('theme'),'dark');
});

test('task route has a network-denying CSP and no dependency on usage, storage, audio or extension RPC',()=>{
 const html=fs.readFileSync('web/tasks.html','utf8'),js=fs.readFileSync('web/tasks-page.js','utf8');
 assert(html.includes("connect-src 'none'"));assert(!html.includes('app.js')&&!html.includes('shared.js')&&!html.includes('floating.js'));
 for(const code of [js,fs.readFileSync('web/tasks-model.js','utf8'),fs.readFileSync('web/task-launcher.js','utf8')])assert(!/fetch\(|XMLHttpRequest|sendMessage|localStorage|indexedDB|AudioContext|innerHTML/.test(code));
 assert(js.includes('textContent'));assert(js.includes("catch{noticeKey='badFile'}"));assert(js.includes('MAX_BYTES'));assert(js.includes("tasks.html")===false);
});
