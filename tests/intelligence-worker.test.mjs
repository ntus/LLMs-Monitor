import test from 'node:test';
import assert from 'node:assert/strict';
import {classify,power,QUERY} from '../server/intelligence-worker.mjs';

test('worker query includes staff, official providers',()=>{for(const name of ['thsottiaux','OpenAI','AnthropicAI','GoogleAI'])assert.match(QUERY,new RegExp(`from:${name}`))});
test('irrelevant posts do not enter the feed',()=>assert.equal(classify({id:'1',text:'Hello world',created_at:'2026-10-03T00:00:00Z'},{username:'OpenAI'}),null));
test('usage and reset announcements are classified',()=>{assert.equal(classify({id:'1',text:'We reset usage limits across plans'},{username:'thsottiaux'}).kind,'reset');assert.equal(classify({id:'2',text:'New usage limits for Claude plans'},{username:'AnthropicAI'}).kind,'usage')});
test('BridgeBench and Nerf posts are not monitored',()=>{assert.doesNotMatch(QUERY,/bridgebench|bridgemindai/i);assert.equal(classify({id:'3',text:'Nerf Bench model power is 88.5%'},{username:'bridgemindai'}),null)});
test('power parser rejects impossible percentages',()=>{assert.equal(power('power 103.8%'),103.8);assert.equal(power('power 900%'),null)});

test('Tibo long posts, case, unrelated resets and recovery are distinguished',()=>{
 assert.equal(classify({id:'8',text:'x'.repeat(500)+' Codex usage limits have been reset'},{username:'THSOTTIAUX'}).kind,'reset');
 assert.equal(classify({id:'8',text:'Reset your password'},{username:'thsottiaux'}),null);
 assert.equal(classify({id:'9',text:'Usage limits have been restored'},{username:'OpenAI'}).kind,'recovery');
 assert.equal(classify({id:'../evil',text:'Codex reset'},{username:'thsottiaux'}),null);
 assert.equal(classify({id:'10',text:'Usage quota restored'},{username:'fake'}),null);
});

import Worker,{refresh} from '../server/intelligence-worker.mjs';
import I from '../extension/intelligence.js';
function cache(){const values=new Map();return {values,get:async(k,type)=>{const v=values.get(k);return type==='json'&&v?JSON.parse(v):v;},put:async(k,v)=>values.set(k,v)};}
const page=(id,text='Codex usage limits reset',next='')=>({data:[{id,author_id:'7',text,created_at:'2026-10-11T01:00:00Z'}],includes:{users:[{id:'7',username:'thsottiaux'}]},meta:{result_count:1,...(next?{next_token:next}:{})}});
test('complete pages commit atomically; cursor, silent baseline, new alert and repeated ID work end-to-end',async()=>{
 const old=globalThis.fetch,kv=cache(),env={X_BEARER_TOKEN:'synthetic-test-only',INTELLIGENCE_CACHE:kv};let calls=[];
 try{globalThis.fetch=async url=>{calls.push(new URL(url));return Response.json(calls.length===1?page('20','Codex limits reset','page-two'):page('19'));};
 const first=await refresh(env);assert.equal(first.alerts.length,2);assert.equal(calls[1].searchParams.get('next_token'),'page-two');assert(calls[0].searchParams.has('start_time'));assert.equal(await kv.get('cursor'),'20');assert.equal(I.newAlerts({},first).length,0);
 globalThis.fetch=async url=>{assert.equal(new URL(url).searchParams.get('since_id'),await kv.get('cursor'));return Response.json(page('21'));};const next=await refresh(env);assert.deepEqual(I.newAlerts(first,next).map(a=>a.id),['21']);const repeated=await refresh(env);assert.equal(I.newAlerts(next,repeated).length,0);assert.equal(repeated.alerts.find(a=>a.id==='20').detectedAt,first.alerts.find(a=>a.id==='20').detectedAt);
 }finally{globalThis.fetch=old;}
});
test('auth, malformed, partial, oversized and over-budget pagination never advance the cached feed/cursor',async()=>{
 const old=globalThis.fetch,kv=cache(),prior={status:'ready',checkedAt:10,alerts:[]};await kv.put('feed',JSON.stringify(prior));await kv.put('cursor','18');const env={X_BEARER_TOKEN:'synthetic-test-only',INTELLIGENCE_CACHE:kv};
 try{for(const reply of [()=>new Response('',{status:401}),()=>Response.json({meta:{result_count:1}}),()=>Response.json({errors:[{detail:'Do not log server error'}],meta:{result_count:0}}),()=>Response.json({...page('20'),includes:{users:[]}}),()=>new Response('x',{headers:{'content-length':'3000001'}}),()=>new Response('x'.repeat(3000001)),()=>Response.json(page('20','Codex reset','more'))]){globalThis.fetch=async()=>reply();await assert.rejects(refresh(env));assert.deepEqual(await kv.get('feed','json'),prior);assert.equal(await kv.get('cursor'),'18');}
 }finally{globalThis.fetch=old;}
});
test('failed scheduled poll preserves prior alerts and stale HTTP feed cannot claim ready; exact CORS',async()=>{
 const old=globalThis.fetch,kv=cache();await kv.put('feed',JSON.stringify({status:'ready',checkedAt:1,alerts:[{id:'11'}]}));const env={X_BEARER_TOKEN:'synthetic-test-only',INTELLIGENCE_CACHE:kv},pending=[];
 try{globalThis.fetch=async()=>new Response('',{status:429});await Worker.scheduled({},env,{waitUntil:p=>pending.push(p)});await Promise.all(pending);assert.equal((await kv.get('feed','json')).status,'unavailable');assert.equal((await kv.get('feed','json')).alerts[0].id,'11');
 await kv.put('feed',JSON.stringify({status:'ready',checkedAt:1,alerts:[]}));const p=[];const r=await Worker.fetch(new Request('https://example.test/api/intelligence.json',{headers:{origin:'https://llmsmonitor.ntus.info'}}),env,{waitUntil:v=>p.push(v)});assert.equal((await r.json()).status,'unavailable');assert.equal(r.headers.get('access-control-allow-origin'),'https://llmsmonitor.ntus.info');await Promise.all(p);
 const bad=await Worker.fetch(new Request('https://example.test/api/intelligence.json',{headers:{origin:'https://llmsmonitor.ntus.info.evil.test'}}),{}, {waitUntil:()=>{}});assert.equal(bad.headers.get('access-control-allow-origin'),null);
 }finally{globalThis.fetch=old;}
});

test('network deadline aborts without committing data or a cursor',async()=>{
 const oldFetch=globalThis.fetch,oldTimer=globalThis.setTimeout,kv=cache();await kv.put('feed',JSON.stringify({status:'ready',checkedAt:1,alerts:[]}));await kv.put('cursor','20');
 try{globalThis.setTimeout=(fn,ms,...args)=>oldTimer(fn,ms===8000?1:ms,...args);globalThis.fetch=async(_url,{signal})=>new Promise((_,reject)=>signal.addEventListener('abort',()=>reject(Error('Simulated abort')),{once:true}));await assert.rejects(refresh({X_BEARER_TOKEN:'synthetic-test-only',INTELLIGENCE_CACHE:kv}));assert.equal(await kv.get('cursor'),'20');assert.equal((await kv.get('feed','json')).checkedAt,1);
 }finally{globalThis.fetch=oldFetch;globalThis.setTimeout=oldTimer;}
});
