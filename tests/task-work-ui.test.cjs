const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const M=require('../web/tasks-model.js');global.LLMTaskModel=M;const N=require('../web/tasks-notes.js');
test('saved-note titles open original links, Edit opens the same note, counts follow saves/deletes/provider/workspace/language',()=>{
 class Element{
  constructor(tag){this.tag=tag;this.children=[];this._text='';this.className=''}
  set textContent(v){this._text=v;this.children=[]}get textContent(){return this._text+this.children.map(x=>x.textContent).join(' ')}
  append(...nodes){for(const n of nodes){n.parent=this;this.children.push(n)}}replaceChildren(...nodes){this._text='';this.children=[];this.append(...nodes)}
  querySelectorAll(s){const all=this.children.flatMap(n=>[n,...n.querySelectorAll('*')]);return s==='*'?all:all.filter(n=>s.startsWith('.')?n.className.split(' ').includes(s.slice(1)):n.tag===s)}
  querySelector(s){return this.querySelectorAll(s)[0]}setAttribute(k,v){this[k]=v}addEventListener(){}showModal(){this.open=true}close(){this.open=false;this.remove()}remove(){if(this.parent)this.parent.children=this.parent.children.filter(n=>n!==this)}
 }
 const body=new Element('body'),heading=new Element('summary'),box=new Element('section');heading.id='notes-heading';box.id='work-tools';body.append(heading,box);
 const document={body,createElement:tag=>new Element(tag),getElementById:id=>[body,...body.querySelectorAll('*')].find(n=>n.id===id)};
 const mem=new Map(),storage={getItem:k=>mem.get(k),setItem:(k,v)=>mem.set(k,v)},c=vm.createContext({document,localStorage:storage,LLMTaskNotes:N,LLMTaskModel:M,confirm:()=>true,navigator:{},setTimeout});
 vm.runInContext(fs.readFileSync('web/tasks-work.js','utf8'),c);const api=c.LLMTaskWork,store=N.create(storage),url='https://chatgpt.com/c/synthetic';
 api.mount('chatgpt','ja');assert.match(heading.textContent,/0件/);assert(!body.textContent.includes('クラウド同期'));
 api.button({title:'Synthetic <title>',url}).onclick();let d=body.querySelector('dialog');assert(!d.textContent.includes('クラウド同期'));d.querySelectorAll('textarea')[1].value='Keep the existing notes';d.querySelectorAll('button')[0].onclick();
 assert.equal(store.all()[0].url,url);assert.equal(store.all()[0].current,'Keep the existing notes');assert.match(heading.textContent,/1件/);assert.match(document.getElementById('saved-heading').textContent,/1件/);
 d.close();let row=body.querySelector('.saved-work-row'),a=row.querySelector('a'),edit=row.querySelector('button');assert.equal(a.textContent,'Synthetic <title>');assert.equal(a.href,url);assert.equal(a.target,'_blank');assert.equal(a.rel,'noopener noreferrer');assert.equal(edit.textContent,'編集');edit.onclick();d=body.querySelector('dialog');assert.equal(d.querySelectorAll('textarea')[1].value,'Keep the existing notes');d.close();
 const native='codex://threads/00000000-0000-0000-0000-000000000001';api.editor({title:'Synthetic Codex',url:native});d=body.querySelector('dialog');d.querySelectorAll('button')[0].onclick();d.close();assert.equal(body.querySelectorAll('a')[1].href,native);assert.match(heading.textContent,/2件/);
 api.mount('chatgpt','en');assert.match(heading.textContent,/2 notes/);assert.equal(body.querySelector('.saved-work-edit').textContent,'Edit');assert(!body.textContent.includes('Saved only in this browser'));
 let input=box.querySelector('input');input.value='other';input.onchange();assert.match(heading.textContent,/0 notes/);assert.equal(body.querySelectorAll('.saved-work-row').length,0);input.value='default';input.onchange();assert.match(heading.textContent,/2 notes/);
 api.mount('claude','ja');assert.match(heading.textContent,/0件/);api.mount('chatgpt','ja');body.querySelector('.saved-work-edit').onclick();d=body.querySelector('dialog');d.querySelectorAll('button')[3].onclick();assert.match(heading.textContent,/1件/);assert.equal(store.all().length,1);assert.deepEqual([...mem.keys()],[N.KEY]);
});
