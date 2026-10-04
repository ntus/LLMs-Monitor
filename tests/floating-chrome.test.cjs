const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const L=require('../extension/locale.js');
const F=require('../extension/floating-chrome.js');
function windowFixture(width=160){
 const node=tag=>({tag,children:[],style:{},dataset:{},textContent:'',attributes:{},clientWidth:width-55,get scrollWidth(){return this.textContent.length*parseFloat(this.style.fontSize||14)*.65},append(...args){this.children.push(...args)},prepend(...args){this.children.unshift(...args)},setAttribute(k,v){this.attributes[k]=v}});
 const doc={createElement:node,body:node('body')},listeners={},changes=[];
 return {document:doc,innerWidth:width,innerHeight:500,changes,listeners,resizeBy:(x,y)=>changes.push([x,y]),addEventListener:(k,v)=>listeners[k]=v,removeEventListener:()=>{}};
}
test('one common floating title follows language changes in popup and pinned windows',()=>{
 for(const pinned of [false,true]){
  const win=windowFixture();L.setLanguage('ja');const chrome=F.mount(win,pinned),title=chrome.header.children[0];
  assert.equal(win.document.title,'LLMs モニター');assert.equal(title.textContent,win.document.title);assert.equal(win.document.body.children.length,1);
  L.setLanguage('en');chrome.update();assert.equal(title.textContent,'LLMs Monitor');assert.equal(win.document.title,'LLMs Monitor');assert(title.scrollWidth<=title.clientWidth);assert.equal(title.dataset.pinned,String(pinned));
  assert.equal(win.changes.length,0,'renders must never reset user window size');
 }
});
test('resize actions independently change width and height only on user click',()=>{
 const win=windowFixture(),{header}=F.mount(win,true),controls=header.children[1].children[1],buttons=controls.children.slice(0,4);
 buttons[0].onclick();buttons[1].onclick();buttons[2].onclick();buttons[3].onclick();
 assert.deepEqual(win.changes,[[0,120],[0,-120],[60,0],[-60,0]]);
 win.innerHeight=1000;win.listeners.resize();assert.equal(controls.children[4].textContent,'160 × 1000');
 assert.equal(win.changes.length,4);
});
test('floating runtime uses common chrome, preserves history and removes only the duplicate title',()=>{
 const app=fs.readFileSync('extension/app.js','utf8'),popup=fs.readFileSync('extension/floating.js','utf8'),css=fs.readFileSync('extension/style-v1200.css','utf8');
 assert.match(app,/GlanceFloatingChrome\.mount\(pipWindow,true\)/);assert.match(app,/pipChrome\?\.update/);assert.match(popup,/GlanceFloatingChrome\.mount\(window\)/);
 assert(!app.includes("badge.className='pip-pin'"));assert.match(css,/\.floating-body \.widget>\.widget-title,\.pip-body \.widget>\.widget-title\{display:none\}/);
 for(const code of [app,popup])assert.match(code,/widget-history\[open\]/);
 assert.match(css,/max-height:none!important/);
 for(const name of ['index.html','floating.html'])assert(fs.readFileSync('extension/'+name,'utf8').includes('floating-chrome.js'));
});
