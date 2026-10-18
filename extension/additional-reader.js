(()=>{
 if(globalThis.llmsAdditionalReader==='1.52.0')return;globalThis.llmsAdditionalReader='1.52.0';
 const A=GlanceAdditional;let last=0,timer;
 async function read(){const id=A.route(location.href);if(!id||Date.now()-last<1500)return;last=Date.now();try{const grant=await chrome.runtime.sendMessage({type:'ADDITIONAL_READER_STATUS',service:id});if(grant?.enabled!==true)return;const quota=id==='grok'?GlanceGrokQuota.collect(document):null,rows=id==='grok'?[]:A.extract(document.body.innerText,id);await chrome.runtime.sendMessage({type:'ADDITIONAL_SNAPSHOT',service:id,rows,...(quota?{quota}:{})})}catch{}}
 chrome.runtime.onMessage.addListener((m,_,reply)=>{if(m?.type!=='ADDITIONAL_READ')return false;last=0;read().then(()=>reply({ready:true}),()=>reply({ready:false}));return true});
 new MutationObserver(()=>{clearTimeout(timer);timer=setTimeout(read,1500)}).observe(document.body,{subtree:true,childList:true,characterData:true});setTimeout(read,1500);setInterval(read,60000);
})();
