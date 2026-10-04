(function(root){
 const A=root.GlanceApiCredits;let creditQueue=Promise.resolve();
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
 async function refresh(only){
  const saved=await chrome.storage.local.get('apiCredits'),ids=only?[only]:Object.keys(A.PROVIDERS);
  await Promise.allSettled(ids.map(async id=>{if(!saved.apiCredits?.[id]?.enabled)return;if(!await permitted(id)){await configure(id,false);return}await register(id);const tabs=await chrome.tabs.query({url:A.PROVIDERS[id].origin+'/*'});for(const tab of tabs){if(!A.provider(tab.url)||!Number.isInteger(tab.id))continue;try{const reply=await chrome.tabs.sendMessage(tab.id,{type:'API_CREDIT_READ'});if(reply?.ready)continue}catch{}await chrome.scripting.executeScript({target:{tabId:tab.id},files:['api-credits.js','api-credit-reader.js']})}}));
 }
 root.GlanceApiCreditBackground={configure,receive,refresh,permission};
})(globalThis);
