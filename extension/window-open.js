(function(root){
 async function createNormalTab(browser,url){
  let windowId;
  try{const win=await browser.windows.getLastFocused({windowTypes:['normal']});if(win?.type==='normal')windowId=win.id}catch{}
  if(!Number.isInteger(windowId))try{const windows=await browser.windows.getAll({windowTypes:['normal']});windowId=windows[0]?.id}catch{}
  const tab=await browser.tabs.create({url,active:true,...(Number.isInteger(windowId)?{windowId}:{})});
  return {ok:true,tabId:tab.id};
 }
 root.GlanceWindows={createNormalTab};if(typeof module!=='undefined')module.exports=root.GlanceWindows;
})(globalThis);
