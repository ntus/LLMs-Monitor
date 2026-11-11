(function(root){
 const A=root.GlanceApiCredits;let creditQueue=Promise.resolve(),claudeProbe=null,lastProbeAt=0;const PROBE_KEY='llms-claude-api-probe-v1',PROBE_ALARM='llms-claude-api-probe-close';
 function serialize(fn){const task=creditQueue.then(fn);creditQueue=task.catch(()=>{});return task}
 function permission(id){return {permissions:['scripting'],origins:[A.PROVIDERS[id].origin+'/*']}}
 async function permitted(id){return !!chrome.permissions&&await chrome.permissions.contains(permission(id))}
 async function register(id){const scriptId='llms-api-'+id,found=await chrome.scripting.getRegisteredContentScripts({ids:[scriptId]});if(!found.length)await chrome.scripting.registerContentScripts([{id:scriptId,matches:[A.PROVIDERS[id].origin+'/*'],js:['api-credits.js','api-credit-reader.js'],runAt:'document_idle',persistAcrossSessions:true}])}
 async function configure(id,enabled){
  if(!Object.hasOwn(A.PROVIDERS,id))throw Error('Unknown API provider');if(enabled&&!await permitted(id))throw Error('API permission required');
  await serialize(async()=>{const saved=await chrome.storage.local.get('apiCredits'),data=saved.apiCredits||{};data[id]={enabled:!!enabled,status:'unavailable',capturedAt:0};await chrome.storage.local.set({apiCredits:data})});
  if(enabled){await register(id);await refresh(id)}else if(chrome.scripting)try{await chrome.scripting.unregisterContentScripts({ids:['llms-api-'+id]})}catch{}return {ok:true};
 }
 async function receive(message,sender){
  const id=message.service;if(!Object.hasOwn(A.PROVIDERS,id)||A.provider(sender.url)!==id||sender.frameId!==0||!Number.isInteger(sender.tab?.id)||!await permitted(id))return {ok:false};
  return serialize(async()=>{const saved=await chrome.storage.local.get('apiCredits'),data=saved.apiCredits||{};if(data[id]?.enabled!==true)return {ok:false};data[id]=A.accept(data[id],message);await chrome.storage.local.set({apiCredits:data});return {ok:true}});
 }
 function bounded(task,ms=5000){let timer;return Promise.race([task,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('API reader timeout')),ms)})]).finally(()=>clearTimeout(timer));}
 async function cleanupProbe(expectedId){
  const record=(await chrome.storage.session?.get(PROBE_KEY))?.[PROBE_KEY];if(!record||expectedId!==undefined&&record.id!==expectedId||expectedId===undefined&&record.expiresAt>Date.now())return;
  await chrome.storage.session.remove(PROBE_KEY);await chrome.alarms.clear(PROBE_ALARM);
  try{const tab=await chrome.tabs.get(record.id);if(!tab.active&&tab.url===A.PROVIDERS.claude.url)await chrome.tabs.remove(record.id)}catch{}return true;
 }
 function startClaudeProbe(){
  if(claudeProbe)return claudeProbe;if(!chrome.storage.session||Date.now()-lastProbeAt<60000)return Promise.resolve();
  const operation=(async()=>{await cleanupProbe();if((await chrome.storage.session.get(PROBE_KEY))[PROBE_KEY])return;const state=await chrome.storage.local.get('apiCredits');if(!state.apiCredits?.claude?.enabled||!await permitted('claude'))return;lastProbeAt=Date.now();let owned;
   try{owned=await chrome.tabs.create({url:A.PROVIDERS.claude.url,active:false});if(!Number.isInteger(owned?.id))return;const started=Date.now();await chrome.storage.session.set({[PROBE_KEY]:{id:owned.id,expiresAt:started+15000}});chrome.alarms.create(PROBE_ALARM,{when:started+15000});let injected=false;
    while(Date.now()-started<9000){const current=await chrome.storage.local.get('apiCredits');if(!current.apiCredits?.claude?.enabled||!await permitted('claude'))break;const tab=await bounded(chrome.tabs.get(owned.id),700);if(tab.url&&tab.url!==A.PROVIDERS.claude.url)break;
     if(tab.status==='complete'){try{await bounded(chrome.tabs.sendMessage(owned.id,{type:'API_CREDIT_READ'}),1000)}catch{if(!injected){injected=true;await bounded(chrome.scripting.executeScript({target:{tabId:owned.id},files:['api-credits.js','api-credit-reader.js']}),1000)}}const row=(await chrome.storage.local.get('apiCredits')).apiCredits?.claude;if(row?.capturedAt>=started&&['ready','login','postpaid'].includes(row.status))break;}
     await new Promise(resolve=>setTimeout(resolve,250));
    }
   }catch{}finally{if(Number.isInteger(owned?.id)){let handled=false;try{handled=await cleanupProbe(owned.id)}catch{}if(!handled)try{const tab=await chrome.tabs.get(owned.id);if(!tab.active&&tab.url===A.PROVIDERS.claude.url)await chrome.tabs.remove(owned.id)}catch{}}}
  })();claudeProbe=operation;operation.finally(()=>{if(claudeProbe===operation)claudeProbe=null}).catch(()=>{});return operation;
 }
 async function refresh(only){
  const saved=await chrome.storage.local.get('apiCredits'),ids=only?[only]:Object.keys(A.PROVIDERS);
  await Promise.allSettled(ids.map(async id=>{if(!saved.apiCredits?.[id]?.enabled)return;if(!await permitted(id)){await configure(id,false);return}await register(id);const tabs=await chrome.tabs.query({url:A.PROVIDERS[id].origin+'/*'});if(id==='claude'&&!tabs.some(tab=>A.provider(tab.url)==='claude')){startClaudeProbe().catch(()=>{});return;}for(const tab of tabs){if(!A.provider(tab.url)||!Number.isInteger(tab.id))continue;try{const reply=await bounded(chrome.tabs.sendMessage(tab.id,{type:'API_CREDIT_READ'}));if(reply?.ready)continue}catch{}await bounded(chrome.scripting.executeScript({target:{tabId:tab.id},files:['api-credits.js','api-credit-reader.js']}))}}));
 }
 root.GlanceApiCreditBackground={configure,receive,refresh,permission,cleanupProbe,startClaudeProbe,PROBE_ALARM};
})(globalThis);
