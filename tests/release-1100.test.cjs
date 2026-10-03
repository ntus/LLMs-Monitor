const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=path=>fs.readFileSync(path,'utf8');

test('v1.10.0 schedules intelligence independently every minute',()=>{
 const bg=read('extension/background.js');
 assert(bg.includes("chrome.alarms.create('llms-intelligence',{periodInMinutes:1})"));
 assert(bg.includes("if(alarm.name==='llms-intelligence')serialize(refreshIntelligence)"));
 assert(bg.includes('Promise.allSettled([refresh(),refreshProviderStatus(),refreshIntelligence()])'));
});

test('extension contains no X credential and obtains only a normalized relay feed',()=>{
 const files=['extension/background.js','extension/intelligence.js','extension/manifest.json'].map(read).join('\n');
 assert(!files.includes('X_BEARER_TOKEN'));assert(files.includes('/api/intelligence'));assert(!files.includes('api.x.com/2/'));
});

test('all display surfaces load and render the intelligence module',()=>{
 const manifest=JSON.parse(read('extension/manifest.json'));assert.match(manifest.version,/^1\.(?:1[0-9]|[2-9][0-9])\.0$/);assert(manifest.content_scripts[0].js.includes('intelligence.js'));
 for(const file of ['extension/index.html','extension/floating.html'])assert(read(file).includes('intelligence.js'));
 for(const file of ['extension/app.js','extension/content.js','extension/floating.js'])assert(read(file).includes('intelligenceFeed'));
});

test('release preserves existing usage, provider status, history, and sound paths',()=>{
 const bg=read('extension/background.js');for(const value of ['llms-refresh','llms-provider-status','recordHistory','playChangeSound','refreshProviderStatus'])assert(bg.includes(value));
 assert(read('extension/index.html').includes('id="status-log"'));
});
