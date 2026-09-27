const panel=document.querySelector('#floating-widget');
async function sync(){try{const result=await chrome.runtime.sendMessage({type:'GET'});Glance.observe(result.data||{});panel.innerHTML=Glance.widget(result.data||{});panel.style.setProperty('--alpha',(result.settings?.opacity??55)/100);document.documentElement.dataset.theme=result.settings?.theme==='standard'?'standard':'dark';}catch{panel.textContent='拡張機能へ接続できません';}}
document.querySelector('#floating-refresh').onclick=async()=>{await chrome.runtime.sendMessage({type:'REFRESH'});await sync();};
document.querySelector('#floating-monitor').onclick=()=>chrome.tabs.create({url:chrome.runtime.getURL('index.html')});
sync();setInterval(sync,2000);
