/* Explicit restart only, after a Web monitor has committed in the same tab. */
(function(root){
 const allowed=sender=>sender.id===chrome.runtime.id&&sender.frameId===0&&Number.isInteger(sender.tab?.id)&&['index.html','setup.html','codex-setup.html','tibo-setup.html'].some(p=>sender.url===chrome.runtime.getURL(p)||p==='index.html'&&sender.url===chrome.runtime.getURL(p)+'#setup');
 async function restart(sender){
  if(!allowed(sender))return {ok:false};const id=sender.tab.id,url='https://llmsmonitor.ntus.info/#setup';let timer,done=false;
  const cleanup=()=>{clearTimeout(timer);chrome.tabs.onUpdated.removeListener(onUpdate)};
  function onUpdate(tabId,change,tab){if(tabId!==id||done)return;if(change.status==='complete'&&tab.url===url){done=true;cleanup();chrome.runtime.reload()}}
  chrome.tabs.onUpdated.addListener(onUpdate);timer=setTimeout(()=>{done=true;cleanup()},10000);
  try{await chrome.tabs.update(id,{url});const tab=await chrome.tabs.get(id);onUpdate(id,{status:tab.status},tab);return {ok:true};}catch{done=true;cleanup();return {ok:false};}
 }
 root.GlanceRestart={restart};if(typeof module!=='undefined')module.exports=root.GlanceRestart;
})(globalThis);
