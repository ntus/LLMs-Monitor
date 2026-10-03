const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=path=>fs.readFileSync(path,'utf8');
require('../extension/parser.js');
require('../extension/intelligence.js');
test('existing ChatGPT usage tabs are reloaded once after package update',()=>{
 const background=read('extension/background.js');
 assert.match(background,/details\.reason==='update'/);
 assert.match(background,/chrome\.tabs\.query\(\{url:'https:\/\/chatgpt\.com\/settings\/usage\*'\}\)/);
 assert.match(background,/chrome\.tabs\.reload\(tab\.id\)/);
});
test('floating primary changed digits inherit their full size in normal and pinned windows',()=>{
 const css=read('extension/style-v152.css');
 for(const mode of ['floating-body','pip-body'])assert(css.includes(`.${mode} .widget-primary b span.changed-number`));
 assert.match(css,/\.widget-primary b span\.changed-number\{font:inherit!important/);
});
test('utility directory has eleven one-line official links before the LLM directory',()=>{
 const html=read('extension/index.html');const before=html.slice(html.indexOf('class="tool-directory"'),html.indexOf('class="llm-directory"'));
 assert.equal((before.match(/<li>/g)||[]).length,11);
 assert(before.includes('https://www.bridgebench.ai/nerf-bench'));
 assert(before.includes('tool11Description'));
});
test('ChatGPT official card wording remains parseable',()=>{
 const tab={id:'a',textContent:'利用可能 1'},panel={id:'p',innerText:'完全リセット（週間＋5 時間） 有効期限：10月30日',getAttribute:key=>key==='aria-labelledby'?'a':null,querySelectorAll:()=>[]};
 const page={querySelectorAll:s=>s==='[role="tab"]'?[tab]:s==='[role="tabpanel"]'?[panel]:[],body:{innerText:'利用上限のリセット 利用可能 1'}};
 assert.match(GlanceParser.chatGPTReset(page).officialText,/10月30日/);
});
