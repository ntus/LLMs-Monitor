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
