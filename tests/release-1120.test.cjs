const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8');

test('ChatGPT DOM snapshot supplements extras without overwriting API windows',()=>{
 const background=read('extension/background.js');
 assert(background.includes("windows=id==='chatgpt'?[]:parsedWindows"));
 assert(background.includes("status:message.status==='login'?'login':parsedWindows.length||extras.length"));
});

test('v1.12.0 release surfaces agree',()=>{
 const manifest=JSON.parse(read('extension/manifest.json'));
 const requirements=JSON.parse(read('spec/requirements.json'));
 assert.equal(manifest.version,'1.12.0');
 assert.equal(requirements.product.version,'1.12.0');
 assert(read('extension/shared.js').includes("const APP_VERSION='1.12.0'"));
});

test('ChatGPT reset entitlement stays compact and credits keep their original position',()=>{
 require('../extension/locale.js');
 require('../extension/preferences.js');
 require('../extension/provider-status.js');
 require('../extension/intelligence.js');
 require('../extension/changes.js');
 require('../extension/shared.js');
 const expiresAt=new Date(2026,9,30,2,15).getTime();
 const html=Glance.extras({chatgpt:{capturedAt:Date.now(),extras:[
  {label:'利用上限のリセット',value:'利用可能 1',detail:'完全リセット（週間＋5時間） · 有効期限 2026/10/30 02:15',expiresAt},
  {label:'クレジット',value:'残り 0',detail:'追加クレジットなし'}
 ]}},'chatgpt');
 assert(html.indexOf('クレジット')<html.indexOf('完全リセット'));
 assert(html.includes('完全リセット（週＋5h）'));
 assert(html.includes('期限 10/30 02:15'));
 assert.equal((html.match(/有効期限/g)||[]).length,0);
 assert(html.includes('entitlement-line'));
});
