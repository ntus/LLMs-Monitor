/* Automatic acquisition never creates, focuses, minimizes or closes a window. */
(function(root){
 const KEY='llms-quiet-tabs-v1',MONITOR='llms-acquisition-monitor-v1';let queue=Promise.resolve();
 const serial=fn=>{const p=queue.then(fn);queue=p.catch(()=>{});return p};
 const samePage=(actual,expected)=>actual===expected||expected==='https://platform.claude.com/settings/billing'&&actual==='https://platform.claude.com/settings/billing/'||expected==='https://claude.ai/settings/usage'&&actual==='https://claude.ai/new#settings/usage';
 const read=async()=>((await chrome.storage.session.get(KEY))[KEY]||{tabs:[]});
 const save=state=>chrome.storage.session.set({[KEY]:state});
 function monitorPage(value){try{const u=new URL(value);return !u.username&&!u.password&&((u.origin==='https://llmsmonitor.ntus.info'||u.origin==='https://llmsmonitor.ntusnog.chatgpt.site')&&['/','/index.html'].includes(u.pathname)||value.split(/[?#]/)[0]===chrome.runtime.getURL('index.html'));}catch{return false}}
 async function setMonitor(id){if(!Number.isInteger(id))return;try{const tab=await chrome.tabs.get(id);if(monitorPage(tab.url))await chrome.storage.session.set({[MONITOR]:id})}catch{}}
 async function monitorTarget(){
  const windows=await chrome.windows.getAll({windowTypes:['normal']}),valid=new Map(windows.filter(w=>w.type==='normal'&&w.incognito!==true).map(w=>[w.id,w]));
  const saved=(await chrome.storage.session.get(MONITOR))[MONITOR];
  let preferred=null;try{if(Number.isInteger(saved))preferred=await chrome.tabs.get(saved)}catch{}
  const candidates=preferred&&monitorPage(preferred.url)&&valid.has(preferred.windowId)?[preferred]:
   (await chrome.tabs.query({url:['https://llmsmonitor.ntus.info/*','https://llmsmonitor.ntusnog.chatgpt.site/*',chrome.runtime.getURL('index.html')+'*']})).filter(t=>monitorPage(t.url)&&valid.has(t.windowId)).sort((a,b)=>Number(!!valid.get(b.windowId)?.focused)-Number(!!valid.get(a.windowId)?.focused)||a.id-b.id);
  const selected=candidates[0];if(!selected)throw Error('No monitor browser window; automatic acquisition skipped');
  // Revalidate after discovery: do not fall back to an unrelated normal window.
  const live=await chrome.tabs.get(selected.id);if(!monitorPage(live.url)||!valid.has(live.windowId))throw Error('Monitor moved or closed; automatic acquisition skipped');return live;
 }
 async function monitorWindow(){return (await monitorTarget()).windowId}
 const marked=tab=>!!tab?.mutedInfo?.muted&&tab.mutedInfo.extensionId===chrome.runtime.id&&Number.isInteger(tab.openerTabId);
 function create(url){return serial(async()=>{
  const state=await read(),monitor=await monitorTarget(),windowId=monitor.windowId;
  const live=[];for(const owned of state.tabs||[])try{await chrome.tabs.get(owned.id);live.push(owned)}catch{}
  // An extension reload clears session storage. Recover only tabs marked as muted by this exact extension and opened from this monitor.
  const reusable=(await chrome.tabs.query({url:url==='https://claude.ai/settings/usage'?[url,'https://claude.ai/new*']:url==='https://platform.claude.com/settings/billing'?[url,url+'/']:url})).find(tab=>!tab.active&&tab.windowId===windowId&&tab.openerTabId===monitor.id&&marked(tab)&&samePage(tab.url,url));
  if(reusable){if(!live.some(t=>t.id===reusable.id))await save({tabs:[...live,{id:reusable.id,url,...(url==='https://platform.claude.com/settings/billing'&&reusable.autoDiscardable===false?{restoreDiscardable:true}:{})}]});return {...reusable,reused:true};}
  if(live.length>=12)throw Error('Quiet acquisition capacity reached');
  const tab=await chrome.tabs.create({url,windowId,openerTabId:monitor.id,active:false});
  if(!Number.isInteger(tab?.id))throw Error('Acquisition tab unavailable');
  try{await save({tabs:[...live,{id:tab.id,url,...(url==='https://platform.claude.com/settings/billing'&&tab.autoDiscardable!==false?{restoreDiscardable:true}:{})}]})}catch(error){try{const current=await chrome.tabs.get(tab.id);if(!current.active&&samePage(current.url||current.pendingUrl,url))await chrome.tabs.remove(tab.id)}catch{}throw error;}
  try{await chrome.tabs.update(tab.id,{muted:true,...(url==='https://platform.claude.com/settings/billing'?{autoDiscardable:false}:{})})}catch{}
  return tab;
 });}
 function release(id){return serial(async()=>{
  const state=await read(),owned=(state.tabs||[]).find(t=>t.id===id);if(!owned)return false;
  // Keep user-activated/navigated tabs; never delete a whole window or its blank tab.
  try{const tab=await chrome.tabs.get(id);if(!tab.active&&(samePage(tab.url,owned.url)||!tab.url&&samePage(tab.pendingUrl,owned.url)))await chrome.tabs.remove(id);else if(marked(tab))await chrome.tabs.update(id,{muted:false,...(owned.restoreDiscardable?{autoDiscardable:true}:{})})}catch{}
  await save({tabs:(state.tabs||[]).filter(t=>t.id!==id)});return true;
 });}
 async function sameMonitorWindow(windowId){try{return Number.isInteger(windowId)&&await monitorWindow()===windowId}catch{return false}}
 // A user-activated or navigated acquisition tab becomes user-owned. Clear our mute marker so a later reload cannot recover it.
 async function relinquish(id){try{const tab=await chrome.tabs.get(id);if(!marked(tab))return;const owned=(await read()).tabs?.find(t=>t.id===id);await chrome.tabs.update(id,{muted:false,...(owned?.restoreDiscardable?{autoDiscardable:true}:{})});await serial(async()=>{const state=await read();await save({tabs:(state.tabs||[]).filter(t=>t.id!==id)})})}catch{}}
 chrome.tabs.onActivated?.addListener(({tabId})=>relinquish(tabId));
 chrome.tabs.onUpdated?.addListener((id,change)=>{if(change.url)read().then(state=>{const owned=(state.tabs||[]).find(t=>t.id===id);if(!owned||!samePage(change.url,owned.url))relinquish(id)}).catch(()=>{})});
 async function isOwned(id){try{const state=await read(),owned=(state.tabs||[]).find(t=>t.id===id),tab=await chrome.tabs.get(id);return !!owned&&!tab.active&&marked(tab)&&samePage(tab.url,owned.url)}catch{return false}}
 root.GlanceQuietTabs={create,release,relinquish,setMonitor,sameMonitorWindow,isOwned};if(typeof module!=='undefined')module.exports=root.GlanceQuietTabs;
})(globalThis);
