/* Dedicated metadata RPC, no quota RPC, audio, private history or provider credentials. */
(function(root){
 const ORIGINS=new Set(['https://llmsmonitor.ntus.info','https://llmsmonitor.ntusnog.chatgpt.site']);
 let inFlight=false;
 function read(service){
  if(!ORIGINS.has(location.origin)||!['chatgpt','claude','gemini'].includes(service))return Promise.resolve({status:'unavailable'});
  let id='';try{id=localStorage.getItem('glance-extension-id')||''}catch{}
  if(!/^[a-p]{32}$/.test(id)||!root.chrome?.runtime?.sendMessage)return Promise.resolve({status:'not-connected'});
  if(inFlight)return Promise.resolve({status:'cooldown'});inFlight=true;
  return new Promise(resolve=>{let finished=false;const finish=result=>{if(finished)return;finished=true;clearTimeout(timer);inFlight=false;resolve(result)},timer=setTimeout(()=>finish({status:'unavailable'}),26000);
   try{chrome.runtime.sendMessage(id,{type:'TASKS_READ',service},result=>{const failed=chrome.runtime.lastError;finish(failed?{status:'unavailable'}:result||{status:'unavailable'})})}catch{finish({status:'unavailable'})}
  });
 }
 root.LLMTaskBridge={read};
})(globalThis);
