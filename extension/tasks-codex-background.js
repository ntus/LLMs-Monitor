/* Independent optional native metadata route. Never joins the quota refresh queue. */
(function(root){
 'use strict';
 const KEY='llms-codex-enabled-v1',HOST='info.ntus.llmsmonitor.codex';
 const ORIGINS=new Set(['https://llmsmonitor.ntus.info','https://llmsmonitor.ntusnog.chatgpt.site']);
 const UUID=/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
 let pending=null,lastRead=0,epoch=0;
 function allowed(message,sender,external){
  let u;try{u=new URL(sender.url)}catch{return false}
  if(sender.frameId!==0)return false;
  if(external)return ORIGINS.has(u.origin)&&/^\/tasks(?:\.html)?$/.test(u.pathname)&&u.searchParams.get('service')==='chatgpt'&&message.service==='chatgpt'&&['TASKS_CODEX_READ','TASKS_CODEX_SETUP'].includes(message.type);
  return sender.id===chrome.runtime.id&&sender.url===chrome.runtime.getURL('codex-setup.html')&&['CODEX_CONFIG_READ','CODEX_CONFIGURE','CODEX_CHECK'].includes(message.type);
 }
 const stamp=v=>{const n=typeof v==='string'?Date.parse(v):NaN;return Number.isFinite(n)&&n>0?new Date(n).toISOString():null};
 function normalize(value){
  if(value?.status!=='ready')return {status:['codex-not-found','unavailable'].includes(value?.status)?value.status:'unavailable'};
  if(value.schemaVersion!==1||value.scope!=='local-desktop'||!['shared','metadata-only'].includes(value.runtime)||!stamp(value.checkedAt)||!Array.isArray(value.tasks)||value.tasks.length>500)return {status:'unavailable'};
  const checked=Date.parse(value.checkedAt);if(checked>Date.now()+5000||Date.now()-checked>90000)return {status:'unavailable'};
  const seen=new Set(),tasks=[];
  for(const item of value.tasks){
   if(!item||!UUID.test(item.id||'')||seen.has(item.id)||typeof item.title!=='string'||!item.title.trim()||item.title.length>160||item.url!==`codex://threads/${item.id}`)return {status:'unavailable'};
   seen.add(item.id);let status=['running','waiting','idle','failed'].includes(item.status)&&value.runtime==='shared'&&stamp(item.observedAt)===stamp(value.checkedAt)?item.status:'unknown';
   tasks.push({id:item.id,title:item.title.replace(/[\x00-\x1f\x7f]/g,' '),url:item.url,pinned:item.pinned===true,status,observedAt:status==='unknown'?null:stamp(item.observedAt),updatedAt:stamp(item.updatedAt)});
  }
  const audit=value.pinAudit||{},observed=Number.isInteger(audit.observed)&&audit.observed>=0&&audit.observed<=500?audit.observed:null,resolved=tasks.filter(t=>t.pinned).length;
  return {status:'ready',schemaVersion:1,checkedAt:stamp(value.checkedAt),scope:'local-desktop',runtime:value.runtime,limited:value.limited===true,pinAudit:{observed,resolved,complete:audit.complete===true&&observed!==null&&observed===resolved&&audit.resolved===resolved,source:'desktop-compatibility'},tasks};
 }
 async function config(){return {enabled:(await chrome.storage.local.get(KEY))[KEY]===true,permission:await chrome.permissions.contains({permissions:['nativeMessaging']})};}
 async function read(){
  const generation=epoch,c=await config();if(generation!==epoch||!c.enabled||!c.permission)return {status:'disabled'};
  if(pending)return pending;
  if(lastRead&&Date.now()-lastRead<55000)return {status:'cooldown'};
  lastRead=Date.now();
  const operation=new Promise(resolve=>{let port,done=false;const finish=value=>{if(done)return;done=true;clearTimeout(timer);try{port?.disconnect()}catch{}resolve(generation===epoch?normalize(value):{status:'disabled'})},timer=setTimeout(()=>finish({status:'unavailable'}),24000);
   try{port=chrome.runtime.connectNative(HOST);port.onMessage.addListener(finish);port.onDisconnect.addListener(()=>{const ignored=chrome.runtime.lastError;finish({status:'unavailable'})});port.postMessage({type:'CODEX_TASKS_READ'})}catch{finish({status:'unavailable'})}
  });pending=operation;
  try{return await operation}finally{if(pending===operation)pending=null}
 }
 async function handle(message,sender,external){
  if(!allowed(message,sender,external))return {status:'unavailable'};
  if(message.type==='TASKS_CODEX_SETUP'){await GlanceWindows.createNormalTab(chrome,chrome.runtime.getURL('codex-setup.html'));return {status:'opened'}}
  if(message.type==='CODEX_CONFIG_READ')return config();
  if(message.type==='CODEX_CONFIGURE'){
   const enabled=message.enabled===true&&await chrome.permissions.contains({permissions:['nativeMessaging']});epoch++;lastRead=0;await chrome.storage.local.set({[KEY]:enabled});return {enabled};
  }
  return read();
 }
 root.LLMTaskCodexBackground={handle,normalize,allowed};
})(globalThis);
