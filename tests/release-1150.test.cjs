const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=path=>fs.readFileSync(path,'utf8');
require('../extension/locale.js');
require('../extension/preferences.js');
require('../extension/provider-status.js');
require('../extension/intelligence.js');
require('../extension/changes.js');
require('../extension/shared.js');

test('release sources and shared surfaces stay in sync',()=>{
 const manifest=JSON.parse(read('extension/manifest.json')),requirements=JSON.parse(read('spec/requirements.json'));
 assert.match(manifest.version,/^\d+\.\d+\.\d+$/);assert.equal(requirements.product.version,manifest.version);assert.equal(requirements.product.package_filename,`LLMs-Monitor-v${manifest.version}.zip`);assert.equal(Glance.APP_VERSION,manifest.version);
 for(const file of ['extension/index.html','extension/floating.html','extension/app.js'])assert(read(file).includes('style-v1150.css'));
});

test('reset urgency is attached only to the countdown, never a duplicate parent frame',()=>{
 const css=read('extension/style-v1150.css'),shared=read('extension/shared.js'),app=read('extension/app.js');
 assert(css.includes('.reset .time-urgent.deadline-near'));assert(css.includes('.reset.deadline-near,.reset.deadline-critical'));
 assert.match(shared,/function resetSuffix\(w\).*time-urgent/);assert(!shared.includes("reset.classList.add(level)"));assert(!app.includes("class=\"reset${G.resetUrgent"));
});

test('gauge reset copy has a bounded, compact layout at desktop and mobile widths',()=>{
 const css=read('extension/style.css')+read('extension/style-v1150.css');
 assert(css.includes('.gauge-reset{left:19%;right:19%;bottom:19%;max-width:62%;min-width:0;overflow-wrap:anywhere}'));
 assert(css.includes('@media(max-width:700px){.gauge-reset{left:14%;right:14%;bottom:18%'));assert(css.includes('html:fullscreen .gauge-reset{left:12%;right:12%;bottom:15%'));assert(css.includes('html:fullscreen .gauge-reset{left:5%;right:5%;bottom:9%'));
});

test('single countdown warning remains visible in the provider-page widget',()=>{
 const html=Glance.widget({gemini:{status:'ready',capturedAt:Date.now(),windows:[{label:'現在のセッション',remaining:99,reset:'22:25にリセット',resetAt:Date.now()+59*60000},{label:'週間',remaining:99,reset:'10月8日にリセット',resetAt:Date.now()+23*3600000}] }},{hiddenServices:['chatgpt','claude']});
 assert.equal((html.match(/class="time-urgent deadline-(?:near|critical)"/g)||[]).length,2);
 assert(!html.includes('widget-reset time-urgent'));
});
