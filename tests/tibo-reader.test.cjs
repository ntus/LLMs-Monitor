const {test}=require('node:test'),assert=require('node:assert/strict'),R=require('../extension/tibo-reader.js'),I=require('../extension/intelligence.js');
const at=Date.parse('2026-10-13T01:03:59Z'),row={id:'2109812360596865224',account:'thsottiaux',text:'Global reset landing by EOD PST time. Enjoy',createdAt:new Date(at).toISOString()};
test('Tibo public reader validates route, author, age and short reset announcements',()=>{
 assert(R.route('https://x.com/thsottiaux'));assert(R.route('https://x.com/thsottiaux/status/123'));
 for(const u of ['https://x.com/i/chat','https://x.com/home','https://x.com/Other/status/123','https://x.com/thsottiaux?secret=x','https://user@x.com/thsottiaux','https://x.com:8443/thsottiaux'])assert(!R.route(u));
 assert.equal(R.classify(row,at).kind,'reset');assert.equal(R.classify({...row,text:'Day 8/ Reset'},at).resetAt,null);
 for(const x of [{...row,account:'Other'},{...row,text:'Password reset by EOD PST time'},{...row,text:'Reset my desktop'},{...row,createdAt:'invalid'}])assert.equal(R.classify(x,at),null);
 assert.equal(R.classify(row,at+604800001),null);
});
test('EOD PST uses explicit fixed zone and marker expires at deadline, not post time',()=>{
 const a=R.classify(row,at);assert.equal(a.resetAt,Date.parse('2026-10-13T07:59:00Z'));
 assert.equal(R.deadline('Global reset',at),null);assert.equal(R.deadline('by EOD',at),null);
 const feed={status:'ready',checkedAt:at,alerts:[a]};const mark=I.tiboMark(feed,'ja',at);
 assert.match(mark,/Tibo 𝕏 Reset\?/);assert.match(mark,/2109812360596865224/);assert.match(mark,/個人の残量回復は未確認/);
 assert.equal(I.tiboMark(feed,'ja',a.resetAt),'');assert.equal(I.tiboMark(feed,'ja',a.resetAt+1),'');
 assert.equal(I.tiboMark({...feed,alerts:[{...a,url:'https://x.com/Other/status/'+a.id}]},'ja',at),'');
 assert.equal(I.tiboMark({...feed,alerts:[{...a,resetAt:null}]},'ja',at),'');
});
test('opt-in public reader does not navigate, fetch or launch tabs, and preserves alerts on failure',async()=>{
 let enabled=false,allowed=true,calls=0;const chrome={storage:{local:{get:async()=>({[R.KEY]:enabled})}},permissions:{contains:async()=>allowed},tabs:{query:async()=>[{id:1,url:'https://x.com/thsottiaux/status/123'},{id:2,url:'https://x.com/i/chat'}]},scripting:{executeScript:async arg=>{calls++;assert.deepEqual(arg.target,{tabId:1,frameIds:[0]});return [{frameId:0,result:[row,{...row,account:'Other'}]}];}}};
 assert.equal(await R.read(chrome,{alerts:[]},at),null);assert.equal(calls,0);
 enabled=true;const first=await R.read(chrome,{alerts:[]},at);assert.equal(first.status,'ready');assert.equal(first.alerts.length,1);assert.equal(I.newAlerts({},first).length,0);
 const again=await R.read(chrome,first,at+1);assert.equal(again.alerts.length,1);assert.equal(I.newAlerts(first,again).length,0);
 allowed=false;const failed=await R.read(chrome,first,at+2);assert.equal(failed.status,'unavailable');assert.equal(failed.alerts.length,1);assert.equal(calls,2);
});

test('Japanese auto-translated public posts preserve fixed-zone announced deadlines',()=>{const translated={...row,text:'本日PST時間EODまでにグローバルリセット着陸。楽しんでください。'};assert.equal(R.classify(translated,at).resetAt,R.classify(row,at).resetAt);assert.equal(R.classify({...row,text:'8日目/ リセット'},at).kind,'reset');});

test('marker rejects impossible dates, unrelated provider and hostile tooltip text',()=>{const a=R.classify(row,at);for(const bad of [{...a,resetAt:1e30},{...a,provider:'anthropic'},{...a,publishedAt:at+1}])assert.equal(I.tiboMark({alerts:[bad]},'ja',at),'');const html=I.tiboMark({alerts:[{...a,summary:'"<img src=x onerror=evil()>"'}]},'ja',at);assert(!html.includes('<img'));assert(html.includes('&quot;'));});

test('public shared URLs are accepted without retaining tracking parameters; unrelated or duplicated query names remain rejected',async()=>{const shared='https://x.com/thsottiaux/status/2109812216212099456?s=46&t=example';assert(R.route(shared));assert(!R.route(shared+'&secret=x'));assert(!R.route(shared+'&s=1'));assert(!R.route('https://x.com/i/chat?s=46'));let ran=false;const chrome={storage:{local:{get:async()=>({[R.KEY]:true})}},permissions:{contains:async()=>true},tabs:{query:async()=>[{id:1,url:shared}]},scripting:{executeScript:async()=>{ran=true;return [{frameId:0,result:[row]}]}}};const feed=await R.read(chrome,{alerts:[]},at);assert(ran);assert.equal(feed.readerState,'ready');assert(!JSON.stringify(feed).includes('example'));});

test('injected public reader applies the same share-query boundary before touching the DOM',()=>{const vm=require('node:vm');let inspected=0;const context={URL,location:{href:'https://x.com/thsottiaux/status/123?s=46&t=example'},document:{querySelectorAll:()=>{inspected++;return []}}};vm.runInNewContext('('+R.readPage.toString()+')()',context);assert.equal(inspected,1);for(const url of ['https://x.com/thsottiaux/status/123?secret=x','https://x.com/thsottiaux/status/123?s=1&s=2','https://x.com/i/chat?s=46']){context.location.href=url;vm.runInNewContext('('+R.readPage.toString()+')()',context);assert.equal(inspected,1);}});

test('one failed public tab cannot discard readable posts in another tab',async()=>{const chrome={storage:{local:{get:async()=>({[R.KEY]:true})}},permissions:{contains:async()=>true},tabs:{query:async()=>[{id:1,url:'https://x.com/thsottiaux'},{id:2,url:'https://x.com/thsottiaux/status/123'}]},scripting:{executeScript:async arg=>{if(arg.target.tabId===1)throw Error('Reader unavailable');return [{frameId:0,result:[row]}]}}};const f=await R.read(chrome,{alerts:[]},at);assert.equal(f.status,'ready');assert.equal(f.alerts.length,1);});
test('a later complete reading fills the same post deadline without duplicate notification',async()=>{const old=R.classify({...row,text:'Global reset'},at),prior={status:'ready',lastReadyAt:at,alerts:[old]},chrome={storage:{local:{get:async()=>({[R.KEY]:true})}},permissions:{contains:async()=>true},tabs:{query:async()=>[{id:1,url:'https://x.com/thsottiaux'}]},scripting:{executeScript:async()=>[{frameId:0,result:[row]}]}};const f=await R.read(chrome,prior,at+1000);assert(f.alerts[0].resetAt);assert.equal(f.alerts[0].detectedAt,at);assert.equal(I.newAlerts(prior,f).length,0);});

test('a stalled public tab is bounded independently and cannot suppress readable posts',async()=>{const chrome={storage:{local:{get:async()=>({[R.KEY]:true})}},permissions:{contains:async()=>true},tabs:{query:async()=>[{id:1,url:'https://x.com/thsottiaux'},{id:2,url:'https://x.com/thsottiaux/status/123'}]},scripting:{executeScript:async arg=>arg.target.tabId===1?new Promise(()=>{}):[{frameId:0,result:[row]}]}};const f=await R.read(chrome,{alerts:[]},at);assert.equal(f.status,'ready');assert.equal(f.readerInfo.posts,1);assert.equal(f.readerInfo.pages,2);});
test('permission granted without script API reports a specific recoverable status',async()=>{const chrome={storage:{local:{get:async()=>({[R.KEY]:true})}},permissions:{contains:async()=>true}};assert.equal((await R.read(chrome,{alerts:[]},at)).readerState,'api-unavailable');});
