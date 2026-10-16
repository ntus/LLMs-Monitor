/* Automatic acquisition never creates, focuses, minimizes or closes a window. */
(function(root){
 const KEY='llms-quiet-tabs-v1';let queue=Promise.resolve();
 const serial=fn=>{const p=queue.then(fn);queue=p.catch(()=>{});return p};
 const samePage=(actual,expected)=>actual===expected||expected==='https://claude.ai/settings/usage'&&actual==='https://claude.ai/new#settings/usage';
 const read=async()=>((await chrome.storage.session.get(KEY))[KEY]||{tabs:[]});
 const save=state=>chrome.storage.session.set({[KEY]:state});
 function create(url){return serial(async()=>{
  const state=await read();
  // Explicit windowId is essential: Chrome may otherwise choose a popup or open a window.
  const windows=await chrome.windows.getAll({windowTypes:['normal']});
  const win=windows.find(w=>w.type==='normal'&&w.incognito!==true&&w.state!=='minimized')||windows.find(w=>w.type==='normal'&&w.incognito!==true);
  if(!Number.isInteger(win?.id))throw Error('No normal browser window; automatic acquisition skipped');
  const live=[];for(const owned of state.tabs||[])try{await chrome.tabs.get(owned.id);live.push(owned)}catch{}
  if(live.length>=12)throw Error('Quiet acquisition capacity reached');
  const tab=await chrome.tabs.create({url,windowId:win.id,active:false});
  if(!Number.isInteger(tab?.id))throw Error('Acquisition tab unavailable');
  try{await save({tabs:[...live,{id:tab.id,url}]})}catch(error){try{const current=await chrome.tabs.get(tab.id);if(!current.active&&samePage(current.url||current.pendingUrl,url))await chrome.tabs.remove(tab.id)}catch{}throw error;}
  try{await chrome.tabs.update(tab.id,{muted:true})}catch{}
  return tab;
 });}
 function release(id){return serial(async()=>{
  const state=await read(),owned=(state.tabs||[]).find(t=>t.id===id);if(!owned)return false;
  // Keep user-activated/navigated tabs; never delete a whole window or its blank tab.
  try{const tab=await chrome.tabs.get(id);if(!tab.active&&(samePage(tab.url,owned.url)||!tab.url&&samePage(tab.pendingUrl,owned.url)))await chrome.tabs.remove(id)}catch{}
  await save({tabs:(state.tabs||[]).filter(t=>t.id!==id)});return true;
 });}
 root.GlanceQuietTabs={create,release};if(typeof module!=='undefined')module.exports=root.GlanceQuietTabs;
})(globalThis);
