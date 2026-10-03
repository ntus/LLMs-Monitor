const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const read=p=>fs.readFileSync(p,'utf8');
require('../extension/locale.js');require('../extension/preferences.js');require('../extension/provider-status.js');require('../extension/intelligence.js');require('../extension/changes.js');require('../extension/shared.js');

test('v1.13.0 linked-details contract remains in later releases',()=>{const manifest=JSON.parse(read('extension/manifest.json')),requirements=JSON.parse(read('spec/requirements.json')),[,minor]=manifest.version.split('.').map(Number);assert(minor>=13);assert.equal(requirements.product.version,manifest.version);assert(requirements.requirements.some(item=>item.id==='CHATGPT-RESET-004'));});

test('ChatGPT credits and an available reset use official setting links without capture timestamp',()=>{
 const expiresAt=new Date(2026,9,30,2,15).getTime(),html=Glance.extras({chatgpt:{status:'ready',capturedAt:Date.now(),extras:[{label:'利用上限のリセット',value:'利用可能 1',detail:'完全リセット（週間＋5時間） · 有効期限 2026/10/30 02:15',expiresAt},{label:'クレジット',value:'残り 0',detail:'追加クレジットなし'}]}},'chatgpt');
 assert(html.indexOf('クレジット')<html.indexOf('リセット権'));assert(html.includes('期限 10/30 02:15'));assert.equal((html.match(/https:\/\/chatgpt\.com\/settings\/usage\?tab=overview/g)||[]).length,4);assert(!html.includes('取得日時'));
});

test('ChatGPT with no entitlement shows a linked explicit none state',()=>{const html=Glance.extras({chatgpt:{status:'ready',capturedAt:Date.now(),extras:[{label:'クレジット',value:'残り 0'}]}},'chatgpt');assert(html.includes('利用上限のリセットなし'));assert.match(html,/<a[^>]+chatgpt\.com\/settings\/usage\?tab=overview[^>]*>利用上限のリセットなし<\/a>/);});
