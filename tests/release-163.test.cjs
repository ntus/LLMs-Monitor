const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');

test('official provider status checks every minute',()=>{
 const background=read('extension/background.js'),status=read('extension/provider-status.js');
 assert(background.includes("chrome.alarms.create('llms-provider-status',{periodInMinutes:1})"));
 assert(!background.includes("'llms-provider-status',{periodInMinutes:10}"));
 assert(status.includes('Checks every minute'));
 assert(status.includes('1分ごとに確認します'));
});

test('weekly session guides render for every visible provider without learned history',()=>{
 const shared=read('extension/shared.js'),css=read('extension/style-v163.css');
 assert(shared.includes("track.classList.add('weekly-track')"));
 assert(shared.includes('estimate?.segmentPercent||observed'));
 assert(css.includes('var(--track-background)'));
 assert(css.includes(':root[data-theme="standard"] .track{--track-background:#e4e8ee}'));
});

test('LLM directory exposes ten products, official destinations, source, and bilingual copy',()=>{
 const html=read('extension/index.html'),locale=read('extension/locale.js');
 const section=html.match(/<section class="llm-directory"[\s\S]*?<\/section>/)?.[0]||'';
 assert.equal((section.match(/<article>/g)||[]).length,10);
 assert.equal((section.match(/<nav>/g)||[]).length,10);
 assert.equal((section.match(/target="_blank"/g)||[]).length,21);
 assert(section.includes('similarweb.com/corp/reports/2026-generative-ai-landscape'));
 for(const key of ['llmDirectory','llmChatgpt','llmGemini','llmClaude','llmLechat'])assert(locale.includes(`${key}:`));
});
