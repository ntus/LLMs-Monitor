/* Owned acquisition tabs live in an unfocused minimized window, never the work window. */
(function(root){
 const KEY='llms-quiet-tabs-v1';let queue=Promise.resolve();
 const serial=fn=>{const p=queue.then(fn);queue=p.catch(()=>{});return p};
 const read=async()=>((await chrome.storage.session.get(KEY))[KEY]||{tabs:[]});
 const save=state=>chrome.storage.session.set({[KEY]:state});
 function create(url){return serial(async()=>{
  let state=await read(),win;
  if(state.windowId)try{win=await chrome.windows.get(state.windowId);if(win.state!=='minimized')win=null}catch{}
  if(!win){win=await chrome.windows.create({url:'about:blank',type:'normal',state:'minimized',focused:false});state={windowId:win.id,blankId:win.tabs?.[0]?.id,tabs:[]};await save(state);}
  if(state.tabs.length>=12)throw Error("Quiet acquisition capacity reached");
  const tab=await chrome.tabs.create({url,windowId:win.id,active:false});state.tabs.push({id:tab.id,url});await save(state);
  try{await chrome.tabs.update(tab.id,{muted:true})}catch{}
  return tab;
 });}
 function release(id){return serial(async()=>{
  const state=await read(),owned=state.tabs.find(t=>t.id===id);if(!owned)return false;
  state.tabs=state.tabs.filter(t=>t.id!==id);let win,tab;
  try{win=await chrome.windows.get(state.windowId,{populate:true});tab=win.tabs?.find(t=>t.id===id)}catch{}
  if(win&&win.state==='minimized'&&tab&&(tab.url===owned.url||tab.pendingUrl===owned.url)){
   await chrome.tabs.remove(id);
   const others=(win.tabs||[]).filter(t=>t.id!==id&&t.id!==state.blankId);
   if(!others.length&&!state.tabs.length){await chrome.windows.remove(state.windowId);await chrome.storage.session.remove(KEY);return true;}
  }else if(win){await chrome.storage.session.remove(KEY);return true;}
  await save(state);return true;
 });}
 root.GlanceQuietTabs={create,release};if(typeof module!=='undefined')module.exports=root.GlanceQuietTabs;
})(globalThis);
