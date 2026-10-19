const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const A=require('../extension/api-credits.js');

test('API balance readers distinguish official balance, zero, missing, postpaid and ambiguous accounts',()=>{
 assert.deepEqual(A.parse('Pay as you go\nAPI credit balance\n$8.80\nAuto-reload is OFF','chatgpt'),{status:'ready',amount:8.8,currency:'USD'});
 assert.deepEqual(A.parse('Credit balance\n$0.00','claude'),{status:'ready',amount:0,currency:'USD'});
 assert.deepEqual(A.parse('Available credits\nUSD -0.24','gemini'),{status:'ready',amount:-.24,currency:'USD'});
 assert.deepEqual(A.parse('前払いクレジット残高\nJPY 1,200.25','gemini'),{status:'ready',amount:1200.25,currency:'JPY'});
 assert.equal(A.parse('Monthly budget\n$100\nSpent\n$8','chatgpt').status,'unavailable');
 assert.equal(A.parse('Available credits\nAuto-reload threshold\n$10','gemini').status,'unavailable');
 assert.equal(A.parse('Postpay\nAmount due\n$42','gemini').status,'postpaid');
 assert.equal(A.parse('Available credits\n$10\nAvailable credits\n$20','gemini').status,'unavailable');
 assert.equal(A.parse('API credit balance\n','chatgpt').status,'unavailable');
 assert.equal(A.parse('Credit balance\n$4','__proto__').status,'unavailable');
});

test('API failures keep previous timestamp only within the same identified billing scope',()=>{
 const old={enabled:true,status:'ready',amount:8.8,currency:'USD',scope:'a1b2c3d4',capturedAt:100};
 const failed=A.accept(old,{status:'unavailable',scope:'a1b2c3d4'},200);
 assert.equal(failed.amount,null);assert.equal(failed.previous.amount,8.8);assert.equal(failed.previous.capturedAt,100);
 assert.equal(A.accept(old,{status:'unavailable',scope:'bbbbbbbb'},200).previous,undefined);
 assert.equal(A.accept(old,{status:'login',scope:'a1b2c3d4'},200).previous,undefined);
 assert.equal(A.accept(old,{status:'unavailable'},200).previous,undefined);
 assert.equal(A.accept(old,{status:'ready',amount:'0',currency:'USD'},200).status,'unavailable');
 assert.equal(A.accept(old,{status:'ready',amount:0,currency:'USD'},200).amount,0);
});

test('billing source requires exact HTTPS origin and billing route',()=>{
 assert.equal(A.provider(A.PROVIDERS.chatgpt.url),'chatgpt');
 assert.equal(A.provider('https://aistudio.google.com/u/1/billing'),'gemini');
 assert.equal(A.provider('https://platform.openai.com/settings/organization/api-keys'),null);
 assert.equal(A.provider('https://platform.openai.com.evil.test/settings/organization/billing'),null);
 assert.equal(A.provider('http://platform.openai.com/settings/organization/billing'),null);
 assert.equal(A.provider('https://claude.ai/settings/usage'),null);
});

test('optional API acquisition rejects untrusted frames and leaves existing usage/history untouched',async()=>{
 const sentinel={data:{claude:{windows:[{remaining:98}]}},history:{claude:[1,2]},apiCredits:{chatgpt:{enabled:true,status:'unavailable'}}},stored=structuredClone(sentinel);
 const context={GlanceApiCredits:A,chrome:{permissions:{contains:async()=>true},storage:{local:{get:async key=>({[key]:stored[key]}),set:async values=>Object.assign(stored,values)}}}};
 vm.runInNewContext(fs.readFileSync('extension/api-credit-background.js','utf8'),context);const B=context.GlanceApiCreditBackground;
 const msg={service:'chatgpt',status:'ready',amount:8.8,currency:'USD',scope:'a1b2c3d4'},sender={url:A.PROVIDERS.chatgpt.url,frameId:0,tab:{id:7}};
 assert.equal((await B.receive(msg,{...sender,url:'https://evil.test/billing'})).ok,false);
 assert.equal((await B.receive(msg,{...sender,frameId:1})).ok,false);
 assert.equal((await B.receive(msg,{...sender,url:'https://platform.openai.com/settings/organization/api-keys'})).ok,false);
 assert.equal((await B.receive(msg,sender)).ok,true);
 assert.equal(stored.apiCredits.chatgpt.amount,8.8);
 assert.deepEqual(stored.data,sentinel.data);assert.deepEqual(stored.history,sentinel.history);
 assert.equal((await B.receive({...msg,service:'claude'},{...sender,url:A.PROVIDERS.claude.url})).ok,false);
});

test('API credit display uses separate currency balance and official links in both languages',()=>{
 const L=require('../extension/locale.js');
 A.set({chatgpt:{enabled:true,status:'ready',amount:8.8,currency:'USD',capturedAt:Date.now()}});
 L.setLanguage('en');assert.match(A.view('chatgpt'),/API credit balance/);assert.match(A.view('chatgpt'),/\$8\.80/);assert.match(A.view('chatgpt'),/platform\.openai\.com/);
 L.setLanguage('ja');assert.match(A.view('chatgpt'),/APIクレジット残高/);
 A.set({chatgpt:{enabled:true,status:'unavailable',capturedAt:Date.now()}});assert(!A.view('chatgpt').includes('$0.00'));
 const manifest=JSON.parse(fs.readFileSync('extension/manifest.json'));
 assert.deepEqual(manifest.permissions,['storage','alarms','offscreen','notifications']);
 assert.deepEqual(manifest.optional_permissions,['scripting','nativeMessaging']);
 assert.deepEqual([...manifest.optional_host_permissions].sort(),['https://platform.openai.com/*','https://platform.claude.com/*','https://aistudio.google.com/*','https://x.com/*','https://grok.com/*','https://platform.deepseek.com/*','https://www.perplexity.ai/*','https://www.genspark.ai/*'].sort());assert(!manifest.host_permissions.includes('https://x.com/*'));
 const setup=fs.readFileSync('extension/api-setup.js','utf8');assert.match(setup,/chrome\.permissions\.request/);
});

test('Claude promotional credits are separate from paid balance and never inferred from grant totals',()=>{
 const text='クレジット残高\n$0.00\nプロモーションクレジット $200.00 をご利用いただけます\nプロモーションクレジット\n$200.00 / $200.00\n2026/11/6';
 assert.deepEqual(A.parse(text,'claude'),{status:'ready',amount:0,currency:'USD'});
 assert.deepEqual(A.promotional(text),{status:'ready',amount:200,currency:'USD'});
 assert.deepEqual(A.promotional('$200.00 in promotional credits available'),{status:'ready',amount:200,currency:'USD'});
 assert.equal(A.promotional('Promotional credits\n$200.00 / $200.00\n2026/11/6').status,'unavailable');
 assert.equal(A.promotional('Promotional credits available: $10\nPromotional credits available: $20').status,'unavailable');
 const row=A.accept({enabled:true},{service:'claude',...A.parse(text,'claude'),promotional:A.promotional(text)},Date.now());
 assert.equal(row.amount,0);assert.equal(row.promotional.amount,200);
 assert.equal(A.sanitize({service:'claude',promotional:{status:'ready',amount:'200',currency:'USD'}}).promotional.status,'unavailable');
 assert.equal(A.sanitize({service:'chatgpt',promotional:A.promotional(text)}).promotional,undefined);
 A.set({claude:row});require('../extension/locale.js').setLanguage('ja');assert.match(A.view('claude'),/プロモーションクレジット/);assert.match(A.view('claude'),/200\.00/);
 const missing=A.accept(row,{service:'claude',status:'unavailable'},Date.now());assert.equal(missing.promotional.amount,null);
 A.set({claude:missing});assert(!A.view('claude').includes('200.00'));
});

test('slow acquisition metadata never refreshes a stale billing value and explains retry in the existing note',()=>{const old=Date.now()-180000;A.set({claude:{enabled:true,status:'ready',amount:0,currency:'USD',capturedAt:old,promotional:{status:'ready',amount:12,currency:'USD',capturedAt:old},acquisition:{status:'waiting',stage:'browser-busy',at:Date.now(),durationMs:90000}}});const html=A.view('claude');assert.match(html,/同じ取得ページで自動再試行/);assert.match(html,/api-credit-stale/);assert.match(html,/公式側の反映/);});
