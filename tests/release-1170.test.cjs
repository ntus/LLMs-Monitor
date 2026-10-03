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
test('AI tools reuse LLM cards and hide only in fullscreen',()=>{
 const html=read('extension/index.html'),css=read('extension/style-v1171.css');
 const before=html.slice(html.indexOf('class="llm-directory tool-directory"'),html.indexOf('aria-labelledby="llm-directory-title"'));
 assert(before.includes('>各種AIツール</h2>'));
 assert(before.includes('class="llm-directory-grid tool-directory-grid"'));
 assert.equal((before.match(/<article>/g)||[]).length,11);
 assert(before.includes('https://www.bridgebench.ai/nerf-bench'));
 assert.match(before,/<h3><a href="https:\/\/www\.bridgebench\.ai\/nerf-bench"/);
 assert.match(css,/html:fullscreen \.tool-directory\{display:none!important\}/);
 assert.match(css,/\.tool-directory-grid article\{min-height:0;padding:9px 11px 8px\}/);
 assert.match(css,/\.tool-directory-grid article p\{min-height:0;margin:0;font-size:10px;line-height:1\.25\}/);
});
test('ChatGPT official card wording remains parseable',()=>{
 const tab={id:'a',textContent:'利用可能 1'},panel={id:'p',innerText:'完全リセット（週間＋5 時間） 有効期限：10月30日',getAttribute:key=>key==='aria-labelledby'?'a':null,querySelectorAll:()=>[]};
 const page={querySelectorAll:s=>s==='[role="tab"]'?[tab]:s==='[role="tabpanel"]'?[panel]:[],body:{innerText:'利用上限のリセット 利用可能 1'}};
 assert.match(GlanceParser.chatGPTReset(page).officialText,/10月30日/);
});
