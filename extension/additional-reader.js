(()=>{
 if(globalThis.llmsAdditionalReader==='1.54.0')return;globalThis.llmsAdditionalReader='1.54.0';
 const A=GlanceAdditional;let last=0,timer,stableKey="",stableAt=0;
 async function read(){const id=A.route(location.href);if(!id||Date.now()-last<1500)return;last=Date.now();try{const grant=await chrome.runtime.sendMessage({type:'ADDITIONAL_READER_STATUS',service:id});if(grant?.enabled!==true)return;const quota=id==='grok'?GlanceGrokQuota.collect(document):null,rows=id==='grok'?[]:A.extract(document.body.innerText,id);if(id==='grok'&&quota?.status==='ready'){const key=JSON.stringify(quota.windows);if(key!==stableKey){stableKey=key;stableAt=Date.now();clearTimeout(timer);timer=setTimeout(()=>{last=0;read()},1800);return;}if(Date.now()-stableAt<1500)return;}else if(id==='grok'){stableKey='';stableAt=0;}await chrome.runtime.sendMessage({type:'ADDITIONAL_SNAPSHOT',service:id,rows,readerVersion:'1.54.0',...(quota?{quota}:{})})}catch{}}
 chrome.runtime.onMessage.addListener((m,_,reply)=>{if(m?.type!=='ADDITIONAL_READ')return false;last=0;read().then(()=>reply({ready:true,version:'1.54.0'}),()=>reply({ready:false}));return true});
 new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(read,1500)}).observe(document.body,{subtree:true,childList:true,characterData:true});setTimeout(read,1500);setInterval(read,60000);
})();
