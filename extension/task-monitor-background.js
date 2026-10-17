/* Read-only selected-provider overview. Never enters the refresh/history/audio queue. */
(function(root){
 'use strict';
 const ORIGINS=new Set(['https://llmsmonitor.ntus.info','https://llmsmonitor.ntusnog.chatgpt.site']);
 const URLS={chatgpt:'https://status.openai.com/',claude:'https://status.claude.com/',gemini:'https://www.google.com/appsstatus/dashboard/products/npdyhgECDJ6tB66MxXyo/history'};
 const text=(v,n)=>typeof v==='string'?v.slice(0,n):'';
 const time=v=>typeof v==='number'&&Number.isFinite(v)&&v>0?v:null;
 function allowed(message,sender,external){
  try{const u=new URL(sender.url);return external===true&&sender.frameId===0&&Object.hasOwn(URLS,message.service)&&ORIGINS.has(u.origin)&&/^\/tasks(?:\.html)?$/.test(u.pathname)&&u.searchParams.getAll('service').length===1&&u.searchParams.get('service')===message.service;}catch{return false;}
 }
 function project(saved,service,now=Date.now()){
  const raw=saved?.data?.[service]||{},snapshot=raw.status==='login'?{status:'login',windows:[]}:root.GlanceState.view({...raw,windows:Array.isArray(raw.windows)?raw.windows.filter(w=>w&&typeof w==='object'):[]},now),capture=time(snapshot.capturedAt),fresh=!!capture&&capture<=now+5000&&now-capture<125000;
  const windows=snapshot.status==='login'?[]:(Array.isArray(snapshot.windows)?snapshot.windows:[]).slice(0,6).filter(w=>w&&typeof w==='object').map(w=>({label:text(w.label,80),remaining:!w.expired&&typeof w.remaining==='number'&&Number.isFinite(w.remaining)&&w.remaining>=0&&w.remaining<=100?w.remaining:null,resetAt:time(w.resetAt),expired:w.expired===true}));
  const status=snapshot.status==='login'?'login':snapshot.status==='loading'?'loading':snapshot.status==='ready'&&fresh?'ready':capture?'previous':'unknown';
  const p=saved?.providerStatus?.[service]||{},checkedAt=time(p.checkedAt),current=!!checkedAt&&checkedAt<=now+5000&&now-checkedAt<125000;
  const feed=service==='chatgpt'&&root.GlanceIntelligence?root.GlanceIntelligence.normalize(saved?.intelligenceFeed):null,tiboFeed=feed&&root.GlanceIntelligence.tiboDetails(feed,'en',now)?{status:feed.status,alerts:feed.alerts.filter(a=>root.GlanceIntelligence.tiboDetails({status:feed.status,alerts:[a]},'en',now)).slice(0,1)}:null;
  return {...(tiboFeed?{tiboFeed}:{}),schemaVersion:1,usageDisplay:saved.settings?.usageDisplay==='used'?'used':'remaining',service,extensionVersion:text(chrome.runtime.getManifest().version,30),checkedAt:now,usage:{plan:text(snapshot.plan,80),status,capturedAt:capture,windows},incident:{state:['ok','issue','recovered'].includes(p.state)?p.state:'unknown',summary:text(p.summary,180),checkedAt,current,url:URLS[service]}};
 }
 async function handle(message,sender,external){if(!allowed(message,sender,external))return {status:'unavailable'};return project(await chrome.storage.local.get(['data','providerStatus','settings',...(message.service==='chatgpt'?['intelligenceFeed']:[])]),message.service);}
 root.LLMTaskMonitorBackground={allowed,project,handle};
})(globalThis);
