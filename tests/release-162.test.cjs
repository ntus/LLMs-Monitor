const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');

test('bottom status is consolidated in a fixed dock with bounded independent incident disclosure',()=>{
 const html=read('extension/index.html'),css=read('extension/style-v1500.css');
 assert(html.indexOf('id="monitor-dock"')<html.indexOf('id="provider-status-main"'));
 assert(html.indexOf('id="monitor-dock"')<html.indexOf('id="status-log"'));
 assert(css.includes('#monitor-dock{position:fixed'));
 assert(css.includes('.provider-status-popover{max-height:30dvh;overflow:auto}'));
 assert(css.includes('#monitor-dock .provider-status-host'));
});
test('product footer links to GitHub and the historical range uses local seconds',()=>{
 const html=read('extension/index.html'),app=read('extension/app.js');
 assert.match(html,/href="https:\/\/github\.com\/ntus\/LLMs-Monitor"[^>]*class="product-link"/);
 assert(app.includes('dateTime(historyMeta.firstAt)'));
 assert(app.includes('dateTime(historyMeta.lastAt)'));
 assert(app.includes('${p(d.getSeconds())}'));
});
test('deadline palette preserves a calm near state and critical animation',()=>{
 const css=read('extension/style-v162.css'),old=read('extension/style-v160.css');
 assert(css.includes('rgba(150,57,69,.13)'));
 assert(css.includes('rgba(171,47,65,.19)'));
 assert(old.includes('@keyframes deadline-breathe'));
});
