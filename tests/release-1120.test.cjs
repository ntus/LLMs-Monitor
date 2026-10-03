const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8');

test('ChatGPT DOM snapshot supplements extras without overwriting API windows',()=>{
 const background=read('extension/background.js');
 assert(background.includes("windows=id==='chatgpt'?[]:parsedWindows"));
 assert(background.includes("status:message.status==='login'?'login':parsedWindows.length||extras.length"));
});

test('v1.12.0 source-arbitration contract remains in later releases',()=>{
 const manifest=JSON.parse(read('extension/manifest.json'));
 const requirements=JSON.parse(read('spec/requirements.json'));
 const [,minor]=manifest.version.split('.').map(Number);
 assert(minor>=12);
 assert.equal(requirements.product.version,manifest.version);
 assert(requirements.requirements.some(item=>item.id==='CHATGPT-RESET-003'));
});
