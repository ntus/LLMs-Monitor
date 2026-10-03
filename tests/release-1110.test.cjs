const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=path=>fs.readFileSync(path,'utf8');

test('v1.11.0 release surfaces and package contract agree',()=>{
 const manifest=JSON.parse(read('extension/manifest.json'));
 const requirements=JSON.parse(read('spec/requirements.json'));
 assert.equal(manifest.version,'1.11.0');
 assert.equal(requirements.product.version,'1.11.0');
 assert.equal(requirements.product.package_filename,'LLMs-Monitor-v1.11.0.zip');
 assert(read('extension/shared.js').includes("const APP_VERSION='1.11.0'"));
 assert(read('extension/index.html').includes('LLMs-Monitor-v1.11.0.zip'));
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
