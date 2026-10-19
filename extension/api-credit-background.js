(function(root){
 const A=root.GlanceApiCredits;let creditQueue=Promise.resolve(),claudeProbe=null,lastProbeAt=0,activeProbeId=null,probeSnapshot=null,claudeHoldUntil=0,manualOverrideAt=0;const PROBE_KEY='llms-claude-api-probe-v1',PROBE_ALARM='llms-claude-api-probe-close',PAUSE_KEY='llms-claude-api-pause-v1';
 function serialize(fn){const task=creditQueue.then(fn);creditQueue=task.catch(()=>{});return task}
 function permission(id){return {permissions:['scripting'],origins:[A.PROVIDERS[id].origin+'/*']}}
 async function permitted(id){return !!chrome.permissions&&await chrome.permissions.contains(permission(id))}
 async function register(id){const scriptId='llms-api-'+id,found=await chrome.scripting.getRegisteredContentScripts({ids:[scriptId]});if(!found.length)await chrome.scripting.registerContentScripts([{id:scriptId,matches:[A.PROVIDERS[id].origin+'/*'],js:['api-credits.js','api-credit-reader.js'],runAt:'document_idle',persistAcrossSessions:true}])}
 async function configure(id,enabled){
  if(!Object.hasOwn(A.PROVIDERS,id))throw Error('Unknown API provider');if(enabled&&!await permitted(id))throw Error('API permission required');
  await serialize(async()=>{const saved=await chrome.storage.local.get('apiCredits'),data=saved.apiCredits||{};data[id]={enabled:!!enabled,status:'unavailable',capturedAt:0};await chrome.storage.local.set({apiCredits:data})});
  if(id==='claude')await chrome.storage.session?.remove(PAUSE_KEY);
  if(!enabled&&id==='claude'){const record=(await chrome.storage.session?.get(PROBE_KEY))?.[PROBE_KEY];if(record)await cleanupProbe(record.id)}
  if(enabled){await register(id);await refresh(id)}else if(chrome.scripting)try{await chrome.scripting.unregisterContentScripts({ids:['llms-api-'+id]})}catch{}return {ok:true};
 }
 async function receive(message,sender){
  const id=message.service;if(id==='claude'&&message.readerVersion!=='1.61.0')return {ok:false};if(!Object.hasOwn(A.PROVIDERS,id)||A.provider(sender.url)!==id||sender.frameId!==0||!Number.isInteger(sender.tab?.id)||!await permitted(id))return {ok:false};
  return serialize(async()=>{const saved=await chrome.storage.local.get('apiCredits'),data=saved.apiCredits||{};if(data[id]?.enabled!==true)return {ok:false};if(id==='claude'){const candidate=A.accept(data[id],message,Date.now());if(sender.tab.active===true&&message.loading!==true&&candidate.promotional?.status==='ready'){data[id]=candidate;await chrome.storage.local.set({apiCredits:data});await chrome.storage.session?.remove(PAUSE_KEY);manualOverrideAt=Date.now();claudeHoldUntil=Date.now()+60000;return {ok:true}}if(sender.tab.id===activeProbeId){probeSnapshot={...candidate,loading:message.loading===true};return {ok:true}}if(activeProbeId!==null||Date.now()<claudeHoldUntil)return {ok:false};if(message.loading===true)return {ok:false}}data[id]=A.accept(data[id],message,Date.now());await chrome.storage.local.set({apiCredits:data});return {ok:true}});
 }
 function sameBilling(url){return [A.PROVIDERS.claude.url,A.PROVIDERS.claude.url+'/'].includes(url)}
 function bounded(task,ms=5000){let timer;return Promise.race([task,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('API reader timeout')),ms)})]).finally(()=>clearTimeout(timer));}
 async function cleanupProbe(expectedId){
  const record=(await chrome.storage.session?.get(PROBE_KEY))?.[PROBE_KEY];if(!record||expectedId!==undefined&&record.id!==expectedId||expectedId===undefined&&record.expiresAt>Date.now())return;
  await chrome.storage.session.remove(PROBE_KEY);await chrome.alarms.clear(PROBE_ALARM);
  try{if(root.GlanceQuietTabs)await root.GlanceQuietTabs.release(record.id);else{const tab=await chrome.tabs.get(record.id);if(!tab.active&&sameBilling(tab.url))await chrome.tabs.remove(record.id)}}catch{}return true;
 }
 function startClaudeProbe(force=false){
  if(claudeProbe)return claudeProbe;if(!chrome.storage.session||Date.now()-lastProbeAt<60000)return Promise.resolve();
  const operation=(async()=>{if(force)await chrome.storage.session.remove(PAUSE_KEY);else if((await chrome.storage.session.get(PAUSE_KEY))[PAUSE_KEY])return;await cleanupProbe();const previous=(await chrome.storage.session.get(PROBE_KEY))[PROBE_KEY];const state=await chrome.storage.local.get('apiCredits');if(!state.apiCredits?.claude?.enabled||!await permitted('claude'))return;lastProbeAt=Date.now();let owned,retain=false,recoveryAt=Number(previous?.recoveryAt)||0;
   try{
    owned=await (root.GlanceQuietTabs?root.GlanceQuietTabs.create(A.PROVIDERS.claude.url):chrome.tabs.create({url:A.PROVIDERS.claude.url,active:false}));if(!Number.isInteger(owned?.id))return;
    activeProbeId=owned.id;probeSnapshot=null;
    if(owned.reused){let live;try{live=await bounded(chrome.tabs.get(owned.id))}catch{}if(live&&(live.active||!sameBilling(live.url)))return;
     // Never restart a slow navigation that is still loading from the previous attempt.
     if(live?.status==='complete'&&!live.frozen&&!live.discarded&&Date.now()-recoveryAt>=60000&&(!previous||previous.id!==owned.id||previous.ready===true)&&(!root.GlanceQuietTabs?.isOwned||await root.GlanceQuietTabs.isOwned(owned.id))){recoveryAt=Date.now();await bounded(chrome.tabs.reload(owned.id)).catch(()=>{})};
    }
    const started=Date.now(),expiresAt=started+180000;await chrome.storage.session.set({[PROBE_KEY]:{id:owned.id,expiresAt,ready:false,recoveryAt}});chrome.alarms.create(PROBE_ALARM,{when:expiresAt});let injected=false,stableSince=0,signature='',readPending=null,lastStage='page-loading';
    const readOnce=()=>{
     if(!readPending){readPending=(async()=>{try{const reply=await chrome.tabs.sendMessage(owned.id,{type:'API_CREDIT_READ'});if(reply?.ready&&reply.version==='1.61.0')return}catch{}
      if(!injected){injected=true;await chrome.scripting.executeScript({target:{tabId:owned.id},files:['api-credits.js','api-credit-reader.js']})}
     })().catch(()=>{}).finally(()=>{readPending=null})}return readPending;
    };
    retain=!!root.GlanceQuietTabs;
    while(Date.now()-started<90000){
     const current=await chrome.storage.local.get('apiCredits');if(!current.apiCredits?.claude?.enabled||!await permitted('claude')){retain=false;break}
     if(manualOverrideAt>=started)break;
     let tab;try{tab=await bounded(chrome.tabs.get(owned.id))}catch(error){lastStage='browser-busy';if(/No tab with id|Invalid tab ID|^Closed$/i.test(error.message||'')){await chrome.storage.session.set({[PAUSE_KEY]:true});retain=false;break}await new Promise(resolve=>setTimeout(resolve,1500));continue}
     if(tab.active||tab.url&&!sameBilling(tab.url)){lastStage='confirmation-required';if(tab.url&&!sameBilling(tab.url))await chrome.storage.session.set({[PAUSE_KEY]:true});retain=false;break}
     if(tab.frozen||tab.discarded){
      lastStage='page-paused';
      if(Date.now()-recoveryAt>=60000&&root.GlanceQuietTabs?.isOwned&&await root.GlanceQuietTabs.isOwned(owned.id)){
       recoveryAt=Date.now();await chrome.storage.session.set({[PROBE_KEY]:{id:owned.id,expiresAt,ready:false,recoveryAt}});await bounded(chrome.tabs.reload(owned.id)).catch(()=>{});
      }
      await new Promise(resolve=>setTimeout(resolve,1500));continue;
     }
     if(tab.status==='complete'){
      // A timeout does not cancel sendMessage: keep the same pending request instead of queueing more DOM scans.
      await bounded(readOnce()).catch(()=>{});lastStage=readPending?'reader-pending':'balance-loading';
      const row=probeSnapshot;
      if(row?.capturedAt>=started&&!row.loading&&row.promotional?.status==='ready'){
       const next=JSON.stringify([row.status,row.amount,row.currency,row.scope,row.promotional.amount,row.promotional.currency]);if(next!==signature){signature=next;stableSince=row.capturedAt}
       if(Date.now()-started>=5000&&row.capturedAt-stableSince>=2000)break;
      }else{signature='';stableSince=0}
     }
     await new Promise(resolve=>setTimeout(resolve,1500));
    }
    await serialize(async()=>{if(manualOverrideAt>=started)return;const row=probeSnapshot,saved=await chrome.storage.local.get('apiCredits'),data=saved.apiCredits||{};if(!data.claude?.enabled)return;const acquisition={status:retain?'waiting':'paused',stage:lastStage,at:Date.now(),durationMs:Date.now()-started};if(!row||row.loading){data.claude={...data.claude,acquisition};await chrome.storage.local.set({apiCredits:data});return}if(row.status==='login')await chrome.storage.session.set({[PAUSE_KEY]:true});const {loading,...value}=row;data.claude={...value,acquisition:{...acquisition,status:row.promotional?.status==='ready'?'ready':acquisition.status}};await chrome.storage.local.set({apiCredits:data});await chrome.storage.session.set({[PROBE_KEY]:{id:owned.id,expiresAt,ready:row.promotional?.status==='ready',recoveryAt}});claudeHoldUntil=Date.now()+60000});
   }catch{}finally{
    if(Number.isInteger(owned?.id)){
     // Keep one owned page alive across minute refreshes. The watchdog releases it after monitor inactivity.
     if(!retain){let handled=false;try{handled=await cleanupProbe(owned.id)}catch{}if(!handled)try{if(root.GlanceQuietTabs)await root.GlanceQuietTabs.release(owned.id);else{const tab=await chrome.tabs.get(owned.id);if(!tab.active&&sameBilling(tab.url))await chrome.tabs.remove(owned.id)}}catch{}}
     if(activeProbeId===owned.id){activeProbeId=null;probeSnapshot=null}
    }
   }
  })();claudeProbe=operation;operation.finally(()=>{if(claudeProbe===operation)claudeProbe=null}).catch(()=>{});return operation;
 }
 async function refresh(only,force=false){
  const saved=await chrome.storage.local.get('apiCredits'),ids=only?[only]:Object.keys(A.PROVIDERS);
  await Promise.allSettled(ids.map(async id=>{if(!saved.apiCredits?.[id]?.enabled)return;if(!await permitted(id)){await configure(id,false);return}await register(id);const tabs=await chrome.tabs.query({url:A.PROVIDERS[id].origin+'/*'});if(id==='claude'){const active=tabs.find(tab=>tab.active&&sameBilling(tab.url));if(!active){startClaudeProbe(force).catch(()=>{});return}try{const reply=await bounded(chrome.tabs.sendMessage(active.id,{type:'API_CREDIT_READ'}));if(reply?.ready&&reply.version==='1.61.0')return}catch{}await bounded(chrome.scripting.executeScript({target:{tabId:active.id},files:['api-credits.js','api-credit-reader.js']}));return}for(const tab of tabs){if(!A.provider(tab.url)||!Number.isInteger(tab.id))continue;try{const reply=await bounded(chrome.tabs.sendMessage(tab.id,{type:'API_CREDIT_READ'}));if(reply?.ready&&reply.version==='1.61.0')continue}catch{}await bounded(chrome.scripting.executeScript({target:{tabId:tab.id},files:['api-credits.js','api-credit-reader.js']}))}}));
 }
 root.GlanceApiCreditBackground={configure,receive,refresh,permission,cleanupProbe,startClaudeProbe,PROBE_ALARM};
})(globalThis);
