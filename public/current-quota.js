/* Offline draft. Caller maps reviewed pool/window identities; no IO or registration. */
(function(root){
'use strict';
const providers=new Set(['chatgpt','claude','gemini','grok','muse','copilot','deepseek','perplexity','genspark']);
const id=x=>typeof x==='string'&&/^[a-z][a-z0-9._-]{0,79}$/.test(x);
const time=x=>Number.isSafeInteger(x)&&x>0;
const pct=x=>typeof x==='number'&&Number.isFinite(x)&&x>=0&&x<=100;
function build(entries,{now=Date.now(),maxAgeMs=125000}={}){
 if(!Array.isArray(entries)||entries.length>32||!time(now)||!Number.isSafeInteger(maxAgeMs)||maxAgeMs<1000||maxAgeMs>3600000)throw new TypeError('Invalid quota input');
 const seen=new Set(),pools=[];
 for(const e of entries){
  if(!providers.has(e?.provider)||!id(e.product)||!id(e.poolId)||!Array.isArray(e.windows)||e.windows.length>16||!['partial','complete','unknown'].includes(e.completeness))throw new TypeError('Invalid pool mapping');
  const key=[e.provider,e.product,e.poolId].join('/');if(seen.has(key))throw new TypeError('Duplicate pool');seen.add(key);
  const s=e.snapshot||{},observedAt=time(s.capturedAt)&&s.capturedAt<=now?s.capturedAt:null,ageMs=observedAt===null?null:now-observedAt;
  const windows=[],ids=new Set();
  for(const m of e.windows){
   if(!id(m?.id)||ids.has(m.id)||!Number.isSafeInteger(m.index)||m.index<0||m.index>15)throw new TypeError('Invalid window mapping');ids.add(m.id);
   const w=Array.isArray(s.windows)?s.windows[m.index]:null;
   const connection=['ready','login','error'].includes(s.status)?s.status:'unknown';
   let state=connection==='login'?'login-required':connection==='error'?'source-error':connection!=='ready'?'unavailable':observedAt===null?'unavailable':ageMs>maxAgeMs?'stale':!pct(w?.remaining)?'unavailable':'observed';
   if(w?.expired===true||time(w?.resetAt)&&w.resetAt<=now)state='reset-passed';
   const value=state==='observed'?w.remaining:null;
   const resetAt=time(w?.resetAt)?w.resetAt:null;
   const resetEvidence=resetAt!==null&&['official','estimated','reference'].includes(m.resetEvidence)?m.resetEvidence:'unknown';
   windows.push({id:m.id,direction:'remaining',unit:'percent',value,state,observedAt,observationScope:'service-snapshot',ageMs,reset:{at:resetAt,evidence:resetEvidence},previousValue:pct(w?.remaining)&&state!=='observed'?w.remaining:null});
  }
  pools.push({provider:e.provider,product:e.product,poolId:e.poolId,accountBinding:'unverified',source:'monitor-local-service-snapshot',completeness:e.completeness,windows});
 }
 return {schema:'monitor-current-quota.v1-draft',status:'proposal',generatedAt:now,maxAgeMs,pools,advisoryOnly:true,executionAllowed:false,spendingAllowed:false};
}
const REGISTRY=Object.freeze({
 chatgpt:{product:'work',labels:{'週間 (Work / Codex)':'weekly','Work / Codex · 週間':'weekly','Work / Codex · 5時間':'five-hour'}},
 claude:{product:'claude',keys:{five_hour:'five-hour',seven_day:'weekly',seven_day_sonnet:'weekly-sonnet',seven_day_opus:'weekly-opus',seven_day_oauth_apps:'weekly-oauth-apps',seven_day_cowork:'weekly-cowork'}},
 gemini:{product:'gemini',labels:{'週間':'weekly','現在のセッション':'session'}}
});
function fromSnapshots(data,{now=Date.now()}={}){
 const entries=[],diagnostics=[];
 for(const [provider,registry] of Object.entries(REGISTRY)){
  const source=data?.[provider]||{},windows=[],mapped=[],seen=new Set();let excluded=0;
  // state.accept renews capturedAt only for incoming windows. A DOM metadata merge,
  // mixed origins or unresolved conflict cannot establish one API observation.
  const atomic=source.source==='api'&&source.metadataAt===source.capturedAt&&time(source.capturedAt)&&source.capturedAt<=now&&Array.isArray(source.windows)&&source.windows.length<=16&&source.windows.every(w=>w?._source==='api'&&!w.conflict);
  for(const w of (Array.isArray(source.windows)?source.windows:[]).slice(0,16)){
   const ev=w?.usageEvidence;
   const stable=provider==='claude'?(ev?.source==='claude-org-usage-percentage'&&typeof ev.usedPercent==='number'&&Number.isFinite(ev.usedPercent)&&ev.usedPercent>=0&&ev.usedPercent<=100&&w.remaining===100-Math.round(ev.usedPercent)?registry.keys[ev.window]:null):registry.labels[w?.label];
   if(!stable){excluded++;continue;}if(seen.has(stable)){throw new TypeError('Ambiguous provider windows');}seen.add(stable);
   mapped.push({id:stable,index:windows.length,resetEvidence:'unknown'});
   windows.push({remaining:atomic?w.remaining:null,resetAt:w.resetAt,expired:w.expired===true});
  }
  entries.push({provider,product:registry.product,poolId:'subscription',completeness:'partial',snapshot:{status:source.status,capturedAt:atomic?source.capturedAt:null,windows},windows:mapped});
  diagnostics.push({provider,excludedWindows:excluded,sourceVerified:atomic,resetEvidence:'unknown'});
 }
 return {envelope:build(entries,{now}),diagnostics};
}
const api=Object.freeze({build,fromSnapshots});root.GlanceCurrentQuota=api;
if(typeof module!=='undefined')module.exports=api;
})(globalThis);
