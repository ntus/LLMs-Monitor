const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=path=>fs.readFileSync(path,'utf8');

test('v1.11.0 reset-expiry contract remains in later releases',()=>{
 const manifest=JSON.parse(read('extension/manifest.json'));
 const requirements=JSON.parse(read('spec/requirements.json'));
 assert(Number(manifest.version.split('.')[1])>=11);
 assert.equal(requirements.product.version,manifest.version);
 assert.equal(requirements.product.package_filename,`LLMs-Monitor-v${manifest.version}.zip`);
 assert(requirements.requirements.some(item=>item.id==='CHATGPT-RESET-002'));
});

test('store package builder excludes macOS metadata',()=>{
 assert(read('build.py').includes("path.name != '.DS_Store'"));
});

test('ChatGPT reset expiry supports visible text and API aliases',()=>{
 const parser=read('extension/parser.js'),fetchers=read('extension/fetchers.js');
 assert(parser.includes('visibleExpiry'));
 assert(parser.includes('scopeExpiry'));
 for(const alias of ['valid.?through','use.?by','redeem.?by','deadline'])assert(fetchers.includes(alias));
});
