/* Gemini fallback reads existing official usage tabs only; no window/tab creation. */
(function(root){
 let pending=null,last=0;
 function route(value){try{const u=new URL(value);return u.origin==='https://gemini.google.com'&&!u.username&&!u.password&&/^\/(?:u\/\d+\/)?usage\/?$/.test(u.pathname)}catch{return false}}
 function bounded(p,ms=1500){let t;return Promise.race([p,new Promise((_,reject)=>t=setTimeout(()=>reject(Error('reader timeout')),ms))]).finally(()=>clearTimeout(t));}
 function recover(){if(pending)return pending;if(Date.now()-last<60000)return Promise.resolve();last=Date.now();pending=(async()=>{
  const existing=await chrome.tabs.query({url:'https://gemini.google.com/*'}),usage=existing.filter(t=>Number.isInteger(t.id)&&route(t.url));
  await Promise.allSettled(usage.slice(0,3).map(t=>bounded(chrome.tabs.sendMessage(t.id,{type:'GLANCE_USAGE_READER_READ'}))));
 })().finally(()=>{pending=null});return pending;}
 root.GlanceUsageRecovery={recover,route};if(typeof module!=='undefined')module.exports=root.GlanceUsageRecovery;
})(globalThis);
