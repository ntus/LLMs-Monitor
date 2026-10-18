/* One reusable acquisition tab, only in the monitor's normal window. Never reload user tabs. */
(function(root){
 const KEY='llms-grok-refresh-v1',URL='https://grok.com/dashboard';let pending=null;
 const read=async()=>((await chrome.storage.session.get(KEY))[KEY]||{}),save=s=>chrome.storage.session.set({[KEY]:s});
 async function ownedId(){const s=await read();return Number.isInteger(s.id)?s.id:null;}
 function refresh(force=false){if(pending)return pending;pending=(async()=>{
  if(!await chrome.permissions.contains({permissions:['scripting'],origins:['https://grok.com/*']}))return;
  const enabled=((await chrome.storage.local.get('llms-additional-services-v1'))['llms-additional-services-v1']||{}).grok?.enabled;if(!enabled)return;
  let s=await read();if(s.paused&&!force)return;if(s.at&&Date.now()-s.at<60000)return;
  if(Number.isInteger(s.id)){
   let tab;try{tab=await chrome.tabs.get(s.id)}catch{if(!force){await save({paused:true,at:Date.now()});return}await root.GlanceQuietTabs.release(s.id);s={};await save(s)}
   // Login/challenge redirects and user navigation pause, without creating another tab.
   if(tab&&tab.url!==URL){await save({...s,paused:true});return}
   if(tab?.active)return;
   if(tab&&await root.GlanceQuietTabs.sameMonitorWindow(tab.windowId)!==true)return;
   if(tab&&!force&&Date.now()-(s.goodAt||s.createdAt||s.at)>180000){await save({...s,paused:true});return;}
   if(tab){await save({...s,paused:false,at:Date.now()});await chrome.tabs.reload(s.id);return;}
  }
  await save({at:Date.now()});try{const tab=await root.GlanceQuietTabs.create(URL);await save({id:tab.id,at:Date.now(),createdAt:Date.now(),paused:false})}catch{ /* no monitor window: skip instead of opening a new one */ }
 })().finally(()=>{pending=null});return pending;}
 async function report(id,ready){const s=await read();if(s.id!==id)return;if(ready){await save({...s,failures:0,goodAt:Date.now(),paused:false});return}if(Date.now()-(s.at||0)<15000)return;const failures=(s.failures||0)+1;await save({...s,failures,paused:failures>=2});}
 async function stop(){if(pending)await pending.catch(()=>{});const s=await read();if(Number.isInteger(s.id))await root.GlanceQuietTabs.release(s.id);await save({});}
 root.GlanceGrokRefresh={refresh,stop,ownedId,report};
})(globalThis);
