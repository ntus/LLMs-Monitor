(function(root){
 async function createNormalTab(browser,url){
  // Reuse an exact main/setup page on explicit clicks; never navigate or close unrelated tabs.
  const own=browser.runtime?.getURL?.(''),managed=own&&url.startsWith(own)&&/^(?:index|setup|api-setup|tibo-setup|codex-setup)\.html(?:#setup)?$/.test(url.slice(own.length));
  if(managed&&browser.tabs.query){const tabs=await browser.tabs.query({}),matches=tabs.filter(t=>t.url===url||url===own+'index.html'&&(t.url==='https://llmsmonitor.ntus.info/'||t.url==='https://llmsmonitor.ntusnog.chatgpt.site/'));for(const tab of matches)try{const win=await browser.windows.get(tab.windowId);if(win.type!=='normal')continue;await browser.tabs.update(tab.id,{active:true});await browser.windows.update(win.id,{focused:true});return {ok:true,tabId:tab.id}}catch{}}
  let windowId;
  try{const win=await browser.windows.getLastFocused({windowTypes:['normal']});if(win?.type==='normal')windowId=win.id}catch{}
  if(!Number.isInteger(windowId))try{const windows=await browser.windows.getAll({windowTypes:['normal']});windowId=windows[0]?.id}catch{}
  const tab=await browser.tabs.create({url,active:true,...(Number.isInteger(windowId)?{windowId}:{})});
  return {ok:true,tabId:tab.id};
 }
 root.GlanceWindows={createNormalTab};if(typeof module!=='undefined')module.exports=root.GlanceWindows;
})(globalThis);
