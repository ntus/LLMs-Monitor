const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm'),fs=require('node:fs');
const F=require('../extension/claude-billing-fetch.js'),A=require('../extension/api-credits.js');
const id='12345678-1234-1234-1234-123456789abc',org=[{uuid:id,capabilities:['api']}];
const grant=(remaining=1234)=>({remaining_amount_minor_units:remaining,granted_amount_minor_units:20000,expires_at:'2099-01-01T00:00:00Z'});
const balance=()=>({amount:1234,currency:'USD',balance:{credits:{exponent:2}},tranches:[grant(0)],promo_tranches:[grant()]});
const response=(body,status=200,url)=>new Response(JSON.stringify(body),{status,headers:{'content-type':'application/json'}});
test('Console data separates purchased and promotional lanes without subtracting or summing',()=>{
 const row=F.parse(balance());assert.equal(row.amount,0);assert.equal(row.promotional.amount,12.34);
 const b=balance();b.promo_tranches.push(grant(5));assert.equal(F.parse(b).promotional.status,'unavailable');
 b.tranches=[];assert.equal(F.parse(b).status,'unavailable');
});
test('Console parsing validates minor units, exponents, currencies and expiry',()=>{
 for(const change of [{amount:'12'},{currency:'invalid'},{promo_tranches:[{...grant(),currency:'EUR'}]},{balance:{credits:{exponent:9}}},{promo_tranches:[{...grant(),remaining_amount_minor_units:-1}]},{promo_tranches:[{...grant(),remaining_amount_minor_units:20001}]}])assert.throws(()=>F.parse({...balance(),...change}));
 const b=balance();b.promo_tranches[0].expires_at='2000-01-01T00:00:00Z';assert.equal(F.parse(b).promotional.status,'unavailable');
 b.promo_tranches[0].expires_at='unparsed';assert.equal(F.parse(b).promotional.amount,12.34);
 b.balance.credits.exponent=3;assert.equal(F.parse(b).promotional.amount,1.234);
});
test('Console selects exactly one API organization and never scans multiple billing accounts',()=>{
 assert.equal(F.organization([...org,{uuid:'chat',capabilities:['chat']}]),id);
 assert.throws(()=>F.organization([...org,...org]),e=>e.code==='ambiguous');
 assert.throws(()=>F.organization([{uuid:'other',capabilities:['chat']}]),e=>e.code==='no-api-organization');
 assert.throws(()=>F.organization([{uuid:'../../keys',capabilities:['api']}]),e=>e.code==='format');
});
test('Console uses only two bounded credentialed GETs, no tabs, tokens, spend or payment requests',async()=>{
 const calls=[],result=await F.read(async(url,options)=>{calls.push([url,options]);return response(calls.length===1?org:balance())});
 assert.equal(calls.length,2);assert.equal(calls[1][0],'https://platform.claude.com/api/organizations/'+id+'/prepaid/credits');
 for(const [,o]of calls){assert.equal(o.method,'GET');assert.equal(o.credentials,'include');assert.equal(o.redirect,'error');assert.equal(o.cache,'no-store');assert.deepEqual(Object.keys(o.headers),['Accept']);}
 assert.equal(result.promotional.amount,12.34);assert.match(result.scope,/^[a-f0-9]{8}$/);assert(!JSON.stringify(result).includes(id));
});
test('Console fails closed on denied sessions, rate limits, HTML and oversized responses',async()=>{
 for(const status of [401,403,429,500])await assert.rejects(F.read(async()=>response({},status)),e=>e.code===([401,403].includes(status)?'login':status===429?'rate-limited':'http'));
 await assert.rejects(F.read(async()=>new Response('Sign in',{headers:{'content-type':'text/html'}})),e=>e.code==='format');
 await assert.rejects(F.read(async()=>new Response('x'.repeat(524289),{headers:{'content-type':'application/json'}})),e=>e.code==='format');
 let calls=0;await assert.rejects(F.read(async()=>{calls++;return response([...org,...org])}),e=>e.code==='ambiguous');assert.equal(calls,1);
});
function setup(read){const saved={apiCredits:{claude:{enabled:true,status:'ready',amount:0,currency:'USD',capturedAt:1,promotional:{status:'ready',amount:9,currency:'USD',capturedAt:1}}},data:{keep:1},history:{keep:2}},session={'llms-claude-api-pause-v1':true};let permitted=true;
 const chrome={permissions:{contains:async()=>permitted},storage:{local:{get:async key=>({[key]:structuredClone(saved[key])}),set:async x=>Object.assign(saved,structuredClone(x))},session:{get:async key=>({[key]:session[key]}),remove:async key=>delete session[key]}},scripting:{getRegisteredContentScripts:async()=>[{}]}};
 const c={GlanceApiCredits:A,GlanceClaudeBilling:{read},chrome};vm.runInNewContext(fs.readFileSync('extension/api-credit-background.js','utf8'),c);return {B:c.GlanceApiCreditBackground,saved,session,chrome,deny:()=>permitted=false};}
test('automatic refresh routes to Console without querying, creating, focusing or reloading tabs',async()=>{
 let calls=0;const x=setup(async()=>{calls++;return {...F.parse(balance()),scope:'a1b2c3d4'}});
 x.chrome.scripting.getRegisteredContentScripts=async()=>{throw Error('DOM script registry is not required')};await x.B.refresh('claude');await x.B.refreshClaudeDirect();assert.equal(calls,1);assert.equal(x.saved.apiCredits.claude.promotional.amount,12.34);
 assert.equal(x.saved.apiCredits.claude.acquisition.stage,'console-api');assert.equal(x.session['llms-claude-api-pause-v1'],undefined);assert.deepEqual(x.saved.data,{keep:1});assert.deepEqual(x.saved.history,{keep:2});
});
test('Console concurrent work coalesces and transient failure preserves timestamps',async()=>{
 let calls=0,release;const x=setup(()=>{calls++;return new Promise(resolve=>release=resolve)});
 const a=x.B.refreshClaudeDirect();await new Promise(setImmediate);const b=x.B.refreshClaudeDirect(true);assert.equal(calls,1);release({...F.parse(balance()),scope:'a1b2c3d4'});await Promise.all([a,b]);
 const y=setup(async()=>{throw Object.assign(Error('synthetic'),{code:'timeout'})});
 await y.B.refreshClaudeDirect();assert.equal(y.saved.apiCredits.claude.capturedAt,1);assert.equal(y.saved.apiCredits.claude.promotional.capturedAt,1);assert.equal(y.saved.apiCredits.claude.acquisition.stage,'console-timeout');
});
test('denied/disabled connections never request Console; late result after disconnect cannot publish',async()=>{
 let calls=0;const x=setup(async()=>{calls++;return F.parse(balance())});x.deny();await x.B.refreshClaudeDirect();assert.equal(calls,0);
 const y=setup(async()=>{calls++;return F.parse(balance())});y.saved.apiCredits.claude.enabled=false;await y.B.refreshClaudeDirect();assert.equal(calls,0);
 let release;const z=setup(()=>new Promise(resolve=>release=resolve)),pending=z.B.refreshClaudeDirect();await new Promise(setImmediate);z.saved.apiCredits.claude.enabled=false;release({...F.parse(balance()),scope:'a1b2c3d4'});await pending;assert.equal(z.saved.apiCredits.claude.promotional.amount,9);
});
test('session rejection or ambiguous organizations clear current values rather than reusing another account',async()=>{
 for(const code of ['login','ambiguous','no-api-organization']){const x=setup(async()=>{throw Object.assign(Error('synthetic'),{code})});await x.B.refreshClaudeDirect();assert.equal(x.saved.apiCredits.claude.amount,null);assert.equal(x.saved.apiCredits.claude.promotional.amount,null);assert.equal(x.saved.apiCredits.claude.status,code==='login'?'login':'unavailable');}
});
test('production worker loads the rendering-independent Console adapter',()=>assert.match(fs.readFileSync('extension/background.js','utf8'),/'claude-billing-fetch.js','api-credit-background.js'/));


test('a changed billing organization cannot retain the old account balance after a failed request',async()=>{
 const x=setup(async()=>{throw Object.assign(Error('synthetic'),{code:'format',scope:'bbbbbbbb'})});x.saved.apiCredits.claude.scope='aaaaaaaa';
 await x.B.refreshClaudeDirect();assert.equal(x.saved.apiCredits.claude.promotional.amount,null);assert.equal(x.saved.apiCredits.claude.scope,'bbbbbbbb');
});

test('Console error signals retain only an opaque scope after organization selection',async()=>{
 let calls=0;await assert.rejects(F.read(async()=>++calls===1?response(org):response({},500)),e=>e.code==='http'&&/^[a-f0-9]{8}$/.test(e.scope)&&!JSON.stringify(e).includes(id));
});
