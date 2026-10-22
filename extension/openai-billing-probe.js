/* Optional OpenAI API billing only; never changes subscription quota/history/audio. */
(function(root){
 const KEY='llms-openai-billing-probe-v1',ALARM='llms-openai-billing-idle',VERSION='1.64.0';
 let running=null,generation=0,retryAt=0,activeId=null,snapshot=null,holdUntil=0,hooks,readPending=null,readTab=null;
 const A=root.GlanceApiCredits,url=A.PROVIDERS.chatgpt.url;
 const exact=value=>value===url||value===url+'/';
 const pending=tab=>(!tab.url||tab.url==='about:blank')&&exact(tab.pendingUrl);
 const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 function bounded(p,ms=5000){let timer;return Promise.race([p,new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error('timeout')),ms)})]).finally(()=>clearTimeout(timer))}
 const record=async()=>((await chrome.storage.session.get(KEY))[KEY]||{});
 const enabled=async()=>!!(await chrome.storage.local.get('apiCredits')).apiCredits?.chatgpt?.enabled&&await hooks.permitted('chatgpt');
 function init(value){hooks=value}
 async function releaseTab(id,windowId){
  try{const tab=await chrome.tabs.get(id);if(tab.windowId!==windowId){await root.GlanceQuietTabs.relinquish(id);return}}catch{return}
  await root.GlanceQuietTabs.release(id);
 }
 async function release(force=false){
  const saved=await record();if(!Number.isInteger(saved.id)||!force&&saved.expiresAt>Date.now())return;
  await chrome.storage.session.remove(KEY);await chrome.alarms.clear(ALARM);
  await releaseTab(saved.id,saved.windowId);
 }
 async function invalidate(){generation++;retryAt=0;holdUntil=0;await release(true)}
 // Called only inside the shared validated billing queue, never the quota queue.
 async function receive(message,sender){
  if(message.balanceReaderVersion!==VERSION)return {handled:true,ok:false};
  if(sender.tab.id===activeId){snapshot={...A.sanitize(message,Date.now()),loading:message.loading===true};return {handled:true,ok:true}}
  if(activeId!==null||Date.now()<holdUntil||message.loading===true||sender.tab.id===(await record()).id)return {handled:true,ok:false};
  return {handled:false};
 }
 function refresh(force=false){
  if(running)return running;if(!hooks||!root.GlanceQuietTabs||!chrome.storage.session||!force&&Date.now()<retryAt)return Promise.resolve();
  const token=generation;
  const task=(async()=>{
   if(!await enabled())return;
   let saved=await record();if(saved.paused&&!force)return;
   retryAt=Date.now()+60000;
   if(force&&saved.paused){await chrome.storage.session.remove(KEY);saved={}}
   let owned,stage='page-loading',result=null,retain=true;
   const started=Date.now();
   try{
    // A manually closed acquisition page is never recreated in a minute loop.
    if(Number.isInteger(saved.id)){
     let tab;try{tab=await bounded(chrome.tabs.get(saved.id))}catch{retain=false;stage='closed';return}
     if(!await root.GlanceQuietTabs.sameMonitorWindow(tab.windowId)){retain=false;stage='monitor-unavailable';return}
     if(tab.active||!exact(tab.url)&&!pending(tab)){retain=false;stage='confirmation-required';return}
     if(exact(tab.url)&&!await root.GlanceQuietTabs.isOwned(tab.id)){retain=false;stage='confirmation-required';return}
     owned={...tab,reused:true};
    }
    if(token!==generation||!await enabled())return;
    if(!owned)owned=await root.GlanceQuietTabs.create(url);
    if(token!==generation||!await enabled()){retain=false;return}
    activeId=owned.id;snapshot=null;
    await hooks.serialize(async()=>{
     if(token!==generation||!await enabled())return;
     const state=await chrome.storage.local.get('apiCredits'),data=state.apiCredits||{};
     data.chatgpt={...data.chatgpt,acquisition:{status:'waiting',stage:'openai-page-loading',at:Date.now()}};
     await chrome.storage.local.set({apiCredits:data});
    });
    // Reuse completed reads, but leave an unfinished hydration attempt running.
    const live=await bounded(chrome.tabs.get(owned.id));
    if(live.active||!exact(live.url)&&!pending(live)){retain=false;stage='confirmation-required';return}
    if(owned.reused&&saved.ready&&Date.now()-(saved.reloadAt||0)>=60000&&exact(live.url)&&await root.GlanceQuietTabs.isOwned(owned.id)){
     await bounded(chrome.tabs.reload(owned.id));
    }
    const expiresAt=Date.now()+180000;
    await chrome.storage.session.set({[KEY]:{id:owned.id,windowId:owned.windowId,expiresAt,ready:false,reloadAt:Date.now()}});
    chrome.alarms.create(ALARM,{when:expiresAt});
    let injected=false,signature='',stableAt=0;
    if(readTab!==owned.id){readTab=owned.id;readPending=null}
    const readOnce=()=>{
     if(!readPending){const request=(async()=>{
      try{const ack=await chrome.tabs.sendMessage(owned.id,{type:'API_CREDIT_READ'});if(ack?.ready&&ack.balanceReaderVersion===VERSION)return}catch{}
      if(!injected){injected=true;await chrome.scripting.executeScript({target:{tabId:owned.id},files:['api-credits.js','api-credit-reader.js']})}
     })().catch(()=>{});readPending=request;request.finally(()=>{if(readPending===request)readPending=null})}
     return readPending;
    };
    while(Date.now()-started<90000){
     if(token!==generation||!await enabled()){retain=false;return}
     let tab;try{tab=await bounded(chrome.tabs.get(owned.id))}catch{retain=false;stage='closed';break}
     if(!await root.GlanceQuietTabs.sameMonitorWindow(tab.windowId)){retain=false;stage='monitor-unavailable';break}
     if(tab.active||!exact(tab.url)&&!pending(tab)){retain=false;stage='confirmation-required';break}
     if(exact(tab.url)&&!await root.GlanceQuietTabs.isOwned(tab.id)){retain=false;stage='confirmation-required';break}
     if(tab.status==='complete'&&exact(tab.url)&&!tab.discarded&&!tab.frozen){
      await bounded(readOnce()).catch(()=>{});stage=readPending?'reader-pending':'balance-loading';
      const value=snapshot;
      if(value&&!value.loading&&value.status==='ready'){
       const next=JSON.stringify([value.amount,value.currency,value.scope]);
       if(next!==signature){signature=next;stableAt=value.capturedAt}
       if(Date.now()-started>=5000&&value.capturedAt-stableAt>=2000){result=value;stage='ready';break}
      }else{signature='';stableAt=0;if(value?.status==='login'){result=value;retain=false;stage='login';break}}
     }
     await delay(1500);
    }
   }catch{stage='browser-unavailable';retryAt=Date.now()+300000}
   finally{
    try{
     await hooks.serialize(async()=>{
      if(token!==generation||!await enabled())return;
      if(result&&(!await root.GlanceQuietTabs.isOwned(owned.id)||!await root.GlanceQuietTabs.sameMonitorWindow((await chrome.tabs.get(owned.id)).windowId))){result=null;retain=false;stage='confirmation-required'}
      const state=await chrome.storage.local.get('apiCredits'),data=state.apiCredits||{};
      const acquisition={status:result?'ready':retain?'waiting':'paused',stage:'openai-'+stage,at:Date.now()};
      // Timeout never refreshes a previous balance's timestamp or invents zero.
      data.chatgpt=result?{...A.accept(data.chatgpt,result,result.capturedAt),acquisition}:{...data.chatgpt,acquisition};
      await chrome.storage.local.set({apiCredits:data});
      if(result)holdUntil=Date.now()+60000;
      if(retain&&Number.isInteger(owned?.id))await chrome.storage.session.set({[KEY]:{...(await record()),ready:!!result}});
      if(!retain){await release(true);await chrome.storage.session.set({[KEY]:{paused:true}})}
     });
    }finally{
     if(token!==generation||!retain){if(Number.isInteger(owned?.id))await releaseTab(owned.id,owned.windowId).catch(()=>{})}
     activeId=null;snapshot=null;
    }
   }
  })();running=task;task.finally(()=>{if(running===task)running=null}).catch(()=>{});return task;
 }
 root.GlanceOpenAIBillingProbe={init,refresh,receive,invalidate,release,ALARM};
})(globalThis);
